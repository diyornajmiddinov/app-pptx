/**
 * 113 Chorak — a big QUARTER CIRCLE anchored in the top-left corner holds the number and title; all content
 * is pushed to the right-hand column. On photo slides the quarter itself becomes the photo.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { q: 'E85D04', q2: 'FAA307', ink: '1C1917', muted: '57534E', bg: 'FFFBF5', rule: 'E7E0D6' };
const F = { head: 'Arial', body: 'Calibri' };
const X = 3.45, W = 6.05, Y = 0.45, Hc = 4.6;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const quarter = async (s, r, fill) => t.img(s, await k.svg(`q${r}${fill}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${r * 100}" height="${r * 100}"><path d="M0,0 L${r * 100},0 A${r * 100},${r * 100} 0 0 1 0,${r * 100} Z" fill="#${fill}"/></svg>`, r * 100, r * 100), 0, 0, r, r);
  const QM = { path: 'M0,0 L1,0 A1,1 0 0 1 0,1 Z' };
  const page = async (d, photo) => { const s = k.slide(C.bg);
    if (photo) await k.photo(s, photo, 0, 0, 3.2, 3.2, { mask: QM }); else await quarter(s, 3.2, C.q);
    t.oval(s, 8.9, 4.75, 1.6, 1.6, null, { line: { color: C.q2, width: 2 } });
    if (!photo) { k.txt(s, String(k.idx).padStart(2, '0'), 0.3, 0.25, 1.2, 0.6, { size: 26, bold: true, font: F.head, color: C.q2 }); k.head(s, d.title || '', 0.3, 0.85, 2.1, 1.35, { max: 20, min: 11, color: 'FFFFFF', valign: 'top' }); }
    else { k.head(s, d.title || '', X, Y, W, 0.6, { max: 22, min: 13, color: C.q }); }
    k.foot(s, { x: X, w: W - 0.6, y: 5.27 }); return s; };
  const list = (s, n, draw, y0 = Y, h = Hc) => { const rh = h / n; for (let i = 0; i < n; i++) { const y = y0 + i * rh; draw(i, y, rh); if (i < n - 1) t.line(s, X, y + rh, W, 0, C.rule, 0.75); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) await k.photo(s, d.image, 0, 0, 5.4, 5.4, { mask: QM }); else await quarter(s, 5.4, C.q);
      t.oval(s, 8.6, 4.4, 2.2, 2.2, null, { line: { color: C.q2, width: 2 } });
      k.txt(s, k.org3, 5.4, 0.6, 4.1, 0.6, { max: 12, bold: true, color: C.q });
      k.head(s, d.title, 5.4, 1.25, 4.1, 2.3, { max: 34, min: 16, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 5.4, 3.6, 4.0, 0.75, { max: 12, color: C.muted });
      k.txt(s, k.M.author || '', 5.4, 4.4, 3.3, 0.45, { size: 15, bold: true, color: C.q }); k.foot(s, { x: 5.4, w: 3.2, y: 5.15, size: 7.5 }); },
    async intro(d) { const s = await page(d, d.image); k.txt(s, d.text, X, Y + 0.75, W, Hc - 0.75, { max: 16, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = await page(d, d.image); k.txt(s, d.text, X, Y + 0.75, W, Hc - 0.75, { max: 16, min: 10, ls: 1.35, valign: 'middle' }); },
    async agenda(d) { const s = await page(d); list(s, d.items.length, (i, y, rh) => { k.txt(s, String(i + 1).padStart(2, '0'), X, y, 0.8, rh, { size: 20, bold: true, font: F.head, color: C.q, valign: 'middle' }); k.head(s, d.items[i], X + 0.85, y, W - 0.85, rh, { max: 18 }); }); },
    async cards(d) { const s = await page(d); list(s, d.items.length, (i, y, rh) => { const it = d.items[i]; k.head(s, it.h, X, y + 0.04, 2.0, rh - 0.08, { max: 15, color: C.q }); k.txt(s, it.t, X + 2.15, y + 0.04, W - 2.15, rh - 0.08, { max: 13, valign: 'middle' }); }); },
    async process(d) { const s = await page(d); list(s, d.steps.length, (i, y, rh) => { const st = d.steps[i]; t.oval(s, X, y + rh / 2 - 0.22, 0.44, 0.44, i === d.steps.length - 1 ? C.q : C.q2); k.txt(s, String(i + 1), X, y + rh / 2 - 0.22, 0.44, 0.44, { size: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); k.head(s, st.h, X + 0.6, y + 0.04, 1.9, rh - 0.08, { max: 15 }); k.txt(s, st.t, X + 2.6, y + 0.04, W - 2.6, rh - 0.08, { max: 13, color: C.muted, valign: 'middle' }); }); },
    async stats(d) { const s = await page(d); const n = d.stats.length + (d.note ? 1 : 0); list(s, n, (i, y, rh) => { if (i === d.stats.length) return k.txt(s, d.note, X, y, W, rh, { max: 11, italic: true, color: C.muted, valign: 'middle' }); const v = d.stats[i]; k.head(s, v.value, X, y, 2.4, rh, { max: 44, min: 18, color: i === 0 ? C.q : C.ink }); k.txt(s, v.label, X + 2.55, y, W - 2.55, rh, { max: 14, valign: 'middle' }); }); },
    async compare(d) { const s = await page(d), w = (W - 0.3) / 2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.25, F.body, 0.12, Hc - 0.75);
      [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.3); k.head(s, sd.h, x, Y, w, 0.55, { max: 17, color: i ? C.ink : C.q }); t.line(s, x, Y + 0.6, w, 0, i ? C.ink : C.q, 1.5); let y = Y + 0.72; sd.items.forEach((it, j) => { k.txt(s, '\u25E3', x, y, 0.25, 0.3, { size: 10, color: C.q2 }); k.txt(s, it, x + 0.25, y, w - 0.25, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); k.head(s, L.runs(d.text), X, Y, W, 2.8, { max: 36, min: 16, valign: 'bottom' }); t.rect(s, X, Y + 2.95, 0.9, 0.08, C.q, { name: 'Accent' }); if (d.caption) k.txt(s, d.caption, X, Y + 3.15, W, Hc - 3.2, { max: 13, color: C.muted }); },
    async timeline(d) { const s = await page(d); list(s, d.items.length, (i, y, rh) => { const it = d.items[i]; k.head(s, it.year, X, y, 1.3, rh, { max: 20, min: 11, color: C.q }); k.head(s, it.h, X + 1.4, y + 0.04, 1.9, rh - 0.08, { max: 14 }); k.txt(s, it.t, X + 3.4, y + 0.04, W - 3.4, rh - 0.08, { max: 12, color: C.muted, valign: 'middle' }); }); },
    async quote(d) { const s = await page({ title: '\u201C\u201D' }); k.head(s, d.text, X, Y + 0.3, W, 3.3, { max: 30, min: 15, italic: true, valign: 'middle' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, X, Y + 3.7, W, 0.45, { size: 14, bold: true, color: C.q }); },
    async sources(d) { const s = await page(d); list(s, d.items.length, (i, y, rh) => k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.q } }, { text: d.items[i] }], X, y, W, rh, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Chorak', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '370617', lt2: C.bg, accent1: C.q, accent2: C.q2, accent3: 'DC2F02', accent4: '9D0208', accent5: C.muted, accent6: C.rule, hlink: C.q, folHlink: C.muted } });
}
module.exports = { id: 113, slug: 'chorak', name: 'Chorak', category: 'creative', photos: true, build, style: { tone: "ixcham va dinamik: qisqa sarlavha, aniq bandlar", limits: { title: 40 }, prefer: null } };
