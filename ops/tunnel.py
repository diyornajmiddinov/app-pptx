"""
NOT USED since the bot moved to https://slidechi.uz (WEBAPP_URL=https://slidechi.uz/app/, ops/nginx/slidechi.conf);
slideai-tunnel.service is disabled. Kept for running a copy without a domain. Do not start it on the server:
it rewrites WEBAPP_URL / PUBLIC_URL in backend/.env.

Temporary HTTPS address (cloudflared quick tunnel -> Vite on :5173) until the project has its own domain.

The address changes every time cloudflared starts, so this keeps everything pointing at the current one:
  1. start cloudflared and read its https://*.trycloudflare.com address,
  2. write it to backend/.env (WEBAPP_URL, PUBLIC_URL) if it changed,
  3. restart slideai-backend and slideai-bot so they use it (the bot then fixes users' menu buttons),
  4. post the new address to the log channel.
Runs as slideai-tunnel.service; when cloudflared exits, systemd starts this again.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))
from app.core import alerts  # noqa: E402

ENV = ROOT / "backend" / ".env"
URL = re.compile(r"https://[a-z0-9-]+\.trycloudflare\.com")


def set_env(url: str) -> bool:
    text = ENV.read_text()
    new = re.sub(r"(?m)^(WEBAPP_URL|PUBLIC_URL)=.*$", lambda m: f"{m.group(1)}={url}", text)
    if new != text:
        ENV.write_text(new)
    return new != text


def main():
    proc = subprocess.Popen(["/usr/local/bin/cloudflared", "tunnel", "--no-autoupdate", "--url", "http://localhost:5173"],
                            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    announced = False
    for line in proc.stdout:
        sys.stdout.write(line); sys.stdout.flush()  # cloudflared's own log goes to journald
        m = URL.search(line)
        if m and not announced:
            announced = True
            url = m.group(0)
            if set_env(url):
                subprocess.run(["systemctl", "restart", "slideai-backend", "slideai-bot"], check=False)
            alerts.post(f"🌐 Mini App manzili: {url}\nAdmin panel uchun botga /admin yozing.")
    sys.exit(proc.wait())


if __name__ == "__main__":
    main()
