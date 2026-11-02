/**
 * 110 Mondrian — the slide IS a Mondrian composition: thick black grid lines dividing the page into white
 * and primary-coloured rectangles; title, items and photos are placed into the cells. Each slide type has its own grid.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { black: '111111', white: 'FAFAF7', red: 'D7261E', blue: '1D4E9E', yellow: 'F5C518', ink: '111111', muted: '444444' };
const F = { head: 'Arial', body: 'Calibri' };
const G = 0.1; // grid line width
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const cell = (s, x, y, w, h, fill = C.white) => { t.rect(s, x + G / 2, y + G / 2, w - G, h - G, fill, { name: 'Cell' }); return { x: x + G / 2 + 0.15, y: y + G / 2 + 0.12, w: w - G - 0.3, h: h - G - 0.24 }; };
  // shared frame: title cell, red accent cell, number cell, footer strip; returns content box
  const page = (d) => { const s = k.slide(C.black);
    const tc = cell(s, 0, 0, 6.6, 1.25); k.head(s, d.title || '', tc.x, tc.y, tc.w, tc.h, { max: 28, min: 14 });
    cell(s, 6.6, 0, 1.3, 1.25, C.red); const nc = cell(s, 7.9, 0, 2.1, 1.25); k.txt(s, String(k.idx), nc.x, nc.y, nc.w, nc.h, { size: 34, bold: true, font: F.head, align: 'right', valign: 'middle' });
    const fc = cell(s, 0, 5.2, 10, 0.425); k.foot(s, { x: fc.x, y: 5.27, w: 9.5, size: 8 }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.black); const tc = cell(s, 0, 0, 6.0, 3.4); cell(s, 6.0, 0, 4.0, 0.9, C.yellow);
      if (d.image) { t.img(s, await k.L.photo(k.L.src(d.image), 3.9, 3.4), 6.05, 0.95, 3.9, 3.4, { alt: '' }); } else cell(s, 6.0, 0.9, 4.0, 3.5, C.blue);
      k.txt(s, k.org3, tc.x, tc.y, tc.w, 0.35, { size: 12, bold: true, color: C.red }); k.head(s, d.title, tc.x, tc.y + 0.4, tc.w, tc.h - 0.4, { max: 40, min: 18, valign: 'top' });
      const sc = cell(s, 0, 3.4, 2.2, 1.8, C.red); const ac = cell(s, 2.2, 3.4, 3.8, 1.8); k.txt(s, [d.subtitle, k.M.author].filter(Boolean).join('\n\n'), ac.x, ac.y, ac.w, ac.h, { max: 13, valign: 'middle' });
      cell(s, 6.0, 4.4, 2.6, 0.8); cell(s, 8.6, 4.4, 1.4, 0.8, C.blue); const fc = cell(s, 0, 5.2, 10, 0.425); k.foot(s, { x: fc.x, y: 5.27, w: 9.5, size: 8 }); void sc; },
    async intro(d) { const s = page(d); t.img(s, await k.L.photo(k.L.src(d.image), 4.4, 3.85), 0.05, 1.3, 4.4, 3.85, { alt: '' }); const c = cell(s, 4.5, 1.25, 4.4, 3.95); cell(s, 8.9, 1.25, 1.1, 2.0, C.yellow); cell(s, 8.9, 3.25, 1.1, 1.95, C.blue); k.txt(s, d.text, c.x, c.y, c.w, c.h, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { const s = page(d); cell(s, 0, 1.25, 1.1, 3.95, C.blue); const c = cell(s, 1.1, 1.25, 4.3, 3.95); k.txt(s, d.text, c.x, c.y, c.w, c.h, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); t.img(s, await k.L.photo(k.L.src(d.image), 4.5, 3.85), 5.45, 1.3, 4.5, 3.85, { alt: '' }); },
    async agenda(d) { const s = page(d), n = d.items.length, per = Math.ceil(n / 2), h = 3.95 / per; const fills = [C.white, C.white, C.yellow, C.white, C.blue, C.white];
      d.items.forEach((it, i) => { const col = Math.floor(i / per), x = col * 5, y = 1.25 + (i % per) * h; cell(s, x, y, 1.0, h, i % 3 === 0 ? C.red : i % 3 === 1 ? C.yellow : C.blue); k.txt(s, String(i + 1), x + 0.1, y, 0.8, h, { size: 22, bold: true, font: F.head, color: i % 3 === 1 ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' }); const c = cell(s, x + 1.0, y, 4.0, h, fills[0]); k.head(s, it, c.x, c.y, c.w, c.h, { max: 18 }); }); },
    async cards(d) { const s = page(d), n = d.items.length, w = 10 / n, accents = [C.red, C.yellow, C.blue, C.red];
      d.items.forEach((it, i) => { cell(s, i * w, 1.25, w, 0.5, accents[i % 4]); const c = cell(s, i * w, 1.75, w, 3.45); k.head(s, it.h, c.x, c.y, c.w, 0.55, { max: 16 }); k.txt(s, it.t, c.x, c.y + 0.6, c.w, c.h - 0.6, { max: 13, color: C.muted }); }); },
    async process(d) { const s = page(d), n = d.steps.length, w = 10 / n;
      d.steps.forEach((st, i) => { const nc = cell(s, i * w, 1.25, w, 0.95, i === n - 1 ? C.red : i % 2 ? C.yellow : C.blue); k.txt(s, String(i + 1), nc.x, nc.y, nc.w, nc.h, { size: 30, bold: true, font: F.head, color: i % 2 && i !== n - 1 ? C.ink : 'FFFFFF', valign: 'middle' }); const c = cell(s, i * w, 2.2, w, 3.0); k.head(s, st.h, c.x, c.y, c.w, 0.55, { max: 15 }); k.txt(s, st.t, c.x, c.y + 0.6, c.w, c.h - 0.6, { max: 13, color: C.muted }); }); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 10 / n, fills = [C.red, C.white, C.blue], fg = ['FFFFFF', C.ink, 'FFFFFF'], hh = d.note ? 3.25 : 3.95;
      d.stats.forEach((v, i) => { const c = cell(s, i * w, 1.25, w, hh, fills[i % 3]); k.head(s, v.value, c.x, c.y, c.w, c.h * 0.55, { max: 60, min: 22, color: fg[i % 3] }); k.txt(s, v.label, c.x, c.y + c.h * 0.58, c.w, c.h * 0.42, { max: 14, color: fg[i % 3] }); });
      if (d.note) { const c = cell(s, 0, 4.5, 10, 0.7, C.yellow); k.txt(s, d.note, c.x, c.y, c.w, c.h, { max: 11, valign: 'middle' }); } },
    async compare(d) { const s = page(d), w = 4.6, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.6, F.body, 0.15, 3.2);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.4 : 0; const hc = cell(s, x, 1.25, w, 0.6, i ? C.blue : C.red); k.head(s, sd.h, hc.x, hc.y, hc.w, hc.h, { max: 17, color: 'FFFFFF' }); const c = cell(s, x, 1.85, w, 3.35); let y = c.y; sd.items.forEach((it, j) => { k.txt(s, it, c.x, y, c.w, rr[j], { size: fs }); y += rr[j]; }); }); cell(s, 4.6, 1.25, 0.8, 3.95, C.yellow); },
    async statement(d) { const s = page(d); const c = cell(s, 0, 1.25, 7.2, 2.9); k.head(s, L.runs(d.text), c.x, c.y, c.w, c.h, { max: 36, min: 16 }); cell(s, 7.2, 1.25, 2.8, 1.5, C.red); cell(s, 7.2, 2.75, 2.8, 1.4, C.yellow); const cc = cell(s, 0, 4.15, 10, 1.05); if (d.caption) k.txt(s, d.caption, cc.x, cc.y, cc.w, cc.h, { max: 13, color: C.muted, valign: 'middle' }); },
    async timeline(d) { const s = page(d), n = d.items.length, w = 10 / n, fills = [C.yellow, C.red, C.blue, C.yellow];
      d.items.forEach((it, i) => { const yc = cell(s, i * w, 1.25, w, 0.8, fills[i % 4]); k.head(s, it.year, yc.x, yc.y, yc.w, yc.h, { max: 24, min: 12, color: fills[i % 4] === C.yellow ? C.ink : 'FFFFFF' }); const c = cell(s, i * w, 2.05, w, 3.15); k.head(s, it.h, c.x, c.y, c.w, 0.5, { max: 15 }); k.txt(s, it.t, c.x, c.y + 0.55, c.w, c.h - 0.55, { max: 13, color: C.muted }); }); },
    async quote(d) { const s = page({}); cell(s, 0, 1.25, 1.6, 3.95, C.blue); const c = cell(s, 1.6, 1.25, 6.8, 3.95); k.head(s, `\u201C${d.text}\u201D`, c.x, c.y, c.w, c.h - 0.6, { max: 30, min: 15, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, c.x, c.y + c.h - 0.5, c.w, 0.45, { size: 14, bold: true, color: C.red }); cell(s, 8.4, 1.25, 1.6, 2.4, C.yellow); cell(s, 8.4, 3.65, 1.6, 1.55, C.red); },
    async sources(d) { const s = page(d); cell(s, 0, 1.25, 0.8, 3.95, C.red); const c = cell(s, 0.8, 1.25, 9.2, 3.95), n = d.items.length, rh = c.h / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.blue } }, { text: it }], c.x, c.y + i * rh, c.w, rh, { max: 13, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Mondrian', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.black, lt2: C.white, accent1: C.red, accent2: C.blue, accent3: C.yellow, accent4: C.black, accent5: C.muted, accent6: 'BBBBBB', hlink: C.blue, folHlink: C.muted } });
}
module.exports = { id: 110, slug: 'mondrian', name: 'Mondrian', category: 'creative', photos: true, build, style: { tone: "toza va tuzilgan: har bir fikr o'z 'katagida', qisqa va aniq", limits: { title: 45 }, prefer: null } };
