import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The website slidechi.uz. Nginx serves dist/ at /, the editor (miniapp/dist/editor.html + /assets/) next to it and
// the template thumbnails from miniapp/public/templates, so the site's own files live under /static/.
export default defineConfig({
  plugins: [react()],
  build: { assetsDir: 'static' },
  server: {
    fs: { allow: ['..'] }, // the template list is shared with the Mini App (../miniapp/src/data)
    proxy: { '/api': 'http://localhost:8000' }, // thumbnails: `npm run dev` copies them into public/templates
  },
});
