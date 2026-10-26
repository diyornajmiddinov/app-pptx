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
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.85, F.body) : 0))) + 0.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.65 + i * (w + 0.4);
        soft(s, x, 1.45, w, 3.4);
        t.text(s, side.h, { x: x + 0.35, y: 1.65, w: w - 0.7, h: 0.5, fontSize: 19, bold: true, color: i ? C.blue : C.coral });
        let y = 2.3;
        side.items.forEach((it, k) => { pressed(s, x + 0.35, y + 0.05, 0.2, 0.2, { round: true }); t.text(s, it, { x: x + 0.7, y, w: w - 0.9, h: rows[k], fontSize: 15, color: C.ink }); y += rows[k]; });
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Neumorf', colors: { dk1: C.ink, lt1: C.light, dk2: '44516A', lt2: C.bg, accent1: C.blue, accent2: C.coral, accent3: C.muted, accent4: C.dark, accent5: C.pressed, accent6: 'C9D2DF', hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "sokin va zamonaviy: sodda, do'stona, foydalanuvchiga yo'naltirilgan tushuntirish", limits: {}, prefer: null };
module.exports = { id: 37, slug: 'neumorf', name: 'Neumorf', category: 'minimalist', photos: true, build, style: STYLE };
