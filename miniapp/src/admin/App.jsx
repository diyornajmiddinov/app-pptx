/**
 * SlideAI admin panel: sidebar + one page at a time (#/dashboard, #/users, ...). Opened from the bot's /admin link.
 */
import { useCallback, useEffect, useState } from 'react';
import { api, logout, TOKEN } from './api.js';
import Broadcast from './Broadcast.jsx';
import Dashboard from './Dashboard.jsx';
import Decks from './Decks.jsx';
import Ledger from './Ledger.jsx';
import Payments from './Payments.jsx';
import Settings, { AdminLog } from './Settings.jsx';
import Users, { UserDrawer } from './Users.jsx';
import { Icon, useLoad } from './ui.jsx';

const PAGES = [
  ['dashboard', 'Boshqaruv paneli', 'Umumiy ko\'rsatkichlar'],
  ['users', 'Foydalanuvchilar', 'Balans, tarix va xabar'],
  ['payments', "To'lovlar", 'Buyurtmalar va karta cheklari'],
  ['ledger', 'Tranzaksiyalar', 'Har bir pul harakati'],
  ['decks', 'Taqdimotlar', 'Yaratilgan barcha taqdimotlar'],
  ['broadcast', 'Xabar yuborish', 'Bot foydalanuvchilariga ommaviy xabar'],
  ['settings', 'Sozlamalar', 'Narxlar, to\'lov usullari, server'],
  ['log', 'Admin jurnali', 'Adminlar qilgan o\'zgarishlar'],
];

const route = () => (window.location.hash.match(/^#\/(\w+)/) || [])[1] || 'dashboard';

function useTheme() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('slideai-admin-theme') || ''; } catch { return ''; } });
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme; else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('slideai-admin-theme', theme); } catch { /* ignore */ }
  }, [theme]);
  const dark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  return [dark, () => setTheme(dark ? 'light' : 'dark')];
}

function Expired() {
  return (
    <div className="center-screen">
      <div className="card">
        <div className="brand-mark" style={{ margin: '0 auto 14px', width: 44, height: 44, fontSize: 18 }}>S</div>
        <h2 style={{ margin: '0 0 8px' }}>Kirish uchun havola kerak</h2>
        <p style={{ color: 'var(--text-2)', margin: 0 }}>
          Havola eskirgan yoki yo'q. Botga <b>/admin</b> deb yozing va kelgan tugma orqali qayta oching.
          Havola 12 soat amal qiladi.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(route);
  const [userId, setUserId] = useState(null);
  const [expired, setExpired] = useState(!TOKEN);
  const [dark, toggleTheme] = useTheme();
  const [tick, setTick] = useState(0); // the refresh button: reload the current page
  const me = useLoad(() => (TOKEN ? api.me() : Promise.reject(new Error('no token'))), []);
  const pending = useLoad(() => (TOKEN ? api.orders({ state: 'review', size: 1 }) : Promise.resolve({ total: 0 })), []);

  useEffect(() => {
    const onHash = () => setPage(route());
    const onExpired = () => setExpired(true);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('admin-expired', onExpired);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('admin-expired', onExpired); };
  }, []);
  useEffect(() => { // keep the pending-payments badge fresh
    const id = setInterval(pending.reload, 60000);
    return () => clearInterval(id);
  }, [pending.reload]);

  const go = useCallback((p) => { window.location.hash = `#/${p}`; }, []);
  const changed = pending.reload; // a payment decided / balance changed: the badge may change
  if (expired) return <Expired />;

  const [, title, sub] = PAGES.find((p) => p[0] === page) || PAGES[0];
  const props = { go, openUser: setUserId, onChanged: changed };
  const body = {
    dashboard: <Dashboard {...props} />, users: <Users {...props} />, payments: <Payments {...props} />,
    ledger: <Ledger {...props} />, decks: <Decks {...props} />, broadcast: <Broadcast />, settings: <Settings />, log: <AdminLog />,
  }[page] || <Dashboard {...props} />;

  return (
    <div className="shell">
      <nav className="side" aria-label="Bo'limlar">
        <div className="brand"><div className="brand-mark">S</div><div>SlideAI<small>Admin panel</small></div></div>
        {PAGES.map(([key, label]) => (
          <button key={key} type="button" className={`nav-item ${page === key ? 'active' : ''}`} onClick={() => go(key)} aria-current={page === key ? 'page' : undefined}>
            <Icon name={key} />{label}
            {key === 'payments' && pending.data?.total > 0 && <span className="nav-badge">{pending.data.total}</span>}
          </button>
        ))}
        <div className="side-foot">
          <b>{me.data?.name || '…'}</b>{me.data?.username ? `@${me.data.username}` : me.data?.id}
        </div>
      </nav>
      <main className="main">
        <header className="top">
          <div><h1>{title}</h1><div className="sub">{sub}</div></div>
          <div className="top-actions">
            <button type="button" className="btn icon" onClick={() => { setTick((t) => t + 1); pending.reload(); }} title="Yangilash" aria-label="Yangilash"><Icon name="refresh" /></button>
            <button type="button" className="btn icon" onClick={toggleTheme} title={dark ? "Yorug' rejim" : "Qorong'i rejim"} aria-label="Mavzu"><Icon name={dark ? 'sun' : 'moon'} /></button>
            <button type="button" className="btn" onClick={() => { logout(); setExpired(true); }}><Icon name="logout" />Chiqish</button>
          </div>
        </header>
        <div key={`${page}-${tick}`}>{body}</div>
      </main>
      {userId && <UserDrawer id={userId} onClose={() => setUserId(null)} onChanged={changed} />}
    </div>
  );
}
