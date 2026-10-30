/**
 * Admin API. The panel opens from the bot's /admin link: admin.html#t=<token>. The token is moved to
 * sessionStorage and removed from the address bar, so it does not stay in history or screenshots.
 */
const KEY = 'slideai-admin-token';
const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api/admin';

function readToken() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const fresh = params.get('t');
  if (fresh) {
    try { sessionStorage.setItem(KEY, fresh); } catch { /* private mode: keep it in memory only */ }
    history.replaceState(null, '', window.location.pathname + '#/dashboard');
    return fresh;
  }
  try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; }
}

export let TOKEN = readToken();

export function logout() {
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  TOKEN = '';
}

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

async function call(method, path, json) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'X-Admin-Token': TOKEN, ...(json ? { 'Content-Type': 'application/json' } : {}) },
      body: json ? JSON.stringify(json) : undefined,
    });
  } catch {
    throw new ApiError("Server bilan aloqa yo'q", 0);
  }
  if (!res.ok) {
    let msg = `Xato ${res.status}`;
    try {
      const d = (await res.json()).detail;
      msg = typeof d === 'string' ? d : Array.isArray(d) ? d.map((x) => x.msg).join('; ') : msg;
    } catch { /* not JSON */ }
    if (res.status === 401) window.dispatchEvent(new Event('admin-expired'));
    throw new ApiError(msg, res.status);
  }
  return res.json();
}

const qs = (o) => {
  const p = new URLSearchParams();
  Object.entries(o).forEach(([k, v]) => { if (v !== '' && v !== null && v !== undefined) p.set(k, v); });
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const fileUrl = (path) => `${BASE}${path}${path.includes('?') ? '&' : '?'}t=${encodeURIComponent(TOKEN)}`;

export const api = {
  me: () => call('GET', '/me'),
  stats: (days) => call('GET', `/stats${qs({ days })}`),
  users: (o) => call('GET', `/users${qs(o)}`),
  user: (id) => call('GET', `/users/${id}`),
  balance: (id, body) => call('POST', `/users/${id}/balance`, body),
  message: (id, text) => call('POST', `/users/${id}/message`, { text }),
  orders: (o) => call('GET', `/orders${qs(o)}`),
  decide: (id, approve) => call('POST', `/orders/${id}/decide`, { approve }),
  ledger: (o) => call('GET', `/ledger${qs(o)}`),
  decks: (o) => call('GET', `/decks${qs(o)}`),
  broadcasts: () => call('GET', '/broadcasts'),
  broadcast: (body) => call('POST', '/broadcasts', body),
  settings: () => call('GET', '/settings'),
  saveSettings: (body) => call('PUT', '/settings', body),
  saveAiModel: (model) => call('PUT', '/ai-model', { model }),
  log: (o) => call('GET', `/log${qs(o)}`),
  web: (days) => call('GET', `/web${qs({ days })}`),
  promos: () => call('GET', '/promos'),
  createPromo: (body) => call('POST', '/promos', body),
  promoActive: (id, active) => call('POST', `/promos/${id}/active`, { active }),
};
