/**
 * 129 Lupa — focus + context: one idea is shown ENLARGED inside a magnifying glass (lens with rim and handle),
 * all the others stay small in a side list. Optical bronze rim, pale lens tint, plenty of white.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '1A1A1A', muted: '6B6B6B', rim: 'A0703A', lens: 'EAF4FB', handle: '2E2E2E', accent: '0E7490' };
const F = { head: 'Arial', body: 'Calibri' };
const LX = 0.5, LY = 0.85, LD = 3.95;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const lens = (s, x = LX, y = LY, d = LD) => { t.rect(s, x + d * 0.83, y + d * 0.83, 0.32, 1.25, C.handle, { r: 0.12, rotate: -45, name: 'Handle' }); t.oval(s, x, y, d, d, C.lens, { line: { color: C.rim, width: 9 } }); t.oval(s, x + d * 0.18, y + d * 0.12, d * 0.22, d * 0.1, 'FFFFFF', { t: 30, rotate: -30 }); };
  const inLens = (x = LX, y = LY, d = LD) => ({ x: x + d * 0.16, y: y + d * 0.2, w: d * 0.68, h: d * 0.6 });
  const page = (d) => { const s = k.slide(C.bg); lens(s); if (d.title) k.head(s, d.title, 4.9, 0.3, 4.6, 0.75, { max: 24, min: 13 }); k.txt(s, `\u00D7${k.idx}`, 0.4, 0.25, 1.2, 0.5, { size: 16, bold: true, color: C.rim }); k.foot(s, { x: 4.9, w: 4.6, y: 5.3, size: 7.5 }); return s; };
  // the rest of the items in the side list (small)
  const side = (s, list) => { const n = list.length; if (!n) return; const rh = 3.95 / n; list.forEach(([hd, tx], i) => { const y = 1.15 + i * rh; k.txt(s, [{ text: hd, options: { bold: true, color: C.accent } }, { text: tx ? '  ' + tx : '' }], 4.9, y, 4.6, rh - 0.05, { max: 13, min: 9, valign: 'middle' }); if (i < n - 1) t.line(s, 4.9, y + rh, 4.6, 0, 'E5E5E5', 0.5); }); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) { await k.photo(s, d.image, 5.35, 0.65, 3.6, 3.6, { mask: 'circle' }); } lens(s, 5.25, 0.55, 3.8); if (d.image) await k.photo(s, d.image, 5.35, 0.65, 3.6, 3.6, { mask: 'circle' }); t.oval(s, 5.25, 0.55, 3.8, 3.8, null, { line: { color: C.rim, width: 9 } });
      k.txt(s, k.org3, 0.5, 0.6, 4.4, 0.35, { size: 12, bold: true, color: C.rim }); k.head(s, d.title, 0.5, 1.0, 4.5, 2.4, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.4, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.4, 0.45, { size: 15, bold: true, color: C.accent }); k.foot(s, { y: 5.3, size: 7.5, w: 4.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, LX + 0.1, LY + 0.1, LD - 0.2, LD - 0.2, { mask: 'circle' }); t.oval(s, LX, LY, LD, LD, null, { line: { color: C.rim, width: 9 } }); k.txt(s, d.text, 4.9, 1.15, 4.6, 3.95, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d), b = inLens(); k.head(s, String(d.items.length), b.x, b.y, b.w, b.h * 0.6, { max: 90, min: 30, color: C.rim, align: 'center' }); k.txt(s, d.items[0], b.x, b.y + b.h * 0.62, b.w, b.h * 0.38, { max: 15, bold: true, align: 'center' }); side(s, d.items.map((it, i) => [`${i + 1}.`, it])); },
    async cards(d) { const s = page(d), b = inLens(), f = d.items[0]; k.head(s, f.h, b.x, b.y, b.w, 0.6, { max: 20, align: 'center', color: C.accent }); k.txt(s, f.t, b.x, b.y + 0.65, b.w, b.h - 0.65, { max: 16, min: 10, align: 'center' }); side(s, d.items.slice(1).map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d), b = inLens(), f = d.steps[0]; k.head(s, `1. ${f.h}`, b.x, b.y, b.w, 0.6, { max: 20, align: 'center', color: C.accent }); k.txt(s, f.t, b.x, b.y + 0.65, b.w, b.h - 0.65, { max: 16, min: 10, align: 'center' }); side(s, d.steps.slice(1).map((st, i) => [`${i + 2}. ${st.h}`, st.t])); },
    async stats(d) { const s = page(d), b = inLens(), f = d.stats[0]; k.head(s, f.value, b.x, b.y, b.w, b.h * 0.55, { max: 72, min: 24, align: 'center', color: C.rim }); k.txt(s, f.label, b.x, b.y + b.h * 0.58, b.w, b.h * 0.42, { max: 14, align: 'center' }); side(s, [...d.stats.slice(1).map((v) => [v.value, v.label]), ...(d.note ? [['\u2020', d.note]] : [])]); },
    async compare(d) { const s = page(d), b = inLens(), { rows: rr, fs } = rowsFit([d.left.items], 14, b.w, F.body, 0.08, b.h - 0.5), { rows: r2, fs: f2 } = rowsFit([d.right.items], 13, 4.6, F.body, 0.1, 3.4);
      k.head(s, d.left.h, b.x, b.y, b.w, 0.45, { max: 17, align: 'center', color: C.accent }); let y = b.y + 0.5; d.left.items.forEach((it, j) => { k.txt(s, it, b.x, y, b.w, rr[j], { size: fs, align: 'center' }); y += rr[j]; });
      k.head(s, d.right.h, 4.9, 1.15, 4.6, 0.45, { max: 16, color: C.rim }); y = 1.65; d.right.items.forEach((it, j) => { k.txt(s, `\u2022 ${it}`, 4.9, y, 4.6, r2[j], { size: f2 }); y += r2[j]; }); },
    async statement(d) { const s = page(d), b = inLens(); k.head(s, L.runs(d.text), b.x, b.y, b.w, b.h, { max: 26, min: 12, align: 'center' }); if (d.caption) k.txt(s, d.caption, 4.9, 1.15, 4.6, 3.95, { max: 14, color: C.muted, valign: 'middle' }); },
    async timeline(d) { const s = page(d), b = inLens(), f = d.items[0]; k.head(s, f.year, b.x, b.y, b.w, 0.8, { max: 40, min: 16, align: 'center', color: C.rim }); k.head(s, f.h, b.x, b.y + 0.82, b.w, 0.45, { max: 16, align: 'center' }); k.txt(s, f.t, b.x, b.y + 1.3, b.w, b.h - 1.3, { max: 13, align: 'center' }); side(s, d.items.slice(1).map((it) => [`${it.year} \u2022 ${it.h}`, it.t])); },
    async quote(d) { const s = page({}), b = inLens(); k.head(s, `\u201C${d.text}\u201D`, b.x, b.y, b.w, b.h, { max: 22, min: 11, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 4.9, 2.6, 4.6, 0.6, { size: 16, bold: true, color: C.accent, valign: 'middle' }); },
    async sources(d) { const s = page(d), b = inLens(); k.head(s, String(d.items.length), b.x, b.y, b.w, b.h, { max: 90, min: 30, align: 'center', color: C.rim }); side(s, d.items.map((it, i) => [`[${i + 1}]`, it])); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Lupa', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.handle, lt2: C.lens, accent1: C.accent, accent2: C.rim, accent3: '155E75', accent4: 'CA8A04', accent5: C.muted, accent6: 'D4D4D4', hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 129, slug: 'lupa', name: 'Lupa', category: 'minimalist', photos: true, build, style: { tone: "diqqat markazi: bitta asosiy fikr chuqur, qolganlari qisqa kontekst sifatida", limits: { card_t3: 150, card_t4: 110 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "playful"], "transitions": ["zoom", "circle", "fade"], "cover": ["focusIn", "zoomIn"], "mark": "zoomIn", "deco": "circle", "sig": {"title": "zoomIn", "body": "fade", "item": "focusIn", "image": "circle", "number": "zoomIn", "order": "seq", "stagger": 0.16}, "tempo": 1.0, "kenburns": true};
