/**
 * 123 Venn — every slide is built from overlapping translucent circles: ideas are circles that intersect,
 * comparisons are a two-set Venn diagram, sequences are chains of overlapping discs. Clean white, CMY tints.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '1B1B2F', muted: '5A5A6E', pal: ['00B4D8', 'F72585', 'FFB703', '7209B7', '06D6A0', 'FB5607'] };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const disc = (s, cx, cy, d, i, tr = 72) => t.oval(s, cx - d / 2, cy - d / 2, d, d, C.pal[i % 6], { t: tr, name: 'Set' });
  const page = (d) => { const s = k.slide(C.bg); disc(s, 0.62, 0.62, 0.42, 0, 40); disc(s, 0.86, 0.62, 0.42, 1, 40); if (d.title) k.head(s, d.title, 1.25, 0.3, 7.6, 0.65, { max: 26, min: 14 }); k.txt(s, String(k.idx), 8.9, 0.3, 0.7, 0.65, { size: 18, bold: true, color: C.pal[k.idx % 6], align: 'right', valign: 'middle' }); k.foot(s, { y: 5.3, size: 7.5 }); return s; };
  // chain of overlapping discs with label inside and text below
  const chain = (s, n, inside, below) => { const step = 9.0 / n, d = Math.min(2.0, step * 1.32); for (let i = 0; i < n; i++) { const cx = 0.5 + step * (i + 0.5); disc(s, cx, 1.95, d, i); inside(i, cx - step / 2 + 0.05, 1.95 - 0.4, step - 0.1, 0.8); below(i, cx - step / 2 + 0.05, 1.95 + d / 2 + 0.1, step - 0.1, 5.15 - (1.95 + d / 2 + 0.1)); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); disc(s, 6.6, 2.4, 3.4, 0, 60); disc(s, 8.2, 2.4, 3.4, 1, 60); disc(s, 7.4, 3.7, 3.4, 2, 60); if (d.image) await k.photo(s, d.image, 6.55, 2.05, 1.7, 1.7, { mask: 'circle' });
      k.txt(s, k.org3, 0.5, 0.55, 5.0, 0.35, { size: 12, bold: true, color: C.pal[3] }); k.head(s, d.title, 0.5, 0.95, 5.0, 2.4, { max: 40, min: 18, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.4, 4.7, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.7, 0.45, { size: 15, bold: true }); k.foot(s, { y: 5.3, size: 7.5, w: 5.0 }); },
    async intro(d) { const s = page(d); disc(s, 3.2, 3.1, 3.0, 0, 65); await k.photo(s, d.image, 0.6, 1.4, 3.1, 3.1, { mask: 'circle' }); k.txt(s, d.text, 4.6, 1.25, 4.9, 3.85, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = page(d); disc(s, 6.8, 3.1, 3.0, 1, 65); k.txt(s, d.text, 0.5, 1.25, 4.9, 3.85, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); await k.photo(s, d.image, 6.3, 1.4, 3.1, 3.1, { mask: 'circle' }); },
    async agenda(d) { const s = page(d); chain(s, d.items.length, (i, x, y, w, h) => k.txt(s, String(i + 1), x, y, w, h, { size: 30, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }), (i, x, y, w, h) => k.head(s, d.items[i], x, y, w, Math.min(h, 1.4), { max: 15, align: 'center', valign: 'top' })); },
    async cards(d) { const s = page(d), n = d.items.length;
      if (n === 3) { const P = [[3.5, 2.35], [6.5, 2.35], [5.0, 3.65]]; P.forEach(([cx, cy], i) => disc(s, cx, cy, 3.0, i)); const T = [[0.4, 1.15, 'right'], [7.2, 1.15, 'left'], [6.6, 4.1, 'left']]; d.items.forEach((it, i) => { const [x, y, al] = T[i]; const w = i === 2 ? 2.9 : 2.4; k.head(s, it.h, x, y, w, 0.45, { max: 15, align: al, color: C.pal[i] === 'FFB703' ? 'B07D00' : C.pal[i] }); k.txt(s, it.t, x, y + 0.47, w, i === 2 ? 0.9 : 1.8, { max: 12, align: al }); }); k.head(s, d.title || '', 4.15, 2.6, 1.7, 0.7, { max: 12, align: 'center', color: 'FFFFFF' }); return; }
      chain(s, n, (i, x, y, w, h) => k.head(s, d.items[i].h, x + 0.1, y, w - 0.2, h, { max: 14, align: 'center', color: 'FFFFFF' }), (i, x, y, w, h) => k.txt(s, d.items[i].t, x, y, w, h, { max: 12, align: 'center', color: C.muted })); },
    async process(d) { const s = page(d); chain(s, d.steps.length, (i, x, y, w, h) => k.head(s, `${i + 1}. ${d.steps[i].h}`, x + 0.1, y, w - 0.2, h, { max: 14, align: 'center', color: 'FFFFFF' }), (i, x, y, w, h) => k.txt(s, d.steps[i].t, x, y, w, h, { max: 12, align: 'center', color: C.muted })); },
    async stats(d) { const s = page(d); chain(s, d.stats.length, (i, x, y, w, h) => k.head(s, d.stats[i].value, x, y - 0.1, w, h + 0.2, { max: 40, min: 16, align: 'center', color: 'FFFFFF' }), (i, x, y, w, h) => k.txt(s, d.stats[i].label, x, y, w, h - (d.note ? 0.55 : 0), { max: 13, align: 'center' }));
      if (d.note) k.txt(s, d.note, 0.5, 4.65, 9.0, 0.5, { max: 9, color: C.muted, align: 'center' }); },
    async compare(d) { const s = page(d), w = 2.45, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.1, 2.6); disc(s, 3.85, 3.15, 3.9, 0, 70); disc(s, 6.15, 3.15, 3.9, 1, 70);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 6.85 : 0.7, al = i ? 'left' : 'right'; k.head(s, sd.h, x, 1.15, w, 0.45, { max: 15, align: al, color: C.pal[i] }); let y = 1.95; sd.items.forEach((it, j) => { k.txt(s, it, x + (i ? 0 : 0.2), y, w - 0.2, rr[j], { size: fs, align: al }); y += rr[j]; }); }); k.txt(s, '\u2229', 4.6, 2.75, 0.8, 0.8, { size: 34, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
    async statement(d) { const s = page(d); disc(s, 4.2, 3.1, 3.8, 2, 70); disc(s, 5.8, 3.1, 3.8, 3, 75); k.head(s, L.runs(d.text), 2.9, 1.9, 4.2, 2.4, { max: 26, min: 13, align: 'center' }); if (d.caption) k.txt(s, d.caption, 0.4, 1.3, 2.2, 3.6, { max: 12, color: C.muted, valign: 'middle' }); },
    async timeline(d) { const s = page(d); chain(s, d.items.length, (i, x, y, w, h) => k.head(s, d.items[i].year, x, y, w, h, { max: 24, min: 11, align: 'center', color: 'FFFFFF' }), (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.4, { max: 13, align: 'center' }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.42, { max: 11, align: 'center', color: C.muted }); }); },
    async quote(d) { const s = page({}); disc(s, 5.0, 2.95, 4.2, 4, 75); disc(s, 3.3, 2.2, 1.6, 1, 60); k.head(s, `\u201C${d.text}\u201D`, 3.3, 1.5, 3.4, 2.6, { max: 22, min: 11, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author, 6.9, 4.2, 2.6, 0.5, { size: 13, bold: true, color: C.pal[3] }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.85 / n; d.items.forEach((it, i) => { const y = 1.2 + i * rh; disc(s, 0.62, y + rh / 2, 0.3, i, 40); disc(s, 0.8, y + rh / 2, 0.3, i + 1, 40); k.txt(s, it, 1.15, y, 8.4, rh, { max: 12, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Venn', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '3A0CA3', lt2: 'F5F5FA', accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[4], accent6: C.pal[5], hlink: C.pal[3], folHlink: C.muted } });
}
module.exports = { id: 123, slug: 'venn', name: 'Venn', category: 'creative', photos: true, build, style: { tone: "bog'liqliklar tili: umumiy jihatlar, kesishmalar va farqlar; qisqa, tushunarli", limits: { card_t3: 110, card_t4: 70, step_t: 70, event_t: 70, side_item: 50 }, prefer: null } };
