/**
 * 25 Rasmiy — formal Uzbek academic style: national-flag colour band on every slide,
 * a classic centred title page ("Bajardi", "Toshkent — 2024"), round photos with rings.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { blue: '0099B5', green: '1EB53A', red: 'CE1126', white: 'FFFFFF', navy: '0B2E4F', gray: '5A6B7B', light: 'F2F6F8', line: 'D5DEE4' };
const F = { head: 'Times New Roman', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  let idx = 0;

  const band = (s) => { // flag stripes: blue / red / white / red / green
    t.rect(s, 0, 0, W, 0.12, C.blue, { name: 'Flag blue' });
    t.rect(s, 0, 0.12, W, 0.02, C.red, { name: 'Flag red' });
    t.rect(s, 0, 0.2, W, 0.02, C.red, { name: 'Flag red' });
    t.rect(s, 0, 0.22, W, 0.12, C.green, { name: 'Flag green' });
  };
  const footer = (s) => {
    t.line(s, 0.6, 5.12, 8.8, 0, C.line, 0.75);
    t.text(s, M.topic || '', { x: 0.6, y: 5.18, w: 4.6, h: 0.25, fontSize: 9, color: C.gray });
    t.text(s, meta, { x: 4.6, y: 5.18, w: 4.8, h: 0.25, fontSize: 9, color: C.gray, align: 'right' });
  };
  const ringPhoto = async (s, img, x, y, d, alt) => {
    t.oval(s, x - 0.12, y - 0.12, d + 0.24, d + 0.24, null, { line: { color: C.blue, width: 3 } });
    t.oval(s, x - 0.22, y - 0.22, d + 0.44, d + 0.44, null, { line: { color: C.green, width: 1 } });
    t.img(s, await L.photo(img, d, d, { mask: 'circle' }), x, y, d, d, { alt });
  };
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.white }; idx++;
    band(s);
    t.oval(s, 8.95, 0.62, 0.45, 0.45, C.blue);
    t.text(s, String(idx), { x: 8.95, y: 0.62, w: 0.45, h: 0.45, fontSize: 12, bold: true, color: C.white, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.55, w: 8.1, h: 0.7, fontFace: F.head, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.7, 26, 18, F.head, true) });
    footer(s);
    return s;
  };

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.white }; idx++;
      band(s);
      t.text(s, M.org || '', { x: 0.6, y: 0.5, w: 8.8, h: 0.35, fontFace: F.head, fontSize: 16, bold: true, color: C.navy, align: 'center' });
      await ringPhoto(s, L.src(d.image), W / 2 - 0.7, 1.05, 1.4, d.title);
      t.text(s, TR.topic, { x: 0.6, y: 2.75, w: 8.8, h: 0.28, fontSize: 11, color: C.gray, align: 'center' });
      const fs = L.fit(d.title, 8.0, 0.95, 32, 20, F.head, true);
      t.text(s, d.title, { x: 1.0, y: 3.0, w: 8.0, h: 0.95, fontFace: F.head, bold: true, fontSize: fs, color: C.navy, align: 'center', valign: 'middle' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 1.5, y: 3.95, w: 7.0, h: 0.5, fontSize: 12, color: C.gray, align: 'center' });
      t.text(s, [{ text: TR.by, options: { color: C.gray } }, { text: M.author || '', options: { bold: true, color: C.navy } }], { x: 5.4, y: 4.5, w: 4.0, h: 0.3, fontSize: 13, align: 'right' });
      t.text(s, [M.loc, M.year].filter(Boolean).join(' \u2014 '), { x: 0.6, y: 5.1, w: 8.8, h: 0.3, fontFace: F.head, fontSize: 13, bold: true, color: C.navy, align: 'center' });
    },
    async intro(d) {
      const s = page(d);
      await ringPhoto(s, L.src(d.image), 6.35, 1.55, 2.8, d.title);
      t.rect(s, 0.6, 1.5, 0.1, 3.2, C.green, { name: 'Accent' });
      t.text(s, d.text, { x: 0.95, y: 1.45, w: 4.95, h: 3.3, fontSize: L.fit(d.text, 4.95, 3.3, 16, 11, F.body, false, 1.3), color: C.navy, lineSpacingMultiple: 1.3, valign: 'middle' });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.5 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.5 + (i % per) * rh, col = i % 2 ? C.green : C.blue;
        t.oval(s, x, y + (rh - 0.6) / 2, 0.6, 0.6, col);
        t.text(s, String(i + 1), { x, y: y + (rh - 0.6) / 2, w: 0.6, h: 0.6, fontFace: F.head, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.8, y, w: 3.4, h: rh, fontFace: F.head, fontSize: 18, color: C.navy, valign: 'middle' });
      });
    },
    async image(d) {
      const s = page(d);
      t.img(s, await L.photo(L.src(d.image), 4.4, 3.5, { mask: { r: 0.2 } }), 0.6, 1.45, 4.4, 3.5, { alt: d.title });
      t.rect(s, 5.35, 1.45, 0.1, 3.5, C.blue, { name: 'Accent' });
      t.text(s, d.text, { x: 5.65, y: 1.45, w: 3.75, h: 3.5, fontSize: L.fit(d.text, 3.75, 3.5, 15, 11, F.body, false, 1.25), color: C.navy, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.45, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.4);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), col = i % 2 ? C.green : C.blue;
        t.rect(s, x, 1.5, w, h, C.light, { line: { color: C.line, width: 0.75 }, name: 'Card' });
        t.oval(s, x + 0.25, 1.72, 0.6, 0.6, col);
        t.img(s, await L.icon(it.icon, C.white, 2), x + 0.4, 1.87, 0.3, 0.3);
        t.text(s, it.h, { x: x + 0.25, y: 2.5, w: w - 0.5, h: 0.45, fontFace: F.head, fontSize: L.fit(it.h, w - 0.5, 0.45, 18, 12, F.head, true), bold: true, color: C.navy });
        t.text(s, it.t, { x: x + 0.25, y: 2.98, w: w - 0.5, h: h - 1.55, fontSize: 14, color: C.gray });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      t.line(s, 0.6 + 0.3, 1.85, cw * (n - 1), 0, C.line, 2);
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.75, 17, 12, F.head, true)));
      const hh = Math.max(...d.steps.map((st) => L.height(st.h, hfs, cw - 0.3, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw, col = i % 2 ? C.green : C.blue;
        t.oval(s, x, 1.55, 0.6, 0.6, col, { line: { color: C.white, width: 3 } });
        t.text(s, String(i + 1), { x, y: 1.55, w: 0.6, h: 0.6, fontFace: F.head, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 2.4, w: cw - 0.3, h: hh + 0.05, fontFace: F.head, fontSize: hfs, bold: true, color: C.navy });
        t.text(s, st.t, { x, y: 2.55 + hh, w: cw - 0.3, h: 2.3 - hh, fontSize: 14, color: C.gray });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n, dd = 1.7, cols = [C.blue, C.green, C.red];
      d.stats.forEach((x, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        t.oval(s, cx - dd / 2, 1.45, dd, dd, C.white, { line: { color: cols[i % 3], width: 6 } });
        t.text(s, x.value, { x: cx - dd / 2 + 0.1, y: 1.45, w: dd - 0.2, h: dd, fontFace: F.head, bold: true, color: C.navy, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd - 0.4, 0.8, 38, 18, F.head, true) });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 3.35, w: cw - 0.4, h: 0.95, fontSize: 14, color: C.gray, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.45, fontSize: 10, italic: true, color: C.gray, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.25;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.6, F.body, 0.22, 4.85 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), col = i ? C.green : C.blue;
        t.rect(s, x, 1.45, w, 0.55, col, { name: 'Header' });
        t.text(s, side.h, { x: x + 0.25, y: 1.45, w: w - 0.5, h: 0.55, fontFace: F.head, fontSize: 18, bold: true, color: C.white, valign: 'middle' });
        t.rect(s, x, 2.0, w, 2.95, C.light, { name: 'Body' });
        let y = 2.2;
        side.items.forEach((it, k) => { t.oval(s, x + 0.25, y + 0.08, 0.12, 0.12, col); t.text(s, it, { x: x + 0.5, y, w: w - 0.6, h: rows[k], fontSize: CFS, color: C.navy }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.5, 8.8, 3.35, C.light, { name: 'Band' });
      t.rect(s, 0.6, 1.5, 0.1, 3.35, C.red, { name: 'Accent' });
      const fs = L.fit(d.text, 7.8, 1.6, 34, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: 1.1, y: 1.7, w: 7.8, h: 1.75, fontFace: F.head, bold: true, fontSize: fs, color: C.navy, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: 1.1, y: 3.6, w: 7.8, h: 1.1, fontSize: L.fit(d.caption, 7.8, 1.1, 15, 11, F.body), color: C.gray });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.3;
      t.rect(s, 0.6, ly - 0.03, 8.8, 0.06, C.blue, { name: 'Axis' });
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.6, fontFace: F.head, bold: true, color: C.navy, valign: 'bottom', fontSize: L.fit(it.year, cw - 0.3, 0.55, 26, 14, F.head, true) });
        t.oval(s, x, ly - 0.15, 0.3, 0.3, i % 2 ? C.green : C.blue, { line: { color: C.white, width: 2.5 } });
        t.text(s, it.h, { x, y: 2.65, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.navy });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.3, h: 1.85, fontSize: 14, color: C.gray });
      });
    },
    async quote(d) {
      const s = page({});
      const fs = L.fit(d.text, 7.4, 2.2, 32, 18, F.head, false, 1, true);
      t.text(s, '\u201C', { x: 4.4, y: 0.6, w: 1.2, h: 1.1, fontFace: F.head, fontSize: 90, bold: true, color: C.blue, align: 'center' });
      t.text(s, d.text, { x: 1.3, y: 1.6, w: 7.4, h: 2.3, fontFace: F.head, italic: true, fontSize: fs, color: C.navy, align: 'center', valign: 'middle' });
      t.rect(s, W / 2 - 0.5, 4.1, 1.0, 0.05, C.green, { name: 'Rule' });
      if (d.author) t.text(s, d.author, { x: 1.3, y: 4.25, w: 7.4, h: 0.4, fontSize: 14, color: C.gray, align: 'center' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.text(s, `${i + 1}.`, { x: 0.6, y, w: 0.45, h: rh, fontFace: F.head, fontSize: 14, bold: true, color: C.blue, valign: 'middle' });
        t.text(s, it, { x: 1.1, y, w: 8.3, h: rh, fontFace: F.head, fontSize: L.fit(it, 8.3, rh - 0.04, 14, 10, F.head), color: C.navy, valign: 'middle' });
      });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.white }; idx++;
      band(s);
      await ringPhoto(s, L.src(d.image), 0.95, 1.2, 3.0, d.title);
      const fs = L.fit(d.title, 4.8, 1.6, 36, 22, F.head, true);
      t.text(s, d.title, { x: 4.6, y: 1.1, w: 4.8, h: 1.7, fontFace: F.head, bold: true, fontSize: fs, color: C.navy, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 4.6, y: 2.95, w: 4.8, h: 0.45, fontSize: 14, color: C.gray });
      t.text(s, [{ text: TR.by, options: { color: C.gray } }, { text: M.author || '', options: { bold: true, color: C.navy } }], { x: 4.6, y: 3.65, w: 4.8, h: 0.3, fontSize: 13 });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 4.6, y: 3.95, w: 4.8, h: 0.3, fontSize: 12, color: C.gray });
      footer(s);
    },
  };
  // ---- further ways to draw a type, in the formal style: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.gray, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 17, 12, F.head, true), color: o.color || C.navy, align: o.align, valign: o.valign || 'middle' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10, F.body, false, 1.25), color: o.color || C.navy, lineSpacingMultiple: 1.25, valign: o.valign || 'middle' });
  const NAVY2 = '163F63', SOFT = 'C9D8E4';
  // the auditorium page: dark, the flag still on top
  const night = (d) => {
    const s = pres.addSlide(); s.background = { color: C.navy }; idx++;
    band(s);
    t.oval(s, 8.95, 0.62, 0.45, 0.45, C.white);
    t.text(s, String(idx), { x: 8.95, y: 0.62, w: 0.45, h: 0.45, fontSize: 12, bold: true, color: C.navy, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.55, w: 8.1, h: 0.7, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.7, 26, 18, F.head, true) });
    t.line(s, 0.6, 5.12, 8.8, 0, NAVY2, 0.75);
    t.text(s, M.topic || '', { x: 0.6, y: 5.18, w: 4.6, h: 0.25, fontSize: 9, color: SOFT });
    t.text(s, meta, { x: 4.6, y: 5.18, w: 4.8, h: 0.25, fontSize: 9, color: SOFT, align: 'right' });
    return s;
  };
  // the same flag stripes, standing up
  const stand = (s, x, y, h, w = 0.34) => {
    t.rect(s, x, y, w * 0.35, h, C.blue, { name: 'Flag blue' });
    t.rect(s, x + w * 0.35, y, w * 0.06, h, C.red, { name: 'Flag red' });
    t.rect(s, x + w * 0.59, y, w * 0.06, h, C.red, { name: 'Flag red' });
    t.rect(s, x + w * 0.65, y, w * 0.35, h, C.green, { name: 'Flag green' });
  };
  // a ring of twelve stars, as on a seal
  const stars = (color) => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">${Array.from({ length: 12 }, (_, k) => { const a = (k * Math.PI) / 6, cx = 150 + 128 * Math.cos(a), cy = 150 + 128 * Math.sin(a); const pts = Array.from({ length: 10 }, (_, j) => { const r = j % 2 ? 6.5 : 16, b = (j * Math.PI) / 5 - Math.PI / 2; return `${cx + r * Math.cos(b)},${cy + r * Math.sin(b)}`; }).join(' '); return `<polygon points="${pts}" fill="#${color}"/>`; }).join('')}</svg>`, 300, 300);
  const V = {
    image: [
      async (d) => { // a wide plate over a line of text
        const s = page(d);
        t.img(s, await L.photo(L.src(d.image), 8.8, 1.95, { mask: { r: 0.15 } }), 0.6, 1.35, 8.8, 1.95, { alt: d.title });
        t.rect(s, 0.6, 3.46, 8.8, 0.05, C.green, { name: 'Rule' });
        longText(s, d.text, 0.6, 3.58, 8.8, 1.46, { max: 14 });
      },
      async (d) => { // dark page: the picture stands behind an upright flag band
        const s = night({});
        t.img(s, await L.photo(L.src(d.image), 4.3, 4.72), 5.7, 0.34, 4.3, 4.72, { alt: d.title });
        stand(s, 5.36, 0.34, 4.72);
        t.oval(s, 8.95, 0.62, 0.45, 0.45, C.white);
        t.text(s, String(idx), { x: 8.95, y: 0.62, w: 0.45, h: 0.45, fontSize: 12, bold: true, color: C.navy, align: 'center', valign: 'middle' });
        t.text(s, d.title, { x: 0.6, y: 0.55, w: 4.5, h: 1.1, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 4.5, 1.05, 24, 16, F.head, true) });
        longText(s, d.text, 0.6, 1.72, 4.5, 3.3, { color: C.white, max: 14, valign: 'top' });
      },
      async (d) => { // the round portrait on its pale ground, with the stars of the seal around it
        const s = page(d), dia = 2.7, x = 1.05, y = 1.9;
        t.rect(s, 0.6, 1.35, 3.6, 3.65, C.light, { name: 'Ground' });
        t.img(s, await stars(C.blue), x - 0.42, y - 0.42, dia + 0.84, dia + 0.84);
        t.oval(s, x - 0.08, y - 0.08, dia + 0.16, dia + 0.16, null, { line: { color: C.blue, width: 2.5 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        longText(s, d.text, 4.5, 1.35, 4.9, 3.65);
      },
      async (d) => { // full picture, the white sheet comes up from below
        const s = pres.addSlide(); s.background = { color: C.white }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, 3.1), 0, 0.34, W, 3.1, { alt: d.title });
        band(s);
        t.oval(s, 8.95, 0.62, 0.45, 0.45, C.blue);
        t.text(s, String(idx), { x: 8.95, y: 0.62, w: 0.45, h: 0.45, fontSize: 12, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.rect(s, 0.6, 2.2, 8.8, 0.76, C.navy, { name: 'Title plate' });
        t.text(s, d.title, { x: 0.85, y: 2.2, w: 8.3, h: 0.76, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.3, 0.72, 24, 16, F.head, true) });
        longText(s, d.text, 0.6, 3.5, 8.8, 1.55, { max: 14 });
        footer(s);
      },
    ],
    cards: [
      async (d) => { // the register: ruled lines, a round sign at the head of each
        const s = page(d), n = d.items.length, h = 3.6 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.42 + i * h, col = i % 2 ? C.green : C.blue;
          t.oval(s, 0.6, y + h / 2 - 0.3, 0.6, 0.6, col);
          t.img(s, await L.icon(it.icon, C.white, 2), 0.75, y + h / 2 - 0.15, 0.3, 0.3);
          head(s, it.h, 1.4, y, 2.8, h - 0.06);
          body(s, it.t, 4.3, y, 5.1, h - 0.06, { max: 14, valign: 'middle' });
          if (i < n - 1) t.line(s, 1.4, y + h - 0.03, 8.0, 0, C.line, 0.75);
        }
      },
      async (d) => { // sheets with a coloured head, two by two
        const s = page(d), n = d.items.length, w = 4.32, hh = 0.5, h = 1.76;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.16), y = 1.38 + Math.floor(i / 2) * (h + 0.1), col = [C.blue, C.green, C.green, C.blue][i];
          t.rect(s, x, y, ww, h, C.light, { name: 'Sheet' });
          t.rect(s, x, y, ww, hh, col === C.blue ? '007A91' : '158A2B', { name: 'Sheet head' });
          t.img(s, await L.icon(it.icon, C.white, 2), x + 0.16, y + 0.1, 0.3, 0.3);
          head(s, it.h, x + 0.58, y, ww - 0.74, hh, { color: C.white });
          body(s, it.t, x + 0.2, y + hh + 0.08, ww - 0.4, h - hh - 0.14, { color: C.navy, max: 13.5 });
        }
      },
      async (d) => { // the seal in the middle of the dark page, the matters around it
        const s = night({}), n = d.items.length, dia = 2.55, cx = 5, cy = n === 3 ? 1.65 : 2.75, cw = 3.15, h = 2.1;
        t.img(s, await stars('FFFFFF'), cx - dia / 2, cy - dia / 2, dia, dia);
        t.oval(s, cx - dia / 2 + 0.3, cy - dia / 2 + 0.3, dia - 0.6, dia - 0.6, null, { line: { color: C.blue, width: 3 } });
        t.text(s, d.title, { x: cx - 0.8, y: cy - 0.75, w: 1.6, h: 1.5, fontFace: F.head, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 1.6, 1.45, 17, 11, F.head, true) });
        const spots = n === 3 ? [[0.6, 0.55, cw, h], [6.25, 0.55, cw, h], [1.6, 3.05, 6.8, 2.0]] : [[0.6, 0.62, cw, h], [6.25, 1.02, cw, h], [0.6, 2.9, cw, h], [6.25, 3.14 - 0.14, cw, h]];
        for (const [i, it] of d.items.entries()) {
          const [x, y0, w, hh] = spots[i], y = y0, right = x > 5 && n === 4, ax = right ? w - 0.42 : 0, align = right ? 'right' : 'left';
          t.oval(s, x + ax, y, 0.42, 0.42, i % 2 ? C.green : C.blue);
          t.img(s, await L.icon(it.icon, C.white, 2), x + ax + 0.09, y + 0.09, 0.24, 0.24);
          head(s, it.h, right ? x : x + 0.52, y, w - 0.52, 0.42, { color: C.white, align, max: 15 });
          body(s, it.t, x, y + 0.48, w, hh - 0.52, { color: SOFT, align, max: 13 });
        }
      },
      async (d) => { // medals on ribbons, hung at two heights
        const s = page(d), n = d.items.length, cw = 8.8 / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw, cx = x + cw / 2 - 0.1, drop = i % 2 ? 0.35 : 0, med = 0.82, ry = 1.25, rh = 0.34 + drop;
          stand(s, cx - 0.17, ry, rh);
          t.oval(s, cx - med / 2, ry + rh - 0.03, med, med, i % 2 ? C.green : C.blue, { line: { color: C.white, width: 2 } });
          t.img(s, await L.icon(it.icon, C.white, 2), cx - 0.19, ry + rh + 0.18, 0.38, 0.38);
          const y = ry + rh + med + 0.04;
          head(s, it.h, x, y, cw - 0.2, 0.5, { align: 'center', max: 15 });
          body(s, it.t, x, y + 0.5, cw - 0.2, 5.06 - y - 0.5, { align: 'center', max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // the upright flag is the spine, the steps fall to either side
        const s = page(d), n = d.steps.length, h = 3.66 / n;
        stand(s, 4.83, 1.36, 3.7);
        d.steps.forEach((st, i) => {
          const y = 1.36 + i * h, left = i % 2 === 0, x = left ? 0.6 : 5.65, w = 3.75, cy = y + h / 2, col = i % 2 ? C.green : C.blue;
          t.oval(s, 4.72, cy - 0.28, 0.56, 0.56, col, { line: { color: C.white, width: 3 } });
          t.text(s, String(i + 1), { x: 4.72, y: cy - 0.28, w: 0.56, h: 0.56, fontFace: F.head, fontSize: 17, bold: true, color: C.white, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.03, w, 0.32, { align: left ? 'right' : 'left', max: 15 });
          body(s, st.t, x, y + 0.36, w, h - 0.4, { align: left ? 'right' : 'left', max: 12.5 });
        });
      },
      async (d) => { // steps of a hall: blue going to green as they rise
        const s = page(d), n = d.steps.length, cw = 8.8 / n, rise = n === 3 ? 0.5 : 0.34, col = ['0B6F88', '007A91', '158A2B', '117A26'];
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw, y = 1.38 + (n - 1 - i) * rise, h = 5.05 - y;
          t.rect(s, x, y, cw - 0.04, h, col[i], { name: 'Step' });
          t.text(s, String(i + 1), { x: x + 0.15, y: y + 0.05, w: 0.7, h: 0.5, fontFace: F.head, fontSize: 26, bold: true, color: C.white, valign: 'middle' });
          head(s, st.h, x + 0.15, y + 0.55, cw - 0.34, 0.5, { color: C.white, max: 14, valign: 'top' });
          body(s, st.t, x + 0.15, y + 1.06, cw - 0.34, h - 1.14, { color: C.white, max: 13 });
        });
      },
      async (d) => { // a navy column with the title, numbered lines in pale bands beside it
        const s = pres.addSlide(); s.background = { color: C.white }; idx++;
        t.rect(s, 0, 0, 3.4, H, C.navy, { name: 'Column' });
        stand(s, 3.4, 0, H);
        t.oval(s, 0.6, 0.55, 0.45, 0.45, C.white);
        t.text(s, String(idx), { x: 0.6, y: 0.55, w: 0.45, h: 0.45, fontSize: 12, bold: true, color: C.navy, align: 'center', valign: 'middle' });
        t.text(s, d.title, { x: 0.6, y: 1.2, w: 2.5, h: 2.6, fontFace: F.head, bold: true, color: C.white, fontSize: L.fit(d.title, 2.5, 2.5, 26, 16, F.head, true) });
        t.text(s, M.topic || '', { x: 0.6, y: 4.65, w: 2.5, h: 0.65, fontSize: 9, color: SOFT, valign: 'bottom' });
        const n = d.steps.length, g = 0.1, h = (4.55 - g * (n - 1)) / n;
        d.steps.forEach((st, i) => {
          const y = 0.4 + i * (h + g);
          t.rect(s, 4.0, y, 5.4, h, C.light, { name: 'Band' });
          t.text(s, `${i + 1}`, { x: 4.1, y, w: 0.6, h, fontFace: F.head, fontSize: 28, bold: true, color: i % 2 ? C.green : C.blue, align: 'center', valign: 'middle' });
          head(s, st.h, 4.8, y + 0.05, 4.5, 0.32, { max: 15 });
          body(s, st.t, 4.8, y + 0.38, 4.5, h - 0.44, { max: 12.5 });
        });
        t.text(s, meta, { x: 4.0, y: 5.2, w: 5.4, h: 0.25, fontSize: 9, color: C.gray, align: 'right' });
      },
    ],
    stats: [
      async (d) => { // the official table: figure, what it stands for, ruled
        const s = page(d), y0 = 1.42, rh = 0.82;
        t.rect(s, 0.6, y0, 8.8, 0.08, C.navy, { name: 'Table head' });
        d.stats.forEach((x, i) => {
          const y = y0 + 0.08 + i * rh;
          if (i % 2 === 0) t.rect(s, 0.6, y, 8.8, rh, C.light, { name: 'Row' });
          t.text(s, `${i + 1}.`, { x: 0.75, y, w: 0.45, h: rh, fontFace: F.head, fontSize: 15, color: C.gray, valign: 'middle' });
          t.text(s, x.value, { x: 1.25, y, w: 2.9, h: rh, fontFace: F.head, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(x.value, 2.9, rh - 0.1, 34, 18, F.head, true) });
          t.line(s, 4.3, y + 0.12, 0, rh - 0.24, i % 2 ? C.green : C.blue, 2);
          body(s, x.label, 4.5, y, 4.8, rh, { color: C.navy, max: 15, valign: 'middle' });
        });
        t.rect(s, 0.6, y0 + 0.08 + 3 * rh, 8.8, 0.03, C.navy, { name: 'Table foot' });
        if (d.note) body(s, d.note, 0.6, y0 + 0.08 + 3 * rh + 0.1, 8.8, 0.98, { max: 11.5, valign: 'middle' });
      },
      async (d) => { // the dark page: one figure inside the stars, two beside it
        const s = night(d), [a, ...rest] = d.stats, dia = 3.35, x = 0.6, y = 1.42;
        t.img(s, await stars('FFFFFF'), x, y, dia, dia);
        t.text(s, a.value, { x: x + 0.55, y: y + 0.65, w: dia - 1.1, h: 1.1, fontFace: F.head, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(a.value, dia - 1.1, 1.05, 48, 20, F.head, true) });
        body(s, a.label, x + 0.55, y + 1.72, dia - 1.1, 0.85, { color: SOFT, align: 'center', max: 11 });
        rest.forEach((q, i) => {
          const py = 1.42 + i * 1.08, px = 4.35;
          t.rect(s, px, py, 0.07, 0.95, i ? C.green : C.blue, { name: 'Rule' });
          t.text(s, q.value, { x: px + 0.22, y: py, w: 2.3, h: 0.95, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(q.value, 2.3, 0.9, 34, 18, F.head, true) });
          body(s, q.label, px + 2.6, py, 2.45, 0.95, { color: SOFT, max: 12, valign: 'middle' });
        });
        if (d.note) body(s, d.note, 4.35, 3.6, 5.05, 1.42, { color: SOFT, max: 11, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the flag stands between the two: lines run away from it to either side
        const s = page(d);
        stand(s, 4.83, 1.38, 3.68);
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.45 : 0.6, w = 3.95, align = i ? 'left' : 'right', n = side.items.length, rh = 2.92 / n, col = i ? '117A26' : '007A91';
          head(s, side.h, x, 1.4, w, 0.5, { color: col, align, max: 20 });
          t.line(s, x, 1.94, w, 0, col, 1.5);
          side.items.forEach((it, k) => {
            const y = 2.04 + k * rh;
            t.oval(s, i ? x : x + w - 0.13, y + rh / 2 - 0.07, 0.13, 0.13, col);
            body(s, it, i ? x + 0.25 : x, y, w - 0.25, rh - 0.04, { color: C.navy, align, max: 14, valign: 'middle' });
          });
        });
      },
      async (d) => { // two ruled sections, one over the other, each with its colour on the margin
        const s = page(d), bh = 1.75;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.38 + i * (bh + 0.1), col = i ? '158A2B' : '007A91', n = side.items.length, x0 = 3.0, cw = (9.4 - x0) / n;
          t.rect(s, 0.6, y, 2.25, bh, col, { name: 'Margin' });
          head(s, side.h, 0.75, y + 0.08, 1.95, bh - 0.16, { color: C.white, max: 19 });
          t.rect(s, 2.85, y, 6.55, bh, C.light, { name: 'Section' });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.08, y + 0.2, 0, bh - 0.4, C.line, 0.75);
            body(s, it, x0 + k * cw + 0.03, y + 0.1, cw - 0.2, bh - 0.2, { color: C.navy, max: 13, valign: 'middle' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the decree on the dark page, inside a double frame
        const s = night({});
        t.rect(s, 1.4, 0.55, 7.2, 4.45, null, { line: { color: C.white, width: 1.5 }, name: 'Frame' });
        t.rect(s, 1.5, 0.65, 7.0, 4.25, null, { line: { color: C.blue, width: 0.75 }, name: 'Frame' });
        t.img(s, await stars('FFFFFF'), 4.72, 0.72, 0.56, 0.56);
        if (d.title) t.text(s, d.title, { x: 1.9, y: 1.28, w: 6.2, h: 0.28, fontFace: F.head, color: SOFT, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 6.2, 0.26, 13, 10, F.head) });
        t.text(s, L.runs(d.text), { x: 2.1, y: 1.58, w: 5.8, h: 1.92, fontFace: F.head, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 5.8, 1.88, 26, 18, F.head, true) });
        if (d.caption) body(s, d.caption, 2.2, 3.55, 5.6, 1.28, { color: SOFT, align: 'center', max: 12.5 });
      },
      async (d) => { // the seal's pale side column carries the note, the sentence stands large
        const s = page(d);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.4, w: 5.25, h: 3.62, fontFace: F.head, color: C.navy, valign: 'middle', fontSize: L.fit(d.text, 5.25, 3.55, 30, 18, F.head) });
        stand(s, 6.1, 1.4, 3.62);
        t.rect(s, 6.44, 1.4, 2.96, 3.62, C.light, { name: 'Column' });
        t.img(s, await stars(C.blue), 7.48, 1.5, 0.88, 0.88);
        if (d.caption) body(s, d.caption, 6.6, 2.45, 2.65, 2.5, { color: C.navy, max: 12.5, align: 'center' });
      },
    ],
    timeline: [
      async (d) => { // the flag lies along the page, events by turns above and below it
        const s = page(d), ly = 3.08, nodes = [1.3, 3.7, 6.1, 8.5];
        t.rect(s, 0, ly - 0.15, W, 0.1, C.blue, { name: 'Flag blue' });
        t.rect(s, 0, ly - 0.05, W, 0.02, C.red, { name: 'Flag red' });
        t.rect(s, 0, ly + 0.03, W, 0.02, C.red, { name: 'Flag red' });
        t.rect(s, 0, ly + 0.05, W, 0.1, C.green, { name: 'Flag green' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = i < 2 ? 0.6 : 5.2, y = up ? 1.34 : ly + 0.28, w = 4.2;
          t.oval(s, nodes[i] - 0.17, ly - 0.17, 0.34, 0.34, C.white, { line: { color: C.navy, width: 2.5 } });
          t.text(s, it.year, { x, y, w: 1.45, h: 0.36, fontFace: F.head, bold: true, color: C.red, valign: 'middle', fontSize: L.fit(it.year, 1.45, 0.34, 18, 12, F.head, true) });
          head(s, it.h, x + 1.5, y, w - 1.5, 0.36, { max: 15 });
          body(s, it.t, x, y + 0.38, w, 1.12, { max: 13 });
        });
      },
      async (d) => { // the dark page: years in round seals down the margin
        const s = night(d), h = 0.92, dia = 0.84;
        t.line(s, 1.02, 1.5, 0, 3 * h, '4A6C8C', 1.5);
        d.items.forEach((it, i) => {
          const y = 1.36 + i * h;
          t.oval(s, 0.6, y, dia, dia, C.navy, { line: { color: i % 2 ? C.green : C.blue, width: 2.5 } });
          t.text(s, it.year, { x: 0.63, y, w: dia - 0.06, h: dia, fontFace: F.head, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(it.year, dia - 0.14, dia - 0.2, 14, 9, F.head, true) });
          head(s, it.h, 1.65, y, 2.4, dia, { color: C.white, max: 16 });
          body(s, it.t, 4.15, y, 5.25, dia, { color: SOFT, max: 13, valign: 'middle' });
        });
      },
      async (d) => { // a chain of rings at two heights, the year inside each
        const s = page(d), cw = 8.8 / 4, dia = 1.22;
        const pts = d.items.map((_, i) => [0.6 + i * cw + (cw - 0.15) / 2, 1.42 + (i % 2 ? 0.45 : 0) + dia / 2]);
        pts.slice(1).forEach(([x2, y2], i) => { const [x1, y1] = pts[i]; t.line(s, x1, Math.min(y1, y2), x2 - x1, Math.abs(y2 - y1), C.line, 2, { name: 'Chain', flipV: y2 < y1 }); });
        d.items.forEach((it, i) => {
          const x = 0.6 + i * cw, w = cw - 0.15, cx = x + w / 2, top = 1.42 + (i % 2 ? 0.45 : 0);
          t.oval(s, cx - dia / 2, top, dia, dia, C.white, { line: { color: i % 2 ? C.green : C.blue, width: 5 } });
          t.text(s, it.year, { x: cx - dia / 2 + 0.08, y: top, w: dia - 0.16, h: dia, fontFace: F.head, bold: true, color: C.navy, align: 'center', valign: 'middle', fontSize: L.fit(it.year, dia - 0.22, 0.7, 22, 11, F.head, true) });
          const y = top + dia + 0.06;
          head(s, it.h, x, y, w, 0.34, { align: 'center', max: 15 });
          body(s, it.t, x, y + 0.36, w, 5.06 - y - 0.36, { align: 'center', max: 12.5 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Rasmiy', colors: { dk1: C.navy, lt1: C.white, dk2: '163F63', lt2: C.light, accent1: C.blue, accent2: C.green, accent3: C.red, accent4: '66C2D6', accent5: C.gray, accent6: C.line, hlink: C.blue, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "rasmiy-akademik (OTM taqdimoti): to'liq gaplar, atamalar aniq, rasmiy til", "limits": {"intro": 360}, "prefer": "text"};
module.exports = { id: 25, slug: 'rasmiy', name: 'Rasmiy', category: 'academic', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["fade", "cover:d", "wipe:d"], "cover": ["fadeWords", "fade"], "mark": "fade", "deco": "wipe:r", "sig": {"title": "fade", "body": "wipe:d", "item": "fadeDown", "image": "fade", "number": "fade", "order": "seq", "stagger": 0.24}, "tempo": 1.2, "kenburns": false};
