/**
 * 135 Fasad — a classical building FACADE: the title sits on a triangular pediment, columns divide the front
 * into bays, each idea lives in a bay under an arched window; lists become floors of the building.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { sky: 'EAF2F8', stone: 'E8DFCE', stone2: 'D6C8AE', ink: '2E2A24', muted: '5F574C', win: '5B7C99', accent: '8A5A44' };
const F = { head: 'Times New Roman', body: 'Calibri' };
const BX = 0.4, BW = 9.2, BY = 1.35, BH = 3.65;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const pediment = async (s, title) => { t.img(s, await k.svg('ped', `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="100"><polygon points="0,100 460,4 920,100" fill="#${C.stone}" stroke="#${C.stone2}" stroke-width="4"/><polygon points="60,92 460,14 860,92" fill="none" stroke="#${C.stone2}" stroke-width="2"/></svg>`, 920, 100), BX, 0.18, BW, 1.0);
    t.rect(s, BX, 1.18, BW, 0.17, C.stone2, { name: 'Entablature' }); k.head(s, title || '', 2.2, 0.55, 5.6, 0.55, { max: 20, min: 11, align: 'center', font: F.head, spacing: 2 }); };
  const base = (s) => { t.rect(s, BX, BY, BW, BH, C.stone, { name: 'Wall' }); t.rect(s, BX - 0.15, BY + BH, BW + 0.3, 0.12, C.stone2, { name: 'Stylobate' }); };
  const column = (s, x) => { t.rect(s, x, BY, 0.22, BH, 'F3ECDD', { name: 'Column' }); for (let f = 0; f < 3; f++) t.line(s, x + 0.05 + f * 0.06, BY + 0.12, 0, BH - 0.24, C.stone2, 0.5); t.rect(s, x - 0.05, BY, 0.32, 0.1, C.stone2, { name: 'Capital' }); };
  const window = (s, x, y, w, h) => { t.rect(s, x, y + w / 2, w, h - w / 2, C.win, { name: 'Window' }); t.shape(s, 'CHORD', { x, y, w, h: w, fill: { color: C.win }, angleRange: [180, 0], objectName: 'Arch' }); };
  const page = async (d) => { const s = k.slide(C.sky); await pediment(s, (d.title || '').toUpperCase()); base(s); k.txt(s, ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'][k.idx - 1] || String(k.idx), 4.5, 0.82, 1.0, 0.3, { size: 10, bold: true, color: C.accent, align: 'center', font: F.head }); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); return s; };
  const bays = (s, n, draw) => { const w = BW / n; for (let i = 0; i <= n; i++) column(s, BX + i * w - (i === n ? 0.22 : i ? 0.11 : 0)); for (let i = 0; i < n; i++) { const x = BX + i * w + 0.3, ww = w - 0.6; window(s, x + ww / 2 - 0.3, BY + 0.2, 0.6, 0.7); draw(i, x, BY + 1.0, ww, BH - 1.1); } };
  const floors = (s, n, draw) => { const rh = BH / n; for (let i = 0; i < n; i++) { const y = BY + i * rh; if (i) t.line(s, BX, y, BW, 0, C.stone2, 2); for (let w2 = 0; w2 < 2; w2++) t.rect(s, BX + 0.25 + w2 * 0.45, y + 0.1, 0.32, rh - 0.2, C.win, { name: 'Window' }); draw(i, BX + 1.25, y, BW - 1.5, rh); } };
  const R = {
    async cover(d) { const s = k.slide(C.sky); await pediment(s, (k.M.org || '').toUpperCase()); base(s); [0, 1, 2, 3].forEach((i) => column(s, BX + i * (BW / 3) - (i === 3 ? 0.22 : i ? 0.11 : 0)));
      if (d.image) await k.photo(s, d.image, BX + BW / 3 * 2 + 0.3, BY + 0.3, BW / 3 - 0.6, BH - 0.6, { mask: { path: 'M0,0.3 A0.5,0.3 0 0 1 1,0.3 L1,1 L0,1 Z' } });
      k.head(s, d.title, BX + 0.4, BY + 0.3, BW / 3 * 2 - 0.8, 2.2, { max: 34, min: 16, font: F.head, align: 'center' }); if (d.subtitle) k.txt(s, d.subtitle, BX + 0.4, BY + 2.5, BW / 3 * 2 - 0.8, 0.6, { max: 12, color: C.muted, align: 'center' }); k.txt(s, [k.M.author, [k.M.loc, k.M.year].filter(Boolean).join(', ')].filter(Boolean).join('  \u2022  '), BX + 0.4, BY + 3.05, BW / 3 * 2 - 0.8, 0.45, { size: 13, bold: true, align: 'center', color: C.accent }); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); },
    async intro(d) { const s = await page(d); bays(s, 2, () => {}); await k.photo(s, d.image, BX + 0.35, BY + 0.2, BW / 2 - 0.7, BH - 0.4, { mask: { path: 'M0,0.25 A0.5,0.25 0 0 1 1,0.25 L1,1 L0,1 Z' } }); k.txt(s, d.text, BX + BW / 2 + 0.3, BY + 0.2, BW / 2 - 0.6, BH - 0.4, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = await page(d); floors(s, d.items.length, (i, x, y, w, h) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 17, font: F.head })); },
    async cards(d) { const s = await page(d); bays(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.45, { max: 15, align: 'center', font: F.head }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: 'center' }); }); },
    async process(d) { const s = await page(d); bays(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.45, { max: 15, align: 'center', font: F.head }); k.txt(s, d.steps[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: 'center' }); }); },
    async stats(d) { const s = await page(d); bays(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, w, 0.95, { max: 40, min: 16, align: 'center', color: C.accent, font: F.head }); k.txt(s, d.stats[i].label, x, y + 1.0, w, h - 1.0 - (d.note ? 0.45 : 0), { max: 12, align: 'center' }); }); if (d.note) k.txt(s, d.note, BX + 0.3, BY + BH - 0.5, BW - 0.6, 0.45, { max: 8.5, color: C.muted, align: 'center' }); },
    async compare(d) { const s = await page(d); const w = BW / 2 - 0.6, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.1, BH - 0.75); [0, 1, 2].forEach((i) => column(s, BX + i * BW / 2 - (i === 2 ? 0.22 : i ? 0.11 : 0)));
      [d.left, d.right].forEach((sd, i) => { const x = BX + i * BW / 2 + 0.35; k.head(s, sd.h, x, BY + 0.12, w, 0.5, { max: 17, align: 'center', font: F.head, color: C.accent }); let y = BY + 0.7; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); t.rect(s, BX + 0.6, BY + 0.35, BW - 1.2, 2.2, 'F3ECDD', { line: { color: C.stone2, width: 2 }, name: 'Plaque' }); k.head(s, L.runs(d.text), BX + 0.85, BY + 0.4, BW - 1.7, 2.1, { max: 28, min: 14, align: 'center', font: F.head }); if (d.caption) k.txt(s, d.caption, BX + 0.6, BY + 2.65, BW - 1.2, 0.9, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = await page(d); floors(s, d.items.length, (i, x, y, w, h) => { const it = d.items[d.items.length - 1 - i]; k.head(s, it.year, x, y, 1.2, h, { max: 20, min: 11, color: C.accent, font: F.head }); k.head(s, it.h, x + 1.3, y, 2.2, h, { max: 14 }); k.txt(s, it.t, x + 3.6, y, w - 3.6, h, { max: 12, valign: 'middle' }); }); },
    async quote(d) { const s = await page({}); t.rect(s, BX + 2.8, BY + 1.3, 3.6, BH - 1.3, C.win, { name: 'Door' }); k.head(s, `\u201C${d.text}\u201D`, BX + 0.5, BY + 0.15, BW - 1.0, 1.1, { max: 22, min: 11, italic: true, align: 'center', font: F.head }); if (d.author) k.txt(s, d.author, BX + 2.8, BY + 2.1, 3.6, 0.5, { size: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
    async sources(d) { const s = await page(d); floors(s, d.items.length, (i, x, y, w, h) => k.txt(s, d.items[i], x, y, w, h, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Fasad', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '4A4036', lt2: C.sky, accent1: C.accent, accent2: C.win, accent3: C.stone2, accent4: 'B08D57', accent5: C.muted, accent6: C.stone, hlink: C.win, folHlink: C.muted } });
}
module.exports = { id: 135, slug: 'fasad', name: 'Fasad', category: 'academic', photos: true, build, style: { tone: "poydevor va ustunlar: tayanch tamoyillar, mustahkam dalillar, salobatli til", limits: { card_t4: 100, step_t: 100 }, prefer: null } };
