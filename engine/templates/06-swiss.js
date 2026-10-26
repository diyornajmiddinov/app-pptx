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
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => (type === 'cover' || type === 'closing' ? { x: 0.6, y: 5.3, w: 8.8, h: 0.2, color: type === 'closing' ? 'BBBBBB' : C.gray } : type === 'quote' ? { x: 0.6, y: 5.15, w: 8.8, h: 0.25, color: 'FFFFFF' } : { x: CX, y: 5.15, w: CW, h: 0.25, color: C.gray }));
  return L.save(pres, out, { name: 'SlideAI Swiss', colors: { dk1: C.ink, lt1: C.bg, dk2: '333333', lt2: 'F2F2F2', accent1: C.red, accent2: C.ink, accent3: C.gray, accent4: '9B0A12', accent5: 'B3B3B3', accent6: C.light, hlink: C.red, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "minimal: imkon qadar qisqa, bitta so'z ham ortiqcha bo'lmasin", "limits": {"card_t3": 70, "card_t4": 60, "stmt": 60}};
module.exports = { id: 6, slug: 'swiss', name: 'Shveytsar', category: 'minimalist', build, style: STYLE };
