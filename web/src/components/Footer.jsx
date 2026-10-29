/** Site footer: legal pages, contact, the bot. Shown on the home page and the legal pages. */
import { OPERATOR } from '../operator.js';
import { useI18n } from '../i18n.jsx';
import { BOT_URL, Logo } from './ui.jsx';

export default function Footer({ support }) {
  const { t } = useI18n();
  const link = 'hover:text-slate-900 dark:hover:text-white';
  return (
    <footer className="border-t border-slate-200 px-4 py-10 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-slate-500">{t('footer')}</p>
          {OPERATOR.name && <p className="mt-1 text-xs text-slate-400">{OPERATOR.name}{OPERATOR.inn ? ` · STIR ${OPERATOR.inn}` : ''}</p>}
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <a href="/oferta" className={link}>{t('oferta')}</a>
          <a href="/maxfiylik" className={link}>{t('privacy')}</a>
          {support && <a href={support} target="_blank" rel="noopener noreferrer" className={link}>{t('support')}</a>}
          <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className={link}>@slidechibot</a>
          <span>© 2026 slidechi.uz</span>
        </nav>
      </div>
    </footer>
  );
}
