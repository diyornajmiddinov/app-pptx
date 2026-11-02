/** 97 Klaviatura — keyboard: keycaps with a lighter top face as cards and markers, an Enter-key accent, spacebar title. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'D9DCE1', ink: '25282D', muted: '5D636B', accent: 'F2711C', pal: ['F2711C', '2185D0', '21BA45', 'A333C8', 'DB2828', '00B5AD'] };
const key = (t, s, x, y, w, h, top = 'FAFAFA', side = 'C9CCD2') => { t.rect(s, x, y, w, h, side, { r: 0.1, shadow: 0.25, blur: 3, offset: 2, name: 'Keycap' }); t.rect(s, x + 0.06, y + 0.04, w - 0.12, h - 0.16, top, { r: 0.08, name: 'Key face' }); };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Klaviatura', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'columns' },
  bg: (ctx, s) => { s.background = { color: C.bg }; },
  panel: (ctx, s, x, y, w, h, k, o) => { const accent = o.big ? true : false; key(ctx.t, s, x, y, w, h, accent ? 'FFE7D4' : 'FAFAFA', accent ? 'E8A777' : 'C9CCD2'); },
  marker: (ctx, s, x, y, d, k, label) => { key(ctx.t, s, x, y, d, d, C.pal[k % 6], '4A4F57'); if (label !== '') ctx.t.text(s, String(label), { x, y: y - 0.04, w: d, h: d, fontSize: Math.round(d * 22), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { key(ctx.t, s, x - 0.12, y - 0.1, w + 0.24, h + 0.28); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.05 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '9AA0A8', 2),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.35, 0.7, ctx.idx, `F${ctx.idx}`); if (d.title) { key(t, s, 1.4, 0.35, 8.05, 0.7); t.text(s, d.title, { x: 1.6, y: 0.35, w: 7.7, h: 0.6, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.7, 0.6, 24, 14, 'Arial', true) }); } },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, valueColor: (i) => C.pal[i % 6], compareHead: (i) => C.pal[i ? 1 : 0],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    const keys = String(M.year || 'SLIDE').slice(0, 4).split('');
    keys.forEach((ch, i) => { K.marker(ctx, s, 0.6 + i * 0.95, 0.55, 0.85, i, ch); });
    key(t, s, 0.6, 1.65, 5.5, 2.15);
    t.text(s, d.title, { x: 0.85, y: 1.75, w: 5.0, h: 1.85, bold: true, fontSize: L.fit(d.title, 5.0, 1.8, 36, 18, 'Arial', true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.95, w: 5.5, h: 0.45, fontSize: 12, color: C.muted });
    key(t, s, 0.6, 4.45, 4.2, 0.55, 'FFE7D4', 'E8A777');
    t.text(s, `${M.author || ''}   \u21B5`, { x: 0.8, y: 4.45, w: 3.9, h: 0.48, fontSize: 14, bold: true, color: C.ink, valign: 'middle' });
    if (d.image) await K.photo(ctx, s, d.image, 6.55, 0.7, 2.85, 3.3);
    t.text(s, [M.org, M.loc].filter(Boolean).join(', '), { x: 6.55, y: 4.15, w: 2.9, h: 0.35, fontSize: 11, bold: true, color: C.muted, align: 'center' });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 97, slug: 'klaviatura', name: 'Klaviatura', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "raqamli dunyo tili: aniq buyruqlar, qisqa jumlalar, texnologik va amaliy", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "playful"], "transitions": ["push:d", "cut", "fade"], "cover": ["typeLetters", "popIn"], "mark": "popIn", "deco": "drop", "sig": {"title": "typeLetters", "body": "wipeWords", "item": "drop", "image": "drop", "number": "popIn", "order": "seq", "stagger": 0.08}, "tempo": 0.8, "kenburns": false};
