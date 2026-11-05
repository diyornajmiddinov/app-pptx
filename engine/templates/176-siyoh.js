/** 176 Siyoh — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 176, slug: 'siyoh', name: "Siyoh", mode: 'narrow', list: 'rows', num: 'none', F: { head: 'Georgia', body: 'Georgia' },
  C: { ink: 'E9EEF7', muted: '9AA8C2', accent: '8FB3FF' }, photo: { r: 0.06 }, rule: true, caps: false, bold: false,
  bg: (kind) => compose(flat('0B1020'), rad(1500,900,900,[[0,'1C2B55',0.9],[1,'0B1020',0]]), grain(0.05)),
  // ink on a night page: a philosopher's book. Pictures printed in blue ink, inkblots, a title running up the spine, footnotes, marginal notes, dialogue
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const foot = (s, x = 2.2, w = 5.6, a = 'center') => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted, align: a });
    const open = async (d, x = 2.2, y = 0.4, w = 5.6, h = 0.85, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: TI, bold: false, align: 'center', valign: 'bottom', ...o }); foot(s); return s; };
    const spine = (s, v, x, o = {}) => k.head(s, v, x + 0.27 - 2.35, 2.55 - 0.17, 4.7, 0.34, { max: 15, min: 9.5, color: C.accent, bold: false, italic: true, rotate: 270, align: 'left', valign: 'middle', ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.28, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.accent, bold: false, italic: true, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, color: C.accent, bold: false, italic: true, ...o });
    const ln = (s, x, y, w, h = 0, wt = 0.5, o = {}) => t.line(s, x, y, w, h, C.muted, wt, { t: 30, ...o });
    const INK = { duo: ['0B1020', '9DBBFF'] };
    const V = {
      image: [
        async (d) => { // an inkblot of picture, the reflection beside it
          const s = await open(d, 5.25, 0.45, 4.15, 1.1, { align: 'left' });
          await k.photo(s, d.image, 0.45, 0.35, 4.45, 4.8, { ...INK, mask: { path: 'M0.5,0 C0.8,-0.02 1,0.18 0.96,0.42 C0.93,0.62 1,0.8 0.82,0.93 C0.62,1.03 0.4,0.97 0.25,0.92 C0.05,0.86 -0.02,0.62 0.05,0.42 C0.1,0.2 0.22,0.02 0.5,0 Z' } });
          ln(s, 5.25, 1.62, 4.15);
          p(s, d.text, 5.25, 1.75, 4.15, 3.35);
        },
        async (d) => { // the picture is the book's fore-edge, the title runs up beside it
          const s = await open({});
          await k.photo(s, d.image, 7.75, 0, 2.25, 5.625, INK);
          spine(s, d.title, 7.1);
          p(s, d.text, 0.9, 0.55, 5.95, 4.55, { valign: 'middle', max: 15 });
        },
        async (d) => { // a small vignette at the head of the chapter, the column under it
          const s = await open(d, 1.5, 2.1, 7, 0.82, { max: 22 });
          await k.photo(s, d.image, 3.4, 0.35, 3.2, 1.72, { ...INK, mask: { r: 0.06 } });
          p(s, d.text, 1.3, 3.0, 7.4, 2.15, { align: 'center', max: 13.5 });
        },
        async (d) => { // the night itself: the picture over the whole page, sunk in ink, words floating on it
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625, INK);
          t.rect(s, 0, 0, 10, 5.625, '0B1020', { t: 28, name: 'Night' });
          k.head(s, d.title, 1.6, 0.45, 6.8, 0.95, { max: 26, min: 14, color: TI, bold: false, align: 'center', valign: 'bottom' });
          ln(s, 4.5, 1.5, 1.0, 0, 0.75, { t: 0 });
          p(s, d.text, 1.6, 1.62, 6.8, 3.5, { align: 'center', max: 14.5 });
          foot(s);
        },
      ],
      cards: [
        async (d) => { // marginal notes: each heading out in the margin, left and right by turns, the words in one long column
          const s = await open(d), n = d.items.length, H = 3.66 / n;
          d.items.forEach((it, i) => {
            const y = 1.45 + i * H, l = i % 2 === 0;
            h3(s, it.h, l ? 0.35 : 7.85, y, 1.85, H - 0.08, { align: l ? 'right' : 'left', max: 13 });
            p(s, it.t, 2.35, y, 5.3, H - 0.06, { max: 13, ls: 1.2, align: 'center' });
          });
          ln(s, 2.2, 1.46, 0, 3.6); ln(s, 7.8, 1.46, 0, 3.6);
        },
        async (d) => { // quiet columns, a fine icon over each, no line at all
          const s = await open(d), n = d.items.length, gap = 0.45, w = (8.8 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap);
            t.img(s, await L.icon(it.icon, C.accent, 1.1), x, 1.5, 0.42, 0.42);
            h3(s, it.h, x, 2.02, w, 0.56);
            p(s, it.t, x, 2.6, w, 2.52, { max: 13 });
          }
        },
        async (d) => { // footnotes: the title large on the page, the items set small at its foot under a short rule
          const s = await open(d, 0.9, 0.5, 8.2, 1.65, { max: 36, min: 18, italic: true, align: 'left', valign: 'top' }), n = d.items.length, gap = 0.4, w = (8.2 - gap) / 2, H = n === 4 ? 1.36 : 1.4;
          ln(s, 0.9, 2.2, 1.6, 0, 0.75, { t: 0 });
          d.items.forEach((it, i) => {
            const whole = n === 3 && i === 2, x = 0.9 + (i % 2) * (w + gap), y = 2.32 + (i < 2 ? 0 : H), ww = whole ? 8.2 : w;
            k.txt(s, [{ text: `${i + 1}  `, options: { color: C.accent, italic: true } }, { text: it.h, options: { color: C.accent, italic: true } }], x, y, ww, 0.28, { max: 13, min: 10.5, font: F.head, valign: 'middle' });
            p(s, it.t, x, y + 0.3, ww, H - 0.34, { max: 12.5, ls: 1.18 });
          });
        },
        async (d) => { // the title up the spine, items laid in two columns, the right one lower
          const s = await open({}), n = d.items.length, w = 3.75, H = n === 4 ? 2.3 : 2.3;
          spine(s, d.title, 0.45);
          ln(s, 1.1, 0.45, 0, 4.7);
          for (const [i, it] of d.items.entries()) {
            const r = i % 2, x = r ? 5.6 : 1.45, y = 0.5 + Math.floor(i / 2) * H + (r ? 0.32 : 0);
            t.img(s, await L.icon(it.icon, C.accent, 1.1), x, y, 0.3, 0.3);
            h3(s, it.h, x + 0.4, y, w - 0.4, 0.3, { valign: 'middle' });
            p(s, it.t, x, y + 0.36, w, Math.min(H - 0.42, 5.12 - y - 0.36), { max: 13 });
          }
        },
      ],
      process: [
        async (d) => { // a thought unfolding: each step begins further in and further down
          const s = await open(d, 0.9, 0.35, 6, 0.8, { align: 'left', max: 22 }), n = d.steps.length, H = 3.92 / n, dx = n === 4 ? 1.1 : 1.6, w = 5.0;
          d.steps.forEach((st, i) => {
            const x = 0.9 + i * dx, y = 1.22 + i * H;
            fig(s, String(i + 1), x - 0.5, y - 0.02, 0.42, 0.42, { max: 22, align: 'right', valign: 'top' });
            h3(s, st.h, x, y, w, 0.3, { valign: 'middle' });
            p(s, st.t, x, y + 0.31, w, H - 0.35, { max: 12.5, ls: 1.14 });
          });
        },
        async (d) => { // a fine line down the middle of the page, the steps either side, a small mark at each
          const s = await open(d), n = d.steps.length, H = 3.64 / n, w = 4.0, cx = 5;
          ln(s, cx, 1.46, 0, 3.64, 0.75, { t: 0 });
          d.steps.forEach((st, i) => {
            const y = 1.46 + i * H, l = i % 2 === 0, x = l ? cx - 0.28 - w : cx + 0.28, a = l ? 'right' : 'left';
            t.oval(s, cx - 0.05, y + 0.1, 0.1, 0.1, C.accent);
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.32, { align: a, valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.34, w, Math.min(n === 4 ? 1.2 : 1.45, 5.12 - y) - 0.34, { align: a, max: 12.5 });
          });
        },
        async (d) => { // a large numeral dissolving like wet ink behind each column
          const s = await open(d), n = d.steps.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap);
            t.text(s, String(i + 1), { x, y: 2.75, w, h: 2.4, fontFace: F.head, italic: true, fontSize: 130, color: C.accent, transparency: 80, align: 'right', valign: 'bottom', noShrink: true });
            h3(s, st.h, x, 1.5, w, 0.56);
            p(s, st.t, x, 2.08, w, 3.04, { max: 13.5 });
          });
        },
        async (d) => { // a thin circle holds the title, the steps wait around it, marks where each one stands on it
          const s = await open({}), n = d.steps.length, D = 2.5, cx = 5, cy = n === 4 ? 2.64 : 2.05, w = 2.85;
          t.oval(s, cx - D / 2, cy - D / 2, D, D, null, { line: { color: C.accent, width: 0.5 } });
          k.head(s, d.title, cx - 0.93, cy - 0.75, 1.86, 1.5, { max: 17, min: 11, color: TI, bold: false, italic: true, align: 'center' });
          const r = D / 2, Q = r * 0.707, spots = n === 4 ? [[0.6, 0.45, 'right', -Q, -Q], [6.55, 0.45, 'left', Q, -Q], [6.55, 2.95, 'left', Q, Q], [0.6, 2.95, 'right', -Q, Q]] : [[0.6, 0.72, 'right', -Q, -Q], [6.55, 0.72, 'left', Q, -Q], [1.9, 3.5, 'center', 0, r]];
          spots.forEach(([x, y, a, dx, dy], i) => {
            const whole = n === 3 && i === 2, ww = whole ? 6.2 : w, st = d.steps[i];
            t.oval(s, cx + dx - 0.06, cy + dy - 0.06, 0.12, 0.12, C.accent);
            h3(s, `${i + 1}.  ${st.h}`, x, y, ww, whole ? 0.32 : 0.54, { align: a, max: 14 });
            p(s, st.t, x, y + (whole ? 0.33 : 0.56), ww, whole ? 1.25 : 1.6, { align: a, max: 13 });
          });
        },
      ],
      stats: [
        async (d) => { // one above another down the middle of the page, the note in the margin
          const s = await open(d), H = 1.22;
          d.stats.forEach((x, i) => {
            const y = 1.42 + i * H;
            fig(s, x.value, 2.6, y, 4.8, 0.7, { max: 36, min: 18, align: 'center' });
            p(s, x.label, 2.6, y + 0.72, 4.8, 0.44, { align: 'center', max: 13 });
          });
          if (d.note) p(s, d.note, 7.6, 1.5, 1.95, 3.6, { max: 10.5, color: C.muted, valign: 'bottom', ls: 1.12 });
        },
        async (d) => { // one number glowing high on the page, two faint ones below it
          const s = await open(d, 0.8, 0.3, 8.4, 0.4, { max: 14, min: 11, align: 'left', color: C.accent, italic: true, valign: 'top' }), [a, b, c] = d.stats;
          fig(s, a.value, 1.0, 0.7, 8, 1.55, { max: 88, min: 30, align: 'center' });
          p(s, a.label, 2.2, 2.27, 5.6, 0.5, { align: 'center', max: 14 });
          [[b, 0.8], [c, 6.4]].forEach(([x, xx]) => {
            k.head(s, x.value, xx, 2.88, 2.8, 0.62, { max: 26, min: 14, color: C.ink, bold: false, italic: true, align: 'center' });
            p(s, x.label, xx, 3.52, 2.8, 0.7, { align: 'center', max: 12 });
          });
          if (d.note) p(s, d.note, 1.6, 4.25, 6.8, 0.88, { align: 'center', max: 11, color: C.muted, ls: 1.12 });
        },
        async (d) => { // the numbers are read as sentences: figure and words on one line, the note a footnote
          const s = await open(d, 0.9, 0.4, 8.2, 0.85, { align: 'left' }), H = d.note ? 0.86 : 1.1;
          d.stats.forEach((x, i) => {
            const y = 1.45 + i * H;
            k.txt(s, [{ text: `${x.value}  `, options: { fontSize: 30, italic: true, color: C.accent, fontFace: F.head } }, { text: x.label, options: { fontSize: 13, color: C.ink } }], 0.9, y, 8.2, H - 0.06, { size: 13, valign: 'middle', ls: 1.05 });
          });
          if (d.note) { ln(s, 0.9, 4.1, 1.6, 0, 0.75, { t: 0 }); p(s, d.note, 0.9, 4.2, 8.2, 0.94, { max: 11.5, color: C.muted, ls: 1.15 }); }
        },
      ],
      compare: [
        async (d) => { // an open book: two pages about a gutter, each flowing away from it
          const s = await open(d), w = 4.05;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.17, 2.85);
          h3(s, d.left.h, 0.6, 1.42, w, 0.5, { max: 17, align: 'right', valign: 'middle' });
          h3(s, d.right.h, 5.35, 1.42, w, 0.5, { max: 17, valign: 'middle' });
          ln(s, 5, 1.44, 0, 3.66, 0.75, { t: 0 });
          let y = 2.04;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.6, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // a dialogue: the two voices answer by turns, one from each side of the page
          const s = await open(d, 2.2, 0.32, 5.6, 0.72, { max: 22 }), turns = [], m = Math.max(d.left.items.length, d.right.items.length);
          for (let j = 0; j < m; j++) { if (d.left.items[j]) turns.push([0, d.left.items[j]]); if (d.right.items[j]) turns.push([1, d.right.items[j]]); }
          h3(s, d.left.h, 0.6, 1.08, 4.2, 0.34, { max: 13.5, valign: 'middle' }); h3(s, d.right.h, 5.2, 1.08, 4.2, 0.34, { max: 13.5, align: 'right', valign: 'middle', color: C.ink });
          ln(s, 0.6, 1.46, 8.8);
          const H = 3.6 / turns.length;
          turns.forEach(([r, v], i) => p(s, v, r ? 3.5 : 0.6, 1.52 + i * H, 5.9, H - 0.02, { align: r ? 'right' : 'left', color: r ? C.ink : C.accent, valign: 'middle', max: 12.5, ls: 1.1, italic: !r }));
        },
      ],
      statement: [
        async (d) => { // the sentence alone on the page in a long italic, its note a footnote, the title up the outer edge
          const s = await open({}, 0, 0, 0, 0, {}, 'focus');
          spine(s, d.title, 9.1);
          k.head(s, L.runs(d.text), 0.9, 0.4, 7.7, 3.2, { max: 34, min: 16, color: C.ink, bold: false, italic: true });
          ln(s, 0.9, 3.72, 1.6, 0, 0.75, { t: 0 });
          if (d.caption) p(s, d.caption, 0.9, 3.84, 7.7, 1.3, { max: 12.5, color: C.muted, ls: 1.15 });
        },
        async (d) => { // the title and note in the upper left, the sentence settling to the lower right, where the glow is
          const s = await open(d, 0.8, 0.4, 7.5, 0.5, { max: 15, min: 11, color: C.accent, italic: true, align: 'left', valign: 'top' }, 'focus');
          if (d.caption) p(s, d.caption, 0.8, 1.02, 4.3, 1.62, { max: 11.5, color: C.muted, ls: 1.15 });
          k.head(s, L.runs(d.text), 2.6, 2.3, 6.6, 2.85, { max: 30, min: 15, color: C.ink, bold: false, align: 'right', valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // dates in the margin, the chronicle in the column, one hair down the page
          const s = await open(d), H = 0.92;
          ln(s, 2.55, 1.46, 0, 3.66, 0.75, { t: 0 });
          d.items.forEach((it, i) => {
            const y = 1.44 + i * H;
            fig(s, it.year, 0.5, y, 1.85, 0.46, { max: 19, min: 11, align: 'right', valign: 'top' });
            h3(s, it.h, 2.8, y, 6.5, 0.28, { max: 13, valign: 'middle' });
            p(s, it.t, 2.8, y + 0.29, 6.5, H - 0.32, { max: 12, ls: 1.1 });
          });
        },
        async (d) => { // four chapters, high and low by turns, the year as a chapter head
          const s = await open(d), gap = 0.32, w = (8.8 - gap * 3) / 4;
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap);
            const y = i % 2 ? 1.95 : 1.42;
            fig(s, it.year, x, y, w, 0.62, { max: 26, min: 12, align: 'center' });
            ln(s, x + w / 2 - 0.3, y + 0.65, 0.6, 0, 0.75, { t: 0 });
            h3(s, it.h, x, y + 0.73, w, 0.5, { align: 'center', max: 13.5, color: C.ink });
            p(s, it.t, x, y + 1.25, w, 5.12 - y - 1.25, { align: 'center', max: 12.5, ls: 1.18 });
          });
        },
        async (d) => { // two and two: each entry first, its year fading out large below it, the ink not yet dry
          const s = await open(d), w = 4.1, H = 1.82;
          d.items.forEach((it, i) => {
            const x = 0.7 + (i % 2) * (w + 0.4), y = 1.4 + Math.floor(i / 2) * H;
            h3(s, it.h, x, y + 0.03, w, 0.3, { valign: 'middle' });
            p(s, it.t, x, y + 0.34, w, 0.92, { max: 12.5, ls: 1.14 });
            t.text(s, it.year, { x, y: y + 1.26, w, h: 0.48, fontFace: F.head, italic: true, color: C.accent, transparency: 35, align: 'right', valign: 'middle', fontSize: L.fit(it.year, w, 0.48, 28, 14, F.head, false, 1, true) });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process, stats and timeline are the rows of the cards
    R.stats = V.stats.shift();
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "chuqur mulohaza: sokin, falsafiy, ravon jumlalar" });
