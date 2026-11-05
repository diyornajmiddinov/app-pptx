/** 194 Marjon — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
// marjon = coral beads: round forms, a thread, warm paper and a deep wine page. White on the old pale coral was hard to read, so the coral sits a little deeper (160 px = 1 inch)
const CORAL = () => [lin([[0,'E65F4B'],[1,'CE4340']]), grain(0.04)];
const circle = (cx, cy, r, c, o = 1) => raw(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#${c}" opacity="${o}"/>`);
const sag = (x) => 66 + 110 * (1 - Math.pow((x - 800) / 800, 2)); // the necklace in px (cards)
const hill = (x) => 300 - 90 * (1 - Math.pow((x - 800) / 800, 2)); // the arch of years in px (timeline)
const curve = (f, c, w = 2) => raw(`<path d="M${Array.from({ length: 41 }, (_, i) => `${i * 40},${f(i * 40).toFixed(1)}`).join(' L')}" fill="none" stroke="#${c}" stroke-width="${w}" opacity="0.85"/>`);
module.exports = B({ id: 194, slug: 'marjon', name: "Marjon", mode: 'narrow', list: 'rows', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFFFFF', muted: 'FFE1D6', accent: 'FFF3B0' }, photo: 'circle', rule: false, caps: false, bold: true,
  bg: (kind) => kind === 'wine' ? compose(lin([[0,'7E1E2C'],[1,'5A1320']]), grain(0.05))
    : kind === 'cream' ? compose(flat('FFF4EA'), grain(0.03))
    : kind === 'necklace' ? compose(...CORAL(), curve(sag, 'FFF3B0'))
    : kind === 'moon' ? compose(...CORAL(), circle(330, 450, 500, '7E1E2C'))
    : kind === 'halo' ? compose(...CORAL(), circle(800, 416, 400, 'FFF4EA'))
    : kind === 'twin' ? compose(...CORAL(), circle(420, 500, 350, '7E1E2C', 0.85), circle(1180, 500, 350, 'FFF4EA'))
    : kind === 'tide' ? compose(flat('FFF4EA'), raw('<path d="M0,430 C400,520 1200,520 1600,430 L1600,900 L0,900 Z" fill="#7E1E2C"/>'))
    : kind === 'arches' ? compose(flat('FFF4EA'), raw([0,1,2,3].map((i) => `<path d="M${112 + i * 352},384 a156,156 0 0 1 312,0 Z" fill="#CE4340"/>`).join('')))
    : kind === 'pearl' ? compose(flat('FFF4EA'), curve(hill, 'CE4340'))
    : compose(...CORAL()),
  ways: ({ k, t, L, C, F, slide }, R) => {
    const W = 'FFFFFF', A = C.accent, M = C.muted, WN = '7E1E2C', RD = 'B5332F', SO = '6E3B36', CR = 'FFF4EA';
    const open = async (kind = 'page', c = M, x = 2.2, w = 5.6, align = 'center') => { const s = await slide(kind); k.foot(s, { x, w, y: 5.3, size: 7.5, color: c, align }); return s; };
    const no = (s, c = M) => k.txt(s, String(k.idx).padStart(2, '0'), 9.05, 0.18, 0.6, 0.3, { size: 9, color: c, align: 'right', font: F.body });
    const T = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 26, min: 14, color: W, align: 'center', valign: 'bottom', ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: W, align: 'center', valign: 'top', ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: W, align: 'center', ls: 1.2, ...o });
    const bead = (s, x, y, dd, fill, txt, c, size = 13) => { t.oval(s, x, y, dd, dd, fill); if (txt != null) k.txt(s, String(txt), x, y, dd, dd, { size, bold: true, color: c, font: F.head, align: 'center', valign: 'middle' }); };
    const V = {
      image: [
        async (d) => { // a round picture crowning the page, everything else centred beneath
          const s = await open('page', M, 1.0, 8.0); no(s);
          await k.photo(s, d.image, 3.6, 0.22, 2.8, 2.8, { mask: 'circle' });
          T(s, d.title, 1.2, 3.05, 7.6, 0.68, { max: 22 });
          p(s, d.text, 1.1, 3.78, 7.8, 1.42, { max: 12.5 });
        },
        async (d) => { // the picture rising from the left edge like a great bead
          const s = await open('page', M, 4.6, 4.7, 'left'); no(s);
          await k.photo(s, d.image, -1.3, -0.1, 5.8, 5.8, { mask: 'circle' });
          T(s, d.title, 4.85, 0.45, 4.5, 1.25, { align: 'left' });
          p(s, d.text, 4.85, 1.82, 4.5, 3.32, { align: 'left', max: 14 });
        },
        async (d) => { // warm paper, a tall arch of picture between title and text
          const s = await open('cream', SO, 0.5, 3.0, 'left'); no(s, SO);
          await k.photo(s, d.image, 3.75, 0.45, 2.5, 4.7, { mask: { r: 1.25 } });
          T(s, d.title, 0.5, 0.6, 3.0, 4.3, { color: WN, align: 'right', valign: 'middle', max: 24, italic: true });
          p(s, d.text, 6.5, 0.5, 3.0, 4.65, { color: SO, align: 'left', valign: 'middle' });
        },
        async (d) => { // the picture dyed in wine fills the page, a narrow column of words on it
          const s = await open('wine', W); no(s, W);
          await k.photo(s, d.image, 0, 0, 10, 5.625, { duo: ['4A0F1A', 'A8434A'] });
          k.foot(s, { x: 2.2, w: 5.6, y: 5.3, size: 7.5, color: W, align: 'center' });
          T(s, d.title, 1.6, 0.4, 6.8, 1.2, { max: 28 });
          t.oval(s, 4.93, 1.7, 0.14, 0.14, A);
          p(s, d.text, 2.0, 1.95, 6.0, 3.2, { max: 13.5 });
        },
      ],
      cards: [
        async (d) => { // a necklace across the top: each item hangs from its bead, the title rests below
          const s = await open('necklace'), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n; no(s);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), c = x + w / 2, y = sag(c * 160) / 160 - 0.26;
            t.oval(s, c - 0.26, y, 0.52, 0.52, CR);
            t.img(s, await L.icon(it.icon, RD, 2), c - 0.15, y + 0.11, 0.3, 0.3);
            h3(s, it.h, x, 1.38, w, 0.5);
            p(s, it.t, x, 1.9, w, 2.25, { max: 12.5 });
          }
          T(s, d.title, 1.2, 4.2, 7.6, 1.0, { max: 28, valign: 'middle', italic: true });
        },
        async (d) => { // warm paper: a trefoil, or four set round a quiet centre
          const s = await open('cream', SO), n = d.items.length; no(s, SO);
          T(s, d.title, 1.2, 0.3, 7.6, 0.85, { color: WN });
          const w = 3.9, spots = n === 3 ? [[3.05, 1.3], [0.75, 3.2], [5.35, 3.2]] : [[0.75, 1.3], [5.35, 1.3], [0.75, 3.2], [5.35, 3.2]];
          for (const [i, it] of d.items.entries()) {
            const [x, y] = spots[i];
            t.img(s, await L.icon(it.icon, RD, 1.75), x + w / 2 - 0.17, y, 0.34, 0.34);
            h3(s, it.h, x, y + 0.38, w, 0.32, { color: WN, max: 14 });
            p(s, it.t, x, y + 0.7, w, 1.14, { color: SO, max: 12.5 });
          }
        },
        async (d) => { // the title inside a great dark bead, the items follow its curve
          const s = await open('moon', M, 4.6, 4.7, 'left'), n = d.items.length, rh = 4.9 / n; no(s);
          T(s, d.title, 0.35, 1.5, 3.0, 2.6, { valign: 'middle', max: 26, italic: true });
          const cx = 330 / 160, cy = 450 / 160, RR = 500 / 160;
          for (const [i, it] of d.items.entries()) {
            const y = 0.28 + i * rh, mid = y + rh / 2, x = cx + Math.sqrt(Math.max(0, RR * RR - (mid - cy) * (mid - cy))) + 0.3, w = 9.45 - x;
            t.img(s, await L.icon(it.icon, A, 1.75), x, y + 0.02, 0.32, 0.32);
            h3(s, it.h, x + 0.42, y, w - 0.42, 0.36, { align: 'left', valign: 'middle' });
            p(s, it.t, x, y + 0.38, w, rh - 0.42, { align: 'left', max: 12.5 });
          }
        },
        async (d) => { // wine: a thin ring round the title, the items gathered about it
          const s = await open('wine'), n = d.items.length; no(s);
          t.oval(s, 3.05, 1.62, 3.9, 2.2, null, { line: { color: A, width: 0.75 } });
          T(s, d.title, 3.5, 1.9, 3.0, 1.64, { valign: 'middle', max: 20, italic: true });
          const spots = n === 3 ? [[2.5, 0.3, 5.0], [0.4, 2.0, 2.45], [7.15, 2.0, 2.45]] : [[2.5, 0.25, 5.0], [0.4, 1.75, 2.45], [7.15, 1.75, 2.45], [2.5, 3.92, 5.0]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, w] = spots[i], wide = w > 3;
            t.img(s, await L.icon(it.icon, A, 1.75), x + w / 2 - 0.15, y, 0.3, 0.3);
            h3(s, it.h, x, y + 0.32, w, wide ? 0.3 : 0.5, { color: A, max: 13 });
            p(s, it.t, x, y + (wide ? 0.62 : 0.82), w, wide ? 0.68 : 1.6, { max: 12 });
          }
        },
      ],
      process: [
        async (d) => { // beads strung down a thread, words to either side in turn
          const s = await open(), n = d.steps.length, hh = 3.85 / n; no(s);
          T(s, d.title, 1.2, 0.25, 7.6, 0.85);
          t.line(s, 5, 1.25, 0, 3.8, A, 1);
          d.steps.forEach((st, i) => {
            const y = 1.25 + i * hh, left = i % 2 === 0, x = left ? 0.8 : 5.55, al = left ? 'right' : 'left';
            bead(s, 4.78, y, 0.44, CR, i + 1, RD, 14);
            h3(s, st.h, x, y, 3.65, 0.32, { align: al });
            p(s, st.t, x, y + 0.33, 3.65, 0.82, { align: al, max: 12 });
          });
        },
        async (d) => { // a chain of thin rings, linked, each holding its step's name
          const s = await open('cream', SO), n = d.steps.length, dd = n === 4 ? 2.3 : 2.75, sx = n === 4 ? 2.17 : 2.83, x0 = 5 - (sx * (n - 1) + dd) / 2; no(s, SO);
          T(s, d.title, 1.2, 0.25, 7.6, 0.8, { color: WN });
          d.steps.forEach((st, i) => {
            const x = x0 + i * sx, y = 1.15;
            t.oval(s, x, y, dd, dd, null, { line: { color: RD, width: 1 } });
            k.head(s, String(i + 1), x, y + dd * 0.17, dd, 0.62, { max: 34, min: 20, color: RD, align: 'center', italic: true });
            h3(s, st.h, x + 0.3, y + dd * 0.17 + 0.64, dd - 0.6, 0.55, { color: WN, max: 12.5 });
            p(s, st.t, x + 0.12, y + dd + 0.1, dd - 0.24 - (n === 4 ? 0.06 : 0), 5.18 - y - dd - 0.1, { color: SO, max: 12 });
          });
        },
        async (d) => { // a pulse on the wine page: beads rise and fall, words above and below in turn
          const s = await open('wine'), n = d.steps.length, w = n === 4 ? 2.75 : 2.9, xs = n === 4 ? [0.5, 2.5, 4.72, 6.7] : [0.5, 3.55, 6.6], hiY = 2.95, loY = 3.32; no(s);
          T(s, d.title, 1.2, 0.25, 7.6, 0.82);
          const c = (i) => xs[i] + w / 2, by = (i) => (i % 2 ? loY : hiY);
          for (let i = 0; i < n - 1; i++) { const up = by(i + 1) < by(i); t.line(s, c(i), Math.min(by(i), by(i + 1)) + 0.12, c(i + 1) - c(i), Math.abs(by(i + 1) - by(i)), A, 1, up ? { flipV: true } : {}); }
          d.steps.forEach((st, i) => {
            const low = i % 2 === 1, y = by(i), bx = c(i) - 0.2;
            bead(s, bx, y - 0.08, 0.4, A, i + 1, WN, 13);
            if (low) { h3(s, st.h, xs[i], y + 0.36, w, 0.3, { color: A }); p(s, st.t, xs[i], y + 0.66, w, 5.18 - y - 0.66, { max: 12 }); }
            else { p(s, st.t, xs[i], 1.45, w, 1.08, { max: 12, valign: 'bottom' }); h3(s, st.h, xs[i], 1.15, w, 0.3, { color: A, valign: 'bottom' }); }
          });
        },
        async (d) => { // a soft descent from the upper left, the title resting in the lower corner
          const s = await open('page', M, 4.8, 4.5, 'right'), n = d.steps.length, sx = n === 4 ? 1.58 : 2.2, sy = n === 4 ? 1.16 : 1.6, w = n === 4 ? 4.1 : 4.4; no(s);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * sx, y = 0.42 + i * sy;
            bead(s, x, y, 0.5, CR, i + 1, RD, 16);
            h3(s, st.h, x + 0.62, y, Math.min(w, 9.4 - x - 0.62), 0.3, { align: 'left' });
            p(s, st.t, x + 0.62, y + 0.31, Math.min(w, 9.4 - x - 0.62), sy - 0.34, { align: 'left', max: 12 });
          });
          T(s, d.title, 0.6, n === 4 ? 3.35 : 3.75, n === 4 ? 3.5 : 3.9, n === 4 ? 1.8 : 1.4, { align: 'left', italic: true, valign: 'bottom', max: 24 });
        },
      ],
      stats: [
        async (d) => { // one figure on a big warm bead, the other two at its sides
          const s = await open('halo', M, 0.5, 9.0), [a, b, c] = d.stats; no(s);
          k.head(s, d.title, 3.4, 0.5, 3.2, 0.95, { max: 16, min: 11, color: WN, align: 'center', valign: 'bottom', italic: true });
          k.head(s, a.value, 3.1, 1.5, 3.8, 1.25, { max: 60, min: 30, color: RD, align: 'center' });
          p(s, a.label, 3.3, 2.8, 3.4, 0.7, { color: SO, max: 13 });
          if (d.note) p(s, d.note, 3.25, 3.5, 3.5, 1.18, { color: SO, max: 10.5, min: 8.5, ls: 1.1 });
          [[b, 0.2], [c, 7.65]].forEach(([x, xx]) => { k.head(s, x.value, xx, 1.75, 2.15, 0.7, { max: 28, min: 16, color: W, align: 'center' }); p(s, x.label, xx, 2.5, 2.15, 1.1, { max: 12.5 }); });
        },
        async (d) => { // a verse on the wine page: figure and words meeting on the centre line
          const s = await open('wine'); no(s);
          T(s, d.title, 1.2, 0.25, 7.6, 0.82);
          d.stats.forEach((x, i) => {
            const y = 1.2 + i * 0.97;
            k.head(s, x.value, 0.8, y, 3.95, 0.9, { max: 48, min: 22, color: A, align: 'right', italic: true });
            p(s, x.label, 5.15, y, 4.0, 0.9, { align: 'left', valign: 'middle', max: 14 });
          });
          t.line(s, 4.95, 1.25, 0, 2.8, A, 0.75);
          if (d.note) p(s, d.note, 1.4, 4.2, 7.2, 0.98, { max: 11, min: 9.5, color: M });
        },
        async (d) => { // figures on warm paper with the title below them
          const s = await open('cream', SO); no(s, SO);
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * 3.0;
            k.head(s, x.value, xx, 0.45, 2.6, 1.15, { max: 40, min: 22, color: RD, align: 'center', valign: 'bottom', italic: true });
            p(s, x.label, xx, 1.65, 2.6, 0.75, { color: SO, max: 13 });
          });
          T(s, d.title, 1.2, 2.5, 7.6, 1.1, { color: WN, valign: 'middle', max: 28 });
          if (d.note) p(s, d.note, 1.5, 3.7, 7.0, 1.45, { color: SO, max: 12, min: 10 });
        },
      ],
      compare: [
        async (d) => { // two great beads, dark and pale, each holding its side
          const s = await open('twin', W, 3.45, 3.1); no(s);
          T(s, d.title, 1.2, 0.08, 7.6, 0.72, { max: 20 });
          const side = (sd, c, hc, tc) => {
            k.head(s, sd.h, c - 1.3, 1.2, 2.6, 0.62, { max: 15, min: 11.5, color: hc, align: 'center', italic: true, valign: 'bottom' });
            const hh = 2.72 / sd.items.length;
            sd.items.forEach((it, j) => p(s, it, c - 1.65, 1.88 + j * hh, 3.3, hh - 0.06, { color: tc, max: 13, min: 10, valign: 'middle' }));
          };
          side(d.left, 420 / 160, A, W);
          side(d.right, 1180 / 160, WN, SO);
        },
        async (d) => { // a soft tide: warm paper above, wine below, the shore curving between
          const s = await open('tide');  no(s, SO);
          T(s, d.title, 1.2, 0.2, 7.6, 0.72, { color: WN, max: 22 });
          const side = (sd, y0, hc, tc, rh) => {
            k.head(s, sd.h, 1.2, y0, 7.6, 0.36, { max: 16, min: 12, color: hc, align: 'center', italic: true });
            sd.items.forEach((it, j) => p(s, it, 0.8 + (j % 2) * 4.3, y0 + 0.38 + (j >> 1) * rh, 4.1, rh - 0.03, { color: tc, max: 12.5, min: 10 }));
          };
          side(d.left, 0.94, RD, SO, 0.62);
          side(d.right, 3.3, A, W, 0.76);
        },
      ],
      statement: [
        async (d) => { // the wine page, the words large and in italics, one bead above them
          const s = await open('wine'); no(s);
          t.oval(s, 4.9, 0.42, 0.2, 0.2, A);
          k.head(s, d.title, 1.5, 0.68, 7.0, 0.42, { max: 14, min: 10.5, color: A, align: 'center', valign: 'top' });
          k.head(s, L.runs(d.text), 1.0, 1.15, 8.0, 2.75, { max: 36, min: 18, color: W, align: 'center', italic: true });
          if (d.caption) p(s, d.caption, 1.6, 3.98, 6.8, 1.2, { color: M, max: 12.5 });
        },
        async (d) => { // the words held inside a big warm bead, title and caption beside it
          const s = await open('halo', W, 0.5, 9.0); no(s);
          k.head(s, L.runs(d.text), 3.1, 1.05, 3.8, 3.1, { max: 28, min: 14, color: WN, align: 'center', italic: true });
          T(s, d.title, 0.4, 0.6, 1.95, 3.9, { valign: 'middle', align: 'left', max: 19, min: 12 });
          if (d.caption) p(s, d.caption, 7.65, 0.6, 1.95, 3.9, { align: 'left', valign: 'middle', max: 12, min: 10 });
        },
      ],
      timeline: [
        async (d) => { // on warm paper: years as beads along a gentle arch, the events hung beneath
          const s = await open('pearl', SO), w = 2.05, gap = 0.2; no(s, SO);
          T(s, d.title, 1.2, 0.2, 7.6, 0.68, { color: WN, max: 24 });
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap), c = x + w / 2, y = hill(c * 160) / 160;
            t.oval(s, c - 0.1, y - 0.1, 0.2, 0.2, RD);
            k.head(s, it.year, x, y + 0.14, w, 0.42, { max: 20, min: 13, color: RD, align: 'center', italic: true });
            h3(s, it.h, x, y + 0.56, w, 0.3, { color: WN, max: 12.5 });
            p(s, it.t, x, y + 0.86, w, 5.18 - y - 0.86, { color: SO, max: 12 });
          });
        },
        async (d) => { // the wine page: years on the left of a thread of beads, events on the right
          const s = await open('wine'), rh = 0.97; no(s);
          T(s, d.title, 1.2, 0.2, 7.6, 0.8);
          t.line(s, 3.5, 1.15, 0, 3.95, A, 0.75);
          d.items.forEach((it, i) => {
            const y = 1.15 + i * rh;
            k.head(s, it.year, 0.5, y, 2.75, rh - 0.1, { max: 28, min: 15, color: A, align: 'right', italic: true });
            t.oval(s, 3.41, y + 0.32, 0.18, 0.18, A);
            h3(s, it.h, 3.8, y + 0.02, 5.6, 0.3, { align: 'left', max: 13 });
            p(s, it.t, 3.8, y + 0.32, 5.6, rh - 0.36, { align: 'left', max: 12 });
          });
        },
        async (d) => { // a row of coral arches, a year under each dome
          const s = await open('arches', SO), w = 2.0; no(s, SO);
          T(s, d.title, 1.2, 0.2, 7.6, 0.72, { color: WN, max: 24 });
          d.items.forEach((it, i) => {
            const x = 0.7 + i * 2.2;
            k.head(s, it.year, x + 0.1, 1.72, 1.75, 0.6, { max: 18, min: 11, color: W, align: 'center' });
            h3(s, it.h, x - 0.02, 2.5, w, 0.42, { color: WN, max: 13 });
            p(s, it.t, x - 0.02, 2.92, w, 2.24, { color: SO, max: 12.5 });
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
  tone: "jonli va samimiy: hissiyotli, qisqa iboralar" });
