/**
 * 110 Mondrian — the slide IS a Mondrian composition: thick black grid lines dividing the page into white
 * and primary-coloured rectangles; title, items and photos are placed into the cells. Each slide type has its own grid.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { black: '111111', white: 'FAFAF7', red: 'D7261E', blue: '1D4E9E', yellow: 'F5C518', ink: '111111', muted: '444444' };
const F = { head: 'Arial', body: 'Calibri' };
const G = 0.1; // grid line width
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const cell = (s, x, y, w, h, fill = C.white) => { t.rect(s, x + G / 2, y + G / 2, w - G, h - G, fill, { name: 'Cell' }); return { x: x + G / 2 + 0.15, y: y + G / 2 + 0.12, w: w - G - 0.3, h: h - G - 0.24 }; };
  // shared frame: title cell, red accent cell, number cell, footer strip; returns content box
  const page = (d) => { const s = k.slide(C.black);
    const tc = cell(s, 0, 0, 6.6, 1.25); k.head(s, d.title || '', tc.x, tc.y, tc.w, tc.h, { max: 28, min: 14 });
    cell(s, 6.6, 0, 1.3, 1.25, C.red); const nc = cell(s, 7.9, 0, 2.1, 1.25); k.txt(s, String(k.idx), nc.x, nc.y, nc.w, nc.h, { size: 34, bold: true, font: F.head, align: 'right', valign: 'middle' });
    const fc = cell(s, 0, 5.2, 10, 0.425); k.foot(s, { x: fc.x, y: 5.27, w: 9.5, size: 8 }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.black); const tc = cell(s, 0, 0, 6.0, 3.4); cell(s, 6.0, 0, 4.0, 0.9, C.yellow);
      if (d.image) { t.img(s, await k.L.photo(k.L.src(d.image), 3.9, 3.4), 6.05, 0.95, 3.9, 3.4, { alt: '' }); } else cell(s, 6.0, 0.9, 4.0, 3.5, C.blue);
      k.txt(s, k.org3, tc.x, tc.y, tc.w, 0.35, { size: 12, bold: true, color: C.red }); k.head(s, d.title, tc.x, tc.y + 0.4, tc.w, tc.h - 0.4, { max: 40, min: 18, valign: 'top' });
      const sc = cell(s, 0, 3.4, 2.2, 1.8, C.red); const ac = cell(s, 2.2, 3.4, 3.8, 1.8); k.txt(s, [d.subtitle, k.M.author].filter(Boolean).join('\n\n'), ac.x, ac.y, ac.w, ac.h, { max: 13, valign: 'middle' });
      cell(s, 6.0, 4.4, 2.6, 0.8); cell(s, 8.6, 4.4, 1.4, 0.8, C.blue); const fc = cell(s, 0, 5.2, 10, 0.425); k.foot(s, { x: fc.x, y: 5.27, w: 9.5, size: 8 }); void sc; },
    async intro(d) { const s = page(d); t.img(s, await k.L.photo(k.L.src(d.image), 4.4, 3.85), 0.05, 1.3, 4.4, 3.85, { alt: '' }); const c = cell(s, 4.5, 1.25, 4.4, 3.95); cell(s, 8.9, 1.25, 1.1, 2.0, C.yellow); cell(s, 8.9, 3.25, 1.1, 1.95, C.blue); k.txt(s, d.text, c.x, c.y, c.w, c.h, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { const s = page(d); cell(s, 0, 1.25, 1.1, 3.95, C.blue); const c = cell(s, 1.1, 1.25, 4.3, 3.95); k.txt(s, d.text, c.x, c.y, c.w, c.h, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); t.img(s, await k.L.photo(k.L.src(d.image), 4.5, 3.85), 5.45, 1.3, 4.5, 3.85, { alt: '' }); },
    async agenda(d) { const s = page(d), n = d.items.length, per = Math.ceil(n / 2), h = 3.95 / per; const fills = [C.white, C.white, C.yellow, C.white, C.blue, C.white];
      d.items.forEach((it, i) => { const col = Math.floor(i / per), x = col * 5, y = 1.25 + (i % per) * h; cell(s, x, y, 1.0, h, i % 3 === 0 ? C.red : i % 3 === 1 ? C.yellow : C.blue); k.txt(s, String(i + 1), x + 0.1, y, 0.8, h, { size: 22, bold: true, font: F.head, color: i % 3 === 1 ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' }); const c = cell(s, x + 1.0, y, 4.0, h, fills[0]); k.head(s, it, c.x, c.y, c.w, c.h, { max: 18 }); }); },
    async cards(d) { const s = page(d), n = d.items.length, w = 10 / n, accents = [C.red, C.yellow, C.blue, C.red];
      d.items.forEach((it, i) => { cell(s, i * w, 1.25, w, 0.5, accents[i % 4]); const c = cell(s, i * w, 1.75, w, 3.45); k.head(s, it.h, c.x, c.y, c.w, 0.55, { max: 16 }); k.txt(s, it.t, c.x, c.y + 0.6, c.w, c.h - 0.6, { max: 13, color: C.muted }); }); },
    async process(d) { const s = page(d), n = d.steps.length, w = 10 / n;
      d.steps.forEach((st, i) => { const nc = cell(s, i * w, 1.25, w, 0.95, i === n - 1 ? C.red : i % 2 ? C.yellow : C.blue); k.txt(s, String(i + 1), nc.x, nc.y, nc.w, nc.h, { size: 30, bold: true, font: F.head, color: i % 2 && i !== n - 1 ? C.ink : 'FFFFFF', valign: 'middle' }); const c = cell(s, i * w, 2.2, w, 3.0); k.head(s, st.h, c.x, c.y, c.w, 0.55, { max: 15 }); k.txt(s, st.t, c.x, c.y + 0.6, c.w, c.h - 0.6, { max: 13, color: C.muted }); }); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 10 / n, fills = [C.red, C.white, C.blue], fg = ['FFFFFF', C.ink, 'FFFFFF'], hh = d.note ? 3.25 : 3.95;
      d.stats.forEach((v, i) => { const c = cell(s, i * w, 1.25, w, hh, fills[i % 3]); k.head(s, v.value, c.x, c.y, c.w, c.h * 0.55, { max: 60, min: 22, color: fg[i % 3] }); k.txt(s, v.label, c.x, c.y + c.h * 0.58, c.w, c.h * 0.42, { max: 14, color: fg[i % 3] }); });
      if (d.note) { const c = cell(s, 0, 4.5, 10, 0.7, C.yellow); k.txt(s, d.note, c.x, c.y, c.w, c.h, { max: 11, valign: 'middle' }); } },
    async compare(d) { const s = page(d), w = 4.6, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.6, F.body, 0.15, 3.2);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.4 : 0; const hc = cell(s, x, 1.25, w, 0.6, i ? C.blue : C.red); k.head(s, sd.h, hc.x, hc.y, hc.w, hc.h, { max: 17, color: 'FFFFFF' }); const c = cell(s, x, 1.85, w, 3.35); let y = c.y; sd.items.forEach((it, j) => { k.txt(s, it, c.x, y, c.w, rr[j], { size: fs }); y += rr[j]; }); }); cell(s, 4.6, 1.25, 0.8, 3.95, C.yellow); },
    async statement(d) { const s = page(d); const c = cell(s, 0, 1.25, 7.2, 2.9); k.head(s, L.runs(d.text), c.x, c.y, c.w, c.h, { max: 36, min: 16 }); cell(s, 7.2, 1.25, 2.8, 1.5, C.red); cell(s, 7.2, 2.75, 2.8, 1.4, C.yellow); const cc = cell(s, 0, 4.15, 10, 1.05); if (d.caption) k.txt(s, d.caption, cc.x, cc.y, cc.w, cc.h, { max: 13, color: C.muted, valign: 'middle' }); },
    async timeline(d) { const s = page(d), n = d.items.length, w = 10 / n, fills = [C.yellow, C.red, C.blue, C.yellow];
      d.items.forEach((it, i) => { const yc = cell(s, i * w, 1.25, w, 0.8, fills[i % 4]); k.head(s, it.year, yc.x, yc.y, yc.w, yc.h, { max: 24, min: 12, color: fills[i % 4] === C.yellow ? C.ink : 'FFFFFF' }); const c = cell(s, i * w, 2.05, w, 3.15); k.head(s, it.h, c.x, c.y, c.w, 0.5, { max: 15 }); k.txt(s, it.t, c.x, c.y + 0.55, c.w, c.h - 0.55, { max: 13, color: C.muted }); }); },
    async quote(d) { const s = page({}); cell(s, 0, 1.25, 1.6, 3.95, C.blue); const c = cell(s, 1.6, 1.25, 6.8, 3.95); k.head(s, `\u201C${d.text}\u201D`, c.x, c.y, c.w, c.h - 0.6, { max: 30, min: 15, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, c.x, c.y + c.h - 0.5, c.w, 0.45, { size: 14, bold: true, color: C.red }); cell(s, 8.4, 1.25, 1.6, 2.4, C.yellow); cell(s, 8.4, 3.65, 1.6, 1.55, C.red); },
    async sources(d) { const s = page(d); cell(s, 0, 1.25, 0.8, 3.95, C.red); const c = cell(s, 0.8, 1.25, 9.2, 3.95), n = d.items.length, rh = c.h / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.blue } }, { text: it }], c.x, c.y + i * rh, c.w, rh, { max: 13, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, each with a grid of its own: a deck's pages must not look alike (L.pages)
  const fg = (f) => (f === C.yellow || f === C.white ? C.ink : 'FFFFFF');
  const sub = (f) => (f === C.white ? C.muted : fg(f));
  const footCell = (s) => { const fc = cell(s, 0, 5.2, 10, 0.425); k.foot(s, { x: fc.x, y: 5.27, w: 9.5, size: 8 }); };
  const tall = (d) => { // the title takes a tall cell at the left, the right is free down to the footer
    const s = k.slide(C.black), tc = cell(s, 0, 0, 3.0, 2.7);
    k.head(s, d.title || '', tc.x, tc.y, tc.w, tc.h, { max: 26, min: 14, valign: 'top' });
    cell(s, 0, 2.7, 1.2, 1.2, C.blue); const nc = cell(s, 1.2, 2.7, 1.8, 1.2);
    k.txt(s, String(k.idx), nc.x, nc.y, nc.w, nc.h, { size: 34, bold: true, font: F.head, align: 'right', valign: 'middle' });
    cell(s, 0, 3.9, 3.0, 1.3, C.yellow); footCell(s);
    return s;
  };
  const low = (d) => { // the frame turned upside down: the title lies at the foot, the top is free
    const s = k.slide(C.black), tc = cell(s, 0, 3.9, 6.6, 1.3);
    k.head(s, d.title || '', tc.x, tc.y, tc.w, tc.h, { max: 28, min: 14 });
    cell(s, 6.6, 3.9, 1.3, 1.3, C.red); const nc = cell(s, 7.9, 3.9, 2.1, 1.3);
    k.txt(s, String(k.idx), nc.x, nc.y, nc.w, nc.h, { size: 34, bold: true, font: F.head, align: 'right', valign: 'middle' });
    footCell(s);
    return s;
  };
  const bd = (s, v, c, f = C.white, o = {}) => k.txt(s, v, c.x, c.y, c.w, c.h, { max: 13, min: 10, color: sub(f), ...o });
  const hd = (s, v, x, y, w, h, f = C.white, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, color: fg(f), ...o });
  const big = (s, v, c, f, max = 56) => k.head(s, v, c.x, c.y, c.w, c.h, { max, min: 18, color: fg(f) });
  const pic = async (s, src, x, y, w, h, o) => t.img(s, await k.L.photo(k.L.src(src), w - G, h - G, o || {}), x + G / 2, y + G / 2, w - G, h - G, { alt: '' });
  const icn = async (s, name, x, y, w, h, f) => { cell(s, x, y, w, h, f); const dd = Math.min(0.42, Math.min(w, h) - 0.2); t.img(s, await k.icon(name, fg(f), 2), x + w / 2 - dd / 2, y + h / 2 - dd / 2, dd, dd); };
  const V = {
    image: [
      async (d) => { // a broad picture cell at the right, a narrow column of words, a blue stop
        const s = page(d), c = cell(s, 0, 1.25, 3.5, 3.15);
        await pic(s, d.image, 3.5, 1.25, 6.5, 3.95);
        cell(s, 0, 4.4, 1.5, 0.8, C.yellow); cell(s, 1.5, 4.4, 2.0, 0.8, C.blue);
        k.txt(s, d.text, c.x, c.y, c.w, c.h, { max: 13, min: 10, ls: 1.18, valign: 'middle' });
      },
      async (d) => { // the picture is the whole upper storey, title and words share the floor below
        const s = k.slide(C.black);
        await pic(s, d.image, 0, 0, 10, 2.5);
        const tc = cell(s, 0, 2.5, 2.9, 1.65); k.head(s, d.title || '', tc.x, tc.y, tc.w, tc.h, { max: 22, min: 13, valign: 'top' });
        const nc = cell(s, 0, 4.15, 1.6, 1.05, C.red); k.txt(s, String(k.idx), nc.x, nc.y, nc.w, nc.h, { size: 28, bold: true, font: F.head, color: 'FFFFFF', valign: 'middle' });
        cell(s, 1.6, 4.15, 1.3, 1.05, C.yellow);
        const c = cell(s, 2.9, 2.5, 7.1, 2.7); k.txt(s, d.text, c.x, c.y, c.w, c.h, { max: 14, min: 10, ls: 1.18, valign: 'middle' });
        footCell(s);
      },
      async (d) => { // a blue field holds a round picture, its ring in yellow
        const s = page(d), dd = 3.35;
        cell(s, 0, 1.25, 4.6, 3.95, C.blue);
        t.oval(s, 2.3 - dd / 2 - 0.08, 3.225 - dd / 2 - 0.08, dd + 0.16, dd + 0.16, C.yellow);
        t.img(s, await k.L.photo(k.L.src(d.image), dd, dd, { mask: 'circle' }), 2.3 - dd / 2, 3.225 - dd / 2, dd, dd, { alt: '' });
        const c = cell(s, 4.6, 1.25, 5.4, 3.95);
        k.txt(s, d.text, c.x, c.y, c.w, c.h, { max: 15, min: 10, ls: 1.25, valign: 'middle' });
      },
      async (d) => { // the picture itself is ruled into cells, one of them painted over
        const s = page(d), w = 6.6, h = 3.95, y = 1.25;
        await pic(s, d.image, 0, y, w, h);
        t.rect(s, 2.3 - G / 2, y, G, h, C.black, { name: 'Bar' }); t.rect(s, 0, y + 2.6 - G / 2, w, G, C.black, { name: 'Bar' }); t.rect(s, 4.9 - G / 2, y, G, 2.6, C.black, { name: 'Bar' });
        cell(s, 4.9, y, 1.7, 1.2, C.red); cell(s, 0, y + 2.6, 2.3, 1.35, C.yellow);
        const c = cell(s, 6.6, y, 3.4, h);
        k.txt(s, d.text, c.x, c.y, c.w, c.h, { max: 14, min: 10, ls: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // columns with painted blocks of different height, by turns above and below the words
        const s = page(d), n = d.items.length, w = 10 / n, hh = n === 4 ? [0.55, 1.0, 0.75, 0.45] : [0.55, 1.1, 0.75], fills = [C.red, C.yellow, C.blue, C.yellow];
        for (const [i, it] of d.items.entries()) {
          const x = i * w, up = i % 2 === 0, bh = hh[i], c = cell(s, x, up ? 1.25 + bh : 1.25, w, 3.95 - bh);
          await icn(s, it.icon, x, up ? 1.25 : 5.2 - bh, w, bh, fills[i]);
          hd(s, it.h, c.x, c.y, c.w, 0.56);
          bd(s, it.t, { x: c.x, y: c.y + 0.6, w: c.w, h: c.h - 0.6 });
        }
      },
      async (d) => { // the title stands tall at the left; items in rows, each behind its painted square
        const s = tall(d), n = d.items.length, h = 5.2 / n, fills = [C.red, C.blue, C.yellow, C.red];
        for (const [i, it] of d.items.entries()) {
          const y = i * h;
          await icn(s, it.icon, 3.0, y, 0.95, h, fills[i]);
          const c = cell(s, 3.95, y, 6.05, h);
          hd(s, it.h, c.x, c.y, c.w, 0.38, C.white, { max: 15 });
          bd(s, it.t, { x: c.x, y: c.y + 0.4, w: c.w, h: c.h - 0.4 }, C.white, { ls: 1.15 });
        }
      },
      async (d) => { // bricks of unequal width, laid in two courses
        const s = page(d), n = d.items.length, h = 1.975, spans = n === 3 ? [[0, 0, 6.0], [6.0, 0, 4.0], [0, 1, 10]] : [[0, 0, 6.0], [6.0, 0, 4.0], [0, 1, 3.8], [3.8, 1, 6.2]], fills = [C.red, C.blue, C.yellow, C.red];
        for (const [i, it] of d.items.entries()) {
          const [x, r, w] = spans[i], y = 1.25 + r * h;
          await icn(s, it.icon, x, y, 0.72, h, fills[i]);
          const c = cell(s, x + 0.72, y, w - 0.72, h);
          hd(s, it.h, c.x, c.y, c.w, 0.42, C.white, { max: 15 });
          bd(s, it.t, { x: c.x, y: c.y + 0.44, w: c.w, h: c.h - 0.44 }, C.white, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // one red cell shouts the first idea, the rest are stacked beside it
        const s = page(d), [a, ...rest] = d.items, c = cell(s, 0, 1.25, 4.8, 3.95, C.red), h = 3.95 / rest.length;
        t.img(s, await k.icon(a.icon, 'FFFFFF', 1.75), c.x + 0.05, c.y + 0.05, 0.62, 0.62);
        hd(s, a.h, c.x, c.y + 0.74, c.w, 0.72, C.red, { max: 24, min: 14, valign: 'top' });
        k.txt(s, a.t, c.x, c.y + 1.5, c.w, c.h - 1.5, { max: 15, min: 10, color: 'FFFFFF' });
        for (const [i, it] of rest.entries()) {
          const y = 1.25 + i * h, q = cell(s, 4.8, y, 4.3, h);
          hd(s, it.h, q.x, q.y, q.w, 0.38, C.white, { max: 15 });
          bd(s, it.t, { x: q.x, y: q.y + 0.4, w: q.w, h: q.h - 0.4 }, C.white, { max: 12.5, ls: 1.12 });
          await icn(s, it.icon, 9.1, y, 0.9, h, i % 2 ? C.blue : C.yellow);
        }
      },
    ],
    process: [
      async (d) => { // a staircase of white cells climbs out of the painted blocks above them
        const s = page(d), n = d.steps.length, w = 10 / n, rise = n === 4 ? 0.4 : 0.8, fills = [C.blue, C.yellow, C.red];
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, bh = (n - 1 - i) * rise;
          if (bh > 0) cell(s, x, 1.25, w, bh, fills[i]);
          const c = cell(s, x, 1.25 + bh, w, 3.95 - bh);
          k.txt(s, String(i + 1), c.x, c.y, 0.7, 0.5, { size: 26, bold: true, font: F.head, color: C.red, valign: 'middle' });
          hd(s, st.h, c.x, c.y + 0.5, c.w, 0.5, C.white, { max: 14, valign: 'top' });
          bd(s, st.t, { x: c.x, y: c.y + 1.0, w: c.w, h: c.h - 1.0 }, C.white, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // a three-column table of cells: number painted, name, words
        const s = page(d), n = d.steps.length, h = 3.95 / n, fills = [C.yellow, C.blue, C.red, C.yellow];
        for (const [i, st] of d.steps.entries()) {
          const y = 1.25 + i * h, f = fills[i], nc = cell(s, 0, y, 1.0, h, f);
          k.txt(s, String(i + 1), nc.x, nc.y, nc.w, nc.h, { size: 28, bold: true, font: F.head, color: fg(f), align: 'center', valign: 'middle' });
          const hc = cell(s, 1.0, y, 2.9, h); hd(s, st.h, hc.x, hc.y, hc.w, hc.h, C.white, { max: 15 });
          bd(s, st.t, cell(s, 3.9, y, 6.1, h), C.white, { valign: 'middle', ls: 1.12 });
        }
      },
      async (d) => { // the path turns round a red column of arrows
        const s = page(d), n = d.steps.length, w = 4.5, h = 1.975, spot = n === 3 ? [[0, 0], [1, 0], [0, 1]] : [[0, 0], [1, 0], [1, 1], [0, 1]];
        for (const [i, st] of d.steps.entries()) {
          const [col, r] = spot[i], wide = n === 3 && i === 2, x = col ? 5.5 : 0, y = 1.25 + r * h, c = cell(s, x, y, wide ? 10 : w, h);
          k.txt(s, String(i + 1), c.x, c.y, 0.65, 0.5, { size: 26, bold: true, font: F.head, color: C.blue, valign: 'middle' });
          hd(s, st.h, c.x + 0.68, c.y, c.w - 0.68, 0.5, C.white, { max: 15 });
          bd(s, st.t, { x: c.x, y: c.y + 0.54, w: c.w, h: c.h - 0.54 }, C.white, { ls: 1.12 });
        }
        const a0 = cell(s, 4.5, 1.25, 1.0, h, C.red); k.txt(s, '→', a0.x, a0.y, a0.w, a0.h, { size: 28, bold: true, color: 'FFFFFF', font: 'Arial', align: 'center', valign: 'middle', ls: 1 });
        if (n === 4) { const a1 = cell(s, 4.5, 1.25 + h, 1.0, h, C.yellow); k.txt(s, '←', a1.x, a1.y, a1.w, a1.h, { size: 28, bold: true, color: C.ink, font: 'Arial', align: 'center', valign: 'middle', ls: 1 }); }
      },
      async (d) => { // the frame upside down: steps fill the sky, the title lies below
        const s = low(d), n = d.steps.length, w = 10 / n, fills = [C.blue, C.yellow, C.red, C.blue];
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, f = fills[i], nc = cell(s, x, 0, w, 0.75, f);
          k.txt(s, `${i + 1}${i < n - 1 ? '  →' : ''}`, nc.x, nc.y, nc.w, nc.h, { size: 22, bold: true, font: F.head, color: fg(f), valign: 'middle', ls: 1 });
          const c = cell(s, x, 0.75, w, 3.15);
          hd(s, st.h, c.x, c.y, c.w, 0.52, C.white, { max: 14, valign: 'top' });
          bd(s, st.t, { x: c.x, y: c.y + 0.54, w: c.w, h: c.h - 0.54 }, C.white, { max: 12.5, ls: 1.12 });
        }
      },
    ],
    stats: [
      async (d) => { // one great red cell for the first figure, two smaller in colour beside it
        const s = page(d), [a, b, e] = d.stats, h = d.note ? 2.95 : 3.95, c = cell(s, 0, 1.25, 6.1, h, C.red);
        big(s, a.value, { x: c.x, y: c.y, w: c.w, h: c.h * 0.62 }, C.red, 88);
        k.txt(s, a.label, c.x, c.y + c.h * 0.64, c.w, c.h * 0.36, { max: 15, min: 10, color: 'FFFFFF' });
        const c1 = cell(s, 6.1, 1.25, 3.9, h / 2, C.yellow), c2 = cell(s, 6.1, 1.25 + h / 2, 3.9, h / 2, C.blue);
        [[b, c1, C.yellow], [e, c2, C.blue]].forEach(([v, q, f]) => { big(s, v.value, { x: q.x, y: q.y, w: q.w, h: q.h * 0.55 }, f, 34); k.txt(s, v.label, q.x, q.y + q.h * 0.56, q.w, q.h * 0.44, { max: 12, min: 10, color: fg(f) }); });
        if (d.note) bd(s, d.note, cell(s, 0, 4.2, 10, 1.0), C.white, { valign: 'middle', max: 13 });
      },
      async (d) => { // the title stands tall; each figure is a painted cell with its name beside it
        const s = tall(d), rows = d.note ? 1.3 : 1.733, fills = [C.blue, C.red, C.yellow];
        for (const [i, v] of d.stats.entries()) {
          const y = i * rows, f = fills[i];
          big(s, v.value, cell(s, 3.0, y, 3.2, rows, f), f, 40);
          bd(s, v.label, cell(s, 6.2, y, 3.8, rows), C.white, { valign: 'middle', max: 14 });
        }
        if (d.note) bd(s, d.note, cell(s, 3.0, 3.9, 7.0, 1.3), C.white, { valign: 'middle', max: 13 });
      },
      async (d) => { // three painted cells of unequal size, the note fitted into the gap they leave
        const s = page(d), f = [C.yellow, C.blue, C.red], g = [[0, 1.25, 3.9, 2.15], [3.9, 1.25, 3.0, 2.15], [6.9, 1.25, 3.1, 3.95]];
        for (const [i, v] of d.stats.entries()) {
          const [x, y, w, h] = g[i], c = cell(s, x, y, w, h, f[i]);
          big(s, v.value, { x: c.x, y: c.y + (i === 2 ? 0.7 : 0), w: c.w, h: i === 2 ? 1.25 : c.h * 0.55 }, f[i], i === 2 ? 44 : 38);
          k.txt(s, v.label, c.x, i === 2 ? c.y + 2.05 : c.y + c.h * 0.57, c.w, i === 2 ? 1.2 : c.h * 0.43, { max: 13, min: 10, color: fg(f[i]) });
        }
        const q = cell(s, 0, 3.4, 6.9, 1.8);
        if (d.note) bd(s, d.note, q, C.white, { valign: 'middle', max: 13.5 });
      },
    ],
    compare: [
      async (d) => { // two courses: a painted name, then each point in a cell of its own
        const s = page(d), h = 1.975;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.25 + i * h, f = i ? C.blue : C.red, n = sd.items.length, x0 = 2.4, w = (10 - x0) / n, hc = cell(s, 0, y, x0, h, f);
          hd(s, sd.h, hc.x, hc.y, hc.w, hc.h, f, { max: 20, min: 12 });
          sd.items.forEach((it, j) => bd(s, it, cell(s, x0 + j * w, y, w, h), C.white, { valign: 'middle', max: 12.5, ls: 1.12 }));
        }
      },
      async (d) => { // the frame upside down: mirrored rows, a painted stone between each pair
        const s = low(d), m = Math.max(d.left.items.length, d.right.items.length), hh = 0.62, rh = (3.9 - hh) / m, fills = [C.yellow, C.red, C.blue, C.yellow], w = 4.55;
        [[d.left, 0, C.red, 'right'], [d.right, 5.45, C.blue, 'left']].forEach(([sd, x, f, a]) => { const q = cell(s, x, 0, w, hh, f); hd(s, sd.h, q.x, q.y, q.w, q.h, f, { max: 17, min: 12, align: a }); });
        cell(s, 4.55, 0, 0.9, hh, C.white);
        for (let j = 0; j < m; j++) {
          const y = hh + j * rh, l = cell(s, 0, y, w, rh), r = cell(s, 5.45, y, w, rh);
          cell(s, 4.55, y, 0.9, rh, fills[j]);
          if (d.left.items[j]) bd(s, d.left.items[j], l, C.white, { align: 'right', valign: 'middle', ls: 1.12 });
          if (d.right.items[j]) bd(s, d.right.items[j], r, C.white, { valign: 'middle', ls: 1.12 });
        }
      },
    ],
    statement: [
      async (d) => { // a broad blue cell for the words, small painted cells stacked at its side
        const s = page(d);
        cell(s, 0, 1.25, 2.1, 1.35, C.yellow); cell(s, 0, 2.6, 1.05, 1.3, C.white); cell(s, 1.05, 2.6, 1.05, 1.3, C.red); cell(s, 0, 3.9, 2.1, 1.3, C.white);
        const c = cell(s, 2.1, 1.25, 7.9, 2.75, C.blue);
        k.head(s, L.runs(d.text), c.x, c.y, c.w, c.h, { max: 36, min: 16, color: 'FFFFFF' });
        const q = cell(s, 2.1, 4.0, 7.9, 1.2);
        if (d.caption) bd(s, d.caption, q, C.white, { valign: 'middle' });
      },
      async (d) => { // the frame upside down: the thought high up, its note in a side column
        const s = low(d);
        const c = cell(s, 0, 0, 6.9, 3.9); k.head(s, L.runs(d.text), c.x, c.y, c.w, c.h, { max: 34, min: 16 });
        cell(s, 6.9, 0, 3.1, 0.7, C.blue);
        const q = cell(s, 6.9, 0.7, 3.1, 3.2);
        if (d.caption) bd(s, d.caption, q, C.white, { valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // four quarters, a painted year in each
        const s = page(d), h = 1.975, fills = [C.yellow, C.red, C.blue, C.yellow];
        for (const [i, it] of d.items.entries()) {
          const x = (i % 2) * 5, y = 1.25 + Math.floor(i / 2) * h, f = fills[i], yc = cell(s, x, y, 1.7, h, f);
          k.head(s, it.year, yc.x, yc.y, yc.w, yc.h, { max: 22, min: 11, color: fg(f) });
          const c = cell(s, x + 1.7, y, 3.3, h);
          hd(s, it.h, c.x, c.y, c.w, 0.42, C.white, { max: 14 });
          bd(s, it.t, { x: c.x, y: c.y + 0.44, w: c.w, h: c.h - 0.44 }, C.white, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // the year-blocks interlock: by turns at the top and at the foot of each column
        const s = page(d), w = 2.5, fills = [C.red, C.yellow, C.blue, C.red], yh = 0.85;
        for (const [i, it] of d.items.entries()) {
          const x = i * w, up = i % 2 === 0, f = fills[i], yc = cell(s, x, up ? 1.25 : 5.2 - yh, w, yh, f);
          k.head(s, it.year, yc.x, yc.y, yc.w, yc.h, { max: 22, min: 11, color: fg(f) });
          const c = cell(s, x, up ? 1.25 + yh : 1.25, w, 3.95 - yh);
          hd(s, it.h, c.x, c.y, c.w, 0.52, C.white, { max: 14, valign: 'top' });
          bd(s, it.t, { x: c.x, y: c.y + 0.54, w: c.w, h: c.h - 0.54 }, C.white, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // the tall title cell crosses to the right, a ladder of years runs down beside it
        const s = k.slide(C.black), X0 = 7.0, tc = cell(s, X0, 0, 3.0, 2.7), h = 5.2 / 4, fills = [C.red, C.yellow, C.blue, C.red];
        k.head(s, d.title || '', tc.x, tc.y, tc.w, tc.h, { max: 26, min: 14, valign: 'top' });
        const nc = cell(s, X0, 2.7, 1.8, 1.2); k.txt(s, String(k.idx), nc.x, nc.y, nc.w, nc.h, { size: 34, bold: true, font: F.head, valign: 'middle' });
        cell(s, X0 + 1.8, 2.7, 1.2, 1.2, C.blue); cell(s, X0, 3.9, 3.0, 1.3, C.yellow); footCell(s);
        for (const [i, it] of d.items.entries()) {
          const y = i * h, f = fills[i], yc = cell(s, 5.3, y, 1.7, h, f);
          k.head(s, it.year, yc.x, yc.y, yc.w, yc.h, { max: 20, min: 11, color: fg(f) });
          const c = cell(s, 0, y, 5.3, h);
          hd(s, it.h, c.x, c.y, c.w, 0.32, C.white, { max: 13.5 });
          bd(s, it.t, { x: c.x, y: c.y + 0.33, w: c.w, h: c.h - 0.33 }, C.white, { max: 12, ls: 1.1 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old four-column grids of these looked like the card columns
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Mondrian', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.black, lt2: C.white, accent1: C.red, accent2: C.blue, accent3: C.yellow, accent4: C.black, accent5: C.muted, accent6: 'BBBBBB', hlink: C.blue, folHlink: C.muted } });
}
module.exports = { id: 110, slug: 'mondrian', name: 'Mondrian', category: 'creative', photos: true, build, style: { tone: "toza va tuzilgan: har bir fikr o'z 'katagida', qisqa va aniq", limits: { title: 45 }, prefer: null } };
