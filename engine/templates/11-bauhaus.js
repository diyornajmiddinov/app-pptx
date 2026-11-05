/**
 * 11 Bauhaus — primary red, yellow and blue geometry (circle, square, triangle) on paper,
 * heavy Arial, every list marker is a different basic shape.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F1ECE2', ink: '1A1A1A', red: 'D7263D', yellow: 'F4B400', blue: '1B4F9C', white: 'FFFFFF', muted: '4A4A4A' };
const F = { head: 'Arial', body: 'Arial' };
const FILL = [C.red, C.blue, C.yellow, C.ink];
const fg = (c) => (c === C.yellow ? C.ink : C.white);

const composition = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="563" viewBox="0 0 500 563">
  <rect x="40" y="250" width="250" height="313" fill="#${C.blue}"/>
  <circle cx="330" cy="200" r="150" fill="#${C.red}"/>
  <path d="M120,563 A170,170 0 0 1 460,563 Z" fill="#${C.yellow}"/>
  <line x1="0" y1="90" x2="500" y2="420" stroke="#${C.ink}" stroke-width="6"/>
  <circle cx="110" cy="130" r="38" fill="#${C.ink}"/>
  <rect x="380" y="400" width="60" height="60" fill="none" stroke="#${C.ink}" stroke-width="6"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const comp = await L.svg(composition, 1000, 1126);

  const mark = (s, kind, x, y, d, color) => {
    if (kind === 0) t.oval(s, x, y, d, d, color);
    else if (kind === 1) t.rect(s, x, y, d, d, color, { name: 'Square' });
    else t.shape(s, 'ISOSCELES_TRIANGLE', { x, y, w: d, h: d, fill: { color }, objectName: 'Triangle' });
  };
  const trio = (s, x, y, d) => { mark(s, 0, x, y, d, C.red); mark(s, 1, x + d + 0.1, y, d, C.blue); mark(s, 2, x + 2 * (d + 0.1), y, d, C.yellow); };
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    trio(s, 0.6, 0.62, 0.22);
    t.text(s, d.title, { x: 1.65, y: 0.38, w: 7.75, h: 0.75, fontFace: F.head, bold: true, valign: 'middle', fontSize: L.fit(d.title, 7.75, 0.75, 28, 18, F.head, true) });
    s.slideNumber = { x: 8.9, y: 5.1, w: 0.5, h: 0.3, fontFace: F.head, fontSize: 12, bold: true, color: C.ink, align: 'right' };
    return s;
  };
  const markerNum = (s, i, x, y, d) => {
    const kind = i % 3, col = [C.red, C.blue, C.yellow][kind];
    mark(s, kind, x, y, d, col);
    t.text(s, String(i + 1), { x, y: y + (kind === 2 ? d * 0.18 : 0), w: d, h: d, fontSize: Math.round(d * 30), bold: true, color: fg(col), align: 'center', valign: 'middle' });
  };
  const hero = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.img(s, comp, 5.0, 0, 5.0, H);
    trio(s, 0.6, 0.7, 0.26);
    const fs = L.fit(d.title, 4.2, 2.6, 46, 26, F.head, true, 0.95);
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 4.2, h: 2.75, fontFace: F.head, bold: true, fontSize: fs, valign: 'bottom', lineSpacingMultiple: 0.95 });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.9, w: 4.0, h: 1.2, fontSize: 15, color: C.muted });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.5 + (i % per) * rh;
        markerNum(s, i, x, y, 0.62);
        t.text(s, it, { x: x + 0.9, y, w: 3.4, h: 0.62, fontSize: 18, bold: true, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.5, 0.45, 19, 13, F.head, true)));
      const h = Math.min(3.55, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), col = FILL[i % 4];
        t.rect(s, x, 1.45, w, h, col, { name: 'Block' });
        t.img(s, await L.icon(it.icon, fg(col), 2.25), x + 0.25, 1.7, 0.42, 0.42);
        t.text(s, it.h, { x: x + 0.25, y: 2.35, w: w - 0.5, h: 0.45, fontSize: hfs, bold: true, color: fg(col) });
        t.text(s, it.t, { x: x + 0.25, y: 2.85, w: w - 0.5, h: h - 1.55, fontSize: 14, color: fg(col) });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n, ly = 2.1, m = 0.72;
      t.rect(s, 0.6, ly - 0.04, 8.8, 0.08, C.ink, { name: 'Bar' });
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.45, 19, 13, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        markerNum(s, i, x, ly - m / 2, m);
        t.text(s, st.h, { x, y: 2.75, w: cw - 0.3, h: 0.45, fontSize: hfs, bold: true });
        t.text(s, st.t, { x, y: 3.25, w: cw - 0.3, h: 1.7, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n, dd = 1.75, kinds = [0, 1, 0], cols = [C.red, C.blue, C.yellow];
      d.stats.forEach((x, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        mark(s, kinds[i % 3], cx - dd / 2, 1.45, dd, cols[i % 3]);
        t.text(s, x.value, { x: cx - dd / 2 + 0.1, y: 1.45, w: dd - 0.2, h: dd, fontSize: L.fit(x.value, dd - 0.3, 0.9, 40, 18, F.head, true), bold: true, color: fg(cols[i % 3]), align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 3.4, w: cw - 0.4, h: 0.9, fontSize: 15, bold: true, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.45, w: 8.8, h: 0.5, fontSize: 14, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.25, h = 3.5, y = 1.45;
      const nr = Math.max(d.left.items.length, d.right.items.length), { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.95, F.body, 0, h - 1.0 - 0.12 - 0.2 * (nr - 1));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), col = i ? C.ink : C.white;
        if (i) t.rect(s, x, y, w, h, C.bg, { line: { color: C.ink, width: 3 }, name: 'Panel' });
        else t.rect(s, x, y, w, h, C.blue, { name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.5, fontSize: 21, bold: true, color: col });
        let yy = y + 1.0;
        side.items.forEach((it, k) => {
          mark(s, k % 3, x + 0.35, yy + 0.06, 0.15, i ? [C.red, C.blue, C.yellow][k % 3] : C.yellow);
          t.text(s, it, { x: x + 0.65, y: yy, w: w - 0.95, h: rows[k] + 0.05, fontSize: CFS, color: col });
          yy += rows[k] + 0.2;
        });
      });
    },
    async statement(d) {
      const s = page(d);
      t.oval(s, -1.0, 1.6, 3.4, 3.4, C.red);
      t.rect(s, 1.95, 1.45, 0.45, 0.45, C.yellow, { name: 'Square' });
      const fs = L.fit(d.text, 6.6, 1.7, 38, 22, F.head, true);
      t.text(s, L.runs(d.text), { x: 2.85, y: 1.5, w: 6.6, h: 1.9, fontSize: fs, bold: true, valign: 'bottom' });
      t.rect(s, 2.85, 3.6, 1.0, 0.08, C.blue, { name: 'Bar' });
      if (d.caption) t.text(s, d.caption, { x: 2.85, y: 3.85, w: 6.3, h: 1.1, fontSize: 15, color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.45;
      t.rect(s, 0.6, ly - 0.05, 8.8, 0.1, C.ink, { name: 'Bar' });
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw, col = [C.red, C.blue, C.yellow, C.red][i % 4];
        t.text(s, it.year, { x, y: 1.45, w: cw - 0.2, h: 0.7, fontSize: L.fit(it.year, cw - 0.3, 0.65, 30, 16, F.head, true), bold: true, valign: 'bottom' });
        mark(s, i % 3, x, ly - 0.22, 0.44, col);
        t.text(s, it.h, { x, y: 2.9, w: cw - 0.3, h: 0.42, fontSize: 17, bold: true });
        t.text(s, it.t, { x, y: 3.35, w: cw - 0.3, h: 1.6, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.yellow };
      t.oval(s, 7.4, -1.0, 3.2, 3.2, C.blue);
      t.rect(s, 0.6, 0.7, 0.45, 0.45, C.red, { name: 'Square' });
      const fs = L.fit(d.text, 7.6, 2.6, 38, 22, F.head, true);
      t.text(s, d.text, { x: 0.6, y: 1.4, w: 7.6, h: 2.7, fontSize: fs, bold: true, valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 0.6, y: 4.35, w: 7.6, h: 0.4, fontSize: 16, bold: true });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, 0.6, 1.5, 3.7, 3.45);
      t.oval(s, 3.75, 1.2, 0.8, 0.8, C.red);
      t.text(s, d.text, { x: 4.75, y: 1.5, w: 4.65, h: 3.45, fontSize: L.fit(d.text, 4.65, 3.45, 16, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.55, 0.45, 0.45, C.blue, { name: 'Square' });
      t.text(s, d.text, { x: 0.6, y: 2.2, w: 4.6, h: 2.75, fontSize: L.fit(d.text, 4.6, 2.75, 16, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25 });
      t.oval(s, 5.75, 1.35, 3.7, 3.7, C.yellow);
      await PH(s, d.image, 5.9, 1.5, 3.4, 3.4, { mask: 'circle' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        markerNum(s, i, 0.6, y + (rh - 0.42) / 2, 0.42);
        t.text(s, it, { x: 1.25, y, w: 8.15, h: rh, fontSize: L.fit(it, 8.15, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { t.oval(s, 6.7, 0.4, 3.2, 3.2, C.ink); await PH(s, d.image, 6.8, 0.5, 3.0, 3.0, { mask: 'circle' }); },
    closing: async (s, d) => { t.oval(s, 6.7, 0.4, 3.2, 3.2, C.ink); await PH(s, d.image, 6.8, 0.5, 3.0, 3.0, { mask: 'circle' }); },
  });
  // ---- further ways to draw a type, in this template's Bauhaus world (circle, square, triangle, colour fields, thick bars): a deck's pages must not look alike (L.pages)
  const Y0 = 1.42, Y1 = 5.0, X0 = 0.6, CW = 8.8, TRI = [[0.5, 0], [1, 1], [0, 1]];
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, bold: true, fontSize: L.fit(txt, w, h, o.max || 16, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const field = (d, color) => { // the whole page a single colour field
    const ink = fg(color); d._ink = ink;
    const s = pres.addSlide(); s.background = { color };
    const others = [C.red, C.blue, C.yellow].map((c) => (c === color ? (color === C.yellow ? C.ink : C.white) : c));
    others.forEach((c, k) => mark(s, k, 0.6 + k * 0.32, 0.62, 0.22, c));
    t.text(s, d.title, { x: 1.65, y: 0.38, w: 7.75, h: 0.75, fontFace: F.head, bold: true, color: ink, valign: 'middle', fontSize: L.fit(d.title, 7.75, 0.75, 28, 18, F.head, true) });
    s.slideNumber = { x: 8.9, y: 5.1, w: 0.5, h: 0.3, fontFace: F.head, fontSize: 12, bold: true, color: ink, align: 'right' };
    return s;
  };
  const shapeIcon = async (s, kind, x, y, dd, col, ic) => { mark(s, kind, x, y, dd, col); const k = dd * 0.42; t.img(s, await L.icon(ic, fg(col), 2.5), x + (dd - k) / 2, y + (dd - k) / 2 + (kind === 2 ? dd * 0.14 : 0), k, k); };
  const V = {
    image: [
      async (d) => { // the picture cut as a triangle, a yellow one standing behind it
        const s = page(d), w = 4.5, h = 3.7, x = 4.9, y = 1.3;
        t.shape(s, 'ISOSCELES_TRIANGLE', { x: x + 0.25, y: y - 0.0, w, h: h, fill: { color: C.yellow }, objectName: 'Triangle' });
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: TRI } }), x, y, w, h, { alt: '' });
        t.rect(s, X0, 1.5, 0.4, 0.4, C.red, { name: 'Square' });
        t.text(s, d.text, { x: X0, y: 2.05, w: 4.35, h: Y1 - 2.05, fontSize: L.fit(d.text, 4.35, Y1 - 2.05, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15 });
      },
      async (d) => { // a blue field: the picture takes the left half, a yellow disc rides the seam
        const s = field(d, C.blue);
        await PH(s, d.image, 0, 1.25, 4.6, H - 1.25);
        t.oval(s, 4.15, 1.02, 0.9, 0.9, C.yellow);
        t.text(s, d.text, { x: 5.0, y: 2.05, w: 4.4, h: 2.95, fontSize: L.fit(d.text, 4.4, 2.95, 14, 10, F.body, false, 1.15), color: C.white, lineSpacingMultiple: 1.15 });
        t.rect(s, 0, 5.12, 8.75, 0.34, C.blue, { name: 'Footer band' });
      },
      async (d) => { // a band of picture over a thick bar, a red half-disc rising from it
        const s = page(d), ph = 1.72;
        await PH(s, d.image, X0, 1.3, CW, ph);
        t.rect(s, X0, 1.3 + ph, CW, 0.09, C.ink, { name: 'Bar' });
        t.shape(s, 'FLOWCHART_DELAY', { x: 8.2, y: 1.3 + ph - 0.55, w: 0.55, h: 1.1, fill: { color: C.red }, rotate: 270, objectName: 'Half disc' });
        t.text(s, d.text, { x: X0, y: 3.24, w: CW, h: Y1 - 3.24, fontSize: L.fit(d.text, CW, Y1 - 3.24, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1 });
      },
      async (d) => { // a quarter circle of picture in the corner of the column, a black square against it
        const s = page(d), x = 5.3, y = 1.2, w = 4.1, h = 3.8;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { path: 'M1,1 L0,1 C0,0.45 0.45,0 1,0 Z' } }), x, y, w, h, { alt: '' });
        t.rect(s, x - 0.02, y + h - 0.62, 0.62, 0.62, C.ink, { name: 'Square' });
        t.oval(s, 8.65, 1.25, 0.72, 0.72, C.blue);
        t.text(s, d.text, { x: X0, y: Y0, w: 4.5, h: Y1 - Y0, fontSize: L.fit(d.text, 4.5, Y1 - Y0, 14, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // rows under thick bars, a different shape to each row
        const s = page(d), n = d.items.length, h = (Y1 - Y0) / n, dd = Math.min(0.72, h - 0.2);
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + i * h, col = [C.red, C.blue, C.yellow, C.ink][i];
          t.rect(s, X0, y, CW, 0.05, C.ink, { name: 'Bar' });
          await shapeIcon(s, i % 3, X0 + 0.04, y + (h - dd) / 2 + 0.02, dd, col, it.icon);
          head(s, it.h, X0 + 1.0, y + 0.08, 2.55, h - 0.12, { max: 17 });
          body(s, it.t, X0 + 3.7, y + 0.08, CW - 3.7, h - 0.12, { color: C.ink, valign: 'middle', max: 14 });
        }
      },
      async (d) => { // a Mondrian of colour fields, two by two, a black line between them
        const s = page(d), n = d.items.length, gap = 0.08, w = (CW - gap) / 2, h = (Y1 - Y0 - gap) / 2, fills = [C.blue, C.yellow, C.red, C.white];
        t.rect(s, X0, Y0, CW, Y1 - Y0, C.ink, { name: 'Lead' });
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, x = X0 + (i % 2) * (w + gap), y = Y0 + Math.floor(i / 2) * (h + gap), ww = wide ? CW : w, col = fills[i], ink = fg(col) === C.white && col === C.white ? C.ink : fg(col);
          t.rect(s, x, y, ww, h, col, { name: 'Colour field' });
          t.img(s, await L.icon(it.icon, col === C.white ? C.ink : ink, 2.5), x + 0.18, y + 0.16, 0.34, 0.34);
          head(s, it.h, x + 0.62, y + 0.13, ww - 0.8, 0.4, { color: col === C.white ? C.ink : ink, max: 16 });
          body(s, it.t, x + 0.18, y + 0.58, ww - 0.36, h - 0.66, { color: col === C.white ? C.ink : ink, max: 13 });
        }
      },
      async (d) => { // a blue field: paper columns at two heights, each crowned by its shape
        const s = field(d, C.blue), n = d.items.length, gap = 0.16, w = (CW - gap * (n - 1)) / n, dd = 0.62;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + gap), y = i % 2 ? 2.0 : 1.72, h = 4.98 - y, col = [C.red, C.yellow, C.white, C.yellow][i], kind = i % 3;
          t.rect(s, x, y, w, h, C.bg, { name: 'Paper' });
          mark(s, kind, x + 0.14, y - 0.31, dd, col);
          t.img(s, await L.icon(it.icon, col === C.white ? C.blue : fg(col), 2.5), x + 0.14 + dd * 0.28, y - 0.31 + dd * (kind === 2 ? 0.38 : 0.28), dd * 0.44, dd * 0.44);
          head(s, it.h, x + 0.14, y + 0.38, w - 0.28, 0.55, { max: 15, valign: 'top' });
          body(s, it.t, x + 0.14, y + 0.94, w - 0.28, h - 1.0, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // a thick cross and a red disc at its centre, the items in its quarters
        const s = page(d), n = d.items.length, cx = W / 2, cy = (Y0 + Y1) / 2, md = 1.15, w = 3.55;
        t.rect(s, X0, cy - 0.04, CW, 0.08, C.ink, { name: 'Bar' }); t.rect(s, cx - 0.04, Y0, 0.08, Y1 - Y0, C.ink, { name: 'Bar' });
        t.oval(s, cx - md / 2, cy - md / 2, md, md, C.red);
        t.rect(s, cx - 0.17, cy - 0.17, 0.34, 0.34, C.yellow, { name: 'Square' });
        const spots = n === 4 ? [[X0, Y0], [W - X0 - w, Y0], [X0, cy + 0.14], [W - X0 - w, cy + 0.14]] : [[X0, Y0], [W - X0 - w, Y0], [X0, cy + 0.14]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right', k = i % 3, col = [C.red, C.blue, C.yellow, C.blue][i];
          const ix = right ? x + 0.25 : x + w - 0.71;
          mark(s, k, ix, y + 0.02, 0.4, col);
          head(s, it.h, right ? x + 0.72 : x, y + 0.02, w - 0.82, 0.4, { align: a });
          body(s, it.t, right ? x + 0.25 : x, y + 0.46, w - 0.25, cy - Y0 - 0.56, { align: a, color: C.ink, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a staircase of solid colour, one block higher than the last
        const s = page(d), n = d.steps.length, w = CW / n, rise = n === 4 ? 0.26 : 0.36, top = 1.4 + rise * (n - 1);
        const fills = [C.yellow, C.red, C.blue, C.ink];
        d.steps.forEach((st, i) => {
          const x = X0 + i * w, y = top - i * rise, col = fills[n === 3 ? i + 1 : i], ink = fg(col);
          t.rect(s, x, y, w, Y1 - y, col, { name: 'Stair' });
          t.text(s, String(i + 1), { x: x + 0.15, y: y + 0.06, w: 0.8, h: 0.6, bold: true, fontSize: 32, color: ink, valign: 'middle' });
          head(s, st.h, x + 0.15, y + 0.66, w - 0.3, 0.55, { color: ink, max: 15, valign: 'top' });
          body(s, st.t, x + 0.15, y + 1.22, w - 0.3, Y1 - y - 1.28, { color: ink, max: 13 });
        });
      },
      async (d) => { // one thick spine down the page, steps to either side, shapes on it
        const s = page(d), n = d.steps.length, cx = W / 2, w = 3.75, rh = (Y1 - Y0) / n, dd = 0.6;
        t.rect(s, cx - 0.05, Y0, 0.1, Y1 - Y0, C.ink, { name: 'Spine' });
        d.steps.forEach((st, i) => {
          const right = i % 2 === 1, y = Y0 + i * rh, x = right ? cx + 0.5 : cx - 0.5 - w, a = right ? 'left' : 'right', hh = Math.min(rh * 2 - 0.62, 1.28, Y1 + 0.1 - (Y0 + (n - 1) * rh + 0.44));
          markerNum(s, i, cx - dd / 2, y + 0.02, dd);
          head(s, st.h, x, y, w, 0.42, { align: a, max: 18 });
          body(s, st.t, x, y + 0.44, w, hh, { align: a, color: C.ink, max: 14 });
        });
      },
      async (d) => { // a yellow field: a wall of offset bricks, top row and bottom row in turn, thick links between
        const s = field(d, C.yellow), n = d.steps.length, w = n === 4 ? 3.4 : 4.0, step = (CW - w) / (n - 1), h = 1.56, gap = 0.34, y2 = Y0 + h + gap;
        d.steps.forEach((st, i) => {
          const x = X0 + i * step, y = i % 2 ? y2 : Y0, kind = i % 3, col = [C.red, C.blue, C.ink][kind];
          if (i < n - 1) t.rect(s, x + step + (w - step) / 2 - 0.05, Y0 + h, 0.1, gap, C.ink, { name: 'Link' });
          t.rect(s, x, y, w, h, C.white, { line: { color: C.ink, width: 3 }, name: 'Brick' });
          mark(s, kind, x + 0.14, y + 0.12, 0.42, col);
          t.text(s, String(i + 1), { x: x + 0.14, y: y + 0.12 + (kind === 2 ? 0.08 : 0), w: 0.42, h: 0.42, bold: true, fontSize: 13, color: C.white, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.68, y + 0.12, w - 0.82, 0.42, { max: 15 });
          body(s, st.t, x + 0.16, y + 0.58, w - 0.32, h - 0.63, { color: C.ink, max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // the leading figure in a great red disc, the others in a square and on a bar
        const s = page(d), [a, b, c] = d.stats, dd = d.note ? 2.85 : 3.45;
        t.oval(s, X0, Y0, dd, dd, C.red);
        t.text(s, a.value, { x: X0 + 0.3, y: Y0 + dd * 0.18, w: dd - 0.6, h: dd * 0.36, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(a.value, dd - 0.65, dd * 0.34, 56, 24, F.head, true) });
        body(s, a.label, X0 + 0.5, Y0 + dd * 0.56, dd - 1.0, dd * 0.28, { color: C.white, align: 'center', max: 13 });
        const rx = X0 + dd + 0.35, rw = 9.4 - rx, rh = (dd - 0.14) / 2;
        t.rect(s, rx, Y0, rh, rh, C.blue, { name: 'Square' });
        t.text(s, b.value, { x: rx + 0.06, y: Y0, w: rh - 0.12, h: rh, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(b.value, rh - 0.16, rh * 0.5, 34, 13, F.head, true) });
        body(s, b.label, rx + rh + 0.2, Y0 + 0.05, rw - rh - 0.2, rh - 0.1, { color: C.ink, valign: 'middle', max: 15 });
        const y2 = Y0 + rh + 0.14;
        t.rect(s, rx, y2, rh, rh, C.yellow, { name: 'Square' });
        t.text(s, c.value, { x: rx + 0.06, y: y2, w: rh - 0.12, h: rh, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(c.value, rh - 0.16, rh * 0.5, 34, 13, F.head, true) });
        body(s, c.label, rx + rh + 0.2, y2 + 0.05, rw - rh - 0.2, rh - 0.1, { color: C.ink, valign: 'middle', max: 15 });
        if (d.note) body(s, d.note, X0, Y0 + dd + 0.06, CW - 0.4, Y1 + 0.08 - Y0 - dd - 0.06, { max: 12 });
      },
      async (d) => { // a blue field: heavy figures on white bars, a shape to each
        const s = field(d, C.blue), rh = d.note ? 0.92 : 1.18;
        d.stats.forEach((x, i) => {
          const y = Y0 + i * rh;
          t.rect(s, X0, y, CW, 0.05, C.white, { name: 'Bar' });
          mark(s, i, X0, y + (rh - 0.42) / 2 + 0.02, 0.42, [C.red, C.white, C.yellow][i]);
          t.text(s, x.value, { x: X0 + 0.65, y: y + 0.07, w: 3.5, h: rh - 0.1, bold: true, color: C.yellow, valign: 'middle', fontSize: L.fit(x.value, 3.45, rh - 0.14, 46, 22, F.head, true) });
          body(s, x.label, X0 + 4.3, y + 0.08, CW - 4.3, rh - 0.12, { color: C.white, valign: 'middle', max: 16 });
        });
        if (d.note) { t.rect(s, X0, Y0 + 3 * rh, CW, 0.05, C.white, { name: 'Bar' }); body(s, d.note, X0, Y0 + 3 * rh + 0.1, CW - 0.4, Y1 + 0.08 - Y0 - 3 * rh - 0.1, { color: C.white, max: 12 }); }
      },
    ],
    compare: [
      async (d) => { // two fields meet at the page's middle, a disc split between them
        const s = page(d), y0 = 1.32, h = Y1 - y0 + 0.02, w = 4.0, cx = W / 2;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.1, F.body, 0.18, h - 0.85);
        t.rect(s, 0, y0, cx, h, C.blue, { name: 'Colour field' }); t.rect(s, cx, y0, cx, h, C.yellow, { name: 'Colour field' });
        head(s, d.left.h, 0.5, y0 + 0.12, w - 0.1, 0.55, { color: C.white, align: 'right', max: 22 });
        head(s, d.right.h, cx + 0.5, y0 + 0.12, w - 0.1, 0.55, { max: 22 });
        const avail = h - 0.85; let y = y0 + 0.78;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.5, y, w: w - 0.1, h: rows[k], fontSize: fs, color: C.white, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: cx + 0.5, y, w: w - 0.1, h: rows[k], fontSize: fs, color: C.ink });
          y += Math.max(rows[k], Math.min(0.7, avail / rows.length));
        }
        t.oval(s, cx - 0.3, y0 + h / 2 - 0.3, 0.6, 0.6, C.red, { line: { color: C.ink, width: 3 }, name: 'Disc' });
      },
      async (d) => { // two stacked bands, a circle for the one, a square for the other
        const s = page(d), h = (Y1 - Y0 - 0.16) / 2;
        [d.left, d.right].forEach((side, i) => {
          const y = Y0 + i * (h + 0.16), dark = i === 1, ink = dark ? C.white : C.ink;
          t.rect(s, X0, y, CW, h, dark ? C.ink : C.bg, { line: { color: C.ink, width: 3 }, name: 'Band' });
          mark(s, i, X0 + 0.16, y + (h - 0.5) / 2, 0.5, dark ? C.yellow : C.red);
          head(s, side.h, X0 + 0.8, y + 0.1, 2.1, h - 0.2, { color: ink, max: 17 });
          const n = side.items.length, rh = (h - 0.14) / n;
          t.rect(s, X0 + 3.0, y + 0.14, 0.05, h - 0.28, ink, { name: 'Bar' });
          side.items.forEach((it, k) => { body(s, it, X0 + 3.2, y + 0.07 + k * rh, CW - 3.35, rh - 0.02, { color: ink, valign: 'middle', max: 13 }); });
        });
      },
    ],
    statement: [
      async (d) => { // a red field, a black triangle rising, the thought in white
        const s = field(d, C.red);
        t.shape(s, 'ISOSCELES_TRIANGLE', { x: 6.75, y: 2.75, w: 3.25, h: H - 2.75, fill: { color: C.ink }, objectName: 'Triangle' });
        t.oval(s, 8.2, 1.65, 0.8, 0.8, C.yellow);
        const hh = d.caption ? 2.1 : 3.5;
        t.text(s, L.runs(d.text), { x: X0, y: Y0, w: 6.6, h: hh, bold: true, color: C.white, valign: 'top', fontSize: L.fit(d.text, 6.6, hh - 0.05, 38, 20, F.head, true) });
        if (d.caption) t.text(s, d.caption, { x: X0, y: Y0 + hh + 0.08, w: 6.2, h: Y1 - Y0 - hh - 0.08, fontSize: L.fit(d.caption, 6.2, Y1 - Y0 - hh - 0.08, 14, 10, F.body), color: C.white });
        d._stampW = 6.0;
      },
      async (d) => { // the thought held inside a great blue disc, its note beside a yellow square
        const s = page(d), dd = 3.75, x = X0, y = 1.28;
        t.oval(s, x, y, dd, dd, C.blue);
        t.text(s, L.runs(d.text), { x: x + 0.45, y: y + 0.5, w: dd - 0.9, h: dd - 1.0, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(d.text, dd - 0.95, dd - 1.05, 28, 13, F.head, true) });
        t.rect(s, 4.8, 1.5, 0.5, 0.5, C.yellow, { name: 'Square' });
        t.shape(s, 'ISOSCELES_TRIANGLE', { x: 5.45, y: 1.5, w: 0.5, h: 0.5, fill: { color: C.red }, objectName: 'Triangle' });
        if (d.caption) t.text(s, d.caption, { x: 4.8, y: 2.2, w: 4.6, h: 2.8, fontSize: L.fit(d.caption, 4.6, 2.8, 16, 10, F.body), color: C.ink });
      },
    ],
    timeline: [
      async (d) => { // a thick rule down the left, shapes on it, the dates large
        const s = page(d), n = d.items.length, rh = (Y1 - Y0) / n, lx = 2.85;
        t.rect(s, lx - 0.05, Y0, 0.1, Y1 - Y0, C.ink, { name: 'Bar' });
        d.items.forEach((it, i) => {
          const y = Y0 + i * rh;
          t.text(s, it.year, { x: X0, y: y + 0.03, w: 1.9, h: 0.5, bold: true, align: 'right', valign: 'middle', fontSize: L.fit(it.year, 1.9, 0.48, 26, 13, F.head, true) });
          mark(s, i % 3, lx - 0.21, y + 0.07, 0.42, [C.red, C.blue, C.yellow, C.red][i]);
          head(s, it.h, lx + 0.4, y + 0.02, 6.1, 0.34, { max: 16 });
          body(s, it.t, lx + 0.4, y + 0.36, 6.1, rh - 0.38, { color: C.ink, max: 13 });
        });
      },
      async (d) => { // a chessboard: each date a colour square, its event in the empty one beside it
        const s = page(d), cw = CW / 4, ch = (Y1 - Y0) / 2, cols = [C.red, C.blue, C.yellow, C.ink];
        d.items.forEach((it, i) => {
          const row = Math.floor(i / 2), even = row === 0, k = i % 2, sx = X0 + (even ? k * 2 : k * 2 + 1) * cw, tx = X0 + (even ? k * 2 + 1 : k * 2) * cw, y = Y0 + row * ch;
          t.rect(s, sx, y, cw, ch, cols[i], { name: 'Colour square' });
          t.text(s, it.year, { x: sx + 0.1, y: y + 0.1, w: cw - 0.2, h: ch - 0.2, bold: true, color: fg(cols[i]), align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.25, 0.9, 30, 13, F.head, true) });
          head(s, it.h, tx + 0.13, y + 0.06, cw - 0.22, 0.42, { max: 14 });
          body(s, it.t, tx + 0.13, y + 0.48, cw - 0.22, ch - 0.52, { color: C.ink, max: 12 });
        });
        t.rect(s, X0, Y0, CW, 0.05, C.ink, { name: 'Bar' });
        t.rect(s, X0, Y1 - 0.02, CW, 0.05, C.ink, { name: 'Bar' });
      },
      async (d) => { // a black field: a white bar across it, events above and below in turn
        const s = field(d, C.ink), cw = CW / 4, ly = (Y0 + Y1) / 2 + 0.02;
        t.rect(s, X0, ly - 0.05, CW, 0.1, C.white, { name: 'Bar' });
        d.items.forEach((it, i) => {
          const x = X0 + i * cw, up = i % 2 === 0, col = [C.red, C.yellow, C.white, C.red][i], cell = 1.6;
          mark(s, i % 3, x, ly - 0.2, 0.4, col);
          const y = up ? ly - 0.26 - cell : ly + 0.28, w = cw + (up ? 0.9 : 0.9);
          const ww = Math.min(w, 9.4 - x);
          t.text(s, it.year, { x, y, w: ww, h: 0.42, bold: true, color: i === 3 ? C.white : col, valign: 'middle', fontSize: L.fit(it.year, ww, 0.4, 22, 13, F.head, true) });
          head(s, it.h, x, y + 0.42, ww - 0.1, 0.3, { color: C.white, max: 14 });
          body(s, it.t, x, y + 0.72, ww - 0.1, cell - 0.74, { color: 'E4E4E4', max: 12 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.timeline = V.timeline.shift(); // the old timeline (bar with markers) read like the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (type === 'cover' || type === 'closing' ? { x: 0.6, y: 5.2, w: 4.2, h: 0.25, color: C.muted } : { x: 0.6, y: 5.15, w: d._stampW || 8.0, h: 0.25, color: d._ink || (type === 'quote' ? C.ink : C.muted) }));
  return L.save(pres, out, { name: 'SlideAI Bauhaus', colors: { dk1: C.ink, lt1: C.white, dk2: '333333', lt2: C.bg, accent1: C.red, accent2: C.blue, accent3: C.yellow, accent4: C.ink, accent5: C.muted, accent6: 'D9D2C3', hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "dadil va sodda: qisqa, aniq gaplar", "limits": {"card_t4": 60}};
module.exports = { id: 11, slug: 'bauhaus', name: 'Bauhaus', category: 'creative', build, style: STYLE };
