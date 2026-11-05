/**
 * 29 Dinamika — motion and energy: everything leans forward. Slanted photo cut-outs,
 * parallelogram chips and bands, bold italic type, charcoal with electric orange.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { char: '1E1F24', char2: '2B2D33', orange: 'FF5A1F', white: 'FFFFFF', gray: '8E9097', light: 'F2F2F4', line: 'DADBE0' };
const F = { head: 'Arial', body: 'Arial' };
const SLANT = (k = 0.16) => ({ poly: [[k, 0], [1, 0], [1 - k, 1], [0, 1]] });

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  let idx = 0;
  const para = (s, x, y, w, h, fill, adj = 0.25) => s.addShape(t.S.PARALLELOGRAM, { x, y, w, h, fill: { color: fill }, line: { type: 'none' }, objectName: 'Slant', adjusting: adj });
  const footer = (s, dark, left = M.topic || '') => {
    t.rect(s, 0, 5.15, W, 0.475, dark ? C.char2 : C.char, { name: 'Footer bar' });
    para(s, 0.35, 5.15, 0.9, 0.475, C.orange);
    t.text(s, left, { x: 1.45, y: 5.15, w: 4.2, h: 0.475, fontSize: 9, bold: true, italic: true, color: C.white, valign: 'middle' });
    t.text(s, meta, { x: 5.0, y: 5.15, w: 4.4, h: 0.475, fontSize: 9, color: 'C9CACE', align: 'right', valign: 'middle' });
  };
  const page = (d, bg = C.light) => {
    const s = pres.addSlide(); s.background = { color: bg }; idx++;
    const dark = bg === C.char;
    para(s, 0.5, 0.45, 0.85, 0.5, bg === C.orange ? C.char : C.orange);
    t.text(s, L.pad2(idx), { x: 0.5, y: 0.45, w: 0.85, h: 0.5, fontSize: 15, bold: true, italic: true, color: C.white, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.55, y: 0.38, w: 7.9, h: 0.65, bold: true, italic: true, color: dark ? C.white : C.char, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.65, 28, 16, F.head, true, 1, true) });
    footer(s, dark);
    return s;
  };
  const slantPhoto = async (s, img, x, y, w, h, alt, k) => t.img(s, await L.photo(img, w, h, { mask: SLANT(k) }), x, y, w, h, { alt });

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.char }; idx++;
      await slantPhoto(s, L.src(d.image), 4.3, 0, 5.7, 5.15, d.title, 0.2);
      para(s, 3.75, 0, 1.6, 5.15, C.orange, 0.35);
      const org = [M.org, M.loc, M.year].filter(Boolean).join('  /  ');
      t.text(s, org, { x: 0.6, y: 0.45, w: 3.0, h: 0.5, fontSize: L.fit(org, 3.0, 0.5, 11, 8, F.head, true, 1, true), bold: true, italic: true, color: C.orange, valign: 'top' });
      const fs = L.fit(d.title, 3.9, 2.4, 40, 22, F.head, true, 0.95, true);
      t.text(s, d.title, { x: 0.6, y: 0.95, w: 3.9, h: 2.5, fontSize: fs, bold: true, italic: true, color: C.white, valign: 'bottom', lineSpacingMultiple: 0.95 });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.6, w: 3.4, h: 0.85, fontSize: 12, color: 'C9CACE' });
      footer(s, true, M.author || '');
    },
    async intro(d) {
      const s = page(d);
      await slantPhoto(s, L.src(d.image), 0.5, 1.25, 4.3, 3.65, d.title, 0.14);
      t.text(s, d.text, { x: 5.05, y: 1.3, w: 4.4, h: 3.55, fontSize: L.fit(d.text, 4.4, 3.55, 15, 11, F.body, false, 1.25), color: C.char, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.3 + (i % per) * rh;
        para(s, x, y + 0.08, 4.1, rh - 0.25, C.white, 0.12);
        t.text(s, L.pad2(i + 1), { x: x + 0.3, y: y + 0.08, w: 0.8, h: rh - 0.25, fontSize: 22, bold: true, italic: true, color: C.orange, valign: 'middle' });
        t.text(s, it, { x: x + 1.1, y: y + 0.08, w: 2.8, h: rh - 0.25, fontSize: 16, bold: true, color: C.char, valign: 'middle' });
      });
    },
    async image(d) {
      const s = page(d, C.char);
      await slantPhoto(s, L.src(d.image), 4.5, 1.15, 5.0, 3.8, d.title, 0.16);
      t.rect(s, 0.6, 1.4, 0.08, 3.3, C.orange, { name: 'Accent' });
      t.text(s, d.text, { x: 0.9, y: 1.35, w: 3.75, h: 3.4, fontSize: L.fit(d.text, 3.75, 3.4, 15, 11, F.body, false, 1.25), color: 'E4E4E6', lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.5, 1.45 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.4);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        t.rect(s, x, 1.35, w, h, C.white, { name: 'Card' });
        para(s, x + 0.2, 1.2, 0.9, 0.42, i % 2 ? C.char : C.orange);
        t.text(s, L.pad2(i + 1), { x: x + 0.2, y: 1.2, w: 0.9, h: 0.42, fontSize: 13, bold: true, italic: true, color: C.white, align: 'center', valign: 'middle' });
        t.img(s, await L.icon(it.icon, C.orange, 2), x + w - 0.6, 1.5, 0.36, 0.36);
        t.text(s, it.h, { x: x + 0.25, y: 1.95, w: w - 0.5, h: 0.45, fontSize: L.fit(it.h, w - 0.5, 0.45, 17, 12, F.head, true, 1, true), bold: true, italic: true, color: C.char });
        t.text(s, it.t, { x: x + 0.25, y: 2.45, w: w - 0.5, h: h - 1.2, fontSize: 14, color: '55575E' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n, shades = ['FFB08F', 'FF8A5C', C.orange, C.char];
      const col = (i) => shades[Math.round((i * (shades.length - 1)) / Math.max(1, n - 1))];
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.75, 17, 12, F.head, true, 1, true)));
      const hh = Math.max(...d.steps.map((st) => L.height(st.h, hfs, cw - 0.3, F.head, true, 1, true)));
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        para(s, x, 1.35, cw + 0.05, 0.75, col(i), 0.3);
        t.text(s, L.pad2(i + 1), { x: x + 0.3, y: 1.35, w: cw - 0.6, h: 0.75, fontSize: 24, bold: true, italic: true, color: C.white, valign: 'middle' });
        t.text(s, st.h, { x, y: 2.35, w: cw - 0.3, h: hh + 0.05, fontSize: hfs, bold: true, italic: true, color: C.char });
        t.text(s, st.t, { x, y: 2.5 + hh, w: cw - 0.3, h: 2.4 - hh, fontSize: 14, color: '55575E' });
      });
    },
    async stats(d) {
      const s = page(d, C.char), n = d.stats.length, cw = 8.8 / n;
      const vfs = Math.min(...d.stats.map((x) => L.fit(x.value, cw - 0.6, 1.3, 70, 30, F.head, true, 1, true)));
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        para(s, px, 1.5, 0.35, 1.3, C.orange, 0.4);
        t.text(s, x.value, { x: px + 0.45, y: 1.4, w: cw - 0.6, h: 1.45, fontSize: vfs, bold: true, italic: true, color: C.white, valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.45, y: 3.0, w: cw - 0.7, h: 1.0, fontSize: 14, color: 'C9CACE' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.45, w: 8.8, h: 0.45, fontSize: 10, color: 'C9CACE' });
    },
    async compare(d) {
      const s = page(d), w = 4.0;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.5, F.body, 0.22, 4.85 - 2.0);
      para(s, 4.55, 1.3, 0.6, 3.6, C.orange, 0.5);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.4 : 0.6;
        t.text(s, side.h, { x, y: 1.3, w, h: 0.5, fontSize: 20, bold: true, italic: true, color: i ? C.orange : C.char });
        let y = 2.0;
        side.items.forEach((it, k) => { para(s, x, y + 0.07, 0.22, 0.16, i ? C.orange : C.char, 0.4); t.text(s, it, { x: x + 0.4, y, w: w - 0.5, h: rows[k], fontSize: CFS, color: C.char }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page({ title: d.title }, C.orange);
      const fs = L.fit(d.text, 8.4, 2.0, 40, 22, F.head, true, 1, true);
      t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 8.4, h: 2.2, fontSize: fs, bold: true, italic: true, color: C.char, valign: 'bottom' });
      para(s, 0.6, 3.7, 1.4, 0.14, C.char, 0.5);
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 3.95, w: 8.2, h: 1.0, fontSize: L.fit(d.caption, 8.2, 1.0, 14, 10, F.body), color: C.char });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.3;
      t.rect(s, 0.6, ly - 0.03, 8.8, 0.06, C.char, { name: 'Axis' });
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.3, w: cw - 0.2, h: 0.75, fontSize: L.fit(it.year, cw - 0.3, 0.7, 32, 14, F.head, true, 1, true), bold: true, italic: true, color: i % 2 ? C.orange : C.char, valign: 'bottom' });
        para(s, x, ly - 0.15, 0.55, 0.3, C.orange, 0.4);
        t.text(s, it.h, { x, y: 2.65, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, italic: true, color: C.char });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.3, h: 1.85, fontSize: 14, color: '55575E' });
      });
    },
    async quote(d) {
      const s = page({}, C.char);
      const fs = L.fit(d.text, 7.8, 2.4, 36, 20, F.head, true, 1, true);
      para(s, 0.6, 1.2, 0.35, 2.8, C.orange, 0.4);
      t.text(s, d.text, { x: 1.2, y: 1.1, w: 7.8, h: 2.9, fontSize: fs, bold: true, italic: true, color: C.white, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.2, y: 4.15, w: 7.8, h: 0.4, fontSize: 15, color: C.orange, bold: true });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.6 / n);
      d.items.forEach((it, i) => {
        const y = 1.3 + i * rh;
        para(s, 0.6, y + (rh - 0.36) / 2, 0.6, 0.36, i % 2 ? C.char : C.orange, 0.3);
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.36) / 2, w: 0.6, h: 0.36, fontSize: 12, bold: true, italic: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.4, y, w: 8.0, h: rh, fontSize: L.fit(it, 8.0, rh - 0.05, 14, 10, F.body), color: C.char, valign: 'middle' });
      });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.char }; idx++;
      await slantPhoto(s, L.src(d.image), 0, 0, 5.6, 5.15, d.title, 0.2);
      para(s, 4.6, 0, 1.4, 5.15, C.orange, 0.35);
      const fs = L.fit(d.title, 3.6, 2.0, 38, 20, F.head, true, 1, true);
      t.text(s, d.title, { x: 5.9, y: 0.8, w: 3.6, h: 2.1, fontSize: fs, bold: true, italic: true, color: C.white, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 5.9, y: 3.05, w: 3.5, h: 0.6, fontSize: 13, color: 'C9CACE' });
      t.text(s, M.author || '', { x: 5.9, y: 3.85, w: 3.5, h: 0.35, fontSize: 14, bold: true, italic: true, color: C.orange });
      footer(s, true);
    },
  };
  // ---- further ways to draw a type, all leaning forward: a deck's pages must not look alike (L.pages)
  const DIM = '3C3E44', PALE = 'C9CACE';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13.5, 10, F.body), color: o.color || DIM, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, italic: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true, 1, true), color: o.color || C.char, align: o.align, valign: o.valign || 'middle' });
  const big = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, italic: true, fontSize: L.fit(v, w, h, o.max || 40, o.min || 16, F.head, true, 1, true), color: o.color || C.char, align: o.align, valign: o.valign || 'middle' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body, false, 1.25), color: o.color || C.char, lineSpacingMultiple: 1.25, valign: o.valign || 'top' });
  const chip = (s, x, y, f = C.orange, fg = C.white) => { para(s, x, y, 0.85, 0.5, f); t.text(s, L.pad2(idx), { x, y, w: 0.85, h: 0.5, fontSize: 15, bold: true, italic: true, color: fg, align: 'center', valign: 'middle' }); };
  const bare = (bg = C.light) => { const s = pres.addSlide(); s.background = { color: bg }; idx++; return s; };
  // speed lines: a stroke of orange trailing behind something fast
  const trail = (s, x, y, w, c = C.orange, n = 4) => { for (let k = 0; k < n; k++) para(s, x + k * 0.5, y + k * 0.14, w - k * 0.75, 0.05, c, 0.5); };
  // an arrow head of any size, pointing right or left
  const arrow = (w, h, f, left = false, notch = true) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100), a = Math.min(36, W2 * 0.18), pts = left ? `${W2},0 ${a},0 0,${H2 / 2} ${a},${H2} ${W2},${H2}${notch ? ` ${W2 - a},${H2 / 2}` : ''}` : `0,0 ${W2 - a},0 ${W2},${H2 / 2} ${W2 - a},${H2} 0,${H2}${notch ? ` ${a},${H2 / 2}` : ''}`; return L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><polygon points="${pts}" fill="#${f}"/></svg>`, W2, H2); };
  // a leaning sheet whose lean is known, so the words inside can keep clear of its edge
  const lean = async (s, x, y, w, h, f, k) => t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w * 100)}" height="${Math.round(h * 100)}"><polygon points="${k * 100},0 ${w * 100},0 ${(w - k) * 100},${h * 100} 0,${h * 100}" fill="#${f}"/></svg>`, Math.round(w * 100), Math.round(h * 100)), x, y, w, h);
  const V = {
    image: [
      async (d) => { // the picture races under a leaning dark panel
        const s = bare(C.char);
        t.img(s, await L.photo(L.src(d.image), W, 5.15), 0, 0, W, 5.15, { alt: d.title });
        para(s, -0.9, 0, 6.9, 5.15, C.char, 0.14);
        para(s, 5.45, 0, 1.25, 5.15, C.orange, 0.5);
        footer(s, true);
        chip(s, 0.5, 0.4);
        big(s, d.title, 1.5, 0.3, 3.75, 1.0, { color: C.white, max: 24 });
        longText(s, d.text, 0.5, 1.45, 4.3, 3.55, { color: C.white, max: 13.5 });
      },
      async (d) => { // one picture cut into three leaning shards
        const s = page(d), py = 1.15, ph = 2.25, full = 8.9, data = await L.photo(L.src(d.image), full, ph, { mask: { poly: [[0.05, 0], [0.33, 0], [0.28, 1], [0, 1]] } });
        const mid = await L.photo(L.src(d.image), full, ph, { mask: { poly: [[0.355, 0], [0.655, 0], [0.605, 1], [0.305, 1]] } });
        const end = await L.photo(L.src(d.image), full, ph, { mask: { poly: [[0.68, 0], [1, 0], [0.95, 1], [0.63, 1]] } });
        for (const im of [data, mid, end]) t.img(s, im, 0.55, py, full, ph, { alt: d.title });
        para(s, 0.55, py + ph + 0.1, 0.8, 0.09, C.orange, 0.5);
        longText(s, d.text, 0.6, py + ph + 0.24, 8.8, 1.38, { max: 13.5 });
      },
      async (d) => { // a wheel: the round picture rolls in from the edge, leaving lines behind it
        const s = page(d, C.char), dia = 3.5, x = 6.1, y = 1.28;
        t.oval(s, x - 0.1, y - 0.1, dia + 0.2, dia + 0.2, null, { line: { color: C.orange, width: 4 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        trail(s, 2.6, 4.46, 3.3);
        longText(s, d.text, 0.6, 1.25, 5.1, 3.1, { color: C.white, max: 13.5 });
      },
      async (d) => { // the orange page, the picture tips over the words
        const s = page(d, C.orange), w = 4.7, h = 3.85;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: SLANT(0.24) }), 0.35, 1.2, w, h, { alt: d.title });
        para(s, 0.2, 4.6, 1.6, 0.45, C.char, 0.5);
        longText(s, d.text, 5.15, 1.22, 4.3, 3.8, { color: C.char, valign: 'middle', max: 14 });
      },
    ],
    cards: [
      async (d) => { // bands that push further right as they go down
        const s = page(d), n = d.items.length, g = 0.1, h = (3.8 - g * (n - 1)) / n, dx = n === 3 ? 0.4 : 0.3, w = 8.0;
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * dx, y = 1.2 + i * (h + g), dark = i % 2 === 1;
          para(s, x, y, w + 0.5, h, dark ? C.char : C.white, 0.14);
          t.img(s, await L.icon(it.icon, C.orange, 2), x + 0.42, y + h / 2 - 0.2, 0.4, 0.4);
          head(s, it.h, x + 0.98, y + 0.05, 2.4, h - 0.1, { color: dark ? C.white : C.char, max: 15 });
          body(s, it.t, x + 3.45, y + 0.05, w - 3.5, h - 0.1, { color: dark ? PALE : DIM, max: 13, valign: 'middle' });
        }
      },
      async (d) => { // the dark page: four cells split by a leaning cross
        const s = page(d, C.char), n = d.items.length, w = 4.3, h = 1.84;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.2 + Math.floor(i / 2) * (h + 0.08);
          t.rect(s, x, y, ww, h, C.char2, { name: 'Cell' });
          para(s, x, y, 0.8, 0.46, C.orange, 0.3);
          t.img(s, await L.icon(it.icon, C.white, 2), x + 0.27, y + 0.09, 0.28, 0.28);
          head(s, it.h, x + 0.92, y + 0.04, ww - 1.05, 0.42, { color: C.white, max: 15 });
          body(s, it.t, x + 0.2, y + 0.56, ww - 0.4, h - 0.66, { color: PALE, max: 13 });
        }
      },
      async (d) => { // the first one takes the lead in a great orange slant, the others follow
        const s = page(d), [a, ...rest] = d.items, h = 3.8 / rest.length;
        await lean(s, 0.35, 1.2, 4.75, 3.82, C.orange, 0.45);
        t.img(s, await L.icon(a.icon, C.char, 2), 0.95, 1.38, 0.48, 0.48);
        head(s, a.h, 0.9, 1.92, 3.4, 0.5, { max: 20 });
        body(s, a.t, 0.9, 2.46, 3.35, 2.42, { color: C.char, max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = 1.2 + i * h, x = 5.25 - i * 0.14;
          t.img(s, await L.icon(it.icon, C.orange, 2), x, y + 0.05, 0.3, 0.3);
          head(s, it.h, x + 0.4, y + 0.02, 9.4 - x - 0.4, 0.36, { max: 15 });
          body(s, it.t, x + 0.4, y + 0.4, 9.4 - x - 0.4, h - 0.46, { max: 12.5 });
          if (i) t.line(s, x, y - 0.02, 9.4 - x, 0, C.line, 1);
        }
      },
      async (d) => { // tall leaning sheets, up and down
        const s = page(d), n = d.items.length, k = 0.3, cw = (9.2 - k) / n, h = 3.42;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * cw, y = 1.2 + (i % 2 ? 0.42 : 0), dark = i % 2 === 1, tx = x + k + 0.08, tw = cw - k - 0.16;
          await lean(s, x, y, cw + k - 0.06, h, dark ? C.char : C.white, k);
          t.img(s, await L.icon(it.icon, C.orange, 2), tx, y + 0.16, 0.36, 0.36);
          head(s, it.h, tx, y + 0.56, tw, 0.54, { color: dark ? C.white : C.char, max: 14 });
          body(s, it.t, tx, y + 1.12, tw, h - 1.2, { color: dark ? PALE : DIM, max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // great arrows driving into each other, the words inside
        const s = page(d), n = d.steps.length, cw = 9.4 / n, y = 1.2, h = 3.82, fills = n === 3 ? [C.white, 'FFB08F', C.orange] : [C.white, 'FFD2BF', 'FFB08F', C.orange];
        for (const [i, st] of d.steps.entries()) {
          const x = 0.3 + i * cw, aw = cw + 0.34;
          t.img(s, await arrow(aw, h, fills[i], false, i > 0), x, y, Math.min(aw, 10 - x), h);
          const tx = x + (i ? 0.46 : 0.24), tw = cw - (i ? 0.46 : 0.24) - 0.02;
          big(s, String(i + 1), tx, y + 0.1, 0.9, 0.62, { max: 30 });
          head(s, st.h, tx, y + 0.74, tw, 0.56, { max: 14, valign: 'top' });
          body(s, st.t, tx, y + 1.32, tw, h - 1.42, { color: C.char, max: 12.5 });
        }
      },
      async (d) => { // the dark page: stairs picking up speed
        const s = page(d, C.char), n = d.steps.length, cw = 8.8 / n, rise = n === 3 ? 0.5 : 0.36, top = 1.2;
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw, y = top + (n - 1 - i) * rise, h = 5.05 - y, hot = i === n - 1;
          t.rect(s, x, y + 0.18, cw - 0.05, h - 0.18, hot ? C.orange : C.char2, { name: 'Step' });
          para(s, x, y, cw - 0.05 + 0.14, 0.2, C.orange, 0.5);
          big(s, L.pad2(i + 1), x + 0.14, y + 0.24, 1, 0.46, { max: 22, color: hot ? C.char : C.orange });
          head(s, st.h, x + 0.14, y + 0.72, cw - 0.32, 0.5, { color: hot ? C.char : C.white, max: 14, valign: 'top' });
          body(s, st.t, x + 0.14, y + 1.22, cw - 0.32, h - 1.3, { color: hot ? C.char : PALE, max: 12.5 });
        });
      },
      async (d) => { // a leaning spine, the steps thrown out to both sides
        const s = page(d), n = d.steps.length, y0 = 1.18, H2 = 3.87, h = H2 / n, xtop = 5.45, xbot = 4.55;
        t.line(s, xbot, y0, xtop - xbot, H2, C.char, 4, { name: 'Spine', flipV: true });
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, cy = y + h / 2, cx = xtop + (xbot - xtop) * ((cy - y0) / H2), left = i % 2 === 0;
          para(s, cx - 0.42, cy - 0.21, 0.84, 0.42, i === n - 1 ? C.orange : C.char, 0.3);
          t.text(s, String(i + 1), { x: cx - 0.42, y: cy - 0.21, w: 0.84, h: 0.42, fontSize: 15, bold: true, italic: true, color: C.white, align: 'center', valign: 'middle' });
          const x = left ? 0.6 : cx + 0.55, w = left ? cx - 0.55 - 0.6 : 9.4 - cx - 0.55;
          head(s, st.h, x, y + 0.03, w, 0.34, { align: left ? 'right' : 'left', max: 15 });
          body(s, st.t, x, y + 0.38, w, h - 0.44, { align: left ? 'right' : 'left', max: 12.5 });
        });
      },
    ],
    stats: [
      async (d) => { // the lead figure on a slant of orange that fills half the page
        const s = bare(), [a, ...rest] = d.stats;
        footer(s, false);
        para(s, -0.9, 0, 6.4, 5.15, C.orange, 0.14);
        chip(s, 0.5, 0.42, C.char);
        big(s, a.value, 0.5, 1.2, 4.2, 1.7, { max: 76, min: 32 });
        body(s, a.label, 0.5, 3.0, 3.6, 1.0, { color: C.char, max: 16 });
        big(s, d.title, 5.5, 0.38, 3.95, 0.95, { max: 21 });
        rest.forEach((x, i) => {
          const y = 1.48 + i * 1.08;
          t.line(s, 5.3 - i * 0.14, y, 4.15 + i * 0.14, 0, C.char, 1);
          big(s, x.value, 5.3 - i * 0.14, y + 0.06, 2.0, 0.9, { color: C.orange, max: 32 });
          body(s, x.label, 7.35, y + 0.06, 2.1, 0.9, { max: 12, valign: 'middle' });
        });
        if (d.note) body(s, d.note, 4.8, 3.72, 4.65, 1.32, { max: 11, valign: 'middle' });
      },
      async (d) => { // three dark tiles leaning, stepping up
        const s = page(d), cw = 2.96, h = 1.72, k = 0.25;
        d.stats.forEach((x, i) => {
          const px = 0.45 + i * cw, y = 1.75 - i * 0.26;
          para(s, px, y, cw + 0.05, h, C.char, k / h * 1);
          big(s, x.value, px + 0.32, y + 0.08, cw - 0.56, 0.86, { color: C.orange, max: 34, min: 18 });
          body(s, x.label, px + 0.22, y + 0.95, cw - 0.56, 0.7, { color: C.white, max: 12 });
        });
        if (d.note) body(s, d.note, 0.6, 3.6, 8.8, 1.42, { max: 12, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // head on: two arrows meet in the middle, the lines run from the point outward
        const s = page(d), y = 1.18, h = 3.87;
        t.img(s, await arrow(5.1, h, C.char, false, false), 0, y, 5.1, h);
        t.img(s, await arrow(5.1, h, C.orange, true, false), 4.9, y, 5.1, h);
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.55 : 0.5, w = 3.95, align = i ? 'left' : 'right', n = side.items.length, rh = (h - 0.9) / n;
          head(s, side.h, x, y + 0.12, w, 0.58, { color: i ? C.char : C.orange, align, max: 19 });
          side.items.forEach((it, k) => body(s, it, x, y + 0.76 + k * rh, w, rh - 0.05, { color: i ? C.char : C.white, align, max: 14, valign: 'middle' }));
        });
      },
      async (d) => { // two leaning bands, one over the other, the second pushed further on
        const s = page(d), bh = 1.86;
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 0.75 : 0.3, y = 1.2 + i * (bh + 0.08), w = 8.95, f = i ? C.char : C.white, n = side.items.length, x0 = x + 2.45, cw = (x + w - 0.3 - x0) / n;
          para(s, x, y, w, bh, f, 0.14);
          head(s, side.h, x + 0.42, y + 0.1, 1.85, bh - 0.2, { color: i ? C.orange : C.char, max: 18 });
          side.items.forEach((it, k) => {
            para(s, x0 + k * cw - 0.2, y + 0.3, 0.05, bh - 0.6, C.orange, 0.5);
            body(s, it, x0 + k * cw - 0.02, y + 0.1, cw - 0.2, bh - 0.2, { color: i ? PALE : DIM, max: 13, valign: 'middle' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the dark page: words pulling a trail of speed lines
        const s = page({ title: d.title }, C.char);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.12, w: 8.8, h: 2.1, bold: true, italic: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.05, 38, 20, F.head, true, 1, true) });
        trail(s, 0.6, 3.34, 3.4);
        if (d.caption) body(s, d.caption, 4.3, 3.3, 5.1, 1.75, { color: PALE, max: 13 });
      },
      async (d) => { // a giant orange slash, the words on it; the note in the clear behind
        const s = bare();
        footer(s, false);
        para(s, -0.6, 0, 7.5, 5.15, C.orange, 0.16);
        chip(s, 0.5, 0.42, C.char);
        if (d.title) head(s, d.title, 1.5, 0.38, 3.6, 0.6, { max: 14 });
        t.text(s, L.runs(d.text), { x: 0.5, y: 1.1, w: 5.0, h: 3.9, bold: true, italic: true, color: C.char, valign: 'middle', fontSize: L.fit(d.text, 5.0, 3.8, 34, 20, F.head, true, 1, true) });
        if (d.caption) { para(s, 6.95, 1.65, 0.9, 0.09, C.char, 0.5); body(s, d.caption, 6.95, 1.85, 2.5, 3.1, { max: 12.5 }); }
      },
    ],
    timeline: [
      async (d) => { // the climb: each event a step higher up the page, an orange tread under it
        const s = page(d), dx = 2.2, dy = 0.76, w = 2.12;
        d.items.forEach((it, i) => {
          const x = 0.58 + i * dx, y = 1.12 + (3 - i) * dy, hot = i === 3;
          para(s, x, y, 1.45, 0.3, hot ? C.orange : C.char, 0.3);
          t.text(s, it.year, { x, y, w: 1.45, h: 0.3, bold: true, italic: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.15, 0.28, 13, 9.5, F.head, true, 1, true) });
          head(s, it.h, x, y + 0.32, w, 0.3, { max: 13 });
          body(s, it.t, x, y + 0.62, w, 1.02, { max: 11.5 });
          t.line(s, x - 0.04, y + 1.66, dx, 0, C.orange, 2);
          if (i) t.line(s, x - 0.04, y + 1.66, 0, dy, C.orange, 2);
        });
      },
      async (d) => { // the dark page: years on orange chips, slipping right
        const s = page(d, C.char), h = 0.87;
        d.items.forEach((it, i) => {
          const y = 1.22 + i * (h + 0.07), x = 0.5 + (3 - i) * 0.14;
          para(s, x, y + 0.08, 1.75, h - 0.16, C.orange, 0.22);
          t.text(s, it.year, { x: x + 0.1, y: y + 0.08, w: 1.55, h: h - 0.16, bold: true, italic: true, color: C.char, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.3, h - 0.25, 22, 12, F.head, true, 1, true) });
          head(s, it.h, 2.95, y, 2.1, h, { color: C.white, max: 15 });
          body(s, it.t, 5.1, y, 4.35, h, { color: PALE, max: 13, valign: 'middle' });
        });
      },
      async (d) => { // arrows in one band across the page, events above and under it
        const s = page(d), by = 2.78, bh = 0.55, cw = W / 4;
        for (let i = 0; i < 4; i++) {
          const it = d.items[i], x = i * cw;
          t.img(s, await arrow(cw + 0.2, bh, i === 3 ? C.orange : C.char, false, i > 0), x, by, Math.min(cw + 0.2, W - x), bh);
          t.text(s, it.year, { x: x + 0.25, y: by, w: cw - 0.4, h: bh, bold: true, italic: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.5, bh - 0.1, 17, 11, F.head, true, 1, true) });
          const up = i % 2 === 0, tx = i < 2 ? 0.6 : 5.2, y = up ? 1.2 : by + bh + 0.1, w = 4.2;
          head(s, it.h, tx, y, w, 0.34, { max: 15 });
          body(s, it.t, tx, y + 0.35, w, up ? 1.15 : 1.22, { max: 13 });
        }
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Dinamika', colors: { dk1: C.char, lt1: C.white, dk2: C.char2, lt2: C.light, accent1: C.orange, accent2: C.char, accent3: C.gray, accent4: 'FFB08F', accent5: C.line, accent6: 'FF8A5C', hlink: C.orange, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "harakatli, motivatsion: fe'l bilan boshlanuvchi qisqa iboralar", "limits": {}};
module.exports = { id: 29, slug: 'dinamika', name: 'Dinamika', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "bold"], "transitions": ["push:l", "p14:switch|dir=\"r\"", "zoom"], "cover": ["flyRight", "popOver"], "mark": "popOver", "deco": "flyLeft", "sig": {"title": "flyRight", "body": "slideRight", "item": "flyUp", "image": "flyLeft", "number": "popOver", "order": "cascade", "stagger": 0.08}, "tempo": 0.8, "kenburns": false};
