/** 87 Atlas — Uzbek ikat silk (abr): vertical bands of blurred, stepped diamonds in vivid magenta, gold, green and indigo. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FFF9F2', ink: '2A1630', muted: '6A5470', accent: 'C2185B', pal: ['C2185B', 'F9A825', '2E7D32', '283593', 'E64A19', '00838F'] };
const ikat = (w, h, seed) => { const cols = ['C2185B', 'F9A825', '2E7D32', '283593', 'E64A19', '6A1B9A']; let x0 = seed, g = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); const bw = 120;
  for (let c = 0; c * bw < w; c++) { const base = cols[c % cols.length], alt = cols[(c + 2) % cols.length]; g += `<rect x="${c * bw}" y="0" width="${bw}" height="${h}" fill="#${base}"/>`;
    for (let y = 0; y < h; y += 150) { const cx = c * bw + bw / 2, j = (rnd() - 0.5) * 10; g += `<polygon points="${cx + j},${y} ${cx + bw * 0.42},${y + 75} ${cx + j},${y + 150} ${cx - bw * 0.42},${y + 75}" fill="#${alt}"/><polygon points="${cx},${y + 35} ${cx + bw * 0.2},${y + 75} ${cx},${y + 115} ${cx - bw * 0.2},${y + 75}" fill="#FFF9F2"/>`; } }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="b" x="-5%" y="0" width="110%" height="100%"><feGaussianBlur stdDeviation="5 0.5"/></filter></defs><g filter="url(#b)">${g}</g></svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Atlas', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'markers', timeline: 'columns' },
  area: { x: 1.05, y: 1.35, w: 8.45, h: 3.65 },
  bg: async (ctx, s, kind) => { s.background = { color: C.bg }; if (kind !== 'hero') ctx.t.img(s, await svgOnce(ctx, 'band', ikat(240, 900, 3), 240, 900), 0, 0, 0.75, 5.625); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: 'EADCCF', width: 1 }, shadow: 0.12, blur: 6, offset: 2, name: 'Card' }); if (!o.big) { ctx.t.rect(s, x, y, w, 0.14, C.pal[k % 6], { name: 'Ikat edge' }); ctx.t.rect(s, x, y + 0.14, w, 0.05, C.pal[(k + 1) % 6], { name: 'Ikat edge' }); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.shape(s, 'DIAMOND', { x, y, w: d, h: d, fill: { color: C.pal[k % 6] }, line: { color: 'FFFFFF', width: 1.5 }, objectName: 'Diamond' }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 22), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.12, y - 0.12, w + 0.24, h + 0.24, C.pal[0], { name: 'Frame' }); ctx.t.rect(s, x - 0.05, y - 0.05, w + 0.1, h + 0.1, C.pal[1], { name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 1.05, 0.38, 0.7, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.95, y: 0.35, w: 7.5, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.5, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted, x: 1.05, w: 8.45 }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'FFFFFF', authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.img(s, await svgOnce(ctx, 'hero', ikat(720, 900, 9), 720, 900), 5.5, 0, 4.5, 5.625);
    if (d.image) { t.rect(s, 6.25, 1.0, 3.0, 3.6, 'FFF9F2', { name: 'Frame' }); t.img(s, await L.photo(L.src(d.image), 2.7, 3.3), 6.4, 1.15, 2.7, 3.3, { alt: '' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.6, w: 4.7, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.7, h: 2.3, bold: true, fontSize: L.fit(d.title, 4.7, 2.2, 38, 18, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 4.6, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.6, h: 0.45, fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: C.muted, w: 4.8 })(ctx, s);
  },
};
module.exports = { id: 87, slug: 'atlas', name: 'Atlas', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "milliy ruhda yorqin: an'ana va zamonaviylik uyg'unligi, iliq va g'ururli", limits: {}, prefer: 'visual' } };
