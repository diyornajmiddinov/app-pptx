/**
 * 31 Izometrik — isometric 3D: cubes and slabs drawn in true isometric projection, photos
 * sheared onto the faces of boxes, teal and amber faces on a light dotted iso-grid.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F3F5F7', ink: '1E2A38', muted: '5F6D7C', white: 'FFFFFF', t1: '8FDDD3', t2: '2FA39A', t3: '1C736C', a1: 'F8C471', a2: 'E59A2F', a3: 'B9771E', line: 'D5DCE3' };
const F = { head: 'Arial', body: 'Arial' };
const TEAL = [C.t1, C.t2, C.t3], AMBER = [C.a1, C.a2, C.a3];

// isometric cube: width w (px), side height hs (px); faces = [top, left, right]
const cubeSvg = (w, hs, [top, left, right]) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w / 2 + hs}">
  <polygon points="${w / 2},0 ${w},${w / 4} ${w / 2},${w / 2} 0,${w / 4}" fill="#${top}"/>
  <polygon points="0,${w / 4} ${w / 2},${w / 2} ${w / 2},${w / 2 + hs} 0,${w / 4 + hs}" fill="#${left}"/>
  <polygon points="${w / 2},${w / 2} ${w},${w / 4} ${w},${w / 4 + hs} ${w / 2},${w / 2 + hs}" fill="#${right}"/></svg>`;
const gridSvg = () => { let d = ''; for (let y = -900; y < 900; y += 40) { d += `<line x1="0" y1="${y}" x2="1600" y2="${y + 800}"/><line x1="0" y1="${y + 800}" x2="1600" y2="${y}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/><g stroke="#${C.line}" stroke-width="1" stroke-opacity="0.55">${d}</g></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const grid = await L.svg(gridSvg(), 1600, 900, true);
  const memo = {}; const cube = async (w, hs, faces) => (memo[w + ':' + hs + faces] ??= await L.svg(cubeSvg(w * 100, hs * 100, faces), w * 100, (w / 2 + hs) * 100));
  const C3 = async (s, x, y, w, hs, faces) => t.img(s, await cube(w, hs, faces), x, y, w, w / 2 + hs);
  const footer = (s, dark) => {
    t.text(s, M.topic || '', { x: 0.6, y: 5.2, w: 4.6, h: 0.25, fontSize: 9, bold: true, color: dark ? C.t1 : C.t3 });
    t.text(s, meta, { x: 4.6, y: 5.2, w: 4.8, h: 0.25, fontSize: 9, color: dark ? 'B7C3CF' : C.muted, align: 'right' });
  };
  let idx = 0;
  const page = async (d, bg) => {
    const s = pres.addSlide(); s.background = bg ? { color: bg } : { data: grid }; idx++;
    await C3(s, 0.55, 0.42, 0.62, 0.22, idx % 2 ? TEAL : AMBER);
    t.text(s, L.pad2(idx), { x: 0.55, y: 0.42, w: 0.62, h: 0.31, fontSize: 10, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.4, y: 0.4, w: 8.0, h: 0.65, bold: true, color: bg ? C.white : C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.65, 28, 16, F.head, true) });
    footer(s, !!bg);
    return s;
  };
  const textBlock = (s, txt, x, y, w, h, color = C.ink) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.25), color, lineSpacingMultiple: 1.25, valign: 'middle' });
  // photo as the front face of an isometric box: top and right faces extrude up-right
  const photoBox = async (s, img, x, y, w, h, dd = 0.4) => {
    const k = 100, svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${(w + dd) * k}" height="${(h + dd / 2) * k}">
      <polygon points="0,${dd / 2 * k} ${dd * k},0 ${(w + dd) * k},0 ${w * k},${dd / 2 * k}" fill="#${C.t1}"/>
      <polygon points="${w * k},${dd / 2 * k} ${(w + dd) * k},0 ${(w + dd) * k},${h * k} ${w * k},${(h + dd / 2) * k}" fill="#${C.t3}"/></svg>`;
    t.img(s, await L.svg(svg, (w + dd) * k, (h + dd / 2) * k), x, y - dd / 2, w + dd, h + dd / 2);
    t.img(s, await L.photo(L.src(img), w, h), x, y, w, h, { alt: '' });
  };

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { data: grid }; idx++;
    // city of cubes
    const cols = [[6.2, 3.3, 1.0, 1.6, TEAL], [7.2, 3.75, 1.0, 1.0, AMBER], [8.2, 3.3, 1.0, 2.2, TEAL], [7.2, 2.85, 1.0, 2.4, TEAL], [8.7, 3.8, 0.9, 0.7, AMBER]];
    for (const [x, y, w, hs, f] of cols) await C3(s, x, y - hs + 0.6, w, hs, f);
    if (d.image) await photoBox(s, d.image, 6.3, 0.55, 2.8, 1.75, 0.35);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  |  '), { x: 0.6, y: 0.6, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.t3 });
    const fs = L.fit(d.title, 5.0, 2.3, 42, 22, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 5.0, h: 2.45, bold: true, fontSize: fs, color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.55, w: 4.8, h: 0.8, fontSize: 14, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.5, w: 4.8, h: 0.35, fontSize: 15, bold: true, color: C.a3 });
    footer(s);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) {
      const s = await page(d);
      await photoBox(s, d.image, 0.6, 1.55, 3.85, 3.1);
      textBlock(s, d.text, 5.0, 1.35, 4.4, 3.5);
    },
    async image(d) {
      const s = await page(d);
      textBlock(s, d.text, 0.6, 1.35, 4.3, 3.5);
      await photoBox(s, d.image, 5.15, 1.55, 3.85, 3.1);
    },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.5 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.35 + (i % per) * rh;
        await C3(s, x, y, 0.7, 0.28, i % 2 ? AMBER : TEAL);
        t.text(s, String(i + 1), { x, y: y + 0.02, w: 0.7, h: 0.33, fontSize: 13, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.9, y, w: 3.4, h: 0.63, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.2, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.75;
        t.rect(s, x, y, w, h, C.white, { shadow: 0.15, blur: 8, offset: 3, name: 'Card' });
        await C3(s, x + 0.2, y - 0.45, 0.8, 0.3, i % 2 ? AMBER : TEAL);
        t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.48, y - 0.4, 0.24, 0.24);
        t.text(s, it.h, { x: x + 0.25, y: y + 0.45, w: w - 0.5, h: 0.42, fontSize: L.fit(it.h, w - 0.5, 0.42, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.25, y: y + 0.9, w: w - 0.5, h: h - 1.0, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      for (const [i, st] of d.steps.entries()) { // staircase of cubes
        const x = 0.6 + i * cw, hs = 0.25 + i * 0.22, top = 2.65 - hs;
        await C3(s, x, top, 0.95, hs, i === n - 1 ? AMBER : TEAL);
        t.text(s, String(i + 1), { x, y: top, w: 0.95, h: 0.47, fontSize: 16, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: 3.2, w: cw - 0.3, h: 0.45, fontSize: L.fit(st.h, cw - 0.3, 0.45, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 3.65, w: cw - 0.3, h: 1.3, fontSize: L.fit(st.t, cw - 0.3, 1.3, 14, 11, F.body), color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.8 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * cw;
        await C3(s, px + 0.1, 1.3, 1.5, 0.9, [TEAL, AMBER, TEAL][i % 3]);
        t.text(s, x.value, { x: px + 1.75, y: 1.45, w: cw - 1.9, h: 1.0, fontSize: L.fit(x.value, cw - 1.9, 1.0, 40, 20, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.0, w: cw - 0.3, h: 1.0, fontSize: 14, color: C.muted });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.4, w: 8.8, h: 0.45, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.25;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.85, F.body, 0.2, 4.85 - 2.2);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3), f = i ? AMBER : TEAL;
        t.rect(s, x, 1.4, w, 3.45, C.white, { shadow: 0.15, blur: 8, offset: 3, name: 'Panel' });
        await C3(s, x + 0.25, 1.55, 0.6, 0.2, f);
        t.text(s, side.h, { x: x + 1.0, y: 1.5, w: w - 1.2, h: 0.5, fontSize: 19, bold: true, color: f[2], valign: 'middle' });
        let y = 2.2;
        side.items.forEach((it, k) => { t.rect(s, x + 0.35, y + 0.08, 0.12, 0.12, f[1], { rotate: 45, name: 'Bullet' }); t.text(s, it, { x: x + 0.6, y, w: w - 0.85, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await C3(s, 0.7, 1.2, 2.6, 1.6, TEAL);
      await C3(s, 2.3, 2.6, 1.4, 0.8, AMBER);
      const fs = L.fit(d.text, 5.6, 1.8, 34, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: 3.9, y: 1.3, w: 5.5, h: 2.0, fontSize: fs, bold: true, color: C.ink, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: 3.9, y: 3.5, w: 5.4, h: 1.35, fontSize: L.fit(d.caption, 5.4, 1.35, 15, 11, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * cw;
        await C3(s, x, 1.35, cw - 0.25, 0.2, i % 2 ? AMBER : TEAL);
        t.text(s, it.year, { x, y: 1.35, w: cw - 0.25, h: (cw - 0.25) / 2, fontSize: L.fit(it.year, cw - 0.9, 0.5, 22, 12, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it.h, { x, y: 2.75, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.2, w: cw - 0.3, h: 1.7, fontSize: 14, color: C.muted });
      }
    },
    async quote(d) {
      const s = await page({}, C.ink);
      await C3(s, 7.4, 1.0, 1.8, 1.2, TEAL); await C3(s, 8.3, 2.6, 1.0, 0.6, AMBER);
      const fs = L.fit(d.text, 6.4, 2.4, 32, 18, F.head, true);
      t.text(s, d.text, { x: 0.7, y: 1.2, w: 6.4, h: 2.6, fontSize: fs, bold: true, color: C.white, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 0.7, y: 4.0, w: 6.4, h: 0.4, fontSize: 15, color: C.a1, bold: true });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      for (const [i, it] of d.items.entries()) {
        const y = 1.35 + i * rh;
        await C3(s, 0.6, y + (rh - 0.38) / 2, 0.44, 0.16, i % 2 ? AMBER : TEAL);
        t.text(s, it, { x: 1.25, y, w: 8.15, h: rh, fontSize: L.fit(it, 8.15, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      }
    },
  };
  // ---- further ways to draw a type, all built in isometric: a deck's pages must not look alike (L.pages)
  const PALE = 'D5DCE3';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10, F.body, false, 1.25), color: o.color || C.ink, lineSpacingMultiple: 1.25, valign: o.valign || 'middle' });
  const cubeNum = async (s, v, x, y, w, hs, f, fs = 14) => { await C3(s, x, y, w, hs, f); t.text(s, v, { x, y, w, h: w / 2, fontSize: fs, bold: true, color: C.ink, align: 'center', valign: 'middle' }); };
  // a box seen from the front: front face (x,y,w,h) plus top and side going back up-right. mirror: the depth goes up-left
  const box = async (s, x, y, w, h, dd, [top, side], front, mirror) => {
    const k = 100, W2 = Math.round((w + dd) * k), H2 = Math.round((h + dd / 2) * k), a = dd * k, b = (dd / 2) * k, fw = w * k, fh = h * k;
    const svg = mirror
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><polygon points="${a},${b} 0,0 ${fw},0 ${fw + a},${b}" fill="#${top}"/><polygon points="${a},${b} 0,0 0,${fh} ${a},${fh + b}" fill="#${side}"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><polygon points="0,${b} ${a},0 ${fw + a},0 ${fw},${b}" fill="#${top}"/><polygon points="${fw},${b} ${fw + a},0 ${fw + a},${fh} ${fw},${fh + b}" fill="#${side}"/></svg>`;
    t.img(s, await L.svg(svg, W2, H2), mirror ? x - dd : x, y - dd / 2, w + dd, h + dd / 2);
    if (front) t.rect(s, x, y, w, h, front, { name: 'Front face' });
  };
  const V = {
    image: [
      async (d) => { // the picture lies on top of a great slab
        const s = await page(d), w = 5.2, sh = w / 2, hs = 0.42, x = 4.45, y = 1.5;
        await C3(s, x, y, w, hs, TEAL);
        t.img(s, await L.photo(L.src(d.image), w, sh, { mask: { poly: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]] } }), x, y, w, sh, { alt: d.title });
        longText(s, d.text, 0.6, 1.25, 4.05, 3.8, { max: 14 });
      },
      async (d) => { // the dark page: a long box with the picture on its front, words below
        const s = await page(d, C.ink), w = 8.35, h = 1.9, y = 1.42;
        await box(s, 0.6, y, w, h, 0.45, [C.t1, C.t3]);
        t.img(s, await L.photo(L.src(d.image), w, h), 0.6, y, w, h, { alt: d.title });
        longText(s, d.text, 0.6, y + h + 0.14, 8.8, 1.55, { color: PALE, max: 13.5, valign: 'top' });
      },
      async (d) => { // the picture fills the page, a white box stands in front of it
        const s = pres.addSlide(); s.background = { color: C.ink }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: d.title });
        t.rect(s, 0, 5.12, W, 0.51, C.ink, { name: 'Footer band' });
        footer(s, true);
        const x = 0.5, y = 0.85, w = 5.1, h = 3.95;
        await box(s, x, y, w, h, 0.55, [C.a1, C.a3], C.white);
        await cubeNum(s, L.pad2(idx), x + 0.2, y + 0.18, 0.62, 0.22, idx % 2 ? TEAL : AMBER, 10);
        head(s, d.title, x + 0.95, y + 0.12, w - 1.15, 0.72, { max: 20 });
        longText(s, d.text, x + 0.25, y + 0.95, w - 0.5, h - 1.08, { max: 13, valign: 'top' });
      },
      async (d) => { // a cube made of the picture: its outline and three edges
        const s = await page(d), w = 3.5, h = 3.85, x = 5.75, y = 1.22, cx = x + w / 2;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: [[0.5, 0], [1, 0.25], [1, 0.75], [0.5, 1], [0, 0.75], [0, 0.25]] } }), x, y, w, h, { alt: d.title });
        t.line(s, cx, y + h / 2, 0, h / 2, C.white, 2.5, { name: 'Cube edge' });
        t.line(s, x, y + h / 4, w / 2, h / 4, C.white, 2.5, { name: 'Cube edge' });
        t.line(s, cx, y + h / 4, w / 2, h / 4, C.white, 2.5, { name: 'Cube edge', flipV: true });
        longText(s, d.text, 0.6, 1.25, 4.8, 3.8, { max: 15 });
      },
    ],
    cards: [
      async (d) => { // long white slabs, a cube with its sign at the head of each
        const s = await page(d), n = d.items.length, g = 0.1, h = (3.75 - g * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.25 + i * (h + g), f = i % 2 ? AMBER : TEAL, cw = 0.92;
          t.rect(s, 1.25, y, 8.15, h, C.white, { shadow: 0.12, blur: 6, offset: 2, name: 'Slab' });
          await C3(s, 0.6, y + h / 2 - (cw / 2 + 0.26) / 2, cw, 0.26, f);
          t.img(s, await L.icon(it.icon, C.ink, 2), 0.6 + cw / 2 - 0.13, y + h / 2 - (cw / 2 + 0.26) / 2 + cw / 4 - 0.13, 0.26, 0.26);
          head(s, it.h, 1.75, y + 0.05, 2.5, h - 0.1);
          body(s, it.t, 4.35, y + 0.05, 4.9, h - 0.1, { max: 13.5, valign: 'middle' });
        }
      },
      async (d) => { // a tower of slabs at the side, a leader running from each floor to its words
        const s = await page(d), n = d.items.length, g = 3.75 / n, cw = 2.6, x = 0.55, hs = 0.24;
        for (let i = n - 1; i >= 0; i--) {
          const y = 1.22 + i * g * 0.72 + (n === 3 ? 0.25 : 0), f = i % 2 ? AMBER : TEAL;
          await C3(s, x, y, cw, hs, f);
        }
        for (const [i, it] of d.items.entries()) {
          const y0 = 1.25 + i * g, cy = 1.22 + i * g * 0.72 + (n === 3 ? 0.25 : 0) + cw / 4;
          t.line(s, x + cw, Math.min(cy, y0 + 0.17), 0.55, Math.abs(cy - y0 - 0.17), C.t3, 1, { flipV: y0 + 0.17 < cy, name: 'Leader' });
          t.img(s, await L.icon(it.icon, C.t3, 2), 3.8, y0 + 0.03, 0.28, 0.28);
          head(s, it.h, 4.18, y0, 5.22, 0.34);
          body(s, it.t, 3.8, y0 + 0.35, 5.6, g - 0.42, { max: 13 });
        }
      },
      async (d) => { // the dark page: four lit plates, each with a little block on it
        const s = await page(d, C.ink), n = d.items.length, w = 4.3, h = 1.76;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.25 + Math.floor(i / 2) * (h + 0.12), f = i % 2 ? AMBER : TEAL;
          t.rect(s, x, y, ww, h, '2B3A4B', { name: 'Plate' });
          await C3(s, x + 0.15, y + 0.15, 0.82, 0.26, f);
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.43, y + 0.23, 0.26, 0.26);
          head(s, it.h, x + 1.1, y + 0.1, ww - 1.25, 0.42, { color: f[0] });
          body(s, it.t, x + 1.1, y + 0.54, ww - 1.25, h - 0.62, { color: PALE, max: 13 });
        }
      },
      async (d) => { // white boxes on one floor, of different heights
        const s = await page(d), n = d.items.length, g = 0.42, dd = 0.28, w = (8.8 - (g * (n - 1)) - dd) / n, floor = 5.04, tops = [1.72, 1.42, 1.58, 1.42];
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + g), y = tops[i], h = floor - y, f = i % 2 ? AMBER : TEAL;
          await box(s, x, y, w, h, dd, [f[0], f[2]], C.white);
          t.img(s, await L.icon(it.icon, f[2], 2), x + 0.14, y + 0.13, 0.34, 0.34);
          head(s, it.h, x + 0.14, y + 0.5, w - 0.28, 0.52, { max: 14, valign: 'top' });
          body(s, it.t, x + 0.14, y + 1.04, w - 0.28, h - 1.12, { max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // blocks marching down an axis of the grid, each step to the right of its block
        const s = await page(d), n = d.steps.length, dy = 3.8 / n, dx = dy * 0.9, cw = 1.0;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * dx, y = 1.2 + i * dy;
          await cubeNum(s, String(i + 1), x, y, cw, 0.28, i === n - 1 ? AMBER : TEAL, 15);
          const tx = x + cw + 0.14, tw = 9.4 - tx;
          head(s, st.h, tx, y, tw, 0.32);
          body(s, st.t, tx, y + 0.33, tw, dy - 0.38, { max: 13 });
        }
      },
      async (d) => { // the dark page: lit boxes in a row, each pushing into the next
        const s = await page(d, C.ink), n = d.steps.length, dd = 0.34, g = 0.34, w = (8.8 - g * (n - 1) - dd) / n, y = 1.48, h = 3.5;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * (w + g), f = i === n - 1 ? AMBER : TEAL;
          await box(s, x, y, w, h, dd, [f[0], f[2]], f[1]);
          t.text(s, L.pad2(i + 1), { x: x + 0.14, y: y + 0.08, w: 1, h: 0.56, fontSize: 28, bold: true, color: C.ink, valign: 'middle' });
          head(s, st.h, x + 0.14, y + 0.64, w - 0.28, 0.54, { max: 14, valign: 'top' });
          body(s, st.t, x + 0.14, y + 1.2, w - 0.28, h - 1.28, { color: C.ink, max: 12.5 });
        }
      },
      async (d) => { // a tower of cubes in the middle, each floor answered to one side
        const s = await page(d), n = d.steps.length, h = 3.82 / n, cw = 0.98;
        for (let i = n - 1; i >= 0; i--) await cubeNum(s, String(i + 1), 5 - cw / 2, 1.22 + i * h, cw, h - cw / 2 + 0.02, i % 2 ? AMBER : TEAL, 15);
        d.steps.forEach((st, i) => {
          const y = 1.22 + i * h, left = i % 2 === 0, x = left ? 0.6 : 5.75, w = 3.65;
          head(s, st.h, x, y + 0.02, w, 0.32, { align: left ? 'right' : 'left', max: 15 });
          body(s, st.t, x, y + 0.34, w, h - 0.4, { align: left ? 'right' : 'left', max: 12.5 });
        });
      },
    ],
    stats: [
      async (d) => { // one great box with the lead figure, two small cubes with the rest
        const s = await page(d), [a, ...rest] = d.stats, x = 0.6, y = 1.5, w = 4.15, h = 2.45;
        await box(s, x, y, w, h, 0.55, [C.t1, C.t3], C.t2);
        t.text(s, a.value, { x: x + 0.15, y: y + 0.12, w: w - 0.3, h: 1.45, bold: true, color: C.white, valign: 'middle', align: 'center', fontSize: L.fit(a.value, w - 0.3, 1.4, 66, 30, F.head, true) });
        body(s, a.label, x + 0.2, y + 1.58, w - 0.4, 0.78, { color: C.white, max: 14, align: 'center' });
        for (const [i, q] of rest.entries()) {
          const py = 1.28 + i * 1.3, px = 5.55;
          await C3(s, px, py, 1.3, 0.5, i ? TEAL : AMBER);
          t.text(s, q.value, { x: px + 1.42, y: py - 0.02, w: 2.45, h: 0.62, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(q.value, 2.45, 0.58, 30, 16, F.head, true) });
          body(s, q.label, px + 1.42, py + 0.6, 2.45, 0.56, { max: 12 });
        }
        if (d.note) body(s, d.note, 0.6, 4.1, 4.75, 1.0, { max: 11, valign: 'middle' });
      },
      async (d) => { // the dark page: figures standing on the tops of three plinths
        const s = await page(d, C.ink), w = 2.9, hs = 0.42, cw = 8.8 / 3;
        for (const [i, x] of d.stats.entries()) {
          const px = 0.6 + i * cw + (cw - w) / 2, y = 1.28, f = i === 1 ? AMBER : TEAL;
          await C3(s, px, y, w, hs, f);
          t.text(s, x.value, { x: px + 0.5, y: y + w / 4 - 0.35, w: w - 1.0, h: 0.7, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(x.value, w - 1.0, 0.66, 28, 15, F.head, true) });
          body(s, x.label, px, y + w / 2 + hs + 0.06, w, 0.58, { color: C.white, align: 'center', max: 12.5 });
        }
        if (d.note) body(s, d.note, 0.6, 3.9, 8.8, 1.2, { color: PALE, max: 12, valign: 'middle', align: 'center' });
      },
    ],
    compare: [
      async (d) => { // two boxes facing, their depth running away from each other; the lines mirror
        const s = await page(d), y = 1.52, h = 3.5, w = 4.05;
        await box(s, 0.85, y, w, h, 0.25, [C.t1, C.t3], C.white, true);
        await box(s, 5.1, y, w, h, 0.25, [C.a1, C.a3], C.white);
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.28 : 1.0, tw = w - 0.33, align = i ? 'left' : 'right', n = side.items.length, rh = (h - 0.78) / n, f = i ? AMBER : TEAL;
          head(s, side.h, x, y + 0.1, tw, 0.52, { color: f[2], align, max: 18 });
          side.items.forEach((it, k) => body(s, it, x, y + 0.68 + k * rh, tw, rh - 0.04, { color: C.ink, align, max: 13.5, valign: 'middle' }));
        });
      },
      async (d) => { // two long boxes, one stacked on the other
        const s = await page(d), bh = 1.66, dd = 0.3;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.42 + i * (bh + 0.18), f = i ? AMBER : TEAL, w = 8.5, n = side.items.length, x0 = 2.9, cw = (0.6 + w - 0.1 - x0) / n;
          await box(s, 0.6, y, w, bh, dd, [f[0], f[2]], C.white);
          t.rect(s, 0.6, y, 2.1, bh, f[1], { name: 'Label face' });
          head(s, side.h, 0.72, y + 0.08, 1.86, bh - 0.16, { color: C.ink, max: 18 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.06, y + 0.18, 0, bh - 0.36, C.line, 0.75);
            body(s, it, x0 + k * cw + 0.02, y + 0.08, cw - 0.16, bh - 0.16, { color: C.ink, max: 13, valign: 'middle' });
          });
        }
      },
    ],
    statement: [
      async (d) => { // the sentence on the front of one white box in the middle of the floor
        const s = await page(d), x = 0.95, y = 1.5, w = 7.7, h = 3.5;
        await box(s, x, y, w, h, 0.5, [C.a1, C.a3], C.white);
        t.text(s, L.runs(d.text), { x: x + 0.35, y: y + 0.15, w: w - 0.7, h: 1.85, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(d.text, w - 0.7, 1.8, 30, 18, F.head, true) });
        t.line(s, x + w / 2 - 0.5, y + 2.08, 1.0, 0, C.a2, 2);
        if (d.caption) body(s, d.caption, x + 0.5, y + 2.18, w - 1.0, 1.24, { align: 'center', max: 12.5 });
      },
      async (d) => { // the dark page: a line of blocks marches under the words
        const s = await page(d, C.ink);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.15, w: 8.8, h: 1.75, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 8.8, 1.7, 34, 20, F.head, true) });
        for (let k = 0; k < 12; k++) await C3(s, 0.6 + k * 0.74, 3.02 + (k % 2 ? 0.05 : 0), 0.66, 0.16, k % 3 === 2 ? AMBER : TEAL);
        if (d.caption) body(s, d.caption, 0.6, 3.72, 8.8, 1.36, { color: PALE, max: 13.5 });
      },
    ],
    timeline: [
      async (d) => { // a long beam, a block on it for every year, events by turns over and under
        const s = await page(d), ly = 2.92, cxs = [1.25, 3.65, 6.05, 8.45], cw = 1.3;
        await box(s, 0.3, ly, 9.2, 0.15, 0.2, [C.t1, C.t3], C.t2);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = i < 2 ? 0.6 : 5.2, y = up ? 1.12 : ly + 0.28, w = 4.2;
          await C3(s, cxs[i] - cw / 2, ly - 0.72, cw, 0.15, i % 2 ? AMBER : TEAL);
          t.text(s, it.year, { x: cxs[i] - cw / 2 + 0.18, y: ly - 0.72, w: cw - 0.36, h: cw / 2, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.42, 0.34, 13, 9, F.head, true) });
          head(s, it.h, x, y, w, 0.32, { max: 15 });
          body(s, it.t, x, y + 0.33, w, up ? 0.74 : 1.42, { max: 12.5 });
        }
      },
      async (d) => { // the dark page: a block for each year, stepping in
        const s = await page(d, C.ink), h = 0.93;
        for (const [i, it] of d.items.entries()) {
          const y = 1.2 + i * h, x = 0.6 + i * 0.16, f = i % 2 ? AMBER : TEAL, cw = 1.42;
          await C3(s, x, y, cw, 0.12, f);
          t.text(s, it.year, { x: x + 0.2, y, w: cw - 0.4, h: cw / 2, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, cw - 0.46, 0.36, 13, 9, F.head, true) });
          head(s, it.h, 2.75, y, 2.2, h - 0.05, { color: f[0], max: 15 });
          body(s, it.t, 5.0, y, 4.4, h - 0.05, { color: PALE, max: 13, valign: 'middle' });
        }
      },
      async (d) => { // white panels leaning back in pairs, each with a year on a tile
        const s = await page(d), w = 4.1, h = 1.6, dd = 0.22;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + (i % 2) * (w + dd + 0.15), y = 1.42 + Math.floor(i / 2) * (h + 0.2), f = i % 2 ? AMBER : TEAL;
          await box(s, x, y, w, h, dd, [f[0], f[2]], C.white);
          t.rect(s, x, y, 1.15, h, f[1], { name: 'Year face' });
          t.text(s, it.year, { x: x + 0.05, y, w: 1.05, h, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.0, 0.8, 20, 11, F.head, true) });
          head(s, it.h, x + 1.26, y + 0.07, w - 1.36, 0.34, { max: 14 });
          body(s, it.t, x + 1.26, y + 0.43, w - 1.36, h - 0.5, { color: C.ink, max: 12.5 });
        }
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Izometrik', colors: { dk1: C.ink, lt1: C.white, dk2: '33475B', lt2: C.bg, accent1: C.t2, accent2: C.a2, accent3: C.t3, accent4: C.a3, accent5: C.muted, accent6: C.line, hlink: C.t3, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tizimli va konstruktiv: har bir g'oya bosqichma-bosqich 'qurilgandek' bayon qilinsin", limits: {}, prefer: 'data' };
module.exports = { id: 31, slug: 'izometrik', name: 'Izometrik', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "energetic"], "transitions": ["p14:pan|dir=\"u\"", "p14:conveyor|dir=\"l\"", "morph"], "cover": ["riseSettle", "popOver"], "mark": "bounceDrop", "deco": "drop", "sig": {"title": "riseSettle", "body": "fadeUp", "item": "bounceDrop", "image": "riseSettle", "number": "popOver", "order": "diagonal", "stagger": 0.12}, "tempo": 0.95, "kenburns": false};
