/** 78 Javon — bookshelf: wooden shelves, book spines as markers and cards, bookends, a reading lamp glow. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F4EEE4', ink: '2D241C', muted: '6B5B4C', accent: '8E3B2E', wood: '8B5E3C', pal: ['8E3B2E', '2F5D62', 'C08A3E', '4B4E6D', '6A7F3E', 'A4566B'] };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Javon', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'table' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.45 },
  bg: (ctx, s, kind) => { s.background = { color: C.bg }; ctx.t.rect(s, 0, 4.95, 10, 0.18, C.wood, { name: 'Shelf' }); ctx.t.rect(s, 0, 5.13, 10, 0.06, '6A4429', { name: 'Shelf edge' }); },
  // card = a book standing on the shelf: coloured spine band on the left, cream pages
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, 'FFFBF2', { line: { color: 'D8CBB6', width: 1 }, shadow: 0.15, blur: 5, offset: 2, name: 'Book' }); if (!o.big) { ctx.t.rect(s, x, y, 0.16, h, C.pal[k % 6], { name: 'Spine' }); ctx.t.line(s, x + 0.04, y + 0.25, 0.08, 0, 'E8C77A', 1.5); ctx.t.line(s, x + 0.04, y + h - 0.25, 0.08, 0, 'E8C77A', 1.5); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.rect(s, x + d * 0.18, y, d * 0.64, d, C.pal[k % 6], { r: 0.03, name: 'Spine' }); ctx.t.line(s, x + d * 0.22, y + d * 0.15, d * 0.56, 0, 'E8C77A', 1.25); ctx.t.line(s, x + d * 0.22, y + d * 0.85, d * 0.56, 0, 'E8C77A', 1.25); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 22), bold: true, color: 'FFF6E0', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, 'C08A3E', { name: 'Gilt frame' }); ctx.t.rect(s, x - 0.04, y - 0.04, w + 0.08, h + 0.08, '6A4429', { name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.wood, 2),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.45, 0.3, 0.8, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.35, y: 0.35, w: 8.1, h: 0.72, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: C.muted, y: 5.3, font: 'Cambria' }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Cambria', bold: true, italic: !!o.italic, fontSize: L.fit(v, w, h2, o.max || 16, 10, 'Cambria', true, 1, !!o.italic), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const gilt = 'E8C77A', page0 = 'FFFBF2', edge = 'D8CBB6', room = '2B1D14', cream = 'FFF6E0', edgeW = '6A4429', CV = ['8E3B2E', '2F5D62', '8A6220', '4B4E6D', '55682F', '8F4459'];
    const bands = (s, x, y, w, h2) => { t.line(s, x + 0.06, y + 0.14, w - 0.12, 0, gilt, 1.25); t.line(s, x + 0.06, y + 0.2, w - 0.12, 0, gilt, 0.75); t.line(s, x + 0.06, y + h2 - 0.14, w - 0.12, 0, gilt, 1.25); t.line(s, x + 0.06, y + h2 - 0.2, w - 0.12, 0, gilt, 0.75); };
    const spread = (s, x, y, w, h2) => { // an open book lying on the shelf
      t.rect(s, x - 0.1, y + 0.06, w + 0.2, h2, edgeW, { r: 0.04, name: 'Cover' });
      t.rect(s, x, y, w / 2, h2, page0, { line: { color: edge, width: 0.75 }, name: 'Left page' }); t.rect(s, x + w / 2, y, w / 2, h2, page0, { line: { color: edge, width: 0.75 }, name: 'Right page' });
      t.rect(s, x + w / 2 - 0.16, y, 0.16, h2, 'EFE5D2', { name: 'Gutter' }); t.rect(s, x + w / 2, y, 0.16, h2, 'EFE5D2', { name: 'Gutter' }); t.line(s, x + w / 2, y, 0, h2, 'B8A88E', 1);
    };
    const ribbon = async (s, x, y, w, h2, c) => t.img(s, await svgOnce(ctx, 'rib' + c, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800" viewBox="0 0 400 800" preserveAspectRatio="none"><polygon points="0,0 400,0 400,800 200,750 0,800" fill="#${c}"/></svg>`, 400, 800), x, y, w, h2);
    const library = async (d) => { // the reading room after dark, one lamp on
      const s = await newSlide('focus');
      t.img(s, await svgOnce(ctx, 'lamp', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.5" cy="0.1" r="0.8"><stop offset="0" stop-color="#6E4A28"/><stop offset="1" stop-color="#${room}"/></radialGradient></defs><rect width="1600" height="900" fill="url(#g)"/></svg>`, 1600, 900), 0, 0, 10, 5.625);
      t.rect(s, 0, 4.95, 10, 0.18, C.wood, { name: 'Shelf' }); t.rect(s, 0, 5.13, 10, 0.06, '6A4429', { name: 'Shelf edge' });
      K.marker(ctx, s, 0.45, 0.3, 0.8, ctx.idx, ctx.idx);
      if (d.title) t.text(s, d.title, { x: 1.35, y: 0.35, w: 8.1, h: 0.72, fontFace: 'Cambria', bold: true, color: cream, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.72, 28, 16, 'Cambria', true) });
      metaFooter({ color: 'D8C8B0', y: 5.3, font: 'Cambria' })(ctx, s); return s;
    };
    const V = {
      image: [
        async (d) => { // an open book: the words on the left page, the plate on the right
          const s = await page(d);
          spread(s, 0.6, 1.2, 8.8, 3.68);
          t.text(s, d.text, { x: 0.85, y: 1.33, w: 3.8, h: 3.42, fontSize: L.fit(d.text, 3.8, 3.42, 14, 10, 'Calibri', false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
          t.img(s, await L.photo(L.src(d.image), 3.7, 3.3), 5.35, 1.39, 3.7, 3.3, { alt: '' });
          t.rect(s, 5.35, 1.39, 3.7, 3.3, null, { line: { color: C.muted, width: 0.75 }, name: 'Plate rule' });
        },
        async (d) => { // the portrait on the library wall: an oval picture in a gilt ring
          const s = await page(d), w = 3.05, ht = 3.45, x = 6.05, y = 1.25;
          t.oval(s, x - 0.14, y - 0.14, w + 0.28, ht + 0.28, 'C08A3E', { line: { color: edgeW, width: 1.5 } }); t.oval(s, x - 0.05, y - 0.05, w + 0.1, ht + 0.1, edgeW);
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: 'circle' }), x, y, w, ht, { alt: '' });
          t.text(s, d.text, { x: 0.6, y: 1.25, w: 4.95, h: 3.5, fontSize: L.fit(d.text, 4.95, 3.5, 15, 10, 'Calibri', false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
        },
        async (d) => { // the page is the picture, a broad silk bookmark falls over it with the words
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 4.95, 10, 0.18, C.wood, { name: 'Shelf' }); t.rect(s, 0, 5.13, 10, 0.495, '3E2A1A', { name: 'Footer band' });
          await ribbon(s, 0.7, 0, 4.7, 4.92, C.pal[0]);
          t.line(s, 0.85, 0, 0, 4.68, gilt, 1); t.line(s, 5.25, 0, 0, 4.68, gilt, 1);
          head(s, d.title, 1.05, 0.2, 4.0, 1.0, { max: 22, color: cream });
          body(s, d.text, 1.05, 1.25, 4.0, 3.2, { color: cream, max: 14, k: 1.1, valign: 'middle' });
          metaFooter({ color: 'E9DCC6', y: 5.3, font: 'Cambria' })(ctx, s);
        },
        async (d) => { // a lamp lit in the dark room: the picture is the cover of a closed book
          const s = await library(d), x = 5.6, y = 1.2, w = 3.6, ht = 3.7;
          t.rect(s, x - 0.34, y, 0.34, ht, C.pal[0], { name: 'Book spine' }); bands(s, x - 0.34, y, 0.34, ht);
          t.rect(s, x, y, w, ht, C.pal[0], { name: 'Book cover' });
          t.img(s, await L.photo(L.src(d.image), w - 0.36, ht - 0.36), x + 0.18, y + 0.18, w - 0.36, ht - 0.36, { alt: '' });
          t.rect(s, x + 0.1, y + 0.1, w - 0.2, ht - 0.2, null, { line: { color: gilt, width: 1 }, name: 'Gilt line' });
          body(s, d.text, 0.6, 1.25, 4.5, 3.55, { color: cream, max: 15, k: 1.18, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // great volumes standing on the shelf: the words run across their spines
          const s = await page(d), n = d.items.length, gap = 0.08, w = (8.5 - gap * (n - 1)) / n, b = 4.95, Y = [1.2, 1.5, 1.28, 1.58];
          for (const [i, it] of d.items.entries()) {
            const x = 0.75 + i * (w + gap), y = Y[i];
            t.rect(s, x, y, w, b - y, CV[i], { r: 0.03, shadow: 0.25, blur: 4, offset: 2, name: 'Volume' }); bands(s, x, y, w, b - y);
            t.img(s, await L.icon(it.icon, gilt, 2), x + w / 2 - 0.17, y + 0.27, 0.34, 0.34);
            head(s, it.h, x + 0.12, y + 0.63, w - 0.24, 0.48, { align: 'center', color: cream, max: 14 });
            body(s, it.t, x + 0.15, y + 1.13, w - 0.3, b - y - 1.4, { align: 'center', color: 'FBEEDA' });
          }
        },
        async (d) => { // a pile of books lying flat: each one a line, no two quite the same length
          const s = await page(d), n = d.items.length, rh = 3.68 / n, X = [0.75, 0.55, 0.95, 0.6], WW = [8.5, 8.9, 8.1, 8.75];
          for (const [i, it] of d.items.entries()) {
            const y = 1.25 + i * rh, x = X[i], w = WW[i], hg = rh - 0.05;
            t.rect(s, x, y, w, hg, CV[i], { r: 0.03, name: 'Lying book' });
            t.rect(s, x + w - 0.2, y + 0.06, 0.2, hg - 0.12, page0, { name: 'Page edge' });
            t.line(s, x + 2.95, y + 0.03, 0, hg - 0.06, gilt, 1.25); t.line(s, x + 3.01, y + 0.03, 0, hg - 0.06, gilt, 0.75);
            t.img(s, await L.icon(it.icon, gilt, 2), x + 0.15, y + hg / 2 - 0.16, 0.32, 0.32);
            head(s, it.h, x + 0.55, y + 0.03, 2.32, hg - 0.06, { color: cream, max: 14 });
            body(s, it.t, x + 3.14, y + 0.03, w - 3.44, hg - 0.06, { color: 'FBEEDA', valign: 'middle', max: 13 });
          }
        },
        async (d) => { // cards from the catalogue drawer: red rule, punched hole, a tab with the icon
          const s = await page(d), n = d.items.length, w = 4.3, hh = 1.72;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.28 + Math.floor(i / 2) * (hh + 0.14);
            t.rect(s, x + 0.2, y - 0.1, 0.62, 0.24, CV[i], { name: 'Tab' });
            t.rect(s, x, y, ww, hh, 'FDF7E7', { line: { color: edge, width: 1 }, shadow: 0.15, blur: 4, offset: 2, name: 'Index card' });
            t.img(s, await L.icon(it.icon, CV[i], 2), x + 0.15, y + 0.13, 0.34, 0.34);
            head(s, it.h, x + 0.58, y + 0.08, ww - 0.72, 0.42, { color: CV[i] });
            t.line(s, x + 0.12, y + 0.53, ww - 0.24, 0, 'C0584A', 1.25);
            t.oval(s, x + ww / 2 - 0.07, y + hh - 0.2, 0.14, 0.14, C.bg, { line: { color: edge, width: 0.75 } });
            body(s, it.t, x + 0.16, y + 0.58, ww - 0.32, hh - 0.8, { max: 13.5 });
          }
        },
        async (d) => { // an open book again, read as a list: the items take turns on its two pages
          const s = await page(d), n = d.items.length, rows = Math.ceil(n / 2);
          spread(s, 0.6, 1.2, 8.8, 3.68);
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, x = right ? 5.3 : 0.82, w = 3.88, hh = 3.56 / rows, y = 1.27 + Math.floor(i / 2) * hh + (n === 3 && right ? hh / 2 : 0), a = 'left';
            t.img(s, await L.icon(it.icon, C.accent, 2), x, y + 0.06, 0.32, 0.32);
            head(s, it.h, x + 0.42, y + 0.02, w - 0.42, 0.4, { color: C.accent });
            body(s, it.t, x, y + 0.44, w, hh - 0.5, { max: 13.5, align: a });
            if (i + 2 < n) t.line(s, x + 1.2, y + hh - 0.03, w - 2.4, 0, gilt, 1.5);
          }
        },
      ],
      process: [
        async (d) => { // the library ladder against the shelves: a rung for every step, a line of text at each
          const s = await page(d), n = d.steps.length, rh = 3.6 / n;
          t.rect(s, 0.7, 1.15, 0.09, 3.8, C.wood, { name: 'Rail' }); t.rect(s, 1.5, 1.15, 0.09, 3.8, C.wood, { name: 'Rail' });
          for (const [i, st] of d.steps.entries()) {
            const y = 1.25 + i * rh, ry = y + rh / 2;
            t.rect(s, 0.72, ry - 0.2, 0.85, 0.4, C.wood, { r: 0.02, name: 'Rung' });
            t.text(s, L.ROMAN[i], { x: 0.72, y: ry - 0.2, w: 0.85, h: 0.4, fontFace: 'Cambria', bold: true, fontSize: 15, color: cream, align: 'center', valign: 'middle' });
            head(s, st.h, 1.85, y + 0.03, 2.45, rh - 0.06, { color: CV[i] });
            body(s, st.t, 4.4, y + 0.03, 5.0, rh - 0.06, { valign: 'middle', max: 13.5 });
            if (i < n - 1) t.line(s, 1.85, y + rh, 7.55, 0, edge, 0.75);
          }
        },
        async (d) => { // the reading pile grows: every step adds one more book under its words
          const s = await page(d), n = d.steps.length, cw = 8.8 / n, bh = 0.3, b = 4.95;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw, pw = cw - 0.25, top = b - (i + 1) * bh;
            for (let k = 0; k <= i; k++) t.rect(s, x + (k % 2 ? 0.1 : 0.02), b - (k + 1) * bh, pw - 0.1, bh - 0.02, CV[k], { r: 0.02, name: 'Pile' });
            await marker(s, x, 1.2, 0.6, i, i + 1);
            head(s, st.h, x + 0.62, 1.2, cw - 0.75, 0.6, { max: 14, color: C.accent });
            body(s, st.t, x + 0.02, 1.85, cw - 0.22, top - 1.92, { max: 14 });
          }
        },
        async (d) => { // long silk bookmarks falling from the top of the page: the words are written on them
          const s = await newSlide('page'), n = d.steps.length, gap = 0.16, w0 = (8.8 - gap * (n - 1)) / n, Y = [3.55, 3.2, 3.55, 3.2], top = 1.1;
          K.marker(ctx, s, 0.45, 0.3, 0.8, ctx.idx, ctx.idx);
          t.text(s, d.title, { x: 1.35, y: 0.35, w: 8.1, h: 0.72, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.72, 28, 16, 'Cambria', true) });
          K.footer(ctx, s);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w0 + gap), hg = Y[i] + (5 - 4.95 - 0.1) + 0.05 + 0.1;
            await ribbon(s, x, top, w0, hg, CV[i]);
            t.text(s, String(i + 1), { x: x + 0.14, y: top + 0.08, w: 0.6, h: 0.52, fontFace: 'Cambria', bold: true, fontSize: 26, color: gilt, valign: 'middle' });
            head(s, st.h, x + 0.14, top + 0.6, w0 - 0.28, 0.45, { color: cream, max: 14 });
            body(s, st.t, x + 0.14, top + 1.07, w0 - 0.28, hg - 1.32, { color: 'FBEEDA', max: 13.5 });
          }
        },
      ],
      stats: [
        async (d) => { // three library stamps, inked round the figures
          const s = await page(d), cw = 8.8 / 3, dia = 1.95;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * cw + (cw - dia) / 2, c = CV[[0, 3, 1][i]];
            t.oval(s, px, 1.22, dia, dia, null, { line: { color: c, width: 2.5 } }); t.oval(s, px + 0.1, 1.32, dia - 0.2, dia - 0.2, null, { line: { color: c, width: 0.75 } });
            t.text(s, x.value, { x: px + 0.2, y: 1.72, w: dia - 0.4, h: 0.95, fontFace: 'Cambria', bold: true, color: c, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 0.42, 0.9, 32, 13, 'Cambria', true) });
            body(s, x.label, 0.6 + i * cw + 0.12, 3.25, cw - 0.24, 0.62, { align: 'center', max: 13 });
          }
          if (d.note) { t.line(s, 3.5, 3.92, 3, 0, gilt, 1.25); body(s, d.note, 0.8, 3.98, 8.4, 0.9, { color: C.muted, align: 'center', valign: 'middle', max: 13 }); }
        },
        async (d) => { // a hard-bound volume carries the main figure in gilt, two labels stand beside it
          const s = await page(d), [a, ...rest] = d.stats;
          t.rect(s, 0.6, 1.2, 0.32, 3.75, '6F2B20', { name: 'Spine' }); bands(s, 0.6, 1.2, 0.32, 3.75);
          t.rect(s, 0.92, 1.2, 3.5, 3.75, C.pal[0], { name: 'Cover' }); t.rect(s, 1.02, 1.3, 3.3, 3.55, null, { line: { color: gilt, width: 1.25 }, name: 'Gilt frame' });
          t.text(s, a.value, { x: 1.1, y: 1.6, w: 3.14, h: 1.3, fontFace: 'Cambria', bold: true, color: gilt, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.05, 1.25, 56, 22, 'Cambria', true) });
          body(s, a.label, 1.3, 3.0, 2.74, 1.6, { color: cream, align: 'center', max: 15 });
          for (const [i, x] of rest.entries()) {
            const y = 1.25 + i * 1.08;
            await panel(s, 4.7, y, 4.7, 0.96, i + 1);
            t.text(s, x.value, { x: 4.95, y, w: 1.7, h: 0.96, fontFace: 'Cambria', bold: true, color: CV[i + 1], align: 'center', valign: 'middle', fontSize: L.fit(x.value, 1.65, 0.75, 28, 14, 'Cambria', true) });
            body(s, x.label, 6.75, y + 0.06, 2.5, 0.84, { valign: 'middle', max: 13 });
          }
          if (d.note) body(s, d.note, 4.7, 3.45, 4.7, 1.42, { color: C.muted, valign: 'middle', max: 13 });
        },
      ],
      compare: [
        async (d) => { // the two pages of a spread: each column looks across the gutter at the other
          const s = await page(d), w = 3.65;
          spread(s, 0.6, 1.2, 8.8, 3.68);
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.2, 2.8);
          head(s, d.left.h, 0.85, 1.28, w, 0.5, { align: 'right', max: 18, color: C.accent, italic: true }); head(s, d.right.h, 5.5, 1.28, w, 0.5, { max: 18, color: CV[1], italic: true });
          t.line(s, 2.2, 1.8, w - 1.1 + 0.05, 0, gilt, 1.5); t.line(s, 5.5, 1.8, w - 1.1, 0, gilt, 1.5);
          let y = 1.93;
          for (const [k, rh] of rows.entries()) {
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.85, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.5, y, w, h: rh, fontSize: fs, color: C.ink });
            y += rh;
          }
        },
        async (d) => { // two shelves, one above the other: a bookend with the heading, slim books for the items
          const s = await page(d), hh = 1.75;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.22 + i * (hh + 0.1), n = side.items.length, cw = 6.65 / n, b = y + hh;
            if (i === 0) { t.rect(s, 0, b, 10, 0.1, C.wood, { name: 'Shelf' }); }
            t.rect(s, 0.6, y, 1.95, hh, CV[i ? 1 : 0], { r: 0.03, name: 'Bookend' });
            head(s, side.h, 0.7, y + 0.1, 1.75, hh - 0.2, { align: 'center', color: cream, max: 17 });
            for (const [k, it] of side.items.entries()) {
              const x = 2.65 + k * cw;
              t.rect(s, x, y + 0.08, cw - 0.07, hh - 0.08, page0, { line: { color: edge, width: 1 }, name: 'Slim book' });
              t.rect(s, x, y + 0.08, cw - 0.07, 0.1, CV[(k + 2 + i) % 6], { name: 'Head band' });
              body(s, it, x + 0.09, y + 0.24, cw - 0.25, hh - 0.3, { valign: 'middle', max: 13.5 });
            }
          }
        },
      ],
      statement: [
        async (d) => { // the reading room at night: the lamp's light falls on the thought, the note waits in the shade past a gilt rule
          const s = await library(d);
          t.img(s, await svgOnce(ctx, 'cone', `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3A0" stop-opacity="0.5"/><stop offset="1" stop-color="#FFE3A0" stop-opacity="0.03"/></linearGradient></defs><polygon points="340,0 460,0 800,400 0,400" fill="url(#c)"/></svg>`, 800, 400), 0.1, 1.1, 6.3, 3.85);
          t.text(s, L.runs(d.text), { x: 0.75, y: 1.75, w: 5.0, h: 2.95, fontFace: 'Cambria', bold: true, italic: true, color: 'FFF2C9', align: 'center', valign: 'middle', fontSize: L.fit(d.text, 5.0, 2.9, 30, 15, 'Cambria', true, 1, true) });
          t.line(s, 6.6, 1.35, 0, 3.4, gilt, 1.25);
          if (d.caption) body(s, d.caption, 6.85, 1.35, 2.55, 3.4, { color: 'EFE1C8', valign: 'middle', max: 14 });
        },
        async (d) => { // the ex-libris plate: a double rule, a great quotation mark, the note beneath a line
          const s = await page(d), x = 1.0, y = 1.18, w = 8.0, ht = 3.72;
          t.rect(s, x, y, w, ht, page0, { line: { color: C.accent, width: 2 }, shadow: 0.15, blur: 5, offset: 2, name: 'Book plate' }); t.rect(s, x + 0.08, y + 0.08, w - 0.16, ht - 0.16, null, { line: { color: C.accent, width: 0.75 }, name: 'Inner rule' });
          t.text(s, '“', { x: x + 0.2, y: y + 0.12, w: 0.9, h: 0.95, fontFace: 'Cambria', bold: true, fontSize: 66, color: C.accent, noFit: true });
          t.text(s, L.runs(d.text), { x: x + 1.05, y: y + 0.22, w: w - 1.5, h: 1.78, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, w - 1.5, 1.74, 26, 14, 'Cambria', true) });
          t.line(s, x + 1.05, y + 2.1, 1.8, 0, gilt, 2);
          if (d.caption) body(s, d.caption, x + 1.05, y + 2.2, w - 1.5, 1.32, { color: C.muted, valign: 'middle', max: 13.5 });
        },
      ],
      timeline: [
        async (d) => { // a set in four volumes: each year on a short spine, its entry on the wall below
          const s = await page(d), cw = 2.2;
          t.rect(s, 0.45, 2.42, 9.1, 0.09, C.wood, { name: 'Upper shelf' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, sw = cw - 0.22;
            t.rect(s, x, 1.2, sw, 1.22, CV[i], { r: 0.03, name: 'Volume' }); bands(s, x, 1.2, sw, 1.22);
            t.text(s, it.year, { x: x + 0.05, y: 1.45, w: sw - 0.1, h: 0.72, fontFace: 'Cambria', bold: true, color: gilt, align: 'center', valign: 'middle', fontSize: L.fit(it.year, sw - 0.15, 0.68, 24, 12, 'Cambria', true) });
            head(s, it.h, x, 2.55, cw - 0.15, 0.46, { max: 15, color: CV[i] });
            body(s, it.t, x, 3.02, cw - 0.2, 1.85, { max: 14 });
          }
        },
        async (d) => { // one tall spine stands in the middle: the years open out from it as pages
          const s = await page(d), w = 3.9, hh = 1.62;
          t.rect(s, 4.8, 1.15, 0.4, 3.8, C.pal[0], { r: 0.03, name: 'Spine' }); bands(s, 4.8, 1.15, 0.4, 3.8);
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.2 + Math.floor(i / 2) * 1.8 + (right ? 0.24 : 0), x = right ? 5.2 : 0.9, a = right ? 'left' : 'right', tx = right ? x + 0.18 : x + 0.12;
            t.rect(s, x, y, w, hh, page0, { line: { color: edge, width: 0.75 }, shadow: 0.12, blur: 4, offset: 2, name: 'Page' });
            t.text(s, [{ text: it.year + '   ', options: { color: C.accent, bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x: tx, y: y + 0.08, w: w - 0.3, h: 0.42, fontFace: 'Cambria', align: a, valign: 'middle', fontSize: L.fit(`${it.year}   ${it.h}`, w - 0.3, 0.4, 15, 9, 'Cambria', true) });
            body(s, it.t, tx, y + 0.52, w - 0.3, hh - 0.6, { align: a, max: 13 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    const books = [[5.6, 1.1, 0.45, 3.85], [6.05, 0.75, 0.55, 4.2], [6.6, 1.3, 0.4, 3.65], [9.0, 0.9, 0.5, 4.05]];
    books.forEach(([x, y, w, h], k) => { t.rect(s, x, y, w, h, C.pal[k % 6], { r: 0.03, name: 'Book' }); t.line(s, x + 0.06, y + 0.3, w - 0.12, 0, 'E8C77A', 1.5); t.line(s, x + 0.06, y + h - 0.3, w - 0.12, 0, 'E8C77A', 1.5); });
    if (d.image) await K.photo(ctx, s, d.image, 7.15, 1.35, 1.7, 2.3);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.6, w: 4.8, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.8, h: 2.3, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 4.8, 2.2, 38, 20, 'Cambria', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 4.7, h: 0.75, fontFace: 'Cambria', italic: true, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.7, h: 0.45, fontFace: 'Cambria', fontSize: 17, bold: true, color: C.ink });
    metaFooter({ color: C.muted, y: 5.3, font: 'Cambria' })(ctx, s);
  },
};
module.exports = { id: 78, slug: 'javon', name: 'Javon', category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "kutubxonachi kabi: bilimli, tartibli, manbalarga tayangan ravon matn", limits: {}, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["pull:l", "fade", "p14:conveyor|dir=\"l\""], "cover": ["fadeLetters", "riseWords"], "mark": "slideRight", "deco": "slideLeft", "sig": {"title": "slideRight", "body": "fadeWords", "item": "slideLeft", "image": "slideRight", "number": "slideRight", "order": "seq", "stagger": 0.16}, "tempo": 1.1, "kenburns": false};
