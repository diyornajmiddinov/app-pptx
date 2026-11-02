/**
 * 122 Tablo — an airport split-flap departure board: black board, flap tiles with a split line, amber monospace
 * lettering, rows with index / name / info / status lamp. Numbers and years flip on individual tiles.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { board: '121212', tile: '262626', ink: 'FFC83D', white: 'EDEDED', muted: '9A9A9A', green: '3DDC84', red: 'FF5252' };
const F = { head: 'Courier New', body: 'Arial' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const tile = (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.tile, { r: 0.04, name: 'Flap' }); t.line(s, x, y + h / 2, w, 0, '0A0A0A', 1); };
  const flaps = (s, str, x, y, cw, h, color = C.ink) => [...String(str)].forEach((ch, i) => { tile(s, x + i * (cw + 0.04), y, cw, h); k.txt(s, ch, x + i * (cw + 0.04), y, cw, h, { size: Math.round(h * 40), bold: true, font: F.head, color, align: 'center', valign: 'middle' }); });
  const head = (s, d) => { flaps(s, String(k.idx).padStart(2, '0'), 0.35, 0.3, 0.38, 0.6); if (d.title) { tile(s, 1.25, 0.3, 6.6, 0.6); k.head(s, d.title.toUpperCase(), 1.38, 0.3, 6.35, 0.6, { max: 20, min: 11, color: C.white, font: F.head }); } flaps(s, String(k.M.year || '').slice(-4), 8.0, 0.3, 0.38, 0.6, C.white); t.line(s, 0.35, 1.05, 9.3, 0, '333333', 1); };
  const page = (d) => { const s = k.slide(C.board); head(s, d); k.foot(s, { x: 0.35, y: 5.3, w: 9.3, color: C.muted, size: 7.5, font: F.head }); return s; };
  // board rows: [index flap][name tile][info text][lamp]
  const rows = (s, n, draw, y0 = 1.2, h = 3.95) => { const rh = h / n; for (let i = 0; i < n; i++) { const y = y0 + i * rh; flaps(s, String(i + 1).padStart(2, '0'), 0.35, y + 0.05, 0.3, Math.min(0.5, rh - 0.1)); t.oval(s, 9.38, y + rh / 2 - 0.08, 0.16, 0.16, i === 0 ? C.green : i === n - 1 ? C.red : C.ink); draw(i, y, rh); if (i < n - 1) t.line(s, 0.35, y + rh, 9.3, 0, '262626', 0.75); } };
  const R = {
    async cover(d) { const s = k.slide(C.board); if (d.image) await k.photo(s, d.image, 6.5, 0.35, 3.15, 2.5, { gray: true });
      const words = d.title.toUpperCase().split(' '); let line = '', lines = []; words.forEach((w) => { if ((line + ' ' + w).trim().length > 14) { lines.push(line.trim()); line = w; } else line += ' ' + w; }); lines.push(line.trim()); lines = lines.slice(0, 4);
      lines.forEach((ln, r) => flaps(s, ln, 0.35, 0.35 + r * 0.62, 0.38, 0.55));
      tile(s, 0.35, 3.05, 5.9, 0.5); k.txt(s, (k.M.author || '').toUpperCase(), 0.48, 3.05, 5.7, 0.5, { max: 15, bold: true, font: F.head, color: C.white, valign: 'middle' });
      tile(s, 0.35, 3.62, 5.9, 0.5); k.txt(s, [k.M.org, k.M.loc].filter(Boolean).join(' \u2192 ').toUpperCase(), 0.48, 3.62, 5.7, 0.5, { max: 13, font: F.head, color: C.ink, valign: 'middle' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.35, 4.3, 9.3, 0.7, { max: 12, color: C.muted }); k.foot(s, { x: 0.35, y: 5.3, w: 9.3, color: C.muted, size: 7.5, font: F.head }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 6.3, 1.25, 3.35, 3.85, { gray: true }); k.txt(s, d.text, 0.4, 1.25, 5.6, 3.85, { max: 15, min: 10, color: C.white, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0.35, 1.25, 3.35, 3.85, { gray: true }); k.txt(s, d.text, 4.0, 1.25, 5.6, 3.85, { max: 15, min: 10, color: C.white, ls: 1.35, valign: 'middle' }); },
    async agenda(d) { const s = page(d); rows(s, d.items.length, (i, y, rh) => { tile(s, 1.1, y + 0.05, 8.0, rh - 0.1); k.head(s, d.items[i].toUpperCase(), 1.25, y + 0.05, 7.7, rh - 0.1, { max: 18, color: C.ink, font: F.head }); }); },
    async cards(d) { const s = page(d); rows(s, d.items.length, (i, y, rh) => { tile(s, 1.1, y + 0.05, 2.8, rh - 0.1); k.head(s, d.items[i].h.toUpperCase(), 1.22, y + 0.05, 2.58, rh - 0.1, { max: 14, color: C.ink, font: F.head }); k.txt(s, d.items[i].t, 4.1, y + 0.03, 5.1, rh - 0.06, { max: 13, color: C.white, valign: 'middle' }); }); },
    async process(d) { const s = page(d); rows(s, d.steps.length, (i, y, rh) => { tile(s, 1.1, y + 0.05, 2.8, rh - 0.1); k.head(s, d.steps[i].h.toUpperCase(), 1.22, y + 0.05, 2.58, rh - 0.1, { max: 14, color: C.ink, font: F.head }); k.txt(s, d.steps[i].t, 4.1, y + 0.03, 5.1, rh - 0.06, { max: 13, color: C.white, valign: 'middle' }); }); },
    async stats(d) { const s = page(d); const n = d.stats.length; rows(s, n, (i, y, rh) => { const v = String(d.stats[i].value); const cw = Math.min(0.42, 3.4 / v.length - 0.04); flaps(s, v, 1.1, y + 0.08, cw, Math.min(rh - 0.16, 0.75)); k.txt(s, d.stats[i].label, 4.8, y, 4.4, rh, { max: 14, color: C.white, valign: 'middle' }); }, 1.2, d.note ? 3.3 : 3.95);
      if (d.note) k.txt(s, d.note, 0.35, 4.55, 9.3, 0.6, { max: 10, color: C.muted, font: F.head }); },
    async compare(d) { const s = page(d), w = 4.5, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.3, F.body, 0.12, 3.25);
      [d.left, d.right].forEach((sd, i) => { const x = 0.35 + i * 4.8; tile(s, x, 1.2, w, 0.55); k.head(s, sd.h.toUpperCase(), x + 0.12, 1.2, w - 0.24, 0.55, { max: 15, color: i ? C.green : C.ink, font: F.head }); let y = 1.9; sd.items.forEach((it, j) => { k.txt(s, '\u25B8', x, y, 0.25, 0.3, { size: 11, color: i ? C.green : C.ink }); k.txt(s, it, x + 0.28, y, w - 0.3, rr[j], { size: fs, color: C.white }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); tile(s, 0.35, 1.25, 9.3, 2.45); k.head(s, L.runs(d.text.toUpperCase()), 0.6, 1.3, 8.8, 2.35, { max: 30, min: 13, color: C.ink, font: F.head, align: 'center' }); if (d.caption) k.txt(s, d.caption, 0.4, 3.85, 9.2, 1.2, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); rows(s, d.items.length, (i, y, rh) => { const it = d.items[i]; flaps(s, String(it.year).slice(0, 6), 1.1, y + 0.08, 0.32, Math.min(rh - 0.16, 0.5), C.white); k.head(s, it.h.toUpperCase(), 3.25, y, 2.3, rh, { max: 13, color: C.ink, font: F.head }); k.txt(s, it.t, 5.65, y + 0.03, 3.6, rh - 0.06, { max: 12, color: C.white, valign: 'middle' }); }); },
    async quote(d) { const s = page({}); k.head(s, `"${d.text}"`, 0.6, 1.3, 8.8, 2.6, { max: 26, min: 13, color: C.white, font: F.head, align: 'center' }); if (d.author) { tile(s, 3.0, 4.05, 4.0, 0.5); k.txt(s, d.author.toUpperCase(), 3.1, 4.05, 3.8, 0.5, { max: 13, bold: true, font: F.head, color: C.ink, align: 'center', valign: 'middle' }); } },
    async sources(d) { const s = page(d); rows(s, d.items.length, (i, y, rh) => k.txt(s, d.items[i], 1.1, y, 8.1, rh, { max: 12, color: C.white, valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Tablo', colors: { dk1: C.board, lt1: C.white, dk2: C.tile, lt2: C.muted, accent1: C.ink, accent2: C.green, accent3: C.red, accent4: '4FC3F7', accent5: C.muted, accent6: '555555', hlink: C.ink, folHlink: C.muted } });
}
module.exports = { id: 122, slug: 'tablo', name: 'Tablo', category: 'business', photos: true, build, style: { tone: "e'lon tablosi kabi: lo'nda nomlar, aniq holat va raqamlar; ortiqcha so'zsiz", limits: { title: 45, card_h: 18, step_h: 18 }, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "bold"], "transitions": ["randomBar:h", "blinds", "cut"], "cover": ["typeLetters", "blinds"], "mark": "blinds", "deco": "blinds", "sig": {"title": "blinds", "body": "typeLetters", "item": "blinds", "image": "blinds", "number": "blinds", "order": "seq", "stagger": 0.09}, "tempo": 0.85, "kenburns": false};
