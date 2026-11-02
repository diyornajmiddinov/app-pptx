/**
 * 112 Ufq — horizon: the upper part of every slide is a dusk-coloured sky, the title stands ON the horizon
 * line, content lives on the white ground below; items rise from the horizon like posts.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { ink: '1E293B', muted: '64748B', ground: 'FFFFFF', line: '1E293B', accent: 'F97316' };
const F = { head: 'Arial', body: 'Calibri' };
const HZ = 1.85;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const sky = (h) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#312E81"/><stop offset="0.6" stop-color="#C026D3"/><stop offset="1" stop-color="#FB923C"/></linearGradient></defs><rect width="1600" height="${h}" fill="url(#g)"/><circle cx="1300" cy="${h}" r="${h * 0.42}" fill="#FDE68A" opacity="0.9"/></svg>`;
  const page = async (d) => { const s = k.slide(C.ground); t.img(s, await k.svg('sky', sky(296), 1600, 296), 0, 0, 10, HZ); t.line(s, 0, HZ, 10, 0, C.line, 2.5);
    k.head(s, d.title || '', 0.6, 0.3, 7.8, HZ - 0.38, { max: 34, min: 16, color: 'FFFFFF', valign: 'bottom' }); k.txt(s, String(k.idx).padStart(2, '0'), 8.6, 0.25, 0.9, 0.5, { size: 16, bold: true, color: 'FFFFFF', align: 'right' });
    k.foot(s, { y: 5.27 }); return s; };
  const posts = (s, n, draw) => { const w = 8.8 / n; for (let i = 0; i < n; i++) { const x = 0.6 + i * w; t.line(s, x, HZ, 0, 0.35, C.accent, 2.5); t.oval(s, x - 0.07, HZ + 0.32, 0.14, 0.14, C.accent); draw(i, x + 0.15, w - 0.35); } };
  const R = {
    async cover(d) { const s = k.slide(C.ground); t.img(s, await k.svg('skyC', sky(560), 1600, 560), 0, 0, 10, 3.5); t.line(s, 0, 3.5, 10, 0, C.line, 3);
      if (d.image) { await k.photo(s, d.image, 6.4, 0.5, 3.0, 2.6, { mask: { r: 0.08 } }); }
      k.txt(s, k.org3, 0.6, 0.5, 5.6, 0.3, { size: 12, bold: true, color: 'FDE68A' }); k.head(s, d.title, 0.6, 0.9, 5.7, 2.5, { max: 42, min: 20, color: 'FFFFFF', valign: 'bottom' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.6, 3.7, 8.8, 0.6, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.6, 4.35, 8.8, 0.45, { size: 16, bold: true, color: C.accent }); k.foot(s, { y: 5.27 }); },
    async intro(d) { const s = await page(d); await k.photo(s, d.image, 6.3, HZ + 0.25, 3.2, 2.85, { mask: { r: 0.06 } }); k.txt(s, d.text, 0.6, HZ + 0.25, 5.4, 2.85, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { const s = await page(d); await k.photo(s, d.image, 0.6, HZ + 0.25, 3.2, 2.85, { mask: { r: 0.06 } }); k.txt(s, d.text, 4.1, HZ + 0.25, 5.4, 2.85, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async agenda(d) { const s = await page(d), n = d.items.length, per = Math.ceil(n / 2), rh = 3.0 / per; d.items.forEach((it, i) => { const x = 0.6 + Math.floor(i / per) * 4.5, y = HZ + 0.2 + (i % per) * rh; k.txt(s, String(i + 1).padStart(2, '0'), x, y, 0.7, rh, { size: 20, bold: true, color: C.accent, valign: 'middle' }); k.head(s, it, x + 0.75, y, 3.6, rh, { max: 17 }); }); },
    async cards(d) { const s = await page(d); posts(s, d.items.length, (i, x, w) => { k.head(s, d.items[i].h, x, HZ + 0.25, w, 0.55, { max: 16 }); k.txt(s, d.items[i].t, x, HZ + 0.85, w, 2.3, { max: 13, color: C.muted }); }); },
    async process(d) { const s = await page(d); posts(s, d.steps.length, (i, x, w) => { k.txt(s, `${i + 1}`, x, HZ + 0.2, 0.6, 0.55, { size: 24, bold: true, font: F.head, color: C.accent }); k.head(s, d.steps[i].h, x + 0.55, HZ + 0.2, w - 0.55, 0.55, { max: 15 }); k.txt(s, d.steps[i].t, x, HZ + 0.85, w, 2.3, { max: 13, color: C.muted }); }); },
    async stats(d) { const s = await page(d); posts(s, d.stats.length, (i, x, w) => { k.head(s, d.stats[i].value, x, HZ + 0.2, w, 1.1, { max: 54, min: 20, color: i === 0 ? C.accent : C.ink }); k.txt(s, d.stats[i].label, x, HZ + 1.35, w, 1.1, { max: 13, color: C.muted }); });
      if (d.note) k.txt(s, d.note, 0.6, 4.5, 8.8, 0.6, { max: 10, italic: true, color: C.muted }); },
    async compare(d) { const s = await page(d), w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.3, F.body, 0.14, 2.45); t.line(s, 5.0, HZ, 0, 3.2, C.line, 1.5);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.3 : 0.6; k.head(s, sd.h, x, HZ + 0.15, w, 0.5, { max: 18, color: i ? C.ink : C.accent }); let y = HZ + 0.75; sd.items.forEach((it, j) => { k.txt(s, '\u25B8', x, y, 0.3, 0.3, { size: 12, color: C.accent }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = await page({ title: '' }); k.head(s, L.runs(d.text), 0.6, 0.25, 8.8, HZ - 0.3, { max: 34, min: 16, color: 'FFFFFF', valign: 'bottom' }); if (d.caption) k.txt(s, d.caption, 0.6, HZ + 0.3, 8.8, 2.8, { max: 16, color: C.muted, valign: 'top', ls: 1.35 }); },
    async timeline(d) { const s = await page(d); posts(s, d.items.length, (i, x, w) => { k.head(s, d.items[i].year, x, HZ + 0.2, w, 0.55, { max: 22, min: 12, color: C.accent }); k.head(s, d.items[i].h, x, HZ + 0.8, w, 0.45, { max: 15 }); k.txt(s, d.items[i].t, x, HZ + 1.3, w, 1.85, { max: 13, color: C.muted }); }); },
    async quote(d) { const s = await page({ title: '' }); k.head(s, `\u201C${d.text}\u201D`, 0.6, 0.2, 8.8, HZ - 0.25, { max: 28, min: 14, italic: true, color: 'FFFFFF', valign: 'bottom' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 0.6, HZ + 0.3, 8.8, 0.5, { size: 16, bold: true, color: C.accent }); },
    async sources(d) { const s = await page(d), n = d.items.length, rh = 3.15 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}.  `, options: { bold: true, color: C.accent } }, { text: it }], 0.6, HZ + 0.15 + i * rh, 8.8, rh, { max: 13, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Ufq', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '312E81', lt2: 'F8FAFC', accent1: C.accent, accent2: 'C026D3', accent3: '312E81', accent4: 'FDE68A', accent5: C.muted, accent6: 'E2E8F0', hlink: 'C026D3', folHlink: C.muted } });
}
module.exports = { id: 112, slug: 'ufq', name: 'Ufq', category: 'creative', photos: true, build, style: { tone: "istiqbolli va ilhomli: katta maqsad tepada, aniq qadamlar pastda", limits: {}, prefer: null } };
