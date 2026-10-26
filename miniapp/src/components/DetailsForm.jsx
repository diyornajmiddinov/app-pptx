/**
 * Topic + author details. Shown on the title slide and in the footer of every slide.
 * Author / org / city are remembered in Telegram CloudStorage (Bot API 6.9+) so the user
 * types them only once.
 */
import { useI18n } from '../i18n/index.jsx';

const FIELDS = [
  { key: 'author', label: 'author', placeholder: 'authorPh' },
  { key: 'org', label: 'org', placeholder: 'orgPh' },
  { key: 'loc', label: 'loc', placeholder: 'locPh' },
  { key: 'year', label: 'year', inputMode: 'numeric' },
];

const inputCls =
  'w-full rounded-[10px] bg-tg-secondary-bg px-3 py-2.5 text-[15px] text-tg-text placeholder:text-tg-hint outline-none focus:ring-1 focus:ring-tg-button';

export default function DetailsForm({ value, onChange }) {
  const { t } = useI18n();
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  return (
    <section className="space-y-3 pb-6" aria-label={t('details')}>
      <div>
        <label htmlFor="topic" className="mb-1.5 block text-[15px] font-semibold">{t('topic')}</label>
        <textarea id="topic" rows={2} maxLength={200} value={value.topic} onChange={set('topic')}
          placeholder={t('topicPh')} className={`${inputCls} resize-none`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.key === 'author' || f.key === 'org' ? 'col-span-2' : ''}>
            <label htmlFor={f.key} className="mb-1.5 block text-[13px] text-tg-hint">{t(f.label)}</label>
            <input id={f.key} value={value[f.key]} onChange={set(f.key)} placeholder={f.placeholder ? t(f.placeholder) : String(new Date().getFullYear())}
              inputMode={f.inputMode} maxLength={f.key === 'org' ? 120 : 80} className={inputCls} />
          </div>
        ))}
      </div>
    </section>
  );
}
