import { useState } from 'react';
import { api } from './api.js';
import { dateTime, kindName, num, signed } from './format.js';
import { ErrorBox, Loading, Pager, useDebounced, useLoad } from './ui.jsx';

export default function Ledger({ openUser }) {
  const [kind, setKind] = useState('');
  const [user, setUser] = useState('');
  const [page, setPage] = useState(1);
  const size = 50;
  const du = useDebounced(user);
  const userId = /^\d+$/.test(du.trim()) ? du.trim() : '';
  const { data, error, reload } = useLoad(() => api.ledger({ kind, user_id: userId, page, size }), [kind, userId, page]);

  return (
    <div className="stack">
      {data && (
        <div className="grid kpis">
          {data.kinds.slice(0, 8).map((k) => (
            <button key={k.kind} type="button" className="card kpi" style={{ textAlign: 'left', cursor: 'pointer', borderColor: kind === k.kind ? 'var(--accent)' : undefined }}
              onClick={() => { setKind(kind === k.kind ? '' : k.kind); setPage(1); }}>
              <div className="kpi-label">{kindName(k.kind)}</div>
              <div className="kpi-value num" style={{ fontSize: 20 }}>{signed(k.total)}</div>
              <div className="kpi-foot">{num(k.n)} ta yozuv</div>
            </button>
          ))}
        </div>
      )}
      <div className="card">
        <div className="card-h">
          <select className="select" value={kind} onChange={(e) => { setKind(e.target.value); setPage(1); }} aria-label="Turi">
            <option value="">Barcha turlar</option>
            {data?.kinds.map((k) => <option key={k.kind} value={k.kind}>{kindName(k.kind)}</option>)}
          </select>
          <input className="input" style={{ width: 220 }} placeholder="Telegram ID bo'yicha" value={user}
            onChange={(e) => { setUser(e.target.value); setPage(1); }} aria-label="Foydalanuvchi ID" />
          {data && <span className="hint">{num(data.total)} ta</span>}
        </div>
        {error && !data ? <ErrorBox error={error} retry={reload} /> : !data ? <Loading /> : (
          <>
            <div className="table-wrap"><table>
              <thead><tr><th>#</th><th>Sana</th><th>Foydalanuvchi</th><th>Turi</th><th>Manba</th><th className="r">Summa</th></tr></thead>
              <tbody>{data.items.map((l) => (
                <tr key={l.id} className="click" onClick={() => openUser(l.user_id)}>
                  <td className="num">{l.id}</td><td>{dateTime(l.created)}</td>
                  <td><div className="who">{l.first_name || '—'}<small>{l.username ? `@${l.username} · ` : ''}{l.user_id}</small></div></td>
                  <td>{kindName(l.kind)}</td><td style={{ color: 'var(--muted)' }}>{l.ref || ''}</td>
                  <td className={`r num ${l.delta > 0 ? 'plus' : ''}`}>{signed(l.delta)}</td>
                </tr>))}</tbody>
            </table></div>
            {!data.items.length && <div className="empty">Yozuv yo'q</div>}
            <Pager page={page} size={size} total={data.total} onPage={setPage} />
          </>
        )}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0 }}>Summalar so'mda. Har bir pul harakati shu yerda yoziladi, balans faqat shu yozuvlar orqali o'zgaradi.</p>
    </div>
  );
}
