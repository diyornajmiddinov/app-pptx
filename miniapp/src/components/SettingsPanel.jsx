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

export const DENSITIES = ['concise', 'balanced', 'detailed'];

/** "✨ Animated": a switch for those it is open to (admins until the admin panel opens it), "coming soon" for the rest */
function AnimSwitch({ anim, on, onChange, templateOk, priceText }) {
  const { t } = useI18n();
  const usable = anim.open && templateOk;
  return (
    <div className="flex items-center justify-between gap-3 rounded-[10px] bg-tg-secondary-bg px-3 py-2.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[15px] font-semibold">
          <span>✨ {t('animTitle')}</span>
          {!anim.open && <span className="rounded-full bg-tg-button px-2 py-0.5 text-[11px] font-semibold text-tg-button-text">{t('soon')}</span>}
        </div>
        <p className="mt-0.5 text-[12px] text-tg-hint">{!anim.open ? t('animSoonHint') : templateOk ? t('animHint', { price: priceText }) : t('animNoTpl')}</p>
      </div>
      <button type="button" role="switch" aria-checked={on && usable} aria-label={t('animTitle')} disabled={!usable} onClick={() => onChange(!on)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-40 ${on && usable ? 'bg-tg-button' : 'bg-tg-hint/40'}`}>
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on && usable ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

export default function SettingsPanel({ slideCount, onSlideCountChange, language, onLanguageChange, density, onDensityChange,
  anim, animated, onAnimatedChange, animTemplateOk, animPriceText }) {
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
      <div>
        <h2 className="mb-2 text-[15px] font-semibold">{t('density')}</h2>
        <SegmentedControl label={t('density')} value={density} onChange={onDensityChange} options={DENSITIES.map((d) => ({ value: d, label: t(`d_${d}`) }))} />
        <p className="mt-1.5 text-[12px] text-tg-hint">{t(`d_${density}_t`)}</p>
      </div>
      {anim && <AnimSwitch anim={anim} on={animated} onChange={onAnimatedChange} templateOk={animTemplateOk} priceText={animPriceText} />}
    </section>
  );
}
