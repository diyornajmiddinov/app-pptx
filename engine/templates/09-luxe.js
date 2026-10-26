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
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.35, F.body) : 0))));
      t.line(s, W / 2, 1.8, 0, 3.0, C.gold, 0.75);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.4 : 0.7;
        t.text(s, side.h, { x, y: 1.75, w, h: 0.5, fontFace: F.head, italic: true, fontSize: 24, color: i ? C.gold : C.champ });
        let y = 2.5;
        side.items.forEach((it, k) => {
          dia(s, x, y + 0.07, 0.11);
          t.text(s, it, { x: x + 0.3, y, w: w - 0.35, h: rows[k] + 0.05, fontSize: 15, color: C.white });
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
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => (type === 'cover' || type === 'closing' ? { x: 0.6, y: 5.33, w: 8.8, h: 0.2, color: C.gray, align: 'center' } : { x: 1.0, y: 5.08, w: 7.6, h: 0.3, color: C.gray, align: 'center' }));
  return L.save(pres, out, { name: 'SlideAI Luxe', colors: { dk1: C.bg, lt1: C.white, dk2: '1C1B1A', lt2: C.champ, accent1: C.gold, accent2: C.champ, accent3: C.gray, accent4: '8C6F3A', accent5: C.line, accent6: 'D9C08A', hlink: C.gold, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "nafis, premium ohang: kam so'z, salmoqli iboralar", "limits": {"stmt": 60}};
module.exports = { id: 9, slug: 'luxe', name: 'Lyuks', category: 'business', build, style: STYLE };
