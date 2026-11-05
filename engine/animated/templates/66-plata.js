/**
 * 66 Plata — printed circuit board: green board with copper traces and vias, white
 * silkscreen labels (U1, R2…), ideas as black chips with gold pins, LED status dots.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { pcb: '0B5D3B', pcb2: '0D6B44', trace: 'C99A4A', pad: 'E0B96E', chip: '1B1B1B', silk: 'F2F2F2', led: ['FF3B30', '4CD964', 'FFCC00', '5AC8FA'], muted: 'A9CDB9' };
const F = { head: 'Arial', body: 'Arial', mono: 'Courier New' };

const boardSvg = () => { let g = '', v = '', x0 = 5; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 46; i++) { let x = Math.round(rnd() * 32) * 50, y = Math.round(rnd() * 18) * 50, d = `M${x},${y}`;
    for (let k = 0; k < 4; k++) { if (rnd() > 0.5) x += (rnd() > 0.5 ? 1 : -1) * 50 * (1 + Math.floor(rnd() * 4)); else y += (rnd() > 0.5 ? 1 : -1) * 50 * (1 + Math.floor(rnd() * 3)); d += ` L${x},${y}`; }
    g += `<path d="${d}" fill="none" stroke="#${C.trace}" stroke-width="5" stroke-opacity="0.35" stroke-linejoin="round"/>`; v += `<circle cx="${x}" cy="${y}" r="9" fill="#${C.pad}" fill-opacity="0.45"/><circle cx="${x}" cy="${y}" r="4" fill="#${C.pcb}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.pcb}"/>${g}${v}</svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(boardSvg(), 1600, 900, true);
  // chip: black body with gold pins on the left and right edges
  const chip = (s, x, y, w, h, label) => {
    const n = Math.max(2, Math.floor(h / 0.3));
    for (let k = 0; k < n; k++) { const py = y + 0.15 + (k * (h - 0.3)) / Math.max(1, n - 1) - 0.04; t.rect(s, x - 0.1, py, 0.12, 0.08, C.pad, { name: 'Pin' }); t.rect(s, x + w - 0.02, py, 0.12, 0.08, C.pad, { name: 'Pin' }); }
    t.rect(s, x, y, w, h, C.chip, { r: 0.04, shadow: 0.3, blur: 4, offset: 2, name: 'Chip' });
    t.oval(s, x + 0.1, y + 0.1, 0.1, 0.1, '3A3A3A');
    if (label) t.text(s, label, { x, y: y - 0.26, w, h: 0.24, fontFace: F.mono, fontSize: 9, bold: true, color: C.silk });
  };
  const led = (s, x, y, k) => { t.oval(s, x, y, 0.16, 0.16, C.led[k % 4], { line: { color: 'FFFFFF', width: 0.5 } }); };
  const trace = (s, x, y, w, h = 0) => t.line(s, x, y, w, h, C.trace, 3);
  const footer = (s) => { t.rect(s, 0.3, 5.22, 9.4, 0.28, C.chip, { name: 'Header strip' }); t.text(s, `${M.topic || ''}  //  ${meta}`, { x: 0.4, y: 5.22, w: 9.2, h: 0.28, fontFace: F.mono, fontSize: 8, color: C.silk, valign: 'middle' }); };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    t.text(s, `J${idx}`, { x: 0.45, y: 0.38, w: 0.7, h: 0.65, fontFace: F.mono, fontSize: 18, bold: true, color: C.silk, valign: 'middle' });
    t.rect(s, 0.45, 0.38, 0.7, 0.65, null, { line: { color: C.silk, width: 1.25 }, name: 'Silk box' });
    if (d.title) t.text(s, d.title, { x: 1.35, y: 0.38, w: 8.1, h: 0.65, bold: true, color: C.silk, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.65, 26, 15, F.head, true) });
    footer(s);
    return s;
  };
  const inChip = (s, txt, x, y, w, h, fs = 14) => t.text(s, txt, { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: h - 0.35, fontSize: L.fit(txt, w - 0.5, h - 0.35, fs, 10, F.body, false, 1.25), color: C.silk, lineSpacingMultiple: 1.25, valign: 'middle' });
  const display = async (s, src, x, y, w, h) => { chip(s, x, y, w, h, 'LCD1'); t.img(s, await L.photo(L.src(src), w - 0.3, h - 0.3), x + 0.15, y + 0.15, w - 0.3, h - 0.3, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.image) await display(s, d.image, 6.15, 0.75, 3.3, 2.8);
    chip(s, 0.6, 0.75, 5.1, 3.0, 'U1');
    t.text(s, d.title, { x: 0.85, y: 0.95, w: 4.6, h: 2.0, bold: true, fontSize: L.fit(d.title, 4.6, 1.95, 36, 18, F.head, true), color: C.silk, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 2.95, w: 4.6, h: 0.7, fontSize: 11, color: C.muted });
    t.text(s, [M.author, M.org].filter(Boolean).join('  //  '), { x: 0.6, y: 4.05, w: 5.1, h: 0.35, fontFace: F.mono, fontSize: 13, bold: true, color: C.silk });
    t.text(s, [M.loc, M.year].filter(Boolean).join('  //  '), { x: 0.6, y: 4.4, w: 5.1, h: 0.3, fontFace: F.mono, fontSize: 11, color: C.muted });
    [0, 1, 2].forEach((k) => led(s, 6.2 + k * 0.3, 3.85, k));
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await display(s, d.image, 0.6, 1.5, 3.7, 3.3); trace(s, 4.4, 3.15, 0.45); chip(s, 4.95, 1.5, 4.5, 3.3, 'U2'); inChip(s, d.text, 4.95, 1.5, 4.5, 3.3, 15); },
    async image(d) { const s = page(d); chip(s, 0.55, 1.5, 4.5, 3.3, 'U2'); inChip(s, d.text, 0.55, 1.5, 4.5, 3.3, 15); trace(s, 5.15, 3.15, 0.45); await display(s, d.image, 5.7, 1.5, 3.7, 3.3); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.5 + (i % per) * rh;
        chip(s, x, y, 0.75, rh - 0.35); t.text(s, String(i + 1), { x, y, w: 0.75, h: rh - 0.35, fontFace: F.mono, fontSize: 15, bold: true, color: C.silk, align: 'center', valign: 'middle' });
        trace(s, x + 0.85, y + (rh - 0.35) / 2, 0.3);
        t.text(s, it, { x: x + 1.25, y: y - 0.05, w: 3.0, h: rh - 0.25, fontSize: 15, bold: true, color: C.silk, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.4, w = (8.8 - gap * (n - 1)) / n;
      trace(s, 0.6, 1.62, 8.8);
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + i * (w + gap);
        t.line(s, x + w / 2, 1.62, 0, 0.33, C.trace, 3);
        chip(s, x, 1.95, w, 3.1, `U${i + 1}`);
        t.img(s, await L.icon(it.icon, C.pad, 2), x + 0.25, 2.15, 0.36, 0.36);
        led(s, x + w - 0.35, 2.25, i);
        t.text(s, it.h, { x: x + 0.25, y: 2.6, w: w - 0.5, h: 0.55, fontSize: L.fit(it.h, w - 0.5, 0.55, 15, 10, F.head, true), bold: true, color: C.pad, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.25, y: 3.15, w: w - 0.5, h: 1.8, fontSize: 12, color: C.silk });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.4, w = (8.8 - gap * (n - 1)) / n;
      d.steps.forEach((st, i) => {
        const x = 0.7 + i * (w + gap);
        chip(s, x, 1.5, w, 3.55, `U${i + 1}`);
        if (i < n - 1) trace(s, x + w + 0.1, 3.25, gap - 0.2);
        t.text(s, `0${i + 1}`, { x: x + 0.25, y: 1.65, w: 0.8, h: 0.5, fontFace: F.mono, fontSize: 20, bold: true, color: C.pad });
        led(s, x + w - 0.35, 1.8, i);
        t.text(s, st.h, { x: x + 0.25, y: 2.2, w: w - 0.5, h: 0.55, fontSize: L.fit(st.h, w - 0.5, 0.55, 15, 10, F.head, true), bold: true, color: C.silk, valign: 'middle' });
        t.text(s, st.t, { x: x + 0.25, y: 2.8, w: w - 0.5, h: 2.1, fontSize: 12, color: C.silk });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.4, w = (8.8 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.7 + i * (w + gap);
        chip(s, px, 1.5, w, 2.75, `DS${i + 1}`);
        t.rect(s, px + 0.2, 1.7, w - 0.4, 1.15, '050505', { name: 'Display' });
        t.text(s, x.value, { x: px + 0.25, y: 1.7, w: w - 0.5, h: 1.15, fontFace: F.mono, fontSize: L.fit(x.value, w - 0.6, 1.0, 46, 18, F.mono, true), bold: true, color: C.led[i % 4], align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.2, y: 2.95, w: w - 0.4, h: 1.2, fontSize: 12, color: C.silk, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.4, w: 8.8, h: 0.7, fontFace: F.mono, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.2;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13, w - 0.75, F.body, 0.18, 4.95 - 2.25);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.7 + i * (w + 0.4);
        chip(s, x, 1.5, w, 3.55, i ? 'U2' : 'U1');
        t.text(s, side.h, { x: x + 0.25, y: 1.62, w: w - 0.5, h: 0.55, fontSize: 16, bold: true, color: C.pad, valign: 'middle' });
        let y = 2.25;
        side.items.forEach((it, k) => { led(s, x + 0.28, y + 0.07, i ? 1 : 0); t.text(s, it, { x: x + 0.55, y, w: w - 0.75, h: rows[k], fontSize: fs, color: C.silk }); y += rows[k]; });
      });
      trace(s, 0.7 + w + 0.1, 3.25, 0.2);
    },
    async statement(d) {
      const s = page(d);
      chip(s, 1.1, 1.45, 7.8, 2.5, 'CPU');
      t.text(s, L.runs(d.text), { x: 1.4, y: 1.55, w: 7.2, h: 2.3, bold: true, fontSize: L.fit(d.text, 7.2, 2.2, 32, 16, F.head, true), color: C.silk, align: 'center', valign: 'middle' });
      if (d.caption) { t.rect(s, 1.1, 4.1, 7.8, 1.0, C.pcb, { t: 12, name: 'Solder mask' }); t.text(s, d.caption, { x: 1.2, y: 4.14, w: 7.6, h: 0.92, fontSize: 12, color: C.silk, align: 'center', valign: 'middle' }); }
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 9.0 / n;
      trace(s, 0.5, 2.15, 9.0);
      d.items.forEach((it, i) => {
        const x = 0.5 + i * cw;
        t.oval(s, x + 0.1, 2.0, 0.3, 0.3, C.pad); t.oval(s, x + 0.19, 2.09, 0.12, 0.12, C.pcb);
        t.text(s, it.year, { x: x + 0.5, y: 1.85, w: cw - 0.6, h: 0.6, fontFace: F.mono, fontSize: L.fit(it.year, cw - 0.65, 0.55, 20, 10, F.mono, true), bold: true, color: C.pad, valign: 'middle' });
        chip(s, x + 0.12, 2.6, cw - 0.32, 2.45);
        t.text(s, it.h, { x: x + 0.3, y: 2.7, w: cw - 0.65, h: 0.5, fontSize: 14, bold: true, color: C.silk, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.3, y: 3.2, w: cw - 0.65, h: 1.75, fontSize: 12, color: C.silk });
      });
    },
    async quote(d) {
      const s = page({});
      chip(s, 1.2, 1.1, 7.6, 3.2, 'MEM');
      t.text(s, `\u201C${d.text}\u201D`, { x: 1.5, y: 1.3, w: 7.0, h: 2.2, italic: true, bold: true, fontSize: L.fit(d.text, 7.0, 2.1, 28, 14, F.head, true), color: C.silk, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, `> ${d.author}`, { x: 1.5, y: 3.6, w: 7.0, h: 0.45, fontFace: F.mono, fontSize: 13, bold: true, color: C.pad, align: 'center' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      t.rect(s, 0.45, 1.38, 9.1, rh * n + 0.14, C.pcb, { t: 12, name: 'Solder mask' });
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.text(s, `R${i + 1}`, { x: 0.55, y, w: 0.6, h: rh, fontFace: F.mono, fontSize: 12, bold: true, color: C.pad, valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.25, h: rh, fontSize: 13, color: C.silk, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all on the circuit: a deck's pages must not look alike (L.pages)
  const INK = '12211A', BLUE = '1E4FA3', SHEET = 'F2F6F1', RAW = 'E0B96E';
  const blackBg = await L.svg(boardSvg().split('#' + C.pcb).join('#111513').split('stroke-opacity="0.35"').join('stroke-opacity="0.14"').split('fill-opacity="0.45"').join('fill-opacity="0.16"'), 1600, 900, true);
  const paperBg = await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${SHEET}"/>${Array.from({ length: 41 }, (_, k) => `<line x1="${k * 40}" y1="0" x2="${k * 40}" y2="900" stroke="#D5E0D5" stroke-width="1"/>`).join('')}${Array.from({ length: 23 }, (_, k) => `<line x1="0" y1="${k * 40}" x2="1600" y2="${k * 40}" stroke="#D5E0D5" stroke-width="1"/>`).join('')}</svg>`, 1600, 900, true);
  const blackPage = (d) => { const s = page(d); s.background = { data: blackBg }; return s; };
  const paperPage = (d) => { // the schematic sheet: same frame, dark ink on pale paper
    const s = pres.addSlide(); s.background = { data: paperBg }; idx++;
    t.text(s, `J${idx}`, { x: 0.45, y: 0.38, w: 0.7, h: 0.65, fontFace: F.mono, fontSize: 18, bold: true, color: INK, valign: 'middle' });
    t.rect(s, 0.45, 0.38, 0.7, 0.65, null, { line: { color: INK, width: 1.25 }, name: 'Silk box' });
    t.text(s, d.title, { x: 1.35, y: 0.38, w: 8.1, h: 0.65, bold: true, color: INK, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.65, 26, 15, F.head, true) });
    footer(s);
    return s;
  };
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: o.font || F.body, fontSize: L.fit(v, w, h, o.max || 12, 10, o.font || F.body), color: o.color || C.silk, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontFace: o.font || F.head, fontSize: L.fit(v, w, h, o.max || 14, 10, o.font || F.head, true), color: o.color || C.pad, align: o.align, valign: o.valign || 'middle' });
  // copper traces: right-angled runs, inches on the whole slide
  const route = async (s, list, col = C.trace, wd = 3) => t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${list.map((pts) => `<path d="M${pts.map(([a, b]) => `${Math.round(a * 100)},${Math.round(b * 100)}`).join(' L')}" fill="none" stroke="#${col}" stroke-width="${wd * 1.4}" stroke-linejoin="round" stroke-linecap="round"/>`).join('')}</svg>`, 1000, 563), 0, 0, W, H);
  const via = (s, cx, cy, r = 0.1, hole = C.pcb) => { t.oval(s, cx - r, cy - r, 2 * r, 2 * r, C.pad); t.oval(s, cx - r * 0.42, cy - r * 0.42, r * 0.84, r * 0.84, hole); };
  const copper = (s, x, y, w, h) => { t.rect(s, x, y, w, h, RAW, { r: 0.04, name: 'Copper pour' }); t.rect(s, x + 0.05, y + 0.05, w - 0.1, h - 0.1, null, { line: { color: C.trace, width: 1 }, name: 'Pour edge' }); };
  const pinsRow = (s, x, y, w) => { const n = Math.floor(w / 0.2); for (let k = 0; k < n; k++) t.rect(s, x + k * (w / n) + 0.05, y, 0.1, 0.13, C.pad, { name: 'Pin' }); };
  const block = (s, x, y, w, h, col = INK) => t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: col, width: 1.75 }, name: 'Block' });
  const V = {
    image: [
      async (d) => { // a wide display module, a header of pins, the text chip under it
        const s = page(d);
        t.rect(s, 0.6, 1.32, 8.8, 1.92, C.chip, { r: 0.04, name: 'Module' });
        t.img(s, await L.photo(L.src(d.image), 8.6, 1.72), 0.7, 1.42, 8.6, 1.72, { alt: '' });
        pinsRow(s, 0.8, 3.24, 8.4);
        chip(s, 0.6, 3.42, 8.8, 1.68);
        t.text(s, d.text, { x: 0.82, y: 3.48, w: 8.36, h: 1.56, fontSize: L.fit(d.text, 8.36, 1.56, 13, 10, F.body), color: C.silk, valign: 'middle' });
      },
      async (d) => { // the photo is the whole screen, one chip soldered on top
        const s = pres.addSlide(); s.background = { data: bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        chip(s, 5.1, 0.3, 4.5, 4.75);
        t.text(s, `J${idx}`, { x: 5.32, y: 0.42, w: 0.72, h: 0.62, fontFace: F.mono, fontSize: 16, bold: true, color: C.pad, valign: 'middle' });
        t.text(s, d.title, { x: 6.05, y: 0.42, w: 3.35, h: 0.62, bold: true, color: C.silk, valign: 'middle', fontSize: L.fit(d.title, 3.35, 0.6, 17, 11, F.head, true) });
        t.text(s, d.text, { x: 5.32, y: 1.12, w: 4.06, h: 3.82, fontSize: L.fit(d.text, 4.06, 3.82, 13, 10, F.body), color: C.silk, valign: 'middle' });
        footer(s);
      },
      async (d) => { // the black board: a round sensor with the picture in its lens
        const s = blackPage(d), dia = 3.2, x = 6.0, y = 1.45;
        await route(s, [[[5.55, 2.1], [5.1, 2.1], [5.1, 1.5]], [[5.55, 3.05], [5.1, 3.05]], [[5.55, 4.0], [5.1, 4.0], [5.1, 4.8]]]);
        t.oval(s, x - 0.16, y - 0.16, dia + 0.32, dia + 0.32, C.chip, { line: { color: C.pad, width: 4 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
        t.text(s, d.text, { x: 0.55, y: 1.35, w: 4.4, h: 3.75, fontSize: L.fit(d.text, 4.4, 3.75, 13, 10, F.body, false, 1.2), color: C.silk, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // a plate of bare copper carries the words, the picture in its socket
        const s = page(d);
        copper(s, 0.55, 1.35, 5.3, 3.75);
        t.text(s, d.text, { x: 0.78, y: 1.47, w: 4.84, h: 3.51, fontSize: L.fit(d.text, 4.84, 3.51, 13, 10, F.body, false, 1.1), color: C.chip, lineSpacingMultiple: 1.1, valign: 'middle' });
        chip(s, 6.15, 1.35, 3.25, 3.75, 'LCD1');
        t.img(s, await L.photo(L.src(d.image), 2.97, 3.47), 6.29, 1.49, 2.97, 3.47, { alt: '' });
      },
    ],
    cards: [
      async (d) => { // a bus down the left edge, each chip tapped off it
        const s = page(d), n = d.items.length, gap = 0.12, h = (3.74 - gap * (n - 1)) / n, x = 1.35, w = 8.05, Y = (i) => 1.36 + i * (h + gap);
        await route(s, [[[0.75, 1.3], [0.75, 5.12]], ...d.items.map((_, i) => [[0.75, Y(i) + h / 2], [x - 0.1, Y(i) + h / 2]])], C.trace, 3.5);
        for (const [i, it] of d.items.entries()) {
          const y = Y(i);
          via(s, 0.75, y + h / 2);
          chip(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.pad, 2), x + 0.26, y + h / 2 - 0.17, 0.34, 0.34);
          head(s, it.h, x + 0.72, y + 0.04, 2.3, h - 0.08);
          body(s, it.t, x + 3.1, y + 0.04, w - 3.3, h - 0.08, { valign: 'middle' });
          led(s, x + w - 0.2 - 0.02, y + 0.06, i);
        }
      },
      async (d) => { // one processor in the middle, traces fanning to the parts round it
        const s = page(d), n = d.items.length, w = 3.45, h = 1.8, cx = 5, cy = 3.2;
        const pos = n === 4 ? [[0.55, 1.32], [0.55, 3.28], [6.0, 1.32], [6.0, 3.28]] : [[0.55, 1.32], [0.55, 3.28], [6.0, 2.3]];
        await route(s, pos.map(([x, y], i) => { const my = y + h / 2, ex = x < 5 ? x + w + 0.1 : x - 0.1, ox = x < 5 ? cx - 0.4 : cx + 0.4; return [[ox, cy], [ox, my], [ex, my]]; }), C.trace, 3.5);
        chip(s, cx - 0.55, cy - 0.55, 1.1, 1.1);
        t.text(s, 'CPU', { x: cx - 0.55, y: cy - 0.55, w: 1.1, h: 1.1, fontFace: F.mono, fontSize: 15, bold: true, color: C.pad, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i];
          chip(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.pad, 2), x + 0.2, y + 0.1, 0.3, 0.3);
          head(s, it.h, x + 0.58, y + 0.05, w - 0.76, 0.4, { max: 13 });
          body(s, it.t, x + 0.2, y + 0.48, w - 0.38, h - 0.54);
        }
      },
      async (d) => { // the schematic sheet: blocks drawn in ink, two by two
        const s = paperPage(d), n = d.items.length, w = 4.4, h = 1.8;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.32 + Math.floor(i / 2) * (h + 0.14);
          block(s, x, y, ww, h);
          t.text(s, `U${i + 1}`, { x: x + 0.1, y: y + 0.08, w: 0.5, h: 0.26, fontFace: F.mono, fontSize: 11, bold: true, color: BLUE });
          t.img(s, await L.icon(it.icon, BLUE, 2), x + 0.14, y + 0.42, 0.42, 0.42);
          head(s, it.h, x + 0.72, y + 0.08, ww - 0.84, 0.42, { color: INK });
          body(s, it.t, x + 0.72, y + 0.52, ww - 0.84, h - 0.6, { color: INK });
        }
      },
      async (d) => { // the main part on a copper plate, smaller chips wired to it
        const s = page(d), [a, ...rest] = d.items, n = rest.length, gap = 0.12, h = (3.74 - gap * (n - 1)) / n, Y = (i) => 1.36 + i * (h + gap);
        await route(s, rest.map((_, i) => [[4.5, 3.2], [4.85, 3.2], [4.85, Y(i) + h / 2], [5.3, Y(i) + h / 2]]));
        copper(s, 0.55, 1.36, 3.95, 3.74);
        t.img(s, await L.icon(a.icon, C.chip, 2), 0.8, 1.56, 0.66, 0.66);
        head(s, a.h, 0.8, 2.3, 3.45, 0.56, { color: C.chip, max: 18 });
        body(s, a.t, 0.8, 2.9, 3.45, 2.05, { color: C.chip, max: 14 });
        for (const [i, it] of rest.entries()) {
          const y = Y(i);
          chip(s, 5.4, y, 4.0, h);
          t.img(s, await L.icon(it.icon, C.pad, 2), 5.58, y + 0.08, 0.28, 0.28);
          head(s, it.h, 5.94, y + 0.03, 3.3, 0.36, { max: 13 });
          body(s, it.t, 5.58, y + 0.4, 3.66, h - 0.46);
        }
      },
    ],
    process: [
      async (d) => { // signal steps down the board from chip to chip
        const s = page(d), n = d.steps.length, cw = 8.9 / n, w = cw - 0.3, h = 2.0, dy = (3.74 - h) / (n - 1), X = (i) => 0.65 + i * cw, Y = (i) => 1.36 + i * dy;
        await route(s, d.steps.slice(1).map((_, i) => [[X(i) + w + 0.1, Y(i) + 0.3], [X(i + 1) + w / 2, Y(i) + 0.3], [X(i + 1) + w / 2, Y(i + 1)]]));
        for (const [i, st] of d.steps.entries()) {
          const x = X(i), y = Y(i);
          chip(s, x, y, w, h);
          t.text(s, L.pad2(i + 1), { x: x + 0.14, y: y + 0.08, w: 0.5, h: 0.42, fontFace: F.mono, fontSize: 17, bold: true, color: C.pad, valign: 'middle' });
          head(s, st.h, x + 0.62, y + 0.08, w - 0.7, 0.42, { color: C.silk, max: 12 });
          body(s, st.t, x + 0.14, y + 0.54, w - 0.26, h - 0.6);
        }
      },
      async (d) => { // a data bus up the middle, parts tapped off left and right
        const s = page(d), n = d.steps.length, h = 1.2, w = 3.95, dy = (3.74 - h) / (n - 1), Y = (i) => 1.36 + i * dy;
        await route(s, [[[4.92, 1.3], [4.92, 5.12]], [[5.08, 1.3], [5.08, 5.12]], ...d.steps.map((_, i) => (i % 2 ? [[5.08, Y(i) + 0.6], [5.55, Y(i) + 0.6]] : [[4.92, Y(i) + 0.6], [4.45, Y(i) + 0.6]]))], C.trace, 2.5);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.55 : 0.5, y = Y(i);
          chip(s, x, y, w, h);
          via(s, right ? 5.08 : 4.92, y + 0.6, 0.11);
          t.text(s, L.pad2(i + 1), { x: x + 0.16, y: y + 0.05, w: 0.5, h: 0.36, fontFace: F.mono, fontSize: 14, bold: true, color: C.pad, valign: 'middle' });
          head(s, st.h, x + 0.66, y + 0.05, w - 0.82, 0.36, { color: C.silk, max: 13 });
          body(s, st.t, x + 0.16, y + 0.44, w - 0.32, h - 0.5);
        }
      },
      async (d) => { // the black board: one trace winds back and forth, a part on each pass
        const s = blackPage(d), n = d.steps.length, gap = 0.2, h = (3.74 - gap * (n - 1)) / n, w = 7.7, X = (i) => 0.65 + (i % 2) * 1.0, Y = (i) => 1.36 + i * (h + gap);
        await route(s, d.steps.slice(1).map((_, i) => (i % 2 ? [[X(i) - 0.1, Y(i) + h / 2], [0.3, Y(i) + h / 2], [0.3, Y(i + 1) + h / 2], [X(i + 1) - 0.1, Y(i + 1) + h / 2]] : [[X(i) + w + 0.1, Y(i) + h / 2], [9.7, Y(i) + h / 2], [9.7, Y(i + 1) + h / 2], [X(i + 1) + w + 0.1, Y(i + 1) + h / 2]])));
        for (const [i, st] of d.steps.entries()) {
          const x = X(i), y = Y(i);
          chip(s, x, y, w, h);
          t.text(s, L.pad2(i + 1), { x: x + 0.14, y, w: 0.56, h, fontFace: F.mono, fontSize: 17, bold: true, color: C.pad, valign: 'middle' });
          head(s, st.h, x + 0.72, y + 0.04, 2.25, h - 0.08, { color: C.silk, max: 13 });
          body(s, st.t, x + 3.05, y + 0.04, w - 3.2, h - 0.08, { valign: 'middle' });
        }
      },
      async (d) => { // the schematic: a chain of amplifier triangles on one signal wire
        const s = paperPage(d), n = d.steps.length, cw = 9 / n, tw = 0.92, cy = 1.82;
        t.line(s, 0.5, cy, 9, 0, INK, 1.75);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * cw, w = cw - 0.22;
          t.shape(s, 'ISOSCELES_TRIANGLE', { x: x + 0.15, y: cy - 0.46, w: tw, h: 0.92, rotate: 90, fill: { color: 'FFFFFF' }, line: { color: INK, width: 1.75 }, objectName: 'Amplifier' });
          t.text(s, String(i + 1), { x: x + 0.22, y: cy - 0.22, w: 0.5, h: 0.44, bold: true, fontFace: F.mono, fontSize: 14, color: BLUE, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.04, 2.4, w, 0.52, { color: INK, max: 13 });
          t.line(s, x + 0.04, 2.95, w, 0, BLUE, 1);
          body(s, st.t, x + 0.04, 3.02, w, 2.1, { color: INK, max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // one big display on a chip, two small ones beside it
        const s = page(d), [a, b, c] = d.stats;
        chip(s, 0.6, 1.5, 4.8, 3.55, 'DS1');
        t.rect(s, 0.78, 1.68, 4.44, 1.75, '050505', { name: 'Display' });
        t.text(s, a.value, { x: 0.85, y: 1.68, w: 4.3, h: 1.75, fontFace: F.mono, bold: true, color: C.led[1], align: 'center', valign: 'middle', fontSize: L.fit(a.value, 4.2, 1.5, 60, 22, F.mono, true) });
        body(s, a.label, 0.8, 3.52, 4.4, 1.42, { align: 'center', valign: 'middle', max: 15 });
        [b, c].forEach((x, i) => {
          const y = 1.5 + i * 1.03;
          chip(s, 5.65, y, 3.75, 0.92);
          t.rect(s, 5.72, y + 0.08, 1.7, 0.76, '050505', { name: 'Display' });
          t.text(s, x.value, { x: 5.74, y: y + 0.08, w: 1.66, h: 0.76, fontFace: F.mono, bold: true, color: C.led[i ? 2 : 3], align: 'center', valign: 'middle', fontSize: L.fit(x.value, 1.62, 0.6, 22, 11, F.mono, true) });
          body(s, x.label, 7.5, y + 0.05, 1.82, 0.82, { valign: 'middle', max: 11 });
        });
        if (d.note) { chip(s, 5.65, 3.6, 3.75, 1.45); body(s, d.note, 5.8, 3.65, 3.45, 1.35, { valign: 'middle', max: 11 }); }
      },
      async (d) => { // the schematic: three components with their values written beside them
        const s = paperPage(d), w = d.note ? 5.9 : 9;
        const zig = await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><path d="M0,25 L30,25 L45,5 L65,45 L85,5 L105,45 L125,5 L145,45 L160,25 L200,25" fill="none" stroke="#${BLUE}" stroke-width="5" stroke-linejoin="round"/></svg>`, 200, 50);
        d.stats.forEach((x, i) => {
          const y = 1.33 + i * 1.27;
          t.text(s, `R${i + 1}`, { x: 0.5, y, w: 0.6, h: 0.3, fontFace: F.mono, fontSize: 12, bold: true, color: BLUE });
          t.img(s, zig, 0.5, y + 0.34, 1.3, 0.32);
          t.text(s, x.value, { x: 1.95, y, w: 2.2, h: 1.16, bold: true, color: INK, valign: 'middle', fontFace: F.mono, fontSize: L.fit(x.value, 2.15, 1.0, 26, 14, F.mono, true) });
          body(s, x.label, 4.2, y + 0.04, w - 3.7, 1.08, { color: INK, valign: 'middle', max: 13 });
          if (i) t.line(s, 0.5, y - 0.06, w, 0, '9DB5A3', 1);
        });
        if (d.note) { block(s, 6.65, 1.33, 2.85, 3.77, BLUE); body(s, d.note, 6.8, 1.45, 2.55, 3.53, { color: INK, valign: 'middle', max: 13 }); }
      },
      async (d) => { // the black board: three great gold vias joined by a trace
        const s = blackPage(d), dia = 1.76, xs = [1.0, 4.12, 7.24], ys = [1.3, 1.6, 1.3];
        await route(s, [xs.map((x, i) => [x + dia / 2, ys[i] + dia / 2])]);
        d.stats.forEach((x, i) => {
          t.oval(s, xs[i], ys[i], dia, dia, C.pad);
          t.oval(s, xs[i] + 0.16, ys[i] + 0.16, dia - 0.32, dia - 0.32, C.chip);
          t.text(s, x.value, { x: xs[i] + 0.18, y: ys[i], w: dia - 0.36, h: dia, fontFace: F.mono, bold: true, color: C.pad, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 0.42, 0.7, 24, 11, F.mono, true) });
          body(s, x.label, xs[i] - 0.45, ys[i] + dia + 0.04, dia + 0.9, 0.6, { align: 'center', max: 12 });
        });
        if (d.note) body(s, d.note, 0.6, 4.1, 8.8, 1.02, { font: F.mono, align: 'center', valign: 'middle', max: 12 });
      },
    ],
    compare: [
      async (d) => { // a connector down the middle, each side's lines run out from its pins
        const s = page(d), w = 3.85, y0 = 2.05, avail = 3.05;
        const Ys = [d.left, d.right].map((sd) => sd.items.map((_, k) => y0 + k * (avail / sd.items.length) + avail / sd.items.length / 2));
        await route(s, [...Ys[0].map((y) => [[4.72, y], [0.6 + w + 0.1, y]]), ...Ys[1].map((y) => [[5.28, y], [9.4 - w - 0.1, y]])]);
        t.rect(s, 4.72, 1.36, 0.56, 3.74, C.chip, { name: 'Connector' });
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? 9.4 - w : 0.6, a = i ? 'left' : 'right', rh = avail / side.items.length;
          t.rect(s, x, 1.36, w, 0.58, C.chip, { name: 'Port' });
          head(s, side.h, x + 0.14, 1.36, w - 0.28, 0.58, { color: C.pad, align: a, max: 15 });
          side.items.forEach((it, k) => {
            const y = y0 + k * rh;
            chip(s, x, y + 0.03, w, rh - 0.06);
            led(s, i ? x + 0.1 : x + w - 0.26, y + rh / 2 - 0.08, i ? 1 : 0);
            body(s, it, x + (i ? 0.34 : 0.12), y + 0.05, w - 0.46, rh - 0.1, { align: a, valign: 'middle', max: 12 });
            t.oval(s, i ? 5.1 : 4.8, y + rh / 2 - 0.05, 0.1, 0.1, RAW);
          });
        }
      },
      async (d) => { // two long chips, one above the other, a cell for each pin group
        const s = page(d), h = 1.72;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.4 + i * (h + 0.26), n = side.items.length, cw = 6.5 / n;
          chip(s, 0.6, y, 8.8, h, i ? 'U2' : 'U1');
          head(s, side.h, 0.8, y + 0.1, 1.95, h - 0.2, { max: 15 });
          side.items.forEach((it, k) => {
            const x = 2.85 + k * cw;
            t.line(s, x, y + 0.14, 0, h - 0.28, C.trace, 1.5);
            body(s, it, x + 0.1, y + 0.08, cw - 0.2, h - 0.16, { valign: 'middle' });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the black board: the words in silkscreen, one gold trace under them
        const s = blackPage(d), bottom = d.caption ? 3.7 : 5.05;
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.25, w: 8.8, h: bottom - 1.35, bold: true, color: C.silk, valign: 'middle', fontSize: L.fit(d.text, 8.8, bottom - 1.45, 36, 18, F.head, true) });
        await route(s, [[[0.6, bottom + 0.02], [8.9, bottom + 0.02], [9.4, bottom + 0.3]]], C.trace, 3);
        via(s, 9.4, bottom + 0.3, 0.12, '111513');
        if (d.caption) body(s, d.caption, 0.6, 3.9, 8.5, 1.22, { font: F.mono, color: C.silk, max: 12 });
      },
      async (d) => { // a sheet of bare copper with the thought etched in, the note on a small chip
        const s = page(d), w = d.caption ? 5.9 : 8.9;
        copper(s, 0.55, 1.36, w, 3.74);
        t.text(s, L.runs(d.text), { x: 0.85, y: 1.5, w: w - 0.6, h: 3.46, bold: true, color: C.chip, valign: 'middle', fontSize: L.fit(d.text, w - 0.6, 3.36, 32, 16, F.head, true) });
        if (d.caption) { chip(s, 6.75, 1.5, 2.65, 3.6, 'U1'); body(s, d.caption, 6.88, 1.62, 2.4, 3.36, { valign: 'middle', max: 13 }); }
      },
    ],
    timeline: [
      async (d) => { // a clock line across the board, chips above and below tapped into it
        const s = page(d), cy = 3.24, w = 4.3, h = 1.62, xs = [1.2, 3.45, 5.85, 8.1];
        await route(s, [[[0.3, cy], [9.7, cy]], ...d.items.map((_, i) => (i % 2 === 0 ? [[xs[i], cy], [xs[i], cy - 0.26]] : [[xs[i], cy], [xs[i], cy + 0.26]]))], C.trace, 3.5);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = i < 2 ? 0.6 : 5.1, y = up ? cy - 0.22 - h : cy + 0.22;
          via(s, xs[i], cy);
          chip(s, x, y, w, h);
          t.text(s, it.year, { x: x + 0.2, y: y + 0.04, w: 1.8, h: 0.38, fontFace: F.mono, bold: true, color: C.pad, valign: 'middle', fontSize: L.fit(it.year, 1.76, 0.36, 15, 10, F.mono, true) });
          head(s, it.h, x + 2.04, y + 0.04, w - 2.2, 0.38, { color: C.silk, max: 12, align: 'right' });
          body(s, it.t, x + 0.2, y + 0.44, w - 0.38, h - 0.5);
        }
      },
      async (d) => { // the black board: chips climbing from the lower left, one trace linking them
        const s = blackPage(d), cw = 2.25, w = cw - 0.3, h = 2.3, X = (i) => 0.65 + i * cw, Y = (i) => 2.8 - i * 0.48;
        await route(s, d.items.slice(1).map((_, i) => [[X(i) + w + 0.1, Y(i) + 0.3], [X(i + 1) - 0.1, Y(i) + 0.3], [X(i + 1) - 0.1, Y(i + 1) + 0.3]]));
        for (const [i, it] of d.items.entries()) {
          const x = X(i), y = Y(i);
          chip(s, x, y, w, h);
          t.text(s, it.year, { x: x + 0.12, y: y + 0.08, w: w - 0.24, h: 0.36, fontFace: F.mono, bold: true, color: C.pad, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.26, 0.32, 14, 9, F.mono, true) });
          head(s, it.h, x + 0.12, y + 0.46, w - 0.24, 0.32, { color: C.silk, max: 12 });
          body(s, it.t, x + 0.12, y + 0.8, w - 0.24, h - 0.86);
        }
      },
      async (d) => { // the schematic: a timing chart, each line stepping up at its own moment
        const s = paperPage(d), y0 = 1.36, rh = 3.74 / 4, gx = 2.0, gw = 2.3;
        const lines = d.items.map((_, i) => { const y = y0 + i * rh + 0.3, up = y - 0.2, at = gx + 0.15 + i * (gw - 0.3) / 3; return [[gx, y + 0.2], [at, y + 0.2], [at, up], [gx + gw, up]]; });
        await route(s, lines, BLUE, 2);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          if (i) t.line(s, 0.5, y, 9, 0, '9DB5A3', 1, { dash: 'dash' });
          t.text(s, it.year, { x: 0.5, y, w: 1.4, h: rh, fontFace: F.mono, bold: true, color: INK, valign: 'middle', fontSize: L.fit(it.year, 1.36, 0.5, 15, 10, F.mono, true) });
          head(s, it.h, 4.5, y + 0.04, 5.0, 0.3, { color: BLUE, max: 13 });
          body(s, it.t, 4.5, y + 0.35, 5.0, rh - 0.4, { color: INK });
        }
      },
    ],
  };
  R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift(); // the old ones were the same chip columns as the cards
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Plata', colors: { dk1: C.chip, lt1: C.silk, dk2: C.pcb, lt2: C.muted, accent1: C.trace, accent2: C.led[1], accent3: C.led[0], accent4: C.led[2], accent5: C.led[3], accent6: C.pad, hlink: C.led[3], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "muhandislik tili: komponentlar, ulanishlar va natija; aniq, texnik, lo'nda", limits: {}, prefer: 'data' };
module.exports = { id: 66, slug: 'plata', name: 'Plata', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical"], "transitions": ["p14:conveyor|dir=\"l\"", "wipe:r", "p14:glitter|pattern=\"hexagon\" dir=\"l\""], "cover": ["typeLetters", "sweepIn"], "mark": "appear", "deco": "wipe:r", "sig": {"title": "sweepIn", "body": "wipe:r", "item": ["wipe:r", "wipe:d"], "image": "box", "number": "appear", "order": "alternate", "stagger": 0.1}, "tempo": 0.85, "kenburns": false};
