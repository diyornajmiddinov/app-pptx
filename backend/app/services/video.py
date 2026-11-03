"""
The video of an animated deck (Mini App "🎬 Video taqdimot"): an mp4 that plays the deck the way the slide show does.

The animated engine writes <deck>.timeline.json beside the deck (SLIDEAI_TIMELINE=1): per slide its transition and
the entrance steps (shape id, effect, delay, duration). Steps that start together are one moment. For every moment k
a copy of the deck keeps on each slide only the shapes of its first k moments; LibreOffice draws all copies in one
run (one picture per slide per moment). ffmpeg then plays each slide: the empty layout, each moment revealed over the
previous picture with a transition close to its effect (only the new shape differs between two pictures, so a wipe
or a fade reveals just that shape), a pause to read, and the slide's transition to the next one.
"""
import json
import logging
import re
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path

from app.core.locks import machine_lock

log = logging.getLogger("video")

W, H, FPS = 1280, 720, 25
GAP_MS, MAX_MOMENTS = 150, 8                       # steps starting within 150 ms are one moment; at most 8 a slide
TIMEOUT = 600

# the deck's effects and transitions (engine/animated/anim.js) as ffmpeg xfade transitions
_EFFECT = {
    "appear": "fade", "fade": "fade", "dissolve": "dissolve", "focusIn": "fade", "zoomIn": "fade", "growIn": "fade",
    "softGrow": "fade", "popIn": "fade", "stretch": "horzopen", "unfold": "vertopen", "popOver": "fade", "springIn": "fade",
    "spinIn": "fade", "swing": "fade", "swingLeft": "smoothright", "swingRight": "smoothleft",
    "fadeUp": "smoothup", "flyUp": "smoothup", "riseUp": "smoothup", "curveUp": "smoothup", "peekUp": "smoothup",
    "riseSettle": "smoothup", "riseWords": "wiperight", "fadeDown": "smoothdown", "flyDown": "smoothdown",
    "sinkDown": "smoothdown", "drop": "smoothdown", "bounceDrop": "smoothdown", "curveDown": "smoothdown",
    "fadeLeft": "smoothleft", "flyLeft": "smoothleft", "slideLeft": "smoothleft", "arcLeft": "smoothleft",
    "fadeRight": "smoothright", "flyRight": "smoothright", "slideRight": "smoothright", "arcRight": "smoothright",
    "sweepIn": "smoothright", "wipe:r": "wiperight", "wipe:l": "wipeleft", "wipe:u": "wipeup", "wipe:d": "wipedown",
    "split": "vertopen", "splitH": "horzopen", "splitIn": "vertclose", "circle": "circleopen", "diamond": "circleopen",
    "plus": "rectcrop", "box": "rectcrop", "wheel": "radial", "wheel4": "radial", "wedge": "radial",
    "blinds": "hlslice", "blindsV": "vuslice", "checker": "pixelize", "strips": "diagtl", "bars": "hrslice",
    "typeLetters": "wiperight", "fadeLetters": "wiperight", "fadeWords": "wiperight", "wipeWords": "wiperight",
}
_TRANSITION = {
    "fade": "fade", "dissolve": "dissolve", "circle": "circleopen", "diamond": "circleopen", "plus": "rectcrop",
    "zoom": "zoomin", "zoom:out": "fadeblack", "push:u": "slideup", "push:d": "slidedown", "push:l": "slideleft",
    "push:r": "slideright", "pull:l": "slideleft", "pull:r": "slideright", "pull:u": "slideup", "wipe:r": "wiperight",
    "wipe:l": "wipeleft", "wipe:u": "wipeup", "wipe:d": "wipedown", "cover:l": "smoothleft", "cover:u": "smoothup",
    "cover:r": "smoothright", "cover:d": "smoothdown", "split": "vertopen", "split:h": "horzopen", "split:in": "vertclose",
    "blinds": "hlslice", "blinds:v": "vuslice", "checker": "pixelize", "checker:v": "pixelize", "wheel": "radial",
    "wheel:4": "radial", "wedge": "radial", "randomBar": "dissolve", "randomBar:h": "dissolve", "strips": "diagtl",
    "strips:lu": "diagtl", "newsflash": "zoomin", "morph": "fade",
}
_SPEED = {"fast": 0.5, "med": 0.75, "slow": 1.0}


class VideoError(Exception):
    pass


def moments(steps: list[dict]) -> list[dict]:
    """Steps → moments [{start, length, effect, spids}] (seconds), in order; at most MAX_MOMENTS (the closest merge)."""
    out: list[dict] = []
    for s in sorted(steps, key=lambda s: s["delay"]):
        length = max(s.get("span") or 0, s["dur"])
        if out and s["delay"] - out[-1]["_ms"] <= GAP_MS:
            m = out[-1]
            m["spids"].append(s["spid"]); m["_end"] = max(m["_end"], s["delay"] + length)
        else:
            out.append({"_ms": s["delay"], "_end": s["delay"] + length, "effect": s["effect"], "spids": [s["spid"]]})
    while len(out) > MAX_MOMENTS:
        k = min(range(1, len(out)), key=lambda i: out[i]["_ms"] - out[i - 1]["_ms"])
        out[k - 1]["spids"] += out[k]["spids"]; out[k - 1]["_end"] = max(out[k - 1]["_end"], out[k]["_end"])
        del out[k]
    return [{"start": m["_ms"] / 1000, "length": min(max((m["_end"] - m["_ms"]) / 1000, 0.3), 2.0), "effect": m["effect"],
             "spids": m["spids"]} for m in out]


_SHAPE = re.compile(r"<p:(sp|pic|cxnSp|graphicFrame)\b.*?</p:\1>", re.S)
_ID = re.compile(r'<p:cNvPr id="(\d+)"')
_ANIM = re.compile(r"<p:timing>.*?</p:timing>|<mc:AlternateContent[^>]*>(?:(?!</mc:AlternateContent>).)*?<p:transition.*?</mc:AlternateContent>|<p:transition\b.*?</p:transition>", re.S)


def _without(xml: str, hidden: set[int]) -> str:
    """The slide without its animation and without the shapes in `hidden`."""
    xml = _ANIM.sub("", xml)
    if not hidden:
        return xml
    def keep(m: re.Match) -> str:
        i = _ID.search(m.group(0))
        return "" if i and int(i.group(1)) in hidden else m.group(0)
    return _SHAPE.sub(keep, xml)


def _variants(deck: Path, plan: list[list[dict]], out: Path) -> list[tuple[Path, list[int]]]:
    """Copy k (0..max moments) of the deck: each slide shows its first k moments. A copy keeps only the slides it
    changes (k ≤ the slide's moments; copy 0 keeps all), so LibreOffice draws each picture once. → [(copy, its slides)]."""
    with zipfile.ZipFile(deck) as z:
        names = z.namelist()
        files = {n: z.read(n) for n in names}
    rels = files["ppt/_rels/presentation.xml.rels"].decode("utf-8")
    slide_of = {m.group(1): int(m.group(2)) for m in re.finditer(r'Id="(rId\d+)"[^>]*Target="slides/slide(\d+)\.xml"', rels)} | \
               {m.group(2): int(m.group(1)) for m in re.finditer(r'Target="slides/slide(\d+)\.xml"[^>]*Id="(rId\d+)"', rels)}
    pres = files["ppt/presentation.xml"].decode("utf-8")
    out_list = []
    for k in range(max((len(p) for p in plan), default=0) + 1):
        keep = [i for i in range(len(plan)) if k <= len(plan[i])]
        def kept(m: re.Match, keep: list[int] = keep) -> str:
            n = slide_of.get(m.group(1))
            return m.group(0) if n is None or n - 1 in keep else ""
        path = out / f"v{k:02d}.pptx"
        with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
            for n in names:
                m = re.fullmatch(r"ppt/slides/slide(\d+)\.xml", n)
                if m and int(m.group(1)) <= len(plan):
                    hidden = {i for mo in plan[int(m.group(1)) - 1][k:] for i in mo["spids"]}
                    z.writestr(n, _without(files[n].decode("utf-8"), hidden))
                elif n == "ppt/presentation.xml":
                    z.writestr(n, re.sub(r'<p:sldId [^>]*r:id="(rId\d+)"[^>]*/>', kept, pres))
                else:
                    z.writestr(n, files[n])
        out_list.append((path, keep))
    return out_list


def _pictures(variants: list[tuple[Path, list[int]]], out: Path) -> dict[tuple[int, int], Path]:
    """{(k, i): slide i of copy k as a W×H PNG}."""
    with machine_lock("office"), tempfile.TemporaryDirectory(prefix="lo-") as profile:  # one LibreOffice on the server at a time
        subprocess.run(["soffice", f"-env:UserInstallation=file://{profile}", "--headless", "--norestore", "--convert-to", "pdf",
                        "--outdir", str(out), *(str(v) for v, _ in variants)], check=True, capture_output=True, timeout=TIMEOUT)
    pics: dict[tuple[int, int], Path] = {}
    for k, (v, keep) in enumerate(variants):
        pdf = out / f"{v.stem}.pdf"
        if not pdf.exists():
            raise VideoError(f"LibreOffice {v.name} ni chizmadi")
        subprocess.run(["pdftoppm", "-png", "-scale-to-x", str(W), "-scale-to-y", str(H), str(pdf), str(out / v.stem)],
                       check=True, capture_output=True, timeout=TIMEOUT)
        got = sorted(out.glob(f"{v.stem}-*.png"))
        if len(got) != len(keep):
            raise VideoError(f"{v.name}: {len(got)} ta rasm, {len(keep)} ta slayd")
        pics |= {(k, i): g for i, g in zip(keep, got, strict=True)}
    return pics


def _reading(xml: str) -> float:
    """Seconds to read the slide once everything is on it."""
    chars = sum(len(t) for t in re.findall(r"<a:t>([^<]*)</a:t>", xml))
    return min(max(1.5 + chars / 50, 2.5), 6.0)


def _clip(i: int, pics: dict[tuple[int, int], Path], moms: list[dict], prev: Path | None, transition: tuple[str, float],
          hold: float, out: Path) -> Path:
    """Slide i: the previous slide → this one (its transition), then each moment revealed, then the pause. Each
    picture is read only while it is on screen (until the next one has fully come in): fewer frames to decode."""
    tr_name, tr = transition if prev is not None else ("fade", 0.0)
    end = max((m["start"] + m["length"] for m in moms), default=0.0)
    total = tr + end + hold
    starts = [0.0] + [tr + m["start"] for m in moms]                 # when picture k starts coming in
    ends = [tr + m["start"] + m["length"] for m in moms] + [total]  # when picture k+1 is fully in
    inputs: list[tuple[Path, float]] = []
    chain, last = [], None
    if prev is not None and tr > 0:
        inputs.append((prev, tr + 0.1))
    for k in range(len(moms) + 1):
        inputs.append((pics[(k, i)], max(ends[k], starts[k] + 0.2) - starts[k] + 0.1))
    args: list[str] = []
    for path, length in inputs:
        args += ["-loop", "1", "-framerate", str(FPS), "-t", f"{max(length, 0.2):.3f}", "-i", str(path)]
    prep = [f"[{n}:v]fps={FPS},format=yuv420p,setsar=1,settb=AVTB[i{n}]" for n in range(len(inputs))]
    n = 0
    if prev is not None and tr > 0:
        chain.append(f"[i0][i1]xfade=transition={tr_name}:duration={tr:.3f}:offset=0[s1]"); last, n = "s1", 2
    else:
        last, n = "i0", 1
    for k, m in enumerate(moms):
        fx = _EFFECT.get(m["effect"], "fade")
        name = f"s{n + k + 1}"
        chain.append(f"[{last}][i{n + k}]xfade=transition={fx}:duration={m['length']:.3f}:offset={tr + m['start']:.3f}[{name}]")
        last = name
    path = out / f"clip{i:03d}.mp4"
    graph = ";".join(prep + chain) if chain else ";".join(prep)
    subprocess.run(["ffmpeg", "-y", "-v", "error", *args, "-filter_complex", graph, "-map", f"[{last}]", "-t", f"{total:.3f}",
                    "-r", str(FPS), "-c:v", "libx264", "-preset", "veryfast", "-crf", "25", "-pix_fmt", "yuv420p", str(path)],
                   check=True, capture_output=True, timeout=TIMEOUT)
    return path


def make(deck: Path, out: Path | None = None) -> Path:
    """deck.pptx (+ deck.pptx.timeline.json) → deck.mp4. Blocking: run it in a thread. One video on the server at a
    time (LibreOffice and ffmpeg need the memory)."""
    with machine_lock("video"):
        return _make(deck, out or deck.with_suffix(".mp4"))


def _make(deck: Path, out: Path) -> Path:
    timeline = Path(f"{deck}.timeline.json")
    if not timeline.exists():
        raise VideoError("animatsiya jadvali yo'q")
    slides = json.loads(timeline.read_text())["slides"]
    plan = [moments(s["steps"]) for s in slides]
    work = Path(tempfile.mkdtemp(prefix="slideai-video-"))
    try:
        pics = _pictures(_variants(deck, plan, work), work)
        with zipfile.ZipFile(deck) as z:
            texts = [z.read(f"ppt/slides/slide{i + 1}.xml").decode("utf-8") for i in range(len(slides))]
        clips, prev = [], None
        for i, s in enumerate(slides):  # one ffmpeg at a time (it uses both CPUs itself)
            name = s.get("transition") or "fade"
            tr = (_TRANSITION.get(name, "fade"), _SPEED.get(s.get("speed", "med"), 0.75)) if name not in ("none", "cut") else ("fade", 0.0)
            clips.append(_clip(i, pics, plan[i], prev, tr, _reading(texts[i]), work))
            prev = pics[(len(plan[i]), i)]  # the slide as it ends: all its moments shown
        lst = work / "clips.txt"
        lst.write_text("".join(f"file '{c}'\n" for c in clips))
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy",
                        "-movflags", "+faststart", str(out)], check=True, capture_output=True, timeout=TIMEOUT)
        return out
    finally:
        shutil.rmtree(work, ignore_errors=True)
        timeline.unlink(missing_ok=True)
