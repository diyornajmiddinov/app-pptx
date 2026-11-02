/** 86 Nota — sheet music: five-line staves, note-head markers, bar lines on cards, a melody across the cover. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FBF8F1', ink: '222222', muted: '5E5E5E', accent: '7B1E3A', pal: ['7B1E3A', '1F3A5F', '3D6B35', 'A35C1A', '4B2E83', '1E6F6F'] };
const staff = (w, n = 5, gap = 14) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${gap * (n - 1) + 4}"><g stroke="#222" stroke-width="1.6">${Array.from({ length: n }, (_, k) => `<line x1="0" y1="${2 + k * gap}" x2="${w}" y2="${2 + k * gap}"/>`).join('')}</g></svg>`;
const melody = () => { const ys = [70, 56, 63, 42, 49, 35, 56, 28, 42, 63]; let g = ''; ys.forEach((y, i) => { const x = 120 + i * 140; g += `<ellipse cx="${x}" cy="${y}" rx="15" ry="11" transform="rotate(-20 ${x} ${y})" fill="#222"/><line x1="${x + 13}" y1="${y}" x2="${x + 13}" y2="${y - 60}" stroke="#222" stroke-width="4"/>`; if (i % 3 === 2) g += `<path d="M${x + 13},${y - 60} q20,10 18,35" fill="none" stroke="#222" stroke-width="4"/>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="130"><g stroke="#222" stroke-width="2">${[28, 42, 56, 70, 84].map((y) => `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`).join('')}<line x1="60" y1="28" x2="60" y2="84" stroke-width="4"/><line x1="1540" y1="28" x2="1540" y2="84" stroke-width="6"/></g>${g}</svg>`; };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Nota', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'line' },
  init: async (ctx) => { ctx.mel = await svgOnce(ctx, 'mel', melody(), 1600, 130); },
  bg: (ctx, s, kind) => { s.background = { color: C.bg }; if (kind !== 'hero') ctx.t.img(s, ctx.mel, 0, 4.9, 10, 0.4); },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.4 },
  panel: async (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: 'D9D2C3', width: 1 }, shadow: 0.1, blur: 5, offset: 2, name: 'Score card' }); if (!o.big) { t.img(s, await svgOnce(ctx, 'st' + Math.round(w * 10), staff(Math.round(w * 100) - 30, 5, 7), Math.round(w * 100) - 30, 32), x + 0.15, y + 0.12, w - 0.3, 0.32); t.line(s, x + 0.15, y + 0.12, 0, 0.3, C.ink, 1.25); t.line(s, x + w - 0.15, y + 0.12, 0, 0.3, C.ink, 2.25); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y + d * 0.15, d, d * 0.72, C.pal[k % 6], { name: 'Note head' }); ctx.t.line(s, x + d * 0.94, y - d * 0.5, 0, d * 0.75, C.pal[k % 6], 2.5); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.15, w: d, h: d * 0.72, fontFace: 'Cambria', fontSize: Math.round(d * 20), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); ctx.t.rect(s, x, y, w, h, null, { line: { color: C.ink, width: 1.5 }, name: 'Frame' }); },
  connector: (ctx, s, x, y, w) => { for (let k = 0; k < 3; k++) ctx.t.line(s, x, y - 0.06 + k * 0.06, w, 0, '9A9A9A', 0.75); },
  axis: (ctx, s, x, y, w) => { for (let k = 0; k < 5; k++) ctx.t.line(s, x, y + 0.05 + k * 0.06, w, 0, '9A9A9A', 0.75); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'E2DBCC', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.5, 0.6, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.35, y: 0.35, w: 8.1, h: 0.72, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: C.muted, y: 5.32, font: 'Cambria' }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.img(s, ctx.mel, 0, 3.75, 10, 0.81);
    if (d.image) await K.photo(ctx, s, d.image, 6.6, 0.55, 2.9, 2.9);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.6, w: 5.6, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 5.7, h: 1.95, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.7, 1.9, 40, 20, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.95, w: 5.6, h: 0.65, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.65, w: 5.6, h: 0.45, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: C.muted, y: 5.32, font: 'Cambria' })(ctx, s);
  },
};
module.exports = { id: 86, slug: 'nota', name: 'Nota', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "ohangdor va ravon: fikrlar bir-biriga ulanib boradigan, ritmli jumlalar", limits: {}, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "playful"], "transitions": ["fade", "push:l", "p14:ripple"], "cover": ["fadeLetters", "swing"], "mark": "bounceDrop", "deco": "slideRight", "sig": {"title": "sweepIn", "body": "fade", "item": "bounceDrop", "image": "wipe:r", "number": "bounceDrop", "order": "seq", "stagger": 0.12}, "tempo": 1.0, "kenburns": false};
