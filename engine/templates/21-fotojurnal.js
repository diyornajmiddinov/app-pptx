/**
 * 21 Fotojurnal — photo-magazine: full-bleed photographs with dark scrims and white type,
 * clean white inside pages, one hot orange accent. Meta line on every slide.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { ink: '111214', white: 'FFFFFF', accent: 'F05A28', gray: '6B6B6B', line: 'E2E2E2', soft: 'BDBDBD' };
const F = { head: 'Arial', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const scrUp = await L.scrim(C.ink, 0, 0.9, 'up'), scrLeft = await L.scrim(C.ink, 0, 0.88, 'left');
  let idx = 0;

  const footer = (s, dark, x = 0.6, w = 8.8) => {
    t.text(s, M.topic || '', { x, y: 5.2, w: w * 0.55, h: 0.25, fontSize: 9, color: dark ? C.soft : C.gray });
    t.text(s, meta, { x: x + w * 0.45, y: 5.2, w: w * 0.55, h: 0.25, fontSize: 9, color: dark ? C.soft : C.gray, align: 'right' });
  };
  const page = (d, bg = C.white) => {
    const s = pres.addSlide(); s.background = { color: bg }; idx++;
    const dark = bg !== C.white;
    t.rect(s, 0.6, 0.55, 0.16, 0.16, C.accent, { name: 'Mark' });
    t.text(s, L.pad2(idx), { x: 0.85, y: 0.5, w: 1, h: 0.26, fontSize: 11, bold: true, color: C.accent });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.8, w: 8.8, h: 0.75, bold: true, color: dark ? C.white : C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.75, 28, 18, F.head, true) });
    footer(s, dark);
    return s;
  };
  const full = async (d, scr) => {
    const s = pres.addSlide(); idx++;
    t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: d.title });
    t.img(s, scr, 0, 0, W, H);
    return s;
  };

  const R = {
    async cover(d) {
      const s = await full(d, scrUp);
      t.img(s, scrLeft, 0, 0, 6, H);
      t.text(s, [M.org, M.loc].filter(Boolean).join(', '), { x: 0.6, y: 0.45, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.white, charSpacing: 1 });
      t.text(s, M.year || '', { x: 7.4, y: 0.45, w: 2, h: 0.3, fontSize: 12, bold: true, color: C.white, align: 'right' });
      const fs = L.fit(d.title, 7.6, 2.0, 48, 28, F.head, true, 0.95);
      t.text(s, d.title, { x: 0.6, y: 1.2, w: 7.6, h: 2.2, fontSize: fs, bold: true, color: C.white, valign: 'bottom', lineSpacingMultiple: 0.95 });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.55, w: 6.6, h: 0.8, fontSize: 16, color: 'E6E6E6' });
      t.rect(s, 0.6, 4.72, 0.16, 0.16, C.accent, { name: 'Mark' });
      t.text(s, M.author || '', { x: 0.85, y: 4.62, w: 6, h: 0.35, fontSize: 14, bold: true, color: C.white, valign: 'middle' });
    },
    async intro(d) {
      const s = pres.addSlide(); s.background = { color: C.white }; idx++;
      t.img(s, await L.photo(L.src(d.image), 4.4, H), 0, 0, 4.4, H, { alt: d.title });
      t.rect(s, 4.95, 0.55, 0.16, 0.16, C.accent, { name: 'Mark' });
      t.text(s, d.title, { x: 4.95, y: 0.85, w: 4.5, h: 0.8, fontSize: 32, bold: true, valign: 'middle' });
      t.text(s, d.text, { x: 4.95, y: 1.85, w: 4.45, h: 3.1, fontSize: L.fit(d.text, 4.45, 3.1, 16, 12, F.body, false, 1.25), color: '333333', lineSpacingMultiple: 1.25 });
      t.text(s, M.topic || '', { x: 4.95, y: 4.98, w: 4.45, h: 0.22, fontSize: 9, color: C.gray });
      t.text(s, meta, { x: 4.95, y: 5.2, w: 4.45, h: 0.22, fontSize: 9, color: C.gray });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.75 + (i % per) * rh;
        t.text(s, L.pad2(i + 1), { x, y, w: 0.85, h: rh - 0.15, fontSize: 26, bold: true, color: C.accent, valign: 'middle' });
        t.text(s, it, { x: x + 0.95, y, w: 3.25, h: rh - 0.15, fontSize: 17, bold: true, valign: 'middle' });
        t.line(s, x, y + rh - 0.08, 4.2, 0, C.line, 0.75);
      });
    },
    async image(d) {
      const s = await full(d, scrLeft);
      t.rect(s, 0, 0, 5.6, H, C.ink, { t: 35, name: 'Text panel' });
      t.rect(s, 0.6, 0.55, 0.16, 0.16, C.accent, { name: 'Mark' });
      t.text(s, L.pad2(idx), { x: 0.85, y: 0.5, w: 1, h: 0.26, fontSize: 11, bold: true, color: C.accent });
      t.text(s, d.title, { x: 0.6, y: 0.9, w: 4.8, h: 1.2, fontSize: L.fit(d.title, 4.8, 1.2, 32, 20, F.head, true), bold: true, color: C.white, valign: 'bottom' });
      t.rect(s, 0.6, 2.3, 0.7, 0.06, C.accent, { name: 'Bar' });
      t.text(s, d.text, { x: 0.6, y: 2.55, w: 4.6, h: 2.45, fontSize: L.fit(d.text, 4.6, 2.45, 16, 12, F.body, false, 1.2), color: 'EDEDED', lineSpacingMultiple: 1.2 });
      footer(s, true);
    },
    async cards(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, cw - 0.45, 0.45, 18, 12, F.head, true)));
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw + (i ? 0.25 : 0), w = cw - (i ? 0.5 : 0.25);
        if (i) t.line(s, 0.6 + i * cw, 1.8, 0, 3.0, C.line, 0.75);
        t.text(s, L.pad2(i + 1), { x, y: 1.75, w, h: 0.6, fontSize: 30, bold: true, color: C.accent });
        t.text(s, it.h, { x, y: 2.45, w, h: 0.45, fontSize: hfs, bold: true });
        t.text(s, it.t, { x, y: 2.95, w, h: 1.9, fontSize: 14, color: C.gray });
      });
    },
    async process(d) {
      // same rhythm as the timeline: number above the line, dot on it, text below
      const s = page(d), n = d.steps.length, cw = 8.8 / n, ly = 2.55;
      t.line(s, 0.6, ly, 8.8, 0, C.ink, 1.5);
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.35, 0.75, 18, 13, F.head, true)));
      const hh = Math.max(...d.steps.map((st) => L.height(st.h, hfs, cw - 0.35, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        t.text(s, `${i + 1}`, { x, y: 1.75, w: cw - 0.35, h: 0.6, fontSize: 28, bold: true, color: i === n - 1 ? C.accent : C.ink, valign: 'bottom' });
        t.oval(s, x, ly - 0.15, 0.3, 0.3, i === n - 1 ? C.accent : C.ink);
        t.text(s, st.h, { x, y: 2.85, w: cw - 0.35, h: hh + 0.05, fontSize: hfs, bold: true });
        t.text(s, st.t, { x, y: 3.0 + hh, w: cw - 0.35, h: 1.95 - hh, fontSize: 14, color: C.gray });
      });
    },
    async stats(d) {
      const s = page(d, C.ink), n = d.stats.length, cw = 8.8 / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.4, 1.2, 66, 30, F.head, true)));
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        t.text(s, x.value, { x: px, y: 1.65, w: cw - 0.3, h: 1.3, fontSize: vfs, bold: true, color: C.white, valign: 'bottom' });
        t.rect(s, px, 3.1, 0.5, 0.06, C.accent, { name: 'Bar' });
        t.text(s, x.label, { x: px, y: 3.3, w: cw - 0.4, h: 0.95, fontSize: 14, color: C.soft });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.45, fontSize: 11, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 4.15;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.35, F.body) : 0))) + 0.28);
      t.line(s, 5.0, 1.75, 0, 3.2, C.line, 0.75);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.3 : 0.6;
        t.text(s, side.h, { x, y: 1.7, w, h: 0.5, fontSize: 20, bold: true, color: i ? C.accent : C.ink });
        let y = 2.35;
        side.items.forEach((it, k) => {
          t.rect(s, x, y + 0.09, 0.1, 0.1, i ? C.accent : C.ink, { name: 'Bullet' });
          t.text(s, it, { x: x + 0.3, y, w: w - 0.35, h: rows[k], fontSize: 15 });
          y += rows[k];
        });
      });
    },
    async statement(d) {
      const s = page({ title: d.title }, C.ink);
      const fs = L.fit(d.text, 8.4, 1.8, 40, 24, F.head, true);
      t.text(s, L.runs(d.text), { x: 0.6, y: 1.75, w: 8.4, h: 1.9, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      t.rect(s, 0.6, 3.85, 0.9, 0.07, C.accent, { name: 'Bar' });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 4.05, w: 8.0, h: 0.95, fontSize: 14, color: C.soft });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.55;
      t.line(s, 0.6, ly, 8.8, 0, C.ink, 1.5);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.75, w: cw - 0.2, h: 0.6, fontSize: L.fit(it.year, cw - 0.3, 0.6, 28, 14, F.head, true), bold: true, valign: 'bottom', color: i === n - 1 ? C.accent : C.ink });
        t.oval(s, x, ly - 0.12, 0.24, 0.24, C.accent);
        t.text(s, it.h, { x, y: 2.85, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true });
        t.text(s, it.t, { x, y: 3.3, w: cw - 0.3, h: 1.65, fontSize: 14, color: C.gray });
      });
    },
    async quote(d) {
      const s = page({}, C.ink);
      const fs = L.fit(d.text, 7.6, 2.3, 34, 20, F.head, true), th = L.height(d.text, fs, 7.6, F.head, true);
      t.text(s, '\u201C', { x: 0.5, y: 3.9 - th - 1.35, w: 1.4, h: 1.4, fontSize: 120, bold: true, color: C.accent });
      t.text(s, d.text, { x: 0.6, y: 1.2, w: 7.6, h: 2.7, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 0.6, y: 4.1, w: 7.6, h: 0.4, fontSize: 15, color: C.soft });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.3 / n);
      d.items.forEach((it, i) => {
        const y = 1.75 + i * rh;
        t.text(s, `[${i + 1}]`, { x: 0.6, y, w: 0.6, h: rh, fontSize: 13, bold: true, color: C.accent, valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 8.15, h: rh, fontSize: L.fit(it, 8.15, rh - 0.02, 14, 11, F.body), valign: 'middle', color: '333333' });
        t.line(s, 1.25, y + rh, 8.15, 0, C.line, 0.5);
      });
    },
    async closing(d) {
      const s = await full(d, scrUp);
      t.img(s, scrLeft, 0, 0, 6, H);
      const fs = L.fit(d.title, 7.6, 1.7, 46, 28, F.head, true);
      t.text(s, d.title, { x: 0.6, y: 1.0, w: 7.6, h: 1.9, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.05, w: 7, h: 0.5, fontSize: 17, color: 'E6E6E6' });
      t.rect(s, 0.6, 4.0, 0.16, 0.16, C.accent, { name: 'Mark' });
      t.text(s, M.author || '', { x: 0.85, y: 3.9, w: 6, h: 0.35, fontSize: 14, bold: true, color: C.white, valign: 'middle' });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 0.85, y: 4.25, w: 6, h: 0.3, fontSize: 12, color: C.soft });
      t.text(s, M.topic || '', { x: 0.6, y: 5.2, w: 8.8, h: 0.25, fontSize: 9, color: C.soft });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Fotojurnal', colors: { dk1: C.ink, lt1: C.white, dk2: '2A2B2F', lt2: 'F4F4F2', accent1: C.accent, accent2: C.ink, accent3: C.gray, accent4: 'F5A07F', accent5: C.soft, accent6: C.line, hlink: C.accent, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "fotoreportaj: jonli, aniq, kuchli sarlavhalar", "limits": {}, "prefer": "visual"};
module.exports = { id: 21, slug: 'fotojurnal', name: 'Fotojurnal', category: 'creative', photos: true, build, style: STYLE };
