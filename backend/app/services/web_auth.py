"""
Website sign-in (slidechi.uz) with a code from the bot: the site account is the bot account (users.id).

  1. start(login, ip)        @username or Telegram id -> a 6-digit code goes to that user's chat with the bot
  2. verify(id, code, ...)   the right code within CODE_TTL, at most MAX_ATTEMPTS tries -> a session token
  3. session(token)          every site request: Authorization: Bearer <token> -> user id

Only people who have started the bot can sign in (the bot cannot write to anyone else). The digits are kept as an
HMAC, the token as a sha256: a database dump signs nobody in. Rate limits live in web_actions.
"""
import hashlib
import hmac
import secrets

from app.core import db
from app.core.config import settings

CODE_TTL = 5 * 60                  # s
MAX_ATTEMPTS = 5                   # wrong codes before that code is dead
SESSION_DAYS = 30
RESEND_AFTER = 60                  # s between two codes to one user
CODES_PER_HOUR_USER = 5
CODES_PER_HOUR_IP = 10
FAILS_PER_HOUR_IP = 30


class AuthError(Exception):
    """str(e) is the key the site translates: notFound, tooMany, wait, expired, badCode."""


def _key() -> bytes:
    return hmac.new(b"SlideAI-web", settings.bot_token.encode(), hashlib.sha256).digest()


def _code_hash(login_id: str, code: str) -> str:
    return hmac.new(_key(), f"{login_id}:{code}".encode(), hashlib.sha256).hexdigest()


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


async def count(action: str, *, user_id: int | None = None, ip: str | None = None, seconds: int = 3600) -> int:
    col, val = ("user_id", user_id) if user_id is not None else ("ip", ip)
    return await db.pool().fetchval(f"SELECT count(*) FROM web_actions WHERE action = $1 AND {col} = $2 "
                                    "AND created > now() - make_interval(secs => $3)", action, val, seconds)


async def note(action: str, user_id: int | None, ip: str | None):
    await db.pool().execute("INSERT INTO web_actions (action, user_id, ip) VALUES ($1, $2, $3)", action, user_id, ip)


async def find_user(login: str) -> int | None:
    """'@Vali', 'vali', 't.me/vali' or a numeric Telegram id -> users.id (only people the bot has seen)."""
    s = login.strip().removeprefix("https://").removeprefix("t.me/").lstrip("@").strip()
    if s.isdigit():
        return await db.pool().fetchval("SELECT id FROM users WHERE id = $1", int(s))
    if not s:
        return None
    return await db.pool().fetchval("SELECT id FROM users WHERE lower(username) = lower($1) ORDER BY last_seen DESC LIMIT 1", s)


async def purge():
    """Old codes and rate-limit rows are not needed after a day; dead sessions after they expire."""
    await db.pool().execute("DELETE FROM web_logins WHERE created < now() - interval '1 day'")
    await db.pool().execute("DELETE FROM web_actions WHERE created < now() - interval '1 day'")
    await db.pool().execute("DELETE FROM web_sessions WHERE expires < now()")


async def start(login: str, ip: str | None) -> tuple[str, int, str]:
    """A new code for this login. Returns (login id for the browser, user id, the digits to send)."""
    if await count("code", ip=ip) >= CODES_PER_HOUR_IP:
        raise AuthError("tooMany")
    await note("code", None, ip)
    uid = await find_user(login)
    if uid is None:
        raise AuthError("notFound")
    if await count("code", user_id=uid, seconds=RESEND_AFTER):
        raise AuthError("wait")
    if await count("code", user_id=uid) >= CODES_PER_HOUR_USER:
        raise AuthError("tooMany")
    await note("code", uid, None)
    await purge()
    login_id, code = secrets.token_urlsafe(18), f"{secrets.randbelow(10**6):06d}"
    await db.pool().execute(
        "INSERT INTO web_logins (id, user_id, code_hash, ip, expires) VALUES ($1, $2, $3, $4, now() + make_interval(secs => $5))",
        login_id, uid, _code_hash(login_id, code), ip, CODE_TTL)
    return login_id, uid, code


async def verify(login_id: str, code: str, ip: str | None, user_agent: str | None) -> tuple[str, int]:
    """The code typed on the site. Returns (session token, user id); the code works once."""
    if await count("fail", ip=ip) >= FAILS_PER_HOUR_IP:
        raise AuthError("tooMany")
    async with db.transaction() as con:
        row = await con.fetchrow("SELECT user_id, code_hash, attempts, expires > now() AS alive, used FROM web_logins "
                                 "WHERE id = $1 FOR UPDATE", login_id)
        if not row or row["used"] or not row["alive"] or row["attempts"] >= MAX_ATTEMPTS:
            raise AuthError("expired")
        if not hmac.compare_digest(row["code_hash"], _code_hash(login_id, code.strip())):
            # counted and committed before the error: raising inside the transaction would roll the count back
            await con.execute("UPDATE web_logins SET attempts = attempts + 1 WHERE id = $1", login_id)
            await con.execute("INSERT INTO web_actions (action, user_id, ip) VALUES ('fail', $1, $2)", row["user_id"], ip)
            wrong = "expired" if row["attempts"] + 1 >= MAX_ATTEMPTS else "badCode"
        else:
            wrong = None
            await con.execute("UPDATE web_logins SET used = now() WHERE id = $1", login_id)
            token = secrets.token_urlsafe(32)
            await con.execute("INSERT INTO web_sessions (token_hash, user_id, expires, ip, user_agent) "
                              "VALUES ($1, $2, now() + make_interval(days => $3), $4, $5)",
                              _token_hash(token), row["user_id"], SESSION_DAYS, ip, (user_agent or "")[:200])
    if wrong:
        raise AuthError(wrong)
    return token, row["user_id"]


async def session(token: str) -> int | None:
    """The signed-in user, or None. last_seen is refreshed at most every 5 minutes."""
    if not token:
        return None
    return await db.pool().fetchval(
        "UPDATE web_sessions SET last_seen = CASE WHEN last_seen < now() - interval '5 minutes' THEN now() ELSE last_seen END "
        "WHERE token_hash = $1 AND expires > now() RETURNING user_id", _token_hash(token))


async def logout(token: str, everywhere: bool = False):
    """This browser only, or every browser this user has signed in with."""
    if everywhere:
        await db.pool().execute("DELETE FROM web_sessions WHERE user_id = (SELECT user_id FROM web_sessions WHERE token_hash = $1)",
                                _token_hash(token))
    else:
        await db.pool().execute("DELETE FROM web_sessions WHERE token_hash = $1", _token_hash(token))
