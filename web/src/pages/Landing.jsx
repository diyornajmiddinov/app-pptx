/** The public home page: what SlideAI does, the templates, prices and questions. */
import Footer from '../components/Footer.jsx';
import { BOT_URL, LangSwitch, Logo, TemplateGrid, btnCls } from '../components/ui.jsx';
import { useI18n } from '../i18n.jsx';

const ICONS = {
  text: 'M4 6h16M4 12h16M4 18h10',
  image: 'M4 16l4.6-4.6a2 2 0 012.8 0L16 16m-2-2l1.6-1.6a2 2 0 012.8 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  grid: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.5-2.5 3.5-5.5 3.5-9S14.5 5.5 12 3m0 18c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3M3.5 9h17M3.5 15h17',
  edit: 'M15.2 5.2l3.6 3.6M4 20h4L19.3 8.7a2.5 2.5 0 00-3.6-3.6L4 16.4V20z',
  pdf: 'M7 21h10a2 2 0 002-2V9l-6-6H7a2 2 0 00-2 2v14a2 2 0 002 2zM13 3v6h6',
};

function Icon({ d }) {
  return (
    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
    </span>
  );
}

function Section({ id, title, text, children, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-20 px-4 py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h2>
        {text && <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400">{text}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default function Landing({ signedIn, cfg }) {
  const { t, money } = useI18n();
  const first = cfg?.prices.first;
  const start = signedIn ? '#/app' : '#/login';
  const nav = [['features', 'navFeatures'], ['templates', 'navTemplates'], ['pricing', 'navPricing'], ['faq', 'navFaq']];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            {nav.map(([id, key]) => <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-slate-900 dark:hover:text-white">{t(key)}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <LangSwitch />
            <a href={start} className={btnCls('primary', 'px-3.5 py-2')}>{signedIn ? t('openApp') : t('signIn')}</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.18),transparent)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 ring-1 ring-brand-100 dark:bg-brand-900/40 dark:text-brand-200 dark:ring-brand-900">{t('heroBadge')}</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.4rem]">{t('heroTitle')}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">{t('heroText')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={start} className={btnCls('primary', 'px-6 py-3 text-base')}>{t('startNow')}</a>
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className={btnCls('secondary', 'px-6 py-3 text-base')}>
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-sky-500" fill="currentColor" aria-hidden="true"><path d="M9.8 15.3l-.4 5.3c.6 0 .8-.3 1.1-.6l2.7-2.5 5.5 4c1 .6 1.7.3 2-.9l3.6-16.9c.3-1.5-.5-2.1-1.5-1.7L1.6 9.6C.1 10.2.1 11 1.3 11.4l5.4 1.7 12.5-7.9c.6-.4 1.1-.2.7.2" /></svg>
                @slidechibot
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
            <div className="absolute -right-4 -top-6 w-3/4 rotate-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5"><img src="/templates/4.jpg" alt="" className="w-full" /></div>
            <div className="absolute -bottom-6 -left-4 w-2/3 -rotate-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5"><img src="/templates/7.jpg" alt="" className="w-full" /></div>
            <div className="relative mx-auto mt-10 w-[85%] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5"><img src="/templates/1.jpg" alt="" className="w-full" /></div>
          </div>
        </div>
      </section>

      <Section id="how" title={t('stepsTitle')} className="bg-slate-50 dark:bg-slate-900/50">
        <ol className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-lg font-bold text-white">{n}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{t(`step${n}`)}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{t(`step${n}t`)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="features" title={t('featuresTitle')}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[['f1', 'text'], ['f2', 'image'], ['f3', 'grid'], ['f4', 'globe'], ['f5', 'edit'], ['f6', 'pdf']].map(([k, icon]) => (
            <div key={k} className="rounded-2xl p-6 ring-1 ring-slate-200 dark:ring-slate-800">
              <Icon d={ICONS[icon]} />
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{t(k)}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{t(`${k}t`)}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="templates" title={t('templatesTitle')} text={`${t('templatesText')} ${t('sampleHint')}`} className="bg-slate-50 dark:bg-slate-900/50">
        <TemplateGrid sampleLinks />
      </Section>

      <Section id="pricing" title={t('pricingTitle')} text={t('pricingText')}>
        <div className="grid gap-6 md:grid-cols-3">
          {[['priceGenerate', cfg?.prices.generate, true], ['priceRestyle', cfg?.prices.restyle], ['pricePdf', 0]].map(([k, price, main]) => (
            <div key={k} className={`rounded-2xl p-6 ${main ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' : 'ring-1 ring-slate-200 dark:ring-slate-800'}`}>
              <h3 className={`text-lg font-bold ${main ? '' : 'text-slate-900 dark:text-white'}`}>{t(k)}</h3>
              <p className={`mt-1 text-sm ${main ? 'text-brand-100' : 'text-slate-600 dark:text-slate-400'}`}>{t(`${k}T`)}</p>
              <p className={`mt-6 text-3xl font-extrabold ${main ? '' : 'text-slate-900 dark:text-white'}`}>
                {price === undefined ? '…' : price === 0 ? t('free') : money(price)}
              </p>
              {main && first != null && first < price && (
                <p className="mt-2 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">{t('firstBadge', { price: first === 0 ? t('free') : money(first) })}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8"><a href={start} className={btnCls('primary', 'px-6 py-3 text-base')}>{t('startNow')}</a></div>
      </Section>

      <Section id="faq" title={t('faqTitle')} className="bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200 dark:divide-slate-800 dark:bg-slate-900 dark:ring-slate-800">
          {[1, 2, 3, 4, 5].map((n) => (
            <details key={n} className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white">
                {t(`q${n}`)}
                <span className="text-xl text-slate-400 transition group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 text-slate-600 dark:text-slate-400">{t(`a${n}`)}</p>
            </details>
          ))}
        </div>
      </Section>

      <Footer support={cfg?.support_url} />
    </div>
  );
}
