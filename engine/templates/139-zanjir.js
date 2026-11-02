/**
 * 139 Zanjir — a golden CHAIN on deep navy: every idea is written inside a chain link, links interlock left to
 * right (or top to bottom for long lists); a pendant hangs from the cover chain.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '0E1A2B', ink: 'F4EBD0', muted: 'B9AE8E', gold: 'D4A84B', gold2: 'F2D27A', dark: '0E1A2B' };
const F = { head: 'Georgia', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const link = (s, x, y, w, h, i) => { t.rect(s, x, y, w, h, null, { r: Math.min(w, h) / 2, line: { color: i % 2 ? C.gold : C.gold2, width: 9 }, name: 'Link' }); t.rect(s, x + 0.06, y + 0.06, w - 0.12, h - 0.12, null, { r: Math.min(w, h) / 2 - 0.06, line: { color: 'FFF4C2', width: 1, transparency: 50 }, name: 'Shine' }); };
  // horizontal chain: links overlap by `ov`; text inside each link
  const hChain = (s, n, draw, y = 1.35, h = 3.6) => { const ov = 0.35, w = (9.3 + ov * (n - 1)) / n; for (let i = 0; i < n; i++) { const x = 0.35 + i * (w - ov); link(s, x, y + (i % 2 ? 0.25 : 0), w, h - 0.25, i); draw(i, x + 0.35, y + 0.3 + (i % 2 ? 0.25 : 0), w - 0.7, h - 0.85); } };
  const vChain = (s, n, draw) => { const ov = 0.18, h = (3.95 + ov * (n - 1)) / n; for (let i = 0; i < n; i++) { const y = 1.15 + i * (h - ov), x = 0.6 + (i % 2) * 0.35; link(s, x, y, 8.6, h, i); draw(i, x + 0.4, y + 0.12, 7.8, h - 0.24); } };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.25, 8.2, 0.75, { max: 26, min: 14, color: C.ink, bold: false, italic: true }); k.txt(s, String(k.idx), 8.9, 0.25, 0.7, 0.75, { size: 20, font: F.head, color: C.gold, align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5, color: C.muted }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); for (let i = 0; i < 7; i++) link(s, 0.2 + i * 1.35, 0.35 + (i % 2) * 0.1, 1.7, 0.75, i); t.line(s, 6.95, 1.1, 0, 0.6, C.gold, 3); if (d.image) { t.oval(s, 5.65, 1.7, 2.6, 2.6, null, { line: { color: C.gold, width: 9 } }); await k.photo(s, d.image, 5.8, 1.85, 2.3, 2.3, { mask: 'circle' }); }
      k.txt(s, k.org3, 0.5, 1.5, 5.0, 0.35, { size: 12, bold: true, color: C.gold }); k.head(s, d.title, 0.5, 1.9, 5.0, 2.0, { max: 34, min: 16, color: C.ink, italic: true, bold: false, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.95, 4.9, 0.6, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.55, 4.9, 0.45, { size: 15, bold: true, color: C.gold2 }); k.foot(s, { y: 5.32, size: 7.5, color: C.muted }); },
    async intro(d) { const s = page(d); link(s, 0.35, 1.2, 4.0, 3.9, 0); await k.photo(s, d.image, 0.65, 1.5, 3.4, 3.3, { mask: { r: 0.6 } }); link(s, 4.0, 1.4, 5.6, 3.5, 1); k.txt(s, d.text, 4.45, 1.7, 4.7, 2.9, { max: 14, min: 9.5, color: C.ink, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); vChain(s, d.items.length, (i, x, y, w, h) => k.head(s, `${i + 1}.  ${d.items[i]}`, x, y, w, h, { max: 16, color: C.ink, bold: false })); },
    async cards(d) { const s = page(d); hChain(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.5, { max: 14, color: C.gold2, align: 'center' }); k.txt(s, d.items[i].t, x, y + 0.52, w, h - 0.52, { max: 12, color: C.ink, align: 'center' }); }); },
    async process(d) { const s = page(d); hChain(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.5, { max: 14, color: C.gold2, align: 'center' }); k.txt(s, d.steps[i].t, x, y + 0.52, w, h - 0.52, { max: 12, color: C.ink, align: 'center' }); }); },
    async stats(d) { const s = page(d); hChain(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y + 0.1, w, 1.0, { max: 40, min: 16, color: C.gold2, align: 'center' }); k.txt(s, d.stats[i].label, x, y + 1.15, w, h - 1.15, { max: 12, color: C.ink, align: 'center' }); }, 1.15, d.note ? 3.35 : 3.8); if (d.note) k.txt(s, d.note, 0.4, 4.6, 9.2, 0.55, { max: 9, color: C.muted, align: 'center' }); },
    async compare(d) { const s = page(d), w = 4.0, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.6, F.body, 0.08, 2.8); hChain(s, 2, (i, x, y, ww, h) => { const sd = i ? d.right : d.left; k.head(s, sd.h, x, y, ww, 0.45, { max: 15, color: C.gold2, align: 'center' }); let yy = y + 0.5; sd.items.forEach((it, j) => { k.txt(s, it, x + 0.1, yy, ww - 0.2, rr[j], { size: fs, color: C.ink }); yy += rr[j]; }); }); void w; },
    async statement(d) { const s = page(d); link(s, 0.8, 1.3, 8.4, 2.6, 0); k.head(s, L.runs(d.text), 1.3, 1.5, 7.4, 2.2, { max: 28, min: 14, color: C.ink, align: 'center', italic: true, bold: false }); if (d.caption) k.txt(s, d.caption, 0.8, 4.05, 8.4, 1.1, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); hChain(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].year, x, y, w, 0.5, { max: 20, min: 11, color: C.gold2, align: 'center' }); k.head(s, d.items[i].h, x, y + 0.52, w, 0.42, { max: 13, color: C.ink, align: 'center' }); k.txt(s, d.items[i].t, x, y + 0.96, w, h - 0.96, { max: 11, color: C.muted, align: 'center' }); }); },
    async quote(d) { const s = page({}); link(s, 0.8, 1.1, 8.4, 3.2, 1); k.head(s, `\u201C${d.text}\u201D`, 1.3, 1.35, 7.4, 2.3, { max: 26, min: 13, italic: true, bold: false, color: C.ink, align: 'center' }); if (d.author) k.txt(s, d.author, 1.3, 3.65, 7.4, 0.4, { size: 13, bold: true, color: C.gold, align: 'center' }); },
    async sources(d) { const s = page(d); vChain(s, d.items.length, (i, x, y, w, h) => k.txt(s, d.items[i], x, y, w, h, { max: 11, color: C.ink, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Zanjir', colors: { dk1: C.dark, lt1: C.ink, dk2: '1B2E47', lt2: C.muted, accent1: C.gold, accent2: C.gold2, accent3: '8C6D2C', accent4: '5B8DB8', accent5: C.muted, accent6: 'FFF4C2', hlink: C.gold2, folHlink: C.muted } });
}
module.exports = { id: 139, slug: 'zanjir', name: 'Zanjir', category: 'luxury', photos: true, build, style: { tone: "uzviylik: har bir bo'g'in oldingisiga bog'langan; izchil, mustahkam mantiq", limits: { card_t4: 90, card_t3: 120, step_t: 90, event_t: 80 }, prefer: null } };
