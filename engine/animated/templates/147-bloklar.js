/** 147 Bloklar — a falling-blocks game: a dark playfield with a grid; ideas are completed LINES of blocks stacking up from the bottom; a "next" box shows the slide number, a falling piece hangs above. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '0D1321', field: '151C2E', grid: '232D45', ink: 'FFFFFF', muted: 'A9B4CC', pal: ['00BBF9', 'FEE440', 'F15BB5', '9B5DE5', '00F5D4', 'FF7F11'] };
const F = { head: 'Courier New', body: 'Arial' };
const FX = 0.4, FW = 7.0, FY = 0.95, FH = 4.25, SQ = 0.35;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const field = (s) => { t.rect(s, FX, FY, FW, FH, C.field, { line: { color: '3A4566', width: 2 }, name: 'Playfield' }); for (let x = FX + SQ; x < FX + FW - 0.01; x += SQ) t.line(s, x, FY, 0, FH, C.grid, 0.5); for (let y = FY + SQ; y < FY + FH - 0.01; y += SQ) t.line(s, FX, y, FW, 0, C.grid, 0.5); };
  const side = (s) => { t.rect(s, 7.7, FY, 1.9, 1.5, C.field, { line: { color: '3A4566', width: 2 }, name: 'Next' }); k.txt(s, String(k.idx).padStart(2, '0'), 7.7, FY + 0.1, 1.9, 1.3, { size: 40, bold: true, font: F.head, color: C.pal[k.idx % 6], align: 'center', valign: 'middle' }); t.rect(s, 7.7, FY + 1.7, 1.9, 0.6, C.field, { line: { color: '3A4566', width: 2 }, name: 'Score' }); k.txt(s, `${String(k.idx * 100).padStart(6, '0')}`, 7.7, FY + 1.7, 1.9, 0.6, { size: 14, bold: true, font: F.head, color: C.ink, align: 'center', valign: 'middle' }); };
  // a completed line of blocks with bevels, text written on it
  const line = (s, y, h, c) => { t.rect(s, FX, y, FW, h, c, { name: 'Line' }); for (let x = FX + SQ; x < FX + FW - 0.01; x += SQ) t.line(s, x, y, 0, h, '000000', 0.75, { t: 70 }); t.line(s, FX, y + 0.02, FW, 0, 'FFFFFF', 1.5, { t: 50 }); };
  const stack = (s, n, draw) => { const h = Math.min(1.2, (FH - 0.7) / n); for (let i = 0; i < n; i++) { const y = FY + FH - (i + 1) * h, c = C.pal[i % 6]; line(s, y, h - 0.03, c); draw(i, FX + 0.15, y, FW - 0.3, h - 0.03, c !== C.pal[3] ? '0D1321' : 'FFFFFF'); } };
  const falling = (s, i) => { const c = C.pal[(i + 2) % 6], x = FX + SQ * 8, y = FY + SQ; [[0, 0], [1, 0], [2, 0], [1, 1]].forEach(([a, b]) => t.rect(s, x + a * SQ, y + b * SQ, SQ - 0.02, SQ - 0.02, c, { name: 'Piece' })); };
  const page = (d) => { const s = k.slide(C.bg); field(s); side(s); if (d.title) k.head(s, d.title.toUpperCase(), 0.4, 0.2, 9.2, 0.65, { max: 22, min: 12, color: C.ink, font: F.head }); k.foot(s, { y: 5.32, size: 7.5, color: C.muted }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); field(s); falling(s, 0); [0, 1, 2].forEach((i) => line(s, FY + FH - (i + 1) * 0.4, 0.38, C.pal[i])); if (d.image) await k.photo(s, d.image, 7.7, FY, 1.9, 2.3); k.head(s, d.title.toUpperCase(), FX + 0.3, FY + 0.9, FW - 0.6, 1.8, { max: 30, min: 14, color: C.ink, font: F.head, align: 'center' }); k.txt(s, k.M.author || '', FX + 0.3, FY + 2.75, FW - 0.6, 0.45, { size: 15, bold: true, color: C.pal[1], align: 'center', font: F.head }); k.txt(s, k.org3, 7.7, FY + 2.45, 1.9, 1.7, { max: 11, color: C.muted, font: F.head }); k.foot(s, { y: 5.32, size: 7.5, color: C.muted }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, FX + SQ, FY + SQ, SQ * 8, FH - 2 * SQ); k.txt(s, d.text, FX + SQ * 9 + 0.1, FY + 0.2, FW - SQ * 9 - 0.3, FH - 0.4, { max: 14, min: 9.5, color: C.ink, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); falling(s, 1); stack(s, d.items.length, (i, x, y, w, h, c) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 16, color: c, font: F.head })); },
    async cards(d) { const s = page(d); falling(s, 2); stack(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].h.toUpperCase(), x, y, 2.1, h, { max: 13, color: c, font: F.head }); k.txt(s, d.items[i].t, x + 2.2, y, w - 2.2, h, { max: 12, color: c, valign: 'middle' }); }); },
    async process(d) { const s = page(d); falling(s, 3); stack(s, d.steps.length, (i, x, y, w, h, c) => { k.head(s, `${i + 1}. ${d.steps[i].h}`.toUpperCase(), x, y, 2.3, h, { max: 13, color: c, font: F.head }); k.txt(s, d.steps[i].t, x + 2.4, y, w - 2.4, h, { max: 12, color: c, valign: 'middle' }); }); },
    async stats(d) { const s = page(d); falling(s, 4); stack(s, d.stats.length, (i, x, y, w, h, c) => { k.head(s, d.stats[i].value, x, y, 2.1, h, { max: 34, min: 14, color: c, font: F.head }); k.txt(s, d.stats[i].label, x + 2.2, y, w - 2.2, h, { max: 12, color: c, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, 7.7, FY + 2.5, 1.9, 1.75, { max: 9, color: C.muted }); },
    async compare(d) { const s = page(d); const w = FW / 2 - 0.1, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.3, F.body, 0.1, FH - 0.7); [d.left, d.right].forEach((sd, i) => { const x = FX + i * (w + 0.2); t.rect(s, x, FY, w, 0.5, C.pal[i ? 4 : 2], { name: 'Head' }); k.head(s, sd.h.toUpperCase(), x + 0.1, FY, w - 0.2, 0.5, { max: 13, color: '0D1321', font: F.head }); let y = FY + 0.6; sd.items.forEach((it, j) => { k.txt(s, `\u25A0 ${it}`, x + 0.1, y, w - 0.2, rr[j], { size: fs, color: C.ink }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); line(s, FY + FH - 0.45, 0.42, C.pal[0]); line(s, FY + FH - 0.9, 0.42, C.pal[3]); k.head(s, L.runs(d.text), FX + 0.3, FY + 0.12, FW - 0.6, 1.95, { max: 26, min: 13, color: C.ink, align: 'center' }); if (d.caption) k.txt(s, d.caption, FX + 0.3, FY + 2.1, FW - 0.6, 1.2, { max: 11.5, color: C.muted, align: 'center', valign: 'middle', ls: 1.1 }); },
    async timeline(d) { const s = page(d); falling(s, 5); stack(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].year, x, y, 1.1, h, { max: 18, min: 10, color: c, font: F.head }); k.head(s, d.items[i].h, x + 1.2, y, 1.8, h, { max: 12, color: c }); k.txt(s, d.items[i].t, x + 3.1, y, w - 3.1, h, { max: 11, color: c, valign: 'middle' }); }); },
    async quote(d) { const s = page({}); k.head(s, `"${d.text}"`, FX + 0.3, FY + 0.3, FW - 0.6, 2.8, { max: 24, min: 12, color: C.ink, font: F.head, align: 'center' }); if (d.author) { line(s, FY + FH - 0.5, 0.45, C.pal[1]); k.txt(s, d.author.toUpperCase(), FX + 0.2, FY + FH - 0.5, FW - 0.4, 0.45, { size: 13, bold: true, font: F.head, color: '0D1321', align: 'center', valign: 'middle' }); } },
    async sources(d) { const s = page(d); stack(s, d.items.length, (i, x, y, w, h, c) => k.txt(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 11, color: c, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all on the same game: a deck's pages must not look alike (L.pages)
  const BG = C.bg, WH = C.ink, DK = '0D1321', LCD = '9BBC0F', LCD2 = '8BAC0F', LD = '0F380F', LM = '306230';
  const darkOn = (c) => c !== C.pal[3];
  const SH = { T: [[0, 0], [1, 0], [2, 0], [1, 1]], L: [[0, 0], [0, 1], [0, 2], [1, 2]], S: [[1, 0], [2, 0], [0, 1], [1, 1]], O: [[0, 0], [1, 0], [0, 1], [1, 1]], I: [[0, 0], [1, 0], [2, 0], [3, 0]], J: [[1, 0], [1, 1], [1, 2], [0, 2]] };
  const cellsvg = (cells, c, sz = 40) => { const W2 = (Math.max(...cells.map((p) => p[0])) + 1) * sz, H2 = (Math.max(...cells.map((p) => p[1])) + 1) * sz; return { W2, H2, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}">${cells.map(([a, b]) => `<rect x="${a * sz + 1}" y="${b * sz + 1}" width="${sz - 2}" height="${sz - 2}" fill="#${c}"/><rect x="${a * sz + 1}" y="${b * sz + 1}" width="${sz - 2}" height="4" fill="#fff" opacity="0.55"/><rect x="${a * sz + 1}" y="${b * sz + sz - 5}" width="${sz - 2}" height="4" fill="#000" opacity="0.3"/>`).join('')}</svg>` }; };
  const tet = async (s, name, c, x, y, cell = SQ) => { const cells = SH[name] || name, { W2, H2, svg } = cellsvg(cells, c); t.img(s, await k.svg(`tet${JSON.stringify(cells)}${c}`, svg, W2, H2), x, y, W2 / 40 * cell, H2 / 40 * cell); };
  const grid = async (s, col = C.grid) => { let g = ''; for (let x = 0; x <= 1000; x += 35) g += `<rect x="${x}" width="1" height="563" fill="#${col}"/>`; for (let y = 0; y <= 563; y += 35) g += `<rect y="${y}" width="1000" height="1" fill="#${col}"/>`; t.img(s, await k.svg(`grid${col}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${g}</svg>`, 1000, 563), 0, 0, 10, 5.625); };
  const pg = async (d, o = {}) => { const s = k.slide(BG); await grid(s); if (d.title) { t.rect(s, 0, 0, 10, 0.86, C.bg, { name: 'Top' }); k.head(s, d.title.toUpperCase(), o.x ?? 0.4, 0.14, o.w ?? 7.6, 0.62, { max: 21, min: 12, color: WH, font: F.head }); } k.txt(s, String(k.idx * 100).padStart(6, '0'), 8.1, 0.14, 1.5, 0.62, { size: 15, bold: true, font: F.head, color: C.pal[k.idx % 2 ? 1 : 4], align: 'right', valign: 'middle' }); k.foot(s, { x: o.fx ?? 0.4, y: 5.32, w: o.fw ?? 9.2, size: 7.5, color: C.muted }); return s; };
  const gb = (d, o = {}) => { const s = k.slide(LCD); if (d.title) k.head(s, d.title.toUpperCase(), 0.4, 0.14, o.w ?? 7.6, 0.62, { max: 21, min: 12, color: LD, font: F.head }); t.rect(s, 0.4, 0.8, 9.2, 0.05, LD, { name: 'Rule' }); k.txt(s, String(k.idx * 100).padStart(6, '0'), 8.1, 0.14, 1.5, 0.62, { size: 15, bold: true, font: F.head, color: LD, align: 'right', valign: 'middle' }); k.foot(s, { x: 0.4, y: 5.32, w: 9.2, size: 7.5, color: LD }); return s; };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13.5, min: 10, ls: 1.16, color: WH, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 13, min: 10, font: F.head, color: C.pal[1], ...o });
  const V = {
    image: [
      async (d) => { // the picture is cut to one big L-piece, a small block falls into its notch
        const s = await pg(d), x = 0.35, y = 1.0, w = 4.9, h = 4.2;
        await k.photo(s, d.image, x, y, w, h, { mask: { poly: [[0, 0], [0.5, 0], [0.5, 0.5], [1, 0.5], [1, 1], [0, 1]] } });
        await tet(s, 'O', C.pal[2], x + w / 2 + 0.3, y + 0.2, 0.7);
        bd(s, d.text, 5.5, 1.0, 4.1, 4.2, { valign: 'middle', ls: 1.22, max: 14 });
      },
      async (d) => { // the picture itself in big square pixels, a tall panel at the right of the page
        const s = await pg(d, { w: 7.6 }), pw = 4.2, px = 5.4;
        await k.photo(s, d.image, px, 1.0, pw, 4.2, { pixel: 42 });
        t.rect(s, px, 1.0, pw, 4.2, null, { line: { color: C.pal[0], width: 3 }, name: 'Screen' });
        bd(s, d.text, 0.4, 1.0, 4.75, 4.2, { valign: 'middle', ls: 1.22, max: 14 });
      },
      async (d) => { // the pocket console: green screen, one wide picture in its two inks, words beneath
        const s = gb(d);
        await k.photo(s, d.image, 0.4, 0.98, 9.2, 2.2, { pixel: 150, duo: ['0F380F', '9BBC0F'] });
        t.rect(s, 0.4, 0.98, 9.2, 2.2, null, { line: { color: LD, width: 3 }, name: 'Screen' });
        bd(s, d.text, 0.4, 3.26, 9.2, 1.98, { valign: 'middle', color: LD });
      },
      async (d) => { // the picture fills the page, a dark well with the words stands down the left, pieces falling at its edge
        const s = k.slide(BG), pw = 4.8;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, 0, 0, pw, 5.625, BG, { name: 'Well' });
        await tet(s, 'J', C.pal[1], pw + 0.1, 0.25, 0.42); await tet(s, 'S', C.pal[2], pw + 0.6, 4.3, 0.42);
        k.head(s, (d.title || '').toUpperCase(), 0.4, 0.2, 3.95, 1.0, { max: 19, min: 12, color: WH, font: F.head });
        bd(s, d.text, 0.4, 1.25, 4.05, 3.95, { valign: 'middle', max: 13 });
        t.rect(s, 8.0, 0.14, 1.7, 0.5, BG, { name: 'Score' }); k.txt(s, String(k.idx * 100).padStart(6, '0'), 8.1, 0.14, 1.5, 0.5, { size: 15, bold: true, font: F.head, color: C.pal[1], align: 'right', valign: 'middle' });
        k.foot(s, { x: 0.4, y: 5.32, w: 4.05, size: 6.5, color: C.muted });
      },
    ],
    cards: [
      async (d) => { // each idea has its own piece, a different shape, the icon on it
        const s = await pg(d), n = d.items.length, w = 9.2 / n, names = ['T', 'S', 'O', 'J'];
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, c = C.pal[[0, 2, 4, 5][i]], nm = names[i], cl = 0.42, wd = (Math.max(...SH[nm].map((p) => p[0])) + 1) * cl;
          await tet(s, nm, c, x + 0.08, 1.05, cl);
          if (nm === 'T') t.img(s, await k.icon(it.icon, DK, 2), x + 0.08 + cl + 0.05, 1.05 + 0.05, 0.32, 0.32);
          if (nm === 'S') t.img(s, await k.icon(it.icon, DK, 2), x + 0.08 + cl + 0.05, 1.05 + cl + 0.05, 0.32, 0.32);
          if (nm === 'O') t.img(s, await k.icon(it.icon, DK, 2), x + 0.08 + cl - 0.2, 1.05 + cl - 0.2, 0.4, 0.4);
          if (nm === 'J') t.img(s, await k.icon(it.icon, DK, 2), x + 0.08 + cl + 0.05, 1.05 + cl + 0.05, 0.32, 0.32);
          void wd;
          t.rect(s, x + 0.04, 2.42, w - 0.14, 2.8, BG, { name: 'Plate' });
          hd(s, it.h.toUpperCase(), x + 0.1, 2.44, w - 0.26, 0.62, { color: c, valign: 'top' });
          bd(s, it.t, x + 0.1, 3.08, w - 0.26, 2.1, { max: 12.5 });
        }
      },
      async (d) => { // game cartridges: a coloured label across the top of each
        const s = await pg(d), n = d.items.length, W = 4.5, H = 2.02, pos = n === 4 ? [[0.4, 1.0, W], [5.1, 1.0, W], [0.4, 3.14, W], [5.1, 3.14, W]] : [[0.4, 1.0, W], [5.1, 1.0, W], [0.4, 3.14, 9.2]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w] = pos[i], c = C.pal[[2, 0, 3, 5][i]], ink = darkOn(c) ? DK : WH;
          t.rect(s, x, y, w, H, C.field, { line: { color: c, width: 2 }, name: 'Cartridge' });
          t.rect(s, x, y, w, 0.5, c, { name: 'Label' });
          t.img(s, await k.icon(it.icon, ink, 2), x + 0.12, y + 0.08, 0.34, 0.34);
          hd(s, it.h.toUpperCase(), x + 0.56, y, w - 0.7, 0.5, { color: ink });
          bd(s, it.t, x + 0.15, y + 0.58, w - 0.3, H - 0.66, { max: 13 });
        }
      },
      async (d) => { // the pocket console: a menu, the cursor at the first line
        const s = gb(d), n = d.items.length, rh = 4.3 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 0.95 + i * rh;
          k.txt(s, i ? ' ' : '>', 0.4, y, 0.4, rh, { size: 26, bold: true, font: F.head, color: LD, valign: 'middle', ls: 1 });
          t.rect(s, 0.85, y + rh / 2 - 0.3, 0.6, 0.6, LD, { name: 'Tile' });
          t.img(s, await k.icon(it.icon, LCD, 2), 0.98, y + rh / 2 - 0.17, 0.34, 0.34);
          hd(s, it.h.toUpperCase(), 1.6, y + 0.03, 2.6, rh - 0.06, { color: LD });
          bd(s, it.t, 4.3, y + 0.03, 5.3, rh - 0.06, { color: LD, valign: 'middle', max: 13 });
          if (i) t.rect(s, 0.85, y, 8.75, 0.02, LM, { name: 'Rule' });
        }
      },
      async (d) => { // tall bright pieces falling side by side, each caught at a different height
        const s = await pg(d), n = d.items.length, gap = 0.12, w = (9.2 - gap * (n - 1)) / n, drop = [0.42, 0, 0.28, 0.1], h = 3.75;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * (w + gap), y = 1.02 + drop[i], c = C.pal[[0, 1, 2, 4][i]];
          t.rect(s, x, y, w, h, c, { name: 'Piece' }); t.line(s, x, y + 0.03, w, 0, 'FFFFFF', 2, { t: 40 });
          t.img(s, await k.icon(it.icon, DK, 2), x + 0.13, y + 0.13, 0.36, 0.36);
          hd(s, it.h.toUpperCase(), x + 0.13, y + 0.54, w - 0.26, 0.62, { color: DK, valign: 'top' });
          bd(s, it.t, x + 0.13, y + 1.18, w - 0.26, h - 1.26, { color: DK, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // pieces pile up in a stair toward the right, one colour to a step
        const s = await pg(d, { w: 7.6 }), n = d.steps.length, w = 10 / n, rise = n === 4 ? 0.34 : 0.48, y0 = 1.0 + (n - 1) * rise, ix = [4, 0, 1, 5];
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, y = y0 - i * rise, c = C.pal[ix[i]];
          t.rect(s, x, y, w, 5.24 - y, c, { line: { color: BG, width: 1.5 }, name: 'Stack' }); t.line(s, x, y + 0.03, w, 0, 'FFFFFF', 2, { t: 40 });
          k.txt(s, String(i + 1), x + 0.18, y + 0.06, 0.7, 0.55, { size: 26, bold: true, font: F.head, color: DK, valign: 'middle', ls: 1 });
          hd(s, st.h.toUpperCase(), x + 0.18, y + 0.62, w - 0.34, 0.6, { color: DK, valign: 'top', max: 12.5 });
          bd(s, st.t, x + 0.18, y + 1.24, w - 0.34, 5.2 - y - 1.24, { color: DK, max: 13 });
        }
      },
      async (d) => { // one straight piece drops down the middle of the page, steps go out on each side
        const s = await pg(d), n = d.steps.length, rh = 4.25 / n, w = 4.05, cell = Math.min(0.5, rh - 0.12);
        for (const [i, st] of d.steps.entries()) {
          const y = 0.97 + i * rh, right = i % 2 === 1, x = right ? 5.5 : 0.45, a = right ? 'left' : 'right', c = C.pal[[0, 2, 1, 4][i]], cy = y + (rh - cell) / 2;
          t.rect(s, 4.93, y, 0.14, rh, C.grid, { name: 'Line' });
          await tet(s, [[0, 0]], c, 5 - cell / 2, cy, cell);
          k.txt(s, String(i + 1), 5 - cell / 2, cy, cell, cell, { size: 15, bold: true, font: F.head, color: DK, align: 'center', valign: 'middle', ls: 1 });
          t.rect(s, x - 0.05, y + 0.02, w + 0.1, rh - 0.06, BG, { name: 'Plate' });
          hd(s, st.h.toUpperCase(), x, y + 0.03, w, 0.34, { color: c, align: a });
          bd(s, st.t, x, y + 0.37, w, rh - 0.44, { align: a, max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // the pocket console: dark squares joined in a row, the words beneath each
        const s = gb(d), n = d.steps.length, w = 9.2 / n, dd = 0.82;
        t.rect(s, 0.4, 1.38, 9.2, 0.06, LD, { name: 'Line' });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w;
          t.rect(s, x, 1.0, dd, dd, LD, { name: 'Tile' });
          k.txt(s, String(i + 1), x, 1.0, dd, dd, { size: 30, bold: true, font: F.head, color: LCD, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h.toUpperCase(), x, 1.92, w - 0.18, 0.62, { color: LD, valign: 'top' });
          bd(s, st.t, x, 2.56, w - 0.18, 2.66, { color: LD, max: 13.5 });
        }
      },
      async (d) => { // the square piece at the centre has one numbered cell for each step, words at its corners
        const s = await pg(d), n = d.steps.length, cl = 0.95, cx = 5, cy = 3.08, W = 3.15, H = 2.0, pos = [[0.4, 1.02, 0], [6.45, 1.02, 1], [6.45, 3.16, 1], [0.4, 3.16, 0]], order = [[0, 0], [1, 0], [1, 1], [0, 1]], ix = [0, 1, 2, 4];
        for (const [i, st] of d.steps.entries()) {
          const [x, y, right] = pos[i], [a, b] = order[i], c = C.pal[ix[i]], al = right ? 'left' : 'right';
          await tet(s, [[0, 0]], c, cx - cl + a * cl, cy - cl + b * cl, cl);
          k.txt(s, String(i + 1), cx - cl + a * cl, cy - cl + b * cl, cl, cl, { size: 30, bold: true, font: F.head, color: DK, align: 'center', valign: 'middle', ls: 1 });
          t.rect(s, x - 0.04, y, W + 0.08, H, BG, { name: 'Plate' });
          hd(s, st.h.toUpperCase(), x, y + 0.03, W, 0.56, { color: c, align: al });
          bd(s, st.t, x, y + 0.6, W, H - 0.64, { align: al, max: 12, ls: 1.1 });
        }
        if (n === 3) t.rect(s, cx - cl, cy, cl - 0.02, cl - 0.02, C.grid, { name: 'Empty' });
      },
    ],
    stats: [
      async (d) => { // the high score: one figure at full size in a neon box, two below it, the note beside
        const s = await pg(d), [a, ...rest] = d.stats, w = 5.6;
        t.rect(s, 0.4, 1.0, w, 2.3, BG, { line: { color: C.pal[1], width: 3 }, name: 'Score' });
        hd(s, a.value, 0.55, 1.08, w - 0.3, 1.35, { max: 62, min: 26, color: C.pal[1] });
        bd(s, a.label, 0.55, 2.46, w - 0.3, 0.76, { max: 13 });
        rest.forEach((v, i) => { const x = 0.4 + i * 2.87, c = C.pal[i ? 4 : 0]; t.rect(s, x, 3.42, 2.73, 1.8, BG, { line: { color: c, width: 2 }, name: 'Score' }); hd(s, v.value, x + 0.1, 3.47, 2.53, 0.85, { max: 30, min: 15, color: c }); bd(s, v.label, x + 0.1, 4.34, 2.53, 0.82, { max: 12, ls: 1.08 }); });
        t.rect(s, 6.2, 1.0, 3.4, 4.22, BG, { name: 'Plate' });
        await tet(s, 'T', C.pal[3], 6.35, 1.12, 0.36);
        if (d.note) bd(s, d.note, 6.35, 1.95, 3.1, 3.2, { color: C.muted, italic: true, max: 13.5 });
      },
      async (d) => { // three big square pieces in bright colour, the figure cut into each
        const s = await pg(d), w = 9.2 / 3, dd = 2.1, ix = [0, 1, 4];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2, c = C.pal[ix[i]], y = 1.0 + [0.15, 0, 0.15][i];
          await tet(s, [[0, 0]], c, cx - dd / 2, y, dd);
          hd(s, v.value, cx - dd / 2 + 0.08, y + 0.28, dd - 0.16, 0.9, { max: 32, min: 15, color: DK, align: 'center' });
          bd(s, v.label, cx - dd / 2 + 0.12, y + 1.18, dd - 0.24, 0.82, { color: DK, align: 'center', max: 12, ls: 1.05 });
        }
        t.rect(s, 0.4, 3.4, 9.2, 1.82, BG, { name: 'Plate' });
        if (d.note) bd(s, d.note, 0.55, 3.45, 8.9, 1.72, { valign: 'middle', align: 'center', italic: true, color: C.muted, max: 14 });
      },
      async (d) => { // the pocket console: a score table with dots leading to the value
        const s = gb(d);
        for (const [i, v] of d.stats.entries()) {
          const y = 0.98 + i * 0.98;
          k.txt(s, String(i + 1), 0.4, y, 0.5, 0.9, { size: 26, bold: true, font: F.head, color: LD, valign: 'middle' });
          bd(s, v.label, 0.95, y, 4.9, 0.9, { color: LD, valign: 'middle', max: 13.5 });
          hd(s, v.value, 5.95, y, 3.65, 0.9, { color: LD, max: 34, min: 16, align: 'right' });
          t.line(s, 0.4, y + 0.94, 9.2, 0, LM, 1, { dash: 'sysDot' });
        }
        if (d.note) bd(s, d.note, 0.4, 3.98, 9.2, 1.26, { color: LD, valign: 'middle', italic: true });
      },
    ],
    compare: [
      async (d) => { // two players, two wells: a column of blocks between them, the sides mirrored
        const s = await pg(d);
        for (let y = 0.95; y < 5.15; y += SQ) await tet(s, [[0, 0]], C.pal[Math.round(y * 10) % 6], 5 - SQ / 2, y, SQ);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.3 : 0.3, w = 4.4, a = i ? 'left' : 'right', c = C.pal[i ? 4 : 2], rh = 3.45 / sd.items.length;
          t.rect(s, x, 1.0, w, 4.22, BG, { name: 'Well' });
          hd(s, sd.h.toUpperCase(), x + 0.12, 1.04, w - 0.24, 0.58, { color: c, align: a, max: 15 });
          sd.items.forEach((it, j) => bd(s, it, x + 0.12, 1.68 + j * rh, w - 0.24, rh - 0.05, { align: a, valign: 'middle', max: 13.5 }));
        }
      },
      async (d) => { // two thick lines of blocks fill the page, one above the other, words printed across them
        const s = await pg(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.0 + i * 2.14, h = 2.06, c = C.pal[i ? 4 : 1], m = sd.items.length, rows = Math.ceil(m / 2), rw = 3.5, rh = (h - 0.1) / rows;
          t.rect(s, 0, y, 10, h, c, { name: 'Line' }); for (let x = SQ; x < 10; x += SQ) t.line(s, x, y, 0, h, '000000', 0.5, { t: 80 }); t.line(s, 0, y + 0.03, 10, 0, 'FFFFFF', 2, { t: 40 });
          hd(s, sd.h.toUpperCase(), 0.3, y + 0.05, 2.05, h - 0.1, { color: DK, max: 15, min: 11 });
          sd.items.forEach((it, j) => bd(s, it, 2.5 + (j % 2) * (rw + 0.1), y + 0.05 + Math.floor(j / 2) * rh, rw, rh, { color: DK, valign: 'middle', max: 13, ls: 1.08 }));
        }
      },
    ],
    statement: [
      async (d) => { // the pocket console: the thought in large dark type, the small print below a thick line
        const s = gb(d);
        k.head(s, L.runs(d.text), 0.4, 0.92, 9.2, 2.7, { max: 30, min: 15, color: LD, font: F.head });
        t.rect(s, 0.4, 3.68, 9.2, 0.08, LD, { name: 'Rule' });
        if (d.caption) bd(s, d.caption, 0.4, 3.82, 9.2, 1.42, { color: LD, max: 13 });
      },
      async (d) => { // the line is about to clear: a white band holds the thought, the stack waits beneath
        const s = await pg(d);
        t.rect(s, 0, 1.0, 10, 2.55, 'FFFFFF', { name: 'Clear' });
        k.head(s, L.runs(d.text), 0.5, 1.05, 9.0, 2.45, { max: 28, min: 14, color: DK, font: F.head, align: 'center' });
        t.rect(s, 0, 3.6, 10, 0.32, C.pal[0], { name: 'Line' }); for (let x = SQ; x < 10; x += SQ) t.line(s, x, 3.6, 0, 0.32, '000000', 0.75, { t: 70 });
        if (d.caption) bd(s, d.caption, 0.5, 3.98, 9.0, 1.24, { align: 'center', valign: 'middle', max: 13 });
      },
    ],
    timeline: [
      async (d) => { // four pieces lie along one line of the field, the record above or below them by turns
        const s = await pg(d), ax = 3.12, xs = [0.4, 2.55, 4.65, 6.55], w = 3.05, nm = ['T', 'S', 'O', 'J'];
        t.rect(s, 0, ax - 0.03, 10, 0.06, C.pal[3], { name: 'Line' });
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, c = C.pal[[0, 2, 1, 4][i]], y = up ? 0.98 : ax + 0.12, h = 1.98;
          t.rect(s, x, y, w, h, BG, { line: { color: c, width: 1.5 }, name: 'Plate' });
          t.rect(s, x, y, w, 0.4, c, { name: 'Head' });
          hd(s, it.year, x + 0.08, y, 1.75, 0.4, { color: DK, max: 13.5 });
          hd(s, it.h.toUpperCase(), x + 0.08, y + 0.42, w - 0.16, 0.3, { color: c, max: 11.5 });
          bd(s, it.t, x + 0.08, y + 0.72, w - 0.16, h - 0.76, { max: 12, ls: 1.05 });
          void nm;
        }
      },
      async (d) => { // the pocket console: a list of stages down the screen, the year in reverse
        const s = gb(d), rh = 4.32 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = 0.94 + i * rh;
          t.rect(s, 0.4, y + 0.08, 1.75, rh - 0.16, LD, { name: 'Tile' });
          hd(s, it.year, 0.45, y + 0.08, 1.65, rh - 0.16, { color: LCD, align: 'center', max: 14 });
          hd(s, it.h.toUpperCase(), 2.3, y + 0.06, 7.3, 0.32, { color: LD, max: 12.5 });
          bd(s, it.t, 2.3, y + 0.38, 7.3, rh - 0.44, { color: LD, max: 13, ls: 1.08 });
        }
      },
      async (d) => { // four periods in quarters of the field, a bright corner piece holding each year
        const s = await pg(d), W = 4.5, H = 2.03, ix = [2, 0, 1, 4];
        for (const [i, it] of d.items.entries()) {
          const x = i % 2 ? 5.1 : 0.4, y = i < 2 ? 1.0 : 3.14, c = C.pal[ix[i]];
          t.rect(s, x, y, W, H, BG, { name: 'Plate' });
          t.rect(s, x, y, 1.9, 0.56, c, { name: 'Corner' }); t.line(s, x, y + 0.02, 1.9, 0, 'FFFFFF', 1.5, { t: 40 });
          hd(s, it.year, x + 0.06, y, 1.78, 0.56, { color: DK, max: 15, align: 'center' });
          hd(s, it.h.toUpperCase(), x + 2.0, y, W - 2.05, 0.56, { color: c, max: 12 });
          bd(s, it.t, x + 0.1, y + 0.62, W - 0.2, H - 0.66, { max: 13, ls: 1.1 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old stack of full lines was the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Bloklar', colors: { dk1: C.bg, lt1: C.ink, dk2: C.field, lt2: C.muted, accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[4], accent6: C.pal[5], hlink: C.pal[0], folHlink: C.muted } });
}
module.exports = { id: 147, slug: 'bloklar', name: 'Bloklar', category: 'creative', photos: true, build, style: { tone: "o'yin ruhi: har bir yutuq 'to'ldirilgan qator', qisqa va g'ayratli", limits: { title: 45, card_h: 18, step_h: 18 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "energetic"], "transitions": ["push:d", "cut", "checker"], "cover": ["bounceDrop", "drop"], "mark": "bounceDrop", "deco": "bounceDrop", "sig": {"title": "bounceDrop", "body": "drop", "item": "bounceDrop", "image": "drop", "number": "bounceDrop", "order": "diagonal", "stagger": 0.09}, "tempo": 0.8, "kenburns": false};
