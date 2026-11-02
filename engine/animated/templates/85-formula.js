/** 85 Formula — mathematics: graph paper, coordinate axes with a plotted curve, points as markers, f(x) labels. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FFFFFF', ink: '1A2B4C', muted: '56657F', accent: 'E74C3C', pal: ['E74C3C', '2E86C1', '27AE60', '8E44AD', 'F39C12', '16A085'] };
const grid = () => { let g = ''; for (let x = 0; x <= 1600; x += 32) g += `<line x1="${x}" y1="0" x2="${x}" y2="900" stroke-width="${x % 160 ? 1 : 2}"/>`; for (let y = 0; y <= 900; y += 32) g += `<line x1="0" y1="${y}" x2="1600" y2="${y}" stroke-width="${y % 160 ? 1 : 2}"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#fff"/><g stroke="#D6E6F5">${g}</g></svg>`; };
const plot = () => { let d = 'M60,300'; for (let x = 60; x <= 760; x += 10) d += ` L${x},${(300 - Math.sin((x - 60) / 70) * 110 - (x - 60) * 0.18).toFixed(1)}`; let p = 'M60,330'; for (let x = 60; x <= 760; x += 10) p += ` L${x},${(330 - ((x - 410) ** 2) / 2200 * -1 - 40).toFixed(1)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420"><g stroke="#1A2B4C" stroke-width="3" fill="#1A2B4C"><line x1="40" y1="380" x2="780" y2="380"/><line x1="60" y1="400" x2="60" y2="20"/><polygon points="780,372 796,380 780,388"/><polygon points="52,22 60,6 68,22"/></g><path d="${d}" fill="none" stroke="#E74C3C" stroke-width="5"/><path d="${p}" fill="none" stroke="#2E86C1" stroke-width="4" stroke-dasharray="12 8"/><text x="770" y="410" font-family="Cambria" font-size="28" font-style="italic" fill="#1A2B4C">x</text><text x="72" y="30" font-family="Cambria" font-size="28" font-style="italic" fill="#1A2B4C">y</text></svg>`; };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Formula', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'line' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'grid', grid(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: o.big ? C.ink : 'AFC8E0', width: o.big ? 1.5 : 1 }, shadow: 0.08, blur: 4, offset: 1, name: 'Card' }); },
  marker: (ctx, s, x, y, d, k, label) => { const c = C.pal[k % 6]; ctx.t.line(s, x, y + d / 2, d, 0, c, 1); ctx.t.line(s, x + d / 2, y, 0, d, c, 1); ctx.t.oval(s, x + d * 0.25, y + d * 0.25, d * 0.5, d * 0.5, c); if (label !== '') ctx.t.text(s, String(label), { x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5, fontFace: 'Cambria', fontSize: Math.max(8, Math.round(d * 15)), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { const { t } = ctx; t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); t.line(s, x, y + h + 0.08, w, 0, C.ink, 1.5); t.line(s, x - 0.08, y, 0, h, C.ink, 1.5); for (let k = 0; k <= 10; k++) { t.line(s, x + k * w / 10, y + h + 0.08, 0, 0.08, C.ink, 1); t.line(s, x - 0.16, y + k * h / 10, 0.08, 0, C.ink, 1); } },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.ink, 1.5),
  axis: (ctx, s, x, y, w) => { ctx.t.line(s, x, y + 0.17, w, 0, C.ink, 1.5); ctx.t.text(s, 't', { x: x + w - 0.2, y: y + 0.2, w: 0.3, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 14, color: C.ink }); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'AFC8E0', 0.75),
  bullet: (ctx, s, x, y, k) => ctx.t.text(s, k ? '\u2234' : '\u2235', { x: x - 0.05, y: y - 0.1, w: 0.3, h: 0.3, fontFace: 'Cambria', fontSize: 14, bold: true, color: C.pal[k ? 1 : 0] }),
  title: (ctx, s, d) => { const { t, L } = ctx; t.text(s, [{ text: 'f', options: { italic: true } }, { text: `(${ctx.idx})` }], { x: 0.5, y: 0.35, w: 0.95, h: 0.72, fontFace: 'Cambria', fontSize: 22, bold: true, color: C.accent, valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.5, y: 0.35, w: 7.95, h: 0.72, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.95, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: C.muted, font: 'Cambria' }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.img(s, await svgOnce(ctx, 'plot', plot(), 800, 420), 5.0, 0.55, 4.7, 2.47);
    if (d.image) await K.photo(ctx, s, d.image, 6.85, 3.2, 2.5, 1.6);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.6, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.3, h: 2.3, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 4.3, 2.2, 36, 18, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 4.3, h: 0.75, fontSize: 12, color: C.muted });
    t.text(s, [{ text: 'f(x) = ', options: { italic: true, color: C.muted } }, { text: M.author || '', options: { bold: true, color: C.ink } }], { x: 0.6, y: 4.2, w: 4.3, h: 0.45, fontFace: 'Cambria', fontSize: 16 });
    metaFooter({ color: C.muted, font: 'Cambria' })(ctx, s);
  },
};
module.exports = { id: 85, slug: 'formula', name: 'Formula', category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "matematik aniqlik: ta'rif, bog'liqlik va isbotga o'xshash mantiqiy ketma-ketlik", limits: {}, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "elegant"], "transitions": ["fade", "wipe:r", "morph"], "cover": ["fadeLetters", "typeLetters"], "mark": "fade", "deco": "wipe:r", "sig": {"title": "fadeLetters", "body": "wipeWords", "item": "wipe:r", "image": "wipe:r", "number": "fade", "order": "seq", "stagger": 0.2}, "tempo": 1.1, "kenburns": false};
