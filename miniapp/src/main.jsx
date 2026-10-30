import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import PaperApp from './PaperApp.jsx';
import { I18nProvider } from './i18n/index.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      {new URLSearchParams(window.location.search).get('mode') === 'paper' ? <PaperApp /> : <App />}
    </I18nProvider>
  </React.StrictMode>,
);
