/** 196 Soya — minimalist, background-driven (right composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
// light and shadow do the composing: blinds on the wall, a sundial, a window with panes, a beam in a dark room, a shadow slanting across the page (160 px = 1 inch)
const PAGE = () => [flat('F7F5F2'), raw('<polygon points="0,0 700,0 0,900" fill="#E6E2DC" opacity="0.8"/><polygon points="0,0 420,0 0,560" fill="#DCD7CF" opacity="0.6"/>')];
module.exports = B({ id: 196, slug: 'soya', name: "Soya", mode: 'right', list: 'rows', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '2A2A2A', muted: '6A6A6A', accent: 'A06A3F' }, photo: { r: 0.04 }, rule: true, caps: false, bold: true,
  bg: (kind) => kind === 'dusk' ? compose(flat('2B2926'), raw('<polygon points="1600,0 1600,900 700,900" fill="#38342F"/>'))
    : kind === 'slats' ? compose(flat('F7F5F2'), raw(Array.from({ length: 12 }, (_, i) => `<polygon points="${-300 + i * 190},900 ${-210 + i * 190},900 ${300 + i * 190},0 ${210 + i * 190},0" fill="#E7E2DA" opacity="0.8"/>`).join('')))
    : kind === 'beam' ? compose(flat('26231F'), raw('<polygon points="520,0 1080,0 1540,900 60,900" fill="#F7F1E6"/>'))
    : kind === 'slope' ? compose(flat('F7F5F2'), raw('<polygon points="0,0 640,0 330,900 0,900" fill="#33302B"/>'))
    : kind === 'slopeR' ? compose(flat('F7F5F2'), raw('<polygon points="1000,0 1600,0 1600,900 720,900" fill="#33302B"/>'))
    : kind === 'wall' ? compose(flat('D5CFC5'), raw([[496,64,496,368],[1008,64,496,368],[496,448,496,368],[1008,448,496,368]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FBF8F2"/>`).join('')))
    : kind === 'plain' ? compose(flat('F2EFEA'), raw('<polygon points="0,900 1600,120 1600,900" fill="#E3DED6"/>'))
    : kind === 'dial' ? compose(flat('F7F5F2'), raw(Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (0.05 + i * 0.09); return `<path d="M${800 - 150 * Math.cos(a)},${790 - 150 * Math.sin(a)} L${800 - 760 * Math.cos(a)},${790 - 760 * Math.sin(a)}" stroke="#DDD7CE" stroke-width="2"/>`; }).join('')))
    : kind === 'path' ? compose(flat('F7F5F2'), raw('<path d="M60,392 C440,110 1160,110 1540,392" fill="none" stroke="#A06A3F" stroke-width="1.5"/><path d="M60,392 H1540" stroke="#C9C2B7" stroke-width="1.5"/>'))
    : compose(...PAGE()),
  ways: ({ k, t, L, C, F, slide, hair }, R) => {
    const I = C.ink, M = C.muted, A = C.accent, P = 'F7F5F2', DM = 'CFC8BC', AL = 'D9A878', AD = '8A5730';
    const open = async (kind = 'page', c = M, x = 3.1, w = 6.3, align = 'right') => { const s = await slide(kind); k.foot(s, { x, w, y: 5.3, size: 7.5, color: c, align }); return s; };
    const no = (s, c = M) => k.txt(s, String(k.idx).padStart(2, '0'), 9.05, 0.18, 0.6, 0.3, { size: 9, color: c, align: 'right', font: F.body });
    const T = (s, v, x = 3.1, y = 0.45, w = 6.3, h = 0.9, o = {}) => k.head(s, v, x, y, w, h, { max: 26, min: 14, color: I, align: 'right', valign: 'bottom', ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: I, valign: 'top', ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: M, ls: 1.25, ...o });
    const cast = (s, v, x, y, w, h, o = {}) => { k.head(s, v, x + 0.06, y + 0.06, w, h, { color: 'DCD6CC', ...o }); k.head(s, v, x, y, w, h, { color: I, ...o }); }; // a figure that throws a shadow
    const V = {
      image: [
        async (d) => { // a grey picture bleeding from the left, the words to the right edge
          const s = await open('page', M, 4.8, 4.6);  no(s);
          await k.photo(s, d.image, 0, 0, 4.35, 5.625, { gray: true });
          T(s, d.title, 4.8, 0.5, 4.6, 1.3, { max: 24 });
          hair(s, 6.4, 1.92, 3.0);
          p(s, d.text, 4.8, 2.05, 4.6, 3.1, { align: 'right', color: I });
        },
        async (d) => { // in the dark room, one lit picture throws a long shadow
          const s = await open('dusk', DM, 5.25, 4.15, 'left'); no(s, DM);
          await k.photo(s, d.image, 0.75, 0.75, 3.95, 3.95, { mask: { r: 0.04 } });
          T(s, d.title, 5.25, 0.55, 4.15, 1.35, { color: P, align: 'left', max: 22 });
          p(s, d.text, 5.25, 2.0, 4.15, 3.15, { color: DM });
        },
        async (d) => { // blinds on the wall: a wide picture at top right, the title under its shade to the left
          const s = await open('slats', M, 0.5, 8.9, 'left'); no(s);
          await k.photo(s, d.image, 3.1, 0.48, 6.9, 2.47);
          T(s, d.title, 0.5, 0.5, 2.3, 4.6, { align: 'left', valign: 'bottom', max: 22 });
          p(s, d.text, 3.1, 3.12, 6.3, 2.05, { color: I });
        },
        async (d) => { // the picture seen through a slanting window
          const s = await open('plain', M, 0.5, 3.4, 'left'); no(s);
          await k.photo(s, d.image, 4.05, 0.42, 5.7, 4.75, { mask: { poly: [[0.2, 0], [1, 0], [0.8, 1], [0, 1]] } });
          T(s, d.title, 0.5, 0.45, 3.9, 1.3, { align: 'left', valign: 'top', max: 22 });
          p(s, d.text, 0.5, 1.82, 3.5, 3.35, { color: I });
        },
      ],
      cards: [
        async (d) => { // what matters stands in the light, large; the rest recede into a small column
          const s = await open('page', M, 0.6, 5.0, 'left'), [a, ...rest] = d.items, rh = 4.45 / rest.length; no(s);
          k.head(s, d.title, 0.6, 0.42, 5.2, 1.05, { max: 22, min: 13, color: A, valign: 'top' });
          t.img(s, await L.icon(a.icon, I, 1.5), 0.6, 1.62, 0.6, 0.6);
          k.head(s, a.h, 0.6, 2.3, 5.2, 0.62, { max: 26, min: 15, color: I, valign: 'top' });
          p(s, a.t, 0.6, 2.98, 5.2, 2.15, { color: I, max: 16, min: 11 });
          for (const [i, it] of rest.entries()) {
            const y = 0.55 + i * rh;
            if (i) hair(s, 6.3, y - 0.08, 3.1);
            t.img(s, await L.icon(it.icon, M, 1.75), 6.3, y, 0.28, 0.28);
            h3(s, it.h, 6.65, y, 2.75, 0.3, { color: M, valign: 'middle', max: 12.5 });
            p(s, it.t, 6.3, y + 0.32, 3.1, rh - 0.42, { max: 11.5 });
          }
        },
        async (d) => { // blinds on the wall: everything leans on the right edge, the icon closing each line
          const s = await open('slats'), n = d.items.length, rh = 3.68 / n; no(s);
          T(s, d.title, 1.5, 0.35, 7.9, 0.95);
          for (const [i, it] of d.items.entries()) {
            const y = 1.45 + i * rh, w = 6.0 + (i % 2) * 1.3;
            t.img(s, await L.icon(it.icon, A, 1.75), 8.98, y + 0.02, 0.42, 0.42);
            h3(s, it.h, 8.8 - w, y, w, 0.32, { align: 'right', max: 14.5 });
            p(s, it.t, 8.8 - w, y + 0.33, w, rh - 0.38, { align: 'right', color: I, max: 12.5 });
          }
        },
        async (d) => { // the dark room: columns slipping lower as the shadow lengthens
          const s = await open('dusk', DM, 0.6, 8.8, 'left'), n = d.items.length, gap = 0.32, w = (8.8 - gap * (n - 1)) / n, sy = n === 4 ? 0.42 : 0.6; no(s, DM);
          T(s, d.title, 0.6, 0.35, 8.8, 0.92, { color: P, align: 'left' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.45 + i * sy;
            t.img(s, await L.icon(it.icon, AL, 1.75), x, y, 0.42, 0.42);
            h3(s, it.h, x, y + 0.48, w, 0.5, { color: AL, max: 13 });
            p(s, it.t, x, y + 0.98, w, 5.17 - y - 0.98, { color: P, max: 12 });
          }
        },
        async (d) => { // a shadow slants across the left, the items keep to its edge
          const s = await open('slope', M, 4.1, 5.3, 'right'), n = d.items.length, rh = 4.68 / n; no(s);
          T(s, d.title, 0.35, 0.45, 2.75, 3.0, { color: P, align: 'left', valign: 'top', max: 20, min: 12 });
          const edge = (y) => (640 - (310 * y * 160) / 900) / 160;
          for (const [i, it] of d.items.entries()) {
            const y = 0.42 + i * rh, x = edge(y + rh * 0.1) + 0.4;
            t.img(s, await L.icon(it.icon, A, 1.75), x, y, 0.36, 0.36);
            h3(s, it.h, x + 0.46, y, 9.4 - x - 0.46, 0.36, { valign: 'middle' });
            p(s, it.t, x, y + 0.4, 9.4 - x, rh - 0.46, { color: I, max: 12.5 });
          }
        },
      ],
      process: [
        async (d) => { // a sundial: the hours fan out, steps sit round the arc, the title at the gnomon
          const s = await open('dial', M, 2.2, 5.6, 'center'), n = d.steps.length; no(s);
          k.head(s, d.title, 3.05, 3.8, 3.9, 1.35, { max: 18, min: 12, color: I, align: 'center', valign: 'bottom' });
          const spots = n === 4 ? [[0.35, 3.25, 2.6], [1.5, 1.0, 3.3], [5.2, 1.0, 3.3], [7.05, 3.25, 2.6]] : [[0.5, 2.7, 2.75], [3.3, 0.55, 3.4], [6.75, 2.7, 2.75]];
          d.steps.forEach((st, i) => {
            const [x, y, w] = spots[i];
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.46, { color: AD, align: 'center', max: 13 });
            p(s, st.t, x, y + 0.46, w, 1.4, { color: I, align: 'center', max: 12 });
          });
        },
        async (d) => { // great numerals that throw shadows, the words under them
          const s = await open('page', M, 0.6, 8.8, 'left'), n = d.steps.length, gap = 0.36, w = (8.8 - gap * (n - 1)) / n; no(s);
          T(s, d.title, 2.0, 0.3, 7.4, 0.85);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap);
            cast(s, String(i + 1), x, 1.15, w, 1.2, { size: 72, valign: 'middle' });
            h3(s, st.h, x, 2.4, w, 0.5);
            p(s, st.t, x, 2.92, w, 2.24, { color: I });
          });
        },
        async (d) => { // the beam in a dark room widens toward the floor, and so do the steps
          const s = await open('beam', I, 2.2, 5.6, 'center'), n = d.steps.length, hh = 3.78 / n; no(s, DM);
          k.head(s, d.title, 0.35, 0.3, 2.3, 1.05, { max: 15, min: 10.5, color: P, valign: 'top' });
          d.steps.forEach((st, i) => {
            const y = 1.42 + i * hh, half = 1.75 + ((y + 0.1) / 5.625) * 2.875 - 0.25, w = half * 2;
            h3(s, `${i + 1}.  ${st.h}`, 5 - half, y, w, 0.3, { align: 'center', color: AD });
            p(s, st.t, 5 - half, y + 0.3, w, hh - 0.34, { align: 'center', color: I, max: 12 });
          });
        },
        async (d) => { // on the striped wall, stepping down to the left from the top right corner
          const s = await open('slats', M, 0.6, 6.3, 'left'), n = d.steps.length, sy = n === 4 ? 1.18 : 1.6, sx = n === 4 ? 1.3 : 1.9, w = 4.4; no(s);
          d.steps.forEach((st, i) => {
            const y = 0.42 + i * sy, x = 9.4 - w - i * sx;
            h3(s, st.h, x, y, w - 0.65, 0.32, { align: 'right' });
            k.head(s, String(i + 1), 9.4 - i * sx - 0.55, y - 0.03, 0.55, 0.62, { max: 34, min: 22, color: A, align: 'right', valign: 'top' });
            p(s, st.t, x, y + 0.33, w - 0.65, sy - 0.36, { align: 'right', color: I, max: 12 });
          });
          k.head(s, d.title, 0.6, 0.42, n === 4 ? 3.9 : 3.4, n === 4 ? 1.5 : 2.1, { max: 24, min: 14, color: I, valign: 'top' });
        },
      ],
      stats: [
        async (d) => { // the leading figure throws its shadow across the page
          const s = await open('page', M, 0.6, 5.2, 'left'), [a, ...rest] = d.stats; no(s);
          k.head(s, d.title, 0.6, 0.38, 8.0, 0.65, { max: 19, min: 13, color: A, valign: 'top' });
          cast(s, a.value, 0.6, 1.08, 5.4, 1.95, { max: 84, min: 36, valign: 'middle' });
          p(s, a.label, 0.6, 3.08, 5.0, 0.62, { color: I, max: 15, min: 11 });
          if (d.note) p(s, d.note, 0.6, 3.75, 5.4, 1.42, { max: 11.5, min: 9.5, valign: 'bottom' });
          rest.forEach((x, i) => {
            const y = 1.3 + i * 1.92;
            k.head(s, x.value, 6.5, y, 2.9, 0.75, { max: 30, min: 15, color: M, align: 'right', valign: 'bottom' });
            hair(s, 6.5, y + 0.8, 2.9);
            p(s, x.label, 6.5, y + 0.86, 2.9, 0.7, { align: 'right', max: 12 });
          });
        },
        async (d) => { // the dark room: three figures in pale ink, a line of the wall above them
          const s = await open('dusk', DM, 0.6, 8.8, 'left'); no(s, DM);
          T(s, d.title, 0.6, 0.35, 8.8, 0.95, { color: P, align: 'left' });
          d.stats.forEach((x, i) => {
            const xx = 0.6 + i * 3.0;
            t.line(s, xx, 1.55, 2.75, 0, AL, 0.75);
            k.head(s, x.value, xx, 1.65, 2.75, 1.05, { max: 44, min: 22, color: P, valign: 'middle' });
            p(s, x.label, xx, 2.72, 2.75, 0.85, { color: DM, max: 13 });
          });
          if (d.note) p(s, d.note, 0.6, 3.72, 8.8, 1.42, { color: DM, max: 12, min: 9.5, valign: 'bottom' });
        },
        async (d) => { // the title alone on the left, the figures stacked to the right, each flush with the edge
          const s = await open('plain', M, 0.6, 3.5, 'left'); no(s);
          k.head(s, d.title, 0.6, 0.5, 3.5, 2.0, { max: 26, min: 14, color: I, valign: 'top' });
          if (d.note) p(s, d.note, 0.6, 2.65, 3.5, 2.5, { max: 12, min: 9.5, valign: 'bottom' });
          d.stats.forEach((x, i) => {
            const y = 0.42 + i * 1.6;
            k.head(s, x.value, 4.5, y, 4.9, 0.95, { max: 54, min: 24, color: i ? M : I, align: 'right', valign: 'bottom' });
            p(s, x.label, 4.5, y + 0.98, 4.9, 0.55, { color: I, align: 'right', max: 13, min: 10.5 });
          });
        },
      ],
      compare: [
        async (d) => { // one side in the light, one in the shadow, a slanted edge between them
          const s = await open('slopeR', M, 0.6, 3.6, 'left'); no(s, DM);
          k.head(s, d.title, 0.6, 0.38, 4.8, 1.0, { max: 20, min: 13, color: I, valign: 'top' });
          const side = (sd, x, y0, w, hc, b) => {
            k.head(s, sd.h, x, y0, w, 0.46, { max: 18, min: 12, color: hc });
            const hh = (5.15 - y0 - 0.55) / sd.items.length;
            sd.items.forEach((it, j) => p(s, it, x, y0 + 0.55 + j * hh, w, hh - 0.06, { color: b, max: 14, min: 10.5 }));
          };
          side(d.left, 0.6, 1.5, 3.65, AD, I);
          side(d.right, 6.4, 0.55, 3.05, AL, P);
        },
        async (d) => { // one above the other: the first in full ink, the other in half tone, a thin line between
          const s = await open('page', M, 0.6, 8.8, 'left'); no(s);
          T(s, d.title, 2.0, 0.28, 7.4, 0.72, { max: 22 });
          const band = (sd, y, hc, b) => {
            k.head(s, sd.h, 7.1, y, 2.3, 1.85, { max: 19, min: 12, color: hc, align: 'right', valign: 'top' });
            sd.items.forEach((it, j) => p(s, it, 0.6 + (j % 2) * 3.2, y + (j >> 1) * 0.94, 3.05, 0.9, { color: b, max: 13, min: 10.5 }));
          };
          band(d.left, 1.15, I, I);
          t.line(s, 0.6, 3.1, 8.8, 0, A, 0.75);
          band(d.right, 3.25, M, M);
        },
      ],
      statement: [
        async (d) => { // a beam falls on the words, the title and caption wait outside the light
          const s = await open('beam', I, 2.2, 5.6, 'center'); no(s, DM);
          k.head(s, d.title, 0.35, 0.3, 2.3, 1.05, { max: 15, min: 10.5, color: P, valign: 'top' });
          k.head(s, L.runs(d.text), 2.85, 1.0, 4.3, 2.85, { max: 26, min: 15, color: I, align: 'center' });
          if (d.caption) p(s, d.caption, 1.7, 3.95, 6.6, 1.25, { color: I, align: 'center', max: 12 });
        },
        async (d) => { // blinds on the wall, large words hard to the right, the caption low on the left
          const s = await open('slats', M, 0.6, 8.8, 'left'); no(s);
          k.head(s, d.title, 2.4, 0.42, 7.0, 0.45, { max: 15, min: 11, color: A, align: 'right', valign: 'top' });
          k.head(s, L.runs(d.text), 1.4, 0.98, 8.0, 2.75, { max: 36, min: 17, color: I, align: 'right' });
          t.line(s, 0.6, 3.92, 3.0, 0, A, 0.75);
          if (d.caption) p(s, d.caption, 0.6, 4.0, 6.6, 1.18, { color: I, max: 12 });
        },
      ],
      timeline: [
        async (d) => { // the dark room: years in pale ink, a rail of tick marks, events to the right
          const s = await open('dusk', DM, 0.6, 8.8, 'left'), rh = 0.97; no(s, DM);
          T(s, d.title, 0.6, 0.3, 8.8, 0.85, { color: P, align: 'left' });
          d.items.forEach((it, i) => {
            const y = 1.22 + i * rh;
            t.line(s, 0.6, y, 8.8, 0, '5C564D', 0.75);
            k.head(s, it.year, 0.6, y + 0.05, 2.9, rh - 0.1, { max: 30, min: 15, color: AL });
            h3(s, it.h, 3.7, y + 0.08, 5.7, 0.28, { color: P, max: 13 });
            p(s, it.t, 3.7, y + 0.36, 5.7, rh - 0.4, { color: DM, max: 11.5, ls: 1.15 });
          });
        },
        async (d) => { // a window of four panes on a shaded wall, a moment in each pane
          const s = await open('wall', M, 0.4, 2.3, 'left'); no(s);
          k.head(s, d.title, 0.4, 0.42, 2.45, 4.7, { max: 22, min: 13, color: I, valign: 'bottom' });
          d.items.forEach((it, i) => {
            const x = 3.25 + (i % 2) * 3.2, y = 0.53 + (i >> 1) * 2.4, w = 2.8;
            k.head(s, it.year, x, y, w, 0.5, { max: 24, min: 14, color: AD, valign: 'top' });
            h3(s, it.h, x, y + 0.52, w, 0.3, { max: 13 });
            p(s, it.t, x, y + 0.82, w, 1.16, { color: I, max: 12, ls: 1.15 });
          });
        },
        async (d) => { // the path of the sun over the day, a sun for every year
          const s = await open('path', M, 0.6, 8.8, 'left'), w = 2.05, xs = [0.65, 2.92, 5.03, 7.3]; no(s);
          const sun = (px) => { let t0 = 0, t1 = 1; for (let j = 0; j < 30; j++) { const m = (t0 + t1) / 2, u = 1 - m, x = u*u*u*60 + 3*u*u*m*440 + 3*u*m*m*1160 + m*m*m*1540; if (x < px) t0 = m; else t1 = m; } const u = 1 - t0; return (u*u*u*392 + 3*u*u*t0*110 + 3*u*t0*t0*110 + t0*t0*t0*392) / 160; }; // height of the arc
          T(s, d.title, 1.8, 0.25, 7.6, 0.6, { max: 20 });
          d.items.forEach((it, i) => {
            const x = xs[i], cx = x + w / 2;
            const sy = sun(cx * 160);
            t.oval(s, cx - 0.09, sy - 0.09, 0.18, 0.18, A);
            k.head(s, it.year, x, sy + 0.1, w, 0.36, { max: 19, min: 12, color: AD, align: 'center', valign: 'top' });
            h3(s, it.h, x, 2.6, w, 0.32, { align: 'center', max: 13 });
            p(s, it.t, x, 2.94, w, 2.22, { align: 'center', color: I, max: 12.5 });
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
  tone: "yorug'lik va soya: muhim va ikkinchi darajalini ajratadigan bayon" });
