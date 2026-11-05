/**
 * 58 Jadval — spreadsheet: formula bar, column letters and row numbers, ideas in merged
 * and colour-filled cells, a selected cell with fill handle, comments as yellow notes.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', grid: 'E2E3E3', head: 'F3F3F3', ink: '202124', muted: '5F6368', green: '188038', blue: '1A73E8', fills: ['CFE2F3', 'D9EAD3', 'FFF2CC', 'F4CCCC', 'EAD1DC', 'D0E0E3'] };
const F = { head: 'Arial', body: 'Arial' };
const X0 = 0.45, CW = 1.1, Y0 = 1.1, RH = 0.3, COLS = 8; // grid geometry (inches)
const cx = (c) => X0 + c * CW, ry = (r) => Y0 + r * RH;

const gridSvg = () => {
  const s = 160, rows = Math.ceil((5.05 - Y0) / RH); let g = '', lab = '';
  for (let c = 0; c <= COLS; c++) g += `<line x1="${cx(c) * s}" y1="${(Y0 - 0.25) * s}" x2="${cx(c) * s}" y2="${5.05 * s}" />`;
  for (let r = 0; r <= rows; r++) g += `<line x1="${(X0 - 0.35) * s}" y1="${ry(r) * s}" x2="${cx(COLS) * s}" y2="${ry(r) * s}"/>`;
  for (let c = 0; c < COLS; c++) lab += `<text x="${(cx(c) + CW / 2) * s}" y="${(Y0 - 0.07) * s}" text-anchor="middle" font-family="Arial" font-size="17" fill="#${C.muted}">${String.fromCharCode(65 + c)}</text>`;
  for (let r = 0; r < rows; r++) lab += `<text x="${(X0 - 0.175) * s}" y="${(ry(r) + 0.2) * s}" text-anchor="middle" font-family="Arial" font-size="15" fill="#${C.muted}">${r + 1}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#fff"/>
   <rect x="${(X0 - 0.35) * s}" y="${(Y0 - 0.25) * s}" width="${(cx(COLS) - X0 + 0.35) * s}" height="${0.25 * s}" fill="#${C.head}"/><rect x="${(X0 - 0.35) * s}" y="${(Y0 - 0.25) * s}" width="${0.35 * s}" height="${(5.05 - Y0 + 0.25) * s}" fill="#${C.head}"/>
   <g stroke="#${C.grid}" stroke-width="1">${g}</g>${lab}</svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const grid = await L.svg(gridSvg(), 1600, 900, true);
  // merged cell range c0..c1 (exclusive), r0..r1 (exclusive)
  const cell = (s, c0, r0, c1, r1, fill, o = {}) => t.rect(s, cx(c0), ry(r0), cx(c1) - cx(c0), ry(r1) - ry(r0), fill || C.bg, { line: { color: o.sel ? C.green : '9AA0A6', width: o.sel ? 2.25 : 0.75 }, name: 'Cell' });
  const handle = (s, c1, r1) => t.rect(s, cx(c1) - 0.05, ry(r1) - 0.05, 0.1, 0.1, C.green, { name: 'Fill handle' });
  const inCell = (s, txt, c0, r0, c1, r1, o = {}) => t.text(s, txt, { x: cx(c0) + 0.08, y: ry(r0) + 0.03, w: cx(c1) - cx(c0) - 0.16, h: ry(r1) - ry(r0) - 0.06, fontSize: 13, color: C.ink, valign: 'middle', ...o });
  const chrome = (s, title) => {
    t.rect(s, 0, 0, W, 0.42, 'F8F9FA', { name: 'Toolbar' });
    t.text(s, M.topic || '', { x: 0.3, y: 0, w: 6.5, h: 0.42, fontSize: 11, bold: true, color: C.ink, valign: 'middle' });
    t.rect(s, 0.1, 0.48, 9.8, 0.3, C.bg, { line: { color: C.grid, width: 0.75 }, name: 'Formula bar' });
    t.text(s, 'fx', { x: 0.18, y: 0.48, w: 0.35, h: 0.3, fontSize: 11, italic: true, bold: true, color: C.muted, valign: 'middle' });
    t.text(s, title || '', { x: 0.6, y: 0.48, w: 9.2, h: 0.3, fontSize: 11, color: C.ink, valign: 'middle' });
    t.rect(s, 0, 5.2, W, 0.425, 'F8F9FA', { name: 'Sheet tabs' });
    t.rect(s, 0.3, 5.2, 1.4, 0.3, C.bg, { line: { color: C.grid, width: 0.75 }, name: 'Tab' });
    t.text(s, `${TR.slide_l} ${idx}`, { x: 0.3, y: 5.2, w: 1.4, h: 0.3, fontSize: 10, bold: true, color: C.green, align: 'center', valign: 'middle' });
    t.text(s, meta, { x: 1.9, y: 5.2, w: 7.8, h: 0.3, fontSize: 9, color: C.muted, align: 'right', valign: 'middle' });
  };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: grid }; idx++;
    chrome(s, d.title);
    if (d.title) { cell(s, 0, 0, COLS, 2, C.bg); inCell(s, d.title, 0, 0, COLS, 2, { fontSize: L.fit(d.title, 8.6, 0.55, 24, 14, F.head, true), bold: true }); }
    return s;
  };
  const picture = async (s, src, x, y, w, h) => {
    t.img(s, await L.photo(L.src(src), w, h), x, y, w, h, { alt: '' });
    t.rect(s, x, y, w, h, null, { line: { color: C.blue, width: 1.5 }, name: 'Selection' });
    for (const [a, b] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h], [x + w / 2, y], [x + w / 2, y + h], [x, y + h / 2], [x + w, y + h / 2]]) t.oval(s, a - 0.05, b - 0.05, 0.1, 0.1, C.bg, { line: { color: C.blue, width: 1.25 } });
  };
  const note = (s, txt, x, y, w, h) => { t.rect(s, x, y, w, h, 'FFF8C4', { shadow: 0.2, blur: 5, offset: 2, line: { color: 'E6D27A', width: 0.75 }, name: 'Comment' }); t.text(s, txt, { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: h - 0.16, fontSize: 12, color: C.ink, valign: 'middle' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: grid }; idx++;
    chrome(s, d.title);
    cell(s, 0, 0, 5, 6, C.fills[0], { sel: true }); handle(s, 5, 6);
    inCell(s, d.title, 0, 0, 5, 6, { fontSize: L.fit(d.title, 5.3, 1.7, 34, 18, F.head, true), bold: true });
    if (d.subtitle) { cell(s, 0, 6, 5, 9, C.bg); inCell(s, d.subtitle, 0, 6, 5, 9, { fontSize: 12, color: C.muted }); }
    [[TR.author_l, M.author], [TR.org_l, M.org], [TR.city_l, M.loc], [TR.year_l, M.year]].forEach(([k, v], i) => {
      cell(s, 0, 9 + i, 1, 10 + i, C.head); inCell(s, k, 0, 9 + i, 1, 10 + i, { fontSize: 10, bold: true, color: C.muted });
      cell(s, 1, 9 + i, 5, 10 + i, C.bg); inCell(s, v || '\u2014', 1, 9 + i, 5, 10 + i, { fontSize: 12, bold: i === 0 });
    });
    if (d.image) await picture(s, d.image, cx(5) + 0.25, ry(0) + 0.15, 2.85, 2.6);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await picture(s, d.image, cx(0) + 0.1, ry(2) + 0.15, 3.6, 3.0); cell(s, 4, 2, 8, 13, C.fills[1]); inCell(s, d.text, 4, 2, 8, 13, { fontSize: 14, valign: 'top' }); },
    async image(d) { const s = page(d); cell(s, 0, 2, 4, 13, C.fills[0]); inCell(s, d.text, 0, 2, 4, 13, { fontSize: 14, valign: 'top' }); await picture(s, d.image, cx(4) + 0.25, ry(2) + 0.15, 3.95, 3.0); },
    async agenda(d) {
      const s = page(d);
      cell(s, 0, 2, 1, 3, C.head); inCell(s, TR.no, 0, 2, 1, 3, { bold: true, align: 'center' });
      cell(s, 1, 2, 8, 3, C.head);
      d.items.forEach((it, i) => {
        const r = 3 + i * 1.5;
        cell(s, 0, r, 1, r + 1.5, C.fills[i % 6]); inCell(s, String(i + 1), 0, r, 1, r + 1.5, { bold: true, align: 'center', fontSize: 16 });
        cell(s, 1, r, 8, r + 1.5, C.bg); inCell(s, it, 1, r, 8, r + 1.5, { fontSize: 15, bold: true });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, span = COLS / n;
      for (const [i, it] of d.items.entries()) {
        const c0 = i * span, c1 = (i + 1) * span;
        cell(s, c0, 2, c1, 4, C.fills[i % 6]);
        t.img(s, await L.icon(it.icon, C.ink, 2), cx(c0) + 0.08, ry(2) + 0.17, 0.26, 0.26);
        t.text(s, it.h, { x: cx(c0) + 0.4, y: ry(2) + 0.03, w: cx(c1) - cx(c0) - 0.48, h: RH * 2 - 0.06, fontSize: 13, bold: true, color: C.ink, valign: 'middle' });
        cell(s, c0, 4, c1, 13, C.bg); inCell(s, it.t, c0, 4, c1, 13, { valign: 'top', fontSize: 13 });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, span = COLS / n;
      d.steps.forEach((st, i) => {
        const c0 = i * span, c1 = (i + 1) * span;
        cell(s, c0, 2, c1, 4, C.fills[i % 6], { sel: i === n - 1 });
        inCell(s, `${i + 1} \u2192 ${st.h}`, c0, 2, c1, 4, { bold: true, fontSize: 13 });
        cell(s, c0, 4, c1, 13, C.bg); inCell(s, st.t, c0, 4, c1, 13, { valign: 'top', fontSize: 13 });
      });
      handle(s, COLS, 4);
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, span = COLS / n;
      d.stats.forEach((x, i) => {
        const c0 = i * span, c1 = (i + 1) * span;
        cell(s, c0, 2, c1, 7, C.fills[i % 6], { sel: i === 0 }); if (i === 0) handle(s, c1, 7);
        inCell(s, x.value, c0, 2, c1, 7, { fontSize: L.fit(x.value, cx(c1) - cx(c0) - 0.3, 1.3, 48, 20, F.head, true), bold: true, align: 'right' });
        cell(s, c0, 7, c1, 10, C.bg); inCell(s, x.label, c0, 7, c1, 10, { fontSize: 12, color: C.muted, align: 'right' });
      });
      if (d.note) { cell(s, 0, 10, COLS, 13, C.bg); inCell(s, d.note, 0, 10, COLS, 13, { fontSize: 11, italic: true, color: C.muted }); }
    },
    async compare(d) {
      const s = page(d), w = CW * 4 - 0.16;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.12, ry(13) - ry(3));
      [d.left, d.right].forEach((side, i) => {
        const c0 = i * 4, c1 = c0 + 4;
        cell(s, c0, 2, c1, 3, i ? C.fills[1] : C.fills[3]); inCell(s, side.h, c0, 2, c1, 3, { bold: true });
        let y = ry(3);
        side.items.forEach((it, k) => { t.rect(s, cx(c0), y, CW * 4, rows[k], C.bg, { line: { color: '9AA0A6', width: 0.75 }, name: 'Cell' }); t.text(s, it, { x: cx(c0) + 0.08, y: y + 0.03, w, h: rows[k] - 0.06, fontSize: fs, color: C.ink, valign: 'middle' }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      cell(s, 0, 2, COLS, 9, C.fills[2], { sel: true }); handle(s, COLS, 9);
      inCell(s, L.runs(d.text), 0, 2, COLS, 9, { fontSize: L.fit(d.text, 8.4, 1.9, 34, 18, F.head, true), bold: true, align: 'center' });
      if (d.caption) note(s, d.caption, cx(2), ry(9) + 0.15, CW * 6, ry(13) - ry(9) - 0.2);
    },
    async timeline(d) {
      const s = page(d);
      cell(s, 0, 2, 1, 3, C.head); cell(s, 1, 2, 3, 3, C.head); cell(s, 3, 2, 8, 3, C.head);
      d.items.forEach((it, i) => {
        const r = 3 + i * 2.5;
        cell(s, 0, r, 1, r + 2.5, C.fills[i % 6]); inCell(s, it.year, 0, r, 1, r + 2.5, { bold: true, align: 'center', fontSize: 13 });
        cell(s, 1, r, 3, r + 2.5, C.bg); inCell(s, it.h, 1, r, 3, r + 2.5, { bold: true });
        cell(s, 3, r, 8, r + 2.5, C.bg); inCell(s, it.t, 3, r, 8, r + 2.5, { fontSize: 12, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      cell(s, 0, 1, COLS, 8, C.fills[0], { sel: true }); handle(s, COLS, 8);
      inCell(s, `\u201C${d.text}\u201D`, 0, 1, COLS, 8, { fontSize: L.fit(d.text, 8.4, 1.9, 30, 16, F.head, true), italic: true, bold: true, align: 'center' });
      if (d.author) note(s, `\u2014 ${d.author}`, cx(4), ry(8) + 0.2, CW * 4, 0.55);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rr = Math.min(1.8, 11 / n);
      d.items.forEach((it, i) => {
        const r = 2 + i * rr;
        cell(s, 0, r, 1, r + rr, C.head); inCell(s, `[${i + 1}]`, 0, r, 1, r + rr, { bold: true, align: 'center', color: C.blue });
        cell(s, 1, r, 8, r + rr, C.bg); inCell(s, it, 1, r, 8, r + rr, { fontSize: 12 });
      });
    },
  };
  // ---- further ways to draw a type, all inside the sheet: a deck's pages must not look alike (L.pages)
  const D = { bg: '1F2326', cell: '2B2F33', line: '6B7176', ink: 'F1F3F4', dim: 'BDC1C6', sel: '34D07F' };
  const darkGrid = await L.svg(gridSvg().split('#fff').join('#' + D.bg).split('#' + C.head).join('#' + D.cell).split('#' + C.grid).join('#3A3F44').split('#' + C.muted).join('#' + D.dim), 1600, 900, true);
  const darkPage = (d) => {
    const s = pres.addSlide(); s.background = { data: darkGrid }; idx++;
    t.rect(s, 0, 0, W, 0.42, D.cell, { name: 'Toolbar' });
    t.text(s, M.topic || '', { x: 0.3, y: 0, w: 6.5, h: 0.42, fontSize: 11, bold: true, color: D.ink, valign: 'middle' });
    t.rect(s, 0.1, 0.48, 9.8, 0.3, D.bg, { line: { color: D.line, width: 0.75 }, name: 'Formula bar' });
    t.text(s, 'fx', { x: 0.18, y: 0.48, w: 0.35, h: 0.3, fontSize: 11, italic: true, bold: true, color: D.dim, valign: 'middle' });
    t.text(s, d.title || '', { x: 0.6, y: 0.48, w: 9.2, h: 0.3, fontSize: 11, color: D.ink, valign: 'middle' });
    t.rect(s, 0, 5.2, W, 0.425, D.cell, { name: 'Sheet tabs' });
    t.rect(s, 0.3, 5.2, 1.4, 0.3, D.bg, { line: { color: D.line, width: 0.75 }, name: 'Tab' });
    t.text(s, `${TR.slide_l} ${idx}`, { x: 0.3, y: 5.2, w: 1.4, h: 0.3, fontSize: 10, bold: true, color: D.sel, align: 'center', valign: 'middle' });
    t.text(s, meta, { x: 1.9, y: 5.2, w: 7.8, h: 0.3, fontSize: 9, color: D.dim, align: 'right', valign: 'middle' });
    dark(s, 0, 0, COLS, 2, D.cell); fitIn(s, d.title, 0, 0, COLS, 2, { max: 24, min: 14, bold: true, color: D.ink });
    return s;
  };
  const dark = (s, c0, r0, c1, r1, fill = D.cell, o = {}) => t.rect(s, cx(c0), ry(r0), cx(c1) - cx(c0), ry(r1) - ry(r0), fill, { line: { color: o.sel ? D.sel : D.line, width: o.sel ? 2.25 : 0.75 }, name: 'Cell' });
  // text fitted to a merged range
  const fitIn = (s, v, c0, r0, c1, r1, o = {}) => { const { max = 13, min = 10, ...rest } = o, w = cx(c1) - cx(c0) - 0.16, h = ry(r1) - ry(r0) - 0.06; inCell(s, v, c0, r0, c1, r1, { fontSize: L.fit(v, w, h, max, min, o.fontFace || F.body, !!o.bold), ...rest }); };
  const tracer = (s, x, y, w, h, o = {}) => t.shape(s, 'LINE', { x, y, w, h, line: { color: o.color || C.blue, width: 1.75, endArrowType: 'triangle' }, objectName: 'Trace arrow', ...(o.flipH ? { flipH: true } : {}), ...(o.flipV ? { flipV: true } : {}) });
  const tick = (s, c, r) => t.shape(s, 'RIGHT_TRIANGLE', { x: cx(c) - 0.13, y: ry(r), w: 0.13, h: 0.13, fill: { color: 'D93025' }, flipV: true, flipH: false, objectName: 'Comment mark' });
  const sticky = (s, x, y, w, h) => t.rect(s, x, y, w, h, 'FFF8C4', { shadow: 0.2, blur: 5, offset: 2, line: { color: 'E6D27A', width: 0.75 }, name: 'Comment' });
  const V = {
    image: [
      async (d) => { // the picture object lies across the sheet, a merged range under it
        const s = page(d);
        await picture(s, d.image, cx(0) + 0.1, ry(2) + 0.12, CW * 8 - 0.2, 1.62);
        cell(s, 0, 8, COLS, 13, C.fills[0]); fitIn(s, d.text, 0, 8, COLS, 13, { max: 14 });
      },
      async (d) => { // the picture fills the sheet, the words are a comment stuck on it
        const s = page(d), x = 4.72, y = ry(2) + 0.2, w = 4.32, h = 2.9;
        await picture(s, d.image, cx(0), ry(2), CW * 8, RH * 11);
        sticky(s, x, y, w, h);
        t.text(s, d.text, { x: x + 0.14, y: y + 0.08, w: w - 0.28, h: h - 0.16, fontSize: L.fit(d.text, w - 0.28, h - 0.16, 14, 10, F.body), color: C.ink, valign: 'middle' });
      },
      async (d) => { // dark mode: the picture on the left, a selected range beside it
        const s = darkPage(d);
        await picture(s, d.image, cx(0) + 0.1, ry(2) + 0.1, CW * 4 - 0.2, RH * 11 - 0.2);
        dark(s, 4, 2, COLS, 13, D.cell, { sel: true }); handle(s, COLS, 13);
        fitIn(s, d.text, 4, 2, COLS, 13, { max: 14, color: D.ink });
      },
      async (d) => { // a round avatar picture cut into a wide coloured range
        const s = page(d), dia = 3.1, x = cx(8) - dia - 0.1, y = ry(2) + 0.1;
        cell(s, 0, 2, 5, 13, C.fills[1], { sel: true }); handle(s, 5, 13);
        fitIn(s, d.text, 0, 2, 5, 13, { max: 14 });
        t.oval(s, x - 0.06, y - 0.06, dia + 0.12, dia + 0.12, C.bg, { line: { color: C.blue, width: 2 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
      },
    ],
    cards: [
      async (d) => { // a big merged lead range, the others listed beside it
        const s = page(d), [a, ...rest] = d.items, rr = 11 / rest.length;
        cell(s, 0, 2, 3, 13, C.fills[0], { sel: true }); handle(s, 3, 13);
        t.img(s, await L.icon(a.icon, C.ink, 2), cx(0) + 0.14, ry(2) + 0.14, 0.56, 0.56);
        fitIn(s, a.h, 0, 4.6, 3, 6.8, { max: 16, bold: true, fontFace: F.head });
        fitIn(s, a.t, 0, 6.8, 3, 13, { valign: 'top' });
        for (const [i, it] of rest.entries()) {
          const r = 2 + i * rr, f = C.fills[(i + 1) % 6];
          cell(s, 3, r, 5, r + rr, f);
          t.img(s, await L.icon(it.icon, C.ink, 2), cx(3) + 0.08, ry(r) + RH * rr / 2 - 0.13, 0.26, 0.26);
          t.text(s, it.h, { x: cx(3) + 0.42, y: ry(r) + 0.03, w: CW * 2 - 0.5, h: RH * rr - 0.06, fontSize: L.fit(it.h, CW * 2 - 0.5, RH * rr - 0.06, 13, 10, F.head, true), bold: true, color: C.ink, valign: 'middle' });
          cell(s, 5, r, 8, r + rr, C.bg); fitIn(s, it.t, 5, r, 8, r + rr);
        }
      },
      async (d) => { // a coloured row head beside each range, two by two
        const s = page(d), n = d.items.length;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, c0 = i % 2 ? 4.1 : 0, c2 = wide ? COLS : c0 + 3.9, r0 = i < 2 ? 2 : 7.75, r1 = r0 + 5.25, c1 = c0 + 1.3;
          cell(s, c0, r0, c1, r1, C.fills[(i + 1) % 6]);
          t.img(s, await L.icon(it.icon, C.ink, 2), cx(c0) + 0.09, ry(r0) + 0.1, 0.36, 0.36);
          fitIn(s, it.h, c0, r0 + 1.8, c1, r1, { bold: true, fontFace: F.head, max: 12, valign: 'top' });
          cell(s, c1, r0, c2, r1, C.bg); fitIn(s, it.t, c1, r0, c2, r1, { max: 13 });
        }
      },
      async (d) => { // cells with a red corner mark, each opening its comment
        const s = page(d), n = d.items.length, w = 3.1, h = 1.3;
        const pos = n === 4 ? [[0, 2.3], [0, 7.6], [4, 3.4], [4, 8.7]] : [[0, 2.3], [0, 7.6], [4, 5.2]];
        for (const [i, it] of d.items.entries()) {
          const [c, r] = pos[i], x = cx(c + 1) + 0.12, y = ry(r);
          cell(s, c, r, c + 1, r + 1.6, C.fills[i % 6]); tick(s, c + 1, r);
          t.img(s, await L.icon(it.icon, C.ink, 2), cx(c) + CW / 2 - 0.15, ry(r) + 0.09, 0.3, 0.3);
          sticky(s, x, y, w, h);
          t.text(s, it.h, { x: x + 0.1, y: y + 0.04, w: w - 0.2, h: 0.28, fontSize: L.fit(it.h, w - 0.2, 0.28, 12, 10, F.head, true), bold: true, color: C.ink, valign: 'middle' });
          t.text(s, it.t, { x: x + 0.1, y: y + 0.33, w: w - 0.2, h: h - 0.38, fontSize: L.fit(it.t, w - 0.2, h - 0.38, 12, 10, F.body), color: C.ink });
        }
      },
      async (d) => { // dark mode: a frozen top row, the rest under it
        const s = darkPage(d), [a, ...rest] = d.items, span = COLS / rest.length;
        dark(s, 0, 2, COLS, 6.2, D.cell, { sel: true }); handle(s, COLS, 6.2);
        t.img(s, await L.icon(a.icon, D.sel, 2), cx(0) + 0.16, ry(2) + 0.3, 0.66, 0.66);
        t.text(s, a.h, { x: cx(0) + 1.0, y: ry(2) + 0.06, w: 7.6, h: 0.36, fontSize: 16, bold: true, color: D.ink, valign: 'middle' });
        t.text(s, a.t, { x: cx(0) + 1.0, y: ry(2) + 0.44, w: 7.6, h: 0.76, fontSize: L.fit(a.t, 7.6, 0.76, 14, 10, F.body), color: D.dim });
        for (const [i, it] of rest.entries()) {
          const c0 = i * span, c1 = c0 + span, x = cx(c0) + 0.1, w = cx(c1) - cx(c0) - 0.2;
          dark(s, c0, 6.2, c1, 13, D.bg);
          t.img(s, await L.icon(it.icon, D.sel, 2), x, ry(6.2) + 0.09, 0.3, 0.3);
          t.text(s, it.h, { x: x + 0.38, y: ry(6.2) + 0.05, w: w - 0.38, h: 0.38, fontSize: L.fit(it.h, w - 0.38, 0.38, 13, 10, F.head, true), bold: true, color: D.ink, valign: 'middle' });
          t.text(s, it.t, { x, y: ry(6.2) + 0.5, w, h: RH * 6.8 - 0.56, fontSize: L.fit(it.t, w, RH * 6.8 - 0.56, 13, 10, F.body), color: D.dim });
        }
      },
    ],
    process: [
      async (d) => { // a row of cells, trace arrows between them, each with its comment hanging lower
        const s = page(d), n = d.steps.length, span = COLS / n;
        for (const [i, st] of d.steps.entries()) {
          const c0 = i * span, c1 = c0 + span, x = cx(c0) + 0.1, w = cx(c1) - cx(c0) - 0.2, y = ry(4.4) + (i % 2) * 0.42, h = 2.15;
          cell(s, c0, 2, c1, 4, C.fills[i % 6], { sel: i === 0 });
          fitIn(s, `${i + 1}  ${st.h}`, c0, 2, c1, 4, { bold: true, fontFace: F.head, max: 13 });
          t.line(s, x + w / 2, ry(4), 0, y - ry(4), C.blue, 1.25, { dash: 'dash' });
          sticky(s, x, y, w, h);
          t.text(s, st.t, { x: x + 0.1, y: y + 0.06, w: w - 0.2, h: h - 0.12, fontSize: L.fit(st.t, w - 0.2, h - 0.12, 13, 10, F.body), color: C.ink, valign: 'middle' });
          if (i < n - 1) tracer(s, cx(c1) - 0.22, ry(4) + 0.08, 0.44, 0);
        }
      },
      async (d) => { // a waterfall of ranges, each starting further right, a trace arrow to the next
        const s = page(d), n = d.steps.length, rr = 11 / n, step = 3 / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const c0 = i * step, c1 = c0 + 5, r = 2 + i * rr, y = ry(r), h = RH * rr;
          cell(s, c0, r, c0 + 0.5, r + rr, C.fills[i % 6]);
          inCell(s, String(i + 1), c0, r, c0 + 0.5, r + rr, { bold: true, align: 'center', fontSize: 15, h: h - 0.06 });
          cell(s, c0 + 0.5, r, c1, r + rr, C.bg, { sel: i === n - 1 });
          t.text(s, st.h, { x: cx(c0 + 0.5) + 0.08, y: y + 0.03, w: CW * 4.5 - 0.16, h: 0.26, fontSize: 12, bold: true, color: C.ink, valign: 'middle' });
          t.text(s, st.t, { x: cx(c0 + 0.5) + 0.08, y: y + 0.29, w: CW * 4.5 - 0.16, h: h - 0.32, fontSize: L.fit(st.t, CW * 4.5 - 0.16, h - 0.32, 12, 10, F.body), color: C.muted });
          if (i < n - 1) { t.line(s, cx(c1), y + h / 2, CW * step - 0.25, 0, C.blue, 1.75); tracer(s, cx(c1) + CW * step - 0.25, y + h / 2, 0, h / 2); }
        }
        handle(s, 3 + 5, 13);
      },
      async (d) => { // dark mode: numbered cells down a middle column, steps out to both sides
        const s = darkPage(d), n = d.steps.length, hr = 4, dr = (11 - hr) / (n - 1);
        t.rect(s, cx(4) - 0.03, ry(2), 0.06, RH * 11, D.line, { name: 'Spine' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, r = 2 + i * dr, c0 = right ? 4.5 : 0, c1 = right ? 8 : 3.5, x = cx(c0) + 0.1, w = cx(c1) - cx(c0) - 0.2, y = ry(r);
          t.line(s, right ? cx(4) : cx(3.5), y + 0.24, CW * 0.5, 0, D.sel, 1.5);
          dark(s, c0, r, c1, r + hr, D.cell, { sel: i === n - 1 });
          dark(s, 3.6, r, 4.4, r + 1.6, D.sel);
          t.text(s, String(i + 1), { x: cx(3.6), y, w: CW * 0.8, h: RH * 1.6, bold: true, fontSize: 16, color: D.bg, align: 'center', valign: 'middle' });
          t.text(s, st.h, { x, y: y + 0.05, w, h: 0.3, fontSize: 13, bold: true, color: D.ink, valign: 'middle' });
          t.text(s, st.t, { x, y: y + 0.36, w, h: RH * hr - 0.42, fontSize: L.fit(st.t, w, RH * hr - 0.42, 13, 10, F.body), color: D.dim });
        }
      },
      async (d) => { // the path doubles back: across the top row, then back along the bottom
        const s = page(d), n = d.steps.length, pos = [[0, 2], [4.4, 2], [4.4, 8], [0, 8]];
        for (const [i, st] of d.steps.entries()) {
          const [c0, r0] = pos[i], c1 = c0 + 3.6, f = C.fills[(i + 2) % 6];
          cell(s, c0, r0, c1, r0 + 1.5, f);
          fitIn(s, `${i + 1}  ${st.h}`, c0, r0, c1, r0 + 1.5, { bold: true, fontFace: F.head, max: 14 });
          cell(s, c0, r0 + 1.5, c1, r0 + 5, C.bg); fitIn(s, st.t, c0, r0 + 1.5, c1, r0 + 5, { color: C.muted });
        }
        tracer(s, cx(3.6) + 0.04, ry(4.5), CW * 0.8 - 0.08, 0);
        if (n > 2) tracer(s, cx(6.2), ry(7) + 0.03, 0, RH - 0.06);
        if (n > 3) tracer(s, cx(3.6) + 0.04, ry(10.5), CW * 0.8 - 0.08, 0, { flipH: true });
      },
    ],
    stats: [
      async (d) => { // one selected cell holds the big number
        const s = page(d), [a, ...rest] = d.stats, hr = d.note ? 3.2 : 5.5;
        cell(s, 0, 2, 5, 13, C.fills[2], { sel: true }); handle(s, 5, 13);
        inCell(s, a.value, 0, 2, 5, 9, { bold: true, align: 'right', fontSize: L.fit(a.value, 5.2, 1.9, 72, 28, F.head, true) });
        fitIn(s, a.label, 0, 9, 5, 13, { align: 'right', max: 15, color: C.ink, valign: 'top' });
        rest.forEach((x, i) => {
          const r = 2 + i * hr;
          cell(s, 5, r, 8, r + hr * 0.58, C.fills[i ? 3 : 1]);
          inCell(s, x.value, 5, r, 8, r + hr * 0.58, { bold: true, align: 'right', fontSize: L.fit(x.value, 3.1, RH * hr * 0.58 - 0.08, 30, 14, F.head, true) });
          cell(s, 5, r + hr * 0.58, 8, r + hr, C.bg); fitIn(s, x.label, 5, r + hr * 0.58, 8, r + hr, { align: 'right', color: C.muted, max: 12 });
        });
        if (d.note) { const y = ry(8.4) + 0.05, h = ry(13) - y; sticky(s, cx(5) + 0.08, y, CW * 3 - 0.16, h); t.text(s, d.note, { x: cx(5) + 0.18, y: y + 0.05, w: CW * 3 - 0.36, h: h - 0.1, fontSize: L.fit(d.note, CW * 3 - 0.36, h - 0.1, 12, 10, F.body), color: C.ink, valign: 'middle' }); }
      },
      async (d) => { // dark mode: a ledger, labels left, figures right, the note under a double rule
        const s = darkPage(d), hr = d.note ? 2.6 : 3.6;
        d.stats.forEach((x, i) => {
          const r = 2 + i * hr;
          dark(s, 0, r, 5, r + hr, D.bg); fitIn(s, x.label, 0, r, 5, r + hr, { color: D.ink, max: 14 });
          dark(s, 5, r, 8, r + hr, D.cell, { sel: i === 0 });
          inCell(s, x.value, 5, r, 8, r + hr, { bold: true, align: 'right', color: i === 0 ? D.sel : D.ink, fontSize: L.fit(x.value, 3.1, RH * hr - 0.1, 30, 14, F.head, true) });
        });
        if (d.note) {
          const y = ry(9.8) + 0.04; t.line(s, cx(0), y, CW * 8, 0, D.ink, 1); t.line(s, cx(0), y + 0.04, CW * 8, 0, D.ink, 1);
          t.text(s, d.note, { x: cx(0) + 0.08, y: y + 0.08, w: CW * 8 - 0.16, h: ry(13) - y - 0.1, fontSize: L.fit(d.note, CW * 8 - 0.16, ry(13) - y - 0.1, 13, 10, F.body), color: D.dim, valign: 'middle' });
        }
      },
    ],
    compare: [
      async (d) => { // a mirrored table: row numbers in the middle, each side reads away from them
        const s = page(d), n = Math.max(d.left.items.length, d.right.items.length), rr = 9.5 / n;
        cell(s, 0, 2, 3.5, 3.5, C.fills[3]); fitIn(s, d.left.h, 0, 2, 3.5, 3.5, { bold: true, fontFace: F.head, align: 'right', max: 14 });
        cell(s, 4.5, 2, 8, 3.5, C.fills[1]); fitIn(s, d.right.h, 4.5, 2, 8, 3.5, { bold: true, fontFace: F.head, max: 14 });
        cell(s, 3.5, 2, 4.5, 3.5, C.head);
        for (let k = 0; k < n; k++) {
          const r = 3.5 + k * rr;
          cell(s, 3.5, r, 4.5, r + rr, C.head); inCell(s, String(k + 1), 3.5, r, 4.5, r + rr, { bold: true, align: 'center', color: C.muted, fontSize: 15 });
          cell(s, 0, r, 3.5, r + rr, C.bg); if (d.left.items[k]) fitIn(s, d.left.items[k], 0, r, 3.5, r + rr, { align: 'right', max: 13 });
          cell(s, 4.5, r, 8, r + rr, C.bg); if (d.right.items[k]) fitIn(s, d.right.items[k], 4.5, r, 8, r + rr, { max: 13 });
        }
      },
      async (d) => { // two tables, one on top of the other, each a row of cells
        const s = page(d);
        for (const [i, side] of [d.left, d.right].entries()) {
          const r0 = 2 + i * 5.75, r1 = r0 + 5.25, span = 6 / side.items.length, f = i ? C.fills[5] : C.fills[4];
          cell(s, 0, r0, 2, r1, f, { sel: i === 0 });
          fitIn(s, side.h, 0, r0, 2, r1, { bold: true, fontFace: F.head, align: 'center', max: 15 });
          side.items.forEach((it, k) => { cell(s, 2 + k * span, r0, 2 + (k + 1) * span, r1, C.bg); fitIn(s, it, 2 + k * span, r0, 2 + (k + 1) * span, r1, { max: 13 }); });
        }
      },
    ],
    statement: [
      async (d) => { // dark mode: the sentence typed into the formula, one selected range
        const s = darkPage(d), r1 = d.caption ? 9.4 : 13;
        dark(s, 0, 2, 1, r1, D.cell);
        t.text(s, '=', { x: cx(0), y: ry(2), w: CW, h: ry(r1) - ry(2), fontSize: 60, bold: true, color: D.sel, align: 'center', valign: 'middle' });
        dark(s, 1, 2, COLS, r1, D.bg, { sel: true }); handle(s, COLS, r1);
        t.text(s, L.runs(d.text), { x: cx(1) + 0.15, y: ry(2) + 0.06, w: CW * 7 - 0.3, h: ry(r1) - ry(2) - 0.12, bold: true, color: D.ink, valign: 'middle', fontSize: L.fit(d.text, CW * 7 - 0.3, ry(r1) - ry(2) - 0.12, 34, 18, F.head, true) });
        if (d.caption) { dark(s, 1, r1, COLS, 13, D.cell); fitIn(s, d.caption, 1, r1, COLS, 13, { color: D.dim, max: 13 }); }
      },
      async (d) => { // the long comment stands first, the sentence fills the range it points to
        const s = page(d), c0 = d.caption ? 3 : 0;
        if (d.caption) { const x = cx(0) + 0.08, y = ry(2.4), w = CW * 3 - 0.3, h = ry(12.6) - y; sticky(s, x, y, w, h); t.text(s, d.caption, { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: h - 0.16, fontSize: L.fit(d.caption, w - 0.24, h - 0.16, 14, 10, F.body), color: C.ink, valign: 'middle' }); tracer(s, x + w, ry(7.5), cx(3) - x - w, 0); }
        cell(s, c0, 2, COLS, 13, C.fills[5], { sel: true }); handle(s, COLS, 13);
        inCell(s, L.runs(d.text), c0, 2, COLS, 13, { bold: true, align: 'center', fontSize: L.fit(d.text, CW * (COLS - c0) - 0.2, 3.1, 32, 16, F.head, true) });
      },
    ],
    timeline: [
      async (d) => { // a year planner: years as column heads, entries in two lanes under them
        const s = page(d), span = 2;
        for (const [i, it] of d.items.entries()) {
          const c0 = i * span, c1 = c0 + span, r0 = 3.5 + (i % 2) * 4.75;
          cell(s, c0, 2, c1, 3.5, C.fills[i % 6]);
          fitIn(s, it.year, c0, 2, c1, 3.5, { bold: true, fontFace: F.head, align: 'center', max: 15 });
          t.line(s, cx(c0) + CW, ry(3.5), 0, ry(r0) - ry(3.5), C.blue, 1.25, { dash: 'dash' });
          cell(s, c0, r0, c1, r0 + 4.75, C.bg, { sel: i === 3 });
          t.text(s, it.h, { x: cx(c0) + 0.08, y: ry(r0) + 0.03, w: CW * 2 - 0.16, h: 0.28, fontSize: L.fit(it.h, CW * 2 - 0.16, 0.28, 12, 10, F.head, true), bold: true, color: C.ink, valign: 'middle' });
          t.text(s, it.t, { x: cx(c0) + 0.08, y: ry(r0) + 0.32, w: CW * 2 - 0.16, h: RH * 4.75 - 0.36, fontSize: L.fit(it.t, CW * 2 - 0.16, RH * 4.75 - 0.36, 11, 10, F.body), color: C.muted });
        }
      },
      async (d) => { // ranges climbing the sheet from lower left to upper right
        const s = page(d);
        for (const [i, it] of d.items.entries()) {
          const c0 = i * 2, c1 = c0 + 2, r0 = 6.9 - i * 1.63, x = cx(c0) + 0.08, w = CW * 2 - 0.16;
          cell(s, c0, r0, c1, r0 + 1.5, C.fills[(i + 3) % 6], { sel: i === 3 });
          fitIn(s, it.year, c0, r0, c1, r0 + 1.5, { bold: true, fontFace: F.head, max: 15, align: 'center' });
          cell(s, c0, r0 + 1.5, c1, r0 + 6.1, C.bg);
          t.text(s, it.h, { x, y: ry(r0 + 1.5) + 0.03, w, h: 0.28, fontSize: L.fit(it.h, w, 0.28, 12, 10, F.head, true), bold: true, color: C.ink, valign: 'middle' });
          t.text(s, it.t, { x, y: ry(r0 + 1.5) + 0.32, w, h: RH * 4.6 - 0.36, fontSize: L.fit(it.t, w, RH * 4.6 - 0.36, 11, 10, F.body), color: C.muted });
        }
        handle(s, COLS, 3.51);
      },
    ],
  };
  R.process = V.process.shift(); // the old process columns looked like the cards columns
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Jadval', colors: { dk1: C.ink, lt1: C.bg, dk2: '3C4043', lt2: C.head, accent1: C.green, accent2: C.blue, accent3: 'F9AB00', accent4: 'D93025', accent5: C.muted, accent6: C.grid, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "hisobot va tahlil uslubi: aniq ko'rsatkichlar, qisqa xulosalar, jadvaldek tartibli", limits: {}, prefer: 'data' };
module.exports = { id: 58, slug: 'jadval', name: 'Jadval', category: 'business', photos: true, build, style: STYLE };
