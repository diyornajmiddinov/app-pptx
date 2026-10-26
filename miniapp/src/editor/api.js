/**
 * Editor API. The editor runs in a normal desktop browser (not inside Telegram), so instead of initData it
 * carries a signed token from the bot / Mini App link: editor.html#t=<token>&lang=uz
 */
const params = new URLSearchParams(window.location.hash.slice(1));
export const TOKEN = params.get('t') || '';
export const LANG = ['uz', 'ru', 'en'].includes(params.get('lang')) ? params.get('lang') : 'uz';
const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api/editor';

export class EditorApiError extends Error {
  constructor(key, status) { super(key); this.key = key; this.status = status; }
}

async function call(method, path, { json, body, headers = {} } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'X-Editor-Token': TOKEN, ...(json ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: json ? JSON.stringify(json) : body,
    });
  } catch {
    throw new EditorApiError('network', 0);
  }
  if (!res.ok) {
    let key = 'server';
    try { key = (await res.json()).detail || key; } catch { /* not JSON */ }
    if (res.status === 401) key = 'expired';
    throw new EditorApiError(typeof key === 'string' ? key : 'server', res.status);
  }
  return res.json();
}

const q = `t=${encodeURIComponent(TOKEN)}`;
export const api = {
  docs: () => call('GET', '/docs'),
  importFile: (file) => call('POST', '/import', { body: file, headers: { 'X-Filename': encodeURIComponent(file.name) } }),
  importDeck: (deckId) => call('POST', '/import-deck', { json: { deck_id: deckId } }),
  doc: (id) => call('GET', `/docs/${id}`),
  ops: (id, version, ops, full) => call('POST', `/docs/${id}/ops`, { json: { version, ops, full } }),
  undo: (id, full = false) => call('POST', `/docs/${id}/undo?full=${full}`),
  redo: (id, full = false) => call('POST', `/docs/${id}/redo?full=${full}`),
  rename: (id, name) => call('POST', `/docs/${id}/rename`, { json: { name } }),
  remove: (id) => call('POST', `/docs/${id}/delete`),
  upload: (id, file) => call('POST', `/docs/${id}/upload`, { body: file }),
  send: (id) => call('POST', `/docs/${id}/send`),
  layerUrl: (id, key) => `${BASE}/docs/${id}/layer/${key}.png?${q}`,
  mediaUrl: (id, name) => `${BASE}/docs/${id}/media/${name}?${q}`,
  downloadUrl: (id) => `${BASE}/docs/${id}/download?${q}`,
};
