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
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w, F.body) : 0))) + 0.25);
      t.rect(s, X + w + 0.37, 1.7, 0.06, 3.1, C.sand, { name: 'Divider' });
      [d.left, d.right].forEach((side, i) => {
        const x = X + i * (w + 0.8);
        t.text(s, side.h, { x, y: 1.6, w, h: 0.5, fontFace: F.head, italic: true, fontSize: 22, color: i ? C.indigo : C.ink });
        let y = 2.3;
        side.items.forEach((it, k) => { t.text(s, it, { x, y, w, h: rows[k], fontSize: 15, color: C.ink }); y += rows[k]; });
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
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => (type === 'cover' || type === 'closing' || type === 'quote' ? { x: 1.3, y: 5.15, w: 8.1, h: 0.25, color: C.stone } : { x: 1.3, y: 5.15, w: 7.6, h: 0.25, color: C.stone }));
  return L.save(pres, out, { name: 'SlideAI Zen', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '44403A', lt2: C.bg, accent1: C.indigo, accent2: C.stone, accent3: C.sand, accent4: '6C84AE', accent5: 'B5AC9B', accent6: 'EAE3D6', hlink: C.indigo, folHlink: C.stone } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "sokin va minimal: har bir gapda bitta fikr", "limits": {"stmt": 60, "quote": 110}};
module.exports = { id: 17, slug: 'zen', name: 'Zen', category: 'minimalist', build, style: STYLE };
