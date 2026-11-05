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
    if (d.title) k.head(s, d.title.toUpperCase(), 1.0, 0.12, 8.0, 0.74, { size: L.fit(d.title.toUpperCase(), 6.7, 0.72, 20, 12, F.head, true, 1.05), align: 'center', valign: 'bottom', spacing: 3, color: C.accent });
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
      for (const [i, it] of d.items.entries()) { const [x, y, al] = pos[i], w = 3.2;
        if (al === 'center') { // the third of three lies wide under the hub, clear of the page number and the footer
          const tw = L.width(it.h, 15, F.head, true); t.img(s, await k.icon(it.icon, C.accent, 2), cx - tw / 2 - 0.42, 3.76, 0.32, 0.32);
          k.head(s, it.h, 2.0, 3.72, 6.0, 0.4, { size: 15, align: 'center' }); k.txt(s, it.t, 1.4, 4.13, 7.2, 0.82, { max: 13, align: 'center', color: C.muted, ls: 1.15 }); continue; }
        t.img(s, await k.icon(it.icon, C.accent, 2), al === 'right' ? x + w - 0.36 : x, y, 0.36, 0.36);
        k.head(s, it.h, x, y + 0.4, w, 0.45, { max: 16, align: al }); k.txt(s, it.t, x, y + 0.85, w, 1.05, { max: 13, align: al, color: C.muted }); } },
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
        k.head(s, it.h, left ? 0.6 : cx + 0.3, y, 3.9, 0.3, { max: 14, align: left ? 'right' : 'left' }); k.txt(s, it.t, left ? 0.6 : cx + 0.3, y + 0.3, 3.9, rh - 0.32, { max: 12, color: C.muted, ls: 1.08, align: left ? 'right' : 'left' }); }); },
    async quote(d) { const s = page({}); k.txt(s, '\u201C', cx - 0.6, 0.9, 1.2, 1.1, { size: 90, font: F.head, color: C.accent, align: 'center' }); k.head(s, d.text, 1.2, 1.9, 7.6, 2.0, { max: 30, min: 15, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author.toUpperCase(), 1.2, 4.0, 7.6, 0.4, { size: 12, bold: true, align: 'center', spacing: 2, color: C.accent }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.7 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}.  `, options: { bold: true, color: C.accent } }, { text: it }], 1.0, 1.15 + i * rh, 8.0, rh, { max: 13, align: 'center', valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all balanced on the central axis: a deck's pages must not look alike (L.pages)
  const DEEP = '3D2C6B', LILAC = 'B39DDB', MIST = 'EDE7F6';
  const pg = (d, o = {}) => {
    const s = k.slide(o.bg || C.bg), fg = o.bg ? 'FFFFFF' : C.accent, tx = o.x ?? 1.0, tw = o.w ?? 8.0;
    if (d.title) k.head(s, d.title.toUpperCase(), tx, 0.12, tw, 0.74, { size: L.fit(d.title.toUpperCase(), tw * 0.84, 0.72, 20, 12, F.head, true, 1.05), align: 'center', valign: 'bottom', spacing: 3, color: fg });
    t.line(s, cx - 0.6, 0.92, 1.2, 0, o.bg ? LILAC : C.accent, 1.5);
    k.txt(s, `—  ${k.idx}  —`, 4.0, 4.98, 2.0, 0.28, { size: 10, align: 'center', color: o.bg ? MIST : C.muted });
    k.foot(s, { y: 5.27, align: 'center', ...(o.bg ? { color: MIST } : {}), ...(o.foot || {}) });
    return s;
  };
  const dark = (d) => pg(d, { bg: DEEP });
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.muted, align: 'center', ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, align: 'center', ...o });
  const dotNum = (s, v, x, y, dia, fill, ink, size = 15) => { t.oval(s, x, y, dia, dia, fill); k.txt(s, String(v), x, y, dia, dia, { size, bold: true, color: ink, align: 'center', valign: 'middle' }); };
  const halves = (str) => { // a long text in two mirrored columns: cut at the sentence nearest the middle, else at a word
    const mid = str.length / 2; let cut = -1;
    for (let i = 0; i < str.length - 1; i++) if (/[.!?]/.test(str[i]) && str[i + 1] === ' ' && Math.abs(i - mid) < str.length * 0.2 && (cut < 0 || Math.abs(i - mid) < Math.abs(cut - mid))) cut = i;
    if (cut < 0) { cut = str.lastIndexOf(' ', Math.round(mid)); if (cut < 0) return [str, '']; return [str.slice(0, cut), str.slice(cut + 1)]; }
    return [str.slice(0, cut + 1), str.slice(cut + 2)];
  };
  const V = {
    image: [
      async (d) => { // a tall oval on the axis, the words part around it
        const s = pg(d), w = 2.85, dw = 2.75, dh = 3.75, y = 1.1, [a, b] = halves(d.text), fs = Math.min(L.fit(a, w, dh, 15, 10, F.body, false, 1.25), L.fit(b, w, dh, 15, 10, F.body, false, 1.25));
        t.oval(s, cx - dw / 2 - 0.08, y - 0.08, dw + 0.16, dh + 0.16, C.soft);
        await k.photo(s, d.image, cx - dw / 2, y, dw, dh, { mask: 'circle' });
        bd(s, a, 0.55, y, w, dh, { size: fs, align: 'right', valign: 'middle', color: C.ink });
        bd(s, b, 10 - 0.55 - w, y, w, dh, { size: fs, align: 'left', valign: 'middle', color: C.ink });
      },
      async (d) => { // the picture fills the page, a tall pale column stands on the axis
        const s = k.slide(C.bg);
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, 2.4, 0, 5.2, 5.625, C.bg, { name: 'Column' });
        if (d.title) k.head(s, d.title.toUpperCase(), 2.6, 0.22, 4.8, 0.75, { max: 18, min: 11, align: 'center', spacing: 2, color: C.accent });
        t.line(s, cx - 0.6, 1.02, 1.2, 0, C.accent, 1.5);
        bd(s, d.text, 2.75, 1.14, 4.5, 3.78, { max: 14, color: C.ink, valign: 'middle' });
        k.txt(s, `—  ${k.idx}  —`, 4.0, 4.98, 2.0, 0.28, { size: 10, align: 'center', color: C.muted });
        k.foot(s, { x: 2.5, w: 5.0, y: 5.27, align: 'center', size: 7.5 });
      },
      async (d) => { // two arched windows stand either side of the axis, the words between them
        const s = pg(d);
        await k.photo(s, d.image, 0.5, 1.05, 9.0, 3.85, { mask: { path: 'M0,1 V0.2 A0.14,0.2 0 0 1 0.28,0.2 V1 Z M0.72,1 V0.2 A0.14,0.2 0 0 1 1,0.2 V1 Z' } });
        bd(s, d.text, 3.2, 1.1, 3.6, 3.75, { max: 14, color: C.ink, valign: 'middle', ls: 1.2 });
      },
      async (d) => { // night: the picture rises as a half disc on the axis, words above it
        const s = dark(d);
        bd(s, d.text, 1.0, 1.05, 8.0, 2.0, { max: 14, color: 'FFFFFF', valign: 'middle' });
        t.line(s, 1.6, 4.95, 6.8, 0, LILAC, 1.5);
        await k.photo(s, d.image, 1.9, 3.1, 6.2, 1.85, { mask: { path: 'M0,1 A0.5,1 0 0 1 1,1 Z' } });
      },
    ],
    cards: [
      async (d) => { // an arch of tablets, tallest at the axis, a medallion on each
        const s = pg(d), n = d.items.length, w = n === 3 ? 2.75 : 2.1, gap = 0.1, x0 = cx - (n * w + (n - 1) * gap) / 2, tops = n === 3 ? [1.85, 1.42, 1.85] : [1.85, 1.42, 1.42, 1.85];
        for (const [i, it] of d.items.entries()) {
          const x = x0 + i * (w + gap), y = tops[i], b = 4.9;
          t.rect(s, x, y, w, b - y, C.soft, { r: 0.08, name: 'Tablet' });
          t.oval(s, x + w / 2 - 0.3, y - 0.3, 0.6, 0.6, C.accent, { line: { color: C.bg, width: 3 } });
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), x + w / 2 - 0.15, y - 0.15, 0.3, 0.3);
          hd(s, it.h, x + 0.12, y + 0.34, w - 0.24, 0.56, { color: DEEP, max: 15 });
          bd(s, it.t, x + 0.14, y + 0.92, w - 0.28, b - y - 1.0, { max: 13, color: C.ink });
        }
      },
      async (d) => { // night: a cross of light quarters the page, a jewel where the lines meet
        const s = dark(d), n = d.items.length, w = 4.0, h = 1.82, midY = 2.98;
        t.line(s, 0.6, midY, 8.8, 0, LILAC, 0.75);
        t.line(s, cx, 1.1, 0, n === 3 ? midY - 1.1 : 3.76, LILAC, 0.75);
        t.oval(s, cx - 0.11, midY - 0.11, 0.22, 0.22, LILAC);
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, right = i % 2 === 1, ww = wide ? 8.4 : w, x = wide ? 0.8 : right ? cx + 0.2 : cx - 0.2 - w, y = i < 2 ? 1.1 : midY + 0.1, al = wide ? 'center' : right ? 'left' : 'right';
          const dy = wide ? 0.1 : 0, tw = wide ? L.width(it.h, 15, F.head, true) : 0; // the wide third stays clear of the jewel on the line
          t.img(s, await k.icon(it.icon, LILAC, 2), wide ? cx - tw / 2 - 0.42 : right ? x : x + w - 0.32, y + dy + 0.04, 0.32, 0.32);
          hd(s, it.h, wide ? x : right ? x + 0.42 : x, y + dy, wide ? ww : w - 0.42, 0.4, wide ? { color: 'FFFFFF', align: 'center', size: 15 } : { color: 'FFFFFF', align: al, max: 15 });
          bd(s, it.t, x, y + dy + 0.44, ww, h - 0.5 - dy, { color: MIST, align: al, max: 13 });
        }
      },
      async (d) => { // each line pivots on the axis: name to the left, words to the right
        const s = pg(d), n = d.items.length, h = 3.8 / n;
        t.line(s, cx, 1.08, 0, 3.8, C.line, 1.5);
        for (const [i, it] of d.items.entries()) {
          const y = 1.08 + i * h;
          t.oval(s, cx - 0.28, y + h / 2 - 0.28, 0.56, 0.56, C.accent);
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), cx - 0.14, y + h / 2 - 0.14, 0.28, 0.28);
          hd(s, it.h, 0.7, y + 0.04, 3.85, h - 0.08, { align: 'right', max: 18, color: DEEP });
          bd(s, it.t, cx + 0.45, y + 0.04, 3.95, h - 0.08, { align: 'left', valign: 'middle', color: C.ink });
          if (i) { t.line(s, 0.7, y, 3.6, 0, C.line, 0.5); t.line(s, cx + 0.45, y, 3.95, 0, C.line, 0.5); }
        }
      },
      async (d) => { // great discs in a chain, touching along the axis
        const s = pg(d), n = d.items.length, dia = n === 3 ? 3.05 : 2.4, g = -0.02, x0 = cx - (n * dia + (n - 1) * g) / 2, y = n === 3 ? 1.28 : 1.72;
        for (const [i, it] of d.items.entries()) {
          const x = x0 + i * (dia + g), odd = i % 2 === 1, ins = dia * 0.13, tw = dia - 2 * ins;
          t.oval(s, x, y, dia, dia, odd ? C.accent : C.soft);
          t.img(s, await k.icon(it.icon, odd ? 'FFFFFF' : C.accent, 2), x + dia / 2 - 0.15, y + dia * 0.07, 0.3, 0.3);
          hd(s, it.h, x + ins, y + dia * 0.07 + 0.32, tw, 0.42, { color: odd ? 'FFFFFF' : DEEP, max: 13, min: 10 });
          bd(s, it.t, x + ins, y + dia * 0.07 + 0.76, tw, dia * 0.86 - 0.86, { color: odd ? 'FFFFFF' : C.ink, max: 12 });
        }
      },
    ],
    process: [
      async (d) => { // a funnel on the axis: each step narrower, ending in the deepest colour
        const s = pg(d), n = d.steps.length, h = 3.82 / n, tones = n === 4 ? [C.soft, 'D9CDEF', LILAC, C.accent] : [C.soft, LILAC, C.accent];
        for (const [i, st] of d.steps.entries()) {
          const w = 9.0 - i * (n === 4 ? 1.05 : 1.4), x = cx - w / 2, y = 1.08 + i * h, last = i === n - 1, ink = last ? 'FFFFFF' : C.ink;
          t.rect(s, x, y, w, h - 0.06, tones[i], { name: 'Tier' });
          dotNum(s, i + 1, x + 0.12, y + (h - 0.06) / 2 - 0.2, 0.4, last ? 'FFFFFF' : C.accent, last ? C.accent : 'FFFFFF', 13);
          hd(s, st.h, x + 0.6, y + 0.03, w - 1.2, 0.34, { color: last ? 'FFFFFF' : DEEP, max: 14 });
          bd(s, st.t, x + 0.6, y + 0.37, w - 1.2, h - 0.46, { color: ink, max: 13 });
        }
      },
      async (d) => { // night: diamonds strung on a line across the page
        const s = dark(d), n = d.steps.length, w = 8.8 / n, dd = 0.92, y = 1.08;
        t.line(s, 0.6 + w / 2, y + dd / 2, w * (n - 1), 0, LILAC, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * w, c = x + w / 2;
          t.shape(s, 'DIAMOND', { x: c - dd / 2, y, w: dd, h: dd, fill: { color: i === n - 1 ? 'FFFFFF' : C.accent }, objectName: 'Diamond' });
          k.txt(s, String(i + 1), c - dd / 2, y, dd, dd, { size: 18, bold: true, align: 'center', valign: 'middle', color: i === n - 1 ? DEEP : 'FFFFFF', font: F.head });
          hd(s, st.h, x + 0.08, y + 1.02, w - 0.16, 0.6, { color: 'FFFFFF', max: 15 });
          bd(s, st.t, x + 0.08, y + 1.64, w - 0.16, 2.2, { color: MIST, max: 13 });
        }
      },
      async (d) => { // a round journey about the axis: the arrows turn clockwise
        const s = pg(d), n = d.steps.length, w = 4.05, h = 1.82, order = n === 3 ? [[0, 0], [1, 0], [0, 1]] : [[0, 0], [1, 0], [1, 1], [0, 1]];
        for (const [i, st] of d.steps.entries()) {
          const [c, r] = order[i], wide = n === 3 && i === 2, ww = wide ? 8.4 : w, x = wide ? 0.8 : c ? cx + 0.15 : cx - 0.15 - w, y = 1.08 + r * (h + 0.14);
          t.rect(s, x, y, ww, h, C.soft, { r: 0.08, name: 'Station' });
          dotNum(s, i + 1, x + 0.12, y + 0.12, 0.44, C.accent, 'FFFFFF', 14);
          hd(s, st.h, x + 0.62, y + 0.1, ww - 0.75, 0.46, { color: DEEP, align: 'left', max: 15 });
          bd(s, st.t, x + 0.2, y + 0.62, ww - 0.4, h - 0.7, { color: C.ink, align: 'left', max: 13 });
        }
        t.oval(s, cx - 0.42, 2.57, 0.84, 0.84, C.bg, { line: { color: C.accent, width: 2 } });
        k.txt(s, '↻', cx - 0.42, 2.57, 0.84, 0.84, { size: 30, bold: true, color: C.accent, align: 'center', valign: 'middle', font: 'Arial', ls: 1 });
      },
    ],
    stats: [
      async (d) => { // night: the middle number glows in rings, its neighbours mirrored beside it
        const s = dark(d), [l, m, r] = d.stats, dia = 2.45, y = 1.1, c = y + dia / 2;
        t.oval(s, cx - dia / 2 - 0.3, y - 0.05, dia + 0.6, dia + 0.1, null, { line: { color: LILAC, width: 0.75 } });
        t.oval(s, cx - dia / 2, y, dia, dia, C.accent);
        k.head(s, m.value, cx - dia / 2 + 0.12, y + 0.35, dia - 0.24, 0.85, { max: 40, min: 16, color: 'FFFFFF', align: 'center' });
        bd(s, m.label, cx - dia / 2 + 0.3, y + 1.2, dia - 0.6, 0.85, { color: 'FFFFFF', max: 11.5, min: 9.5 });
        [l, r].forEach((v, i) => { const x = i ? cx + dia / 2 + 0.45 : 0.55, w = 8.9 / 2 - dia / 2 - 0.45 + 0.0, a = i ? 'left' : 'right';
          hd(s, v.value, x, y + 0.3, w, 0.85, { max: 34, min: 16, color: 'FFFFFF', align: a });
          bd(s, v.label, x, y + 1.17, w, 0.9, { color: MIST, align: a, max: 13 }); });
        if (d.note) bd(s, d.note, 1.0, 3.72, 8.0, 1.2, { color: MIST, max: 12.5, italic: true, valign: 'middle' });
      },
      async (d) => { // a pediment: one figure at the peak, two at its feet, the note between them
        const s = pg(d), [a, b, c] = d.stats;
        hd(s, a.value, 2.0, 1.02, 6.0, 1.05, { max: 60, min: 22, color: C.accent });
        bd(s, a.label, 2.4, 2.07, 5.2, 0.5, { color: C.ink, max: 14 });
        t.line(s, 0.9, 2.66, 3.6, 0.76, C.line, 1.5, { flipV: true }); t.line(s, 5.5, 2.66, 3.6, 0.76, C.line, 1.5);
        [b, c].forEach((v, i) => { const x = i ? 7.0 : 0.6, w = 2.4, y = 3.5;
          hd(s, v.value, x, y, w, 0.7, { max: 30, min: 16, color: DEEP });
          bd(s, v.label, x, y + 0.72, w, 0.7, { color: C.ink, max: 12 }); });
        if (d.note) bd(s, d.note, 3.15, 2.95, 3.7, 1.96, { italic: true, max: 12.5, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // two great discs meet on the axis
        const s = pg(d), dia = 3.86, y = 1.05;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.02 : cx - 0.02 - dia, ins = 0.52, tw = dia - 2 * ins, n = sd.items.length, ink = i ? 'FFFFFF' : C.ink, rh = 2.15 / n;
          t.oval(s, x, y, dia, dia, i ? C.accent : C.soft);
          hd(s, sd.h, x + 0.8, y + 0.22, dia - 1.6, 0.62, { color: i ? 'FFFFFF' : DEEP, max: 16, min: 11 });
          sd.items.forEach((it, j) => bd(s, it, x + ins, y + 0.88 + j * rh, tw, rh - 0.04, { color: ink, valign: 'middle', max: 12 }));
        }
      },
      async (d) => { // two bands, one above the other, a medal with the name on the axis of each
        const s = pg(d), h = 1.86;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.1 + i * (h + 0.06), n = sd.items.length, x0 = 0.6, w = 8.8 / n, ink = i ? 'FFFFFF' : C.ink;
          t.rect(s, 0, y + 0.15, 10, h - 0.15, i ? C.accent : C.soft, { name: 'Band' });
          t.rect(s, cx - 1.75, y, 3.5, 0.46, i ? DEEP : C.accent, { r: 0.05, name: 'Name' });
          hd(s, sd.h, cx - 1.65, y, 3.3, 0.46, { color: 'FFFFFF', max: 14, min: 10 });
          sd.items.forEach((it, j) => bd(s, it, x0 + j * w + 0.1, y + 0.52, w - 0.2, h - 0.58, { color: ink, valign: 'middle', max: 13 }));
        }
      },
    ],
    statement: [
      async (d) => { // night: the words alone in a ring of light
        const s = dark(d);
        t.oval(s, 1.3, 0.85, 7.4, 3.9, null, { line: { color: LILAC, width: 1 }, name: 'Ring' });
        k.head(s, L.runs(d.text), 2.0, 1.25, 6.0, 2.05, { max: 30, min: 15, color: 'FFFFFF', align: 'center' });
        if (d.caption) bd(s, d.caption, 2.4, 3.3, 5.2, 1.3, { color: MIST, max: 12, min: 9.5 });
      },
      async (d) => { // the thought stands under a great arch on the axis, the note at its foot
        const s = pg(d), ax = 2.1, aw = 5.8, ay = 1.03, ah = 3.9;
        t.img(s, await k.svg('stArch', `<svg xmlns="http://www.w3.org/2000/svg" width="580" height="390"><path d="M6,390 V180 A284,175 0 0 1 574,180 V390" fill="none" stroke="#${LILAC}" stroke-width="3"/><path d="M26,390 V190 A264,165 0 0 1 554,190 V390 Z" fill="#${C.accent}"/></svg>`, 580, 390), ax, ay, aw, ah);
        k.head(s, L.runs(d.text), ax + 0.9, ay + 0.72, aw - 1.8, 1.66, { max: 22, min: 13, color: 'FFFFFF', align: 'center' });
        t.line(s, cx - 0.5, ay + 2.43, 1.0, 0, 'FFFFFF', 1);
        if (d.caption) bd(s, d.caption, ax + 0.45, ay + 2.5, aw - 0.9, 1.33, { color: 'FFFFFF', max: 13, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // night: the years ride an arch thrown over the axis
        const s = dark(d), w = 2.2, x0 = 0.6, tops = [1.72, 1.28, 1.28, 1.72];
        t.img(s, await k.svg('arch', `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="120"><path d="M0,110 Q440,-90 880,110" fill="none" stroke="#${LILAC}" stroke-width="3"/></svg>`, 880, 120), 0.9, 1.08, 8.2, 1.1);
        for (const [i, it] of d.items.entries()) {
          const x = x0 + i * w, y = tops[i];
          t.rect(s, x + 0.25, y - 0.25, w - 0.5, 0.46, C.accent, { r: 0.1, name: 'Year' });
          hd(s, it.year, x + 0.28, y - 0.25, w - 0.56, 0.46, { color: 'FFFFFF', max: 15, min: 10 });
          hd(s, it.h, x + 0.08, y + 0.28, w - 0.16, 0.46, { color: 'FFFFFF', max: 14 });
          bd(s, it.t, x + 0.08, y + 0.76, w - 0.16, 4.92 - y - 0.76, { color: MIST, max: 13 });
        }
      },
      async (d) => { // events above and below a level line, balanced about the centre
        const s = pg(d), w = 3.05, step = 1.92, x0 = 0.6, mid = 2.98;
        t.line(s, 0.4, mid, 9.2, 0, C.accent, 1.5);
        for (const [i, it] of d.items.entries()) {
          const x = x0 + i * step, up = i % 2 === 0, y = up ? 1.05 : mid + 0.12, c = x + w / 2, wx = x;
          t.oval(s, c - 0.1, mid - 0.1, 0.2, 0.2, up ? C.accent : DEEP);
          k.txt(s, [{ text: it.year + '  ', options: { bold: true, color: C.accent } }, { text: it.h, options: { bold: true, color: C.ink } }], wx, y, w, 0.42, { font: F.head, bold: true, max: 14, min: 10, align: 'center', valign: 'middle', ls: 1.05 });
          bd(s, it.t, wx, y + 0.44, w, 1.38, { max: 12.5 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Markaz', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '3D2C6B', lt2: C.bg, accent1: C.accent, accent2: C.soft, accent3: 'B39DDB', accent4: '4527A0', accent5: C.muted, accent6: C.line, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 103, slug: 'markaz', name: 'Markaz', category: 'minimalist', photos: true, build, style: { tone: "muvozanatli va xotirjam: markaziy g'oya va unga bog'langan teng qismlar", limits: { card_t4: 60, card_t3: 75 }, prefer: null } };
