/** 174 Muzlik — minimalist, background-driven (right composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 174, slug: 'muzlik', name: "Muzlik", mode: 'right', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '16303D', muted: '4F6E7C', accent: '0F8BA8' }, photo: { r: 0.12 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'D5F0F6'],[0.6,'EDF9FB'],[1,'FFFFFF']]), blobs([[200,900,380,'FFFFFF',0.9]],140)),
  // a glacier read like an instrument: flush-right facts, icicles hanging from the top edge, hexagonal crystals, strata lines running off the page
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const foot = (s, x = 3.1, w = 6.3) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted });
    const open = async (d, x = 3.1, y = 0.45, w = 6.3, h = 0.9, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: TI, align: 'right', valign: 'bottom', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14.5, min: 10.5, color: C.accent, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, color: C.accent, ...o });
    const ln = (s, x, y, w, h = 0, wt = 0.75, o = {}) => t.line(s, x, y, w, h, C.accent, wt, o);
    const hex = (s, x, y, w, h, wt = 1) => s.addShape(t.S.HEXAGON, { x, y, w, h, fill: { type: 'none' }, line: { color: C.accent, width: wt }, objectName: 'Crystal' });
    const V = {
      image: [
        async (d) => { // a large crystal: the picture cut as a hexagon, the reading to its right
          const s = await open(d, 5.2, 0.45, 4.2, 1.05);
          await k.photo(s, d.image, 0.35, 0.7, 4.6, 3.98, { mask: 'hex' });
          p(s, d.text, 5.2, 1.6, 4.2, 3.52);
        },
        async (d) => { // icicles: the picture hangs from the top edge with a jagged lower side
          const s = await open(d, 0.7, 2.62, 8.7, 0.62, { max: 22 });
          await k.photo(s, d.image, 0, 0, 8.0, 2.5, { mask: { poly: [[0, 0], [1, 0], [0.96, 0.62], [0.9, 0.34], [0.82, 0.94], [0.73, 0.5], [0.63, 1], [0.54, 0.46], [0.44, 0.84], [0.33, 0.4], [0.24, 0.96], [0.14, 0.5], [0.07, 0.74], [0, 0.36]] } });
          p(s, d.text, 0.7, 3.3, 8.7, 1.85, { align: 'right', max: 13 });
        },
        async (d) => { // a shard at the right edge, cut on a slant
          const s = await open(d, 0.7, 0.5, 5.5, 1.05, { align: 'left' });
          await k.photo(s, d.image, 5.9, 0.55, 4.1, 4.65, { mask: { poly: [[0.28, 0], [1, 0], [1, 1], [0, 1]] } });
          p(s, d.text, 0.7, 1.65, 5.2, 3.5, { max: 14 });
        },
        async (d) => { // the picture whole, a sheet of clear ice laid on it to the right
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          t.rect(s, 4.7, 0, 5.3, 5.2, 'EDF9FB', { t: 6, name: 'Ice' });
          num(s);
          k.head(s, d.title, 5.0, 0.5, 4.5, 1.0, { max: 24, min: 13, color: TI, align: 'right', valign: 'bottom' });
          ln(s, 5.0, 1.58, 4.5);
          p(s, d.text, 5.0, 1.7, 4.5, 3.4, { max: 14 });
          foot(s);
        },
      ],
      cards: [
        async (d) => { // icicles of different lengths hang from the top edge, an item at the tip of each; the title below
          const s = await open(d, 0.7, 4.22, 8.7, 0.9, { max: 24, valign: 'middle' }), n = d.items.length, gap = 0.32, w = (8.7 - gap * (n - 1)) / n, tips = n === 4 ? [0.3, 0.72, 0.42, 0.9] : [0.35, 0.95, 0.55];
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = tips[i];
            ln(s, x + 0.17, 0, 0, y, 1);
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x, y + 0.03, 0.34, 0.34);
            h3(s, it.h, x, y + 0.42, w, 0.5, { max: 14 });
            p(s, it.t, x, y + 0.93, w, 4.15 - y - 0.93, { max: 13 });
          }
        },
        async (d) => { // four cold facts in the right field, flush right, the icons at the outer edge
          const s = await open(d), n = d.items.length, w = 3.0, H = 1.82;
          for (const [i, it] of d.items.entries()) {
            const whole = n === 3 && i === 0, j = n === 3 ? i + 1 : i, x = whole ? 3.1 : (j % 2 ? 6.4 : 3.1), y = 1.48 + Math.floor(j / 2) * H, ww = whole ? 6.3 : w;
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x + ww - 0.32, y, 0.32, 0.32);
            h3(s, it.h, x, y, ww - 0.42, 0.34, { align: 'right', valign: 'middle', max: 13 });
            p(s, it.t, x, y + 0.38, ww, H - 0.44, { align: 'right', max: 13 });
          }
        },
        async (d) => { // a crystal holds the title, rays run from it to each item
          const s = await open({}), n = d.items.length, H = 4.62 / n, cx = 3.5, cy = 2.75;
          hex(s, 0.35, 1.45, 3.15, 2.6, 1.25);
          k.head(s, d.title, 0.95, 1.85, 1.95, 1.8, { max: 17, min: 11, color: TI, align: 'center' });
          for (const [i, it] of d.items.entries()) {
            const y = 0.5 + i * H, ty = y + 0.18, up = ty < cy;
            ln(s, cx, Math.min(cy, ty), 0.6, Math.abs(ty - cy), 0.5, up ? { flipV: true } : {});
            t.img(s, await L.icon(it.icon, C.accent, 1.75), 4.15, y + 0.02, 0.32, 0.32);
            h3(s, it.h, 4.58, y, 4.82, 0.36, { valign: 'middle' });
            p(s, it.t, 4.58, y + 0.38, 4.82, H - 0.44, { max: 13 });
          }
        },
        async (d) => { // strata: each layer reaches further left, lines run off the page's right edge
          const s = await open(d), n = d.items.length, H = 3.62 / n, dx = n === 4 ? 0.8 : 1.2;
          d.items.forEach((it, i) => {
            const y = 1.48 + i * H, x = 3.3 - i * dx;
            ln(s, x, y, 10 - x, 0, 0.5);
            h3(s, it.h, x, y + 0.05, 9.4 - x, 0.3, { align: 'right', valign: 'middle', max: 14 });
            p(s, it.t, x, y + 0.36, 9.4 - x, H - 0.4, { align: 'right', max: 13, ls: 1.14 });
          });
        },
      ],
      process: [
        async (d) => { // the glacier moves: the steps slide from the upper right to the lower left
          const s = await open(d, 0.7, 0.45, 3.7, 1.1, { align: 'left', valign: 'top', max: 22 }), n = d.steps.length, H = 4.62 / n, dx = n === 4 ? 1.35 : 2.0, w = 4.7;
          d.steps.forEach((st, i) => {
            const x = 9.4 - w - i * dx, y = 0.5 + i * H;
            fig(s, String(i + 1), x + w - 0.5, y, 0.5, 0.36, { max: 20, align: 'right' });
            h3(s, st.h, x, y, w - 0.6, 0.36, { align: 'right', valign: 'middle', color: C.ink });
            p(s, st.t, x, y + 0.38, w, H - 0.44, { align: 'right', max: 12.5, ls: 1.14 });
          });
        },
        async (d) => { // a graduated scale beside the title, one tick for each step
          const s = await open(d, 0.5, 0.5, 2.65, 3.0, { max: 24, valign: 'top' }), n = d.steps.length, H = 4.6 / n;
          ln(s, 3.5, 0.5, 0, 4.62, 1.25);
          for (let m = 0; m <= n * 4; m++) { const y = 0.5 + m * (4.6 / (n * 4)); ln(s, 3.5, y, m % 4 === 0 ? 0.26 : 0.1, 0, 0.5); }
          d.steps.forEach((st, i) => {
            const y = 0.5 + i * H;
            fig(s, String(i + 1), 3.85, y + 0.02, 0.4, 0.36, { max: 18, align: 'left' });
            h3(s, st.h, 4.3, y + 0.02, 5.1, 0.36, { valign: 'middle', color: C.ink });
            p(s, st.t, 4.3, y + 0.4, 5.1, H - 0.46, { max: 13 });
          });
        },
        async (d) => { // stalagmites: columns rise from the ground line, each to its own height, the words sitting at the foot
          const s = await open(d), n = d.steps.length, gap = 0.3, w = (8.7 - gap * (n - 1)) / n, tops = n === 4 ? [2.4, 1.7, 2.1, 1.5] : [2.3, 1.55, 1.95];
          ln(s, 0, 5.12, 10, 0, 1);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = tops[i];
            ln(s, x, y, 0, 5.12 - y, 1);
            fig(s, String(i + 1), x + 0.12, y - 0.04, w - 0.12, 0.42, { max: 22, align: 'left', valign: 'top' });
            h3(s, st.h, x + 0.12, y + 0.42, w - 0.12, 0.5, { color: C.ink, max: 13.5 });
            p(s, st.t, x + 0.12, y + 0.94, w - 0.12, 5.07 - y - 0.94, { max: 13 });
          });
        },
        async (d) => { // a chain of crystals across the page, the words under each
          const s = await open(d), n = d.steps.length, gap = 0.3, w = (8.7 - gap * (n - 1)) / n, ly = 2.0, hw = 0.72, hh = 0.62;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            hex(s, x, ly - hh / 2, hw, hh);
            k.txt(s, String(i + 1), x, ly - hh / 2, hw, hh, { size: 15, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
            if (i < n - 1) ln(s, x + hw, ly, w + gap - hw, 0, 0.75);
            h3(s, st.h, x, ly + 0.42, w, 0.5, { color: C.ink, max: 14 });
            p(s, st.t, x, ly + 0.94, w, 5.12 - ly - 0.94, { max: 13 });
          });
        },
      ],
      stats: [
        async (d) => { // an instrument: each figure flush right on a line running off the page, the note in the empty margin
          const s = await open(d), H = 1.2;
          d.stats.forEach((x, i) => {
            const y = 1.45 + i * H;
            ln(s, 3.1, y, 6.9, 0, 0.5);
            fig(s, x.value, 3.1, y + 0.04, 6.3, 0.68, { max: 38, min: 18, align: 'right' });
            p(s, x.label, 3.1, y + 0.72, 6.3, 0.46, { align: 'right', max: 13 });
          });
          if (d.note) p(s, d.note, 0.6, 1.5, 2.2, 3.62, { max: 11, color: C.muted, valign: 'bottom', ls: 1.12 });
        },
        async (d) => { // three figures high on the page, the title and note low
          const s = await open(d, 3.1, 3.3, 6.3, 0.75, { max: 22, valign: 'top' }), w = 2.7, gap = 0.3;
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * (w + gap);
            ln(s, xx, 0.55, w, 0, 1);
            fig(s, x.value, xx, 0.65, w, 1.3, { max: 54, min: 20, align: 'left', valign: 'top' });
            p(s, x.label, xx, 1.98, w, 1.2, { max: 14 });
          });
          if (d.note) p(s, d.note, 0.7, 4.08, 8.7, 1.06, { max: 12, color: C.muted, align: 'right' });
        },
        async (d) => { // three crystals, one figure locked in each
          const s = await open(d), w = 2.45, h = 1.6, gap = 0.5, x0 = 1.0;
          d.stats.forEach((x, i) => {
            const xx = x0 + i * (w + gap);
            hex(s, xx, 1.48, w, h);
            k.head(s, x.value, xx + 0.4, 1.48, w - 0.8, h, { max: 26, min: 12, color: C.accent, align: 'center' });
            p(s, x.label, xx - 0.1, 3.14, w + 0.2, 0.72, { align: 'center', max: 12.5 });
          });
          if (d.note) p(s, d.note, 1.0, 3.92, 8.35, 1.22, { align: 'center', max: 12, color: C.muted });
        },
      ],
      compare: [
        async (d) => { // the waterline: one side above it, the other below, in strict flush right
          const s = await open(d, 3.1, 0.3, 6.3, 0.72, { max: 22 }), ly = 3.1;
          ln(s, 0, ly, 10, 0, 1.25);
          [[d.left, 1.1, 0.0, C.ink], [d.right, ly + 0.08, 0.0, C.accent]].forEach(([sd, y, , c]) => {
            k.head(s, sd.h, 0.7, y, 8.7, 0.36, { max: 16, min: 11, color: c, align: 'right', valign: 'middle' });
            const hh = 1.58 / sd.items.length;
            sd.items.forEach((it, j) => p(s, it, 0.7, y + 0.38 + j * hh, 8.7, hh, { align: 'right', max: 13.5, valign: 'middle' }));
          });
        },
        async (d) => { // two faces of one crystal, mirrored about a line
          const s = await open(d), w = 4.1;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.14, 2.82);
          t.line(s, 5, 1.48, 0, 3.64, C.accent, 1);
          h3(s, d.left.h, 0.6, 1.48, w, 0.6, { max: 18, align: 'right', valign: 'middle', color: C.ink });
          h3(s, d.right.h, 5.3, 1.48, w, 0.6, { max: 18, valign: 'middle' });
          let y = 2.2;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.6, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.3, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
      ],
      statement: [
        async (d) => { // the note upper left, the title upper right, the sentence large across the foot, flush right
          const s = await open(d, 5.0, 0.45, 4.4, 0.75, { max: 15, min: 11, color: C.accent, valign: 'top' }, 'focus');
          if (d.caption) p(s, d.caption, 0.7, 0.45, 4.0, 1.6, { max: 12, color: C.muted });
          k.head(s, L.runs(d.text), 0.7, 2.1, 8.7, 3.02, { max: 36, min: 17, color: C.ink, align: 'right', valign: 'bottom' });
        },
        async (d) => { // the sentence inside a great crystal, title and note out in the margin
          const s = await open(d, 0.6, 0.5, 2.5, 1.2, { max: 15, min: 11, color: C.accent, align: 'left', valign: 'top' }, 'focus');
          if (d.caption) p(s, d.caption, 0.6, 1.75, 2.5, 3.37, { max: 12, color: C.muted, valign: 'bottom', ls: 1.14 });
          hex(s, 3.3, 0.5, 6.3, 4.65, 1.25);
          k.head(s, L.runs(d.text), 4.45, 1.2, 4.0, 3.25, { max: 24, min: 14, color: C.ink, align: 'center' });
        },
      ],
      timeline: [
        async (d) => { // core sample: dated layers, each line running off both edges
          const s = await open(d), H = 0.92;
          d.items.forEach((it, i) => {
            const y = 1.46 + i * H;
            ln(s, 0, y, 10, 0, 0.5);
            fig(s, it.year, 0.5, y + 0.05, 2.4, H - 0.1, { max: 24, min: 12, align: 'right', valign: 'middle' });
            h3(s, it.h, 3.1, y + 0.05, 6.3, 0.27, { valign: 'middle', color: C.ink, max: 13 });
            p(s, it.t, 3.1, y + 0.33, 6.3, H - 0.36, { max: 12, ls: 1.12 });
          });
        },
        async (d) => { // years stand over four columns across the full width, a firm line above them
          const s = await open(d), gap = 0.28, w = (8.7 - gap * 3) / 4;
          ln(s, 0.7, 1.55, 8.7, 0, 1.25);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            fig(s, it.year, x, 1.62, w, 0.62, { max: 24, min: 12, align: 'left' });
            h3(s, it.h, x, 2.26, w, 0.5, { color: C.ink, max: 13.5 });
            p(s, it.t, x, 2.78, w, 2.34, { max: 13 });
          });
        },
        async (d) => { // events cross a line by turns, high and low, the dates on the line
          const s = await open(d, 3.1, 0.3, 6.3, 0.72, { max: 22 }), ly = 3.08, w = 4.15;
          ln(s, 0, ly, 10, 0, 1.25);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = up ? 0.7 + (i / 2) * 4.55 : 0.7 + ((i - 1) / 2) * 4.55, y = up ? 1.08 : ly + 0.1;
            hex(s, x, ly - 0.09, 0.2, 0.18, 1);
            k.txt(s, [{ text: `${it.year}   `, options: { bold: true, color: C.accent } }, { text: it.h, options: { bold: true, color: C.ink } }], x, y, w, 0.34, { max: 14.5, min: 10.5, font: F.head, valign: 'middle' });
            p(s, it.t, x, y + 0.36, w, up ? ly - y - 0.46 : 5.12 - y - 0.36, { max: 13 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process, stats and timeline fall back to the rows of the cards here
    R.stats = V.stats.shift();
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "sovuqqon va aniq: faktlar va tiniq xulosalar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["p14:shred|pattern=\"strip\" dir=\"in\"", "dissolve", "fade"], "cover": ["focusIn", "fadeLetters"], "mark": "focusIn", "deco": "wipe:d", "sig": {"title": "focusIn", "body": "wipe:d", "item": "wipe:d", "image": "focusIn", "number": "focusIn", "order": "seq", "stagger": 0.2}, "tempo": 1.25, "kenburns": true};
