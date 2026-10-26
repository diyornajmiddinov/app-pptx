import { useCallback, useEffect, useMemo, useState } from 'react';
import { APP_TOKEN } from '../api/client.js';

/**
 * window.Telegram.WebApp is injected by telegram-web-app.js (see index.html).
 * Note: the SDK also defines this object in a normal browser, but with an
 * EMPTY initData — that is how we detect "running outside Telegram".
 */
const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
// Inside Telegram: signed initData, or opened from the bot's bottom keyboard (no initData, our token in the URL;
// the SDK reports platform 'unknown' only in a plain browser).
const IN_TG = Boolean(tg?.initData) || Boolean(APP_TOKEN && tg?.platform && tg.platform !== 'unknown');

// tg.themeParams key -> CSS variable consumed by tailwind.config.js
const THEME_MAP = {
  bg_color: '--tg-bg',
  secondary_bg_color: '--tg-secondary-bg',
  text_color: '--tg-text',
  hint_color: '--tg-hint',
  link_color: '--tg-link',
  button_color: '--tg-button',
  button_text_color: '--tg-button-text',
  section_separator_color: '--tg-separator',
  destructive_text_color: '--tg-destructive',
};

const toRgb = (c) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(c).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
const luminance = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/**
 * Many Telegram themes (most dark ones, desktop) send secondary_bg_color equal or
 * almost equal to bg_color, so inputs and controls melt into the page. Derive a
 * slightly different surface from bg + text in that case.
 */
function ensureContrast(root) {
  const css = getComputedStyle(root);
  const bg = toRgb(css.getPropertyValue('--tg-bg'));
  const text = toRgb(css.getPropertyValue('--tg-text'));
  const sec = toRgb(css.getPropertyValue('--tg-secondary-bg'));
  if (!bg || !text) return;
  const dark = luminance(bg) < 0.5;
  if (!sec || Math.abs(luminance(bg) - luminance(sec)) < 0.025) {
    root.style.setProperty('--tg-secondary-bg', mix(bg, text, dark ? 0.06 : 0.035));
  }
}

/** Copy Telegram's theme colours into the CSS variables Tailwind reads. */
function applyTheme(themeParams = {}) {
  const root = document.documentElement;
  root.style.removeProperty('--tg-secondary-bg'); // re-read the theme's own value on themeChanged
  for (const [key, cssVar] of Object.entries(THEME_MAP)) {
    // Only override when Telegram actually sent the colour; otherwise the
    // fallbacks in index.css stay in effect.
    if (themeParams[key]) root.style.setProperty(cssVar, themeParams[key]);
  }
  ensureContrast(root);
  if (tg?.colorScheme) root.style.colorScheme = tg.colorScheme;
}

// Guard so ready()/expand() run exactly once, even under React StrictMode
// (which mounts effects twice in development).
let initialized = false;

export function useTelegram() {
  const [colorScheme, setColorScheme] = useState(tg?.colorScheme ?? 'light');

  useEffect(() => {
    if (!tg) return;

    if (!initialized) {
      initialized = true;
      // ready(): tells Telegram the app has rendered and hides its loading
      // placeholder. Call it as early as possible.
      tg.ready();
      // expand(): opens the Mini App at full height instead of a half sheet.
      tg.expand();
      // Bot API 7.7+: stop a downward swipe from closing the app while the
      // user scrolls the template grid.
      if (tg.isVersionAtLeast('7.7')) tg.disableVerticalSwipes();
    }

    const syncTheme = () => {
      applyTheme(tg.themeParams);
      setColorScheme(tg.colorScheme);
      // Bot API 6.1+: paint Telegram's own header/background to match ours
      // so there is no visible seam at the top of the sheet.
      if (tg.isVersionAtLeast('6.1')) {
        tg.setHeaderColor('bg_color');
        tg.setBackgroundColor('bg_color');
      }
    };

    syncTheme();
    // Fires when the user switches Telegram between day/night mode while
    // the Mini App is open.
    tg.onEvent('themeChanged', syncTheme);
    return () => tg.offEvent('themeChanged', syncTheme);
  }, []);

  /** Native alert inside Telegram (6.2+), window.alert in a browser. */
  const showAlert = useCallback((message) => {
    if (IN_TG && tg.isVersionAtLeast('6.2')) tg.showAlert(message);
    else window.alert(message);
  }, []);

  /** Yes / no question: native popup inside Telegram (6.2+), window.confirm in a browser. Resolves to true / false. */
  const askConfirm = useCallback((message) => new Promise((resolve) => {
    if (IN_TG && tg.isVersionAtLeast('6.2')) tg.showConfirm(message, (ok) => resolve(Boolean(ok)));
    else resolve(window.confirm(message));
  }), []);

  /** Light haptic tick on selection (no-op outside Telegram / old clients). */
  const hapticSelect = useCallback(() => {
    if (IN_TG && tg.isVersionAtLeast('6.1')) tg.HapticFeedback.selectionChanged();
  }, []);

  /** 'success' | 'error' | 'warning' notification haptic. */
  const hapticNotify = useCallback((type) => {
    if (IN_TG && tg.isVersionAtLeast('6.1')) tg.HapticFeedback.notificationOccurred(type);
  }, []);

  return useMemo(
    () => ({
      tg,
      // initDataUnsafe is NOT verified: fine for display (name, avatar),
      // never trust it on the server. Send `initData` for that instead.
      // opened from the bottom keyboard: Telegram gives no user, the signed token (<id>.<exp>.<sig>) names them
      user: tg?.initDataUnsafe?.user || (APP_TOKEN ? { id: Number(APP_TOKEN.split('.')[0]) } : undefined),
      // Raw signed query string. The backend validates its HMAC with the
      // bot token to prove the request really came from this Telegram user.
      initData: tg?.initData ?? '',
      isTelegram: IN_TG,
      colorScheme,
      showAlert,
      askConfirm,
      hapticSelect,
      hapticNotify,
    }),
    [colorScheme, showAlert, askConfirm, hapticSelect, hapticNotify],
  );
}
