/**
 * Website API (/api/web). The session is an httpOnly cookie set by /verify: page scripts never see the token,
 * the browser sends it by itself. Errors carry the backend's key (notFound, lowBalance, ...) for i18n: e_<key>.
 */
const BASE = '/api/web';
const TIMEOUT_MS = 30_000;

export class ApiError extends Error {
  constructor(key, status) { super(key); this.name = 'ApiError'; this.key = key; this.status = status; }
}

async function send(method, path, { json, body, timeout = TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      credentials: 'same-origin',
      headers: json ? { 'Content-Type': 'application/json' } : {},
      body: json ? JSON.stringify(json) : body,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError('network', 0);
  } finally { clearTimeout(timer); }
  if (!res.ok) {
    let key = 'server';
    try { const d = (await res.json()).detail; if (typeof d === 'string') key = d; } catch { /* not JSON */ }
    if (res.status === 401 && key !== 'badCode') key = 'signedOut';
    throw new ApiError(key, res.status);
  }
  return res;
}

const json = async (...args) => (await send(...args)).json();

/** A file answer (.pptx / .pdf) saved under the name the server gives it. */
async function saveFile(res, fallback) {
  const cd = res.headers.get('content-disposition') || '';
  const m = cd.match(/filename\*=utf-8''([^;]+)/i) || cd.match(/filename="?([^";]+)"?/i);
  const name = m ? decodeURIComponent(m[1]) : fallback;
  const url = URL.createObjectURL(await res.blob());
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export const api = {
  config: () => json('GET', '/config'),
  login: (login) => json('POST', '/login', { json: { login } }),
  verify: (login_id, code) => json('POST', '/verify', { json: { login_id, code } }),
  logout: (everywhere = false) => json('POST', '/logout', { json: { everywhere } }),
  me: () => json('GET', '/me'),
  decks: () => json('GET', '/decks'),
  jobs: () => json('GET', '/jobs'),
  history: () => json('GET', '/history'),
  generate: (payload) => json('POST', '/generate', { json: payload }),
  restyle: (deck_id, template_id) => json('POST', '/restyle', { json: { deck_id, template_id } }),
  editor: () => json('GET', '/editor'),
  download: async (deckId) => saveFile(await send('GET', `/decks/${deckId}/download`, { timeout: 180_000 }), 'taqdimot.pptx'),
  orders: () => json('GET', '/topup'),
  topup: (amount) => json('POST', '/topup', { json: { amount } }),
  receipt: (orderId, file) => json('POST', `/topup/${orderId}/receipt`, { body: file, timeout: 120_000 }),
  pdf: async (files, name) => {
    const form = new FormData();
    files.forEach((f) => form.append('files', f, f.name));
    form.append('name', name);
    const res = await send('POST', '/pdf', { body: form, timeout: 300_000 });
    await saveFile(res, 'rasmlar.pdf');
    return Number(res.headers.get('x-skipped') || 0);
  },
};
