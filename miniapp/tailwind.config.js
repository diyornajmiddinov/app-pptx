/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Every colour maps to a CSS variable that useTelegram() fills from
      // tg.themeParams, so the whole UI follows the user's Telegram theme
      // (light, dark, or any custom theme) with no `dark:` variants needed.
      colors: {
        tg: {
          bg: 'var(--tg-bg)',
          'secondary-bg': 'var(--tg-secondary-bg)',
          text: 'var(--tg-text)',
          hint: 'var(--tg-hint)',
          link: 'var(--tg-link)',
          button: 'var(--tg-button)',
          'button-text': 'var(--tg-button-text)',
          separator: 'var(--tg-separator)',
          destructive: 'var(--tg-destructive)',
        },
      },
      // Native Apple/Android system fonts: matches Telegram's own UI and
      // costs zero bytes to load inside the webview.
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '70%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        pop: 'pop 220ms cubic-bezier(0.2, 0.9, 0.3, 1.2)',
      },
    },
  },
  plugins: [],
};
