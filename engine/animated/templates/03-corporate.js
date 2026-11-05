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
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw, up = i % 2 === 0, w = cw + 0.6 > 2.8 ? 2.6 : cw + 0.4;
        t.shape(s, 'DIAMOND', { x: x + 0.05, y: ly - 0.14, w: 0.28, h: 0.28, fill: { color: up ? C.blue : C.teal }, objectName: `Milestone ${i + 1}` });
        const th = Math.min(L.height(it.t, 14, w, F.body), up ? 0.62 : 5.0 - ly - 1.1), block = 0.4 + 0.35 + th; // long text shrinks into its box
        const y0 = up ? ly - 0.3 - block : ly + 0.35;
        t.text(s, it.year, { x: x + 0.05, y: y0, w, h: 0.38, fontSize: 18, bold: true, color: up ? C.blue : C.teal });
        t.text(s, it.h, { x: x + 0.05, y: y0 + 0.38, w, h: 0.33, fontSize: 15, bold: true, color: C.navy });
        t.text(s, it.t, { x: x + 0.05, y: y0 + 0.73, w, h: th + 0.05, fontSize: 14, color: C.muted });
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
  // ---- further ways to draw a type, as a consultant's other charts: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.navy, align: o.align, valign: o.valign || 'middle' });
  const para = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10, F.body, false, 1.2), color: o.color || C.ink, lineSpacingMultiple: 1.2, valign: o.valign || 'top' });
  const icon = async (s, x, y, d, ic, fill = C.blue) => { t.rect(s, x, y, d, d, fill, { name: 'Icon tile' }); t.img(s, await L.icon(ic, 'FFFFFF', 2), x + d * 0.25, y + d * 0.25, d * 0.5, d * 0.5); };
  const shade = [C.navy, C.blue, C.teal, '4F8BEF'];
  const V = {
    image: [
      async (d) => { // the picture as a wide exhibit, the reading under it
        const s = page(d);
        await PH(s, d.image, 0.6, 1.25, 8.8, 1.95);
        t.rect(s, 0.6, 3.2, 8.8, 0.06, C.blue, { name: 'Rule' });
        para(s, d.text, 0.6, 3.38, 8.8, 1.62, { max: 14 });
      },
      async (d) => { // a large picture, a navy panel standing in its right side
        const s = page(d);
        await PH(s, d.image, 0.6, 1.25, 8.8, 3.75);
        t.rect(s, 5.3, 1.25, 4.1, 3.75, C.navy, { t: 4, name: 'Panel' });
        para(s, d.text, 5.5, 1.38, 3.7, 3.5, { max: 14, color: 'FFFFFF', valign: 'middle' });
      },
      async (d) => { // the picture fills the page, a navy column carries title and text
        d._pale = true;
        const s = pres.addSlide();
        await PH(s, d.image, 0, 0, W, H);
        t.rect(s, 0, 0, 4.6, H, C.navy, { name: 'Panel' });
        head(s, d.title, 0.6, 0.45, 3.6, 1.1, { color: 'FFFFFF', max: 26, valign: 'bottom' });
        t.rect(s, 0.6, 1.65, 0.6, 0.05, C.teal, { name: 'Rule' });
        para(s, d.text, 0.6, 1.85, 3.6, 3.25, { color: C.pale, max: 14 });
      },
      async (d) => { // a small picture in the corner of an overlapping square composition
        const s = page(d);
        t.rect(s, 6.1, 1.3, 3.3, 3.5, C.teal, { t: 10, name: 'Block' });
        await PH(s, d.image, 5.7, 1.55, 3.3, 3.0);
        t.rect(s, 5.45, 4.2, 0.55, 0.55, C.navy, { name: 'Square' });
        para(s, d.text, 0.6, 1.3, 4.75, 3.65, { valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a table of findings: icon, heading, what it means
        const s = page(d), n = d.items.length, h = 3.58 / n;
        t.rect(s, 0.6, 1.3, 8.8, 0.06, C.navy, { name: 'Rule' });
        for (const [i, it] of d.items.entries()) {
          const y = 1.4 + i * h;
          if (i % 2 === 0) t.rect(s, 0.6, y, 8.8, h, C.light, { name: 'Row' });
          t.img(s, await L.icon(it.icon, C.blue, 2), 0.78, y + h / 2 - 0.16, 0.32, 0.32);
          head(s, it.h, 1.3, y + 0.03, 2.7, h - 0.06, { max: 15 });
          body(s, it.t, 4.1, y + 0.05, 5.2, h - 0.1, { valign: 'middle', max: 13 });
        }
      },
      async (d) => { // four quadrants round a cross
        const s = page(d), n = d.items.length, w = 4.3, h = 1.75;
        t.line(s, 5, 1.35, 0, 3.6, C.line, 1.5); t.line(s, 0.6, 3.15, 8.8, 0, C.line, 1.5);
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.32 + Math.floor(i / 2) * (h + 0.12);
          await icon(s, x, y + 0.05, 0.5, it.icon, shade[i]);
          head(s, it.h, x + 0.65, y + 0.05, ww - 0.75, 0.5, { max: 15 });
          body(s, it.t, x + 0.65, y + 0.6, ww - 0.75, h - 0.68, { max: 13, color: C.muted });
        }
      },
      async (d) => { // a pyramid of bars, each shorter than the one above
        const s = page(d), n = d.items.length, h = 3.65 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.32 + i * h, w = 8.8 - i * 0.55, x = 0.6;
          t.rect(s, x, y, w, h - 0.08, shade[i], { name: 'Bar' });
          t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.18, y + (h - 0.08) / 2 - 0.16, 0.32, 0.32);
          head(s, it.h, x + 0.65, y, 2.3, h - 0.08, { color: 'FFFFFF', max: 15 });
          body(s, it.t, x + 3.05, y + 0.04, w - 3.2, h - 0.16, { color: 'FFFFFF', valign: 'middle', max: 13 });
        }
      },
      async (d) => { // the content on one navy field
        const s = page(d), n = d.items.length, cw = 8.8 / n;
        t.rect(s, 0.6, 1.3, 8.8, 3.68, C.navy, { name: 'Field' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw;
          t.img(s, await L.icon(it.icon, C.teal, 2), x + 0.2, 1.5, 0.45, 0.45);
          head(s, it.h, x + 0.2, 2.05, cw - 0.4, 0.6, { color: 'FFFFFF' });
          body(s, it.t, x + 0.2, 2.7, cw - 0.4, 2.2, { color: C.pale });
          if (i) t.line(s, x, 1.5, 0, 3.28, '2C4A6E', 1);
        }
      },
    ],
    process: [
      async (d) => { // a Gantt chart: each step starts where the last one ended
        const s = page(d), n = d.steps.length, h = 3.65 / n, bw = 3.1, shift = (8.8 - bw) / (n - 1);
        d.steps.forEach((st, i) => {
          const y = 1.32 + i * h, x = 0.6 + i * shift;
          t.line(s, 0.6, y + h - 0.04, 8.8, 0, C.line, 0.75);
          t.rect(s, x, y + 0.05, bw, 0.42, shade[i], { name: 'Bar' });
          head(s, `${i + 1}. ${st.h}`, x + 0.1, y + 0.05, bw - 0.2, 0.42, { color: 'FFFFFF', max: 13 });
          const right = i < n / 2, tx = right ? x + bw + 0.15 : 0.6, tw = right ? 9.4 - tx : x - 0.75;
          body(s, st.t, tx, y + 0.03, tw, h - 0.1, { max: 12, color: C.muted, valign: 'middle', align: right ? 'left' : 'right' });
        });
      },
      async (d) => { // down arrows between stacked boxes on the left, the detail on the right
        const s = page(d), n = d.steps.length, h = 3.65 / n;
        d.steps.forEach((st, i) => {
          const y = 1.32 + i * h;
          t.rect(s, 0.6, y, 2.9, h - 0.26, i === n - 1 ? C.teal : C.navy, { name: 'Box' });
          head(s, st.h, 0.72, y, 2.66, h - 0.26, { color: 'FFFFFF', align: 'center', max: 14 });
          if (i < n - 1) t.shape(s, 'DOWN_ARROW', { x: 1.9, y: y + h - 0.25, w: 0.3, h: 0.24, fill: { color: C.pale }, objectName: 'Arrow' });
          body(s, st.t, 3.8, y, 5.6, h - 0.1, { valign: 'middle', max: 14 });
        });
      },
      async (d) => { // a cycle of four tiles with a ring at its centre
        const s = page(d), n = d.steps.length, w = 4.05, h = 1.72;
        d.steps.forEach((st, i) => {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = wide ? 0.6 : 0.6 + (i < 2 ? i : 3 - i) * (w + 0.7), y = 1.32 + (i < 2 ? 0 : h + 0.2);
          t.rect(s, x, y, ww, h, C.light, { name: 'Tile' });
          t.rect(s, x, y, 0.08, h, shade[i], { name: 'Edge' });
          head(s, `${i + 1}. ${st.h}`, x + 0.22, y + 0.08, ww - 0.34, 0.45, { max: 15 });
          body(s, st.t, x + 0.22, y + 0.55, ww - 0.34, h - 0.62, { max: 13 });
        });
        if (n === 4) { t.oval(s, 4.69, 2.99, 0.62, 0.62, null, { line: { color: C.blue, width: 3 } }); t.text(s, '↻', { x: 4.69, y: 2.99, w: 0.62, h: 0.62, fontSize: 18, color: C.blue, align: 'center', valign: 'middle' }); }
      },
    ],
    stats: [
      async (d) => { // the headline figure on navy, supporting figures on a light panel
        const s = page(d), [a, ...rest] = d.stats;
        t.rect(s, 0.6, 1.3, 4.3, 3.68, C.navy, { name: 'Headline' });
        t.text(s, a.value, { x: 0.8, y: 1.55, w: 3.9, h: 1.4, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(a.value, 3.8, 1.3, 58, 24, F.head, true) });
        t.rect(s, 0.85, 3.0, 0.6, 0.05, C.teal, { name: 'Rule' });
        body(s, a.label, 0.85, 3.15, 3.8, 1.6, { color: C.pale, max: 16 });
        t.rect(s, 4.9, 1.3, 4.5, 3.68, C.light, { name: 'Support' });
        rest.forEach((v, i) => { const y = 1.42 + i * 1.08; head(s, v.value, 5.15, y, 4.0, 0.55, { max: 28, color: C.blue }); body(s, v.label, 5.15, y + 0.55, 4.0, 0.46, { max: 12, color: C.ink }); });
        if (d.note) body(s, d.note, 5.15, 3.62, 4.0, 1.28, { max: 10.5, color: C.muted });
      },
      async (d) => { // a scorecard: label on the left, figure right-aligned
        const s = page(d), rh = d.note ? 0.9 : 1.15;
        d.stats.forEach((v, i) => {
          const y = 1.32 + i * rh;
          t.rect(s, 0.6, y, 0.1, rh - 0.1, shade[i], { name: 'Edge' });
          body(s, v.label, 0.9, y, 5.3, rh - 0.1, { valign: 'middle', max: 16 });
          head(s, v.value, 6.3, y, 3.1, rh - 0.1, { max: 38, align: 'right', color: shade[i] });
          t.line(s, 0.6, y + rh - 0.04, 8.8, 0, C.line, 0.75);
        });
        if (d.note) body(s, d.note, 0.6, 4.08, 8.8, 0.92, { max: 11, color: C.muted });
      },
    ],
    compare: [
      async (d) => { // from and to: a large arrow between two columns
        const s = page(d), w = 3.75;
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? 5.65 : 0.6, n = side.items.length, rh = 2.95 / n;
          t.rect(s, x, 1.3, w, 0.6, i ? C.blue : C.pale, { name: 'Header' });
          head(s, side.h, x + 0.15, 1.3, w - 0.3, 0.6, { color: i ? 'FFFFFF' : C.navy, max: 17 });
          side.items.forEach((it, k) => { body(s, it, x + 0.1, 2.02 + k * rh, w - 0.2, rh - 0.08, { max: 14 }); if (k) t.line(s, x, 2.0 + k * rh - 0.02, w, 0, C.line, 0.75); });
        }
        t.shape(s, 'RIGHT_ARROW', { x: 4.5, y: 2.6, w: 1.0, h: 0.8, fill: { color: C.teal }, objectName: 'Arrow' });
      },
      async (d) => { // two bands, one over the other
        const s = page(d), h = 1.75;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.3 + i * (h + 0.12), hot = i === 1, ink = hot ? 'FFFFFF' : C.ink;
          t.rect(s, 0.6, y, 8.8, h, hot ? C.navy : C.light, { name: 'Band' });
          head(s, side.h, 0.8, y + 0.1, 2.1, h - 0.2, { color: hot ? 'FFFFFF' : C.navy, max: 18 });
          side.items.forEach((it, k) => body(s, it, 3.1 + (k % 2) * 3.1, y + 0.1 + Math.floor(k / 2) * 0.78, 2.95, 0.74, { color: ink, max: 13 }));
        });
      },
    ],
    statement: [
      async (d) => { // the whole page navy, the note in a narrow column
        d._pale = true;
        const s = pres.addSlide(); s.background = { color: C.navy };
        head(s, d.title, 0.6, 0.45, 8.8, 0.5, { color: C.pale, max: 16 });
        t.rect(s, 0.6, 1.0, 0.6, 0.05, C.teal, { name: 'Rule' });
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.25, w: 5.7, h: 3.7, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 5.7, 3.6, 36, 17, F.head, true) });
        if (d.caption) body(s, d.caption, 6.7, 1.3, 2.7, 3.65, { color: C.pale, valign: 'middle', max: 14 });
      },
      async (d) => { // a block of blue with the mark, the thought beside it, the note below a rule
        const s = page(d);
        t.rect(s, 0.6, 1.3, 1.5, 3.68, C.blue, { name: 'Block' }); t.rect(s, 1.1, 2.75, 0.5, 0.5, 'FFFFFF', { name: 'Mark' });
        t.text(s, L.runs(d.text), { x: 2.4, y: 1.3, w: 7.0, h: 2.1, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(d.text, 7.0, 2.0, 32, 16, F.head, true) });
        t.line(s, 2.4, 3.45, 7.0, 0, C.line, 1);
        if (d.caption) body(s, d.caption, 2.4, 3.55, 7.0, 1.42, { color: C.muted, max: 13 });
      },
    ],
    timeline: [
      async (d) => { // years on a row of chevrons
        const s = page(d), n = d.items.length, cw = 8.8 / n;
        d.items.forEach((it, i) => {
          const x = 0.6 + i * cw;
          t.shape(s, 'CHEVRON', { x, y: 1.3, w: cw + 0.1, h: 0.72, fill: { color: shade[i] }, objectName: 'Chevron' });
          t.text(s, it.year, { x: x + 0.28, y: 1.3, w: cw - 0.4, h: 0.72, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.5, 0.6, 18, 9, F.head, true) });
          head(s, it.h, x + 0.05, 2.15, cw - 0.2, 0.5, { max: 14 });
          body(s, it.t, x + 0.05, 2.68, cw - 0.2, 2.3, { max: 13, color: C.muted });
        });
      },
      async (d) => { // a register with a year chip on every row
        const s = page(d), n = d.items.length, h = 3.65 / n;
        d.items.forEach((it, i) => {
          const y = 1.32 + i * h;
          t.rect(s, 0.6, y + 0.06, 1.5, h - 0.2, i === n - 1 ? C.blue : C.light, { r: 0.05, name: 'Chip' });
          t.text(s, it.year, { x: 0.65, y: y + 0.06, w: 1.4, h: h - 0.2, bold: true, color: i === n - 1 ? 'FFFFFF' : C.navy, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.3, h - 0.3, 18, 9, F.head, true) });
          head(s, it.h, 2.3, y, 2.3, h - 0.08, { max: 14 });
          body(s, it.t, 4.7, y + 0.03, 4.7, h - 0.14, { valign: 'middle', max: 12.5, color: C.muted });
          t.line(s, 2.3, y + h - 0.06, 7.1, 0, C.line, 0.75);
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (['cover', 'closing', 'quote'].includes(type) || d._pale ? { x: 0.6, y: 5.25, w: 5.2, h: 0.22, color: C.pale } : null));
  return L.save(pres, out, { name: 'SlideAI Corporate', colors: { dk1: C.ink, lt1: C.bg, dk2: C.navy, lt2: C.light, accent1: C.blue, accent2: C.navy, accent3: C.teal, accent4: '8FB3F2', accent5: C.muted, accent6: C.line, hlink: C.blue, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "biznes-konsalting: har bir sarlavha xulosa bo'lsin (action title), raqam va faktlarga tayan", "limits": {}, "prefer": "data"};
module.exports = { id: 3, slug: 'corporate', name: 'Korporativ', category: 'business', build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "elegant"], "transitions": ["morph", "push:l", "wipe:r"], "cover": ["sweepIn", "fadeWords"], "mark": "popIn", "deco": "wipe:r", "sig": {"title": "fadeRight", "body": "fadeUp", "item": "riseSettle", "image": "fade", "number": "popOver", "order": "seq", "stagger": 0.12}, "tempo": 0.9, "kenburns": false};
