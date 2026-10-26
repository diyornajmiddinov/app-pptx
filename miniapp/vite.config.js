import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // three pages: the Telegram Mini App, the desktop presentation editor and the admin panel
      input: { main: 'index.html', editor: 'editor.html', admin: 'admin.html' },
    },
  },
  server: {
    host: true, // expose on LAN so you can tunnel it (ngrok / cloudflared) into Telegram
    proxy: {
      // In dev, /api/* is forwarded to your local FastAPI server
      '/api': 'http://localhost:8000',
      // bot webhook goes through the same tunnel, so one HTTPS URL serves both
      '/telegram': 'http://localhost:8000',
    },
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.app'], // temporary HTTPS tunnel domains
  },
});
