/**
 * 41 Gazeta — broadsheet newspaper: masthead, double rules, headline type, justified
 * columns separated by hairlines, newsprint (grayscale halftone) photos with captions.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'F3F0E8', ink: '141414', gray: '555555', rule: '1E1E1E', hair: 'B9B3A6', red: 'A3121E' };
const F = { head: 'Times New Roman', body: 'Times New Roman' };

/** split a paragraph into n roughly equal columns at word boundaries */
const columns = (text, n) => {
  const words = String(text).split(/\s+/), per = Math.ceil(text.length / n), out = [];
  let cur = '';
  for (const w of words) { if ((cur + ' ' + w).length > per && out.length < n - 1 && cur) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }
  out.push(cur); return out;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const dbl = (s, y, x = 0.5, w = 9.0) => { t.line(s, x, y, w, 0, C.rule, 2.25); t.line(s, x, y + 0.06, w, 0, C.rule, 0.5); };
  const news = async (s, src, x, y, w, h, cap) => {
    t.img(s, await L.photo(L.src(src), w, h, { news: true }), x, y, w, h, { alt: '' });
    if (cap) t.text(s, cap, { x, y: y + h + 0.04, w, h: 0.26, fontSize: 9, italic: true, color: C.gray });
  };
  const cols = (s, txt, x, y, w, h, n, size) => { // justified columns with hairlines between
    const parts = columns(txt, n), gap = 0.22, cw = (w - gap * (n - 1)) / n;
    const fs = size || Math.min(...parts.map((p) => L.fit(p, cw, h, 14, 10, F.body, false, 1.15)));
    parts.forEach((p, k) => {
      const runs = k === 0 ? [{ text: p[0], options: { fontSize: fs * 2.4, bold: true } }, { text: p.slice(1) }] : [{ text: p }];
      t.text(s, runs, { x: x + k * (cw + gap), y, w: cw, h, fontSize: fs, color: C.ink, align: 'justify', valign: 'top', lineSpacingMultiple: 1.15 });
      if (k) t.line(s, x + k * (cw + gap) - gap / 2, y, 0, h, C.hair, 0.5);
    });
  };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    t.text(s, (M.topic || '').toUpperCase(), { x: 0.5, y: 0.22, w: 5.0, h: 0.25, fontSize: 8.5, bold: true, color: C.ink, charSpacing: 1 });
    t.text(s, `${TR.no} ${idx}   \u2022   ${meta}`, { x: 4.5, y: 0.22, w: 5.0, h: 0.25, fontSize: 8.5, color: C.gray, align: 'right' });
    dbl(s, 0.5);
    if (d.title) t.text(s, d.title, { x: 0.5, y: 0.62, w: 9.0, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 9.0, 0.7, 32, 18, F.head, true) });
    t.line(s, 0.5, 5.25, 9.0, 0, C.rule, 0.75);
    return s;
  };

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    t.text(s, [M.loc, M.year].filter(Boolean).join(', '), { x: 0.5, y: 0.25, w: 3, h: 0.25, fontSize: 9, color: C.gray });
    t.text(s, `${TR.no} ${idx}`, { x: 6.5, y: 0.25, w: 3, h: 0.25, fontSize: 9, color: C.gray, align: 'right' });
    t.line(s, 0.5, 0.55, 9.0, 0, C.rule, 0.5);
    t.text(s, (M.org || M.topic || '').toUpperCase(), { x: 0.5, y: 0.6, w: 9.0, h: 0.8, fontSize: L.fit((M.org || M.topic || '').toUpperCase(), 8.6, 0.8, 46, 20, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle', charSpacing: 4 });
    dbl(s, 1.45);
    const pw = d.image ? 3.6 : 0, tw = 9.0 - (pw ? pw + 0.35 : 0);
    if (d.image) await news(s, d.image, 5.9, 1.75, pw, 2.75, `${TR.caption}: ${M.loc || ''} ${M.year || ''}`.trim());
    const fs = L.fit(d.title, tw, 1.9, 44, 22, F.head, true);
    t.text(s, d.title, { x: 0.5, y: 1.7, w: tw, h: 2.0, bold: true, fontSize: fs, color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.5, y: 3.8, w: tw, h: 0.7, italic: true, fontSize: 14, color: C.gray });
    t.text(s, [{ text: TR.by, options: { color: C.gray } }, { text: M.author || '', options: { bold: true, color: C.red } }], { x: 0.5, y: 4.6, w: tw, h: 0.35, fontSize: 12 });
    t.line(s, 0.5, 5.25, 9.0, 0, C.rule, 0.75);
    t.text(s, M.topic || '', { x: 0.5, y: 5.28, w: 9.0, h: 0.25, fontSize: 8, color: C.gray, align: 'center' });
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = page(d); await news(s, d.image, 0.5, 1.5, 4.1, 3.0, d.title); cols(s, d.text, 4.9, 1.5, 4.6, 3.6, 2); },
    async image(d) { const s = page(d); cols(s, d.text, 0.5, 1.5, 3.6, 3.6, 1); t.line(s, 4.3, 1.5, 0, 3.6, C.hair, 0.5); await news(s, d.image, 4.5, 1.5, 5.0, 3.2, d.title); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(0.75, 3.5 / per);
      t.line(s, 5.0, 1.55, 0, rh * per, C.hair, 0.5);
      d.items.forEach((it, i) => {
        const x = 0.5 + Math.floor(i / per) * 4.7, y = 1.55 + (i % per) * rh;
        t.text(s, String(i + 1), { x, y, w: 0.5, h: rh, fontSize: 26, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: x + 0.55, y, w: 3.75, h: rh, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
        t.line(s, x, y + rh, 4.3, 0, C.hair, 0.5);
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const x = 0.5 + i * (w + gap);
        if (i) t.line(s, x - gap / 2, 1.55, 0, 3.5, C.hair, 0.5);
        t.text(s, L.pad2(i + 1), { x, y: 1.5, w, h: 0.3, fontSize: 10, bold: true, color: C.red, charSpacing: 2 });
        t.text(s, it.h, { x, y: 1.82, w, h: 0.75, fontSize: L.fit(it.h, w, 0.75, 20, 13, F.head, true), bold: true, color: C.ink, valign: 'top' });
        t.text(s, it.t, { x, y: 2.65, w, h: 2.35, fontSize: 13, color: C.ink, align: 'justify', lineSpacingMultiple: 1.15 });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      d.steps.forEach((st, i) => {
        const x = 0.5 + i * (w + gap);
        if (i) t.line(s, x - gap / 2, 1.55, 0, 3.5, C.hair, 0.5);
        t.text(s, String(i + 1), { x, y: 1.4, w, h: 0.8, fontSize: 48, bold: true, color: C.ink });
        t.line(s, x, 2.25, w, 0, C.rule, 1.5);
        t.text(s, st.h, { x, y: 2.35, w, h: 0.5, fontSize: L.fit(st.h, w, 0.5, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 2.9, w, h: 2.1, fontSize: 13, color: C.ink, align: 'justify' });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.5 + i * (w + gap);
        if (i) t.line(s, px - gap / 2, 1.6, 0, 2.6, C.hair, 0.5);
        t.text(s, x.value, { x: px, y: 1.55, w, h: 1.3, fontSize: L.fit(x.value, w, 1.2, 66, 30, F.head, true), bold: true, color: i === 0 ? C.red : C.ink, valign: 'middle' });
        t.text(s, x.label, { x: px, y: 2.95, w, h: 1.0, fontSize: 14, italic: true, color: C.gray });
      });
      if (d.note) { t.line(s, 0.5, 4.45, 9.0, 0, C.hair, 0.5); t.text(s, d.note, { x: 0.5, y: 4.5, w: 9.0, h: 0.5, fontSize: 10, color: C.gray }); }
    },
    async compare(d) {
      const s = page(d), w = 4.35;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.35, F.body, 0.18, 4.85 - 2.15);
      t.line(s, 5.0, 1.5, 0, 3.55, C.hair, 0.5);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.5 + i * (w + 0.3);
        t.rect(s, x, 1.5, w, 0.45, i ? C.ink : C.red, { name: 'Kicker' });
        t.text(s, side.h.toUpperCase(), { x: x + 0.15, y: 1.5, w: w - 0.3, h: 0.45, fontSize: 13, bold: true, color: 'FFFFFF', valign: 'middle', charSpacing: 1 });
        let y = 2.15;
        side.items.forEach((it, k) => { t.text(s, '\u25A0', { x, y, w: 0.25, h: 0.3, fontSize: 9, color: i ? C.ink : C.red }); t.text(s, it, { x: x + 0.3, y, w: w - 0.35, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      dbl(s, 1.55, 1.0, 8.0);
      t.text(s, L.runs(d.text), { x: 1.0, y: 1.75, w: 8.0, h: 1.9, italic: true, bold: true, fontSize: L.fit(d.text, 8.0, 1.8, 36, 20, F.head, true, 1, true), color: C.ink, align: 'center', valign: 'middle' });
      dbl(s, 3.75, 1.0, 8.0);
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 3.95, w: 8.0, h: 1.1, fontSize: L.fit(d.caption, 8.0, 1.1, 14, 10, F.body), color: C.gray, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.55 / n;
      d.items.forEach((it, i) => {
        const y = 1.5 + i * rh;
        t.text(s, it.year, { x: 0.5, y, w: 1.4, h: rh - 0.08, fontSize: L.fit(it.year, 1.4, 0.5, 24, 12, F.head, true), bold: true, color: C.red, valign: 'top' });
        t.text(s, [{ text: it.h + '. ', options: { bold: true } }, { text: it.t }], { x: 2.05, y, w: 7.45, h: rh - 0.08, fontSize: L.fit(it.h + '. ' + it.t, 7.45, rh - 0.1, 15, 10, F.body), color: C.ink, valign: 'top' });
        if (i < n - 1) t.line(s, 0.5, y + rh - 0.04, 9.0, 0, C.hair, 0.5);
      });
    },
    async quote(d) {
      const s = page({});
      t.text(s, '\u201C', { x: 0.5, y: 0.9, w: 1.2, h: 1.4, fontSize: 110, bold: true, color: C.red });
      t.text(s, d.text, { x: 1.6, y: 1.2, w: 7.6, h: 2.6, italic: true, fontSize: L.fit(d.text, 7.6, 2.5, 34, 18, F.head, false, 1, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`.toUpperCase(), { x: 1.6, y: 3.95, w: 7.6, h: 0.35, fontSize: 11, bold: true, color: C.gray, charSpacing: 1 });
    },
    async sources(d) {
      const s = page(d), half = Math.ceil(d.items.length / 2), rh = Math.min(0.85, 3.5 / half);
      t.line(s, 5.0, 1.5, 0, rh * half, C.hair, 0.5);
      d.items.forEach((it, i) => {
        const x = 0.5 + Math.floor(i / half) * 4.7, y = 1.5 + (i % half) * rh;
        t.text(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.red } }, { text: it, options: { color: C.ink } }], { x, y, w: 4.3, h: rh, fontSize: L.fit(it, 4.1, rh - 0.05, 13, 9, F.body), valign: 'top' });
      });
    },
  };
  // ---- further ways to draw a type, as a newspaper makes up its pages: a deck's pages must not look alike (L.pages)
  const X0 = 0.5, FW = 9.0, Y1 = 5.16;
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 17, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', italic: o.italic });
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body, false, 1.08), lineSpacingMultiple: 1.08, color: o.color || C.ink, align: o.align || 'justify', valign: o.valign || 'top', italic: o.italic });
  // short columns, no drop cap: the cap's tall first line would push the text out of a low box
  const plainCols = (s, txt, x, y, w, h, n) => { const parts = columns(txt, n), g = 0.22, cw = (w - g * (n - 1)) / n, fs = Math.min(...parts.map((p) => L.fit(p, cw, h, 13, 10, F.body, false, 1.1))); parts.forEach((p, k) => { t.text(s, p, { x: x + k * (cw + g), y, w: cw, h, fontSize: fs, color: C.ink, align: 'justify', lineSpacingMultiple: 1.1 }); if (k) t.line(s, x + k * (cw + g) - g / 2, y, 0, h, C.hair, 0.5); }); };
  const red = (s, x, y, w, h = 0.05) => t.rect(s, x, y, w, h, C.red, { name: 'Red rule' });
  // the black page: same paper make-up with the ink reversed
  const nightPage = (d) => {
    const s = pres.addSlide(); s.background = { color: C.ink }; idx++;
    t.text(s, (M.topic || '').toUpperCase(), { x: 0.5, y: 0.22, w: 5.0, h: 0.25, fontSize: 8.5, bold: true, color: 'FFFFFF', charSpacing: 1 });
    t.text(s, `${TR.no} ${idx}   •   ${meta}`, { x: 4.5, y: 0.22, w: 5.0, h: 0.25, fontSize: 8.5, color: 'D8D2C4', align: 'right' });
    t.line(s, 0.5, 0.5, 9.0, 0, 'FFFFFF', 2.25); t.line(s, 0.5, 0.56, 9.0, 0, 'FFFFFF', 0.5);
    if (d.title) t.text(s, d.title, { x: 0.5, y: 0.62, w: 9.0, h: 0.7, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 9.0, 0.7, 32, 18, F.head, true) });
    t.line(s, 0.5, 5.25, 9.0, 0, 'FFFFFF', 0.75);
    return s;
  };
  const V = {
    image: [
      async (d) => { // the front page: a picture the full width of the sheet, three columns under it
        const s = page(d);
        await news(s, d.image, X0, 1.38, FW, 2.02);
        dbl(s, 3.46);
        plainCols(s, d.text, X0, 3.6, FW, 1.58, 3);
      },
      async (d) => { // the picture set in the middle of the story, a column either side
        const s = page(d), [a, b] = columns(d.text, 2), w = 2.55, px = 3.25, pw = 3.5, y = 1.46;
        cols(s, a, X0, y, w, 3.68, 1);
        await news(s, d.image, px, y + 0.05, pw, 3.3);
        t.line(s, px - 0.1, y, 0, 3.68, C.hair, 0.5); t.line(s, px + pw + 0.1, y, 0, 3.68, C.hair, 0.5);
        red(s, px, y + 3.42, pw);
        t.text(s, b, { x: 6.95, y, w, h: 3.68, fontSize: L.fit(b, w, 3.68, 14, 10, F.body, false, 1.15), color: C.ink, align: 'justify', lineSpacingMultiple: 1.15 });
      },
      async (d) => { // a picture across the whole sheet, the story in a black box at its side
        const s = page(d), y = 1.36, h = 3.86;
        t.img(s, await L.photo(L.src(d.image), W, h, { news: true }), 0, y, W, h, { alt: d.title });
        t.rect(s, 5.2, y + 0.16, 4.5, h - 0.32, C.ink, { name: 'Black box' });
        red(s, 5.2, y + 0.16, 4.5, 0.08);
        t.text(s, d.text, { x: 5.4, y: y + 0.32, w: 4.1, h: h - 0.6, fontSize: L.fit(d.text, 4.1, h - 0.6, 14, 10.5, F.body, false, 1.15), color: 'FFFFFF', align: 'justify', lineSpacingMultiple: 1.15, valign: 'middle' });
      },
      async (d) => { // a portrait cameo in an oval, as for a person of note, then two columns
        const s = page(d), w = 2.9, h = 3.5, x = X0 + 0.05, y = 1.52;
        t.oval(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, null, { line: { color: C.rule, width: 1.75 } });
        t.img(s, await L.photo(L.src(d.image), w, h, { news: true, mask: 'circle' }), x, y, w, h, { alt: d.title });
        cols(s, d.text, 3.75, 1.46, 5.75, 3.62, 1);
      },
    ],
    cards: [
      async (d) => { // the "in this issue" list: a black square for each section, a rule between
        const s = page(d), n = d.items.length, y0 = 1.42, h = 3.74 / n, D = Math.min(0.64, h - 0.2);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h;
          t.rect(s, X0, y + (h - D) / 2, D, D, i ? C.ink : C.red, { name: 'Section mark' });
          t.img(s, await L.icon(it.icon, 'FFFFFF', 2.25), X0 + D * 0.22, y + (h - D) / 2 + D * 0.22, D * 0.56, D * 0.56);
          head(s, it.h, X0 + D + 0.2, y + 0.04, 2.4, h - 0.1, { valign: 'middle', max: 16 });
          body(s, it.t, 3.85, y + 0.04, 5.65, h - 0.1, { valign: 'middle' });
          if (i < n - 1) t.line(s, X0, y + h - 0.01, FW, 0, C.hair, 0.75);
        }
      },
      async (d) => { // the lead story and its sidebars: a large headline, smaller stories by it
        const s = page(d), [a, ...rest] = d.items, h = 3.72 / rest.length;
        red(s, X0, 1.42, 5.2, 0.07);
        t.img(s, await L.icon(a.icon, C.red, 2.25), X0, 1.58, 0.42, 0.42);
        head(s, a.h, X0 + 0.54, 1.54, 4.66, 0.92, { max: 30, valign: 'middle' });
        cols(s, a.t, X0, 2.54, 5.2, 2.56, 1);
        t.line(s, 5.95, 1.42, 0, 3.72, C.rule, 1);
        rest.forEach((it, i) => {
          const y = 1.42 + i * h;
          head(s, it.h, 6.15, y, 3.35, 0.36, { max: 15 });
          body(s, it.t, 6.15, y + 0.38, 3.35, h - 0.46);
          if (i < rest.length - 1) t.line(s, 6.15, y + h - 0.04, 3.35, 0, C.hair, 0.5);
        });
      },
      async (d) => { // the classifieds: small boxed notices in heavy rules, heading in capitals
        const s = page(d), n = d.items.length, g = 0.14, w = (FW - g) / 2, h = 1.8;
        const spots = n === 3 ? [[X0, 1.42, w], [X0 + w + g, 1.42, w], [X0, 1.42 + h + g, FW]] : [0, 1, 2, 3].map((i) => [X0 + (i % 2) * (w + g), 1.42 + (i >> 1) * (h + g), w]);
        for (const [i, it] of d.items.entries()) {
          const [x, y, ww] = spots[i], T = it.h.toUpperCase();
          t.rect(s, x, y, ww, h, null, { line: { color: C.rule, width: 2 }, name: 'Notice' });
          t.rect(s, x + 0.05, y + 0.05, ww - 0.1, h - 0.1, null, { line: { color: C.rule, width: 0.5 }, name: 'Notice edge' });
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.16, y + 0.17, 0.28, 0.28);
          t.text(s, T, { x: x + 0.52, y: y + 0.12, w: ww - 0.68, h: 0.38, bold: true, fontSize: L.fit(T, ww - 0.68, 0.36, 15, 10.5, F.head, true), color: C.ink, valign: 'middle' });
          body(s, it.t, x + 0.18, y + 0.54, ww - 0.36, h - 0.64);
        }
      },
      async (d) => { // the late edition: black page, white type, columns in different lengths
        const s = nightPage(d), n = d.items.length, g = 0.26, w = (FW - g * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + g), y = 1.46 + (i % 2 ? 0.32 : 0);
          if (i) t.line(s, x - g / 2, 1.46, 0, 3.64, '7A7A7A', 0.5);
          red(s, x, y, w, 0.07);
          t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x, y + 0.14, 0.3, 0.3);
          head(s, it.h, x, y + 0.5, w, 0.58, { color: 'FFFFFF', max: 16 });
          body(s, it.t, x, y + 1.1, w, 5.12 - y - 1.1, { color: 'FFFFFF', max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a comic strip off the back page: boxed panels, a tab with the number
        const s = page(d), n = d.steps.length, g = 0.1, w = (FW - g * (n - 1)) / n, y = 1.46, h = 3.68;
        d.steps.forEach((st, i) => {
          const x = X0 + i * (w + g);
          t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: C.rule, width: 1.5 }, name: 'Strip panel' });
          t.rect(s, x, y, 0.5, 0.42, C.ink, { name: 'Tab' });
          t.text(s, String(i + 1), { x, y, w: 0.5, h: 0.42, bold: true, fontSize: 16, color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.14, y + 0.5, w - 0.28, 0.58, { max: 15 });
          body(s, st.t, x + 0.14, y + 1.08, w - 0.28, h - 1.18, { max: 13 });
        });
      },
      async (d) => { // a heavy column rule down the middle: numbered items on alternate sides
        const s = page(d), n = d.steps.length, y0 = 1.44, h = 3.72 / n, cx = 5, B = 0.46;
        t.line(s, cx - 0.03, y0, 0, 3.72, C.rule, 1.5); t.line(s, cx + 0.03, y0, 0, 3.72, C.rule, 0.5);
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? X0 : 5.4, w = 4.1, al = left ? 'right' : 'left';
          t.oval(s, cx - B / 2, y + h / 2 - B / 2, B, B, C.red);
          t.text(s, String(i + 1), { x: cx - B / 2, y: y + h / 2 - B / 2, w: B, h: B, bold: true, fontSize: 15, color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.02, w, 0.32, { max: 15, align: al });
          body(s, st.t, x, y + 0.34, w, h - 0.38, { align: al, max: 13 });
        });
      },
      async (d) => { // columns of falling length, a great numeral hung over each
        const s = page(d), n = d.steps.length, g = 0.22, w = (FW - g * (n - 1)) / n, drop = n === 3 ? 0.46 : 0.32;
        d.steps.forEach((st, i) => {
          const x = X0 + i * (w + g), y = 1.42 + i * drop;
          if (i) t.line(s, x - g / 2, y, 0, Y1 - y, C.hair, 0.5);
          t.text(s, String(i + 1), { x, y, w: 0.7, h: 0.72, bold: true, fontSize: 40, color: C.red, valign: 'middle' });
          head(s, st.h, x + 0.62, y + 0.04, w - 0.62, 0.66, { max: 14, valign: 'middle' });
          t.line(s, x, y + 0.76, w, 0, C.rule, 1.5);
          body(s, st.t, x, y + 0.84, w, Y1 - y - 0.86);
        });
      },
      async (d) => { // the instalments: each paragraph set further in, a bold run-in head on it
        const s = page(d), n = d.steps.length, h = 3.72 / n, dx = n === 3 ? 0.75 : 0.5, w = FW - dx * (n - 1) - 0.62;
        d.steps.forEach((st, i) => {
          const x = X0 + i * dx, y = 1.44 + i * h, T = `${st.h}. ${st.t}`;
          t.rect(s, x, y + 0.03, 0.5, 0.5, C.ink, { name: 'Number' });
          t.text(s, String(i + 1), { x, y: y + 0.03, w: 0.5, h: 0.5, bold: true, fontSize: 18, color: 'FFFFFF', align: 'center', valign: 'middle' });
          t.text(s, [{ text: `${st.h}. `, options: { bold: true, color: C.red } }, { text: st.t, options: { color: C.ink } }], { x: x + 0.62, y, w, h: h - 0.08, fontSize: L.fit(T, w, h - 0.1, 14, 10.5, F.body, true), valign: 'top' });
          if (i < n - 1) t.line(s, x, y + h - 0.05, w + 0.62, 0, C.hair, 0.5);
        });
      },
    ],
    stats: [
      async (d) => { // the headline number, red, the whole left of the page; lesser figures in a column
        const s = page(d), [a, ...rest] = d.stats;
        t.text(s, a.value, { x: X0, y: 1.4, w: 5.3, h: 1.56, bold: true, fontSize: L.fit(a.value, 5.3, 1.5, 88, 36, F.head, true), color: C.red, valign: 'middle' });
        red(s, X0, 3.0, 5.3, 0.06);
        t.text(s, a.label, { x: X0, y: 3.1, w: 5.3, h: 0.64, italic: true, fontSize: L.fit(a.label, 5.3, 0.62, 16, 11, F.body), color: C.ink });
        t.line(s, 6.0, 1.46, 0, 2.3, C.rule, 1);
        rest.forEach((q, i) => {
          const y = 1.42 + i * 1.18;
          t.text(s, q.value, { x: 6.2, y, w: 3.3, h: 0.62, bold: true, fontSize: L.fit(q.value, 3.3, 0.6, 32, 18, F.head, true), color: C.ink, valign: 'middle' });
          t.text(s, q.label, { x: 6.2, y: y + 0.62, w: 3.3, h: 0.5, italic: true, fontSize: L.fit(q.label, 3.3, 0.48, 13, 10, F.body), color: C.gray });
        });
        if (d.note) { dbl(s, 3.86); body(s, d.note, X0, 3.98, FW, 1.18, { max: 14, valign: 'middle' }); }
      },
      async (d) => { // the markets strip: a black band across the whole sheet, white figures in cells
        const s = page(d), y = 1.5, h = 2.24, cw = FW / 3;
        t.rect(s, 0, y, W, h, C.ink, { name: 'Black band' });
        red(s, 0, y, W, 0.08);
        d.stats.forEach((q, i) => {
          const x = X0 + i * cw;
          if (i) t.line(s, x - 0.08, y + 0.24, 0, h - 0.4, '7A7A7A', 0.75);
          t.text(s, q.value, { x, y: y + 0.18, w: cw - 0.18, h: 1.04, bold: true, fontSize: L.fit(q.value, cw - 0.18, 1.0, 46, 22, F.head, true), color: 'FFFFFF', valign: 'middle' });
          t.text(s, q.label, { x, y: y + 1.24, w: cw - 0.18, h: 0.88, italic: true, fontSize: L.fit(q.label, cw - 0.18, 0.86, 14, 10.5, F.body), color: 'E9E4D6' });
        });
        if (d.note) body(s, d.note, X0, 3.84, FW, 1.3, { max: 14, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the debate column: the two opinions mirrored about one heavy black rule
        const s = page(d), w = 4.1, y0 = 2.06, avail = 3.08, fit = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.12, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        t.rect(s, 4.95, 1.46, 0.1, 3.68, C.ink, { name: 'Heavy rule' });
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.3 : 0.6, al = i ? 'left' : 'right', col = i ? C.ink : C.red;
          head(s, side.h, x, 1.44, w, 0.58, { color: col, align: al, max: 22, valign: 'middle' });
          let y = y0;
          fit.rows.forEach((rh0, k) => {
            const rh = rh0 + extra;
            if (side.items[k]) t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: C.ink, align: al, valign: 'middle' });
            if (k < fit.rows.length - 1) t.line(s, x, y + rh, w, 0, C.hair, 0.5);
            y += rh;
          });
        });
      },
      async (d) => { // two departments one above the other: a thick rule and kicker, items in columns
        const s = page(d), bh = 1.82, g = 0.08;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.44 + i * (bh + g), col = i ? C.ink : C.red, n = side.items.length, cw = FW / n, T = side.h.toUpperCase();
          t.rect(s, X0, y, FW, 0.07, col, { name: 'Thick rule' });
          t.text(s, T, { x: X0, y: y + 0.1, w: FW, h: 0.38, bold: true, fontSize: L.fit(T, FW, 0.36, 18, 12, F.head, true), color: col, valign: 'middle', charSpacing: 1 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, X0 + k * cw - 0.1, y + 0.56, 0, bh - 0.66, C.hair, 0.5);
            body(s, it, X0 + k * cw, y + 0.52, cw - 0.2, bh - 0.58, { max: 14 });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the banner headline: giant type across the sheet, the report in three columns
        const s = page(d);
        red(s, X0, 1.36, FW, 0.08);
        t.text(s, L.runs(d.text), { x: X0, y: 1.48, w: FW, h: 2.5, bold: true, fontSize: L.fit(d.text, FW, 2.44, 44, 22, F.head, true), color: C.ink, valign: 'middle' });
        if (d.caption) { dbl(s, 4.0); plainCols(s, d.caption, X0, 4.12, FW, 1.06, 3); }
      },
      async (d) => { // the black page: the sentence in white, the note set small in its own column
        const s = nightPage(d);
        red(s, X0, 1.42, 5.8, 0.08);
        t.text(s, L.runs(d.text), { x: X0, y: 1.56, w: 5.8, h: 3.56, bold: true, italic: true, fontSize: L.fit(d.text, 5.8, 3.5, 34, 18, F.head, true, 1, true), color: 'FFFFFF', valign: 'middle' });
        if (d.caption) { t.line(s, 6.55, 1.46, 0, 3.64, '7A7A7A', 0.75); body(s, d.caption, 6.75, 1.46, 2.75, 3.66, { color: 'FFFFFF', max: 15, valign: 'middle' }); }
      },
    ],
    timeline: [
      async (d) => { // a dateline across the middle of the sheet: black date tabs, reports above and below
        const s = page(d), ly = 3.26, w = 4.2, xs = [X0, 1.0, 4.9, 5.3], px = [X0, 2.75, 4.9, 7.2], pw = 1.4, ph = 0.38;
        t.line(s, X0, ly, FW, 0, C.rule, 2.25);
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], y = up ? 1.42 : ly + 0.28, h = up ? ly - 0.27 - y : Y1 - y;
          t.rect(s, px[i], ly - ph / 2, pw, ph, i % 2 ? C.red : C.ink, { name: 'Date tab' });
          t.text(s, it.year, { x: px[i] + 0.03, y: ly - ph / 2, w: pw - 0.06, h: ph, bold: true, fontSize: L.fit(it.year, pw - 0.12, ph - 0.06, 15, 10.5, F.head, true), color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, it.h, x, y, w, 0.3, { max: 14, align: up ? 'left' : 'right' });
          body(s, it.t, x, y + 0.31, w, h - 0.33, { max: 14, align: up ? 'left' : 'right' });
        });
      },
      async (d) => { // back numbers: four columns, each under a reversed block with its date
        const s = page(d), g = 0.14, w = (FW - 3 * g) / 4, y = 1.44, bh = 0.86;
        d.items.forEach((it, i) => {
          const x = X0 + i * (w + g);
          t.rect(s, x, y, w, bh, i % 2 ? C.red : C.ink, { name: 'Date block' });
          t.text(s, it.year, { x: x + 0.05, y, w: w - 0.1, h: bh, bold: true, fontSize: L.fit(it.year, w - 0.14, bh - 0.2, 26, 13, F.head, true), color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, it.h, x, y + bh + 0.1, w, 0.58, { max: 15 });
          t.line(s, x, y + bh + 0.7, w, 0, C.rule, 1);
          body(s, it.t, x, y + bh + 0.78, w, Y1 - y - bh - 0.8, { max: 13.5 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.process = V.process.shift(); // the old process page read as the cards page: hairline columns
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Gazeta', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: C.paper, accent1: C.red, accent2: C.ink, accent3: C.gray, accent4: C.hair, accent5: '7A7A7A', accent6: 'D8D2C4', hlink: C.red, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "gazeta uslubi: sarlavhalar xabar kabi (kim, nima, qachon), matn faktlarga boy, betaraf va aniq", limits: {}, prefer: 'text' };
module.exports = { id: 41, slug: 'gazeta', name: 'Gazeta', category: 'academic', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "elegant"], "transitions": ["blinds:v", "fade", "pull:l"], "cover": ["typeLetters", "fadeLetters"], "mark": "appear", "deco": "wipe:d", "sig": {"title": "typeLetters", "body": "wipe:d", "item": "blindsV", "image": "wipe:d", "number": "appear", "order": "seq", "stagger": 0.16}, "tempo": 1.0, "kenburns": false};
