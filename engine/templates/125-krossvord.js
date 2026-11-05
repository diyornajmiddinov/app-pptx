/**
 * 125 Krossvord — a crossword puzzle page: a black-and-white letter grid spells the first word of the title,
 * ideas are written as numbered CLUES (→ across, ↓ down) in a puzzle-column font; answers sit in grid cells.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FDFDFB', ink: '111111', muted: '555555', block: '111111', accent: '1E40AF', cell: 'FFFFFF' };
const F = { head: 'Georgia', body: 'Georgia' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const word = (str) => (String(str).toUpperCase().replace(/[^A-ZА-ЯЁЎҚҒҲ0-9%]/g, ' ').trim().split(/\s+/).sort((a, b) => b.length - a.length)[0] || 'SLIDE').slice(0, 7);
  // 7x7 grid: blocks pattern + the answer written across the middle row
  const grid = (s, x, y, cs, ans, n = 7) => { const pat = ['1001001', '0000000', '0101010', '0000000', '0100010', '0000000', '1001001'];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const blk = pat[r][c] === '1' && r !== 3; t.rect(s, x + c * cs, y + r * cs, cs, cs, blk ? C.block : C.cell, { line: { color: C.ink, width: 0.75 }, name: 'Cell' }); }
    [...ans].forEach((ch, i) => k.txt(s, ch, x + i * cs, y + 3 * cs, cs, cs, { size: Math.round(cs * 34), bold: true, font: 'Arial', color: C.accent, align: 'center', valign: 'middle' }));
    k.txt(s, '1', x + 0.02, y + 3 * cs, 0.3, 0.2, { size: 7, color: C.muted }); };
  const page = (d, ans) => { const s = k.slide(C.paper); grid(s, 0.4, 1.3, 0.5, ans || word(d.title || '')); if (d.title) k.head(s, d.title, 0.4, 0.3, 8.0, 0.7, { max: 26, min: 14 }); k.txt(s, `\u2116 ${k.idx}`, 8.5, 0.3, 1.1, 0.7, { size: 16, bold: true, align: 'right', valign: 'middle', color: C.accent }); t.line(s, 0.4, 1.08, 9.2, 0, C.ink, 2); k.foot(s, { y: 5.3, size: 7.5 }); return s; };
  const X = 4.2, W = 5.35, Y = 1.3, Hc = 3.85;
  // clues column: "1 →  Header. text"
  const clues = (s, list) => { const n = list.length, rh = Hc / n; list.forEach(([hd, tx], i) => k.txt(s, [{ text: `${i + 1} ${i % 2 ? '\u2193' : '\u2192'}  `, options: { bold: true, color: C.accent, font: 'Arial' } }, { text: hd, options: { bold: true } }, { text: tx ? '. ' + tx : '' }], X, Y + i * rh, W, rh, { max: 14, min: 9, ls: 1.2, valign: 'middle' })); };
  const R = {
    async cover(d) { const s = k.slide(C.paper); grid(s, 5.75, 0.55, 0.55, word(d.title)); if (d.image) { await k.photo(s, d.image, 5.75 + 0.55 * 4, 0.55 + 0.55 * 4, 1.65, 1.65, { gray: true }); }
      k.txt(s, k.org3, 0.5, 0.6, 5.0, 0.35, { size: 12, italic: true, color: C.muted }); k.head(s, d.title, 0.5, 1.0, 5.0, 2.4, { max: 38, min: 18, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.8, 0.75, { max: 13, italic: true, color: C.muted }); k.txt(s, [{ text: '1 \u2192 ', options: { color: C.accent, bold: true } }, { text: k.M.author || '' }], 0.5, 4.3, 4.8, 0.45, { size: 15, bold: true }); k.foot(s, { y: 5.3, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0.4 + 0.5 * 4, 1.3 + 0.5 * 4, 1.5, 1.5, { gray: true }); k.txt(s, d.text, X, Y, W, Hc, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); clues(s, d.items.map((it) => [it, ''])); },
    async cards(d) { const s = page(d); clues(s, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d); clues(s, d.steps.map((st) => [st.h, st.t])); },
    async stats(d) { const s = page(d, word(d.stats[0].value)); const n = d.stats.length, rh = (d.note ? 3.2 : Hc) / n; d.stats.forEach((v, i) => { const y = Y + i * rh; k.head(s, v.value, X, y, 1.8, rh, { max: 34, min: 14, color: C.accent, font: 'Arial' }); k.txt(s, v.label, X + 1.9, y, W - 1.9, rh, { max: 13, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, X, 4.55, W, 0.6, { max: 9, italic: true, color: C.muted }); },
    async compare(d) { const s = page(d), w = 2.55, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.1, 3.3);
      [d.left, d.right].forEach((sd, i) => { const x = X + i * 2.8; k.txt(s, [{ text: i ? '\u2193  ' : '\u2192  ', options: { color: C.accent, font: 'Arial' } }, { text: sd.h }], x, Y, w, 0.45, { size: 14, bold: true }); let y = Y + 0.55; sd.items.forEach((it, j) => { k.txt(s, `${j + 1}. ${it}`, x, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), X, Y, W, 2.5, { max: 28, min: 14 }); if (d.caption) k.txt(s, d.caption, X, Y + 2.6, W, 1.25, { max: 12, italic: true, color: C.muted }); },
    async timeline(d) { const s = page(d, word(d.items[0].year)); clues(s, d.items.map((it) => [`${it.year} \u2014 ${it.h}`, it.t])); },
    async quote(d) { const s = page({}, word(d.author || 'QUOTE')); k.head(s, `\u201C${d.text}\u201D`, X, Y, W, 2.8, { max: 26, min: 13, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, X, Y + 2.9, W, 0.45, { size: 14, bold: true, color: C.accent }); },
    async sources(d) { const s = page(d); clues(s, d.items.map((it) => [it, ''])); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all on the puzzle sheet: a deck's pages must not look alike (L.pages)
  const NIGHT = '111111', PALE = 'D6DEF5', ICE = '93B4FF', GREY = 'BDBDBD';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.18, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const pg = (d, o = {}) => { // puzzle sheet; o.night = the inverted sheet, white words on black
    const s = k.slide(o.night ? NIGHT : C.paper), tb = o.title || {}, ink = o.night ? 'FFFFFF' : C.ink;
    if (d.title) k.head(s, d.title, tb.x ?? 0.4, tb.y ?? 0.3, tb.w ?? 8.0, tb.h ?? 0.7, { max: tb.max ?? 26, min: 14, color: ink });
    k.txt(s, `№ ${k.idx}`, 8.5, 0.3, 1.1, 0.7, { size: 16, bold: true, align: 'right', valign: 'middle', color: o.night ? ICE : C.accent });
    if (!o.noRule) t.line(s, 0.4, 1.08, 9.2, 0, ink, 2);
    if (!o.noFoot) k.foot(s, { y: 5.3, size: 7.5, ...(o.night ? { color: GREY } : {}) });
    return s;
  };
  const cell = (s, x, y, c, o = {}) => t.rect(s, x, y, o.w ?? c, c, o.fill ?? C.cell, { line: { color: o.line ?? C.ink, width: 0.75 }, name: 'Cell' });
  const mark = (s, v, x, y, c, o = {}) => { cell(s, x, y, c, o); k.txt(s, String(v), x, y, o.w ?? c, c, { size: o.size ?? Math.round(c * 38), bold: true, font: 'Arial', color: o.color ?? C.accent, align: 'center', valign: 'middle', ls: 1 }); };
  // a word written into a row of cells, as an answer is; a gap in the word is a black cell
  const spell = (s, str, x, y, cMax, wMax, o = {}) => { const ch = [...String(str).toUpperCase()], c = Math.min(cMax, wMax / ch.length); ch.forEach((a, i) => { if (a === ' ') cell(s, x + i * c, y, c, { fill: C.block, line: o.line }); else mark(s, a, x + i * c, y, c, { size: Math.max(7, Math.round(c * 36)), color: o.color, fill: o.fill, line: o.line }); }); return c; };
  // a run of cells with a black one every few: the puzzle's own ruler
  const strip = (s, x, y, c, n, o = {}) => { for (let i = 0; i < n; i++) { const b = (i * 5 + (o.seed ?? 2)) % 4 === 0; if (o.down) cell(s, x, y + i * c, c, { fill: b ? (o.black ?? C.block) : C.cell, line: o.line }); else cell(s, x + i * c, y, c, { fill: b ? (o.black ?? C.block) : C.cell, line: o.line }); } };
  const net = (w, h, c, blocks, o = {}) => { let g = ''; for (let x = 0; x <= w; x += c) g += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#111" stroke-width="${o.sw ?? 2}"/>`; for (let y = 0; y <= h; y += c) g += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#111" stroke-width="${o.sw ?? 2}"/>`; for (const [a, b] of blocks) g += `<rect x="${a * c}" y="${b * c}" width="${c}" height="${c}" fill="#111"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${g}</svg>`; };
  const V = {
    image: [
      async (d) => { // the picture across the top, cut into cells with black blocks at both ends
        const s = k.slide(C.paper), hh = 2.7;
        await k.photo(s, d.image, 0, 0, 10, hh);
        t.img(s, await k.svg('netTop', net(1600, 432, 72, [[0, 0], [1, 0], [0, 1], [21, 0], [20, 0], [21, 1], [21, 5], [0, 5], [10, 5], [11, 5]]), 1600, 432), 0, 0, 10, hh);
        k.head(s, d.title || '', 0.4, hh + 0.08, 8.0, 0.62, { max: 24, min: 14 });
        k.txt(s, `№ ${k.idx}`, 8.5, hh + 0.08, 1.1, 0.62, { size: 16, bold: true, align: 'right', valign: 'middle', color: C.accent });
        t.line(s, 0.4, hh + 0.72, 9.2, 0, C.ink, 2);
        bd(s, d.text, 0.4, hh + 0.8, 9.2, 5.22 - hh - 0.8, { max: 13.5 });
        k.foot(s, { y: 5.3, size: 7.5 });
      },
      async (d) => { // the picture stands at the right, black blocks climb its edge like a stair
        const s = k.slide(C.paper), x = 5.5, cs = 0.5625;
        await k.photo(s, d.image, x, 0, 10 - x, 5.625);
        const st = []; for (let r = 0; r < 10; r++) for (let c = 0; c < 8; c++) if (c < 3 - Math.abs(r - 4.5) * 0.8) st.push([c, r]);
        t.img(s, await k.svg('netStair', net(720, 900, 90, st), 720, 900), x, 0, 10 - x, 5.625);
        k.txt(s, `№ ${k.idx}`, 0.4, 0.3, 1.2, 0.4, { size: 16, bold: true, color: C.accent });
        k.head(s, d.title || '', 0.4, 0.7, 4.8, 1.15, { max: 26, min: 14, valign: 'top' });
        t.line(s, 0.4, 1.9, 4.8, 0, C.ink, 2);
        bd(s, d.text, 0.4, 2.0, 4.8, 3.2, { max: 13.5, ls: 1.25 });
        k.foot(s, { y: 5.3, size: 7, w: 4.9 });
      },
      async (d) => { // two words crossing: the picture is cut to the shape of the puzzle's cross
        const s = k.slide(C.paper), D = 4.9, x = 0.35, y = 0.35, a = 2 / 6, b = 4 / 6;
        const poly = [[a, 0], [b, 0], [b, a], [1, a], [1, b], [b, b], [b, 1], [a, 1], [a, b], [0, b], [0, a], [a, a]];
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: { poly } }), x, y, D, D, { alt: '' });
        const P = 720, c = P / 6; let g = ''; for (const [cx, cy] of [[2, 0], [3, 0], [2, 1], [3, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [2, 4], [3, 4], [2, 5], [3, 5]]) g += `<rect x="${cx * c}" y="${cy * c}" width="${c}" height="${c}" fill="none" stroke="#111" stroke-width="2.5"/>`;
        t.img(s, await k.svg('netCross', `<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${P}">${g}</svg>`, P, P), x, y, D, D);
        k.txt(s, `№ ${k.idx}`, 8.5, 0.3, 1.1, 0.5, { size: 16, bold: true, align: 'right', valign: 'middle', color: C.accent });
        k.head(s, d.title || '', 5.5, 0.3, 3.0, 1.25, { max: 22, min: 13, valign: 'top' });
        t.line(s, 5.5, 1.6, 4.1, 0, C.ink, 2);
        bd(s, d.text, 5.5, 1.7, 4.1, 3.5, { max: 13, ls: 1.2 });
        k.foot(s, { x: 5.5, y: 5.3, size: 7, w: 4.1 });
      },
      async (d) => { // the picture fills the sheet, a torn-out clue slip lies on it
        const s = k.slide(NIGHT), px = 5.3;
        await k.photo(s, d.image, 0, 0, 10, 5.22);
        t.rect(s, 0, 5.22, 10, 0.405, NIGHT, { name: 'Band' });
        t.rect(s, px, 0.4, 4.3, 4.45, C.paper, { line: { color: C.ink, width: 1 }, shadow: 0.35, name: 'Slip' });
        t.rect(s, px, 0.4, 4.3, 0.98, NIGHT, { name: 'Slip head' });
        k.head(s, d.title || '', px + 0.15, 0.42, 3.3, 0.94, { max: 20, min: 13, color: 'FFFFFF' });
        k.txt(s, `№ ${k.idx}`, px + 3.45, 0.42, 0.72, 0.94, { size: 14, bold: true, align: 'right', valign: 'middle', color: ICE });
        bd(s, d.text, px + 0.18, 1.45, 3.94, 3.33, { max: 13 });
        strip(s, 0.4, 4.92, 0.3, 16, { seed: 1 });
        k.foot(s, { y: 5.32, size: 7.5, color: GREY, w: 9.2 });
      },
    ],
    cards: [
      async (d) => { // each idea a big numbered cell of the grid
        const s = pg(d), n = d.items.length;
        for (const [i, it] of d.items.entries()) {
          const w = n === 4 ? 4.54 : 2.98, h = n === 4 ? 1.92 : 3.92, x = 0.4 + (n === 4 ? i % 2 : i) * (w + 0.12), y = 1.24 + (n === 4 ? Math.floor(i / 2) : 0) * (h + 0.08);
          t.rect(s, x, y, w, h, C.cell, { line: { color: C.ink, width: 1.25 }, name: 'Big cell' });
          t.rect(s, x, y, 0.44, 0.44, C.block, { name: 'Number' });
          k.txt(s, String(i + 1), x, y, 0.44, 0.44, { size: 15, bold: true, font: 'Arial', color: 'FFFFFF', align: 'center', valign: 'middle' });
          if (n === 4) {
            hd(s, it.h, x + 0.54, y + 0.03, w - 1.1, 0.42);
            t.img(s, await k.icon(it.icon, C.accent, 2), x + w - 0.46, y + 0.07, 0.34, 0.34);
            bd(s, it.t, x + 0.14, y + 0.52, w - 0.28, h - 0.58);
          } else {
            t.img(s, await k.icon(it.icon, C.accent, 1.75), x + w / 2 - 0.3, y + 0.5, 0.6, 0.6);
            hd(s, it.h, x + 0.15, y + 1.18, w - 0.3, 0.55, { align: 'center' });
            bd(s, it.t, x + 0.15, y + 1.78, w - 0.3, h - 1.86, { align: 'center' });
          }
        }
      },
      async (d) => { // each heading written into the cells as an answer, its clue under it
        const s = pg(d), n = d.items.length, rh = 3.98 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.22 + i * rh;
          t.rect(s, 0.4, y + 0.04, 0.62, 0.62, C.block, { name: 'Block' });
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), 0.54, y + 0.18, 0.34, 0.34);
          spell(s, it.h, 1.18, y + 0.04, 0.3, 8.4);
          bd(s, it.t, 1.18, y + 0.38, 8.42, rh - 0.42, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // inverted sheet: each idea hangs from a down-word of white cells, the columns stepping
        const s = pg(d, { night: true }), n = d.items.length, w = 9.2 / n, drop = n === 4 ? [0, 0.42, 0.14, 0.56] : [0, 0.5, 0.18];
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, y = 1.28 + drop[i], c = 0.24, cnt = Math.floor((5.18 - y) / c);
          strip(s, x, y, c, cnt, { down: true, seed: i, black: '3A3A3A', line: '777777' });
          t.img(s, await k.icon(it.icon, ICE, 2), x + 0.34, y, 0.4, 0.4);
          hd(s, it.h, x + 0.34, y + 0.44, w - 0.46, 0.55, { color: 'FFFFFF', max: 14, valign: 'top' });
          bd(s, it.t, x + 0.34, y + 1.0, w - 0.46, 5.18 - y - 1.0, { color: PALE, max: 12.5 });
        }
      },
      async (d) => { // the grid in the middle of the sheet, the ideas are clues around it
        const s = pg(d), n = d.items.length, cs = 0.36, gx = 5 - 3.5 * cs, gy = 1.86, w = 3.1;
        grid(s, gx, gy, cs, word(d.title || ''));
        const spots = n === 4 ? [[0, 1.26], [0, 3.28], [1, 1.26], [1, 3.28]] : [[0, 1.26], [0, 3.28], [1, 2.1]], hh = 1.92;
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? 6.5 : 0.4, a = side ? 'left' : 'right', ty = y + 0.2, gxe = side ? gx + 7 * cs : gx;
          t.line(s, side ? gxe : x + w + 0.02, ty, side ? x - 0.02 - gxe : gx - x - w - 0.02, 0, C.accent, 1);
          t.img(s, await k.icon(it.icon, C.accent, 2), side ? x : x + w - 0.34, y + 0.03, 0.34, 0.34);
          hd(s, it.h, side ? x + 0.42 : x, y, w - 0.42, 0.42, { align: a, max: 14 });
          bd(s, it.t, x, y + 0.46, w, hh - 0.5, { align: a, max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // one long answer across the page: its numbered cells are the steps, arrows between them
        const s = pg(d), n = d.steps.length, w = 9.2 / n;
        t.rect(s, 0, 1.36, 10, 0.62, C.block, { name: 'Black row' });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w;
          mark(s, i + 1, x, 1.41, 0.52, { size: 20 });
          if (i < n - 1) k.txt(s, '→', x + 0.62, 1.36, w - 0.7, 0.62, { size: 18, bold: true, font: 'Arial', color: 'FFFFFF', valign: 'middle' });
          hd(s, st.h, x, 2.1, w - 0.2, 0.62, { valign: 'top' });
          bd(s, st.t, x, 2.74, w - 0.2, 2.44);
        }
      },
      async (d) => { // a black column holds the title; the steps run down a word of tall cells
        const s = k.slide(C.paper), n = d.steps.length, top = 0.34, rh = (5.2 - top) / n;
        t.rect(s, 0, 0, 3.3, 5.625, NIGHT, { name: 'Black column' });
        k.txt(s, `№ ${k.idx}`, 0.35, 0.3, 1.4, 0.4, { size: 16, bold: true, color: ICE });
        k.head(s, d.title || '', 0.35, 0.8, 2.65, 2.3, { max: 26, min: 14, color: 'FFFFFF', valign: 'top' });
        strip(s, 0.35, 4.9, 0.33, 8, { seed: 1, black: '3A3A3A', line: '777777' });
        for (const [i, st] of d.steps.entries()) {
          const y = top + i * rh;
          t.rect(s, 3.55, y, 0.6, rh, C.cell, { line: { color: C.ink, width: 1 }, name: 'Tall cell' });
          k.txt(s, String(i + 1), 3.55, y, 0.6, rh - 0.2, { size: 20, bold: true, font: 'Arial', color: C.accent, align: 'center', valign: 'middle' });
          if (i < n - 1) k.txt(s, '↓', 3.55, y + rh - 0.32, 0.6, 0.28, { size: 11, font: 'Arial', color: C.muted, align: 'center', valign: 'middle' });
          hd(s, st.h, 4.35, y + 0.02, 5.25, 0.38);
          bd(s, st.t, 4.35, y + 0.42, 5.25, rh - 0.46, { max: 13 });
        }
        k.foot(s, { x: 3.55, y: 5.3, size: 7.5, w: 6.05 });
      },
      async (d) => { // the clues step in to the right, line by line, as a diagonal of the grid
        const s = pg(d), n = d.steps.length, rh = 3.96 / n, ind = n === 4 ? 0.62 : 0.8;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * ind, y = 1.22 + i * rh;
          t.rect(s, x, y + 0.03, 0.5, 0.5, C.block, { name: 'Block' });
          k.txt(s, String(i + 1), x, y + 0.03, 0.5, 0.5, { size: 17, bold: true, font: 'Arial', color: 'FFFFFF', align: 'center', valign: 'middle' });
          if (i < n - 1) { t.line(s, x + 0.25, y + 0.53, 0, rh - 0.5, C.accent, 1.25); t.line(s, x + 0.25, y + rh + 0.28, ind - 0.25, 0, C.accent, 1.25); }
          const xx = x + 0.62, w = 9.6 - xx;
          hd(s, st.h, xx, y, w, 0.34);
          bd(s, st.t, xx, y + 0.36, w, rh - 0.4, { max: 12.5, ls: 1.1 });
        }
      },
      async (d) => { // inverted sheet: a down-word in the middle, steps by turns on its two sides
        const s = pg(d, { night: true }), n = d.steps.length, top = 1.28, rh = (5.14 - top) / n, xc = 5, c = 0.44, w = 4.1;
        for (let y = top; y < 5.14 - 0.01; y += 0.22) t.rect(s, xc - 0.11, y, 0.22, 0.22, '2A2A2A', { line: { color: '777777', width: 0.5 }, name: 'Cell' });
        for (const [i, st] of d.steps.entries()) {
          const y = top + i * rh, left = i % 2 === 0, x = left ? xc - c / 2 - 0.16 - w : xc + c / 2 + 0.16, a = left ? 'right' : 'left', hh = Math.min(rh * 1.7, 5.18 - y);
          mark(s, i + 1, xc - c / 2, y, c, { size: 16, line: 'FFFFFF' });
          hd(s, st.h, x, y, w, 0.38, { color: 'FFFFFF', align: a });
          bd(s, st.t, x, y + 0.4, w, hh - 0.42, { color: PALE, align: a, max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // three giant cells, the middle one a black block
        const s = pg(d), w = 3.0, h = d.note ? 2.92 : 3.86;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * (w + 0.1), y = 1.24, dark = i === 1;
          t.rect(s, x, y, w, h, dark ? C.block : C.cell, { line: { color: C.ink, width: 1.25 }, name: 'Big cell' });
          k.txt(s, String(i + 1), x + 0.08, y + 0.05, 0.4, 0.28, { size: 10, font: 'Arial', bold: true, color: dark ? GREY : C.muted });
          k.head(s, v.value, x + 0.12, y + 0.35, w - 0.24, 1.15, { max: 48, min: 20, font: 'Arial', align: 'center', color: dark ? 'FFFFFF' : C.accent });
          bd(s, v.label, x + 0.2, y + 1.55, w - 0.4, h - 1.62, { align: 'center', color: dark ? PALE : C.ink });
        }
        if (d.note) { k.txt(s, '*', 0.4, 4.24, 0.25, 0.3, { size: 14, bold: true, color: C.accent }); bd(s, d.note, 0.66, 4.24, 8.94, 0.96, { italic: true, color: C.muted, max: 12 }); }
      },
      async (d) => { // inverted sheet: the lead number spelled huge in cells, two smaller answers under it
        const s = pg(d, { night: true }), [a, ...rest] = d.stats, c = spell(s, a.value, 0.4, 1.28, 0.98, 6.0, { line: 'FFFFFF', size: 30 }), xl = 0.4 + [...String(a.value)].length * c + 0.25;
        bd(s, a.label, xl, 1.28, 9.6 - xl, 0.98, { color: 'FFFFFF', max: 15, valign: 'middle' });
        for (const [i, v] of rest.entries()) {
          const x = 0.4 + i * 4.7;
          spell(s, v.value, x, 2.72, 0.44, 4.4, { line: 'FFFFFF' });
          bd(s, v.label, x, 3.22, 4.4, 0.82, { color: PALE, max: 13 });
        }
        if (d.note) { t.line(s, 0.4, 4.12, 9.2, 0, '777777', 0.75); bd(s, d.note, 0.4, 4.2, 9.2, 0.98, { italic: true, color: GREY, max: 12 }); }
      },
    ],
    compare: [
      async (d) => { // a black down-word stands between the sides, the left mirrors the right
        const s = pg(d), w = 4.15, top = 1.86, c = 0.34, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.14, 5.18 - top);
        t.rect(s, 5 - c / 2 - 0.02, 1.22, c + 0.04, 3.96, C.block, { name: 'Black column' });
        k.head(s, `${d.left.h}  →`, 0.4, 1.24, w, 0.5, { max: 16, min: 12, align: 'right', color: C.accent });
        k.head(s, `↓  ${d.right.h}`, 5.45, 1.24, w, 0.5, { max: 16, min: 12 });
        const m = Math.max(d.left.items.length, d.right.items.length); let y = top;
        for (let j = 0; j < m; j++) {
          mark(s, j + 1, 5 - c / 2, y, c, { size: 12 });
          if (d.left.items[j]) k.txt(s, d.left.items[j], 0.4, y, w, rr[j], { size: fs, align: 'right', ls: 1 });
          if (d.right.items[j]) k.txt(s, d.right.items[j], 5.45, y, w, rr[j], { size: fs, ls: 1 });
          y += rr[j];
        }
      },
      async (d) => { // two rows of the puzzle laid one above the other: a white one and a black one
        const s = pg(d), y0 = 1.2, H = 1.96, bands = [[d.left, y0, false], [d.right, y0 + H + 0.06, true]];
        for (const [sd, y, dark] of bands) {
          t.rect(s, 0.4, y, 9.2, H, dark ? C.block : C.cell, { line: { color: C.ink, width: 1.25 }, name: 'Row' });
          k.txt(s, dark ? '↓' : '→', 0.55, y + 0.12, 0.5, 0.4, { size: 20, bold: true, font: 'Arial', color: dark ? ICE : C.accent });
          k.head(s, sd.h, 0.55, y + 0.56, 1.75, H - 0.68, { max: 16, min: 12, color: dark ? 'FFFFFF' : C.ink, valign: 'top' });
          const n = sd.items.length, w = 7.15 / n;
          for (const [j, it] of sd.items.entries()) {
            const x = 2.42 + j * w;
            mark(s, j + 1, x, y + 0.14, 0.3, { size: 11, line: dark ? 'FFFFFF' : C.ink });
            bd(s, it, x, y + 0.5, w - 0.14, H - 0.56, { color: dark ? PALE : C.ink, max: 12.5, ls: 1.1 });
          }
        }
      },
    ],
    statement: [
      async (d) => { // inverted sheet: the sentence alone, rows of cells close it above and below
        const s = pg(d, { night: true, noRule: true });
        strip(s, 0.4, 1.06, 0.3, 31, { seed: 3, black: '3A3A3A', line: '777777' });
        k.head(s, L.runs(d.text), 0.7, 1.45, 8.6, 1.95, { max: 30, min: 15, color: 'FFFFFF', align: 'center' });
        if (d.caption) bd(s, d.caption, 1.0, 3.45, 8.0, 1.3, { color: PALE, align: 'center', italic: true, max: 13 });
        strip(s, 0.4, 4.86, 0.3, 31, { seed: 0, black: '3A3A3A', line: '777777' });
      },
      async (d) => { // the sentence fills one great cell, the note reads down beside a word of cells
        const s = pg(d), w = 6.2, y = 1.24, h = 3.94;
        t.rect(s, 0.4, y, w, h, C.cell, { line: { color: C.ink, width: 2 }, name: 'Big cell' });
        t.rect(s, 0.4, y, 0.6, 0.6, C.block, { name: 'Number' });
        k.txt(s, '1', 0.4, y, 0.6, 0.6, { size: 20, bold: true, font: 'Arial', color: 'FFFFFF', align: 'center', valign: 'middle' });
        k.txt(s, '→', 1.1, y + 0.06, 0.6, 0.5, { size: 20, bold: true, font: 'Arial', color: C.accent, valign: 'middle' });
        k.head(s, L.runs(d.text), 0.72, y + 0.72, w - 0.64, h - 0.9, { max: 28, min: 15, color: C.accent });
        strip(s, 6.84, y, 0.28, 14, { down: true, seed: 2 });
        if (d.caption) bd(s, d.caption, 7.28, y, 2.32, h, { italic: true, color: C.muted, max: 12.5, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // the years are answers in one row of cells; the events above and below it by turns
        const s = pg(d), yA = 3.02, c = 0.25, w = 4.4; let g = 0.4;
        const cols = 37; for (let i = 0; i < cols; i++) cell(s, 0.4 + i * (9.2 / cols), yA, 9.2 / cols, { fill: C.block });
        for (const [i, it] of d.items.entries()) {
          const yx = 0.4 + i * 2.3, up = i % 2 === 0;
          spell(s, it.year, yx, yA, 9.2 / cols, 2.24);
          if (up) { const x = yx; t.line(s, x, 1.3, 0, yA - 1.3, C.accent, 1.25); hd(s, it.h, x + 0.12, 1.24, w - 0.12, 0.38); bd(s, it.t, x + 0.12, 1.64, w - 0.12, yA - 1.7, { max: 12.5 }); }
          else { const e = yx + 2.24, x = e - w; t.line(s, e, yA + 9.2 / cols, 0, 5.12 - yA - 9.2 / cols, C.accent, 1.25); hd(s, it.h, x, 3.36, w - 0.12, 0.38, { align: 'right' }); bd(s, it.t, x, 3.76, w - 0.12, 1.4, { align: 'right', max: 12.5 }); }
        }
      },
      async (d) => { // inverted sheet: white pillars of cells rise to the right, each year at a pillar's head
        const s = pg(d, { night: true, title: { w: 6.2, h: 0.72 }, noRule: true }), w = 2.25, tops = [2.72, 2.2, 1.68, 1.16];
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * (w + 0.0333), y = tops[i];
          t.rect(s, x, y, w, 5.18 - y, C.cell, { line: { color: '777777', width: 0.75 }, name: 'Pillar' });
          t.rect(s, x, y, w, 0.44, C.accent, { name: 'Year' });
          k.head(s, it.year, x + 0.08, y, w - 0.16, 0.44, { max: 17, min: 11, font: 'Arial', color: 'FFFFFF', align: 'center' });
          hd(s, it.h, x + 0.1, y + 0.48, w - 0.2, 0.34, { max: 13, min: 10 });
          bd(s, it.t, x + 0.1, y + 0.84, w - 0.2, 5.14 - y - 0.84, { max: 12 });
        }
      },
      async (d) => { // the events are lines of the clue list, each year written into cells at the line's right end
        const s = pg(d), rh = 3.96 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = 1.22 + i * rh, ch = [...String(it.year)].length, c = Math.min(0.3, 2.9 / ch), yw = c * ch;
          hd(s, `${i % 2 ? '↓' : '→'}  ${it.h}`, 0.4, y + 0.02, 6.3, 0.34);
          bd(s, it.t, 0.74, y + 0.36, 5.96, rh - 0.4, { max: 12.5, ls: 1.1 });
          spell(s, it.year, 9.6 - yw, y + 0.26, c, yw);
          if (i < 3) t.line(s, 0.4, y + rh - 0.01, 9.2, 0, 'CFCFCF', 0.75);
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Krossvord', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: C.paper, accent1: C.accent, accent2: C.ink, accent3: 'B91C1C', accent4: '047857', accent5: C.muted, accent6: 'CCCCCC', hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 125, slug: 'krossvord', name: 'Krossvord', category: 'creative', photos: true, build, style: { tone: "jumboq kabi qiziqarli: kalit so'zlar, aniq ta'riflar, o'quvchini o'ylashga undovchi", limits: {}, prefer: 'text' } };
