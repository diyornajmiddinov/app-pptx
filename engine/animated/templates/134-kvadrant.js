/**
 * 134 Kvadrant — a consultant's 2×2 MATRIX: two arrowed axes cross in the centre, ideas are placed into the four
 * tinted quadrants (clockwise from top-left); comparisons split along the vertical axis.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '111827', muted: '4B5563', axis: '111827', q: ['DBEAFE', 'DCFCE7', 'FEF9C3', 'FFE4E6'], qa: ['1D4ED8', '15803D', 'A16207', 'BE123C'] };
const F = { head: 'Arial', body: 'Calibri' };
const MX = 0.5, MY = 1.05, MW = 9.0, MH = 4.1, CXa = MX + MW / 2, CYa = MY + MH / 2;
const Q = [[MX, MY], [CXa, MY], [CXa, CYa], [MX, CYa]]; // TL, TR, BR, BL
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const matrix = (s) => { Q.forEach(([x, y], i) => t.rect(s, x + 0.04, y + 0.04, MW / 2 - 0.08, MH / 2 - 0.08, C.q[i], { name: 'Quadrant' })); t.line(s, MX - 0.1, CYa, MW + 0.2, 0, C.axis, 2, { endArrowType: 'triangle' }); t.line(s, CXa, MY + MH + 0.05, 0, -(MH + 0.15), C.axis, 2, { endArrowType: 'triangle' }); };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.22, 8.0, 0.65, { max: 24, min: 13 }); k.txt(s, `Q${k.idx}`, 8.7, 0.22, 0.9, 0.65, { size: 16, bold: true, color: C.qa[k.idx % 4], align: 'right', valign: 'middle' }); k.foot(s, { y: 5.3, size: 7.5 }); return s; };
  // distribute n items over the 4 quadrants (clockwise), each quadrant may hold several
  const quads = (s, n, draw) => { matrix(s); const groups = [[], [], [], []]; for (let i = 0; i < n; i++) groups[n <= 4 ? i : i % 4].push(i); groups.forEach((g, qi) => { if (!g.length) return; const [x, y] = Q[qi], rh = (MH / 2 - 0.3) / g.length; g.forEach((i, j) => draw(i, qi, x + 0.25, y + 0.15 + j * rh, MW / 2 - 0.5, rh - 0.05)); }); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); const sx = 5.6, sy = 0.6, sw = 3.9, sh = 3.9; [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([a, b], i) => t.rect(s, sx + a * sw / 2 + 0.03, sy + b * sh / 2 + 0.03, sw / 2 - 0.06, sh / 2 - 0.06, C.q[i], { name: 'Quadrant' })); if (d.image) await k.photo(s, d.image, sx + sw / 2 + 0.03, sy + 0.03, sw / 2 - 0.06, sh / 2 - 0.06); t.line(s, sx - 0.1, sy + sh / 2, sw + 0.2, 0, C.axis, 2, { endArrowType: 'triangle' }); t.line(s, sx + sw / 2, sy + sh + 0.1, 0, -(sh + 0.2), C.axis, 2, { endArrowType: 'triangle' });
      k.txt(s, k.org3, 0.5, 0.6, 4.8, 0.35, { size: 12, bold: true, color: C.qa[0] }); k.head(s, d.title, 0.5, 1.0, 4.8, 2.4, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.7, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.7, 0.45, { size: 15, bold: true }); k.foot(s, { y: 5.3, size: 7.5 }); },
    async intro(d) { const s = page(d); matrix(s); await k.photo(s, d.image, Q[1][0] + 0.04, Q[1][1] + 0.04, MW / 2 - 0.08, MH - 0.08); k.txt(s, d.text, MX + 0.25, MY + 0.15, MW / 2 - 0.5, MH - 0.3, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); quads(s, d.items.length, (i, qi, x, y, w, h) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 16, color: C.qa[qi] })); },
    async cards(d) { const s = page(d); quads(s, d.items.length, (i, qi, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.45, { max: 15, color: C.qa[qi] }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 13 }); }); },
    async process(d) { const s = page(d); quads(s, d.steps.length, (i, qi, x, y, w, h) => { k.head(s, `${i + 1} \u21BB ${d.steps[i].h}`, x, y, w, 0.45, { max: 15, color: C.qa[qi] }); k.txt(s, d.steps[i].t, x, y + 0.47, w, h - 0.47, { max: 13 }); }); },
    async stats(d) { const s = page(d); quads(s, d.stats.length + (d.note ? 1 : 0), (i, qi, x, y, w, h) => { if (i === d.stats.length) return k.txt(s, d.note, x, y, w, h, { max: 11, italic: true, color: C.muted, valign: 'middle' }); k.head(s, d.stats[i].value, x, y, w, h * 0.55, { max: 46, min: 18, color: C.qa[qi] }); k.txt(s, d.stats[i].label, x, y + h * 0.57, w, h * 0.43, { max: 13 }); }); },
    async compare(d) { const s = page(d); matrix(s); const w = MW / 2 - 0.5, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.12, MH - 0.85);
      [d.left, d.right].forEach((sd, i) => { const x = i ? CXa + 0.25 : MX + 0.25; k.head(s, sd.h, x, MY + 0.12, w, 0.5, { max: 17, color: C.qa[i ? 1 : 3] }); let y = MY + 0.7; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); matrix(s); t.rect(s, MX + 1.2, MY + 0.75, MW - 2.4, MH - 1.5, 'FFFFFF', { line: { color: C.axis, width: 1.5 }, name: 'Focus' }); k.head(s, L.runs(d.text), MX + 1.4, MY + 0.8, MW - 2.8, 1.75, { max: 26, min: 13, align: 'center' }); if (d.caption) k.txt(s, d.caption, MX + 1.4, MY + 2.55, MW - 2.8, 0.75, { max: 11, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); quads(s, d.items.length, (i, qi, x, y, w, h) => { k.head(s, `${d.items[i].year} \u2014 ${d.items[i].h}`, x, y, w, 0.45, { max: 15, color: C.qa[qi] }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 13 }); }); },
    async quote(d) { const s = page({}); matrix(s); t.oval(s, CXa - 1.9, CYa - 1.9, 3.8, 3.8, 'FFFFFF', { line: { color: C.axis, width: 1.5 } }); k.head(s, `\u201C${d.text}\u201D`, CXa - 1.5, CYa - 1.2, 3.0, 2.0, { max: 20, min: 10, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author, CXa - 1.5, CYa + 0.85, 3.0, 0.4, { size: 11, bold: true, align: 'center', color: C.qa[3] }); },
    async sources(d) { const s = page(d); quads(s, d.items.length, (i, qi, x, y, w, h) => k.txt(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.qa[qi] } }, { text: d.items[i] }], x, y, w, h, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Kvadrant', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '1F2937', lt2: 'F3F4F6', accent1: C.qa[0], accent2: C.qa[1], accent3: C.qa[2], accent4: C.qa[3], accent5: C.muted, accent6: 'D1D5DB', hlink: C.qa[0], folHlink: C.muted } });
}
module.exports = { id: 134, slug: 'kvadrant', name: 'Kvadrant', category: 'business', photos: true, build, style: { tone: "konsalting tahlili: toifalash, ustuvorlik va xulosa; aniq va qisqa", limits: {}, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "calm"], "transitions": ["plus", "fade", "morph"], "cover": ["focusIn", "stretch"], "mark": "plus", "deco": "plus", "sig": {"title": "plus", "body": "fade", "item": "plus", "image": "plus", "number": "popIn", "order": "diagonal", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
