/**
 * 09 Luxe — premium black and gold: thin gold frames and hairlines, italic serif titles,
 * roman numerals, lots of air.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: '0F0F10', gold: 'C9A45C', champ: 'EADFC6', gray: '9A9A9A', white: 'F4F1EA', line: '3A3832' };
const F = { head: 'Times New Roman', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const dia = (s, x, y, d = 0.14) => t.shape(s, 'DIAMOND', { x, y, w: d, h: d, fill: { color: C.gold }, objectName: 'Diamond' });

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.line(s, 0.7, 0.5, 8.6, 0, C.gold, 0.75, { name: 'Gold rule' });
    t.text(s, d.title, { x: 0.7, y: 0.68, w: 8.6, h: 0.8, fontFace: F.head, italic: true, color: C.champ, valign: 'middle', fontSize: L.fit(d.title, 8.6, 0.8, 32, 22, F.head, false, 1, true) });
    dia(s, 0.7, 5.12);
    s.slideNumber = { x: 8.8, y: 5.05, w: 0.5, h: 0.3, fontFace: F.head, fontSize: 12, color: C.gold, align: 'right' };
    return s;
  };
  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    if (d.image) { t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' }); t.rect(s, 0, 0, W, H, C.bg, { t: 16, name: 'Veil' }); }
    t.rect(s, 0.35, 0.35, W - 0.7, H - 0.7, null, { line: { color: C.gold, width: 1 }, name: 'Frame' });
    t.rect(s, 0.47, 0.47, W - 0.94, H - 0.94, null, { line: { color: C.gold, width: 0.5 }, name: 'Inner frame' });
    dia(s, W / 2 - 0.09, 1.15, 0.18);
    const fs = L.fit(d.title, 7.4, 1.8, 48, 28, F.head, false, 1, true);
    t.text(s, d.title, { x: 1.3, y: 1.45, w: 7.4, h: 1.85, fontFace: F.head, italic: true, fontSize: fs, color: C.champ, align: 'center', valign: 'bottom' });
    t.line(s, W / 2 - 0.5, 3.55, 1.0, 0, C.gold, 1);
    if (d.subtitle) t.text(s, d.subtitle, { x: 1.8, y: 3.8, w: 6.4, h: 1.0, fontSize: 13, color: C.gray, align: 'center', charSpacing: 1 });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.7 + Math.floor(i / per) * 4.5, y = 1.75 + (i % per) * rh;
        t.text(s, L.ROMAN[i], { x, y, w: 0.7, h: rh - 0.2, fontFace: F.head, fontSize: 22, color: C.gold, valign: 'middle' });
        t.text(s, it, { x: x + 0.8, y, w: 3.3, h: rh - 0.2, fontFace: F.head, fontSize: 20, color: C.white, valign: 'middle' });
        t.line(s, x, y + rh - 0.1, 4.1, 0, C.line, 0.75);
      });
    },
    async cards(d) {
      if (d.items.length === 4) { // 2 x 2: roman numeral and title on one line, text below
        const s = page(d), w = 4.15, h = 1.5;
        d.items.forEach((it, i) => {
          const x = 0.7 + (i % 2) * (w + 0.3), y = 1.75 + Math.floor(i / 2) * (h + 0.25);
          t.rect(s, x, y, w, h, null, { line: { color: C.gold, width: 0.75 }, name: 'Gold box' });
          t.text(s, L.ROMAN[i], { x: x + 0.3, y: y + 0.22, w: 0.6, h: 0.42, fontFace: F.head, fontSize: 18, color: C.gold, valign: 'middle' });
          t.text(s, it.h, { x: x + 0.9, y: y + 0.22, w: w - 1.2, h: 0.42, fontFace: F.head, italic: true, fontSize: 20, color: C.champ, valign: 'middle' });
          t.text(s, it.t, { x: x + 0.3, y: y + 0.75, w: w - 0.6, h: h - 0.85, fontSize: 14, color: C.gray });
        });
        return;
      }
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.6, 0.45, 21, 14, F.head, false, 1, true)));
      const h = Math.min(3.25, 1.45 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.6, F.body))) + 0.4);
      d.items.forEach((it, i) => {
        const x = 0.7 + i * (w + gap), y = 1.75;
        t.rect(s, x, y, w, h, null, { line: { color: C.gold, width: 0.75 }, name: 'Gold box' });
        t.text(s, L.ROMAN[i], { x: x + 0.3, y: y + 0.3, w: 1, h: 0.35, fontFace: F.head, fontSize: 15, color: C.gold });
        t.text(s, it.h, { x: x + 0.3, y: y + 0.75, w: w - 0.6, h: 0.45, fontFace: F.head, italic: true, fontSize: hfs, color: C.champ });
        t.text(s, it.t, { x: x + 0.3, y: y + 1.3, w: w - 0.6, h: h - 1.45, fontSize: 14, color: C.gray });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.6 / n;
      d.steps.forEach((st, i) => {
        const x = 0.7 + i * cw + (i ? 0.3 : 0), w = cw - (i ? 0.6 : 0.3);
        if (i) t.line(s, 0.7 + i * cw, 1.85, 0, 2.9, C.line, 0.75);
        t.text(s, L.ROMAN[i], { x, y: 1.7, w, h: 0.85, fontFace: F.head, fontSize: 44, color: C.gold, valign: 'bottom' });
        t.text(s, st.h, { x, y: 2.75, w, h: 0.45, fontFace: F.head, italic: true, fontSize: L.fit(st.h, w, 0.45, 20, 13, F.head, false, 1, true), color: C.champ });
        t.text(s, st.t, { x, y: 3.3, w, h: 1.6, fontSize: 14, color: C.gray });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.6 / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.6, 1.1, 64, 30, F.head)));
      d.stats.forEach((x, i) => {
        const px = 0.7 + i * cw + (i ? 0.3 : 0), w = cw - (i ? 0.6 : 0.3);
        if (i) t.line(s, 0.7 + i * cw, 1.9, 0, 2.5, C.line, 0.75);
        t.text(s, x.value, { x: px, y: 1.8, w, h: 1.2, fontFace: F.head, fontSize: vfs, color: C.gold, valign: 'bottom' });
        t.text(s, x.label, { x: px, y: 3.2, w, h: 1.0, fontSize: 14, color: C.gray });
      });
      if (d.note) t.text(s, d.note, { x: 0.7, y: 4.5, w: 8.6, h: 0.45, fontFace: F.head, italic: true, fontSize: 14, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 3.9;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.35, F.body, 0, 4.85 - 2.5 - 0.22 * Math.max(d.left.items.length, d.right.items.length));
      t.line(s, W / 2, 1.8, 0, 3.0, C.gold, 0.75);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.4 : 0.7;
        t.text(s, side.h, { x, y: 1.75, w, h: 0.5, fontFace: F.head, italic: true, fontSize: 24, color: i ? C.gold : C.champ });
        let y = 2.5;
        side.items.forEach((it, k) => {
          dia(s, x, y + 0.07, 0.11);
          t.text(s, it, { x: x + 0.3, y, w: w - 0.35, h: rows[k] + 0.05, fontSize: CFS, color: C.white });
          y += rows[k] + 0.22;
        });
      });
    },
    async statement(d) {
      const s = page({ title: d.title });
      const fs = L.fit(d.text, 7.6, 1.6, 38, 24, F.head, false, 1, true);
      dia(s, W / 2 - 0.08, 1.8, 0.16);
      t.text(s, L.runs(d.text), { x: 1.2, y: 2.1, w: 7.6, h: 1.6, fontFace: F.head, italic: true, fontSize: fs, color: C.champ, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.9, y: 3.85, w: 6.2, h: 1.0, fontSize: 14, color: C.gray, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.6 / n, ly = 2.6;
      t.line(s, 0.7, ly, 8.6, 0, C.gold, 0.75);
      d.items.forEach((it, i) => {
        const x = 0.7 + i * cw;
        t.text(s, it.year, { x, y: 1.75, w: cw - 0.2, h: 0.65, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.6, 30, 16, F.head), color: C.gold, valign: 'bottom' });
        dia(s, x, ly - 0.08, 0.16);
        t.text(s, it.h, { x, y: 2.85, w: cw - 0.3, h: 0.42, fontFace: F.head, italic: true, fontSize: 19, color: C.champ });
        t.text(s, it.t, { x, y: 3.35, w: cw - 0.35, h: 1.6, fontSize: 14, color: C.gray });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.bg };
      const fs = L.fit(d.text, 7.4, 2.2, 36, 22, F.head, false, 1, true);
      const th = L.height(d.text, fs, 7.4, F.head, false, 1, true);
      t.text(s, '\u201C', { x: W / 2 - 0.6, y: 3.95 - th - 1.15, w: 1.2, h: 1.2, fontFace: F.head, fontSize: 96, color: C.gold, align: 'center' });
      t.text(s, d.text, { x: 1.3, y: 1.6, w: 7.4, h: 2.35, fontFace: F.head, italic: true, fontSize: fs, color: C.champ, align: 'center', valign: 'bottom' });
      t.line(s, W / 2 - 0.4, 4.15, 0.8, 0, C.gold, 0.75);
      if (d.author) t.text(s, d.author, { x: 1.3, y: 4.3, w: 7.4, h: 0.4, fontSize: 13, color: C.gray, align: 'center', charSpacing: 1 });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.65, 3.9, 3.25, null, { line: { color: C.gold, width: 0.75 }, name: 'Gold frame' });
      await PH(s, d.image, 0.72, 1.77, 3.66, 3.01);
      t.text(s, d.text, { x: 4.85, y: 1.65, w: 4.45, h: 3.25, fontSize: L.fit(d.text, 4.45, 3.25, 15, 11, F.body, false, 1.3), color: C.white, lineSpacingMultiple: 1.3, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: 0.7, y: 1.65, w: 4.2, h: 3.25, fontSize: L.fit(d.text, 4.2, 3.25, 15, 11, F.body, false, 1.3), color: C.white, lineSpacingMultiple: 1.3, valign: 'middle' });
      t.rect(s, 5.3, 1.65, 4.0, 3.25, null, { line: { color: C.gold, width: 0.75 }, name: 'Gold frame' });
      await PH(s, d.image, 5.42, 1.77, 3.76, 3.01);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.55, 3.2 / n);
      d.items.forEach((it, i) => {
        const y = 1.75 + i * rh;
        t.text(s, L.ROMAN[i] || String(i + 1), { x: 0.7, y, w: 0.6, h: rh, fontFace: F.head, fontSize: 15, color: C.gold, valign: 'middle' });
        t.text(s, it, { x: 1.4, y, w: 7.9, h: rh, fontSize: L.fit(it, 7.9, rh - 0.04, 13, 10, F.body), color: C.champ, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
  });
  // ---- further ways to draw a type, in this template's jeweller's world (gold frames, facets, roman numerals, a menu's leader dots, the champagne salon): a deck's pages must not look alike (L.pages)
  const INK = C.bg, SOFT = '4B4436', DGOLD = '8C6F3A', Y0 = 1.72, Y1 = 4.92;
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.gray, align: o.align, valign: o.valign || 'top' });
  const em = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontFace: F.head, italic: true, fontSize: L.fit(txt, w, h, o.max || 20, 12, F.head, false, 1, true), color: o.color || C.champ, align: o.align, valign: o.valign || 'middle' });
  const roman = (s, i, x, y, w, h, o = {}) => t.text(s, L.ROMAN[i], { x, y, w, h, fontFace: F.head, fontSize: o.size || 22, color: o.color || C.gold, align: o.align, valign: 'middle' });
  const facet = (s, x, y, d, line = C.gold, fill = null) => t.shape(s, 'DIAMOND', { x, y, w: d, h: d, fill: fill ? { color: fill } : { type: 'none' }, line: { color: line, width: 0.75 }, objectName: 'Facet' });
  const salon = (d) => { // the champagne salon: the page turned inside out
    d._light = true;
    const s = pres.addSlide(); s.background = { color: C.champ };
    t.line(s, 0.7, 0.5, 8.6, 0, DGOLD, 0.75, { name: 'Gold rule' });
    t.text(s, d.title, { x: 0.7, y: 0.68, w: 8.6, h: 0.8, fontFace: F.head, italic: true, color: INK, valign: 'middle', fontSize: L.fit(d.title, 8.6, 0.8, 32, 22, F.head, false, 1, true) });
    t.shape(s, 'DIAMOND', { x: 0.7, y: 5.12, w: 0.14, h: 0.14, fill: { color: DGOLD }, objectName: 'Diamond' });
    s.slideNumber = { x: 8.8, y: 5.05, w: 0.5, h: 0.3, fontFace: F.head, fontSize: 12, color: INK, align: 'right' };
    return s;
  };
  const V = {
    image: [
      async (d) => { // the picture cut like a stone, framed by its own facet
        const s = page(d), dd = 3.5, x = 5.55, y = 1.5;
        t.text(s, d.text, { x: 0.7, y: Y0, w: 4.75, h: Y1 - Y0, fontSize: L.fit(d.text, 4.75, Y1 - Y0, 14, 10, F.body, false, 1.25), color: C.white, lineSpacingMultiple: 1.25, valign: 'middle' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: { poly: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]] } }), x, y, dd, dd, { alt: '' });
        facet(s, x - 0.14, y - 0.14, dd + 0.28);
      },
      async (d) => { // the picture across the page, title and words on a black card in a gold frame
        const s = page(d);
        await PH(s, d.image, 0, 0, W, 4.95);
        t.rect(s, 4.85, 0.38, 4.75, 4.2, C.bg, { line: { color: C.gold, width: 1 }, name: 'Card' });
        t.rect(s, 4.95, 0.48, 4.55, 4.0, null, { line: { color: C.gold, width: 0.5 }, name: 'Inner frame' });
        t.text(s, d.title, { x: 5.2, y: 0.6, w: 4.05, h: 0.95, fontFace: F.head, italic: true, color: C.champ, valign: 'middle', fontSize: L.fit(d.title, 4.05, 0.92, 24, 15, F.head, false, 1, true) });
        t.line(s, 5.2, 1.6, 0.8, 0, C.gold, 1);
        t.text(s, d.text, { x: 5.2, y: 1.72, w: 4.05, h: 2.65, fontSize: L.fit(d.text, 4.05, 2.65, 13, 10, F.body, false, 1.15), color: C.white, lineSpacingMultiple: 1.15 });
      },
      async (d) => { // the champagne salon: a tall picture against the page's edge
        const s = salon(d);
        t.rect(s, 0, 0, 3.9, H, C.champ, { name: 'Edge' });
        await PH(s, d.image, 0, 0, 3.55, 4.95);
        t.rect(s, 3.55, 0, 0.05, 4.95, DGOLD, { name: 'Gold edge' });
        t.rect(s, 3.6, 0.3, 6.4, 1.3, C.champ, { name: 'Title ground' });
        t.line(s, 3.95, 0.5, 5.35, 0, DGOLD, 0.75, { name: 'Gold rule' });
        t.text(s, d.title, { x: 3.95, y: 0.62, w: 5.35, h: 0.95, fontFace: F.head, italic: true, color: INK, valign: 'middle', fontSize: L.fit(d.title, 5.35, 0.92, 28, 18, F.head, false, 1, true) });
        t.text(s, d.text, { x: 3.95, y: Y0, w: 5.35, h: Y1 - Y0, fontSize: L.fit(d.text, 5.35, Y1 - Y0, 14, 10, F.body, false, 1.2), color: INK, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // a letterbox between gold hairlines, the words below it
        const s = page(d);
        t.line(s, 0, Y0 - 0.1, W, 0, C.gold, 0.75, { name: 'Gold rule' });
        await PH(s, d.image, 0, Y0 - 0.04, W, 1.62);
        t.line(s, 0, Y0 + 1.64, W, 0, C.gold, 0.75, { name: 'Gold rule' });
        const y = Y0 + 1.76;
        dia(s, 0.7, y + 0.04);
        t.text(s, d.text, { x: 1.0, y, w: 8.3, h: 4.98 - y, fontSize: L.fit(d.text, 8.3, 4.98 - y, 14, 10, F.body, false, 1.1), color: C.white, lineSpacingMultiple: 1.1 });
      },
    ],
    cards: [
      async (d) => { // the menu: roman numeral, dish, description, a hairline under each
        const s = page(d), n = d.items.length, h = (Y1 - Y0) / n;
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + i * h;
          roman(s, i, 0.7, y, 0.75, h - 0.1, { size: 26 });
          t.img(s, await L.icon(it.icon, C.gold, 1.5), 1.5, y + (h - 0.1) / 2 - 0.14, 0.28, 0.28);
          em(s, it.h, 1.95, y, 2.6, h - 0.1, { max: 19 });
          body(s, it.t, 4.75, y + 0.02, 4.55, h - 0.14, { valign: 'middle', color: C.white, max: 13 });
          if (i < n - 1) t.line(s, 0.7, y + h - 0.04, 8.6, 0, C.line, 0.75);
        }
      },
      async (d) => { // the champagne salon: black cases at two heights
        const s = salon(d), n = d.items.length, gap = 0.2, w = (8.6 - gap * (n - 1)) / n, h = 2.95;
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + i * (w + gap), y = i % 2 ? 1.97 : 1.62;
          t.rect(s, x, y, w, h, C.bg, { name: 'Case' });
          t.rect(s, x + 0.07, y + 0.07, w - 0.14, h - 0.14, null, { line: { color: C.gold, width: 0.5 }, name: 'Inner frame' });
          t.img(s, await L.icon(it.icon, C.gold, 1.75), x + 0.22, y + 0.24, 0.3, 0.3);
          roman(s, i, x + w - 0.85, y + 0.2, 0.63, 0.36, { size: 16, align: 'right' });
          em(s, it.h, x + 0.22, y + 0.62, w - 0.44, 0.6, { max: 17, valign: 'top' });
          body(s, it.t, x + 0.22, y + 1.25, w - 0.44, h - 1.38, { color: C.white, max: 12 });
        }
      },
      async (d) => { // a great stone in the middle, the items set round it
        const s = page(d), n = d.items.length, cx = W / 2, cy = 3.32, md = 1.7, w = 3.1;
        facet(s, cx - md / 2, cy - md / 2, md);
        facet(s, cx - md / 2 + 0.17, cy - md / 2 + 0.17, md - 0.34, C.line);
        t.shape(s, 'DIAMOND', { x: cx - 0.34, y: cy - 0.34, w: 0.68, h: 0.68, fill: { color: C.gold }, objectName: 'Stone' });
        const spots = n === 4 ? [[0.7, Y0], [W - 0.7 - w, Y0], [0.7, 3.36], [W - 0.7 - w, 3.36]] : [[0.7, Y0], [W - 0.7 - w, 2.53], [0.7, 3.36]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right';
          t.img(s, await L.icon(it.icon, C.gold, 1.75), right ? x : x + w - 0.28, y + 0.03, 0.28, 0.28);
          em(s, it.h, right ? x + 0.38 : x, y, w - 0.38, 0.36, { align: a, max: 18 });
          body(s, it.t, x, y + 0.4, w, 1.14, { align: a, max: 13 });
        }
      },
      async (d) => { // one piece in the gold case, the others listed beside it
        const s = page(d), n = d.items.length, [a, ...rest] = d.items, rh = (Y1 - Y0) / rest.length;
        t.rect(s, 0.7, Y0, 3.45, Y1 - Y0, C.gold, { name: 'Gold case' });
        t.rect(s, 0.79, Y0 + 0.09, 3.27, Y1 - Y0 - 0.18, null, { line: { color: C.bg, width: 0.5 }, name: 'Inner frame' });
        t.img(s, await L.icon(a.icon, C.bg, 1.75), 1.0, Y0 + 0.28, 0.46, 0.46);
        em(s, a.h, 1.0, Y0 + 0.86, 2.85, 0.62, { color: C.bg, max: 22, valign: 'top' });
        body(s, a.t, 1.0, Y0 + 1.5, 2.85, 1.5, { color: C.bg, max: 14 });
        for (const [k, it] of rest.entries()) {
          const y = Y0 + k * rh;
          t.img(s, await L.icon(it.icon, C.gold, 1.75), 4.5, y + 0.06, 0.3, 0.3);
          em(s, it.h, 4.95, y + 0.02, 4.35, 0.38, { max: 18 });
          body(s, it.t, 4.95, y + 0.42, 4.35, rh - 0.5, { color: C.white, max: 13 });
          if (k < rest.length - 1) t.line(s, 4.5, y + rh - 0.05, 4.8, 0, C.line, 0.75);
        }
        if (n < 3) t.line(s, 4.5, Y0, 4.8, 0, C.line, 0.75);
      },
    ],
    process: [
      async (d) => { // down a staircase of gold-edged treads
        const s = page(d), n = d.steps.length, h = (Y1 - Y0) / n, shift = n === 4 ? 0.62 : 0.85;
        d.steps.forEach((st, i) => {
          const x = 0.7 + i * shift, y = Y0 + i * h, w = 8.6 - i * shift;
          t.rect(s, x, y, w, h - 0.08, null, { line: { color: C.gold, width: 0.75 }, name: 'Tread' });
          roman(s, i, x + 0.12, y, 0.72, h - 0.08, { size: 24 });
          em(s, st.h, x + 0.85, y, 2.2, h - 0.08, { max: 16 });
          body(s, st.t, x + 3.15, y + 0.03, w - 3.28, h - 0.14, { valign: 'middle', color: C.white, max: 12 });
        });
      },
      async (d) => { // the champagne salon: a gold thread down the page, steps to either side
        const s = salon(d), n = d.steps.length, cx = W / 2, w = 3.9, rh = (Y1 - Y0 - 0.15) / n;
        t.line(s, cx, Y0 - 0.1, 0, Y1 - Y0 + 0.15, DGOLD, 1, { name: 'Thread' });
        d.steps.forEach((st, i) => {
          const right = i % 2 === 1, y = Y0 + i * rh + (n === 3 ? 0.02 : 0), x = right ? cx + 0.45 : cx - 0.45 - w, a = right ? 'left' : 'right', dd = 0.42;
          const hh = n === 3 ? 1.05 : 1.48;
          t.shape(s, 'DIAMOND', { x: cx - dd / 2, y: y + 0.02, w: dd, h: dd, fill: { color: INK }, objectName: 'Stone' });
          em(s, st.h, x, y, w, 0.38, { color: INK, align: a, max: 18 });
          body(s, st.t, x, y + 0.4, w, Math.min(hh, rh * 2 - 0.5, Y1 + 0.1 - (Y0 + (n - 1) * rh + 0.4)), { color: SOFT, align: a, max: 13 });
        });
      },
      async (d) => { // four gold frames two by two, each numeral breaking its frame's edge
        const s = page(d), n = d.steps.length, gap = 0.34, w = (8.6 - gap) / 2, h = 1.42, y0 = 1.85;
        const spot = (i) => (i < 2 ? [0.7 + i * (w + gap), y0] : [0.7 + (n === 3 ? 0 : (3 - i) * (w + gap)), y0 + h + 0.28]);
        d.steps.forEach((st, i) => {
          const [x, y] = spot(i), ww = n === 3 && i === 2 ? 8.6 : w;
          t.rect(s, x, y, ww, h, null, { line: { color: C.gold, width: 0.75 }, name: 'Gold frame' });
          t.rect(s, x + 0.2, y - 0.2, 0.72, 0.4, C.bg, { name: 'Gap' });
          roman(s, i, x + 0.2, y - 0.2, 0.72, 0.4, { size: 22, align: 'center' });
          em(s, st.h, x + 1.0, y + 0.06, ww - 1.15, 0.36, { max: 17 });
          body(s, st.t, x + 0.2, y + 0.45, ww - 0.4, h - 0.5, { color: C.white, max: 13 });
        });
        t.text(s, '→', { x: 0.7 + w, y: y0 + h / 2 - 0.2, w: gap, h: 0.4, fontFace: F.body, fontSize: 14, color: C.gold, align: 'center', valign: 'middle' });
        const dx = n === 4 ? 0.7 + w + gap + w / 2 : W / 2;
        t.text(s, '↓', { x: dx - 0.2, y: y0 + h + 0.02, w: 0.4, h: 0.26, fontFace: F.body, fontSize: 12, color: C.gold, align: 'center', valign: 'middle' });
        if (n === 4) t.text(s, '←', { x: 0.7 + w, y: y0 + h + 0.28 + h / 2 - 0.2, w: gap, h: 0.4, fontFace: F.body, fontSize: 14, color: C.gold, align: 'center', valign: 'middle' });
      },
    ],
    stats: [
      async (d) => { // the leading figure in a double frame, the rest beside it
        const s = page(d), [a, ...rest] = d.stats, fh = d.note ? 2.5 : 3.2;
        t.rect(s, 0.7, Y0, 4.0, fh, null, { line: { color: C.gold, width: 1 }, name: 'Frame' });
        t.rect(s, 0.8, Y0 + 0.1, 3.8, fh - 0.2, null, { line: { color: C.gold, width: 0.5 }, name: 'Inner frame' });
        t.text(s, a.value, { x: 1.0, y: Y0 + 0.2, w: 3.4, h: fh * 0.5, fontFace: F.head, color: C.gold, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.4, fh * 0.48, 66, 28, F.head) });
        body(s, a.label, 1.1, Y0 + 0.25 + fh * 0.5, 3.2, fh * 0.5 - 0.45, { align: 'center', color: C.champ, max: 14 });
        rest.forEach((x, i) => {
          const rh = fh / 2, y = Y0 + i * rh;
          t.text(s, x.value, { x: 5.1, y, w: 4.2, h: rh * 0.5, fontFace: F.head, color: C.gold, valign: 'bottom', fontSize: L.fit(x.value, 4.2, rh * 0.48, 36, 20, F.head) });
          body(s, x.label, 5.1, y + rh * 0.52, 4.2, rh * 0.44, { color: C.white, max: 13 });
          if (!i) t.line(s, 5.1, y + rh - 0.01, 4.2, 0, C.line, 0.75);
        });
        if (d.note) t.text(s, d.note, { x: 0.7, y: 4.32, w: 8.6, h: 0.66, fontFace: F.head, italic: true, fontSize: L.fit(d.note, 8.6, 0.64, 13, 10, F.head, false, 1, true), color: C.gray });
      },
      async (d) => { // the champagne salon: a price list, label and figure joined by leader dots
        const s = salon(d), rh = d.note ? 0.82 : 1.05;
        d.stats.forEach((x, i) => {
          const y = Y0 + i * rh, vw = 2.7;
          t.shape(s, 'DIAMOND', { x: 0.7, y: y + rh / 2 - 0.08, w: 0.13, h: 0.13, fill: { color: DGOLD }, objectName: 'Diamond' });
          body(s, x.label, 1.0, y + 0.03, 4.5, rh - 0.1, { color: INK, valign: 'middle', max: 15 });
          t.line(s, 5.6, y + rh * 0.62, 9.3 - 5.6 - vw + 0.1, 0, DGOLD, 1, { dash: 'sysDot', name: 'Leader' });
          t.text(s, x.value, { x: 9.3 - vw, y, w: vw, h: rh - 0.08, fontFace: F.head, italic: true, color: INK, align: 'right', valign: 'middle', fontSize: L.fit(x.value, vw - 0.2, rh - 0.12, 36, 18, F.head, false, 1, true) });
        });
        if (d.note) { t.line(s, 0.7, Y0 + 3 * rh + 0.03, 8.6, 0, DGOLD, 0.75); t.text(s, d.note, { x: 0.7, y: Y0 + 3 * rh + 0.08, w: 8.6, h: Y1 + 0.05 - Y0 - 3 * rh - 0.08, fontFace: F.head, italic: true, fontSize: L.fit(d.note, 8.6, Y1 - Y0 - 3 * rh - 0.05, 13, 10, F.head, false, 1, true), color: SOFT }); }
      },
      async (d) => { // three stones in a row, the middle one set in gold
        const s = page(d), cw = 8.6 / 3, dd = d.note ? 1.75 : 2.0, y = Y0 - 0.12;
        d.stats.forEach((x, i) => {
          const cx = 0.7 + i * cw + cw / 2, gold = i === 1;
          t.shape(s, 'DIAMOND', { x: cx - dd / 2, y, w: dd, h: dd, fill: gold ? { color: C.gold } : { type: 'none' }, line: { color: C.gold, width: 1 }, objectName: 'Stone' });
          t.text(s, x.value, { x: cx - dd * 0.34, y, w: dd * 0.68, h: dd, fontFace: F.head, color: gold ? C.bg : C.gold, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd * 0.64, 0.7, 30, 13, F.head) });
          body(s, x.label, cx - cw / 2 + 0.2, y + dd + 0.08, cw - 0.4, d.note ? 0.62 : 1.05, { align: 'center', color: C.white, max: 13 });
        });
        if (d.note) t.text(s, d.note, { x: 0.7, y: 4.32, w: 8.6, h: 0.66, fontFace: F.head, italic: true, align: 'center', fontSize: L.fit(d.note, 8.6, 0.64, 13, 10, F.head, false, 1, true), color: C.gray });
      },
    ],
    compare: [
      async (d) => { // black and champagne, mirrored about a stone
        const s = page(d), y0 = 1.62, h = 3.32, w = 3.75;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.16, h - 0.85);
        t.rect(s, W / 2, y0, W / 2, h, C.champ, { name: 'Champagne half' });
        t.line(s, 0, y0, W / 2, 0, C.gold, 0.75, { name: 'Gold rule' }); t.line(s, 0, y0 + h, W / 2, 0, C.gold, 0.75, { name: 'Gold rule' });
        em(s, d.left.h, 0.7, y0 + 0.12, w, 0.52, { align: 'right', max: 22 });
        em(s, d.right.h, 5.55, y0 + 0.12, w, 0.52, { color: INK, max: 22 });
        const step = Math.max(...rows, Math.min(0.72, (h - 0.85) / rows.length));
        let y = y0 + 0.78;
        for (let k = 0; k < rows.length; k++) {
          const yy = y;
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.7, y: yy, w, h: rows[k], fontSize: fs, color: C.white, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.55, y: yy, w, h: rows[k], fontSize: fs, color: INK });
          y += Math.min(step, Math.max(rows[k], (h - 0.85) / rows.length));
        }
        t.shape(s, 'DIAMOND', { x: W / 2 - 0.22, y: y0 + h / 2 - 0.22, w: 0.44, h: 0.44, fill: { color: C.gold }, line: { color: C.bg, width: 1.5 }, objectName: 'Stone' });
      },
      async (d) => { // two stacked shelves: the gold-framed above, the solid gold below
        const s = page(d), h = 1.55, y0 = 1.68;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = y0 + i * (h + 0.12), gold = i === 1, ink = gold ? C.bg : C.white;
          t.rect(s, 0.7, y, 8.6, h, gold ? C.gold : null, { line: { color: C.gold, width: 0.75 }, name: 'Shelf' });
          em(s, side.h, 0.9, y + 0.1, 2.2, h - 0.2, { color: gold ? C.bg : C.gold, max: 22 });
          t.line(s, 3.25, y + 0.15, 0, h - 0.3, gold ? C.bg : C.gold, 0.75);
          const n = side.items.length, rows = Math.ceil(n / 2), rh = (h - 0.14) / rows;
          side.items.forEach((it, k) => {
            const x = 3.42 + (k % 2) * 2.95, yy = y + 0.07 + Math.floor(k / 2) * rh;
            t.shape(s, 'DIAMOND', { x, y: yy + 0.05, w: 0.1, h: 0.1, fill: { color: gold ? C.bg : C.gold }, objectName: 'Bullet' });
            body(s, it, x + 0.18, yy, n === 3 && k === 2 ? 5.65 : 2.72, rh - 0.03, { color: ink, max: 12 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // a gold panel falls down the right side and carries the small print
        const s = page(d);
        t.rect(s, 6.55, 0, W - 6.55, 4.95, C.gold, { name: 'Gold panel' });
        t.line(s, 6.65, 0, 0, 4.95, C.bg, 0.5, { name: 'Inner rule' });
        t.rect(s, 0.6, 0.45, 5.95, 1.15, C.bg, { name: 'Title ground' });
        t.line(s, 0.7, 0.5, 5.65, 0, C.gold, 0.75, { name: 'Gold rule' });
        t.text(s, d.title, { x: 0.7, y: 0.64, w: 5.6, h: 0.85, fontFace: F.head, italic: true, color: C.champ, valign: 'middle', fontSize: L.fit(d.title, 5.6, 0.82, 28, 18, F.head, false, 1, true) });
        t.text(s, L.runs(d.text), { x: 0.7, y: Y0, w: 5.45, h: Y1 - Y0, fontFace: F.head, italic: true, color: C.champ, valign: 'middle', fontSize: L.fit(d.text, 5.45, Y1 - Y0 - 0.05, 34, 18, F.head, false, 1, true) });
        t.shape(s, 'DIAMOND', { x: 6.95, y: 0.72, w: 0.2, h: 0.2, fill: { color: C.bg }, objectName: 'Diamond' });
        if (d.caption) t.text(s, d.caption, { x: 6.95, y: 1.1, w: 2.6, h: 3.55, fontSize: L.fit(d.caption, 2.6, 3.55, 14, 10, F.body), color: C.bg });
      },
      async (d) => { // the champagne salon: an engraved card, the thought large, the note under a short rule
        const s = salon(d);
        const hh = d.caption ? 2.05 : 3.2;
        t.rect(s, 0.7, Y0 - 0.04, 0.07, hh, INK, { name: 'Bar' });
        t.text(s, L.runs(d.text), { x: 1.0, y: Y0 - 0.1, w: 8.3, h: hh + 0.1, fontFace: F.head, italic: true, color: INK, valign: 'middle', fontSize: L.fit(d.text, 8.3, hh, 36, 20, F.head, false, 1, true) });
        if (d.caption) { t.shape(s, 'DIAMOND', { x: 1.0, y: Y0 + hh + 0.09, w: 0.14, h: 0.14, fill: { color: DGOLD }, objectName: 'Diamond' }); t.text(s, d.caption, { x: 1.3, y: Y0 + hh + 0.05, w: 8.0, h: Y1 - Y0 - hh - 0.02, fontSize: L.fit(d.caption, 8.0, Y1 - Y0 - hh - 0.04, 14, 10, F.body), color: SOFT }); }
      },
    ],
    timeline: [
      async (d) => { // a gold thread down the left, the dates large as hallmarks
        const s = page(d), n = d.items.length, rh = (Y1 - Y0) / n, lx = 2.6;
        t.line(s, lx, Y0 + 0.1, 0, rh * (n - 1) + 0.1, C.gold, 0.75, { name: 'Thread' });
        d.items.forEach((it, i) => {
          const y = Y0 + i * rh;
          t.text(s, it.year, { x: 0.7, y, w: 1.65, h: 0.4, fontFace: F.head, color: C.gold, align: 'right', valign: 'middle', fontSize: L.fit(it.year, 1.65, 0.4, 24, 12, F.head) });
          dia(s, lx - 0.08, y + 0.12, 0.16);
          em(s, it.h, lx + 0.3, y, 6.4, 0.34, { max: 18 });
          body(s, it.t, lx + 0.3, y + 0.34, 6.4, rh - 0.38, { color: C.white, max: 12 });
        });
      },
      async (d) => { // the champagne salon: a necklace across the page, events hanging above and below it
        const s = salon(d), ly = 3.3, w = 3.95, xs = [0.7, 1.7, 5.0, 5.35];
        t.line(s, 0.4, ly, W - 0.8, 0, DGOLD, 1.25, { name: 'Necklace' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], y = up ? 1.62 : ly + 0.2;
          t.shape(s, 'DIAMOND', { x: x, y: ly - 0.11, w: 0.22, h: 0.22, fill: { color: INK }, objectName: 'Stone' });
          t.text(s, [{ text: it.year + '  ', options: { color: DGOLD, bold: true } }, { text: it.h, options: { color: INK, italic: true } }], { x, y, w, h: 0.36, fontFace: F.head, fontSize: L.fit(`${it.year}  ${it.h}`, w, 0.36, 18, 12, F.head), valign: 'middle' });
          body(s, it.t, x, y + 0.38, w, up ? ly - 0.1 - y - 0.38 : 1.0, { color: SOFT, max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.stats = V.stats.shift(); // the old stats (columns under a big figure) read like the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (type === 'cover' || type === 'closing' ? { x: 0.6, y: 5.33, w: 8.8, h: 0.2, color: C.gray, align: 'center' } : d._light ? { x: 1.0, y: 5.08, w: 7.6, h: 0.3, color: SOFT, align: 'center' } : { x: 1.0, y: 5.08, w: 7.6, h: 0.3, color: C.gray, align: 'center' }));
  return L.save(pres, out, { name: 'SlideAI Luxe', colors: { dk1: C.bg, lt1: C.white, dk2: '1C1B1A', lt2: C.champ, accent1: C.gold, accent2: C.champ, accent3: C.gray, accent4: '8C6F3A', accent5: C.line, accent6: 'D9C08A', hlink: C.gold, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "nafis, premium ohang: kam so'z, salmoqli iboralar", "limits": {"stmt": 60}};
module.exports = { id: 9, slug: 'luxe', name: 'Lyuks', category: 'business', build, style: STYLE };
