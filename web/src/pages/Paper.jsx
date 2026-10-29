/**
 * Referat / mustaqil ish: topic, length, language, the title page, the teacher's layout rules, an optional source
 * document and a plan to edit first (free) -> charged and queued; the finished files (Word, PDF) are listed below.
 * The title-page details are remembered in this browser, so the next paper needs only a topic.
 */
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { Alert, Button, Card, Field, Segmented, Spinner, inputCls } from '../components/ui.jsx';
import { date, useI18n } from '../i18n.jsx';
import { Source } from './Create.jsx';
import Jobs from './Jobs.jsx';

const KEEP = 'paperTitlePage';
const TITLE_FIELDS = [['ministry', 200], ['university', 200], ['faculty', 120], ['department', 120], ['student', 80], ['group', 80], ['teacher', 80], ['city', 60]];
export const STANDARD = { font_size: 14, spacing: 1.5, margin_left: 30, margin_right: 15, margin_top: 20, margin_bottom: 20, page_numbers: 'bottom_center', toc_title: 'mundarija' };
const LANGS = [['uz', "O'zbekcha"], ['uzc', null], ['ru', 'Русский'], ['en', 'English']];

function remembered() {
  try { return JSON.parse(localStorage.getItem(KEEP) || '{}') || {}; } catch { return {}; }
}

function Plan({ chapters, onChange, onReset }) {
  const { t } = useI18n();
  const setChapter = (i, v) => onChange(chapters.map((c, k) => (k === i ? { ...c, title: v } : c)));
  const setSection = (i, j, v) => onChange(chapters.map((c, k) => (k === i ? { ...c, sections: c.sections.map((s, m) => (m === j ? v : s)) } : c)));
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('paperOutlineTitle')}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('paperOutlineText')}</p>
        </div>
        <Button variant="ghost" className="shrink-0 px-3 py-1.5" onClick={onReset}>{t('outlineReset')}</Button>
      </div>
      {chapters.map((c, i) => (
        <div key={i} className="space-y-2">
          <input className={`${inputCls} font-semibold`} value={c.title} maxLength={150} aria-label={t('chapterN', { n: i + 1 })} onChange={(e) => setChapter(i, e.target.value)} />
          {c.sections.map((s, j) => (
            <div key={j} className="flex items-center gap-3 pl-4">
              <span className="w-8 shrink-0 text-right text-sm font-semibold text-slate-400">{i + 1}.{j + 1}.</span>
              <input className={`${inputCls} py-2`} value={s} maxLength={150} aria-label={`${i + 1}.${j + 1}`} onChange={(e) => setSection(i, j, e.target.value)} />
            </div>
          ))}
        </div>
      ))}
    </Card>
  );
}

function Format({ fmt, setFmt }) {
  const { t } = useI18n();
  const set = (k) => (v) => setFmt({ ...fmt, [k]: v });
  const num = (k, min, max) => (
    <Field label={t(`m_${k}`)}>
      <input type="number" className={`${inputCls} py-2`} min={min} max={max} value={fmt[`margin_${k}`]}
        onChange={(e) => set(`margin_${k}`)(Number(e.target.value))} aria-label={`${t('fmtMargins')}: ${t(`m_${k}`)}`} />
    </Field>
  );
  const changed = JSON.stringify(fmt) !== JSON.stringify(STANDARD);
  return (
    <details className="group rounded-2xl bg-white ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800" open={changed || undefined}>
      <summary className="cursor-pointer list-none p-5 sm:p-6">
        <span className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-slate-900 dark:text-white">{t('fmtTitle')}</span>
          <span className="text-slate-400 transition group-open:rotate-180" aria-hidden="true">▾</span>
        </span>
        <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{t('fmtStd')}</span>
      </summary>
      <div className="space-y-5 px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('fmtFont')}>
            <Segmented value={fmt.font_size} onChange={set('font_size')} label={t('fmtFont')} options={[12, 13, 14].map((n) => ({ id: n, label: String(n) }))} />
          </Field>
          <Field label={t('fmtSpacing')}>
            <Segmented value={fmt.spacing} onChange={set('spacing')} label={t('fmtSpacing')} options={[1, 1.15, 1.5, 2].map((n) => ({ id: n, label: String(n).replace('.', ',') }))} />
          </Field>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">{t('fmtMargins')}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{num('left', 10, 40)}{num('right', 10, 30)}{num('top', 10, 30)}{num('bottom', 10, 30)}</div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('fmtNumbers')}>
            <select className={inputCls} value={fmt.page_numbers} onChange={(e) => set('page_numbers')(e.target.value)}>
              {['bottom_center', 'bottom_right', 'top_center', 'top_right'].map((k) => <option key={k} value={k}>{t(`pn_${k}`)}</option>)}
            </select>
          </Field>
          <Field label={t('fmtToc')}>
            <Segmented value={fmt.toc_title} onChange={set('toc_title')} label={t('fmtToc')} options={['mundarija', 'reja'].map((k) => ({ id: k, label: t(`toc_${k}`) }))} />
          </Field>
        </div>
        {changed && <Button variant="ghost" className="px-3 py-1.5" onClick={() => setFmt(STANDARD)}>{t('fmtReset')}</Button>}
      </div>
    </details>
  );
}

function MyPapers({ reloadKey }) {
  const { t } = useI18n();
  const [list, setList] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const load = useCallback(() => api.papers().then((r) => setList(r.papers)).catch((e) => setError(t(`e_${e.key}`))), [t]);
  useEffect(() => { load(); }, [load, reloadKey]);
  const run = async (key, fn) => {
    setBusy(key); setError('');
    try { await fn(); } catch (e) { setError(t(`e_${e.key}`)); } finally { setBusy(''); }
  };
  const remove = (p) => {
    if (!window.confirm(t('deleteAsk', { topic: p.topic }))) return;
    run(`del${p.id}`, async () => { await api.deletePaper(p.id); setList((cur) => cur.filter((x) => x.id !== p.id)); });
  };
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('myPapers')}</h2>
      <Alert>{error}</Alert>
      {list === null ? <div className="flex justify-center py-6"><Spinner className="h-5 w-5 text-brand-600" /></div>
        : !list.length ? <p className="text-sm text-slate-500">{t('noPapers')}</p> : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{p.topic}</p>
                  <p className="text-sm text-slate-500">{t(`dt_${p.doc_type}`)}{p.pages ? ` · ${t('pagesN', { n: p.pages })}` : ''} · {date(p.created)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button className="px-3 py-1.5" disabled={!!busy} onClick={() => run(`w${p.id}`, () => api.paperFile(p.id, 'docx'))}>{busy === `w${p.id}` && <Spinner />}{t('word')}</Button>
                  {p.has_pdf && <Button variant="secondary" className="px-3 py-1.5" disabled={!!busy} onClick={() => run(`p${p.id}`, () => api.paperFile(p.id, 'pdf'))}>{busy === `p${p.id}` && <Spinner />}{t('pdf')}</Button>}
                  <Button variant="danger" className="px-3 py-1.5" disabled={!!busy} onClick={() => remove(p)} aria-label={`${t('delete')}: ${p.topic}`}>✕</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
    </Card>
  );
}

export default function Paper({ me, refreshMe, go }) {
  const { t, money, lang } = useI18n();
  const [form, setForm] = useState(() => ({ topic: '', subject: '', doc_type: 'referat', language: lang, pages: 15, wishes: '',
    year: String(new Date().getFullYear()), ...Object.fromEntries(TITLE_FIELDS.map(([k]) => [k, ''])), ...remembered() }));
  const [fmt, setFmt] = useState(() => ({ ...STANDARD, ...(remembered().format || {}) }));
  const [source, setSource] = useState(null);
  const [outline, setOutline] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [listKey, setListKey] = useState(0);
  const set = (k) => (v) => {
    const value = v?.target ? v.target.value : v;
    setForm((f) => ({ ...f, [k]: value }));
    if (['topic', 'pages', 'language', 'subject'].includes(k)) setOutline(null);
  };
  const price = me.prices.paper;
  const low = me.balance < price;
  const topic = form.topic.trim();
  const base = { topic, subject: form.subject.trim(), language: form.language, pages: form.pages, wishes: form.wishes.trim(), ...(source ? { source: source.text } : {}) };
  const onDone = useCallback(() => { refreshMe(); setListKey((k) => k + 1); }, [refreshMe]);

  const makeOutline = async () => {
    setBusy('outline'); setError('');
    try { setOutline((await api.paperOutline(base)).chapters); } catch (e) { setError(t(`e_${e.key}`)); } finally { setBusy(''); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy('create'); setError(''); setDone(false);
    const titlePage = Object.fromEntries([...TITLE_FIELDS.map(([k]) => k), 'year'].map((k) => [k, form[k].trim()]));
    try { localStorage.setItem(KEEP, JSON.stringify({ ...titlePage, subject: form.subject, doc_type: form.doc_type, format: fmt })); } catch { /* private mode */ }
    try {
      await api.paper({ ...base, ...titlePage, doc_type: form.doc_type, format: fmt,
        ...(outline ? { outline: outline.map((c) => ({ title: c.title.trim(), sections: c.sections.map((s) => s.trim()) })) } : {}) });
      setDone(true); setListKey((k) => k + 1);
      setForm((f) => ({ ...f, topic: '', wishes: '' })); setOutline(null); setSource(null);
      refreshMe();
    } catch (err) { setError(t(`e_${err.key}`)); } finally { setBusy(''); }
  };
  const outlineOk = !outline || outline.every((c) => c.title.trim() && c.sections.every((s) => s.trim()));

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('paperTitle')}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{t('paperLead')}</p>
        </div>
        <Jobs key={listKey} onDone={onDone} go={go} />
        <Card className="space-y-5">
          <Field label={t('topic')}>
            <textarea className={`${inputCls} min-h-[80px] resize-y`} value={form.topic} onChange={set('topic')} placeholder={t('paperTopicPh')} minLength={3} maxLength={200} required />
          </Field>
          <Field label={t('paperSubject')}>
            <input className={inputCls} value={form.subject} onChange={set('subject')} placeholder={t('paperSubjectPh')} maxLength={120} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('paperType')}>
              <Segmented value={form.doc_type} onChange={set('doc_type')} label={t('paperType')} options={['referat', 'mustaqil'].map((k) => ({ id: k, label: t(`dt_${k}`) }))} />
            </Field>
            <Field label={t('paperPages')}>
              <div className="flex items-center gap-3">
                <input type="range" min="8" max="30" value={form.pages} onChange={(e) => set('pages')(Number(e.target.value))} className="w-full accent-brand-600" aria-label={t('paperPages')} />
                <span className="w-16 shrink-0 text-right text-sm font-semibold text-slate-900 dark:text-white">{t('pagesN', { n: form.pages })}</span>
              </div>
            </Field>
          </div>
          <Field label={t('paperLang')}>
            <div className="max-w-full overflow-x-auto">
              <Segmented value={form.language} onChange={set('language')} label={t('paperLang')} options={LANGS.map(([id, label]) => ({ id, label: label || t('lang_uzc') }))} />
            </div>
          </Field>
          <Field label={t('wishes')}>
            <textarea className={`${inputCls} min-h-[64px] resize-y`} value={form.wishes} onChange={set('wishes')} placeholder={t('wishesPh')} maxLength={600} />
          </Field>
        </Card>
        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('titleTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('titleHint')}</p>
          </div>
          <Field label={t('f_ministry')} hint={t('f_ministryHint')}>
            <input className={inputCls} value={form.ministry} onChange={set('ministry')} maxLength={200} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            {TITLE_FIELDS.slice(1).map(([k, max]) => (
              <Field key={k} label={t(`f_${k}`)}>
                <input className={inputCls} value={form[k]} onChange={set(k)} placeholder={t(`f_${k}Ph`)} maxLength={max} />
              </Field>
            ))}
            <Field label={t('f_year')}><input className={inputCls} value={form.year} onChange={set('year')} inputMode="numeric" maxLength={10} /></Field>
          </div>
        </Card>
        <Format fmt={fmt} setFmt={setFmt} />
        <Source source={source} setSource={(s) => { setSource(s); setOutline(null); }} text="paperSourceText" />
        {outline && <Plan chapters={outline} onChange={setOutline} onReset={() => setOutline(null)} />}
        <MyPapers reloadKey={listKey} />
      </div>

      <div className="space-y-6 lg:sticky lg:top-36 lg:self-start">
        <Card className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('includesTitle')}</h2>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {[1, 2, 3, 4, 5, 6].map((n) => <li key={n} className="flex gap-2"><span className="text-brand-600" aria-hidden="true">✓</span>{t(`inc${n}`)}</li>)}
          </ul>
        </Card>
        <Card className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{t('balance')}</span>
            <span className={`font-semibold ${low ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{money(me.balance)}</span>
          </div>
          <Alert>{error}</Alert>
          <Alert kind="ok">{done && t('paperQueued')}</Alert>
          {!outline && (
            <Button variant="secondary" className="w-full" disabled={!!busy || topic.length < 3} onClick={makeOutline}>
              {busy === 'outline' && <Spinner />}{busy === 'outline' ? t('outlineMaking') : t('outlineBtn')}
            </Button>
          )}
          {low ? (
            <>
              <Alert>{t('e_lowBalance')}</Alert>
              <Button className="w-full py-3" onClick={() => go('balance')}>{t('topUp')}</Button>
            </>
          ) : (
            <Button type="submit" className="w-full py-3" disabled={!!busy || topic.length < 3 || !outlineOk}>
              {busy === 'create' && <Spinner />}{busy === 'create' ? t('creating') : t('paperCreate', { price: price === 0 ? t('free') : money(price) })}
            </Button>
          )}
          <p className="text-xs text-slate-500">{t('paperCheck')}</p>
        </Card>
      </div>
    </form>
  );
}
