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
      const cfs = L.colSize(d, w - 0.95, h - 1.0 - 0.1, 0.2, F.body); // items shrink to fit the panel
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w - 0.95, F.body) : 0))));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), col = i ? C.ink : C.white;
        if (i) t.rect(s, x, y, w, h, C.bg, { line: { color: C.ink, width: 3 }, name: 'Panel' });
        else t.rect(s, x, y, w, h, C.blue, { name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.5, fontSize: 21, bold: true, color: col });
        let yy = y + 1.0;
        side.items.forEach((it, k) => {
          mark(s, k % 3, x + 0.35, yy + 0.06, 0.15, i ? [C.red, C.blue, C.yellow][k % 3] : C.yellow);
          t.text(s, it, { x: x + 0.65, y: yy, w: w - 0.95, h: rows[k] + 0.05, fontSize: cfs, color: col });
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
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => (type === 'cover' || type === 'closing' ? { x: 0.6, y: 5.2, w: 4.2, h: 0.25, color: C.muted } : { x: 0.6, y: 5.15, w: 8.0, h: 0.25, color: type === 'quote' ? C.ink : C.muted }));
  return L.save(pres, out, { name: 'SlideAI Bauhaus', colors: { dk1: C.ink, lt1: C.white, dk2: '333333', lt2: C.bg, accent1: C.red, accent2: C.blue, accent3: C.yellow, accent4: C.ink, accent5: C.muted, accent6: 'D9D2C3', hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "dadil va sodda: qisqa, aniq gaplar", "limits": {"card_t4": 60}};
module.exports = { id: 11, slug: 'bauhaus', name: 'Bauhaus', category: 'creative', build, style: STYLE };
