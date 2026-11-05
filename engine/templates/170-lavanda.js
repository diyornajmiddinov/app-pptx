/** 170 Lavanda — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 170, slug: 'lavanda', name: "Lavanda", mode: 'narrow', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Georgia' },
  C: { ink: '2E2A3D', muted: '544E6A', accent: '7C5CBF' }, photo: { r: 0.2 }, rule: true, caps: false, bold: false,
  bg: (kind) => compose(lin([[0,'EFEAFB'],[1,'DCD3F3']],'d'), grain(0.04)),
  // a letter pressed with a sprig of lavender: one calm column, arched windows, italic verses, margin notes
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const open = async (d, x, y, w, h, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: TI, bold: false, italic: true, align: 'center', valign: 'bottom', ...o }); num(s); k.foot(s, { x: 1.0, w: 8, y: 5.3, size: 7.5, color: C.muted, align: 'center' }); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14.5, min: 10, color: C.ink, ls: 1.25, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.accent, bold: false, italic: true, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, color: C.accent, bold: false, italic: true, ...o });
    const ARCH = { path: 'M0,1 V0.32 A0.5,0.32 0 0 1 1,0.32 V1 Z' };
    const V = {
      image: [
        async (d) => { // a tall arched window to the left, the letter beside it
          const s = await open({}, 0, 0, 0, 0);
          await k.photo(s, d.image, 0.8, 0.5, 3.0, 4.65, { mask: ARCH });
          k.head(s, d.title, 4.3, 0.6, 4.9, 1.05, { max: 26, min: 14, color: TI, bold: false, italic: true, valign: 'bottom' });
          t.line(s, 4.3, 1.75, 0.9, 0, C.accent, 0.75);
          p(s, d.text, 4.3, 1.9, 4.9, 3.25, { max: 15 });
        },
        async (d) => { // a wide oval of picture above, title and text centred under it
          const s = await open(d, 1.2, 2.5, 7.6, 0.72, { max: 24 });
          await k.photo(s, d.image, 2.3, 0.35, 5.4, 2.1, { mask: 'circle' });
          p(s, d.text, 1.2, 3.3, 7.6, 1.88, { align: 'center', max: 14 });
        },
        async (d) => { // a slim stalk of picture down the middle, the title on one side and the text on the other
          const s = await open(d, 0.6, 1.2, 3.1, 2.9, { max: 28, align: 'right', valign: 'middle' });
          await k.photo(s, d.image, 4.0, 0, 1.25, 5.15, { mask: { path: 'M0,0 H1 V0.88 A0.5,0.12 0 0 1 0,0.88 Z' } });
          p(s, d.text, 5.6, 0.6, 3.75, 4.5, { valign: 'middle', max: 15 });
        },
        async (d) => { // the picture fills the sheet above the footer, a pale letter laid on it
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          t.rect(s, 2.0, 0.45, 6.0, 4.3, 'F3EFFC', { r: 0.1, name: 'Letter' });
          k.head(s, d.title, 2.35, 0.6, 5.3, 0.95, { max: 22, min: 13, color: TI, bold: false, italic: true, align: 'center', valign: 'bottom' });
          p(s, d.text, 2.35, 1.65, 5.3, 2.95, { align: 'center', max: 14 });
          k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 6.3, 0.52, 1.5, 0.25, { size: 9, color: C.muted, align: 'right', spacing: 1 });
          k.foot(s, { x: 1.0, w: 8, y: 5.3, size: 7.5, color: C.muted, align: 'center' });
        },
      ],
      cards: [
        async (d) => { // columns divided by hairlines, a fine icon heading each
          const s = await page(d), n = d.items.length, gap = 0.36, w = (9 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.5 + i * (w + gap);
            t.img(s, await L.icon(it.icon, C.accent, 1.25), x + w / 2 - 0.2, 1.5, 0.4, 0.4);
            h3(s, it.h, x, 2.0, w, 0.62, { align: 'center' });
            p(s, it.t, x, 2.65, w, 2.5, { align: 'center', max: 14 });
            if (i) t.line(s, x - gap / 2, 1.55, 0, 3.3, C.accent, 0.5, { t: 50 });
          }
        },
        async (d) => { // specimens on a herbarium sheet: two columns, the right one lying lower
          const s = await page(d), n = d.items.length, w = 3.95, hh = n === 4 ? 1.72 : 1.72;
          for (const [i, it] of d.items.entries()) {
            const r = i % 2, x = r ? 5.15 : 0.9, y = 1.45 + Math.floor(i / 2) * hh + (r ? 0.3 : 0);
            t.img(s, await L.icon(it.icon, C.accent, 1.25), x, y + 0.02, 0.3, 0.3);
            h3(s, it.h, x + 0.42, y, w - 0.42, 0.34, { valign: 'middle' });
            p(s, it.t, x + 0.42, y + 0.36, w - 0.42, hh - 0.42, { max: 14 });
          }
        },
        async (d) => { // a fine cross quarters the sheet; of three, the first takes the whole top
          const s = await page(d), n = d.items.length, cx = 5, top = 1.45, mid = 3.28;
          t.line(s, 0.8, mid, 8.4, 0, C.accent, 0.5, { t: 40 });
          t.line(s, cx, n === 3 ? mid : top, 0, n === 3 ? 1.85 : 3.7, C.accent, 0.5, { t: 40 });
          d.items.forEach((it, i) => {
            const whole = n === 3 && i === 0, j = n === 3 ? i + 1 : i, x = whole ? 1.8 : j % 2 ? 5.25 : 0.8, w = whole ? 6.4 : 3.95, y = j < 2 ? top : mid + 0.14;
            h3(s, it.h, x, y, w, 0.34, { align: 'center' });
            p(s, it.t, x, y + 0.36, w, 1.32, { align: 'center', max: 14 });
          });
        },
        async (d) => { // the headings stand in the margin like notes, the text keeps to the column
          const s = await page(d), n = d.items.length, hh = 3.65 / n;
          t.line(s, 3.45, 1.5, 0, 3.55, C.accent, 0.5, { t: 40 });
          d.items.forEach((it, i) => {
            const y = 1.48 + i * hh;
            h3(s, it.h, 0.6, y, 2.6, hh - 0.08, { align: 'right', valign: 'top', max: 14 });
            p(s, it.t, 3.7, y, 5.6, hh - 0.08, { max: 14 });
          });
        },
      ],
      process: [
        async (d) => { // a stem up the page, the steps leafing from it in turn
          const s = await page(d), n = d.steps.length, hh = 3.55 / n, cx = 5, w = 3.95;
          t.line(s, cx, 1.48, 0, 3.55, C.accent, 0.75);
          d.steps.forEach((st, i) => {
            const y = 1.48 + i * hh, left = i % 2 === 0, x = left ? cx - 0.3 - w : cx + 0.3, al = left ? 'right' : 'left';
            t.oval(s, cx - 0.07, y + 0.07, 0.14, 0.14, C.accent);
            h3(s, st.h, x, y, w, 0.34, { align: al, max: 14 });
            p(s, st.t, x, y + 0.34, w, Math.min(n === 4 ? 1.2 : 1.5, 5.12 - y) - 0.34, { align: al, max: 14 });
          });
        },
        async (d) => { // the way goes over a low hill: the columns rise and sink again, large italic numerals opening them
          const s = await page(d), n = d.steps.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n, ys = n === 4 ? [2.05, 1.5, 1.5, 2.05] : [2.0, 1.5, 2.0];
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap), y = ys[i];
            fig(s, String(i + 1), x, y, w, 0.6, { align: 'center', valign: 'top', max: 32 });
            h3(s, st.h, x, y + 0.62, w, 0.56, { align: 'center', color: C.ink });
            p(s, st.t, x, y + 1.2, w, 5.12 - y - 1.2, { align: 'center', max: 14 });
          });
        },
        async (d) => { // the verses step down and across the page
          const s = await page(d), n = d.steps.length, dx = n === 4 ? 1.5 : 2.2, dy = 3.6 / n, w = n === 4 ? 4.1 : 4.2;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * dx, y = 1.45 + i * dy;
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.3, { max: 15 });
            p(s, st.t, x, y + 0.3, w, dy - 0.32, { max: 15, ls: 1.15 });
          });
        },
        async (d) => { // a thread across the page, small rings strung on it
          const s = await page(d), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n, ly = 2.0;
          t.line(s, 0.6, ly, 8.8, 0, C.accent, 0.5);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap), c = x + w / 2;
            t.oval(s, c - 0.21, ly - 0.21, 0.42, 0.42, 'E8E2F8', { line: { color: C.accent, width: 0.75 } });
            k.txt(s, String(i + 1), c - 0.21, ly - 0.21, 0.42, 0.42, { size: 12, italic: true, color: C.accent, align: 'center', valign: 'middle', font: F.head, ls: 1 });
            h3(s, st.h, x, ly + 0.32, w, 0.56, { align: 'center', color: C.ink });
            p(s, st.t, x, ly + 0.9, w, 5.12 - ly - 0.9, { align: 'center', max: 14 });
          });
        },
      ],
      stats: [
        async (d) => { // a triad: the middle number large, its two neighbours quiet at its sides
          const s = await page(d), [a, b, c] = d.stats;
          fig(s, b.value, 3.2, 1.4, 3.6, 1.35, { max: 66, min: 26, align: 'center' });
          p(s, b.label, 3.3, 2.78, 3.4, 0.8, { align: 'center', max: 14.5 });
          [[a, 0.7], [c, 7.0]].forEach(([x, xx]) => {
            k.head(s, x.value, xx, 1.75, 2.3, 0.75, { max: 30, min: 15, color: C.ink, bold: false, italic: true, align: 'center' });
            p(s, x.label, xx, 2.52, 2.3, 1.05, { align: 'center', max: 15 });
          });
          if (d.note) { t.line(s, 4.55, 3.72, 0.9, 0, C.accent, 0.75); p(s, d.note, 1.4, 3.84, 7.2, 1.3, { align: 'center', color: C.muted, max: 15 }); }
        },
        async (d) => { // the numbers climb from the lower left, each under its own fine rule
          const s = await page(d), w = 2.55, gap = 0.35, ys = d.note ? [2.5, 1.95, 1.4] : [2.75, 2.1, 1.45];
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * (w + gap), y = ys[i];
            t.line(s, xx, y, w, 0, C.accent, 0.5);
            fig(s, x.value, xx, y + 0.06, w, 0.82, { max: 40, min: 18, valign: 'middle' });
            p(s, x.label, xx, y + 0.9, w, 0.95, { max: 14 });
          });
          if (d.note) p(s, d.note, 0.7, 4.42, 5.7, 0.74, { color: C.muted, max: 11, min: 10, ls: 1.15 });
        },
        async (d) => { // the title in the left margin with the note under it, numbers set flush right
          const s = await open(d, 0.7, 0.75, 3.1, 1.75, { max: 26, align: 'left', valign: 'top' });
          if (d.note) p(s, d.note, 0.7, 2.75, 3.1, 2.35, { color: C.muted, max: 15, valign: 'bottom' });
          t.line(s, 4.1, 0.75, 0, 4.35, C.accent, 0.5, { t: 40 });
          d.stats.forEach((x, i) => {
            const y = 0.7 + i * 1.5;
            fig(s, x.value, 4.4, y, 4.9, 0.78, { max: 40, min: 18, align: 'right' });
            p(s, x.label, 4.4, y + 0.8, 4.9, 0.62, { align: 'right', max: 14 });
          });
        },
      ],
      compare: [
        async (d) => { // a letter and its reply, mirrored about a hairline
          const s = await page(d), w = 4.0;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.16, 2.75);
          h3(s, d.left.h, 0.7, 1.48, w, 0.5, { max: 19, min: 12, align: 'right', valign: 'middle', color: C.ink });
          h3(s, d.right.h, 5.3, 1.48, w, 0.5, { max: 19, min: 12, valign: 'middle' });
          t.line(s, 5, 1.5, 0, 3.6, C.accent, 0.75);
          let y = 2.2;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.3, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // one above the other: each side a centred heading over its items laid across
          const s = await page(d), H = 1.8;
          [d.left, d.right].forEach((sd, i) => {
            const y = 1.42 + i * H, n = sd.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
            if (i) t.line(s, 4.2, y - 0.03, 1.6, 0, C.accent, 0.5);
            h3(s, sd.h, 1.5, y + 0.04, 7, 0.36, { align: 'center', valign: 'middle', max: 17, color: i ? C.accent : C.ink });
            sd.items.forEach((it, j) => p(s, it, 0.6 + j * (w + gap), y + 0.46, w, H - 0.5, { align: 'center', max: 14 }));
          });
        },
      ],
      statement: [
        async (d) => { // a long italic line down the left, the note low in the right margin
          const s = await open({}, 0, 0, 0, 0, {}, 'focus');
          k.head(s, d.title, 0.8, 0.45, 5.9, 0.7, { max: 16, min: 11, color: C.accent, bold: false, italic: true, valign: 'top' });
          k.head(s, L.runs(d.text), 0.8, 1.2, 5.9, 3.9, { max: 32, min: 15, color: C.ink, bold: false, italic: true, valign: 'middle' });
          t.line(s, 7.0, 1.3, 0, 3.8, C.accent, 0.5, { t: 40 });
          if (d.caption) p(s, d.caption, 7.25, 1.3, 2.2, 3.8, { max: 15, color: C.muted, valign: 'bottom', ls: 1.15 });
        },
        async (d) => { // the note first, then after a short rule the sentence low and wide
          const s = await open(d, 2.2, 0.35, 5.6, 0.5, { max: 16, min: 11, color: C.accent }, 'focus');
          if (d.caption) p(s, d.caption, 1.8, 0.92, 6.4, 1.25, { align: 'center', color: C.muted, max: 15 });
          t.line(s, 4.55, 2.3, 0.9, 0, C.accent, 0.75);
          k.head(s, L.runs(d.text), 0.8, 2.42, 8.4, 2.72, { max: 34, min: 16, color: C.ink, bold: false, align: 'center' });
        },
      ],
      timeline: [
        async (d) => { // four diary entries, each year written large over its day
          const s = await page(d), w = 4.05, hh = 1.82;
          d.items.forEach((it, i) => {
            const x = 0.75 + (i % 2) * (w + 0.4), y = 1.42 + Math.floor(i / 2) * hh;
            fig(s, it.year, x, y, 1.55, 0.6, { max: 24, min: 12, align: 'left', valign: 'top' });
            h3(s, it.h, x + 1.6, y + 0.03, w - 1.6, 0.5, { color: C.ink, max: 14 });
            t.line(s, x, y + 0.56, w, 0, C.accent, 0.5, { t: 40 });
            p(s, it.t, x, y + 0.63, w, hh - 0.68, { max: 14 });
          });
        },
        async (d) => { // the years stand in the margin against a fine vertical, events to the right
          const s = await page(d), hh = 0.91;
          t.line(s, 2.55, 1.5, 0, 3.6, C.accent, 0.75);
          d.items.forEach((it, i) => {
            const y = 1.45 + i * hh;
            fig(s, it.year, 0.5, y, 1.85, 0.5, { max: 20, min: 11, align: 'right', valign: 'top' });
            k.txt(s, [{ text: `${it.h}  `, options: { italic: true, color: C.accent } }, { text: it.t, options: { color: C.ink } }], 2.8, y, 6.5, hh - 0.05, { max: 14, min: 10, ls: 1.15, font: F.body });
          });
        },
        async (d) => { // the events stand on a line, their years under it
          const s = await page(d), gap = 0.28, w = (8.8 - gap * 3) / 4, ly = 4.42;
          t.line(s, 0.6, ly, 8.8, 0, C.accent, 0.75);
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap);
            h3(s, it.h, x, 1.42, w, 0.56, { color: C.ink, max: 14, valign: 'bottom' });
            p(s, it.t, x, 2.02, w, ly - 2.1, { max: 15, valign: 'top', ls: 1.15 });
            fig(s, it.year, x, ly + 0.08, w, 0.62, { max: 26, min: 12, valign: 'top' });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process, stats and timeline are all the rows of the cards
    R.stats = V.stats.shift();
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "nafis va mayin: o'ylangan, ravon jumlalar" });
