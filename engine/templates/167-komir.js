/** 167 Ko'mir — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 167, slug: 'komir', name: "Kömir", mode: 'left', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Arial' },
  C: { ink: 'F2EEE8', muted: 'A8A39C', accent: 'F2A33A' }, photo: { r: 0.0 }, rule: true, caps: true, bold: true,
  bg: (kind) => compose(flat('1E1E1F'), rad(1500,0,900,[[0,'34302A',0.9],[1,'1E1E1F',0]]), grain(0.1)),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in charcoal: a poster: heavy capitals, hard edges, black-and-white pictures, few words: a deck's pages must not look alike (L.pages)
    const up = (v) => String(v).toUpperCase();
    const foot = (s, o = {}) => k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: C.muted, ...o });
    const open = async (kind, d, x, y, w, h, o = {}) => { const s = await slide(kind); if (d.title) k.head(s, up(d.title), x, y, w, h, { max: 28, min: 13, color: C.ink, valign: 'bottom', spacing: 1, ...o }); num(s); foot(s); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.15, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, up(v), x, y, w, h, { max: 14, min: 10, color: C.ink, valign: 'top', spacing: 0.5, ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, up(v), x, y, w, h, { max: 60, min: 18, color: C.accent, ...o });
    const lineH = (s, x, y, w, c = C.accent) => t.line(s, x, y, w, 0, c, 1);
    const lineV = (s, x, y, h, c = C.accent) => t.line(s, x, y, 0, h, c, 1);
    const side = (s, v, cx, cy, len, o = {}) => k.head(s, up(v), cx - len / 2, cy - 0.45, len, 0.9, { max: 20, min: 11, color: C.ink, rotate: 270, valign: 'middle', spacing: 1, ...o }); // a title stood on end
    const V = {
      image: [
        async (d) => { // a hard strip of black-and-white picture, the title cut against it
          const s = await open('page', {}, 0, 0, 0, 0);
          await k.photo(s, d.image, 0, 0, 10, 2.55, { gray: true });
          k.head(s, up(d.title), 0.7, 2.68, 3.0, 2.45, { max: 24, min: 13, color: C.accent, valign: 'top', spacing: 1 });
          p(s, d.text, 3.95, 2.7, 5.35, 2.45, { max: 14 });
        },
        async (d) => { // a square picture in the corner, words in the rest
          const s = await open('page', d, 0.7, 0.4, 5.3, 1.4, { max: 26, valign: 'top' });
          await k.photo(s, d.image, 6.4, 0, 3.6, 3.6, { gray: true });
          lineH(s, 0.7, 1.9, 5.3);
          p(s, d.text, 0.7, 2.02, 5.3, 3.13, { max: 14 });
        },
        async (d) => { // the picture fills the page, the title in big capitals at its foot, a black column of words
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625, { gray: true });
          t.rect(s, 0, 0, 10, 5.625, '1E1E1F', { t: 45, name: 'Soot' });
          t.rect(s, 5.7, 0, 4.3, 5.625, '1E1E1F', { t: 5, name: 'Soot' });
          k.head(s, up(d.title), 0.7, 2.6, 4.7, 2.55, { max: 30, min: 14, color: 'FFFFFF', valign: 'bottom', spacing: 1 });
          p(s, d.text, 6.0, 0.6, 3.5, 4.55, { max: 14, valign: 'bottom' });
          num(s); foot(s, { color: 'E6E2DC' });
        },
        async (d) => { // the picture cut in three hard slats
          const s = await open('page', d, 4.6, 0.4, 4.7, 1.3, { max: 26, valign: 'top' });
          t.img(s, await L.photo(L.src(d.image), 3.85, 5.0, { gray: true, mask: { path: 'M0,0 L0.3,0 L0.3,1 L0,1 Z M0.35,0 L0.65,0 L0.65,1 L0.35,1 Z M0.7,0 L1,0 L1,1 L0.7,1 Z' } }), 0.4, 0.15, 3.85, 5.0, { alt: '' });
          p(s, d.text, 4.6, 1.85, 4.7, 3.3, { max: 14 });
        },
      ],
      cards: [
        async (d) => { // a ledger: number, name, text, a hard line under each row
          const s = await page(d), n = d.items.length, hh = 3.55 / n;
          lineH(s, 0.7, 1.52, 8.6);
          d.items.forEach((it, i) => {
            const y = 1.55 + i * hh;
            big(s, String(i + 1).padStart(2, '0'), 0.7, y, 0.95, hh - 0.08, { max: 30, min: 16 });
            h3(s, it.h, 1.7, y + 0.03, 2.5, hh - 0.1, { valign: 'middle' });
            p(s, it.t, 4.3, y + 0.03, 5.0, hh - 0.1, { max: 13, ls: 1.05, valign: 'middle', color: C.muted });
            lineH(s, 0.7, y + hh - 0.02, 8.6, C.muted);
          });
        },
        async (d) => { // the first item takes the left half; the rest are stacked at the right
          const s = await page(d), [a, ...rest] = d.items, hh = 3.55 / rest.length;
          t.img(s, await L.icon(a.icon, C.accent, 2.25), 0.7, 1.55, 0.62, 0.62);
          k.head(s, up(a.h), 0.7, 2.25, 3.9, 0.95, { max: 24, min: 13, color: C.ink, valign: 'top', spacing: 0.5 });
          p(s, a.t, 0.7, 3.22, 3.9, 1.9, { max: 14 });
          lineV(s, 4.85, 1.55, 3.55);
          for (const [i, it] of rest.entries()) {
            const y = 1.55 + i * hh;
            t.img(s, await L.icon(it.icon, C.accent, 2), 5.1, y + 0.02, 0.3, 0.3);
            h3(s, it.h, 5.5, y, 3.8, 0.36, { valign: 'middle' });
            p(s, it.t, 5.1, y + 0.38, 4.2, hh - 0.44, { max: 12.5, ls: 1.05, color: C.muted });
          }
        },
        async (d) => { // the title stood on end up the left edge, the items beside it
          const s = await open('focus', {}, 0, 0, 0, 0), n = d.items.length, hh = 4.7 / n;
          side(s, d.title, 1.05, 2.68, 4.6);
          lineV(s, 1.65, 0.45, 4.7);
          for (const [i, it] of d.items.entries()) {
            const y = 0.42 + i * hh;
            big(s, String(i + 1), 1.9, y, 0.7, hh - 0.08, { max: 40, min: 20, valign: 'top' });
            h3(s, it.h, 2.65, y + 0.04, 6.65, 0.36, { max: 15 });
            p(s, it.t, 2.65, y + 0.42, 6.65, hh - 0.5, { max: 13.5, ls: 1.08 });
          }
        },
        async (d) => { // laid like bricks: the lower course shifted half a brick
          const s = await page(d), n = d.items.length, w = n === 4 ? 3.7 : 4.1, xs = n === 4 ? [0.7, 4.6, 1.75, 5.6] : [0.7, 5.2, 2.95], hh = 1.75;
          for (const [i, it] of d.items.entries()) {
            const x = xs[i], y = 1.52 + Math.floor(i / 2) * (hh + 0.05);
            lineH(s, x, y, w);
            t.img(s, await L.icon(it.icon, C.accent, 2), x, y + 0.1, 0.28, 0.28);
            h3(s, it.h, x + 0.36, y + 0.08, w - 0.36, 0.32, { valign: 'middle' });
            p(s, it.t, x, y + 0.45, w, hh - 0.5, { max: 13, ls: 1.05, color: C.muted });
          }
        },
      ],
      process: [
        async (d) => { // huge numbers with arrows between them, the words below
          const s = await page(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            big(s, String(i + 1), x, 1.4, 1.0, 1.05, { max: 66, min: 40, valign: 'middle' });
            if (i < n - 1) t.text(s, '→', { x: x + w - 0.7, y: 1.55, w: 0.7, h: 0.75, fontFace: F.head, bold: true, fontSize: 26, color: C.muted, align: 'right', valign: 'middle' });
            lineH(s, x, 2.5, w);
            h3(s, st.h, x, 2.58, w, 0.5);
            p(s, st.t, x, 3.1, w, 2.05, { max: 13, ls: 1.05 });
          });
        },
        async (d) => { // indented like a stepped wall, a hard line under each
          const s = await page(d), n = d.steps.length, hh = 3.58 / n, sh = n === 4 ? 0.62 : 0.9;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * sh, y = 1.52 + i * hh, w = 9.3 - x;
            big(s, String(i + 1), x, y, 0.6, hh - 0.08, { max: 34, min: 20, valign: 'top' });
            h3(s, st.h, x + 0.62, y + 0.03, w - 0.62, 0.33, { max: 14, valign: 'middle' });
            p(s, st.t, x + 0.62, y + 0.36, w - 0.62, hh - 0.42, { max: 13, ls: 1.03, color: C.muted });
            lineH(s, x, y + hh - 0.03, w);
          });
        },
        async (d) => { // a steel post down the middle, steps hung on it by turn
          const s = await page(d), n = d.steps.length, w = 3.85, cx = 5, hh = 3.58 / n;
          lineV(s, cx, 1.5, 3.65);
          d.steps.forEach((st, i) => {
            const right = i % 2 === 1, x = right ? cx + 0.3 : cx - 0.3 - w, y = 1.5 + i * hh, a = right ? 'left' : 'right';
            lineH(s, right ? cx : cx - 0.22, y + 0.17, 0.22);
            h3(s, `${i + 1}  ${st.h}`, x, y, w, 0.34, { align: a, valign: 'middle', color: C.accent });
            p(s, st.t, x, y + 0.35, w, Math.min(hh * (n === 4 ? 1.6 : 1) - 0.4, 5.16 - y - 0.35), { max: 12.5, ls: 1.05, align: a });
          });
        },
        async (d) => { // the steps in small type, the last one as the headline they lead to
          const s = await page(d), n = d.steps.length, rest = d.steps.slice(0, -1), last = d.steps[n - 1], gap = 0.3, w = (8.6 - gap * (rest.length - 1)) / rest.length, ly = 3.42;
          rest.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            h3(s, `${i + 1}  ${st.h}`, x, 1.52, w, 0.5, { max: 12.5, color: C.muted });
            p(s, st.t, x, 2.03, w, ly - 2.08, { max: 12.5, ls: 1.03, color: C.muted });
          });
          lineH(s, 0.7, ly, 8.6);
          big(s, String(n), 0.7, ly + 0.1, 1.1, 1.55, { max: 80, min: 44, valign: 'middle' });
          k.head(s, up(last.h), 1.9, ly + 0.1, 7.4, 0.62, { max: 24, min: 13, color: C.ink, valign: 'middle', spacing: 0.5 });
          p(s, last.t, 1.9, ly + 0.74, 7.4, 0.98, { max: 14, ls: 1.08 });
        },
      ],
      stats: [
        async (d) => { // one number as wide as the page, the others small under it
          const s = await page(d), [a, ...rest] = d.stats;
          big(s, a.value, 0.7, 1.45, 8.6, 1.65, { max: 110, min: 36, valign: 'middle' });
          p(s, a.label, 0.7, 3.1, 8.6, 0.38, { max: 13.5, ls: 1.02 });
          lineH(s, 0.7, 3.52, 8.6);
          rest.forEach((x, i) => {
            const xx = 0.7 + i * 2.9;
            k.head(s, up(x.value), xx, 3.58, 2.7, 0.5, { max: 24, min: 13, color: C.ink, valign: 'middle' });
            p(s, x.label, xx, 4.08, 2.7, 1.07, { max: 11.5, min: 9.5, color: C.muted, ls: 1.05 });
          });
          if (d.note) p(s, d.note, 6.5, 3.62, 2.8, 1.53, { max: 10.5, min: 9, color: C.muted, ls: 1.05 });
        },
        async (d) => { // big numbers flush against a post, their words on the far side
          const s = await page(d), rh = d.note ? 0.92 : 1.18;
          lineV(s, 4.3, 1.52, rh * 3 - 0.05);
          d.stats.forEach((x, i) => {
            const y = 1.5 + i * rh;
            big(s, x.value, 0.7, y, 3.4, rh - 0.06, { max: 44, min: 18, align: 'right', valign: 'middle' });
            p(s, x.label, 4.5, y, 4.8, rh - 0.06, { max: 15, valign: 'middle' });
          });
          if (d.note) p(s, d.note, 0.7, 4.32, 8.6, 0.83, { max: 11.5, min: 9.5, color: C.muted, ls: 1.05, valign: 'bottom' });
        },
        async (d) => { // four posts: three numbers and, in the last column, the note
          const s = await page(d), w = 1.95, gap = 0.27;
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * (w + gap);
            lineH(s, xx, 1.55, w);
            big(s, x.value, xx, 1.62, w, 1.1, { max: 34, min: 14, valign: 'top' });
            p(s, x.label, xx, 2.75, w, 2.38, { max: 13.5, ls: 1.08 });
          });
          if (d.note) { const xx = 0.7 + 3 * (w + gap); lineH(s, xx, 1.55, w, C.muted); p(s, d.note, xx, 1.65, w, 3.5, { max: 12, min: 9.5, color: C.muted, ls: 1.05 }); }
        },
      ],
      compare: [
        async (d) => { // two big capitals, right against the post in the middle
          const s = await page(d), w = 3.95, cx = 5;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.16, 2.55);
          k.head(s, up(d.left.h), 0.7, 1.48, w, 0.82, { max: 22, min: 12, color: C.accent, align: 'right', spacing: 0.5 }); k.head(s, up(d.right.h), 5.35, 1.48, w, 0.82, { max: 22, min: 12, color: C.ink, spacing: 0.5 });
          lineV(s, cx, 1.52, 3.63);
          let y = 2.42;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // two courses of a wall, the name of each set hard against a post
          const s = await open('page', {}, 0, 0, 0, 0), hh = 2.12;
          k.head(s, up(d.title), 0.7, 0.3, 7.3, 0.48, { max: 18, min: 11, color: C.ink, spacing: 1 });
          [d.left, d.right].forEach((sd, i) => {
            const y = 0.88 + i * (hh + 0.02);
            lineH(s, 0.7, y, 8.6, i ? C.muted : C.accent);
            k.head(s, up(sd.h), 0.7, y + 0.1, 2.15, hh - 0.2, { max: 16, min: 10.5, color: i ? C.ink : C.accent, valign: 'top', align: 'right' });
            lineV(s, 3.0, y + 0.1, hh - 0.2);
            const a = sd.items.filter((_, j) => j % 2 === 0), b = sd.items.filter((_, j) => j % 2), { rows, fs } = L.rowsFit([a, b], 14, 2.95, F.body, 0.14, hh - 0.2);
            sd.items.forEach((it, j) => k.txt(s, it, 3.2 + (j % 2) * 3.15, y + 0.1 + (j > 1 ? rows[0] : 0), 2.95, rows[Math.floor(j / 2)], { size: fs, color: C.ink }));
          });
        },
      ],
      statement: [
        async (d) => { // the thought is the page: heavy capitals from the top, title and note at the foot
          const s = await open('focus', {}, 0, 0, 0, 0);
          k.head(s, L.runs(up(d.text)), 0.7, 0.45, 8.6, 3.3, { max: 40, min: 17, color: C.ink, valign: 'top' });
          lineH(s, 0.7, 3.85, 8.6);
          k.head(s, up(d.title), 0.7, 3.93, 3.0, 1.2, { max: 13, min: 9.5, color: C.accent, valign: 'top', spacing: 0.5 });
          if (d.caption) p(s, d.caption, 3.95, 3.93, 5.35, 1.22, { max: 12, min: 9.5, color: C.muted, ls: 1.05 });
        },
        async (d) => { // the one amber page: title and note in a narrow left column, black capitals of thought to the right of a hard line
          const s = await slide('page');
          t.rect(s, 0, 0, 10, 5.625, C.accent, { name: 'Ember' });
          k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 8.2, 0.18, 1.5, 0.3, { size: 9, color: '1E1E1F', align: 'right' });
          k.head(s, up(d.title), 0.7, 0.55, 2.7, 1.5, { max: 15, min: 10.5, color: '1E1E1F', valign: 'top', spacing: 0.5 });
          if (d.caption) p(s, d.caption, 0.7, 2.1, 2.7, 3.05, { max: 12.5, min: 9.5, color: '1E1E1F', ls: 1.05, valign: 'bottom' });
          t.line(s, 3.65, 0.55, 0, 4.6, '1E1E1F', 1.5);
          k.head(s, L.runs(d.text), 3.95, 0.55, 5.35, 4.6, { max: 36, min: 16, color: '1E1E1F', valign: 'middle' });
          foot(s, { color: '1E1E1F' });
        },
      ],
      timeline: [
        async (d) => { // years set large and hard down the left
          const s = await page(d), hh = 3.6 / 4;
          d.items.forEach((it, i) => {
            const y = 1.52 + i * hh;
            lineH(s, 0.7, y, 8.6, i ? C.muted : C.accent);
            big(s, it.year, 0.7, y + 0.05, 2.65, hh - 0.1, { max: 30, min: 13, valign: 'middle' });
            h3(s, it.h, 3.45, y + 0.06, 5.85, 0.3, { valign: 'middle' });
            p(s, it.t, 3.45, y + 0.36, 5.85, hh - 0.42, { max: 12.5, ls: 1.03, color: C.muted });
          });
        },
        async (d) => { // four columns, the year of each stood on end beside it
          const s = await page(d), gap = 0.18, w = (8.6 - gap * 3) / 4, hh = 3.62;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            side(s, it.year, x + 0.2, 1.52 + hh / 2, hh, { max: 18, min: 10, color: C.accent });
            lineV(s, x + 0.45, 1.55, hh - 0.05, C.muted);
            h3(s, it.h, x + 0.55, 1.52, w - 0.55, 0.72, { max: 12.5 });
            p(s, it.t, x + 0.55, 2.25, w - 0.55, 2.9, { max: 12.5, ls: 1.05 });
          });
        },
        async (d) => { // a hard line across the page, events above and below by turn
          const s = await page(d), ly = 3.32, w = 3.75, xs = [0.7, 1.2, 5.05, 5.55];
          lineH(s, 0, ly, 10);
          d.items.forEach((it, i) => {
            const upper = i % 2 === 0, x = xs[i], y = upper ? 1.48 : ly + 0.1;
            big(s, it.year, x, y, 1.7, 0.42, { max: 19, min: 11, valign: 'middle' });
            h3(s, it.h, x + 1.75, y, w - 1.75, 0.42, { max: 11.5, min: 9.5, valign: 'middle', align: 'right' });
            p(s, it.t, x, y + 0.43, w, upper ? 0.98 : 1.28, { max: 12.5, ls: 1.03 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old columns look like the cards
    R.stats = V.stats.shift(); // and so do the old number columns
    R.timeline = V.timeline.shift(); // and the old timeline columns
    return V;
  },
  tone: "qat'iy va lo'nda: kuchli sarlavhalar, kam so'z, aniq raqamlar" });
