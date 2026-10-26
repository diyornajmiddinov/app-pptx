import { useState } from 'react';
import ColumnChart, { HBars } from './Chart.jsx';
import { api } from './api.js';
import { ago, kindName, LANGS, num, signed, som } from './format.js';
import { ErrorBox, Loading, useLoad } from './ui.jsx';

function Kpi({ label, value, foot }) {
  return (
    <div className="card kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value num">{value}</div>
      {foot && <div className="kpi-foot">{foot}</div>}
    </div>
  );
}

export default function Dashboard({ go, openUser }) {
  const [days, setDays] = useState(30);
  const { data, error, reload } = useLoad(() => api.stats(days), [days]);
  if (error && !data) return <div className="card"><ErrorBox error={error} retry={reload} /></div>;
  if (!data) return <div className="card"><Loading rows={8} /></div>;
  const k = data.kpi;
  const share = (n) => (k.generations ? Math.round((n / k.generations) * 100) : 0);

  return (
    <div className="stack">
      {k.pending > 0 && (
        <div className="card card-b row" style={{ borderColor: 'var(--warn)' }}>
          <span className="pill warn">Diqqat</span>
          <span><b>{k.pending}</b> ta karta to'lovi tekshiruvni kutmoqda.</span>
          <button type="button" className="btn sm primary" style={{ marginLeft: 'auto' }} onClick={() => go('payments')}>Ko'rish</button>
        </div>
      )}
      <div className="grid kpis">
        <Kpi label="Foydalanuvchilar" value={num(k.users)} foot={<><span className="up">+{num(k.users_today)}</span> bugun · +{num(k.users_7d)} 7 kunda</>} />
        <Kpi label="Faol foydalanuvchilar" value={num(k.active_7d)} foot={`7 kunda · bugun ${num(k.active_1d)}`} />
        <Kpi label="Taqdimotlar" value={num(k.decks)} foot={<><span className="up">+{num(k.decks_today)}</span> bugun · {num(k.decks_30d)} 30 kunda</>} />
        <Kpi label="Tushum" value={som(k.revenue)} foot={`Bugun ${som(k.revenue_today)} · 30 kunda ${som(k.revenue_30d)}`} />
        <Kpi label="Xizmatlarga sarflangan" value={som(k.spent)} foot={`${num(k.generations)} yaratish · ${num(k.restyles)} shablon almashtirish`} />
        <Kpi label="Foydalanuvchilar balansida" value={som(k.balances)} foot="Hali ishlatilmagan pul" />
        <Kpi label="Muvaffaqiyatsiz yaratishlar" value={num(k.failed_generations)} foot={`${share(k.failed_generations)}% · ${som(k.refunded)} qaytarilgan`} />
        <Kpi label="Tekshiruvdagi to'lovlar" value={num(k.pending)} foot="Karta orqali, skrinshot bilan" />
      </div>

      <div className="row">
        <div className="seg" role="group" aria-label="Davr">
          {[7, 30, 90].map((d) => <button key={d} type="button" className={days === d ? 'on' : ''} onClick={() => setDays(d)}>{d} kun</button>)}
        </div>
      </div>

      <div className="grid three">
        <div className="card"><div className="card-h"><h2>Yangi foydalanuvchilar</h2><span className="hint">kunlik</span></div>
          <div className="card-b"><ColumnChart data={data.series} valueKey="users" format={(v) => `${num(v)} ta`} label="Kunlik yangi foydalanuvchilar" /></div></div>
        <div className="card"><div className="card-h"><h2>Yaratilgan taqdimotlar</h2><span className="hint">kunlik</span></div>
          <div className="card-b"><ColumnChart data={data.series} valueKey="decks" format={(v) => `${num(v)} ta`} label="Kunlik taqdimotlar" /></div></div>
        <div className="card"><div className="card-h"><h2>Tushum</h2><span className="hint">kunlik, so'm</span></div>
          <div className="card-b"><ColumnChart data={data.series} valueKey="revenue" format={som} label="Kunlik tushum" /></div></div>
      </div>

      <div className="grid three">
        <div className="card"><div className="card-h"><h2>Mashhur shablonlar</h2><span className="hint">taqdimotlar soni</span></div>
          <div className="card-b">{data.templates.length
            ? <HBars items={data.templates.map((t) => ({ key: t.id, name: `${t.id}. ${t.name}`, n: t.n }))} />
            : <div className="empty">Hali yo'q</div>}</div></div>
        <div className="card"><div className="card-h"><h2>Tillar</h2><span className="hint">foydalanuvchilar</span></div>
          <div className="card-b"><HBars items={data.langs.map((l) => ({ key: l.lang, name: LANGS[l.lang] || l.lang, n: l.n }))} /></div></div>
        <div className="card"><div className="card-h"><h2>So'nggi harakatlar</h2>
          <button type="button" className="btn sm" style={{ marginLeft: 'auto' }} onClick={() => go('ledger')}>Hammasi</button></div>
          <table><tbody>
            {data.recent.map((r) => (
              <tr key={r.id} className="click" onClick={() => openUser(r.user_id)}>
                <td><div className="who">{r.first_name || r.user_id}<small>{kindName(r.kind)} · {ago(r.created)}</small></div></td>
                <td className={`r num ${r.delta > 0 ? 'plus' : 'minus'}`}>{signed(r.delta)}</td>
              </tr>
            ))}
          </tbody></table></div>
      </div>
    </div>
  );
}
