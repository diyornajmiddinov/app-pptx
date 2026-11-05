/**
 * 37 Neumorf — soft UI (neumorphism): everything is extruded from the same soft grey
 * surface with a light highlight top-left and a soft shadow bottom-right; one calm blue.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'E4E9F0', ink: '2F3A4B', muted: '68768A', blue: '5B7CFA', coral: 'FF8A65', dark: 'A3B1C6', light: 'FFFFFF', pressed: 'DCE2EA' };
const F = { head: 'Calibri', body: 'Calibri' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  // raised soft element: two identical shapes, dark shadow bottom-right + white glow top-left
  const soft = (s, x, y, w, h, o = {}) => {
    const shape = o.round ? t.S.OVAL : t.S.ROUNDED_RECTANGLE, r = o.round ? {} : { rectRadius: o.r ?? 0.2 };
    s.addShape(shape, { x, y, w, h, ...r, fill: { color: o.fill || C.bg }, line: { type: 'none' }, shadow: { type: 'outer', color: C.dark, opacity: 0.55, blur: 14, offset: 6, angle: 45 }, objectName: 'Soft shadow' });
    s.addShape(shape, { x, y, w, h, ...r, fill: { color: o.fill || C.bg }, line: { type: 'none' }, shadow: { type: 'outer', color: C.light, opacity: 0.9, blur: 14, offset: 6, angle: 225 }, objectName: 'Soft surface' });
  };
  const pressed = (s, x, y, w, h, o = {}) => s.addShape(o.round ? t.S.OVAL : t.S.ROUNDED_RECTANGLE, { x, y, w, h, ...(o.round ? {} : { rectRadius: o.r ?? 0.2 }), fill: { color: C.pressed }, line: { color: 'D3DAE4', width: 1 }, objectName: 'Pressed' });
  const photo = async (s, src, x, y, w, h) => { soft(s, x, y, w, h, { r: 0.28 }); t.img(s, await L.photo(L.src(src), w - 0.3, h - 0.3, { mask: { r: 0.2 } }), x + 0.15, y + 0.15, w - 0.3, h - 0.3, { alt: '' }); };
  const footer = (s) => t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontSize: 8.5, color: C.muted, align: 'center' });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    soft(s, 0.55, 0.4, 0.62, 0.62, { round: true });
    t.text(s, String(idx), { x: 0.55, y: 0.4, w: 0.62, h: 0.62, fontSize: 14, bold: true, color: C.blue, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.45, y: 0.4, w: 8.0, h: 0.62, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.62, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.image) await photo(s, d.image, 5.7, 0.7, 3.7, 3.4);
    soft(s, 0.6, 0.6, 1.9, 0.45, { r: 0.22 });
    t.text(s, [M.org, M.year].filter(Boolean).join(' \u2022 '), { x: 0.6, y: 0.6, w: 1.9, h: 0.45, fontSize: 11, bold: true, color: C.blue, align: 'center', valign: 'middle' });
    const fs = L.fit(d.title, 4.8, 2.1, 42, 22, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 1.3, w: 4.8, h: 2.2, bold: true, fontSize: fs, color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.6, w: 4.7, h: 0.75, fontSize: 14, color: C.muted });
    pressed(s, 0.6, 4.45, 3.4, 0.48, { r: 0.24 });
    t.text(s, [M.author, M.loc].filter(Boolean).join(', '), { x: 0.6, y: 4.45, w: 3.4, h: 0.48, fontSize: 13, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await photo(s, d.image, 0.7, 1.4, 4.0, 3.4); soft(s, 5.05, 1.4, 4.35, 3.4); para(s, d.text, 5.35, 1.55, 3.8, 3.1); },
    async image(d) { const s = page(d); soft(s, 0.6, 1.4, 4.3, 3.4); para(s, d.text, 0.9, 1.55, 3.7, 3.1); await photo(s, d.image, 5.25, 1.4, 4.15, 3.4); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.5 / per);
      d.items.forEach((it, i) => {
        const x = 0.65 + Math.floor(i / per) * 4.45, y = 1.45 + (i % per) * rh;
        soft(s, x, y, 4.1, rh - 0.3, { r: (rh - 0.3) / 2 });
        pressed(s, x + 0.12, y + 0.1, rh - 0.5, rh - 0.5, { round: true });
        t.text(s, String(i + 1), { x: x + 0.12, y: y + 0.1, w: rh - 0.5, h: rh - 0.5, fontSize: 14, bold: true, color: C.blue, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + rh - 0.2, y, w: 4.2 - rh, h: rh - 0.3, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.35, w = (8.7 - gap * (n - 1)) / n;
      const h = Math.min(3.3, 1.55 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.65 + i * (w + gap);
        soft(s, x, 1.5, w, h);
        pressed(s, x + 0.25, 1.75, 0.65, 0.65, { round: true });
        t.img(s, await L.icon(it.icon, i % 2 ? C.coral : C.blue, 2), x + 0.42, 1.92, 0.31, 0.31);
        t.text(s, it.h, { x: x + 0.25, y: 2.55, w: w - 0.5, h: 0.42, fontSize: L.fit(it.h, w - 0.5, 0.42, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.25, y: 3.0, w: w - 0.5, h: h - 1.6, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.7 / n;
      pressed(s, 0.65, 1.68, 8.7, 0.18, { r: 0.09 });
      t.rect(s, 0.68, 1.71, 8.64 * (n - 0.5) / n, 0.12, C.blue, { r: 0.06, name: 'Progress' });
      d.steps.forEach((st, i) => {
        const x = 0.65 + i * cw;
        soft(s, x + 0.05, 1.45, 0.62, 0.62, { round: true });
        t.text(s, String(i + 1), { x: x + 0.05, y: 1.45, w: 0.62, h: 0.62, fontSize: 16, bold: true, color: C.blue, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 2.35, w: cw - 0.3, h: 0.5, fontSize: L.fit(st.h, cw - 0.3, 0.5, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 2.9, w: cw - 0.3, h: 1.9, fontSize: L.fit(st.t, cw - 0.3, 1.9, 15, 11, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.7 / n, dd = Math.min(2.0, cw - 0.6);
      d.stats.forEach((x, i) => {
        const cx = 0.65 + i * cw + cw / 2;
        soft(s, cx - dd / 2, 1.4, dd, dd, { round: true });
        pressed(s, cx - dd / 2 + 0.22, 1.62, dd - 0.44, dd - 0.44, { round: true });
        t.text(s, x.value, { x: cx - dd / 2 + 0.25, y: 1.4, w: dd - 0.5, h: dd, fontSize: L.fit(x.value, dd - 0.7, 0.8, 36, 16, F.head, true), bold: true, color: i % 2 ? C.coral : C.blue, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 3.6, w: cw - 0.4, h: 0.9, fontSize: 14, color: C.ink, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.65, y: 4.6, w: 8.7, h: 0.4, fontSize: 10, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.15;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.85, F.body, 0.2, 4.85 - 2.3);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.65 + i * (w + 0.4);
        soft(s, x, 1.45, w, 3.4);
        t.text(s, side.h, { x: x + 0.35, y: 1.65, w: w - 0.7, h: 0.5, fontSize: 19, bold: true, color: i ? C.blue : C.coral });
        let y = 2.3;
        side.items.forEach((it, k) => { pressed(s, x + 0.35, y + 0.05, 0.2, 0.2, { round: true }); t.text(s, it, { x: x + 0.7, y, w: w - 0.9, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      soft(s, 0.9, 1.45, 8.2, 2.3, { r: 0.35 });
      t.text(s, L.runs(d.text), { x: 1.3, y: 1.55, w: 7.4, h: 2.1, fontSize: L.fit(d.text, 7.4, 2.0, 34, 20, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.3, y: 3.95, w: 7.4, h: 1.05, fontSize: L.fit(d.caption, 7.4, 1.05, 15, 11, F.body), color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.7 / n;
      pressed(s, 0.65, 2.0, 8.7, 0.14, { r: 0.07 });
      d.items.forEach((it, i) => {
        const x = 0.65 + i * cw;
        soft(s, x, 1.35, cw - 0.35, 0.5, { r: 0.25 });
        t.text(s, it.year, { x, y: 1.35, w: cw - 0.35, h: 0.5, fontSize: L.fit(it.year, cw - 0.5, 0.45, 18, 11, F.head, true), bold: true, color: C.blue, align: 'center', valign: 'middle' });
        soft(s, x + (cw - 0.35) / 2 - 0.12, 1.95, 0.24, 0.24, { round: true });
        t.text(s, it.h, { x, y: 2.45, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 2.9, w: cw - 0.3, h: 1.95, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      soft(s, 1.0, 0.9, 8.0, 3.6, { r: 0.4 });
      pressed(s, 1.35, 1.2, 0.8, 0.8, { round: true });
      t.text(s, '\u201C', { x: 1.35, y: 1.25, w: 0.8, h: 0.8, fontSize: 44, bold: true, color: C.blue, align: 'center', valign: 'middle', fontFace: 'Arial' });
      t.text(s, d.text, { x: 2.4, y: 1.25, w: 6.2, h: 2.3, fontSize: L.fit(d.text, 6.2, 2.2, 28, 16, F.head, true), bold: true, color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 2.4, y: 3.65, w: 6.2, h: 0.4, fontSize: 14, color: C.muted });
    },
    async sources(d) {
      const s = page(d), n = d.items.length;
      soft(s, 0.65, 1.4, 8.7, 3.55);
      const rh = Math.min(0.54, 3.25 / n);
      d.items.forEach((it, i) => {
        const y = 1.55 + i * rh;
        pressed(s, 0.9, y + (rh - 0.34) / 2, 0.34, 0.34, { round: true });
        t.text(s, String(i + 1), { x: 0.9, y: y + (rh - 0.34) / 2, w: 0.34, h: 0.34, fontSize: 10, bold: true, color: C.blue, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.4, y, w: 7.8, h: rh, fontSize: L.fit(it, 7.8, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, in soft controls of one surface: a deck's pages must not look alike (L.pages)
  const X0 = 0.65, FW = 8.7, Y1 = 5.05, NIGHT = '2A3142', NIGHT2 = '343D52', DEEPB = '3F5BD8';
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10.5, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const ICOL = [C.blue, C.coral, C.blue, C.coral];
  // night mode: the same soft forms, cut from a dark surface
  const softN = (s, x, y, w, h, o = {}) => {
    const shape = o.round ? t.S.OVAL : t.S.ROUNDED_RECTANGLE, r = o.round ? {} : { rectRadius: o.r ?? 0.2 };
    s.addShape(shape, { x, y, w, h, ...r, fill: { color: NIGHT2 }, line: { type: 'none' }, shadow: { type: 'outer', color: '12161F', opacity: 0.7, blur: 14, offset: 6, angle: 45 }, objectName: 'Soft shadow' });
    s.addShape(shape, { x, y, w, h, ...r, fill: { color: NIGHT2 }, line: { type: 'none' }, shadow: { type: 'outer', color: '4A5570', opacity: 0.5, blur: 12, offset: 5, angle: 225 }, objectName: 'Soft surface' });
  };
  const nightPage = (d) => {
    const s = pres.addSlide(); s.background = { color: NIGHT }; idx++;
    softN(s, 0.55, 0.4, 0.62, 0.62, { round: true });
    t.text(s, String(idx), { x: 0.55, y: 0.4, w: 0.62, h: 0.62, fontSize: 14, bold: true, color: 'A9BBFF', align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.45, y: 0.4, w: 8.0, h: 0.62, bold: true, color: C.light, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.62, 28, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontSize: 8.5, color: 'C9D2DF', align: 'center' });
    return s;
  };
  const toggle = (s, x, y, on = true) => { pressed(s, x, y, 0.62, 0.3, { r: 0.15 }); t.oval(s, on ? x + 0.33 : x + 0.03, y + 0.03, 0.24, 0.24, on ? C.blue : C.dark, { name: 'Toggle knob' }); };
  const V = {
    image: [
      async (d) => { // a media card: the wide picture raised on top, the words sunk in a well below
        const s = page(d);
        await photo(s, d.image, X0, 1.25, FW, 2.0);
        pressed(s, X0, 3.42, FW, 1.66);
        para(s, d.text, X0 + 0.22, 3.48, FW - 0.44, 1.54);
      },
      async (d) => { // a big dial: the picture sits in a round knob
        const s = page(d), dia = 3.5, x = X0 + 0.05, y = 1.4;
        soft(s, x, y, dia, dia, { round: true });
        t.img(s, await L.photo(L.src(d.image), dia - 0.4, dia - 0.4, { mask: 'circle' }), x + 0.2, y + 0.2, dia - 0.4, dia - 0.4, { alt: d.title });
        pressed(s, 4.5, 1.32, 4.85, 3.72);
        para(s, d.text, 4.75, 1.42, 4.35, 3.52);
      },
      async (d) => { // the picture fills the screen, one floating sheet of the surface holds the rest
        const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: d.title });
        soft(s, 0.45, 0.45, 5.1, 4.45, { r: 0.3 });
        soft(s, 0.7, 0.68, 0.56, 0.56, { round: true });
        t.text(s, String(idx), { x: 0.7, y: 0.68, w: 0.56, h: 0.56, fontSize: 13, bold: true, color: C.blue, align: 'center', valign: 'middle' });
        head(s, d.title, 1.42, 0.62, 3.9, 0.68, { max: 20 });
        para(s, d.text, 0.75, 1.42, 4.5, 3.3);
        t.rect(s, 0, 5.16, W, 0.36, C.bg, { name: 'Footer band' });
        footer(s);
      },
      async (d) => { // night mode: rounded picture high on the right, words lower left
        const s = nightPage(d), x = 5.05, y = 1.25, w = 4.3, h = 3.7;
        softN(s, x, y, w, h, { r: 0.28 });
        t.img(s, await L.photo(L.src(d.image), w - 0.3, h - 0.3, { mask: { r: 0.2 } }), x + 0.15, y + 0.15, w - 0.3, h - 0.3, { alt: d.title });
        t.text(s, d.text, { x: X0, y: 1.3, w: 4.05, h: 3.6, fontSize: L.fit(d.text, 4.05, 3.6, 16, 11, F.body, false, 1.3), color: 'EEF1F7', lineSpacingMultiple: 1.3, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a settings screen: one raised sheet, a switch on every row
        const s = page(d), n = d.items.length, y0 = 1.3, H_ = 3.75, h = (H_ - 0.2) / n;
        soft(s, X0, y0, FW, H_, { r: 0.25 });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + 0.1 + i * h, D = Math.min(0.62, h - 0.2);
          pressed(s, X0 + 0.22, y + (h - D) / 2, D, D, { round: true });
          t.img(s, await L.icon(it.icon, ICOL[i], 2), X0 + 0.22 + D * 0.24, y + (h - D) / 2 + D * 0.24, D * 0.52, D * 0.52);
          head(s, it.h, X0 + 1.0, y + 0.05, 6.45, 0.3);
          body(s, it.t, X0 + 1.0, y + 0.35, 6.45, h - 0.4, { max: 13, color: C.ink });
          toggle(s, X0 + FW - 0.84, y + h / 2 - 0.15, i % 2 === 0);
          if (i < n - 1) t.line(s, X0 + 1.0, y + h - 0.01, 7.4, 0, 'D3DAE4', 1);
        }
      },
      async (d) => { // a row of round buttons at uneven heights, each caption sunk in a well beneath
        const s = page(d), n = d.items.length, g = 0.2, w = (FW - g * (n - 1)) / n, D = 0.92;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + g), up = i % 2 === 0, by = up ? 1.28 : 1.56;
          soft(s, x + w / 2 - D / 2, by, D, D, { round: true });
          t.img(s, await L.icon(it.icon, ICOL[i], 2), x + w / 2 - 0.2, by + D / 2 - 0.2, 0.4, 0.4);
          const wy = by + D + 0.14, wh = Y1 - wy;
          pressed(s, x, wy, w, wh);
          head(s, it.h, x + 0.14, wy + 0.08, w - 0.28, 0.44, { align: 'center', max: 14 });
          body(s, it.t, x + 0.14, wy + 0.54, w - 0.28, wh - 0.62, { align: 'center', max: 13 });
        }
      },
      async (d) => { // wells pressed into the surface: nothing raised, two by two
        const s = page(d), n = d.items.length, g = 0.22, w = (FW - g) / 2, h = 1.76;
        const spots = n === 3 ? [[X0, 1.3, w], [X0 + w + g, 1.3, w], [X0, 1.3 + h + 0.2, FW]] : [0, 1, 2, 3].map((i) => [X0 + (i % 2) * (w + g), 1.3 + (i >> 1) * (h + 0.2), w]);
        for (const [i, it] of d.items.entries()) {
          const [x, y, ww] = spots[i];
          pressed(s, x, y, ww, h);
          soft(s, x + 0.16, y + 0.14, 0.5, 0.5, { round: true });
          t.img(s, await L.icon(it.icon, ICOL[i], 2), x + 0.29, y + 0.27, 0.24, 0.24);
          head(s, it.h, x + 0.8, y + 0.14, ww - 0.96, 0.5);
          body(s, it.t, x + 0.2, y + 0.74, ww - 0.4, h - 0.82, { max: 13 });
        }
      },
      async (d) => { // one control turned on: blue and lit, the others idle beside it
        const s = page(d), [a, ...rest] = d.items, g = 0.2, h = (3.76 - g * (rest.length - 1)) / rest.length;
        t.rect(s, X0, 1.3, 4.2, 3.76, DEEPB, { r: 0.22, shadow: 0.5, shadowColor: C.dark, blur: 14, offset: 6, name: 'Active control' });
        t.oval(s, X0 + 0.26, 1.54, 0.84, 0.84, C.light, { name: 'Circle' });
        t.img(s, await L.icon(a.icon, DEEPB, 2), X0 + 0.48, 1.76, 0.4, 0.4);
        head(s, a.h, X0 + 1.26, 1.54, 2.75, 0.84, { color: C.light, max: 20 });
        body(s, a.t, X0 + 0.28, 2.56, 3.64, 2.34, { color: C.light, max: 17 });
        for (const [i, it] of rest.entries()) {
          const y = 1.3 + i * (h + g);
          soft(s, 5.1, y, 4.25, h);
          t.img(s, await L.icon(it.icon, ICOL[i + 1], 2), 5.3, y + 0.14, 0.28, 0.28);
          head(s, it.h, 5.68, y + 0.08, 3.5, 0.4, { max: 14 });
          body(s, it.t, 5.3, y + 0.5, 3.88, h - 0.58, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a sunken track down the middle: a raised knob for each step, text to each side
        const s = page(d), n = d.steps.length, y0 = 1.28, h = 3.78 / n, B = 0.46, cx = 5;
        pressed(s, cx - 0.07, y0 + 0.1, 0.14, 3.58, { r: 0.07 });
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? X0 : 5.5, w = 3.85, al = left ? 'right' : 'left';
          soft(s, cx - B / 2, y + h / 2 - B / 2, B, B, { round: true });
          t.text(s, String(i + 1), { x: cx - B / 2, y: y + h / 2 - B / 2, w: B, h: B, fontSize: 13, bold: true, color: C.blue, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.03, w, 0.3, { align: al });
          body(s, st.t, x, y + 0.33, w, h - 0.37, { align: al, max: 13 });
        });
      },
      async (d) => { // raised pills, each set further in than the last
        const s = page(d), n = d.steps.length, g = 0.14, h = (3.76 - g * (n - 1)) / n, w = n === 3 ? 7.3 : 6.9, dx = (FW - w) / (n - 1);
        d.steps.forEach((st, i) => {
          const x = X0 + i * dx, y = 1.3 + i * (h + g), D = Math.min(0.56, h - 0.2);
          soft(s, x, y, w, h, { r: Math.min(0.3, h / 2) });
          pressed(s, x + 0.14, y + (h - D) / 2, D, D, { round: true });
          t.text(s, String(i + 1), { x: x + 0.14, y: y + (h - D) / 2, w: D, h: D, fontSize: 14, bold: true, color: i % 2 ? C.coral : C.blue, align: 'center', valign: 'middle' });
          head(s, st.h, x + D + 0.3, y + 0.05, w - D - 0.5, 0.28, { max: 14 });
          body(s, st.t, x + D + 0.3, y + 0.33, w - D - 0.5, h - 0.37, { max: 13 });
        });
      },
      async (d) => { // a segmented control grown large: a long tray, a raised segment for each step
        const s = page(d), n = d.steps.length, g = 0.1, x0 = X0 + 0.12, w = (FW - 0.24 - g * (n - 1)) / n, y = 1.42, h = 3.5;
        pressed(s, X0, 1.3, FW, 3.74, { r: 0.28 });
        d.steps.forEach((st, i) => {
          const x = x0 + i * (w + g);
          soft(s, x, y, w, h, { r: 0.2 });
          t.text(s, String(i + 1), { x: x + 0.16, y: y + 0.08, w: 0.6, h: 0.6, fontSize: 30, bold: true, color: i % 2 ? C.coral : C.blue, valign: 'middle' });
          head(s, st.h, x + 0.16, y + 0.68, w - 0.32, 0.5, { valign: 'top', max: 14 });
          body(s, st.t, x + 0.16, y + 1.2, w - 0.32, h - 1.3, { max: 13.5 });
        });
      },
    ],
    stats: [
      async (d) => { // one big dial, the two lesser readings as pills
        const s = page(d), [a, ...rest] = d.stats, D = 2.5, x = X0 + 0.1, y = 1.3;
        soft(s, x, y, D, D, { round: true });
        pressed(s, x + 0.2, y + 0.2, D - 0.4, D - 0.4, { round: true });
        t.text(s, a.value, { x: x + 0.3, y, w: D - 0.6, h: D, bold: true, fontSize: L.fit(a.value, D - 0.6, 0.95, 40, 20, F.head, true), color: C.blue, align: 'center', valign: 'middle' });
        body(s, a.label, X0 + 2.8, 1.65, 1.75, 1.8, { max: 14, valign: 'middle' });
        rest.forEach((q, i) => {
          const py = 1.34 + i * 1.28, px = 5.3, w = 4.05, h = 1.12;
          soft(s, px, py, w, h, { r: 0.28 });
          t.text(s, q.value, { x: px + 0.2, y: py, w: 1.72, h, bold: true, fontSize: L.fit(q.value, 1.72, h - 0.2, 26, 15, F.head, true), color: i ? C.blue : C.coral, valign: 'middle' });
          body(s, q.label, px + 1.98, py + 0.08, w - 2.14, h - 0.16, { max: 12.5, valign: 'middle' });
        });
        if (d.note) { pressed(s, X0, 3.98, FW, 1.08, { r: 0.2 }); body(s, d.note, X0 + 0.2, 4.03, FW - 0.4, 0.98, { max: 13, valign: 'middle' }); }
      },
      async (d) => { // sunken readouts stacked like a device panel, a lit figure in each
        const s = page(d), h = 0.84, g = 0.12;
        d.stats.forEach((q, i) => {
          const y = 1.28 + i * (h + g);
          pressed(s, X0, y, FW, h, { r: 0.28 });
          t.rect(s, X0 + 0.1, y + 0.09, 2.7, h - 0.18, i === 1 ? '9A3412' : DEEPB, { r: 0.2, name: 'Readout' });
          t.text(s, q.value, { x: X0 + 0.14, y: y + 0.09, w: 2.62, h: h - 0.18, bold: true, fontSize: L.fit(q.value, 2.5, h - 0.25, 28, 16, F.head, true), color: C.light, align: 'center', valign: 'middle' });
          body(s, q.label, X0 + 3.0, y + 0.06, FW - 3.2, h - 0.12, { max: 15, valign: 'middle' });
        });
        if (d.note) body(s, d.note, X0, 4.2, FW, 0.86, { max: 13, valign: 'middle', align: 'center' });
      },
    ],
    compare: [
      async (d) => { // raised against pressed: one side stands out of the surface, the other sinks in
        const s = page(d), w = 3.7, y0 = 1.96, avail = 2.96, fit = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.12, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        soft(s, X0, 1.3, 4.25, 3.74);
        pressed(s, 5.1, 1.3, 4.25, 3.74);
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.38 : 0.9, al = i ? 'left' : 'right';
          head(s, side.h, x, 1.4, w, 0.5, { color: i ? DEEPB : 'C2410C', align: al, max: 18 });
          let y = y0;
          fit.rows.forEach((rh0, k) => { const rh = rh0 + extra; if (side.items[k]) t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: C.ink, align: al, valign: 'middle' }); y += rh; });
        });
      },
      async (d) => { // two long trays stacked, a pill for the name, the points side by side
        const s = page(d), bh = 1.78, g = 0.18;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.3 + i * (bh + g), n = side.items.length, x0 = 3.0, cw = (9.2 - x0) / n;
          (i ? pressed : soft)(s, X0, y, FW, bh, { r: 0.28 });
          t.rect(s, X0 + 0.14, y + 0.14, 2.05, bh - 0.28, i ? DEEPB : '9A3412', { r: 0.2, name: 'Name pill' });
          head(s, side.h, X0 + 0.26, y + 0.2, 1.81, bh - 0.4, { color: C.light, align: 'center', max: 15 });
          side.items.forEach((it, k) => body(s, it, x0 + k * cw, y + 0.1, cw - 0.14, bh - 0.2, { valign: 'middle', max: 13.5 }));
        });
      },
    ],
    statement: [
      async (d) => { // the primary button: the sentence, lit in blue; the note sunk at its side
        const s = page(d), w = d.caption ? 5.6 : FW;
        t.rect(s, X0, 1.3, w, 3.74, DEEPB, { r: 0.28, shadow: 0.5, shadowColor: C.dark, blur: 14, offset: 6, name: 'Primary button' });
        t.text(s, L.runs(d.text), { x: X0 + 0.35, y: 1.5, w: w - 0.7, h: 3.34, bold: true, fontSize: L.fit(d.text, w - 0.7, 3.25, 32, 17, F.head, true), color: C.light, valign: 'middle' });
        if (d.caption) { pressed(s, 6.5, 1.3, 2.85, 3.74); body(s, d.caption, 6.68, 1.42, 2.49, 3.5, { max: 15, valign: 'middle' }); }
      },
      async (d) => { // night mode: white words, a single coral lamp to the right
        const s = nightPage(d), D = 1.5, lx = 7.6, ly = 1.45;
        t.text(s, L.runs(d.text), { x: X0, y: 1.2, w: 6.6, h: 2.3, bold: true, fontSize: L.fit(d.text, 6.6, 2.25, 30, 17, F.head, true), color: C.light, valign: 'middle' });
        softN(s, lx, ly, D, D, { round: true });
        t.oval(s, lx + 0.42, ly + 0.42, D - 0.84, D - 0.84, C.coral, { name: 'Lamp' });
        if (d.caption) { softN(s, X0, 3.68, FW, 1.34, { r: 0.22 }); t.text(s, d.caption, { x: X0 + 0.25, y: 3.74, w: FW - 0.5, h: 1.22, fontSize: L.fit(d.caption, FW - 0.5, 1.2, 14, 10, F.body), color: 'EEF1F7', valign: 'middle' }); }
      },
    ],
    timeline: [
      async (d) => { // a stack of notifications: a sunken stamp for the date, the event beside it
        const s = page(d), g = 0.12, h = (3.76 - 3 * g) / 4;
        d.items.forEach((it, i) => {
          const y = 1.3 + i * (h + g);
          soft(s, X0, y, FW, h, { r: 0.22 });
          pressed(s, X0 + 0.12, y + 0.1, 1.6, h - 0.2, { r: 0.18 });
          t.text(s, it.year, { x: X0 + 0.16, y: y + 0.1, w: 1.52, h: h - 0.2, bold: true, fontSize: L.fit(it.year, 1.44, h - 0.26, 17, 11, F.head, true), color: DEEPB, align: 'center', valign: 'middle' });
          head(s, it.h, X0 + 1.9, y + 0.05, FW - 2.1, 0.28, { max: 14 });
          body(s, it.t, X0 + 1.9, y + 0.33, FW - 2.1, h - 0.37, { max: 13 });
        });
      },
      async (d) => { // a long slider: raised cards hang above and below its sunken track
        const s = page(d), ly = 3.08, w = 4.0, xs = [X0, 1.05, 5.0, 5.35], knob = [1.6, 3.6, 5.8, 7.9];
        pressed(s, X0, ly - 0.07, FW, 0.14, { r: 0.07 });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], h = 1.5, y = up ? 1.28 : 3.46;
          soft(s, x, y, w, h);
          soft(s, knob[i] - 0.14, ly - 0.14, 0.28, 0.28, { round: true });
          t.text(s, it.year, { x: x + 0.16, y: y + 0.07, w: 1.5, h: 0.34, bold: true, fontSize: L.fit(it.year, 1.5, 0.32, 15, 10.5, F.head, true), color: DEEPB, valign: 'middle' });
          head(s, it.h, x + 1.7, y + 0.07, w - 1.86, 0.34, { max: 13, align: 'right' });
          body(s, it.t, x + 0.16, y + 0.44, w - 0.32, h - 0.5, { max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Neumorf', colors: { dk1: C.ink, lt1: C.light, dk2: '44516A', lt2: C.bg, accent1: C.blue, accent2: C.coral, accent3: C.muted, accent4: C.dark, accent5: C.pressed, accent6: 'C9D2DF', hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "sokin va zamonaviy: sodda, do'stona, foydalanuvchiga yo'naltirilgan tushuntirish", limits: {}, prefer: null };
module.exports = { id: 37, slug: 'neumorf', name: 'Neumorf', category: 'minimalist', photos: true, build, style: STYLE };
