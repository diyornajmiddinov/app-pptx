/** 80 Teatr — theatre: red velvet curtains, a stage with spotlight, gold proscenium frame, ticket-stub markers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '1A0E10', ink: 'FFF4E0', muted: 'D9C3A5', accent: 'E2B04A', pal: ['E2B04A', 'B3202F', 'F0E1C0', 'C9773C', '8C1C26', 'FFD27A'] };
const curtain = (w, h, side) => { let f = ''; for (let k = 0; k < 9; k++) f += `<rect x="${k * w / 9}" y="0" width="${w / 18}" height="${h}" fill="#000" opacity="0.18"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A0F1C"/><stop offset="0.5" stop-color="#B3202F"/><stop offset="1" stop-color="#7A0F1C"/></linearGradient></defs><path d="M0,0 L${w},0 L${w},${h} ${side ? `Q${w * 0.3},${h * 0.7} 0,${h}` : `Q${w * 0.7},${h * 0.7} 0,${h}`} Z" fill="url(#g)"/>${f}</svg>`; };
const stage = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="spot" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="#3A2228"/><stop offset="1" stop-color="#140A0C"/></radialGradient></defs><rect width="1600" height="900" fill="url(#spot)"/><polygon points="700,0 900,0 1250,900 350,900" fill="#FFF1C8" opacity="0.06"/><rect y="0" width="1600" height="34" fill="#8C1C26"/><path d="M0,34 ${Array.from({ length: 20 }, (_, k) => `Q${k * 80 + 40},70 ${k * 80 + 80},34`).join(' ')}" fill="#8C1C26"/></svg>`;
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Teatr', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'markers', timeline: 'columns' },
  area: { x: 0.75, y: 1.45, w: 8.5, h: 3.5 },
  bg: async (ctx, s, kind) => { s.background = { data: await svgOnce(ctx, 'stage', stage(), 1600, 900, true) }; if (kind !== 'page') { ctx.t.img(s, await svgOnce(ctx, 'cl', curtain(260, 900, 0), 260, 900), -0.2, 0, 1.6, 5.625); ctx.t.img(s, await svgOnce(ctx, 'cr', curtain(260, 900, 1), 260, 900), 8.6, 0, 1.6, 5.625); } },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, '2A1519', { t: 5, line: { color: C.accent, width: 1.5 }, name: 'Programme card' }); ctx.t.rect(s, x + 0.06, y + 0.06, w - 0.12, h - 0.12, null, { line: { color: C.accent, width: 0.5 }, name: 'Gilt line' }); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, k % 2 ? 'B3202F' : C.accent, { line: { color: 'FFF1C8', width: 1.5 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 24), bold: true, color: k % 2 ? 'FFF4E0' : '2A1519', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.14, y - 0.14, w + 0.28, h + 0.28, C.accent, { name: 'Proscenium' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.accent, 1.5, { dash: 'dash' }),
  title: (ctx, s, d) => { const { t, L } = ctx; t.text(s, `${ctx.TR.scene} ${ctx.idx}`, { x: 0.75, y: 0.5, w: 2.2, h: 0.28, fontSize: 10, bold: true, color: C.accent, charSpacing: 2 }); if (d.title) t.text(s, d.title, { x: 0.75, y: 0.75, w: 8.5, h: 0.6, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.5, 0.6, 28, 15, 'Cambria', true) }); },
  footer: metaFooter({ color: C.muted, x: 0.75, w: 8.5, align: 'center' }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: (i) => (i % 2 ? 'FFF4E0' : '2A1519'), authorColor: C.accent,
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.0, 1.15, 2.4, 2.8);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 1.5, y: 1.0, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, d.title, { x: 1.5, y: 1.35, w: 4.3, h: 2.0, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 4.3, 1.95, 36, 18, 'Cambria', true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 1.5, y: 3.4, w: 4.3, h: 0.7, fontFace: 'Cambria', italic: true, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 1.5, y: 4.15, w: 4.3, h: 0.4, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: C.muted, x: 1.5, w: 7.0, align: 'center' })(ctx, s);
  },
};
module.exports = { id: 80, slug: 'teatr', name: 'Teatr', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "sahna asari kabi: kirish, rivojlanish, avj nuqta va xulosa; ta'sirli va jonli", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "bold"], "transitions": ["p14:doors|dir=\"vert\"", "fade", "p14:reveal|thruBlk=\"1\""], "cover": ["split", "fadeLetters"], "mark": "focusIn", "deco": "split", "sig": {"title": "split", "body": "fadeWords", "item": "focusIn", "image": "split", "number": "focusIn", "order": "centerOut", "stagger": 0.22}, "tempo": 1.2, "kenburns": true};
