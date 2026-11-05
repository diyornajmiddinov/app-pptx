/** 166 Yashil choy — minimalist, background-driven (right composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 166, slug: 'yashil-choy', name: "Yaşil çoy", mode: 'right', list: 'rows', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '22332A', muted: '5D6F64', accent: '4E7A5A' }, photo: { r: 0.1 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('DCE5D3'), blobs([[150,780,300,'C7D6BB',0.9]],120), grain(0.08)),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, over green tea: the left of the page kept empty, a leaf, a rim, steam going up: a deck's pages must not look alike (L.pages)
    const foot = (s, x = 3.1, w = 6.3) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted });
    const open = async (kind, d, x, y, w, h, o = {}) => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: C.ink, align: 'right', valign: 'bottom', ...o }); num(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 15, min: 10, color: C.ink, ls: 1.25, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 54, min: 16, color: C.accent, bold: false, ...o });
    const lineV = (s, x, y, h) => t.line(s, x, y, 0, h, C.accent, 0.75);
    const lineH = (s, x, y, w) => t.line(s, x, y, w, 0, C.accent, 0.75);
    const LEAF = 'M0.5,0 C0.96,0.2 1.04,0.68 0.5,1 C-0.04,0.68 0.04,0.2 0.5,0 Z';
    const steam = (key, w, h) => k.svg(key, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M${w / 2},${h} C0,${h * 0.8} ${w},${h * 0.65} ${w / 2},${h * 0.5} S0,${h * 0.2} ${w / 2},0" fill="none" stroke="#${C.accent}" stroke-width="3"/></svg>`, w, h);
    const V = {
      image: [
        async (d) => { // the picture in the shape of a tea leaf, the words to its right
          const s = await open('page', d, 3.9, 0.45, 5.5, 0.95);
          t.img(s, await L.photo(L.src(d.image), 3.0, 4.75, { mask: { path: LEAF } }), 0.55, 0.42, 3.0, 4.75, { alt: '' });
          p(s, d.text, 3.9, 1.55, 5.5, 3.6, { max: 15, align: 'right', ls: 1.2 });
          foot(s, 3.9, 5.5);
        },
        async (d) => { // the picture as the surface in a cup, its thin rim round it, seen from above
          const s = await open('page', d, 0.7, 0.45, 5.1, 1.1, { align: 'left' }), dd = 3.45, x = 5.8, y = 1.4;
          t.oval(s, x - 0.14, y - 0.14, dd + 0.28, dd + 0.28, null, { line: { color: C.accent, width: 0.75 }, name: 'Rim' });
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
          p(s, d.text, 0.7, 1.68, 4.7, 3.47, { max: 14.5, ls: 1.2 });
          foot(s, 0.7, 4.7);
        },
        async (d) => { // the picture fills the page, a pale scroll hangs on its right
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625);
          t.rect(s, 5.9, 0, 3.7, 5.625, 'E6EDDF', { t: 4, name: 'Scroll' });
          t.line(s, 5.9, 0.22, 3.7, 0, C.accent, 0.75); t.line(s, 5.9, 5.2, 3.7, 0, C.accent, 0.75);
          k.head(s, d.title, 6.15, 0.35, 3.2, 1.2, { max: 22, min: 13, color: C.ink, align: 'right', valign: 'bottom' });
          p(s, d.text, 6.15, 1.65, 3.2, 3.5, { max: 13, align: 'right', ls: 1.1 });
          k.txt(s, String(k.idx).padStart(2, '0'), 8.7, 0.27, 0.65, 0.25, { size: 9, color: C.muted, align: 'right' });
          foot(s, 5.95, 3.6);
        },
        async (d) => { // a tall strip of picture at the right edge, the left of the page left quiet
          const s = await open('page', d, 2.6, 0.45, 4.85, 1.1);
          await k.photo(s, d.image, 7.75, 0, 2.25, 5.625);
          p(s, d.text, 2.6, 1.68, 4.85, 3.47, { max: 14.5, align: 'right', ls: 1.2 });
          foot(s, 2.6, 4.85);
        },
      ],
      cards: [
        async (d) => { // leaves on a stem: an item to the left, an item to the right
          const s = await page(d), n = d.items.length, hh = 3.55 / n, cx = 6.2, w = 3.0;
          lineV(s, cx, 1.55, 3.55);
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.55 + i * hh, x = right ? cx + 0.25 : cx - 0.25 - (w + 1.7), ww = right ? w : w + 1.7, a = right ? 'left' : 'right';
            t.img(s, await L.icon(it.icon, C.accent, 1.5), cx - 0.13, y + 0.02, 0.26, 0.26);
            h3(s, it.h, x, y, ww, 0.3, { max: 14, align: a, valign: 'middle' });
            p(s, it.t, x, y + 0.31, ww, Math.min(hh - 0.34 + (right ? 0.32 : 0), 5.16 - y - 0.31), { max: 12.5, ls: 1.05, align: a, color: C.muted });
          }
        },
        async (d) => { // steam: each item a little higher than the one before it
          const s = await open('focus', d, 0.7, 0.35, 8.7, 0.8, { valign: 'middle' }), n = d.items.length, gap = 0.3, w = (8.7 - gap * (n - 1)) / n, top = n === 4 ? [2.15, 1.82, 1.5, 1.2] : [2.1, 1.65, 1.2];
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = top[i];
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, y, 0.34, 0.34);
            h3(s, it.h, x, y + 0.38, w, 0.5, { max: 14 });
            p(s, it.t, x, y + 0.9, w, 5.16 - y - 0.9, { max: 13, ls: 1.12, color: C.muted });
          }
          foot(s, 0.7, 8.7);
        },
        async (d) => { // the title stands at the far right in a narrow column, the items to its left
          const s = await open('focus', d, 7.15, 0.75, 2.25, 3.4, { max: 24, valign: 'top' }), n = d.items.length, hh = 4.5 / n;
          lineV(s, 6.95, 0.6, 4.55);
          for (const [i, it] of d.items.entries()) {
            const y = 0.6 + i * hh;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), 6.42, y + 0.03, 0.32, 0.32);
            h3(s, it.h, 1.3, y, 5.0, 0.38, { max: 15, align: 'right', valign: 'middle' });
            p(s, it.t, 1.3, y + 0.39, 5.45, hh - 0.45, { max: 13, ls: 1.1, align: 'right', color: C.muted });
          }
          foot(s, 1.3, 5.45);
        },
        async (d) => { // a square tea tray: thin outline, four places on it
          const s = await page(d), n = d.items.length, X = 1.55, Y = 1.55, W2 = 7.85, H2 = 3.55, w = W2 / 2, hh = H2 / 2;
          t.rect(s, X, Y, W2, H2, null, { line: { color: C.accent, width: 0.75 }, name: 'Tray' });
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = X + (i % 2) * w, y = Y + Math.floor(i / 2) * hh, ww = wide ? W2 : w;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x + ww - 0.46, y + 0.1, 0.32, 0.32);
            h3(s, it.h, x + 0.14, y + 0.08, ww - 0.68, 0.36, { max: 14, align: 'right', valign: 'middle' });
            p(s, it.t, x + 0.14, y + 0.47, ww - 0.28, hh - 0.53, { max: 12.5, ls: 1.08, align: 'right', color: C.muted });
          }
        },
      ],
      process: [
        async (d) => { // read upward, like steam from the cup: the first step lies lowest
          const s = await page(d), n = d.steps.length, hh = 3.58 / n;
          t.img(s, await steam('steam', 60, 360), 9.1, 1.52, 0.3, 3.6, { alt: '' });
          d.steps.forEach((st, i) => {
            const y = 1.52 + (n - 1 - i) * hh;
            big(s, String(i + 1), 8.45, y, 0.55, 0.5, { max: 22, align: 'right', valign: 'top' });
            h3(s, st.h, 2.4, y, 5.95, 0.32, { max: 14.5, align: 'right', valign: 'middle' });
            p(s, st.t, 2.4, y + 0.32, 5.95, hh - 0.36, { max: 13, ls: 1.05, align: 'right' });
          });
        },
        async (d) => { // thin rings along a thread, each step under its ring
          const s = await open('page', d, 0.7, 0.45, 8.7, 0.85), n = d.steps.length, gap = 0.3, w = (8.7 - gap * (n - 1)) / n, dd = 0.72;
          lineH(s, 0.7, 1.86, 8.7);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            t.oval(s, x, 1.5, dd, dd, 'DCE5D3', { line: { color: C.accent, width: 0.75 }, name: 'Ring' });
            t.text(s, String(i + 1), { x, y: 1.5, w: dd, h: dd, fontFace: F.head, fontSize: 20, color: C.accent, align: 'center', valign: 'middle' });
            h3(s, st.h, x, 2.32, w, 0.5, { max: 14 });
            p(s, st.t, x, 2.84, w, 2.32, { max: 13, ls: 1.12 });
          });
          foot(s, 0.7, 8.7);
        },
        async (d) => { // poured from one side to the other: the steps zigzag down the page
          const s = await open('page', d, 0.7, 0.35, 8.7, 0.75, { valign: 'middle' }), n = d.steps.length, w = 4.1, hh = 4.0 / n, H2 = hh * 1.9;
          d.steps.forEach((st, i) => {
            const right = i % 2 === 1, x = right ? 5.3 : 0.7, y = 1.18 + i * hh, a = right ? 'left' : 'right';
            if (i < n - 1) t.line(s, 4.9, y + 0.15, 0.3, hh, C.accent, 0.75, right ? { flipV: true } : {});
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.32, { max: 14, align: a, valign: 'middle' });
            p(s, st.t, x, y + 0.32, w, Math.min(H2 - 0.34, 5.16 - y - 0.32), { max: 12.5, ls: 1.08, align: a });
          });
          foot(s, 0.7, 8.7);
        },
        async (d) => { // for once from the quiet left: large numerals, the words after them
          const s = await page(d), n = d.steps.length, hh = 3.58 / n;
          d.steps.forEach((st, i) => {
            const y = 1.52 + i * hh;
            big(s, String(i + 1), 0.7, y, 1.1, hh - 0.08, { max: 44, min: 22, valign: 'middle' });
            h3(s, st.h, 1.9, y, 7.5, 0.33, { max: 14.5, valign: 'middle' });
            p(s, st.t, 1.9, y + 0.33, 7.5, hh - 0.38, { max: 13, ls: 1.05, color: C.muted });
            if (i < n - 1) hair(s, 0.7, y + hh - 0.04, 8.7);
          });
        },
      ],
      stats: [
        async (d) => { // one number, unhurried, on the left; two small ones beyond a thin line
          const s = await page(d), [a, ...rest] = d.stats;
          big(s, a.value, 0.7, 1.55, 4.9, 1.65, { max: 72, min: 26, valign: 'middle' });
          p(s, a.label, 0.7, 3.25, 4.7, 0.9, { max: 14.5, ls: 1.12 });
          lineV(s, 5.85, 1.55, 3.55);
          rest.forEach((x, i) => {
            const y = 1.55 + i * 0.98;
            k.head(s, x.value, 6.1, y, 3.3, 0.5, { max: 24, min: 13, color: C.ink, align: 'right', bold: false });
            p(s, x.label, 6.1, y + 0.5, 3.3, 0.45, { max: 11.5, min: 9.5, color: C.muted, align: 'right', ls: 1.05 });
          });
          if (d.note) p(s, d.note, 6.1, 3.55, 3.3, 1.55, { max: 11, min: 9.5, color: C.muted, align: 'right', valign: 'bottom', ls: 1.1 });
        },
        async (d) => { // numbers out at the right edge, words set against them
          const s = await page(d), rh = d.note ? 0.9 : 1.15;
          d.stats.forEach((x, i) => {
            const y = 1.55 + i * rh;
            big(s, x.value, 6.0, y, 3.4, rh - 0.08, { max: 38, min: 15, align: 'right', valign: 'middle' });
            p(s, x.label, 1.3, y, 4.6, rh - 0.08, { max: 14, ls: 1.1, align: 'right', valign: 'middle' });
            hair(s, 1.3, y + rh - 0.04, 8.1);
          });
          if (d.note) p(s, d.note, 1.3, 4.3, 8.1, 0.86, { max: 11.5, min: 9.5, color: C.muted, ls: 1.08, align: 'right' });
        },
        async (d) => { // three cups seen from above, a number in each
          const s = await open('page', d, 0.7, 0.35, 8.7, 0.78, { valign: 'middle' }), cw = 2.9, dd = 1.95;
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * cw + (cw - dd) / 2;
            t.oval(s, xx, 1.2, dd, dd, null, { line: { color: C.accent, width: 0.75 }, name: 'Rim' });
            t.oval(s, xx + 0.1, 1.3, dd - 0.2, dd - 0.2, null, { line: { color: C.accent, width: 0.5 }, name: 'Rim' });
            big(s, x.value, xx + 0.2, 1.65, dd - 0.4, 1.05, { max: 30, min: 12, align: 'center', valign: 'middle' });
            p(s, x.label, 0.7 + i * cw + 0.08, 3.2, cw - 0.16, 0.75, { max: 12.5, ls: 1.08, align: 'center' });
          });
          if (d.note) p(s, d.note, 0.7, 4.0, 8.7, 1.16, { max: 12, min: 9.5, color: C.muted, ls: 1.1, align: 'center', valign: 'middle' });
          foot(s, 0.7, 8.7);
        },
      ],
      compare: [
        async (d) => { // two sides of a stem, set against it
          const s = await open('page', d, 0.7, 0.35, 8.7, 0.78, { valign: 'middle' }), w = 3.95, cx = 5.05;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.18, 3.15);
          k.head(s, d.left.h, 0.8, 1.2, w, 0.62, { max: 20, min: 12, color: C.accent, align: 'right', bold: false }); k.head(s, d.right.h, 5.3, 1.2, w, 0.62, { max: 20, min: 12, color: C.ink, bold: false });
          lineV(s, cx, 1.25, 3.9);
          let y = 1.95;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.8, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.3, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
          foot(s, 0.7, 8.7);
        },
        async (d) => { // two shelves, the name of each out at the right edge
          const s = await page(d), hh = 1.72;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.55 + i * (hh + 0.06);
            k.head(s, side.h, 7.45, y, 1.95, hh - 0.14, { max: 18, min: 11.5, color: i ? C.ink : C.accent, align: 'right', valign: 'top' });
            const a = side.items.filter((_, j) => j % 2 === 0), b = side.items.filter((_, j) => j % 2), { rows, fs } = L.rowsFit([a, b], 13, 2.85, F.body, 0.1, hh - 0.12);
            side.items.forEach((it, j) => k.txt(s, it, 1.3 + (j % 2) * 3.05, y + (j > 1 ? rows[0] : 0), 2.85, rows[Math.floor(j / 2)], { size: fs, color: C.ink, align: 'right' }));
            if (!i) hair(s, 1.3, y + hh - 0.02, 8.1);
          });
        },
      ],
      statement: [
        async (d) => { // the thought held in the round of a cup, the note beside it
          const s = await open('focus', d, 6.05, 0.35, 3.35, 1.1, { max: 16, bold: false, color: C.muted, valign: 'top' }), dd = 4.7, x = 0.75, y = 0.48;
          t.oval(s, x, y, dd, dd, null, { line: { color: C.accent, width: 0.75 }, name: 'Rim' });
          t.oval(s, x + 0.12, y + 0.12, dd - 0.24, dd - 0.24, null, { line: { color: C.accent, width: 0.5 }, name: 'Rim' });
          k.head(s, L.runs(d.text), x + 0.6, y + 0.85, dd - 1.2, dd - 1.7, { max: 28, min: 14, color: C.ink, align: 'center', bold: false });
          if (d.caption) p(s, d.caption, 6.05, 1.55, 3.35, 3.6, { max: 13.5, min: 10, color: C.muted, align: 'right', valign: 'bottom', ls: 1.15 });
          foot(s, 6.05, 3.35);
        },
        async (d) => { // the thought in a wide right-hand block, the note far out on the left
          const s = await open('page', d, 3.1, 0.35, 6.3, 0.8, { max: 18, bold: false, color: C.accent, valign: 'middle' });
          k.head(s, L.runs(d.text), 3.1, 1.2, 6.3, 3.95, { max: 36, min: 16, color: C.ink, align: 'right', valign: 'middle' });
          lineV(s, 2.9, 1.3, 3.8);
          if (d.caption) p(s, d.caption, 0.55, 1.3, 2.15, 3.85, { max: 11.5, min: 9.5, color: C.muted, ls: 1.08, valign: 'bottom' });
          foot(s);
        },
      ],
      timeline: [
        async (d) => { // a branch down the right edge, each year a node on it
          const s = await page(d), hh = 3.58 / 4;
          lineV(s, 9.3, 1.52, 3.6);
          d.items.forEach((it, i) => {
            const y = 1.52 + i * hh;
            t.oval(s, 9.24, y + 0.1, 0.12, 0.12, C.accent);
            big(s, it.year, 7.0, y, 2.12, 0.34, { max: 17, min: 10, align: 'right', valign: 'middle', bold: true });
            h3(s, it.h, 1.6, y, 5.3, 0.34, { max: 14, align: 'right', valign: 'middle' });
            p(s, it.t, 1.6, y + 0.34, 7.52, hh - 0.38, { max: 12.5, ls: 1.05, align: 'right', color: C.muted });
          });
        },
        async (d) => { // four narrow scrolls hung at two heights, set to the right
          const s = await open('focus', d, 0.7, 0.35, 8.7, 0.78, { valign: 'middle' }), gap = 0.28, w = (8.7 - gap * 3) / 4;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap), y = i % 2 ? 1.72 : 1.18;
            lineV(s, x + w + 0.08, y, 5.16 - y);
            big(s, it.year, x, y, w, 0.42, { max: 20, min: 11, valign: 'middle', align: 'right' });
            h3(s, it.h, x, y + 0.43, w, 0.5, { max: 13.5, align: 'right' });
            p(s, it.t, x, y + 0.95, w, 5.16 - y - 0.95, { max: 13, ls: 1.1, align: 'right' });
          });
          foot(s, 0.7, 8.7);
        },
        async (d) => { // a twig across the page: leaves over it and under it
          const s = await open('page', d, 0.7, 0.3, 8.7, 0.7, { valign: 'middle' }), ly = 3.05, w = 3.85, xs = [0.7, 1.2, 5.05, 5.55];
          t.line(s, 0.7, ly, 8.7, 0, C.accent, 0.75);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.08 : ly + 0.18;
            t.oval(s, x, ly - 0.06, 0.12, 0.12, C.accent);
            t.text(s, [{ text: `${it.year}   `, options: { color: C.accent, bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x, y, w, h: 0.38, fontFace: F.head, fontSize: L.fit(`${it.year}   ${it.h}`, w, 0.35, 14, 10, F.head, true), valign: 'middle' });
            p(s, it.t, x, y + 0.39, w, up ? 1.5 : 1.45, { max: 13, ls: 1.1 });
          });
          foot(s, 0.7, 8.7);
        },
      ],
    };
    R.cards = async (d) => { // the old rows left 4 items at 8.5pt in a narrow column: same rows, wider
      const s = await open('page', d, 3.1, 0.45, 6.3, 0.9), n = d.items.length, hh = 3.55 / n;
      d.items.forEach((it, i) => {
        const y = 1.55 + i * hh;
        k.txt(s, String(i + 1).padStart(2, '0'), 1.3, y, 0.6, 0.34, { size: 13, bold: true, color: C.accent, font: F.head });
        h3(s, it.h, 1.95, y, 7.45, 0.34, { max: 15 });
        p(s, it.t, 1.95, y + 0.35, 7.45, hh - 0.42, { max: 13, ls: 1.08, color: C.muted });
        if (i < n - 1) hair(s, 1.3, y + hh - 0.05, 8.1);
      });
      foot(s);
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old rows look like the cards
    R.stats = V.stats.shift(); // and so do the old stat rows
    R.timeline = V.timeline.shift(); // and the old timeline rows
    return V;
  },
  tone: "osoyishta va tabiiy: sog'lom muvozanat, sodda tushuntirish" });
