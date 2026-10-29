/** The website slidechi.uz: visits, sign-ins, decks made there, invites and promo money (GET /api/admin/web). */
import { useState } from 'react';
import { api } from './api.js';
import ColumnChart from './Chart.jsx';
import { num, som } from './format.js';
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

export default function Website() {
  const [days, setDays] = useState(30);
  const { data, error, reload } = useLoad(() => api.web(days), [days]);
  if (error && !data) return <div className="card"><ErrorBox error={error} retry={reload} /></div>;
  if (!data) return <div className="card"><Loading rows={6} /></div>;
  const k = data.totals;
  const sum = (key) => data.series.reduce((a, d) => a + d[key], 0);
  return (
    <div className="stack">
      <div className="grid kpis">
        <Kpi label={`Tashriflar · ${days} kun`} value={num(sum('visitors'))} foot={`${num(sum('views'))} sahifa ko'rildi`} />
        <Kpi label={`Saytga kirishlar · ${days} kun`} value={num(sum('signins'))} foot={`Hozir ${num(k.sessions)} ta faol sessiya`} />
        <Kpi label="Saytdan foydalanuvchilar" value={num(k.active_users)} foot="30 kunda kirganlar" />
        <Kpi label="Saytda yaratilgan" value={num(k.web_jobs)} foot={`${days} kunda ${num(sum('generates'))} ta`} />
        <Kpi label="Taklif qilinganlar" value={num(k.referrals)} foot={`${num(k.referrals_paid)} tasi uchun bonus · ${som(k.referral_sum)}`} />
        <Kpi label="Promokodlar orqali" value={som(k.promo_sum)} foot="Balansga qo'shilgan" />
      </div>
      <div className="row">
        <div className="seg" role="group" aria-label="Davr">
          {[7, 30, 90].map((d) => <button key={d} type="button" className={days === d ? 'on' : ''} onClick={() => setDays(d)}>{d} kun</button>)}
        </div>
      </div>
      <div className="grid three">
        <div className="card"><div className="card-h"><h2>Tashrif buyuruvchilar</h2><span className="hint">kunlik, takrorlanmas</span></div>
          <div className="card-b"><ColumnChart data={data.series} valueKey="visitors" format={(v) => `${num(v)} ta`} label="Kunlik tashrif buyuruvchilar" /></div></div>
        <div className="card"><div className="card-h"><h2>Saytga kirishlar</h2><span className="hint">kunlik</span></div>
          <div className="card-b"><ColumnChart data={data.series} valueKey="signins" format={(v) => `${num(v)} ta`} label="Kunlik kirishlar" /></div></div>
        <div className="card"><div className="card-h"><h2>Saytda yaratilgan</h2><span className="hint">kunlik</span></div>
          <div className="card-b"><ColumnChart data={data.series} valueKey="generates" format={(v) => `${num(v)} ta`} label="Kunlik taqdimotlar (sayt)" /></div></div>
      </div>
    </div>
  );
}
