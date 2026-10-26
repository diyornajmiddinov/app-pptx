/**
 * "Muharrir" tab. The editor itself is a desktop page (editor.html) opened in the computer's browser with a
 * signed link; on phones / tablets this tab only explains that.
 */
import { useState } from 'react';
import { getEditorLink } from '../api/client.js';
import { useI18n } from '../i18n/index.jsx';

const MOBILE = ['android', 'android_x', 'ios'];

export default function EditorPanel({ tg, initData, isTelegram }) {
  const { t } = useI18n();
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState(null);
  const mobile = MOBILE.includes(tg?.platform)
    || (window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches);

  const open = async () => {
    setOpening(true); setError(null);
    try {
      const { url } = await getEditorLink({ initData });
      if (isTelegram) tg.openLink(url); else window.open(url, '_blank', 'noopener');
    } catch (e) {
      setError(t(e.key || 'eServer', { status: e.status }));
    } finally { setOpening(false); }
  };

  return (
    <section className="space-y-3 pb-6" aria-label={t('edTitle')}>
      <h2 className="text-[17px] font-semibold">{t('edTitle')}</h2>
      <p className="text-[14px] text-tg-hint">{t('edText')}</p>
      {mobile ? (
        <p className="rounded-[10px] bg-tg-secondary-bg p-3 text-[14px]">{t('edMobile')}</p>
      ) : (
        <>
          <button type="button" onClick={open} disabled={opening}
            className="h-11 w-full rounded-[10px] bg-tg-button text-[15px] font-semibold text-tg-button-text disabled:opacity-60">
            {opening ? t('edOpening') : t('edOpen')}
          </button>
          <p className="text-[12px] text-tg-hint">{t('edFile')}</p>
        </>
      )}
      {error && <p className="text-[13px] text-tg-destructive" role="alert">{error}</p>}
    </section>
  );
}
