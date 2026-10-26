import { useEffect, useMemo, useRef, useState } from 'react';
import CategoryTabs from './CategoryTabs.jsx';
import TemplateCard from './TemplateCard.jsx';
import { useI18n } from '../i18n/index.jsx';

const PAGE_SIZE = 12;

/**
 * Template gallery with category tabs and incremental ("infinite") pagination.
 *
 * Why not full virtualization: for ~100 lightweight cards, rendering in pages
 * of 12 plus lazy-loaded images keeps the DOM small and the first paint fast,
 * without the fixed-row-height constraints a virtualized responsive grid
 * needs. If the catalogue grows past ~500, swap the slice below for
 * @tanstack/react-virtual.
 */
export default function TemplateGallery({ templates, categories, selectedId, onSelect }) {
  const { t } = useI18n();
  const [category, setCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const filtered = useMemo(
    () => (category === 'all' ? templates : templates.filter((t) => t.category === category)),
    [templates, category],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (id) => {
    setCategory(id);
    setVisibleCount(PAGE_SIZE); // restart pagination for the new category
  };

  // Load the next page when the sentinel below the grid nears the viewport.
  // visibleCount is a dependency so the observer re-arms after each page;
  // otherwise it would not fire again if the sentinel stays on screen.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: '400px 0px' }, // prefetch before the user hits the bottom
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, visibleCount, filtered.length]);

  return (
    <section aria-label={t('templates')}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-[20px] font-bold tracking-tight">{t('templates')}</h2>
        <span className="text-[13px] text-tg-hint">{t('count', { n: filtered.length })}</span>
      </div>

      <CategoryTabs categories={categories.map((c) => ({ ...c, label: t('cat_' + c.id) }))} active={category} onChange={handleCategoryChange} />

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3">
        {visible.map((t) => (
          <TemplateCard key={t.id} template={t} selected={t.id === selectedId} onSelect={onSelect} />
        ))}
      </div>

      {hasMore ? (
        <div ref={sentinelRef} className="flex justify-center py-6" aria-hidden="true">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-tg-hint border-t-transparent" />
        </div>
      ) : (
        <div className="h-6" />
      )}
    </section>
  );
}
