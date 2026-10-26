"""
systemd service notifications (no dependency): READY=1 once started, then WATCHDOG=1 every few seconds from the event
loop. If the loop hangs, the pings stop and systemd (WatchdogSec= in the unit) kills and restarts the service.
Outside systemd (tests, a terminal) NOTIFY_SOCKET is not set and this does nothing.
"""
import asyncio
import os
import socket


def notify(state: str) -> bool:
    addr = os.environ.get("NOTIFY_SOCKET")
    if not addr:
        return False
    if addr.startswith("@"):  # abstract namespace
        addr = "\0" + addr[1:]
    with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as s:
        s.sendto(state.encode(), addr)
    return True


async def watchdog():
    """Run as a task for the life of the process."""
    notify("READY=1")
    usec = int(os.environ.get("WATCHDOG_USEC", "0"))
    if not usec:
        return
    every = max(1.0, usec / 1_000_000 / 3)  # three pings per watchdog period
    while True:
        notify("WATCHDOG=1")
        await asyncio.sleep(every)
