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
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Domino', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.table, lt2: C.tile, accent1: C.accent, accent2: '1D4E89', accent3: 'F1C40F', accent4: '2A9D8F', accent5: C.muted, accent6: C.line, hlink: '1D4E89', folHlink: C.muted } });
}
module.exports = { id: 130, slug: 'domino', name: 'Domino', category: 'creative', photos: true, build, style: { tone: "zanjir reaksiya: har bir fikr keyingisini boshlaydi; aniq, ketma-ket, sabab-oqibatli", limits: { card_t4: 110, step_t: 110 }, prefer: null } };
