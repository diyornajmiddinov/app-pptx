/**
 * 22 Galereya — museum gallery: photos hung in black frames with white mats and drop
 * shadows, museum placards for text, Times headlines on a warm grey wall.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { wall: 'F1EFEA', frame: '262626', mat: 'FFFFFF', ink: '222222', muted: '6E6A64', green: '2F5D50', line: 'D8D4CC' };
const F = { head: 'Times New Roman', body: 'Arial' };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  let idx = 0;

  const footer = (s) => t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.6, y: 5.2, w: 8.8, h: 0.25, fontSize: 9, color: C.muted, align: 'center' });
  const framed = async (s, img, x, y, w, h, alt) => {
    t.rect(s, x, y, w, h, C.frame, { shadow: 0.25, blur: 14, offset: 5, name: 'Frame' });
    t.rect(s, x + 0.09, y + 0.09, w - 0.18, h - 0.18, C.mat, { name: 'Mat' });
    if (img) t.img(s, await L.photo(img, w - 0.6, h - 0.6), x + 0.3, y + 0.3, w - 0.6, h - 0.6, { alt });
  };
  const placard = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.mat, { line: { color: C.line, width: 0.75 }, shadow: 0.08, blur: 6, offset: 2, name: 'Placard' });
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.wall }; idx++;
    t.text(s, `${TR.no} ${L.pad2(idx)}`, { x: 0.6, y: 0.4, w: 2, h: 0.25, fontSize: 10, color: C.muted, charSpacing: 1 });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.65, w: 8.8, h: 0.75, fontFace: F.head, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.75, 30, 20, F.head) });
    footer(s);
    return s;
  };

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.wall }; idx++;
      await framed(s, L.src(d.image), 5.45, 0.55, 3.95, 4.35, d.title);
      t.text(s, [M.org, M.loc].filter(Boolean).join(', '), { x: 0.6, y: 0.6, w: 4.4, h: 0.3, fontSize: 11, color: C.muted, charSpacing: 1 });
      const fs = L.fit(d.title, 4.5, 2.1, 40, 24, F.head);
      t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.5, h: 2.25, fontFace: F.head, fontSize: fs, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 4.4, h: 0.85, fontSize: 13, color: C.muted });
      placard(s, 0.6, 4.25, 3.2, 0.75);
      t.text(s, M.author || '', { x: 0.75, y: 4.3, w: 3.0, h: 0.32, fontFace: F.head, fontSize: 14, bold: true });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 0.75, y: 4.62, w: 3.0, h: 0.28, fontSize: 10, color: C.muted });
    },
    async intro(d) {
      const s = page({});
      await framed(s, L.src(d.image), 0.6, 0.6, 3.6, 4.3, d.title);
      t.text(s, d.title, { x: 4.7, y: 0.75, w: 4.7, h: 0.8, fontFace: F.head, fontSize: 34, valign: 'middle' });
      t.line(s, 4.7, 1.65, 0.8, 0, C.green, 1.5);
      t.text(s, d.text, { x: 4.7, y: 1.9, w: 4.65, h: 3.0, fontSize: L.fit(d.text, 4.65, 3.0, 15, 11, F.body, false, 1.3), color: '3A3A3A', lineSpacingMultiple: 1.3 });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.2 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.6 + (i % per) * rh;
        placard(s, x, y, 4.2, rh - 0.2);
        t.text(s, `${TR.no} ${i + 1}`, { x: x + 0.2, y, w: 0.8, h: rh - 0.2, fontSize: 11, color: C.green, bold: true, valign: 'middle' });
        t.text(s, it, { x: x + 1.05, y, w: 3.0, h: rh - 0.2, fontFace: F.head, fontSize: 17, valign: 'middle' });
      });
    },
    async image(d) {
      const s = page({});
      await framed(s, L.src(d.image), 0.6, 0.55, 5.0, 4.45, d.title);
      placard(s, 6.0, 0.8, 3.4, 4.0);
      t.text(s, d.title, { x: 6.2, y: 0.95, w: 3.0, h: 0.9, fontFace: F.head, fontSize: L.fit(d.title, 3.0, 0.85, 20, 13, F.head, true), bold: true, valign: 'bottom' });
      t.line(s, 6.2, 1.95, 0.5, 0, C.green, 1.25);
      t.text(s, d.text, { x: 6.2, y: 2.1, w: 3.0, h: 2.6, fontSize: L.fit(d.text, 3.0, 2.6, 13, 10, F.body, false, 1.2), color: '3A3A3A', lineSpacingMultiple: 1.2 });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.3, 1.2 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.4);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * (w + gap);
        placard(s, x, 1.65, w, h);
        t.text(s, `${TR.no} ${i + 1}`, { x: x + 0.25, y: 1.8, w: 1, h: 0.25, fontSize: 10, bold: true, color: C.green });
        t.text(s, it.h, { x: x + 0.25, y: 2.1, w: w - 0.5, h: 0.5, fontFace: F.head, fontSize: L.fit(it.h, w - 0.5, 0.5, 19, 13, F.head, true), bold: true });
        t.text(s, it.t, { x: x + 0.25, y: 2.65, w: w - 0.5, h: h - 1.1, fontSize: 14, color: C.muted });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n;
      t.line(s, 0.6, 1.9, 8.8, 0, C.line, 1);
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * (w + gap);
        t.rect(s, x + w / 2 - 0.05, 1.85, 0.1, 0.1, C.frame, { name: 'Nail' });
        placard(s, x, 2.15, w, 2.7);
        t.text(s, TR.step(i + 1), { x: x + 0.2, y: 2.3, w: w - 0.4, h: 0.25, fontSize: 10, bold: true, color: C.green });
        const hfs = Math.min(...d.steps.map((q) => L.fit(q.h, w - 0.4, 0.75, 17, 12, F.head, true)));
        const hh = Math.max(...d.steps.map((q) => L.height(q.h, hfs, w - 0.4, F.head, true)));
        t.text(s, st.h, { x: x + 0.2, y: 2.6, w: w - 0.4, h: hh + 0.05, fontFace: F.head, fontSize: hfs, bold: true });
        t.text(s, st.t, { x: x + 0.2, y: 2.75 + hh, w: w - 0.4, h: 2.0 - hh, fontSize: 13, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.45, w = (8.8 - gap * (n - 1)) / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * (w + gap);
        await framed(s, null, px, 1.6, w, 1.75);
        t.text(s, x.value, { x: px + 0.3, y: 1.7, w: w - 0.6, h: 1.55, fontFace: F.head, fontSize: L.fit(x.value, w - 0.7, 1.0, 54, 26, F.head), align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.55, w, h: 0.8, fontSize: 13, color: C.muted, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.4, fontSize: 10, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.2, h = 3.35;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.6, F.body, 0.2, 4.85 - 2.4);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4);
        placard(s, x, 1.6, w, h);
        t.text(s, side.h, { x: x + 0.3, y: 1.75, w: w - 0.6, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: i ? C.green : C.ink });
        let y = 2.4;
        side.items.forEach((it, k) => { t.line(s, x + 0.3, y, w - 0.6, 0, C.line, 0.5); t.text(s, it, { x: x + 0.3, y: y + 0.08, w: w - 0.6, h: rows[k] - 0.08, fontSize: CFS }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page({});
      await framed(s, null, 1.2, 0.75, 7.6, 3.1);
      const fs = L.fit(d.text, 6.4, 2.0, 34, 20, F.head, false, 1, true);
      t.text(s, L.runs(d.text), { x: 1.8, y: 0.95, w: 6.4, h: 2.7, fontFace: F.head, italic: true, fontSize: fs, align: 'center', valign: 'middle' });
      placard(s, 1.6, 4.05, 6.8, 1.0);
      t.text(s, d.title, { x: 1.8, y: 4.1, w: 6.4, h: 0.3, fontFace: F.head, bold: true, fontSize: 13 });
      if (d.caption) t.text(s, d.caption, { x: 1.8, y: 4.4, w: 6.4, h: 0.6, fontSize: L.fit(d.caption, 6.4, 0.6, 12, 9, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      t.line(s, 0.6, 2.35, 8.8, 0, C.frame, 1);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.6, w: cw - 0.2, h: 0.6, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.55, 28, 14, F.head), valign: 'bottom', color: C.green });
        t.rect(s, x, 2.27, 0.16, 0.16, C.frame, { name: 'Nail' });
        t.text(s, it.h, { x, y: 2.65, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 17, bold: true });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.3, h: 1.8, fontSize: 13, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      await framed(s, null, 1.4, 0.7, 7.2, 3.2);
      const fs = L.fit(d.text, 6.0, 2.3, 32, 18, F.head, false, 1, true);
      t.text(s, d.text, { x: 2.0, y: 0.95, w: 6.0, h: 2.7, fontFace: F.head, italic: true, fontSize: fs, align: 'center', valign: 'middle' });
      if (d.author) { placard(s, 3.2, 4.15, 3.6, 0.55); t.text(s, d.author, { x: 3.3, y: 4.15, w: 3.4, h: 0.55, fontSize: 11, color: C.muted, align: 'center', valign: 'middle' }); }
    },
    async sources(d) {
      const s = page(d), n = d.items.length;
      placard(s, 0.6, 1.55, 8.8, 3.45);
      const rh = Math.min(0.52, 3.1 / n);
      d.items.forEach((it, i) => {
        const y = 1.72 + i * rh;
        t.text(s, `${i + 1}.`, { x: 0.85, y, w: 0.4, h: rh, fontFace: F.head, fontSize: 13, bold: true, color: C.green, valign: 'middle' });
        t.text(s, it, { x: 1.3, y, w: 7.85, h: rh, fontSize: L.fit(it, 7.85, rh - 0.02, 13, 10, F.body), valign: 'middle' });
      });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.wall }; idx++;
      await framed(s, L.src(d.image), 0.6, 0.55, 4.6, 4.35, d.title);
      const fs = L.fit(d.title, 3.9, 1.8, 36, 22, F.head);
      t.text(s, d.title, { x: 5.6, y: 0.9, w: 3.9, h: 2.0, fontFace: F.head, fontSize: fs, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 5.6, y: 3.0, w: 3.8, h: 0.6, fontSize: 13, color: C.muted });
      placard(s, 5.6, 3.9, 3.8, 0.85);
      t.text(s, M.author || '', { x: 5.75, y: 3.95, w: 3.5, h: 0.35, fontFace: F.head, fontSize: 14, bold: true });
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 5.75, y: 4.3, w: 3.5, h: 0.3, fontSize: 10, color: C.muted });
      footer(s);
    },
  };
  // ---- further ways to draw a type, all in the museum: a deck's pages must not look alike (L.pages)
  const NIGHT = '1D1C1A', GLOW = 'D9D4C9';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 18, 12, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body, false, 1.2), color: o.color || '3A3A3A', lineSpacingMultiple: 1.2, valign: o.valign || 'top' });
  // the room with the lights turned down
  const nightPage = (d) => {
    const s = pres.addSlide(); s.background = { color: NIGHT }; idx++;
    t.text(s, `${TR.no} ${L.pad2(idx)}`, { x: 0.6, y: 0.4, w: 2, h: 0.25, fontSize: 10, color: GLOW, charSpacing: 1 });
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.65, w: 8.8, h: 0.75, fontFace: F.head, color: C.mat, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.75, 30, 20, F.head) });
    t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.6, y: 5.2, w: 8.8, h: 0.25, fontSize: 9, color: GLOW, align: 'center' });
    return s;
  };
  // a cone of light from a ceiling lamp
  const beam = (w, h, op = 0.34) => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * 100}" height="${h * 100}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4D8" stop-opacity="${op}"/><stop offset="1" stop-color="#FFF4D8" stop-opacity="0.04"/></linearGradient></defs><polygon points="${w * 42},0 ${w * 58},0 ${w * 100},${h * 100} 0,${h * 100}" fill="url(#g)"/></svg>`, w * 100, h * 100);
  const hook = (s, x, y) => t.rect(s, x - 0.05, y - 0.05, 0.1, 0.1, C.frame, { name: 'Nail' });
  const V = {
    image: [
      async (d) => { // a long landscape over a wide placard
        const s = page(d);
        await framed(s, L.src(d.image), 0.6, 1.42, 8.8, 2.2, d.title);
        placard(s, 0.6, 3.76, 8.8, 1.32);
        t.line(s, 0.8, 3.92, 0, 1.0, C.green, 1.5);
        longText(s, d.text, 0.98, 3.84, 8.25, 1.16, { valign: 'middle', max: 13 });
      },
      async (d) => { // the dark room: one picture under the lamp, the words on the wall beside it
        const s = nightPage(d);
        t.img(s, await beam(4.9, 3.7), 4.75, 1.42, 4.9, 3.7);
        await framed(s, L.src(d.image), 5.45, 1.75, 3.55, 3.2, d.title);
        t.line(s, 0.6, 1.62, 0.8, 0, GLOW, 1.5);
        longText(s, d.text, 0.6, 1.78, 4.4, 3.25, { color: 'EDE9E0', max: 14 });
      },
      async (d) => { // a cameo in an oval frame
        const s = page({}), w = 3.5, h = 4.3, x = 0.75, y = 0.55;
        t.oval(s, x, y, w, h, C.frame, { name: 'Oval frame' });
        t.oval(s, x + 0.1, y + 0.1, w - 0.2, h - 0.2, C.mat, { name: 'Oval mat' });
        t.img(s, await L.photo(L.src(d.image), w - 0.6, h - 0.6, { mask: 'circle' }), x + 0.3, y + 0.3, w - 0.6, h - 0.6, { alt: d.title });
        t.text(s, d.title, { x: 4.8, y: 0.65, w: 4.6, h: 1.15, fontFace: F.head, color: C.ink, valign: 'bottom', fontSize: L.fit(d.title, 4.6, 1.1, 30, 18, F.head) });
        t.line(s, 4.8, 1.92, 0.8, 0, C.green, 1.5);
        longText(s, d.text, 4.8, 2.08, 4.6, 2.9);
      },
      async (d) => { // the mural: the whole wall is the picture, a placard screwed to it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: d.title });
        t.rect(s, 0, 5.12, W, 0.51, C.wall, { name: 'Skirting' });
        footer(s);
        placard(s, 0.6, 0.55, 4.6, 4.25);
        for (const [a, b] of [[0.72, 0.67], [5.0, 0.67], [0.72, 4.6], [5.0, 4.6]]) t.oval(s, a, b, 0.08, 0.08, C.line, { name: 'Screw' });
        t.text(s, `${TR.no} ${L.pad2(idx)}`, { x: 0.95, y: 0.72, w: 2, h: 0.25, fontSize: 10, color: C.green, bold: true, charSpacing: 1 });
        head(s, d.title, 0.95, 1.0, 3.9, 0.95, { max: 22, valign: 'middle' });
        t.line(s, 0.95, 2.0, 0.6, 0, C.green, 1.25);
        longText(s, d.text, 0.95, 2.12, 3.9, 2.5, { max: 13 });
      },
    ],
    cards: [
      async (d) => { // labels hung from one rail on wires of different lengths
        const s = page(d), n = d.items.length, gap = 0.22, w = (8.8 - gap * (n - 1)) / n, rail = 1.5, h = n === 3 ? 2.75 : 2.95;
        t.rect(s, 0, rail - 0.03, W, 0.06, C.frame, { name: 'Rail' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), y = rail + (i % 2 ? 0.55 : 0.25), cx = x + w / 2;
          t.line(s, cx - 0.5, rail, 0.5, y - rail, C.muted, 0.75, { name: 'Wire', flipV: true });
          t.line(s, cx, rail, 0.5, y - rail, C.muted, 0.75, { name: 'Wire' });
          placard(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.green, 2), x + 0.16, y + 0.16, 0.32, 0.32);
          head(s, it.h, x + 0.16, y + 0.54, w - 0.32, 0.56, { max: 15 });
          body(s, it.t, x + 0.16, y + 1.12, w - 0.32, h - 1.22, { max: 12.5, color: '4A4640' });
        }
      },
      async (d) => { // four framed works, the sign in the middle of each mat
        const s = page(d), n = d.items.length, w = 4.3, h = 1.68;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.45 + Math.floor(i / 2) * (h + 0.14);
          await framed(s, null, x, y, ww, h);
          t.oval(s, x + 0.25, y + 0.25, 0.56, 0.56, C.green);
          t.img(s, await L.icon(it.icon, C.mat, 2), x + 0.39, y + 0.39, 0.28, 0.28);
          head(s, it.h, x + 0.95, y + 0.17, ww - 1.2, 0.42, { max: 16, valign: 'middle' });
          body(s, it.t, x + 0.95, y + 0.6, ww - 1.2, h - 0.74, { max: 12.5, color: '4A4640' });
        }
      },
      async (d) => { // the catalogue: one long sheet, a line for each work
        const s = page(d), n = d.items.length, y0 = 1.5, hh = 3.55, h = (hh - 0.1) / n;
        placard(s, 0.6, y0, 8.8, hh);
        t.rect(s, 0.6, y0, 1.25, hh, C.green, { name: 'Catalogue spine' });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + 0.05 + i * h;
          t.text(s, `${TR.no} ${i + 1}`, { x: 0.6, y, w: 1.25, h, fontSize: 12, bold: true, color: C.mat, align: 'center', valign: 'middle' });
          if (i) { t.line(s, 2.05, y, 7.15, 0, C.line, 0.75); t.line(s, 0.75, y, 0.95, 0, C.mat, 0.5); }
          t.img(s, await L.icon(it.icon, C.green, 2), 2.05, y + h / 2 - 0.15, 0.3, 0.3);
          head(s, it.h, 2.5, y + 0.05, 2.3, h - 0.1, { max: 16, valign: 'middle' });
          body(s, it.t, 4.9, y + 0.05, 4.3, h - 0.1, { max: 13, valign: 'middle', color: '4A4640' });
        }
      },
      async (d) => { // the sculpture hall by night: icons under lamps, the words on white plinths
        const s = nightPage(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n, img = await beam(w, 1.2, 0.3);
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), top = 2.5 + (i % 2 ? 0.2 : 0), h = 5.08 - top;
          t.img(s, img, x, top - 1.05, w, 1.05);
          t.img(s, await L.icon(it.icon, 'FFF4D8', 1.75), x + w / 2 - 0.25, top - 0.62, 0.5, 0.5);
          t.rect(s, x - 0.06, top, w + 0.12, 0.09, C.line, { name: 'Plinth cap' });
          t.rect(s, x, top + 0.09, w, h - 0.09, C.mat, { name: 'Plinth' });
          head(s, it.h, x + 0.14, top + 0.17, w - 0.28, 0.5, { max: 14, align: 'center', valign: 'middle' });
          body(s, it.t, x + 0.14, top + 0.7, w - 0.28, h - 0.76, { max: 12, align: 'center', color: '4A4640' });
        }
      },
    ],
    process: [
      async (d) => { // the floor plan: rooms with doors, the visitor's route through them
        const s = page(d), n = d.steps.length, w = 4.3, h = 1.68, x0 = 0.6, y0 = 1.45;
        const box = (i) => { const wide = n === 3 && i === 2; return { x: wide ? x0 : x0 + (i % 2) * (w + 0.2), y: y0 + Math.floor(i / 2) * (h + 0.16), w: wide ? 8.8 : w }; };
        d.steps.forEach((st, i) => {
          const b = box(i);
          t.rect(s, b.x, b.y, b.w, h, C.mat, { line: { color: C.frame, width: 3 }, name: 'Room' });
          t.oval(s, b.x + 0.16, b.y + 0.16, 0.5, 0.5, C.green);
          t.text(s, `${i + 1}`, { x: b.x + 0.16, y: b.y + 0.16, w: 0.5, h: 0.5, fontFace: F.head, fontSize: 18, bold: true, color: C.mat, align: 'center', valign: 'middle' });
          head(s, st.h, b.x + 0.8, b.y + 0.14, b.w - 1.0, 0.42, { max: 16, valign: 'middle' });
          body(s, st.t, b.x + 0.8, b.y + 0.58, b.w - 1.0, h - 0.68, { max: 12.5, color: '4A4640' });
        });
        // the doors: gaps in the walls, the path passes through them
        const door = (x, y, a) => { t.oval(s, x - 0.17, y - 0.17, 0.34, 0.34, C.wall, { line: { color: C.green, width: 1.25 } }); t.text(s, a, { x: x - 0.17, y: y - 0.17, w: 0.34, h: 0.34, fontSize: 13, bold: true, color: C.green, align: 'center', valign: 'middle' }); };
        door(5, y0 + h / 2, '→');
        if (n === 3) door(5, y0 + h + 0.08, '↓');
        else { door(7.2, y0 + h + 0.08, '↓'); door(5, y0 + h * 1.5 + 0.16, '←'); }
      },
      async (d) => { // the grand staircase: placards climb its landings
        const s = page(d), n = d.steps.length, cw = 8.8 / n, rise = n === 3 ? 0.5 : 0.36, base = 5.08, ch = 1.92;
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw, y = 1.5 + (n - 1 - i) * rise;
          t.rect(s, x, y + ch, cw, base - y - ch + 0.001, C.frame, { name: 'Stair' });
          placard(s, x + 0.05, y, cw - 0.1, ch);
          t.text(s, TR.step(i + 1), { x: x + 0.18, y: y + 0.08, w: cw - 0.36, h: 0.24, fontSize: 10, bold: true, color: C.green });
          head(s, st.h, x + 0.18, y + 0.32, cw - 0.36, 0.5, { max: 14 });
          body(s, st.t, x + 0.18, y + 0.82, cw - 0.36, ch - 0.88, { max: 12, color: '4A4640' });
        });
      },
      async (d) => { // the title hangs alone in a big frame, the route runs down beside it
        const s = page({}), n = d.steps.length, h = 4.35 / n;
        await framed(s, null, 0.6, 0.7, 3.2, 4.2);
        head(s, d.title, 0.95, 1.05, 2.5, 3.5, { max: 26, valign: 'middle', align: 'center' });
        t.line(s, 4.3, 0.75, 0, 4.35 - h + 0.15, C.frame, 1);
        d.steps.forEach((st, i) => {
          const y = 0.62 + i * h;
          t.rect(s, 4.2, y + 0.12, 0.2, 0.2, C.frame, { name: 'Nail' });
          t.text(s, TR.step(i + 1), { x: 4.65, y: y, w: 1.5, h: 0.22, fontSize: 10, bold: true, color: C.green });
          head(s, st.h, 4.65, y + 0.22, 4.75, 0.34, { max: 16, valign: 'middle' });
          body(s, st.t, 4.65, y + 0.57, 4.75, h - 0.62, { max: 13, color: '4A4640' });
        });
      },
      async (d) => { // the audio guide: numbered stops along a band of parquet
        const s = page(d), n = d.steps.length, cw = 8.8 / n, dia = 0.92;
        t.rect(s, 0, 1.78, W, 0.26, C.line, { name: 'Parquet' });
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw, cx = x + cw / 2 - 0.08;
          t.oval(s, cx - dia / 2, 1.45, dia, dia, C.frame, { line: { color: C.wall, width: 4 } });
          t.text(s, `${i + 1}`, { x: cx - dia / 2, y: 1.45, w: dia, h: dia, fontFace: F.head, fontSize: 32, color: C.mat, align: 'center', valign: 'middle' });
          head(s, st.h, x, 2.5, cw - 0.16, 0.56, { max: 16, align: 'center', valign: 'middle' });
          body(s, st.t, x, 3.1, cw - 0.16, 1.95, { max: 13, align: 'center', color: '4A4640' });
        });
      },
    ],
    stats: [
      async (d) => { // the masterpiece and two small studies beside it
        const s = page(d), [a, ...rest] = d.stats;
        await framed(s, null, 0.6, 1.45, 4.5, 2.5);
        t.text(s, a.value, { x: 0.9, y: 1.6, w: 3.9, h: 2.2, fontFace: F.head, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.9, 2.0, 72, 34, F.head) });
        placard(s, 0.6, 4.08, 4.5, 0.98);
        body(s, a.label, 0.8, 4.12, 4.1, 0.9, { max: 13, valign: 'middle', align: 'center', color: '3A3A3A' });
        for (const [i, x] of rest.entries()) {
          const y = 1.45 + i * 1.12;
          await framed(s, null, 5.4, y, 1.75, 1.0);
          t.text(s, x.value, { x: 5.55, y: y + 0.12, w: 1.45, h: 0.76, fontFace: F.head, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 1.45, 0.7, 26, 14, F.head) });
          body(s, x.label, 7.3, y, 2.1, 1.0, { max: 12, valign: 'middle', color: '3A3A3A' });
        }
        if (d.note) body(s, d.note, 5.4, 3.72, 4.0, 1.34, { max: 11, valign: 'bottom' });
      },
      async (d) => { // three figures picked out by three lamps
        const s = nightPage(d), cw = 8.8 / 3, img = await beam(cw, 2.5);
        d.stats.forEach((x, i) => {
          const px = 0.6 + i * cw;
          t.img(s, img, px, 1.35, cw, 2.5);
          t.oval(s, px + cw / 2 - 0.08, 1.3, 0.16, 0.1, 'FFF4D8', { name: 'Lamp' });
          t.text(s, x.value, { x: px + 0.15, y: 2.25, w: cw - 0.3, h: 1.05, fontFace: F.head, color: C.mat, align: 'center', valign: 'middle', fontSize: L.fit(x.value, cw - 0.3, 1.0, 50, 24, F.head) });
          t.text(s, x.label, { x: px + 0.15, y: 3.38, w: cw - 0.3, h: 0.6, fontSize: 12, color: GLOW, align: 'center' });
        });
        if (d.note) body(s, d.note, 0.6, 4.1, 8.8, 0.95, { max: 11, align: 'center', color: GLOW, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // a diptych: two panels on one hinge, the lines mirror each other
        const s = page(d), x = 0.6, y = 1.45, w = 8.8, h = 3.6;
        t.rect(s, x, y, w, h, C.frame, { shadow: 0.25, blur: 14, offset: 5, name: 'Frame' });
        [d.left, d.right].forEach((side, i) => {
          const px = x + 0.1 + i * 4.35, pw = 4.25, align = i ? 'left' : 'right', tx = px + 0.3, tw = pw - 0.6;
          t.rect(s, px, y + 0.1, pw, h - 0.2, C.mat, { name: 'Panel' });
          head(s, side.h, tx, y + 0.2, tw, 0.52, { max: 20, align, valign: 'middle', color: i ? C.green : C.ink });
          t.line(s, tx, y + 0.76, tw, 0, C.line, 0.75);
          const n = side.items.length, rh = (h - 1.05) / n;
          side.items.forEach((it, k) => body(s, it, tx, y + 0.84 + k * rh, tw, rh - 0.04, { max: 13, align, valign: 'middle', color: '3A3A3A' }));
        });
        for (const py of [y + 0.5, y + h - 0.7]) t.rect(s, 4.93, py, 0.14, 0.2, 'B59A5B', { name: 'Hinge' });
      },
      async (d) => { // two long wall labels, one over the other, one of them in the museum's green
        const s = page(d), bh = 1.72;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.45 + i * (bh + 0.14), n = side.items.length, x0 = 2.9, cw = (9.3 - x0) / n, dark = i === 1;
          if (dark) t.rect(s, 0.6, y, 8.8, bh, C.green, { shadow: 0.12, name: 'Band' }); else placard(s, 0.6, y, 8.8, bh);
          head(s, side.h, 0.85, y + 0.1, 1.9, bh - 0.2, { max: 20, valign: 'middle', color: dark ? C.mat : C.ink });
          side.items.forEach((it, k) => {
            t.line(s, x0 + k * cw - 0.08, y + 0.22, 0, bh - 0.44, dark ? '6F9C8C' : C.line, 0.75);
            body(s, it, x0 + k * cw + 0.04, y + 0.1, cw - 0.2, bh - 0.2, { max: 13, valign: 'middle', color: dark ? C.mat : '3A3A3A' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // words on the far wall of the dark room, under one lamp; the small label stays in the shade
        const s = nightPage({}), img = await beam(6.4, 4.6, 0.26);
        t.img(s, img, 3.3, 0.45, 6.4, 4.6);
        t.oval(s, 6.2, 0.4, 0.6, 0.12, 'FFF4D8', { name: 'Lamp' });
        t.text(s, L.runs(d.text), { x: 3.9, y: 1.0, w: 5.2, h: 3.95, fontFace: F.head, italic: true, color: C.mat, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 5.2, 3.85, 34, 20, F.head, false, 1, true) });
        t.line(s, 0.6, 0.95, 0.7, 0, 'FFF4D8', 1.25);
        if (d.title) t.text(s, d.title, { x: 0.6, y: 1.05, w: 2.6, h: 1.0, fontFace: F.head, bold: true, color: 'FFF4D8', fontSize: L.fit(d.title, 2.6, 1.0, 16, 11, F.head, true) });
        if (d.caption) body(s, d.caption, 0.6, 2.1, 2.6, 2.9, { max: 12.5, color: GLOW });
      },
      async (d) => { // the exhibition's opening text, cut large on the wall itself, a small label at its foot
        const s = page(d);
        t.rect(s, 0.6, 1.5, 0.09, 3.5, C.green, { name: 'Rule' });
        t.text(s, L.runs(d.text), { x: 0.95, y: 1.5, w: 5.3, h: 3.5, fontFace: F.head, valign: 'middle', fontSize: L.fit(d.text, 5.3, 3.45, 34, 20, F.head) });
        if (d.caption) { placard(s, 6.55, 2.1, 2.85, 2.9); hook(s, 7.97, 1.95); body(s, d.caption, 6.72, 2.2, 2.52, 2.7, { max: 12.5, valign: 'middle', color: '3A3A3A' }); }
      },
    ],
    timeline: [
      async (d) => { // a central aisle: years down the middle, events to left and right
        const s = page(d), h = 0.84, top = 1.42;
        t.rect(s, 4.97, top, 0.06, 3.5, C.frame, { name: 'Aisle' });
        d.items.forEach((it, i) => {
          const y = top + i * h + 0.02, left = i % 2 === 0, cw = 3.9, x = left ? 0.6 : 5.5, align = left ? 'right' : 'left', ph = 1.14;
          t.rect(s, 4.45, y + 0.16, 1.1, 0.48, C.frame, { name: 'Year frame' });
          t.rect(s, 4.5, y + 0.21, 1.0, 0.38, C.mat, { name: 'Year mat' });
          t.text(s, it.year, { x: 4.5, y: y + 0.21, w: 1.0, h: 0.38, fontFace: F.head, bold: true, color: C.green, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 0.94, 0.36, 15, 9, F.head, true) });
          placard(s, x, y, cw, ph);
          head(s, it.h, x + 0.12, y + 0.04, cw - 0.24, 0.3, { max: 14, align, valign: 'middle' });
          body(s, it.t, x + 0.12, y + 0.34, cw - 0.24, ph - 0.38, { max: 11, align, color: '4A4640' });
        });
      },
      async (d) => { // the archive after dark: a lit year at the head of each line
        const s = nightPage(d), h = 0.88;
        d.items.forEach((it, i) => {
          const y = 1.46 + i * h;
          if (i) t.line(s, 0.6, y - 0.02, 8.8, 0, '45423D', 0.75);
          t.text(s, it.year, { x: 0.6, y, w: 2.0, h: h - 0.06, fontFace: F.head, color: 'FFF4D8', valign: 'middle', fontSize: L.fit(it.year, 2.0, h - 0.1, 30, 15, F.head) });
          head(s, it.h, 2.75, y, 2.2, h - 0.06, { color: C.mat, max: 16, valign: 'middle' });
          body(s, it.t, 5.05, y, 4.35, h - 0.06, { color: GLOW, max: 13, valign: 'middle' });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.process = V.process.shift(); // the old one read as the cards page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Galereya', colors: { dk1: C.ink, lt1: C.mat, dk2: C.frame, lt2: C.wall, accent1: C.green, accent2: C.frame, accent3: C.muted, accent4: '6F9C8C', accent5: C.line, accent6: 'C2B8A3', hlink: C.green, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "muzey yorlig'i uslubi: qisqa, nafis izohlar", "limits": {"image_text": 220}, "prefer": "visual"};
module.exports = { id: 22, slug: 'galereya', name: 'Galereya', category: 'academic', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["p14:gallery|dir=\"r\"", "dissolve", "morph"], "cover": ["focusIn", "fadeWords"], "mark": "fade", "deco": "wipe:d", "sig": {"title": "fadeUp", "body": "fade", "item": ["fadeUp", "fadeDown"], "image": "circle", "number": "focusIn", "order": "alternate", "stagger": 0.2}, "tempo": 1.15, "kenburns": true};
