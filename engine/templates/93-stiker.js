/** 93 Stiker — sticker sheet: die-cut stickers with thick white borders and drop shadows, star and blob stickers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FFE8D6', ink: '2D1E2F', muted: '6B5468', accent: 'FF5D8F', pal: ['FF5D8F', '5BC0EB', 'FDE74C', '9BC53D', 'C3A6FF', 'FF8C42'] };
const dots = () => { let d = ''; for (let y = 20; y < 900; y += 50) for (let x = 20 + ((y / 50) % 2) * 25; x < 1600; x += 50) d += `<circle cx="${x}" cy="${y}" r="3" fill="#F7CBB0"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/>${d}</svg>`; };
const sticker = (t, s, x, y, w, h, fill, r, rot = 0) => { t.rect(s, x - 0.07, y - 0.07, w + 0.14, h + 0.14, 'FFFFFF', { r: r + 0.07, rotate: rot, shadow: 0.25, blur: 6, offset: 3, name: 'Sticker border' }); t.rect(s, x, y, w, h, fill, { r, rotate: rot, name: 'Sticker' }); };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Stiker', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'row', stats: 'markers', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', dots(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k, o) => sticker(ctx.t, s, x, y, w, h, o.big ? 'FFFFFF' : ['FFFFFF', 'FFF7D6', 'E9F7FF', 'F1FFE6'][k % 4], 0.22, o.big || o.text || o.compare ? 0 : (k % 2 ? 1 : -1)),
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.shape(s, 'STAR_5_POINT', { x: x - d * 0.12, y: y - d * 0.12, w: d * 1.24, h: d * 1.24, fill: { color: 'FFFFFF' }, shadow: { type: 'outer', color: '000000', opacity: 0.2, blur: 4, offset: 2, angle: 90 }, objectName: 'Star border' }); ctx.t.shape(s, 'STAR_5_POINT', { x, y, w: d, h: d, fill: { color: C.pal[k % 6] }, objectName: 'Star' }); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.08, w: d, h: d, fontSize: Math.round(d * 20), bold: true, color: C.ink, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.12, y - 0.12, w + 0.24, h + 0.24, 'FFFFFF', { r: 0.3, shadow: 0.25, blur: 6, offset: 3, name: 'Sticker border' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.12 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'FFFFFF', 4, { dash: 'dash' }),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.45, 0.3, 0.8, ctx.idx, ctx.idx); if (d.title) { const tw = Math.min(8.0, L.width(d.title, 26, 'Arial', true) + 0.6); sticker(t, s, 1.5, 0.4, tw, 0.62, 'FFFFFF', 0.31); t.text(s, d.title, { x: 1.75, y: 0.4, w: tw - 0.4, h: 0.62, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, tw - 0.4, 0.6, 26, 14, 'Arial', true) }); } },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => C.ink, authorColor: C.accent, compareHead: (i) => (i ? '1D8FC5' : C.accent),
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 0.8, 3.0, 3.0);
    K.marker(ctx, s, 8.7, 3.4, 1.0, 2, ''); K.marker(ctx, s, 5.6, 0.4, 0.75, 0, '');
    sticker(t, s, 0.6, 0.75, 5.0, 2.6, C.pal[0], 0.35, -1.5);
    t.text(s, d.title, { x: 0.85, y: 0.9, w: 4.5, h: 2.3, bold: true, fontSize: L.fit(d.title, 4.5, 2.2, 38, 18, 'Arial', true), color: 'FFFFFF', valign: 'middle' });
    sticker(t, s, 0.8, 3.65, 4.0, 0.55, 'FFFFFF', 0.27, 1);
    t.text(s, M.author || '', { x: 0.95, y: 3.65, w: 3.7, h: 0.55, fontSize: 15, bold: true, color: C.ink, valign: 'middle' });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.85, y: 4.35, w: 4.8, h: 0.3, fontSize: 12, bold: true, color: C.muted });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 4.65, w: 4.8, h: 0.5, fontSize: 11, color: C.muted });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 93, slug: 'stiker', name: 'Stiker', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "quvnoq va do'stona: yosh auditoriyaga mos, sodda va esda qoladigan", limits: {}, prefer: 'visual' } };
