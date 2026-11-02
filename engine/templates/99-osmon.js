/** 99 Osmon — sky: day-sky gradient, soft clouds, cloud-topped cards, sun markers, a horizon line. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'D6ECFA', ink: '17324D', muted: '4A6A86', accent: 'F59E0B', pal: ['F59E0B', '3B82F6', '10B981', 'EF4444', '8B5CF6', '06B6D4'] };
const sky = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC3F2"/><stop offset="1" stop-color="#E8F5FE"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="6"/></filter></defs><rect width="1600" height="900" fill="url(#g)"/><g fill="#fff" opacity="0.85" filter="url(#b)">
  <g transform="translate(120 110)"><circle cx="60" cy="40" r="40"/><circle cx="110" cy="30" r="50"/><circle cx="170" cy="45" r="38"/><rect x="40" y="40" width="160" height="40" rx="20"/></g>
  <g transform="translate(1180 70) scale(1.3)"><circle cx="60" cy="40" r="40"/><circle cx="110" cy="30" r="50"/><circle cx="170" cy="45" r="38"/><rect x="40" y="40" width="160" height="40" rx="20"/></g>
  <g transform="translate(700 760) scale(1.6)"><circle cx="60" cy="40" r="40"/><circle cx="110" cy="30" r="50"/><circle cx="170" cy="45" r="38"/><rect x="40" y="40" width="160" height="40" rx="20"/></g></g></svg>`;
const cloudTop = (w) => { const n = Math.max(3, Math.round(w / 70)); let c = ''; for (let k = 0; k < n; k++) c += `<circle cx="${(k + 0.5) * w / n}" cy="${30 + (k % 2) * 6}" r="${w / n * 0.62}" fill="#fff"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="60">${c}</svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Osmon', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'markers', timeline: 'line' },
  area: { x: 0.6, y: 1.5, w: 8.8, h: 3.45 },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'sky', sky(), 1600, 900, true) }; },
  panel: async (ctx, s, x, y, w, h, k, o) => { const W2 = Math.round(w * 100); ctx.t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.2, t: 8, shadow: 0.12, blur: 10, offset: 3, shadowColor: '3B82F6', name: 'Cloud card' }); if (!o.big && !o.compare) ctx.t.img(s, await svgOnce(ctx, 'ct' + W2, cloudTop(W2), W2, 60), x, y - 0.3, w, 0.6); },
  marker: (ctx, s, x, y, d, k, label) => { if (k % 6 === 0) { for (let r = 0; r < 8; r++) { const a = r * Math.PI / 4, cx = x + d / 2, cy = y + d / 2; ctx.t.line(s, cx + Math.cos(a) * d * 0.55 - (Math.cos(a) < 0 ? 0 : 0), cy + Math.sin(a) * d * 0.55, Math.cos(a) * d * 0.12 || 0.001, Math.sin(a) * d * 0.12 || 0.001, C.accent, 2); } } ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: 'FFFFFF', width: 2 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, 'FFFFFF', { r: 0.25, shadow: 0.15, blur: 10, offset: 3, name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.12 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'FFFFFF', 3, { dash: 'dash' }),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, 'FFFFFF', 3),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.55, 0.42, 0.62, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.45, y: 0.38, w: 8.0, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'FFFFFF', authorColor: C.pal[1],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.oval(s, 7.9, 0.25, 1.5, 1.5, 'FDE68A'); t.oval(s, 8.05, 0.4, 1.2, 1.2, 'F59E0B');
    if (d.image) await K.photo(ctx, s, d.image, 5.9, 1.4, 3.4, 2.9);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.7, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: '1E5FA8' });
    t.text(s, d.title, { x: 0.6, y: 1.05, w: 5.0, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.0, 2.1, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 4.9, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.25, w: 4.9, h: 0.45, fontSize: 16, bold: true, color: '1E5FA8' });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 99, slug: 'osmon', name: 'Osmon', category: 'minimalist', photos: true, build: (c, o) => run(c, o, K), style: { tone: "yengil va ochiq: keng ufq, umid va imkoniyat; sodda, tiniq tushuntirish", limits: {}, prefer: null } };
