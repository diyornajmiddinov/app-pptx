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
    t.text(s, L.clip((content.meta && content.meta.topic) || content.slides[0].title, 1.65, 0.48, 8, F.mono), { x: 6.5, y: 4.85, w: 1.65, h: 0.48, fontFace: F.mono, fontSize: 8, color: C.muted, valign: 'middle', noShrink: true });
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
    // the title ends before the crosshair's horizontal line (it starts at x = 5.66)
    const fs = L.fit(d.title, 4.9, 2.4, 44, 26, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 4.9, h: 2.5, fontFace: F.head, bold: true, fontSize: fs, color: C.text, valign: 'bottom' });
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
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.2, w: 5.6, h: 0.6, fontFace: F.mono, fontSize: 12, color: C.cyan });
    },
    async compare(d) {
      const s = page(d), w = 4.2, h = 3.15, y = 1.5;
      const cfs = L.colSize(d, w - 0.85, h - 0.85 - 0.1, 0.16, F.body); // items shrink to fit the panel
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w - 0.85, F.body) : 0))));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4);
        box(s, x, y, w, h, { color: i ? C.cyan : C.line });
        t.text(s, side.h, { x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.45, fontFace: F.mono, fontSize: 17, bold: true, color: i ? C.cyan : C.text });
        let yy = y + 0.85;
        side.items.forEach((it, k) => {
          t.text(s, i ? '+' : '\u2013', { x: x + 0.3, y: yy, w: 0.3, h: 0.3, fontFace: F.mono, fontSize: 15, bold: true, color: i ? C.cyan : C.muted });
          t.text(s, it, { x: x + 0.6, y: yy, w: w - 0.85, h: rows[k] + 0.05, fontSize: cfs, color: C.text });
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
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, () => ({ x: 0.6, y: 5.0, w: 5.6, h: 0.3, color: C.muted, fontFace: 'Courier New' }));
  return L.save(pres, out, { name: 'SlideAI Blueprint', colors: { dk1: C.bg, lt1: C.text, dk2: '123A6E', lt2: C.muted, accent1: C.cyan, accent2: C.yellow, accent3: C.line, accent4: '5D8FCB', accent5: C.muted, accent6: '2E64A8', hlink: C.cyan, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "muhandislik-texnik: aniq, bosqichma-bosqich, atamalar bilan", "limits": {}, "prefer": "data"};
module.exports = { id: 13, slug: 'blueprint', name: 'Chizma', category: 'academic', build, style: STYLE };
