/** Shared admin UI pieces: icons, pills, pager, modal, drawer, toasts, data loading. */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const PATHS = {
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  users: 'M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.7 0-8 1.3-8 4v3h8v-3c0-1.1.4-2.1 1.2-3A11 11 0 0 0 8 13zm8 0c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4z',
  payments: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
  ledger: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z',
  decks: 'M4 4h16v12H4zm2 2v8h12V6zm3 12h6v2H9z',
  broadcast: 'M3 10v4h4l5 5V5L7 10H3zm13.5 2A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z',
  settings: 'M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3h-4l-.4 2.9a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1L11 21h4l.4-2.9a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5z',
  log: 'M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3zm-1 5v5l4.3 2.5.7-1.2-3.5-2.1V8z',
  refresh: 'M17.7 6.3A8 8 0 1 0 20 12h-2a6 6 0 1 1-1.8-4.2L13 11h7V4z',
  close: 'M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7l-1.4-1.4L9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3z',
  moon: 'M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z',
  sun: 'M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0-5h0v3m0 14v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M2 12h3m14 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  logout: 'M10 17l1.4-1.4L8.8 13H20v-2H8.8l2.6-2.6L10 7l-5 5zM4 5h7V3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7v-2H4z',
  menu: 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z',
  download: 'M12 16l-5-5 1.4-1.4 2.6 2.6V4h2v8.2l2.6-2.6L17 11zm-7 2h14v2H5z',
};

export function Icon({ name }) {
  const sun = name === 'sun';
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill={sun ? 'none' : 'currentColor'} stroke={sun ? 'currentColor' : 'none'} strokeWidth="2" strokeLinecap="round">
      <path d={PATHS[name]} />
    </svg>
  );
}

export const Pill = ({ tone = '', children }) => <span className={`pill ${tone}`}>{children}</span>;

export function Pager({ page, size, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / size));
  if (total <= size) return total ? <div className="pager"><span>Jami: {total}</span></div> : null;
  return (
    <div className="pager">
      <span>{(page - 1) * size + 1}–{Math.min(page * size, total)} / {total}</span>
      <span className="sp" />
      <button type="button" className="btn sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>‹ Oldingi</button>
      <span>{page} / {pages}</span>
      <button type="button" className="btn sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>Keyingi ›</button>
    </div>
  );
}

export function Modal({ title, children, footer, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <>
      <div className="overlay top" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-h">{title}</div>
        <div className="modal-b">{children}</div>
        {footer && <div className="modal-f">{footer}</div>}
      </div>
    </>
  );
}

export function Drawer({ children, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true">{children}</aside>
    </>
  );
}

/** Ask before anything that moves money or messages people. */
export function useConfirm() {
  const [state, setState] = useState(null);
  const ask = useCallback((o) => new Promise((resolve) => setState({ ...o, resolve })), []);
  const close = (v) => { state?.resolve(v); setState(null); };
  const node = state && (
    <Modal title={state.title} onClose={() => close(false)} footer={<>
      <button type="button" className="btn" onClick={() => close(false)}>Bekor qilish</button>
      <button type="button" className={`btn ${state.danger ? 'danger solid' : 'primary'}`} onClick={() => close(true)} autoFocus>{state.ok || 'Tasdiqlash'}</button>
    </>}>
      {state.body}
    </Modal>
  );
  return [ask, node];
}

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((text, error = false) => {
    const id = Math.random();
    setItems((x) => [...x, { id, text, error }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), error ? 6000 : 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-box" role="status" aria-live="polite">
        {items.map((i) => <div key={i.id} className={`toast ${i.error ? 'error' : ''}`}>{i.text}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

/** Load data for a page; reload when deps change or on demand. Old data stays visible while reloading. */
export function useLoad(fn, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const seq = useRef(0);
  const load = useCallback(() => {
    const n = ++seq.current;
    setState((s) => ({ ...s, loading: true }));
    fn().then((data) => n === seq.current && setState({ data, error: null, loading: false }))
      .catch((error) => n === seq.current && setState((s) => ({ ...s, error, loading: false })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load };
}

export function Loading({ rows = 5 }) {
  return (
    <div className="card-b stack" style={{ gap: 10 }}>
      {Array.from({ length: rows }, (_, i) => <div key={i} className="skeleton" style={{ height: 18 }} />)}
    </div>
  );
}

export const ErrorBox = ({ error, retry }) => (
  <div className="empty">
    {error.message}
    {retry && <div style={{ marginTop: 10 }}><button type="button" className="btn sm" onClick={retry}>Qayta urinish</button></div>}
  </div>
);

export function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}
