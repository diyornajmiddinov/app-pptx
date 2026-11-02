/**
 * 49 Shrift — typography as the picture: giant cropped numerals and letters, heavy
 * headlines, one hot orange accent, monochrome photos, a vertical running footer.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F1EFE8', ink: '0B0B0B', accent: 'FF4D00', ghost: 'D9D5CA', muted: '57534B', white: 'FFFFFF' };
const F = { head: 'Arial', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const ghost = (s, txt, x, y, w, h, fs, color = C.ghost) => t.text(s, txt, { x, y, w, h, fontSize: fs, bold: true, color, valign: 'top', margin: 0 });
  const footer = (s) => t.text(s, `${M.topic || ''}  \u2014  ${meta}`, { x: 9.7 - 2.75, y: 2.81 - 0.11, w: 5.5, h: 0.22, fontSize: L.fit(`${M.topic || ''}  \u2014  ${meta}`, 5.4, 0.2, 7.5, 5.5, F.body, true), bold: true, color: C.muted, align: 'center', rotate: 270 });
  const mono = async (s, src, x, y, w, h) => { t.rect(s, x + 0.18, y + 0.18, w, h, C.accent, { name: 'Accent block' }); t.img(s, await L.photo(L.src(src), w, h, { gray: true }), x, y, w, h, { alt: '' }); };
  let idx = 0;
  const page = (d, num = true) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (num) ghost(s, L.pad2(idx), 6.3, -0.75, 4.0, 3.4, 230);
    if (d.title) {
      t.text(s, d.title, { x: 0.6, y: 0.4, w: 7.2, h: 0.95, bold: true, color: C.ink, valign: 'top', fontSize: L.fit(d.title, 7.2, 0.95, 34, 18, F.head, true), lineSpacingMultiple: 0.9 });
      t.rect(s, 0.6, 0.28, 0.5, 0.07, C.accent, { name: 'Accent' });
    }
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'top' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.image) await mono(s, d.image, 6.55, 0.55, 2.7, 3.2);
    const tw = d.image ? 5.7 : 8.6;
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(' / ').toUpperCase(), { x: 0.6, y: 0.5, w: tw, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, [{ text: d.title }, { text: '.', options: { color: C.accent } }], { x: 0.55, y: 0.85, w: tw, h: 3.0, bold: true, fontSize: L.fit(d.title + '.', tw, 2.9, 66, 28, F.head, true, 0.9), color: C.ink, valign: 'top', lineSpacingMultiple: 0.88 });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 4.0, w: tw, h: 0.6, fontSize: 13, color: C.muted });
    t.text(s, (M.author || '').toUpperCase(), { x: 0.6, y: 4.65, w: tw, h: 0.35, fontSize: 13, bold: true, color: C.ink, charSpacing: 3 });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await mono(s, d.image, 0.6, 1.6, 3.8, 3.1); para(s, d.text, 4.95, 1.6, 4.3, 3.4); },
    async image(d) { const s = page(d); para(s, d.text, 0.6, 1.6, 4.2, 3.4); await mono(s, d.image, 5.3, 1.6, 3.9, 3.1); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.15, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.4, y = 1.5 + (i % per) * rh;
        t.text(s, L.pad2(i + 1), { x, y: y - 0.1, w: 1.2, h: rh, fontSize: 44, bold: true, color: C.accent, valign: 'top', margin: 0 });
        t.text(s, it, { x: x + 1.25, y, w: 2.9, h: rh - 0.15, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.6 - gap * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const x = 0.6 + i * (w + gap);
        ghost(s, (it.h[0] || '').toUpperCase(), x - 0.05, 1.25, w, 2.2, 150);
        t.rect(s, x, 2.55, 0.35, 0.06, C.accent, { name: 'Accent' });
        t.text(s, it.h, { x, y: 2.7, w, h: 0.5, fontSize: L.fit(it.h, w, 0.5, 18, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.2, w, h: 1.8, fontSize: L.fit(it.t, w, 1.8, 14, 10, F.body), color: C.muted });
      });
    },
    async process(d) {
      const s = page(d, false), n = d.steps.length, cw = 8.6 / n;
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        ghost(s, String(i + 1), x - 0.05, 1.1, cw, 2.0, 130, i === n - 1 ? C.accent : C.ghost);
        t.text(s, st.h, { x, y: 2.85, w: cw - 0.3, h: 0.5, fontSize: L.fit(st.h, cw - 0.3, 0.5, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 3.35, w: cw - 0.3, h: 1.65, fontSize: L.fit(st.t, cw - 0.3, 1.65, 14, 10, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d, false), n = d.stats.length, cw = 8.6 / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        t.text(s, x.value, { x: px - 0.05, y: 1.45, w: cw - 0.1, h: 1.6, fontSize: L.fit(x.value, cw - 0.2, 1.5, 96, 36, F.head, true), bold: true, color: i === 0 ? C.accent : C.ink, valign: 'bottom', margin: 0 });
        t.text(s, x.label, { x: px, y: 3.2, w: cw - 0.35, h: 1.0, fontSize: 14, color: C.muted });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.6, h: 0.45, fontSize: 9.5, color: C.muted });
    },
    async compare(d) {
      const s = page(d, false), w = 4.1;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.2, 4.95 - 2.8);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4);
        ghost(s, i ? 'B' : 'A', x - 0.05, 1.05, 1.6, 1.8, 120, i ? C.accent : C.ghost);
        t.text(s, side.h, { x: x + 1.3, y: 1.7, w: w - 1.3, h: 0.7, fontSize: L.fit(side.h, w - 1.3, 0.7, 22, 14, F.head, true), bold: true, color: C.ink, valign: 'bottom' });
        let y = 2.8;
        side.items.forEach((it, k) => { t.text(s, it, { x, y, w, h: rows[k], fontSize: CFS, color: C.ink }); t.line(s, x, y + rows[k] - 0.06, w, 0, C.ghost, 0.75); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page({}, false);
      t.text(s, [{ text: d.text }, { text: '.', options: { color: C.accent } }], { x: 0.55, y: 0.45, w: 8.7, h: 3.3, bold: true, fontSize: L.fit(d.text + '.', 8.7, 3.2, 64, 26, F.head, true, 0.9), color: C.ink, valign: 'top', lineSpacingMultiple: 0.88 });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 3.95, w: 7.0, h: 1.0, fontSize: L.fit(d.caption, 7.0, 1.0, 14, 10, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d, false), n = d.items.length, cw = 8.6 / n;
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x: x - 0.04, y: 1.45, w: cw - 0.1, h: 1.0, fontSize: L.fit(it.year, cw - 0.2, 0.95, 54, 20, F.head, true), bold: true, color: i === n - 1 ? C.accent : C.ink, valign: 'bottom', margin: 0 });
        t.line(s, x, 2.6, cw - 0.25, 0, C.ink, 2);
        t.text(s, it.h, { x, y: 2.75, w: cw - 0.3, h: 0.45, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.2, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({}, false);
      ghost(s, '\u201C', 0.3, -0.9, 3.0, 3.6, 300, C.accent);
      t.text(s, d.text, { x: 1.2, y: 1.3, w: 7.9, h: 2.6, bold: true, fontSize: L.fit(d.text, 7.9, 2.5, 36, 18, F.head, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, d.author.toUpperCase(), { x: 1.2, y: 4.05, w: 7.9, h: 0.35, fontSize: 12, bold: true, color: C.accent, charSpacing: 3 });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.56, 3.4 / n);
      d.items.forEach((it, i) => {
        const y = 1.55 + i * rh;
        t.text(s, L.pad2(i + 1), { x: 0.6, y, w: 0.6, h: rh, fontSize: 15, bold: true, color: C.accent, valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 7.9, h: rh, fontSize: L.fit(it, 7.9, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Shrift', colors: { dk1: C.ink, lt1: C.white, dk2: '2A2A2A', lt2: C.bg, accent1: C.accent, accent2: C.ink, accent3: C.muted, accent4: C.ghost, accent5: 'A8A396', accent6: 'FF8A5C', hlink: C.accent, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "qat'iy va ixcham: sarlavhalar 2–5 so'z, kuchli fe'llar, ortiqcha so'zsiz", limits: { title: 40, stmt: 55, card_h: 18 }, prefer: 'data' };
module.exports = { id: 49, slug: 'shrift', name: 'Shrift', category: 'minimalist', photos: true, build, style: STYLE };
