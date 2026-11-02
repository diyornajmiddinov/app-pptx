/** 76 Tog' — mountains: layered peaks with snow caps, altitude markers as flags, a summit route. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F2F5F8', ink: '1E2B3A', muted: '596B7E', accent: 'D9534F', pal: ['3C5A7A', '5E7FA3', 'D9534F', '8AA4C1', '2A3F57', 'E59866'] };
const peaks = (h, base, op = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}" opacity="${op}">
  <polygon points="0,${base} 220,${base - 220} 380,${base - 120} 620,${base - 330} 860,${base - 140} 1080,${base - 280} 1300,${base - 110} 1460,${base - 230} 1600,${base - 150} 1600,${h} 0,${h}" fill="#8AA4C1"/>
  <polygon points="560,${base - 300} 620,${base - 330} 680,${base - 290} 650,${base - 280} 620,${base - 300} 590,${base - 282}" fill="#fff"/><polygon points="1040,${base - 255} 1080,${base - 280} 1125,${base - 248} 1080,${base - 258}" fill="#fff"/>
  <polygon points="0,${base + 40} 300,${base - 130} 520,${base - 20} 760,${base - 190} 1000,${base} 1240,${base - 160} 1600,${base + 10} 1600,${h} 0,${h}" fill="#5E7FA3"/>
  <polygon points="0,${base + 120} 400,${base - 10} 800,${base + 90} 1200,${base - 30} 1600,${base + 80} 1600,${h} 0,${h}" fill="#3C5A7A"/></svg>`;
const flag = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120"><rect x="18" y="8" width="5" height="108" fill="#1E2B3A"/><polygon points="23,10 92,30 23,52" fill="#${c}"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme("Tog'", C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'line' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.15 },
  bg: async (ctx, s, kind) => { s.background = { color: kind === 'hero' ? 'E4ECF4' : C.bg }; if (kind === 'hero') ctx.t.img(s, await svgOnce(ctx, 'hero', peaks(900, 620), 1600, 900), 0, 0, 10, 5.625); else ctx.t.img(s, await svgOnce(ctx, 'band', peaks(260, 170, 0.9), 1600, 260), 0, 4.55, 10, 1.075); },
  panel: (ctx, s, x, y, w, h, k, o) => ctx.t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.06, line: { color: 'C9D4E0', width: 1 }, shadow: 0.18, blur: 8, offset: 3, name: 'Card' }),
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: 'FFFFFF', width: 2 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { poly: [[0, 0.12], [0.3, 0], [0.55, 0.08], [0.8, 0], [1, 0.1], [1, 1], [0, 1]] } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.accent, 2, { dash: 'sysDot' }),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, C.ink, 1.5),
  title: async (ctx, s, d) => { const { t, L } = ctx; t.img(s, await svgOnce(ctx, 'flag' + (ctx.idx % 6), flag(C.pal[ctx.idx % 6]), 100, 120), 0.45, 0.28, 0.65, 0.78); t.text(s, String(ctx.idx), { x: 0.6, y: 0.33, w: 0.45, h: 0.32, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.3, y: 0.35, w: 8.15, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.15, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: 'FFFFFF', y: 5.3 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.3, 0.5, 3.2, 2.5);
    t.text(s, `\u25B2 ${[M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ')}`, { x: 0.6, y: 0.5, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.85, w: 5.5, h: 1.75, bold: true, fontSize: L.fit(d.title, 5.5, 1.7, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.65, w: 5.4, h: 0.6, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 3.25, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: 'FFFFFF', y: 5.3 })(ctx, s);
  },
};
module.exports = { id: 76, slug: 'tog', name: "Tog'", category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "maqsadga intilish: cho'qqi, bosqich va natija; qat'iy va ilhomlantiruvchi", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "energetic"], "transitions": ["p14:pan|dir=\"u\"", "fade", "p14:flythrough|dir=\"in\""], "cover": ["riseWords", "focusIn"], "mark": "riseSettle", "deco": "peekUp", "sig": {"title": "peekUp", "body": "fadeUp", "item": "riseSettle", "image": "peekUp", "number": "riseSettle", "order": "seq", "stagger": 0.18}, "tempo": 1.1, "kenburns": true};
