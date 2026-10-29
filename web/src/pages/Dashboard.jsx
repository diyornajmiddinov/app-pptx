/** The signed-in part: header with the balance, tabs, and the section the hash points at (#/app/<tab>). */
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { Button, LangSwitch, Logo, btnCls } from '../components/ui.jsx';
import { useI18n } from '../i18n.jsx';
import Balance from './Balance.jsx';
import Create from './Create.jsx';
import Decks from './Decks.jsx';
import Pdf from './Pdf.jsx';

const TABS = [['create', 'tabCreate', Create], ['decks', 'tabDecks', Decks], ['balance', 'tabBalance', Balance], ['pdf', 'tabPdf', Pdf]];

export default function Dashboard({ tab, me, refreshMe, onSignedOut }) {
  const { t, money } = useI18n();
  const [menu, setMenu] = useState(false);
  const current = TABS.find(([id]) => id === tab) || TABS[0];
  const Page = current[2];
  const go = useCallback((id) => { window.location.hash = `#/app/${id}`; }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  const signOut = async (everywhere) => {
    try { await api.logout(everywhere); } catch { /* the cookie is gone either way on the next 401 */ }
    onSignedOut();
  };
  const name = [me.user.first_name, me.user.last_name].filter(Boolean).join(' ') || (me.user.username ? `@${me.user.username}` : me.user.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go('balance')}
              className="rounded-xl bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-200">
              {money(me.balance)}
            </button>
            <LangSwitch />
            <div className="relative">
              <button type="button" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(!menu)}
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                {String(name).replace('@', '').charAt(0).toUpperCase()}
              </button>
              {menu && (
                <>
                  <button type="button" className="fixed inset-0 z-10 cursor-default" aria-label="close" onClick={() => setMenu(false)} />
                  <div role="menu" className="absolute right-0 z-20 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                    <div className="px-3 py-2">
                      <p className="text-xs text-slate-500">{t('signedInAs')}</p>
                      <p className="truncate font-semibold text-slate-900 dark:text-white">{name}</p>
                      {me.user.username && <p className="truncate text-sm text-slate-500">@{me.user.username}</p>}
                    </div>
                    {me.support_url && <a href={me.support_url} target="_blank" rel="noopener noreferrer" className={btnCls('ghost', 'w-full justify-start')}>{t('support')}</a>}
                    <Button variant="ghost" className="w-full justify-start" onClick={() => signOut(false)}>{t('signOut')}</Button>
                    <Button variant="danger" className="w-full justify-start" onClick={() => signOut(true)}>{t('signOutAll')}</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <nav className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {TABS.map(([id, key]) => (
            <a key={id} href={`#/app/${id}`} aria-current={id === current[0] ? 'page' : undefined}
              className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold transition ${id === current[0]
                ? 'border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
              {t(key)}
            </a>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Page me={me} refreshMe={refreshMe} go={go} />
      </main>
    </div>
  );
}
