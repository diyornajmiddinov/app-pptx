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
    const T = d.title || '', fs = L.fit(T, 4.2, 0.95, 30, 14, F.head, true, 1.05);
    t.text(s, T, { x: 0.65 - 2.15, y: 2.35 - 0.5, w: 4.3, h: 1.0, rotate: 270, fontFace: F.head, bold: true, fontSize: fs, color: 'FFFFFF', valign: 'middle', lineSpacingMultiple: 1.0 });
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
  // ---- further ways to draw a type, all on the vertical column: a deck's pages must not look alike (L.pages)
  const DEEP = '12302A', MID = '2D6A4F', LEAF = '74A892', PALE = 'E4EEE8', MINT = 'CFE3D6';
  const pg = (d, o = {}) => {
    const s = k.slide(o.bg || C.bg);
    t.rect(s, 0, 0, 1.3, 5.625, o.col || C.col, { name: 'Title column' });
    const T = d.title || '', fs = L.fit(T, 4.2, 0.95, 30, 14, F.head, true, 1.05);
    t.text(s, T, { x: 0.65 - 2.15, y: 2.35 - 0.5, w: 4.3, h: 1.0, rotate: 270, fontFace: F.head, bold: true, fontSize: fs, color: 'FFFFFF', valign: 'middle', lineSpacingMultiple: 1.0 });
    k.txt(s, String(k.idx).padStart(2, '0'), 0.1, 4.75, 1.1, 0.6, { size: 26, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle' });
    if (!o.noFoot) k.foot(s, { x: X, w: Wc, y: 5.25, ...(o.foot || {}) });
    return s;
  };
  const dark = (d) => pg(d, { bg: C.col, col: DEEP, foot: { color: MINT } });
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.muted, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 17, min: 11, color: C.col, ...o });
  const up = (s, v, cx, cy, len, thick, o = {}) => t.text(s, v, { x: cx - len / 2, y: cy - thick / 2, w: len, h: thick, rotate: 270, fontFace: F.head, bold: true, fontSize: o.size || 28, color: o.color || 'FFFFFF', align: o.align || 'left', valign: 'middle' });
  const V = {
    image: [
      async (d) => { // the picture is a second, wider column standing against the first
        const s = pg(d, { foot: { x: 5.55, w: 3.95 } });
        await k.photo(s, d.image, 1.3, 0, 3.85, 5.625);
        t.rect(s, 5.55, 0.5, 0.6, 0.08, C.accent, { name: 'Accent' });
        bd(s, d.text, 5.55, 0.72, 3.95, 4.35, { max: 15, color: C.ink, valign: 'middle', ls: 1.3 });
      },
      async (d) => { // the picture fills the field, the words stand on a white sheet in it
        const s = pg(d, { noFoot: true });
        await k.photo(s, d.image, 1.3, 0, 8.7, 5.625);
        t.rect(s, 1.3, 5.2, 8.7, 0.425, C.bg, { name: 'Footer band' });
        t.rect(s, 5.1, 0.5, 4.4, 4.35, C.bg, { name: 'Sheet' });
        t.rect(s, 5.1, 0.5, 4.4, 0.08, C.accent, { name: 'Accent' });
        bd(s, d.text, 5.35, 0.72, 3.9, 3.98, { max: 15, color: C.ink, valign: 'middle', ls: 1.25 });
        k.foot(s, { x: X, w: Wc, y: 5.3 });
      },
      async (d) => { // the picture seen through three upright slits of different height
        const s = pg(d, { foot: { w: 3.45 } });
        await k.photo(s, d.image, 5.45, 0, 4.55, 5.625, { mask: { path: 'M0,0H0.29V0.7H0Z M0.355,0.18H0.645V1H0.355Z M0.71,0H1V0.84H0.71Z' } });
        bd(s, d.text, X, 0.5, 3.45, 4.55, { max: 15, color: C.ink, valign: 'middle', ls: 1.3 });
      },
      async (d) => { // night field: a round picture, ringed in the accent
        const s = dark(d), dia = 3.6, x = 5.85, y = 0.85;
        t.oval(s, x - 0.14, y - 0.14, dia + 0.28, dia + 0.28, C.accent);
        await k.photo(s, d.image, x, y, dia, dia, { mask: 'circle' });
        bd(s, d.text, X, 0.5, 3.75, 4.55, { max: 15, color: 'FFFFFF', valign: 'middle', ls: 1.3 });
      },
    ],
    cards: [
      async (d) => { // a hairline cross quarters the open field
        const s = pg(d), n = d.items.length, w = (Wc - 0.5) / 2, h = 2.2;
        t.line(s, X, Y + h + 0.03, Wc, 0, C.rule, 0.75);
        t.line(s, X + w + 0.25, Y, 0, n === 3 ? h : 2 * h + 0.05, C.rule, 0.75);
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? Wc : w, x = X + (i % 2) * (w + 0.5), y = Y + Math.floor(i / 2) * (h + 0.08);
          t.img(s, await k.icon(it.icon, C.accent, 2), x, y + 0.12, 0.42, 0.42);
          hd(s, it.h, x + 0.56, y + 0.05, ww - 0.6, 0.56);
          bd(s, it.t, x, y + 0.68, ww, h - 0.78);
        }
      },
      async (d) => { // the title column's colour fades through full-height columns
        const s = pg(d, { foot: { color: C.muted } }), n = d.items.length, w = 8.7 / n, tones = n === 3 ? [MID, PALE, DEEP] : [MID, PALE, DEEP, 'F8E2CC'];
        for (const [i, it] of d.items.entries()) {
          const x = 1.3 + i * w, lit = tones[i] === PALE || tones[i] === 'F8E2CC', ink = lit ? C.ink : 'FFFFFF';
          t.rect(s, x, 0, w, 5.2, tones[i], { name: 'Column' });
          hd(s, it.h, x + 0.2, 0.42, w - 0.4, 0.8, { color: lit ? C.col : 'FFFFFF', valign: 'top' });
          bd(s, it.t, x + 0.2, 1.3, w - 0.4, 2.85, { color: ink });
          t.img(s, await k.icon(it.icon, lit ? C.col : C.accent, 1.5), x + 0.2, 4.35, 0.58, 0.58);
        }
      },
      async (d) => { // night field: stems rise from the ground, each one taller
        const s = dark(d), n = d.items.length, w = Wc / n, step = n === 4 ? 0.34 : 0.5, floor = 5.1;
        for (const [i, it] of d.items.entries()) {
          const x = X + i * w, y = Y + (n - 1 - i) * step;
          t.line(s, x, y, 0, floor - y, C.accent, 2);
          t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.14, y, 0.38, 0.38);
          hd(s, it.h, x + 0.14, y + 0.42, w - 0.3, 0.56, { color: 'FFFFFF', max: 15, valign: 'top' });
          bd(s, it.t, x + 0.14, y + 1.0, w - 0.3, floor - y - 1.05, { color: MINT, max: 13 });
        }
      },
      async (d) => { // a second column stands mid-field, the items hang on either side of it
        const s = pg(d), n = d.items.length, cx = 5.62, w = 3.42, per = Math.ceil(n / 2), h = 4.45 / per;
        t.rect(s, cx - 0.04, 0, 0.08, 5.2, C.col, { name: 'Spine' });
        for (const [i, it] of d.items.entries()) {
          const right = i % 2 === 1, x = right ? cx + 0.45 : X, y = Y + Math.floor(i / 2) * h + (right ? 0.32 : 0), a = right ? 'left' : 'right', hh = h - (right ? 0.32 : 0.05);
          t.oval(s, cx - 0.27, y + 0.02, 0.54, 0.54, right ? C.accent : C.col);
          t.img(s, await k.icon(it.icon, right ? C.ink : 'FFFFFF', 2), cx - 0.14, y + 0.15, 0.28, 0.28);
          hd(s, it.h, x, y, w, 0.56, { align: a });
          bd(s, it.t, x, y + 0.6, w, hh - 0.62, { align: a });
        }
      },
    ],
    process: [
      async (d) => { // steps climb out of the page, a staircase of column colours
        const s = pg(d), n = d.steps.length, w = 8.7 / n, rise = n === 4 ? 0.55 : 0.75, tones = [C.col, MID, '40916C', C.accent];
        for (const [i, st] of d.steps.entries()) {
          const x = 1.3 + i * w, y = 2.5 - (i + (n === 3 ? 1 : 0)) * rise + (n === 3 ? 0.75 : 0), last = i === n - 1, col = last ? C.accent : tones[i];
          t.rect(s, x, y, w, 5.2 - y, col, { name: 'Step' });
          k.txt(s, String(i + 1).padStart(2, '0'), x + 0.18, y + 0.08, 1.0, 0.5, { size: 22, bold: true, font: F.head, color: last ? C.ink : C.accent });
          hd(s, st.h, x + 0.18, y + 0.58, w - 0.34, 0.56, { color: last ? C.ink : 'FFFFFF', max: 14, valign: 'top' });
          bd(s, st.t, x + 0.18, y + 1.16, w - 0.34, 5.1 - y - 1.16, { color: last ? C.ink : 'FFFFFF', max: 13 });
        }
      },
      async (d) => { // night field: great numerals along a line that runs out of the column
        const s = dark(d), n = d.steps.length, w = Wc / n;
        t.line(s, 1.3, 1.62, 8.7, 0, C.accent, 2);
        for (const [i, st] of d.steps.entries()) {
          const x = X + i * w;
          k.txt(s, String(i + 1), x, 0.42, w - 0.2, 1.15, { size: 66, bold: true, font: F.head, color: C.accent, valign: 'bottom' });
          t.oval(s, x, 1.53, 0.18, 0.18, 'FFFFFF');
          hd(s, st.h, x, 1.85, w - 0.2, 0.6, { color: 'FFFFFF', max: 15, valign: 'top' });
          bd(s, st.t, x, 2.5, w - 0.2, 2.6, { color: MINT, max: 13 });
        }
      },
      async (d) => { // a path that turns: across, down, back
        const s = pg(d), n = d.steps.length, w = 3.62, h = 2.12, cell = (i) => (n === 3 ? [[0, 0], [1, 0], [0, 1]] : [[0, 0], [1, 0], [1, 1], [0, 1]])[i];
        for (const [i, st] of d.steps.entries()) {
          const [cx, cy] = cell(i), wide = n === 3 && i === 2, ww = wide ? Wc : w, x = X + cx * (w + 0.51), y = Y + cy * (h + 0.21);
          t.rect(s, x, y, 0.62, 0.62, i === n - 1 ? C.accent : C.col, { name: 'Marker' });
          k.txt(s, String(i + 1), x, y, 0.62, 0.62, { size: 22, bold: true, font: F.head, color: i === n - 1 ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' });
          hd(s, st.h, x + 0.76, y, ww - 0.76, 0.62);
          bd(s, st.t, x, y + 0.72, ww, h - 0.74);
        }
        const c = C.accent;
        t.text(s, '→', { x: X + w, y: Y + 0.05, w: 0.51, h: 0.5, fontSize: 20, bold: true, color: c, align: 'center', valign: 'middle' });
        if (n === 4) { t.text(s, '↓', { x: X + w + 0.51 + w - 0.5, y: Y + h - 0.06, w: 0.5, h: 0.3, fontSize: 16, bold: true, color: c, align: 'center', valign: 'middle' }); t.text(s, '←', { x: X + w, y: Y + h + 0.26, w: 0.51, h: 0.5, fontSize: 20, bold: true, color: c, align: 'center', valign: 'middle' }); }
        else t.text(s, '↓', { x: X, y: Y + h - 0.06, w: 0.62, h: 0.3, fontSize: 16, bold: true, color: c, align: 'center', valign: 'middle' });
      },
    ],
    stats: [
      async (d) => { // each value stands upright on its own column, like the title
        const s = pg(d), w = Wc / 3, tones = [C.col, C.accent, MID], bottom = d.note ? 4.15 : 5.05;
        for (const [i, v] of d.stats.entries()) {
          const x = X + i * w;
          t.rect(s, x, Y, 0.92, bottom - Y, tones[i], { name: 'Column' });
          const len = bottom - Y - 0.3;
          up(s, v.value, x + 0.46, Y + (bottom - Y) / 2, len, 0.9, { size: Math.min(36, L.fit(v.value, len, 0.8, 36, 18, F.head, true)), color: i === 1 ? C.ink : 'FFFFFF' });
          bd(s, v.label, x + 1.04, Y, w - 1.2, bottom - Y, { max: 14, color: C.ink, valign: 'bottom' });
        }
        if (d.note) bd(s, d.note, X, 4.27, Wc, 0.88, { max: 12, italic: true });
      },
      async (d) => { // night field: one great number, the two others under a hairline
        const s = dark(d), [a, ...rest] = d.stats;
        k.txt(s, a.value, X, 0.42, Wc, 1.6, { size: L.fit(a.value, Wc, 1.5, 96, 30, F.head, true), bold: true, font: F.head, color: C.accent, valign: 'middle', ls: 1 });
        bd(s, a.label, X, 2.02, Wc, 0.5, { max: 16, color: 'FFFFFF' });
        t.line(s, X, 2.62, Wc, 0, LEAF, 0.75);
        rest.forEach((v, i) => { const x = X + i * (Wc / 2);
          hd(s, v.value, x, 2.72, Wc / 2 - 0.2, 0.72, { max: 36, min: 18, color: 'FFFFFF' });
          bd(s, v.label, x, 3.44, Wc / 2 - 0.2, 0.62, { max: 13, color: MINT }); });
        if (d.note) bd(s, d.note, X, 4.2, Wc, 0.95, { max: 12, italic: true, color: MINT });
      },
      async (d) => { // the numbers come down the field on a diagonal, the note beneath
        const s = pg(d), w = 2.6;
        for (const [i, v] of d.stats.entries()) {
          const x = X + i * w, y = Y + i * 1.28;
          t.line(s, x, y, 0, 1.15, C.accent, 2.5);
          hd(s, v.value, x + 0.15, y - 0.05, w - 0.25, 0.68, { max: 34, min: 16, color: C.col });
          bd(s, v.label, x + 0.15, y + 0.62, w - 0.25, 0.58, { max: 12, color: C.ink, min: 10 });
        }
        if (d.note) { bd(s, d.note, X, 3.78, 4.6, 1.35, { max: 13, italic: true, valign: 'bottom' }); }
      },
    ],
    compare: [
      async (d) => { // the page opens along its axis: the second side is a colour column
        const s = pg(d, { foot: { w: 3.3 } }), w = 3.3, cx = 5.55;
        t.rect(s, cx, 0, 10 - cx, 5.625, C.col, { name: 'Side' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.45 : X, a = i ? 'left' : 'right', n = sd.items.length, rh = 3.42 / n;
          hd(s, sd.h, x, Y, i ? 3.5 : w + 0.2, 0.68, { max: 22, min: 13, align: a, color: i ? C.accent : C.col });
          sd.items.forEach((it, j) => { const y = Y + 0.85 + j * rh; bd(s, it, x, y, i ? 3.5 : w + 0.2, rh - 0.08, { align: a, color: i ? 'FFFFFF' : C.ink, valign: 'middle' }); if (j) t.line(s, x, y - 0.03, i ? 3.5 : w + 0.2, 0, i ? LEAF : C.rule, 0.75); });
        }
      },
      async (d) => { // two floors: a band above, a band below, items standing up in each
        const s = pg(d), h = 2.6;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i * h, n = sd.items.length, x0 = 3.65, w = (9.7 - x0) / n, ink = i ? 'FFFFFF' : C.ink;
          t.rect(s, 1.3, y, 8.7, h, i ? C.col : PALE, { name: 'Floor' });
          hd(s, sd.h, 1.6, y + 0.2, 1.85, h - 0.4, { max: 19, min: 12, color: i ? C.accent : C.col, valign: 'bottom' });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.line(s, x, y + 0.25, 0, h - 0.5, LEAF, 0.75); bd(s, it, x + 0.12, y + 0.25, w - 0.2, h - 0.5, { color: ink, max: 13, valign: 'middle' }); });
        }
      },
    ],
    statement: [
      async (d) => { // night field, the column burns: the note up in one corner, the words stepping down to the other
        const s = pg(d, { bg: C.col, col: C.accent, foot: { color: MINT } });
        if (d.caption) bd(s, d.caption, X, 0.42, 4.2, 1.72, { max: 12.5, color: MINT });
        t.line(s, 1.3, 2.24, 2.2, 0, C.accent, 2);
        t.line(s, 3.5, 2.24, 0, 2.86, C.accent, 2);
        k.head(s, L.runs(d.text), 3.75, 2.3, 5.75, 2.8, { max: 32, min: 17, color: 'FFFFFF', valign: 'middle' });
      },
      async (d) => { // a narrow column of note beside a tall bar and the words
        const s = pg(d), cx = 4.3;
        t.rect(s, cx, 0, 0.14, 5.2, C.accent, { name: 'Bar' });
        if (d.caption) bd(s, d.caption, X, 0.5, cx - X - 0.3, 4.55, { max: 13, valign: 'bottom', min: 10 });
        k.head(s, L.runs(d.text), cx + 0.45, 0.5, 9.5 - cx - 0.45, 4.55, { max: 36, min: 17, color: C.col, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // four years stand upright, like the title, each on its own column
        const s = pg(d), w = Wc / 4, tones = [PALE, LEAF, MID, C.col], inks = [C.col, C.ink, 'FFFFFF', 'FFFFFF'];
        for (const [i, it] of d.items.entries()) {
          const x = X + i * w, y = Y, hh = 4.6;
          t.rect(s, x, y, 0.5, hh, tones[i], { name: 'Year column' });
          up(s, it.year, x + 0.25, y + hh / 2, hh - 0.3, 0.48, { size: 18, color: inks[i] });
          hd(s, it.h, x + 0.6, y, w - 0.72, 0.8, { max: 14, min: 10.5, valign: 'top' });
          bd(s, it.t, x + 0.6, y + 0.85, w - 0.72, hh - 0.85, { max: 12.5 });
        }
      },
      async (d) => { // night field: a line runs out of the column, events above and below by turns
        const s = dark(d), step = 1.58, w = 3.01, mid = 2.75;
        t.line(s, 1.3, mid, 8.7, 0, C.accent, 2);
        for (const [i, it] of d.items.entries()) {
          const x = X + i * step, up2 = i % 2 === 0, y = up2 ? 0.42 : mid + 0.28, h = mid - 0.28 - 0.42;
          t.line(s, x, up2 ? y : mid, 0, up2 ? mid - y : 2.22, LEAF, 0.75);
          t.oval(s, x - 0.09, mid - 0.09, 0.18, 0.18, 'FFFFFF');
          const tx = x + 0.12, tw = Math.min(w, 9.6 - tx);
          k.txt(s, [{ text: it.year + '   ', options: { color: C.accent, bold: true } }, { text: it.h, options: { color: 'FFFFFF', bold: true } }], tx, y, tw, 0.42, { font: F.head, bold: true, max: 15, min: 10.5, valign: 'middle', ls: 1.05 });
          bd(s, it.t, tx, y + 0.44, tw, h - 0.46, { color: MINT, max: 13 });
        }
      },
      async (d) => { // the years step away from the column, one further at each row
        const s = pg(d), rh = 4.45 / 4;
        for (const [i, it] of d.items.entries()) {
          const x = X + i * 0.72, y = Y + i * rh, w = 9.5 - x;
          t.line(s, 1.3, y + 0.46, x - 1.3 - 0.06, 0, C.accent, 1.5);
          hd(s, it.year, x, y + 0.02, 1.5, 0.42, { max: 18, min: 11, color: C.accent });
          hd(s, it.h, x + 1.55, y + 0.02, w - 1.55, 0.42, { max: 15 });
          bd(s, it.t, x, y + 0.46, w, rh - 0.5, { max: 12.5 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.stats = V.stats.shift(); // the old stats rows looked like the card rows
  R.timeline = V.timeline.shift(); // the old timeline rows looked like the card rows
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Vertikal', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.col, lt2: 'F2F2F2', accent1: C.col, accent2: C.accent, accent3: '40916C', accent4: 'E76F51', accent5: C.muted, accent6: C.rule, hlink: C.col, folHlink: C.muted } });
}
module.exports = { id: 101, slug: 'vertikal', name: 'Vertikal', category: 'minimalist', photos: true, build, style: { tone: "aniq va tartibli: qisqa sarlavhalar, bandma-band ochiq matn", limits: { title: 45 }, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "elegant"], "transitions": ["push:u", "wipe:u", "fade"], "cover": ["riseWords", "peekUp"], "mark": "peekUp", "deco": "wipe:u", "sig": {"title": "peekUp", "body": "wipe:u", "item": "riseUp", "image": "wipe:u", "number": "popIn", "order": "seq", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
