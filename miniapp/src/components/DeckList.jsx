/**
 * The user's presentations (newest first) as a compact horizontal strip: swipe freely to browse,
 * tap a card to select it. Swiping never changes the selection. One row, so 100 presentations
 * take no more room than three. Acts as a radio group for accessibility.
 */
import { useI18n } from '../i18n/index.jsx';

export default function DeckList({ decks, templates, selectedId, onSelect }) {
  const { t, lang, templateName } = useI18n();
  const byId = Object.fromEntries(templates.map((tpl) => [tpl.id, tpl]));
  const date = (sec) => new Date(sec * 1000).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ru-RU');
  const index = decks.findIndex((d) => d.id === selectedId);

  return (
    <section className="pb-6" aria-label={t('decksTitle')}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-[15px] font-semibold">{t('decksTitle')}</h2>
        <span className="shrink-0 text-[13px] tabular-nums text-tg-hint" aria-live="polite">
          {index >= 0 ? `${index + 1} / ${decks.length}` : decks.length}
        </span>
      </div>
      {/* free momentum scroll (no forced snapping) so a light flick moves through many cards */}
      <div role="radiogroup" aria-label={t('decksTitle')}
        className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto overscroll-x-contain px-4 pb-1 pt-0.5 [-webkit-overflow-scrolling:touch]">
        {decks.map((d) => {
          const active = d.id === selectedId;
          const tpl = byId[d.template_id];
          return (
            <button key={d.id} type="button" role="radio" aria-checked={active} onClick={() => onSelect(d.id)}
              className={[
                'w-[136px] shrink-0 overflow-hidden rounded-[10px] bg-tg-secondary-bg text-left transition-shadow duration-150',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-tg-link',
                active ? 'ring-2 ring-tg-button' : '',
              ].join(' ')}>
              <span className="relative block">
                {tpl && <img src={tpl.thumbnail} alt="" draggable="false" loading="lazy" className="aspect-video w-full object-cover" />}
                {active && (
                  <span className="absolute right-1 top-1 grid h-5 w-5 animate-pop place-items-center rounded-full bg-tg-button text-[11px] font-bold text-tg-button-text" aria-hidden="true">✓</span>
                )}
              </span>
              <span className="block px-2 pb-2 pt-1.5">
                <span className="line-clamp-2 text-[13px] font-medium leading-tight">{d.topic}</span>
                <span className="mt-0.5 block truncate text-[11px] text-tg-hint">
                  {t('deckMeta', { slides: t('slidesValue', { n: d.slides }), tpl: tpl ? templateName(tpl) : `#${d.template_id}`, date: date(d.created) })}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
