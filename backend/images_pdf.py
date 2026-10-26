"""
Images -> PDF (bot section "🖼 Rasmdan PDF").

While a user has a row in `pdf_drafts`, the photos / image files they send are collected there (Telegram file_ids,
in message order); "✅ PDF yaratish" asks for the file name (stage 'name'), and the name turns them into one PDF: an A4 page per image, portrait or landscape to match
the image, the image fitted inside a small margin. A JPEG that needs no rotation is embedded as it is (no quality
loss); anything else is re-encoded once. Pages are written one by one, so a 50-image PDF does not fill the RAM.
"""
import io
import re
import zlib

from PIL import Image, ImageOps

import db

MAX_IMAGES = 50
A4 = (595.28, 841.89)          # pt
MARGIN = 18                     # pt
MAX_SIDE = 3508                 # px: A4 at 300 dpi
RAW_JPEG_LIMIT = 8 * 1024 * 1024


# ---------- draft (the images collected so far) ----------

async def start(user_id: int):
    """Start (or restart) collecting images for a new PDF."""
    await db.pool().execute("INSERT INTO pdf_drafts (user_id) VALUES ($1) "
                            "ON CONFLICT (user_id) DO UPDATE SET files = '[]', stage = 'collect', created = now()", user_id)


async def stage(user_id: int) -> str | None:
    """None (no draft), 'collect' (images are coming) or 'name' (waiting for the file name)."""
    return await db.pool().fetchval("SELECT stage FROM pdf_drafts WHERE user_id = $1", user_id)


async def set_stage(user_id: int, value: str):
    await db.pool().execute("UPDATE pdf_drafts SET stage = $2 WHERE user_id = $1", user_id, value)


def clean_name(text: str) -> str:
    """The user's file name, safe on every OS: no path / reserved characters, at most 60 characters, no .pdf twice."""
    name = re.sub(r'[\\/:*?"<>|\x00-\x1f]+', " ", text or "")
    name = re.sub(r"\s+", " ", name).strip(" .")
    name = re.sub(r"(?i)\.pdf$", "", name).strip(" .")
    return name[:60].strip(" .")


async def add(user_id: int, file_id: str, message_id: int) -> int | None:
    """Add one image. Returns how many the draft has now, or None when it is already full."""
    return await db.pool().fetchval(
        "UPDATE pdf_drafts SET files = files || $2::jsonb WHERE user_id = $1 AND jsonb_array_length(files) < $3 "
        "RETURNING jsonb_array_length(files)", user_id, [{"file_id": file_id, "message_id": message_id}], MAX_IMAGES)


async def count(user_id: int) -> int:
    return await db.pool().fetchval("SELECT jsonb_array_length(files) FROM pdf_drafts WHERE user_id = $1", user_id) or 0


async def take(user_id: int) -> list[str]:
    """End the draft; its file_ids in the order the user sent them (album parts may arrive out of order)."""
    files = await db.pool().fetchval("DELETE FROM pdf_drafts WHERE user_id = $1 RETURNING files", user_id) or []
    return [f["file_id"] for f in sorted(files, key=lambda f: f["message_id"])]


async def cancel(user_id: int) -> bool:
    """True if there was a draft."""
    return await db.pool().fetchval("DELETE FROM pdf_drafts WHERE user_id = $1 RETURNING 1", user_id) is not None


# ---------- building the PDF ----------

def prepare(data: bytes) -> tuple[bytes, int, int, str]:
    """One image file -> (JPEG bytes, width, height, color space) ready to embed. Raises on a non-image."""
    im = Image.open(io.BytesIO(data))
    im.load()
    upright = im.getexif().get(0x0112, 1) in (0, 1)  # EXIF orientation: no rotation needed
    if im.format == "JPEG" and im.mode in ("RGB", "L") and upright and len(data) <= RAW_JPEG_LIMIT and max(im.size) <= MAX_SIDE * 2:
        return data, im.width, im.height, "DeviceRGB" if im.mode == "RGB" else "DeviceGray"
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P"):  # transparency -> white paper
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, "white"); bg.paste(im, mask=im.getchannel("A")); im = bg
    elif im.mode != "L":
        im = im.convert("RGB")
    if max(im.size) > MAX_SIDE:
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, "JPEG", quality=90, optimize=True)
    return out.getvalue(), im.width, im.height, "DeviceRGB" if im.mode == "RGB" else "DeviceGray"


class PdfWriter:
    """Minimal PDF: one page per JPEG, nothing else. Objects are written as they come."""

    def __init__(self, f):
        self.f, self.offsets, self.pages = f, [], []
        self.f.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        self.offsets += [0, 0]  # 1 = catalog, 2 = page tree: written at the end

    def _obj(self, body: bytes, num: int | None = None) -> int:
        if num is None:
            self.offsets.append(0); num = len(self.offsets)
        self.offsets[num - 1] = self.f.tell()
        self.f.write(b"%d 0 obj\n" % num + body + b"\nendobj\n")
        return num

    def _stream(self, head: str, data: bytes) -> int:
        return self._obj(f"<< {head} /Length {len(data)} >>\nstream\n".encode() + data + b"\nendstream")

    def page(self, jpeg: bytes, w: int, h: int, cs: str):
        pw, ph = A4 if h >= w else A4[::-1]
        s = min((pw - 2 * MARGIN) / w, (ph - 2 * MARGIN) / h)
        dw, dh = w * s, h * s
        img = self._stream(f"/Type /XObject /Subtype /Image /Width {w} /Height {h} /ColorSpace /{cs} "
                           f"/BitsPerComponent 8 /Filter /DCTDecode", jpeg)
        draw = zlib.compress(f"q {dw:.2f} 0 0 {dh:.2f} {(pw - dw) / 2:.2f} {(ph - dh) / 2:.2f} cm /Im0 Do Q".encode())
        content = self._stream("/Filter /FlateDecode", draw)
        self.pages.append(self._obj(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {pw:.2f} {ph:.2f}] "
                                    f"/Resources << /XObject << /Im0 {img} 0 R >> >> /Contents {content} 0 R >>".encode()))

    def close(self):
        kids = " ".join(f"{p} 0 R" for p in self.pages)
        self._obj(f"<< /Type /Pages /Kids [{kids}] /Count {len(self.pages)} >>".encode(), 2)
        self._obj(b"<< /Type /Catalog /Pages 2 0 R >>", 1)
        xref = self.f.tell()
        self.f.write(b"xref\n0 %d\n0000000000 65535 f \n" % (len(self.offsets) + 1))
        for off in self.offsets:
            self.f.write(b"%010d 00000 n \n" % off)
        self.f.write(b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (len(self.offsets) + 1, xref))
