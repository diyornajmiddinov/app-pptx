/** 198 Pista — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
// a pistachio orchard: garden beds, a hill, soil, a stem with its leaves, tree rings; pictures in leaf and nut shapes (160 px = 1 inch)
const BASE = () => [flat('EEF3DD'), rad(1600,0,800,[[0,'DCE8B8',0.9],[1,'EEF3DD',0]])];
const leaf = (x, y, s, r, c) => `<path transform="translate(${x},${y}) rotate(${r}) scale(${s})" d="M0,0 C20,-26 62,-26 84,0 C62,26 20,26 0,0 Z" fill="#${c}"/>`;
const beds = (n) => raw(Array.from({ length: n }, (_, i) => (i % 2 ? '' : `<rect x="${(i * 1600) / n}" y="0" width="${1600 / n}" height="640" fill="#DDE8BC"/>`)).join(''));
module.exports = B({ id: 198, slug: 'pista', name: "Pista", mode: 'bottom', list: 'cols', num: 'corner', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '2E3A1F', muted: '63704F', accent: '6B8E23' }, photo: { r: 0.08 }, rule: true, caps: false, bold: true,
  bg: (kind) => kind === 'deep' ? compose(lin([[0,'2E3A1F'],[1,'37481F']]))
    : kind === 'bed3' ? compose(flat('EEF3DD'), beds(3))
    : kind === 'bed4' ? compose(flat('EEF3DD'), beds(4))
    : kind === 'hill' ? compose(flat('F4F7E8'), raw('<path d="M0,630 C400,620 1000,500 1600,380 L1600,900 L0,900 Z" fill="#CFE0A0"/>'))
    : kind === 'soil' ? compose(flat('EEF3DD'), raw('<path d="M0,600 C500,570 1100,620 1600,590 L1600,900 L0,900 Z" fill="#37481F"/>'))
    : kind === 'bigleaf' ? compose(flat('EEF3DD'), raw(leaf(-120, 450, 7.2, 0, 'CFE0A0') + '<path d="M-120,450 L480,450" stroke="#EEF3DD" stroke-width="4"/>'))
    : kind === 'sprout' ? compose(flat('F4F7E8'), raw('<path d="M800,860 C790,600 810,300 800,50" stroke="#6B8E23" stroke-width="3" fill="none"/>' + [[800,700,-140],[800,520,-40],[800,340,-140],[800,160,-40]].map(([x, y, r]) => leaf(x, y, 0.55, r, '9BB84D')).join('')))
    : kind === 'vine' ? compose(flat('F4F7E8'), raw('<path d="M60,352 C500,322 1100,382 1540,352" stroke="#6B8E23" stroke-width="3" fill="none"/>' + [200, 560, 915, 1270].map((x, i) => leaf(x + 70, 350, 0.5, i % 2 ? 40 : -40, '9BB84D')).join('')))
    : kind === 'rings' ? compose(flat('EEF3DD'), raw(Array.from({ length: 7 }, (_, i) => `<circle cx="-40" cy="940" r="${190 + i * 100}" fill="none" stroke="#D4E1AE" stroke-width="${12 - i}"/>`).join('')))
    : kind === 'mid' ? compose(flat('F4F7E8'), raw('<path d="M800,0 C720,300 880,560 800,900 L1600,900 L1600,0 Z" fill="#DCE8B8"/>'))
    : kind === 'nuts' ? compose(flat('EEF3DD'), raw([320, 800, 1280].map((x) => `<ellipse cx="${x}" cy="210" rx="215" ry="140" fill="#CFE0A0"/>`).join('')))
    : kind === 'band' ? compose(flat('F4F7E8'), raw('<rect y="460" width="1600" height="440" fill="#37481F"/>'))
    : compose(...BASE()),
  ways: ({ k, t, L, C, F, slide, hair }, R) => {
    const I = C.ink, M = C.muted, A = '4F6E16', PL = 'EEF3DD', PM = 'C7D5A2', AL = 'C4DE76';
    const open = async (kind = 'page', c = M, x = 0.7, w = 8.2) => { const s = await slide(kind); k.foot(s, { x, w, y: 5.3, size: 7.5, color: c }); return s; };
    const no = (s, c = M) => k.txt(s, String(k.idx).padStart(2, '0'), 9.05, 0.18, 0.6, 0.3, { size: 9, color: c, align: 'right', font: F.body });
    const T = (s, v, x = 0.7, y = 4.05, w = 8.6, h = 1.1, o = {}) => k.head(s, v, x, y, w, h, { max: 28, min: 14, color: I, valign: 'top', ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: I, valign: 'top', ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: I, ls: 1.25, ...o });
    const V = {
      image: [
        async (d) => { // the picture in the shape of a great leaf, the title below the words
          const s = await open('page', M, 0.7, 4.7); no(s);
          await k.photo(s, d.image, 5.4, 0.35, 4.3, 4.85, { mask: { path: 'M0,1 C0,0.42 0.38,0 1,0 C1,0.58 0.62,1 0,1 Z' } });
          p(s, d.text, 0.7, 0.45, 4.7, 3.3);
          T(s, d.title, 0.7, 3.85, 4.5, 1.32, { max: 24, valign: 'bottom', color: A });
        },
        async (d) => { // the picture across the top, its edge rolling like a low hill
          const s = await open(); no(s, I);
          await k.photo(s, d.image, 0, 0, 10, 3.35, { mask: { path: 'M0,0 L1,0 L1,0.82 C0.7,1.05 0.3,0.72 0,0.95 Z' } });
          T(s, d.title, 0.7, 3.42, 3.1, 1.75, { max: 22, valign: 'bottom' });
          p(s, d.text, 4.0, 3.5, 5.3, 1.7);
        },
        async (d) => { // on deep green, the picture cut like a nut, the words in pale ink
          const s = await open('deep', PM, 4.5, 4.85); no(s, PM);
          await k.photo(s, d.image, 0.55, 0.42, 3.5, 4.72, { mask: 'circle' });
          p(s, d.text, 4.5, 0.5, 4.85, 3.25, { color: PL });
          T(s, d.title, 4.5, 3.85, 4.85, 1.3, { max: 22, color: AL, valign: 'bottom' });
        },
        async (d) => { // a tall upright picture at the right, the title growing large at its foot
          const s = await open('page', M, 0.7, 5.4); no(s);
          await k.photo(s, d.image, 6.55, 0.4, 2.85, 4.8, { mask: { r: 0.25 } });
          p(s, d.text, 0.7, 0.45, 5.4, 3.1);
          T(s, d.title, 0.7, 3.65, 5.5, 1.5, { max: 30, valign: 'bottom' });
        },
      ],
      cards: [
        async (d) => { // garden beds: every item has its own strip of ground
          const n = d.items.length, s = await open(n === 3 ? 'bed3' : 'bed4'), bw = 10 / n; no(s);
          for (const [i, it] of d.items.entries()) {
            const x = i * bw + 0.28, w = bw - 0.56;
            t.img(s, await L.icon(it.icon, A, 1.75), x, 0.42, 0.46, 0.46);
            h3(s, it.h, x, 0.98, w, 0.5, { color: A });
            p(s, it.t, x, 1.5, w, 2.45, { max: 12.5 });
          }
          T(s, d.title, 0.7, 4.14, 8.6, 1.08, { max: 28, valign: 'middle' });
        },
        async (d) => { // deep green: the title at the top for once, the items running under it line by line
          const s = await open('deep', PM), n = d.items.length, rh = 3.72 / n; no(s, PM);
          T(s, d.title, 0.7, 0.32, 8.0, 1.0, { color: AL, valign: 'bottom', max: 26 });
          for (const [i, it] of d.items.entries()) {
            const y = 1.48 + i * rh;
            t.img(s, await L.icon(it.icon, AL, 1.75), 0.7, y + 0.03, 0.42, 0.42);
            h3(s, it.h, 1.3, y + 0.03, 2.6, rh - 0.1, { color: PL });
            p(s, it.t, 4.1, y + 0.03, 5.2, rh - 0.08, { color: PL, max: 12.5 });
          }
        },
        async (d) => { // a great leaf holds the title on the left, the items in a loose block to its right
          const s = await open('bigleaf', M, 0.7, 3.0), n = d.items.length; no(s);
          T(s, d.title, 0.3, 1.75, 2.75, 2.05, { valign: 'middle', max: 21 });
          const spots = n === 4 ? [[3.8, 0.45], [6.75, 0.45], [3.8, 2.85], [6.75, 2.85]] : [[3.8, 0.45], [6.75, 1.65], [3.8, 2.85]];
          const w = 2.7;
          for (const [i, it] of d.items.entries()) {
            const [x, y] = spots[i];
            t.img(s, await L.icon(it.icon, A, 1.75), x, y, 0.38, 0.38);
            h3(s, it.h, x, y + 0.44, w, 0.48, { color: A });
            p(s, it.t, x, y + 0.92, w, 1.3, { max: 12 });
          }
        },
        async (d) => { // planted out of step: alternately high and low, the title under them on firm ground
          const s = await open(), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n; no(s);
          t.line(s, 0.7, 4.05, 8.6, 0, A, 1);
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = i % 2 ? 1.1 : 0.4, h = 3.95 - y;
            t.line(s, x, y, 0, 4.05 - y, A, 0.75);
            t.img(s, await L.icon(it.icon, A, 1.75), x + 0.14, y, 0.36, 0.36);
            h3(s, it.h, x + 0.14, y + 0.42, w - 0.14, 0.48);
            p(s, it.t, x + 0.14, y + 0.9, w - 0.14, h - 0.9, { max: 12.5 });
          }
          T(s, d.title, 0.7, 4.14, 8.6, 1.08, { max: 26, valign: 'middle' });
        },
      ],
      process: [
        async (d) => { // a shoot growing upward: the first step at the root, the last at the tip
          const s = await open('sprout', M, 0.7, 3.8), n = d.steps.length; no(s);
          const spots = n === 4 ? [[0.7, 3.95, 'right'], [5.4, 2.8, 'left'], [0.7, 1.65, 'right'], [5.4, 0.45, 'left']] : [[5.4, 3.75, 'left'], [0.7, 2.15, 'right'], [5.4, 0.5, 'left']];
          T(s, d.title, 0.7, 0.38, 3.9, n === 4 ? 1.2 : 1.6, { max: 22, color: A });
          d.steps.forEach((st, i) => {
            const [x, y, al] = spots[i];
            h3(s, `${i + 1}.  ${st.h}`, x, y, 3.9, 0.3, { align: al, color: A });
            p(s, st.t, x, y + 0.31, 3.9, 0.9, { align: al, max: 12 });
          });
        },
        async (d) => { // above the soil the words, in the soil the numerals, the title buried with them
          const s = await open('soil', PM), n = d.steps.length, gap = 0.34, w = (8.6 - gap * (n - 1)) / n; no(s);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            h3(s, st.h, x, 0.4, w, 0.5, { color: A });
            p(s, st.t, x, 0.92, w, 2.62, { max: 13 });
            k.head(s, String(i + 1), x, 3.82, w, 0.62, { max: 34, min: 22, color: AL, valign: 'top' });
          });
          T(s, d.title, 0.7, 4.45, 8.6, 0.75, { color: PL, max: 22, valign: 'middle' });
        },
        async (d) => { // on deep green: a path that turns back on itself
          const s = await open('deep', PM), n = d.steps.length, w = 3.75; no(s, PM);
          T(s, d.title, 0.7, 0.25, 8.0, 0.82, { color: AL, valign: 'bottom', max: 24 });
          const pos = n === 4 ? [[0.7, 1.25], [5.55, 1.25], [5.55, 3.25], [0.7, 3.25]] : [[0.7, 1.25], [5.55, 1.25], [3.1, 3.25]];
          const arrow = (v, x, y) => k.txt(s, v, x, y, 0.6, 0.5, { size: 22, bold: true, color: AL, font: F.head, align: 'center', valign: 'middle' });
          arrow('→', 4.7, 1.8);
          arrow('↓', 7.1, 2.7);
          if (n === 4) arrow('←', 4.7, 3.8);
          d.steps.forEach((st, i) => {
            const [x, y] = pos[i];
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.32, { color: AL });
            p(s, st.t, x, y + 0.34, w, 1.1, { color: PL, max: 12.5 });
          });
        },
        async (d) => { // up the side of a hill, each step standing higher, the title on the slope
          const s = await open('hill', I), n = d.steps.length, w = n === 4 ? 2.04 : 2.75, sx = n === 4 ? 2.19 : 2.95, tops = n === 4 ? [1.9, 1.32, 0.76, 0.3] : [1.75, 1.0, 0.32]; no(s);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * sx, y = tops[i];
            k.head(s, String(i + 1), x, y, 0.6, 0.5, { max: 26, min: 18, color: A, valign: 'top' });
            h3(s, st.h, x + 0.42, y + 0.04, w - 0.42, 0.46);
            p(s, st.t, x, y + 0.52, w, 1.25, { max: 11.5, ls: 1.15 });
          });
          T(s, d.title, 0.7, 4.2, 8.6, 1.0, { max: 26, valign: 'middle' });
        },
      ],
      stats: [
        async (d) => { // deep green, the first figure huge over the title
          const s = await open('deep', PM), [a, ...rest] = d.stats; no(s, PM);
          k.head(s, a.value, 0.7, 0.3, 5.3, 1.85, { max: 88, min: 40, color: AL, valign: 'bottom' });
          p(s, a.label, 0.7, 2.2, 5.0, 0.62, { color: PL, max: 15, min: 11 });
          rest.forEach((x, i) => {
            const y = 0.5 + i * 1.2;
            k.head(s, x.value, 6.3, y, 3.0, 0.6, { max: 30, min: 16, color: PL, valign: 'top' });
            p(s, x.label, 6.3, y + 0.6, 3.0, 0.55, { color: PM, max: 12 });
          });
          if (d.note) p(s, d.note, 0.7, 2.92, 8.6, 1.12, { color: PM, max: 12, min: 9.5 });
          T(s, d.title, 0.7, 4.14, 8.6, 1.06, { color: PL, valign: 'middle', max: 26 });
        },
        async (d) => { // three nuts in a row, a figure in each shell
          const s = await open('nuts'); no(s);
          d.stats.forEach((x, i) => {
            const c = [2, 5, 8][i];
            k.head(s, x.value, c - 1.1, 0.72, 2.2, 0.72, { max: 30, min: 16, color: I, align: 'center' });
            p(s, x.label, c - 1.35, 2.25, 2.7, 0.72, { align: 'center', max: 12.5, color: I });
          });
          if (d.note) p(s, d.note, 0.7, 3.02, 8.6, 1.02, { color: M, align: 'center', max: 12, min: 10 });
          T(s, d.title, 0.7, 4.14, 8.6, 1.06, { align: 'center', valign: 'middle', max: 26 });
        },
      ],
      compare: [
        async (d) => { // the two halves of a leaf, the rib winding between them
          const s = await open('mid'); no(s);
          const side = (sd, x, w, c) => {
            k.head(s, sd.h, x, 0.38, w, 0.5, { max: 19, min: 12, color: c });
            const hh = 3.0 / sd.items.length;
            sd.items.forEach((it, j) => { hair(s, x, 0.96 + j * hh, w); p(s, it, x, 1.02 + j * hh, w, hh - 0.08, { max: 14, min: 10.5 }); });
          };
          side(d.left, 0.7, 3.7, A);
          side(d.right, 5.6, 3.7, I);
          T(s, d.title, 0.7, 4.14, 8.6, 1.06, { valign: 'middle', max: 26 });
        },
        async (d) => { // the crop above, the soil below: two layers, the title first
          const s = await open('band', PM); no(s);
          T(s, d.title, 0.7, 0.25, 8.0, 0.6, { valign: 'middle', max: 20, color: A });
          const lay = (sd, y, hc, b, rh) => {
            k.head(s, sd.h, 0.7, y, 2.45, 1.45, { max: 19, min: 12, color: hc, valign: 'top' });
            sd.items.forEach((it, j) => p(s, it, 3.3 + (j % 2) * 3.1, y + (j >> 1) * rh, 2.95, rh - 0.05, { color: b, max: 13, min: 10.5 }));
          };
          lay(d.left, 0.92, I, I, 0.9);
          lay(d.right, 3.05, AL, PL, 1.06);
        },
      ],
      statement: [
        async (d) => { // deep green, the words high, the title at the foot with the caption beside it
          const s = await open('deep', PM); no(s, PM);
          k.head(s, L.runs(d.text), 0.7, 0.35, 8.6, 3.35, { max: 40, min: 18, color: PL, valign: 'top' });
          t.line(s, 0.7, 3.8, 8.6, 0, AL, 0.75);
          T(s, d.title, 0.7, 3.92, 2.9, 1.28, { color: AL, max: 18, min: 11 });
          if (d.caption) p(s, d.caption, 3.8, 3.92, 5.5, 1.28, { color: PM, max: 12.5 });
        },
        async (d) => { // the great leaf holds the title, the words stand free to its right with the caption under them
          const s = await open('bigleaf', M, 3.8, 5.5); no(s);
          T(s, d.title, 0.3, 1.75, 2.75, 2.05, { valign: 'middle', max: 19, min: 12 });
          k.head(s, L.runs(d.text), 3.8, 0.4, 5.5, 3.0, { max: 30, min: 16, color: I, valign: 'middle' });
          t.line(s, 3.8, 3.48, 1.4, 0, A, 1);
          if (d.caption) p(s, d.caption, 3.8, 3.58, 5.5, 1.6, { max: 12.5 });
        },
      ],
      timeline: [
        async (d) => { // tree rings spread from the corner: each year a ring further out
          const s = await open('rings', M), rh = 0.87; no(s);
          d.items.forEach((it, i) => {
            const y = 0.35 + i * rh, x = 3.3 + i * 0.28, w = 9.35 - x - 1.7;
            k.head(s, it.year, x, y, 1.6, rh - 0.1, { max: 19, min: 11.5, color: A, valign: 'top' });
            h3(s, it.h, x + 1.7, y, w, 0.28, { max: 13 });
            p(s, it.t, x + 1.7, y + 0.28, w, rh - 0.32, { max: 11.5, ls: 1.1, min: 9.5 });
          });
          T(s, d.title, 0.7, 3.95, 4.2, 1.22, { max: 24, valign: 'bottom' });
        },
        async (d) => { // a vine across the page: leaves on it, the year above each leaf, the event under
          const s = await open('vine'), w = 1.98, gap = 0.226; no(s);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, it.year, x, 0.95, w, 0.95, { max: 24, min: 13, color: A, valign: 'bottom' });
            h3(s, it.h, x, 2.68, w, 0.3, { max: 13 });
            p(s, it.t, x, 2.98, w, 1.42, { max: 11.5, ls: 1.15 });
          });
          T(s, d.title, 0.7, 0.28, 8.0, 0.65, { valign: 'middle', max: 22 });
          
        },
        async (d) => { // deep green, a brick pattern of four plots
          const s = await open('deep', PM), w = 3.95; no(s, PM);
          d.items.forEach((it, i) => {
            const x = i % 2 ? 5.35 : 0.7, y = (i >> 1) * 1.85 + (i % 2 ? 0.75 : 0.35);
            k.head(s, it.year, x, y, w, 0.5, { max: 24, min: 14, color: AL, valign: 'top' });
            h3(s, it.h, x, y + 0.52, w, 0.3, { color: PL, max: 13 });
            p(s, it.t, x, y + 0.82, w, 0.82, { color: PM, max: 12 });
          });
          T(s, d.title, 0.7, 4.14, 4.3, 1.06, { color: PL, valign: 'middle', max: 20 });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // nor the first process the columns of the cards
    R.timeline = V.timeline.shift(); // nor the first timeline
    return V;
  },
  tone: "yengil va tabiiy: sodda, tushunarli, ijobiy" });
