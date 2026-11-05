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
  // ---- further ways to draw a type, all on match day: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const SOFT = 'D5DED8', NIGHT = '0B120E';
  const memo = {};
  const lights = async (s, y = 1.14) => t.img(s, (memo.lights ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="16">${Array.from({ length: 50 }, (_, k) => `<circle cx="${k * 20 + 10}" cy="8" r="${k % 5 === 2 ? 6.5 : 4}" fill="#${k % 5 === 2 ? 'FFFFFF' : C.led}"/>`).join('')}</svg>`, 1000, 16)), 0, y, W, 0.16);
  const night = async (d) => { // the floodlit night match
    const s = pres.addSlide(); s.background = { color: NIGHT }; idx++;
    t.text(s, `${String(idx * 7).padStart(2, '0')}'`, { x: 0.6, y: 0.25, w: 0.9, h: 0.85, fontFace: F.led, fontSize: 22, bold: true, color: C.led, valign: 'middle' });
    t.text(s, d.title.toUpperCase(), { x: 1.55, y: 0.25, w: 7.85, h: 0.85, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title.toUpperCase(), 7.85, 0.8, 24, 13, F.head, true) });
    await lights(s);
    footer(s);
    return s;
  };
  const ball = (s, x, y, d, fs) => { t.oval(s, x, y, d, d, C.white, { line: { color: C.board, width: 1.5 } }); t.text(s, '⚽', { x, y, w: d, h: d, fontSize: fs, color: C.board, align: 'center', valign: 'middle', noFit: true }); };
  const V = {
    image: [
      async (d) => { // the words on a board at the top of the stand, the giant screen below them
        const s = page(d);
        panel(s, 0.45, 1.3, 9.1, 1.62);
        t.text(s, d.text, { x: 0.65, y: 1.36, w: 8.7, h: 1.5, fontSize: L.fit(d.text, 8.7, 1.5, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
        await screen(s, d.image, 0.57, 3.16, 8.86, 1.9);
      },
      async (d) => { // night match: floodlights on, the words white, the picture on the far screen
        const s = await night(d);
        await screen(s, d.image, 5.7, 1.56, 3.72, 3.5);
        t.text(s, d.text, { x: 0.55, y: 1.42, w: 4.75, h: 3.76, fontSize: L.fit(d.text, 4.75, 3.76, 14, 10, F.body, false, 1.25), color: C.white, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // the crowd's view fills the page, the scoreboard hangs over its foot
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, 5.28), 0, 0, W, 5.28, { alt: '' });
        board(s, 0.4, 2.3, 9.2, 2.86);
        t.text(s, `${String(idx * 7).padStart(2, '0')}'`, { x: 0.55, y: 2.36, w: 0.9, h: 0.68, fontFace: F.led, fontSize: 20, bold: true, color: C.led, valign: 'middle' });
        t.text(s, d.title.toUpperCase(), { x: 1.45, y: 2.36, w: 8.0, h: 0.68, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title.toUpperCase(), 8.0, 0.64, 20, 12, F.head, true) });
        t.line(s, 0.55, 3.06, 8.9, 0, C.led, 1.25);
        t.text(s, d.text, { x: 0.6, y: 3.14, w: 8.8, h: 1.94, fontSize: L.fit(d.text, 8.8, 1.94, 14, 10, F.body, false, 1.15), color: C.white, lineSpacingMultiple: 1.15, valign: 'middle' });
        footer(s);
      },
      async (d) => { // the picture in the centre circle, the words on the touchline board
        const s = page(d), dd = 3.45, x = 0.55, y = 1.48;
        t.line(s, x + dd / 2, 1.1, 0, 4.18, C.white, 3);
        t.oval(s, x - 0.12, y - 0.12, dd + 0.24, dd + 0.24, C.white);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        panel(s, 4.4, 1.38, 5.15, 3.78);
        t.text(s, d.text, { x: 4.62, y: 1.48, w: 4.7, h: 3.58, fontSize: L.fit(d.text, 4.7, 3.58, 14, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // the team sheet: one white list, a shirt to each line
        const s = page(d), n = d.items.length, h = 3.66 / n;
        panel(s, 0.45, 1.36, 9.1, 3.8);
        for (const [i, it] of d.items.entries()) {
          const y = 1.43 + i * h, col = i % 2 ? C.blue : C.red, dd = Math.min(0.66, h - 0.1);
          t.oval(s, 0.65, y + (h - dd) / 2, dd, dd, col, { line: { color: C.white, width: 2 } });
          t.img(s, await L.icon(it.icon, C.white, 2), 0.65 + dd / 2 - 0.15, y + h / 2 - 0.15, 0.3, 0.3);
          head(s, it.h, 1.5, y + 0.03, 2.6, h - 0.06, { max: 15 });
          body(s, it.t, 4.2, y + 0.04, 5.15, h - 0.08, { valign: 'middle', color: C.ink });
          if (i < n - 1) t.line(s, 1.5, y + h, 7.85, 0, 'D3DBD6', 1);
        }
      },
      async (d) => { // night match: scoreboards two by two, headings in amber
        const s = await night(d), n = d.items.length, w = 4.45, h = 1.76;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9.1 : w, x = 0.45 + (i % 2) * (w + 0.2), y = 1.42 + Math.floor(i / 2) * (h + 0.1);
          board(s, x, y, ww, h);
          t.img(s, await L.icon(it.icon, C.led, 2), x + 0.16, y + 0.14, 0.38, 0.38);
          t.text(s, it.h, { x: x + 0.64, y: y + 0.1, w: ww - 0.8, h: 0.46, fontFace: F.led, bold: true, color: C.led, valign: 'middle', fontSize: L.fit(it.h, ww - 0.8, 0.44, 15, 10, F.led, true) });
          body(s, it.t, x + 0.16, y + 0.62, ww - 0.32, h - 0.7, { color: C.white });
        }
      },
      async (d) => { // the formation: players stand at two depths on the grass
        const s = page(d), n = d.items.length, gap = 0.14, w = (9.1 - gap * (n - 1)) / n, h = 2.82;
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * (w + gap), y = 1.68 + (i % 2 ? 0.66 : 0), col = i % 2 ? C.blue : C.red, dd = 0.62;
          panel(s, x, y, w, Math.min(h, 5.16 - y));
          t.oval(s, x + w / 2 - dd / 2, y - dd / 2 - 0.02, dd, dd, col, { line: { color: C.white, width: 2.5 } });
          t.img(s, await L.icon(it.icon, C.white, 2), x + w / 2 - 0.15, y - 0.17, 0.3, 0.3);
          const hh = Math.min(h, 5.16 - y);
          head(s, it.h, x + 0.14, y + 0.34, w - 0.28, 0.5, { max: 14, align: 'center' });
          body(s, it.t, x + 0.14, y + 0.86, w - 0.28, hh - 0.94, { align: 'center', max: 12 });
        }
      },
      async (d) => { // kick-off: the ball on the centre spot, the boards round the circle
        const s = page(d), n = d.items.length, w = 3.42, h = 1.82, cx = 5, cy = 3.25, dd = 2.2;
        t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, null, { line: { color: C.white, width: 4 } });
        t.line(s, cx, 1.1, 0, 4.18, C.white, 3);
        ball(s, cx - 0.4, cy - 0.4, 0.8, 34);
        const spots = n === 3 ? [[0.45, 1.36], [0.45, 3.34], [6.13, 2.35]] : [[0.45, 1.36], [6.13, 1.36], [0.45, 3.34], [6.13, 3.34]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], col = i % 2 ? C.blue : C.red;
          panel(s, x, y, w, h);
          t.rect(s, x, y, 0.12, h, col, { name: 'Edge' });
          t.img(s, await L.icon(it.icon, col, 2), x + 0.24, y + 0.1, 0.3, 0.3);
          head(s, it.h, x + 0.62, y + 0.05, w - 0.74, 0.42, { max: 14 });
          body(s, it.t, x + 0.24, y + 0.52, w - 0.36, h - 0.6);
        }
      },
    ],
    process: [
      async (d) => { // the victory podium: each step higher than the one before
        const s = page(d), n = d.steps.length, w = 9.1 / n, low = 3.3, high = 1.72, bot = 5.18;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.45 + i * w, y = low - i * ((low - high) / (n - 1)), tw = w - 0.06;
          panel(s, x, y, tw, bot - y);
          t.rect(s, x, y, tw, 0.1, i % 2 ? C.blue : C.red, { name: 'Tread' });
          jersey(s, x + tw / 2 - 0.27, y - 0.34, 0.54, i % 2 ? C.blue : C.red, i + 1);
          head(s, st.h, x + 0.12, y + 0.24, tw - 0.24, 0.46, { max: 13, align: 'center' });
          body(s, st.t, x + 0.12, y + 0.72, tw - 0.24, Math.min(1.1, bot - y - 0.8) + (bot - y - 0.8 > 1.1 ? 0.4 : 0), { align: 'center', max: 12 });
        }
      },
      async (d) => { // the halfway line up the page, players pass from wing to wing
        const s = page(d), n = d.steps.length, gap = n === 4 ? 0.94 : 1.28, h = n === 4 ? 1.1 : 1.2, w = 3.95, cx = 5;
        t.rect(s, cx - 0.04, 1.1, 0.08, 4.18, C.white, { name: 'Halfway line' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.38 + i * gap, x = right ? cx + 0.46 : cx - 0.46 - w, col = right ? C.blue : C.red;
          jersey(s, cx - 0.32, y + 0.1, 0.64, col, i + 1);
          panel(s, x, y, w, h);
          head(s, st.h, x + 0.14, y + 0.04, w - 0.28, 0.36, { max: 14 });
          body(s, st.t, x + 0.14, y + 0.42, w - 0.28, h - 0.48);
        }
      },
      async (d) => { // the tactics board: chalk circles and arrows on black
        const s = await night(d), n = d.steps.length, cw = 9.1 / n, ys = [1.42, 2.3, 1.42, 2.3], dd = 0.58;
        for (let i = 0; i < n - 1; i++) { // the pass runs along the top and turns square, clear of the words
          const xa = 0.45 + i * cw, xb = xa + cw, top = 1.42 + dd / 2, down = i % 2 === 0;
          t.line(s, down ? xa + dd : xa + dd / 2, top, down ? xb + dd / 2 - xa - dd : xb - xa - dd / 2, 0, C.white, 1.75, { dash: 'dash' });
          t.line(s, down ? xb + dd / 2 : xa + dd / 2, top, 0, 2.3 - top, C.white, 1.75, { dash: 'dash' });
        }
        for (const [i, st] of d.steps.entries()) {
          const x = 0.45 + i * cw, y = ys[i], w = cw - 0.2;
          t.oval(s, x, y, dd, dd, null, { line: { color: C.led, width: 2.5 } });
          t.text(s, String(i + 1), { x, y, w: dd, h: dd, fontFace: F.led, bold: true, fontSize: 18, color: C.led, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + dd + 0.06, w, 0.48, { color: C.white, max: 14 });
          body(s, st.t, x, y + dd + 0.56, w, 5.2 - y - dd - 0.56, { color: SOFT, max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // the final score, huge on the main board; two more on small boards
        const s = page(d), [a, ...rest] = d.stats;
        board(s, 0.45, 1.36, 5.3, 2.5);
        t.text(s, a.value, { x: 0.65, y: 1.4, w: 4.9, h: 1.46, fontFace: F.led, bold: true, color: C.led, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 4.85, 1.4, 66, 26, F.led, true) });
        body(s, a.label, 0.75, 2.88, 4.7, 0.9, { color: C.white, align: 'center', max: 14 });
        for (const [i, v] of rest.entries()) {
          const y = 1.36 + i * 1.28;
          board(s, 5.95, y, 3.6, 0.7);
          t.text(s, v.value, { x: 6.05, y, w: 3.4, h: 0.7, fontFace: F.led, bold: true, color: C.led, align: 'center', valign: 'middle', fontSize: L.fit(v.value, 3.3, 0.62, 30, 14, F.led, true) });
          panel(s, 5.95, y + 0.72, 3.6, 0.48);
          body(s, v.label, 6.05, y + 0.73, 3.4, 0.46, { align: 'center', valign: 'middle', max: 11 });
        }
        panel(s, 0.45, 3.98, 5.3, 1.18);
        if (d.note) body(s, d.note, 0.6, 4.02, 5.0, 1.1, { valign: 'middle', max: 12 });
        else t.text(s, '⚽', { x: 0.6, y: 4.02, w: 5.0, h: 1.1, fontSize: 28, color: C.ink, align: 'center', valign: 'middle' });
      },
      async (d) => { // night match: match statistics, line under line
        const s = await night(d), h = 0.88;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.42 + i * h;
          t.oval(s, 0.55, y + h / 2 - 0.18, 0.3, 0.3, [C.red, C.blue, C.led][i]);
          body(s, v.label, 1.02, y, 5.0, h - 0.08, { color: C.white, max: 15, valign: 'middle' });
          t.text(s, v.value, { x: 6.2, y, w: 3.35, h: h - 0.08, fontFace: F.led, bold: true, color: C.led, align: 'right', valign: 'middle', fontSize: L.fit(v.value, 3.3, h - 0.14, 36, 16, F.led, true) });
          t.line(s, 0.55, y + h - 0.04, 9.0, 0, '3A453E', 1);
        }
        if (d.note) body(s, d.note, 0.55, 4.14, 9.0, 1.02, { color: SOFT, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // home and away face each other across the halfway line
        const s = page(d), w = 4.3, cx = 5;
        t.rect(s, cx - 0.04, 1.1, 0.08, 4.18, C.white, { name: 'Halfway line' });
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.32, F.body, 0.2, 3.06);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.12 : cx - 0.12 - w, a = i ? 'left' : 'right', col = i ? C.blue : C.red;
          t.rect(s, x, 1.34, w, 0.6, col, { name: 'Team' });
          head(s, side.h, x + 0.16, 1.34, w - 0.32, 0.6, { color: C.white, max: 17, align: a });
          let y = 2.02;
          side.items.forEach((it, j) => {
            if (it) t.rect(s, x, y, w, rows[j] - 0.05, C.white, { r: 0.04, name: 'Row' });
            t.text(s, it, { x: x + 0.16, y: y + 0.04, w: w - 0.32, h: rows[j] - 0.12, fontSize: fs, color: C.ink, align: a, valign: 'middle' });
            y += rows[j];
          });
        }
      },
      async (d) => { // two stands of colour, red over blue, a small scoreboard naming each
        const s = page(d), h = 1.84;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.3 + i * (h + 0.12), col = i ? C.blue : 'C62828', rh = (h - 0.2) / Math.ceil(side.items.length / 2);
          t.rect(s, 0, y, W, h, col, { name: 'Stand' });
          board(s, 0.4, y + 0.3, 2.5, h - 0.6);
          t.text(s, side.h, { x: 0.5, y: y + 0.32, w: 2.3, h: h - 0.64, fontFace: F.led, bold: true, color: C.led, align: 'center', valign: 'middle', fontSize: L.fit(side.h, 2.25, h - 0.68, 16, 10, F.led, true) });
          side.items.forEach((it, j) => body(s, it, 3.1 + (j % 2) * 3.25, y + 0.1 + Math.floor(j / 2) * rh, 3.1, rh - 0.05, { color: C.white, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // night match: the ball under the lights, the words in amber beside it
        const s = await night(d), dd = 3.0;
        ball(s, 0.55, 1.78, dd, 120);
        t.text(s, L.runs(d.text), { x: 3.9, y: 1.4, w: 5.65, h: 2.4, fontFace: F.led, bold: true, color: C.led, valign: 'middle', fontSize: L.fit(d.text, 5.65, 2.35, 26, 14, F.led, true) });
        if (d.caption) body(s, d.caption, 3.9, 3.9, 5.65, 1.26, { color: C.white, max: 13 });
      },
      async (d) => { // the penalty box: white chalk round the words, the note on a board at its side
        const s = page(d);
        t.rect(s, 0.45, 1.36, 6.2, 3.8, C.g1, { line: { color: C.white, width: 4 }, name: 'Penalty box' });
        t.text(s, L.runs(d.text), { x: 0.75, y: 1.5, w: 5.6, h: 3.5, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 5.6, 3.45, 32, 16, F.head, true) });
        panel(s, 6.85, 1.36, 2.7, 3.8);
        if (d.caption) body(s, d.caption, 7.0, 1.46, 2.4, 3.6, { valign: 'middle', max: 13 });
      },
    ],
    timeline: [
      async (d) => { // the touchline: minutes kick off above it and below it in turn
        const s = page(d), axis = 3.26, w = 3.85;
        t.rect(s, 0, axis - 0.03, W, 0.06, C.white, { name: 'Touchline' });
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.45 + (i / 2) * 4.7 : 1.55 + ((i - 1) / 2) * 4.7, top = up ? 1.28 : 3.44, h = 1.74;
          ball(s, x + 0.12, axis - 0.16, 0.32, 12);
          panel(s, x, top, w, h);
          board(s, x + 0.1, top + 0.08, 1.62, 0.4);
          t.text(s, it.year, { x: x + 0.14, y: top + 0.08, w: 1.54, h: 0.4, fontFace: F.led, bold: true, color: C.led, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.5, 0.36, 15, 10, F.led, true) });
          head(s, it.h, x + 1.82, top + 0.08, w - 1.92, 0.4, { max: 13 });
          body(s, it.t, x + 0.14, top + 0.54, w - 0.28, h - 0.6);
        }
      },
      async (d) => { // night match: the fixture list stepping down, one line to each date
        const s = await night(d), h = 0.84;
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * 0.3, y = 1.42 + i * 0.94, w = 8.2;
          board(s, x, y, w, h);
          t.text(s, it.year, { x: x + 0.1, y, w: 1.66, h, fontFace: F.led, bold: true, color: C.led, valign: 'middle', fontSize: L.fit(it.year, 1.62, 0.6, 20, 10, F.led, true) });
          head(s, it.h, x + 1.82, y + 0.05, 1.75, h - 0.1, { color: C.white, max: 13 });
          body(s, it.t, x + 3.62, y + 0.05, w - 3.74, h - 0.1, { color: SOFT, max: 12, valign: 'middle' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Stadion', colors: { dk1: C.ink, lt1: C.white, dk2: C.board, lt2: 'E8F0EA', accent1: C.g1, accent2: C.led, accent3: C.red, accent4: C.blue, accent5: C.muted, accent6: C.g2, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "sport sharhlovchisi kabi jonli: jamoaviy harakat, natija va hisob; qisqa va g'ayratli", limits: {}, prefer: 'data' };
module.exports = { id: 55, slug: 'stadion', name: 'Stadion', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "bold"], "transitions": ["push:u", "zoom", "p14:flash"], "cover": ["popOver", "stretch"], "mark": "popOver", "deco": "flyUp", "sig": {"title": "stretch", "body": "flyUp", "item": "flyUp", "image": "zoomIn", "number": "popOver", "order": "cascade", "stagger": 0.09}, "tempo": 0.85, "kenburns": false};
