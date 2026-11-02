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
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Krossvord', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: C.paper, accent1: C.accent, accent2: C.ink, accent3: 'B91C1C', accent4: '047857', accent5: C.muted, accent6: 'CCCCCC', hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 125, slug: 'krossvord', name: 'Krossvord', category: 'creative', photos: true, build, style: { tone: "jumboq kabi qiziqarli: kalit so'zlar, aniq ta'riflar, o'quvchini o'ylashga undovchi", limits: {}, prefer: 'text' } };
