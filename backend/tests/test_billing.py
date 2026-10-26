"""Money: a balance never goes below zero, a payment is credited once, failed jobs are refunded."""
import asyncio

import billing
from conftest import add_user


async def test_parallel_charges_never_overdraw():
    await add_user(1, balance=30000)
    results = await asyncio.gather(*(billing.charge(1, 5000, "generate") for _ in range(20)))
    assert sum(r is not None for r in results) == 6
    assert await billing.balance(1) == 0


async def test_same_payment_is_credited_once_even_in_parallel():
    await add_user(1)
    results = await asyncio.gather(*(billing.top_up(1, 7000, ref="card:42") for _ in range(10)))
    assert sum(r is not None for r in results) == 1
    assert await billing.balance(1) == 7000


async def test_refund_and_ledger():
    await add_user(1, balance=10000)
    assert await billing.charge(1, 5000, "generate") == 5000
    assert await billing.refund(1, 5000, "generate") == 10000
    from db import pool
    kinds = [r["kind"] for r in await pool().fetch("SELECT kind FROM ledger WHERE user_id = 1 ORDER BY id")]
    assert kinds == ["topup", "generate", "refund:generate"]


async def test_unknown_user_has_zero_and_cannot_be_charged():
    assert await billing.balance(999) == 0
    assert await billing.charge(999, 1, "generate") is None
