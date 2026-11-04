/**
 * 119 Hoshiya — a scholarly handout (Tufte style): a narrow serif main column carries the text, and a wide
 * right MARGIN carries sidenotes — headings, years and numbers sit in the margin beside their paragraph.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FFFFF8', ink: '111111', muted: '6B6B6B', accent: 'A00000', rule: 'D8D4C8' };
const F = { head: 'Georgia', body: 'Georgia' };
const MX = 0.9, MW = 5.4, NX = 6.65, NW = 2.85, Y = 1.3, Hc = 3.75;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d) => { const s = k.slide(C.paper); if (d.title) k.head(s, d.title, MX, 0.35, 8.6, 0.75, { max: 30, min: 15, italic: true, bold: false }); k.txt(s, String(k.idx), 0.35, 0.45, 0.45, 0.5, { size: 12, italic: true, color: C.muted }); t.line(s, NX - 0.2, Y, 0, Hc, C.rule, 0.5); k.foot(s, { x: MX, w: 8.6, y: 5.27, size: 8, font: F.body }); return s; };
  // rows: main text in the column, the note (label) in the margin at the same height
  const rows = (s, list) => { const n = list.length, rh = Hc / n; list.forEach(([note, main, noteColor], i) => { const y = Y + i * rh; k.txt(s, main, MX, y, MW, rh - 0.06, { max: 14, min: 9.5, ls: 1.3 }); k.txt(s, note, NX, y, NW, rh - 0.06, { max: 13, min: 9, italic: true, color: noteColor || C.accent }); }); };
  const R = {
    async cover(d) { const s = k.slide(C.paper); k.head(s, d.title, MX, 0.9, 5.6, 2.4, { max: 40, min: 20, italic: true, bold: false, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, MX, 3.4, 5.4, 0.75, { max: 15, italic: true, color: C.muted });
      k.txt(s, k.M.author || '', MX, 4.25, 5.4, 0.4, { size: 15 }); if (d.image) await k.photo(s, d.image, NX, 0.95, NW, 2.4, { gray: true }); k.txt(s, k.org3.replace(/ {2}\u2022 {2}/g, '\n'), NX, 3.45, NW, 1.2, { max: 11, italic: true, color: C.muted }); k.foot(s, { x: MX, w: 8.6, y: 5.27, size: 8, font: F.body }); },
    async intro(d) { const s = page(d); k.txt(s, d.text, MX, Y, MW, Hc, { max: 15, min: 10, ls: 1.4 }); await k.photo(s, d.image, NX, Y, NW, 2.2, { gray: true }); k.txt(s, `${k.TR.caption}: ${d.title}`, NX, Y + 2.3, NW, 0.6, { max: 10, italic: true, color: C.muted }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); rows(s, d.items.map((it, i) => [`\u00A7 ${i + 1}`, it])); },
    async cards(d) { const s = page(d); rows(s, d.items.map((it, i) => [`${i + 1}. ${it.h}`, it.t])); },
    async process(d) { const s = page(d); rows(s, d.steps.map((st, i) => [`${i + 1}. ${st.h}`, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, rh = Hc / n; d.stats.forEach((v, i) => { const y = Y + i * rh; k.head(s, v.value, MX, y, 2.2, rh, { max: 40, min: 16, bold: false, color: C.accent }); k.txt(s, v.label, MX + 2.35, y, MW - 2.35, rh, { max: 14, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, NX, Y, NW, Hc, { max: 12, italic: true, color: C.muted }); },
    async compare(d) { const s = page(d), { rows: rr, fs } = rowsFit([d.left.items], 14, MW, F.body, 0.1, Hc - 0.5), { rows: r2, fs: f2 } = rowsFit([d.right.items], 12, NW, F.body, 0.08, Hc - 0.5);
      k.txt(s, d.left.h, MX, Y, MW, 0.45, { size: 16, italic: true, color: C.accent }); let y = Y + 0.5; d.left.items.forEach((it, j) => { k.txt(s, `\u2014 ${it}`, MX, y, MW, rr[j], { size: fs }); y += rr[j]; });
      k.txt(s, d.right.h, NX, Y, NW, 0.45, { size: 14, italic: true, color: C.accent }); y = Y + 0.5; d.right.items.forEach((it, j) => { k.txt(s, `\u2014 ${it}`, NX, y, NW, r2[j], { size: f2, italic: true }); y += r2[j]; }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), MX, Y, MW, 2.4, { max: 30, min: 15, italic: true, bold: false, valign: 'top' }); if (d.caption) k.txt(s, d.caption, NX, Y, NW, Hc, { max: 13, italic: true, color: C.muted }); },
    async timeline(d) { const s = page(d); rows(s, d.items.map((it) => [`${it.year}\n${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, d.text, MX, Y - 0.2, MW, 3.0, { max: 30, min: 15, italic: true, bold: false, valign: 'middle' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, NX, Y + 1.0, NW, 1.0, { size: 14, italic: true, color: C.accent }); },
    async sources(d) { const s = page(d); rows(s, d.items.map((it, i) => [`[${i + 1}]`, it])); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Hoshiya', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: C.paper, accent1: C.accent, accent2: '1F4E79', accent3: '5B7F3A', accent4: 'B8860B', accent5: C.muted, accent6: C.rule, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 119, slug: 'hoshiya', name: 'Hoşiya', category: 'academic', photos: true, build, style: { tone: "ilmiy esse: asosiy matn ravon, izohlar qisqa va aniq; dalillarga tayangan", limits: {}, prefer: 'text' } };
