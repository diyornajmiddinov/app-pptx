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
  const page = async (d) => { const s = k.slide({ data: await board() }); if (d.title) { t.rect(s, 0.35, 0.18, 8.0, 0.72, '2A2016', { name: 'Sign' }); k.head(s, d.title, 0.55, 0.18, 7.6, 0.72, { max: 22, min: 12, color: C.tag }); } t.oval(s, 8.8, 0.15, 0.78, 0.78, C.paint[k.idx % 6]); k.txt(s, String(k.idx), 8.8, 0.15, 0.78, 0.78, { size: 18, bold: true, color: k.idx % 6 === 4 ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' }); t.rect(s, 0, 5.22, 10, 0.4, '2A2016', { t: 30, name: 'Shelf' }); k.foot(s, { y: 5.3, size: 7.5, color: C.tag }); return s; };
  // tool on top, tag below for each item
  const wall = async (s, n, draw) => { const gap = 0.25, w = (9.3 - gap * (n - 1)) / n; for (let i = 0; i < n; i++) { const x = 0.35 + i * (w + gap), td = Math.min(1.05, w * 0.6); await tool(s, KEYS[i % KEYS.length], x + (w - td) / 2, 1.0, td, C.paint[i % 6]); draw(i, tag(s, x, 2.35, w, 2.8, i)); } };
  const R = {
    async cover(d) { const s = k.slide({ data: await board() }); for (const [i, nm] of KEYS.entries()) await tool(s, nm, 6.0 + (i % 3) * 1.2, 0.5 + Math.floor(i / 3) * 1.3, 1.1, C.paint[i]); const a = tag(s, 0.6, 0.9, 5.0, 3.9, 0); k.txt(s, k.org3, a.x, a.y, a.w, 0.3, { size: 11, bold: true, color: C.paint[0] }); k.head(s, d.title, a.x, a.y + 0.35, a.w, 1.9, { max: 30, min: 14, valign: 'top' }); k.txt(s, d.subtitle || '', a.x, a.y + 2.3, a.w, 0.5, { max: 11, color: C.muted }); k.txt(s, k.M.author || '', a.x, a.y + 2.85, a.w, 0.4, { size: 14, bold: true });
      if (d.image) await k.photo(s, d.image, 6.2, 3.3, 3.2, 1.85, { mask: { r: 0.08 } }); t.rect(s, 0, 5.22, 10, 0.4, '2A2016', { t: 30, name: 'Shelf' }); k.foot(s, { y: 5.3, size: 7.5, color: C.tag }); },
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
  // ---- further ways to draw a type: blueprints, the parts cabinet, spirit levels, tape measure, gears, saw blade, workbench (L.pages)
  const BLUE = '12396B', BLUEL = '1D4E8F', LINE = 'BFD7F2', WHITE = 'FFFFFF', STEEL = '4A5560', STEELD = '333B44', YEL = 'F5C518', YELD = 'D9A900', OAK = 'A9794A', OAKD = '7C5530', DK = '2A2016';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, ...o });
  const blueprint = async (d) => { const s = k.slide({ data: await k.svg('bp', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${BLUE}"/>${Array.from({ length: 41 }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="900" stroke="#${BLUEL}" stroke-width="${i % 5 ? 1 : 2}"/>`).join('')}${Array.from({ length: 23 }, (_, i) => `<line x1="0" y1="${i * 40}" x2="1600" y2="${i * 40}" stroke="#${BLUEL}" stroke-width="${i % 5 ? 1 : 2}"/>`).join('')}</svg>`, 1600, 900, true) }); t.rect(s, 0.2, 0.15, 9.6, 5.33, null, { line: { color: LINE, width: 1.5 }, name: 'Sheet edge' }); if (d.title) k.head(s, d.title, 0.4, 0.2, 8.2, 0.7, { max: 22, min: 12, color: WHITE }); t.oval(s, 8.85, 0.2, 0.7, 0.7, BLUE, { line: { color: WHITE, width: 1.5 } }); k.txt(s, String(k.idx), 8.85, 0.2, 0.7, 0.7, { size: 16, bold: true, color: WHITE, align: 'center', valign: 'middle' }); t.line(s, 0.2, 0.95, 9.6, 0, LINE, 1); k.foot(s, { x: 0.4, y: 5.2, w: 9.2, size: 7.5, color: LINE }); return s; };
  const bench = (d) => { const s = k.slide(DK); t.rect(s, 0, 4.95, 10, 0.675, OAKD, { name: 'Bench' }); t.rect(s, 0, 4.95, 10, 0.1, OAK, { name: 'Bench edge' }); if (d.title) k.head(s, d.title, 0.4, 0.18, 8.2, 0.72, { max: 22, min: 12, color: C.tag }); t.oval(s, 8.8, 0.15, 0.78, 0.78, YEL); k.txt(s, String(k.idx), 8.8, 0.15, 0.78, 0.78, { size: 18, bold: true, color: DK, align: 'center', valign: 'middle' }); k.foot(s, { y: 5.27, size: 7.5, color: C.tag }); return s; };
  const peg = (s, x, y) => t.oval(s, x - 0.06, y - 0.06, 0.12, 0.12, '444444', { name: 'Peg' });
  const gear = (n, c) => { const R2 = 96, r = 74; let p = ''; for (let i = 0; i < n * 4; i++) { const a = (i / (n * 4)) * 2 * Math.PI, rr = i % 4 < 2 ? R2 : r; p += `${(100 + Math.cos(a) * rr).toFixed(1)},${(100 + Math.sin(a) * rr).toFixed(1)} `; } return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><polygon points="${p}" fill="#${c}"/><circle cx="100" cy="100" r="42" fill="#F2DFB4"/></svg>`; };
  const ruler = async (s, x, y, w, h, horiz = true) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); let o = ''; if (horiz) for (let i = 0; i <= W2; i += 10) o += `<line x1="${i}" y1="0" x2="${i}" y2="${i % 50 ? H2 * 0.25 : H2 * 0.5}" stroke="#${DK}" stroke-width="2"/>`; else for (let i = 0; i <= H2; i += 10) o += `<line x1="0" y1="${i}" x2="${i % 50 ? W2 * 0.25 : W2 * 0.5}" y2="${i}" stroke="#${DK}" stroke-width="2"/>`; t.img(s, await k.svg(`rule${W2}-${H2}-${horiz}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><rect width="${W2}" height="${H2}" fill="#${YEL}"/>${o}</svg>`, W2, H2), x, y, w, h); };
  const drawer = (s, x, y, w, h) => { t.rect(s, x, y, w, h, STEEL, { line: { color: STEELD, width: 1.5 }, shadow: 0.3, blur: 3, offset: 2, name: 'Drawer' }); t.rect(s, x + w / 2 - 0.4, y + 0.06, 0.8, 0.1, 'C0C7CE', { r: 0.03, name: 'Pull' }); t.rect(s, x + 0.1, y + 0.22, w - 0.2, h - 0.3, C.tag, { name: 'Label' }); return { x: x + 0.2, y: y + 0.27, w: w - 0.4, h: h - 0.4 }; };
  const bladeTeeth = (dd) => { let p = '', n = 44; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI, b = ((i + 0.55) / n) * 2 * Math.PI; p += `${(200 + Math.cos(a) * 198).toFixed(1)},${(200 + Math.sin(a) * 198).toFixed(1)} ${(200 + Math.cos(b) * 178).toFixed(1)},${(200 + Math.sin(b) * 178).toFixed(1)} `; } return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><polygon points="${p}" fill="#C0C7CE"/></svg>`; };
  const V = {
    image: [
      async (d) => { // the drawing sheet: the picture measured by rulers at its top and side, the words beside it
        const s = await blueprint(d), x = 0.75, y = 1.42, w = 4.0, h = 3.65;
        await ruler(s, x, y - 0.3, w, 0.3); await ruler(s, x - 0.3, y, 0.3, h, false);
        await k.photo(s, d.image, x, y, w, h);
        bd(s, d.text, 5.05, 1.1, 4.55, 4.0, { color: WHITE, max: 13, valign: 'middle' });
      },
      async (d) => { // the picture covers the wall, a workbench crosses in front with the words on it
        const s = k.slide(DK), y = 2.9;
        await k.photo(s, d.image, 0, 0, 10, 3.0);
        t.rect(s, 0, y, 10, 2.73, OAKD, { name: 'Bench' }); t.rect(s, 0, y, 10, 0.14, OAK, { name: 'Bench edge' });
        t.rect(s, 0.35, 0.18, 8.0, 0.72, DK, { name: 'Sign' }); k.head(s, d.title || '', 0.55, 0.18, 7.6, 0.72, { max: 22, min: 12, color: C.tag });
        t.oval(s, 8.8, 0.15, 0.78, 0.78, YEL); k.txt(s, String(k.idx), 8.8, 0.15, 0.78, 0.78, { size: 18, bold: true, color: DK, align: 'center', valign: 'middle' });
        bd(s, d.text, 0.5, y + 0.22, 9.0, 2.05, { color: 'FFF6E0', max: 13, valign: 'middle' });
        k.foot(s, { y: 5.3, size: 7.5, color: C.tag });
      },
      async (d) => { // a clipboard hung on one peg, the picture clipped to it, a tag of words alongside
        const s = await page(d), x = 0.6, y = 1.2, w = 4.2, h = 3.9;
        peg(s, x + w / 2, y - 0.12);
        t.rect(s, x, y, w, h, OAKD, { r: 0.06, shadow: 0.35, blur: 5, offset: 3, name: 'Clipboard' });
        await k.photo(s, d.image, x + 0.18, y + 0.42, w - 0.36, h - 0.6);
        t.rect(s, x + w / 2 - 0.65, y - 0.06, 1.3, 0.4, 'C0C7CE', { r: 0.05, name: 'Clip' });
        t.rect(s, 5.1, 1.15, 4.55, 3.95, C.tag, { line: { color: 'C9B48A', width: 1 }, name: 'Sheet' });
        t.rect(s, 5.1, 1.15, 0.12, 3.95, C.paint[1], { name: 'Tag band' });
        bd(s, d.text, 5.35, 1.25, 4.15, 3.75, { color: C.ink, max: 13, valign: 'middle' });
      },
      async (d) => { // the bench at dusk: the picture is a round saw blade, its teeth round the rim
        const s = bench(d), dd = 3.75, x = 5.75, y = 0.98;
        t.img(s, await k.svg('blade', bladeTeeth(dd), 400, 400), x - 0.2, y - 0.0, dd + 0.0, dd + 0.0);
        const inner = dd * 0.86;
        t.img(s, await L.photo(L.src(d.image), inner, inner, { mask: 'circle' }), x - 0.2 + (dd - inner) / 2, y + (dd - inner) / 2, inner, inner, { alt: '' });
        bd(s, d.text, 0.45, 1.0, 4.85, 3.85, { color: 'FFF6E0', max: 13, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // the parts cabinet: steel drawers with a label each, 2x2 or three tall ones
        const s = await page(d), n = d.items.length, cols = n === 4 ? 2 : 3, gap = 0.12, w = (9.3 - gap * (cols - 1)) / cols, H2 = n === 4 ? 1.98 : 4.05;
        t.rect(s, 0.25, 1.0, 9.5, 4.17, STEELD, { name: 'Cabinet' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + (i % cols) * (w + gap), y = 1.05 + Math.floor(i / cols) * (H2 + 0.05), b = drawer(s, x, y, w, H2);
          t.img(s, await k.icon(it.icon, C.paint[[0, 1, 5, 3][i]], 2), b.x, b.y, 0.32, 0.32);
          hd(s, it.h, b.x + 0.4, b.y - 0.02, b.w - 0.4, 0.36);
          bd(s, it.t, b.x, b.y + 0.4, b.w, b.h - 0.42, { color: C.ink, max: n === 4 ? 12 : 14 });
        }
      },
      async (d) => { // the drawing sheet: a part in each column, dimension lines over it, white ink
        const s = await blueprint(d), n = d.items.length, w = 9.2 / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, ww = w - 0.2;
          t.line(s, x, 1.25, ww, 0, LINE, 1); t.line(s, x, 1.15, 0, 0.2, LINE, 1); t.line(s, x + ww, 1.15, 0, 0.2, LINE, 1);
          t.img(s, await k.icon(it.icon, WHITE, 1.5), x + ww / 2 - 0.3, 1.4, 0.6, 0.6);
          hd(s, it.h, x, 2.05, ww, 0.54, { color: YEL, align: 'center' });
          bd(s, it.t, x, 2.62, ww, 2.5, { color: WHITE, align: 'center', max: 13.5 });
        }
      },
      async (d) => { // one big spanner on the wall, tags on strings running to it from all round
        const s = await page(d), n = d.items.length, cx = 5, cy = n === 4 ? 3.1 : 2.4, spots = n === 4 ? [[0.35, 1.05, 3.6, 1.95], [6.05, 1.05, 3.6, 1.95], [0.35, 3.12, 3.6, 2.0], [6.05, 3.12, 3.6, 2.0]] : [[0.35, 1.05, 3.6, 2.3], [6.05, 1.05, 3.6, 2.3], [1.75, 3.5, 6.5, 1.62]];
        for (const [i, [x, y, w, h]] of spots.entries()) { const mid = n === 3 && i === 2, ex = mid ? cx : (i % 2 ? x : x + w), ey = mid ? y : y + h / 2; t.line(s, Math.min(cx, ex), Math.min(cy, ey), Math.abs(ex - cx) || 0.001, Math.abs(ey - cy) || 0.001, 'F4EFE2', 1.5, { flipV: (ex - cx) * (ey - cy) < 0 }); }
        await tool(s, 'wrench', cx - 0.95, cy - 0.95, 1.9, C.paint[0]);
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = spots[i];
          t.rect(s, x, y, w, h, C.tag, { line: { color: 'C9B48A', width: 1 }, name: 'Tag' });
          t.rect(s, x, y, 0.1, h, C.paint[[0, 1, 5, 3][i]], { name: 'Band' });
          t.img(s, await k.icon(it.icon, C.paint[[0, 1, 5, 3][i]], 2), x + 0.2, y + 0.08, 0.3, 0.3);
          hd(s, it.h, x + 0.58, y + 0.04, w - 0.65, 0.38);
          bd(s, it.t, x + 0.2, y + 0.46, w - 0.3, h - 0.52, { color: C.ink, max: 12 });
        }
      },
      async (d) => { // spirit levels laid along the wall, a bubble vial at the end of each
        const s = await page(d), n = d.items.length, rh = 4.12 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.03 + i * rh, h = rh - 0.1;
          t.rect(s, 0.35, y, 9.3, h, YEL, { line: { color: YELD, width: 1 }, shadow: 0.3, blur: 3, offset: 2, name: 'Level' });
          t.rect(s, 0.5, y + h / 2 - 0.2, 1.15, 0.4, 'D8F0B4', { r: 0.15, line: { color: DK, width: 1 }, name: 'Vial' });
          t.line(s, 0.9, y + h / 2 - 0.2, 0, 0.4, DK, 1); t.line(s, 1.25, y + h / 2 - 0.2, 0, 0.4, DK, 1);
          t.img(s, await k.icon(it.icon, DK, 2), 0.93, y + h / 2 - 0.15, 0.3, 0.3);
          hd(s, it.h, 1.85, y + 0.03, 2.4, h - 0.06, { color: DK });
          bd(s, it.t, 4.35, y + 0.03, 5.15, h - 0.06, { color: DK, valign: 'middle', max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // a tape measure pulled across the wall: each step at its own mark, a tag under each
        const s = await page(d), n = d.steps.length, w = 9.5 / n, y = 1.06, h = 0.56;
        await ruler(s, 0, y, 10, h);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.25 + i * w, ww = w - 0.12, cx = x + ww / 2;
          t.oval(s, cx - 0.22, y + 0.1, 0.44, 0.44, C.paint[3], { name: 'Mark' });
          k.txt(s, String(i + 1), cx - 0.22, y + 0.1, 0.44, 0.44, { size: 15, bold: true, font: F.head, color: WHITE, align: 'center', valign: 'middle', ls: 1 });
          t.rect(s, x, 1.8, ww, 3.34, C.tag, { line: { color: 'C9B48A', width: 1 }, name: 'Tag' });
          t.line(s, cx, y + h, 0, 1.8 - y - h, 'F4EFE2', 1.25);
          hd(s, st.h, x + 0.1, 1.84, ww - 0.2, 0.52);
          bd(s, st.t, x + 0.1, 2.38, ww - 0.2, 2.72, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // the drawing sheet: one centre line down the page, parts numbered on it, notes either side
        const s = await blueprint(d), n = d.steps.length, y0 = 1.03, rh = 4.12 / n, w = 4.05;
        t.line(s, 5, y0, 0, 4.12, YEL, 1.5, { dash: 'lgDashDot' });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, x = right ? 5.45 : 4.55 - w, a = right ? 'left' : 'right', dd = 0.52, my = y + rh / 2 - dd / 2;
          t.oval(s, 5 - dd / 2, my, dd, dd, BLUE, { line: { color: YEL, width: 1.5 }, name: 'Part mark' });
          k.txt(s, String(i + 1), 5 - dd / 2, my, dd, dd, { size: 15, bold: true, font: F.head, color: YEL, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, y + 0.02, w, 0.33, { color: YEL, align: a, max: 13.5 });
          bd(s, st.t, x, y + 0.36, w, rh - 0.38, { color: WHITE, align: a, max: 12 });
        }
      },
      async (d) => { // the cantilever toolbox opened out: each tray rising one step above the last
        const s = await page(d), n = d.steps.length, gap = 0.1, w = (9.3 - gap * (n - 1)) / n, rise = n === 4 ? 0.28 : 0.4, h0 = 3.0;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * (w + gap), h = h0 + i * rise, y = 5.14 - h;
          t.rect(s, x, y, w, h, C.paint[0], { shadow: 0.3, blur: 3, offset: 2, name: 'Tray' });
          t.rect(s, x, y, w, 0.12, '8F1626', { name: 'Tray lip' });
          t.rect(s, x + 0.1, y + 0.2, w - 0.2, h - 0.3, C.tag, { name: 'Label' });
          k.txt(s, String(i + 1), x + 0.18, y + 0.22, 0.6, 0.48, { size: 24, bold: true, font: F.head, color: C.paint[0], valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.18, y + 0.7, w - 0.36, 0.5, { max: 13 });
          bd(s, st.t, x + 0.18, y + 1.22, w - 0.36, h - 1.36, { color: C.ink, max: 12.5 });
        }
      },
      async (d) => { // gears turning one another along the wall, a number in each hub, words on the bench below
        const s = bench(d), n = d.steps.length, w = 9.2 / n, dd = n === 4 ? 1.55 : 1.7, ys = [0.98, 1.2, 0.98, 1.2];
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2, y = ys[i], c = [C.paint[0], C.paint[1], C.paint[2], YEL][i];
          t.img(s, await k.svg(`gear${i}`, gear(12, c), 200, 200), cx - dd / 2, y, dd, dd);
          k.txt(s, String(i + 1), cx - 0.36, y + dd / 2 - 0.36, 0.72, 0.72, { size: 22, bold: true, font: F.head, color: DK, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.06, 2.9, w - 0.12, 0.48, { color: C.tag, align: 'center', max: 13.5, valign: 'top' });
          bd(s, st.t, x + 0.06, 3.38, w - 0.12, 1.54, { color: 'FFF6E0', align: 'center', max: 12, min: 10 });
        }
      },
    ],
    stats: [
      async (d) => { // the big tag hung up with one figure on it, a smaller tag for each of the others
        const s = await page(d), [a, b, c] = d.stats, B = tag(s, 0.45, 1.35, 5.1, 3.78, 0);
        hd(s, a.value, B.x, B.y, B.w, 1.5, { max: 56, min: 24, color: C.paint[0], align: 'center' });
        bd(s, a.label, B.x, B.y + 1.55, B.w, 0.95, { color: C.ink, max: 15, min: 11, align: 'center' });
        [[b, 5.85, 1], [c, 7.8, 3]].forEach(([v, x, col]) => { const q = tag(s, x, 1.35, 1.85, 2.3, col); hd(s, v.value, q.x, q.y, q.w, 0.72, { max: 22, min: 13, color: C.paint[col], align: 'center' }); bd(s, v.label, q.x, q.y + 0.72, q.w, q.h - 0.72, { color: C.ink, max: 11, align: 'center', min: 9.5 }); });
        if (d.note) { t.rect(s, 5.85, 3.75, 3.8, 1.38, 'F4EFE2', { line: { color: 'C9B48A', width: 1 }, name: 'Note' }); bd(s, d.note, 5.95, 3.78, 3.6, 1.32, { color: C.ink, valign: 'middle', max: 11.5, min: 9.5 }); }
      },
      async (d) => { // the bench at dusk: three dial gauges with their figures, what they read under each
        const s = bench(d), dd = 2.05, w = 9.2 / 3;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2;
          t.oval(s, cx - dd / 2, 1.0, dd, dd, 'C0C7CE', { name: 'Gauge rim' });
          t.oval(s, cx - dd / 2 + 0.12, 1.12, dd - 0.24, dd - 0.24, 'FFFFFF', { name: 'Gauge' });
          hd(s, v.value, cx - 0.75, 1.5, 1.5, 1.05, { max: 26, min: 13, color: DK, align: 'center' });
          bd(s, v.label, x + 0.1, 3.08, w - 0.2, 0.58, { color: 'FFF6E0', align: 'center', max: 12 });
        }
        if (d.note) bd(s, d.note, 0.5, 3.68, 9.0, 1.2, { color: C.tag, align: 'center', valign: 'middle', max: 12.5 });
      },
      async (d) => { // the drawing sheet: figures as measurements, a dimension line from each to its name
        const s = await blueprint(d), rh = 1.0;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.05 + i * rh, cy = y + rh / 2;
          hd(s, v.value, 0.45, y, 3.4, rh - 0.05, { max: 38, min: 18, color: YEL });
          t.line(s, 3.9, cy, 0.8, 0, LINE, 1); t.oval(s, 3.86, cy - 0.04, 0.08, 0.08, LINE); t.oval(s, 4.66, cy - 0.04, 0.08, 0.08, LINE);
          bd(s, v.label, 4.85, y, 4.8, rh - 0.05, { color: WHITE, valign: 'middle', max: 14 });
        }
        if (d.note) { t.rect(s, 0.45, 4.08, 9.15, 1.05, BLUE, { line: { color: LINE, width: 1 }, name: 'Title block' }); bd(s, d.note, 0.6, 4.1, 8.85, 1.01, { color: WHITE, valign: 'middle', max: 12.5 }); }
      },
    ],
    compare: [
      async (d) => { // the drawing and the real thing: the sheet at left, the bench at right, a hammer between
        const s = bench(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, 3.85, F.body, 0.12, 2.75);
        t.rect(s, 0, 1.0, 5, 4.625, BLUE, { name: 'Sheet' });
        await tool(s, 'hammer', 4.5, 2.4, 1.0, YEL);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.65 : 0.4, w = 3.95, a = i ? 'left' : 'right';
          hd(s, sd.h, x, 1.05, w, 0.55, { max: 18, min: 12, color: i ? YEL : LINE, align: a });
          let y = 1.7; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: 'FFFFFF', align: a, ls: 1 }); y += rr[j]; });
        }
      },
      async (d) => { // two long shelves, one over the other: a coloured bracket for the name, the items standing along it
        const s = await page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.14 : 1.06, h = 1.95, n = sd.items.length, x0 = 2.45, w = (9.55 - x0) / n, c = C.paint[i ? 1 : 0];
          t.rect(s, 0.35, y, 9.3, h - 0.1, C.tag, { name: 'Shelf back' });
          t.rect(s, 0.35, y + h - 0.12, 9.3, 0.12, OAKD, { name: 'Plank' });
          t.rect(s, 0.35, y, 1.95, h - 0.12, c, { name: 'Bracket' });
          hd(s, sd.h, 0.45, y + 0.08, 1.75, h - 0.28, { color: 'FFFFFF', max: 16, min: 11 });
          sd.items.forEach((it, j) => { const x = x0 + j * w; if (j) t.line(s, x - 0.04, y + 0.2, 0, h - 0.45, 'C9B48A', 0.75); bd(s, it, x + 0.04, y + 0.06, w - 0.16, h - 0.24, { color: C.ink, valign: 'middle', max: 12.5 }); });
        }
      },
    ],
    statement: [
      async (d) => { // a big drawing note: the sentence in white, dimension arrows under it, a title block for the note
        const s = await blueprint(d);
        k.head(s, L.runs(d.text), 0.5, 1.05, 9.0, 2.2, { max: 30, min: 15, color: WHITE });
        t.line(s, 0.5, 3.32, 9.0, 0, YEL, 1.25); k.txt(s, '◀', 0.45, 3.2, 0.26, 0.24, { size: 10, color: YEL, valign: 'middle', ls: 1 }); k.txt(s, '▶', 9.3, 3.2, 0.26, 0.24, { size: 10, color: YEL, align: 'right', valign: 'middle', ls: 1 });
        if (d.caption) { t.rect(s, 2.6, 3.52, 7.0, 1.6, BLUE, { line: { color: LINE, width: 1 }, name: 'Title block' }); bd(s, d.caption, 2.75, 3.56, 6.7, 1.52, { color: WHITE, valign: 'middle', max: 12.5 }); }
      },
      async (d) => { // on the dark wall beside the bench: the saw on its pegs, the sentence and a tag with the note
        const s = bench(d);
        t.img(s, await k.svg('sawLit', `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path fill="#C0C7CE" d="M8,62 L150,44 V112 ${Array.from({ length: 14 }, (_, i) => `L${143 - i * 10},${i % 2 ? 112 : 122}`).join(' ')} L8,98 Z"/><path fill="#\${C.paint[0]}" fill-rule="evenodd" d="M150,34 H182 Q196,34 196,48 V116 Q196,130 182,130 H150 Z M162,58 H184 V106 H162 Z"/></svg>`, 200, 200), 7.1, 0.75, 2.3, 2.3);
        k.head(s, L.runs(d.text), 0.45, 1.0, 6.5, 2.35, { max: 30, min: 15, color: 'FFF6E0' });
        if (d.caption) { t.rect(s, 0.45, 3.42, 9.1, 1.42, C.tag, { name: 'Note' }); t.rect(s, 0.45, 3.42, 0.12, 1.42, C.paint[1], { name: 'Band' }); bd(s, d.caption, 0.7, 3.45, 8.7, 1.36, { color: C.ink, valign: 'middle', max: 12.5 }); }
      },
    ],
    timeline: [
      async (d) => { // a long steel rule stands at the left: each year marked along it, the events reading across
        const s = await page(d), y0 = 1.05, rh = 4.1 / 4;
        await ruler(s, 0.35, y0, 0.55, 4.1, false);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          t.rect(s, 1.0, y + 0.03, 8.65, rh - 0.09, C.tag, { line: { color: 'C9B48A', width: 0.75 }, name: 'Tag' });
          t.rect(s, 0.9, y + rh / 2 - 0.02, 0.1, 0.05, C.paint[0], { name: 'Mark' });
          hd(s, it.year, 1.12, y + 0.03, 1.5, rh - 0.09, { max: 16, min: 11, color: C.paint[0] });
          hd(s, it.h, 2.68, y + 0.03, 2.1, rh - 0.09, { max: 13 });
          bd(s, it.t, 4.85, y + 0.03, 4.7, rh - 0.09, { color: C.ink, valign: 'middle', max: 12 });
        }
      },
      async (d) => { // the yellow rule laid across the wall, events hung on it from above and below
        const s = await page(d), ry = 2.78, rh = 0.48, w = 3.4, step = 1.92;
        await ruler(s, 0, ry, 10, rh);
        for (const [i, it] of d.items.entries()) {
          const x = 0.3 + i * step, up = i % 2 === 0, y = up ? 1.02 : ry + rh + 0.08, h = up ? ry - 1.08 : 5.14 - y;
          t.rect(s, x, y, w, h, C.tag, { line: { color: 'C9B48A', width: 1 }, name: 'Tag' });
          t.rect(s, x, up ? y + h - 0.05 : y, w, 0.05, C.paint[i % 2 ? 1 : 0], { name: 'Tag band' });
          hd(s, it.year, x + 0.1, y + (up ? 0.03 : 0.08), 1.32, 0.36, { max: 13.5, color: C.paint[i % 2 ? 1 : 0] });
          hd(s, it.h, x + 1.44, y + (up ? 0.03 : 0.08), w - 1.5, 0.36, { max: 11.5, min: 10 });
          bd(s, it.t, x + 0.1, y + (up ? 0.4 : 0.46), w - 0.2, h - 0.5, { color: C.ink, max: 11.5 });
        }
      },
      async (d) => { // the drawing sheet: a title-block table, four cells across, year in the head of each
        const s = await blueprint(d), x0 = 0.4, y0 = 1.1, W2 = 9.2, H2 = 3.98, w = W2 / 4;
        t.rect(s, x0, y0, W2, H2, BLUE, { line: { color: LINE, width: 1.5 }, name: 'Title block' });
        t.line(s, x0, y0 + 0.72, W2, 0, LINE, 1); t.line(s, x0, y0 + 1.32, W2, 0, LINE, 0.5);
        for (const [i, it] of d.items.entries()) {
          const x = x0 + i * w;
          if (i) t.line(s, x, y0, 0, H2, LINE, 1);
          hd(s, it.year, x + 0.08, y0 + 0.04, w - 0.16, 0.64, { color: YEL, max: 20, min: 12, align: 'center' });
          hd(s, it.h, x + 0.1, y0 + 0.76, w - 0.2, 0.52, { color: WHITE, max: 13 });
          bd(s, it.t, x + 0.1, y0 + 1.38, w - 0.2, H2 - 1.44, { color: WHITE, max: 13 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old cards, process, stats and timeline were all the same wall of tools and tags
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Asboblar devori', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '2A2016', lt2: C.tag, accent1: C.paint[0], accent2: C.paint[1], accent3: C.paint[2], accent4: C.paint[3], accent5: C.paint[4], accent6: C.paint[5], hlink: C.paint[1], folHlink: C.muted } });
}
module.exports = { id: 158, slug: 'asboblar', name: 'Asboblar devori', category: 'creative', photos: true, build, style: { tone: "amaliy vositalar: har bir band ishga yaraydigan 'asbob'; aniq, qo'llanmaga o'xshash", limits: { card_t4: 100, step_t: 100 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "bold"], "transitions": ["cut", "push:l", "checker"], "cover": ["swingRight", "drop"], "mark": "swing", "deco": "drop", "sig": {"title": "drop", "body": "fadeUp", "item": "swing", "image": "drop", "number": "swing", "order": "diagonal", "stagger": 0.1}, "tempo": 0.9, "kenburns": false};
