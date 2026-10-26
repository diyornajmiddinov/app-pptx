import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { LANGS, MESSAGES, TEMPLATE_NAMES } from './messages.js';

const I18nContext = createContext(null);
const SUPPORTED = LANGS.map((l) => l.id);

/**
 * Starting language: ?lang= from the bot's WebApp button (the user picked it in the bot)
 * → Telegram app language → Uzbek. The backend preference (/api/me) can override it later.
 */
export function initialLang() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (SUPPORTED.includes(fromUrl)) return fromUrl;
  const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code?.slice(0, 2);
  return SUPPORTED.includes(tgLang) ? tgLang : 'uz';
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const setLang = useCallback((l) => { if (SUPPORTED.includes(l)) { setLangState(l); document.documentElement.lang = l; } }, []);
  const t = useCallback((key, vars = {}) => {
    const v = MESSAGES[lang][key] ?? MESSAGES.uz[key] ?? key;
    if (typeof v === 'function') return v(typeof vars === 'object' && 'n' in vars && Object.keys(vars).length === 1 ? vars.n : vars);
    return v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  }, [lang]);
  const templateName = useCallback((tpl) => (lang === 'uz' ? tpl.name : TEMPLATE_NAMES[tpl.id]?.[lang === 'ru' ? 0 : 1] ?? tpl.name), [lang]);
  const value = useMemo(() => ({ lang, setLang, t, templateName, langs: LANGS }), [lang, setLang, t, templateName]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
