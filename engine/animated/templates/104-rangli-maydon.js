/**
 * 104 Rangli maydon — every slide is ONE solid colour field (the colour changes slide by slide); no boxes,
 * no icons in circles: only type, white hairlines and a big "03/14" index in the corner.
 */
const { kit, L, rowsFit } = require('../free.js');
const FIELDS = [['E63946', 'FFFFFF'], ['1D3557', 'FFFFFF'], ['2A9D8F', 'FFFFFF'], ['F4A261', '1B1B1B'], ['6D597A', 'FFFFFF'], ['264653', 'FFFFFF'], ['E9C46A', '1B1B1B']];
const C = { ink: 'FFFFFF', muted: 'F0F0F0' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d) => {
    const [bg, fg] = FIELDS[k.idx % FIELDS.length], s = k.slide(bg); s.fg = fg;
    if (d.title) k.head(s, d.title, 0.55, 0.3, 8.0, 0.95, { max: 36, min: 18, color: fg, valign: 'top' });
    k.txt(s, `${String(k.idx).padStart(2, '0')}/${String(k.n).padStart(2, '0')}`, 8.1, 4.75, 1.5, 0.55, { size: 24, bold: true, font: F.head, color: fg, align: 'right', valign: 'bottom' });
    k.foot(s, { y: 5.27, w: 7.4, color: fg, size: 8 });
    return s;
  };
  const vline = (s, x, y, h) => t.line(s, x, y, 0, h, s.fg, 0.75, { t: 40 });
  const hline = (s, x, y, w) => t.line(s, x, y, w, 0, s.fg, 0.75, { t: 40 });
  const R = {
    async cover(d) { const s = page({}); if (d.image) await k.photo(s, d.image, 5.6, 0, 4.4, 5.625);
      k.txt(s, k.org3.toUpperCase(), 0.55, 0.5, 4.8, 0.35, { size: 11, bold: true, spacing: 2, color: s.fg });
      k.head(s, d.title, 0.55, 0.95, 4.8, 2.9, { max: 48, min: 22, color: s.fg, valign: 'top' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.55, 3.9, 4.6, 0.65, { max: 13, color: s.fg });
      k.txt(s, k.M.author || '', 0.55, 4.6, 4.6, 0.4, { size: 15, bold: true, color: s.fg }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 5.6, 1.35, 4.4, 4.27); k.txt(s, d.text, 0.55, 1.45, 4.7, 3.3, { max: 17, min: 11, color: s.fg, ls: 1.35 }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0, 1.35, 4.6, 4.27); k.txt(s, d.text, 4.95, 1.45, 4.6, 3.3, { max: 17, min: 11, color: s.fg, ls: 1.35 }); },
    async agenda(d) { const s = page(d), n = d.items.length, per = Math.ceil(n / 2), rh = 3.3 / per;
      d.items.forEach((it, i) => { const x = 0.55 + Math.floor(i / per) * 4.55, y = 1.45 + (i % per) * rh; k.txt(s, String(i + 1).padStart(2, '0'), x, y, 1.0, rh, { size: 30, bold: true, font: F.head, color: s.fg, valign: 'middle' }); k.head(s, it, x + 1.0, y, 3.3, rh, { max: 18, color: s.fg }); }); },
    async cards(d) { const s = page(d), n = d.items.length, w = 8.9 / n;
      d.items.forEach((it, i) => { const x = 0.55 + i * w; if (i) vline(s, x - 0.12, 1.5, 3.1); k.head(s, it.h, x, 1.45, w - 0.3, 0.75, { max: 18, color: s.fg, valign: 'top' }); k.txt(s, it.t, x, 2.25, w - 0.3, 2.4, { max: 14, color: s.fg }); }); },
    async process(d) { const s = page(d), n = d.steps.length, w = 8.9 / n;
      d.steps.forEach((st, i) => { const x = 0.55 + i * w; k.txt(s, `${i + 1}${i < n - 1 ? '  \u2192' : ''}`, x, 1.4, w - 0.2, 0.7, { size: 30, bold: true, font: F.head, color: s.fg }); k.head(s, st.h, x, 2.15, w - 0.3, 0.6, { max: 16, color: s.fg, valign: 'top' }); k.txt(s, st.t, x, 2.8, w - 0.3, 1.85, { max: 13, color: s.fg }); }); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 8.9 / n;
      d.stats.forEach((v, i) => { const x = 0.55 + i * w; if (i) vline(s, x - 0.12, 1.5, 2.6); k.head(s, v.value, x, 1.4, w - 0.3, 1.5, { max: 72, min: 26, color: s.fg }); k.txt(s, v.label, x, 3.0, w - 0.3, 1.1, { max: 14, color: s.fg }); });
      if (d.note) { hline(s, 0.55, 4.2, 7.3); k.txt(s, d.note, 0.55, 4.25, 7.3, 0.5, { max: 10, color: s.fg, italic: true }); } },
    async compare(d) { const s = page(d), w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 15, w - 0.3, F.body, 0.18, 2.75); t.rect(s, 4.92, 1.4, 0.06, 3.3, s.fg, { name: 'Divider' });
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.3 : 0.55; k.head(s, sd.h, x, 1.4, w, 0.6, { max: 22, color: s.fg }); let y = 2.05; sd.items.forEach((it, j) => { k.txt(s, '\u2022', x, y, 0.3, 0.3, { size: 15, bold: true, color: s.fg }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs, color: s.fg }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), 0.55, 1.4, 8.9, 2.4, { max: 48, min: 22, color: s.fg, valign: 'top' }); if (d.caption) { hline(s, 0.55, 3.95, 4.0); k.txt(s, d.caption, 0.55, 4.05, 7.3, 0.7, { max: 13, color: s.fg }); } },
    async timeline(d) { const s = page(d), n = d.items.length, w = 8.9 / n; hline(s, 0.55, 2.2, 8.9);
      d.items.forEach((it, i) => { const x = 0.55 + i * w; k.head(s, it.year, x, 1.4, w - 0.2, 0.75, { max: 34, min: 14, color: s.fg, valign: 'bottom' }); k.head(s, it.h, x, 2.35, w - 0.25, 0.55, { max: 16, color: s.fg, valign: 'top' }); k.txt(s, it.t, x, 2.9, w - 0.25, 1.75, { max: 13, color: s.fg }); }); },
    async quote(d) { const s = page({}); k.txt(s, '\u201C', 0.4, 0.1, 1.5, 1.6, { size: 140, bold: true, font: F.head, color: s.fg }); k.head(s, d.text, 0.6, 1.5, 8.6, 2.5, { max: 38, min: 18, color: s.fg, valign: 'top' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 0.6, 4.1, 7.0, 0.45, { size: 15, bold: true, color: s.fg }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.3 / n; d.items.forEach((it, i) => { const y = 1.45 + i * rh; k.txt(s, [{ text: `${i + 1}   `, options: { bold: true } }, { text: it }], 0.55, y, 8.9, rh, { max: 14, color: s.fg, valign: 'middle' }); if (i < n - 1) hline(s, 0.55, y + rh, 8.9); }); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all in solid colour fields: a deck's pages must not look alike (L.pages)
  const alt = (n = 1) => FIELDS[(k.idx - 1 + n) % FIELDS.length]; // the fields that follow this page's own
  const mark = (s, color, o = {}) => k.txt(s, `${String(k.idx).padStart(2, '0')}/${String(k.n).padStart(2, '0')}`, o.x ?? 8.1, o.y ?? 4.75, o.w ?? 1.5, o.h ?? 0.55, { size: o.size || 24, bold: true, font: F.head, color, align: o.align || 'right', valign: 'bottom' });
  const pg = (d, o = {}) => {
    const [bg, fg] = FIELDS[k.idx % FIELDS.length], s = k.slide(bg); s.fg = fg;
    if (d.title && !o.noTitle) k.head(s, d.title, 0.55, 0.3, o.tw || 8.9, 0.95, { max: 36, min: 18, color: fg, valign: 'top' });
    if (!o.bare) { mark(s, fg); k.foot(s, { y: 5.27, w: 7.4, color: fg, size: 8 }); }
    return s;
  };
  const bd = (s, v, x, y, w, h, color, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color, ...o });
  const hd = (s, v, x, y, w, h, color, o = {}) => k.head(s, v, x, y, w, h, { max: 18, min: 11, color, valign: 'top', ...o });
  const big = (s, v, x, y, w, h, color, max = 60, o = {}) => k.txt(s, String(v), x, y, w, h, { size: L.fit(String(v), w, h, max, 16, F.head, true, 1), bold: true, font: F.head, color, ls: 1, valign: 'middle', ...o });
  const V = {
    image: [
      async (d) => { // a band of picture across the whole field
        const s = pg(d);
        await k.photo(s, d.image, 0, 1.3, 10, 1.95);
        bd(s, d.text, 0.55, 3.4, 8.9, 1.38, s.fg, { max: 14, ls: 1.2, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, a slab of the field stands in it
        const s = pg(d, { bare: true, noTitle: true }), fg = s.fg;
        await k.photo(s, d.image, 0, 0, 10, 5.1);
        const [bg] = FIELDS[(k.idx - 1) % FIELDS.length];
        t.rect(s, 0.55, 0, 4.85, 5.1, bg, { name: 'Slab' });
        k.head(s, d.title || '', 0.8, 0.3, 4.35, 1.05, { max: 28, min: 15, color: fg, valign: 'top' });
        hl(s, 0.8, 1.42, 4.35);
        bd(s, d.text, 0.8, 1.52, 4.35, 3.48, fg, { max: 14, ls: 1.25 });
        mark(s, fg, { x: 8.1, y: 5.1, h: 0.5, size: 20 }); k.foot(s, { y: 5.27, w: 7.4, color: fg, size: 8 });
      },
      async (d) => { // a great round picture hangs in the field, type beside it
        const s = pg(d, { tw: 4.4, bare: true }), dia = 4.75;
        await k.photo(s, d.image, 5.0, 0.3, dia, dia, { mask: 'circle' });
        bd(s, d.text, 0.55, 1.55, 4.25, 3.3, s.fg, { max: 14, ls: 1.25 });
        mark(s, s.fg, { x: 0.55, y: 4.8, w: 1.5, h: 0.42, align: 'left', size: 16 });
        k.foot(s, { y: 5.27, w: 7.4, color: s.fg, size: 8 });
      },
      async (d) => { // the picture is cut on a slant and runs off the left corner
        const s = pg(d, { bare: true, noTitle: true });
        await k.photo(s, d.image, 0, 0, 5.9, 5.625, { mask: { poly: [[0, 0], [1, 0], [0.72, 1], [0, 1]] } });
        k.head(s, d.title || '', 6.05, 0.3, 3.45, 1.15, { max: 26, min: 15, color: s.fg, valign: 'top' });
        bd(s, d.text, 5.75, 1.5, 3.75, 3.2, s.fg, { max: 14, ls: 1.25 });
        mark(s, s.fg); k.foot(s, { x: 5.1, y: 5.27, w: 3.3, color: s.fg, size: 7 });
      },
    ],
    cards: [
      async (d) => { // a white hairline cross quarters the field
        const s = pg(d), n = d.items.length, w = 4.25, h = 1.66, fg = s.fg;
        hl(s, 0.55, 3.03, 8.9); vl(s, 5, 1.35, n === 3 ? 1.68 : 3.4);
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.9 : w, x = 0.55 + (i % 2) * (w + 0.4), y = 1.35 + Math.floor(i / 2) * (h + 0.04) + (i > 1 ? 0.04 : 0);
          t.img(s, await k.icon(it.icon, fg, 2), x, y + 0.04, 0.34, 0.34);
          hd(s, it.h, x + 0.46, y, ww - 0.46, 0.42, fg, { valign: 'middle', max: 17 });
          bd(s, it.t, x, y + 0.48, ww, h - 0.5, fg, { max: 13.5 });
        }
      },
      async (d) => { // fields stack under the title, each item in the colour that comes next
        const s = pg(d, { bare: true }), n = d.items.length, y0 = 1.3, h = (5.1 - y0) / n;
        for (const [i, it] of d.items.entries()) {
          const [bg, fg] = alt(i + 1), y = y0 + i * h;
          t.rect(s, 0, y, 10, h, bg, { name: 'Field' });
          t.img(s, await k.icon(it.icon, fg, 2), 0.55, y + h / 2 - 0.2, 0.4, 0.4);
          hd(s, it.h, 1.15, y + 0.05, 2.75, h - 0.1, fg, { valign: 'middle' });
          bd(s, it.t, 4.05, y + 0.05, 5.4, h - 0.1, fg, { valign: 'middle' });
        }
        mark(s, s.fg, { y: 5.13, h: 0.45, size: 18 }); k.foot(s, { y: 5.27, w: 7.4, color: s.fg, size: 8 });
      },
      async (d) => { // the type climbs the field in steps
        const s = pg(d), n = d.items.length, w = 8.9 / n, drop = n === 4 ? 0.36 : 0.5, fg = s.fg;
        for (const [i, it] of d.items.entries()) {
          const x = 0.55 + i * w, y = 1.35 + (n - 1 - i) * drop, bottom = 4.72;
          hl(s, x, y, w - 0.16);
          t.img(s, await k.icon(it.icon, fg, 1.75), x, y + 0.1, 0.46, 0.46);
          hd(s, it.h, x, y + 0.6, w - 0.22, 0.62, fg, { max: 16 });
          bd(s, it.t, x, y + 1.24, w - 0.22, bottom - y - 1.24, fg, { max: 13 });
        }
      },
      async (d) => { // one idea takes a great block of the next colour, the rest stand beside it
        const s = pg(d, { bare: true, noTitle: true }), [a, ...rest] = d.items, [bg, fg] = alt(1);
        t.rect(s, 0, 0, 4.1, 5.625, bg, { name: 'Block' });
        k.head(s, d.title || '', 0.55, 0.3, 3.25, 1.3, { max: 26, min: 15, color: fg, valign: 'top' });
        t.img(s, await k.icon(a.icon, fg, 1.75), 0.55, 1.7, 0.6, 0.6);
        hd(s, a.h, 0.55, 2.35, 3.25, 0.62, fg, { max: 20, min: 13 });
        bd(s, a.t, 0.55, 3.0, 3.25, 2.1, fg, { max: 15 });
        k.foot(s, { y: 5.27, w: 3.4, color: fg, size: 7.5, x: 0.55 });
        for (const [i, it] of rest.entries()) {
          const y = 0.4 + i * (4.3 / rest.length), rr = 4.3 / rest.length;
          if (i) hl(s, 4.5, y - 0.04, 5.0);
          t.img(s, await k.icon(it.icon, s.fg, 2), 4.5, y + 0.05, 0.34, 0.34);
          hd(s, it.h, 5.0, y, 4.45, 0.44, s.fg, { valign: 'middle', max: 17 });
          bd(s, it.t, 4.5, y + 0.5, 4.95, rr - 0.58, s.fg, { max: 13.5 });
        }
        mark(s, s.fg, { y: 4.9, h: 0.5, size: 18 });
      },
    ],
    process: [
      async (d) => { // huge numerals walk down the field, the words under each
        const s = pg(d), n = d.steps.length, w = 8.9 / n, drop = n === 4 ? 0.34 : 0.48, fg = s.fg;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.55 + i * w, y = 1.3 + i * drop, bottom = 4.72;
          k.txt(s, String(i + 1), x, y, 0.9, 0.72, { size: 44, bold: true, font: F.head, color: fg, valign: 'middle', ls: 1 });
          if (i < n - 1) k.txt(s, '→', x + 0.75, y + 0.1, w - 0.85, 0.55, { size: 22, bold: true, color: fg, valign: 'middle', font: 'Arial' });
          hd(s, st.h, x, y + 0.72, w - 0.2, 0.56, fg, { max: 15 });
          bd(s, st.t, x, y + 1.28, w - 0.2, bottom - y - 1.28, fg, { max: 13 });
        }
      },
      async (d) => { // each step is a tall strip of its own colour, an arrow carries you on
        const s = pg(d, { bare: true }), n = d.steps.length, w = 10 / n, y0 = 1.3, y1 = 5.1;
        for (const [i, st] of d.steps.entries()) {
          const [bg, fg] = alt(i + 1), x = i * w;
          t.rect(s, x, y0, w, y1 - y0, bg, { name: 'Strip' });
          k.txt(s, `${i + 1}${i < n - 1 ? '  →' : ''}`, x + 0.25, y0 + 0.1, w - 0.4, 0.68, { size: 30, bold: true, font: F.head, color: fg, valign: 'middle' });
          hd(s, st.h, x + 0.25, y0 + 0.8, w - 0.45, 0.58, fg, { max: 15 });
          bd(s, st.t, x + 0.25, y0 + 1.4, w - 0.45, y1 - y0 - 1.5, fg, { max: 13 });
        }
        mark(s, s.fg, { y: 5.13, h: 0.45, size: 18 }); k.foot(s, { y: 5.27, w: 7.4, color: s.fg, size: 8 });
      },
      async (d) => { // the path turns on a hairline cross: across, down, back
        const s = pg(d), n = d.steps.length, w = 4.25, h = 1.66, fg = s.fg, spot = n === 3 ? [[0, 0], [1, 0], [0, 1]] : [[0, 0], [1, 0], [1, 1], [0, 1]], arrows = n === 3 ? ['→', '↓'] : ['→', '↓', '←'];
        hl(s, 0.55, 3.03, 8.9); vl(s, 5, 1.35, n === 3 ? 1.68 : 3.4);
        for (const [i, st] of d.steps.entries()) {
          const [c, r] = spot[i], wide = n === 3 && i === 2, ww = wide ? 8.9 : w, x = 0.55 + c * (w + 0.4), y = 1.38 + r * 1.72;
          k.txt(s, String(i + 1), x, y, 0.75, h, { size: 54, bold: true, font: F.head, color: fg, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.8, y, ww - 0.8 - (i < n - 1 ? 0.35 : 0), 0.46, fg, { valign: 'middle', max: 15 });
          bd(s, st.t, x + 0.8, y + 0.48, ww - 0.8, h - 0.5, fg, { max: 13 });
          if (i < n - 1) k.txt(s, arrows[i], x + ww - 0.35, y + 0.02, 0.35, 0.42, { size: 18, bold: true, color: fg, align: 'right', valign: 'middle', font: 'Arial' });
        }
      },
      async (d) => { // a hairline runs down the middle, the steps swing to either side
        const s = pg(d), n = d.steps.length, per = Math.ceil(n / 2), h = 3.3 / per, w = 4.0, fg = s.fg;
        vl(s, 5, 1.35, 3.4);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.3 : 0.7, y = 1.35 + Math.floor(i / 2) * h + (right ? 0.32 : 0), al = right ? 'left' : 'right';
          k.txt(s, String(i + 1), right ? x : x + w - 0.7, y, 0.7, 0.6, { size: 32, bold: true, font: F.head, color: fg, align: al, valign: 'middle', ls: 1 });
          hd(s, st.h, right ? x + 0.72 : x, y, w - 0.72, 0.6, fg, { align: al, valign: 'middle', max: 15 });
          bd(s, st.t, x, y + 0.62, w, h - 0.66, fg, { align: al, max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // one enormous figure is the whole page, the others small at its foot
        const s = pg(d), [a, ...rest] = d.stats, fg = s.fg;
        big(s, a.value, 0.55, 1.2, 5.6, 2.0, fg, 110);
        bd(s, a.label, 0.55, 3.2, 5.4, 0.6, fg, { max: 16 });
        vl(s, 6.35, 1.35, 2.5);
        rest.forEach((v, i) => { const y = 1.35 + i * 1.28;
          big(s, v.value, 6.6, y, 2.85, 0.68, fg, 36);
          bd(s, v.label, 6.6, y + 0.68, 2.85, 0.55, fg, { max: 12 }); });
        if (d.note) { hl(s, 0.55, 3.92, 8.9); bd(s, d.note, 0.55, 3.98, 7.4, 0.78, fg, { max: 12, italic: true, valign: 'middle' }); }
      },
      async (d) => { // the figures slide down the page on a diagonal
        const s = pg(d), w = 2.95, fg = s.fg;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.55 + i * w, y = 1.2 + i * 0.92;
          big(s, v.value, x, y, w - 0.1, 0.92, fg, 50);
          bd(s, v.label, x, y + 0.92, w - 0.2, 0.6, fg, { max: 13 });
        }
        if (d.note) bd(s, d.note, 0.55, 3.7, 5.55, 1.05, fg, { max: 12, italic: true, valign: 'bottom' });
      },
      async (d) => { // the page parts in two colours: the argument left, the figures right
        const s = pg(d, { tw: 4.5, bare: true }), [bg, fg] = alt(2), base = s.fg;
        t.rect(s, 5.2, 0, 4.8, 5.625, bg, { name: 'Field' });
        d.stats.forEach((v, i) => { const y = 0.3 + i * 1.5;
          if (i) t.line(s, 5.55, y - 0.04, 4.1, 0, fg, 0.75, { t: 40 });
          big(s, v.value, 5.55, y, 4.1, 0.86, fg, 46);
          bd(s, v.label, 5.55, y + 0.86, 4.1, 0.56, fg, { max: 13 }); });
        if (d.note) bd(s, d.note, 0.55, 1.5, 4.25, 3.3, base, { max: 16, italic: true, valign: 'middle' });
        mark(s, fg, { y: 4.95, h: 0.5, size: 18 }); k.foot(s, { y: 5.27, w: 4.35, color: base, size: 7.5 });
      },
    ],
    compare: [
      async (d) => { // the page breaks in two colours under the title, the sides mirror each other
        const s = pg(d, { bare: true }), [bg, fg2] = alt(1);
        t.rect(s, 5, 1.3, 5, 4.325, bg, { name: 'Field' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.35 : 0.55, w = 4.1, a = i ? 'left' : 'right', fg = i ? fg2 : s.fg, n = sd.items.length, rh = 2.82 / n;
          hd(s, sd.h, x, 1.4, w, 0.68, fg, { max: 22, min: 13, align: a, valign: 'middle' });
          sd.items.forEach((it, j) => { const y = 2.12 + j * rh; t.line(s, x, y, w, 0, fg, 0.75, { t: 40 }); bd(s, it, x, y + 0.03, w, rh - 0.06, fg, { align: a, valign: 'middle' }); });
        }
        mark(s, fg2, { y: 4.95, h: 0.5, size: 18 }); k.foot(s, { y: 5.27, w: 4.2, color: s.fg, size: 7.5 });
      },
      async (d) => { // one field over the other, each side's points standing in a row
        const s = pg(d, { bare: true }), [bg, fg2] = alt(2), cut = 3.15;
        t.rect(s, 0, cut, 10, 5.625 - cut, bg, { name: 'Field' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? cut + 0.12 : 1.3, h = i ? 1.82 : cut - 1.42, fg = i ? fg2 : s.fg, n = sd.items.length, x0 = 2.85, w = (9.45 - x0) / n;
          hd(s, sd.h, 0.55, y, 2.1, h, fg, { max: 20, min: 12, valign: 'middle' });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.line(s, x, y + 0.04, 0, h - 0.08, fg, 0.75, { t: 40 }); bd(s, it, x + 0.12, y + 0.03, w - 0.2, h - 0.06, fg, { valign: 'middle', max: 13 }); });
        }
        mark(s, fg2, { y: 5.13, h: 0.45, size: 18 }); k.foot(s, { y: 5.27, w: 7.4, color: fg2, size: 8 });
      },
    ],
    statement: [
      async (d) => { // a giant mark opens the thought
        const s = pg(d), fg = s.fg;
        k.txt(s, '“', 0.35, 1.0, 2.0, 2.6, { size: 190, bold: true, font: F.head, color: fg, ls: 1, valign: 'top' });
        k.head(s, L.runs(d.text), 2.35, 1.4, 7.1, 2.25, { max: 38, min: 18, color: fg, valign: 'middle' });
        if (d.caption) { hl(s, 2.35, 3.72, 7.1); bd(s, d.caption, 2.35, 3.8, 5.6, 0.98, fg, { max: 12.5 }); }
      },
      async (d) => { // a tall block of the next colour holds the title and the note
        const s = pg(d, { bare: true, noTitle: true }), [bg, fg] = alt(3);
        t.rect(s, 0, 0, 3.55, 5.625, bg, { name: 'Block' });
        k.head(s, d.title || '', 0.45, 0.3, 2.75, 1.5, { max: 26, min: 14, color: fg, valign: 'top' });
        if (d.caption) bd(s, d.caption, 0.45, 1.9, 2.75, 3.2, fg, { max: 13, valign: 'bottom' });
        k.foot(s, { x: 0.45, y: 5.27, w: 2.8, color: fg, size: 7 });
        k.head(s, L.runs(d.text), 3.95, 0.4, 5.55, 4.25, { max: 42, min: 20, color: s.fg, valign: 'middle' });
        mark(s, s.fg);
      },
    ],
    timeline: [
      async (d) => { // the years in a wide margin, hairlines between them
        const s = pg(d), rh = 3.4 / 4, fg = s.fg;
        for (const [i, it] of d.items.entries()) {
          const y = 1.35 + i * rh;
          if (i) hl(s, 0.55, y - 0.02, 8.9);
          big(s, it.year, 0.55, y, 2.1, rh - 0.06, fg, 30);
          hd(s, it.h, 2.8, y + 0.02, 2.15, rh - 0.1, fg, { valign: 'middle', max: 15 });
          bd(s, it.t, 5.05, y + 0.02, 4.4, rh - 0.1, fg, { valign: 'middle', max: 12.5 });
        }
      },
      async (d) => { // four years on a white line, events above and below by turns
        const s = pg(d), mid = 3.05, step = 1.85, w = 3.5, fg = s.fg;
        hl(s, 0, mid, 10);
        for (const [i, it] of d.items.entries()) {
          const x = 0.55 + i * step, up = i % 2 === 0, y = up ? 1.28 : mid + 0.08, h = up ? mid - 1.33 : 1.65;
          vl(s, x, up ? y : mid, up ? mid - y : h);
          big(s, it.year, x + 0.1, y, w - 0.1, 0.48, fg, 22);
          hd(s, it.h, x + 0.1, y + 0.47, w - 0.1, 0.32, fg, { max: 13, min: 10.5, valign: 'middle' });
          bd(s, it.t, x + 0.1, y + 0.8, w - 0.1, h - 0.82, fg, { max: 12.5 });
        }
      },
      async (d) => { // four colour fields, a great year in each
        const s = pg(d, { bare: true }), y0 = 1.3, w = 5, h = (5.1 - y0) / 2;
        for (const [i, it] of d.items.entries()) {
          const [bg, fg] = alt(i + 1), x = (i % 2) * w, y = y0 + Math.floor(i / 2) * h;
          t.rect(s, x, y, w, h, bg, { name: 'Field' });
          big(s, it.year, x + 0.4, y + 0.1, 2.1, h - 0.2, fg, 34, { align: 'left' });
          hd(s, it.h, x + 2.55, y + 0.1, w - 2.9, 0.42, fg, { max: 15, valign: 'middle' });
          bd(s, it.t, x + 2.55, y + 0.54, w - 2.9, h - 0.62, fg, { max: 12.5 });
        }
        mark(s, s.fg, { y: 5.13, h: 0.45, size: 18 }); k.foot(s, { y: 5.27, w: 7.4, color: s.fg, size: 8 });
      },
    ],
  };
  const hl = hline, vl = vline;
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old process columns looked like the card columns
  R.stats = V.stats.shift(); // the old stats columns looked like the card columns
  R.timeline = V.timeline.shift(); // the old timeline columns looked like the card columns
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Rangli maydon', colors: { dk1: '1B1B1B', lt1: 'FFFFFF', dk2: '1D3557', lt2: 'F1FAEE', accent1: 'E63946', accent2: '2A9D8F', accent3: 'F4A261', accent4: '6D597A', accent5: '264653', accent6: 'E9C46A', hlink: 'E63946', folHlink: '6D597A' } });
}
module.exports = { id: 104, slug: 'rangli-maydon', name: 'Rangli maydon', category: 'creative', photos: true, build, style: { tone: "baland ovozli va qisqa: har slaydda bitta kuchli fikr, katta harflarga mos ixcham matn", limits: { title: 45, stmt: 60 }, prefer: 'visual' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "calm"], "transitions": ["wipe:l", "fade", "cut"], "cover": ["stretch", "fadeWords"], "mark": "popIn", "deco": "wipe:l", "sig": {"title": "wipe:l", "body": "fade", "item": "wipe:l", "image": "wipe:r", "number": "popIn", "order": "seq", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
