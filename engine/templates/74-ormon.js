/** 74 O'rmon — forest: layered pine silhouettes, tree-ring slices as markers, a treeline footer. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EEF3E6', ink: '1E3D2F', muted: '4F6B5A', accent: '2F7A4A', paper: 'FAF8F1', pal: ['2F7A4A', '7A5230', '4C7F56', 'A0763F', '1E3D2F', '6B9A5B'] };
const pines = (w, h, base, n, color, seed, minH, maxH) => { let x0 = seed, p = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let k = 0; k < n; k++) { const cx = (k / n) * w + rnd() * 40, th = minH + rnd() * (maxH - minH), tw = th * 0.42; p += `<polygon points="${cx},${base - th} ${cx + tw / 2},${base} ${cx - tw / 2},${base}"/>`; }
  return `<g fill="#${color}">${p}<rect x="0" y="${base - 2}" width="${w}" height="${h - base + 2}"/></g>`; };
const band = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="160">${pines(1600, 160, 80, 46, '6B9A5B', 3, 40, 75)}${pines(1600, 160, 110, 40, '3E6B4C', 7, 45, 90)}${pines(1600, 160, 140, 34, '1E3D2F', 11, 50, 105)}</svg>`;
const forest = (h, top) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}">${pines(1600, h, top + 60, 40, '6B9A5B', 3, 80, 160)}${pines(1600, h, top + 120, 34, '3E6B4C', 7, 90, 190)}${pines(1600, h, top + 180, 28, '1E3D2F', 11, 100, 220)}</svg>`;
const ringSvg = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="96" fill="#B98A57" stroke="#7A5230" stroke-width="6"/>${[78, 62, 48, 34, 22].map((r, i) => `<circle cx="${100 + i}" cy="${100 - i}" r="${r}" fill="none" stroke="#8E6439" stroke-width="2.5" opacity="0.6"/>`).join('')}<circle cx="100" cy="100" r="58" fill="#${c}" opacity="0.92"/></svg>`;
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme("O'rmon", C, C.pal), layout: { agenda: 'list', cards: 'rows', process: 'row', stats: 'tiles', timeline: 'line' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.2 },
  bg: async (ctx, s, kind) => { s.background = { color: kind === 'hero' ? 'E3EDD8' : C.bg }; if (kind === 'hero') ctx.t.img(s, await svgOnce(ctx, 'hero', forest(900, 690), 1600, 900), 0, 0, 10, 5.625); else ctx.t.img(s, await svgOnce(ctx, 'line', band(), 1600, 160), 0, 4.625, 10, 1.0); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, C.paper, { r: 0.08, line: { color: 'C9D8BC', width: 1 }, shadow: 0.15, blur: 6, offset: 2, name: 'Card' }); if (!o.big) ctx.t.rect(s, x, y, 0.08, h, C.pal[k % 6], { name: 'Bark' }); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'r' + (k % 6), ringSvg(C.pal[k % 6]), 200, 200), x, y, d, d); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 22), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, C.ink, { r: 0.1, name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.06 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '7A5230', 3),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, '7A5230', 3),
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'C9D8BC', 0.75),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.5, 0.35, 0.72, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: 'E3EDD8', y: 5.3 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) { t.rect(s, 6.3, 0.55, 3.2, 2.6, C.ink, { r: 0.1, name: 'Frame' }); t.img(s, await L.photo(L.src(d.image), 3.04, 2.44, { mask: { r: 0.06 } }), 6.38, 0.63, 3.04, 2.44, { alt: '' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.55, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 5.5, h: 1.75, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.5, 1.7, 38, 20, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.7, w: 5.4, h: 0.6, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 3.3, w: 5.4, h: 0.4, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: 'E3EDD8', y: 5.3 })(ctx, s);
  },
};
module.exports = { id: 74, slug: 'ormon', name: "Örmon", category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "o'sish va ildizlar tili: sabab, rivojlanish va barqarorlik; sokin, asosli", limits: {}, prefer: 'text' } };
