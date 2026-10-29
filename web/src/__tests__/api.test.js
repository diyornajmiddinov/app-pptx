import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, api } from '../api.js';
import { date, money } from '../i18n.jsx';
import { fakeFetch } from './helpers.jsx';

afterEach(() => vi.unstubAllGlobals());

describe('api client', () => {
  it('sends JSON and returns the answer', async () => {
    const calls = fakeFetch({ 'POST /login': [200, { login_id: 'abc', ttl: 300 }] });
    expect(await api.login('@vali')).toEqual({ login_id: 'abc', ttl: 300 });
    expect(calls[0].body).toEqual({ login: '@vali' });
  });

  it('turns the backend detail into an i18n key', async () => {
    fakeFetch({ 'POST /generate': [402, { detail: 'lowBalance' }] });
    await expect(api.generate({})).rejects.toMatchObject({ key: 'lowBalance', status: 402 });
  });

  it('401 means signed out (except a wrong code)', async () => {
    fakeFetch({ 'GET /me': [401, { detail: 'whatever' }], 'POST /verify': [401, { detail: 'badCode' }] });
    await expect(api.me()).rejects.toMatchObject({ key: 'signedOut' });
    await expect(api.verify('x', '123456')).rejects.toMatchObject({ key: 'badCode' });
  });

  it('a network failure is a network error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('offline'); }));
    const e = await api.me().catch((x) => x);
    expect(e).toBeInstanceOf(ApiError);
    expect(e.key).toBe('network');
  });

  it('the document file name goes in a header, URL-encoded', async () => {
    const calls = fakeFetch({ 'POST /source': [200, { text: 'x', chars: 1, cut: false }] });
    await api.source(new File(['abc'], 'Hisobot 2026.docx'));
    expect(calls[0].headers['X-Filename']).toBe('Hisobot%202026.docx');
  });
});

describe('formatting', () => {
  it('money as in the bot', () => {
    expect(money(15000, 'uz')).toBe("15 000 so'm");
    expect(money(15000, 'ru')).toBe('15 000 сум');
    expect(money(15000, 'en')).toBe('15,000 UZS');
  });
  it('dates in one format', () => {
    const s = new Date(2026, 9, 29, 7, 5).getTime() / 1000;
    expect(date(s)).toBe('29.10.2026');
    expect(date(s, true)).toBe('29.10.2026 07:05');
  });
});
