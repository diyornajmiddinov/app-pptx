import SegmentedControl from './SegmentedControl.jsx';
import { useI18n } from '../i18n/index.jsx';
import { LANGS } from '../i18n/messages.js';

export const MIN_SLIDES = 6;
export const MAX_SLIDES = 30;

export const LANGUAGES = LANGS.map((l) => ({ value: l.id, label: l.label }));

function Stepper({ value, onChange }) {
  const { t } = useI18n();
  const btn = 'grid h-9 w-11 place-items-center rounded-[8px] bg-tg-bg text-[20px] font-semibold text-tg-text disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-tg-link';
  return (
    <div className="flex items-center justify-between rounded-[10px] bg-tg-secondary-bg p-0.5">
      <button type="button" className={btn} aria-label={t('dec')} disabled={value <= MIN_SLIDES} onClick={() => onChange(value - 1)}>−</button>
      <span className="text-[15px] font-semibold tabular-nums" aria-live="polite">{t('slidesValue', { n: value })}</span>
      <button type="button" className={btn} aria-label={t('inc')} disabled={value >= MAX_SLIDES} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

export default function SettingsPanel({ slideCount, onSlideCountChange, language, onLanguageChange }) {
  const { t } = useI18n();
  return (
    <section className="space-y-4 pb-6" aria-label={t('settings')}>
      <div>
        <h2 className="mb-2 text-[15px] font-semibold">{t('deckLang')}</h2>
        <p className="mb-2 -mt-1 text-[12px] text-tg-hint">{t('deckLangHint')}</p>
        <SegmentedControl label={t('deckLang')} value={language} onChange={onLanguageChange} options={LANGUAGES} />
      </div>
      <div>
        <h2 className="mb-2 text-[15px] font-semibold">{t('slides')}</h2>
        <Stepper value={slideCount} onChange={onSlideCountChange} />
        <p className="mt-1.5 text-[12px] text-tg-hint">{t('slidesHint')}</p>
      </div>
    </section>
  );
}
