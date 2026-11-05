/**
 * 130 Domino — ivory domino tiles on a slate table: the item number is shown as real PIPS on one half,
 * the idea is written on the other half; tiles lie in rows, stand as columns or run end-to-end as a chain.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { table: '2B3A55', tile: 'FFFDF5', ink: '1C1C1C', muted: '5A5A5A', pip: '1C1C1C', accent: 'E63946', line: 'C9C2B0' };
const F = { head: 'Arial', body: 'Calibri' };
const PIPS = { 1: [[0.5, 0.5]], 2: [[0.25, 0.25], [0.75, 0.75]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.25, 0.22], [0.75, 0.22], [0.25, 0.5], [0.75, 0.5], [0.25, 0.78], [0.75, 0.78]] };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const tileBox = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.tile, { r: 0.12, shadow: 0.35, blur: 4, offset: 2, line: { color: C.line, width: 0.75 }, name: 'Domino' });
  const pips = (s, n, x, y, sz, red) => (PIPS[((n - 1) % 6) + 1] || []).forEach(([a, b]) => t.oval(s, x + a * sz - sz * 0.08, y + b * sz - sz * 0.08, sz * 0.16, sz * 0.16, red ? C.accent : C.pip));
  // horizontal tile: pips square on the left, divider, text area on the right
  const hTile = (s, n, x, y, w, h) => { tileBox(s, x, y, w, h); const sq = Math.min(h - 0.1, 1.0); pips(s, n, x + 0.08, y + (h - sq) / 2, sq, n === 1); t.line(s, x + sq + 0.16, y + 0.1, 0, h - 0.2, C.line, 1.25); return { x: x + sq + 0.3, y: y + 0.05, w: w - sq - 0.4, h: h - 0.1 }; };
  const vTile = (s, n, x, y, w, h) => { tileBox(s, x, y, w, h); const sq = Math.min(w - 0.2, 1.0); pips(s, n, x + (w - sq) / 2, y + 0.08, sq, n === 1); t.line(s, x + 0.1, y + sq + 0.16, w - 0.2, 0, C.line, 1.25); return { x: x + 0.12, y: y + sq + 0.25, w: w - 0.24, h: h - sq - 0.32 }; };
  const page = (d) => { const s = k.slide(C.table); if (d.title) k.head(s, d.title, 0.4, 0.25, 8.0, 0.7, { max: 26, min: 14, color: 'FFFFFF' }); const nb = { x: 8.55, y: 0.22, w: 1.05, h: 0.6 }; tileBox(s, nb.x, nb.y, nb.w, nb.h); pips(s, k.idx, nb.x + 0.04, nb.y + 0.04, 0.52, false); t.line(s, nb.x + 0.6, nb.y + 0.08, 0, 0.44, C.line, 1); k.txt(s, String(k.idx), nb.x + 0.6, nb.y, 0.45, nb.h, { size: 13, bold: true, align: 'center', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5, color: 'AEB8CC' }); return s; };
  const rowsT = (s, n, draw) => { const per = n > 4 ? Math.ceil(n / 2) : n, cols = n > 4 ? 2 : 1, w = (9.2 - 0.2 * (cols - 1)) / cols, h = Math.min(1.25, (4.05 - 0.12 * (per - 1)) / per); for (let i = 0; i < n; i++) { const c = Math.floor(i / per), r = i % per; draw(i, hTile(s, i + 1, 0.4 + c * (w + 0.2), 1.1 + r * (h + 0.12), w, h)); } };
  const colsT = (s, n, draw) => { const w = (9.2 - 0.25 * (n - 1)) / n; for (let i = 0; i < n; i++) draw(i, vTile(s, i + 1, 0.4 + i * (w + 0.25), 1.1, w, 4.05)); };
  const R = {
    async cover(d) { const s = k.slide(C.table); [[5.6, 0.7, 6], [7.6, 0.7, 5], [5.6, 2.55, 3]].forEach(([x, y, n]) => { vTile(s, n, x, y, 1.6, 1.75).y; }); if (d.image) { tileBox(s, 7.6, 2.55, 1.6, 1.75); await k.photo(s, d.image, 7.7, 2.65, 1.4, 1.55, { mask: { r: 0.08 } }); }
      k.txt(s, k.org3, 0.45, 0.6, 4.8, 0.35, { size: 12, bold: true, color: 'F1C40F' }); k.head(s, d.title, 0.45, 1.0, 4.9, 2.4, { max: 38, min: 18, color: 'FFFFFF', valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.45, 3.45, 4.8, 0.75, { max: 13, color: 'C9D2E3' }); k.txt(s, k.M.author || '', 0.45, 4.3, 4.8, 0.45, { size: 15, bold: true, color: 'FFFFFF' }); k.foot(s, { y: 5.32, size: 7.5, color: 'AEB8CC' }); },
    async intro(d) { const s = page(d); tileBox(s, 0.4, 1.1, 3.6, 4.05); await k.photo(s, d.image, 0.55, 1.25, 3.3, 3.75, { mask: { r: 0.08 } }); tileBox(s, 4.2, 1.1, 5.4, 4.05); k.txt(s, d.text, 4.4, 1.25, 5.0, 3.75, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); rowsT(s, d.items.length, (i, b) => k.head(s, d.items[i], b.x, b.y, b.w, b.h, { max: 16 })); },
    async cards(d) { const s = page(d); colsT(s, d.items.length, (i, b) => { k.head(s, d.items[i].h, b.x, b.y, b.w, 0.5, { max: 15, align: 'center' }); k.txt(s, d.items[i].t, b.x, b.y + 0.52, b.w, b.h - 0.52, { max: 13, align: 'center', color: C.muted }); }); },
    async process(d) { const s = page(d); colsT(s, d.steps.length, (i, b) => { k.head(s, d.steps[i].h, b.x, b.y, b.w, 0.5, { max: 15, align: 'center' }); k.txt(s, d.steps[i].t, b.x, b.y + 0.52, b.w, b.h - 0.52, { max: 13, align: 'center', color: C.muted }); }); },
    async stats(d) { const s = page(d); colsT(s, d.stats.length, (i, b) => { k.head(s, d.stats[i].value, b.x, b.y, b.w, 0.95, { max: 40, min: 16, align: 'center', color: C.accent }); k.txt(s, d.stats[i].label, b.x, b.y + 1.0, b.w, b.h - 1.0 - (d.note ? 0.5 : 0), { max: 13, align: 'center' }); if (d.note && i === 0) k.txt(s, d.note, 0.55, 4.6, 9.0, 0.45, { max: 8.5, color: C.muted }); }); },
    async compare(d) { const s = page(d), w = 4.5, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.3, F.body, 0.1, 2.75);
      [d.left, d.right].forEach((sd, i) => { const b = vTile(s, i ? 6 : 1, 0.4 + i * 4.7, 1.1, w, 4.05); k.head(s, sd.h, b.x, b.y, b.w, 0.42, { max: 15, align: 'center', color: i ? '1D4E89' : C.accent }); let y = b.y + 0.48; sd.items.forEach((it, j) => { k.txt(s, it, b.x + 0.1, y, b.w - 0.2, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); const b = hTile(s, 6, 0.6, 1.4, 8.8, 2.3); k.head(s, L.runs(d.text), b.x, b.y, b.w, b.h, { max: 28, min: 14 }); if (d.caption) k.txt(s, d.caption, 0.6, 3.95, 8.8, 1.1, { max: 12, color: 'C9D2E3' }); },
    async timeline(d) { const s = page(d); colsT(s, d.items.length, (i, b) => { k.head(s, d.items[i].year, b.x, b.y, b.w, 0.5, { max: 20, min: 11, align: 'center', color: C.accent }); k.head(s, d.items[i].h, b.x, b.y + 0.52, b.w, 0.42, { max: 14, align: 'center' }); k.txt(s, d.items[i].t, b.x, b.y + 0.96, b.w, b.h - 0.96, { max: 12, align: 'center', color: C.muted }); }); },
    async quote(d) { const s = page({}); const b = hTile(s, 1, 0.6, 1.2, 8.8, 3.0); k.head(s, `\u201C${d.text}\u201D`, b.x, b.y, b.w, b.h - 0.5, { max: 26, min: 13, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, b.x, b.y + b.h - 0.5, b.w, 0.45, { size: 13, bold: true, color: C.accent }); },
    async sources(d) { const s = page(d); rowsT(s, d.items.length, (i, b) => k.txt(s, d.items[i], b.x, b.y, b.w, b.h, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all with the same tiles on the same table: a deck's pages must not look alike (L.pages)
  const SOFT = 'C9D2E3', FOOT = 'AEB8CC', BLUE = '1D4E89', GOLD = 'F1C40F';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const pipsW = (s, n, x, y, sz, col) => (PIPS[((n - 1) % 6) + 1] || []).forEach(([a, b]) => t.oval(s, x + a * sz - sz * 0.08, y + b * sz - sz * 0.08, sz * 0.16, sz * 0.16, col));
  const slate = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.table, { r: 0.12, shadow: 0.3, blur: 4, offset: 2, name: 'Domino' });
  const badge = (s) => { const nb = { x: 8.55, y: 0.22, w: 1.05, h: 0.6 }; tileBox(s, nb.x, nb.y, nb.w, nb.h); pips(s, k.idx, nb.x + 0.04, nb.y + 0.04, 0.52, false); t.line(s, nb.x + 0.6, nb.y + 0.08, 0, 0.44, C.line, 1); k.txt(s, String(k.idx), nb.x + 0.6, nb.y, 0.45, nb.h, { size: 13, bold: true, align: 'center', valign: 'middle' }); };
  const pg = (d, o = {}) => { const ivory = !!o.ivory, s = k.slide(ivory ? C.tile : C.table), tb = o.title || {}; if (d.title) k.head(s, d.title, tb.x ?? 0.4, tb.y ?? 0.25, tb.w ?? 8.0, tb.h ?? 0.7, { max: tb.max ?? 26, min: 14, color: ivory ? C.ink : 'FFFFFF' }); badge(s); k.foot(s, { y: 5.32, size: 7.5, color: ivory ? C.muted : FOOT }); return s; };
  // a tile leaning over, as in a falling chain: rotated about its middle
  const lean = (s, x, y, w, h, deg, n) => { t.rect(s, x, y, w, h, C.tile, { r: 0.08, rotate: deg, shadow: 0.35, blur: 4, offset: 2, line: { color: C.line, width: 0.75 }, name: 'Domino' }); };
  const V = {
    image: [
      async (d) => { // one tall tile stood on its side across the table: the picture is one half, the words the other
        const s = pg(d), x = 0.4, y = 1.02, w = 9.2, h = 4.18; tileBox(s, x, y, w, h);
        await k.photo(s, d.image, x + 0.14, y + 0.14, w - 0.28, 1.92, { mask: { r: 0.06 } });
        t.line(s, x + 0.14, y + 2.2, w - 0.28, 0, C.line, 1.5); t.oval(s, x + w / 2 - 0.08, y + 2.12, 0.16, 0.16, C.accent);
        bd(s, d.text, x + 0.3, y + 2.3, w - 0.6, h - 2.4, { max: 13, valign: 'middle', ls: 1.15 });
      },
      async (d) => { // the picture fills the table's top, one big tile lies on it with the words
        const s = k.slide(C.table), px = 4.6, pw = 5.0;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, 0, 5.26, 10, 0.365, C.table, { name: 'Band' });
        tileBox(s, px, 0.3, pw, 4.78);
        pips(s, 5, px + 0.14, 0.42, 0.72, false); t.line(s, px + 1.0, 0.42, 0, 0.74, C.line, 1.25);
        k.head(s, d.title || '', px + 1.14, 0.4, pw - 1.3, 0.78, { max: 20, min: 13 });
        t.line(s, px + 0.14, 1.26, pw - 0.28, 0, C.line, 1.25);
        bd(s, d.text, px + 0.22, 1.34, pw - 0.44, 3.66, { max: 13.5 });
        k.txt(s, String(k.idx), 0.3, 4.72, 0.8, 0.44, { size: 15, bold: true, color: 'FFFFFF', valign: 'middle' });
        k.foot(s, { y: 5.34, size: 7.5, color: FOOT });
      },
      async (d) => { // a row of leaning tiles: the picture shows only through them as they fall
        const s = pg(d), W0 = 9.2, H0 = 2.2, n = 7; let p = '';
        for (let i = 0; i < n; i++) { const x0 = i / n + 0.004, x1 = x0 + 1 / n - 0.016, sl = 0.05; p += `M${x0 + sl},0 L${x1 + sl},0 L${x1 - sl + 0.03},1 L${x0 - sl + 0.03},1 Z `; }
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: { path: p } }), 0.4, 1.0, W0, H0, { alt: '' });
        t.line(s, 0.4, 3.26, 9.2, 0, C.line, 1.5);
        bd(s, d.text, 0.4, 3.36, 9.2, 1.86, { color: 'FFFFFF', max: 13.5, valign: 'middle' });
      },
      async (d) => { // the page itself is a tile: the picture is its one great pip, the words the other half
        const s = pg(d, { ivory: true, title: { x: 5.2, y: 0.28, w: 3.2, h: 1.1, max: 20 } }), D = 3.9;
        t.line(s, 4.95, 0.28, 0, 4.92, C.line, 2);
        const px = 0.5, py = 0.82;
        t.oval(s, px - 0.07, py - 0.07, D + 0.14, D + 0.14, C.pip);
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: 'circle' }), px, py, D, D, { alt: '' });
        for (const [a, b] of [[0.28, 0.36], [4.5, 0.36], [0.28, 4.95], [4.5, 4.95]]) t.oval(s, a, b, 0.2, 0.2, C.accent);
        bd(s, d.text, 5.2, 1.46, 4.4, 3.72, { max: 13.5, ls: 1.22 });
      },
    ],
    cards: [
      async (d) => { // tiles lie in rows across the table, each with its sign in place of pips
        const s = pg(d), n = d.items.length, gap = 0.1, h = (5.2 - 1.04 - gap * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.04 + i * (h + gap), sq = Math.min(h - 0.12, 0.84); tileBox(s, 0.4, y, 9.2, h);
          t.img(s, await k.icon(it.icon, i === 0 ? C.accent : C.ink, 1.75), 0.55, y + (h - sq * 0.66) / 2, sq * 0.66, sq * 0.66);
          t.line(s, 0.55 + sq * 0.66 + 0.14, y + 0.1, 0, h - 0.2, C.line, 1.25);
          const tx = 0.55 + sq * 0.66 + 0.28;
          hd(s, it.h, tx, y + 0.05, 2.5, h - 0.1, { max: 15 });
          bd(s, it.t, tx + 2.65, y + 0.05, 9.42 - tx - 2.65, h - 0.1, { valign: 'middle', color: C.muted, max: 13, ls: 1.08 });
        }
      },
      async (d) => { // a double-tile spinner in the middle, ideas laid off it to left and right
        const s = pg(d), n = d.items.length, w = 3.75, sw = 1.1, cx = 5, sy = 1.34, sh = 3.56, spots = n === 4 ? [[0, 1.08], [1, 1.08], [0, 3.16], [1, 3.16]] : [[0, 1.08], [1, 2.12], [0, 3.16]], hh = 2.0;
        tileBox(s, cx - sw / 2, sy, sw, sh); t.line(s, cx - sw / 2 + 0.1, sy + sh / 2, sw - 0.2, 0, C.line, 1.5);
        pips(s, n, cx - 0.45, sy + 0.42, 0.9, false); pips(s, n, cx - 0.45, sy + sh / 2 + 0.42, 0.9, false);
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? cx + sw / 2 + 0.08 : cx - sw / 2 - 0.08 - w;
          tileBox(s, x, y, w, hh);
          t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.12, y + 0.1, 0.36, 0.36);
          hd(s, it.h, x + 0.56, y + 0.05, w - 0.66, 0.46, { max: 14 });
          bd(s, it.t, x + 0.14, y + 0.56, w - 0.28, hh - 0.62, { color: C.muted, max: 12.5 });
        }
      },
      async (d) => { // four work tiles lie about, one pair above the other, each with sign, line and words
        const s = pg(d), n = d.items.length, w = 4.5, h = 1.98;
        for (const [i, it] of d.items.entries()) {
          const row = Math.floor(i / 2), x = n === 3 && i === 2 ? 2.75 : 0.4 + (i % 2) * (w + 0.2) + (row ? 0 : 0), y = 1.04 + row * (h + 0.14);
          tileBox(s, x, y, w, h);
          t.oval(s, x + 0.16, y + 0.16, 0.72, 0.72, C.accent); t.img(s, await k.icon(it.icon, 'FFFFFF', 2), x + 0.34, y + 0.34, 0.36, 0.36);
          pips(s, i + 1, x + 0.2, y + 1.0, 0.68, false);
          t.line(s, x + 1.02, y + 0.12, 0, h - 0.24, C.line, 1.25);
          hd(s, it.h, x + 1.14, y + 0.08, w - 1.26, 0.44, { max: 14, color: BLUE });
          bd(s, it.t, x + 1.14, y + 0.54, w - 1.26, h - 0.6, { color: C.ink, max: 12.5 });
        }
      },
      async (d) => { // the table turned ivory, slate tiles stand on it at stepping heights
        const s = pg(d, { ivory: true }), n = d.items.length, w = 9.2 / n, st = n === 4 ? [0.46, 0.16, 0.34, 0] : [0.36, 0, 0.2];
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.05, ww = w - 0.1, y = 1.02 + st[i], hh = 5.2 - y;
          slate(s, x, y, ww, hh);
          t.img(s, await k.icon(it.icon, GOLD, 2), x + 0.15, y + 0.14, 0.38, 0.38);
          pipsW(s, i + 1, x + ww - 0.6, y + 0.1, 0.46, 'FFFFFF');
          t.line(s, x + 0.12, y + 0.62, ww - 0.24, 0, FOOT, 1);
          hd(s, it.h, x + 0.14, y + 0.68, ww - 0.28, 0.55, { color: 'FFFFFF', max: 14, valign: 'top' });
          bd(s, it.t, x + 0.14, y + 1.24, ww - 0.28, hh - 1.3, { color: 'FFFFFF', max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // the cascade: each tile knocks the next, one row lower and further on
        const s = pg(d), n = d.steps.length, gap = 0.08, h = (5.2 - 1.04 - gap * (n - 1)) / n, w = n === 4 ? 6.5 : 6.8, ind = (9.2 - w) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * ind, y = 1.04 + i * (h + gap), b = hTile(s, i + 1, x, y, w, h);
          hd(s, st.h, b.x, b.y, b.w, 0.32, { max: 13.5, color: C.accent });
          bd(s, st.t, b.x, b.y + 0.33, b.w, b.h - 0.33, { color: C.ink, max: 12.5, ls: 1.06 });
        }
      },
      async (d) => { // they begin to fall: each tile leans further than the last, the words lie below it
        const s = pg(d), n = d.steps.length, w = 9.2 / n, tw = 0.64, th = 1.2, degs = n === 4 ? [0, 14, 30, 48] : [0, 20, 44];
        t.line(s, 0.4, 2.26, 9.2, 0, 'AEB8CC', 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, cx = x + 0.55;
          lean(s, cx - tw / 2, 2.22 - th - (degs[i] ? Math.sin(degs[i] * Math.PI / 180) * 0.0 : 0) + (degs[i] / 90) * 0.26, tw, th, degs[i]);
          if (degs[i] === 0) pips(s, i + 1, cx - tw / 2 + 0.04, 1.08, tw - 0.08, false);
          k.txt(s, String(i + 1), cx + 0.95, 1.1, 0.7, 0.7, { size: 28, bold: true, font: F.head, color: GOLD, valign: 'middle' });
          hd(s, st.h, x, 2.34, w - 0.2, 0.54, { color: 'FFFFFF', valign: 'top', max: 14 });
          bd(s, st.t, x, 2.9, w - 0.2, 2.3, { color: SOFT, max: 13 });
        }
      },
      async (d) => { // on the ivory table the slate tiles climb to the right, side by side, words inside
        const s = pg(d, { ivory: true, title: { w: 6.2 } }), n = d.steps.length, w = 9.2 / n, tops = n === 4 ? [2.5, 2.02, 1.54, 1.06] : [2.4, 1.74, 1.06];
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w + 0.04, ww = w - 0.08, y = tops[i], hh = 5.2 - y;
          slate(s, x, y, ww, hh);
          pipsW(s, i + 1, x + 0.1, y + 0.08, 0.52, 'FFFFFF');
          k.txt(s, String(i + 1), x + ww - 0.72, y + 0.08, 0.6, 0.52, { size: 24, bold: true, font: F.head, color: GOLD, align: 'right', valign: 'middle' });
          hd(s, st.h, x + 0.14, y + 0.64, ww - 0.28, 0.54, { color: 'FFFFFF', max: 14, valign: 'top' });
          bd(s, st.t, x + 0.14, y + 1.18, ww - 0.28, hh - 1.24, { color: 'FFFFFF', max: 12.5 });
        }
      },
      async (d) => { // the chain turns back and forth between two rows, red links from tile to tile
        const s = pg(d), n = d.steps.length, w = 3.7, sx = (9.2 - w) / (n - 1), ys = [1.04, 3.16], hh = 1.98;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * sx, y = ys[i % 2];
          if (i < n - 1) { const lx = x + sx + 0.28; t.line(s, lx, ys[0] + hh, 0, ys[1] - ys[0] - hh, C.accent, 3); t.oval(s, lx - 0.07, ys[0] + hh - 0.07, 0.14, 0.14, C.accent); t.oval(s, lx - 0.07, ys[1] - 0.07, 0.14, 0.14, C.accent); }
          tileBox(s, x, y, w, hh);
          pips(s, i + 1, x + 0.08, y + 0.08, 0.5, i === 0);
          hd(s, st.h, x + 0.64, y + 0.06, w - 0.76, 0.52, { max: 14 });
          bd(s, st.t, x + 0.16, y + 0.62, w - 0.32, hh - 0.68, { color: C.muted, max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // one long tile split in three halves, a number in each
        const s = pg(d), y = 1.14, h = 2.74, w = 9.2 / 3; tileBox(s, 0.4, y, 9.2, h);
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w;
          if (i) t.line(s, x, y + 0.12, 0, h - 0.24, C.line, 1.5);
          pips(s, i + 1, x + 0.12, y + 0.1, 0.5, false);
          k.head(s, v.value, x + 0.12, y + 0.62, w - 0.24, 1.0, { max: 40, min: 18, color: i === 1 ? BLUE : C.accent, align: 'center', ls: 1 });
          bd(s, v.label, x + 0.2, y + 1.66, w - 0.4, h - 1.74, { align: 'center', max: 13 });
        }
        if (d.note) bd(s, d.note, 0.4, 4.02, 9.2, 1.18, { color: 'FFFFFF', max: 13, valign: 'middle' });
      },
      async (d) => { // one standing tile holds the lead number, two lying tiles beside it the others
        const s = pg(d), [a, ...rest] = d.stats, W0 = 3.5, h0 = 4.16; tileBox(s, 0.4, 1.04, W0, h0);
        k.head(s, a.value, 0.55, 1.1, W0 - 0.3, 1.58, { max: 50, min: 22, color: C.accent, align: 'center', ls: 1 });
        t.line(s, 0.55, 2.74, W0 - 0.3, 0, C.line, 1.5);
        bd(s, a.label, 0.65, 2.82, W0 - 0.5, 0.96, { align: 'center', max: 14 });
        pips(s, 1, 1.65, 3.84, 1.0, true);
        for (const [i, v] of rest.entries()) {
          const b = hTile(s, i + 2, 4.1, 1.04 + i * 1.14, 5.5, 1.04);
          k.head(s, v.value, b.x, b.y, 1.9, b.h, { max: 26, min: 14, color: BLUE });
          bd(s, v.label, b.x + 1.98, b.y, b.w - 1.98, b.h, { valign: 'middle', max: 12.5 });
        }
        if (d.note) bd(s, d.note, 4.1, 3.36, 5.5, 1.84, { color: 'FFFFFF', max: 13, valign: 'middle' });
      },
      async (d) => { // the page is a tile showing three: three giant pips step across it, each a number
        const s = pg(d, { ivory: true }), D = 1.32, spots = [[0.4, 1.04], [3.45, 2.0], [6.5, 2.96]];
        t.line(s, 0.4 + D / 2, 1.04 + D / 2, 6.1, 1.92, C.line, 1.25);
        for (const [i, v] of d.stats.entries()) {
          const [x, y] = spots[i];
          t.oval(s, x, y, D, D, i === 0 ? C.accent : C.pip);
          k.head(s, v.value, x + 0.08, y + 0.28, D - 0.16, D - 0.56, { max: 24, min: 12, color: 'FFFFFF', align: 'center', ls: 1 });
          t.rect(s, x + D + 0.06, y + 0.1, 1.68, D - 0.2, C.tile, { name: 'Back' }); bd(s, v.label, x + D + 0.1, y + 0.1, 1.62, D - 0.2, { max: 12.5, valign: 'middle' });
        }
        if (d.note) bd(s, d.note, 0.45, 3.46, 5.7, 1.74, { color: C.muted, max: 12.5, valign: 'bottom' });
      },
    ],
    compare: [
      async (d) => { // one wide tile, its line of pips down the middle; each half mirrors the other
        const s = pg(d), y0 = 1.04, h = 4.16, w = 4.0, top = y0 + 0.66, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.14, y0 + h - 0.1 - top); tileBox(s, 0.4, y0, 9.2, h);
        t.line(s, 5, y0 + 0.1, 0, h - 0.2, C.line, 1.5);
        k.head(s, d.left.h, 0.55, y0 + 0.08, w + 0.2, 0.52, { max: 17, min: 12, color: C.accent, align: 'right' });
        k.head(s, d.right.h, 5.25, y0 + 0.08, w + 0.2, 0.52, { max: 17, min: 12, color: BLUE });
        const m = Math.max(d.left.items.length, d.right.items.length); let y = top;
        for (let j = 0; j < m; j++) {
          t.oval(s, 4.92, y + 0.06, 0.16, 0.16, C.pip);
          if (d.left.items[j]) k.txt(s, d.left.items[j], 0.7, y, w, rr[j], { size: fs, align: 'right', ls: 1 });
          if (d.right.items[j]) k.txt(s, d.right.items[j], 5.3, y, w, rr[j], { size: fs, ls: 1 });
          y += rr[j];
        }
      },
      async (d) => { // two long tiles, one laid over the other, one ivory, one dark
        const s = pg(d), H = 2.0;
        [[d.left, 1.04, 1, true], [d.right, 3.2, 6, false]].forEach(([sd, y, pv, ivory]) => { const f = ivory ? C.ink : 'FFFFFF', c = ivory ? C.accent : GOLD;
          if (ivory) tileBox(s, 0.4, y, 9.2, H); else t.rect(s, 0.4, y, 9.2, H, '16233A', { r: 0.12, line: { color: FOOT, width: 0.75 }, name: 'Domino' });
          if (ivory) pips(s, pv, 0.5, y + 0.08, 0.6, true); else pipsW(s, pv, 0.5, y + 0.08, 0.6, 'FFFFFF');
          k.head(s, sd.h, 0.5, y + 0.72, 1.95, H - 0.8, { max: 15, min: 11, color: c, valign: 'top' });
          t.line(s, 2.55, y + 0.12, 0, H - 0.24, ivory ? C.line : FOOT, 1.25);
          const n = sd.items.length, w = 6.95 / n;
          sd.items.forEach((it, j) => bd(s, it, 2.68 + j * w, y + 0.12, w - 0.14, H - 0.24, { color: f, max: 12.5, valign: 'middle', ls: 1.1 }));
        });
      },
    ],
    statement: [
      async (d) => { // the page a single ivory tile: great black pips at the corners, the sentence in the middle
        const s = pg(d, { ivory: true });
        for (const [a, b] of [[0.32, 1.12], [9.1, 1.12], [0.32, 4.72], [9.1, 4.72]]) t.oval(s, a, b, 0.58, 0.58, C.accent);
        k.head(s, L.runs(d.text), 1.15, 1.06, 7.7, 2.45, { max: 30, min: 15, align: 'center' });
        t.line(s, 1.15, 3.58, 7.7, 0, C.line, 1.5);
        if (d.caption) bd(s, d.caption, 1.15, 3.66, 7.7, 1.54, { color: C.muted, align: 'center', max: 13 });
      },
      async (d) => { // the sentence stands free on the table, a chain of leaning tiles falls away beneath it
        const s = pg(d), n = 11;
        k.head(s, L.runs(d.text), 0.4, 1.0, 9.2, 1.75, { max: 28, min: 15, color: 'FFFFFF' });
        if (d.caption) bd(s, d.caption, 0.4, 2.8, 9.2, 1.08, { color: SOFT, max: 12.5 });
        t.line(s, 0.4, 5.14, 9.2, 0, FOOT, 1);
        for (let i = 0; i < n; i++) { const a = i < 6 ? 0 : (i - 5) * 11; t.rect(s, 0.5 + i * 0.8, 4.0 + (a / 90) * 0.26, 0.4, 1.1, C.tile, { r: 0.05, rotate: a, line: { color: C.line, width: 0.75 }, name: 'Domino' }); t.line(s, 0.5 + i * 0.8 + 0.06, 4.55 + (a / 90) * 0.26, a ? 0 : 0.28, 0, a ? C.tile : C.line, 0.75); }
      },
    ],
    timeline: [
      async (d) => { // the chain lies end to end across the table: pips and year on each tile, events beneath it
        const s = pg(d), w = 9.2 / 4;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w; tileBox(s, x, 1.1, w, 0.86);
          pips(s, i + 1, x + 0.08, 1.16, 0.74, false); t.line(s, x + 0.86, 1.2, 0, 0.66, C.line, 1.25);
          k.head(s, it.year, x + 0.92, 1.1, w - 1.0, 0.86, { max: 16, min: 10, color: C.accent, align: 'center', ls: 1 });
          hd(s, it.h, x + 0.06, 2.06, w - 0.16, 0.38, { color: 'FFFFFF', max: 14 });
          bd(s, it.t, x + 0.06, 2.46, w - 0.18, 2.74, { color: SOFT, max: 13 });
        }
      },
      async (d) => { // on the ivory table a row of slate years, events laid above and below it by turns
        const s = pg(d, { ivory: true }), ya = 2.84, w = 4.4;
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.4 + i * 2.3, x = 0.4 + Math.floor(i / 2) * 4.8;
          slate(s, xn, ya, 2.24, 0.5);
          k.head(s, it.year, xn + 0.5, ya, 1.7, 0.5, { max: 14, min: 10, color: 'FFFFFF', align: 'center', ls: 1 });
          pipsW(s, i + 1, xn + 0.04, ya + 0.03, 0.44, GOLD);
          if (up) { hd(s, it.h, x, 1.02, w, 0.36, { color: C.accent }); bd(s, it.t, x, 1.38, w, ya - 0.08 - 1.38, { max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.58, w, 0.36, { color: C.accent }); bd(s, it.t, x, ya + 0.94, w, 5.22 - ya - 0.94, { max: 12.5 }); }
        }
      },
      async (d) => { // the chain stands up the middle of the table; a year tile for each event, sides by turns
        const s = pg(d), cx = 5, y0 = 1.02, rh = 0.98, w = 3.65, tw = 1.4;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? cx - tw / 2 - 0.12 - w : cx + tw / 2 + 0.12, a = left ? 'right' : 'left', th = Math.min(2 * rh - 0.44, 5.22 - y - 0.4);
          tileBox(s, cx - tw / 2, y, tw, 0.9);
          t.line(s, cx - tw / 2 + 0.08, y + 0.5, tw - 0.16, 0, C.line, 1);
          k.head(s, it.year, cx - tw / 2 + 0.04, y + 0.03, tw - 0.08, 0.46, { max: 14, min: 9.5, color: C.accent, align: 'center', ls: 1 });
          const c2 = i + 1; (PIPS[c2] || []).forEach(([p, q]) => t.oval(s, cx - 0.18 + p * 0.36 - 0.03, y + 0.52 + q * 0.36 - 0.03, 0.06, 0.06, C.pip));
          hd(s, it.h, x, y, w, 0.38, { color: 'FFFFFF', align: a, max: 14 });
          bd(s, it.t, x, y + 0.4, w, th, { color: SOFT, align: a, max: 12.5 });
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Domino', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.table, lt2: C.tile, accent1: C.accent, accent2: '1D4E89', accent3: 'F1C40F', accent4: '2A9D8F', accent5: C.muted, accent6: C.line, hlink: '1D4E89', folHlink: C.muted } });
}
module.exports = { id: 130, slug: 'domino', name: 'Domino', category: 'creative', photos: true, build, style: { tone: "zanjir reaksiya: har bir fikr keyingisini boshlaydi; aniq, ketma-ket, sabab-oqibatli", limits: { card_t4: 110, step_t: 110 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "bold"], "transitions": ["push:r", "cut", "p14:ferris|dir=\"l\""], "cover": ["bounceDrop", "swingRight"], "mark": "drop", "deco": "swingRight", "sig": {"title": "swingRight", "body": "fadeUp", "item": "swingRight", "image": "bounceDrop", "number": "drop", "order": "cascade", "stagger": 0.09}, "tempo": 0.85, "kenburns": false};
