/** 165 Moviy — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 165, slug: 'moviy', name: "Moviy", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'F2F7FF', muted: 'B9CCE6', accent: '8FD3FF' }, photo: { r: 0.06 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('0E2A5A'), rad(kind==='cover'?300:120, kind==='cover'?150:80, kind==='cover'?1100:900, [[0,'2F6FD6',0.85],[1,'0E2A5A',0]]), grain(0.05)),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in deep water: a sounding line going down, things lying deeper the further on: a deck's pages must not look alike (L.pages)
    const nb = (s, x, y, a = 'right') => k.txt(s, String(k.idx).padStart(2, '0'), x, y, 1.3, 0.62, { size: 26, bold: true, color: C.accent, font: F.head, align: a });
    const foot = (s, x = 4.15, w = 5.25, o = {}) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: C.muted, ...o });
    const open = async (d, x, y, w, h, o = {}) => { const s = await slide('page'); if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 13, color: C.ink, valign: 'top', ...o }); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 15, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 60, min: 18, color: C.accent, ...o });
    const lineV = (s, x, y, h) => t.line(s, x, y, 0, h, C.accent, 0.75);
    const lineH = (s, x, y, w) => t.line(s, x, y, w, 0, C.accent, 0.75);
    const V = {
      image: [
        async (d) => { // half the page is picture, cut to the edge
          const s = await open(d, 0.6, 0.55, 3.95, 1.35, { max: 26 });
          await k.photo(s, d.image, 5.0, 0, 5, 5.625);
          p(s, d.text, 0.6, 1.98, 3.95, 2.62, { max: 13.5, ls: 1.1 });
          nb(s, 0.6, 4.62, 'left'); foot(s, 1.9, 2.75);
        },
        async (d) => { // a porthole cut by the page's edge, the text beside it
          const s = await open(d, 4.15, 0.55, 4.75, 1.1, { max: 26 });
          t.img(s, await L.photo(L.src(d.image), 3.6, 5.625, { mask: { path: 'M0,0 C0.55,0 1,0.25 1,0.5 C1,0.75 0.55,1 0,1 Z' } }), 0, 0, 3.6, 5.625, { alt: '' });
          p(s, d.text, 4.15, 1.75, 5.25, 3.35, { max: 15 });
          nb(s, 8.1, 0.1); foot(s);
        },
        async (d) => { // the picture sunk in blue fills the page, the words on darker water at the right
          const s = await slide('page');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625, { duo: ['0E2A5A', '9CC4F0'] }), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 4.6, 0, 5.4, 5.625, '0E2A5A', { t: 8, name: 'Deep water' });
          k.head(s, d.title, 5.0, 0.55, 3.75, 1.15, { max: 24, min: 14, color: C.ink, valign: 'top' });
          p(s, d.text, 5.0, 1.8, 4.4, 3.3, { max: 14, ls: 1.12 });
          foot(s, 5.0, 4.4); nb(s, 8.1, 0.1);
        },
        async (d) => { // the picture lies along the bottom of the page, the text in the water above
          const s = await open(d, 0.6, 0.45, 3.2, 2.2, { max: 26 });
          lineV(s, 4.0, 0.5, 2.1);
          p(s, d.text, 4.2, 0.45, 5.2, 2.25, { max: 13, ls: 1.08 });
          await k.photo(s, d.image, 0, 2.85, 10, 2.33);
          foot(s, 0.6, 8.8);
        },
      ],
      cards: [
        async (d) => { // sounding lines let down to different depths, an item at the end of each
          const s = await open(d, 0.6, 0.35, 7.3, 0.8, { max: 24, valign: 'middle' }), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n, dep = n === 4 ? [1.4, 1.72, 2.04, 2.36] : [1.4, 1.8, 2.2];
          nb(s, 8.1, 0.15);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = dep[i];
            lineV(s, x, 1.18, y - 1.22);
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, y, 0.32, 0.32);
            h3(s, it.h, x + 0.4, y, w - 0.4, 0.5, { max: 13.5 });
            p(s, it.t, x, y + 0.52, w, 5.16 - y - 0.52, { max: 13, ls: 1.08, color: C.muted });
          }
          foot(s, 0.6, 8.8);
        },
        async (d) => { // the title holds the left, the items lie in a block on the right
          const s = await page(d), n = d.items.length, w = 2.5, hh = 2.24;
          lineH(s, 4.15, 0.55 + hh + 0.01, 5.25);
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = 4.15 + (i % 2) * (w + 0.25), y = 0.55 + Math.floor(i / 2) * (hh + 0.03) + (i > 1 ? 0.08 : 0), ww = wide ? 5.25 : w;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, y, 0.32, 0.32);
            h3(s, it.h, x, y + 0.36, ww, 0.5, { max: 13.5 });
            p(s, it.t, x, y + 0.88, ww, hh - 0.96, { max: 12.5, ls: 1.08, color: C.muted });
          }
        },
        async (d) => { // the same page turned about: items on the left, the title on the right
          const s = await open(d, 6.4, 0.6, 3.0, 3.4, { max: 30, align: 'right' }), n = d.items.length, hh = 4.7 / n;
          lineV(s, 6.15, 0.5, 4.65); nb(s, 8.1, 4.1); foot(s, 0.6, 5.3);
          for (const [i, it] of d.items.entries()) {
            const y = 0.48 + i * hh;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), 5.5, y + 0.03, 0.36, 0.36);
            h3(s, it.h, 0.6, y, 4.75, 0.38, { max: 15, align: 'right', valign: 'middle' });
            p(s, it.t, 0.6, y + 0.4, 5.25, hh - 0.46, { max: 13, ls: 1.08, color: C.muted, align: 'right' });
          }
        },
        async (d) => { // a wide table: a large numeral opens each row
          const s = await open(d, 0.6, 0.45, 7.3, 0.85, { max: 26 }), n = d.items.length, hh = 3.78 / n;
          nb(s, 8.1, 0.15); foot(s, 0.6, 8.8);
          d.items.forEach((it, i) => {
            const y = 1.38 + i * hh;
            lineH(s, 0.6, y, 8.8);
            big(s, String(i + 1), 0.6, y + 0.03, 0.9, hh - 0.08, { max: 36, min: 18, valign: 'middle' });
            h3(s, it.h, 1.55, y + 0.05, 2.5, hh - 0.1, { max: 15, valign: 'middle' });
            p(s, it.t, 4.2, y + 0.05, 5.2, hh - 0.1, { max: 13, ls: 1.08, valign: 'middle', color: C.muted });
          });
        },
      ],
      process: [
        async (d) => { // a single sounding line from the title, the steps marked down along it
          const s = await page(d), n = d.steps.length, hh = 4.58 / n;
          lineV(s, 4.3, 0.0, 5.17);
          d.steps.forEach((st, i) => {
            const y = 0.55 + i * hh;
            t.oval(s, 4.23, y + 0.1, 0.14, 0.14, C.accent);
            h3(s, `${i + 1}.  ${st.h}`, 4.6, y, 4.8, 0.36, { max: 15, valign: 'middle' });
            p(s, st.t, 4.6, y + 0.37, 4.8, hh - 0.43, { max: 13.5, ls: 1.1 });
          });
        },
        async (d) => { // the descent: a stepped line going down, each step lower and further out
          const s = await open(d, 0.6, 0.35, 7.3, 0.85, { max: 24, valign: 'middle' }), n = d.steps.length, w = n === 4 ? 3.75 : 4.2, sx = (8.8 - w) / (n - 1), top = 1.3, hh = (5.15 - top) / n;
          nb(s, 8.1, 0.15); foot(s, 0.6, 8.8);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * sx, y = top + i * hh;
            lineV(s, x, y, hh);
            if (i < n - 1) lineH(s, x, y + hh, sx);
            h3(s, `${i + 1}.  ${st.h}`, x + 0.14, y + 0.03, w - 0.14, 0.3, { max: 14, color: C.accent, valign: 'middle' });
            p(s, st.t, x + 0.14, y + 0.33, w - 0.14, hh - 0.36, { max: 13, min: 10, ls: 1.02 });
          });
        },
        async (d) => { // the surface across the middle of the page: steps over it and under it by turn
          const s = await open(d, 0.6, 0.35, 7.3, 0.72, { max: 24, valign: 'middle' }), n = d.steps.length, ly = 3.12, w = n === 4 ? 3.85 : 4.25, xs = n === 4 ? [0.6, 1.1, 5.1, 5.55] : [0.6, 2.9, 5.15];
          nb(s, 8.1, 0.15); foot(s, 0.6, 8.8);
          lineH(s, 0, ly, 10);
          d.steps.forEach((st, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.15 : ly + 0.3;
            t.oval(s, x, ly - 0.07, 0.14, 0.14, C.accent);
            h3(s, `${i + 1}.  ${st.h}`, x, y, w, 0.36, { max: 14.5, valign: 'middle' });
            p(s, st.t, x, y + 0.37, w, up ? 1.45 : 1.3, { max: 13, ls: 1.08 });
          });
        },
        async (d) => { // the columns stand above, the title has gone down to the foot of the page
          const s = await open(d, 0.6, 4.15, 7.3, 1.05, { max: 26, valign: 'middle' }), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
          nb(s, 8.1, 4.3); foot(s, 0.6, 8.8);
          lineH(s, 0.6, 4.05, 8.8);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap);
            big(s, String(i + 1), x, 0.3, w, 0.85, { max: 44, valign: 'middle' });
            h3(s, st.h, x, 1.17, w, 0.5, { max: 14 });
            p(s, st.t, x, 1.69, w, 2.28, { max: 13, ls: 1.08 });
          });
        },
      ],
      stats: [
        async (d) => { // one number fills the right, its two neighbours under it; the note under the title
          const s = await page(d), [a, ...rest] = d.stats;
          big(s, a.value, 4.15, 0.55, 5.25, 1.9, { max: 88, min: 28, valign: 'middle' });
          p(s, a.label, 4.15, 2.45, 5.25, 0.6, { max: 14 });
          lineH(s, 4.15, 3.14, 5.25);
          rest.forEach((x, i) => {
            const xx = 4.15 + i * 2.7;
            k.head(s, x.value, xx, 3.24, 2.55, 0.68, { max: 28, min: 14, color: C.ink, valign: 'middle' });
            p(s, x.label, xx, 3.94, 2.55, 1.15, { max: 12.5, color: C.muted, ls: 1.08 });
          });
          if (d.note) p(s, d.note, 0.6, 2.35, 3.05, 1.7, { max: 10.5, min: 8.5, color: C.muted, ls: 1.08, valign: 'bottom' });
        },
        async (d) => { // three columns across the whole page, a thin line at the foot of each
          const s = await open(d, 0.6, 0.45, 7.3, 0.85, { max: 26 }), w = 2.75, gap = 0.27;
          nb(s, 8.1, 0.15); foot(s, 0.6, 8.8);
          d.stats.forEach((x, i) => {
            const xx = 0.6 + i * (w + gap);
            big(s, x.value, xx, 1.45, w, 1.1, { max: 44, min: 16, valign: 'bottom' });
            lineH(s, xx, 2.6, w);
            p(s, x.label, xx, 2.68, w, 0.85, { max: 13.5, ls: 1.08 });
          });
          if (d.note) p(s, d.note, 0.6, 3.65, 8.8, 1.5, { max: 13, color: C.muted, ls: 1.12, valign: 'bottom' });
        },
        async (d) => { // the words at the line, the numbers out at the far edge
          const s = await page(d), rh = 1.13;
          d.stats.forEach((x, i) => {
            const y = 0.55 + i * rh;
            p(s, x.label, 4.15, y, 2.65, rh - 0.1, { max: 13, ls: 1.08, valign: 'middle' });
            big(s, x.value, 6.85, y, 2.55, rh - 0.1, { max: 34, min: 15, align: 'right', valign: 'middle' });
            lineH(s, 4.15, y + rh - 0.05, 5.25);
          });
          if (d.note) p(s, d.note, 4.15, 3.98, 5.25, 1.17, { max: 12, min: 9.5, color: C.muted, ls: 1.08, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // the two sides one above the other, names on the left
          const s = await open(d, 0.6, 0.35, 7.3, 0.75, { max: 24, valign: 'middle' }), hh = 1.95;
          nb(s, 8.1, 0.15); foot(s, 0.6, 8.8);
          [d.left, d.right].forEach((side, i) => {
            const y = 1.2 + i * hh;
            lineH(s, 0.6, y, 8.8);
            k.head(s, side.h, 0.6, y + 0.1, 2.5, hh - 0.2, { max: 20, min: 12, color: C.accent, valign: 'top' });
            const a = side.items.filter((_, j) => j % 2 === 0), b = side.items.filter((_, j) => j % 2), { rows, fs } = L.rowsFit([a, b], 14, 3.0, F.body, 0.1, hh - 0.2);
            side.items.forEach((it, j) => k.txt(s, it, 3.3 + (j % 2) * 3.15, y + 0.1 + (j > 1 ? rows[0] : 0), 2.95, rows[Math.floor(j / 2)], { size: fs, color: C.ink }));
          });
        },
        async (d) => { // the surface and the depth: mirrored about the sounding line
          const s = await open(d, 0.6, 0.35, 7.3, 0.75, { max: 24, valign: 'middle' }), w = 4.05, cx = 5;
          nb(s, 8.1, 0.15); foot(s, 0.6, 8.8);
          lineV(s, cx, 1.2, 3.95);
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14.5, w, F.body, 0.2, 3.1);
          k.head(s, d.left.h, 0.6, 1.2, w, 0.7, { max: 20, min: 12, color: C.accent, align: 'right' }); k.head(s, d.right.h, 5.35, 1.2, w, 0.7, { max: 20, min: 12, color: C.ink });
          let y = 2.0;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.6, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
      ],
      statement: [
        async (d) => { // the thought runs across the whole page, the note below a line
          const s = await open(d, 0.6, 0.45, 7.3, 0.55, { max: 16, bold: false, color: C.accent });
          nb(s, 8.1, 0.15); foot(s, 0.6, 8.8);
          k.head(s, L.runs(d.text), 0.6, 1.05, 8.8, 2.75, { max: 42, min: 17, color: C.ink, valign: 'middle' });
          lineH(s, 0.6, 3.9, 8.8);
          if (d.caption) p(s, d.caption, 0.6, 4.0, 8.8, 1.17, { max: 13, min: 10, color: C.muted, ls: 1.1 });
        },
        async (d) => { // the thought on the left, title and note at the right, on a line
          const s = await open(d, 6.4, 0.55, 3.0, 1.2, { max: 18, bold: false, color: C.accent, align: 'right' });
          nb(s, 0.6, 0.15, 'left'); foot(s, 0.6, 5.3);
          k.head(s, L.runs(d.text), 0.6, 0.85, 5.3, 4.3, { max: 36, min: 16, color: C.ink, valign: 'middle' });
          lineV(s, 6.15, 0.55, 4.6);
          if (d.caption) p(s, d.caption, 6.4, 1.85, 3.0, 3.3, { max: 12.5, min: 10, color: C.muted, ls: 1.1, valign: 'bottom', align: 'right' });
        },
      ],
      timeline: [
        async (d) => { // a sounding line with years for depths
          const s = await open(d, 0.6, 0.35, 7.3, 0.75, { max: 24, valign: 'middle' }), hh = 3.96 / 4;
          nb(s, 8.1, 0.15); foot(s, 0.6, 8.8);
          lineV(s, 2.55, 1.18, 3.98);
          d.items.forEach((it, i) => {
            const y = 1.2 + i * hh;
            big(s, it.year, 0.6, y, 1.8, 0.42, { max: 20, min: 11, align: 'right', valign: 'middle' });
            t.line(s, 2.45, y + 0.21, 0.2, 0, C.accent, 1.25);
            h3(s, it.h, 2.85, y, 6.55, 0.34, { max: 14.5, valign: 'middle' });
            p(s, it.t, 2.85, y + 0.35, 6.55, hh - 0.42, { max: 13, ls: 1.08, color: C.muted });
          });
        },
        async (d) => { // four columns, each opening lower than the last
          const s = await open(d, 0.6, 0.35, 7.3, 0.75, { max: 24, valign: 'middle' }), gap = 0.28, w = (8.8 - gap * 3) / 4;
          nb(s, 8.1, 0.15); foot(s, 0.6, 8.8);
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap), y = 1.15 + i * 0.32;
            lineV(s, x, 1.15, y - 1.15 + 0.42);
            big(s, it.year, x + 0.08, y, w - 0.08, 0.42, { max: 19, min: 11, valign: 'middle' });
            h3(s, it.h, x + 0.08, y + 0.44, w - 0.08, 0.5, { max: 13.5 });
            p(s, it.t, x + 0.08, y + 0.95, w - 0.08, 5.16 - y - 0.95, { max: 13, ls: 1.08 });
          });
        },
        async (d) => { // beside the title, the years stand out at the far edge
          const s = await page(d), hh = 4.6 / 4;
          d.items.forEach((it, i) => {
            const y = 0.55 + i * hh;
            h3(s, it.h, 4.15, y, 3.5, 0.34, { max: 14.5, valign: 'middle' });
            big(s, it.year, 7.7, y, 1.7, 0.36, { max: 18, min: 10.5, align: 'right', valign: 'middle' });
            p(s, it.t, 4.15, y + 0.35, 5.25, hh - 0.42, { max: 13, ls: 1.08, color: C.muted });
            if (i < 3) lineH(s, 4.15, y + hh - 0.05, 5.25);
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old rows look like the cards
    R.stats = V.stats.shift(); // and so do the old stat rows
    R.timeline = V.timeline.shift(); // and the old timeline rows
    return V;
  },
  tone: "chuqur va ishonchli: aniq dalillar, xotirjam ohang" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["fade", "p14:ripple", "morph"], "cover": ["focusIn", "riseWords"], "mark": "focusIn", "deco": "softGrow", "sig": {"title": "focusIn", "body": "fadeUp", "item": "softGrow", "image": "circle", "number": "focusIn", "order": "centerOut", "stagger": 0.22}, "tempo": 1.25, "kenburns": true};
