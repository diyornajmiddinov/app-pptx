/** 89 Graffiti — street art: concrete wall, paste-up posters, paint splats as markers, dripping paint underline. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '8C8C88', ink: '1A1A1A', muted: '3E3E3E', accent: 'FF2E63', poster: 'F5F2EA', pal: ['FF2E63', '08D9D6', 'FFD32D', '7CFF4F', 'A259FF', 'FF8A00'] };
const wall = () => { let d = '', x0 = 11; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < 1800; i++) d += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="${(0.8 + rnd() * 2.2).toFixed(1)}" fill="#${rnd() > 0.5 ? '6E6E6A' : 'A6A6A0'}" opacity="0.6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/>${d}<g stroke="#6E6E6A" stroke-width="3" opacity="0.5"><line x1="0" y1="300" x2="1600" y2="300"/><line x1="0" y1="600" x2="1600" y2="600"/><line x1="530" y1="0" x2="530" y2="900"/><line x1="1070" y1="0" x2="1070" y2="900"/></g></svg>`; };
const splat = (c, seed) => { let x0 = seed, p = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); const pts = []; for (let k = 0; k < 16; k++) { const a = (k / 16) * 2 * Math.PI, r = 70 + rnd() * 28; pts.push(`${(100 + r * Math.cos(a)).toFixed(0)},${(100 + r * Math.sin(a)).toFixed(0)}`); }
  for (let k = 0; k < 6; k++) { const a = rnd() * 2 * Math.PI, r = 92 + rnd() * 8; p += `<circle cx="${(100 + r * Math.cos(a)).toFixed(0)}" cy="${(100 + r * Math.sin(a)).toFixed(0)}" r="${(4 + rnd() * 6).toFixed(0)}" fill="#${c}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><polygon points="${pts.join(' ')}" fill="#${c}"/>${p}</svg>`; };
const drip = (w, c) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="80"><rect x="0" y="0" width="${w}" height="16" rx="8" fill="#${c}"/>${Array.from({ length: Math.floor(w / 60) }, (_, k) => `<rect x="${20 + k * 60 + (k % 3) * 9}" y="8" width="9" height="${20 + (k * 37) % 50}" rx="4.5" fill="#${c}"/>`).join('')}</svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, caps: true, theme: theme('Graffiti', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'markers', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'wall', wall(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, C.poster, { rotate: o.big ? 0 : (k % 2 ? 0.8 : -0.8), shadow: 0.35, blur: 4, offset: 2, name: 'Poster' }); ctx.t.rect(s, x - 0.05, y - 0.05, 0.6, 0.18, 'FFFFFF', { t: 35, rotate: -20, name: 'Paste' }); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'sp' + (k % 6), splat(C.pal[k % 6], 7 + k), 200, 200), x - d * 0.1, y - d * 0.1, d * 1.2, d * 1.2); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 26), bold: true, color: C.ink, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, C.poster, { rotate: -1, shadow: 0.35, blur: 4, offset: 2, name: 'Poster' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.45, 0.3, 0.72, ctx.idx, ctx.idx); if (d.title) { const T = d.title.toUpperCase(), fs = L.fit(T, 8.0, 0.65, 28, 15, 'Arial', true); t.text(s, T, { x: 1.4, y: 0.32, w: 8.05, h: 0.68, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: fs }); t.img(s, await svgOnce(ctx, 'drip' + (ctx.idx % 6), drip(600, C.pal[ctx.idx % 6]), 600, 80), 1.4, 1.0, Math.min(6, L.width(T, fs, 'Arial', true)), 0.35); } },
  footer: metaFooter({ color: 'FFFFFF', size: 8 }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => C.ink, authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.3, 0.8, 3.0, 3.4);
    await K.marker(ctx, s, 5.4, 3.6, 1.3, 2, ''); await K.marker(ctx, s, 8.6, 0.25, 1.0, 0, '');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(' // ').toUpperCase(), { x: 0.6, y: 0.65, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: C.pal[2] });
    const T = d.title.toUpperCase();
    t.text(s, T, { x: 0.6, y: 1.0, w: 5.4, h: 2.3, bold: true, fontSize: L.fit(T, 5.4, 2.2, 42, 20, 'Arial', true), color: 'FFFFFF', valign: 'bottom' });
    t.img(s, await svgOnce(ctx, 'dripH', drip(600, C.accent), 600, 80), 0.6, 3.35, 4.2, 0.55);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.95, w: 5.0, h: 0.5, fontSize: 12, color: 'F0F0F0' });
    t.text(s, `${M.author || ''}`.toUpperCase(), { x: 0.6, y: 4.45, w: 5.0, h: 0.45, fontSize: 16, bold: true, color: C.pal[1] });
    metaFooter({ color: 'FFFFFF', size: 8 })(ctx, s);
  },
};
module.exports = { id: 89, slug: 'graffiti', name: 'Graffiti', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "ko'cha ovozi: dadil, qisqa, shiorlarga yaqin; lekin hurmatli va faktlarga tayangan", limits: { title: 40, card_h: 18, step_h: 18 }, prefer: 'visual' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "playful"], "transitions": ["strips:lu", "push:r", "p14:flash"], "cover": ["sweepIn", "popOver"], "mark": "popOver", "deco": "strips", "sig": {"title": "sweepIn", "body": "fadeUp", "item": "strips", "image": "strips", "number": "popOver", "order": "diagonal", "stagger": 0.1}, "tempo": 0.85, "kenburns": false};
