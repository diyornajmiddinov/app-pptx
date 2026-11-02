/** 100 Termal — thermal camera: false-colour heat blobs, a temperature scale bar, heat-coloured markers, °-numbered slides. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '0B0620', ink: 'F5F0FF', muted: 'B9AED6', accent: 'FFB000', pal: ['FF3D00', 'FFB000', 'C2185B', '7B1FA2', 'FF6F00', 'FFEA00'] };
const heat = (seed) => { let x0 = seed, g = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); const cols = ['3A0CA3', '7209B7', 'C2185B', 'FF3D00', 'FFB000'];
  for (let i = 0; i < 9; i++) { const cx = rnd() * 1600, cy = rnd() * 900, r = 120 + rnd() * 220; cols.forEach((c, k) => { g += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(r * (1 - k * 0.18)).toFixed(0)}" fill="#${c}" opacity="0.5"/>`; }); }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><filter id="b"><feGaussianBlur stdDeviation="55"/></filter></defs><rect width="1600" height="900" fill="#${C.bg}"/><g filter="url(#b)" opacity="0.55">${g}</g><rect width="1600" height="900" fill="#0B0620" opacity="0.35"/></svg>`; };
const scale = () => `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="600"><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1A0B3C"/><stop offset="0.25" stop-color="#7209B7"/><stop offset="0.5" stop-color="#C2185B"/><stop offset="0.75" stop-color="#FF3D00"/><stop offset="1" stop-color="#FFEA00"/></linearGradient></defs><rect width="40" height="600" rx="8" fill="url(#g)"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Termal', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'markers', timeline: 'columns' },
  area: { x: 0.6, y: 1.4, w: 8.5, h: 3.55 },
  bg: async (ctx, s, kind) => { s.background = { data: await svgOnce(ctx, 'h' + (kind === 'page' ? 1 : 2), heat(kind === 'page' ? 5 : 13), 1600, 900, true) }; const { t } = ctx; t.img(s, await svgOnce(ctx, 'scale', scale(), 40, 600), 9.4, 1.0, 0.18, 3.6); ['40\u00B0', '30\u00B0', '20\u00B0'].forEach((v, k) => t.text(s, v, { x: 9.12, y: 0.9 + k * 1.75, w: 0.3, h: 0.22, fontSize: 7, color: C.muted, align: 'right', noFit: true })); },
  panel: (ctx, s, x, y, w, h) => { ctx.t.rect(s, x, y, w, h, '160D35', { t: 20, r: 0.08, line: { color: '5B3C8C', width: 1 }, name: 'Panel' }); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: 'FFEA00', width: 1.25 } }); ctx.t.oval(s, x + d * 0.25, y + d * 0.25, d * 0.5, d * 0.5, 'FFEA00', { t: 55 }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: '0B0620', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { duo: ['2B0A5C', 'FFB000'] }), x, y, w, h, { alt: '' }); ctx.t.rect(s, x, y, w, h, null, { line: { color: 'FFB000', width: 1.5 }, name: 'Frame' }); ctx.t.text(s, '36.6\u00B0', { x: x + w - 0.95, y: y + 0.1, w: 0.85, h: 0.3, fontSize: 11, bold: true, color: 'FFEA00', align: 'right', noFit: true }); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '3A2A63', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; t.text(s, `${20 + ctx.idx}\u00B0`, { x: 0.5, y: 0.35, w: 0.95, h: 0.72, fontSize: 22, bold: true, color: C.pal[ctx.idx % 6], valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.5, y: 0.35, w: 7.6, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.6, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted, w: 8.5 }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => '0B0620', authorColor: C.accent, compareHead: (i) => (i ? 'FFEA00' : 'FF6F3C'),
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 5.9, 0.8, 3.2, 3.6);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.0, h: 2.3, bold: true, fontSize: L.fit(d.title, 5.0, 2.2, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.4, w: 4.9, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.25, w: 4.9, h: 0.45, fontSize: 16, bold: true, color: 'FF6F3C' });
    metaFooter({ color: C.muted, w: 8.5 })(ctx, s);
  },
};
module.exports = { id: 100, slug: 'termal', name: 'Termal', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "diagnostika tili: 'issiq nuqtalar', muammo va yechim; aniq, raqamlarga tayangan", limits: {}, prefer: 'data' } };
