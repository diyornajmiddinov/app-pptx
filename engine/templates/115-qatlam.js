/**
 * 115 Qatlam — a stack of sheets: the current page lies on top of two offset sheets, and vertical INDEX TABS
 * run down the right edge with the current slide's tab pulled out — the whole deck is a tabbed binder.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { desk: 'DCE3EA', sheet: 'FFFFFF', back1: 'C7D2DE', back2: 'B4C1CF', ink: '1F2A37', muted: '5B6878', accent: '3355FF', tabs: ['3355FF', 'FF6B6B', '20C997', 'FCC419', '845EF7', 'FF922B'] };
const F = { head: 'Arial', body: 'Calibri' };
const SX = 0.45, SY = 0.55, SW = 8.6, SH = 4.6;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const stack = (s) => { t.rect(s, SX + 0.3, SY - 0.3, SW, SH, C.back2, { name: 'Sheet' }); t.rect(s, SX + 0.15, SY - 0.15, SW, SH, C.back1, { name: 'Sheet' }); t.rect(s, SX, SY, SW, SH, C.sheet, { shadow: 0.2, blur: 6, offset: 2, name: 'Top sheet' }); };
  const tabs = (s) => { const n = Math.min(k.n, 14), h = 4.9 / n; for (let i = 0; i < n; i++) { const cur = i + 1 === k.idx, x = cur ? SX + SW - 0.05 : SX + SW + 0.15; t.rect(s, x, 0.35 + i * h, 0.75, h - 0.04, C.tabs[i % 6], { t: cur ? 0 : 45, name: 'Index tab' }); k.txt(s, String(i + 1), x + 0.2, 0.35 + i * h, 0.5, h - 0.04, { size: 9, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); } };
  const page = (d) => { const s = k.slide(C.desk); stack(s); tabs(s); if (d.title) k.head(s, d.title, SX + 0.35, SY + 0.2, SW - 0.7, 0.65, { max: 26, min: 14 }); t.line(s, SX + 0.35, SY + 0.92, SW - 0.7, 0, C.tabs[(k.idx - 1) % 6], 2.5); k.foot(s, { x: SX + 0.35, y: 5.25, w: SW - 0.7, size: 8 }); return s; };
  const X = SX + 0.35, Y = SY + 1.1, W = SW - 0.7, Hc = SH - 1.3;
  const R = {
    async cover(d) { const s = k.slide(C.desk); stack(s); tabs(s); if (d.image) await k.photo(s, d.image, SX + SW - 3.4, SY + 0.35, 3.05, 3.9);
      k.txt(s, k.org3, X, SY + 0.4, 4.8, 0.35, { size: 12, bold: true, color: C.accent }); k.head(s, d.title, X, SY + 0.8, 4.8, 2.3, { max: 38, min: 18, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, X, SY + 3.15, 4.8, 0.7, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', X, SY + 3.85, 4.8, 0.45, { size: 15, bold: true }); k.foot(s, { x: X, y: 5.25, w: W, size: 8 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, X, Y, 3.3, Hc); k.txt(s, d.text, X + 3.55, Y, W - 3.55, Hc, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { const s = page(d); k.txt(s, d.text, X, Y, W - 3.55, Hc, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); await k.photo(s, d.image, X + W - 3.3, Y, 3.3, Hc); },
    async agenda(d) { const s = page(d), n = d.items.length, per = Math.ceil(n / 2), rh = Hc / per; d.items.forEach((it, i) => { const x = X + Math.floor(i / per) * (W / 2), y = Y + (i % per) * rh; t.rect(s, x, y + 0.08, 0.12, rh - 0.16, C.tabs[i % 6], { name: 'Tab mark' }); k.head(s, `${i + 1}. ${it}`, x + 0.25, y, W / 2 - 0.4, rh, { max: 16 }); }); },
    async cards(d) { const s = page(d), n = d.items.length, w = (W - 0.2 * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) { const x = X + i * (w + 0.2); t.rect(s, x, Y, w, 0.12, C.tabs[i % 6], { name: 'Tab' }); t.img(s, await k.icon(it.icon, C.tabs[i % 6], 2), x, Y + 0.25, 0.36, 0.36); k.head(s, it.h, x, Y + 0.7, w, 0.55, { max: 15, valign: 'top' }); k.txt(s, it.t, x, Y + 1.3, w, Hc - 1.3, { max: 13, color: C.muted }); } },
    async process(d) { const s = page(d), n = d.steps.length, rh = Hc / n; d.steps.forEach((st, i) => { const y = Y + i * rh; t.rect(s, X, y + 0.06, 0.45, rh - 0.12, C.tabs[i % 6], { name: 'Step tab' }); k.txt(s, String(i + 1), X, y + 0.06, 0.45, rh - 0.12, { size: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); k.head(s, st.h, X + 0.6, y, 2.4, rh, { max: 15 }); k.txt(s, st.t, X + 3.1, y + 0.03, W - 3.1, rh - 0.06, { max: 13, color: C.muted, valign: 'middle' }); }); },
    async stats(d) { const s = page(d), n = d.stats.length, w = W / n; d.stats.forEach((v, i) => { const x = X + i * w; t.rect(s, x, Y, w - 0.25, 0.1, C.tabs[i % 6], { name: 'Tab' }); k.head(s, v.value, x, Y + 0.2, w - 0.25, 1.3, { max: 52, min: 20, color: C.tabs[i % 6] }); k.txt(s, v.label, x, Y + 1.55, w - 0.3, 1.05, { max: 13 }); });
      if (d.note) k.txt(s, d.note, X, Y + Hc - 0.6, W, 0.6, { max: 10, italic: true, color: C.muted, valign: 'bottom' }); },
    async compare(d) { const s = page(d), w = (W - 0.4) / 2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.3, F.body, 0.12, Hc - 0.6);
      [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.4), c = C.tabs[i ? 2 : 1]; t.rect(s, x, Y, w, 0.5, c, { name: 'Head' }); k.head(s, sd.h, x + 0.15, Y, w - 0.3, 0.5, { max: 16, color: 'FFFFFF' }); let y = Y + 0.6; sd.items.forEach((it, j) => { k.txt(s, '\u2713', x, y, 0.3, 0.3, { size: 12, bold: true, color: c }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), X, Y, W, 2.0, { max: 32, min: 16 }); if (d.caption) k.txt(s, d.caption, X, Y + 2.1, W, Hc - 2.1, { max: 13, color: C.muted }); },
    async timeline(d) { const s = page(d), n = d.items.length, w = W / n; t.line(s, X, Y + 0.7, W, 0, C.ink, 1.5); d.items.forEach((it, i) => { const x = X + i * w; k.head(s, it.year, x, Y, w - 0.2, 0.6, { max: 22, min: 11, color: C.tabs[i % 6], valign: 'bottom' }); t.rect(s, x, Y + 0.64, 0.4, 0.12, C.tabs[i % 6], { name: 'Mark' }); k.head(s, it.h, x, Y + 0.9, w - 0.2, 0.5, { max: 14 }); k.txt(s, it.t, x, Y + 1.42, w - 0.2, Hc - 1.42, { max: 12, color: C.muted }); }); },
    async quote(d) { const s = page({}); k.head(s, `\u201C${d.text}\u201D`, X + 0.3, SY + 0.6, W - 0.6, 2.8, { max: 30, min: 15, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, X + 0.3, SY + 3.5, W - 0.6, 0.45, { size: 14, bold: true, color: C.accent, align: 'center' }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = Hc / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.tabs[i % 6] } }, { text: it }], X, Y + i * rh, W, rh, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Qatlam', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '2B3A4A', lt2: C.desk, accent1: C.tabs[0], accent2: C.tabs[1], accent3: C.tabs[2], accent4: C.tabs[3], accent5: C.tabs[4], accent6: C.tabs[5], hlink: C.tabs[0], folHlink: C.muted } });
}
module.exports = { id: 115, slug: 'qatlam', name: 'Qatlam', category: 'business', photos: true, build, style: { tone: "tartibli hujjat jamlanmasi: bo'limlarga ajratilgan, aniq va izchil", limits: {}, prefer: null } };
