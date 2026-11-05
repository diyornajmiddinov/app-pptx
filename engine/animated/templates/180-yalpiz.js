/** 180 Yalpiz — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 180, slug: 'yalpiz', name: "Yalpiz", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '173B36', muted: '4E6E68', accent: '12867A' }, photo: 'circle', rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('DDF3EC'), blobs([[300,700,320,'FFFFFF',0.8],[1400,200,260,'C6EADF',0.9]],150)),
  // a sprig of mint: leaf-shaped pictures, a stem with leaves, water drops, shoots rising from the ground, midrib and veins
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const pg = (s, x = 8.3, y = 0.12, a = 'right', size = 22) => k.txt(s, String(k.idx).padStart(2, '0'), x, y, 1.1, 0.42, { size, bold: true, color: C.accent, font: F.head, align: a, ls: 1 });
    const foot = (s, x = 0.6, w = 8.8) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted });
    const open = async (d, x = 0.6, y = 0.32, w = 7.6, h = 0.85, o = {}, n = [], kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: TI, valign: 'middle', ...o }); pg(s, ...n); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14.5, min: 10.5, color: C.accent, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, color: C.accent, ...o });
    const ln = (s, x, y, w, h = 0, wt = 0.75, o = {}) => t.line(s, x, y, w, h, C.accent, wt, o);
    const seg = (s, x1, y1, x2, y2, wt = 0.75) => ln(s, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1), wt, (x2 - x1) * (y2 - y1) < 0 ? { flipV: true } : {});
    const LEAF = 'M0,1 C0,0.4 0.4,0 1,0 C1,0.6 0.6,1 0,1 Z', DROP = 'M0.5,0 C0.62,0.25 1,0.45 1,0.68 A0.5,0.32 0 0 1 0,0.68 C0,0.45 0.38,0.25 0.5,0 Z';
    const shape = async (s, d, x, y, w, h, o = {}) => { const W = Math.round(w * 200), H = Math.round(h * 200), key = `sh${d.length}${W}x${H}${o.fill ? 'f' : 'l'}${o.flip ? 'r' : ''}`; t.img(s, await k.svg(key, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="-0.01 -0.01 1.02 1.02" preserveAspectRatio="none"><path ${o.flip ? 'transform="translate(1,0) scale(-1,1)"' : ''} d="${d}" fill="${o.fill ? '#' + C.accent : 'none'}" ${o.fill ? '' : `stroke="#${C.accent}" stroke-width="2.5" vector-effect="non-scaling-stroke"`}/></svg>`, W, H), x, y, w, h, { alt: '' }); };
    const V = {
      image: [
        async (d) => { // one great leaf of picture, the words at its side
          const s = await open(d, 0.6, 0.45, 4.1, 1.1, { valign: 'bottom', max: 24 }, [0.6, 4.72, 'left', 22]);
          await k.photo(s, d.image, 4.95, 0.3, 4.75, 4.85, { mask: { path: LEAF } });
          p(s, d.text, 0.6, 1.65, 4.45, 3.05, { max: 13 });
        },
        async (d) => { // the picture in one big drop of water
          const s = await open(d, 4.35, 0.45, 5.05, 1.05, { valign: 'bottom', max: 24 });
          await k.photo(s, d.image, 0.6, 0.2, 3.4, 4.95, { mask: { path: DROP } });
          p(s, d.text, 4.35, 1.6, 5.05, 3.52);
        },
        async (d) => { // half a slice hanging from the top edge, title and words side by side under it
          const s = await open(d, 0.6, 2.8, 3.05, 1.75, { valign: 'top', max: 22 }, [0.6, 4.65, 'left', 22]);
          await k.photo(s, d.image, 1.5, 0, 7, 2.62, { mask: { path: 'M0,0 H1 A0.5,1 0 0 1 0,0 Z' } });
          p(s, d.text, 3.9, 2.8, 5.5, 2.33, { max: 13 });
        },
        async (d) => { // the picture whole, one clear mint disc on it holding everything
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          t.oval(s, 4.8, 0.13, 4.94, 4.94, 'DDF3EC', { name: 'Disc' });
          k.head(s, d.title, 5.65, 0.5, 3.25, 0.82, { max: 18, min: 12, color: TI, align: 'center', valign: 'bottom' });
          p(s, d.text, 5.32, 1.38, 3.9, 2.7, { align: 'center', max: 12.5 });
          pg(s, 6.72, 4.15, 'center', 18);
          foot(s);
        },
      ],
      cards: [
        async (d) => { // ringed icons in full-width columns
          const s = await open(d), n = d.items.length, gap = 0.34, w = (8.8 - gap * (n - 1)) / n, D = 0.72;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap);
            t.oval(s, x, 1.36, D, D, null, { line: { color: C.accent, width: 1 } });
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x + 0.18, 1.54, 0.36, 0.36);
            h3(s, it.h, x, 2.2, w, 0.54);
            p(s, it.t, x, 2.76, w, 2.36, { max: 13.5 });
          }
        },
        async (d) => { // the title keeps its column, four small plots in the field beside it
          const s = await page(d), n = d.items.length, w = 2.5, H = 2.3;
          for (const [i, it] of d.items.entries()) {
            const whole = n === 3 && i === 2, x = 4.15 + (i % 2) * (w + 0.25), y = 0.55 + Math.floor(i / 2) * H, ww = whole ? 2 * w + 0.25 : w;
            t.img(s, await L.icon(it.icon, C.accent, 1.75), x, y, 0.32, 0.32);
            h3(s, it.h, x, y + 0.38, ww, whole ? 0.3 : 0.5, { max: 13.5 });
            p(s, it.t, x, y + (whole ? 0.7 : 0.9), ww, H - (whole ? 0.75 : 0.95), { max: 13 });
          }
          ln(s, 3.85, 0.6, 0, 4.45, 0.5);
        },
        async (d) => { // shoots: each item on its own stalk, every one taller than the last
          const s = await open(d, 0.6, 0.38, 5.7, 1.0, { valign: 'top', max: 24 }), n = d.items.length, gap = 0.28, w = (8.8 - gap * (n - 1)) / n, tops = n === 4 ? [2.45, 1.95, 1.45, 0.62] : [2.2, 1.5, 0.62];
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = tops[i];
            ln(s, x, y, 0, 5.14 - y, 1);
            await shape(s, LEAF, x, y - 0.26, 0.3, 0.26, { fill: true });
            h3(s, it.h, x + 0.14, y + 0.05, w - 0.14, 0.5, { max: 13.5 });
            p(s, it.t, x + 0.14, y + 0.56, w - 0.14, 5.12 - y - 0.56, { max: 13 });
          }
          ln(s, 0.6, 5.14, 8.8, 0, 1);
        },
        async (d) => { // the page turned round: the title in the right-hand column, the items to the left of it, flush to the line
          const s = await open(d, 6.75, 0.6, 2.65, 3.2, { valign: 'top', max: 26 }, [8.3, 4.5]), n = d.items.length, H = 4.62 / n;
          ln(s, 6.45, 0.55, 0, 4.58, 1);
          for (const [i, it] of d.items.entries()) {
            const y = 0.5 + i * H;
            t.img(s, await L.icon(it.icon, C.accent, 1.75), 5.85, y + 0.02, 0.32, 0.32);
            h3(s, it.h, 0.6, y, 5.1, 0.36, { align: 'right', valign: 'middle' });
            p(s, it.t, 0.6, y + 0.38, 5.57, H - 0.44, { align: 'right', max: 13.5 });
          }
        },
      ],
      process: [
        async (d) => { // a stem growing up the page: step one at the root, a leaf for every step, by turns
          const s = await open(d, 1, 0.26, 7.2, 0.72, { align: 'center', max: 22 }), n = d.steps.length, H = 4.08 / n, cx = 5, w = 3.95;
          ln(s, cx, 1.04, 0, 4.14, 1.25); ln(s, 3.8, 5.18, 2.4, 0, 1);
          for (const [i, st] of d.steps.entries()) {
            const y = 1.06 + (n - 1 - i) * H, l = i % 2 === 0, x = l ? cx - 0.56 - w : cx + 0.56, a = l ? 'right' : 'left';
            await shape(s, LEAF, l ? cx - 0.46 : cx, y + 0.02, 0.46, 0.34, { fill: true, flip: l });
            h3(s, `${i + 1}   ${st.h}`, x, y, w, 0.3, { align: a, valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.31, w, H - 0.35, { align: a, max: 12.5, ls: 1.12 });
          }
        },
        async (d) => { // water drops in a row, a number in each; the title lies low
          const s = await open(d, 0.6, 4.38, 7.6, 0.78, { max: 22 }, [8.3, 4.55]), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + gap);
            await shape(s, DROP, x, 0.3, 0.62, 0.86);
            k.txt(s, String(i + 1), x, 0.56, 0.62, 0.55, { size: 16, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
            h3(s, st.h, x, 1.24, w, 0.52, { color: C.ink, max: 14 });
            p(s, st.t, x, 1.78, w, 2.5, { max: 13.5 });
          }
        },
        async (d) => { // a great curve from the lower corner holds the title, the steps follow its edge outward
          const s = await open({}), n = d.steps.length, Rr = 3.4, H = 4.72 / n, cy = 5.2;
          t.img(s, await k.svg('arc340', `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="340"><path d="M0,1.5 A338.5,338.5 0 0 1 338.5,340" fill="none" stroke="#${C.accent}" stroke-width="1.5"/></svg>`, 340, 340), 0, cy - Rr, Rr, Rr, { alt: '' });
          k.head(s, d.title, 0.5, 3.15, 2.2, 1.9, { max: 19, min: 12, color: TI, valign: 'bottom' });
          d.steps.forEach((st, i) => {
            const y = 0.42 + i * H, dy = cy - (y + H - 0.1), x = dy >= Rr ? 0.6 : Math.max(0.6, Math.sqrt(Rr * Rr - dy * dy) + 0.25), w = 9.4 - x;
            h3(s, `${i + 1}   ${st.h}`, x, y, Math.min(w, 7.4), 0.32, { valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.33, Math.min(w, 7.4), H - 0.38, { max: 13, ls: 1.14 });
          });
        },
        async (d) => { // a climbing vine winds up the field, the steps to one side and the other
          const s = await page(d), n = d.steps.length, H = 4.5 / n, cx = 6.82, wl = 2.42, wr = 2.3;
          t.img(s, await k.svg('vine', `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="460"><path d="M40,2 C76,60 4,110 40,170 C76,230 4,280 40,340 C70,390 20,420 40,458" fill="none" stroke="#${C.accent}" stroke-width="1.5"/></svg>`, 80, 460), cx - 0.3, 0.45, 0.6, 4.65, { alt: '' });
          d.steps.forEach((st, i) => {
            const y = 0.45 + i * H, l = i % 2 === 0, x = l ? 4.1 : 7.2, w = l ? wl : wr, a = l ? 'right' : 'left';
            h3(s, `${i + 1}  ${st.h}`, x, y, w, 0.3, { align: a, valign: 'middle', max: 13 });
            p(s, st.t, x, y + 0.31, w, 1.08, { align: a, max: 12, ls: 1.14 });
          });
        },
      ],
      stats: [
        async (d) => { // three figures straight across under the title
          const s = await open(d), w = 2.7, gap = 0.35;
          d.stats.forEach((x, i) => {
            const xx = 0.6 + i * (w + gap);
            ln(s, xx, 1.42, w, 0, 1.25);
            fig(s, x.value, xx, 1.5, w, 1.15, { max: 50, min: 20 });
            p(s, x.label, xx, 2.68, w, 0.95, { max: 14 });
          });
          if (d.note) p(s, d.note, 0.6, 3.8, 8.8, 1.32, { max: 13, color: C.muted });
        },
        async (d) => { // the chief figure in a round, two others to its right, the note under them; the title keeps its column
          const s = await page(d), [a, ...rest] = d.stats, D = 2.7;
          t.oval(s, 4.15, 0.45, D, D, null, { line: { color: C.accent, width: 1.25 } });
          fig(s, a.value, 4.4, 0.95, D - 0.5, 0.95, { max: 38, min: 18, align: 'center' });
          p(s, a.label, 4.5, 1.92, D - 0.7, 0.8, { align: 'center', max: 11.5 });
          rest.forEach((x, i) => {
            const y = 0.45 + i * 1.38;
            k.head(s, x.value, 7.1, y, 2.3, 0.62, { max: 26, min: 14, color: C.ink, valign: 'bottom' });
            p(s, x.label, 7.1, y + 0.64, 2.3, 0.68, { max: 11.5 });
          });
          if (d.note) p(s, d.note, 4.15, 3.3, 5.25, 1.82, { max: 12.5, color: C.muted });
        },
        async (d) => { // figures on stalks, rising to the right; the note on the ground under them
          const s = await open(d, 0.6, 0.38, 5.7, 1.0, { valign: 'top', max: 24 }), tops = [2.45, 1.6, 0.6], w = 2.65;
          d.stats.forEach((x, i) => {
            const xx = 0.6 + i * 3.08, y = tops[i];
            ln(s, xx, y, 0, 1.5, 1);
            fig(s, x.value, xx + 0.14, y, w - 0.14, 0.82, { max: 38, min: 18 });
            p(s, x.label, xx + 0.14, y + 0.84, w - 0.14, 0.66, { max: 12.5 });
          });
          if (d.note) p(s, d.note, 3.7, 3.65, 5.7, 1.47, { max: 12.5, color: C.muted });
        },
      ],
      compare: [
        async (d) => { // a leaf opened along its midrib: veins run out to each item, right and left
          const s = await open(d, 1, 0.26, 7.2, 0.72, { align: 'center', max: 22 }), w = 3.7;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.18, 3.1);
          h3(s, d.left.h, 0.6, 1.05, w, 0.5, { max: 18, align: 'right', valign: 'middle', color: C.ink });
          h3(s, d.right.h, 5.7, 1.05, w, 0.5, { max: 18, valign: 'middle' });
          ln(s, 5, 1.05, 0, 4.08, 1.25);
          let y = 1.7;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) { seg(s, 5, y + 0.3, 4.4, y + 0.12, 0.5); k.txt(s, d.left.items[j], 0.6, y, w, rh, { size: fs, color: C.ink, align: 'right' }); }
            if (d.right.items[j]) { seg(s, 5, y + 0.3, 5.6, y + 0.12, 0.5); k.txt(s, d.right.items[j], 5.7, y, w, rh, { size: fs, color: C.ink }); }
            y += rh;
          });
        },
        async (d) => { // one above the other in the field, the title keeps its column
          const s = await page(d), H = 2.3;
          [d.left, d.right].forEach((sd, i) => {
            const y = 0.5 + i * H, hh = (H - 0.56) / sd.items.length;
            ln(s, 4.15, y, 5.25, 0, i ? 0.75 : 1.25);
            k.head(s, sd.h, 4.15, y + 0.06, 5.25, 0.42, { max: 17, min: 11, color: i ? C.accent : C.ink, valign: 'middle' });
            sd.items.forEach((it, j) => p(s, it, 4.15, y + 0.5 + j * hh, 5.25, hh, { max: 13, valign: 'middle', ls: 1.05 }));
          });
        },
      ],
      statement: [
        async (d) => { // the sentence lies on one great leaf, title and note in the corners it leaves free
          const s = await open(d, 0.6, 0.38, 2.7, 1.1, { max: 15, min: 10.5, color: C.accent, valign: 'top' }, [8.3, 0.1], 'focus');
          await shape(s, LEAF, 0.6, 0.3, 7.9, 4.85);
          k.head(s, L.runs(d.text), 2.15, 1.15, 4.75, 2.6, { max: 26, min: 14, color: C.ink, align: 'center' });
          if (d.caption) p(s, d.caption, 6.6, 3.68, 2.8, 1.46, { max: 11.5, color: C.muted, ls: 1.1, valign: 'bottom' });
        },
        async (d) => { // a fresh, plain page: the sentence in the accent colour, a firm line, the rest under it
          const s = await open({}, 0, 0, 0, 0, {}, [8.3, 4.5], 'focus');
          k.head(s, L.runs(d.text), 0.6, 0.4, 8.8, 3.1, { max: 40, min: 18, color: C.accent, valign: 'top' });
          ln(s, 0.6, 3.6, 8.8, 0, 1.25);
          k.head(s, d.title, 0.6, 3.7, 2.8, 1.42, { max: 16, min: 11, color: TI, valign: 'top' });
          if (d.caption) p(s, d.caption, 3.65, 3.7, 4.65, 1.44, { max: 12.5, color: C.muted, ls: 1.12 });
        },
      ],
      timeline: [
        async (d) => { // a runner along the page, a leaf at each year, the words under it
          const s = await open(d), gap = 0.3, w = (8.8 - gap * 3) / 4, ly = 2.05;
          ln(s, 0.6, ly, 8.8, 0, 1.25);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap);
            await shape(s, LEAF, x, ly - 0.36, 0.42, 0.36, { fill: true });
            fig(s, it.year, x + 0.46, ly - 0.72, w - 0.46, 0.68, { max: 20, min: 11, align: 'left', valign: 'bottom' });
            h3(s, it.h, x, ly + 0.1, w, 0.5, { color: C.ink, max: 13.5 });
            p(s, it.t, x, ly + 0.62, w, 5.12 - ly - 0.62, { max: 13 });
          }
        },
        async (d) => { // the title in the right-hand column, years flush to the line from the left
          const s = await open(d, 6.75, 0.6, 2.65, 3.2, { valign: 'top', max: 24 }, [8.3, 4.5]), H = 1.16;
          ln(s, 6.45, 0.55, 0, 4.58, 1);
          d.items.forEach((it, i) => {
            const y = 0.5 + i * H;
            fig(s, it.year, 0.6, y, 1.75, H - 0.1, { max: 22, min: 11, align: 'left', valign: 'top' });
            h3(s, it.h, 2.4, y, 3.8, 0.3, { valign: 'middle', max: 13.5 });
            p(s, it.t, 2.4, y + 0.31, 3.8, H - 0.35, { max: 12, ls: 1.1 });
          });
        },
        async (d) => { // two and two, the year inside a small round
          const s = await open(d), w = 4.2, H = 1.88, D = 1.15;
          d.items.forEach((it, i) => {
            const x = 0.6 + (i % 2) * (w + 0.4), y = 1.32 + Math.floor(i / 2) * H;
            t.oval(s, x, y, D, D, null, { line: { color: C.accent, width: 1 } });
            k.head(s, it.year, x + 0.08, y, D - 0.16, D, { max: 18, min: 10, color: C.accent, align: 'center' });
            h3(s, it.h, x + D + 0.16, y, w - D - 0.16, 0.34, { valign: 'middle', max: 14 });
            p(s, it.t, x + D + 0.16, y + 0.36, w - D - 0.16, H - 0.42, { max: 12.5, ls: 1.12 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process, stats and timeline are the rows of the cards
    R.stats = V.stats.shift();
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "yangi va tetik: qisqa, aniq, tushunarli" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "playful"], "transitions": ["fade", "push:u", "dissolve"], "cover": ["riseWords", "springIn"], "mark": "springIn", "deco": "riseUp", "sig": {"title": "riseSettle", "body": "fadeUp", "item": "riseUp", "image": "springIn", "number": "springIn", "order": "seq", "stagger": 0.22}, "tempo": 1.2, "kenburns": true};
