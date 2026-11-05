/** 193 Kobalt — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
// a modern official sheet: the same cobalt can also appear as paper, as a signal-yellow page, a deeper ink and a drafting grid (160 px = 1 inch)
const grid = () => raw(Array.from({ length: 13 }, (_, i) => `<path d="M${112 + i * 115},0 V900" stroke="#FFFFFF" stroke-width="1" opacity="0.1"/>`).join('') + Array.from({ length: 8 }, (_, i) => `<path d="M0,${50 + i * 115} H1600" stroke="#FFFFFF" stroke-width="1" opacity="0.1"/>`).join(''));
module.exports = B({ id: 193, slug: 'kobalt', name: "Kobalt", mode: 'top', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'FFFFFF', muted: 'C3D3FF', accent: 'FFD84D' }, photo: { r: 0.0 }, rule: false, caps: false, bold: true,
  bg: (kind) => kind === 'paper' ? compose(flat('F4F6FE'))
    : kind === 'signal' ? compose(flat('FFD84D'))
    : kind === 'deep' ? compose(flat('12266F'), grain(0.04))
    : kind === 'grid' ? compose(flat('1F3FBF'), grid())
    : kind === 'column' ? compose(flat('F4F6FE'), raw('<rect width="560" height="900" fill="#1F3FBF"/>'))
    : kind === 'slant' ? compose(flat('1F3FBF'), raw('<polygon points="0,0 900,0 700,900 0,900" fill="#F4F6FE"/>'))
    : compose(flat('1F3FBF'), grain(0.04)),
  ways: ({ k, t, L, C, F, slide }, R) => {
    const W = 'FFFFFF', Y = C.accent, M = C.muted, CO = '1F3FBF', NV = '12266F', G = '4A5A94';
    const open = async (kind = 'page', c = M, x = 0.7, w = 8.6) => { const s = await slide(kind); k.foot(s, { x, w, y: 5.3, size: 7.5, color: c }); return s; };
    const no = (s, c = M) => k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 8.2, 0.18, 1.5, 0.3, { size: 9, color: c, align: 'right', font: F.body, spacing: 1 });
    const T = (s, v, x = 0.7, y = 0.3, w = 8.6, h = 1.2, o = {}) => k.head(s, v, x, y, w, h, { max: 34, min: 14, color: W, valign: 'bottom', ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: W, valign: 'top', ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: W, ls: 1.2, ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 54, min: 16, color: Y, ...o });
    const V = {
      image: [
        async (d) => { // the whole page is the picture, printed in cobalt so the words stay white
          const s = await open();
          await k.photo(s, d.image, 0, 0, 10, 5.625, { duo: ['0E1E66', '4665CC'] });
          no(s, W);
          T(s, d.title, 0.7, 0.35, 7.6, 1.35, { valign: 'top', max: 34 });
          t.line(s, 0.7, 2.05, 1.2, 0, Y, 2.5);
          p(s, d.text, 0.7, 2.2, 6.3, 2.95, { max: 14 });
          k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: W });
        },
        async (d) => { // the picture hard in the corner, the page number standing large beneath it
          const s = await open('page', M, 0.7, 5.2);
          await k.photo(s, d.image, 6.2, 0, 3.8, 3.8);
          T(s, d.title, 0.7, 0.35, 5.15, 1.55, { valign: 'top', color: Y, max: 28 });
          p(s, d.text, 0.7, 2.0, 5.15, 3.15);
          fig(s, String(k.idx).padStart(2, '0'), 6.2, 3.9, 3.1, 1.25, { max: 66, align: 'right', valign: 'bottom' });
        },
        async (d) => { // a white sheet: a band of picture across it, the figure of the page in the margin
          const s = await open('paper', G);
          no(s, G);
          T(s, d.title, 0.7, 0.3, 7.4, 1.05, { color: NV, max: 28 });
          await k.photo(s, d.image, 0, 1.45, 10, 2.1);
          k.head(s, String(k.idx).padStart(2, '0'), 0.7, 3.68, 2.2, 1.45, { max: 60, color: CO, valign: 'top' });
          p(s, d.text, 3.2, 3.7, 6.1, 1.47, { color: NV });
        },
        async (d) => { // a low wide picture, a tall yellow title beside it
          const s = await open('page', M, 0.7, 2.3);
          no(s);
          T(s, d.title, 0.7, 0.4, 2.3, 4.7, { color: Y, valign: 'top', max: 24 });
          p(s, d.text, 3.2, 0.5, 6.1, 2.9, { max: 14 });
          await k.photo(s, d.image, 3.2, 3.55, 6.8, 2.075);
        },
      ],
      cards: [
        async (d) => { // a specification table: index, icon, name, description
          const s = await open('grid'), n = d.items.length, rh = 3.28 / n;
          no(s); T(s, d.title);
          for (const [i, it] of d.items.entries()) {
            const y = 1.82 + i * rh;
            t.line(s, 0.7, y, 8.6, 0, W, 0.75);
            k.head(s, String(i + 1).padStart(2, '0'), 0.7, y + 0.08, 0.7, rh - 0.14, { max: 20, min: 12, color: Y, valign: 'top' });
            t.img(s, await L.icon(it.icon, Y, 1.75), 1.45, y + 0.1, 0.34, 0.34);
            h3(s, it.h, 1.95, y + 0.09, 2.45, rh - 0.14);
            p(s, it.t, 4.55, y + 0.08, 4.75, rh - 0.12, { max: 12.5 });
          }
        },
        async (d) => { // the signal page: a cross of thin lines divides it
          const s = await open('signal', NV), n = d.items.length, top = 1.55;
          no(s, NV); T(s, d.title, 0.7, 0.3, 8.6, 1.05, { color: NV, max: 30 });
          t.line(s, 0.7, 3.3, 8.6, 0, NV, 1);
          const put = async (it, x, y, w) => {
            t.img(s, await L.icon(it.icon, NV, 2), x, y, 0.42, 0.42);
            h3(s, it.h, x + 0.55, y, w - 0.55, 0.42, { color: NV, valign: 'middle' });
            p(s, it.t, x, y + 0.48, w, 1.22, { color: NV });
          };
          if (n === 4) t.line(s, 5, top, 0, 3.6, NV, 1); else t.line(s, 5, 3.3, 0, 1.85, NV, 1);
          if (n === 3) { await put(d.items[0], 0.7, top, 8.6); await put(d.items[1], 0.7, 3.42, 4.0); await put(d.items[2], 5.3, 3.42, 4.0); }
          else for (const [i, it] of d.items.entries()) await put(it, i % 2 ? 5.3 : 0.7, i < 2 ? top : 3.42, 4.0);
        },
        async (d) => { // columns set high, low, high, each under a large yellow figure
          const s = await open(), n = d.items.length, gap = 0.34, w = (8.6 - gap * (n - 1)) / n;
          no(s); T(s, d.title, 0.7, 0.3, 8.6, 1.05, { max: 30 });
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap), y = i % 2 ? 2.2 : 1.45;
            fig(s, String(i + 1).padStart(2, '0'), x, y, w, 0.75, { max: 42, valign: 'bottom' });
            h3(s, it.h, x, y + 0.8, w, 0.5);
            p(s, it.t, x, y + 1.3, w, 5.15 - y - 1.3, { max: 12.5 });
          });
        },
        async (d) => { // a cobalt column carries the title, the items sit on white paper
          const s = await open('column', G, 3.9, 5.4), n = d.items.length, rh = 4.7 / n;
          no(s, G);
          T(s, d.title, 0.45, 0.5, 2.75, 3.6, { valign: 'top', max: 28 });
          for (const [i, it] of d.items.entries()) {
            const y = 0.5 + i * rh;
            t.img(s, await L.icon(it.icon, CO, 1.75), 3.9, y + 0.02, 0.42, 0.42);
            h3(s, it.h, 4.5, y, 4.85, 0.36, { color: NV, max: 15 });
            p(s, it.t, 4.5, y + 0.36, 4.85, rh - 0.42, { color: G, max: 12.5 });
          }
        },
      ],
      process: [
        async (d) => { // a measuring rule: long tick for each step, fine ticks between
          const s = await open(), n = d.steps.length, gap = 0.32, w = (8.6 - gap * (n - 1)) / n, ly = 2.45;
          no(s); T(s, d.title, 0.7, 0.3, 8.6, 1.05, { max: 30 });
          t.line(s, 0.7, ly, 8.6, 0, W, 1);
          for (let i = 0; i <= 40; i++) t.line(s, 0.7 + i * 0.215, ly, 0, 0.08, W, 0.5);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            t.line(s, x, ly - 0.42, 0, 0.5, Y, 2);
            fig(s, String(i + 1), x + 0.12, ly - 0.72, w - 0.12, 0.66, { max: 36, valign: 'bottom' });
            h3(s, st.h, x, ly + 0.2, w, 0.5);
            p(s, st.t, x, ly + 0.7, w, 5.15 - ly - 0.7, { max: 12.5 });
          });
        },
        async (d) => { // on the drafting grid: steps going down to the right
          const s = await open('grid'), n = d.steps.length, w = n === 4 ? 2.05 : 2.8, sx = n === 4 ? 2.18 : 2.9, sy = n === 4 ? 0.6 : 0.85;
          no(s); T(s, d.title, 0.7, 0.3, 8.6, 1.1, { max: 30 });
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * sx, y = 1.62 + i * sy;
            t.line(s, x, y, w, 0, Y, 1.5);
            h3(s, `${i + 1}  ${st.h}`, x, y + 0.08, w, 0.46, { color: Y });
            p(s, st.t, x, y + 0.54, w, 1.06, { max: 11.5 });
          });
        },
        async (d) => { // a route map: stations along a line that shifts down halfway
          const s = await open('deep'), n = d.steps.length, y1 = 1.85, y2 = 3.5, xs = n === 4 ? [0.8, 3.0, 5.4, 7.55] : [0.8, 3.6, 6.2], ws = n === 4 ? [2.05, 2.05, 2.0, 1.85] : [2.6, 2.3, 3.1], turn = n === 4 ? 5.2 : 5.95;
          no(s); T(s, d.title, 0.7, 0.3, 8.6, 1.1, { max: 30 });
          t.line(s, 0.7, y1, turn - 0.7, 0, Y, 2.5); t.line(s, turn, y1, 0, y2 - y1, Y, 2.5); t.line(s, turn, y2, 9.3 - turn, 0, Y, 2.5);
          d.steps.forEach((st, i) => {
            const low = n === 4 ? i >= 2 : i === 2, y = low ? y2 : y1, x = xs[i];
            t.oval(s, x, y - 0.1, 0.2, 0.2, NV, { line: { color: Y, width: 2 } }); t.oval(s, x + 0.05, y - 0.05, 0.1, 0.1, Y);
            h3(s, `${i + 1}  ${st.h}`, x, y + 0.16, ws[i], 0.46);
            p(s, st.t, x, y + 0.62, ws[i], low ? 5.15 - y - 0.62 : 3.75 - y - 0.1 + 0.2, { max: 11.5 });
          });
        },
        async (d) => { // the count of steps stands huge on the left, the steps run off it
          const s = await open(), n = d.steps.length, rh = 3.3 / n;
          no(s); T(s, d.title, 0.7, 0.3, 8.6, 1.1, { max: 30 });
          fig(s, `1–${n}`, 0.7, 1.75, 3.0, 3.3, { max: 92, min: 54, valign: 'top' });
          d.steps.forEach((st, i) => {
            const y = 1.8 + i * rh;
            t.line(s, 3.95, y, 5.35, 0, M, 0.75);
            h3(s, `${i + 1}.  ${st.h}`, 3.95, y + 0.07, 5.35, 0.3, { color: Y, max: 13 });
            p(s, st.t, 3.95, y + 0.37, 5.35, rh - 0.42, { max: 11.5 });
          });
        },
      ],
      stats: [
        async (d) => { // white paper, the leading figure takes half the sheet
          const s = await open('paper', G), [a, ...rest] = d.stats;
          no(s, G); T(s, d.title, 0.7, 0.3, 8.6, 1.0, { color: NV, max: 28 });
          k.head(s, a.value, 0.7, 1.45, 5.2, 1.9, { max: 88, min: 40, color: CO, valign: 'middle' });
          p(s, a.label, 0.7, 3.4, 4.9, 0.7, { color: NV, max: 15, min: 11 });
          t.line(s, 6.15, 1.5, 0, 3.6, CO, 1);
          rest.forEach((x, i) => {
            const y = 1.5 + i * 1.22;
            k.head(s, x.value, 6.4, y, 2.9, 0.6, { max: 32, min: 16, color: CO, valign: 'top' });
            p(s, x.label, 6.4, y + 0.6, 2.9, 0.58, { color: G, max: 11.5 });
          });
          if (d.note) p(s, d.note, 0.7, 4.15, 5.2, 1.02, { color: G, max: 11, min: 9.5, valign: 'bottom' });
        },
        async (d) => { // the signal page: figures flush left, one under another, the note to the side
          const s = await open('signal', NV);
          no(s, NV); T(s, d.title, 0.7, 0.3, 8.6, 1.0, { color: NV, max: 28 });
          d.stats.forEach((x, i) => {
            const y = 1.5 + i * 1.22;
            k.head(s, x.value, 0.7, y, 3.3, 1.12, { max: 56, min: 24, color: CO, valign: 'middle' });
            p(s, x.label, 4.15, y, 2.45, 1.12, { color: NV, valign: 'middle', max: 12.5 });
          });
          t.line(s, 6.8, 1.55, 0, 3.55, NV, 1);
          if (d.note) p(s, d.note, 7.0, 1.55, 2.3, 3.55, { color: NV, max: 12, min: 9.5, valign: 'bottom' });
        },
      ],
      compare: [
        async (d) => { // a ledger on the grid: row numbers down the middle, the sides read away from them
          const s = await open('grid'), w = 3.75;
          no(s); T(s, d.title, 0.7, 0.3, 8.6, 1.0, { max: 28 });
          h3(s, d.left.h, 0.7, 1.45, w, 0.42, { color: Y, max: 18, min: 12, align: 'right', valign: 'middle' });
          h3(s, d.right.h, 5.55, 1.45, w, 0.42, { color: Y, max: 18, min: 12, valign: 'middle' });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.2, 3.1);
          let y = 2.0;
          rows.forEach((rh, j) => {
            t.line(s, 0.7, y - 0.05, 8.6, 0, W, 0.5);
            k.head(s, String(j + 1), 4.6, y, 0.8, 0.34, { max: 16, min: 12, color: Y, align: 'center', valign: 'top' });
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: W, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.55, y, w, rh, { size: fs, color: W });
            y += rh;
          });
        },
        async (d) => { // a slanted cut between paper and cobalt
          const s = await open('slant', G, 0.7, 3.4);
          no(s, W);
          T(s, d.title, 0.7, 0.35, 4.3, 1.05, { color: NV, max: 22, valign: 'top' });
          const side = (sd, x, y0, w, c, b) => {
            k.head(s, sd.h, x, y0, w, 0.45, { max: 19, min: 12, color: c });
            const hh = (5.15 - y0 - 0.55) / sd.items.length;
            sd.items.forEach((it, j) => { const y = y0 + 0.55 + j * hh; t.line(s, x, y, w, 0, c, 0.75); p(s, it, x, y + 0.06, w, hh - 0.1, { color: b, max: 14, min: 10.5 }); });
          };
          side(d.left, 0.7, 1.5, 3.4, CO, NV);
          side(d.right, 5.85, 0.55, 3.45, Y, W);
        },
      ],
      statement: [
        async (d) => { // white paper: the words low and heavy, the caption hung in the upper right
          const s = await open('paper', G);
          no(s, G);
          k.head(s, d.title, 0.7, 0.4, 3.4, 1.25, { max: 16, min: 11, color: CO, valign: 'top' });
          if (d.caption) p(s, d.caption, 4.4, 0.45, 4.9, 1.45, { color: G, max: 12.5 });
          t.line(s, 0.7, 2.02, 8.6, 0, CO, 1);
          k.head(s, L.runs(d.text), 0.7, 2.12, 8.6, 3.05, { max: 38, min: 18, color: NV, valign: 'bottom' });
        },
        async (d) => { // the signal page, loud, a short thick mark above the words
          const s = await open('signal', NV);
          no(s, NV);
          t.line(s, 0.7, 0.55, 1.2, 0, NV, 4);
          k.head(s, d.title, 0.7, 0.68, 7.6, 0.45, { max: 15, min: 11, color: NV, valign: 'top' });
          k.head(s, L.runs(d.text), 0.7, 1.15, 8.6, 2.65, { max: 40, min: 18, color: CO, valign: 'top' });
          if (d.caption) p(s, d.caption, 3.2, 3.92, 6.1, 1.25, { color: NV, max: 12.5 });
        },
      ],
      timeline: [
        async (d) => { // a printed table: rows of years, names and notes under full-width rules
          const s = await open('paper', G), w = 2.0, gap = 0.2;
          no(s, G); T(s, d.title, 0.7, 0.3, 8.6, 1.0, { color: NV, max: 28 });
          [1.45, 2.3, 2.85].forEach((y) => t.line(s, 0.7, y, 8.6, 0, CO, y === 1.45 ? 1.5 : 0.5));
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, it.year, x, 1.5, w, 0.76, { max: 30, min: 15, color: CO });
            h3(s, it.h, x, 2.36, w, 0.46, { color: NV, max: 13 });
            p(s, it.t, x, 2.92, w, 2.24, { color: G, max: 12.5 });
          });
        },
        async (d) => { // flags planted on a base line, alternately tall and short
          const s = await open(), w = 1.95, sx = 2.16, ly = 4.72;
          no(s); T(s, d.title, 0.7, 0.3, 8.6, 1.05, { max: 30 });
          t.line(s, 0.7, ly, 8.6, 0, W, 1);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * sx, y = i % 2 ? 3.22 : 1.5;
            t.line(s, x, y, 0, ly - y, Y, 1.25);
            h3(s, it.h, x + 0.1, y, w, 0.3, { max: 12.5 });
            p(s, it.t, x + 0.1, y + 0.3, w - 0.05, 1.18, { max: 11.5 });
            k.head(s, it.year, x, ly + 0.04, w, 0.44, { max: 22, min: 13, color: Y });
          });
        },
        async (d) => { // deep ink: years big against a rail, each event at its own step
          const s = await open('deep');
          no(s); T(s, d.title, 0.7, 0.3, 8.6, 1.05, { max: 30 });
          t.line(s, 3.75, 1.55, 0, 3.6, Y, 1.5);
          d.items.forEach((it, i) => {
            const y = 1.55 + i * 0.91;
            k.head(s, it.year, 0.7, y, 2.85, 0.84, { max: 32, min: 16, color: Y, align: 'right' });
            t.oval(s, 3.68, y + 0.34, 0.14, 0.14, Y);
            h3(s, it.h, 4.0, y, 5.3, 0.28, { max: 13 });
            p(s, it.t, 4.0, y + 0.28, 5.3, 0.58, { max: 11.5, min: 9.5, ls: 1.1 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // nor the first process the columns of the cards
    R.timeline = V.timeline.shift(); // nor the first timeline
    return V;
  },
  tone: "aniq va kuchli: rasmiy-zamonaviy, raqamlarga tayangan" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "elegant"], "transitions": ["push:l", "fade", "morph"], "cover": ["sweepIn", "stretch"], "mark": "popIn", "deco": "sweepIn", "sig": {"title": "sweepIn", "body": "fadeRight", "item": "slideRight", "image": "wipe:r", "number": "popIn", "order": "cascade", "stagger": 0.14}, "tempo": 1.05, "kenburns": true};
