/** 156 Telegramma — an old TELEGRAM form: printed beige form with red rules and field labels, ideas typed on pasted paper TAPE strips ending in ■, a round date stamp. */
const { kit, L, rowsFit } = require('../free.js');
const C = { form: 'F3E9D2', red: 'B23A2E', ink: '1E1E1E', tape: 'FFFFFF', muted: '6B5E4B', stamp: '3B4BA8' };
const F = { head: 'Courier New', body: 'Courier New' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const form = (s) => { t.rect(s, 0.3, 0.2, 9.4, 5.2, C.form, { line: { color: C.red, width: 1.5 }, name: 'Form' }); t.rect(s, 0.4, 0.3, 9.2, 0.6, null, { line: { color: C.red, width: 0.75 }, name: 'Head box' }); t.line(s, 0.4, 1.0, 9.2, 0, C.red, 2); t.line(s, 0.4, 1.05, 9.2, 0, C.red, 0.5); };
  const stampDate = (s, x, y) => { t.oval(s, x, y, 1.0, 1.0, null, { line: { color: C.stamp, width: 2 } }); t.oval(s, x + 0.08, y + 0.08, 0.84, 0.84, null, { line: { color: C.stamp, width: 0.75 } }); k.txt(s, `${k.M.year || ''}\n${String(k.idx).padStart(2, '0')}`, x, y, 1.0, 1.0, { size: 10, bold: true, color: C.stamp, align: 'center', valign: 'middle' }); };
  // paper tape strip pasted on the form with typed text
  const tape = (s, x, y, w, h, txt, o = {}) => { t.rect(s, x, y, w, h, C.tape, { shadow: 0.15, blur: 2, offset: 1, name: 'Tape' }); k.txt(s, [{ text: String(txt).toUpperCase() }, { text: '  \u25A0', options: { color: C.red } }], x + 0.08, y, w - 0.16, h, { max: o.max || 12, min: 8, valign: 'middle', ls: 1.1, bold: !!o.bold }); };
  const page = (d) => { const s = k.slide('D9CDB4'); form(s); k.txt(s, (k.M.org || '').toUpperCase(), 0.5, 0.3, 4.5, 0.6, { max: 11, bold: true, color: C.red, valign: 'middle' }); if (d.title) tape(s, 4.6, 0.38, 3.8, 0.45, d.title, { max: 12, bold: true }); stampDate(s, 8.5, 0.12); k.foot(s, { x: 0.5, y: 5.12, w: 9.0, size: 7.5, color: C.muted }); return s; };
  // rows: field label (red, small) + tape strip
  const rows = (s, list, label) => { const n = list.length, rh = 3.85 / n; list.forEach((txt, i) => { const y = 1.2 + i * rh; k.txt(s, label(i), 0.5, y, 1.1, rh, { size: 9, color: C.red, valign: 'middle', bold: true }); t.line(s, 1.6, y + rh - 0.03, 7.9, 0, C.red, 0.4, { dash: 'dash' }); tape(s, 1.7 + (i % 2) * 0.08, y + 0.05, 7.7 - (i % 2) * 0.08, rh - 0.12, txt); }); };
  const R = {
    async cover(d) { const s = page({}); const F2 = [[k.TR.author_l, k.M.author], [k.TR.org_l, k.M.org], [k.TR.city_l, k.M.loc], [k.TR.year_l, k.M.year]]; tape(s, 0.6, 1.3, 8.8, 1.3, d.title, { max: 22, bold: true }); if (d.subtitle) tape(s, 0.6, 2.75, 6.2, 0.55, d.subtitle, { max: 11 }); F2.forEach(([a, v], i) => { k.txt(s, String(a).toUpperCase(), 0.6, 3.5 + i * 0.4, 1.6, 0.38, { size: 9, bold: true, color: C.red, valign: 'middle' }); t.line(s, 2.2, 3.5 + i * 0.4 + 0.36, 4.6, 0, C.red, 0.4); k.txt(s, v || '', 2.25, 3.5 + i * 0.4, 4.5, 0.38, { max: 12, valign: 'middle' }); }); if (d.image) await k.photo(s, d.image, 7.1, 2.75, 2.3, 2.25, { gray: true }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0.6, 1.25, 3.0, 3.8, { gray: true }); tape(s, 3.85, 1.3, 5.6, 3.7, d.text, { max: 13 }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); rows(s, d.items, (i) => `${String(i + 1).padStart(2, '0')}`); },
    async cards(d) { const s = page(d); rows(s, d.items.map((it) => `${it.h}: ${it.t}`), (i) => d.items[i].h.slice(0, 12).toUpperCase()); },
    async process(d) { const s = page(d); rows(s, d.steps.map((st) => `${st.h}: ${st.t}`), (i) => `${i + 1}.`); },
    async stats(d) { const s = page(d); rows(s, [...d.stats.map((v) => `${v.value} \u2014 ${v.label}`), ...(d.note ? [d.note] : [])], (i) => (i < d.stats.length ? `#${i + 1}` : '\u2020')); },
    async compare(d) { const s = page(d), w = 4.35; [d.left, d.right].forEach((sd, i) => { const x = 0.55 + i * 4.6; k.txt(s, sd.h.toUpperCase(), x, 1.15, w, 0.4, { max: 12, bold: true, color: C.red }); const { rows: rr } = rowsFit([sd.items], 11, w - 0.3, F.body, 0.12, 3.4); let y = 1.6; sd.items.forEach((it, j) => { tape(s, x, y, w, rr[j] - 0.06, it, { max: 11 }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); tape(s, 0.8, 1.4, 8.4, 2.2, d.text, { max: 22, bold: true }); if (d.caption) tape(s, 1.5, 3.85, 7.0, 0.95, d.caption, { max: 11 }); },
    async timeline(d) { const s = page(d); rows(s, d.items.map((it) => `${it.h}: ${it.t}`), (i) => d.items[i].year); },
    async quote(d) { const s = page({}); tape(s, 0.8, 1.4, 8.4, 2.5, `"${d.text}"`, { max: 20 }); if (d.author) k.txt(s, `-- ${d.author.toUpperCase()}`, 0.8, 4.1, 8.4, 0.45, { size: 13, bold: true, color: C.red, align: 'right' }); },
    async sources(d) { const s = page(d); rows(s, d.items, (i) => `[${i + 1}]`); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Telegramma', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '3A3226', lt2: C.form, accent1: C.red, accent2: C.stamp, accent3: '8C6D2C', accent4: '4F6D7A', accent5: C.muted, accent6: 'D9CDB4', hlink: C.stamp, folHlink: C.muted } });
}
module.exports = { id: 156, slug: 'telegramma', name: 'Telegramma', category: 'business', photos: true, build, style: { tone: "telegraf uslubi: o'ta ixcham, faqat eng muhim so'zlar, har gap alohida xabar", limits: { title: 40 }, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "calm"], "transitions": ["wipe:r", "cut", "fade"], "cover": ["typeLetters", "typeLetters"], "mark": "appear", "deco": "wipe:r", "sig": {"title": "typeLetters", "body": "wipeWords", "item": "wipe:r", "image": "wipe:r", "number": "appear", "order": "seq", "stagger": 0.18}, "tempo": 1.0, "kenburns": false};
