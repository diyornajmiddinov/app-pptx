/** 197 Gilos — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
// a cherry on a stage: a dark theatre with a spot, a blush page, a dark wedge across the corner, branches with hanging fruit (160 px = 1 inch)
const RED = () => [lin([[0,'9B1B3A'],[1,'D23C5A']],'d'), grain(0.05)];
const stem = (x1, y1, x2, y2, c = '4E6B2E', w = 4) => `<path d="M${x1},${y1} C${(x1 + x2) / 2},${y1 + 10} ${x2},${(y1 + y2) / 2 - 20} ${x2},${y2}" fill="none" stroke="#${c}" stroke-width="${w}" stroke-linecap="round"/>`;
module.exports = B({ id: 197, slug: 'gilos', name: "Gilos", mode: 'center', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFFFFF', muted: 'F6C6D2', accent: 'FFD1DC' }, photo: { r: 0.2 }, rule: false, caps: false, bold: true,
  bg: (kind) => kind === 'noir' ? compose(flat('2A0812'), rad(800,380,800,[[0,'6E1128',0.95],[1,'2A0812',0]]), grain(0.05))
    : kind === 'blush' ? compose(flat('FFECF0'))
    : kind === 'fruit' ? compose(flat('FFECF0'), raw(stem(600,30,322,180,'6C8A3C') + `<circle cx="760" cy="30" r="0"/><circle cx="322" cy="176" r="3" fill="#6C8A3C"/>`))
    : kind === 'wedge' ? compose(...RED(), raw('<polygon points="0,0 800,0 0,640" fill="#5E0F24"/>'))
    : kind === 'branch' ? compose(flat('FFECF0'), raw('<path d="M60,100 C500,60 1100,140 1540,100" fill="none" stroke="#6C8A3C" stroke-width="3" stroke-linecap="round"/>' + [320, 800, 1280].map((x) => stem(x, 100, x, 125, '6C8A3C', 3) + `<circle cx="${x}" cy="248" r="130" fill="#9B1B3A"/>`).join('')))
    : kind === 'twin' ? compose(...RED(), raw(stem(800,130,430,205,'FFD1DC',3) + stem(800,130,1170,205,'FFD1DC',3) + '<circle cx="430" cy="496" r="296" fill="#5E0F24"/><circle cx="1170" cy="496" r="296" fill="#FFECF0"/>'))
    : kind === 'film' ? compose(flat('2A0812'), raw([232, 416].map((y) => Array.from({ length: 40 }, (_, i) => `<rect x="${i * 40 + 8}" y="${y}" width="22" height="14" rx="3" fill="#6E1128"/>`).join('')).join('')))
    : compose(...RED()),
  ways: ({ k, t, L, C, F, slide }, R) => {
    const W = 'FFFFFF', A = C.accent, CH = '8E1733', DK = '4A0A1C', RS = '6E3345', GR = '5E7A30';
    const open = async (kind = 'page', c = W, x = 1, w = 8, align = 'center') => { const s = await slide(kind); k.foot(s, { x, w, y: 5.3, size: 7.5, color: c, align }); return s; };
    const no = (s, c = W) => k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 8.2, 0.18, 1.5, 0.3, { size: 9, color: c, align: 'right', font: F.body, spacing: 1 });
    const T = (s, v, x = 1, y = 0.32, w = 8, h = 0.9, o = {}) => k.head(s, v, x, y, w, h, { max: 28, min: 14, color: W, align: 'center', valign: 'bottom', ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: W, valign: 'top', ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: W, ls: 1.2, ...o });
    const V = {
      image: [
        async (d) => { // the cinema: a wide letterbox of picture in a dark house
          const s = await open('noir', A); no(s, A);
          T(s, d.title, 1, 0.28, 8, 0.82, { max: 26 });
          await k.photo(s, d.image, 0, 1.2, 10, 2.25);
          p(s, d.text, 1.2, 3.58, 7.6, 1.6, { align: 'center', max: 13 });
        },
        async (d) => { // the picture is a cherry on its stem
          const s = await open('fruit', RS, 4.7, 4.7, 'left'); no(s, RS);
          await k.photo(s, d.image, 0.3, 1.1, 3.75, 3.75, { mask: 'circle' });
          T(s, d.title, 4.7, 0.5, 4.7, 1.35, { color: CH, align: 'left', italic: true });
          p(s, d.text, 4.7, 1.95, 4.7, 3.2, { color: DK });
        },
        async (d) => { // the picture sweeps in from the right behind a curved edge
          const s = await open('page', W, 0.7, 4.1, 'left'); no(s);
          await k.photo(s, d.image, 4.6, 0, 5.4, 5.625, { mask: { path: 'M0.2,0 L1,0 L1,1 L0.2,1 C-0.12,0.72 -0.12,0.28 0.2,0 Z' } });
          T(s, d.title, 0.7, 0.45, 3.9, 1.5, { align: 'left', valign: 'top', max: 26, italic: true });
          p(s, d.text, 0.7, 2.05, 3.9, 3.12);
        },
        async (d) => { // the title carried across the top, a soft-cornered picture low on the left
          const s = await open('page', W, 4.5, 4.8, 'left'); no(s);
          T(s, d.title, 0.7, 0.3, 8.6, 1.2, { align: 'left', max: 34, valign: 'middle' });
          await k.photo(s, d.image, 0.7, 1.65, 3.5, 3.52, { mask: { r: 0.25 } });
          p(s, d.text, 4.5, 1.7, 4.8, 3.45, { max: 14 });
        },
      ],
      cards: [
        async (d) => { // an arch: the middle of the row stands higher
          const s = await open(), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n; no(s);
          T(s, d.title, 1, 0.28, 8, 0.8, { italic: true });
          const ys = n === 4 ? [1.75, 1.2, 1.2, 1.75] : [1.8, 1.2, 1.8];
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = ys[i];
            t.img(s, await L.icon(it.icon, A, 1.75), x + w / 2 - 0.2, y, 0.4, 0.4);
            h3(s, it.h, x, y + 0.46, w, 0.5, { align: 'center', color: A });
            p(s, it.t, x, y + 0.96, w, 5.17 - y - 0.96, { align: 'center', max: 12.5 });
          }
        },
        async (d) => { // a conversation on a blush page: left, right, left, right
          const s = await open('blush', RS), n = d.items.length, rh = 3.95 / n; no(s, RS);
          T(s, d.title, 1, 0.22, 8, 0.82, { color: CH, italic: true });
          for (const [i, it] of d.items.entries()) {
            const y = 1.15 + i * rh, left = i % 2 === 0, tx = left ? 1.3 : 2.9;
            t.img(s, await L.icon(it.icon, CH, 1.75), left ? 0.65 : 8.87, y + 0.03, 0.48, 0.48);
            h3(s, it.h, tx, y, 5.8, 0.32, { color: CH, align: left ? 'left' : 'right' });
            p(s, it.t, tx, y + 0.33, 5.8, rh - 0.38, { color: DK, align: left ? 'left' : 'right', max: 12.5 });
          }
        },
        async (d) => { // a dark wedge falls from the corner, the items keep clear along its edge
          const s = await open('wedge', W, 3.5, 5.9, 'right'), n = d.items.length, rh = 4.68 / n; no(s);
          T(s, d.title, 0.35, 0.3, 2.7, 1.2, { align: 'left', valign: 'top', max: 17, min: 12, italic: true });
          for (const [i, it] of d.items.entries()) {
            const y = 0.42 + i * rh, x = Math.max(0.7, 5 * (1 - (y + 0.1) / 4) + 0.3), w = 9.4 - x;
            t.img(s, await L.icon(it.icon, A, 1.75), x, y, 0.34, 0.34);
            h3(s, it.h, x + 0.44, y, w - 0.44, 0.34, { valign: 'middle', color: A });
            p(s, it.t, x, y + 0.38, w, rh - 0.44, { max: 12.5 });
          }
        },
        async (d) => { // the dark house: the names become the type, large, and the words answer quietly
          const s = await open('noir', A), n = d.items.length, rh = 3.95 / n; no(s, A);
          T(s, d.title, 1, 0.22, 8, 0.82, { color: A, max: 22 });
          for (const [i, it] of d.items.entries()) {
            const y = 1.18 + i * rh;
            k.head(s, it.h, 0.6, y, 4.9, rh - 0.08, { max: 26, min: 14, color: W, italic: true, align: 'right', valign: 'top' });
            t.img(s, await L.icon(it.icon, A, 1.75), 5.68, y + 0.05, 0.28, 0.28);
            p(s, it.t, 6.1, y, 3.3, rh - 0.08, { color: A, max: 12 });
          }
        },
      ],
      process: [
        async (d) => { // fruit hanging from a branch on long and short stems
          const s = await open('blush', RS), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n; no(s, RS);
          T(s, d.title, 1, 0.2, 8, 0.72, { color: CH, italic: true });
          t.line(s, 0.6, 1.05, 8.8, 0, GR, 1.5);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap), c = x + w / 2, by = i % 2 ? 1.72 : 1.28;
            t.line(s, c, 1.05, 0, by - 1.05, GR, 1);
            t.oval(s, c - 0.26, by, 0.52, 0.52, CH);
            k.txt(s, String(i + 1), c - 0.26, by, 0.52, 0.52, { size: 16, bold: true, color: W, font: F.head, align: 'center', valign: 'middle' });
            h3(s, st.h, x, by + 0.58, w, 0.48, { color: CH, align: 'center', max: 13 });
            p(s, st.t, x, by + 1.06, w, 5.17 - by - 1.06, { color: DK, align: 'center', max: 12.5 });
          });
        },
        async (d) => { // a crescendo: the numerals swell toward the last
          const s = await open(), n = d.steps.length, gap = 0.36, w = (8.8 - gap * (n - 1)) / n, sizes = n === 4 ? [36, 52, 70, 88] : [40, 62, 88]; no(s);
          T(s, d.title, 1, 0.22, 8, 0.72, { align: 'left', italic: true, valign: 'top' });
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap);
            k.head(s, String(i + 1), x, 0.95, w, 1.32, { size: sizes[i], color: A, italic: true, valign: 'bottom' });
            h3(s, st.h, x, 2.35, w, 0.5);
            p(s, st.t, x, 2.87, w, 2.3, { max: 13 });
          });
        },
        async (d) => { // a long slanting line across the page, steps on its two sides in turn
          const s = await open('noir', A, 0.6, 3.0, 'left'), n = d.steps.length; no(s, A);
          T(s, d.title, 0.6, 0.25, 7.2, 0.75, { align: 'left', max: 22 });
          t.line(s, 0.6, 1.3, 8.8, 3.6, A, 1);
          const spots = n === 4 ? [[1.4, 0.6, 2.72, 3.2], [3.9, 3.7, 1.18, 3.2], [5.3, 3.3, 3.95, 3.1], [8.1, 6.6, 2.3, 2.8]] : [[1.4, 0.6, 2.72, 3.2], [4.6, 4.6, 1.2, 3.4], [7.8, 4.4, 4.02, 2.75]];
          d.steps.forEach((st, i) => {
            const [px, x, y, w] = spots[i], py = 1.3 + ((px - 0.6) / 8.8) * 3.6;
            t.oval(s, px - 0.15, py - 0.15, 0.3, 0.3, A);
            k.txt(s, String(i + 1), px - 0.15, py - 0.15, 0.3, 0.3, { size: 10.5, bold: true, color: CH, font: F.head, align: 'center', valign: 'middle' });
            h3(s, st.h, x, y, w, 0.3, { color: A, max: 13 });
            p(s, st.t, x, y + 0.31, w, 0.88, { max: 11.5, ls: 1.15 });
          });
        },
        async (d) => { // a round of steps, a thin ring with the title in its middle
          const s = await open(), n = d.steps.length, four = n === 4; no(s);
          if (four) t.oval(s, 3.3, 1.1, 3.4, 3.4, null, { line: { color: A, width: 0.75 } }); else t.oval(s, 3.6, 0.35, 2.8, 2.8, null, { line: { color: A, width: 0.75 } });
          if (four) T(s, d.title, 3.7, 1.9, 2.6, 1.8, { valign: 'middle', italic: true, max: 20 }); else T(s, d.title, 4.0, 1.0, 2.0, 1.5, { valign: 'middle', italic: true, max: 16, min: 11 });
          const spots = four ? [[0.35, 0.5, 'right', 3.8, 1.6], [6.7, 0.5, 'left', 6.2, 1.6], [6.7, 3.3, 'left', 6.2, 4.0], [0.35, 3.3, 'right', 3.8, 4.0]] : [[0.35, 0.5, 'right', 4.01, 0.76], [6.7, 0.5, 'left', 5.99, 0.76], [2.4, 3.42, 'center', 5, 3.15]];
          d.steps.forEach((st, i) => {
            const [x, y, al, dx, dy] = spots[i], w = al === 'center' ? 5.2 : 2.95;
            t.oval(s, dx - 0.2, dy - 0.2, 0.4, 0.4, 'FFECF0');
            k.txt(s, String(i + 1), dx - 0.2, dy - 0.2, 0.4, 0.4, { size: 13, bold: true, color: CH, font: F.head, align: 'center', valign: 'middle' });
            h3(s, st.h, x, y, w, 0.3, { color: A, align: al, max: 13 });
            p(s, st.t, x, y + 0.31, w, 1.3, { align: al, max: 12 });
          });
        },
      ],
      stats: [
        async (d) => { // on stage: one enormous figure under the spot, the other two at its feet
          const s = await open('noir', A), [a, b, c] = d.stats; no(s, A);
          k.head(s, d.title, 1.5, 0.28, 7, 0.5, { max: 16, min: 11.5, color: A, align: 'center', valign: 'middle' });
          k.head(s, a.value, 0.6, 0.78, 8.8, 1.75, { max: 110, min: 44, color: W, align: 'center', italic: true });
          p(s, a.label, 2, 2.55, 6, 0.42, { align: 'center', max: 15, min: 11 });
          [[b, 0.8], [c, 5.4]].forEach(([x, xx]) => { k.head(s, x.value, xx, 3.05, 3.8, 0.56, { max: 28, min: 15, color: A, align: 'center', italic: true }); p(s, x.label, xx, 3.62, 3.8, 0.45, { align: 'center', max: 12 }); });
          if (d.note) p(s, d.note, 1.5, 4.12, 7.0, 1.05, { color: A, align: 'center', max: 11, min: 9.5, valign: 'bottom' });
        },
        async (d) => { // three cherries on the branch, a figure on each
          const s = await open('branch', RS); no(s, RS);
          d.stats.forEach((x, i) => {
            const c = [2, 5, 8][i];
            k.head(s, x.value, c - 0.75, 1.2, 1.5, 0.7, { max: 24, min: 15, color: W, align: 'center' });
            p(s, x.label, c - 1.35, 2.42, 2.7, 0.62, { color: DK, align: 'center', max: 12.5 });
          });
          T(s, d.title, 1, 3.05, 8, 0.82, { color: CH, valign: 'middle', italic: true });
          if (d.note) p(s, d.note, 1.3, 3.92, 7.4, 1.25, { color: DK, align: 'center', max: 12, min: 10 });
        },
      ],
      compare: [
        async (d) => { // a pair of cherries on one stem, dark and pale
          const s = await open('twin', W, 3.1, 3.8); no(s);
          T(s, d.title, 1, 0.08, 8, 0.7, { max: 20 });
          const side = (sd, c, hc, tc) => {
            k.head(s, sd.h, c - 1.2, 1.6, 2.4, 0.55, { max: 14, min: 11, color: hc, align: 'center', italic: true, valign: 'bottom' });
            const hh = 2.28 / sd.items.length;
            sd.items.forEach((it, j) => p(s, it, c - 1.42, 2.2 + j * hh, 2.84, hh - 0.04, { color: tc, align: 'center', max: 12.5, min: 10, valign: 'middle' }));
          };
          side(d.left, 430 / 160, A, W);
          side(d.right, 1170 / 160, CH, DK);
        },
        async (d) => { // two columns out of step: one high, one low, the title in the free corner
          const s = await open('noir', A); no(s, A);
          T(s, d.title, 0.6, 0.35, 4.4, 1.3, { align: 'left', valign: 'top', max: 22, color: A });
          const side = (sd, x, y0, hh0) => {
            k.head(s, sd.h, x, y0, 4.1, 0.5, { max: 20, min: 13, color: W, italic: true });
            const hh = hh0 / sd.items.length;
            sd.items.forEach((it, j) => { t.line(s, x, y0 + 0.56 + j * hh, 4.1, 0, A, 0.5); p(s, it, x, y0 + 0.6 + j * hh, 4.1, hh - 0.08, { max: 14, min: 10.5 }); });
          };
          side(d.left, 0.6, 1.72, 2.85);
          side(d.right, 5.3, 0.55, 3.95);
        },
      ],
      statement: [
        async (d) => { // the spot finds the words: large, italic, in the middle of a dark house
          const s = await open('noir', A); no(s, A);
          k.head(s, d.title, 1.5, 0.35, 7, 0.45, { max: 14, min: 10.5, color: A, align: 'center', valign: 'middle' });
          k.head(s, L.runs(d.text), 0.9, 0.9, 8.2, 3.0, { max: 38, min: 18, color: W, align: 'center', italic: true });
          if (d.caption) p(s, d.caption, 1.7, 3.98, 6.6, 1.2, { color: A, align: 'center', max: 12 });
        },
        async (d) => { // the blush page: the words set hard left in cherry ink, the caption a small column at the right
          const s = await open('blush', RS, 0.6, 8.8, 'left'); no(s, RS);
          k.head(s, d.title, 0.6, 0.45, 6, 0.5, { max: 15, min: 11, color: GR, valign: 'top' });
          k.head(s, L.runs(d.text), 0.6, 1.0, 6.2, 4.1, { max: 34, min: 17, color: CH, valign: 'top' });
          t.line(s, 7.05, 1.05, 0, 4.05, CH, 0.75);
          if (d.caption) p(s, d.caption, 7.25, 1.05, 2.2, 4.05, { color: DK, max: 12.5, min: 10, valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // a strip of film: a frame for every year
          const s = await open('film', A), w = 2.1, gap = 0.13; no(s, A);
          T(s, d.title, 1, 0.25, 8, 1.1, { max: 26 });
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap);
            k.head(s, it.year, x, 1.58, w, 0.9, { max: 26, min: 14, color: W, align: 'center', italic: true });
            h3(s, it.h, x, 2.78, w, 0.32, { color: A, align: 'center', max: 13 });
            p(s, it.t, x, 3.1, w, 2.08, { align: 'center', max: 12.5 });
          });
        },
        async (d) => { // the years walk down to the right, each opening its own line
          const s = await open(), sx = 1.3, sy = 0.93; no(s);
          T(s, d.title, 2.5, 0.2, 7, 0.78, { align: 'right', italic: true, max: 24 });
          d.items.forEach((it, i) => {
            const x = 0.6 + i * sx, y = 1.15 + i * sy, w = Math.min(4.9, 9.4 - x - 1.75);
            k.head(s, it.year, x, y, 1.7, 0.85, { max: 22, min: 12, color: A, italic: true, valign: 'top' });
            h3(s, it.h, x + 1.75, y, w, 0.28, { max: 13 });
            p(s, it.t, x + 1.75, y + 0.28, w, 0.62, { max: 11.5, ls: 1.1, min: 9.5 });
          });
        },
        async (d) => { // the blush page: two columns out of step, a great pale year behind each event
          const s = await open('blush', RS), w = 4.1; no(s, RS);
          T(s, d.title, 1, 0.2, 8, 0.76, { color: CH, max: 24 });
          d.items.forEach((it, i) => {
            const x = i % 2 ? 5.3 : 0.6, y = i % 2 ? 1.5 + (i >> 1) * 1.85 : 1.05 + (i >> 1) * 1.95;
            t.text(s, it.year, { x, y: y - 0.04, w, h: 0.72, fontFace: F.head, bold: true, italic: true, color: 'C8506C', valign: 'top', fontSize: L.fit(it.year, w, 0.72, 38, 18, F.head, true) });
            h3(s, it.h, x, y + 0.66, w, 0.3, { color: CH, max: 13 });
            p(s, it.t, x, y + 0.96, w, 0.8, { color: DK, max: 12 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // nor the first process the rows of the cards
    R.timeline = V.timeline.shift(); // nor the first timeline
    return V;
  },
  tone: "ehtirosli va ko'rkam: qisqa, ta'sirli jumlalar" });
