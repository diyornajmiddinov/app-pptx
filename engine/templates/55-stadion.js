/**
 * 55 Stadion — football stadium: striped mown pitch with white field markings, LED
 * scoreboard headers in amber, team-sheet agenda, home/away comparison, tactic-board steps.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { g1: '2F8A3E', g2: '37984A', line: 'FFFFFF', board: '0F1712', led: 'FFC400', red: 'E53935', blue: '1E5AA8', ink: '14201A', muted: '56645B', white: 'FFFFFF' };
const F = { head: 'Arial', body: 'Arial', led: 'Courier New' };

const pitch = () => { let st = ''; for (let k = 0; k < 16; k++) st += `<rect x="${k * 100}" y="0" width="100" height="900" fill="#${k % 2 ? C.g1 : C.g2}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${st}<g fill="none" stroke="#fff" stroke-width="6" stroke-opacity="0.85">
  <rect x="60" y="60" width="1480" height="780"/><line x1="800" y1="60" x2="800" y2="840"/><circle cx="800" cy="450" r="130"/><circle cx="800" cy="450" r="6" fill="#fff"/>
  <rect x="60" y="230" width="230" height="440"/><rect x="60" y="340" width="80" height="220"/><rect x="1310" y="230" width="230" height="440"/><rect x="1460" y="340" width="80" height="220"/>
  <path d="M290,380 A110,110 0 0 1 290,520"/><path d="M1310,380 A110,110 0 0 0 1310,520"/></g></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(pitch(), 1600, 900, true);
  const board = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.board, { r: 0.06, line: { color: '3A453E', width: 1.5 }, name: 'Scoreboard' });
  const panel = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.white, { r: 0.06, shadow: 0.3, blur: 6, offset: 2, name: 'Board' });
  const jersey = (s, x, y, d, col, n) => { t.oval(s, x, y, d, d, col, { line: { color: C.white, width: 2 } }); t.text(s, String(n), { x, y, w: d, h: d, fontSize: Math.round(d * 26), bold: true, color: C.white, align: 'center', valign: 'middle' }); };
  const footer = (s) => { t.rect(s, 0, 5.28, W, 0.345, C.board, { name: 'Ad board' }); t.text(s, `${M.topic || ''}   \u26BD   ${meta}`, { x: 0.4, y: 5.28, w: 9.2, h: 0.345, fontSize: 8.5, bold: true, color: C.led, valign: 'middle' }); };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    board(s, 0.45, 0.25, 9.1, 0.85);
    t.text(s, `${String(idx * 7).padStart(2, '0')}'`, { x: 0.6, y: 0.25, w: 0.9, h: 0.85, fontFace: F.led, fontSize: 22, bold: true, color: C.led, valign: 'middle' });
    if (d.title) t.text(s, d.title.toUpperCase(), { x: 1.55, y: 0.25, w: 7.85, h: 0.85, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title.toUpperCase(), 7.85, 0.8, 24, 13, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
  const screen = async (s, src, x, y, w, h) => { board(s, x - 0.12, y - 0.12, w + 0.24, h + 0.24); t.img(s, await L.photo(L.src(src), w, h), x, y, w, h, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    board(s, 0.55, 0.65, 5.4, 3.95);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.85, y: 0.85, w: 4.9, h: 0.3, fontFace: F.led, fontSize: 12, bold: true, color: C.led });
    t.text(s, d.title.toUpperCase(), { x: 0.85, y: 1.2, w: 4.85, h: 2.2, bold: true, fontSize: L.fit(d.title.toUpperCase(), 4.85, 2.1, 36, 18, F.head, true), color: C.white, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.45, w: 4.85, h: 0.6, fontSize: 12, color: 'B9C7BD' });
    t.text(s, M.author || '', { x: 0.85, y: 4.05, w: 4.85, h: 0.4, fontFace: F.led, fontSize: 15, bold: true, color: C.led });
    if (d.image) await screen(s, d.image, 6.35, 0.85, 3.1, 3.5);
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await screen(s, d.image, 0.75, 1.5, 3.8, 3.35); panel(s, 4.95, 1.38, 4.6, 3.75); para(s, d.text, 5.2, 1.5, 4.1, 3.5); },
    async image(d) { const s = page(d); panel(s, 0.45, 1.38, 4.6, 3.75); para(s, d.text, 0.7, 1.5, 4.1, 3.5); await screen(s, d.image, 5.45, 1.5, 3.85, 3.35); },
    async agenda(d) {
      const s = page(d), n = d.items.length; panel(s, 0.45, 1.38, 9.1, 3.75);
      const per = Math.ceil(n / 2), rh = Math.min(1.0, 3.45 / per);
      d.items.forEach((it, i) => {
        const x = 0.75 + Math.floor(i / per) * 4.45, y = 1.55 + (i % per) * rh;
        jersey(s, x, y, 0.55, i % 2 ? C.blue : C.red, i + 1);
        t.text(s, it, { x: x + 0.7, y, w: 3.55, h: 0.55, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (9.1 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.45 + i * (w + gap);
        panel(s, x, 1.38, w, 3.75);
        t.rect(s, x, 1.38, w, 0.75, i % 2 ? C.blue : C.red, { r: 0.06, name: 'Band' }); t.rect(s, x, 1.83, w, 0.3, i % 2 ? C.blue : C.red, { name: 'Band' });
        t.img(s, await L.icon(it.icon, C.white, 2), x + 0.2, 1.55, 0.4, 0.4);
        t.text(s, String(i + 1).padStart(2, '0'), { x: x + w - 0.85, y: 1.45, w: 0.7, h: 0.6, fontFace: F.led, fontSize: 20, bold: true, color: C.white, align: 'right', valign: 'middle' });
        t.text(s, it.h, { x: x + 0.2, y: 2.25, w: w - 0.4, h: 0.6, fontSize: L.fit(it.h, w - 0.4, 0.6, 16, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 2.9, w: w - 0.4, h: 2.1, fontSize: 13, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 9.1 / n;
      const pass = `<svg xmlns="http://www.w3.org/2000/svg" width="910" height="80"><path d="M40,60 Q240,0 455,40 T870,30" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="12 10"/><path d="M850,15 L880,30 L850,45" fill="none" stroke="#fff" stroke-width="4"/></svg>`;
      t.img(s, await L.svg(pass, 910, 80), 0.45, 1.3, 9.1, 0.8);
      d.steps.forEach((st, i) => {
        const x = 0.45 + i * cw;
        jersey(s, x + cw / 2 - 0.3, 1.45, 0.6, i % 2 ? C.blue : C.red, i + 1);
        panel(s, x + 0.05, 2.25, cw - 0.15, 2.85);
        t.text(s, st.h, { x: x + 0.2, y: 2.35, w: cw - 0.45, h: 0.55, fontSize: L.fit(st.h, cw - 0.45, 0.55, 15, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, st.t, { x: x + 0.2, y: 2.95, w: cw - 0.45, h: 2.05, fontSize: 13, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.25, w = (9.1 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.45 + i * (w + gap);
        board(s, px, 1.4, w, 1.55);
        t.text(s, x.value, { x: px + 0.15, y: 1.4, w: w - 0.3, h: 1.55, fontFace: F.led, fontSize: L.fit(x.value, w - 0.4, 1.2, 54, 22, F.led, true), bold: true, color: C.led, align: 'center', valign: 'middle' });
        panel(s, px, 3.05, w, 1.2);
        t.text(s, x.label, { x: px + 0.15, y: 3.1, w: w - 0.3, h: 1.1, fontSize: 13, color: C.ink, align: 'center', valign: 'middle' });
      });
      if (d.note) { panel(s, 0.45, 4.38, 9.1, 0.75); t.text(s, d.note, { x: 0.6, y: 4.42, w: 8.8, h: 0.67, fontSize: 11, color: C.muted, valign: 'middle' }); }
    },
    async compare(d) {
      const s = page(d), w = 4.45;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.7, F.body, 0.2, 5.0 - 2.25);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.45 + i * (w + 0.2), col = i ? C.blue : C.red;
        panel(s, x, 1.38, w, 3.75);
        t.rect(s, x, 1.38, w, 0.65, col, { r: 0.06, name: 'Team' });
        t.text(s, side.h, { x: x + 0.25, y: 1.38, w: w - 0.5, h: 0.65, fontSize: 17, bold: true, color: C.white, valign: 'middle' });
        let y = 2.25;
        side.items.forEach((it, k) => { t.oval(s, x + 0.25, y + 0.07, 0.17, 0.17, col); t.text(s, it, { x: x + 0.55, y, w: w - 0.7, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      });
      t.oval(s, 4.62, 1.33, 0.76, 0.76, C.board, { line: { color: C.white, width: 2 } });
      t.text(s, 'VS', { x: 4.62, y: 1.33, w: 0.76, h: 0.76, fontSize: 15, bold: true, color: C.led, align: 'center', valign: 'middle' });
    },
    async statement(d) {
      const s = page(d);
      board(s, 0.8, 1.45, 8.4, 2.3);
      t.text(s, L.runs(d.text), { x: 1.1, y: 1.5, w: 7.8, h: 2.2, fontFace: F.led, bold: true, fontSize: L.fit(d.text, 7.8, 2.1, 30, 15, F.led, true), color: C.led, align: 'center', valign: 'middle' });
      if (d.caption) { panel(s, 0.8, 3.9, 8.4, 1.2); t.text(s, d.caption, { x: 1.0, y: 3.95, w: 8.0, h: 1.1, fontSize: 13, color: C.ink, align: 'center', valign: 'middle' }); }
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 9.1 / n;
      t.line(s, 0.45, 1.95, 9.1, 0, C.white, 3);
      d.items.forEach((it, i) => {
        const x = 0.45 + i * cw;
        t.oval(s, x + 0.05, 1.77, 0.36, 0.36, C.white, { line: { color: C.board, width: 1.5 } });
        t.text(s, '\u26BD', { x: x + 0.05, y: 1.77, w: 0.36, h: 0.36, fontSize: 14, color: C.board, align: 'center', valign: 'middle' });
        board(s, x + 0.5, 1.5, cw - 0.6, 0.6);
        t.text(s, it.year, { x: x + 0.55, y: 1.5, w: cw - 0.7, h: 0.6, fontFace: F.led, fontSize: L.fit(it.year, cw - 0.75, 0.55, 20, 10, F.led, true), bold: true, color: C.led, align: 'center', valign: 'middle' });
        panel(s, x + 0.05, 2.3, cw - 0.15, 2.8);
        t.text(s, it.h, { x: x + 0.2, y: 2.4, w: cw - 0.45, h: 0.5, fontSize: 15, bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 2.95, w: cw - 0.45, h: 2.05, fontSize: 13, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      panel(s, 1.0, 1.4, 8.0, 3.2);
      t.rect(s, 1.0, 1.4, 1.6, 0.45, C.red, { r: 0.06, name: 'Tag' });
      t.text(s, '\u201C \u201D', { x: 1.0, y: 1.4, w: 1.6, h: 0.45, fontSize: 16, bold: true, color: C.white, align: 'center', valign: 'middle' });
      t.text(s, d.text, { x: 1.35, y: 1.95, w: 7.3, h: 1.9, italic: true, bold: true, fontSize: L.fit(d.text, 7.3, 1.85, 28, 15, F.head, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.35, y: 3.95, w: 7.3, h: 0.45, fontSize: 14, bold: true, color: C.blue });
    },
    async sources(d) {
      const s = page(d), n = d.items.length; panel(s, 0.45, 1.38, 9.1, 3.75);
      const rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.48 + i * rh;
        jersey(s, 0.65, y + (rh - 0.36) / 2, 0.36, i % 2 ? C.blue : C.red, i + 1);
        t.text(s, it, { x: 1.15, y, w: 8.2, h: rh, fontSize: 13, color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Stadion', colors: { dk1: C.ink, lt1: C.white, dk2: C.board, lt2: 'E8F0EA', accent1: C.g1, accent2: C.led, accent3: C.red, accent4: C.blue, accent5: C.muted, accent6: C.g2, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "sport sharhlovchisi kabi jonli: jamoaviy harakat, natija va hisob; qisqa va g'ayratli", limits: {}, prefer: 'data' };
module.exports = { id: 55, slug: 'stadion', name: 'Stadion', category: 'business', photos: true, build, style: STYLE };
