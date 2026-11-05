/** 183 Kraft — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 183, slug: 'kraft', name: "Kraft", mode: 'left', list: 'cols', num: 'corner', F: { head: 'Courier New', body: 'Calibri' },
  C: { ink: '2E2418', muted: '5E4E3A', accent: '8C3B2A' }, photo: { r: 0.0 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('C8A97E'), grain(0.14,0.6), raw(Array.from({length:40},(_,i)=>`<path d="M${(i*97)%1600},${(i*53)%900} q30,8 60,2" stroke="#8C7050" stroke-width="1.2" fill="none" opacity="0.35"/>`).join(''))),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, on parcel paper: a shipping tag, cut strips, pinking shears, running stitches, a shop receipt: a deck's pages must not look alike (L.pages)
    const KR = 'C8A97E', LABEL = 'D8BE97';
    const open = async (d, x = 0.7, y = 0.45, w = 8.6, h = 0.9, o = {}) => { const s = await slide('page'); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: C.ink, valign: 'bottom', ...o }); num(s); k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: C.muted }); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 15, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: C.ink, valign: 'top', ...o });
    const stitch = (s, x, y, w, h = 0, c = C.accent) => t.line(s, x, y, w, h, c, 1, { dash: 'dash' });
    const typed = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, bold: true, color: C.accent, font: F.head, ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 60, min: 18, color: C.accent, ...o });
    const ic = async (s, it, x, y, z, c = C.accent) => t.img(s, await L.icon(it.icon, c, 1.75), x, y, z, z);
    const zig = (() => { const pts = [[0, 0], [1, 0]], n = 40; for (let i = n; i >= 0; i--) pts.push([i / n, i % 2 ? 0.94 : 1]); return pts; })();
    const V = {
      image: [
        async (d) => { // the picture is a shipping tag, tied on at the right
          const s = await open(d, 0.7, 0.45, 4.85, 1.0);
          t.img(s, await L.photo(L.src(d.image), 3.35, 4.7, { mask: { poly: [[0.2, 0], [0.8, 0], [1, 0.14], [1, 1], [0, 1], [0, 0.14]] } }), 5.95, 0.42, 3.35, 4.7, { alt: '' });
          t.oval(s, 7.52, 0.58, 0.2, 0.2, KR, { line: { color: C.ink, width: 0.75 } });
          p(s, d.text, 0.7, 1.65, 4.85, 3.4, { ls: 1.3 });
        },
        async (d) => { // cut across the top with pinking shears, title and words below the teeth
          const s = await open({});
          t.img(s, await L.photo(L.src(d.image), 10, 2.75, { mask: { poly: zig } }), 0, 0, 10, 2.75, { alt: '' });
          k.head(s, d.title, 0.7, 2.95, 3.0, 2.15, { max: 22, min: 13, color: C.ink, valign: 'top' });
          t.line(s, 3.95, 3.0, 0, 2.05, C.accent, 1, { dash: 'dash' });
          p(s, d.text, 4.2, 2.95, 5.1, 2.15, { max: 13.5 });
        },
        async (d) => { // the picture fills the sheet, a paper label stitched on it
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: C.muted });
          t.rect(s, 0.7, 2.05, 6.5, 2.8, LABEL, { name: 'Label' });
          t.rect(s, 0.8, 2.15, 6.3, 2.6, null, { name: 'Stitches', line: { color: C.accent, width: 1, dashType: 'dash' } });
          k.head(s, d.title, 1.0, 2.25, 5.4, 0.72, { max: 18, min: 12, color: C.ink, valign: 'top' });
          typed(s, String(k.idx).padStart(2, '0'), 6.4, 2.27, 0.55, 0.3, { size: 10, align: 'right' });
          p(s, d.text, 1.0, 3.0, 5.9, 1.68, { max: 12.5, ls: 1.15 });
        },
        async (d) => { // the picture cut into three uneven strips, the words beside them
          const s = await open(d, 4.75, 0.45, 4.55, 1.0);
          t.img(s, await L.photo(L.src(d.image), 3.75, 5.05, { mask: { path: 'M0,0.12 H0.31 V0.9 H0 Z M0.345,0 H0.655 V1 H0.345 Z M0.69,0.07 H1 V0.82 H0.69 Z' } }), 0.7, 0.2, 3.75, 5.05, { alt: '' });
          p(s, d.text, 4.75, 1.65, 4.55, 3.4, { ls: 1.3 });
        },
      ],
      cards: [
        async (d) => { // tags on a line: each hangs on a string of its own length
          const s = await page(d), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, ly = 1.5;
          stitch(s, 0, ly, 10);
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = ly + (i % 2 ? 0.55 : 0.14);
            t.line(s, x + 0.17, ly, 0, y - ly + 0.02, C.ink, 0.75);
            await ic(s, it, x, y + 0.04, 0.36);
            h3(s, it.h, x, y + 0.46, w, 0.5, { max: 13 });
            p(s, it.t, x, y + 0.98, w, 5.08 - y - 0.98, { max: 12.5, min: 10, ls: 1.12 });
          }
        },
        async (d) => { // a ledger: typed number, heading, the words, a stitch under each row
          const s = await page(d), n = d.items.length, hh = 3.52 / n;
          d.items.forEach((it, i) => {
            const y = 1.55 + i * hh;
            typed(s, `[${i + 1}]`, 0.7, y + 0.03, 0.6, 0.3, { size: 13 });
            h3(s, it.h, 1.35, y + 0.03, 2.65, hh - 0.14);
            p(s, it.t, 4.2, y + 0.03, 5.1, hh - 0.14, { max: 13, min: 10, ls: 1.12 });
            if (i < n - 1) stitch(s, 0.7, y + hh - 0.05, 8.6, 0, C.muted);
          });
        },
        async (d) => { // four corners about a cross of stitches; with three, the first takes the whole left side
          const s = await page(d), n = d.items.length, cx = 5, cy = 3.3, w = 3.95;
          t.line(s, cx, 1.55, 0, 3.5, C.accent, 1, { dash: 'dash' }); stitch(s, n === 3 ? cx : 0.7, cy, n === 3 ? 4.3 : 8.6);
          for (const [i, it] of d.items.entries()) {
            const col = n === 3 ? (i ? 1 : 0) : i % 2, row = n === 3 ? Math.max(0, i - 1) : Math.floor(i / 2), tall = n === 3 && !i;
            const x = col ? cx + 0.3 : 0.7, y = row ? cy + 0.12 : 1.55;
            if (tall) { await ic(s, it, x, y + 0.1, 0.9); h3(s, it.h, x, y + 1.15, w - 0.1, 0.5, { max: 15 }); p(s, it.t, x, y + 1.7, w - 0.1, 1.8, { max: 14 }); continue; }
            await ic(s, it, x, y + 0.02, 0.36);
            h3(s, it.h, x + 0.48, y + 0.02, w - 0.48, 0.4, { valign: 'middle' });
            p(s, it.t, x, y + 0.48, w, 1.13, { max: 12.5, min: 10, ls: 1.12 });
          }
        },
        async (d) => { // parcels laid unevenly: rows pushed left and right, the icon out at the page edge
          const s = await page(d), n = d.items.length, hh = 3.55 / n, w = 6.3;
          for (const [i, it] of d.items.entries()) {
            const y = 1.5 + i * hh, r = i % 2 === 1, x = r ? 3.0 : 0.7, z = Math.min(0.62, hh - 0.25);
            await ic(s, it, r ? 9.3 - z : 0.7, y + 0.06, z);
            const tx = r ? x : x + z + 0.22, tw = w - z - 0.22;
            h3(s, it.h, tx, y + 0.03, tw, 0.28, { align: r ? 'right' : 'left', max: 13.5 });
            p(s, it.t, tx, y + 0.32, tw, hh - 0.38, { align: r ? 'right' : 'left', max: 12.5, min: 10, ls: 1.1 });
          }
        },
      ],
      process: [
        async (d) => { // stairs of paper: each step lower and further on, a stitch on its tread
          const s = await page(d), n = d.steps.length, gap = 0.2, w = (8.6 - gap * (n - 1)) / n, dy = n === 4 ? 0.6 : 0.82;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = 1.5 + i * dy, hh = 5.08 - y;
            stitch(s, x, y, w);
            typed(s, String(i + 1), x, y + 0.05, 0.5, 0.42, { size: 22 });
            h3(s, st.h, x + 0.42, y + 0.07, w - 0.42, 0.5, { max: 12.5 });
            p(s, st.t, x, y + 0.6, w, Math.min(hh - 0.6, 1.72), { max: 13.5, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // a seam down the middle, the steps on either side of it in turn
          const s = await page(d), n = d.steps.length, bh = n === 4 ? 1.42 : 1.55, dy = (3.55 - bh) / (n - 1), cx = 5;
          d.steps.forEach((st, i) => {
            const y = 1.5 + i * dy, r = i % 2 === 1;
            typed(s, String(i + 1), cx - 0.25, y, 0.5, 0.34, { size: 17, align: 'center' });
            if (i < n - 1) t.line(s, cx, y + 0.38, 0, dy - 0.42, C.accent, 1, { dash: 'dash' });
            h3(s, st.h, r ? cx + 0.4 : 0.7, y + 0.02, 3.9, 0.3, { align: r ? 'left' : 'right' });
            p(s, st.t, r ? cx + 0.4 : 0.7, y + 0.34, 3.9, bh - 0.36, { align: r ? 'left' : 'right', max: 12.5, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // an instruction leaflet: title alone on the flap, the steps on the sheet
          const s = await open(d, 0.7, 0.75, 2.75, 3.4, { max: 26, valign: 'top' }), n = d.steps.length, hh = 4.55 / n;
          t.line(s, 3.75, 0.55, 0, 4.55, C.ink, 0.75);
          d.steps.forEach((st, i) => {
            const y = 0.6 + i * hh;
            big(s, String(i + 1), 4.0, y - 0.05, 0.7, Math.min(0.85, hh - 0.1), { max: 40, valign: 'top' });
            h3(s, st.h, 4.75, y, 4.55, 0.3);
            p(s, st.t, 4.75, y + 0.32, 4.55, hh - 0.4, { max: 12.5, min: 10, ls: 1.12 });
          });
        },
        async (d) => { // the words first, a big pale stamp closing each column
          const s = await page(d), n = d.steps.length, gap = 0.35, w = (8.6 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            t.text(s, String(i + 1), { x, y: 3.75, w, h: 1.35, fontFace: F.head, bold: true, fontSize: 84, color: C.accent, transparency: 72, align: 'right', valign: 'bottom', noShrink: true });
            h3(s, st.h, x, 1.55, w, 0.55);
            p(s, st.t, x, 2.12, w, 2.6, { max: 13.5, min: 10, ls: 1.15 });
          });
        },
      ],
      stats: [
        async (d) => { // a shop receipt: words on the left, dotted to the figure on the right
          const s = await page(d), x = 1.9, w = 6.2, rh = d.note ? 0.82 : 1.05;
          d.stats.forEach((v, i) => {
            const y = 1.5 + i * rh;
            p(s, v.label, x, y, 3.3, rh - 0.1, { max: 12, min: 10, ls: 1.08, valign: 'bottom' });
            t.line(s, x + 3.35, y + rh - 0.14, 0.55, 0, C.ink, 1, { dash: 'sysDot' });
            k.head(s, v.value, x + 3.95, y, w - 3.95, rh - 0.08, { max: 26, min: 13, color: C.accent, align: 'right', valign: 'bottom' });
          });
          stitch(s, x, 1.5 + 3 * rh + 0.04, w, 0, C.ink);
          if (d.note) p(s, d.note, x, 1.5 + 3 * rh + 0.12, w, 5.1 - (1.5 + 3 * rh + 0.12), { max: 11, min: 9.5, ls: 1.08, color: C.muted });
        },
        async (d) => { // one figure stamped large; the other two typed small beneath it
          const s = await page(d), [a, ...rest] = d.stats;
          big(s, a.value, 0.7, 1.4, 6.0, 1.5, { max: 88, min: 30, valign: 'top' });
          p(s, a.label, 6.8, 1.55, 2.5, 1.35, { max: 13.5, min: 10.5, valign: 'bottom' });
          stitch(s, 0.7, 3.0, 8.6);
          rest.forEach((v, i) => {
            const x = 0.7 + i * 2.85;
            k.head(s, v.value, x, 3.1, 2.65, 0.6, { max: 26, min: 13, color: C.ink, valign: 'top' });
            p(s, v.label, x, 3.72, 2.65, 1.35, { max: 12, min: 10, ls: 1.1 });
          });
          if (d.note) p(s, d.note, 6.4, 3.14, 2.9, 1.93, { max: 11, min: 9.5, ls: 1.08, color: C.muted });
        },
      ],
      compare: [
        async (d) => { // two parcels, one over the other, a stitched seam between; each list runs across
          const s = await page(d), hh = 1.72;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.52 + i * (hh + 0.08);
            k.head(s, side.h, 0.7, y + 0.04, 2.2, hh - 0.12, { max: 17, min: 12, color: i ? C.accent : C.ink, valign: 'top' });
            side.items.forEach((it, j) => {
              const x = 3.1 + (j % 2) * 3.2, yy = y + 0.04 + Math.floor(j / 2) * 0.82;
              p(s, it, x, yy, 3.0, 0.78, { max: 12.5, min: 10, ls: 1.1 });
            });
            if (!i) stitch(s, 0.7, y + hh + 0.03, 8.6);
          });
        },
        async (d) => { // two slips laid askew: one high at the left, one low at the right, a slanting seam between
          const s = await page(d), w = 3.95, hh = 2.15;
          [d.left, d.right].forEach((side, i) => {
            const x = i ? 5.35 : 0.7, y = i ? 2.92 : 1.5, al = i ? 'right' : 'left';
            k.head(s, side.h, x, y, w, 0.34, { max: 15, min: 11, color: i ? C.accent : C.ink, align: al, valign: 'top' });
            const { rows, fs } = L.rowsFit([side.items], 14, w, F.body, 0.1, hh - 0.4);
            let yy = y + 0.38;
            side.items.forEach((it, j) => { k.txt(s, it, x, yy, w, rows[j], { size: fs, color: C.ink, align: al }); yy += rows[j]; });
          });
          t.line(s, 4.75, 1.55, 0.5, 3.5, C.accent, 1, { dash: 'dash', flipV: false });
        },
      ],
      statement: [
        async (d) => { // a label: stitched corners, the sentence in the middle, the note typed beneath
          const s = await open(d, 0.7, 0.3, 7.6, 0.75, { max: 18, valign: 'middle' }), x0 = 0.7, x1 = 9.3, y0 = 1.15, y1 = 5.1, c = 0.5;
          [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]].forEach(([x, y, a, b]) => {
            t.line(s, a > 0 ? x : x - c, y, c, 0, C.accent, 1, { dash: 'dash' }); t.line(s, x, b > 0 ? y : y - c, 0, c, C.accent, 1, { dash: 'dash' });
          });
          k.head(s, L.runs(d.text), 1.15, 1.3, 7.7, 2.35, { max: 30, min: 16, color: C.ink, align: 'center', valign: 'middle' });
          if (d.caption) p(s, d.caption, 1.5, 3.7, 7.0, 1.28, { max: 12, min: 10, align: 'center', color: C.muted, ls: 1.1 });
        },
        async (d) => { // typed low and large; the title and note small above it, a stitch between
          const s = await open({});
          k.head(s, d.title, 0.7, 0.42, 3.0, 1.55, { max: 15, min: 11, color: C.accent, valign: 'top' });
          if (d.caption) p(s, d.caption, 3.95, 0.42, 4.85, 1.55, { max: 11.5, min: 9.5, color: C.muted, ls: 1.08 });
          stitch(s, 0.7, 2.1, 8.6);
          k.head(s, L.runs(d.text), 0.7, 2.2, 8.6, 2.9, { max: 32, min: 16, color: C.ink, valign: 'top' });
        },
      ],
      timeline: [
        async (d) => { // a running stitch through the years, events above and below it in turn
          const s = await page(d), ly = 3.28, w = 3.3, xs = [0.7, 2.65, 4.6, 6.0];
          stitch(s, 0, ly, 10);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.5 : ly + 0.12;
            t.line(s, x, up ? ly - 0.12 : ly, 0, 0.12, C.accent, 1.5);
            typed(s, it.year, x, y, w, 0.3, { max: 13 });
            h3(s, it.h, x, y + 0.3, w, 0.28, { max: 12.5 });
            p(s, it.t, x, y + 0.58, w, ly - 1.5 - 0.66, { max: 12, min: 10, ls: 1.08 });
          });
        },
        async (d) => { // the years on tickets down the middle, what happened at the left, what it meant at the right
          const s = await page(d), hh = 3.52 / 4;
          d.items.forEach((it, i) => {
            const y = 1.55 + i * hh;
            h3(s, it.h, 0.7, y, 2.65, hh - 0.08, { align: 'right', valign: 'middle' });
            typed(s, `[${it.year}]`, 3.45, y, 1.75, hh - 0.08, { max: 13, align: 'center', valign: 'middle' });
            p(s, it.t, 5.3, y, 4.0, hh - 0.06, { max: 12, min: 10, ls: 1.08, valign: 'middle' });
            if (i < 3) stitch(s, 3.9, y + hh - 0.04, 0.85, 0, C.muted);
          });
        },
        async (d) => { // parcel labels on end: each year stands up the side of its column
          const s = await page(d), w = 2.15;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * w, H = 3.45;
            k.txt(s, it.year, x + 0.27 - H / 2, 1.55 + H / 2 - 0.27, H, 0.54, { size: 24, bold: true, font: F.head, color: C.accent, rotate: 270, align: 'right', valign: 'middle', ls: 1 });
            h3(s, it.h, x + 0.6, 1.6, w - 0.72, 0.62, { max: 11.5, min: 10 });
            p(s, it.t, x + 0.6, 2.25, w - 0.72, 2.8, { max: 11.5, min: 10, ls: 1.1 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); // nor the first steps and years the columns of the cards
    return V;
  },
  tone: "hunarmandona: sodda, amaliy va samimiy" });
