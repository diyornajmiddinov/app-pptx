/** 142 Tarkib — a food NUTRITION LABEL: heavy black frame, giant bold heading, thick and thin rules, item name left and bold value right. Pure black on white. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'EDEDE8', label: 'FFFFFF', ink: '000000', muted: '333333' };
const F = { head: 'Arial', body: 'Arial' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const frame = (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.label, { line: { color: C.ink, width: 2.5 }, name: 'Label' }); };
  const rule = (s, x, y, w, wt) => t.rect(s, x, y, w, wt, C.ink, { name: 'Rule' });
  // a label: heading, serving line, thick rule, then rows
  const label = (s, x, y, w, h, title, sub) => { frame(s, x, y, w, h); k.head(s, title || '', x + 0.12, y + 0.06, w - 0.24, 0.62, { max: 30, min: 13 }); rule(s, x + 0.12, y + 0.72, w - 0.24, 0.02); k.txt(s, sub || '', x + 0.12, y + 0.76, w - 0.24, 0.26, { size: 9, bold: true, valign: 'middle' }); rule(s, x + 0.12, y + 1.04, w - 0.24, 0.1); return { x: x + 0.12, y: y + 1.2, w: w - 0.24, h: h - 1.3 }; };
  const rows = (s, b, n, draw) => { const rh = b.h / n; for (let i = 0; i < n; i++) { const y = b.y + i * rh; draw(i, b.x, y, b.w, rh); if (i < n - 1) rule(s, b.x, y + rh - 0.01, b.w, i === 0 ? 0.04 : 0.012); } };
  const sub = () => [k.M.author, k.M.org].filter(Boolean).join(' \u2022 ');
  const page = (d) => { const s = k.slide(C.bg); k.foot(s, { y: 5.3, size: 7.5, color: C.muted }); return s; };
  const big = (d) => (sTitle) => sTitle;
  const R = {
    async cover(d) { const s = page(d); const b = label(s, 0.5, 0.35, 5.2, 4.8, d.title, sub()); k.txt(s, d.subtitle || '', b.x, b.y, b.w, 1.6, { max: 13 }); rule(s, b.x, b.y + 1.7, b.w, 0.05); [[k.TR.author_l, k.M.author], [k.TR.org_l, k.M.org], [k.TR.city_l, k.M.loc], [k.TR.year_l, k.M.year]].forEach(([a, v], i) => { k.txt(s, a, b.x, b.y + 1.8 + i * 0.42, 2.0, 0.4, { size: 11, bold: true, valign: 'middle' }); k.txt(s, v || '', b.x + 2.0, b.y + 1.8 + i * 0.42, b.w - 2.0, 0.4, { max: 11, align: 'right', valign: 'middle' }); }); if (d.image) { frame(s, 6.1, 0.35, 3.4, 4.8); await k.photo(s, d.image, 6.2, 0.45, 3.2, 4.6, { gray: true }); } },
    async intro(d) { const s = page(d); const b = label(s, 0.4, 0.3, 5.6, 4.85, d.title, sub()); k.txt(s, d.text, b.x, b.y, b.w, b.h, { max: 15, min: 10, ls: 1.3 }); frame(s, 6.3, 0.3, 3.3, 4.85); await k.photo(s, d.image, 6.4, 0.4, 3.1, 4.65, { gray: true }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); const b = label(s, 1.5, 0.3, 7.0, 4.85, d.title, `${d.items.length}`); rows(s, b, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i], x, y, w - 0.8, h, { max: 16 }); k.txt(s, `${i + 1}`, x + w - 0.8, y, 0.8, h, { size: 15, bold: true, align: 'right', valign: 'middle' }); }); },
    async cards(d) { const s = page(d); const b = label(s, 0.6, 0.3, 8.8, 4.85, d.title, sub()); rows(s, b, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, 2.6, h, { max: 15 }); k.txt(s, d.items[i].t, x + 2.75, y, w - 2.75, h, { max: 12, valign: 'middle' }); }); },
    async process(d) { const s = page(d); const b = label(s, 0.6, 0.3, 8.8, 4.85, d.title, sub()); rows(s, b, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, 2.8, h, { max: 15 }); k.txt(s, d.steps[i].t, x + 2.95, y, w - 2.95, h, { max: 12, valign: 'middle' }); }); },
    async stats(d) { const s = page(d); const b = label(s, 1.2, 0.3, 7.6, 4.85, d.title, sub()); const n = d.stats.length + (d.note ? 1 : 0); rows(s, b, n, (i, x, y, w, h) => { if (i === d.stats.length) return k.txt(s, d.note, x, y, w, h, { max: 9, valign: 'middle' }); k.txt(s, d.stats[i].label, x, y, w - 2.3, h, { max: 14, bold: i === 0, valign: 'middle' }); k.head(s, d.stats[i].value, x + w - 2.2, y, 2.2, h, { max: 34, min: 14, align: 'right' }); }); },
    async compare(d) { const s = page(d); [d.left, d.right].forEach((sd, i) => { const b = label(s, 0.4 + i * 4.7, 0.3, 4.5, 4.85, sd.h, d.title); const { rows: rr, fs } = rowsFit([sd.items], 13, b.w, F.body, 0.1, b.h); let y = b.y; sd.items.forEach((it, j) => { k.txt(s, it, b.x, y, b.w, rr[j], { size: fs, valign: 'middle' }); y += rr[j]; if (j < sd.items.length - 1) rule(s, b.x, y - 0.01, b.w, 0.012); }); }); },
    async statement(d) { const s = page(d); const b = label(s, 1.0, 0.3, 8.0, 4.85, d.title, sub()); k.head(s, L.runs(d.text), b.x, b.y, b.w, 2.3, { max: 30, min: 14 }); rule(s, b.x, b.y + 2.4, b.w, 0.06); if (d.caption) k.txt(s, d.caption, b.x, b.y + 2.5, b.w, b.h - 2.5, { max: 11 }); },
    async timeline(d) { const s = page(d); const b = label(s, 0.6, 0.3, 8.8, 4.85, d.title, sub()); rows(s, b, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].year, x, y, 1.2, h, { max: 18, min: 10 }); k.head(s, d.items[i].h, x + 1.3, y, 2.2, h, { max: 13 }); k.txt(s, d.items[i].t, x + 3.6, y, w - 3.6, h, { max: 11, valign: 'middle' }); }); },
    async quote(d) { const s = page(d); const b = label(s, 1.0, 0.3, 8.0, 4.85, d.author || '', ''); k.head(s, `\u201C${d.text}\u201D`, b.x, b.y, b.w, b.h, { max: 26, min: 13, italic: true }); },
    async sources(d) { const s = page(d); const b = label(s, 0.6, 0.3, 8.8, 4.85, d.title, `${d.items.length}`); rows(s, b, d.items.length, (i, x, y, w, h) => k.txt(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover; void big;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Tarkib', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '222222', lt2: C.bg, accent1: '000000', accent2: '555555', accent3: '888888', accent4: 'BBBBBB', accent5: C.muted, accent6: 'DDDDDD', hlink: '000000', folHlink: C.muted } });
}
module.exports = { id: 142, slug: 'tarkib', name: 'Tarkib', category: 'minimalist', photos: true, build, style: { tone: "tarkib yorlig'i kabi: band nomi va qiymati, quruq va aniq; ortiqcha so'zsiz", limits: { title: 45 }, prefer: 'data' } };
