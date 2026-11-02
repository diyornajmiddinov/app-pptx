/**
 * 117 Doira kadr — a huge DISC fills the right side of every slide and all content lives inside it
 * (lists stacked within the circle, photos cropped to it); the left margin holds only the number and title.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F4F1EC', disc: '264653', ink: '1D2B33', muted: '5D6B72', light: 'FFFFFF', soft: 'BFD4D9', accent: 'E9C46A' };
const F = { head: 'Georgia', body: 'Calibri' };
const CX = 6.75, CY = 2.81, D = 5.9, IX = CX - 2.05, IY = CY - 2.0, IW = 4.1, IH = 4.0; // inscribed box
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const left = (s, d) => { k.txt(s, String(k.idx).padStart(2, '0'), 0.5, 0.45, 1.5, 0.8, { size: 40, bold: true, font: F.head, color: C.accent }); k.head(s, d.title || '', 0.5, 1.3, 3.0, 2.6, { max: 28, min: 14, valign: 'top' }); k.foot(s, { x: 0.5, y: 4.55, w: 3.0, size: 7.5 }); };
  const page = (d) => { const s = k.slide(C.bg); t.oval(s, CX - D / 2, CY - D / 2, D, D, C.disc, { name: 'Disc' }); left(s, d); return s; };
  const inside = (s, n, draw) => { const rh = IH / n; for (let i = 0; i < n; i++) { const y = IY + i * rh, inset = Math.max(0, 0.55 - Math.min(Math.abs(y + rh / 2 - CY), 2.0) * 0) ; draw(i, IX + inset, y, IW - inset * 2, rh); if (i < n - 1) t.line(s, IX + 0.3, y + rh, IW - 0.6, 0, C.soft, 0.5, { t: 50 }); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) await k.photo(s, d.image, CX - D / 2, CY - D / 2, D, D, { mask: 'circle' }); else t.oval(s, CX - D / 2, CY - D / 2, D, D, C.disc, { name: 'Disc' });
      t.oval(s, CX - D / 2 - 0.15, CY - D / 2 - 0.15, D + 0.3, D + 0.3, null, { line: { color: C.accent, width: 2 } });
      k.txt(s, k.org3, 0.5, 0.55, 3.4, 0.6, { max: 12, bold: true, color: C.disc }); k.head(s, d.title, 0.5, 1.2, 3.3, 2.4, { max: 34, min: 16, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.65, 3.2, 0.75, { max: 11, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.4, 3.2, 0.4, { size: 14, bold: true, color: C.disc }); k.foot(s, { x: 0.5, y: 5.2, w: 3.2, size: 7 }); },
    async intro(d) { const s = k.slide(C.bg); await k.photo(s, d.image, CX - D / 2, CY - D / 2, D, D, { mask: 'circle' }); k.txt(s, String(k.idx).padStart(2, '0'), 0.5, 0.35, 1.5, 0.6, { size: 30, bold: true, font: F.head, color: C.accent }); k.head(s, d.title, 0.5, 0.95, 3.2, 0.9, { max: 22, min: 13, valign: 'top' }); k.txt(s, d.text, 0.5, 1.95, 3.25, 3.1, { max: 14, min: 9.5, ls: 1.3 }); k.foot(s, { x: 0.5, y: 5.27, w: 3.2, size: 7 }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); inside(s, d.items.length, (i, x, y, w, h) => { k.txt(s, String(i + 1), x, y, 0.5, h, { size: 18, bold: true, font: F.head, color: C.accent, valign: 'middle' }); k.head(s, d.items[i], x + 0.55, y, w - 0.55, h, { max: 16, color: C.light }); }); },
    async cards(d) { const s = page(d); inside(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y + 0.03, w, 0.38, { max: 14, color: C.accent }); k.txt(s, d.items[i].t, x, y + 0.4, w, h - 0.45, { max: 12, color: C.light }); }); },
    async process(d) { const s = page(d); inside(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y + 0.03, w, 0.38, { max: 14, color: C.accent }); k.txt(s, d.steps[i].t, x, y + 0.4, w, h - 0.45, { max: 12, color: C.light }); }); },
    async stats(d) { const s = page(d); inside(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, 1.7, h, { max: 40, min: 16, color: C.accent }); k.txt(s, d.stats[i].label, x + 1.8, y, w - 1.8, h, { max: 13, color: C.light, valign: 'middle' }); });
      if (d.note) k.txt(s, d.note, 0.5, 3.95, 3.0, 0.6, { max: 9, italic: true, color: C.muted }); },
    async compare(d) { const s = page(d), w = (IW - 0.2) / 2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.1, IH - 0.6);
      [d.left, d.right].forEach((sd, i) => { const x = IX + i * (w + 0.2); k.head(s, sd.h, x, IY, w, 0.5, { max: 15, color: C.accent }); let y = IY + 0.55; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: C.light }); y += rr[j]; }); }); t.line(s, CX, IY + 0.1, 0, IH - 0.2, C.soft, 0.75); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), IX, IY + 0.2, IW, 2.4, { max: 28, min: 14, color: C.light, align: 'center' }); if (d.caption) k.txt(s, d.caption, IX + 0.2, IY + 2.7, IW - 0.4, 1.2, { max: 12, color: C.soft, align: 'center' }); },
    async timeline(d) { const s = page(d); inside(s, d.items.length, (i, x, y, w, h) => { const it = d.items[i]; k.head(s, it.year, x, y, 1.0, h, { max: 18, min: 10, color: C.accent }); k.head(s, it.h, x + 1.05, y + 0.03, w - 1.05, 0.36, { max: 13, color: C.light }); k.txt(s, it.t, x + 1.05, y + 0.38, w - 1.05, h - 0.42, { max: 11, color: C.soft }); }); },
    async quote(d) { const s = page({}); k.txt(s, '\u201C', CX - 0.5, IY - 0.3, 1.0, 1.0, { size: 70, font: F.head, color: C.accent, align: 'center' }); k.head(s, d.text, IX, IY + 0.6, IW, 2.5, { max: 26, min: 13, italic: true, color: C.light, align: 'center' }); if (d.author) k.txt(s, d.author, IX, IY + 3.2, IW, 0.4, { size: 13, bold: true, color: C.accent, align: 'center' }); },
    async sources(d) { const s = page(d); inside(s, d.items.length, (i, x, y, w, h) => k.txt(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.accent } }, { text: d.items[i] }], x, y, w, h, { max: 11, color: C.light, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Doira kadr', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.disc, lt2: C.bg, accent1: C.disc, accent2: C.accent, accent3: '2A9D8F', accent4: 'F4A261', accent5: 'E76F51', accent6: C.soft, hlink: C.disc, folHlink: C.muted } });
}
module.exports = { id: 117, slug: 'doira-kadr', name: 'Doira kadr', category: 'creative', photos: true, build, style: { tone: "jamlangan va ixcham: har slayd bitta 'kadr' ichida, qisqa bandlar", limits: { card_t4: 90, card_t3: 120, step_t: 100, event_t: 90, side_item: 50 }, prefer: null } };
