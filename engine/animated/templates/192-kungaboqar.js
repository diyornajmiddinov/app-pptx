/** 192 Kungaboqar — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
// the flower lives in the background: petals around a centre, and a black page for the loudest moments (160 px = 1 inch)
const petals = (cx, cy, r1, r2, n, c) => raw(Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, b = Math.PI / n, P = (r, q) => `${(cx + r * Math.cos(q)).toFixed(1)},${(cy + r * Math.sin(q)).toFixed(1)}`; return `<polygon points="${P(r1, a - b)} ${P(r2, a)} ${P(r1, a + b)}" fill="#${c}"/>`; }).join(''));
const disc = (cx, cy, r, c) => raw(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#${c}"/>`);
const YEL = () => [flat('FFD23F'), rad(0,900,1000,[[0,'FFE584',0.8],[1,'FFD23F',0]])];
module.exports = B({ id: 192, slug: 'kungaboqar', name: "Kungaboqar", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '1A1A1A', muted: '4A4636', accent: '1A1A1A' }, photo: { r: 0.04 }, rule: true, caps: true, bold: true,
  bg: (kind) => kind === 'black' ? compose(flat('1A1A1A'))
    : kind === 'bloom' ? compose(...YEL(), petals(440,448,310,405,26,'F2A900'))
    : kind === 'disc' ? compose(...YEL(), petals(800,450,245,300,24,'F2A900'), disc(800,450,250,'1A1A1A'))
    : kind === 'corner' ? compose(...YEL(), petals(1600,0,350,450,30,'F2A900'), disc(1600,0,355,'1A1A1A'))
    : kind === 'bandH' ? compose(...YEL(), raw('<rect y="440" width="1600" height="460" fill="#1A1A1A"/>'))
    : kind === 'bandV' ? compose(...YEL(), raw('<rect x="800" width="800" height="900" fill="#1A1A1A"/>'))
    : compose(...YEL()),
  ways: ({ k, t, L, C, F, slide }, R) => {
    const Y = 'FFD23F', K = '1A1A1A', U = (v) => (v || '').toUpperCase();
    const open = async (kind = 'page', c = C.muted, x = 0.6, w = 7.4) => { const s = await slide(kind); k.foot(s, { x, w, y: 5.3, size: 7.5, color: c }); return s; };
    const no = (s, x, y, c = K, size = 32) => k.txt(s, String(k.idx).padStart(2, '0'), x, y, 1.2, size / 58, { size, bold: true, color: c, font: F.head, align: 'right' });
    const T = (s, v, x, y, w, h, o = {}) => k.head(s, U(v), x, y, w, h, { max: 26, min: 12, color: K, spacing: 1, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, U(v), x, y, w, h, { max: 14, min: 10.5, color: K, valign: 'top', ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: K, ls: 1.2, ...o });
    const V = {
      image: [
        async (d) => { // a poster: the picture bleeds across the top, the title shouts under it
          const s = await open();
          await k.photo(s, d.image, 0, 0, 10, 3.0);
          T(s, d.title, 0.6, 3.14, 3.9, 2.0, { valign: 'top' });
          p(s, d.text, 4.85, 3.18, 4.55, 1.98);
          no(s, 8.2, 5.2, K, 13);
        },
        async (d) => { // the picture is the head of the flower, petals in the background
          const s = await open('bloom', C.muted, 5.7, 3.7);
          await k.photo(s, d.image, 0.81, 0.86, 3.88, 3.88, { mask: 'circle' });
          T(s, d.title, 5.7, 0.4, 3.7, 1.35, { valign: 'bottom', max: 22 });
          t.line(s, 5.7, 1.85, 3.7, 0, K, 2);
          p(s, d.text, 5.7, 1.98, 3.7, 3.2);
        },
        async (d) => { // a black page, the picture printed in two inks
          const s = await open('black', Y, 0.6, 3.0);
          await k.photo(s, d.image, 5, 0, 5, 5.625, { duo: [K, Y] });
          T(s, d.title, 0.6, 0.45, 3.95, 1.6, { color: Y, valign: 'top' });
          p(s, d.text, 0.6, 2.15, 3.95, 3.0, { color: 'FFF6D6' });
          no(s, 3.35, 5.2, Y, 13);
        },
        async (d) => { // a tall column of picture splits the page in three
          const s = await open('page', C.muted, 0.6, 2.7);
          await k.photo(s, d.image, 3.55, 0, 2.9, 5.625);
          T(s, d.title, 0.6, 0.5, 2.7, 3.5, { valign: 'top', max: 24 });
          no(s, 2.1, 4.35, K, 44);
          p(s, d.text, 6.75, 0.5, 2.7, 4.65);
        },
      ],
      cards: [
        async (d) => { // everything stands on the title: a big banner across the foot of the page
          const s = await open(), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap);
            t.img(s, await L.icon(it.icon, K, 2), x, 0.42, 0.55, 0.55);
            h3(s, it.h, x, 1.08, w, 0.52);
            p(s, it.t, x, 1.62, w, 2.15);
          }
          t.line(s, 0.6, 3.88, 8.8, 0, K, 2.5);
          T(s, d.title, 0.6, 3.98, 8.8, 1.2, { max: 34, min: 16, valign: 'top' });
          no(s, 8.2, 5.2, K, 13);
        },
        async (d) => { // the black page: one voice first, or four in a square
          const s = await open('black', Y), n = d.items.length;
          T(s, d.title, 0.6, 0.35, 7.5, 0.8, { color: Y, max: 22 });
          no(s, 8.2, 0.35, Y);
          const put = async (it, x, y, w, hh, big) => {
            t.img(s, await L.icon(it.icon, Y, 2), x, y, big ? 0.7 : 0.38, big ? 0.7 : 0.38);
            const hx = big ? x : x + 0.5, hy = big ? y + 0.82 : y, hw = big ? w : w - 0.5, hd = big ? 0.75 : 0.42;
            h3(s, it.h, hx, hy, hw, hd, { color: Y, max: big ? 22 : 14, valign: big ? 'top' : 'middle' });
            p(s, it.t, x, hy + hd + 0.06, w, y + hh - hy - hd - 0.06, { color: 'FFF6D6', max: big ? 15 : 13 });
          };
          if (n === 3) {
            await put(d.items[0], 0.6, 1.35, 3.9, 3.8, true);
            t.line(s, 4.8, 1.4, 0, 3.7, Y, 1);
            await put(d.items[1], 5.1, 1.35, 4.3, 1.8);
            await put(d.items[2], 5.1, 3.3, 4.3, 1.85);
          } else for (const [i, it] of d.items.entries()) await put(it, 0.6 + (i % 2) * 4.6, 1.35 + (i >> 1) * 1.95, 4.2, 1.85);
        },
        async (d) => { // stairs climbing to the right, a heavy tread on each step
          const s = await open(), n = d.items.length, w = n === 4 ? 2.0 : 2.8, sx = n === 4 ? 2.2 : 3.0, ys = n === 4 ? [3.4, 2.6, 1.8, 1.0] : [3.1, 2.1, 1.1];
          T(s, d.title, 0.6, 0.4, n === 4 ? 6.3 : 5.7, n === 4 ? 1.25 : 1.5, { valign: 'top', max: 28 });
          no(s, 8.2, 0.3);
          d.items.forEach((it, i) => {
            const x = 0.6 + i * sx, y = ys[i];
            t.line(s, x, y, w, 0, K, 3);
            h3(s, it.h, x, y + 0.1, w, 0.5);
            p(s, it.t, x, y + 0.6, w, 5.15 - y - 0.6, { max: 12.5 });
          });
        },
        async (d) => { // the head of the flower in the middle holds the title, leaves round it
          const s = await open('disc'), n = d.items.length;
          T(s, d.title, 3.7, 1.85, 2.6, 1.8, { color: Y, max: 20, align: 'center' });
          const spots = n === 4 ? [[0.5, 0.45, 'right'], [6.9, 0.45, 'left'], [0.5, 3.0, 'right'], [6.9, 3.0, 'left']] : [[0.5, 1.7, 'right'], [6.9, 0.45, 'left'], [6.9, 3.0, 'left']];
          for (const [i, it] of d.items.entries()) {
            const [x, y, align] = spots[i];
            t.img(s, await L.icon(it.icon, K, 2), align === 'right' ? x + 2.2 : x, y, 0.4, 0.4);
            h3(s, it.h, x, y + 0.46, 2.6, 0.48, { align });
            p(s, it.t, x, y + 0.94, 2.6, 1.2, { align, max: 12 });
          }
          no(s, 8.2, 5.2, K, 13);
        },
      ],
      process: [
        async (d) => { // numbers on a heavy line that runs forward off to an arrow
          const s = await open(), n = d.steps.length, gap = 0.35, w = (8.5 - gap * (n - 1)) / n;
          T(s, d.title, 0.6, 0.35, 7.5, 0.85, { max: 24 });
          no(s, 8.2, 0.35);
          t.line(s, 0.6, 2.32, 8.5, 0, K, 3);
          t.line(s, 9.24, 2.2, 0.16, 0.12, K, 3); t.line(s, 9.24, 2.32, 0.16, 0.12, K, 3, { flipV: true });
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap);
            k.head(s, String(i + 1), x, 1.25, w, 1.05, { max: 66, min: 40, color: K, valign: 'bottom' });
            h3(s, st.h, x, 2.46, w, 0.52);
            p(s, st.t, x, 3.0, w, 2.15);
          });
        },
        async (d) => { // black page, a yellow spine, sides taking turns
          const s = await open('black', Y), n = d.steps.length, hh = 3.8 / n;
          T(s, d.title, 0.6, 0.3, 7.5, 0.8, { color: Y, max: 22 });
          no(s, 8.2, 0.3, Y);
          t.line(s, 5, 1.3, 0, 3.85, Y, 1.5);
          d.steps.forEach((st, i) => {
            const y = 1.3 + i * hh, left = i % 2 === 0, x = left ? 0.6 : 5.45, align = left ? 'right' : 'left';
            t.oval(s, 4.8, y, 0.4, 0.4, Y);
            k.txt(s, String(i + 1), 4.8, y, 0.4, 0.4, { size: 14, bold: true, color: K, font: F.head, align: 'center', valign: 'middle' });
            h3(s, st.h, x, y, 3.95, 0.32, { color: Y, align });
            p(s, st.t, x, y + 0.33, 3.95, 0.75, { color: 'FFF6D6', align, max: 12 });
          });
        },
        async (d) => { // a crowd gathering: each step wider than the last, centred
          const s = await open(), n = d.steps.length, hh = 3.95 / n, ws = n === 4 ? [4.7, 5.9, 7.2, 8.8] : [5.2, 7.0, 8.8];
          T(s, d.title, 0.9, 0.3, 8.2, 0.8, { align: 'center', max: 24 });
          d.steps.forEach((st, i) => {
            const y = 1.2 + i * hh, w = ws[i], x = 5 - w / 2;
            t.line(s, x, y, w, 0, K, 2);
            h3(s, `${i + 1}  ${st.h}`, x, y + 0.06, w, 0.3, { align: 'center', max: 13 });
            p(s, st.t, x, y + 0.36, w, hh - 0.4, { align: 'center', max: 12 });
          });
          no(s, 8.2, 5.2, K, 13);
        },
        async (d) => { // the title turned on its side, each column closed by a huge figure
          const s = await open('page', C.muted, 1.65, 6.4), n = d.steps.length, gap = 0.36, w = (7.75 - gap * (n - 1)) / n;
          k.head(s, U(d.title), -1.75, 2.15, 5.0, 0.95, { max: 26, min: 14, color: K, rotate: 270, align: 'left', valign: 'middle', spacing: 1 });
          d.steps.forEach((st, i) => {
            const x = 1.65 + i * (w + gap);
            if (i) t.line(s, x - gap / 2, 0.45, 0, 4.7, K, 1);
            h3(s, st.h, x, 0.45, w, 0.55);
            p(s, st.t, x, 1.02, w, 2.6);
            k.head(s, String(i + 1), x, 3.65, w, 1.5, { max: 88, min: 60, color: K, valign: 'bottom' });
          });
          no(s, 8.2, 5.2, K, 13);
        },
      ],
      stats: [
        async (d) => { // one number as loud as the page allows
          const s = await open(), [a, b, c] = d.stats;
          T(s, d.title, 0.6, 0.28, 7.5, 0.6, { max: 18 });
          no(s, 8.2, 0.28);
          k.head(s, a.value, 0.6, 0.9, 8.8, 2.1, { max: 130, min: 44, color: K });
          t.line(s, 0.6, 3.05, 8.8, 0, K, 2.5);
          p(s, a.label, 0.6, 3.16, 2.7, 1.2, { max: 15, min: 11, bold: true });
          [b, c].forEach((x, i) => {
            const xx = 3.6 + i * 3.0;
            k.head(s, x.value, xx, 3.14, 2.8, 0.55, { max: 28, min: 15, color: K, valign: 'top' });
            p(s, x.label, xx, 3.7, 2.8, 0.7, { max: 11.5, min: 10 });
          });
          if (d.note) p(s, d.note, 0.6, 4.45, 8.8, 0.72, { max: 11, min: 9.5, color: C.muted });
        },
        async (d) => { // black page, figures falling from the top left
          const s = await open('black', Y);
          T(s, d.title, 0.6, 0.3, 6.1, 0.8, { color: Y, max: 22, valign: 'top' });
          no(s, 8.2, 0.3, Y);
          d.stats.forEach((x, i) => {
            const xx = 0.6 + i * 3.0, y = 1.15 + i * 0.85;
            k.head(s, x.value, xx, y, 2.8, 0.82, { max: 48, min: 22, color: Y, valign: 'bottom' });
            p(s, x.label, xx, y + 0.86, 2.8, 0.72, { color: 'FFF6D6', max: 12.5, min: 10 });
          });
          if (d.note) p(s, d.note, 0.6, 3.75, 5.3, 1.4, { color: 'FFF6D6', max: 11.5, min: 9.5, valign: 'bottom' });
        },
        async (d) => { // a scoreboard: words to the left, the figures hard against the right edge
          const s = await open(), rh = 0.97;
          T(s, d.title, 0.6, 0.32, 7.5, 0.8, { max: 24 });
          no(s, 8.2, 0.32);
          d.stats.forEach((x, i) => {
            const y = 1.22 + i * rh;
            t.line(s, 0.6, y, 8.8, 0, K, 2);
            p(s, x.label, 0.6, y + 0.06, 5.1, rh - 0.12, { max: 15, min: 11, valign: 'middle' });
            k.head(s, x.value, 5.9, y + 0.03, 3.5, rh - 0.06, { max: 46, min: 22, color: K, align: 'right' });
          });
          t.line(s, 0.6, 1.22 + 3 * rh, 8.8, 0, K, 2);
          if (d.note) p(s, d.note, 0.6, 4.2, 8.8, 0.95, { max: 11, min: 9.5, color: C.muted });
        },
      ],
      compare: [
        async (d) => { // day above, night below: the page cut across
          const s = await open('bandH', Y);
          T(s, d.title, 0.6, 0.22, 7.5, 0.6, { max: 17 });
          no(s, 8.2, 0.22, K, 28);
          const side = (sd, y0, c, b, rowh) => {
            h3(s, sd.h, 0.6, y0, 8.8, 0.4, { color: c, max: 19, min: 13, valign: 'middle' });
            sd.items.forEach((it, j) => p(s, it, 0.6 + (j % 2) * 4.55, y0 + 0.44 + (j >> 1) * rowh, 4.25, rowh - 0.04, { color: b, max: 13, min: 10.5 }));
          };
          side(d.left, 0.84, K, K, 0.72);
          side(d.right, 2.88, Y, 'FFF6D6', 0.96);
        },
        async (d) => { // the page cut down the middle, each half keeping its own rhythm
          const s = await open('bandV', C.muted, 0.6, 3.8);
          T(s, d.title, 0.6, 0.38, 3.8, 1.25, { valign: 'top', max: 22 });
          const side = (sd, x, w, y0, c, b) => {
            h3(s, sd.h, x, y0, w, 0.5, { color: c, max: 19, min: 13, valign: 'middle' });
            const hh = (5.15 - y0 - 0.6) / sd.items.length;
            sd.items.forEach((it, j) => { const y = y0 + 0.6 + j * hh; t.line(s, x, y, w, 0, c, 1); p(s, it, x, y + 0.06, w, hh - 0.1, { color: b, max: 14, min: 10.5 }); });
          };
          side(d.left, 0.6, 3.8, 1.72, K, K);
          side(d.right, 5.4, 4.0, 0.42, Y, 'FFF6D6');
          no(s, 8.2, 5.2, Y, 13);
        },
      ],
      statement: [
        async (d) => { // a slogan on the black page, filling it
          const s = await open('black', Y);
          k.head(s, U(d.title), 0.6, 0.3, 7.4, 0.42, { max: 13, min: 10.5, color: 'FFF6D6', valign: 'top', spacing: 1 });
          k.head(s, L.runs(U(d.text)), 0.6, 0.8, 8.8, 3.05, { max: 44, min: 20, color: Y, valign: 'top' });
          if (d.caption) p(s, d.caption, 0.6, 3.95, 7.2, 1.2, { color: 'FFF6D6', max: 12.5, min: 10 });
          no(s, 8.2, 4.45, Y, 40);
        },
        async (d) => { // the sun has climbed into the corner, the words stand below it
          const s = await open('corner');
          T(s, d.title, 0.6, 0.4, 5.9, 0.7, { max: 15, min: 11, valign: 'top' });
          k.head(s, L.runs(d.text), 0.6, 1.2, 6.8, 2.65, { max: 34, min: 17, color: K, valign: 'middle' });
          t.line(s, 0.6, 3.92, 6.8, 0, K, 2);
          if (d.caption) p(s, d.caption, 0.6, 4.0, 6.8, 1.18, { max: 12, min: 10 });
          no(s, 8.2, 4.5);
        },
      ],
      timeline: [
        async (d) => { // the black page, years leaping over and under one line
          const s = await open('black', Y), xs = [0.6, 2.4, 4.8, 6.2], ws = [3.9, 3.2, 3.9, 3.2], ly = 3.14;
          T(s, d.title, 0.6, 0.3, 7.5, 0.8, { color: Y, max: 22 });
          no(s, 8.2, 0.3, Y);
          t.line(s, 0.6, ly, 8.8, 0, Y, 1.5);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], w = ws[i], y = up ? 1.28 : ly + 0.1;
            t.oval(s, x, ly - 0.07, 0.14, 0.14, Y);
            k.head(s, it.year, x, y, w, 0.5, { max: 26, min: 14, color: Y, valign: 'bottom' });
            h3(s, it.h, x, y + 0.5, w, 0.28, { color: Y, max: 12 });
            p(s, it.t, x, y + 0.78, w, 1.02, { color: 'FFF6D6', max: 11.5 });
          });
        },
        async (d) => { // the years swap ends row by row
          const s = await open(), rh = 0.97;
          T(s, d.title, 0.6, 0.3, 7.5, 0.82, { max: 24 });
          no(s, 8.2, 0.3);
          d.items.forEach((it, i) => {
            const y = 1.22 + i * rh, flip = i % 2 === 1, align = flip ? 'right' : 'left';
            t.line(s, 0.6, y, 8.8, 0, K, 1.5);
            k.head(s, it.year, flip ? 6.2 : 0.6, y + 0.04, 3.2, rh - 0.08, { max: 34, min: 18, color: K, align });
            h3(s, it.h, flip ? 0.6 : 4.0, y + 0.07, 5.4, 0.28, { align, max: 13 });
            p(s, it.t, flip ? 0.6 : 4.0, y + 0.36, 5.4, rh - 0.4, { align, max: 11.5 });
          });
        },
        async (d) => { // four banners: every year stood on end beside its words
          const s = await open();
          T(s, d.title, 0.6, 0.32, 7.5, 0.82, { max: 24 });
          no(s, 8.2, 0.32);
          d.items.forEach((it, i) => {
            const x = 0.6 + i * 2.24;
            k.head(s, it.year, x + 0.28 - 1.85, 3.2 - 0.3, 3.7, 0.6, { max: 32, min: 16, color: K, rotate: 270, align: 'left', valign: 'middle' });
            h3(s, it.h, x + 0.68, 1.35, 1.5, 0.5, { max: 12 });
            p(s, it.t, x + 0.68, 1.87, 1.5, 3.28, { max: 11.5 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // nor the first process the rows of the cards
    R.stats = V.stats.shift(); // nor the first numbers
    R.timeline = V.timeline.shift(); // nor the first timeline
    return V;
  },
  tone: "baland ovoz: shiorga yaqin, quvnoq va qisqa" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "energetic"], "transitions": ["p14:ferris|dir=\"l\"", "fade", "zoom"], "cover": ["wheel", "popOver"], "mark": "wheel", "deco": "wheel4", "sig": {"title": "popOver", "body": "fadeUp", "item": "wheel", "image": "wheel4", "number": "wheel", "order": "centerOut", "stagger": 0.16}, "tempo": 1.0, "kenburns": true};
