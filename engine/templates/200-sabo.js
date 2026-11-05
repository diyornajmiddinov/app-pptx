/** 200 Sabo — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
// the breeze moves things: its lines rise, gust across the page, run down one side; dusk over the water, open sky (160 px = 1 inch)
const AIR = () => lin([[0,'EAF4FB'],[1,'FFFFFF']]);
const lines = (y0, n = 6, c = 'B9D6EA', st = 30) => Array.from({ length: n }, (_, i) => `<path d="M0,${y0 + i * st} C400,${y0 - 40 + i * st} 1000,${y0 + 60 + i * st} 1600,${y0 - 10 + i * st}" fill="none" stroke="#${c}" stroke-width="2" opacity="${0.7 - i * 0.1}"/>`).join('');
const SINE = (x) => 400 + 92 * Math.sin((x / 1600) * Math.PI * 2 * 1.5 + 0.2); // the wave of steps, px
const curve = (f, c, w = 2) => `<path d="M${Array.from({ length: 41 }, (_, i) => `${i * 40},${f(i * 40).toFixed(1)}`).join(' L')}" fill="none" stroke="#${c}" stroke-width="${w}"/>`;
module.exports = B({ id: 200, slug: 'sabo', name: "Sabo", mode: 'top', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '1F3346', muted: '5E7385', accent: '3D7EAA' }, photo: { r: 0.1 }, rule: true, caps: false, bold: true,
  bg: (kind) => kind === 'deep' ? compose(lin([[0,'17293A'],[1,'1F3A52']]), raw(lines(690, 6, '5C8FB3')))
    : kind === 'sky' ? compose(lin([[0,'CFE6F5'],[1,'EAF4FB']]), blobs([[1300,140,160,'FFFFFF',0.9],[1460,180,120,'FFFFFF',0.8],[260,780,180,'FFFFFF',0.9]],50))
    : kind === 'high' ? compose(AIR(), raw(lines(40, 5)))
    : kind === 'side' ? compose(AIR(), raw(Array.from({ length: 6 }, (_, i) => `<path d="M${60 + i * 34},0 C${140 + i * 34},300 ${-20 + i * 34},600 ${90 + i * 34},900" fill="none" stroke="#B9D6EA" stroke-width="2" opacity="${0.8 - i * 0.1}"/>`).join('')))
    : kind === 'gust' ? compose(AIR(), raw(Array.from({ length: 7 }, (_, i) => `<path d="M0,${820 - i * 26} C500,${760 - i * 26} 900,${360 - i * 26} 1600,${130 - i * 26}" fill="none" stroke="#B9D6EA" stroke-width="2" opacity="${0.75 - i * 0.08}"/>`).join('')))
    : kind === 'wave' ? compose(AIR(), raw(curve(SINE, '3D7EAA', 2.5)))
    : kind === 'river' ? compose(AIR(), raw('<path d="M800,190 C640,350 960,520 800,690 C700,790 800,860 800,900" fill="none" stroke="#3D7EAA" stroke-width="2.5"/>'))
    : kind === 'tideV' ? compose(AIR(), raw('<path d="M840,0 C700,260 960,580 780,900 L1600,900 L1600,0 Z" fill="#1F3A52"/>'))
    : kind === 'tideH' ? compose(AIR(), raw('<path d="M0,480 C500,410 1100,560 1600,450 L1600,900 L0,900 Z" fill="#1F3A52"/>'))
    : compose(AIR(), raw(Array.from({length:6},(_,i)=>`<path d="M0,${700+i*30} C400,${660+i*30} 1000,${760+i*30} 1600,${690+i*30}" fill="none" stroke="#B9D6EA" stroke-width="2" opacity="${0.7-i*0.1}"/>`).join(''))),
  ways: ({ k, t, L, C, F, slide }, R) => {
    const I = C.ink, M = C.muted, A = '2C6A94', P = 'EAF4FB', PM = 'BCD5E6', SK = '9CCBEA';
    const open = async (kind = 'page', c = M, x = 0.7, w = 8.6) => { const s = await slide(kind); k.foot(s, { x, w, y: 5.3, size: 7.5, color: c }); return s; };
    const no = (s, c = M) => k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 8.2, 0.18, 1.5, 0.3, { size: 9, color: c, align: 'right', font: F.body, spacing: 1 });
    const T = (s, v, x = 0.7, y = 0.3, w = 8.6, h = 1.05, o = {}) => k.head(s, v, x, y, w, h, { max: 30, min: 14, color: I, valign: 'bottom', ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: A, valign: 'top', ...o });
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: I, ls: 1.25, ...o });
    const V = {
      image: [
        async (d) => { // the picture rising under the words like water, its upper edge a wave
          const s = await open(); no(s);
          T(s, d.title, 0.7, 0.25, 3.0, 2.45, { valign: 'top', max: 24 });
          p(s, d.text, 3.95, 0.45, 5.35, 2.25);
          await k.photo(s, d.image, 0, 2.7, 10, 2.5, { mask: { path: 'M0,0.16 C0.3,0 0.65,0.3 1,0.08 L1,1 L0,1 Z' } });
        },
        async (d) => { // the picture to the right behind a blown, wavering edge
          const s = await open('page', M, 0.7, 4.3); no(s, I);
          await k.photo(s, d.image, 5.0, 0, 5.0, 5.625, { mask: { path: 'M0.14,0 C0,0.3 0.22,0.62 0.05,1 L1,1 L1,0 Z' } });
          T(s, d.title, 0.7, 0.45, 4.2, 1.45, { valign: 'top', max: 24 });
          p(s, d.text, 0.7, 2.0, 4.2, 3.15);
        },
        async (d) => { // dusk over the water, a round picture hanging low like the sun
          const s = await open('deep', PM); no(s, PM);
          T(s, d.title, 0.7, 0.35, 5.6, 1.35, { color: P, valign: 'top', italic: true, max: 26 });
          p(s, d.text, 0.7, 1.8, 5.5, 3.35, { color: P });
          await k.photo(s, d.image, 6.55, 1.2, 3.0, 3.0, { mask: 'circle' });
        },
        async (d) => { // open sky: a tall picture with soft corners, the title and the words drifting beside it
          const s = await open('sky', M, 4.8, 4.5); no(s);
          await k.photo(s, d.image, 0.7, 0.4, 3.65, 4.75, { mask: { r: 0.25 } });
          T(s, d.title, 4.8, 0.5, 4.5, 1.3, { italic: true, max: 24 });
          p(s, d.text, 4.8, 1.95, 4.5, 3.2);
        },
      ],
      cards: [
        async (d) => { // columns rising and falling on a long swell
          const s = await open(), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, ys = n === 4 ? [1.65, 1.35, 1.65, 1.95] : [1.7, 1.4, 1.85]; no(s);
          T(s, d.title, 0.7, 0.28, 8.6, 0.95);
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = ys[i];
            t.img(s, await L.icon(it.icon, A, 1.5), x, y, 0.42, 0.42);
            h3(s, it.h, x, y + 0.48, w, 0.5, { italic: true });
            p(s, it.t, x, y + 0.98, w, 5.17 - y - 0.98, { max: 12.5 });
          }
        },
        async (d) => { // dusk: rows sway in and out as if stirred
          const s = await open('deep', PM), n = d.items.length, rh = 3.7 / n, dx = n === 4 ? [0, 0.55, 1.0, 0.45] : [0, 0.75, 0.25]; no(s, PM);
          T(s, d.title, 0.7, 0.28, 8.6, 1.0, { color: P, italic: true });
          for (const [i, it] of d.items.entries()) {
            const y = 1.42 + i * rh, x = 0.7 + dx[i], w = 7.5;
            t.img(s, await L.icon(it.icon, SK, 1.5), x, y + 0.03, 0.38, 0.38);
            h3(s, it.h, x + 0.5, y, w - 0.5, 0.3, { color: SK });
            p(s, it.t, x + 0.5, y + 0.31, w - 0.5, rh - 0.36, { color: P, max: 12.5 });
          }
        },
        async (d) => { // wind running down the left beside the title, the items gathered to the right
          const s = await open('side', M, 0.7, 3.0), n = d.items.length; no(s);
          T(s, d.title, 1.05, 0.5, 2.85, 3.6, { valign: 'top', italic: true, max: 26 });
          const w = 2.55, spots = n === 4 ? [[4.1, 0.5], [6.8, 0.5], [4.1, 2.92], [6.8, 2.92]] : [[4.1, 0.5], [6.8, 1.65], [4.1, 2.92]];
          for (const [i, it] of d.items.entries()) {
            const [x, y] = spots[i];
            t.img(s, await L.icon(it.icon, A, 1.5), x, y, 0.36, 0.36);
            h3(s, it.h, x, y + 0.42, w, 0.48);
            p(s, it.t, x, y + 0.9, w, 1.3, { max: 12 });
          }
        },
        async (d) => { // open sky: words first, the icons floating under each like kites
          const s = await open('sky'), n = d.items.length, gap = 0.34, w = (8.6 - gap * (n - 1)) / n; no(s);
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap);
            h3(s, it.h, x, 0.5, w, 0.5, { italic: true, align: 'center' });
            p(s, it.t, x, 1.02, w, 2.08, { align: 'center', max: 12.5 });
            t.line(s, x + w / 2, 3.12, 0, 0.26, A, 0.75);
            t.img(s, await L.icon(it.icon, A, 1.5), x + w / 2 - 0.22, 3.4, 0.44, 0.44);
          }
          T(s, d.title, 0.9, 4.0, 8.2, 1.15, { align: 'center', valign: 'middle', italic: true, max: 28 });
        },
      ],
      process: [
        async (d) => { // a single wave runs through the page, steps riding over and under it
          const s = await open('wave'), n = d.steps.length, w = 3.5; no(s);
          T(s, d.title, 0.7, 0.16, 7.4, 0.7, { max: 22 });
          const xs = n === 4 ? [0.9, 2.15, 5.3, 6.4] : [0.9, 3.45, 6.0], W = (x) => Math.min(w, 9.4 - x);
          d.steps.forEach((st, i) => {
            const x = xs[i], cy = SINE((x + 0.1) * 160) / 160, up = i % 2 === 0, y = up ? 0.92 : 3.45;
            t.oval(s, x, cy - 0.1, 0.2, 0.2, A);
            h3(s, `${i + 1}.  ${st.h}`, x, up ? y : Math.max(y, cy + 0.15), W(x), 0.3, { max: 13 });
            p(s, st.t, x, (up ? y : Math.max(y, cy + 0.15)) + 0.3, W(x), up ? Math.max(0.68, cy - 0.2 - y - 0.3) : 1.3, { max: 11.5, ls: 1.15 });
          });
        },
        async (d) => { // dusk: italic figures, an arrow carried on the wind between the columns
          const s = await open('deep', PM), n = d.steps.length, gap = 0.5, w = (8.6 - gap * (n - 1)) / n; no(s, PM);
          T(s, d.title, 0.7, 0.28, 8.6, 0.95, { color: P, italic: true });
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, String(i + 1), x, 1.3, w, 0.85, { max: 50, min: 30, color: SK, italic: true, valign: 'bottom' });
            if (i < n - 1) k.txt(s, '→', x + w + 0.03, 1.65, 0.44, 0.4, { size: 18, color: SK, align: 'center', valign: 'middle', font: F.head });
            h3(s, st.h, x, 2.22, w, 0.48, { color: P });
            p(s, st.t, x, 2.72, w, 2.45, { color: P, max: 12.5 });
          });
        },
        async (d) => { // a stream winding down the middle, the steps on one bank then the other
          const s = await open('river'), n = d.steps.length, hh = 3.85 / n; no(s);
          T(s, d.title, 0.9, 0.25, 8.2, 0.85, { align: 'center', max: 24 });
          d.steps.forEach((st, i) => {
            const y = 1.3 + i * hh, left = i % 2 === 0, x = left ? 0.7 : 5.75, al = left ? 'right' : 'left';
            k.head(s, String(i + 1), left ? 4.0 : 5.2, y - 0.04, 0.5, 0.42, { max: 24, min: 16, color: A, italic: true, align: left ? 'right' : 'left', valign: 'top' });
            h3(s, st.h, left ? 0.7 : 5.75, y, 3.25, 0.32, { align: al, max: 13 });
            p(s, st.t, left ? 0.7 : 5.75, y + 0.32, 3.55, 0.82, { align: al, max: 12 }) ;
          });
        },
        async (d) => { // the gust lifts them: each step higher and further on, the title resting at the lower left
          const s = await open('gust', M, 0.7, 3.0), n = d.steps.length, w = n === 4 ? 2.05 : 2.75, sx = n === 4 ? 2.17 : 2.9, ys = n === 4 ? [2.65, 1.85, 1.1, 0.42] : [2.6, 1.55, 0.5]; no(s);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * sx, y = ys[i];
            k.head(s, `${i + 1}.  ${st.h}`, x, y, w, 0.48, { max: 13, min: 10.5, color: A, italic: true, valign: 'top' });
            p(s, st.t, x, y + 0.48, w, 1.12, { max: 11.5, ls: 1.15 });
          });
          T(s, d.title, 0.7, 0.42, n === 4 ? 4.2 : 5.2, 1.5, { valign: 'top', italic: true, max: 24 });
        },
      ],
      stats: [
        async (d) => { // dusk: the first figure wide over the water, the others to the side
          const s = await open('deep', PM), [a, ...rest] = d.stats; no(s, PM);
          T(s, d.title, 0.7, 0.28, 8.0, 0.85, { color: P, italic: true, max: 24 });
          k.head(s, a.value, 0.7, 1.25, 5.4, 1.8, { max: 84, min: 36, color: SK, italic: true });
          p(s, a.label, 0.7, 3.08, 5.0, 0.6, { color: P, max: 15, min: 11 });
          rest.forEach((x, i) => {
            const y = 1.35 + i * 1.2;
            k.head(s, x.value, 6.4, y, 2.9, 0.58, { max: 30, min: 16, color: P, italic: true, valign: 'top' });
            p(s, x.label, 6.4, y + 0.58, 2.9, 0.56, { color: PM, max: 12 });
          });
          if (d.note) p(s, d.note, 0.7, 3.78, 8.6, 1.38, { color: PM, max: 12, min: 9.5, valign: 'bottom' });
        },
        async (d) => { // open sky: three figures adrift, none at the same height
          const s = await open('sky'), ys = [1.55, 1.1, 1.75]; no(s);
          T(s, d.title, 0.7, 0.28, 7.5, 0.8, { italic: true, max: 24 });
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * 2.95, y = ys[i];
            k.head(s, x.value, xx, y, 2.7, 0.88, { max: 42, min: 22, color: A, italic: true, valign: 'bottom' });
            p(s, x.label, xx, y + 0.92, 2.7, 0.7, { max: 13 });
          });
          if (d.note) p(s, d.note, 0.7, 3.65, 8.6, 1.5, { max: 12, min: 9.5, valign: 'bottom' });
        },
      ],
      compare: [
        async (d) => { // a wavering line between day air and dusk, each side reading away from it
          const s = await open('tideV', M, 0.7, 3.9); no(s, PM);
          T(s, d.title, 0.7, 0.35, 3.9, 1.1, { valign: 'top', italic: true, max: 20 });
          const side = (sd, x, y0, w, hc, b, al) => {
            k.head(s, sd.h, x, y0, w, 0.46, { max: 18, min: 12, color: hc, italic: true, align: al });
            const hh = (5.17 - y0 - 0.55) / sd.items.length;
            sd.items.forEach((it, j) => p(s, it, x, y0 + 0.55 + j * hh, w, hh - 0.06, { color: b, max: 14, min: 10.5, align: al }));
          };
          side(d.left, 0.7, 1.55, 3.6, A, I, 'left');
          side(d.right, 6.05, 0.55, 3.4, SK, P, 'left');
        },
        async (d) => { // the water line across the page: air above, deep below
          const s = await open('tideH', PM); no(s);
          T(s, d.title, 0.7, 0.2, 7.5, 0.68, { italic: true, max: 22 });
          const lay = (sd, y, hc, b, rh) => {
            k.head(s, sd.h, 0.7, y, 2.45, 1.4, { max: 18, min: 12, color: hc, italic: true, valign: 'top' });
            sd.items.forEach((it, j) => p(s, it, 3.3 + (j % 2) * 3.1, y + (j >> 1) * rh, 2.95, rh - 0.05, { color: b, max: 13, min: 10.5 }));
          };
          lay(d.left, 0.98, A, I, 0.8);
          lay(d.right, 3.42, SK, P, 0.86);
        },
      ],
      statement: [
        async (d) => { // dusk: long italic words over still water
          const s = await open('deep', PM); no(s, PM);
          k.head(s, d.title, 0.7, 0.42, 7.2, 0.42, { max: 15, min: 11, color: SK, valign: 'top' });
          k.head(s, L.runs(d.text), 0.7, 0.9, 8.6, 2.85, { max: 38, min: 18, color: P, italic: true, valign: 'middle' });
          if (d.caption) p(s, d.caption, 0.7, 3.85, 7.4, 1.32, { color: PM, max: 12.5 });
        },
        async (d) => { // a gust crosses the page, the words low on the right, the caption up in the corner
          const s = await open('gust'); no(s);
          k.head(s, d.title, 0.7, 0.42, 3.6, 0.8, { max: 16, min: 11, color: A, valign: 'top' });
          if (d.caption) p(s, d.caption, 0.7, 1.25, 4.4, 1.35, { max: 12, color: M });
          k.head(s, L.runs(d.text), 2.2, 2.65, 7.1, 2.52, { max: 32, min: 17, color: I, align: 'right', valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // the wind lines overhead now, the years hanging under them on threads
          const s = await open('high'), w = 1.98, sx = 2.21, ys = [1.7, 1.45, 1.75, 1.5]; no(s);
          T(s, d.title, 0.7, 0.42, 8.2, 0.72, { max: 24, valign: 'top', italic: true });
          d.items.forEach((it, i) => {
            const x = 0.7 + i * sx, y = ys[i];
            t.line(s, x, 1.18, 0, y - 1.18 + 0.36, A, 0.75);
            k.head(s, it.year, x + 0.1, y, w - 0.1, 0.42, { max: 20, min: 12, color: A, italic: true, valign: 'top' });
            h3(s, it.h, x + 0.1, y + 0.44, w - 0.1, 0.3, { color: I, max: 13 });
            p(s, it.t, x + 0.1, y + 0.75, w - 0.1, 5.17 - y - 0.75, { max: 12.5 });
          });
        },
        async (d) => { // dusk: a thin rail, the years hanging left of it
          const s = await open('deep', PM), rh = 0.95; no(s, PM);
          T(s, d.title, 0.7, 0.25, 8.0, 0.85, { color: P, italic: true, max: 26 });
          t.line(s, 3.45, 1.25, 0, 3.8, SK, 0.75);
          d.items.forEach((it, i) => {
            const y = 1.25 + i * rh;
            k.head(s, it.year, 0.7, y, 2.55, rh - 0.1, { max: 26, min: 14, color: SK, italic: true, align: 'right', valign: 'top' });
            t.oval(s, 3.37, y + 0.1, 0.16, 0.16, SK);
            h3(s, it.h, 3.75, y, 5.55, 0.3, { color: P, max: 13 });
            p(s, it.t, 3.75, y + 0.3, 5.55, rh - 0.34, { color: PM, max: 12 });
          });
        },
        async (d) => { // open sky: four drifts of cloud, each year and event in its own patch of air
          const s = await open('sky'), w = 3.9; no(s);
          T(s, d.title, 0.7, 0.25, 7.5, 0.72, { italic: true, max: 24 });
          d.items.forEach((it, i) => {
            const x = i % 2 ? 5.4 : 0.7, y = (i >> 1) * 1.98 + (i % 2 ? 1.42 : 1.08);
            k.head(s, it.year, x, y, w, 0.5, { max: 24, min: 13, color: A, italic: true, valign: 'top' });
            h3(s, it.h, x, y + 0.52, w, 0.3, { color: I, max: 13 });
            p(s, it.t, x, y + 0.82, w, 0.85, { max: 12 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // nor the first process the rows of the cards
    R.timeline = V.timeline.shift(); // nor the first timeline
    return V;
  },
  tone: "yengil shabada: ravon, bemalol, aniq" });
