/** 92 Kanban — task board: swimlane columns, task cards with coloured tag chips and avatar dots, progress tags. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EEF1F6', ink: '172B4D', muted: '5E6C84', accent: '0052CC', lane: 'E2E7EF', pal: ['0052CC', '36B37E', 'FF991F', '6554C0', 'FF5630', '00B8D9'] };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Kanban', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  bg: (ctx, s) => { s.background = { color: C.bg }; for (let k = 0; k < 4; k++) ctx.t.rect(s, 0.45 + k * 2.32, 1.25, 2.2, 3.95, C.lane, { r: 0.08, name: 'Lane' }); },
  // task card: white card, coloured tag chip, avatar dot bottom-right
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.08, shadow: 0.18, blur: 4, offset: 1, name: 'Task card' }); if (!o.big) { t.rect(s, x + w - 0.75, y + 0.12, 0.55, 0.14, C.pal[k % 6], { r: 0.07, name: 'Tag' }); t.oval(s, x + w - 0.42, y + h - 0.42, 0.28, 0.28, C.pal[(k + 2) % 6]); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.rect(s, x, y + d * 0.15, d, d * 0.7, C.pal[k % 6], { r: d * 0.2, name: 'Label' }); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.15, w: d, h: d * 0.7, fontSize: Math.round(d * 20), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, 'FFFFFF', { r: 0.1, shadow: 0.18, blur: 4, offset: 1, name: 'Card' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.06 } }), x, y, w, h, { alt: '' }); },
  bullet: (ctx, s, x, y, k) => ctx.t.rect(s, x, y + 0.01, 0.16, 0.16, null, { r: 0.03, line: { color: C.pal[k ? 1 : 4], width: 1.5 }, name: 'Checkbox' }),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.45, 0.35, 0.8, ctx.idx, `#${ctx.idx}`); if (d.title) t.text(s, d.title, { x: 1.45, y: 0.35, w: 8.0, h: 0.62, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.62, 26, 15, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted, y: 5.3 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, valueColor: (i) => C.pal[i % 6], compareHead: (i) => C.pal[i ? 1 : 4],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    await K.panel(ctx, s, 0.6, 1.4, 4.4, 2.6, 0, {});
    t.text(s, d.title, { x: 0.8, y: 1.55, w: 3.7, h: 1.6, bold: true, fontSize: L.fit(d.title, 3.7, 1.55, 30, 15, 'Arial', true), color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.8, y: 3.15, w: 3.7, h: 0.6, fontSize: 11, color: C.muted });
    await K.panel(ctx, s, 0.6, 4.15, 4.4, 0.85, 1, { big: true });
    t.text(s, `${M.author || ''}  \u2022  ${[M.org, M.loc, M.year].filter(Boolean).join(', ')}`, { x: 0.8, y: 4.15, w: 4.0, h: 0.85, fontSize: 12, bold: true, color: C.accent, valign: 'middle' });
    if (d.image) await K.photo(ctx, s, d.image, 5.45, 1.5, 4.0, 2.4);
    for (let k = 0; k < 3; k++) await K.panel(ctx, s, 5.37 + k * 1.4, 4.15, 1.25, 0.85, k + 2, {});
    metaFooter({ color: C.muted, y: 5.3 })(ctx, s);
  },
};
module.exports = { id: 92, slug: 'kanban', name: 'Kanban', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "loyiha boshqaruvi tili: vazifa, holat, mas'uliyat va muddat; qisqa va amaliy", limits: {}, prefer: 'data' } };
