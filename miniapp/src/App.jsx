import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import DetailsForm from './components/DetailsForm.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import TemplateGallery from './components/TemplateGallery.jsx';
import DeckList from './components/DeckList.jsx';
import EditorPanel from './components/EditorPanel.jsx';
import { useTelegram } from './hooks/useTelegram.js';
import { useMainButton } from './hooks/useMainButton.js';
import { generatePresentation, getDecks, getMe, restylePresentation, saveLang } from './api/client.js';
import { useI18n } from './i18n/index.jsx';
import { money } from './i18n/messages.js';
import { CATEGORIES, TEMPLATES } from './data/templates.js';

const SAVED_KEYS = ['author', 'org', 'loc'];

export default function App() {
  const { tg, user, initData, isTelegram, showAlert, askConfirm, hapticSelect, hapticNotify } = useTelegram();
  const { t, lang, setLang } = useI18n();

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [slideCount, setSlideCount] = useState(12);
  // presentation language follows the interface language until the user picks another one
  const [language, setLanguage] = useState(lang);
  const deckLangTouched = useRef(false);
  useEffect(() => { if (!deckLangTouched.current) setLanguage(lang); }, [lang]);
  const handleDeckLang = useCallback((l) => { deckLangTouched.current = true; setLanguage(l); }, []);

  // balance and prices (UZS) come from the server; money is added only in the bot (/balance)
  const [account, setAccount] = useState(null); // { balance, prices: { generate, restyle } }
  const loadAccount = useCallback(() => {
    if (!isTelegram) return Promise.resolve(null);
    return getMe({ initData }).then((r) => { if (r) setAccount({ balance: r.balance, prices: r.prices }); return r; });
  }, [isTelegram, initData]);
  // language chosen in the bot (saved on the server) wins over the Telegram app language
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    loadAccount().then((r) => !fromUrl && r?.lang && setLang(r.lang)).catch(() => {});
  }, [loadAccount, setLang]);
  const handleUiLang = useCallback((l) => {
    hapticSelect(); setLang(l);
    if (isTelegram) saveLang({ initData, lang: l }).catch(() => {}); // the bot will answer in this language too
  }, [hapticSelect, setLang, isTelegram, initData]);
  const [details, setDetails] = useState({
    topic: '',
    author: [user?.first_name, user?.last_name].filter(Boolean).join(' '),
    org: '', loc: '', year: String(new Date().getFullYear()),
  });
  const [submitting, setSubmitting] = useState(false);
  const [decks, setDecks] = useState([]);          // all presentations of this user, newest first
  const [deckId, setDeckId] = useState(null);      // the one to redraw in restyle mode
  const [mode, setMode] = useState('new');         // 'new' | 'restyle' | 'editor'
  const submittingRef = useRef(false);

  // Restore author / org / city saved in Telegram CloudStorage (Bot API 6.9+)
  useEffect(() => {
    if (!isTelegram || !tg.isVersionAtLeast('6.9')) return;
    tg.CloudStorage.getItems(SAVED_KEYS, (err, values) => {
      if (!err && values) setDetails((d) => ({ ...d, ...Object.fromEntries(Object.entries(values).filter(([, v]) => v)) }));
    });
  }, [tg, isTelegram]);

  // The user's presentations: any of them can be redrawn in another template
  useEffect(() => {
    if (!isTelegram) return;
    getDecks({ initData }).then((r) => {
      const list = r?.decks || [];
      setDecks(list); // nothing is pre-selected: the user taps the deck to redraw
    }).catch(() => {});
  }, [isTelegram, initData]);

  const handleSelectTemplate = useCallback((id) => { hapticSelect(); setSelectedTemplateId(id); }, [hapticSelect]);
  const deck = decks.find((d) => d.id === deckId);
  const restyling = mode === 'restyle' && decks.length > 0;
  // what is still missing before we can submit (message key), or null when ready
  const missing = !restyling && details.topic.trim().length < 3 ? 'needTopic'
    : restyling && !deck ? 'needDeck'
    : selectedTemplateId === null ? 'needTemplate'
    : restyling && selectedTemplateId === deck.template_id ? 'needOtherTemplate' : null;
  const ready = missing === null;

  const handleGenerate = useCallback(async () => {
    if (submittingRef.current) return;
    if (missing) {
      hapticNotify('warning'); showAlert(t(missing));
      if (missing === 'needTopic') document.getElementById('topic')?.focus();
      return;
    }
    if (!user?.id) { showAlert(t('noUser')); return; }
    if (!restyling) { // the user checks the topic's spelling: a typo makes the AI write about something else
      const topic = details.topic.trim();
      const price = account?.prices?.generate;
      const text = t('confirmTopic', { topic: topic.length > 110 ? `${topic.slice(0, 110)}…` : topic, n: slideCount, price: price ? money(price, lang) : '' });
      submittingRef.current = true; // no second tap while the question is open
      const ok = await askConfirm(text);
      submittingRef.current = false;
      if (!ok) { document.getElementById('topic')?.focus(); return; }
    }
    submittingRef.current = true; setSubmitting(true);
    tg?.MainButton.showProgress(false);
    try {
      if (restyling) {
        await restylePresentation({ initData, payload: { user_id: user.id, template_id: selectedTemplateId, deck_id: deck.id } });
      } else {
      if (isTelegram && tg.isVersionAtLeast('6.9')) SAVED_KEYS.forEach((k) => tg.CloudStorage.setItem(k, details[k] || ''));
      await generatePresentation({
        initData,
        payload: {
          user_id: user.id, template_id: selectedTemplateId, slide_count: slideCount, language,
          topic: details.topic.trim(), author: details.author.trim(), org: details.org.trim(),
          loc: details.loc.trim(), year: details.year.trim(),
        },
      });
      }
      hapticNotify('success');
      tg?.close(); // the bot sends the finished .pptx to the chat
    } catch (err) {
      hapticNotify('error');
      showAlert(t(err.key || 'eServer', { status: err.status }));
      if (err.status === 402) { loadAccount().catch(() => {}); tg?.close(); } // the bot has just sent the top-up buttons
    } finally {
      tg?.MainButton.hideProgress();
      submittingRef.current = false; setSubmitting(false);
    }
  }, [missing, restyling, deck, tg, user, initData, isTelegram, selectedTemplateId, slideCount, language, details, showAlert, askConfirm, account, lang, hapticNotify, t, loadAccount]);

  // MainButton is always shown; dimmed until the topic and template are filled in
  const price = account?.prices?.[restyling ? 'restyle' : 'generate'];
  const buttonText = `${restyling ? t('restyleBtn') : t('mainBtn')}${price ? ` · ${money(price, lang)}` : ''}`;
  const editorTab = mode === 'editor';
  useMainButton({ tg, text: buttonText, active: ready, onClick: handleGenerate, hidden: editorTab });

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-tg-bg px-4 pb-8 text-tg-text">
      <Header user={user} onLangChange={handleUiLang} />
      {account && (
        <p className="-mt-3 mb-5 text-[13px] text-tg-hint">
          <span className="font-semibold text-tg-text">{t('balance', { balance: money(account.balance, lang) })}</span> · {t('topupHint')}
        </p>
      )}
      <div className="mb-5 rounded-xl bg-tg-secondary-bg p-1" role="tablist" aria-label={t('mode')}>
        <div className={`grid gap-1 ${decks.length > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {[['new', t('modeNew')], ...(decks.length > 0 ? [['restyle', t('modeRestyle')]] : []), ['editor', t('modeEditor')]].map(([m, label]) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
              className={`h-9 rounded-lg text-[13px] font-medium ${mode === m ? 'bg-tg-bg text-tg-text shadow-sm' : 'text-tg-hint'}`}>{label}</button>
          ))}
        </div>
        {restyling && deck && (
          <p className="px-3 pb-2 pt-2.5 text-[13px] text-tg-hint">
            {t('restyleNote', { topic: deck.topic, n: deck.slides })}
          </p>
        )}
      </div>
      {editorTab && <EditorPanel tg={tg} initData={initData} isTelegram={isTelegram} />}
      {restyling && <DeckList decks={decks} templates={TEMPLATES} selectedId={deckId} onSelect={(id) => { hapticSelect(); setDeckId(id); }} />}
      {!restyling && !editorTab && <DetailsForm value={details} onChange={setDetails} />}
      {!restyling && !editorTab && <SettingsPanel slideCount={slideCount} onSlideCountChange={setSlideCount} language={language} onLanguageChange={handleDeckLang} />}
      {!editorTab && <TemplateGallery templates={TEMPLATES} categories={CATEGORIES} selectedId={selectedTemplateId} onSelect={handleSelectTemplate} />}
      {!isTelegram && !editorTab && (
        <div className="sticky bottom-4 mt-4">
          <button type="button" onClick={handleGenerate} disabled={submitting}
            className={`h-12 w-full rounded-xl bg-tg-button text-[16px] font-semibold text-tg-button-text disabled:opacity-60 ${ready ? '' : 'opacity-50'}`}>
            {submitting ? t('sending') : buttonText}
          </button>
        </div>
      )}
    </div>
  );
}
