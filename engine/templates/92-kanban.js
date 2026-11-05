/** 92 Kanban — task board: swimlane columns, task cards with coloured tag chips and avatar dots, progress tags. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EEF1F6', ink: '172B4D', muted: '5E6C84', accent: '0052CC', lane: 'E2E7EF', pal: ['0052CC', '36B37E', 'FF991F', '6554C0', 'FF5630', '00B8D9'] };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Kanban', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  bg: (ctx, s) => { s.background = { color: C.bg }; for (let k = 0; k < 4; k++) ctx.t.rect(s, 0.45 + k * 2.32, 1.25, 2.2, 3.95, C.lane, { r: 0.08, name: 'Lane' }); },
  // task card: white card, coloured tag chip, avatar dot bottom-right
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.08, shadow: 0.18, blur: 4, offset: 1, name: 'Task card' }); if (!o.big) { t.rect(s, x + w - 0.75, y + 0.12, 0.55, 0.14, C.pal[k % 6], { r: 0.07, name: 'Tag' }); t.oval(s, x + w - 0.42, y + h - 0.42, 0.28, 0.28, C.pal[(k + 2) % 6]); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.rect(s, x, y + d * 0.15, d, d * 0.7, C.pal[k % 6], { r: d * 0.2, name: 'Label' }); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.15, w: d, h: d * 0.7, fontSize: Math.round(d * 20), bold: true, color: [1, 2, 5].includes(k % 6) ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, 'FFFFFF', { r: 0.1, shadow: 0.18, blur: 4, offset: 1, name: 'Card' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.06 } }), x, y, w, h, { alt: '' }); },
  bullet: (ctx, s, x, y, k) => ctx.t.rect(s, x, y + 0.01, 0.16, 0.16, null, { r: 0.03, line: { color: C.pal[k ? 1 : 4], width: 1.5 }, name: 'Checkbox' }),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.45, 0.35, 0.8, ctx.idx, `#${ctx.idx}`); if (d.title) t.text(s, d.title, { x: 1.45, y: 0.35, w: 8.0, h: 0.62, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.62, 26, 15, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted, y: 5.3 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, valueColor: (i) => ['0052CC', '1F845A', 'B65C00', '6554C0', 'C9372C', '0A7A95'][i % 6], compareHead: (i) => (i ? '1F845A' : 'C9372C'),
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, HF = 'Arial', X0 = 0.45, CW = 9.12, Y0 = 1.25, YB = 5.2;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: HF, bold: true, fontSize: L.fit(v, w, h2, o.max || 14, 10, HF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const night = '151B26', nightUp = '232C3B', pale = 'E6EBF2', soft = 'A7B3C5', deep = ['0052CC', '1F845A', 'B65C00', '6554C0', 'C9372C', '0A7A95'], neon = ['6FA8FF', '57D9A3', 'FFC400', 'B8ACF6'], tint = ['DEEBFF', 'E3FCEF', 'FFF0B3', 'EAE6FF'];
    const blank = (s) => t.rect(s, X0 - 0.05, Y0 - 0.05, CW + 0.1, YB - Y0 + 0.1, C.bg, { name: 'Board' }); // the page's four lanes are cleared where a layout has its own
    const lanes = (s, n) => { blank(s); const g = 0.12, w = (CW - g * (n - 1)) / n; for (let k = 0; k < n; k++) t.rect(s, X0 + k * (w + g), Y0, w, YB - Y0, C.lane, { r: 0.08, name: 'Lane' }); return { w, g }; };
    const card = (s, x, y, w, ht, fill = 'FFFFFF') => t.rect(s, x, y, w, ht, fill, { r: 0.07, shadow: 0.18, blur: 4, offset: 1, name: 'Task card' });
    const chip = (s, x, y, w, ht, c, v, o = {}) => { t.rect(s, x, y, w, ht, c, { r: Math.min(ht / 2, 0.08), name: 'Chip' }); if (v !== undefined) head(s, v, x + 0.05, y, w - 0.1, ht, { max: o.max || 12, color: o.color || 'FFFFFF', align: 'center' }); };
    const avatar = (s, x, y, d, k) => t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: 'FFFFFF', width: 1.25 } });
    const dark = (s, d) => { t.rect(s, 0, 0, 10, 5.625, night, { name: 'Dark board' }); K.marker(ctx, s, 0.45, 0.35, 0.8, ctx.idx, `#${ctx.idx}`); t.text(s, d.title, { x: 1.45, y: 0.35, w: 8.0, h: 0.62, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.62, 26, 15, HF, true) }); metaFooter({ color: soft, y: 5.3 })(ctx, s); };
    const arrow = (s, x, y, w, c = C.ink) => { t.line(s, x, y, w - 0.08, 0, c, 2); t.shape(s, 'ISOSCELES_TRIANGLE', { x: x + w - 0.12, y: y - 0.07, w: 0.14, h: 0.14, rotate: 90, fill: { color: c }, objectName: 'Arrow' }); };
    const V = {
      image: [
        async (d) => { // a task opened in full: its attachment on one side, the description on the other, people at the foot
          const s = await page(d), x = 0.7, y = 1.38, w = 8.6, ht = 3.68, pw = 3.9;
          card(s, x, y, w, ht);
          t.img(s, await L.photo(L.src(d.image), pw, ht - 0.28, { mask: { r: 0.06 } }), x + 0.14, y + 0.14, pw, ht - 0.28, { alt: '' });
          chip(s, x + pw + 0.3, y + 0.16, 0.65, 0.16, C.pal[0]); chip(s, x + pw + 1.02, y + 0.16, 0.65, 0.16, C.pal[1]);
          for (let k = 0; k < 3; k++) avatar(s, x + w - 0.95 + k * 0.24, y + 0.1, 0.28, k + 2);
          body(s, d.text, x + pw + 0.3, y + 0.45, w - pw - 0.48, ht - 0.57, { max: 14, k: 1.08, valign: 'middle' });
        },
        async (d) => { // the picture covers the board, one lane is still standing with the task in it
          const s = await newSlide('focus');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.22, 10, 0.405, night, { name: 'Footer band' }); metaFooter({ color: pale, y: 5.3 })(ctx, s);
          t.rect(s, 5.0, 0.28, 4.7, 4.82, C.lane, { r: 0.08, name: 'Lane' });
          K.marker(ctx, s, 5.15, 0.38, 0.8, ctx.idx, `#${ctx.idx}`);
          head(s, d.title, 6.05, 0.36, 3.5, 0.82, { max: 17 });
          card(s, 5.14, 1.25, 4.42, 3.72);
          body(s, d.text, 5.28, 1.32, 4.14, 3.58, { max: 14, k: 1.08, valign: 'middle' });
        },
        async (d) => { // the assignee's round picture across two lanes, the task description in the others
          const s = await page(d), dd = 3.3, x = 0.95;
          t.oval(s, x - 0.09, 1.52, dd + 0.18, dd + 0.18, 'FFFFFF', { name: 'Avatar ring' });
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, 1.61, dd, dd, { alt: '' });
          avatar(s, x + dd - 0.65, 1.68, 0.5, 1); avatar(s, x + 0.08, 4.25, 0.36, 2);
          card(s, 5.0, 1.42, 4.45, 3.65); chip(s, 5.15, 1.54, 0.8, 0.17, C.pal[3]);
          body(s, d.text, 5.15, 1.8, 4.15, 3.18, { max: 14, k: 1.08, valign: 'middle' });
        },
        async (d) => { // one wide card with a cover picture, the way a board shows an image task
          const s = await page(d), x = 0.6, y = 1.36, w = 8.8, ch = 1.68;
          card(s, x, y, w, 3.72);
          t.img(s, await L.photo(L.src(d.image), w, ch, { mask: { poly: [[0, 0], [1, 0], [1, 1], [0, 1]] } }), x, y, w, ch, { alt: '' });
          chip(s, x + 0.14, y + ch + 0.08, 0.7, 0.14, C.pal[4]); chip(s, x + 0.92, y + ch + 0.08, 0.7, 0.14, C.pal[5]);
          body(s, d.text, x + 0.14, y + ch + 0.27, w - 0.28, 3.72 - ch - 0.33, { max: 13.5, k: 1.05 });
        },
      ],
      cards: [
        async (d) => { // cards in lanes, each pulled to its own height, the lane behind it visible
          const s = await page(d), n = d.items.length, { w, g } = lanes(s, n), ht = 3.08;
          for (const [i, it] of d.items.entries()) {
            const x = X0 + i * (w + g), y = [1.36, 1.98, 1.65, 1.98][i];
            card(s, x + 0.08, y, w - 0.16, ht);
            chip(s, x + 0.2, y + 0.12, 0.6, 0.14, C.pal[i]);
            t.img(s, await L.icon(it.icon, deep[i], 2), x + w - 0.56, y + 0.1, 0.34, 0.34);
            head(s, it.h, x + 0.2, y + 0.44, w - 0.4, 0.52, { max: 14 });
            body(s, it.t, x + 0.2, y + 0.98, w - 0.4, ht - 1.06, { max: 13 });
          }
        },
        async (d) => { // swimlanes across the board: a strip at the left, the card riding in its lane
          const s = await page(d), n = d.items.length, g = 0.1, rh = (YB - Y0 - g * (n - 1)) / n; blank(s);
          for (const [i, it] of d.items.entries()) {
            const y = Y0 + i * (rh + g);
            t.rect(s, X0, y, CW, rh, C.lane, { r: 0.08, name: 'Swimlane' });
            t.rect(s, X0, y, 1.0, rh, deep[i], { r: 0.08, name: 'Lane name' });
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), X0 + 0.32, y + rh / 2 - 0.18, 0.36, 0.36);
            card(s, X0 + 1.1, y + 0.06, CW - 1.18, rh - 0.12);
            head(s, it.h, X0 + 1.22, y + 0.08, 2.4, rh - 0.16, { max: 14 });
            body(s, it.t, X0 + 3.7, y + 0.09, CW - 3.9, rh - 0.18, { max: 13, valign: 'middle' });
          }
        },
        async (d) => { // the board at night: four tiles in a block, a long one when there are three
          const s = await newSlide('focus'); dark(s, d);
          const n = d.items.length, g = 0.14, w = (CW - g) / 2, ht = 1.88, y2 = Y0 + ht + g, cell = n === 4 ? [[X0, Y0, w], [X0 + w + g, Y0, w], [X0, y2, w], [X0 + w + g, y2, w]] : [[X0, Y0, w], [X0 + w + g, Y0, w], [X0, y2, CW]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, cw] = cell[i], c = neon[i];
            t.rect(s, x, y, cw, ht, nightUp, { r: 0.08, name: 'Task card' }); t.rect(s, x, y + 0.12, 0.06, ht - 0.24, c, { name: 'Edge' });
            t.img(s, await L.icon(it.icon, c, 2), x + 0.18, y + 0.14, 0.36, 0.36);
            head(s, it.h, x + 0.66, y + 0.1, cw - 0.84, 0.44, { max: 15, color: c });
            body(s, it.t, x + 0.2, y + 0.62, cw - 0.4, ht - 0.72, { max: 13, color: pale });
          }
        },
        async (d) => { // an epic in the middle, its tasks linked to it by lines
          const s = await page(d), n = d.items.length, cw = 3.25, ch = 1.74, xr = X0 + CW - cw - 0.1, x0 = X0 + 0.1; blank(s);
          const cell = n === 4 ? [[x0, 1.32], [xr, 1.32], [x0, 3.36], [xr, 3.36]] : [[x0, 1.32], [xr, 2.34], [x0, 3.36]], cx = 5.01, cy = 3.2;
          for (const [x, y] of cell) { const right = x > 5, ey = y + ch / 2, ex = right ? x : x + cw; t.shape(s, 'LINE', { x: Math.min(cx, ex), y: Math.min(cy, ey), w: Math.abs(cx - ex), h: Math.max(0.001, Math.abs(cy - ey)), line: { color: C.accent, width: 2, dashType: 'dash' }, flipV: (right && ey < cy) || (!right && ey > cy), objectName: 'Link' }); }
          t.rect(s, cx - 0.72, cy - 0.5, 1.44, 1.0, C.accent, { r: 0.1, name: 'Epic' }); t.img(s, await L.icon('FiLayers', 'FFFFFF', 2), cx - 0.24, cy - 0.24, 0.48, 0.48);
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i];
            card(s, x, y, cw, ch); t.rect(s, x, y + 0.08, 0.06, ch - 0.16, C.pal[i], { name: 'Edge' });
            t.img(s, await L.icon(it.icon, deep[i], 2), x + 0.16, y + 0.12, 0.3, 0.3);
            head(s, it.h, x + 0.54, y + 0.07, cw - 0.64, 0.42, { max: 13 });
            body(s, it.t, x + 0.16, y + 0.54, cw - 0.28, ch - 0.6, { max: 12.5 });
          }
        },
      ],
      process: [
        async (d) => { // the card moves right lane by lane, dropping a little each time
          const s = await page(d), n = d.steps.length, { w, g } = lanes(s, n), ht = 2.5, y0 = 1.36, yN = YB - ht - 0.1;
          for (const [i, st] of d.steps.entries()) {
            const x = X0 + i * (w + g), y = y0 + i * (yN - y0) / (n - 1);
            card(s, x + 0.08, y, w - 0.16, ht);
            await marker(s, x + 0.18, y + 0.04, 0.55, i, i + 1);
            head(s, st.h, x + 0.75, y + 0.06, w - 0.92, 0.5, { max: 13 });
            body(s, st.t, x + 0.2, y + 0.6, w - 0.4, ht - 0.66, { max: 13 });
            if (i < n - 1) arrow(s, x + w - 0.1, y + 0.3, g + 0.28, C.accent);
          }
        },
        async (d) => { // a single lane runs down the board, cards leaving it left and right
          const s = await page(d), n = d.steps.length, w = 3.95, ch = 1.76, cx = 5.01; blank(s);
          const ys = n === 4 ? [1.3, 1.5, 3.36, 3.38] : [1.3, 2.33, 3.36], my = n === 4 ? [1.45, 2.38, 3.3, 4.2] : [1.92, 2.98, 3.95];
          t.rect(s, cx - 0.35, Y0, 0.7, YB - Y0, C.lane, { r: 0.08, name: 'Lane' });
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? cx + 0.45 : cx - 0.45 - w, y = ys[i];
            card(s, x, y, w, ch); t.rect(s, right ? x : x + w - 0.06, y + 0.08, 0.06, ch - 0.16, C.pal[i], { name: 'Edge' });
            await marker(s, cx - 0.3, my[i], 0.6, i, i + 1);
            head(s, st.h, x + 0.16, y + 0.08, w - 0.32, 0.44, { max: 14, align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.16, y + 0.54, w - 0.32, ch - 0.6, { max: 13, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // one task with its checklist: a box per step, ticked as it goes down the card
          const s = await page(d), n = d.steps.length, x = 0.7, y = 1.34, w = 8.6, ht = 3.76, rh = (ht - 0.32) / n;
          card(s, x, y, w, ht); chip(s, x + 0.16, y + 0.1, 0.8, 0.14, C.pal[1]); for (let k = 0; k < 3; k++) avatar(s, x + w - 0.96 + k * 0.24, y + 0.05, 0.26, k);
          for (const [i, st] of d.steps.entries()) {
            const ry = y + 0.3 + i * rh;
            t.rect(s, x + 0.18, ry + rh / 2 - 0.15, 0.3, 0.3, deep[1], { r: 0.05, name: 'Checkbox' }); t.img(s, await L.icon('FiCheck', 'FFFFFF', 3), x + 0.21, ry + rh / 2 - 0.12, 0.24, 0.24);
            head(s, `${i + 1}. ${st.h}`, x + 0.6, ry + 0.03, 2.6, rh - 0.06, { max: 14 });
            body(s, st.t, x + 3.3, ry + 0.04, w - 3.45, rh - 0.08, { max: 13, valign: 'middle' });
            if (i < n - 1) t.line(s, x + 0.6, ry + rh, w - 0.75, 0, C.lane, 1);
          }
        },
        async (d) => { // swimlanes where each card starts further along the lane than the one above it
          const s = await page(d), n = d.steps.length, g = 0.08, rh = (YB - Y0 - g * (n - 1)) / n, cw = 5.75, sx = (CW - cw - 0.16) / (n - 1); blank(s);
          for (const [i, st] of d.steps.entries()) {
            const y = Y0 + i * (rh + g), x = X0 + 0.08 + i * sx;
            t.rect(s, X0, y, CW, rh, C.lane, { r: 0.08, name: 'Swimlane' });
            card(s, x, y + 0.05, cw, rh - 0.1); chip(s, x + 0.08, y + rh / 2 - 0.2, 0.42, 0.4, deep[i], String(i + 1), { max: 14 });
            head(s, st.h, x + 0.58, y + 0.07, 1.75, rh - 0.14, { max: 12.5 });
            body(s, st.t, x + 2.38, y + 0.08, cw - 2.48, rh - 0.16, { max: 12, valign: 'middle' });
          }
        },
      ],
      stats: [
        async (d) => { // three lanes, the figure in each lane's header, its meaning on a card, the note across the foot
          const s = await page(d); blank(s); const g = 0.12, w = (CW - 2 * g) / 3, ht = d.note ? 2.72 : YB - Y0;
          for (const [i, x] of d.stats.entries()) {
            const px = X0 + i * (w + g);
            t.rect(s, px, Y0, w, ht, C.lane, { r: 0.08, name: 'Lane' });
            t.rect(s, px, Y0, w, 1.2, deep[i], { r: 0.08, name: 'Lane head' });
            t.text(s, x.value, { x: px + 0.1, y: Y0 + 0.04, w: w - 0.2, h: 1.12, bold: true, fontSize: L.fit(x.value, w - 0.2, 1.05, 46, 20, HF, true), color: 'FFFFFF', align: 'center', valign: 'middle' });
            card(s, px + 0.1, Y0 + 1.3, w - 0.2, ht - 1.42);
            body(s, x.label, px + 0.2, Y0 + 1.36, w - 0.4, ht - 1.54, { max: 15, align: 'center', valign: 'middle' });
          }
          if (d.note) { card(s, X0, Y0 + 2.84, CW, YB - Y0 - 2.84); body(s, d.note, X0 + 0.16, Y0 + 2.88, CW - 0.32, YB - Y0 - 2.92, { max: 14, color: C.muted, valign: 'middle' }); }
        },
        async (d) => { // the sprint's one number on a dark board, two smaller beside it
          const s = await newSlide('focus'); dark(s, d);
          const [a, b, c] = d.stats;
          t.text(s, a.value, { x: X0, y: 1.25, w: 5.2, h: 1.55, bold: true, fontSize: L.fit(a.value, 5.2, 1.5, 76, 28, HF, true), color: neon[0], valign: 'middle' });
          body(s, a.label, X0, 2.85, 5.0, 0.9, { max: 16, color: pale });
          for (const [i, x] of [b, c].entries()) {
            const y = 1.3 + i * 1.28;
            t.rect(s, 5.95, y, 3.6, 1.18, nightUp, { r: 0.08, name: 'Tile' });
            t.text(s, x.value, { x: 6.1, y: y + 0.05, w: 3.3, h: 0.56, bold: true, fontSize: L.fit(x.value, 3.3, 0.54, 28, 15, HF, true), color: neon[i + 1], valign: 'middle' });
            body(s, x.label, 6.1, y + 0.62, 3.3, 0.5, { max: 12, color: pale });
          }
          if (d.note) body(s, d.note, X0, 3.98, CW, 1.15, { max: 13, color: soft, valign: 'middle' });
        },
        async (d) => { // counters in a column: a coloured chip and a line each, the note in a lane of its own
          const s = await page(d); blank(s); const lw = d.note ? 6.3 : CW, rh = (YB - Y0 - 0.2) / 3;
          for (const [i, x] of d.stats.entries()) {
            const y = Y0 + i * (rh + 0.1);
            card(s, X0, y, lw, rh);
            chip(s, X0 + 0.1, y + 0.1, 2.5, rh - 0.2, deep[i + 2]);
            t.text(s, x.value, { x: X0 + 0.18, y: y + 0.1, w: 2.34, h: rh - 0.2, bold: true, fontSize: L.fit(x.value, 2.34, rh - 0.26, 36, 16, HF, true), color: 'FFFFFF', align: 'center', valign: 'middle' });
            body(s, x.label, X0 + 2.75, y + 0.05, lw - 2.9, rh - 0.1, { max: 15, valign: 'middle' });
          }
          if (d.note) { t.rect(s, X0 + 6.45, Y0, CW - 6.45, YB - Y0, C.lane, { r: 0.08, name: 'Lane' }); card(s, X0 + 6.55, Y0 + 0.1, CW - 6.65, YB - Y0 - 0.2); body(s, d.note, X0 + 6.67, Y0 + 0.18, CW - 6.89, YB - Y0 - 0.36, { max: 14, valign: 'middle' }); }
        },
      ],
      compare: [
        async (d) => { // two lanes side by side, the tasks in each turned to face the arrow between them
          const s = await page(d); blank(s); const w = 4.25, cx = 5.01, n = Math.max(d.left.items.length, d.right.items.length), top = 1.82, av = YB - top - 0.08, rh = av / n, f = 0.1;
          const fs = Math.min(...[...d.left.items, ...d.right.items].map((v) => L.fit(v, w - 0.5, rh - f - 0.08, 13, 10, 'Calibri')));
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? cx + 0.31 : cx - 0.31 - w, c = i ? deep[1] : deep[4];
            t.rect(s, x, Y0, w, YB - Y0, C.lane, { r: 0.08, name: 'Lane' });
            head(s, side.h, x + 0.14, Y0 + 0.06, w - 0.28, 0.48, { max: 15, color: c, align: i ? 'left' : 'right' });
            for (const [j, v] of side.items.entries()) {
              const y = top + j * rh;
              card(s, x + 0.08, y, w - 0.16, rh - f); t.rect(s, i ? x + 0.08 : x + w - 0.14, y + 0.05, 0.06, rh - f - 0.1, c, { name: 'Edge' });
              t.text(s, v, { x: x + 0.24, y: y + 0.02, w: w - 0.48, h: rh - f - 0.04, fontSize: fs, align: i ? 'left' : 'right', valign: 'middle' });
            }
          }
          t.oval(s, cx - 0.26, 2.95, 0.52, 0.52, C.accent); t.img(s, await L.icon('FiArrowRight', 'FFFFFF', 3), cx - 0.15, 3.06, 0.3, 0.3);
        },
        async (d) => { // two swimlanes, one over the other, the tasks as flat chips in a grid
          const s = await page(d); blank(s); const hh = 1.92;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = Y0 + i * (hh + 0.1), c = deep[i ? 5 : 3], n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.14) / rws, w = 3.42;
            t.rect(s, X0, y, CW, hh, C.lane, { r: 0.08, name: 'Swimlane' }); t.rect(s, X0, y, 1.95, hh, c, { r: 0.08, name: 'Lane name' });
            head(s, side.h, X0 + 0.1, y + 0.08, 1.75, hh - 0.16, { max: 15, color: 'FFFFFF', align: 'center' });
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.2, rh - 0.1, 13, 10, 'Calibri')));
            for (const [j, v] of side.items.entries()) {
              const x = X0 + 2.05 + (j % 2) * (w + 0.08), yy = y + 0.07 + Math.floor(j / 2) * rh;
              card(s, x, yy, w, rh - 0.06);
              t.text(s, v, { x: x + 0.1, y: yy + 0.01, w: w - 0.2, h: rh - 0.08, fontSize: fs, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // a dark board with only one wide card still on it, the remark above it
          const s = await newSlide('focus'); dark(s, d);
          if (d.caption) body(s, d.caption, X0, 1.2, CW, 1.2, { max: 13.5, color: soft, valign: 'middle' });
          t.rect(s, X0, 2.5, CW, 2.62, nightUp, { r: 0.1, line: { color: neon[2], width: 2 }, name: 'Card' });
          t.img(s, await L.icon('FiFlag', neon[2], 2), X0 + 0.2, 2.66, 0.44, 0.44);
          t.text(s, L.runs(d.text), { x: X0 + 0.85, y: 2.6, w: CW - 1.1, h: 2.42, bold: true, fontSize: L.fit(d.text, CW - 1.1, 2.38, 30, 16, HF, true), color: 'FFFFFF', valign: 'middle' });
        },
        async (d) => { // a yellow blocker slapped across three lanes, the remark on a card in the fourth
          const s = await page(d, 'focus');
          t.rect(s, 0.65, 1.4, 6.5, 3.65, C.pal[2], { r: 0.08, rotate: -0.8, shadow: 0.25, blur: 6, offset: 3, name: 'Blocker' });
          t.img(s, await L.icon('FiAlertTriangle', C.ink, 2), 0.9, 1.55, 0.44, 0.44);
          t.text(s, L.runs(d.text), { x: 0.95, y: 2.0, w: 5.9, h: 2.9, bold: true, fontSize: L.fit(d.text, 5.9, 2.85, 30, 16, HF, true), color: C.ink, valign: 'top' });
          if (d.caption) { card(s, 7.45, 1.4, 2.04, 3.65); body(s, d.caption, 7.53, 1.47, 1.88, 3.51, { max: 14, valign: 'middle' }); }
        },
      ],
      timeline: [
        async (d) => { // a roadmap: a coloured bar with the sprint's date runs above each lane's card
          const s = await page(d), w = 2.2, g = 0.12;
          for (const [i, it] of d.items.entries()) {
            const x = X0 + i * (w + g);
            t.shape(s, 'PENTAGON', { x, y: Y0 + 0.08, w: w + 0.08, h: 0.58, fill: { color: deep[i] }, objectName: 'Sprint' });
            head(s, it.year, x + 0.1, Y0 + 0.08, w - 0.25, 0.58, { max: 15, color: 'FFFFFF' });
            card(s, x + 0.08, Y0 + 0.78, w - 0.16, YB - Y0 - 0.86);
            head(s, it.h, x + 0.18, Y0 + 0.84, w - 0.36, 0.52, { max: 14 });
            body(s, it.t, x + 0.18, Y0 + 1.38, w - 0.36, YB - Y0 - 1.5, { max: 14 });
          }
        },
        async (d) => { // the release line across the board, cards above and below it in turn
          const s = await page(d); blank(s); const ty = 3.1, hh = 1.72, w = 4.05;
          t.rect(s, X0, ty, CW, 0.12, C.accent, { r: 0.05, name: 'Release line' });
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = X0 + 0.05 + (i >> 1) * 4.55 + (above ? 0 : 0.4), y = above ? Y0 + 0.02 : YB - hh;
            t.line(s, x + 0.2, above ? y + hh : ty + 0.12, 0, above ? ty - y - hh : y - ty - 0.12, C.accent, 1.5);
            t.oval(s, x + 0.08, ty - 0.06, 0.24, 0.24, 'FFFFFF', { line: { color: deep[i], width: 3 } });
            card(s, x, y, w, hh);
            chip(s, x + 0.1, y + 0.08, 1.35, 0.36, deep[i], it.year, { max: 13 });
            head(s, it.h, x + 1.53, y + 0.06, w - 1.65, 0.4, { max: 13 });
            body(s, it.t, x + 0.12, y + 0.5, w - 0.24, hh - 0.56, { max: 13 });
          }
        },
        async (d) => { // the done lane read from the top: one long card, a log of what shipped and when
          const s = await page(d); blank(s); const rh = (YB - Y0) / 4;
          t.rect(s, X0, Y0, CW, YB - Y0, C.lane, { r: 0.08, name: 'Lane' });
          for (const [i, it] of d.items.entries()) {
            const y = Y0 + i * rh, x = X0 + (i % 2 ? 0.5 : 0.1), w = CW - 0.6;
            card(s, x, y + 0.05, w, rh - 0.1);
            t.img(s, await L.icon('FiCheckCircle', deep[1], 2), x + 0.1, y + rh / 2 - 0.15, 0.3, 0.3);
            head(s, it.year, x + 0.48, y + 0.07, 1.3, rh - 0.14, { max: 14, color: deep[0] });
            head(s, it.h, x + 1.85, y + 0.07, 1.7, rh - 0.14, { max: 12.5 });
            body(s, it.t, x + 3.6, y + 0.08, w - 3.7, rh - 0.16, { max: 12, valign: 'middle' });
          }
        },
      ],
    };
    R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    await K.panel(ctx, s, 0.6, 1.4, 4.4, 2.6, 0, {});
    t.text(s, d.title, { x: 0.8, y: 1.55, w: 3.7, h: 1.6, bold: true, fontSize: L.fit(d.title, 3.7, 1.55, 30, 15, 'Arial', true), color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.8, y: 3.15, w: 3.7, h: 0.6, fontSize: 11, color: C.muted });
    await K.panel(ctx, s, 0.6, 4.15, 4.4, 0.85, 1, { big: true });
    t.text(s, `${M.author || ''}  \u2022  ${[M.org, M.loc, M.year].filter(Boolean).join(', ')}`, { x: 0.8, y: 4.15, w: 4.0, h: 0.85, fontSize: 12, bold: true, color: C.accent, valign: 'middle' });
    if (d.image) await K.photo(ctx, s, d.image, 5.45, 1.5, 4.0, 2.4);
    for (let k = 0; k < 3; k++) await K.panel(ctx, s, 5.37 + k * 1.4, 4.15, 1.25, 0.85, k + 2, {});
    metaFooter({ color: C.muted, y: 5.3 })(ctx, s);
  },
};
module.exports = { id: 92, slug: 'kanban', name: 'Kanban', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "loyiha boshqaruvi tili: vazifa, holat, mas'uliyat va muddat; qisqa va amaliy", limits: {}, prefer: 'data' } };
