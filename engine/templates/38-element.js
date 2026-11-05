/**
 * 38 Element — periodic table: every idea becomes an element tile (atomic number,
 * symbol, name), colour-coded by "group", with lab-style labels.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F7F7F4', ink: '1B1F2A', muted: '626B7A', line: 'DADDE3', white: 'FFFFFF', groups: ['FF6B6B', 'FFB547', '4ECDC4', '7B8CDE', 'B983FF', '6BCB77'] };
const F = { head: 'Arial', body: 'Arial' };
const symbolOf = (text) => { // "Daromad solig'i" -> "Ds"; "QQS" -> "Qq"
  const w = String(text).replace(/[^A-Za-z\u0400-\u04FF ]/g, '').split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  const a = w[0][0].toUpperCase(), b = w[1] ? w[1][0].toLowerCase() : (w[0][1] || '').toLowerCase();
  return a + b;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  // element tile: number top-left, symbol centre, name bottom, optional mass top-right
  const tile = (s, x, y, d, { num, sym, name, mass, color }) => {
    t.rect(s, x, y, d, d, color, { line: { color: C.ink, width: 1.25 }, name: 'Element tile' });
    t.text(s, String(num), { x: x + 0.07, y: y + 0.05, w: d / 2, h: d * 0.2, fontSize: Math.max(8, d * 10), bold: true, color: C.ink });
    if (mass) t.text(s, mass, { x: x + d / 2, y: y + 0.05, w: d / 2 - 0.07, h: d * 0.2, fontSize: Math.max(7, d * 8), color: C.ink, align: 'right' });
    t.text(s, sym, { x, y: y + d * 0.18, w: d, h: d * 0.5, fontSize: L.fit(sym, d - 0.15, d * 0.48, d * 40, 10, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
    if (name) t.text(s, name, { x: x + 0.05, y: y + d * 0.7, w: d - 0.1, h: d * 0.26, fontSize: L.fit(name, d - 0.1, d * 0.24, Math.max(7, d * 9), 6, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
  };
  const footer = (s) => {
    t.line(s, 0.6, 5.12, 8.8, 0, C.line, 0.75);
    t.text(s, M.topic || '', { x: 0.6, y: 5.18, w: 4.4, h: 0.25, fontSize: 9, bold: true, color: C.ink });
    t.text(s, meta, { x: 4.6, y: 5.18, w: 4.8, h: 0.25, fontSize: 9, color: C.muted, align: 'right' });
  };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.title) {
      tile(s, 0.6, 0.35, 0.75, { num: idx, sym: symbolOf(d.title), color: C.groups[idx % 6] });
      t.text(s, d.title, { x: 1.55, y: 0.35, w: 7.9, h: 0.75, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.75, 28, 16, F.head, true) });
    }
    footer(s);
    return s;
  };
  const framed = async (s, src, x, y, w, h, color) => { t.rect(s, x, y, w, h, color, { line: { color: C.ink, width: 1.25 }, name: 'Frame' }); t.img(s, await L.photo(L.src(src), w - 0.24, h - 0.24), x + 0.12, y + 0.12, w - 0.24, h - 0.24, { alt: '' }); };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    const words = d.title.split(/\s+/).filter((w) => w.length > 2).slice(0, 4);
    words.forEach((w, i) => tile(s, 0.6 + i * 1.1, 0.6, 1.0, { num: i + 1, sym: symbolOf(w), name: w, color: C.groups[i % 6] }));
    if (d.image) await framed(s, d.image, 6.2, 0.6, 3.2, 3.0, C.groups[3]);
    const fs = L.fit(d.title, 5.3, 1.5, 38, 20, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 1.8, w: 5.3, h: 1.6, bold: true, fontSize: fs, color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.5, w: 5.3, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, [{ text: M.author || '', options: { bold: true, color: C.ink } }, { text: `   ${[M.org, M.loc, M.year].filter(Boolean).join(', ')}`, options: { color: C.muted } }], { x: 0.6, y: 4.4, w: 8.8, h: 0.35, fontSize: 13 });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await framed(s, d.image, 0.6, 1.4, 4.0, 3.45, C.groups[2]); para(s, d.text, 4.95, 1.4, 4.45, 3.45); },
    async image(d) { const s = page(d); para(s, d.text, 0.6, 1.4, 4.3, 3.45); await framed(s, d.image, 5.25, 1.4, 4.15, 3.45, C.groups[4]); },
    async agenda(d) {
      const s = page(d), n = d.items.length, dd = Math.min(1.35, (8.8 - 0.2 * (n - 1)) / n);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * (dd + 0.2);
        tile(s, x, 1.5, dd, { num: i + 1, sym: symbolOf(it), color: C.groups[i % 6] });
        t.text(s, it, { x: x - 0.05, y: 1.6 + dd, w: dd + 0.1, h: 0.9, fontSize: L.fit(it, dd + 0.1, 0.9, 14, 9, F.head, true), bold: true, color: C.ink, align: 'center' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, rh = (3.6 - 0.15 * (n - 1)) / n, dd = Math.min(rh, 0.95);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * (rh + 0.15);
        tile(s, 0.6, y, dd, { num: i + 1, sym: symbolOf(it.h), color: C.groups[i % 6] });
        t.text(s, it.h, { x: 0.6 + dd + 0.3, y, w: 3.3 - (0.9 + dd), h: dd, fontSize: L.fit(it.h, 3.3 - (0.9 + dd), dd, 17, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: 3.65, y, w: 5.75, h: dd, fontSize: L.fit(it.t, 5.75, dd, 15, 10, F.body), color: C.muted, valign: 'middle' });
        t.line(s, 3.4, y + dd / 2, 0.15, 0, C.line, 1);
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n, dd = 1.15;
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        tile(s, x, 1.45, dd, { num: i + 1, sym: symbolOf(st.h), name: st.h, color: C.groups[i % 6] });
        if (i < n - 1) t.text(s, '\u2192', { x: x + dd, y: 1.45, w: cw - dd, h: dd, fontSize: 26, bold: true, color: C.muted, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 2.75, w: cw - 0.3, h: 0.45, fontSize: L.fit(st.h, cw - 0.3, 0.45, 16, 11, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 3.2, w: cw - 0.3, h: 1.75, fontSize: L.fit(st.t, cw - 0.3, 1.75, 14, 10, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n, dd = Math.min(1.9, cw - 0.6);
      d.stats.forEach((x, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        tile(s, cx - dd / 2, 1.4, dd, { num: i + 1, sym: x.value, color: C.groups[(i * 2) % 6] });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 1.55 + dd, w: cw - 0.4, h: 0.9, fontSize: 14, color: C.ink, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.55, w: 8.8, h: 0.45, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.2;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.25);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4), col = C.groups[i ? 2 : 0];
        tile(s, x, 1.35, 0.7, { num: i + 1, sym: symbolOf(side.h), color: col });
        t.text(s, side.h, { x: x + 0.85, y: 1.35, w: w - 0.9, h: 0.7, fontSize: 19, bold: true, color: C.ink, valign: 'middle' });
        let y = 2.25;
        side.items.forEach((it, k) => { t.rect(s, x, y + 0.04, 0.24, 0.24, col, { line: { color: C.ink, width: 0.75 }, name: 'Mini tile' }); t.text(s, it, { x: x + 0.4, y, w: w - 0.45, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      tile(s, 0.7, 1.45, 2.3, { num: idx, sym: '!', name: d.title, color: C.groups[4] });
      t.text(s, L.runs(d.text), { x: 3.4, y: 1.4, w: 6.0, h: 1.9, fontSize: L.fit(d.text, 6.0, 1.8, 34, 20, F.head, true), bold: true, color: C.ink, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: 3.4, y: 3.45, w: 6.0, h: 1.4, fontSize: L.fit(d.caption, 6.0, 1.4, 15, 11, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, dd = 1.0;
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        tile(s, x, 1.4, dd, { num: i + 1, sym: symbolOf(it.h), mass: it.year, color: C.groups[(i + 1) % 6] });
        t.text(s, it.year, { x: x + dd + 0.1, y: 1.4, w: cw - dd - 0.2, h: dd, fontSize: L.fit(it.year, cw - dd - 0.25, 0.5, 22, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.05, w: cw - 0.3, h: 1.9, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({});
      tile(s, 0.8, 1.2, 1.6, { num: '\u201C', sym: '\u201C\u201D', name: TR.quote, color: C.groups[1] });
      t.text(s, d.text, { x: 2.8, y: 1.1, w: 6.6, h: 2.5, fontSize: L.fit(d.text, 6.6, 2.4, 30, 18, F.head, true), bold: true, color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 2.8, y: 3.7, w: 6.6, h: 0.4, fontSize: 14, color: C.muted });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.rect(s, 0.6, y + (rh - 0.42) / 2, 0.42, 0.42, C.groups[i % 6], { line: { color: C.ink, width: 0.75 }, name: 'Mini tile' });
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.42) / 2, w: 0.42, h: 0.42, fontSize: 11, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.2, h: rh, fontSize: L.fit(it, 8.2, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, from the chemist's bench: a deck's pages must not look alike (L.pages)
  const X0 = 0.6, FW = 8.8, Y1 = 5.04, G = C.groups, A = (i) => G[i % 6], NIGHT = C.ink;
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10.5, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13.5, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const lab = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10.5, F.body, false, 1.25), color: o.color || C.ink, lineSpacingMultiple: 1.25, valign: o.valign || 'middle', align: o.align });
  const orbit = (w, h, color, rx, ry, rot, sw = 2.5) => `<ellipse cx="${w / 2}" cy="${h / 2}" rx="${rx}" ry="${ry}" fill="none" stroke="#${color}" stroke-width="${sw}" transform="rotate(${rot} ${w / 2} ${h / 2})"/>`;
  const atom = (w, h, r1, r2, color = C.muted) => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${[0, 60, 120].map((a) => orbit(w, h, color, r1, r2, a)).join('')}</svg>`, w, h);
  const FLASK = [[0.38, 0], [0.62, 0], [0.62, 0.3], [1, 0.92], [0.96, 1], [0.04, 1], [0, 0.92], [0.38, 0.3]];
    const V = {
    image: [
      async (d) => { // a specimen on the long bench: the wide picture, its tile on the corner
        const s = page(d), y = 1.34, h = 2.05;
        await framed(s, d.image, X0, y, FW, h, G[2]);
        tile(s, X0 + FW - 0.98, y + h - 0.68, 0.86, { num: idx, sym: symbolOf(d.title), color: G[1] });
        lab(s, d.text, X0, y + h + 0.1, FW, Y1 - y - h - 0.12);
      },
      async (d) => { // the table's own lattice laid over the picture, the card of words on top of it
        const s = page(d), y = 1.2, h = 3.87; let g = '';
        for (let x = 0; x <= 1000; x += 72) g += `<line x1="${x}" y1="0" x2="${x}" y2="${h * 100}"/>`;
        for (let yy = 0; yy <= h * 100; yy += 72) g += `<line x1="0" y1="${yy}" x2="1000" y2="${yy}"/>`;
        t.img(s, await L.photo(L.src(d.image), W, h), 0, y, W, h, { alt: d.title });
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${h * 100}"><g stroke="#${C.bg}" stroke-width="3">${g}</g></svg>`, 1000, h * 100), 0, y, W, h);
        t.rect(s, 4.92, y + 0.14, 4.76, h - 0.28, C.white, { line: { color: C.ink, width: 1.25 }, name: 'Card' });
        lab(s, d.text, 5.12, y + 0.24, 4.36, h - 0.48);
      },
      async (d) => { // the picture is the nucleus of an atom, orbits swinging round it
        const s = page(d), S_ = 3.9, x = 0.4, y = 1.2, dia = 1.9;
        t.img(s, await atom(390, 390, 192, 72), x, y, S_, S_);
        const c = x + S_ / 2 - dia / 2, cy = y + S_ / 2 - dia / 2;
        t.oval(s, c - 0.06, cy - 0.06, dia + 0.12, dia + 0.12, G[0], { line: { color: C.ink, width: 1.25 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), c, cy, dia, dia, { alt: d.title });
        lab(s, d.text, 4.55, 1.3, 4.85, 3.7);
      },
      async (d) => { // the picture poured in a flask, the note to its left
        const s = page(d), w = 3.8, h = 3.8, x = 5.6, y = 1.22;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: FLASK } }), x, y, w, h, { alt: d.title });
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="380" height="380"><polygon points="${FLASK.map(([a, b]) => `${a * 374 + 3},${b * 374 + 3}`).join(' ')}" fill="none" stroke="#${C.ink}" stroke-width="5"/><line x1="125" y1="4" x2="255" y2="4" stroke="#${C.ink}" stroke-width="9"/></svg>`, 380, 380), x, y, w, h);
        t.rect(s, X0, 1.34, 0.1, 3.6, G[3], { name: 'Group bar' });
        lab(s, d.text, X0 + 0.28, 1.3, 4.5, 3.7);
      },
    ],
    cards: [
      async (d) => { // columns of the table: an element on top, tall at the edges, lower within
        const s = page(d), n = d.items.length, g = 0.2, w = (FW - g * (n - 1)) / n, D = 1.0, drop = [0, 0.34, 0.34, 0], dn = n === 3 ? [0, 0.34, 0] : drop;
        d.items.forEach((it, i) => {
          const x = X0 + i * (w + g), y = 1.28 + dn[i];
          tile(s, x, y, D, { num: i + 1, sym: symbolOf(it.h), color: A(i) });
          t.rect(s, x, y + D + 0.04, w, 0.04, A(i), { name: 'Group bar' });
          head(s, it.h, x, y + D + 0.12, w, 0.5, { valign: 'top', max: 14 });
          body(s, it.t, x, y + D + 0.62, w, Y1 - y - D - 0.64);
        });
      },
      async (d) => { // whole tiles of colour: the element's data set out on the tile itself
        const s = page(d), n = d.items.length, g = 0.14, w = (FW - g) / 2, h = 1.8;
        const spots = n === 3 ? [[X0, 1.3, w], [X0 + w + g, 1.3, w], [X0, 1.3 + h + g, FW]] : [0, 1, 2, 3].map((i) => [X0 + (i % 2) * (w + g), 1.3 + (i >> 1) * (h + g), w]);
        for (const [i, it] of d.items.entries()) {
          const [x, y, ww] = spots[i];
          t.rect(s, x, y, ww, h, A(i * 2 + 1), { line: { color: C.ink, width: 1.25 }, name: 'Element tile' });
          t.text(s, String(i + 1), { x: x + 0.1, y: y + 0.06, w: 0.4, h: 0.28, fontSize: 11, bold: true, color: C.ink });
          t.img(s, await L.icon(it.icon, C.ink, 2.25), x + ww - 0.46, y + 0.1, 0.34, 0.34);
          t.text(s, symbolOf(it.h), { x: x + 0.1, y: y + 0.34, w: 0.86, h: 0.66, fontSize: 30, bold: true, color: C.ink, valign: 'middle' });
          head(s, it.h, x + 1.0, y + 0.2, ww - 1.54, 0.72, { max: 14 });
          body(s, it.t, x + 0.12, y + 1.0, ww - 0.24, h - 1.06, { max: 12.5 });
        }
      },
      async (d) => { // an atom: a nucleus in the middle, each idea flung out on an electron's path
        const s = page(d), n = d.items.length, w = 3.15, left = 2, right = n - left, hL = 1.9, hR = 3.8 / right, cx = 5, cy = 3.17;
        t.img(s, await atom(300, 300, 148, 56), cx - 1.5, cy - 1.5, 3, 3);
        t.oval(s, cx - 0.42, cy - 0.42, 0.84, 0.84, G[0], { line: { color: C.ink, width: 1.25 }, name: 'Nucleus' });
        t.text(s, String(n), { x: cx - 0.42, y: cy - 0.42, w: 0.84, h: 0.84, fontSize: 22, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const onL = i < left, H_ = onL ? hL : hR, x = onL ? X0 : 6.25, y = 1.26 + (onL ? i : i - left) * H_, hh = H_ - 0.12, tall = hh > 2;
          t.rect(s, x, y + (tall ? hh / 2 - 0.92 : 0), w, tall ? 1.84 : hh, C.white, { line: { color: A(i), width: 2 }, name: 'Electron' });
          const top = y + (tall ? hh / 2 - 0.92 : 0);
          t.img(s, await L.icon(it.icon, C.ink, 2.25), x + 0.12, top + 0.1, 0.28, 0.28);
          head(s, it.h, x + 0.46, top + 0.06, w - 0.56, 0.36, { max: 13 });
          body(s, it.t, x + 0.12, top + 0.44, w - 0.24, (tall ? 1.84 : hh) - 0.5, { max: 12.5 });
        }
      },
      async (d) => { // the discovery: one great element, the rest entered small in the list
        const s = page(d), [a, ...rest] = d.items, D = 2.0, h = 3.72 / rest.length;
        tile(s, X0, 1.3, D, { num: 1, sym: symbolOf(a.h), color: G[1] });
        head(s, a.h, X0 + D + 0.14, 1.3, 2.0, D, { max: 17 });
        body(s, a.t, X0, 3.4, 4.2, 1.62, { max: 15 });
        t.line(s, 5.05, 1.34, 0, 3.66, C.line, 1.5);
        rest.forEach((it, i) => {
          const y = 1.3 + i * h, d0 = 0.66;
          tile(s, 5.3, y + 0.03, d0, { num: i + 2, sym: symbolOf(it.h), color: A(i + 2) });
          head(s, it.h, 6.1, y, 3.3, 0.34, { max: 14 });
          body(s, it.t, 6.1, y + 0.34, 3.3, h - 0.4, { max: 12.5 });
        });
      },
    ],
    process: [
      async (d) => { // a reaction falling step by step: each element further right, an arrow on
        const s = page(d), n = d.steps.length, h = 3.72 / n, D = 0.72, dx = n === 3 ? 0.9 : 0.62, w = 6.0;
        d.steps.forEach((st, i) => {
          const x = X0 + i * dx, y = 1.3 + i * h;
          tile(s, x, y + 0.02, D, { num: i + 1, sym: symbolOf(st.h), color: A(i) });
          head(s, st.h, x + D + 0.15, y, w, 0.3, { max: 14 });
          body(s, st.t, x + D + 0.15, y + 0.31, w, h - 0.36, { max: 13 });
          if (i < n - 1) t.text(s, '↳', { x: x + 0.14, y: y + D + 0.02, w: 0.5, h: h - D - 0.02, fontSize: Math.max(10, (h - D) * 50), bold: true, color: C.muted, noFit: true, valign: 'middle' });
        });
      },
      async (d) => { // a burette on a stand: the column stands in the middle, drops of steps left and right
        const s = page(d), n = d.steps.length, y0 = 1.26, h = 3.8 / n, cx = 5, D = 0.52;
        t.rect(s, cx - 0.06, y0, 0.12, 3.76, C.line, { line: { color: C.ink, width: 1 }, name: 'Burette' });
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? X0 : 5.5, w = 3.9, al = left ? 'right' : 'left';
          t.rect(s, cx - D / 2, y + h / 2 - D / 2, D, D, A(i), { line: { color: C.ink, width: 1.25 }, name: 'Mini tile' });
          t.text(s, String(i + 1), { x: cx - D / 2, y: y + h / 2 - D / 2, w: D, h: D, fontSize: 15, bold: true, color: C.ink, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.03, w, 0.3, { align: al });
          body(s, st.t, x, y + 0.33, w, h - 0.37, { align: al, max: 13 });
        });
      },
      async (d) => { // a molecule: elements bonded up and down the page, the words in the space left
        const s = page(d), n = d.steps.length, cw = FW / n, D = 0.92, top = 1.26, bot = Y1 - D;
        const pos = (i) => [X0 + i * cw + 0.02, i % 2 ? bot : top];
        for (let i = 0; i < n - 1; i++) { const [a, b] = pos(i), [c, e] = pos(i + 1), gx = c - 0.1; t.line(s, a + D, b + D / 2, gx - a - D, 0, C.ink, 2.25); t.line(s, gx, Math.min(b, e) + D / 2, 0, Math.abs(e - b), C.ink, 2.25); t.line(s, gx, e + D / 2, c - gx, 0, C.ink, 2.25); }
        d.steps.forEach((st, i) => {
          const [x, y] = pos(i), up = i % 2 === 0, tx = x, ty = up ? top + D + 0.08 : top, th = Y1 - top - D - 0.08, w = cw - 0.2;
          tile(s, x, y, D, { num: i + 1, sym: symbolOf(st.h), color: A(i) });
          head(s, st.h, tx + 0.02, ty + 0.02, w - 0.04, 0.5, { max: 13, valign: 'top' });
          body(s, st.t, tx + 0.02, ty + 0.52, w - 0.04, th - 0.54, { max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // one heavyweight element, two lighter ones on the shelf beside it
        const s = page(d), [a, ...rest] = d.stats, D = 2.5, D2 = 1.08;
        tile(s, X0, 1.28, D, { num: 1, sym: a.value, color: G[1] });
        body(s, a.label, X0 + D + 0.2, 1.3, 2.05, D - 0.05, { max: 15, valign: 'middle' });
        rest.forEach((q, i) => {
          const y = 1.28 + i * (D2 + 0.34);
          tile(s, 5.55, y, D2, { num: i + 2, sym: q.value, color: G[(i * 2 + 2) % 6] });
          body(s, q.label, 5.55 + D2 + 0.16, y, 2.61, D2, { max: 13, valign: 'middle' });
        });
        if (d.note) { t.line(s, X0, 3.98, FW, 0, C.line, 1); body(s, d.note, X0, 4.04, FW, 1.0, { max: 13, valign: 'middle', color: C.ink }); }
      },
      async (d) => { // three samples on a slant: plates of colour, each a little further along
        const s = page(d), h = 0.86, g = 0.08, w = 7.0;
        d.stats.forEach((q, i) => {
          const x = X0 + i * 0.9, y = 1.26 + i * (h + g);
          t.rect(s, x, y, w, h, A(i * 2 + 2), { line: { color: C.ink, width: 1.25 }, name: 'Sample' });
          t.text(s, String(i + 1), { x: x + 0.08, y: y + 0.04, w: 0.3, h: 0.22, fontSize: 9, bold: true, color: C.ink });
          t.text(s, q.value, { x: x + 0.34, y, w: 2.3, h, bold: true, fontSize: L.fit(q.value, 2.3, h - 0.14, 30, 16, F.head, true), color: C.ink, valign: 'middle' });
          body(s, q.label, x + 2.74, y + 0.05, w - 2.86, h - 0.1, { max: 14, valign: 'middle' });
        });
        if (d.note) body(s, d.note, X0, 4.14, FW, 0.9, { max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // two elements bonded at the centre, each side reads away from the bond
        const s = page(d), w = 3.75, y0 = 2.22, avail = 2.8, D = 0.82, fit = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.12, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        t.rect(s, 4.84, 2.2, 0.32, 2.84, C.line, { name: 'Bond' });
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.3 : 0.95, al = i ? 'left' : 'right', col = G[i ? 2 : 0];
          tile(s, i ? 5.0 : 5 - D, 1.28, D, { num: i + 1, sym: symbolOf(side.h), color: col });
          head(s, side.h, i ? 5.0 + D + 0.14 : 0.6, 1.28, 5 - D - 0.14 - 0.6, D, { align: al, max: 18 });
          let y = y0;
          fit.rows.forEach((rh0, k) => {
            const rh = rh0 + extra;
            if (side.items[k]) t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: C.ink, align: al, valign: 'middle' });
            y += rh;
          });
        });
      },
      async (d) => { // two groups of the table as colour bands, an element opening each
        const s = page(d), bh = 1.8, g = 0.12;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.28 + i * (bh + g), n = side.items.length, x0 = 3.0, cw = (9.3 - x0) / n, col = G[i ? 2 : 1];
          t.rect(s, X0, y, FW, bh, col, { line: { color: C.ink, width: 1.25 }, name: 'Group band' });
          t.rect(s, X0, y, 2.3, bh, C.white, { line: { color: C.ink, width: 1.25 }, name: 'Group head' });
          t.text(s, symbolOf(side.h), { x: X0 + 0.1, y: y + 0.04, w: 2.1, h: 0.72, fontSize: 34, bold: true, color: C.ink, valign: 'middle' });
          head(s, side.h, X0 + 0.1, y + 0.78, 2.1, bh - 0.84, { max: 13, valign: 'top' });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.06, y + 0.18, 0, bh - 0.36, C.ink, 0.75);
            body(s, it, x0 + k * cw, y + 0.1, cw - 0.14, bh - 0.2, { valign: 'middle', max: 13 });
          });
        });
      },
    ],
    statement: [
      async (d) => { // a slab of one group's colour, the formula on it, a footnote beneath
        const s = page(d), y = 1.28, h = 2.5;
        t.rect(s, X0, y, FW, h, G[1], { line: { color: C.ink, width: 1.25 }, name: 'Group slab' });
        t.text(s, String(idx), { x: X0 + 0.12, y: y + 0.08, w: 0.6, h: 0.3, fontSize: 12, bold: true, color: C.ink });
        t.text(s, L.runs(d.text), { x: X0 + 0.5, y: y + 0.2, w: FW - 1.0, h: h - 0.4, bold: true, fontSize: L.fit(d.text, FW - 1.0, h - 0.45, 32, 17, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
        if (d.caption) body(s, d.caption, X0, y + h + 0.12, FW, Y1 - y - h - 0.14, { max: 14, valign: 'middle', align: 'center' });
      },
      async (d) => { // lights off in the lab: a dark page, the words shining, tiles lit along the top
        const s = pres.addSlide(); s.background = { color: NIGHT }; idx++;
        if (d.title) { tile(s, 0.6, 0.35, 0.75, { num: idx, sym: symbolOf(d.title), color: G[idx % 6] }); t.text(s, d.title, { x: 1.55, y: 0.35, w: 7.9, h: 0.75, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.75, 26, 16, F.head, true) }); }
        G.forEach((c, k) => t.rect(s, X0 + k * (FW / 6), 1.24, FW / 6, 0.09, c, { name: 'Spectrum' }));
        t.text(s, L.runs(d.text), { x: X0, y: 1.42, w: 5.6, h: 3.56, bold: true, fontSize: L.fit(d.text, 5.6, 3.5, 32, 17, F.head, true), color: C.white, valign: 'middle' });
        if (d.caption) { t.line(s, 6.4, 1.56, 0, 3.3, G[2], 1.5); body(s, d.caption, 6.58, 1.5, 2.82, 3.44, { color: 'E4E7EC', max: 14, valign: 'middle' }); }
        t.line(s, 0.6, 5.12, 8.8, 0, C.muted, 0.75);
        t.text(s, M.topic || '', { x: 0.6, y: 5.18, w: 4.4, h: 0.25, fontSize: 9, bold: true, color: C.white });
        t.text(s, meta, { x: 4.6, y: 5.18, w: 4.8, h: 0.25, fontSize: 9, color: 'C9CED6', align: 'right' });
      },
    ],
    timeline: [
      async (d) => { // the elements as they were found: a line of years, entries up and down from it
        const s = page(d), ly = 3.14, w = 4.1, xs = [X0, 1.1, 4.98, 5.3], px = [X0, 3.86, 5.58, 7.76], pw = 1.36, ph = 0.4;
        t.line(s, X0, ly, FW, 0, C.ink, 2);
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], col = A(i + 1), y = up ? 1.26 : ly + 0.32, h = up ? ly - 0.3 - y : Y1 - y, al = up ? 'left' : 'right';
          t.rect(s, px[i], ly - ph / 2, pw, ph, col, { line: { color: C.ink, width: 1.25 }, name: 'Year tile' });
          t.text(s, it.year, { x: px[i] + 0.03, y: ly - ph / 2, w: pw - 0.06, h: ph, bold: true, fontSize: L.fit(it.year, pw - 0.1, ph - 0.06, 15, 10, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
          head(s, it.h, x, y, w, 0.3, { max: 14, align: al });
          body(s, it.t, x, y + 0.31, w, h - 0.33, { max: 13.5, align: al });
        });
      },
      async (d) => { // a spectrum: one band in four colours, a line of it for each date, entries below
        const s = page(d), cw = FW / 4, y = 1.3, h = 0.78;
        d.items.forEach((it, i) => {
          const x = X0 + i * cw, col = A(i * 2 + 1);
          t.rect(s, x, y, cw, h, col, { line: { color: C.ink, width: 1.25 }, name: 'Spectrum band' });
          t.text(s, it.year, { x: x + 0.05, y, w: cw - 0.1, h, bold: true, fontSize: L.fit(it.year, cw - 0.14, h - 0.16, 22, 11, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
          t.rect(s, x + cw / 2 - 0.01, y + h, 0.02, 0.2, C.ink, { name: 'Tick' });
          t.rect(s, x + 0.05, y + h + 0.2, cw - 0.1, Y1 - y - h - 0.2, C.white, { line: { color: col, width: 1.5 }, name: 'Entry' });
          head(s, it.h, x + 0.14, y + h + 0.27, cw - 0.28, 0.5, { max: 14, align: 'center', valign: 'top' });
          body(s, it.t, x + 0.14, y + h + 0.8, cw - 0.28, Y1 - y - h - 0.88, { max: 13.5, align: 'center' });
        });
      },
      async (d) => { // the lab log: a ruled book, a row to each entry
        const s = page(d), y0 = 1.28, h = 3.76 / 4;
        t.rect(s, X0, y0, FW, 3.76, C.white, { line: { color: C.ink, width: 1.25 }, name: 'Log' });
        t.rect(s, X0, y0, 1.9, 3.76, 'EEF0F3', { name: 'Log margin' });
        t.line(s, X0 + 1.9, y0, 0, 3.76, C.ink, 1);
        d.items.forEach((it, i) => {
          const y = y0 + i * h;
          if (i) t.line(s, X0, y, FW, 0, C.line, 1);
          t.rect(s, X0 + 0.12, y + h / 2 - 0.1, 0.2, 0.2, A(i * 2 + 1), { line: { color: C.ink, width: 0.75 }, name: 'Mini tile' });
          t.text(s, it.year, { x: X0 + 0.4, y, w: 1.44, h, bold: true, fontSize: L.fit(it.year, 1.4, h - 0.3, 18, 10.5, F.head, true), color: C.ink, valign: 'middle' });
          head(s, it.h, X0 + 2.05, y + 0.05, FW - 2.2, 0.3, { max: 14 });
          body(s, it.t, X0 + 2.05, y + 0.35, FW - 2.2, h - 0.4, { max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Element', colors: { dk1: C.ink, lt1: C.white, dk2: '343A48', lt2: C.bg, accent1: C.groups[0], accent2: C.groups[1], accent3: C.groups[2], accent4: C.groups[3], accent5: C.groups[4], accent6: C.groups[5], hlink: C.groups[3], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "ilmiy-ommabop: tushunchalarni element kabi aniq ta'riflab ber, qisqa va lo'nda", limits: { agenda_item: 26 }, prefer: 'data' };
module.exports = { id: 38, slug: 'element', name: 'Element', category: 'academic', photos: true, build, style: STYLE };
