/**
 * 13 Blueprint — technical drawing: blueprint blue with a fine grid, white line work,
 * corner ticks, dimension lines, a title block, Courier labels.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: '1B4C8C', line: 'FFFFFF', cyan: '9FD3FF', text: 'FFFFFF', muted: 'C9DAEF', yellow: 'FFD166' };
const F = { head: 'Arial', body: 'Arial', mono: 'Courier New' };

const gridSvg = () => {
  const g = [];
  for (let x = 0; x <= 1600; x += 32) g.push(`<line x1="${x}" y1="0" x2="${x}" y2="900" stroke-opacity="${x % 160 ? 0.07 : 0.16}"/>`);
  for (let y = 0; y <= 900; y += 32) g.push(`<line x1="0" y1="${y}" x2="1600" y2="${y}" stroke-opacity="${y % 160 ? 0.07 : 0.16}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/><g stroke="#FFFFFF" stroke-width="1">${g.join('')}</g></svg>`;
};

async function build(content, out) {
  const pres = L.deck({ head: F.head, body: F.body }, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const grid = await L.svg(gridSvg(), 1600, 900, true);
  const total = content.slides.length; let idx = 0;

  const ticks = (s, x, y, w, h, k = 0.16) => {
    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([px, py, dx, dy]) => {
      t.line(s, dx > 0 ? px : px - k, py, k, 0, C.line, 1.5);
      t.line(s, px, dy > 0 ? py : py - k, 0, k, C.line, 1.5);
    });
  };
  const box = (s, x, y, w, h, o = {}) => { t.rect(s, x, y, w, h, null, { line: { color: o.color || C.line, width: 0.75, ...(o.dash ? { dashType: 'dash' } : {}) }, name: 'Outline' }); ticks(s, x - 0.06, y - 0.06, w + 0.12, h + 0.12, 0.14); };
  const titleBlock = (s) => {
    t.rect(s, 6.4, 4.85, 3.0, 0.48, null, { line: { color: C.line, width: 0.75 }, name: 'Title block' });
    t.line(s, 8.2, 4.85, 0, 0.48, C.line, 0.75);
    t.text(s, (content.meta && content.meta.topic) || content.slides[0].title, { x: 6.5, y: 4.85, w: 1.65, h: 0.48, fontFace: F.mono, fontSize: 8, color: C.muted, valign: 'middle' });
    t.text(s, `${TR.sheet} ${L.pad2(idx)}/${L.pad2(total)}`, { x: 8.2, y: 4.85, w: 1.2, h: 0.48, fontFace: F.mono, fontSize: 10, bold: true, color: C.text, align: 'center', valign: 'middle' });
  };
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: grid }; idx++;
    t.text(s, d.title, { x: 0.6, y: 0.35, w: 8.8, h: 0.75, fontFace: F.head, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.75, 26, 18, F.head, true) });
    t.line(s, 0.6, 1.15, 1.2, 0, C.cyan, 1.5);
    titleBlock(s);
    return s;
  };
  const crosshair = (s, cx, cy, r) => {
    t.oval(s, cx - r, cy - r, 2 * r, 2 * r, null, { line: { color: C.line, width: 1.25 } });
    t.oval(s, cx - r * 0.66, cy - r * 0.66, 1.32 * r, 1.32 * r, null, { line: { color: C.cyan, width: 0.75, dashType: 'dash' } });
    t.oval(s, cx - r * 0.25, cy - r * 0.25, 0.5 * r, 0.5 * r, null, { line: { color: C.line, width: 1 } });
    t.line(s, cx - r * 1.25, cy, r * 2.5, 0, C.line, 0.75, { dash: 'dashDot' });
    t.line(s, cx, cy - r * 1.25, 0, r * 2.5, C.line, 0.75, { dash: 'dashDot' });
  };
  const dim = (s, x, y, w) => s.addShape(t.S.LINE, { x, y, w, h: 0, line: { color: C.cyan, width: 1, beginArrowType: 'triangle', endArrowType: 'triangle' }, objectName: 'Dimension' });

  const hero = (d) => {
    const s = pres.addSlide(); s.background = { data: grid }; idx++;
    crosshair(s, 7.6, 2.4, 1.55);
    dim(s, 6.05, 4.35, 3.1);
    const fs = L.fit(d.title, 5.2, 2.4, 44, 26, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 5.2, h: 2.5, fontFace: F.head, bold: true, fontSize: fs, color: C.text, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.6, w: 5.0, h: 1.1, fontFace: F.mono, fontSize: 14, color: C.cyan });
    titleBlock(s);
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.45 + (i % per) * rh;
        t.text(s, `A-${L.pad2(i + 1)}`, { x, y, w: 0.85, h: rh - 0.2, fontFace: F.mono, fontSize: 14, bold: true, color: C.cyan, valign: 'middle' });
        t.text(s, it, { x: x + 0.95, y, w: 3.2, h: rh - 0.2, fontSize: 17, color: C.text, valign: 'middle' });
        t.line(s, x, y + rh - 0.12, 4.1, 0, C.muted, 0.5, { dash: 'dash' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.5, 0.42, 17, 12, F.head, true)));
      const h = Math.min(3.2, 1.45 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.5;
        box(s, x, y, w, h);
        t.text(s, L.pad2(i + 1), { x: x + 0.25, y: y + 0.2, w: 0.6, h: 0.3, fontFace: F.mono, fontSize: 12, bold: true, color: C.cyan });
        t.img(s, await L.icon(it.icon, C.line, 1.5), x + w - 0.65, y + 0.2, 0.4, 0.4);
        t.text(s, it.h, { x: x + 0.25, y: y + 0.7, w: w - 0.5, h: 0.42, fontSize: hfs, bold: true, color: C.text });
        t.text(s, it.t, { x: x + 0.25, y: y + 1.15, w: w - 0.5, h: h - 1.25, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.5, w = (8.8 - gap * (n - 1)) / n, h = 2.7, y = 1.6;
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, w - 0.4, 0.42, 17, 12, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * (w + gap);
        box(s, x, y, w, h);
        t.text(s, `S${i + 1}`, { x: x + 0.2, y: y + 0.18, w: 1, h: 0.35, fontFace: F.mono, fontSize: 16, bold: true, color: C.yellow });
        t.text(s, st.h, { x: x + 0.2, y: y + 0.65, w: w - 0.4, h: 0.42, fontSize: hfs, bold: true, color: C.text });
        t.text(s, st.t, { x: x + 0.2, y: y + 1.1, w: w - 0.4, h: h - 1.2, fontSize: 14, color: C.muted });
        if (i < n - 1) s.addShape(t.S.LINE, { x: x + w + 0.08, y: y + h / 2, w: gap - 0.16, h: 0, line: { color: C.cyan, width: 1.5, endArrowType: 'triangle' }, objectName: 'Arrow' });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        t.text(s, x.value, { x: px, y: 1.55, w: cw - 0.3, h: 1.05, fontFace: F.mono, bold: true, color: C.yellow, valign: 'bottom', fontSize: L.fit(x.value, cw - 0.4, 1.0, 46, 24, F.mono, true) });
        dim(s, px, 2.85, cw - 0.4);
        t.text(s, x.label, { x: px, y: 3.05, w: cw - 0.4, h: 1.0, fontSize: 15, color: C.muted });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.1, w: 5.6, h: 0.86, fontFace: F.mono, fontSize: 12, color: C.cyan });
    },
    async compare(d) {
      const s = page(d), w = 4.2, h = 3.15, y = 1.5;
      const nr = Math.max(d.left.items.length, d.right.items.length), { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.85, F.body, 0, h - 0.85 - 0.12 - 0.16 * (nr - 1));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4);
        box(s, x, y, w, h, { color: i ? C.cyan : C.line });
        t.text(s, side.h, { x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.45, fontFace: F.mono, fontSize: 17, bold: true, color: i ? C.cyan : C.text });
        let yy = y + 0.85;
        side.items.forEach((it, k) => {
          t.text(s, i ? '+' : '\u2013', { x: x + 0.3, y: yy, w: 0.3, h: 0.3, fontFace: F.mono, fontSize: 15, bold: true, color: i ? C.cyan : C.muted });
          t.text(s, it, { x: x + 0.6, y: yy, w: w - 0.85, h: rows[k] + 0.05, fontSize: CFS, color: C.text });
          yy += rows[k] + 0.16;
        });
      });
    },
    async statement(d) {
      const s = page(d);
      crosshair(s, 1.55, 2.75, 0.85);
      const fs = L.fit(d.text, 6.5, 1.5, 34, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: 2.9, y: 1.55, w: 6.5, h: 1.6, fontSize: fs, bold: true, color: C.text, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: 2.9, y: 3.35, w: 6.3, h: 1.2, fontFace: F.mono, fontSize: 13, color: C.cyan });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.2;
      t.line(s, 0.6, ly, 8.8, 0, C.line, 1.25);
      for (let k = 0; k <= 4 * n; k++) t.line(s, 0.6 + (8.8 * k) / (4 * n), ly - (k % 4 ? 0.06 : 0.14), 0, k % 4 ? 0.12 : 0.28, C.line, 0.75);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.55, fontFace: F.mono, bold: true, color: C.yellow, valign: 'bottom', fontSize: L.fit(it.year, cw - 0.3, 0.5, 22, 12, F.mono, true) });
        t.line(s, x, ly + 0.15, 0, 0.45, C.cyan, 0.75, { dash: 'dash' });
        t.text(s, it.h, { x, y: 2.75, w: cw - 0.3, h: 0.4, fontSize: 16, bold: true, color: C.text });
        t.text(s, it.t, { x, y: 3.2, w: cw - 0.3, h: 1.45, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { data: grid }; idx++;
      box(s, 1.0, 1.0, 8.0, 3.3, { dash: true });
      const fs = L.fit(d.text, 7.0, 2.1, 30, 18, F.head, false, 1, true);
      t.text(s, d.text, { x: 1.5, y: 1.25, w: 7.0, h: 2.3, fontSize: fs, italic: true, color: C.text, valign: 'middle' });
      if (d.author) t.text(s, `// ${d.author}`, { x: 1.5, y: 3.65, w: 7.0, h: 0.4, fontFace: F.mono, fontSize: 13, color: C.cyan });
      titleBlock(s);
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      box(s, 0.6, 1.45, 4.0, 3.2); await PH(s, d.image, 0.7, 1.55, 3.8, 3.0, { duo: ['0E2E5C', 'CFE8FF'] });
      t.text(s, d.text, { x: 4.95, y: 1.45, w: 4.45, h: 3.2, fontSize: L.fit(d.text, 4.45, 3.2, 15, 11, F.body, false, 1.25), color: C.text, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: 0.6, y: 1.45, w: 4.2, h: 3.2, fontSize: L.fit(d.text, 4.2, 3.2, 15, 11, F.body, false, 1.25), color: C.text, lineSpacingMultiple: 1.25, valign: 'middle' });
      box(s, 5.2, 1.45, 4.2, 3.2); await PH(s, d.image, 5.3, 1.55, 4.0, 3.0, { duo: ['0E2E5C', 'CFE8FF'] });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.52, 3.2 / n);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.text(s, `[${i + 1}]`, { x: 0.6, y, w: 0.55, h: rh, fontFace: F.mono, fontSize: 13, bold: true, color: C.cyan, valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.2, h: rh, fontSize: L.fit(it, 8.2, rh - 0.04, 14, 10, F.body), color: C.text, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 6.6, 1.4, 2.0, 2.0, { mask: 'circle', duo: ['0E2E5C', 'CFE8FF'] }); },
    closing: async (s, d) => { await PH(s, d.image, 6.6, 1.4, 2.0, 2.0, { mask: 'circle', duo: ['0E2E5C', 'CFE8FF'] }); },
  });
  // ---- further ways to draw a type, in this template's drafting-table world (dimension lines, leaders, centre lines, bills of materials, the whiteprint): a deck's pages must not look alike (L.pages)
  const X0 = 0.6, CW = 8.8, Y0 = 1.4, Y1 = 4.72, DUO = { duo: ['0E2E5C', 'CFE8FF'] }, WP = { bg: 'F5F9FD', ink: '1B4C8C', soft: '3F5F86', rule: '8FB0D4' };
  const wpGrid = await L.svg(gridSvg().replace(`fill="#${C.bg}"`, `fill="#${WP.bg}"`).replace('stroke="#FFFFFF"', `stroke="#${WP.ink}"`), 1600, 900, true);
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontFace: o.font || F.body, fontSize: L.fit(txt, w, h, o.max || 14, 10, o.font || F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, bold: true, fontFace: o.font || F.head, fontSize: L.fit(txt, w, h, o.max || 16, 11, o.font || F.head, true), color: o.color || C.text, align: o.align, valign: o.valign || 'middle' });
  const inkTicks = (s, x, y, w, h, c, k = 0.14) => [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([px, py, dx, dy]) => { t.line(s, dx > 0 ? px : px - k, py, k, 0, c, 1.5); t.line(s, px, dy > 0 ? py : py - k, 0, k, c, 1.5); });
  const wpBox = (s, x, y, w, h, o = {}) => { t.rect(s, x, y, w, h, o.fill || WP.bg, { line: { color: WP.ink, width: 0.75 }, name: 'Outline' }); inkTicks(s, x - 0.06, y - 0.06, w + 0.12, h + 0.12, WP.ink); };
  const whiteprint = (d) => { // the same sheet printed the other way round: blue ink on white
    d._wp = true;
    const s = pres.addSlide(); s.background = { data: wpGrid }; idx++;
    t.text(s, d.title, { x: 0.6, y: 0.35, w: 8.8, h: 0.75, fontFace: F.head, bold: true, color: WP.ink, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.75, 26, 18, F.head, true) });
    t.line(s, 0.6, 1.15, 1.2, 0, WP.ink, 1.5);
    t.rect(s, 6.4, 4.85, 3.0, 0.48, WP.bg, { line: { color: WP.ink, width: 0.75 }, name: 'Title block' });
    t.line(s, 8.2, 4.85, 0, 0.48, WP.ink, 0.75);
    t.text(s, (content.meta && content.meta.topic) || content.slides[0].title, { x: 6.5, y: 4.85, w: 1.65, h: 0.48, fontFace: F.mono, fontSize: 8, color: WP.soft, valign: 'middle' });
    t.text(s, `${TR.sheet} ${L.pad2(idx)}/${L.pad2(total)}`, { x: 8.2, y: 4.85, w: 1.2, h: 0.48, fontFace: F.mono, fontSize: 10, bold: true, color: WP.ink, align: 'center', valign: 'middle' });
    return s;
  };
  const dimC = (s, x, y, w, h, c) => s.addShape(t.S.LINE, { x, y, w, h, line: { color: c, width: 1, beginArrowType: 'triangle', endArrowType: 'triangle' }, objectName: 'Dimension' });
  const arrow = (s, x, y, w, h, c, o = {}) => s.addShape(t.S.LINE, { x, y, w, h, ...(o.flipH ? { flipH: true } : {}), ...(o.flipV ? { flipV: true } : {}), line: { color: c, width: 1.5, endArrowType: 'triangle' }, objectName: 'Arrow' });
  const V = {
    image: [
      async (d) => { // a detail bubble: the picture ringed like a detail view, with a leader to the text
        const s = page(d), dd = 2.95, cx = 7.55, cy = 2.85;
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle', ...DUO }), cx - dd / 2, cy - dd / 2, dd, dd, { alt: '' });
        t.oval(s, cx - dd / 2 - 0.08, cy - dd / 2 - 0.08, dd + 0.16, dd + 0.16, null, { line: { color: C.line, width: 1.25 }, name: 'Detail ring' });
        t.line(s, cx - dd / 2 - 0.25, cy, dd + 0.5, 0, C.line, 0.75, { dash: 'dashDot' }); t.line(s, cx, cy - dd / 2 - 0.2, 0, dd + 0.4, C.line, 0.75, { dash: 'dashDot' });
        t.line(s, 5.4, 1.75, cx - dd / 2 - 0.05 - 5.4, 0.5, C.cyan, 1, { name: 'Leader' });
        t.text(s, d.text, { x: X0, y: Y0, w: 4.7, h: Y1 - Y0 + 0.15, fontSize: L.fit(d.text, 4.7, Y1 - Y0 + 0.1, 14, 10, F.body, false, 1.2), color: C.text, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the whole sheet is the picture, in blueprint tones; the words on a plate
        const s = page(d);
        await PH(s, d.image, 0, 0, W, H, DUO);
        t.rect(s, 0, 0, W, 1.18, C.bg, { name: 'Header plate' });
        t.text(s, d.title, { x: 0.6, y: 0.35, w: 8.8, h: 0.75, fontFace: F.head, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.75, 26, 18, F.head, true) });
        t.rect(s, 0.6, 1.5, 4.7, 3.2, C.bg, { t: 5, line: { color: C.line, width: 0.75 }, name: 'Plate' });
        ticks(s, 0.54, 1.44, 4.82, 3.32);
        t.text(s, d.text, { x: 0.8, y: 1.6, w: 4.3, h: 3.0, fontSize: L.fit(d.text, 4.3, 3.0, 14, 10, F.body, false, 1.15), color: C.text, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0, 4.85, W, H - 4.85, C.bg, { name: 'Footer plate' });
        titleBlock(s);
      },
      async (d) => { // whiteprint: the picture measured on two sides like a part
        const s = whiteprint(d), x = 0.95, y = 1.75, w = 4.3, h = 2.95;
        dimC(s, x, 1.5, w, 0, WP.ink);
        t.line(s, x, 1.42, 0, y - 1.42, WP.ink, 0.5); t.line(s, x + w, 1.42, 0, y - 1.42, WP.ink, 0.5);
        dimC(s, 0.68, y, 0, h, WP.ink);
        t.line(s, 0.6, y, x - 0.6, 0, WP.ink, 0.5); t.line(s, 0.6, y + h, x - 0.6, 0, WP.ink, 0.5);
        t.rect(s, x, y, w, h, null, { line: { color: WP.ink, width: 1 }, name: 'Outline' });
        await PH(s, d.image, x + 0.06, y + 0.06, w - 0.12, h - 0.12, DUO);
        t.text(s, d.text, { x: 5.6, y: Y0, w: 3.8, h: Y1 - Y0, fontSize: L.fit(d.text, 3.8, Y1 - Y0, 14, 10, F.body, false, 1.15), color: WP.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
      },
      async (d) => { // a section across the sheet: the picture cut between two cut marks
        const s = page(d), ph = 1.55;
        await PH(s, d.image, X0 + 0.4, Y0, CW - 0.8, ph, DUO);
        ticks(s, X0 + 0.34, Y0 - 0.06, CW - 0.68, ph + 0.12);
        [X0, X0 + CW - 0.3].forEach((x) => { t.line(s, x, Y0 + ph / 2, 0.3, 0, C.yellow, 2.25, { name: 'Cut mark' }); });
        t.line(s, X0, Y0 + ph / 2, 0, 0, C.yellow, 1);
        t.text(s, 'A', { x: X0, y: Y0 + ph / 2 - 0.34, w: 0.3, h: 0.3, fontFace: F.mono, bold: true, fontSize: 14, color: C.yellow, align: 'center', valign: 'middle' });
        t.text(s, 'A', { x: X0 + CW - 0.3, y: Y0 + ph / 2 - 0.34, w: 0.3, h: 0.3, fontFace: F.mono, bold: true, fontSize: 14, color: C.yellow, align: 'center', valign: 'middle' });
        t.text(s, d.text, { x: X0 + 0.4, y: Y0 + ph + 0.16, w: CW - 0.8, h: Y1 - Y0 - ph - 0.16, fontSize: L.fit(d.text, CW - 0.8, Y1 - Y0 - ph - 0.18, 14, 10, F.body, false, 1.1), color: C.text, lineSpacingMultiple: 1.1 });
      },
    ],
    cards: [
      async (d) => { // a bill of materials: a ruled table, a code and an icon to each row
        const s = page(d), n = d.items.length, h = (Y1 - Y0) / n;
        box(s, X0, Y0, CW, Y1 - Y0);
        t.line(s, X0 + 0.85, Y0, 0, Y1 - Y0, C.line, 0.5); t.line(s, X0 + 1.5, Y0, 0, Y1 - Y0, C.line, 0.5); t.line(s, X0 + 3.85, Y0, 0, Y1 - Y0, C.line, 0.5);
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + i * h;
          t.text(s, `A-${L.pad2(i + 1)}`, { x: X0 + 0.04, y, w: 0.78, h, fontFace: F.mono, fontSize: 11, bold: true, color: C.yellow, align: 'center', valign: 'middle' });
          t.img(s, await L.icon(it.icon, C.line, 1.5), X0 + 1.02, y + h / 2 - 0.16, 0.32, 0.32);
          head(s, it.h, X0 + 1.62, y + 0.05, 2.15, h - 0.1, { max: 15 });
          body(s, it.t, X0 + 3.98, y + 0.05, CW - 4.1, h - 0.1, { valign: 'middle', color: C.text, max: 13 });
          if (i < n - 1) t.line(s, X0, y + h, CW, 0, C.line, 0.5);
        }
      },
      async (d) => { // part sheets, two by two, dashed hidden lines between
        const s = page(d), n = d.items.length, gap = 0.3, w = (CW - gap) / 2, h = (Y1 - Y0 - gap) / 2;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, x = X0 + (i % 2) * (w + gap), y = Y0 + Math.floor(i / 2) * (h + gap), ww = wide ? CW : w;
          box(s, x, y, ww, h, { dash: i % 2 === 1 });
          t.img(s, await L.icon(it.icon, C.cyan, 1.5), x + 0.15, y + 0.12, 0.3, 0.3);
          head(s, it.h, x + 0.55, y + 0.08, ww - 1.45, 0.38, { max: 15 });
          t.text(s, `A-${L.pad2(i + 1)}`, { x: x + ww - 0.85, y: y + 0.08, w: 0.72, h: 0.38, fontFace: F.mono, fontSize: 11, bold: true, color: C.yellow, align: 'right', valign: 'middle' });
          body(s, it.t, x + 0.15, y + 0.5, ww - 0.3, h - 0.56, { color: C.text, max: 13 });
        }
      },
      async (d) => { // whiteprint: elevations at two heights, a dimension over each
        const s = whiteprint(d), n = d.items.length, gap = 0.2, w = (CW - gap * (n - 1)) / n, h = 2.85;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + gap), y = i % 2 ? 1.84 : 1.5;
          dimC(s, x, y - 0.1, w, 0, WP.rule);
          wpBox(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, WP.ink, 1.5), x + 0.16, y + 0.14, 0.32, 0.32);
          head(s, it.h, x + 0.16, y + 0.52, w - 0.32, 0.55, { max: 14, color: WP.ink, valign: 'top' });
          body(s, it.t, x + 0.16, y + 1.08, w - 0.32, h - 1.16, { color: WP.soft, max: 13 });
        }
      },
      async (d) => { // an assembly: a crosshair part in the middle, leaders run out to the callouts
        const s = page(d), n = d.items.length, cx = X0 + CW / 2, cy = (Y0 + Y1) / 2, r = 0.72, w = 3.3, hh = 1.5;
        crosshair(s, cx, cy, r);
        const spots = n === 4 ? [[X0, Y0], [X0 + CW - w, Y0], [X0, Y1 - hh], [X0 + CW - w, Y1 - hh]] : [[X0, Y0], [X0 + CW - w, cy - hh / 2], [X0, Y1 - hh]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right', lx = right ? x - 0.08 : x + w + 0.08, ly = y + 0.2, leftw = Math.abs(lx - cx);
          t.line(s, Math.min(lx, cx), ly, leftw, 0, C.cyan, 0.75, { name: 'Leader' });
          t.line(s, cx, Math.min(ly, cy), 0, Math.abs(ly - cy), C.cyan, 0.75, { name: 'Leader' });
          t.oval(s, lx - 0.04, ly - 0.04, 0.08, 0.08, C.cyan);
          t.img(s, await L.icon(it.icon, C.line, 1.5), right ? x : x + w - 0.28, y + 0.04, 0.28, 0.28);
          head(s, it.h, right ? x + 0.36 : x, y + 0.02, w - 0.36, 0.34, { align: a, max: 15 });
          body(s, it.t, x, y + 0.38, w, hh - 0.4, { align: a, color: C.text, max: 12 });
        }
      },
    ],
    process: [
      async (d) => { // a flow chart: blocks and arrows turning back on themselves
        const s = page(d), n = d.steps.length, gap = 0.55, w = (CW - gap) / 2, h = 1.34, vg = 0.42;
        const spot = (i) => (i < 2 ? [X0 + i * (w + gap), Y0] : [X0 + (n === 3 ? 0 : (3 - i) * (w + gap)), Y0 + h + vg]);
        d.steps.forEach((st, i) => {
          const [x, y] = spot(i), ww = n === 3 && i === 2 ? CW : w;
          box(s, x, y, ww, h, { color: i === n - 1 ? C.yellow : C.line });
          t.text(s, `S${i + 1}`, { x: x + 0.14, y: y + 0.08, w: 0.5, h: 0.34, fontFace: F.mono, bold: true, fontSize: 14, color: C.yellow, valign: 'middle' });
          head(s, st.h, x + 0.66, y + 0.08, ww - 0.8, 0.34, { max: 15 });
          body(s, st.t, x + 0.14, y + 0.46, ww - 0.28, h - 0.5, { color: C.text, max: 12 });
        });
        arrow(s, X0 + w + 0.07, Y0 + h / 2, gap - 0.14, 0, C.cyan);
        const dx = n === 4 ? X0 + w + gap + w / 2 : X0 + CW * 0.75;
        arrow(s, dx, Y0 + h + 0.08, 0, vg - 0.16, C.cyan);
        if (n === 4) arrow(s, X0 + w + 0.07, Y0 + h + vg + h / 2, gap - 0.14, 0, C.cyan, { flipH: true });
      },
      async (d) => { // a stair in section: treads and risers drawn in one line, the text on each tread
        const s = page(d), n = d.steps.length, w = CW / n, rise = n === 4 ? 0.28 : 0.42, top = Y0 + rise * (n - 1) + 0.04, bottom = 4.78;
        t.line(s, X0, bottom, CW, 0, C.line, 0.75, { dash: 'dashDot', name: 'Ground line' });
        d.steps.forEach((st, i) => {
          const x = X0 + i * w, y = top - i * rise;
          t.line(s, x, y, w, 0, C.line, 2, { name: 'Tread' });
          t.line(s, x, y, 0, i ? rise : bottom - y, C.line, 2, { name: 'Riser' });
          if (i === n - 1) t.line(s, x + w, y, 0, bottom - y, C.line, 2, { name: 'Riser' });
          t.text(s, `S${i + 1}`, { x: x + 0.12, y: y + 0.06, w: w - 0.2, h: 0.34, fontFace: F.mono, bold: true, fontSize: 15, color: C.yellow, valign: 'middle' });
          head(s, st.h, x + 0.12, y + 0.4, w - 0.24, 0.5, { max: 14, valign: 'top' });
          body(s, st.t, x + 0.12, y + 0.92, w - 0.24, Y1 - y - 0.95, { color: C.text, max: 12 });
        });
      },
      async (d) => { // a centre line down the sheet, gears on it, steps to left and right
        const s = page(d), n = d.steps.length, cx = X0 + CW / 2, w = 3.8, rh = (Y1 - Y0) / n, bh = Math.min(rh * 2 - 0.1, 1.5);
        t.line(s, cx, Y0 - 0.08, 0, Y1 - Y0 + 0.2, C.line, 0.75, { dash: 'dashDot', name: 'Centre line' });
        d.steps.forEach((st, i) => {
          const right = i % 2 === 1, y = Y0 + i * rh, x = right ? cx + 0.45 : cx - 0.45 - w, a = right ? 'left' : 'right', cy = y + 0.2;
          t.oval(s, cx - 0.2, cy - 0.2, 0.4, 0.4, C.bg, { line: { color: C.line, width: 1.25 }, name: 'Gear' });
          t.text(s, String(i + 1), { x: cx - 0.2, y: cy - 0.2, w: 0.4, h: 0.4, fontFace: F.mono, bold: true, fontSize: 12, color: C.yellow, align: 'center', valign: 'middle' });
          t.line(s, right ? cx + 0.2 : x + w + 0.05, cy, 0.2, 0, C.cyan, 0.75);
          head(s, st.h, x, y, w, 0.34, { align: a, max: 16 });
          body(s, st.t, x, y + 0.35, w, Math.min(bh - 0.37, 4.76 - (Y0 + (n - 1) * rh + 0.35)), { align: a, color: C.text, max: 12 });
        });
      },
      async (d) => { // whiteprint: hexagon bolts on one line, the step under each
        const s = whiteprint(d), n = d.steps.length, cw = CW / n, ly = 1.92, dd = 0.82;
        t.line(s, X0, ly, CW, 0, WP.ink, 0.75, { dash: 'dashDot', name: 'Centre line' });
        d.steps.forEach((st, i) => {
          const cx = X0 + i * cw + cw / 2;
          t.shape(s, 'HEXAGON', { x: cx - dd / 2, y: ly - dd * 0.44, w: dd, h: dd * 0.88, fill: { color: i === n - 1 ? WP.ink : WP.bg }, line: { color: WP.ink, width: 1.25 }, objectName: 'Bolt' });
          t.text(s, `S${i + 1}`, { x: cx - dd / 2, y: ly - dd * 0.44, w: dd, h: dd * 0.88, fontFace: F.mono, bold: true, fontSize: 15, color: i === n - 1 ? 'FFFFFF' : WP.ink, align: 'center', valign: 'middle' });
          t.line(s, cx, ly + dd * 0.44, 0, 0.12, WP.ink, 0.75);
          head(s, st.h, cx - cw / 2 + 0.1, 2.5, cw - 0.2, 0.5, { max: 15, color: WP.ink, align: 'center' });
          body(s, st.t, cx - cw / 2 + 0.1, 3.02, cw - 0.2, Y1 - 3.02, { color: WP.soft, align: 'center', max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // one figure at the crosshair, the others called out with leaders
        const s = page(d), [a, ...rest] = d.stats, r = d.note ? 1.05 : 1.35, cx = X0 + r + 0.15, cy = Y0 + r + 0.15;
        t.oval(s, cx - r, cy - r, 2 * r, 2 * r, null, { line: { color: C.line, width: 1.25 }, name: 'Ring' });
        t.oval(s, cx - r * 0.88, cy - r * 0.88, 1.76 * r, 1.76 * r, null, { line: { color: C.cyan, width: 0.75, dashType: 'dash' }, name: 'Ring' });
        t.line(s, cx - r - 0.12, cy, 2 * r + 0.24, 0, C.line, 0.5, { dash: 'dashDot' }); t.line(s, cx, cy - r - 0.12, 0, 2 * r + 0.24, C.line, 0.5, { dash: 'dashDot' });
        t.rect(s, cx - r * 0.78, cy - r * 0.32, r * 1.56, r * 0.64, C.bg, { name: 'Ground' });
        t.text(s, a.value, { x: cx - r * 0.76, y: cy - r * 0.32, w: r * 1.52, h: r * 0.64, fontFace: F.mono, bold: true, color: C.yellow, align: 'center', valign: 'middle', fontSize: L.fit(a.value, r * 1.48, r * 0.6, 38, 16, F.mono, true) });
        const lx = X0 + 2 * r + 0.55;
        body(s, a.label, lx, Y0, 9.4 - lx, 0.68, { color: C.text, max: 15 });
        t.line(s, cx + r * 0.7, Y0 + 0.34, lx - cx - r * 0.7 - 0.06, 0, C.cyan, 0.75, { name: 'Leader' });
        rest.forEach((x, i) => {
          const y = Y0 + 0.78 + i * 0.86;
          t.line(s, lx, y, 9.4 - lx, 0, C.line, 0.5, { dash: 'dash' });
          t.text(s, x.value, { x: lx, y: y + 0.05, w: 2.2, h: 0.72, fontFace: F.mono, bold: true, color: C.yellow, valign: 'middle', fontSize: L.fit(x.value, 2.15, 0.68, 28, 15, F.mono, true) });
          body(s, x.label, lx + 2.3, y + 0.05, 9.4 - lx - 2.3, 0.72, { color: C.text, valign: 'middle', max: 13 });
        });
        if (d.note) body(s, d.note, X0, Y0 + 2.4, 5.65, 4.98 - Y0 - 2.4, { font: F.mono, color: C.cyan, max: 11 });
      },
      async (d) => { // whiteprint: a specification table, the figure big in its own column
        const s = whiteprint(d), rh = d.note ? 0.82 : 1.08, h = 3 * rh;
        wpBox(s, X0, Y0 + 0.05, CW, h);
        t.line(s, X0 + 3.1, Y0 + 0.05, 0, h, WP.ink, 0.75);
        d.stats.forEach((x, i) => {
          const y = Y0 + 0.05 + i * rh;
          t.text(s, x.value, { x: X0 + 0.15, y, w: 2.8, h: rh, fontFace: F.mono, bold: true, color: WP.ink, valign: 'middle', align: 'center', fontSize: L.fit(x.value, 2.75, rh - 0.1, 34, 16, F.mono, true) });
          body(s, x.label, X0 + 3.3, y + 0.04, CW - 3.45, rh - 0.08, { color: WP.ink, valign: 'middle', max: 15 });
          if (i < 2) t.line(s, X0, y + rh, CW, 0, WP.ink, 0.75);
        });
        if (d.note) body(s, d.note, X0, Y0 + h + 0.14, CW, Y1 + 0.1 - Y0 - h - 0.14, { font: F.mono, color: WP.soft, max: 11 });
      },
    ],
    compare: [
      async (d) => { // two halves mirrored about the centre line, a dimension over each
        const s = page(d), w = 3.95, cx = X0 + CW / 2, avail = Y1 - 2.05;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.16, avail);
        t.line(s, cx, Y0 - 0.1, 0, Y1 - Y0 + 0.2, C.line, 0.75, { dash: 'dashDot', name: 'Centre line' });
        dim(s, X0, 1.92, w); dim(s, cx + 0.45, 1.92, w);
        head(s, d.left.h, X0, Y0 + 0.02, w, 0.45, { font: F.mono, align: 'right', max: 17 }); head(s, d.right.h, cx + 0.45, Y0 + 0.02, w, 0.45, { font: F.mono, color: C.cyan, max: 17 });
        let y = 2.05;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: X0, y, w, h: rows[k], fontSize: fs, color: C.text, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: cx + 0.45, y, w, h: rows[k], fontSize: fs, color: C.text });
          t.oval(s, cx - 0.05, y + 0.05, 0.1, 0.1, C.yellow);
          y += Math.max(rows[k], Math.min(0.7, avail / rows.length));
        }
      },
      async (d) => { // whiteprint: a plan above, the same shape in solid ink below
        const s = whiteprint(d), h = (Y1 - Y0 - 0.14) / 2;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = Y0 + i * (h + 0.14), solid = i === 1, ink = solid ? 'FFFFFF' : WP.ink, n = side.items.length, rh = (h - 0.14) / n;
          t.rect(s, X0, y, CW, h, solid ? WP.ink : WP.bg, { line: { color: WP.ink, width: 0.75 }, name: 'Band' });
          inkTicks(s, X0 - 0.06, y - 0.06, CW + 0.12, h + 0.12, WP.ink);
          head(s, side.h, X0 + 0.15, y + 0.08, 2.3, h - 0.16, { font: F.mono, color: ink, max: 15 });
          t.line(s, X0 + 2.6, y + 0.12, 0, h - 0.24, solid ? 'FFFFFF' : WP.ink, 0.75);
          side.items.forEach((it, k) => {
            t.text(s, i ? '+' : '–', { x: X0 + 2.72, y: y + 0.07 + k * rh, w: 0.22, h: rh - 0.02, fontFace: F.mono, bold: true, fontSize: 13, color: ink, valign: 'middle' });
            body(s, it, X0 + 2.98, y + 0.07 + k * rh, CW - 3.1, rh - 0.02, { color: ink, valign: 'middle', max: 13 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the thought in a part's outline, measured on two sides, a note hanging beneath
        const s = page(d), x = 1.05, y = 1.72, w = 8.35, h = d.caption ? 1.72 : 2.9;
        dimC(s, x, 1.55, w, 0, C.cyan); dimC(s, 0.75, y, 0, h, C.cyan);
        t.line(s, 0.62, y, x - 0.62, 0, C.line, 0.5); t.line(s, 0.62, y + h, x - 0.62, 0, C.line, 0.5);
        box(s, x, y, w, h);
        t.text(s, L.runs(d.text), { x: x + 0.25, y: y + 0.06, w: w - 0.5, h: h - 0.12, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.text, w - 0.5, h - 0.18, 34, 18, F.head, true) });
        if (d.caption) t.text(s, d.caption, { x, y: y + h + 0.12, w: w, h: Y1 + 0.08 - y - h - 0.12, fontFace: F.mono, fontSize: L.fit(d.caption, w, Y1 + 0.08 - y - h - 0.12, 13, 10, F.mono), color: C.cyan });
      },
      async (d) => { // whiteprint: the thought large, the note set in the block of a drawing's notes
        const s = whiteprint(d);
        t.text(s, L.runs(d.text), { x: X0, y: Y0, w: 5.4, h: 3.5, bold: true, color: WP.ink, valign: 'middle', fontSize: L.fit(d.text, 5.4, 3.45, 34, 18, F.head, true) });
        wpBox(s, 6.3, Y0 + 0.1, 3.1, Y1 - Y0 - 0.1);
        t.rect(s, 6.3, Y0 + 0.1, 3.1, 0.3, WP.ink, { name: 'Notes head' });
        t.line(s, 6.3, Y0 + 0.4, 3.1, 0, WP.ink, 0.75);
        t.oval(s, 6.42, Y0 + 0.18, 0.14, 0.14, 'FFFFFF');
        if (d.caption) t.text(s, d.caption, { x: 6.45, y: Y0 + 0.5, w: 2.8, h: Y1 - Y0 - 0.58, fontFace: F.mono, fontSize: L.fit(d.caption, 2.8, Y1 - Y0 - 0.58, 12, 10, F.mono), color: WP.soft });
      },
    ],
    timeline: [
      async (d) => { // a scale stood upright, its marks at the dates
        const s = page(d), n = d.items.length, rh = (Y1 - Y0) / n, lx = 2.2;
        t.line(s, lx, Y0, 0, Y1 - Y0, C.line, 1.25, { name: 'Scale' });
        for (let k = 0; k <= 4 * n; k++) t.line(s, lx - (k % 4 ? 0.06 : 0.14), Y0 + ((Y1 - Y0) * k) / (4 * n), k % 4 ? 0.12 : 0.28, 0, C.line, 0.75);
        d.items.forEach((it, i) => {
          const y = Y0 + i * rh;
          t.text(s, it.year, { x: X0, y: y + 0.03, w: 1.4, h: 0.42, fontFace: F.mono, bold: true, color: C.yellow, align: 'right', valign: 'middle', fontSize: L.fit(it.year, 1.4, 0.4, 18, 10, F.mono, true) });
          head(s, it.h, lx + 0.32, y + 0.03, 6.85, 0.32, { max: 15 });
          body(s, it.t, lx + 0.32, y + 0.36, 6.85, rh - 0.4, { color: C.text, max: 13 });
        });
      },
      async (d) => { // whiteprint: a long dimension across the sheet, events above and below it by turns
        const s = whiteprint(d), ly = (Y0 + Y1) / 2 + 0.04, w = 3.85, xs = [X0, X0 + 0.95, 5.3, 5.55], cell = 1.46;
        dimC(s, X0, ly, CW, 0, WP.ink);
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], y = up ? ly - 0.12 - cell : ly + 0.12;
          t.line(s, x, up ? y + 0.02 : ly, 0, up ? ly - y - 0.02 : 0.12 + cell, WP.rule, 0.75, { name: 'Witness line' });
          t.text(s, [{ text: it.year + '  ', options: { color: WP.ink, bold: true } }, { text: it.h, options: { color: WP.soft, bold: true } }], { x: x + 0.1, y, w: w - 0.1, h: 0.36, fontFace: F.mono, fontSize: L.fit(`${it.year}  ${it.h}`, w - 0.1, 0.34, 14, 10, F.mono, true), valign: 'middle' });
          body(s, it.t, x + 0.1, y + 0.36, w - 0.1, cell - 0.38, { color: WP.ink, max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old process (outlined boxes in a row) read like the cards page
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (_t, _s, d) => ({ x: 0.6, y: 5.0, w: 5.6, h: 0.3, color: d._wp ? WP.soft : C.muted, fontFace: 'Courier New' }));
  return L.save(pres, out, { name: 'SlideAI Blueprint', colors: { dk1: C.bg, lt1: C.text, dk2: '123A6E', lt2: C.muted, accent1: C.cyan, accent2: C.yellow, accent3: C.line, accent4: '5D8FCB', accent5: C.muted, accent6: '2E64A8', hlink: C.cyan, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "muhandislik-texnik: aniq, bosqichma-bosqich, atamalar bilan", "limits": {}, "prefer": "data"};
module.exports = { id: 13, slug: 'blueprint', name: 'Çizma', category: 'academic', build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical"], "transitions": ["wipe:r", "p14:pan|dir=\"u\"", "morph"], "cover": ["typeLetters", "sweepIn"], "mark": "appear", "deco": "wipe:r", "sig": {"title": "sweepIn", "body": "wipeWords", "item": "box", "image": "wipe:r", "number": "appear", "order": "seq", "stagger": 0.18}, "tempo": 1.1, "kenburns": false};
