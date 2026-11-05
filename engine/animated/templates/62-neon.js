/**
 * 62 Neon — neon signs on a dark brick wall: glowing tube outlines in pink, cyan, yellow
 * and green, dark sign boards for text, a glowing frame around the photo.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { wall: '2A1C1D', mortar: '170E0F', board: '120C0E', text: 'F5EEF0', muted: 'B8A9AE', neon: ['FF3EA5', '2DE2E6', 'FFE66D', '7CFF6B', 'B88CFF', 'FF9A3C'] };
const F = { head: 'Arial', body: 'Calibri' };

const brickSvg = () => { let b = '', x0 = 7; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let r = 0; r < 19; r++) for (let c = -1; c < 14; c++) { const x = c * 124 + (r % 2 ? 62 : 0), y = r * 48, v = Math.round(rnd() * 14) - 7;
    const col = [0x2a + v, 0x1c + v, 0x1d + v].map((n) => Math.max(0, n).toString(16).padStart(2, '0')).join('');
    b += `<rect x="${x + 3}" y="${y + 3}" width="118" height="42" rx="3" fill="#${col}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.mortar}"/>${b}<rect width="1600" height="900" fill="#000" opacity="0.25"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(brickSvg(), 1600, 900, true);
  const glow = (c) => ({ glow: { size: 8, opacity: 0.6, color: c } });
  // neon tube: coloured outline with a pale core line inside
  const tube = (s, x, y, w, h, c, r = 0.12) => { t.rect(s, x, y, w, h, null, { r, line: { color: c, width: 3.5 }, name: 'Neon tube' }); t.rect(s, x + 0.02, y + 0.02, w - 0.04, h - 0.04, null, { r, line: { color: 'FFFFFF', width: 0.75, transparency: 40 }, name: 'Tube core' }); };
  const board = (s, x, y, w, h, c) => { t.rect(s, x, y, w, h, C.board, { r: 0.12, t: 12, name: 'Sign board' }); tube(s, x, y, w, h, c); };
  const ring = (s, x, y, d, c, n) => { t.oval(s, x, y, d, d, C.board, { line: { color: c, width: 3.5 } }); t.text(s, String(n), { x, y, w: d, h: d, fontSize: Math.round(d * 26), bold: true, color: c, align: 'center', valign: 'middle', ...glow(c) }); };
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    ring(s, 0.5, 0.38, 0.65, C.neon[idx % 6], idx);
    if (d.title) t.text(s, d.title, { x: 1.35, y: 0.38, w: 8.1, h: 0.65, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.65, 28, 16, F.head, true), ...glow(C.neon[idx % 6]) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.text, lineSpacingMultiple: 1.3, valign: 'middle' });
  const photo = async (s, src, x, y, w, h, c) => { tube(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, c, 0.15); t.img(s, await L.photo(L.src(src), w, h, { mask: { r: 0.08 } }), x, y, w, h, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.image) await photo(s, d.image, 6.25, 0.75, 3.15, 3.0, C.neon[1]);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.6, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: C.neon[2], charSpacing: 2, ...glow(C.neon[2]) });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 5.4, h: 2.3, bold: true, fontSize: L.fit(d.title, 5.4, 2.2, 42, 20, F.head, true), color: C.text, valign: 'bottom', ...glow(C.neon[0]) });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 5.3, h: 0.75, fontSize: 13, color: C.muted });
    board(s, 0.6, 4.25, 4.0, 0.6, C.neon[0]);
    t.text(s, M.author || '', { x: 0.75, y: 4.25, w: 3.7, h: 0.6, fontSize: 15, bold: true, color: C.neon[0], valign: 'middle', ...glow(C.neon[0]) });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await photo(s, d.image, 0.7, 1.55, 3.7, 3.2, C.neon[0]); board(s, 4.85, 1.4, 4.6, 3.65, C.neon[1]); para(s, d.text, 5.1, 1.55, 4.1, 3.35); },
    async image(d) { const s = page(d); board(s, 0.55, 1.4, 4.6, 3.65, C.neon[2]); para(s, d.text, 0.8, 1.55, 4.1, 3.35); await photo(s, d.image, 5.6, 1.55, 3.75, 3.2, C.neon[3]); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.45 + (i % per) * rh;
        ring(s, x, y, 0.62, C.neon[i % 6], i + 1);
        t.text(s, it, { x: x + 0.8, y, w: 3.45, h: 0.62, fontSize: 16, bold: true, color: C.text, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.22, w = (8.9 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.55 + i * (w + gap), c = C.neon[i % 6];
        board(s, x, 1.4, w, 3.65, c);
        t.img(s, await L.icon(it.icon, c, 2), x + 0.22, 1.6, 0.42, 0.42);
        t.text(s, it.h, { x: x + 0.22, y: 2.12, w: w - 0.44, h: 0.6, fontSize: L.fit(it.h, w - 0.44, 0.6, 17, 11, F.head, true), bold: true, color: c, valign: 'middle', ...glow(c) });
        t.text(s, it.t, { x: x + 0.22, y: 2.75, w: w - 0.44, h: 2.15, fontSize: 14, color: C.text });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.9 / n;
      t.line(s, 0.55 + 0.35, 1.8, cw * (n - 1), 0, C.neon[1], 2.5, { dash: 'dash' });
      d.steps.forEach((st, i) => {
        const x = 0.55 + i * cw, c = C.neon[i % 6];
        ring(s, x, 1.45, 0.7, c, i + 1);
        t.text(s, st.h, { x, y: 2.35, w: cw - 0.25, h: 0.55, fontSize: L.fit(st.h, cw - 0.25, 0.55, 17, 11, F.head, true), bold: true, color: c, valign: 'middle' });
        board(s, x, 2.95, cw - 0.25, 2.1, c);
        t.text(s, st.t, { x: x + 0.15, y: 3.05, w: cw - 0.55, h: 1.9, fontSize: 13, color: C.text });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (8.9 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.55 + i * (w + gap), c = C.neon[i % 6];
        board(s, px, 1.45, w, 2.75, c);
        t.text(s, x.value, { x: px + 0.2, y: 1.6, w: w - 0.4, h: 1.25, fontSize: L.fit(x.value, w - 0.4, 1.15, 54, 24, F.head, true), bold: true, color: c, align: 'center', valign: 'middle', ...glow(c) });
        t.text(s, x.label, { x: px + 0.2, y: 2.9, w: w - 0.4, h: 1.2, fontSize: 13, color: C.text, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.55, y: 4.35, w: 8.9, h: 0.75, fontSize: 11, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.35;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.9 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.55 + i * (w + 0.2), c = C.neon[i ? 1 : 0];
        board(s, x, 1.4, w, 3.65, c);
        t.text(s, side.h, { x: x + 0.3, y: 1.55, w: w - 0.6, h: 0.55, fontSize: 18, bold: true, color: c, valign: 'middle', ...glow(c) });
        let y = 2.2;
        side.items.forEach((it, k) => { t.oval(s, x + 0.3, y + 0.08, 0.15, 0.15, c); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[k], fontSize: fs, color: C.text }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      board(s, 0.9, 1.35, 8.2, 2.6, C.neon[4]);
      t.text(s, L.runs(d.text), { x: 1.3, y: 1.45, w: 7.4, h: 2.4, bold: true, fontSize: L.fit(d.text, 7.4, 2.3, 36, 18, F.head, true), color: C.text, align: 'center', valign: 'middle', ...glow(C.neon[4]) });
      if (d.caption) t.text(s, d.caption, { x: 0.9, y: 4.1, w: 8.2, h: 1.0, fontSize: 13, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.9 / n;
      t.line(s, 0.55, 2.2, 8.9, 0, C.neon[2], 3);
      d.items.forEach((it, i) => {
        const x = 0.55 + i * cw, c = C.neon[i % 6];
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.65, fontSize: L.fit(it.year, cw - 0.3, 0.6, 26, 12, F.head, true), bold: true, color: c, valign: 'bottom', ...glow(c) });
        t.oval(s, x, 2.08, 0.24, 0.24, c);
        t.text(s, it.h, { x, y: 2.5, w: cw - 0.25, h: 0.5, fontSize: 16, bold: true, color: C.text });
        t.text(s, it.t, { x, y: 3.0, w: cw - 0.25, h: 2.05, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      tube(s, 1.0, 1.0, 8.0, 3.4, C.neon[0], 0.3);
      t.text(s, d.text, { x: 1.4, y: 1.2, w: 7.2, h: 2.3, italic: true, bold: true, fontSize: L.fit(d.text, 7.2, 2.2, 32, 16, F.head, true), color: C.text, align: 'center', valign: 'middle', ...glow(C.neon[0]) });
      if (d.author) t.text(s, d.author, { x: 1.4, y: 3.6, w: 7.2, h: 0.45, fontSize: 15, bold: true, color: C.neon[2], align: 'center' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      board(s, 0.55, 1.4, 8.9, rh * n + 0.15, C.neon[1]);
      d.items.forEach((it, i) => {
        const y = 1.47 + i * rh;
        t.text(s, String(i + 1), { x: 0.7, y, w: 0.4, h: rh, fontSize: 15, bold: true, color: C.neon[i % 6], valign: 'middle' });
        t.text(s, it, { x: 1.15, y, w: 8.15, h: rh, fontSize: 13, color: C.text, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all in neon on the brick wall: a deck's pages must not look alike (L.pages)
  const INK = '140A0C', LEMON = C.neon[2], [PINK, CYAN, , LIME, VIOLET, AMBER] = C.neon;
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.text, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, c, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10, F.head, true), color: c, align: o.align, valign: o.valign || 'middle', ...(o.plain ? {} : glow(c)) });
  // a tube bent along any outline, inches on the whole slide
  const bend = async (s, list, wd = 3.5) => t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${list.map(([p, c]) => `<path d="${p}" fill="none" stroke="#${c}" stroke-width="${wd * 1.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${p}" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="${wd * 0.35}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`, 1000, 563), 0, 0, W, H);
  const P = (v) => Math.round(v * 100);
  const path = (pts, close) => `M${pts.map(([a, b]) => `${P(a)},${P(b)}`).join(' L')}${close ? ' Z' : ''}`;
  const bulbs = (s, x, y, w, c, gap = 0.26) => { const n = Math.floor(w / gap); for (let k = 0; k <= n; k++) t.oval(s, x + (w * k) / n - 0.05, y - 0.05, 0.1, 0.1, k % 2 ? c : 'FFF6C8'); };
  const lit = (s, x, y, w, h, c) => { t.rect(s, x, y, w, h, c, { r: 0.12, name: 'Lit sign' }); t.rect(s, x + 0.05, y + 0.05, w - 0.1, h - 0.1, null, { r: 0.1, line: { color: INK, width: 0.75 }, name: 'Sign edge' }); };
  const V = {
    image: [
      async (d) => { // a round neon sign with the picture inside two rings
        const s = page(d), dia = 3.25, x = 0.75, y = 1.55;
        t.oval(s, x - 0.14, y - 0.14, dia + 0.28, dia + 0.28, null, { line: { color: PINK, width: 3.5 } });
        t.oval(s, x - 0.05, y - 0.05, dia + 0.1, dia + 0.1, null, { line: { color: CYAN, width: 2 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
        board(s, 4.6, 1.4, 4.9, 3.65, PINK);
        t.text(s, d.text, { x: 4.82, y: 1.5, w: 4.46, h: 3.45, fontSize: L.fit(d.text, 4.46, 3.45, 15, 10, F.body, false, 1.2), color: C.text, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the street itself fills the page, one sign board hangs over it
        const s = pres.addSlide(); s.background = { data: bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        t.rect(s, 5.0, 0.3, 4.65, 4.75, C.board, { r: 0.12, name: 'Sign board' }); tube(s, 5.0, 0.3, 4.65, 4.75, CYAN);
        ring(s, 5.18, 0.46, 0.58, CYAN, idx);
        t.text(s, d.title, { x: 5.88, y: 0.42, w: 3.62, h: 0.68, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.title, 3.62, 0.66, 19, 12, F.head, true), ...glow(CYAN) });
        t.text(s, d.text, { x: 5.22, y: 1.2, w: 4.2, h: 3.72, fontSize: L.fit(d.text, 4.2, 3.72, 14, 10, F.body, false, 1.15), color: C.text, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0, 5.18, W, 0.34, C.board, { name: 'Footer' }); footer(s);
      },
      async (d) => { // a theatre marquee: the picture wide, running bulbs round it, words under it
        const s = page(d), x = 0.75, y = 1.42, w = 8.5, h = 1.72;
        bulbs(s, x - 0.14, y - 0.14, w + 0.28, LEMON); bulbs(s, x - 0.14, y + h + 0.14, w + 0.28, LEMON);
        for (let k = 0; k <= 6; k++) { const q = y - 0.14 + ((h + 0.28) * k) / 6; t.oval(s, x - 0.19, q - 0.05, 0.1, 0.1, k % 2 ? LEMON : 'FFF6C8'); t.oval(s, x + w + 0.09, q - 0.05, 0.1, 0.1, k % 2 ? LEMON : 'FFF6C8'); }
        t.img(s, await L.photo(L.src(d.image), w, h), x, y, w, h, { alt: '' });
        t.text(s, d.text, { x: 0.6, y: 3.42, w: 8.8, h: 1.72, fontSize: L.fit(d.text, 8.8, 1.72, 15, 10, F.body, false, 1.1), color: C.text, lineSpacingMultiple: 1.1, valign: 'middle' });
      },
      async (d) => { // an arrow sign with the picture inside, pointing back at the words
        const s = page(d), x = 4.95, y = 1.45, w = 4.55, h = 3.55, Q = [[0, 0.5], [0.22, 0], [1, 0], [1, 1], [0.22, 1]];
        await bend(s, [[path(Q.map(([a, b]) => [x + a * w, y + b * h]), true), LIME]]);
        const iw = w - 0.2, ih = h - 0.2;
        t.img(s, await L.photo(L.src(d.image), iw, ih, { mask: { poly: Q } }), x + 0.1, y + 0.1, iw, ih, { alt: '' });
        t.text(s, d.text, { x: 0.55, y: 1.35, w: 4.3, h: 3.75, fontSize: L.fit(d.text, 4.3, 3.75, 15, 10, F.body, false, 1.2), color: C.text, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // arrow signs stacked on the wall, each pointing right
        const s = page(d), n = d.items.length, gap = 0.12, h = (3.74 - gap * (n - 1)) / n, x = 0.55, w = 8.9;
        await bend(s, d.items.map((_, i) => { const y = 1.35 + i * (h + gap); return [path([[x, y], [x + w - 0.45, y], [x + w, y + h / 2], [x + w - 0.45, y + h], [x, y + h]], true), C.neon[i]]; }));
        for (const [i, it] of d.items.entries()) {
          const y = 1.35 + i * (h + gap), c = C.neon[i];
          t.img(s, await L.icon(it.icon, c, 2), x + 0.2, y + h / 2 - 0.2, 0.4, 0.4);
          head(s, it.h, x + 0.78, y + 0.05, 2.3, h - 0.1, c, { max: 15 });
          body(s, it.t, x + 3.2, y + 0.05, 5.1, h - 0.1, { valign: 'middle' });
        }
      },
      async (d) => { // a bright junction box, a tube running out to each sign
        const s = page(d), n = d.items.length, w = 3.55, h = 1.8, cy = 3.2;
        const pos = n === 4 ? [[0.5, 1.33], [0.5, 3.27], [5.95, 1.33], [5.95, 3.27]] : [[0.5, 1.33], [0.5, 3.27], [5.95, 2.3]];
        await bend(s, pos.map(([x, y], i) => [path([[5, cy], [x < 5 ? 4.3 : 5.7, y + h / 2], [x < 5 ? x + w : x, y + h / 2]]), C.neon[i]]), 3);
        t.oval(s, 4.45, cy - 0.55, 1.1, 1.1, C.board, { line: { color: LEMON, width: 3.5 } });
        t.img(s, await L.icon('FiZap', LEMON, 2), 4.72, cy - 0.28, 0.56, 0.56);
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i], c = C.neon[i];
          board(s, x, y, w, h, c);
          t.img(s, await L.icon(it.icon, c, 2), x + 0.15, y + 0.12, 0.34, 0.34);
          head(s, it.h, x + 0.58, y + 0.08, w - 0.72, 0.44, c, { max: 14 });
          body(s, it.t, x + 0.15, y + 0.56, w - 0.3, h - 0.64);
        }
      },
      async (d) => { // the signs switched full on: lit panels, dark letters
        const s = page(d), n = d.items.length, w = 4.4, h = 1.8, cols = [LEMON, CYAN, LIME, PINK];
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.33 + Math.floor(i / 2) * (h + 0.14);
          lit(s, x, y, ww, h, cols[i]);
          t.img(s, await L.icon(it.icon, INK, 2.2), x + 0.2, y + 0.2, 0.46, 0.46);
          head(s, it.h, x + 0.82, y + 0.14, ww - 1.0, 0.46, INK, { plain: true, max: 15 });
          body(s, it.t, x + 0.82, y + 0.62, ww - 1.0, h - 0.72, { color: INK });
        }
      },
      async (d) => { // the headliner in a double tube, the supporting acts stacked beside it
        const s = page(d), [a, ...rest] = d.items, n = rest.length, gap = 0.14, h = (3.68 - gap * (n - 1)) / n;
        board(s, 0.55, 1.38, 3.95, 3.68, PINK); tube(s, 0.65, 1.48, 3.75, 3.48, CYAN);
        t.img(s, await L.icon(a.icon, PINK, 2), 0.88, 1.68, 0.68, 0.68);
        head(s, a.h, 0.88, 2.44, 3.3, 0.6, PINK, { max: 19 });
        body(s, a.t, 0.88, 3.06, 3.3, 1.75, { max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = 1.38 + i * (h + gap), c = C.neon[(i + 1) % 6];
          t.rect(s, 4.8, y, 0.06, h, c, { name: 'Tube' });
          t.img(s, await L.icon(it.icon, c, 2), 5.0, y + 0.06, 0.34, 0.34);
          head(s, it.h, 5.44, y + 0.03, 4.05, 0.4, c, { max: 14 });
          body(s, it.t, 5.0, y + 0.46, 4.5, h - 0.5);
        }
      },
    ],
    process: [
      async (d) => { // one tube drops down the wall in steps, a ring on each landing
        const s = page(d), n = d.steps.length, cw = 8.9 / n, w = cw - 0.2, h = 1.85, dy = (3.74 - h) / (n - 1), X = (i) => 0.55 + i * cw, Y = (i) => 1.35 + i * dy;
        await bend(s, d.steps.slice(1).map((_, i) => [path([[X(i) + w, Y(i) + 0.3], [X(i + 1) + 0.33, Y(i) + 0.3], [X(i + 1) + 0.33, Y(i + 1)]]), C.neon[i]]));
        for (const [i, st] of d.steps.entries()) {
          const x = X(i), y = Y(i), c = C.neon[i];
          board(s, x, y, w, h, c);
          ring(s, x + 0.1, y + 0.08, 0.46, c, i + 1);
          head(s, st.h, x + 0.62, y + 0.05, w - 0.72, 0.52, c, { max: 13 });
          body(s, st.t, x + 0.12, y + 0.6, w - 0.24, h - 0.66);
        }
      },
      async (d) => { // a tube straight down the middle, signs left and right of it
        const s = page(d), n = d.steps.length, h = 1.2, w = 4.15, dy = (3.74 - h) / (n - 1), Y = (i) => 1.35 + i * dy;
        await bend(s, [[path([[5, 1.32], [5, 5.1]]), VIOLET]], 3.5);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.35 : 0.5, y = Y(i), c = C.neon[i];
          t.line(s, right ? 5 : 4.65, y + 0.28, 0.35, 0, c, 2.5);
          board(s, x, y, w, h, c);
          ring(s, 4.76, y + 0.04, 0.48, c, i + 1);
          head(s, st.h, x + 0.14, y + 0.06, w - 0.28, 0.34, c, { max: 14 });
          body(s, st.t, x + 0.14, y + 0.42, w - 0.28, h - 0.48);
        }
      },
      async (d) => { // one long tube bent back and forth, a step in every lane
        const s = page(d), n = d.steps.length, lane = 3.74 / n, x0 = 0.6, x1 = 9.4, Y = (i) => 1.35 + i * lane;
        await bend(s, [[`M${P(x0)},${P(Y(0) + 0.03)} ` + d.steps.map((_, i) => { const a = i % 2 ? x0 : x1, b = i % 2 ? x1 : x0; return `L${P(a)},${P(Y(i) + 0.03)} A${P(lane / 2 - 0.03)},${P(lane / 2 - 0.03)} 0 0 ${i % 2 ? 0 : 1} ${P(a)},${P(Y(i + 1) + 0.03)} L${P(b)},${P(Y(i + 1) + 0.03)}`; }).join(' '), CYAN]], 3);
        for (const [i, st] of d.steps.entries()) {
          const y = Y(i), c = C.neon[(i * 2) % 6], rd = Math.min(0.5, lane - 0.28), L0 = i % 2 ? 8.9 - rd : 0.7;
          ring(s, L0, y + (lane - rd) / 2 + 0.02, rd, c, i + 1);
          const tx = i % 2 ? 0.9 : 1.32;
          head(s, st.h, tx, y + 0.08, 2.35, lane - 0.12, c, { max: 14, align: i % 2 ? 'right' : 'left' });
          const bx = i % 2 ? 3.35 : 3.8;
          body(s, st.t, bx, y + 0.08, 4.95, lane - 0.12, { valign: 'middle', align: i % 2 ? 'right' : 'left' });
        }
      },
    ],
    stats: [
      async (d) => { // one figure blazing alone on the wall, two small rings to its side
        const s = page(d), [a, b, c] = d.stats;
        t.text(s, a.value, { x: 0.5, y: 1.42, w: 5.2, h: 2.2, bold: true, color: PINK, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 5.1, 2.0, 88, 30, F.head, true), ...glow(PINK) });
        await bend(s, [[path([[1.3, 3.72], [4.9, 3.72]]), PINK]]);
        body(s, a.label, 0.9, 3.84, 4.4, 1.2, { align: 'center', max: 16 });
        [b, c].forEach((x, i) => {
          const y = 1.42 + i * 1.12, col = i ? LEMON : CYAN;
          t.oval(s, 5.95, y, 1.02, 1.02, C.board, { line: { color: col, width: 3.5 } });
          t.text(s, x.value, { x: 6.0, y, w: 0.92, h: 1.02, bold: true, color: col, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 0.86, 0.5, 18, 9, F.head, true) });
          body(s, x.label, 7.1, y + 0.06, 2.4, 0.9, { valign: 'middle', max: 13 });
        });
        if (d.note) body(s, d.note, 5.95, 3.7, 3.55, 1.38, { color: C.muted, max: 12, valign: 'middle' });
      },
      async (d) => { // three round bar signs, hung out of line
        const s = page(d), dia = 1.8, xs = [0.9, 4.1, 7.3], ys = [1.3, 1.62, 1.3];
        d.stats.forEach((x, i) => {
          const c = [CYAN, PINK, LIME][i];
          t.oval(s, xs[i], ys[i], dia, dia, C.board, { line: { color: c, width: 4 } });
          t.oval(s, xs[i] + 0.09, ys[i] + 0.09, dia - 0.18, dia - 0.18, null, { line: { color: 'FFFFFF', width: 0.75, transparency: 50 } });
          t.text(s, x.value, { x: xs[i] + 0.12, y: ys[i], w: dia - 0.24, h: dia, bold: true, color: c, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 0.34, 0.8, 30, 13, F.head, true), ...glow(c) });
          body(s, x.label, xs[i] - 0.45, ys[i] + dia + 0.04, dia + 0.9, 0.6, { align: 'center', max: 12 });
        });
        if (d.note) body(s, d.note, 0.55, 4.14, 8.9, 1.02, { color: C.muted, max: 13, align: 'center', valign: 'middle' });
      },
      async (d) => { // the bar turned up full: three lit panels side by side, dark figures
        const s = page(d), w = 2.9, gap = 0.15, cols = [LEMON, CYAN, AMBER];
        d.stats.forEach((x, i) => {
          const px = 0.5 + i * (w + gap), y = 1.32 + (i === 1 ? 0 : 0.28), h = 2.3 - (i === 1 ? 0 : 0.28);
          lit(s, px, y, w, h, cols[i]);
          t.text(s, x.value, { x: px + 0.14, y: y + 0.1, w: w - 0.28, h: h - 0.95, bold: true, color: INK, align: 'center', valign: 'middle', fontSize: L.fit(x.value, w - 0.32, h - 1.05, 44, 18, F.head, true) });
          body(s, x.label, px + 0.14, y + h - 0.82, w - 0.28, 0.72, { color: INK, align: 'center', max: 13 });
        });
        if (d.note) body(s, d.note, 0.55, 3.75, 8.9, 1.38, { max: 14, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // no boards: two colours of light read away from one bright divider
        const s = page(d), tw = 4.05;
        await bend(s, [[path([[5, 1.32], [5, 5.1]]), LEMON]], 4);
        for (const [i, side] of [d.left, d.right].entries()) {
          const c = i ? CYAN : PINK, a = i ? 'left' : 'right', x = i ? 5.3 : 0.65, n = side.items.length, rh = 3.08 / n;
          head(s, side.h, x, 1.36, tw, 0.6, c, { max: 20, align: a });
          side.items.forEach((it, k) => {
            const y = 2.0 + k * rh;
            t.oval(s, i ? 5.07 : 4.77, y + rh / 2 - 0.08, 0.16, 0.16, c);
            body(s, it, x, y + 0.03, tw, rh - 0.06, { align: a, valign: 'middle', max: 14 });
          });
        }
      },
      async (d) => { // two long boards one over the other, tube dividers between the points
        const s = page(d), h = 1.78;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.33 + i * (h + 0.16), c = i ? LIME : VIOLET, n = side.items.length, cw = 6.5 / n;
          board(s, 0.5, y, 9, h, c);
          head(s, side.h, 0.65, y + 0.1, 2.1, h - 0.2, c, { max: 17, align: 'center' });
          side.items.forEach((it, k) => {
            const x = 2.9 + k * cw;
            t.line(s, x, y + 0.14, 0, h - 0.28, c, 1.5);
            body(s, it, x + 0.1, y + 0.08, cw - 0.2, h - 0.16, { valign: 'middle' });
          });
        }
      },
    ],
    statement: [
      async (d) => { // nothing but the words in light, bulbs running above and below
        const s = page(d), bottom = d.caption ? 3.72 : 5.0;
        bulbs(s, 0.6, 1.3, 8.8, AMBER);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.42, w: 8.8, h: bottom - 1.5, bold: true, color: C.text, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 8.8, bottom - 1.6, 38, 18, F.head, true), ...glow(PINK) });
        bulbs(s, 0.6, bottom + 0.02, 8.8, AMBER);
        if (d.caption) body(s, d.caption, 0.9, 3.9, 8.2, 1.25, { color: C.muted, align: 'center', max: 14, valign: 'middle' });
      },
      async (d) => { // the whole sign lit up yellow, a small dark board for the note beside it
        const s = page(d), w = d.caption ? 5.9 : 9;
        lit(s, 0.5, 1.35, w, 3.7, LEMON);
        t.text(s, L.runs(d.text), { x: 0.8, y: 1.5, w: w - 0.6, h: 3.4, bold: true, color: INK, valign: 'middle', fontSize: L.fit(d.text, w - 0.6, 3.3, 34, 17, F.head, true) });
        if (d.caption) { board(s, 6.6, 1.35, 2.9, 3.7, CYAN); body(s, d.caption, 6.76, 1.47, 2.58, 3.46, { max: 14, valign: 'middle' }); }
      },
    ],
    timeline: [
      async (d) => { // a lightning line across the wall, signs above and below its bends
        const s = page(d), xs = [1.2, 3.45, 5.75, 8.0], cy = 3.2, w = 4.3, h = 1.62;
        await bend(s, [[path([[0.5, cy], ...xs.map((x, i) => [x, cy + (i % 2 ? 0.1 : -0.1)]), [9.5, cy]]), LEMON]], 3);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, c = C.neon[(i * 2 + 1) % 6], x = i < 2 ? 0.5 : 5.2, y = up ? 1.32 : 3.48;
          t.oval(s, xs[i] - 0.1, cy - 0.1 + (i % 2 ? 0.1 : -0.1), 0.2, 0.2, c);
          t.line(s, xs[i], up ? y + h : cy + 0.1, 0, up ? cy - 0.1 - (y + h) : y - cy - 0.1, c, 2);
          board(s, x, y, w, h, c);
          t.text(s, it.year, { x: x + 0.14, y: y + 0.05, w: 1.6, h: 0.42, bold: true, color: c, valign: 'middle', fontSize: L.fit(it.year, 1.56, 0.38, 18, 10, F.head, true), ...glow(c) });
          head(s, it.h, x + 1.8, y + 0.05, w - 1.94, 0.42, C.text, { plain: true, max: 13 });
          body(s, it.t, x + 0.14, y + 0.5, w - 0.28, h - 0.56);
        }
      },
      async (d) => { // tube pills climbing the wall, each year a step higher
        const s = page(d), cw = 2.25, w = cw - 0.15, X = (i) => 0.5 + i * cw, Y = (i) => 2.72 - i * 0.47;
        await bend(s, d.items.slice(1).map((_, i) => [path([[X(i) + 1.2, Y(i) + 0.26], [X(i + 1) - 0.01, Y(i + 1) + 0.26]]), C.neon[i]]), 2.5);
        for (const [i, it] of d.items.entries()) {
          const x = X(i), y = Y(i), c = C.neon[i];
          t.rect(s, x, y, 1.25, 0.52, C.board, { r: 0.26, line: { color: c, width: 3.5 }, name: 'Year' });
          t.text(s, it.year, { x: x + 0.06, y, w: 1.13, h: 0.52, bold: true, color: c, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.06, 0.46, 15, 8, F.head, true) });
          head(s, it.h, x, y + 0.58, w, 0.36, C.text, { plain: true, max: 13 });
          body(s, it.t, x, y + 0.96, w, 5.15 - (y + 0.96), { max: 13 });
        }
      },
    ],
  };
  R.stats = V.stats.shift(); // the old stats boards looked like the cards boards
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Neon', colors: { dk1: C.board, lt1: C.text, dk2: C.wall, lt2: C.muted, accent1: C.neon[0], accent2: C.neon[1], accent3: C.neon[2], accent4: C.neon[3], accent5: C.neon[4], accent6: C.neon[5], hlink: C.neon[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "jonli va yorqin: shahar ritmi, qisqa va esda qoladigan iboralar", limits: {}, prefer: 'visual' };
module.exports = { id: 62, slug: 'neon', name: 'Neon', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "bold"], "transitions": ["p14:flash", "cut", "fade"], "cover": ["fadeLetters", "typeLetters"], "mark": "appear", "deco": "fade", "sig": {"title": "fadeLetters", "body": "fade", "item": "dissolve", "image": "fade", "number": "appear", "order": "together", "stagger": 0.12}, "tempo": 0.9, "kenburns": false};
