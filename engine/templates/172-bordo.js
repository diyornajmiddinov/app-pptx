/** 172 Bordo — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 172, slug: 'bordo', name: "Bordo", mode: 'split', list: 'cols', num: 'big', F: { head: 'Times New Roman', body: 'Georgia' },
  C: { ink: 'F7E9E4', muted: 'D7B3AC', accent: 'F0C27B' }, photo: { r: 0.0 }, rule: false, caps: true, bold: false,
  bg: (kind) => compose(flat('5A1621'), rad(0,0,1300,[[0,'7A2331',0.8],[1,'5A1621',0]]), grain(0.06)),
  // a night at the opera: a playbill in wine and gold, roman acts, spaced capitals, a curtain, a proscenium, tickets
  ways: ({ k, t, L, C, F, TI, slide, page, num, hair }, R) => {
    const ROM = ['I', 'II', 'III', 'IV'];
    const pg = (s, x = 8.3, y = 0.12, a = 'right', size = 22) => k.txt(s, String(k.idx).padStart(2, '0'), x, y, 1.1, 0.42, { size, bold: true, color: C.accent, font: F.head, align: a, ls: 1 });
    const cap = (s, v, x, y, w, h, o = {}) => k.head(s, v.toUpperCase(), x, y, w, h, { max: 20, min: 11, color: TI, bold: false, spacing: 2, valign: 'top', ...o });
    const open = async (d, x, y, w, h, o = {}, n = [], f = [0.6, 8.8], kind = 'page') => { const s = await slide(kind); if (d.title) cap(s, d.title, x, y, w, h, o); pg(s, ...n); k.foot(s, { x: f[0], w: f[1], y: 5.3, size: 7.5, color: C.muted, align: f[2] || 'left' }); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.22, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v.toUpperCase(), x, y, w, h, { max: 12.5, min: 9.5, color: C.accent, bold: false, spacing: 1.2, valign: 'top', ...o });
    const rom = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 44, min: 16, color: C.accent, bold: false, valign: 'top', ...o });
    const gold = (s, x, y, w, h = 0, wt = 0.75) => t.line(s, x, y, w, h, C.accent, wt);
    const V = {
      image: [
        async (d) => { // the curtain: a tall picture falls the full height of the right side
          const s = await open(d, 0.6, 0.55, 4.5, 1.35, { valign: 'bottom' }, [0.6, 4.55, 'left', 26], [0.6, 4.6]);
          await k.photo(s, d.image, 5.55, 0, 4.45, 5.625);
          gold(s, 0.6, 2.0, 1.1);
          p(s, d.text, 0.6, 2.12, 4.55, 2.42, { max: 13 });
        },
        async (d) => { // the proscenium: a wide picture between two gold lines, the bill under it
          const s = await open(d, 0.6, 3.3, 3.05, 1.8, { max: 15 }, [8.3, 0.04], [0.6, 8.8]);
          gold(s, 0.6, 0.5, 8.8);
          await k.photo(s, d.image, 0.6, 0.58, 8.8, 2.5);
          gold(s, 0.6, 3.16, 8.8);
          p(s, d.text, 3.9, 3.3, 5.5, 1.85, { max: 13 });
        },
        async (d) => { // a diptych of one picture, the two leaves a little apart
          const s = await open(d, 0.6, 0.55, 3.25, 1.5, { max: 15 }, [8.3, 0.08], [0.6, 8.8]);
          await k.photo(s, d.image, 4.15, 0.55, 5.25, 4.55, { mask: { path: 'M0,0 H0.485 V1 H0 Z M0.515,0 H1 V1 H0.515 Z' } });
          p(s, d.text, 0.6, 2.15, 3.25, 2.97, { max: 13 });
        },
        async (d) => { // the picture fills the house, the programme stands in a wine panel edged with gold
          const s = await slide('page');
          await k.photo(s, d.image, 0, 0, 10, 5.2);
          t.rect(s, 4.9, 0.35, 4.7, 4.5, '5A1621', { line: { color: C.accent, width: 0.75 }, name: 'Programme' });
          cap(s, d.title, 5.15, 0.5, 3.4, 1.1, { max: 18, min: 11 });
          pg(s, 8.25, 0.45, 'right', 18);
          p(s, d.text, 5.15, 1.68, 4.2, 3.08, { max: 13 });
          k.foot(s, { x: 0.6, w: 8.8, y: 5.3, size: 7.5, color: C.muted });
        },
      ],
      cards: [
        async (d) => { // the bill's columns: roman numeral, capitals, a gold upright between them
          const s = await open(d, 0.6, 0.42, 7.6, 0.85, { valign: 'middle' }), n = d.items.length, gap = 0.4, w = (8.8 - gap * (n - 1)) / n;
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap);
            if (i) gold(s, x - gap / 2, 1.5, 0, 3.6, 0.5);
            rom(s, ROM[i], x, 1.42, w, 0.72, { max: 36 });
            h3(s, it.h, x, 2.16, w, 0.48);
            p(s, it.t, x, 2.66, w, 2.46, { max: 13 });
          });
        },
        async (d) => { // the balcony tiers: each row wider than the one above, all centred
          const s = await open(d, 1.2, 0.35, 7.6, 0.8, { align: 'center', valign: 'bottom', max: 22 }, [], [0.6, 8.8, 'center']), n = d.items.length, H = 3.9 / n, w0 = n === 4 ? 5.1 : 5.2, dw = n === 4 ? 1.1 : 1.6;
          d.items.forEach((it, i) => {
            const y = 1.22 + i * H, w = w0 + i * dw, x = 5 - w / 2;
            gold(s, x + 0.4, y, w - 0.8, 0, 0.5);
            h3(s, it.h, x, y + 0.07, w, 0.26, { align: 'center' });
            p(s, it.t, x, y + 0.34, w, H - 0.38, { align: 'center', max: 12.5 });
          });
        },
        async (d) => { // the title moves to the right wing; the items face it, set flush right
          const s = await open(d, 6.75, 0.6, 2.75, 3.2, { max: 16 }, [8.3, 4.45], [0.5, 5.7, 'right']), n = d.items.length, H = 4.6 / n;
          gold(s, 6.4, 0.55, 0, 4.5, 0.75);
          for (const [i, it] of d.items.entries()) {
            const y = 0.5 + i * H;
            t.img(s, await L.icon(it.icon, C.accent, 1.25), 5.75, y + 0.02, 0.3, 0.3);
            h3(s, it.h, 0.5, y + 0.05, 5.1, 0.28, { align: 'right', valign: 'middle' });
            p(s, it.t, 0.5, y + 0.38, 5.55, H - 0.44, { align: 'right', max: 13 });
          }
        },
        async (d) => { // title on the first row; below, items staggered left and right like boxes in a theatre
          const s = await open(d, 0.6, 0.42, 7.6, 0.85, { valign: 'middle' }), n = d.items.length, w = 3.9, H = n === 4 ? 1.8 : 1.72;
          for (const [i, it] of d.items.entries()) {
            const r = i % 2, x = r ? 5.5 : 0.6, y = 1.42 + Math.floor(i / 2) * H + (r ? 0.28 : 0), hh = n === 3 && i === 1 ? 2.0 : H - 0.06;
            t.img(s, await L.icon(it.icon, C.accent, 1.25), x, y, 0.32, 0.32);
            h3(s, it.h, x + 0.42, y + 0.02, w - 0.42, 0.3, { valign: 'middle' });
            p(s, it.t, x, y + 0.38, w, Math.min(hh - 0.38, 5.12 - y - 0.38), { max: 13 });
          }
        },
      ],
      process: [
        async (d) => { // the grand staircase: each act a tread, a gold line running out to the right edge
          const s = await open(d, 5.75, 0.5, 3.65, 1.0, { max: 15, align: 'right', valign: 'top' }, [8.3, 0.05]), n = d.steps.length, H = 4.62 / n, dx = n === 4 ? 1.05 : 1.5, w = 4.75 - 0.15;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * dx, y = 0.5 + i * H;
            rom(s, ROM[i], x, y, 0.62, 0.42, { max: 20, min: 12, valign: 'middle' });
            h3(s, st.h, x + 0.64, y + 0.05, w - 0.64, 0.32, { valign: 'middle' });
            p(s, st.t, x + 0.64, y + 0.38, w - 0.64 + (i ? 0.2 : 0), H - 0.46, { max: 12, ls: 1.14 });
            gold(s, x, y + H - 0.05, 10 - x, 0, 0.5);
          });
        },
        async (d) => { // a gold spine up the middle of the page, acts to either side, numerals on it
          const s = await open(d, 1.2, 0.3, 7.6, 0.72, { align: 'center', max: 20, valign: 'bottom' }, [], [0.6, 8.8, 'center']), n = d.steps.length, H = 4.05 / n, w = 3.95, cx = 5;
          gold(s, cx, 1.12, 0, 4.02);
          d.steps.forEach((st, i) => {
            const y = 1.12 + i * H, l = i % 2 === 0, x = l ? cx - 0.45 - w : cx + 0.45, a = l ? 'right' : 'left';
            t.oval(s, cx - 0.23, y + 0.02, 0.46, 0.46, '5A1621', { line: { color: C.accent, width: 0.75 } });
            k.txt(s, ROM[i], cx - 0.23, y + 0.02, 0.46, 0.46, { size: 11, color: C.accent, align: 'center', valign: 'middle', font: F.head, ls: 1 });
            h3(s, st.h, x, y + 0.03, w, 0.3, { align: a, valign: 'middle' });
            p(s, st.t, x, y + 0.36, w, Math.min(1.3, 5.14 - y - 0.36), { align: a, max: 12.5 });
          });
        },
        async (d) => { // the columns stand on the title, each with its gold edge, its numeral at the foot
          const s = await open(d, 0.6, 4.35, 7.6, 0.8, { max: 22, valign: 'middle' }, [8.3, 4.5]), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
          gold(s, 0.6, 4.25, 8.8, 0, 0.75);
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap);
            gold(s, x, 0.45, 0, 3.7, 0.5);
            h3(s, st.h, x + 0.14, 0.45, w - 0.14, 0.5);
            p(s, st.t, x + 0.14, 0.97, w - 0.14, 2.45, { max: 13 });
            rom(s, ROM[i], x + 0.14, 3.42, w - 0.14, 0.72, { max: 36, valign: 'bottom' });
          });
        },
        async (d) => { // the title as a sash across the waist of the page, acts above and below it
          const s = await open(d, 1, 2.33, 8, 0.72, { align: 'center', valign: 'middle', max: 20 }, [8.3, 0.04]), n = d.steps.length, w = 4.1;
          gold(s, 0.6, 2.27, 8.8); gold(s, 0.6, 3.11, 8.8);
          d.steps.forEach((st, i) => {
            const row = i < 2 ? 0 : 1, whole = n === 3 && i === 2, x = whole ? 1.5 : (i % 2 ? 5.3 : 0.6), y = row ? 3.2 : 0.42, ww = whole ? 7 : w;
            k.txt(s, [{ text: `${ROM[i]}   `, options: { color: C.accent } }, { text: st.h.toUpperCase(), options: { color: C.accent } }], x, y, ww, 0.3, { max: 12.5, min: 9.5, font: F.head, spacing: 1.2, align: whole ? 'center' : 'left', valign: 'middle' });
            p(s, st.t, x, y + 0.34, ww, 1.46, { max: 13, align: whole ? 'center' : 'left' });
          });
        },
      ],
      stats: [
        async (d) => { // three figures in a row under the title, gold uprights between them, the note below
          const s = await open(d, 0.6, 0.42, 7.6, 0.85, { valign: 'middle' }), w = 2.7, gap = 0.35;
          d.stats.forEach((x, i) => {
            const xx = 0.6 + i * (w + gap);
            if (i) gold(s, xx - gap / 2, 1.55, 0, 2.05, 0.5);
            k.head(s, x.value, xx, 1.45, w, 1.1, { max: 46, min: 20, color: C.accent, bold: false });
            p(s, x.label, xx, 2.6, w, 1.0, { max: 13.5 });
          });
          if (d.note) { gold(s, 0.6, 3.75, 8.8, 0, 0.5); p(s, d.note, 0.6, 3.86, 8.8, 1.28, { max: 12.5, color: C.muted }); }
        },
        async (d) => { // the star of the evening fills the right, the two others under her
          const s = await page(d), [a, ...rest] = d.stats;
          k.head(s, a.value, 4.15, 0.35, 5.25, 1.55, { max: 86, min: 28, color: C.accent, bold: false });
          p(s, a.label, 4.15, 1.92, 5.25, 0.5, { max: 14 });
          gold(s, 4.15, 2.48, 5.25, 0, 0.5);
          rest.forEach((x, i) => {
            const xx = 4.15 + i * 2.75;
            k.head(s, x.value, xx, 2.55, 2.5, 0.72, { max: 32, min: 16, color: C.ink, bold: false });
            p(s, x.label, xx, 3.28, 2.5, 0.6, { max: 12 });
          });
          if (d.note) p(s, d.note, 4.15, 3.95, 5.25, 1.2, { max: 11.5, color: C.muted });
        },
        async (d) => { // the takings: rows of figures flush right to a gold edge, the title on the far wing
          const s = await open(d, 6.75, 0.6, 2.75, 2.05, { max: 14 }, [8.3, 4.5], [0.5, 5.7, 'right']), H = 1.5;
          gold(s, 6.4, 0.55, 0, 4.55, 0.75);
          d.stats.forEach((x, i) => {
            const y = 0.52 + i * H;
            k.head(s, x.value, 0.5, y, 5.65, 0.82, { max: 44, min: 20, color: C.accent, bold: false, align: 'right' });
            p(s, x.label, 0.5, y + 0.84, 5.65, 0.56, { max: 13, align: 'right' });
          });
          if (d.note) p(s, d.note, 6.75, 2.72, 2.75, 1.75, { max: 10.5, color: C.muted, ls: 1.12 });
        },
      ],
      compare: [
        async (d) => { // two rival houses mirrored about a gold line, title above
          const s = await open(d, 1.0, 0.3, 7.2, 0.75, { valign: 'middle', align: 'center', max: 20 }, [], [0.6, 8.8, 'center']), w = 4.05;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.16, 3.05);
          h3(s, d.left.h, 0.6, 1.12, w, 0.72, { max: 18, min: 11, align: 'right', valign: 'middle', color: C.ink }); h3(s, d.right.h, 5.35, 1.12, w, 0.72, { max: 18, min: 11, valign: 'middle' });
          gold(s, 5, 1.15, 0, 3.95);
          let y = 1.98;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.6, y, w, rh, { size: fs, color: C.ink, align: 'right' });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.35, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // first house above, second below, each name in a wing at the left
          const s = await open(d, 0.6, 0.35, 7.6, 0.8, { valign: 'middle', max: 22 }), H = 1.95;
          [d.left, d.right].forEach((sd, i) => {
            const y = 1.2 + i * H;
            gold(s, 0.6, y, 8.8, 0, 0.5);
            k.head(s, sd.h.toUpperCase(), 0.6, y + 0.12, 2.5, H - 0.25, { max: 16, min: 10, color: i ? C.accent : C.ink, bold: false, spacing: 1, valign: 'top' });
            const hh = (H - 0.2) / Math.ceil(sd.items.length / 2);
            sd.items.forEach((it, j) => p(s, it, 3.35 + (j % 2) * 3.1, y + 0.12 + Math.floor(j / 2) * hh, 2.95, hh - 0.04, { max: 13.5 }));
          });
        },
      ],
      statement: [
        async (d) => { // an aria: the sentence large and centred between two gold lines
          const s = await open(d, 1.2, 0.4, 7.6, 0.5, { max: 13, min: 10, align: 'center', valign: 'middle', color: C.accent }, [], [0.6, 8.8, 'center'], 'focus');
          gold(s, 2.5, 1.0, 5); gold(s, 2.5, 3.72, 5);
          k.head(s, L.runs(d.text), 0.8, 1.08, 8.4, 2.56, { max: 36, min: 18, color: C.ink, bold: false, align: 'center' });
          if (d.caption) p(s, d.caption, 1.3, 3.82, 7.4, 1.34, { align: 'center', max: 13, color: C.muted });
        },
        async (d) => { // the sentence takes the stage on the left, title and note wait in the right wing
          const s = await open(d, 6.95, 0.55, 2.55, 1.4, { max: 13, min: 10 }, [8.3, 4.6], [0.6, 6.0], 'focus');
          gold(s, 6.65, 0.55, 0, 4.55, 0.75);
          k.head(s, L.runs(d.text), 0.6, 0.45, 5.75, 4.65, { max: 38, min: 18, color: C.ink, bold: false });
          if (d.caption) p(s, d.caption, 6.95, 1.98, 2.55, 2.6, { max: 12, color: C.muted, ls: 1.12 });
        },
      ],
      timeline: [
        async (d) => { // the season: large years stacked at the left, the events ruled off beside them
          const s = await open(d, 0.6, 0.3, 7.6, 0.72, { valign: 'middle', max: 20 }), H = 1.02;
          d.items.forEach((it, i) => {
            const y = 1.08 + i * H;
            gold(s, 0.6, y, 8.8, 0, 0.5);
            k.head(s, it.year, 0.6, y + 0.05, 2.5, H - 0.1, { max: 28, min: 13, color: C.accent, bold: false });
            h3(s, it.h, 3.3, y + 0.08, 6.1, 0.26, { valign: 'middle' });
            p(s, it.t, 3.3, y + 0.36, 6.1, H - 0.4, { max: 12, ls: 1.12 });
          });
        },
        async (d) => { // posters on a wall: each year set sideways up the edge of its column
          const s = await open(d, 0.6, 0.42, 7.6, 0.85, { valign: 'middle' }), gap = 0.22, w = (8.8 - gap * 3) / 4, top = 1.45, H = 3.68;
          d.items.forEach((it, i) => {
            const x = 0.6 + i * (w + gap), rw = H, rh = 0.42, cx = x + rh / 2, cy = top + H / 2;
            k.txt(s, it.year, cx - rw / 2, cy - rh / 2, rw, rh, { size: 22, color: C.accent, font: F.head, rotate: 270, align: 'right', valign: 'middle', ls: 1, spacing: 2 });
            h3(s, it.h, x + 0.48, top, w - 0.48, 0.48, { max: 11.5 });
            p(s, it.t, x + 0.48, top + 0.5, w - 0.48, H - 0.5, { max: 12, ls: 1.12 });
          });
        },
        async (d) => { // four tickets in the right wing, thin gold edges, the year on the stub
          const s = await page(d), w = 2.55, H = 2.2, gap = 0.15;
          d.items.forEach((it, i) => {
            const x = 4.15 + (i % 2) * (w + gap), y = 0.55 + Math.floor(i / 2) * (H + gap);
            t.rect(s, x, y, w, H, null, { line: { color: C.accent, width: 0.5 }, name: 'Ticket' });
            k.head(s, it.year, x + 0.12, y + 0.07, w - 0.24, 0.42, { max: 20, min: 11, color: C.accent, bold: false, align: 'center' });
            h3(s, it.h, x + 0.12, y + 0.5, w - 0.24, 0.26, { align: 'center', valign: 'middle', max: 10.5 });
            p(s, it.t, x + 0.12, y + 0.78, w - 0.24, H - 0.84, { max: 11.5, align: 'center', ls: 1.12 });
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
  tone: "salobatli va ko'rkam: tanlangan so'zlar, nafis bayon" });
