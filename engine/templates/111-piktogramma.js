/**
 * 111 Piktogramma — giant line icons carry every idea: each card, step and stat is led by a 1.4-inch pictogram,
 * text stays small underneath; lots of white space, a centred light title.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '1F2933', muted: '616E7C', pal: ['2563EB', 'DB2777', '059669', 'D97706', '7C3AED', '0891B2'] };
const F = { head: 'Arial', body: 'Calibri' };
const GEN = ['FiStar', 'FiFlag', 'FiTarget', 'FiCompass', 'FiLayers', 'FiZap'];
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const ic = async (s, name, x, y, d, c, sw = 1.25) => t.img(s, await k.icon(name, c, sw), x, y, d, d);
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 1.0, 0.25, 8.0, 0.6, { max: 22, min: 13, align: 'center', color: C.ink }); k.txt(s, String(k.idx), 4.7, 0.85, 0.6, 0.25, { size: 9, bold: true, align: 'center', color: C.pal[k.idx % 6] }); k.foot(s, { y: 5.27, align: 'center' }); return s; };
  const columns = async (s, list) => { const n = list.length, w = 9.0 / n; for (const [i, [icon, h, body]] of list.entries()) { const x = 0.5 + i * w, c = C.pal[i % 6]; await ic(s, icon, x + w / 2 - 0.7, 1.25, 1.4, c); k.head(s, h, x + 0.1, 2.8, w - 0.2, 0.5, { max: 16, align: 'center', color: c }); k.txt(s, body, x + 0.15, 3.32, w - 0.3, 1.75, { max: 13, align: 'center', color: C.muted }); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await ic(s, 'FiBookOpen', 0.6, 0.55, 2.0, C.pal[0], 1); if (d.image) await k.photo(s, d.image, 6.3, 0.6, 3.2, 3.2, { mask: 'circle' });
      k.txt(s, k.org3, 0.6, 2.75, 5.4, 0.3, { size: 12, bold: true, color: C.pal[1] }); k.head(s, d.title, 0.6, 3.05, 5.5, 1.35, { max: 36, min: 18, valign: 'top' });
      k.txt(s, [d.subtitle, k.M.author].filter(Boolean).join('  \u2022  '), 0.6, 4.45, 8.8, 0.6, { max: 13, color: C.muted, valign: 'middle' }); k.foot(s, { y: 5.27 }); },
    async intro(d) { const s = page(d); await ic(s, 'FiInfo', 0.7, 1.4, 1.5, C.pal[0]); await k.photo(s, d.image, 6.4, 1.3, 3.1, 3.6, { mask: { r: 0.1 } }); k.txt(s, d.text, 2.5, 1.3, 3.65, 3.7, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0.5, 1.3, 3.1, 3.6, { mask: { r: 0.1 } }); k.txt(s, d.text, 3.85, 1.3, 3.65, 3.7, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); await ic(s, 'FiImage', 7.8, 1.4, 1.5, C.pal[2]); },
    async agenda(d) { const s = page(d), n = d.items.length, cols = Math.min(3, n), rws = Math.ceil(n / cols), w = 9.0 / cols, h = 3.85 / rws;
      for (const [i, it] of d.items.entries()) { const x = 0.5 + (i % cols) * w, y = 1.2 + Math.floor(i / cols) * h; await ic(s, GEN[i % 6], x + 0.1, y + 0.1, Math.min(0.95, h - 0.3), C.pal[i % 6]); k.head(s, `${i + 1}. ${it}`, x + 1.2, y, w - 1.3, h, { max: 16 }); } },
    async cards(d) { const s = page(d); await columns(s, d.items.map((it) => [it.icon, it.h, it.t])); },
    async process(d) { const s = page(d); await columns(s, d.steps.map((st, i) => [GEN[i % 6], `${i + 1}. ${st.h}`, st.t])); for (let i = 1; i < d.steps.length; i++) k.txt(s, '\u2192', 0.5 + i * 9.0 / d.steps.length - 0.25, 1.75, 0.5, 0.5, { size: 22, color: 'C0C7D0', align: 'center' }); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 9.0 / n, icons = ['FiTrendingUp', 'FiBarChart2', 'FiPieChart'];
      for (const [i, v] of d.stats.entries()) { const x = 0.5 + i * w, c = C.pal[i % 6]; await ic(s, icons[i % 3], x + w / 2 - 0.55, 1.2, 1.1, c); k.head(s, v.value, x + 0.1, 2.4, w - 0.2, 0.95, { max: 46, min: 18, align: 'center', color: c }); k.txt(s, v.label, x + 0.15, 3.35, w - 0.3, 0.95, { max: 13, align: 'center', color: C.muted }); }
      if (d.note) k.txt(s, d.note, 0.5, 4.4, 9.0, 0.6, { max: 10, align: 'center', color: C.muted }); },
    async compare(d) { const s = page(d), w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.15, 2.65);
      for (const [i, sd] of [d.left, d.right].entries()) { const x = i ? 5.3 : 0.5, c = C.pal[i ? 2 : 1]; await ic(s, i ? 'FiPlusCircle' : 'FiMinusCircle', x, 1.2, 0.9, c); k.head(s, sd.h, x + 1.05, 1.2, w - 1.05, 0.9, { max: 18, color: c }); let y = 2.3; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs }); y += rr[j]; }); } },
    async statement(d) { const s = page(d); await ic(s, 'FiZap', 0.7, 1.4, 2.4, C.pal[3], 1); k.head(s, L.runs(d.text), 3.4, 1.3, 6.1, 2.4, { max: 32, min: 16 }); if (d.caption) k.txt(s, d.caption, 3.4, 3.8, 6.1, 1.2, { max: 13, color: C.muted }); },
    async timeline(d) { const s = page(d); await columns(s, d.items.map((it, i) => ['FiCalendar', `${it.year} \u2022 ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); await ic(s, 'FiMessageCircle', 4.1, 1.0, 1.8, C.pal[4], 1); k.head(s, d.text, 1.0, 2.95, 8.0, 1.5, { max: 26, min: 14, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.0, 4.5, 8.0, 0.4, { size: 13, bold: true, align: 'center', color: C.pal[4] }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.85 / n; for (const [i, it] of d.items.entries()) { const y = 1.2 + i * rh; await ic(s, 'FiBook', 0.6, y + (rh - 0.35) / 2, 0.35, C.pal[i % 6], 2); k.txt(s, it, 1.1, y, 8.4, rh, { max: 13, valign: 'middle' }); } },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Piktogramma', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '334155', lt2: 'F1F5F9', accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[4], accent6: C.pal[5], hlink: C.pal[0], folHlink: C.muted } });
}
module.exports = { id: 111, slug: 'piktogramma', name: 'Piktogramma', category: 'minimalist', photos: true, build, style: { tone: "vizual-qisqa: har bir g'oya bitta tasvir va bir-ikki jumla bilan", limits: { card_t3: 80, card_t4: 60 }, prefer: null } };
