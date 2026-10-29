/**
 * Balance: top-up (card transfer -> receipt photo -> admin; or Payme / Click -> their page -> back here),
 * promo code, invite link, payments and the ledger.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { Alert, Button, Card, Segmented, Spinner, inputCls, useCopy } from '../components/ui.jsx';
import { date, useI18n } from '../i18n.jsx';

const PROVIDER_KEY = { card: 'payCard', payme: 'payPayme', click: 'payClick' };

function CopyRow({ label, value, copied, copy }) {
  const { t } = useI18n();
  const raw = value.replace(/\s/g, '');
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="truncate font-mono text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
      <Button variant="secondary" className="shrink-0 px-3 py-1.5" onClick={() => copy(raw)}>{copied === raw ? t('copied') : t('copy')}</Button>
    </div>
  );
}

function Promo({ onDone }) {
  const { t, money } = useI18n();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(['', '']);
  const apply = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg(['', '']);
    try { const r = await api.promo(code.trim()); setMsg(['ok', t('promoOk', { amount: money(r.amount) })]); setCode(''); onDone(); }
    catch (err) { setMsg(['error', t(`e_${err.key}`)]); } finally { setBusy(false); }
  };
  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('promoTitle')}</h2>
      <form onSubmit={apply} className="flex gap-2">
        <input className={`${inputCls} font-mono uppercase`} value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('promoPh')} maxLength={40} autoCapitalize="characters" />
        <Button type="submit" disabled={busy || code.trim().length < 3}>{busy && <Spinner />}{t('promoBtn')}</Button>
      </form>
      <Alert kind={msg[0] === 'ok' ? 'ok' : 'error'}>{msg[1]}</Alert>
    </Card>
  );
}

function Invite() {
  const { t, money } = useI18n();
  const [info, setInfo] = useState(null);
  const [copied, copy] = useCopy();
  useEffect(() => { api.referral().then(setInfo).catch(() => {}); }, []);
  if (!info || info.bonus <= 0) return null;
  const link = `${window.location.origin}/?ref=${info.code}`;
  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('refTitle')}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">{t('refText', { bonus: money(info.bonus) })}</p>
      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
        <span className="min-w-0 flex-1 truncate font-mono text-sm text-slate-900 dark:text-white">{link}</span>
        <Button variant="secondary" className="shrink-0 px-3 py-1.5" onClick={() => copy(link)}>{copied === link ? t('copied') : t('copy')}</Button>
      </div>
      <div className="flex gap-6 text-sm">
        <span className="text-slate-500">{t('refInvited')}: <b className="text-slate-900 dark:text-white">{info.invited}</b></span>
        <span className="text-slate-500">{t('refPaid')}: <b className="text-slate-900 dark:text-white">{info.paid}</b></span>
      </div>
    </Card>
  );
}

export default function Balance({ me, refreshMe }) {
  const { t, money } = useI18n();
  const providers = (me.providers || []).filter((p) => PROVIDER_KEY[p]);
  const [provider, setProvider] = useState(providers.find((p) => p !== 'card') || providers[0] || 'card');
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
    try {
      const r = await api.topup(amount, provider);
      if (r.url) { setInfo(t('payRedirect')); window.location.href = r.url; return; } // Payme / Click: their page, then back here
      setOrder(r); await load();
    } catch (e) { setError(t(`e_${e.key}`)); } finally { setBusy(''); }
  };
  const upload = async (file) => {
    if (!file) return;
    setBusy('receipt'); setError(''); setInfo('');
    try {
      await api.receipt(order.id, file);
      setInfo(t('receiptSent')); setOrder(null); await load();
    } catch (e) { setError(t(`e_${e.key}`)); } finally { setBusy(''); if (fileRef.current) fileRef.current.value = ''; }
  };
  const kind = (k) => {
    const p = k.split(':')[0];
    return t(`k_${['generate', 'restyle', 'refund', 'promo', 'referral'].includes(p) ? p : 'topup'}`);
  };
  const card = order?.card || data?.card;
  const cardOrders = data?.orders || [];

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
          {providers.length === 0 ? <Alert>{t('e_noProvider')}</Alert> : (
            <>
              {providers.length > 1 && (
                <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{t('payWith')}</p>
                  <Segmented value={provider} onChange={(p) => { setProvider(p); setError(''); }} label={t('payWith')}
                    options={providers.map((p) => ({ id: p, label: t(PROVIDER_KEY[p]) }))} /></div>
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {me.topup_amounts.map((a) => (
                  <Button key={a} variant={provider === 'card' && order?.amount === a && order.state === 'new' ? 'primary' : 'secondary'} className="py-3"
                    disabled={!!busy} onClick={() => pick(a)} aria-label={provider === 'card' ? money(a) : t('payGo', { provider: t(PROVIDER_KEY[provider]), amount: money(a) })}>
                    {busy === `a${a}` && <Spinner />}{money(a)}
                  </Button>
                ))}
              </div>
            </>
          )}
          <Alert>{error}</Alert>
          <Alert kind="ok">{info}</Alert>

          {provider === 'card' && order && order.state === 'new' && card && (
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
        <div className="grid gap-6 md:grid-cols-2">
          <Promo onDone={() => { refreshMe(); load(); }} />
          <Invite />
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{t('orders')}</h2>
          {!data ? <Spinner className="text-brand-600" /> : (
            <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {cardOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div><p className="font-medium text-slate-900 dark:text-white">{money(o.amount)}</p><p className="text-xs text-slate-500">{o.code} · {date(o.created, true)}</p></div>
                  {o.state === 'new' && order?.id !== o.id
                    ? <button type="button" className="font-medium text-brand-600 hover:underline" onClick={() => { setProvider('card'); setOrder(o); }}>{t(`os_${o.state}`)}</button>
                    : <span className={o.state === 'paid' ? 'text-emerald-600' : o.state === 'rejected' ? 'text-red-600' : 'text-slate-500'}>{t(`os_${o.state}`)}</span>}
                </li>
              ))}
              {!cardOrders.length && <li className="py-2 text-slate-500">—</li>}
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
