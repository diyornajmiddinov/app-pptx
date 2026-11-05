/** 99 Osmon — sky: day-sky gradient, soft clouds, cloud-topped cards, sun markers, a horizon line. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'D6ECFA', ink: '17324D', muted: '4A6A86', accent: 'F59E0B', pal: ['F59E0B', '3B82F6', '10B981', 'EF4444', '8B5CF6', '06B6D4'] };
const sky = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC3F2"/><stop offset="1" stop-color="#E8F5FE"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="6"/></filter></defs><rect width="1600" height="900" fill="url(#g)"/><g fill="#fff" opacity="0.85" filter="url(#b)">
  <g transform="translate(120 110)"><circle cx="60" cy="40" r="40"/><circle cx="110" cy="30" r="50"/><circle cx="170" cy="45" r="38"/><rect x="40" y="40" width="160" height="40" rx="20"/></g>
  <g transform="translate(1180 70) scale(1.3)"><circle cx="60" cy="40" r="40"/><circle cx="110" cy="30" r="50"/><circle cx="170" cy="45" r="38"/><rect x="40" y="40" width="160" height="40" rx="20"/></g>
  <g transform="translate(700 760) scale(1.6)"><circle cx="60" cy="40" r="40"/><circle cx="110" cy="30" r="50"/><circle cx="170" cy="45" r="38"/><rect x="40" y="40" width="160" height="40" rx="20"/></g></g></svg>`;
const cloudTop = (w) => { const n = Math.max(3, Math.round(w / 70)); let c = ''; for (let k = 0; k < n; k++) c += `<circle cx="${(k + 0.5) * w / n}" cy="${30 + (k % 2) * 6}" r="${w / n * 0.62}" fill="#fff"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="60">${c}</svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Osmon', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'markers', timeline: 'line' },
  area: { x: 0.6, y: 1.5, w: 8.8, h: 3.45 },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'sky', sky(), 1600, 900, true) }; },
  panel: async (ctx, s, x, y, w, h, k, o) => { const W2 = Math.round(w * 100); ctx.t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.2, t: 8, shadow: 0.12, blur: 10, offset: 3, shadowColor: '3B82F6', name: 'Cloud card' }); if (!o.big && !o.compare) ctx.t.img(s, await svgOnce(ctx, 'ct' + W2, cloudTop(W2), W2, 60), x, y - 0.3, w, 0.6); },
  marker: (ctx, s, x, y, d, k, label) => { if (k % 6 === 0) { for (let r = 0; r < 8; r++) { const a = r * Math.PI / 4, cx = x + d / 2, cy = y + d / 2; ctx.t.line(s, cx + Math.cos(a) * d * 0.55 - (Math.cos(a) < 0 ? 0 : 0), cy + Math.sin(a) * d * 0.55, Math.cos(a) * d * 0.12 || 0.001, Math.sin(a) * d * 0.12 || 0.001, C.accent, 2); } } ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: 'FFFFFF', width: 2 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, 'FFFFFF', { r: 0.25, shadow: 0.15, blur: 10, offset: 3, name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.12 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'FFFFFF', 3, { dash: 'dash' }),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, 'FFFFFF', 3),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.55, 0.42, 0.62, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.45, y: 0.38, w: 8.0, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'FFFFFF', authorColor: C.pal[1],
  ways: (ctx, h, R) => {
    // ---- further ways to draw a type, in the open sky: a deck's pages must not look alike (L.pages)
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const NAVY = '17324D', SUN = 'F59E0B', WH = 'FFFFFF', foot = metaFooter({ color: C.muted });
    const CL = 'M0.2,0.92 C0.03,0.92 -0.01,0.6 0.17,0.54 C0.14,0.24 0.42,0.08 0.52,0.3 C0.63,0.06 0.92,0.2 0.85,0.52 C1.02,0.56 1.01,0.92 0.82,0.92 Z';
    const cloud = (key, w, h2, fill = '#FFFFFF', op = 1) => svgOnce(ctx, `cl${key}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h2}" viewBox="0 0 1 1" preserveAspectRatio="none"><path d="${CL}" fill="${fill}" opacity="${op}"/></svg>`, w, h2);
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.ls || 1), lineSpacingMultiple: o.ls || 1, color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const pill = (s, x, y, w, h2) => t.rect(s, x, y, w, h2, WH, { r: Math.min(0.4, h2 / 2), t: 8, shadow: 0.12, blur: 10, offset: 3, shadowColor: '3B82F6', name: 'Cloud' });
    const sun = (s, cx, cy, r, rays = 12) => { for (let a = 0; a < rays; a++) { const q = a * 2 * Math.PI / rays, c = Math.cos(q), e = Math.sin(q), x1 = cx + c * r * 1.14, y1 = cy + e * r * 1.14, dx = c * r * 0.26, dy = e * r * 0.26; t.line(s, Math.min(x1, x1 + dx), Math.min(y1, y1 + dy), Math.abs(dx) || 0.001, Math.abs(dy) || 0.001, SUN, 2.5, (dx > 0) !== (dy > 0) && Math.abs(dx) > 0.01 && Math.abs(dy) > 0.01 ? { flipV: true } : {}); } t.oval(s, cx - r, cy - r, 2 * r, 2 * r, 'FDE68A'); t.oval(s, cx - r * 0.84, cy - r * 0.84, 2 * r * 0.84, 2 * r * 0.84, SUN); };
    const V = {
      image: [
        async (d) => { // the picture cut in the shape of a big cloud, the words on the open sky
          const s = await page(d), w = 5.2, hh = 3.7;
          t.img(s, await cloud('sh', 1040, 740, '#FFFFFF', 0.9), 4.42, 1.32, w + 0.16, hh + 0.12, { alt: '' });
          t.img(s, await L.photo(L.src(d.image), w, hh, { mask: { path: CL } }), 4.5, 1.38, w, hh, { alt: '' });
          body(s, d.text, 0.6, 1.5, 3.85, 3.5, { max: 15, valign: 'middle', ls: 1.1 });
        },
        async (d) => { // the picture rises as a sun over the horizon, the words in the sky above it
          const s = await page(d), w = 4.8, hh = 2.4, x = 2.6, y = 2.72, cx = 5, base = 5.12;
          for (let a = 1; a < 12; a++) { const q = Math.PI + a * Math.PI / 12, c = Math.cos(q), e = Math.sin(q), x1 = cx + c * 2.54, y1 = base + e * 2.54 * (hh / 2.4), dx = c * 0.22, dy = e * 0.22; t.line(s, Math.min(x1, x1 + dx), Math.min(y1, y1 + dy), Math.abs(dx) || 0.001, Math.abs(dy) || 0.001, SUN, 2.5, dx > 0 ? {} : { flipV: true }); }
          t.img(s, await L.photo(L.src(d.image), w, hh, { mask: { path: 'M0,1 C0,0.42 0.22,0 0.5,0 C0.78,0 1,0.42 1,1 Z' } }), x, y, w, hh, { alt: '' });
          t.line(s, 0, base, 10, 0, WH, 3);
          body(s, d.text, 0.6, 1.25, 8.8, 1.2, { max: 14, valign: 'middle' });
        },
        async (d) => { // three cabin windows, the view outside them, the words on a cloud card
          const s = await page(d), w = 4.6, hh = 3.6;
          let path = '';
          [[0, 0.3], [0.35, 0.65], [0.7, 1]].forEach(([a, b]) => { path += `M${a},0.14 C${a},0.02 ${b},0.02 ${b},0.14 L${b},0.86 C${b},0.98 ${a},0.98 ${a},0.86 Z `; });
          t.rect(s, 0.45, 1.35, w + 0.3, hh + 0.1, 'F4F9FD', { r: 0.2, shadow: 0.15, blur: 10, offset: 3, name: 'Cabin wall' });
          t.img(s, await L.photo(L.src(d.image), w, hh, { mask: { path } }), 0.6, 1.4, w, hh, { alt: '' });
          await panel(s, 5.55, 1.45, 3.85, 3.4, 1, { text: true });
          body(s, d.text, 5.75, 1.6, 3.45, 3.1, { max: 14, valign: 'middle' });
        },
        async (d) => { // the picture fills the page, a long white cloud drifts across its foot
          const s = await newSlide('page');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.18, 10, 0.445, NAVY, { name: 'Footer strip' });
          K.marker(ctx, s, 0.55, 0.42, 0.62, ctx.idx, ctx.idx);
          t.rect(s, 1.4, 0.38, 6.6, 0.75, WH, { r: 0.3, t: 8, name: 'Cloud' });
          head(s, d.title, 1.7, 0.4, 6.0, 0.7, { max: 18 });
          t.rect(s, 0.5, 2.95, 9, 2.05, WH, { r: 0.35, t: 6, shadow: 0.15, blur: 10, offset: 3, name: 'Cloud' });
          body(s, d.text, 0.85, 3.08, 8.3, 1.8, { max: 15, valign: 'middle' });
          metaFooter({ color: 'E8F5FE' })(ctx, s);
        },
      ],
      cards: [
        async (d) => { // balloons at two heights, each carrying an item's icon
          const s = await page(d), n = d.items.length, cw = 8.8 / n, dd = 0.92;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, cx = x + cw / 2, y = i % 2 ? 1.5 : 1.2;
            t.oval(s, cx - dd / 2, y, dd, dd * 1.08, C.pal[i % 6], { line: { color: WH, width: 2 }, name: 'Balloon' });
            t.line(s, cx - 0.12, y + dd * 1.05, 0.08, 0.2, NAVY, 0.75); t.line(s, cx + 0.04, y + dd * 1.05, 0.08, 0.2, NAVY, 0.75, { flipV: true });
            t.rect(s, cx - 0.12, y + dd * 1.05 + 0.2, 0.24, 0.12, '7C4A21', { name: 'Basket' });
            t.img(s, await L.icon(it.icon, i % 6 === 0 ? NAVY : WH, 2), cx - 0.21, y + 0.24, 0.42, 0.42);
            head(s, it.h, x + 0.1, 2.85, cw - 0.2, 0.5, { align: 'center', max: 15 });
            body(s, it.t, x + 0.1, 3.36, cw - 0.2, 1.72, { align: 'center', max: 13.5 });
          }
        },
        async (d) => { // long clouds drifting, shifted left and right by turn
          const s = await page(d), n = d.items.length, hh = 3.62 / n, w = 8.2;
          for (const [i, it] of d.items.entries()) {
            const x = i % 2 ? 1.2 : 0.6, y = 1.42 + i * hh, kh = hh - 0.1, dd = Math.min(0.6, kh - 0.14);
            pill(s, x, y, w, kh);
            t.oval(s, x + 0.2, y + (kh - dd) / 2, dd, dd, C.pal[i % 6]);
            t.img(s, await L.icon(it.icon, i % 6 === 0 ? NAVY : WH, 2), x + 0.2 + dd * 0.24, y + (kh - dd) / 2 + dd * 0.24, dd * 0.52, dd * 0.52);
            head(s, it.h, x + 0.95, y + 0.03, 2.2, kh - 0.06, { max: 14 });
            body(s, it.t, x + 3.25, y + 0.05, w - 3.6, kh - 0.1, { color: C.muted, valign: 'middle', max: 13 });
          }
        },
        async (d) => { // layers of the air, deep blue above, thin and pale near the ground
          const s = await page(d), n = d.items.length, hh = 3.9 / n, fills = n === 4 ? ['17324D', '1E5FA8', '9CCBEF', 'E8F5FE'] : ['17324D', '1E5FA8', 'CDE6F8'], light = (i) => i < 2;
          for (const [i, it] of d.items.entries()) {
            const y = 1.27 + i * hh, ink = light(i) ? WH : NAVY;
            t.rect(s, 0, y, 10, hh, fills[i], { name: 'Air layer' });
            t.img(s, await L.icon(it.icon, light(i) ? 'FDE68A' : NAVY, 2), 0.65, y + hh / 2 - 0.22, 0.44, 0.44);
            head(s, it.h, 1.3, y + 0.04, 2.5, hh - 0.08, { color: ink, max: 15 });
            body(s, it.t, 3.95, y + 0.05, 5.45, hh - 0.1, { color: ink, valign: 'middle', max: 13.5 });
          }
        },
        async (d) => { // the sun in the middle, everything else shining round it
          const s = await page(d), n = d.items.length, w = 3.8, hh = 1.75, cx = 5, cy = 3.22;
          sun(s, cx, cy, 0.4);
          for (const [i, it] of d.items.entries()) {
            const tall = n === 3 && i === 2, col = n === 3 ? (i === 2 ? 1 : 0) : i % 2, row = n === 3 ? (i === 2 ? 0 : i) : Math.floor(i / 2), x = col ? 5.6 : 0.6, y = 1.35 + row * (hh + 0.1), ht = tall ? 2 * hh + 0.1 : hh;
            t.rect(s, x, y, w, ht, WH, { r: 0.2, t: 8, shadow: 0.12, blur: 10, offset: 3, shadowColor: '3B82F6', name: 'Cloud card' });
            t.img(s, await L.icon(it.icon, '1E5FA8', 2), x + 0.2, y + 0.14, 0.36, 0.36);
            head(s, it.h, x + 0.66, y + 0.1, w - 0.82, 0.44, { max: 14.5 });
            body(s, it.t, x + 0.2, y + 0.58, w - 0.4, ht - 0.68, { color: C.muted, max: tall ? 15 : 13 });
          }
        },
      ],
      process: [
        async (d) => { // a flight path climbing, a stop on it for each step, its words under it
          const s = await page(d), n = d.steps.length, cw = 8.8 / n, top = 1.32, rise = n === 4 ? 0.5 : 0.62;
          t.img(s, await svgOnce(ctx, `path${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="200" viewBox="0 0 880 200"><path d="M0,${200} C300,${190} 600,${110} 880,10" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="14 10"/></svg>`, 880, 200), 0.6, top + 0.1, 8.8, (n - 1) * rise + 0.3, { alt: '' });
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * cw, y = top + (n - 1 - i) * rise;
            marker(s, x, y, 0.56, i, i + 1);
            head(s, st.h, x, y + 0.62, cw - 0.2, 0.46, { max: 14.5, valign: 'top' });
            body(s, st.t, x, y + 1.08, cw - 0.2, 5.08 - y - 1.08, { max: 13 });
          });
        },
        async (d) => { // read upwards: the first step on the ground, the last in the high air
          const s = await page(d), n = d.steps.length, hh = 3.7 / n;
          t.line(s, 0.87, 1.4, 0, 3.55, WH, 3);
          t.shape(s, 'ISOSCELES_TRIANGLE', { x: 0.75, y: 1.28, w: 0.24, h: 0.24, fill: { color: WH }, objectName: 'Up' });
          d.steps.forEach((st, i) => {
            const y = 1.35 + (n - 1 - i) * hh, x = 1.35 + i * (n === 4 ? 0.4 : 0.55), dd = 0.54;
            marker(s, 0.6, y + (hh - dd) / 2, dd, i, i + 1);
            head(s, st.h, x, y + 0.02, 9.4 - x, 0.34, { max: 15 });
            body(s, st.t, x, y + 0.36, 9.4 - x, hh - 0.42, { max: 13.5 });
          });
        },
        async (d) => { // sky and ground: steps above and below the horizon by turn
          const s = await page(d), n = d.steps.length, ly = 3.2, w = n === 4 ? 3.75 : 4.2, xs = n === 4 ? [0.6, 1.25, 5.0, 5.65] : [0.6, 2.9, 5.2];
          t.rect(s, 0, ly, 10, 2.0, 'CFE8C5', { name: 'Ground' });
          t.line(s, 0, ly, 10, 0, '4B8F4B', 2.5);
          d.steps.forEach((st, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.35 : ly + 0.3;
            marker(s, x, ly - 0.2, 0.4, i, i + 1);
            head(s, st.h, x, y, w, 0.36, { max: 14.5 });
            body(s, st.t, x, y + 0.36, w, up ? 1.25 : 1.2, { max: 13 });
          });
        },
      ],
      stats: [
        async (d) => { // one number on a great sun, the other two on clouds
          const s = await page(d), [a, ...rest] = d.stats, r = 1.45, cx = 2.25, cy = 3.05;
          sun(s, cx, cy, r, 16);
          t.text(s, a.value, { x: cx - r * 0.76, y: cy - 0.72, w: r * 1.52, h: 0.92, fontFace: 'Arial', bold: true, color: NAVY, align: 'center', valign: 'middle', fontSize: L.fit(a.value, r * 1.48, 0.85, 44, 16, 'Arial', true) });
          body(s, a.label, cx - r * 0.72, cy + 0.2, r * 1.44, 0.72, { color: NAVY, align: 'center', max: 12 });
          for (const [i, x] of rest.entries()) {
            const y = 1.33 + i * 1.12;
            pill(s, 4.3, y, 5.1, 1.03);
            t.text(s, x.value, { x: 4.55, y, w: 1.9, h: 1.03, fontFace: 'Arial', bold: true, color: '1E5FA8', valign: 'middle', fontSize: L.fit(x.value, 1.85, 0.8, 26, 13, 'Arial', true) });
            body(s, x.label, 6.5, y + 0.08, 2.7, 0.87, { valign: 'middle', max: 12.5, color: C.muted });
          }
          if (d.note) body(s, d.note, 4.3, 3.6, 5.1, 1.5, { max: 13, valign: 'middle' });
        },
        async (d) => { // three white clouds floating at their own heights
          const s = await page(d), cw = 8.8 / 3, H2 = 2.2, ys = [1.28, 1.72, 1.28];
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * cw, y = ys[i];
            t.img(s, await cloud('st', 900, 660), px - 0.05, y, cw + 0.1, H2, { alt: '' });
            t.text(s, x.value, { x: px + 0.42, y: y + 0.72, w: cw - 0.84, h: 0.8, fontFace: 'Arial', bold: true, color: '1E5FA8', align: 'center', valign: 'middle', fontSize: L.fit(x.value, cw - 0.9, 0.72, 34, 14, 'Arial', true) });
            body(s, x.label, px + 0.1, y + H2 + 0.0, cw - 0.2, 0.62, { align: 'center', max: 12.5 });
          }
          if (d.note) body(s, d.note, 0.6, 4.55, 8.8, 0.6, { max: 12, color: C.muted, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // clear and overcast: the two skies meet down the middle of the page
          const s = await page(d), w = 5;
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i * w, dark = i === 1, ink = dark ? 'F2F7FB' : NAVY, n = side.items.length;
            t.rect(s, x, 1.25, w, 3.92, dark ? '34506B' : 'FFF7DF', { name: dark ? 'Overcast' : 'Clear' });
            if (dark) t.img(s, await cloud('ov', 300, 200, '#C9D6E2'), x + 0.45, 1.36, 0.8, 0.58, { alt: '' }); else sun(s, x + 0.9, 1.68, 0.2, 10);
            head(s, side.h, x + 1.35, 1.34, w - 1.85, 0.62, { color: ink, max: 19 });
            const { rows, fs } = L.rowsFit([side.items], 14, w - 1.05, 'Calibri', 0.14, 3.02);
            let y = 2.08;
            side.items.forEach((it, j) => { t.text(s, it, { x: x + 0.55, y, w: w - 1.05, h: rows[j], fontSize: fs, color: ink }); y += rows[j]; });
          }
        },
        async (d) => { // one above the clouds, one below them, a bank of cloud between
          const s = await page(d), bank = 3.0;
          const cols = (side, y, hh, c) => {
            head(s, side.h, 0.6, y, 2.3, hh, { color: c, max: 20, valign: 'top' });
            const a = side.items.filter((_, j) => j % 2 === 0), b = side.items.filter((_, j) => j % 2), { rows, fs } = L.rowsFit([a, b], 13.5, 3.05, 'Calibri', 0.12, hh);
            side.items.forEach((it, j) => t.text(s, it, { x: 3.1 + (j % 2) * 3.25, y: y + (j > 1 ? rows[0] : 0), w: 3.05, h: rows[Math.floor(j / 2)], fontSize: fs, color: NAVY }));
          };
          cols(d.left, 1.35, 1.5, NAVY);
          t.img(s, await svgOnce(ctx, 'bank', cloudTop(1000), 1000, 60), 0, bank, 10, 0.4, { alt: '' });
          t.rect(s, 0, bank + 0.2, 10, 1.95, WH, { name: 'Below the clouds' });
          cols(d.right, 3.55, 1.5, '1E5FA8');
        },
      ],
      statement: [
        async (d) => { // large words on the open sky, the sun coming in from the corner
          const s = await page(d, 'focus');
          sun(s, 8.5, 2.35, 0.75, 16);
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 6.85, h: 2.45, fontFace: 'Arial', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 6.85, 2.35, 38, 16, 'Arial', true) });
          t.line(s, 0.6, 3.85, 8.8, 0, WH, 2.5);
          if (d.caption) body(s, d.caption, 0.6, 3.95, 8.8, 1.15, { max: 13.5, color: C.muted });
        },
        async (d) => { // the night sky: stars, a moon, pale words
          const s = await newSlide('focus');
          t.rect(s, 0, 0, 10, 5.625, '0F2238', { name: 'Night' });
          const stars = [[0.5, 1.6], [1.4, 4.7], [2.8, 1.3], [3.9, 4.75], [5.6, 1.25], [6.7, 4.8], [7.6, 1.45], [9.2, 4.2], [9.5, 2.9], [0.3, 3.4]];
          stars.forEach(([x, y], i) => t.oval(s, x, y, i % 3 ? 0.05 : 0.08, i % 3 ? 0.05 : 0.08, 'FDE68A'));
          t.oval(s, 8.3, 0.25, 0.95, 0.95, 'FDE68A'); t.oval(s, 8.05, 0.2, 0.9, 0.9, '0F2238');
          K.marker(ctx, s, 0.55, 0.42, 0.62, ctx.idx, ctx.idx);
          if (d.title) head(s, d.title, 1.45, 0.38, 6.4, 0.72, { color: WH, max: 24 });
          t.text(s, L.runs(d.text), { x: 1.0, y: 1.45, w: 8.0, h: 2.1, fontFace: 'Arial', bold: true, color: 'FDE68A', align: 'center', valign: 'middle', fontSize: L.fit(d.text, 8.0, 2.0, 34, 16, 'Arial', true) });
          if (d.caption) body(s, d.caption, 1.0, 3.62, 8.0, 1.25, { max: 14, color: 'DCE8F2', align: 'center', valign: 'middle' });
          metaFooter({ color: 'C5D4E2' })(ctx, s);
        },
      ],
      timeline: [
        async (d) => { // a contrail down the middle of the page, suns on it, events to each side
          const s = await page(d), cx = 5, w = 4.05, ym = [1.42, 2.28, 3.16, 4.02], yy = [1.35, 1.75, 3.2, 3.6];
          t.line(s, cx, 1.3, 0, 3.82, WH, 3, { dash: 'dash' });
          d.items.forEach((it, i) => {
            const right = i % 2 === 1, x = right ? cx + 0.35 : cx - 0.35 - w, a = right ? 'left' : 'right', y = yy[i];
            marker(s, cx - 0.2, ym[i], 0.4, i, '');
            t.text(s, [{ text: it.year + '   ', options: { color: '1E5FA8', bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x, y, w, h: 0.4, fontFace: 'Arial', fontSize: L.fit(`${it.year}   ${it.h}`, w, 0.36, 15, 10, 'Arial', true), align: a, valign: 'middle' });
            body(s, it.t, x, y + 0.41, w, 1.05, { max: 13, align: a });
          });
        },
        async (d) => { // a small cloud carries each year, its words beside it
          const s = await page(d), w = 4.3, hh = 1.82;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + (i % 2) * (w + 0.2), y = 1.3 + Math.floor(i / 2) * hh + (i % 2 ? 0.1 : 0), cw = 1.65, ch = 1.1;
            t.img(s, await cloud('yr', 500, 320), x - 0.05, y, cw, ch, { alt: '' });
            t.text(s, it.year, { x: x + 0.18, y: y + 0.42, w: cw - 0.46, h: 0.45, fontFace: 'Arial', bold: true, color: '1E5FA8', align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.5, 0.42, 16, 9, 'Arial', true) });
            head(s, it.h, x + cw + 0.02, y + 0.04, w - cw - 0.02, 0.5, { max: 14.5, valign: 'top' });
            body(s, it.t, x + cw + 0.02, y + 0.5, w - cw - 0.02, hh - 0.56, { max: 12.5 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.oval(s, 7.9, 0.25, 1.5, 1.5, 'FDE68A'); t.oval(s, 8.05, 0.4, 1.2, 1.2, 'F59E0B');
    if (d.image) await K.photo(ctx, s, d.image, 5.9, 1.4, 3.4, 2.9);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.7, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: '1E5FA8' });
    t.text(s, d.title, { x: 0.6, y: 1.05, w: 5.0, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.0, 2.1, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 4.9, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.25, w: 4.9, h: 0.45, fontSize: 16, bold: true, color: '1E5FA8' });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 99, slug: 'osmon', name: 'Osmon', category: 'minimalist', photos: true, build: (c, o) => run(c, o, K), style: { tone: "yengil va ochiq: keng ufq, umid va imkoniyat; sodda, tiniq tushuntirish", limits: {}, prefer: null } };
