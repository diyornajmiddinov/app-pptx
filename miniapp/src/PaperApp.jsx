/**
 * Referat / mustaqil ish form: opened by the bot's two bottom buttons (?mode=paper&type=referat|mustaqil).
 * Topic, length, language, the title page and the teacher's layout rules -> /api/paper (charged now); the worker
 * writes it and the bot sends the Word and PDF files to the chat. The title page and layout are remembered in
 * Telegram CloudStorage (Bot API 6.9+), so the next paper needs only a topic.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import SegmentedControl from './components/SegmentedControl.jsx';
import { useTelegram } from './hooks/useTelegram.js';
import { useMainButton } from './hooks/useMainButton.js';
import { useAvatar } from './hooks/useAvatar.js';
import { getMe, orderPaper, saveLang } from './api/client.js';
import { useI18n } from './i18n/index.jsx';
import { money } from './i18n/messages.js';

const KEEP = 'paper'; // one CloudStorage item: JSON of the title page and the layout
const MIN_PAGES = 8;
const MAX_PAGES = 30;
const TITLE_FIELDS = [['university', 200], ['faculty', 120], ['department', 120], ['student', 80], ['group', 80], ['teacher', 80], ['city', 60]];
const STANDARD = { font_size: 14, spacing: 1.5, margin_left: 30, margin_right: 15, margin_top: 20, margin_bottom: 20, page_numbers: 'bottom_center', toc_title: 'mundarija' };
const PAPER_LANGS = [['uz', "O'zbekcha"], ['uzc', 'Ўзбекча'], ['ru', 'Русский'], ['en', 'English']];

const inputCls = 'w-full rounded-[10px] bg-tg-secondary-bg px-3 py-2.5 text-[15px] text-tg-text placeholder:text-tg-hint outline-none focus:ring-1 focus:ring-tg-button';
const labelCls = 'mb-1.5 block text-[13px] text-tg-hint';
const h2Cls = 'mb-2 text-[15px] font-semibold';

function Stepper({ value, onChange, text, dec, inc }) {
  const btn = 'grid h-9 w-11 place-items-center rounded-[8px] bg-tg-bg text-[20px] font-semibold text-tg-text disabled:opacity-40';
  return (
    <div className="flex items-center justify-between rounded-[10px] bg-tg-secondary-bg p-0.5">
      <button type="button" className={btn} aria-label={dec} disabled={value <= MIN_PAGES} onClick={() => onChange(Math.max(MIN_PAGES, value - 1))}>−</button>
      <span className="text-[15px] font-semibold tabular-nums" aria-live="polite">{text}</span>
      <button type="button" className={btn} aria-label={inc} disabled={value >= MAX_PAGES} onClick={() => onChange(Math.min(MAX_PAGES, value + 1))}>+</button>
    </div>
  );
}

export default function PaperApp() {
  const { tg, user, initData, isTelegram, showAlert, askConfirm, hapticSelect, hapticNotify } = useTelegram();
  const { t, lang, setLang } = useI18n();
  const avatar = useAvatar({ user, initData, isTelegram });
  const params = new URLSearchParams(window.location.search);
  const [form, setForm] = useState({
    topic: '', subject: '', doc_type: params.get('type') === 'mustaqil' ? 'mustaqil' : 'referat', language: lang, pages: 15, wishes: '',
    ministry: '', ...Object.fromEntries(TITLE_FIELDS.map(([k]) => [k, ''])), year: String(new Date().getFullYear()),
  });
  const [fmt, setFmt] = useState(STANDARD);
  const [account, setAccount] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));
  const setF = (k) => (v) => setFmt((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!isTelegram) return;
    getMe({ initData }).then((r) => {
      if (!r) return;
      setAccount(r);
      if (!params.get('lang') && r.lang) setLang(r.lang);
      const name = [r.user?.first_name, r.user?.last_name].filter(Boolean).join(' ');
      if (name) setForm((f) => (f.student ? f : { ...f, student: name }));
    }).catch(() => {});
    if (tg.isVersionAtLeast('6.9')) {
      tg.CloudStorage.getItem(KEEP, (err, value) => {
        if (err || !value) return;
        try {
          const saved = JSON.parse(value);
          setForm((f) => ({ ...f, ...saved.fields, student: saved.fields?.student || f.student }));
          if (saved.format) setFmt({ ...STANDARD, ...saved.format });
        } catch { /* an old or broken value: start clean */ }
      });
    }
  }, [tg, isTelegram, initData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUiLang = useCallback((l) => {
    hapticSelect(); setLang(l);
    if (isTelegram) saveLang({ initData, lang: l }).catch(() => {});
  }, [hapticSelect, setLang, isTelegram, initData]);

  const price = account?.prices?.paper;
  const priceText = price === 0 ? t('free') : price ? money(price, lang) : '';
  const topic = form.topic.trim();
  const ready = topic.length >= 3;

  const submit = useCallback(async () => {
    if (busy.current) return;
    if (!ready) { hapticNotify('warning'); showAlert(t('needTopic')); document.getElementById('p-topic')?.focus(); return; }
    if (!isTelegram) { showAlert(t('noUser')); return; }
    busy.current = true;
    const ok = await askConfirm(t('pConfirm', { topic: topic.length > 110 ? `${topic.slice(0, 110)}…` : topic, pages: form.pages, price: priceText }));
    if (!ok) { busy.current = false; return; }
    setSubmitting(true); tg?.MainButton.showProgress(false);
    const fields = Object.fromEntries(['ministry', ...TITLE_FIELDS.map(([k]) => k), 'year'].map((k) => [k, form[k].trim()]));
    if (tg.isVersionAtLeast('6.9')) tg.CloudStorage.setItem(KEEP, JSON.stringify({ fields: { ...fields, subject: form.subject }, format: fmt }));
    try {
      await orderPaper({ initData, payload: { topic, subject: form.subject.trim(), doc_type: form.doc_type, language: form.language,
        pages: form.pages, wishes: form.wishes.trim(), ...fields, format: fmt } });
      hapticNotify('success');
      tg?.close(); // the bot says it is accepted and sends the files when they are ready
    } catch (err) {
      hapticNotify('error');
      showAlert(err.status === 429 ? t('e429paper') : t(err.key || 'eServer', { status: err.status }));
      if (err.status === 402 || err.key === 'eSubscribe') tg?.close(); // the bot has just sent the top-up / join buttons
    } finally {
      tg?.MainButton.hideProgress(); busy.current = false; setSubmitting(false);
    }
  }, [ready, isTelegram, askConfirm, t, topic, form, priceText, fmt, tg, initData, hapticNotify, showAlert]);

  const buttonText = `${t('pBtn')}${priceText ? ` · ${priceText}` : ''}`;
  useMainButton({ tg, text: buttonText, active: ready, onClick: submit });

  const margin = (k, min, max) => (
    <div>
      <label htmlFor={`m-${k}`} className={labelCls}>{t(`m_${k}`)}</label>
      <input id={`m-${k}`} type="number" inputMode="numeric" min={min} max={max} className={inputCls} value={fmt[`margin_${k}`]}
        onChange={(e) => setF(`margin_${k}`)(Math.min(max, Math.max(min, Number(e.target.value) || min)))} />
    </div>
  );

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-tg-bg px-4 pb-8 text-tg-text">
      <Header user={{ ...(user?.first_name ? user : { ...user, ...account?.user }), photo_url: avatar }} onLangChange={handleUiLang} subtitle={t('pSubtitle')} />
      {account && (
        <p className="-mt-3 mb-5 text-[13px] text-tg-hint">
          <span className="font-semibold text-tg-text">{t('balance', { balance: money(account.balance, lang) })}</span> · {t('topupHint')}
        </p>
      )}

      <section className="space-y-4 pb-6">
        <SegmentedControl label={t('pType')} value={form.doc_type} onChange={set('doc_type')}
          options={['referat', 'mustaqil'].map((k) => ({ value: k, label: t(`dt_${k}`) }))} />
        <div>
          <label htmlFor="p-topic" className="mb-1.5 block text-[15px] font-semibold">{t('topic')}</label>
          <textarea id="p-topic" rows={2} maxLength={200} value={form.topic} onChange={set('topic')} placeholder={t('pTopicPh')} className={`${inputCls} resize-none`} />
        </div>
        <div>
          <label htmlFor="p-subject" className={labelCls}>{t('pSubject')}</label>
          <input id="p-subject" maxLength={120} value={form.subject} onChange={set('subject')} placeholder={t('pSubjectPh')} className={inputCls} />
        </div>
        <div>
          <h2 className={h2Cls}>{t('pLang')}</h2>
          <SegmentedControl label={t('pLang')} value={form.language} onChange={set('language')} options={PAPER_LANGS.map(([value, label]) => ({ value, label }))} />
        </div>
        <div>
          <h2 className={h2Cls}>{t('pPages')}</h2>
          <Stepper value={form.pages} onChange={set('pages')} text={t('pagesValue', { n: form.pages })} dec={t('dec')} inc={t('inc')} />
        </div>
        <div>
          <label htmlFor="p-wishes" className={labelCls}>{t('pWishes')}</label>
          <textarea id="p-wishes" rows={2} maxLength={600} value={form.wishes} onChange={set('wishes')} placeholder={t('pWishesPh')} className={`${inputCls} resize-none`} />
        </div>
      </section>

      <section className="space-y-3 pb-6" aria-label={t('pTitle')}>
        <h2 className="text-[15px] font-semibold">{t('pTitle')}</h2>
        <p className="-mt-1 text-[12px] text-tg-hint">{t('pTitleHint')}</p>
        <div className="grid grid-cols-2 gap-3">
          {TITLE_FIELDS.map(([k, max]) => (
            <div key={k} className={['university', 'faculty', 'department', 'teacher'].includes(k) ? 'col-span-2' : ''}>
              <label htmlFor={`f-${k}`} className={labelCls}>{t(`f_${k}`)}</label>
              <input id={`f-${k}`} maxLength={max} value={form[k]} onChange={set(k)} placeholder={t(`f_${k}Ph`)} className={inputCls} />
            </div>
          ))}
          <div>
            <label htmlFor="f-year" className={labelCls}>{t('f_year')}</label>
            <input id="f-year" maxLength={10} inputMode="numeric" value={form.year} onChange={set('year')} className={inputCls} />
          </div>
          <div className="col-span-2">
            <label htmlFor="f-ministry" className={labelCls}>{t('f_ministry')}</label>
            <input id="f-ministry" maxLength={200} value={form.ministry} onChange={set('ministry')} className={inputCls} />
            <p className="mt-1 text-[12px] text-tg-hint">{t('f_ministryHint')}</p>
          </div>
        </div>
      </section>

      <details className="mb-6 rounded-[10px] bg-tg-secondary-bg p-3">
        <summary className="cursor-pointer text-[15px] font-semibold">{t('fmtTitle')}</summary>
        <p className="mt-1 text-[12px] text-tg-hint">{t('fmtStd')}</p>
        <div className="mt-3 space-y-3">
          <div>
            <h3 className={labelCls}>{t('fmtFont')}</h3>
            <SegmentedControl label={t('fmtFont')} value={fmt.font_size} onChange={setF('font_size')} options={[12, 13, 14].map((n) => ({ value: n, label: String(n) }))} />
          </div>
          <div>
            <h3 className={labelCls}>{t('fmtSpacing')}</h3>
            <SegmentedControl label={t('fmtSpacing')} value={fmt.spacing} onChange={setF('spacing')}
              options={[1, 1.15, 1.5, 2].map((n) => ({ value: n, label: String(n).replace('.', ',') }))} />
          </div>
          <div>
            <h3 className={labelCls}>{t('fmtMargins')}</h3>
            <div className="grid grid-cols-4 gap-2">{margin('left', 10, 40)}{margin('right', 10, 30)}{margin('top', 10, 30)}{margin('bottom', 10, 30)}</div>
          </div>
          <div>
            <label htmlFor="f-pn" className={labelCls}>{t('fmtNumbers')}</label>
            <select id="f-pn" className={inputCls} value={fmt.page_numbers} onChange={(e) => setF('page_numbers')(e.target.value)}>
              {['bottom_center', 'bottom_right', 'top_center', 'top_right'].map((k) => <option key={k} value={k}>{t(`pn_${k}`)}</option>)}
            </select>
          </div>
          <div>
            <h3 className={labelCls}>{t('fmtToc')}</h3>
            <SegmentedControl label={t('fmtToc')} value={fmt.toc_title} onChange={setF('toc_title')} options={['mundarija', 'reja'].map((k) => ({ value: k, label: t(`toc_${k}`) }))} />
          </div>
        </div>
      </details>

      <p className="text-[13px] text-tg-hint">✓ {t('pIncludes')}</p>
      <p className="mt-2 text-[12px] text-tg-hint">{t('pCheck')}</p>

      {!isTelegram && (
        <div className="sticky bottom-4 mt-4">
          <button type="button" onClick={submit} disabled={submitting}
            className={`h-12 w-full rounded-xl bg-tg-button text-[16px] font-semibold text-tg-button-text disabled:opacity-60 ${ready ? '' : 'opacity-50'}`}>
            {submitting ? t('sending') : buttonText}
          </button>
        </div>
      )}
    </div>
  );
}
