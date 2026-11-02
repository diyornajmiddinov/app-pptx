/**
 * 104 Rangli maydon — every slide is ONE solid colour field (the colour changes slide by slide); no boxes,
 * no icons in circles: only type, white hairlines and a big "03/14" index in the corner.
 */
const { kit, L, rowsFit } = require('../free.js');
const FIELDS = [['E63946', 'FFFFFF'], ['1D3557', 'FFFFFF'], ['2A9D8F', 'FFFFFF'], ['F4A261', '1B1B1B'], ['6D597A', 'FFFFFF'], ['264653', 'FFFFFF'], ['E9C46A', '1B1B1B']];
const C = { ink: 'FFFFFF', muted: 'F0F0F0' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d) => {
    const [bg, fg] = FIELDS[k.idx % FIELDS.length], s = k.slide(bg); s.fg = fg;
    if (d.title) k.head(s, d.title, 0.55, 0.3, 8.0, 0.95, { max: 36, min: 18, color: fg, valign: 'top' });
    k.txt(s, `${String(k.idx + 1).padStart(2, '0')}/${String(k.n).padStart(2, '0')}`, 8.1, 4.75, 1.5, 0.55, { size: 24, bold: true, font: F.head, color: fg, align: 'right', valign: 'bottom' });
    k.foot(s, { y: 5.27, w: 7.4, color: fg, size: 8 });
    return s;
  };
  const vline = (s, x, y, h) => t.line(s, x, y, 0, h, s.fg, 0.75, { t: 40 });
  const hline = (s, x, y, w) => t.line(s, x, y, w, 0, s.fg, 0.75, { t: 40 });
  const R = {
    async cover(d) { const s = page({}); if (d.image) await k.photo(s, d.image, 5.6, 0, 4.4, 5.625);
      k.txt(s, k.org3.toUpperCase(), 0.55, 0.5, 4.8, 0.35, { size: 11, bold: true, spacing: 2, color: s.fg });
      k.head(s, d.title, 0.55, 0.95, 4.8, 2.9, { max: 48, min: 22, color: s.fg, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.55, 3.9, 4.6, 0.65, { max: 13, color: s.fg });
      k.txt(s, k.M.author || '', 0.55, 4.6, 4.6, 0.4, { size: 15, bold: true, color: s.fg }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 5.6, 1.35, 4.4, 4.27); k.txt(s, d.text, 0.55, 1.45, 4.7, 3.3, { max: 17, min: 11, color: s.fg, ls: 1.35 }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0, 1.35, 4.6, 4.27); k.txt(s, d.text, 4.95, 1.45, 4.6, 3.3, { max: 17, min: 11, color: s.fg, ls: 1.35 }); },
    async agenda(d) { const s = page(d), n = d.items.length, per = Math.ceil(n / 2), rh = 3.3 / per;
      d.items.forEach((it, i) => { const x = 0.55 + Math.floor(i / per) * 4.55, y = 1.45 + (i % per) * rh; k.txt(s, String(i + 1).padStart(2, '0'), x, y, 1.0, rh, { size: 30, bold: true, font: F.head, color: s.fg, valign: 'middle' }); k.head(s, it, x + 1.0, y, 3.3, rh, { max: 18, color: s.fg }); }); },
    async cards(d) { const s = page(d), n = d.items.length, w = 8.9 / n;
      d.items.forEach((it, i) => { const x = 0.55 + i * w; if (i) vline(s, x - 0.12, 1.5, 3.1); k.head(s, it.h, x, 1.45, w - 0.3, 0.75, { max: 18, color: s.fg, valign: 'top' }); k.txt(s, it.t, x, 2.25, w - 0.3, 2.4, { max: 14, color: s.fg }); }); },
    async process(d) { const s = page(d), n = d.steps.length, w = 8.9 / n;
      d.steps.forEach((st, i) => { const x = 0.55 + i * w; k.txt(s, `${i + 1}${i < n - 1 ? '  \u2192' : ''}`, x, 1.4, w - 0.2, 0.7, { size: 30, bold: true, font: F.head, color: s.fg }); k.head(s, st.h, x, 2.15, w - 0.3, 0.6, { max: 16, color: s.fg, valign: 'top' }); k.txt(s, st.t, x, 2.8, w - 0.3, 1.85, { max: 13, color: s.fg }); }); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 8.9 / n;
      d.stats.forEach((v, i) => { const x = 0.55 + i * w; if (i) vline(s, x - 0.12, 1.5, 2.6); k.head(s, v.value, x, 1.4, w - 0.3, 1.5, { max: 72, min: 26, color: s.fg }); k.txt(s, v.label, x, 3.0, w - 0.3, 1.1, { max: 14, color: s.fg }); });
      if (d.note) { hline(s, 0.55, 4.2, 7.3); k.txt(s, d.note, 0.55, 4.25, 7.3, 0.5, { max: 10, color: s.fg, italic: true }); } },
    async compare(d) { const s = page(d), w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 15, w - 0.3, F.body, 0.18, 2.75); t.rect(s, 4.92, 1.4, 0.06, 3.3, s.fg, { name: 'Divider' });
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.3 : 0.55; k.head(s, sd.h, x, 1.4, w, 0.6, { max: 22, color: s.fg }); let y = 2.05; sd.items.forEach((it, j) => { k.txt(s, '\u2022', x, y, 0.3, 0.3, { size: 15, bold: true, color: s.fg }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs, color: s.fg }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), 0.55, 1.4, 8.9, 2.4, { max: 48, min: 22, color: s.fg, valign: 'top' }); if (d.caption) { hline(s, 0.55, 3.95, 4.0); k.txt(s, d.caption, 0.55, 4.05, 7.3, 0.7, { max: 13, color: s.fg }); } },
    async timeline(d) { const s = page(d), n = d.items.length, w = 8.9 / n; hline(s, 0.55, 2.2, 8.9);
      d.items.forEach((it, i) => { const x = 0.55 + i * w; k.head(s, it.year, x, 1.4, w - 0.2, 0.75, { max: 34, min: 14, color: s.fg, valign: 'bottom' }); k.head(s, it.h, x, 2.35, w - 0.25, 0.55, { max: 16, color: s.fg, valign: 'top' }); k.txt(s, it.t, x, 2.9, w - 0.25, 1.75, { max: 13, color: s.fg }); }); },
    async quote(d) { const s = page({}); k.txt(s, '\u201C', 0.4, 0.1, 1.5, 1.6, { size: 140, bold: true, font: F.head, color: s.fg }); k.head(s, d.text, 0.6, 1.5, 8.6, 2.5, { max: 38, min: 18, color: s.fg, valign: 'top' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 0.6, 4.1, 7.0, 0.45, { size: 15, bold: true, color: s.fg }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.3 / n; d.items.forEach((it, i) => { const y = 1.45 + i * rh; k.txt(s, [{ text: `${i + 1}   `, options: { bold: true } }, { text: it }], 0.55, y, 8.9, rh, { max: 14, color: s.fg, valign: 'middle' }); if (i < n - 1) hline(s, 0.55, y + rh, 8.9); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Rangli maydon', colors: { dk1: '1B1B1B', lt1: 'FFFFFF', dk2: '1D3557', lt2: 'F1FAEE', accent1: 'E63946', accent2: '2A9D8F', accent3: 'F4A261', accent4: '6D597A', accent5: '264653', accent6: 'E9C46A', hlink: 'E63946', folHlink: '6D597A' } });
}
module.exports = { id: 104, slug: 'rangli-maydon', name: 'Rangli maydon', category: 'creative', photos: true, build, style: { tone: "baland ovozli va qisqa: har slaydda bitta kuchli fikr, katta harflarga mos ixcham matn", limits: { title: 45, stmt: 60 }, prefer: 'visual' } };
