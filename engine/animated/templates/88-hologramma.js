/** 88 Hologramma — Y2K iridescent: holographic pastel mesh, chrome spheres as markers, frosted cards with rainbow edges. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EDE7FF', ink: '2B2140', muted: '62587A', accent: 'B14AED', pal: ['B14AED', '3EC1F3', 'FF7AB6', '58E0B5', 'FFC95C', '7C83FD'] };
const holo = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><filter id="b"><feGaussianBlur stdDeviation="90"/></filter></defs><rect width="1600" height="900" fill="#EFEAFF"/><g filter="url(#b)"><circle cx="250" cy="200" r="280" fill="#FFC7E8"/><circle cx="1350" cy="180" r="300" fill="#BDEBFF"/><circle cx="800" cy="760" r="320" fill="#D7FFE9"/><circle cx="1300" cy="780" r="220" fill="#FFF0BF"/><circle cx="300" cy="800" r="220" fill="#D9CCFF"/></g></svg>`;
const sphere = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><radialGradient id="g" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="#E9E6F5"/><stop offset="0.7" stop-color="#${c}"/><stop offset="1" stop-color="#5B4E7A"/></radialGradient></defs><circle cx="100" cy="100" r="96" fill="url(#g)"/><ellipse cx="72" cy="58" rx="30" ry="16" fill="#fff" opacity="0.7"/></svg>`;
const edge = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF7AB6"/><stop offset="0.35" stop-color="#FFC95C"/><stop offset="0.65" stop-color="#58E0B5"/><stop offset="1" stop-color="#3EC1F3"/></linearGradient></defs><rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="22" fill="#ffffff" fill-opacity="0.72" stroke="url(#g)" stroke-width="6"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Hologramma', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'markers', timeline: 'line' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', holo(), 1600, 900, true) }; },
  panel: async (ctx, s, x, y, w, h) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); ctx.t.img(s, await svgOnce(ctx, `e${W2}x${H2}`, edge(W2, H2), W2, H2), x, y, w, h); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 's' + (k % 6), sphere(C.pal[k % 6]), 200, 200), x, y, d, d); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: C.ink, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { await K.panel(ctx, s, x - 0.12, y - 0.12, w + 0.24, h + 0.24); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.12 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.accent, 2, { dash: 'sysDot' }),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, C.accent, 2),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.5, 0.36, 0.7, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => C.ink, authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    await K.marker(ctx, s, 8.2, 0.2, 1.4, 1, ''); await K.marker(ctx, s, 5.6, 3.9, 1.0, 2, '');
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 1.0, 2.9, 2.9);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2726  '), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.1, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.1, 2.1, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 4.9, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.9, h: 0.45, fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 88, slug: 'hologramma', name: 'Hologramma', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "zamonaviy va o'ynoqi: yangi avlod tili, qisqa va yorqin iboralar", limits: {}, prefer: 'visual' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "energetic"], "transitions": ["p14:glitter|pattern=\"hexagon\" dir=\"r\"", "dissolve", "p14:flash"], "cover": ["fadeLetters", "focusIn"], "mark": "focusIn", "deco": "dissolve", "sig": {"title": "dissolve", "body": "fadeLetters", "item": "focusIn", "image": "dissolve", "number": "focusIn", "order": "diagonal", "stagger": 0.12}, "tempo": 1.0, "kenburns": false};
