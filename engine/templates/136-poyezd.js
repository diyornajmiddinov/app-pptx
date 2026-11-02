/**
 * 136 Poyezd — a train: a locomotive pulls a row of WAGONS along rails; every idea rides in its own wagon
 * (windows on top, wheels below, couplings between); photos look out of a wagon window. Maroon & cream livery.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F3EDE2', ink: '2B1D1A', muted: '6B5A50', car: '7B2D26', car2: '1F4E5F', cream: 'F6E7C8', wheel: '2B2B2B', rail: '8A8178' };
const F = { head: 'Arial', body: 'Calibri' };
const RAIL = 4.95, CAR_TOP = 1.2;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const rails = (s) => { for (let x = 0.1; x < 10; x += 0.35) t.rect(s, x, RAIL + 0.08, 0.2, 0.08, C.rail, { name: 'Sleeper' }); t.line(s, 0, RAIL + 0.07, 10, 0, C.wheel, 2.5); };
  const wagon = (s, x, w, i, top = CAR_TOP) => { const h = RAIL - 0.22 - top; t.rect(s, x, top, w, h, i % 2 ? C.car2 : C.car, { r: 0.08, name: 'Wagon' }); t.rect(s, x, top + 0.12, w, 0.06, C.cream, { name: 'Stripe' }); [x + 0.25, x + w - 0.6].forEach((wx) => { t.oval(s, wx, RAIL - 0.33, 0.35, 0.35, C.wheel); t.oval(s, wx + 0.12, RAIL - 0.21, 0.11, 0.11, C.rail); }); return { x: x + 0.15, y: top + 0.28, w: w - 0.3, h: h - 0.62 }; };
  const loco = (s, x, n) => { t.rect(s, x, 2.3, 1.2, RAIL - 2.52, C.wheel, { r: 0.1, name: 'Locomotive' }); t.rect(s, x + 0.55, 1.75, 0.65, 0.65, C.wheel, { name: 'Cab' }); t.rect(s, x + 0.66, 1.86, 0.43, 0.35, C.cream, { name: 'Cab window' }); t.rect(s, x + 0.1, 1.95, 0.22, 0.4, C.wheel, { name: 'Chimney' }); t.oval(s, x - 0.1, 1.5, 0.5, 0.35, 'D9D2C5'); t.oval(s, x - 0.35, 1.2, 0.45, 0.3, 'E6E0D5'); k.txt(s, String(n), x + 0.05, 2.75, 0.9, 0.7, { size: 24, bold: true, color: C.cream, align: 'center', valign: 'middle' }); [x + 0.1, x + 0.7].forEach((wx) => t.oval(s, wx, RAIL - 0.4, 0.42, 0.42, C.car)); };
  const train = (s, n, draw, top = CAR_TOP) => { loco(s, 0.25, k.idx); const x0 = 1.6, w = (9.75 - x0) / n; for (let i = 0; i < n; i++) { const x = x0 + i * w; t.line(s, x - 0.08, RAIL - 0.45, 0.12, 0, C.wheel, 3); draw(i, wagon(s, x + 0.04, w - 0.08, i, top)); } };
  const page = (d) => { const s = k.slide(C.bg); rails(s); if (d.title) k.head(s, d.title, 0.4, 0.25, 8.8, 0.8, { max: 26, min: 14 }); k.foot(s, { y: 5.32, size: 7.5 }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); rails(s); loco(s, 0.4, ''); const b = wagon(s, 1.75, 4.6, 0, 2.2); k.head(s, d.title, b.x, b.y, b.w, b.h, { max: 26, min: 13, color: C.cream }); if (d.image) { const b2 = wagon(s, 6.45, 3.3, 1, 2.2); await k.photo(s, d.image, b2.x + 0.1, b2.y + 0.05, b2.w - 0.2, b2.h - 0.1, { mask: { r: 0.1 } }); }
      k.txt(s, k.org3, 0.4, 0.4, 9.0, 0.35, { size: 12, bold: true, color: C.car }); k.txt(s, [k.M.author, d.subtitle].filter(Boolean).join('  \u2014  '), 0.4, 0.8, 9.2, 0.9, { max: 15, bold: true, valign: 'top' }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); train(s, 2, async () => {}); const w = (9.75 - 1.6) / 2; await k.photo(s, d.image, 1.6 + 0.25, CAR_TOP + 0.35, w - 0.5, RAIL - CAR_TOP - 1.05, { mask: { r: 0.12 } }); k.txt(s, d.text, 1.6 + w + 0.25, CAR_TOP + 0.3, w - 0.5, RAIL - CAR_TOP - 1.0, { max: 14, min: 9.5, color: C.cream, ls: 1.25, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); train(s, d.items.length, (i, b) => { k.txt(s, String(i + 1), b.x, b.y, b.w, 0.55, { size: 22, bold: true, color: C.cream, align: 'center' }); k.head(s, d.items[i], b.x, b.y + 0.6, b.w, b.h - 0.6, { max: 14, min: 9, color: 'FFFFFF', align: 'center', valign: 'top' }); }); },
    async cards(d) { const s = page(d); train(s, d.items.length, (i, b) => { k.head(s, d.items[i].h, b.x, b.y, b.w, 0.5, { max: 14, color: C.cream, align: 'center' }); k.txt(s, d.items[i].t, b.x, b.y + 0.52, b.w, b.h - 0.52, { max: 12, color: 'FFFFFF', align: 'center' }); }); },
    async process(d) { const s = page(d); train(s, d.steps.length, (i, b) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, b.x, b.y, b.w, 0.5, { max: 14, color: C.cream, align: 'center' }); k.txt(s, d.steps[i].t, b.x, b.y + 0.52, b.w, b.h - 0.52, { max: 12, color: 'FFFFFF', align: 'center' }); }); },
    async stats(d) { const s = page(d); train(s, d.stats.length, (i, b) => { k.head(s, d.stats[i].value, b.x, b.y, b.w, 1.0, { max: 40, min: 16, color: C.cream, align: 'center' }); k.txt(s, d.stats[i].label, b.x, b.y + 1.05, b.w, b.h - 1.05, { max: 12, color: 'FFFFFF', align: 'center' }); }); if (d.note) k.txt(s, d.note, 0.4, 0.95, 9.2, 0.25, { size: 8, color: C.muted }); },
    async compare(d) { const s = page(d); const w = (9.75 - 1.6) / 2 - 0.3, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.1, F.body, 0.08, RAIL - CAR_TOP - 1.25); train(s, 2, (i, b) => { const sd = i ? d.right : d.left; k.head(s, sd.h, b.x, b.y, b.w, 0.45, { max: 15, color: C.cream, align: 'center' }); let y = b.y + 0.5; sd.items.forEach((it, j) => { k.txt(s, it, b.x + 0.05, y, b.w - 0.1, rr[j], { size: fs, color: 'FFFFFF' }); y += rr[j]; }); }); void w; },
    async statement(d) { const s = page(d); train(s, 1, (i, b) => { k.head(s, L.runs(d.text), b.x + 0.2, b.y, b.w - 0.4, b.h * 0.65, { max: 28, min: 14, color: C.cream, align: 'center' }); if (d.caption) k.txt(s, d.caption, b.x + 0.2, b.y + b.h * 0.67, b.w - 0.4, b.h * 0.33, { max: 12, color: 'FFFFFF', align: 'center' }); }); },
    async timeline(d) { const s = page(d); train(s, d.items.length, (i, b) => { k.head(s, d.items[i].year, b.x, b.y, b.w, 0.5, { max: 20, min: 11, color: C.cream, align: 'center' }); k.head(s, d.items[i].h, b.x, b.y + 0.52, b.w, 0.42, { max: 13, color: 'FFFFFF', align: 'center' }); k.txt(s, d.items[i].t, b.x, b.y + 0.96, b.w, b.h - 0.96, { max: 11, color: 'F0E6D6', align: 'center' }); }); },
    async quote(d) { const s = page({}); train(s, 1, (i, b) => { k.head(s, `\u201C${d.text}\u201D`, b.x + 0.2, b.y, b.w - 0.4, b.h - 0.5, { max: 26, min: 13, italic: true, color: C.cream, align: 'center' }); if (d.author) k.txt(s, d.author, b.x, b.y + b.h - 0.45, b.w, 0.4, { size: 13, bold: true, color: 'FFFFFF', align: 'center' }); }); },
    async sources(d) { const s = page(d); train(s, 1, (i, b) => { const n = d.items.length, rh = b.h / n; d.items.forEach((it, j) => k.txt(s, `${j + 1}. ${it}`, b.x + 0.1, b.y + j * rh, b.w - 0.2, rh, { max: 12, color: 'FFFFFF', valign: 'middle' })); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Poyezd', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.car, lt2: C.bg, accent1: C.car, accent2: C.car2, accent3: C.cream, accent4: 'C08552', accent5: C.muted, accent6: C.rail, hlink: C.car2, folHlink: C.muted } });
}
module.exports = { id: 136, slug: 'poyezd', name: 'Poyezd', category: 'creative', photos: true, build, style: { tone: "harakat va ketma-ketlik: har bir band keyingisini tortadi; aniq, qisqa, dinamik", limits: { card_t4: 100, card_t3: 120, step_t: 100, event_t: 90 }, prefer: null } };
