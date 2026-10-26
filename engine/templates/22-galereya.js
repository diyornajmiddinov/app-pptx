/**
 * 22 Galereya — museum gallery: photos hung in black frames with white mats and drop
 * shadows, museum placards for text, Times headlines on a warm grey wall.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { wall: 'F1EFEA', frame: '262626', mat: 'FFFFFF', ink: '222222', muted: '6E6A64', green: '2F5D50', line: 'D8D4CC' };
const F = { head: 'Times New Roman', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  let idx = 0;

  const footer = (s) => t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.6, y: 5.2, w: 8.8, h: 0.25, fontSize: 9, color: C.muted, align: 'center' });
  const framed = async (s, img, x, y, w, h, alt) => {
    t.rect(s, x, y, w, h, C.frame, { shadow: 0.25, blur: 14, offset: 5, name: 'Frame' });
    t.rect(s, x + 0.09, y + 0.09, w - 0.18, h - 0.18, C.mat, { name: 'Mat' });
    if (img) t.img(s, await L.photo(img, w - 0.6, h - 0.6), x + 0.3, y + 0.3, w - 0.6, h - 0.6, { alt });
  };
  const placard = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.mat, { line: { color: C.line, width: 0.75 }, shadow: 0.08, blur: 6, offset: 2, name: 'Placard' });
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.wall }; idx++;
    t.text(s, `${TR.no} ${L.pad2(idx)}`, { x: 0.6, y: 0.4, w: 2, h: 0.25, fontSize: 10, color: C.muted, charSpacing: 1 });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.65, w: 8.8, h: 0.75, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.75, 30, 20, F.head) });
    footer(s);
    return s;
  };

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.wall }; idx++;
      await framed(s, L.src(d.image), 5.45, 0.55, 3.95, 4.35, d.title);
      t.text(s, [M.org, M.loc].filter(Boolean).join(', '), { x: 0.6, y: 0.6, w: 4.4, h: 0.3, fontSize: 11, color: C.muted, charSpacing: 1 });
      const fs = L.fit(d.title, 4.5, 2.1, 40, 24, F.head);
      t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.5, h: 2.25, fontFace: F.head, fontSize: fs, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 4.4, h: 0.85, fontSize: 13, color: C.muted });
      placard(s, 0.6, 4.25, 3.2, 0.75);
      t.text(s, M.author || '', { x: 0.75, y: 4.3, w: 3.0, h: 0.32, fontFace: F.head, fontSize: 14, bold: true });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 0.75, y: 4.62, w: 3.0, h: 0.28, fontSize: 10, color: C.muted });
    },
    async intro(d) {
      const s = page({});
      await framed(s, L.src(d.image), 0.6, 0.6, 3.6, 4.3, d.title);
      t.text(s, d.title, { x: 4.7, y: 0.75, w: 4.7, h: 0.8, fontFace: F.head, fontSize: 34, valign: 'middle' });
      t.line(s, 4.7, 1.65, 0.8, 0, C.green, 1.5);
      t.text(s, d.text, { x: 4.7, y: 1.9, w: 4.65, h: 3.0, fontSize: L.fit(d.text, 4.65, 3.0, 15, 11, F.body, false, 1.3), color: '3A3A3A', lineSpacingMultiple: 1.3 });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.2 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.6 + (i % per) * rh;
        placard(s, x, y, 4.2, rh - 0.2);
        t.text(s, `${TR.no} ${i + 1}`, { x: x + 0.2, y, w: 0.8, h: rh - 0.2, fontSize: 11, color: C.green, bold: true, valign: 'middle' });
        t.text(s, it, { x: x + 1.05, y, w: 3.0, h: rh - 0.2, fontFace: F.head, fontSize: 17, valign: 'middle' });
      });
    },
    async image(d) {
      const s = page({});
      await framed(s, L.src(d.image), 0.6, 0.55, 5.0, 4.45, d.title);
      placard(s, 6.0, 0.8, 3.4, 4.0);
      t.text(s, d.title, { x: 6.2, y: 0.95, w: 3.0, h: 0.9, fontFace: F.head, fontSize: L.fit(d.title, 3.0, 0.85, 20, 13, F.head, true), bold: true, valign: 'bottom' });
      t.line(s, 6.2, 1.95, 0.5, 0, C.green, 1.25);
      t.text(s, d.text, { x: 6.2, y: 2.1, w: 3.0, h: 2.6, fontSize: L.fit(d.text, 3.0, 2.6, 13, 10, F.body, false, 1.2), color: '3A3A3A', lineSpacingMultiple: 1.2 });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.3, 1.2 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.4);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * (w + gap);
        placard(s, x, 1.65, w, h);
        t.text(s, `${TR.no} ${i + 1}`, { x: x + 0.25, y: 1.8, w: 1, h: 0.25, fontSize: 10, bold: true, color: C.green });
        t.text(s, it.h, { x: x + 0.25, y: 2.1, w: w - 0.5, h: 0.5, fontFace: F.head, fontSize: L.fit(it.h, w - 0.5, 0.5, 19, 13, F.head, true), bold: true });
        t.text(s, it.t, { x: x + 0.25, y: 2.65, w: w - 0.5, h: h - 1.1, fontSize: 14, color: C.muted });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n;
      t.line(s, 0.6, 1.9, 8.8, 0, C.line, 1);
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * (w + gap);
        t.rect(s, x + w / 2 - 0.05, 1.85, 0.1, 0.1, C.frame, { name: 'Nail' });
        placard(s, x, 2.15, w, 2.7);
        t.text(s, TR.step(i + 1), { x: x + 0.2, y: 2.3, w: w - 0.4, h: 0.25, fontSize: 10, bold: true, color: C.green });
        const hfs = Math.min(...d.steps.map((q) => L.fit(q.h, w - 0.4, 0.75, 17, 12, F.head, true)));
        const hh = Math.max(...d.steps.map((q) => L.height(q.h, hfs, w - 0.4, F.head, true)));
        t.text(s, st.h, { x: x + 0.2, y: 2.6, w: w - 0.4, h: hh + 0.05, fontFace: F.head, fontSize: hfs, bold: true });
        t.text(s, st.t, { x: x + 0.2, y: 2.75 + hh, w: w - 0.4, h: 2.0 - hh, fontSize: 13, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.45, w = (8.8 - gap * (n - 1)) / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * (w + gap);
        await framed(s, null, px, 1.6, w, 1.75);
        t.text(s, x.value, { x: px + 0.3, y: 1.7, w: w - 0.6, h: 1.55, fontFace: F.head, fontSize: L.fit(x.value, w - 0.7, 1.0, 54, 26, F.head), align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.55, w, h: 0.8, fontSize: 13, color: C.muted, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.4, fontSize: 10, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.2, h = 3.35;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 14, w - 0.6, F.body) : 0))) + 0.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4);
        placard(s, x, 1.6, w, h);
        t.text(s, side.h, { x: x + 0.3, y: 1.75, w: w - 0.6, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: i ? C.green : C.ink });
        let y = 2.4;
        side.items.forEach((it, k) => { t.line(s, x + 0.3, y, w - 0.6, 0, C.line, 0.5); t.text(s, it, { x: x + 0.3, y: y + 0.08, w: w - 0.6, h: rows[k] - 0.08, fontSize: 14 }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page({});
      await framed(s, null, 1.2, 0.75, 7.6, 3.1);
      const fs = L.fit(d.text, 6.4, 2.0, 34, 20, F.head, false, 1, true);
      t.text(s, L.runs(d.text), { x: 1.8, y: 0.95, w: 6.4, h: 2.7, fontFace: F.head, italic: true, fontSize: fs, align: 'center', valign: 'middle' });
      placard(s, 1.6, 4.05, 6.8, 1.0);
      t.text(s, d.title, { x: 1.8, y: 4.1, w: 6.4, h: 0.3, fontFace: F.head, bold: true, fontSize: 13 });
      if (d.caption) t.text(s, d.caption, { x: 1.8, y: 4.4, w: 6.4, h: 0.6, fontSize: L.fit(d.caption, 6.4, 0.6, 12, 9, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      t.line(s, 0.6, 2.35, 8.8, 0, C.frame, 1);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.6, w: cw - 0.2, h: 0.6, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.55, 28, 14, F.head), valign: 'bottom', color: C.green });
        t.rect(s, x, 2.27, 0.16, 0.16, C.frame, { name: 'Nail' });
        t.text(s, it.h, { x, y: 2.65, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 17, bold: true });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.3, h: 1.8, fontSize: 13, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      await framed(s, null, 1.4, 0.7, 7.2, 3.2);
      const fs = L.fit(d.text, 6.0, 2.3, 32, 18, F.head, false, 1, true);
      t.text(s, d.text, { x: 2.0, y: 0.95, w: 6.0, h: 2.7, fontFace: F.head, italic: true, fontSize: fs, align: 'center', valign: 'middle' });
      if (d.author) { placard(s, 3.2, 4.15, 3.6, 0.55); t.text(s, d.author, { x: 3.3, y: 4.15, w: 3.4, h: 0.55, fontSize: 11, color: C.muted, align: 'center', valign: 'middle' }); }
    },
    async sources(d) {
      const s = page(d), n = d.items.length;
      placard(s, 0.6, 1.55, 8.8, 3.45);
      const rh = Math.min(0.52, 3.1 / n);
      d.items.forEach((it, i) => {
        const y = 1.72 + i * rh;
        t.text(s, `${i + 1}.`, { x: 0.85, y, w: 0.4, h: rh, fontFace: F.head, fontSize: 13, bold: true, color: C.green, valign: 'middle' });
        t.text(s, it, { x: 1.3, y, w: 7.85, h: rh, fontSize: L.fit(it, 7.85, rh - 0.02, 13, 10, F.body), valign: 'middle' });
      });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.wall }; idx++;
      await framed(s, L.src(d.image), 0.6, 0.55, 4.6, 4.35, d.title);
      const fs = L.fit(d.title, 3.9, 1.8, 36, 22, F.head);
      t.text(s, d.title, { x: 5.6, y: 0.9, w: 3.9, h: 2.0, fontFace: F.head, fontSize: fs, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 5.6, y: 3.0, w: 3.8, h: 0.6, fontSize: 13, color: C.muted });
      placard(s, 5.6, 3.9, 3.8, 0.85);
      t.text(s, M.author || '', { x: 5.75, y: 3.95, w: 3.5, h: 0.35, fontFace: F.head, fontSize: 14, bold: true });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 5.75, y: 4.3, w: 3.5, h: 0.3, fontSize: 10, color: C.muted });
      footer(s);
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Galereya', colors: { dk1: C.ink, lt1: C.mat, dk2: C.frame, lt2: C.wall, accent1: C.green, accent2: C.frame, accent3: C.muted, accent4: '6F9C8C', accent5: C.line, accent6: 'C2B8A3', hlink: C.green, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "muzey yorlig'i uslubi: qisqa, nafis izohlar", "limits": {"image_text": 220}, "prefer": "visual"};
module.exports = { id: 22, slug: 'galereya', name: 'Galereya', category: 'academic', photos: true, build, style: STYLE };
