/**
 * 15 Retro — 1970s warmth: sand background, rainbow arcs in rust/orange/mustard/teal,
 * chunky Bookman headlines, rounded cards.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F4E4C6', brown: '3E2415', orange: 'E2711D', mustard: 'F2B134', rust: 'B5452B', teal: '2E7F7A', cream: 'FFF6E5', muted: '6B4E3D' };
const F = { head: 'Bookman Old Style', body: 'Arial' };
const ARC = [C.rust, C.orange, C.mustard, C.teal];
const ON = (c) => (c === C.mustard ? C.brown : C.cream); // text colour on an arc colour
const DARK = [C.rust, C.orange, C.teal, C.brown]; // colours readable as text on sand

// concentric arcs (rainbow) centred at (cx, cy) in a w x h canvas
const rainbow = (w, h, cx, cy, r, band) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${ARC.map((c, i) =>
  `<circle cx="${cx}" cy="${cy}" r="${r - i * band - band / 2}" fill="none" stroke="#${c}" stroke-width="${band - 6}"/>`).join('')}</svg>`;
const halfArc = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="190"><path d="M30,180 A150,150 0 0 1 330,180" fill="none" stroke="#${c}" stroke-width="36" stroke-linecap="round"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const big = await L.svg(rainbow(1000, 1000, 1000, 1000, 960, 110), 1000, 1000);
  const corner = await L.svg(rainbow(400, 400, 400, 0, 380, 60), 400, 400);
  const arcs = {}; for (const c of ARC) arcs[c] = await L.svg(halfArc(c), 360, 190);
  const stripes = (s, x, y, w) => [C.rust, C.orange, C.mustard].forEach((c, k) => t.rect(s, x, y + k * 0.09, w, 0.06, c, { name: 'Stripe' }));

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.img(s, corner, 8.3, 0, 1.7, 1.7);
    t.text(s, d.title, { x: 0.6, y: 0.4, w: 7.5, h: 0.85, fontFace: F.head, bold: true, color: C.brown, valign: 'middle', fontSize: L.fit(d.title, 7.5, 0.85, 28, 18, F.head, true) });
    t.oval(s, 9.0, 4.95, 0.42, 0.42, C.orange);
    s.slideNumber = { x: 9.0, y: 4.95, w: 0.42, h: 0.42, fontFace: F.body, fontSize: 11, bold: true, color: C.cream, align: 'center', valign: 'middle' };
    return s;
  };
  const hero = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.img(s, big, 5.4, 1.0, 4.6, 4.6);
    const fs = L.fit(d.title, 5.0, 2.5, 46, 26, F.head, true, 0.95);
    t.text(s, d.title, { x: 0.6, y: 0.6, w: 5.0, h: 2.7, fontSize: fs, bold: true, color: C.brown, fontFace: F.head, valign: 'bottom', lineSpacingMultiple: 0.95 });
    stripes(s, 0.6, 3.5, 1.4);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.95, w: 4.6, h: 1.2, fontSize: 16, color: C.muted });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.5 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.4, y = 1.5 + (i % per) * rh;
        t.oval(s, x, y, 0.62, 0.62, ARC[i % 4]);
        t.text(s, String(i + 1), { x, y, w: 0.62, h: 0.62, fontFace: F.head, fontSize: 18, bold: true, color: ON(ARC[i % 4]), align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y, w: 3.3, h: 0.62, fontFace: F.head, fontSize: 17, color: C.brown, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.6, 0.45, 18, 12, F.head, true)));
      const h = Math.min(3.45, 1.65 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.6, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.5;
        t.rect(s, x, y, w, h, C.cream, { r: 0.3, name: 'Card' });
        t.oval(s, x + 0.3, y + 0.3, 0.7, 0.7, ARC[i % 4]);
        t.img(s, await L.icon(it.icon, ON(ARC[i % 4]), 2.25), x + 0.48, y + 0.48, 0.34, 0.34);
        t.text(s, it.h, { x: x + 0.3, y: y + 1.2, w: w - 0.6, h: 0.45, fontFace: F.head, fontSize: hfs, bold: true, color: C.brown });
        t.text(s, it.t, { x: x + 0.3, y: y + 1.7, w: w - 0.6, h: h - 1.85, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      stripes(s, 0.6, 1.98, 8.8);
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.45, 18, 12, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        t.oval(s, x, 1.75, 0.68, 0.68, ARC[i % 4], { line: { color: C.bg, width: 3 } });
        t.text(s, String(i + 1), { x, y: 1.75, w: 0.68, h: 0.68, fontFace: F.head, fontSize: 18, bold: true, color: ON(ARC[i % 4]), align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 2.7, w: cw - 0.3, h: 0.45, fontFace: F.head, fontSize: hfs, bold: true, color: C.brown });
        t.text(s, st.t, { x, y: 3.2, w: cw - 0.3, h: 1.6, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n;
      d.stats.forEach((x, i) => {
        const cx = 0.6 + i * cw + cw / 2, aw = Math.min(cw - 0.4, 2.3);
        t.img(s, arcs[ARC[i % 4]], cx - aw / 2, 1.55, aw, aw * 190 / 360);
        t.text(s, x.value, { x: cx - aw / 2, y: 1.55 + aw * 0.22, w: aw, h: aw * 0.32, fontFace: F.head, bold: true, color: C.brown, align: 'center', valign: 'bottom', fontSize: L.fit(x.value, aw - 0.6, aw * 0.3, 36, 16, F.head, true) });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 1.75 + aw * 190 / 360, w: cw - 0.4, h: 1.0, fontSize: 15, color: C.muted, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.2, h: 0.45, fontSize: 14, italic: true, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.25, h = 3.4, y = 1.5;
      const cfs = L.colSize(d, w - 0.95, h - 1.0 - 0.1, 0.2, F.body); // items shrink to fit the panel
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w - 0.95, F.body) : 0))));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), fg = i ? C.cream : C.brown;
        t.rect(s, x, y, w, h, i ? C.brown : C.cream, { r: 0.3, name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: i ? C.mustard : C.rust });
        let yy = y + 1.0;
        side.items.forEach((it, k) => {
          t.oval(s, x + 0.38, yy + 0.07, 0.14, 0.14, ARC[k % 4]);
          t.text(s, it, { x: x + 0.65, y: yy, w: w - 0.95, h: rows[k] + 0.05, fontSize: cfs, color: fg });
          yy += rows[k] + 0.2;
        });
      });
    },
    async statement(d) {
      const s = page(d);
      t.img(s, big, -2.3, 2.0, 4.6, 4.6);
      const fs = L.fit(d.text, 6.6, 1.6, 36, 22, F.head, true);
      t.text(s, L.runs(d.text), { x: 2.8, y: 1.5, w: 6.6, h: 1.8, fontFace: F.head, fontSize: fs, bold: true, color: C.brown, valign: 'bottom' });
      stripes(s, 2.8, 3.5, 1.2);
      if (d.caption) t.text(s, d.caption, { x: 2.8, y: 3.9, w: 6.4, h: 1.1, fontSize: 15, color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      stripes(s, 0.6, 2.4, 8.8);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.5, w: cw - 0.2, h: 0.65, fontFace: F.head, bold: true, color: DARK[i % 4], valign: 'bottom', fontSize: L.fit(it.year, cw - 0.3, 0.6, 28, 14, F.head, true) });
        t.oval(s, x, 2.32, 0.34, 0.34, C.brown, { line: { color: C.bg, width: 3 } });
        t.text(s, it.h, { x, y: 2.9, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.brown });
        t.text(s, it.t, { x, y: 3.35, w: cw - 0.3, h: 1.6, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.brown };
      t.img(s, big, 6.3, 2.3, 3.7, 3.7);
      const fs = L.fit(d.text, 6.4, 2.4, 32, 20, F.head, false, 1, true);
      t.text(s, d.text, { x: 0.7, y: 0.9, w: 6.4, h: 2.8, fontFace: F.head, italic: true, fontSize: fs, color: C.cream, valign: 'bottom' });
      stripes(s, 0.7, 3.95, 1.2);
      if (d.author) t.text(s, d.author, { x: 0.7, y: 4.35, w: 6.0, h: 0.4, fontSize: 15, color: C.mustard });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, 0.6, 1.45, 4.0, 3.25, { mask: { r: 0.3 } });
      stripes(s, 0.6, 4.85, 4.0);
      t.text(s, d.text, { x: 4.95, y: 1.45, w: 4.45, h: 3.55, fontSize: L.fit(d.text, 4.45, 3.55, 16, 11, F.body, false, 1.3), color: C.brown, lineSpacingMultiple: 1.3, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.45, 4.3, 3.45, C.cream, { r: 0.3, name: 'Card' });
      t.text(s, d.text, { x: 0.9, y: 1.6, w: 3.7, h: 3.15, fontSize: L.fit(d.text, 3.7, 3.15, 15, 11, F.body, false, 1.25), color: C.brown, lineSpacingMultiple: 1.25, valign: 'middle' });
      await PH(s, d.image, 5.2, 1.45, 4.2, 3.25, { mask: { r: 0.3 } });
      stripes(s, 5.2, 4.85, 4.2);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.oval(s, 0.6, y + (rh - 0.38) / 2, 0.38, 0.38, ARC[i % 4]);
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.38) / 2, w: 0.38, h: 0.38, fontFace: F.head, fontSize: 11, bold: true, color: ON(ARC[i % 4]), align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.15, y, w: 7.7, h: rh, fontSize: L.fit(it, 7.7, rh - 0.04, 14, 10, F.body), color: C.brown, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 7.65, 3.275, 2.35, 2.35, { mask: { path: 'M1,1 L0,1 A1,1 0 0 1 1,0 Z' } }); },
    closing: async (s, d) => { await PH(s, d.image, 7.65, 3.275, 2.35, 2.35, { mask: { path: 'M1,1 L0,1 A1,1 0 0 1 1,0 Z' } }); },
  });
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => (type === 'quote' ? { x: 0.7, y: 5.15, w: 5.4, h: 0.25, color: C.mustard } : type === 'cover' || type === 'closing' ? { x: 0.6, y: 5.2, w: 4.8, h: 0.25, color: C.muted } : { x: 0.6, y: 5.15, w: 8.2, h: 0.25, color: C.muted }));
  return L.save(pres, out, { name: 'SlideAI Retro', colors: { dk1: C.brown, lt1: C.cream, dk2: '5A3A26', lt2: C.bg, accent1: C.orange, accent2: C.mustard, accent3: C.rust, accent4: C.teal, accent5: C.muted, accent6: 'E8CFA3', hlink: C.rust, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "iliq, do'stona, hikoya qiluvchi ohang", "limits": {}};
module.exports = { id: 15, slug: 'retro', name: 'Retro', category: 'creative', build, style: STYLE };
