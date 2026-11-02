/**
 * 132 Kompas — a compass rose in the middle of the slide; ideas are placed at the cardinal (and intercardinal)
 * directions around it, marked ↑ → ↓ ←. Classic red-and-black needle on warm white, teal accents.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FBF8F3', ink: '1A1A1A', muted: '5E5A54', red: 'C8102E', teal: '0F766E', ring: 'B9B2A6' };
const F = { head: 'Georgia', body: 'Calibri' };
const CX = 5.0, CY = 3.1;
const rose = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><g transform="translate(200 200)"><circle r="190" fill="none" stroke="#B9B2A6" stroke-width="3"/><circle r="160" fill="none" stroke="#B9B2A6" stroke-width="1.5"/>
  ${Array.from({ length: 72 }, (_, i) => `<line x1="0" y1="-190" x2="0" y2="${i % 6 ? -180 : -170}" stroke="#8C857A" stroke-width="2" transform="rotate(${i * 5})"/>`).join('')}
  <polygon points="0,-150 18,-18 0,0 -18,-18" fill="#C8102E"/><polygon points="0,150 18,18 0,0 -18,18" fill="#1A1A1A"/><polygon points="150,0 18,18 0,0 18,-18" fill="#1A1A1A"/><polygon points="-150,0 -18,18 0,0 -18,-18" fill="#1A1A1A"/>
  <polygon points="0,-150 -18,-18 0,0" fill="#8F0B20"/><g transform="rotate(45)" opacity="0.55"><polygon points="0,-100 12,-12 0,0 -12,-12" fill="#0F766E"/><polygon points="0,100 12,12 0,0 -12,12" fill="#0F766E"/><polygon points="100,0 12,12 0,0 12,-12" fill="#0F766E"/><polygon points="-100,0 -12,12 0,0 -12,-12" fill="#0F766E"/></g><circle r="10" fill="#FBF8F3" stroke="#1A1A1A" stroke-width="3"/></g></svg>`;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const drawRose = async (s, cx = CX, cy = CY, d = 1.6) => t.img(s, await k.svg('rose', rose, 400, 400), cx - d / 2, cy - d / 2, d, d);
  // direction slots: N, E, S, W (4); N, SE, SW (3); 6 around (NW, N, NE, SW, S, SE)
  const SL = { N: [3.0, 0.95, 4.0, 1.25, 'center', '\u2191'], S: [3.0, 3.9, 4.0, 1.3, 'center', '\u2193'], E: [5.95, 2.2, 3.65, 1.65, 'left', '\u2192'], W: [0.4, 2.2, 3.65, 1.65, 'right', '\u2190'],
    NW: [0.4, 0.95, 3.55, 1.25, 'right', '\u2196'], NE: [6.05, 0.95, 3.55, 1.25, 'left', '\u2197'], SW: [0.4, 3.9, 3.55, 1.3, 'right', '\u2199'], SE: [6.05, 3.9, 3.55, 1.3, 'left', '\u2198'] };
  const order = (n) => (n <= 2 ? ['W', 'E'] : n === 3 ? ['N', 'SE', 'SW'] : n === 4 ? ['N', 'E', 'S', 'W'] : ['NW', 'NE', 'E', 'SE', 'SW', 'W'].slice(0, n));
  const around = async (s, n, draw) => { await drawRose(s); order(n).forEach((key, i) => { const [x, y, w, h, al, arrow] = SL[key]; k.txt(s, arrow, al === 'right' ? x + w - 0.35 : al === 'left' ? x : x + w / 2 - 0.17, y - 0.02, 0.35, 0.35, { size: 15, bold: true, color: i % 2 ? C.teal : C.red, align: 'center' }); draw(i, al === 'center' ? x : al === 'left' ? x + 0.4 : x, y, al === 'center' ? w : w - 0.4, h, al); }); };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.22, 7.6, 0.6, { max: 22, min: 12, italic: true }); k.txt(s, `${k.idx}\u00B0`, 8.6, 0.22, 1.0, 0.6, { size: 18, bold: true, color: C.red, align: 'right', valign: 'middle', font: F.head }); t.line(s, 0.4, 0.86, 9.2, 0, C.ring, 0.75); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await drawRose(s, 7.3, 2.8, 4.2); if (d.image) await k.photo(s, d.image, 6.4, 1.9, 1.8, 1.8, { mask: 'circle' });
      k.txt(s, k.org3, 0.5, 0.6, 4.6, 0.35, { size: 12, bold: true, color: C.teal }); k.head(s, d.title, 0.5, 1.0, 4.6, 2.4, { max: 36, min: 18, italic: true, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.5, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.5, 0.45, { size: 15, bold: true, color: C.red }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0.6, 1.2, 3.5, 3.5, { mask: 'circle' }); await drawRose(s, 3.75, 4.35, 1.3); k.txt(s, d.text, 4.6, 1.1, 5.0, 4.0, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await around(s, d.items.length, (i, x, y, w, h, al) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y + 0.3, w, h - 0.3, { max: 15, align: al, valign: 'top' })); },
    async cards(d) { const s = page(d); await around(s, d.items.length, (i, x, y, w, h, al) => { k.head(s, d.items[i].h, x, y + (al === 'center' ? 0.3 : 0), w, 0.4, { max: 14, align: al, color: i % 2 ? C.teal : C.red }); k.txt(s, d.items[i].t, x, y + (al === 'center' ? 0.7 : 0.42), w, h - (al === 'center' ? 0.7 : 0.42), { max: 12, align: al }); }); },
    async process(d) { const s = page(d); await around(s, d.steps.length, (i, x, y, w, h, al) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y + (al === 'center' ? 0.3 : 0), w, 0.4, { max: 14, align: al, color: i % 2 ? C.teal : C.red }); k.txt(s, d.steps[i].t, x, y + (al === 'center' ? 0.7 : 0.42), w, h - (al === 'center' ? 0.7 : 0.42), { max: 12, align: al }); }); },
    async stats(d) { const s = page(d); await around(s, d.stats.length, (i, x, y, w, h, al) => { k.head(s, d.stats[i].value, x, y + 0.25, w, 0.65, { max: 34, min: 14, align: al, color: i % 2 ? C.teal : C.red }); k.txt(s, d.stats[i].label, x, y + 0.9, w, h - 0.9, { max: 12, align: al }); }); if (d.note) k.txt(s, d.note, 6.6, 4.5, 3.0, 0.65, { max: 9, color: C.muted }); },
    async compare(d) { const s = page(d); await drawRose(s, CX, CY, 1.4); const w = 3.6, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.12, 3.4);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.95 : 0.45, al = i ? 'left' : 'right'; k.head(s, `${i ? '' : '\u2190 '}${sd.h}${i ? ' \u2192' : ''}`, x, 1.05, w, 0.45, { max: 16, align: al, color: i ? C.teal : C.red }); let y = 1.6; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: al }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); await drawRose(s, CX, 3.75, 1.4); k.head(s, L.runs(d.text), 0.6, 0.95, 8.8, 1.9, { max: 28, min: 14, italic: true, align: 'center' }); if (d.caption) { k.txt(s, d.caption, 0.4, 3.0, 3.6, 2.1, { max: 12, color: C.muted, align: 'right', valign: 'middle' }); } },
    async timeline(d) { const s = page(d); await around(s, d.items.length, (i, x, y, w, h, al) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y + (al === 'center' ? 0.3 : 0), w, 0.4, { max: 14, align: al, color: i % 2 ? C.teal : C.red }); k.txt(s, d.items[i].t, x, y + (al === 'center' ? 0.7 : 0.42), w, h - (al === 'center' ? 0.7 : 0.42), { max: 12, align: al }); }); },
    async quote(d) { const s = page({}); await drawRose(s, 2.3, 3.0, 3.2); k.head(s, `\u201C${d.text}\u201D`, 4.3, 1.1, 5.3, 2.9, { max: 26, min: 13, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 4.3, 4.1, 5.3, 0.45, { size: 14, bold: true, color: C.red }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 4.15 / n; d.items.forEach((it, i) => { const y = 1.0 + i * rh; k.txt(s, ['\u2191', '\u2197', '\u2192', '\u2198', '\u2193', '\u2199'][i % 6], 0.4, y, 0.4, rh, { size: 14, bold: true, color: i % 2 ? C.teal : C.red, valign: 'middle' }); k.txt(s, it, 0.85, y, 8.75, rh, { max: 12, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Kompas', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: C.bg, accent1: C.red, accent2: C.teal, accent3: '8F0B20', accent4: 'B08D57', accent5: C.muted, accent6: C.ring, hlink: C.teal, folHlink: C.muted } });
}
module.exports = { id: 132, slug: 'kompas', name: 'Kompas', category: 'business', photos: true, build, style: { tone: "strategik yo'nalish: har bir band bitta yo'nalish yoki tanlov; aniq va mo'ljalli", limits: { card_t4: 100, card_t3: 110, step_t: 100, event_t: 100, side_item: 50 }, prefer: null } };
