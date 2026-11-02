/** 73 Muz — ice: frost crystals, frosted glass panels, hexagonal ice markers, cold blues. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EAF6FC', ink: '12324A', muted: '4F7590', accent: '2E86C1', pal: ['2E86C1', '5DADE2', '1B4F72', '85C1E9', '2874A6', 'AED6F1'] };
const flake = (op = 0.5) => { let g = ''; for (let k = 0; k < 6; k++) g += `<g transform="rotate(${k * 60} 100 100)"><line x1="100" y1="100" x2="100" y2="10"/><line x1="100" y1="40" x2="80" y2="22"/><line x1="100" y1="40" x2="120" y2="22"/><line x1="100" y1="65" x2="85" y2="52"/><line x1="100" y1="65" x2="115" y2="52"/></g>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><g stroke="#5DADE2" stroke-width="5" stroke-linecap="round" opacity="${op}">${g}</g></svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Muz', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'markers', timeline: 'columns' },
  init: async (ctx) => { ctx.flake = await svgOnce(ctx, 'flake', flake(0.45), 200, 200); },
  bg: async (ctx, s, kind) => { s.background = { color: kind === 'page' ? C.bg : 'DDF0FA' }; ctx.t.img(s, ctx.flake, 8.6, -0.35, 1.7, 1.7); ctx.t.img(s, ctx.flake, -0.4, 4.4, 1.3, 1.3); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, 'FFFFFF', { t: 20, r: 0.12, line: { color: '9ED8F0', width: 1.5 }, shadow: 0.12, blur: 8, offset: 2, shadowColor: '5DADE2', name: 'Frosted glass' }); if (!o.big) ctx.t.rect(s, x + 0.12, y + 0.08, w * 0.35, 0.05, 'FFFFFF', { name: 'Glint' }); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.shape(s, 'HEXAGON', { x, y, w: d, h: d * 0.88, fill: { color: C.pal[k % 6] }, line: { color: 'FFFFFF', width: 1.5 }, objectName: 'Ice' }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d * 0.88, fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, 'FFFFFF', { r: 0.14, line: { color: '9ED8F0', width: 2 }, name: 'Frost frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.06 } }), x, y, w, h, { alt: '' }); ctx.t.img(s, ctx.flake, x + w - 0.55, y - 0.3, 0.8, 0.8); },
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.38, 0.72, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 7.2, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.2, 0.7, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'FFFFFF', authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.img(s, ctx.flake, 5.2, 0.1, 5.2, 5.2);
    if (d.image) { t.shape(s, 'HEXAGON', { x: 6.2, y: 1.0, w: 3.3, h: 2.9, fill: { color: 'FFFFFF' }, line: { color: '9ED8F0', width: 2 }, objectName: 'Frame' }); t.img(s, await L.photo(L.src(d.image), 3.0, 2.64, { mask: { poly: [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]] } }), 6.35, 1.13, 3.0, 2.64, { alt: '' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2744  '), { x: 0.6, y: 0.65, w: 5.2, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.3, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.3, 2.1, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 5.2, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 5.2, h: 0.45, fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 73, slug: 'muz', name: 'Muz', category: 'minimalist', photos: true, build: (c, o) => run(c, o, K), style: { tone: "sovuqqon va aniq: faktlar, raqamlar va tiniq xulosalar, ortiqcha his-tuyg'usiz", limits: {}, prefer: 'data' } };
