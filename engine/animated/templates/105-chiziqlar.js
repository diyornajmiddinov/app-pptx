/**
 * 105 Chiziqlar — the slide is a stack of FULL-WIDTH horizontal bands: the title is the top band, every item
 * is its own band in a navy-to-aqua scale, numbers sit at the left edge. No cards, no columns.
 */
const { kit, L, rowsFit } = require('../free.js');
const B = [['0B132B', 'FFFFFF'], ['1C2541', 'FFFFFF'], ['3A506B', 'FFFFFF'], ['5BC0BE', '0B132B'], ['9FF4EA', '0B132B'], ['D8FBF6', '0B132B']];
const C = { ink: '0B132B', muted: '3A506B', accent: '5BC0BE' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const top = (s, d) => { t.rect(s, 0, 0, 10, 1.05, B[0][0], { name: 'Title band' }); k.head(s, d.title || '', 0.5, 0.12, 8.2, 0.8, { max: 28, min: 14, color: 'FFFFFF' }); k.txt(s, String(k.idx).padStart(2, '0'), 8.8, 0.12, 0.8, 0.8, { size: 22, bold: true, color: B[3][0], align: 'right', valign: 'middle' }); };
  const bottom = (s) => { t.rect(s, 0, 5.25, 10, 0.375, B[5][0], { name: 'Foot band' }); k.foot(s, { y: 5.3, color: C.muted }); };
  const bands = (s, n, draw, y0 = 1.05, y1 = 5.25) => { const h = (y1 - y0) / n; for (let i = 0; i < n; i++) { const [bg, fg] = B[Math.min(5, 1 + Math.round(i * 4 / Math.max(1, n - 1)))]; t.rect(s, 0, y0 + i * h, 10, h, bg, { name: 'Band' }); draw(i, y0 + i * h, h, fg); } };
  const page = (d) => { const s = k.slide('FFFFFF'); top(s, d); return s; };
  const R = {
    async cover(d) { const s = k.slide('FFFFFF'); bands(s, 5, () => {}, 0, 5.625); if (d.image) await k.photo(s, d.image, 6.0, 0.55, 3.5, 3.4);
      k.txt(s, k.org3, 0.5, 0.25, 5.3, 0.6, { size: 12, bold: true, color: B[3][0], valign: 'middle' });
      k.head(s, d.title, 0.5, 1.15, 5.3, 2.1, { max: 40, min: 18, color: 'FFFFFF', valign: 'middle' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.4, 5.3, 0.8, { max: 13, color: B[0][0], valign: 'middle' });
      k.txt(s, k.M.author || '', 0.5, 4.5, 5.3, 0.6, { size: 16, bold: true, color: B[0][0], valign: 'middle' }); k.foot(s, { y: 5.3, color: B[1][0] }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0, 1.05, 10, 1.9); t.rect(s, 0, 2.95, 10, 2.3, B[5][0], { name: 'Band' }); k.txt(s, d.text, 0.5, 3.05, 9.0, 2.1, { max: 15, min: 10, valign: 'middle', ls: 1.3 }); bottom(s); },
    async image(d) { const s = page(d); t.rect(s, 0, 1.05, 10, 2.3, B[4][0], { name: 'Band' }); k.txt(s, d.text, 0.5, 1.15, 9.0, 2.1, { max: 15, min: 10, valign: 'middle', ls: 1.3 }); await k.photo(s, d.image, 0, 3.35, 10, 1.9); bottom(s); },
    async agenda(d) { const s = page(d); bands(s, d.items.length, (i, y, h, fg) => { k.txt(s, String(i + 1).padStart(2, '0'), 0.5, y, 1.0, h, { size: Math.min(26, h * 36), bold: true, color: fg, valign: 'middle' }); k.head(s, d.items[i], 1.6, y, 7.9, h, { max: 20, color: fg }); }); bottom(s); },
    async cards(d) { const s = page(d); for (const [i, it] of d.items.entries()); const n = d.items.length; bands(s, n, (i, y, h, fg) => { const it = d.items[i]; k.head(s, it.h, 1.3, y + 0.05, 2.6, h - 0.1, { max: 17, color: fg }); k.txt(s, it.t, 4.1, y + 0.05, 5.4, h - 0.1, { max: 14, color: fg, valign: 'middle' }); });
      for (const [i, it] of d.items.entries()) { const h = 4.2 / n, fg = B[Math.min(5, 1 + Math.round(i * 4 / Math.max(1, n - 1)))][1]; t.img(s, await k.icon(it.icon, fg, 2), 0.55, 1.05 + i * h + h / 2 - 0.2, 0.4, 0.4); } bottom(s); },
    async process(d) { const s = page(d); bands(s, d.steps.length, (i, y, h, fg) => { const st = d.steps[i]; k.txt(s, `${i + 1} \u25B6`, 0.5, y, 1.0, h, { size: 20, bold: true, color: fg, valign: 'middle' }); k.head(s, st.h, 1.6, y + 0.05, 2.5, h - 0.1, { max: 16, color: fg }); k.txt(s, st.t, 4.3, y + 0.05, 5.2, h - 0.1, { max: 13, color: fg, valign: 'middle' }); }); bottom(s); },
    async stats(d) { const s = page(d), n = d.stats.length + (d.note ? 1 : 0); bands(s, n, (i, y, h, fg) => { if (i === d.stats.length) return k.txt(s, d.note, 0.5, y, 9.0, h, { max: 12, color: fg, italic: true, valign: 'middle' }); const v = d.stats[i]; k.head(s, v.value, 0.5, y, 3.2, h, { max: 44, min: 18, color: fg }); k.txt(s, v.label, 3.9, y, 5.6, h, { max: 16, color: fg, valign: 'middle' }); }); bottom(s); },
    async compare(d) { const s = page(d); t.rect(s, 0, 1.05, 10, 0.6, B[2][0], { name: 'Band' }); k.head(s, d.left.h, 0.5, 1.05, 4.3, 0.6, { max: 17, color: 'FFFFFF' }); k.head(s, d.right.h, 5.25, 1.05, 4.3, 0.6, { max: 17, color: 'FFFFFF' });
      const n = Math.max(d.left.items.length, d.right.items.length); bands(s, n, (i, y, h, fg) => { if (d.left.items[i]) k.txt(s, d.left.items[i], 0.5, y, 4.3, h, { max: 14, color: fg, valign: 'middle' }); if (d.right.items[i]) k.txt(s, d.right.items[i], 5.25, y, 4.3, h, { max: 14, color: fg, valign: 'middle' }); t.line(s, 5.0, y + 0.1, 0, h - 0.2, fg, 1); }, 1.65); bottom(s); },
    async statement(d) { const s = page(d); t.rect(s, 0, 1.05, 10, 0.5, B[4][0], { name: 'Band' }); t.rect(s, 0, 1.55, 10, 2.4, B[1][0], { name: 'Band' }); k.head(s, L.runs(d.text), 0.6, 1.65, 8.8, 2.2, { max: 38, min: 18, color: 'FFFFFF', align: 'center' }); t.rect(s, 0, 3.95, 10, 1.3, B[5][0], { name: 'Band' }); if (d.caption) k.txt(s, d.caption, 0.6, 4.0, 8.8, 1.2, { max: 13, align: 'center', valign: 'middle' }); bottom(s); },
    async timeline(d) { const s = page(d); bands(s, d.items.length, (i, y, h, fg) => { const it = d.items[i]; k.head(s, it.year, 0.5, y, 1.6, h, { max: 26, min: 12, color: fg }); k.head(s, it.h, 2.25, y + 0.05, 2.4, h - 0.1, { max: 16, color: fg }); k.txt(s, it.t, 4.8, y + 0.05, 4.7, h - 0.1, { max: 13, color: fg, valign: 'middle' }); }); bottom(s); },
    async quote(d) { const s = k.slide('FFFFFF'); bands(s, 3, () => {}, 0, 5.625); t.rect(s, 0, 1.6, 10, 2.4, B[0][0], { name: 'Band' }); k.head(s, `\u201C${d.text}\u201D`, 0.7, 1.7, 8.6, 2.2, { max: 32, min: 15, italic: true, color: 'FFFFFF', align: 'center' }); if (d.author) k.txt(s, d.author, 0.7, 4.2, 8.6, 0.5, { size: 15, bold: true, color: B[0][0], align: 'center', valign: 'middle' }); k.foot(s, { y: 5.3, color: B[1][0] }); },
    async sources(d) { const s = page(d); bands(s, d.items.length, (i, y, h, fg) => { k.txt(s, [{ text: `${i + 1}   `, options: { bold: true } }, { text: d.items[i] }], 0.5, y, 9.0, h, { max: 13, color: fg, valign: 'middle' }); }); bottom(s); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Chiziqlar', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: B[1][0], lt2: B[5][0], accent1: B[3][0], accent2: B[2][0], accent3: B[4][0], accent4: '1C2541', accent5: C.muted, accent6: 'D8FBF6', hlink: B[3][0], folHlink: C.muted } });
}
module.exports = { id: 105, slug: 'chiziqlar', name: 'Chiziqlar', category: 'business', photos: true, build, style: { tone: "tartibli va ravshan: har bir band bitta to'liq fikr, ketma-ket va izchil", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "bold"], "transitions": ["blinds", "wipe:r", "push:l"], "cover": ["sweepIn", "stretch"], "mark": "stretch", "deco": "stretch", "sig": {"title": "stretch", "body": "wipe:r", "item": "sweepIn", "image": "blinds", "number": "stretch", "order": "cascade", "stagger": 0.1}, "tempo": 0.9, "kenburns": false};
