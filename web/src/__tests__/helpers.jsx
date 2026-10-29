/** Test helpers: render inside the i18n provider; a fake fetch that answers per "METHOD /path". */
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { I18nProvider } from '../i18n.jsx';

export const renderUz = (ui) => render(<I18nProvider initial="uz">{ui}</I18nProvider>);

export function fakeFetch(routes) {
  const calls = [];
  const fn = vi.fn(async (url, opts = {}) => {
    const key = `${opts.method || 'GET'} ${String(url).replace('/api/web', '')}`;
    calls.push({ key, body: opts.body ? (typeof opts.body === 'string' ? JSON.parse(opts.body) : opts.body) : null, headers: opts.headers });
    const r = routes[key];
    if (!r) return new Response(JSON.stringify({ detail: 'notFound' }), { status: 404 });
    const [status, body] = typeof r === 'function' ? r(calls.at(-1)) : r;
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  });
  vi.stubGlobal('fetch', fn);
  return calls;
}

export const ME = {
  user: { id: 7, first_name: 'Vali', username: 'vali' }, lang: 'uz', balance: 12000,
  prices: { generate: 5000, restyle: 2000, first: null, now: 5000 }, topup_amounts: [15000, 30000],
  providers: ['card'], card: true, referral_bonus: 1000, support_url: '',
};
