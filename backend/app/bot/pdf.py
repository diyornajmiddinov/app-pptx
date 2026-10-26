"""
Images -> PDF conversation: "🖼 Rasmdan PDF" -> photos / image files -> "✅ PDF yaratish" -> the file name -> the PDF.
The draft (images and stage) is in the database (images_pdf.py), so a bot restart does not lose it.
"""
import asyncio
import logging
import re
import tempfile
from pathlib import Path

from app.bot.keyboards import main_keyboard, pdf_keyboard, pdf_name_keyboard
from app.core import telegram
from app.core.telegram import send_document, send_message
from app.services import images_pdf as pdfs
from app.texts import t

log = logging.getLogger("bot")
_acks: dict[int, asyncio.Task] = {}  # one "received: N" answer per album, not one per photo


async def start(chat_id: int, user_id: int, lang: str):
    await pdfs.start(user_id)
    await send_message(chat_id, t(lang, "pdf_start", max=pdfs.MAX_IMAGES), pdf_keyboard(lang))


async def _ack_later(chat_id: int, user_id: int, lang: str):
    await asyncio.sleep(1.5)
    _acks.pop(user_id, None)
    n = await pdfs.count(user_id)
    if n:
        await send_message(chat_id, t(lang, "pdf_full" if n >= pdfs.MAX_IMAGES else "pdf_added", n=n, max=pdfs.MAX_IMAGES))


async def _receive(chat_id: int, user_id: int, file_id: str, message_id: int, lang: str):
    await pdfs.add(user_id, file_id, message_id)  # None (full) is reported by the answer below
    if old := _acks.pop(user_id, None):
        old.cancel()
    _acks[user_id] = asyncio.create_task(_ack_later(chat_id, user_id, lang))


async def _ask_name(chat_id: int, user_id: int, lang: str):
    """"✅ PDF yaratish": the images are in; the user names the file before it is made."""
    if task := _acks.pop(user_id, None):
        task.cancel()
    n = await pdfs.count(user_id)
    if not n:
        await send_message(chat_id, t(lang, "pdf_empty"), pdf_keyboard(lang))
        return
    await pdfs.set_stage(user_id, "name")
    await send_message(chat_id, t(lang, "pdf_ask_name", n=n), pdf_name_keyboard(lang))


async def _make(chat_id: int, user_id: int, lang: str, name: str):
    files = await pdfs.take(user_id)
    if not files:
        await pdfs.start(user_id)
        await send_message(chat_id, t(lang, "pdf_empty"), pdf_keyboard(lang))
        return
    await send_message(chat_id, t(lang, "pdf_wait"), main_keyboard(lang, chat_id))
    skipped = 0
    try:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / f"{name}.pdf"
            with open(path, "wb") as f:
                pdf = pdfs.PdfWriter(f)
                for file_id in files:  # one image in memory at a time
                    try:
                        page = await asyncio.to_thread(pdfs.prepare, await telegram.download_file(file_id))
                    except Exception:  # not an image (or too big for the Bot API): leave it out
                        skipped += 1
                        continue
                    pdf.page(*page)
                if pdf.pages:
                    pdf.close()
            if not pdf.pages:
                raise ValueError("no readable images")
            await send_document(chat_id, str(path), caption=t(lang, "pdf_done", name=name, n=len(pdf.pages)))
        if skipped:
            await send_message(chat_id, t(lang, "pdf_skipped", n=skipped))
    except Exception:
        log.exception("PDF yaratilmadi · foydalanuvchi %s · %s ta rasm", user_id, len(files))
        await send_message(chat_id, t(lang, "pdf_error"))


async def on_message(m, stage: str) -> bool:
    """A message while a draft is open. True if handled here; False = leave the section and handle it normally."""
    if m.key == "kb_pdf_cancel":
        await pdfs.cancel(m.uid)
        await send_message(m.chat_id, t(m.lang, "pdf_cancelled"), main_keyboard(m.lang, m.chat_id))
        return True
    if stage == "name" and m.text and not m.text.startswith("/") and not m.key:  # the file name
        name = pdfs.clean_name(m.text)
        if not re.search(r"\w", name):
            await send_message(m.chat_id, t(m.lang, "pdf_bad_name"), pdf_name_keyboard(m.lang))
        else:
            await _make(m.chat_id, m.uid, m.lang, name)
        return True
    if stage == "name" and (m.image_id or m.key == "kb_pdf_make"):  # still adding photos: take them, ask for the name again
        if m.image_id:
            await pdfs.add(m.uid, m.image_id, m.message_id)
        await send_message(m.chat_id, t(m.lang, "pdf_need_name"), pdf_name_keyboard(m.lang))
        return True
    if m.key == "kb_pdf_make":
        await _ask_name(m.chat_id, m.uid, m.lang)
        return True
    if m.image_id:
        await _receive(m.chat_id, m.uid, m.image_id, m.message_id, m.lang)
        return True
    if m.doc or not (m.text.startswith("/") or m.key):
        n = await pdfs.count(m.uid)
        await send_message(m.chat_id, t(m.lang, "pdf_not_image") if m.doc else t(m.lang, "pdf_added", n=n) if n else t(m.lang, "pdf_empty"),
                           pdf_name_keyboard(m.lang) if stage == "name" else pdf_keyboard(m.lang))
        return True
    await pdfs.cancel(m.uid)  # another command or menu button: leave the PDF section, then do what was asked
    await send_message(m.chat_id, t(m.lang, "pdf_cancelled"), main_keyboard(m.lang, m.chat_id))
    return False
