/** 184 Kanop — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 184, slug: 'kanop', name: "Kanop", mode: 'narrow', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Georgia' },
  C: { ink: '35302A', muted: '6F675C', accent: '8A6D3B' }, photo: { r: 0.02 }, rule: true, caps: false, bold: false,
  bg: (kind) => compose(flat('F2ECE0'), raw(Array.from({length:225},(_,i)=>`<line x1="0" y1="${i*4}" x2="1600" y2="${i*4}" stroke="#D9CFBD" stroke-width="1" opacity="0.5"/>`).join('')+Array.from({length:400},(_,i)=>`<line x1="${i*4}" y1="0" x2="${i*4}" y2="900" stroke="#E3DACA" stroke-width="1" opacity="0.35"/>`).join(''))),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in linen: quiet, centred, a thin thread and much cloth left bare: a deck's pages must not look alike (L.pages)
    const open = async (d, x = 1.0, y = 0.4, w = 8.0, h = 0.85, o = {}) => { const s = await slide('page'); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, bold: false, color: C.ink, align: 'center', valign: 'bottom', ...o }); num(s); k.foot(s, { x: 2.2, w: 5.6, y: 5.3, size: 7.5, color: C.muted, align: 'center' }); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13.5, min: 10, color: C.ink, ls: 1.25, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, bold: false, italic: true, color: C.accent, valign: 'top', ...o });
    const fig = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 40, min: 14, bold: false, color: C.accent, ...o });
    const thread = (s, x, y, w, h = 0) => t.line(s, x, y, w, h, C.accent, 0.6);
    const rom = (i) => ['I', 'II', 'III', 'IV', 'V'][i];
    const ic = async (s, it, x, y, z) => t.img(s, await L.icon(it.icon, C.accent, 1.25), x, y, z, z);
    const V = {
      image: [
        async (d) => { // a strip of picture from selvedge to selvedge, the words under it on the centre line
          const s = await open(d, 1.0, 0.25, 8.0, 0.8);
          await k.photo(s, d.image, 0, 1.15, 10, 2.05);
          p(s, d.text, 1.3, 3.35, 7.4, 1.82, { align: 'center', max: 13 });
        },
        async (d) => { // the picture stands in an arched window, the words beside it, centred on their own axis
          const s = await open(d, 4.6, 0.45, 4.6, 1.1);
          t.img(s, await L.photo(L.src(d.image), 3.2, 4.65, { mask: { path: 'M0,1 V0.36 C0,0.12 0.24,0 0.5,0 C0.76,0 1,0.12 1,0.36 V1 Z' } }), 0.85, 0.45, 3.2, 4.65, { alt: '' });
          thread(s, 6.4, 1.66, 1.0);
          p(s, d.text, 4.6, 1.8, 4.6, 3.3, { align: 'center' });
        },
        async (d) => { // a small plate above, as in a printed book: the picture, the title, the page of words
          const s = await open({});
          await k.photo(s, d.image, 3.85, 0.42, 2.3, 1.5);
          k.head(s, d.title, 1.5, 2.0, 7.0, 0.72, { max: 20, min: 13, bold: false, color: C.ink, align: 'center', valign: 'middle' });
          p(s, d.text, 1.8, 2.8, 6.4, 2.35, { align: 'center', max: 13 });
        },
        async (d) => { // half the page is picture, up to the edge; the words keep to the bare half
          const s = await slide('page');
          await k.photo(s, d.image, 5.15, 0, 4.85, 5.625);
          k.txt(s, `${String(k.idx).padStart(2, '0')} / ${String(k.n).padStart(2, '0')}`, 0.7, 0.2, 1.5, 0.28, { size: 9, color: C.muted, font: F.body, spacing: 1 });
          k.head(s, d.title, 0.7, 0.55, 3.95, 1.25, { max: 22, min: 13, bold: false, color: C.ink, align: 'center', valign: 'bottom' });
          thread(s, 2.2, 1.9, 0.95);
          p(s, d.text, 0.7, 2.02, 3.95, 3.15, { align: 'center', max: 12.5 });
          k.foot(s, { x: 0.7, w: 3.95, y: 5.3, size: 7.5, color: C.muted, align: 'center' });
        },
      ],
      cards: [
        async (d) => { // a broad centred measure: name above words, a short thread between each, at a size one can read
          const s = await open(d), n = d.items.length, hh = 3.62 / n;
          d.items.forEach((it, i) => {
            const y = 1.45 + i * hh;
            k.head(s, it.h, 1.0, y, 8.0, 0.3, { max: 14.5, min: 11, bold: true, color: C.ink, align: 'center', valign: 'top' });
            p(s, it.t, 1.2, y + 0.31, 7.6, hh - 0.42, { max: 12.5, min: 10, align: 'center', ls: 1.12, color: C.muted });
            if (i < n - 1) thread(s, 4.6, y + hh - 0.05, 0.8);
          });
        },
        async (d) => { // slim columns parted by threads, a large pale numeral closing each
          const s = await open(d), n = d.items.length, gap = 0.5, w = (8.2 - gap * (n - 1)) / n;
          d.items.forEach((it, i) => {
            const x = 0.9 + i * (w + gap);
            h3(s, it.h, x, 1.48, w, 0.55, { align: 'center' });
            p(s, it.t, x, 2.05, w, 2.3, { max: 12.5, min: 10, align: 'center', ls: 1.15 });
            t.text(s, rom(i), { x, y: 4.32, w, h: 0.78, fontFace: F.head, italic: true, fontSize: 38, color: C.accent, transparency: 45, align: 'center', valign: 'bottom', noShrink: true });
            if (i) thread(s, x - gap / 2, 1.55, 0, 3.45);
          });
        },
        async (d) => { // about one thread: the name set to it from the left, the words from it to the right
          const s = await open(d), n = d.items.length, hh = 3.6 / n, cx = 4.1;
          thread(s, cx, 1.5, 0, 3.55);
          d.items.forEach((it, i) => {
            const y = 1.48 + i * hh;
            h3(s, it.h, 0.9, y + 0.04, cx - 0.9 - 0.22, hh - 0.1, { align: 'right', max: 15 });
            p(s, it.t, cx + 0.22, y + 0.04, 9.1 - cx - 0.22, hh - 0.1, { max: 12.5, min: 10, ls: 1.15 });
          });
        },
        async (d) => { // set as verse: each stanza indented its own way, a small icon hung in the margin
          const s = await open(d), n = d.items.length, hh = 3.6 / n, ind = n === 3 ? [0.9, 2.9, 1.9] : [0.9, 2.6, 1.5, 3.1], w = 5.6;
          for (const [i, it] of d.items.entries()) {
            const x = ind[i], y = 1.48 + i * hh;
            await ic(s, it, x, y + 0.05, 0.3);
            h3(s, it.h, x + 0.42, y + 0.03, w - 0.42, 0.3);
            p(s, it.t, x + 0.42, y + 0.34, w - 0.42, hh - 0.4, { max: 12, min: 10, ls: 1.12 });
          }
        },
        async (d) => { // a quiet cluster on the centre line; three make a triangle, four a square
          const s = await open(d), n = d.items.length, w = 3.85, rh = 1.8;
          for (const [i, it] of d.items.entries()) {
            const top = n === 3 ? i === 0 : i < 2, x = n === 3 && !i ? 5 - w / 2 : (i % 2 === (n === 3 ? 1 : 0) ? 0.95 : 5.2), y = top ? 1.42 : 1.42 + rh;
            await ic(s, it, x + w / 2 - 0.17, y, 0.34);
            h3(s, it.h, x, y + 0.38, w, 0.28, { align: 'center' });
            p(s, it.t, x, y + 0.68, w, rh - 0.74, { max: 12, min: 10, ls: 1.12, align: 'center' });
          }
        },
      ],
      process: [
        async (d) => { // numerals in the margin, one thread running down beside them to the last step
          const s = await open(d), n = d.steps.length, hh = 3.6 / n, lx = 2.35;
          thread(s, lx, 1.55, 0, 3.5);
          d.steps.forEach((st, i) => {
            const y = 1.48 + i * hh;
            fig(s, rom(i), 1.0, y, 1.2, Math.min(0.7, hh - 0.1), { max: 30, align: 'right', italic: true, valign: 'top' });
            h3(s, st.h, lx + 0.25, y + 0.03, 6.3, 0.3);
            p(s, st.t, lx + 0.25, y + 0.34, 6.3, hh - 0.4, { max: 12.5, min: 10, ls: 1.12 });
          });
        },
        async (d) => { // the steps rise and fall on a slow arc across the page
          const s = await open(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, dy = n === 3 ? [0.75, 0, 0.75] : [0.85, 0, 0, 0.85];
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = 1.42 + dy[i];
            fig(s, rom(i), x, y, w, 0.42, { max: 20, align: 'center', italic: true, valign: 'top' });
            h3(s, st.h, x, y + 0.42, w, 0.5, { align: 'center' });
            p(s, st.t, x, y + 0.92, w, 5.1 - y - 0.92, { max: 12, min: 10, ls: 1.12, align: 'center' });
          });
        },
        async (d) => { // a long slope: every step lower and further to the right
          const s = await open(d, 1.0, 0.4, 8.0, 0.85), n = d.steps.length, w = 3.85, dx = (9.3 - w - 0.7) / (n - 1), dy = n === 4 ? 0.92 : 1.22;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * dx, y = 1.42 + i * dy;
            h3(s, `${rom(i)}.  ${st.h}`, x, y, w, 0.3);
            p(s, st.t, x, y + 0.3, w, dy - 0.32, { max: 11.5, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // the thread down the middle of the cloth, a step on each side in turn
          const s = await open(d), n = d.steps.length, bh = n === 4 ? 1.3 : 1.5, dy = (3.62 - bh) / (n - 1), cx = 5, w = 3.95;
          thread(s, cx, 1.48, 0, 3.6);
          d.steps.forEach((st, i) => {
            const y = 1.46 + i * dy, r = i % 2 === 1, x = r ? cx + 0.28 : cx - 0.28 - w, al = r ? 'left' : 'right';
            t.oval(s, cx - 0.05, y + 0.08, 0.1, 0.1, C.accent);
            h3(s, st.h, x, y + 0.02, w, 0.3, { align: al });
            p(s, st.t, x, y + 0.33, w, bh - 0.35, { max: 12, min: 10, ls: 1.1, align: al });
          });
        },
      ],
      stats: [
        async (d) => { // figures set to the centre line from the left, their words from it to the right
          const s = await open(d), rh = d.note ? 0.86 : 1.15;
          d.stats.forEach((v, i) => {
            const y = 1.45 + i * rh;
            fig(s, v.value, 0.9, y, 3.85, rh - 0.08, { max: 40, min: 16, align: 'right', valign: 'middle' });
            p(s, v.label, 5.0, y, 4.1, rh - 0.08, { max: 13.5, min: 10, valign: 'middle', ls: 1.1 });
          });
          if (d.note) p(s, d.note, 1.5, 1.45 + 3 * rh + 0.05, 7.0, 5.12 - (1.45 + 3 * rh + 0.05), { max: 10.5, min: 9.5, align: 'center', ls: 1.05, color: C.muted, italic: true });
        },
        async (d) => { // the middle figure large, its two neighbours small on either side
          const s = await open(d), [a, b, c] = d.stats;
          fig(s, b.value, 3.0, 1.42, 4.0, 1.5, { max: 66, min: 26, align: 'center', valign: 'middle' });
          p(s, b.label, 3.2, 2.95, 3.6, 0.72, { max: 13, min: 10, align: 'center', ls: 1.1 });
          [[a, 0.7], [c, 7.0]].forEach(([v, x]) => {
            fig(s, v.value, x, 1.82, 2.3, 0.6, { max: 24, align: 'center', valign: 'bottom' });
            p(s, v.label, x, 2.45, 2.3, 1.1, { max: 11.5, min: 10, align: 'center', ls: 1.08, color: C.muted });
          });
          thread(s, 4.4, 3.76, 1.2);
          if (d.note) p(s, d.note, 1.5, 3.88, 7.0, 1.22, { max: 11.5, min: 10, align: 'center', italic: true, color: C.muted, ls: 1.1 });
        },
        async (d) => { // three figures spread over the whole width, a thread between each, the note set low
          const s = await open(d), w = 2.55, gap = 0.35;
          d.stats.forEach((v, i) => {
            const x = 0.85 + i * (w + gap);
            fig(s, v.value, x, 1.7, w, 1.0, { max: 40, align: 'center', valign: 'bottom' });
            p(s, v.label, x, 2.78, w, 0.95, { max: 12.5, min: 10, align: 'center', ls: 1.1 });
            if (i) thread(s, x - gap / 2, 1.8, 0, 1.85);
          });
          if (d.note) p(s, d.note, 1.5, 3.95, 7.0, 1.15, { max: 11.5, min: 10, align: 'center', italic: true, color: C.muted, ls: 1.1 });
        },
      ],
      compare: [
        async (d) => { // two facing pages: the left set to the fold, the right from it
          const s = await open(d), w = 4.0, cx = 5, { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.18, 2.95);
          h3(s, d.left.h, cx - 0.3 - w, 1.42, w, 0.5, { max: 18, align: 'right', valign: 'middle' });
          h3(s, d.right.h, cx + 0.3, 1.42, w, 0.5, { max: 18, valign: 'middle' });
          thread(s, cx, 1.45, 0, 3.6);
          let y = 2.03;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], cx - 0.3 - w, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], cx + 0.3, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // two lengths of cloth, one above the other, each with its list woven across
          const s = await open(d), hh = 1.78;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.4 + i * hh, n = side.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
            h3(s, side.h, 1.0, y, 8.0, 0.32, { max: 15, align: 'center' });
            side.items.forEach((it, j) => p(s, it, 0.6 + j * (w + gap), y + 0.36, w, hh - 0.48, { max: 12, min: 10, align: 'center', ls: 1.1 }));
            if (!i) thread(s, 4.2, y + hh - 0.05, 1.6);
          });
        },
      ],
      statement: [
        async (d) => { // one long italic sentence, the note under a short thread
          const s = await open(d, 2.0, 0.3, 6.0, 0.6, { max: 14, min: 11, italic: true, color: C.accent });
          k.head(s, L.runs(d.text), 1.1, 1.0, 7.8, 2.4, { max: 30, min: 16, bold: false, italic: true, color: C.ink, align: 'center', valign: 'middle' });
          thread(s, 4.4, 3.5, 1.2);
          if (d.caption) p(s, d.caption, 1.7, 3.62, 6.6, 1.48, { max: 11.5, min: 10, color: C.muted, align: 'center', ls: 1.12 });
        },
        async (d) => { // a break from the centre line: the sentence low at the right, the note at the far left
          const s = await open(d, 0.7, 0.4, 5.0, 0.8, { align: 'left', max: 16, min: 11 });
          if (d.caption) p(s, d.caption, 0.7, 2.35, 2.45, 2.75, { max: 11, min: 9.5, color: C.muted, ls: 1.1, valign: 'bottom' });
          thread(s, 3.4, 2.35, 0, 2.75);
          k.head(s, L.runs(d.text), 3.65, 1.3, 5.65, 3.8, { max: 30, min: 16, bold: false, color: C.ink, valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // a thread across the whole width, a knot for each year, the words hanging from it
          const s = await open(d), w = 2.05, gap = 0.13, ly = 2.2;
          thread(s, 0, ly, 10);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            fig(s, it.year, x, 1.42, w, 0.66, { max: 22, align: 'center', italic: true, valign: 'bottom' });
            t.oval(s, x + w / 2 - 0.05, ly - 0.05, 0.1, 0.1, C.accent);
            h3(s, it.h, x, ly + 0.14, w, 0.32, { align: 'center', max: 12.5 });
            p(s, it.t, x + 0.05, ly + 0.48, w - 0.1, 5.1 - ly - 0.48, { max: 12, min: 10, ls: 1.1, align: 'center' });
          });
        },
        async (d) => { // the year changes sides from line to line, the words between in the opposite hand
          const s = await open(d), hh = 3.62 / 4;
          d.items.forEach((it, i) => {
            const y = 1.44 + i * hh, r = i % 2 === 1;
            fig(s, it.year, r ? 7.0 : 0.9, y, 2.1, hh - 0.08, { max: 22, italic: true, align: r ? 'left' : 'right', valign: 'middle' });
            h3(s, it.h, r ? 1.9 : 3.3, y + 0.02, 4.8, 0.27, { max: 12.5, align: r ? 'right' : 'left' });
            p(s, it.t, r ? 1.9 : 3.3, y + 0.29, 4.8, hh - 0.33, { max: 11.5, min: 10, ls: 1.08, align: r ? 'right' : 'left' });
          });
        },
        async (d) => { // the title alone on a side panel of bare cloth, the years in a calm list beside it
          const s = await open(d, 0.7, 1.2, 2.6, 2.6, { max: 24, valign: 'middle' }), hh = 4.6 / 4;
          thread(s, 3.55, 0.55, 0, 4.55);
          d.items.forEach((it, i) => {
            const y = 0.55 + i * hh;
            k.txt(s, [{ text: it.year, options: { italic: true, color: C.accent } }, { text: `   ${it.h}`, options: { color: C.ink } }], 3.85, y, 5.45, 0.32, { max: 13, min: 10.5, font: F.head });
            p(s, it.t, 3.85, y + 0.33, 5.45, hh - 0.4, { max: 12, min: 10, ls: 1.1, color: C.muted });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); R.stats = V.stats.shift(); R.cards = V.cards.shift(); // nor the first steps, years and figures the rows of the cards; the old narrow rows set their words too small
    return V;
  },
  tone: "nafis va tabiiy: sokin, mukammal tanlangan so'zlar" });
