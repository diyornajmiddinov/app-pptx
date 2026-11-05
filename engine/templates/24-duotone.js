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
    t.text(s, M.topic || '', { x: 0.6, y: 5.2, w: 4.6, h: 0.25, fontSize: 9, bold: true, color: dark ? C.yellow : C.indigo });
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
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.7, F.body, 0.22, 4.85 - 2.25);
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.0 : 0.6, fill = i ? C.yellow : C.indigo, fg = i ? C.indigo : C.white;
        t.rect(s, x, 1.35, w, 3.65, fill, { name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: 1.55, w: w - 0.7, h: 0.5, fontSize: 20, bold: true, color: i ? C.indigo : C.yellow });
        let y = 2.25;
        side.items.forEach((it, k) => { t.text(s, it, { x: x + 0.35, y, w: w - 0.7, h: rows[k], fontSize: CFS, color: fg }); y += rows[k]; });
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
  // ---- further ways to draw a type, in flat blocks that overlap: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.indigo, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 17, 11, F.head, true), color: o.color || C.indigo, align: o.align, valign: o.valign || 'middle' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body, false, 1.2), color: o.color || C.indigo, lineSpacingMultiple: 1.2, valign: o.valign || 'top' });
  const chipAt = (s, x, y, fill = C.yellow, fg = C.indigo) => { t.rect(s, x, y, 0.62, 0.42, fill, { name: 'Chip' }); t.text(s, L.pad2(idx), { x, y, w: 0.62, h: 0.42, fontSize: 14, bold: true, color: fg, align: 'center', valign: 'middle' }); };
  const bare = (bg = C.white) => { const s = pres.addSlide(); s.background = { color: bg }; idx++; return s; };
  const V = {
    image: [
      async (d) => { // the indigo block lies over the picture and over its edge
        const s = bare();
        t.img(s, await L.photo(L.src(d.image), 6.4, H, { duo: DUO }), 3.6, 0, 6.4, H, { alt: d.title });
        t.rect(s, 0, 0.45, 5.6, 4.55, C.indigo, { name: 'Block' });
        t.rect(s, 5.2, 0.05, 0.8, 0.8, C.pink, { name: 'Square' });
        chipAt(s, 0.6, 0.7);
        head(s, d.title, 1.4, 0.6, 3.7, 0.95, { color: C.white, max: 22 });
        longText(s, d.text, 0.6, 1.65, 4.6, 3.2, { color: C.white, max: 13 });
        t.rect(s, 0, 5.1, W, 0.525, C.indigo, { name: 'Footer band' });
        footer(s, true);
      },
      async (d) => { // yellow page, a pink disc of picture running off the edge
        const s = page(d, C.yellow), dia = 3.8, x = 6.5, y = 1.2;
        t.img(s, await L.photo(L.src(d.image), dia, dia, { duo: DUO2, mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        t.rect(s, 5.75, 1.2, 0.6, 0.6, C.pink, { name: 'Square' });
        longText(s, d.text, 0.6, 1.3, 4.9, 3.75, { max: 14, valign: 'middle' });
      },
      async (d) => { // the picture as wall, a white block over a pink one
        const s = bare();
        t.img(s, await L.photo(L.src(d.image), W, H, { duo: DUO2 }), 0, 0, W, H, { alt: d.title });
        t.rect(s, 0.9, 1.65, 8.6, 3.2, C.yellow, { name: 'Under block' });
        t.rect(s, 0.6, 1.35, 8.6, 3.2, C.white, { name: 'Text block' });
        t.rect(s, 0, 5.1, W, 0.525, C.indigo, { name: 'Footer band' });
        footer(s, true);
        chipAt(s, 0.6, 0.72, C.indigo, C.yellow);
        t.rect(s, 1.22, 0.72, 8.2, 0.42, C.indigo, { name: 'Title block' });
        t.text(s, d.title, { x: 1.35, y: 0.72, w: 8.0, h: 0.42, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.4, 20, 13, F.head, true) });
        longText(s, d.text, 0.9, 1.5, 8.0, 2.9, { max: 15, valign: 'middle' });
      },
      async (d) => { // indigo page: one picture sliced into three tall bars of two inks
        const s = page(d, C.indigo), bw = 1.45, x0 = 5.15, ph = 3.5, top = [1.2, 1.5, 1.05];
        for (const [i, duo] of [DUO, DUO2, DUO].entries()) {
          const data = await L.photo(L.src(d.image), bw, ph, { duo, position: ['left', 'centre', 'right'][i] });
          t.img(s, data, x0 + i * bw, top[i], bw, ph, { alt: i ? '' : d.title });
        }
        longText(s, d.text, 0.6, 1.25, 4.2, 3.8, { color: C.white, max: 14, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // blocks of unequal width, packed like a poster
        const s = page(d), n = d.items.length, h = 1.82, g = 0.1, a = 5.3, b = 3.4, fills = [C.indigo, C.yellow, C.pink, C.indigo];
        const spots = n === 3 ? [[0.6, 1.25, a, h], [0.6 + a + g, 1.25, b, h], [0.6, 1.25 + h + g, 8.8, h]] : [[0.6, 1.25, a, h], [0.6 + a + g, 1.25, b, h], [0.6, 1.25 + h + g, b, h], [0.6 + b + g, 1.25 + h + g, a, h]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, hh] = spots[i], f = fills[i], fg = f === C.indigo ? C.white : C.indigo;
          t.rect(s, x, y, w, hh, f, { name: 'Block' });
          t.img(s, await L.icon(it.icon, f === C.indigo ? C.yellow : C.indigo, 2), x + 0.2, y + 0.2, 0.36, 0.36);
          head(s, it.h, x + 0.68, y + 0.16, w - 0.85, 0.44, { color: f === C.indigo ? C.yellow : C.indigo });
          body(s, it.t, x + 0.2, y + 0.68, w - 0.4, hh - 0.78, { color: fg, max: 13.5 });
        }
      },
      async (d) => { // numbers in heavy type, each heading under a marker stroke
        const s = page(d), n = d.items.length, h = 3.75 / n;
        d.items.forEach((it, i) => {
          const y = 1.25 + i * h, tw = Math.min(3.1, L.width(it.h, 16, F.head, true) + 0.3);
          t.text(s, L.pad2(i + 1), { x: 0.6, y, w: 1.3, h: h - 0.08, fontSize: 40, bold: true, color: i % 2 ? C.pink : C.indigo, valign: 'middle' });
          const my = y + (h - 0.08) / 2 - 0.2;
          t.rect(s, 1.95, my, tw, 0.4, C.yellow, { name: 'Marker' });
          head(s, it.h, 2.05, my, 2.95, 0.4, { max: 15 });
          body(s, it.t, 5.2, y, 4.2, h - 0.08, { max: 13.5, color: C.indigo, valign: 'middle' });
          if (i) t.line(s, 0.6, y - 0.04, 8.8, 0, C.line, 1);
        });
      },
      async (d) => { // indigo page: shapes float, none of them on one line
        const s = page(d, C.indigo), n = d.items.length, cw = 8.8 / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw, y = 1.25 + (i % 2 ? 0.45 : 0), f = i % 2 ? C.pink : C.yellow, sz = 0.92;
          if (i % 2) t.oval(s, x, y, sz, sz, f); else t.rect(s, x, y, sz, sz, f, { name: 'Square' });
          t.img(s, await L.icon(it.icon, C.indigo, 2), x + 0.26, y + 0.26, 0.4, 0.4);
          head(s, it.h, x, y + 1.0, cw - 0.25, 0.56, { color: C.white, max: 16, valign: 'top' });
          body(s, it.t, x, y + 1.56, cw - 0.25, 3.72 - (i % 2 ? 0.45 : 0) - 1.56, { color: C.soft, max: 13 });
        }
      },
      async (d) => { // a pink column carries the title, the items lie across its edge
        const s = bare(), n = d.items.length, g = 0.12, h = (4.7 - g * (n - 1)) / n;
        t.rect(s, 0, 0, 3.7, H, C.pink, { name: 'Column' });
        chipAt(s, 0.6, 0.45, C.indigo, C.yellow);
        head(s, d.title, 0.6, 1.0, 2.4, 2.8, { max: 26, valign: 'top' });
        t.text(s, M.topic || '', { x: 0.6, y: 4.75, w: 2.4, h: 0.55, fontSize: 9, bold: true, color: C.indigo, valign: 'bottom' });
        t.text(s, meta, { x: 3.2, y: 5.28, w: 6.2, h: 0.22, fontSize: 9, color: C.muted, align: 'right' });
        for (const [i, it] of d.items.entries()) {
          const y = 0.42 + i * (h + g), f = i % 2 ? C.yellow : C.indigo, fg = i % 2 ? C.indigo : C.white;
          t.rect(s, 3.2, y, 6.2, h, f, { name: 'Block' });
          t.img(s, await L.icon(it.icon, i % 2 ? C.indigo : C.yellow, 2), 3.4, y + h / 2 - 0.2, 0.4, 0.4);
          head(s, it.h, 4.0, y + 0.08, 5.2, 0.36, { color: i % 2 ? C.indigo : C.yellow, max: 15 });
          body(s, it.t, 4.0, y + 0.45, 5.2, h - 0.52, { color: fg, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // arrows pushing into one another, the words under them
        const s = page(d), n = d.steps.length, cw = 8.8 / n, fills = [C.indigo, C.pink, C.yellow, C.indigo], ah = 1.2;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * cw, f = fills[i], fg = f === C.indigo ? C.white : C.indigo, aw = cw + 0.28;
          t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(aw * 100)}" height="120"><polygon points="0,0 ${aw * 100 - 34},0 ${aw * 100},60 ${aw * 100 - 34},120 0,120${i ? ' 30,60' : ''}" fill="#${f}"/></svg>`, Math.round(aw * 100), 120), x, 1.3, Math.min(aw, 9.72 - x), ah);
          t.text(s, `${i + 1}`, { x: x + (i ? 0.38 : 0.2), y: 1.32, w: 0.6, h: 0.42, fontSize: 18, bold: true, color: f === C.yellow ? C.pink : C.yellow, valign: 'middle' });
          head(s, st.h, x + (i ? 0.38 : 0.2), 1.72, cw - (i ? 0.5 : 0.35), 0.72, { color: fg, max: 14, valign: 'top' });
          body(s, st.t, x + 0.1, 2.72, cw - 0.3, 2.35, { max: 14, color: C.indigo });
        }
      },
      async (d) => { // the staircase of flat colour
        const s = page(d), n = d.steps.length, cw = 8.8 / n, rise = n === 3 ? 0.5 : 0.36, fills = [C.yellow, C.pink, C.indigo, C.indigo];
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw, y = 1.25 + (n - 1 - i) * rise, h = 5.05 - y, f = i === n - 1 ? C.indigo : fills[i], fg = f === C.indigo ? C.white : C.indigo;
          t.rect(s, x, y, cw, h, f, { name: 'Stair' });
          t.text(s, `${i + 1}`, { x: x + 0.16, y: y + 0.04, w: 0.9, h: 0.62, fontSize: 36, bold: true, color: f === C.indigo ? C.yellow : C.indigo, valign: 'middle' });
          head(s, st.h, x + 0.16, y + 0.68, cw - 0.32, 0.55, { color: fg, max: 14, valign: 'top' });
          body(s, st.t, x + 0.16, y + 1.24, cw - 0.32, h - 1.32, { color: fg, max: 13 });
        });
      },
      async (d) => { // indigo page: bands cascade to the right, one under the other
        const s = page(d, C.indigo), n = d.steps.length, g = 0.1, h = (3.8 - g * (n - 1)) / n, dx = 0.55, w = 8.8 - dx * 3;
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * dx * (n === 3 ? 1.5 : 1), y = 1.22 + i * (h + g), f = i % 2 ? C.pink : C.yellow;
          t.rect(s, x, y, w, h, f, { name: 'Band' });
          t.rect(s, x, y, 0.62, h, C.white, { name: 'Number block' });
          t.text(s, `${i + 1}`, { x, y, w: 0.62, h, fontSize: 22, bold: true, color: C.indigo, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.76, y + 0.05, w - 0.9, 0.32, { max: 15 });
          body(s, st.t, x + 0.76, y + 0.38, w - 0.9, h - 0.42, { max: 12.5 });
        });
      },
    ],
    stats: [
      async (d) => { // yellow page: a pink disc behind the big figure, the others in indigo blocks
        const s = page(d, C.yellow), [a, ...rest] = d.stats;
        t.oval(s, 0.35, 1.05, 3.1, 3.1, C.pink, { name: 'Disc' });
        t.text(s, a.value, { x: 0.6, y: 1.8, w: 5.0, h: 1.6, bold: true, color: C.indigo, valign: 'middle', fontSize: L.fit(a.value, 5.0, 1.5, 88, 40, F.head, true) });
        body(s, a.label, 0.6, 4.2, 4.9, 0.8, { max: 15 });
        rest.forEach((x, i) => {
          const y = 1.2 + i * 1.12;
          t.rect(s, 5.9, y, 3.5, 1.02, C.indigo, { name: 'Block' });
          t.text(s, x.value, { x: 6.05, y, w: 1.7, h: 1.02, bold: true, color: C.yellow, valign: 'middle', fontSize: L.fit(x.value, 1.7, 0.95, 28, 16, F.head, true) });
          body(s, x.label, 7.8, y + 0.04, 1.5, 0.94, { color: C.white, max: 11, valign: 'middle' });
        });
        if (d.note) body(s, d.note, 5.9, 3.5, 3.5, 1.55, { max: 11, valign: 'middle' });
      },
      async (d) => { // three discs of ink lying over each other
        const s = page(d), dia = 2.75, step = 2.55, x0 = (W - dia - 2 * step) / 2, fills = [C.indigo, C.pink, C.yellow];
        d.stats.forEach((x, i) => { t.oval(s, x0 + i * step, 1.15, dia, dia, fills[i], { t: i === 1 ? 8 : 0, name: 'Disc' }); });
        d.stats.forEach((x, i) => {
          const px = x0 + i * step;
          t.text(s, x.value, { x: px + 0.3, y: 1.15 + 0.8, w: dia - 0.6, h: 1.15, bold: true, color: i ? C.indigo : C.yellow, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 0.6, 1.1, 40, 20, F.head, true) });
          body(s, x.label, px + 0.1, 3.98, step - 0.15, 0.52, { align: 'center', max: 12 });
        });
        if (d.note) body(s, d.note, 0.6, 4.5, 8.8, 0.62, { max: 10.5, color: C.muted, align: 'center', valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // two blocks offset, the right one lies over the left, the lines mirror
        const s = page(d), w = 4.9, h = 3.42;
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 4.5 : 0.6, y = i ? 1.68 : 1.2, f = i ? C.yellow : C.indigo, fg = i ? C.indigo : C.white, align = i ? 'left' : 'right', tx = i ? x + 0.5 : x + 0.15, tw = i ? 3.95 : 3.6, n = side.items.length, rh = (h - 0.95) / n;
          t.rect(s, x, y, w, h, f, { name: 'Block' });
          head(s, side.h, tx, y + 0.14, tw, 0.5, { color: i ? C.indigo : C.yellow, align, max: 20 });
          side.items.forEach((it, k) => body(s, it, tx, y + 0.7 + k * rh, tw, rh - 0.04, { color: fg, align, max: 13.5, valign: 'middle' }));
        });
        t.rect(s, 4.5, 1.2, 0.48, 0.48, C.pink, { name: 'Square' });
        t.text(s, '⇄', { x: 4.5, y: 1.2, w: 0.48, h: 0.48, fontSize: 16, bold: true, color: C.indigo, align: 'center', valign: 'middle' });
      },
      async (d) => { // two full-width bands; the headings sit in chips on the edge
        const s = page(d), bh = 1.82;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.25 + i * (bh + 0.06), f = i ? C.indigo : C.pink, fg = i ? C.white : C.indigo, n = side.items.length, x0 = 3.0, cw = (9.4 - x0) / n;
          t.rect(s, 0, y, W, bh, f, { name: 'Band' });
          t.rect(s, 0, y + 0.3, 2.75, bh - 0.6, C.yellow, { name: 'Tab' });
          head(s, side.h, 0.6, y + 0.32, 2.05, bh - 0.64, { max: 18 });
          side.items.forEach((it, k) => body(s, it, x0 + k * cw, y + 0.12, cw - 0.2, bh - 0.24, { color: fg, max: 13, valign: 'middle' }));
        });
      },
    ],
    statement: [
      async (d) => { // indigo page, yellow words; the note stands in a pink block down the side
        const s = page({ title: d.title }, C.indigo);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.25, w: 5.8, h: 3.8, bold: true, color: C.yellow, valign: 'middle', fontSize: L.fit(d.text, 5.8, 3.7, 38, 20, F.head, true) });
        if (d.caption) { t.rect(s, 6.75, 1.25, 3.25, 3.8, C.pink, { name: 'Block' }); body(s, d.caption, 6.95, 1.4, 2.8, 3.5, { max: 13, valign: 'middle' }); }
      },
      async (d) => { // a great pink disc runs off the corner, the words stand on it
        const s = pres.addSlide(); s.background = { color: C.white }; idx++;
        t.oval(s, -1.3, -0.9, 7.3, 7.3, C.pink, { name: 'Disc' });
        chipAt(s, 0.6, 0.5, C.indigo, C.yellow);
        if (d.title) t.text(s, d.title, { x: 1.4, y: 0.42, w: 3.9, h: 0.6, bold: true, color: C.indigo, valign: 'middle', fontSize: L.fit(d.title, 3.9, 0.58, 14, 10, F.head, true) });
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.2, w: 4.9, h: 3.75, bold: true, color: C.indigo, valign: 'middle', fontSize: L.fit(d.text, 4.9, 3.65, 32, 18, F.head, true) });
        t.rect(s, 6.3, 1.5, 1.2, 0.1, C.yellow, { name: 'Bar' });
        if (d.caption) body(s, d.caption, 6.3, 1.72, 3.1, 3.2, { max: 13, color: C.muted });
        t.rect(s, 0, 5.15, W, 0.475, C.indigo, { name: 'Footer band' });
        footer(s, true);
      },
    ],
    timeline: [
      async (d) => { // a thick bar through the page, events taking turns above and under it
        const s = page(d), ly = 3.16, nodes = [1.1, 3.5, 5.9, 8.3];
        t.rect(s, 0, ly - 0.08, W, 0.16, C.indigo, { name: 'Bar' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = i < 2 ? 0.6 : 5.15, y = up ? 1.22 : ly + 0.22, w = 4.25;
          t.rect(s, nodes[i], ly - 0.2, 0.4, 0.4, i % 2 ? C.pink : C.yellow, { line: { color: C.indigo, width: 2.5 }, name: 'Point' });
          t.text(s, it.year, { x, y, w: 1.65, h: 0.46, bold: true, color: i % 2 ? C.pink : C.indigo, valign: 'middle', fontSize: L.fit(it.year, 1.65, 0.44, 24, 13, F.head, true) });
          head(s, it.h, x + 1.7, y, w - 1.7, 0.46, { max: 15 });
          body(s, it.t, x, y + 0.48, w, 1.15, { max: 13, color: C.muted });
        });
      },
      async (d) => { // indigo page: a yellow tab for each year
        const s = page(d, C.indigo), h = 0.88;
        d.items.forEach((it, i) => {
          const y = 1.25 + i * (h + 0.06), f = i % 2 ? C.pink : C.yellow;
          t.rect(s, 0, y, 2.5, h, f, { name: 'Tab' });
          t.text(s, it.year, { x: 0.6, y, w: 1.8, h, bold: true, color: C.indigo, valign: 'middle', fontSize: L.fit(it.year, 1.8, h - 0.1, 26, 13, F.head, true) });
          head(s, it.h, 2.7, y, 2.2, h, { color: C.white, max: 15 });
          body(s, it.t, 5.0, y, 4.4, h, { color: C.soft, max: 13, valign: 'middle' });
        });
      },
      async (d) => { // four squares climbing, each lying on the next, the year cut large on it
        const s = page(d), w = 2.42, step = 2.13, h = 2.75, fills = [C.yellow, C.pink, C.indigo, C.yellow];
        d.items.forEach((it, i) => {
          const x = 0.6 + i * step, y = 2.3 - i * 0.35, f = fills[i], fg = f === C.indigo ? C.white : C.indigo, ww = w;
          t.rect(s, x, y, ww, h, f, { name: 'Square' });
          t.text(s, it.year, { x: x + 0.14, y: y + 0.06, w: step - 0.24, h: 0.6, bold: true, color: f === C.indigo ? C.yellow : C.indigo, valign: 'middle', fontSize: L.fit(it.year, step - 0.24, 0.56, 26, 13, F.head, true) });
          head(s, it.h, x + 0.14, y + 0.66, step - 0.28, 0.5, { color: fg, max: 14, valign: 'top' });
          body(s, it.t, x + 0.14, y + 1.16, step - 0.28, h - 1.24, { color: fg, max: 12 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Duotone', colors: { dk1: C.indigo, lt1: C.white, dk2: '2C2670', lt2: C.line, accent1: C.yellow, accent2: C.pink, accent3: C.indigo, accent4: '8F86D9', accent5: C.muted, accent6: C.soft, hlink: C.pink, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "dadil, zamonaviy va qisqa", "limits": {"image_text": 220}};
module.exports = { id: 24, slug: 'duotone', name: 'Duotone', category: 'creative', photos: true, build, style: STYLE };
