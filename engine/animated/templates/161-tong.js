/** 161 Tong — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 161, slug: 'tong', name: "Tong", mode: 'left', list: 'rows', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '2D2A32', muted: '6B6470', accent: 'C8553D' }, photo: { r: 0.1 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'FCE8DC'],[1,'E9E3F4']]), kind==='cover' ? blobs([[1350,180,260,'F9B9A3',0.9],[1500,520,220,'D8CCF2',0.8]],140) : blobs([[1550,880,260,'F6CDBE',0.6]],150), grain(0.05)),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    const open = async (kind, d, x, y, w, h, o = {}) => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 28, min: 13, color: C.ink, valign: 'bottom', ...o }); num(s); k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: C.muted }); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 16, min: 10, color: C.ink, ls: 1.3, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 17, min: 11, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 60, min: 18, color: C.accent, ...o });
    const V = {
      image: [
        async (d) => { // the picture across the top of the page, title and text side by side under it
          const s = await open('page', {}, 0, 0, 0, 0);
          await k.photo(s, d.image, 0, 0, 10, 2.85);
          k.head(s, d.title, 0.7, 3.05, 2.8, 2.05, { max: 26, min: 14, color: C.ink, valign: 'top' });
          p(s, d.text, 3.75, 3.08, 5.55, 2.1, { max: 14, ls: 1.2 });
        },
        async (d) => { // a round picture, large
          const s = await open('page', d, 0.7, 0.45, 8.6, 0.9);
          await k.photo(s, d.image, 5.75, 1.45, 3.55, 3.55, { mask: 'circle' });
          p(s, d.text, 0.7, 1.55, 4.7, 3.5, { valign: 'middle' });
        },
        async (d) => { // the picture fills the page, a pale leaf of text on it
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625);
          t.rect(s, 0.7, 0.55, 5.1, 4.55, 'FCF1EA', { t: 6, r: 0.08, name: 'Leaf' });
          k.head(s, d.title, 1.0, 0.75, 4.5, 1.0, { max: 24, min: 14, color: C.ink, valign: 'bottom' });
          p(s, d.text, 1.0, 1.85, 4.5, 3.1, { max: 14, ls: 1.2 });
          num(s);
        },
        async (d) => { // a tall strip of picture along the left edge
          const s = await open('page', d, 3.2, 0.45, 6.1, 0.9);
          await k.photo(s, d.image, 0, 0, 2.75, 5.625);
          p(s, d.text, 3.2, 1.55, 6.1, 3.5, { valign: 'top' });
        },
      ],
      cards: [
        async (d) => { // columns, each opened by a large numeral
          const s = await page(d), n = d.items.length, gap = 0.4, w = (8.6 - gap * (n - 1)) / n;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            big(s, String(i + 1), x, 1.5, w, 0.95, { max: 54, valign: 'top' });
            h3(s, it.h, x, 2.5, w, 0.55);
            p(s, it.t, x, 3.08, w, 1.98, { max: 14, min: 10, ls: 1.2, color: C.muted });
          });
        },
        async (d) => { // a slope: every item a step further in
          const s = await page(d), n = d.items.length, hh = 3.5 / n, sh = n === 4 ? 0.6 : 0.85;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * sh, w = 8.6 - i * sh, y = 1.55 + i * hh;
            h3(s, it.h, x, y, w, 0.34, { color: C.accent, max: 15 });
            p(s, it.t, x, y + 0.34, w, hh - 0.4, { max: 13, min: 10, ls: 1.15 });
          });
        },
        async (d) => { // the title stands alone on the left, items run down the right
          const s = await open('focus', d, 0.7, 0.7, 3.0, 3.2, { max: 34, valign: 'top' }), n = d.items.length, hh = 4.45 / n;
          t.line(s, 4.0, 0.7, 0, 4.3, C.accent, 1);
          for (const [i, it] of d.items.entries()) {
            const y = 0.6 + i * hh;
            t.img(s, await L.icon(it.icon, C.accent, 1.75), 4.3, y + 0.04, 0.3, 0.3);
            h3(s, it.h, 4.75, y, 4.55, 0.38, { max: 15 });
            p(s, it.t, 4.75, y + 0.38, 4.55, hh - 0.45, { max: 13, min: 10, ls: 1.15, color: C.muted });
          }
        },
        async (d) => { // four quiet corners, an icon for each
          const s = await page(d), n = d.items.length, w = 4.1, hh = 1.72;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = 0.7 + (i % 2) * (w + 0.4), y = 1.55 + Math.floor(i / 2) * (hh + 0.05), ww = wide ? 8.6 : w;
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x, y + 0.02, 0.5, 0.5);
            h3(s, it.h, x + 0.68, y, ww - 0.68, 0.5, { valign: 'middle' });
            p(s, it.t, x + 0.68, y + 0.52, ww - 0.68, hh - 0.58, { max: 13, min: 10, ls: 1.15, color: C.muted });
          }
        },
      ],
      process: [
        async (d) => { // the words above, a very large pale numeral closing each column
          const s = await page(d), n = d.steps.length, gap = 0.35, w = (8.6 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            t.text(s, String(i + 1), { x, y: 3.75, w, h: 1.4, fontFace: F.head, bold: true, fontSize: 80, color: C.accent, transparency: 80, align: 'right', valign: 'bottom', noShrink: true });
            h3(s, st.h, x, 1.55, w, 0.55);
            p(s, st.t, x, 2.12, w, 2.9, { max: 14, min: 10, ls: 1.2 });
          });
        },
        async (d) => { // down the middle of the page, an arrow between the steps
          const s = await page(d), n = d.steps.length, hh = 3.55 / n;
          d.steps.forEach((st, i) => {
            const y = 1.48 + i * hh;
            h3(s, st.h, 1.2, y, 7.6, 0.34, { align: 'center', max: 15, color: C.accent });
            p(s, st.t, 1.2, y + 0.34, 7.6, hh - 0.62, { align: 'center', max: 13, min: 10, ls: 1.1 });
            if (i < n - 1) t.text(s, '↓', { x: 4.7, y: y + hh - 0.28, w: 0.6, h: 0.26, fontSize: 13, color: C.accent, align: 'center', valign: 'middle' });
          });
        },
        async (d) => { // a thin horizon: steps above and below it, in turn
          const s = await page(d), n = d.steps.length, ly = 3.28, w = 3.9, xs = n === 4 ? [0.7, 1.2, 5.0, 5.4] : [0.7, 3.05, 5.4];
          t.line(s, 0.7, ly, 8.6, 0, C.accent, 1);
          d.steps.forEach((st, i) => {
            const x = xs[i], up = i % 2 === 0, y = up ? 1.5 : ly + 0.12;
            t.oval(s, x, ly - 0.07, 0.14, 0.14, C.accent);
            h3(s, `${i + 1}. ${st.h}`, x, y, w, 0.34, { max: 14 });
            p(s, st.t, x, y + 0.34, w, 1.3, { max: 12.5, min: 10, ls: 1.15, color: C.muted });
          });
        },
      ],
      stats: [
        async (d) => { // one number nearly fills the page
          const s = await page(d), [a, ...rest] = d.stats;
          big(s, a.value, 0.7, 1.5, 5.2, 1.95, { max: 96, min: 30, valign: 'middle' });
          p(s, a.label, 0.7, 3.5, 4.9, 1.0, { max: 16, min: 11 });
          rest.forEach((x, i) => {
            const y = 1.55 + i * 1.12;
            k.head(s, x.value, 6.25, y, 3.05, 0.58, { max: 30, min: 15, color: C.ink, valign: 'middle' });
            p(s, x.label, 6.25, y + 0.58, 3.05, 0.5, { max: 11.5, min: 9.5, color: C.muted, ls: 1.1 });
          });
          if (d.note) p(s, d.note, 6.25, 3.82, 3.05, 1.25, { max: 10.5, min: 8.5, color: C.muted, ls: 1.1 });
        },
        async (d) => { // numbers stacked, each with its words at its side
          const s = await page(d), rh = d.note ? 0.95 : 1.15;
          d.stats.forEach((x, i) => {
            const y = 1.55 + i * rh;
            k.head(s, x.value, 0.7, y, 3.3, rh - 0.1, { max: 42, min: 18, color: C.accent, valign: 'middle', align: 'right' });
            p(s, x.label, 4.3, y, 5.0, rh - 0.1, { valign: 'middle', max: 15 });
            hair(s, 4.3, y + rh - 0.05, 5.0);
          });
          if (d.note) p(s, d.note, 0.7, 4.45, 8.6, 0.65, { max: 11, min: 9, color: C.muted, ls: 1.1 });
        },
      ],
      compare: [
        async (d) => { // one above the other: a heading on the left, the list running across
          const s = await page(d), hh = 1.72;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.55 + i * (hh + 0.05);
            k.head(s, side.h, 0.7, y, 2.3, hh - 0.1, { max: 22, min: 13, color: i ? C.accent : C.ink, valign: 'top' });
            side.items.forEach((it, j) => p(s, it, 3.2 + (j % 2) * 3.15, y + Math.floor(j / 2) * 0.8, 2.95, 0.76, { max: 13, min: 10, ls: 1.1 }));
            if (!i) hair(s, 0.7, y + hh - 0.02, 8.6);
          });
        },
        async (d) => { // mirrored about a thin line
          const s = await page(d), w = 3.95, cx = 5;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.2, 2.8);
          k.head(s, d.left.h, 0.7, 1.5, w, 0.6, { max: 22, min: 13, color: C.ink, align: 'right' }); k.head(s, d.right.h, 5.35, 1.5, w, 0.6, { max: 22, min: 13, color: C.accent });
          t.line(s, cx, 1.55, 0, 3.45, C.accent, 1);
          let y = 2.2;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
      ],
      statement: [
        async (d) => { // low on the page, large; the note small at the top
          const s = await open('focus', {}, 0, 0, 0, 0);
          k.head(s, d.title, 0.7, 0.5, 5, 0.45, { max: 15, min: 11, color: C.accent, valign: 'top' });
          if (d.caption) p(s, d.caption, 0.7, 0.98, 6.2, 1.4, { max: 13, min: 10, color: C.muted, ls: 1.15 });
          k.head(s, L.runs(d.text), 0.7, 2.45, 8.6, 2.65, { max: 40, min: 17, color: C.ink, valign: 'bottom' });
        },
        async (d) => { // set to the right, the note at the left edge
          const s = await open('focus', d, 0.7, 0.45, 8.6, 0.9);
          if (d.caption) p(s, d.caption, 0.7, 1.6, 2.6, 3.45, { max: 12.5, min: 9.5, color: C.muted, ls: 1.15, valign: 'bottom' });
          t.line(s, 3.55, 1.6, 0, 3.45, C.accent, 1);
          k.head(s, L.runs(d.text), 3.85, 1.55, 5.45, 3.5, { max: 36, min: 16, color: C.ink, align: 'right', valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // years large across the top, four columns under them
          const s = await page(d), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, it.year, x, 1.5, w, 0.7, { max: 28, min: 12, color: C.accent, valign: 'bottom' });
            hair(s, x, 2.26, w);
            h3(s, it.h, x, 2.34, w, 0.5, { max: 14 });
            p(s, it.t, x, 2.86, w, 2.2, { max: 13, min: 9.5, ls: 1.15, color: C.muted });
          });
        },
        async (d) => { // years down the middle, what happened to the left, what it meant to the right
          const s = await page(d), n = d.items.length, hh = 3.5 / n;
          d.items.forEach((it, i) => {
            const y = 1.55 + i * hh;
            h3(s, it.h, 0.7, y, 3.0, hh - 0.1, { align: 'right', valign: 'middle', max: 15 });
            k.head(s, it.year, 3.85, y, 1.5, hh - 0.1, { max: 20, min: 10, color: C.accent, align: 'center', valign: 'middle' });
            p(s, it.t, 5.5, y, 3.8, hh - 0.08, { max: 12.5, min: 9.5, ls: 1.1, valign: 'middle', color: C.muted });
          });
        },
        async (d) => { // four rooms, a pale year filling each
          const s = await page(d), w = 4.15, hh = 1.72;
          d.items.forEach((it, i) => {
            const x = 0.7 + (i % 2) * (w + 0.3), y = 1.55 + Math.floor(i / 2) * (hh + 0.05);
            t.text(s, it.year, { x, y: y - 0.05, w, h: 0.75, fontFace: F.head, bold: true, color: C.accent, transparency: 70, valign: 'top', fontSize: L.fit(it.year, w, 0.72, 40, 18, F.head, true) });
            h3(s, it.h, x, y + 0.62, w, 0.32, { max: 14 });
            p(s, it.t, x, y + 0.94, w, hh - 1.0, { max: 12, min: 9.5, ls: 1.1 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.timeline = V.timeline.shift(); // nor the first timeline the rows of the cards
    return V;
  },
  tone: "tong kabi yumshoq va ochiq: sodda gaplar, bir slaydda bir fikr" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["fade", "p14:reveal|thruBlk=\"0\"", "dissolve"], "cover": ["riseWords", "fadeWords"], "mark": "fade", "deco": "riseUp", "sig": {"title": "riseWords", "body": "fadeUp", "item": "riseUp", "image": "focusIn", "number": "riseSettle", "order": "seq", "stagger": 0.24}, "tempo": 1.3, "kenburns": true};
