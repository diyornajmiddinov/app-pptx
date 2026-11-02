/**
 * 124 Piramida — a stacked PYRAMID of bands on the left with leader lines to labels on the right; processes turn
 * the pyramid upside down into a FUNNEL. Deep teal-to-sand gradient bands, a title in the upper right.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FBFAF7', ink: '14213D', muted: '56627A', bands: ['14213D', '1D4E89', '277DA1', '43AA8B', '90BE6D', 'F9C74F'] };
const F = { head: 'Arial', body: 'Calibri' };
const PX = 0.4, PW = 4.6, PY = 1.15, PH = 3.95;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  // n bands of a triangle (or funnel); returns band geometry [{y,h,xl,xr}]
  const tri = async (s, n, funnel = false) => { const W2 = PW * 100, H2 = PH * 100, gap = 6, bh = (H2 - gap * (n - 1)) / n; let g = ''; const geo = [];
    for (let i = 0; i < n; i++) { const y0 = i * (bh + gap), y1 = y0 + bh, f0 = funnel ? 1 - y0 / H2 : y0 / H2, f1 = funnel ? 1 - y1 / H2 : y1 / H2, hw0 = W2 / 2 * f0, hw1 = W2 / 2 * f1;
      g += `<polygon points="${W2 / 2 - hw0},${y0} ${W2 / 2 + hw0},${y0} ${W2 / 2 + hw1},${y1} ${W2 / 2 - hw1},${y1}" fill="#${C.bands[Math.round(i * 5 / Math.max(1, n - 1))]}"/>`;
      geo.push({ y: PY + y0 / 100, h: bh / 100, xr: PX + (W2 / 2 + Math.max(hw0, hw1)) / 100, xc: PX + PW / 2, wmid: (hw0 + hw1) / 100 }); }
    t.img(s, await k.svg(`tri${n}${funnel}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}">${g}</svg>`, W2, H2), PX, PY, PW, PH); return geo; };
  const labels = async (s, n, draw, funnel) => { const geo = await tri(s, n, funnel); geo.forEach((b, i) => { const ly = b.y + b.h / 2; t.line(s, b.xr + 0.05, ly, 5.35 - b.xr, 0, C.muted, 0.75, { dash: 'dash' }); t.oval(s, 5.35, ly - 0.05, 0.1, 0.1, C.bands[Math.round(i * 5 / Math.max(1, n - 1))]); draw(i, b, 5.6, b.y, 3.9, b.h); }); return geo; };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 3.2, 0.3, 6.3, 0.75, { max: 26, min: 14, align: 'right' }); k.txt(s, `\u25B2 ${k.idx}`, 0.4, 0.35, 1.5, 0.6, { size: 16, bold: true, color: C.bands[2], valign: 'middle' }); k.foot(s, { y: 5.3, size: 7.5, align: 'right', x: 4.6, w: 4.9 }); return s; };
  const inBand = (s, txt, b, o = {}) => k.head(s, txt, b.xc - Math.max(0.4, b.wmid) + 0.1, b.y, Math.max(0.8, 2 * b.wmid) - 0.2, b.h, { max: 14, min: 8, color: 'FFFFFF', align: 'center', ...o });
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) await k.photo(s, d.image, 5.3, 0.4, 4.3, 3.9, { mask: { poly: [[0.5, 0], [1, 1], [0, 1]] } }); else await tri(s, 5);
      k.txt(s, k.org3, 0.5, 0.6, 4.6, 0.35, { size: 12, bold: true, color: C.bands[2] }); k.head(s, d.title, 0.5, 1.0, 4.6, 2.5, { max: 38, min: 18, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.55, 4.5, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.4, 4.5, 0.45, { size: 15, bold: true, color: C.bands[1] }); k.foot(s, { y: 5.3, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, PX, PY, PW, PH, { mask: { poly: [[0.5, 0], [1, 1], [0, 1]] } }); k.txt(s, d.text, 5.3, 1.2, 4.2, 3.9, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await labels(s, d.items.length, (i, b, x, y, w, h) => k.head(s, d.items[i], x, y, w, h, { max: 16 })); },
    async cards(d) { const s = page(d); await labels(s, d.items.length, (i, b, x, y, w, h) => { inBand(s, d.items[i].h, b); k.txt(s, d.items[i].t, x, y, w, h, { max: 13, valign: 'middle' }); }); },
    async process(d) { const s = page(d); await labels(s, d.steps.length, (i, b, x, y, w, h) => { inBand(s, `${i + 1}. ${d.steps[i].h}`, b); k.txt(s, d.steps[i].t, x, y, w, h, { max: 13, valign: 'middle' }); }, true); },
    async stats(d) { const s = page(d); await labels(s, d.stats.length, (i, b, x, y, w, h) => { inBand(s, d.stats[i].value, b, { max: 28 }); k.txt(s, d.stats[i].label, x, y, w, h, { max: 14, valign: 'middle' }); });
      if (d.note) k.txt(s, d.note, 0.4, 5.12, 4.1, 0.42, { max: 9, color: C.muted, valign: 'middle' }); },
    async compare(d) { const s = page(d), w = 4.3, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.3, F.body, 0.12, 2.4);
      for (const [i, sd] of [d.left, d.right].entries()) { const x = 0.4 + i * 4.8; t.shape(s, 'ISOSCELES_TRIANGLE', { x: x + 1.15, y: 1.15, w: 2.0, h: 1.2, fill: { color: C.bands[i ? 3 : 1] }, objectName: 'Apex' }); k.head(s, sd.h, x, 2.4, w, 0.45, { max: 16, align: 'center', color: C.bands[i ? 3 : 1] }); let y = 2.9; sd.items.forEach((it, j) => { k.txt(s, '\u25B4', x, y, 0.25, 0.3, { size: 12, color: C.bands[i ? 3 : 1] }); k.txt(s, it, x + 0.28, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); } },
    async statement(d) { const s = page(d); await tri(s, 3); k.head(s, L.runs(d.text), 5.3, 1.2, 4.2, 2.4, { max: 28, min: 14 }); if (d.caption) k.txt(s, d.caption, 5.3, 3.7, 4.2, 1.4, { max: 12, color: C.muted }); },
    async timeline(d) { const s = page(d); await labels(s, d.items.length, (i, b, x, y, w, h) => { inBand(s, d.items[i].year, b, { max: 18 }); k.txt(s, [{ text: d.items[i].h + '. ', options: { bold: true } }, { text: d.items[i].t }], x, y, w, h, { max: 12, valign: 'middle' }); }); },
    async quote(d) { const s = page({}); t.shape(s, 'ISOSCELES_TRIANGLE', { x: 0.6, y: 1.3, w: 3.6, h: 3.4, fill: { color: C.bands[0] }, objectName: 'Pyramid' }); k.txt(s, '\u201C', 1.9, 3.05, 1.0, 1.1, { size: 60, bold: true, color: C.bands[5], align: 'center' }); k.head(s, d.text, 4.6, 1.2, 4.9, 2.9, { max: 26, min: 13, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 4.6, 4.2, 4.9, 0.45, { size: 14, bold: true, color: C.bands[2] }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.9 / n; d.items.forEach((it, i) => { k.txt(s, '\u25B2', 0.4, 1.15 + i * rh, 0.3, rh, { size: 11, color: C.bands[Math.round(i * 5 / Math.max(1, n - 1))], valign: 'middle' }); k.txt(s, it, 0.75, 1.15 + i * rh, 8.8, rh, { max: 12, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Piramida', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.bands[0], lt2: C.bg, accent1: C.bands[1], accent2: C.bands[2], accent3: C.bands[3], accent4: C.bands[4], accent5: C.bands[5], accent6: C.muted, hlink: C.bands[2], folHlink: C.muted } });
}
module.exports = { id: 124, slug: 'piramida', name: 'Piramida', category: 'business', photos: true, build, style: { tone: "ierarxiya tili: asosdan cho'qqigacha, eng muhimi tepada; aniq va tartibli", limits: { card_t4: 110, step_t: 110 }, prefer: null } };
