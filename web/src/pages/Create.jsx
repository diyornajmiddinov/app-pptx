/**
 * New presentation: topic, slides, language, template, title-slide details, and the website's options — an outline
 * to edit before paying (free), speaker notes, a document to build from -> charged and queued.
 */
import { useRef, useState } from 'react';
import { api } from '../api.js';
import { Alert, Button, Card, Field, Segmented, Spinner, TemplateGrid, inputCls } from '../components/ui.jsx';
import { LANGS, useI18n } from '../i18n.jsx';
import Jobs from './Jobs.jsx';

const FIXED = new Set(['intro', 'agenda', 'sources']); // their titles are set by the language, not edited

function Outline({ slides, onChange, onReset }) {
  const { t } = useI18n();
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('outlineTitle')}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('outlineText')}</p>
        </div>
        <Button variant="ghost" className="shrink-0 px-3 py-1.5" onClick={onReset}>{t('outlineReset')}</Button>
      </div>
      <ol className="space-y-2">
        {slides.map((s, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-6 shrink-0 text-right text-sm font-semibold text-slate-400">{i + 1}</span>
            <input className={`${inputCls} py-2`} value={s.title} disabled={FIXED.has(s.type)} maxLength={80} aria-label={`${i + 1}`}
              onChange={(e) => onChange(slides.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
          </li>
        ))}
      </ol>
    </Card>
  );
}

function Source({ source, setSource }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef(null);
  const read = async (file) => {
    if (!file) return;
    setBusy(true); setError('');
    try { const r = await api.source(file); setSource({ name: file.name, ...r }); } catch (e) { setError(t(`e_${e.key}`)); }
    finally { setBusy(false); if (ref.current) ref.current.value = ''; }
  };
  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('sourceTitle')}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">{t('sourceText')}</p>
      <input ref={ref} type="file" className="hidden" accept=".docx,.pdf,.pptx,.txt,.md" onChange={(e) => read(e.target.files[0])} />
      {source ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800/60">
          <span className="min-w-0 truncate text-slate-900 dark:text-white">
            {t('sourceReady', { name: source.name, n: source.chars.toLocaleString('ru-RU') })} {source.cut && <span className="text-slate-500">{t('sourceCut', { n: source.text.length.toLocaleString('ru-RU') })}</span>}
          </span>
          <Button variant="danger" className="shrink-0 px-3 py-1.5" onClick={() => setSource(null)}>{t('remove')}</Button>
        </div>
      ) : (
        <Button variant="secondary" disabled={busy} onClick={() => ref.current?.click()}>{busy && <Spinner />}{busy ? t('sourceReading') : t('sourcePick')}</Button>
      )}
      <Alert>{error}</Alert>
    </Card>
  );
}

export default function Create({ me, refreshMe, go }) {
  const { t, money, lang } = useI18n();
  const [form, setForm] = useState({ topic: '', slide_count: 10, language: lang, template_id: 1, author: '', org: '', loc: '', year: String(new Date().getFullYear()) });
  const [notes, setNotes] = useState(false);
  const [source, setSource] = useState(null);
  const [outline, setOutline] = useState(null); // [{type, title}] once made; dropped when what it was made for changes
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [jobsKey, setJobsKey] = useState(0);
  const set = (k) => (v) => {
    const value = v?.target ? v.target.value : v;
    setForm((f) => ({ ...f, [k]: value }));
    if (['slide_count', 'language', 'template_id'].includes(k)) setOutline(null);
  };
  const price = me.prices.now ?? me.prices.generate;
  const low = me.balance < price;
  const topic = form.topic.trim();
  const base = { topic, slide_count: form.slide_count, language: form.language, template_id: form.template_id, ...(source ? { source: source.text } : {}) };

  const makeOutline = async () => {
    setBusy('outline'); setError('');
    try { setOutline((await api.outline(base)).slides); } catch (e) { setError(t(`e_${e.key}`)); } finally { setBusy(''); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy('create'); setError(''); setDone(false);
    try {
      await api.generate({ ...base, author: form.author, org: form.org, loc: form.loc, year: form.year, notes,
        ...(outline ? { outline: outline.map((s) => s.title.trim()) } : {}) });
      setDone(true); setJobsKey((k) => k + 1);
      setForm((f) => ({ ...f, topic: '' })); setOutline(null); setSource(null);
      refreshMe();
    } catch (err) {
      setError(t(`e_${err.key}`));
      if (err.key === 'outlineStale') setOutline(null);
    } finally { setBusy(''); }
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0 space-y-6">
        <Jobs key={jobsKey} onDone={refreshMe} go={go} />
        <Card className="space-y-5">
          <Field label={t('topic')}>
            <textarea className={`${inputCls} min-h-[88px] resize-y`} value={form.topic} onChange={(e) => { set('topic')(e); setOutline(null); }}
              placeholder={t('topicPh')} minLength={3} maxLength={200} required />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('slides')}>
              <div className="flex items-center gap-3">
                <input type="range" min="6" max="30" value={form.slide_count} onChange={(e) => set('slide_count')(Number(e.target.value))}
                  className="w-full accent-brand-600" aria-label={t('slides')} />
                <span className="w-24 shrink-0 text-right text-sm font-semibold text-slate-900 dark:text-white">{t('slidesN', { n: form.slide_count })}</span>
              </div>
            </Field>
            <Field label={t('deckLang')}>
              <Segmented value={form.language} onChange={set('language')} label={t('deckLang')} options={LANGS.map((l) => ({ id: l.id, label: l.label }))} />
            </Field>
          </div>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={notes} onChange={(e) => setNotes(e.target.checked)} className="mt-1 h-4 w-4 rounded accent-brand-600" />
            <span><span className="block text-sm font-medium text-slate-900 dark:text-white">{t('notes')}</span>
              <span className="block text-xs text-slate-500">{t('notesHint')}</span></span>
          </label>
        </Card>
        <Source source={source} setSource={(s) => { setSource(s); setOutline(null); }} />
        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t('template')}</h2>
          <TemplateGrid value={form.template_id} onSelect={set('template_id')} compact />
        </Card>
        {outline && <Outline slides={outline} onChange={setOutline} onReset={() => setOutline(null)} />}
      </div>

      <div className="space-y-6 lg:sticky lg:top-36 lg:self-start">
        <Card className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('details')}</h2>
          <Field label={t('author')}><input className={inputCls} value={form.author} onChange={set('author')} placeholder={t('authorPh')} maxLength={80} /></Field>
          <Field label={t('org')}><input className={inputCls} value={form.org} onChange={set('org')} placeholder={t('orgPh')} maxLength={120} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('loc')}><input className={inputCls} value={form.loc} onChange={set('loc')} placeholder={t('locPh')} maxLength={60} /></Field>
            <Field label={t('year')}><input className={inputCls} value={form.year} onChange={set('year')} inputMode="numeric" maxLength={10} /></Field>
          </div>
        </Card>
        <Card className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{t('balance')}</span>
            <span className={`font-semibold ${low ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{money(me.balance)}</span>
          </div>
          {price < me.prices.generate && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">{t('firstPrice', { price: price === 0 ? t('free') : money(price) })}</p>}
          <Alert>{error}</Alert>
          <Alert kind="ok">{done && t('queued')}</Alert>
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
            <Button type="submit" className="w-full py-3" disabled={!!busy || topic.length < 3}>
              {busy === 'create' && <Spinner />}{busy === 'create' ? t('creating') : t('create', { price: price === 0 ? t('free') : money(price) })}
            </Button>
          )}
        </Card>
      </div>
    </form>
  );
}
