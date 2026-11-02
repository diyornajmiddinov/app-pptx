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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Jadval', colors: { dk1: C.ink, lt1: C.bg, dk2: '3C4043', lt2: C.head, accent1: C.green, accent2: C.blue, accent3: 'F9AB00', accent4: 'D93025', accent5: C.muted, accent6: C.grid, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "hisobot va tahlil uslubi: aniq ko'rsatkichlar, qisqa xulosalar, jadvaldek tartibli", limits: {}, prefer: 'data' };
module.exports = { id: 58, slug: 'jadval', name: 'Jadval', category: 'business', photos: true, build, style: STYLE };
