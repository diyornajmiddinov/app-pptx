/**
 * 19 Radial — everything is circular: multicolour ring segments, agenda around a ring,
 * a cycle diagram for processes, percentage rings that show real proportions.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FAFAFC', navy: '1B2A49', gray: '667085', ring: 'E7E9F2', blue: '3A86FF', pink: 'FF006E', yellow: 'FFBE0B', violet: '8338EC', green: '06D6A0' };
const F = { head: 'Arial', body: 'Arial' };
const P = [C.blue, C.pink, C.yellow, C.violet, C.green, C.blue];
const onP = (c) => (c === C.yellow || c === C.green ? C.navy : 'FFFFFF');

// ring made of coloured arc segments; segs = [[color, fraction], ...]
function ringSvg(size, segs, width, gap = 4, track = null) {
  const r = (size - width) / 2, c = size / 2, circ = 2 * Math.PI * r; let off = 0;
  const parts = segs.map(([col, f]) => { const len = Math.max(0, f * circ - (segs.length > 1 ? gap : 0)); const p = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#${col}" stroke-width="${width}" stroke-dasharray="${len} ${circ}" stroke-dashoffset="${-off}" transform="rotate(-90 ${c} ${c})"${segs.length > 1 ? '' : ' stroke-linecap="round"'}/>`; off += f * circ; return p; });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${track ? `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#${track}" stroke-width="${width}"/>` : ''}${parts.join('')}</svg>`;
}
const pct = (v) => { const m = String(v).match(/^~?\s*(\d+(?:[.,]\d+)?)\s*%$/); return m ? Math.min(1, parseFloat(m[1].replace(',', '.')) / 100) : null; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const memo = {}; const ring = async (k, ...a) => (memo[k] ??= await L.svg(ringSvg(...a), a[0], a[0]));
  const quarter = [[C.blue, 0.25], [C.pink, 0.25], [C.yellow, 0.25], [C.violet, 0.25]];

  const logo = (s, x, y) => [C.blue, C.pink, C.yellow].forEach((c, k) => t.oval(s, x + k * 0.07, y + k * 0.07, 0.46 - k * 0.14, 0.46 - k * 0.14, null, { line: { color: c, width: 2.25 } }));
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    logo(s, 0.6, 0.55);
    t.text(s, d.title, { x: 1.3, y: 0.4, w: 8.1, h: 0.8, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.8, 28, 18, F.head, true) });
    s.slideNumber = { x: 8.9, y: 5.15, w: 0.5, h: 0.25, fontFace: F.body, fontSize: 10, color: C.gray, align: 'right' };
    return s;
  };
  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.img(s, await ring('big', 1000, quarter, 90, 10), 5.9, -0.6, 5.4, 5.4);
    t.img(s, await ring('mid', 1000, [[C.green, 0.4], [C.violet, 0.35], [C.yellow, 0.25]], 90, 10), 6.85, 0.35, 3.5, 3.5);
    t.oval(s, 8.2, 1.7, 0.8, 0.8, C.navy);
    const fs = L.fit(d.title, 5.0, 2.4, 46, 26, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 0.8, w: 5.0, h: 2.6, bold: true, fontSize: fs, color: C.navy, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.65, w: 4.7, h: 1.2, fontSize: 16, color: C.gray });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), n = d.items.length, cx = 5.0, cy = 3.25, rr = 1.05;
      t.img(s, await ring('agenda' + n, 600, d.items.map((_, i) => [P[i % 6], 1 / n]), 70, 8), cx - rr, cy - rr, 2 * rr, 2 * rr);
      const left = Math.ceil(n / 2);
      d.items.forEach((it, i) => {
        const isL = i < left, k = isL ? i : i - left, cnt = isL ? left : n - left;
        const yy = cy - 1.3 + (cnt === 1 ? 1.3 : (2.6 * k) / (cnt - 1));
        const dx = isL ? cx - rr - 0.75 - Math.cos(((yy - cy) / 1.6)) * 0.0 : cx + rr + 0.3;
        t.oval(s, dx, yy - 0.22, 0.44, 0.44, P[i % 6]);
        t.text(s, String(i + 1), { x: dx, y: yy - 0.22, w: 0.44, h: 0.44, fontSize: 14, bold: true, color: onP(P[i % 6]), align: 'center', valign: 'middle' });
        t.text(s, it, { x: isL ? dx - 2.95 : dx + 0.6, y: yy - 0.35, w: 2.8, h: 0.7, fontSize: 16, bold: true, color: C.navy, align: isL ? 'right' : 'left', valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, dd = Math.min(n === 4 ? 1.55 : 1.8, cw - 0.4);
      for (const [i, it] of d.items.entries()) {
        const cx = 0.6 + i * cw + cw / 2;
        t.img(s, await ring('c' + i, 400, [[P[i % 6], 1]], 34), cx - dd / 2, 1.45, dd, dd);
        t.img(s, await L.icon(it.icon, P[i % 6], 2), cx - dd * 0.2, 1.45 + dd * 0.3, dd * 0.4, dd * 0.4);
        t.text(s, it.h, { x: cx - cw / 2 + 0.15, y: 1.6 + dd, w: cw - 0.3, h: 0.45, fontSize: L.fit(it.h, cw - 0.3, 0.45, 18, 12, F.head, true), bold: true, color: C.navy, align: 'center' });
        t.text(s, it.t, { x: cx - cw / 2 + 0.15, y: 2.1 + dd, w: cw - 0.3, h: 4.95 - (2.1 + dd), fontSize: 14, color: C.gray, align: 'center' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cx = 2.55, cy = 3.2, rr = 1.45;
      t.img(s, await ring('cycle', 600, [[C.ring, 1]], 16), cx - rr, cy - rr, 2 * rr, 2 * rr);
      t.text(s, '\u21BB', { x: cx - 0.6, y: cy - 0.6, w: 1.2, h: 1.2, fontSize: 48, color: C.ring, align: 'center', valign: 'middle', fontFace: 'Arial' });
      const rowH = Math.min(1.1, 3.75 / n);
      d.steps.forEach((st, i) => {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / n, nx = cx + rr * Math.cos(a) - 0.3, ny = cy + rr * Math.sin(a) - 0.3;
        t.oval(s, nx, ny, 0.6, 0.6, P[i % 6], { line: { color: C.bg, width: 3 } });
        t.text(s, String(i + 1), { x: nx, y: ny, w: 0.6, h: 0.6, fontSize: 17, bold: true, color: onP(P[i % 6]), align: 'center', valign: 'middle' });
        const y = 1.35 + i * rowH;
        t.oval(s, 4.75, y + 0.08, 0.2, 0.2, P[i % 6]);
        t.text(s, st.h, { x: 5.1, y, w: 4.3, h: 0.36, fontSize: 17, bold: true, color: C.navy });
        t.text(s, st.t, { x: 5.1, y: y + 0.38, w: 4.3, h: rowH - 0.42, fontSize: L.fit(st.t, 4.3, rowH - 0.45, 14, 12, F.body), color: C.gray });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n, dd = Math.min(2.0, cw - 0.5);
      for (const [i, x] of d.stats.entries()) {
        const cx = 0.6 + i * cw + cw / 2, f = pct(x.value);
        t.img(s, await ring('s' + i + f, 500, [[P[i % 6], f ?? 1]], 44, 0, C.ring), cx - dd / 2, 1.45, dd, dd);
        t.text(s, x.value, { x: cx - dd / 2 + 0.2, y: 1.45, w: dd - 0.4, h: dd, fontSize: L.fit(x.value, dd - 0.6, 0.7, 34, 16, F.head, true), bold: true, color: C.navy, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 1.6 + dd, w: cw - 0.4, h: 0.95, fontSize: 15, color: C.gray, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.6, w: 8.8, h: 0.45, fontSize: 13, color: C.gray, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.25, h = 3.45, y = 1.5;
      const cfs = L.colSize(d, w - 0.95, h - 1.1 - 0.1, 0.2, F.body); // items shrink to fit the panel
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w - 0.95, F.body) : 0))));
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3), col = i ? C.pink : C.blue;
        t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.25, line: { color: C.ring, width: 1 }, name: 'Panel' });
        t.img(s, await ring('cmp' + i, 300, [[col, 1]], 40), x + 0.3, y + 0.3, 0.55, 0.55);
        t.text(s, side.h, { x: x + 1.0, y: y + 0.3, w: w - 1.3, h: 0.55, fontSize: 19, bold: true, color: C.navy, valign: 'middle' });
        let yy = y + 1.1;
        side.items.forEach((it, k) => {
          t.oval(s, x + 0.4, yy + 0.06, 0.16, 0.16, null, { line: { color: col, width: 2 } });
          t.text(s, it, { x: x + 0.7, y: yy, w: w - 0.95, h: rows[k] + 0.05, fontSize: cfs, color: C.navy });
          yy += rows[k] + 0.2;
        });
      }
    },
    async statement(d) {
      const s = page(d);
      t.img(s, await ring('stmt', 800, quarter, 70, 10), 0.6, 1.55, 3.0, 3.0);
      const fs = L.fit(d.text, 5.5, 1.8, 34, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: 3.95, y: 1.5, w: 5.5, h: 2.0, fontSize: fs, bold: true, color: C.navy, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: 3.95, y: 3.7, w: 5.4, h: 1.1, fontSize: 15, color: C.gray });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, dd = 1.05;
      t.line(s, 0.6 + cw / 2, 2.05, cw * (n - 1), 0, C.ring, 3);
      d.items.forEach((it, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        t.oval(s, cx - dd / 2, 2.05 - dd / 2, dd, dd, P[i % 6], { line: { color: C.bg, width: 4 } });
        t.text(s, it.year, { x: cx - dd / 2, y: 2.05 - dd / 2, w: dd, h: dd, fontSize: L.fit(it.year, dd - 0.15, 0.5, 18, 10, F.head, true), bold: true, color: onP(P[i % 6]), align: 'center', valign: 'middle' });
        t.text(s, it.h, { x: cx - cw / 2 + 0.1, y: 2.85, w: cw - 0.2, h: 0.42, fontSize: 17, bold: true, color: C.navy, align: 'center' });
        t.text(s, it.t, { x: cx - cw / 2 + 0.1, y: 3.3, w: cw - 0.2, h: 1.7, fontSize: 14, color: C.gray, align: 'center' });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.navy };
      t.img(s, await ring('qbig', 1000, quarter, 90, 10), 6.6, 1.4, 4.6, 4.6);
      const fs = L.fit(d.text, 5.8, 2.6, 32, 20, F.head, true);
      t.text(s, d.text, { x: 0.7, y: 0.9, w: 5.8, h: 2.9, fontSize: fs, bold: true, color: 'FFFFFF', valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 0.7, y: 4.05, w: 5.8, h: 0.4, fontSize: 15, color: C.yellow });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      t.img(s, await ring('introRing', 500, [[C.blue, 0.4], [C.pink, 0.3], [C.yellow, 0.3]], 26, 8), 0.75, 1.3, 3.6, 3.6);
      await PH(s, d.image, 1.0, 1.55, 3.1, 3.1, { mask: 'circle' });
      t.text(s, d.text, { x: 4.75, y: 1.4, w: 4.65, h: 3.45, fontSize: L.fit(d.text, 4.65, 3.45, 16, 11, F.body, false, 1.25), color: C.navy, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: 0.6, y: 1.4, w: 4.6, h: 3.45, fontSize: L.fit(d.text, 4.6, 3.45, 16, 11, F.body, false, 1.25), color: C.navy, lineSpacingMultiple: 1.25, valign: 'middle' });
      t.img(s, await ring('imageRing', 500, [[C.violet, 0.35], [C.green, 0.35], [C.blue, 0.3]], 26, 8), 5.7, 1.3, 3.6, 3.6);
      await PH(s, d.image, 5.95, 1.55, 3.1, 3.1, { mask: 'circle' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.oval(s, 0.6, y + (rh - 0.38) / 2, 0.38, 0.38, P[i % 6]);
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.38) / 2, w: 0.38, h: 0.38, fontSize: 11, bold: true, color: onP(P[i % 6]), align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.15, y, w: 8.25, h: rh, fontSize: L.fit(it, 8.25, rh - 0.04, 14, 10, F.body), color: C.navy, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 7.3, 0.8, 2.6, 2.6, { mask: 'circle' }); },
    closing: async (s, d) => { await PH(s, d.image, 7.3, 0.8, 2.6, 2.6, { mask: 'circle' }); },
  });
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => (type === 'quote' ? { x: 0.7, y: 5.15, w: 5.8, h: 0.25, color: 'C9D3E6' } : { x: 0.6, y: 5.15, w: type === 'cover' || type === 'closing' ? 5.0 : 8.0, h: 0.25, color: C.gray }));
  return L.save(pres, out, { name: 'SlideAI Radial', colors: { dk1: C.navy, lt1: 'FFFFFF', dk2: '2B3A5C', lt2: C.bg, accent1: C.blue, accent2: C.pink, accent3: C.yellow, accent4: C.violet, accent5: C.green, accent6: C.ring, hlink: C.blue, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "tizimli: o'zaro bog'liqlik, sabab-oqibat va sikllarni ko'rsat", "limits": {}};
module.exports = { id: 19, slug: 'radial', name: 'Doira', category: 'business', build, style: STYLE };
