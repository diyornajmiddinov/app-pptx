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
  ways: (ctx, h, R) => {
    // ---- further ways to draw a type, on the keyboard: a deck's pages must not look alike (L.pages)
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const DK = '25282D', SCR = '14171B', GRN = '7CF29A', foot = metaFooter({ color: C.muted }), onK = (k) => (['F2711C', '21BA45', '00B5AD'].includes(C.pal[k % 6]) ? DK : 'FFFFFF');
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.ls || 1), lineSpacingMultiple: o.ls || 1, color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const cap = (s, x, y, w, h2, k, v, max = 22) => { key(t, s, x, y, w, h2, C.pal[k % 6], '4A4F57'); t.text(s, String(v), { x: x + 0.04, y: y + 0.02, w: w - 0.08, h: h2 - 0.14, fontFace: 'Arial', bold: true, color: onK(k), align: 'center', valign: 'middle', fontSize: L.fit(String(v), w - 0.14, h2 - 0.2, max, 9, 'Arial', true) }); };
    const screen = (s, x, y, w, h2) => { t.rect(s, x - 0.08, y - 0.08, w + 0.16, h2 + 0.16, '3A3E45', { r: 0.1, shadow: 0.3, blur: 5, offset: 2, name: 'Bezel' }); t.rect(s, x, y, w, h2, SCR, { r: 0.04, name: 'Screen' }); };
    const icon = async (s, ic, x, y, d, c) => t.img(s, await L.icon(ic, c, 2), x, y, d, d);
    const V = {
      image: [
        async (d) => { // the picture on a laptop screen, the words on a long key beside it
          const s = await page(d), x = 4.55, w = 4.85;
          t.rect(s, x, 1.28, w, 3.3, '3A3E45', { r: 0.12, shadow: 0.3, blur: 5, offset: 2, name: 'Lid' });
          await t.img(s, await L.photo(L.src(d.image), w - 0.24, 3.06), x + 0.12, 1.4, w - 0.24, 3.06, { alt: '' });
          t.rect(s, x - 0.3, 4.58, w + 0.6, 0.2, 'B9BDC4', { r: 0.08, name: 'Base' }); t.rect(s, x + w / 2 - 0.5, 4.58, 1.0, 0.07, '8D929A', { name: 'Notch' });
          key(t, s, 0.6, 1.35, 3.6, 3.7);
          body(s, d.text, 0.8, 1.48, 3.2, 3.35, { max: 14, color: C.ink, valign: 'middle' });
        },
        async (d) => { // the picture seen through a block of keys, the words below on the space bar
          const s = await page(d), cols = 9, rows = 2, g = 0.012, cw = (1 - g * (cols - 1)) / cols, ch = (1 - 0.04 * (rows - 1)) / rows;
          let path = '';
          for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const a = c * (cw + g), b = r * (ch + 0.04); path += `M${a},${b} L${a + cw},${b} L${a + cw},${b + ch} L${a},${b + ch} Z `; }
          t.img(s, await L.photo(L.src(d.image), 8.8, 2.05, { mask: { path } }), 0.6, 1.3, 8.8, 2.05, { alt: '' });
          key(t, s, 0.6, 3.5, 8.8, 1.62, 'FFE7D4', 'E8A777');
          body(s, d.text, 0.85, 3.56, 8.3, 1.38, { max: 14, color: C.ink, valign: 'middle' });
        },
        async (d) => { // the picture fills the page, the words on one wide key
          const s = await newSlide('page');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.18, 10, 0.445, SCR, { name: 'Footer strip' });
          K.marker(ctx, s, 0.5, 0.35, 0.7, ctx.idx, `F${ctx.idx}`);
          key(t, s, 1.4, 0.35, 5.2, 0.9);
          head(s, d.title, 1.6, 0.38, 4.8, 0.72, { max: 18 });
          key(t, s, 0.5, 3.1, 9.0, 1.95);
          body(s, d.text, 0.75, 3.18, 8.5, 1.68, { max: 14, color: C.ink, valign: 'middle' });
          metaFooter({ color: 'E4E7EB' })(ctx, s);
        },
        async (d) => { // the picture on a round dial with a scale of ticks
          const s = await page(d), dd = 3.0, cx = 2.25, cy = 3.2;
          for (let a = 0; a <= 16; a++) { const r = (135 + a * 270 / 16) * Math.PI / 180, x1 = cx + Math.cos(r) * 1.66, y1 = cy + Math.sin(r) * 1.66, dx = Math.cos(r) * 0.15, dy = Math.sin(r) * 0.15; t.line(s, Math.min(x1, x1 + dx), Math.min(y1, y1 + dy), Math.abs(dx) || 0.001, Math.abs(dy) || 0.001, a < 11 ? C.accent : '9AA0A8', 1.75, { ...((dx > 0) !== (dy > 0) ? { flipV: true } : {}) }); }
          t.oval(s, cx - dd / 2 - 0.09, cy - dd / 2 - 0.09, dd + 0.18, dd + 0.18, '3A3E45');
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), cx - dd / 2, cy - dd / 2, dd, dd, { alt: '' });
          body(s, d.text, 4.5, 1.4, 4.9, 3.65, { max: 16, color: C.ink, valign: 'middle', ls: 1.2 });
        },
      ],
      cards: [
        async (d) => { // the numeric pad: square keys, the last key wide like the zero
          const s = await page(d), n = d.items.length, gx = 0.14, gy = 0.1, w = (8.8 - gx) / 2, hh = 1.76;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = 0.6 + (i % 2) * (w + gx), y = 1.33 + Math.floor(i / 2) * (hh + gy), ww = wide ? 8.8 : w;
            key(t, s, x, y, ww, hh);
            cap(s, x + 0.14, y + 0.14, 0.52, 0.52, i, '', 9);
            await icon(s, it.icon, x + 0.25, y + 0.2, 0.3, onK(i));
            head(s, it.h, x + 0.78, y + 0.12, ww - 0.95, 0.5, { max: 15 });
            body(s, it.t, x + 0.2, y + 0.68, ww - 0.4, hh - 0.86, { max: 13 });
          }
        },
        async (d) => { // a key combination on each row: small key + long key
          const s = await page(d), n = d.items.length, hh = 3.72 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.32 + i * hh, kh = hh - 0.08, kw = Math.min(kh, 0.95);
            cap(s, 0.6, y, kw, kh, i, '', 9);
            await icon(s, it.icon, 0.6 + kw / 2 - 0.2, y + kh / 2 - 0.25, 0.4, onK(i));
            t.text(s, '+', { x: 0.6 + kw, y, w: 0.4, h: kh, fontFace: 'Arial', bold: true, fontSize: 20, color: C.muted, align: 'center', valign: 'middle' });
            key(t, s, 1.0 + kw, y, 8.4 - kw, kh);
            head(s, it.h, 1.2 + kw, y + 0.03, 2.3, kh - 0.14, { max: 14 });
            body(s, it.t, 3.6 + kw, y + 0.05, 5.65 - kw, kh - 0.18, { valign: 'middle', max: 13 });
          }
        },
        async (d) => { // the arrow keys: one on top, the others in a row under it
          const s = await page(d), n = d.items.length, gx = 0.12, low = n - 1, w = (8.8 - gx * (low - 1)) / low, hh = 1.78, A = n === 4 ? ['↑', '←', '↓', '→'] : ['↑', '←', '→'];
          for (const [i, it] of d.items.entries()) {
            const top = i === 0, x = top ? 5 - w / 2 : 0.6 + (i - 1) * (w + gx), y = top ? 1.3 : 3.33;
            key(t, s, x, y, w, hh);
            t.text(s, A[i], { x: x + w - 0.5, y: y + 0.06, w: 0.38, h: 0.38, fontFace: 'Arial', bold: true, fontSize: 18, color: C.pal[i % 6] === 'F2711C' ? 'B4470A' : C.pal[i % 6], align: 'center', valign: 'middle' });
            await icon(s, it.icon, x + 0.18, y + 0.12, 0.3, C.ink);
            head(s, it.h, x + 0.56, y + 0.08, w - 1.1, 0.42, { max: 13.5 });
            body(s, it.t, x + 0.18, y + 0.52, w - 0.36, hh - 0.7, { max: 13 });
          }
        },
        async (d) => { // a dark terminal: a line for each item
          const s = await page(d), n = d.items.length, hh = 3.42 / n;
          screen(s, 0.68, 1.4, 8.64, 3.62);
          for (const [i, it] of d.items.entries()) {
            const y = 1.5 + i * hh;
            t.text(s, '>', { x: 0.85, y, w: 0.28, h: 0.4, fontFace: 'Arial', bold: true, fontSize: 16, color: GRN, valign: 'middle' });
            await icon(s, it.icon, 1.15, y + 0.06, 0.28, GRN);
            head(s, it.h, 1.55, y, 7.5, 0.4, { color: GRN, max: 14.5 });
            body(s, it.t, 1.55, y + 0.4, 7.55, hh - 0.46, { color: 'E4E7EB', max: 13 });
          }
        },
      ],
      process: [
        async (d) => { // typed in a cascade: each key lower and further on
          const s = await page(d), n = d.steps.length, hh = 3.72 / n, w = n === 4 ? 5.0 : 5.2, sh = (8.8 - w) / (n - 1);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * sh, y = 1.32 + i * hh;
            key(t, s, x, y, w, hh - 0.06);
            cap(s, x + 0.1, y + 0.08, 0.5, Math.min(0.6, hh - 0.26), i, i + 1, 16);
            head(s, st.h, x + 0.7, y + 0.04, w - 0.85, 0.3, { max: 13.5 });
            body(s, st.t, x + 0.7, y + 0.33, w - 0.85, hh - 0.52, { max: 12.5 });
          });
        },
        async (d) => { // the steps lead to a big orange Enter: the last one is pressed there
          const s = await page(d), n = d.steps.length, rest = d.steps.slice(0, -1), last = d.steps[n - 1], hh = 3.72 / rest.length, X = 5.75;
          rest.forEach((st, i) => {
            const y = 1.32 + i * hh;
            cap(s, 0.6, y + (hh - 0.62) / 2, 0.62, 0.62, i + 1, i + 1, 18);
            head(s, st.h, 1.4, y + 0.02, 3.6, 0.34, { max: 14.5 });
            body(s, st.t, 1.4, y + 0.36, 3.6, hh - 0.42, { max: 13, color: C.ink });
          });
          t.rect(s, X - 0.6, 3.1, 0.75, 2.0, 'B4470A', { r: 0.1, name: 'Enter lip' }); t.rect(s, X - 0.55, 3.13, 0.7, 1.85, C.accent, { r: 0.08, name: 'Enter lip' });
          key(t, s, X, 1.32, 3.65, 3.8, C.accent, 'B4470A');
          t.text(s, `${n}  ↵`, { x: X + 0.22, y: 1.42, w: 3.2, h: 0.7, fontFace: 'Arial', bold: true, fontSize: 32, color: DK, valign: 'middle' });
          head(s, last.h, X + 0.22, 2.15, 3.2, 0.62, { max: 20, color: DK });
          body(s, last.t, X + 0.22, 2.8, 3.2, 2.1, { max: 15, color: DK });
        },
        async (d) => { // a cable: keys plugged in over and under it, by turn
          const s = await page(d), n = d.steps.length, ly = 3.2, w = n === 4 ? 3.7 : 4.2, xs = n === 4 ? [0.6, 1.3, 5.1, 5.7] : [0.6, 2.9, 5.2];
          t.line(s, 0, ly, 10, 0, '3A3E45', 3.5);
          d.steps.forEach((st, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.33 : ly + 0.28, hh = 1.6, mx = x;
            cap(s, mx, ly - 0.2, 0.42, 0.4, i, i + 1, 14);
            head(s, st.h, x, y, w, 0.36, { max: 15 });
            body(s, st.t, x, y + 0.37, w, hh - 0.42, { max: 13, color: C.ink });
          });
        },
      ],
      stats: [
        async (d) => { // three calculator displays
          const s = await page(d), cw = 8.8 / 3, H2 = 1.5;
          d.stats.forEach((x, i) => {
            const px = 0.6 + i * cw;
            screen(s, px + 0.1, 1.42, cw - 0.2, H2);
            t.text(s, x.value, { x: px + 0.22, y: 1.5, w: cw - 0.44, h: H2 - 0.16, fontFace: 'Arial', bold: true, color: GRN, align: 'right', valign: 'middle', fontSize: L.fit(x.value, cw - 0.5, H2 - 0.3, 42, 14, 'Arial', true) });
            body(s, x.label, px + 0.05, 3.08, cw - 0.1, 0.82, { color: C.ink, max: 14, align: 'center' });
          });
          if (d.note) body(s, d.note, 0.6, 3.98, 8.8, 1.1, { max: 12.5 });
        },
        async (d) => { // one number on the big orange key, two on smaller keys
          const s = await page(d), [a, ...rest] = d.stats;
          key(t, s, 0.6, 1.32, 4.5, 2.5, C.accent, 'B4470A');
          t.text(s, a.value, { x: 0.8, y: 1.38, w: 4.1, h: 1.4, fontFace: 'Arial', bold: true, color: DK, valign: 'middle', fontSize: L.fit(a.value, 4.0, 1.25, 66, 22, 'Arial', true) });
          body(s, a.label, 0.8, 2.8, 4.1, 0.8, { color: DK, max: 15 });
          rest.forEach((x, i) => {
            const y = 1.32 + i * 1.28;
            key(t, s, 5.3, y, 4.1, 1.22);
            t.text(s, x.value, { x: 5.45, y: y + 0.03, w: 3.8, h: 0.6, fontFace: 'Arial', bold: true, color: C.pal[(i + 1) % 6], valign: 'middle', fontSize: L.fit(x.value, 3.7, 0.55, 30, 14, 'Arial', true) });
            body(s, x.label, 5.45, y + 0.62, 3.8, 0.45, { max: 12, color: C.ink });
          });
          if (d.note) body(s, d.note, 0.6, 3.95, 8.8, 1.15, { max: 13, color: C.ink, valign: 'middle' });
        },
        async (d) => { // each number spelled out key by key
          const s = await page(d), rh = d.note ? 0.94 : 1.2;
          d.stats.forEach((x, i) => {
            const y = 1.33 + i * rh, ch = [...String(x.value)], kw = Math.min(rh - 0.14, 4.6 / ch.length - 0.05);
            ch.forEach((c, j) => cap(s, 0.6 + j * (kw + 0.05), y + (rh - 0.08 - kw) / 2, kw, kw, i, c, 22));
            body(s, x.label, 5.4, y, 4.0, rh - 0.08, { color: C.ink, valign: 'middle', max: 15 });
          });
          if (d.note) body(s, d.note, 0.6, 4.2, 8.8, 0.92, { max: 12, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // a split keyboard: the two halves mirrored, a gap in the middle
          const s = await page(d), w = 4.15;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13.5, w - 0.4, 'Calibri', 0.3, 2.98);
          [d.left, d.right].forEach((side, i) => {
            const x = i ? 5.25 : 0.6, a = i ? 'left' : 'right', col = i ? 1 : 0;
            cap(s, x, 1.3, w, 0.68, col, side.h, 16);
            let y = 2.04;
            rows.forEach((rh, j) => { if (side.items[j]) { key(t, s, x + (i ? 0 : 0.0), y, w, rh - 0.04); t.text(s, side.items[j], { x: x + 0.2, y: y + 0.02, w: w - 0.4, h: rh - 0.18, fontSize: fs, color: C.ink, align: a, valign: 'middle' }); } y += rh; });
          });
        },
        async (d) => { // two rows of keys, a wide shift key over each row
          const s = await page(d), hh = 1.84;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.3 + i * (hh + 0.06), n = side.items.length, gx = 0.08, w = (8.8 - gx * (n - 1)) / n, kh = hh - 0.56;
            head(s, side.h, 0.6, y, 7.6, 0.46, { color: i ? '1B6CAD' : 'B4470A', max: 18 });
            t.text(s, '⇧', { x: 8.9, y, w: 0.5, h: 0.46, fontFace: 'Arial', bold: true, fontSize: 20, color: C.muted, align: 'right', valign: 'middle' });
            side.items.forEach((it, j) => { const x = 0.6 + j * (w + gx); key(t, s, x, y + 0.48, w, kh); body(s, it, x + 0.14, y + 0.52, w - 0.28, kh - 0.18, { max: 13, color: C.ink, valign: 'middle' }); });
          });
        },
      ],
      statement: [
        async (d) => { // the thought typed in a terminal, a cursor after it, the note as a comment
          const s = await page(d);
          screen(s, 0.68, 1.4, 8.64, 3.62);
          t.text(s, '>', { x: 0.9, y: 1.55, w: 0.45, h: 0.6, fontFace: 'Arial', bold: true, fontSize: 30, color: GRN, valign: 'middle' });
          t.text(s, L.runs(d.text), { x: 1.4, y: 1.55, w: 7.65, h: 1.95, fontFace: 'Arial', bold: true, color: 'FFFFFF', valign: 'top', fontSize: L.fit(d.text, 7.65, 1.9, 28, 15, 'Arial', true) });
          t.rect(s, 1.4, 3.56, 0.3, 0.07, GRN, { name: 'Cursor' });
          if (d.caption) body(s, d.caption, 1.4, 3.7, 7.65, 1.22, { color: 'B9C0C9', max: 13 });
        },
        async (d) => { // large words on the bare desk, the note on the space bar, Enter at its end
          const s = await page(d, 'focus');
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.25, w: 8.8, h: 2.15, fontFace: 'Arial', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.1, 38, 16, 'Arial', true) });
          key(t, s, 0.6, 3.5, 7.45, 1.6);
          if (d.caption) body(s, d.caption, 0.85, 3.56, 6.95, 1.36, { max: 14, valign: 'middle' });
          key(t, s, 8.17, 3.5, 1.23, 1.6, C.accent, 'B4470A');
          t.text(s, '↵', { x: 8.17, y: 3.5, w: 1.23, h: 1.45, fontFace: 'Arial', bold: true, fontSize: 36, color: DK, align: 'center', valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // the function row: a coloured key for each year on a dark strip, the words under
          const s = await page(d), cw = 8.8 / 4;
          t.rect(s, 0, 1.3, 10, 0.95, '3A3E45', { name: 'Key strip' });
          d.items.forEach((it, i) => {
            const x = 0.6 + i * cw;
            cap(s, x + 0.04, 1.4, cw - 0.2, 0.75, i, it.year, 18);
            head(s, it.h, x + 0.04, 2.35, cw - 0.2, 0.55, { max: 15, valign: 'top' });
            body(s, it.t, x + 0.04, 2.9, cw - 0.2, 2.2, { max: 13.5, color: C.ink });
          });
        },
        async (d) => { // a cable down the middle, years plugged on it, words to either side
          const s = await page(d), cx = 5, w = 3.85, ys = [1.32, 2.2, 3.24, 4.12], Y2 = [1.32, 2.25, 3.2, 3.5];
          t.line(s, cx, 1.28, 0, 3.86, '3A3E45', 3.5);
          d.items.forEach((it, i) => {
            const right = i % 2 === 1, x = right ? cx + 0.75 : cx - 0.75 - w, a = right ? 'left' : 'right', y = [1.32, 1.72, 3.22, 3.62][i];
            cap(s, cx - 0.62, ys[i], 1.24, 0.5, i, it.year, 13);
            head(s, it.h, x, y, w, 0.38, { max: 15, align: a });
            body(s, it.t, x, y + 0.38, w, 1.1, { max: 13, align: a, color: C.ink });
          });
        },
        async (d) => { // the keyboard's left edge: Tab, Caps, Shift, each year key wider than the last
          const s = await page(d), hh = 3.72 / 4;
          d.items.forEach((it, i) => {
            const y = 1.32 + i * hh, kw = 1.25 + i * 0.42, x = 0.6 + kw + 0.18;
            cap(s, 0.6, y, kw, hh - 0.08, i, it.year, 15);
            head(s, it.h, x, y, 8.8 - kw - 0.18, 0.32, { max: 14.5 });
            body(s, it.t, x, y + 0.32, 8.8 - kw - 0.18, hh - 0.42, { max: 12.5, color: C.ink });
            t.line(s, x, y + hh - 0.04, 8.8 - kw - 0.18, 0, 'B9BDC4', 0.75);
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.stats = V.stats.shift(); // the old stat tiles look like the cards
    R.timeline = V.timeline.shift(); // and so do the old timeline columns
    return V;
  },
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
