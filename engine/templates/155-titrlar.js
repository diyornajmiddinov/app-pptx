/** 155 Titrlar — film END CREDITS: black screen, everything centred on a gutter; roles in small grey caps on the right-aligned side, names/text in white on the left-aligned side. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '000000', ink: 'F5F5F5', role: '9C9C9C', accent: 'D4AF37' };
const F = { head: 'Georgia', body: 'Georgia' };
const G = 5.0, RW = 3.9, NW = 4.3;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.txt(s, d.title.toUpperCase(), 1.0, 0.3, 8.0, 0.6, { max: 18, min: 11, color: C.ink, align: 'center', valign: 'middle', spacing: 4 }); t.line(s, 4.6, 0.98, 0.8, 0, C.accent, 1); k.foot(s, { y: 5.3, size: 7, align: 'center', color: '666666' }); return s; };
  // credit lines: role (right-aligned, left of gutter) / name (left-aligned, right of gutter)
  const credits = (s, list, y0 = 1.2, y1 = 5.1) => { const n = list.length, rh = (y1 - y0) / n; list.forEach(([role, name], i) => { const y = y0 + i * rh; k.txt(s, String(role).toUpperCase(), G - 0.15 - RW, y, RW, rh, { max: 12, min: 8, color: C.role, align: 'right', valign: 'middle', spacing: 1 }); k.txt(s, name, G + 0.15, y, NW, rh, { max: 14, min: 9, color: C.ink, valign: 'middle' }); }); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); k.txt(s, (k.M.org || '').toUpperCase(), 1.0, 0.7, 8.0, 0.35, { size: 11, color: C.role, align: 'center', spacing: 4 }); if (d.image) await k.photo(s, d.image, 4.1, 1.15, 1.8, 1.2, { gray: true }); k.head(s, d.title, 1.0, d.image ? 2.45 : 1.6, 8.0, 1.4, { max: 32, min: 16, bold: false, color: C.ink, align: 'center' }); t.line(s, 4.4, d.image ? 3.95 : 3.1, 1.2, 0, C.accent, 1); k.txt(s, k.M.author || '', 1.0, d.image ? 4.05 : 3.25, 8.0, 0.45, { size: 16, color: C.ink, align: 'center', italic: true }); k.txt(s, [d.subtitle, [k.M.loc, k.M.year].filter(Boolean).join(' \u2022 ')].filter(Boolean).join('\n'), 1.0, d.image ? 4.5 : 3.8, 8.0, 0.7, { max: 11, color: C.role, align: 'center' }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, G - 0.15 - RW, 1.3, RW, 3.6, { gray: true }); k.txt(s, d.text, G + 0.15, 1.3, NW, 3.6, { max: 14, min: 9.5, color: C.ink, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); credits(s, d.items.map((it, i) => [`${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i] || i + 1}`, it])); },
    async cards(d) { const s = page(d); credits(s, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d); credits(s, d.steps.map((st, i) => [`${i + 1}. ${st.h}`, st.t])); },
    async stats(d) { const s = page(d); credits(s, [...d.stats.map((v) => [v.label, v.value]), ...(d.note ? [['\u2020', d.note]] : [])]); },
    async compare(d) { const s = page(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, NW - 0.2, F.body, 0.1, 3.4); k.txt(s, d.left.h.toUpperCase(), G - 0.15 - RW, 1.15, RW, 0.45, { size: 12, color: C.accent, align: 'right', spacing: 2 }); k.txt(s, d.right.h.toUpperCase(), G + 0.15, 1.15, NW, 0.45, { size: 12, color: C.accent, spacing: 2 });
      let y = 1.7; d.left.items.forEach((it, j) => { k.txt(s, it, G - 0.15 - RW, y, RW, rr[j], { size: fs, color: C.role, align: 'right' }); y += rr[j]; }); y = 1.7; d.right.items.forEach((it, j) => { k.txt(s, it, G + 0.15, y, NW, rr[j], { size: fs, color: C.ink }); y += rr[j]; }); t.line(s, G, 1.2, 0, 3.8, '333333', 0.75); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), 1.0, 1.3, 8.0, 2.4, { max: 28, min: 14, bold: false, color: C.ink, align: 'center' }); if (d.caption) k.txt(s, d.caption, 1.5, 3.85, 7.0, 1.1, { max: 11, color: C.role, align: 'center' }); },
    async timeline(d) { const s = page(d); credits(s, d.items.map((it) => [`${it.year} \u2022 ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, `\u201C${d.text}\u201D`, 1.2, 1.3, 7.6, 2.6, { max: 26, min: 13, italic: true, bold: false, color: C.ink, align: 'center' }); if (d.author) k.txt(s, d.author.toUpperCase(), 1.2, 4.05, 7.6, 0.4, { size: 12, color: C.accent, align: 'center', spacing: 3 }); },
    async sources(d) { const s = page(d); credits(s, d.items.map((it, i) => [`${i + 1}`, it])); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Titrlar', colors: { dk1: C.bg, lt1: C.ink, dk2: '1A1A1A', lt2: C.role, accent1: C.accent, accent2: C.role, accent3: '8B0000', accent4: '4A6FA5', accent5: '666666', accent6: '333333', hlink: C.accent, folHlink: C.role } });
}
module.exports = { id: 155, slug: 'titrlar', name: 'Titrlar', category: 'luxury', photos: true, build, style: { tone: "yakuniy titr ohangi: rol va hissa, minnatdorlik; vazmin, qisqa va hurmatli", limits: {}, prefer: 'text' } };
