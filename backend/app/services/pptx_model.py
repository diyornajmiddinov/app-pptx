"""
Reads a .pptx into the model the browser editor draws, with every inherited value already resolved:
theme colours and fonts, the colour map, master / layout placeholder styles, list styles per level,
shape styles (fillRef / lnRef / fontRef), table styles, autofit.

What the browser can draw itself becomes an *element* (editable in place):
    text boxes and placeholders, simple shapes (rect, roundRect, ellipse), lines, pictures, tables.
Everything else (backgrounds, master decorations, groups, charts, SmartArt, custom geometry...) stays in
the slide's *background layer*, a PNG that LibreOffice renders once from a copy without the elements.

All lengths are EMU; font sizes are points. Colours are "#RRGGBB" (+ "alpha" 0..1 where it matters).
"""
import colorsys
import copy
import hashlib

from lxml import etree
from pptx.opc.constants import RELATIONSHIP_TYPE as RT
from pptx.oxml.ns import qn

A = "http://schemas.openxmlformats.org/drawingml/2006/main"
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"a": A, "p": P, "r": R}

SIMPLE_GEOM = {"rect", "roundRect", "ellipse"}
LINE_GEOM = {"line", "straightConnector1"}
WEB_IMAGES = {"png": "png", "jpg": "jpg", "jpeg": "jpg", "gif": "gif", "bmp": "bmp", "webp": "webp", "svg": "svg"}
ALIGN = {"l": "left", "ctr": "center", "r": "right", "just": "justify", "dist": "justify", "justLow": "justify"}
ALIGN_BACK = {v: k for k, v in ALIGN.items() if k in ("l", "ctr", "r", "just")}
COLOR_TAGS = ("srgbClr", "schemeClr", "sysClr", "prstClr", "scrgbClr", "hslClr")
PRESET = {"black": "000000", "white": "FFFFFF", "red": "FF0000", "green": "008000", "blue": "0000FF",
          "yellow": "FFFF00", "gray": "808080", "grey": "808080", "orange": "FFA500", "darkBlue": "00008B"}


def _x(el, path):
    # lxml's own xpath: python-pptx elements override .xpath() without a namespaces argument
    return etree._Element.xpath(el, path, namespaces=NS) if el is not None else []


def _first(el, path):
    r = _x(el, path)
    return r[0] if r else None


# ---------------------------------------------------------------- colours

def _apply_mods(rgb: str, el) -> tuple[str, float]:
    r, g, b = (int(rgb[i:i + 2], 16) / 255 for i in (0, 2, 4))
    alpha = 1.0
    for m in el:
        tag, val = etree.QName(m).localname, m.get("val")
        if val is None:
            continue
        v = int(val) / 100000
        if tag == "alpha":
            alpha = v
        elif tag in ("lumMod", "lumOff", "satMod"):
            h, l, s = colorsys.rgb_to_hls(r, g, b)
            if tag == "lumMod":
                l *= v
            elif tag == "lumOff":
                l += v
            else:
                s *= v
            r, g, b = colorsys.hls_to_rgb(h, min(1, max(0, l)), min(1, max(0, s)))
        elif tag == "tint":  # towards white
            r, g, b = (c + (1 - c) * (1 - v) for c in (r, g, b))
        elif tag == "shade":  # towards black
            r, g, b = (c * v for c in (r, g, b))
    return "#" + "".join(f"{round(min(1, max(0, c)) * 255):02X}" for c in (r, g, b)), alpha


class Theme:
    """Theme colours / fonts / defaults of one slide master, plus its colour map."""

    def __init__(self, master):
        self.colors, self.major, self.minor = {}, "Calibri Light", "Calibri"
        self.tx_def = self.sp_def = None
        self.line_widths = []
        try:
            part = master.part.part_related_by(RT.THEME)
            th = etree.fromstring(part.blob)
        except Exception:
            th = None
        if th is not None:
            for c in _x(th, ".//a:clrScheme/*"):
                srgb, sysc = _first(c, "a:srgbClr"), _first(c, "a:sysClr")
                if srgb is not None:
                    self.colors[etree.QName(c).localname] = srgb.get("val")
                elif sysc is not None:
                    self.colors[etree.QName(c).localname] = sysc.get("lastClr", "000000")
            self.major = (_first(th, ".//a:majorFont/a:latin") if _first(th, ".//a:majorFont/a:latin") is not None else etree.Element("x")).get("typeface", self.major)
            self.minor = (_first(th, ".//a:minorFont/a:latin") if _first(th, ".//a:minorFont/a:latin") is not None else etree.Element("x")).get("typeface", self.minor)
            self.tx_def, self.sp_def = _first(th, ".//a:objectDefaults/a:txDef"), _first(th, ".//a:objectDefaults/a:spDef")
            self.line_widths = [int(ln.get("w", "9525")) for ln in _x(th, ".//a:lnStyleLst/a:ln")]
        cm = master._element.find(qn("p:clrMap"))
        self.clr_map = dict(cm.attrib) if cm is not None else {"bg1": "lt1", "tx1": "dk1", "bg2": "lt2", "tx2": "dk2"}

    def color(self, holder, ph: tuple | None = None) -> tuple[str, float] | None:
        """Colour of an element that holds one colour child (solidFill, fontRef, gs, buClr...)."""
        if holder is None:
            return None
        el = next((c for c in holder if etree.QName(c).localname in COLOR_TAGS), None)
        if el is None:
            return None
        tag = etree.QName(el).localname
        if tag == "srgbClr":
            rgb = el.get("val", "000000")
        elif tag == "sysClr":
            rgb = el.get("lastClr", "000000")
        elif tag == "prstClr":
            rgb = PRESET.get(el.get("val"), "000000")
        elif tag == "schemeClr":
            val = el.get("val")
            if val == "phClr":
                if not ph:
                    return None
                rgb = ph[0].lstrip("#")
            else:
                rgb = self.colors.get(self.clr_map.get(val, val), self.colors.get(val, "000000"))
        else:  # scrgb / hsl: rare, approximate as black
            rgb = "000000"
        return _apply_mods(rgb, el)

    def font(self, name: str | None) -> str | None:
        if not name:
            return None
        if name.startswith("+mj"):
            return self.major
        if name.startswith("+mn"):
            return self.minor
        return name


# ---------------------------------------------------------------- style sources

class Ctx:
    """Everything one slide needs to resolve inherited values."""

    def __init__(self, prs, slide):
        self.prs, self.slide = prs, slide
        self.layout = slide.slide_layout
        self.master = self.layout.slide_master
        self.theme = Theme(self.master)
        self.default_style = prs._element.find(qn("p:defaultTextStyle"))
        tx = self.master._element.find(qn("p:txStyles"))
        self.tx_styles = {k: (tx.find(qn(f"p:{k}")) if tx is not None else None) for k in ("titleStyle", "bodyStyle", "otherStyle")}
        try:
            self.table_styles = etree.fromstring(prs.part.part_related_by(RT.TABLE_STYLES).blob)
        except Exception:
            self.table_styles = None

    @staticmethod
    def _ph_of(el):
        return _first(el, "./*[1]/p:nvPr/p:ph")

    def _find_ph(self, container, ph_type, ph_idx):
        """Matching placeholder in a layout / master: by idx first, then by type (ctrTitle ~ title, subTitle / obj ~ body)."""
        cands = [(sp, self._ph_of(sp)) for sp in container._element.cSld.spTree.iter(qn("p:sp"))]
        cands = [(sp, ph) for sp, ph in cands if ph is not None]
        if ph_idx is not None:
            for sp, ph in cands:
                if ph.get("idx") == ph_idx:
                    return sp
        t = ph_type or "obj"
        alts = {t, {"ctrTitle": "title", "subTitle": "body", "obj": "body"}.get(t, t)}
        for sp, ph in cands:
            if (ph.get("type") or "obj") in alts or ((ph.get("type") or "body") in alts):
                return sp
        return None

    def sources(self, el):
        """[(lstStyle-like element)] from most to least specific, plus inherited bodyPr / spPr holders."""
        lst, bodies, sps = [], [], []
        tx = el.find(qn("p:txBody"))
        if tx is not None:
            lst.append(tx.find(qn("a:lstStyle"))); bodies.append(tx.find(qn("a:bodyPr")))
        ph = self._ph_of(el)
        kind = "other"
        if ph is not None:
            ph_type, ph_idx = ph.get("type"), ph.get("idx")
            kind = "title" if ph_type in ("title", "ctrTitle") else "body" if ph_type in (None, "body", "subTitle", "obj") else "other"
            for container in (self.layout, self.master):
                sp = self._find_ph(container, ph_type, ph_idx if container is self.layout else None)
                if sp is not None:
                    t2 = sp.find(qn("p:txBody"))
                    if t2 is not None:
                        lst.append(t2.find(qn("a:lstStyle"))); bodies.append(t2.find(qn("a:bodyPr")))
                    sps.append(sp.find(qn("p:spPr")))
            lst.append(self.tx_styles[f"{kind}Style"])
        else:
            is_txbox = _first(el, "./p:nvSpPr/p:cNvSpPr[@txBox='1']") is not None
            d = self.theme.tx_def if is_txbox else self.theme.sp_def
            if d is not None:
                lst.append(d.find(qn("a:lstStyle"))); bodies.append(d.find(qn("a:bodyPr")))
            lst.append(self.default_style)
            lst.append(self.tx_styles["otherStyle"])
        return [x for x in lst if x is not None], [x for x in bodies if x is not None], [x for x in sps if x is not None], kind


def _lvl(src, level):
    if src is None:
        return None
    return src.find(qn(f"a:lvl{level + 1}pPr"))


def _pick_attr(chain, name):
    for el in chain:
        if el is not None and el.get(name) is not None:
            return el.get(name)
    return None


def _pick_child(chain, name):
    for el in chain:
        if el is not None:
            c = el.find(qn(f"a:{name}"))
            if c is not None:
                return c
    return None


def _spacing(el):
    if el is None:
        return None
    pct, pts = el.find(qn("a:spcPct")), el.find(qn("a:spcPts"))
    if pct is not None:
        return {"pct": int(pct.get("val", "100000")) / 100000}
    if pts is not None:
        return {"pt": int(pts.get("val", "0")) / 100}
    return None


# ---------------------------------------------------------------- text

def _run_props(ctx, rpr, chain, font_ref_color, style_color=None):
    """Effective run properties: explicit rPr, then each level's defRPr down the chain.
    style_color (a table style's text colour) beats the inherited defaults but not the run's own colour."""
    els = [rpr] + [c.find(qn("a:defRPr")) if c is not None else None for c in chain]
    sz = _pick_attr(els, "sz")
    b, i, u, strike, base = (_pick_attr(els, k) for k in ("b", "i", "u", "strike", "baseline"))
    color = None
    if style_color and (rpr is None or rpr.find(qn("a:solidFill")) is None):
        color = style_color
    for el in (els if color is None else []):
        if el is None:
            continue
        fill = el.find(qn("a:solidFill"))
        if fill is not None:
            color = ctx.theme.color(fill); break
        if el.find(qn("a:noFill")) is not None:
            color = ("#000000", 0.0); break
    if color is None:
        color = font_ref_color or ctx.theme.color(etree.fromstring(f'<a:x xmlns:a="{A}"><a:schemeClr val="tx1"/></a:x>'))
    latin = _pick_child(els, "latin")
    font = ctx.theme.font(latin.get("typeface") if latin is not None else None) or ctx.theme.minor
    return {"sz": int(sz) / 100 if sz else 18.0, "b": b in ("1", "true"), "i": i in ("1", "true"),
            "u": bool(u and u != "none"), "s": bool(strike and strike != "noStrike"),
            "color": color[0], "font": font, **({"baseline": int(base) / 1000} if base and base != "0" else {})}


def _bullet(ctx, chain):
    for el in chain:
        if el is None:
            continue
        if el.find(qn("a:buNone")) is not None:
            return None
        ch, auto = el.find(qn("a:buChar")), el.find(qn("a:buAutoNum"))
        if ch is not None or auto is not None:
            font = _pick_child(chain, "buFont")
            clr = _pick_child(chain, "buClr")
            szp = _pick_child(chain, "buSzPct")
            out = {"font": ctx.theme.font(font.get("typeface")) if font is not None else None,
                   "color": ctx.theme.color(clr)[0] if clr is not None and ctx.theme.color(clr) else None,
                   "size": int(szp.get("val", "100000")) / 100000 if szp is not None else 1.0}
            if ch is not None:
                out["char"] = ch.get("char", "•")
            else:
                out["auto"], out["start"] = auto.get("type", "arabicPeriod"), int(auto.get("startAt", "1"))
            return out
    return None


def text_model(ctx, tx_body, lst_sources, body_sources, font_ref_color=None, fallback_size=None, style_color=None):
    """Paragraphs with resolved formatting, and the text body's box settings."""
    bodies = [tx_body.find(qn("a:bodyPr")), *body_sources]
    ins = {k: int(_pick_attr(bodies, k) or d) for k, d in (("lIns", 91440), ("tIns", 45720), ("rIns", 91440), ("bIns", 45720))}
    scale = spacing_cut = 0.0
    fit = "none"
    for b in bodies:
        if b is None:
            continue
        na, sa = b.find(qn("a:normAutofit")), b.find(qn("a:spAutoFit"))
        if na is not None:
            fit, scale, spacing_cut = "shrink", int(na.get("fontScale", "100000")) / 100000, int(na.get("lnSpcReduction", "0")) / 100000
            break
        if sa is not None:
            fit = "grow"; break
        if b.find(qn("a:noAutofit")) is not None:
            break
    paragraphs = []
    for pi, p in enumerate(tx_body.findall(qn("a:p"))):
        ppr = p.find(qn("a:pPr"))
        level = int(ppr.get("lvl", "0")) if ppr is not None else 0
        chain = [ppr] + [_lvl(s, level) for s in lst_sources] + [s.find(qn("a:defPPr")) if s is not None else None for s in lst_sources[-1:]]
        if fallback_size:  # table cells: 18pt unless set
            chain.append(etree.fromstring(f'<a:x xmlns:a="{A}"><a:defRPr sz="{int(fallback_size * 100)}"/></a:x>'))
        runs = []
        for r in p:
            tag = etree.QName(r).localname
            if tag in ("r", "fld"):
                t = r.find(qn("a:t"))
                runs.append({"t": t.text if t is not None and t.text else "", **_run_props(ctx, r.find(qn("a:rPr")), chain, font_ref_color, style_color)})
            elif tag == "br":
                runs.append({"br": True, **_run_props(ctx, r.find(qn("a:rPr")), chain, font_ref_color, style_color)})
        end = _run_props(ctx, p.find(qn("a:endParaRPr")), chain, font_ref_color, style_color)
        para = {"src": pi, "level": level, "align": ALIGN.get(_pick_attr(chain, "algn") or "l", "left"),
                "marL": int(_pick_attr(chain, "marL") or 0), "indent": int(_pick_attr(chain, "indent") or 0),
                "lnSpc": _spacing(_pick_child(chain, "lnSpc")), "spcBef": _spacing(_pick_child(chain, "spcBef")),
                "spcAft": _spacing(_pick_child(chain, "spcAft")), "bullet": _bullet(ctx, chain),
                "runs": runs, "end": {k: end[k] for k in ("sz", "font", "color", "b", "i")}}
        paragraphs.append(para)
    anchor = _pick_attr(bodies, "anchor") or "t"
    wrap = _pick_attr(bodies, "wrap") or "square"
    return {"paragraphs": paragraphs, "body": {**ins, "anchor": anchor, "wrap": wrap != "none", "fit": fit,
                                               "scale": scale or 1, "spcCut": spacing_cut}}


# ---------------------------------------------------------------- shapes

def _fill(ctx, sppr, style, inherited_sps):
    """CSS-ready fill: None (transparent), {"color", "alpha"} or {"gradient": [...], "angle"}; False = unsupported."""
    for holder in [sppr, *inherited_sps]:
        if holder is None:
            continue
        if holder.find(qn("a:noFill")) is not None:
            return None
        sf = holder.find(qn("a:solidFill"))
        if sf is not None:
            c = ctx.theme.color(sf)
            return {"color": c[0], "alpha": c[1]} if c else None
        gf = holder.find(qn("a:gradFill"))
        if gf is not None:
            stops = [(int(gs.get("pos", "0")) / 1000, ctx.theme.color(gs)) for gs in _x(gf, "a:gsLst/a:gs")]
            lin = gf.find(qn("a:lin"))
            return {"gradient": [{"pos": pos, "color": c[0], "alpha": c[1]} for pos, c in stops if c],
                    "angle": int(lin.get("ang", "0")) / 60000 if lin is not None else 90}
        if holder.find(qn("a:blipFill")) is not None or holder.find(qn("a:pattFill")) is not None or holder.find(qn("a:grpFill")) is not None:
            return False
    ref = style.find(qn("a:fillRef")) if style is not None else None
    if ref is not None and ref.get("idx", "0") not in ("0", "1000"):
        c = ctx.theme.color(ref)
        return {"color": c[0], "alpha": c[1]} if c else None
    return None


def _line(ctx, sppr, style, inherited_sps):
    for holder in [sppr, *inherited_sps]:
        ln = holder.find(qn("a:ln")) if holder is not None else None
        if ln is None:
            continue
        if ln.find(qn("a:noFill")) is not None:
            return None
        sf = ln.find(qn("a:solidFill"))
        c = ctx.theme.color(sf) if sf is not None else None
        if c is None:
            ref = style.find(qn("a:lnRef")) if style is not None else None
            c = ctx.theme.color(ref) if ref is not None and ref.get("idx", "0") != "0" else None
        if c is None:
            return None
        dash = _first(ln, "a:prstDash")
        return {"color": c[0], "alpha": c[1], "w": int(ln.get("w", "12700")),
                "dash": dash is not None and dash.get("val") not in (None, "solid")}
    ref = style.find(qn("a:lnRef")) if style is not None else None
    if ref is not None and ref.get("idx", "0") != "0":
        c = ctx.theme.color(ref)
        idx = int(ref.get("idx")) - 1
        w = ctx.theme.line_widths[idx] if 0 <= idx < len(ctx.theme.line_widths) else 12700
        return {"color": c[0], "alpha": c[1], "w": w, "dash": False} if c else None
    return None


def _xfrm(sh):
    xf = _first(sh._element, ".//a:xfrm") if sh._element.tag != qn("p:graphicFrame") else sh._element.find(qn("p:xfrm"))
    return {"x": sh.left or 0, "y": sh.top or 0, "w": sh.width or 0, "h": sh.height or 0,
            "rot": (int(xf.get("rot", "0")) / 60000) if xf is not None else 0,
            "flipH": xf is not None and xf.get("flipH") == "1", "flipV": xf is not None and xf.get("flipV") == "1"}


def _image(sh, el):
    blip = _first(el, ".//a:blip")
    rid = blip.get(qn("r:embed")) if blip is not None else None
    if not rid:
        return None
    try:
        part = sh.part.related_part(rid)
    except KeyError:
        return None
    ext = WEB_IMAGES.get(part.partname.ext.lower())
    if not ext:
        return None  # emf / wmf / tiff: browsers cannot show them, keep in the background layer
    src = _first(el, ".//a:srcRect")
    crop = {k: int(src.get(k, "0")) / 100000 for k in ("l", "t", "r", "b")} if src is not None else {"l": 0, "t": 0, "r": 0, "b": 0}
    return {"sha1": hashlib.sha1(part.blob).hexdigest(), "ext": ext, "blob": part.blob, "crop": crop}


# PowerPoint's built-in table styles are not written into the file (only their id). The common ones:
_MEDIUM2 = {"{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}": "accent1", "{21E4AEA4-8DFA-4A89-87EB-49C32662AFE8}": "accent2",
            "{F5AB1C69-6EDB-4FF4-983F-18BD219EF322}": "accent3", "{00A15C55-8517-42AA-B614-E9B94910E393}": "accent4",
            "{7DF18680-E054-41AD-8BC1-D1AEF772440D}": "accent5", "{93296810-A885-4BE3-A3E7-6D5BEEA58F35}": "accent6",
            "{073A0DAA-6AF3-43AB-8588-CEC1D06C72B9}": "dk1"}
_NO_STYLE = {"{2D5ABB26-0587-4C30-8999-92F81FD0307C}", "{5940675A-B579-460E-94D1-54222C63F5DA}"}


def _builtin_table_style(style_id: str):
    """Medium Style 2 (PowerPoint's default) for its accent ids and for unknown ids; None for the "no style" ones."""
    if style_id in _NO_STYLE:
        return None
    acc = _MEDIUM2.get(style_id, "accent1")
    clr = lambda extra="": f'<a:schemeClr val="{acc}">{extra}</a:schemeClr>'
    head = f'<a:tcTxStyle b="on"><a:schemeClr val="lt1"/></a:tcTxStyle><a:tcStyle><a:fill><a:solidFill>{clr()}</a:solidFill></a:fill></a:tcStyle>'
    xml = (f'<a:tblStyle xmlns:a="{A}">'
           f'<a:wholeTbl><a:tcTxStyle><a:schemeClr val="dk1"/></a:tcTxStyle><a:tcStyle><a:tcBdr><a:insideH><a:ln w="12700"><a:solidFill>'
           f'<a:schemeClr val="lt1"/></a:solidFill></a:ln></a:insideH></a:tcBdr><a:fill><a:solidFill>{clr("<a:tint val=\"20000\"/>")}'
           f'</a:solidFill></a:fill></a:tcStyle></a:wholeTbl>'
           f'<a:band1H><a:tcStyle><a:fill><a:solidFill>{clr("<a:tint val=\"40000\"/>")}</a:solidFill></a:fill></a:tcStyle></a:band1H>'
           f'<a:band1V><a:tcStyle><a:fill><a:solidFill>{clr("<a:tint val=\"40000\"/>")}</a:solidFill></a:fill></a:tcStyle></a:band1V>'
           f'<a:firstRow>{head}</a:firstRow><a:lastRow>{head}</a:lastRow><a:firstCol>{head}</a:firstCol><a:lastCol>{head}</a:lastCol></a:tblStyle>')
    return etree.fromstring(xml)


def _table(ctx, el):
    tbl = _first(el, ".//a:tbl")
    tblpr = tbl.find(qn("a:tblPr"))
    flags = {k: tblpr is not None and tblpr.get(k) == "1" for k in ("firstRow", "lastRow", "firstCol", "lastCol", "bandRow", "bandCol")}
    style_id = _first(tblpr, "a:tableStyleId")
    style = None
    if style_id is not None and style_id.text:
        if ctx.table_styles is not None:
            style = _first(ctx.table_styles, f".//a:tblStyle[@styleId='{style_id.text}']")
        if style is None:
            style = _builtin_table_style(style_id.text.strip())

    def part_style(name):
        return style.find(qn(f"a:{name}")) if style is not None else None

    def style_fill(part):
        f = _first(part, "a:tcStyle/a:fill/a:solidFill")
        if f is None:
            ref = _first(part, "a:tcStyle/a:fillRef")
            c = ctx.theme.color(ref) if ref is not None else None
        else:
            c = ctx.theme.color(f)
        return {"color": c[0], "alpha": c[1]} if c else None

    def style_text(part):
        ts = _first(part, "a:tcTxStyle")
        if ts is None:
            return {}
        c = ctx.theme.color(ts)
        return {**({"color": c[0]} if c else {}), **({"b": True} if ts.get("b") == "on" else {})}

    border = None
    bline = _first(part_style("wholeTbl"), "a:tcStyle/a:tcBdr/a:insideH/a:ln") if style is not None else None
    if bline is not None and bline.find(qn("a:noFill")) is None:
        c = ctx.theme.color(bline.find(qn("a:solidFill")))
        border = {"color": c[0], "w": int(bline.get("w", "12700"))} if c else None
    lst, _, _, _ = ctx.sources(el)
    cols = [int(g.get("w", "0")) for g in _x(tbl, "a:tblGrid/a:gridCol")]
    rows_xml = tbl.findall(qn("a:tr"))
    rows = []
    for ri, tr in enumerate(rows_xml):
        cells: list[dict | None] = []  # None: covered by a merged neighbour
        for ci, tc in enumerate(tr.findall(qn("a:tc"))):
            if tc.get("hMerge") == "1" or tc.get("vMerge") == "1":
                cells.append(None); continue
            parts = ["wholeTbl"]
            if flags["bandRow"] and not (flags["firstRow"] and ri == 0):
                parts.append("band1H" if (ri - (1 if flags["firstRow"] else 0)) % 2 == 0 else "band2H")
            if flags["bandCol"]:
                parts.append("band1V" if ci % 2 == 0 else "band2V")
            if flags["firstCol"] and ci == 0:
                parts.append("firstCol")
            if flags["lastCol"] and ci == len(cols) - 1:
                parts.append("lastCol")
            if flags["firstRow"] and ri == 0:
                parts.append("firstRow")
            if flags["lastRow"] and ri == len(rows_xml) - 1:
                parts.append("lastRow")
            fill, tstyle = None, {}
            for name in parts:
                ps = part_style(name)
                if ps is None:
                    continue
                f = style_fill(ps)
                fill = f or fill
                tstyle.update(style_text(ps))
            tcpr = tc.find(qn("a:tcPr"))
            own = _fill(ctx, tcpr, None, []) if tcpr is not None and (tcpr.find(qn("a:solidFill")) is not None or tcpr.find(qn("a:noFill")) is not None) else None
            if own is not None or (tcpr is not None and tcpr.find(qn("a:noFill")) is not None):
                fill = own
            color_default = (tstyle["color"], 1) if "color" in tstyle else None
            tx = tc.find(qn("a:txBody"))
            tm = text_model(ctx, tx, [tx.find(qn("a:lstStyle")), *lst] if tx is not None and tx.find(qn("a:lstStyle")) is not None else lst,
                            [], None, fallback_size=18, style_color=color_default) if tx is not None else {"paragraphs": [], "body": {}}
            if tstyle.get("b"):
                for p in tm["paragraphs"]:
                    for r in p["runs"]:
                        r["b"] = True
            mar = {k: int(tcpr.get(k, d)) if tcpr is not None else d for k, d in (("marL", 91440), ("marR", 91440), ("marT", 45720), ("marB", 45720))}
            cells.append({"r": ri, "c": ci, "span": int(tc.get("gridSpan", "1")), "rspan": int(tc.get("rowSpan", "1")),
                          "fill": fill, "anchor": tcpr.get("anchor", "t") if tcpr is not None else "t", "mar": mar,
                          "paragraphs": tm["paragraphs"]})
        rows.append({"h": int(tr.get("h", "0")), "cells": cells})
    return {"cols": cols, "rows": rows, "border": border}


def element(ctx, sh) -> dict | None:
    """The browser-drawable model of one top-level shape, or None if it stays in the background layer."""
    el = sh._element
    tag = etree.QName(el).localname
    box = {"id": sh.shape_id, "name": sh.name, **_xfrm(sh)}
    style = el.find(qn("p:style"))
    font_ref = style.find(qn("a:fontRef")) if style is not None else None
    font_ref_color = ctx.theme.color(font_ref) if font_ref is not None else None
    if tag == "pic":
        geom = _first(el, "p:spPr/a:prstGeom")
        prst = geom.get("prst") if geom is not None else "rect"
        img = _image(sh, el)
        if img is None or prst not in SIMPLE_GEOM or _first(el, "p:spPr/a:custGeom") is not None:
            return None
        return {**box, "kind": "picture", "geom": prst, "img": img, "line": _line(ctx, el.find(qn("p:spPr")), style, [])}
    if tag == "graphicFrame":
        if _first(el, ".//a:tbl") is None:
            return None  # chart, SmartArt, OLE object
        return {**box, "kind": "table", "table": _table(ctx, el)}
    if tag not in ("sp", "cxnSp"):
        return None  # groups, ink, media
    sppr = el.find(qn("p:spPr"))
    if _first(sppr, "a:custGeom") is not None:
        return None
    lst, bodies, inherited_sps, kind = ctx.sources(el)
    geom = _first(sppr, "a:prstGeom")
    prst = geom.get("prst") if geom is not None else None
    if prst is None:
        geom_inh = next((g for s in inherited_sps for g in _x(s, "a:prstGeom")), None)
        prst = geom_inh.get("prst") if geom_inh is not None else "rect"
    if prst in LINE_GEOM:
        line = _line(ctx, sppr, style, inherited_sps)
        return {**box, "kind": "line", "line": line} if line else None
    if prst not in SIMPLE_GEOM:
        return None
    fill = _fill(ctx, sppr, style, inherited_sps)
    if fill is False:
        return None
    radius = 0
    if prst == "roundRect":
        gd = _first(geom, "a:avLst/a:gd[@name='adj']") if geom is not None else None
        adj = int(gd.get("fmla", "val 16667").split()[-1]) if gd is not None else 16667
        radius = min(box["w"], box["h"]) * adj / 100000
    out = {**box, "kind": "shape", "geom": prst, "radius": radius, "fill": fill, "line": _line(ctx, sppr, style, inherited_sps),
           "placeholder": kind if ctx._ph_of(el) is not None else None}
    tx = el.find(qn("p:txBody"))
    if tx is not None:
        out["text"] = text_model(ctx, tx, lst, bodies, font_ref_color)
        txt = "".join(r.get("t", "") for p in out["text"]["paragraphs"] for r in p["runs"])
        if not txt.strip() and out["placeholder"]:
            out["emptyPh"] = True  # PowerPoint shows "click to add text" only while editing
        if _first(el, "./p:nvSpPr/p:cNvSpPr[@txBox='1']") is not None or out["placeholder"]:
            out["kind"] = "text"
    return out


def slide_model(prs, slide) -> tuple[list[dict], set[int], str | None]:
    """(elements, ids of those elements, explicit solid background colour)."""
    ctx = Ctx(prs, slide)
    elements = []
    for sh in slide.shapes:
        try:
            e = element(ctx, sh)
        except Exception:  # anything unexpected in a file: keep the shape in the background layer
            e = None
        if e is not None:
            elements.append(e)
    bg = None
    bgpr = _first(slide._element, "p:cSld/p:bg/p:bgPr")
    if bgpr is not None and bgpr.find(qn("a:solidFill")) is not None:
        c = ctx.theme.color(bgpr.find(qn("a:solidFill")))
        bg = c[0] if c else None
    return elements, {e["id"] for e in elements}, bg


def strip(slide_el, ids: set[int]):
    """Remove the drawable elements (by shape id) from a slide's XML: what is left is the background layer."""
    tree = slide_el.find(qn("p:cSld")).find(qn("p:spTree"))
    for el in list(tree):
        cid = _first(el, "./*[1]/p:cNvPr")
        if cid is not None and cid.get("id") and int(cid.get("id")) in ids:
            tree.remove(el)


def background_key(slide, ids: set[int]) -> str:
    el = copy.deepcopy(slide._element)
    strip(el, ids)
    if "show" in el.attrib:
        del el.attrib["show"]
    h = hashlib.sha1(etree.tostring(el))
    h.update(str(slide.slide_layout.part.partname).encode())
    return h.hexdigest()[:20]
