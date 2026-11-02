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
      if (d.caption) t.text(s, d.caption, { x: 1.1, y: 4.1, w: 7.8, h: 1.0, fontSize: 12, color: C.muted, align: 'center' });
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
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.text(s, `R${i + 1}`, { x: 0.55, y, w: 0.6, h: rh, fontFace: F.mono, fontSize: 12, bold: true, color: C.pad, valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.25, h: rh, fontSize: 13, color: C.silk, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Plata', colors: { dk1: C.chip, lt1: C.silk, dk2: C.pcb, lt2: C.muted, accent1: C.trace, accent2: C.led[1], accent3: C.led[0], accent4: C.led[2], accent5: C.led[3], accent6: C.pad, hlink: C.led[3], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "muhandislik tili: komponentlar, ulanishlar va natija; aniq, texnik, lo'nda", limits: {}, prefer: 'data' };
module.exports = { id: 66, slug: 'plata', name: 'Plata', category: 'business', photos: true, build, style: STYLE };
