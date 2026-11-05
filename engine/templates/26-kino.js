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
    if (d.title) t.text(s, d.title.toUpperCase(), { x: 0.6, y: 0.75, w: 8.8, h: 0.6, bold: true, color: C.text, valign: 'middle', charSpacing: 3, fontSize: L.fit(d.title.toUpperCase(), 8.8 - d.title.length * 0.055, 0.6, 22, 13, F.head, true) }); // the letter spacing takes width the fit does not see
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
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.5, F.body, 0.2, 4.85 - 2.35);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3);
        frameCard(s, x, 1.5, w, h);
        t.text(s, side.h.toUpperCase(), { x: x + 0.25, y: 1.8, w: w - 0.5, h: 0.4, fontSize: 14, bold: true, color: i ? C.yellow : C.text, charSpacing: 2 });
        let y = 2.35;
        side.items.forEach((it, k) => { t.text(s, it, { x: x + 0.25, y, w: w - 0.5, h: rows[k], fontSize: CFS, color: C.text }); y += rows[k]; });
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
  // ---- further ways to draw a type, all at the cinema: a deck's pages must not look alike (L.pages)
  const SOFT = 'BDBDBD', PAPER = 'EFEBE0', INK = '141414';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13.5, 10, F.body), color: o.color || SOFT, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.text, align: o.align, valign: o.valign || 'middle' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body, false, 1.25), color: o.color || C.text, lineSpacingMultiple: 1.25, valign: o.valign || 'middle' });
  const titleAt = (s, v, x, y, w, h, o = {}) => { const T = v.toUpperCase(); t.text(s, T, { x, y, w, h, bold: true, color: o.color || C.text, valign: o.valign || 'middle', align: o.align, charSpacing: 3, fontSize: L.fit(T, w - T.length * 0.042, h, o.max || 22, 13, F.head, true) }); };
  const blank = (bg = C.bg) => { const s = pres.addSlide(); s.background = { color: bg }; idx++; return s; };
  // the strip running up the page
  const upright = (s, x, y, w, h, fill = C.dim, hole = C.bg) => {
    t.rect(s, x, y, w, h, fill, { name: 'Film' });
    const n = Math.floor(h / 0.32);
    for (let k = 0; k < n; k++) for (const px of [x + 0.07, x + w - 0.19]) t.rect(s, px, y + 0.09 + k * 0.32, 0.12, 0.16, hole, { name: 'Sprocket' });
  };
  // the countdown of the film leader: circles and a cross
  const leader = (s, x, y, dia, c = C.yellow) => {
    t.oval(s, x, y, dia, dia, C.dim, { line: { color: c, width: 2 } });
    t.oval(s, x + dia * 0.09, y + dia * 0.09, dia * 0.82, dia * 0.82, null, { line: { color: C.gray, width: 0.75 } });
    t.line(s, x - 0.08, y + dia / 2, dia + 0.16, 0, C.gray, 0.75); t.line(s, x + dia / 2, y - 0.08, 0, dia + 0.16, C.gray, 0.75);
  };
  const beam = (w, h, dir = 'r') => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * 100}" height="${h * 100}"><defs><linearGradient id="g" x1="${dir === 'r' ? 1 : 0}" y1="0" x2="${dir === 'r' ? 0 : 1}" y2="0"><stop offset="0" stop-color="#FFF4C8" stop-opacity="0.32"/><stop offset="1" stop-color="#FFF4C8" stop-opacity="0.02"/></linearGradient></defs><polygon points="${dir === 'r' ? `${w * 100},${h * 42} ${w * 100},${h * 58} 0,${h * 100} 0,0` : `0,${h * 42} 0,${h * 58} ${w * 100},${h * 100} ${w * 100},0`}" fill="url(#g)"/></svg>`, w * 100, h * 100);
  const V = {
    image: [
      async (d) => { // cinemascope: a thin wide picture, undimmed, the words under it like a subtitle track
        const s = blank(C.bar), ph = 2.25;
        t.img(s, await L.photo(L.src(d.image), W, ph), 0, TOP, W, ph, { alt: d.title });
        bars(s);
        t.rect(s, 0.6, TOP + ph + 0.14, 0.5, 0.05, C.yellow, { name: 'Rule' });
        titleAt(s, d.title, 1.25, TOP + ph + 0.04, 8.15, 0.34, { max: 15 });
        longText(s, d.text, 0.6, TOP + ph + 0.42, 8.8, 1.86, { max: 13.5, color: C.text, valign: 'top' });
      },
      async (d) => { // the hall: the picture on a lit screen, rows of seats before it
        const s = page(d), x = 4.55, y = 1.42, w = 4.85, h = 2.75;
        t.rect(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, 'F8F3D8', { shadow: 0.6, shadowColor: 'F5C518', blur: 24, offset: 0, name: 'Screen edge' });
        t.img(s, await L.photo(L.src(d.image), w, h), x, y, w, h, { alt: d.title });
        for (const [row, py, sz] of [[0, 4.38, 0.34], [1, 4.62, 0.42]]) for (let k = 0; k < 14 - row * 2; k++) t.rect(s, x - 0.1 + row * 0.1 + k * (0.36 + row * 0.08), py, sz * 0.8, 0.55, row ? C.bar : '0B0B0B', { r: 0.06, name: 'Seat' });
        longText(s, d.text, 0.6, 1.42, 3.65, 3.62, { max: 13 });
      },
      async (d) => { // the strip up the side: the same scene on three frames
        const s = page({}), sx = 6.9, sw = 2.5, fh = 1.1;
        const y0 = TOP, strip = BOT - TOP;
        upright(s, sx, y0, sw, strip);
        const pics = await L.photo(L.src(d.image), sw - 0.5, fh);
        for (let k = 0; k < 3; k++) t.img(s, pics, sx + 0.25, y0 + 0.18 + k * (fh + 0.14), sw - 0.5, fh, { alt: k ? '' : d.title });
        titleAt(s, d.title, 0.6, 0.72, 6.0, 0.72, { max: 20 });
        longText(s, d.text, 0.6, 1.5, 6.0, 3.53, { max: 14 });
      },
      async (d) => { // iris shot: everything black but a circle of picture
        const s = page(d), dia = 3.45, x = 0.75, y = 1.58;
        t.oval(s, x - 0.09, y - 0.09, dia + 0.18, dia + 0.18, null, { line: { color: C.yellow, width: 2 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        longText(s, d.text, 4.65, 1.5, 4.75, 3.55, { max: 14, color: C.yellow });
      },
    ],
    cards: [
      async (d) => { // the storyboard: paper panels, a shot to each
        const s = page(d), n = d.items.length, w = 4.32, h = 1.72;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.16), y = 1.42 + Math.floor(i / 2) * (h + 0.14);
          t.rect(s, x, y, ww, h, PAPER, { name: 'Panel' });
          t.rect(s, x + 0.14, y + 0.14, 1.02, h - 0.28, null, { line: { color: INK, width: 1.25 }, name: 'Sketch' });
          t.img(s, await L.icon(it.icon, INK, 1.5), x + 0.42, y + h / 2 - 0.24, 0.46, 0.46);
          head(s, it.h, x + 1.3, y + 0.1, ww - 1.45, 0.44, { color: INK, max: 15 });
          body(s, it.t, x + 1.3, y + 0.56, ww - 1.45, h - 0.66, { color: '3A3A3A', max: 13 });
        }
      },
      async (d) => { // end credits: names on the left of the gutter, words on the right
        const s = page(d), n = d.items.length, h = 3.55 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.45 + i * h;
          head(s, it.h, 0.6, y, 3.6, h - 0.08, { color: C.yellow, align: 'right', max: 18 });
          t.img(s, await L.icon(it.icon, C.gray, 1.5), 4.36, y + (h - 0.08) / 2 - 0.14, 0.28, 0.28);
          body(s, it.t, 4.8, y, 4.6, h - 0.08, { color: C.text, max: 13.5, valign: 'middle' });
        }
      },
      async (d) => { // tickets, torn at the stub, none on one line
        const s = page(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n, h = 3.05;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), y = 1.42 + (i % 2 ? 0.52 : 0.02);
          t.rect(s, x, y, w, h, C.yellow, { r: 0.04, name: 'Ticket' });
          for (const px of [x - 0.09, x + w - 0.09]) t.oval(s, px, y + 0.68, 0.18, 0.18, C.bg, { name: 'Notch' });
          t.line(s, x + 0.12, y + 0.77, w - 0.24, 0, INK, 1, { dash: 'dash' });
          t.img(s, await L.icon(it.icon, INK, 2), x + 0.16, y + 0.17, 0.4, 0.4);
          t.text(s, L.pad2(i + 1), { x: x + w - 0.85, y: y + 0.15, w: 0.7, h: 0.44, fontSize: 18, bold: true, color: INK, align: 'right', valign: 'middle' });
          head(s, it.h, x + 0.16, y + 0.84, w - 0.32, 0.5, { color: INK, max: 14, valign: 'top' });
          body(s, it.t, x + 0.16, y + 1.34, w - 0.32, h - 1.42, { color: INK, max: 12.5 });
        }
      },
      async (d) => { // the marquee over the door, bulbs all round it
        const s = page(d), n = d.items.length, x = 0.6, y = 1.42, w = 8.8, h = 3.6, cw = (w - 0.5) / n;
        t.rect(s, x, y, w, h, C.bar, { line: { color: C.yellow, width: 2.5 }, name: 'Marquee' });
        const nx = 29, ny = 11;
        for (let k = 0; k < nx; k++) for (const py of [y + 0.06, y + h - 0.16]) t.oval(s, x + 0.12 + k * (w - 0.34) / (nx - 1), py, 0.1, 0.1, 'FFE27A', { name: 'Bulb' });
        for (let k = 1; k < ny - 1; k++) for (const px of [x + 0.06, x + w - 0.16]) t.oval(s, px, y + 0.06 + k * (h - 0.22) / (ny - 1), 0.1, 0.1, 'FFE27A', { name: 'Bulb' });
        for (const [i, it] of d.items.entries()) {
          const cx = x + 0.25 + i * cw;
          t.img(s, await L.icon(it.icon, C.yellow, 1.75), cx + cw / 2 - 0.22, y + 0.3, 0.44, 0.44);
          head(s, it.h, cx + 0.08, y + 0.8, cw - 0.16, 0.54, { align: 'center', max: 15 });
          body(s, it.t, cx + 0.08, y + 1.36, cw - 0.16, h - 1.58, { align: 'center', max: 13 });
          if (i) t.line(s, cx, y + 0.34, 0, h - 0.7, C.line, 1);
        }
      },
    ],
    process: [
      async (d) => { // the clapperboard: its striped stick on top, a line on it for each step
        const s = page(d), n = d.steps.length, x = 0.6, y = 1.4, w = 8.8, stick = 0.36, h = 3.65 - stick, rh = h / n;
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="36"><rect width="880" height="36" fill="#${C.text}"/>${Array.from({ length: 16 }, (_, k) => `<polygon points="${k * 60},36 ${k * 60 + 30},36 ${k * 60 + 60},0 ${k * 60 + 30},0" fill="#000"/>`).join('')}</svg>`, 880, 36), x, y, w, stick);
        t.rect(s, x, y + stick, w, h, C.bar, { line: { color: C.text, width: 1.5 }, name: 'Board' });
        d.steps.forEach((st, i) => {
          const py = y + stick + i * rh;
          if (i) t.line(s, x, py, w, 0, C.gray, 0.75);
          t.text(s, `${i + 1}`, { x: x + 0.1, y: py, w: 0.75, h: rh, fontSize: 28, bold: true, color: C.yellow, align: 'center', valign: 'middle' });
          t.line(s, x + 0.95, py, 0, rh, C.gray, 0.75);
          head(s, st.h, x + 1.1, py + 0.04, 2.45, rh - 0.08, { max: 15 });
          t.line(s, x + 3.65, py, 0, rh, C.gray, 0.75);
          body(s, st.t, x + 3.8, py + 0.04, w - 3.95, rh - 0.08, { max: 13, valign: 'middle' });
        });
      },
      async (d) => { // the strip falls down the page, frame after frame
        const s = page(d), n = d.steps.length, g = 0.1, w = (8.8 - g * (n - 1)) / n, drop = n === 3 ? 0.5 : 0.34, h = 3.62 - drop * (n - 1);
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * (w + g), y = 1.42 + i * drop;
          frameCard(s, x, y, w, h);
          t.text(s, L.pad2(i + 1), { x: x + 0.14, y: y + 0.24, w: w - 0.28, h: 0.36, fontSize: 18, bold: true, color: C.yellow, valign: 'middle' });
          head(s, st.h, x + 0.14, y + 0.6, w - 0.28, 0.46, { max: 13, valign: 'top' });
          body(s, st.t, x + 0.14, y + 1.06, w - 0.28, h - 1.3, { max: 12 });
        });
      },
      async (d) => { // the countdown of the leader, each step a number in the cross
        const s = page(d), n = d.steps.length, w = 4.32, h = 1.72, dia = 1.05;
        d.steps.forEach((st, i) => {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.16), y = 1.42 + Math.floor(i / 2) * (h + 0.14);
          leader(s, x + 0.1, y + 0.16, dia);
          t.text(s, `${i + 1}`, { x: x + 0.1, y: y + 0.16, w: dia, h: dia, fontSize: 34, bold: true, color: C.yellow, align: 'center', valign: 'middle' });
          head(s, st.h, x + 1.35, y + 0.08, ww - 1.45, 0.42);
          body(s, st.t, x + 1.35, y + 0.52, ww - 1.45, h - 0.6, { max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // the poster: a yellow sheet, one number as the star of it
        const s = blank(C.bar), [a, ...rest] = d.stats;
        t.rect(s, 0, TOP, W, BOT - TOP, C.yellow, { name: 'Poster' });
        bars(s);
        titleAt(s, d.title, 0.6, 0.62, 8.8, 0.5, { color: INK, max: 18 });
        t.text(s, a.value, { x: 0.6, y: 1.15, w: 5.1, h: 2.0, bold: true, color: INK, valign: 'middle', fontSize: L.fit(a.value, 5.1, 1.9, 96, 40, F.head, true) });
        body(s, a.label, 0.6, 3.2, 5.0, 0.7, { color: INK, max: 15 });
        rest.forEach((x, i) => {
          const y = 1.25 + i * 1.28;
          t.rect(s, 6.0, y, 3.4, 1.18, INK, { name: 'Plate' });
          t.text(s, x.value, { x: 6.15, y: y + 0.05, w: 3.1, h: 0.62, bold: true, color: C.yellow, valign: 'middle', fontSize: L.fit(x.value, 3.1, 0.58, 30, 16, F.head, true) });
          body(s, x.label, 6.15, y + 0.67, 3.1, 0.48, { color: C.text, max: 11 });
        });
        if (d.note) body(s, d.note, 0.6, 3.92, 8.8, 1.14, { color: INK, max: 12, valign: 'middle' });
      },
      async (d) => { // three figures in the cross of the leader, at different heights
        const s = page(d), cw = 8.8 / 3, dia = 1.95, off = [0, 0.3, 0];
        d.stats.forEach((x, i) => {
          const cx = 0.6 + i * cw + cw / 2, y = 1.42 + off[i];
          leader(s, cx - dia / 2, y, dia, i === 1 ? C.yellow : C.text);
          t.rect(s, cx - dia / 2 + 0.12, y + dia / 2 - 0.32, dia - 0.24, 0.64, C.dim, { name: 'Plate' });
          t.text(s, x.value, { x: cx - dia / 2 + 0.14, y: y + dia / 2 - 0.32, w: dia - 0.28, h: 0.64, bold: true, color: C.yellow, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 0.3, 0.6, 30, 16, F.head, true) });
          body(s, x.label, cx - cw / 2 + 0.12, y + dia + 0.1, cw - 0.24, 0.55, { align: 'center', color: C.text, max: 12 });
        });
        if (d.note) body(s, d.note, 0.6, 4.4, 8.8, 0.68, { align: 'center', max: 10.5, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // split screen: dark and lit, the lines mirror across the join
        const s = page(d), y = 1.42, h = BOT - y;
        t.rect(s, 0, y, 5, h, C.dim, { name: 'Left screen' });
        t.rect(s, 5, y, 5, h, C.yellow, { name: 'Right screen' });
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.3 : 0.6, w = 4.1, align = i ? 'left' : 'right', n = side.items.length, rh = (h - 0.85) / n, T = side.h.toUpperCase();
          t.text(s, T, { x, y: y + 0.12, w, h: 0.55, bold: true, align, valign: 'middle', charSpacing: 2, color: i ? INK : C.yellow, fontSize: L.fit(T, w - T.length * 0.028, 0.52, 16, 11, F.head, true) });
          side.items.forEach((it, k) => body(s, it, x, y + 0.72 + k * rh, w, rh - 0.04, { color: i ? INK : C.text, align, max: 13.5, valign: 'middle' }));
        });
      },
      async (d) => { // two reels of film, one above the other, a frame to each line
        const s = page(d), bh = 1.74;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.4 + i * (bh + 0.08), n = side.items.length, x0 = 2.6, cw = (W - x0 - 0.1) / n, T = side.h.toUpperCase();
          frameCard(s, 0, y, W, bh);
          t.text(s, T, { x: 0.6, y: y + 0.24, w: 1.85, h: bh - 0.48, bold: true, valign: 'middle', color: i ? C.yellow : C.text, fontSize: L.fit(T, 1.85, bh - 0.5, 15, 10.5, F.head, true) });
          side.items.forEach((it, k) => {
            const fx = x0 + k * cw;
            t.rect(s, fx, y + 0.25, cw - 0.08, bh - 0.5, i ? '3A3208' : C.bg, { name: 'Frame' });
            body(s, it, fx + 0.1, y + 0.28, cw - 0.28, bh - 0.56, { color: C.text, max: 12.5, valign: 'middle' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the projector's beam falls from the side, the line stands in it like a subtitle
        const s = page({});
        t.img(s, await beam(7.2, BOT - TOP - 0.2), 2.8, TOP + 0.1, 7.2, BOT - TOP - 0.2);
        t.oval(s, 9.72, 2.67, 0.28, 0.28, 'FFF4C8', { name: 'Lens' });
        titleAt(s, d.title, 0.6, 0.72, 8.2, 0.4, { color: C.yellow, max: 13 });
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.2, w: 6.7, h: 2.35, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.text, 6.7, 2.3, 32, 20, F.head, true) });
        t.rect(s, 0.6, 3.68, 0.8, 0.05, C.yellow, { name: 'Rule' });
        if (d.caption) body(s, d.caption, 0.6, 3.82, 6.7, 1.22, { color: SOFT, max: 13 });
      },
      async (d) => { // the yellow sheet, the film edge running up its side
        const s = blank(C.bar);
        t.rect(s, 0, TOP, W, BOT - TOP, C.yellow, { name: 'Poster' });
        upright(s, 9.1, TOP, 0.9, BOT - TOP, INK, C.yellow);
        bars(s);
        titleAt(s, d.title, 0.6, 0.62, 8.2, 0.42, { color: INK, max: 13 });
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.1, w: 5.2, h: 3.9, bold: true, color: INK, valign: 'middle', fontSize: L.fit(d.text, 5.2, 3.8, 34, 20, F.head, true) });
        t.line(s, 6.05, 1.2, 0, 3.7, INK, 1.5);
        if (d.caption) body(s, d.caption, 6.25, 1.2, 2.6, 3.7, { color: INK, max: 13, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // one strip across the page holds the years, events above and under it by turns
        const s = page(d), sy = 2.8, sh = 0.72, cw = W / 4;
        frameCard(s, 0, sy, W, sh);
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = i < 2 ? 0.6 : 5.2, w = 4.2, y = up ? 1.38 : sy + sh + 0.1, fx = i * cw + 0.12;
          t.text(s, it.year, { x: fx, y: sy + 0.18, w: cw - 0.24, h: sh - 0.36, bold: true, color: C.yellow, align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.3, 0.34, 18, 12, F.head, true) });
          if (i) t.line(s, i * cw, sy + 0.2, 0, sh - 0.4, C.line, 1);
          t.text(s, `${i + 1}`, { x, y, w: 0.3, h: 0.34, fontSize: 13, bold: true, color: C.yellow, valign: 'middle' });
          head(s, it.h, x + 0.3, y, w - 0.3, 0.34, { max: 15 });
          body(s, it.t, x, y + 0.36, w, up ? 1.0 : 1.2, { max: 12.5 });
        });
      },
      async (d) => { // the editing table: clips step along a ruler of ticks
        const s = page(d), y0 = 1.72, h = 0.8, dx = 0.62, w = 8.8 - 3 * dx;
        t.rect(s, 0.6, 1.42, 8.8, 0.22, C.dim, { name: 'Ruler' });
        for (let k = 0; k <= 44; k++) t.line(s, 0.6 + k * 0.2, 1.42 + (k % 5 ? 0.13 : 0.06), 0, k % 5 ? 0.09 : 0.16, C.gray, 0.75, { name: 'Tick' });
        d.items.forEach((it, i) => {
          const x = 0.6 + i * dx, y = y0 + i * (h + 0.03);
          t.rect(s, x, y, w, h, C.dim, { name: 'Clip' });
          t.rect(s, x, y, 1.3, h, C.yellow, { name: 'Clip head' });
          t.text(s, it.year, { x: x + 0.06, y, w: 1.18, h, bold: true, color: INK, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.18, h - 0.1, 18, 11, F.head, true) });
          head(s, it.h, x + 1.4, y + 0.03, 1.6, h - 0.06, { max: 13 });
          body(s, it.t, x + 3.05, y + 0.03, w - 3.13, h - 0.06, { max: 11, valign: 'middle' });
        });
      },
      async (d) => { // the strip hangs down the middle, the events fall to each side of it
        const s = page({}), x = 4.3, w = 1.4, rh = (BOT - TOP - 0.08) / 4;
        upright(s, x, TOP, w, BOT - TOP);
        titleAt(s, d.title, 0.6, 0.6, 3.5, 0.72, { max: 15, align: 'right', color: C.text });
        d.items.forEach((it, i) => {
          const y = TOP + 0.04 + i * rh, left = i % 2 === 0, tx = left ? 0.6 : 5.9, tw = 3.5, align = left ? 'right' : 'left';
          t.rect(s, x + 0.25, y + 0.04, w - 0.5, rh - 0.1, C.bg, { name: 'Frame' });
          t.text(s, it.year, { x: x + 0.27, y: y + 0.04, w: w - 0.54, h: rh - 0.1, bold: true, color: C.yellow, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.6, 0.6, 18, 10, F.head, true) });
          const yy = y + 0.02 + (i === 0 ? 0.82 : 0);
          head(s, it.h, tx, yy, tw, 0.3, { align, max: 13.5 });
          body(s, it.t, tx, yy + 0.31, tw, i === 0 ? 0.75 : rh - 0.36, { align, max: 11.5 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Kino', colors: { dk1: C.bar, lt1: C.text, dk2: C.bg, lt2: C.gray, accent1: C.yellow, accent2: C.text, accent3: C.gray, accent4: 'B8921A', accent5: C.line, accent6: C.dim, hlink: C.yellow, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "dramatik, hikoya kabi; sarlavhalar qisqa va ta'sirli", "limits": {"card_t4": 60}, "prefer": "visual"};
module.exports = { id: 26, slug: 'kino', name: 'Kino', category: 'creative', photos: true, build, style: STYLE };
