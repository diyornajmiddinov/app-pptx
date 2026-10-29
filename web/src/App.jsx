/**
 * slidechi.uz. Real paths: the home page (/, /ru/, /en/ — prerendered for search engines) and the legal pages
 * (/oferta, /maxfiylik). Hash routes: sign-in (#/login) and the account (#/app/<tab>).
 * Whether the visitor is signed in is known only from /api/web/me: the session cookie is httpOnly.
 */
import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import { Spinner } from './components/ui.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Landing from './pages/Landing.jsx';
import Legal from './pages/Legal.jsx';
import Login from './pages/Login.jsx';

export const LEGAL_PATHS = { '/oferta': 'oferta', '/maxfiylik': 'privacy' };

const parse = () => {
  if (typeof window === 'undefined') return { page: '', tab: '' };
  const legal = LEGAL_PATHS[window.location.pathname.replace(/\/$/, '')];
  if (legal) return { page: 'legal', tab: legal };
  const [, page = '', tab = ''] = window.location.hash.match(/^#\/(\w*)\/?(\w*)/) || [];
  return { page, tab };
};

/** ?ref=<code> on any page: kept until sign-in, where it makes the visitor the inviter's referral (new accounts only). */
function keepRef() {
  try {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && /^[\w-]{4,20}$/.test(ref)) localStorage.setItem('ref', ref);
  } catch { /* storage blocked */ }
}

export default function App() {
  const [route, setRoute] = useState(parse);
  const [me, setMe] = useState(undefined); // undefined: still asking, null: signed out
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    keepRef();
    api.hit();
    api.config().then(setCfg).catch(() => {});
    const on = () => setRoute(parse());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const refreshMe = useCallback(async () => {
    try { setMe(await api.me()); } catch (e) { if (e.status === 401) setMe(null); }
  }, []);
  useEffect(() => { refreshMe(); }, [refreshMe]);

  useEffect(() => { // a signed-out visitor in the account goes to sign-in, a signed-in one on the sign-in page to the account
    if (me === null && route.page === 'app') window.location.replace('#/login');
    if (me && route.page === 'login') window.location.replace('#/app');
  }, [me, route.page]);

  if (route.page === 'legal') return <Legal doc={route.tab} support={cfg?.support_url} />;
  if (route.page === 'app' || route.page === 'login') {
    if (me === undefined) return <div className="grid min-h-screen place-items-center"><Spinner className="h-6 w-6 text-brand-600" /></div>;
    if (route.page === 'login' || !me) return <Login onSignedIn={() => refreshMe().then(() => window.location.replace('#/app'))} />;
    return <Dashboard tab={route.tab} me={me} refreshMe={refreshMe} onSignedOut={() => { setMe(null); window.location.replace('#/'); }} />;
  }
  return <Landing signedIn={!!me} cfg={cfg} />;
}
