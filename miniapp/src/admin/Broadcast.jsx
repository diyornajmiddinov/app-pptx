import { useEffect, useState } from 'react';
import { api } from './api.js';
import { dateTime, LANGS, num } from './format.js';
import { ErrorBox, Loading, Pill, useConfirm, useLoad, useToast } from './ui.jsx';

const STATES = { running: ['Yuborilmoqda', 'info'], done: ['Tugadi', 'good'], interrupted: ["To'xtatildi", 'bad'] };

export default function Broadcast() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('');
  const [busy, setBusy] = useState(false);
  const { data, error, reload } = useLoad(() => api.broadcasts(), []);
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();
  const running = data?.items.some((b) => b.state === 'running');

  useEffect(() => { // live progress while one is being sent
    if (!running) return undefined;
    const id = setInterval(reload, 2000);
    return () => clearInterval(id);
  }, [running, reload]);

  const audience = data ? (lang ? data.audience[lang] || 0 : Object.values(data.audience).reduce((a, b) => a + b, 0)) : 0;

  const send = async (test) => {
    if (!text.trim()) return;
    if (!test && !await confirm({ title: 'Hammaga yuborish', ok: `${num(audience)} kishiga yuborish`,
      body: <>Xabar <b>{num(audience)}</b> foydalanuvchiga ({lang ? LANGS[lang] : 'barcha tillar'}) yuboriladi. Buni qaytarib bo'lmaydi.</> })) return;
    setBusy(true);
    try {
      await api.broadcast({ text: text.trim(), lang: lang || null, test });
      toast(test ? "Sinov xabari sizga yuborildi — Telegram'da tekshiring" : 'Yuborish boshlandi');
      if (!test) setText('');
      reload();
    } catch (e) { toast(e.message, true); } finally { setBusy(false); }
  };

  return (
    <div className="grid two" style={{ alignItems: 'start' }}>
      {confirmNode}
      <div className="card">
        <div className="card-h"><h2>Yangi xabar</h2></div>
        <div className="card-b stack" style={{ gap: 14 }}>
          <div className="field">
            <label htmlFor="bc-lang">Kimga</label>
            <select id="bc-lang" className="select" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="">Barcha foydalanuvchilar</option>
              {['uz', 'ru', 'en'].map((l) => <option key={l} value={l}>{LANGS[l]} tilini tanlaganlar</option>)}
            </select>
            <span className="help">{num(audience)} kishi</span>
          </div>
          <div className="field">
            <label htmlFor="bc-text">Matn</label>
            <textarea id="bc-text" className="textarea" maxLength={4000} value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Masalan: yangi shablonlar qo'shildi!" />
            <span className="help">{text.length} / 4000 · oddiy matn, havolalar ishlaydi</span>
          </div>
          <div className="row">
            <button type="button" className="btn" disabled={busy || !text.trim()} onClick={() => send(true)}>Avval o'zimga sinab ko'rish</button>
            <button type="button" className="btn primary" disabled={busy || !text.trim() || running || !audience} onClick={() => send(false)}>Yuborish</button>
          </div>
          {running && <span className="help">Oldingi xabar hali yuborilmoqda.</span>}
        </div>
      </div>
      <div className="card">
        <div className="card-h"><h2>Yuborilganlar</h2></div>
        {error && !data ? <ErrorBox error={error} retry={reload} /> : !data ? <Loading /> : data.items.length ? (
          <div className="table-wrap"><table><tbody>{data.items.map((b) => (
            <tr key={b.id}>
              <td style={{ whiteSpace: 'normal' }}>
                <div style={{ marginBottom: 6 }}>{b.text.length > 140 ? `${b.text.slice(0, 140)}…` : b.text}</div>
                <div className="row" style={{ fontSize: 12, color: 'var(--muted)' }}>
                  <Pill tone={STATES[b.state]?.[1]}>{STATES[b.state]?.[0] || b.state}</Pill>
                  {dateTime(b.created)} · {b.lang ? LANGS[b.lang] : 'hammaga'}
                </div>
              </td>
              <td className="r" style={{ width: 170 }}>
                <div className="num">{num(b.sent)} / {num(b.total)}{b.failed ? <span style={{ color: 'var(--bad)' }}> · {num(b.failed)} xato</span> : ''}</div>
                <div className="progress" style={{ marginTop: 6 }}><div style={{ width: `${b.total ? ((b.sent + b.failed) / b.total) * 100 : 0}%` }} /></div>
              </td>
            </tr>))}</tbody></table></div>
        ) : <div className="empty">Hali xabar yuborilmagan</div>}
      </div>
    </div>
  );
}
