import { useEffect, useState } from 'react';
import { api } from './api.js';
import { bytes, dateTime, duration, num, som } from './format.js';
import { ErrorBox, Loading, Pager, Pill, useConfirm, useLoad, useToast } from './ui.jsx';

const parse = (s) => Math.round(Number(String(s).replace(/\s/g, '')));

export default function Settings() {
  const { data, error, reload } = useLoad(() => api.settings(), []);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sub, setSub] = useState({ channel: '', link: '' });
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();

  useEffect(() => {
    if (data) setForm({ gen: data.values.price_generate, restyle: data.values.price_restyle, paper: data.values.price_paper, topup: data.values.topup_amounts.join(', '),
      ref: data.values.referral_bonus ?? 0, first: data.values.first_generate_price ?? '' });
    if (data) setSub({ channel: data.values.required_channel || '', link: data.values.required_channel_link || '' });
  }, [data]);

  if (error && !data) return <div className="card"><ErrorBox error={error} retry={reload} /></div>;
  if (!data || !form) return <div className="card"><Loading rows={8} /></div>;
  const s = data.system;
  const topup = form.topup.split(/[,;]/).map(parse).filter((v) => v > 0);
  const valid = [form.gen, form.restyle, form.paper].every((v) => Number.isFinite(parse(v)) && parse(v) >= 0) && topup.length > 0;

  const save = async () => {
    const first = String(form.first).trim() === '' ? null : parse(form.first);
    const body = { price_generate: parse(form.gen), price_restyle: parse(form.restyle), price_paper: parse(form.paper), topup_amounts: topup,
      referral_bonus: parse(form.ref) || 0, first_generate_price: first };
    if (!await confirm({ title: 'Narxlarni saqlash', body: <>
      Yangi taqdimot: <b>{som(body.price_generate)}</b><br />Shablon almashtirish: <b>{som(body.price_restyle)}</b><br />Referat (sayt): <b>{som(body.price_paper)}</b><br />
      To'ldirish: {body.topup_amounts.map(som).join(', ')}<br />
      Taklif bonusi: <b>{som(body.referral_bonus)}</b><br />Birinchi taqdimot: <b>{first === null ? "oddiy narx" : first === 0 ? 'tekin' : som(first)}</b>
      <br /><br />Bot, Mini App va sayt darhol yangi narxlarni ko'rsatadi.</> })) return;
    setBusy(true);
    try { await api.saveSettings(body); toast('Saqlandi'); reload(); } catch (e) { toast(e.message, true); } finally { setBusy(false); }
  };

  const changeModel = async (model) => {
    if (model === data.ai.model) return;
    if (!await confirm({ title: 'AI modelini almashtirish', body: <>
      Yangi taqdimot, referat va rejalarni endi <b>{data.ai.choices[model]}</b> yozadi.<br /><br />
      Bot, Mini App va sayt bir necha soniyada shu modelga o'tadi. Navbatda turgan ishlar ham yangi model bilan yoziladi.</> })) return;
    setBusy(true);
    try { await api.saveAiModel(model); toast('Model almashtirildi'); reload(); } catch (e) { toast(e.message, true); } finally { setBusy(false); }
  };

  const saveSub = async (off) => {
    const channel = off ? '' : sub.channel.trim();
    if (off && !await confirm({ title: "Majburiy obunani o'chirish", body: <>Bot hammaga kanalga a'zo bo'lmasdan ishlaydi.</> })) return;
    setBusy(true);
    try {
      const r = await api.saveSubscription(channel, off ? '' : sub.link.trim());
      toast(channel ? `Yoqildi: ${r.title || r.required_channel}` : "O'chirildi"); reload();
    } catch (e) { toast(e.message, true); } finally { setBusy(false); }
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
            <div className="field"><label htmlFor="p-paper">Referat / mustaqil ish (sayt)</label>
              <input id="p-paper" className="input num" inputMode="numeric" value={form.paper} onChange={(e) => setForm({ ...form, paper: e.target.value })} />
              <span className="help">.env dagi qiymat: {som(data.defaults.price_paper)}</span></div>
            <div className="field"><label htmlFor="p-top">To'ldirish summalari (/balance tugmalari)</label>
              <input id="p-top" className="input num" value={form.topup} onChange={(e) => setForm({ ...form, topup: e.target.value })} />
              <span className="help">Vergul bilan, 1 000 – 10 000 000, ko'pi bilan 8 ta</span></div>
            <div className="field"><label htmlFor="p-ref">Taklif bonusi (sayt)</label>
              <input id="p-ref" className="input num" inputMode="numeric" value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} />
              <span className="help">Taklif qilingan do'st birinchi marta to'ldirganda taklif qilganga beriladi. 0 — o'chirilgan</span></div>
            <div className="field"><label htmlFor="p-first">Birinchi taqdimot (bot, Mini App va sayt)</label>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                {[['', 'Oddiy narx'], ['0', 'Tekin']].map(([v, label]) => (
                  <button key={label} type="button" className={`btn sm${String(form.first).trim() === v ? ' primary' : ''}`}
                    onClick={() => setForm({ ...form, first: v })}>{label}</button>
                ))}
                <input id="p-first" className="input num" style={{ flex: 1, minWidth: 120 }} inputMode="numeric" value={form.first}
                  onChange={(e) => setForm({ ...form, first: e.target.value })} placeholder="yoki chegirma narxi" />
              </div>
              <span className="help">Har bir foydalanuvchining eng birinchi taqdimoti shu narxda. 0 — tekin, bo'sh — oddiy narx. Bajarilmay qolgan taqdimot hisoblanmaydi.</span></div>
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
            <div className="card-h"><h2>Majburiy obuna</h2>{data.values.required_channel ? <Pill tone="good">Yoqilgan</Pill> : <Pill>O'chiq</Pill>}</div>
            <div className="card-b stack" style={{ gap: 12 }}>
              <div className="field"><label htmlFor="s-ch">Kanal</label>
                <input id="s-ch" className="input" value={sub.channel} onChange={(e) => setSub({ ...sub, channel: e.target.value })} placeholder="@kanal_nomi yoki https://t.me/kanal_nomi" />
                <span className="help">A'zo bo'lmaganlar botdan (va Mini App'dan) foydalana olmaydi. Avval botni kanalga <b>administrator</b> qilib qo'shing.</span></div>
              <div className="field"><label htmlFor="s-link">Taklif havolasi (faqat yopiq kanal uchun)</label>
                <input id="s-link" className="input" value={sub.link} onChange={(e) => setSub({ ...sub, link: e.target.value })} placeholder="https://t.me/+..." /></div>
              <div className="row" style={{ gap: 8 }}>
                <button type="button" className="btn primary" disabled={busy || !sub.channel.trim()} onClick={() => saveSub(false)}>Saqlash va tekshirish</button>
                {data.values.required_channel && <button type="button" className="btn" disabled={busy} onClick={() => saveSub(true)}>O'chirish</button>}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-h"><h2>AI</h2></div>
            <table><tbody>
              <tr><td>Matn yozuvchi model</td><td>
                <select className="input" aria-label="AI modeli" value={data.ai.model} disabled={busy} onChange={(e) => changeModel(e.target.value)}>
                  {!data.ai.choices[data.ai.model] && <option value={data.ai.model}>{data.ai.model}</option>}
                  {Object.entries(data.ai.choices).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </select>
                <span className="help">.env dagi standart: {data.ai.default}</span>
              </td></tr>
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
  card_rejected: "Karta to'lovi rad etildi", broadcast: 'Ommaviy xabar', settings: "Sozlamalar o'zgartirildi", ai_model: 'AI modeli almashtirildi', subscription: "Majburiy obuna o'zgartirildi" };

export function AdminLog() {
  const [page, setPage] = useState(1);
  const size = 50;
  const { data, error, reload } = useLoad(() => api.log({ page, size }), [page]);
  return (
    <div className="card">
      {error && !data ? <ErrorBox error={error} retry={reload} /> : !data ? <Loading /> : (
        <>
          <div className="table-wrap"><table className="cards">
            <thead><tr><th>Sana</th><th>Admin</th><th>Amal</th><th>Obyekt</th><th>Tafsilot</th></tr></thead>
            <tbody>{data.items.map((a) => (
              <tr key={a.id}>
                <td data-label="Sana">{dateTime(a.created)}</td>
                <td data-label="Admin"><div className="who">{a.first_name || a.admin_id}<small>{a.username ? `@${a.username}` : a.admin_id}</small></div></td>
                <td data-label="Amal">{ACTIONS[a.action] || a.action}</td>
                <td className="num" data-label="Obyekt">{a.target || '—'}</td>
                <td className="full" data-label="Tafsilot">{a.details ? <pre className="json">{JSON.stringify(a.details, null, 1)}</pre> : '—'}</td>
              </tr>))}</tbody>
          </table></div>
          {!data.items.length && <div className="empty">Hali hech narsa qilinmagan</div>}
          <Pager page={page} size={size} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
}
