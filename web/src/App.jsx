/**
 * slidechi.uz: the home page (#/), sign-in (#/login) and the account (#/app/<tab>).
 * Whether the visitor is signed in is known only from /api/web/me: the session cookie is httpOnly.
 */
import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import { Spinner } from './components/ui.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';

const parse = () => {
  const [, page = '', tab = ''] = window.location.hash.match(/^#\/(\w*)\/?(\w*)/) || [];
  return { page, tab };
};

export default function App() {
  const [route, setRoute] = useState(parse);
  const [me, setMe] = useState(undefined); // undefined: still asking, null: signed out

  useEffect(() => {
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

  if (route.page === 'app' || route.page === 'login') {
    if (me === undefined) return <div className="grid min-h-screen place-items-center"><Spinner className="h-6 w-6 text-brand-600" /></div>;
    if (route.page === 'login' || !me) return <Login onSignedIn={() => refreshMe().then(() => window.location.replace('#/app'))} />;
    return <Dashboard tab={route.tab} me={me} refreshMe={refreshMe} onSignedOut={() => { setMe(null); window.location.replace('#/'); }} />;
  }
  return <Landing signedIn={!!me} />;
}
