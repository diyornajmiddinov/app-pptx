/**
 * 14 Klinika — clean, calm, medical/healthcare look: white and mint, teal pills,
 * very round shapes, plus-sign motif, Calibri.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', teal: '0E9F8E', mint: 'E7F6F3', deep: '0B3B3C', gray: '5F7272', coral: 'F28B6B', line: 'CFE7E2' };
const F = { head: 'Calibri', body: 'Calibri' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  let idx = 0;
  const pill = (s, x, y, w, h, fill, o = {}) => t.rect(s, x, y, w, h, fill, { r: h / 2, ...o, name: o.name || 'Pill' });
  const plus = (s, x, y, d, color) => t.shape(s, 'MATH_PLUS', { x, y, w: d, h: d, fill: { color }, objectName: 'Plus' });

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    pill(s, 0.6, 0.45, 0.75, 0.34, C.mint);
    t.text(s, L.pad2(idx), { x: 0.6, y: 0.45, w: 0.75, h: 0.34, fontSize: 12, bold: true, color: C.teal, align: 'center', valign: 'middle' });
    plus(s, 8.75, 0.4, 0.32, C.mint); plus(s, 9.1, 0.65, 0.2, C.teal);
    t.text(s, d.title, { x: 0.6, y: 0.88, w: 8.6, h: 0.72, fontFace: F.head, bold: true, color: C.deep, valign: 'middle', fontSize: L.fit(d.title, 8.6, 0.72, 28, 20, F.head, true) });
    return s;
  };
  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.rect(s, 5.6, 0.5, 3.9, 4.6, C.mint, { r: 0.45, name: 'Panel' });
    t.oval(s, 6.45, 1.35, 2.2, 2.2, C.teal);
    plus(s, 7.0, 1.9, 1.1, 'FFFFFF');
    pill(s, 6.05, 4.0, 1.6, 0.4, C.teal, { t: 0 }); pill(s, 7.8, 4.0, 1.2, 0.4, C.coral);
    plus(s, 8.75, 0.85, 0.35, C.teal);
    const fs = L.fit(d.title, 4.6, 2.3, 44, 26, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 4.6, h: 2.45, fontSize: fs, bold: true, color: C.deep, valign: 'bottom' });
    t.rect(s, 0.6, 3.55, 0.8, 0.08, C.teal, { r: 0.04, name: 'Accent' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.8, w: 4.6, h: 1.2, fontSize: 16, color: C.gray });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(0.95, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.8 + (i % per) * rh;
        pill(s, x, y, 4.2, rh - 0.22, C.mint);
        t.oval(s, x + 0.1, y + 0.08, rh - 0.38, rh - 0.38, C.teal);
        t.text(s, String(i + 1), { x: x + 0.1, y: y + 0.08, w: rh - 0.38, h: rh - 0.38, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + rh - 0.1, y, w: 4.2 - rh, h: rh - 0.22, fontSize: 17, color: C.deep, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.6, 0.42, 18, 13, F.head, true)));
      const h = Math.min(3.25, 1.6 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.6, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.8;
        t.rect(s, x, y, w, h, C.mint, { r: 0.28, name: 'Card' });
        t.oval(s, x + 0.3, y + 0.3, 0.68, 0.68, 'FFFFFF');
        t.img(s, await L.icon(it.icon, C.teal, 2), x + 0.47, y + 0.47, 0.34, 0.34);
        t.text(s, it.h, { x: x + 0.3, y: y + 1.15, w: w - 0.6, h: 0.42, fontSize: hfs, bold: true, color: C.deep });
        t.text(s, it.t, { x: x + 0.3, y: y + 1.6, w: w - 0.6, h: h - 1.75, fontSize: 14, color: C.gray });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, w - 0.9, 0.5, 17, 12, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * (w + gap);
        pill(s, x, 1.85, w, 0.62, i === n - 1 ? C.coral : C.teal);
        t.oval(s, x + 0.08, 1.93, 0.46, 0.46, 'FFFFFF');
        t.text(s, String(i + 1), { x: x + 0.08, y: 1.93, w: 0.46, h: 0.46, fontSize: 15, bold: true, color: i === n - 1 ? C.coral : C.teal, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x: x + 0.65, y: 1.85, w: w - 0.8, h: 0.62, fontSize: hfs, bold: true, color: 'FFFFFF', valign: 'middle' });
        t.text(s, st.t, { x: x + 0.1, y: 2.75, w: w - 0.2, h: 2.0, fontSize: 14, color: C.gray });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * (w + gap);
        t.rect(s, px, 1.85, w, 2.3, i === 1 ? C.teal : C.mint, { r: 0.28, name: 'Stat' });
        t.text(s, x.value, { x: px + 0.35, y: 2.0, w: w - 0.7, h: 1.0, fontSize: L.fit(x.value, w - 0.7, 1.0, 48, 26, F.head, true), bold: true, color: i === 1 ? 'FFFFFF' : C.teal, valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.35, y: 3.1, w: w - 0.7, h: 0.95, fontSize: 15, color: i === 1 ? 'FFFFFF' : C.deep });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.4, w: 8.8, h: 0.5, fontSize: 14, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 4.25, h = 3.15, y = 1.8;
      const cfs = L.colSize(d, w - 1.0, h - 0.9 - 0.1, 0.2, F.body); // items shrink to fit the panel
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w - 1.0, F.body) : 0))));
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3), fg = i ? 'FFFFFF' : C.deep;
        t.rect(s, x, y, w, h, i ? C.teal : C.mint, { r: 0.28, name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: y + 0.25, w: w - 0.7, h: 0.45, fontSize: 19, bold: true, color: fg });
        let yy = y + 0.9;
        for (const [k, it] of side.items.entries()) {
          t.oval(s, x + 0.35, yy + 0.01, 0.26, 0.26, i ? 'FFFFFF' : C.teal);
          t.img(s, await L.icon('FiCheck', i ? C.teal : 'FFFFFF', 3), x + 0.4, yy + 0.06, 0.16, 0.16);
          t.text(s, it, { x: x + 0.75, y: yy, w: w - 1.0, h: rows[k] + 0.05, fontSize: cfs, color: fg });
          yy += rows[k] + 0.18;
        }
      }
    },
    async statement(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.85, 8.8, 2.9, C.mint, { r: 0.35, name: 'Band' });
      t.oval(s, 1.0, 2.25, 0.8, 0.8, C.teal); plus(s, 1.17, 2.42, 0.46, 'FFFFFF');
      const fs = L.fit(d.text, 7.0, 1.2, 32, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: 2.1, y: 2.05, w: 7.0, h: 1.3, fontSize: fs, bold: true, color: C.deep, valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 2.1, y: 3.45, w: 6.9, h: 1.1, fontSize: 15, color: C.gray });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.15;
      t.line(s, 0.6, ly, 8.8, 0, C.line, 3);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw, pw = Math.min(cw - 0.3, L.width(it.year, 15, F.head, true) + 0.45);
        pill(s, x, ly - 0.2, pw, 0.4, i === n - 1 ? C.coral : C.teal);
        t.text(s, it.year, { x, y: ly - 0.2, w: pw, h: 0.4, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.3, h: 0.42, fontSize: 17, bold: true, color: C.deep });
        t.text(s, it.t, { x, y: 3.05, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.gray });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.mint }; idx++;
      plus(s, 8.4, 0.6, 0.6, C.teal); plus(s, 9.05, 1.2, 0.3, C.coral);
      const fs = L.fit(d.text, 7.4, 2.3, 32, 20, F.head, false), th = L.height(d.text, fs, 7.4, F.head);
      t.text(s, '\u201C', { x: 0.7, y: 4.0 - th - 1.0, w: 1, h: 1, fontSize: 90, bold: true, color: C.coral, fontFace: 'Arial' });
      t.text(s, d.text, { x: 0.8, y: 1.5, w: 7.4, h: 2.5, fontSize: fs, color: C.deep, valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 0.8, y: 4.25, w: 7.4, h: 0.4, fontSize: 16, bold: true, color: C.teal });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, 0.6, 1.8, 4.0, 3.15, { mask: { r: 0.3 } });
      t.rect(s, 4.9, 1.8, 4.5, 3.15, C.mint, { r: 0.3, name: 'Panel' });
      t.text(s, d.text, { x: 5.2, y: 1.95, w: 3.9, h: 2.85, fontSize: L.fit(d.text, 3.9, 2.85, 15, 10, F.body, false, 1.25), color: C.deep, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.8, 4.3, 3.15, C.mint, { r: 0.3, name: 'Panel' });
      plus(s, 0.9, 2.05, 0.35, C.teal);
      t.text(s, d.text, { x: 0.9, y: 2.55, w: 3.7, h: 2.25, fontSize: L.fit(d.text, 3.7, 2.25, 15, 10, F.body, false, 1.2), color: C.deep, lineSpacingMultiple: 1.2 });
      await PH(s, d.image, 5.2, 1.8, 4.2, 3.15, { mask: { r: 0.3 } });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.55, 3.3 / n);
      d.items.forEach((it, i) => {
        const y = 1.75 + i * rh;
        pill(s, 0.6, y + 0.04, 8.8, rh - 0.1, C.mint);
        t.oval(s, 0.68, y + 0.08, rh - 0.18, rh - 0.18, C.teal);
        t.text(s, String(i + 1), { x: 0.68, y: y + 0.08, w: rh - 0.18, h: rh - 0.18, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it, { x: 0.68 + rh, y, w: 8.6 - rh, h: rh, fontSize: L.fit(it, 8.6 - rh, rh - 0.08, 13, 10, F.body), color: C.deep, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 5.6, 0.5, 3.9, 4.6, { mask: { r: 0.45 } }); },
    closing: async (s, d) => { await PH(s, d.image, 5.6, 0.5, 3.9, 4.6, { mask: { r: 0.45 } }); },
  });
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, () => ({ x: 0.6, y: 5.22, w: 8.8, h: 0.25, color: C.gray }));
  return L.save(pres, out, { name: 'SlideAI Klinika', colors: { dk1: C.deep, lt1: C.bg, dk2: '1F5556', lt2: C.mint, accent1: C.teal, accent2: C.coral, accent3: C.gray, accent4: '7FCFC3', accent5: C.line, accent6: 'B5E3DB', hlink: C.teal, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "xotirjam, ishonchli; sodda va tushunarli tushuntirish", "limits": {}};
module.exports = { id: 14, slug: 'klinika', name: 'Klinika', category: 'minimalist', build, style: STYLE };
