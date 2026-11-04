/**
 * 47 Chipta — boarding pass: tickets with notches, perforation and barcode stub,
 * labelled fields, an airport departures board for the agenda and timeline.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'E6ECF2', ticket: 'FFFFFF', navy: '0F2747', orange: 'FF6B35', gray: '7D8A99', line: 'D3DBE4', board: '101720', boardRow: '1A2430', amber: 'FFC93C', text: 'E9EEF5' };
const F = { head: 'Arial', body: 'Calibri', mono: 'Courier New' };

const barcode = (w, h, seed) => { let x = seed, bars = '', px = 0; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  while (px < w) { const bw = 2 + Math.floor(rnd() * 4) * 2; if (rnd() > 0.35) bars += `<rect x="${px}" y="0" width="${bw}" height="${h}" fill="#${C.navy}"/>`; px += bw + 2; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${bars}</svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {}; const bc = async (k) => (memo['b' + k] ??= await L.svg(barcode(600, 120, 7 + k), 600, 120));
  // ticket body with a stub on the right (stub = 0 for none) and a dashed vertical tear line
  const ticket = (s, x, y, w, h, stub = 0) => {
    t.rect(s, x, y, w, h, C.ticket, { r: 0.12, shadow: 0.18, blur: 10, offset: 3, name: 'Ticket' });
    if (stub) {
      const sx = x + w - stub;
      t.oval(s, sx - 0.14, y - 0.14, 0.28, 0.28, C.bg); t.oval(s, sx - 0.14, y + h - 0.14, 0.28, 0.28, C.bg);
      t.line(s, sx, y + 0.2, 0, h - 0.4, C.line, 1.5, { dash: 'dash' });
    }
  };
  const field = (s, label, value, x, y, w, size = 15, color = C.navy) => {
    t.text(s, label.toUpperCase(), { x, y, w, h: 0.22, fontSize: 8, bold: true, color: C.gray, charSpacing: 1.5 });
    t.text(s, value, { x, y: y + 0.22, w, h: size / 40 + 0.05, fontSize: L.fit(String(value || ' '), w, size / 40 + 0.05, size, 9, F.head, true), bold: true, color, valign: 'top' });
  };
  const board = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.board, { r: 0.08, name: 'Departures board' });
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2708   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: C.gray });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.rect(s, 0, 0, W, 0.12, C.navy, { name: 'Top band' }); t.rect(s, 0, 0.12, W, 0.04, C.orange, { name: 'Top band' });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.4, w: 7.3, h: 0.65, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(d.title, 7.3, 0.65, 28, 16, F.head, true) });
    field(s, TR.slide_l, L.pad2(idx), 8.35, 0.38, 1.1, 20, C.orange);
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.navy, lineSpacingMultiple: 1.3, valign: 'middle' });
  // vertical barcode centred at (cx, cy): rotation turns around the box centre, so place the unrotated box there
  const vbar = async (s, k, cx, cy, len, thick) => s.addImage({ data: await bc(k), x: cx - len / 2, y: cy - thick / 2, w: len, h: thick, rotate: 90, altText: '' });
  const photoTicket = async (s, src, x, y, w, h, k) => {
    ticket(s, x, y, w, h, 1.0);
    t.img(s, await L.photo(L.src(src), w - 1.3, h - 0.3, { mask: { r: 0.06 } }), x + 0.15, y + 0.15, w - 1.3, h - 0.3, { alt: '' });
    await vbar(s, k, x + w - 0.5, y + h / 2, h - 0.7, 0.55);
  };

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    ticket(s, 0.45, 0.5, 9.1, 4.5, 2.65);
    t.rect(s, 0.45, 0.5, 6.45, 0.55, C.navy, { r: 0.12, name: 'Ticket header' }); t.rect(s, 0.45, 0.8, 6.45, 0.25, C.navy, { name: 'Ticket header' });
    t.text(s, 'BOARDING PASS', { x: 0.75, y: 0.5, w: 4, h: 0.55, fontSize: 13, bold: true, color: 'FFFFFF', valign: 'middle', charSpacing: 3 });
    t.text(s, '\u2708', { x: 6.3, y: 0.5, w: 0.5, h: 0.55, fontSize: 18, color: C.orange, valign: 'middle' });
    t.text(s, d.title, { x: 0.75, y: 1.2, w: 5.9, h: 1.65, bold: true, fontSize: L.fit(d.title, 5.9, 1.6, 36, 18, F.head, true), color: C.navy, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.75, y: 2.85, w: 5.9, h: 0.65, fontSize: 13, color: C.gray });
    field(s, TR.author_l, M.author || '\u2014', 0.75, 3.6, 3.0, 16);
    field(s, TR.org_l, M.org || '\u2014', 3.85, 3.6, 2.9, 16);
    field(s, TR.city_l, M.loc || '\u2014', 0.75, 4.25, 3.0, 16);
    field(s, TR.year_l, M.year || '\u2014', 3.85, 4.25, 2.9, 16, C.orange);
    if (d.image) t.img(s, await L.photo(L.src(d.image), 2.25, 2.0, { mask: { r: 0.06 } }), 7.1, 0.75, 2.25, 2.0, { alt: '' });
    t.img(s, await bc(1), 7.1, 3.0, 2.25, 0.75);
    field(s, TR.slide_l, String(content.slides.length), 7.1, 3.95, 1.0, 16);
    field(s, TR.no, kind === 'cover' ? '001' : String(idx).padStart(3, '0'), 8.25, 3.95, 1.1, 16, C.orange);
    footer(s);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = page(d); await photoTicket(s, d.image, 0.6, 1.4, 4.6, 3.5, 2); para(s, d.text, 5.55, 1.4, 3.85, 3.5); },
    async image(d) { const s = page(d); para(s, d.text, 0.6, 1.4, 3.9, 3.5); await photoTicket(s, d.image, 4.8, 1.4, 4.6, 3.5, 3); },
    async agenda(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.55, 3.3 / n);
      board(s, 0.6, 1.35, 8.8, rh * n + 0.35);
      d.items.forEach((it, i) => {
        const y = 1.5 + i * rh;
        t.rect(s, 0.75, y + 0.03, 8.5, rh - 0.06, C.boardRow, { name: 'Row' });
        t.text(s, L.pad2(i + 1), { x: 0.9, y, w: 0.7, h: rh, fontFace: F.mono, fontSize: 18, bold: true, color: C.amber, valign: 'middle' });
        t.text(s, it.toUpperCase(), { x: 1.7, y, w: 6.4, h: rh, fontFace: F.mono, fontSize: L.fit(it.toUpperCase(), 6.4, rh, 16, 10, F.mono, true), bold: true, color: C.text, valign: 'middle' });
        t.text(s, `${TR.slide_l.toUpperCase()} ${L.pad2(i + 3)}`, { x: 7.9, y, w: 1.25, h: rh, fontFace: F.mono, fontSize: 10, bold: true, color: C.amber, align: 'right', valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.5, 1.55 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.4);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), col = i % 2 ? C.orange : C.navy;
        t.rect(s, x, 1.4, w, h, C.ticket, { r: 0.1, shadow: 0.15, blur: 8, offset: 2, name: 'Ticket' });
        t.rect(s, x, 1.4, w, 0.7, col, { r: 0.1, name: 'Band' }); t.rect(s, x, 1.8, w, 0.3, col, { name: 'Band' });
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.2, 1.55, 0.4, 0.4);
        t.text(s, L.pad2(i + 1), { x: x + w - 0.8, y: 1.45, w: 0.6, h: 0.6, fontFace: F.mono, fontSize: 16, bold: true, color: 'FFFFFF', align: 'right', valign: 'middle' });
        t.oval(s, x - 0.12, 2.18, 0.24, 0.24, C.bg); t.oval(s, x + w - 0.12, 2.18, 0.24, 0.24, C.bg);
        t.line(s, x + 0.2, 2.3, w - 0.4, 0, C.line, 1.25, { dash: 'dash' });
        t.text(s, it.h, { x: x + 0.2, y: 2.45, w: w - 0.4, h: 0.45, fontSize: L.fit(it.h, w - 0.4, 0.45, 17, 12, F.head, true), bold: true, color: C.navy });
        t.text(s, it.t, { x: x + 0.2, y: 2.9, w: w - 0.4, h: h - 1.55, fontSize: 14, color: C.gray });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      const arc = `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="100"><path d="M40,80 Q440,-40 840,80" fill="none" stroke="#${C.gray}" stroke-width="3" stroke-dasharray="4 10" stroke-linecap="round"/></svg>`;
      t.img(s, await L.svg(arc, 880, 100), 0.6, 1.3, 8.8, 1.0);
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw, cx = x + cw / 2 - 0.3;
        t.oval(s, cx, 1.9, 0.6, 0.6, i === n - 1 ? C.orange : C.navy);
        t.text(s, String(i + 1), { x: cx, y: 1.9, w: 0.6, h: 0.6, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, st.h, { x: x + 0.1, y: 2.7, w: cw - 0.2, h: 0.45, fontSize: L.fit(st.h, cw - 0.2, 0.45, 16, 11, F.head, true), bold: true, color: C.navy, align: 'center' });
        t.text(s, st.t, { x: x + 0.1, y: 3.15, w: cw - 0.2, h: 1.85, fontSize: L.fit(st.t, cw - 0.2, 1.85, 14, 10, F.body), color: C.gray, align: 'center' });
      });
      t.text(s, '\u2708', { x: 4.75, y: 1.15, w: 0.5, h: 0.45, fontSize: 22, color: C.orange, align: 'center' });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * (w + gap);
        ticket(s, px, 1.45, w, 2.7);
        t.text(s, x.value, { x: px + 0.2, y: 1.6, w: w - 0.4, h: 1.2, fontSize: L.fit(x.value, w - 0.4, 1.1, 52, 22, F.head, true), bold: true, color: i % 2 ? C.orange : C.navy, valign: 'middle' });
        t.line(s, px + 0.2, 2.9, w - 0.4, 0, C.line, 1.25, { dash: 'dash' });
        t.text(s, x.label, { x: px + 0.2, y: 3.0, w: w - 0.4, h: 1.05, fontSize: 14, color: C.gray });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.4, w: 8.8, h: 0.5, fontSize: 10, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 4.1;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.6, F.body, 0.2, 4.85 - 2.45);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.6);
        ticket(s, x, 1.4, w, 3.5);
        field(s, i ? 'TO' : 'FROM', side.h, x + 0.25, 1.55, w - 0.5, 20, i ? C.orange : C.navy);
        t.line(s, x + 0.25, 2.3, w - 0.5, 0, C.line, 1.25, { dash: 'dash' });
        let y = 2.45;
        side.items.forEach((it, k) => { t.text(s, it, { x: x + 0.25, y, w: w - 0.45, h: rows[k], fontSize: CFS, color: C.navy, bullet: { code: '25B8' } }); y += rows[k]; });
      });
      t.text(s, '\u2708', { x: 4.7, y: 2.75, w: 0.6, h: 0.6, fontSize: 26, color: C.orange, align: 'center', valign: 'middle' });
    },
    async statement(d) {
      const s = page(d);
      ticket(s, 0.6, 1.4, 8.8, 3.3, 2.0);
      t.text(s, L.runs(d.text), { x: 0.9, y: 1.55, w: 6.2, h: 1.9, bold: true, fontSize: L.fit(d.text, 6.2, 1.8, 32, 18, F.head, true), color: C.navy, valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.9, y: 3.45, w: 6.2, h: 1.1, fontSize: L.fit(d.caption, 6.2, 1.1, 14, 10, F.body), color: C.gray });
      await vbar(s, 5, 8.4, 3.05, 2.4, 0.7);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.85, 3.4 / n);
      board(s, 0.6, 1.35, 8.8, rh * n + 0.3);
      d.items.forEach((it, i) => {
        const y = 1.5 + i * rh;
        t.rect(s, 0.75, y + 0.03, 8.5, rh - 0.06, C.boardRow, { name: 'Row' });
        t.text(s, it.year, { x: 0.9, y, w: 1.4, h: rh, fontFace: F.mono, fontSize: L.fit(it.year, 1.35, rh - 0.1, 20, 10, F.mono, true), bold: true, color: C.amber, valign: 'middle' });
        t.text(s, it.h.toUpperCase(), { x: 2.35, y, w: 2.3, h: rh, fontFace: F.mono, fontSize: L.fit(it.h.toUpperCase(), 2.3, rh - 0.1, 14, 9, F.mono, true), bold: true, color: C.text, valign: 'middle' });
        t.text(s, it.t, { x: 4.75, y, w: 4.4, h: rh, fontSize: L.fit(it.t, 4.4, rh - 0.08, 13, 9, F.body), color: 'AEB8C4', valign: 'middle' });
      });
    },
    async quote(d) {
      const s = page({});
      ticket(s, 0.9, 1.0, 8.2, 3.4, 1.6);
      t.text(s, d.text, { x: 1.2, y: 1.2, w: 5.9, h: 2.3, italic: true, bold: true, fontSize: L.fit(d.text, 5.9, 2.2, 28, 16, F.head, true), color: C.navy, valign: 'middle' });
      if (d.author) field(s, TR.author_l, d.author, 1.2, 3.55, 5.9, 14, C.orange);
      t.text(s, '\u201C', { x: 7.6, y: 1.5, w: 1.3, h: 1.6, fontSize: 90, bold: true, color: C.line, align: 'center' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, '\u2708', { x: 0.6, y, w: 0.4, h: rh, fontSize: 13, color: i % 2 ? C.orange : C.navy, valign: 'middle' });
        t.text(s, it, { x: 1.05, y, w: 8.35, h: rh, fontSize: L.fit(it, 8.35, rh - 0.04, 14, 10, F.body), color: C.navy, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Chipta', colors: { dk1: C.navy, lt1: 'FFFFFF', dk2: C.board, lt2: C.bg, accent1: C.orange, accent2: C.navy, accent3: C.amber, accent4: C.gray, accent5: '3B6EA8', accent6: C.line, hlink: C.orange, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "yo'lga chiqishdek aniq va tartibli: qisqa, bosqichma-bosqich, 'qayerdan-qayerga' mantig'i", limits: { agenda_item: 30, event_h: 14 }, prefer: null };
module.exports = { id: 47, slug: 'chipta', name: 'Çipta', category: 'business', photos: true, build, style: STYLE };
