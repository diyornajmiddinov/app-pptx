/** 84 Laboratoriya — chemistry lab: flasks with coloured liquids as markers, graduated cards, a petri-dish photo. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F3F8FB', ink: '1C2B39', muted: '587083', accent: '2EC4B6', glass: '7FA7C0', pal: ['2EC4B6', 'E71D73', 'FFBF00', '7B5EA7', '3A86FF', 'FB5607'] };
const flask = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="220"><path d="M78,10 L122,10 L122,70 L180,190 Q185,210 165,210 L35,210 Q15,210 20,190 L78,70 Z" fill="#fff" stroke="#${C.glass}" stroke-width="7"/><path d="M52,135 L148,135 L176,192 Q180,204 165,204 L35,204 Q20,204 24,192 Z" fill="#${c}" opacity="0.9"/><circle cx="85" cy="165" r="7" fill="#fff" opacity="0.7"/><circle cx="115" cy="150" r="5" fill="#fff" opacity="0.7"/><rect x="70" y="2" width="60" height="14" rx="4" fill="#${C.glass}"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Laboratoriya', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'table' },
  bg: (ctx, s) => { s.background = { color: C.bg }; },
  // lab card: white sheet with graduation ticks along the left edge
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.08, line: { color: 'D3E2EC', width: 1 }, shadow: 0.12, blur: 6, offset: 2, name: 'Lab card' }); if (!o.big) for (let m = 0; m < Math.floor(h / 0.25); m++) t.line(s, x + 0.06, y + 0.2 + m * 0.25, m % 4 ? 0.08 : 0.16, 0, C.pal[k % 6], 1.25); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'f' + (k % 6), flask(C.pal[k % 6]), 200, 220), x, y - d * 0.05, d, d * 1.1); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.55, w: d, h: d * 0.45, fontSize: Math.round(d * 18), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { const dd = Math.min(w, h); const px = x + (w - dd) / 2, py = y + (h - dd) / 2; ctx.t.oval(s, px - 0.12, py - 0.12, dd + 0.24, dd + 0.24, 'FFFFFF', { line: { color: C.glass, width: 2.5 } }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), dd, dd, { mask: 'circle' }), px, py, dd, dd, { alt: '' }); ctx.t.oval(s, px - 0.05, py - 0.05, dd + 0.1, dd + 0.1, null, { line: { color: 'D3E2EC', width: 1.25 } }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.glass, 2),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.5, 0.3, 0.72, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.pal[1], valueColor: (i) => C.pal[i % 6],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 0.7, 3.0, 3.0);
    for (let k = 0; k < 4; k++) await K.marker(ctx, s, 5.55 + k * 0.95, 3.95, 0.8, k, '');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.0, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.0, 2.1, 38, 18, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 4.9, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.9, h: 0.45, fontSize: 16, bold: true, color: C.pal[1] });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 84, slug: 'laboratoriya', name: 'Laboratoriya', category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "tajriba bayoni kabi: maqsad, usul, natija va xulosa; ilmiy aniq", limits: {}, prefer: 'data' } };
