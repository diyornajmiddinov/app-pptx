import { useI18n } from '../i18n/index.jsx';

export default function Header({ user, onLangChange }) {
  const { t, lang, langs } = useI18n();
  const name = user?.first_name || t('guest');
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="flex items-center gap-3 pb-6 pt-5">
      {/* photo_url is only present if the user's privacy settings allow it */}
      {user?.photo_url ? (
        <img src={user.photo_url} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
      ) : (
        <div aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-tg-button text-lg font-semibold text-tg-button-text">
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[21px] font-bold leading-tight tracking-tight">{t('hello', { name })}</h1>
        <p className="text-[14px] text-tg-hint">{t('subtitle')}</p>
      </div>
      {/* interface language: the same choice as in the bot, saved on the server */}
      <div role="radiogroup" aria-label={t('uiLang')} className="flex shrink-0 rounded-lg bg-tg-secondary-bg p-0.5">
        {langs.map((l) => (
          <button key={l.id} type="button" role="radio" aria-checked={lang === l.id} aria-label={l.label} onClick={() => onLangChange(l.id)}
            className={`h-7 w-9 rounded-md text-[12px] font-semibold ${lang === l.id ? 'bg-tg-bg text-tg-text shadow-sm' : 'text-tg-hint'}`}>
            {l.short}
          </button>
        ))}
      </div>
    </header>
  );
}
