/** 179 Mineral — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 179, slug: 'mineral', name: "Mineral", mode: 'left', list: 'rows', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'EEF2F6', muted: 'A9B6C3', accent: '9ED0E6' }, photo: { r: 0.08 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('3A4A5C'), blobs([[1400,150,320,'5B7088',0.9],[200,850,300,'2C3A49',0.9]],150), grain(0.05)),
  // a mineral specimen under study: registration crosses, rulers and ticks, a stratigraphic log, a fault, a prism; cut facets for pictures
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const foot = (s, x = 0.7, w = 8.6) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted });
    const open = async (d, x = 0.7, y = 0.45, w = 7.4, h = 0.9, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: TI, valign: 'bottom', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14.5, min: 10.5, color: C.accent, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, color: C.accent, ...o });
    const ln = (s, x, y, w, h = 0, wt = 0.75, o = {}) => t.line(s, x, y, w, h, C.accent, wt, o);
    const plus = (s, x, y, r = 0.09) => { ln(s, x - r, y, 2 * r, 0, 0.75); ln(s, x, y - r, 0, 2 * r, 0.75); };
    const seg = (s, x1, y1, x2, y2, wt = 0.75) => ln(s, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1), wt, (x2 - x1) * (y2 - y1) < 0 ? { flipV: true } : {});
    const ruler = (s, x, y, w, every, major) => { ln(s, x, y, w, 0, 0.75); for (let i = 0; i <= every; i++) ln(s, x + (i * w) / every, y, 0, i % major === 0 ? 0.14 : 0.07, 0.5); };
    const V = {
      image: [
        async (d) => { // a cut stone: the picture faceted, the notes to its left
          const s = await open(d, 0.7, 0.5, 4.3, 1.05);
          await k.photo(s, d.image, 5.3, 0.5, 4.2, 4.6, { mask: { poly: [[0.28, 0], [0.76, 0.04], [1, 0.3], [0.95, 0.74], [0.62, 1], [0.2, 0.92], [0, 0.56], [0.06, 0.2]] } });
          p(s, d.text, 0.7, 1.65, 4.35, 3.48);
        },
        async (d) => { // a thin section on the stage: square picture, crosses at its corners, a scale under it
          const s = await open(d, 5.05, 0.5, 4.25, 1.05);
          const X = 0.85, Y = 0.55, D = 4.0;
          await k.photo(s, d.image, X, Y, D, D);
          [[X, Y], [X + D, Y], [X, Y + D], [X + D, Y + D]].forEach(([a, b]) => plus(s, a, b, 0.13));
          ruler(s, X, Y + D + 0.14, D, 20, 5);
          p(s, d.text, 5.05, 1.65, 4.25, 3.48);
        },
        async (d) => { // a drill core: one long strip of picture across the page, measured along its upper edge
          const s = await open(d, 0.7, 0.32, 7.4, 0.72);
          ruler(s, 0, 1.1, 10, 50, 5);
          await k.photo(s, d.image, 0, 1.28, 10, 1.42);
          p(s, d.text, 0.7, 2.84, 8.6, 2.3, { max: 13.5 });
        },
        async (d) => { // the rock face fills the page, a slate plate is fixed to it with four crosses
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          const X = 3.9, Y = 0.5, W = 5.6, H = 4.2;
          t.rect(s, X, Y, W, H, '3A4A5C', { t: 4, name: 'Plate' });
          [[X, Y], [X + W, Y], [X, Y + H], [X + W, Y + H]].forEach(([a, b]) => plus(s, a, b, 0.13));
          k.head(s, d.title, X + 0.25, Y + 0.14, W - 1.4, 0.9, { max: 22, min: 13, color: TI, valign: 'bottom' });
          k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, X + W - 1.25, Y + 0.12, 1.05, 0.25, { size: 9, color: C.muted, align: 'right', spacing: 1 });
          p(s, d.text, X + 0.25, Y + 1.12, W - 0.5, H - 1.25, { max: 13 });
          foot(s);
        },
      ],
      cards: [
        async (d) => { // specimen columns: a cross at the head of each, its catalogue number, its label
          const s = await page(d), n = d.items.length, gap = 0.34, w = (8.6 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap);
            plus(s, x + 0.09, 1.66);
            k.txt(s, String(i + 1).padStart(2, '0'), x + 0.26, 1.54, 0.6, 0.24, { size: 10, bold: true, color: C.muted, valign: 'middle', ls: 1 });
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x + w - 0.34, 1.5, 0.34, 0.34);
            h3(s, it.h, x, 1.95, w, 0.54);
            p(s, it.t, x, 2.5, w, 2.62, { max: 13.5 });
          }
        },
        async (d) => { // the title on a measured rail at the left, a tidy field of entries at the right
          const s = await open(d, 0.7, 0.5, 2.6, 2.9, { max: 26, valign: 'top' }), n = d.items.length, w = 2.75, H = 2.32;
          ruler(s, 0.7, 3.5, 2.6, 13, 13);
          for (const [i, it] of d.items.entries()) {
            const whole = n === 3 && i === 2, x = 3.75 + (i % 2) * (w + 0.3), y = 0.5 + Math.floor(i / 2) * H, ww = whole ? 2 * w + 0.3 : w;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, y, 0.3, 0.3);
            h3(s, it.h, x, y + 0.34, ww, 0.5, { max: 13.5 });
            p(s, it.t, x, y + 0.84, ww, H - 0.9, { max: 13 });
          }
        },
        async (d) => { // inclined bedding: slanted lines part the columns
          const s = await page(d), n = d.items.length, gap = 0.5, w = (8.6 - gap * (n - 1)) / n;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            if (i) seg(s, x - gap / 2 + 0.13, 1.55, x - gap / 2 - 0.13, 5.1, 0.75);
            h3(s, it.h, x, 1.6, w - 0.06, 0.54);
            p(s, it.t, x, 2.18, w - 0.06, 2.94, { max: 14 });
          });
        },
        async (d) => { // a fault: a jagged line runs down the page, the right side has slipped lower
          const s = await page(d), n = d.items.length, w = 3.95, H = 1.74, top = 1.5, pts = [[5.0, 1.45], [4.9, 2.3], [5.1, 2.75], [4.92, 3.7], [5.08, 4.3], [5.0, 5.14]];
          pts.slice(1).forEach((q, i) => seg(s, pts[i][0], pts[i][1], q[0], q[1], 1));
          for (const [i, it] of d.items.entries()) {
            const r = i % 2, x = r ? 5.35 : 0.7, y = top + Math.floor(i / 2) * H + (r ? 0.3 : 0);
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, y, 0.3, 0.3);
            h3(s, it.h, x + 0.4, y, w - 0.4, 0.3, { valign: 'middle' });
            p(s, it.t, x, y + 0.36, w, Math.min(H - 0.42, 5.12 - y - 0.36), { max: 13 });
          }
        },
      ],
      process: [
        async (d) => { // a graduated ruler across the page, a stage under each main division
          const s = await page(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, ly = 1.62;
          ruler(s, 0.7, ly, 8.6, n * 10, 10);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (8.6 / n);
            fig(s, String(i + 1).padStart(2, '0'), x, ly + 0.2, w, 0.6, { max: 30, align: 'left', valign: 'top' });
            h3(s, st.h, x, ly + 0.82, w, 0.52, { color: C.ink, max: 14 });
            p(s, st.t, x, ly + 1.36, w, 5.12 - ly - 1.36, { max: 13 });
          });
        },
        async (d) => { // the beds step down: each column dropped lower along a line of slip
          const s = await page(d), n = d.steps.length, gap = 0.26, w = (8.6 - gap * (n - 1)) / n, dy = n === 4 ? 0.3 : 0.42;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = 1.5 + i * dy;
            ln(s, x, y, w + (i < n - 1 ? gap : 0), 0, 1);
            if (i < n - 1) ln(s, x + w + gap, y, 0, dy, 1);
            k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.accent } }, { text: st.h, options: { bold: true, color: C.accent } }], x, y + 0.06, w, 0.52, { max: 14, min: 10.5, font: F.head });
            p(s, st.t, x, y + 0.6, w, 5.12 - y - 0.6, { max: 13 });
          });
        },
        async (d) => { // a stratigraphic log: a tall narrow column of numbered beds, each leading across to its description
          const s = await page(d), n = d.steps.length, H = 3.55 / n, X = 0.7, W = 0.62;
          d.steps.forEach((st, i) => {
            const y = 1.55 + i * H;
            t.rect(s, X, y, W, H, null, { line: { color: C.accent, width: 0.75 }, name: 'Bed' });
            k.txt(s, String(i + 1), X, y, W, H, { size: 16, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
            ln(s, X + W, y + 0.17, 0.32, 0, 0.5);
            h3(s, st.h, 1.75, y, 7.55, 0.32, { valign: 'middle', color: C.ink });
            p(s, st.t, 1.75, y + 0.33, 7.55, H - 0.38, { max: 13, ls: 1.14 });
          });
        },
        async (d) => { // a prism: one beam comes in, the steps fan out from it, each on its own ray
          const s = await page(d), n = d.steps.length, H = 3.6 / n, ax = 1.15, bx = 2.25, top = 2.45, bot = 4.05, cy = (top + bot) / 2;
          seg(s, ax, bot, bx, bot, 1); seg(s, ax, bot, (ax + bx) / 2, top, 1); seg(s, (ax + bx) / 2, top, bx, bot, 1);
          seg(s, 0, cy + 0.1, ax + 0.3, cy + 0.1, 1.25);
          d.steps.forEach((st, i) => {
            const y = 1.5 + i * H, ty = y + 0.16;
            seg(s, bx - 0.28, cy + 0.1, 3.5, ty, 0.75);
            h3(s, `${i + 1}   ${st.h}`, 3.62, y, 5.68, 0.32, { valign: 'middle' });
            p(s, st.t, 3.62, y + 0.33, 5.68, H - 0.38, { max: 13, ls: 1.14 });
          });
        },
      ],
      stats: [
        async (d) => { // assay table: figures flush right against an upright, the reading to its right, ruled rows
          const s = await page(d), H = d.note ? 0.88 : 1.12;
          ln(s, 3.9, 1.55, 0, 3 * H, 0.75);
          d.stats.forEach((x, i) => {
            const y = 1.55 + i * H;
            if (i) ln(s, 0.7, y, 8.6, 0, 0.5);
            fig(s, x.value, 0.7, y, 3.0, H, { max: 34, min: 16, align: 'right' });
            p(s, x.label, 4.15, y, 5.15, H, { valign: 'middle', max: 14.5 });
          });
          if (d.note) p(s, d.note, 0.7, 4.3, 8.6, 0.84, { max: 12, color: C.muted });
        },
        async (d) => { // the principal reading framed by four crosses, two lesser readings beside it
          const s = await page(d), [a, ...rest] = d.stats, X = 0.85, Y = 1.65, W = 5.1, H = 1.9;
          [[X, Y], [X + W, Y], [X, Y + H], [X + W, Y + H]].forEach(([c, e]) => plus(s, c, e, 0.12));
          fig(s, a.value, X + 0.15, Y + 0.08, W - 0.3, 1.2, { max: 66, min: 26, align: 'center' });
          p(s, a.label, X + 0.2, Y + 1.28, W - 0.4, 0.56, { align: 'center', max: 13 });
          if (d.note) p(s, d.note, 0.7, 3.72, 5.4, 1.4, { max: 12, color: C.muted });
          rest.forEach((x, i) => {
            const y = 1.55 + i * 1.8;
            k.head(s, x.value, 6.45, y, 2.85, 0.76, { max: 32, min: 15, color: C.ink, valign: 'bottom' });
            ln(s, 6.45, y + 0.8, 2.85, 0, 0.5);
            p(s, x.label, 6.45, y + 0.86, 2.85, 0.8, { max: 13 });
          });
        },
      ],
      compare: [
        async (d) => { // two samples in one table: a small index down the middle, rows ruled right across
          const s = await page(d), w = 3.85;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.2, 2.88);
          k.head(s, d.left.h, 0.7, 1.48, w, 0.52, { max: 18, min: 12, color: C.ink });
          k.head(s, d.right.h, 5.45, 1.48, w, 0.52, { max: 18, min: 12, color: C.accent });
          let y = 2.08;
          rows.forEach((rh, j) => {
            ln(s, 0.7, y, 8.6, 0, 0.5);
            k.txt(s, String(j + 1), 4.7, y + 0.04, 0.6, 0.26, { size: 10, bold: true, color: C.muted, align: 'center', ls: 1 });
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y + 0.07, w, rh - 0.07, { size: fs, color: C.ink });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.45, y + 0.07, w, rh - 0.07, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // two beds one on the other, each name set sideways along the edge
          const s = await page(d), H = 1.78;
          [d.left, d.right].forEach((sd, i) => {
            const y = 1.5 + i * (H + 0.04), n = sd.items.length, hh = (H - 0.12) / Math.ceil(n / 2);
            ln(s, 0.7, y, 8.6, 0, i ? 0.75 : 1.25);
            k.head(s, sd.h, 0.95 - (H - 0.1) / 2, y + H / 2 - 0.15, H - 0.1, 0.4, { size: 11, color: i ? C.accent : C.ink, rotate: 270, align: 'center', valign: 'middle' });
            sd.items.forEach((it, j) => p(s, it, 1.4 + (j % 2) * 4.05, y + 0.08 + Math.floor(j / 2) * hh, 3.85, hh - 0.02, { max: 13.5 }));
          });
        },
      ],
      statement: [
        async (d) => { // the field of view: four crosses mark the sentence off, the note under, the title over
          const s = await open(d, 0.7, 0.34, 7.4, 0.5, { max: 15, min: 11, color: C.accent, valign: 'middle' }, 'focus'), X = 0.75, Y = 0.98, W = 8.5, H = 2.72;
          [[X, Y], [X + W, Y], [X, Y + H], [X + W, Y + H]].forEach(([a, b]) => plus(s, a, b, 0.13));
          k.head(s, L.runs(d.text), X + 0.3, Y + 0.12, W - 0.6, H - 0.24, { max: 36, min: 17, color: C.ink });
          if (d.caption) p(s, d.caption, X + 0.3, Y + H + 0.14, W - 0.6, 1.26, { max: 12.5, color: C.muted, ls: 1.14 });
        },
        async (d) => { // a ruler up the left, title and note along it, the sentence beyond
          const s = await open(d, 1.05, 0.5, 2.5, 1.35, { max: 15, min: 11, color: C.accent, valign: 'top' }, 'focus');
          ln(s, 0.75, 0.5, 0, 4.62, 0.75);
          for (let i = 0; i <= 24; i++) ln(s, 0.75, 0.5 + (i * 4.62) / 24, i % 4 === 0 ? 0.16 : 0.08, 0, 0.5);
          if (d.caption) p(s, d.caption, 1.05, 1.9, 2.5, 3.22, { max: 12, color: C.muted, valign: 'bottom', ls: 1.14 });
          k.head(s, L.runs(d.text), 3.9, 0.5, 5.4, 4.62, { max: 36, min: 17, color: C.ink });
        },
      ],
      timeline: [
        async (d) => { // a borehole log: dates against a graduated upright, entries beyond it
          const s = await page(d), H = 0.9;
          ln(s, 2.75, 1.52, 0, 3.6, 0.75);
          for (let i = 0; i <= 32; i++) { const tw = i % 8 === 0 ? 0.18 : 0.08; ln(s, 2.75 - tw, 1.52 + (i * 3.6) / 32, tw, 0, 0.5); }
          d.items.forEach((it, i) => {
            const y = 1.5 + i * H;
            fig(s, it.year, 0.7, y, 1.75, 0.44, { max: 19, min: 11, align: 'right', valign: 'top' });
            h3(s, it.h, 3.0, y, 6.3, 0.28, { valign: 'middle', max: 13 });
            p(s, it.t, 3.0, y + 0.29, 6.3, H - 0.33, { max: 12, ls: 1.1 });
          });
        },
        async (d) => { // the record stands on a base line, dates read under it
          const s = await page(d), gap = 0.28, w = (8.6 - gap * 3) / 4, ly = 4.55;
          ruler(s, 0.7, ly, 8.6, 40, 10);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            h3(s, it.h, x, 1.5, w, 0.5, { max: 13.5, color: C.ink });
            p(s, it.t, x, 2.02, w, ly - 2.08, { max: 13, ls: 1.14 });
            fig(s, it.year, x, ly + 0.14, w, 0.46, { max: 22, min: 11, align: 'left' });
          });
        },
        async (d) => { // four plates in a tray, a cross at each corner of the group, dates large
          const s = await page(d), w = 4.1, H = 1.74;
          [[0.7, 1.52], [9.3, 1.52], [0.7, 5.04], [9.3, 5.04], [5, 3.28]].forEach(([a, b]) => plus(s, a, b, 0.12));
          d.items.forEach((it, i) => {
            const x = i % 2 ? 5.2 : 0.7, y = 1.62 + Math.floor(i / 2) * (H + 0.02);
            fig(s, it.year, x, y, w - 0.15, 0.48, { max: 24, min: 12, align: 'left' });
            h3(s, it.h, x, y + 0.48, w - 0.15, 0.28, { valign: 'middle', color: C.ink, max: 13 });
            p(s, it.t, x, y + 0.77, w - 0.15, H - 0.86, { max: 12, ls: 1.1 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process and timeline are the rows of the cards
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "toshdek mustahkam: tahliliy, aniq va xolis" });
