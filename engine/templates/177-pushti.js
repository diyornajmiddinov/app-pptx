/** 177 Pushti — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 177, slug: 'pushti', name: "Puşti", mode: 'center', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '5A1E2E', muted: '744252', accent: 'B83B5E' }, photo: { r: 0.2 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'FDE7EC'],[1,'F8D3DC']])),
  // tenderness set on the centre line: everything balanced, rings that hold and overlap, a heart, petals of picture
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const foot = (s) => k.foot(s, { x: 1, w: 8, y: 5.3, size: 7.5, color: C.muted, align: 'center' });
    const open = async (d, x = 1, y = 0.45, w = 8, h = 0.9, o = {}, kind = 'page') => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: TI, align: 'center', valign: 'bottom', ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14.5, min: 10, color: C.ink, ls: 1.22, align: 'center', ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.accent, align: 'center', valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, color: C.accent, align: 'center', ...o });
    const ring = (s, x, y, d, wt = 0.75, o = {}) => t.oval(s, x, y, d, d, o.fill || null, { line: { color: C.accent, width: wt }, ...o });
    const nm = (s, v, x, y, d, size = 14) => k.txt(s, String(v), x, y, d, d, { size, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
    const V = {
      image: [
        async (d) => { // a round picture with a second ring beside it, like a shadow that stays close
          const s = await open(d, 5.3, 0.55, 4.2, 1.05);
          ring(s, 0.95, 0.8, 4.2); await k.photo(s, d.image, 0.6, 0.55, 4.2, 4.2, { mask: 'circle' });
          p(s, d.text, 5.3, 1.7, 4.2, 3.42);
        },
        async (d) => { // three petals of one picture, overlapping, title and words centred beneath
          const s = await open(d, 1, 2.55, 8, 0.6, { max: 22 });
          await k.photo(s, d.image, 2.2, 0.3, 5.6, 2.2, { mask: { path: 'M0,0.5 a0.196,0.5 0 1 1 0.393,0 a0.196,0.5 0 1 1 -0.393,0 Z M0.303,0.5 a0.196,0.5 0 1 1 0.393,0 a0.196,0.5 0 1 1 -0.393,0 Z M0.607,0.5 a0.196,0.5 0 1 1 0.393,0 a0.196,0.5 0 1 1 -0.393,0 Z' } });
          p(s, d.text, 1, 3.2, 8, 1.95, { max: 13.5 });
        },
        async (d) => { // the picture held in a heart
          const s = await open(d, 0.7, 0.6, 4.7, 1.0);
          await k.photo(s, d.image, 5.6, 0.62, 4.0, 4.48, { mask: { path: 'M0.5,1 C0.2,0.75 0,0.55 0,0.3 C0,0.12 0.14,0 0.28,0 C0.38,0 0.46,0.06 0.5,0.16 C0.54,0.06 0.62,0 0.72,0 C0.86,0 1,0.12 1,0.3 C1,0.55 0.8,0.75 0.5,1 Z' } });
          p(s, d.text, 0.7, 1.7, 4.7, 3.42);
        },
        async (d) => { // two half discs embrace the words from both edges of the page
          const s = await open(d, 2.45, 0.42, 5.1, 1.0);
          await k.photo(s, d.image, 0, 0.75, 10, 4.1, { mask: { path: 'M0,0 A0.205,0.5 0 0 1 0,1 Z M1,0 A0.205,0.5 0 0 0 1,1 Z' } });
          p(s, d.text, 2.45, 1.52, 5.1, 3.6);
        },
      ],
      cards: [
        async (d) => { // the words above, a soft white disc with its icon at the foot of each column
          const s = await page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n, D = 0.8;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), cx = x + w / 2;
            h3(s, it.h, x, 1.48, w, 0.54);
            p(s, it.t, x, 2.04, w, 2.2, { max: 14 });
            t.oval(s, cx - D / 2, 4.3, D, D, 'FFFFFF', { t: 25 });
            t.img(s, await L.icon(it.icon, C.accent, 1.5), cx - 0.2, 4.5, 0.4, 0.4);
          }
        },
        async (d) => { // a ring holds the title close, the items gather to its right, each with a fine icon
          const s = await open({}), n = d.items.length, H = 4.6 / n, D = 3.1;
          ring(s, 0.45, 1.05, D, 1);
          k.head(s, d.title, 0.85, 1.6, D - 0.8, 2.0, { max: 20, min: 12, color: TI, align: 'center' });
          for (const [i, it] of d.items.entries()) {
            const y = 0.5 + i * H;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), 3.95, y + 0.02, 0.32, 0.32);
            h3(s, it.h, 4.4, y, 5.0, 0.36, { align: 'left', valign: 'middle' });
            p(s, it.t, 4.4, y + 0.38, 5.0, H - 0.44, { align: 'left', max: 14 });
          }
        },
        async (d) => { // a smile: the outer columns stand high, the inner ones sink, the title rests above
          const s = await page(d), n = d.items.length, gap = 0.28, w = (9 - gap * (n - 1)) / n, ys = n === 4 ? [1.48, 2.02, 2.02, 1.48] : [1.48, 2.1, 1.48];
          d.items.forEach((it, i) => {
            const x = 0.5 + i * (w + gap), y = ys[i];
            h3(s, it.h, x, y, w, 0.5, { valign: 'bottom', max: 14 });
            p(s, it.t, x, y + 0.54, w, 5.12 - y - 0.54, { max: 13.5 });
          });
        },
        async (d) => { // a small flower: the title at the heart, the items as petals around it
          const n = d.items.length, s = await open({}), cx = 5, cy = n === 4 ? 2.66 : 1.95, D = 2.3;
          ring(s, cx - D / 2, cy - D / 2, D, 1); ring(s, cx - D / 2 + 0.12, cy - D / 2 + 0.12, D - 0.24, 0.5);
          k.head(s, d.title, cx - 0.82, cy - 0.68, 1.64, 1.36, { max: 16, min: 10.5, color: TI, align: 'center' });
          const spots = n === 4 ? [[0.55, 0.45, 'right'], [6.5, 0.45, 'left'], [0.55, 2.95, 'right'], [6.5, 2.95, 'left']] : [[0.55, 0.6, 'right'], [6.5, 0.6, 'left'], [2, 3.3, 'center']];
          spots.forEach(([x, y, a], i) => {
            const whole = n === 3 && i === 2, ww = whole ? 6 : 2.95, it = d.items[i];
            h3(s, it.h, x, y, ww, whole ? 0.34 : 0.52, { align: a, max: 14 });
            p(s, it.t, x, y + (whole ? 0.36 : 0.54), ww, whole ? 1.42 : 1.68, { align: a, max: 13 });
          });
        },
      ],
      process: [
        async (d) => { // rings linked hand in hand across the page, the words beneath
          const s = await page(d), n = d.steps.length, gap = 0.24, w = (9 - gap * (n - 1)) / n, D = 0.72, ly = 1.5;
          d.steps.forEach((st, i) => {
            const x = 0.5 + i * (w + gap), cx = x + w / 2;
            ring(s, cx - D / 2, ly, D, 1);
            nm(s, i + 1, cx - D / 2, ly, D, 16);
            if (i < n - 1) t.line(s, cx + D / 2, ly + D / 2, w + gap - D, 0, C.accent, 0.75);
            h3(s, st.h, x, ly + 0.8, w, 0.52, { color: C.ink, max: 14 });
            p(s, st.t, x, ly + 1.34, w, 5.12 - ly - 1.34, { max: 13.5 });
          });
        },
        async (d) => { // butterfly: the numbers on the centre line, the steps opening to either side
          const s = await open(d, 1, 0.3, 8, 0.72, { max: 22 }), n = d.steps.length, H = (5.14 - 1.12) / n, w = 3.95, D = 0.42;
          t.line(s, 5, 1.12, 0, 4.0, C.accent, 0.75);
          d.steps.forEach((st, i) => {
            const y = 1.12 + i * H, l = i % 2 === 0, x = l ? 5 - 0.32 - w : 5 + 0.32, a = l ? 'right' : 'left';
            ring(s, 5 - D / 2, y, D, 0.75, { fill: 'FBDCE3' });
            nm(s, i + 1, 5 - D / 2, y, D, 12);
            h3(s, st.h, x, y + 0.04, w, 0.34, { align: a, valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.4, w, Math.min(n === 4 ? 0.62 : 1.0, 5.14 - y - 0.4), { align: a, max: 13 });
          });
        },
        async (d) => { // a funnel: wide at the top, drawing in as the steps come closer, all on the centre line
          const s = await page(d), n = d.steps.length, H = 3.6 / n, w0 = 8.6, dw = n === 4 ? 1.2 : 1.8;
          d.steps.forEach((st, i) => {
            const w = w0 - i * dw, x = 5 - w / 2, y = 1.48 + i * H;
            h3(s, `${i + 1}   ${st.h}`, x, y, w, 0.3, { valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.31, w, H - 0.36, { max: 13, ls: 1.14 });
            if (i < n - 1) t.line(s, 5 - w / 4, y + H - 0.03, w / 2, 0, C.accent, 0.5, { t: 40 });
          });
        },
        async (d) => { // four leaves of a clover about a small heart of a point, the title under them
          const s = await open(d, 1, 4.42, 8, 0.72, { max: 22, valign: 'middle' }), n = d.steps.length, w = 4.15, H = 1.98;
          t.line(s, 5, 0.42, 0, n === 3 ? 1.9 : 3.86, C.accent, 0.5, { t: 25 }); t.line(s, 0.7, 2.35, 8.6, 0, C.accent, 0.5, { t: 25 });
          t.oval(s, 4.93, 2.28, 0.14, 0.14, C.accent);
          d.steps.forEach((st, i) => {
            const whole = n === 3 && i === 2, x = whole ? 1.8 : i % 2 ? 5.2 : 0.65, y = i < 2 ? 0.42 : 2.45, ww = whole ? 6.4 : w;
            h3(s, `${i + 1}   ${st.h}`, x, y, ww, 0.34, { valign: 'middle', max: 14 });
            p(s, st.t, x, y + 0.36, ww, 1.52, { max: 13.5 });
          });
        },
      ],
      stats: [
        async (d) => { // three rings overlapping, one figure in each
          const s = await open(d, 1, 0.3, 8, 0.72, { max: 22 }), D = 2.3, step = 2.05, x0 = 5 - D / 2 - step;
          d.stats.forEach((x, i) => {
            const xx = x0 + i * step;
            ring(s, xx, 1.1, D, 1);
            k.head(s, x.value, xx + 0.28, 1.1, D - 0.56, D, { max: 26, min: 13, color: C.accent, align: 'center' });
            p(s, x.label, xx - 0.05 + (D - step) / 2, 3.46, step - 0.1, 0.8, { max: 12.5 });
          });
          if (d.note) p(s, d.note, 1.2, 4.3, 7.6, 0.84, { max: 11.5, color: C.muted, ls: 1.12 });
        },
        async (d) => { // the largest on the centre line, its two companions leaning in from either side
          const s = await page(d), [a, b, c] = d.stats;
          fig(s, a.value, 2.9, 1.4, 4.2, 1.5, { max: 72, min: 26 });
          p(s, a.label, 3.1, 2.92, 3.8, 0.68, { max: 14 });
          [[b, 0.5, 'left'], [c, 7.3, 'right']].forEach(([x, xx, al]) => {
            k.head(s, x.value, xx, 1.75, 2.2, 0.72, { max: 28, min: 14, color: C.ink, align: al });
            p(s, x.label, xx, 2.5, 2.2, 1.0, { align: al, max: 12.5 });
          });
          if (d.note) { t.line(s, 4.5, 3.72, 1.0, 0, C.accent, 0.75); p(s, d.note, 1.4, 3.84, 7.2, 1.28, { max: 12, color: C.muted }); }
        },
      ],
      compare: [
        async (d) => { // two sides leaning together on the centre line, a small point at its head
          const s = await page(d), w = 3.95;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.18, 2.85);
          h3(s, d.left.h, 0.7, 1.45, w, 0.55, { max: 19, align: 'right', valign: 'middle', color: C.ink });
          h3(s, d.right.h, 5.35, 1.45, w, 0.55, { max: 19, align: 'left', valign: 'middle' });
          t.oval(s, 4.93, 1.62, 0.14, 0.14, C.accent); t.line(s, 5, 1.78, 0, 3.32, C.accent, 0.75);
          let y = 2.12;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // two great circles that just overlap, each holding its own side
          const s = await open(d, 1, 0.22, 7.2, 0.62, { max: 19 }), D = 4.3, y0 = 0.86;
          [[d.left, 0.5, C.ink], [d.right, 5.2, C.accent]].forEach(([sd, x, c]) => {
            ring(s, x, y0, D, 1);
            h3(s, sd.h, x + 0.8, y0 + 0.42, D - 1.6, 0.56, { max: 15, min: 10.5, color: c, valign: 'middle' });
            const hh = 2.28 / sd.items.length;
            sd.items.forEach((it, j) => p(s, it, x + 0.42, y0 + 1.02 + j * hh, D - 0.84, hh, { max: 13, valign: 'middle', ls: 1.1 }));
          });
        },
      ],
      statement: [
        async (d) => { // the sentence inside a great ring, the title and the note to its sides
          const s = await open(d, 0.5, 1.4, 2.0, 2.6, { max: 15, min: 10.5, color: C.accent, align: 'right', valign: 'middle' }, 'focus'), D = 4.75;
          ring(s, 5 - D / 2, 0.4, D, 1);
          k.head(s, L.runs(d.text), 3.2, 1.2, 3.6, 3.15, { max: 24, min: 14, color: C.ink, align: 'center' });
          if (d.caption) p(s, d.caption, 7.5, 0.9, 2.1, 3.85, { align: 'left', max: 11.5, color: C.muted, valign: 'middle', ls: 1.12 });
        },
        async (d) => { // the order turned over: the note above, the sentence, the title as a soft close
          const s = await open(d, 1, 4.42, 8, 0.72, { max: 17, min: 11, color: C.accent, valign: 'middle' }, 'focus');
          if (d.caption) p(s, d.caption, 1.5, 0.42, 7, 1.2, { max: 12.5, color: C.muted, ls: 1.14 });
          t.oval(s, 4.93, 1.68, 0.14, 0.14, C.accent);
          k.head(s, L.runs(d.text), 0.8, 1.88, 8.4, 2.5, { max: 34, min: 16, color: C.ink, align: 'center' });
        },
      ],
      timeline: [
        async (d) => { // years down the centre line: what happened on one side, what it meant on the other
          const s = await page(d), H = 0.9;
          d.items.forEach((it, i) => {
            const y = 1.5 + i * H;
            h3(s, it.h, 0.6, y, 2.95, H - 0.06, { align: 'right', valign: 'middle', color: C.ink });
            fig(s, it.year, 3.75, y, 1.5, H - 0.06, { max: 19, min: 10 });
            p(s, it.t, 5.4, y, 4.0, H - 0.04, { align: 'left', max: 12.5, valign: 'middle', ls: 1.1 });
          });
        },
        async (d) => { // the years in small rings along a gentle rise and fall
          const s = await page(d), gap = 0.25, w = (9 - gap * 3) / 4, ys = [1.98, 1.48, 1.48, 1.98], D = 0.92;
          d.items.forEach((it, i) => {
            const x = 0.5 + i * (w + gap), y = ys[i], cx = x + w / 2;
            ring(s, cx - D / 2, y, D, 0.75);
            k.head(s, it.year, cx - D / 2 + 0.05, y, D - 0.1, D, { max: 15, min: 9, color: C.accent, align: 'center' });
            h3(s, it.h, x, y + 0.98, w, 0.5, { color: C.ink, max: 13.5 });
            p(s, it.t, x, y + 1.5, w, 5.12 - y - 1.5, { max: 12.5, ls: 1.12 });
          });
        },
        async (d) => { // two and two, the year centred large over each entry
          const s = await page(d), w = 4.0, H = 1.8;
          d.items.forEach((it, i) => {
            const x = i % 2 ? 5.35 : 0.65, y = 1.42 + Math.floor(i / 2) * H;
            fig(s, it.year, x, y, w, 0.52, { max: 26, min: 13 });
            h3(s, it.h, x, y + 0.53, w, 0.28, { valign: 'middle', color: C.ink, max: 13.5 });
            p(s, it.t, x, y + 0.83, w, H - 0.88, { max: 12.5, ls: 1.12 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the original process and timeline are the rows of the cards
    R.timeline = V.timeline.shift();
    return V;
  },
  tone: "mehrli va yumshoq: g'amxo'rlik, iliq va sodda til" });
