import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './admin.css';
import { ToastProvider } from './ui.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider><App /></ToastProvider>
  </StrictMode>,
);
