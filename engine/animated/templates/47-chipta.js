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
  // ---- further ways to draw a type, all on the way to the gate: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.navy, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.navy, align: o.align, valign: o.valign || 'middle' });
  const terminal = (d) => { // the dark departures hall
    const s = pres.addSlide(); s.background = { color: C.board }; idx++;
    t.rect(s, 0, 0, W, 0.12, C.amber, { name: 'Top band' }); t.rect(s, 0, 0.12, W, 0.04, C.orange, { name: 'Top band' });
    t.text(s, d.title, { x: 0.6, y: 0.4, w: 7.3, h: 0.65, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 7.3, 0.65, 28, 16, F.head, true) });
    field(s, TR.slide_l, L.pad2(idx), 8.35, 0.38, 1.1, 20, C.amber);
    t.text(s, `${M.topic || ''}   ✈   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: 'AEB8C4' });
    return s;
  };
  const GRAY = '52606F';
  const V = {
    image: [
      async (d) => { // the view through a cabin window
        const s = page(d), x = 6.15, y = 1.3, w = 3.0, h = 3.8;
        t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.8, shadow: 0.25, blur: 12, offset: 3, line: { color: C.line, width: 1.5 }, name: 'Window' });
        t.img(s, await L.photo(L.src(d.image), w - 0.5, h - 0.5, { mask: { r: 0.62 } }), x + 0.25, y + 0.25, w - 0.5, h - 0.5, { alt: '' });
        t.text(s, d.text, { x: 0.6, y: 1.35, w: 5.15, h: 3.7, fontSize: L.fit(d.text, 5.15, 3.7, 15, 10, F.body, false, 1.25), color: C.navy, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // the big screen in the departures hall, the words beside it
        const s = terminal(d);
        t.rect(s, 0.55, 1.3, 5.1, 3.78, C.boardRow, { r: 0.08, line: { color: C.amber, width: 1.5 }, name: 'Screen' });
        t.img(s, await L.photo(L.src(d.image), 4.9, 3.58, { mask: { r: 0.05 } }), 0.65, 1.4, 4.9, 3.58, { alt: '' });
        t.text(s, d.text, { x: 5.95, y: 1.3, w: 3.45, h: 3.78, fontSize: L.fit(d.text, 3.45, 3.78, 15, 10, F.body, false, 1.2), color: C.text, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the destination fills the page, the pass lies over it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        ticket(s, 0.45, 2.02, 9.1, 3.02);
        t.rect(s, 0.45, 2.02, 9.1, 0.72, C.navy, { r: 0.12, name: 'Ticket header' }); t.rect(s, 0.45, 2.4, 9.1, 0.34, C.navy, { name: 'Ticket header' });
        t.text(s, d.title, { x: 0.7, y: 2.04, w: 7.3, h: 0.68, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 7.3, 0.62, 20, 13, F.head, true) });
        t.text(s, L.pad2(idx), { x: 8.2, y: 2.04, w: 1.1, h: 0.68, bold: true, fontSize: 20, color: C.amber, align: 'right', valign: 'middle' });
        t.line(s, 7.75, 2.86, 0, 2.05, C.line, 1.5, { dash: 'dash' });
        t.text(s, d.text, { x: 0.7, y: 2.84, w: 6.85, h: 2.1, fontSize: L.fit(d.text, 6.85, 2.1, 14, 10, F.body, false, 1.15), color: C.navy, lineSpacingMultiple: 1.15, valign: 'middle' });
        await vbar(s, 6, 8.65, 3.88, 1.75, 0.8);
        t.rect(s, 0, 5.2, W, H - 5.2, C.navy, { name: 'Foot band' });
        t.text(s, `${M.topic || ''}   ✈   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.3, fontSize: 8.5, color: 'FFFFFF', valign: 'middle' });
      },
      async (d) => { // a round passport stamp pressed on the pass
        const s = page(d), dd = 3.3;
        ticket(s, 0.6, 1.42, 5.75, 3.58);
        t.text(s, d.text, { x: 0.85, y: 1.56, w: 4.0, h: 3.3, fontSize: L.fit(d.text, 4.0, 3.3, 14, 10, F.body, false, 1.2), color: C.navy, lineSpacingMultiple: 1.2, valign: 'middle' });
        t.oval(s, 5.1, 1.35, dd + 0.4, dd + 0.4, 'FFFFFF', { line: { color: C.orange, width: 3, dashType: 'dash' } });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), 5.3, 1.55, dd, dd, { alt: '' });
      },
    ],
    cards: [
      async (d) => { // a sheaf of passes, stub to the right with the icon on it
        const s = page(d), n = d.items.length, h = 3.72 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.32 + i * h, hh = h - 0.12, col = i % 2 ? C.orange : C.navy;
          ticket(s, 0.6, y, 8.8, hh, 1.35);
          head(s, it.h, 0.82, y + 0.05, 2.5, hh - 0.1, { max: 16 });
          body(s, it.t, 3.4, y + 0.05, 4.5, hh - 0.1, { valign: 'middle', color: GRAY, max: 13 });
          t.img(s, await L.icon(it.icon, col, 2), 8.2, y + hh / 2 - 0.19, 0.38, 0.38);
          t.text(s, L.pad2(i + 1), { x: 8.65, y, w: 0.65, h: hh, fontFace: F.mono, bold: true, fontSize: 15, color: col, valign: 'middle' });
        }
      },
      async (d) => { // the hall: illuminated gate signs, two by two
        const s = terminal(d), n = d.items.length, w = 4.3, h = 1.76;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.34 + Math.floor(i / 2) * (h + 0.14);
          t.rect(s, x, y, ww, h, C.boardRow, { r: 0.07, name: 'Sign' });
          t.rect(s, x, y, 0.9, h, C.amber, { r: 0.07, name: 'Sign plate' }); t.rect(s, x + 0.5, y, 0.4, h, C.amber, { name: 'Sign plate' });
          t.img(s, await L.icon(it.icon, C.board, 2.25), x + 0.24, y + 0.2, 0.42, 0.42);
          t.text(s, String.fromCharCode(65 + i), { x, y: y + 0.72, w: 0.9, h: 0.72, fontFace: F.mono, bold: true, fontSize: 28, color: C.board, align: 'center', valign: 'middle' });
          t.text(s, it.h.toUpperCase(), { x: x + 1.04, y: y + 0.08, w: ww - 1.16, h: 0.44, fontFace: F.mono, bold: true, color: C.amber, valign: 'middle', fontSize: L.fit(it.h.toUpperCase(), ww - 1.16, 0.42, 14, 9, F.mono, true) });
          body(s, it.t, x + 1.04, y + 0.56, ww - 1.16, h - 0.64, { color: C.text, max: 13 });
        }
      },
      async (d) => { // luggage tags hanging from the carousel rail, on strings of two lengths
        const s = page(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n, h = 3.2;
        t.rect(s, 0, 1.24, W, 0.1, C.navy, { name: 'Rail' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), y = 1.56 + (i % 2 ? 0.34 : 0), col = i % 2 ? C.orange : C.navy;
          t.line(s, x + w / 2, 1.3, 0, y - 1.3 + 0.2, C.gray, 1.25);
          t.rect(s, x, y, w, h, C.ticket, { r: 0.12, shadow: 0.15, blur: 8, offset: 2, line: { color: col, width: 1.5 }, name: 'Tag' });
          t.oval(s, x + w / 2 - 0.09, y + 0.11, 0.18, 0.18, C.bg, { line: { color: C.gray, width: 1 } });
          t.img(s, await L.icon(it.icon, col, 2), x + 0.16, y + 0.1, 0.34, 0.34);
          head(s, it.h, x + 0.16, y + 0.5, w - 0.32, 0.56, { max: 15 });
          body(s, it.t, x + 0.16, y + 1.08, w - 0.32, h - 1.18, { color: GRAY, max: 13 });
        }
      },
      async (d) => { // the route map: a hub airport, dashed routes to its destinations
        const s = page(d), n = d.items.length, cx = 5, cy = 3.22, dd = 1.3, w = 3.15;
        const spots = n === 3 ? [[0.6, 1.36], [0.6, 3.3], [6.25, 2.34]] : [[0.6, 1.36], [6.25, 1.36], [0.6, 3.3], [6.25, 3.3]];
        for (const [x, y] of spots) { const right = x > 5, ax = right ? x - 0.1 : x + w + 0.1, ay = y + 0.2, up = ay < cy - 0.2;
          if (Math.abs(ay - cy) < 0.2) t.line(s, cx, cy, ax - cx, 0, C.gray, 1.5, { dash: 'dash' });
          else t.line(s, Math.min(cx, ax), Math.min(cy, ay), Math.abs(ax - cx), Math.abs(ay - cy), C.gray, 1.5, { dash: 'dash', flipV: right === up }); }
        t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, C.navy, { line: { color: 'FFFFFF', width: 3 } });
        t.text(s, '✈', { x: cx - dd / 2, y: cy - dd / 2, w: dd, h: dd, fontSize: 36, color: C.amber, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], col = i % 2 ? C.orange : C.navy;
          t.rect(s, x, y, w, 1.78, C.ticket, { r: 0.1, shadow: 0.15, blur: 8, offset: 2, name: 'Stop' });
          t.oval(s, x + 0.12, y + 0.1, 0.42, 0.42, col);
          t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.22, y + 0.2, 0.22, 0.22);
          head(s, it.h, x + 0.64, y + 0.08, w - 0.76, 0.46, { max: 14 });
          body(s, it.t, x + 0.14, y + 0.58, w - 0.28, 1.14, { color: GRAY, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // the climb: each step a pass flying higher, its altitude dropped to the ground
        const s = page(d), n = d.steps.length, w = 8.8 / n, h = n === 4 ? 1.86 : 1.9, low = 3.26, high = 1.3;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * w, y = low - i * ((low - high) / (n - 1)), tw = w - 0.14;
          if (y + h < 5.05) t.line(s, x + tw / 2, y + h, 0, 5.12 - y - h, C.gray, 1.25, { dash: 'dash' });
          t.rect(s, x, y, tw, h, C.ticket, { r: 0.1, shadow: 0.15, blur: 8, offset: 2, name: 'Pass' });
          t.oval(s, x + 0.12, y + 0.1, 0.4, 0.4, i === n - 1 ? C.orange : C.navy);
          t.text(s, String(i + 1), { x: x + 0.12, y: y + 0.1, w: 0.4, h: 0.4, bold: true, fontSize: 13, color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.58, y + 0.06, tw - 0.68, 0.48, { max: 13 });
          body(s, st.t, x + 0.12, y + 0.56, tw - 0.24, h - 0.64, { color: GRAY, max: 13 });
        }
      },
      async (d) => { // a route down the page, stops on either side of it
        const s = page(d), n = d.steps.length, gap = n === 4 ? 0.9 : 1.24, h = n === 4 ? 1.1 : 1.2, w = 3.95, cx = 5;
        t.line(s, cx, 1.3, 0, 3.82, C.navy, 2, { dash: 'dash' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.32 + i * gap, x = right ? cx + 0.42 : cx - 0.42 - w, last = i === n - 1;
          t.rect(s, x, y, w, h, C.ticket, { r: 0.08, shadow: 0.12, blur: 6, offset: 2, name: 'Stop' });
          t.oval(s, cx - 0.26, y + 0.14, 0.52, 0.52, last ? C.orange : C.navy, { line: { color: C.bg, width: 3 } });
          t.text(s, String(i + 1), { x: cx - 0.26, y: y + 0.14, w: 0.52, h: 0.52, bold: true, fontSize: 14, color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.15, y + 0.04, w - 0.3, 0.36, { max: 14 });
          body(s, st.t, x + 0.15, y + 0.42, w - 0.3, h - 0.48, { color: GRAY, max: 13 });
        }
      },
      async (d) => { // the hall: amber direction signs pointing on, the words under them
        const s = terminal(d), n = d.steps.length, cw = 8.8 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * cw;
          t.shape(s, 'PENTAGON', { x, y: 1.38, w: cw - 0.05, h: 1.08, fill: { color: i % 2 ? C.orange : C.amber }, objectName: 'Sign' });
          t.text(s, L.pad2(i + 1), { x: x + 0.14, y: 1.4, w: 0.7, h: 0.36, fontFace: F.mono, bold: true, fontSize: 14, color: C.board, valign: 'middle' });
          head(s, st.h, x + 0.14, 1.74, cw - 0.62, 0.66, { color: C.board, max: 14, valign: 'top' });
          body(s, st.t, x + 0.14, 2.66, cw - 0.3, 2.46, { color: C.text, max: 14 });
        }
      },
    ],
    stats: [
      async (d) => { // the one big number has a whole pass to itself, the others small ones
        const s = page(d), [a, ...rest] = d.stats;
        ticket(s, 0.6, 1.32, 5.5, 2.9, 1.3);
        t.text(s, a.value, { x: 0.85, y: 1.48, w: 3.75, h: 1.45, bold: true, color: C.orange, valign: 'middle', fontSize: L.fit(a.value, 3.7, 1.4, 66, 28, F.head, true) });
        body(s, a.label, 0.85, 3.02, 3.75, 1.05, { color: C.navy, max: 15 });
        await vbar(s, 8, 5.45, 2.77, 2.25, 0.72);
        for (const [i, v] of rest.entries()) {
          const y = 1.32 + i * 1.5;
          t.rect(s, 6.35, y, 3.05, 1.4, C.ticket, { r: 0.1, shadow: 0.15, blur: 8, offset: 2, name: 'Pass' });
          t.text(s, v.value, { x: 6.55, y: y + 0.08, w: 2.65, h: 0.66, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(v.value, 2.6, 0.62, 34, 16, F.head, true) });
          body(s, v.label, 6.55, y + 0.76, 2.65, 0.56, { color: GRAY, max: 12 });
        }
        if (d.note) body(s, d.note, 0.6, 4.36, 8.8, 0.78, { color: GRAY, max: 12, valign: 'middle' });
      },
      async (d) => { // a split-flap board: the numbers clatter in, letter by letter
        const s = terminal(d), h = 0.84;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.34 + i * (h + 0.1), chars = [...String(v.value)], fw = Math.min(0.56, 4.2 / chars.length);
          chars.forEach((c, k) => {
            const x = 0.6 + k * fw;
            t.rect(s, x, y, fw - 0.05, h, C.boardRow, { r: 0.03, name: 'Flap' });
            t.line(s, x, y + h / 2, fw - 0.05, 0, C.board, 1);
            if (c.trim()) t.text(s, c, { x, y, w: fw - 0.05, h, fontFace: F.mono, bold: true, color: C.amber, align: 'center', valign: 'middle', fontSize: Math.round(fw * 50), noFit: true });
          });
          body(s, v.label, 5.05, y, 4.35, h, { color: C.text, max: 15, valign: 'middle' });
        }
        if (d.note) body(s, d.note, 0.6, 4.2, 8.8, 0.92, { color: 'AEB8C4', max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // departure and arrival mirrored on the runway centre line
        const s = page(d), w = 4.0, cx = 5;
        t.line(s, cx, 1.95, 0, 3.15, C.navy, 2.5, { dash: 'dash' });
        t.oval(s, cx - 0.32, 1.32, 0.64, 0.64, C.orange);
        t.text(s, '✈', { x: cx - 0.32, y: 1.32, w: 0.64, h: 0.64, fontSize: 20, color: C.navy, align: 'center', valign: 'middle' });
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.1, F.body, 0.16, 2.92);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.42 : cx - 0.42 - w, a = i ? 'left' : 'right';
          t.text(s, (i ? 'TO' : 'FROM'), { x, y: 1.3, w, h: 0.22, fontSize: 8, bold: true, color: C.gray, charSpacing: 1.5, align: a });
          head(s, side.h, x, 1.52, w, 0.46, { max: 20, align: a, color: i ? C.orange : C.navy });
          t.line(s, x, 2.02, w, 0, C.line, 1.25, { dash: 'dash' });
          let y = 2.14;
          side.items.forEach((it, j) => { t.text(s, it, { x: x + (i ? 0.1 : 0), y, w: w - 0.1, h: rows[j], fontSize: fs, color: C.navy, align: a }); y += rows[j]; });
        }
      },
      async (d) => { // two long passes, their stubs on the left carrying the names
        const s = page(d), h = 1.78;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.34 + i * (h + 0.12), col = i ? C.orange : C.navy, rh = (h - 0.2) / Math.ceil(side.items.length / 2);
          t.rect(s, 0.6, y, 8.8, h, C.ticket, { r: 0.12, shadow: 0.18, blur: 10, offset: 3, name: 'Ticket' });
          t.rect(s, 0.6, y, 2.4, h, col, { r: 0.12, name: 'Stub' }); t.rect(s, 2.6, y, 0.4, h, col, { name: 'Stub' });
          t.oval(s, 2.86, y - 0.14, 0.28, 0.28, C.bg); t.oval(s, 2.86, y + h - 0.14, 0.28, 0.28, C.bg);
          head(s, side.h, 0.8, y + 0.15, 2.0, h - 0.3, { color: i ? C.navy : 'FFFFFF', max: 18 });
          side.items.forEach((it, j) => body(s, it, 3.25 + (j % 2) * 3.1, y + 0.1 + Math.floor(j / 2) * rh, 2.95, rh - 0.05, { max: 14, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // the hall: the announcement runs in amber on the big board
        const s = terminal(d);
        board(s, 0.6, 1.32, 8.8, 2.42); t.rect(s, 0.6, 1.32, 8.8, 2.42, C.boardRow, { r: 0.08, line: { color: C.amber, width: 1.5 }, name: 'Board' });
        t.text(s, L.runs(d.text), { x: 0.9, y: 1.42, w: 8.2, h: 2.22, fontFace: F.mono, bold: true, color: C.amber, valign: 'middle', fontSize: L.fit(d.text, 8.2, 2.15, 28, 14, F.mono, true) });
        if (d.caption) body(s, d.caption, 0.6, 3.92, 8.8, 1.2, { color: C.text, max: 14 });
      },
      async (d) => { // a passport stamp beside the thought
        const s = page(d), dd = 3.15;
        t.oval(s, 0.65, 1.55, dd, dd, 'FFFFFF', { line: { color: C.orange, width: 4 } });
        t.oval(s, 0.83, 1.73, dd - 0.36, dd - 0.36, null, { line: { color: C.orange, width: 1.5, dashType: 'dash' } });
        t.text(s, '✈', { x: 0.65, y: 1.55, w: dd, h: dd, fontSize: 80, color: C.navy, align: 'center', valign: 'middle' });
        t.text(s, L.runs(d.text), { x: 4.2, y: 1.32, w: 5.2, h: 2.2, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(d.text, 5.2, 2.15, 30, 15, F.head, true) });
        t.line(s, 4.2, 3.6, 5.2, 0, C.gray, 1.25, { dash: 'dash' });
        if (d.caption) body(s, d.caption, 4.2, 3.72, 5.2, 1.4, { color: GRAY, max: 13 });
      },
    ],
    timeline: [
      async (d) => { // the flight path: years rise over the line and land under it
        const s = page(d), axis = 3.22, w = 3.65;
        t.line(s, 0, axis, W, 0, C.navy, 2.25, { dash: 'dash' });
        t.text(s, '✈', { x: 9.25, y: axis - 0.25, w: 0.5, h: 0.5, fontSize: 22, color: C.orange, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.6 + (i / 2) * 4.5 : 1.75 + ((i - 1) / 2) * 4.5, col = up ? C.navy : C.orange, top = up ? 1.34 : 3.46;
          t.oval(s, x + 0.08, axis - 0.1, 0.2, 0.2, col, { line: { color: 'FFFFFF', width: 1.5 } });
          t.text(s, it.year, { x, y: top, w: 1.6, h: 0.38, fontFace: F.mono, bold: true, color: up ? C.navy : C.orange, valign: 'middle', fontSize: L.fit(it.year, 1.55, 0.36, 18, 10, F.mono, true) });
          head(s, it.h, x + 1.65, top, w - 1.65, 0.38, { max: 13 });
          body(s, it.t, x, top + 0.4, w, 1.24, { color: GRAY, max: 13 });
        }
      },
      async (d) => { // one strip of four tear-off coupons, a barcode foot on each
        const s = page(d), y = 1.36, h = 3.72, cw = 8.8 / 4;
        t.rect(s, 0.6, y, 8.8, h, C.ticket, { r: 0.12, shadow: 0.18, blur: 10, offset: 3, name: 'Strip' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw, col = i % 2 ? C.orange : C.navy;
          if (i) { t.oval(s, x - 0.13, y - 0.13, 0.26, 0.26, C.bg); t.oval(s, x - 0.13, y + h - 0.13, 0.26, 0.26, C.bg); t.line(s, x, y + 0.2, 0, h - 0.4, C.line, 1.5, { dash: 'dash' }); }
          t.text(s, it.year, { x: x + 0.14, y: y + 0.1, w: cw - 0.28, h: 0.5, fontFace: F.mono, bold: true, color: col, valign: 'middle', fontSize: L.fit(it.year, cw - 0.32, 0.46, 22, 11, F.mono, true) });
          head(s, it.h, x + 0.14, y + 0.62, cw - 0.28, 0.44, { max: 14 });
          body(s, it.t, x + 0.14, y + 1.08, cw - 0.28, 2.1, { color: GRAY, max: 13 });
          t.img(s, await bc(i + 10), x + 0.14, y + h - 0.44, cw - 0.28, 0.3);
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Chipta', colors: { dk1: C.navy, lt1: 'FFFFFF', dk2: C.board, lt2: C.bg, accent1: C.orange, accent2: C.navy, accent3: C.amber, accent4: C.gray, accent5: '3B6EA8', accent6: C.line, hlink: C.orange, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "yo'lga chiqishdek aniq va tartibli: qisqa, bosqichma-bosqich, 'qayerdan-qayerga' mantig'i", limits: { agenda_item: 30, event_h: 14 }, prefer: null };
module.exports = { id: 47, slug: 'chipta', name: 'Çipta', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "playful"], "transitions": ["pull:r", "cover:r", "cut"], "cover": ["stretch", "typeLetters"], "mark": "popIn", "deco": "wipe:r", "sig": {"title": "stretch", "body": "wipe:r", "item": "slideRight", "image": "wipe:r", "number": "popIn", "order": "seq", "stagger": 0.12}, "tempo": 0.9, "kenburns": false};
