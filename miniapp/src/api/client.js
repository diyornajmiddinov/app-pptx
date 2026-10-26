const API_BASE = import.meta.env.VITE_API_URL ?? '';
/** Opened from the bot's bottom keyboard: no initData, the URL carries a signed token for this user instead. */
export const APP_TOKEN = new URLSearchParams(window.location.search).get('t') || '';
const TIMEOUT_MS = 20_000;

/** key = message key in i18n/messages.js; the UI translates it */
export class ApiError extends Error {
  constructor(key, status) { super(key); this.name = 'ApiError'; this.key = key; this.status = status; }
}

const keyForStatus = (status) => ({ 401: 'e401', 402: 'e402', 403: 'e403', 404: 'e404', 422: 'e422', 429: 'e429' })[status] || 'eServer';

/** initData goes in a header: the backend verifies the Telegram signature itself. */
async function request(method, path, { initData, payload } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Telegram-Init-Data': initData || '', ...(APP_TOKEN ? { 'X-App-Token': APP_TOKEN } : {}) },
      body: payload ? JSON.stringify(payload) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    throw new ApiError(err.name === 'AbortError' ? 'eTimeout' : 'eNetwork', 0);
  } finally { clearTimeout(timer); }
  if (!res.ok) {
    throw new ApiError(keyForStatus(res.status), res.status);
  }
  return res.json().catch(() => ({}));
}

/** New presentation: AI writes content in the chosen template's style. */
export const generatePresentation = ({ initData, payload }) => request('POST', '/api/generate', { initData, payload });
/** One of the user's presentations (deck_id) redrawn in another template (one short AI call adapts the tone). */
export const restylePresentation = ({ initData, payload }) => request('POST', '/api/restyle', { initData, payload });
/** { decks: [{ id, topic, template_id, slides, created, updated }] }, newest first */
export const getDecks = ({ initData }) => request('GET', '/api/decks', { initData });
/** { lang } — the user's language saved by the bot */
export const getMe = ({ initData }) => request('GET', '/api/me', { initData });
/** { url } — signed link to the desktop editor (opened in the external browser) */
export const getEditorLink = ({ initData }) => request('GET', '/api/editor/link', { initData });
export const saveLang = ({ initData, lang }) => request('POST', '/api/me', { initData, payload: { lang } });
