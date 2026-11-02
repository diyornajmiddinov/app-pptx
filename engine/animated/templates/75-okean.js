/** 75 Okean — deep sea: blue depth gradient, light rays, rising bubbles, translucent aqua panels. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '07304A', ink: 'E6F6FF', muted: '9CC9E0', accent: '3FD0C9', pal: ['3FD0C9', 'FF7F6B', '5AB0FF', 'FFD166', '7FE3A9', 'B39DFF'] };
const sea = (seed) => { let x0 = seed, b = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 40; i++) { const r = 3 + rnd() * 14; b += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="${r.toFixed(1)}" fill="none" stroke="#BFEFFF" stroke-opacity="${(0.15 + rnd() * 0.3).toFixed(2)}" stroke-width="2"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E5C7E"/><stop offset="1" stop-color="#03182A"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="25"/></filter></defs>
  <rect width="1600" height="900" fill="url(#g)"/><g filter="url(#b)" opacity="0.28" fill="#BFEFFF"><polygon points="300,0 420,0 700,900 520,900"/><polygon points="800,0 880,0 1100,900 980,900"/><polygon points="1250,0 1330,0 1480,900 1380,900"/></g>${b}</svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Okean', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'list', stats: 'markers', timeline: 'columns' },
  bg: async (ctx, s, kind) => { s.background = { data: await svgOnce(ctx, 'bg' + (kind === 'page' ? 1 : 2), sea(kind === 'page' ? 5 : 9), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h) => ctx.t.rect(s, x, y, w, h, '0F5E7A', { t: 35, r: 0.16, line: { color: '6FD6E8', width: 1 }, name: 'Water panel' }),
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { t: 10, line: { color: 'FFFFFF', width: 1.5 } }); ctx.t.oval(s, x + d * 0.18, y + d * 0.14, d * 0.26, d * 0.16, 'FFFFFF', { t: 45 }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: '06263A', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.12 } }), x, y, w, h, { alt: '' }); ctx.t.rect(s, x, y, w, h, null, { r: 0.12, line: { color: '6FD6E8', width: 2 }, name: 'Frame' }); for (const [a, b, r] of [[0.85, 0.25, 0.16], [0.9, 0.12, 0.09], [0.8, 0.07, 0.06]]) ctx.t.oval(s, x + w * a, y + h * b, r, r, null, { line: { color: 'FFFFFF', width: 1.25 } }); },
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.36, 0.7, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => '06263A', authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.15, 0.7, 3.3, 3.5);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.65, w: 5.3, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.3, h: 2.3, bold: true, fontSize: L.fit(d.title, 5.3, 2.2, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.4, w: 5.2, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.25, w: 5.2, h: 0.45, fontSize: 16, bold: true, color: C.pal[1] });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 75, slug: 'okean', name: 'Okean', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "chuqur va sokin: mavzuning qatlamlarini ochib boruvchi, ravon tushuntirish", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["p14:ripple", "fade", "p14:pan|dir=\"d\""], "cover": ["riseWords", "fadeWords"], "mark": "curveUp", "deco": "riseUp", "sig": {"title": "riseWords", "body": "fadeUp", "item": "curveUp", "image": "riseUp", "number": "springIn", "order": "seq", "stagger": 0.2}, "tempo": 1.2, "kenburns": true};
