/**
 * 67 Shaxmat — chess: checkerboard fields, piece silhouettes (pawn, knight, bishop, rook,
 * queen, king) as markers, white-vs-black comparison, a pawn-to-queen promotion for steps.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { light: 'EFD9B4', dark: 'B07B4F', ink: '1E1A16', muted: '6A5E52', bg: 'F7F2EA', black: '22201D', white: 'FFFFFF', accent: 'B23A3A' };
const F = { head: 'Cambria', body: 'Calibri' };

// piece silhouettes on a 200 x 260 canvas
const BASE = 'M40,240 L160,240 L160,222 Q100,208 40,222 Z';
const P = {
  pawn: `<circle cx="100" cy="70" r="32"/><path d="M78,100 L122,100 L132,200 Q100,212 68,200 Z"/><path d="${BASE}"/>`,
  rook: `<path d="M52,40 L72,40 L72,58 L90,58 L90,40 L110,40 L110,58 L128,58 L128,40 L148,40 L148,92 L52,92 Z"/><path d="M62,92 L138,92 L146,205 L54,205 Z"/><path d="${BASE}"/>`,
  bishop: `<circle cx="100" cy="28" r="12"/><path d="M100,40 C140,70 140,120 118,140 L82,140 C60,120 60,70 100,40 Z"/><path d="M82,140 L118,140 L130,205 L70,205 Z"/><path d="${BASE}"/>`,
  knight: `<path d="M70,205 L64,150 C40,140 38,110 60,90 C70,60 92,35 125,32 L130,18 L142,36 C165,52 172,100 160,150 L150,205 Z"/><path d="${BASE}"/>`,
  queen: `<path d="M40,60 L65,120 L80,50 L100,115 L120,50 L135,120 L160,60 L148,140 L52,140 Z"/><circle cx="40" cy="55" r="10"/><circle cx="80" cy="45" r="10"/><circle cx="120" cy="45" r="10"/><circle cx="160" cy="55" r="10"/><path d="M58,140 L142,140 L150,205 L50,205 Z"/><path d="${BASE}"/>`,
  king: `<rect x="92" y="8" width="16" height="50"/><rect x="76" y="22" width="48" height="14"/><path d="M60,70 Q100,52 140,70 L132,140 L68,140 Z"/><path d="M68,140 L132,140 L144,205 L56,205 Z"/><path d="${BASE}"/>`,
};
const pieceSvg = (kind, fill, stroke) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260"><g fill="#${fill}" stroke="#${stroke}" stroke-width="6" stroke-linejoin="round">${P[kind]}</g></svg>`;
const ORDER = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
const boardSvg = (cols, rows, s) => { let g = ''; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) g += `<rect x="${c * s}" y="${r * s}" width="${s}" height="${s}" fill="#${(r + c) % 2 ? C.dark : C.light}"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * s}" height="${rows * s}">${g}</svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const piece = async (s, kind, x, y, h, black = false) => t.img(s, (memo[kind + black] ??= await L.svg(pieceSvg(kind, black ? C.black : C.white, black ? '000000' : C.ink), 200, 260)), x, y, h * 200 / 260, h);
  const strip = await L.svg(boardSvg(2, 18, 50), 100, 900);
  const board8 = await L.svg(boardSvg(8, 8, 60), 480, 480);
  const panel = (s, x, y, w, h, dark = false) => t.rect(s, x, y, w, h, dark ? C.black : C.white, { line: { color: C.dark, width: 1.5 }, shadow: 0.15, blur: 6, offset: 2, name: 'Panel' });
  const footer = (s) => t.text(s, `${M.topic || ''}   \u265E   ${meta}`, { x: 0.85, y: 5.25, w: 8.6, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.img(s, strip, 0, 0, 0.32, H);
    t.text(s, `${String.fromCharCode(97 + ((idx - 1) % 8))}${((idx - 1) % 8) + 1}`, { x: 8.75, y: 0.38, w: 0.7, h: 0.6, fontFace: F.head, fontSize: 18, bold: true, color: C.dark, align: 'right', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 0.7, y: 0.35, w: 7.9, h: 0.7, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.7, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const photo = async (s, src, x, y, w, h) => { t.rect(s, x - 0.12, y - 0.12, w + 0.24, h + 0.24, C.dark, { name: 'Frame' }); t.img(s, await L.photo(L.src(src), w, h), x, y, w, h, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.img(s, board8, 5.4, 0.45, 4.2, 4.2);
    if (d.image) await photo(s, d.image, 6.45, 1.5, 2.1, 2.1);
    await piece(s, 'king', 5.55, 3.05, 1.45, true); await piece(s, 'queen', 8.55, 0.55, 1.2);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.65, w: 4.6, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 4.6, h: 2.3, fontFace: F.head, bold: true, fontSize: L.fit(d.title, 4.6, 2.2, 38, 20, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.4, w: 4.5, h: 0.8, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.35, w: 4.5, h: 0.45, fontFace: F.head, fontSize: 17, bold: true, color: C.ink });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await photo(s, d.image, 0.85, 1.5, 3.6, 3.35); para(s, d.text, 4.9, 1.4, 4.55, 3.6); },
    async image(d) { const s = page(d); para(s, d.text, 0.7, 1.4, 4.5, 3.6); await photo(s, d.image, 5.75, 1.5, 3.6, 3.35); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.15, 3.6 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.75 + Math.floor(i / per) * 4.4, y = 1.4 + (i % per) * rh;
        t.rect(s, x, y, 0.65, 0.65, (i % 2) ? C.dark : C.light, { name: 'Square' });
        await piece(s, ORDER[i % 6], x + 0.1, y + 0.03, 0.6, i % 2 === 0);
        t.text(s, `${i + 1}. ${it}`, { x: x + 0.8, y, w: 3.45, h: 0.65, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (8.75 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + i * (w + gap), dk = i % 2 === 1;
        panel(s, x, 1.4, w, 3.65, dk);
        await piece(s, ORDER[(i + 1) % 6], x + 0.2, 1.55, 0.85, !dk);
        t.text(s, it.h, { x: x + 0.2, y: 2.5, w: w - 0.4, h: 0.6, fontFace: F.head, fontSize: L.fit(it.h, w - 0.4, 0.6, 17, 11, F.head, true), bold: true, color: dk ? C.light : C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 3.1, w: w - 0.4, h: 1.85, fontSize: 13, color: dk ? 'E8E0D4' : C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.75 / n, kinds = n === 3 ? ['pawn', 'rook', 'queen'] : ['pawn', 'knight', 'rook', 'queen'];
      for (const [i, st] of d.steps.entries()) {
        const x = 0.7 + i * cw;
        t.rect(s, x, 1.4, cw - 0.1, 1.2, i % 2 ? C.dark : C.light, { name: 'Square' });
        await piece(s, kinds[i % kinds.length], x + (cw - 0.1) / 2 - 0.4, 1.47, 1.05, i % 2 === 0);
        t.text(s, `${i + 1}. ${st.h}`, { x: x + 0.05, y: 2.75, w: cw - 0.2, h: 0.55, fontFace: F.head, fontSize: L.fit(`${i + 1}. ${st.h}`, cw - 0.2, 0.55, 16, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, st.t, { x: x + 0.05, y: 3.3, w: cw - 0.2, h: 1.75, fontSize: 13, color: C.muted });
      }
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.75 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.7 + i * cw;
        await piece(s, ['rook', 'queen', 'king'][i % 3], px + 0.05, 1.4, 1.45, i === 1);
        t.text(s, x.value, { x: px + 1.25, y: 1.45, w: cw - 1.4, h: 1.35, fontFace: F.head, fontSize: L.fit(x.value, cw - 1.5, 1.2, 50, 20, F.head, true), bold: true, color: i === 1 ? C.accent : C.ink, valign: 'middle' });
        t.text(s, x.label, { x: px + 0.05, y: 3.0, w: cw - 0.25, h: 1.1, fontSize: 13, color: C.ink });
      }
      if (d.note) t.text(s, d.note, { x: 0.7, y: 4.3, w: 8.75, h: 0.8, fontSize: 11, italic: true, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.25;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.6, F.body, 0.2, 4.95 - 2.3);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.7 + i * (w + 0.25), dk = i === 1;
        panel(s, x, 1.4, w, 3.65, dk);
        await piece(s, 'king', x + 0.2, 1.5, 0.7, dk ? false : true);
        t.text(s, side.h, { x: x + 0.85, y: 1.55, w: w - 1.0, h: 0.6, fontFace: F.head, fontSize: 18, bold: true, color: dk ? C.light : C.ink, valign: 'middle' });
        let y = 2.3;
        side.items.forEach((it, k) => { t.rect(s, x + 0.25, y + 0.07, 0.15, 0.15, dk ? C.light : C.dark, { name: 'Square' }); t.text(s, it, { x: x + 0.5, y, w: w - 0.65, h: rows[k], fontSize: fs, color: dk ? 'F2EADD' : C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = page(d);
      await piece(s, 'king', 0.75, 1.3, 2.9, true);
      t.text(s, L.runs(d.text), { x: 3.2, y: 1.35, w: 6.25, h: 2.3, fontFace: F.head, bold: true, fontSize: L.fit(d.text, 6.25, 2.2, 34, 16, F.head, true), color: C.ink, valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 3.2, y: 3.8, w: 6.25, h: 1.25, fontSize: 13, color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.75 / n;
      d.items.forEach((it, i) => {
        const x = 0.7 + i * cw;
        t.rect(s, x, 1.4, cw, 0.65, i % 2 ? C.dark : C.light, { name: 'Square' });
        t.text(s, it.year, { x, y: 1.4, w: cw, h: 0.65, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.2, 0.6, 24, 12, F.head, true), bold: true, color: i % 2 ? C.white : C.ink, align: 'center', valign: 'middle' });
        t.text(s, it.h, { x: x + 0.05, y: 2.2, w: cw - 0.2, h: 0.55, fontFace: F.head, fontSize: 15, bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.05, y: 2.75, w: cw - 0.2, h: 2.3, fontSize: 13, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      t.img(s, board8, 6.4, 1.0, 3.1, 3.1);
      await piece(s, 'knight', 7.25, 1.6, 2.0, true);
      t.text(s, d.text, { x: 0.8, y: 1.0, w: 5.3, h: 2.7, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 5.3, 2.6, 30, 15, F.head, false, 1, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 0.8, y: 3.85, w: 5.3, h: 0.45, fontSize: 15, bold: true, color: C.accent });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.rect(s, 0.75, y + (rh - 0.34) / 2, 0.34, 0.34, i % 2 ? C.dark : C.light, { name: 'Square' });
        t.text(s, String(i + 1), { x: 0.75, y: y + (rh - 0.34) / 2, w: 0.34, h: 0.34, fontSize: 10, bold: true, color: i % 2 ? C.white : C.ink, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 8.2, h: rh, fontSize: 13, color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all on the chessboard: a deck's pages must not look alike (L.pages)
  const PALE = 'F2EADD', K = (i) => ORDER[i % 6];
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const nightPage = (d) => {
    const s = pres.addSlide(); s.background = { color: C.black }; idx++;
    t.img(s, strip, 0, 0, 0.32, H);
    t.text(s, `${String.fromCharCode(97 + ((idx - 1) % 8))}${((idx - 1) % 8) + 1}`, { x: 8.75, y: 0.38, w: 0.7, h: 0.6, fontFace: F.head, fontSize: 18, bold: true, color: C.light, align: 'right', valign: 'middle' });
    t.text(s, d.title, { x: 0.7, y: 0.35, w: 7.9, h: 0.7, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.7, 28, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   ♞   ${meta}`, { x: 0.85, y: 5.25, w: 8.6, h: 0.22, fontSize: 8.5, color: PALE });
    return s;
  };
  const square = async (s, x, y, dd, kind, darkSq, blackPiece) => { t.rect(s, x, y, dd, dd, darkSq ? C.dark : C.light, { name: 'Square' }); const ph = dd * 0.9; await piece(s, kind, x + (dd - ph * 200 / 260) / 2, y + dd * 0.05, ph, blackPiece); };
  const checks = (s, x, y, w, n, dd = w / n) => { for (let k = 0; k < n; k++) t.rect(s, x + k * dd, y, dd, dd, k % 2 ? C.dark : C.light, { name: 'Square' }); };
  const numSq = (s, n, x, y, dd, darkSq) => { t.rect(s, x, y, dd, dd, darkSq ? C.black : C.light, { name: 'Square' }); t.text(s, String(n), { x, y, w: dd, h: dd, fontFace: F.head, bold: true, fontSize: Math.round(dd * 34), color: darkSq ? C.white : C.ink, align: 'center', valign: 'middle' }); };
  const V = {
    image: [
      async (d) => { // the picture across the board's far side, a row of squares under it
        const s = page(d);
        t.img(s, await L.photo(L.src(d.image), 8.75, 1.78), 0.7, 1.28, 8.75, 1.78, { alt: '' });
        checks(s, 0.7, 3.06, 8.75, 35);
        t.text(s, d.text, { x: 0.7, y: 3.42, w: 8.75, h: 1.72, fontSize: L.fit(d.text, 8.75, 1.72, 15, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
      },
      async (d) => { // the photo fills the room, the score sheet lies over it, a queen on watch
        const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        t.img(s, strip, 0, 0, 0.32, H);
        panel(s, 5.0, 0.3, 4.65, 4.75);
        await piece(s, 'queen', 5.15, 0.4, 0.82, true);
        t.text(s, d.title, { x: 5.85, y: 0.4, w: 3.65, h: 0.82, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 3.65, 0.8, 19, 12, F.head, true) });
        t.text(s, d.text, { x: 5.2, y: 1.3, w: 4.25, h: 3.65, fontSize: L.fit(d.text, 4.25, 3.65, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0.32, 5.18, W - 0.32, 0.34, C.bg, { name: 'Footer' }); footer(s);
      },
      async (d) => { // the black side: a round picture, a white rook at its shoulder
        const s = nightPage(d), dia = 3.3, x = 5.9, y = 1.5;
        t.oval(s, x - 0.1, y - 0.1, dia + 0.2, dia + 0.2, C.dark);
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
        await piece(s, 'rook', 5.25, 3.82, 1.3);
        t.text(s, d.text, { x: 0.7, y: 1.3, w: 4.4, h: 3.8, fontSize: L.fit(d.text, 4.4, 3.8, 14, 10, F.body, false, 1.2), color: C.white, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the picture sits in the middle of a whole board, like a position to study
        const s = page(d), dd = 3.78, x = 5.67, y = 1.33, sq = dd / 8;
        t.img(s, board8, x, y, dd, dd);
        t.img(s, await L.photo(L.src(d.image), sq * 6, sq * 6), x + sq, y + sq, sq * 6, sq * 6, { alt: '' });
        t.text(s, d.text, { x: 0.7, y: 1.3, w: 4.65, h: 3.82, fontSize: L.fit(d.text, 4.65, 3.82, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // ranks of the board: each row opens with a square and its piece
        const s = page(d), n = d.items.length, gap = 0.08, h = (3.8 - gap * (n - 1)) / n, sq = Math.min(h, 0.86);
        for (const [i, it] of d.items.entries()) {
          const y = 1.32 + i * (h + gap), dk = i % 2 === 1;
          t.rect(s, 0.7, y, 8.75, h, dk ? C.light : C.white, { name: 'Rank' });
          await square(s, 0.7, y + (h - sq) / 2, sq, K(i + 1), !dk, true);
          t.img(s, await L.icon(it.icon, C.ink, 2), 1.68, y + h / 2 - 0.16, 0.32, 0.32);
          head(s, it.h, 2.1, y + 0.04, 2.3, h - 0.08, { max: 14 });
          body(s, it.t, 4.5, y + 0.04, 4.85, h - 0.08, { color: C.ink, valign: 'middle' });
        }
      },
      async (d) => { // the king in the centre, his men on the squares round him
        const s = page(d), n = d.items.length, w = 3.4, h = 1.82, cx = 5.07, cy = 3.22;
        const pos = n === 4 ? [[0.7, 1.32], [0.7, 3.3], [6.05, 1.32], [6.05, 3.3]] : [[0.7, 1.32], [0.7, 3.3], [6.05, 2.31]];
        await square(s, cx - 0.7, cy - 0.7, 1.4, 'king', false, true);
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i];
          panel(s, x, y, w, h);
          await piece(s, K(i), x + 0.1, y + 0.06, 0.5, true);
          head(s, it.h, x + 0.56, y + 0.08, w - 0.68, 0.46, { max: 14 });
          body(s, it.t, x + 0.14, y + 0.58, w - 0.28, h - 0.66, { color: C.ink });
        }
      },
      async (d) => { // the board itself: big black and pale squares, each holding an idea
        const s = page(d), n = d.items.length, w = 4.37, h = 1.9;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.75 : w, x = 0.7 + (i % 2) * w, y = 1.3 + Math.floor(i / 2) * h, dk = (i === 1 || i === 2);
          t.rect(s, x, y, ww, h, dk ? C.black : C.light, { name: 'Square' });
          t.img(s, await L.icon(it.icon, dk ? C.light : C.ink, 2), x + 0.2, y + 0.18, 0.46, 0.46);
          head(s, it.h, x + 0.82, y + 0.14, ww - 1.0, 0.5, { color: dk ? C.white : C.ink, max: 15 });
          body(s, it.t, x + 0.82, y + 0.68, ww - 1.0, h - 0.78, { color: dk ? PALE : C.ink });
        }
      },
      async (d) => { // the queen takes the big square, the others stand in her line
        const s = page(d), [a, ...rest] = d.items, n = rest.length, gap = 0.12, h = (3.78 - gap * (n - 1)) / n;
        t.rect(s, 0.7, 1.32, 4.0, 3.78, C.black, { name: 'Queen square' });
        await piece(s, 'queen', 3.2, 1.42, 1.5);
        t.img(s, await L.icon(a.icon, C.light, 2), 0.92, 1.52, 0.6, 0.6);
        head(s, a.h, 0.92, 2.2, 2.25, 0.72, { color: C.white, max: 17 });
        body(s, a.t, 0.92, 3.0, 3.55, 1.98, { color: PALE, max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = 1.32 + i * (h + gap);
          panel(s, 4.95, y, 4.5, h);
          await piece(s, K(i + 1), 5.02, y + 0.06, Math.min(0.62, h - 0.12), true);
          head(s, it.h, 5.6, y + 0.04, 3.75, 0.38, { max: 13 });
          body(s, it.t, 5.6, y + 0.43, 3.75, h - 0.49, { color: C.ink });
        }
      },
    ],
    process: [
      async (d) => { // the pawn climbs the board rank by rank, and promotes at the top
        const s = page(d), n = d.steps.length, cw = 8.75 / n, sq = 0.78, kinds = n === 3 ? ['pawn', 'rook', 'queen'] : ['pawn', 'knight', 'rook', 'queen'];
        for (const [i, st] of d.steps.entries()) {
          const x = 0.7 + i * cw, w = cw - 0.16, y = 2.76 - i * (1.42 / (n - 1));
          await square(s, x, y, sq, kinds[i], i % 2 === 1, true);
          t.text(s, String(i + 1), { x: x + sq + 0.08, y, w: 0.7, h: sq, fontFace: F.head, bold: true, fontSize: 30, color: C.accent, valign: 'middle' });
          head(s, st.h, x, y + sq + 0.03, w, 0.4, { max: 13 });
          body(s, st.t, x, y + sq + 0.44, w, 5.14 - (y + sq + 0.44), { color: C.ink, max: 13 });
        }
      },
      async (d) => { // one file of squares down the middle, moves played out to either side
        const s = page(d), n = d.steps.length, h = 1.2, sq = 0.5, w = 3.95, dy = (3.8 - h) / (n - 1), Y = (i) => 1.32 + i * dy, cx = 5.07;
        const rows = Math.floor(3.8 / sq); for (let k = 0; k < rows; k++) t.rect(s, cx - sq / 2, 1.32 + k * (3.8 / rows), sq, 3.8 / rows, k % 2 ? C.dark : C.light, { name: 'File' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? cx + sq / 2 + 0.1 : cx - sq / 2 - 0.1 - w, y = Y(i);
          panel(s, x, y, w, h, right);
          numSq(s, i + 1, cx - sq / 2, y + 0.02, sq, true);
          head(s, st.h, x + 0.14, y + 0.05, w - 0.28, 0.36, { color: right ? C.light : C.ink, max: 14 });
          body(s, st.t, x + 0.14, y + 0.43, w - 0.28, h - 0.49, { color: right ? PALE : C.ink });
        }
      },
      async (d) => { // the black side: columns out of step, the piece at the head or the foot
        const s = nightPage(d), n = d.steps.length, cw = 8.75 / n, sq = 0.82, kinds = ['pawn', 'knight', 'rook', 'queen'];
        for (const [i, st] of d.steps.entries()) {
          const x = 0.7 + i * cw, w = cw - 0.2, foot = i % 2 === 1, tTop = foot ? 1.32 : 1.32 + sq + 0.06;
          await square(s, x, foot ? 5.12 - sq : 1.32, sq, kinds[i], foot, false);
          t.text(s, String(i + 1), { x: x + sq + 0.1, y: foot ? 5.12 - sq : 1.32, w: 0.6, h: sq, fontFace: F.head, bold: true, fontSize: 28, color: C.light, valign: 'middle' });
          head(s, st.h, x, tTop, w, 0.44, { color: C.white, max: 14 });
          body(s, st.t, x, tTop + 0.46, w, 3.8 - sq - 0.06 - 0.46, { color: PALE, max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // the decisive figure on a great dark square, the king beside it
        const s = page(d), [a, b, c] = d.stats;
        t.rect(s, 0.7, 1.32, 4.9, 3.78, C.black, { name: 'Square' });
        await piece(s, 'king', 0.82, 1.45, 1.75);
        t.text(s, a.value, { x: 2.05, y: 1.45, w: 3.45, h: 1.75, fontFace: F.head, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.35, 1.6, 54, 22, F.head, true) });
        body(s, a.label, 0.95, 3.35, 4.4, 1.6, { color: PALE, align: 'center', valign: 'middle', max: 16 });
        for (const [i, x] of [b, c].entries()) {
          const y = 1.32 + i * 1.08;
          await square(s, 5.8, y, 0.98, i ? 'knight' : 'bishop', i === 1, true);
          head(s, x.value, 6.88, y, 2.57, 0.46, { color: C.accent, max: 22 });
          body(s, x.label, 6.88, y + 0.46, 2.57, 0.52, { color: C.ink, max: 11 });
        }
        if (d.note) body(s, d.note, 5.8, 3.5, 3.65, 1.6, { valign: 'middle', max: 13 });
      },
      async (d) => { // the black side: a three-faced chess clock
        const s = nightPage(d), dia = 1.85, cw = 8.75 / 3;
        t.rect(s, 0.7, 1.5, 8.75, 2.34, '3A3631', { r: 0.1, name: 'Clock body' });
        d.stats.forEach((x, i) => {
          const px = 0.7 + i * cw + (cw - dia) / 2, on = i === 0;
          t.rect(s, px + dia / 2 - 0.3, 1.32, 0.6, 0.18, on ? C.accent : C.dark, { name: 'Clock button' });
          t.oval(s, px, 1.74, dia, dia, C.white, { line: { color: on ? C.accent : C.dark, width: 4 } });
          t.text(s, x.value, { x: px + 0.1, y: 1.74, w: dia - 0.2, h: dia, fontFace: F.head, bold: true, color: on ? C.accent : C.ink, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 0.3, 0.8, 30, 13, F.head, true) });
          body(s, x.label, 0.7 + i * cw + 0.1, 3.88, cw - 0.2, 0.52, { color: C.white, align: 'center', max: 12 });
        });
        if (d.note) body(s, d.note, 0.7, 4.42, 8.75, 0.74, { color: PALE, valign: 'middle', align: 'center', max: 11 });
      },
    ],
    compare: [
      async (d) => { // white against black: the board split in two, the kings face each other
        const s = page(d), y0 = 1.3, h = 3.82, cx = 5.07, tw = 3.35;
        t.rect(s, 0.7, y0, cx - 0.7, h, C.light, { name: 'White side' });
        t.rect(s, cx, y0, 9.45 - cx, h, C.black, { name: 'Black side' });
        await piece(s, 'king', cx - 0.72, y0 + 0.08, 0.86, true);
        await piece(s, 'king', cx + 0.06, y0 + 0.08, 0.86);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.72 : cx - 0.72 - tw, a = i ? 'left' : 'right', col = i ? C.white : C.ink, n = side.items.length, rh = 2.78 / n;
          head(s, side.h, x, y0 + 0.14, tw, 0.72, { color: i ? C.light : C.ink, align: a, max: 17 });
          side.items.forEach((it, k) => body(s, it, i ? cx + 0.2 : 0.88, y0 + 0.96 + k * rh, 3.98, rh - 0.05, { color: col, align: a, valign: 'middle', max: 14 }));
        }
      },
      async (d) => { // white's line above, black's below, each move in its own square
        const s = page(d), h = 1.84;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.32 + i * (h + 0.12), dk = i === 1, n = side.items.length, cw = 6.45 / n;
          t.rect(s, 0.7, y, 8.75, h, dk ? C.black : C.white, { line: { color: C.dark, width: 1.5 }, name: 'Band' });
          await piece(s, 'rook', 0.8, y + 0.1, 0.78, !dk);
          head(s, side.h, 0.82, y + 0.9, 2.05, h - 0.96, { color: dk ? C.light : C.ink, max: 14, valign: 'top' });
          side.items.forEach((it, k) => {
            const x = 2.95 + k * cw;
            t.rect(s, x, y + 0.08, cw - 0.06, h - 0.16, k % 2 ? (dk ? '3A3631' : 'F7F2EA') : (dk ? '2E2B27' : C.light), { name: 'Square' });
            body(s, it, x + 0.08, y + 0.12, cw - 0.22, h - 0.24, { color: dk ? PALE : C.ink, valign: 'middle' });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the black side: the words alone, a knight looking at them
        const s = nightPage(d), bottom = d.caption ? 3.75 : 5.1;
        t.img(s, board8, 7.45, 3.15, 2.0, 2.0);
        await piece(s, 'knight', 7.92, 3.32, 1.6);
        t.text(s, L.runs(d.text), { x: 0.7, y: 1.25, w: d.caption ? 8.75 : 6.5, h: bottom - 1.3, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, d.caption ? 6.5 : 6.5, bottom - 1.4, 34, 16, F.head, true) });
        if (d.caption) body(s, d.caption, 0.7, 3.85, 6.5, 1.28, { color: PALE, max: 13 });
      },
      async (d) => { // checkers along both edges, the thought between them, centred
        const s = page(d), dd = 8.75 / 25;
        checks(s, 0.7, 1.26, 8.75, 25);
        t.text(s, L.runs(d.text), { x: 1.0, y: 1.68, w: 8.15, h: d.caption ? 1.72 : 2.95, fontFace: F.head, bold: true, color: C.accent, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 8.15, d.caption ? 1.65 : 2.85, 32, 16, F.head, true) });
        if (d.caption) body(s, d.caption, 1.0, 3.42, 8.15, 1.3, { color: C.ink, align: 'center', valign: 'middle', max: 13 });
        checks(s, 0.7, 5.15 - dd, 8.75, 25);
      },
    ],
    timeline: [
      async (d) => { // the score sheet: the years as move numbers, lines ruled under each
        const s = page(d), y0 = 1.32, rh = 3.8 / 4;
        panel(s, 0.7, y0, 8.75, 3.8);
        t.rect(s, 0.7, y0, 1.7, 3.8, C.black, { name: 'Moves' });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          if (i) { t.line(s, 2.4, y, 7.05, 0, C.dark, 1); t.line(s, 0.7, y, 1.7, 0, C.muted, 1); }
          t.text(s, it.year, { x: 0.76, y, w: 1.58, h: rh, fontFace: F.head, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.5, 0.6, 18, 11, F.head, true) });
          head(s, it.h, 2.55, y + 0.05, 6.8, 0.32, { max: 13 });
          body(s, it.t, 2.55, y + 0.37, 6.8, rh - 0.43, { color: C.ink });
        }
      },
      async (d) => { // a strip of squares across the board, events above and below it
        const s = page(d), dd = 8.75 / 25, cy = 3.22, w = 4.3, h = 1.62;
        checks(s, 0.7, cy - dd / 2, 8.75, 25);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = i < 2 ? 0.7 : 5.15, y = up ? cy - dd / 2 - h - 0.04 : cy + dd / 2 + 0.04, dk = i % 2 === 1;
          panel(s, x, y, w, h, dk);
          await piece(s, K(i + 1), x + w - 0.56, y + 0.05, 0.56, !dk);
          t.text(s, it.year, { x: x + 0.14, y: y + 0.05, w: 1.8, h: 0.36, fontFace: F.head, bold: true, color: dk ? C.light : C.accent, valign: 'middle', fontSize: L.fit(it.year, 1.76, 0.34, 18, 10, F.head, true) });
          head(s, it.h, x + 1.96, y + 0.05, w - 2.6, 0.36, { color: dk ? C.white : C.ink, max: 12 });
          body(s, it.t, x + 0.14, y + 0.62, w - 0.28, h - 0.68, { color: dk ? PALE : C.ink });
        }
      },
      async (d) => { // the black side: an attack coming down the board, square by square
        const s = nightPage(d), cw = 8.75 / 4, sq = 0.62, w = cw - 0.16;
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + i * cw, y = 1.3 + i * 0.42;
          t.rect(s, x, y, w, sq, i % 2 ? C.dark : C.light, { name: 'Year' });
          t.text(s, it.year, { x: x + 0.05, y, w: w - 0.1, h: sq, fontFace: F.head, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.2, 0.55, 20, 11, F.head, true) });
          head(s, it.h, x, y + sq + 0.04, w, 0.34, { color: C.white, max: 13 });
          body(s, it.t, x, y + sq + 0.4, w, 5.14 - (y + sq + 0.4), { color: PALE, max: 13 });
        }
      },
    ],
  };
  R.timeline = V.timeline.shift(); // the old timeline columns looked like the process columns
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Shaxmat', colors: { dk1: C.ink, lt1: C.white, dk2: C.black, lt2: C.bg, accent1: C.dark, accent2: C.light, accent3: C.accent, accent4: C.muted, accent5: '8C6239', accent6: 'D9C2A0', hlink: C.accent, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "strategik fikrlash: maqsad, yurish va natija; mantiqiy, asosli, bosqichma-bosqich", limits: {}, prefer: null };
module.exports = { id: 67, slug: 'shaxmat', name: 'Şaxmat', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "technical"], "transitions": ["checker", "fade", "morph"], "cover": ["focusIn", "fadeLetters"], "mark": "drop", "deco": "checker", "sig": {"title": "focusIn", "body": "fade", "item": "drop", "image": "checker", "number": "drop", "order": "diagonal", "stagger": 0.16}, "tempo": 1.05, "kenburns": false};
