/**
 * 121 Oltin kesim — the slide is cut by the GOLDEN RATIO: a large square-ish field (61.8%) and smaller golden
 * rectangles; the first idea gets the biggest field, the next ones shrink along the spiral. Gold hairlines, cream ground.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F7F1E3', ink: '23201A', muted: '6E6455', gold: 'B08D57', deep: '1F3B2D' };
const F = { head: 'Georgia', body: 'Georgia' };
const A = [0, 0, 6.18, 5.625], B1 = [6.18, 0, 3.82, 3.48], B2 = [6.18, 3.48, 3.82, 2.145], B2a = [6.18, 3.48, 3.82, 1.07], B2b = [6.18, 4.55, 3.82, 1.075];
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const spiral = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="562"><g fill="none" stroke="#B08D57" stroke-width="1.6" opacity="0.55"><rect x="1" y="1" width="998" height="560"/><line x1="618" y1="0" x2="618" y2="562"/><line x1="618" y1="348" x2="1000" y2="348"/><line x1="854" y1="348" x2="854" y2="562"/><line x1="618" y1="455" x2="854" y2="455"/>
    <path d="M618,562 A562,562 0 0 1 56,0" opacity="0.6"/><path d="M618,0 A348,348 0 0 1 966,348" opacity="0.6"/><path d="M1000,348 A214,214 0 0 1 786,562" opacity="0.6"/></g></svg>`;
  const page = async (d) => { const s = k.slide(C.bg); t.img(s, await k.svg('sp', spiral, 1000, 562), 0, 0, 10, 5.625); if (d.title) k.head(s, d.title, 0.45, 0.35, 5.3, 0.95, { max: 28, min: 14, italic: true, bold: false, color: C.deep, valign: 'top' }); k.txt(s, `\u03C6 ${k.idx}`, 8.9, 5.05, 1.0, 0.45, { size: 13, italic: true, color: C.gold, align: 'right', valign: 'middle' }); k.foot(s, { x: 0.45, y: 5.3, w: 5.4, size: 7.5 }); return s; };
  const box = (r, pad = 0.3) => ({ x: r[0] + pad, y: r[1] + pad, w: r[2] - 2 * pad, h: r[3] - 2 * pad });
  const cellsFor = (n) => (n <= 2 ? [A, [6.18, 0, 3.82, 5.625]] : n === 3 ? [A, B1, B2] : [A, [6.18, 0, 3.82, 2.35], [6.18, 2.35, 3.82, 1.6], [6.18, 3.95, 3.82, 1.675]]);
  // put item i into golden cell i: first item gets the large field (below the title)
  const golden = (s, n, draw) => cellsFor(n).slice(0, n).forEach((r, i) => { const b = box(r, i ? 0.25 : 0.45); if (!i) { b.y += 1.05; b.h -= 1.45; } draw(i, b, i === 0); });
  const R = {
    async cover(d) { const s = k.slide(C.bg); t.img(s, await k.svg('sp', spiral, 1000, 562), 0, 0, 10, 5.625); if (d.image) await k.photo(s, d.image, 6.2, 0.02, 3.78, 3.46);
      k.txt(s, k.org3, 0.6, 0.6, 5.0, 0.35, { size: 11, italic: true, color: C.gold }); k.head(s, d.title, 0.6, 1.0, 5.1, 2.6, { max: 42, min: 20, italic: true, bold: false, color: C.deep, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.6, 3.7, 5.0, 0.7, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 6.45, 3.75, 3.3, 0.5, { size: 15, italic: true, color: C.deep }); k.foot(s, { x: 0.6, y: 5.25, w: 5.2, size: 7.5 }); },
    async intro(d) { const s = await page(d); await k.photo(s, d.image, 6.2, 0.02, 3.78, 3.46); const b = box(A, 0.45); k.txt(s, d.text, b.x, 1.4, b.w, 3.65, { max: 16, min: 10, ls: 1.4, valign: 'top' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = await page(d), n = d.items.length, rh = 3.65 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}  `, options: { color: C.gold, bold: true } }, { text: it }], 0.45, 1.4 + i * rh, 5.3, rh, { max: 18, valign: 'middle' })); k.head(s, String(n), 6.4, 0.4, 3.4, 2.8, { max: 120, min: 40, color: C.gold, align: 'center', bold: false }); },
    async cards(d) { const s = await page(d); golden(s, d.items.length, (i, b, big) => { k.head(s, d.items[i].h, b.x, b.y, b.w, big ? 0.6 : 0.42, { max: big ? 22 : 15, color: C.deep }); k.txt(s, d.items[i].t, b.x, b.y + (big ? 0.65 : 0.44), b.w, b.h - (big ? 0.65 : 0.44), { max: big ? 16 : 12, min: 9, color: C.muted }); }); },
    async process(d) { const s = await page(d); golden(s, d.steps.length, (i, b, big) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, b.x, b.y, b.w, big ? 0.6 : 0.42, { max: big ? 22 : 15, color: C.deep }); k.txt(s, d.steps[i].t, b.x, b.y + (big ? 0.65 : 0.44), b.w, b.h - (big ? 0.65 : 0.44), { max: big ? 16 : 12, min: 9, color: C.muted }); }); },
    async stats(d) { const s = await page(d); golden(s, d.stats.length, (i, b, big) => { k.head(s, d.stats[i].value, b.x, b.y, b.w, b.h * 0.55, { max: big ? 90 : 40, min: 16, color: big ? C.gold : C.deep, bold: false }); k.txt(s, d.stats[i].label, b.x, b.y + b.h * 0.57, b.w, b.h * 0.43, { max: big ? 16 : 11, min: 9, italic: true }); });
      if (d.note) k.txt(s, d.note, 0.45, 4.65, 5.3, 0.55, { max: 9, color: C.muted }); },
    async compare(d) { const s = await page(d), { rows: r1, fs: f1 } = rowsFit([d.left.items], 15, 5.0, F.body, 0.12, 3.0), { rows: r2, fs: f2 } = rowsFit([d.right.items], 13, 3.3, F.body, 0.1, 4.2);
      k.txt(s, d.left.h, 0.45, 1.35, 5.3, 0.45, { size: 17, italic: true, color: C.gold }); let y = 1.85; d.left.items.forEach((it, j) => { k.txt(s, it, 0.6, y, 5.0, r1[j], { size: f1 }); y += r1[j]; });
      k.txt(s, d.right.h, 6.45, 0.35, 3.3, 0.45, { size: 15, italic: true, color: C.gold }); y = 0.85; d.right.items.forEach((it, j) => { k.txt(s, it, 6.45, y, 3.3, r2[j], { size: f2 }); y += r2[j]; }); },
    async statement(d) { const s = await page(d); k.head(s, L.runs(d.text), 0.45, 1.4, 5.3, 3.5, { max: 34, min: 15, italic: true, bold: false, color: C.deep }); if (d.caption) { const b = box(B1, 0.3); k.txt(s, d.caption, b.x, b.y, b.w, b.h, { max: 14, color: C.muted, valign: 'middle' }); } },
    async timeline(d) { const s = await page(d), n = d.items.length, rh = 3.65 / n; d.items.forEach((it, i) => { const y = 1.4 + i * rh; k.head(s, it.year, 0.45, y, 1.1, rh, { max: 18, min: 10, color: C.gold, bold: false }); k.txt(s, [{ text: it.h + '. ', options: { bold: true, color: C.deep } }, { text: it.t }], 1.6, y, 4.2, rh, { max: 13, min: 9, valign: 'middle' }); });
      k.head(s, `${d.items[0].year}\n\u2193\n${d.items[n - 1].year}`, 6.4, 0.4, 3.4, 2.8, { max: 34, min: 14, color: C.gold, align: 'center', bold: false }); },
    async quote(d) { const s = await page({}); k.head(s, `\u201C${d.text}\u201D`, 0.6, 0.6, 5.2, 3.6, { max: 32, min: 15, italic: true, bold: false, color: C.deep }); if (d.author) k.txt(s, d.author, 6.45, 3.75, 3.3, 0.6, { size: 14, italic: true, color: C.gold, valign: 'middle' }); },
    async sources(d) { const s = await page(d), n = d.items.length, rh = 3.65 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}. `, options: { color: C.gold } }, { text: it }], 0.45, 1.4 + i * rh, 5.4, rh, { max: 12, min: 9, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Oltin kesim', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.deep, lt2: C.bg, accent1: C.gold, accent2: C.deep, accent3: '8C6A3F', accent4: '4E6E5D', accent5: C.muted, accent6: 'D9C9A8', hlink: C.deep, folHlink: C.muted } });
}
module.exports = { id: 121, slug: 'oltin-kesim', name: 'Oltin kesim', category: 'luxury', photos: true, build, style: { tone: "nafis va ierarxik: eng muhim fikr birinchi va eng katta, qolganlari uni to'ldiradi", limits: { card_t4: 90, step_t: 100 }, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant"], "transitions": ["fade", "circle", "morph"], "cover": ["fadeLetters", "riseWords"], "mark": "wheel", "deco": "circle", "sig": {"title": "fadeLetters", "body": "fade", "item": "arcRight", "image": "circle", "number": "wheel", "order": "seq", "stagger": 0.24}, "tempo": 1.35, "kenburns": true};
