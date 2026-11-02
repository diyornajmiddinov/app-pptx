/**
 * 116 Zinapoya — a staircase: on every slide the items descend diagonally from top-left to bottom-right as
 * steps; a stepped silhouette is drawn under them; the title sits in the empty upper-right triangle.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F6F4EF', ink: '22223B', muted: '5C5C77', step: 'DAD7CD', accent: 'C1121F', pal: ['C1121F', '003049', '669BBC', 'F77F00', '2A9D8F', '6A4C93'] };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  // n stair blocks: block i at (x_i, y_i); y descends, tread silhouette drawn underneath
  const stairs = (s, n, draw, top = 0.45, bottom = 5.05) => {
    const w = 9.0 / n, h = Math.max(1.6, (bottom - top) - 0.55 * (n - 1)), dy = n > 1 ? ((bottom - top) - h) / (n - 1) : 0;
    for (let i = 0; i < n; i++) { const x = 0.5 + i * w, y = top + i * dy; t.rect(s, x, y + h - 0.1, w, 5.625 - (y + h - 0.1), C.step, { name: 'Tread' }); t.rect(s, x, y + h - 0.12, w, 0.06, C.pal[i % 6], { name: 'Nosing' }); draw(i, x + 0.12, y, w - 0.25, h - 0.2); }
  };
  const title = (s, d, x = 4.6) => { if (d.title) k.head(s, d.title, x, 0.35, 9.5 - x, 0.9, { max: 26, min: 13, align: 'right', valign: 'top' }); k.txt(s, String(k.idx).padStart(2, '0'), 8.6, 1.25, 0.9, 0.5, { size: 20, bold: true, color: C.accent, align: 'right' }); };
  const page = (d) => { const s = k.slide(C.bg); k.foot(s, { y: 5.32, size: 7.5 }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); for (let i = 0; i < 5; i++) { t.rect(s, i * 2, 4.4 - i * 0.55, 2, 5.625, C.step, { name: 'Tread' }); t.rect(s, i * 2, 4.4 - i * 0.55, 2, 0.06, C.pal[i % 6], { name: 'Nosing' }); }
      if (d.image) await k.photo(s, d.image, 6.2, 0.4, 3.3, 1.95);
      k.txt(s, k.org3, 0.5, 0.45, 5.4, 0.35, { size: 12, bold: true, color: C.accent }); k.head(s, d.title, 0.5, 0.85, 5.5, 1.9, { max: 38, min: 18, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.5, 2.8, 5.4, 0.6, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', 6.2, 2.45, 3.3, 0.4, { size: 14, bold: true, align: 'right' }); k.foot(s, { y: 5.32, size: 7.5, color: C.ink }); },
    async intro(d) { const s = page(d); title(s, d); await k.photo(s, d.image, 0.5, 0.45, 3.6, 2.6); t.rect(s, 0, 3.15, 10, 2.475, C.step, { name: 'Tread' }); t.rect(s, 0, 3.15, 10, 0.06, C.accent, { name: 'Nosing' }); k.txt(s, d.text, 0.5, 3.3, 9.0, 1.95, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { const s = page(d); title(s, d, 0.5); await k.photo(s, d.image, 5.9, 1.45, 3.6, 2.6); t.rect(s, 0, 4.15, 10, 1.475, C.step, { name: 'Tread' }); k.txt(s, d.text, 0.5, 1.35, 5.1, 2.7, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async agenda(d) { const s = page(d); title(s, d); stairs(s, d.items.length, (i, x, y, w, h) => { k.txt(s, String(i + 1), x, y, w, 0.55, { size: 22, bold: true, font: F.head, color: C.pal[i % 6] }); k.head(s, d.items[i], x, y + 0.55, w, Math.min(h - 0.55, 1.0), { max: 14, valign: 'top' }); }, 1.0); },
    async cards(d) { const s = page(d); title(s, d, 5.6); for (const [i, it] of d.items.entries()); stairs(s, d.items.length, (i, x, y, w, h) => { const it = d.items[i]; k.head(s, it.h, x, y, w, 0.5, { max: 15, color: C.pal[i % 6] }); k.txt(s, it.t, x, y + 0.52, w, h - 0.55, { max: 13 }); }); },
    async process(d) { const s = page(d); title(s, d, 5.6); stairs(s, d.steps.length, (i, x, y, w, h) => { const st = d.steps[i]; k.head(s, `${i + 1}. ${st.h}`, x, y, w, 0.5, { max: 15, color: C.pal[i % 6] }); k.txt(s, st.t, x, y + 0.52, w, h - 0.55, { max: 13 }); }); },
    async stats(d) { const s = page(d); title(s, d, 5.6); stairs(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, w, 0.95, { max: 48, min: 18, color: C.pal[i % 6] }); k.txt(s, d.stats[i].label, x, y + 0.98, w, h - 1.0, { max: 13 }); });
      if (d.note) k.txt(s, d.note, 0.5, 4.85, 5.0, 0.42, { max: 9, italic: true, color: C.muted }); },
    async compare(d) { const s = page(d); title(s, d, 0.5); const w = 4.3, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.3, F.body, 0.12, 2.9);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.2 : 0.5, y = i ? 1.95 : 1.4; t.rect(s, x, y + 3.15 - (i ? 0.55 : 0), w, 5.625, C.step, { name: 'Tread' }); k.head(s, sd.h, x, y, w, 0.5, { max: 16, color: C.pal[i ? 1 : 0] }); let yy = y + 0.55; sd.items.forEach((it, j) => { k.txt(s, '\u25B8', x, yy, 0.25, 0.3, { size: 11, color: C.pal[i ? 1 : 0] }); k.txt(s, it, x + 0.25, yy, w - 0.3, rr[j], { size: fs }); yy += rr[j]; }); }); },
    async statement(d) { const s = page(d); for (let i = 0; i < 3; i++) t.rect(s, 6.0 + i * 1.33, 4.0 - i * 0.6, 1.33, 5.625, C.step, { name: 'Tread' }); k.head(s, L.runs(d.text), 0.5, 0.5, 6.8, 2.6, { max: 36, min: 16, valign: 'top' }); if (d.caption) k.txt(s, d.caption, 0.5, 3.2, 5.3, 1.9, { max: 13, color: C.muted }); },
    async timeline(d) { const s = page(d); title(s, d, 5.6); stairs(s, d.items.length, (i, x, y, w, h) => { const it = d.items[i]; k.head(s, it.year, x, y, w, 0.5, { max: 22, min: 11, color: C.pal[i % 6] }); k.head(s, it.h, x, y + 0.5, w, 0.42, { max: 13 }); k.txt(s, it.t, x, y + 0.95, w, h - 0.98, { max: 12, color: C.muted }); }); },
    async quote(d) { const s = page({}); for (let i = 0; i < 4; i++) t.rect(s, i * 2.5, 4.6 - i * 0.35, 2.5, 5.625, C.step, { name: 'Tread' }); k.head(s, `\u201C${d.text}\u201D`, 0.8, 0.6, 8.4, 2.6, { max: 32, min: 15, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 0.8, 3.3, 8.4, 0.45, { size: 14, bold: true, color: C.accent }); },
    async sources(d) { const s = page(d); title(s, d, 4.6); const n = d.items.length, rh = 3.6 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.pal[i % 6] } }, { text: it }], 0.5 + i * 0.18, 1.4 + i * rh, 8.9 - i * 0.18, rh, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Zinapoya', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.pal[1], lt2: C.bg, accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[4], accent6: C.pal[5], hlink: C.pal[1], folHlink: C.muted } });
}
module.exports = { id: 116, slug: 'zinapoya', name: 'Zinapoya', category: 'business', photos: true, build, style: { tone: "o'sish va taraqqiyot: har bir band oldingisidan bir pog'ona yuqori, ketma-ket va aniq", limits: { card_t3: 80, card_t4: 60, step_t: 70 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "technical"], "transitions": ["push:u", "p14:pan|dir=\"u\"", "fade"], "cover": ["riseSettle", "peekUp"], "mark": "riseSettle", "deco": "riseUp", "sig": {"title": "riseSettle", "body": "fadeUp", "item": "riseSettle", "image": "wipe:u", "number": "riseSettle", "order": "diagonal", "stagger": 0.12}, "tempo": 0.95, "kenburns": false};
