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
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.6, F.body) : 0))) + 0.22);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), col = i ? C.green : C.blue;
        t.rect(s, x, 1.45, w, 0.55, col, { name: 'Header' });
        t.text(s, side.h, { x: x + 0.25, y: 1.45, w: w - 0.5, h: 0.55, fontFace: F.head, fontSize: 18, bold: true, color: C.white, valign: 'middle' });
        t.rect(s, x, 2.0, w, 2.95, C.light, { name: 'Body' });
        let y = 2.2;
        side.items.forEach((it, k) => { t.oval(s, x + 0.25, y + 0.08, 0.12, 0.12, col); t.text(s, it, { x: x + 0.5, y, w: w - 0.6, h: rows[k], fontSize: 15, color: C.navy }); y += rows[k]; });
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Rasmiy', colors: { dk1: C.navy, lt1: C.white, dk2: '163F63', lt2: C.light, accent1: C.blue, accent2: C.green, accent3: C.red, accent4: '66C2D6', accent5: C.gray, accent6: C.line, hlink: C.blue, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "rasmiy-akademik (OTM taqdimoti): to'liq gaplar, atamalar aniq, rasmiy til", "limits": {"intro": 360}, "prefer": "text"};
module.exports = { id: 25, slug: 'rasmiy', name: 'Rasmiy', category: 'academic', photos: true, build, style: STYLE };
