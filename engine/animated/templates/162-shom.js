/** 162 Shom — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 162, slug: 'shom', name: "Şom", mode: 'center', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'FFF4EC', muted: 'E9C9D6', accent: 'FFB38A' }, photo: 'circle', rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin(kind==='cover' ? [[0,'1E1B4B'],[0.55,'6B2E6E'],[1,'D9576B']] : [[0,'221D52'],[1,'4B2463']]), kind==='page' ? raw('') : blobs([[800,900,420,'F08A5D',0.38]],160), grain(0.06)),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, at dusk: everything on one centre line, sinking toward a low horizon: a deck's pages must not look alike (L.pages)
    const open = async (kind, d, y = 0.45, h = 0.9, o = {}) => { const s = await slide(kind); if (d.title) k.head(s, d.title, 1.0, y, 8.0, h, { max: 28, min: 13, color: C.ink, align: 'center', valign: 'bottom', ...o }); num(s); k.foot(s, { x: 1.0, w: 8.0, y: 5.3, size: 7.5, color: C.muted, align: 'center' }); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 15, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, color: C.ink, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 54, min: 16, color: C.accent, ...o });
    const line = (s, y, x = 0, w = 10) => t.line(s, x, y, w, 0, C.accent, 0.75);
    const half = (v) => { const w = String(v).split(' '); let m = Math.ceil(w.length / 2); return [w.slice(0, m).join(' '), w.slice(m).join(' ')]; };
    const V = {
      image: [
        async (d) => { // the picture is a sun going down behind the horizon, the words in the sky over it
          const s = await open('page', d, 0.3, 0.75);
          p(s, d.text, 1.0, 1.12, 8.0, 1.62, { align: 'center', max: 14, valign: 'middle' });
          t.img(s, await L.photo(L.src(d.image), 4.6, 2.3, { mask: { path: 'M0,1 C0,0.42 0.22,0 0.5,0 C0.78,0 1,0.42 1,1 Z' } }), 2.7, 2.88, 4.6, 2.3, { alt: '' });
          line(s, 5.18);
        },
        async (d) => { // a round picture in the middle, the words parted to either side of it
          const s = await open('page', d), [a, b] = half(d.text), dd = 2.85;
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), 5 - dd / 2, 1.85, dd, dd, { alt: '' });
          p(s, a, 0.7, 1.55, 2.75, 3.5, { align: 'right', valign: 'middle' });
          p(s, b, 6.55, 1.55, 2.75, 3.5, { valign: 'middle' });
        },
        async (d) => { // the picture fills the page under a veil of dusk
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625);
          t.rect(s, 0, 0, 10, 5.625, '221D52', { t: 14, name: 'Dusk veil' });
          k.head(s, d.title, 1.0, 0.75, 8.0, 1.2, { max: 28, min: 14, color: 'FFFFFF', align: 'center', valign: 'bottom' });
          line(s, 2.08, 4.4, 1.2);
          p(s, d.text, 1.3, 2.2, 7.4, 2.9, { align: 'center', max: 15, color: 'FFFFFF' });
          num(s); k.foot(s, { x: 1.0, w: 8.0, y: 5.3, size: 7.5, color: 'FFFFFF', align: 'center' });
        },
        async (d) => { // a strip of picture running off both edges, title and words under it
          const s = await open('page', {});
          await k.photo(s, d.image, 0, 0, 10, 2.45);
          k.head(s, d.title, 1.0, 2.52, 8.0, 0.72, { max: 24, min: 13, color: C.ink, align: 'center' });
          p(s, d.text, 1.0, 3.26, 8.0, 1.92, { align: 'center', max: 14 });
        },
      ],
      cards: [
        async (d) => { // first stars: the items hang on an arch across the sky
          const s = await page(d), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, ys = n === 4 ? [1.9, 1.5, 1.5, 1.9] : [1.85, 1.5, 1.85];
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = ys[i];
            t.img(s, await L.icon(it.icon, C.accent, 1.5), x + w / 2 - 0.2, y, 0.4, 0.4);
            h3(s, it.h, x, y + 0.45, w, 0.55, { align: 'center', max: 15 });
            p(s, it.t, x, y + 1.0, w, 5.15 - y - 1.0, { align: 'center', max: 13.5, color: C.muted });
          }
        },
        async (d) => { // a thin axis: names on its left, what they mean on its right
          const s = await page(d), n = d.items.length, hh = 3.55 / n;
          t.line(s, 3.75, 1.55, 0, 3.55, C.accent, 0.75);
          d.items.forEach((it, i) => {
            const y = 1.55 + i * hh;
            h3(s, it.h, 0.7, y, 2.85, hh - 0.08, { align: 'right', valign: 'middle', max: 16 });
            p(s, it.t, 3.97, y, 5.33, hh - 0.06, { valign: 'middle', max: 13.5, color: C.muted });
          });
        },
        async (d) => { // the title sets last: it sits low on the horizon, the items above it
          const s = await open('page', {}), n = d.items.length, gap = 0.35, w = (8.6 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap);
            big(s, String(i + 1), x, 0.4, w, 0.7, { max: 32, align: 'center' });
            h3(s, it.h, x, 1.12, w, 0.55, { align: 'center', max: 15 });
            p(s, it.t, x, 1.68, w, 2.22, { align: 'center', max: 13.5 });
          }
          line(s, 4.0);
          k.head(s, d.title, 1.0, 4.08, 8.0, 1.12, { max: 28, min: 13, color: C.ink, align: 'center', valign: 'middle' });
        },
        async (d) => { // the page quartered by two thin lines, a word in each room
          const s = await page(d), n = d.items.length, w = 3.95, hh = 1.72;
          t.line(s, 1.0, 3.3, 8.0, 0, C.accent, 0.75);
          if (n === 4) t.line(s, 5, 1.55, 0, 3.5, C.accent, 0.75); else t.line(s, 5, 1.55, 0, 1.68, C.accent, 0.75);
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = wide ? 2.0 : 0.85 + (i % 2) * (w + 0.35), y = 1.5 + Math.floor(i / 2) * (hh + 0.1), ww = wide ? 6.0 : w;
            h3(s, it.h, x, y + 0.02, ww, 0.36, { align: 'center', max: 15, color: C.accent });
            p(s, it.t, x, y + 0.4, ww, hh - 0.46, { align: 'center', max: 13.5 });
          }
        },
      ],
      process: [
        async (d) => { // the path of the sun: each step lower and further on
          const s = await page(d), n = d.steps.length, w = 4.1, sx = (8.6 - w) / (n - 1), hh = 3.6 / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * sx, y = 1.5 + i * hh;
            t.text(s, String(i + 1), { x, y, w: 0.4, h: 0.32, fontFace: F.head, bold: true, fontSize: 15, color: C.accent, valign: 'middle' });
            h3(s, st.h, x + 0.4, y, w - 0.4, 0.32, { valign: 'middle', max: 14 });
            p(s, st.t, x + 0.4, y + 0.33, w - 0.4, hh - 0.35, { max: 13.5, ls: 1.02 });
          });
        },
        async (d) => { // a low horizon: numbers and names stand over it, what happens lies under it
          const s = await page(d), n = d.steps.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, ly = 3.42;
          line(s, ly);
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            big(s, String(i + 1), x, 1.5, w, 1.2, { max: 60, align: 'center', valign: 'bottom' });
            h3(s, st.h, x, 2.74, w, 0.62, { align: 'center', valign: 'bottom', max: 14 });
            p(s, st.t, x, ly + 0.1, w, 5.17 - ly - 0.1, { align: 'center', max: 13, min: 9.5, ls: 1.08 });
          });
        },
        async (d) => { // the title in a thin ring like the last of the sun, the steps round it
          const s = await open('page', {}), n = d.steps.length, dd = 2.3, cx = 5, cy = 2.75, w = 2.75;
          t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, null, { line: { color: C.accent, width: 0.75 }, name: 'Ring' });
          k.head(s, d.title, cx - dd * 0.38, cy - dd * 0.32, dd * 0.76, dd * 0.64, { max: 17, min: 10.5, color: C.ink, align: 'center' });
          const spots = n === 4 ? [[0.7, 0.55, 'right'], [6.55, 0.55, 'left'], [0.7, 2.9, 'right'], [6.55, 2.9, 'left']] : [[0.7, 1.05, 'right'], [6.55, 1.05, 'left'], [2.6, 4.0, 'center']];
          d.steps.forEach((st, i) => {
            const [x, y, a] = spots[i], ww = a === 'center' ? 4.8 : w, hh = a === 'center' ? 1.2 : 2.25;
            h3(s, `${i + 1}. ${st.h}`, x, y, ww, a === 'center' ? 0.32 : 0.56, { align: a, max: 14, color: C.accent, valign: a === 'center' ? 'top' : 'bottom' });
            p(s, st.t, x, y + (a === 'center' ? 0.33 : 0.58), ww, hh - (a === 'center' ? 0.33 : 0.58), { align: a, max: 13, ls: 1.12 });
          });
        },
        async (d) => { // a light spreading along the horizon: each step wider than the last
          const s = await page(d), n = d.steps.length, hh = 3.6 / n;
          d.steps.forEach((st, i) => {
            const w = (n === 4 ? 4.9 : 5.4) + i * (n === 4 ? 1.05 : 1.4), x = 5 - w / 2, y = 1.5 + i * hh;
            h3(s, st.h, x, y, w, 0.32, { align: 'center', max: 14.5, color: C.accent, valign: 'middle' });
            p(s, st.t, x, y + 0.33, w, hh - 0.4, { align: 'center', max: 13, ls: 1.1 });
          });
        },
      ],
      stats: [
        async (d) => { // one number takes the whole sky, the other two low at its sides
          const s = await page(d), [a, b, c] = d.stats;
          big(s, a.value, 1.5, 1.42, 7.0, 1.3, { max: 84, min: 28, align: 'center', valign: 'middle' });
          p(s, a.label, 2.2, 2.72, 5.6, 0.55, { align: 'center', max: 14 });
          [b, c].forEach((x, i) => {
            const xx = i ? 5.25 : 1.0;
            k.head(s, x.value, xx, 3.3, 3.75, 0.55, { max: 28, min: 14, color: C.ink, align: 'center' });
            p(s, x.label, xx, 3.86, 3.75, 0.5, { align: 'center', max: 11.5, color: C.muted, ls: 1.1 });
          });
          if (d.note) p(s, d.note, 1.0, 4.4, 8.0, 0.78, { align: 'center', max: 10.5, min: 9, color: C.muted, ls: 1.1 });
        },
        async (d) => { // words on the left set against the numbers, which stand out on the right
          const s = await page(d), rh = d.note ? 0.92 : 1.15;
          d.stats.forEach((x, i) => {
            const y = 1.52 + i * rh;
            p(s, x.label, 0.7, y, 4.9, rh - 0.08, { valign: 'middle', max: 14.5, align: 'right' });
            big(s, x.value, 5.85, y, 3.45, rh - 0.08, { max: 40, min: 16, valign: 'middle' });
            if (i < 2) line(s, y + rh - 0.04, 2.4, 5.2);
          });
          if (d.note) p(s, d.note, 1.0, 4.36, 8.0, 0.82, { align: 'center', max: 10.5, min: 9.5, color: C.muted, ls: 1.1 });
        },
        async (d) => { // numbers sinking across the page toward the note
          const s = await page(d), w = 2.7, ys = [1.45, 1.9, 2.35];
          d.stats.forEach((x, i) => {
            const xx = 0.7 + i * (w + 0.25), y = ys[i];
            big(s, x.value, xx, y, w, 0.85, { max: 36, min: 15, align: 'center', valign: 'middle' });
            p(s, x.label, xx, y + 0.86, w, 0.68, { align: 'center', max: 12.5, ls: 1.1 });
          });
          if (d.note) p(s, d.note, 0.7, 2.75, 5.5, 2.4, { max: 11, min: 9.5, color: C.muted, ls: 1.1, valign: 'bottom' });
        },
      ],
      compare: [
        async (d) => { // mirrored about the centre line, the two names down on the horizon
          const s = await page(d), w = 3.85, cx = 5, ly = 4.32;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.16, 2.4);
          t.line(s, cx, 1.55, 0, ly - 1.55, C.accent, 0.75);
          let y = 1.55;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.9, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.25, y + rows[0] / 2, w, rh, { size: fs, color: C.ink }); // the right side stands half a row lower: a zip about the line
            y += rh;
          });
          line(s, ly);
          k.head(s, d.left.h, 0.9, ly + 0.08, w, 0.78, { max: 22, min: 12, color: C.accent, align: 'right' }); k.head(s, d.right.h, 5.25, ly + 0.08, w, 0.78, { max: 22, min: 12, color: C.ink });
        },
        async (d) => { // over the horizon and under it, each side centred in two columns
          const s = await page(d), ly = 3.32;
          line(s, ly);
          [d.left, d.right].forEach((side, i) => {
            const y = i ? ly + 0.1 : 1.48, hh = 1.76;
            k.head(s, side.h, 1.0, y, 8.0, 0.38, { max: 17, min: 12, color: i ? C.ink : C.accent, align: 'center', valign: 'top' });
            side.items.forEach((it, j) => p(s, it, 1.0 + (j % 2) * 4.15, y + 0.4 + Math.floor(j / 2) * 0.68, 3.85, 0.64, { align: 'center', max: 12.5, ls: 1.08 }));
          });
        },
      ],
      statement: [
        async (d) => { // the note stays high in the sky, the thought has sunk to rest on the horizon at the foot
          const s = await open('page', d, 0.3, 0.55, { max: 16, bold: false, color: C.muted });
          if (d.caption) p(s, d.caption, 1.0, 0.9, 8.0, 1.15, { align: 'center', max: 12.5, min: 9.5, color: C.muted, ls: 1.1 });
          k.head(s, L.runs(d.text), 0.8, 2.1, 8.4, 2.95, { max: 40, min: 17, color: C.ink, align: 'center', valign: 'bottom' });
          line(s, 5.14);
        },
        async (d) => { // two halves about the axis: the thought large, the note small
          const s = await open('page', d);
          t.line(s, 6.25, 1.6, 0, 3.45, C.accent, 0.75);
          k.head(s, L.runs(d.text), 0.7, 1.55, 5.3, 3.55, { max: 36, min: 16, color: C.ink, align: 'right' });
          if (d.caption) p(s, d.caption, 6.48, 1.6, 2.82, 3.45, { max: 13, min: 10, color: C.muted, valign: 'middle', ls: 1.15 });
        },
      ],
      timeline: [
        async (d) => { // years sink down the page, one column at a time
          const s = await page(d), gap = 0.25, w = (8.6 - gap * 3) / 4;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap), y = 1.45 + i * 0.3;
            big(s, it.year, x, y, w, 0.52, { max: 24, min: 12, align: 'center', valign: 'bottom' });
            h3(s, it.h, x, y + 0.55, w, 0.48, { align: 'center', max: 14 });
            p(s, it.t, x, y + 1.05, w, 5.16 - y - 1.05, { align: 'center', max: 13, ls: 1.1 });
          });
        },
        async (d) => { // the earlier years to the left of the axis, the later to the right
          const s = await page(d), w = 3.95, hh = 1.76;
          t.line(s, 5, 1.55, 0, 3.55, C.accent, 0.75);
          d.items.forEach((it, i) => {
            const right = i > 1, x = right ? 5.3 : 0.75, y = 1.5 + (i % 2) * (hh + 0.02), a = right ? 'left' : 'right';
            big(s, it.year, x, y, w, 0.44, { max: 22, min: 12, align: a });
            h3(s, it.h, x, y + 0.45, w, 0.32, { align: a, max: 14 });
            p(s, it.t, x, y + 0.77, w, hh - 0.8, { align: a, max: 12.5, ls: 1.08 });
          });
        },
        async (d) => { // the words above, the years stand along the horizon at the foot
          const s = await page(d), gap = 0.3, w = (8.6 - gap * 3) / 4, ly = 4.3;
          line(s, ly);
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            h3(s, it.h, x, 1.5, w, 0.5, { align: 'center', max: 14, valign: 'middle' });
            p(s, it.t, x, 2.03, w, ly - 2.1, { align: 'center', max: 13, ls: 1.1 });
            big(s, it.year, x, ly + 0.1, w, 0.78, { max: 26, min: 12, align: 'center', valign: 'middle' });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old columns look like the cards
    R.stats = V.stats.shift(); // and so do the old number columns
    R.timeline = V.timeline.shift(); // and the old timeline rows
    return V;
  },
  tone: "kechki osoyishtalik: mulohazali, ravon va qisqa iboralar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["dissolve", "fade", "p14:pan|dir=\"d\""], "cover": ["fadeWords", "fadeLetters"], "mark": "fade", "deco": "sinkDown", "sig": {"title": "fadeDown", "body": "fade", "item": "fadeDown", "image": "dissolve", "number": "fade", "order": "reverse", "stagger": 0.26}, "tempo": 1.4, "kenburns": true};
