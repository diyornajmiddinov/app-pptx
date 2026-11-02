/** 94 Qo'lyozma — manuscript scroll: aged parchment with burnt edges, rolled scroll ends, wax seals, ornamental rules. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EFDDB8', ink: '3E2A14', muted: '6E5333', accent: '8B1E1E', pal: ['8B1E1E', '5B3A1A', '2F4F4F', '7A5C1E', '4B2C4F', '8B4513'] };
const parch = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.5" cy="0.5" r="0.72"><stop offset="0.55" stop-color="#F3E3C1"/><stop offset="0.9" stop-color="#D9B983"/><stop offset="1" stop-color="#A9844E"/></radialGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.12  0 0 0 0.12 0"/></filter></defs><rect width="1600" height="900" fill="url(#g)"/><rect width="1600" height="900" filter="url(#n)"/></svg>`;
const seal = (c) => { let p = ''; for (let k = 0; k < 18; k++) { const a = (k / 18) * 2 * Math.PI, r = k % 2 ? 88 : 96; p += `${(100 + r * Math.cos(a)).toFixed(0)},${(100 + r * Math.sin(a)).toFixed(0)} `; } return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><polygon points="${p}" fill="#${c}"/><circle cx="100" cy="100" r="66" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="5"/><ellipse cx="78" cy="70" rx="22" ry="12" fill="#fff" opacity="0.25"/></svg>`; };
const ornament = (w) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="30"><line x1="0" y1="15" x2="${w / 2 - 30}" y2="15" stroke="#6E5333" stroke-width="2"/><line x1="${w / 2 + 30}" y1="15" x2="${w}" y2="15" stroke="#6E5333" stroke-width="2"/><path d="M${w / 2 - 22},15 Q${w / 2},-6 ${w / 2 + 22},15 Q${w / 2},36 ${w / 2 - 22},15 Z" fill="#8B1E1E"/></svg>`;
const K = {
  F: { head: 'Cambria', body: 'Cambria' }, C, theme: theme("Qo'lyozma", C, C.pal), layout: { agenda: 'list', cards: 'rows', process: 'list', stats: 'markers', timeline: 'table' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', parch(), 1600, 900, true) }; },
  // scroll: parchment sheet with rolled top and bottom ends
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'F7EBD3', { line: { color: 'C9A46B', width: 1 }, name: 'Scroll' }); if (!o.big && h > 0.9) { t.rect(s, x - 0.06, y - 0.06, w + 0.12, 0.14, 'C9A46B', { r: 0.07, name: 'Roll' }); t.rect(s, x - 0.06, y + h - 0.08, w + 0.12, 0.14, 'C9A46B', { r: 0.07, name: 'Roll' }); } },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'seal' + (k % 6), seal(C.pal[k % 6]), 200, 200), x, y, d, d); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 22), bold: true, color: 'F7EBD3', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.12, y - 0.12, w + 0.24, h + 0.24, 'F7EBD3', { line: { color: '8B6A3A', width: 2 }, name: 'Plate' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { duo: ['3E2A14', 'F3E3C1'] }), x, y, w, h, { alt: '' }); },
  rule: async (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'C9A46B', 0.75),
  bullet: (ctx, s, x, y, k) => ctx.t.text(s, '\u2766', { x: x - 0.05, y: y - 0.1, w: 0.3, h: 0.3, fontSize: 13, color: C.pal[k ? 2 : 0] }),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.5, 0.3, 0.78, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.45, y: 0.3, w: 8.0, h: 0.65, fontFace: 'Cambria', italic: true, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.65, 28, 16, 'Cambria', true, 1, true) }); t.img(s, await svgOnce(ctx, 'orn', ornament(800), 800, 30), 1.45, 0.98, 4.0, 0.15); },
  footer: metaFooter({ color: C.muted, font: 'Cambria', align: 'center' }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'F7EBD3', authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    await K.panel(ctx, s, 0.8, 0.55, d.image ? 5.3 : 8.4, 4.35, 0, {});
    if (d.image) await K.photo(ctx, s, d.image, 6.6, 0.85, 2.7, 3.4);
    const w = d.image ? 4.8 : 7.9;
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2766  '), { x: 1.05, y: 0.85, w, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 12, color: C.accent, align: 'center' });
    t.text(s, d.title, { x: 1.05, y: 1.2, w, h: 1.9, fontFace: 'Cambria', italic: true, bold: true, fontSize: L.fit(d.title, w, 1.85, 38, 18, 'Cambria', true, 1, true), color: C.ink, align: 'center', valign: 'middle' });
    t.img(s, await svgOnce(ctx, 'orn', ornament(800), 800, 30), 1.05 + w / 2 - 1.5, 3.15, 3.0, 0.12);
    if (d.subtitle) t.text(s, d.subtitle, { x: 1.05, y: 3.35, w, h: 0.6, fontFace: 'Cambria', italic: true, fontSize: 12, color: C.muted, align: 'center' });
    t.text(s, M.author || '', { x: 1.05, y: 4.0, w, h: 0.45, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.ink, align: 'center' });
    await K.marker(ctx, s, (d.image ? 5.5 : 8.6), 4.25, 0.8, 0, '');
    metaFooter({ color: C.muted, font: 'Cambria', align: 'center' })(ctx, s);
  },
};
module.exports = { id: 94, slug: 'qolyozma', name: "Qo'lyozma", category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "tarixiy bitik ohangi: salobatli, ravon, an'anaviy ifoda; faktlarga sodiq", limits: {}, prefer: 'text' } };
