/** 72 Sahro — desert: layered dunes in warm sand tones, a low sun, caravan-path connectors. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F6E7C8', ink: '4A2E1A', muted: '7D5B3F', accent: 'C2512A', tile: 'FBF1DD', pal: ['E07A3F', 'C2512A', 'D9A35F', 'A66A3B', 'E9C48A', '7D5B3F'] };
const dunes = (h = 900, top = 560) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBEFD9"/><stop offset="1" stop-color="#F6E0B8"/></linearGradient></defs>
  <rect width="1600" height="${h}" fill="url(#sky)"/><circle cx="1220" cy="${top - 120}" r="120" fill="#F0A35E" opacity="0.85"/>
  <path d="M0,${top} C300,${top - 90} 600,${top + 40} 900,${top - 40} S1400,${top - 60} 1600,${top - 10} L1600,${h} L0,${h} Z" fill="#E9C48A"/>
  <path d="M0,${top + 110} C350,${top + 30} 700,${top + 160} 1100,${top + 70} S1500,${top + 90} 1600,${top + 80} L1600,${h} L0,${h} Z" fill="#D9A35F"/>
  <path d="M0,${top + 230} C400,${top + 170} 800,${top + 260} 1600,${top + 190} L1600,${h} L0,${h} Z" fill="#C07F3E"/></svg>`;
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Sahro', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'markers', timeline: 'line' },
  bg: async (ctx, s, kind) => { s.background = kind === 'page' ? { color: C.bg } : { data: await svgOnce(ctx, 'hero', dunes(), 1600, 900, true) }; if (kind === 'page') ctx.t.img(s, await svgOnce(ctx, 'band', dunes(140, 70), 1600, 140), 0, 4.75, 10, 0.875); },
  panel: (ctx, s, x, y, w, h, k, o) => ctx.t.rect(s, x, y, w, h, o.big ? 'FFF7E8' : C.tile, { r: 0.18, line: { color: 'E2B979', width: 1.25 }, shadow: 0.15, blur: 6, offset: 2, name: 'Sandstone' }),
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: 'FBEFD9', width: 2 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, 'FBF1DD', { r: 0.2, shadow: 0.2, blur: 8, offset: 3, name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.08 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'C9965C', 2, { dash: 'dash' }),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, 'C9965C', 2.5, { dash: 'dash' }),
  title: (ctx, s, d) => { const { t, L } = ctx; t.text(s, `${ctx.idx}`, { x: 0.5, y: 0.35, w: 0.75, h: 0.7, fontFace: 'Cambria', fontSize: 30, bold: true, color: C.accent, valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.3, y: 0.35, w: 8.15, h: 0.7, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.15, 0.7, 28, 16, 'Cambria', true) }); },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.4 },
  footer: metaFooter({ color: 'FFF7E8', y: 5.3 }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'FFFFFF', authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) { t.oval(s, 6.65, 0.75, 2.9, 2.9, 'FBEFD9'); t.img(s, await L.photo(L.src(d.image), 2.7, 2.7, { mask: 'circle' }), 6.75, 0.85, 2.7, 2.7, { alt: '' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.55, w: 5.6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 5.8, h: 1.9, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.8, 1.8, 40, 20, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.85, w: 5.6, h: 0.65, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 3.5, w: 5.6, h: 0.4, fontFace: 'Cambria', fontSize: 17, bold: true, color: C.accent });
    metaFooter({ color: 'FFF7E8', y: 5.3 })(ctx, s);
  },
};
module.exports = { id: 72, slug: 'sahro', name: 'Sahro', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "sabrli va keng nafasli: yo'l, manzil, bosqich obrazlari; iliq va aniq", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["dissolve", "p14:pan|dir=\"l\"", "fade"], "cover": ["fadeWords", "riseWords"], "mark": "focusIn", "deco": "fadeRight", "sig": {"title": "fadeRight", "body": "fade", "item": "fadeRight", "image": "dissolve", "number": "focusIn", "order": "seq", "stagger": 0.26}, "tempo": 1.35, "kenburns": true};
