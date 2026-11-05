/** 98 Karta — card table: green felt, playing cards with corner indices and suits, poker-chip markers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '1D5E3A', ink: '1E1E1E', muted: '4E4E4E', accent: 'C62828', pal: ['C62828', '1565C0', 'F9A825', '2E7D32', '6A1B9A', '212121'] };
const SUITS = ['\u2660', '\u2665', '\u2666', '\u2663'];
const felt = () => { let d = '', x0 = 5; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < 2200; i++) d += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="1.4" fill="#${rnd() > 0.5 ? '2A7A4D' : '164D2F'}" opacity="0.6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.5" cy="0.5" r="0.75"><stop offset="0" stop-color="#22704A"/><stop offset="1" stop-color="#123F27"/></radialGradient></defs><rect width="1600" height="900" fill="url(#g)"/>${d}</svg>`; };
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Karta', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'felt', felt(), 1600, 900, true) }; },
  // playing card: white, rounded, rank + suit in the top-left and bottom-right corners
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.12, shadow: 0.4, blur: 6, offset: 3, name: 'Card' }); if (!o.big && !o.compare && !o.text) { const red = k % 2 === 1, su = SUITS[k % 4]; t.text(s, su, { x: x + w - 0.42, y: y + 0.06, w: 0.36, h: 0.36, fontSize: 18, color: red ? C.accent : C.ink, align: 'center', noFit: true }); t.text(s, su, { x: x + w - 0.42, y: y + h - 0.42, w: 0.36, h: 0.36, fontSize: 18, color: red ? C.accent : C.ink, align: 'center', noFit: true }); } },
  marker: (ctx, s, x, y, d, k, label) => { const c = C.pal[k % 6]; ctx.t.oval(s, x, y, d, d, c, { line: { color: 'FFFFFF', width: 2.5, dashType: 'dash' } }); ctx.t.oval(s, x + d * 0.18, y + d * 0.18, d * 0.64, d * 0.64, 'FFFFFF', { line: { color: c, width: 1 } }); if (label !== '') ctx.t.text(s, String(label), { x: x + d * 0.18, y: y + d * 0.18, w: d * 0.64, h: d * 0.64, fontFace: 'Cambria', fontSize: Math.max(8, Math.round(d * 18)), bold: true, color: c, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.15, y - 0.15, w + 0.3, h + 0.3, 'FFFFFF', { r: 0.12, shadow: 0.4, blur: 6, offset: 3, name: 'Card' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.05 } }), x, y, w, h, { alt: '' }); },
  bullet: (ctx, s, x, y, k) => ctx.t.text(s, SUITS[k ? 1 : 0], { x: x - 0.03, y: y - 0.1, w: 0.3, h: 0.3, fontSize: 14, color: k ? C.accent : C.ink }),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.35, 0.72, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.45, y: 0.35, w: 8.0, h: 0.72, fontFace: 'Cambria', bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.72, 28, 16, 'Cambria', true) }); },
  footer: metaFooter({ color: 'BFD8C8' }),
  onBg: 'FFFFFF', onBgMuted: 'CFE3D6', onPanel: () => C.ink, subPanel: () => C.muted, authorColor: 'F9A825', valueColor: (i) => (i % 2 ? C.accent : C.ink), compareHead: (i) => (i ? C.accent : C.ink),
  ways: (ctx, h, R) => {
    // ---- further ways to draw a type, at the card table: a deck's pages must not look alike (L.pages)
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const WH = 'FFFFFF', GOLD = 'F9A825', PALE = 'CFE3D6', foot = metaFooter({ color: 'BFD8C8' });
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.ls || 1), lineSpacingMultiple: o.ls || 1, color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Cambria', bold: true, fontSize: L.fit(v, w, h2, o.max || 16, 10.5, 'Cambria', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const suit = (s, k, x, y, d, c) => t.text(s, SUITS[k % 4], { x, y, w: d, h: d, fontSize: Math.round(d * 44), color: c || (k % 2 ? C.accent : C.ink), align: 'center', valign: 'middle', noFit: true });
    const card = (s, x, y, w, h2, o = {}) => t.rect(s, x, y, w, h2, o.fill || WH, { r: 0.1, shadow: 0.4, blur: 6, offset: 3, name: 'Card', ...(o.rotate ? { rotate: o.rotate } : {}), ...(o.line ? { line: o.line } : {}) });
    const tab = (s, k, x, y, d) => { t.rect(s, x, y, d, d * 1.25, WH, { r: 0.05, shadow: 0.3, blur: 3, offset: 1, name: 'Card' }); suit(s, k, x, y + d * 0.125, d); }; // black suits do not read on the felt: always on a little card
    const backPat = (key, w, h2) => svgOnce(ctx, 'back' + key, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h2}"><defs><pattern id="p" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="26" height="26" fill="#8E1C1C"/><rect width="13" height="13" fill="#A92626"/></pattern></defs><rect width="${w}" height="${h2}" rx="16" fill="#FFFFFF"/><rect x="10" y="10" width="${w - 20}" height="${h2 - 20}" rx="10" fill="url(#p)"/></svg>`, w, h2);
    const rail = (s, y, h2) => t.rect(s, 0, y, 10, h2, '3E2312', { name: 'Table rail' });
    const V = {
      image: [
        async (d) => { // the picture is a large card leaning on the table, the words on the felt
          const s = await page(d);
          card(s, 5.5, 1.28, 3.0, 3.85, { rotate: 5 });
          t.img(s, await L.photo(L.src(d.image), 2.7, 3.2, { mask: { r: 0.05 } }), 5.65, 1.6, 2.7, 3.2, { alt: '' });
          body(s, d.text, 0.6, 1.4, 4.6, 3.65, { color: WH, max: 16, valign: 'middle', ls: 1.15 });
        },
        async (d) => { // the picture across the table's far side, the words dealt on a wide card
          const s = await page(d);
          t.img(s, await L.photo(L.src(d.image), 10, 1.95), 0, 1.25, 10, 1.95, { alt: '' });
          rail(s, 1.2, 0.05); rail(s, 3.2, 0.05);
          card(s, 0.6, 3.4, 8.8, 1.7);
          suit(s, 1, 0.68, 3.46, 0.36); suit(s, 1, 8.96, 4.68, 0.36);
          body(s, d.text, 1.05, 3.46, 7.85, 1.58, { max: 14, valign: 'middle' });
        },
        async (d) => { // the picture fills the page, one big card held up over it
          const s = await newSlide('page');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.18, 10, 0.445, '123F27', { name: 'Footer felt' });
          K.marker(ctx, s, 0.5, 0.35, 0.72, ctx.idx, ctx.idx);
          card(s, 5.3, 0.3, 4.2, 4.72);
          suit(s, 2, 5.38, 0.36, 0.4, C.accent); suit(s, 2, 9.02, 4.56, 0.4, C.accent);
          head(s, d.title, 5.75, 0.55, 3.45, 0.95, { max: 22 });
          body(s, d.text, 5.65, 1.55, 3.5, 3.0, { max: 14, ls: 1.1 });
          foot(ctx, s);
        },
        async (d) => { // the picture on a poker chip, the words on a card
          const s = await page(d), dd = 3.2;
          const cx = 0.75, cy = 1.5;
          t.oval(s, cx - 0.17, cy - 0.17, dd + 0.34, dd + 0.34, C.accent, { line: { color: WH, width: 7, dashType: 'dash' }, name: 'Chip' });
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), cx, cy, dd, dd, { alt: '' });
          card(s, 4.5, 1.4, 4.9, 3.65);
          suit(s, 3, 4.58, 1.46, 0.36);
          body(s, d.text, 4.95, 1.55, 4.2, 3.35, { max: 15, valign: 'middle', ls: 1.1 });
        },
      ],
      cards: [
        async (d) => { // a hand of cards fanned out: tops lifted towards the middle
          const s = await page(d), n = d.items.length, gap = 0.1, w = (8.8 - gap * (n - 1)) / n, lift = n === 4 ? [0.3, 0, 0, 0.3] : [0.3, 0, 0.3];
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.3 + lift[i], hh = 5.1 - y, c = i % 2 ? C.accent : C.ink;
            card(s, x, y, w, hh);
            suit(s, i, x + 0.06, y + 0.06, 0.34); suit(s, i, x + w - 0.42, y + hh - 0.42, 0.36);
            t.img(s, await L.icon(it.icon, c, 2), x + w / 2 - 0.2, y + 0.14, 0.4, 0.4);
            head(s, it.h, x + 0.15, y + 0.58, w - 0.3, 0.52, { max: 14, align: 'center' });
            body(s, it.t, x + 0.15, y + 1.12, w - 0.3, hh - 1.55, { max: 13, align: 'center', color: C.muted });
          }
        },
        async (d) => { // chips stacked along the left, the words on the felt
          const s = await page(d), n = d.items.length, hh = 3.72 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.33 + i * hh, dd = Math.min(0.72, hh - 0.12);
            marker(s, 0.65, y + (hh - dd) / 2, dd, i, '');
            t.img(s, await L.icon(it.icon, C.pal[i % 6], 2), 0.65 + dd / 2 - dd * 0.2, y + hh / 2 - dd * 0.2, dd * 0.4, dd * 0.4);
            head(s, it.h, 1.6, y + 0.03, 7.8, 0.34, { color: GOLD, max: 15 });
            body(s, it.t, 1.6, y + 0.37, 7.8, hh - 0.45, { color: WH, max: 13.5 });
            if (i < n - 1) t.line(s, 1.6, y + hh - 0.03, 7.8, 0, '4C9A6E', 0.75);
          }
        },
        async (d) => { // four suits at the corners of the table, each with its own pile
          const s = await page(d), n = d.items.length, w = 4.3, hh = 1.78;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = 0.6 + (i % 2) * (w + 0.2), y = 1.32 + Math.floor(i / 2) * (hh + 0.1), ww = wide ? 8.8 : w;
            t.rect(s, x, y, ww, hh, null, { r: 0.1, line: { color: 'BFD8C8', width: 1, dashType: 'dash' }, name: 'Betting box' });
            tab(s, i, x + 0.16, y + 0.16, 0.56);
            head(s, it.h, x + 0.9, y + 0.1, ww - 1.05, 0.44, { color: GOLD, max: 15 });
            body(s, it.t, x + 0.9, y + 0.56, ww - 1.05, hh - 0.66, { color: WH, max: 13 });
          }
        },
        async (d) => { // cards in a staggered row, red and white, heads in a bar
          const s = await page(d), n = d.items.length, gap = 0.14, w = (8.8 - gap * (n - 1)) / n, hh = 2.95;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = i % 2 ? 2.15 : 1.3, red = i % 2 === 1;
            t.rect(s, x, y, w, hh, red ? '8E1C1C' : WH, { r: 0.1, shadow: 0.4, blur: 6, offset: 3, name: 'Card' });
            t.img(s, await L.icon(it.icon, red ? WH : C.accent, 2), x + 0.15, y + 0.14, 0.36, 0.36);
            t.text(s, SUITS[i % 4], { x: x + w - 0.5, y: y + 0.1, w: 0.36, h: 0.36, fontSize: 18, color: red ? 'FFD3CE' : C.ink, align: 'center', noFit: true });
            head(s, it.h, x + 0.15, y + 0.54, w - 0.3, 0.5, { max: 14, color: red ? WH : C.ink });
            body(s, it.t, x + 0.15, y + 1.06, w - 0.3, hh - 1.2, { max: 13, color: red ? WH : C.muted });
          }
        },
      ],
      process: [
        async (d) => { // dealt one over another, each card overlapping the last
          const s = await page(d), n = d.steps.length, w = n === 4 ? 3.2 : 3.6, hh = 2.72, sx = (8.8 - w) / (n - 1), sy = (3.8 - hh) / (n - 1);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * sx, y = 1.32 + i * sy, vis = i === n - 1 ? w : sx;
            card(s, x, y, w, hh);
            t.text(s, `${i + 1}${SUITS[i % 4]}`, { x: x + 0.1, y: y + 0.06, w: 0.8, h: 0.4, fontFace: 'Cambria', bold: true, fontSize: 18, color: i % 2 ? C.accent : C.ink, noFit: true });
            head(s, st.h, x + 0.12, y + 0.46, vis - 0.2, 0.55, { max: 13.5 });
            body(s, st.t, x + 0.12, y + 1.02, vis - 0.2, hh - 1.1, { max: 13, color: C.muted });
          });
        },
        async (d) => { // a trail of chips down the table, a card to each side by turn
          const s = await page(d), n = d.steps.length, cx = 5, w = 3.95, B = n === 4 ? [[1.33, 1.75], [1.7, 1.65], [3.2, 1.88], [3.45, 1.65]] : [[1.33, 1.75], [2.25, 1.65], [3.2, 1.88]], ym = n === 4 ? [1.5, 2.42, 3.34, 4.26] : [1.75, 2.75, 3.75];
          t.line(s, cx, 1.3, 0, 3.8, 'BFD8C8', 1.5, { dash: 'dash' });
          d.steps.forEach((st, i) => {
            const right = i % 2 === 1, x = right ? cx + 0.45 : cx - 0.45 - w, [y, hh] = B[i];
            card(s, x, y, w, hh);
            suit(s, i, right ? x + w - 0.42 : x + 0.06, y + 0.06, 0.34);
            head(s, st.h, x + 0.2 + (right ? 0 : 0.3), y + 0.08, w - 0.7, 0.42, { max: 15, align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.2, y + 0.52, w - 0.4, hh - 0.62, { max: 13, align: right ? 'left' : 'right', color: C.muted });
            marker(s, cx - 0.32, ym[i], 0.64, i, i + 1);
          });
        },
        async (d) => { // the betting rounds: dark rail along the top, the rounds as seats on it
          const s = await page(d), n = d.steps.length, cw = 8.8 / n;
          rail(s, 1.28, 0.62);
          t.line(s, 0, 1.92, 10, 0, GOLD, 1.5);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * cw;
            marker(s, x, 1.22, 0.74, i, i + 1);
            head(s, st.h, x, 2.08, cw - 0.25, 0.6, { color: GOLD, max: 16, valign: 'top' });
            body(s, st.t, x, 2.72, cw - 0.25, 2.35, { color: WH, max: 14 });
          });
        },
        async (d) => { // rising hand: rows on the felt, a higher rank each row, cards shown as index tabs
          const s = await page(d), n = d.steps.length, hh = 3.72 / n;
          d.steps.forEach((st, i) => {
            const y = 1.32 + i * hh, x = 0.6 + (n - 1 - i) * 0.0, tabs = i + 1;
            for (let c = 0; c < tabs; c++) { const cx = 0.6 + c * 0.28; t.rect(s, cx, y + 0.04, 0.62, hh - 0.14, WH, { r: 0.06, shadow: 0.3, blur: 3, offset: 1, line: { color: 'BDBDBD', width: 0.5 }, name: 'Card' }); }
            t.text(s, `${SUITS[i % 4]}`, { x: 0.6 + (tabs - 1) * 0.28, y: y + 0.04, w: 0.62, h: hh - 0.14, fontSize: 22, color: i % 2 ? C.accent : C.ink, align: 'center', valign: 'middle', noFit: true });
            head(s, `${i + 1}. ${st.h}`, 2.45, y + 0.02, 6.95, 0.34, { color: GOLD, max: 15 });
            body(s, st.t, 2.45, y + 0.36, 6.95, hh - 0.42, { color: WH, max: 13.5 });
          });
        },
      ],
      stats: [
        async (d) => { // three big chips with the numbers on them
          const s = await page(d), cw = 8.8 / 3, dd = 2.05;
          d.stats.forEach((x, i) => {
            const px = 0.6 + i * cw + (cw - dd) / 2, c = C.pal[[0, 1, 5][i]];
            t.oval(s, px, 1.28, dd, dd, c, { line: { color: WH, width: 6, dashType: 'dash' }, name: 'Chip' });
            t.oval(s, px + 0.2, 1.48, dd - 0.4, dd - 0.4, WH, { line: { color: c, width: 1.5 } });
            t.text(s, x.value, { x: px + 0.27, y: 1.8, w: dd - 0.54, h: 1.0, fontFace: 'Cambria', bold: true, color: c, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd - 0.6, 0.9, 30, 12, 'Cambria', true) });
            body(s, x.label, 0.6 + i * cw + 0.1, 3.42, cw - 0.2, 0.72, { align: 'center', color: WH, max: 13.5 });
          });
          if (d.note) body(s, d.note, 0.6, 4.18, 8.8, 0.92, { max: 12, color: PALE, align: 'center', valign: 'middle' });
        },
        async (d) => { // the ace: one tall card with the lead number, two tucked beside it
          const s = await page(d), [a, ...rest] = d.stats;
          card(s, 0.6, 1.3, 3.5, 3.82);
          t.text(s, `A${SUITS[1]}`, { x: 0.75, y: 1.36, w: 0.9, h: 0.5, fontFace: 'Cambria', bold: true, fontSize: 22, color: C.accent, noFit: true });
          t.text(s, a.value, { x: 0.8, y: 1.9, w: 3.1, h: 1.35, fontFace: 'Cambria', bold: true, color: C.accent, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.05, 1.25, 60, 20, 'Cambria', true) });
          body(s, a.label, 0.85, 3.3, 3.0, 1.1, { align: 'center', max: 15 });
          suit(s, 1, 3.62, 4.62, 0.42);
          rest.forEach((x, i) => {
            const y = 1.3 + i * 1.08;
            tab(s, i + 2, 4.35, y + 0.14, 0.56);
            t.text(s, x.value, { x: 5.05, y, w: 4.35, h: 0.56, fontFace: 'Cambria', bold: true, color: GOLD, valign: 'middle', fontSize: L.fit(x.value, 4.3, 0.52, 30, 15, 'Cambria', true) });
            body(s, x.label, 5.05, y + 0.56, 4.35, 0.46, { color: WH, max: 12.5 });
          });
          if (d.note) body(s, d.note, 4.4, 3.5, 5.0, 1.6, { max: 13, color: PALE, valign: 'middle' });
        },
        async (d) => { // a score sheet laid on the table
          const s = await page(d);
          t.rect(s, 0.6, 1.3, 8.8, 3.82, 'FFFDF2', { shadow: 0.4, blur: 6, offset: 3, name: 'Score sheet' });
          const rh = d.note ? 0.85 : 1.2;
          t.line(s, 3.75, 1.3, 0, 3.82, C.accent, 1);
          d.stats.forEach((x, i) => {
            const y = 1.38 + i * rh;
            t.text(s, x.value, { x: 0.8, y, w: 2.8, h: rh, fontFace: 'Cambria', bold: true, color: i % 2 ? C.accent : C.ink, align: 'right', valign: 'middle', fontSize: L.fit(x.value, 2.75, rh - 0.15, 38, 16, 'Cambria', true) });
            body(s, x.label, 3.95, y + 0.05, 5.25, rh - 0.1, { valign: 'middle', max: 15 });
            t.line(s, 0.6, y + rh, 8.8, 0, 'B7CBE0', 0.75);
          });
          if (d.note) body(s, d.note, 3.95, 3.98, 5.25, 1.08, { max: 12, color: C.muted, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // two players' hands across the table: red and black, mirrored
          const s = await page(d), w = 4.1, cx = 5;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.3, 'Calibri', 0.14, 2.95);
          head(s, d.left.h, 0.6, 1.3, w - 0.3, 0.6, { align: 'right', color: WH, max: 19 }); head(s, d.right.h, 5.6, 1.3, w - 0.3, 0.6, { color: 'FFB4AB', max: 19 });
          t.oval(s, cx - 0.3, 2.9, 0.6, 0.6, GOLD, { line: { color: WH, width: 2.5, dashType: 'dash' }, name: 'Chip' });
          t.line(s, cx, 1.3, 0, 1.55, 'BFD8C8', 1, { dash: 'dash' }); t.line(s, cx, 3.55, 0, 1.55, 'BFD8C8', 1, { dash: 'dash' });
          let y = 2.02;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) t.text(s, d.left.items[j], { x: 0.6, y, w: w - 0.3, h: rh, fontSize: fs, color: WH, align: 'right' });
            if (d.right.items[j]) t.text(s, d.right.items[j], { x: 5.6, y, w: w - 0.3, h: rh, fontSize: fs, color: WH });
            y += rh;
          });
        },
        async (d) => { // a black band and a red band, each a row of little cards
          const s = await page(d), hh = 1.84;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.3 + i * (hh + 0.06), n = side.items.length, X = 2.75, gx = 0.08, w = (9.75 - X - gx * (n - 1)) / n;
            t.rect(s, 0, y, 10, hh, i ? '8E1C1C' : '1E1E1E', { name: 'Band' });
            tab(s, i ? 1 : 0, 0.5, y + 0.1, 0.42);
            head(s, side.h, 0.5, y + 0.68, 2.1, hh - 0.76, { color: WH, max: 17, valign: 'top' });
            side.items.forEach((it, j) => { const x = X + j * (w + gx); t.rect(s, x, y + 0.12, w, hh - 0.24, WH, { r: 0.07, name: 'Card' }); body(s, it, x + 0.1, y + 0.17, w - 0.2, hh - 0.34, { max: 13, valign: 'middle' }); });
          });
        },
      ],
      statement: [
        async (d) => { // the card back, a card face up on it holding the note, the thought on the felt
          const s = await page(d, 'focus');
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 5.35, h: 3.8, fontFace: 'Cambria', bold: true, color: WH, valign: 'middle', fontSize: L.fit(d.text, 5.35, 3.7, 36, 16, 'Cambria', true) });
          t.img(s, await backPat('a', 300, 420), 6.15, 1.25, 2.72, 3.81, { alt: '' });
          card(s, 6.55, 1.5, 2.9, 3.62);
          suit(s, 1, 6.62, 1.55, 0.36); suit(s, 1, 9.02, 4.7, 0.36);
          if (d.caption) body(s, d.caption, 6.75, 1.95, 2.5, 2.7, { max: 13.5, valign: 'middle', color: C.muted });
        },
        async (d) => { // all in: the table goes dark red, the note high up, the thought large below it
          const s = await page(d);
          t.rect(s, 0, 1.25, 10, 3.92, '8E1C1C', { name: 'All in' });
          if (d.caption) body(s, d.caption, 0.6, 1.38, 6.3, 1.32, { max: 13, color: 'FFE9E6' });
          [0, 1, 2].forEach((k) => t.oval(s, 7.5 + k * 0.62, 1.5 + (k % 2) * 0.28, 0.7, 0.7, [GOLD, WH, C.pal[1]][k], { line: { color: k === 1 ? C.ink : WH, width: 2.5, dashType: 'dash' }, name: 'Chip' }));
          t.text(s, L.runs(d.text), { x: 0.6, y: 2.75, w: 8.8, h: 2.3, fontFace: 'Cambria', bold: true, color: WH, valign: 'bottom', fontSize: L.fit(d.text, 8.8, 2.2, 36, 16, 'Cambria', true) });
        },
      ],
      timeline: [
        async (d) => { // cards laid out in a line with gaps, the years as rank on their corners
          const s = await page(d), gap = 0.1, w = (8.8 - gap * 3) / 4;
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap), y = 1.3 + (i % 2) * 0.34, hh = 3.47, red = i % 2;
            t.rect(s, x, y, w, hh, red ? 'FBE9E7' : WH, { r: 0.1, shadow: 0.4, blur: 6, offset: 3, name: 'Card' });
            t.text(s, it.year, { x: x + 0.14, y: y + 0.08, w: w - 0.28, h: 0.5, fontFace: 'Cambria', bold: true, color: red ? C.accent : C.ink, valign: 'middle', fontSize: L.fit(it.year, w - 0.3, 0.46, 22, 11, 'Cambria', true) });
            head(s, it.h, x + 0.14, y + 0.6, w - 0.28, 0.5, { max: 14 });
            body(s, it.t, x + 0.14, y + 1.12, w - 0.28, hh - 1.62, { max: 13, color: C.muted });
            suit(s, i, x + w - 0.5, y + hh - 0.48, 0.4);
          });
        },
        async (d) => { // the river of the game: chips on a dashed line, events over and under by turn
          const s = await page(d), ly = 3.18, w = 3.7, xs = [0.6, 1.3, 5.1, 5.7];
          t.line(s, 0, ly, 10, 0, 'BFD8C8', 2, { dash: 'dash' });
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.3 : ly + 0.3;
            marker(s, x, ly - 0.2, 0.4, i, '');
            head(s, it.year, x + 0.5, up ? y : y, 1.5, 0.38, { color: GOLD, max: 17 });
            head(s, it.h, x + 1.95, y, w - 1.95, 0.38, { color: WH, max: 14, align: 'right' });
            body(s, it.t, x, y + 0.4, w, up ? 1.2 : 1.15, { color: WH, max: 13 });
          });
        },
        async (d) => { // the game log: a long card with a row per year
          const s = await page(d), hh = 3.72 / 4;
          card(s, 0.6, 1.3, 8.8, 3.84);
          d.items.forEach((it, i) => {
            const y = 1.33 + i * hh;
            suit(s, i, 0.72, y + (hh - 0.5) / 2, 0.5);
            t.text(s, it.year, { x: 1.25, y, w: 1.55, h: hh, fontFace: 'Cambria', bold: true, color: i % 2 ? C.accent : C.ink, valign: 'middle', fontSize: L.fit(it.year, 1.5, hh - 0.2, 20, 11, 'Cambria', true) });
            head(s, it.h, 2.85, y, 1.95, hh, { max: 14 });
            body(s, it.t, 4.85, y + 0.04, 4.4, hh - 0.1, { max: 13, color: C.muted, valign: 'middle' });
            if (i < 3) t.line(s, 0.75, y + hh, 8.5, 0, 'BDBDBD', 0.75);
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old panels look like the cards
    R.stats = V.stats.shift(); // and so do the old stat tiles
    R.timeline = V.timeline.shift(); // and the old timeline columns
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    [[6.3, 1.0, -8], [6.9, 0.85, 4]].forEach(([x, y, r], k) => { t.rect(s, x, y, 2.4, 3.4, 'FFFFFF', { r: 0.14, rotate: r, shadow: 0.45, blur: 6, offset: 3, name: 'Card' }); t.text(s, `A${SUITS[k + 1]}`, { x: x + 0.15, y: y + 0.12, w: 0.8, h: 0.5, fontFace: 'Cambria', fontSize: 20, bold: true, color: k ? C.accent : C.ink, noFit: true }); });
    if (d.image) t.img(s, await L.photo(L.src(d.image), 2.0, 2.4, { mask: { r: 0.06 } }), 7.1, 1.4, 2.0, 2.4, { alt: '' });
    K.marker(ctx, s, 5.7, 3.9, 0.8, 0, ''); K.marker(ctx, s, 6.3, 4.2, 0.8, 1, ''); K.marker(ctx, s, 9.0, 4.1, 0.7, 2, '');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2666  '), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: 'F9A825' });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.0, h: 2.2, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 5.0, 2.1, 38, 18, 'Cambria', true), color: 'FFFFFF', valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 4.9, h: 0.75, fontSize: 13, color: 'BFD8C8' });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.9, h: 0.45, fontFace: 'Cambria', fontSize: 16, bold: true, color: 'F9A825' });
    metaFooter({ color: 'BFD8C8' })(ctx, s);
  },
};
module.exports = { id: 98, slug: 'karta', name: 'Karta', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "strategiya va imkoniyat tili: tanlov, xavf va yutuq; ishonchli va qiziqarli", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "elegant"], "transitions": ["p14:flip|dir=\"r\"", "p14:flip|dir=\"l\"", "fade"], "cover": ["swingRight", "spinIn"], "mark": "spinIn", "deco": "swing", "sig": {"title": "swingRight", "body": "fadeUp", "item": ["swingLeft", "swingRight"], "image": "spinIn", "number": "spinIn", "order": "alternate", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
