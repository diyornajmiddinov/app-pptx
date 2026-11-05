/** 168 Qor — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 168, slug: 'qor', name: "Qor", mode: 'top', list: 'rows', num: 'corner', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '1F2A33', muted: '6A7781', accent: '3E7CB1' }, photo: { r: 0.04 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('FFFFFF'), rad(1600,900,1100,[[0,'E3EDF5',1],[1,'FFFFFF',0]])),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in snow: a lot of clean white, crystals of six sides, icicles hanging from the edge, a dashed track: a deck's pages must not look alike (L.pages)
    const foot = (s, o = {}) => k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: C.muted, ...o });
    const open = async (d, x, y, w, h, o = {}) => { const s = await slide('page'); if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 13, color: C.ink, valign: 'top', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.15, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 60, min: 18, color: C.accent, ...o });
    const lineH = (s, x, y, w) => t.line(s, x, y, w, 0, C.accent, 0.75);
    const lineV = (s, x, y, h) => t.line(s, x, y, 0, h, C.accent, 0.75);
    const track = (s, x, y, w, h) => t.line(s, x, y, w, h, C.accent, 1, { dash: 'dash' }); // a track left in the snow
    const flake = (s, cx, cy, r) => { lineV(s, cx, cy - r, 2 * r); [[0.866, 0.5]].forEach(([c, e]) => { t.line(s, cx - c * r, cy - e * r, 2 * c * r, 2 * e * r, C.accent, 0.75); t.line(s, cx - c * r, cy - e * r, 2 * c * r, 2 * e * r, C.accent, 0.75, { flipV: true }); }); };
    const hex = (x, y, w, h) => `M${x + w * 0.25},${y} L${x + w * 0.75},${y} L${x + w},${y + h / 2} L${x + w * 0.75},${y + h} L${x + w * 0.25},${y + h} L${x},${y + h / 2} Z `;
    const V = {
      image: [
        async (d) => { // the picture seen through a cluster of ice crystals
          const s = await page(d), a = 0.56, b = 0.49;
          t.img(s, await L.photo(L.src(d.image), 4.0, 3.45, { mask: { path: hex(0, 0.25, a, b) + hex(0.44, 0, a, b) + hex(0.44, 0.51, a, b) } }), 5.3, 1.72, 4.0, 3.45, { alt: '' });
          p(s, d.text, 0.7, 1.95, 4.35, 3.2, { max: 13.5, valign: 'middle' });
        },
        async (d) => { // snow has drifted over the lower edge of a wide picture
          const s = await open({}, 0, 0, 0, 0);
          t.img(s, await L.photo(L.src(d.image), 10, 2.95, { mask: { path: 'M0,0 L1,0 L1,0.82 C0.8,1 0.62,0.74 0.42,0.88 S0.12,0.98 0,0.8 Z' } }), 0, 0, 10, 2.95, { alt: '' });
          k.head(s, d.title, 0.7, 3.02, 2.75, 2.15, { max: 22, min: 13, color: C.ink, valign: 'top' });
          p(s, d.text, 3.7, 3.05, 5.6, 2.12, { max: 13.5, ls: 1.1 });
        },
        async (d) => { // the picture fills the page, a clean white column stands on it
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625);
          t.rect(s, 0.7, 0, 4.9, 5.625, 'FFFFFF', { name: 'Snow column' });
          k.head(s, d.title, 1.0, 0.45, 4.3, 1.25, { max: 26, min: 14, color: C.ink, valign: 'bottom' });
          lineH(s, 1.0, 1.8, 0.9);
          p(s, d.text, 1.0, 1.92, 4.3, 3.28, { max: 14, ls: 1.12 });
          k.txt(s, String(k.idx).padStart(2, '0'), 4.7, 0.18, 0.6, 0.3, { size: 9, color: C.muted, align: 'right' });
          k.foot(s, { x: 1.0, w: 4.3, y: 5.3, size: 7.5, color: C.muted });
        },
        async (d) => { // a picture hanging from the top edge, ending in icicles
          const s = await open(d, 0.7, 0.4, 5.0, 1.4, { max: 26, valign: 'bottom' });
          t.img(s, await L.photo(L.src(d.image), 3.3, 4.75, { mask: { poly: [[0, 0], [1, 0], [1, 0.8], [0.9, 0.92], [0.78, 0.78], [0.62, 1], [0.46, 0.82], [0.3, 0.94], [0.16, 0.78], [0, 0.88]] } }), 6.0, 0, 3.3, 4.75, { alt: '' });
          lineH(s, 0.7, 1.9, 0.9);
          p(s, d.text, 0.7, 2.02, 5.0, 3.13, { max: 14 });
        },
      ],
      cards: [
        async (d) => { // a snowflake at the centre, the items round it
          const s = await page(d), n = d.items.length, w = 3.45, cx = 5, cy = n === 3 ? 2.75 : 3.2, hh = 1.5;
          flake(s, cx, cy, 0.42);
          for (const [i, it] of d.items.entries()) {
            const low = i > 1, wide = n === 3 && low, right = i % 2 === 1, ww = wide ? 5.4 : w, x = wide ? 2.3 : right ? 5.85 : 0.7, y = low ? (wide ? 3.72 : 3.62) : 1.95, a = wide ? 'center' : right ? 'left' : 'right', ix = wide ? 4.86 : right ? x : x + w - 0.28;
            t.img(s, await L.icon(it.icon, C.accent, 1.75), ix, y, 0.28, 0.28);
            h3(s, it.h, wide ? x : right ? x + 0.36 : x, wide ? y + 0.28 : y - 0.02, wide ? ww : ww - 0.36, 0.32, { max: 13.5, align: a, valign: 'middle' });
            p(s, it.t, x, y + (wide ? 0.6 : 0.32), ww, hh - (wide ? 0.72 : 0.36), { max: 12.5, ls: 1.05, align: a, color: C.muted });
          }
        },
        async (d) => { // icicles from the page's top edge, an item under each; the title goes to the foot
          const s = await open(d, 0.7, 4.22, 8.6, 0.95, { max: 26, valign: 'middle' }), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, ys = n === 4 ? [0.55, 0.95, 0.35, 0.75] : [0.55, 0.95, 0.35];
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = ys[i];
            lineV(s, x, 0, y + 0.3);
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x + 0.1, y, 0.3, 0.3);
            h3(s, it.h, x + 0.1, y + 0.36, w - 0.1, 0.5, { max: 14 });
            p(s, it.t, x + 0.1, y + 0.88, w - 0.1, 4.15 - y - 0.88, { max: 13, ls: 1.08, color: C.muted });
          }
        },
        async (d) => { // a row of small crystals with wide air between them, the words centred under each
          const s = await page(d), n = d.items.length, gap = n === 4 ? 0.5 : 0.7, w = (8.6 - gap * (n - 1)) / n, W2 = 0.86, H2 = 0.74;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), cx = x + w / 2;
            t.shape(s, 'HEXAGON', { x: cx - W2 / 2, y: 1.92, w: W2, h: H2, fill: { type: 'none' }, line: { color: C.accent, width: 1 }, objectName: 'Crystal' });
            t.img(s, await L.icon(it.icon, C.accent, 1.75), cx - 0.17, 2.12, 0.34, 0.34);
            h3(s, it.h, x, 2.72, w, 0.5, { max: 14, align: 'center' });
            p(s, it.t, x, 3.24, w, 1.92, { max: 13, ls: 1.08, align: 'center', color: C.muted });
          }
        },
        async (d) => { // footprints crossing the field, the items on either side of the track
          const s = await open(d, 0.7, 0.3, 8.0, 0.9, { max: 26, valign: 'middle' }), n = d.items.length, hh = 3.95 / n, w = 5.0, sx = (8.6 - w) / (n - 1);
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * sx, y = 1.22 + i * hh;
            if (i < n - 1) { track(s, x + 0.14, y + 0.34, 0, hh - 0.18); track(s, x + 0.14, y + hh + 0.16, sx - 0.2, 0); } // down the margin, then on to the next stop: never through the words
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x, y + 0.02, 0.28, 0.28);
            h3(s, it.h, x + 0.38, y, w - 0.38, 0.32, { max: 14, valign: 'middle' });
            p(s, it.t, x + 0.38, y + 0.32, w - 0.38, hh - 0.36, { max: 12.5, ls: 1.03, color: C.muted });
          }
        },
      ],
      process: [
        async (d) => { // a ski run: each column starts lower down the slope
          const s = await page(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, drop = n === 4 ? 0.2 : 0.3;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = 1.82 + i * drop;
            big(s, String(i + 1), x, y, w, 0.62, { max: 36, min: 20, valign: 'middle' });
            lineH(s, x, y + 0.64, w);
            h3(s, st.h, x, y + 0.7, w, 0.5, { max: 13.5 });
            p(s, st.t, x, y + 1.2, w, 5.16 - y - 1.2, { max: 13, ls: 1.05 });
          });
        },
        async (d) => { // a dashed track down the left, a stop for each step
          const s = await page(d), n = d.steps.length, hh = 3.2 / n;
          track(s, 0.82, 1.98, 0, 3.15);
          d.steps.forEach((st, i) => {
            const y = 1.95 + i * hh;
            t.oval(s, 0.72, y + 0.06, 0.2, 0.2, 'FFFFFF', { line: { color: C.accent, width: 1.25 }, name: 'Stop' });
            h3(s, `${i + 1}.  ${st.h}`, 1.15, y, 8.15, 0.32, { max: 14.5, valign: 'middle' });
            p(s, st.t, 1.15, y + 0.32, 8.15, hh - 0.36, { max: 13, ls: 1.03, color: C.muted });
          });
        },
        async (d) => { // a track across the field: steps above and below it, by turn
          const s = await open(d, 0.7, 0.3, 8.0, 0.8, { max: 26, valign: 'middle' }), n = d.steps.length, ly = 3.08, w = n === 4 ? 3.8 : 4.2, xs = n === 4 ? [0.7, 1.15, 5.05, 5.5] : [0.7, 3.0, 5.1];
          track(s, 0, ly, 10, 0);
          d.steps.forEach((st, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.15 : ly + 0.22;
            t.oval(s, x, ly - 0.08, 0.16, 0.16, C.accent);
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.34, { max: 14, valign: 'middle' });
            p(s, st.t, x, y + 0.35, w, up ? 1.42 : 1.42, { max: 13, ls: 1.08 });
          });
        },
        async (d) => { // the title alone on white at the left, the steps ruled on the right
          const s = await open(d, 0.7, 0.45, 3.1, 3.2, { max: 28 }), n = d.steps.length, hh = 4.65 / n;
          d.steps.forEach((st, i) => {
            const y = 0.5 + i * hh;
            if (i) lineH(s, 4.2, y - 0.03, 5.1);
            big(s, String(i + 1), 4.2, y, 0.7, hh - 0.1, { max: 36, min: 22, valign: 'top' });
            h3(s, st.h, 4.95, y + 0.03, 4.35, 0.34, { max: 14.5, valign: 'middle' });
            p(s, st.t, 4.95, y + 0.37, 4.35, hh - 0.45, { max: 13, ls: 1.05, color: C.muted });
          });
        },
      ],
      stats: [
        async (d) => { // one number across the white, the others small at its right
          const s = await page(d), [a, ...rest] = d.stats;
          big(s, a.value, 0.7, 1.85, 5.3, 1.8, { max: 88, min: 28, valign: 'middle' });
          p(s, a.label, 0.7, 3.65, 5.0, 0.6, { max: 14 });
          lineV(s, 6.2, 1.98, 3.15);
          rest.forEach((x, i) => {
            const y = 1.95 + i * 0.98;
            k.head(s, x.value, 6.42, y, 2.88, 0.5, { max: 26, min: 14, color: C.ink });
            p(s, x.label, 6.42, y + 0.5, 2.88, 0.45, { max: 11.5, min: 9.5, color: C.muted, ls: 1.03 });
          });
          if (d.note) p(s, d.note, 0.7, 4.28, 5.2, 0.88, { max: 10.5, min: 9, color: C.muted, ls: 1.03 });
          if (!d.note) lineH(s, 0.7, 4.4, 0.9);
        },
        async (d) => { // three thin ice crystals with the numbers inside
          const s = await open(d, 0.7, 0.3, 8.0, 0.85, { max: 26, valign: 'middle' }), cw = 8.6 / 3, W2 = 2.25, H2 = 1.95;
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * cw + (cw - W2) / 2;
            t.shape(s, 'HEXAGON', { x: xx, y: 1.2, w: W2, h: H2, fill: { type: 'none' }, line: { color: C.accent, width: 1 }, objectName: 'Crystal' });
            big(s, x.value, xx + 0.3, 1.65, W2 - 0.6, 1.05, { max: 30, min: 12, align: 'center', valign: 'middle' });
            p(s, x.label, 0.7 + i * cw + 0.1, 3.22, cw - 0.2, 0.68, { max: 12.5, ls: 1.05, align: 'center' });
          });
          if (d.note) p(s, d.note, 0.7, 3.98, 8.6, 1.18, { max: 12, min: 9.5, color: C.muted, ls: 1.08, align: 'center', valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // mirrored about a dashed track
          const s = await page(d), w = 3.95, cx = 5;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.12, 2.6);
          k.head(s, d.left.h, 0.7, 1.9, w, 0.48, { max: 18, min: 12, color: C.accent, align: 'right' }); k.head(s, d.right.h, 5.35, 1.9, w, 0.48, { max: 18, min: 12, color: C.ink });
          track(s, cx, 1.95, 0, 3.2);
          let y = 2.46;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // a field and the one below it, each named in the left margin
          const s = await open(d, 0.7, 0.3, 8.0, 0.8, { max: 26, valign: 'middle' }), hh = 1.98;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.18 + i * hh;
            lineH(s, 0.7, y, 8.6);
            k.head(s, side.h, 0.7, y + 0.1, 2.4, hh - 0.2, { max: 20, min: 12, color: i ? C.ink : C.accent, valign: 'top' });
            const a = side.items.filter((_, j) => j % 2 === 0), b = side.items.filter((_, j) => j % 2), { rows, fs } = L.rowsFit([a, b], 13.5, 2.95, F.body, 0.1, hh - 0.2);
            side.items.forEach((it, j) => k.txt(s, it, 3.25 + (j % 2) * 3.1, y + 0.1 + (j > 1 ? rows[0] : 0), 2.95, rows[Math.floor(j / 2)], { size: fs, color: C.ink }));
          });
        },
      ],
      statement: [
        async (d) => { // the note and title small at the top left, the thought far down on the right
          const s = await open({}, 0, 0, 0, 0);
          k.head(s, d.title, 0.7, 0.4, 3.4, 1.1, { max: 15, min: 11, color: C.accent, valign: 'top' });
          if (d.caption) p(s, d.caption, 0.7, 1.55, 3.0, 3.6, { max: 12, min: 9.5, color: C.muted, ls: 1.08 });
          k.head(s, L.runs(d.text), 4.0, 0.6, 5.3, 4.55, { max: 36, min: 16, color: C.ink, align: 'right', valign: 'bottom' });
        },
        async (d) => { // the polar night: the one dark page, a flake over the words
          const s = await slide('page'), ICE = 'DCEAF5';
          t.rect(s, 0, 0, 10, 5.625, '14344F', { name: 'Polar night' });
          t.line(s, 5, 0.3, 0, 0.7, ICE, 0.75); t.line(s, 4.7, 0.47, 0.6, 0.35, ICE, 0.75); t.line(s, 4.7, 0.47, 0.6, 0.35, ICE, 0.75, { flipV: true });
          k.head(s, d.title, 1.0, 1.05, 8.0, 0.42, { max: 14, min: 10.5, color: ICE, align: 'center', bold: false });
          k.head(s, L.runs(d.text), 1.0, 1.5, 8.0, 2.2, { max: 34, min: 16, color: 'FFFFFF', align: 'center' });
          if (d.caption) p(s, d.caption, 1.3, 3.8, 7.4, 1.35, { max: 13, min: 10, color: ICE, align: 'center', ls: 1.08 });
          k.txt(s, String(k.idx).padStart(2, '0'), 9.05, 0.18, 0.6, 0.3, { size: 9, color: ICE, align: 'right' });
          foot(s, { color: ICE });
        },
      ],
      timeline: [
        async (d) => { // years set clean over a long rule
          const s = await page(d), gap = 0.28, w = (8.6 - gap * 3) / 4;
          lineH(s, 0.7, 2.5, 8.6);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            big(s, it.year, x, 1.9, w, 0.56, { max: 24, min: 12, valign: 'bottom' });
            h3(s, it.h, x, 2.58, w, 0.5, { max: 14 });
            p(s, it.t, x, 3.1, w, 2.05, { max: 13, ls: 1.05 });
          });
        },
        async (d) => { // a dashed track down the middle of the field, events on each side
          const s = await open(d, 0.7, 0.3, 8.0, 0.82, { max: 26, valign: 'middle' }), w = 4.0, cx = 5, Y = [1.2, 1.62, 3.2, 3.62], M = [1.28, 2.1, 3.28, 4.1];
          track(s, cx, 1.2, 0, 3.95);
          d.items.forEach((it, i) => {
            const right = i % 2 === 1, x = right ? cx + 0.28 : cx - 0.28 - w, a = right ? 'left' : 'right', y = Y[i];
            t.oval(s, cx - 0.09, M[i], 0.18, 0.18, C.accent);
            big(s, it.year, x, y, w, 0.42, { max: 20, min: 11, align: a, valign: 'middle' });
            h3(s, it.h, x, y + 0.42, w, 0.32, { max: 14, align: a, valign: 'middle' });
            p(s, it.t, x, y + 0.74, w, 0.78, { max: 12, min: 10, ls: 1.03, align: a, color: C.muted });
          });
        },
        async (d) => { // four plots of snow, a rule on top of each, the second row set in
          const s = await page(d), w = 3.95, hh = 1.6;
          d.items.forEach((it, i) => {
            const x = (i < 2 ? 0.7 : 1.05) + (i % 2) * (w + 0.3), y = 1.92 + Math.floor(i / 2) * (hh + 0.03);
            lineH(s, x, y, w);
            big(s, it.year, x, y + 0.05, 1.7, 0.42, { max: 19, min: 11, valign: 'middle' });
            h3(s, it.h, x + 1.75, y + 0.05, w - 1.75, 0.42, { max: 12.5, min: 10, align: 'right', valign: 'middle' });
            p(s, it.t, x, y + 0.5, w, hh - 0.54, { max: 12.5, ls: 1.05 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old rows look like the cards
    R.timeline = V.timeline.shift(); // and so do the old timeline rows
    return V;
  },
  tone: "toza va tiniq: oddiy so'zlar, ochiq tuzilma" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["dissolve", "fade", "p14:shred|pattern=\"rectangle\" dir=\"in\""], "cover": ["fadeLetters", "fadeWords"], "mark": "diamond", "deco": "dissolve", "sig": {"title": "fadeLetters", "body": "fade", "item": "dissolve", "image": "focusIn", "number": "diamond", "order": "diagonal", "stagger": 0.24}, "tempo": 1.35, "kenburns": true};
