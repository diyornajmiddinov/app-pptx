/** 81 Televizor — retro TV: striped wallpaper, wooden TV cabinets with glowing CRT screens, channel knobs. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'E9D8B4', ink: '3B2A1E', muted: '6E5743', accent: 'C1440E', wood: '8B5A2B', screen: '17262A', pal: ['C1440E', '2A9D8F', 'E9C46A', '8B5A2B', '5E548E', 'E76F51'] };
const paper = () => { let st = ''; for (let x = 0; x < 1600; x += 80) st += `<rect x="${x}" y="0" width="40" height="900" fill="#E1CDA3"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/>${st}</svg>`; };
const scan = (w, h) => { let l = ''; for (let y = 0; y < h; y += 6) l += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g stroke="#9FFFB0" stroke-opacity="0.05">${l}</g><ellipse cx="${w * 0.3}" cy="${h * 0.2}" rx="${w * 0.35}" ry="${h * 0.12}" fill="#fff" opacity="0.05"/></svg>`; };
const bars = () => `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="120">${['C0C0C0', 'C0C000', '00C0C0', '00C000', 'C000C0', 'C00000', '0000C0'].map((c, i) => `<rect x="${i * 100}" y="0" width="100" height="120" fill="#${c}"/>`).join('')}</svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Televizor', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', paper(), 1600, 900, true) }; },
  panel: async (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, C.wood, { r: 0.12, shadow: 0.3, blur: 6, offset: 3, name: 'Cabinet' }); t.rect(s, x + 0.1, y + 0.1, w - 0.2, h - 0.2, C.screen, { r: 0.18, name: 'Screen' }); t.img(s, await svgOnce(ctx, `sc${Math.round(w * 10)}x${Math.round(h * 10)}`, scan(Math.round(w * 100), Math.round(h * 100)), w * 100, h * 100), x + 0.1, y + 0.1, w - 0.2, h - 0.2); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, '3B2A1E', { line: { color: 'D9C29A', width: 2 } }); ctx.t.oval(s, x + d * 0.2, y + d * 0.2, d * 0.6, d * 0.6, C.pal[k % 6]); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 22), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { const { t, L } = ctx; t.rect(s, x - 0.15, y - 0.15, w + 0.3, h + 0.5, C.wood, { r: 0.12, shadow: 0.3, blur: 6, offset: 3, name: 'Cabinet' }); t.img(s, await L.photo(L.src(src), w, h, { mask: { r: 0.1 } }), x, y, w, h, { alt: '' }); for (let k = 0; k < 2; k++) t.oval(s, x + w - 0.6 + k * 0.3, y + h + 0.06, 0.2, 0.2, 'D9C29A'); },
  title: (ctx, s, d) => { const { t, L } = ctx; t.rect(s, 0.5, 0.38, 1.1, 0.62, C.screen, { r: 0.1, name: 'Channel' }); t.text(s, `CH ${String(ctx.idx).padStart(2, '0')}`, { x: 0.5, y: 0.38, w: 1.1, h: 0.62, fontFace: 'Courier New', fontSize: 14, bold: true, color: '7CFC8A', align: 'center', valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.8, y: 0.35, w: 7.65, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.65, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => 'E8F5E9', subPanel: () => 'B5DDB9', markerText: () => 'FFFFFF', authorColor: '9FFFB0', valueColor: () => '7CFC8A', compareHead: () => 'FFE08A',
  bullet: (ctx, s, x, y, k) => ctx.t.oval(s, x, y, 0.14, 0.14, k ? '7CFC8A' : 'FFE08A'),
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.line(s, 7.0, 0.3, 0.6, 0.55, '3B2A1E', 2, { flipV: true }); t.line(s, 7.6, 0.3, 0.6, 0.55, '3B2A1E', 2);
    t.rect(s, 5.9, 0.85, 3.6, 3.6, C.wood, { r: 0.15, shadow: 0.35, blur: 8, offset: 3, name: 'TV' });
    t.rect(s, 6.1, 1.05, 3.2, 2.6, C.screen, { r: 0.25, name: 'Screen' });
    if (d.image) t.img(s, await L.photo(L.src(d.image), 3.0, 2.4, { mask: { r: 0.12 } }), 6.2, 1.15, 3.0, 2.4, { alt: '' });
    else t.img(s, await svgOnce(ctx, 'bars', bars(), 700, 120), 6.2, 1.6, 3.0, 1.2);
    for (let k = 0; k < 3; k++) K.marker(ctx, s, 6.3 + k * 0.45, 3.8, 0.35, k, '');
    t.img(s, await svgOnce(ctx, 'bars', bars(), 700, 120), 0.6, 0.6, 2.4, 0.3);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 1.0, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.35, w: 5.0, h: 2.0, bold: true, fontSize: L.fit(d.title, 5.0, 1.95, 38, 18, 'Arial', true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.4, w: 5.0, h: 0.7, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 5.0, h: 0.45, fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 81, slug: 'televizor', name: 'Televizor', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "ko'rsatuv boshlovchisi kabi: tomoshabinga murojaat, qiziqarli va tushunarli", limits: {}, prefer: 'visual' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "technical"], "transitions": ["zoom:out", "cut", "p14:flash"], "cover": ["zoomIn", "stretch"], "mark": "appear", "deco": "unfold", "sig": {"title": "unfold", "body": "fade", "item": "zoomIn", "image": "unfold", "number": "appear", "order": "seq", "stagger": 0.12}, "tempo": 0.9, "kenburns": false};
