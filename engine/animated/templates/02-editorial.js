/**
 * 02 Editorial — magazine layout: big serif headlines, hairline rules, running header,
 * one red accent, no boxes.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', ink: '141414', muted: '5E5E5E', red: 'C8102E', hair: 'D6D6D6' };
const F = { head: 'Cambria', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const deckTitle = content.slides[0].title;

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.text(s, deckTitle, { x: 0.6, y: 0.2, w: 7.0, h: 0.22, fontSize: 10, color: C.muted });
    s.slideNumber = { x: 8.9, y: 0.2, w: 0.5, h: 0.22, fontFace: F.body, fontSize: 10, color: C.muted, align: 'right' };
    t.line(s, 0.6, 0.48, 8.8, 0, C.ink, 1.5, { name: 'Running rule' });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.66, w: 8.8, h: 0.8, fontFace: F.head, bold: true, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.8, 32, 22, F.head, true) });
    return s;
  };
  const vrule = (s, x, y, h) => t.line(s, x, y, 0, h, C.hair, 0.75, { name: 'Column rule' });

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.bg };
      t.rect(s, 0.6, 0.5, 0.22, 0.22, C.red, { name: 'Mark' });
      t.line(s, 0.95, 0.61, 8.45, 0, C.ink, 2.5, { name: 'Masthead rule' });
      const TW = d.image ? 5.5 : 8.8, fs = L.fit(d.title, TW, 2.7, 66, 36, F.head, true, 0.92), th = L.height(d.title, fs, TW, F.head, true, 0.92);
      t.text(s, d.title, { x: 0.6, y: 3.95 - th, w: TW, h: th + 0.05, fontFace: F.head, bold: true, fontSize: fs, lineSpacingMultiple: 0.92 });
      t.line(s, 0.6, 4.18, 8.8, 0, C.ink, 0.75, { name: 'Rule' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 4.35, w: 7.0, h: 0.9, fontFace: F.head, italic: true, fontSize: 18, color: C.muted });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.55, y = 1.75 + (i % per) * rh;
        t.text(s, L.pad2(i + 1), { x, y, w: 0.75, h: rh - 0.15, fontFace: F.head, fontSize: 26, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y, w: 3.35, h: rh - 0.15, fontFace: F.head, fontSize: 19, valign: 'middle' });
        t.line(s, x, y + rh - 0.08, 4.25, 0, C.hair, 0.75);
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, cw - 0.5, 0.75, 21, 14, F.head, true)));
      const hh = Math.max(...d.items.map((it) => L.height(it.h, hfs, cw - 0.5, F.head, true)));
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw + (i ? 0.25 : 0), w = cw - (i ? 0.5 : 0.25);
        if (i) vrule(s, 0.6 + i * cw, 1.75, 3.2);
        t.text(s, L.ROMAN[i] + '.', { x, y: 1.75, w, h: 0.45, fontFace: F.head, fontSize: 20, bold: true, color: C.red });
        t.text(s, it.h, { x, y: 2.3, w, h: hh + 0.05, fontFace: F.head, fontSize: hfs, bold: true });
        t.text(s, it.t, { x, y: 2.4 + hh, w, h: 2.4, fontSize: 14, color: C.muted, lineSpacingMultiple: 1.1 });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.35, 0.75, 20, 14, F.head, true)));
      const hh = Math.max(...d.steps.map((st) => L.height(st.h, hfs, cw - 0.35, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw, w = cw - 0.35;
        t.line(s, x, 1.8, w, 0, C.ink, 2.5, { name: 'Step rule' });
        t.text(s, L.pad2(i + 1), { x, y: 1.98, w, h: 0.4, fontFace: F.head, fontSize: 16, bold: true, color: C.red });
        t.text(s, st.h, { x, y: 2.45, w, h: hh + 0.05, fontFace: F.head, fontSize: hfs, bold: true });
        t.text(s, st.t, { x, y: 2.6 + hh, w, h: 2.2, fontSize: 14, color: C.muted, lineSpacingMultiple: 1.1 });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.5, 1.1, 64, 32, F.head, true)));
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw + (i ? 0.3 : 0), w = cw - (i ? 0.6 : 0.3);
        if (i) vrule(s, 0.6 + i * cw, 1.85, 2.7);
        t.text(s, x.value, { x: px, y: 1.8, w, h: 1.15, fontFace: F.head, fontSize: vfs, bold: true, valign: 'bottom' });
        t.rect(s, px, 3.1, 0.5, 0.05, C.red, { name: 'Accent' });
        t.text(s, x.label, { x: px, y: 3.3, w, h: 1.0, fontSize: 14, color: C.muted });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.65, w: 8.8, h: 0.45, fontFace: F.head, italic: true, fontSize: 14, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.1;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.3, 4.85 - 2.3 - 0 * Math.max(d.left.items.length, d.right.items.length));
      vrule(s, 5.0, 1.75, 3.3);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.3 : 0.6;
        t.text(s, side.h, { x, y: 1.7, w, h: 0.5, fontFace: F.head, fontSize: 22, bold: true, color: i ? C.red : C.ink });
        let y = 2.3;
        side.items.forEach((it, k) => {
          t.line(s, x, y, w, 0, C.hair, 0.75);
          t.text(s, it, { x, y: y + 0.15, w, h: rows[k] - 0.2, fontSize: CFS });
          y += rows[k];
        });
      });
    },
    async statement(d) {
      const s = page({});
      const fs = L.fit(d.text, 8.0, 1.6, 40, 24, F.head, false, 1, true), th = L.height(d.text, fs, 8.0, F.head, false, 1, true);
      const ch = d.caption ? L.height(d.caption, 15, 6.6, F.body) : 0, y = 0.48 + (H - 0.48 - (0.55 + th + 0.35 + ch)) / 2;
      t.rect(s, W / 2 - 0.11, y, 0.22, 0.22, C.red, { name: 'Mark' });
      t.text(s, L.runs(d.text), { x: 1.0, y: y + 0.5, w: 8.0, h: th + 0.05, fontFace: F.head, italic: true, fontSize: fs, align: 'center' });
      if (d.caption) t.text(s, d.caption, { x: 1.7, y: y + 0.85 + th, w: 6.6, h: ch + 0.05, fontSize: 15, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.35 / n;
      d.items.forEach((it, i) => {
        const y = 1.7 + i * rh;
        t.line(s, 0.6, y, 8.8, 0, i ? C.hair : C.ink, i ? 0.75 : 1.5);
        t.text(s, it.year, { x: 0.6, y: y + 0.1, w: 1.8, h: rh - 0.2, fontFace: F.head, fontSize: L.fit(it.year, 1.7, 0.6, 28, 16, F.head, true), bold: true, color: C.red, valign: 'middle' });
        t.text(s, it.h, { x: 2.6, y: y + 0.1, w: 2.3, h: rh - 0.2, fontFace: F.head, fontSize: 18, bold: true, valign: 'middle' });
        t.text(s, it.t, { x: 5.0, y: y + 0.1, w: 4.4, h: rh - 0.2, fontSize: 14, color: C.muted, valign: 'middle' });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.bg };
      const fs = L.fit(d.text, 7.2, 2.4, 40, 22, F.head, false, 1.05, true), th = L.height(d.text, fs, 7.2, F.head, false, 1.05, true);
      const y = (H - th - 0.8) / 2;
      t.text(s, '\u201C', { x: 0.55, y: y - 0.35, w: 1.5, h: 1.9, fontFace: F.head, fontSize: 170, bold: true, color: C.red });
      t.text(s, d.text, { x: 2.1, y, w: 7.2, h: th + 0.05, fontFace: F.head, italic: true, fontSize: fs, lineSpacingMultiple: 1.05 });
      t.rect(s, 2.1, y + th + 0.35, 0.4, 0.04, C.red, { name: 'Accent' });
      if (d.author) t.text(s, d.author, { x: 2.65, y: y + th + 0.22, w: 6.5, h: 0.3, fontSize: 14, color: C.muted });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.ink };
      t.line(s, 0.6, 0.61, 8.8, 0, 'FFFFFF', 2.5, { name: 'Masthead rule' });
      const fs = L.fit(d.title, 8.8, 2.0, 56, 32, F.head, true, 0.95), th = L.height(d.title, fs, 8.8, F.head, true, 0.95);
      t.text(s, d.title, { x: 0.6, y: 3.6 - th, w: 8.8, h: th + 0.05, fontFace: F.head, bold: true, fontSize: fs, color: 'FFFFFF', lineSpacingMultiple: 0.95 });
      t.rect(s, 0.6, 3.85, 0.22, 0.22, C.red, { name: 'Mark' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 1.05, y: 3.8, w: 7.5, h: 1.0, fontFace: F.head, italic: true, fontSize: 18, color: 'BDBDBD' });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, 0.6, 1.7, 3.9, 3.2);
      t.text(s, d.text, { x: 4.85, y: 1.7, w: 4.55, h: 3.2, fontSize: L.fit(d.text, 4.55, 3.2, 15, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'top' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: 0.6, y: 1.7, w: 4.1, h: 3.2, fontSize: L.fit(d.text, 4.1, 3.2, 15, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3 });
      await PH(s, d.image, 5.0, 1.7, 4.4, 3.2);
      t.rect(s, 5.0, 4.98, 0.5, 0.05, C.red, { name: 'Accent' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.55, 3.3 / n);
      d.items.forEach((it, i) => {
        const y = 1.7 + i * rh;
        t.text(s, L.pad2(i + 1), { x: 0.6, y, w: 0.6, h: rh, fontFace: F.head, fontSize: 16, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 8.15, h: rh, fontSize: L.fit(it, 8.15, rh - 0.04, 14, 10, F.body), valign: 'middle' });
        t.line(s, 1.25, y + rh, 8.15, 0, C.hair, 0.5);
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 6.4, 0.95, 3.0, 3.0); },
  });
  // ---- further ways to draw a type, as other pages of the magazine: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, o.font || F.body, false, o.ls || 1.15), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', fontFace: o.font || F.body, lineSpacingMultiple: o.ls || 1.15 });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, italic: !!o.italic, fontSize: L.fit(v, w, h, o.max || 17, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const twoCols = (v) => { const w = String(v).split(' '); let at = 0, n = 0; const half = String(v).length / 2; while (at < w.length - 1 && n < half) n += w[at++].length + 1; return [w.slice(0, at).join(' '), w.slice(at).join(' ')]; };
  const V = {
    image: [
      async (d) => { // a spread: the picture bleeds off the right, the text in two columns under the headline
        const s = page({}), [a, b] = twoCols(d.text);
        await PH(s, d.image, 6.1, 0.48, 3.9, 5.145);
        t.text(s, d.title, { x: 0.6, y: 0.66, w: 5.2, h: 1.1, fontFace: F.head, bold: true, valign: 'top', fontSize: L.fit(d.title, 5.2, 1.05, 30, 18, F.head, true) });
        body(s, a, 0.6, 1.85, 2.5, 3.3, { max: 12.5 }); body(s, b, 3.3, 1.85, 2.5, 3.3, { max: 12.5 });
        vrule(s, 3.2, 1.85, 3.2);
      },
      async (d) => { // the photograph across the page, a drop capital under it
        const s = page(d), v = String(d.text);
        await PH(s, d.image, 0.6, 1.5, 8.8, 1.85);
        t.text(s, v[0], { x: 0.6, y: 3.42, w: 0.7, h: 1.0, fontFace: F.head, bold: true, fontSize: 60, color: C.red, valign: 'top' });
        body(s, v.slice(1), 1.22, 3.48, 8.18, 1.68, { max: 13 });
      },
      async (d) => { // full-page photograph, a white caption block in its corner
        const s = pres.addSlide();
        await PH(s, d.image, 0, 0, W, H);
        t.rect(s, 0.6, 2.05, 5.6, 3.1, C.bg, { name: 'Caption block' });
        t.rect(s, 0.6, 2.05, 5.6, 0.07, C.red, { name: 'Rule' });
        head(s, d.title, 0.8, 2.2, 5.2, 0.75, { max: 22, valign: 'middle' });
        body(s, d.text, 0.8, 2.98, 5.2, 2.05, { max: 12 });
        s.slideNumber = { x: 8.9, y: 0.2, w: 0.5, h: 0.22, fontFace: F.body, fontSize: 10, color: C.bg, align: 'right' };
      },
      async (d) => { // a small portrait set between two columns
        const s = page(d), [a, b] = twoCols(d.text);
        body(s, a, 0.6, 1.6, 2.85, 3.5, { max: 13 }); body(s, b, 6.55, 1.6, 2.85, 3.5, { max: 13 });
        await PH(s, d.image, 3.7, 1.6, 2.6, 3.5);
      },
    ],
    cards: [
      async (d) => { // an index: rules across the page, heading in the margin
        const s = page(d), n = d.items.length, h = 3.55 / n;
        d.items.forEach((it, i) => {
          const y = 1.55 + i * h;
          t.line(s, 0.6, y, 8.8, 0, i ? C.hair : C.ink, i ? 0.75 : 1.5);
          head(s, it.h, 0.6, y + 0.08, 2.9, h - 0.15, { italic: true, max: 18 });
          body(s, it.t, 3.7, y + 0.09, 5.7, h - 0.15, { max: 13 });
        });
      },
      async (d) => { // red squares with numerals, two by two
        const s = page(d), n = d.items.length, w = 4.25, h = 1.72;
        d.items.forEach((it, i) => {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.3), y = 1.6 + Math.floor(i / 2) * (h + 0.05);
          t.rect(s, x, y, 0.62, 0.62, C.red, { name: 'Square' });
          t.text(s, String(i + 1), { x, y, w: 0.62, h: 0.62, fontFace: F.head, bold: true, fontSize: 22, color: C.bg, align: 'center', valign: 'middle' });
          head(s, it.h, x + 0.78, y, ww - 0.78, 0.62, { max: 16, valign: 'middle' });
          body(s, it.t, x + 0.78, y + 0.66, ww - 0.78, h - 0.72, { color: C.muted, max: 12.5 });
        });
      },
      async (d) => { // the first item leads large, the others in smaller type beside it
        const s = page(d), [a, ...rest] = d.items, h = 3.5 / rest.length;
        t.rect(s, 0.6, 1.6, 0.22, 0.22, C.red, { name: 'Mark' });
        head(s, a.h, 0.6, 1.9, 4.2, 0.95, { max: 30, valign: 'top' });
        body(s, a.t, 0.6, 2.9, 4.2, 2.2, { max: 16, font: F.head });
        vrule(s, 5.05, 1.6, 3.5);
        rest.forEach((it, i) => { const y = 1.6 + i * h; head(s, it.h, 5.3, y, 4.1, 0.34, { max: 14, valign: 'middle' }); body(s, it.t, 5.3, y + 0.34, 4.1, h - 0.4, { color: C.muted, max: 12 }); });
      },
      async (d) => { // the page reversed: white on black, columns between rules
        d._night = true;
        const s = pres.addSlide(), n = d.items.length, cw = 8.8 / n; s.background = { color: C.ink };
        t.line(s, 0.6, 0.48, 8.8, 0, C.bg, 1.5);
        t.text(s, d.title, { x: 0.6, y: 0.66, w: 8.8, h: 1.0, fontFace: F.head, bold: true, color: C.bg, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.95, 36, 22, F.head, true) });
        d.items.forEach((it, i) => {
          const x = 0.6 + i * cw;
          t.rect(s, x, 1.95, cw - 0.3, 0.05, C.red, { name: 'Rule' });
          head(s, it.h, x, 2.1, cw - 0.3, 0.6, { color: C.bg, max: 16, valign: 'middle' });
          body(s, it.t, x, 2.75, cw - 0.3, 2.35, { color: 'CFCFCF' });
        });
      },
    ],
    process: [
      async (d) => { // numerals like chapter marks, one under another
        const s = page(d), n = d.steps.length, h = 3.55 / n;
        d.steps.forEach((st, i) => {
          const y = 1.55 + i * h;
          t.text(s, String(i + 1), { x: 0.6, y, w: 0.9, h, fontFace: F.head, bold: true, fontSize: Math.min(44, h * 62), color: C.red, valign: 'top' });
          head(s, st.h, 1.55, y + 0.05, 7.85, 0.36, { max: 16, valign: 'middle' });
          body(s, st.t, 1.55, y + 0.42, 7.85, h - 0.48);
        });
      },
      async (d) => { // text stepping down the page, a red rule tying each step on
        const s = page(d), n = d.steps.length, w = 8.8 / n;
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * w, y = 1.55 + i * (n === 4 ? 0.3 : 0.4), hh = 5.12 - y;
          t.rect(s, x, y, w - 0.15, 0.06, C.red, { name: 'Rule' });
          head(s, `${i + 1}. ${st.h}`, x, y + 0.1, w - 0.2, 0.55, { max: 14, valign: 'middle' });
          body(s, st.t, x, y + 0.68, w - 0.2, hh - 0.7, { max: 12 });
        });
      },
      async (d) => { // arrows set in the type, between ruled columns
        const s = page(d), n = d.steps.length, cw = 8.8 / n;
        t.line(s, 0.6, 1.6, 8.8, 0, C.ink, 1.5); t.line(s, 0.6, 5.1, 8.8, 0, C.ink, 1.5);
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw;
          t.text(s, i < n - 1 ? '→' : '■', { x: x + cw - 0.5, y: 1.65, w: 0.4, h: 0.5, fontSize: i < n - 1 ? 22 : 13, bold: true, color: C.red, align: 'right', valign: 'middle' });
          head(s, st.h, x + 0.05, 2.2, cw - 0.3, 0.7, { max: 17 });
          body(s, st.t, x + 0.05, 2.95, cw - 0.3, 2.1);
          if (i) vrule(s, x - 0.08, 1.7, 3.3);
        });
      },
    ],
    stats: [
      async (d) => { // one number the size of a headline
        const s = page(d), [a, ...rest] = d.stats;
        t.text(s, a.value, { x: 0.6, y: 1.5, w: 5.5, h: 1.95, fontFace: F.head, bold: true, color: C.red, valign: 'middle', fontSize: L.fit(a.value, 5.4, 1.85, 100, 30, F.head, true) });
        body(s, a.label, 0.6, 3.5, 5.3, 1.1, { font: F.head, max: 18 });
        vrule(s, 6.25, 1.6, 3.5);
        rest.forEach((v, i) => { const y = 1.6 + i * 1.12; head(s, v.value, 6.5, y, 2.9, 0.55, { max: 28, valign: 'middle' }); body(s, v.label, 6.5, y + 0.55, 2.9, 0.5, { color: C.muted, max: 11 }); });
        if (d.note) body(s, d.note, 6.5, 3.85, 2.9, 1.25, { color: C.muted, max: 10.5 });
      },
      async (d) => { // a table of figures, rules only
        const s = page(d), rh = d.note ? 0.9 : 1.12;
        d.stats.forEach((v, i) => {
          const y = 1.6 + i * rh;
          t.line(s, 0.6, y, 8.8, 0, i ? C.hair : C.ink, i ? 0.75 : 1.5);
          head(s, v.value, 0.6, y + 0.03, 3.0, rh - 0.06, { max: 36, color: C.red, valign: 'middle' });
          body(s, v.label, 3.8, y + 0.03, 5.6, rh - 0.06, { valign: 'middle', max: 16, font: F.head });
        });
        if (d.note) body(s, d.note, 0.6, 4.35, 8.8, 0.8, { color: C.muted, max: 11 });
      },
    ],
    compare: [
      async (d) => { // a ledger: each row reads across, a rule between
        const s = page(d), w = 4.15;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.18, 2.85);
        head(s, d.left.h, 0.6, 1.55, w, 0.5, { max: 19, valign: 'middle' }); head(s, d.right.h, 5.25, 1.55, w, 0.5, { max: 19, color: C.red, valign: 'middle' });
        t.line(s, 0.6, 2.08, 8.8, 0, C.ink, 1.5);
        let y = 2.16;
        rows.forEach((rh, k) => {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.6, y, w, h: rh, fontSize: fs, color: C.muted });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.25, y, w, h: rh, fontSize: fs, color: C.ink });
          y += rh; if (k < rows.length - 1) t.line(s, 0.6, y - 0.06, 8.8, 0, C.hair, 0.75);
        });
      },
      async (d) => { // two short articles, one over the other, the second on red
        const s = page(d), h = 1.72;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.55 + i * (h + 0.1), hot = i === 1, ink = hot ? C.bg : C.ink;
          if (hot) t.rect(s, 0.6, y, 8.8, h, C.red, { name: 'Red block' });
          head(s, side.h, 0.8, y + 0.1, 2.2, h - 0.2, { max: 20, color: ink, italic: true });
          side.items.forEach((it, k) => body(s, it, 3.2 + (k % 2) * 3.1, y + 0.1 + Math.floor(k / 2) * 0.78, 2.95, 0.74, { color: ink }));
          if (!hot) t.line(s, 0.6, y + h, 8.8, 0, C.ink, 1.5);
        });
      },
    ],
    statement: [
      async (d) => { // a pull quote: huge red mark in the margin, the words beside it
        const s = page(d);
        t.rect(s, 0.6, 1.65, 0.22, 3.4, C.red, { name: 'Red bar' });
        t.text(s, L.runs(d.text), { x: 1.1, y: 1.6, w: 5.2, h: 3.5, fontFace: F.head, bold: true, valign: 'middle', fontSize: L.fit(d.text, 5.2, 3.4, 36, 17, F.head, true) });
        if (d.caption) { vrule(s, 6.55, 1.65, 3.4); body(s, d.caption, 6.8, 1.65, 2.6, 3.4, { color: C.muted, valign: 'bottom' }); }
      },
      async (d) => { // the page in black, the words white
        d._night = true;
        const s = pres.addSlide(); s.background = { color: C.ink };
        head(s, d.title, 0.6, 0.5, 8.8, 0.45, { color: 'BDBDBD', max: 14, valign: 'middle' });
        t.rect(s, 0.6, 1.0, 0.8, 0.07, C.red, { name: 'Rule' });
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.2, w: 8.8, h: 2.6, fontFace: F.head, bold: true, color: C.bg, valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.5, 44, 18, F.head, true) });
        if (d.caption) body(s, d.caption, 0.6, 3.9, 7.5, 1.2, { color: 'CFCFCF' });
      },
    ],
    timeline: [
      async (d) => { // years set large down the margin
        const s = page(d), n = d.items.length, h = 3.55 / n;
        d.items.forEach((it, i) => {
          const y = 1.55 + i * h;
          t.line(s, 0.6, y, 8.8, 0, i ? C.hair : C.ink, i ? 0.75 : 1.5);
          head(s, it.year, 0.6, y + 0.04, 2.3, h - 0.08, { max: 28, color: C.red, valign: 'middle' });
          head(s, it.h, 3.0, y + 0.08, 2.0, h - 0.14, { max: 14, italic: true });
          body(s, it.t, 5.1, y + 0.08, 4.3, h - 0.14, { max: 12 });
        });
      },
      async (d) => { // a thin rule across the top, years hung from it
        const s = page(d), n = d.items.length, cw = 8.8 / n;
        t.line(s, 0.6, 1.72, 8.8, 0, C.ink, 2.5);
        d.items.forEach((it, i) => {
          const x = 0.6 + i * cw;
          t.rect(s, x, 1.63, 0.18, 0.18, C.red, { name: 'Mark' });
          head(s, it.year, x, 1.9, cw - 0.2, 0.6, { max: 24, valign: 'middle' });
          head(s, it.h, x, 2.52, cw - 0.2, 0.48, { max: 13, italic: true, color: C.red, valign: 'middle' });
          body(s, it.t, x, 3.02, cw - 0.2, 2.1, { color: C.muted, max: 12 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => ({ x: 0.6, y: 5.25, w: 8.8, h: 0.22, color: type === 'closing' || d._night ? 'BDBDBD' : C.muted }));
  return L.save(pres, out, { name: 'SlideAI Editorial', colors: { dk1: C.ink, lt1: C.bg, dk2: '333333', lt2: 'F2F2F2', accent1: C.red, accent2: C.ink, accent3: C.muted, accent4: '8C1A2B', accent5: 'B3B3B3', accent6: C.hair, hlink: C.red, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "jurnalistik: qiziqarli sarlavhalar, tahliliy va ravon matn", "limits": {}, "prefer": "text"};
module.exports = { id: 2, slug: 'editorial', name: 'Editorial', category: 'academic', build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["pull:l", "fade", "p14:gallery|dir=\"r\""], "cover": ["riseWords", "fadeLetters"], "mark": "fade", "deco": "wipe:r", "sig": {"title": "sweepIn", "body": "fadeWords", "item": "fadeUp", "image": "wipe:d", "number": "fade", "order": "seq", "stagger": 0.2}, "tempo": 1.1, "kenburns": false};
