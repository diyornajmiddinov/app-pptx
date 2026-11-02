/** 159 Pleer — a VIDEO PLAYER: a big screen with a play button, a scrub bar split into CHAPTERS (one per idea), and a chapter list panel on the right with thumbnails. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '0F0F0F', screen: '1C1C1C', panel: '181818', ink: 'F1F1F1', muted: 'AAAAAA', red: 'FF0033', track: '3F3F3F' };
const F = { head: 'Arial', body: 'Arial' };
const SX = 0.3, SY = 0.3, SW = 6.2, SH = 3.5;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const play = (s, cx, cy, d = 0.8) => { t.oval(s, cx - d / 2, cy - d / 2, d, d, '000000', { t: 40 }); t.shape(s, 'ISOSCELES_TRIANGLE', { x: cx - d * 0.15, y: cy - d * 0.22, w: d * 0.44, h: d * 0.44, rotate: 90, fill: { color: 'FFFFFF' }, objectName: 'Play' }); };
  // scrub bar with n chapter segments; cur = active chapter
  const scrub = (s, n, cur) => { const y = SY + SH + 0.12, w = SW, seg = w / n; for (let i = 0; i < n; i++) t.rect(s, SX + i * seg + 0.02, y, seg - 0.04, 0.07, i <= cur ? C.red : C.track, { name: 'Chapter' }); t.oval(s, SX + (cur + 0.6) * seg - 0.08, y - 0.045, 0.16, 0.16, C.red); k.txt(s, `\u25B6  \u25AE\u25AE  \u{1F50A}   ${cur + 1} / ${n}`, SX, y + 0.12, 3.5, 0.3, { size: 9, color: C.muted, valign: 'middle' }); };
  const screen = (s) => t.rect(s, SX, SY, SW, SH, C.screen, { r: 0.06, name: 'Screen' });
  const titleUnder = (s, title) => { if (title) k.head(s, title, SX, SY + SH + 0.5, SW, 0.55, { max: 18, min: 11, color: C.ink, valign: 'top' }); k.txt(s, `${k.M.author || ''} \u2022 ${k.M.org || ''}`, SX, SY + SH + 1.02, SW, 0.28, { max: 9, color: C.muted }); };
  // chapter list panel on the right
  const chapters = (s, list, cur) => { t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Chapters' }); const n = list.length, rh = 4.8 / n; list.forEach(([h2, tx], i) => { const y = SY + 0.1 + i * rh; if (i === cur) t.rect(s, 6.8, y, 2.85, rh - 0.04, '2A2A2A', { r: 0.04, name: 'Active' }); t.rect(s, 6.88, y + 0.06, 0.62, Math.min(0.42, rh - 0.16), i === cur ? C.red : C.track, { r: 0.03, name: 'Thumb' }); k.txt(s, String(i + 1).padStart(2, '0'), 6.88, y + 0.06, 0.62, Math.min(0.42, rh - 0.16), { size: 10, bold: true, color: C.ink, align: 'center', valign: 'middle' }); k.txt(s, [{ text: h2, options: { bold: true, color: C.ink } }, ...(tx ? [{ text: '\n' + tx, options: { color: C.muted } }] : [])], 7.58, y, 2.02, rh - 0.04, { max: 10, min: 7, valign: 'middle', ls: 1.1 }); }); };
  const page = (d) => { const s = k.slide(C.bg); screen(s); return s; };
  const foot = (s) => k.foot(s, { x: SX, y: 5.32, w: 9.4, size: 7, color: '777777' });
  // main screen shows the first item large; panel lists all (chapter 1 active)
  const feature = (s, h2, tx, d, list) => { k.head(s, h2, SX + 0.4, SY + 0.35, SW - 0.8, 0.7, { max: 26, min: 14, color: C.ink }); k.txt(s, tx || '', SX + 0.4, SY + 1.1, SW - 0.8, SH - 1.3, { max: 15, min: 9.5, color: 'DDDDDD', ls: 1.3 }); scrub(s, list.length, 0); titleUnder(s, d.title); chapters(s, list, 0); foot(s); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); screen(s); if (d.image) await k.photo(s, d.image, SX, SY, SW, SH, { mask: { r: 0.06 } }); play(s, SX + SW / 2, SY + SH / 2, 1.0); scrub(s, 5, 0); k.head(s, d.title, SX, SY + SH + 0.5, SW, 0.6, { max: 20, min: 12, color: C.ink, valign: 'top' }); k.txt(s, `${k.M.author || ''} \u2022 ${k.org3}`, SX, SY + SH + 1.1, SW, 0.3, { max: 10, color: C.muted });
      t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Panel' }); k.txt(s, d.subtitle || k.M.topic || '', 6.95, SY + 0.2, 2.6, 4.6, { max: 13, color: 'DDDDDD', valign: 'top' }); foot(s); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, SX, SY, SW, SH, { mask: { r: 0.06 } }); play(s, SX + SW / 2, SY + SH / 2); scrub(s, 4, 0); titleUnder(s, d.title); t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Panel' }); k.txt(s, d.text, 6.95, SY + 0.15, 2.6, 4.7, { max: 12, min: 8.5, color: 'DDDDDD', ls: 1.25, valign: 'top' }); foot(s); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); play(s, SX + SW / 2, SY + SH / 2, 1.1); scrub(s, d.items.length, 0); titleUnder(s, d.title); chapters(s, d.items.map((it) => [it, '']), 0); foot(s); },
    async cards(d) { const s = page(d); feature(s, d.items[0].h, d.items[0].t, d, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d); feature(s, `1. ${d.steps[0].h}`, d.steps[0].t, d, d.steps.map((st) => [st.h, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, w = (SW - 0.6) / n; d.stats.forEach((v, i) => { k.head(s, v.value, SX + 0.3 + i * w, SY + 0.6, w - 0.1, 1.2, { max: 44, min: 16, color: i ? C.ink : C.red, align: 'center' }); k.txt(s, v.label, SX + 0.3 + i * w, SY + 1.9, w - 0.1, 1.4, { max: 12, color: C.muted, align: 'center' }); }); scrub(s, n, n - 1); titleUnder(s, d.title); chapters(s, [...d.stats.map((v) => [v.value, v.label]), ...(d.note ? [['\u2020', d.note]] : [])], 0); foot(s); },
    async compare(d) { const s = page(d), w = SW / 2 - 0.35, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.08, SH - 0.75); [d.left, d.right].forEach((sd, i) => { const x = SX + 0.25 + i * (w + 0.2); k.head(s, sd.h, x, SY + 0.15, w, 0.45, { max: 15, color: i ? C.ink : C.red }); let y = SY + 0.65; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: 'DDDDDD' }); y += rr[j]; }); }); t.line(s, SX + SW / 2, SY + 0.2, 0, SH - 0.4, C.track, 1); scrub(s, 2, 1); titleUnder(s, d.title); chapters(s, [[d.left.h, ''], [d.right.h, '']], 0); foot(s); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), SX + 0.4, SY + 0.3, SW - 0.8, SH - 0.6, { max: 28, min: 13, color: C.ink, align: 'center' }); scrub(s, 3, 1); titleUnder(s, d.title); t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Panel' }); k.txt(s, d.caption || '', 6.95, SY + 0.15, 2.6, 4.7, { max: 12, color: C.muted, valign: 'middle' }); foot(s); },
    async timeline(d) { const s = page(d); feature(s, `${d.items[0].year} \u2022 ${d.items[0].h}`, d.items[0].t, d, d.items.map((it) => [`${it.year} \u2022 ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, `\u201C${d.text}\u201D`, SX + 0.4, SY + 0.3, SW - 0.8, SH - 0.6, { max: 26, min: 13, italic: true, color: C.ink, align: 'center' }); scrub(s, 3, 2); titleUnder(s, d.author || ''); t.rect(s, 6.75, SY, 2.95, 5.0, C.panel, { r: 0.06, name: 'Panel' }); foot(s); },
    async sources(d) { const s = page(d); play(s, SX + SW / 2, SY + SH / 2, 0.9); scrub(s, d.items.length, d.items.length - 1); titleUnder(s, d.title); chapters(s, d.items.map((it) => [it, '']), d.items.length - 1); foot(s); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Pleer', colors: { dk1: C.bg, lt1: C.ink, dk2: C.screen, lt2: C.muted, accent1: C.red, accent2: '3EA6FF', accent3: 'FFD600', accent4: '00C853', accent5: C.muted, accent6: C.track, hlink: '3EA6FF', folHlink: C.muted } });
}
module.exports = { id: 159, slug: 'pleer', name: 'Pleer', category: 'business', photos: true, build, style: { tone: "video darslik: boblarga bo'lingan, har bob qisqa sarlavha va lo'nda izoh bilan", limits: { card_t4: 100, step_t: 100, event_t: 90 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "technical"], "transitions": ["zoom", "fade", "cut"], "cover": ["focusIn", "stretch"], "mark": "popIn", "deco": "stretch", "sig": {"title": "focusIn", "body": "fade", "item": "stretch", "image": "zoomIn", "number": "popIn", "order": "seq", "stagger": 0.12}, "tempo": 0.9, "kenburns": true};
