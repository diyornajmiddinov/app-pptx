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
      const s = page(d), n = d.items.length, cw = 8.8 / n, dd = Math.min(1.55, cw - 0.4);
      for (const [i, it] of d.items.entries()) {
        const cx = 0.6 + i * cw + cw / 2;
        t.img(s, await ring('c' + i, 400, [[P[i % 6], 1]], 34), cx - dd / 2, 1.45, dd, dd);
        t.img(s, await L.icon(it.icon, P[i % 6], 2), cx - dd * 0.2, 1.45 + dd * 0.3, dd * 0.4, dd * 0.4);
        t.text(s, it.h, { x: cx - cw / 2 + 0.15, y: 1.6 + dd, w: cw - 0.3, h: 0.45, fontSize: L.fit(it.h, cw - 0.3, 0.45, 18, 12, F.head, true), bold: true, color: C.navy, align: 'center' });
        t.text(s, it.t, { x: cx - cw / 2 + 0.15, y: 2.1 + dd, w: cw - 0.3, h: 5.02 - 2.1 - dd, fontSize: 14, color: C.gray, align: 'center' });
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
      const nr = Math.max(d.left.items.length, d.right.items.length), { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.95, F.body, 0, h - 1.1 - 0.12 - 0.2 * (nr - 1));
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3), col = i ? C.pink : C.blue;
        t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.25, line: { color: C.ring, width: 1 }, name: 'Panel' });
        t.img(s, await ring('cmp' + i, 300, [[col, 1]], 40), x + 0.3, y + 0.3, 0.55, 0.55);
        t.text(s, side.h, { x: x + 1.0, y: y + 0.3, w: w - 1.3, h: 0.55, fontSize: 19, bold: true, color: C.navy, valign: 'middle' });
        let yy = y + 1.1;
        side.items.forEach((it, k) => {
          t.oval(s, x + 0.4, yy + 0.06, 0.16, 0.16, null, { line: { color: col, width: 2 } });
          t.text(s, it, { x: x + 0.7, y: yy, w: w - 0.95, h: rows[k] + 0.05, fontSize: CFS, color: C.navy });
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
  // ---- further ways to draw a type, in this template's world of circles (ring segments, orbits, nested rings, a dial, the navy night): a deck's pages must not look alike (L.pages)
  const X0 = 0.6, CW = 8.8, Y0 = 1.4, Y1 = 5.0, SOFT = 'C9D3E6', DK2 = '243558';
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.gray, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, bold: true, fontSize: L.fit(txt, w, h, o.max || 16, 11, F.head, true), color: o.color || C.navy, align: o.align, valign: o.valign || 'middle' });
  const night = (d) => { // the same page under a navy sky
    d._night = true;
    const s = pres.addSlide(); s.background = { color: C.navy };
    logo(s, 0.6, 0.55);
    if (d.title) t.text(s, d.title, { x: 1.3, y: 0.4, w: 8.1, h: 0.8, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.8, 28, 18, F.head, true) });
    s.slideNumber = { x: 8.9, y: 5.15, w: 0.5, h: 0.25, fontFace: F.body, fontSize: 10, color: SOFT, align: 'right' };
    return s;
  };
  const disc = (s, x, y, dd, n, c, line = C.bg) => { t.oval(s, x, y, dd, dd, c, { line: { color: line, width: 3 } }); t.text(s, String(n), { x, y, w: dd, h: dd, bold: true, fontSize: Math.round(dd * 28), color: onP(c), align: 'center', valign: 'middle' }); };
  const ringIcon = async (s, x, y, dd, ic, c) => { t.img(s, await ring('ic' + c, 300, [[c, 1]], 30), x, y, dd, dd); t.img(s, await L.icon(ic, c, 2), x + dd * 0.28, y + dd * 0.28, dd * 0.44, dd * 0.44); };
  const quarterArc = (size, r, width, col) => `<path d="M${size - r},${size} A${r},${r} 0 0 1 ${size},${size - r}" fill="none" stroke="#${col}" stroke-width="${width}"/>`;
  const V = {
    image: [
      async (d) => { // a quarter disc of picture rising from the page's corner, ring segments round it
        const s = page(d), dd = 4.1, x = W - dd, y = H - dd, px = 820;
        d._stampW = 5.6;
        const arcs = [[C.pink, 790], [C.yellow, 730]].map(([c, r]) => quarterArc(px, r, 22, c)).join('');
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}">${arcs}</svg>`, px, px), x, y, dd, dd, { alt: '' });
        const q = dd * 0.85;
        t.img(s, await L.photo(L.src(d.image), q, q, { mask: { path: 'M1,1 L0,1 C0,0.45 0.45,0 1,0 Z' } }), W - q, H - q, q, q, { alt: '' });
        t.oval(s, 9.02, 5.07, 0.44, 0.34, C.bg);
        t.text(s, d.text, { x: X0, y: Y0, w: 5.0, h: Y1 - Y0, fontSize: L.fit(d.text, 5.0, Y1 - Y0, 14, 10, F.body, false, 1.2), color: C.navy, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the navy night: the picture in a many-coloured ring
        const s = night(d), dd = 3.6, x = X0 + 0.1, y = 1.35, m = 0.26;
        t.img(s, await ring('imgN', 600, [[C.blue, 0.3], [C.pink, 0.25], [C.yellow, 0.25], [C.green, 0.2]], 30, 8), x, y, dd, dd);
        t.img(s, await L.photo(L.src(d.image), dd - 2 * m, dd - 2 * m, { mask: 'circle' }), x + m, y + m, dd - 2 * m, dd - 2 * m, { alt: '' });
        t.text(s, d.text, { x: 4.65, y: Y0, w: 4.75, h: Y1 - Y0, fontSize: L.fit(d.text, 4.75, Y1 - Y0, 14, 10, F.body, false, 1.2), color: 'FFFFFF', lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, the words inside one white circle
        const s = page(d), dd = 4.72, cx = 6.75, cy = H / 2 - 0.1;
        await PH(s, d.image, 0, 0, W, H);
        t.rect(s, 0.45, 0.42, 4.15, 0.95, C.bg, { r: 0.47, name: 'Title capsule' });
        t.text(s, d.title, { x: 0.8, y: 0.45, w: 3.5, h: 0.88, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(d.title, 3.5, 0.84, 18, 12, F.head, true) });
        t.img(s, await ring('imgW', 800, quarter, 20, 8), cx - dd / 2 - 0.1, cy - dd / 2 - 0.1, dd + 0.2, dd + 0.2);
        t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, C.bg);
        t.text(s, d.text, { x: cx - 1.72, y: cy - 1.72, w: 3.44, h: 3.44, fontSize: L.fit(d.text, 3.44, 3.44, 13, 10, F.body, false, 1.1), color: C.navy, lineSpacingMultiple: 1.1, align: 'center', valign: 'middle' });
        t.rect(s, 0, 5.12, W, H - 5.12, C.bg, { name: 'Footer band' });
      },
      async (d) => { // a capsule of picture across the page, a row of little rings at its end
        const s = page(d), ph = 1.62;
        await PH(s, d.image, X0, Y0, CW, ph, { mask: { r: ph / 2 } });
        [C.blue, C.pink, C.yellow].forEach((c, k) => t.oval(s, 7.75 + k * 0.4, Y0 + ph - 0.22, 0.36, 0.36, c, { line: { color: C.bg, width: 2 } }));
        t.text(s, d.text, { x: X0 + 0.1, y: Y0 + ph + 0.22, w: CW - 0.2, h: Y1 - Y0 - ph - 0.22, fontSize: L.fit(d.text, CW - 0.2, Y1 - Y0 - ph - 0.24, 14, 10, F.body, false, 1.1), color: C.navy, lineSpacingMultiple: 1.1 });
      },
    ],
    cards: [
      async (d) => { // white panels two by two, a quarter ring in the corner of each
        const s = page(d), n = d.items.length, gap = 0.2, w = (CW - gap) / 2, h = (Y1 - Y0 - gap) / 2, px = 200;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, x = X0 + (i % 2) * (w + gap), y = Y0 + Math.floor(i / 2) * (h + gap), ww = wide ? CW : w, c = P[i];
          t.rect(s, x, y, ww, h, 'FFFFFF', { r: 0.2, line: { color: C.ring, width: 1 }, name: 'Panel' });
          t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"><path d="M0,${px} A${px},${px} 0 0 1 ${px},0" fill="none" stroke="#${c}" stroke-width="26"/></svg>`, px * 2, px * 2), x + ww - 0.76, y + 0.05, 0.7, 0.7, { alt: '' });
          t.img(s, await L.icon(it.icon, c, 2), x + 0.18, y + 0.16, 0.32, 0.32);
          head(s, it.h, x + 0.6, y + 0.12, ww - 1.35, 0.4, { max: 16 });
          body(s, it.t, x + 0.18, y + 0.58, ww - 0.36, h - 0.66, { color: C.navy, max: 13 });
        }
      },
      async (d) => { // an orbit: one great segmented ring, each item on a planet at its side
        const s = page(d), n = d.items.length, cx = W / 2, cy = (Y0 + Y1) / 2, rr = 1.2, w = 2.82, hh = (Y1 - Y0 - 0.14) / 2;
        t.img(s, await ring('orb' + n, 600, d.items.map((_, i) => [P[i], 1 / n]), 44, 10), cx - rr, cy - rr, 2 * rr, 2 * rr);
        t.oval(s, cx - 0.4, cy - 0.4, 0.8, 0.8, C.navy);
        const spots = n === 4 ? [[X0, Y0], [W - X0 - w, Y0], [W - X0 - w, Y0 + hh + 0.14], [X0, Y0 + hh + 0.14]] : [[X0, Y0], [W - X0 - w, cy - hh / 2], [X0, Y0 + hh + 0.14]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right';
          t.oval(s, right ? x : x + w - 0.46, y, 0.46, 0.46, P[i]);
          t.img(s, await L.icon(it.icon, onP(P[i]), 2), (right ? x : x + w - 0.46) + 0.11, y + 0.11, 0.24, 0.24);
          head(s, it.h, right ? x + 0.56 : x, y + 0.03, w - 0.56, 0.4, { align: a, max: 15 });
          body(s, it.t, x, y + 0.5, w, hh - 0.52, { align: a, color: C.navy, max: 13 });
        }
      },
      async (d) => { // the navy night: rounded plates at two heights, a ring on the head of each
        const s = night(d), n = d.items.length, gap = 0.18, w = (CW - gap * (n - 1)) / n, h = 2.95, dd = 0.7;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + gap), y = i % 2 ? 1.92 : 1.68;
          t.rect(s, x, y, w, h, DK2, { r: 0.22, name: 'Plate' });
          t.oval(s, x + (w - dd) / 2 - 0.04, y - 0.3, dd + 0.08, dd + 0.08, C.navy);
          await ringIcon(s, x + (w - dd) / 2, y - 0.26, dd, it.icon, P[i] === C.blue ? '6FA8FF' : P[i]);
          head(s, it.h, x + 0.15, y + 0.5, w - 0.3, 0.5, { color: 'FFFFFF', align: 'center', max: 14 });
          body(s, it.t, x + 0.15, y + 1.02, w - 0.3, h - 1.1, { color: SOFT, align: 'center', max: 13 });
        }
      },
      async (d) => { // a fan of rings from the lower corner, each arc ending at its item
        const s = page(d), n = d.items.length, dd = 3.3, px = 740, x = X0, y = Y1 + 0.02 - dd, rh = (Y1 - Y0) / n, lx = 4.2;
        const fan = d.items.map((_, i) => { const r = px - 24 - i * 86; return `<path d="M0,${px - r} A${r},${r} 0 0 1 ${r},${px}" fill="none" stroke="#${P[i]}" stroke-width="46"/>`; }).join('');
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}">${fan}</svg>`, px, px), x, y, dd, dd, { alt: '' });
        for (const [i, it] of d.items.entries()) {
          const yy = Y0 + i * rh;
          t.oval(s, lx, yy + 0.06, 0.42, 0.42, P[i]);
          t.img(s, await L.icon(it.icon, onP(P[i]), 2), lx + 0.1, yy + 0.16, 0.22, 0.22);
          head(s, it.h, lx + 0.54, yy + 0.02, 9.4 - lx - 0.54, 0.34, { max: 16 });
          body(s, it.t, lx + 0.54, yy + 0.37, 9.4 - lx - 0.54, rh - 0.41, { color: C.navy, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a chain of linked rings, each step under its link
        const s = page(d), n = d.steps.length, cw = CW / n, dd = Math.min(1.35, cw + 0.08);
        for (const [i, st] of d.steps.entries()) {
          const cx = X0 + i * cw + cw / 2;
          t.img(s, await ring('ch' + i, 400, [[P[i], 1]], 36), cx - dd / 2, Y0, dd, dd);
          t.text(s, L.pad2(i + 1), { x: cx - 0.4, y: Y0, w: 0.8, h: dd, bold: true, fontSize: 18, color: P[i] === C.yellow ? C.navy : P[i], align: 'center', valign: 'middle' });
          head(s, st.h, cx - cw / 2 + 0.1, Y0 + dd + 0.08, cw - 0.2, 0.5, { align: 'center' });
          body(s, st.t, cx - cw / 2 + 0.1, Y0 + dd + 0.6, cw - 0.2, Y1 - Y0 - dd - 0.6, { align: 'center', max: 13 });
        }
      },
      async (d) => { // the navy night: one axis, rings threaded on it, steps left and right
        const s = night(d), n = d.steps.length, cx = W / 2, w = 3.75, rh = (Y1 - Y0) / n, bh = Math.min(rh * 2 - 0.1, 1.55);
        t.line(s, cx, Y0, 0, Y1 - Y0, DK2, 3, { name: 'Axis' });
        d.steps.forEach((st, i) => {
          const right = i % 2 === 1, y = Y0 + i * rh, x = right ? cx + 0.5 : cx - 0.5 - w, a = right ? 'left' : 'right', dd = 0.56;
          disc(s, cx - dd / 2, y, dd, i + 1, P[i], C.navy);
          head(s, st.h, x, y, w, 0.4, { color: 'FFFFFF', align: a, max: 17 });
          body(s, st.t, x, y + 0.42, w, Math.min(bh - 0.44, 5.08 - (Y0 + (n - 1) * rh + 0.42)), { color: SOFT, align: a, max: 13 });
        });
      },
      async (d) => { // discs rolling down a slope, each one's step at its right
        const s = page(d), n = d.steps.length, rh = (Y1 - Y0) / n, shift = n === 4 ? 0.72 : 1.0, dd = Math.min(rh - 0.1, 0.78);
        s.addShape(t.S.LINE, { x: X0 + dd / 2, y: Y0 + dd / 2, w: shift * (n - 1), h: rh * (n - 1), line: { color: C.ring, width: 3 }, objectName: 'Slope' });
        d.steps.forEach((st, i) => {
          const x = X0 + i * shift, y = Y0 + i * rh;
          disc(s, x, y + (rh - dd) / 2 - 0.02, dd, i + 1, P[i]);
          const tx = x + dd + 0.16, tw = 9.4 - tx;
          head(s, st.h, tx, y, tw, 0.32, { max: 16 });
          body(s, st.t, tx, y + 0.33, tw, rh - 0.36, { max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // the leading figure in a great ring, the other two in small rings beside it
        const s = page(d), [a, ...rest] = d.stats, dd = d.note ? 2.72 : 3.3, f = pct(a.value), rx = X0 + dd + 0.35, rw = 9.4 - rx, rh = dd / 2, sd = Math.min(1.14, rh - 0.1);
        t.img(s, await ring('sL' + f, 700, [[C.blue, f ?? 1]], 58, 0, C.ring), X0, Y0, dd, dd);
        t.text(s, a.value, { x: X0 + 0.45, y: Y0 + dd * 0.22, w: dd - 0.9, h: dd * 0.3, bold: true, color: C.navy, align: 'center', valign: 'middle', fontSize: L.fit(a.value, dd - 0.95, dd * 0.28, 42, 18, F.head, true) });
        body(s, a.label, X0 + 0.52, Y0 + dd * 0.53, dd - 1.04, dd * 0.28, { align: 'center', max: 12 });
        for (const [i, x] of rest.entries()) {
          const y = Y0 + i * rh, c = i ? C.violet : C.pink, g = pct(x.value);
          t.img(s, await ring('sS' + i + g, 300, [[c, g ?? 1]], 30, 0, C.ring), rx, y + (rh - sd) / 2, sd, sd);
          t.text(s, x.value, { x: rx + sd + 0.15, y: y + 0.1, w: rw - sd - 0.15, h: rh * 0.44, bold: true, color: c, valign: 'bottom', fontSize: L.fit(x.value, rw - sd - 0.15, rh * 0.42, 30, 18, F.head, true) });
          body(s, x.label, rx + sd + 0.15, y + 0.12 + rh * 0.44, rw - sd - 0.15, rh * 0.5 - 0.14, { max: 13 });
        }
        if (d.note) body(s, d.note, X0, Y0 + dd + 0.06, CW - 0.4, 5.08 - Y0 - dd - 0.06, { max: 12 });
      },
      async (d) => { // the navy night: three nested rings, a key beside them
        const s = night(d), dd = 3.45, x = X0, y = 1.42, cols = [C.pink, C.yellow, C.green], rx = 4.55, rw = 4.85, rh = d.note ? 0.9 : 1.15;
        for (const [i, v] of d.stats.entries()) {
          const m = i * 0.5, g = pct(v.value);
          t.img(s, await ring('nest' + i + g, 600 - i * 170, [[cols[i], g ?? 1]], 34, 0, DK2), x + m, y + m, dd - 2 * m, dd - 2 * m);
          const yy = y + i * rh;
          t.oval(s, rx, yy + rh / 2 - 0.13, 0.26, 0.26, cols[i]);
          t.text(s, v.value, { x: rx + 0.4, y: yy, w: 1.9, h: rh - 0.04, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(v.value, 1.85, rh - 0.1, 30, 16, F.head, true) });
          body(s, v.label, rx + 2.4, yy + 0.04, rw - 2.4, rh - 0.12, { color: SOFT, valign: 'middle', max: 14 });
        }
        if (d.note) body(s, d.note, rx, y + 3 * rh + 0.04, rw, Y1 + 0.05 - y - 3 * rh - 0.04, { color: SOFT, max: 12 });
      },
      async (d) => { // three solid discs overlapping like a Venn, the labels under them
        const s = page(d), dd = d.note ? 1.95 : 2.4, ov = 0.26, tot = 3 * dd - 2 * ov, x0 = (W - tot) / 2, cols = [C.blue, C.pink, C.violet];
        d.stats.forEach((v, i) => {
          const x = x0 + i * (dd - ov);
          t.oval(s, x, Y0, dd, dd, cols[i], { t: 8, line: { color: C.bg, width: 3 }, name: 'Disc' });
        });
        d.stats.forEach((v, i) => {
          const x = x0 + i * (dd - ov), lw = dd - ov - 0.1;
          t.text(s, v.value, { x: x + ov + 0.04, y: Y0, w: dd - 2 * ov - 0.08, h: dd, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(v.value, dd - 2 * ov - 0.14, dd * 0.42, 36, 16, F.head, true) });
          body(s, v.label, x + ov / 2 + 0.03, Y0 + dd + 0.06, lw, d.note ? 0.62 : 0.95, { color: C.navy, align: 'center', max: 13 });
        });
        if (d.note) body(s, d.note, X0, 4.1, CW, 0.95, { align: 'center', max: 13 });
      },
    ],
    compare: [
      async (d) => { // a Venn: two great tinted circles, each with its list, overlapping at the middle
        const s = page(d), dd = 3.72, ov = 0.42, tot = 2 * dd - ov, x0 = (W - tot) / 2, y = 1.33, w = 2.55, tin = ['DCE9FF', 'FFDCEB'], cols = [C.blue, C.pink];
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.12, 2.0);
        [d.left, d.right].forEach((side, i) => { t.oval(s, x0 + i * (dd - ov), y, dd, dd, tin[i], { t: 8, name: 'Circle' }); });
        [d.left, d.right].forEach((side, i) => {
          const cx = x0 + (i ? dd - ov : 0) + dd / 2 + (i ? 0.1 : -0.1), tx = cx - w / 2;
          head(s, side.h, tx, y + 0.28, w, 0.46, { color: cols[i], align: 'center', max: 17 });
          let yy = y + 0.78;
          side.items.forEach((it, k) => { t.text(s, it, { x: tx, y: yy, w, h: rows[k], fontSize: fs, color: C.navy, align: 'center' }); yy += rows[k]; });
        });
      },
      async (d) => { // two capsule bands stacked, a ring at the head of each
        const s = page(d), h = (Y1 - Y0 - 0.16) / 2;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = Y0 + i * (h + 0.16), dark = i === 1, ink = dark ? 'FFFFFF' : C.navy, n = side.items.length, rh = (h - 0.18) / n, col = dark ? C.yellow : C.blue;
          t.rect(s, X0, y, CW, h, dark ? C.navy : 'FFFFFF', { r: Math.min(h / 2, 0.5), line: { color: dark ? C.navy : C.ring, width: 1 }, name: 'Capsule' });
          t.img(s, await ring('cap' + i, 300, [[col, 1]], 40), X0 + 0.2, y + h / 2 - 0.3, 0.6, 0.6);
          head(s, side.h, X0 + 0.95, y + 0.08, 2.0, h - 0.16, { color: ink, max: 16 });
          side.items.forEach((it, k) => {
            const yy = y + 0.09 + k * rh;
            t.oval(s, X0 + 3.08, yy + rh / 2 - 0.06, 0.12, 0.12, null, { line: { color: col, width: 1.5 } });
            body(s, it, X0 + 3.3, yy, CW - 3.75, rh - 0.02, { color: ink, valign: 'middle', max: 13 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the navy night: the words at the centre of a great ring, the note at its side
        const s = night(d), dd = 3.85, x = 5.5, y = 1.27;
        t.img(s, await ring('stN', 800, quarter, 44, 10), x, y, dd, dd);
        t.text(s, L.runs(d.text), { x: x + 0.56, y: y + 0.56, w: dd - 1.12, h: dd - 1.12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(d.text, dd - 1.14, dd - 1.18, 24, 12, F.head, true) });
        if (d.caption) t.text(s, d.caption, { x: X0, y: 1.6, w: 4.5, h: 3.1, fontSize: L.fit(d.caption, 4.5, 3.1, 16, 10, F.body), color: SOFT, valign: 'middle' });
      },
      async (d) => { // one long pink capsule across the page, the note under it, three dots following
        const s = page(d), hh = d.caption ? 2.0 : 3.0;
        t.rect(s, X0, Y0 + 0.1, CW, hh, C.pink, { r: Math.min(hh / 2, 0.9), name: 'Capsule' });
        t.text(s, L.runs(d.text), { x: X0 + 0.65, y: Y0 + 0.14, w: CW - 1.3, h: hh - 0.08, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(d.text, CW - 1.3, hh - 0.14, 32, 18, F.head, true) });
        [C.blue, C.yellow, C.violet].forEach((c, k) => t.oval(s, X0 + 0.15 + k * 0.32, Y0 + hh + 0.26, 0.22, 0.22, c));
        if (d.caption) t.text(s, d.caption, { x: X0 + 1.25, y: Y0 + hh + 0.2, w: CW - 1.5, h: Y1 - Y0 - hh - 0.2, fontSize: L.fit(d.caption, CW - 1.5, Y1 - Y0 - hh - 0.2, 14, 10, F.body), color: C.navy });
      },
    ],
    timeline: [
      async (d) => { // a clock face: four hours marked, an event in each corner
        const s = page(d), cx = W / 2, cy = (Y0 + Y1) / 2, rr = 1.05, w = 3.2, hh = (Y1 - Y0 - 0.12) / 2;
        const ticks = Array.from({ length: 12 }, (_, k) => { const a = (k * Math.PI) / 6, r1 = 180, r2 = k % 3 ? 168 : 152; return `<line x1="${200 + r1 * Math.cos(a)}" y1="${200 + r1 * Math.sin(a)}" x2="${200 + r2 * Math.cos(a)}" y2="${200 + r2 * Math.sin(a)}"/>`; }).join('');
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="200" r="194" fill="#FFFFFF" stroke="#${C.navy}" stroke-width="10"/><g stroke="#${C.navy}" stroke-width="6">${ticks}</g><line x1="200" y1="200" x2="200" y2="90" stroke="#${C.pink}" stroke-width="10" stroke-linecap="round"/><line x1="200" y1="200" x2="280" y2="240" stroke="#${C.blue}" stroke-width="10" stroke-linecap="round"/><circle cx="200" cy="200" r="16" fill="#${C.navy}"/></svg>`, 800, 800), cx - rr, cy - rr, 2 * rr, 2 * rr, { alt: '' });
        const spots = [[X0, Y0], [W - X0 - w, Y0], [W - X0 - w, Y0 + hh + 0.12], [X0, Y0 + hh + 0.12]];
        d.items.forEach((it, i) => {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right';
          t.text(s, it.year, { x, y, w, h: 0.42, bold: true, color: P[i] === C.yellow ? 'B98500' : P[i], align: a, valign: 'middle', fontSize: L.fit(it.year, w, 0.4, 24, 13, F.head, true) });
          head(s, it.h, x, y + 0.42, w, 0.3, { align: a, max: 15 });
          body(s, it.t, x, y + 0.74, w, hh - 0.76, { align: a, max: 13 });
        });
      },
      async (d) => { // beads on a thread down the left, a date inside each
        const s = page(d), n = d.items.length, rh = (Y1 - Y0) / n, dd = Math.min(0.82, rh - 0.04), lx = X0 + dd / 2;
        t.line(s, lx, Y0 + 0.2, 0, Y1 - Y0 - 0.4, C.ring, 3, { name: 'Thread' });
        d.items.forEach((it, i) => {
          const y = Y0 + i * rh;
          t.oval(s, X0, y + (rh - dd) / 2, dd, dd, P[i], { line: { color: C.bg, width: 3 } });
          t.text(s, it.year, { x: X0 + 0.04, y: y + (rh - dd) / 2, w: dd - 0.08, h: dd, bold: true, color: onP(P[i]), align: 'center', valign: 'middle', fontSize: L.fit(it.year, dd - 0.1, dd * 0.58, 15, 9, F.head, true) });
          head(s, it.h, X0 + dd + 0.22, y + 0.02, CW - dd - 0.22, 0.32, { max: 16 });
          body(s, it.t, X0 + dd + 0.22, y + 0.35, CW - dd - 0.22, rh - 0.39, { max: 13 });
        });
      },
      async (d) => { // the navy night: the dates travel along one arc, each event beneath it
        const s = night(d), n = d.items.length, cw = CW / n, pw = 880, ph = 90, dd = 0.84, cy = [2.0, 1.72, 1.72, 2.0];
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}"><path d="M60,${ph - 10} C${pw * 0.3},0 ${pw * 0.7},0 ${pw - 60},${ph - 10}" fill="none" stroke="#${DK2}" stroke-width="10"/></svg>`, pw * 2, ph * 2), X0, 1.45, CW, 0.9, { alt: '' });
        d.items.forEach((it, i) => {
          const cx = X0 + i * cw + cw / 2, y = cy[i] - dd / 2, ty = y + dd + 0.06;
          t.oval(s, cx - dd / 2, y, dd, dd, P[i], { line: { color: C.navy, width: 3 } });
          t.text(s, it.year, { x: cx - dd / 2 + 0.04, y, w: dd - 0.08, h: dd, bold: true, color: onP(P[i]), align: 'center', valign: 'middle', fontSize: L.fit(it.year, dd - 0.1, dd * 0.58, 15, 9, F.head, true) });
          head(s, it.h, cx - cw / 2 + 0.08, ty, cw - 0.16, 0.42, { color: 'FFFFFF', align: 'center', max: 15 });
          body(s, it.t, cx - cw / 2 + 0.08, ty + 0.43, cw - 0.16, Y1 + 0.05 - ty - 0.43, { color: SOFT, align: 'center', max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.stats = V.stats.shift(); // the old stats (rings over columns) read like the cards page
  R.timeline = V.timeline.shift(); // the old timeline (discs over columns) too
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (type === 'quote' ? { x: 0.7, y: 5.15, w: 5.8, h: 0.25, color: 'C9D3E6' } : { x: 0.6, y: 5.15, w: d._stampW || (type === 'cover' || type === 'closing' ? 5.0 : 8.0), h: 0.25, color: d._night ? SOFT : C.gray }));
  return L.save(pres, out, { name: 'SlideAI Radial', colors: { dk1: C.navy, lt1: 'FFFFFF', dk2: '2B3A5C', lt2: C.bg, accent1: C.blue, accent2: C.pink, accent3: C.yellow, accent4: C.violet, accent5: C.green, accent6: C.ring, hlink: C.blue, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "tizimli: o'zaro bog'liqlik, sabab-oqibat va sikllarni ko'rsat", "limits": {}};
module.exports = { id: 19, slug: 'radial', name: 'Doira', category: 'business', build, style: STYLE };
