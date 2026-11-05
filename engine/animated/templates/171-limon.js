/** 171 Limon — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 171, slug: 'limon', name: "Limon", mode: 'bottom', list: 'rows', num: 'corner', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '2B2A1E', muted: '6A6650', accent: 'A87B00' }, photo: { r: 0.08 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('FFF8D6'), rad(800,kind==='cover'?300:0,900,[[0,'FFFFFF',0.9],[1,'FFF8D6',0]])),
  // lemon: round slices of picture, heavy numerals, a low heavy title, things that jump and climb
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const foot = (s, x = 0.7, w = 8.6) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted });
    const open = async (d, x = 0.7, y = 4.05, w = 8.6, h = 0.95, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 14, color: TI, valign: 'top', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14.5, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 64, min: 16, color: C.accent, valign: 'top', ...o });
    const ring = (s, x, y, d, o = {}) => t.oval(s, x, y, d, d, null, { line: { color: C.accent, width: 1.25 }, ...o });
    const V = {
      image: [
        async (d) => { // a quarter of a huge slice rising from the lower right corner
          const s = await open(d, 0.7, 3.85, 4.2, 1.3, { max: 24 });
          await k.photo(s, d.image, 5.1, 0.72, 4.9, 4.9, { mask: { path: 'M1,1 L0,1 A1,1 0 0 1 1,0 Z' } });
          p(s, d.text, 0.7, 0.45, 4.6, 3.3, { valign: 'bottom' });
        },
        async (d) => { // three slices of one picture rolling along the top, each larger than the last
          const s = await open(d);
          await k.photo(s, d.image, 0.7, 0.35, 8.2, 2.05, { mask: { path: 'M0.04,0.5 a0.0625,0.25 0 1 1 0.125,0 a0.0625,0.25 0 1 1 -0.125,0 Z M0.32,0.5 a0.0875,0.35 0 1 1 0.175,0 a0.0875,0.35 0 1 1 -0.175,0 Z M0.73,0.5 a0.125,0.5 0 1 1 0.25,0 a0.125,0.5 0 1 1 -0.25,0 Z' } });
          p(s, d.text, 0.7, 2.5, 8.6, 1.5, { max: 14 });
        },
        async (d) => { // the picture cut on a slant from the left, the text and the title on the right
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 5.6, 5.2, { mask: { poly: [[0, 0], [1, 0], [0.74, 1], [0, 1]] } });
          k.head(s, d.title, 5.3, 3.95, 4.0, 1.2, { max: 22, min: 13, color: TI, valign: 'top' });
          p(s, d.text, 5.55, 0.5, 3.8, 3.35, { valign: 'bottom' });
          num(s); foot(s, 5.3, 4.0);
        },
        async (d) => { // the picture over the whole page, a lemon-pale sheet low on it
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          t.rect(s, 0.45, 1.45, 7.3, 3.75, 'FFF8D6', { name: 'Sheet' });
          k.txt(s, String(k.idx).padStart(2, '0'), 6.95, 1.53, 0.6, 0.25, { size: 9, color: C.muted, align: 'right' });
          p(s, d.text, 0.7, 1.75, 6.8, 2.3, { max: 14 });
          k.head(s, d.title, 0.7, 4.12, 6.8, 0.98, { max: 24, min: 14, color: TI, valign: 'top' });
          foot(s);
        },
      ],
      cards: [
        async (d) => { // heavy numerals standing in columns
          const s = await open(d), n = d.items.length, gap = 0.32, w = (8.6 - gap * (n - 1)) / n;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            big(s, String(i + 1), x, 0.3, w, 1.05, { max: 66 });
            h3(s, it.h, x, 1.38, w, 0.55);
            p(s, it.t, x, 1.95, w, 2.02, { max: 14 });
          });
        },
        async (d) => { // a staircase climbing to the right, an icon on every tread
          const s = await open(d, 0.7, 4.1, 8.6, 0.9), n = d.items.length, gap = 0.28, w = (8.6 - gap * (n - 1)) / n, top = n === 4 ? 0.4 : 0.42, dy = n === 4 ? 0.48 : 0.6;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = top + (n - 1 - i) * dy;
            t.img(s, await L.icon(it.icon, C.accent, 2), x, y, 0.4, 0.4);
            h3(s, it.h, x, y + 0.45, w, 0.52, { max: 14 });
            p(s, it.t, x, y + 0.98, w, 4.02 - y - 0.98, { max: 13.5 });
          }
        },
        async (d) => { // the title swells at the lower left, the items run down the right
          const s = await open(d, 0.7, 1.9, 3.1, 3.2, { max: 34, valign: 'bottom' }), n = d.items.length, hh = 4.6 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 0.5 + i * hh;
            t.img(s, await L.icon(it.icon, C.accent, 2), 4.2, y + 0.02, 0.36, 0.36);
            h3(s, it.h, 4.72, y, 4.6, 0.36, { valign: 'middle' });
            p(s, it.t, 4.72, y + 0.38, 4.6, hh - 0.45, { max: 14 });
          }
        },
        async (d) => { // a slice with the title in it, the items around the rind
          const n = d.items.length, cy = n === 4 ? 2.62 : 1.98, r = 1.22, s = await open({});
          ring(s, 5 - r, cy - r, 2 * r); ring(s, 5 - r + 0.09, cy - r + 0.09, 2 * r - 0.18, { line: { color: C.accent, width: 0.5 } });
          k.head(s, d.title, 5 - r + 0.28, cy - 0.8, 2 * r - 0.56, 1.6, { max: 18, min: 11, color: TI, align: 'center' });
          const at = n === 4 ? [[0.7, 0.42, 'left'], [6.5, 0.42, 'left'], [0.7, 2.88, 'left'], [6.5, 2.88, 'left']] : [[0.7, 0.55, 'left'], [6.5, 0.55, 'left'], [1.7, 3.42, 'center']];
          at.forEach(([x, y, a], i) => {
            const whole = n === 3 && i === 2, w = whole ? 6.6 : 2.8, it = d.items[i];
            h3(s, it.h, x, y, w, 0.52, { align: a, max: 14 });
            p(s, it.t, x, y + (whole ? 0.36 : 0.54), w, whole ? 1.3 : 1.72, { align: a, max: 13.5 });
          });
        },
      ],
      process: [
        async (d) => { // the words hang above, big digits and arrows stride along under them, just over the title
          const s = await open(d), n = d.steps.length, gap = 0.35, w = (8.6 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            h3(s, st.h, x, 0.42, w, 0.55);
            p(s, st.t, x, 0.98, w, 2.1, { max: 14 });
            big(s, String(i + 1), x, 3.1, 0.9, 0.88, { max: 50, valign: 'middle' });
            if (i < n - 1) k.head(s, '\u2192', x + 0.9, 3.15, w - 0.9 + gap - 0.1, 0.78, { max: 28, color: C.accent, bold: true, align: 'right' });
          });
        },
        async (d) => { // up, down, up: a zigzag of rings tied by thin lines
          const s = await open(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, hi = 0.42, lo = 1.12, D = 0.5;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = i % 2 ? lo : hi, a = y === hi;
            if (i < n - 1) { const cx = x + D / 2, cx2 = x + w + gap + D / 2; t.line(s, x + D, Math.min(hi, lo) + D / 2, cx2 - cx - D, lo - hi, C.accent, 0.75, a ? {} : { flipV: true }); }
            ring(s, x, y, D);
            k.txt(s, String(i + 1), x, y, D, D, { size: 15, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
            h3(s, st.h, x, y + 0.56, w, 0.5, { max: 14 });
            p(s, st.t, x, y + 1.06, w, 4.0 - y - 1.06, { max: 13 });
          });
        },
        async (d) => { // the path turns back on itself: along the top, then back along the bottom
          const s = await open(d, 0.7, 4.2, 8.6, 0.85, { max: 24 }), n = d.steps.length, w = 3.95, H = 1.82;
          d.steps.forEach((st, i) => {
            const row = i < 2 ? 0 : 1, col = row ? (n === 3 ? 0 : 3 - i) : i, whole = n === 3 && i === 2, x = 0.7 + col * (w + 0.7), y = 0.42 + row * H, ww = whole ? 8.6 : w;
            big(s, String(i + 1), x, y, 0.6, 0.62, { max: 34 });
            h3(s, st.h, x + 0.62, y + 0.04, ww - 0.62, 0.5, { valign: 'middle' });
            p(s, st.t, x + 0.62, y + 0.56, ww - 0.62, H - 0.62, { max: 13.5 });
          });
          t.line(s, 5.02, 0.75, 0.26, 0, C.accent, 1); k.txt(s, '→', 5.0, 0.55, 0.32, 0.4, { size: 14, bold: true, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
          if (n === 4) k.txt(s, '←', 5.0, 2.37, 0.32, 0.4, { size: 14, bold: true, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
        },
        async (d) => { // the steps drop away to the lower right
          const s = await open(d, 0.7, 4.1, 3.3, 1.05, { max: 20, min: 12 }), n = d.steps.length, dx = n === 4 ? 1.25 : 1.9, dy = (n === 4 ? 4.68 : 4.62) / n, w = n === 4 ? 4.85 : 4.95;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * dx, y = 0.42 + i * dy;
            big(s, String(i + 1), x, y - 0.04, 0.45, 0.5, { max: 28 });
            h3(s, st.h, x + 0.48, y, w - 0.48, 0.3, { max: 14, valign: 'middle' });
            p(s, st.t, x + 0.48, y + 0.31, w - 0.48, dy - 0.34, { max: 12.5, ls: 1.12 });
          });
        },
      ],
      stats: [
        async (d) => { // one number takes the page by force, the two others wait at the side
          const s = await open(d), [a, ...rest] = d.stats;
          big(s, a.value, 0.7, 0.3, 5.5, 1.75, { max: 92, min: 30, valign: 'middle' });
          p(s, a.label, 0.7, 2.08, 5.3, 0.62, { max: 15 });
          if (d.note) p(s, d.note, 0.7, 2.82, 5.3, 1.16, { max: 12, color: C.muted });
          rest.forEach((x, i) => {
            const y = 0.5 + i * 1.75;
            k.head(s, x.value, 6.6, y, 2.7, 0.8, { max: 38, min: 15, color: C.ink, valign: 'bottom' });
            p(s, x.label, 6.6, y + 0.83, 2.7, 0.75, { max: 13 });
          });
        },
        async (d) => { // three equal slices with the numbers in them
          const s = await open(d), D = 1.9, gap = 0.85, x0 = (10 - 3 * D - 2 * gap) / 2;
          d.stats.forEach((x, i) => {
            const xx = x0 + i * (D + gap);
            ring(s, xx, 0.32, D); ring(s, xx + 0.07, 0.39, D - 0.14, { line: { color: C.accent, width: 0.5 } });
            k.head(s, x.value, xx + 0.15, 0.32, D - 0.3, D, { max: 30, min: 14, color: C.accent, align: 'center' });
            p(s, x.label, xx - 0.35, 2.28, D + 0.7, 0.72, { align: 'center', max: 13 });
          });
          if (d.note) p(s, d.note, 0.9, 3.05, 8.2, 0.92, { align: 'center', max: 12, color: C.muted });
        },
      ],
      compare: [
        async (d) => { // mirrored about one upright line, the headings large
          const s = await open(d), w = 3.95;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.14, 2.42);
          k.head(s, d.left.h, 0.7, 0.35, w, 0.98, { max: 28, min: 14, color: C.ink, align: 'right' });
          k.head(s, d.right.h, 5.35, 0.35, w, 0.98, { max: 28, min: 14, color: C.accent });
          t.line(s, 5, 0.42, 0, 3.5, C.accent, 1.25);
          let y = 1.48;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // one high to the left, the other low to the right, with the title up in the free corner
          const s = await open({}), w = 5.0;
          k.head(s, d.title, 6.0, 0.5, 3.3, 1.5, { max: 22, min: 13, color: TI, align: 'right', valign: 'top' });
          k.head(s, d.left.h, 0.7, 0.35, w, 0.42, { max: 19, min: 12, color: C.ink, valign: 'top' });
          d.left.items.forEach((it, j, a) => p(s, it, 0.7, 0.8 + j * (1.72 / a.length), w, 1.72 / a.length, { max: 13 }));
          t.line(s, 0.7, 2.56, 8.6, 0, C.accent, 1);
          k.head(s, d.right.h, 4.3, 2.66, w, 0.42, { max: 19, min: 12, color: C.accent, valign: 'top' });
          d.right.items.forEach((it, j, a) => p(s, it, 4.3, 3.1 + j * (2.02 / a.length), w, 2.02 / a.length, { max: 13 }));
        },
      ],
      statement: [
        async (d) => { // everything flush right: title over a rule, the sentence large, the note under it
          const s = await open({}, 0, 0, 0, 0, {}, 'focus');
          k.head(s, d.title, 2.7, 0.42, 6.6, 0.52, { max: 16, min: 11, color: C.accent, align: 'right', valign: 'bottom' });
          t.line(s, 0.7, 1.0, 8.6, 0, C.accent, 1.25);
          k.head(s, L.runs(d.text), 0.7, 1.1, 8.6, 2.55, { max: 38, min: 17, color: C.ink, align: 'right' });
          if (d.caption) p(s, d.caption, 2.7, 3.75, 6.6, 1.4, { max: 13, align: 'right' });
        },
        async (d) => { // the title in a big slice, the sentence beside it
          const s = await open({}, 0, 0, 0, 0, {}, 'focus'), D = 3.3;
          ring(s, 0.7, 0.9, D); ring(s, 0.8, 1.0, D - 0.2, { line: { color: C.accent, width: 0.5 } });
          k.head(s, d.title, 1.15, 1.6, D - 0.9, 1.9, { max: 22, min: 12, color: C.accent, align: 'center' });
          k.head(s, L.runs(d.text), 4.4, 0.42, 4.9, 3.0, { max: 30, min: 15, color: C.ink, valign: 'middle' });
          if (d.caption) p(s, d.caption, 4.4, 3.52, 4.9, 1.62, { max: 13, color: C.muted });
        },
      ],
      timeline: [
        async (d) => { // a line with a dot for each year, the years big over the columns
          const s = await open(d), gap = 0.3, w = (8.6 - gap * 3) / 4, ly = 1.02;
          t.line(s, 0.7, ly, 8.6, 0, C.accent, 1.25);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            t.oval(s, x, ly - 0.08, 0.16, 0.16, C.accent);
            big(s, it.year, x, 0.34, w, 0.6, { max: 30, min: 12, valign: 'bottom' });
            h3(s, it.h, x, ly + 0.16, w, 0.52, { max: 14 });
            p(s, it.t, x, ly + 0.7, w, 3.98 - ly - 0.7, { max: 13 });
          });
        },
        async (d) => { // each year inside its own round slice, two by two
          const s = await open(d), w = 4.15, H = 1.78, D = 1.2;
          d.items.forEach((it, i) => {
            const x = 0.7 + (i % 2) * (w + 0.3), y = 0.4 + Math.floor(i / 2) * H;
            ring(s, x, y + 0.05, D);
            k.head(s, it.year, x + 0.1, y + 0.05, D - 0.2, D, { max: 18, min: 10, color: C.accent, align: 'center' });
            h3(s, it.h, x + D + 0.15, y, w - D - 0.15, 0.34, { max: 14, valign: 'middle' });
            p(s, it.t, x + D + 0.15, y + 0.36, w - D - 0.15, H - 0.42, { max: 12.5 });
          });
        },
        async (d) => { // the line runs through the middle, events hop over and under it
          const s = await open(d, 0.7, 4.15, 8.6, 0.9, { max: 24 }), ly = 2.18, w = 3.95;
          t.line(s, 0.7, ly, 8.6, 0, C.accent, 1.25);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = up ? 0.7 + (i / 2) * 4.65 : 0.7 + ((i - 1) / 2) * 4.65 + 0.0, y = up ? 0.34 : ly + 0.1;
            t.oval(s, x, ly - 0.07, 0.14, 0.14, C.accent);
            k.txt(s, [{ text: `${it.year}   `, options: { bold: true, color: C.accent } }, { text: it.h, options: { bold: true, color: C.ink } }], x + (up ? 0 : 0), y, w, 0.34, { max: 15, min: 10.5, font: F.head, valign: 'middle' });
            p(s, it.t, x, y + 0.36, w, up ? 1.42 : 1.42, { max: 13 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process and timeline are the rows of the cards
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "tetik va yorqin: qisqa, g'ayratli, ijobiy" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "playful"], "transitions": ["zoom", "fade", "push:u"], "cover": ["popOver", "springIn"], "mark": "popOver", "deco": "popIn", "sig": {"title": "popOver", "body": "fadeUp", "item": "springIn", "image": "popOver", "number": "popOver", "order": "seq", "stagger": 0.14}, "tempo": 0.95, "kenburns": true};
