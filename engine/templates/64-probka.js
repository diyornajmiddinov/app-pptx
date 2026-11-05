/**
 * 64 Probka — cork pin board: index cards and polaroids pinned with coloured push-pins,
 * red string linking ideas like an investigation board, paper strips for titles.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { cork: 'C59B63', ink: '2A2A2A', muted: '5E5A54', card: 'FFFDF7', yellow: 'FFF3A6', string: 'C62828', pins: ['E53935', '1E88E5', 'FDD835', '43A047', '8E24AA', 'FB8C00'] };
const F = { head: 'Arial', body: 'Calibri' };

const corkSvg = () => { let d = '', x = 3; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 2600; i++) d += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="${(1 + rnd() * 3).toFixed(1)}" fill="#${rnd() > 0.5 ? '9E7340' : 'E0BC86'}" opacity="${(0.35 + rnd() * 0.5).toFixed(2)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.cork}"/>${d}<rect width="1600" height="900" fill="none" stroke="#7A5530" stroke-width="28"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(corkSvg(), 1600, 900, true);
  const pin = (s, cx, cy, k) => { t.oval(s, cx - 0.11, cy - 0.11, 0.22, 0.22, C.pins[k % 6], { line: { color: '00000033'.slice(0, 6), width: 0.5 } }); t.oval(s, cx - 0.06, cy - 0.08, 0.07, 0.06, 'FFFFFF'); };
  // paper card: slightly rotated paper (text stays straight so it can auto-fit), a pin at the top
  const card = (s, x, y, w, h, k, fill = C.card, rot = 0) => { t.rect(s, x, y, w, h, fill, { rotate: rot, shadow: 0.35, blur: 6, offset: 3, name: 'Card' }); pin(s, x + w / 2, y + 0.12, k); };
  const strings = (s, pts) => { for (let i = 1; i < pts.length; i++) { const [a, b] = pts[i - 1], [c, d] = pts[i]; s.addShape(t.S.LINE, { x: Math.min(a, c), y: Math.min(b, d), w: Math.abs(c - a) || 0.001, h: Math.abs(d - b) || 0.001, flipV: (c - a) * (d - b) < 0, line: { color: C.string, width: 1.5 }, objectName: 'String' }); } };
  const polaroid = async (s, src, x, y, w, h, k, rot = 0) => { t.rect(s, x, y, w, h, 'FFFFFF', { rotate: rot, shadow: 0.35, blur: 6, offset: 3, name: 'Polaroid' }); t.img(s, await L.photo(L.src(src), w - 0.24, h - 0.62), x + 0.12, y + 0.14, w - 0.24, h - 0.62, { alt: '' }); pin(s, x + w / 2, y + 0.1, k); };
  const strip = (s, txt, x, y, w, h, fs) => { t.rect(s, x, y, w, h, C.card, { shadow: 0.3, blur: 5, offset: 2, name: 'Title strip' }); pin(s, x + 0.2, y + h / 2, 0); t.text(s, txt, { x: x + 0.45, y, w: w - 0.6, h, bold: true, fontSize: fs, color: C.ink, valign: 'middle' }); };
  const footer = (s) => { t.rect(s, 0.35, 5.2, 9.3, 0.28, C.card, { t: 15, name: 'Label' }); t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.45, y: 5.2, w: 9.1, h: 0.28, fontSize: 8.5, color: C.muted, valign: 'middle' }); };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.title) strip(s, d.title, 0.4, 0.3, Math.min(8.0, L.width(d.title, 24, F.head, true) + 1.0), 0.75, L.fit(d.title, 7.3, 0.7, 24, 14, F.head, true));
    card(s, 8.75, 0.3, 0.85, 0.75, idx, C.yellow);
    t.text(s, String(idx), { x: 8.75, y: 0.38, w: 0.85, h: 0.67, fontSize: 20, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    footer(s);
    return s;
  };
  const note = (s, txt, x, y, w, h, k, fill = C.card) => { card(s, x, y, w, h, k, fill); t.text(s, txt, { x: x + 0.2, y: y + 0.3, w: w - 0.4, h: h - 0.4, fontSize: L.fit(txt, w - 0.4, h - 0.4, 15, 10, F.body, false, 1.25), color: C.ink, valign: 'middle', lineSpacingMultiple: 1.25 }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.image) await polaroid(s, d.image, 6.3, 0.5, 3.1, 3.3, 1, 3);
    card(s, 0.6, 0.6, 5.3, 3.1, 0);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.85, y: 0.85, w: 4.8, h: 0.3, fontSize: 11, bold: true, color: C.string });
    t.text(s, d.title, { x: 0.85, y: 1.15, w: 4.8, h: 1.85, bold: true, fontSize: L.fit(d.title, 4.8, 1.8, 36, 18, F.head, true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.0, w: 4.8, h: 0.6, fontSize: 12, color: C.muted });
    card(s, 1.2, 4.0, 3.8, 0.8, 3, C.yellow);
    t.text(s, M.author || '', { x: 1.3, y: 4.15, w: 3.6, h: 0.6, fontSize: 15, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await polaroid(s, d.image, 0.6, 1.35, 3.6, 3.65, 1, -2); note(s, d.text, 4.6, 1.35, 4.9, 3.65, 2); strings(s, [[2.4, 1.45], [7.05, 1.47]]); },
    async image(d) { const s = page(d); note(s, d.text, 0.45, 1.35, 4.9, 3.65, 3); await polaroid(s, d.image, 5.75, 1.35, 3.6, 3.65, 4, 2); strings(s, [[2.9, 1.47], [7.55, 1.45]]); },
    async agenda(d) {
      const s = page(d), n = d.items.length, cols = 3, rws = Math.ceil(n / cols), w = 2.85, h = (3.65 - 0.2 * (rws - 1)) / rws;
      const pts = [];
      d.items.forEach((it, i) => {
        const x = 0.55 + (i % cols) * (w + 0.2), y = 1.35 + Math.floor(i / cols) * (h + 0.2);
        card(s, x, y, w, h, i, i % 2 ? C.yellow : C.card); (pts[Math.floor(i / cols)] ??= []).push([x + w / 2, y + 0.12]);
        t.text(s, `${i + 1}`, { x: x + 0.15, y: y + 0.25, w: 0.5, h: h - 0.35, fontSize: 26, bold: true, color: C.string, valign: 'middle' });
        t.text(s, it, { x: x + 0.7, y: y + 0.25, w: w - 0.85, h: h - 0.35, fontSize: 15, bold: true, color: C.ink, valign: 'middle' });
      });
      pts.forEach((row) => strings(s, row)); // string runs along each row of cards, never across the text
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (9.0 - gap * (n - 1)) / n, pts = [];
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap), y = 1.35 + (i % 2) * 0.15;
        card(s, x, y, w, 3.5, i, i % 2 ? C.yellow : C.card, i % 2 ? 1.5 : -1.5); pts.push([x + w / 2, y + 0.12]);
        t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.2, y + 0.35, 0.36, 0.36);
        t.text(s, it.h, { x: x + 0.2, y: y + 0.8, w: w - 0.4, h: 0.6, fontSize: L.fit(it.h, w - 0.4, 0.6, 16, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: y + 1.45, w: w - 0.4, h: 1.9, fontSize: 13, color: C.muted });
      }
      strings(s, pts);
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.25, w = (9.0 - gap * (n - 1)) / n, pts = [];
      d.steps.forEach((st, i) => {
        const x = 0.5 + i * (w + gap), y = 1.35 + (i % 2 ? 0.25 : 0);
        card(s, x, y, w, 3.4, i); pts.push([x + w / 2, y + 0.12]);
        t.text(s, String(i + 1), { x: x + 0.2, y: y + 0.3, w: 0.6, h: 0.6, fontSize: 28, bold: true, color: C.string });
        t.text(s, st.h, { x: x + 0.2, y: y + 0.95, w: w - 0.4, h: 0.55, fontSize: L.fit(st.h, w - 0.4, 0.55, 15, 10, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, st.t, { x: x + 0.2, y: y + 1.5, w: w - 0.4, h: 1.8, fontSize: 13, color: C.muted });
      });
      strings(s, pts);
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.35, w = (9.0 - gap * (n - 1)) / n, pts = [];
      d.stats.forEach((x, i) => {
        const px = 0.5 + i * (w + gap);
        card(s, px, 1.4, w, 2.9, i, i === 1 ? C.yellow : C.card); pts.push([px + w / 2, 1.52]);
        t.text(s, x.value, { x: px + 0.15, y: 1.65, w: w - 0.3, h: 1.2, fontSize: L.fit(x.value, w - 0.3, 1.1, 54, 22, F.head, true), bold: true, color: C.string, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.2, y: 2.9, w: w - 0.4, h: 1.3, fontSize: 13, color: C.ink, align: 'center' });
      });
      strings(s, pts);
      if (d.note) { card(s, 0.5, 4.45, 9.0, 0.65, 5); t.text(s, d.note, { x: 0.7, y: 4.55, w: 8.6, h: 0.5, fontSize: 10, color: C.muted, valign: 'middle' }); }
    },
    async compare(d) {
      const s = page(d), w = 4.3;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.7, F.body, 0.18, 5.0 - 2.15);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.5 + i * (w + 0.4);
        card(s, x, 1.35, w, 3.75, i, i ? C.yellow : C.card);
        t.text(s, side.h, { x: x + 0.25, y: 1.55, w: w - 0.5, h: 0.55, fontSize: 17, bold: true, color: i ? C.ink : C.string, valign: 'middle' });
        let y = 2.15;
        side.items.forEach((it, k) => { t.text(s, '\u2022', { x: x + 0.25, y, w: 0.25, h: 0.3, fontSize: 16, bold: true, color: C.string }); t.text(s, it, { x: x + 0.5, y, w: w - 0.7, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      });
      strings(s, [[2.65, 1.47], [7.35, 1.47]]);
    },
    async statement(d) {
      const s = page(d);
      card(s, 1.0, 1.35, 8.0, 2.6, 0, C.yellow);
      t.text(s, L.runs(d.text), { x: 1.4, y: 1.6, w: 7.2, h: 2.2, bold: true, fontSize: L.fit(d.text, 7.2, 2.1, 34, 16, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) { card(s, 2.0, 4.1, 6.0, 1.0, 1); t.text(s, d.caption, { x: 2.2, y: 4.3, w: 5.6, h: 0.75, fontSize: 11, color: C.muted, align: 'center', valign: 'middle' }); }
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (9.0 - gap * (n - 1)) / n, pts = [];
      d.items.forEach((it, i) => {
        const x = 0.5 + i * (w + gap), y = 1.4 + (i % 2) * 0.2;
        card(s, x, y, w, 3.5, i); pts.push([x + w / 2, y + 0.12]);
        t.text(s, it.year, { x: x + 0.15, y: y + 0.3, w: w - 0.3, h: 0.55, fontSize: L.fit(it.year, w - 0.3, 0.5, 22, 11, F.head, true), bold: true, color: C.string, align: 'center', valign: 'middle' });
        t.text(s, it.h, { x: x + 0.15, y: y + 0.9, w: w - 0.3, h: 0.5, fontSize: 15, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it.t, { x: x + 0.15, y: y + 1.45, w: w - 0.3, h: 1.95, fontSize: 13, color: C.muted, align: 'center' });
      });
      strings(s, pts);
    },
    async quote(d) {
      const s = page({});
      card(s, 1.3, 1.0, 7.4, 3.4, 4);
      t.text(s, `\u201C${d.text}\u201D`, { x: 1.7, y: 1.35, w: 6.6, h: 2.3, italic: true, bold: true, fontSize: L.fit(d.text, 6.6, 2.2, 30, 16, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.7, y: 3.75, w: 6.6, h: 0.45, fontSize: 14, bold: true, color: C.string, align: 'center' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length; card(s, 0.6, 1.3, 8.8, 3.8, 2);
      const rh = Math.min(0.56, 3.35 / n);
      for (let k = 0; k < n; k++) t.line(s, 0.8, 1.6 + (k + 1) * rh, 8.4, 0, 'B3D4F2', 0.75);
      d.items.forEach((it, i) => t.text(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.string } }, { text: it, options: { color: C.ink } }], { x: 0.85, y: 1.6 + i * rh, w: 8.3, h: rh, fontSize: 13, valign: 'middle' }));
    },
  };
  // ---- further ways to draw a type, all on the evidence board: a deck's pages must not look alike (L.pages)
  const PAPERS = [C.yellow, 'FFD9DE', 'D6EBFF', 'DDF3D0'], RULE = 'B3D4F2';
  const darkBg = await L.svg(corkSvg().split('#' + C.cork).join('#3B2B1C').split('#9E7340').join('#2A1E12').split('#E0BC86').join('#574229').split('#7A5530').join('#1E150C'), 1600, 900, true);
  const nightPage = (d) => { const s = page(d); s.background = { data: darkBg }; return s; };
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  // a plain paper: no pin in the middle of its head, used where the pin goes elsewhere
  const paper = (s, x, y, w, h, fill = C.card, rot = 0) => t.rect(s, x, y, w, h, fill, { rotate: rot, shadow: 0.35, blur: 6, offset: 3, name: 'Paper' });
  const tape = (s, x, y, w = 0.7) => t.rect(s, x, y, w, 0.2, 'F4E9C8', { t: 25, name: 'Tape' });
  const redNum = (s, n, x, y, w, h, fs = 24) => t.text(s, String(n), { x, y, w, h, bold: true, fontSize: fs, color: C.string, valign: 'middle' });
  const V = {
    image: [
      async (d) => { // a wide print taped to the board, a ruled card pinned under it
        const s = page(d);
        t.img(s, await L.photo(L.src(d.image), 8.8, 1.8), 0.6, 1.3, 8.8, 1.8, { alt: '' });
        t.rect(s, 0.6, 1.3, 8.8, 1.8, null, { line: { color: 'FFFFFF', width: 5 }, name: 'Print edge' });
        tape(s, 0.4, 1.22); tape(s, 8.9, 1.22);
        note(s, d.text, 0.9, 3.28, 8.2, 1.84, 1);
      },
      async (d) => { // the photo has taken the whole board, one note pinned on it
        const s = pres.addSlide(); s.background = { data: bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        card(s, 5.0, 0.3, 4.65, 4.78, 0);
        t.text(s, d.title, { x: 5.2, y: 0.5, w: 3.45, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 3.45, 0.7, 18, 12, F.head, true) });
        redNum(s, idx, 8.7, 0.5, 0.75, 0.7, 24);
        t.line(s, 5.2, 1.23, 4.25, 0, C.string, 1);
        t.text(s, d.text, { x: 5.22, y: 1.3, w: 4.2, h: 3.68, fontSize: L.fit(d.text, 4.2, 3.68, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
        footer(s);
      },
      async (d) => { // by torchlight: the picture under a magnifying glass, words on a pinned card
        const s = nightPage(d), dia = 3.2, x = 6.0, y = 1.35;
        s.addShape(t.S.LINE, { x: x + dia - 0.45, y: y + dia - 0.45, w: 0.8, h: 0.5, line: { color: '8C6A36', width: 11 }, objectName: 'Handle' });
        t.oval(s, x - 0.1, y - 0.1, dia + 0.2, dia + 0.2, 'FFFFFF', { line: { color: '8C6A36', width: 5 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
        note(s, d.text, 0.5, 1.35, 5.1, 3.72, 2);
      },
      async (d) => { // a blue-ruled index card, a tilted polaroid dropped on its corner
        const s = page(d), x = 0.5, y = 1.3, w = 6.0, h = 3.8;
        paper(s, x, y, w, h);
        t.rect(s, x, y + 0.34, w, 0.03, C.string, { name: 'Head rule' });
        pin(s, x + 0.3, y + 0.17, 1);
        const tw = 3.75;
        t.text(s, d.text, { x: x + 0.22, y: y + 0.44, w: tw + 1.75, h: h - 0.54, fontSize: L.fit(d.text, tw + 1.75, h - 0.54, 14, 10, F.body), color: C.ink, valign: 'middle' });
        await polaroid(s, d.image, 6.7, 1.3, 2.95, 3.3, 3, 2.5);
      },
    ],
    cards: [
      async (d) => { // index cards pulled out of the box, each sitting further along
        const s = page(d), n = d.items.length, gap = 0.1, h = (3.8 - gap * (n - 1)) / n, w = 8.2;
        const X = (i) => 0.5 + (i % 2) * 0.8, Y = (i) => 1.3 + i * (h + gap);
        for (const [i, it] of d.items.entries()) {
          const x = X(i), y = Y(i);
          paper(s, x, y, w, h, i % 2 ? C.card : PAPERS[0]);
          t.rect(s, x + 0.72, y, 0.02, h, C.string, { name: 'Margin' });
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.2, y + h / 2 - 0.17, 0.34, 0.34);
          head(s, it.h, x + 0.86, y + 0.04, 2.4, h - 0.08, { max: 14 });
          body(s, it.t, x + 3.32, y + 0.04, w - 3.45, h - 0.08, { valign: 'middle' });
        }
      },
      async (d) => { // the unknown in the middle, the string runs out to every clue
        const s = page(d), n = d.items.length, w = 3.5, h = 1.8, cy = 3.2, cx = 5;
        const pos = n === 4 ? [[0.5, 1.3], [0.5, 3.3], [6.0, 1.3], [6.0, 3.3]] : [[0.5, 1.3], [0.5, 3.3], [6.0, 2.3]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i];
          paper(s, x, y, w, h, PAPERS[i % 4]);
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.15, y + 0.1, 0.32, 0.32);
          head(s, it.h, x + 0.55, y + 0.07, w - 0.7, 0.38, { max: 13 });
          body(s, it.t, x + 0.18, y + 0.5, w - 0.36, h - 0.58);
        }
        const edge = ([x, y]) => [x < 5 ? x + w : x, y + h / 2];
        d.items.forEach((_, i) => strings(s, [[cx, cy], edge(pos[i])]));
        d.items.forEach((_, i) => pin(s, ...edge(pos[i]), i));
        t.oval(s, cx - 0.55, cy - 0.55, 1.1, 1.1, C.string, { line: { color: 'FFFFFF', width: 2 } });
        t.text(s, '?', { x: cx - 0.55, y: cy - 0.55, w: 1.1, h: 1.1, bold: true, fontSize: 36, color: 'FFFFFF', align: 'center', valign: 'middle' });
      },
      async (d) => { // by torchlight: sticky notes in four colours
        const s = nightPage(d), n = d.items.length, w = 4.4, h = 1.8;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.3 + Math.floor(i / 2) * (h + 0.14);
          t.rect(s, x, y, ww, h, PAPERS[i], { rotate: wide ? 0 : (i % 2 ? 0.6 : -0.6), shadow: 0.4, blur: 7, offset: 3, name: 'Sticky' });
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.16, y + 0.14, 0.4, 0.4);
          head(s, it.h, x + 0.68, y + 0.14, ww - 0.84, 0.4, { max: 14 });
          body(s, it.t, x + 0.68, y + 0.58, ww - 0.84, h - 0.68);
        }
      },
      async (d) => { // the main lead on a big card, string to the smaller scraps
        const s = page(d), [a, ...rest] = d.items, n = rest.length, gap = 0.12, h = (3.8 - gap * (n - 1)) / n, Y = (i) => 1.3 + i * (h + gap);
        paper(s, 0.5, 1.3, 4.1, 3.8, C.yellow);
        t.img(s, await L.icon(a.icon, C.ink, 2), 0.72, 1.5, 0.66, 0.66);
        head(s, a.h, 0.72, 2.25, 3.65, 0.6, { max: 19 });
        body(s, a.t, 0.72, 2.9, 3.65, 2.08, { max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = Y(i);
          paper(s, 5.3, y, 4.2, h);
          t.img(s, await L.icon(it.icon, C.ink, 2), 5.44, y + 0.08, 0.3, 0.3);
          head(s, it.h, 5.84, y + 0.04, 3.55, 0.38, { max: 13 });
          body(s, it.t, 5.44, y + 0.44, 3.95, h - 0.5);
        }
        rest.forEach((_, i) => strings(s, [[4.45, 1.5], [5.3, Y(i) + 0.22]]));
        pin(s, 4.45, 1.5, 0); rest.forEach((_, i) => pin(s, 5.3, Y(i) + 0.22, i + 1));
      },
    ],
    process: [
      async (d) => { // the trail goes down the board, card by card
        const s = page(d), n = d.steps.length, cw = 9 / n, w = cw - 0.14, h = 2.05, dy = (3.82 - h) / (n - 1), pts = [];
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * cw, y = 1.28 + i * dy;
          paper(s, x, y, w, h, i % 2 ? C.card : C.yellow); pts.push([x + w - 0.16, y + 0.16]);
          redNum(s, i + 1, x + 0.1, y + 0.06, 0.42, 0.5);
          head(s, st.h, x + 0.5, y + 0.06, w - 0.82, 0.5, { max: 12 });
          body(s, st.t, x + 0.12, y + 0.6, w - 0.24, h - 0.66);
        }
        strings(s, pts); pts.forEach(([a, b], i) => pin(s, a, b, i));
      },
      async (d) => { // a string down the middle, cards pinned to it from either side
        const s = page(d), n = d.steps.length, h = 1.2, w = 4.15, dy = (3.82 - h) / (n - 1), Y = (i) => 1.3 + i * dy;
        const pts = d.steps.map((_, i) => [5 + (i % 2 ? 0.12 : -0.12), Y(i) + 0.3]);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.35 : 0.5, y = Y(i);
          paper(s, x, y, w, h, right ? C.yellow : C.card);
          redNum(s, i + 1, x + 0.12, y + 0.05, 0.4, 0.36, 18);
          head(s, st.h, x + 0.5, y + 0.05, w - 0.62, 0.36, { max: 14 });
          body(s, st.t, x + 0.12, y + 0.42, w - 0.24, h - 0.48);
        }
        strings(s, [[5, 1.22], ...pts, [5, 5.14]]);
        pts.forEach(([a, b], i) => pin(s, a, b, i));
      },
      async (d) => { // by torchlight: long paper strips, the string threaded down their ends
        const s = nightPage(d), n = d.steps.length, gap = 0.12, h = (3.8 - gap * (n - 1)) / n, pts = [];
        for (const [i, st] of d.steps.entries()) {
          const y = 1.3 + i * (h + gap), x = 0.5 + i * (1.4 / (n - 1)), w = 7.6;
          paper(s, x, y, w, h);
          pts.push([x + 0.28, y + h / 2]);
          head(s, `${i + 1}. ${st.h}`, x + 1.05, y + 0.05, 2.2, h - 0.1, { max: 13 });
          body(s, st.t, x + 3.3, y + 0.05, w - 3.42, h - 0.1, { valign: 'middle' });
        }
        strings(s, pts); pts.forEach(([a, b], i) => pin(s, a, b, i));
      },
      async (d) => { // the case goes round: along the top, down, and back along the bottom
        const s = page(d), n = d.steps.length, w = 4.2, h = 1.75, pos = [[0.5, 1.3], [5.3, 1.3], [5.3, 3.35], [0.5, 3.35]];
        for (const [i, st] of d.steps.entries()) {
          const [x, y] = pos[i];
          paper(s, x, y, w, h, PAPERS[i % 4]);
          redNum(s, i + 1, x + 0.12, y + 0.06, 0.4, 0.42);
          head(s, st.h, x + 0.54, y + 0.06, w - 0.68, 0.42, { max: 14 });
          body(s, st.t, x + 0.14, y + 0.54, w - 0.28, h - 0.6);
        }
        const links = [[[4.7, 2.17], [5.3, 2.17]], [[7.4, 3.05], [7.4, 3.35]], [[5.3, 4.22], [4.7, 4.22]]].slice(0, n - 1);
        links.forEach((seg, i) => { strings(s, seg); pin(s, ...seg[0], i); pin(s, ...seg[1], i + 1); });
      },
    ],
    stats: [
      async (d) => { // one number ringed in red on a sticky note, two smaller cards
        const s = page(d), [a, b, c] = d.stats;
        paper(s, 0.5, 1.3, 4.8, 3.8, C.yellow);
        t.oval(s, 0.75, 1.5, 4.3, 1.9, null, { line: { color: C.string, width: 3 } });
        t.text(s, a.value, { x: 1.0, y: 1.5, w: 3.8, h: 1.9, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.6, 1.5, 60, 24, F.head, true) });
        body(s, a.label, 0.8, 3.5, 4.2, 1.45, { align: 'center', max: 16 });
        [b, c].forEach((x, i) => {
          const px = 5.5 + i * 2.05;
          card(s, px, 1.3, 1.95, 1.9, i + 1);
          t.text(s, x.value, { x: px + 0.06, y: 1.48, w: 1.83, h: 0.72, bold: true, color: C.string, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 1.76, 0.66, 24, 11, F.head, true) });
          body(s, x.label, px + 0.1, 2.2, 1.75, 0.95, { align: 'center', max: 12 });
        });
        if (d.note) body(s, d.note, 5.5, 3.32, 4.0, 1.78, { color: C.ink, max: 13, valign: 'middle' });
      },
      async (d) => { // by torchlight: round badges strung together
        const s = nightPage(d), dia = 1.72, xs = [1.0, 4.14, 7.28], ys = [1.3, 1.62, 1.3], cols = ['FFFFFF', C.yellow, 'FFD9DE'];
        strings(s, xs.map((x, i) => [x + dia / 2, ys[i] + dia / 2]));
        d.stats.forEach((x, i) => {
          t.oval(s, xs[i], ys[i], dia, dia, cols[i], { line: { color: C.string, width: 3 } });
          t.text(s, x.value, { x: xs[i] + 0.1, y: ys[i], w: dia - 0.2, h: dia, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 0.28, 0.8, 30, 13, F.head, true) });
          body(s, x.label, xs[i] - 0.45, ys[i] + dia + 0.04, dia + 0.9, 0.62, { color: 'FFFFFF', align: 'center', max: 13 });
        });
        if (d.note) { paper(s, 0.9, 4.1, 8.2, 1.0); body(s, d.note, 1.05, 4.14, 7.9, 0.92, { max: 13, valign: 'middle' }); }
      },
      async (d) => { // three strips with the figure large, a long note hanging at the side
        const s = page(d), w = d.note ? 5.6 : 9;
        d.stats.forEach((x, i) => {
          const y = 1.3 + i * 1.3;
          paper(s, 0.5, y, w, 1.2, i === 0 ? C.yellow : C.card);
          t.text(s, x.value, { x: 0.65, y, w: 2.5, h: 1.2, bold: true, color: C.string, valign: 'middle', fontSize: L.fit(x.value, 2.45, 1.0, 36, 16, F.head, true) });
          body(s, x.label, 3.25, y + 0.06, w - 2.9, 1.08, { valign: 'middle', max: 14 });
        });
        if (d.note) { card(s, 6.35, 1.3, 3.15, 3.8, 2, 'D6EBFF'); body(s, d.note, 6.52, 1.56, 2.82, 3.42, { max: 14, valign: 'middle' }); }
      },
    ],
    compare: [
      async (d) => { // the string down the middle, each side's notes pinned on towards it
        const s = page(d), w = 4.1;
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? 5.4 : 0.5, a = i ? 'left' : 'right', n = side.items.length, rh = 3.15 / n, fill = i ? C.yellow : C.card;
          paper(s, x, 1.3, w, 0.55, i ? C.string : C.ink);
          head(s, side.h, x + 0.14, 1.3, w - 0.28, 0.55, { color: 'FFFFFF', align: a, max: 15 });
          side.items.forEach((it, k) => {
            const y = 1.95 + k * rh;
            paper(s, x, y, w, rh - 0.08, fill);
            body(s, it, x + 0.14, y + 0.04, w - 0.28, rh - 0.16, { align: a, valign: 'middle', max: 13 });
          });
        }
        const m = [...d.left.items.map((_, k) => [4.82, 1.95 + k * (3.15 / d.left.items.length) + 0.3]), ...d.right.items.map((_, k) => [5.18, 1.95 + k * (3.15 / d.right.items.length) + 0.3])];
        strings(s, [[5, 1.2], [5, 5.14]]);
        m.forEach(([a, b], j) => { strings(s, [[5, b], [a, b]]); pin(s, a, b, j < d.left.items.length ? 0 : 1); });
      },
      async (d) => { // two long cards, a torn tag and a row of scraps on each
        const s = page(d), h = 1.82;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.3 + i * (h + 0.14), n = side.items.length, cw = 6.65 / n;
          paper(s, 0.5, y, 9, h, i ? 'E9E4D6' : C.card);
          t.rect(s, 0.5, y, 2.1, h, i ? C.string : C.ink, { name: 'Tag' });
          head(s, side.h, 0.6, y + 0.08, 1.9, h - 0.16, { color: 'FFFFFF', align: 'center', max: 15 });
          side.items.forEach((it, k) => {
            const x = 2.72 + k * cw;
            t.rect(s, x, y + 0.14, cw - 0.12, h - 0.28, PAPERS[i ? 2 : 0], { shadow: 0.2, blur: 4, offset: 2, name: 'Scrap' });
            pin(s, x + (cw - 0.12) / 2, y + 0.18, k);
            body(s, it, x + 0.08, y + 0.3, cw - 0.28, h - 0.48, { valign: 'middle' });
          });
        }
      },
    ],
    statement: [
      async (d) => { // by torchlight: the conclusion written straight on the dark cork
        const s = nightPage(d), bottom = d.caption ? 3.7 : 5.05;
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.25, w: 8.8, h: bottom - 1.3, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 8.8, bottom - 1.4, 36, 18, F.head, true) });
        if (d.caption) { strings(s, [[0.6, 3.74], [9.4, 3.74]]); card(s, 0.6, 3.82, 8.8, 1.3, 0, C.yellow); body(s, d.caption, 0.8, 4.0, 8.4, 1.06, { max: 13, valign: 'middle' }); }
      },
      async (d) => { // the verdict on a tall white sheet, its reason on a sticky string-tied beside it
        const s = page(d), w = d.caption ? 5.9 : 9;
        card(s, 0.5, 1.3, w, 3.8, 0);
        t.text(s, L.runs(d.text), { x: 0.8, y: 1.55, w: w - 0.6, h: 3.4, bold: true, color: C.string, valign: 'middle', fontSize: L.fit(d.text, w - 0.6, 3.3, 34, 17, F.head, true) });
        if (d.caption) {
          t.rect(s, 6.75, 1.55, 2.75, 3.3, C.yellow, { rotate: 1.5, shadow: 0.35, blur: 6, offset: 3, name: 'Sticky' });
          body(s, d.caption, 6.9, 1.68, 2.45, 3.05, { max: 14, valign: 'middle' });
          strings(s, [[3.45, 1.42], [8.12, 1.62]]); pin(s, 8.12, 1.62, 1); pin(s, 3.45, 1.42, 0);
        }
      },
    ],
    timeline: [
      async (d) => { // the string runs straight across, events pinned above and below
        const s = page(d), cy = 3.2, w = 4.42, h = 1.72, xs = [1.2, 3.45, 5.75, 8.0];
        strings(s, [[0.3, cy], [9.7, cy]]);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = i < 2 ? 0.5 : 5.08, y = up ? cy - 0.16 - h : cy + 0.16;
          paper(s, x, y, w, h, up ? C.card : C.yellow);
          pin(s, xs[i], cy, i);
          t.text(s, it.year, { x: x + 0.14, y: y + 0.06, w: 1.9, h: 0.36, bold: true, color: C.string, valign: 'middle', fontSize: L.fit(it.year, 1.86, 0.34, 18, 10, F.head, true) });
          head(s, it.h, x + 2.06, y + 0.06, w - 2.2, 0.36, { max: 13, align: 'right' });
          body(s, it.t, x + 0.14, y + 0.46, w - 0.28, h - 0.52);
        }
      },
      async (d) => { // by torchlight: dated polaroid frames climbing the board
        const s = nightPage(d), cw = 2.25, w = cw - 0.14, h = 2.48, pts = [];
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * cw, y = 2.62 - i * 0.44;
          paper(s, x, y, w, h);
          t.rect(s, x + 0.08, y + 0.08, w - 0.16, 0.5, C.ink, { name: 'Frame' });
          t.text(s, it.year, { x: x + 0.1, y: y + 0.08, w: w - 0.2, h: 0.5, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.3, 0.46, 18, 10, F.head, true) });
          head(s, it.h, x + 0.1, y + 0.62, w - 0.2, 0.36, { max: 12 });
          body(s, it.t, x + 0.1, y + 0.98, w - 0.2, h - 1.04);
          pts.push([x + w / 2, y + 0.04]);
        }
        strings(s, pts); pts.forEach(([a, b], i) => pin(s, a, b, i));
      },
      async (d) => { // one ruled sheet: the dates down a red margin
        const s = page(d), y0 = 1.3, H0 = 3.8, rh = H0 / 4;
        paper(s, 0.6, y0, 8.8, H0);
        t.rect(s, 2.3, y0, 0.03, H0, C.string, { name: 'Margin' });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          if (i) t.line(s, 0.6, y, 8.8, 0, RULE, 1);
          t.text(s, it.year, { x: 0.72, y, w: 1.5, h: rh, bold: true, color: C.string, valign: 'middle', align: 'center', fontSize: L.fit(it.year, 1.46, 0.5, 18, 10, F.head, true) });
          head(s, it.h, 2.44, y + 0.05, 6.8, 0.3, { max: 13 });
          body(s, it.t, 2.44, y + 0.36, 6.8, rh - 0.42);
        }
      },
    ],
  };
  R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift(); // the old ones were all the same pinned columns as the cards
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Probka', colors: { dk1: C.ink, lt1: C.card, dk2: '6B4A28', lt2: C.yellow, accent1: C.string, accent2: C.pins[1], accent3: C.pins[2], accent4: C.pins[3], accent5: C.pins[4], accent6: C.pins[5], hlink: C.pins[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tergovchi kabi: dalillar, sabab-oqibat bog'lanishlari va xulosa; qisqa va ishonchli", limits: {}, prefer: null };
module.exports = { id: 64, slug: 'probka', name: 'Probka', category: 'creative', photos: true, build, style: STYLE };
