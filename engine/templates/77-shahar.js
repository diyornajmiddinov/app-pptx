/** 77 Shahar — night city: skyline silhouettes with lit windows, street-sign panels, a moon. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '0F1630', ink: 'EEF1FA', muted: 'A6B0D0', accent: 'FFC94D', pal: ['FFC94D', '4DB8FF', 'FF7A59', '7EE081', 'C08BFF', 'FF5C8A'] };
const skyline = (h, base, seed, op = 1) => { let x0 = seed, b = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let x = 0; x < 1600;) { const w = 60 + Math.floor(rnd() * 70), bh = 80 + Math.floor(rnd() * (base - 40)); b += `<rect x="${x}" y="${base - bh}" width="${w}" height="${bh + h}" fill="#1B2448"/>`;
    for (let wy = base - bh + 12; wy < base - 10; wy += 22) for (let wx = x + 10; wx < x + w - 12; wx += 18) if (rnd() > 0.55) b += `<rect x="${wx}" y="${wy}" width="8" height="11" fill="#FFD27A" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
    x += w + 4; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}" opacity="${op}">${b}</svg>`; };
const sky = () => { let st = '', x0 = 3; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < 70; i++) st += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 420).toFixed(0)}" r="${(0.8 + rnd() * 1.6).toFixed(1)}" fill="#fff" opacity="${(0.3 + rnd() * 0.6).toFixed(2)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0F24"/><stop offset="1" stop-color="#26305A"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/>${st}<circle cx="1330" cy="140" r="62" fill="#F4E9C8"/><circle cx="1355" cy="125" r="56" fill="#141C3B" opacity="0.25"/></svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Shahar', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.3 },
  bg: async (ctx, s, kind) => { s.background = { data: await svgOnce(ctx, 'sky', sky(), 1600, 900, true) }; if (kind === 'hero') ctx.t.img(s, await svgOnce(ctx, 'city', skyline(420, 420, 7), 1600, 420), 0, 3.0, 10, 2.625); else ctx.t.img(s, await svgOnce(ctx, 'low', skyline(160, 160, 13, 0.85), 1600, 160), 0, 4.62, 10, 1.0); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, '1E2A55', { t: 8, r: 0.08, line: { color: '3A4A85', width: 1 }, name: 'Sign' }); if (!o.big) ctx.t.rect(s, x, y, w, 0.07, C.pal[k % 6], { name: 'Light strip' }); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.rect(s, x, y, d, d, C.pal[k % 6], { r: 0.08, name: 'Street sign' }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: '0F1630', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.06 } }), x, y, w, h, { alt: '' }); ctx.t.rect(s, x, y, w, h, null, { r: 0.06, line: { color: C.accent, width: 1.5 }, name: 'Frame' }); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '3A4A85', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.38, 0.66, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.35, y: 0.35, w: 7.5, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.5, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted, y: 5.32 }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => '0F1630', authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) { t.rect(s, 6.35, 0.65, 2.9, 2.2, '1E2A55', { r: 0.06, name: 'Billboard' }); t.img(s, await L.photo(L.src(d.image), 2.7, 2.0), 6.45, 0.75, 2.7, 2.0, { alt: '' }); t.rect(s, 7.65, 2.85, 0.1, 0.5, '1E2A55', { name: 'Pole' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.55, w: 5.4, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 5.5, h: 1.6, bold: true, fontSize: L.fit(d.title, 5.5, 1.55, 38, 18, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.55, w: 5.4, h: 0.5, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 3.0, w: 5.4, h: 0.4, fontSize: 15, bold: true, color: C.accent });
    metaFooter({ color: C.muted, y: 5.32 })(ctx, s);
  },
};
module.exports = { id: 77, slug: 'shahar', name: 'Şahar', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "zamonaviy shahar ritmi: dinamik, amaliy, natijaga yo'naltirilgan", limits: {}, prefer: 'data' } };
