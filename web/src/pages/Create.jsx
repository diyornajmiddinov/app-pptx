/** New presentation: topic, slides, language, template, title-slide details -> charged and queued. */
import { useState } from 'react';
import { api } from '../api.js';
import { Alert, Button, Card, Field, Segmented, Spinner, TemplateGrid, inputCls } from '../components/ui.jsx';
import { LANGS, useI18n } from '../i18n.jsx';
import Jobs from './Jobs.jsx';

export default function Create({ me, refreshMe, go }) {
  const { t, money, lang } = useI18n();
  const [form, setForm] = useState({ topic: '', slide_count: 10, language: lang, template_id: 1, author: '', org: '', loc: '', year: String(new Date().getFullYear()) });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [jobsKey, setJobsKey] = useState(0);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));
  const price = me.prices.generate;
  const low = me.balance < price;

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError(''); setDone(false);
    try {
      await api.generate({ ...form, topic: form.topic.trim() });
      setDone(true); setJobsKey((k) => k + 1);
      setForm((f) => ({ ...f, topic: '' }));
      refreshMe();
    } catch (err) {
      setError(t(`e_${err.key}`));
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Jobs key={jobsKey} onDone={refreshMe} go={go} />
        <Card className="space-y-5">
          <Field label={t('topic')}>
            <textarea className={`${inputCls} min-h-[88px] resize-y`} value={form.topic} onChange={set('topic')} placeholder={t('topicPh')}
              minLength={3} maxLength={200} required />
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
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t('template')}</h2>
          <TemplateGrid value={form.template_id} onSelect={set('template_id')} compact />
        </Card>
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
          <Alert>{error}</Alert>
          <Alert kind="ok">{done && t('queued')}</Alert>
          {low ? (
            <>
              <Alert>{t('e_lowBalance')}</Alert>
              <Button className="w-full py-3" onClick={() => go('balance')}>{t('topUp')}</Button>
            </>
          ) : (
            <Button type="submit" className="w-full py-3" disabled={busy || form.topic.trim().length < 3}>
              {busy && <Spinner />}{busy ? t('creating') : t('create', { price: money(price) })}
            </Button>
          )}
        </Card>
      </div>
    </form>
  );
}
