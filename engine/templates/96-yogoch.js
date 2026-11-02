/** 96 Yog'och — woodwork: plank wall with grain, light birch boards screwed on as cards, burnt-in (pyrography) markers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '7A4E2D', ink: '3B2412', muted: '6B4A2E', accent: '9C3D16', board: 'EED9B8', pal: ['5C3317', '9C3D16', '3B5B3A', '7A4E2D', '8E6B2F', '4A3B5C'] };
const planks = () => { let g = '', x0 = 9; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let r = 0; r < 9; r++) { const y = r * 100, base = ['8A5A35', '7A4E2D', '93623B', '83552F'][r % 4]; g += `<rect x="0" y="${y}" width="1600" height="98" fill="#${base}"/>`;
    for (let k = 0; k < 7; k++) { const yy = y + 10 + rnd() * 80; g += `<path d="M0,${yy.toFixed(0)} C400,${(yy + (rnd() - 0.5) * 20).toFixed(0)} 900,${(yy + (rnd() - 0.5) * 20).toFixed(0)} 1600,${(yy + (rnd() - 0.5) * 16).toFixed(0)}" fill="none" stroke="#5C3317" stroke-opacity="0.18" stroke-width="2"/>`; }
    g += `<rect x="0" y="${y + 98}" width="1600" height="2" fill="#4A2B14"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${g}</svg>`; };
const screw = (t, s, x, y) => { t.oval(s, x, y, 0.12, 0.12, 'A7A9AC', { line: { color: '6D6E70', width: 0.75 } }); t.line(s, x + 0.02, y + 0.06, 0.08, 0, '6D6E70', 1); };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme("Yog'och", C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'table' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', planks(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, C.board, { shadow: 0.4, blur: 6, offset: 3, name: 'Birch board' }); t.line(s, x, y + h * 0.33, w, 0, 'E2C9A1', 1); t.line(s, x, y + h * 0.71, w, 0, 'E2C9A1', 1); if (h > 0.8) { screw(t, s, x + 0.08, y + 0.08); screw(t, s, x + w - 0.2, y + 0.08); screw(t, s, x + 0.08, y + h - 0.2); screw(t, s, x + w - 0.2, y + h - 0.2); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: '3B2412', width: 1 } }); ctx.t.oval(s, x + d * 0.08, y + d * 0.08, d * 0.84, d * 0.84, null, { line: { color: 'D9B48A', width: 0.75 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 24), bold: true, color: 'F3E3C8', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.16, y - 0.16, w + 0.32, h + 0.32, '5C3317', { shadow: 0.4, blur: 6, offset: 3, name: 'Wood frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  rule: (ctx, s, x, y, w) => {},
  title: (ctx, s, d) => { const { t, L } = ctx; K.panel(ctx, s, 0.45, 0.28, 9.1, 0.85, 0, {}); K.marker(ctx, s, 0.6, 0.35, 0.7, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.5, y: 0.3, w: 7.8, h: 0.8, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.8, 0.75, 28, 15, 'Cambria', true) }); },
  footer: metaFooter({ color: 'F3E3C8', font: 'Cambria' }),
  onBg: 'FFF3E0', onBgMuted: 'EBD5B5', onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'F3E3C8', authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  area: { x: 0.6, y: 1.45, w: 8.8, h: 3.5 },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    K.panel(ctx, s, 0.55, 0.6, 5.6, 4.2, 0, {});
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.85, y: 0.85, w: 5.0, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.accent });
    t.text(s, d.title, { x: 0.85, y: 1.2, w: 5.0, h: 2.1, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.0, 2.0, 38, 18, 'Cambria', true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.35, w: 5.0, h: 0.7, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.85, y: 4.1, w: 5.0, h: 0.45, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.ink });
    if (d.image) await K.photo(ctx, s, d.image, 6.65, 0.85, 2.75, 3.6);
    metaFooter({ color: 'F3E3C8', font: 'Cambria' })(ctx, s);
  },
};
module.exports = { id: 96, slug: 'yogoch', name: "Yog'och", category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "hunarmand kabi: puxta, tabiiy, qo'l mehnatiga hurmat; sodda va iliq", limits: {}, prefer: null } };
