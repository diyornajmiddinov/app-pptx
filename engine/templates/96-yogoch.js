/** 96 Yog'och — woodwork: plank wall with grain, light birch boards screwed on as cards, burnt-in (pyrography) markers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '7A4E2D', ink: '3B2412', muted: '6B4A2E', accent: '9C3D16', board: 'EED9B8', pal: ['5C3317', '9C3D16', '3B5B3A', '7A4E2D', '8E6B2F', '4A3B5C'] };
const planks = () => { let g = '', x0 = 9; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let r = 0; r < 9; r++) { const y = r * 100, base = ['8A5A35', '7A4E2D', '93623B', '83552F'][r % 4]; g += `<rect x="0" y="${y}" width="1600" height="98" fill="#${base}"/>`;
    for (let k = 0; k < 7; k++) { const yy = y + 10 + rnd() * 80; g += `<path d="M0,${yy.toFixed(0)} C400,${(yy + (rnd() - 0.5) * 20).toFixed(0)} 900,${(yy + (rnd() - 0.5) * 20).toFixed(0)} 1600,${(yy + (rnd() - 0.5) * 16).toFixed(0)}" fill="none" stroke="#5C3317" stroke-opacity="0.18" stroke-width="2"/>`; }
    g += `<rect x="0" y="${y + 98}" width="1600" height="2" fill="#4A2B14"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${g}</svg>`; };
const screw = (t, s, x, y) => { t.oval(s, x, y, 0.12, 0.12, 'A7A9AC', { line: { color: '6D6E70', width: 0.75 } }); t.line(s, x + 0.02, y + 0.06, 0.08, 0, '6D6E70', 1); };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme("Yog'och", C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'table' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', planks(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, C.board, { shadow: 0.4, blur: 6, offset: 3, name: 'Birch board' }); t.line(s, x, y + h * 0.33, w, 0, 'E2C9A1', 1); t.line(s, x, y + h * 0.71, w, 0, 'E2C9A1', 1); if (h > 0.8) { screw(t, s, x + 0.08, y + 0.08); screw(t, s, x + w - 0.2, y + 0.08); screw(t, s, x + 0.08, y + h - 0.2); screw(t, s, x + w - 0.2, y + h - 0.2); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: '3B2412', width: 1 } }); ctx.t.oval(s, x + d * 0.08, y + d * 0.08, d * 0.84, d * 0.84, null, { line: { color: 'D9B48A', width: 0.75 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 24), bold: true, color: 'F3E3C8', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.16, y - 0.16, w + 0.32, h + 0.32, '5C3317', { shadow: 0.4, blur: 6, offset: 3, name: 'Wood frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  rule: (ctx, s, x, y, w) => {},
  title: (ctx, s, d) => { const { t, L } = ctx; K.panel(ctx, s, 0.45, 0.28, 9.1, 0.85, 0, {}); K.marker(ctx, s, 0.6, 0.35, 0.7, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.5, y: 0.3, w: 7.8, h: 0.8, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.8, 0.75, 28, 15, 'Cambria', true) }); },
  footer: metaFooter({ color: 'F3E3C8', font: 'Cambria' }),
  onBg: 'FFF3E0', onBgMuted: 'EBD5B5', onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'F3E3C8', authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  area: { x: 0.6, y: 1.45, w: 8.8, h: 3.5 },
  ways: (ctx, h, R) => {
    // ---- further ways to draw a type, in the workshop: a deck's pages must not look alike (L.pages)
    const { t, L } = ctx, { page, newSlide, panel, marker, photo } = h;
    const CREAM = 'FFF3E0', WAL = '4A2B14', foot = metaFooter({ color: 'F3E3C8', font: 'Cambria' });
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.ls || 1), lineSpacingMultiple: o.ls || 1, color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Cambria', bold: true, fontSize: L.fit(v, w, h2, o.max || 16, 10.5, 'Cambria', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const rings = (d) => svgOnce(ctx, 'rings', `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><circle cx="300" cy="300" r="298" fill="#3B2412"/><circle cx="300" cy="300" r="280" fill="#C9A26F"/>${[250, 215, 185, 150, 118, 86, 55, 28].map((r, i) => `<ellipse cx="${300 + i}" cy="${300 - i}" rx="${r}" ry="${r - 4}" fill="${i % 2 ? '#DDBC8C' : '#C49A63'}" stroke="#8A5A35" stroke-width="3"/>`).join('')}</svg>`, 600, 600);
    const walnut = (s, x, y, w, h2) => { t.rect(s, x, y, w, h2, WAL, { shadow: 0.4, blur: 6, offset: 3, name: 'Walnut board' }); t.line(s, x, y + h2 * 0.5, w, 0, '5C3317', 1); };
    const beam = (s, x, y, w, h2 = 0.2) => t.rect(s, x, y, w, h2, '3B2412', { shadow: 0.4, blur: 4, offset: 2, name: 'Beam' });
    const peg = (s, x, y, d, ic, k) => { K.marker(ctx, s, x, y, d, k, ''); return L.icon(ic, 'F3E3C8', 2).then((im) => t.img(s, im, x + d * 0.26, y + d * 0.26, d * 0.48, d * 0.48)); };
    const V = {
      image: [
        async (d) => { // a picture framed long over the bench, the text on a board under it
          const s = await page(d);
          await photo(s, d.image, 0.76, 1.47, 8.48, 1.8);
          await panel(s, 0.6, 3.6, 8.8, 1.5, 0);
          body(s, d.text, 0.9, 3.68, 8.2, 1.34, { max: 14, valign: 'middle' });
        },
        async (d) => { // the picture is the heart of a sawn log, the text on a walnut board
          const s = await page(d), dd = 3.65;
          t.img(s, await rings(), 5.75, 1.38, dd, dd, { alt: '' });
          t.img(s, await L.photo(L.src(d.image), dd - 0.5, dd - 0.5, { mask: 'circle' }), 6.0, 1.63, dd - 0.5, dd - 0.5, { alt: '' });
          walnut(s, 0.6, 1.5, 4.85, 3.5);
          body(s, d.text, 0.85, 1.62, 4.35, 3.26, { color: CREAM, max: 16, valign: 'middle', ls: 1.15 });
        },
        async (d) => { // the picture fills the page, a birch sign screwed on it
          const s = await newSlide('page');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.18, 10, 0.445, '3B2412', { name: 'Footer plank' });
          await panel(s, 5.05, 0.4, 4.5, 4.5, 0);
          K.marker(ctx, s, 0.5, 0.4, 0.7, ctx.idx, ctx.idx);
          head(s, d.title, 5.35, 0.55, 3.9, 1.05, { max: 22, color: C.accent });
          body(s, d.text, 5.35, 1.65, 3.9, 3.05, { max: 14, ls: 1.1 });
          foot(ctx, s);
        },
        async (d) => { // the picture seen through a picket fence
          const s = await page(d), n = 4, g = 0.03, w = (1 - g * (n - 1)) / n;
          let path = '';
          for (let i = 0; i < n; i++) { const a = i * (w + g), top = i % 2 ? 0.1 : 0; path += `M${a},1 L${a},${top + 0.11} L${a + w / 2},${top} L${a + w},${top + 0.11} L${a + w},1 Z `; }
          t.img(s, await L.photo(L.src(d.image), 4.2, 3.72, { mask: { path } }), 5.2, 1.32, 4.2, 3.72, { alt: '' });
          await panel(s, 0.6, 1.5, 4.3, 3.5, 0);
          body(s, d.text, 0.85, 1.65, 3.8, 3.2, { max: 15, valign: 'middle', ls: 1.1 });
        },
      ],
      cards: [
        async (d) => { // shelves: each item stands on its own, with brackets under it
          const s = await page(d), n = d.items.length, hh = 3.68 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.33 + i * hh, sh = y + hh - 0.14;
            await peg(s, 0.7, y + (hh - 0.14 - 0.56) / 2, 0.56, it.icon, i);
            head(s, it.h, 1.45, y, 2.5, hh - 0.16, { color: CREAM, max: 17 });
            body(s, it.t, 4.05, y, 5.35, hh - 0.16, { color: CREAM, valign: 'middle', max: 14 });
            beam(s, 0.6, sh, 8.8, 0.09);
            [1.0, 8.8].forEach((bx) => t.shape(s, 'RIGHT_TRIANGLE', { x: bx, y: sh + 0.09, w: 0.14, h: 0.05, fill: { color: '3B2412' }, objectName: 'Bracket' }));
          }
        },
        async (d) => { // signs hanging from a beam at two lengths of rope
          const s = await page(d), n = d.items.length, gap = 0.18, w = (8.8 - gap * (n - 1)) / n, hh = 2.72;
          beam(s, 0.45, 1.3, 9.1, 0.16);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = i % 2 ? 2.28 : 1.72;
            t.line(s, x + w / 2, 1.46, 0, y - 1.46 + 0.1, 'E2C9A1', 1.75);
            await panel(s, x, y, w, hh, i);
            t.oval(s, x + w / 2 - 0.05, y + 0.06, 0.1, 0.1, '3B2412');
            t.img(s, await L.icon(it.icon, C.pal[i % 6], 2), x + 0.22, y + 0.16, 0.36, 0.36);
            head(s, it.h, x + 0.16, y + 0.54, w - 0.32, 0.5, { max: 14 });
            body(s, it.t, x + 0.16, y + 1.06, w - 0.32, hh - 1.22, { max: 14, color: C.muted });
          }
        },
        async (d) => { // sawn log ends in a row, the words straight on the wall
          const s = await page(d), n = d.items.length, cw = 8.8 / n, dd = 1.3;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw;
            t.img(s, await rings(), x + cw / 2 - dd / 2, 1.3, dd, dd, { alt: '' });
            t.img(s, await L.icon(it.icon, '3B2412', 2.25), x + cw / 2 - 0.25, 1.7, 0.5, 0.5);
            head(s, it.h, x + 0.1, 2.65, cw - 0.2, 0.55, { color: CREAM, align: 'center', max: 15 });
            body(s, it.t, x + 0.1, 3.22, cw - 0.2, 1.85, { color: 'F3E3C8', align: 'center', max: 13 });
          }
        },
        async (d) => { // a chest: a tall door and drawers, or four drawers
          const s = await page(d), n = d.items.length, gap = 0.1, W2 = (8.8 - 0.2 - gap) / 2, H2 = (3.7 - 0.2 - gap) / 2, X = 0.7, Y = 1.4;
          t.rect(s, 0.6, 1.3, 8.8, 3.8, '3B2412', { shadow: 0.4, blur: 6, offset: 3, name: 'Chest' });
          for (const [i, it] of d.items.entries()) {
            const tall = n === 3 && i === 0, col = n === 3 ? (i ? 1 : 0) : i % 2, row = n === 3 ? Math.max(0, i - 1) : Math.floor(i / 2);
            const x = X + col * (W2 + gap), y = Y + row * (H2 + gap), hh = tall ? 3.5 : H2;
            t.rect(s, x, y, W2, hh, C.board, { line: { color: '8E6B2F', width: 1 }, name: 'Drawer' });
            t.oval(s, x + W2 - 0.34, y + 0.12, 0.17, 0.17, '7A4E2D', { line: { color: '3B2412', width: 1 } });
            t.img(s, await L.icon(it.icon, C.pal[i % 6], 2), x + 0.14, y + 0.1, tall ? 0.56 : 0.34, tall ? 0.56 : 0.34);
            head(s, it.h, x + (tall ? 0.14 : 0.56), y + (tall ? 0.72 : 0.06), W2 - (tall ? 0.3 : 1.0), tall ? 0.6 : 0.42, { max: tall ? 20 : 14 });
            body(s, it.t, x + 0.16, y + (tall ? 1.36 : 0.5), W2 - 0.32, hh - (tall ? 1.46 : 0.56), { max: tall ? 15 : 12.5, color: C.muted });
          }
        },
      ],
      process: [
        async (d) => { // a wooden staircase, a rise for every step
          const s = await page(d), n = d.steps.length, w = 8.8 / n, rise = n === 4 ? 0.5 : 0.65, base = 5.1;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * w, y = 1.4 + (n - 1 - i) * rise;
            t.rect(s, x, y, w, base - y, i % 2 ? 'E2C9A1' : C.board, { shadow: 0.3, blur: 5, offset: 2, name: 'Stair' });
            t.rect(s, x, y, w, 0.09, '3B2412', { name: 'Tread' });
            marker(s, x + 0.14, y + 0.17, 0.46, i, i + 1);
            head(s, st.h, x + 0.68, y + 0.13, w - 0.78, 0.54, { max: 13.5 });
            body(s, st.t, x + 0.14, y + 0.72, w - 0.26, base - y - 0.78, { max: 14 });
          });
        },
        async (d) => { // boards pegged to a post, left and right in turn
          const s = await page(d), n = d.steps.length, w = 4.05, cx = 5, H4 = [[1.35, 1.72], [1.8, 1.55], [3.15, 1.85], [3.45, 1.6]], H3 = [[1.35, 1.65], [2.1, 1.5], [3.15, 1.85]], B = n === 4 ? H4 : H3, ym = n === 4 ? [1.55, 2.4, 3.42, 4.28] : [1.7, 2.65, 3.75];
          t.rect(s, cx - 0.17, 1.28, 0.34, 3.85, '3B2412', { shadow: 0.4, blur: 5, offset: 2, name: 'Post' });
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? cx + 0.33 : cx - 0.33 - w, [y, hh] = B[i];
            await panel(s, x, y, w, hh, i);
            t.line(s, right ? cx : cx - 0.33, ym[i] + 0.21, 0.33, 0, 'E2C9A1', 2);
            marker(s, cx - 0.21, ym[i], 0.42, i, i + 1);
            head(s, st.h, x + 0.26, y + 0.1, w - 0.52, 0.42, { max: 15, align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.26, y + 0.52, w - 0.52, hh - 0.66, { max: 14, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // a carpenter's rule across the wall, a burnt mark for each step
          const s = await page(d), n = d.steps.length, cw = 8.8 / n;
          t.rect(s, 0.45, 1.5, 9.1, 0.44, 'E3B23C', { shadow: 0.4, blur: 4, offset: 2, name: 'Folding rule' });
          for (let m = 0; m <= 45; m++) t.line(s, 0.55 + m * 0.2, 1.5, 0, m % 5 ? 0.1 : 0.2, '3B2412', 0.75);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * cw;
            marker(s, x + 0.06, 1.42, 0.6, i, i + 1);
            head(s, st.h, x + 0.06, 2.12, cw - 0.25, 0.6, { color: CREAM, max: 16, valign: 'top' });
            body(s, st.t, x + 0.06, 2.75, cw - 0.25, 2.3, { color: 'F3E3C8', max: 14 });
          });
        },
        async (d) => { // boards with pointed ends, each cut a little further along
          const s = await page(d), n = d.steps.length, hh = 3.68 / n, sh = n === 4 ? 0.34 : 0.5;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * sh, w = 8.8 - (n - 1) * sh, y = 1.35 + i * hh;
            t.shape(s, 'PENTAGON', { x, y, w, h: hh - 0.1, fill: { color: i === n - 1 ? WAL : C.board }, shadow: { type: 'outer', color: '000000', opacity: 0.35, blur: 5, offset: 2, angle: 90 }, objectName: 'Board' });
            const ink = i === n - 1 ? CREAM : C.ink;
            t.text(s, String(i + 1), { x: x + 0.12, y, w: 0.5, h: hh - 0.1, fontFace: 'Cambria', bold: true, fontSize: 24, color: i === n - 1 ? 'E3B23C' : C.accent, align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.7, y + 0.03, w - 1.3, 0.33, { max: 14.5, color: ink });
            body(s, st.t, x + 0.7, y + 0.36, w - 1.3, hh - 0.5, { max: 12.5, color: ink });
          });
        },
      ],
      stats: [
        async (d) => { // numbers burnt on big log ends
          const s = await page(d), cw = 8.8 / 3, dd = 2.05;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * cw + (cw - dd) / 2;
            t.img(s, await rings(), px, 1.28, dd, dd, { alt: '' });
            t.text(s, x.value, { x: px + 0.28, y: 1.78, w: dd - 0.56, h: 1.05, fontFace: 'Cambria', bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd - 0.6, 0.95, 30, 12, 'Cambria', true) });
            body(s, x.label, 0.6 + i * cw + 0.12, 3.38, cw - 0.24, 0.72, { align: 'center', color: CREAM, max: 13 });
          }
          if (d.note) body(s, d.note, 0.6, 4.16, 8.8, 0.92, { max: 11.5, color: 'F3E3C8', align: 'center' });
        },
        async (d) => { // one number on a dark slab, two on small boards beside it
          const s = await page(d), [a, ...rest] = d.stats;
          walnut(s, 0.6, 1.4, 4.2, 3.65);
          t.text(s, a.value, { x: 0.8, y: 1.55, w: 3.8, h: 1.65, fontFace: 'Cambria', bold: true, color: 'E3B23C', align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.7, 1.5, 66, 24, 'Cambria', true) });
          body(s, a.label, 1.0, 3.3, 3.4, 1.5, { color: CREAM, align: 'center', max: 15 });
          for (const [i, x] of rest.entries()) {
            const y = 1.4 + i * 1.05;
            await panel(s, 5.05, y, 4.35, 0.95, i);
            t.text(s, x.value, { x: 5.25, y, w: 1.7, h: 0.95, fontFace: 'Cambria', bold: true, color: C.pal[i + 1], valign: 'middle', fontSize: L.fit(x.value, 1.65, 0.8, 26, 13, 'Cambria', true) });
            body(s, x.label, 7.0, y + 0.08, 2.2, 0.8, { max: 11.5, valign: 'middle' });
          }
          if (d.note) body(s, d.note, 5.05, 3.55, 4.35, 1.5, { max: 12, color: CREAM, valign: 'middle' });
        },
        async (d) => { // three planks laid across, dark and light by turn
          const s = await page(d), rh = d.note ? 0.95 : 1.15;
          d.stats.forEach((x, i) => {
            const y = 1.35 + i * rh, dark = i === 1;
            t.rect(s, 0.3 + (dark ? 0.6 : 0), y, 9.4 - (dark ? 0.6 : 0), rh - 0.08, dark ? WAL : C.board, { shadow: 0.35, blur: 5, offset: 2, name: 'Plank' });
            t.text(s, x.value, { x: 1.1, y, w: 3.1, h: rh - 0.08, fontFace: 'Cambria', bold: true, color: dark ? 'E3B23C' : C.accent, valign: 'middle', fontSize: L.fit(x.value, 3.0, rh - 0.2, 40, 16, 'Cambria', true) });
            body(s, x.label, 4.4, y + 0.04, 5.0, rh - 0.16, { color: dark ? CREAM : C.ink, valign: 'middle', max: 15 });
          });
          if (d.note) body(s, d.note, 0.6, 4.2, 8.8, 0.9, { max: 12, color: 'F3E3C8', valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // two sides held in a vice: mirrored about a screw post
          const s = await page(d), w = 3.95, cx = 5;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, 'Calibri', 0.14, 2.92);
          head(s, d.left.h, 0.6, 1.3, w, 0.6, { align: 'right', color: CREAM, max: 19 }); head(s, d.right.h, 5.45, 1.3, w, 0.6, { color: 'FFD58A', max: 19 });
          t.rect(s, cx - 0.1, 1.3, 0.2, 3.8, 'A7A9AC', { line: { color: '6D6E70', width: 0.75 }, name: 'Vice screw' });
          for (let m = 0; m < 19; m++) t.line(s, cx - 0.1, 1.38 + m * 0.2, 0.2, 0.06, '6D6E70', 0.75);
          let y = 2.0;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) t.text(s, d.left.items[j], { x: 0.6, y, w, h: rh, fontSize: fs, color: CREAM, align: 'right' });
            if (d.right.items[j]) t.text(s, d.right.items[j], { x: 5.45, y, w, h: rh, fontSize: fs, color: CREAM });
            y += rh;
          });
        },
        async (d) => { // a birch band over a walnut band, the head set in the end grain
          const s = await page(d), hh = 1.8;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.33 + i * (hh + 0.1), dark = i === 1, ink = dark ? CREAM : C.ink;
            t.rect(s, 0, y, 10, hh, dark ? WAL : C.board, { shadow: 0.35, blur: 5, offset: 2, name: 'Band' });
            t.rect(s, 0.6, y, 2.45, hh, dark ? '3B2412' : 'D9B48A', { name: 'End grain' });
            head(s, side.h, 0.75, y + 0.1, 2.15, hh - 0.2, { max: 20, color: ink });
            const { rows, fs } = L.rowsFit([side.items.filter((_, j) => j % 2 === 0), side.items.filter((_, j) => j % 2)], 13, 3.0, 'Calibri', 0.1, hh - 0.2);
            side.items.forEach((it, j) => t.text(s, it, { x: 3.25 + (j % 2) * 3.15, y: y + 0.1 + (Math.floor(j / 2) ? rows[0] : 0), w: 3.0, h: rows[Math.floor(j / 2)], fontSize: fs, color: ink }));
          });
        },
      ],
      statement: [
        async (d) => { // large words straight on the wall, the note on a hanging tag
          const s = await page(d, 'focus');
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.35, w: 5.5, h: 3.7, fontFace: 'Cambria', bold: true, color: CREAM, valign: 'middle', fontSize: L.fit(d.text, 5.5, 3.6, 36, 16, 'Cambria', true) });
          beam(s, 6.3, 1.3, 3.25, 0.14);
          t.line(s, 7.1, 1.44, 0, 0.3, 'E2C9A1', 1.75); t.line(s, 8.75, 1.44, 0, 0.3, 'E2C9A1', 1.75);
          await panel(s, 6.4, 1.72, 3.05, 3.35, 0);
          if (d.caption) body(s, d.caption, 6.62, 1.95, 2.61, 2.9, { max: 14, valign: 'middle', color: C.muted });
        },
        async (d) => { // the note on a narrow board, the thought burnt in a slab that runs off the page
          const s = await page(d);
          if (d.caption) { await panel(s, 0.6, 1.35, 8.8, 1.32, 0); body(s, d.caption, 0.9, 1.42, 8.2, 1.18, { max: 13.5, valign: 'middle' }); }
          t.rect(s, 0, 2.82, 10, 2.32, WAL, { shadow: 0.4, blur: 6, offset: 3, name: 'Slab' });
          t.line(s, 0, 2.95, 10, 0, '5C3317', 1); t.line(s, 0, 5.0, 10, 0, '5C3317', 1);
          t.text(s, L.runs(d.text), { x: 0.6, y: 2.98, w: 8.8, h: 2.0, fontFace: 'Cambria', bold: true, color: 'FFD58A', valign: 'middle', fontSize: L.fit(d.text, 8.8, 1.95, 34, 16, 'Cambria', true) });
        },
      ],
      timeline: [
        async (d) => { // a long beam with four burns on it, events above and below by turn
          const s = await page(d), ly = 3.12, w = 3.7, xs = [0.6, 1.2, 5.1, 5.7], cream = { color: CREAM };
          beam(s, 0.3, ly, 9.4, 0.14);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.3 : ly + 0.28;
            t.oval(s, x + 0.02, ly - 0.08, 0.3, 0.3, C.accent, { line: { color: 'F3E3C8', width: 1.5 } });
            t.text(s, [{ text: it.year + '   ', options: { color: 'FFD58A', bold: true } }, { text: it.h, options: { color: CREAM, bold: true } }], { x, y, w, h: 0.42, fontFace: 'Cambria', fontSize: L.fit(`${it.year}   ${it.h}`, w, 0.38, 16, 10.5, 'Cambria', true), valign: 'middle' });
            body(s, it.t, x, y + 0.43, w, up ? 1.25 : 1.05, { ...cream, max: 13.5 });
          });
        },
        async (d) => { // a fence of pickets, a burnt year at the head of each
          const s = await page(d), gap = 0.12, w = (8.8 - gap * 3) / 4;
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap), y = i % 2 ? 1.58 : 1.3, tip = 0.34, y2 = y + tip;
            t.shape(s, 'ISOSCELES_TRIANGLE', { x, y, w, h: tip, fill: { color: C.board }, objectName: 'Picket tip' });
            t.rect(s, x, y2, w, 5.12 - y2, C.board, { name: 'Picket' });
            t.text(s, it.year, { x: x + 0.1, y: y2 - 0.02, w: w - 0.2, h: 0.46, fontFace: 'Cambria', bold: true, color: C.accent, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.24, 0.42, 22, 11, 'Cambria', true) });
            head(s, it.h, x + 0.12, y2 + 0.45, w - 0.24, 0.48, { max: 14, align: 'center' });
            body(s, it.t, x + 0.12, y2 + 0.95, w - 0.24, 5.08 - y2 - 0.95, { max: 14, align: 'center' });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old board columns look like the cards
    R.stats = V.stats.shift(); // and so do the old stat tiles
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    K.panel(ctx, s, 0.55, 0.6, 5.6, 4.2, 0, {});
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.85, y: 0.85, w: 5.0, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.accent });
    t.text(s, d.title, { x: 0.85, y: 1.2, w: 5.0, h: 2.1, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.0, 2.0, 38, 18, 'Cambria', true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.35, w: 5.0, h: 0.7, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.85, y: 4.1, w: 5.0, h: 0.45, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.ink });
    if (d.image) await K.photo(ctx, s, d.image, 6.65, 0.85, 2.75, 3.6);
    metaFooter({ color: 'F3E3C8', font: 'Cambria' })(ctx, s);
  },
};
module.exports = { id: 96, slug: 'yogoch', name: "Yoğoç", category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "hunarmand kabi: puxta, tabiiy, qo'l mehnatiga hurmat; sodda va iliq", limits: {}, prefer: null } };
