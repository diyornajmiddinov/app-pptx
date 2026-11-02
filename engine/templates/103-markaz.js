/**
 * 103 Markaz — everything is centred and mirrored: small-caps title on the axis, a central circle that
 * the ideas orbit, mirrored left/right columns, a centred spine for the timeline.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FAF7F2', ink: '222222', muted: '5E5A63', accent: '6C4AB6', soft: 'EDE7F6', line: 'C9BFE0' };
const F = { head: 'Cambria', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k, cx = 5.0;
  const page = (d) => {
    const s = k.slide(C.bg);
    if (d.title) k.head(s, d.title.toUpperCase(), 1.0, 0.3, 8.0, 0.55, { max: 20, min: 12, align: 'center', spacing: 3, color: C.accent });
    t.line(s, cx - 0.6, 0.92, 1.2, 0, C.accent, 1.5);
    k.txt(s, `\u2014  ${k.idx}  \u2014`, 4.0, 4.98, 2.0, 0.28, { size: 10, align: 'center', color: C.muted });
    k.foot(s, { y: 5.27, align: 'center' });
    return s;
  };
  const hub = (s, d, label) => { t.oval(s, cx - d / 2, 2.95 - d / 2, d, d, C.accent, { name: 'Hub' }); k.head(s, label, cx - d / 2 + 0.15, 2.95 - d / 2 + 0.15, d - 0.3, d - 0.3, { max: 16, min: 10, color: 'FFFFFF', align: 'center' }); };
  const around = (n) => (n === 4 ? [[0.6, 1.15, 'right'], [6.2, 1.15, 'left'], [0.6, 3.15, 'right'], [6.2, 3.15, 'left']] : n === 3 ? [[0.6, 1.15, 'right'], [6.2, 1.15, 'left'], [3.4, 3.95, 'center']] : [[0.6, 1.6, 'right'], [6.2, 1.6, 'left']]);
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) { t.oval(s, cx - 1.15, 0.35, 2.3, 2.3, C.soft); await k.photo(s, d.image, cx - 1.05, 0.45, 2.1, 2.1, { mask: 'circle' }); }
      k.txt(s, k.org3.toUpperCase(), 1.0, 2.75, 8.0, 0.3, { size: 11, bold: true, align: 'center', spacing: 3, color: C.accent });
      k.head(s, d.title, 1.0, 3.05, 8.0, 1.2, { max: 36, min: 18, align: 'center' }); t.line(s, cx - 0.6, 4.3, 1.2, 0, C.accent, 1.5);
      k.txt(s, [d.subtitle, k.M.author].filter(Boolean).join('\n'), 1.5, 4.38, 7.0, 0.75, { max: 12, align: 'center', color: C.muted, valign: 'middle' }); k.foot(s, { y: 5.27, align: 'center' }); },
    async intro(d) { const s = page(d); t.oval(s, cx - 1.1, 1.05, 2.2, 2.2, C.soft); await k.photo(s, d.image, cx - 1.0, 1.15, 2.0, 2.0, { mask: 'circle' }); k.txt(s, d.text, 1.2, 3.35, 7.6, 1.6, { max: 14, min: 10, align: 'center', valign: 'middle' }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 2.0, 1.1, 6.0, 2.3, { mask: { r: 0.12 } }); k.txt(s, d.text, 1.2, 3.5, 7.6, 1.45, { max: 14, min: 10, align: 'center', valign: 'middle' }); },
    async agenda(d) { const s = page(d), n = d.items.length, per = Math.ceil(n / 2), rh = 3.6 / per; t.line(s, cx, 1.15, 0, 3.6, C.line, 1.5);
      d.items.forEach((it, i) => { const left = i < per, y = 1.15 + (left ? i : i - per) * rh; t.oval(s, cx - 0.17, y + rh / 2 - 0.17, 0.34, 0.34, left ? C.accent : 'FFFFFF', { line: { color: C.accent, width: 1.5 } }); k.txt(s, String(i + 1), cx - 0.17, y + rh / 2 - 0.17, 0.34, 0.34, { size: 10, bold: true, align: 'center', valign: 'middle', color: left ? 'FFFFFF' : C.accent });
        k.head(s, it, left ? 0.8 : cx + 0.4, y, 3.8, rh, { max: 18, align: left ? 'right' : 'left' }); }); },
    async cards(d) { const s = page(d), pos = around(d.items.length); hub(s, 1.5, d.title || '');
      for (const [i, it] of d.items.entries()) { const [x, y, al] = pos[i], w = al === 'center' ? 3.2 : 3.2; t.img(s, await k.icon(it.icon, C.accent, 2), al === 'right' ? x + w - 0.36 : al === 'left' ? x : x + w / 2 - 0.18, y, 0.36, 0.36);
        k.head(s, it.h, x, y + 0.4, w, 0.45, { max: 16, align: al }); k.txt(s, it.t, x, y + 0.85, w, al === 'center' ? 0.75 : 1.05, { max: 13, align: al, color: C.muted }); } },
    async process(d) { const s = page(d), n = d.steps.length, cw = 8.4 / n; t.line(s, 0.8 + cw / 2, 1.55, cw * (n - 1), 0, C.line, 2);
      d.steps.forEach((st, i) => { const x = 0.8 + i * cw; t.oval(s, x + cw / 2 - 0.3, 1.25, 0.6, 0.6, C.accent); k.txt(s, String(i + 1), x + cw / 2 - 0.3, 1.25, 0.6, 0.6, { size: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); k.head(s, st.h, x + 0.05, 2.0, cw - 0.1, 0.55, { max: 15, align: 'center' }); k.txt(s, st.t, x + 0.05, 2.6, cw - 0.1, 2.3, { max: 13, align: 'center', color: C.muted }); }); },
    async stats(d) { const s = page(d), n = d.stats.length, cw = 8.4 / n;
      d.stats.forEach((v, i) => { const x = 0.8 + i * cw, big = i === Math.floor(n / 2), dd = big ? 2.0 : 1.55; t.oval(s, x + cw / 2 - dd / 2, 1.2 + (big ? 0 : 0.22), dd, dd, big ? C.accent : C.soft); k.head(s, v.value, x + cw / 2 - dd / 2 + 0.12, 1.2 + (big ? 0 : 0.22), dd - 0.24, dd, { max: big ? 40 : 30, min: 12, align: 'center', color: big ? 'FFFFFF' : C.accent }); k.txt(s, v.label, x + 0.1, 3.35, cw - 0.2, 0.9, { max: 13, align: 'center' }); });
      if (d.note) k.txt(s, d.note, 1.0, 4.3, 8.0, 0.6, { max: 10, align: 'center', color: C.muted, italic: true }); },
    async compare(d) { const s = page(d), w = 3.6, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.16, 3.2); t.oval(s, cx - 0.35, 2.6, 0.7, 0.7, C.accent); k.txt(s, 'vs', cx - 0.35, 2.6, 0.7, 0.7, { size: 15, bold: true, italic: true, color: 'FFFFFF', align: 'center', valign: 'middle', font: F.head });
      [d.left, d.right].forEach((sd, i) => { const x = i ? cx + 0.6 : cx - 0.6 - w, al = i ? 'left' : 'right'; k.head(s, sd.h, x, 1.15, w, 0.5, { max: 18, align: al, color: C.accent }); let y = 1.75; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: al }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); t.rect(s, 1.2, 1.15, 7.6, 2.5, null, { line: { color: C.accent, width: 1.5 }, name: 'Frame' }); k.head(s, L.runs(d.text), 1.5, 1.25, 7.0, 2.3, { max: 32, min: 16, align: 'center' }); if (d.caption) k.txt(s, d.caption, 1.5, 3.8, 7.0, 1.1, { max: 13, align: 'center', color: C.muted }); },
    async timeline(d) { const s = page(d), n = d.items.length, rh = 3.75 / n; t.line(s, cx, 1.1, 0, 3.8, C.line, 2);
      d.items.forEach((it, i) => { const y = 1.1 + i * rh, left = i % 2 === 0; t.oval(s, cx - 0.12, y + 0.1, 0.24, 0.24, C.accent); k.head(s, it.year, left ? cx + 0.3 : cx - 2.0, y, 1.7, 0.45, { max: 20, min: 11, color: C.accent, align: left ? 'left' : 'right' });
        k.head(s, it.h, left ? 0.6 : cx + 0.3, y, 3.9, 0.42, { max: 15, align: left ? 'right' : 'left' }); k.txt(s, it.t, left ? 0.6 : cx + 0.3, y + 0.42, 3.9, rh - 0.47, { max: 12, color: C.muted, align: left ? 'right' : 'left' }); }); },
    async quote(d) { const s = page({}); k.txt(s, '\u201C', cx - 0.6, 0.9, 1.2, 1.1, { size: 90, font: F.head, color: C.accent, align: 'center' }); k.head(s, d.text, 1.2, 1.9, 7.6, 2.0, { max: 30, min: 15, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author.toUpperCase(), 1.2, 4.0, 7.6, 0.4, { size: 12, bold: true, align: 'center', spacing: 2, color: C.accent }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.7 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}.  `, options: { bold: true, color: C.accent } }, { text: it }], 1.0, 1.15 + i * rh, 8.0, rh, { max: 13, align: 'center', valign: 'middle' })); },
  };
  R.closing = R.cover;
  for (const d of content.slides) await R[d.type](d);
  return L.save(k.pres, out, { name: 'SlideAI Markaz', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '3D2C6B', lt2: C.bg, accent1: C.accent, accent2: C.soft, accent3: 'B39DDB', accent4: '4527A0', accent5: C.muted, accent6: C.line, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 103, slug: 'markaz', name: 'Markaz', category: 'minimalist', photos: true, build, style: { tone: "muvozanatli va xotirjam: markaziy g'oya va unga bog'langan teng qismlar", limits: { card_t4: 60, card_t3: 75 }, prefer: null } };
