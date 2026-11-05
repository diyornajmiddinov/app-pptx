/**
 * 102 Pastki — the title sits in a heavy BOTTOM band with a big page number; content hangs from the top
 * edge: full-height bleed columns, numbers at the foot of each column.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { band: '111111', accent: 'FF5A36', ink: '111111', muted: '555555', bg: 'F5F1EA', alt: 'EAE2D4' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k, Y = 0.35, Hc = 3.75, X = 0.5, Wc = 9.0;
  const page = (d) => {
    const s = k.slide(C.bg);
    t.rect(s, 0, 4.3, 10, 1.325, C.band, { name: 'Title band' });
    k.head(s, d.title || '', 0.5, 4.38, 7.6, 0.8, { max: 30, min: 14, color: 'FFFFFF' });
    k.txt(s, String(k.idx).padStart(2, '0'), 8.2, 4.3, 1.4, 0.95, { size: 44, bold: true, font: F.head, color: C.accent, align: 'right', valign: 'middle' });
    k.foot(s, { y: 5.27, color: '9A9A9A', size: 8 });
    return s;
  };
  const columns = (s, n, draw, top = 0) => { const w = 10 / n; for (let i = 0; i < n; i++) { t.rect(s, i * w, top, w, 4.3 - top, i % 2 ? C.alt : C.bg, { name: 'Column' }); draw(i, i * w, w); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) await k.photo(s, d.image, 0, 0, 10, 3.75); else t.rect(s, 0, 0, 10, 3.75, C.alt, { name: 'Field' });
      t.rect(s, 0, 3.75, 10, 1.875, C.band, { name: 'Title band' }); t.rect(s, 0.5, 3.6, 1.2, 0.15, C.accent, { name: 'Tab' });
      k.head(s, d.title, 0.5, 3.85, 6.6, 1.15, { max: 36, min: 16, color: 'FFFFFF' });
      k.txt(s, [k.M.author, k.org3].filter(Boolean).join('\n'), 7.2, 3.9, 2.4, 1.1, { max: 12, color: 'D0D0D0', align: 'right', valign: 'middle' });
      k.foot(s, { y: 5.3, color: '9A9A9A', size: 8 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 5.2, 0, 4.8, 4.3); k.txt(s, d.text, X, Y + 0.2, 4.4, Hc - 0.2, { max: 17, min: 11, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0, 0, 4.8, 4.3); k.txt(s, d.text, 5.3, Y + 0.2, 4.2, Hc - 0.2, { max: 17, min: 11, ls: 1.35, valign: 'middle' }); },
    async agenda(d) { const s = page(d), n = d.items.length, cols = 3, rws = Math.ceil(n / cols), w = Wc / cols, h = Hc / rws;
      d.items.forEach((it, i) => { const x = X + (i % cols) * w, y = Y + Math.floor(i / cols) * h; k.txt(s, String(i + 1).padStart(2, '0'), x, y, w - 0.2, 0.7, { size: 34, bold: true, font: F.head, color: C.accent }); k.head(s, it, x, y + 0.75, w - 0.3, h - 0.95, { max: 17, valign: 'top' }); }); },
    async cards(d) { const s = page(d), n = d.items.length; columns(s, n, async (i, x, w) => { const it = d.items[i]; k.head(s, it.h, x + 0.25, 0.4, w - 0.5, 0.7, { max: 17, valign: 'top' }); k.txt(s, it.t, x + 0.25, 1.15, w - 0.5, 2.3, { max: 14, color: C.muted }); k.txt(s, String(i + 1).padStart(2, '0'), x + 0.25, 3.45, w - 0.5, 0.75, { size: 40, bold: true, font: F.head, color: C.accent, valign: 'bottom' }); });
      for (const [i, it] of d.items.entries()) t.img(s, await k.icon(it.icon, C.ink, 2), (10 / n) * (i + 1) - 0.65, 3.65, 0.4, 0.4); },
    async process(d) { const s = page(d), n = d.steps.length; columns(s, n, (i, x, w) => { const st = d.steps[i]; k.txt(s, `${i + 1} \u2192`, x + 0.25, 0.35, w - 0.5, 0.6, { size: 24, bold: true, font: F.head, color: C.accent }); k.head(s, st.h, x + 0.25, 1.0, w - 0.5, 0.65, { max: 16, valign: 'top' }); k.txt(s, st.t, x + 0.25, 1.7, w - 0.5, 2.45, { max: 14, color: C.muted }); }); },
    async stats(d) { const s = page(d), n = d.stats.length; columns(s, n, (i, x, w) => { const v = d.stats[i]; k.head(s, v.value, x + 0.2, 0.6, w - 0.4, 1.6, { max: 72, min: 26, color: i === 0 ? C.accent : C.ink, align: 'center' }); k.txt(s, v.label, x + 0.3, 2.35, w - 0.6, 1.0, { max: 14, align: 'center', color: C.muted }); });
      if (d.note) k.txt(s, d.note, X, 3.5, Wc, 0.7, { max: 11, color: C.muted, italic: true, valign: 'bottom' }); },
    async compare(d) { const s = page(d), w = 4.3, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.3, F.body, 0.18, Hc - 0.85); t.rect(s, 4.93, 0, 0.14, 4.3, C.accent, { name: 'Divider' });
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.3 : 0.45; k.head(s, sd.h, x, Y, w, 0.65, { max: 22 }); let y = Y + 0.85; sd.items.forEach((it, j) => { k.txt(s, i ? '+' : '\u2212', x, y, 0.3, 0.3, { size: 15, bold: true, color: C.accent }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), X, Y, Wc, 2.6, { max: 44, min: 20, valign: 'bottom' }); if (d.caption) k.txt(s, d.caption, X, Y + 2.75, 6.5, 1.0, { max: 13, color: C.muted }); },
    async timeline(d) { const s = page(d), n = d.items.length, w = Wc / n; t.line(s, 0, 1.25, 10, 0, C.ink, 2);
      d.items.forEach((it, i) => { const x = X + i * w; k.head(s, it.year, x, Y, w - 0.2, 0.75, { max: 30, min: 14, color: C.accent, valign: 'bottom' }); t.oval(s, x, 1.16, 0.18, 0.18, C.ink); k.head(s, it.h, x, 1.45, w - 0.25, 0.55, { max: 16, valign: 'top' }); k.txt(s, it.t, x, 2.05, w - 0.25, 2.05, { max: 13, color: C.muted }); }); },
    async quote(d) { const s = page({ title: d.author || '' }); k.txt(s, '\u201C', X, 0.1, 1.2, 1.3, { size: 110, bold: true, font: F.head, color: C.accent }); k.head(s, d.text, X + 1.1, Y + 0.3, Wc - 1.2, 3.3, { max: 34, min: 16, italic: true, valign: 'middle' }); },
    async sources(d) { const s = page(d), n = d.items.length, half = Math.ceil(n / 2), rh = Hc / half;
      d.items.forEach((it, i) => { const x = X + Math.floor(i / half) * 4.6, y = Y + (i % half) * rh; k.txt(s, [{ text: `${i + 1}  `, options: { bold: true, color: C.accent } }, { text: it }], x, y, 4.3, rh, { max: 13, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all hanging above the heavy band: a deck's pages must not look alike (L.pages)
  const COAL = '262626', ASH = 'BDB6A9';
  const night = (d) => { // the page goes black, the band burns in the accent
    const s = k.slide(C.band);
    t.rect(s, 0, 4.3, 10, 1.325, C.accent, { name: 'Title band' });
    k.head(s, d.title || '', 0.5, 4.38, 7.6, 0.8, { max: 30, min: 14, color: C.ink });
    k.txt(s, String(k.idx).padStart(2, '0'), 8.2, 4.3, 1.4, 0.95, { size: 44, bold: true, font: F.head, color: 'FFFFFF', align: 'right', valign: 'middle' });
    k.foot(s, { y: 5.27, color: C.ink, size: 8 });
    return s;
  };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.muted, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 17, min: 11, color: C.ink, valign: 'top', ...o });
  const num = (s, v, x, y, w, h, size, color, o = {}) => k.txt(s, String(v), x, y, w, h, { size, bold: true, font: F.head, color, valign: 'middle', ...o });
  const V = {
    image: [
      async (d) => { // a wide picture hangs from the top edge, a tab marks where the words begin
        const s = page(d);
        await k.photo(s, d.image, 0, 0, 10, 2.25);
        t.rect(s, 0.5, 2.25, 1.2, 0.13, C.accent, { name: 'Tab' });
        bd(s, d.text, 0.5, 2.47, 9.0, 1.75, { max: 14, color: C.ink, valign: 'middle', ls: 1.2 });
      },
      async (d) => { // the picture fills the page above the band, a sheet of words hangs into it
        const s = page(d);
        await k.photo(s, d.image, 0, 0, 10, 4.3);
        t.rect(s, 5.15, 0, 4.4, 3.95, C.bg, { name: 'Sheet' });
        t.rect(s, 5.15, 3.95, 4.4, 0.1, C.accent, { name: 'Sheet edge' });
        bd(s, d.text, 5.38, 0.2, 3.94, 3.6, { max: 14, color: C.ink, valign: 'middle', ls: 1.25 });
      },
      async (d) => { // black page: a round picture stands on the burning band
        const s = night(d), dia = 3.95;
        await k.photo(s, d.image, 5.55, 0.35, dia, dia, { mask: 'circle' });
        bd(s, d.text, 0.5, 0.3, 4.7, 3.8, { max: 15, color: 'FFFFFF', valign: 'middle', ls: 1.3 });
      },
      async (d) => { // the picture is cut into three hanging columns of different length
        const s = page(d);
        await k.photo(s, d.image, 0, 0, 5.1, 4.3, { mask: { path: 'M0,0H0.31V0.72H0Z M0.345,0H0.655V1H0.345Z M0.69,0H1V0.84H0.69Z' } });
        bd(s, d.text, 5.45, 0.25, 4.1, 3.85, { max: 15, color: C.ink, valign: 'middle', ls: 1.3 });
      },
    ],
    cards: [
      async (d) => { // bleed tiles, two by two, set like a checkerboard
        const s = page(d), n = d.items.length, w = 5, h = 2.15, fills = [C.bg, C.alt, C.alt, C.bg];
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 10 : w, x = (i % 2) * w, y = Math.floor(i / 2) * h;
          t.rect(s, x, y, ww, h, fills[i], { name: 'Tile' });
          t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.4, y + 0.22, 0.42, 0.42);
          hd(s, it.h, x + 0.98, y + 0.16, ww - 1.3, 0.55, { valign: 'middle' });
          bd(s, it.t, x + 0.4, y + 0.76, ww - 0.75, h - 0.86);
        }
      },
      async (d) => { // black page: columns hang down to different depths, an icon at each end
        const s = night(d), n = d.items.length, w = 10 / n, deep = n === 3 ? [3.1, 4.0, 3.5] : [3.3, 4.05, 3.6, 3.95];
        for (const [i, it] of d.items.entries()) {
          const x = i * w, h = deep[i], f = i % 2 ? COAL : '333333';
          t.rect(s, x + 0.06, 0, w - 0.12, h, f, { name: 'Column' });
          t.rect(s, x + 0.06, h, w - 0.12, 0.07, C.accent, { name: 'Column end' });
          hd(s, it.h, x + 0.26, 0.28, w - 0.52, 0.72, { color: 'FFFFFF', max: 16 });
          bd(s, it.t, x + 0.26, 1.02, w - 0.52, h - 1.02 - 0.62, { color: 'E4DFD6', max: 13 });
          t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.26, h - 0.54, 0.4, 0.4);
        }
      },
      async (d) => { // bleed rows, the icon in an accent block cut into the edge
        const s = page(d), n = d.items.length, h = 4.3 / n;
        for (const [i, it] of d.items.entries()) {
          const y = i * h;
          t.rect(s, 0, y, 10, h, i % 2 ? C.alt : C.bg, { name: 'Row' });
          t.rect(s, 0, y, 1.15, h, C.accent, { name: 'Block' });
          if (i) t.line(s, 0, y, 1.15, 0, C.bg, 1.5);
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), 0.38, y + h / 2 - 0.2, 0.4, 0.4);
          hd(s, it.h, 1.45, y + 0.05, 2.55, h - 0.1, { valign: 'middle' });
          bd(s, it.t, 4.15, y + 0.05, 5.4, h - 0.1, { valign: 'middle' });
        }
      },
      async (d) => { // one item leads in a great accent column, the others hang beside it
        const s = page(d), [a, ...rest] = d.items, h = 4.3 / rest.length;
        t.rect(s, 0, 0, 4.1, 4.3, C.accent, { name: 'Lead' });
        t.img(s, await k.icon(a.icon, C.ink, 1.75), 0.5, 0.4, 0.8, 0.8);
        hd(s, a.h, 0.5, 1.35, 3.2, 0.8, { max: 24, min: 14 });
        bd(s, a.t, 0.5, 2.2, 3.2, 1.95, { color: C.ink, max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = i * h;
          if (i) t.line(s, 4.45, y, 5.1, 0, C.ink, 0.75);
          t.img(s, await k.icon(it.icon, C.accent, 2), 4.45, y + 0.14, 0.34, 0.34);
          hd(s, it.h, 4.92, y + 0.08, 4.6, 0.44, { valign: 'middle', max: 15 });
          bd(s, it.t, 4.45, y + 0.54, 5.1, h - 0.6, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // the band itself rises in steps out of the page
        const s = page(d), n = d.steps.length, w = 10 / n, rise = n === 4 ? 0.55 : 0.8, y0 = n === 4 ? 1.8 : 1.75;
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, y = y0 - i * rise;
          t.rect(s, x, y, w, 4.3 - y, C.band, { name: 'Step' });
          t.rect(s, x, y, w, 0.07, C.accent, { name: 'Tread' });
          num(s, i + 1, x + 0.25, y + 0.14, 0.9, 0.55, 28, C.accent);
          hd(s, st.h, x + 0.25, y + 0.68, w - 0.45, 0.56, { color: 'FFFFFF', max: 15 });
          bd(s, st.t, x + 0.25, y + 1.24, w - 0.45, 4.25 - y - 1.24, { color: 'E4DFD6', max: 13 });
        }
      },
      async (d) => { // black page: arrows hang in a row, each holding its step
        const s = night(d), n = d.steps.length, w = 9.4 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.3 + i * w;
          t.shape(s, 'PENTAGON', { x, y: 0.3, w: w - 0.06, h: 1.1, fill: { color: i === n - 1 ? C.accent : COAL }, objectName: 'Arrow' });
          num(s, i + 1, x + 0.14, 0.3, 0.5, 1.1, 24, i === n - 1 ? C.ink : C.accent);
          hd(s, st.h, x + 0.6, 0.34, w - 1.1, 1.02, { color: i === n - 1 ? C.ink : 'FFFFFF', max: 13, min: 10, valign: 'middle' });
          bd(s, st.t, x + 0.14, 1.58, w - 0.34, 2.55, { color: 'E4DFD6' });
        }
      },
      async (d) => { // a thick accent bar hangs down the middle, steps fall to either side
        const s = page(d), n = d.steps.length, cx = 5, per = Math.ceil(n / 2), h = 4.0 / per, w = 4.0;
        t.rect(s, cx - 0.07, 0, 0.14, 4.3, C.accent, { name: 'Spine' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? cx + 0.55 : cx - 0.55 - w, y = 0.22 + Math.floor(i / 2) * h + (right ? 0.65 : 0), a = right ? 'left' : 'right';
          t.rect(s, cx - 0.27, y + 0.03, 0.54, 0.54, C.band, { name: 'Mark' });
          num(s, i + 1, cx - 0.27, y + 0.03, 0.54, 0.54, 17, 'FFFFFF', { align: 'center' });
          hd(s, st.h, x, y, w, 0.56, { align: a, valign: 'middle' });
          bd(s, st.t, x, y + 0.58, w, Math.min(h - 0.62, 4.25 - y - 0.58), { align: a, max: 13 });
        }
      },
      async (d) => { // the steps fall across the page on a diagonal, numbers cut from the edge
        const s = page(d), n = d.steps.length, h = 4.1 / n, shift = n === 4 ? 1.05 : 1.45;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * shift, y = 0.12 + i * h, w = 9.5 - x;
          if (i) t.rect(s, 0, y + 0.05, x - 0.15, 0.5, i % 2 ? C.alt : C.band, { name: 'Run' });
          if (x > 0.65) num(s, i + 1, 0.1, y + 0.05, x - 0.35, 0.5, 18, i % 2 ? C.ink : C.accent, { align: 'right' });
          if (i === 0) num(s, 1, x, y + 0.05, 0.4, 0.5, 20, C.accent);
          hd(s, st.h, x + (i === 0 ? 0.42 : 0), y + 0.05, w - 0.42, 0.5, { valign: 'middle' });
          bd(s, st.t, x, y + 0.56, w, h - 0.6, { max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // one great number fills the page above the band
        const s = page(d), [a, ...rest] = d.stats;
        t.rect(s, 6.3, 0, 3.7, 4.3, C.alt, { name: 'Column' });
        k.txt(s, a.value, 0.5, 0.25, 5.6, 1.9, { size: L.fit(a.value, 5.5, 1.8, 96, 34, F.head, true), bold: true, font: F.head, color: C.accent, valign: 'middle', ls: 1 });
        bd(s, a.label, 0.5, 2.2, 5.5, 0.72, { max: 17, color: C.ink });
        if (d.note) bd(s, d.note, 0.5, 2.98, 5.5, 1.2, { max: 12, italic: true });
        rest.forEach((v, i) => { const y = 0.3 + i * 2.0;
          if (i) t.line(s, 6.6, y - 0.12, 3.1, 0, C.ink, 0.75);
          hd(s, v.value, 6.6, y, 3.1, 0.95, { max: 40, min: 20, valign: 'middle' });
          bd(s, v.label, 6.6, y + 0.97, 3.1, 0.72, { max: 13, color: C.ink }); });
      },
      async (d) => { // discs hang on threads from the top edge, by turns longer and shorter
        const s = page(d), w = 10 / 3, dia = 1.85, f = [C.band, C.accent, C.band], ink = ['FFFFFF', C.ink, 'FFFFFF'];
        for (const [i, v] of d.stats.entries()) {
          const x = i * w, cx = x + w / 2, y = i === 1 ? 0.48 : 0.14;
          t.line(s, cx, 0, 0, y, C.ink, 1.5);
          t.oval(s, cx - dia / 2, y, dia, dia, f[i]);
          k.head(s, v.value, cx - dia / 2 + 0.12, y, dia - 0.24, dia, { max: 32, min: 14, color: ink[i], align: 'center' });
          bd(s, v.label, x + 0.3, 2.42, w - 0.6, 0.72, { align: 'center', color: C.ink, max: 13 });
        }
        if (d.note) bd(s, d.note, 1.0, 3.2, 8.0, 0.98, { max: 12, italic: true, align: 'center' });
      },
      async (d) => { // black page: the values are chalked on rails running out of the page edge
        const s = night(d), rh = d.note ? 0.98 : 1.33;
        for (const [i, v] of d.stats.entries()) {
          const y = 0.14 + i * rh;
          t.rect(s, 0, y, 4.0, rh - 0.1, i === 1 ? C.accent : COAL, { name: 'Rail' });
          k.head(s, v.value, 0.5, y, 3.0, rh - 0.1, { max: 38, min: 18, color: i === 1 ? C.ink : C.accent });
          bd(s, v.label, 4.3, y, 5.2, rh - 0.1, { max: 16, color: 'FFFFFF', valign: 'middle' });
        }
        if (d.note) bd(s, d.note, 0.5, 3.14, 9.0, 1.05, { max: 13, italic: true, color: ASH, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the page splits into black and accent, mirrored across the seam
        const s = page(d);
        t.rect(s, 0, 0, 5, 4.3, C.band, { name: 'Side' }); t.rect(s, 5, 0, 5, 4.3, C.accent, { name: 'Side' });
        t.line(s, 0, 4.3, 5, 0, COAL, 1);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.35 : 0.4, w = 4.25, a = i ? 'left' : 'right', ink = i ? C.ink : 'FFFFFF', n = sd.items.length, rh = 3.25 / n;
          hd(s, sd.h, x, 0.22, w, 0.68, { max: 22, min: 13, color: i ? C.ink : C.accent, align: a, valign: 'middle' });
          sd.items.forEach((it, j) => { const y = 0.95 + j * rh;
            t.line(s, x, y, w, 0, i ? C.ink : '666666', 0.75);
            bd(s, it, x, y + 0.03, w, rh - 0.06, { align: a, color: ink, valign: 'middle' }); });
        }
      },
      async (d) => { // two floors above the band, the side's name cut into each edge
        const s = page(d), h = 2.15;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i * h, n = sd.items.length, x0 = 2.7, w = (9.7 - x0) / n, f = i ? C.alt : C.bg;
          t.rect(s, 0, y, 10, h, f, { name: 'Floor' });
          t.rect(s, 0, y, 2.45, h, i ? C.accent : C.ink, { name: 'Edge' });
          hd(s, sd.h, 0.3, y + 0.15, 1.95, h - 0.3, { max: 20, min: 12, color: i ? C.ink : 'FFFFFF', valign: 'middle' });
          sd.items.forEach((it, j) => { const x = x0 + j * w;
            num(s, j + 1, x + 0.05, y + 0.1, 0.5, 0.42, 16, C.accent);
            bd(s, it, x + 0.05, y + 0.54, w - 0.18, h - 0.62, { color: C.ink, max: 13 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the whole upper page turns accent, black words on it
        const s = page(d);
        t.rect(s, 0, 0, 10, 4.3, C.accent, { name: 'Field' });
        k.head(s, L.runs(d.text), 0.5, 0.25, 9.0, 2.5, { max: 44, min: 20, color: C.ink, valign: 'middle' });
        t.line(s, 0.5, 2.82, 9, 0, C.ink, 1.5);
        if (d.caption) bd(s, d.caption, 0.5, 2.92, 9, 1.28, { max: 14, color: C.ink });
      },
      async (d) => { // black page: a pale column of note hangs at the right of the words
        const s = night(d);
        t.rect(s, 6.45, 0, 3.55, 4.3, C.bg, { name: 'Column' });
        k.head(s, L.runs(d.text), 0.5, 0.25, 5.65, 3.8, { max: 38, min: 18, color: 'FFFFFF', valign: 'middle' });
        if (d.caption) bd(s, d.caption, 6.75, 0.25, 2.95, 3.8, { max: 14, color: C.ink, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // black page: the years hang on threads, each year lower than the last
        const s = night(d), w = 2.42;
        for (const [i, it] of d.items.entries()) {
          const x = 0.3 + i * w, y = 0.12 + i * 0.5;
          t.line(s, x + 0.02, 0, 0, y + 0.1, C.accent, 1.5);
          t.rect(s, x, y, w - 0.14, 0.48, i === 3 ? C.accent : COAL, { name: 'Tag' });
          k.head(s, it.year, x + 0.1, y, w - 0.34, 0.48, { max: 18, min: 11, color: i === 3 ? C.ink : C.accent });
          hd(s, it.h, x + 0.02, y + 0.54, w - 0.2, 0.46, { color: 'FFFFFF', max: 14, valign: 'middle' });
          bd(s, it.t, x + 0.02, y + 1.02, w - 0.2, 4.2 - y - 1.02, { color: 'E4DFD6', max: 12.5 });
        }
      },
      async (d) => { // a thick rule bleeds across the page, events above and below by turns
        const s = page(d), mid = 2.15, step = 1.82, w = 3.5;
        t.rect(s, 0, mid - 0.05, 10, 0.1, C.band, { name: 'Rule' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * step, up = i % 2 === 0, y = up ? 0.15 : mid + 0.18, tx = x;
          t.rect(s, x, mid - 0.13, 0.26, 0.26, C.accent, { name: 'Mark' });
          k.txt(s, [{ text: it.year + '  ', options: { color: C.accent, bold: true } }, { text: it.h, options: { bold: true, color: C.ink } }], tx, y, w, 0.42, { font: F.head, bold: true, max: 15, min: 10.5, valign: 'middle', ls: 1.05 });
          bd(s, it.t, tx, y + 0.44, w, 1.36, { max: 13 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old process columns looked like the card columns
  R.stats = V.stats.shift(); // the old stats columns looked like the card columns
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Pastki', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.band, lt2: C.bg, accent1: C.accent, accent2: C.band, accent3: 'C9B79C', accent4: '8C7B65', accent5: C.muted, accent6: C.alt, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 102, slug: 'pastki', name: 'Pastki', category: 'business', photos: true, build, style: { tone: "dadil va to'g'ridan-to'g'ri: avval asosiy fikr, keyin dalil; qisqa jumlalar", limits: { title: 45 }, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["push:u", "cover:u", "fade"], "cover": ["fadeWords", "riseSettle"], "mark": "riseUp", "deco": "wipe:u", "sig": {"title": "riseSettle", "body": "fadeUp", "item": "riseUp", "image": "wipe:u", "number": "riseUp", "order": "cascade", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
