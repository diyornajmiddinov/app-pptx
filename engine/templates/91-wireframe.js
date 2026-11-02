/** 91 Wireframe — UX wireframe: browser window chrome, dashed grey blocks, placeholder crosses, red numbered annotations. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F4F5F7', ink: '2E3440', muted: '6B7280', accent: 'E03131', box: 'FFFFFF', pal: ['E03131', '1C7ED6', '2F9E44', 'F08C00', '7048E8', '0C8599'] };
const K = {
  F: { head: 'Arial', body: 'Arial' }, C, theme: theme('Wireframe', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  area: { x: 0.65, y: 1.5, w: 8.7, h: 3.4 },
  bg: (ctx, s, kind) => { const { t } = ctx; s.background = { color: C.bg }; t.rect(s, 0.35, 0.2, 9.3, 5.15, 'FFFFFF', { line: { color: 'CED4DA', width: 1 }, name: 'Window' }); t.rect(s, 0.35, 0.2, 9.3, 0.38, 'E9ECEF', { name: 'Chrome' }); ['FA5252', 'FAB005', '40C057'].forEach((c, k) => t.oval(s, 0.5 + k * 0.2, 0.32, 0.13, 0.13, c)); t.rect(s, 1.3, 0.27, 5.5, 0.24, 'FFFFFF', { r: 0.12, name: 'URL' }); t.text(s, `slideai.uz/${(ctx.M.topic || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}/${ctx.idx}`, { x: 1.45, y: 0.27, w: 5.3, h: 0.24, fontSize: 8, color: C.muted, valign: 'middle', noFit: true }); },
  panel: (ctx, s, x, y, w, h, k, o) => ctx.t.rect(s, x, y, w, h, o.big ? 'F8F9FA' : C.box, { line: { color: 'ADB5BD', width: 1.25, dashType: 'dash' }, name: 'Block' }),
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.accent, { line: { color: 'FFFFFF', width: 1.5 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { const { t } = ctx; t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { gray: true }), x, y, w, h, { alt: '' }); t.rect(s, x, y, w, h, null, { line: { color: '868E96', width: 1.25 }, name: 'Image box' }); t.rect(s, x, y, 0.55, 0.24, '868E96', { name: 'Tag' }); t.text(s, 'IMG', { x, y, w: 0.55, h: 0.24, fontSize: 8, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', noFit: true }); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'DEE2E6', 0.75),
  bullet: (ctx, s, x, y) => ctx.t.rect(s, x, y + 0.02, 0.13, 0.13, 'ADB5BD', { name: 'Bullet' }),
  title: (ctx, s, d) => { const { t, L } = ctx; t.rect(s, 0.65, 0.78, 0.6, 0.12, 'CED4DA', { name: 'Nav' }); t.rect(s, 1.35, 0.78, 0.6, 0.12, 'CED4DA', { name: 'Nav' }); t.rect(s, 2.05, 0.78, 0.6, 0.12, 'CED4DA', { name: 'Nav' }); if (d.title) t.text(s, d.title, { x: 0.65, y: 0.95, w: 7.9, h: 0.5, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.5, 24, 14, 'Arial', true) }); K.marker(ctx, s, 8.85, 0.85, 0.42, 0, ctx.idx); },
  footer: metaFooter({ color: C.muted, x: 0.65, w: 8.7, y: 5.02, size: 8 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, compareHead: (i) => (i ? C.pal[1] : C.accent),
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.0, 0.95, 3.3, 3.0);
    else { t.rect(s, 6.0, 0.95, 3.3, 3.0, 'F1F3F5', { line: { color: '868E96', width: 1.25 }, name: 'Image box' }); t.line(s, 6.0, 0.95, 3.3, 3.0, 'ADB5BD', 1); t.line(s, 6.0, 0.95, 3.3, 3.0, 'ADB5BD', 1, { flipV: true }); }
    t.rect(s, 0.75, 0.95, 2.4, 0.3, 'E9ECEF', { name: 'Label' }); t.text(s, [M.org, M.year].filter(Boolean).join(' \u2022 '), { x: 0.8, y: 0.95, w: 2.3, h: 0.3, fontSize: 10, bold: true, color: C.muted, valign: 'middle' });
    t.text(s, d.title, { x: 0.75, y: 1.35, w: 5.0, h: 1.8, bold: true, fontSize: L.fit(d.title, 5.0, 1.75, 36, 18, 'Arial', true), color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.75, y: 3.2, w: 5.0, h: 0.7, fontSize: 12, color: C.muted });
    t.rect(s, 0.75, 4.05, 2.6, 0.5, C.ink, { r: 0.06, name: 'Button' }); t.text(s, M.author || '', { x: 0.75, y: 4.05, w: 2.6, h: 0.5, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    t.text(s, M.loc || '', { x: 3.5, y: 4.05, w: 2.0, h: 0.5, fontSize: 11, color: C.muted, valign: 'middle' });
    K.marker(ctx, s, 5.8, 0.8, 0.4, 0, 1); K.marker(ctx, s, 0.55, 1.25, 0.4, 0, 2);
    metaFooter({ color: C.muted, x: 0.65, w: 8.7, y: 5.02, size: 8 })(ctx, s);
  },
};
module.exports = { id: 91, slug: 'wireframe', name: 'Wireframe', category: 'minimalist', photos: true, build: (c, o) => run(c, o, K), style: { tone: "loyiha hujjati kabi: struktura, funksiya va izohlar; aniq va amaliy", limits: {}, prefer: null } };
