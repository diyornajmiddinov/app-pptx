/**
 * 133 Kesim — a geological CROSS-SECTION: wavy rock strata stacked under a grassy surface line, a depth scale
 * on the left (0 m, 10 m …), each idea is a stratum labelled on the layer; the title stands on the surface.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { sky: 'F4F8FB', ink: '2B2118', muted: '5B4B3A', grass: '6A994E', strata: ['D9B48F', 'C49A6C', 'A47551', '8B5E3C', '6F4A2F', '583822'], light: 'FFF8EE' };
const F = { head: 'Arial', body: 'Calibri' };
const TOP = 1.25, BOT = 5.2;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const strata = async (s, n) => { const H2 = (BOT - TOP) * 100, hh = H2 / n; let g = `<rect x="0" y="0" width="1000" height="10" fill="#${C.grass}"/>`;
    for (let i = 0; i < n; i++) { const y = 10 + i * (H2 - 10) / n, y2 = 10 + (i + 1) * (H2 - 10) / n, a = 8 + (i % 3) * 4; g += `<path d="M0,${y} ${Array.from({ length: 11 }, (_, j) => `Q${j * 100 + 50},${y + (j % 2 ? a : -a)} ${j * 100 + 100},${y}`).join(' ')} L1000,${y2 + 6} L0,${y2 + 6} Z" fill="#${C.strata[Math.round(i * 5 / Math.max(1, n - 1))]}"/>`;
      for (let p = 0; p < 14; p++) g += `<circle cx="${(p * 73 + i * 41) % 1000}" cy="${(y + 14 + (p * 17) % Math.max(10, y2 - y - 20)).toFixed(0)}" r="${2 + (p % 3)}" fill="#000" opacity="0.12"/>`; }
    t.img(s, await k.svg('st' + n, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${H2}">${g}</svg>`, 1000, H2), 0, TOP, 10, BOT - TOP);
    const rh = (BOT - TOP - 0.1) / n; for (let i = 0; i <= n; i++) { t.line(s, 0.15, TOP + 0.1 + i * rh, 0.25, 0, C.ink, 1); if (i < n) k.txt(s, `${i * 10} m`, 0.1, TOP + 0.12 + i * rh, 0.6, 0.22, { size: 7, bold: true, color: C.light }); }
    return Array.from({ length: n }, (_, i) => ({ y: TOP + 0.1 + i * rh, h: rh, dark: i * 5 / Math.max(1, n - 1) >= 2.5 })); };
  const page = (d) => { const s = k.slide(C.sky); if (d.title) k.head(s, d.title, 0.4, 0.3, 8.2, 0.9, { max: 26, min: 14, valign: 'bottom' }); k.txt(s, `\u2193 ${k.idx}`, 8.7, 0.3, 0.9, 0.9, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'bottom' }); return s; };
  const foot = (s) => k.foot(s, { y: 5.3, size: 7.5, color: C.ink, x: 0.4 });
  const layers = async (s, n, draw) => { const L2 = await strata(s, n); L2.forEach((b, i) => draw(i, 0.85, b.y + 0.04, 8.75, b.h - 0.08, b.dark ? C.light : C.ink, b.dark ? 'EADBC8' : C.muted)); foot(s); };
  const R = {
    async cover(d) { const s = k.slide(C.sky); t.img(s, await k.svg('cv', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="300">${C.strata.map((c, i) => `<path d="M0,${20 + i * 48} Q250,${i * 48} 500,${20 + i * 48} T1000,${20 + i * 48} L1000,300 L0,300 Z" fill="#${c}"/>`).join('')}<rect width="1000" height="12" fill="#${C.grass}"/></svg>`, 1000, 300), 0, 3.55, 10, 2.075);
      if (d.image) await k.photo(s, d.image, 6.6, 0.45, 2.9, 2.9, { mask: { r: 0.1 } }); k.txt(s, k.org3, 0.5, 0.5, 5.8, 0.35, { size: 12, bold: true, color: C.grass }); k.head(s, d.title, 0.5, 0.9, 5.9, 1.95, { max: 38, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 2.85, 5.8, 0.6, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.0, 5.0, 0.45, { size: 15, bold: true, color: C.light }); k.foot(s, { y: 5.3, size: 7.5, color: C.light }); },
    async intro(d) { const s = page(d); const Lr = await strata(s, 2); await k.photo(s, d.image, 6.4, TOP + 0.25, 3.2, 3.5, { mask: { r: 0.08 } }); t.rect(s, 0.75, TOP + 0.2, 5.5, 3.6, C.light, { t: 12, name: 'Plate' }); k.txt(s, d.text, 0.85, TOP + 0.2, 5.3, 3.6, { max: 15, min: 10, ls: 1.3, valign: 'middle', color: C.ink }); foot(s); void Lr; },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await layers(s, d.items.length, (i, x, y, w, h, c) => k.head(s, d.items[i], x, y, w, h, { max: 16, color: c })); },
    async cards(d) { const s = page(d); await layers(s, d.items.length, (i, x, y, w, h, c, c2) => { k.head(s, d.items[i].h, x, y, 2.6, h, { max: 15, color: c }); k.txt(s, d.items[i].t, x + 2.75, y, w - 2.75, h, { max: 13, color: c, valign: 'middle' }); }); },
    async process(d) { const s = page(d); await layers(s, d.steps.length, (i, x, y, w, h, c) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, 2.6, h, { max: 15, color: c }); k.txt(s, d.steps[i].t, x + 2.75, y, w - 2.75, h, { max: 13, color: c, valign: 'middle' }); }); },
    async stats(d) { const s = page(d); await layers(s, d.stats.length + (d.note ? 1 : 0), (i, x, y, w, h, c) => { if (i === d.stats.length) return k.txt(s, d.note, x, y, w, h, { max: 11, color: c, italic: true, valign: 'middle' }); k.head(s, d.stats[i].value, x, y, 2.6, h, { max: 40, min: 16, color: c }); k.txt(s, d.stats[i].label, x + 2.75, y, w - 2.75, h, { max: 14, color: c, valign: 'middle' }); }); },
    async compare(d) { const s = page(d); const Lr = await strata(s, 3); const w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.2, F.body, 0.1, 3.1);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.35 : 0.85; t.rect(s, x - 0.1, TOP + 0.25, w + 0.1, 3.75, C.light, { t: 15, name: 'Core sample' }); k.head(s, sd.h, x, TOP + 0.3, w - 0.1, 0.45, { max: 16 }); let y = TOP + 0.8; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w - 0.2, rr[j], { size: fs }); y += rr[j]; }); }); foot(s); void Lr; },
    async statement(d) { const s = page(d); await strata(s, 3); t.rect(s, 0.85, TOP + 0.35, 8.3, 2.3, C.light, { t: 8, name: 'Plate' }); k.head(s, L.runs(d.text), 1.05, TOP + 0.4, 7.9, 2.2, { max: 30, min: 14, align: 'center' }); if (d.caption) k.txt(s, d.caption, 0.85, TOP + 2.8, 8.3, 1.05, { max: 12, color: C.light, align: 'center' }); foot(s); },
    async timeline(d) { const s = page(d); await layers(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].year, x, y, 1.3, h, { max: 20, min: 11, color: c }); k.head(s, d.items[i].h, x + 1.4, y, 2.2, h, { max: 14, color: c }); k.txt(s, d.items[i].t, x + 3.75, y, w - 3.75, h, { max: 12, color: c, valign: 'middle' }); }); },
    async quote(d) { const s = page({}); await strata(s, 2); k.head(s, `\u201C${d.text}\u201D`, 0.85, TOP + 0.2, 8.6, 2.2, { max: 28, min: 14, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 0.85, TOP + 2.6, 8.6, 0.45, { size: 14, bold: true, color: C.light }); foot(s); },
    async sources(d) { const s = page(d); await layers(s, d.items.length, (i, x, y, w, h, c) => k.txt(s, d.items[i], x, y, w, h, { max: 12, color: c, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Kesim', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '583822', lt2: C.sky, accent1: C.grass, accent2: C.strata[2], accent3: C.strata[0], accent4: C.strata[4], accent5: C.muted, accent6: C.strata[1], hlink: C.grass, folHlink: C.muted } });
}
module.exports = { id: 133, slug: 'kesim', name: 'Kesim', category: 'academic', photos: true, build, style: { tone: "chuqurlashib boruvchi tahlil: sirtdan ildizgacha, qatlam-qatlam ochib beriladi", limits: {}, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "bold"], "transitions": ["split:h", "split", "cut"], "cover": ["splitH", "split"], "mark": "splitH", "deco": "splitH", "sig": {"title": "splitH", "body": "wipe:d", "item": "splitH", "image": "split", "number": "splitH", "order": "seq", "stagger": 0.12}, "tempo": 0.95, "kenburns": false};
