/**
 * 127 O'rgimchak — a radar / spider-web chart sits in the centre of the slide; each idea hangs at the end of a
 * spoke in a corner or side, joined to the web by a thread. Light slate web, violet and lime accents.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F5F7FA', ink: '1E1B2E', muted: '5B5870', web: 'A3A9BA', fill: '7C3AED', accent: '84CC16' };
const F = { head: 'Arial', body: 'Calibri' };
const CX = 5.0, CY = 3.15, RW = 1.25;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const web = async (s, n, r = RW, cx = CX, cy = CY) => { const N = Math.max(5, n), P = 200; let g = '';
    for (let ring = 1; ring <= 4; ring++) { const rr = (ring / 4) * 190; g += `<polygon points="${Array.from({ length: N }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N; return `${(P + rr * Math.cos(a)).toFixed(1)},${(P + rr * Math.sin(a)).toFixed(1)}`; }).join(' ')}" fill="none" stroke="#${C.web}" stroke-width="2"/>`; }
    for (let i = 0; i < N; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / N; g += `<line x1="${P}" y1="${P}" x2="${(P + 190 * Math.cos(a)).toFixed(1)}" y2="${(P + 190 * Math.sin(a)).toFixed(1)}" stroke="#${C.web}" stroke-width="2"/>`; }
    g += `<polygon points="${Array.from({ length: N }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N, rr = 190 * (0.55 + 0.4 * ((i * 37) % 10) / 10); return `${(P + rr * Math.cos(a)).toFixed(1)},${(P + rr * Math.sin(a)).toFixed(1)}`; }).join(' ')}" fill="#${C.fill}" fill-opacity="0.25" stroke="#${C.fill}" stroke-width="3"/>`;
    t.img(s, await k.svg('web' + N, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">${g}</svg>`, 400, 400), cx - r, cy - r, 2 * r, 2 * r); };
  // anchor boxes around the web: corners for 3–4 items, two side columns for 5–6
  const slots = (n) => { if (n <= 4) { const S = [[0.4, 1.1, 'right'], [6.4, 1.1, 'left'], [0.4, 3.3, 'right'], [6.4, 3.3, 'left']]; return n === 3 ? [S[0], S[1], [6.4, 3.3, 'left']] : S.slice(0, n); } const per = Math.ceil(n / 2), h = 4.0 / per; return Array.from({ length: n }, (_, i) => [i < per ? 0.4 : 6.4, 1.1 + (i % per) * h, i < per ? 'right' : 'left', h]); };
  const around = (s, n, draw) => { slots(n).forEach(([x, y, al, h], i) => { const w = 3.2, hh = h || 1.95, ax = al === 'right' ? x + w : x, ay = y + 0.25; t.line(s, Math.min(ax, CX), Math.min(ay, CY), Math.abs(CX - ax), Math.abs(CY - ay), C.web, 0.75, { dash: 'sysDot', flipV: (CX - ax) * (CY - ay) < 0 }); t.oval(s, ax - 0.07, ay - 0.07, 0.14, 0.14, i % 2 ? C.accent : C.fill); draw(i, x, y, w, hh - 0.1, al); }); };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.25, 8.2, 0.65, { max: 24, min: 13, align: 'center', x: 0 }); k.txt(s, String(k.idx), 9.0, 0.25, 0.6, 0.65, { size: 16, bold: true, color: C.fill, align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await web(s, 6, 2.3, 7.2, 2.8); if (d.image) await k.photo(s, d.image, 6.4, 2.0, 1.6, 1.6, { mask: 'circle' });
      k.txt(s, k.org3, 0.45, 0.6, 4.4, 0.35, { size: 12, bold: true, color: C.fill }); k.head(s, d.title, 0.45, 1.0, 4.4, 2.4, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.45, 3.45, 4.3, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.45, 4.3, 4.3, 0.45, { size: 15, bold: true }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); await web(s, 5, 1.6, 2.4, 3.05); await k.photo(s, d.image, 1.5, 2.15, 1.8, 1.8, { mask: 'circle' }); k.txt(s, d.text, 4.6, 1.05, 5.0, 4.1, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await web(s, d.items.length); around(s, d.items.length, (i, x, y, w, h, al) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, Math.min(h, 0.9), { max: 15, align: al })); },
    async cards(d) { const s = page(d); await web(s, d.items.length); around(s, d.items.length, (i, x, y, w, h, al) => { k.head(s, d.items[i].h, x, y, w, 0.45, { max: 15, align: al, color: C.fill }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: al }); }); },
    async process(d) { const s = page(d); await web(s, d.steps.length); around(s, d.steps.length, (i, x, y, w, h, al) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.45, { max: 15, align: al, color: C.fill }); k.txt(s, d.steps[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: al }); }); },
    async stats(d) { const s = page(d); await web(s, d.stats.length); around(s, d.stats.length, (i, x, y, w, h, al) => { k.head(s, d.stats[i].value, x, y, w, 0.85, { max: 40, min: 16, align: al, color: i % 2 ? '4D7C0F' : C.fill }); k.txt(s, d.stats[i].label, x, y + 0.87, w, h - 0.87, { max: 12, align: al }); });
      if (d.note) k.txt(s, d.note, 6.4, 4.55, 3.2, 0.6, { max: 9, color: C.muted }); },
    async compare(d) { const s = page(d); await web(s, 5, 1.0); const w = 3.4, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.12, 3.3);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 6.2 : 0.4, al = i ? 'left' : 'right'; k.head(s, sd.h, x, 1.1, w, 0.45, { max: 16, align: al, color: i ? '4D7C0F' : C.fill }); let y = 1.65; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: al }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); await web(s, 6, 2.0, 5.0, 3.1); t.rect(s, 1.6, 2.1, 6.8, 2.0, C.bg, { t: 10, name: 'Plate' }); k.head(s, L.runs(d.text), 1.7, 2.15, 6.6, 1.9, { max: 26, min: 13, align: 'center' }); if (d.caption) k.txt(s, d.caption, 0.4, 4.3, 9.2, 0.9, { max: 11, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); await web(s, d.items.length); around(s, d.items.length, (i, x, y, w, h, al) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.45, { max: 14, align: al, color: C.fill }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: al }); }); },
    async quote(d) { const s = page({}); await web(s, 6, 1.4, 1.9, 3.0); k.head(s, `\u201C${d.text}\u201D`, 3.7, 1.2, 5.8, 2.9, { max: 28, min: 14, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 3.7, 4.2, 5.8, 0.45, { size: 14, bold: true, color: C.fill }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 4.0 / n; d.items.forEach((it, i) => { const y = 1.1 + i * rh; t.line(s, 0.4, y + rh / 2, 0.35, 0, C.web, 0.75); t.oval(s, 0.75, y + rh / 2 - 0.07, 0.14, 0.14, i % 2 ? C.accent : C.fill); k.txt(s, it, 1.05, y, 8.5, rh, { max: 12, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: "SlideAI O'rgimchak", colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '312E81', lt2: C.bg, accent1: C.fill, accent2: C.accent, accent3: '06B6D4', accent4: 'F43F5E', accent5: C.muted, accent6: C.web, hlink: C.fill, folHlink: C.muted } });
}
module.exports = { id: 127, slug: 'orgimchak', name: "O'rgimchak", category: 'business', photos: true, build, style: { tone: "ko'p o'lchovli tahlil: har bir yo'nalish alohida, lekin umumiy markazga bog'langan", limits: { card_t4: 110, card_t3: 120, side_item: 50 }, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "elegant"], "transitions": ["circle", "p14:vortex|dir=\"r\"", "fade"], "cover": ["focusIn", "wheel"], "mark": "wheel", "deco": "wheel", "sig": {"title": "wheel", "body": "fade", "item": "wheel", "image": "wheel", "number": "popOver", "order": "centerOut", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
