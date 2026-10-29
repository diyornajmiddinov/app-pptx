/** Promo codes for the website: create (code, amount, uses, days), switch off / on. Redeemed once per user. */
import { useState } from 'react';
import { api } from './api.js';
import { dateTime, num, som } from './format.js';
import { ErrorBox, Loading, Pill, useLoad, useToast } from './ui.jsx';

const parse = (s) => (String(s).trim() === '' ? null : Math.round(Number(String(s).replace(/\s/g, ''))));

export default function Promos() {
  const { data, error, reload } = useLoad(() => api.promos(), []);
  const [form, setForm] = useState({ code: '', amount: '5000', max_uses: '', days: '' });
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const valid = /^[A-Za-z0-9_-]{3,32}$/.test(form.code.trim()) && parse(form.amount) >= 100;

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.createPromo({ code: form.code.trim(), amount: parse(form.amount), max_uses: parse(form.max_uses), days: parse(form.days) });
      toast('Promokod yaratildi'); setForm({ ...form, code: '' }); reload();
    } catch (err) { toast(err.message, true); } finally { setBusy(false); }
  };
  const toggle = async (p) => {
    try { await api.promoActive(p.id, !p.active); reload(); } catch (err) { toast(err.message, true); }
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="card-h"><h2>Yangi promokod</h2><span className="hint">saytdagi «Balans» bo'limida kiritiladi, har kim bir marta</span></div>
        <form className="card-b grid two" onSubmit={create} style={{ alignItems: 'end' }}>
          <div className="field"><label htmlFor="pc">Kod</label><input id="pc" className="input" value={form.code} onChange={set('code')} placeholder="BAHOR2026" maxLength={32} style={{ textTransform: 'uppercase' }} /></div>
          <div className="field"><label htmlFor="pa">Summa (so'm)</label><input id="pa" className="input num" inputMode="numeric" value={form.amount} onChange={set('amount')} /></div>
          <div className="field"><label htmlFor="pu">Necha kishi (bo'sh — cheksiz)</label><input id="pu" className="input num" inputMode="numeric" value={form.max_uses} onChange={set('max_uses')} /></div>
          <div className="field"><label htmlFor="pd">Necha kun amal qiladi (bo'sh — muddatsiz)</label><input id="pd" className="input num" inputMode="numeric" value={form.days} onChange={set('days')} /></div>
          <div className="row"><button type="submit" className="btn primary" disabled={busy || !valid}>Yaratish</button></div>
        </form>
      </div>
      <div className="card">
        <div className="card-h"><h2>Promokodlar</h2></div>
        {error && !data ? <ErrorBox error={error} retry={reload} /> : !data ? <Loading rows={4} /> : (
          <div className="table-wrap"><table className="cards">
            <thead><tr><th>Kod</th><th className="r">Summa</th><th className="r">Ishlatilgan</th><th>Muddati</th><th>Holat</th><th /></tr></thead>
            <tbody>{data.items.map((p) => (
              <tr key={p.id}>
                <td data-label="Kod"><b className="num">{p.code}</b></td>
                <td data-label="Summa" className="r num">{som(p.amount)}</td>
                <td data-label="Ishlatilgan" className="r num">{num(p.uses)}{p.max_uses ? ` / ${num(p.max_uses)}` : ''}</td>
                <td data-label="Muddati">{p.expires ? dateTime(p.expires) : 'Muddatsiz'}</td>
                <td data-label="Holat">{p.active ? <Pill tone="good">Faol</Pill> : <Pill>O'chirilgan</Pill>}</td>
                <td className="r"><button type="button" className="btn sm" onClick={() => toggle(p)}>{p.active ? "O'chirish" : 'Yoqish'}</button></td>
              </tr>
            ))}
            {!data.items.length && <tr><td colSpan={6} style={{ color: 'var(--muted)' }}>Hali promokod yo'q</td></tr>}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
