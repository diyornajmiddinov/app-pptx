/**
 * 17 Zen — Japandi calm: washi paper, a brushed enso circle, hairlines, indigo accent,
 * light Times headlines and generous empty space.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F4EFE6', ink: '2B2B2B', indigo: '2E4A7D', stone: '857F74', sand: 'DCD2C0' };
const F = { head: 'Times New Roman', body: 'Calibri' };

const enso = (color, op = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <g fill="none" stroke="#${color}" stroke-linecap="round" opacity="${op}">
   <path d="M300,70 A230,230 0 1 1 120,160" stroke-width="34"/>
   <path d="M290,78 A222,222 0 1 1 132,150" stroke-width="10" stroke-opacity="0.5" transform="translate(6 8)"/>
   <path d="M120,160 Q105,182 98,205" stroke-width="16" stroke-opacity="0.7"/></g></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const ensoInk = await L.svg(enso(C.ink), 600, 600), ensoSand = await L.svg(enso(C.sand), 600, 600);
  const X = 1.3, CW = 8.1;

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.line(s, 0.85, 0.6, 0, 4.45, C.sand, 1);
    t.oval(s, 0.79, 0.84, 0.12, 0.12, C.indigo);
    if (d.title) t.text(s, d.title, { x: X, y: 0.5, w: CW, h: 0.8, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, CW, 0.8, 30, 20, F.head) });
    s.slideNumber = { x: 0.6, y: 5.15, w: 0.5, h: 0.25, fontFace: F.head, fontSize: 10, color: C.stone, align: 'center' };
    return s;
  };
  const hero = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.img(s, ensoInk, 5.6, 0.9, 3.85, 3.85);
    t.line(s, 0.85, 1.0, 0, 3.6, C.sand, 1);
    const fs = L.fit(d.title, 4.4, 2.2, 44, 26, F.head);
    t.text(s, d.title, { x: X, y: 0.9, w: 4.4, h: 2.4, fontFace: F.head, fontSize: fs, color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: X, y: 3.55, w: 4.0, h: 1.1, fontSize: 14, color: C.stone, charSpacing: 0.5 });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), rh = Math.min(0.58, 3.5 / d.items.length);
      d.items.forEach((it, i) => {
        const y = 1.55 + i * rh;
        t.text(s, L.pad2(i + 1), { x: X, y, w: 0.6, h: rh, fontFace: F.head, italic: true, fontSize: 16, color: C.indigo, valign: 'middle' });
        t.text(s, it, { x: X + 0.7, y, w: 6.5, h: rh, fontFace: F.head, fontSize: 19, valign: 'middle' });
        t.line(s, X + 0.7, y + rh, 5.5, 0, C.sand, 0.5);
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, cols = n === 4 ? 2 : n, rws = Math.ceil(n / cols), gap = 0.5;
      const w = (CW - gap * (cols - 1)) / cols, h = (3.4 - 0.35 * (rws - 1)) / rws;
      d.items.forEach((it, i) => {
        const x = X + (i % cols) * (w + gap), y = 1.65 + Math.floor(i / cols) * (h + 0.35);
        t.oval(s, x, y + 0.12, 0.13, 0.13, C.indigo);
        t.text(s, it.h, { x: x + 0.3, y, w: w - 0.3, h: 0.42, fontFace: F.head, fontSize: L.fit(it.h, w - 0.3, 0.42, 20, 14, F.head), color: C.ink });
        t.text(s, it.t, { x: x + 0.3, y: y + 0.5, w: w - 0.3, h: h - 0.55, fontSize: 14, color: C.stone, lineSpacingMultiple: 1.15 });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = CW / n, ly = 2.2;
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.35, 0.45, 20, 13, F.head)));
      t.line(s, X, ly, CW - 0.3, 0, C.sand, 1);
      d.steps.forEach((st, i) => {
        const x = X + i * cw;
        t.text(s, L.pad2(i + 1), { x, y: 1.6, w: 1, h: 0.4, fontFace: F.head, italic: true, fontSize: 16, color: C.indigo });
        t.oval(s, x, ly - 0.09, 0.18, 0.18, C.bg, { line: { color: C.indigo, width: 1.25 } });
        t.text(s, st.h, { x, y: 2.5, w: cw - 0.35, h: 0.45, fontFace: F.head, fontSize: hfs, color: C.ink });
        t.text(s, st.t, { x, y: 3.0, w: cw - 0.35, h: 1.9, fontSize: 14, color: C.stone, lineSpacingMultiple: 1.15 });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = CW / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.5, 1.1, 60, 28, F.head)));
      d.stats.forEach((x, i) => {
        const px = X + i * cw;
        if (i) t.line(s, px - 0.25, 1.8, 0, 2.2, C.sand, 0.75);
        t.text(s, x.value, { x: px, y: 1.65, w: cw - 0.45, h: 1.2, fontFace: F.head, fontSize: vfs, color: C.indigo, valign: 'bottom' });
        t.text(s, x.label, { x: px, y: 3.05, w: cw - 0.5, h: 1.0, fontSize: 14, color: C.stone });
      });
      if (d.note) t.text(s, d.note, { x: X, y: 4.4, w: CW, h: 0.5, fontFace: F.head, italic: true, fontSize: 14, color: C.stone });
    },
    async compare(d) {
      const s = page(d), w = (CW - 0.8) / 2;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.25, 4.85 - 2.3);
      t.rect(s, X + w + 0.37, 1.7, 0.06, 3.1, C.sand, { name: 'Divider' });
      [d.left, d.right].forEach((side, i) => {
        const x = X + i * (w + 0.8);
        t.text(s, side.h, { x, y: 1.6, w, h: 0.5, fontFace: F.head, italic: true, fontSize: 22, color: i ? C.indigo : C.ink });
        let y = 2.3;
        side.items.forEach((it, k) => { t.text(s, it, { x, y, w, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page({});
      t.img(s, ensoSand, W / 2 - 1.95, H / 2 - 1.95, 3.9, 3.9);
      const fs = L.fit(d.text, 7.0, 1.5, 36, 22, F.head);
      t.text(s, L.runs(d.text), { x: 1.5, y: 1.55, w: 7.0, h: 1.6, fontFace: F.head, fontSize: fs, color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 2.2, y: 3.3, w: 5.6, h: 1.0, fontSize: 14, color: C.stone, align: 'center' });
      t.text(s, d.title, { x: 1.5, y: 4.6, w: 7.0, h: 0.3, fontSize: 11, color: C.indigo, align: 'center', charSpacing: 1 });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = CW / n;
      d.items.forEach((it, i) => {
        const x = X + i * cw;
        t.text(s, it.year, { x, y: 1.6, w: cw - 0.3, h: 0.6, fontFace: F.head, italic: true, color: C.indigo, valign: 'bottom', fontSize: L.fit(it.year, cw - 0.35, 0.55, 28, 14, F.head, false, 1, true) });
        t.line(s, x, 2.35, cw - 0.4, 0, C.sand, 1);
        t.text(s, it.h, { x, y: 2.55, w: cw - 0.35, h: 0.42, fontFace: F.head, fontSize: 18, color: C.ink });
        t.text(s, it.t, { x, y: 3.05, w: cw - 0.35, h: 1.8, fontSize: 14, color: C.stone, lineSpacingMultiple: 1.15 });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.bg };
      t.img(s, ensoSand, 0.4, 0.9, 3.8, 3.8);
      const fs = L.fit(d.text, 5.3, 2.6, 32, 20, F.head, false, 1, true);
      t.text(s, d.text, { x: 4.2, y: 1.0, w: 5.3, h: 2.8, fontFace: F.head, italic: true, fontSize: fs, color: C.ink, valign: 'bottom' });
      t.line(s, 4.2, 4.05, 0.6, 0, C.indigo, 1);
      if (d.author) t.text(s, d.author, { x: 4.2, y: 4.2, w: 5.3, h: 0.4, fontSize: 13, color: C.stone });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, X, 1.55, 3.4, 3.3);
      t.text(s, d.text, { x: X + 3.8, y: 1.55, w: CW - 3.8, h: 3.3, fontSize: L.fit(d.text, CW - 3.8, 3.3, 15, 11, F.body, false, 1.35), color: C.ink, lineSpacingMultiple: 1.35, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: X, y: 1.55, w: 3.9, h: 3.3, fontSize: L.fit(d.text, 3.9, 3.3, 15, 11, F.body, false, 1.35), color: C.ink, lineSpacingMultiple: 1.35, valign: 'middle' });
      await PH(s, d.image, X + 4.4, 1.55, CW - 4.4, 3.3);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.56, 3.4 / n);
      d.items.forEach((it, i) => {
        const y = 1.55 + i * rh;
        t.text(s, L.pad2(i + 1), { x: X, y, w: 0.55, h: rh, fontFace: F.head, italic: true, fontSize: 14, color: C.indigo, valign: 'middle' });
        t.text(s, it, { x: X + 0.65, y, w: CW - 0.65, h: rh, fontSize: L.fit(it, CW - 0.65, rh - 0.04, 13, 10, F.body), color: C.ink, valign: 'middle' });
        t.line(s, X + 0.65, y + rh, CW - 0.65, 0, C.sand, 0.5);
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 6.22, 1.52, 2.6, 2.6, { mask: 'circle' }); },
    closing: async (s, d) => { await PH(s, d.image, 6.22, 1.52, 2.6, 2.6, { mask: 'circle' }); },
  });
  // ---- further ways to draw a type, in this template's Japandi world (enso, stones, shoji lattice, bamboo, the indigo night): a deck's pages must not look alike (L.pages)
  const Y0 = 1.55, Y1 = 4.95, R9 = X + CW;
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.stone, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontFace: F.head, fontSize: L.fit(txt, w, h, o.max || 19, 12, F.head), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const num = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontFace: F.head, italic: true, fontSize: L.fit(txt, w, h, o.max || 16, 11, F.head, false, 1, true), color: o.color || C.indigo, align: o.align, valign: o.valign || 'middle' });
  const night = (d) => { // indigo-dyed cloth: the same hairline and dot, reversed
    d._night = true;
    const s = pres.addSlide(); s.background = { color: C.indigo };
    t.line(s, 0.85, 0.6, 0, 4.45, '6C84AE', 1);
    t.oval(s, 0.79, 0.84, 0.12, 0.12, C.bg);
    if (d.title) t.text(s, d.title, { x: X, y: 0.5, w: CW, h: 0.8, fontFace: F.head, color: C.bg, valign: 'middle', fontSize: L.fit(d.title, CW, 0.8, 30, 20, F.head) });
    s.slideNumber = { x: 0.6, y: 5.15, w: 0.5, h: 0.25, fontFace: F.head, fontSize: 10, color: C.sand, align: 'center' };
    return s;
  };
  const stone = (s, cx, cy, w, h, fill = C.sand) => t.oval(s, cx - w / 2, cy - h / 2, w, h, fill, { name: 'Stone' });
  const V = {
    image: [
      async (d) => { // the picture held inside the brushed circle
        const s = page(d), dd = 3.45, x = R9 - dd, y = 1.5, ph = dd * 0.72;
        t.img(s, await L.photo(L.src(d.image), ph, ph, { mask: 'circle' }), x + (dd - ph) / 2, y + (dd - ph) / 2, ph, ph, { alt: '' });
        t.img(s, ensoInk, x, y, dd, dd);
        t.text(s, d.text, { x: X, y: Y0, w: 4.4, h: Y1 - Y0 - 0.1, fontSize: L.fit(d.text, 4.4, Y1 - Y0 - 0.1, 14, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // indigo night: a hanging scroll, long and narrow, on its rods
        d._night = true;
        const s = night({}), w = 2.25, x = R9 - w - 0.2, y = 0.42, h = 4.5;
        t.rect(s, x - 0.14, y - 0.06, w + 0.28, 0.1, C.sand, { name: 'Scroll rod' });
        t.rect(s, x - 0.14, y + h + 0.02, w + 0.28, 0.1, C.sand, { name: 'Scroll rod' });
        await PH(s, d.image, x, y, w, h);
        t.text(s, d.title, { x: X, y: 0.5, w: 5.35, h: 0.95, fontFace: F.head, color: C.bg, valign: 'middle', fontSize: L.fit(d.title, 5.35, 0.92, 28, 18, F.head) });
        t.text(s, d.text, { x: X, y: Y0, w: 5.35, h: Y1 - Y0 - 0.05, fontSize: L.fit(d.text, 5.35, Y1 - Y0 - 0.05, 14, 10, F.body, false, 1.25), color: C.bg, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // the view through a shoji: the picture goes to the page's edge, the lattice crosses it
        d._stampW = 3.1;
        const s = page({});
        const x = 4.75, w = W - x;
        await PH(s, d.image, x, 0, w, H);
        [1, 2].forEach((k) => t.rect(s, x + (k * w) / 3 - 0.03, 0, 0.06, H, C.bg, { name: 'Lattice' }));
        [1, 2].forEach((k) => t.rect(s, x, (k * H) / 3 - 0.03, w, 0.06, C.bg, { name: 'Lattice' }));
        t.text(s, d.title, { x: X, y: 0.5, w: 3.15, h: 1.1, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 3.15, 1.05, 24, 15, F.head) });
        t.text(s, d.text, { x: X, y: 1.7, w: 3.15, h: 3.3, fontSize: L.fit(d.text, 3.15, 3.3, 13, 10, F.body, false, 1.05), color: C.ink, lineSpacingMultiple: 1.05 });
      },
      async (d) => { // the horizon: words above, a long low strip of picture runs off the page
        const s = page(d), ph = 1.48, py = 3.6;
        t.text(s, d.text, { x: X, y: Y0 - 0.1, w: CW, h: py - Y0, fontSize: L.fit(d.text, CW, py - Y0 - 0.02, 14, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
        await PH(s, d.image, X, py, W - X, ph);
        t.line(s, X, py - 0.05, W - X, 0, C.indigo, 0.75);
      },
    ],
    cards: [
      async (d) => { // quiet rows between hairlines, heading to the left, words to the right
        const s = page(d), n = d.items.length, h = (Y1 - Y0) / n;
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + i * h;
          t.line(s, X, y, CW, 0, C.sand, 0.75);
          t.img(s, await L.icon(it.icon, C.indigo, 1.25), X, y + h / 2 - 0.14, 0.28, 0.28);
          head(s, it.h, X + 0.45, y + 0.05, 2.5, h - 0.1, { max: 19 });
          body(s, it.t, X + 3.15, y + 0.05, CW - 3.15, h - 0.1, { valign: 'middle', color: C.ink, max: 14 });
        }
        t.line(s, X, Y1, CW, 0, C.sand, 0.75);
      },
      async (d) => { // a raked garden: a stone for each item at its own height, the words under it
        const s = page(d), n = d.items.length, cw = CW / n, sizes = [[1.3, 0.72], [0.96, 0.58], [1.15, 0.66], [0.84, 0.5]], ly = [0, 0.3, 0.1, 0.36];
        const rake = []; for (let k = 0; k < 6; k++) rake.push(`<path d="M0,${16 + k * 22} Q300,${4 + k * 22} 600,${16 + k * 22} T1200,${16 + k * 22}" fill="none" stroke="#${C.sand}" stroke-width="2"/>`);
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="140">${rake.join('')}</svg>`, 1600, 186), X, 1.5, CW, 0.95, { alt: '' });
        for (const [i, it] of d.items.entries()) {
          const x = X + i * cw, [sw, sh] = sizes[i], cy = 1.92 + ly[i] * 0.4;
          stone(s, x + cw / 2 - 0.12, cy, sw, sh, i === 0 ? C.indigo : C.sand);
          t.img(s, await L.icon(it.icon, i === 0 ? C.bg : C.indigo, 1.5), x + cw / 2 - 0.26, cy - 0.14, 0.28, 0.28);
          head(s, it.h, x, 2.62, cw - 0.25, 0.48, { align: 'center', max: 17 });
          body(s, it.t, x, 3.12, cw - 0.25, Y1 - 3.12, { align: 'center', max: 13 });
        }
      },
      async (d) => { // indigo night: the panels of a shoji screen, lit from behind
        const s = night(d), n = d.items.length, gap = 0.06, w = (CW - gap * (n - 1)) / n, y = Y0 - 0.1, h = Y1 - y;
        for (const [i, it] of d.items.entries()) {
          const x = X + i * (w + gap);
          t.rect(s, x, y, w, h, C.bg, { name: 'Shoji panel' });
          t.line(s, x, y + 0.82, w, 0, C.indigo, 0.75); t.line(s, x + w / 2, y, 0, 0.82, C.indigo, 0.75);
          t.img(s, await L.icon(it.icon, C.indigo, 1.5), x + w / 4 - 0.14, y + 0.27, 0.28, 0.28);
          num(s, L.pad2(i + 1), x + w / 2 + 0.05, y + 0.24, w / 2 - 0.1, 0.34, { align: 'center' });
          head(s, it.h, x + 0.14, y + 0.9, w - 0.28, 0.55, { max: 16, valign: 'top' });
          body(s, it.t, x + 0.14, y + 1.46, w - 0.28, h - 1.54, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // the items set round a pale circle, with air between
        const s = page(d), n = d.items.length, cx = X + CW / 2, cy = (Y0 + Y1) / 2, dd = 2.0, w = 2.9, hh = (Y1 - Y0 - 0.14) / 2;
        t.img(s, ensoSand, cx - dd / 2, cy - dd / 2, dd, dd);
        t.oval(s, cx - 0.09, cy - 0.09, 0.18, 0.18, C.indigo);
        const spots = n === 4 ? [[X, Y0], [R9 - w, Y0], [X, Y0 + hh + 0.14], [R9 - w, Y0 + hh + 0.14]] : [[X, Y0], [R9 - w, cy - hh / 2], [X, Y0 + hh + 0.14]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right';
          t.img(s, await L.icon(it.icon, C.indigo, 1.25), right ? x : x + w - 0.28, y + 0.04, 0.28, 0.28);
          head(s, it.h, right ? x + 0.38 : x, y + 0.01, w - 0.38, 0.36, { align: a, max: 18 });
          body(s, it.t, x, y + 0.42, w, hh - 0.44, { align: a, max: 13, color: C.ink });
        }
      },
    ],
    process: [
      async (d) => { // stepping stones crossing the page from the upper left to the lower right
        const s = page(d), n = d.steps.length, rh = (Y1 - Y0) / n, shift = n === 4 ? 0.7 : 0.95, w = CW - shift * (n - 1);
        d.steps.forEach((st, i) => {
          const x = X + i * shift, y = Y0 + i * rh, sw = 0.68, sh = 0.46;
          stone(s, x + sw / 2, y + 0.26, sw, sh, i === n - 1 ? C.indigo : C.sand);
          t.text(s, String(i + 1), { x, y: y + 0.03, w: sw, h: sh, fontFace: F.head, italic: true, fontSize: 15, color: i === n - 1 ? C.bg : C.indigo, align: 'center', valign: 'middle' });
          head(s, st.h, x + sw + 0.16, y, w - sw - 0.16, 0.34, { max: 18 });
          body(s, st.t, x + sw + 0.16, y + 0.35, w - sw - 0.16, rh - 0.38, { max: 13 });
        });
      },
      async (d) => { // bamboo: stalks that grow, each joint one step further
        const s = page(d), n = d.steps.length, cw = CW / n, rise = n === 4 ? 0.28 : 0.42, top = Y0 + rise * (n - 1), base = Y1 + 0.02;
        t.line(s, X, base, CW, 0, C.sand, 1);
        d.steps.forEach((st, i) => {
          const x = X + i * cw, y = top - i * rise;
          t.rect(s, x + 0.02, y, 0.09, base - y, i === n - 1 ? C.indigo : C.sand, { name: 'Stalk' });
          for (let j = 1; j < 5; j++) { const jy = y + j * 0.62; if (jy < base - 0.1) t.rect(s, x - 0.02, jy, 0.17, 0.04, i === n - 1 ? C.indigo : C.stone, { name: 'Joint' }); }
          num(s, L.pad2(i + 1), x + 0.28, y, 0.7, 0.36);
          head(s, st.h, x + 0.28, y + 0.36, cw - 0.45, 0.52, { max: 16, valign: 'top' });
          body(s, st.t, x + 0.28, y + 0.9, cw - 0.45, base - y - 0.96, { max: 13 });
        });
      },
      async (d) => { // indigo night: a single hairline down the middle, the steps to either side
        const s = night(d), n = d.steps.length, cx = X + CW / 2, w = 3.65, rh = (Y1 - Y0) / n, bh = Math.min(rh * 2 - 0.1, 1.5);
        t.line(s, cx, Y0 - 0.05, 0, Y1 - Y0 + 0.05, C.sand, 0.75);
        d.steps.forEach((st, i) => {
          const right = i % 2 === 1, y = Y0 + i * rh, x = right ? cx + 0.4 : cx - 0.4 - w, a = right ? 'left' : 'right', dd = 0.4;
          t.oval(s, cx - dd / 2, y, dd, dd, C.indigo, { line: { color: C.sand, width: 1 }, name: 'Stone' });
          t.text(s, String(i + 1), { x: cx - dd / 2, y, w: dd, h: dd, fontFace: F.head, italic: true, fontSize: 13, color: C.bg, align: 'center', valign: 'middle' });
          head(s, st.h, x, y, w, 0.4, { align: a, color: C.bg, max: 19 });
          body(s, st.t, x, y + 0.42, w, Math.min(bh - 0.44, 5.03 - (Y0 + (n - 1) * rh + 0.42)), { align: a, color: C.sand, max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // one number within the circle, two more resting beside it
        const s = page(d), [a, ...rest] = d.stats, dd = d.note ? 2.75 : 3.3, x = X, y = Y0 - 0.08;
        t.img(s, ensoSand, x, y, dd, dd);
        t.text(s, a.value, { x: x + dd * 0.21, y: y + dd * 0.28, w: dd * 0.58, h: dd * 0.3, fontFace: F.head, color: C.indigo, align: 'center', valign: 'middle', fontSize: L.fit(a.value, dd * 0.56, dd * 0.28, 44, 18, F.head) });
        body(s, a.label, x + dd * 0.2, y + dd * 0.58, dd * 0.6, dd * 0.22, { align: 'center', max: 12 });
        const rx = x + dd + 0.45, rw = R9 - rx, rh = dd / 2;
        rest.forEach((v, i) => {
          const yy = y + i * rh;
          if (i) t.line(s, rx, yy, rw, 0, C.sand, 0.75);
          t.text(s, v.value, { x: rx, y: yy + 0.05, w: rw, h: rh * 0.5, fontFace: F.head, color: C.indigo, valign: 'bottom', fontSize: L.fit(v.value, rw, rh * 0.48, 40, 20, F.head) });
          body(s, v.label, rx, yy + rh * 0.56, rw, rh * 0.4, { max: 13 });
        });
        if (d.note) t.text(s, d.note, { x: X, y: y + dd + 0.06, w: CW, h: 5.03 - y - dd - 0.06, fontFace: F.head, italic: true, fontSize: L.fit(d.note, CW, 5.03 - y - dd - 0.06, 13, 10, F.head, false, 1, true), color: C.stone });
      },
      async (d) => { // indigo night: words to the left, the numbers set far to the right
        const s = night(d), rh = d.note ? 0.85 : 1.1;
        d.stats.forEach((v, i) => {
          const y = Y0 + i * rh;
          t.line(s, X, y, CW, 0, '6C84AE', 0.75);
          body(s, v.label, X, y + 0.06, 4.4, rh - 0.12, { color: C.bg, valign: 'middle', max: 15 });
          t.text(s, v.value, { x: X + 4.5, y: y + 0.03, w: CW - 4.5, h: rh - 0.06, fontFace: F.head, color: C.bg, align: 'right', valign: 'middle', fontSize: L.fit(v.value, CW - 4.55, rh - 0.1, 46, 22, F.head) });
        });
        if (d.note) { t.line(s, X, Y0 + 3 * rh, CW, 0, '6C84AE', 0.75); t.text(s, d.note, { x: X, y: Y0 + 3 * rh + 0.06, w: CW, h: Y1 + 0.06 - Y0 - 3 * rh - 0.06, fontFace: F.head, italic: true, fontSize: L.fit(d.note, CW, Y1 + 0.06 - Y0 - 3 * rh - 0.06, 13, 10, F.head, false, 1, true), color: C.sand }); }
      },
    ],
    compare: [
      async (d) => { // mirrored about the middle, a pale circle quietly behind them
        const s = page(d), w = 3.7, cx = X + CW / 2, avail = Y1 - 2.2;
        t.img(s, ensoSand, cx - 1.65, 1.65, 3.3, 3.3);
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.22, avail);
        t.text(s, d.left.h, { x: cx - 0.35 - w, y: Y0, w, h: 0.5, fontFace: F.head, italic: true, fontSize: L.fit(d.left.h, w, 0.48, 22, 14, F.head, false, 1, true), color: C.ink, align: 'right', valign: 'middle' });
        t.text(s, d.right.h, { x: cx + 0.35, y: Y0, w, h: 0.5, fontFace: F.head, italic: true, fontSize: L.fit(d.right.h, w, 0.48, 22, 14, F.head, false, 1, true), color: C.indigo, valign: 'middle' });
        let y = 2.2;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: cx - 0.35 - w, y, w, h: rows[k], fontSize: fs, color: C.ink, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: cx + 0.35, y, w, h: rows[k], fontSize: fs, color: C.ink });
          t.oval(s, cx - 0.05, y + 0.06, 0.1, 0.1, C.indigo);
          y += Math.max(rows[k], Math.min(0.68, avail / rows.length));
        }
      },
      async (d) => { // the upper list on paper, the lower on a band of indigo running off the page
        const s = page(d), h = (Y1 - Y0 - 0.1) / 2;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = Y0 + i * (h + 0.1), dark = i === 1, ink = dark ? C.bg : C.ink, n = side.items.length, rh = (h - 0.14) / n;
          if (dark) t.rect(s, X - 0.15, y, W - X + 0.15, h, C.indigo, { name: 'Band' }); else t.line(s, X, y, CW, 0, C.sand, 0.75);
          t.text(s, side.h, { x: X, y: y + 0.08, w: 2.3, h: h - 0.16, fontFace: F.head, italic: true, fontSize: L.fit(side.h, 2.3, h - 0.2, 20, 14, F.head, false, 1, true), color: dark ? C.bg : C.indigo, valign: 'middle' });
          side.items.forEach((it, k) => { body(s, it, X + 2.5, y + 0.07 + k * rh, CW - 2.6, rh - 0.02, { color: ink, valign: 'middle', max: 13 }); });
        }
      },
    ],
    statement: [
      async (d) => { // indigo night: the words in light, the circle rising behind on the right
        const s = night(d), dd = 2.9;
        t.img(s, ensoSand, R9 - dd + 0.2, 1.75, dd, dd);
        t.text(s, L.runs(d.text), { x: X, y: Y0, w: 5.2, h: d.caption ? 2.1 : 3.3, fontFace: F.head, color: C.bg, valign: 'middle', fontSize: L.fit(d.text, 5.2, d.caption ? 2.05 : 3.25, 32, 18, F.head) });
        if (d.caption) t.text(s, d.caption, { x: X, y: 3.72, w: 5.2, h: 1.28, fontSize: L.fit(d.caption, 5.2, 1.28, 13, 10, F.body), color: C.sand });
      },
      async (d) => { // emptiness above; the thought rests low, its note in a narrow margin
        const s = page(d);
        if (d.caption) t.text(s, d.caption, { x: X, y: 2.0, w: 2.4, h: 2.9, fontSize: L.fit(d.caption, 2.4, 2.9, 13, 10, F.body), color: C.stone, valign: 'bottom' });
        t.line(s, X + 2.65, 2.0, 0, 2.9, C.indigo, 0.75);
        t.text(s, L.runs(d.text), { x: X + 2.95, y: 1.75, w: CW - 2.95, h: 3.15, fontFace: F.head, color: C.ink, valign: 'bottom', fontSize: L.fit(d.text, CW - 2.95, 3.1, 34, 18, F.head) });
      },
    ],
    timeline: [
      async (d) => { // a hairline down the left, dates in italics, a quiet entry to each
        const s = page(d), n = d.items.length, rh = (Y1 - Y0) / n, lx = X + 1.5;
        t.line(s, lx, Y0 + 0.1, 0, Y1 - Y0 - 0.2, C.sand, 1);
        d.items.forEach((it, i) => {
          const y = Y0 + i * rh;
          num(s, it.year, X, y + 0.02, 1.3, 0.42, { align: 'right', max: 19 });
          t.oval(s, lx - 0.07, y + 0.16, 0.14, 0.14, C.bg, { line: { color: C.indigo, width: 1.25 } });
          head(s, it.h, lx + 0.3, y, CW - 1.8, 0.36, { max: 18 });
          body(s, it.t, lx + 0.3, y + 0.38, CW - 1.8, rh - 0.42, { max: 13 });
        });
      },
      async (d) => { // falling leaves: each date lower than the last, a hairline resting on it
        const s = page(d), n = d.items.length, cw = CW / n, drop = 0.3;
        d.items.forEach((it, i) => {
          const x = X + i * cw, y = Y0 + i * drop;
          num(s, it.year, x, y, cw - 0.25, 0.48, { max: 24, valign: 'bottom' });
          t.line(s, x, y + 0.54, cw - 0.3, 0, C.indigo, 0.75);
          head(s, it.h, x, y + 0.6, cw - 0.25, 0.44, { max: 17 });
          body(s, it.t, x, y + 1.06, cw - 0.25, Y1 - y - 1.08, { max: 13 });
        });
      },
      async (d) => { // indigo night: four brushed circles, a date within each
        const s = night(d), n = d.items.length, cw = CW / n, dd = 1.3;
        d.items.forEach((it, i) => {
          const x = X + i * cw, cx = x + cw / 2 - 0.08, y = Y0 - 0.1;
          t.img(s, ensoSand, cx - dd / 2, y, dd, dd);
          num(s, it.year, cx - dd * 0.34, y + dd * 0.28, dd * 0.68, dd * 0.44, { color: C.bg, align: 'center', max: 16 });
          head(s, it.h, x, y + dd + 0.05, cw - 0.16, 0.44, { align: 'center', color: C.bg, max: 17 });
          body(s, it.t, x, y + dd + 0.5, cw - 0.16, Y1 - y - dd - 0.5, { align: 'center', color: C.sand, max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.timeline = V.timeline.shift(); // the old timeline (hairline over columns) read like the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (type === 'cover' || type === 'closing' || type === 'quote' ? { x: 1.3, y: 5.15, w: 8.1, h: 0.25, color: C.stone } : { x: 1.3, y: 5.15, w: d._stampW || 7.6, h: 0.25, color: d._night ? C.sand : C.stone }));
  return L.save(pres, out, { name: 'SlideAI Zen', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '44403A', lt2: C.bg, accent1: C.indigo, accent2: C.stone, accent3: C.sand, accent4: '6C84AE', accent5: 'B5AC9B', accent6: 'EAE3D6', hlink: C.indigo, folHlink: C.stone } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "sokin va minimal: har bir gapda bitta fikr", "limits": {"stmt": 60, "quote": 110}};
module.exports = { id: 17, slug: 'zen', name: 'Zen', category: 'minimalist', build, style: STYLE };
