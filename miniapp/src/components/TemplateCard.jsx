import { memo } from 'react';
import { useI18n } from '../i18n/index.jsx';

/**
 * Draws a tiny 16:9 slide from the template's palette, so every template has
 * a real-looking preview even without exported thumbnail images.
 */
function MiniSlide({ palette, layout }) {
  const { bg, accent, ink } = palette;
  const bar = (cls, color, extra = '') => (
    <div className={`absolute rounded-[2px] ${cls} ${extra}`} style={{ backgroundColor: color }} />
  );

  return (
    <div className="absolute inset-0" style={{ backgroundColor: bg }} aria-hidden="true">
      {layout === 0 && (
        <>
          {bar('left-[8%] top-[16%] h-[6%] w-[14%] rounded-full', accent)}
          {bar('left-[8%] top-[32%] h-[10%] w-[64%]', ink)}
          {bar('left-[8%] top-[50%] h-[5%] w-[50%]', ink, 'opacity-40')}
          {bar('left-[8%] top-[60%] h-[5%] w-[42%]', ink, 'opacity-40')}
        </>
      )}
      {layout === 1 && (
        <>
          {bar('right-0 top-0 h-full w-[40%] rounded-none', accent)}
          {bar('left-[8%] top-[30%] h-[10%] w-[40%]', ink)}
          {bar('left-[8%] top-[48%] h-[5%] w-[34%]', ink, 'opacity-40')}
          {bar('left-[8%] top-[58%] h-[5%] w-[28%]', ink, 'opacity-40')}
        </>
      )}
      {layout === 2 && (
        <>
          {bar('left-1/2 top-[38%] h-[11%] w-[56%] -translate-x-1/2', ink)}
          {bar('left-1/2 top-[56%] h-[4%] w-[16%] -translate-x-1/2 rounded-full', accent)}
          {bar('bottom-0 left-0 h-[6%] w-full rounded-none', accent)}
        </>
      )}
    </div>
  );
}

function CheckBadge() {
  return (
    <span className="absolute right-1.5 top-1.5 grid h-6 w-6 animate-pop place-items-center rounded-full bg-tg-button text-tg-button-text shadow-md">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
        <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/**
 * memo(): with up to 100 cards, only the two cards whose `selected` prop
 * changes re-render when the user taps a template.
 */
function TemplateCard({ template, selected, onSelect }) {
  const { templateName } = useI18n();
  const name = templateName(template);
  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      aria-pressed={selected}
      aria-label={name}
      className="group block w-full text-left focus:outline-none"
    >
      <div
        className={[
          'relative aspect-video overflow-hidden rounded-xl transition-transform duration-150 active:scale-[0.97]',
          selected
            ? 'ring-[3px] ring-tg-button ring-offset-2 ring-offset-tg-bg'
            : 'ring-1 ring-tg-separator group-focus-visible:ring-2 group-focus-visible:ring-tg-link',
        ].join(' ')}
      >
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <MiniSlide palette={template.palette} layout={template.layout} />
        )}
        {selected && <CheckBadge />}
      </div>
      <p
        className={[
          'mt-2 truncate text-[13px]',
          selected ? 'font-semibold text-tg-text' : 'text-tg-hint',
        ].join(' ')}
      >
        {name}
      </p>
    </button>
  );
}

export default memo(TemplateCard);
