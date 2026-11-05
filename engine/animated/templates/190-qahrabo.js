/** 190 Qahrabo — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 190, slug: 'qahrabo', name: "Qahrabo", mode: 'left', list: 'rows', num: 'big', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFF4E0', muted: 'E3C79B', accent: 'FFB547' }, photo: { r: 0.08 }, rule: true, caps: false, bold: true,
  bg: (kind) => (kind === 'honey' ? compose(flat('E8A33D'), rad(300,200,900,[[0,'F6C468',0.8],[1,'E8A33D',0]]), grain(0.06)) : compose(flat('2A1A0C'), rad(kind==='cover'?1200:1500,kind==='cover'?300:100,900,[[0,'8A4E14',0.85],[1,'2A1A0C',0]]), grain(0.06))),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in amber: a polished cabochon, a falling drop, layers of resin, pictures sunk in warm light, one page of pure honey: a deck's pages must not look alike (L.pages)
    const DK = '2A1A0C', BR = '5A3510', duo = ['2A1A0C', 'FFD48A'];
    const foot = (s, x = 0.7, w = 8.6, c = C.muted) => k.foot(s, { x, w, y: 5.3, size: 7.5, color: c });
    const open = async (d, x = 0.7, y = 0.4, w = 7.5, h = 0.9, o = {}) => { const s = await slide('page'); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 14, color: C.ink, valign: 'bottom', ...o }); num(s); foot(s); return s; };
    const honey = async (d, x = 0.7, y = 0.35, w = 7.5, h = 0.95, o = {}) => { const s = await slide('honey'); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 14, color: DK, valign: 'bottom', ...o }); k.txt(s, String(k.idx).padStart(2, '0'), 8.4, 0.2, 1.4, 0.75, { size: 32, bold: true, color: BR, font: F.head, align: 'right' }); foot(s, 0.7, 8.6, DK); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.25, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.accent, valign: 'top', ...o });
    const big = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 60, min: 18, color: C.accent, ...o });
    const gold = (s, x, y, w, h = 0, c = C.accent, wd = 0.75) => t.line(s, x, y, w, h, c, wd);
    const ic = async (s, it, x, y, z, c = C.accent) => t.img(s, await L.icon(it.icon, c, 1.5), x, y, z, z);
    const V = {
      image: [
        async (d) => { // the picture polished into an oval stone, a fine line of light around it
          const s = await open(d, 5.1, 0.4, 3.2, 1.25, { max: 22 });
          t.oval(s, 0.42, 0.42, 4.36, 4.76, null, { line: { color: C.accent, width: 0.75 }, name: 'Rim' });
          await k.photo(s, d.image, 0.55, 0.55, 4.1, 4.5, { mask: 'circle' });
          p(s, d.text, 5.1, 1.78, 4.2, 3.35, { max: 13 });
        },
        async (d) => { // the picture in a falling drop at the right, the words beside it
          const s = await open(d, 0.7, 0.4, 5.0, 1.15, { max: 24 });
          t.img(s, await L.photo(L.src(d.image), 3.5, 4.75, { mask: { path: 'M0.5,0 C0.56,0.2 1,0.42 1,0.68 C1,0.86 0.78,1 0.5,1 C0.22,1 0,0.86 0,0.68 C0,0.42 0.44,0.2 0.5,0 Z' } }), 6.0, 0.4, 3.5, 4.75, { alt: '' });
          p(s, d.text, 0.7, 1.68, 5.0, 3.45, { max: 13.5 });
        },
        async (d) => { // the whole page sunk in amber: the picture goes gold and dark, the words rest on it
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.625, { duo });
          t.img(s, await L.scrim(DK, 0.45, 0.97), 0, 0, 10, 5.625);
          k.head(s, d.title, 0.7, 1.55, 7.8, 1.0, { max: 28, min: 15, color: 'FFFFFF', valign: 'bottom' });
          gold(s, 0.7, 2.65, 1.5);
          k.txt(s, d.text, 0.7, 2.78, 8.6, 2.4, { max: 14, min: 10, color: 'FFFFFF', ls: 1.2 });
          num(s); foot(s, 0.7, 8.6, 'F3DDB5');
        },
        async (d) => { // a layer of picture across the top, the title and words in the resin beneath
          const s = await open({});
          await k.photo(s, d.image, 0, 0, 10, 2.5, { duo });
          gold(s, 0, 2.5, 10, 0, C.accent, 1.5);
          k.head(s, d.title, 0.7, 2.68, 3.1, 2.45, { max: 22, min: 14, color: C.ink, valign: 'top' });
          p(s, d.text, 4.05, 2.68, 5.25, 2.48, { max: 13, ls: 1.18 });
        },
      ],
      cards: [
        async (d) => { // each item hangs on a thread from the top of the page, to its own depth
          const s = await slide('page'), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n, dep = n === 3 ? [1.75, 1.45, 1.75] : [1.75, 1.45, 1.75, 1.45];
          k.head(s, d.title, 0.7, 0.3, 7.5, 0.88, { max: 26, min: 14, color: C.ink, valign: 'top' }); num(s); foot(s);
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = dep[i];
            gold(s, x + 0.19, 1.25, 0, y - 1.25 + 0.02);
            await ic(s, it, x, y + 0.03, 0.38);
            h3(s, it.h, x, y + 0.48, w, 0.5, { max: 13.5 });
            p(s, it.t, x, y + 1.0, w, 5.13 - y - 1.0, { max: 12.5, min: 10, ls: 1.12 });
          }
        },
        async (d) => { // one page of honey: dark words on gold, the items in a square
          const s = await honey(d), n = d.items.length, w = 4.05, hh = 1.82;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = 0.7 + (i % 2) * (w + 0.5), y = 1.42 + Math.floor(i / 2) * hh, ww = wide ? 8.6 : w;
            await ic(s, it, x, y, 0.4, DK);
            h3(s, it.h, x + 0.52, y, ww - 0.52, 0.4, { color: DK, valign: 'middle' });
            p(s, it.t, x, y + 0.48, ww, hh - 0.56, { color: DK, max: 12.5, min: 10, ls: 1.1 });
          }
        },
        async (d) => { // the title alone in the shadow, the items running down the lit side
          const s = await open(d, 0.7, 0.7, 3.0, 3.2, { max: 30, valign: 'top' }), n = d.items.length, hh = 3.95 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.15 + i * hh;
            await ic(s, it, 4.05, y + 0.04, 0.42);
            h3(s, it.h, 4.65, y + 0.02, 4.65, 0.3);
            p(s, it.t, 4.65, y + 0.33, 4.65, hh - 0.42, { max: 12.5, min: 10, ls: 1.1 });
            if (i < n - 1) gold(s, 4.05, y + hh - 0.05, 5.25, 0, C.muted, 0.5);
          }
        },
        async (d) => { // the first item opens large, as an essay would; the others follow in a row below it
          const s = await open(d, 0.7, 0.3, 7.5, 0.85), [a, ...rest] = d.items, gap = 0.3, w = (8.6 - gap * (rest.length - 1)) / rest.length;
          k.head(s, a.h, 0.7, 1.25, 2.85, 1.15, { max: 22, min: 13, italic: true, color: C.accent, valign: 'top' });
          p(s, a.t, 3.75, 1.27, 5.55, 1.13, { max: 15, min: 11, ls: 1.2 });
          gold(s, 0.7, 2.52, 8.6);
          for (const [i, it] of rest.entries()) {
            const x = 0.7 + i * (w + gap);
            await ic(s, it, x, 2.68, 0.3);
            h3(s, it.h, x + 0.38, 2.66, w - 0.38, 0.36, { max: 12.5, valign: 'middle' });
            p(s, it.t, x, 3.1, w, 2.03, { max: 12.5, min: 10, ls: 1.1 });
          }
        },
      ],
      process: [
        async (d) => { // a drop falls down the middle: the steps left and right of its path, a bead at each
          const s = await open(d), n = d.steps.length, bh = n === 4 ? 1.3 : 1.5, dy = (3.75 - bh) / (n - 1), cx = 5, w = 3.95;
          gold(s, cx, 1.38, 0, 3.72);
          d.steps.forEach((st, i) => {
            const y = 1.38 + i * dy, r = i % 2 === 1, x = r ? cx + 0.3 : cx - 0.3 - w, al = r ? 'left' : 'right';
            t.oval(s, cx - 0.07, y + 0.06, 0.14, 0.14, C.accent);
            h3(s, st.h, x, y + 0.02, w, 0.3, { align: al, max: 13.5 });
            p(s, st.t, x, y + 0.33, w, bh - 0.35, { max: 12, min: 10, ls: 1.08, align: al });
          });
        },
        async (d) => { // the light grows toward the upper right: the steps climb to it, each on a fine gold tread
          const s = await open(d, 0.7, 0.3, 5.2, 1.0, { valign: 'top' }), n = d.steps.length, gap = 0.2, w = (8.6 - gap * (n - 1)) / n, dy = n === 4 ? 0.48 : 0.62;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap), y = 1.45 + (n - 1 - i) * dy;
            gold(s, x, y, w);
            big(s, String(i + 1), x, y + 0.05, 0.55, 0.55, { max: 30, italic: true, bold: false, valign: 'top' });
            h3(s, st.h, x + 0.5, y + 0.08, w - 0.5, 0.5, { max: 12.5 });
            p(s, st.t, x, y + 0.65, w, Math.min(5.13 - y - 0.65, 1.95), { max: 12, min: 10, ls: 1.06 });
          });
        },
        async (d) => { // the honey page: large dark numerals, the words under each
          const s = await honey(d), n = d.steps.length, gap = 0.35, w = (8.6 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, String(i + 1), x, 1.38, w, 1.0, { max: 66, min: 30, color: BR, italic: true, bold: false, valign: 'top' });
            h3(s, st.h, x, 2.4, w, 0.52, { color: DK, max: 13.5 });
            p(s, st.t, x, 2.94, w, 2.2, { color: DK, max: 12.5, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // the title rests in the glow at the upper right; the steps sink into the dark at the left
          const s = await slide('page'), n = d.steps.length, hh = 4.6 / n;
          k.head(s, d.title, 6.45, 1.0, 2.95, 3.2, { max: 28, min: 14, color: C.ink, align: 'right', valign: 'top' }); num(s); foot(s);
          gold(s, 6.2, 0.5, 0, 4.6);
          d.steps.forEach((st, i) => {
            const y = 0.48 + i * hh;
            big(s, String(i + 1), 0.7, y, 0.7, Math.min(0.85, hh - 0.08), { max: 40, italic: true, bold: false, valign: 'top' });
            h3(s, st.h, 1.4, y + 0.03, 4.55, 0.3);
            p(s, st.t, 1.4, y + 0.34, 4.55, hh - 0.42, { max: 12.5, min: 10, ls: 1.08 });
          });
        },
      ],
      stats: [
        async (d) => { // one figure glows at full size; the two others are set in the dark beneath it
          const s = await open(d), [a, ...rest] = d.stats;
          big(s, a.value, 0.7, 1.35, 8.6, 1.75, { max: 96, min: 36, italic: true, align: 'right', valign: 'middle' });
          p(s, a.label, 0.7, 3.2, 3.0, 0.8, { max: 13.5, min: 10.5, ls: 1.1 });
          if (d.note) p(s, d.note, 0.7, 4.02, 3.0, 1.1, { max: 10, min: 9.5, color: C.muted, ls: 1.03 });
          rest.forEach((v, i) => {
            const x = 3.95 + i * 2.75;
            gold(s, x, 3.22, 2.55);
            k.head(s, v.value, x, 3.28, 2.55, 0.65, { max: 28, min: 14, color: C.ink, valign: 'top' });
            p(s, v.label, x, 3.95, 2.55, 1.15, { max: 12.5, min: 10, ls: 1.08 });
          });
        },
        async (d) => { // the honey page: three bands of figure and word, dark on gold
          const s = await honey(d), rh = d.note ? 0.84 : 1.15;
          d.stats.forEach((v, i) => {
            const y = 1.4 + i * rh;
            k.head(s, v.value, 0.7, y, 3.4, rh - 0.08, { max: 42, min: 16, italic: true, color: DK, valign: 'middle' });
            p(s, v.label, 4.3, y, 5.0, rh - 0.08, { color: DK, max: 14, min: 10, valign: 'middle', ls: 1.08 });
            if (i < 2) gold(s, 0.7, y + rh - 0.04, 8.6, 0, BR, 0.5);
          });
          if (d.note) p(s, d.note, 0.7, 1.4 + 3 * rh + 0.05, 8.6, 5.15 - (1.4 + 3 * rh + 0.05), { color: DK, max: 10.5, min: 9.5, ls: 1.03 });
        },
        async (d) => { // three columns under a shared gold line, the note running on along the foot
          const s = await open(d), w = 2.7, gap = 0.25;
          gold(s, 0.7, 1.55, 8.6);
          d.stats.forEach((v, i) => {
            const x = 0.7 + i * (w + gap);
            big(s, v.value, x, 1.65, w, 1.05, { max: 44, min: 16, valign: 'top' });
            p(s, v.label, x, 2.72, w, 1.15, { max: 13.5, min: 10.5, ls: 1.12 });
          });
          if (d.note) p(s, d.note, 0.7, 4.0, 8.6, 1.12, { max: 11.5, min: 9.5, color: C.muted, ls: 1.08 });
        },
      ],
      compare: [
        async (d) => { // mirrored about a fine line of gold: one side in the shadow, one in the light
          const s = await open(d), w = 3.55, cx = 5, { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.16, 2.9);
          k.head(s, d.left.h, cx - 0.3 - w, 1.42, w, 0.58, { max: 18, min: 12, italic: true, color: C.muted, align: 'right', valign: 'top' });
          k.head(s, d.right.h, cx + 0.3, 1.42, w, 0.58, { max: 18, min: 12, italic: true, color: C.accent, valign: 'top' });
          gold(s, cx, 1.45, 0, 3.65);
          let y = 2.1;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], cx - 0.3 - w, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], cx + 0.3, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // two layers of resin, one on the other; the heading large in the margin of each
          const s = await open(d), hh = 1.76;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.42 + i * (hh + 0.06);
            gold(s, 0.7, y, 8.6, 0, i ? C.accent : C.muted, 0.75);
            k.head(s, side.h, 0.7, y + 0.08, 2.4, hh - 0.14, { max: 18, min: 12, italic: true, color: i ? C.accent : C.ink, valign: 'top' });
            side.items.forEach((it, j) => p(s, it, 3.25 + (j % 2) * 3.1, y + 0.1 + Math.floor(j / 2) * 0.8, 2.95, 0.76, { max: 12.5, min: 10, ls: 1.05 }));
          });
        },
      ],
      statement: [
        async (d) => { // long and italic, set in from a gold rule; the note far off in the right margin
          const s = await open(d, 0.7, 0.35, 7.5, 0.65, { max: 15, min: 11, color: C.accent });
          gold(s, 1.0, 1.2, 0, 3.85, C.accent, 1.5);
          k.head(s, L.runs(d.text), 1.3, 1.15, 5.2, 3.9, { max: 30, min: 17, italic: true, bold: false, color: C.ink, valign: 'middle' });
          if (d.caption) p(s, d.caption, 6.85, 1.2, 2.45, 3.85, { max: 11.5, min: 10, color: C.muted, ls: 1.1, valign: 'bottom' });
        },
        async (d) => { // the honey page: only the sentence low on the page, dark on gold, the note small above it
          const s = await honey(d, 0.7, 0.3, 7.5, 0.65, { max: 15, min: 11, color: BR });
          if (d.caption) p(s, d.caption, 0.7, 1.0, 6.4, 1.1, { max: 11.5, min: 10, color: DK, ls: 1.06 });
          k.head(s, L.runs(d.text), 0.7, 2.15, 8.6, 3.0, { max: 38, min: 18, color: DK, valign: 'bottom' });
        },
      ],
      timeline: [
        async (d) => { // a line of light across the page, years hung on it, events above and below by turn
          const s = await open(d), ly = 3.28, w = 3.3, xs = [0.7, 2.6, 4.5, 6.0];
          gold(s, 0, ly, 10);
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.42 : ly + 0.12;
            t.oval(s, x, ly - 0.06, 0.12, 0.12, C.accent);
            k.head(s, it.year, x, y, w, 0.34, { max: 17, min: 12, italic: true, color: C.accent, valign: 'top' });
            k.head(s, it.h, x, y + 0.33, w, 0.26, { max: 12.5, min: 10.5, color: C.ink, valign: 'top' });
            p(s, it.t, x, y + 0.6, w, ly - 1.42 - 0.68, { max: 11.5, min: 10, ls: 1.03 });
          });
        },
        async (d) => { // strata: the years lie in layers, each laid further out than the one above it
          const s = await open(d), hh = 3.72 / 4;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * 0.75, y = 1.4 + i * hh;
            gold(s, x, y, 9.3 - x, 0, C.accent, 0.5);
            k.head(s, it.year, x, y + 0.06, 1.8, 0.4, { max: 18, min: 11, italic: true, color: C.accent, valign: 'top' });
            k.head(s, it.h, x + 1.9, y + 0.07, 9.3 - x - 1.9, 0.27, { max: 12.5, min: 10.5, color: C.ink, valign: 'top' });
            p(s, it.t, x + 1.9, y + 0.33, 9.3 - x - 1.9, hh - 0.36, { max: 11, min: 10, ls: 1.0 });
          });
        },
        async (d) => { // the honey page: four columns of years, the figures dark and italic at the head
          const s = await honey(d), w = 2.05, gap = 0.13;
          d.items.forEach((it, i) => {
            const x = 0.7 + i * (w + gap);
            k.head(s, it.year, x, 1.4, w, 0.72, { max: 26, min: 12, italic: true, color: BR, valign: 'bottom' });
            gold(s, x, 2.18, w, 0, BR, 0.75);
            k.head(s, it.h, x, 2.25, w, 0.48, { max: 13, min: 10.5, color: DK, valign: 'top' });
            p(s, it.t, x, 2.75, w, 2.38, { color: DK, max: 12, min: 10, ls: 1.06 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); R.stats = V.stats.shift(); // nor the first steps, years and figures the rows of the cards
    return V;
  },
  tone: "iliq va boy: chuqur mazmun, mulohazali bayon" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["fade", "dissolve", "p14:reveal|thruBlk=\"0\""], "cover": ["focusIn", "fadeLetters"], "mark": "focusIn", "deco": "focusIn", "sig": {"title": "focusIn", "body": "fadeWords", "item": "focusIn", "image": "focusIn", "number": "focusIn", "order": "centerOut", "stagger": 0.24}, "tempo": 1.35, "kenburns": true};
