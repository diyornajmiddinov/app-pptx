/** Build-time rendering (prerender.js): the home page per language and the legal pages as plain HTML for crawlers. */
import { renderToString } from 'react-dom/server';
import { I18nProvider } from './i18n.jsx';
import Landing from './pages/Landing.jsx';
import Legal from './pages/Legal.jsx';

export function render(page, lang) {
  const body = page === 'home' ? <Landing signedIn={false} cfg={null} /> : <Legal doc={page} />;
  return renderToString(<I18nProvider initial={lang}>{body}</I18nProvider>);
}
