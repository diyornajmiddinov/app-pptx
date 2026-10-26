import { useEffect, useRef } from 'react';

/**
 * Declarative wrapper around tg.MainButton (the native button pinned to the
 * bottom of the Telegram sheet).
 *
 * Why a ref for onClick: MainButton.onClick() registers a raw callback. If we
 * re-registered it on every render we'd either stack duplicate handlers or
 * capture stale state. Instead we register ONE stable handler that always
 * calls the latest onClick through the ref.
 */
export function useMainButton({ tg, text, active, onClick, hidden = false }) {
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  // Register the click handler once; clean up on unmount.
  useEffect(() => {
    if (!tg) return;
    const handler = () => onClickRef.current?.();
    tg.MainButton.onClick(handler);
    return () => {
      tg.MainButton.offClick(handler);
      tg.MainButton.hide();
    };
  }, [tg]);

  // Always visible so the user knows where to confirm. While the form is
  // incomplete it is dimmed but still clickable: the click explains what is missing.
  useEffect(() => {
    if (!tg) return;
    const p = tg.themeParams || {};
    tg.MainButton.setParams({
      text,
      color: active ? p.button_color || '#2481cc' : p.hint_color || '#999999',
      text_color: active ? p.button_text_color || '#ffffff' : '#ffffff',
      is_visible: !hidden, // the editor tab has its own button
    });
  }, [tg, text, active, hidden]);
}
