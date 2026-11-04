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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Shaxmat', colors: { dk1: C.ink, lt1: C.white, dk2: C.black, lt2: C.bg, accent1: C.dark, accent2: C.light, accent3: C.accent, accent4: C.muted, accent5: '8C6239', accent6: 'D9C2A0', hlink: C.accent, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "strategik fikrlash: maqsad, yurish va natija; mantiqiy, asosli, bosqichma-bosqich", limits: {}, prefer: null };
module.exports = { id: 67, slug: 'shaxmat', name: 'Şaxmat', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "technical"], "transitions": ["checker", "fade", "morph"], "cover": ["focusIn", "fadeLetters"], "mark": "drop", "deco": "checker", "sig": {"title": "focusIn", "body": "fade", "item": "drop", "image": "checker", "number": "drop", "order": "diagonal", "stagger": 0.16}, "tempo": 1.05, "kenburns": false};
