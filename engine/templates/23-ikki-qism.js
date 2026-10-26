/**
 * 23 Ikki qism — every slide is split in two: a full-height colour (or photo) half that
 * carries the title, number and author line, and a calm content half. Sides alternate.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { teal: '0F5257', coral: 'D9694C', sand: 'F3ECE1', ink: '1C2526', white: 'FFFFFF', muted: '5C6B6C', line: 'D9CFC0' };
const F = { head: 'Cambria', body: 'Calibri' };
const PW = 3.9; // panel width

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  let idx = 0;

  // returns { s, X, CW } — content area x and width
  const page = (d, fill) => {
    const s = pres.addSlide(); s.background = { color: C.sand }; idx++;
    const left = idx % 2 === 0, px = left ? 0 : W - PW, col = fill || (idx % 4 === 1 ? C.coral : C.teal);
    t.rect(s, px, 0, PW, H, col, { name: 'Panel' });
    t.text(s, L.pad2(idx), { x: px + 0.5, y: 0.5, w: 2, h: 0.7, fontFace: F.head, fontSize: 36, bold: true, color: C.white });
    if (d.title) t.text(s, d.title, { x: px + 0.5, y: 1.4, w: PW - 1.0, h: 2.4, fontFace: F.head, bold: true, color: C.white, fontSize: L.fit(d.title, PW - 1.0, 2.3, 30, 18, F.head, true) });
    t.text(s, M.topic || '', { x: px + 0.5, y: 4.6, w: PW - 1.0, h: 0.3, fontSize: 9, color: C.white });
    t.text(s, meta, { x: px + 0.5, y: 4.9, w: PW - 1.0, h: 0.45, fontSize: 9, color: C.white, transparency: 15 });
    return { s, X: left ? PW + 0.5 : 0.5, CW: W - PW - 1.0 };
  };
  const photoHalf = async (d, left = true) => {
    const s = pres.addSlide(); s.background = { color: C.sand }; idx++;
    t.img(s, await L.photo(L.src(d.image), W / 2, H), left ? 0 : W / 2, 0, W / 2, H, { alt: d.title });
    return { s, X: left ? W / 2 + 0.5 : 0.5, CW: W / 2 - 1.0 };
  };
  const foot = (s, X, CW) => { t.text(s, M.topic || '', { x: X, y: 4.95, w: CW, h: 0.22, fontSize: 9, color: C.muted }); t.text(s, meta, { x: X, y: 5.17, w: CW, h: 0.22, fontSize: 9, color: C.muted }); };

  const R = {
    async cover(d) {
      const { s, X, CW } = await photoHalf(d, true);
      t.text(s, [M.org, M.loc].filter(Boolean).join(', '), { x: X, y: 0.55, w: CW, h: 0.3, fontSize: 12, bold: true, color: C.coral });
      const fs = L.fit(d.title, CW, 2.2, 38, 22, F.head, true);
      t.text(s, d.title, { x: X, y: 0.95, w: CW, h: 2.3, fontFace: F.head, bold: true, fontSize: fs, color: C.teal, valign: 'bottom' });
      t.rect(s, X, 3.4, 0.8, 0.06, C.coral, { name: 'Rule' });
      if (d.subtitle) t.text(s, d.subtitle, { x: X, y: 3.6, w: CW, h: 0.8, fontSize: 13, color: C.muted });
      t.text(s, M.author || '', { x: X, y: 4.55, w: CW, h: 0.3, fontSize: 14, bold: true, color: C.ink });
      t.text(s, M.year || '', { x: X, y: 4.85, w: CW, h: 0.3, fontSize: 12, color: C.muted });
    },
    async intro(d) {
      const { s, X, CW } = await photoHalf(d, false);
      t.text(s, d.title, { x: X, y: 0.6, w: CW, h: 0.8, fontFace: F.head, bold: true, fontSize: 32, color: C.teal, valign: 'middle' });
      t.rect(s, X, 1.5, 0.8, 0.06, C.coral, { name: 'Rule' });
      t.text(s, d.text, { x: X, y: 1.75, w: CW, h: 3.0, fontSize: L.fit(d.text, CW, 3.0, 16, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25 });
      foot(s, X, CW);
    },
    async agenda(d) {
      const { s, X, CW } = page(d), rh = Math.min(0.66, 4.3 / d.items.length);
      d.items.forEach((it, i) => {
        const y = 0.6 + i * rh;
        t.text(s, L.pad2(i + 1), { x: X, y, w: 0.7, h: rh, fontFace: F.head, fontSize: 20, bold: true, color: C.coral, valign: 'middle' });
        t.text(s, it, { x: X + 0.8, y, w: CW - 0.8, h: rh, fontFace: F.head, fontSize: 18, valign: 'middle' });
        if (i < d.items.length - 1) t.line(s, X + 0.8, y + rh, CW - 0.8, 0, C.line, 0.75);
      });
    },
    async image(d) {
      const { s, X, CW } = await photoHalf(d, idx % 2 === 1);
      t.text(s, d.title, { x: X, y: 0.6, w: CW, h: 1.0, fontFace: F.head, bold: true, fontSize: L.fit(d.title, CW, 1.0, 30, 18, F.head, true), color: C.teal, valign: 'bottom' });
      t.rect(s, X, 1.75, 0.8, 0.06, C.coral, { name: 'Rule' });
      t.text(s, d.text, { x: X, y: 2.0, w: CW, h: 2.75, fontSize: L.fit(d.text, CW, 2.75, 15, 11, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2 });
      foot(s, X, CW);
    },
    async cards(d) {
      const { s, X, CW } = page(d), n = d.items.length, rh = (4.4 - 0.15 * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const y = 0.55 + i * (rh + 0.15);
        t.rect(s, X, y, CW, rh, C.white, { name: 'Row' });
        t.oval(s, X + 0.2, y + (rh - 0.55) / 2, 0.55, 0.55, i % 2 ? C.coral : C.teal);
        t.img(s, await L.icon(it.icon, C.white, 2), X + 0.34, y + (rh - 0.27) / 2, 0.27, 0.27);
        t.text(s, it.h, { x: X + 0.95, y: y + 0.08, w: CW - 1.1, h: 0.36, fontFace: F.head, fontSize: 16, bold: true, color: C.teal });
        t.text(s, it.t, { x: X + 0.95, y: y + 0.44, w: CW - 1.1, h: rh - 0.5, fontSize: L.fit(it.t, CW - 1.1, rh - 0.5, 13, 10, F.body), color: C.muted });
      }
    },
    async process(d) {
      const { s, X, CW } = page(d), n = d.steps.length, rh = 4.4 / n;
      t.line(s, X + 0.27, 0.85, 0, rh * (n - 1), C.line, 2);
      d.steps.forEach((st, i) => {
        const y = 0.6 + i * rh;
        t.oval(s, X, y, 0.54, 0.54, i === n - 1 ? C.coral : C.teal);
        t.text(s, String(i + 1), { x: X, y, w: 0.54, h: 0.54, fontFace: F.head, fontSize: 16, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x: X + 0.8, y: y - 0.02, w: CW - 0.8, h: 0.36, fontFace: F.head, fontSize: 16, bold: true, color: C.teal });
        t.text(s, st.t, { x: X + 0.8, y: y + 0.36, w: CW - 0.8, h: rh - 0.42, fontSize: L.fit(st.t, CW - 0.8, rh - 0.45, 14, 11, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const { s, X, CW } = page(d), n = d.stats.length, rh = (d.note ? 3.9 : 4.4) / n;
      d.stats.forEach((x, i) => {
        const y = 0.55 + i * rh;
        t.text(s, x.value, { x: X, y, w: 2.0, h: rh - 0.1, fontFace: F.head, bold: true, color: i % 2 ? C.coral : C.teal, valign: 'middle', fontSize: L.fit(x.value, 2.0, rh - 0.2, 44, 22, F.head, true) });
        t.text(s, x.label, { x: X + 2.2, y, w: CW - 2.2, h: rh - 0.1, fontSize: 15, color: C.ink, valign: 'middle' });
        if (i < n - 1) t.line(s, X, y + rh - 0.05, CW, 0, C.line, 0.75);
      });
      if (d.note) t.text(s, d.note, { x: X, y: 4.55, w: CW, h: 0.45, fontSize: 10, italic: true, color: C.muted });
    },
    async compare(d) {
      const { s, X, CW } = page(d), w = (CW - 0.3) / 2;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 13, w - 0.4, F.body) : 0))) + 0.2);
      [d.left, d.right].forEach((side, i) => {
        const x = X + i * (w + 0.3);
        t.rect(s, x, 0.55, w, 4.45, i ? C.teal : C.white, { name: 'Column' });
        t.text(s, side.h, { x: x + 0.2, y: 0.7, w: w - 0.4, h: 0.6, fontFace: F.head, fontSize: 16, bold: true, color: i ? C.white : C.teal });
        let y = 1.45;
        side.items.forEach((it, k) => { t.text(s, it, { x: x + 0.2, y, w: w - 0.4, h: rows[k], fontSize: 13, color: i ? C.white : C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const { s, X, CW } = page(d, C.coral);
      const fs = L.fit(d.text, CW, 2.2, 34, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: X, y: 0.6, w: CW, h: 2.6, fontFace: F.head, bold: true, fontSize: fs, color: C.teal, valign: 'bottom' });
      t.rect(s, X, 3.4, 0.8, 0.06, C.coral, { name: 'Rule' });
      if (d.caption) t.text(s, d.caption, { x: X, y: 3.6, w: CW, h: 1.3, fontSize: L.fit(d.caption, CW, 1.3, 14, 11, F.body), color: C.muted });
    },
    async timeline(d) {
      const { s, X, CW } = page(d), n = d.items.length, rh = 4.4 / n;
      t.line(s, X + 1.25, 0.7, 0, rh * (n - 1), C.line, 2);
      d.items.forEach((it, i) => {
        const y = 0.6 + i * rh;
        t.text(s, it.year, { x: X, y: y - 0.04, w: 1.05, h: 0.4, fontFace: F.head, bold: true, color: C.coral, fontSize: L.fit(it.year, 1.05, 0.4, 20, 11, F.head, true) });
        t.oval(s, X + 1.16, y + 0.06, 0.18, 0.18, C.teal);
        t.text(s, it.h, { x: X + 1.55, y: y - 0.02, w: CW - 1.55, h: 0.34, fontFace: F.head, fontSize: 15, bold: true, color: C.teal });
        t.text(s, it.t, { x: X + 1.55, y: y + 0.33, w: CW - 1.55, h: rh - 0.38, fontSize: L.fit(it.t, CW - 1.55, rh - 0.4, 13, 10, F.body), color: C.muted });
      });
    },
    async quote(d) {
      const { s, X, CW } = page({}, C.teal);
      const fs = L.fit(d.text, CW, 2.6, 30, 18, F.head, false, 1, true);
      t.text(s, '\u201C', { x: X - 0.05, y: 0.4, w: 1, h: 1.1, fontFace: F.head, fontSize: 90, bold: true, color: C.coral });
      t.text(s, d.text, { x: X, y: 1.35, w: CW, h: 2.6, fontFace: F.head, italic: true, fontSize: fs, color: C.ink, valign: 'top' });
      if (d.author) t.text(s, d.author, { x: X, y: 4.2, w: CW, h: 0.4, fontSize: 14, bold: true, color: C.coral });
    },
    async sources(d) {
      const { s, X, CW } = page(d), n = d.items.length, rh = Math.min(0.72, 4.4 / n);
      d.items.forEach((it, i) => {
        const y = 0.55 + i * rh;
        t.text(s, `${i + 1}.`, { x: X, y, w: 0.4, h: rh, fontFace: F.head, fontSize: 13, bold: true, color: C.coral, valign: 'middle' });
        t.text(s, it, { x: X + 0.45, y, w: CW - 0.45, h: rh, fontSize: L.fit(it, CW - 0.45, rh - 0.05, 13, 10, F.body), color: C.ink, valign: 'middle' });
        if (i < n - 1) t.line(s, X + 0.45, y + rh, CW - 0.45, 0, C.line, 0.5);
      });
    },
    async closing(d) {
      const { s, X, CW } = await photoHalf(d, false);
      const fs = L.fit(d.title, CW, 2.0, 38, 22, F.head, true);
      t.text(s, d.title, { x: X, y: 0.8, w: CW, h: 2.1, fontFace: F.head, bold: true, fontSize: fs, color: C.teal, valign: 'bottom' });
      t.rect(s, X, 3.05, 0.8, 0.06, C.coral, { name: 'Rule' });
      if (d.subtitle) t.text(s, d.subtitle, { x: X, y: 3.25, w: CW, h: 0.6, fontSize: 14, color: C.muted });
      foot(s, X, CW);
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Ikki qism', colors: { dk1: C.ink, lt1: C.white, dk2: C.teal, lt2: C.sand, accent1: C.teal, accent2: C.coral, accent3: C.muted, accent4: '5E9EA0', accent5: C.line, accent6: 'EBB2A2', hlink: C.coral, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "muvozanatli, tushuntiruvchi biznes uslubi", "limits": {}};
module.exports = { id: 23, slug: 'ikki-qism', name: 'Ikki qism', category: 'business', photos: true, build, style: STYLE };
