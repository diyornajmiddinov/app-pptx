/**
 * 03 Corporate — consulting-style deck: navy + blue, action titles, footer, chevron process,
 * KPI tiles and a native comparison table.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', navy: '0A2540', blue: '1F6FEB', teal: '0FA3A3', light: 'F3F5F8', line: 'E1E6EE', ink: '1F2A37', muted: '5B6B7F', pale: 'B8C7DC' };
const F = { head: 'Calibri', body: 'Calibri' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const deckTitle = content.slides[0].title;

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.text(s, d.title, { x: 0.6, y: 0.35, w: 8.8, h: 0.8, fontFace: F.head, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.8, 28, 20, F.head, true) });
    t.line(s, 0.6, 5.1, 8.8, 0, C.line, 0.75, { name: 'Footer rule' });
    t.rect(s, 0.6, 5.24, 0.13, 0.13, C.blue, { name: 'Logo mark' });
    t.text(s, [content.meta ? content.meta.topic : deckTitle, L.metaLine(content.meta || {})].filter(Boolean).join('   |   '), { x: 0.85, y: 5.2, w: 7.9, h: 0.22, fontSize: 9, color: C.muted, valign: 'middle' });
    s.slideNumber = { x: 8.9, y: 5.2, w: 0.5, h: 0.22, fontFace: F.body, fontSize: 9, color: C.muted, align: 'right' };
    return s;
  };
  const shapes = (s, x0) => { // abstract right-hand composition
    t.rect(s, x0 + 0.55, 0.95, 2.4, 2.4, C.blue, { name: 'Block' });
    t.rect(s, x0 + 1.55, 2.15, 2.0, 2.0, C.teal, { t: 10, name: 'Block' });
    t.rect(s, x0 + 0.85, 2.85, 1.8, 1.8, null, { line: { color: C.navy, width: 1.5 }, name: 'Outline' });
    t.rect(s, x0 + 3.0, 0.95, 0.4, 0.4, C.navy, { name: 'Square' });
  };

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.light };
      t.rect(s, 0, 0, 6.0, H, C.navy, { name: 'Panel' });
      shapes(s, 6.0);
      const fs = L.fit(d.title, 5.0, 2.4, 44, 28, F.head, true, 0.95), th = L.height(d.title, fs, 5.0, F.head, true, 0.95);
      const sh = d.subtitle ? L.height(d.subtitle, 16, 4.8, F.body) : 0, y = (H - th - 0.35 - sh) / 2;
      t.text(s, d.title, { x: 0.6, y: y - 1, w: 5.0, h: th + 1.05, fontFace: F.head, bold: true, fontSize: fs, color: 'FFFFFF', lineSpacingMultiple: 0.95, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: y + th + 0.35, w: 4.8, h: sh + 0.05, fontSize: 16, color: C.pale });
      t.rect(s, 0.6, H - 0.65, 0.13, 0.13, C.blue, { name: 'Logo mark' });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.4 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.45 + (i % per) * rh;
        t.rect(s, x, y, 4.3, rh - 0.18, C.light, { r: 0.05, name: 'Row' });
        t.rect(s, x + 0.2, y + (rh - 0.18 - 0.42) / 2, 0.42, 0.42, C.navy, { name: 'Number' });
        t.text(s, String(i + 1), { x: x + 0.2, y: y + (rh - 0.18 - 0.42) / 2, w: 0.42, h: 0.42, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y, w: 3.3, h: rh - 0.18, fontSize: 17, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.5, 0.75, 17, 13, F.head, true)));
      const hh = Math.max(...d.items.map((it) => L.height(it.h, hfs, w - 0.5, F.head, true)));
      const h = Math.min(3.55, 1.1 + hh + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.45;
        t.rect(s, x, y, w, h, C.light, { r: 0.05, name: 'Card' });
        t.rect(s, x + 0.25, y + 0.28, 0.5, 0.5, i % 2 ? C.navy : C.blue, { name: 'Icon tile' });
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.37, y + 0.4, 0.26, 0.26);
        t.text(s, it.h, { x: x + 0.25, y: y + 0.98, w: w - 0.5, h: hh + 0.05, fontSize: hfs, bold: true, color: C.navy });
        t.text(s, it.t, { x: x + 0.25, y: y + 1.08 + hh, w: w - 0.5, h: h - 1.2 - hh, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n, shades = ['8FB3F2', '4F8BEF', C.blue, C.navy];
      const col = (i) => shades[Math.round((i * (shades.length - 1)) / Math.max(1, n - 1))];
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        t.shape(s, i ? 'CHEVRON' : 'PENTAGON', { x: x - (i ? 0.12 : 0), y: 1.5, w: cw + 0.1, h: 0.85, fill: { color: col(i) }, objectName: `Step ${i + 1}` });
        t.text(s, st.h, { x: x + (i ? 0.3 : 0.2), y: 1.5, w: cw - 0.6, h: 0.85, fontSize: L.fit(st.h, cw - 0.6, 0.8, 16, 11, F.head, true), bold: true, color: 'FFFFFF', valign: 'middle' });
        t.text(s, L.pad2(i + 1), { x: x + 0.1, y: 2.65, w: 1, h: 0.4, fontSize: 20, bold: true, color: col(i) });
        t.text(s, st.t, { x: x + 0.1, y: 3.1, w: cw - 0.35, h: 1.8, fontSize: 14, color: C.ink });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n, fills = [C.navy, C.blue, C.teal];
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * (w + gap);
        t.rect(s, px, 1.5, w, 2.45, fills[i % 3], { name: 'KPI tile' });
        t.text(s, x.value, { x: px + 0.3, y: 1.7, w: w - 0.6, h: 1.0, fontSize: L.fit(x.value, w - 0.6, 1.0, 48, 28, F.head, true), bold: true, color: 'FFFFFF', valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.3, y: 2.85, w: w - 0.6, h: 0.95, fontSize: 15, color: 'E6EEF8' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.2, w: 8.8, h: 0.6, fontSize: 14, italic: true, color: C.muted });
    },
    async compare(d) {
      const s = page(d), n = Math.max(d.left.items.length, d.right.items.length);
      const head = (txt, fill, color) => ({ text: txt, options: { bold: true, fill: { color: fill }, color, fontSize: 16 } });
      const rows = [[head(d.left.h, C.light, C.navy), head(d.right.h, C.blue, 'FFFFFF')]];
      for (let k = 0; k < n; k++) rows.push([{ text: d.left.items[k] || '', options: { color: C.ink } }, { text: d.right.items[k] || '', options: { color: C.ink, bold: false } }]);
      s.addTable(rows, { x: 0.6, y: 1.5, w: 8.8, colW: [4.4, 4.4], fontFace: F.body, fontSize: 15, rowH: 0.55, valign: 'middle', margin: [0.08, 0.2, 0.08, 0.2], border: { type: 'solid', pt: 0.75, color: C.line } });
    },
    async statement(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.5, 8.8, 3.3, C.light, { name: 'Band' });
      t.rect(s, 1.0, 1.95, 0.5, 0.5, C.blue, { name: 'Mark' });
      t.img(s, await L.icon('FiTarget', 'FFFFFF', 2), 1.12, 2.07, 0.26, 0.26);
      const fs = L.fit(d.text, 7.6, 1.2, 32, 20, F.head, true), th = L.height(d.text, fs, 7.6, F.head, true);
      t.text(s, L.runs(d.text), { x: 1.0, y: 2.7, w: 7.6, h: th + 0.05, fontSize: fs, bold: true, color: C.navy });
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 2.85 + th, w: 7.2, h: 1.0, fontSize: 15, color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 3.0;
      t.line(s, 0.6, ly, 8.8, 0, C.navy, 1.5, { name: 'Axis' });
      const bw = cw + 0.6 > 2.8 ? 2.6 : cw + 0.4, room = Math.min(ly - 0.3 - 1.35, 4.95 - (ly + 0.35)) - 0.75; // text room above / below the axis
      const tfs = Math.min(...d.items.map((it) => L.fit(it.t, bw, room, 14, 9, F.body)));
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw, up = i % 2 === 0, w = bw;
        t.shape(s, 'DIAMOND', { x: x + 0.05, y: ly - 0.14, w: 0.28, h: 0.28, fill: { color: up ? C.blue : C.teal }, objectName: `Milestone ${i + 1}` });
        const th = Math.min(room, L.height(it.t, tfs, w, F.body)), block = 0.4 + 0.35 + th;
        const y0 = up ? ly - 0.3 - block : ly + 0.35;
        t.text(s, it.year, { x: x + 0.05, y: y0, w, h: 0.38, fontSize: 18, bold: true, color: up ? C.blue : C.teal });
        t.text(s, it.h, { x: x + 0.05, y: y0 + 0.38, w, h: 0.33, fontSize: 15, bold: true, color: C.navy });
        t.text(s, it.t, { x: x + 0.05, y: y0 + 0.73, w, h: th + 0.05, fontSize: tfs, color: C.muted });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.navy };
      shapes(s, 6.3);
      const fs = L.fit(d.text, 5.6, 2.2, 34, 20, F.head, false), th = L.height(d.text, fs, 5.6, F.head);
      const y = (H - th - 0.7) / 2;
      t.text(s, '\u201C', { x: 0.5, y: y + th - L.lines(d.text, fs, 5.6, F.head) * L.lh(fs, 1, F.head) * 0.92 - 1.0, w: 1.2, h: 1.2, fontSize: 90, bold: true, color: C.teal, fontFace: 'Arial' });
      t.text(s, d.text, { x: 0.6, y: y - 1, w: 5.6, h: th + 1.05, fontSize: fs, color: 'FFFFFF', valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 0.6, y: y + th + 0.3, w: 5.6, h: 0.35, fontSize: 15, color: C.pale });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.navy };
      shapes(s, 6.0);
      const fs = L.fit(d.title, 5.0, 1.8, 44, 28, F.head, true), th = L.height(d.title, fs, 5.0, F.head, true);
      const sh = d.subtitle ? L.height(d.subtitle, 16, 4.8, F.body) : 0, y = (H - th - 0.3 - sh) / 2;
      t.text(s, d.title, { x: 0.6, y: y - 1, w: 5.0, h: th + 1.05, fontSize: fs, bold: true, color: 'FFFFFF', valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: y + th + 0.3, w: 4.8, h: sh + 0.05, fontSize: 16, color: C.pale });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, 0.6, 1.45, 4.0, 3.45);
      t.rect(s, 4.85, 1.45, 4.55, 3.45, C.light, { name: 'Panel' });
      t.text(s, d.text, { x: 5.1, y: 1.6, w: 4.05, h: 3.15, fontSize: L.fit(d.text, 4.05, 3.15, 15, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.45, 0.42, 0.42, C.blue, { name: 'Mark' });
      t.text(s, d.text, { x: 0.6, y: 2.05, w: 4.1, h: 2.85, fontSize: L.fit(d.text, 4.1, 2.85, 15, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25 });
      await PH(s, d.image, 5.0, 1.45, 4.4, 3.45);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.45 / n);
      d.items.forEach((it, i) => {
        const y = 1.45 + i * rh;
        t.rect(s, 0.6, y + (rh - 0.36) / 2, 0.36, 0.36, C.navy, { name: 'Number' });
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.36) / 2, w: 0.36, h: 0.36, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.15, y, w: 8.25, h: rh, fontSize: L.fit(it, 8.25, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 6.0, 0, 4.0, H); },
    closing: async (s, d) => { await PH(s, d.image, 6.0, 0, 4.0, H); },
  });
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => (['cover', 'closing', 'quote'].includes(type) ? { x: 0.6, y: 5.25, w: 5.2, h: 0.22, color: C.pale } : null));
  return L.save(pres, out, { name: 'SlideAI Corporate', colors: { dk1: C.ink, lt1: C.bg, dk2: C.navy, lt2: C.light, accent1: C.blue, accent2: C.navy, accent3: C.teal, accent4: '8FB3F2', accent5: C.muted, accent6: C.line, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "biznes-konsalting: har bir sarlavha xulosa bo'lsin (action title), raqam va faktlarga tayan", "limits": {}, "prefer": "data"};
module.exports = { id: 3, slug: 'corporate', name: 'Korporativ', category: 'business', build, style: STYLE };
