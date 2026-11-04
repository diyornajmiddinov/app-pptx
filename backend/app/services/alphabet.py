"""
The new Uzbek Latin alphabet (the law signed 21 October 2026): Oʻ Gʻ Sh Ch -> Ö Ğ Ş Ç; Ng is no longer a letter of
its own (still written n + g); the tutuq belgisi (') stays. to_new() turns text in the old Latin script into the new one.

What is not Uzbek is left as it is: {placeholders}, <tags>, &entities;, links, e-mails, /commands, file names, and
foreign words (Telegram, PowerPoint, ChatGPT, Chrome: a w, a c without h, th, ph, ck, ee, oo, or a capital inside).
"""
import re

APOS = "'‘’ʻʼ`"  # how the old script's oʻ / gʻ are typed
NEW = "uzn"      # the language code of the new script (content: decks, papers); "uz" stays the old Latin

_SKIP = re.compile(r"<[^>]*>|\{[^}]*\}|&#?\w+;|https?://\S+|www\.\S+|t\.me/\S+|[\w.+-]+@[\w-]+\.[\w.]+"
                   r"|(?<![\w'])/[a-z_]+|[\w-]+\.(?:pptx|docx|pdf|mp4|png|jpe?g|json|uz|com|me|org|ru)\b")
_WORD = re.compile(rf"[A-Za-z]+(?:[{APOS}][A-Za-z]+)*(?:(?<=[gGoO])[{APOS}])?")
_FOREIGN = re.compile(r"[wW]|[cC](?![hH])|th|ph|ck|ee|oo|[a-z][A-Z]")
_KEEP = {"chrome", "push", "flash", "shift", "english", "cash", "cashback", "dashboard", "fresh", "show", "shop",
         "chatgpt", "fetch", "slidechibot", "slidechi", "check", "touch", "smartphone", "photoshop", "windows", "macbook", "github", "html"}
_PAIR = re.compile(rf"([oOgG])[{APOS}]|([sScC])([hH])")


def _letter(m: re.Match) -> str:
    if m.group(1):
        return {"o": "ö", "O": "Ö", "g": "ğ", "G": "Ğ"}[m.group(1)]
    one = {"s": "ş", "c": "ç"}[m.group(2).lower()]
    return one.upper() if m.group(2).isupper() else one


def _word(m: re.Match) -> str:
    w = m.group(0)
    bare = re.sub(f"[{APOS}]", "", w)
    if bare.lower() in _KEEP or _FOREIGN.search(bare) or (len(bare) > 1 and bare.isupper() and not re.search(f"[{APOS}]|SH|CH", w)):
        return w
    return _PAIR.sub(_letter, w)


def to_new(text: str) -> str:
    """Old Latin -> the new alphabet; idempotent (text already in the new script comes back the same)."""
    out, at = [], 0
    for m in _SKIP.finditer(text):
        out += [_WORD.sub(_word, text[at:m.start()]), m.group(0)]
        at = m.end()
    out.append(_WORD.sub(_word, text[at:]))
    return "".join(out)


_AS_TYPED = {"language", "file", "image", "icon", "type", "author", "org", "loc", "year", "url", "src", "photo", "query", "kind", "id"}


def content_to_new(obj):
    """A deck's / paper's content (dicts, lists, strings) in the new alphabet; names the user typed (author,
    organization, city) and the technical fields (image, icon, type...) are kept as they are."""
    if isinstance(obj, str):
        return to_new(obj)
    if isinstance(obj, list):
        return [content_to_new(x) for x in obj]
    if isinstance(obj, dict):
        return {k: v if k in _AS_TYPED else content_to_new(v) for k, v in obj.items()}
    return obj
