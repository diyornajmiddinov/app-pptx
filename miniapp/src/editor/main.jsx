/**
 * editor.html — the desktop presentation editor. Opened from the bot / Mini App with a signed link.
 * Phones and tablets get a "open it on a computer" page instead: the editor needs a mouse and a wide screen.
 */
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { LANG, TOKEN } from './api.js';
import { t } from './i18n.js';
import DocList from './DocList.jsx';
import Editor from './Editor.jsx';
import './editor.css';

const MIN_WIDTH = 900;
const touchOnly = () => window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;

function Notice({ title, hint, icon }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-6 text-center text-slate-800">
      <div className="max-w-sm">
        <div className="mb-3 text-5xl" aria-hidden="true">{icon}</div>
        <h1 className="text-[19px] font-semibold">{title}</h1>
        <p className="mt-2 text-[14px] text-slate-600">{hint}</p>
      </div>
    </div>
  );
}

function docFromHash() {
  return new URLSearchParams(window.location.hash.slice(1)).get('doc');
}

function setDocInHash(doc) {
  const p = new URLSearchParams(window.location.hash.slice(1));
  if (doc) p.set('doc', doc); else p.delete('doc');
  window.history.replaceState(null, '', `#${p.toString()}`);
}

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [doc, setDoc] = useState(docFromHash());
  const [fatal, setFatal] = useState(TOKEN ? null : 'expired');
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener('resize', h); return () => window.removeEventListener('resize', h);
  }, []);
  useEffect(() => { document.documentElement.lang = LANG; document.title = t('title'); }, []);
  const open = useCallback((id) => { setDocInHash(id); setDoc(id); }, []);
  const close = useCallback(() => { setDocInHash(null); setDoc(null); }, []);
  const onFatal = useCallback((key) => { if (key === 'notFound') close(); else setFatal(key || 'server'); }, [close]);

  if (touchOnly()) return <Notice icon="💻" title={t('mobile')} hint={t('mobileHint')} />;
  if (fatal === 'expired') return <Notice icon="🔗" title={t('expired')} hint={t('expiredHint')} />;
  if (fatal) return <Notice icon="⚠️" title={t(fatal)} hint="" />;
  if (width < MIN_WIDTH) return <Notice icon="↔️" title={t('narrow')} hint={t('narrowHint')} />;
  return doc ? <Editor key={doc} docId={doc} onClose={close} onFatal={onFatal} /> : <DocList onOpen={open} onFatal={onFatal} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
