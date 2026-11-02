/** 98 Karta — card table: green felt, playing cards with corner indices and suits, poker-chip markers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '1D5E3A', ink: '1E1E1E', muted: '4E4E4E', accent: 'C62828', pal: ['C62828', '1565C0', 'F9A825', '2E7D32', '6A1B9A', '212121'] };
const SUITS = ['\u2660', '\u2665', '\u2666', '\u2663'];
const felt = () => { let d = '', x0 = 5; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < 2200; i++) d += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="1.4" fill="#${rnd() > 0.5 ? '2A7A4D' : '164D2F'}" opacity="0.6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.5" cy="0.5" r="0.75"><stop offset="0" stop-color="#22704A"/><stop offset="1" stop-color="#123F27"/></radialGradient></defs><rect width="1600" height="900" fill="url(#g)"/>${d}</svg>`; };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Karta', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'felt', felt(), 1600, 900, true) }; },
  // playing card: white, rounded, rank + suit in the top-left and bottom-right corners
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.12, shadow: 0.4, blur: 6, offset: 3, name: 'Card' }); if (!o.big && !o.compare && !o.text) { const red = k % 2 === 1, su = SUITS[k % 4]; t.text(s, su, { x: x + w - 0.42, y: y + 0.06, w: 0.36, h: 0.36, fontSize: 18, color: red ? C.accent : C.ink, align: 'center', noFit: true }); t.text(s, su, { x: x + w - 0.42, y: y + h - 0.42, w: 0.36, h: 0.36, fontSize: 18, color: red ? C.accent : C.ink, align: 'center', noFit: true }); } },
  marker: (ctx, s, x, y, d, k, label) => { const c = C.pal[k % 6]; ctx.t.oval(s, x, y, d, d, c, { line: { color: 'FFFFFF', width: 2.5, dashType: 'dash' } }); ctx.t.oval(s, x + d * 0.18, y + d * 0.18, d * 0.64, d * 0.64, 'FFFFFF', { line: { color: c, width: 1 } }); if (label !== '') ctx.t.text(s, String(label), { x: x + d * 0.18, y: y + d * 0.18, w: d * 0.64, h: d * 0.64, fontFace: 'Cambria', fontSize: Math.max(8, Math.round(d * 18)), bold: true, color: c, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.15, y - 0.15, w + 0.3, h + 0.3, 'FFFFFF', { r: 0.12, shadow: 0.4, blur: 6, offset: 3, name: 'Card' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.05 } }), x, y, w, h, { alt: '' }); },
  bullet: (ctx, s, x, y, k) => ctx.t.text(s, SUITS[k ? 1 : 0], { x: x - 0.03, y: y - 0.1, w: 0.3, h: 0.3, fontSize: 14, color: k ? C.accent : C.ink }),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.35, 0.72, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.45, y: 0.35, w: 8.0, h: 0.72, fontFace: 'Cambria', bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: 'BFD8C8' }),
  onBg: 'FFFFFF', onBgMuted: 'CFE3D6', onPanel: () => C.ink, subPanel: () => C.muted, authorColor: 'F9A825', valueColor: (i) => (i % 2 ? C.accent : C.ink), compareHead: (i) => (i ? C.accent : C.ink),
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    [[6.3, 1.0, -8], [6.9, 0.85, 4]].forEach(([x, y, r], k) => { t.rect(s, x, y, 2.4, 3.4, 'FFFFFF', { r: 0.14, rotate: r, shadow: 0.45, blur: 6, offset: 3, name: 'Card' }); t.text(s, `A${SUITS[k + 1]}`, { x: x + 0.15, y: y + 0.12, w: 0.8, h: 0.5, fontFace: 'Cambria', fontSize: 20, bold: true, color: k ? C.accent : C.ink, noFit: true }); });
    if (d.image) t.img(s, await L.photo(L.src(d.image), 2.0, 2.4, { mask: { r: 0.06 } }), 7.1, 1.4, 2.0, 2.4, { alt: '' });
    K.marker(ctx, s, 5.7, 3.9, 0.8, 0, ''); K.marker(ctx, s, 6.3, 4.2, 0.8, 1, ''); K.marker(ctx, s, 9.0, 4.1, 0.7, 2, '');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2666  '), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: 'F9A825' });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.0, h: 2.2, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.0, 2.1, 38, 18, 'Cambria', true), color: 'FFFFFF', valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 4.9, h: 0.75, fontSize: 13, color: 'BFD8C8' });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.9, h: 0.45, fontFace: 'Cambria', fontSize: 16, bold: true, color: 'F9A825' });
    metaFooter({ color: 'BFD8C8' })(ctx, s);
  },
};
module.exports = { id: 98, slug: 'karta', name: 'Karta', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "strategiya va imkoniyat tili: tanlov, xavf va yutuq; ishonchli va qiziqarli", limits: {}, prefer: null } };
