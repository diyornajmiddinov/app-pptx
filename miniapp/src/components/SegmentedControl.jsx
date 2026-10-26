/**
 * iOS-style segmented control. Acts as a radio group for accessibility.
 */
export default function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid rounded-[10px] bg-tg-secondary-bg p-0.5"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={[
              'h-9 rounded-[8px] text-[14px] font-medium transition-colors duration-150',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-tg-link',
              active
                ? 'bg-tg-bg text-tg-text shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
                : 'text-tg-hint',
            ].join(' ')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
