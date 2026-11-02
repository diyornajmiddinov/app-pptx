/**
 * 137 Prizma — a beam of white light enters a glass PRISM and splits into a spectrum; each coloured ray lands
 * on one idea on the right. Near-black space, glowing rainbow rays, thin white type.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '0B0B12', ink: 'F5F5FA', muted: 'A9A9BC', spec: ['FF3B3B', 'FF9F1C', 'FFE14D', '3DDC84', '2EC4F1', '7B61FF'] };
const F = { head: 'Arial', body: 'Calibri' };
const PCX = 3.05, PCY = 3.05, AX = 5.8; // prism centre, ray landing x
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const prism = async (s, cx = PCX, cy = PCY, sz = 1.6) => { t.line(s, 0, cy + 0.15, cx - sz * 0.25, -0.15, 'FFFFFF', 3, { flipV: true }); t.img(s, await k.svg('pr', `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180"><polygon points="100,6 194,174 6,174" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-width="4"/><polygon points="100,30 170,160 30,160" fill="#9ad" fill-opacity="0.08"/></svg>`, 200, 180), cx - sz / 2, cy - sz * 0.48, sz, sz * 0.9); };
  // spectrum rays from the prism's right face to n anchor points; draw(i, x, y, w, h)
  const rays = async (s, n, draw, y0 = 1.05, y1 = 5.15) => { await prism(s); const rh = (y1 - y0) / n; for (let i = 0; i < n; i++) { const ay = y0 + rh * (i + 0.5), c = C.spec[Math.round(i * 5 / Math.max(1, n - 1))], sx = PCX + 0.35, sy = PCY + 0.05 + (i - (n - 1) / 2) * 0.05; t.line(s, sx, Math.min(sy, ay), AX - sx, Math.abs(ay - sy) || 0.001, c, 2.5, { flipV: ay < sy }); t.oval(s, AX - 0.07, ay - 0.07, 0.14, 0.14, c); draw(i, AX + 0.2, y0 + i * rh, 9.6 - AX - 0.2, rh, c); } };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.25, 5.2, 1.3, { max: 24, min: 13, color: C.ink, valign: 'top' }); k.txt(s, `\u03BB${k.idx}`, 0.4, 4.85, 1.2, 0.4, { size: 13, bold: true, color: C.spec[k.idx % 6] }); k.foot(s, { y: 5.32, size: 7.5, x: 1.3, w: 8.3 }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await prism(s, 6.4, 2.6, 2.2); C.spec.forEach((c, i) => t.line(s, 6.9, 2.55 + (i - 2.5) * 0.04, 3.1, Math.abs((i - 2.5) * 0.45) || 0.001, c, 3, { flipV: i < 3 })); if (d.image) await k.photo(s, d.image, 7.4, 3.75, 2.2, 1.4, { mask: { r: 0.08 } });
      k.txt(s, k.org3, 0.5, 0.55, 5.0, 0.35, { size: 12, bold: true, color: C.spec[4] }); k.head(s, d.title, 0.5, 0.95, 4.9, 2.4, { max: 36, min: 18, color: C.ink, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.8, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.8, 0.45, { size: 15, bold: true, color: C.spec[2] }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0.4, 1.7, 3.6, 3.0, { mask: { r: 0.08 } }); C.spec.forEach((c, i) => t.rect(s, 4.2, 1.7 + i * 0.5, 0.1, 0.5, c, { name: 'Spectrum' })); k.txt(s, d.text, 4.55, 1.2, 5.05, 3.9, { max: 15, min: 10, color: C.ink, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await rays(s, d.items.length, (i, x, y, w, h, c) => k.head(s, d.items[i], x, y, w, h, { max: 16, color: c })); },
    async cards(d) { const s = page(d); await rays(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 15, color: c }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.ink }); }); },
    async process(d) { const s = page(d); await rays(s, d.steps.length, (i, x, y, w, h, c) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.42, { max: 15, color: c }); k.txt(s, d.steps[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.ink }); }); },
    async stats(d) { const s = page(d); await rays(s, d.stats.length, (i, x, y, w, h, c) => { k.head(s, d.stats[i].value, x, y, 1.6, h, { max: 36, min: 14, color: c }); k.txt(s, d.stats[i].label, x + 1.7, y, w - 1.7, h, { max: 13, color: C.ink, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, 0.4, 4.25, 2.6, 0.6, { max: 9, color: C.muted }); },
    async compare(d) { const s = page(d); await prism(s); const w = 3.75, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.08, 1.45);
      [d.left, d.right].forEach((sd, i) => { const y0 = i ? 3.15 : 1.05, c = C.spec[i ? 4 : 0]; t.line(s, PCX + 0.35, Math.min(PCY, y0 + 0.2), AX - PCX - 0.35, Math.abs(y0 + 0.2 - PCY), c, 2.5, { flipV: y0 + 0.2 < PCY }); k.head(s, sd.h, AX + 0.1, y0, w, 0.4, { max: 15, color: c }); let y = y0 + 0.45; sd.items.forEach((it, j) => { k.txt(s, it, AX + 0.1, y, w, rr[j], { size: fs, color: C.ink }); y += rr[j]; }); }); },
    async statement(d) { const s = page({}); await prism(s, 1.6, 2.9, 1.5); C.spec.forEach((c, i) => t.rect(s, 2.6, 1.45 + i * 0.5, 7.0, 0.04, c, { name: 'Ray' })); k.head(s, L.runs(d.text), 2.8, 1.0, 6.8, 2.5, { max: 30, min: 14, color: C.ink }); if (d.caption) k.txt(s, d.caption, 2.8, 3.6, 6.8, 1.4, { max: 12, color: C.muted }); },
    async timeline(d) { const s = page(d); await rays(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.42, { max: 14, color: c }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.ink }); }); },
    async quote(d) { const s = page({}); await prism(s, 1.6, 2.9, 1.5); k.head(s, `\u201C${d.text}\u201D`, 2.8, 1.1, 6.8, 2.8, { max: 28, min: 14, italic: true, color: C.ink }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 2.8, 4.0, 6.8, 0.45, { size: 14, bold: true, color: C.spec[2] }); },
    async sources(d) { const s = page(d); await rays(s, d.items.length, (i, x, y, w, h, c) => k.txt(s, d.items[i], x, y, w, h, { max: 11, color: C.ink, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Prizma', colors: { dk1: C.bg, lt1: C.ink, dk2: '1C1C2B', lt2: C.muted, accent1: C.spec[0], accent2: C.spec[1], accent3: C.spec[2], accent4: C.spec[3], accent5: C.spec[4], accent6: C.spec[5], hlink: C.spec[4], folHlink: C.muted } });
}
module.exports = { id: 137, slug: 'prizma', name: 'Prizma', category: 'creative', photos: true, build, style: { tone: "bitta g'oyani ko'p qirralarga ajratish: umumiydan alohida jihatlarga, yorqin va aniq", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "elegant"], "transitions": ["p14:prism", "p14:glitter|pattern=\"hexagon\" dir=\"r\"", "fade"], "cover": ["fadeLetters", "focusIn"], "mark": "diamond", "deco": "strips", "sig": {"title": "focusIn", "body": "fade", "item": "strips", "image": "diamond", "number": "diamond", "order": "diagonal", "stagger": 0.14}, "tempo": 1.05, "kenburns": false};
