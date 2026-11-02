/**
 * 108 Lug'at — a dictionary page: guide words in the top corners, two justified columns of ENTRIES
 * (bold headword, ◆ sense marks), a column rule, small engravings as figures. Cover = cloth binding with gold stamping.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FBFAF6', ink: '1E1E1E', muted: '5F5F5F', accent: '8B1A1A', cloth: '13294B', gold: 'C9A227', rule: 'BDB8AE' };
const F = { head: 'Cambria', body: 'Cambria' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d, first = '', last = '') => { const s = k.slide(C.paper); k.txt(s, first, 0.6, 0.22, 3.0, 0.3, { size: 10, bold: true, italic: true, color: C.muted }); k.txt(s, last, 6.4, 0.22, 3.0, 0.3, { size: 10, bold: true, italic: true, color: C.muted, align: 'right' }); t.line(s, 0.6, 0.55, 8.8, 0, C.ink, 1);
    if (d.title) k.txt(s, [{ text: d.title, options: { bold: true } }, { text: '  \u2014  ', options: { color: C.muted } }, { text: `${k.idx}`, options: { color: C.accent, bold: true } }], 0.6, 0.62, 8.8, 0.55, { max: 22, min: 13, font: F.head, valign: 'middle' });
    k.foot(s, { y: 5.27, align: 'center', font: F.head, size: 8 }); return s; };
  // two-column flow of entries: each entry = bold headword + text, entries split evenly
  const entries = (s, list) => { const n = list.length, per = Math.ceil(n / 2), w = 4.2, top = 1.3, hh = 3.85 / per; t.line(s, 5.0, top, 0, 3.85, C.rule, 0.75);
    list.forEach(([hw, body], i) => k.txt(s, [{ text: hw, options: { bold: true, color: C.accent } }, { text: '  \u25C6  ', options: { color: C.muted } }, { text: body }], 0.6 + Math.floor(i / per) * 4.6, top + (i % per) * hh, w, hh - 0.06, { max: 14, min: 10, ls: 1.25, align: 'justify' })); };
  const R = {
    async cover(d) { const s = k.slide(C.cloth); t.rect(s, 0.45, 0.35, 9.1, 4.85, null, { line: { color: C.gold, width: 2 }, name: 'Gold frame' }); t.rect(s, 0.6, 0.5, 8.8, 4.55, null, { line: { color: C.gold, width: 0.75 }, name: 'Gold frame' });
      if (d.image) { t.oval(s, 3.95, 0.75, 2.1, 2.1, C.gold); await k.photo(s, d.image, 4.03, 0.83, 1.94, 1.94, { mask: 'circle', duo: ['13294B', 'E8D9A8'] }); }
      k.head(s, d.title.toUpperCase(), 1.0, d.image ? 2.95 : 1.4, 8.0, 1.2, { max: 32, min: 16, align: 'center', color: C.gold, spacing: 2 });
      k.txt(s, [k.M.author, k.org3].filter(Boolean).join('\n'), 1.5, d.image ? 4.2 : 3.2, 7.0, 0.75, { max: 12, align: 'center', color: 'E8D9A8', valign: 'middle' }); k.foot(s, { y: 5.27, align: 'center', color: '8A9BB8', size: 7.5 }); },
    async intro(d) { const s = page(d, '', ''); await k.photo(s, d.image, 6.4, 1.35, 3.0, 2.6, { gray: true }); k.txt(s, `${k.TR.caption}. ${d.title}`, 6.4, 4.0, 3.0, 0.3, { size: 9, italic: true, color: C.muted, align: 'center' }); k.txt(s, d.text, 0.6, 1.3, 5.5, 3.85, { max: 15, min: 10, ls: 1.3, align: 'justify' }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0.6, 1.35, 3.0, 2.6, { gray: true }); k.txt(s, `${k.TR.caption}. ${d.title}`, 0.6, 4.0, 3.0, 0.3, { size: 9, italic: true, color: C.muted, align: 'center' }); k.txt(s, d.text, 3.9, 1.3, 5.5, 3.85, { max: 15, min: 10, ls: 1.3, align: 'justify' }); },
    async agenda(d) { const s = page(d, d.items[0], d.items[d.items.length - 1]); entries(s, d.items.map((it, i) => [`${i + 1}.`, it])); },
    async cards(d) { const s = page(d, d.items[0].h, d.items[d.items.length - 1].h); entries(s, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d, d.steps[0].h, d.steps[d.steps.length - 1].h); entries(s, d.steps.map((st, i) => [`${st.h} ${i + 1}`, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 8.8 / n; d.stats.forEach((v, i) => { const x = 0.6 + i * w; if (i) t.line(s, x - 0.1, 1.35, 0, 2.5, C.rule, 0.75); k.head(s, v.value, x, 1.3, w - 0.3, 1.2, { max: 48, min: 18, color: C.accent }); k.txt(s, v.label, x, 2.55, w - 0.3, 1.2, { max: 13, italic: true }); });
      if (d.note) k.txt(s, `\u2020 ${d.note}`, 0.6, 4.15, 8.8, 0.9, { max: 11, color: C.muted }); },
    async compare(d) { const s = page(d, d.left.h, d.right.h), w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.1, 3.3); t.line(s, 5.0, 1.3, 0, 3.85, C.rule, 0.75);
      [d.left, d.right].forEach((sd, i) => { const x = 0.6 + i * 4.6; k.txt(s, sd.h, x, 1.3, w, 0.45, { size: 16, bold: true, color: C.accent }); let y = 1.8; sd.items.forEach((it, j) => { k.txt(s, `${j + 1}) ${it}`, x, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), 1.0, 1.45, 8.0, 2.1, { max: 32, min: 16, italic: true, align: 'center' }); t.line(s, 3.5, 3.7, 3.0, 0, C.accent, 1); if (d.caption) k.txt(s, d.caption, 1.0, 3.85, 8.0, 1.1, { max: 13, align: 'center', color: C.muted }); },
    async timeline(d) { const s = page(d, d.items[0].year, d.items[d.items.length - 1].year); entries(s, d.items.map((it) => [`${it.year}. ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, `\u201C${d.text}\u201D`, 1.0, 1.4, 8.0, 2.3, { max: 30, min: 15, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.0, 3.85, 8.0, 0.45, { size: 14, align: 'center', color: C.accent, bold: true }); },
    async sources(d) { const s = page(d); entries(s, d.items.map((it, i) => [`[${i + 1}]`, it])); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: "SlideAI Lug'at", colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.cloth, lt2: C.paper, accent1: C.accent, accent2: C.cloth, accent3: C.gold, accent4: '4F6D7A', accent5: C.muted, accent6: C.rule, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 108, slug: 'lugat', name: "Lug'at", category: 'academic', photos: true, build, style: { tone: "lug'at maqolasi kabi: aniq ta'riflar, atamalar va izohlar; ixcham va ilmiy", limits: {}, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "elegant"], "transitions": ["fade", "pull:l", "wipe:r"], "cover": ["fadeLetters", "typeLetters"], "mark": "fade", "deco": "wipe:r", "sig": {"title": "typeLetters", "body": "fadeWords", "item": "wipe:r", "image": "fade", "number": "fade", "order": "seq", "stagger": 0.18}, "tempo": 1.1, "kenburns": false};
