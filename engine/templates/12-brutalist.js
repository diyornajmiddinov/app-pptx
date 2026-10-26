/**
 * 12 Brutalist — neo-brutalism: loud yellow, thick black outlines, hard offset shadows,
 * sticker-like boxes, Courier New labels.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFE45C', ink: '000000', pink: 'FF6FB5', cyan: '5CE1E6', white: 'FFFFFF', gray: '333333' };
const F = { head: 'Arial', body: 'Arial', mono: 'Courier New' };

async function build(content, out) {
  const pres = L.deck({ head: F.head, body: F.body }, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  let idx = 0;
  const hard = (s, x, y, w, h, fill, off = 0.09) => {
    t.rect(s, x + off, y + off, w, h, C.ink, { name: 'Hard shadow' });
    t.rect(s, x, y, w, h, fill, { line: { color: C.ink, width: 2.5 }, name: 'Box' });
  };
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    const fs = L.fit(d.title, 7.4, 0.62, 26, 16, F.head, true), tw = Math.min(7.6, L.width(d.title, fs, F.head, true) + 0.5);
    hard(s, 0.6, 0.4, tw, 0.75, C.white);
    t.text(s, d.title, { x: 0.85, y: 0.4, w: tw - 0.4, h: 0.75, fontSize: fs, bold: true, valign: 'middle' });
    t.rect(s, 8.7, 0.45, 0.7, 0.62, C.ink, { name: 'Page' });
    t.text(s, L.pad2(idx), { x: 8.7, y: 0.45, w: 0.7, h: 0.62, fontFace: F.mono, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
    return s;
  };
  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: kind === 'cover' ? C.bg : C.pink }; idx++;
    const TW = d.image ? 5.6 : 8.6, fs = L.fit(d.title, TW, 2.6, 58, 30, F.head, true, 0.92);
    t.text(s, d.title, { x: 0.6, y: 0.5, w: TW, h: 2.75, fontSize: fs, bold: true, valign: 'bottom', lineSpacingMultiple: 0.92 });
    if (d.subtitle) {
      const sh = L.height(d.subtitle, 16, 5.4, F.body);
      hard(s, 0.6, 3.6, 5.9, sh + 0.45, kind === 'cover' ? C.pink : C.white);
      t.text(s, d.subtitle, { x: 0.85, y: 3.6, w: 5.4, h: sh + 0.45, fontSize: 16, bold: true, valign: 'middle' });
    }
    hard(s, 7.6, 3.55, 1.5, 1.5, C.cyan);
    t.img(s, await L.icon(kind === 'cover' ? 'FiArrowDownRight' : 'FiCheck', C.ink, 2.5), 7.95, 3.9, 0.8, 0.8);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.12, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.55 + (i % per) * rh;
        hard(s, x, y, 4.15, rh - 0.3, C.white, 0.07);
        t.rect(s, x, y, 0.75, rh - 0.3, C.ink, { name: 'Number' });
        t.text(s, L.pad2(i + 1), { x, y, w: 0.75, h: rh - 0.3, fontFace: F.mono, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.95, y, w: 3.05, h: rh - 0.3, fontSize: 17, bold: true, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.7 - gap * (n - 1)) / n, fills = [C.white, C.pink, C.cyan, C.white];
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.5, 0.45, 19, 13, F.head, true)));
      const h = Math.min(3.4, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        hard(s, x, 1.6, w, h, fills[i % 4]);
        t.img(s, await L.icon(it.icon, C.ink, 2.5), x + 0.25, 1.85, 0.42, 0.42);
        t.text(s, it.h, { x: x + 0.25, y: 2.45, w: w - 0.5, h: 0.45, fontSize: hfs, bold: true });
        t.text(s, it.t, { x: x + 0.25, y: 2.95, w: w - 0.5, h: h - 1.5, fontSize: 14, color: C.gray });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.45, w = (8.7 - gap * (n - 1)) / n, h = 3.0;
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, w - 0.4, 0.45, 18, 12, F.head, true)));
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * (w + gap);
        hard(s, x, 1.65, w, h, i === n - 1 ? C.pink : C.white);
        t.text(s, L.pad2(i + 1), { x: x + 0.2, y: 1.8, w: w - 0.4, h: 0.6, fontFace: F.mono, fontSize: 30, bold: true });
        t.text(s, st.h, { x: x + 0.2, y: 2.5, w: w - 0.4, h: 0.45, fontSize: hfs, bold: true });
        t.text(s, st.t, { x: x + 0.2, y: 3.0, w: w - 0.4, h: 1.55, fontSize: 14, color: C.gray });
        if (i < n - 1) t.img(s, await L.icon('FiArrowRight', C.ink, 3), x + w + 0.06, 3.0, 0.32, 0.32);
      }
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.35, w = (8.7 - gap * (n - 1)) / n, fills = [C.pink, C.cyan, C.white];
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * (w + gap);
        hard(s, px, 1.65, w, 2.5, fills[i % 3]);
        t.text(s, x.value, { x: px + 0.3, y: 1.85, w: w - 0.6, h: 1.05, fontSize: L.fit(x.value, w - 0.6, 1.0, 54, 28, F.head, true), bold: true, valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.3, y: 3.0, w: w - 0.6, h: 1.0, fontFace: F.mono, fontSize: 14, bold: true });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.45, w: 8.7, h: 0.55, fontFace: F.mono, fontSize: 13 });
    },
    async compare(d) {
      const s = page(d), w = 4.15, h = 3.35, y = 1.6;
      const cfs = L.colSize(d, w - 0.85, h - 0.85 - 0.1, 0.18, F.body); // items shrink to fit the panel
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w - 0.85, F.body) : 0))));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4);
        hard(s, x, y, w, h, C.white);
        t.rect(s, x, y, w, 0.6, i ? C.pink : C.ink, { line: { color: C.ink, width: 2.5 }, name: 'Header' });
        t.text(s, side.h, { x: x + 0.25, y, w: w - 0.5, h: 0.6, fontSize: 18, bold: true, color: i ? C.ink : C.white, valign: 'middle' });
        let yy = y + 0.85;
        side.items.forEach((it, k) => {
          t.text(s, '\u2192', { x: x + 0.25, y: yy, w: 0.35, h: 0.3, fontFace: F.mono, fontSize: 15, bold: true });
          t.text(s, it, { x: x + 0.6, y: yy, w: w - 0.85, h: rows[k] + 0.05, fontSize: cfs });
          yy += rows[k] + 0.18;
        });
      });
    },
    async statement(d) {
      const s = page(d);
      const fs = L.fit(d.text, 7.6, 1.5, 38, 22, F.head, true);
      hard(s, 0.6, 1.6, 8.6, 2.1, C.white, 0.12);
      t.text(s, L.runs(d.text), { x: 1.1, y: 1.6, w: 7.6, h: 2.1, fontSize: fs, bold: true, valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 4.0, w: 8.4, h: 1.0, fontFace: F.mono, fontSize: 14, bold: true });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.7 / n, ly = 2.6;
      t.rect(s, 0.6, ly - 0.05, 8.7, 0.1, C.ink, { name: 'Bar' });
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw, bw = Math.min(cw - 0.3, L.width(it.year, 18, F.mono, true) + 0.4);
        hard(s, x, 1.65, bw, 0.55, i % 2 ? C.cyan : C.pink, 0.06);
        t.text(s, it.year, { x, y: 1.65, w: bw, h: 0.55, fontFace: F.mono, fontSize: 18, bold: true, align: 'center', valign: 'middle' });
        t.rect(s, x + 0.1, ly - 0.15, 0.3, 0.3, C.white, { line: { color: C.ink, width: 2.5 }, name: 'Point' });
        t.text(s, it.h, { x, y: 2.95, w: cw - 0.3, h: 0.42, fontSize: 17, bold: true });
        t.text(s, it.t, { x, y: 3.4, w: cw - 0.3, h: 1.6, fontSize: 14, color: C.gray });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.pink }; idx++;
      const fs = L.fit(d.text, 7.6, 2.3, 34, 20, F.head, true);
      hard(s, 0.6, 0.8, 8.6, 3.2, C.white, 0.12);
      t.text(s, '\u201C', { x: 0.9, y: 0.85, w: 1, h: 1, fontSize: 80, bold: true, fontFace: F.head });
      t.text(s, d.text, { x: 1.1, y: 1.4, w: 7.6, h: 2.4, fontSize: fs, bold: true, valign: 'middle' });
      if (d.author) {
        const aw = Math.min(8.6, L.width(d.author, 14, F.mono, true) + 0.5);
        t.rect(s, 0.6, 4.35, aw, 0.5, C.ink, { name: 'Author' });
        t.text(s, d.author, { x: 0.85, y: 4.35, w: aw - 0.4, h: 0.5, fontFace: F.mono, fontSize: 14, bold: true, color: C.white, valign: 'middle' });
      }
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      hard(s, 0.6, 1.6, 4.0, 3.3, C.white); await PH(s, d.image, 0.72, 1.72, 3.76, 3.06);
      hard(s, 4.95, 1.6, 4.45, 3.3, C.white);
      t.text(s, d.text, { x: 5.2, y: 1.75, w: 3.95, h: 3.0, fontSize: L.fit(d.text, 3.95, 3.0, 15, 11, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      hard(s, 0.6, 1.6, 4.3, 3.3, C.cyan);
      t.text(s, d.text, { x: 0.85, y: 1.75, w: 3.8, h: 3.0, fontSize: L.fit(d.text, 3.8, 3.0, 15, 11, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      hard(s, 5.25, 1.6, 4.15, 3.3, C.white); await PH(s, d.image, 5.37, 1.72, 3.91, 3.06);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.55 + i * rh;
        t.rect(s, 0.6, y + 0.04, 0.5, rh - 0.12, C.ink, { name: 'Number' });
        t.text(s, String(i + 1), { x: 0.6, y: y + 0.04, w: 0.5, h: rh - 0.12, fontFace: F.mono, fontSize: 13, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 8.15, h: rh, fontSize: L.fit(it, 8.15, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { hard(s, 6.5, 0.5, 2.9, 2.75, C.white); await PH(s, d.image, 6.62, 0.62, 2.66, 2.51); },
    closing: async (s, d) => { hard(s, 6.5, 0.5, 2.9, 2.75, C.white); await PH(s, d.image, 6.62, 0.62, 2.66, 2.51); },
  });
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, () => ({ x: 0.6, y: 5.28, w: 8.8, h: 0.22, color: C.ink, fontFace: 'Courier New' }));
  return L.save(pres, out, { name: 'SlideAI Brutalist', colors: { dk1: C.ink, lt1: C.white, dk2: C.gray, lt2: C.bg, accent1: C.pink, accent2: C.cyan, accent3: C.bg, accent4: C.ink, accent5: C.gray, accent6: 'FFF3A8', hlink: C.ink, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "o'tkir va to'g'ridan-to'g'ri: shiorga o'xshash qisqa iboralar", "limits": {"card_h": 18, "card_t4": 60}};
module.exports = { id: 12, slug: 'brutalist', name: 'Brutalist', category: 'creative', build, style: STYLE };
