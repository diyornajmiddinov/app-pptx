/** Small shared building blocks: buttons, cards, fields, the template grid, the site header. */
import { memo, useMemo, useState } from 'react';
import { TEMPLATES } from '../../../miniapp/src/data/templates.js';
import { LANGS, useI18n } from '../i18n.jsx';

export const BOT_URL = 'https://t.me/slidechibot';
export const CATEGORIES = ['all', 'business', 'academic', 'creative', 'minimalist'];
export { TEMPLATES };

const cx = (...c) => c.filter(Boolean).join(' ');

const BTN = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20 disabled:bg-brand-400',
  secondary: 'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700',
  ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
  danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40',
};

/** Button look, also for <a> links that should look like buttons. */
export const btnCls = (variant = 'primary', className = '') => cx(
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70',
  'dark:focus-visible:ring-offset-slate-950', BTN[variant], className);

export function Button({ variant = 'primary', className, ...props }) {
  return <button type="button" className={btnCls(variant, className)} {...props} />;
}

export function Card({ className, ...props }) {
  return <div className={cx('rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 sm:p-6', className)} {...props} />;
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
    </label>
  );
}

export const inputCls = 'block w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 ring-1 ring-slate-300 placeholder:text-slate-400 '
  + 'focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 dark:text-slate-100 dark:ring-slate-700';

export function Alert({ kind = 'error', children }) {
  if (!children) return null;
  const s = kind === 'error'
    ? 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900'
    : 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900';
  return <div role={kind === 'error' ? 'alert' : 'status'} className={cx('rounded-xl px-4 py-3 text-sm ring-1', s)}>{children}</div>;
}

export function Spinner({ className }) {
  return <span className={cx('inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent', className)} aria-hidden="true" />;
}

export function Segmented({ value, options, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)}
          className={cx('rounded-lg px-3.5 py-1.5 text-sm font-medium transition',
            value === o.id ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white')}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <select aria-label="Til / Язык / Language" value={lang} onChange={(e) => setLang(e.target.value)}
      className="rounded-lg border-0 bg-transparent py-1.5 pl-2 pr-7 text-sm font-medium text-slate-600 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 dark:text-slate-300 dark:ring-slate-700">
      {LANGS.map((l) => <option key={l.id} value={l.id}>{l.short}</option>)}
    </select>
  );
}

export function Logo() {
  return (
    <a href="#/" className="flex items-center gap-2 font-extrabold tracking-tight text-slate-900 dark:text-white">
      <img src="/favicon.svg" alt="" className="h-8 w-8" />
      <span className="text-lg">Slide<span className="text-brand-600 dark:text-brand-400">AI</span></span>
    </a>
  );
}

export function useCopy() {
  const [copied, setCopied] = useState('');
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(''), 1500); } catch { /* not allowed */ }
  };
  return [copied, copy];
}

const Thumb = memo(function Thumb({ tpl, selected, onSelect, name }) {
  const body = (
    <>
      <div className={cx('relative aspect-video overflow-hidden rounded-xl bg-slate-100 transition dark:bg-slate-800',
        selected ? 'ring-[3px] ring-brand-600 ring-offset-2 dark:ring-offset-slate-900' : 'ring-1 ring-slate-200 group-hover:ring-brand-300 dark:ring-slate-700')}>
        <img src={tpl.thumbnail} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        {selected && (
          <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white shadow">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        )}
      </div>
      <p className={cx('mt-2 truncate text-sm', selected ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400')}>{name}</p>
    </>
  );
  return onSelect
    ? <button type="button" onClick={() => onSelect(tpl.id)} aria-pressed={selected} className="group block w-full text-left focus:outline-none">{body}</button>
    : <div className="group">{body}</div>;
});

/** The 40 templates with category tabs; selectable when onSelect is given. */
export function TemplateGrid({ value, onSelect, exclude, compact }) {
  const { t, templateName } = useI18n();
  const [cat, setCat] = useState('all');
  const list = useMemo(() => TEMPLATES.filter((x) => (cat === 'all' || x.category === cat) && x.id !== exclude), [cat, exclude]);
  return (
    <div>
      <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
            className={cx('shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition',
              cat === c ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700')}>
            {t(`cat_${c}`)}
          </button>
        ))}
      </div>
      <div className={cx('grid gap-4', compact ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5')}>
        {list.map((tpl) => <Thumb key={tpl.id} tpl={tpl} name={templateName(tpl)} selected={value === tpl.id} onSelect={onSelect} />)}
      </div>
    </div>
  );
}
