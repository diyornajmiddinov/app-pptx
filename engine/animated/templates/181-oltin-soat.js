/** 181 Oltin soat — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 181, slug: 'oltin-soat', name: "Oltin soat", mode: 'top', list: 'cols', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '2B0B1A', muted: '4A1428', accent: '6B0F3A' }, photo: { r: 0.1 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'F28C38'],[1,'E3487A']],'d'), grain(0.05)),
  // golden hour: the sun on the horizon, a retro sliced sun, the sun's path over the sky, rays from a low corner; white for lines, deep plum for words
  // (the template's white words on orange could not be read: words are now dark on the whole gradient)
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const W = 'FFFFFF';
    const foot = (s, x = 0.7, w = 8.6) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted });
    const open = async (d, x = 0.7, y = 0.3, w = 8.2, h = 0.9, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 30, min: 14, color: TI, valign: 'bottom', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14.5, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.accent, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 44, min: 14, color: C.accent, ...o });
    const ln = (s, x, y, w, h = 0, wt = 1, o = {}) => t.line(s, x, y, w, h, W, wt, o);
    const seg = (s, x1, y1, x2, y2, wt = 0.75) => ln(s, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1), wt, (x2 - x1) * (y2 - y1) < 0 ? { flipV: true } : {});
    const disc = (s, cx, cy, D) => t.oval(s, cx - D / 2, cy - D / 2, D, D, W, { name: 'Sun' });
    const nm = (s, v, cx, cy, D, size = 13) => k.txt(s, String(v), cx - D / 2, cy - D / 2, D, D, { size, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
    const arc = async (s, x, y, w, h) => { const A = Math.round(w * 100), B = Math.round(h * 100); t.img(s, await k.svg(`sun${A}x${B}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${A}" height="${B}"><path d="M1,${B} A${A / 2 - 1},${B - 1} 0 0 1 ${A - 1},${B}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/></svg>`, A, B), x, y, w, h, { alt: '' }); };
    const sliced = () => { const cuts = [[0, 0.36], [0.41, 0.62], [0.67, 0.8], [0.85, 0.93], [0.965, 1]], side = (y) => Math.sqrt(Math.max(0, 0.25 - (y - 0.5) ** 2)); return cuts.map(([a, b]) => { const ys = Array.from({ length: 9 }, (_, i) => a + ((b - a) * i) / 8); return 'M' + ys.map((y) => `${(0.5 - side(y)).toFixed(4)},${y.toFixed(4)}`).join(' L') + ' L' + ys.reverse().map((y) => `${(0.5 + side(y)).toFixed(4)},${y.toFixed(4)}`).join(' L') + ' Z'; }).join(' '); };
    const V = {
      image: [
        async (d) => { // the sun of the picture half down behind a white horizon, the words in the sky over it
          const s = await open(d, 0.7, 0.26, 8.2, 0.72, { max: 24 });
          p(s, d.text, 0.7, 1.05, 8.6, 1.72, { max: 13 });
          await k.photo(s, d.image, 1.9, 2.82, 6.2, 2.3, { mask: { path: 'M0,1 A0.5,1 0 0 1 1,1 Z' } });
          ln(s, 0, 5.12, 10, 0, 1.25);
        },
        async (d) => { // a sun too large for the page, cut by its upper right corner
          const s = await slide('page');
          await k.photo(s, d.image, 5.15, 0, 4.85, 4.85, { mask: { path: 'M0,0 H1 V1 A1,1 0 0 1 0,0 Z' } });
          k.head(s, d.title, 0.7, 0.42, 4.2, 1.2, { max: 26, min: 14, color: TI, valign: 'top' });
          p(s, d.text, 0.7, 1.72, 4.4, 3.4, { max: 13.5 });
          k.txt(s, String(k.idx).padStart(2, '0'), 8.7, 5.0, 0.6, 0.25, { size: 9, color: C.muted, align: 'right' });
          foot(s);
        },
        async (d) => { // the picture as a retro sun, sliced by the horizon into bands
          const s = await open(d, 5.1, 0.45, 4.2, 1.15, { max: 24 });
          await k.photo(s, d.image, 0.5, 0.35, 4.3, 4.8, { mask: { path: sliced() } });
          p(s, d.text, 5.1, 1.7, 4.2, 3.42);
        },
        async (d) => { // the whole picture, a warm pale sheet in the low light
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          t.rect(s, 0.5, 0.5, 5.3, 4.7, 'FFEFD9', { name: 'Sheet' });
          k.head(s, d.title, 0.8, 0.68, 4.1, 1.0, { max: 22, min: 13, color: TI, valign: 'top' });
          k.txt(s, String(k.idx).padStart(2, '0'), 4.95, 0.6, 0.6, 0.25, { size: 9, color: C.muted, align: 'right' });
          p(s, d.text, 0.8, 1.75, 4.75, 3.32, { max: 13.5 });
          foot(s);
        },
      ],
      cards: [
        async (d) => { // the sun's path: a white arc over the page, the items rising and sinking under it
          const n = d.items.length, s = await open(d, 0.7, 0.26, 8.2, 0.78, { max: 26 }), gap = 0.28, w = (9 - gap * (n - 1)) / n, ys = n === 4 ? [2.38, 1.72, 1.72, 2.38] : [2.3, 1.72, 2.3];
          await arc(s, 0.3, 1.08, 9.4, 1.45);
          for (const [i, it] of d.items.entries()) {
            const x = 0.5 + i * (w + gap), y = ys[i];
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x + w / 2 - 0.17, y, 0.34, 0.34);
            h3(s, it.h, x, y + 0.38, w, 0.5, { align: 'center', max: 13.5 });
            p(s, it.t, x, y + 0.9, w, 5.12 - y - 0.9, { align: 'center', max: 12.5, ls: 1.14 });
          }
        },
        async (d) => { // rays from a sun in the upper corner, one running to each item; the title waits below them
          const s = await open(d, 0.7, 3.25, 2.3, 1.87, { max: 18, valign: 'bottom' }), n = d.items.length, H = 4.66 / n;
          t.img(s, await k.svg('corner', `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><path d="M0,0 H300 A300,300 0 0 1 0,300 Z" fill="#FFFFFF" fill-opacity="0.85"/></svg>`, 300, 300), 0, 0, 2.0, 2.0, { alt: '' });
          for (const [i, it] of d.items.entries()) {
            const y = 0.45 + i * H;
            seg(s, 1.35, 1.35, 3.9, y + 0.18);
            t.img(s, await L.icon(it.icon, C.accent, 1.75), 4.0, y + 0.02, 0.32, 0.32);
            h3(s, it.h, 4.42, y, 4.88, 0.36, { valign: 'middle' });
            p(s, it.t, 4.42, y + 0.38, 4.88, H - 0.44, { max: 13.5 });
          }
        },
        async (d) => { // white suns with icons in them, two and two
          const s = await open(d), n = d.items.length, w = 4.15, H = 1.86, D = 0.74;
          for (const [i, it] of d.items.entries()) {
            const whole = n === 3 && i === 2, x = i % 2 ? 5.15 : 0.7, y = 1.34 + Math.floor(i / 2) * H, ww = whole ? 8.6 : w;
            disc(s, x + D / 2, y + D / 2, D);
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x + 0.19, y + 0.19, 0.36, 0.36);
            h3(s, it.h, x + D + 0.15, y, ww - D - 0.15, 0.36, { valign: 'middle' });
            p(s, it.t, x + D + 0.15, y + 0.38, ww - D - 0.15, H - 0.44, { max: 13.5 });
          }
        },
        async (d) => { // everything hangs from a white line at the top; the title has gone down to the horizon
          const s = await open(d, 0.7, 4.3, 8.6, 0.85, { max: 26, valign: 'middle' }), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          ln(s, 0, 0.5, 10, 0, 1.25);
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap);
            ln(s, x + 0.17, 0.5, 0, 0.2, 1);
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x, 0.72, 0.34, 0.34);
            h3(s, it.h, x, 1.14, w, 0.52, { max: 14 });
            p(s, it.t, x, 1.68, w, 2.56, { max: 14 });
          }
          ln(s, 0.7, 4.25, 8.6, 0, 1);
        },
      ],
      process: [
        async (d) => { // white stairs climb to a white sun, the title in the free corner under the sky
          const s = await open(d, 0.7, 0.32, 5.2, 1.2, { max: 24, valign: 'top' }), n = d.steps.length, gap = 0.2, w = (8.6 - gap * (n - 1)) / n, top = n === 4 ? [2.78, 2.34, 1.9, 1.46] : [2.72, 2.1, 1.48];
          disc(s, 8.3, 0.72, 0.8);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = top[i];
            ln(s, x, y, w + (i < n - 1 ? gap : 0), 0, 1.25);
            if (i < n - 1) ln(s, x + w + gap, top[i + 1], 0, y - top[i + 1], 1.25);
            k.txt(s, [{ text: `${i + 1}  `, options: { color: C.accent, bold: true } }, { text: st.h, options: { color: C.accent, bold: true } }], x, y + 0.07, w - 0.1, 0.52, { max: 14, min: 10.5, font: F.head });
            p(s, st.t, x, y + 0.6, w - 0.1, 5.12 - y - 0.6, { max: 13, ls: 1.14 });
          });
        },
        async (d) => { // the day as a dial: the steps stand round the sun's arc, the title under it
          const s = await open({}), n = d.steps.length, cx = 5, cy = 5.05, Rr = 2.1;
          await arc(s, cx - Rr, cy - Rr, 2 * Rr, Rr);
          ln(s, 0.7, cy, 8.6, 0, 1.25);
          k.head(s, d.title, cx - 1.35, 3.62, 2.7, 1.35, { max: 18, min: 11, color: TI, align: 'center', valign: 'bottom' });
          const angs = n === 4 ? [155, 112, 68, 25] : [150, 90, 30];
          const spots = n === 4 ? [[0.45, 3.0, 2.4, 'left'], [0.7, 0.42, 3.95, 'left'], [5.35, 0.42, 3.95, 'left'], [7.15, 3.0, 2.4, 'left']] : [[0.45, 3.0, 2.4, 'left'], [2.5, 0.42, 5, 'center'], [7.15, 3.0, 2.4, 'left']];
          d.steps.forEach((st, i) => {
            const a = (angs[i] * Math.PI) / 180, px = cx + Rr * Math.cos(a), py = cy - Rr * Math.sin(a), [x, y, w, al] = spots[i], low = y > 1;
            disc(s, px, py, 0.4); nm(s, i + 1, px, py, 0.4);
            h3(s, st.h, x, y, w, low ? 0.5 : 0.3, { align: al, valign: low ? 'top' : 'middle', max: 14 });
            p(s, st.t, x, y + (low ? 0.52 : 0.32), w, low ? 1.45 : 1.4, { align: al, max: 13, ls: 1.14 });
          });
        },
        async (d) => { // a pale white figure in each column like the sun through haze, the words over it
          const s = await open(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            t.text(s, String(i + 1), { x, y: 3.75, w, h: 1.4, fontFace: F.head, bold: true, fontSize: 90, color: W, transparency: 60, align: 'right', valign: 'bottom', noShrink: true });
            h3(s, st.h, x, 1.35, w, 0.54, { max: 14.5 });
            p(s, st.t, x, 1.92, w, 3.2, { max: 14 });
          });
        },
        async (d) => { // bands of evening sky, one over another, a number on the left of each
          const s = await open(d, 0.7, 0.26, 8.2, 0.78, { max: 26 }), n = d.steps.length, H = 4.04 / n;
          d.steps.forEach((st, i) => {
            const y = 1.1 + i * H;
            ln(s, 0, y, 10, 0, i ? 0.75 : 1.25);
            fig(s, String(i + 1), 0.7, y + 0.05, 0.8, H - 0.1, { max: 40, min: 22, valign: 'middle' });
            h3(s, st.h, 1.6, y + 0.07, 7.7, 0.3, { valign: 'middle' });
            p(s, st.t, 1.6, y + 0.38, 7.7, H - 0.42, { max: 13.5, ls: 1.14 });
          });
        },
      ],
      stats: [
        async (d) => { // three figures stand on the white horizon, the words under it
          const s = await open(d), w = 2.7, gap = 0.25, ly = 2.72;
          ln(s, 0, ly, 10, 0, 1.25);
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * (w + gap);
            fig(s, x.value, xx, 1.42, w, 1.26, { max: 50, min: 20, valign: 'bottom' });
            p(s, x.label, xx, ly + 0.08, w, 0.86, { max: 14 });
          });
          if (d.note) p(s, d.note, 0.7, 3.7, 8.6, 1.42, { max: 13, color: C.muted });
        },
        async (d) => { // the chief figure in a white sun, two others in its light to the right
          const s = await open(d), [a, ...rest] = d.stats, D = 3.3;
          disc(s, 0.7 + D / 2, 1.42 + D / 2, D);
          fig(s, a.value, 1.0, 2.0, D - 0.6, 1.1, { max: 46, min: 20, align: 'center' });
          p(s, a.label, 1.2, 3.12, D - 1.0, 0.9, { align: 'center', max: 12 });
          rest.forEach((x, i) => {
            const y = 1.35 + i * 1.08;
            k.head(s, x.value, 4.5, y, 4.8, 0.58, { max: 30, min: 15, color: C.accent, valign: 'bottom' });
            p(s, x.label, 4.5, y + 0.6, 4.8, 0.44, { max: 13 });
          });
          if (d.note) p(s, d.note, 4.5, 3.55, 4.8, 1.57, { max: 12.5, color: C.muted });
        },
        async (d) => { // the sun going down: each figure lower and smaller than the last
          const s = await open(d, 3.7, 0.32, 5.6, 1.0, { max: 24, align: 'right', valign: 'top' }), sizes = [64, 44, 30], tops = [0.35, 1.55, 2.7];
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * 2.25, y = tops[i], w = i === 0 ? 3.0 : 3.6;
            fig(s, x.value, xx, y, w, i ? 0.72 : 1.0, { max: sizes[i], min: 16, align: 'left' });
            p(s, x.label, xx, y + (i ? 0.72 : 1.0), i === 2 ? 3.4 : 2.15, 0.72, { max: 12.5, ls: 1.08 });
          });
          ln(s, 0, 4.12, 10, 0, 1.25);
          if (d.note) p(s, d.note, 0.7, 4.17, 8.6, 1.0, { max: 12, min: 10, color: C.muted, ls: 1.08 });
        },
      ],
      compare: [
        async (d) => { // the horizon parts them: one side in the sky, the other under it
          const s = await open(d, 0.7, 0.2, 8.2, 0.68, { max: 22 }), ly = 2.96;
          ln(s, 0, ly, 10, 0, 1.5);
          [[d.left, 0.96, C.ink], [d.right, ly + 0.06, C.accent]].forEach(([sd, y, c]) => {
            k.head(s, sd.h, 0.7, y, 8.6, 0.38, { max: 17, min: 11, color: c, valign: 'middle' });
            const hh = 1.6 / Math.ceil(sd.items.length / 2);
            sd.items.forEach((it, j) => p(s, it, 0.7 + (j % 2) * 4.4, y + 0.4 + Math.floor(j / 2) * hh, 4.2, hh - 0.02, { max: 13.5 }));
          });
        },
        async (d) => { // morning and evening: mirrored about an upright with the sun at its head
          const s = await open(d), w = 3.95;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.18, 2.95);
          k.head(s, d.left.h, 0.7, 1.32, w - 0.2, 0.6, { max: 20, min: 12, color: C.ink, align: 'right' });
          k.head(s, d.right.h, 5.55, 1.32, w - 0.2, 0.6, { max: 20, min: 12, color: C.accent });
          disc(s, 5, 1.6, 0.42); ln(s, 5, 1.82, 0, 3.3, 1);
          let y = 2.04;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
      ],
      statement: [
        async (d) => { // the sentence rises in a great white arc from the horizon, title above, the note under the line
          const s = await open(d, 1, 0.1, 8, 0.42, { max: 14, min: 10.5, color: C.accent, align: 'center', valign: 'middle' }, 'focus');
          await arc(s, 0.8, 0.5, 8.4, 3.55);
          ln(s, 0, 4.05, 10, 0, 1.25);
          k.head(s, L.runs(d.text), 2.0, 1.2, 6.0, 2.75, { max: 30, min: 15, color: C.ink, align: 'center', valign: 'middle' });
          if (d.caption) p(s, d.caption, 0.9, 4.12, 8.2, 1.04, { max: 12, min: 10, align: 'center', color: C.muted, ls: 1.08 });
        },
        async (d) => { // the note and title up in the sky to the right, the sentence large and low at the left
          const s = await open(d, 5.3, 0.38, 3.6, 0.6, { max: 15, min: 11, color: C.accent, align: 'right', valign: 'top' }, 'focus');
          if (d.caption) p(s, d.caption, 4.4, 1.0, 4.9, 1.3, { max: 12, align: 'right', color: C.muted, ls: 1.1 });
          k.head(s, L.runs(d.text), 0.7, 2.3, 8.6, 2.82, { max: 38, min: 18, color: C.ink, valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // the hours of the day: a white rule with ticks, a year above each main tick, the words below
          const s = await open(d), gap = 0.28, w = (8.6 - gap * 3) / 4, ly = 2.08;
          ln(s, 0.7, ly, 8.6, 0, 1.25);
          for (let m = 0; m <= 32; m++) ln(s, 0.7 + (m * 8.6) / 32, ly, 0, m % 8 === 0 ? 0.16 : 0.07, 0.75);
          d.items.forEach((it, i) => {
            const x = 0.7 + (i * 8.6) / 4;
            fig(s, it.year, x, 1.32, w, 0.7, { max: 26, min: 12, align: 'left', valign: 'bottom' });
            h3(s, it.h, x, ly + 0.2, w, 0.5, { color: C.ink, max: 13.5 });
            p(s, it.t, x, ly + 0.72, w, 5.12 - ly - 0.72, { max: 13 });
          });
        },
        async (d) => { // the sun sets through the years: each entry a step lower and further along, a small sun at each
          const s = await open(d, 0.7, 0.26, 8.2, 0.78, { max: 24 }), H = 1.0, dx = 1.2, w = 5.0;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * dx, y = 1.12 + i * H;
            disc(s, x + 0.1, y + 0.17, 0.2);
            k.txt(s, [{ text: `${it.year}   `, options: { bold: true, color: C.accent } }, { text: it.h, options: { bold: true, color: C.ink } }], x + 0.3, y, w - 0.3, 0.34, { max: 14, min: 10.5, font: F.head, valign: 'middle' });
            p(s, it.t, x + 0.3, y + 0.36, w - 0.3, H - 0.38, { max: 12, ls: 1.08 });
          });
        },
        async (d) => { // each year large on its own short horizon, two and two
          const s = await open(d), w = 4.15, H = 1.88;
          d.items.forEach((it, i) => {
            const x = i % 2 ? 5.15 : 0.7, y = 1.3 + Math.floor(i / 2) * H;
            fig(s, it.year, x, y, w, 0.5, { max: 26, min: 13, align: 'left', valign: 'bottom' });
            ln(s, x, y + 0.54, w, 0, 1);
            h3(s, it.h, x, y + 0.59, w, 0.28, { color: C.ink, max: 13.5, valign: 'middle' });
            p(s, it.t, x, y + 0.88, w, H - 0.92, { max: 12.5, ls: 1.1 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process, stats and timeline are the columns of the cards
    R.stats = V.stats.shift();
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "ilhomli va iliq: orzu va natija, jonli ifoda" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["fade", "dissolve", "p14:pan|dir=\"u\""], "cover": ["riseWords", "fadeLetters"], "mark": "riseUp", "deco": "splitH", "sig": {"title": "riseWords", "body": "fade", "item": "riseUp", "image": "splitH", "number": "riseSettle", "order": "seq", "stagger": 0.26}, "tempo": 1.4, "kenburns": true};
