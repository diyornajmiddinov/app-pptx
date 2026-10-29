/** The user's presentations (made on the site or in the bot): download, redraw in another template, edit. */
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { Alert, Button, Card, Spinner, TEMPLATES, TemplateGrid } from '../components/ui.jsx';
import { date, useI18n } from '../i18n.jsx';
import Jobs from './Jobs.jsx';

const byId = Object.fromEntries(TEMPLATES.map((x) => [x.id, x]));

function RestyleDialog({ deck, price, onClose, onQueued }) {
  const { t, money } = useI18n();
  const [tpl, setTpl] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const go = async () => {
    setBusy(true); setError('');
    try { await api.restyle(deck.id, tpl); onQueued(); } catch (e) { setError(t(`e_${e.key}`)); setBusy(false); }
  };
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={t('restyleTitle')}>
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-t-2xl bg-white dark:bg-slate-900 sm:rounded-2xl">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('restyleTitle')}</h2>
          <p className="truncate text-sm text-slate-500">{deck.topic}</p>
        </div>
        <div className="overflow-y-auto p-5"><TemplateGrid value={tpl} onSelect={setTpl} exclude={deck.template_id} compact /></div>
        <div className="space-y-3 border-t border-slate-200 p-5 dark:border-slate-800">
          <Alert>{error}</Alert>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
            <Button disabled={!tpl || busy} onClick={go}>{busy && <Spinner />}{t('restyleBtn', { price: money(price) })}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Decks({ me, refreshMe, go }) {
  const { t, templateName } = useI18n();
  const [decks, setDecks] = useState(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState('');
  const [restyle, setRestyle] = useState(null);
  const [jobsKey, setJobsKey] = useState(0);

  const load = useCallback(() => api.decks().then((r) => setDecks(r.decks)).catch((e) => setError(t(`e_${e.key}`))), [t]);
  useEffect(() => { load(); }, [load]);
  const onDone = useCallback(() => { load(); refreshMe(); }, [load, refreshMe]);

  const run = async (key, fn) => {
    setBusy(key); setError('');
    try { await fn(); } catch (e) { setError(t(`e_${e.key}`)); } finally { setBusy(''); }
  };
  const openEditor = () => run('editor', async () => {
    const win = window.open('', '_blank'); // opened now, inside the click: popup blockers allow it
    const { url } = await api.editor();
    if (win) win.location.href = url; else window.location.href = url;
  });

  return (
    <div className="space-y-6">
      <Jobs key={jobsKey} onDone={onDone} go={go} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('tabDecks')}</h1>
        <Button variant="secondary" onClick={openEditor} disabled={busy === 'editor'}>{busy === 'editor' && <Spinner />}{t('edit')}</Button>
      </div>
      <Alert>{error}</Alert>
      <Alert kind="ok">{info}</Alert>
      {decks === null ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-brand-600" /></div>
      ) : decks.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">{t('noDecks')}</p>
          <Button className="mt-5" onClick={() => go('create')}>{t('startNow')}</Button>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((d) => {
            const tpl = byId[d.template_id];
            return (
              <div key={d.id} className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                  {tpl && <img src={tpl.thumbnail} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 font-semibold text-slate-900 dark:text-white">{d.topic}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t('slidesN', { n: d.slides })} · {tpl ? templateName(tpl) : ''} · {date(d.created)}</p>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                    <Button className="px-2" disabled={busy === d.id} onClick={() => run(d.id, () => api.download(d.id))}>
                      {busy === d.id && <Spinner />}{busy === d.id ? t('downloading') : t('download')}
                    </Button>
                    <Button variant="secondary" className="px-2" onClick={() => { setInfo(''); setRestyle(d); }}>{t('restyle')}</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {restyle && (
        <RestyleDialog deck={restyle} price={me.prices.restyle} onClose={() => setRestyle(null)}
          onQueued={() => { setRestyle(null); setInfo(t('restyleQueued')); setJobsKey((k) => k + 1); refreshMe(); }} />
      )}
    </div>
  );
}
