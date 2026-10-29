/**
 * After `vite build`: write the home page (uz at /, ru at /ru/, en at /en/) and the legal pages as real HTML, so
 * search engines see the text without running JavaScript. The browser then hydrates the same markup (main.jsx).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(dir, 'dist');
const { render } = await import(pathToFileURL(path.join(dir, 'dist-ssr', 'entry-server.js')).href);
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const SITE = 'https://slidechi.uz';

const META = {
  uz: ["SlideAI — sun'iy intellekt bilan taqdimot yaratish", "Mavzuni yozing — SlideAI bir necha daqiqada tayyor PowerPoint (.pptx) taqdimot tayyorlaydi: matn, rasmlar, 40 ta shablon, o'zbek, rus va ingliz tillarida."],
  ru: ['SlideAI — создание презентаций с искусственным интеллектом', 'Напишите тему — SlideAI за пару минут подготовит готовую презентацию PowerPoint (.pptx): текст, изображения, 40 шаблонов, на узбекском, русском и английском.'],
  en: ['SlideAI — AI presentation maker', 'Type a topic — SlideAI builds a ready PowerPoint (.pptx) presentation in minutes: text, images, 40 templates, in Uzbek, Russian and English.'],
};
const PAGES = [
  { url: '/', page: 'home', lang: 'uz' },
  { url: '/ru/', page: 'home', lang: 'ru' },
  { url: '/en/', page: 'home', lang: 'en' },
  { url: '/oferta', page: 'oferta', lang: 'uz', title: 'Ommaviy oferta — SlideAI', desc: "SlideAI xizmatlaridan foydalanish shartlari: narxlar, to'lov, pulni qaytarish." },
  { url: '/maxfiylik', page: 'privacy', lang: 'uz', title: 'Maxfiylik siyosati — SlideAI', desc: "SlideAI qanday ma'lumotlarni yig'adi va ularni qanday himoya qiladi." },
];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const p of PAGES) {
  const [title, desc] = p.title ? [p.title, p.desc] : META[p.lang];
  const alternates = p.page === 'home'
    ? ['uz', 'ru', 'en'].map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${l === 'uz' ? '/' : `/${l}/`}" />`).join('\n    ')
      + `\n    <link rel="alternate" hreflang="x-default" href="${SITE}/" />` : '';
  const html = template
    .replace('<html lang="uz">', `<html lang="${p.lang}" data-prerendered="${p.lang}">`)
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${SITE}${p.url}" />`)
    .replace('</head>', `  <link rel="canonical" href="${SITE}${p.url}" />\n    ${alternates}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(p.page, p.lang)}</div>`);
  const out = p.url === '/' ? path.join(dist, 'index.html') : path.join(dist, p.url, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log('prerendered', p.url);
}
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${SITE}${p.url}</loc></url>`).join('\n')}
</urlset>
`);
