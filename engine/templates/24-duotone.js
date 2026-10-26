/**
 * 24 Duotone — bold contemporary: photos turned into indigo/yellow duotones, big blocks of
 * flat colour that overlap the photos, heavy Arial.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { indigo: '1F1A4F', yellow: 'FFD23F', pink: 'FF4F7B', white: 'FFFFFF', muted: '5B5785', soft: 'C9C6E6', line: 'E6E4F2' };
const F = { head: 'Arial', body: 'Arial' };
const DUO = [C.indigo, C.yellow], DUO2 = [C.indigo, C.pink];

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  let idx = 0;
  const footer = (s, dark) => {
    // the topic gets the room the author line leaves, on one line
    const room = Math.min(4.6, 9.4 - Math.min(5.0, L.width(meta, 9, F.body)) - 0.3 - 0.6);
    t.text(s, L.clip(M.topic || '', room, 0.25, 9, F.body, true), { x: 0.6, y: 5.2, w: room, h: 0.25, fontSize: 9, bold: true, color: dark ? C.yellow : C.indigo, noShrink: true });
    t.text(s, meta, { x: 4.4, y: 5.2, w: 5.0, h: 0.25, fontSize: 9, color: dark ? C.soft : C.muted, align: 'right' });
  };
  const page = (d, bg = C.white) => {
    const s = pres.addSlide(); s.background = { color: bg }; idx++;
    const dark = bg !== C.white && bg !== C.yellow;
    const chip = bg === C.yellow ? C.indigo : C.yellow;
    t.rect(s, 0.6, 0.5, 0.62, 0.42, chip, { name: 'Chip' });
    t.text(s, L.pad2(idx), { x: 0.6, y: 0.5, w: 0.62, h: 0.42, fontSize: 14, bold: true, color: chip === C.yellow ? C.indigo : C.yellow, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.4, y: 0.4, w: 8.0, h: 0.62, bold: true, color: dark ? C.white : C.indigo, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.62, 28, 16, F.head, true) });
    footer(s, dark);
    return s;
  };

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.white }; idx++;
      t.img(s, await L.photo(L.src(d.image), 5.8, H, { duo: DUO }), 4.2, 0, 5.8, H, { alt: d.title });
      t.rect(s, 0, 0.55, 5.0, 4.5, C.indigo, { name: 'Block' });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  /  '), { x: 0.6, y: 0.8, w: 4.2, h: 0.3, fontSize: 11, bold: true, color: C.yellow });
      const fs = L.fit(d.title, 4.1, 2.3, 40, 22, F.head, true, 0.95);
      t.text(s, d.title, { x: 0.6, y: 1.15, w: 4.1, h: 2.4, fontSize: fs, bold: true, color: C.white, valign: 'bottom', lineSpacingMultiple: 0.95 });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.65, w: 4.0, h: 0.8, fontSize: 12, color: C.soft });
      t.rect(s, 0, 4.6, 3.6, 0.45, C.yellow, { name: 'Author bar' });
      t.text(s, M.author || '', { x: 0.6, y: 4.6, w: 3.0, h: 0.45, fontSize: 14, bold: true, color: C.indigo, valign: 'middle' });
    },
    async intro(d) {
      const s = page({});
      t.img(s, await L.photo(L.src(d.image), 3.9, 4.0, { duo: DUO }), 0.6, 1.1, 3.9, 4.0, { alt: d.title });
      t.rect(s, 3.95, 0.95, 0.9, 0.9, C.pink, { name: 'Square' });
      t.text(s, d.title, { x: 5.1, y: 1.05, w: 4.3, h: 0.75, fontSize: 32, bold: true, color: C.indigo, valign: 'middle' });
      t.text(s, d.text, { x: 5.1, y: 1.95, w: 4.3, h: 3.05, fontSize: L.fit(d.text, 4.3, 3.05, 15, 11, F.body, false, 1.25), color: C.indigo, lineSpacingMultiple: 1.25 });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.4 + (i % per) * rh;
        t.text(s, L.pad2(i + 1), { x, y, w: 1.0, h: rh - 0.15, fontSize: 36, bold: true, color: i % 2 ? C.pink : C.indigo, valign: 'middle' });
        t.text(s, it, { x: x + 1.1, y, w: 3.1, h: rh - 0.15, fontSize: 17, bold: true, color: C.indigo, valign: 'middle' });
      });
    },
    async image(d) {
      const s = pres.addSlide(); s.background = { color: C.white }; idx++;
      t.img(s, await L.photo(L.src(d.image), W, 3.6, { duo: DUO2 }), 0, 0, W, 3.6, { alt: d.title });
      t.rect(s, 0.6, 2.7, 8.8, 2.3, C.indigo, { name: 'Text block' });
      t.text(s, d.title, { x: 0.95, y: 2.85, w: 8.1, h: 0.55, fontSize: L.fit(d.title, 8.1, 0.55, 24, 16, F.head, true), bold: true, color: C.yellow, valign: 'middle' });
      t.text(s, d.text, { x: 0.95, y: 3.45, w: 8.1, h: 1.45, fontSize: L.fit(d.text, 8.1, 1.45, 14, 10, F.body, false, 1.15), color: C.white, lineSpacingMultiple: 1.15 });
      footer(s, false);
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.6, 1.55 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), fill = i % 2 ? C.pink : C.indigo;
        t.rect(s, x, 1.4, w, h, fill, { name: 'Card' });
        t.text(s, L.pad2(i + 1), { x: x + 0.25, y: 1.55, w: 1, h: 0.55, fontSize: 28, bold: true, color: C.yellow });
        t.text(s, it.h, { x: x + 0.25, y: 2.2, w: w - 0.5, h: 0.45, fontSize: L.fit(it.h, w - 0.5, 0.45, 17, 12, F.head, true), bold: true, color: C.white });
        t.text(s, it.t, { x: x + 0.25, y: 2.7, w: w - 0.5, h: h - 1.4, fontSize: 14, color: C.white });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      t.rect(s, 0.6, 1.98, 8.8, 0.12, C.indigo, { name: 'Bar' });
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.7, 18, 12, F.head, true)));
      const hh = Math.max(...d.steps.map((st) => L.height(st.h, hfs, cw - 0.3, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        t.oval(s, x, 1.7, 0.68, 0.68, C.yellow, { line: { color: C.indigo, width: 3 } });
        t.text(s, String(i + 1), { x, y: 1.7, w: 0.68, h: 0.68, fontSize: 20, bold: true, color: C.indigo, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 2.65, w: cw - 0.3, h: hh + 0.05, fontSize: hfs, bold: true, color: C.indigo });
        t.text(s, st.t, { x, y: 2.8 + hh, w: cw - 0.3, h: 2.2 - hh, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d, C.indigo), n = d.stats.length, cw = 8.8 / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.4, 1.4, 80, 30, F.head, true)));
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        t.text(s, x.value, { x: px, y: 1.3, w: cw - 0.3, h: 1.6, fontSize: vfs, bold: true, color: i % 2 ? C.pink : C.yellow, valign: 'bottom' });
        t.text(s, x.label, { x: px, y: 3.05, w: cw - 0.4, h: 1.0, fontSize: 15, color: C.white });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.45, fontSize: 10, color: C.soft });
    },
    async compare(d) {
      const s = page(d), w = 4.4;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.7, F.body) : 0))) + 0.22);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.0 : 0.6, fill = i ? C.yellow : C.indigo, fg = i ? C.indigo : C.white;
        t.rect(s, x, 1.35, w, 3.65, fill, { name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: 1.55, w: w - 0.7, h: 0.5, fontSize: 20, bold: true, color: i ? C.indigo : C.yellow });
        let y = 2.25;
        side.items.forEach((it, k) => { t.text(s, it, { x: x + 0.35, y, w: w - 0.7, h: rows[k], fontSize: 15, color: fg }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page({ title: d.title }, C.yellow);
      const fs = L.fit(d.text, 8.4, 2.2, 44, 24, F.head, true);
      t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 8.4, h: 2.4, fontSize: fs, bold: true, color: C.indigo, valign: 'bottom' });
      t.rect(s, 0.6, 3.9, 1.2, 0.1, C.pink, { name: 'Bar' });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 4.1, w: 8.2, h: 0.9, fontSize: L.fit(d.caption, 8.2, 0.9, 14, 10, F.body), color: C.indigo });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.4;
      t.rect(s, 0.6, ly - 0.05, 8.8, 0.1, C.indigo, { name: 'Bar' });
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.3, w: cw - 0.2, h: 0.85, fontSize: L.fit(it.year, cw - 0.3, 0.8, 36, 16, F.head, true), bold: true, color: i % 2 ? C.pink : C.indigo, valign: 'bottom' });
        t.rect(s, x, ly - 0.17, 0.34, 0.34, C.yellow, { line: { color: C.indigo, width: 2.5 }, name: 'Point' });
        t.text(s, it.h, { x, y: 2.75, w: cw - 0.3, h: 0.42, fontSize: 17, bold: true, color: C.indigo });
        t.text(s, it.t, { x, y: 3.2, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({}, C.indigo);
      const fs = L.fit(d.text, 8.0, 2.4, 38, 22, F.head, true);
      t.text(s, '\u201C', { x: 0.5, y: 0.95, w: 1.5, h: 1.3, fontSize: 120, bold: true, color: C.yellow });
      t.text(s, d.text, { x: 0.6, y: 1.6, w: 8.0, h: 2.6, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 0.6, y: 4.4, w: 8, h: 0.4, fontSize: 16, bold: true, color: C.pink });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.6 / n);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.rect(s, 0.6, y + (rh - 0.36) / 2, 0.36, 0.36, C.yellow, { name: 'Num' });
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.36) / 2, w: 0.36, h: 0.36, fontSize: 12, bold: true, color: C.indigo, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.15, y, w: 8.25, h: rh, fontSize: L.fit(it, 8.25, rh - 0.05, 14, 10, F.body), color: C.indigo, valign: 'middle' });
      });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.white }; idx++;
      t.img(s, await L.photo(L.src(d.image), W, H, { duo: DUO2 }), 0, 0, W, H, { alt: d.title });
      t.rect(s, 0.6, 1.2, 6.0, 3.2, C.indigo, { name: 'Block' });
      const fs = L.fit(d.title, 5.2, 1.6, 40, 22, F.head, true);
      t.text(s, d.title, { x: 1.0, y: 1.4, w: 5.2, h: 1.7, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 1.0, y: 3.2, w: 5.2, h: 0.4, fontSize: 14, color: C.yellow });
      t.text(s, `${M.author || ''}  /  ${[M.org, M.loc, M.year].filter(Boolean).join(', ')}`, { x: 1.0, y: 3.7, w: 5.3, h: 0.4, fontSize: 11, color: C.soft });
      t.rect(s, 0, 5.1, W, 0.525, C.indigo, { name: 'Footer band' });
      footer(s, true);
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Duotone', colors: { dk1: C.indigo, lt1: C.white, dk2: '2C2670', lt2: C.line, accent1: C.yellow, accent2: C.pink, accent3: C.indigo, accent4: '8F86D9', accent5: C.muted, accent6: C.soft, hlink: C.pink, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "dadil, zamonaviy va qisqa", "limits": {"image_text": 220}};
module.exports = { id: 24, slug: 'duotone', name: 'Duotone', category: 'creative', photos: true, build, style: STYLE };
