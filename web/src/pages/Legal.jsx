/** /oferta and /maxfiylik: the public offer and the privacy policy (texts in legal.js, provider details in operator.js). */
import Footer from '../components/Footer.jsx';
import { LangSwitch, Logo } from '../components/ui.jsx';
import { useI18n } from '../i18n.jsx';
import { LEGAL } from '../legal.js';
import { LEGAL_DATE, OPERATOR } from '../operator.js';

const Blank = () => <mark className="rounded bg-amber-100 px-1 text-amber-900">______</mark>;

/** "{name}" in a paragraph -> the provider's name, or a highlighted blank while operator.js is not filled in. */
function Text({ children }) {
  const parts = children.split('{name}');
  return parts.map((p, i) => <span key={i}>{p}{i < parts.length - 1 && (OPERATOR.name || <Blank />)}</span>);
}

export default function Legal({ doc, support }) {
  const { t, lang } = useI18n();
  const L = LEGAL[doc][lang] || LEGAL[doc].uz;
  const rows = [['name', 'Nomi / Наименование'], ['inn', 'STIR (ИНН)'], ['address', 'Manzil / Адрес'], ['bank', 'Bank rekvizitlari / Реквизиты'],
    ['phone', 'Telefon'], ['email', 'E-mail'], ['telegram', 'Telegram']];
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4"><Logo /><LangSwitch /></div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <a href="/" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">{t('legalBack')}</a>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{L.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('updated')}: {LEGAL_DATE}</p>
        <p className="mt-6 leading-relaxed text-slate-700 dark:text-slate-300"><Text>{L.intro}</Text></p>
        {L.sections.map(([h, paras]) => (
          <section key={h} className="mt-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{h}</h2>
            {paras.map((p, i) => <p key={i} className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300"><Text>{p}</Text></p>)}
          </section>
        ))}
        <section className="mt-10 rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
          <h2 className="font-bold text-slate-900 dark:text-white">Rekvizitlar / Реквизиты</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[180px_1fr]">
            {rows.map(([k, label]) => (
              <div key={k} className="contents">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-slate-900 dark:text-slate-100">{OPERATOR[k] || <Blank />}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer support={support} />
    </div>
  );
}
