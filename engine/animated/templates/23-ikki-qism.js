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
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 13, w - 0.4, F.body, 0.2, 4.9 - 1.45);
      [d.left, d.right].forEach((side, i) => {
        const x = X + i * (w + 0.3);
        t.rect(s, x, 0.55, w, 4.45, i ? C.teal : C.white, { name: 'Column' });
        t.text(s, side.h, { x: x + 0.2, y: 0.7, w: w - 0.4, h: 0.6, fontFace: F.head, fontSize: 16, bold: true, color: i ? C.white : C.teal });
        let y = 1.45;
        side.items.forEach((it, k) => { t.text(s, it, { x: x + 0.2, y, w: w - 0.4, h: rows[k], fontSize: CFS, color: i ? C.white : C.ink }); y += rows[k]; });
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
  // ---- further ways to draw a type, every page still cut in two: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.teal, align: o.align, valign: o.valign || 'top' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body, false, 1.2), color: o.color || C.ink, lineSpacingMultiple: 1.2, valign: o.valign || 'top' });
  const num = (s, x, y, color = C.white, w = 1.2, fs = 26) => t.text(s, L.pad2(idx), { x, y, w, h: 0.5, fontFace: F.head, fontSize: fs, bold: true, color, valign: 'middle' });
  const bare = (bg = C.sand) => { const s = pres.addSlide(); s.background = { color: bg }; idx++; return s; };
  const foot1 = (s, x, y, w, color = C.muted) => t.text(s, `${M.topic || ''}   |   ${meta}`, { x, y, w, h: 0.22, fontSize: 9, color, valign: 'middle' });
  // the page cut across rather than down: a band holds the number and the title
  const cross = (d, h = 1.4, fill = C.teal) => {
    const s = bare();
    t.rect(s, 0, 0, W, h, fill, { name: 'Panel' });
    num(s, 0.5, 0.3);
    if (d.title) t.text(s, d.title, { x: 1.6, y: 0.2, w: 7.9, h: 0.75, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.75, 26, 16, F.head, true) });
    foot1(s, 0.5, 5.28, 9);
    return s;
  };
  // the page cut on a slant
  const slant = (pts, fill) => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="562"><polygon points="${pts.map(([a, b]) => `${a * 100},${b * 100}`).join(' ')}" fill="#${fill}"/></svg>`, 1000, 562);
  const V = {
    image: [
      async (d) => { // cut across: picture above, words below on a dark half
        const s = bare(C.teal), ph = 2.75;
        t.img(s, await L.photo(L.src(d.image), W, ph), 0, 0, W, ph, { alt: d.title });
        t.rect(s, 0.5, ph - 0.28, 0.95, 0.56, C.coral, { name: 'Number' });
        t.text(s, L.pad2(idx), { x: 0.5, y: ph - 0.28, w: 0.95, h: 0.56, fontFace: F.head, fontSize: 22, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, d.title, { x: 0.5, y: ph + 0.42, w: 3.1, h: 1.9, fontFace: F.head, bold: true, color: C.white, fontSize: L.fit(d.title, 3.1, 1.8, 24, 16, F.head, true) });
        longText(s, d.text, 3.95, ph + 0.2, 5.55, 2.18, { color: C.white, max: 13, valign: 'middle' });
        foot1(s, 0.5, 5.28, 9, 'CFE0E0');
      },
      async (d) => { // the picture fills the page, one half of it under a colour glass
        const s = bare();
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: d.title });
        t.rect(s, 0, 0, 5.0, H, C.teal, { t: 8, name: 'Glass' });
        t.rect(s, 5.0, 0, 0.07, H, C.coral, { name: 'Cut' });
        num(s, 0.5, 0.4);
        t.text(s, d.title, { x: 0.5, y: 0.95, w: 4.0, h: 1.1, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 4.0, 1.05, 26, 16, F.head, true) });
        longText(s, d.text, 0.5, 2.15, 4.0, 2.7, { color: C.white, max: 13 });
        t.text(s, M.topic || '', { x: 0.5, y: 4.92, w: 4.0, h: 0.22, fontSize: 9, color: C.white });
        t.text(s, meta, { x: 0.5, y: 5.14, w: 4.0, h: 0.22, fontSize: 9, color: C.white });
      },
      async (d) => { // cut on a slant: the picture leans over the words
        const s = bare();
        t.img(s, await L.photo(L.src(d.image), W, H, { mask: { poly: [[0.5, 0], [1, 0], [1, 1], [0.4, 1]] } }), 0, 0, W, H, { alt: d.title });
        t.img(s, await slant([[5, 0], [5.14, 0], [4.14, 5.625], [4, 5.625]], C.coral), 0, 0, W, H);
        num(s, 0.5, 0.4, C.coral);
        t.text(s, d.title, { x: 0.5, y: 0.9, w: 3.9, h: 1.0, fontFace: F.head, bold: true, color: C.teal, valign: 'middle', fontSize: L.fit(d.title, 3.9, 0.95, 24, 16, F.head, true) });
        longText(s, d.text, 0.5, 1.98, 3.35, 2.9, { max: 12.5 });
        t.text(s, M.topic || '', { x: 0.5, y: 4.95, w: 3.3, h: 0.22, fontSize: 9, color: C.muted });
        t.text(s, meta, { x: 0.5, y: 5.17, w: 3.3, h: 0.22, fontSize: 9, color: C.muted });
      },
      async (d) => { // a round picture sits on the cut between the band and the sand
        const s = cross(d, 2.15, C.coral), dia = 3.3, x = 0.5, y = 1.05;
        t.oval(s, x - 0.09, y - 0.09, dia + 0.18, dia + 0.18, C.sand, { name: 'Ring' });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        longText(s, d.text, 4.2, 2.35, 5.3, 2.8, { max: 14, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // white columns standing half in the band, half on the sand
        const s = cross(d, 2.5), n = d.items.length, gap = 0.2, w = (9 - gap * (n - 1)) / n, h = 3.95 - 0.15;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * (w + gap), y = 1.25;
          t.rect(s, x, y, w, h, C.white, { shadow: 0.1, name: 'Card' });
          t.oval(s, x + 0.2, y + 0.2, 0.6, 0.6, i % 2 ? C.coral : C.teal);
          t.img(s, await L.icon(it.icon, C.white, 2), x + 0.35, y + 0.35, 0.3, 0.3);
          head(s, it.h, x + 0.2, y + 0.92, w - 0.4, 0.56);
          body(s, it.t, x + 0.2, y + 1.5, w - 0.4, h - 1.6, { max: 13, color: C.muted });
        }
      },
      async (d) => { // the cut made twice: four squares of two colours, a chessboard
        const s = bare(), n = d.items.length, rh = 1.92, y0 = 1.25;
        num(s, 0.5, 0.35, C.coral);
        t.text(s, d.title, { x: 1.6, y: 0.2, w: 7.9, h: 0.85, fontFace: F.head, bold: true, color: C.teal, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.85, 26, 16, F.head, true) });
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, cw = wide ? W : W / 2, x = (i % 2) * (W / 2), y = y0 + Math.floor(i / 2) * rh, coral = !wide && (i === 1 || i === 2), fg = coral ? C.ink : C.white;
          t.rect(s, x, y, cw, rh, coral ? C.coral : C.teal, { name: 'Square' });
          t.img(s, await L.icon(it.icon, fg, 2), x + 0.5, y + 0.24, 0.4, 0.4);
          head(s, it.h, x + 1.05, y + 0.18, cw - 1.5, 0.5, { color: fg, max: 17, valign: 'middle' });
          body(s, it.t, x + 1.05, y + 0.7, cw - 1.5, rh - 0.82, { color: fg, max: 13 });
        }
        foot1(s, 0.5, 5.2, 9);
      },
      async (d) => { // cut on a slant, the lines start where the colour ends
        const s = bare(), n = d.items.length, h = 4.85 / n, a = 5.1, b = 2.9, edge = (y) => a + (b - a) * (y / H);
        t.img(s, await slant([[0, 0], [a, 0], [b, H], [0, H]], C.teal), 0, 0, W, H);
        num(s, 0.5, 0.4);
        t.text(s, d.title, { x: 0.5, y: 0.95, w: 2.5, h: 2.4, fontFace: F.head, bold: true, color: C.white, fontSize: L.fit(d.title, 2.5, 2.3, 24, 15, F.head, true) });
        t.text(s, M.topic || '', { x: 0.4, y: 4.65, w: 2.1, h: 0.32, fontSize: 9, color: C.white, valign: 'bottom' });
        t.text(s, meta, { x: 0.4, y: 4.98, w: 2.1, h: 0.44, fontSize: 9, color: C.white });
        for (const [i, it] of d.items.entries()) {
          const y = 0.4 + i * h, x = edge(y + h / 2) + 0.2, w = 9.5 - x - 0.55;
          t.oval(s, x - 0.32, y + 0.02, 0.62, 0.62, C.coral, { line: { color: C.sand, width: 2.5 } });
          t.img(s, await L.icon(it.icon, C.white, 2), x - 0.16, y + 0.18, 0.3, 0.3);
          head(s, it.h, x + 0.45, y, w, 0.36, { valign: 'middle' });
          body(s, it.t, x + 0.45, y + 0.37, w, h - 0.45, { max: 12.5 });
        }
      },
      async (d) => { // a coin of two colours in the middle, the cards around it
        const s = bare(), n = d.items.length, dia = 2.5, cw = 3.1, cx = 5, cy = n === 3 ? 1.6 : 2.65, ch = 2.28;
        t.oval(s, cx - dia / 2, cy - dia / 2, dia, dia, C.teal, { name: 'Coin' });
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><path d="M200,0 A200,200 0 0 1 200,400 Z" fill="#${C.coral}"/></svg>`, 400, 400), cx - dia / 2, cy - dia / 2, dia, dia);
        t.text(s, d.title, { x: cx - 0.9, y: cy - 0.8, w: 1.8, h: 1.6, fontFace: F.head, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 1.8, 1.55, 18, 11, F.head, true) });
        const spots = n === 3 ? [[0.5, 0.35, cw, ch], [6.4, 0.35, cw, ch], [1.6, 3.0, 6.8, 2.05]] : [[0.5, 0.35, cw, ch], [6.4, 0.35, cw, ch], [0.5, 2.8, cw, ch], [6.4, 2.8, cw, ch]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = spots[i];
          t.rect(s, x, y, w, h, C.white, { name: 'Card' });
          t.rect(s, x, y, 0.08, h, i % 2 ? C.coral : C.teal, { name: 'Edge' });
          t.img(s, await L.icon(it.icon, i % 2 ? C.coral : C.teal, 2), x + 0.22, y + 0.17, 0.32, 0.32);
          head(s, it.h, x + 0.64, y + 0.12, w - 0.8, 0.44, { valign: 'middle' });
          body(s, it.t, x + 0.22, y + 0.62, w - 0.4, h - 0.7, { max: 13, color: C.muted });
        }
        foot1(s, 0.5, 5.28, 9);
      },
    ],
    process: [
      async (d) => { // each step cut in two: heading in the colour, words on white
        const s = cross(d, 1.1), n = d.steps.length, gap = 0.26, w = (9 - gap * (n - 1)) / n, y = 1.45, hh = 1.2, bh = 2.55;
        d.steps.forEach((st, i) => {
          const x = 0.5 + i * (w + gap), last = i === n - 1;
          t.rect(s, x, y, w, hh, last ? C.coral : C.teal, { name: 'Upper half' });
          t.rect(s, x, y + hh, w, bh, C.white, { name: 'Lower half' });
          t.text(s, `${i + 1}`, { x: x + 0.16, y: y + 0.05, w: 0.6, h: 0.5, fontFace: F.head, fontSize: 24, bold: true, color: C.white, valign: 'middle' });
          head(s, st.h, x + 0.16, y + 0.55, w - 0.32, 0.6, { color: C.white, max: 14 });
          body(s, st.t, x + 0.16, y + hh + 0.12, w - 0.32, bh - 0.22, { max: 13, color: C.muted });
          if (i < n - 1) { t.oval(s, x + w - 0.1, y + hh - 0.23, 0.46, 0.46, C.sand); t.text(s, '→', { x: x + w - 0.1, y: y + hh - 0.23, w: 0.46, h: 0.46, fontSize: 15, bold: true, color: C.coral, align: 'center', valign: 'middle' }); }
        });
      },
      async (d) => { // blocks climbing on the slant, title in the low corner above them
        const s = bare(), n = d.steps.length, cw = 9.0 / n, rise = n === 3 ? 0.75 : 0.5;
        num(s, 0.5, 0.35, C.coral);
        t.text(s, d.title, { x: 0.5, y: 0.85, w: n === 3 ? 3.0 : 4.3, h: 0.95, fontFace: F.head, bold: true, color: C.teal, fontSize: L.fit(d.title, n === 3 ? 3.0 : 4.3, 0.9, 22, 15, F.head, true) });
        d.steps.forEach((st, i) => {
          const x = 0.5 + i * cw, y = 0.55 + (n - 1 - i) * rise + (n === 4 ? 0.2 : 0), top = y + 0.1;
          const yy = i === 0 ? Math.max(top, 2.0) : top, hh = 5.1 - yy;
          t.rect(s, x, yy, cw - 0.06, hh, i % 2 ? C.coral : C.teal, { name: 'Block' });
          const fg = i % 2 ? C.ink : C.white;
          t.text(s, `${i + 1}`, { x: x + 0.15, y: yy + 0.06, w: 0.7, h: 0.5, fontFace: F.head, fontSize: 26, bold: true, color: C.white, valign: 'middle' });
          head(s, st.h, x + 0.15, yy + 0.56, cw - 0.36, 0.56, { color: fg, max: 15 });
          body(s, st.t, x + 0.15, yy + 1.12, cw - 0.36, hh - 1.2, { color: fg, max: 13 });
        });
        foot1(s, 0.5, 5.28, 9);
      },
      async (d) => { // the cut is the path: steps cross it from side to side
        const s = bare(), n = d.steps.length, y0 = 1.15, rh = (5.1 - y0) / n;
        t.rect(s, 0, 0, W, y0, C.sand, { name: 'Head' });
        t.rect(s, 0, y0, 5, 5.15 - y0, C.teal, { name: 'Left half' });
        num(s, 0.5, 0.33, C.coral);
        t.text(s, d.title, { x: 1.6, y: 0.2, w: 7.9, h: 0.8, fontFace: F.head, bold: true, color: C.teal, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.75, 26, 16, F.head, true) });
        d.steps.forEach((st, i) => {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? 0.5 : 5.5, w = 4.0, fg = left ? C.white : C.ink, cy = y + rh / 2;
          t.oval(s, 4.75, cy - 0.25, 0.5, 0.5, C.coral, { line: { color: C.white, width: 2 } });
          t.text(s, `${i + 1}`, { x: 4.75, y: cy - 0.25, w: 0.5, h: 0.5, fontFace: F.head, fontSize: 15, bold: true, color: C.white, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.08, w, 0.34, { color: left ? C.white : C.teal, align: left ? 'right' : 'left', valign: 'middle' });
          body(s, st.t, x, y + 0.42, w, rh - 0.48, { color: fg, align: left ? 'right' : 'left', max: 12.5 });
        });
        foot1(s, 0.5, 5.28, 9);
      },
      async (d) => { // stripes, top to bottom, a step to a stripe
        const s = bare(), n = d.steps.length, y0 = 1.1, h = 4.05 / n, fills = [C.teal, '1B6A6F', C.coral, 'E08A70'];
        num(s, 0.5, 0.3, C.coral);
        t.text(s, d.title, { x: 1.6, y: 0.15, w: 7.9, h: 0.8, fontFace: F.head, bold: true, color: C.teal, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.75, 26, 16, F.head, true) });
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, k = i, fg = k < 2 ? C.white : C.ink;
          t.rect(s, 0, y, W, h, fills[k], { name: 'Stripe' });
          t.text(s, L.pad2(i + 1), { x: 0.5, y, w: 1.1, h, fontFace: F.head, fontSize: 34, bold: true, color: C.white, valign: 'middle' });
          head(s, st.h, 1.7, y, 2.6, h, { color: fg, valign: 'middle' });
          body(s, st.t, 4.4, y + 0.05, 5.1, h - 0.1, { color: fg, max: 13, valign: 'middle' });
        });
        foot1(s, 0.5, 5.28, 9);
      },
    ],
    stats: [
      async (d) => { // the lead figure fills the upper half, the others share the lower
        const s = bare(), [a, ...rest] = d.stats, bh = 2.75;
        t.rect(s, 0, 0, W, bh, C.teal, { name: 'Panel' });
        num(s, 0.5, 0.3, C.white);
        t.text(s, a.value, { x: 0.5, y: 0.8, w: 5.0, h: 1.8, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(a.value, 5.0, 1.7, 88, 40, F.head, true) });
        t.text(s, d.title, { x: 5.8, y: 0.3, w: 3.7, h: 1.1, fontFace: F.head, bold: true, color: C.white, valign: 'top', fontSize: L.fit(d.title, 3.7, 1.05, 20, 14, F.head, true) });
        body(s, a.label, 5.8, 1.5, 3.7, 1.05, { color: C.white, max: 15, valign: 'bottom' });
        rest.forEach((x, i) => {
          const px = 0.5 + i * 2.85;
          if (i) t.line(s, px - 0.15, bh + 0.2, 0, 2.05, C.line, 0.75);
          t.text(s, x.value, { x: px, y: bh + 0.15, w: 2.6, h: 0.95, fontFace: F.head, bold: true, color: i ? C.coral : C.teal, valign: 'middle', fontSize: L.fit(x.value, 2.6, 0.9, 40, 22, F.head, true) });
          body(s, x.label, px, bh + 1.15, 2.5, 1.1, { max: 13, color: C.muted });
        });
        if (d.note) { t.rect(s, 6.3, bh + 0.2, 0.05, 2.05, C.coral, { name: 'Rule' }); body(s, d.note, 6.5, bh + 0.2, 3.0, 2.05, { max: 12, color: C.muted, valign: 'middle' }); }
        foot1(s, 0.5, 5.28, 9);
      },
      async (d) => { // three tall halves of colour, the figures at different heights
        const s = bare(), cw = W / 3, y0 = 1.15, ch = 3.15, fills = [C.teal, C.coral, C.ink], off = [0.15, 0.95, 0.5];
        num(s, 0.5, 0.33, C.coral);
        t.text(s, d.title, { x: 1.6, y: 0.2, w: 7.9, h: 0.8, fontFace: F.head, bold: true, color: C.teal, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.75, 26, 16, F.head, true) });
        d.stats.forEach((x, i) => {
          const px = i * cw, y = y0 + off[i], fg = i === 1 ? C.ink : C.white;
          t.rect(s, px, y0, cw, ch, fills[i], { name: 'Tall half' });
          t.text(s, x.value, { x: px + 0.3, y, w: cw - 0.6, h: 0.95, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(x.value, cw - 0.6, 0.9, 44, 22, F.head, true) });
          body(s, x.label, px + 0.3, y + 0.98, cw - 0.6, 1.0, { color: fg, max: 13 });
        });
        if (d.note) body(s, d.note, 0.5, y0 + ch + 0.05, 9, 0.68, { max: 11, color: C.muted, valign: 'middle' });
        foot1(s, 0.5, 5.28, 9);
      },
    ],
    compare: [
      async (d) => { // the page itself is the comparison: one half against the other, lines run from the cut outward
        const s = bare(), y0 = 1.15;
        num(s, 0.5, 0.33, C.coral);
        t.text(s, d.title, { x: 1.6, y: 0.2, w: 7.9, h: 0.8, fontFace: F.head, bold: true, color: C.teal, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.75, 26, 16, F.head, true) });
        t.rect(s, 0, y0, 5, 4.05, C.teal, { name: 'Left half' });
        t.rect(s, 5, y0, 5, 4.05, C.white, { name: 'Right half' });
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.45 : 0.5, w = 4.05, align = i ? 'left' : 'right', n = side.items.length, rh = 2.95 / n;
          head(s, side.h, x, y0 + 0.2, w, 0.55, { color: i ? C.coral : C.white, align, max: 20, valign: 'middle' });
          side.items.forEach((it, k) => body(s, it, x, y0 + 0.92 + k * rh, w, rh - 0.05, { color: i ? C.ink : C.white, align, max: 14, valign: 'middle' }));
        });
        t.oval(s, 4.7, y0 + 0.2, 0.6, 0.6, C.coral, { line: { color: C.white, width: 2 } });
        t.text(s, '⇄', { x: 4.7, y: y0 + 0.2, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
        foot1(s, 0.5, 5.28, 9);
      },
      async (d) => { // cut across: one side above the title, the other below it
        const s = bare(), bh = 2.1, tb = 0.8;
        t.rect(s, 0, 0, W, bh, C.teal, { name: 'Upper half' });
        t.rect(s, 0, bh, W, tb, C.coral, { name: 'Title band' });
        t.text(s, L.pad2(idx), { x: 0.5, y: bh, w: 0.9, h: tb, fontFace: F.head, fontSize: 24, bold: true, color: C.white, valign: 'middle' });
        t.text(s, d.title, { x: 1.4, y: bh, w: 8.1, h: tb, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.1, tb - 0.05, 24, 15, F.head, true) });
        [d.left, d.right].forEach((side, i) => {
          const y = i ? bh + tb : 0, h = i ? 5.2 - bh - tb : bh, fg = i ? C.ink : C.white, n = side.items.length, x0 = 2.75, cw = (9.5 - x0) / n;
          head(s, side.h, 0.5, y + 0.1, 2.05, h - 0.2, { color: i ? C.teal : C.white, max: 20, valign: 'middle' });
          side.items.forEach((it, k) => {
            t.line(s, x0 + k * cw - 0.08, y + 0.28, 0, h - 0.56, i ? C.line : '4D8285', 0.75);
            body(s, it, x0 + k * cw + 0.04, y + 0.1, cw - 0.2, h - 0.2, { color: fg, max: 13.5, valign: 'middle' });
          });
        });
        foot1(s, 0.5, 5.28, 9);
      },
    ],
    statement: [
      async (d) => { // cut across: the sentence in the coral half, its reason under it
        const s = bare(), bh = 3.4;
        t.rect(s, 0, 0, W, bh, C.coral, { name: 'Upper half' });
        num(s, 0.5, 0.25, C.white);
        t.text(s, L.runs(d.text), { x: 0.5, y: 0.8, w: 9, h: bh - 0.95, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 9, bh - 1.0, 36, 20, F.head, true) });
        if (d.title) t.text(s, d.title, { x: 0.5, y: bh + 0.2, w: 3.0, h: 1.4, fontFace: F.head, bold: true, color: C.teal, fontSize: L.fit(d.title, 3.0, 1.35, 20, 13, F.head, true) });
        if (d.caption) body(s, d.caption, 3.85, bh + 0.2, 5.65, 1.55, { max: 13, color: C.muted });
        foot1(s, 0.5, 5.28, 9);
      },
      async (d) => { // cut on a slant: words on the teal, the note in the far corner
        const s = bare();
        t.img(s, await slant([[0, 0], [8.2, 0], [4.4, H], [0, H]], C.teal), 0, 0, W, H);
        num(s, 0.5, 0.35);
        t.text(s, L.runs(d.text), { x: 0.5, y: 0.95, w: 5.0, h: 3.5, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 5.0, 3.45, 30, 18, F.head, true) });
        if (d.title) t.text(s, d.title, { x: 1.6, y: 0.3, w: 5.2, h: 0.55, fontFace: F.head, color: C.sand, valign: 'middle', fontSize: L.fit(d.title, 5.2, 0.5, 14, 10, F.head) });
        if (d.caption) { t.rect(s, 6.55, 2.4, 0.6, 0.06, C.coral, { name: 'Rule' }); body(s, d.caption, 6.55, 2.55, 2.95, 2.55, { max: 12.5, color: C.muted }); }
        t.text(s, M.topic || '', { x: 0.5, y: 4.82, w: 3.7, h: 0.24, fontSize: 9, color: C.white });
        t.text(s, meta, { x: 0.5, y: 5.08, w: 3.7, h: 0.3, fontSize: 9, color: C.white });
      },
    ],
    timeline: [
      async (d) => { // the cut is the axis: years above it in the colour, events under it on the sand
        const s = cross(d, 2.15), cw = 9 / 4;
        t.rect(s, 0, 2.12, W, 0.06, C.coral, { name: 'Axis' });
        d.items.forEach((it, i) => {
          const x = 0.5 + i * cw;
          t.text(s, it.year, { x, y: 1.25, w: cw - 0.2, h: 0.75, fontFace: F.head, bold: true, color: C.white, valign: 'bottom', fontSize: L.fit(it.year, cw - 0.25, 0.7, 30, 15, F.head, true) });
          t.oval(s, x, 2.02, 0.26, 0.26, C.coral, { line: { color: C.sand, width: 2 } });
          head(s, it.h, x, 2.42, cw - 0.25, 0.42);
          body(s, it.t, x, 2.86, cw - 0.25, 2.3, { max: 13, color: C.muted });
        });
      },
      async (d) => { // the years walk down a long slant, the title holds the corner under it
        const s = bare(), slope = 0.6, y0 = 1.25, X = 0.5, step = 2.0;
        t.img(s, await slant([[0, y0], [(H - y0) / slope, H], [0, H]], C.teal), 0, 0, W, H);
        t.text(s, L.pad2(idx), { x: 7.9, y: 0.25, w: 1.6, h: 0.8, fontFace: F.head, fontSize: 36, bold: true, color: C.coral, align: 'right', valign: 'middle' });
        t.text(s, d.title, { x: 0.4, y: 3.5, w: 2.7, h: 1.2, fontFace: F.head, bold: true, color: C.white, valign: 'top', fontSize: L.fit(d.title, 2.7, 1.15, 20, 13, F.head, true) });
        t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.4, y: 4.78, w: 3.8, h: 0.6, fontSize: 9, color: C.white, valign: 'top' });
        d.items.forEach((it, i) => {
          const x = X + i * step, y = 0.22 + i * (step * slope), w = i === 3 ? 3.0 : 3.2;
          t.text(s, it.year, { x, y, w: 1.25, h: 0.34, fontFace: F.head, bold: true, color: C.coral, valign: 'middle', fontSize: L.fit(it.year, 1.25, 0.34, 18, 11, F.head, true) });
          head(s, it.h, x + 1.28, y, w - 1.28, 0.34, { max: 14, valign: 'middle' });
          body(s, it.t, x, y + 0.36, w, 0.86, { max: 11.5 });
        });
      },
      async (d) => { // the dark page: each event a tile cut in two, the year on the coral half
        const s = bare(C.teal), w = 4.4, h = 1.78;
        num(s, 0.5, 0.33, C.coral);
        t.text(s, d.title, { x: 1.6, y: 0.2, w: 7.9, h: 0.8, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.75, 26, 16, F.head, true) });
        d.items.forEach((it, i) => {
          const x = 0.5 + (i % 2) * (w + 0.2), y = 1.2 + Math.floor(i / 2) * (h + 0.2);
          t.rect(s, x, y, 1.25, h, C.coral, { name: 'Year half' });
          t.rect(s, x + 1.25, y, w - 1.25, h, C.sand, { name: 'Text half' });
          t.text(s, it.year, { x: x + 0.08, y, w: 1.09, h, fontFace: F.head, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.09, h, 22, 12, F.head, true) });
          head(s, it.h, x + 1.4, y + 0.08, w - 1.55, 0.36, { valign: 'middle', max: 15 });
          body(s, it.t, x + 1.4, y + 0.46, w - 1.55, h - 0.54, { max: 13 });
        });
        foot1(s, 0.5, 5.28, 9, 'CFE0E0');
      },
    ],
  };
  R.image = V.image.shift();
  R.process = V.process.shift(); // the old ones read as the cards page, rows beside a panel
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Ikki qism', colors: { dk1: C.ink, lt1: C.white, dk2: C.teal, lt2: C.sand, accent1: C.teal, accent2: C.coral, accent3: C.muted, accent4: '5E9EA0', accent5: C.line, accent6: 'EBB2A2', hlink: C.coral, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "muvozanatli, tushuntiruvchi biznes uslubi", "limits": {}};
module.exports = { id: 23, slug: 'ikki-qism', name: 'Ikki qism', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "elegant"], "transitions": ["split", "p14:doors|dir=\"vert\"", "morph"], "cover": ["splitH", "split"], "mark": "popIn", "deco": "stretch", "sig": {"title": "split", "body": "wipe:r", "item": ["slideRight", "slideLeft"], "image": "splitIn", "number": "popIn", "order": "alternate", "stagger": 0.16}, "tempo": 0.95, "kenburns": false};
