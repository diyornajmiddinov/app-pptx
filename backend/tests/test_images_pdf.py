"""Images -> PDF: page per image, orientation, JPEG passthrough, odd inputs."""
import io
import subprocess

import pytest
from PIL import Image

import images_pdf as pdfs


def img(mode, size, fmt, exif_orient=None):
    b = io.BytesIO(); kw = {}
    if exif_orient:
        ex = Image.Exif(); ex[0x0112] = exif_orient; kw["exif"] = ex.tobytes()
    Image.new(mode, size, "white" if mode != "CMYK" else (0, 0, 0, 0)).save(b, fmt, **kw)
    return b.getvalue()


def test_plain_jpeg_is_embedded_unchanged():
    data = img("RGB", (1200, 900), "JPEG")
    assert pdfs.prepare(data)[0] is data


@pytest.mark.parametrize("mode,size,fmt,orient", [("RGBA", (500, 500), "PNG", None), ("CMYK", (400, 600), "JPEG", None),
                                                   ("L", (300, 400), "JPEG", None), ("RGB", (800, 600), "JPEG", 6)])
def test_other_images_are_reencoded_upright(mode, size, fmt, orient):
    jpeg, w, h, cs = pdfs.prepare(img(mode, size, fmt, orient))
    assert jpeg[:2] == b"\xff\xd8"
    assert (w, h) == ((size[1], size[0]) if orient == 6 else size)


def test_not_an_image_raises():
    with pytest.raises(Exception):
        pdfs.prepare(b"hello")


def test_pdf_is_valid(tmp_path):
    out = tmp_path / "x.pdf"
    with open(out, "wb") as f:
        w = pdfs.PdfWriter(f)
        w.page(*pdfs.prepare(img("RGB", (1000, 1400), "JPEG")))
        w.page(*pdfs.prepare(img("RGB", (1600, 900), "PNG")))
        w.close()
    info = subprocess.run(["pdfinfo", str(out)], capture_output=True, text=True)
    if info.returncode != 0 and "No such file" in info.stderr:
        pytest.skip("poppler not installed")
    assert "Pages:           2" in info.stdout


@pytest.mark.parametrize("raw,name", [("  Kurs ishi  ", "Kurs ishi"), ('a/b\\c:d*e?.pdf', "a b c d e"), ("...", ""),
                                      ("Отчёт.PDF", "Отчёт"), ("Oʻzbekiston", "Oʻzbekiston"), ("x" * 80, "x" * 60)])
def test_file_names(raw, name):
    assert pdfs.clean_name(raw) == name
