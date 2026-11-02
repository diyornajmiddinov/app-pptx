/** 82 Kasseta — audio cassettes: J-card inserts with retro stripes, tape reels as markers, a big cassette cover. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '2B2D42', ink: 'F7F3E9', muted: 'C9C3B6', accent: 'FF8C42', card: 'FFF6E5', dark: '1C1D2B', pal: ['FF8C42', 'FFD166', '06D6A0', '118AB2', 'EF476F', 'B388EB'] };
const reel = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="96" fill="#2F2F3A" stroke="#555" stroke-width="4"/><circle cx="100" cy="100" r="62" fill="#${c}"/>${[0, 60, 120, 180, 240, 300].map((a) => `<rect x="94" y="46" width="12" height="20" fill="#FFF6E5" transform="rotate(${a} 100 100)"/>`).join('')}<circle cx="100" cy="100" r="30" fill="#FFF6E5"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Kasseta', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'markers', timeline: 'columns' },
  bg: (ctx, s) => { s.background = { color: C.bg }; },
  // J-card: cream insert with two retro stripes at the top
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, C.card, { r: 0.05, shadow: 0.35, blur: 6, offset: 3, name: 'J-card' }); if (!o.big) { t.rect(s, x, y + 0.12, w, 0.09, C.pal[k % 6], { name: 'Stripe' }); t.rect(s, x, y + 0.24, w, 0.06, C.pal[(k + 1) % 6], { name: 'Stripe' }); } },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'r' + (k % 6), reel(C.pal[k % 6]), 200, 200), x, y, d, d); if (label !== '') ctx.t.text(s, String(label), { x: x + d * 0.35, y: y + d * 0.35, w: d * 0.3, h: d * 0.3, fontSize: Math.max(8, Math.round(d * 13)), bold: true, color: C.dark, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, C.card, { r: 0.05, name: 'Cover' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '8D6E5A', 3),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.45, 0.33, 0.75, ctx.idx, ''); t.text(s, `${ctx.idx % 2 ? 'A' : 'B'}${ctx.idx}`, { x: 1.3, y: 0.35, w: 0.7, h: 0.72, fontFace: 'Courier New', fontSize: 16, bold: true, color: C.accent, valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 2.0, y: 0.35, w: 7.45, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.45, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => '2B2D42', subPanel: () => '5A5560', markerText: () => C.dark, authorColor: 'B4462A', compareHead: (i) => (i ? '118AB2' : 'B4462A'),
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.rect(s, 0.5, 0.55, 9.0, 4.4, C.dark, { r: 0.2, shadow: 0.4, blur: 10, offset: 4, name: 'Cassette' });
    t.rect(s, 0.85, 0.8, 8.3, 2.6, C.card, { r: 0.08, name: 'Label' });
    ['FF8C42', 'FFD166', '06D6A0', '118AB2'].forEach((c, k) => t.rect(s, 0.85, 0.95 + k * 0.1, 8.3, 0.07, c, { name: 'Stripe' }));
    t.text(s, d.title, { x: 1.1, y: 1.35, w: d.image ? 5.3 : 7.8, h: 1.45, bold: true, fontSize: L.fit(d.title, d.image ? 5.3 : 7.8, 1.4, 34, 16, 'Arial', true), color: '2B2D42', valign: 'middle' });
    t.text(s, `${M.author || ''}   \u2022   ${[M.org, M.loc, M.year].filter(Boolean).join(', ')}`, { x: 1.1, y: 2.85, w: d.image ? 5.3 : 7.8, h: 0.4, fontSize: 12, bold: true, color: 'B4462A' });
    if (d.image) t.img(s, await L.photo(L.src(d.image), 2.4, 2.25), 6.55, 1.05, 2.4, 2.25, { alt: '' });
    t.rect(s, 2.6, 3.55, 4.8, 1.15, '3A3B4F', { r: 0.5, name: 'Window' });
    await K.marker(ctx, s, 2.85, 3.6, 1.05, 0, ''); await K.marker(ctx, s, 6.1, 3.6, 1.05, 3, '');
    if (d.subtitle) t.text(s, d.subtitle, { x: 3.95, y: 3.6, w: 2.1, h: 1.05, fontSize: 9, color: C.muted, align: 'center', valign: 'middle' });
    metaFooter({ color: C.muted, y: 5.15 })(ctx, s);
  },
};
module.exports = { id: 82, slug: 'kasseta', name: 'Kasseta', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "nostalgik va samimiy: hikoya kabi oqim, A va B tomonlari kabi aniq bo'limlar", limits: {}, prefer: null } };
