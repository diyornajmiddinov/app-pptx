/** 78 Javon — bookshelf: wooden shelves, book spines as markers and cards, bookends, a reading lamp glow. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F4EEE4', ink: '2D241C', muted: '6B5B4C', accent: '8E3B2E', wood: '8B5E3C', pal: ['8E3B2E', '2F5D62', 'C08A3E', '4B4E6D', '6A7F3E', 'A4566B'] };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Javon', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'table' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.45 },
  bg: (ctx, s, kind) => { s.background = { color: C.bg }; ctx.t.rect(s, 0, 4.95, 10, 0.18, C.wood, { name: 'Shelf' }); ctx.t.rect(s, 0, 5.13, 10, 0.06, '6A4429', { name: 'Shelf edge' }); },
  // card = a book standing on the shelf: coloured spine band on the left, cream pages
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, 'FFFBF2', { line: { color: 'D8CBB6', width: 1 }, shadow: 0.15, blur: 5, offset: 2, name: 'Book' }); if (!o.big) { ctx.t.rect(s, x, y, 0.16, h, C.pal[k % 6], { name: 'Spine' }); ctx.t.line(s, x + 0.04, y + 0.25, 0.08, 0, 'E8C77A', 1.5); ctx.t.line(s, x + 0.04, y + h - 0.25, 0.08, 0, 'E8C77A', 1.5); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.rect(s, x + d * 0.18, y, d * 0.64, d, C.pal[k % 6], { r: 0.03, name: 'Spine' }); ctx.t.line(s, x + d * 0.22, y + d * 0.15, d * 0.56, 0, 'E8C77A', 1.25); ctx.t.line(s, x + d * 0.22, y + d * 0.85, d * 0.56, 0, 'E8C77A', 1.25); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 22), bold: true, color: 'FFF6E0', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, 'C08A3E', { name: 'Gilt frame' }); ctx.t.rect(s, x - 0.04, y - 0.04, w + 0.08, h + 0.08, '6A4429', { name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.wood, 2),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.45, 0.3, 0.8, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.35, y: 0.35, w: 8.1, h: 0.72, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: 'F4EEE4', y: 5.3, font: 'Cambria' }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    const books = [[5.6, 1.1, 0.45, 3.85], [6.05, 0.75, 0.55, 4.2], [6.6, 1.3, 0.4, 3.65], [9.0, 0.9, 0.5, 4.05]];
    books.forEach(([x, y, w, h], k) => { t.rect(s, x, y, w, h, C.pal[k % 6], { r: 0.03, name: 'Book' }); t.line(s, x + 0.06, y + 0.3, w - 0.12, 0, 'E8C77A', 1.5); t.line(s, x + 0.06, y + h - 0.3, w - 0.12, 0, 'E8C77A', 1.5); });
    if (d.image) await K.photo(ctx, s, d.image, 7.15, 1.35, 1.7, 2.3);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.6, w: 4.8, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.8, h: 2.3, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 4.8, 2.2, 38, 20, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 4.7, h: 0.75, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.7, h: 0.45, fontFace: 'Cambria', fontSize: 17, bold: true, color: C.ink });
    metaFooter({ color: 'F4EEE4', y: 5.3, font: 'Cambria' })(ctx, s);
  },
};
module.exports = { id: 78, slug: 'javon', name: 'Javon', category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "kutubxonachi kabi: bilimli, tartibli, manbalarga tayangan ravon matn", limits: {}, prefer: 'text' } };
