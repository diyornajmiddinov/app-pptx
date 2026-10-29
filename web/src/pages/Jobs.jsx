/** Paid work of the last day, polled while something is queued or drawing. Hidden when there is nothing. */
import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { Button, Card, Spinner } from '../components/ui.jsx';
import { useI18n } from '../i18n.jsx';

const ACTIVE = new Set(['queued', 'running']);
const POLL_MS = 5000;
const SHOW_DONE_S = 30 * 60; // finished work stays in the list for half an hour

export default function Jobs({ onDone, go }) {
  const { t } = useI18n();
  const [jobs, setJobs] = useState([]);
  const active = useRef(0);

  useEffect(() => {
    let stop = false, timer;
    const tick = async () => {
      try {
        const list = (await api.jobs()).jobs;
        if (stop) return;
        const n = list.filter((j) => ACTIVE.has(j.state)).length;
        if (n < active.current) onDone?.(); // something finished (or was refunded): the balance / decks changed
        active.current = n;
        setJobs(list);
        if (n) timer = setTimeout(tick, POLL_MS);
      } catch { if (!stop) timer = setTimeout(tick, POLL_MS * 3); }
    };
    tick();
    return () => { stop = true; clearTimeout(timer); };
  }, [onDone]);

  const now = Date.now() / 1000;
  const shown = jobs.filter((j) => ACTIVE.has(j.state) || now - j.created < SHOW_DONE_S);
  if (!shown.length) return null;

  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('work')}</h2>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {shown.map((j) => (
          <li key={j.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900 dark:text-white">{j.topic || '—'}</p>
              <p className="text-sm text-slate-500">{t(j.kind === 'restyle' ? 'k_restyle' : 'k_generate')}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-sm">
              {ACTIVE.has(j.state) && <Spinner className="text-brand-600" />}
              <span className={j.state === 'failed' ? 'text-red-600' : j.state === 'done' ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300'}>
                {t(`st_${j.state}`)}{j.state === 'queued' && j.ahead > 0 ? ` · ${t('ahead', { n: j.ahead })}` : ''}
              </span>
              {j.state === 'done' && <Button variant="secondary" className="px-3 py-1.5" onClick={() => go('decks')}>{t('tabDecks')}</Button>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
