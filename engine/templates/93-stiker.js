/** 93 Stiker — sticker sheet: die-cut stickers with thick white borders and drop shadows, star and blob stickers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FFE8D6', ink: '2D1E2F', muted: '6B5468', accent: 'FF5D8F', pal: ['FF5D8F', '5BC0EB', 'FDE74C', '9BC53D', 'C3A6FF', 'FF8C42'] };
const dots = () => { let d = ''; for (let y = 20; y < 900; y += 50) for (let x = 20 + ((y / 50) % 2) * 25; x < 1600; x += 50) d += `<circle cx="${x}" cy="${y}" r="3" fill="#F7CBB0"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/>${d}</svg>`; };
const sticker = (t, s, x, y, w, h, fill, r, rot = 0) => { t.rect(s, x - 0.07, y - 0.07, w + 0.14, h + 0.14, 'FFFFFF', { r: r + 0.07, rotate: rot, shadow: 0.25, blur: 6, offset: 3, name: 'Sticker border' }); t.rect(s, x, y, w, h, fill, { r, rotate: rot, name: 'Sticker' }); };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Stiker', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'row', stats: 'markers', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', dots(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k, o) => sticker(ctx.t, s, x, y, w, h, o.big ? 'FFFFFF' : ['FFFFFF', 'FFF7D6', 'E9F7FF', 'F1FFE6'][k % 4], 0.22, o.big || o.text || o.compare ? 0 : (k % 2 ? 1 : -1)),
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.shape(s, 'STAR_5_POINT', { x: x - d * 0.12, y: y - d * 0.12, w: d * 1.24, h: d * 1.24, fill: { color: 'FFFFFF' }, shadow: { type: 'outer', color: '000000', opacity: 0.2, blur: 4, offset: 2, angle: 90 }, objectName: 'Star border' }); ctx.t.shape(s, 'STAR_5_POINT', { x, y, w: d, h: d, fill: { color: C.pal[k % 6] }, objectName: 'Star' }); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.08, w: d, h: d, fontSize: Math.round(d * 20), bold: true, color: C.ink, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.12, y - 0.12, w + 0.24, h + 0.24, 'FFFFFF', { r: 0.3, shadow: 0.25, blur: 6, offset: 3, name: 'Sticker border' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.12 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'FFFFFF', 4, { dash: 'dash' }),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.45, 0.3, 0.8, ctx.idx, ctx.idx); if (d.title) { const tw = Math.min(8.0, L.width(d.title, 26, 'Arial', true) + 0.6); sticker(t, s, 1.5, 0.4, tw, 0.62, 'FFFFFF', 0.31); t.text(s, d.title, { x: 1.75, y: 0.4, w: tw - 0.4, h: 0.62, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, tw - 0.4, 0.6, 26, 14, 'Arial', true) }); } },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => C.ink, authorColor: C.accent, compareHead: (i) => (i ? '1D8FC5' : C.accent),
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, HF = 'Arial';
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: HF, bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, HF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const night = '2D1E2F', nightUp = '42304A', cream = 'FFF4EA', soft = 'D9C6D6', pale = ['FFD9E5', 'D6F0FB', 'FFF9C7', 'E6F4CF'], deep = ['D42A63', '1D8FC5', 'A88F00', '5F8A12'];
    const stick = (s, x, y, w, ht, fill, r = 0.2, rot = 0) => sticker(t, s, x, y, w, ht, fill, r, rot);
    const round = (s, x, y, d, c) => { t.oval(s, x - 0.06, y - 0.06, d + 0.12, d + 0.12, 'FFFFFF', { name: 'Sticker border' }); t.oval(s, x, y, d, d, c, { name: 'Round sticker' }); };
    const star = (s, x, y, d, k) => K.marker(ctx, s, x, y, d, k, '');
    const washi = (s, x, y, w, c, rot = 0) => t.rect(s, x, y, w, 0.2, c, { t: 25, rotate: rot, name: 'Washi tape' });
    const dark = (s, d) => { t.rect(s, 0, 0, 10, 5.625, night, { name: 'Dark sheet' }); K.marker(ctx, s, 0.45, 0.3, 0.8, ctx.idx, ctx.idx); t.text(s, d.title, { x: 1.5, y: 0.35, w: 7.95, h: 0.72, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 7.95, 0.72, 26, 14, HF, true) }); metaFooter({ color: soft })(ctx, s); };
    const V = {
      image: [
        async (d) => { // the picture die-cut as a soft blob, a thick white edge, stars stuck on it
          const s = await page(d), b = 'M0.5,0.02 C0.76,-0.02 0.98,0.16 0.98,0.42 C0.98,0.68 0.86,0.98 0.52,0.98 C0.24,0.98 0.02,0.8 0.02,0.5 C0.02,0.22 0.24,0.05 0.5,0.02 Z', x = 5.2, y = 1.3, w = 4.25, ht = 3.75;
          t.img(s, await svgOnce(ctx, 'blob', `<svg xmlns="http://www.w3.org/2000/svg" width="425" height="375" viewBox="0 0 1 1" preserveAspectRatio="none"><path d="${b}" fill="#fff"/></svg>`, 425, 375), x, y, w, ht);
          t.img(s, await L.photo(L.src(d.image), w - 0.28, ht - 0.28, { mask: { path: b } }), x + 0.14, y + 0.14, w - 0.28, ht - 0.28, { alt: '' });
          star(s, 8.75, 1.28, 0.62, 2); star(s, 5.1, 4.35, 0.52, 0);
          stick(s, 0.65, 1.45, 4.25, 3.5, 'FFFFFF');
          body(s, d.text, 0.82, 1.55, 3.92, 3.3, { max: 14, k: 1.12, valign: 'middle' });
        },
        async (d) => { // the picture covers the page, one big sticker slapped on top of it
          const s = await newSlide('focus');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.18, 10, 0.445, night, { name: 'Footer band' }); metaFooter({ color: cream })(ctx, s);
          stick(s, 0.5, 0.42, 4.75, 4.45, 'FFFFFF', 0.25);
          K.marker(ctx, s, 0.68, 0.52, 0.7, ctx.idx, ctx.idx);
          head(s, d.title, 1.48, 0.5, 3.6, 0.78, { max: 17 });
          body(s, d.text, 0.75, 1.35, 4.25, 3.4, { max: 14, k: 1.12, valign: 'middle' });
        },
        async (d) => { // a round picture sticker, the words on a coloured tag peeling toward it
          const s = await page(d), dd = 3.3, x = 0.85, y = 1.55;
          round(s, x - 0.06, y - 0.06, dd + 0.12, 'FFFFFF');
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
          star(s, 3.45, 1.32, 0.8, 4);
          stick(s, 4.7, 1.45, 4.7, 3.5, pale[1], 0.25);
          body(s, d.text, 4.87, 1.55, 4.36, 3.3, { max: 14, k: 1.12, valign: 'middle' });
        },
        async (d) => { // a wide photo strip held down with washi tape at the corners, the words under it
          const s = await page(d), y = 1.42, ht = 1.55;
          t.rect(s, 0.55, y - 0.08, 8.9, ht + 0.16, 'FFFFFF', { shadow: 0.25, blur: 6, offset: 3, name: 'Photo border' });
          t.img(s, await L.photo(L.src(d.image), 8.74, ht), 0.63, y, 8.74, ht, { alt: '' });
          washi(s, 0.3, y - 0.12, 1.05, C.pal[0], -14); washi(s, 8.65, y + ht - 0.1, 1.05, C.pal[1], -14);
          stick(s, 0.65, 3.2, 8.7, 1.85, 'FFFFFF');
          body(s, d.text, 0.8, 3.24, 8.4, 1.77, { max: 14, k: 1.05, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // speech bubbles down the page, each talking from its round badge, left and right in turn
          const s = await page(d), n = d.items.length, g = 0.14, top = 1.32, rh = (3.75 - g * (n - 1)) / n, dd = Math.min(0.7, rh - 0.14);
          for (const [i, it] of d.items.entries()) {
            const y = top + i * (rh + g), right = i % 2 === 1, bx = right ? 0.6 : 1.55, by = y + (rh - dd) / 2;
            stick(s, bx, y, 7.85, rh, pale[i], 0.16);
            round(s, right ? 8.65 : 0.65, by, dd, C.pal[i]);
            t.img(s, await L.icon(it.icon, C.ink, 2), (right ? 8.65 : 0.65) + dd / 2 - 0.16, by + dd / 2 - 0.16, 0.32, 0.32);
            head(s, it.h, bx + 0.14, y + 0.04, 2.3, rh - 0.08, { max: 14 });
            body(s, it.t, bx + 2.55, y + 0.05, 5.15, rh - 0.1, { max: 13, valign: 'middle' });
          }
        },
        async (d) => { // a sheet of four square stickers, a little askew; with three, one is twice the size
          const s = await page(d), n = d.items.length, g = 0.24, w = (8.7 - g) / 2, ht = 1.72, x2 = 0.65 + w + g, y2 = 1.36 + ht + g, cell = n === 4 ? [[0.65, 1.36, w, ht], [x2, 1.36, w, ht], [0.65, y2, w, ht], [x2, y2, w, ht]] : [[0.65, 1.36, w, 2 * ht + g], [x2, 1.36, w, ht], [x2, y2, w, ht]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, cw, ch] = cell[i], tall = ch > 2;
            stick(s, x, y, cw, ch, C.pal[i], 0.2, i % 2 ? 0.7 : -0.7);
            t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.16, y + 0.12, tall ? 0.6 : 0.34, tall ? 0.6 : 0.34);
            head(s, it.h, x + (tall ? 0.88 : 0.58), y + 0.08, cw - (tall ? 1.02 : 0.7), tall ? 0.7 : 0.44, { max: tall ? 19 : 14 });
            body(s, it.t, x + 0.18, y + (tall ? 0.95 : 0.58), cw - 0.36, ch - (tall ? 1.1 : 0.66), { max: tall ? 17 : 13, k: tall ? 1.15 : undefined });
          }
        },
        async (d) => { // glow-in-the-dark stickers at night, peeled at different heights
          const s = await newSlide('focus'); dark(s, d);
          const n = d.items.length, g = 0.2, w = (8.7 - g * (n - 1)) / n, ht = 3.0;
          for (const [i, it] of d.items.entries()) {
            const x = 0.65 + i * (w + g), y = i % 2 ? 2.05 : 1.35, c = C.pal[i];
            t.rect(s, x, y, w, ht, nightUp, { r: 0.2, line: { color: c, width: 3 }, name: 'Glow sticker' });
            t.img(s, await L.icon(it.icon, c, 2), x + w / 2 - 0.2, y + 0.14, 0.4, 0.4);
            head(s, it.h, x + 0.14, y + 0.58, w - 0.28, 0.52, { max: 14, color: c, align: 'center' });
            body(s, it.t, x + 0.14, y + 1.12, w - 0.28, ht - 1.22, { max: 13, color: cream, align: 'center' });
          }
        },
        async (d) => { // one giant star in the middle of the sheet, the items stuck around its points
          const s = await page(d), n = d.items.length, cw = 3.2, ch = 1.68, cell = n === 4 ? [[0.65, 1.36], [6.15, 1.36], [0.65, 3.36], [6.15, 3.36]] : [[0.65, 1.36], [6.15, 2.36], [0.65, 3.36]];
          star(s, 3.72, 1.92, 2.56, 2);
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i];
            stick(s, x, y, cw, ch, ['FFFFFF', 'FFF7D6', 'E9F7FF', 'F1FFE6'][i], 0.18, i % 2 ? 0.7 : -0.7);
            round(s, x + 0.1, y + 0.08, 0.44, C.pal[i]); t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.21, y + 0.19, 0.22, 0.22);
            head(s, it.h, x + 0.64, y + 0.06, cw - 0.74, 0.46, { max: 13 });
            body(s, it.t, x + 0.14, y + 0.58, cw - 0.28, ch - 0.64, { max: 12.5 });
          }
        },
      ],
      process: [
        async (d) => { // stickers climbing a stair of colour, each sitting on the page edge
          const s = await page(d), n = d.steps.length, g = 0.16, w = (8.7 - g * (n - 1)) / n, y0 = 2.82, yN = 1.34, floor = 5.05;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.65 + i * (w + g), y = y0 - i * (y0 - yN) / (n - 1);
            stick(s, x, y, w, floor - y, pale[i], 0.16);
            K.marker(ctx, s, x + 0.08, y + 0.02, 0.52, i, i + 1);
            head(s, st.h, x + 0.64, y + 0.05, w - 0.74, 0.5, { max: 13 });
            body(s, st.t, x + 0.13, y + 0.6, w - 0.26, floor - y - 0.66, { max: 13 });
          }
        },
        async (d) => { // a white dashed road down the sheet, stars on it, stickers on both sides
          const s = await page(d), n = d.steps.length, w = 3.95, ch = 1.66, ys = n === 4 ? [1.34, 1.54, 3.38, 3.38] : [1.34, 2.36, 3.38], my = n === 4 ? [1.48, 2.36, 3.24, 4.12] : [1.92, 2.92, 3.92];
          t.line(s, 5, 1.3, 0, 3.78, 'FFFFFF', 5, { dash: 'dash' });
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? 5.45 : 0.6, y = ys[i];
            stick(s, x, y, w, ch, ['FFFFFF', 'FFF7D6', 'E9F7FF', 'F1FFE6'][i], 0.18);
            K.marker(ctx, s, 4.7, my[i], 0.6, i, i + 1);
            head(s, st.h, x + 0.14, y + 0.06, w - 0.28, 0.44, { max: 14, align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.14, y + 0.52, w - 0.28, ch - 0.58, { max: 13, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // a board game: squares in a snake, a counter on each, the last one a star
          const s = await page(d), n = d.steps.length, w = 4.1, ht = 1.7, cell = n === 4 ? [[0.65, 1.36], [5.25, 1.36], [5.25, 3.35], [0.65, 3.35]] : [[0.65, 1.36], [5.25, 1.36], [5.25, 3.35]];
          t.line(s, 4.75, 2.2, 0.5, 0, 'FFFFFF', 7); t.line(s, 7.3, 3.06, 0, 0.3, 'FFFFFF', 7); if (n === 4) t.line(s, 4.75, 4.2, 0.5, 0, 'FFFFFF', 7);
          for (const [i, st] of d.steps.entries()) {
            const [x, y] = cell[i], last = i === n - 1;
            stick(s, x, y, w, ht, C.pal[i], 0.14);
            if (last) K.marker(ctx, s, x + 0.08, y + 0.04, 0.56, 4, i + 1); else { round(s, x + 0.12, y + 0.1, 0.46, 'FFFFFF'); t.text(s, String(i + 1), { x: x + 0.12, y: y + 0.1, w: 0.46, h: 0.46, bold: true, fontSize: 16, color: C.ink, align: 'center', valign: 'middle' }); }
            head(s, st.h, x + 0.72, y + 0.08, w - 0.86, 0.5, { max: 14 });
            body(s, st.t, x + 0.16, y + 0.64, w - 0.32, ht - 0.72, { max: 13 });
          }
        },
      ],
      stats: [
        async (d) => { // long pill stickers in a stack, the figure in a colour end, the note on a tag
          const s = await page(d), hh = d.note ? 0.8 : 1.12, g = 0.16, top = 1.34;
          for (const [i, x] of d.stats.entries()) {
            const y = top + i * (hh + g);
            stick(s, 0.65, y, 8.7, hh, 'FFFFFF', hh / 2 - 0.01);
            t.rect(s, 0.65, y, 2.9, hh, C.pal[i], { r: hh / 2 - 0.01, name: 'Pill end' });
            t.text(s, x.value, { x: 0.8, y, w: 2.6, h: hh, bold: true, fontSize: L.fit(x.value, 2.6, hh - 0.08, 34, 16, HF, true), color: C.ink, align: 'center', valign: 'middle' });
            body(s, x.label, 3.72, y + 0.04, 5.4, hh - 0.08, { max: 15, valign: 'middle' });
          }
          if (d.note) { stick(s, 0.9, 4.2, 8.2, 0.84, pale[2], 0.14, -0.4); body(s, d.note, 1.02, 4.22, 7.96, 0.8, { max: 12, valign: 'middle' }); }
        },
        async (d) => { // the prize sticker on a dark sheet: one figure on a big disc, two small discs beside it
          const s = await newSlide('focus'); dark(s, d);
          const [a, b, c] = d.stats, dd = 2.7;
          round(s, 0.75, 1.3, dd, C.pal[2]);
          t.text(s, a.value, { x: 0.95, y: 1.75, w: dd - 0.4, h: 1.0, bold: true, fontSize: L.fit(a.value, dd - 0.4, 0.95, 46, 20, HF, true), color: C.ink, align: 'center', valign: 'middle' });
          body(s, a.label, 1.15, 2.75, dd - 0.8, 0.82, { max: 11.5, align: 'center' });
          for (const [i, x] of [b, c].entries()) {
            const y = 1.3 + i * 1.38, d2 = 1.22, col = C.pal[i ? 0 : 1];
            round(s, 3.95, y, d2, col);
            t.text(s, x.value, { x: 4.0, y: y + 0.26, w: d2 - 0.1, h: d2 - 0.52, bold: true, fontSize: L.fit(x.value, d2 - 0.1, 0.65, 22, 11, HF, true), color: C.ink, align: 'center', valign: 'middle' });
            body(s, x.label, 5.4, y + 0.1, 3.95, d2 - 0.2, { max: 15, color: cream, valign: 'middle' });
          }
          if (d.note) body(s, d.note, 0.65, 4.18, 8.7, 0.95, { max: 13, color: soft, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // two stickers cut as mirror images, a star holds them together in the middle
          const s = await page(d), w = 3.85, n = Math.max(d.left.items.length, d.right.items.length), top = 2.02, av = 2.92, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.05, 'Calibri', 0.14, av);
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? 5.08 : 0.62, tx = i ? x + 0.46 : x + 0.12;
            stick(s, x, 1.36, 4.3, 3.68, pale[i], 0.24);
            head(s, side.h, tx, 1.42, w, 0.54, { max: 17, color: deep[i], align: i ? 'left' : 'right' });
            for (const [j, v] of side.items.entries()) t.text(s, v, { x: tx, y: top + j * rh, w: w - 0.05, h: rh, fontSize: fs, align: i ? 'left' : 'right', valign: 'middle' });
          }
          star(s, 4.5, 2.72, 1.0, 2);
        },
        async (d) => { // two long labels from a label maker, one over the other, the name on a colour tab
          const s = await page(d), hh = 1.72;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.36 + i * (hh + 0.22), n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.14) / rws, w = 3.2, c = C.pal[i ? 3 : 4];
            stick(s, 0.65, y, 8.7, hh, 'FFFFFF', 0.18);
            t.rect(s, 0.65, y, 2.05, hh, c, { r: 0.18, name: 'Tab' });
            head(s, side.h, 0.75, y + 0.1, 1.85, hh - 0.2, { max: 16, align: 'center' });
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.24, rh - 0.04, 13, 10, 'Calibri')));
            for (const [j, v] of side.items.entries()) {
              const x = 2.85 + (j % 2) * (w + 0.03), yy = y + 0.07 + Math.floor(j / 2) * rh;
              t.shape(s, 'STAR_5_POINT', { x, y: yy + rh / 2 - 0.09, w: 0.18, h: 0.18, fill: { color: c }, objectName: 'Star' });
              t.text(s, v, { x: x + 0.23, y: yy, w: w - 0.24, h: rh, fontSize: fs, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // white words on the dark sheet with stars stuck about them
          const s = await newSlide('focus'); dark(s, d);
          star(s, 0.7, 1.45, 0.62, 0); star(s, 8.75, 1.4, 0.5, 1); star(s, 8.5, 4.5, 0.42, 3);
          t.text(s, L.runs(d.text), { x: 1.5, y: 1.3, w: 7.0, h: 2.3, bold: true, fontSize: L.fit(d.text, 7.0, 2.25, 32, 16, HF, true), color: 'FFFFFF', align: 'center', valign: 'middle' });
          if (d.caption) body(s, d.caption, 1.5, 3.68, 7.0, 1.4, { max: 13.5, color: soft, align: 'center' });
        },
        async (d) => { // a big tilted pink sticker on the left, the remark on a small note beside it
          const s = await page(d, 'focus');
          stick(s, 0.65, 1.42, 5.75, 3.55, C.pal[0], 0.35, -1.2);
          t.text(s, L.runs(d.text), { x: 0.95, y: 1.55, w: 5.15, h: 3.3, bold: true, fontSize: L.fit(d.text, 5.15, 3.25, 30, 16, HF, true), color: C.ink, valign: 'middle' });
          star(s, 5.85, 1.18, 0.72, 2);
          if (d.caption) { stick(s, 6.72, 1.75, 2.68, 3.25, pale[2], 0.18, 1); body(s, d.caption, 6.84, 1.84, 2.44, 3.07, { max: 13.5, valign: 'middle' }); }
        },
      ],
      timeline: [
        async (d) => { // a strip of washi tape across the sheet, the dates on stickers above and below it
          const s = await page(d), ty = 3.08, hh = 1.56, w = 3.95;
          t.rect(s, 0, ty, 10, 0.26, C.pal[1], { name: 'Washi tape' });
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = 0.62 + (i >> 1) * 4.42 + (above ? 0 : 0.42), y = above ? 1.36 : 3.5;
            stick(s, x, y, w, hh, 'FFFFFF', 0.16);
            K.marker(ctx, s, above ? x + 0.1 : x + w - 0.52, ty - 0.08, 0.42, i, '');
            head(s, it.year, x + 0.12, y + 0.03, 1.4, 0.42, { max: 16, color: deep[i] });
            head(s, it.h, x + 1.56, y + 0.03, w - 1.68, 0.42, { max: 12.5 });
            body(s, it.t, x + 0.12, y + 0.47, w - 0.24, hh - 0.51, { max: 12.5 });
          }
        },
        async (d) => { // round date badges bouncing left and right, a label stuck beside each
          const s = await page(d), rh = 0.94, top = 1.32, dd = 0.84;
          for (const [i, it] of d.items.entries()) {
            const y = top + i * rh, sh = i % 2 ? 0.8 : 0, x = 0.65 + sh, lx = x + dd + 0.16;
            stick(s, lx, y + 0.06, 9.35 - lx, rh - 0.14, 'FFFFFF', 0.12);
            round(s, x, y + 0.03, dd, C.pal[i]);
            head(s, it.year, x + 0.05, y + 0.2, dd - 0.1, dd - 0.34, { max: 12, align: 'center' });
            head(s, it.h, lx + 0.12, y + 0.07, 9.1 - lx, 0.26, { max: 12.5 });
            body(s, it.t, lx + 0.12, y + 0.33, 9.1 - lx, rh - 0.43, { max: 12 });
          }
        },
        async (d) => { // four stickers going downhill, overlapping none, their date on a colour head
          const s = await page(d), w = 4.75, hh = 0.86, sx = (8.7 - w) / 3, sy = 0.96;
          for (const [i, it] of d.items.entries()) {
            const x = 0.65 + i * sx, y = 1.34 + i * sy;
            stick(s, x, y, w, hh, pale[i], 0.14);
            t.rect(s, x, y, 1.12, hh, C.pal[i], { r: 0.14, name: 'Date' });
            head(s, it.year, x + 0.04, y + 0.05, 1.04, hh - 0.1, { max: 13, align: 'center' });
            head(s, it.h, x + 1.2, y + 0.02, w - 1.3, 0.26, { max: 12 });
            body(s, it.t, x + 1.2, y + 0.28, w - 1.3, hh - 0.3, { max: 11.5 });
          }
        },
      ],
    };
    R.image = V.image.shift(); R.timeline = V.timeline.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 0.8, 3.0, 3.0);
    K.marker(ctx, s, 8.7, 3.4, 1.0, 2, ''); K.marker(ctx, s, 5.6, 0.4, 0.75, 0, '');
    sticker(t, s, 0.6, 0.75, 5.0, 2.6, C.pal[0], 0.35, -1.5);
    t.text(s, d.title, { x: 0.85, y: 0.9, w: 4.5, h: 2.3, bold: true, fontSize: L.fit(d.title, 4.5, 2.2, 38, 18, 'Arial', true), color: C.ink, valign: 'middle' });
    sticker(t, s, 0.8, 3.65, 4.0, 0.55, 'FFFFFF', 0.27, 1);
    t.text(s, M.author || '', { x: 0.95, y: 3.65, w: 3.7, h: 0.55, fontSize: 15, bold: true, color: C.ink, valign: 'middle' });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.85, y: 4.35, w: 4.8, h: 0.3, fontSize: 12, bold: true, color: C.muted });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 4.65, w: 4.8, h: 0.5, fontSize: 11, color: C.muted });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 93, slug: 'stiker', name: 'Stiker', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "quvnoq va do'stona: yosh auditoriyaga mos, sodda va esda qoladigan", limits: {}, prefer: 'visual' } };
