/** Images -> one PDF (an A4 page per image), built on the server and downloaded at once. Free. */
import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { Alert, Button, Card, Field, Spinner, inputCls } from '../components/ui.jsx';
import { useI18n } from '../i18n.jsx';

const MAX = 50;

export default function Pdf() {
  const { t } = useI18n();
  const [items, setItems] = useState([]); // { id, file, url }
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const latest = useRef(items);
  latest.current = items;

  useEffect(() => () => latest.current.forEach((x) => URL.revokeObjectURL(x.url)), []);

  const add = (files) => {
    setError(''); setInfo('');
    const imgs = [...files].filter((f) => f.type.startsWith('image/'));
    setItems((cur) => [...cur, ...imgs.map((file) => ({ id: `${file.name}-${file.size}-${Math.random()}`, file, url: URL.createObjectURL(file) }))].slice(0, MAX));
    if (inputRef.current) inputRef.current.value = '';
  };
  const remove = (id) => setItems((cur) => { const x = cur.find((i) => i.id === id); if (x) URL.revokeObjectURL(x.url); return cur.filter((i) => i.id !== id); });
  const move = (i, d) => setItems((cur) => { const n = [...cur]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });

  const make = async () => {
    setBusy(true); setError(''); setInfo('');
    try {
      const skipped = await api.pdf(items.map((x) => x.file), name.trim());
      if (skipped) setInfo(t('pdfSkipped', { n: skipped }));
    } catch (e) { setError(t(`e_${e.key}`)); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('pdfTitle')}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{t('pdfText')}</p>
      </div>
      <Card className="space-y-5">
        <button type="button" onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${drag
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-300 hover:border-brand-400 dark:border-slate-700'}`}>
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-brand-500" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
          <span className="font-semibold text-slate-900 dark:text-white">{t('pickImages')}</span>
          <span className="text-sm text-slate-500">{items.length} / {MAX}</span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => add(e.target.files)} />

        {items.length > 0 && (
          <ol className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
            {items.map((x, i) => (
              <li key={x.id} className="group relative overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <img src={x.url} alt="" className="aspect-[3/4] w-full object-cover" />
                <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 text-xs font-semibold text-white">{i + 1}</span>
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 p-1 text-white">
                  <button type="button" aria-label={t('moveUp')} disabled={i === 0} onClick={() => move(i, -1)} className="rounded px-1.5 disabled:opacity-30">‹</button>
                  <button type="button" aria-label={t('remove')} onClick={() => remove(x.id)} className="rounded px-1.5">✕</button>
                  <button type="button" aria-label={t('moveDown')} disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded px-1.5 disabled:opacity-30">›</button>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <Field label={t('pdfName')}><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('pdfNamePh')} maxLength={60} /></Field>
          <Button className="py-3" disabled={!items.length || busy} onClick={make}>{busy && <Spinner />}{busy ? t('makingPdf') : t('makePdf')}</Button>
        </div>
        <Alert>{error}</Alert>
        <Alert kind="ok">{info}</Alert>
      </Card>
    </div>
  );
}
