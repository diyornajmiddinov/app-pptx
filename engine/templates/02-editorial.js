/**
 * 02 Editorial — magazine layout: big serif headlines, hairline rules, running header,
 * one red accent, no boxes.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', ink: '141414', muted: '5E5E5E', red: 'C8102E', hair: 'D6D6D6' };
const F = { head: 'Cambria', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const deckTitle = content.slides[0].title;

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.text(s, deckTitle, { x: 0.6, y: 0.2, w: 7.0, h: 0.22, fontSize: 10, color: C.muted });
    s.slideNumber = { x: 8.9, y: 0.2, w: 0.5, h: 0.22, fontFace: F.body, fontSize: 10, color: C.muted, align: 'right' };
    t.line(s, 0.6, 0.48, 8.8, 0, C.ink, 1.5, { name: 'Running rule' });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.66, w: 8.8, h: 0.8, fontFace: F.head, bold: true, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.8, 32, 22, F.head, true) });
    return s;
  };
  const vrule = (s, x, y, h) => t.line(s, x, y, 0, h, C.hair, 0.75, { name: 'Column rule' });

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.bg };
      t.rect(s, 0.6, 0.5, 0.22, 0.22, C.red, { name: 'Mark' });
      t.line(s, 0.95, 0.61, 8.45, 0, C.ink, 2.5, { name: 'Masthead rule' });
      const TW = d.image ? 5.5 : 8.8, fs = L.fit(d.title, TW, 2.7, 66, 36, F.head, true, 0.92), th = L.height(d.title, fs, TW, F.head, true, 0.92);
      t.text(s, d.title, { x: 0.6, y: 3.95 - th, w: TW, h: th + 0.05, fontFace: F.head, bold: true, fontSize: fs, lineSpacingMultiple: 0.92 });
      t.line(s, 0.6, 4.18, 8.8, 0, C.ink, 0.75, { name: 'Rule' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 4.35, w: 7.0, h: 0.9, fontFace: F.head, italic: true, fontSize: 18, color: C.muted });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.55, y = 1.75 + (i % per) * rh;
        t.text(s, L.pad2(i + 1), { x, y, w: 0.75, h: rh - 0.15, fontFace: F.head, fontSize: 26, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y, w: 3.35, h: rh - 0.15, fontFace: F.head, fontSize: 19, valign: 'middle' });
        t.line(s, x, y + rh - 0.08, 4.25, 0, C.hair, 0.75);
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, cw - 0.5, 0.75, 21, 14, F.head, true)));
      const hh = Math.max(...d.items.map((it) => L.height(it.h, hfs, cw - 0.5, F.head, true)));
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw + (i ? 0.25 : 0), w = cw - (i ? 0.5 : 0.25);
        if (i) vrule(s, 0.6 + i * cw, 1.75, 3.2);
        t.text(s, L.ROMAN[i] + '.', { x, y: 1.75, w, h: 0.45, fontFace: F.head, fontSize: 20, bold: true, color: C.red });
        t.text(s, it.h, { x, y: 2.3, w, h: hh + 0.05, fontFace: F.head, fontSize: hfs, bold: true });
        t.text(s, it.t, { x, y: 2.4 + hh, w, h: 2.4, fontSize: 14, color: C.muted, lineSpacingMultiple: 1.1 });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.35, 0.75, 20, 14, F.head, true)));
      const hh = Math.max(...d.steps.map((st) => L.height(st.h, hfs, cw - 0.35, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw, w = cw - 0.35;
        t.line(s, x, 1.8, w, 0, C.ink, 2.5, { name: 'Step rule' });
        t.text(s, L.pad2(i + 1), { x, y: 1.98, w, h: 0.4, fontFace: F.head, fontSize: 16, bold: true, color: C.red });
        t.text(s, st.h, { x, y: 2.45, w, h: hh + 0.05, fontFace: F.head, fontSize: hfs, bold: true });
        t.text(s, st.t, { x, y: 2.6 + hh, w, h: 2.2, fontSize: 14, color: C.muted, lineSpacingMultiple: 1.1 });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.5, 1.1, 64, 32, F.head, true)));
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw + (i ? 0.3 : 0), w = cw - (i ? 0.6 : 0.3);
        if (i) vrule(s, 0.6 + i * cw, 1.85, 2.7);
        t.text(s, x.value, { x: px, y: 1.8, w, h: 1.15, fontFace: F.head, fontSize: vfs, bold: true, valign: 'bottom' });
        t.rect(s, px, 3.1, 0.5, 0.05, C.red, { name: 'Accent' });
        t.text(s, x.label, { x: px, y: 3.3, w, h: 1.0, fontSize: 14, color: C.muted });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.65, w: 8.8, h: 0.45, fontFace: F.head, italic: true, fontSize: 14, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.1;
      const cfs = L.colSize(d, w, 4.95 - 2.3, 0.3, F.body); // items shrink to fit the panel
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w, F.body) : 0))) + 0.3);
      vrule(s, 5.0, 1.75, 3.3);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.3 : 0.6;
        t.text(s, side.h, { x, y: 1.7, w, h: 0.5, fontFace: F.head, fontSize: 22, bold: true, color: i ? C.red : C.ink });
        let y = 2.3;
        side.items.forEach((it, k) => {
          t.line(s, x, y, w, 0, C.hair, 0.75);
          t.text(s, it, { x, y: y + 0.15, w, h: rows[k] - 0.2, fontSize: cfs });
          y += rows[k];
        });
      });
    },
    async statement(d) {
      const s = page({});
      const fs = L.fit(d.text, 8.0, 1.6, 40, 24, F.head, false, 1, true), th = L.height(d.text, fs, 8.0, F.head, false, 1, true);
      const ch = d.caption ? L.height(d.caption, 15, 6.6, F.body) : 0, y = 0.48 + (H - 0.48 - (0.55 + th + 0.35 + ch)) / 2;
      t.rect(s, W / 2 - 0.11, y, 0.22, 0.22, C.red, { name: 'Mark' });
      t.text(s, L.runs(d.text), { x: 1.0, y: y + 0.5, w: 8.0, h: th + 0.05, fontFace: F.head, italic: true, fontSize: fs, align: 'center' });
      if (d.caption) t.text(s, d.caption, { x: 1.7, y: y + 0.85 + th, w: 6.6, h: ch + 0.05, fontSize: 15, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.35 / n;
      d.items.forEach((it, i) => {
        const y = 1.7 + i * rh;
        t.line(s, 0.6, y, 8.8, 0, i ? C.hair : C.ink, i ? 0.75 : 1.5);
        t.text(s, it.year, { x: 0.6, y: y + 0.1, w: 1.8, h: rh - 0.2, fontFace: F.head, fontSize: L.fit(it.year, 1.7, 0.6, 28, 16, F.head, true), bold: true, color: C.red, valign: 'middle' });
        t.text(s, it.h, { x: 2.6, y: y + 0.1, w: 2.3, h: rh - 0.2, fontFace: F.head, fontSize: 18, bold: true, valign: 'middle' });
        t.text(s, it.t, { x: 5.0, y: y + 0.1, w: 4.4, h: rh - 0.2, fontSize: 14, color: C.muted, valign: 'middle' });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.bg };
      const fs = L.fit(d.text, 7.2, 2.4, 40, 22, F.head, false, 1.05, true), th = L.height(d.text, fs, 7.2, F.head, false, 1.05, true);
      const y = (H - th - 0.8) / 2;
      t.text(s, '\u201C', { x: 0.55, y: y - 0.35, w: 1.5, h: 1.9, fontFace: F.head, fontSize: 170, bold: true, color: C.red });
      t.text(s, d.text, { x: 2.1, y, w: 7.2, h: th + 0.05, fontFace: F.head, italic: true, fontSize: fs, lineSpacingMultiple: 1.05 });
      t.rect(s, 2.1, y + th + 0.35, 0.4, 0.04, C.red, { name: 'Accent' });
      if (d.author) t.text(s, d.author, { x: 2.65, y: y + th + 0.22, w: 6.5, h: 0.3, fontSize: 14, color: C.muted });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.ink };
      t.line(s, 0.6, 0.61, 8.8, 0, 'FFFFFF', 2.5, { name: 'Masthead rule' });
      const fs = L.fit(d.title, 8.8, 2.0, 56, 32, F.head, true, 0.95), th = L.height(d.title, fs, 8.8, F.head, true, 0.95);
      t.text(s, d.title, { x: 0.6, y: 3.6 - th, w: 8.8, h: th + 0.05, fontFace: F.head, bold: true, fontSize: fs, color: 'FFFFFF', lineSpacingMultiple: 0.95 });
      t.rect(s, 0.6, 3.85, 0.22, 0.22, C.red, { name: 'Mark' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 1.05, y: 3.8, w: 7.5, h: 1.0, fontFace: F.head, italic: true, fontSize: 18, color: 'BDBDBD' });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, 0.6, 1.7, 3.9, 3.2);
      t.text(s, d.text, { x: 4.85, y: 1.7, w: 4.55, h: 3.2, fontSize: L.fit(d.text, 4.55, 3.2, 15, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'top' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: 0.6, y: 1.7, w: 4.1, h: 3.2, fontSize: L.fit(d.text, 4.1, 3.2, 15, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3 });
      await PH(s, d.image, 5.0, 1.7, 4.4, 3.2);
      t.rect(s, 5.0, 4.98, 0.5, 0.05, C.red, { name: 'Accent' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.55, 3.3 / n);
      d.items.forEach((it, i) => {
        const y = 1.7 + i * rh;
        t.text(s, L.pad2(i + 1), { x: 0.6, y, w: 0.6, h: rh, fontFace: F.head, fontSize: 16, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 8.15, h: rh, fontSize: L.fit(it, 8.15, rh - 0.04, 14, 10, F.body), valign: 'middle' });
        t.line(s, 1.25, y + rh, 8.15, 0, C.hair, 0.5);
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 6.4, 0.95, 3.0, 3.0); },
  });
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => ({ x: 0.6, y: 5.25, w: 8.8, h: 0.22, color: type === 'closing' ? 'BDBDBD' : C.muted }));
  return L.save(pres, out, { name: 'SlideAI Editorial', colors: { dk1: C.ink, lt1: C.bg, dk2: '333333', lt2: 'F2F2F2', accent1: C.red, accent2: C.ink, accent3: C.muted, accent4: '8C1A2B', accent5: 'B3B3B3', accent6: C.hair, hlink: C.red, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "jurnalistik: qiziqarli sarlavhalar, tahliliy va ravon matn", "limits": {}, "prefer": "text"};
module.exports = { id: 2, slug: 'editorial', name: 'Editorial', category: 'academic', build, style: STYLE };
