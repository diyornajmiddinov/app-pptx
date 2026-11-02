/** 79 Papka — manila folders: tabbed folders as containers, labels on tabs, paper clips, colour-coded tabs. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'E9E6DF', ink: '2B2B2B', muted: '5F5A52', accent: 'D35400', folder: 'E8C98E', folder2: 'DDB877', pal: ['D35400', '2E86AB', '27AE60', '8E44AD', 'C0392B', '16A085'] };
const tabbed = (w, h, tx, tw, fill, tab) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="M0,30 L${tx},30 L${tx + 12},4 L${tx + tw - 12},4 L${tx + tw},30 L${w},30 L${w},${h} L0,${h} Z" fill="#${fill}" stroke="#B9965A" stroke-width="2"/><path d="M${tx + 12},4 L${tx + tw - 12},4 L${tx + tw},30 L${tx},30 Z" fill="#${tab}"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Papka', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.7 },
  bg: (ctx, s) => { s.background = { color: C.bg }; },
  panel: async (ctx, s, x, y, w, h, k, o) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100), tw = Math.min(140, W2 * 0.45), tx = 20 + (k % 3) * Math.max(0, (W2 - tw - 40) / 3);
    ctx.t.img(s, await svgOnce(ctx, `p${W2}x${H2}k${k % 6}`, tabbed(W2, H2, tx, tw, o.big ? 'F2DDB2' : C.folder, C.pal[k % 6]), W2, H2), x, y - 0.3, w, h + 0.3); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.rect(s, x, y + d * 0.1, d, d * 0.8, C.pal[k % 6], { r: 0.04, name: 'Label' }); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.1, w: d, h: d * 0.8, fontSize: Math.round(d * 22), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, 'FFFFFF', { shadow: 0.2, blur: 5, offset: 2, rotate: -1.5, name: 'Print' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); ctx.t.img(s, await ctx.L.icon('FiPaperclip', '7F8C8D', 2), x + 0.2, y - 0.35, 0.4, 0.7); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'CFC7B8', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; t.rect(s, 0.5, 0.38, 1.0, 0.62, 'FFFFFF', { line: { color: 'B9965A', width: 1 }, name: 'File label' }); t.text(s, `\u2116 ${ctx.idx}`, { x: 0.5, y: 0.38, w: 1.0, h: 0.62, fontSize: 15, bold: true, color: C.accent, align: 'center', valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.7, y: 0.35, w: 7.75, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.75, 0.7, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => '4A443B', authorColor: C.accent, valueColor: (i) => C.pal[i % 6], compareHead: (i) => C.pal[i ? 1 : 0],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    await K.panel(ctx, s, 0.6, 0.9, 8.8, 4.1, 0, { big: true });
    t.rect(s, 0.9, 1.0, 3.8, 0.45, 'FFFFFF', { line: { color: 'B9965A', width: 1 }, name: 'Label' });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 1.0, y: 1.0, w: 3.6, h: 0.45, fontSize: 11, bold: true, color: C.accent, valign: 'middle' });
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 1.55, 2.8, 2.6);
    t.text(s, d.title, { x: 0.95, y: 1.6, w: 5.0, h: 1.8, bold: true, fontSize: L.fit(d.title, 5.0, 1.7, 36, 18, 'Arial', true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.95, y: 3.45, w: 5.0, h: 0.6, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.95, y: 4.15, w: 5.0, h: 0.45, fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 79, slug: 'papka', name: 'Papka', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "ish yuritish uslubi: tartibli bo'limlar, aniq faktlar va qisqa xulosalar", limits: {}, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "calm"], "transitions": ["pull:u", "cover:u", "fade"], "cover": ["peekUp", "fadeWords"], "mark": "peekUp", "deco": "peekUp", "sig": {"title": "peekUp", "body": "fade", "item": "peekUp", "image": "wipe:u", "number": "popIn", "order": "seq", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
