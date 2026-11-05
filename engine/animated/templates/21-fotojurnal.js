/**
 * 21 Fotojurnal — photo-magazine: full-bleed photographs with dark scrims and white type,
 * clean white inside pages, one hot orange accent. Meta line on every slide.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { ink: '111214', white: 'FFFFFF', accent: 'F05A28', gray: '6B6B6B', line: 'E2E2E2', soft: 'BDBDBD' };
const F = { head: 'Arial', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const scrUp = await L.scrim(C.ink, 0, 0.9, 'up'), scrLeft = await L.scrim(C.ink, 0, 0.88, 'left');
  let idx = 0;

  const footer = (s, dark, x = 0.6, w = 8.8) => {
    t.text(s, M.topic || '', { x, y: 5.2, w: w * 0.55, h: 0.25, fontSize: 9, color: dark ? C.soft : C.gray });
    t.text(s, meta, { x: x + w * 0.45, y: 5.2, w: w * 0.55, h: 0.25, fontSize: 9, color: dark ? C.soft : C.gray, align: 'right' });
  };
  const page = (d, bg = C.white) => {
    const s = pres.addSlide(); s.background = { color: bg }; idx++;
    const dark = bg !== C.white;
    t.rect(s, 0.6, 0.55, 0.16, 0.16, C.accent, { name: 'Mark' });
    t.text(s, L.pad2(idx), { x: 0.85, y: 0.5, w: 1, h: 0.26, fontSize: 11, bold: true, color: C.accent });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.8, w: 8.8, h: 0.75, bold: true, color: dark ? C.white : C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.75, 28, 18, F.head, true) });
    footer(s, dark);
    return s;
  };
  const full = async (d, scr) => {
    const s = pres.addSlide(); idx++;
    t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: d.title });
    t.img(s, scr, 0, 0, W, H);
    return s;
  };

  const R = {
    async cover(d) {
      const s = await full(d, scrUp);
      t.img(s, scrLeft, 0, 0, 6, H);
      t.text(s, [M.org, M.loc].filter(Boolean).join(', '), { x: 0.6, y: 0.45, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.white, charSpacing: 1 });
      t.text(s, M.year || '', { x: 7.4, y: 0.45, w: 2, h: 0.3, fontSize: 12, bold: true, color: C.white, align: 'right' });
      const fs = L.fit(d.title, 7.6, 2.0, 48, 28, F.head, true, 0.95);
      t.text(s, d.title, { x: 0.6, y: 1.2, w: 7.6, h: 2.2, fontSize: fs, bold: true, color: C.white, valign: 'bottom', lineSpacingMultiple: 0.95 });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.55, w: 6.6, h: 0.8, fontSize: 16, color: 'E6E6E6' });
      t.rect(s, 0.6, 4.72, 0.16, 0.16, C.accent, { name: 'Mark' });
      t.text(s, M.author || '', { x: 0.85, y: 4.62, w: 6, h: 0.35, fontSize: 14, bold: true, color: C.white, valign: 'middle' });
    },
    async intro(d) {
      const s = pres.addSlide(); s.background = { color: C.white }; idx++;
      t.img(s, await L.photo(L.src(d.image), 4.4, H), 0, 0, 4.4, H, { alt: d.title });
      t.rect(s, 4.95, 0.55, 0.16, 0.16, C.accent, { name: 'Mark' });
      t.text(s, d.title, { x: 4.95, y: 0.85, w: 4.5, h: 0.8, fontSize: 32, bold: true, valign: 'middle' });
      t.text(s, d.text, { x: 4.95, y: 1.85, w: 4.45, h: 3.1, fontSize: L.fit(d.text, 4.45, 3.1, 16, 12, F.body, false, 1.25), color: '333333', lineSpacingMultiple: 1.25 });
      t.text(s, M.topic || '', { x: 4.95, y: 4.98, w: 4.45, h: 0.22, fontSize: 9, color: C.gray });
      t.text(s, meta, { x: 4.95, y: 5.2, w: 4.45, h: 0.22, fontSize: 9, color: C.gray });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.75 + (i % per) * rh;
        t.text(s, L.pad2(i + 1), { x, y, w: 0.85, h: rh - 0.15, fontSize: 26, bold: true, color: C.accent, valign: 'middle' });
        t.text(s, it, { x: x + 0.95, y, w: 3.25, h: rh - 0.15, fontSize: 17, bold: true, valign: 'middle' });
        t.line(s, x, y + rh - 0.08, 4.2, 0, C.line, 0.75);
      });
    },
    async image(d) {
      const s = await full(d, scrLeft);
      t.rect(s, 0, 0, 5.6, H, C.ink, { t: 35, name: 'Text panel' });
      t.rect(s, 0.6, 0.55, 0.16, 0.16, C.accent, { name: 'Mark' });
      t.text(s, L.pad2(idx), { x: 0.85, y: 0.5, w: 1, h: 0.26, fontSize: 11, bold: true, color: C.accent });
      t.text(s, d.title, { x: 0.6, y: 0.9, w: 4.8, h: 1.2, fontSize: L.fit(d.title, 4.8, 1.2, 32, 20, F.head, true), bold: true, color: C.white, valign: 'bottom' });
      t.rect(s, 0.6, 2.3, 0.7, 0.06, C.accent, { name: 'Bar' });
      t.text(s, d.text, { x: 0.6, y: 2.55, w: 4.6, h: 2.45, fontSize: L.fit(d.text, 4.6, 2.45, 16, 12, F.body, false, 1.2), color: 'EDEDED', lineSpacingMultiple: 1.2 });
      footer(s, true);
    },
    async cards(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, cw - 0.45, 0.45, 18, 12, F.head, true)));
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw + (i ? 0.25 : 0), w = cw - (i ? 0.5 : 0.25);
        if (i) t.line(s, 0.6 + i * cw, 1.8, 0, 3.0, C.line, 0.75);
        t.text(s, L.pad2(i + 1), { x, y: 1.75, w, h: 0.6, fontSize: 30, bold: true, color: C.accent });
        t.text(s, it.h, { x, y: 2.45, w, h: 0.45, fontSize: hfs, bold: true });
        t.text(s, it.t, { x, y: 2.95, w, h: 1.9, fontSize: 14, color: C.gray });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      t.line(s, 0.6, 2.05, 8.8, 0, C.ink, 1.5);
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.35, 0.75, 18, 13, F.head, true)));
      const hh = Math.max(...d.steps.map((st) => L.height(st.h, hfs, cw - 0.35, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        t.oval(s, x, 1.9, 0.3, 0.3, i === n - 1 ? C.accent : C.ink);
        t.text(s, `${i + 1}`, { x: x + 0.45, y: 1.72, w: 1, h: 0.66, fontSize: 30, bold: true, color: C.line, valign: 'middle' });
        t.text(s, st.h, { x, y: 2.55, w: cw - 0.35, h: hh + 0.05, fontSize: hfs, bold: true });
        t.text(s, st.t, { x, y: 2.7 + hh, w: cw - 0.35, h: 2.2 - hh, fontSize: 14, color: C.gray });
      });
    },
    async stats(d) {
      const s = page(d, C.ink), n = d.stats.length, cw = 8.8 / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.4, 1.2, 66, 30, F.head, true)));
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        t.text(s, x.value, { x: px, y: 1.65, w: cw - 0.3, h: 1.3, fontSize: vfs, bold: true, color: C.white, valign: 'bottom' });
        t.rect(s, px, 3.1, 0.5, 0.06, C.accent, { name: 'Bar' });
        t.text(s, x.label, { x: px, y: 3.3, w: cw - 0.4, h: 0.95, fontSize: 14, color: C.soft });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.45, fontSize: 11, color: C.soft });
    },
    async compare(d) {
      const s = page(d), w = 4.15;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.35, F.body) : 0))) + 0.28);
      t.line(s, 5.0, 1.75, 0, 3.2, C.line, 0.75);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.3 : 0.6;
        t.text(s, side.h, { x, y: 1.7, w, h: 0.5, fontSize: 20, bold: true, color: i ? C.accent : C.ink });
        let y = 2.35;
        side.items.forEach((it, k) => {
          t.rect(s, x, y + 0.09, 0.1, 0.1, i ? C.accent : C.ink, { name: 'Bullet' });
          t.text(s, it, { x: x + 0.3, y, w: w - 0.35, h: rows[k], fontSize: 15 });
          y += rows[k];
        });
      });
    },
    async statement(d) {
      const s = page({ title: d.title }, C.ink);
      const fs = L.fit(d.text, 8.4, 1.8, 40, 24, F.head, true);
      t.text(s, L.runs(d.text), { x: 0.6, y: 1.75, w: 8.4, h: 1.9, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      t.rect(s, 0.6, 3.85, 0.9, 0.07, C.accent, { name: 'Bar' });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 4.05, w: 8.0, h: 0.95, fontSize: 14, color: C.soft });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.55;
      t.line(s, 0.6, ly, 8.8, 0, C.ink, 1.5);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.75, w: cw - 0.2, h: 0.6, fontSize: L.fit(it.year, cw - 0.3, 0.6, 28, 14, F.head, true), bold: true, valign: 'bottom', color: i === n - 1 ? C.accent : C.ink });
        t.oval(s, x, ly - 0.12, 0.24, 0.24, C.accent);
        t.text(s, it.h, { x, y: 2.85, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true });
        t.text(s, it.t, { x, y: 3.3, w: cw - 0.3, h: 1.65, fontSize: 14, color: C.gray });
      });
    },
    async quote(d) {
      const s = page({}, C.ink);
      const fs = L.fit(d.text, 7.6, 2.3, 34, 20, F.head, true), th = L.height(d.text, fs, 7.6, F.head, true);
      t.text(s, '\u201C', { x: 0.5, y: 3.9 - th - 1.35, w: 1.4, h: 1.4, fontSize: 120, bold: true, color: C.accent });
      t.text(s, d.text, { x: 0.6, y: 1.2, w: 7.6, h: 2.7, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.author) t.text(s, d.author, { x: 0.6, y: 4.1, w: 7.6, h: 0.4, fontSize: 15, color: C.soft });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.3 / n);
      d.items.forEach((it, i) => {
        const y = 1.75 + i * rh;
        t.text(s, `[${i + 1}]`, { x: 0.6, y, w: 0.6, h: rh, fontSize: 13, bold: true, color: C.accent, valign: 'middle' });
        t.text(s, it, { x: 1.25, y, w: 8.15, h: rh, fontSize: L.fit(it, 8.15, rh - 0.02, 14, 11, F.body), valign: 'middle', color: '333333' });
        t.line(s, 1.25, y + rh, 8.15, 0, C.line, 0.5);
      });
    },
    async closing(d) {
      const s = await full(d, scrUp);
      t.img(s, scrLeft, 0, 0, 6, H);
      const fs = L.fit(d.title, 7.6, 1.7, 46, 28, F.head, true);
      t.text(s, d.title, { x: 0.6, y: 1.0, w: 7.6, h: 1.9, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.05, w: 7, h: 0.5, fontSize: 17, color: 'E6E6E6' });
      t.rect(s, 0.6, 4.0, 0.16, 0.16, C.accent, { name: 'Mark' });
      t.text(s, M.author || '', { x: 0.85, y: 3.9, w: 6, h: 0.35, fontSize: 14, bold: true, color: C.white, valign: 'middle' });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 0.85, y: 4.25, w: 6, h: 0.3, fontSize: 12, color: C.soft });
      t.text(s, M.topic || '', { x: 0.6, y: 5.2, w: 8.8, h: 0.25, fontSize: 9, color: C.soft });
    },
  };
  // ---- further ways to draw a type, all in the magazine: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.gray, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 17, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10, F.body, false, 1.2), color: o.color || '333333', lineSpacingMultiple: 1.2, valign: o.valign || 'top' });
  const pageMark = (s, x, y, c = C.accent) => { t.rect(s, x, y + 0.05, 0.16, 0.16, c, { name: 'Mark' }); t.text(s, L.pad2(idx), { x: x + 0.25, y, w: 1, h: 0.26, fontSize: 11, bold: true, color: c }); };
  // viewfinder corners, the photographer's frame
  const crop = (s, x, y, w, h, c = C.accent, a = 0.28, wt = 1.75) => {
    for (const [px, py, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
      t.line(s, Math.min(px, px + dx * a), py, a, 0, c, wt, { name: 'Crop mark' });
      t.line(s, px, Math.min(py, py + dy * a), 0, a, c, wt, { name: 'Crop mark' });
    }
  };
  // a run of 35 mm film: black band, sprocket holes along both edges
  const film = (s, x, y, w, h) => {
    t.rect(s, x, y, w, h, C.ink, { name: 'Film' });
    const n = Math.floor(w / 0.3);
    for (let k = 0; k < n; k++) for (const py of [y + 0.07, y + h - 0.2]) t.rect(s, x + 0.1 + k * (w - 0.1) / n, py, 0.14, 0.13, C.white, { r: 0.02, name: 'Sprocket' });
  };
  const V = {
    image: [
      async (d) => { // magazine spread: the picture bleeds off three edges, words in the white margin
        const s = pres.addSlide(); s.background = { color: C.white }; idx++;
        t.img(s, await L.photo(L.src(d.image), 5.8, H), 4.2, 0, 5.8, H, { alt: d.title });
        pageMark(s, 0.6, 0.5);
        head(s, d.title, 0.6, 0.85, 3.3, 1.2, { max: 22 });
        t.rect(s, 0.6, 2.12, 0.7, 0.06, C.accent, { name: 'Bar' });
        longText(s, d.text, 0.6, 2.3, 3.3, 2.6, { max: 13 });
        t.text(s, M.topic || '', { x: 0.6, y: 4.98, w: 3.3, h: 0.22, fontSize: 9, color: C.gray });
        t.text(s, meta, { x: 0.6, y: 5.2, w: 3.3, h: 0.22, fontSize: 9, color: C.gray });
      },
      async (d) => { // one panorama cut into three prints
        const s = page(d), py = 1.6, ph = 1.95;
        t.img(s, await L.photo(L.src(d.image), 8.8, ph), 0.6, py, 8.8, ph, { alt: d.title });
        for (const x of [3.42, 6.36]) t.rect(s, x, py - 0.02, 0.1, ph + 0.04, C.white, { name: 'Gutter' });
        t.rect(s, 0.6, py + ph + 0.14, 0.6, 0.06, C.accent, { name: 'Bar' });
        longText(s, d.text, 1.4, py + ph + 0.1, 8.0, 1.4, { max: 14 });
      },
      async (d) => { // full-bleed picture, a white caption card pinned on it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: d.title });
        t.rect(s, 0, 5.12, W, 0.51, C.ink, { name: 'Footer band' });
        t.rect(s, 4.9, 0.4, 4.5, 4.45, C.white, { shadow: 0.3, name: 'Caption card' });
        t.rect(s, 4.9, 0.4, 0.09, 4.45, C.accent, { name: 'Edge' });
        pageMark(s, 5.25, 0.6);
        head(s, d.title, 5.25, 0.95, 3.9, 1.05, { max: 21 });
        longText(s, d.text, 5.25, 2.05, 3.9, 2.65, { max: 13 });
        footer(s, true);
      },
      async (d) => { // through the lens, in a dark room
        const s = page(d, C.ink), dia = 3.0, x = 6.1, y = 1.8;
        t.oval(s, x - 0.13, y - 0.13, dia + 0.26, dia + 0.26, null, { line: { color: C.accent, width: 2 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        crop(s, x - 0.3, y - 0.3, dia + 0.6, dia + 0.6, C.soft, 0.3, 1.25);
        longText(s, d.text, 0.6, 1.7, 4.8, 3.3, { color: 'EDEDED', valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // the contents page: a number, a heading, its line
        const s = page(d), n = d.items.length, h = 3.3 / n;
        d.items.forEach((it, i) => {
          const y = 1.68 + i * h;
          t.line(s, 0.6, y, 8.8, 0, i ? C.line : C.ink, i ? 0.75 : 1.5);
          t.text(s, L.pad2(i + 1), { x: 0.6, y: y + 0.06, w: 1.1, h: h - 0.12, fontSize: 30, bold: true, color: C.accent, valign: 'middle' });
          head(s, it.h, 1.8, y + 0.06, 2.6, h - 0.12, { valign: 'middle' });
          body(s, it.t, 4.6, y + 0.06, 4.8, h - 0.12, { valign: 'middle', max: 13 });
        });
      },
      async (d) => { // the dark pages at the back: four cells, hairlines between
        const s = page(d, C.ink), n = d.items.length, w = 4.4, h = 1.66;
        t.line(s, 0.6, 3.32, 8.8, 0, '3A3B40', 1);
        if (n > 3) t.line(s, 5, 1.68, 0, 3.3, '3A3B40', 1); else t.line(s, 5, 1.68, 0, 1.64, '3A3B40', 1);
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * w + (i % 2 ? 0.2 : 0), y = 1.68 + Math.floor(i / 2) * h;
          t.img(s, await L.icon(it.icon, C.accent, 2), x, y + 0.14, 0.36, 0.36);
          head(s, it.h, x + 0.52, y + 0.12, ww - 0.75, 0.42, { color: C.white, valign: 'middle' });
          body(s, it.t, x + 0.52, y + 0.58, ww - 0.75, h - 0.68, { color: C.soft, max: 13 });
        }
      },
      async (d) => { // the lead story in a black block, the rest as side stories
        const s = page(d), [a, ...rest] = d.items, h = 3.3 / rest.length;
        t.rect(s, 0.6, 1.68, 4.1, 3.3, C.ink, { name: 'Lead block' });
        t.rect(s, 0.6, 1.68, 4.1, 0.09, C.accent, { name: 'Lead edge' });
        t.img(s, await L.icon(a.icon, C.accent, 2), 0.9, 2.02, 0.5, 0.5);
        head(s, a.h, 0.9, 2.65, 3.5, 0.5, { color: C.white, max: 21 });
        body(s, a.t, 0.9, 3.2, 3.5, 1.65, { color: 'E6E6E6', max: 14 });
        for (const [i, it] of rest.entries()) {
          const y = 1.68 + i * h;
          if (i) t.line(s, 5.0, y, 4.4, 0, C.line, 0.75);
          t.img(s, await L.icon(it.icon, C.ink, 2), 5.0, y + 0.1, 0.28, 0.28);
          head(s, it.h, 5.4, y + 0.08, 4.0, 0.34, { max: 15, valign: 'middle' });
          body(s, it.t, 5.4, y + 0.44, 4.0, h - 0.5, { max: 12.5 });
        }
      },
      async (d) => { // prints thrown on the table, each in the viewfinder, none on one line
        const s = page(d), n = d.items.length, gap = 0.3, cw = (8.8 - gap * (n - 1)) / n, ch = n === 3 ? 2.75 : 2.85;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (cw + gap), y = 1.62 + (i % 2 ? 0.5 : 0);
          crop(s, x, y, cw, ch, i % 2 ? C.ink : C.accent);
          t.img(s, await L.icon(it.icon, C.accent, 2), x + 0.16, y + 0.16, 0.34, 0.34);
          head(s, it.h, x + 0.16, y + 0.56, cw - 0.32, 0.52, { max: 14 });
          body(s, it.t, x + 0.16, y + 1.1, cw - 0.32, ch - 1.22, { max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // staircase of grey to orange blocks, the last one lit
        const s = page(d), n = d.steps.length, cw = 8.8 / n, top = 1.62, rise = n === 3 ? 0.42 : 0.3, shades = ['F4F4F2', 'E9E9E6', 'DDDDD9', C.accent];
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw, y = top + (n - 1 - i) * rise, last = i === n - 1, h = 5.05 - y;
          t.rect(s, x, y, cw - 0.06, h, last ? C.accent : shades[Math.min(i, 2)], { name: 'Step' });
          t.text(s, `${i + 1}`, { x: x + 0.15, y: y + 0.06, w: 0.8, h: 0.5, fontSize: 26, bold: true, color: last ? C.white : C.accent, valign: 'middle' });
          head(s, st.h, x + 0.15, y + 0.58, cw - 0.36, 0.55, { max: 14 });
          body(s, st.t, x + 0.15, y + 1.14, cw - 0.36, Math.max(0.6, h - 1.22), { color: last ? C.ink : '444444', max: 12.5 });
        });
      },
      async (d) => { // a strip of film: every step one exposure
        const s = page(d), n = d.steps.length, y0 = 1.6, hh = 3.45;
        film(s, 0, y0, W, hh);
        const fw = (8.8 - 0.14 * (n - 1)) / n;
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * (fw + 0.14), y = y0 + 0.3, h = hh - 0.6;
          t.rect(s, x, y, fw, h, C.white, { name: 'Frame' });
          t.text(s, `${i + 1}A`, { x: x + 0.14, y: y + 0.08, w: 1, h: 0.3, fontSize: 12, bold: true, color: C.accent });
          head(s, st.h, x + 0.14, y + 0.38, fw - 0.28, 0.55, { max: 14 });
          body(s, st.t, x + 0.14, y + 0.95, fw - 0.28, h - 1.03, { color: '444444', max: 12.5 });
        });
      },
      async (d) => { // title down a black column, the steps go down a line beside it
        const s = pres.addSlide(); s.background = { color: C.white }; idx++;
        t.rect(s, 0, 0, 3.5, H, C.ink, { name: 'Column' });
        pageMark(s, 0.5, 0.5);
        head(s, d.title, 0.5, 0.95, 2.6, 2.6, { color: C.white, max: 26 });
        const n = d.steps.length, h = 4.45 / n;
        t.line(s, 4.05, 0.62, 0, 4.45 - h + 0.1, C.ink, 1.5);
        d.steps.forEach((st, i) => {
          const y = 0.45 + i * h;
          t.oval(s, 3.85, y + 0.04, 0.4, 0.4, i === n - 1 ? C.accent : C.ink);
          t.text(s, `${i + 1}`, { x: 3.85, y: y + 0.04, w: 0.4, h: 0.4, fontSize: 13, bold: true, color: C.white, align: 'center', valign: 'middle' });
          head(s, st.h, 4.5, y + 0.02, 4.9, 0.36, { max: 16, valign: 'middle' });
          body(s, st.t, 4.5, y + 0.4, 4.9, h - 0.46, { max: 13 });
        });
        t.text(s, M.topic || '', { x: 0.5, y: 4.7, w: 2.7, h: 0.6, fontSize: 9, color: C.soft, valign: 'bottom' });
        t.text(s, meta, { x: 4.5, y: 5.2, w: 4.9, h: 0.25, fontSize: 9, color: C.gray, align: 'right' });
      },
    ],
    stats: [
      async (d) => { // lead number on an orange half page
        const s = pres.addSlide(); s.background = { color: C.white }; idx++;
        const [a, ...rest] = d.stats;
        t.rect(s, 0, 0, 4.6, H, C.accent, { name: 'Lead' });
        pageMark(s, 0.5, 0.5, C.white);
        t.text(s, a.value, { x: 0.5, y: 1.55, w: 3.8, h: 1.5, bold: true, color: C.white, valign: 'bottom', fontSize: L.fit(a.value, 3.8, 1.4, 72, 32, F.head, true) });
        t.rect(s, 0.5, 3.15, 0.7, 0.06, C.ink, { name: 'Bar' });
        body(s, a.label, 0.5, 3.32, 3.7, 1.0, { color: C.ink, max: 16 });
        t.text(s, M.topic || '', { x: 0.5, y: 5.2, w: 3.8, h: 0.25, fontSize: 9, color: C.ink });
        head(s, d.title, 5.0, 0.48, 4.4, 1.05, { max: 22, valign: 'middle' });
        rest.forEach((x, i) => {
          const y = 1.68 + i * 1.12;
          t.line(s, 5.0, y, 4.4, 0, C.ink, i ? 0.75 : 1.5);
          t.text(s, x.value, { x: 5.0, y: y + 0.08, w: 2.1, h: 0.95, bold: true, valign: 'middle', fontSize: L.fit(x.value, 2.1, 0.9, 36, 20, F.head, true) });
          body(s, x.label, 7.2, y + 0.08, 2.2, 0.95, { max: 12, valign: 'middle' });
        });
        if (d.note) body(s, d.note, 5.0, 3.98, 4.4, 1.12, { max: 11 });
        t.text(s, meta, { x: 5.0, y: 5.2, w: 4.4, h: 0.25, fontSize: 9, color: C.gray, align: 'right' });
      },
      async (d) => { // three lenses, numbers in their glass
        const s = page(d), dia = 2.0, gap = 0.9, x0 = (W - 3 * dia - 2 * gap) / 2;
        d.stats.forEach((x, i) => {
          const px = x0 + i * (dia + gap), y = 1.55;
          t.oval(s, px, y, dia, dia, i === 1 ? C.accent : C.ink);
          t.oval(s, px + 0.1, y + 0.1, dia - 0.2, dia - 0.2, null, { line: { color: i === 1 ? C.white : C.soft, width: 0.75 } });
          t.text(s, x.value, { x: px + 0.2, y: y + 0.45, w: dia - 0.4, h: dia - 0.9, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 0.4, dia - 0.9, 34, 18, F.head, true) });
          body(s, x.label, px - 0.35, y + dia + 0.08, dia + 0.7, 0.6, { align: 'center', max: 12, color: '333333' });
        });
        if (d.note) body(s, d.note, 0.6, 4.3, 8.8, 0.8, { max: 11, align: 'center' });
      },
    ],
    compare: [
      async (d) => { // facing pages, black and white, the words run away from the fold
        const s = page(d), y = 1.6, h = 3.5;
        t.rect(s, 0, y, 5, h, C.ink, { name: 'Left page' });
        t.rect(s, 5, y, 5, h, 'F4F4F2', { name: 'Right page' });
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.45 : 0.6, w = 3.95, align = i ? 'left' : 'right', n = side.items.length, rh = (h - 0.85) / n;
          head(s, side.h, x, y + 0.18, w, 0.5, { max: 19, align, color: i ? C.accent : C.white, valign: 'middle' });
          side.items.forEach((it, k) => {
            body(s, it, x, y + 0.75 + k * rh, w, rh - 0.06, { max: 14, align, color: i ? C.ink : 'E6E6E6', valign: 'middle' });
          });
        });
        t.oval(s, 4.72, y + 0.2, 0.56, 0.56, C.accent, { line: { color: C.white, width: 2 } });
        t.text(s, '⇄', { x: 4.72, y: y + 0.2, w: 0.56, h: 0.56, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
      },
      async (d) => { // two bands stacked, each a row of columns
        const s = page(d), bh = 1.68;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.62 + i * (bh + 0.08), dark = i === 1, n = side.items.length, x0 = 2.75, cw = (9.4 - x0) / n;
          t.rect(s, 0.6, y, 8.8, bh, dark ? C.ink : 'F4F4F2', { name: 'Band' });
          t.rect(s, 0.6, y, 0.09, bh, C.accent, { name: 'Edge' });
          head(s, side.h, 0.85, y + 0.1, 1.75, bh - 0.2, { max: 18, color: dark ? C.accent : C.ink, valign: 'middle' });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.06, y + 0.2, 0, bh - 0.4, dark ? '3A3B40' : C.soft, 0.75);
            body(s, it, x0 + k * cw + 0.04, y + 0.1, cw - 0.18, bh - 0.2, { max: 14, color: dark ? 'E6E6E6' : '333333', valign: 'middle' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the headline alone in the viewfinder
        const s = page({}), x = 0.9, y = 0.95, w = 8.2, h = 4.05;
        crop(s, x, y, w, h, C.accent, 0.45, 2.5);
        if (d.title) t.text(s, d.title, { x: 1.4, y: 1.1, w: 7.2, h: 0.36, fontSize: 12, bold: true, color: C.gray, align: 'center', valign: 'middle' });
        t.text(s, L.runs(d.text), { x: 1.4, y: 1.5, w: 7.2, h: 2.0, bold: true, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 7.2, 1.95, 34, 20, F.head, true) });
        if (d.caption) body(s, d.caption, 1.7, 3.6, 6.6, 1.25, { align: 'center', max: 13 });
      },
      async (d) => { // the orange page of the issue
        const s = pres.addSlide(); s.background = { color: C.accent }; idx++;
        pageMark(s, 0.6, 0.5, C.white);
        if (d.title) t.text(s, d.title, { x: 1.5, y: 0.45, w: 7.9, h: 0.36, fontSize: 13, bold: true, color: C.ink, align: 'right', valign: 'middle' });
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.05, w: 5.7, h: 3.9, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 5.7, 3.8, 38, 20, F.head, true) });
        t.line(s, 6.6, 1.2, 0, 3.6, C.ink, 1.5);
        if (d.caption) body(s, d.caption, 6.85, 1.2, 2.55, 3.6, { color: C.ink, max: 13, valign: 'middle' });
        t.text(s, M.topic || '', { x: 0.6, y: 5.2, w: 4.8, h: 0.25, fontSize: 9, color: C.ink });
        t.text(s, meta, { x: 5.0, y: 5.2, w: 4.4, h: 0.25, fontSize: 9, color: C.ink, align: 'right' });
      },
    ],
    timeline: [
      async (d) => { // events on both sides of a thick line, in turn
        const s = page(d), ly = 3.32, nodes = [1.3, 3.7, 6.1, 8.5];
        t.rect(s, 0, ly - 0.03, W, 0.06, C.ink, { name: 'Spine' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = i < 2 ? 0.6 : 5.2, y = up ? 1.62 : ly + 0.2, w = 4.2;
          t.oval(s, nodes[i] - 0.12, ly - 0.12, 0.24, 0.24, i === 3 ? C.accent : C.ink);
          t.text(s, it.year, { x, y, w: 1.35, h: 0.34, bold: true, color: C.accent, valign: 'middle', fontSize: L.fit(it.year, 1.35, 0.34, 18, 11, F.head, true) });
          head(s, it.h, x + 1.4, y, w - 1.4, 0.34, { max: 15, valign: 'middle' });
          body(s, it.t, x, y + 0.38, w, 1.12, { max: 13 });
        });
      },
      async (d) => { // the dark archive: years in a wide column, one line of film beside them
        const s = page(d, C.ink), h = 0.84;
        d.items.forEach((it, i) => {
          const y = 1.66 + i * h;
          t.text(s, it.year, { x: 0.6, y, w: 2.0, h: h - 0.08, bold: true, color: i === 3 ? C.accent : C.white, valign: 'middle', fontSize: L.fit(it.year, 2.0, h - 0.1, 26, 14, F.head, true) });
          t.rect(s, 2.8, y, 0.08, h - 0.08, i === 3 ? C.accent : '3A3B40', { name: 'Marker' });
          head(s, it.h, 3.05, y, 2.2, h - 0.08, { color: C.white, max: 15, valign: 'middle' });
          body(s, it.t, 5.3, y, 4.1, h - 0.08, { color: C.soft, max: 13, valign: 'middle' });
        });
      },
      async (d) => { // four back issues on the rack: the year is the masthead on the spine, the rack steps down
        const s = page(d), w = 4.3, h = 1.5;
        d.items.forEach((it, i) => {
          const x = 0.6 + (i % 2) * (w + 0.2), y = 1.6 + Math.floor(i / 2) * (h + 0.12) + (i % 2 ? 0.22 : 0), hot = i === 3;
          t.rect(s, x, y, 1.3, h, hot ? C.accent : C.ink, { name: 'Spine of issue' });
          t.text(s, it.year, { x: x + 0.08, y, w: 1.14, h, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.14, h, 24, 12, F.head, true) });
          t.rect(s, x + 1.3, y, w - 1.3, h, 'F4F4F2', { name: 'Issue' });
          head(s, it.h, x + 1.42, y + 0.07, w - 1.54, 0.36, { max: 14, valign: 'middle' });
          body(s, it.t, x + 1.42, y + 0.44, w - 1.54, h - 0.5, { max: 13, color: '444444' });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Fotojurnal', colors: { dk1: C.ink, lt1: C.white, dk2: '2A2B2F', lt2: 'F4F4F2', accent1: C.accent, accent2: C.ink, accent3: C.gray, accent4: 'F5A07F', accent5: C.soft, accent6: C.line, hlink: C.accent, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "fotoreportaj: jonli, aniq, kuchli sarlavhalar", "limits": {}, "prefer": "visual"};
module.exports = { id: 21, slug: 'fotojurnal', name: 'Fotojurnal', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["fade", "p14:gallery|dir=\"l\"", "morph"], "cover": ["fadeWords", "riseWords"], "mark": "focusIn", "deco": "fade", "sig": {"title": "sweepIn", "body": "fadeUp", "item": "softGrow", "image": "focusIn", "number": "focusIn", "order": "seq", "stagger": 0.22}, "tempo": 1.1, "kenburns": true};
