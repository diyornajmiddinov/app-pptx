/**
 * 114 Efir — a live TV broadcast: full-bleed backdrop, the title in a LOWER-THIRD strap with an accent tab,
 * a channel bug in the corner, a news ticker carrying the meta line; content appears as on-screen graphics.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '0F172A', strap: 'FFFFFF', accent: 'E11D48', ink: '0F172A', muted: '475569', gfx: '1E293B', light: 'F1F5F9' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const backdrop = async (s, photo) => { if (photo) { await k.photo(s, photo, 0, 0, 10, 5.625, { blur: 6 }); t.rect(s, 0, 0, 10, 5.625, '0F172A', { t: 25, name: 'Dim' }); } else t.img(s, await k.svg('bd', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.3" cy="0.3" r="0.9"><stop offset="0" stop-color="#1E3A8A"/><stop offset="1" stop-color="#0B1020"/></radialGradient></defs><rect width="1600" height="900" fill="url(#g)"/><g stroke="#3B82F6" stroke-opacity="0.12">${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 90}" y1="0" x2="${i * 90 - 300}" y2="900"/>`).join('')}</g></svg>`, 1600, 900), 0, 0, 10, 5.625); };
  const chrome = (s, title) => {
    t.rect(s, 8.25, 0.3, 1.4, 0.42, C.accent, { name: 'Bug' }); k.txt(s, `\u25CF ${String(k.idx).padStart(2, '0')}`, 8.25, 0.3, 1.4, 0.42, { size: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', font: F.head });
    t.rect(s, 0.4, 4.15, 0.18, 0.62, C.accent, { name: 'Tab' }); t.rect(s, 0.58, 4.15, 8.0, 0.62, C.strap, { name: 'Lower third' });
    k.head(s, title || '', 0.75, 4.15, 7.7, 0.62, { max: 22, min: 12, color: C.ink });
    t.rect(s, 0, 5.05, 10, 0.4, C.accent, { name: 'Ticker' }); t.rect(s, 0, 5.05, 1.2, 0.4, '9F1239', { name: 'Ticker label' }); k.txt(s, (k.M.org || 'LIVE').toUpperCase().slice(0, 10), 0.05, 5.05, 1.1, 0.4, { size: 9, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    k.foot(s, { x: 1.35, y: 5.14, w: 8.5, color: 'FFFFFF', size: 8.5 });
  };
  const gfx = (s, x, y, w, h, fill = C.gfx) => t.rect(s, x, y, w, h, fill, { t: fill === C.gfx ? 10 : 0, name: 'On-screen graphic' });
  const page = async (d, photo) => { const s = k.slide(C.bg); await backdrop(s, photo); chrome(s, d.title); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await backdrop(s, d.image); t.rect(s, 0.4, 2.55, 0.25, 1.55, C.accent, { name: 'Tab' }); t.rect(s, 0.65, 2.55, 8.2, 1.55, C.strap, { name: 'Lower third' });
      k.head(s, d.title, 0.85, 2.6, 7.8, 1.0, { max: 32, min: 16, color: C.ink }); k.txt(s, d.subtitle || '', 0.85, 3.6, 7.8, 0.45, { max: 13, color: C.muted, valign: 'middle' });
      t.rect(s, 0.65, 4.1, 4.4, 0.45, C.ink, { name: 'Name strap' }); k.txt(s, `${k.M.author || ''}`, 0.8, 4.1, 4.2, 0.45, { size: 13, bold: true, color: 'FFFFFF', valign: 'middle' });
      t.rect(s, 0, 5.05, 10, 0.4, C.accent, { name: 'Ticker' }); k.foot(s, { x: 0.4, y: 5.14, w: 9.2, color: 'FFFFFF' }); },
    async intro(d) { const s = await page(d, d.image); gfx(s, 0.58, 0.5, 6.2, 3.45); k.txt(s, d.text, 0.8, 0.65, 5.8, 3.15, { max: 15, min: 10, color: C.light, ls: 1.3, valign: 'middle' }); },
    async image(d) { const s = await page(d); await k.photo(s, d.image, 5.0, 0.5, 4.5, 3.45); gfx(s, 0.58, 0.5, 4.2, 3.45); k.txt(s, d.text, 0.78, 0.65, 3.85, 3.15, { max: 15, min: 10, color: C.light, ls: 1.3, valign: 'middle' }); },
    async agenda(d) { const s = await page(d), n = d.items.length, rh = 3.45 / n; d.items.forEach((it, i) => { const y = 0.5 + i * rh; t.rect(s, 0.58, y + 0.05, 0.55, rh - 0.1, C.accent, { name: 'Num' }); k.txt(s, String(i + 1), 0.58, y + 0.05, 0.55, rh - 0.1, { size: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); t.rect(s, 1.13, y + 0.05, 6.5, rh - 0.1, C.strap, { name: 'Strap' }); k.head(s, it, 1.3, y + 0.05, 6.2, rh - 0.1, { max: 16, color: C.ink }); }); },
    async cards(d) { const s = await page(d), n = d.items.length, rh = 3.45 / n;
      for (const [i, it] of d.items.entries()) { const y = 0.5 + i * rh; t.rect(s, 0.58, y + 0.04, 2.6, rh - 0.08, C.strap, { name: 'Strap' }); t.img(s, await k.icon(it.icon, C.accent, 2), 0.68, y + rh / 2 - 0.16, 0.32, 0.32); k.head(s, it.h, 1.08, y + 0.04, 2.05, rh - 0.08, { max: 14, color: C.ink }); gfx(s, 3.18, y + 0.04, 6.3, rh - 0.08); k.txt(s, it.t, 3.3, y + 0.04, 6.05, rh - 0.08, { max: 13, color: C.light, valign: 'middle' }); } },
    async process(d) { const s = await page(d), n = d.steps.length, w = 8.9 / n; d.steps.forEach((st, i) => { const x = 0.58 + i * w; gfx(s, x, 0.5, w - 0.12, 3.45); t.rect(s, x, 0.5, w - 0.12, 0.55, i === n - 1 ? C.accent : C.strap, { name: 'Head' }); k.head(s, `${i + 1}. ${st.h}`, x + 0.1, 0.5, w - 0.32, 0.55, { max: 14, color: i === n - 1 ? 'FFFFFF' : C.ink }); k.txt(s, st.t, x + 0.12, 1.15, w - 0.36, 2.7, { max: 13, color: C.light }); }); },
    async stats(d) { const s = await page(d), n = d.stats.length, w = 8.9 / n, hh = d.note ? 2.85 : 3.45; d.stats.forEach((v, i) => { const x = 0.58 + i * w; gfx(s, x, 0.5, w - 0.15, hh); k.head(s, v.value, x + 0.15, 0.6, w - 0.45, hh * 0.5, { max: 56, min: 20, color: i === 0 ? 'FB7185' : 'FFFFFF' }); t.rect(s, x, 0.5 + hh * 0.58, w - 0.15, 0.05, C.accent, { name: 'Rule' }); k.txt(s, v.label, x + 0.15, 0.6 + hh * 0.6, w - 0.45, hh * 0.38, { max: 13, color: C.light }); });
      if (d.note) { t.rect(s, 0.58, 3.45, 8.9, 0.5, C.strap, { name: 'Strap' }); k.txt(s, d.note, 0.7, 3.45, 8.65, 0.5, { max: 11, color: C.ink, valign: 'middle' }); } },
    async compare(d) { const s = await page(d), w = 4.35, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.4, F.body, 0.12, 2.75);
      [d.left, d.right].forEach((sd, i) => { const x = 0.58 + i * (w + 0.2); gfx(s, x, 0.5, w, 3.45); t.rect(s, x, 0.5, w, 0.55, i ? C.strap : C.accent, { name: 'Head' }); k.head(s, sd.h, x + 0.15, 0.5, w - 0.3, 0.55, { max: 16, color: i ? C.ink : 'FFFFFF' }); let y = 1.15; sd.items.forEach((it, j) => { k.txt(s, it, x + 0.2, y, w - 0.4, rr[j], { size: fs, color: C.light }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); gfx(s, 0.58, 0.5, 8.9, 2.4); k.head(s, L.runs(d.text), 0.85, 0.6, 8.35, 2.2, { max: 34, min: 16, color: 'FFFFFF', align: 'center' }); if (d.caption) { t.rect(s, 0.58, 2.95, 8.9, 1.0, C.strap, { name: 'Strap' }); k.txt(s, d.caption, 0.75, 2.95, 8.55, 1.0, { max: 12, color: C.ink, valign: 'middle' }); } },
    async timeline(d) { const s = await page(d), n = d.items.length, w = 8.9 / n; d.items.forEach((it, i) => { const x = 0.58 + i * w; t.rect(s, x, 0.5, w - 0.1, 0.55, C.accent, { name: 'Year' }); k.head(s, it.year, x + 0.1, 0.5, w - 0.3, 0.55, { max: 20, min: 11, color: 'FFFFFF' }); gfx(s, x, 1.05, w - 0.1, 2.9); k.head(s, it.h, x + 0.12, 1.12, w - 0.34, 0.5, { max: 14, color: 'FFFFFF' }); k.txt(s, it.t, x + 0.12, 1.65, w - 0.34, 2.2, { max: 12, color: C.light }); }); },
    async quote(d) { const s = await page({ title: d.author || '' }); gfx(s, 0.58, 0.5, 8.9, 3.45); k.head(s, `\u201C${d.text}\u201D`, 0.9, 0.65, 8.25, 3.15, { max: 32, min: 15, italic: true, color: 'FFFFFF', align: 'center' }); },
    async sources(d) { const s = await page(d), n = d.items.length, rh = 3.45 / n; gfx(s, 0.58, 0.5, 8.9, 3.45); d.items.forEach((it, i) => k.txt(s, it, 0.8, 0.5 + i * rh, 8.45, rh, { max: 12, color: C.light, align: 'center', valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Efir', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.bg, lt2: C.light, accent1: C.accent, accent2: '1E3A8A', accent3: '3B82F6', accent4: 'FB7185', accent5: C.muted, accent6: '94A3B8', hlink: '3B82F6', folHlink: C.muted } });
}
module.exports = { id: 114, slug: 'efir', name: 'Efir', category: 'business', photos: true, build, style: { tone: "jonli efir tili: yangilik kabi qisqa, aniq va dolzarb, sarlavhalar xabar shaklida", limits: { title: 50 }, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "bold"], "transitions": ["p14:flash", "cut", "zoom"], "cover": ["popOver", "stretch"], "mark": "popOver", "deco": "flyRight", "sig": {"title": "stretch", "body": "flyRight", "item": "flyRight", "image": "zoomIn", "number": "popOver", "order": "cascade", "stagger": 0.08}, "tempo": 0.8, "kenburns": false};
