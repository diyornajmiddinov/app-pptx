/** Sign-in: Telegram username or id -> a 6-digit code from @slidechibot -> the session cookie. */
import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { Alert, BOT_URL, Button, Card, Field, LangSwitch, Logo, Spinner, inputCls } from '../components/ui.jsx';
import { useI18n } from '../i18n.jsx';

const RESEND_S = 60;
const savedRef = () => { try { return localStorage.getItem('ref'); } catch { return null; } };

export default function Login({ onSignedIn }) {
  const { t } = useI18n();
  const [login, setLogin] = useState('');
  const [step, setStep] = useState(null); // { login_id } once the code is sent
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [left, setLeft] = useState(0);
  const codeRef = useRef(null);

  useEffect(() => {
    if (left <= 0) return undefined;
    const id = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const fail = (e) => setError(t(`e_${e.key || 'server'}`));

  const sendCode = async (e) => {
    e?.preventDefault();
    if (!login.trim() || busy) return;
    setBusy(true); setError('');
    try {
      const r = await api.login(login.trim());
      setStep(r); setCode(''); setLeft(RESEND_S);
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch (err) { fail(err); } finally { setBusy(false); }
  };

  const verify = async (value = code) => {
    if (value.length !== 6 || busy) return;
    setBusy(true); setError('');
    try {
      await api.verify(step.login_id, value, savedRef());
      try { localStorage.removeItem('ref'); } catch { /* storage blocked */ }
      onSignedIn();
    } catch (err) {
      fail(err);
      if (err.key === 'expired') setStep(null);
      setCode('');
    } finally { setBusy(false); }
  };

  const onCode = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
    if (digits.length === 6) verify(digits);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4"><Logo /><LangSwitch /></header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-8 sm:items-center sm:pt-0">
        <Card className="w-full max-w-md">
          {!step ? (
            <form onSubmit={sendCode} className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('loginTitle')}</h1>
                <p className="mt-1.5 text-slate-600 dark:text-slate-400">{t('loginText')}</p>
              </div>
              <Field label={t('loginLabel')}>
                <input className={inputCls} value={login} onChange={(e) => setLogin(e.target.value)} placeholder={t('loginPh')}
                  autoComplete="username" autoCapitalize="none" spellCheck="false" maxLength={64} autoFocus />
              </Field>
              <Alert>{error}</Alert>
              <Button type="submit" className="w-full py-3" disabled={busy || !login.trim()}>{busy && <Spinner />}{t('sendCode')}</Button>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('legalAgree').split(/(\{oferta\}|\{privacy\})/).map((part, i) => (
                  part === '{oferta}' ? <a key={i} href="/oferta" target="_blank" className="underline">{t('oferta')}</a>
                    : part === '{privacy}' ? <a key={i} href="/maxfiylik" target="_blank" className="underline">{t('privacy')}</a> : part))}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t('loginHint')}{' '}
                <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 hover:underline dark:text-brand-400">t.me/slidechibot</a>
              </p>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); verify(); }} className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('codeTitle')}</h1>
                <p className="mt-1.5 text-slate-600 dark:text-slate-400">{t('codeText')}</p>
              </div>
              <Field label={t('codeLabel')}>
                <input ref={codeRef} className={`${inputCls} text-center font-mono text-2xl tracking-[0.5em]`} value={code}
                  onChange={(e) => onCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" placeholder="••••••" maxLength={6} />
              </Field>
              <Alert>{error}</Alert>
              <Button type="submit" className="w-full py-3" disabled={busy || code.length !== 6}>{busy && <Spinner />}{t('verify')}</Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  onClick={() => { setStep(null); setError(''); }}>← {t('back')}</button>
                <button type="button" disabled={left > 0 || busy} onClick={sendCode}
                  className="font-medium text-brand-600 hover:underline disabled:text-slate-400 disabled:no-underline dark:text-brand-400">
                  {left > 0 ? t('resendIn', { s: left }) : t('resend')}
                </button>
              </div>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
}
