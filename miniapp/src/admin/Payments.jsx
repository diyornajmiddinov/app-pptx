import { useState } from 'react';
import { api, fileUrl } from './api.js';
import { dateTime, fullName, num, ORDER_STATES, PROVIDERS, som } from './format.js';
import { ErrorBox, Loading, Modal, Pager, Pill, useConfirm, useLoad, useToast } from './ui.jsx';

export default function Payments({ openUser, onChanged }) {
  const [state, setState] = useState('review');
  const [provider, setProvider] = useState('');
  const [page, setPage] = useState(1);
  const [shot, setShot] = useState(null);
  const [busy, setBusy] = useState(null);
  const size = 25;
  const { data, error, reload } = useLoad(() => api.orders({ state, provider, page, size }), [state, provider, page]);
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();

  const decide = async (o, approve) => {
    if (!await confirm({
      title: approve ? "To'lovni tasdiqlash" : "To'lovni rad etish", danger: !approve, ok: approve ? 'Tasdiqlash' : 'Rad etish',
      body: approve
        ? <>{o.code}: <b>{fullName(o)}</b> balansiga <b>{som(o.amount)}</b> qo'shiladi. Avval skrinshotdagi summa va kartani tekshiring.</>
        : <>{o.code} rad etiladi, foydalanuvchiga xabar boradi.</>,
    })) return;
    setBusy(o.id);
    try {
      await api.decide(o.id, approve);
      toast(approve ? `${o.code} tasdiqlandi: +${som(o.amount)}` : `${o.code} rad etildi`);
      setShot(null); reload(); onChanged?.();
    } catch (e) { toast(e.message, true); reload(); } finally { setBusy(null); }
  };

  return (
    <div className="card">
      {confirmNode}
      <div className="card-h">
        <div className="seg" role="group" aria-label="Holat">
          {[['review', 'Tekshiruvda'], ['', 'Hammasi'], ['paid', "To'langan"], ['rejected', 'Rad etilgan'], ['new', 'Kutilmoqda']].map(([k, l]) => (
            <button key={k} type="button" className={state === k ? 'on' : ''} onClick={() => { setState(k); setPage(1); }}>{l}</button>
          ))}
        </div>
        <select className="select" value={provider} onChange={(e) => { setProvider(e.target.value); setPage(1); }} aria-label="To'lov usuli">
          <option value="">Barcha usullar</option>
          {Object.entries(PROVIDERS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        {data && <span className="hint">{num(data.total)} ta</span>}
      </div>
      {error && !data ? <ErrorBox error={error} retry={reload} /> : !data ? <Loading /> : (
        <>
          <div className="table-wrap"><table className="cards">
            <thead><tr><th>ID</th><th>Foydalanuvchi</th><th>Usul</th><th className="r">Summa</th><th>Holat</th><th>Sana</th><th /></tr></thead>
            <tbody>{data.items.map((o) => (
              <tr key={o.id}>
                <td className="num" data-label="ID"><b>{o.code}</b></td>
                <td data-label="Foydalanuvchi"><a href="#" onClick={(e) => { e.preventDefault(); openUser(o.user_id); }} className="who">{fullName(o)}<small>{o.username ? `@${o.username} · ` : ''}{o.user_id}</small></a></td>
                <td data-label="Usul">{PROVIDERS[o.provider] || o.provider}</td>
                <td className="r num" data-label="Summa">{som(o.amount)}</td>
                <td data-label="Holat"><Pill tone={ORDER_STATES[o.state]?.[1]}>{ORDER_STATES[o.state]?.[0] || o.state}</Pill></td>
                <td data-label="Sana">{dateTime(o.created)}</td>
                <td className="r full actions"><div className="row" style={{ justifyContent: 'flex-end' }}>
                  {o.has_screenshot && <button type="button" className="btn sm" onClick={() => setShot(o)}>Skrinshot</button>}
                  {o.state === 'review' && <>
                    <button type="button" className="btn sm good" disabled={busy === o.id} onClick={() => decide(o, true)}>Tasdiqlash</button>
                    <button type="button" className="btn sm danger" disabled={busy === o.id} onClick={() => decide(o, false)}>Rad etish</button>
                  </>}
                </div></td>
              </tr>))}</tbody>
          </table></div>
          {!data.items.length && <div className="empty">{state === 'review' ? "Tekshiruvni kutayotgan to'lov yo'q" : "Buyurtma yo'q"}</div>}
          <Pager page={page} size={size} total={data.total} onPage={setPage} />
        </>
      )}
      {shot && (
        <Modal title={`${shot.code} · ${som(shot.amount)} · ${fullName(shot)}`} onClose={() => setShot(null)} footer={<>
          <button type="button" className="btn" onClick={() => setShot(null)}>Yopish</button>
          {shot.state === 'review' && <>
            <button type="button" className="btn danger" onClick={() => decide(shot, false)}>Rad etish</button>
            <button type="button" className="btn good" onClick={() => decide(shot, true)}>Tasdiqlash</button>
          </>}
        </>}>
          <img className="shot" src={fileUrl(`/orders/${shot.id}/screenshot`)} alt={`${shot.code} to'lov cheki`} />
        </Modal>
      )}
    </div>
  );
}
