/**
 * 106 Maktub — a formal letter: letterhead, place-and-date line, subject line, and ideas written as PROSE
 * paragraphs with run-in bold headings. No boxes, no icons — a page you read, signed at the end.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FFFDF7', ink: '22201C', muted: '6A645A', accent: '1F3A68', rule: 'C9C2B4' };
const F = { head: 'Cambria', body: 'Cambria' };
const scribble = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><path d="M10,55 C40,10 60,70 85,35 S120,10 135,50 S170,65 185,30 S230,20 250,45 L290,40" fill="none" stroke="#1F3A68" stroke-width="3" stroke-linecap="round"/></svg>`;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k, X = 1.0, W = 8.0;
  const letterhead = (s) => { k.txt(s, (k.M.org || k.M.topic || '').toUpperCase(), 1.0, 0.25, 8.0, 0.3, { size: 11, bold: true, spacing: 3, align: 'center', color: C.accent }); t.line(s, 1.0, 0.6, 8.0, 0, C.accent, 1); t.line(s, 1.0, 0.64, 8.0, 0, C.accent, 0.4); };
  const page = (d) => { const s = k.slide(C.paper); letterhead(s); if (d.title) k.txt(s, [{ text: `${k.TR.topic} `, options: { color: C.muted } }, { text: d.title, options: { bold: true } }], X, 0.75, W - 1.8, 0.45, { max: 17, min: 11, valign: 'middle' });
    k.txt(s, [k.M.loc, k.M.year].filter(Boolean).join(', '), X + W - 1.8, 0.75, 1.8, 0.45, { size: 10, italic: true, color: C.muted, align: 'right', valign: 'middle' });
    k.txt(s, `\u2014 ${k.idx} \u2014`, 4.2, 5.0, 1.6, 0.25, { size: 9, align: 'center', color: C.muted }); k.foot(s, { y: 5.28, align: 'center', size: 7.5, x: 1.0, w: 8.0 }); return s; };
  const paras = (s, list, y0 = 1.35, y1 = 4.95) => { const n = list.length, h = (y1 - y0) / n; list.forEach(([head, body], i) => k.txt(s, [{ text: head, options: { bold: true, color: C.accent } }, { text: '  ' + body }], X, y0 + i * h, W, h - 0.06, { max: 15, min: 10, ls: 1.35, valign: 'top' })); };
  const R = {
    async cover(d) { const s = k.slide(C.paper); letterhead(s); if (d.image) { t.rect(s, 7.05, 0.95, 1.95, 2.35, 'FFFFFF', { line: { color: C.rule, width: 1 }, shadow: 0.15, blur: 4, offset: 2, name: 'Enclosure' }); await k.photo(s, d.image, 7.15, 1.05, 1.75, 2.15); }
      k.txt(s, [k.M.loc, k.M.year].filter(Boolean).join(', '), X, 0.85, 5.5, 0.35, { size: 11, italic: true, color: C.muted });
      k.head(s, d.title, X, 1.35, 5.8, 1.8, { max: 34, min: 18, valign: 'top', color: C.ink });
      if (d.subtitle) k.txt(s, d.subtitle, X, 3.2, 5.8, 0.8, { max: 14, italic: true, color: C.muted });
      t.img(s, await k.svg('sig', scribble, 300, 80), X, 4.05, 1.9, 0.5); t.line(s, X, 4.6, 3.2, 0, C.rule, 0.75);
      k.txt(s, k.M.author || '', X, 4.62, 4.0, 0.35, { size: 13, bold: true }); k.foot(s, { y: 5.28, align: 'center', size: 7.5, x: 1.0, w: 8.0 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, X + W - 2.6, 1.4, 2.6, 2.0); k.txt(s, d.text, X, 1.4, W - 2.85, 3.5, { max: 16, min: 10, ls: 1.4 }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, X, 1.4, 2.6, 2.0); k.txt(s, d.text, X + 2.85, 1.4, W - 2.85, 3.5, { max: 16, min: 10, ls: 1.4 }); },
    async agenda(d) { const s = page(d); paras(s, d.items.map((it, i) => [`${i + 1}.`, it])); },
    async cards(d) { const s = page(d); paras(s, d.items.map((it) => [`${it.h}.`, it.t])); },
    async process(d) { const s = page(d); paras(s, d.steps.map((st, i) => [`${i + 1}) ${st.h}.`, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, w = W / n; d.stats.forEach((v, i) => { const x = X + i * w; k.head(s, v.value, x, 1.45, w - 0.2, 1.1, { max: 44, min: 18, color: C.accent }); t.line(s, x, 2.6, w - 0.4, 0, C.rule, 0.75); k.txt(s, v.label, x, 2.7, w - 0.3, 1.2, { max: 13, italic: true }); });
      if (d.note) k.txt(s, d.note, X, 4.05, W, 0.8, { max: 12, color: C.muted, italic: true }); },
    async compare(d) { const s = page(d), w = 3.8, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.12, 3.0);
      [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.4); k.txt(s, sd.h, x, 1.4, w, 0.45, { size: 16, bold: true, italic: true, color: C.accent }); t.line(s, x, 1.87, w, 0, C.accent, 0.75); let y = 1.95; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, ls: 1.25 }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); t.line(s, X + 0.3, 1.5, 0, 2.2, C.accent, 3); k.head(s, L.runs(d.text), X + 0.6, 1.45, W - 0.9, 2.3, { max: 30, min: 15, italic: true }); if (d.caption) k.txt(s, d.caption, X + 0.6, 3.85, W - 0.9, 1.05, { max: 13, color: C.muted }); },
    async timeline(d) { const s = page(d); paras(s, d.items.map((it) => [`${it.year} \u2014 ${it.h}.`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, `\u00AB${d.text}\u00BB`, X + 0.5, 1.5, W - 1.0, 2.3, { max: 30, min: 15, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author, X + 0.5, 3.95, W - 1.0, 0.45, { size: 14, align: 'right', color: C.accent, bold: true }); },
    async sources(d) { const s = page(d); paras(s, d.items.map((it, i) => [`[${i + 1}]`, it])); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Maktub', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.accent, lt2: C.paper, accent1: C.accent, accent2: '8C1C13', accent3: '4F6D7A', accent4: 'A68A64', accent5: C.muted, accent6: C.rule, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 106, slug: 'maktub', name: 'Maktub', category: 'academic', photos: true, build, style: { tone: "rasmiy maktub uslubi: bog'langan to'liq gaplar, hurmatli murojaat, mantiqiy izchillik", limits: {}, prefer: 'text' } };
