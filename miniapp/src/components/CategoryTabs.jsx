import { useI18n } from '../i18n/index.jsx';
/**
 * Horizontally scrollable category pills. Sticky so the user can switch
 * category while deep in the grid.
 */
export default function CategoryTabs({ categories, active, onChange }) {
  const { t } = useI18n();
  return (
    <div className="sticky top-0 z-10 -mx-4 bg-tg-bg px-4 py-2">
      <div role="tablist" aria-label={t('categories')} className="no-scrollbar flex gap-2 overflow-x-auto">
        {categories.map((cat) => {
          const selected = cat.id === active;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(cat.id)}
              className={[
                'h-8 shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors duration-150',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tg-link',
                selected ? 'bg-tg-text text-tg-bg' : 'bg-tg-secondary-bg text-tg-text',
              ].join(' ')}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
