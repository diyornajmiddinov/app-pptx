"""
Daily PostgreSQL backup -> /home/slideai-src/backups (last 14 kept) and the log channel (alerts.py).
Run by slideai-backup.timer; by hand:  backend/.venv/bin/python ops/backup.py
Restore:  pg_restore --clean --if-exists -d "$DATABASE_URL" slideai-YYYYMMDD-HHMM.dump
"""
import asyncio
import os
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))
from app.core import alerts  # noqa: E402

import asyncpg  # noqa: E402

DIR = Path("/home/slideai-src/backups")
KEEP = 14
TZ = timezone(timedelta(hours=5))  # Tashkent


def size(n: int) -> str:
    return f"{n / 1024:.0f} KB" if n < 1024 * 1024 else f"{n / 1024 / 1024:.1f} MB"


async def counts() -> dict:
    con = await asyncpg.connect(os.environ["DATABASE_URL"])
    try:
        return dict(await con.fetchrow("""SELECT (SELECT count(*) FROM users) users, (SELECT count(*) FROM decks) decks,
            (SELECT count(*) FROM ledger) ledger, (SELECT coalesce(sum(amount), 0) FROM balances) balances"""))
    finally:
        await con.close()


def main():
    DIR.mkdir(parents=True, exist_ok=True)
    now = datetime.now(TZ)
    out = DIR / f"slideai-{now:%Y%m%d-%H%M}.dump"
    try:
        subprocess.run(["pg_dump", "--format=custom", "--no-owner", "--file", str(out), os.environ["DATABASE_URL"]],
                       check=True, capture_output=True, text=True, timeout=600)
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, KeyError) as e:
        err = getattr(e, "stderr", "") or str(e)
        alerts.post(f"⛔ <b>Backup bo'lmadi</b>\n<pre>{err[-1500:]}</pre>")
        sys.exit(1)
    for old in sorted(DIR.glob("slideai-*.dump"))[:-KEEP]:
        old.unlink()
    c = asyncio.run(counts())
    caption = (f"💾 <b>Kunlik zaxira</b> · {now:%d.%m.%Y %H:%M}\n"
               f"Hajmi: {size(out.stat().st_size)}\n"
               f"Foydalanuvchilar: {c['users']} · Taqdimotlar: {c['decks']} · Tranzaksiyalar: {c['ledger']}\n"
               f"Balanslar jami: {c['balances']:,} so'm".replace(",", " ") +
               "\n\nTiklash: <code>pg_restore --clean --if-exists -d \"$DATABASE_URL\" fayl.dump</code>")
    if not alerts.post_file(out, caption):
        print("backup saved but not sent: no log channel yet?", out)
    print("ok", out)


if __name__ == "__main__":
    main()
