/** 83 Kamera — camera viewfinder: rule-of-thirds grid, focus brackets, REC dot, timecode, battery. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '111214', ink: 'F5F5F5', muted: 'B0B3B8', accent: 'FF3B30', pal: ['FFD60A', 'FF3B30', '32D74B', '64D2FF', 'FF9F0A', 'BF5AF2'] };
const thirds = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/><g stroke="#fff" stroke-opacity="0.08" stroke-width="2"><line x1="533" y1="0" x2="533" y2="900"/><line x1="1066" y1="0" x2="1066" y2="900"/><line x1="0" y1="300" x2="1600" y2="300"/><line x1="0" y1="600" x2="1600" y2="600"/></g></svg>`;
const corners = (t, s, x, y, w, h, c = 'FFFFFF', k = 0.2, wt = 1.75) => { for (const [px, py, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { t.line(s, Math.min(px, px + sx * k), py, k, 0, c, wt); t.line(s, px, Math.min(py, py + sy * k), 0, k, c, wt); } };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Kamera', C, C.pal), layout: { agenda: 'twoCol', cards: 'rows', process: 'list', stats: 'tiles', timeline: 'line' },
  area: { x: 0.7, y: 1.4, w: 8.6, h: 3.5 },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', thirds(), 1600, 900, true) }; corners(ctx.t, s, 0.25, 0.2, 9.5, 5.2, 'FFFFFF', 0.35, 2); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, '1E2024', { t: 10, name: 'Panel' }); corners(ctx.t, s, x, y, w, h, o.big ? C.pal[0] : 'FFFFFF', 0.16, 1.5); },
  marker: (ctx, s, x, y, d, k, label) => { corners(ctx.t, s, x, y, d, d, C.pal[k % 6], d * 0.3, 1.75); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 22), bold: true, color: C.pal[k % 6], align: 'center', valign: 'middle' }); else ctx.t.oval(s, x + d * 0.4, y + d * 0.4, d * 0.2, d * 0.2, C.pal[k % 6]); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); corners(ctx.t, s, x + w * 0.35, y + h * 0.3, w * 0.3, h * 0.4, C.pal[0], 0.18, 1.75); },
  axis: (ctx, s, x, y, w) => { ctx.t.line(s, x, y + 0.17, w, 0, '5A5E66', 1.5); for (let k = 0; k <= 40; k++) ctx.t.line(s, x + k * w / 40, y + 0.17 - (k % 5 ? 0.05 : 0.1), 0, k % 5 ? 0.05 : 0.1, '5A5E66', 1); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '33363C', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; t.oval(s, 0.6, 0.48, 0.18, 0.18, C.accent); t.text(s, `REC  00:${String(ctx.idx).padStart(2, '0')}:24`, { x: 0.85, y: 0.4, w: 2.2, h: 0.32, fontFace: 'Courier New', fontSize: 11, bold: true, color: C.ink }); t.rect(s, 8.75, 0.45, 0.55, 0.24, null, { line: { color: C.ink, width: 1.25 }, name: 'Battery' }); t.rect(s, 8.79, 0.49, 0.36, 0.16, C.pal[2], { name: 'Charge' }); if (d.title) t.text(s, d.title, { x: 0.6, y: 0.75, w: 8.8, h: 0.6, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.6, 26, 15, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted, x: 0.7, w: 8.6, y: 5.0, font: 'Courier New', size: 8 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.pal[0], valueColor: (i) => C.pal[i % 6],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) { t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' }); t.rect(s, 0, 0, 10, 5.625, '000000', { t: 45, name: 'Scrim' }); }
    corners(t, s, 0.25, 0.2, 9.5, 5.2, 'FFFFFF', 0.35, 2.5); corners(t, s, 4.3, 2.1, 1.4, 1.4, C.pal[0], 0.25, 2);
    t.oval(s, 0.6, 0.48, 0.18, 0.18, C.accent); t.text(s, 'REC  00:00:00', { x: 0.85, y: 0.4, w: 2.2, h: 0.32, fontFace: 'Courier New', fontSize: 11, bold: true, color: C.ink });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 2.45, w: 8.0, h: 0.3, fontSize: 11, bold: true, color: C.pal[0], charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 2.75, w: 8.8, h: 1.35, bold: true, fontSize: L.fit(d.title, 8.8, 1.3, 40, 20, 'Arial', true), color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 4.1, w: 7.0, h: 0.5, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.55, w: 7.0, h: 0.4, fontSize: 15, bold: true, color: C.ink });
    metaFooter({ color: C.muted, x: 0.6, w: 8.8, y: 5.0, font: 'Courier New', size: 8 })(ctx, s);
  },
};
module.exports = { id: 83, slug: 'kamera', name: 'Kamera', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "reportaj kabi: kadrdagi fakt, aniq tafsilot va qisqa sharh", limits: {}, prefer: 'visual' } };
