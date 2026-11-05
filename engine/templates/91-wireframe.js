/** 91 Wireframe — UX wireframe: browser window chrome, dashed grey blocks, placeholder crosses, red numbered annotations. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F4F5F7', ink: '2E3440', muted: '6B7280', accent: 'E03131', box: 'FFFFFF', pal: ['E03131', '1C7ED6', '2F9E44', 'F08C00', '7048E8', '0C8599'] };
const K = {
  F: { head: 'Arial', body: 'Arial' }, C, theme: theme('Wireframe', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  area: { x: 0.65, y: 1.5, w: 8.7, h: 3.4 },
  bg: (ctx, s, kind) => { const { t } = ctx; s.background = { color: C.bg }; t.rect(s, 0.35, 0.2, 9.3, 5.15, 'FFFFFF', { line: { color: 'CED4DA', width: 1 }, name: 'Window' }); t.rect(s, 0.35, 0.2, 9.3, 0.38, 'E9ECEF', { name: 'Chrome' }); ['FA5252', 'FAB005', '40C057'].forEach((c, k) => t.oval(s, 0.5 + k * 0.2, 0.32, 0.13, 0.13, c)); t.rect(s, 1.3, 0.27, 5.5, 0.24, 'FFFFFF', { r: 0.12, name: 'URL' }); t.text(s, `slideai.uz/${(ctx.M.topic || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}/${ctx.idx}`, { x: 1.45, y: 0.27, w: 5.3, h: 0.24, fontSize: 8, color: C.muted, valign: 'middle', noFit: true }); },
  panel: (ctx, s, x, y, w, h, k, o) => ctx.t.rect(s, x, y, w, h, o.big ? 'F8F9FA' : C.box, { line: { color: 'ADB5BD', width: 1.25, dashType: 'dash' }, name: 'Block' }),
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.accent, { line: { color: 'FFFFFF', width: 1.5 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { const { t } = ctx; t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { gray: true }), x, y, w, h, { alt: '' }); t.rect(s, x, y, w, h, null, { line: { color: '868E96', width: 1.25 }, name: 'Image box' }); t.rect(s, x, y, 0.55, 0.24, '868E96', { name: 'Tag' }); t.text(s, 'IMG', { x, y, w: 0.55, h: 0.24, fontSize: 8, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', noFit: true }); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'DEE2E6', 0.75),
  bullet: (ctx, s, x, y) => ctx.t.rect(s, x, y + 0.02, 0.13, 0.13, 'ADB5BD', { name: 'Bullet' }),
  title: (ctx, s, d) => { const { t, L } = ctx; t.rect(s, 0.65, 0.78, 0.6, 0.12, 'CED4DA', { name: 'Nav' }); t.rect(s, 1.35, 0.78, 0.6, 0.12, 'CED4DA', { name: 'Nav' }); t.rect(s, 2.05, 0.78, 0.6, 0.12, 'CED4DA', { name: 'Nav' }); if (d.title) t.text(s, d.title, { x: 0.65, y: 0.95, w: 7.9, h: 0.5, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.5, 24, 14, 'Arial', true) }); K.marker(ctx, s, 8.85, 0.85, 0.42, 0, ctx.idx); },
  footer: metaFooter({ color: C.muted, x: 0.65, w: 8.7, y: 5.02, size: 8 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, compareHead: (i) => (i ? C.pal[1] : C.accent),
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, BF = 'Arial', X0 = 0.65, CW = 8.7, Y0 = 1.5, YB = 4.96;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: BF, fontSize: L.fit(v, w, h2, o.max || 13, 10, BF, false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: BF, bold: true, fontSize: L.fit(v, w, h2, o.max || 14, 10, BF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const coal = '1E222B', up = '2A2F3A', line = '3D4452', pale = 'E6E9EF', soft = 'A9B1BE', tint = 'F1F3F5', edge = 'ADB5BD', neon = ['FF8787', '74C0FC', '8CE99A', 'FFD43B'];
    const dash = (s, x, y, w, ht, fill = 'FFFFFF', c = edge) => t.rect(s, x, y, w, ht, fill, { line: { color: c, width: 1.25, dashType: 'dash' }, name: 'Block' });
    const solid = (s, x, y, w, ht, fill = 'FFFFFF', c = edge, r = 0) => t.rect(s, x, y, w, ht, fill, { line: { color: c, width: 1 }, r, name: 'Block' });
    const cross = (s, x, y, w, ht, c = edge) => { t.line(s, x, y, w, ht, c, 1); t.line(s, x, y, w, ht, c, 1, { flipV: true }); };
    const bars = (s, x, y, w, n = 2, c = 'DEE2E6') => { for (let k = 0; k < n; k++) t.rect(s, x, y + k * 0.16, w * (k === n - 1 ? 0.6 : 1), 0.08, c, { name: 'Placeholder line' }); };
    const pin = (s, x, y, d, i) => marker(s, x, y, d, 0, i);
    const dark = (s, d) => { t.rect(s, 0.36, 0.58, 9.28, 4.76, coal, { name: 'Dark mode' }); for (let k = 0; k < 3; k++) t.rect(s, 0.65 + k * 0.7, 0.78, 0.6, 0.12, line, { name: 'Nav' }); t.text(s, d.title, { x: 0.65, y: 0.95, w: 7.9, h: 0.5, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.5, 24, 14, BF, true) }); K.marker(ctx, s, 8.85, 0.85, 0.42, 0, ctx.idx); metaFooter({ color: soft, x: 0.65, w: 8.7, y: 5.02, size: 8 })(ctx, s); };
    const V = {
      image: [
        async (d) => { // a modal over a dimmed page: the picture is the page behind, the words are the dialog
          const s = await newSlide('page'), W2 = 9.28, H2 = 4.4;
          t.img(s, await L.photo(L.src(d.image), W2, H2, { gray: true }), 0.36, 0.58, W2, H2, { alt: '' });
          t.rect(s, 0.36, 0.58, W2, H2, '000000', { t: 45, name: 'Dim' });
          metaFooter({ color: C.muted, x: 0.65, w: 8.7, y: 5.04, size: 8 })(ctx, s);
          t.rect(s, 2.2, 0.82, 5.6, 3.92, 'FFFFFF', { shadow: 0.4, blur: 10, offset: 3, name: 'Modal' });
          head(s, d.title, 2.45, 0.9, 4.5, 0.52, { max: 15 }); K.marker(ctx, s, 7.2, 0.95, 0.4, 0, ctx.idx);
          t.line(s, 2.45, 1.45, 5.1, 0, 'DEE2E6', 1);
          body(s, d.text, 2.45, 1.52, 5.1, 3.1, { max: 13, k: 1.08, valign: 'middle' });
        },
        async (d) => { // a side panel with the words, the picture fills the working area
          const s = await page(d), sw = 3.75;
          t.rect(s, X0, Y0, sw, YB - Y0, tint, { line: { color: 'CED4DA', width: 1 }, name: 'Sidebar' });
          body(s, d.text, X0 + 0.14, Y0 + 0.1, sw - 0.28, YB - Y0 - 0.2, { max: 13, k: 1.08, valign: 'middle' });
          await K.photo(ctx, s, d.image, X0 + sw + 0.15, Y0, CW - sw - 0.15, YB - Y0);
        },
        async (d) => { // a profile card: the picture as a round avatar with placeholder lines beneath
          const s = await page(d), cw = 3.05, dd = 2.2, cx = X0 + cw / 2;
          dash(s, X0, Y0, cw, YB - Y0);
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle', gray: true }), cx - dd / 2, Y0 + 0.14, dd, dd, { alt: '' });
          t.oval(s, cx - dd / 2, Y0 + 0.14, dd, dd, null, { line: { color: '868E96', width: 1.25 } });
          bars(s, X0 + 0.5, Y0 + 2.5, cw - 1.0); t.rect(s, X0 + 0.7, Y0 + 2.88, cw - 1.4, 0.34, C.ink, { r: 0.05, name: 'Button' });
          dash(s, X0 + cw + 0.15, Y0, CW - cw - 0.15, YB - Y0, 'F8F9FA');
          body(s, d.text, X0 + cw + 0.3, Y0 + 0.1, CW - cw - 0.45, YB - Y0 - 0.2, { max: 13, k: 1.12, valign: 'middle' });
        },
        async (d) => { // a landing page: a wide hero picture over the whole width, the copy below
          const s = await page(d);
          await K.photo(ctx, s, d.image, X0, Y0, CW, 1.6);
          pin(s, X0 + CW - 0.5, Y0 + 0.1, 0.36, 1);
          body(s, d.text, X0, Y0 + 1.7, CW, YB - Y0 - 1.7, { max: 12.5, k: 1.05 });
        },
      ],
      cards: [
        async (d) => { // an accordion: a chevron on each row, the panel open under its heading
          const s = await page(d), n = d.items.length, g = 0.08, rh = (YB - Y0 - g * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const y = Y0 + i * (rh + g);
            solid(s, X0, y, CW, rh); t.rect(s, X0, y, 2.9, rh, tint, { name: 'Row head' });
            t.img(s, await L.icon(it.icon, C.pal[1], 2), X0 + 0.14, y + rh / 2 - 0.15, 0.3, 0.3);
            head(s, it.h, X0 + 0.54, y + 0.04, 2.28, rh - 0.08, { max: 13 });
            body(s, it.t, X0 + 3.02, y + 0.05, CW - 3.5, rh - 0.1, { max: 12.5, valign: 'middle' });
            t.img(s, await L.icon('FiChevronDown', C.muted, 2), X0 + CW - 0.38, y + rh / 2 - 0.12, 0.24, 0.24);
          }
        },
        async (d) => { // a dashboard grid: tiles of two sizes, the first takes a large cell when there are three
          const s = await page(d), n = d.items.length, g = 0.12, w = (CW - g) / 2, ht = (YB - Y0 - g) / 2, cell = n === 4 ? [[X0, Y0, w, ht], [X0 + w + g, Y0, w, ht], [X0, Y0 + ht + g, w, ht], [X0 + w + g, Y0 + ht + g, w, ht]] : [[X0, Y0, w, YB - Y0], [X0 + w + g, Y0, w, ht], [X0 + w + g, Y0 + ht + g, w, ht]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, cw, ch] = cell[i], big = ch > 2;
            solid(s, x, y, cw, ch, 'FFFFFF', 'CED4DA', 0.05);
            t.rect(s, x, y, cw, 0.08, C.pal[i], { name: 'Tile edge' });
            t.img(s, await L.icon(it.icon, C.pal[i], 2), x + 0.14, y + 0.18, big ? 0.5 : 0.3, big ? 0.5 : 0.3);
            head(s, it.h, x + (big ? 0.76 : 0.52), y + 0.13, cw - (big ? 0.9 : 0.66), big ? 0.6 : 0.4, { max: big ? 18 : 13 });
            body(s, it.t, x + 0.16, y + (big ? 0.85 : 0.58), cw - 0.32, ch - (big ? 1.0 : 0.66), { max: big ? 16 : 12.5, k: big ? 1.15 : undefined });
          }
        },
        async (d) => { // dark mode: a row of phones on the desk, each at its own height
          const s = await newSlide('page'); dark(s, d);
          const n = d.items.length, g = 0.14, w = (CW - g * (n - 1)) / n, ht = 3.08;
          for (const [i, it] of d.items.entries()) {
            const x = X0 + i * (w + g), y = i % 2 ? 1.88 : 1.5, c = neon[i];
            t.rect(s, x, y, w, ht, up, { r: 0.14, line: { color: soft, width: 1.5 }, name: 'Phone' });
            t.rect(s, x + w / 2 - 0.22, y + 0.07, 0.44, 0.06, soft, { r: 0.03, name: 'Speaker' });
            t.img(s, await L.icon(it.icon, c, 2), x + w / 2 - 0.17, y + 0.2, 0.34, 0.34);
            head(s, it.h, x + 0.12, y + 0.58, w - 0.24, 0.52, { max: 13, color: c, align: 'center' });
            body(s, it.t, x + 0.12, y + 1.12, w - 0.24, ht - 1.22, { max: 12, color: pale, align: 'center' });
          }
        },
        async (d) => { // an empty placeholder in the middle, numbered pins with call-out notes around it
          const s = await page(d), n = d.items.length, cw = 3.1, ch = 1.66, xr = X0 + CW - cw, cell = n === 4 ? [[X0, Y0], [xr, Y0], [X0, YB - ch], [xr, YB - ch]] : [[X0, Y0], [xr, (Y0 + YB - ch) / 2], [X0, YB - ch]], bx = 3.95, by = 2.5, bw = 2.1, bh = 1.45;
          t.rect(s, bx, by, bw, bh, tint, { line: { color: '868E96', width: 1.25 }, name: 'Placeholder' }); cross(s, bx, by, bw, bh);
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i], right = x > 5, py = y + ch / 2, ex = right ? bx + bw : bx;
            t.line(s, right ? ex : x + cw, py, right ? x - ex : ex - x - cw, 0, C.accent, 1);
            t.line(s, ex, Math.min(py, by + bh / 2), 0, Math.abs(py - by - bh / 2), C.accent, 1);
            dash(s, x, y, cw, ch, 'FFFFFF', C.accent);
            pin(s, x + 0.08, y + 0.08, 0.34, i + 1);
            t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.5, y + 0.12, 0.26, 0.26);
            head(s, it.h, x + 0.82, y + 0.06, cw - 0.9, 0.4, { max: 12 });
            body(s, it.t, x + 0.12, y + 0.5, cw - 0.24, ch - 0.56, { max: 11.5 });
          }
        },
      ],
      process: [
        async (d) => { // a stepper: numbered circles on a track, each step's panel below
          const s = await page(d), n = d.steps.length, w = CW / n;
          t.line(s, X0 + w / 2, Y0 + 0.24, w * (n - 1), 0, edge, 2.5);
          for (const [i, st] of d.steps.entries()) {
            const x = X0 + i * w;
            await pin(s, x + w / 2 - 0.24, Y0, 0.48, i + 1);
            solid(s, x + 0.05, Y0 + 0.62, w - 0.1, YB - Y0 - 0.62, i ? 'FFFFFF' : tint, 'CED4DA');
            head(s, st.h, x + 0.15, Y0 + 0.68, w - 0.3, 0.5, { max: 13, align: 'center' });
            body(s, st.t, x + 0.15, Y0 + 1.2, w - 0.3, YB - Y0 - 1.28, { max: 12.5, align: 'center' });
          }
        },
        async (d) => { // a user flow: boxes in two lines joined by arrows, turning back at the end
          const s = await page(d), n = d.steps.length, w = 4.0, ht = 1.56, xr = X0 + CW - w, cell = n === 4 ? [[X0, Y0], [xr, Y0], [xr, YB - ht], [X0, YB - ht]] : [[X0, Y0], [xr, Y0], [xr, YB - ht]], ah = (x, y, ww) => { t.line(s, x, y, ww, 0, C.accent, 1.75); t.shape(s, 'ISOSCELES_TRIANGLE', { x: ww > 0 ? x + ww - 0.05 : x + ww - 0.06, y: y - 0.06, w: 0.12, h: 0.12, rotate: ww > 0 ? 90 : 270, fill: { color: C.accent }, objectName: 'Arrow' }); };
          t.line(s, X0 + w, Y0 + ht / 2, xr - X0 - w - 0.06, 0, C.accent, 1.75); t.shape(s, 'ISOSCELES_TRIANGLE', { x: xr - 0.1, y: Y0 + ht / 2 - 0.06, w: 0.12, h: 0.12, rotate: 90, fill: { color: C.accent }, objectName: 'Arrow' });
          t.line(s, xr + w / 2, Y0 + ht, 0, YB - ht - Y0 - ht - 0.06, C.accent, 1.75); t.shape(s, 'ISOSCELES_TRIANGLE', { x: xr + w / 2 - 0.06, y: YB - ht - 0.1, w: 0.12, h: 0.12, rotate: 180, fill: { color: C.accent }, objectName: 'Arrow' });
          if (n === 4) { t.line(s, X0 + w + 0.06, YB - ht / 2, xr - X0 - w - 0.06, 0, C.accent, 1.75); t.shape(s, 'ISOSCELES_TRIANGLE', { x: X0 + w - 0.02, y: YB - ht / 2 - 0.06, w: 0.12, h: 0.12, rotate: 270, fill: { color: C.accent }, objectName: 'Arrow' }); }
          for (const [i, st] of d.steps.entries()) {
            const [x, y] = cell[i];
            solid(s, x, y, w, ht, 'FFFFFF', '868E96', 0.08);
            await pin(s, x + 0.1, y + 0.08, 0.38, i + 1);
            head(s, st.h, x + 0.56, y + 0.07, w - 0.66, 0.4, { max: 13 });
            body(s, st.t, x + 0.14, y + 0.5, w - 0.28, ht - 0.56, { max: 12.5 });
          }
        },
        async (d) => { // a thread of comments up the middle: pins on one line, notes on either side
          const s = await page(d), n = d.steps.length, w = 4.0, ch = 1.62, cx = 5, ys = n === 4 ? [Y0, Y0 + 0.24, YB - ch, YB - ch] : [Y0, (Y0 + YB - ch) / 2, YB - ch], my = n === 4 ? [1.6, 2.4, 3.2, 4.0] : [1.95, 2.95, 3.95];
          t.line(s, cx, Y0, 0, YB - Y0, edge, 2);
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? cx + 0.35 : cx - 0.35 - w, y = ys[i];
            dash(s, x, y, w, ch);
            await pin(s, cx - 0.21, my[i], 0.42, i + 1);
            head(s, st.h, x + 0.12, y + 0.06, w - 0.24, 0.42, { max: 13, align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.12, y + 0.5, w - 0.24, ch - 0.56, { max: 12, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // a tree view: each level opens one step further in, with its elbow line
          const s = await page(d), n = d.steps.length, rh = (YB - Y0) / n, ind = n === 4 ? 0.78 : 1.1;
          for (const [i, st] of d.steps.entries()) {
            const y = Y0 + i * rh, x = X0 + i * ind, w = CW - i * ind;
            if (i) { t.line(s, x - ind + 0.2, y - 0.1, 0, rh * 0.5 + 0.1, edge, 1.25); t.line(s, x - ind + 0.2, y + rh * 0.4, ind - 0.2, 0, edge, 1.25); }
            solid(s, x, y + 0.03, w, rh - 0.08, i % 2 ? tint : 'FFFFFF', 'CED4DA');
            await pin(s, x + 0.08, y + rh / 2 - 0.21, 0.38, i + 1);
            head(s, st.h, x + 0.54, y + 0.05, 1.75, rh - 0.12, { max: 12 });
            body(s, st.t, x + 2.34, y + 0.06, w - 2.46, rh - 0.14, { max: 12, valign: 'middle' });
          }
        },
      ],
      stats: [
        async (d) => { // a data table: a header strip, three rows, the note in a toast
          const s = await page(d), hh = d.note ? 2.35 : 3.46, rh = (hh - 0.26) / 3;
          t.rect(s, X0, Y0, CW, 0.26, 'E9ECEF', { name: 'Table head' }); bars(s, X0 + 0.7, Y0 + 0.09, 0.9, 1, edge); bars(s, X0 + 2.3, Y0 + 0.09, 1.0, 1, edge); bars(s, X0 + 5, Y0 + 0.09, 1.6, 1, edge);
          for (const [i, x] of d.stats.entries()) {
            const y = Y0 + 0.26 + i * rh;
            t.rect(s, X0, y, CW, rh, i % 2 ? 'F8F9FA' : 'FFFFFF', { line: { color: 'DEE2E6', width: 0.75 }, name: 'Row' });
            await pin(s, X0 + 0.14, y + rh / 2 - 0.17, 0.34, i + 1);
            t.text(s, x.value, { x: X0 + 0.7, y, w: 3.0, h: rh, fontFace: BF, bold: true, fontSize: L.fit(x.value, 3.0, rh - 0.1, 30, 16, BF, true), color: C.pal[i ? i : 1], valign: 'middle' });
            body(s, x.label, X0 + 3.85, y + 0.04, CW - 4.0, rh - 0.08, { max: 13, valign: 'middle' });
          }
          if (d.note) { t.rect(s, X0, Y0 + 2.48, CW, YB - Y0 - 2.48, C.ink, { r: 0.05, name: 'Toast' }); body(s, d.note, X0 + 0.16, Y0 + 2.52, CW - 0.32, YB - Y0 - 2.56, { max: 12, color: 'FFFFFF', valign: 'middle' }); }
        },
        async (d) => { // the dashboard in dark mode: one large reading, two small ones, the note beneath
          const s = await newSlide('page'); dark(s, d);
          const [a, b, c] = d.stats, tp = 2.42, x2 = X0 + 4.5, w2 = CW - 4.5;
          t.rect(s, X0, Y0, 4.35, tp, up, { r: 0.05, line: { color: line, width: 1 }, name: 'Tile' });
          t.text(s, a.value, { x: X0 + 0.2, y: Y0 + 0.14, w: 3.95, h: 1.3, bold: true, fontSize: L.fit(a.value, 3.95, 1.25, 58, 24, BF, true), color: neon[1], valign: 'middle' });
          body(s, a.label, X0 + 0.2, Y0 + 1.48, 3.95, 0.8, { max: 13, color: pale });
          for (const [i, x] of [b, c].entries()) {
            const y = Y0 + i * (tp / 2 + 0.02);
            t.rect(s, x2, y, w2, tp / 2 - 0.04, up, { r: 0.05, line: { color: line, width: 1 }, name: 'Tile' });
            t.text(s, x.value, { x: x2 + 0.14, y: y + 0.04, w: 1.7, h: tp / 2 - 0.12, bold: true, fontSize: L.fit(x.value, 1.7, 0.9, 26, 13, BF, true), color: neon[i ? 2 : 0], valign: 'middle' });
            body(s, x.label, x2 + 1.9, y + 0.05, w2 - 2.02, tp / 2 - 0.14, { max: 11, color: pale, valign: 'middle' });
          }
          if (d.note) body(s, d.note, X0, Y0 + tp + 0.1, CW, YB - Y0 - tp - 0.1, { max: 12, color: soft, valign: 'middle' });
        },
        async (d) => { // three round gauges with an unfilled ring, each at its own height, a label under each
          const s = await page(d), dd = 1.7, cw = CW / 3;
          for (const [i, x] of d.stats.entries()) {
            const cx = X0 + i * cw + cw / 2, y = Y0 + (i === 1 ? 0.22 : 0);
            t.oval(s, cx - dd / 2, y, dd, dd, 'FFFFFF', { line: { color: C.pal[i ? i : 1], width: 5 }, name: 'Ring' });
            t.text(s, x.value, { x: cx - dd / 2 + 0.14, y: y + 0.3, w: dd - 0.28, h: dd - 0.6, fontFace: BF, bold: true, fontSize: L.fit(x.value, dd - 0.28, 0.95, 30, 12, BF, true), color: C.ink, align: 'center', valign: 'middle' });
            body(s, x.label, X0 + i * cw + 0.1, y + dd + 0.06, cw - 0.2, 0.55, { max: 11.5, align: 'center' });
          }
          if (d.note) { dash(s, X0, 4.06, CW, YB - 4.06, 'F8F9FA'); body(s, d.note, X0 + 0.14, 4.09, CW - 0.28, YB - 4.12, { max: 11.5, valign: 'middle' }); }
        },
      ],
      compare: [
        async (d) => { // a before-and-after slider: a handle down the middle, the two views mirrored on it
          const s = await page(d), w = 3.95, cx = 5, n = Math.max(d.left.items.length, d.right.items.length), top = 2.06, av = YB - top, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 13, w - 0.05, BF, 0.12, av);
          t.rect(s, X0, Y0, cx - X0, YB - Y0, tint, { name: 'View' }); t.rect(s, cx, Y0, X0 + CW - cx, YB - Y0, 'FFFFFF', { line: { color: 'CED4DA', width: 1 }, name: 'View' });
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? cx + 0.26 : X0 + 0.1;
            head(s, side.h, x, Y0 + 0.06, w, 0.46, { max: 15, color: i ? C.pal[1] : C.accent, align: i ? 'left' : 'right' });
            for (const [j, v] of side.items.entries()) t.text(s, v, { x, y: top + j * rh, w: w - 0.05, h: rh, fontFace: BF, fontSize: fs, align: i ? 'left' : 'right', valign: 'middle' });
          }
          t.line(s, cx, Y0, 0, YB - Y0, C.ink, 2);
          t.oval(s, cx - 0.2, (Y0 + YB) / 2 - 0.2, 0.4, 0.4, C.ink); t.img(s, await L.icon('FiCode', 'FFFFFF', 2), cx - 0.12, (Y0 + YB) / 2 - 0.12, 0.24, 0.24);
        },
        async (d) => { // two open panels of a stack, a coloured strip with the name, the list on a grid
          const s = await page(d), hh = 1.68, g = 0.1;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = Y0 + i * (hh + g), c = i ? C.pal[1] : C.pal[0], n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.44) / rws, w = (CW - 0.36) / 2;
            solid(s, X0, y, CW, hh, 'FFFFFF', c);
            t.rect(s, X0, y, CW, 0.36, c, { name: 'Panel head' });
            head(s, side.h, X0 + 0.14, y + 0.02, CW - 0.8, 0.32, { max: 13, color: 'FFFFFF' });
            t.img(s, await L.icon('FiChevronUp', 'FFFFFF', 2), X0 + CW - 0.32, y + 0.07, 0.22, 0.22);
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.22, rh - 0.02, 12, 10, BF)));
            for (const [j, v] of side.items.entries()) {
              const x = X0 + 0.12 + (j % 2) * (w + 0.1), yy = y + 0.4 + Math.floor(j / 2) * rh;
              t.rect(s, x, yy + rh / 2 - 0.06, 0.12, 0.12, null, { line: { color: c, width: 1.25 }, name: 'Checkbox' });
              t.text(s, v, { x: x + 0.2, y: yy, w: w - 0.22, h: rh, fontFace: BF, fontSize: fs, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // dark mode, one sentence on screen, a pin on its corner
          const s = await newSlide('page'); dark(s, d);
          t.rect(s, X0, 1.6, 0.07, 1.95, neon[0], { name: 'Accent' });
          t.text(s, L.runs(d.text), { x: X0 + 0.25, y: 1.55, w: CW - 0.3, h: 2.05, bold: true, fontSize: L.fit(d.text, CW - 0.3, 2, 30, 15, BF, true), color: 'FFFFFF', valign: 'middle' });
          if (d.caption) body(s, d.caption, X0 + 0.25, 3.68, CW - 0.3, YB - 3.68, { max: 13, color: soft });
        },
        async (d) => { // the empty image box, crossed, on one side; the sentence as its caption block
          const s = await page(d, 'focus'), bw = 2.55;
          t.rect(s, X0, Y0, bw, YB - Y0, tint, { line: { color: '868E96', width: 1.25 }, name: 'Placeholder' }); cross(s, X0, Y0, bw, YB - Y0);
          await pin(s, X0 + bw - 0.25, Y0 - 0.14, 0.42, '!');
          t.text(s, L.runs(d.text), { x: X0 + bw + 0.25, y: Y0, w: CW - bw - 0.25, h: 2.1, bold: true, fontSize: L.fit(d.text, CW - bw - 0.25, 2.05, 28, 15, BF, true), color: C.ink, valign: 'middle' });
          if (d.caption) { dash(s, X0 + bw + 0.25, Y0 + 2.15, CW - bw - 0.25, YB - Y0 - 2.15, 'F8F9FA'); body(s, d.caption, X0 + bw + 0.37, Y0 + 2.19, CW - bw - 0.49, YB - Y0 - 2.23, { max: 12, valign: 'middle' }); }
        },
      ],
      timeline: [
        async (d) => { // a version history: one line of commits down the side, a tag holds the date
          const s = await page(d), rh = (YB - Y0) / 4;
          t.line(s, X0 + 0.18, Y0 + 0.2, 0, YB - Y0 - 0.4, edge, 2.5);
          for (const [i, it] of d.items.entries()) {
            const y = Y0 + i * rh;
            t.oval(s, X0 + 0.07, y + rh / 2 - 0.11, 0.22, 0.22, 'FFFFFF', { line: { color: C.pal[i], width: 3 } });
            t.rect(s, X0 + 0.45, y + rh / 2 - 0.17, 1.35, 0.34, C.pal[i] === 'F08C00' ? 'A85F00' : C.pal[i], { r: 0.05, name: 'Tag' });
            head(s, it.year, X0 + 0.47, y + rh / 2 - 0.17, 1.31, 0.34, { max: 12, color: 'FFFFFF', align: 'center' });
            head(s, it.h, X0 + 1.95, y + 0.04, CW - 1.95, 0.3, { max: 13 });
            body(s, it.t, X0 + 1.95, y + 0.33, CW - 1.95, rh - 0.37, { max: 12 });
            if (i < 3) t.line(s, X0 + 1.95, y + rh, CW - 1.95, 0, 'DEE2E6', 0.75);
          }
        },
        async (d) => { // a schedule: equal blocks moved one column on and one row down
          const s = await page(d), w = 5.3, hh = 0.8, sx = (CW - w) / 3, sy = (YB - Y0 - hh) / 3;
          for (let k = 0; k <= 4; k++) t.line(s, X0 + k * sx, Y0, 0, YB - Y0, 'E9ECEF', 1);
          for (const [i, it] of d.items.entries()) {
            const x = X0 + i * sx, y = Y0 + i * sy, c = C.pal[i] === 'F08C00' ? 'A85F00' : C.pal[i];
            solid(s, x, y, w, hh, 'FFFFFF', c);
            t.rect(s, x, y, 1.1, hh, c, { name: 'Date' });
            head(s, it.year, x + 0.04, y + 0.05, 1.02, hh - 0.1, { max: 12, color: 'FFFFFF', align: 'center' });
            head(s, it.h, x + 1.18, y + 0.02, w - 1.26, 0.24, { max: 11 });
            body(s, it.t, x + 1.18, y + 0.26, w - 1.26, hh - 0.28, { max: 11 });
          }
        },
        async (d) => { // a scroll bar across the page, cards snapping above and below it
          const s = await page(d), hh = 1.5, ty = (Y0 + YB) / 2 - 0.06, w = 4.0;
          t.rect(s, X0, ty, CW, 0.12, 'E9ECEF', { r: 0.05, name: 'Track' });
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = X0 + (i >> 1) * 4.4 + (above ? 0 : 0.3), y = above ? Y0 : YB - hh;
            dash(s, x, y, w, hh);
            t.rect(s, above ? x + 0.1 : x + w - 0.6, ty - 0.03, 0.5, 0.18, C.accent, { r: 0.05, name: 'Thumb' });
            head(s, it.year, x + 0.12, y + 0.04, 1.4, 0.4, { max: 15, color: C.accent });
            head(s, it.h, x + 1.55, y + 0.04, w - 1.67, 0.4, { max: 12 });
            body(s, it.t, x + 0.12, y + 0.46, w - 0.24, hh - 0.52, { max: 12 });
          }
        },
      ],
    };
    R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.0, 0.95, 3.3, 3.0);
    else { t.rect(s, 6.0, 0.95, 3.3, 3.0, 'F1F3F5', { line: { color: '868E96', width: 1.25 }, name: 'Image box' }); t.line(s, 6.0, 0.95, 3.3, 3.0, 'ADB5BD', 1); t.line(s, 6.0, 0.95, 3.3, 3.0, 'ADB5BD', 1, { flipV: true }); }
    t.rect(s, 0.75, 0.95, 2.4, 0.3, 'E9ECEF', { name: 'Label' }); t.text(s, [M.org, M.year].filter(Boolean).join(' \u2022 '), { x: 0.8, y: 0.95, w: 2.3, h: 0.3, fontSize: 10, bold: true, color: C.muted, valign: 'middle' });
    t.text(s, d.title, { x: 0.75, y: 1.35, w: 5.0, h: 1.8, bold: true, fontSize: L.fit(d.title, 5.0, 1.75, 36, 18, 'Arial', true), color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.75, y: 3.2, w: 5.0, h: 0.7, fontSize: 12, color: C.muted });
    t.rect(s, 0.75, 4.05, 2.6, 0.5, C.ink, { r: 0.06, name: 'Button' }); t.text(s, M.author || '', { x: 0.75, y: 4.05, w: 2.6, h: 0.5, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    t.text(s, M.loc || '', { x: 3.5, y: 4.05, w: 2.0, h: 0.5, fontSize: 11, color: C.muted, valign: 'middle' });
    K.marker(ctx, s, 5.8, 0.8, 0.4, 0, 1); K.marker(ctx, s, 0.28, 1.4, 0.4, 0, 2);
    metaFooter({ color: C.muted, x: 0.65, w: 8.7, y: 5.02, size: 8 })(ctx, s);
  },
};
module.exports = { id: 91, slug: 'wireframe', name: 'Wireframe', category: 'minimalist', photos: true, build: (c, o) => run(c, o, K), style: { tone: "loyiha hujjati kabi: struktura, funksiya va izohlar; aniq va amaliy", limits: {}, prefer: null } };
