/**
 * 118 Ilon yo'l — a winding road: a thick dashed-centre road snakes across the slide and the ideas sit at its
 * bends, alternating above and below the road. Lists, steps, years and numbers all travel along the same road.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'EEF4E8', road: '3D405B', ink: '2B2D42', muted: '5C5F73', pal: ['E07A5F', '81B29A', 'F2CC8F', '3D405B', 'E07A5F', '81B29A'] };
const F = { head: 'Arial', body: 'Calibri' };
const RY = 3.05, AMP = 0.42;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const roadSvg = (n) => { const pts = []; for (let x = 0; x <= 1000; x += 10) pts.push(`${x},${(100 + AMP * 100 * Math.sin((x / 1000) * n * Math.PI)).toFixed(1)}`);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="200"><polyline points="${pts.join(' ')}" fill="none" stroke="#${C.road}" stroke-width="34" stroke-linecap="round"/><polyline points="${pts.join(' ')}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="14 12"/></svg>`; };
  const road = async (s, n) => t.img(s, await k.svg('road' + n, roadSvg(n), 1000, 200), 0, RY - 1.0, 10, 2.0);
  const yAt = (x, n) => RY + AMP * Math.sin((x / 10) * n * Math.PI);
  // nodes along the road; even items above the road, odd items below; each box may span ~2 node widths
  const along = async (s, n, draw) => { await road(s, n); const cw = 10 / n;
    for (let i = 0; i < n; i++) { const cx = (i + 0.5) * cw, cy = yAt(cx, n), up = i % 2 === 0, bw = Math.min(4.2, 2 * cw - 0.3), bx = Math.max(0.35, Math.min(9.65 - bw, cx - bw / 2));
      t.oval(s, cx - 0.22, cy - 0.22, 0.44, 0.44, C.pal[i % 6], { line: { color: 'FFFFFF', width: 2 } }); k.txt(s, String(i + 1), cx - 0.22, cy - 0.22, 0.44, 0.44, { size: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      t.line(s, cx, up ? 2.5 : cy + 0.22, 0, up ? cy - 0.22 - 2.5 : 3.75 - cy - 0.22, C.pal[i % 6], 1.25, { dash: 'dash' });
      draw(i, bx, up ? 1.15 : 3.8, bw, up ? 1.33 : 1.38); } };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.25, 7.8, 0.75, { max: 26, min: 14 }); k.txt(s, String(k.idx).padStart(2, '0'), 8.6, 0.25, 1.0, 0.75, { size: 24, bold: true, color: C.pal[0], align: 'right', valign: 'middle' }); k.foot(s, { y: 5.3, size: 7.5 }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); t.img(s, await k.svg('roadC', roadSvg(3), 1000, 200), 0, 3.6, 10, 2.0); if (d.image) await k.photo(s, d.image, 6.4, 0.45, 3.1, 2.9, { mask: { r: 0.15 } });
      k.txt(s, k.org3, 0.5, 0.5, 5.6, 0.35, { size: 12, bold: true, color: C.pal[0] }); k.head(s, d.title, 0.5, 0.9, 5.7, 2.0, { max: 38, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 2.95, 5.6, 0.6, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 3.55, 5.0, 0.4, { size: 15, bold: true, color: C.road }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); t.img(s, await k.svg('roadL', roadSvg(2), 1000, 200), 0, 4.15, 10, 1.2); await k.photo(s, d.image, 0.4, 1.15, 3.4, 2.95, { mask: { r: 0.12 } }); k.txt(s, d.text, 4.1, 1.1, 5.5, 3.05, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { const s = page(d); t.img(s, await k.svg('roadL', roadSvg(2), 1000, 200), 0, 4.15, 10, 1.2); k.txt(s, d.text, 0.4, 1.1, 5.5, 3.05, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); await k.photo(s, d.image, 6.2, 1.15, 3.4, 2.95, { mask: { r: 0.12 } }); },
    async agenda(d) { const s = page(d); await along(s, d.items.length, (i, x, y, w, h) => k.head(s, d.items[i], x, y, w, h, { max: 16, align: 'center', valign: i % 2 ? 'top' : 'bottom' })); },
    async cards(d) { const s = page(d); await along(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.4, { max: 14, align: 'center', color: C.pal[i % 6] === 'F2CC8F' ? 'B08442' : C.pal[i % 6] }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.42, { max: 12, align: 'center', color: C.muted }); }); },
    async process(d) { const s = page(d); await along(s, d.steps.length, (i, x, y, w, h) => { k.head(s, d.steps[i].h, x, y, w, 0.4, { max: 14, align: 'center' }); k.txt(s, d.steps[i].t, x, y + 0.42, w, h - 0.42, { max: 12, align: 'center', color: C.muted }); }); },
    async stats(d) { const s = page(d); await along(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, w, 0.75, { max: 40, min: 16, align: 'center', color: C.pal[i % 6] === 'F2CC8F' ? 'B08442' : C.pal[i % 6] }); k.txt(s, d.stats[i].label, x, y + 0.78, w, h - 0.78, { max: 12, align: 'center' }); });
      if (d.note) k.txt(s, d.note, 5.2, 1.15, 4.4, 1.3, { max: 10, italic: true, color: C.muted, valign: 'bottom', align: 'right' }); },
    async compare(d) { const s = page(d), w = 4.1, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.25, F.body, 0.12, 3.35); t.rect(s, 4.8, 1.05, 0.4, 4.2, C.road, { name: 'Road' }); t.line(s, 5.0, 1.15, 0, 4.0, 'FFFFFF', 1.5, { dash: 'dash' });
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.45 : 0.45; k.head(s, sd.h, x, 1.15, w, 0.5, { max: 17, color: C.pal[i ? 1 : 0], align: i ? 'left' : 'right' }); let y = 1.75; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: i ? 'left' : 'right' }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); t.img(s, await k.svg('roadL', roadSvg(2), 1000, 200), 0, 4.15, 10, 1.2); k.head(s, L.runs(d.text), 0.6, 1.15, 8.8, 2.1, { max: 34, min: 16, align: 'center' }); if (d.caption) k.txt(s, d.caption, 0.8, 3.3, 8.4, 0.85, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); await along(s, d.items.length, (i, x, y, w, h) => { const it = d.items[i]; k.head(s, `${it.year} \u2022 ${it.h}`, x, y, w, 0.42, { max: 14, align: 'center', color: C.road }); k.txt(s, it.t, x, y + 0.44, w, h - 0.44, { max: 12, align: 'center', color: C.muted }); }); },
    async quote(d) { const s = page({}); t.img(s, await k.svg('roadL', roadSvg(2), 1000, 200), 0, 4.15, 10, 1.2); k.head(s, `\u201C${d.text}\u201D`, 0.8, 0.9, 8.4, 2.5, { max: 30, min: 15, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 0.8, 3.45, 8.4, 0.45, { size: 14, bold: true, color: C.pal[0], align: 'center' }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 4.1 / n; t.rect(s, 0.4, 1.1, 0.3, 4.1, C.road, { name: 'Road' }); d.items.forEach((it, i) => { const y = 1.1 + i * rh; t.oval(s, 0.43, y + rh / 2 - 0.12, 0.24, 0.24, C.pal[i % 6]); k.txt(s, it, 0.95, y, 8.6, rh, { max: 12, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: "SlideAI Ilon yo'l", colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.road, lt2: C.bg, accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.road, accent5: C.muted, accent6: 'C9D7BD', hlink: C.pal[0], folHlink: C.muted } });
}
module.exports = { id: 118, slug: 'ilon-yol', name: "Ilon yo'l", category: 'business', photos: true, build, style: { tone: "sayohat kabi: yo'l, bekat va manzil; ketma-ket va qiziqarli bayon", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "calm"], "transitions": ["p14:pan|dir=\"u\"", "fade", "p14:ferris|dir=\"l\""], "cover": ["curveUp", "arcRight"], "mark": "curveUp", "deco": "curveDown", "sig": {"title": "arcRight", "body": "fadeUp", "item": ["curveUp", "curveDown"], "image": "arcLeft", "number": "curveUp", "order": "alternate", "stagger": 0.16}, "tempo": 1.05, "kenburns": true};
