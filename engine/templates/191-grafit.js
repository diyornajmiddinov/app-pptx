/** 191 Grafit — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 191, slug: 'grafit', name: "Grafit", mode: 'top', list: 'cols', num: 'corner', F: { head: 'Arial', body: 'Arial' },
  C: { ink: '1C1C1E', muted: '5B5B60', accent: '1C1C1E' }, photo: { r: 0.0 }, rule: true, caps: false, bold: true,
  bg: (kind) => (kind === 'ink' ? compose(lin([[0,'232326'],[1,'141416']]), grain(0.05)) : compose(lin([[0,'F4F4F5'],[1,'DCDCDF']]), grain(0.05))),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, as a draughtsman would: a ruler's ticks, dimension lines, a register mark, grey pictures, pure scale of type, and pages drawn in negative: a deck's pages must not look alike (L.pages)
    const WH = 'F4F4F5', LG = 'B8B8BD';
    const foot = (s, c = C.muted, x = 0.7, w = 8.6) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: c });
    const open = async (d, o = {}) => { const s = await slide('page'), { x = 0.7, y = 0.3, w = 8.0, h = 1.0, ...rest } = o; if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 14, color: C.ink, valign: 'bottom', ...rest }); num(s); foot(s); return s; };
    const neg = async (d, o = {}) => { const s = await slide('ink'), { x = 0.7, y = 0.3, w = 8.0, h = 1.0, ...rest } = o; if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 14, color: WH, valign: 'bottom', ...rest }); k.txt(s, String(k.idx).padStart(2, '0'), 9.05, 0.18, 0.6, 0.3, { size: 9, color: LG, align: 'right' }); foot(s, LG); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 72, min: 18, color: C.ink, ...o });
    const ln = (s, x, y, w, h = 0, c = C.ink, wd = 0.75) => t.line(s, x, y, w, h, c, wd);
    const ruler = (s, x, y, w, n, c = C.ink) => { ln(s, x, y, w, 0, c); for (let i = 0; i <= n; i++) ln(s, x + (w / n) * i, y - 0.08, 0, 0.16, c); };
    const cross = (s, x, y, c = C.ink) => { ln(s, x - 0.09, y, 0.18, 0, c); ln(s, x, y - 0.09, 0, 0.18, c); };
    const ic = async (s, it, x, y, z, c = C.ink) => t.img(s, await L.icon(it.icon, c, 1.5), x, y, z, z);
    const V = {
      image: [
        async (d) => { // a grey picture two-thirds of the sheet, off the right edge; title and words in the margin left of it
          const s = await open(d, { w: 3.15, h: 1.5, max: 22, y: 0.4, valign: 'top' });
          await k.photo(s, d.image, 4.1, 0, 5.9, 5.2, { gray: true });
          p(s, d.text, 0.7, 1.95, 3.15, 3.2, { max: 12, ls: 1.12 });
        },
        async (d) => { // a low strip of picture on the ground line, the words in the open sheet above it
          const s = await open(d, { y: 0.3, h: 0.85, w: 8.0 });
          p(s, d.text, 0.7, 1.22, 8.6, 1.72, { max: 13, ls: 1.14 });
          await k.photo(s, d.image, 0, 3.05, 10, 2.15, { gray: true });
        },
        async (d) => { // in negative: the picture a square on a black sheet, register marks at its corners
          const s = await neg(d, { x: 5.2, w: 4.1, y: 0.45, h: 1.2, max: 22, valign: 'top' });
          await k.photo(s, d.image, 0.9, 0.7, 3.8, 4.2, { gray: true });
          [[0.72, 0.52], [4.88, 0.52], [0.72, 5.08], [4.88, 5.08]].forEach(([x, y]) => cross(s, x, y, LG));
          p(s, d.text, 5.2, 1.72, 4.1, 3.4, { color: WH, max: 12.5, ls: 1.14 });
        },
        async (d) => { // the picture over the whole sheet, a blank plate of paper set in its lower corner
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2, { gray: true });
          foot(s);
          t.rect(s, 0, 2.2, 6.6, 3.0, 'EDEDEF', { name: 'Plate' });
          k.head(s, d.title, 0.7, 2.35, 4.9, 0.7, { max: 17, min: 12, color: C.ink, valign: 'top' });
          k.txt(s, String(k.idx).padStart(2, '0'), 5.75, 2.37, 0.6, 0.26, { size: 9, color: C.muted, align: 'right' });
          p(s, d.text, 0.7, 3.08, 5.65, 2.05, { max: 12, ls: 1.12 });
        },
      ],
      cards: [
        async (d) => { // scale of type: two-figure numerals as wide as their rows, hairlines between
          const s = await open(d), n = d.items.length, hh = 3.68 / n;
          d.items.forEach((it, i) => {
            const y = 1.42 + i * hh;
            ln(s, 0.7, y, 8.6);
            big(s, String(i + 1).padStart(2, '0'), 0.7, y + 0.05, 1.6, hh - 0.1, { max: 44, min: 22, valign: 'top' });
            h3(s, it.h, 2.45, y + 0.08, 2.5, hh - 0.14);
            p(s, it.t, 5.05, y + 0.08, 4.25, hh - 0.12, { max: 12.5, min: 10, ls: 1.06 });
          });
        },
        async (d) => { // an offset grid: columns on a shared baseline, the second lifted one module above the first
          const s = await open(d, { w: 8.0, h: 0.85, y: 0.25 }), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = i % 2 ? 1.25 : 1.75;
            ln(s, x, y, w);
            await ic(s, it, x, y + 0.1, 0.4);
            h3(s, it.h, x, y + 0.58, w, 0.5, { max: 13 });
            p(s, it.t, x, y + 1.08, w, 5.13 - y - 1.08, { max: 12, min: 10, ls: 1.06 });
          }
        },
        async (d) => { // in negative: a white-on-black key to the page, the title large on the left
          const s = await neg(d, { w: 3.1, h: 3.2, y: 0.55, max: 26, valign: 'top' }), n = d.items.length, hh = 4.6 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 0.45 + i * hh;
            await ic(s, it, 4.15, y + 0.05, 0.44, WH);
            h3(s, it.h, 4.8, y + 0.03, 4.5, 0.3, { color: WH });
            p(s, it.t, 4.8, y + 0.34, 4.5, hh - 0.42, { color: LG, max: 12.5, min: 10, ls: 1.06 });
            if (i < n - 1) ln(s, 4.15, y + hh - 0.05, 5.15, 0, LG, 0.5);
          }
        },
        async (d) => { // one item drawn at full scale, the rest as small details at its side
          const s = await open(d), [a, ...rest] = d.items, hh = 3.68 / rest.length;
          await ic(s, a, 0.7, 1.5, 1.1);
          k.head(s, a.h, 0.7, 2.7, 3.7, 0.65, { max: 20, min: 12, color: C.ink, valign: 'top' });
          p(s, a.t, 0.7, 3.38, 3.7, 1.75, { max: 13.5, min: 10, ls: 1.12 });
          for (const [i, it] of rest.entries()) {
            const y = 1.42 + i * hh;
            ln(s, 4.75, y, 4.55);
            h3(s, it.h, 4.75, y + 0.07, 3.9, 0.3, { max: 13 });
            await ic(s, it, 8.98, y + 0.08, 0.3);
            p(s, it.t, 4.75, y + 0.39, 4.55, hh - 0.44, { max: 12, min: 10, ls: 1.05 });
          }
        },
      ],
      process: [
        async (d) => { // a ruler across the sheet: each step measured off along it
          const s = await open(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          ruler(s, 0.7, 1.72, 8.6, n * 8);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            ln(s, x, 1.55, 0, 0.34, C.ink, 2);
            k.head(s, String(i + 1), x + 0.08, 1.9, 0.5, 0.44, { max: 26, valign: 'top' , color: C.ink });
            h3(s, st.h, x + 0.5, 1.96, w - 0.5, 0.5, { max: 13 });
            p(s, st.t, x, 2.55, w, 2.58, { max: 13, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // plain square stairs drawn in one line, a step on each tread, going down
          const s = await open(d, { w: 5.6, h: 1.0, y: 0.3, valign: 'top' }), n = d.steps.length, w = 8.6 / n, dy = n === 4 ? 0.62 : 0.8;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * w, y = 1.4 + i * dy;
            ln(s, x, y, w, 0, C.ink, 1.5);
            if (i < n - 1) ln(s, x + w, y, 0, dy, C.ink, 1.5);
            k.head(s, String(i + 1), x, y + 0.05, 0.42, 0.4, { max: 22, color: C.ink, valign: 'top' });
            h3(s, st.h, x + 0.42, y + 0.09, w - 0.55, 0.5, { max: 12 });
            p(s, st.t, x, y + 0.6, w - 0.15, Math.min(5.13 - y - 0.6, 2.0), { max: 12, min: 10, ls: 1.05 });
          });
        },
        async (d) => { // numbers at huge scale in negative, one hard rule, words at their feet
          const s = await neg(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, String(i + 1), x, 1.3, w, 1.25, { max: 80, min: 40, color: WH, valign: 'bottom' });
            ln(s, x, 2.62, w, 0, WH, 1);
            h3(s, st.h, x, 2.7, w, 0.5, { color: WH, max: 13 });
            p(s, st.t, x, 3.2, w, 1.93, { color: LG, max: 12, min: 10, ls: 1.05 });
          });
        },
        async (d) => { // a right-angle section: a vertical axis, every step hung from it by a short tick
          const s = await open(d, { w: 2.9, x: 6.4, y: 0.55, h: 2.8, max: 24, valign: 'top', align: 'right' }), n = d.steps.length, hh = 4.6 / n;
          ln(s, 0.9, 0.5, 0, 4.6, C.ink, 1.5);
          d.steps.forEach((st, i) => {
            const y = 0.5 + i * hh;
            ln(s, 0.9, y + 0.15, 0.22, 0, C.ink, 1.5);
            k.head(s, String(i + 1), 1.2, y, 0.45, 0.34, { max: 18, color: C.ink, valign: 'top' });
            h3(s, st.h, 1.65, y + 0.03, 4.5, 0.3, { max: 13 });
            p(s, st.t, 1.65, y + 0.34, 4.5, hh - 0.42, { max: 12.5, min: 10, ls: 1.06 });
          });
        },
      ],
      stats: [
        async (d) => { // in negative: one figure as large as the sheet, the rest set small beneath it
          const s = await neg(d), [a, ...rest] = d.stats;
          k.head(s, a.value, 0.7, 1.3, 8.6, 1.85, { max: 115, min: 36, color: WH, valign: 'middle' });
          ln(s, 0.7, 3.2, 8.6, 0, WH, 1);
          p(s, a.label, 0.7, 3.3, 2.75, 0.85, { color: WH, max: 12.5, min: 10, ls: 1.05 });
          if (d.note) p(s, d.note, 0.7, 4.15, 2.75, 1.0, { color: LG, max: 9.5, min: 9, ls: 1.0 });
          rest.forEach((v, i) => {
            const x = 3.7 + i * 2.85;
            k.head(s, v.value, x, 3.3, 2.75, 0.62, { max: 28, min: 14, color: WH, valign: 'top' });
            p(s, v.label, x, 3.95, 2.75, 1.15, { color: LG, max: 12.5, min: 10, ls: 1.05 });
          });
        },
        async (d) => { // a table with nothing but rules: figure hard right, words hard left
          const s = await open(d), rh = d.note ? 0.84 : 1.2;
          d.stats.forEach((v, i) => {
            const y = 1.42 + i * rh;
            ln(s, 0.7, y, 8.6, 0, C.ink, i ? 0.5 : 1.5);
            p(s, v.label, 0.7, y + 0.05, 4.9, rh - 0.1, { max: 14, min: 10, valign: 'middle', ls: 1.08 });
            k.head(s, v.value, 5.8, y + 0.04, 3.5, rh - 0.08, { max: 44, min: 16, color: C.ink, align: 'right', valign: 'middle' });
          });
          ln(s, 0.7, 1.42 + 3 * rh, 8.6, 0, C.ink, 1.5);
          if (d.note) p(s, d.note, 0.7, 1.42 + 3 * rh + 0.05, 8.6, 5.15 - (1.42 + 3 * rh + 0.05), { max: 10.5, min: 9.5, color: C.muted, ls: 1.03 });
        },
      ],
      compare: [
        async (d) => { // a centre line with a register mark at each end; each side set toward it
          const s = await open(d), w = 3.55, cx = 5, { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.16, 2.9);
          ln(s, cx, 1.5, 0, 3.55); cross(s, cx, 1.5); cross(s, cx, 5.05);
          k.head(s, d.left.h, cx - 0.3 - w, 1.5, w, 0.55, { max: 17, min: 12, color: C.ink, align: 'right', valign: 'top' });
          k.head(s, d.right.h, cx + 0.3, 1.5, w, 0.55, { max: 17, min: 12, color: C.ink, valign: 'top' });
          let y = 2.15;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], cx - 0.3 - w, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], cx + 0.3, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // positive over negative: the two lists on sheets of opposite tone
          const s = await open(d, { y: 0.2, h: 0.72, max: 20 }), hh = 2.02;
          t.rect(s, 0, 3.05, 10, 2.15, '1C1C1E', { name: 'Negative' });
          [d.left, d.right].forEach((side, i) => {
            const y = i ? 3.15 : 1.0, c = i ? WH : C.ink;
            k.head(s, side.h, 0.7, y, 2.3, hh - 0.12, { max: 17, min: 12, color: c, valign: 'top' });
            side.items.forEach((it, j) => p(s, it, 3.2 + (j % 2) * 3.15, y + Math.floor(j / 2) * 0.96, 3.0, 0.9, { color: c, max: 12.5, min: 10, ls: 1.05 }));
          });
        },
      ],
      statement: [
        async (d) => { // the sentence at the largest scale the sheet allows, title and note under one hard rule
          const s = await open({});
          k.head(s, L.runs(d.text), 0.7, 0.3, 8.3, 3.35, { max: 40, min: 18, color: C.ink, valign: 'top' });
          ln(s, 0.7, 3.75, 8.6, 0, C.ink, 1.5);
          k.head(s, d.title, 0.7, 3.85, 2.9, 1.25, { max: 13, min: 10.5, color: C.ink, valign: 'top' });
          if (d.caption) p(s, d.caption, 3.8, 3.85, 5.5, 1.28, { max: 11.5, min: 9.5, color: C.muted, ls: 1.06 });
        },
        async (d) => { // in negative: register marks at the corners, the sentence alone in the centre
          const s = await neg(d, { x: 1.2, w: 7.6, y: 0.3, h: 0.6, max: 13, min: 11, color: LG, align: 'center', valign: 'middle' });
          [[0.7, 0.5], [9.3, 0.5], [0.7, 5.08], [9.3, 5.08]].forEach(([x, y]) => cross(s, x, y, LG));
          k.head(s, L.runs(d.text), 1.1, 1.05, 7.8, 2.6, { max: 32, min: 17, color: WH, align: 'center', valign: 'middle' });
          if (d.caption) p(s, d.caption, 1.6, 3.72, 6.8, 1.38, { max: 11.5, min: 10, color: LG, align: 'center', ls: 1.06 });
        },
      ],
      timeline: [
        async (d) => { // the ruler laid through the middle: years ticked off along it, events above and below
          const s = await open(d, { y: 0.25, h: 0.9 }), ly = 3.2, w = 3.3, xs = [0.7, 2.6, 4.5, 6.0];
          ruler(s, 0, ly, 10, 40);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.28 : ly + 0.16;
            ln(s, x, ly - 0.2, 0, 0.4, C.ink, 2);
            k.head(s, it.year, x, y, w, 0.34, { max: 18, min: 12, color: C.ink, valign: 'top' });
            h3(s, it.h, x, y + 0.34, w, 0.26, { max: 12 });
            p(s, it.t, x, y + 0.6, w, up ? ly - 0.22 - y - 0.6 : 5.15 - y - 0.6, { max: 11.5, min: 10, ls: 1.03 });
          });
        },
        async (d) => { // the years in negative, set large down a narrow black column; events on the paper next to it
          const s = await open(d, { x: 3.3, w: 5.4, y: 0.25, h: 0.95 }), hh = 3.85 / 4;
          t.rect(s, 0, 0, 2.95, 5.2, '1C1C1E', { name: 'Column' });
          d.items.forEach((it, i) => {
            const y = 1.3 + i * hh;
            k.head(s, it.year, 0.3, y, 2.4, hh - 0.08, { max: 26, min: 13, color: WH, align: 'right', valign: 'top' });
            h3(s, it.h, 3.3, y + 0.03, 6.0, 0.27, { max: 12.5 });
            p(s, it.t, 3.3, y + 0.3, 6.0, hh - 0.34, { max: 11.5, min: 10, ls: 1.03 });
          });
        },
        async (d) => { // a slope of type: each year pushed further along the sheet, a tick on its left
          const s = await open(d, { y: 0.25, h: 0.9 }), hh = 3.85 / 4, w = 5.1;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * 1.15, y = 1.3 + i * hh;
            ln(s, x, y + 0.04, 0, hh - 0.14, C.ink, 1.5);
            k.head(s, it.year, x + 0.12, y, 1.6, 0.3, { max: 14, min: 10.5, color: C.ink, valign: 'top' });
            h3(s, it.h, x + 1.75, y + 0.02, w - 1.75, 0.27, { max: 12 });
            p(s, it.t, x + 0.12, y + 0.3, w - 0.12, hh - 0.34, { max: 11, min: 10, ls: 1.0 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); // nor the first steps and years the columns of the cards
    return V;
  },
  tone: "toza grafika: faqat mazmun, ortiqcha bezaksiz" });
