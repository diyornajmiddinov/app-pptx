/**
 * 36 Piksel — 8-bit video game: notched pixel panels, pixelated photos and icons,
 * game-menu agenda, LEVEL steps, RPG dialog boxes, CREDITS for sources.
 */
const L = require('../lib.js');
const sharp = require('sharp');
const { W, H } = L;

const C = { bg: '1A1A33', panel: '2A2A50', white: 'F5F5F5', green: '4ADE80', yellow: 'FACC15', red: 'F87171', cyan: '38BDF8', purple: 'A78BFA', dim: '8080B0' };
const F = { head: 'Courier New', body: 'Courier New' };
const P = 0.07; // pixel size (inches)

const starsSvg = () => { let s = ''; let x = 7; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 70; i++) { const px = Math.floor(rnd() * 160) * 10, py = Math.floor(rnd() * 90) * 10, z = rnd() > 0.85 ? 10 : 5; s += `<rect x="${px}" y="${py}" width="${z}" height="${z}" fill="#${rnd() > 0.7 ? C.cyan : C.white}" opacity="${0.3 + rnd() * 0.5}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/>${s}</svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const sky = await L.svg(starsSvg(), 1600, 900, true);
  const UP = (x) => String(x).toUpperCase();
  const iconCache = {};
  const pxIcon = async (name, color) => (iconCache[name + color] ??= await (async () => { // pixelated icon
    const b = Buffer.from((await L.icon(name, color, 3)).split(',')[1], 'base64');
    const small = await sharp(b).resize(16, 16, { kernel: 'nearest' }).toBuffer();
    return 'image/png;base64,' + (await sharp(small).resize(160, 160, { kernel: 'nearest' }).png().toBuffer()).toString('base64');
  })());
  // notched pixel panel: border colour + inner fill, corners cut by one pixel
  const panel = (s, x, y, w, h, border = C.white, fill = C.panel) => {
    t.rect(s, x + P, y, w - 2 * P, h, border, { name: 'Pixel border' }); t.rect(s, x, y + P, w, h - 2 * P, border, { name: 'Pixel border' });
    t.rect(s, x + P, y + P, w - 2 * P, h - 2 * P, fill, { name: 'Pixel panel' });
  };
  const footer = (s) => {
    t.rect(s, 0, 5.3, W, 0.325, '11112A', { name: 'Status bar' });
    t.text(s, UP(`${M.topic || ''}  |  ${meta}`), { x: 0.3, y: 5.3, w: 9.4, h: 0.325, fontSize: 8, bold: true, color: C.dim, valign: 'middle' });
  };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: sky }; idx++;
    if (d.title) t.text(s, [{ text: '\u25B6 ', options: { color: C.red } }, { text: UP(d.title), options: { color: C.yellow } }], { x: 0.5, y: 0.35, w: 7.6, h: 0.6, bold: true, valign: 'middle', fontSize: L.fit(UP(d.title), 7.2, 0.6, 22, 12, F.head, true) });
    t.text(s, `STAGE ${L.pad2(idx)}`, { x: 7.9, y: 0.35, w: 1.6, h: 0.6, fontSize: 13, bold: true, color: C.green, align: 'right', valign: 'middle' });
    footer(s);
    return s;
  };
  const pxPhoto = async (s, src, x, y, w, h) => { panel(s, x, y, w, h, C.cyan, C.bg); t.img(s, await L.photo(L.src(src), w - 4 * P, h - 4 * P, { pixel: 96 }), x + 2 * P, y + 2 * P, w - 4 * P, h - 4 * P, { alt: '' }); };
  const txt = (s, text, x, y, w, h, color = C.white) => t.text(s, text, { x, y, w, h, fontSize: L.fit(text, w, h, 14, 9, F.body, false, 1.25), color, lineSpacingMultiple: 1.25, valign: 'middle' });

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { data: sky }; idx++;
    if (d.image) await pxPhoto(s, d.image, 6.0, 0.5, 3.5, 2.8);
    t.text(s, UP([M.org, M.loc, M.year].filter(Boolean).join(' * ')), { x: 0.5, y: 0.55, w: 5.3, h: 0.3, fontSize: 12, bold: true, color: C.cyan });
    const T = UP(d.title), fs = L.fit(T, 5.3, 2.2, 32, 16, F.head, true);
    t.text(s, T, { x: 0.5, y: 0.95, w: 5.3, h: 2.3, fontSize: fs, bold: true, color: C.yellow, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.5, y: 3.4, w: 5.2, h: 0.8, fontSize: 12, color: C.white });
    panel(s, 6.0, 3.6, 3.5, 0.75, C.green, C.panel);
    t.text(s, UP(M.author || ''), { x: 6.1, y: 3.6, w: 3.3, h: 0.75, fontSize: 13, bold: true, color: C.green, align: 'center', valign: 'middle' });
    t.text(s, kind === 'cover' ? '\u25B6 PRESS START' : 'GAME OVER  \u2665 THANKS', { x: 0.5, y: 4.5, w: 5.3, h: 0.45, fontSize: 16, bold: true, color: C.red });
    footer(s);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = page(d); await pxPhoto(s, d.image, 0.5, 1.2, 4.2, 3.7); panel(s, 5.0, 1.2, 4.5, 3.7); txt(s, d.text, 5.3, 1.4, 3.9, 3.3); },
    async image(d) { const s = page(d); panel(s, 0.5, 1.2, 4.4, 3.7); txt(s, d.text, 0.8, 1.4, 3.8, 3.3); await pxPhoto(s, d.image, 5.2, 1.2, 4.3, 3.7); },
    async agenda(d) {
      const s = page(d); panel(s, 0.5, 1.2, 9.0, 3.8);
      const rh = Math.min(0.58, 3.4 / d.items.length);
      d.items.forEach((it, i) => t.text(s, [{ text: i === 0 ? '\u25B6 ' : '  ', options: { color: C.red } }, { text: `${i + 1}. `, options: { color: C.cyan } }, { text: UP(it), options: { color: i === 0 ? C.yellow : C.white } }],
        { x: 0.9, y: 1.4 + i * rh, w: 8.4, h: rh, fontSize: 16, bold: true, valign: 'middle' }));
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap), col = [C.green, C.cyan, C.purple, C.yellow][i % 4];
        panel(s, x, 1.2, w, 3.8, col);
        panel(s, x + 0.25, 1.45, 0.9, 0.9, col, C.bg);
        t.img(s, await pxIcon(it.icon, col), x + 0.38, 1.58, 0.64, 0.64);
        t.text(s, UP(it.h), { x: x + 0.25, y: 2.5, w: w - 0.5, h: 0.6, fontSize: L.fit(UP(it.h), w - 0.5, 0.6, 14, 9, F.head, true), bold: true, color: col });
        txt(s, it.t, x + 0.25, 3.15, w - 0.5, 1.7);
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      d.steps.forEach((st, i) => {
        const x = 0.5 + i * (w + gap), y = 1.2 + (n - 1 - i) * 0.25;
        panel(s, x, y, w, 3.8 - (n - 1 - i) * 0.25, i === n - 1 ? C.yellow : C.white);
        t.text(s, `LEVEL ${i + 1}`, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.4, fontSize: 13, bold: true, color: C.red });
        t.text(s, UP(st.h), { x: x + 0.2, y: y + 0.55, w: w - 0.4, h: 0.6, fontSize: L.fit(UP(st.h), w - 0.4, 0.6, 13, 9, F.head, true), bold: true, color: C.yellow });
        txt(s, st.t, x + 0.2, y + 1.2, w - 0.4, 3.8 - (n - 1 - i) * 0.25 - 1.4);
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, rh = (d.note ? 3.3 : 3.8) / n;
      d.stats.forEach((x, i) => {
        const y = 1.2 + i * rh, col = [C.green, C.cyan, C.yellow][i % 3];
        t.text(s, x.value, { x: 0.5, y, w: 2.4, h: rh - 0.15, fontSize: L.fit(x.value, 2.4, rh - 0.2, 36, 16, F.head, true), bold: true, color: col, valign: 'middle' });
        for (let k = 0; k < 14; k++) t.rect(s, 3.1 + k * 0.42, y + 0.12, 0.34, 0.26, col, { name: 'Bar block' });
        t.text(s, UP(x.label), { x: 3.1, y: y + 0.45, w: 6.3, h: rh - 0.55, fontSize: 12, bold: true, color: C.white, valign: 'top' });
      });
      if (d.note) t.text(s, d.note, { x: 0.5, y: 4.6, w: 9.0, h: 0.5, fontSize: 10, color: C.white });
    },
    async compare(d) {
      const s = page(d), w = 4.35;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 13, w - 0.7, F.body, 0.18, 4.85 - 2.0);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.5 + i * (w + 0.3), col = i ? C.cyan : C.red;
        panel(s, x, 1.2, w, 3.8, col);
        t.text(s, `P${i + 1}: ${UP(side.h)}`, { x: x + 0.25, y: 1.35, w: w - 0.5, h: 0.5, fontSize: 14, bold: true, color: col });
        let y = 2.0;
        side.items.forEach((it, k) => { t.rect(s, x + 0.3, y + 0.08, 0.14, 0.14, col, { name: 'Pixel bullet' }); t.text(s, it, { x: x + 0.55, y, w: w - 0.75, h: rows[k], fontSize: CFS, color: C.white }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d); panel(s, 0.8, 1.3, 8.4, 2.4, C.yellow);
      t.text(s, L.runs(UP(d.text)), { x: 1.1, y: 1.45, w: 7.8, h: 2.1, fontSize: L.fit(UP(d.text), 7.8, 2.0, 28, 14, F.head, true), bold: true, color: C.yellow, align: 'center', valign: 'middle' });
      if (d.caption) txt(s, d.caption, 0.8, 3.9, 8.4, 1.1, C.white);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 9.0 / n;
      for (let k = 0; k < 60; k++) if (k % 2 === 0) t.rect(s, 0.5 + k * 0.15, 2.18, 0.1, 0.1, C.dim, { name: 'Path' });
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * cw;
        t.img(s, await pxIcon('FiFlag', [C.green, C.cyan, C.yellow, C.red][i % 4]), x, 1.55, 0.6, 0.6);
        t.text(s, it.year, { x: x + 0.65, y: 1.55, w: cw - 0.75, h: 0.6, fontSize: L.fit(it.year, cw - 0.8, 0.55, 20, 10, F.head, true), bold: true, color: C.yellow, valign: 'middle' });
        t.text(s, UP(it.h), { x, y: 2.5, w: cw - 0.25, h: 0.5, fontSize: L.fit(UP(it.h), cw - 0.3, 0.5, 13, 9, F.head, true), bold: true, color: C.cyan });
        txt(s, it.t, x, 3.05, cw - 0.25, 1.9);
      }
    },
    async quote(d) {
      const s = page({});
      panel(s, 0.6, 2.0, 8.8, 2.6, C.white, C.panel);
      if (d.author) { panel(s, 0.9, 1.6, Math.min(6, L.width(UP(d.author), 13, F.head, true) + 0.6), 0.6, C.yellow, C.bg); t.text(s, UP(d.author), { x: 1.1, y: 1.6, w: 5.8, h: 0.6, fontSize: 13, bold: true, color: C.yellow, valign: 'middle' }); }
      t.text(s, d.text, { x: 1.0, y: 2.35, w: 8.0, h: 1.9, fontSize: L.fit(d.text, 8.0, 1.85, 22, 12, F.body, true), bold: true, color: C.white, valign: 'middle' });
      t.text(s, '\u25BC', { x: 8.8, y: 4.2, w: 0.4, h: 0.3, fontSize: 14, color: C.red });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.55, 3.6 / n);
      t.text(s, '* * *  CREDITS  * * *', { x: 0.5, y: 1.15, w: 9, h: 0.35, fontSize: 14, bold: true, color: C.green, align: 'center' });
      d.items.forEach((it, i) => t.text(s, it, { x: 0.8, y: 1.6 + i * rh, w: 8.4, h: rh, fontSize: L.fit(it, 8.4, rh - 0.04, 13, 9, F.body), color: C.white, align: 'center', valign: 'middle' }));
    },
  };
  // ---- further ways to draw a type, in the game's own screens: a deck's pages must not look alike (L.pages)
  const X0 = 0.5, FW = 9.0, Y1 = 5.12, COLS = [C.green, C.cyan, C.purple, C.yellow], DIM = '3A1E3A', DEEP = '1E3A50';
  const mono = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 9.5, F.body, false, 1.1), lineSpacingMultiple: 1.1, color: o.color || C.white, align: o.align, valign: o.valign || 'top' });
  const cap = (s, v, x, y, w, h, o = {}) => { const T = UP(v); t.text(s, T, { x, y, w, h, bold: true, fontSize: L.fit(T, w, h, o.max || 13, 9.5, F.head, true), color: o.color || C.yellow, align: o.align, valign: o.valign || 'middle' }); };
  const dots = (s, x, y, len, across = true, col = C.dim, step = 0.2) => { for (let k = 0; k * step < len; k++) t.rect(s, across ? x + k * step : x, across ? y : y + k * step, 0.09, 0.09, col, { name: 'Path' }); };
  const block = (s, v, x, y, d, col = C.yellow, fs = 18) => { panel(s, x, y, d, d, col, col); t.text(s, v, { x, y, w: d, h: d, bold: true, fontSize: fs, color: C.bg, align: 'center', valign: 'middle' }); };
  const stage = (s, d) => {
    if (d.title) t.text(s, [{ text: '▶ ', options: { color: C.red } }, { text: UP(d.title), options: { color: C.yellow } }], { x: 0.5, y: 0.35, w: 7.6, h: 0.6, bold: true, valign: 'middle', fontSize: L.fit(UP(d.title), 7.2, 0.6, 22, 12, F.head, true) });
    t.text(s, `STAGE ${L.pad2(idx)}`, { x: 7.9, y: 0.35, w: 1.6, h: 0.6, fontSize: 13, bold: true, color: C.green, align: 'right', valign: 'middle' });
    footer(s);
  };
  // a circle as a game draws one: stair-stepped, row by row
  const SPRITE = (() => { const n = 18, half = (r) => Math.ceil(Math.sqrt(1 - ((r + 0.5) / n * 2 - 1) ** 2) * n / 2) / n, p = [], rows = [...Array(n).keys()]; rows.forEach((r) => p.push([0.5 + half(r), r / n], [0.5 + half(r), (r + 1) / n])); rows.reverse().forEach((r) => p.push([0.5 - half(r), (r + 1) / n], [0.5 - half(r), r / n])); return p; })();
  const V = {
    image: [
      async (d) => { // a cutscene: the picture across the screen, the dialog box laps over its foot
        const s = page(d);
        await pxPhoto(s, d.image, X0, 1.1, FW, 2.32);
        panel(s, X0 + 0.2, 3.2, FW - 0.4, 1.94, C.white);
        mono(s, d.text, X0 + 0.45, 3.32, FW - 0.9, 1.68, { valign: 'middle' });
        t.text(s, '▼', { x: 8.9, y: 4.84, w: 0.3, h: 0.25, fontSize: 11, color: C.red, noFit: true });
      },
      async (d) => { // the whole screen is the level; a band for the score, a box for the words
        const s = pres.addSlide(); s.background = { data: sky }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H, { pixel: 72 }), 0, 0, W, H, { alt: d.title });
        t.rect(s, 0, 0, W, 1.05, C.bg, { name: 'Score band' });
        stage(s, d);
        panel(s, 4.6, 1.3, 5.0, 3.78, C.yellow, C.bg);
        mono(s, d.text, 4.85, 1.45, 4.5, 3.48, { valign: 'middle', max: 13 });
      },
      async (d) => { // the picture as a round sprite, edges in steps, the words in a panel beside it
        const s = page(d), dia = 3.9, x = 5.6, y = 1.2;
        t.img(s, await L.photo(L.src(d.image), dia, dia, { pixel: 54, mask: { poly: SPRITE } }), x, y, dia, dia, { alt: d.title });
        panel(s, X0, 1.25, 4.9, 3.8, C.cyan);
        mono(s, d.text, X0 + 0.25, 1.4, 4.4, 3.5, { valign: 'middle' });
      },
      async (d) => { // a sprite sheet: three frames in a column, the notes at their side
        const s = page(d), w = 2.7, h = 1.22, g = 0.1;
        for (const [i, pos] of ['left', 'centre', 'right'].entries()) {
          const y = 1.2 + i * (h + g);
          panel(s, X0, y, w, h, COLS[i], C.bg);
          t.img(s, await L.photo(L.src(d.image), w - 2 * P - 0.08, h - 2 * P - 0.08, { pixel: 56, position: pos }), X0 + P + 0.04, y + P + 0.04, w - 2 * P - 0.08, h - 2 * P - 0.08, { alt: i ? '' : d.title });
        }
        panel(s, 3.4, 1.2, 6.1, 3.86, C.white);
        mono(s, d.text, 3.68, 1.36, 5.54, 3.54, { valign: 'middle', max: 13.5 });
      },
    ],
    cards: [
      async (d) => { // the inventory: a slot for each item, the cursor on the first
        const s = page(d), n = d.items.length, g = 0.1, h = (3.9 - g * (n - 1)) / n, D = Math.min(0.78, h - 0.14);
        panel(s, X0, 1.16, FW, 3.98, C.white);
        for (const [i, it] of d.items.entries()) {
          const y = 1.2 + i * (h + g), col = COLS[i], sx = 1.02;
          t.text(s, i ? ' ' : '▶', { x: 0.68, y, w: 0.3, h, fontSize: 15, bold: true, color: C.red, valign: 'middle', noFit: true });
          panel(s, sx, y + (h - D) / 2, D, D, col, C.bg);
          t.img(s, await pxIcon(it.icon, col), sx + D * 0.18, y + (h - D) / 2 + D * 0.18, D * 0.64, D * 0.64);
          cap(s, it.h, sx + D + 0.16, y + 0.05, 7.1, 0.3, { color: col });
          mono(s, it.t, sx + D + 0.16, y + 0.35, 7.2, h - 0.38, { max: 12.5 });
        }
      },
      async (d) => { // cartridges, solid colour, dark print, set at two heights
        const s = page(d), n = d.items.length, g = 0.16, w = (FW - g * (n - 1)) / n, h = 3.62;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + g), y = 1.15 + (i % 2 ? 0.32 : 0), col = COLS[i];
          panel(s, x, y, w, h, col, col);
          t.rect(s, x + 0.2, y - 0.0, w - 0.4, 0.1, C.bg, { name: 'Notch' });
          t.img(s, await pxIcon(it.icon, C.bg), x + 0.16, y + 0.2, 0.42, 0.42);
          cap(s, it.h, x + 0.14, y + 0.66, w - 0.28, 0.54, { color: C.bg, valign: 'top' });
          mono(s, it.t, x + 0.14, y + 1.2, w - 0.28, h - 1.3, { color: C.bg, max: 12.5 });
        }
      },
      async (d) => { // the level select: pixel paths run out from a star block in the middle
        const s = page(d), n = d.items.length, cx = 5, cy = 3.13, D = 0.82, w = 3.3, left = 2, hL = 1.9, right = n - left, hR = 3.9 / right;
        const spots = d.items.map((_, i) => (i < left ? [X0, 1.2 + i * hL, hL - 0.1] : [6.2, 1.2 + (i - left) * hR, hR - 0.1]));
        for (const [i] of d.items.entries()) {
          const [x, y, h] = spots[i], my = y + h / 2, ex = i < left ? x + w : x;
          const y1 = Math.min(my, cy), a = Math.min(ex, cx), b = Math.max(ex, cx);
          dots(s, a, my, b - a - (i < left ? 0 : 0));
          dots(s, cx, y1, Math.abs(my - cy));
        }
        block(s, '★', cx - D / 2, cy - D / 2, D, C.yellow, 26);
        for (const [i, it] of d.items.entries()) {
          const [x, y, h] = spots[i], col = COLS[i];
          panel(s, x, y, w, h, col);
          t.img(s, await pxIcon(it.icon, col), x + 0.16, y + 0.14, 0.32, 0.32);
          cap(s, it.h, x + 0.54, y + 0.1, w - 0.68, 0.4, { color: col, max: 12 });
          mono(s, it.t, x + 0.16, y + 0.52, w - 0.32, h - 0.62, { max: 12 });
        }
      },
      async (d) => { // the chosen hero stands large, the others wait in the side list
        const s = page(d), [a, ...rest] = d.items, g = 0.1, h = (3.92 - g * (rest.length - 1)) / rest.length;
        panel(s, X0, 1.2, 4.3, 3.92, C.yellow, DIM);
        t.img(s, await pxIcon(a.icon, C.yellow), X0 + 0.25, 1.38, 0.86, 0.86);
        cap(s, a.h, X0 + 1.26, 1.38, 2.84, 0.86, { max: 17 });
        mono(s, a.t, X0 + 0.25, 2.4, 3.8, 2.56, { max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = 1.2 + i * (h + g), col = COLS[i];
          panel(s, 4.95, y, 4.55, h, col);
          t.img(s, await pxIcon(it.icon, col), 5.1, y + 0.12, 0.3, 0.3);
          cap(s, it.h, 5.48, y + 0.08, 3.9, 0.36, { color: col, max: 12 });
          mono(s, it.t, 5.1, y + 0.44, 4.26, h - 0.52, { max: 12 });
        }
      },
    ],
    process: [
      async (d) => { // over and under: levels at two heights, a dotted jump from each to the next
        const s = page(d), n = d.steps.length, g = 0.2, w = (FW - g * (n - 1)) / n, h = 2.9, ys = [1.18, 2.22];
        d.steps.forEach((st, i) => {
          const x = X0 + i * (w + g), y = ys[i % 2], col = COLS[i];
          if (i < n - 1) dots(s, x + w, 2.9, g + 0.01, true, C.white, 0.1);
          panel(s, x, y, w, h, col);
          block(s, String(i + 1), x + 0.14, y + 0.14, 0.46, col, 15);
          cap(s, st.h, x + 0.68, y + 0.12, w - 0.8, 0.5, { color: col, max: 11.5 });
          mono(s, st.t, x + 0.14, y + 0.68, w - 0.28, h - 0.78, { max: 12.5 });
        });
      },
      async (d) => { // a green pipe down the middle, an exit from it to each level left and right
        const s = page(d), n = d.steps.length, cx = 5, sp = 3.9 / n, h = 1.84, B = 0.42;
        const ly = n === 3 ? [1.2, 2.25, 3.28] : [1.2, 1.3, 3.14, 3.26];
        t.rect(s, cx - 0.14, 1.2, 0.28, 3.9, C.green, { name: 'Pipe' });
        t.rect(s, cx - 0.2, 1.16, 0.4, 0.12, C.green, { name: 'Pipe head' });
        d.steps.forEach((st, i) => {
          const left = i % 2 === 0, x = left ? X0 : 5.45, w = 4.05, y = ly[i], ny = 1.2 + (i + 0.5) * sp, col = COLS[i];
          panel(s, x, y, w, h, col);
          t.rect(s, left ? x + w : cx, ny - 0.04, 0.45 - 0.0, 0.08, C.green, { name: 'Pipe exit' });
          block(s, String(i + 1), cx - B / 2, ny - B / 2, B, C.yellow, 13);
          cap(s, st.h, x + 0.16, y + 0.1, w - 0.32, 0.34, { color: col, max: 12.5, align: left ? 'right' : 'left' });
          mono(s, st.t, x + 0.16, y + 0.46, w - 0.32, h - 0.56, { max: 12.5, align: left ? 'right' : 'left' });
        });
      },
      async (d) => { // the progress ribbon on top, one long panel of levels below
        const s = page(d), n = d.steps.length, cw = FW / n, y = 1.92, h = 3.2;
        panel(s, X0, y, FW, h, C.white);
        d.steps.forEach((st, i) => {
          const x = X0 + i * cw, col = COLS[i];
          t.shape(s, 'PENTAGON', { x: x + 0.02, y: 1.2, w: cw - 0.04, h: 0.6, fill: { color: col }, objectName: 'Ribbon' });
          t.text(s, `LEVEL ${i + 1}`, { x: x + 0.1, y: 1.2, w: cw - 0.4, h: 0.6, bold: true, fontSize: L.fit(`LEVEL ${i + 1}`, cw - 0.45, 0.5, 15, 10, F.head, true), color: C.bg, valign: 'middle' });
          if (i) dots(s, x, y + 0.14, h - 0.28, false, C.dim, 0.2);
          cap(s, st.h, x + 0.14, y + 0.12, cw - 0.28, 0.54, { color: col, max: 12, valign: 'top' });
          mono(s, st.t, x + 0.14, y + 0.68, cw - 0.28, h - 0.78, { max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // the high score fills the screen; two lesser scores under it
        const s = page(d), [a, ...rest] = d.stats;
        panel(s, X0, 1.16, FW, 1.78, C.yellow, DIM);
        t.text(s, a.value, { x: X0 + 0.25, y: 1.22, w: 4.5, h: 1.66, bold: true, fontSize: L.fit(a.value, 4.5, 1.6, 58, 26, F.head, true), color: C.yellow, valign: 'middle' });
        cap(s, a.label, 5.3, 1.3, 4.0, 1.5, { color: C.white, max: 14 });
        rest.forEach((q, i) => {
          const x = X0 + i * 4.56, w = 4.44, col = COLS[i];
          panel(s, x, 3.04, w, 1.14, col);
          t.text(s, q.value, { x: x + 0.14, y: 3.08, w: 1.9, h: 1.06, bold: true, fontSize: L.fit(q.value, 1.9, 1.0, 26, 14, F.head, true), color: col, valign: 'middle' });
          mono(s, q.label, x + 2.08, 3.1, w - 2.2, 1.02, { max: 11, valign: 'middle' });
        });
        if (d.note) mono(s, d.note, X0, 4.26, FW, 0.86, { max: 11.5, color: C.white, valign: 'middle' });
      },
      async (d) => { // three bonus blocks in solid colour, each a hop above the last
        const s = page(d), g = 0.2, w = (FW - 2 * g) / 3, h = 1.26, ys = [1.86, 1.52, 1.18], fills = [C.green, C.cyan, C.yellow];
        d.stats.forEach((q, i) => {
          const x = X0 + i * (w + g), y = ys[i];
          panel(s, x, y, w, h, fills[i], fills[i]);
          t.text(s, q.value, { x: x + 0.12, y, w: w - 0.24, h, bold: true, fontSize: L.fit(q.value, w - 0.24, h - 0.2, 40, 20, F.head, true), color: C.bg, align: 'center', valign: 'middle' });
          dots(s, x + w / 2 - 0.05, y + h + 0.04, 3.2 - y - h - 0.04, false, fills[i], 0.14);
          mono(s, q.label, x + 0.04, 3.22, w - 0.08, 0.84, { max: 12, align: 'center' });
        });
        if (d.note) { panel(s, X0, 4.14, FW, 0.98, C.dim); mono(s, d.note, X0 + 0.2, 4.2, FW - 0.4, 0.86, { max: 11.5, valign: 'middle' }); }
      },
    ],
    compare: [
      async (d) => { // the fighters' screen: the two faced off, mirrored across a jagged seam
        const s = page(d), w = 4.0, y0 = 1.86, avail = 3.16, fit = L.rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.14, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        t.rect(s, X0, 1.16, 4.5, 3.96, DIM, { name: 'P1 side' }); t.rect(s, 5, 1.16, 4.5, 3.96, DEEP, { name: 'P2 side' });
        for (let k = 0; k < 13; k++) t.rect(s, 5 - (k % 2 ? 0.14 : 0), 1.16 + k * 0.3046, 0.14, 0.3046, k % 2 ? C.red : C.cyan, { name: 'Seam' });
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.28 : 0.72, al = i ? 'left' : 'right', col = i ? C.cyan : C.red;
          t.text(s, `P${i + 1}: ${UP(side.h)}`, { x, y: 1.26, w, h: 0.52, bold: true, fontSize: L.fit(`P${i + 1}: ${UP(side.h)}`, w, 0.5, 14, 10, F.head, true), color: col, align: al, valign: 'middle' });
          let y = y0;
          fit.rows.forEach((rh0, k) => { const rh = rh0 + extra; if (side.items[k]) t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: C.white, align: al, valign: 'middle' }); y += rh; });
        });
      },
      async (d) => { // two lanes of a race, one over the other: a solid tag opens each
        const s = page(d), bh = 1.9, g = 0.14;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.2 + i * (bh + g), col = i ? C.cyan : C.red, n = side.items.length, x0 = 2.72, cw = (9.34 - x0) / n, T = `P${i + 1}: ${UP(side.h)}`;
          panel(s, X0, y, FW, bh, col);
          t.rect(s, X0 + P, y + P, 1.98, bh - 2 * P, col, { name: 'Tag' });
          t.text(s, T, { x: 0.68, y: y + 0.1, w: 1.72, h: bh - 0.2, bold: true, fontSize: L.fit(T, 1.72, bh - 0.3, 14, 10, F.head, true), color: C.bg, valign: 'middle' });
          side.items.forEach((it, k) => {
            if (k) dots(s, x0 + k * cw - 0.08, y + 0.2, bh - 0.4, false, col, 0.2);
            mono(s, it, x0 + k * cw + 0.06, y + 0.12, cw - 0.24, bh - 0.24, { max: 12.5, valign: 'middle' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the big message: a solid yellow screen, dark capitals on it
        const s = pres.addSlide(); s.background = { color: C.yellow }; idx++;
        if (d.title) t.text(s, [{ text: '\u25B6 ', options: { color: C.red } }, { text: UP(d.title), options: { color: C.bg } }], { x: 0.5, y: 0.25, w: 7.6, h: 0.6, bold: true, valign: 'middle', fontSize: L.fit(UP(d.title), 7.2, 0.6, 22, 12, F.head, true) });
        t.text(s, `STAGE ${L.pad2(idx)}`, { x: 7.9, y: 0.25, w: 1.6, h: 0.6, fontSize: 13, bold: true, color: C.bg, align: 'right', valign: 'middle' });
        t.text(s, L.runs(UP(d.text)), { x: 0.4, y: 1.0, w: 6.0, h: 4.1, bold: true, fontSize: L.fit(UP(d.text), 6.0, 4.0, 30, 14, F.head, true), color: C.bg, valign: 'middle' });
        if (d.caption) { t.rect(s, 6.6, 0.95, 3.4, 4.35, C.bg, { name: 'Message band' }); mono(s, d.caption, 6.82, 1.08, 2.96, 4.1, { max: 13.5, valign: 'middle' }); }
        footer(s);
      },
      async (d) => { // a character speaks: the portrait in its frame, words in a dialog box
        const s = page(d), Dm = 2.0;
        panel(s, X0, 1.2, Dm, Dm, C.green, C.bg);
        t.img(s, await pxIcon('FiMessageSquare', C.green), X0 + 0.4, 1.6, Dm - 0.8, Dm - 0.8);
        for (let k = 0; k < 3; k++) t.rect(s, X0 + Dm + 0.02 + k * 0.05, 2.12 - k * 0.02, 0.07, 0.08 + k * 0.04, C.white, { name: 'Bubble tail' });
        panel(s, 2.68, 1.2, 6.82, 2.4, C.white);
        t.text(s, L.runs(UP(d.text)), { x: 2.92, y: 1.3, w: 6.34, h: 2.2, bold: true, fontSize: L.fit(UP(d.text), 6.34, 2.14, 24, 13, F.head, true), color: C.white, valign: 'middle' });
        t.text(s, '▼', { x: 9.1, y: 3.28, w: 0.3, h: 0.25, fontSize: 11, color: C.red, noFit: true });
        if (d.caption) { panel(s, X0, 3.72, FW, 1.4, C.dim, C.bg); mono(s, d.caption, X0 + 0.2, 3.8, FW - 0.4, 1.24, { max: 13, valign: 'middle', color: C.white }); }
      },
    ],
    timeline: [
      async (d) => { // four worlds of the map: a solid bar with the date heads each
        const s = page(d), w = 4.42, h = 1.88, g = 0.16;
        d.items.forEach((it, i) => {
          const x = X0 + (i % 2) * (w + g), y = 1.2 + (i >> 1) * (h + 0.12), col = COLS[i];
          panel(s, x, y, w, h, col);
          t.rect(s, x + P, y + P, w - 2 * P, 0.42, col, { name: 'Date bar' });
          t.text(s, it.year, { x: x + 0.16, y: y + P, w: 1.7, h: 0.42, bold: true, fontSize: L.fit(it.year, 1.7, 0.38, 15, 10, F.head, true), color: C.bg, valign: 'middle' });
          cap(s, it.h, x + 1.88, y + P, w - 2.04, 0.42, { color: C.bg, max: 12, align: 'right' });
          mono(s, it.t, x + 0.16, y + 0.56, w - 0.32, h - 0.66, { max: 13 });
        });
      },
      async (d) => { // the jump down: brick platforms falling to the right, the event hung from each
        const s = page(d), w = 5.05, sx = (FW - w) / 3, sy = 0.98;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * sx, y = 1.18 + i * sy, col = COLS[i];
          t.rect(s, x, y, w, 0.3, col, { name: 'Platform' });
          t.img(s, await pxIcon('FiFlag', col), x - 0.04 - 0.3 > 0 && i ? x - 0.36 : x + w + 0.03, y - 0.02, 0.32, 0.32);
          t.text(s, it.year, { x: x + 0.1, y, w: 1.6, h: 0.3, bold: true, fontSize: L.fit(it.year, 1.6, 0.28, 12.5, 10, F.head, true), color: C.bg, valign: 'middle' });
          cap(s, it.h, x + 1.7, y, w - 1.8, 0.3, { color: C.bg, max: 11.5, align: 'right' });
          mono(s, it.t, x + 0.1, y + 0.32, w - 0.2, sy - 0.36, { max: 12 });
        }
      },
    ],
  };
  R.image = V.image.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Piksel', colors: { dk1: C.bg, lt1: C.white, dk2: C.panel, lt2: C.dim, accent1: C.yellow, accent2: C.green, accent3: C.cyan, accent4: C.red, accent5: C.purple, accent6: C.dim, hlink: C.cyan, folHlink: C.dim } });
}
/** Uslub pasporti */
const STYLE = { tone: "o'yin tilida qiziqarli: qisqa, harakatga undovchi iboralar; mavzu jiddiyligini saqla", limits: { title: 40, card_h: 16, step_h: 16, card_t3: 75, card_t4: 55, event_h: 14, stmt: 55 }, prefer: null };
module.exports = { id: 36, slug: 'piksel', name: 'Piksel', category: 'creative', photos: true, build, style: STYLE };
