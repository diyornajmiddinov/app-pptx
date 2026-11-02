/**
 * 140 Tarozi — a BALANCE SCALE: a brass pillar and beam with two hanging pans; ideas are weighed — split
 * between the left and right pans, the statement sits on the fulcrum plate. Plum and brass on pale lilac.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F6F2F8', ink: '2A1B33', muted: '5E4F66', brass: 'B8860B', brass2: 'DAA520', plum: '4A1942', pan: 'FFFFFF' };
const F = { head: 'Georgia', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const scale = (s, tilt = 0) => { t.rect(s, 4.9, 1.25, 0.2, 3.9, C.brass, { name: 'Pillar' }); t.rect(s, 4.3, 5.05, 1.4, 0.12, C.brass, { name: 'Base' }); t.line(s, 1.25, 1.3 - tilt, 7.5, 2 * tilt || 0.001, C.brass, 4, { flipV: tilt > 0 }); t.oval(s, 4.85, 1.12, 0.3, 0.3, C.brass2);
    [[1.25, 1.3 - tilt], [8.75, 1.3 + tilt]].forEach(([x, y]) => { t.line(s, x, y, -0.95, 0.42, C.brass, 1, { flipH: true }); t.line(s, x, y, 0.95, 0.42, C.brass, 1); }); };
  // two pans (cards hanging from the beam ends): returns boxes
  const pans = (s, tilt = 0) => [[0.3, 1.72 - tilt], [7.8, 1.72 + tilt]].map(([x, y]) => { t.rect(s, x, y, 1.9, 0.08, C.brass, { name: 'Pan rim' }); return { x: x - 0.05, y: y + 0.12 }; });
  const page = (d, tilt = 0) => { const s = k.slide(C.bg); scale(s, tilt); if (d.title) k.head(s, d.title, 0.4, 0.2, 8.2, 0.75, { max: 24, min: 13, italic: true }); k.txt(s, String(k.idx), 8.9, 0.2, 0.7, 0.75, { size: 18, font: F.head, color: C.brass, align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5, w: 3.9 }); return s; };
  // split a list into the two pans: left = first half, right = second half; each pan is a column 4.2 wide
  const weigh = (s, list, draw) => { const n = list.length, half = Math.ceil(n / 2), cols = [list.slice(0, half), list.slice(half)]; cols.forEach((col, c) => { const x = c ? 5.35 : 0.3, w = 4.35, y0 = 1.95, H = 3.1; if (!col.length) return; const rh = H / col.length; t.rect(s, x, y0 - 0.05, w, H + 0.1, C.pan, { r: 0.08, line: { color: 'D9CCE3', width: 1 }, name: 'Pan' }); col.forEach((it, j) => { const i = c ? half + j : j; draw(i, x + 0.2, y0 + j * rh, w - 0.4, rh); if (j < col.length - 1) t.line(s, x + 0.2, y0 + (j + 1) * rh, w - 0.4, 0, 'E7DDEE', 0.75); }); }); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); scale(s, 0.18); pans(s, 0.18); if (d.image) await k.photo(s, d.image, 7.85, 2.05, 1.8, 1.8, { mask: 'circle' }); t.rect(s, 0.25, 1.95, 2.0, 1.8, C.plum, { r: 0.08, name: 'Weight' });
      k.txt(s, k.org3, 0.4, 0.3, 9.2, 0.35, { size: 12, bold: true, color: C.brass, align: 'center' }); k.head(s, d.title, 2.4, 3.7, 5.2, 1.0, { max: 30, min: 14, italic: true, align: 'center' }); k.txt(s, k.M.author || '', 0.3, 2.3, 1.9, 1.1, { max: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); if (d.subtitle) k.txt(s, d.subtitle, 2.4, 4.7, 5.2, 0.5, { max: 11, color: C.muted, align: 'center' }); k.foot(s, { y: 5.32, size: 7.5, w: 3.9 }); },
    async intro(d) { const s = page(d, -0.15); pans(s, -0.15); await k.photo(s, d.image, 0.3, 1.8, 3.5, 3.3, { mask: { r: 0.08 } }); t.rect(s, 5.35, 2.05, 4.35, 3.05, C.pan, { r: 0.08, name: 'Pan' }); k.txt(s, d.text, 5.55, 2.15, 3.95, 2.85, { max: 14, min: 9.5, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); weigh(s, d.items, (i, x, y, w, h) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 15 })); },
    async cards(d) { const s = page(d); weigh(s, d.items, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 14, color: C.plum }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async process(d) { const s = page(d, -0.12); weigh(s, d.steps, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.42, { max: 14, color: C.plum }); k.txt(s, d.steps[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async stats(d) { const s = page(d); weigh(s, d.stats, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, 1.6, h, { max: 36, min: 14, color: C.brass }); k.txt(s, d.stats[i].label, x + 1.7, y, w - 1.7, h, { max: 12, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, 5.35, 5.17, 4.35, 0.4, { max: 9, color: C.muted, valign: 'middle' }); },
    async compare(d) { const s = page(d, 0.12), w = 3.95, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.08, 2.5);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.35 : 0.3; t.rect(s, x, 1.95, 4.35, 3.15, C.pan, { r: 0.08, line: { color: 'D9CCE3', width: 1 }, name: 'Pan' }); k.head(s, sd.h, x + 0.2, 2.0, w, 0.45, { max: 15, color: i ? C.brass : C.plum }); let y = 2.5; sd.items.forEach((it, j) => { k.txt(s, `\u2022 ${it}`, x + 0.2, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); t.rect(s, 2.6, 2.0, 4.8, 2.4, C.plum, { r: 0.1, name: 'Plate' }); k.head(s, L.runs(d.text), 2.8, 2.05, 4.4, 2.3, { max: 24, min: 12, color: 'FFFFFF', align: 'center', italic: true }); if (d.caption) k.txt(s, d.caption, 2.6, 4.45, 4.8, 0.55, { max: 10, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d, -0.1); weigh(s, d.items, (i, x, y, w, h) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.42, { max: 14, color: C.plum }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async quote(d) { const s = page({}); t.rect(s, 1.5, 2.0, 7.0, 2.6, C.pan, { r: 0.1, line: { color: C.brass, width: 1.5 }, name: 'Plate' }); k.head(s, `\u201C${d.text}\u201D`, 1.8, 2.05, 6.4, 2.0, { max: 24, min: 12, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.8, 4.05, 6.4, 0.45, { size: 13, bold: true, color: C.brass, align: 'center' }); },
    async sources(d) { const s = page(d); weigh(s, d.items, (i, x, y, w, h) => k.txt(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Tarozi', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.plum, lt2: C.bg, accent1: C.plum, accent2: C.brass, accent3: C.brass2, accent4: '7A3E73', accent5: C.muted, accent6: 'D9CCE3', hlink: C.plum, folHlink: C.muted } });
}
module.exports = { id: 140, slug: 'tarozi', name: 'Tarozi', category: 'academic', photos: true, build, style: { tone: "adolatli muvozanat: ikki tomon dalillari, xolis tortish va asosli xulosa", limits: {}, prefer: 'text' } };
