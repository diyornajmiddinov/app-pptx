/**
 * 101 Vertikal — the title runs VERTICALLY up a full-height colour column on the left; content lives
 * in an open white field with no title bar. Lists are stacked rows separated by hairlines; no boxes at all.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { col: '1B4332', accent: 'F4A261', ink: '1B1B1B', muted: '5A5A5A', rule: 'D8D8D8', bg: 'FFFFFF' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const X = 1.75, Wc = 7.75, Y = 0.5, Hc = 4.45; // open content field
  const page = (d) => {
    const s = k.slide(C.bg);
    t.rect(s, 0, 0, 1.3, 5.625, C.col, { name: 'Title column' });
    const T = d.title || '', fs = L.fit(T, 5.0, 0.95, 30, 14, F.head, true, 1.05);
    t.text(s, T, { x: 0.65 - 2.55, y: 2.55 - 0.5, w: 5.1, h: 1.0, rotate: 270, fontFace: F.head, bold: true, fontSize: fs, color: 'FFFFFF', valign: 'middle', lineSpacingMultiple: 1.0 });
    k.txt(s, String(k.idx).padStart(2, '0'), 0.1, 4.75, 1.1, 0.6, { size: 26, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle' });
    k.foot(s, { x: X, w: Wc, y: 5.25 });
    return s;
  };
  const rows = (s, n, draw) => { const rh = Hc / n; for (let i = 0; i < n; i++) { const y = Y + i * rh; draw(i, y, rh); if (i < n - 1) t.line(s, X, y + rh, Wc, 0, C.rule, 0.75); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); t.rect(s, 0, 0, 5.2, 5.625, C.col, { name: 'Column' });
      if (d.image) await k.photo(s, d.image, 5.2, 0, 4.8, 5.625);
      k.txt(s, k.org3, 0.55, 0.6, 4.3, 0.35, { size: 12, bold: true, color: C.accent });
      k.head(s, d.title, 0.55, 1.0, 4.2, 2.6, { max: 42, min: 20, color: 'FFFFFF', valign: 'bottom' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.55, 3.75, 4.2, 0.8, { max: 13, color: 'CFE3D6' });
      k.txt(s, k.M.author || '', 0.55, 4.6, 4.2, 0.4, { size: 15, bold: true, color: 'FFFFFF' }); k.foot(s, { w: 4.4, y: 5.2, color: 'A8C5B4', size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 6.0, 0, 4.0, 5.625); k.txt(s, d.text, X, Y + 0.3, 3.95, Hc - 0.5, { max: 17, min: 11, valign: 'middle', ls: 1.35 }); t.rect(s, X, Y, 0.6, 0.08, C.accent, { name: 'Accent' }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 1.3, 0, 8.7, 2.55); k.txt(s, d.text, X, 2.8, Wc, 2.3, { max: 16, min: 11, valign: 'middle', ls: 1.3 }); },
    async agenda(d) { const s = page(d); rows(s, d.items.length, (i, y, rh) => { k.txt(s, String(i + 1).padStart(2, '0'), X, y, 1.0, rh, { size: Math.min(30, rh * 40), bold: true, font: F.head, color: C.accent, valign: 'middle' }); k.head(s, d.items[i], X + 1.1, y, Wc - 1.1, rh, { max: 20 }); }); },
    async cards(d) { const s = page(d); for (const [i] of d.items.entries()); rows(s, d.items.length, (i, y, rh) => { const it = d.items[i]; k.head(s, it.h, X, y + 0.05, 2.6, rh - 0.1, { max: 17, color: C.col }); k.txt(s, it.t, X + 2.8, y + 0.05, Wc - 2.8, rh - 0.1, { max: 14, valign: 'middle', color: C.muted }); }); },
    async process(d) { const s = page(d), n = d.steps.length, rh = Hc / n; t.line(s, X + 0.17, Y + 0.2, 0, Hc - rh + 0.1, C.col, 2);
      d.steps.forEach((st, i) => { const y = Y + i * rh; t.oval(s, X, y + 0.05, 0.34, 0.34, i === n - 1 ? C.accent : C.col); k.txt(s, String(i + 1), X, y + 0.05, 0.34, 0.34, { size: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); k.head(s, st.h, X + 0.6, y, Wc - 0.6, 0.45, { max: 17 }); k.txt(s, st.t, X + 0.6, y + 0.45, Wc - 0.6, rh - 0.5, { max: 13, color: C.muted }); }); },
    async stats(d) { const s = page(d), n = d.stats.length; rows(s, n + (d.note ? 1 : 0), (i, y, rh) => { if (i === n) return k.txt(s, d.note, X, y, Wc, rh, { max: 11, color: C.muted, valign: 'middle', italic: true }); const x = d.stats[i]; k.head(s, x.value, X, y, 3.0, rh, { max: 48, min: 20, color: i === 0 ? C.accent : C.col }); k.txt(s, x.label, X + 3.2, y, Wc - 3.2, rh, { max: 15, valign: 'middle' }); }); },
    async compare(d) { const s = page(d), w = (Wc - 0.4) / 2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.3, F.body, 0.15, Hc - 0.8);
      [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.4); k.head(s, sd.h, x, Y, w, 0.55, { max: 20, color: i ? C.col : C.accent }); t.line(s, x, Y + 0.6, w, 0, i ? C.col : C.accent, 2); let y = Y + 0.8; sd.items.forEach((it, j) => { k.txt(s, '\u2014', x, y, 0.3, 0.3, { size: 13, color: C.muted }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), X, Y, Wc, 2.9, { max: 40, min: 18, valign: 'bottom', color: C.col }); t.rect(s, X, Y + 3.05, 1.0, 0.08, C.accent, { name: 'Accent' }); if (d.caption) k.txt(s, d.caption, X, Y + 3.25, Wc, Hc - 3.25, { max: 13, color: C.muted }); },
    async timeline(d) { const s = page(d); rows(s, d.items.length, (i, y, rh) => { const it = d.items[i]; k.head(s, it.year, X, y, 1.6, rh, { max: 24, min: 12, color: C.accent }); k.head(s, it.h, X + 1.75, y + 0.05, 2.3, rh - 0.1, { max: 16 }); k.txt(s, it.t, X + 4.15, y + 0.05, Wc - 4.15, rh - 0.1, { max: 13, color: C.muted, valign: 'middle' }); }); },
    async quote(d) { const s = page({ title: '\u201C \u201D' }); k.txt(s, '\u201C', X - 0.1, Y - 0.2, 1.2, 1.4, { size: 110, bold: true, font: F.head, color: C.accent }); k.head(s, d.text, X + 0.2, Y + 0.9, Wc - 0.4, 2.5, { max: 32, min: 16, italic: true, valign: 'top', color: C.col }); if (d.author) k.txt(s, `\u2014 ${d.author}`, X + 0.2, Y + 3.5, Wc - 0.4, 0.45, { size: 15, bold: true, color: C.muted }); },
    async sources(d) { const s = page(d); rows(s, d.items.length, (i, y, rh) => { k.txt(s, `${i + 1}.`, X, y, 0.45, rh, { size: 13, bold: true, color: C.accent, valign: 'middle' }); k.txt(s, d.items[i], X + 0.5, y, Wc - 0.5, rh, { max: 13, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Vertikal', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.col, lt2: 'F2F2F2', accent1: C.col, accent2: C.accent, accent3: '40916C', accent4: 'E76F51', accent5: C.muted, accent6: C.rule, hlink: C.col, folHlink: C.muted } });
}
module.exports = { id: 101, slug: 'vertikal', name: 'Vertikal', category: 'minimalist', photos: true, build, style: { tone: "aniq va tartibli: qisqa sarlavhalar, bandma-band ochiq matn", limits: { title: 45 }, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "elegant"], "transitions": ["push:u", "wipe:u", "fade"], "cover": ["riseWords", "peekUp"], "mark": "peekUp", "deco": "wipe:u", "sig": {"title": "peekUp", "body": "wipe:u", "item": "riseUp", "image": "wipe:u", "number": "popIn", "order": "seq", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
