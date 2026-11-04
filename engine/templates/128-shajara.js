/**
 * 128 Shajara — a top-down TREE: a root node at the top, elbow connectors branching down to child nodes,
 * leaves listed under their branches; the sources slide is a directory tree (├──). Navy nodes on warm sand.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F6F1E9', ink: '1D2A3A', muted: '5E6B78', node: '1D3557', node2: 'E9C46A', line: '8D99AE', light: 'FFFFFF' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const node = (s, x, y, w, h, fill = C.node) => t.rect(s, x, y, w, h, fill, { r: 0.1, name: 'Node' });
  const root = (s, txt, w = 4.4) => { node(s, 5 - w / 2, 0.3, w, 0.7); k.head(s, txt || '', 5 - w / 2 + 0.15, 0.3, w - 0.3, 0.7, { max: 20, min: 12, color: C.light, align: 'center' }); };
  // children under the root: returns the child boxes after drawing elbow connectors
  const kids = (s, n, y = 1.55, h = 0.6) => { const w = 9.2 / n; t.line(s, 5, 1.0, 0, 0.27, C.line, 1.5); t.line(s, 0.4 + w / 2, 1.27, w * (n - 1), 0, C.line, 1.5); return Array.from({ length: n }, (_, i) => { const x = 0.4 + i * w; t.line(s, x + w / 2, 1.27, 0, y - 1.27, C.line, 1.5); return { x: x + 0.06, y, w: w - 0.12, h }; }); };
  const page = (d) => { const s = k.slide(C.bg); root(s, d.title); k.txt(s, String(k.idx), 9.0, 0.3, 0.6, 0.7, { size: 16, bold: true, color: C.node, align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5 }); return s; };
  const branch = (s, n, top, below) => kids(s, n).forEach((b, i) => { node(s, b.x, b.y, b.w, b.h, i % 2 ? C.node : '2A6F97'); top(i, b); t.line(s, b.x + b.w / 2, b.y + b.h, 0, 0.18, C.line, 1.25); below(i, b.x, b.y + b.h + 0.22, b.w, 5.15 - (b.y + b.h + 0.22)); });
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) { t.oval(s, 4.1, 0.25, 1.8, 1.8, C.node2); await k.photo(s, d.image, 4.2, 0.35, 1.6, 1.6, { mask: 'circle' }); }
      node(s, 1.6, 2.25, 6.8, 1.2); k.head(s, d.title, 1.8, 2.28, 6.4, 1.14, { max: 30, min: 15, color: C.light, align: 'center' }); t.line(s, 5, 3.45, 0, 0.3, C.line, 1.5); t.line(s, 1.9, 3.75, 6.2, 0, C.line, 1.5);
      [k.M.author, k.M.org, [k.M.loc, k.M.year].filter(Boolean).join(', ')].forEach((tx, i) => { const x = 0.6 + i * 3.1; t.line(s, x + 1.3, 3.75, 0, 0.25, C.line, 1.5); node(s, x, 4.0, 2.6, 0.6, i ? 'FFFFFF' : C.node2); k.txt(s, tx || '', x + 0.1, 4.0, 2.4, 0.6, { max: 13, bold: !i, align: 'center', valign: 'middle' }); });
      if (d.subtitle) k.txt(s, d.subtitle, 0.6, 4.7, 8.8, 0.45, { max: 11, color: C.muted, align: 'center' }); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); },
    async intro(d) { const s = page(d); const b = kids(s, 2, 1.55, 3.55); await k.photo(s, d.image, b[0].x, b[0].y, b[0].w, b[0].h, { mask: { r: 0.1 } }); node(s, b[1].x, b[1].y, b[1].w, b[1].h, 'FFFFFF'); k.txt(s, d.text, b[1].x + 0.2, b[1].y + 0.15, b[1].w - 0.4, b[1].h - 0.3, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); branch(s, d.items.length, (i, b) => k.txt(s, String(i + 1), b.x, b.y, b.w, b.h, { size: 20, bold: true, color: C.light, align: 'center', valign: 'middle' }), (i, x, y, w, h) => k.head(s, d.items[i], x, y, w, Math.min(h, 1.5), { max: 15, align: 'center', valign: 'top' })); },
    async cards(d) { const s = page(d); branch(s, d.items.length, (i, b) => k.head(s, d.items[i].h, b.x + 0.08, b.y, b.w - 0.16, b.h, { max: 14, color: C.light, align: 'center' }), (i, x, y, w, h) => k.txt(s, d.items[i].t, x, y, w, h, { max: 13, align: 'center' })); },
    async process(d) { const s = page(d); branch(s, d.steps.length, (i, b) => k.head(s, `${i + 1}. ${d.steps[i].h}`, b.x + 0.08, b.y, b.w - 0.16, b.h, { max: 14, color: C.light, align: 'center' }), (i, x, y, w, h) => k.txt(s, d.steps[i].t, x, y, w, h, { max: 13, align: 'center' })); },
    async stats(d) { const s = page(d); branch(s, d.stats.length, (i, b) => k.head(s, d.stats[i].value, b.x, b.y, b.w, b.h, { max: 26, min: 12, color: C.node2, align: 'center' }), (i, x, y, w, h) => k.txt(s, d.stats[i].label, x, y, w, h - (d.note ? 0.6 : 0), { max: 13, align: 'center' }));
      if (d.note) k.txt(s, d.note, 0.4, 4.6, 9.2, 0.55, { max: 9, color: C.muted, align: 'center' }); },
    async compare(d) { const s = page(d), bx = kids(s, 2), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, 3.8, F.body, 0.1, 2.9);
      [d.left, d.right].forEach((sd, i) => { const b = bx[i]; node(s, b.x, b.y, b.w, b.h, i ? '2A6F97' : C.node); k.head(s, sd.h, b.x + 0.1, b.y, b.w - 0.2, b.h, { max: 16, color: C.light, align: 'center' }); const lx = b.x + 0.35; t.line(s, lx, b.y + b.h, 0, 2.95, C.line, 1.25); let y = b.y + b.h + 0.1; sd.items.forEach((it, j) => { t.line(s, lx, y + 0.15, 0.25, 0, C.line, 1.25); k.txt(s, it, lx + 0.35, y, 3.8, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); const b = kids(s, 1, 1.55, 2.0); node(s, 1.2, b[0].y, 7.6, 2.0, 'FFFFFF'); k.head(s, L.runs(d.text), 1.4, b[0].y + 0.1, 7.2, 1.8, { max: 28, min: 14, align: 'center' }); if (d.caption) k.txt(s, d.caption, 1.2, 3.75, 7.6, 1.35, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); branch(s, d.items.length, (i, b) => k.head(s, d.items[i].year, b.x, b.y, b.w, b.h, { max: 20, min: 11, color: C.node2, align: 'center' }), (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 14, align: 'center' }); k.txt(s, d.items[i].t, x, y + 0.45, w, h - 0.45, { max: 12, align: 'center', color: C.muted }); }); },
    async quote(d) { const s = page({ title: d.author || '' }); const b = kids(s, 1, 1.55, 3.2); node(s, 1.2, b[0].y, 7.6, 3.2, 'FFFFFF'); k.head(s, `\u201C${d.text}\u201D`, 1.5, b[0].y + 0.2, 7.0, 2.8, { max: 28, min: 14, italic: true, align: 'center' }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.9 / n; t.line(s, 0.7, 1.0, 0, 1.15 + (n - 0.5) * rh - 1.0, C.line, 1.25); d.items.forEach((it, i) => { const y = 1.15 + i * rh; t.line(s, 0.7, y + rh / 2, 0.35, 0, C.line, 1.25); k.txt(s, it, 1.15, y, 8.4, rh, { max: 12, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Shajara', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.node, lt2: C.bg, accent1: C.node, accent2: '2A6F97', accent3: C.node2, accent4: 'E76F51', accent5: C.muted, accent6: C.line, hlink: '2A6F97', folHlink: C.muted } });
}
module.exports = { id: 128, slug: 'shajara', name: 'Şajara', category: 'academic', photos: true, build, style: { tone: "tuzilma va kelib chiqish: umumiydan xususiyga, har bir tarmoq aniq nomlangan", limits: {}, prefer: null } };
