/**
 * 06 Swiss — International Typographic Style: strict grid, title column on the left,
 * black rules, one red square, Arial only.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', ink: '111111', red: 'E30613', gray: '6E6E6E', light: 'D9D9D9' };
const F = { head: 'Arial', body: 'Arial' };
const CX = 3.4, CW = 6.0; // content column

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.rect(s, 0.6, 0.5, 0.22, 0.22, C.red, { name: 'Red square' });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 2.45, h: 3.6, fontFace: F.head, bold: true, color: C.ink, fontSize: L.fit(d.title, 2.45, 3.4, 26, 15, F.head, true), lineSpacingMultiple: 0.95 });
    s.slideNumber = { x: 0.6, y: 5.05, w: 0.6, h: 0.25, fontFace: F.head, fontSize: 11, bold: true, color: C.ink, align: 'left' };
    return s;
  };
  const rows = (n, top = 0.9, bottom = 5.0) => (bottom - top) / n;

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.bg };
      t.line(s, 0.6, 0.45, 8.8, 0, C.ink, 1.5, { name: 'Rule' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 0.65, w: 4.6, h: 1.0, fontSize: 14, color: C.gray });
      t.rect(s, 8.0, 0.65, 1.4, 1.4, C.red, { name: 'Red square' });
      const fs = L.fit(d.title, 8.8, 2.9, 66, 36, F.head, true, 0.9);
      t.text(s, d.title, { x: 0.6, y: 2.15, w: 8.8, h: 2.95, fontFace: F.head, bold: true, fontSize: fs, valign: 'bottom', lineSpacingMultiple: 0.9 });
    },
    async agenda(d) {
      const s = page(d), rh = rows(d.items.length);
      d.items.forEach((it, i) => {
        const y = 0.9 + i * rh;
        if (i) t.line(s, CX, y, CW, 0, C.light, 0.75);
        t.text(s, L.pad2(i + 1), { x: CX, y, w: 0.9, h: rh, fontSize: 24, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: CX + 1.0, y, w: CW - 1.0, h: rh, fontSize: 18, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, cols = n === 4 ? 2 : n, rws = Math.ceil(n / cols), gap = 0.3;
      const w = (CW - gap * (cols - 1)) / cols, h = (4.1 - 0.35 * (rws - 1)) / rws;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w, 0.5, 21, 12, F.head, true)));
      d.items.forEach((it, i) => {
        const x = CX + (i % cols) * (w + gap), y = 0.9 + Math.floor(i / cols) * (h + 0.35);
        t.line(s, x, y, w, 0, C.ink, 3, { name: 'Column rule' });
        t.text(s, L.pad2(i + 1), { x, y: y + 0.15, w, h: 0.3, fontSize: 12, bold: true, color: C.red });
        t.text(s, it.h, { x, y: y + 0.5, w, h: 0.5, fontSize: hfs, bold: true });
        t.text(s, it.t, { x, y: y + 1.05, w, h: h - 1.1, fontSize: 16, color: C.gray });
      });
    },
    async process(d) {
      const s = page(d), rh = rows(d.steps.length);
      d.steps.forEach((st, i) => {
        const y = 0.9 + i * rh;
        t.line(s, CX, y, CW, 0, i ? C.light : C.ink, i ? 0.75 : 1);
        t.text(s, String(i + 1), { x: CX, y: y + 0.08, w: 0.9, h: rh - 0.16, fontSize: 40, bold: true, color: i === d.steps.length - 1 ? C.red : C.ink, valign: 'middle' });
        t.text(s, st.h, { x: CX + 1.0, y: y + 0.12, w: 1.95, h: rh - 0.24, fontSize: L.fit(st.h, 1.95, rh - 0.24, 17, 12, F.head, true), bold: true, valign: 'middle' });
        t.text(s, st.t, { x: CX + 3.05, y: y + 0.12, w: CW - 3.05, h: rh - 0.24, fontSize: 14, color: C.gray, valign: 'middle' });
      });
    },
    async stats(d) {
      const s = page(d), top = 0.9, bottom = d.note ? 4.3 : 5.0, rh = (bottom - top) / d.stats.length;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, 2.8, rh - 0.1, 60, 28, F.head, true)));
      d.stats.forEach((x, i) => {
        const y = top + i * rh;
        t.line(s, CX, y, CW, 0, i ? C.light : C.ink, i ? 0.75 : 1);
        t.text(s, x.value, { x: CX, y, w: 2.9, h: rh, fontSize: vfs, bold: true, valign: 'middle', color: i === 0 ? C.red : C.ink });
        t.text(s, x.label, { x: CX + 3.05, y, w: CW - 3.05, h: rh, fontSize: 15, color: C.gray, valign: 'middle' });
      });
      if (d.note) t.text(s, d.note, { x: CX, y: 4.45, w: CW, h: 0.55, fontSize: 14, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = (CW - 0.3) / 2;
      const rws = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 14, w, F.body) : 0))) + 0.24);
      [d.left, d.right].forEach((side, i) => {
        const x = CX + i * (w + 0.3);
        t.text(s, side.h, { x, y: 0.85, w, h: 0.45, fontSize: 18, bold: true, color: i ? C.red : C.ink });
        let y = 1.45;
        side.items.forEach((it, k) => {
          t.line(s, x, y, w, 0, k ? C.light : C.ink, k ? 0.75 : 1);
          t.text(s, it, { x, y: y + 0.12, w, h: rws[k] - 0.12, fontSize: 14 });
          y += rws[k];
        });
      });
    },
    async statement(d) {
      const s = page(d);
      const fs = L.fit(d.text, CW, 2.4, 40, 22, F.head, true), th = L.height(d.text, fs, CW, F.head, true);
      t.text(s, L.runs(d.text), { x: CX, y: 0.9, w: CW, h: th + 0.1, fontSize: fs, bold: true, lineSpacingMultiple: 1 });
      if (d.caption) t.text(s, d.caption, { x: CX, y: 1.25 + th, w: CW - 1.0, h: 1.4, fontSize: 15, color: C.gray });
    },
    async timeline(d) {
      const s = page(d), rh = rows(d.items.length);
      d.items.forEach((it, i) => {
        const y = 0.9 + i * rh;
        t.line(s, CX, y, CW, 0, i ? C.light : C.ink, i ? 0.75 : 1);
        t.text(s, it.year, { x: CX, y, w: 1.2, h: rh, fontSize: L.fit(it.year, 1.15, rh, 22, 13, F.head, true), bold: true, color: C.red, valign: 'middle' });
        t.text(s, it.h, { x: CX + 1.3, y, w: 1.6, h: rh, fontSize: 16, bold: true, valign: 'middle' });
        t.text(s, it.t, { x: CX + 3.05, y, w: CW - 3.05, h: rh, fontSize: 14, color: C.gray, valign: 'middle' });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.red };
      t.rect(s, 0.6, 0.5, 0.22, 0.22, 'FFFFFF', { name: 'Square' });
      const fs = L.fit(d.text, 8.4, 3.0, 40, 22, F.head, true);
      t.text(s, d.text, { x: 0.6, y: 0.95, w: 8.4, h: 3.3, fontSize: fs, bold: true, color: 'FFFFFF', valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 0.6, y: 4.55, w: 8.4, h: 0.4, fontSize: 15, color: 'FFFFFF' });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.ink };
      t.rect(s, 0.6, 0.5, 0.5, 0.5, C.red, { name: 'Red square' });
      const fs = L.fit(d.title, 8.8, 2.6, 60, 32, F.head, true, 0.92);
      t.text(s, d.title, { x: 0.6, y: 1.35, w: 8.8, h: 2.7, fontSize: fs, bold: true, color: 'FFFFFF', valign: 'bottom', lineSpacingMultiple: 0.92 });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 4.3, w: 6.5, h: 0.9, fontSize: 16, color: 'BBBBBB' });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, CX, 0.9, CW, 2.1);
      t.text(s, d.text, { x: CX, y: 3.2, w: CW, h: 1.75, fontSize: L.fit(d.text, CW, 1.75, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2 });
    },
    async image(d) {
      const s = page(d);
      await PH(s, d.image, CX, 0.9, 2.9, 4.05);
      t.rect(s, CX + 3.15, 0.9, 0.25, 0.25, C.red, { name: 'Red square' });
      t.text(s, d.text, { x: CX + 3.15, y: 1.35, w: CW - 3.15, h: 3.6, fontSize: L.fit(d.text, CW - 3.15, 3.6, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2 });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = (4.1) / n;
      d.items.forEach((it, i) => {
        const y = 0.9 + i * rh;
        t.line(s, CX, y, CW, 0, i ? C.light : C.ink, i ? 0.75 : 1);
        t.text(s, L.pad2(i + 1), { x: CX, y, w: 0.6, h: rh, fontSize: 14, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: CX + 0.7, y, w: CW - 0.7, h: rh, fontSize: L.fit(it, CW - 0.7, rh - 0.06, 14, 10, F.body), valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 5.9, 0.65, 3.5, 1.4); t.rect(s, 9.15, 0.4, 0.25, 0.25, C.red, { name: 'Red square' }); },
    closing: async (s, d) => { await PH(s, d.image, 6.4, 0.4, 3.0, 0.8); },
  });
  // ---- further ways to draw a type, on the same strict grid: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 17, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const para = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 9.5, F.body, false, 1.2), color: o.color || C.ink, lineSpacingMultiple: 1.2, valign: o.valign || 'top' });
  // a page whose title runs across the top instead of down the left column
  const across = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.rect(s, 0.6, 0.5, 0.22, 0.22, C.red, { name: 'Red square' });
    t.text(s, d.title, { x: 1.0, y: 0.38, w: 8.4, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.4, 0.7, 28, 16, F.head, true) });
    t.line(s, 0.6, 1.15, 8.8, 0, C.ink, 1.5);
    s.slideNumber = { x: 0.6, y: 5.05, w: 0.6, h: 0.25, fontFace: F.head, fontSize: 11, bold: true, color: C.ink, align: 'left' };
    return s;
  };
  const red = (d) => { d._red = true; const s = pres.addSlide(); s.background = { color: C.red }; s.slideNumber = { x: 0.6, y: 5.05, w: 0.6, h: 0.25, fontFace: F.head, fontSize: 11, bold: true, color: 'FFFFFF', align: 'left' }; return s; };
  const V = {
    image: [
      async (d) => { // the picture bleeds off three edges, title and text keep the left column
        d._red = true;
        const s = pres.addSlide(); s.background = { color: C.bg };
        await PH(s, d.image, 3.4, 0, 6.6, H);
        t.rect(s, 0.6, 0.5, 0.22, 0.22, C.red, { name: 'Red square' });
        head(s, d.title, 0.6, 0.85, 2.5, 1.2, { max: 20 });
        para(s, d.text, 0.6, 2.1, 2.5, 2.9, { max: 12 });
        s.slideNumber = { x: 0.6, y: 5.05, w: 0.6, h: 0.25, fontFace: F.head, fontSize: 11, bold: true, color: C.ink, align: 'left' };
      },
      async (d) => { // title across, a strip of picture, the text at the bottom
        const s = across(d);
        await PH(s, d.image, 0.6, 1.3, 8.8, 1.75);
        para(s, d.text, 3.4, 3.2, 6.0, 1.82, { max: 13 });
        t.rect(s, 0.6, 3.25, 1.2, 0.08, C.red, { name: 'Rule' });
      },
      async (d) => { // red page, the picture in black and white
        const s = red(d);
        await PH(s, d.image, 5.2, 0.5, 4.2, 4.6, { gray: true });
        head(s, d.title, 0.6, 0.5, 4.2, 1.2, { max: 26, color: 'FFFFFF' });
        para(s, d.text, 0.6, 1.8, 4.2, 3.1, { max: 14, color: 'FFFFFF' });
      },
      async (d) => { // title across, a square picture on the grid, the text beside it
        const s = across(d);
        await PH(s, d.image, 6.3, 1.35, 3.1, 3.1);
        t.rect(s, 6.3, 4.55, 3.1, 0.08, C.ink, { name: 'Rule' });
        para(s, d.text, 0.6, 1.35, 5.3, 3.65);
      },
    ],
    cards: [
      async (d) => { // title across, columns hung from a thick rule
        const s = across(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
        d.items.forEach((it, i) => {
          const x = 0.6 + i * (w + gap);
          t.text(s, L.pad2(i + 1), { x, y: 1.3, w, h: 0.8, bold: true, fontSize: 44, color: C.red, valign: 'middle' });
          t.line(s, x, 2.15, w, 0, C.ink, 1.5);
          head(s, it.h, x, 2.25, w, 0.6, { max: 15, valign: 'middle' });
          body(s, it.t, x, 2.9, w, 2.1, { max: 13, color: C.gray });
        });
      },
      async (d) => { // black blocks, white words
        const s = page(d), n = d.items.length, h = (4.1 - 0.1 * (n - 1)) / n;
        d.items.forEach((it, i) => {
          const y = 0.9 + i * (h + 0.1), hot = i === 0;
          t.rect(s, CX, y, CW, h, hot ? C.red : C.ink, { name: 'Block' });
          head(s, it.h, CX + 0.15, y + 0.04, 2.0, h - 0.08, { max: 14, color: 'FFFFFF', valign: 'middle' });
          body(s, it.t, CX + 2.25, y + 0.05, CW - 2.4, h - 0.1, { color: 'FFFFFF', valign: 'middle', max: 12.5 });
        });
      },
      async (d) => { // the columns stepping down the grid
        const s = across(d), n = d.items.length, w = 8.8 / n;
        d.items.forEach((it, i) => {
          const x = 0.6 + i * w, y = 1.35 + i * (n === 4 ? 0.28 : 0.4), hh = 5.02 - y;
          t.rect(s, x, y, w - 0.16, 0.08, i % 2 ? C.ink : C.red, { name: 'Rule' });
          head(s, it.h, x, y + 0.14, w - 0.16, 0.55, { max: 14, valign: 'middle' });
          body(s, it.t, x, y + 0.72, w - 0.16, hh - 0.75, { max: 12 });
        });
      },
      async (d) => { // title down the left, icons as big as the text, two by two across the grid
        const s = page(d), n = d.items.length, w = 2.85, h = 2.0;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, x = CX + (i % 2) * (w + 0.3), y = 0.9 + Math.floor(i / 2) * (h + 0.1), ww = wide ? CW : w;
          t.img(s, await L.icon(it.icon, C.red, 2), x, y, 0.5, 0.5);
          head(s, it.h, x + 0.62, y, ww - 0.62, 0.5, { max: 14, valign: 'middle' });
          body(s, it.t, x, y + 0.58, ww, h - 0.65, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // title across, columns with arrows set in type
        const s = across(d), n = d.steps.length, cw = 8.8 / n;
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw;
          t.text(s, i < n - 1 ? '→' : '■', { x, y: 1.3, w: cw - 0.2, h: 0.75, bold: true, fontSize: i < n - 1 ? 40 : 22, color: C.red, valign: 'middle' });
          head(s, `${i + 1} ${st.h}`, x, 2.1, cw - 0.2, 0.7, { max: 15, valign: 'middle' });
          body(s, st.t, x, 2.85, cw - 0.2, 2.15, { max: 13 });
        });
      },
      async (d) => { // a staircase of black rules
        const s = across(d), n = d.steps.length, h = 3.75 / n, sh = n === 4 ? 0.9 : 1.2;
        d.steps.forEach((st, i) => {
          const y = 1.28 + i * h, x = 0.6 + i * sh, w = 8.8 - i * sh;
          t.line(s, x, y, w, 0, C.ink, 1.5);
          t.text(s, String(i + 1), { x, y: y + 0.03, w: 0.5, h: 0.5, bold: true, fontSize: 24, color: C.red });
          head(s, st.h, x + 0.5, y + 0.05, w - 0.5, 0.32, { max: 14, valign: 'middle' });
          body(s, st.t, x + 0.5, y + 0.38, w - 0.5, h - 0.44, { max: 12.5 });
        });
      },
      async (d) => { // red page, numbers very large
        const s = red(d), n = d.steps.length, cw = 8.8 / n;
        head(s, d.title, 0.6, 0.45, 8.8, 0.75, { color: 'FFFFFF', max: 26, valign: 'middle' });
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw;
          t.text(s, String(i + 1), { x, y: 1.2, w: cw - 0.2, h: 1.2, bold: true, fontSize: 72, color: 'FFFFFF', valign: 'middle' });
          head(s, st.h, x, 2.45, cw - 0.2, 0.55, { color: 'FFFFFF', max: 15, valign: 'middle' });
          body(s, st.t, x, 3.02, cw - 0.2, 1.98, { color: 'FFFFFF', max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // title across, figures as columns
        const s = across(d), cw = 8.8 / d.stats.length;
        d.stats.forEach((v, i) => {
          const x = 0.6 + i * cw;
          t.text(s, v.value, { x, y: 1.4, w: cw - 0.2, h: 1.3, bold: true, color: i ? C.ink : C.red, valign: 'middle', fontSize: L.fit(v.value, cw - 0.3, 1.2, 60, 22, F.head, true) });
          t.line(s, x, 2.78, cw - 0.2, 0, C.ink, 1.5);
          body(s, v.label, x, 2.88, cw - 0.2, 0.95, { max: 14 });
        });
        if (d.note) body(s, d.note, 0.6, 3.95, 8.8, 1.05, { color: C.gray, max: 11.5 });
      },
      async (d) => { // red page: the first figure fills it, the others in the column beside
        const s = red(d), [a, ...rest] = d.stats;
        head(s, d.title, 0.6, 0.45, 8.8, 0.7, { color: 'FFFFFF', max: 24, valign: 'middle' });
        t.text(s, a.value, { x: 0.6, y: 1.25, w: 5.5, h: 2.1, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(a.value, 5.4, 2.0, 96, 30, F.head, true) });
        body(s, a.label, 0.6, 3.4, 5.3, 1.2, { color: 'FFFFFF', max: 18 });
        rest.forEach((v, i) => { const y = 1.3 + i * 1.08; head(s, v.value, 6.5, y, 2.9, 0.55, { color: 'FFFFFF', max: 26, valign: 'middle' }); body(s, v.label, 6.5, y + 0.55, 2.9, 0.48, { color: 'FFFFFF', max: 11 }); });
        if (d.note) body(s, d.note, 6.5, 3.5, 2.9, 1.5, { color: 'FFFFFF', max: 10.5 });
      },
    ],
    compare: [
      async (d) => { // title across, one block black, the other white under a rule
        const s = across(d), w = 4.4;
        [d.left, d.right].forEach((side, i) => {
          const x = 0.6 + i * w, n = side.items.length, rh = 2.95 / n, hot = i === 0, ink = hot ? 'FFFFFF' : C.ink;
          if (hot) t.rect(s, x, 1.3, w, 3.7, C.ink, { name: 'Black block' });
          head(s, side.h, x + 0.2, 1.38, w - 0.4, 0.55, { color: hot ? 'FFFFFF' : C.red, max: 19, valign: 'middle' });
          side.items.forEach((it, k) => body(s, it, x + 0.2, 2.0 + k * rh, w - 0.4, rh - 0.05, { color: ink }));
        });
      },
      async (d) => { // title down the left, two lists one over the other
        const s = page(d), h = 1.98;
        [d.left, d.right].forEach((side, i) => {
          const y = 0.9 + i * (h + 0.1);
          t.line(s, CX, y, CW, 0, C.ink, 1.5);
          head(s, side.h, CX, y + 0.08, 1.75, h - 0.15, { max: 16, color: i ? C.red : C.ink });
          side.items.forEach((it, k) => body(s, it, CX + 1.9, y + 0.08 + k * ((h - 0.15) / side.items.length), CW - 1.9, (h - 0.15) / side.items.length - 0.03, { max: 12.5 }));
        });
      },
    ],
    statement: [
      async (d) => { // red page, white words as large as they will go
        const s = red(d);
        head(s, d.title, 0.6, 0.45, 8.8, 0.45, { color: 'FFFFFF', max: 14, valign: 'middle' });
        t.text(s, L.runs(d.text), { x: 0.6, y: 0.95, w: 8.8, h: 2.9, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.8, 50, 20, F.head, true) });
        if (d.caption) body(s, d.caption, 3.4, 3.9, 6.0, 1.15, { color: 'FFFFFF', max: 13 });
      },
      async (d) => { // title across; the note first in the narrow column, the thought in the wide one
        const s = across(d);
        if (d.caption) body(s, d.caption, 0.6, 1.4, 2.45, 3.6, { color: C.gray, max: 13 });
        t.text(s, L.runs(d.text), { x: 3.4, y: 1.3, w: 6.0, h: 3.7, bold: true, color: C.ink, valign: 'bottom', fontSize: L.fit(d.text, 6.0, 3.6, 40, 18, F.head, true) });
      },
    ],
    timeline: [
      async (d) => { // title across, years hanging from one rule
        const s = across(d), n = d.items.length, cw = 8.8 / n;
        d.items.forEach((it, i) => {
          const x = 0.6 + i * cw;
          t.rect(s, x, 1.28, 0.16, 0.16, C.red, { name: 'Red square' });
          head(s, it.year, x, 1.5, cw - 0.2, 0.7, { max: 26, valign: 'middle' });
          head(s, it.h, x, 2.22, cw - 0.2, 0.5, { max: 14, color: C.red, valign: 'middle' });
          body(s, it.t, x, 2.75, cw - 0.2, 2.25, { max: 13 });
        });
      },
      async (d) => { // title down the left, four cells on the grid, the year large in each
        const s = page(d), w = 2.85, h = 2.0;
        d.items.forEach((it, i) => {
          const x = CX + (i % 2) * (w + 0.3), y = 0.9 + Math.floor(i / 2) * (h + 0.1);
          t.line(s, x, y, w, 0, C.ink, 1.5);
          head(s, it.year, x, y + 0.05, w, 0.6, { max: 26, color: C.red, valign: 'middle' });
          head(s, it.h, x, y + 0.65, w, 0.32, { max: 13, valign: 'middle' });
          body(s, it.t, x, y + 0.98, w, h - 1.02, { max: 12 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (d._red ? { x: 1.3, y: 5.15, w: 8.1, h: 0.25, color: 'FFFFFF' } : type === 'cover' || type === 'closing' ? { x: 0.6, y: 5.3, w: 8.8, h: 0.2, color: type === 'closing' ? 'BBBBBB' : C.gray } : type === 'quote' ? { x: 0.6, y: 5.15, w: 8.8, h: 0.25, color: 'FFFFFF' } : { x: CX, y: 5.15, w: CW, h: 0.25, color: C.gray }));
  return L.save(pres, out, { name: 'SlideAI Swiss', colors: { dk1: C.ink, lt1: C.bg, dk2: '333333', lt2: 'F2F2F2', accent1: C.red, accent2: C.ink, accent3: C.gray, accent4: '9B0A12', accent5: 'B3B3B3', accent6: C.light, hlink: C.red, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "minimal: imkon qadar qisqa, bitta so'z ham ortiqcha bo'lmasin", "limits": {"card_t3": 70, "card_t4": 60, "stmt": 60}};
module.exports = { id: 6, slug: 'swiss', name: 'Şveytsar', category: 'minimalist', build, style: STYLE };
