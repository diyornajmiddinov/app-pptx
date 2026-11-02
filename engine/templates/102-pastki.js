/**
 * 102 Pastki — the title sits in a heavy BOTTOM band with a big page number; content hangs from the top
 * edge: full-height bleed columns, numbers at the foot of each column.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { band: '111111', accent: 'FF5A36', ink: '111111', muted: '555555', bg: 'F5F1EA', alt: 'EAE2D4' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k, Y = 0.35, Hc = 3.75, X = 0.5, Wc = 9.0;
  const page = (d) => {
    const s = k.slide(C.bg);
    t.rect(s, 0, 4.3, 10, 1.325, C.band, { name: 'Title band' });
    k.head(s, d.title || '', 0.5, 4.38, 7.6, 0.8, { max: 30, min: 14, color: 'FFFFFF' });
    k.txt(s, String(k.idx).padStart(2, '0'), 8.2, 4.3, 1.4, 0.95, { size: 44, bold: true, font: F.head, color: C.accent, align: 'right', valign: 'middle' });
    k.foot(s, { y: 5.27, color: '9A9A9A', size: 8 });
    return s;
  };
  const columns = (s, n, draw, top = 0) => { const w = 10 / n; for (let i = 0; i < n; i++) { t.rect(s, i * w, top, w, 4.3 - top, i % 2 ? C.alt : C.bg, { name: 'Column' }); draw(i, i * w, w); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) await k.photo(s, d.image, 0, 0, 10, 3.75); else t.rect(s, 0, 0, 10, 3.75, C.alt, { name: 'Field' });
      t.rect(s, 0, 3.75, 10, 1.875, C.band, { name: 'Title band' }); t.rect(s, 0.5, 3.6, 1.2, 0.15, C.accent, { name: 'Tab' });
      k.head(s, d.title, 0.5, 3.85, 6.6, 1.15, { max: 36, min: 16, color: 'FFFFFF' });
      k.txt(s, [k.M.author, k.org3].filter(Boolean).join('\n'), 7.2, 3.9, 2.4, 1.1, { max: 12, color: 'D0D0D0', align: 'right', valign: 'middle' });
      k.foot(s, { y: 5.3, color: '9A9A9A', size: 8 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 5.2, 0, 4.8, 4.3); k.txt(s, d.text, X, Y + 0.2, 4.4, Hc - 0.2, { max: 17, min: 11, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0, 0, 4.8, 4.3); k.txt(s, d.text, 5.3, Y + 0.2, 4.2, Hc - 0.2, { max: 17, min: 11, ls: 1.35, valign: 'middle' }); },
    async agenda(d) { const s = page(d), n = d.items.length, cols = 3, rws = Math.ceil(n / cols), w = Wc / cols, h = Hc / rws;
      d.items.forEach((it, i) => { const x = X + (i % cols) * w, y = Y + Math.floor(i / cols) * h; k.txt(s, String(i + 1).padStart(2, '0'), x, y, w - 0.2, 0.7, { size: 34, bold: true, font: F.head, color: C.accent }); k.head(s, it, x, y + 0.75, w - 0.3, h - 0.95, { max: 17, valign: 'top' }); }); },
    async cards(d) { const s = page(d), n = d.items.length; columns(s, n, async (i, x, w) => { const it = d.items[i]; k.head(s, it.h, x + 0.25, 0.4, w - 0.5, 0.7, { max: 17, valign: 'top' }); k.txt(s, it.t, x + 0.25, 1.15, w - 0.5, 2.3, { max: 14, color: C.muted }); k.txt(s, String(i + 1).padStart(2, '0'), x + 0.25, 3.45, w - 0.5, 0.75, { size: 40, bold: true, font: F.head, color: C.accent, valign: 'bottom' }); });
      for (const [i, it] of d.items.entries()) t.img(s, await k.icon(it.icon, C.ink, 2), (10 / n) * (i + 1) - 0.65, 3.65, 0.4, 0.4); },
    async process(d) { const s = page(d), n = d.steps.length; columns(s, n, (i, x, w) => { const st = d.steps[i]; k.txt(s, `${i + 1} \u2192`, x + 0.25, 0.35, w - 0.5, 0.6, { size: 24, bold: true, font: F.head, color: C.accent }); k.head(s, st.h, x + 0.25, 1.0, w - 0.5, 0.65, { max: 16, valign: 'top' }); k.txt(s, st.t, x + 0.25, 1.7, w - 0.5, 2.45, { max: 14, color: C.muted }); }); },
    async stats(d) { const s = page(d), n = d.stats.length; columns(s, n, (i, x, w) => { const v = d.stats[i]; k.head(s, v.value, x + 0.2, 0.6, w - 0.4, 1.6, { max: 72, min: 26, color: i === 0 ? C.accent : C.ink, align: 'center' }); k.txt(s, v.label, x + 0.3, 2.35, w - 0.6, 1.0, { max: 14, align: 'center', color: C.muted }); });
      if (d.note) k.txt(s, d.note, X, 3.5, Wc, 0.7, { max: 11, color: C.muted, italic: true, valign: 'bottom' }); },
    async compare(d) { const s = page(d), w = 4.3, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.3, F.body, 0.18, Hc - 0.85); t.rect(s, 4.93, 0, 0.14, 4.3, C.accent, { name: 'Divider' });
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.3 : 0.45; k.head(s, sd.h, x, Y, w, 0.65, { max: 22 }); let y = Y + 0.85; sd.items.forEach((it, j) => { k.txt(s, i ? '+' : '\u2212', x, y, 0.3, 0.3, { size: 15, bold: true, color: C.accent }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), X, Y, Wc, 2.6, { max: 44, min: 20, valign: 'bottom' }); if (d.caption) k.txt(s, d.caption, X, Y + 2.75, 6.5, 1.0, { max: 13, color: C.muted }); },
    async timeline(d) { const s = page(d), n = d.items.length, w = Wc / n; t.line(s, 0, 1.25, 10, 0, C.ink, 2);
      d.items.forEach((it, i) => { const x = X + i * w; k.head(s, it.year, x, Y, w - 0.2, 0.75, { max: 30, min: 14, color: C.accent, valign: 'bottom' }); t.oval(s, x, 1.16, 0.18, 0.18, C.ink); k.head(s, it.h, x, 1.45, w - 0.25, 0.55, { max: 16, valign: 'top' }); k.txt(s, it.t, x, 2.05, w - 0.25, 2.05, { max: 13, color: C.muted }); }); },
    async quote(d) { const s = page({ title: d.author || '' }); k.txt(s, '\u201C', X, 0.1, 1.2, 1.3, { size: 110, bold: true, font: F.head, color: C.accent }); k.head(s, d.text, X + 1.1, Y + 0.3, Wc - 1.2, 3.3, { max: 34, min: 16, italic: true, valign: 'middle' }); },
    async sources(d) { const s = page(d), n = d.items.length, half = Math.ceil(n / 2), rh = Hc / half;
      d.items.forEach((it, i) => { const x = X + Math.floor(i / half) * 4.6, y = Y + (i % half) * rh; k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.accent } }, { text: it }], x, y, 4.3, rh, { max: 13, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Pastki', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.band, lt2: C.bg, accent1: C.accent, accent2: C.band, accent3: 'C9B79C', accent4: '8C7B65', accent5: C.muted, accent6: C.alt, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 102, slug: 'pastki', name: 'Pastki', category: 'business', photos: true, build, style: { tone: "dadil va to'g'ridan-to'g'ri: avval asosiy fikr, keyin dalil; qisqa jumlalar", limits: { title: 45 }, prefer: 'data' } };
