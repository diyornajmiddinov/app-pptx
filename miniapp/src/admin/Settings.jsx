import { useEffect, useState } from 'react';
import { api } from './api.js';
import { bytes, dateTime, duration, num, som } from './format.js';
import { ErrorBox, Loading, Pager, Pill, useConfirm, useLoad, useToast } from './ui.jsx';

const parse = (s) => Math.round(Number(String(s).replace(/\s/g, '')));

export default function Settings() {
  const { data, error, reload } = useLoad(() => api.settings(), []);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();

  useEffect(() => {
    if (data) setForm({ gen: data.values.price_generate, restyle: data.values.price_restyle, topup: data.values.topup_amounts.join(', ') });
  }, [data]);

  if (error && !data) return <div className="card"><ErrorBox error={error} retry={reload} /></div>;
  if (!data || !form) return <div className="card"><Loading rows={8} /></div>;
  const s = data.system;
  const topup = form.topup.split(/[,;]/).map(parse).filter((v) => v > 0);
  const valid = Number.isFinite(parse(form.gen)) && parse(form.gen) >= 0 && Number.isFinite(parse(form.restyle)) && parse(form.restyle) >= 0 && topup.length > 0;

  const save = async () => {
    const body = { price_generate: parse(form.gen), price_restyle: parse(form.restyle), topup_amounts: topup };
    if (!await confirm({ title: 'Narxlarni saqlash', body: <>
      Yangi taqdimot: <b>{som(body.price_generate)}</b><br />Shablon almashtirish: <b>{som(body.price_restyle)}</b><br />
      To'ldirish: {body.topup_amounts.map(som).join(', ')}<br /><br />Bot va Mini App darhol yangi narxlarni ko'rsatadi.</> })) return;
    setBusy(true);
    try { await api.saveSettings(body); toast('Saqlandi'); reload(); } catch (e) { toast(e.message, true); } finally { setBusy(false); }
  };

  const Provider = ({ on, name, note }) => (
    <tr><td>{name}</td><td>{on ? <Pill tone="good">Ulangan</Pill> : <Pill>Ulanmagan</Pill>}</td><td style={{ color: 'var(--muted)', whiteSpace: 'normal', fontSize: 12 }}>{note}</td></tr>
  );

  return (
    <div className="stack">
      {confirmNode}
      <div className="grid two" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-h"><h2>Narxlar</h2><span className="hint">so'mda</span></div>
          <div className="card-b stack" style={{ gap: 14 }}>
            <div className="field"><label htmlFor="p-gen">Yangi taqdimot</label>
              <input id="p-gen" className="input num" inputMode="numeric" value={form.gen} onChange={(e) => setForm({ ...form, gen: e.target.value })} />
              <span className="help">.env dagi qiymat: {som(data.defaults.price_generate)}</span></div>
            <div className="field"><label htmlFor="p-rs">Boshqa shablonga o'tkazish</label>
              <input id="p-rs" className="input num" inputMode="numeric" value={form.restyle} onChange={(e) => setForm({ ...form, restyle: e.target.value })} />
              <span className="help">.env dagi qiymat: {som(data.defaults.price_restyle)}</span></div>
            <div className="field"><label htmlFor="p-top">To'ldirish summalari (/balance tugmalari)</label>
              <input id="p-top" className="input num" value={form.topup} onChange={(e) => setForm({ ...form, topup: e.target.value })} />
              <span className="help">Vergul bilan, 1 000 – 10 000 000, ko'pi bilan 8 ta</span></div>
            <div className="row"><button type="button" className="btn primary" disabled={busy || !valid} onClick={save}>Saqlash</button></div>
          </div>
        </div>
        <div className="stack">
          <div className="card">
            <div className="card-h"><h2>To'lov usullari</h2></div>
            <table><tbody>
              <Provider on={data.providers.card} name="Karta (skrinshot)" note="CARD_NUMBER, ADMIN_IDS" />
              <Provider on={data.providers.payme} name="Payme" note={data.providers.payme_test ? 'test rejimi' : 'ishchi rejim'} />
              <Provider on={data.providers.click} name="Click" note="CLICK_SERVICE_ID, MERCHANT_ID, SECRET_KEY" />
            </tbody></table>
          </div>
          <div className="card">
            <div className="card-h"><h2>AI</h2></div>
            <table><tbody>
              <tr><td>Matn</td><td>{data.ai.model}</td></tr>
              <tr><td>Rasmlar</td><td>{data.ai.photos}</td></tr>
              <tr><td>Adminlar</td><td className="num">{data.admins.join(', ')}</td></tr>
            </tbody></table>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-h"><h2>Server</h2><button type="button" className="btn sm" style={{ marginLeft: 'auto' }} onClick={reload}>Yangilash</button></div>
        <div className="card-b">
          <div className="dl">
            <div><span>Backend ishlayapti</span><b>{duration(s.uptime)}</b></div>
            <div><span>Disk bo'sh</span><b>{bytes(s.disk_free)} / {bytes(s.disk_total)}</b></div>
            <div><span>RAM bo'sh</span><b>{s.ram ? `${bytes(s.ram.available)} / ${bytes(s.ram.total)}` : '—'}</b></div>
            <div><span>Yuklama (1/5/15 daq)</span><b className="num">{s.load.map((v) => v.toFixed(2)).join(' · ')}</b></div>
            <div><span>Baza hajmi</span><b>{bytes(s.db_size)}</b></div>
            <div><span>Fayllar (data/)</span><b>{bytes(s.data_size)}</b></div>
            <div><span>Foydalanuvchilar / taqdimotlar</span><b className="num">{num(s.rows.users)} / {num(s.rows.decks)}</b></div>
            <div><span>Tranzaksiyalar / buyurtmalar</span><b className="num">{num(s.rows.ledger)} / {num(s.rows.orders)}</b></div>
            <div><span>Baza</span><b>{s.postgres}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ACTIONS = { balance: "Balans o'zgartirildi", message: 'Xabar yuborildi', card_paid: "Karta to'lovi tasdiqlandi",
  card_rejected: "Karta to'lovi rad etildi", broadcast: 'Ommaviy xabar', settings: "Sozlamalar o'zgartirildi" };

export function AdminLog() {
  const [page, setPage] = useState(1);
  const size = 50;
  const { data, error, reload } = useLoad(() => api.log({ page, size }), [page]);
  return (
    <div className="card">
      {error && !data ? <ErrorBox error={error} retry={reload} /> : !data ? <Loading /> : (
        <>
          <div className="table-wrap"><table>
            <thead><tr><th>Sana</th><th>Admin</th><th>Amal</th><th>Obyekt</th><th>Tafsilot</th></tr></thead>
            <tbody>{data.items.map((a) => (
              <tr key={a.id}>
                <td>{dateTime(a.created)}</td>
                <td><div className="who">{a.first_name || a.admin_id}<small>{a.username ? `@${a.username}` : a.admin_id}</small></div></td>
                <td>{ACTIONS[a.action] || a.action}</td>
                <td className="num">{a.target || '—'}</td>
                <td>{a.details ? <pre className="json">{JSON.stringify(a.details, null, 1)}</pre> : '—'}</td>
              </tr>))}</tbody>
          </table></div>
          {!data.items.length && <div className="empty">Hali hech narsa qilinmagan</div>}
          <Pager page={page} size={size} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
}
