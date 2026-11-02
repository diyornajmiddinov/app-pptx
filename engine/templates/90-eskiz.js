/** 90 Eskiz — pencil sketch: graphite lines drawn twice with a wobble, hatched markers, sketched frames on white paper. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FFFFFF', ink: '2F2F2F', muted: '666666', accent: 'D9480F', pal: ['D9480F', '1971C2', '2B8A3E', '9C36B5', 'E67700', '0C8599'] };
let seed = 5; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const wob = (x1, y1, x2, y2) => { const mx = (x1 + x2) / 2 + (rnd() - 0.5) * 6, my = (y1 + y2) / 2 + (rnd() - 0.5) * 6; return `M${(x1 + (rnd() - 0.5) * 4).toFixed(1)},${(y1 + (rnd() - 0.5) * 4).toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${(x2 + (rnd() - 0.5) * 4).toFixed(1)},${(y2 + (rnd() - 0.5) * 4).toFixed(1)}`; };
const sketchRect = (w, h, c = '2F2F2F') => { const e = 6; let d = ''; for (let pass = 0; pass < 2; pass++) d += wob(e, e, w - e, e) + ' ' + wob(w - e, e, w - e, h - e) + ' ' + wob(w - e, h - e, e, h - e) + ' ' + wob(e, h - e, e, e) + ' ';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="none" stroke="#${c}" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/></svg>`; };
const hatchCircle = (c) => { let h = ''; for (let k = -100; k < 100; k += 12) h += `<line x1="${100 + k}" y1="0" x2="${100 + k + 100}" y2="200"/>`; let ring = ''; for (let pass = 0; pass < 2; pass++) { let p = ''; for (let i = 0; i <= 40; i++) { const a = (i / 38) * 2 * Math.PI, r = 88 + (rnd() - 0.5) * 6; p += `${i ? 'L' : 'M'}${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)} `; } ring += `<path d="${p}" fill="none" stroke="#${c}" stroke-width="4" opacity="0.85"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><clipPath id="c"><circle cx="100" cy="100" r="86"/></clipPath></defs><g clip-path="url(#c)" stroke="#${c}" stroke-width="3" opacity="0.35">${h}</g>${ring}</svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Eskiz', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'markers', timeline: 'line' },
  bg: (ctx, s) => { s.background = { color: C.bg }; },
  panel: async (ctx, s, x, y, w, h, k) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); ctx.t.img(s, await svgOnce(ctx, `r${W2}x${H2}k${k}`, sketchRect(W2, H2), W2, H2), x, y, w, h); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'h' + (k % 6), hatchCircle(C.pal[k % 6]), 200, 200), x, y, d, d); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: C.pal[k % 6], align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { gray: true }), x, y, w, h, { alt: '' }); await K.panel(ctx, s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, 9); },
  connector: async (ctx, s, x, y, w) => { const W2 = Math.round(w * 100); ctx.t.img(s, await svgOnce(ctx, 'c' + W2, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="30"><path d="${wob(0, 15, W2 - 20, 15)} M${W2 - 34},5 L${W2 - 18},15 L${W2 - 34},25" fill="none" stroke="#666" stroke-width="2.5"/></svg>`, W2, 30), x, y - 0.15, w, 0.3); },
  axis: async (ctx, s, x, y, w) => { const W2 = Math.round(w * 100); ctx.t.img(s, await svgOnce(ctx, 'a' + W2, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="30"><path d="${wob(0, 15, W2, 15)} ${wob(0, 17, W2, 16)}" fill="none" stroke="#2F2F2F" stroke-width="2.5"/></svg>`, W2, 30), x, y + 0.02, w, 0.3); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'CCCCCC', 0.75, { dash: 'dash' }),
  bullet: (ctx, s, x, y, k) => ctx.t.text(s, '\u2192', { x: x - 0.04, y: y - 0.08, w: 0.3, h: 0.3, fontSize: 14, bold: true, color: C.pal[k ? 1 : 0] }),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.45, 0.33, 0.75, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: (i) => C.pal[i % 6], authorColor: C.accent, compareHead: (i) => C.pal[i ? 1 : 0],
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 0.75, 3.1, 3.4);
    await K.marker(ctx, s, 5.5, 3.75, 1.0, 0, ''); await K.marker(ctx, s, 8.75, 0.25, 0.8, 1, '');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.2, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.2, 2.1, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 5.0, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 5.0, h: 0.45, fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 90, slug: 'eskiz', name: 'Eskiz', category: 'minimalist', photos: true, build: (c, o) => run(c, o, K), style: { tone: "g'oya chizgisi kabi: sodda, tushuntiruvchi, qadam-baqadam; murakkabni oddiy qilib", limits: {}, prefer: null } };
