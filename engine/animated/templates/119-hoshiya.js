/**
 * 119 Hoshiya — a scholarly handout (Tufte style): a narrow serif main column carries the text, and a wide
 * right MARGIN carries sidenotes — headings, years and numbers sit in the margin beside their paragraph.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FFFFF8', ink: '111111', muted: '6B6B6B', accent: 'A00000', rule: 'D8D4C8' };
const F = { head: 'Georgia', body: 'Georgia' };
const MX = 0.9, MW = 5.4, NX = 6.65, NW = 2.85, Y = 1.3, Hc = 3.75;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d) => { const s = k.slide(C.paper); if (d.title) k.head(s, d.title, MX, 0.35, 8.6, 0.75, { max: 30, min: 15, italic: true, bold: false }); k.txt(s, String(k.idx), 0.35, 0.45, 0.45, 0.5, { size: 12, italic: true, color: C.muted }); t.line(s, NX - 0.2, Y, 0, Hc, C.rule, 0.5); k.foot(s, { x: MX, w: 8.6, y: 5.27, size: 8, font: F.body }); return s; };
  // rows: main text in the column, the note (label) in the margin at the same height
  const rows = (s, list) => { const n = list.length, rh = Hc / n; list.forEach(([note, main, noteColor], i) => { const y = Y + i * rh; k.txt(s, main, MX, y, MW, rh - 0.06, { max: 14, min: 9.5, ls: 1.3 }); k.txt(s, note, NX, y, NW, rh - 0.06, { max: 13, min: 9, italic: true, color: noteColor || C.accent }); }); };
  const R = {
    async cover(d) { const s = k.slide(C.paper); k.head(s, d.title, MX, 0.9, 5.6, 2.4, { max: 40, min: 20, italic: true, bold: false, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, MX, 3.4, 5.4, 0.75, { max: 15, italic: true, color: C.muted });
      k.txt(s, k.M.author || '', MX, 4.25, 5.4, 0.4, { size: 15 }); if (d.image) await k.photo(s, d.image, NX, 0.95, NW, 2.4, { gray: true }); k.txt(s, k.org3.replace(/ {2}\u2022 {2}/g, '\n'), NX, 3.45, NW, 1.2, { max: 11, italic: true, color: C.muted }); k.foot(s, { x: MX, w: 8.6, y: 5.27, size: 8, font: F.body }); },
    async intro(d) { const s = page(d); k.txt(s, d.text, MX, Y, MW, Hc, { max: 15, min: 10, ls: 1.4 }); await k.photo(s, d.image, NX, Y, NW, 2.2, { gray: true }); k.txt(s, `${k.TR.caption}: ${d.title}`, NX, Y + 2.3, NW, 0.6, { max: 10, italic: true, color: C.muted }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); rows(s, d.items.map((it, i) => [`\u00A7 ${i + 1}`, it])); },
    async cards(d) { const s = page(d); rows(s, d.items.map((it, i) => [`${i + 1}. ${it.h}`, it.t])); },
    async process(d) { const s = page(d); rows(s, d.steps.map((st, i) => [`${i + 1}. ${st.h}`, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, rh = Hc / n; d.stats.forEach((v, i) => { const y = Y + i * rh; k.head(s, v.value, MX, y, 2.2, rh, { max: 40, min: 16, bold: false, color: C.accent }); k.txt(s, v.label, MX + 2.35, y, MW - 2.35, rh, { max: 14, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, NX, Y, NW, Hc, { max: 12, italic: true, color: C.muted }); },
    async compare(d) { const s = page(d), { rows: rr, fs } = rowsFit([d.left.items], 14, MW, F.body, 0.1, Hc - 0.5), { rows: r2, fs: f2 } = rowsFit([d.right.items], 12, NW, F.body, 0.08, Hc - 0.5);
      k.txt(s, d.left.h, MX, Y, MW, 0.45, { size: 16, italic: true, color: C.accent }); let y = Y + 0.5; d.left.items.forEach((it, j) => { k.txt(s, `\u2014 ${it}`, MX, y, MW, rr[j], { size: fs }); y += rr[j]; });
      k.txt(s, d.right.h, NX, Y, NW, 0.45, { size: 14, italic: true, color: C.accent }); y = Y + 0.5; d.right.items.forEach((it, j) => { k.txt(s, `\u2014 ${it}`, NX, y, NW, r2[j], { size: f2, italic: true }); y += r2[j]; }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), MX, Y, MW, 2.4, { max: 30, min: 15, italic: true, bold: false, valign: 'top' }); if (d.caption) k.txt(s, d.caption, NX, Y, NW, Hc, { max: 13, italic: true, color: C.muted }); },
    async timeline(d) { const s = page(d); rows(s, d.items.map((it) => [`${it.year}\n${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, d.text, MX, Y - 0.2, MW, 3.0, { max: 30, min: 15, italic: true, bold: false, valign: 'middle' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, NX, Y + 1.0, NW, 1.0, { size: 14, italic: true, color: C.accent }); },
    async sources(d) { const s = page(d); rows(s, d.items.map((it, i) => [`[${i + 1}]`, it])); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all set like pages of the same handout: a deck's pages must not look alike (L.pages)
  const INK = '1B1A17', BONE = 'EDE9DC', SOFT = 'B5B0A0', RM = L.ROMAN || ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const leaf = (d, o = {}) => { const s = k.slide(o.bg || C.paper), c = o.bg ? BONE : C.ink; if (d.title && !o.noTitle) k.head(s, d.title, o.tx ?? MX, o.ty ?? 0.3, o.tw ?? 8.6, o.th ?? 0.72, { max: o.tm ?? 28, min: 14, italic: true, bold: false, color: c }); k.txt(s, String(k.idx), o.nx ?? 0.35, o.ny ?? 0.42, 0.45, 0.5, { size: 12, italic: true, color: o.bg ? SOFT : C.muted }); k.foot(s, { x: o.fx ?? MX, w: o.fw ?? 8.6, y: 5.27, size: 8, font: F.body, color: o.bg ? SOFT : C.muted }); return s; };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 9.5, ls: 1.25, ...o });
  const it = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10.5, italic: true, color: C.accent, ls: 1.1, ...o });
  const rule = (s, x, y, w, c = C.ink, wd = 1) => t.line(s, x, y, w, 0, c, wd);
  const split = (v, f = 0.5) => { const c = v.indexOf(' ', Math.floor(v.length * f)); return c > 0 ? [v.slice(0, c), v.slice(c + 1)] : [v, '']; };
  const V = {
    image: [
      async (d) => { // a plate across the head of the page, its caption in the margin, the text set in two columns below
        const s = leaf(d, { ty: 0.1, th: 0.6, tm: 24 }); await k.photo(s, d.image, MX, 0.76, 6.1, 1.95, { gray: true }); k.txt(s, `${k.TR.caption}: ${d.title || ''}`, 7.2, 0.76, 2.3, 1.95, { max: 11, min: 9, italic: true, color: C.muted, valign: 'bottom' }); const [a, b] = split(d.text); bd(s, a, MX, 2.84, 4.15, 2.36, { ls: 1.2, max: 12 }); bd(s, b, 5.35, 2.84, 4.15, 2.36, { ls: 1.2, max: 12 }); },
      async (d) => { // the margin becomes the picture: it bleeds off the right edge and down the page, a big first letter opens the text
        const s = leaf(d, { tw: 5.6, th: 0.95, tm: 24, ty: 0.28, fw: 5.5 }); await k.photo(s, d.image, 6.65, 0, 3.35, 5.625, { gray: true }); const init = d.text[0], rest = d.text.slice(1); k.txt(s, init, MX, 1.28, 0.72, 0.9, { size: 54, color: C.accent, font: F.head, valign: 'top', ls: 0.9 }); const [a, b] = split(rest, 0.11); bd(s, a, MX + 0.76, 1.32, 4.65, 0.8, { max: 12.5, min: 9.5, ls: 1.2 }); bd(s, b, MX, 2.14, 5.42, 3.05, { max: 12.5, min: 9.5, ls: 1.2 }); },
      async (d) => { // the plate after the fashion of a frontispiece: the full picture on black, a slip of paper with the text at its side
        const s = leaf(d, { bg: INK, noTitle: true, fw: 5.2 }); await k.photo(s, d.image, 0.9, 0.35, 5.35, 4.75, { gray: true }); t.rect(s, 6.25, 0, 3.75, 5.625, C.paper, { name: 'Slip' }); k.head(s, d.title || '', 6.5, 0.3, 3.2, 1.2, { max: 19, min: 13, italic: true, bold: false, color: C.ink, valign: 'top' }); rule(s, 6.5, 1.52, 0.9, C.accent, 1.5); bd(s, d.text, 6.5, 1.65, 3.25, 3.75, { max: 11.5, min: 9.5, ls: 1.18, color: C.ink }); },
      async (d) => { // a figure let into the text: a full line above, the picture in the lower left, the rest of the text beside it
        const s = leaf(d, { th: 0.72 }); const [a, b] = split(d.text, 0.38); bd(s, a, MX, 1.1, 8.6, 1.08, { max: 12.5, ls: 1.2 }); await k.photo(s, d.image, MX, 2.28, 3.5, 2.55, { gray: true }); k.txt(s, `${k.TR.caption}`, MX, 4.86, 3.5, 0.3, { size: 10, italic: true, color: C.muted }); bd(s, b, MX + 3.75, 2.26, 4.85, 2.92, { max: 12.5, ls: 1.2 }); },
    ],
    cards: [
      async (d) => { // the page as a broadsheet: narrow columns under one heavy rule, hairlines between them
        const s = leaf(d), n = d.items.length, w = 8.6 / n; rule(s, MX, 1.08, 8.6, C.ink, 2); for (const [i, a] of d.items.entries()) { const x = MX + i * w, ww = w - 0.26; if (i) t.line(s, x - 0.13, 1.2, 0, 3.95, C.rule, 0.5); t.img(s, await k.icon(a.icon, C.accent, 1.5), x, 1.2, 0.3, 0.3); it(s, a.h, x, 1.55, ww, 0.62, { max: 13 }); bd(s, a.t, x, 2.2, ww, 2.98, { max: 12, ls: 1.2 }); } },
      async (d) => { // four propositions in a square, each opening with a pilcrow; with three the fourth place holds the title
        const n = d.items.length, s = leaf(d, n === 3 ? { noTitle: true } : {}), w = 4.15, y0 = n === 3 ? 0.42 : 1.12, h = n === 3 ? 2.33 : 2.03, P = [[MX, y0], [MX + 4.45, y0], [MX, y0 + h], [MX + 4.45, y0 + h]], at = n === 3 ? P.slice(1) : P; if (n === 3) k.head(s, d.title || '', MX, 0.42, w, 2.1, { max: 28, min: 15, italic: true, bold: false, valign: 'top' });
        for (const [i, a] of d.items.entries()) { const [x, y] = at[i]; rule(s, x, y, w, i % 3 ? C.rule : C.ink, i % 3 ? 0.75 : 1.25); k.txt(s, '¶', x, y + 0.04, 0.32, 0.4, { size: 15, color: C.accent, valign: 'middle' }); it(s, a.h, x + 0.32, y + 0.04, w - 0.75, 0.4, { valign: 'middle', max: 13 }); t.img(s, await k.icon(a.icon, C.muted, 1.5), x + w - 0.3, y + 0.1, 0.26, 0.26); bd(s, a.t, x, y + 0.48, w, h - 0.58, { max: 12, ls: 1.18 }); } },
      async (d) => { // one idea is the text, the others are its sidenotes: the handout's own way of thinking
        const s = leaf(d), [a, ...rest] = d.items, n = rest.length; t.img(s, await k.icon(a.icon, C.accent, 1.5), MX, 1.3, 0.42, 0.42); k.head(s, a.h, MX + 0.55, 1.26, MW - 0.55, 0.5, { max: 18, min: 12, bold: false, italic: true }); bd(s, a.t, MX, 1.86, MW, 3.25, { max: 18, min: 12, ls: 1.35 }); t.line(s, NX - 0.2, Y, 0, Hc, C.rule, 0.5); const rh = Hc / n; for (const [i, b] of rest.entries()) { const y = Y + i * rh; k.txt(s, String(i + 1), NX - 0.08, y - 0.03, 0.2, 0.25, { size: 8.5, color: C.accent }); it(s, b.h, NX + 0.14, y, NW - 0.14, 0.42, { max: 12 }); bd(s, b.t, NX + 0.14, y + 0.42, NW - 0.14, rh - 0.5, { max: 10.5, min: 9.5, color: C.muted, italic: true, ls: 1.1 }); } },
      async (d) => { // the page turned to black: a white zigzag of notes, one column set lower than the other
        const s = leaf(d, { bg: INK }), n = d.items.length, w = 4.05; for (const [i, a] of d.items.entries()) { const col = i % 2, y = 1.1 + (i >> 1) * 1.98 + (col ? 0.42 : 0) - (n === 3 && i === 2 ? 0 : 0), x = MX + col * 4.55; rule(s, x, y, w, 'E0B4A8', 0.75); t.img(s, await k.icon(a.icon, 'F0C8BC', 1.5), x, y + 0.1, 0.3, 0.3); it(s, a.h, x + 0.4, y + 0.08, w - 0.4, 0.36, { color: 'F0C8BC', max: 13, valign: 'middle' }); bd(s, a.t, x, y + 0.5, w, 1.3, { color: BONE, max: 12, ls: 1.16 }); } },
    ],
    process: [
      async (d) => { // the argument descends: a long arrow on top, each step begun a little lower than the last
        const s = leaf(d), n = d.steps.length, w = 8.6 / n; t.line(s, MX, 1.14, 8.45, 0, C.ink, 1); k.txt(s, '\u25B8', MX + 8.35, 1.0, 0.25, 0.28, { size: 10, color: C.ink, valign: 'middle', align: 'right' }); d.steps.forEach((st, i) => { const x = MX + i * w, y = 1.3 + i * (n === 4 ? 0.24 : 0.32), ww = w - 0.22; t.line(s, x, 1.14, 0, y - 1.14 + 0.28, C.rule, 0.75); k.txt(s, RM[i] || String(i + 1), x + 0.08, y, 0.7, 0.42, { size: 19, color: C.accent, font: F.head, valign: 'middle' }); it(s, st.h, x + 0.08, y + 0.42, ww - 0.08, 0.58, { color: C.ink, max: 13 }); bd(s, st.t, x + 0.08, y + 1.02, ww - 0.08, 5.2 - (y + 1.02), { max: 12, ls: 1.16 }); }); },
      async (d) => { // the fold of the book as a spine: small numerals on it, the steps on facing pages in turn
        const s = leaf(d, { ty: 0.2 }), n = d.steps.length, cx = 5.2, y0 = 1.1, gap = (n === 4 ? 2.95 : 2.6) / (n - 1), w = 3.95; t.line(s, cx, y0, 0, 4.05, C.ink, 0.75); d.steps.forEach((st, i) => { const y = y0 + i * gap, l = i % 2 === 0, x = l ? cx - 0.3 - w : cx + 0.3, al = l ? 'right' : 'left'; t.oval(s, cx - 0.17, y, 0.34, 0.34, C.paper, { line: { color: C.accent, width: 1 } }); k.txt(s, String(i + 1), cx - 0.17, y, 0.34, 0.34, { size: 11, color: C.accent, align: 'center', valign: 'middle', ls: 1 }); it(s, st.h, x, y, w, 0.34, { color: C.ink, align: al, max: 13, valign: 'middle' }); bd(s, st.t, x, y + 0.36, w, n === 4 ? 1.5 : 1.45, { align: al, max: 11.5, ls: 1.14 }); }); },
      async (d) => { // the cycle as a thin figure in the middle of the text: one hairline ring, steps set round it
        const s = leaf(d, { ty: 0.15 }), n = d.steps.length, cx = 5.2, cy = 3.05, D = 1.75; t.oval(s, cx - D / 2, cy - D / 2, D, D, null, { line: { color: C.ink, width: 0.75 } }); const r = D / 2, A = n === 4 ? [-135, -45, 45, 135] : [-150, -30, 90]; const B = n === 4 ? [[MX, 1.02, 3.2, 'right'], [6.3, 1.02, 3.2, 'left'], [6.3, 3.28, 3.2, 'left'], [MX, 3.28, 3.2, 'right']] : [[MX, 1.02, 3.2, 'right'], [6.3, 1.02, 3.2, 'left'], [2.75, 4.08, 4.9, 'center']]; d.steps.forEach((st, i) => { const a = A[i] * Math.PI / 180, px = cx + r * Math.cos(a), py = cy + r * Math.sin(a), [x, y, w, al] = B[i]; t.oval(s, px - 0.15, py - 0.15, 0.3, 0.3, C.paper, { line: { color: C.accent, width: 1 } }); k.txt(s, String(i + 1), px - 0.15, py - 0.15, 0.3, 0.3, { size: 10, color: C.accent, align: 'center', valign: 'middle', ls: 1 }); it(s, st.h, x, y, w, 0.34, { color: C.ink, align: al, max: 12.5 }); bd(s, st.t, x, y + 0.36, w, n === 3 && i === 2 ? 0.76 : 1.5, { align: al, max: 11, ls: 1.1 }); }); },
      async (d) => { // a proper table: heavy rule above and below, hairlines between, numeral, name and text in columns
        const s = leaf(d), n = d.steps.length, y0 = 1.12, H0 = 4.0, rh = H0 / n; rule(s, MX, y0, 8.6, C.ink, 1.75); d.steps.forEach((st, i) => { const y = y0 + i * rh; k.txt(s, String(i + 1).padStart(2, '0'), MX, y, 0.7, rh, { size: 18, color: C.accent, valign: 'middle', font: F.head }); it(s, st.h, MX + 0.75, y + 0.03, 2.2, rh - 0.06, { color: C.ink, valign: 'middle', max: 13 }); bd(s, st.t, MX + 3.05, y + 0.03, 5.55, rh - 0.06, { valign: 'middle', max: 12, ls: 1.14 }); rule(s, MX, y + rh, 8.6, i === n - 1 ? C.ink : C.rule, i === n - 1 ? 1.75 : 0.5); }); },
    ],
    stats: [
      async (d) => { // the headline number set huge in the text column, the two others as sidenotes in the margin
        const s = leaf(d), [a, ...rest] = d.stats; k.head(s, a.value, MX, 1.2, MW, 1.75, { max: 86, min: 34, bold: false, color: C.accent }); bd(s, a.label, MX, 3.0, MW, 0.75, { max: 15, min: 11, italic: true }); t.line(s, NX - 0.2, Y, 0, Hc, C.rule, 0.5); rest.forEach((v, i) => { const y = Y + i * 1.25; k.head(s, v.value, NX, y, NW, 0.65, { max: 30, min: 16, bold: false }); bd(s, v.label, NX, y + 0.66, NW, 0.56, { max: 10.5, min: 9.5, italic: true, color: C.muted, ls: 1.08 }); }); if (d.note) { rule(s, MX, 3.82, MW, C.rule, 0.5); bd(s, d.note, MX, 3.88, MW, 1.3, { max: 11, min: 9.5, color: C.muted, ls: 1.12 }); } },
      async (d) => { // a three-rule table: figures right-aligned against their names, the note beneath as a footnote
        const s = leaf(d), rh = 0.82, y0 = 1.12; rule(s, MX, y0, 8.6, C.ink, 1.75); d.stats.forEach((v, i) => { const y = y0 + i * rh; k.head(s, v.value, MX, y, 3.0, rh, { max: 30, min: 16, bold: false, align: 'right', color: i ? C.ink : C.accent }); bd(s, v.label, MX + 3.3, y, 5.3, rh, { valign: 'middle', max: 14, min: 10.5 }); rule(s, MX, y + rh, 8.6, i === 2 ? C.ink : C.rule, i === 2 ? 1.75 : 0.5); }); if (d.note) { k.txt(s, '*', MX, 3.72, 0.2, 0.3, { size: 12, color: C.accent }); bd(s, d.note, MX + 0.2, 3.72, 8.4, 1.46, { max: 12, italic: true, color: C.muted, ls: 1.16 }); } },
      async (d) => { // three numbers alone on black, in light italics, each dropping below the last
        const s = leaf(d, { bg: INK }), w = 2.87; d.stats.forEach((v, i) => { const x = MX + i * w, y = 1.15 + i * 0.26; k.head(s, v.value, x, y, w - 0.2, 0.95, { max: 42, min: 18, bold: false, italic: true, color: i === 1 ? 'F0C8BC' : 'FFFFFF' }); rule(s, x, y + 0.98, w - 0.35, SOFT, 0.5); bd(s, v.label, x, y + 1.04, w - 0.3, 0.86, { color: BONE, italic: true, max: 11.5, min: 10, ls: 1.1 }); }); if (d.note) bd(s, d.note, MX, 3.75, 8.6, 1.42, { color: SOFT, max: 12.5, ls: 1.16, valign: 'bottom' }); },
    ],
    compare: [
      async (d) => { // facing pages: a hairline fold in the middle, the lists justified towards it, the names in italic above
        const s = leaf(d, { tx: MX, tw: 8.6 }), w = 4.0, cx = 5.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.14, 3.2); t.line(s, cx, 1.15, 0, 3.95, C.ink, 0.5); [d.left, d.right].forEach((sd, i) => { const x = i ? cx + 0.25 : cx - 0.25 - w, al = i ? 'left' : 'right'; it(s, sd.h, x, 1.15, w, 0.5, { align: al, max: 15 }); rule(s, x, 1.68, w, C.rule, 0.5); let y = 1.78; sd.items.forEach((a, j) => { k.txt(s, a, x, y, w, rr[j], { size: fs, align: al, ls: 1.15 }); y += rr[j]; }); }); },
      async (d) => { // one above the other: the text column holds the two lists, the margin only their names
        const s = leaf(d); [d.left, d.right].forEach((sd, i) => { const y = i ? 3.12 : 1.12, h = 1.98, x = MX, w = 5.9, { rows: rr, fs } = rowsFit([sd.items], 12.5, w - 0.25, F.body, 0.06, h - 0.1); rule(s, MX, y, 8.6, i ? C.rule : C.ink, i ? 0.75 : 1.5); it(s, sd.h, 7.05, y + 0.1, 2.45, h - 0.2, { max: 16, min: 11 }); let yy = y + 0.1; sd.items.forEach((a, j) => { k.txt(s, '—', x, yy, 0.25, 0.25, { size: fs, color: C.accent }); k.txt(s, a, x + 0.25, yy, w - 0.25, rr[j], { size: fs, ls: 1.1 }); yy += rr[j]; }); }); },
    ],
    statement: [
      async (d) => { // the epigraph: a large centred line between two short rules, the note small under it
        const s = leaf(d, { tx: MX, tw: 8.6, ty: 0.2, th: 0.5, tm: 15 }); rule(s, 4.4, 0.92, 1.6, C.accent, 1.25); k.head(s, L.runs(d.text), 1.2, 1.05, 8.0, 2.45, { max: 32, min: 17, italic: true, bold: false, align: 'center' }); rule(s, 4.4, 3.58, 1.6, C.accent, 1.25); if (d.caption) bd(s, d.caption, 1.9, 3.7, 6.6, 1.48, { max: 12, italic: true, color: C.muted, align: 'center', ls: 1.18 }); },
      async (d) => { // white on black: here the margin stands on the left, the thought takes the wide column
        const s = leaf(d, { bg: INK, ty: 0.2, th: 0.55, tm: 15 }); k.head(s, L.runs(d.text), 3.75, 1.0, 5.75, 3.9, { max: 33, min: 17, italic: true, bold: false, color: 'FFFFFF', valign: 'middle' }); t.line(s, 3.5, 1.05, 0, 3.9, SOFT, 0.5); if (d.caption) bd(s, d.caption, MX, 1.05, 2.4, 3.95, { color: BONE, max: 11.5, italic: true, ls: 1.14, align: 'right', valign: 'bottom' }); },
    ],
    timeline: [
      async (d) => { // a graph-paper axis with bare ticks, the years in turn above and below it, nothing else on the line
        const s = leaf(d, { ty: 0.15, th: 0.62 }), ax = 3.02; t.line(s, MX, ax, 8.6, 0, C.ink, 1); d.items.forEach((a, i) => { const up = i % 2 === 0, X = MX + i * 2.15, w = [3.9, 3.9, 4.15, 2.3][i], y = up ? 0.88 : ax + 0.5; t.line(s, X, up ? ax - 0.14 : ax, 0, 0.14, C.ink, 1); k.head(s, a.year, X + 0.06, up ? ax - 0.42 : ax + 0.08, 1.9, 0.36, { max: 15, min: 11, bold: false, color: C.accent }); it(s, a.h, X, y, w, 0.32, { color: C.ink, max: 12.5 }); bd(s, a.t, X, y + 0.33, w, up ? ax - 0.42 - y - 0.33 : 5.2 - y - 0.33, { max: 11.5, ls: 1.12 }); }); },
      async (d) => { // the years hang in the margin to the left of a vertical axis, the text column to its right
        const s = leaf(d, { tx: 2.6, tw: 6.9, nx: 0.35 }), x0 = 2.45, y0 = 1.12, rh = 1.0; t.line(s, x0, y0, 0, 4.0, C.ink, 0.75); d.items.forEach((a, i) => { const y = y0 + i * rh; t.line(s, x0 - 0.1, y + 0.2, 0.2, 0, C.ink, 0.75); k.head(s, a.year, 0.75, y, 1.55, 0.4, { max: 16, min: 10.5, bold: false, color: C.accent, align: 'right' }); it(s, a.h, x0 + 0.2, y, 6.85, 0.34, { color: C.ink, max: 13 }); bd(s, a.t, x0 + 0.2, y + 0.35, 6.85, rh - 0.42, { max: 11.5, ls: 1.1 }); }); },
      async (d) => { // the record on black: four thin columns under one white rule, old style figures at their head
        const s = leaf(d, { bg: INK }), w = 2.15; rule(s, MX, 1.1, 8.6, BONE, 1); d.items.forEach((a, i) => { const x = MX + i * w; k.head(s, a.year, x, 1.18, w - 0.15, 0.65, { max: 24, min: 12, bold: false, italic: true, color: 'F0C8BC' }); it(s, a.h, x, 1.85, w - 0.2, 0.62, { color: 'FFFFFF', max: 13 }); bd(s, a.t, x, 2.5, w - 0.2, 2.68, { color: BONE, max: 12, ls: 1.14 }); }); },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Hoshiya', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: C.paper, accent1: C.accent, accent2: '1F4E79', accent3: '5B7F3A', accent4: 'B8860B', accent5: C.muted, accent6: C.rule, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 119, slug: 'hoshiya', name: 'Hoşiya', category: 'academic', photos: true, build, style: { tone: "ilmiy esse: asosiy matn ravon, izohlar qisqa va aniq; dalillarga tayangan", limits: {}, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "technical"], "transitions": ["fade", "wipe:l", "pull:l"], "cover": ["fadeLetters", "sweepIn"], "mark": "fadeLeft", "deco": "wipe:d", "sig": {"title": "sweepIn", "body": "fadeWords", "item": "fadeLeft", "image": "wipe:r", "number": "fade", "order": "seq", "stagger": 0.2}, "tempo": 1.15, "kenburns": false};
