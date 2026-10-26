/**
 * 26 Kino — cinematic: letterbox bars on every slide (topic and credits live in them),
 * widescreen photos, subtitle-style captions, film-strip cards, end-credits sources.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: '141414', bar: '000000', text: 'F2F2F2', yellow: 'F5C518', gray: '8C8C8C', dim: '232323', line: '333333' };
const F = { head: 'Arial', body: 'Arial' };
const TOP = 0.5, BOT = H - 0.5;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M), total = content.slides.length;
  let idx = 0;

  const bars = (s) => {
    t.rect(s, 0, 0, W, TOP, C.bar, { name: 'Letterbox' });
    t.rect(s, 0, BOT, W, H - BOT, C.bar, { name: 'Letterbox' });
    t.text(s, (M.topic || '').toUpperCase(), { x: 0.6, y: 0.12, w: 7.0, h: 0.26, fontSize: 9, color: C.gray, charSpacing: 2 });
    t.text(s, `${L.pad2(idx)} / ${L.pad2(total)}`, { x: 8.0, y: 0.12, w: 1.4, h: 0.26, fontSize: 10, bold: true, color: C.yellow, align: 'right', charSpacing: 1 });
    t.text(s, meta, { x: 0.6, y: BOT + 0.12, w: 8.8, h: 0.26, fontSize: 9, color: C.gray, align: 'center', charSpacing: 1 });
  };
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++; bars(s);
    if (d.title) t.text(s, d.title.toUpperCase(), { x: 0.6, y: 0.75, w: 8.8, h: 0.6, bold: true, color: C.text, valign: 'middle', charSpacing: 3, fontSize: L.fit(d.title.toUpperCase(), 8.8, 0.6, 22, 14, F.head, true) });
    return s;
  };
  const wide = async (s, img, alt) => { t.img(s, await L.photo(img, W, BOT - TOP), 0, TOP, W, BOT - TOP, { alt }); t.rect(s, 0, TOP, W, BOT - TOP, '000000', { t: 50, name: 'Dim' }); };
  const frameCard = (s, x, y, w, h) => { // film frame with sprocket holes
    t.rect(s, x, y, w, h, C.dim, { name: 'Film frame' });
    const n = Math.floor((w - 0.2) / 0.32);
    for (let k = 0; k < n; k++) { t.rect(s, x + 0.12 + k * 0.32, y + 0.08, 0.16, 0.1, C.bg, { name: 'Sprocket' }); t.rect(s, x + 0.12 + k * 0.32, y + h - 0.18, 0.16, 0.1, C.bg, { name: 'Sprocket' }); }
  };

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.bar }; idx++;
      await wide(s, L.src(d.image), d.title);
      t.img(s, await L.scrim('000000', 0, 0.85, 'up'), 0, TOP, W, BOT - TOP);
      bars(s);
      const T = d.title.toUpperCase(), fs = L.fit(T, 8.4, 1.4, 34, 20, F.head, true);
      t.text(s, T, { x: 0.8, y: 2.2, w: 8.4, h: 1.45, fontSize: fs, bold: true, color: C.text, align: 'center', valign: 'bottom', charSpacing: 4 });
      t.rect(s, W / 2 - 0.4, 3.8, 0.8, 0.04, C.yellow, { name: 'Rule' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 1.5, y: 3.95, w: 7.0, h: 0.6, fontSize: 13, color: C.yellow, align: 'center' });
    },
    async intro(d) {
      const s = page(d);
      t.img(s, await L.photo(L.src(d.image), 4.6, 3.6), 0.6, 1.45, 4.6, 3.6, { alt: d.title });
      t.text(s, d.text, { x: 5.55, y: 1.45, w: 3.85, h: 3.6, fontSize: L.fit(d.text, 3.85, 3.6, 15, 11, F.body, false, 1.3), color: C.text, lineSpacingMultiple: 1.3, valign: 'middle' });
    },
    async agenda(d) {
      const s = page(d), n = d.items.length, cols = 3, rws = Math.ceil(n / cols), w = (8.8 - 0.3 * (cols - 1)) / cols, h = (3.55 - 0.3 * (rws - 1)) / rws;
      d.items.forEach((it, i) => {
        const x = 0.6 + (i % cols) * (w + 0.3), y = 1.5 + Math.floor(i / cols) * (h + 0.3);
        frameCard(s, x, y, w, h);
        t.text(s, `${TR.scene} ${i + 1}`, { x: x + 0.2, y: y + 0.3, w: w - 0.4, h: 0.3, fontSize: 10, bold: true, color: C.yellow, charSpacing: 2 });
        t.text(s, it, { x: x + 0.2, y: y + 0.6, w: w - 0.4, h: h - 0.85, fontSize: 16, bold: true, color: C.text, valign: 'middle' });
      });
    },
    async image(d) {
      const s = pres.addSlide(); s.background = { color: C.bar }; idx++;
      await wide(s, L.src(d.image), d.title);
      t.img(s, await L.scrim('000000', 0, 0.75, 'up'), 0, TOP, W, BOT - TOP);
      bars(s);
      t.text(s, d.title.toUpperCase(), { x: 0.6, y: 0.75, w: 8.8, h: 0.5, bold: true, color: C.text, charSpacing: 3, fontSize: L.fit(d.title.toUpperCase(), 8.8, 0.5, 20, 14, F.head, true) });
      const th = L.height(d.text, 14, 7.6, F.body) + 0.3;
      t.rect(s, 1.0, BOT - 0.25 - th, 8.0, th, '000000', { t: 30, name: 'Subtitle box' });
      t.text(s, d.text, { x: 1.2, y: BOT - 0.25 - th, w: 7.6, h: th, fontSize: 14, color: C.yellow, align: 'center', valign: 'middle' });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n, h = 3.5;
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        frameCard(s, x, 1.5, w, h);
        t.img(s, await L.icon(it.icon, C.yellow, 1.75), x + 0.25, 1.85, 0.4, 0.4);
        t.text(s, it.h, { x: x + 0.25, y: 2.4, w: w - 0.5, h: 0.45, fontSize: L.fit(it.h, w - 0.5, 0.45, 16, 11, F.head, true), bold: true, color: C.text });
        t.text(s, it.t, { x: x + 0.25, y: 2.9, w: w - 0.5, h: 1.85, fontSize: L.fit(it.t, w - 0.5, 1.85, 14, 11, F.body), color: C.gray });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      frameCard(s, 0.6, 1.5, 8.8, 0.9);
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        if (i) t.line(s, x, 1.75, 0, 0.4, C.line, 1);
        t.text(s, `${L.pad2(i + 1)}`, { x: x + 0.2, y: 1.72, w: cw - 0.4, h: 0.46, fontSize: 22, bold: true, color: C.yellow, valign: 'middle' });
        t.text(s, st.h, { x, y: 2.6, w: cw - 0.3, h: 0.45, fontSize: L.fit(st.h, cw - 0.3, 0.45, 16, 11, F.head, true), bold: true, color: C.text });
        t.text(s, st.t, { x, y: 3.1, w: cw - 0.3, h: 1.85, fontSize: 14, color: C.gray });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.4, 1.3, 66, 28, F.head, true)));
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        t.text(s, x.value, { x: px, y: 1.55, w: cw - 0.3, h: 1.4, fontSize: vfs, bold: true, color: C.yellow, valign: 'bottom', align: 'center' });
        t.text(s, x.label, { x: px, y: 3.1, w: cw - 0.3, h: 1.0, fontSize: 14, color: C.text, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.4, fontSize: 10, color: C.gray, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.25, h = 3.5;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 14, w - 0.5, F.body) : 0))) + 0.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3);
        frameCard(s, x, 1.5, w, h);
        t.text(s, side.h.toUpperCase(), { x: x + 0.25, y: 1.8, w: w - 0.5, h: 0.4, fontSize: 14, bold: true, color: i ? C.yellow : C.text, charSpacing: 2 });
        let y = 2.35;
        side.items.forEach((it, k) => { t.text(s, it, { x: x + 0.25, y, w: w - 0.5, h: rows[k], fontSize: 14, color: C.text }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page({});
      const fs = L.fit(d.text, 8.0, 1.8, 36, 20, F.head, true);
      t.text(s, d.title.toUpperCase(), { x: 1.0, y: 1.05, w: 8.0, h: 0.35, fontSize: 11, bold: true, color: C.yellow, align: 'center', charSpacing: 3 });
      t.text(s, L.runs(d.text), { x: 1.0, y: 1.5, w: 8.0, h: 1.9, fontSize: fs, bold: true, color: C.text, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.5, y: 3.6, w: 7.0, h: 1.2, fontSize: L.fit(d.caption, 7.0, 1.2, 14, 10, F.body), color: C.gray, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.3;
      t.line(s, 0.6, ly, 8.8, 0, C.line, 2);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.5, w: cw - 0.2, h: 0.55, fontSize: L.fit(it.year, cw - 0.3, 0.5, 26, 13, F.head, true), bold: true, color: C.yellow, valign: 'bottom' });
        t.rect(s, x, ly - 0.1, 0.2, 0.2, C.yellow, { name: 'Marker' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.3, h: 0.42, fontSize: 15, bold: true, color: C.text });
        t.text(s, it.t, { x, y: 3.05, w: cw - 0.3, h: 1.9, fontSize: 13, color: C.gray });
      });
    },
    async quote(d) {
      const s = page({});
      const fs = L.fit(d.text, 7.6, 2.2, 30, 18, F.head, false, 1, true);
      t.text(s, d.text, { x: 1.2, y: 1.1, w: 7.6, h: 2.8, fontSize: fs, italic: true, color: C.text, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, '\u2014 ' + d.author, { x: 1.2, y: 4.1, w: 7.6, h: 0.4, fontSize: 13, color: C.yellow, align: 'center' });
    },
    async sources(d) { // end credits
      const s = page({});
      t.text(s, (d.title || 'Manbalar').toUpperCase(), { x: 1.0, y: 0.75, w: 8.0, h: 0.45, fontSize: 14, bold: true, color: C.yellow, align: 'center', charSpacing: 4 });
      const n = d.items.length, rh = Math.min(0.55, 3.6 / n);
      d.items.forEach((it, i) => t.text(s, it, { x: 1.0, y: 1.35 + i * rh, w: 8.0, h: rh, fontSize: L.fit(it, 8.0, rh - 0.04, 13, 9, F.body), color: C.text, align: 'center', valign: 'middle' }));
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.bar }; idx++;
      await wide(s, L.src(d.image), d.title);
      t.img(s, await L.scrim('000000', 0.35, 0.9, 'up'), 0, TOP, W, BOT - TOP);
      bars(s);
      const T = d.title.toUpperCase(), fs = L.fit(T, 8.4, 1.3, 32, 18, F.head, true);
      t.text(s, T, { x: 0.8, y: 1.6, w: 8.4, h: 1.4, fontSize: fs, bold: true, color: C.text, align: 'center', valign: 'bottom', charSpacing: 4 });
      if (d.subtitle) t.text(s, d.subtitle, { x: 1.5, y: 3.15, w: 7.0, h: 0.4, fontSize: 13, color: C.yellow, align: 'center' });
      t.text(s, M.author || '', { x: 1.5, y: 3.8, w: 7.0, h: 0.35, fontSize: 14, bold: true, color: C.text, align: 'center', charSpacing: 2 });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  |  '), { x: 1.5, y: 4.15, w: 7.0, h: 0.3, fontSize: 11, color: C.gray, align: 'center' });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Kino', colors: { dk1: C.bar, lt1: C.text, dk2: C.bg, lt2: C.gray, accent1: C.yellow, accent2: C.text, accent3: C.gray, accent4: 'B8921A', accent5: C.line, accent6: C.dim, hlink: C.yellow, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "dramatik, hikoya kabi; sarlavhalar qisqa va ta'sirli", "limits": {"card_t4": 60}, "prefer": "visual"};
module.exports = { id: 26, slug: 'kino', name: 'Kino', category: 'creative', photos: true, build, style: STYLE };
