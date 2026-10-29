import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { I18nProvider } from './i18n.jsx';
import './index.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
);
// the home and legal pages come prerendered (prerender.js): take over that HTML instead of drawing it again
if (root.hasChildNodes() && !window.location.hash.startsWith('#/')) hydrateRoot(root, app);
else createRoot(root).render(app);
