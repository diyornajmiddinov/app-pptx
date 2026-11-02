/**
 * 109 Buklet — a tri-fold brochure laid flat: three vertical panels with fold shadows; the left panel carries
 * the title, the middle panel is coloured, content flows across the panels like a printed leaflet.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FFFFFF', ink: '23303D', muted: '5D6B78', mid: '0F766E', midText: 'FFFFFF', accent: 'F59E0B', side: 'F1F5F4' };
const F = { head: 'Arial', body: 'Calibri' };
const PW = 10 / 3, P = [0, PW, PW * 2];
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const folds = async (s) => { const g = await k.svg('fold', `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="10"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.5" stop-color="#000" stop-opacity="0.16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect width="60" height="10" fill="url(#g)"/></svg>`, 60, 10); t.img(s, g, P[1] - 0.15, 0, 0.3, 5.625); t.img(s, g, P[2] - 0.15, 0, 0.3, 5.625); };
  const page = async (d, midFill = C.mid) => { const s = k.slide(C.paper); t.rect(s, P[0], 0, PW, 5.625, C.side, { name: 'Panel' }); t.rect(s, P[1], 0, PW, 5.625, midFill, { name: 'Panel' }); await folds(s);
    t.rect(s, 0.35, 0.45, 0.6, 0.07, C.accent, { name: 'Accent' }); k.head(s, d.title || '', 0.35, 0.6, PW - 0.65, 2.2, { max: 28, min: 14, valign: 'top' });
    k.txt(s, String(k.idx).padStart(2, '0'), 0.35, 4.2, 1.5, 0.7, { size: 30, bold: true, font: F.head, color: C.mid });
    k.foot(s, { x: 0.35, y: 4.95, w: PW - 0.6, size: 7, color: C.muted }); return s; };
  // place items in the middle (light text) and right (dark text) panels
  const flow = (s, n, draw) => { const per = Math.ceil(n / 2), h = 4.8 / per; for (let i = 0; i < n; i++) { const p = i < per ? 1 : 2, j = p === 1 ? i : i - per; draw(i, P[p] + 0.35, 0.4 + j * h, PW - 0.7, h, p === 1 ? C.midText : C.ink, p === 1 ? 'CCEDE9' : C.muted); } };
  const R = {
    async cover(d) { const s = k.slide(C.paper); t.rect(s, P[0], 0, PW, 5.625, C.side, { name: 'Panel' }); t.rect(s, P[1], 0, PW, 5.625, C.mid, { name: 'Panel' }); await folds(s);
      if (d.image) await k.photo(s, d.image, P[2], 0, PW, 2.9);
      k.head(s, d.title, P[2] + 0.35, 3.05, PW - 0.6, 1.6, { max: 26, min: 14, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, P[2] + 0.35, 4.65, PW - 0.6, 0.7, { max: 11, color: C.muted });
      k.txt(s, k.M.author || '', P[1] + 0.35, 0.6, PW - 0.7, 0.8, { max: 18, bold: true, font: F.head, color: C.midText }); k.txt(s, k.org3.replace(/ {2}\u2022 {2}/g, '\n'), P[1] + 0.35, 1.5, PW - 0.7, 1.5, { max: 13, color: 'CCEDE9' });
      k.txt(s, k.M.topic || '', 0.35, 0.6, PW - 0.7, 2.0, { max: 16, italic: true, color: C.muted }); k.foot(s, { x: 0.35, y: 5.2, w: PW - 0.6, size: 7 }); },
    async intro(d) { const s = await page(d); await k.photo(s, d.image, P[1], 0, PW, 5.625); k.txt(s, d.text, P[2] + 0.35, 0.45, PW - 0.7, 4.7, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = await page(d); k.txt(s, d.text, P[1] + 0.35, 0.45, PW - 0.7, 4.7, { max: 15, min: 10, ls: 1.35, valign: 'middle', color: C.midText }); await k.photo(s, d.image, P[2], 0, PW, 5.625); },
    async agenda(d) { const s = await page(d); flow(s, d.items.length, (i, x, y, w, h, c1) => { k.txt(s, String(i + 1).padStart(2, '0'), x, y, 0.7, Math.min(h, 0.7), { size: 22, bold: true, font: F.head, color: C.accent }); k.head(s, d.items[i], x + 0.75, y, w - 0.75, Math.min(h, 0.7), { max: 16, color: c1 }); }); },
    async cards(d) { const s = await page(d); flow(s, d.items.length, (i, x, y, w, h, c1, c2) => { k.head(s, d.items[i].h, x, y, w, 0.5, { max: 16, color: c1 }); k.txt(s, d.items[i].t, x, y + 0.52, w, h - 0.62, { max: 13, color: c2 }); }); },
    async process(d) { const s = await page(d); flow(s, d.steps.length, (i, x, y, w, h, c1, c2) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.5, { max: 16, color: c1 }); k.txt(s, d.steps[i].t, x, y + 0.52, w, h - 0.62, { max: 13, color: c2 }); }); },
    async stats(d) { const s = await page(d); flow(s, d.stats.length, (i, x, y, w, h, c1, c2) => { k.head(s, d.stats[i].value, x, y, w, Math.min(1.2, h * 0.5), { max: 48, min: 18, color: i === 0 ? C.accent : c1 }); k.txt(s, d.stats[i].label, x, y + Math.min(1.2, h * 0.5), w, h - Math.min(1.2, h * 0.5) - 0.1, { max: 13, color: c2 }); });
      if (d.note) k.txt(s, d.note, 0.35, 2.9, PW - 0.65, 1.2, { max: 11, italic: true, color: C.muted }); },
    async compare(d) { const s = await page(d), w = PW - 0.7, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.3, F.body, 0.15, 4.0);
      [d.left, d.right].forEach((sd, i) => { const x = P[1 + i] + 0.35, c = i ? C.ink : C.midText; k.head(s, sd.h, x, 0.4, w, 0.6, { max: 18, color: i ? C.mid : C.accent }); let y = 1.1; sd.items.forEach((it, j) => { k.txt(s, '\u2022', x, y, 0.3, 0.3, { size: 14, bold: true, color: C.accent }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs, color: c }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); k.head(s, L.runs(d.text), P[1] + 0.35, 0.5, PW - 0.7, 4.5, { max: 30, min: 15, color: C.midText, valign: 'middle' }); if (d.caption) k.txt(s, d.caption, P[2] + 0.35, 0.5, PW - 0.7, 4.5, { max: 14, color: C.muted, valign: 'middle', ls: 1.35 }); },
    async timeline(d) { const s = await page(d); flow(s, d.items.length, (i, x, y, w, h, c1, c2) => { k.head(s, d.items[i].year, x, y, w, 0.45, { max: 20, min: 11, color: C.accent }); k.head(s, d.items[i].h, x, y + 0.45, w, 0.42, { max: 14, color: c1 }); k.txt(s, d.items[i].t, x, y + 0.88, w, h - 0.95, { max: 12, color: c2 }); }); },
    async quote(d) { const s = await page({ title: '\u201C' }); k.head(s, d.text, P[1] + 0.35, 0.5, PW - 0.7, 4.0, { max: 26, min: 14, italic: true, color: C.midText, valign: 'middle' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, P[1] + 0.35, 4.55, PW - 0.7, 0.5, { size: 13, bold: true, color: C.accent }); },
    async sources(d) { const s = await page(d); flow(s, d.items.length, (i, x, y, w, h, c1) => k.txt(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.accent } }, { text: d.items[i] }], x, y, w, h, { max: 12, color: c1, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Buklet', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.mid, lt2: C.side, accent1: C.mid, accent2: C.accent, accent3: '14B8A6', accent4: '0EA5E9', accent5: C.muted, accent6: 'CCEDE9', hlink: C.mid, folHlink: C.muted } });
}
module.exports = { id: 109, slug: 'buklet', name: 'Buklet', category: 'business', photos: true, build, style: { tone: "axborot bukleti: o'quvchiga qulay, qisqa bo'limlar, aniq va amaliy ma'lumot", limits: { title: 45 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "technical"], "transitions": ["p14:doors|dir=\"horz\"", "fade", "morph"], "cover": ["unfold", "fadeLetters"], "mark": "fade", "deco": "stretch", "sig": {"title": "unfold", "body": "fade", "item": ["stretch", "unfold"], "image": "stretch", "number": "popIn", "order": "alternate", "stagger": 0.16}, "tempo": 1.05, "kenburns": false};
