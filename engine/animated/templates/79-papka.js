/** 79 Papka — manila folders: tabbed folders as containers, labels on tabs, paper clips, colour-coded tabs. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'E9E6DF', ink: '2B2B2B', muted: '5F5A52', accent: 'D35400', folder: 'E8C98E', folder2: 'DDB877', pal: ['D35400', '2E86AB', '27AE60', '8E44AD', 'C0392B', '16A085'] };
const tabbed = (w, h, tx, tw, fill, tab) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="M0,30 L${tx},30 L${tx + 12},4 L${tx + tw - 12},4 L${tx + tw},30 L${w},30 L${w},${h} L0,${h} Z" fill="#${fill}" stroke="#B9965A" stroke-width="2"/><path d="M${tx + 12},4 L${tx + tw - 12},4 L${tx + tw},30 L${tx},30 Z" fill="#${tab}"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Papka', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.7 },
  bg: (ctx, s) => { s.background = { color: C.bg }; },
  panel: async (ctx, s, x, y, w, h, k, o) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100), tw = Math.min(140, W2 * 0.45), tx = 20 + (k % 3) * Math.max(0, (W2 - tw - 40) / 3);
    ctx.t.img(s, await svgOnce(ctx, `p${W2}x${H2}k${k % 6}`, tabbed(W2, H2, tx, tw, o.big ? 'F2DDB2' : C.folder, C.pal[k % 6]), W2, H2), x, y - 0.3, w, h + 0.3); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.rect(s, x, y + d * 0.1, d, d * 0.8, C.pal[k % 6], { r: 0.04, name: 'Label' }); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.1, w: d, h: d * 0.8, fontSize: Math.round(d * 22), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, 'FFFFFF', { shadow: 0.2, blur: 5, offset: 2, rotate: -1.5, name: 'Print' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); ctx.t.img(s, await ctx.L.icon('FiPaperclip', '7F8C8D', 2), x + 0.2, y - 0.35, 0.4, 0.7); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'CFC7B8', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; t.rect(s, 0.5, 0.38, 1.0, 0.62, 'FFFFFF', { line: { color: 'B9965A', width: 1 }, name: 'File label' }); t.text(s, `\u2116 ${ctx.idx}`, { x: 0.5, y: 0.38, w: 1.0, h: 0.62, fontSize: 15, bold: true, color: C.accent, align: 'center', valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.7, y: 0.35, w: 7.75, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.75, 0.7, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => '4A443B', authorColor: C.accent, valueColor: (i) => C.pal[i % 6], compareHead: (i) => C.pal[i ? 1 : 0],
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const pal = C.pal, steel = '6E767D', steelD = '4F565C', manila = C.folder, line0 = 'B9965A', paper = 'FFFFFF', rule = 'CFC7B8', NOTE = ['FFF1A8', 'FFD6A5', 'CDEAC0', 'BDE0FE'];
    const clip = async (s, x, y, d = 0.42) => t.img(s, await L.icon('FiPaperclip', '7F8C8D', 2), x, y, d * 0.6, d);
    const sheet = (s, x, y, w, h2, o = {}) => t.rect(s, x, y, w, h2, o.fill || paper, { line: { color: o.line || 'D8D2C5', width: 0.75 }, shadow: 0.18, blur: 5, offset: 2, name: 'Sheet' });
    const folder = (s, x, y, w, h2, tabX, tabW, tabC, fill = manila) => { t.rect(s, tabX, y - 0.32, tabW, 0.36, tabC, { r: 0.04, name: 'Tab' }); t.rect(s, x, y, w, h2, fill, { line: { color: line0, width: 1 }, shadow: 0.15, blur: 4, offset: 2, name: 'Folder' }); };
    const holes = (s, x, y, h2, n = 3) => { for (let k = 0; k < n; k++) t.oval(s, x, y + (k + 0.5) * (h2 / n) - 0.06, 0.12, 0.12, C.bg, { line: { color: 'B0A998', width: 0.75 } }); };
    const pin = (s, x, y, c = pal[4]) => { t.oval(s, x - 0.08, y - 0.08, 0.16, 0.16, c, { line: { color: 'FFFFFF', width: 0.75 } }); };
    const cork = async (s, x, y, w, h2) => { let g = '', x0 = 9; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let k = 0; k < 900; k++) g += `<circle cx="${(rnd() * 1000).toFixed(0)}" cy="${(rnd() * 400).toFixed(0)}" r="${(0.8 + rnd() * 1.6).toFixed(1)}" fill="#7A5A33" opacity="0.35"/>`; t.img(s, await svgOnce(ctx, 'cork', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="400"><rect width="1000" height="400" fill="#C49A6C"/>${g}</svg>`, 1000, 400, true), x, y, w, h2); t.rect(s, x, y, w, h2, null, { line: { color: '7A5A33', width: 3 }, name: 'Board frame' }); };
    const V = {
      image: [
        async (d) => { // a clipboard: the print held under the steel clip, a typed sheet beside it
          const s = await page(d), x = 5.75, y = 1.2, w = 3.65, ht = 3.85;
          t.rect(s, x, y, w, ht, '8A5A2B', { r: 0.08, shadow: 0.3, blur: 6, offset: 3, name: 'Clipboard' });
          t.rect(s, x + 0.15, y + 0.28, w - 0.3, ht - 0.42, paper, { name: 'Sheet' });
          t.img(s, await L.photo(L.src(d.image), w - 0.5, ht - 0.65), x + 0.25, y + 0.42, w - 0.5, ht - 0.65, { alt: '' });
          t.rect(s, x + w / 2 - 0.65, y - 0.1, 1.3, 0.34, steel, { r: 0.05, name: 'Clip' }); t.oval(s, x + w / 2 - 0.09, y - 0.02, 0.18, 0.18, C.bg);
          sheet(s, 0.6, 1.3, 4.85, 3.7); holes(s, 0.72, 1.3, 3.7);
          body(s, d.text, 1.0, 1.42, 4.3, 3.46, { max: 14.5, k: 1.15, valign: 'middle' });
        },
        async (d) => { // the page is the picture: a manila folder lies open on it with the words
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.18, 10, 0.445, C.ink, { name: 'Footer band' });
          folder(s, 0.45, 0.72, 5.3, 4.25, 0.7, 2.2, pal[0], 'F2DDB2');
          t.text(s, `\u2116 ${ctx.idx}`, { x: 0.7, y: 0.4, w: 2.2, h: 0.34, bold: true, fontSize: 13, color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, d.title, 0.72, 0.8, 4.75, 0.82, { max: 20 });
          t.line(s, 0.72, 1.65, 4.75, 0, line0, 1);
          body(s, d.text, 0.72, 1.72, 4.75, 3.15, { max: 14.5, k: 1.1, valign: 'middle' });
          metaFooter({ color: 'E9E6DF' })(ctx, s);
        },
        async (d) => { // two prints thrown on the desk, not quite straight, a clip on the upper one
          const s = await page(d), src = L.src(d.image), P = [[0.65, 2.05, 2.85, 2.6, 356, 'east'], [2.15, 1.32, 3.1, 2.75, 3, 'centre']];
          for (const [x, y, w, ht, rot, pos] of P) {
            t.rect(s, x - 0.1, y - 0.1, w + 0.2, ht + 0.2, paper, { shadow: 0.25, blur: 6, offset: 3, rotate: rot, name: 'Print' });
            s.addImage({ data: await L.photo(src, w, ht, { position: pos }), x, y, w, ht, rotate: rot, altText: '' });
          }
          await clip(s, 2.5, 1.05, 0.62);
          body(s, d.text, 5.65, 1.3, 3.75, 3.7, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // an open file: the words on the folder's front above, the picture a sheet pulled out of its lower edge
          const s = await page(d);
          sheet(s, 0.32, 2.72, 9.36, 2.42);
          t.img(s, await L.photo(L.src(d.image), 9.16, 2.12), 0.42, 2.92, 9.16, 2.12, { alt: '' });
          t.rect(s, 0.75, 1.2, 8.5, 1.72, 'F2DDB2', { line: { color: line0, width: 1 }, shadow: 0.2, blur: 5, offset: 2, name: 'Folder front' });
          await clip(s, 8.7, 2.62, 0.5);
          body(s, d.text, 0.98, 1.26, 8.04, 1.6, { max: 14.5, k: 1.05, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // a steel filing cabinet: drawers with a label holder and a handle
          const s = await page(d), n = d.items.length, w = 4.35, hh = 1.82;
          t.rect(s, 0.5, 1.2, 9.0, 3.88, steelD, { r: 0.04, name: 'Cabinet' });
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.1), y = 1.28 + Math.floor(i / 2) * (hh + 0.08);
            t.rect(s, x, y, ww, hh, steel, { r: 0.03, line: { color: '8B939A', width: 1 }, name: 'Drawer' });
            t.rect(s, x + 0.14, y + 0.12, 2.75, 0.42, paper, { line: { color: steelD, width: 1.5 }, name: 'Label holder' });
            t.img(s, await L.icon(it.icon, C.accent, 2), x + 0.2, y + 0.18, 0.3, 0.3);
            head(s, it.h, x + 0.56, y + 0.14, 2.28, 0.38, { max: 13 });
            t.rect(s, x + ww - 1.05, y + 0.25, 0.85, 0.14, 'C8CED3', { r: 0.05, name: 'Handle' });
            body(s, it.t, x + 0.16, y + 0.6, ww - 0.32, hh - 0.66, { color: 'FFFFFF', max: 13.5 });
          }
        },
        async (d) => { // sticky notes in a loose row, each stuck at its own height, one pin in each
          const s = await page(d), n = d.items.length, gap = 0.14, w = (8.8 - gap * (n - 1)) / n, hh = 3.1;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.26 + [0.12, 0.62, 0, 0.45][i];
            t.rect(s, x, y, w, hh, NOTE[i], { shadow: 0.22, blur: 6, offset: 3, name: 'Sticky note' });
            pin(s, x + w / 2, y + 0.13, pal[[4, 1, 2, 3][i]]);
            t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.15, y + 0.28, 0.36, 0.36);
            head(s, it.h, x + 0.14, y + 0.68, w - 0.28, 0.5, { max: 14 });
            body(s, it.t, x + 0.14, y + 1.2, w - 0.28, hh - 1.28, { max: 13.5 });
          }
        },
        async (d) => { // a stack of files seen from above: each folder shows its tab and one strip of its front
          const s = await page(d), n = d.items.length, rh = 3.85 / n, tw = 2.85, F = ['F2DDB2', 'E8C98E', 'DDB877', 'D2AB66'];
          for (const [i, it] of d.items.entries()) {
            const y = 1.28 + i * rh, tx = 0.75 + i * ((8.5 - tw) / Math.max(1, n - 1));
            t.rect(s, tx, y - 0.02, tw, 0.36, pal[i], { r: 0.04, name: 'Tab' });
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), tx + 0.1, y + 0.03, 0.26, 0.26);
            head(s, it.h, tx + 0.42, y, tw - 0.48, 0.32, { color: 'FFFFFF', max: 13 });
            t.rect(s, 0.6, y + 0.32, 8.8, 5.12 - y - 0.32, F[i], { line: { color: line0, width: 1 }, name: 'Folder' });
            body(s, it.t, 0.85, y + 0.36, 8.3, rh - 0.4, { valign: 'middle', max: 13.5 });
          }
        },
        async (d) => { // the case board: cards pinned on cork, a red thread runs from pin to pin
          const s = await page(d), n = d.items.length, w = 4.1, hh = 1.56;
          await cork(s, 0.5, 1.18, 9.0, 3.92);
          const P = n === 3 ? [[0.72, 1.3, w, hh], [5.15, 1.58, w, hh], [1.9, 3.33, 6.2, 1.6]] : [[0.72, 1.3, w, hh], [5.15, 1.45, w, hh], [0.95, 3.22, w, hh], [5.05, 3.38, w, hh]];
          for (let i = 0; i < n - 1; i++) { const a = P[i], b = P[i + 1], ax = a[0] + a[2] / 2, ay = a[1] + 0.14, bx = b[0] + b[2] / 2, by = b[1] + 0.14; t.line(s, Math.min(ax, bx), Math.min(ay, by), Math.abs(bx - ax), Math.abs(by - ay), pal[4], 1.5, { flipV: (bx - ax) * (by - ay) < 0, name: 'Thread' }); }
          for (const [i, it] of d.items.entries()) {
            const [x, y, ww, hg] = P[i];
            t.rect(s, x, y, ww, hg, paper, { shadow: 0.3, blur: 5, offset: 2, name: 'Pinned card' });
            t.img(s, await L.icon(it.icon, pal[(i + 1) % 6], 2), x + 0.12, y + 0.14, 0.32, 0.32);
            head(s, it.h, x + 0.52, y + 0.2, ww - 0.65, 0.34, { max: 14 });
            body(s, it.t, x + 0.14, y + 0.56, ww - 0.28, hg - 0.62, { max: 13 });
          }
          for (const [i] of d.items.entries()) { const [x, y, ww] = P[i]; pin(s, x + ww / 2, y + 0.14, pal[4]); }
        },
      ],
      process: [
        async (d) => { // one fat folder with a tab for each step, its front ruled into as many sections
          const s = await page(d), n = d.steps.length, cw = 8.8 / n, y = 1.55;
          for (const [i] of d.steps.entries()) t.rect(s, 0.6 + i * cw + 0.08, y - 0.34, cw - 0.3, 0.38, pal[i], { r: 0.04, name: 'Tab' });
          t.rect(s, 0.6, y, 8.8, 3.55, 'F2DDB2', { line: { color: line0, width: 1 }, shadow: 0.15, blur: 4, offset: 2, name: 'Folder' });
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw;
            t.text(s, `№ ${i + 1}`, { x: x + 0.08, y: y - 0.34, w: cw - 0.3, h: 0.36, bold: true, fontSize: 14, color: 'FFFFFF', align: 'center', valign: 'middle' });
            if (i) t.line(s, x, y + 0.15, 0, 3.25, line0, 1, { dash: 'dash' });
            head(s, st.h, x + 0.14, y + 0.12, cw - 0.28, 0.6, { max: 15 });
            body(s, st.t, x + 0.14, y + 0.76, cw - 0.28, 2.65, { max: 14.5 });
          }
        },
        async (d) => { // a routing slip: one punched sheet, a line for each office it passes through
          const s = await page(d), n = d.steps.length, rh = 3.68 / n;
          sheet(s, 0.6, 1.2, 8.8, 3.88); holes(s, 0.72, 1.2, 3.88);
          t.line(s, 1.05, 1.2, 0, 3.88, 'E5A9A0', 1.25);
          for (const [i, st] of d.steps.entries()) {
            const y = 1.3 + i * rh;
            await marker(s, 1.2, y + (rh - 0.55) / 2, 0.55, i, i + 1);
            head(s, st.h, 1.9, y + 0.03, 2.4, rh - 0.06, { max: 14 });
            body(s, st.t, 4.4, y + 0.03, 4.85, rh - 0.06, { valign: 'middle', max: 13.5 });
            if (i < n - 1) t.line(s, 1.2, y + rh, 8.05, 0, rule, 0.75);
          }
        },
        async (d) => { // folders stepping up: each file stacked higher, its tab further along
          const s = await page(d), n = d.steps.length, gap = 0.1, w = (8.8 - gap * (n - 1)) / n, rise = n === 4 ? 0.32 : 0.45;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.54 + (n - 1 - i) * rise;
            folder(s, x, y, w, 5.08 - y, x + 0.1 + i * 0.06, 1.0, pal[i], i === n - 1 ? 'F2DDB2' : manila);
            t.text(s, `№ ${i + 1}`, { x: x + 0.1 + i * 0.06, y: y - 0.32, w: 1.0, h: 0.34, bold: true, fontSize: 12, color: 'FFFFFF', align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.14, y + 0.08, w - 0.28, 0.52, { max: 14 });
            body(s, st.t, x + 0.14, y + 0.62, w - 0.28, 5.08 - y - 0.7, { max: 14 });
          }
        },
        async (d) => { // sheets clipped in sequence, out along the top and back along the bottom, arrows between
          const s = await page(d), n = d.steps.length, w = 4.1, hh = 1.68, A = (x, y, dir) => t.shape(s, dir === 'd' ? 'DOWN_ARROW' : dir === 'l' ? 'LEFT_ARROW' : 'RIGHT_ARROW', { x, y, w: 0.34, h: 0.34, fill: { color: C.accent }, objectName: 'Arrow' });
          for (const [i, st] of d.steps.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, col = i < 2 ? i : 3 - i, x = wide ? 0.6 : 0.6 + col * (w + 0.6), y = 1.34 + (i < 2 ? 0 : hh + 0.32);
            sheet(s, x, y, ww, hh);
            await clip(s, x + 0.2, y - 0.2, 0.46);
            await marker(s, x + ww - 0.6, y + 0.1, 0.46, i, i + 1);
            head(s, st.h, x + 0.5, y + 0.1, ww - 1.2, 0.46, { max: 14 });
            body(s, st.t, x + 0.2, y + 0.58, ww - 0.4, hh - 0.66, { max: 14 });
          }
          A(4.83, 2.0, 'r'); A(7.3, 3.03, 'd'); if (n === 4) A(4.83, 3.95, 'l');
        },
      ],
      stats: [
        async (d) => { // three rubber stamps on the page, a double frame in office ink
          const s = await page(d), gap = 0.2, w = (8.8 - gap * 2) / 3, y = 1.3, hh = 1.5;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * (w + gap), c = pal[[4, 1, 2][i]];
            t.rect(s, px, y, w, hh, null, { line: { color: c, width: 3 }, name: 'Stamp' }); t.rect(s, px + 0.08, y + 0.08, w - 0.16, hh - 0.16, null, { line: { color: c, width: 1 }, name: 'Stamp rule' });
            t.text(s, x.value, { x: px + 0.15, y: y + 0.15, w: w - 0.3, h: hh - 0.3, bold: true, color: c, align: 'center', valign: 'middle', fontSize: L.fit(x.value, w - 0.35, hh - 0.4, 44, 18, 'Arial', true) });
            body(s, x.label, px + 0.05, y + hh + 0.1, w - 0.1, 0.62, { align: 'center', max: 14 });
          }
          if (d.note) { t.rect(s, 0.9, 3.72, 8.2, 1.32, NOTE[0], { shadow: 0.2, blur: 5, offset: 3, name: 'Sticky note' }); body(s, d.note, 1.1, 3.8, 7.8, 1.16, { valign: 'middle', max: 13.5 }); }
        },
        async (d) => { // the file cover shows the main figure, two more on index cards, the note stuck beside
          const s = await page(d), [a, ...rest] = d.stats;
          folder(s, 0.6, 1.5, 4.1, 3.58, 0.8, 1.9, pal[0], 'F2DDB2');
          t.text(s, '\u2116 1', { x: 0.8, y: 1.18, w: 1.9, h: 0.34, bold: true, fontSize: 13, color: 'FFFFFF', align: 'center', valign: 'middle' });
          t.text(s, a.value, { x: 0.8, y: 1.75, w: 3.7, h: 1.45, bold: true, color: pal[0], align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.6, 1.4, 56, 22, 'Arial', true) });
          body(s, a.label, 1.0, 3.25, 3.3, 1.5, { align: 'center', max: 15 });
          for (const [i, x] of rest.entries()) {
            const y = 1.25 + i * 1.08;
            sheet(s, 4.95, y, 4.45, 0.96);
            t.rect(s, 4.95, y, 0.09, 0.96, pal[i + 1], { name: 'Index' });
            t.text(s, x.value, { x: 5.1, y, w: 1.65, h: 0.96, bold: true, color: pal[i + 1], align: 'center', valign: 'middle', fontSize: L.fit(x.value, 1.6, 0.75, 26, 13, 'Arial', true) });
            body(s, x.label, 6.8, y + 0.06, 2.5, 0.84, { valign: 'middle', max: 13 });
          }
          if (d.note) { t.rect(s, 4.95, 3.45, 4.45, 1.62, NOTE[1], { shadow: 0.2, blur: 5, offset: 3, name: 'Sticky note' }); body(s, d.note, 5.12, 3.52, 4.1, 1.48, { valign: 'middle', max: 13 }); }
        },
      ],
      compare: [
        async (d) => { // a ledger sheet: a double red line down the middle, the entries answer across it
          const s = await page(d), w = 3.85;
          sheet(s, 0.6, 1.2, 8.8, 3.88);
          t.rect(s, 0.6, 1.2, 8.8, 0.6, 'F2EEE5', { name: 'Header row' });
          t.line(s, 4.97, 1.2, 0, 3.88, pal[4], 1); t.line(s, 5.03, 1.2, 0, 3.88, pal[4], 1);
          head(s, d.left.h, 0.8, 1.22, w, 0.56, { align: 'right', max: 18, color: pal[0] }); head(s, d.right.h, 5.2, 1.22, w, 0.56, { max: 18, color: pal[1] });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.26, 3.05);
          const extra = Math.max(0, (3.05 - rows.reduce((a, b) => a + b, 0)) / rows.length);
          let y = 1.92;
          for (const [k, rh0] of rows.entries()) {
            const rh = rh0 + extra;
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.8, y, w, h: rh0, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.2, y, w, h: rh0, fontSize: fs, color: C.ink });
            y += rh;
            if (k < rows.length - 1) t.line(s, 0.7, y - 0.08, 8.6, 0, rule, 0.75);
          }
        },
        async (d) => { // two long files lying one on the other: a coloured tab says which is which
          const s = await page(d), hh = 1.5;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.54 + i * (hh + 0.42), n = side.items.length, cw = 8.5 / n;
            folder(s, 0.6, y, 8.8, hh, i ? 5.2 : 0.8, 4.0, pal[i ? 1 : 0], i ? 'F2DDB2' : manila);
            head(s, side.h, i ? 5.3 : 0.9, y - 0.32, 3.8, 0.34, { color: 'FFFFFF', max: 15 });
            for (const [k, it] of side.items.entries()) {
              const x = 0.75 + k * cw;
              if (k) t.line(s, x - 0.06, y + 0.15, 0, hh - 0.3, line0, 1, { dash: 'dash' });
              body(s, it, x + 0.02, y + 0.1, cw - 0.16, hh - 0.2, { valign: 'middle', max: 14 });
            }
          }
        },
      ],
      statement: [
        async (d) => { // one big sticky note on the page, a typed note clipped next to it
          const s = await page(d, 'focus');
          t.rect(s, 0.65, 1.28, 5.5, 3.72, NOTE[0], { shadow: 0.3, blur: 8, offset: 4, name: 'Sticky note' });
          t.rect(s, 2.75, 1.18, 1.3, 0.22, 'D9D2BE', { t: 25, name: 'Tape' });
          t.text(s, L.runs(d.text), { x: 0.95, y: 1.55, w: 4.9, h: 3.25, fontFace: 'Arial', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 4.9, 3.2, 28, 15, 'Arial', true) });
          if (d.caption) { sheet(s, 6.45, 1.55, 2.95, 3.2); await clip(s, 6.7, 1.35, 0.46); body(s, d.caption, 6.6, 1.82, 2.65, 2.85, { max: 13 }); }
        },
        async (d) => { // a dark archive box: its label holds the thought, the note is written on the lid
          const s = await page(d), box = '2F3A40';
          t.rect(s, 0.6, 1.2, 8.8, 3.88, box, { r: 0.03, name: 'Archive box' }); t.rect(s, 0.6, 1.2, 8.8, 0.14, '1F272C', { name: 'Lid' });
          t.rect(s, 4.3, 4.72, 1.4, 0.2, '1F272C', { r: 0.08, name: 'Hand hole' });
          t.rect(s, 1.0, 1.55, 8.0, 1.95, paper, { line: { color: C.accent, width: 2.5 }, name: 'Label' });
          t.text(s, L.runs(d.text), { x: 1.25, y: 1.62, w: 7.5, h: 1.82, fontFace: 'Arial', bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 7.5, 1.78, 30, 15, 'Arial', true) });
          if (d.caption) body(s, d.caption, 1.05, 3.58, 7.9, 1.1, { color: 'E9E6DF', align: 'center', valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // four folders in a row, the year is the tab of each, and the row steps down year by year
          const s = await page(d), gap = 0.1, w = (8.8 - gap * 3) / 4, dy = 0.16;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.56 + i * dy;
            folder(s, x, y, w, 5.08 - y, x + 0.1, w - 0.4, pal[i]);
            t.text(s, it.year, { x: x + 0.14, y: y - 0.32, w: w - 0.48, h: 0.34, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.52, 0.3, 15, 9, 'Arial', true) });
            head(s, it.h, x + 0.12, y + 0.08, w - 0.24, 0.48, { max: 14 });
            body(s, it.t, x + 0.12, y + 0.58, w - 0.24, 5.08 - y - 0.66, { max: 14 });
          }
        },
        async (d) => { // the case board: a red thread runs across the cork, a card pinned above and below it
          const s = await page(d), w = 3.0, cw = 2.2, ty = 3.14;
          await cork(s, 0.3, 1.16, 9.4, 3.95);
          t.line(s, 0.5, ty, 9.0, 0, pal[4], 2, { name: 'Thread' });
          for (const [i, it] of d.items.entries()) {
            const up = i % 2 === 1, cx = 0.6 + (i + 0.5) * cw, x = Math.max(0.45, Math.min(9.55 - w, cx - w / 2)), y = up ? 1.26 : 3.32, hh = 1.68;
            t.line(s, cx, up ? y + hh : ty, 0, up ? ty - y - hh : y - ty, pal[4], 1.25);
            t.rect(s, x, y, w, hh, paper, { shadow: 0.3, blur: 5, offset: 2, name: 'Pinned card' });
            pin(s, cx, ty, pal[4]);
            t.text(s, [{ text: it.year + '   ', options: { color: pal[4], bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: 0.38, fontFace: 'Arial', valign: 'middle', fontSize: L.fit(`${it.year}   ${it.h}`, w - 0.24, 0.36, 14, 9, 'Arial', true) });
            body(s, it.t, x + 0.12, y + 0.48, w - 0.24, hh - 0.54, { max: 13 });
          }
        },
        async (d) => { // the index of a card file: dividers overlap down the page, each year on a tab out to the side
          const s = await page(d), rh = 0.94, F = ['F2DDB2', 'E8C98E', 'F2DDB2', 'E8C98E'];
          for (const [i, it] of d.items.entries()) {
            const y = 1.26 + i * rh, x = 1.75 + i * 0.1;
            t.rect(s, 0.6 + i * 0.1, y + 0.08, 1.25, rh - 0.2, pal[i], { r: 0.05, name: 'Side tab' });
            t.text(s, it.year, { x: 0.62 + i * 0.1, y: y + 0.08, w: 1.12, h: rh - 0.2, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.08, 0.5, 16, 9, 'Arial', true) });
            t.rect(s, x, y, 9.4 - x, rh - 0.05, F[i], { line: { color: line0, width: 1 }, name: 'Divider' });
            head(s, it.h, x + 0.14, y + 0.04, 2.05, rh - 0.13, { max: 14 });
            body(s, it.t, x + 2.3, y + 0.04, 9.4 - x - 2.42, rh - 0.13, { valign: 'middle', max: 13 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); // the original panels of both looked like the cards page
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    await K.panel(ctx, s, 0.6, 0.9, 8.8, 4.1, 0, { big: true });
    t.rect(s, 0.9, 1.0, 3.8, 0.45, 'FFFFFF', { line: { color: 'B9965A', width: 1 }, name: 'Label' });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 1.0, y: 1.0, w: 3.6, h: 0.45, fontSize: 11, bold: true, color: C.accent, valign: 'middle' });
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 1.55, 2.8, 2.6);
    t.text(s, d.title, { x: 0.95, y: 1.6, w: 5.0, h: 1.8, bold: true, fontSize: L.fit(d.title, 5.0, 1.7, 36, 18, 'Arial', true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.95, y: 3.45, w: 5.0, h: 0.6, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.95, y: 4.15, w: 5.0, h: 0.45, fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 79, slug: 'papka', name: 'Papka', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "ish yuritish uslubi: tartibli bo'limlar, aniq faktlar va qisqa xulosalar", limits: {}, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "calm"], "transitions": ["pull:u", "cover:u", "fade"], "cover": ["peekUp", "fadeWords"], "mark": "peekUp", "deco": "peekUp", "sig": {"title": "peekUp", "body": "fade", "item": "peekUp", "image": "wipe:u", "number": "popIn", "order": "seq", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
