/**
 * 131 Chizg'ich — everything is MEASURED: a yellow ruler runs along the top and the left edge, ideas sit in
 * columns or rows marked by red dimension lines (↔ with their index), photos carry width/height dimensions.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FAFAF7', ruler: 'F2C94C', rulerEdge: 'C9A227', ink: '1F1F1F', muted: '5E5E5E', dim: 'D62828' };
const F = { head: 'Arial', body: 'Calibri' };
const X = 0.85, W = 8.75, Y = 1.7, Hc = 3.45;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const rulers = (s) => { t.rect(s, 0, 0.12, 10, 0.55, C.ruler, { line: { color: C.rulerEdge, width: 1 }, name: 'Ruler' }); for (let i = 0; i <= 100; i++) { const x = 0.6 + i * 0.09; if (x > 9.9) break; t.line(s, x, 0.12, 0, i % 10 ? (i % 5 ? 0.1 : 0.16) : 0.24, C.ink, 0.75); if (!(i % 10)) k.txt(s, String(i / 10), x - 0.15, 0.38, 0.3, 0.22, { size: 7, align: 'center', color: C.ink }); }
    t.rect(s, 0, 0.67, 0.55, 4.95, C.ruler, { line: { color: C.rulerEdge, width: 1 }, name: 'Ruler' }); for (let i = 0; i <= 50; i++) { const y = 0.8 + i * 0.09; if (y > 5.55) break; t.line(s, 0, y, i % 10 ? (i % 5 ? 0.1 : 0.16) : 0.24, 0, C.ink, 0.75); } };
  const dimH = (s, x, y, w, label) => { t.line(s, x, y, w, 0, C.dim, 1, { beginArrowType: 'triangle', endArrowType: 'triangle' }); t.line(s, x, y - 0.08, 0, 0.16, C.dim, 0.75); t.line(s, x + w, y - 0.08, 0, 0.16, C.dim, 0.75); if (label !== undefined) { t.rect(s, x + w / 2 - 0.2, y - 0.11, 0.4, 0.22, C.bg, { name: 'Label bg' }); k.txt(s, String(label), x + w / 2 - 0.2, y - 0.11, 0.4, 0.22, { size: 9, bold: true, color: C.dim, align: 'center', valign: 'middle' }); } };
  const dimV = (s, x, y, h) => { t.line(s, x, y, 0, h, C.dim, 1, { beginArrowType: 'triangle', endArrowType: 'triangle' }); t.line(s, x - 0.08, y, 0.16, 0, C.dim, 0.75); t.line(s, x - 0.08, y + h, 0.16, 0, C.dim, 0.75); };
  const page = (d) => { const s = k.slide(C.bg); rulers(s); if (d.title) k.head(s, d.title, X, 0.85, 8.0, 0.65, { max: 24, min: 13 }); k.txt(s, `${k.idx}`, 8.9, 0.85, 0.7, 0.65, { size: 18, bold: true, color: C.dim, align: 'right', valign: 'middle' }); k.foot(s, { x: X, y: 5.32, w: W, size: 7.5 }); return s; };
  const cols = (s, n, draw) => { const w = W / n; for (let i = 0; i < n; i++) { const x = X + i * w; dimH(s, x + 0.05, Y, w - 0.1, i + 1); draw(i, x + 0.08, Y + 0.25, w - 0.25, Hc - 0.25); } };
  const rows = (s, n, draw) => { const rh = Hc / n; for (let i = 0; i < n; i++) { const y = Y + i * rh; t.line(s, 0.55, y + rh / 2, 0.22, 0, C.dim, 1.5); k.txt(s, String(i + 1), 0.0, y, 0.55, rh, { size: 10, bold: true, color: C.dim, align: 'center', valign: 'middle' }); draw(i, X, y, W, rh); if (i < n - 1) t.line(s, X, y + rh, W, 0, 'E2DED0', 0.5, { dash: 'dash' }); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); rulers(s); if (d.image) { await k.photo(s, d.image, 6.3, 1.2, 3.0, 3.3); dimH(s, 6.3, 4.75, 3.0, ''); dimV(s, 9.6, 1.2, 3.3); }
      k.txt(s, k.org3, 0.9, 1.0, 5.0, 0.35, { size: 12, bold: true, color: C.dim }); k.head(s, d.title, 0.9, 1.4, 5.1, 2.3, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.9, 3.75, 5.0, 0.7, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.9, 4.5, 5.0, 0.45, { size: 15, bold: true }); k.foot(s, { x: 0.9, y: 5.32, w: 8.6, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, X + 0.25, Y + 0.1, 3.4, 2.95); dimH(s, X + 0.25, Y + 3.25, 3.4, ''); dimV(s, X + 0.05, Y + 0.1, 2.95); k.txt(s, d.text, X + 3.95, Y, W - 3.95, Hc, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); rows(s, d.items.length, (i, x, y, w, h) => k.head(s, d.items[i], x, y, w, h, { max: 17 })); },
    async cards(d) { const s = page(d); cols(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.5, { max: 15 }); k.txt(s, d.items[i].t, x, y + 0.52, w, h - 0.52, { max: 13, color: C.muted }); }); },
    async process(d) { const s = page(d); cols(s, d.steps.length, (i, x, y, w, h) => { k.head(s, d.steps[i].h, x, y, w, 0.5, { max: 15 }); k.txt(s, d.steps[i].t, x, y + 0.52, w, h - 0.52, { max: 13, color: C.muted }); }); },
    async stats(d) { const s = page(d); cols(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, w, 1.1, { max: 48, min: 18, color: C.dim }); k.txt(s, d.stats[i].label, x, y + 1.15, w, h - 1.15 - (d.note ? 0.55 : 0), { max: 13 }); }); if (d.note) k.txt(s, d.note, X, Y + Hc - 0.5, W, 0.5, { max: 9, italic: true, color: C.muted }); },
    async compare(d) { const s = page(d), w = W / 2 - 0.15, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.2, F.body, 0.12, Hc - 0.85);
      [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.3); dimH(s, x, Y, w, i ? 'B' : 'A'); k.head(s, sd.h, x, Y + 0.25, w, 0.5, { max: 16 }); let y = Y + 0.8; sd.items.forEach((it, j) => { k.txt(s, `\u2014 ${it}`, x, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); dimH(s, X + 0.3, Y + 0.05, W - 0.6, ''); k.head(s, L.runs(d.text), X + 0.3, Y + 0.25, W - 0.6, 2.1, { max: 30, min: 15, align: 'center' }); dimH(s, X + 0.3, Y + 2.45, W - 0.6, ''); if (d.caption) k.txt(s, d.caption, X + 0.3, Y + 2.65, W - 0.6, 0.8, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); cols(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].year, x, y, w, 0.55, { max: 22, min: 11, color: C.dim }); k.head(s, d.items[i].h, x, y + 0.58, w, 0.42, { max: 14 }); k.txt(s, d.items[i].t, x, y + 1.02, w, h - 1.02, { max: 12, color: C.muted }); }); },
    async quote(d) { const s = page({}); dimV(s, X + 0.2, Y - 0.6, 3.2); k.head(s, `\u201C${d.text}\u201D`, X + 0.55, Y - 0.6, W - 0.8, 2.6, { max: 28, min: 14, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, X + 0.55, Y + 2.1, W - 0.8, 0.45, { size: 14, bold: true, color: C.dim }); },
    async sources(d) { const s = page(d); rows(s, d.items.length, (i, x, y, w, h) => k.txt(s, d.items[i], x, y, w, h, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: "SlideAI Chizg'ich", colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '3A3A3A', lt2: C.bg, accent1: C.dim, accent2: C.ruler, accent3: '1D3557', accent4: '457B9D', accent5: C.muted, accent6: C.rulerEdge, hlink: C.dim, folHlink: C.muted } });
}
module.exports = { id: 131, slug: 'chizgich', name: "Chizg'ich", category: 'academic', photos: true, build, style: { tone: "o'lchanadigan aniqlik: raqamlar, me'yorlar va solishtirma; qisqa va texnik", limits: {}, prefer: 'data' } };
