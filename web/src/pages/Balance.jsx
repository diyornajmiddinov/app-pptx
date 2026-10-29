/** Balance top-up by card transfer (order -> transfer -> receipt photo -> admin), payments and the ledger. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { Alert, Button, Card, Spinner, useCopy } from '../components/ui.jsx';
import { date, useI18n } from '../i18n.jsx';

function CopyRow({ label, value, copied, copy }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="truncate font-mono text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
      <Button variant="secondary" className="shrink-0 px-3 py-1.5" onClick={() => copy(value.replace(/\s/g, ''))}>
        {copied === value.replace(/\s/g, '') ? t('copied') : t('copy')}
      </Button>
    </div>
  );
}

export default function Balance({ me, refreshMe }) {
  const { t, money } = useI18n();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [copied, copy] = useCopy();
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const [o, h] = await Promise.all([api.orders(), api.history()]);
      setData(o); setHistory(h.items);
      setOrder((cur) => cur || o.orders.find((x) => x.state === 'new') || null);
    } catch (e) { setError(t(`e_${e.key}`)); }
  }, [t]);
  useEffect(() => { load(); refreshMe(); }, [load, refreshMe]);

  const pick = async (amount) => {
    setBusy(`a${amount}`); setError(''); setInfo('');
    try { setOrder(await api.topup(amount)); await load(); } catch (e) { setError(t(`e_${e.key}`)); } finally { setBusy(''); }
  };
  const upload = async (file) => {
    if (!file) return;
    setBusy('receipt'); setError(''); setInfo('');
    try {
      await api.receipt(order.id, file);
      setInfo(t('receiptSent')); setOrder(null); await load();
    } catch (e) { setError(t(`e_${e.key}`)); } finally { setBusy(''); if (fileRef.current) fileRef.current.value = ''; }
  };
  const kind = (k) => { const p = k.split(':')[0]; return t(`k_${['generate', 'restyle', 'refund'].includes(p) ? p : 'topup'}`); };
  const card = order?.card || data?.card;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <Card>
          <p className="text-sm text-slate-500">{t('balance')}</p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{money(me.balance)}</p>
        </Card>

        <Card className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('topupTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('topupText')}</p>
          </div>
          {me.card ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {me.topup_amounts.map((a) => (
                <Button key={a} variant={order?.amount === a && order.state === 'new' ? 'primary' : 'secondary'} className="py-3"
                  disabled={!!busy} onClick={() => pick(a)}>
                  {busy === `a${a}` && <Spinner />}{money(a)}
                </Button>
              ))}
            </div>
          ) : <Alert>{t('e_noCard')}</Alert>}
          <Alert>{error}</Alert>
          <Alert kind="ok">{info}</Alert>

          {order && order.state === 'new' && card && (
            <div className="space-y-3 rounded-2xl p-4 ring-1 ring-brand-200 dark:ring-brand-900 sm:p-5">
              <h3 className="font-bold text-slate-900 dark:text-white">{t('cardTitle')}</h3>
              <CopyRow label={t('cardNumber')} value={card.number} copied={copied} copy={copy} />
              {card.holder && <p className="px-1 text-sm text-slate-600 dark:text-slate-400">{t('cardHolder')}: <b>{card.holder}</b></p>}
              <div className="grid gap-3 sm:grid-cols-2">
                <CopyRow label={t('amount')} value={String(order.amount)} copied={copied} copy={copy} />
                <CopyRow label={t('payCode')} value={order.code} copied={copied} copy={copy} />
              </div>
              <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-400">{t('cardSteps')}</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files[0])} />
              <Button className="w-full py-3" disabled={busy === 'receipt'} onClick={() => fileRef.current?.click()}>
                {busy === 'receipt' && <Spinner />}{t('uploadReceipt')}
              </Button>
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{t('orders')}</h2>
          {!data ? <Spinner className="text-brand-600" /> : (
            <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {data.orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div><p className="font-medium text-slate-900 dark:text-white">{money(o.amount)}</p><p className="text-xs text-slate-500">{o.code} · {date(o.created, true)}</p></div>
                  {o.state === 'new' && order?.id !== o.id
                    ? <button type="button" className="font-medium text-brand-600 hover:underline" onClick={() => setOrder(o)}>{t(`os_${o.state}`)}</button>
                    : <span className={o.state === 'paid' ? 'text-emerald-600' : o.state === 'rejected' ? 'text-red-600' : 'text-slate-500'}>{t(`os_${o.state}`)}</span>}
                </li>
              ))}
              {!data.orders.length && <li className="py-2 text-slate-500">—</li>}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{t('history')}</h2>
          <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
            {history.map((h, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                <div><p className="text-slate-900 dark:text-white">{kind(h.kind)}</p><p className="text-xs text-slate-500">{date(h.created, true)}</p></div>
                <span className={`font-semibold ${h.delta > 0 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>{h.delta > 0 ? '+' : '−'}{money(Math.abs(h.delta))}</span>
              </li>
            ))}
            {!history.length && <li className="py-2 text-slate-500">—</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
