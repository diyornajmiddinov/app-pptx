/**
 * 107 Suhbat — magazine interview: a headline and byline, then question/answer pairs in two newspaper-like
 * columns marked with big "?" glyphs, a portrait photo with a name caption, pull quotes across the page.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '1A1A1A', muted: '5C5C5C', accent: 'D7263D', rule: 'E0E0E0' };
const F = { head: 'Arial', body: 'Cambria' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d) => { const s = k.slide(C.bg); t.rect(s, 0.5, 0.3, 0.12, 0.62, C.accent, { name: 'Mark' }); if (d.title) k.head(s, d.title, 0.75, 0.25, 7.9, 0.72, { max: 26, min: 14 }); k.txt(s, String(k.idx), 8.8, 0.3, 0.7, 0.62, { size: 20, bold: true, font: F.head, color: C.accent, align: 'right', valign: 'middle' }); t.line(s, 0.5, 1.05, 9.0, 0, C.ink, 1.25); k.foot(s, { y: 5.27, font: F.head }); return s; };
  // question/answer pair: big "?" then bold question, answer in serif under it
  const qa = (s, q, a, x, y, w, h) => { k.txt(s, '?', x, y - 0.05, 0.45, 0.6, { size: 30, bold: true, font: F.head, color: C.accent }); k.txt(s, q, x + 0.45, y, w - 0.45, 0.5, { max: 15, min: 11, bold: true, font: F.head, valign: 'middle' }); k.txt(s, a, x + 0.45, y + 0.52, w - 0.45, h - 0.58, { max: 13, min: 10, ls: 1.3 }); };
  const grid2 = (s, list) => { const n = list.length, per = Math.ceil(n / 2), w = 4.3, h = 3.9 / per; t.line(s, 5.0, 1.25, 0, 3.8, C.rule, 0.75); list.forEach(([q, a], i) => qa(s, q, a, 0.5 + Math.floor(i / per) * 4.7, 1.25 + (i % per) * h, w, h)); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) { await k.photo(s, d.image, 6.0, 0, 4.0, 4.9); t.rect(s, 6.0, 4.9, 4.0, 0.725, C.ink, { name: 'Caption bar' }); k.txt(s, k.M.author || '', 6.15, 4.9, 3.7, 0.45, { size: 13, bold: true, font: F.head, color: 'FFFFFF', valign: 'middle' }); k.txt(s, k.org3, 6.15, 5.3, 3.7, 0.3, { size: 9, color: 'CCCCCC', font: F.head }); }
      k.txt(s, '\u201C', 0.4, 0.2, 1.4, 1.5, { size: 120, bold: true, font: F.head, color: C.accent });
      k.head(s, d.title, 0.55, 1.4, 5.1, 2.3, { max: 40, min: 18, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.55, 3.75, 5.0, 0.8, { max: 14, italic: true, color: C.muted });
      if (!d.image) k.txt(s, `${k.M.author || ''} \u2022 ${k.org3}`, 0.55, 4.6, 5.0, 0.4, { size: 12, bold: true, font: F.head });
      k.foot(s, { y: 5.27, w: 5.2, font: F.head }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 6.2, 1.25, 3.3, 3.75); t.rect(s, 6.2, 4.65, 3.3, 0.35, C.ink, { name: 'Caption' }); k.txt(s, k.M.author || '', 6.3, 4.65, 3.1, 0.35, { size: 10, bold: true, font: F.head, color: 'FFFFFF', valign: 'middle' });
      const words = d.text.split(' '); k.txt(s, [{ text: words[0] + ' ', options: { bold: true, font: F.head } }, { text: words.slice(1).join(' ') }], 0.5, 1.25, 5.4, 3.75, { max: 16, min: 10, ls: 1.4 }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0.5, 1.25, 3.3, 3.75); k.txt(s, d.text, 4.1, 1.25, 5.4, 3.75, { max: 16, min: 10, ls: 1.4 }); },
    async agenda(d) { const s = page(d), n = d.items.length, rh = 3.85 / n; d.items.forEach((it, i) => { const y = 1.2 + i * rh; k.txt(s, `?${i + 1}`, 0.5, y, 0.8, rh, { size: Math.min(22, rh * 30), bold: true, font: F.head, color: C.accent, valign: 'middle' }); k.txt(s, it, 1.35, y, 8.1, rh, { max: 18, font: F.head, bold: true, valign: 'middle' }); if (i < n - 1) t.line(s, 1.35, y + rh, 8.15, 0, C.rule, 0.75); }); },
    async cards(d) { const s = page(d); grid2(s, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d); grid2(s, d.steps.map((st, i) => [`${i + 1}. ${st.h}`, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 9.0 / n; d.stats.forEach((v, i) => { const x = 0.5 + i * w; if (i) t.line(s, x - 0.1, 1.35, 0, 2.6, C.rule, 0.75); k.head(s, v.value, x, 1.3, w - 0.3, 1.4, { max: 60, min: 22, color: i === 0 ? C.accent : C.ink }); k.txt(s, v.label, x, 2.8, w - 0.3, 1.2, { max: 14, italic: true, color: C.muted }); });
      if (d.note) k.txt(s, d.note, 0.5, 4.25, 9.0, 0.75, { max: 11, color: C.muted, font: F.head }); },
    async compare(d) { const s = page(d), w = 4.25, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.2, F.body, 0.14, 3.15);
      [d.left, d.right].forEach((sd, i) => { const x = 0.5 + i * (w + 0.5); t.oval(s, x, 1.3, 0.5, 0.5, i ? C.ink : C.accent); k.txt(s, i ? 'B' : 'A', x, 1.3, 0.5, 0.5, { size: 16, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' }); k.head(s, sd.h, x + 0.65, 1.3, w - 0.65, 0.5, { max: 17 }); let y = 1.95; sd.items.forEach((it, j) => { k.txt(s, `\u2014 ${it}`, x + 0.1, y, w - 0.2, rr[j], { size: fs }); y += rr[j]; }); }); t.line(s, 5.0, 1.3, 0, 3.7, C.rule, 0.75); },
    async statement(d) { const s = page(d); t.line(s, 0.5, 1.45, 9.0, 0, C.accent, 3); k.head(s, `\u201C${d.text}\u201D`, 0.8, 1.6, 8.4, 2.1, { max: 36, min: 16, italic: true, align: 'center' }); t.line(s, 0.5, 3.85, 9.0, 0, C.accent, 3); if (d.caption) k.txt(s, d.caption, 0.8, 3.95, 8.4, 1.05, { max: 13, align: 'center', color: C.muted }); },
    async timeline(d) { const s = page(d); grid2(s, d.items.map((it) => [`${it.year}: ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.txt(s, '\u201C', 0.4, 0.95, 1.5, 1.6, { size: 140, bold: true, font: F.head, color: C.accent }); k.head(s, d.text, 1.6, 1.4, 7.6, 2.5, { max: 34, min: 16, italic: true, valign: 'middle' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.6, 4.0, 7.6, 0.45, { size: 15, bold: true, font: F.head, color: C.accent }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.8 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.accent } }, { text: it }], 0.5, 1.2 + i * rh, 9.0, rh, { max: 13, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Suhbat', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: 'F5F5F5', accent1: C.accent, accent2: C.ink, accent3: '2E86AB', accent4: 'F6AE2D', accent5: C.muted, accent6: C.rule, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 107, slug: 'suhbat', name: 'Suhbat', category: 'creative', photos: true, build, style: { tone: "intervyu shakli: kartochka sarlavhalari savol kabi, matn esa aniq javob; jonli va ochiq", limits: {}, prefer: 'text' } };
