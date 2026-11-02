/**
 * 138 Tangram — the seven tangram pieces (two big triangles, medium triangle, two small triangles, square,
 * parallelogram) form a square on the left; pieces are numbered and colour-keyed to the ideas listed on the right.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFDF8', ink: '22223B', muted: '5C5C70', pal: ['EF476F', 'FFD166', '06D6A0', '118AB2', '073B4C', 'F78C6B', '9B5DE5'] };
const F = { head: 'Arial', body: 'Calibri' };
// 7 pieces in a 100x100 square: [points, label point]
const PIECES = [[[0, 0, 100, 0, 50, 50], [50, 18]], [[0, 0, 50, 50, 0, 100], [16, 50]], [[100, 0, 100, 50, 75, 25], [91, 24]], [[50, 50, 75, 25, 100, 50, 75, 75], [75, 50]], [[0, 100, 50, 50, 50, 100], [33, 84]], [[50, 100, 100, 50, 100, 100], [84, 84]], [[50, 50, 75, 75, 50, 100, 25, 75].slice(0, 6).concat([25, 75]).slice(0, 8), [50, 75]]];
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const tangram = async (s, x, y, sz, n, numbers = true) => { let g = ''; PIECES.forEach(([pts], i) => { const P = []; for (let j = 0; j < pts.length; j += 2) P.push(`${pts[j] * 4},${pts[j + 1] * 4}`); g += `<polygon points="${P.join(' ')}" fill="#${C.pal[i % 7]}" stroke="#FFFDF8" stroke-width="8" stroke-linejoin="round" opacity="${i < n ? 1 : 0.25}"/>`; });
    t.img(s, await k.svg(`tg${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">${g}</svg>`, 400, 400), x, y, sz, sz);
    if (numbers) PIECES.slice(0, n).forEach(([, [lx, ly]], i) => k.txt(s, String(i + 1), x + lx / 100 * sz - 0.2, y + ly / 100 * sz - 0.2, 0.4, 0.4, { size: 14, bold: true, color: [1, 2, 6].includes(i) ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' })); };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 4.85, 0.3, 4.75, 0.85, { max: 24, min: 13 }); k.txt(s, String(k.idx), 0.4, 0.25, 0.8, 0.45, { size: 14, bold: true, color: C.pal[k.idx % 7] }); k.foot(s, { x: 4.85, y: 5.32, w: 4.75, size: 7.5 }); return s; };
  // keyed list on the right: colour swatch (piece colour) + content
  const keyed = async (s, n, draw) => { await tangram(s, 0.45, 0.8, 4.2, n); const rh = 3.95 / n; for (let i = 0; i < n; i++) { const y = 1.2 + i * rh; t.rect(s, 4.85, y + 0.06, 0.16, rh - 0.12, C.pal[i % 7], { name: 'Key' }); draw(i, 5.15, y, 4.45, rh); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await tangram(s, 5.6, 0.55, 4.0, 7, false); if (d.image) await k.photo(s, d.image, 5.6 + 2.0 - 0.0, 0.55 + 1.0, 1.0, 1.0, { mask: { poly: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]] } });
      k.txt(s, k.org3, 0.5, 0.6, 4.8, 0.35, { size: 12, bold: true, color: C.pal[3] }); k.head(s, d.title, 0.5, 1.0, 4.8, 2.4, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.7, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.7, 0.45, { size: 15, bold: true, color: C.pal[0] }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0.45, 0.8, 4.2, 4.2, { mask: { poly: [[0, 0], [1, 0], [1, 1], [0, 1]] } }); await tangram(s, 3.45, 3.8, 1.2, 7, false); k.txt(s, d.text, 4.85, 1.25, 4.75, 3.9, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await keyed(s, d.items.length, (i, x, y, w, h) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 16 })); },
    async cards(d) { const s = page(d); await keyed(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 15 }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async process(d) { const s = page(d); await keyed(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.42, { max: 15 }); k.txt(s, d.steps[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async stats(d) { const s = page(d); await keyed(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, 1.7, h, { max: 36, min: 14, color: C.pal[i % 7] === 'FFD166' ? 'C99A00' : C.pal[i % 7] }); k.txt(s, d.stats[i].label, x + 1.8, y, w - 1.8, h, { max: 13, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, 0.45, 5.05, 4.2, 0.45, { max: 8.5, color: C.muted }); },
    async compare(d) { const s = page(d); await tangram(s, 0.45, 0.8, 4.2, 2); const w = 4.75, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.3, F.body, 0.08, 1.45);
      [d.left, d.right].forEach((sd, i) => { const y0 = 1.2 + i * 2.0; t.rect(s, 4.85, y0 + 0.05, 0.16, 1.85, C.pal[i], { name: 'Key' }); k.head(s, sd.h, 5.15, y0, w - 0.3, 0.4, { max: 15 }); let y = y0 + 0.43; sd.items.forEach((it, j) => { k.txt(s, it, 5.15, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); await tangram(s, 0.45, 0.8, 4.2, 7, false); k.head(s, L.runs(d.text), 4.85, 1.3, 4.75, 2.4, { max: 28, min: 14 }); if (d.caption) k.txt(s, d.caption, 4.85, 3.8, 4.75, 1.35, { max: 12, color: C.muted }); },
    async timeline(d) { const s = page(d); await keyed(s, d.items.length, (i, x, y, w, h) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.42, { max: 14 }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async quote(d) { const s = page({}); await tangram(s, 0.45, 0.8, 4.2, 7, false); k.head(s, `\u201C${d.text}\u201D`, 4.85, 1.0, 4.75, 3.0, { max: 26, min: 13, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 4.85, 4.1, 4.75, 0.45, { size: 14, bold: true, color: C.pal[0] }); },
    async sources(d) { const s = page(d); await keyed(s, d.items.length, (i, x, y, w, h) => k.txt(s, d.items[i], x, y, w, h, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Tangram', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.pal[4], lt2: C.bg, accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[5], accent6: C.pal[6], hlink: C.pal[3], folHlink: C.muted } });
}
module.exports = { id: 138, slug: 'tangram', name: 'Tangram', category: 'creative', photos: true, build, style: { tone: "bo'laklardan butun: har bir qism o'z o'rniga ega, birgalikda to'liq manzara", limits: { card_t4: 110 }, prefer: null } };
