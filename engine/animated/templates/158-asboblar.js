/** 158 Asboblar devori — a workshop PEGBOARD: hole grid on hardboard, tool silhouettes hung on pegs with painted outlines, manila tags on strings carry the ideas. */
const { kit, L, rowsFit } = require('../free.js');
const C = { board: 'C9A27A', hole: '7A5C3E', ink: '2A2016', tag: 'F2DFB4', muted: '5E4B36', paint: ['D7263D', '1B998B', 'F46036', '2E294E', 'C5D86D', '3D348B'] };
const F = { head: 'Arial', body: 'Calibri' };
const TOOLS = {
  wrench: '<path d="M30,20 a30,30 0 1 0 40,40 l90,90 a14,14 0 0 0 20,-20 l-90,-90 a30,30 0 0 0 -40,-40 l18,18 -8,22 -22,8 z"/>',
  hammer: '<rect x="85" y="60" width="22" height="130" rx="6"/><path d="M40,30 h110 v34 h-110 q-18,-17 0,-34 z"/>',
  screwdriver: '<rect x="88" y="20" width="26" height="80" rx="10"/><rect x="96" y="100" width="10" height="80"/><path d="M96,180 h10 l-5,12 z"/>',
  pliers: '<path d="M70,20 l20,70 l-30,100 h16 l30,-90 l30,90 h16 l-30,-100 l20,-70 h-14 l-22,62 l-22,-62 z"/>',
  saw: '<path d="M20,70 h150 l-10,60 h-140 z"/><rect x="150" y="50" width="40" height="70" rx="12"/>',
  ruler: '<rect x="20" y="80" width="170" height="40" rx="4"/>',
};
const KEYS = Object.keys(TOOLS);
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const board = async () => k.svg('pb', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.board}"/>${Array.from({ length: 30 * 17 }, (_, i) => `<circle cx="${30 + (i % 30) * 53}" cy="${30 + Math.floor(i / 30) * 53}" r="7" fill="#${C.hole}"/>`).join('')}</svg>`, 1600, 900, true);
  const tool = async (s, name, x, y, d, c) => { t.img(s, await k.svg(`tl${name}${c}`, `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><g fill="none" stroke="#${c}" stroke-width="10" stroke-dasharray="1 0" stroke-linejoin="round" transform="translate(6 6)" opacity="0.9">${TOOLS[name]}</g><g fill="#3A3A3A">${TOOLS[name]}</g></svg>`, 200, 200), x, y, d, d); };
  // tag hanging on a string from a peg
  const tag = (s, x, y, w, h, i) => { t.oval(s, x + w / 2 - 0.06, y - 0.32, 0.12, 0.12, '444444'); t.line(s, x + w / 2, y - 0.26, 0, 0.3, 'D9D2C3', 1); t.shape(s, 'SNIP_2_SAME_RECTANGLE', { x, y, w, h, fill: { color: C.tag }, line: { color: 'C9B48A', width: 1 }, objectName: 'Tag' }); t.oval(s, x + w / 2 - 0.07, y + 0.08, 0.14, 0.14, 'FFFFFF', { line: { color: 'C9B48A', width: 1 } }); t.rect(s, x, y + 0.3, w, 0.05, C.paint[i % 6], { name: 'Tag band' }); return { x: x + 0.12, y: y + 0.42, w: w - 0.24, h: h - 0.5 }; };
  const page = async (d) => { const s = k.slide({ data: await board() }); if (d.title) { t.rect(s, 0.35, 0.18, 8.0, 0.72, '2A2016', { name: 'Sign' }); k.head(s, d.title, 0.55, 0.18, 7.6, 0.72, { max: 22, min: 12, color: C.tag }); } t.oval(s, 8.8, 0.15, 0.78, 0.78, C.paint[k.idx % 6]); k.txt(s, String(k.idx), 8.8, 0.15, 0.78, 0.78, { size: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); t.rect(s, 0, 5.22, 10, 0.4, '2A2016', { t: 30, name: 'Shelf' }); k.foot(s, { y: 5.3, size: 7.5, color: C.tag }); return s; };
  // tool on top, tag below for each item
  const wall = async (s, n, draw) => { const gap = 0.25, w = (9.3 - gap * (n - 1)) / n; for (let i = 0; i < n; i++) { const x = 0.35 + i * (w + gap), td = Math.min(1.05, w * 0.6); await tool(s, KEYS[i % KEYS.length], x + (w - td) / 2, 1.0, td, C.paint[i % 6]); draw(i, tag(s, x, 2.35, w, 2.8, i)); } };
  const R = {
    async cover(d) { const s = k.slide({ data: await board() }); for (const [i, nm] of KEYS.entries()) await tool(s, nm, 6.0 + (i % 3) * 1.2, 0.5 + Math.floor(i / 3) * 1.3, 1.1, C.paint[i]); const a = tag(s, 0.6, 0.9, 5.0, 3.9, 0); k.txt(s, k.org3, a.x, a.y, a.w, 0.3, { size: 11, bold: true, color: C.paint[0] }); k.head(s, d.title, a.x, a.y + 0.35, a.w, 1.9, { max: 30, min: 14, valign: 'top' }); k.txt(s, d.subtitle || '', a.x, a.y + 2.3, a.w, 0.5, { max: 11, color: C.muted }); k.txt(s, k.M.author || '', a.x, a.y + 2.85, a.w, 0.4, { size: 14, bold: true });
      if (d.image) await k.photo(s, d.image, 6.2, 3.3, 3.2, 1.85, { mask: { r: 0.08 } }); k.foot(s, { y: 5.3, size: 7.5, color: C.tag }); },
    async intro(d) { const s = await page(d); await k.photo(s, d.image, 0.4, 1.15, 3.8, 3.95, { mask: { r: 0.08 } }); const b = tag(s, 4.5, 1.4, 5.1, 3.75, 1); k.txt(s, d.text, b.x, b.y, b.w, b.h, { max: 14, min: 9.5, ls: 1.25, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = await page(d); const n = d.items.length, cols = Math.min(3, n), rws = Math.ceil(n / cols), w = (9.3 - 0.3 * (cols - 1)) / cols, h = (3.9 - 0.45 * (rws - 1)) / rws; d.items.forEach((it, i) => { const b = tag(s, 0.35 + (i % cols) * (w + 0.3), 1.35 + Math.floor(i / cols) * (h + 0.45), w, h, i); k.head(s, `${i + 1}. ${it}`, b.x, b.y, b.w, b.h, { max: 15 }); }); },
    async cards(d) { const s = await page(d); await wall(s, d.items.length, (i, b) => { k.head(s, d.items[i].h, b.x, b.y, b.w, 0.42, { max: 14 }); k.txt(s, d.items[i].t, b.x, b.y + 0.45, b.w, b.h - 0.45, { max: 12, color: C.muted }); }); },
    async process(d) { const s = await page(d); await wall(s, d.steps.length, (i, b) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, b.x, b.y, b.w, 0.42, { max: 14 }); k.txt(s, d.steps[i].t, b.x, b.y + 0.45, b.w, b.h - 0.45, { max: 12, color: C.muted }); }); },
    async stats(d) { const s = await page(d); await wall(s, d.stats.length, (i, b) => { k.head(s, d.stats[i].value, b.x, b.y, b.w, 0.9, { max: 36, min: 14, color: C.paint[i % 6] }); k.txt(s, d.stats[i].label, b.x, b.y + 0.95, b.w, b.h - 0.95, { max: 12 }); }); if (d.note) k.txt(s, d.note, 0.35, 5.02, 8.3, 0.22, { size: 7.5, color: C.tag }); },
    async compare(d) { const s = await page(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, 4.0, F.body, 0.08, 2.9); for (const [i, sd] of [d.left, d.right].entries()) { const x = 0.35 + i * 4.75; await tool(s, KEYS[i], x + 0.2, 1.05, 0.85, C.paint[i]); const b = tag(s, x + 1.2, 1.35, 3.3, 3.8, i); k.head(s, sd.h, b.x, b.y, b.w, 0.42, { max: 14 }); let y = b.y + 0.48; sd.items.forEach((it, j) => { k.txt(s, it, b.x, y, b.w, rr[j], { size: Math.min(fs, 11) }); y += rr[j]; }); } },
    async statement(d) { const s = await page(d); const b = tag(s, 1.5, 1.35, 7.0, 3.8, 2); k.head(s, L.runs(d.text), b.x + 0.2, b.y, b.w - 0.4, b.h * 0.65, { max: 26, min: 13, align: 'center' }); if (d.caption) k.txt(s, d.caption, b.x + 0.2, b.y + b.h * 0.67, b.w - 0.4, b.h * 0.33, { max: 11, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = await page(d); await wall(s, d.items.length, (i, b) => { k.head(s, d.items[i].year, b.x, b.y, b.w, 0.45, { max: 20, min: 11, color: C.paint[i % 6] }); k.head(s, d.items[i].h, b.x, b.y + 0.47, b.w, 0.4, { max: 13 }); k.txt(s, d.items[i].t, b.x, b.y + 0.9, b.w, b.h - 0.9, { max: 11, color: C.muted }); }); },
    async quote(d) { const s = await page({}); const b = tag(s, 1.5, 1.35, 7.0, 3.8, 3); k.head(s, `\u201C${d.text}\u201D`, b.x + 0.2, b.y, b.w - 0.4, b.h - 0.45, { max: 24, min: 12, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author, b.x, b.y + b.h - 0.42, b.w, 0.4, { size: 12, bold: true, color: C.paint[0], align: 'center' }); },
    async sources(d) { const s = await page(d); const b = tag(s, 0.8, 1.35, 8.4, 3.8, 4); const n = d.items.length, rh = b.h / n; d.items.forEach((it, i) => k.txt(s, `${i + 1}. ${it}`, b.x, b.y + i * rh, b.w, rh, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Asboblar devori', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '2A2016', lt2: C.tag, accent1: C.paint[0], accent2: C.paint[1], accent3: C.paint[2], accent4: C.paint[3], accent5: C.paint[4], accent6: C.paint[5], hlink: C.paint[1], folHlink: C.muted } });
}
module.exports = { id: 158, slug: 'asboblar', name: 'Asboblar devori', category: 'creative', photos: true, build, style: { tone: "amaliy vositalar: har bir band ishga yaraydigan 'asbob'; aniq, qo'llanmaga o'xshash", limits: { card_t4: 100, step_t: 100 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "bold"], "transitions": ["cut", "push:l", "checker"], "cover": ["swingRight", "drop"], "mark": "swing", "deco": "drop", "sig": {"title": "drop", "body": "fadeUp", "item": "swing", "image": "drop", "number": "swing", "order": "diagonal", "stagger": 0.1}, "tempo": 0.9, "kenburns": false};
