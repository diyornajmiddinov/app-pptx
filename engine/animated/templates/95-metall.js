/** 95 Metall — industrial steel: brushed metal, riveted plates, hex-nut markers, hazard-stripe accents. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'B7BCC2', ink: '1E2327', muted: '4A5158', accent: 'F5B700', plate: '8E959C', pal: ['F5B700', 'E4572E', '29335C', '669BBC', 'A3B18A', 'D9D9D9'] };
const brushed = () => { let l = '', x0 = 3; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let y = 0; y < 900; y += 3) l += `<line x1="0" y1="${y}" x2="1600" y2="${y}" stroke="#${rnd() > 0.5 ? 'FFFFFF' : '5A6168'}" stroke-opacity="${(0.05 + rnd() * 0.08).toFixed(2)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9CED3"/><stop offset="0.5" stop-color="#AEB4BA"/><stop offset="1" stop-color="#C3C8CD"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/>${l}</svg>`; };
const hazard = (w) => { let g = ''; for (let x = -40; x < w; x += 40) g += `<polygon points="${x},0 ${x + 20},0 ${x + 60},40 ${x + 40},40" fill="#1E2327"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="40"><rect width="${w}" height="40" fill="#F5B700"/>${g}</svg>`; };
const rivets = (t, s, x, y, w, h) => { for (const [a, b] of [[x + 0.1, y + 0.1], [x + w - 0.2, y + 0.1], [x + 0.1, y + h - 0.2], [x + w - 0.2, y + h - 0.2]]) { t.oval(s, a, b, 0.1, 0.1, 'D5D9DD', { line: { color: '5A6168', width: 0.75 } }); } };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, caps: true, theme: theme('Metall', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  area: { x: 0.6, y: 1.4, w: 8.8, h: 3.55 },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', brushed(), 1600, 900, true) }; ctx.t.img(s, await svgOnce(ctx, 'hz', hazard(1600), 1600, 40), 0, 5.4, 10, 0.225); },
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, o.big ? '3A4148' : '4A5158', { line: { color: '2A2F34', width: 1.5 }, shadow: 0.3, blur: 5, offset: 2, name: 'Plate' }); t.line(s, x + 0.02, y + 0.02, w - 0.04, 0, '7A828A', 1); rivets(t, s, x, y, w, h); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.shape(s, 'HEXAGON', { x, y, w: d, h: d * 0.88, fill: { color: k % 3 === 0 ? C.accent : '9AA1A8' }, line: { color: '3A4148', width: 1.5 }, objectName: 'Nut' }); ctx.t.oval(s, x + d * 0.3, y + d * 0.24, d * 0.4, d * 0.4, '3A4148'); if (label !== '') ctx.t.text(s, String(label), { x: x + d * 0.3, y: y + d * 0.24, w: d * 0.4, h: d * 0.4, fontSize: Math.max(8, Math.round(d * 15)), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.18, y - 0.18, w + 0.36, h + 0.36, '4A5158', { name: 'Plate' }); rivets(ctx.t, s, x - 0.18, y - 0.18, w + 0.36, h + 0.36); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.36, 0.8, ctx.idx, ctx.idx); if (d.title) { const T = d.title.toUpperCase(); t.text(s, T, { x: 1.5, y: 0.35, w: 7.95, h: 0.72, bold: true, color: C.ink, valign: 'middle', charSpacing: 1, fontSize: L.fit(T, 7.6, 0.72, 26, 14, 'Arial', true) }); } },
  footer: metaFooter({ color: C.ink, y: 5.12, size: 8 }),
  onPanel: () => 'F1F3F5', subPanel: () => 'C9CED3', markerText: () => 'FFFFFF', authorColor: C.accent, valueColor: () => C.accent, compareHead: (i) => (i ? '9FD0F5' : C.accent),
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    K.panel(ctx, s, 0.55, 0.55, 5.5, 4.3, 0, { big: true });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(' / ').toUpperCase(), { x: 0.85, y: 0.8, w: 5.0, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    const T = d.title.toUpperCase();
    t.text(s, T, { x: 0.85, y: 1.15, w: 4.95, h: 2.2, bold: true, fontSize: L.fit(T, 4.9, 2.1, 34, 16, 'Arial', true), color: 'F1F3F5', valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.4, w: 4.95, h: 0.65, fontSize: 12, color: 'C9CED3' });
    t.img(s, await svgOnce(ctx, 'hzs', hazard(500), 500, 40), 0.85, 4.15, 2.0, 0.16);
    t.text(s, (M.author || '').toUpperCase(), { x: 0.85, y: 4.35, w: 4.95, h: 0.35, fontSize: 13, bold: true, color: 'F1F3F5' });
    if (d.image) await K.photo(ctx, s, d.image, 6.65, 0.8, 2.75, 3.8);
    metaFooter({ color: C.ink, y: 5.12, size: 8 })(ctx, s);
  },
};
module.exports = { id: 95, slug: 'metall', name: 'Metall', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "sanoat tili: mustahkam, aniq, texnik; qisqa jumlalar va o'lchanadigan natijalar", limits: { title: 40, card_h: 18, step_h: 18 }, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "technical"], "transitions": ["p14:shred|pattern=\"strip\" dir=\"in\"", "cut", "split:h"], "cover": ["stretch", "splitH"], "mark": "popIn", "deco": "splitH", "sig": {"title": "splitH", "body": "wipe:r", "item": "stretch", "image": "splitH", "number": "popIn", "order": "seq", "stagger": 0.12}, "tempo": 0.85, "kenburns": false};
