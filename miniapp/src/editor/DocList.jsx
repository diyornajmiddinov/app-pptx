/** Start page of the editor: upload any presentation, open an edited one, or open one the bot made. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, LANG } from './api.js';
import { t } from './i18n.js';

const ACCEPT = '.pptx,.ppt,.pps,.ppsx,.odp';
const date = (sec) => new Date(sec * 1000).toLocaleString(LANG === 'en' ? 'en-GB' : 'ru-RU', { dateStyle: 'short', timeStyle: 'short' });

export default function DocList({ onOpen, onFatal }) {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(null);   // id / "upload" while working
  const [error, setError] = useState(null);
  const [over, setOver] = useState(false);
  const input = useRef(null);

  const load = useCallback(() => api.docs().then(setData).catch((e) => onFatal(e.key)), [onFatal]);
  useEffect(() => { load(); }, [load]);

  const upload = async (file) => {
    if (!file) return;
    setError(null); setBusy('upload');
    try { const { id } = await api.importFile(file); onOpen(id); } catch (e) { if (e.key === 'expired') onFatal('expired'); else setError(t(e.key)); } finally { setBusy(null); }
  };
  const fromDeck = async (deckId) => {
    setError(null); setBusy(deckId);
    try { const { id } = await api.importDeck(deckId); onOpen(id); } catch (e) { setError(t(e.key)); } finally { setBusy(null); }
  };
  const remove = async (id) => {
    if (!window.confirm(t('confirmDel'))) return;
    try { await api.remove(id); load(); } catch (e) { setError(t(e.key)); }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-6"><h1 className="text-[17px] font-semibold">{t('title')}</h1></div>
      </header>
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files[0]); }}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${over ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'}`}>
          <p className="text-[15px] font-medium">{busy === 'upload' ? t('uploading') : t('drop')}</p>
          <p className="mt-1 text-[13px] text-slate-500">{t('formats')}</p>
          <button type="button" disabled={busy === 'upload'} onClick={() => input.current.click()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-[14px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{t('upload')}</button>
          <input ref={input} type="file" accept={ACCEPT} hidden onChange={(e) => { upload(e.target.files[0]); e.target.value = ''; }} />
          {error && <p className="mt-3 text-[13px] text-red-600" role="alert">{error}</p>}
        </div>

        <section>
          <h2 className="mb-3 text-[15px] font-semibold">{t('docs')}</h2>
          {!data ? <p className="text-[13px] text-slate-500">{t('loading')}</p> : data.docs.length === 0 ? (
            <p className="rounded-lg bg-white p-4 text-[13px] text-slate-500">{t('empty')}</p>
          ) : (
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
              {data.docs.map((d) => (
                <li key={d.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{d.name}</p>
                    <p className="text-[12px] text-slate-500">{t(`src_${d.source}`)} · {t('edited')}: {date(d.updated)}</p>
                  </div>
                  <button type="button" onClick={() => onOpen(d.id)} className="rounded-md bg-slate-900 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-slate-700">{t('open')}</button>
                  <button type="button" onClick={() => remove(d.id)} className="rounded-md px-2 py-1.5 text-[13px] text-red-600 hover:bg-red-50">{t('del')}</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {data?.decks?.length > 0 && (
          <section>
            <h2 className="mb-3 text-[15px] font-semibold">{t('myDecks')}</h2>
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
              {data.decks.map((d) => (
                <li key={d.id} className="flex items-center gap-4 px-4 py-3">
                  <img src={`/templates/${d.template_id}.jpg`} alt="" className="h-9 w-16 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{d.topic}</p>
                    <p className="text-[12px] text-slate-500">{d.slides} · {date(d.created)}</p>
                  </div>
                  <button type="button" disabled={busy === d.id} onClick={() => fromDeck(d.id)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium hover:bg-slate-50 disabled:opacity-60">
                    {busy === d.id ? t('loading') : t('openInEditor')}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
