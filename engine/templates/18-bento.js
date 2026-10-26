/**
 * 18 Bento — modern bento-box grid: every slide is a mosaic of rounded tiles of different
 * sizes on warm grey, one orange and one lavender tile per slide, black feature tiles.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'ECECE7', tile: 'FFFFFF', ink: '111111', gray: '666666', orange: 'FF6B35', lav: 'CDBDFF', black: '151515' };
const F = { head: 'Arial', body: 'Arial' };
const G = 0.15, R0 = 0.18, X0 = 0.4, Y0 = 0.4, AW = 9.2;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  let idx = 0;
  const tile = (s, x, y, w, h, fill = C.tile) => t.rect(s, x, y, w, h, fill, { r: R0, name: 'Tile' });
  const on = (fill) => (fill === C.black ? 'FFFFFF' : C.ink);
  const sub = (fill) => (fill === C.black ? 'BDBDBD' : fill === C.tile ? C.gray : '333333');

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    tile(s, X0, Y0, AW, 0.9);
    t.text(s, d.title, { x: X0 + 0.3, y: Y0, w: AW - 1.4, h: 0.9, bold: true, valign: 'middle', fontSize: L.fit(d.title, AW - 1.4, 0.8, 26, 18, F.head, true) });
    t.rect(s, X0 + AW - 0.95, Y0 + 0.22, 0.75, 0.46, C.black, { r: 0.23, name: 'Chip' });
    t.text(s, L.pad2(idx), { x: X0 + AW - 0.95, y: Y0 + 0.22, w: 0.75, h: 0.46, fontSize: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    return s;
  };
  const AY = Y0 + 0.9 + G, AH = H - 0.4 - AY; // content area under the title tile

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    const bw = 5.6, rx = X0 + bw + G, rw = AW - bw - G, th = 2.3;
    tile(s, X0, Y0, bw, H - 0.8);
    const fs = L.fit(d.title, bw - 0.8, 2.6, 44, 24, F.head, true);
    t.text(s, d.title, { x: X0 + 0.4, y: Y0 + 0.4, w: bw - 0.8, h: 2.8, fontSize: fs, bold: true, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: X0 + 0.4, y: Y0 + 3.4, w: bw - 0.8, h: 1.2, fontSize: 15, color: C.gray });
    tile(s, rx, Y0, rw, th, C.orange);
    t.img(s, await L.icon(kind === 'cover' ? 'FiArrowUpRight' : 'FiCheck', 'FFFFFF', 2), rx + rw - 1.15, Y0 + 0.35, 0.8, 0.8);
    const hw = (rw - G) / 2, y2 = Y0 + th + G, h2 = H - 0.4 - y2;
    tile(s, rx, y2, hw, h2, C.lav);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 4; b++) t.oval(s, rx + 0.3 + a * 0.38, y2 + 0.3 + b * 0.42, 0.1, 0.1, '8E77E0');
    tile(s, rx + hw + G, y2, hw, h2, C.black);
    t.text(s, kind === 'cover' ? '01' : L.pad2(idx), { x: rx + hw + G + 0.25, y: y2 + h2 - 0.9, w: hw - 0.4, h: 0.7, fontSize: 36, bold: true, color: 'FFFFFF' });
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async agenda(d) {
      const s = page(d), cols = 3, rws = Math.ceil(d.items.length / cols), w = (AW - G * (cols - 1)) / cols, h = (AH - G * (rws - 1)) / rws;
      d.items.forEach((it, i) => {
        const x = X0 + (i % cols) * (w + G), y = AY + Math.floor(i / cols) * (h + G), fill = i === 0 ? C.orange : i === 4 ? C.lav : C.tile;
        tile(s, x, y, w, h, fill);
        t.text(s, L.pad2(i + 1), { x: x + 0.25, y: y + 0.2, w: 1, h: 0.45, fontSize: 22, bold: true, color: fill === C.tile ? 'BBBBBB' : C.ink });
        t.text(s, it, { x: x + 0.25, y: y + h - 0.95, w: w - 0.5, h: 0.75, fontSize: 17, bold: true, valign: 'bottom', color: C.ink });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length;
      // first card is the large "feature" tile, the rest stack on the right
      const fw = n === 4 ? 3.6 : 4.5, rw = AW - fw - G;
      const cells = [{ x: X0, y: AY, w: fw, h: AH, fill: C.black }];
      if (n === 3) [0, 1].forEach((k) => cells.push({ x: X0 + fw + G, y: AY + k * ((AH - G) / 2 + G), w: rw, h: (AH - G) / 2, fill: k ? C.lav : C.tile }));
      else [0, 1, 2].forEach((k) => cells.push({ x: X0 + fw + G + (k === 2 ? 0 : 0), y: AY + (k < 2 ? 0 : (AH - G) / 2 + G), w: k < 2 ? (rw - G) / 2 : rw, h: (AH - G) / 2, fill: [C.tile, C.orange, C.tile][k] }));
      if (n === 4) cells[2].x = X0 + fw + G + (rw - G) / 2 + G;
      for (const [i, it] of d.items.entries()) {
        const c = cells[i], fg = on(c.fill), big = i === 0;
        tile(s, c.x, c.y, c.w, c.h, c.fill);
        t.img(s, await L.icon(it.icon, big ? C.orange : fg, 2), c.x + 0.28, c.y + 0.28, big ? 0.6 : 0.36, big ? 0.6 : 0.36);
        const hy = big ? c.y + c.h - 1.9 : c.y + 0.75;
        t.text(s, it.h, { x: c.x + 0.28, y: hy, w: c.w - 0.56, h: 0.45, fontSize: L.fit(it.h, c.w - 0.56, 0.45, big ? 22 : 17, 12, F.head, true), bold: true, color: fg });
        t.text(s, it.t, { x: c.x + 0.28, y: hy + 0.48, w: c.w - 0.56, h: big ? 1.25 : c.h - 1.3, fontSize: L.fit(it.t, c.w - 0.56, big ? 1.25 : c.h - 1.3, 14, 11, F.body), color: sub(c.fill) });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, w = (AW - G * (n - 1)) / n;
      d.steps.forEach((st, i) => {
        const x = X0 + i * (w + G), fill = i === n - 1 ? C.black : i === 0 ? C.lav : C.tile, fg = on(fill);
        tile(s, x, AY, w, AH, fill);
        t.text(s, L.pad2(i + 1), { x: x + 0.25, y: AY + 0.2, w: w - 0.5, h: 0.8, fontSize: 40, bold: true, color: fill === C.tile ? 'C9C9C9' : fill === C.black ? C.orange : C.ink });
        t.text(s, st.h, { x: x + 0.25, y: AY + 1.3, w: w - 0.5, h: 0.45, fontSize: L.fit(st.h, w - 0.5, 0.45, 18, 12, F.head, true), bold: true, color: fg });
        t.text(s, st.t, { x: x + 0.25, y: AY + 1.8, w: w - 0.5, h: AH - 2.0, fontSize: 14, color: sub(fill) });
      });
    },
    async stats(d) {
      const s = page(d), fw = 4.6, rw = AW - fw - G, hh = (AH - G) / 2;
      const cells = [{ x: X0, y: AY, w: fw, h: AH, fill: C.orange, big: true }, { x: X0 + fw + G, y: AY, w: rw, h: hh, fill: C.tile }, { x: X0 + fw + G, y: AY + hh + G, w: rw, h: hh, fill: C.lav }];
      d.stats.slice(0, 3).forEach((x, i) => {
        const c = cells[i];
        tile(s, c.x, c.y, c.w, c.h, c.fill);
        t.text(s, x.value, { x: c.x + 0.3, y: c.y + 0.2, w: c.w - 0.6, h: c.big ? 1.9 : 0.95, fontSize: L.fit(x.value, c.w - 0.6, c.big ? 1.6 : 0.9, c.big ? 88 : 46, 24, F.head, true), bold: true, valign: c.big ? 'middle' : 'top' });
        t.text(s, x.label, { x: c.x + 0.3, y: c.big ? c.y + c.h - 1.2 : c.y + c.h - 0.65, w: c.w - 0.6, h: c.big ? 1.0 : 0.55, fontSize: c.big ? 17 : 14, bold: c.big, color: C.ink, valign: 'bottom' });
      });
      if (d.note && d.stats[0]) {
        const lab = Math.min(1.0, L.height(d.stats[0].label, 17, fw - 0.6, F.body, true)), room = AY + AH - 0.2 - lab - 0.12 - (AY + 2.15);
        if (room > 0.2) t.text(s, d.note, { x: X0 + 0.3, y: AY + 2.15, w: fw - 0.6, h: Math.min(0.9, room), fontSize: 13, color: '3A2A20' });
      }
    },
    async compare(d) {
      const s = page(d), w = (AW - G) / 2;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.9, F.body) : 0))));
      [d.left, d.right].forEach((side, i) => {
        const x = X0 + i * (w + G), fill = i ? C.black : C.tile, fg = on(fill);
        tile(s, x, AY, w, AH, fill);
        t.text(s, side.h, { x: x + 0.35, y: AY + 0.3, w: w - 0.7, h: 0.5, fontSize: 20, bold: true, color: fg });
        let y = AY + 1.0;
        side.items.forEach((it, k) => {
          t.oval(s, x + 0.37, y + 0.08, 0.13, 0.13, i ? C.orange : C.lav);
          t.text(s, it, { x: x + 0.65, y, w: w - 0.9, h: rows[k] + 0.05, fontSize: 15, color: fg });
          y += rows[k] + 0.2;
        });
      });
    },
    async statement(d) {
      const s = page(d), sw = 2.3, bw = AW - sw - G;
      tile(s, X0, AY, bw, AH, C.lav);
      const fs = L.fit(d.text, bw - 0.8, 1.8, 38, 22, F.head, true);
      t.text(s, L.runs(d.text), { x: X0 + 0.4, y: AY + 0.3, w: bw - 0.8, h: 2.0, fontSize: fs, bold: true, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: X0 + 0.4, y: AY + 2.45, w: bw - 0.8, h: 1.1, fontSize: 15, color: '333333' });
      tile(s, X0 + bw + G, AY, sw, (AH - G) / 2, C.orange);
      t.img(s, await L.icon('FiZap', 'FFFFFF', 2), X0 + bw + G + 0.3, AY + 0.3, 0.6, 0.6);
      tile(s, X0 + bw + G, AY + (AH - G) / 2 + G, sw, (AH - G) / 2, C.tile);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, w = (AW - G * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const x = X0 + i * (w + G), fill = i === n - 1 ? C.orange : C.tile;
        tile(s, x, AY, w, AH, fill);
        t.text(s, it.year, { x: x + 0.25, y: AY + 0.2, w: w - 0.5, h: 0.75, fontSize: L.fit(it.year, w - 0.5, 0.7, 32, 16, F.head, true), bold: true });
        t.line(s, x + 0.25, AY + 1.1, w - 0.5, 0, fill === C.tile ? 'DDDDDD' : C.ink, 1);
        t.text(s, it.h, { x: x + 0.25, y: AY + 1.3, w: w - 0.5, h: 0.45, fontSize: 17, bold: true });
        t.text(s, it.t, { x: x + 0.25, y: AY + 1.8, w: w - 0.5, h: AH - 2.0, fontSize: 14, color: fill === C.tile ? C.gray : '3A2A20' });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
      const sw = 2.0, bw = AW - sw - G;
      tile(s, X0, Y0, bw, H - 0.8, C.black);
      const fs = L.fit(d.text, bw - 1.0, 2.8, 34, 20, F.head, true);
      t.text(s, d.text, { x: X0 + 0.5, y: Y0 + 0.4, w: bw - 1.0, h: 3.2, fontSize: fs, bold: true, color: 'FFFFFF', valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: X0 + 0.5, y: Y0 + 3.85, w: bw - 1.0, h: 0.4, fontSize: 15, color: C.orange });
      tile(s, X0 + bw + G, Y0, sw, sw, C.orange);
      t.text(s, '\u201C', { x: X0 + bw + G, y: Y0 + 0.15, w: sw, h: sw, fontSize: 110, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      tile(s, X0 + bw + G, Y0 + sw + G, sw, H - 0.8 - sw - G, C.lav);
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d), pw = 4.4;
      await PH(s, d.image, X0, AY, pw, AH, { mask: { r: R0 } });
      tile(s, X0 + pw + G, AY, AW - pw - G, AH, C.lav);
      t.text(s, d.text, { x: X0 + pw + G + 0.3, y: AY + 0.25, w: AW - pw - G - 0.6, h: AH - 0.5, fontSize: L.fit(d.text, AW - pw - G - 0.6, AH - 0.5, 15, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d), tw = 4.3;
      tile(s, X0, AY, tw, AH);
      t.text(s, d.text, { x: X0 + 0.3, y: AY + 0.25, w: tw - 0.6, h: AH - 0.5, fontSize: L.fit(d.text, tw - 0.6, AH - 0.5, 15, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      await PH(s, d.image, X0 + tw + G, AY, AW - tw - G, AH, { mask: { r: R0 } });
    },
    async sources(d) {
      const s = page(d), n = d.items.length;
      tile(s, X0, AY, AW, AH);
      const rh = Math.min(0.55, (AH - 0.3) / n);
      d.items.forEach((it, i) => {
        const y = AY + 0.15 + i * rh;
        t.text(s, L.pad2(i + 1), { x: X0 + 0.3, y, w: 0.6, h: rh, fontSize: 15, bold: true, color: i % 2 ? C.orange : '8E77E0', valign: 'middle' });
        t.text(s, it, { x: X0 + 0.95, y, w: AW - 1.25, h: rh, fontSize: L.fit(it, AW - 1.25, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 6.15, 0.4, 3.45, 2.3, { mask: { r: 0.18 } }); },
    closing: async (s, d) => { await PH(s, d.image, 6.15, 0.4, 3.45, 2.3, { mask: { r: 0.18 } }); },
  });
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, () => ({ x: 0.4, y: 5.27, w: 9.2, h: 0.2, color: C.gray, fontSize: 7.5 }));
  return L.save(pres, out, { name: 'SlideAI Bento', colors: { dk1: C.ink, lt1: C.tile, dk2: C.black, lt2: C.bg, accent1: C.orange, accent2: C.lav, accent3: C.gray, accent4: '8E77E0', accent5: 'BBBBBB', accent6: 'DDDDDD', hlink: C.orange, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "zamonaviy mahsulot taqdimoti: juda qisqa, ta'sirchan", "limits": {"card_t3": 70, "card_t4": 55}, "prefer": "data"};
module.exports = { id: 18, slug: 'bento', name: 'Bento', category: 'business', build, style: STYLE };
