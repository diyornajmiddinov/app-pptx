/**
 * 18 Bento — modern bento-box grid: every slide is a mosaic of rounded tiles of different
 * sizes on warm grey, one orange and one lavender tile per slide, black feature tiles.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'ECECE7', tile: 'FFFFFF', ink: '111111', gray: '666666', orange: 'FF6B35', lav: 'CDBDFF', black: '151515' };
const F = { head: 'Arial', body: 'Arial' };
const G = 0.15, R0 = 0.18, X0 = 0.4, Y0 = 0.4, AW = 9.2;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  let idx = 0;
  const tile = (s, x, y, w, h, fill = C.tile) => t.rect(s, x, y, w, h, fill, { r: R0, name: 'Tile' });
  const on = (fill) => (fill === C.black ? 'FFFFFF' : C.ink);
  const sub = (fill) => (fill === C.black ? 'BDBDBD' : fill === C.tile ? C.gray : '333333');

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    tile(s, X0, Y0, AW, 0.9);
    t.text(s, d.title, { x: X0 + 0.3, y: Y0, w: AW - 1.4, h: 0.9, bold: true, valign: 'middle', fontSize: L.fit(d.title, AW - 1.4, 0.8, 26, 18, F.head, true) });
    t.rect(s, X0 + AW - 0.95, Y0 + 0.22, 0.75, 0.46, C.black, { r: 0.23, name: 'Chip' });
    t.text(s, L.pad2(idx), { x: X0 + AW - 0.95, y: Y0 + 0.22, w: 0.75, h: 0.46, fontSize: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    return s;
  };
  const AY = Y0 + 0.9 + G, AH = H - 0.4 - AY; // content area under the title tile

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    const bw = 5.6, rx = X0 + bw + G, rw = AW - bw - G, th = 2.3;
    tile(s, X0, Y0, bw, H - 0.8);
    const fs = L.fit(d.title, bw - 0.8, 2.6, 44, 24, F.head, true);
    t.text(s, d.title, { x: X0 + 0.4, y: Y0 + 0.4, w: bw - 0.8, h: 2.8, fontSize: fs, bold: true, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: X0 + 0.4, y: Y0 + 3.4, w: bw - 0.8, h: 1.2, fontSize: 15, color: C.gray });
    tile(s, rx, Y0, rw, th, C.orange);
    t.img(s, await L.icon(kind === 'cover' ? 'FiArrowUpRight' : 'FiCheck', 'FFFFFF', 2), rx + rw - 1.15, Y0 + 0.35, 0.8, 0.8);
    const hw = (rw - G) / 2, y2 = Y0 + th + G, h2 = H - 0.4 - y2;
    tile(s, rx, y2, hw, h2, C.lav);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 4; b++) t.oval(s, rx + 0.3 + a * 0.38, y2 + 0.3 + b * 0.42, 0.1, 0.1, '8E77E0');
    tile(s, rx + hw + G, y2, hw, h2, C.black);
    t.text(s, kind === 'cover' ? '01' : L.pad2(idx), { x: rx + hw + G + 0.25, y: y2 + h2 - 0.9, w: hw - 0.4, h: 0.7, fontSize: 36, bold: true, color: 'FFFFFF' });
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async agenda(d) {
      const s = page(d), cols = 3, rws = Math.ceil(d.items.length / cols), w = (AW - G * (cols - 1)) / cols, h = (AH - G * (rws - 1)) / rws;
      d.items.forEach((it, i) => {
        const x = X0 + (i % cols) * (w + G), y = AY + Math.floor(i / cols) * (h + G), fill = i === 0 ? C.orange : i === 4 ? C.lav : C.tile;
        tile(s, x, y, w, h, fill);
        t.text(s, L.pad2(i + 1), { x: x + 0.25, y: y + 0.2, w: 1, h: 0.45, fontSize: 22, bold: true, color: fill === C.tile ? 'BBBBBB' : C.ink });
        t.text(s, it, { x: x + 0.25, y: y + h - 0.95, w: w - 0.5, h: 0.75, fontSize: 17, bold: true, valign: 'bottom', color: C.ink });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length;
      // first card is the large "feature" tile, the rest stack on the right
      const fw = n === 4 ? 3.6 : 4.5, rw = AW - fw - G;
      const cells = [{ x: X0, y: AY, w: fw, h: AH, fill: C.black }];
      if (n === 3) [0, 1].forEach((k) => cells.push({ x: X0 + fw + G, y: AY + k * ((AH - G) / 2 + G), w: rw, h: (AH - G) / 2, fill: k ? C.lav : C.tile }));
      else [0, 1, 2].forEach((k) => cells.push({ x: X0 + fw + G + (k === 2 ? 0 : 0), y: AY + (k < 2 ? 0 : (AH - G) / 2 + G), w: k < 2 ? (rw - G) / 2 : rw, h: (AH - G) / 2, fill: [C.tile, C.orange, C.tile][k] }));
      if (n === 4) cells[2].x = X0 + fw + G + (rw - G) / 2 + G;
      for (const [i, it] of d.items.entries()) {
        const c = cells[i], fg = on(c.fill), big = i === 0;
        tile(s, c.x, c.y, c.w, c.h, c.fill);
        t.img(s, await L.icon(it.icon, big ? C.orange : fg, 2), c.x + 0.28, c.y + 0.28, big ? 0.6 : 0.36, big ? 0.6 : 0.36);
        const hy = big ? c.y + c.h - 1.9 : c.y + 0.22, hx = big ? c.x + 0.28 : c.x + 0.74, hw = big ? c.w - 0.56 : c.w - 1.0;
        t.text(s, it.h, { x: hx, y: hy, w: hw, h: big ? 0.45 : 0.46, valign: big ? 'top' : 'middle', fontSize: L.fit(it.h, hw, big ? 0.45 : 0.46, big ? 22 : 16, 11, F.head, true), bold: true, color: fg });
        const ty = big ? hy + 0.48 : c.y + 0.74, th = big ? 1.25 : c.h - 0.84;
        t.text(s, it.t, { x: c.x + 0.28, y: ty, w: c.w - 0.56, h: th, fontSize: L.fit(it.t, c.w - 0.56, th, 14, 10, F.body), minFont: 9, color: sub(c.fill) });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, w = (AW - G * (n - 1)) / n;
      d.steps.forEach((st, i) => {
        const x = X0 + i * (w + G), fill = i === n - 1 ? C.black : i === 0 ? C.lav : C.tile, fg = on(fill);
        tile(s, x, AY, w, AH, fill);
        t.text(s, L.pad2(i + 1), { x: x + 0.25, y: AY + 0.2, w: w - 0.5, h: 0.8, fontSize: 40, bold: true, color: fill === C.tile ? 'C9C9C9' : fill === C.black ? C.orange : C.ink });
        t.text(s, st.h, { x: x + 0.25, y: AY + 1.3, w: w - 0.5, h: 0.45, fontSize: L.fit(st.h, w - 0.5, 0.45, 18, 12, F.head, true), bold: true, color: fg });
        t.text(s, st.t, { x: x + 0.25, y: AY + 1.8, w: w - 0.5, h: AH - 2.0, fontSize: 14, color: sub(fill) });
      });
    },
    async stats(d) {
      const s = page(d), fw = 4.6, rw = AW - fw - G, hh = (AH - G) / 2;
      const cells = [{ x: X0, y: AY, w: fw, h: AH, fill: C.orange, big: true }, { x: X0 + fw + G, y: AY, w: rw, h: hh, fill: C.tile }, { x: X0 + fw + G, y: AY + hh + G, w: rw, h: hh, fill: C.lav }];
      d.stats.slice(0, 3).forEach((x, i) => {
        const c = cells[i];
        tile(s, c.x, c.y, c.w, c.h, c.fill);
        t.text(s, x.value, { x: c.x + 0.3, y: c.y + 0.2, w: c.w - 0.6, h: c.big ? 1.9 : 0.95, fontSize: L.fit(x.value, c.w - 0.6, c.big ? 1.6 : 0.9, c.big ? 88 : 46, 24, F.head, true), bold: true, valign: c.big ? 'middle' : 'top' });
        t.text(s, x.label, { x: c.x + 0.3, y: c.big ? c.y + c.h - 1.2 : c.y + c.h - 0.65, w: c.w - 0.6, h: c.big ? 1.0 : 0.55, fontSize: c.big ? 17 : 14, bold: c.big, color: C.ink, valign: 'bottom' });
      });
      if (d.note) t.text(s, d.note, { x: X0 + 0.3, y: AY + 2.12, w: fw - 0.6, h: Math.max(0.4, AH - 1.2 - 2.12 - 0.08), fontSize: 13, color: '3A2A20' });
    },
    async compare(d) {
      const s = page(d), w = (AW - G) / 2;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.9, F.body) : 0))));
      [d.left, d.right].forEach((side, i) => {
        const x = X0 + i * (w + G), fill = i ? C.black : C.tile, fg = on(fill);
        tile(s, x, AY, w, AH, fill);
        t.text(s, side.h, { x: x + 0.35, y: AY + 0.3, w: w - 0.7, h: 0.5, fontSize: 20, bold: true, color: fg });
        let y = AY + 1.0;
        side.items.forEach((it, k) => {
          t.oval(s, x + 0.37, y + 0.08, 0.13, 0.13, i ? C.orange : C.lav);
          t.text(s, it, { x: x + 0.65, y, w: w - 0.9, h: rows[k] + 0.05, fontSize: 15, color: fg });
          y += rows[k] + 0.2;
        });
      });
    },
    async statement(d) {
      const s = page(d), sw = 2.3, bw = AW - sw - G;
      tile(s, X0, AY, bw, AH, C.lav);
      const fs = L.fit(d.text, bw - 0.8, 1.8, 38, 22, F.head, true);
      t.text(s, L.runs(d.text), { x: X0 + 0.4, y: AY + 0.3, w: bw - 0.8, h: 2.0, fontSize: fs, bold: true, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: X0 + 0.4, y: AY + 2.45, w: bw - 0.8, h: 1.1, fontSize: 15, color: '333333' });
      tile(s, X0 + bw + G, AY, sw, (AH - G) / 2, C.orange);
      t.img(s, await L.icon('FiZap', 'FFFFFF', 2), X0 + bw + G + 0.3, AY + 0.3, 0.6, 0.6);
      tile(s, X0 + bw + G, AY + (AH - G) / 2 + G, sw, (AH - G) / 2, C.tile);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, w = (AW - G * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const x = X0 + i * (w + G), fill = i === n - 1 ? C.orange : C.tile;
        tile(s, x, AY, w, AH, fill);
        t.text(s, it.year, { x: x + 0.25, y: AY + 0.2, w: w - 0.5, h: 0.75, fontSize: L.fit(it.year, w - 0.5, 0.7, 32, 16, F.head, true), bold: true });
        t.line(s, x + 0.25, AY + 1.1, w - 0.5, 0, fill === C.tile ? 'DDDDDD' : C.ink, 1);
        t.text(s, it.h, { x: x + 0.25, y: AY + 1.3, w: w - 0.5, h: 0.45, fontSize: 17, bold: true });
        t.text(s, it.t, { x: x + 0.25, y: AY + 1.8, w: w - 0.5, h: AH - 2.0, fontSize: 14, color: fill === C.tile ? C.gray : '3A2A20' });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
      const sw = 2.0, bw = AW - sw - G;
      tile(s, X0, Y0, bw, H - 0.8, C.black);
      const fs = L.fit(d.text, bw - 1.0, 2.8, 34, 20, F.head, true);
      t.text(s, d.text, { x: X0 + 0.5, y: Y0 + 0.4, w: bw - 1.0, h: 3.2, fontSize: fs, bold: true, color: 'FFFFFF', valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: X0 + 0.5, y: Y0 + 3.85, w: bw - 1.0, h: 0.4, fontSize: 15, color: C.orange });
      tile(s, X0 + bw + G, Y0, sw, sw, C.orange);
      t.text(s, '\u201C', { x: X0 + bw + G, y: Y0 + 0.15, w: sw, h: sw, fontSize: 110, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      tile(s, X0 + bw + G, Y0 + sw + G, sw, H - 0.8 - sw - G, C.lav);
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d), pw = 4.4;
      await PH(s, d.image, X0, AY, pw, AH, { mask: { r: R0 } });
      tile(s, X0 + pw + G, AY, AW - pw - G, AH, C.lav);
      t.text(s, d.text, { x: X0 + pw + G + 0.3, y: AY + 0.25, w: AW - pw - G - 0.6, h: AH - 0.5, fontSize: L.fit(d.text, AW - pw - G - 0.6, AH - 0.5, 15, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d), tw = 4.3;
      tile(s, X0, AY, tw, AH);
      t.text(s, d.text, { x: X0 + 0.3, y: AY + 0.25, w: tw - 0.6, h: AH - 0.5, fontSize: L.fit(d.text, tw - 0.6, AH - 0.5, 15, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      await PH(s, d.image, X0 + tw + G, AY, AW - tw - G, AH, { mask: { r: R0 } });
    },
    async sources(d) {
      const s = page(d), n = d.items.length;
      tile(s, X0, AY, AW, AH);
      const rh = Math.min(0.55, (AH - 0.3) / n);
      d.items.forEach((it, i) => {
        const y = AY + 0.15 + i * rh;
        t.text(s, L.pad2(i + 1), { x: X0 + 0.3, y, w: 0.6, h: rh, fontSize: 15, bold: true, color: i % 2 ? C.orange : '8E77E0', valign: 'middle' });
        t.text(s, it, { x: X0 + 0.95, y, w: AW - 1.25, h: rh, fontSize: L.fit(it, AW - 1.25, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 6.15, 0.4, 3.45, 2.3, { mask: { r: 0.18 } }); },
    closing: async (s, d) => { await PH(s, d.image, 6.15, 0.4, 3.45, 2.3, { mask: { r: 0.18 } }); },
  });
  // ---- further ways to draw a type, in this template's bento world (a new mosaic of tile sizes each time, orange and lavender accents, a dark tray): a deck's pages must not look alike (L.pages)
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.gray, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, bold: true, fontSize: L.fit(txt, w, h, o.max || 17, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const tray = (d) => { const s = page(d); s.background = { color: C.black }; d._night = true; return s; }; // the black tray: the same tiles on a dark ground
  const dots = (s, x, y, w, h, c = '8E77E0') => { const nx = Math.max(1, Math.floor((w - 0.2) / 0.36)), ny = Math.max(1, Math.floor((h - 0.2) / 0.36)), ox = x + (w - (nx - 1) * 0.36 - 0.1) / 2, oy = y + (h - (ny - 1) * 0.36 - 0.1) / 2; for (let a = 0; a < nx; a++) for (let b = 0; b < ny; b++) t.oval(s, ox + a * 0.36, oy + b * 0.36, 0.1, 0.1, c); };
  const cell = async (s, c, it, o = {}) => { // an item tile: icon, heading, text
    const fg = on(c.fill), ic = o.ic ?? 0.34, pad = o.pad ?? 0.2;
    tile(s, c.x, c.y, c.w, c.h, c.fill);
    t.img(s, await L.icon(it.icon, o.iconColor || fg, 2), c.x + pad, c.y + pad - 0.03, ic, ic);
    head(s, it.h, c.x + pad + ic + 0.1, c.y + pad - 0.06, c.w - 2 * pad - ic - 0.1, ic + 0.06, { color: fg, max: o.hmax || 16 });
    body(s, it.t, c.x + pad, c.y + pad + ic + 0.08, c.w - 2 * pad, c.h - 2 * pad - ic - 0.04, { color: sub(c.fill), max: o.max || 13 });
  };
  const V = {
    image: [
      async (d) => { // a wide picture tile over a text tile and a small orange one
        const s = page(d), ph = 1.85, y2 = AY + ph + G, h2 = AH - ph - G, ow = 1.3, tw = AW - ow - G;
        await PH(s, d.image, X0, AY, AW, ph, { mask: { r: R0 } });
        tile(s, X0, y2, tw, h2);
        t.text(s, d.text, { x: X0 + 0.22, y: y2 + 0.1, w: tw - 0.44, h: h2 - 0.2, fontSize: L.fit(d.text, tw - 0.44, h2 - 0.2, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
        tile(s, X0 + tw + G, y2, ow, h2, C.orange);
        t.img(s, await L.icon('FiImage', 'FFFFFF', 2), X0 + tw + G + (ow - 0.56) / 2, y2 + (h2 - 0.56) / 2, 0.56, 0.56);
      },
      async (d) => { // the picture is the whole tray, tiles float over it
        const s = page(d);
        await PH(s, d.image, 0, 0, W, H);
        tile(s, 4.75, Y0, W - X0 - 4.75, 1.08);
        t.text(s, d.title, { x: 5.0, y: Y0, w: 4.35, h: 1.08, bold: true, valign: 'middle', fontSize: L.fit(d.title, 4.35, 1.0, 22, 15, F.head, true) });
        tile(s, 4.75, Y0 + 1.08 + G, W - X0 - 4.75, 3.2);
        t.text(s, d.text, { x: 4.97, y: Y0 + 1.3, w: 4.41, h: 2.96, fontSize: L.fit(d.text, 4.41, 2.96, 14, 10, F.body, false, 1.12), color: C.ink, lineSpacingMultiple: 1.12, valign: 'middle' });
        t.rect(s, 0, 5.24, W, H - 5.24, C.bg, { name: 'Footer band' });
      },
      async (d) => { // the black tray: a lavender tile with a round picture, the text beside it
        const s = tray(d), lw = 3.75, dd = 3.2;
        tile(s, X0, AY, lw, AH, C.lav);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), X0 + (lw - dd) / 2, AY + (AH - dd) / 2, dd, dd, { alt: '' });
        tile(s, X0 + lw + G, AY, AW - lw - G, AH, '262626');
        t.text(s, d.text, { x: X0 + lw + G + 0.28, y: AY + 0.18, w: AW - lw - G - 0.56, h: AH - 0.36, fontSize: L.fit(d.text, AW - lw - G - 0.56, AH - 0.36, 14, 10, F.body, false, 1.2), color: 'FFFFFF', lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // a tall picture in the middle, text at its left, two small tiles at its right
        const s = page(d), lw = 4.2, rw = 1.3, pw = AW - lw - rw - 2 * G, hh = (AH - G) / 2, rx = X0 + lw + G + pw + G;
        tile(s, X0, AY, lw, AH);
        t.text(s, d.text, { x: X0 + 0.24, y: AY + 0.14, w: lw - 0.48, h: AH - 0.28, fontSize: L.fit(d.text, lw - 0.48, AH - 0.28, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
        await PH(s, d.image, X0 + lw + G, AY, pw, AH, { mask: { r: R0 } });
        tile(s, rx, AY, rw, hh, C.lav); dots(s, rx, AY, rw, hh);
        tile(s, rx, AY + hh + G, rw, hh, C.black);
        t.img(s, await L.icon('FiArrowUpRight', C.orange, 2), rx + (rw - 0.6) / 2, AY + hh + G + (hh - 0.6) / 2, 0.6, 0.6);
      },
    ],
    cards: [
      async (d) => { // a wide orange tile on top, the others shoulder to shoulder below
        const s = page(d), n = d.items.length, [a, ...rest] = d.items, h1 = 1.55, y2 = AY + h1 + G, h2 = AH - h1 - G, w = (AW - G * (rest.length - 1)) / rest.length;
        await cell(s, { x: X0, y: AY, w: AW, h: h1, fill: C.orange }, a, { ic: 0.42, hmax: 20, max: 14 });
        for (const [k, it] of rest.entries()) await cell(s, { x: X0 + k * (w + G), y: y2, w, h: h2, fill: k === 1 && n === 4 ? C.lav : C.tile }, it);
      },
      async (d) => { // a pinwheel: wide and narrow tiles change places from row to row
        const s = page(d), n = d.items.length, wide = 5.4, nar = AW - wide - G, hh = (AH - G) / 2;
        const cells = n === 4 ? [{ x: X0, y: AY, w: wide, fill: C.tile }, { x: X0 + wide + G, y: AY, w: nar, fill: C.lav }, { x: X0, y: AY + hh + G, w: nar, fill: C.black }, { x: X0 + nar + G, y: AY + hh + G, w: wide, fill: C.tile }]
          : [{ x: X0, y: AY, w: wide, fill: C.tile }, { x: X0 + wide + G, y: AY, w: nar, fill: C.lav }, { x: X0, y: AY + hh + G, w: AW, fill: C.black }];
        for (const [i, it] of d.items.entries()) await cell(s, { ...cells[i], h: hh }, it, { iconColor: cells[i].fill === C.black ? C.orange : undefined });
      },
      async (d) => { // the black tray: columns broken at different heights, small colour tiles filling the gaps
        const s = tray(d), n = d.items.length, w = (AW - G * (n - 1)) / n, gaps = [0.55, 0, 0.8, 0.3];
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + G), gap = gaps[i], top = i % 2 === 0, h = AH - (gap ? gap + G : 0), y = top || !gap ? AY : AY + gap + G;
          if (gap) { const ky = top ? AY + h + G : AY; tile(s, x, ky, w, gap, [C.orange, C.lav, C.lav, C.orange][i]); }
          await cell(s, { x, y, w, h, fill: C.tile }, it, { max: n === 4 ? 13 : 15, hmax: 14, ic: 0.3, pad: 0.16 });
        }
      },
      async (d) => { // a small black square at the centre, the tiles wrapped around it
        const s = page(d), n = d.items.length, cw = 1.9, w = (AW - cw - 2 * G) / 2, hh = (AH - G) / 2, cx = X0 + w + G;
        tile(s, cx, AY, cw, (AH - cw - 2 * G) / 2, C.lav); dots(s, cx, AY, cw, (AH - cw - 2 * G) / 2);
        tile(s, cx, AY + (AH - cw) / 2, cw, cw, C.black);
        t.img(s, await L.icon('FiGrid', C.orange, 2), cx + cw / 2 - 0.4, AY + AH / 2 - 0.4, 0.8, 0.8);
        tile(s, cx, AY + (AH + cw) / 2 + G, cw, (AH - cw - 2 * G) / 2, C.orange);
        const cells = n === 4 ? [{ x: X0, y: AY, h: hh }, { x: cx + cw + G, y: AY, h: hh }, { x: X0, y: AY + hh + G, h: hh }, { x: cx + cw + G, y: AY + hh + G, h: hh }] : [{ x: X0, y: AY, h: hh }, { x: cx + cw + G, y: AY, h: AH }, { x: X0, y: AY + hh + G, h: hh }];
        for (const [i, it] of d.items.entries()) await cell(s, { ...cells[i], w, fill: C.tile }, it, { max: 13 });
      },
    ],
    process: [
      async (d) => { // tiles rising like a stair, with empty grey sockets above them
        const s = page(d), n = d.steps.length, w = (AW - G * (n - 1)) / n, rise = n === 4 ? 0.28 : 0.42;
        d.steps.forEach((st, i) => {
          const x = X0 + i * (w + G), y = AY + rise * (n - 1 - i), h = AH - rise * (n - 1 - i), last = i === n - 1, fill = last ? C.orange : i === 0 ? C.lav : C.tile;
          if (y > AY) t.rect(s, x, AY, w, y - AY - 0.04, null, { r: 0.1, line: { color: 'CFCFC8', width: 1, dashType: 'dash' }, name: 'Socket' });
          tile(s, x, y, w, h, fill);
          t.text(s, L.pad2(i + 1), { x: x + 0.2, y: y + 0.12, w: w - 0.4, h: 0.6, fontSize: 30, bold: true, color: fill === C.tile ? 'C9C9C9' : C.ink, valign: 'middle' });
          head(s, st.h, x + 0.2, y + 0.75, w - 0.4, 0.52, { max: 15, valign: 'top' });
          body(s, st.t, x + 0.2, y + 1.28, w - 0.4, h - 1.36, { color: sub(fill), max: 13 });
        });
      },
      async (d) => { // long rows, a number tile then a text tile, the lavender one last
        const s = page(d), n = d.steps.length, h = (AH - G * (n - 1)) / n, nw = 1.05, hw = 2.5;
        d.steps.forEach((st, i) => {
          const y = AY + i * (h + G), last = i === n - 1;
          tile(s, X0, y, nw, h, last ? C.orange : C.black);
          t.text(s, L.pad2(i + 1), { x: X0, y, w: nw, h, fontSize: 24, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
          tile(s, X0 + nw + G, y, hw, h, last ? C.lav : C.tile);
          head(s, st.h, X0 + nw + G + 0.18, y + 0.05, hw - 0.36, h - 0.1, { max: 16 });
          tile(s, X0 + nw + hw + 2 * G, y, AW - nw - hw - 2 * G, h, last ? C.lav : C.tile);
          body(s, st.t, X0 + nw + hw + 2 * G + 0.18, y + 0.05, AW - nw - hw - 2 * G - 0.36, h - 0.1, { valign: 'middle', color: last ? C.ink : C.gray, max: 13 });
        });
      },
      async (d) => { // the black tray: big tiles joined by small arrow tiles, the path turning back
        const s = tray(d), n = d.steps.length, aw = 0.6, w = (AW - aw - 2 * G) / 2, hh = (AH - G) / 2, ax = X0 + w + G, rx = ax + aw + G;
        const spots = [[X0, AY], [rx, AY], n === 4 ? [rx, AY + hh + G] : [X0, AY + hh + G], [X0, AY + hh + G]];
        const arrow = async (x, y, ww, hhh, ic) => { tile(s, x, y, ww, hhh, C.orange); t.img(s, await L.icon(ic, 'FFFFFF', 2.5), x + ww / 2 - 0.16, y + hhh / 2 - 0.16, 0.32, 0.32); };
        for (const [i, st] of d.steps.entries()) {
          const [x, y] = spots[i], ww = n === 3 && i === 2 ? AW : w, fill = i === n - 1 ? C.lav : C.tile;
          tile(s, x, y, ww, hh, fill);
          t.text(s, L.pad2(i + 1), { x: x + 0.2, y: y + 0.12, w: 0.7, h: 0.42, fontSize: 20, bold: true, color: i === n - 1 ? C.ink : 'BBBBBB', valign: 'middle' });
          head(s, st.h, x + 0.9, y + 0.12, ww - 1.1, 0.42, { max: 16 });
          body(s, st.t, x + 0.2, y + 0.6, ww - 0.4, hh - 0.68, { color: sub(fill), max: 13 });
        }
        await arrow(ax, AY, aw, hh, 'FiArrowRight');
        if (n === 4) await arrow(ax, AY + hh + G, aw, hh, 'FiArrowLeft');
      },
    ],
    stats: [
      async (d) => { // the big tile stands in the middle, a tile either side, the note on a strip below
        const s = page(d), [b, a, c] = [d.stats[1], d.stats[0], d.stats[2]], sw = 2.5, mw = AW - 2 * sw - 2 * G, nh = d.note ? 0.72 : 0, h = AH - (nh ? nh + G : 0);
        tile(s, X0 + sw + G, AY, mw, h, C.orange);
        t.text(s, a.value, { x: X0 + sw + G + 0.25, y: AY + 0.2, w: mw - 0.5, h: h - 1.25, bold: true, align: 'center', valign: 'middle', fontSize: L.fit(a.value, mw - 0.5, h - 1.3, 72, 28, F.head, true) });
        body(s, a.label, X0 + sw + G + 0.3, AY + h - 1.0, mw - 0.6, 0.85, { color: C.ink, align: 'center', max: 16 });
        [[b, X0, C.tile], [c, X0 + sw + mw + 2 * G, C.lav]].forEach(([v, x, fill]) => {
          tile(s, x, AY, sw, h, fill);
          t.text(s, v.value, { x: x + 0.18, y: AY + 0.2, w: sw - 0.36, h: 0.95, bold: true, valign: 'middle', fontSize: L.fit(v.value, sw - 0.36, 0.9, 38, 18, F.head, true) });
          body(s, v.label, x + 0.18, AY + 1.2, sw - 0.36, h - 1.35, { color: sub(fill), max: 14 });
        });
        if (nh) { tile(s, X0, AY + h + G, AW, nh, C.tile); body(s, d.note, X0 + 0.22, AY + h + G + 0.04, AW - 0.44, nh - 0.08, { valign: 'middle', max: 13 }); }
      },
      async (d) => { // the black tray: rows of a colour tile and a label tile
        const s = tray(d), nh = d.note ? 0.8 : 0, n = 3, h = (AH - (nh ? nh + G : 0) - G * (n - 1)) / n, vw = 3.1, fills = [C.orange, C.lav, 'FFFFFF'];
        d.stats.forEach((x, i) => {
          const y = AY + i * (h + G);
          tile(s, X0, y, vw, h, fills[i]);
          t.text(s, x.value, { x: X0 + 0.15, y, w: vw - 0.3, h, bold: true, align: 'center', valign: 'middle', fontSize: L.fit(x.value, vw - 0.3, h - 0.1, 40, 18, F.head, true) });
          tile(s, X0 + vw + G, y, AW - vw - G, h, '262626');
          body(s, x.label, X0 + vw + G + 0.25, y + 0.05, AW - vw - G - 0.5, h - 0.1, { color: 'FFFFFF', valign: 'middle', max: 16 });
        });
        if (nh) body(s, d.note, X0 + 0.1, AY + 3 * h + 3 * G, AW - 0.2, nh, { color: 'BDBDBD', max: 13 });
      },
      async (d) => { // a broad top tile and a side strip, two smaller tiles below
        const s = page(d), [a, b, c] = d.stats, tw = 5.9, rw = AW - tw - G, h1 = (AH - G) * 0.54, h2 = AH - h1 - G, w2 = (tw - G) / 2;
        tile(s, X0, AY, tw, h1, C.lav);
        t.text(s, a.value, { x: X0 + 0.28, y: AY + 0.12, w: 2.95, h: h1 - 0.24, bold: true, valign: 'middle', fontSize: L.fit(a.value, 2.9, h1 - 0.3, 60, 26, F.head, true) });
        body(s, a.label, X0 + 3.3, AY + 0.15, tw - 3.5, h1 - 0.3, { color: C.ink, valign: 'middle', max: 15 });
        [[b, X0, C.tile], [c, X0 + w2 + G, C.black]].forEach(([v, x, fill]) => {
          tile(s, x, AY + h1 + G, w2, h2, fill);
          t.text(s, v.value, { x: x + 0.2, y: AY + h1 + G + 0.08, w: w2 - 0.4, h: 0.72, bold: true, color: on(fill), valign: 'middle', fontSize: L.fit(v.value, w2 - 0.4, 0.68, 32, 18, F.head, true) });
          body(s, v.label, x + 0.2, AY + h1 + G + 0.82, w2 - 0.4, h2 - 0.9, { color: sub(fill), max: 13 });
        });
        tile(s, X0 + tw + G, AY, rw, AH, d.note ? C.tile : C.orange);
        if (d.note) body(s, d.note, X0 + tw + G + 0.2, AY + 0.2, rw - 0.4, AH - 0.4, { valign: 'middle', max: 14 });
        else { t.img(s, await L.icon('FiTrendingUp', 'FFFFFF', 2), X0 + tw + G + rw / 2 - 0.45, AY + AH / 2 - 0.45, 0.9, 0.9); }
      },
    ],
    compare: [
      async (d) => { // two stacked bands: a name tile and a list tile on each
        const s = page(d), h = (AH - G) / 2, nw = 2.5;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = AY + i * (h + G), dark = i === 1, n = side.items.length, rh = (h - 0.16) / n, fill = dark ? C.black : C.tile, nf = dark ? C.orange : C.lav;
          tile(s, X0, y, nw, h, nf);
          head(s, side.h, X0 + 0.2, y + 0.12, nw - 0.4, h - 0.24, { max: 20 });
          tile(s, X0 + nw + G, y, AW - nw - G, h, fill);
          side.items.forEach((it, k) => {
            const yy = y + 0.08 + k * rh;
            t.oval(s, X0 + nw + G + 0.2, yy + rh / 2 - 0.06, 0.12, 0.12, dark ? C.orange : '8E77E0');
            body(s, it, X0 + nw + G + 0.42, yy, AW - nw - G - 0.6, rh - 0.02, { color: on(fill), valign: 'middle', max: 13 });
          });
        }
      },
      async (d) => { // mirrored about one narrow orange tile
        const s = page(d), mw = 0.7, w = (AW - mw - 2 * G) / 2, tw = w - 0.5, mx = X0 + w + G, rx = mx + mw + G, avail = AH - 0.95;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, tw, F.body, 0.18, avail);
        tile(s, X0, AY, w, AH, C.lav); tile(s, rx, AY, w, AH, C.tile); tile(s, mx, AY, mw, AH, C.orange);
        t.text(s, '≠', { x: mx, y: AY, w: mw, h: AH, fontSize: 32, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        head(s, d.left.h, X0 + 0.25, AY + 0.15, tw, 0.55, { align: 'right', max: 20 }); head(s, d.right.h, rx + 0.25, AY + 0.15, tw, 0.55, { max: 20 });
        let y = AY + 0.82;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: X0 + 0.25, y, w: tw, h: rows[k], fontSize: fs, color: C.ink, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: rx + 0.25, y, w: tw, h: rows[k], fontSize: fs, color: C.ink });
          y += Math.max(rows[k], Math.min(0.72, avail / rows.length));
        }
      },
    ],
    statement: [
      async (d) => { // the note and an orange square on the top row, the great black tile beneath them
        const s = page(d), h2 = d.caption ? 1.3 : 0, h1 = AH - (h2 ? h2 + G : 0), sq = 1.3, y1 = AY + (h2 ? h2 + G : 0);
        if (d.caption) {
          tile(s, X0, AY, sq, h2, C.orange);
          t.img(s, await L.icon('FiMessageCircle', 'FFFFFF', 2), X0 + sq / 2 - 0.28, AY + h2 / 2 - 0.28, 0.56, 0.56);
          tile(s, X0 + sq + G, AY, AW - sq - G, h2);
          t.text(s, d.caption, { x: X0 + sq + G + 0.25, y: AY + 0.06, w: AW - sq - G - 0.5, h: h2 - 0.12, fontSize: L.fit(d.caption, AW - sq - G - 0.5, h2 - 0.14, 14, 10, F.body), color: C.gray, valign: 'middle' });
        }
        tile(s, X0, y1, AW, h1, C.black);
        t.text(s, L.runs(d.text), { x: X0 + 0.4, y: y1 + 0.12, w: AW - 0.8, h: h1 - 0.24, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, AW - 0.8, h1 - 0.3, 38, 20, F.head, true) });
      },
      async (d) => { // a tall note tile on the left, the great orange tile carrying the thought
        const s = page(d), lw = 2.9, rw = AW - lw - G, dh = 0.8;
        tile(s, X0, AY, lw, dh, C.lav); dots(s, X0, AY, lw, dh);
        tile(s, X0, AY + dh + G, lw, AH - dh - G);
        if (d.caption) t.text(s, d.caption, { x: X0 + 0.2, y: AY + dh + G + 0.14, w: lw - 0.4, h: AH - dh - G - 0.28, fontSize: L.fit(d.caption, lw - 0.4, AH - dh - G - 0.28, 14, 10, F.body), color: C.gray, valign: 'middle' });
        tile(s, X0 + lw + G, AY, rw, AH, C.orange);
        t.text(s, L.runs(d.text), { x: X0 + lw + G + 0.38, y: AY + 0.2, w: rw - 0.76, h: AH - 0.4, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, rw - 0.76, AH - 0.45, 38, 20, F.head, true) });
      },
    ],
    timeline: [
      async (d) => { // a diagonal: the date tile grows, the event tile shrinks
        const s = page(d), n = d.items.length, h = (AH - G * (n - 1)) / n, y0 = AY, step = 0.5, w0 = 1.45;
        d.items.forEach((it, i) => {
          const y = y0 + i * (h + G), yw = w0 + i * step, last = i === n - 1, fill = last ? C.orange : i === 0 ? C.black : C.lav, tw = AW - yw - G;
          tile(s, X0, y, yw, h, fill);
          t.text(s, it.year, { x: X0 + 0.14, y, w: yw - 0.28, h, bold: true, color: on(fill), valign: 'middle', fontSize: L.fit(it.year, yw - 0.3, h - 0.12, 22, 12, F.head, true) });
          tile(s, X0 + yw + G, y, tw, h);
          head(s, it.h, X0 + yw + G + 0.18, y + 0.04, tw - 0.36, 0.3, { max: 14 });
          body(s, it.t, X0 + yw + G + 0.18, y + 0.34, tw - 0.36, h - 0.38, { max: 13 });
        });
      },
      async (d) => { // the black tray: four tickets, a date tile joined to an event tile
        const s = tray(d), gap = G, w = (AW - gap) / 2, hh = (AH - gap) / 2, yw = 1.25, fills = [C.orange, C.lav, C.lav, C.orange];
        d.items.forEach((it, i) => {
          const x = X0 + (i % 2) * (w + gap), y = AY + Math.floor(i / 2) * (hh + gap);
          tile(s, x, y, yw, hh, fills[i]);
          t.text(s, it.year, { x: x + 0.08, y, w: yw - 0.16, h: hh, bold: true, align: 'center', valign: 'middle', fontSize: L.fit(it.year, yw - 0.18, 0.8, 22, 12, F.head, true) });
          tile(s, x + yw + 0.05, y, w - yw - 0.05, hh);
          head(s, it.h, x + yw + 0.2, y + 0.1, w - yw - 0.35, 0.38, { max: 15 });
          body(s, it.t, x + yw + 0.2, y + 0.5, w - yw - 0.35, hh - 0.58, { max: 13 });
        });
      },
      async (d) => { // a long black bar of dates, tiles hanging from it at different lengths
        const s = page(d), n = d.items.length, gap = G, w = (AW - gap * (n - 1)) / n, bh = 0.68, base = AY + bh + G, cuts = [0.55, 0, 0.3, 0.75];
        tile(s, X0, AY, AW, bh, C.black);
        d.items.forEach((it, i) => {
          const x = X0 + i * (w + gap), cut = cuts[i], h = AH - bh - G - cut, fill = i === 1 ? C.lav : C.tile;
          t.text(s, it.year, { x: x + 0.2, y: AY, w: w - 0.3, h: bh, bold: true, color: i === 1 ? C.orange : 'FFFFFF', valign: 'middle', fontSize: L.fit(it.year, w - 0.32, bh - 0.1, 22, 12, F.head, true) });
          tile(s, x, base, w, h, fill);
          head(s, it.h, x + 0.16, base + 0.1, w - 0.32, 0.45, { max: 14, valign: 'top' });
          body(s, it.t, x + 0.16, base + 0.58, w - 0.32, h - 0.64, { color: sub(fill), max: 13 });
          if (cut > 0.2) { tile(s, x, base + h + G, w, cut - G, i === 0 ? C.orange : C.lav); }
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.stats = V.stats.shift(); // the old stats (a big tile and two small) read like the cards page
  R.timeline = V.timeline.shift(); // the old timeline (columns of tiles) read like the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (_t, _s, d) => ({ x: 0.4, y: 5.27, w: 9.2, h: 0.2, color: d._night ? 'BDBDBD' : C.gray, fontSize: 7.5 }));
  return L.save(pres, out, { name: 'SlideAI Bento', colors: { dk1: C.ink, lt1: C.tile, dk2: C.black, lt2: C.bg, accent1: C.orange, accent2: C.lav, accent3: C.gray, accent4: '8E77E0', accent5: 'BBBBBB', accent6: 'DDDDDD', hlink: C.orange, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "zamonaviy mahsulot taqdimoti: juda qisqa, ta'sirchan", "limits": {"card_t3": 70, "card_t4": 55}, "prefer": "data"};
module.exports = { id: 18, slug: 'bento', name: 'Bento', category: 'business', build, style: STYLE };
