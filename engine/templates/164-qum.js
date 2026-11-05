/** 164 Qum — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 164, slug: 'qum', name: "Qum", mode: 'bottom', list: 'cols', num: 'corner', F: { head: 'Cambria', body: 'Calibri' },
  C: { ink: '3E3326', muted: '7D6B55', accent: 'B5703A' }, photo: { r: 0.02 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'F4EADB'],[1,'E8D6BC']]), raw(`<path d="M0,${kind==='cover'?640:760} C400,${kind==='cover'?560:720} 900,${kind==='cover'?720:800} 1600,${kind==='cover'?600:740} L1600,900 L0,900 Z" fill="#DCC5A3" opacity="0.6"/>`), grain(0.07)),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in sand: everything settles low, the weight at the foot, the top left open: a deck's pages must not look alike (L.pages)
    const open = async (kind, d, x, y, w, h, o = {}) => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 13, color: C.ink, valign: 'top', ...o }); num(s); k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: C.muted }); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 15, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 60, min: 18, color: C.accent, ...o });
    const rule = (s, x, y, w) => t.line(s, x, y, w, 0, C.accent, 0.75);
    const crest = (key, d0, w, h, sw = 4) => k.svg(key, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d0}" fill="none" stroke="#${C.accent}" stroke-width="${sw}"/></svg>`, w, h);
    const fall = (list, w, avail, max) => { const fs = Math.min(...list.map((v) => L.fit(v, w, avail, max, 10, F.body, false, 1.1))); return { fs, need: Math.max(...list.map((v) => L.height(v, fs, w, F.body, false, 1.1))) }; }; // words that lie on the ground: how high they reach
    const V = {
      image: [
        async (d) => { // the picture is the land: its upper edge is a dune, the words in the sky over it
          const s = await open('page', d, 0.7, 0.45, 2.75, 1.9, { max: 24, valign: 'top' });
          p(s, d.text, 3.65, 0.47, 5.65, 2.0, { max: 13.5, ls: 1.12 });
          t.img(s, await L.photo(L.src(d.image), 10, 2.75, { mask: { path: 'M0,0.28 C0.2,0.02 0.42,0.3 0.62,0.1 S0.9,0.02 1,0.2 L1,1 L0,1 Z' } }), 0, 2.45, 10, 2.75, { alt: '' });
        },
        async (d) => { // the picture stands on the ground line, the title at its foot, the words low beside it
          const s = await open('page', {}, 0, 0, 0, 0);
          await k.photo(s, d.image, 0.7, 0.45, 3.5, 3.4);
          k.head(s, d.title, 0.7, 3.95, 3.5, 1.2, { max: 22, min: 13, color: C.ink, valign: 'top' });
          p(s, d.text, 4.6, 0.75, 4.7, 4.4, { max: 15, valign: 'bottom', ls: 1.25 });
        },
        async (d) => { // the picture fills the page and the sand drifts over its lower part
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625);
          t.img(s, await k.svg('drift', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="520" viewBox="0 0 1600 520"><path d="M0,70 C400,0 900,110 1600,30 L1600,520 L0,520 Z" fill="#F0E3CF"/></svg>`, 1600, 520), 0, 2.6, 10, 3.025, { alt: '' });
          k.head(s, d.title, 0.7, 3.1, 2.8, 2.05, { max: 22, min: 13, color: C.ink, valign: 'top' });
          p(s, d.text, 3.7, 3.12, 5.6, 2.05, { max: 13.5, ls: 1.1 });
          num(s); k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: C.muted });
        },
        async (d) => { // a domed door in a clay wall, the words low on the left
          const s = await open('page', {}, 0, 0, 0, 0);
          t.img(s, await L.photo(L.src(d.image), 3.1, 4.75, { mask: { path: 'M0,1 L0,0.36 C0,0.1 0.28,0 0.5,0 C0.72,0 1,0.1 1,0.36 L1,1 Z' } }), 6.2, 0.42, 3.1, 4.75, { alt: '' });
          k.head(s, d.title, 0.7, 0.8, 5.1, 1.05, { max: 26, min: 13, color: C.accent, valign: 'bottom' });
          p(s, d.text, 0.7, 1.95, 5.1, 3.2, { max: 14.5, valign: 'bottom', ls: 1.2 });
        },
      ],
      cards: [
        async (d) => { // a heap: each layer wider than the one above it
          const s = await page(d), n = d.items.length, hh = 3.4 / n;
          for (const [i, it] of d.items.entries()) {
            const w = (n === 4 ? 5.6 : 6.0) + i * (n === 4 ? 1.0 : 1.3), y = 0.45 + i * hh;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), 0.7, y + 0.04, 0.32, 0.32);
            h3(s, it.h, 1.14, y, w - 0.44, 0.34, { max: 15, valign: 'middle' });
            p(s, it.t, 1.14, y + 0.35, w - 0.44, hh - 0.42, { max: 13, ls: 1.08, color: C.muted });
            rule(s, 0.7, y + hh - 0.05, w);
          }
        },
        async (d) => { // the title stays up in the air, the items all settle on the ground
          const s = await open('focus', d, 0.7, 0.45, 8.0, 1.25, { max: 32 }), n = d.items.length, gap = 0.35, w = (8.6 - gap * (n - 1)) / n;
          const { fs, need } = fall(d.items.map((it) => it.t), w, 2.3, 13.5), top = 5.17 - need;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap);
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, top - 0.98, 0.36, 0.36);
            h3(s, it.h, x, top - 0.58, w, 0.54, { max: 14, valign: 'bottom' });
            k.txt(s, it.t, x, top, w, need + 0.02, { size: fs, ls: 1.1, color: C.muted });
          }
        },
        async (d) => { // footprints crossing a dune: high, low, high, low
          const s = await page(d), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = i % 2 ? 1.0 : 0.42;
            big(s, String(i + 1), x, y, 0.6, 0.55, { max: 28, valign: 'middle' });
            h3(s, it.h, x + 0.0, y + 0.56, w, 0.5, { max: 14 });
            p(s, it.t, x, y + 1.07, w, 3.9 - y - 1.07, { max: 13, ls: 1.1 });
          }
        },
        async (d) => { // four plots of land marked out by thin lines
          const s = await page(d), n = d.items.length, w = 4.1, hh = 1.66;
          rule(s, 0.7, 0.45 + hh + 0.02, 8.6);
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = 0.7 + (i % 2) * (w + 0.4), y = 0.42 + Math.floor(i / 2) * (hh + 0.08), ww = wide ? 8.6 : w;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, y + 0.04, 0.44, 0.44);
            h3(s, it.h, x + 0.58, y + 0.02, ww - 0.58, 0.4, { max: 15, valign: 'middle' });
            p(s, it.t, x + 0.58, y + 0.44, ww - 0.58, hh - 0.5, { max: 13, ls: 1.08, color: C.muted });
          }
          if (n === 4) t.line(s, 5.0, 0.5, 0, 3.35, C.accent, 0.75); else t.line(s, 5.0, 0.5, 0, 1.55, C.accent, 0.75);
        },
      ],
      process: [
        async (d) => { // along the crest of a dune: a stop on the line for each step
          const s = await page(d), n = d.steps.length, cw = 8.6 / n;
          t.img(s, await crest('crestA', 'M0,50 C170,10 340,10 500,34 S760,70 860,18', 860, 80), 0.7, 0.42, 8.6, 0.8, { alt: '' });
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * cw;
            big(s, String(i + 1), x, 1.2, 0.7, 0.55, { max: 30, valign: 'middle' });
            h3(s, st.h, x, 1.75, cw - 0.25, 0.5, { max: 14 });
            p(s, st.t, x, 2.27, cw - 0.25, 1.63, { max: 13, ls: 1.08 });
          });
        },
        async (d) => { // words pile up from a ground line: all columns end on it
          const s = await page(d), n = d.steps.length, gap = 0.35, w = (8.6 - gap * (n - 1)) / n, ly = 3.9;
          rule(s, 0.7, ly, 8.6);
          const { fs, need } = fall(d.steps.map((st) => st.t), w, 2.1, 13.5), top = ly - need - 0.06;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            t.text(s, String(i + 1), { x, y: Math.max(0.3, top - 1.5), w, h: 0.95, fontFace: F.head, bold: true, fontSize: 54, color: C.accent, transparency: 40, valign: 'bottom', noShrink: true });
            h3(s, st.h, x, top - 0.54, w, 0.52, { max: 14, valign: 'bottom' });
            k.txt(s, st.t, x, top, w, need + 0.02, { size: fs, ls: 1.1 });
          });
        },
        async (d) => { // the title sits low in its own column, the steps walk down beside it
          const s = await open('page', {}, 0, 0, 0, 0), n = d.steps.length, hh = 4.7 / n;
          k.head(s, d.title, 0.7, 2.8, 2.65, 2.35, { max: 28, min: 13, color: C.ink, valign: 'bottom' });
          t.line(s, 3.6, 0.5, 0, 4.65, C.accent, 0.75);
          d.steps.forEach((st, i) => {
            const y = 0.48 + i * hh;
            h3(s, `${i + 1}.  ${st.h}`, 3.85, y, 5.45, 0.36, { max: 15, color: C.accent, valign: 'middle' });
            p(s, st.t, 3.85, y + 0.37, 5.45, hh - 0.43, { max: 13.5, ls: 1.12 });
          });
        },
        async (d) => { // an hourglass: wide, narrow at the neck, wide again
          const s = await page(d), n = d.steps.length, hh = 3.42 / n, ws = n === 4 ? [8.6, 5.3, 5.3, 8.6] : [8.6, 5.4, 8.6];
          d.steps.forEach((st, i) => {
            const w = ws[i], x = 5 - w / 2, y = 0.42 + i * hh;
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.33, { max: 14.5, align: 'center', valign: 'middle' });
            p(s, st.t, x, y + 0.33, w, hh - 0.38, { max: 12.5, ls: 1.05, align: 'center', color: C.muted });
          });
        },
      ],
      stats: [
        async (d) => { // one number lying heavy on the ground, the rest up in the air
          const s = await open('page', d, 0.7, 0.42, 4.6, 1.3, { max: 24 }), [a, ...rest] = d.stats;
          big(s, a.value, 0.7, 2.95, 5.6, 1.45, { max: 90, min: 28, valign: 'bottom' });
          p(s, a.label, 0.7, 4.45, 5.6, 0.72, { max: 13.5, ls: 1.1 });
          rest.forEach((x, i) => {
            const y = 0.42 + i * 1.08;
            k.head(s, x.value, 5.7, y, 3.6, 0.55, { max: 28, min: 15, color: C.ink, valign: 'middle' });
            p(s, x.label, 5.7, y + 0.55, 3.6, 0.47, { max: 11.5, min: 9.5, color: C.muted, ls: 1.05 });
          });
          if (d.note) p(s, d.note, 6.5, 2.7, 2.8, 2.47, { max: 11, min: 9.5, color: C.muted, ls: 1.08, valign: 'bottom' });
        },
        async (d) => { // strata: a line under every number
          const s = await page(d), rh = d.note ? 0.84 : 1.12;
          d.stats.forEach((x, i) => {
            const y = 0.42 + i * rh;
            big(s, x.value, 0.7, y, 3.0, rh - 0.08, { max: 36, min: 16, valign: 'middle' });
            p(s, x.label, 3.9, y, 5.4, rh - 0.08, { max: 14, valign: 'middle' });
            rule(s, 0.7, y + rh - 0.04, 8.6);
          });
          if (d.note) p(s, d.note, 0.7, 3.0, 8.6, 0.9, { max: 11.5, min: 9.5, color: C.muted, ls: 1.08, valign: 'middle' });
        },
        async (d) => { // numbers standing on a ground line, their words under the ground
          const s = await page(d), w = 2.7, gap = 0.25, ly = 1.75;
          rule(s, 0.7, ly, 8.6);
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * (w + gap);
            big(s, x.value, xx, 0.42, w, ly - 0.47, { max: 40, min: 16, valign: 'bottom' });
            p(s, x.label, xx, ly + 0.08, w, 0.72, { max: 12.5, ls: 1.08 });
          });
          if (d.note) p(s, d.note, 0.7, 2.62, 8.6, 1.25, { max: 12, min: 9.5, color: C.muted, ls: 1.1, valign: 'bottom' });
        },
      ],
      compare: [
        async (d) => { // two layers of ground, one over the other
          const s = await page(d), hh = 1.72;
          [d.left, d.right].forEach((side, i) => {
            const y = 0.42 + i * (hh + 0.03);
            k.head(s, side.h, 0.7, y, 2.25, hh - 0.1, { max: 20, min: 12, color: i ? C.accent : C.ink, valign: 'top' });
            const a = side.items.filter((_, j) => j % 2 === 0), b = side.items.filter((_, j) => j % 2), { rows, fs } = L.rowsFit([a, b], 13.5, 3.05, F.body, 0.1, hh - 0.12);
            side.items.forEach((it, j) => k.txt(s, it, 3.1 + (j % 2) * 3.2, y + (j > 1 ? rows[0] : 0), 3.0, rows[Math.floor(j / 2)], { size: fs, color: C.ink }));
            if (!i) rule(s, 0.7, y + hh - 0.02, 8.6);
          });
        },
        async (d) => { // mirrored about a line, heads at the foot of the columns, the title above
          const s = await open('page', d, 0.7, 0.42, 8.6, 0.72, { max: 26, align: 'center' }), w = 3.95, cx = 5, ly = 4.3;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.14, ly - 1.25);
          t.line(s, cx, 1.25, 0, 3.9, C.accent, 0.75);
          let y = ly - 0.04 - rows.reduce((a, b) => a + b, 0);
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
          k.head(s, d.left.h, 0.7, ly + 0.08, w, 0.75, { max: 21, min: 12, color: C.accent, align: 'right', valign: 'top' }); k.head(s, d.right.h, 5.35, ly + 0.08, w, 0.75, { max: 21, min: 12, color: C.ink, valign: 'top' });
        },
      ],
      statement: [
        async (d) => { // the thought has sunk to the very foot of the page, title and note float over it
          const s = await open('focus', d, 0.7, 0.42, 3.3, 1.2, { max: 18, bold: false, color: C.muted });
          if (d.caption) p(s, d.caption, 4.4, 0.45, 4.9, 1.35, { max: 12.5, min: 9.5, color: C.muted, ls: 1.1 });
          k.head(s, L.runs(d.text), 0.7, 1.9, 8.6, 3.28, { max: 42, min: 17, color: C.ink, valign: 'bottom' });
        },
        async (d) => { // title and note low on the left, the thought on the right, set on the ground
          const s = await open('page', {}, 0, 0, 0, 0);
          t.line(s, 3.7, 0.5, 0, 4.67, C.accent, 0.75);
          k.head(s, d.title, 0.7, 0.45, 2.75, 1.5, { max: 18, min: 12, color: C.accent, valign: 'top' });
          if (d.caption) p(s, d.caption, 0.7, 2.0, 2.75, 3.17, { max: 12, min: 9.5, color: C.muted, valign: 'bottom', ls: 1.1 });
          k.head(s, L.runs(d.text), 3.95, 0.5, 5.35, 4.67, { max: 36, min: 16, color: C.ink, valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // read from the foot upward, like layers: the oldest lies lowest
          const s = await open('page', d, 0.7, 0.32, 8.0, 0.68, { max: 24, valign: 'middle' }), hh = 4.15 / 4;
          d.items.forEach((it, i) => {
            const y = 1.03 + (3 - i) * hh;
            big(s, it.year, 0.7, y + 0.03, 1.7, hh - 0.1, { max: 19, min: 11, valign: 'top' });
            h3(s, it.h, 2.5, y + 0.03, 2.2, hh - 0.1, { max: 14 });
            p(s, it.t, 4.75, y + 0.03, 4.55, hh - 0.1, { max: 12.5, ls: 1.05, color: C.muted });
            rule(s, 0.7, y, 8.6);
          });
        },
        async (d) => { // a ridge across the page, events on either side of it, by turn
          const s = await page(d), ly = 2.15, w = 3.95, xs = [0.7, 1.35, 5.0, 5.35];
          t.img(s, await crest('crestB', 'M0,24 C200,6 420,40 620,18 S880,4 1000,20', 1000, 44), 0, ly - 0.2, 10, 0.44, { alt: '' });
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 0.4 : ly + 0.28;
            t.text(s, [{ text: `${it.year}   `, options: { color: C.accent, bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x, y, w, h: 0.38, fontFace: F.head, fontSize: L.fit(`${it.year}   ${it.h}`, w, 0.35, 15, 10.5, F.head, true), valign: 'middle' });
            p(s, it.t, x, y + 0.38, w, up ? 1.15 : 1.05, { max: 12.5, ls: 1.05 });
          });
        },
        async (d) => { // the words above, the years as stones along the ground; the title first
          const s = await open('page', d, 0.7, 0.32, 8.0, 0.68, { max: 24, valign: 'middle' }), gap = 0.3, w = (8.6 - gap * 3) / 4, ly = 4.4;
          rule(s, 0.7, ly, 8.6);
          const { fs, need } = fall(d.items.map((it) => it.t), w, 2.75, 13.5), top = ly - need - 0.06;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            h3(s, it.h, x, top - 0.54, w, 0.52, { max: 14, valign: 'bottom' });
            k.txt(s, it.t, x, top, w, need + 0.02, { size: fs, ls: 1.1 });
            big(s, it.year, x, ly + 0.06, w, 0.74, { max: 24, min: 12, valign: 'top' });
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
  tone: "issiq va tabiiy: sokin bayon, tabiiy obrazlar, aniq xulosalar" });
