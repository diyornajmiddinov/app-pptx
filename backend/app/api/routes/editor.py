"""
Desktop presentation editor (/api/editor/...): any .pptx, edited in a normal browser (editor.html).
The page carries a signed link from the bot / Mini App (X-Editor-Token or ?t=) instead of Telegram initData.
"""
import re
import shutil
import tempfile
from pathlib import Path
from urllib.parse import unquote

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

from app.bot.keyboards import editor_url
from app.core.auth import editor_user, telegram_user
from app.core.telegram import send_document
from app.services import content_ai, decks, editor
from app.services.users import lang_of
from app.texts import t

router = APIRouter()


async def editor_error(_: Request, e: Exception):  # registered for editor.EditorError in app.api.main
    status = {"notFound": 404, "stale": 409, "tooBig": 413}.get(str(e), 422)
    return JSONResponse({"detail": str(e)}, status_code=status)


async def _body(request: Request, limit: int) -> bytes:
    data = bytearray()
    async for chunk in request.stream():
        data += chunk
        if len(data) > limit:
            raise HTTPException(413, "tooBig")
    return bytes(data)


@router.get("/api/editor/link")
async def editor_link(tg_user: dict = Depends(telegram_user)):
    return {"url": editor_url(tg_user["id"], await lang_of(tg_user["id"], tg_user.get("language_code")))}


@router.get("/api/editor/docs")
async def editor_docs(uid: int = Depends(editor_user)):
    return {"docs": await run_in_threadpool(editor.list_docs, uid), "decks": await decks.list_all(uid)}


@router.post("/api/editor/import")
async def editor_import(request: Request, uid: int = Depends(editor_user), x_filename: str = Header("taqdimot.pptx")):
    data = await _body(request, editor.MAX_FILE)
    doc = await run_in_threadpool(editor.import_file, uid, data, unquote(x_filename), "upload")
    return {"id": doc}


class DeckImport(BaseModel):
    deck_id: str = Field(pattern=r"^\d{1,20}$")


def _import_deck(uid: int, deck: dict) -> str:
    with tempfile.TemporaryDirectory(prefix="slideai-") as tmp:
        path = content_ai.render(deck["content"], deck["request"]["template_id"], Path(tmp) / "deck.pptx")
        return editor.import_file(uid, path.read_bytes(), deck["content"]["meta"]["topic"] + ".pptx", "deck")


@router.post("/api/editor/import-deck")
async def editor_import_deck(req: DeckImport, uid: int = Depends(editor_user)):
    deck = await decks.load(uid, req.deck_id)
    if not deck:
        raise editor.EditorError("notFound")
    return {"id": await run_in_threadpool(_import_deck, uid, deck)}


@router.get("/api/editor/docs/{doc_id}")
def editor_doc(doc_id: str, uid: int = Depends(editor_user)):
    return editor.describe(uid, doc_id)


class EditOps(BaseModel):
    version: int
    ops: list[dict] = Field(max_length=200)
    full: bool = False  # True for changes the page cannot draw by itself (new slides, images): send the model back


@router.post("/api/editor/docs/{doc_id}/ops")
def editor_ops(doc_id: str, req: EditOps, uid: int = Depends(editor_user)):
    return editor.apply(uid, doc_id, req.ops, req.version, full=req.full)


@router.post("/api/editor/docs/{doc_id}/undo")
def editor_undo(doc_id: str, full: bool = False, uid: int = Depends(editor_user)):
    return editor.step(uid, doc_id, -1, full=full)


@router.post("/api/editor/docs/{doc_id}/redo")
def editor_redo(doc_id: str, full: bool = False, uid: int = Depends(editor_user)):
    return editor.step(uid, doc_id, 1, full=full)


class RenameReq(BaseModel):
    name: str = Field(min_length=1, max_length=80)


@router.post("/api/editor/docs/{doc_id}/rename")
def editor_rename(doc_id: str, req: RenameReq, uid: int = Depends(editor_user)):
    return editor.rename(uid, doc_id, req.name)


@router.post("/api/editor/docs/{doc_id}/delete")
def editor_delete(doc_id: str, uid: int = Depends(editor_user)):
    editor.delete_doc(uid, doc_id)
    return {"ok": True}


@router.post("/api/editor/docs/{doc_id}/upload")
async def editor_upload(doc_id: str, request: Request, uid: int = Depends(editor_user)):
    data = await _body(request, editor.MAX_IMAGE)
    return {"upload": await run_in_threadpool(editor.save_upload, uid, doc_id, data)}


IMMUTABLE = {"Cache-Control": "private, max-age=31536000, immutable"}  # names are content hashes


@router.get("/api/editor/docs/{doc_id}/layer/{key}.png")
def editor_layer(doc_id: str, key: str, uid: int = Depends(editor_user)):
    return FileResponse(editor.layer_file(uid, doc_id, key), media_type="image/png", headers=IMMUTABLE)


@router.get("/api/editor/docs/{doc_id}/media/{name}")
def editor_media(doc_id: str, name: str, uid: int = Depends(editor_user)):
    return FileResponse(editor.media_file(uid, doc_id, name), headers=IMMUTABLE)


@router.get("/api/editor/docs/{doc_id}/download")
def editor_download(doc_id: str, uid: int = Depends(editor_user)):
    path, name = editor.current_file(uid, doc_id)
    return FileResponse(path, filename=f"{name}.pptx",
                        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation")


@router.post("/api/editor/docs/{doc_id}/send")
async def editor_send(doc_id: str, uid: int = Depends(editor_user)):
    """The edited file goes to the user's chat with the bot."""
    path, name = await run_in_threadpool(editor.current_file, uid, doc_id)
    with tempfile.TemporaryDirectory() as tmp:
        named = Path(tmp) / f"{re.sub(r'[^\w\-]+', '_', name)[:60]}.pptx"
        shutil.copy(path, named)
        await send_document(uid, str(named), caption=t(await lang_of(uid), "editor_sent", name=name))
    return {"ok": True}
