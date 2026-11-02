/** 71 Jinsi — denim: twill texture, orange stitched seams, leather label, copper rivets as markers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '2E4A6E', ink: 'F1F4F8', muted: 'C2D2E6', accent: 'E8A33D', patch: '3C5E88', leather: '9A6B3F', pal: ['E8A33D', '3C5E88', '9A6B3F', '5B7DA8', 'C9A06C', '2E4A6E'] };
const twill = () => { let l = ''; for (let k = -900; k < 1600; k += 7) l += `<line x1="${k}" y1="0" x2="${k + 900}" y2="900"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/><g stroke="#ffffff" stroke-opacity="0.05" stroke-width="2">${l}</g><g stroke="#000" stroke-opacity="0.06" stroke-width="1">${l}</g></svg>`; };
const stitch = (t, s, x, y, w, h, c = C.accent) => t.rect(s, x + 0.08, y + 0.08, w - 0.16, h - 0.16, null, { line: { color: c, width: 1.25, dashType: 'dash' }, name: 'Stitch' });
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Jinsi', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', twill(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k) => { const fill = k % 3 === 2 ? C.leather : C.patch; ctx.t.rect(s, x, y, w, h, fill, { r: 0.06, shadow: 0.35, blur: 6, offset: 2, name: 'Patch' }); stitch(ctx.t, s, x, y, w, h); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, 'B87333', { line: { color: 'E3B07A', width: 2 } }); ctx.t.oval(s, x + d * 0.18, y + d * 0.18, d * 0.64, d * 0.64, 'C98B4E'); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, C.patch, { r: 0.06, name: 'Patch' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); stitch(ctx.t, s, x - 0.1, y - 0.1, w + 0.2, h + 0.2); },
  title: (ctx, s, d) => {
    ctx.t.rect(s, 0.5, 0.35, 0.95, 0.7, C.leather, { r: 0.05, name: 'Leather tag' }); stitch(ctx.t, s, 0.5, 0.35, 0.95, 0.7, 'E3C08F');
    ctx.t.text(s, String(ctx.idx), { x: 0.5, y: 0.35, w: 0.95, h: 0.7, fontSize: 20, bold: true, color: 'FFF5E6', align: 'center', valign: 'middle' });
    if (d.title) ctx.t.text(s, d.title, { x: 1.65, y: 0.35, w: 7.8, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: ctx.L.fit(d.title, 7.8, 0.7, 28, 16, 'Arial', true) });
  },
  footer: metaFooter({ color: C.muted }),
  bullet: (ctx, s, x, y) => ctx.t.oval(s, x, y, 0.15, 0.15, C.accent),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.rect(s, 0.55, 0.55, 5.4, 4.3, C.leather, { r: 0.08, shadow: 0.4, blur: 8, offset: 3, name: 'Leather label' }); stitch(t, s, 0.55, 0.55, 5.4, 4.3, 'E3C08F');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.85, y: 0.8, w: 4.8, h: 0.3, fontSize: 11, bold: true, color: 'F3D9B1', charSpacing: 2 });
    t.text(s, d.title, { x: 0.85, y: 1.15, w: 4.8, h: 2.1, bold: true, fontSize: L.fit(d.title, 4.8, 2.0, 38, 18, 'Arial', true), color: 'FFF8EE', valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.3, w: 4.8, h: 0.75, fontSize: 12, color: 'F3D9B1' });
    t.text(s, M.author || '', { x: 0.85, y: 4.1, w: 4.8, h: 0.45, fontSize: 16, bold: true, color: 'FFF8EE' });
    for (const [x, y] of [[0.75, 0.75], [5.75, 0.75], [0.75, 4.65], [5.75, 4.65]]) K.marker(ctx, s, x - 0.1, y - 0.1, 0.22, 0, '');
    if (d.image) await K.photo(ctx, s, d.image, 6.4, 0.8, 3.0, 3.6);
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 71, slug: 'jinsi', name: 'Jinsi', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "erkin va ishonchli: kundalik tilga yaqin, sodda va mustahkam iboralar", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "playful"], "transitions": ["pull:l", "cut", "push:r"], "cover": ["stretch", "swingRight"], "mark": "popIn", "deco": "wipe:r", "sig": {"title": "stretch", "body": "fadeUp", "item": "swingRight", "image": "stretch", "number": "popIn", "order": "cascade", "stagger": 0.12}, "tempo": 0.95, "kenburns": false};
