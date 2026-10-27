import { useState } from 'react';
import { api } from './api.js';
import { ago, date, dateTime, fullName, kindName, LANGS, num, ORDER_STATES, PROVIDERS, signed, som } from './format.js';
import { DeckDownload } from './Decks.jsx';
import { Drawer, ErrorBox, Icon, Loading, Pager, Pill, useConfirm, useDebounced, useLoad, useToast } from './ui.jsx';

const COLS = [
  ['id', 'Foydalanuvchi'], ['lang', 'Til', false], ['balance', 'Balans', true], ['paid', "To'lagan", true],
  ['decks', 'Taqdimot', true], ['created', "Qo'shilgan"], ['last_seen', 'Oxirgi faollik'],
];

export default function Users({ openUser }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState({ key: 'created', desc: true });
  const [page, setPage] = useState(1);
  const size = 25;
  const dq = useDebounced(q);
  const { data, error, reload } = useLoad(() => api.users({ q: dq, sort: sort.key, desc: sort.desc, page, size }), [dq, sort, page]);
  const by = (key) => { setPage(1); setSort((s) => ({ key, desc: s.key === key ? !s.desc : true })); };

  return (
    <div className="card">
      <div className="card-h">
        <input className="input search" placeholder="Ism, @username yoki Telegram ID" value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Qidirish" />
        <select className="select show-sm" value={`${sort.key}:${sort.desc ? 'desc' : 'asc'}`} aria-label="Saralash"
          onChange={(e) => { const [key, dir] = e.target.value.split(':'); setPage(1); setSort({ key, desc: dir === 'desc' }); }}>
          {COLS.filter(([key]) => key !== 'lang').flatMap(([key, label]) => [
            <option key={`${key}d`} value={`${key}:desc`}>{label} ↓</option>, <option key={`${key}a`} value={`${key}:asc`}>{label} ↑</option>])}
        </select>
        {data && <span className="hint">{num(data.total)} ta</span>}
      </div>
      {error && !data ? <ErrorBox error={error} retry={reload} /> : !data ? <Loading /> : (
        <>
          <div className="table-wrap"><table className="cards">
            <thead><tr>{COLS.map(([key, label, right]) => (
              <th key={key} className={`${right ? 'r' : ''} ${key !== 'lang' ? 'sortable' : ''}`} onClick={() => key !== 'lang' && by(key)}>
                {label}{sort.key === key ? (sort.desc ? ' ↓' : ' ↑') : ''}
              </th>))}</tr></thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u.id} className="click" onClick={() => openUser(u.id)}>
                  <td className="full"><div className="who">{fullName(u)}<small>{u.username ? `@${u.username} · ` : ''}{u.id}</small></div></td>
                  <td className="hide-sm">{LANGS[u.lang] || '—'}</td>
                  <td className="r num" data-label="Balans">{som(u.balance)}</td>
                  <td className="r num" data-label="To'lagan">{som(u.paid)}</td>
                  <td className="r num" data-label="Taqdimot">{u.decks}</td>
                  <td className="hide-sm">{date(u.created)}</td>
                  <td data-label="Oxirgi faollik">{ago(u.last_seen)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
          {!data.items.length && <div className="empty">Hech kim topilmadi</div>}
          <Pager page={page} size={size} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
}

export function UserDrawer({ id, onClose, onChanged }) {
  const { data, error, reload } = useLoad(() => api.user(id), [id]);
  const [tab, setTab] = useState('ledger');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [notify, setNotify] = useState(true);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();

  const changeBalance = async (sign) => {
    const v = Math.round(Number(String(amount).replace(/\s/g, '')));
    if (!v || v <= 0) { toast('Summani kiriting', true); return; }
    const delta = sign * v;
    if (!await confirm({ title: delta > 0 ? "Balansga qo'shish" : 'Balansdan ayirish', danger: delta < 0,
      body: <>{fullName(data.user)} balansiga <b>{signed(delta)} so'm</b>. Yangi balans: <b>{som(data.user.balance + delta)}</b>.</> })) return;
    setBusy(true);
    try {
      const r = await api.balance(id, { amount: delta, note, notify: notify && delta > 0 });
      toast(`Yangi balans: ${som(r.balance)}`); setAmount(''); setNote(''); reload(); onChanged?.();
    } catch (e) { toast(e.message, true); } finally { setBusy(false); }
  };

  const send = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try { await api.message(id, text.trim()); toast('Xabar yuborildi'); setText(''); } catch (e) { toast(e.message, true); } finally { setBusy(false); }
  };

  return (
    <Drawer onClose={onClose}>
      {confirmNode}
      <div className="drawer-h">
        <div className="avatar">{(data?.user.first_name || '?').slice(0, 1).toUpperCase()}</div>
        <div className="who" style={{ fontSize: 16, fontWeight: 600 }}>
          {data ? fullName(data.user) : '…'}
          <small>{data?.user.username ? <a href={`https://t.me/${data.user.username}`} target="_blank" rel="noreferrer">@{data.user.username}</a> : null} {id}</small>
        </div>
        <button type="button" className="btn icon" style={{ marginLeft: 'auto' }} onClick={onClose} aria-label="Yopish"><Icon name="close" /></button>
      </div>
      {error && !data ? <ErrorBox error={error} retry={reload} /> : !data ? <Loading rows={10} /> : (
        <div className="drawer-b">
          <div className="dl">
            <div><span>Balans</span><b className="num">{som(data.user.balance)}</b></div>
            <div><span>To'lagan</span><b className="num">{som(data.user.paid)}</b></div>
            <div><span>Sarflagan</span><b className="num">{som(data.totals.spent)}</b></div>
            <div><span>Taqdimotlar</span><b className="num">{data.totals.generations} + {data.totals.restyles} almashtirish</b></div>
            <div><span>Qo'shilgan</span><b>{date(data.user.created)}</b></div>
            <div><span>Oxirgi faollik</span><b>{ago(data.user.last_seen)}</b></div>
            <div><span>Til</span><b>{LANGS[data.user.lang] || '—'}</b></div>
            <div><span>Telegram tili</span><b>{data.user.language_code || '—'}</b></div>
            <div><span>Qaytarilgan</span><b className="num">{som(data.totals.refunded)}</b></div>
          </div>

          <div className="grid two">
            <div className="card card-b stack" style={{ gap: 10 }}>
              <b>Balansni o'zgartirish</b>
              <input className="input num" inputMode="numeric" placeholder="Summa, so'm" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <input className="input" placeholder="Izoh (masalan: naqd to'lov)" value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} />
              <label className="row" style={{ fontSize: 13, color: 'var(--text-2)' }}>
                <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} /> Qo'shilganda foydalanuvchiga xabar berish
              </label>
              <div className="row">
                <button type="button" className="btn good" disabled={busy} onClick={() => changeBalance(1)}>+ Qo'shish</button>
                <button type="button" className="btn danger" disabled={busy} onClick={() => changeBalance(-1)}>− Ayirish</button>
              </div>
            </div>
            <div className="card card-b stack" style={{ gap: 10 }}>
              <b>Xabar yuborish</b>
              <textarea className="textarea" style={{ minHeight: 88 }} placeholder="Bot nomidan shu foydalanuvchiga" value={text} maxLength={4000} onChange={(e) => setText(e.target.value)} />
              <div className="row"><button type="button" className="btn primary" disabled={busy || !text.trim()} onClick={send}>Yuborish</button></div>
            </div>
          </div>

          <div className="card">
            <div className="tabs" style={{ padding: '0 12px' }}>
              {[['ledger', `Tranzaksiyalar (${data.ledger.length})`], ['decks', `Taqdimotlar (${data.decks.length})`], ['orders', `Buyurtmalar (${data.orders.length})`]]
                .map(([k, l]) => <button key={k} type="button" className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
            </div>
            <div className="table-wrap">
              {tab === 'ledger' && <table><tbody>{data.ledger.map((l) => (
                <tr key={l.id}><td>{dateTime(l.created)}</td><td>{kindName(l.kind)}</td>
                  <td className={`r num ${l.delta > 0 ? 'plus' : ''}`}>{signed(l.delta)}</td></tr>))}</tbody></table>}
              {tab === 'decks' && <table className="cards"><tbody>{data.decks.map((d) => (
                <tr key={d.id}><td className="ellipsis full" title={d.topic}>{d.topic}</td><td data-label="Shablon">{d.template_id}. {d.template}</td>
                  <td className="r num" data-label="Slayd">{d.slides} sl.</td><td data-label="Sana">{date(d.created)}</td><td className="r"><DeckDownload id={d.id} /></td></tr>))}</tbody></table>}
              {tab === 'orders' && <table className="cards"><tbody>{data.orders.map((o) => (
                <tr key={o.id}><td data-label="ID">T-{String(o.id).padStart(6, '0')}</td><td data-label="Usul">{PROVIDERS[o.provider] || o.provider}</td>
                  <td className="r num" data-label="Summa">{som(o.amount)}</td><td data-label="Holat"><Pill tone={ORDER_STATES[o.state]?.[1]}>{ORDER_STATES[o.state]?.[0] || o.state}</Pill></td>
                  <td data-label="Sana">{dateTime(o.created)}</td></tr>))}</tbody></table>}
              {!data[tab].length && <div className="empty">Bo'sh</div>}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
