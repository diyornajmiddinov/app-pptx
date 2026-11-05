/** 169 Shaftoli — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 169, slug: 'shaftoli', name: "Şaftoli", mode: 'center', list: 'cols', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '3B2A2A', muted: '7A6262', accent: 'E07A5F' }, photo: 'circle', rule: false, caps: false, bold: true,
  bg: (kind) => compose(flat('FFF1EA'), blobs(kind==='cover'?[[300,200,320,'FFC7B0'],[1300,300,300,'FFE3A8'],[900,800,320,'F9B7C8']]:[[100,850,300,'FFD7C6',0.8],[1550,50,260,'FFE8C2',0.8]],170)),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, among peaches: round fruit, a soft stem, a curved branch, everything friendly and rounded: a deck's pages must not look alike (L.pages)
    const DEEP = 'B4532F'; // the accent darkened for small type: plain coral is too pale on the peach ground
    const foot = (s, o = {}) => k.foot(s, { x: 1.0, w: 8.0, y: 5.3, size: 7.5, color: C.muted, align: 'center', ...o });
    const open = async (kind, d, x = 1.0, y = 0.45, w = 8.0, h = 0.9, o = {}) => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 13, color: C.ink, align: 'center', valign: 'bottom', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.18, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: DEEP, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 54, min: 16, color: C.accent, italic: true, ...o });
    const curve = async (s, key, d0, x, y, w, h, sw = 3) => { const W2 = Math.round(w * 100), H2 = Math.max(4, Math.round(h * 100)); t.img(s, await k.svg(`c${key}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}" viewBox="0 0 1 1" preserveAspectRatio="none"><path d="${d0}" fill="none" stroke="#${C.accent}" stroke-width="${sw}" vector-effect="non-scaling-stroke"/></svg>`, W2, H2), x, y, w, h, { alt: '' }); };
    const PEACH = 'M0.5,0.14 C0.62,0 1,0.02 1,0.46 C1,0.82 0.7,1 0.5,1 C0.3,1 0,0.82 0,0.46 C0,0.02 0.38,0 0.5,0.14 Z';
    const ring = async (s, x, y, d, ic) => { t.oval(s, x, y, d, d, null, { line: { color: C.accent, width: 1 }, name: 'Ring' }); if (ic) t.img(s, await L.icon(ic, DEEP, 1.75), x + d * 0.25, y + d * 0.25, d * 0.5, d * 0.5); };
    const V = {
      image: [
        async (d) => { // the picture cut as a whole peach, a stem above it
          const s = await open('page', d, 0.8, 0.35, 5.1, 1.1, { align: 'left', valign: 'middle' });
          await curve(s, 'stem', 'M0.1,1 C0.2,0.5 0.5,0.1 0.95,0', 7.1, 0.5, 0.5, 0.75);
          t.img(s, await L.photo(L.src(d.image), 3.5, 3.85, { mask: { path: PEACH } }), 5.6, 1.1, 3.5, 3.85, { alt: '' });
          p(s, d.text, 0.8, 1.55, 4.5, 3.6, { valign: 'middle', max: 14 });
        },
        async (d) => { // the picture hangs over the page like a bowl, title and words under its curve
          const s = await open('page', {});
          t.img(s, await L.photo(L.src(d.image), 10, 2.55, { mask: { path: 'M0,0 L1,0 L1,0.68 C0.72,1 0.28,1 0,0.68 Z' } }), 0, 0, 10, 2.55, { alt: '' });
          k.head(s, d.title, 1.0, 2.58, 8.0, 0.7, { max: 22, min: 13, color: C.ink, align: 'center' });
          p(s, d.text, 1.0, 3.3, 8.0, 1.88, { align: 'center', max: 13.5, ls: 1.1 });
        },
        async (d) => { // the picture fills the page, one great round of peach cream on it
          const s = await slide('page'), dd = 5.3, x = 2.35, y = 0.05;
          await k.photo(s, d.image, 0, 0, 10, 5.625);
          t.oval(s, x, y, dd, dd, 'FFF1EA', { t: 4, name: 'Round' });
          k.head(s, d.title, x + 1.05, y + 0.42, dd - 2.1, 0.95, { max: 20, min: 12, color: C.ink, align: 'center', valign: 'bottom' });
          p(s, d.text, x + 0.62, y + 1.42, dd - 1.24, 2.95, { max: 12.5, min: 10, align: 'center', ls: 1.08 });
          t.rect(s, 0, 5.28, 10, 0.345, 'FFF1EA', { name: 'Foot strip' });
          foot(s);
          k.txt(s, String(k.idx).padStart(2, '0'), 8.95, 0.12, 0.8, 0.28, { size: 10, bold: true, color: C.ink, align: 'right' });
        },
        async (d) => { // two fruits on one branch, the words to the right
          const s = await open('page', d, 3.9, 0.45, 5.3, 0.95, { align: 'right' });
          await curve(s, 'branch', 'M0,0.3 C0.3,-0.1 0.7,0.1 1,0.7', 0.3, 0.55, 3.4, 0.8);
          t.img(s, await L.photo(L.src(d.image), 2.75, 2.75, { mask: 'circle', position: 'left' }), 0.45, 1.0, 2.75, 2.75, { alt: '' });
          t.img(s, await L.photo(L.src(d.image), 1.75, 1.75, { mask: 'circle', position: 'right' }), 2.25, 3.35, 1.75, 1.75, { alt: '' });
          p(s, d.text, 4.3, 1.55, 4.9, 3.6, { align: 'right', max: 14 });
        },
      ],
      cards: [
        async (d) => { // fruit lying along a smile: the middle ones sit lower
          const s = await page(d), n = d.items.length, gap = 0.28, w = (8.6 - gap * (n - 1)) / n, ys = n === 4 ? [1.42, 1.78, 1.78, 1.42] : [1.42, 1.85, 1.42], dd = 0.62;
          await curve(s, 'smile', 'M0,0.02 C0.3,1 0.7,1 1,0.02', 0.9, 1.72, 8.2, 0.62);
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = ys[i];
            t.oval(s, x + w / 2 - dd / 2, y, dd, dd, 'FFF1EA', { line: { color: C.accent, width: 1 }, name: 'Fruit' });
            t.img(s, await L.icon(it.icon, DEEP, 1.75), x + w / 2 - 0.16, y + 0.15, 0.32, 0.32);
            h3(s, it.h, x, y + 0.68, w, 0.5, { align: 'center', max: 14 });
            p(s, it.t, x, y + 1.2, w, 5.17 - y - 1.2, { align: 'center', max: 13, ls: 1.08 });
          }
        },
        async (d) => { // a basket of pairs: ringed icon, then words, the odd item in the middle
          const s = await page(d), n = d.items.length, w = 4.05, hh = 1.72;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = wide ? 2.0 : 0.75 + (i % 2) * (w + 0.4), y = 1.5 + Math.floor(i / 2) * (hh + 0.05), ww = wide ? 6.0 : w;
            await ring(s, x, y + 0.04, 0.62, it.icon);
            h3(s, it.h, x + 0.76, y + 0.02, ww - 0.76, 0.36, { max: 14.5, valign: 'middle' });
            p(s, it.t, x + 0.76, y + 0.4, ww - 0.76, hh - 0.46, { max: 13, ls: 1.08 });
          }
        },
        async (d) => { // rows swinging left and right, a ring on the outer side of each
          const s = await page(d), n = d.items.length, hh = 3.6 / n, w = 6.6;
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.5 + i * hh, dd = Math.min(0.6, hh - 0.14), x = right ? 2.0 : 1.4, a = right ? 'right' : 'left';
            await ring(s, right ? 8.72 : 0.68, y + 0.03, dd, it.icon);
            h3(s, it.h, x, y, w, 0.32, { max: 14, align: a, valign: 'middle' });
            p(s, it.t, x, y + 0.32, w, hh - 0.37, { max: 12.5, ls: 1.03, align: a });
          }
        },
        async (d) => { // half a great fruit comes in from the left, holding the title
          const s = await open('page', {}), n = d.items.length, hh = 4.6 / n;
          t.oval(s, -1.9, 0.25, 5.1, 5.1, null, { line: { color: C.accent, width: 1 }, name: 'Great fruit' });
          k.head(s, d.title, 0.4, 1.35, 2.4, 2.8, { max: 24, min: 13, color: C.ink, align: 'center' });
          for (const [i, it] of d.items.entries()) {
            const y = 0.5 + i * hh, off = n === 4 ? [0.15, 0.3, 0.3, 0.15][i] : [0.15, 0.32, 0.15][i], x = 3.45 + off;
            t.img(s, await L.icon(it.icon, DEEP, 1.75), x, y + 0.02, 0.3, 0.3);
            h3(s, it.h, x + 0.4, y, 9.3 - x - 0.4, 0.34, { max: 14.5, valign: 'middle' });
            p(s, it.t, x + 0.4, y + 0.35, 9.3 - x - 0.4, hh - 0.42, { max: 13, ls: 1.05 });
          }
        },
      ],
      process: [
        async (d) => { // from seed to fruit: the rings grow, all standing on one line
          const s = await page(d), n = d.steps.length, gap = 0.28, w = (8.6 - gap * (n - 1)) / n, base = 2.75, ds = n === 4 ? [0.5, 0.75, 1.0, 1.22] : [0.6, 0.9, 1.22];
          t.line(s, 0.7, base, 8.6, 0, C.accent, 0.75);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), dd = ds[i];
            t.oval(s, x + w / 2 - dd / 2, base - dd, dd, dd, 'FFF1EA', { line: { color: C.accent, width: 1 }, name: 'Fruit' });
            t.text(s, String(i + 1), { x: x + w / 2 - dd / 2, y: base - dd, w: dd, h: dd, fontFace: F.head, italic: true, bold: true, fontSize: 12 + dd * 14, color: DEEP, align: 'center', valign: 'middle' });
            h3(s, st.h, x, base + 0.08, w, 0.5, { align: 'center', max: 14 });
            p(s, st.t, x, base + 0.6, w, 5.17 - base - 0.6, { align: 'center', max: 13, ls: 1.05 });
          });
        },
        async (d) => { // a climbing vine down the page, leaves to each side
          const s = await page(d), n = d.steps.length, w = 3.85, cx = 5, hh = 3.6 / n;
          await curve(s, 'vine', 'M0.5,0 C1.1,0.17 -0.1,0.33 0.5,0.5 S1.1,0.83 0.5,1', cx - 0.14, 1.5, 0.28, 3.65);
          d.steps.forEach((st, i) => {
            const right = i % 2 === 1, x = right ? cx + 0.3 : cx - 0.3 - w, y = 1.5 + i * hh, a = right ? 'left' : 'right';
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.32, { max: 14, align: a, valign: 'middle' });
            p(s, st.t, x, y + 0.32, w, Math.min(hh * (n === 4 ? 1.55 : 1) - 0.36, 5.17 - y - 0.32), { max: 12.5, ls: 1.05, align: a });
          });
        },
        async (d) => { // a soft stack, a small ring with its number over each step's name
          const s = await page(d), n = d.steps.length, hh = 3.65 / n, dd = 0.34;
          d.steps.forEach((st, i) => {
            const y = 1.48 + i * hh;
            t.oval(s, 5 - 1.6, y, dd, dd, null, { line: { color: C.accent, width: 1 }, name: 'Ring' });
            t.text(s, String(i + 1), { x: 5 - 1.6, y, w: dd, h: dd, fontFace: F.head, bold: true, fontSize: 12, color: DEEP, align: 'center', valign: 'middle' });
            h3(s, st.h, 5 - 1.2, y, 4.0, dd, { max: 14, color: C.ink, valign: 'middle' });
            p(s, st.t, 1.0, y + dd + 0.01, 8.0, hh - dd - 0.05, { align: 'center', max: 12.5, ls: 1.03 });
          });
        },
        async (d) => { // a winding orchard path: along the top, round the bend, back along the bottom
          const s = await open('page', d, 1.0, 0.3, 8.0, 0.82, { valign: 'middle' }), n = d.steps.length, w = 3.95, hh = 1.85, pos = n === 4 ? [[0.8, 1.2], [5.0, 1.2], [5.0, 3.25], [0.8, 3.25]] : [[0.8, 1.2], [5.0, 1.2], [2.9, 3.25]];
          await curve(s, 'path', 'M0,0 C1.4,0.2 1.4,0.8 0,1', 9.05, 1.5, 0.5, 2.0);
          d.steps.forEach((st, i) => {
            const [x, y] = pos[i];
            big(s, String(i + 1), x, y, 0.5, 0.5, { max: 26, min: 18, color: DEEP, valign: 'middle' });
            h3(s, st.h, x + 0.52, y, w - 0.52, 0.5, { max: 14.5, valign: 'middle', color: C.ink });
            p(s, st.t, x + 0.52, y + 0.52, w - 0.52, hh - 0.56, { max: 13, ls: 1.08 });
          });
        },
      ],
      stats: [
        async (d) => { // three peach outlines with the numbers in them
          const s = await page(d), cw = 8.6 / 3, W2 = 1.95, H2 = 1.85;
          for (const [i, x] of d.stats.entries()) {
            const xx = 0.7 + i * cw + (cw - W2) / 2;
            await curve(s, 'peach', PEACH, xx, 1.42, W2, H2, 3);
            k.head(s, x.value, xx + 0.22, 1.95, W2 - 0.44, 0.95, { max: 28, min: 12, color: DEEP, align: 'center' });
            p(s, x.label, 0.7 + i * cw + 0.08, 3.3, cw - 0.16, 0.68, { align: 'center', max: 12.5, ls: 1.03 });
          }
          if (d.note) p(s, d.note, 1.0, 4.02, 8.0, 1.15, { align: 'center', max: 11.5, min: 9.5, color: C.muted, ls: 1.05, valign: 'middle' });
        },
        async (d) => { // the biggest in the middle, its two friends either side
          const s = await page(d), [a, b, c] = d.stats;
          big(s, a.value, 2.9, 1.5, 4.2, 1.5, { max: 66, min: 24, align: 'center', valign: 'middle' });
          p(s, a.label, 3.1, 3.02, 3.8, 0.8, { align: 'center', max: 14, ls: 1.05 });
          [b, c].forEach((x, i) => {
            const xx = i ? 7.15 : 0.7;
            k.head(s, x.value, xx, 1.85, 2.15, 0.7, { max: 24, min: 12, color: DEEP, align: 'center' });
            p(s, x.label, xx, 2.56, 2.15, 1.05, { align: 'center', max: 12, min: 9.5, color: C.muted, ls: 1.03 });
          });
          if (d.note) p(s, d.note, 1.0, 3.95, 8.0, 1.22, { align: 'center', max: 12, min: 9.5, color: C.muted, ls: 1.05, valign: 'middle' });
        },
        async (d) => { // a soft list: the number leans in from the left, a little fruit between it and its words
          const s = await page(d), rh = d.note ? 0.9 : 1.15;
          d.stats.forEach((x, i) => {
            const y = 1.5 + i * rh;
            big(s, x.value, 0.75, y, 3.5, rh - 0.08, { max: 38, min: 15, align: 'right', valign: 'middle' });
            t.oval(s, 4.5, y + (rh - 0.08) / 2 - 0.09, 0.18, 0.18, C.accent);
            p(s, x.label, 4.95, y, 4.3, rh - 0.08, { max: 14, valign: 'middle', ls: 1.05 });
          });
          if (d.note) p(s, d.note, 1.0, 4.25, 8.0, 0.92, { align: 'center', max: 11.5, min: 9.5, color: C.muted, ls: 1.05 });
        },
      ],
      compare: [
        async (d) => { // the two halves of a split peach, one slid past the other: a name high on the left, a name low on the right
          const s = await page(d), w = 3.95;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.16, 2.9);
          await curve(s, 'seam', 'M0.6,0 C1.1,0.3 0,0.7 0.4,1', 4.85, 1.5, 0.3, 3.65);
          k.head(s, d.left.h, 0.7, 1.48, w, 0.55, { max: 20, min: 12, color: DEEP, align: 'right' });
          let y = 2.1;
          rows.forEach((rh, j) => { if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' }); y += rh; });
          y = 1.55;
          rows.forEach((rh, j) => { if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink }); y += rh; });
          k.head(s, d.right.h, 5.35, 4.6, w, 0.55, { max: 20, min: 12, color: C.ink });
        },
        async (d) => { // one over the other, a smile of a line between them
          const s = await open('page', d, 1.0, 0.3, 8.0, 0.8, { valign: 'middle' }), hh = 1.78;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.16 + i * (hh + 0.28);
            k.head(s, side.h, 1.0, y, 8.0, 0.4, { max: 18, min: 12, color: i ? C.ink : DEEP, align: 'center', valign: 'top' });
            const a = side.items.filter((_, j) => j % 2 === 0), b = side.items.filter((_, j) => j % 2), { rows, fs } = L.rowsFit([a, b], 13.5, 3.85, F.body, 0.1, hh - 0.42);
            side.items.forEach((it, j) => k.txt(s, it, 1.0 + (j % 2) * 4.15, y + 0.42 + (j > 1 ? rows[0] : 0), 3.85, rows[Math.floor(j / 2)], { size: fs, color: C.ink, align: j % 2 ? 'left' : 'right' }));
          });
          await curve(s, 'sm2', 'M0,0.05 C0.3,1 0.7,1 1,0.05', 3.0, 3.0, 4.0, 0.26);
        },
      ],
      statement: [
        async (d) => { // the thought held between two curves, as between two cupped hands
          const s = await open('focus', {});
          k.head(s, d.title, 1.0, 0.3, 8.0, 0.42, { max: 14, min: 10.5, color: DEEP, align: 'center', bold: false });
          await curve(s, 'up', 'M0,0.95 C0.3,0 0.7,0 1,0.95', 1.6, 0.76, 6.8, 0.42);
          k.head(s, L.runs(d.text), 1.0, 1.22, 8.0, 2.12, { max: 32, min: 16, color: C.ink, align: 'center', italic: true });
          await curve(s, 'dn', 'M0,0.05 C0.3,1 0.7,1 1,0.05', 1.6, 3.38, 6.8, 0.42);
          if (d.caption) p(s, d.caption, 1.3, 3.85, 7.4, 1.33, { align: 'center', max: 12.5, min: 10, color: C.muted, ls: 1.05 });
        },
        async (d) => { // the stone of the peach: one dark page, warm words on it
          const s = await slide('page'), PL = 'FFD7C6';
          t.rect(s, 0, 0, 10, 5.625, '3B2A2A', { name: 'Stone' });
          k.head(s, d.title, 0.8, 0.45, 5.6, 0.7, { max: 16, min: 11, color: PL, bold: false });
          k.head(s, L.runs(d.text), 0.8, 1.2, 5.6, 3.95, { max: 34, min: 16, color: 'FFF1EA', valign: 'top' });
          t.oval(s, 6.75, 0.55, 2.45, 2.45, null, { line: { color: 'E07A5F', width: 1 }, name: 'Ring' });
          t.oval(s, 7.45, 1.25, 1.05, 1.05, 'E07A5F', { name: 'Stone heart' });
          if (d.caption) p(s, d.caption, 6.75, 3.1, 2.45, 2.05, { max: 11.5, min: 9.5, color: PL, ls: 1.03 });
          k.txt(s, String(k.idx).padStart(2, '0'), 9.05, 0.18, 0.6, 0.3, { size: 9, color: PL, align: 'right' });
          foot(s, { color: PL });
        },
      ],
      timeline: [
        async (d) => { // a wave running through the years, up and down
          const s = await page(d), gap = 0.25, w = (8.6 - gap * 3) / 4;
          await curve(s, 'wave', 'M0,0.7 C0.125,0 0.125,0 0.25,0.5 S0.375,1 0.5,0.5 S0.625,0 0.75,0.5 S0.875,1 1,0.3', 0.7, 1.45, 8.6, 0.5);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap), y = i % 2 ? 2.08 : 1.92;
            big(s, it.year, x, y, w, 0.45, { max: 21, min: 11, align: 'center', color: DEEP, valign: 'middle' });
            h3(s, it.h, x, y + 0.46, w, 0.48, { max: 13.5, align: 'center', color: C.ink });
            p(s, it.t, x, y + 0.95, w, 5.17 - y - 0.95, { max: 12.5, ls: 1.05, align: 'center' });
          });
        },
        async (d) => { // four rounded labels, each year in its own, two by two
          const s = await page(d), w = 4.05, hh = 1.76;
          d.items.forEach((it, i) => {
            const x = 0.75 + (i % 2) * (w + 0.4), y = 1.5 + Math.floor(i / 2) * (hh + 0.03);
            t.rect(s, x + w / 2 - 0.85, y, 1.7, 0.38, null, { r: 0.19, line: { color: C.accent, width: 1 }, name: 'Label' });
            k.head(s, it.year, x + w / 2 - 0.8, y, 1.6, 0.38, { max: 13.5, min: 10, color: DEEP, align: 'center' });
            h3(s, it.h, x, y + 0.42, w, 0.32, { max: 14, color: C.ink, align: 'center', valign: 'middle' });
            p(s, it.t, x, y + 0.74, w, hh - 0.78, { max: 12.5, ls: 1.05, align: 'center' });
          });
        },
        async (d) => { // years swing from side to side down the page
          const s = await page(d), hh = 3.65 / 4;
          d.items.forEach((it, i) => {
            const right = i % 2 === 1, y = 1.48 + i * hh, a = right ? 'right' : 'left';
            big(s, it.year, right ? 7.15 : 0.75, y, 2.1, hh - 0.1, { max: 22, min: 11, align: a, valign: 'middle', color: DEEP });
            h3(s, it.h, right ? 0.75 : 2.95, y, 6.3, 0.32, { max: 14, align: a, valign: 'middle', color: C.ink });
            p(s, it.t, right ? 0.75 : 2.95, y + 0.32, 6.3, hh - 0.37, { max: 12.5, ls: 1.03, align: a });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old columns look like the cards
    R.stats = V.stats.shift(); // and so do the old number columns
    R.timeline = V.timeline.shift(); // and the old timeline rows
    return V;
  },
  tone: "iliq va do'stona: yengil ohang, ijobiy va sodda bayon" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "playful"], "transitions": ["fade", "p14:gallery|dir=\"l\"", "morph"], "cover": ["springIn", "riseWords"], "mark": "springIn", "deco": "softGrow", "sig": {"title": "springIn", "body": "fadeUp", "item": "softGrow", "image": "springIn", "number": "springIn", "order": "centerOut", "stagger": 0.2}, "tempo": 1.15, "kenburns": true};
