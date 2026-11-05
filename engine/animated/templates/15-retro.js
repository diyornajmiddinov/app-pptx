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
      const nr = Math.max(d.left.items.length, d.right.items.length), { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.95, F.body, 0, h - 1.0 - 0.12 - 0.2 * (nr - 1));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), fg = i ? C.cream : C.brown;
        t.rect(s, x, y, w, h, i ? C.brown : C.cream, { r: 0.3, name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: i ? C.mustard : C.rust });
        let yy = y + 1.0;
        side.items.forEach((it, k) => {
          t.oval(s, x + 0.38, yy + 0.07, 0.14, 0.14, ARC[k % 4]);
          t.text(s, it, { x: x + 0.65, y: yy, w: w - 0.95, h: rows[k] + 0.05, fontSize: CFS, color: fg });
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
  // ---- further ways to draw a type, in this template's 1970s world (rainbow arcs, stripes, a television set, a record, the brown lounge): a deck's pages must not look alike (L.pages)
  const X0 = 0.6, CW = 8.8, Y0 = 1.5, Y1 = 4.9;
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(txt, w, h, o.max || 16, 11, F.head, true), color: o.color || C.brown, align: o.align, valign: o.valign || 'middle' });
  const lounge = (d) => { // the brown lounge: same corner rainbow, the lights turned down
    d._night = true;
    const s = pres.addSlide(); s.background = { color: C.brown };
    t.img(s, corner, 8.3, 0, 1.7, 1.7);
    t.text(s, d.title, { x: 0.6, y: 0.4, w: 7.5, h: 0.85, fontFace: F.head, bold: true, color: C.cream, valign: 'middle', fontSize: L.fit(d.title, 7.5, 0.85, 28, 18, F.head, true) });
    t.oval(s, 9.0, 4.95, 0.42, 0.42, C.mustard);
    s.slideNumber = { x: 9.0, y: 4.95, w: 0.42, h: 0.42, fontFace: F.body, fontSize: 11, bold: true, color: C.brown, align: 'center', valign: 'middle' };
    return s;
  };
  const ball = (s, x, y, dd, n, c) => { t.oval(s, x, y, dd, dd, c, { line: { color: C.bg, width: 3 } }); t.text(s, String(n), { x, y, w: dd, h: dd, fontFace: F.head, bold: true, fontSize: Math.round(dd * 27), color: ON(c), align: 'center', valign: 'middle' }); };
  const rings = (s, cx, cy, dd, band) => ARC.forEach((c, k) => t.oval(s, cx - dd / 2 + k * band, cy - dd / 2 + k * band, dd - 2 * k * band, dd - 2 * k * band, c));
  const V = {
    image: [
      async (d) => { // a television set from the living room, the picture on its screen
        const s = page(d), x = 5.05, y = 1.72, w = 4.35, h = 3.05;
        t.line(s, x + w / 2, y, -0.55, -0.32, C.brown, 2.25, { name: 'Aerial' }); t.line(s, x + w / 2, y, 0.55, -0.32, C.brown, 2.25, { name: 'Aerial', flipV: true });
        t.rect(s, x, y, w, h, C.brown, { r: 0.28, name: 'Set' });
        await PH(s, d.image, x + 0.16, y + 0.16, w - 1.0, h - 0.32, { mask: { r: 0.22 } });
        t.oval(s, x + w - 0.68, y + 0.3, 0.42, 0.42, C.mustard); t.oval(s, x + w - 0.68, y + 0.9, 0.42, 0.42, C.orange);
        [0, 1, 2, 3].forEach((k) => t.rect(s, x + w - 0.68, y + 1.6 + k * 0.2, 0.42, 0.08, C.muted, { name: 'Vent' }));
        t.text(s, d.text, { x: X0, y: Y0, w: 4.15, h: Y1 - Y0, fontSize: L.fit(d.text, 4.15, Y1 - Y0, 14, 10, F.body, false, 1.2), color: C.brown, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the lounge: the picture is the label of a record ringed with the rainbow
        const s = lounge(d), dd = 3.45, cx = 2.5, cy = 3.2, ph = dd - 0.72;
        rings(s, cx, cy, dd, 0.09);
        t.img(s, await L.photo(L.src(d.image), ph, ph, { mask: 'circle' }), cx - ph / 2, cy - ph / 2, ph, ph, { alt: '' });
        t.text(s, d.text, { x: 4.5, y: Y0, w: 4.9, h: Y1 - Y0, fontSize: L.fit(d.text, 4.9, Y1 - Y0, 14, 10, F.body, false, 1.2), color: C.cream, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the picture across the page, a cream card over it with the stripes on top
        const s = page(d);
        await PH(s, d.image, 0, 0, W, H);
        t.rect(s, 3.7, 0.4, 5.85, 4.6, C.cream, { r: 0.3, name: 'Card' });
        t.text(s, d.title, { x: 4.0, y: 0.55, w: 5.25, h: 0.95, fontFace: F.head, bold: true, color: C.brown, valign: 'middle', fontSize: L.fit(d.title, 5.25, 0.92, 24, 16, F.head, true) });
        stripes(s, 4.0, 1.55, 5.25);
        t.text(s, d.text, { x: 4.0, y: 1.95, w: 5.25, h: 2.92, fontSize: L.fit(d.text, 5.25, 2.92, 14, 10, F.body, false, 1.15), color: C.brown, lineSpacingMultiple: 1.15 });
        t.rect(s, 0, 5.1, W, H - 5.1, C.bg, { name: 'Footer band' });
        t.oval(s, 9.0, 4.95, 0.42, 0.42, C.orange);
      },
      async (d) => { // a wide rainbow dome rises over the picture like a sunrise, the words under it
        const s = page(d), x = X0, y = 1.4, w = CW, h = 2.15, b = 0.1, px = Math.round(w * 100), py = Math.round(h * 100), bb = b * 100;
        const paths = ARC.map((c, k) => { const m = k * bb; return `<path d="M${m},${py} A${px / 2 - m},${py - m} 0 0 1 ${px - m},${py} Z" fill="#${c}"/>`; }).join('');
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${py}">${paths}</svg>`, px * 2, py * 2), x, y, w, h, { alt: '' });
        const m = 4 * b;
        t.img(s, await L.photo(L.src(d.image), w - 2 * m, h - m, { mask: { path: 'M0,1 C0,0.42 0.22,0 0.5,0 C0.78,0 1,0.42 1,1 Z' } }), x + m, y + m, w - 2 * m, h - m, { alt: '' });
        stripes(s, X0, y + h + 0.03, CW);
        const ty = y + h + 0.32;
        t.text(s, d.text, { x: X0, y: ty, w: CW - 0.1, h: 5.08 - ty, fontSize: L.fit(d.text, CW - 0.1, 5.06 - ty, 14, 10, F.body), color: C.brown });
      },
    ],
    cards: [
      async (d) => { // cream lozenges, each with a coloured disc breaking its left edge
        const s = page(d), n = d.items.length, gap = 0.14, h = (Y1 - Y0 - gap * (n - 1)) / n, dd = Math.min(h + 0.06, 1.0);
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + i * (h + gap), x = X0 + dd / 2;
          t.rect(s, x, y, CW - dd / 2, h, C.cream, { r: Math.min(h / 2, 0.42), name: 'Lozenge' });
          t.oval(s, X0, y + (h - dd) / 2, dd, dd, ARC[i % 4], { line: { color: C.bg, width: 3 } });
          t.img(s, await L.icon(it.icon, ON(ARC[i % 4]), 2.25), X0 + dd * 0.27, y + (h - dd) / 2 + dd * 0.27, dd * 0.46, dd * 0.46);
          head(s, it.h, X0 + dd + 0.14, y + 0.05, 2.25, h - 0.1, { max: 15 });
          body(s, it.t, X0 + dd + 2.5, y + 0.05, CW - dd - 2.8, h - 0.1, { valign: 'middle', color: C.brown, max: 13 });
        }
      },
      async (d) => { // four colour blocks of a 70s wallpaper, two by two
        const s = page(d), n = d.items.length, gap = 0.16, w = (CW - gap) / 2, h = (Y1 - Y0 - gap) / 2;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, x = X0 + (i % 2) * (w + gap), y = Y0 + Math.floor(i / 2) * (h + gap), ww = wide ? CW : w, col = ARC[i % 4], ink = ON(col);
          t.rect(s, x, y, ww, h, col, { r: 0.24, name: 'Block' });
          t.img(s, await L.icon(it.icon, ink, 2.25), x + 0.22, y + 0.17, 0.34, 0.34);
          head(s, it.h, x + 0.66, y + 0.14, ww - 0.85, 0.4, { color: ink, max: 16 });
          body(s, it.t, x + 0.22, y + 0.6, ww - 0.44, h - 0.68, { color: ink, max: 13 });
        }
      },
      async (d) => { // the lounge: cream cards at two heights, a small arch over each
        const s = lounge(d), n = d.items.length, gap = 0.18, w = (CW - gap * (n - 1)) / n, h = 2.6, aw = 1.14;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + gap), y = i % 2 ? 2.0 : 1.72;
          t.img(s, arcs[ARC[i % 4]], x + (w - aw) / 2, y - 0.3, aw, aw * 190 / 360);
          t.rect(s, x, y + 0.26, w, h, C.cream, { r: 0.22, name: 'Card' });
          t.img(s, await L.icon(it.icon, DARK[i % 4], 2.25), x + (w - 0.3) / 2, y - 0.03, 0.3, 0.3);
          head(s, it.h, x + 0.16, y + 0.34, w - 0.32, 0.55, { align: 'center', max: 14 });
          body(s, it.t, x + 0.16, y + 0.9, w - 0.32, h - 0.72, { align: 'center', color: C.brown, max: 13 });
        }
      },
      async (d) => { // a target of the rainbow colours at the centre, the items around it
        const s = page(d), n = d.items.length, cx = W / 2, cy = (Y0 + Y1) / 2, dd = 2.3, w = 2.95, hh = (Y1 - Y0 - 0.14) / 2;
        rings(s, cx, cy, dd, 0.22);
        t.oval(s, cx - 0.24, cy - 0.24, 0.48, 0.48, C.cream);
        const spots = n === 4 ? [[X0, Y0], [W - X0 - w, Y0], [X0, Y0 + hh + 0.14], [W - X0 - w, Y0 + hh + 0.14]] : [[X0, Y0], [W - X0 - w, cy - hh / 2], [X0, Y0 + hh + 0.14]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right';
          t.img(s, await L.icon(it.icon, DARK[i % 4], 2.25), right ? x : x + w - 0.3, y + 0.04, 0.3, 0.3);
          head(s, it.h, right ? x + 0.38 : x, y + 0.02, w - 0.38, 0.36, { align: a, max: 15 });
          body(s, it.t, x, y + 0.42, w, hh - 0.44, { align: a, color: C.brown, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a rainbow ribbon waving across the page, the steps on its crests and troughs
        const s = page(d), n = d.steps.length, cw = CW / n, ly = 3.2, amp = 0.32, pw = 880, ph = 120;
        const seg = pw / n, wave = (off) => { let p = `M0,${ph / 2 + off}`; for (let k = 0; k < n; k++) { const dir = k % 2 ? 1 : -1; p += ` Q${k * seg + seg / 2},${ph / 2 + off + dir * ph * 0.9} ${(k + 1) * seg},${ph / 2 + off}`; } return p; };
        const paths = [C.rust, C.orange, C.mustard].map((c, k) => `<path d="${wave((k - 1) * 11)}" fill="none" stroke="#${c}" stroke-width="8"/>`).join('');
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}" viewBox="0 0 ${pw} ${ph}">${paths}</svg>`, pw * 2, ph * 2), X0, ly - 0.6, CW, 1.2, { alt: '' });
        d.steps.forEach((st, i) => {
          const up = i % 2 === 0, x = X0 + i * cw, dd = 0.56, cy = ly + (up ? -amp : amp);
          ball(s, x + cw / 2 - dd / 2, cy - dd / 2, dd, i + 1, ARC[i % 4]);
          const ty = up ? ly + 0.22 : Y0 - 0.06, th = up ? Y1 + 0.1 - ty : ly + 0.08 - ty;
          head(s, st.h, x + 0.08, ty, cw - 0.16, 0.34, { align: 'center', max: 14 });
          body(s, st.t, x + 0.08, ty + 0.34, cw - 0.16, th - 0.34, { align: 'center', color: C.brown, max: 12 });
        });
      },
      async (d) => { // chunky steps rising, colours of the rainbow
        const s = page(d), n = d.steps.length, gap = 0.08, w = (CW - gap * (n - 1)) / n, rise = n === 4 ? 0.26 : 0.34, top = Y0 + rise * (n - 1) + 0.02;
        d.steps.forEach((st, i) => {
          const x = X0 + i * (w + gap), y = top - i * rise, col = ARC[i % 4], ink = ON(col), h = Y1 - y;
          t.rect(s, x, y, w, h, col, { r: 0.2, name: 'Step' });
          t.text(s, String(i + 1), { x: x + 0.16, y: y + 0.06, w: 0.7, h: 0.55, fontFace: F.head, bold: true, fontSize: 30, color: ink, valign: 'middle' });
          head(s, st.h, x + 0.16, y + 0.62, w - 0.32, 0.5, { color: ink, max: 14, valign: 'top' });
          body(s, st.t, x + 0.16, y + 1.14, w - 0.32, h - 1.22, { color: ink, max: 12 });
        });
      },
      async (d) => { // the lounge: three stripes run down the middle, steps to either side
        const s = lounge(d), n = d.steps.length, cx = W / 2, w = 3.5, rh = (Y1 - Y0) / n, bh = Math.min(rh * 2 - 0.1, 1.55);
        [C.rust, C.orange, C.mustard].forEach((c, k) => t.rect(s, cx - 0.14 + k * 0.1, Y0, 0.07, Y1 - Y0, c, { name: 'Stripe' }));
        d.steps.forEach((st, i) => {
          const right = i % 2 === 1, y = Y0 + i * rh, x = right ? cx + 0.48 : cx - 0.48 - w, a = right ? 'left' : 'right', dd = 0.52;
          t.oval(s, cx - dd / 2, y, dd, dd, ARC[i % 4], { line: { color: C.brown, width: 3 } });
          t.text(s, String(i + 1), { x: cx - dd / 2, y, w: dd, h: dd, fontFace: F.head, bold: true, fontSize: 14, color: ON(ARC[i % 4]), align: 'center', valign: 'middle' });
          head(s, st.h, x, y, w, 0.42, { align: a, color: C.mustard, max: 16 });
          body(s, st.t, x, y + 0.44, w, Math.min(bh - 0.46, 5.1 - (Y0 + (n - 1) * rh + 0.44)), { align: a, color: C.cream, max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // a rainbow target with the leading figure at its heart, the rest listed beside it
        const s = page(d), [a, ...rest] = d.stats, dd = d.note ? 2.72 : 3.3, cx = X0 + dd / 2, cy = Y0 - 0.05 + dd / 2, inner = dd - 8 * 0.11;
        rings(s, cx, cy, dd, 0.11);
        t.oval(s, cx - inner / 2, cy - inner / 2, inner, inner, C.cream);
        t.text(s, a.value, { x: cx - inner / 2 + 0.12, y: cy - inner / 2, w: inner - 0.24, h: inner, fontFace: F.head, bold: true, color: C.rust, align: 'center', valign: 'middle', fontSize: L.fit(a.value, inner - 0.3, inner * 0.5, 44, 18, F.head, true) });
        const lx = X0 + dd + 0.35, lw = 9.4 - lx, rh = dd / 3;
        head(s, a.label, lx, Y0 - 0.05, lw, rh - 0.08, { max: 16, color: C.rust });
        rest.forEach((x, i) => {
          const y = Y0 - 0.05 + (i + 1) * rh;
          t.line(s, lx, y - 0.02, lw, 0, C.orange, 1.5);
          t.text(s, x.value, { x: lx, y: y + 0.02, w: 1.95, h: rh - 0.08, fontFace: F.head, bold: true, color: DARK[i + 1], valign: 'middle', fontSize: L.fit(x.value, 1.9, rh - 0.12, 30, 16, F.head, true) });
          body(s, x.label, lx + 2.0, y + 0.02, lw - 2.0, rh - 0.08, { color: C.brown, valign: 'middle', max: 14 });
        });
        if (d.note) body(s, d.note, X0, Y0 + dd + 0.02, 8.2, 5.06 - Y0 - dd, { max: 13 });
      },
      async (d) => { // the lounge: three stripes across the whole page, a figure on each
        const s = lounge(d), rh = d.note ? 0.82 : 1.05, cols = [C.rust, C.orange, C.teal];
        d.stats.forEach((x, i) => {
          const y = Y0 + i * (rh + 0.06);
          t.rect(s, 0, y, W, rh, cols[i], { name: 'Stripe' });
          t.text(s, x.value, { x: X0, y, w: 3.3, h: rh, fontFace: F.head, bold: true, color: C.cream, valign: 'middle', fontSize: L.fit(x.value, 3.25, rh - 0.1, 42, 20, F.head, true) });
          body(s, x.label, X0 + 3.5, y + 0.04, CW - 3.5, rh - 0.08, { color: C.cream, valign: 'middle', max: 16 });
        });
        if (d.note) body(s, d.note, X0, Y0 + 3 * (rh + 0.06) + 0.04, 8.2, 5.1 - Y0 - 3 * (rh + 0.06) - 0.04, { color: C.cream, max: 13 });
      },
    ],
    compare: [
      async (d) => { // two rounded halves meet, mirrored, a sun sits on the seam
        const s = page(d), w = CW / 2, h = Y1 - Y0, cx = X0 + w, tw = w - 0.75;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, tw, F.body, 0.16, h - 0.95);
        t.rect(s, X0, Y0, w + 0.4, h, C.rust, { r: 0.3, name: 'Half' }); t.rect(s, cx - 0.4 + 0.4, Y0, w, h, C.teal, { r: 0.3, name: 'Half' }); t.rect(s, cx, Y0, 0.4, h, C.teal, { name: 'Seam' });
        head(s, d.left.h, X0 + 0.25, Y0 + 0.16, tw, 0.55, { color: C.mustard, align: 'right', max: 19 }); head(s, d.right.h, cx + 0.5, Y0 + 0.16, tw, 0.55, { color: C.mustard, max: 19 });
        const av = h - 0.95; let y = Y0 + 0.82;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: X0 + 0.25, y, w: tw, h: rows[k], fontSize: fs, color: C.cream, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: cx + 0.5, y, w: tw, h: rows[k], fontSize: fs, color: C.cream });
          y += Math.max(rows[k], Math.min(0.68, av / rows.length));
        }
        t.oval(s, cx - 0.34, Y0 + h / 2 - 0.34, 0.68, 0.68, C.mustard, { line: { color: C.bg, width: 3 } });
      },
      async (d) => { // two stacked bands, three stripes down the side of each
        const s = page(d), h = (Y1 - Y0 - 0.14) / 2;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = Y0 + i * (h + 0.14), dark = i === 1, ink = dark ? C.cream : C.brown, n = side.items.length, rh = (h - 0.16) / n;
          t.rect(s, X0, y, CW, h, dark ? C.brown : C.cream, { r: 0.24, name: 'Band' });
          head(s, side.h, X0 + 0.25, y + 0.08, 2.15, h - 0.16, { color: dark ? C.mustard : C.rust, max: 18 });
          [C.rust, C.orange, C.mustard].forEach((c, k) => t.rect(s, X0 + 2.5 + k * 0.09, y + 0.14, 0.05, h - 0.28, c, { name: 'Stripe' }));
          side.items.forEach((it, k) => {
            t.oval(s, X0 + 2.92, y + 0.08 + k * rh + rh / 2 - 0.06, 0.12, 0.12, ARC[k % 4]);
            body(s, it, X0 + 3.14, y + 0.08 + k * rh, CW - 3.35, rh - 0.02, { color: ink, valign: 'middle', max: 13 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the lounge: words in cream, the great rainbow rising in the corner
        const s = lounge(d), hh = d.caption ? 2.0 : 3.3;
        t.img(s, big, 7.1, 2.725, 2.9, 2.9);
        t.text(s, L.runs(d.text), { x: X0, y: Y0, w: 6.75, h: hh, fontFace: F.head, bold: true, color: C.cream, valign: 'middle', fontSize: L.fit(d.text, 6.75, hh - 0.05, 34, 18, F.head, true) });
        if (d.caption) t.text(s, d.caption, { x: X0, y: Y0 + hh + 0.1, w: 6.3, h: Y1 - Y0 - hh - 0.05, fontSize: L.fit(d.caption, 6.3, Y1 - Y0 - hh - 0.05, 14, 10, F.body), color: C.mustard });
        d._stampW = 6.3;
      },
      async (d) => { // an orange banner from edge to edge between stripes
        const s = page(d), hh = d.caption ? 1.95 : 3.0;
        stripes(s, 0, Y0 - 0.02, W);
        t.rect(s, 0, Y0 + 0.26, W, hh, C.orange, { name: 'Banner' });
        t.text(s, L.runs(d.text), { x: X0, y: Y0 + 0.3, w: CW, h: hh - 0.08, fontFace: F.head, bold: true, color: C.cream, valign: 'middle', align: 'center', fontSize: L.fit(d.text, CW, hh - 0.14, 34, 18, F.head, true) });
        if (d.caption) t.text(s, d.caption, { x: X0 + 0.5, y: Y0 + hh + 0.34, w: CW - 1.0, h: Y1 - Y0 - hh - 0.26, fontSize: L.fit(d.caption, CW - 1.0, Y1 - Y0 - hh - 0.26, 14, 10, F.body), color: C.brown, align: 'center' });
      },
    ],
    timeline: [
      async (d) => { // the stripes turned upright, years hung on them like labels
        const s = page(d), n = d.items.length, rh = (Y1 - Y0) / n, lx = 2.25;
        [C.rust, C.orange, C.mustard].forEach((c, k) => t.rect(s, lx + k * 0.09, Y0, 0.06, Y1 - Y0, c, { name: 'Stripe' }));
        d.items.forEach((it, i) => {
          const y = Y0 + i * rh;
          t.text(s, it.year, { x: X0, y: y + 0.02, w: 1.45, h: 0.44, fontFace: F.head, bold: true, color: DARK[i % 4], align: 'right', valign: 'middle', fontSize: L.fit(it.year, 1.45, 0.42, 22, 12, F.head, true) });
          t.oval(s, lx - 0.04, y + 0.1, 0.3, 0.3, C.brown, { line: { color: C.bg, width: 3 } });
          head(s, it.h, lx + 0.5, y + 0.02, 6.6, 0.34, { max: 16 });
          body(s, it.t, lx + 0.5, y + 0.37, 6.65, rh - 0.4, { color: C.brown, max: 13 });
        });
      },
      async (d) => { // the dates ride along one great rainbow arch, each event under its date
        const s = page(d), n = d.items.length, cw = CW / n, pw = 880, ph = 150, dd = 0.82, ys = [2.1, 1.5, 1.5, 2.1];
        const arches = ARC.slice(0, 3).map((c, k) => `<path d="M${10 + 0},${ph - 2 - k * 12} C${pw * 0.28},${-40 - k * 0 + k * 14} ${pw * 0.72},${-40 + k * 14} ${pw - 10},${ph - 2 - k * 12}" fill="none" stroke="#${c}" stroke-width="9"/>`).join('');
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}">${arches}</svg>`, pw * 2, ph * 2), X0, 1.46, CW, 1.5, { alt: '' });
        d.items.forEach((it, i) => {
          const x = X0 + i * cw, cx = x + cw / 2, y = ys[i] - 0.16, col = ARC[i % 4];
          t.oval(s, cx - dd / 2, y, dd, dd, col, { line: { color: C.bg, width: 3 }, name: 'Date' });
          t.text(s, it.year, { x: cx - dd / 2 + 0.03, y, w: dd - 0.06, h: dd, fontFace: F.head, bold: true, color: ON(col), align: 'center', valign: 'middle', fontSize: L.fit(it.year, dd - 0.08, dd * 0.56, 16, 9, F.head, true) });
          const ty = y + dd + 0.06;
          head(s, it.h, x + 0.07, ty, cw - 0.14, 0.42, { align: 'center', max: 14 });
          body(s, it.t, x + 0.07, ty + 0.43, cw - 0.14, Y1 - ty - 0.43, { align: 'center', color: C.brown, max: 12 });
        });
      },
      async (d) => { // the lounge: four postcards, the date on a coloured stamp
        const s = lounge(d), gap = 0.2, w = (CW - gap) / 2, h = (Y1 - Y0 - gap) / 2, sw = 1.3;
        d.items.forEach((it, i) => {
          const x = X0 + (i % 2) * (w + gap), y = Y0 + Math.floor(i / 2) * (h + gap), col = ARC[i % 4];
          t.rect(s, x, y, w, h, C.cream, { r: 0.2, name: 'Postcard' });
          t.rect(s, x + 0.12, y + 0.12, sw, h - 0.24, col, { r: 0.14, name: 'Stamp' });
          t.text(s, it.year, { x: x + 0.15, y: y + 0.12, w: sw - 0.06, h: h - 0.24, fontFace: F.head, bold: true, color: ON(col), align: 'center', valign: 'middle', fontSize: L.fit(it.year, sw - 0.15, 0.9, 22, 11, F.head, true) });
          head(s, it.h, x + sw + 0.25, y + 0.08, w - sw - 0.35, 0.36, { max: 14 });
          body(s, it.t, x + sw + 0.25, y + 0.45, w - sw - 0.35, h - 0.5, { color: C.brown, max: 12 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.timeline = V.timeline.shift(); // the old timeline (stripes, dots, columns) read like the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (type === 'quote' ? { x: 0.7, y: 5.15, w: 5.4, h: 0.25, color: C.mustard } : type === 'cover' || type === 'closing' ? { x: 0.6, y: 5.2, w: 4.8, h: 0.25, color: C.muted } : { x: 0.6, y: 5.15, w: d._stampW || 8.2, h: 0.25, color: d._night ? C.cream : C.muted }));
  return L.save(pres, out, { name: 'SlideAI Retro', colors: { dk1: C.brown, lt1: C.cream, dk2: '5A3A26', lt2: C.bg, accent1: C.orange, accent2: C.mustard, accent3: C.rust, accent4: C.teal, accent5: C.muted, accent6: 'E8CFA3', hlink: C.rust, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "iliq, do'stona, hikoya qiluvchi ohang", "limits": {}};
module.exports = { id: 15, slug: 'retro', name: 'Retro', category: 'creative', build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "energetic"], "transitions": ["p14:flash", "p14:ferris|dir=\"r\"", "zoom"], "cover": ["popOver", "wheel"], "mark": "wheel", "deco": "popOver", "sig": {"title": "popOver", "body": "fadeUp", "item": "bounceDrop", "image": "checker", "number": "wheel", "order": "seq", "stagger": 0.12}, "tempo": 0.9, "kenburns": false};
