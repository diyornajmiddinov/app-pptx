/**
 * 45 Memfis — 1980s Memphis design: squiggles, zigzags, confetti and dot grids in
 * candy colours, black outlines, striped offset shadows, titles with a coloured echo.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFF6EA', ink: '151515', white: 'FFFFFF', muted: '4A4A4A', pal: ['FF8FB1', 'FFD23F', '3DCCC7', '9B5DE5', '3A86FF', 'FF7A3D'] };
const F = { head: 'Arial', body: 'Calibri' };

const shapes = {
  squiggle: (c) => `<path d="M10,60 q25,-50 50,0 t50,0 t50,0 t50,0" fill="none" stroke="#${c}" stroke-width="14" stroke-linecap="round"/>`,
  zigzag: (c) => `<polyline points="10,70 45,20 80,70 115,20 150,70 185,20" fill="none" stroke="#${c}" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>`,
  dots: (c) => Array.from({ length: 16 }, (_, k) => `<circle cx="${30 + (k % 4) * 45}" cy="${20 + Math.floor(k / 4) * 22}" r="7" fill="#${c}"/>`).join(''),
  tri: (c) => `<polygon points="100,8 190,82 10,82" fill="#${c}" stroke="#151515" stroke-width="6"/>`,
  half: (c) => `<path d="M20,82 A80,80 0 0 1 180,82 Z" fill="#${c}" stroke="#151515" stroke-width="6"/>`,
  ring: (c) => `<circle cx="100" cy="45" r="34" fill="none" stroke="#${c}" stroke-width="14"/>`,
};
const shapeSvg = (kind, c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="90">${shapes[kind](c)}</svg>`;
const stripes = (w, h, c) => { let l = ''; for (let x = -h; x < w; x += 18) l += `<line x1="${x}" y1="${h}" x2="${x + h}" y2="0"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#${c}"/><g stroke="#151515" stroke-width="5">${l}</g></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const deco = async (s, kind, k, x, y, w = 1.0, rot = 0) => { const img = (memo[kind + k] ??= await L.svg(shapeSvg(kind, C.pal[k % 6]), 200, 90)); s.addImage({ data: img, x, y, w, h: w * 0.45, rotate: rot, altText: '' }); };
  // panel: white box, black outline, striped shadow offset bottom-right
  const panel = async (s, x, y, w, h, k = 0, fill = C.white) => {
    const key = `st${Math.round(w * 10)}x${Math.round(h * 10)}${k}`;
    t.img(s, (memo[key] ??= await L.svg(stripes(Math.round(w * 100), Math.round(h * 100), C.pal[k % 6]), w * 100, h * 100)), x + 0.12, y + 0.12, w, h);
    t.rect(s, x, y, w, h, fill, { line: { color: C.ink, width: 2 }, name: 'Panel' });
  };
  const echoTitle = (s, text, x, y, w, h, fs, k = 0) => {
    t.text(s, text, { x: x + 0.04, y: y + 0.04, w, h, fontSize: fs, bold: true, color: C.pal[k % 6], valign: 'middle' });
    t.text(s, text, { x, y, w, h, fontSize: fs, bold: true, color: C.ink, valign: 'middle' });
  };
  const badge = (s, x, y, d, k, txt) => { t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: C.ink, width: 2 } }); t.text(s, String(txt), { x, y, w: d, h: d, fontSize: Math.round(d * 26), bold: true, color: C.ink, align: 'center', valign: 'middle' }); };
  const photo = async (s, src, x, y, w, h, k, round) => {
    if (round) { // circle: solid colour shadow, photo, black ring
      t.oval(s, x + 0.14, y + 0.14, w, h, C.pal[k % 6], { line: { color: C.ink, width: 2 } });
      t.img(s, await L.photo(L.src(src), w, h, { mask: 'circle' }), x, y, w, h, { alt: '' });
      t.oval(s, x, y, w, h, null, { line: { color: C.ink, width: 2.5 } });
      return;
    }
    await panel(s, x, y, w, h, k); t.img(s, await L.photo(L.src(src), w - 0.12, h - 0.12), x + 0.06, y + 0.06, w - 0.12, h - 0.12, { alt: '' });
  };
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.25, w: 8.0, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await deco(s, ['squiggle', 'zigzag', 'dots'][idx % 3], idx, 8.4, 0.3, 1.2, 0);
    await deco(s, ['tri', 'half', 'ring'][idx % 3], idx + 2, 8.95, 4.95, 0.75, 12);
    badge(s, 0.55, 0.4, 0.58, idx, idx);
    if (d.title) echoTitle(s, d.title, 1.35, 0.38, 6.9, 0.62, L.fit(d.title, 6.9, 0.62, 28, 16, F.head, true), idx);
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await deco(s, 'dots', 3, 0.4, 0.3, 1.3); await deco(s, 'squiggle', 0, 3.6, 4.75, 1.6, -6); await deco(s, 'tri', 1, 5.2, 0.35, 0.8, 18); await deco(s, 'zigzag', 2, 8.2, 4.85, 1.3, 0);
    if (d.image) await photo(s, d.image, 5.95, 0.9, 3.4, 3.4, 2, true);
    else t.oval(s, 5.95, 0.9, 3.4, 3.4, C.pal[2], { line: { color: C.ink, width: 2 } });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(' \u2022 '), { x: 0.6, y: 1.0, w: 5, h: 0.3, fontSize: 13, bold: true, color: C.pal[3] });
    echoTitle(s, d.title, 0.6, 1.35, 5.1, 2.0, L.fit(d.title, 5.1, 2.0, 42, 22, F.head, true), 0);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.4, w: 5.0, h: 0.75, fontSize: 14, color: C.muted });
    t.rect(s, 0.6, 4.2, Math.min(4.8, L.width(M.author || ' ', 15, F.head, true) + 0.5), 0.45, C.pal[1], { line: { color: C.ink, width: 2 }, name: 'Tag' });
    t.text(s, M.author || '', { x: 0.85, y: 4.2, w: 4.5, h: 0.45, fontSize: 15, bold: true, color: C.ink, valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await photo(s, d.image, 0.7, 1.45, 3.4, 3.4, 4, true); await panel(s, 4.55, 1.45, 4.85, 3.4, 1); para(s, d.text, 4.8, 1.6, 4.35, 3.1); },
    async image(d) { const s = await page(d); await panel(s, 0.6, 1.45, 4.4, 3.4, 0); para(s, d.text, 0.85, 1.6, 3.9, 3.1); await photo(s, d.image, 5.35, 1.45, 4.0, 3.4, 2); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.5 / per);
      d.items.forEach((it, i) => {
        const x = 0.7 + Math.floor(i / per) * 4.4, y = 1.45 + (i % per) * rh;
        if (i % 3 === 1) t.shape(s, 'ISOSCELES_TRIANGLE', { x, y, w: 0.68, h: 0.6, fill: { color: C.pal[i % 6] }, line: { color: C.ink, width: 2 }, objectName: 'Num' });
        else if (i % 3 === 2) t.rect(s, x + 0.04, y + 0.02, 0.58, 0.58, C.pal[i % 6], { line: { color: C.ink, width: 2 }, name: 'Num' });
        else t.oval(s, x + 0.02, y, 0.62, 0.62, C.pal[i % 6], { line: { color: C.ink, width: 2 } });
        t.text(s, String(i + 1), { x, y: y + (i % 3 === 1 ? 0.1 : 0), w: 0.66, h: 0.6, fontSize: 16, bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y, w: 3.4, h: 0.62, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.32, w = (8.7 - gap * (n - 1)) / n;
      const h = Math.min(3.3, 1.45 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.3);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        await panel(s, x, 1.5, w, h, i);
        badge(s, x + 0.2, 1.68, 0.5, i + 1, '');
        t.img(s, await L.icon(it.icon, C.ink, 2.25), x + 0.32, 1.8, 0.26, 0.26);
        t.text(s, it.h, { x: x + 0.2, y: 2.3, w: w - 0.4, h: 0.45, fontSize: L.fit(it.h, w - 0.4, 0.45, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.2, y: 2.75, w: w - 0.4, h: h - 1.35, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        badge(s, x, 1.45, 0.75, i, i + 1);
        if (i < n - 1) await deco(s, 'squiggle', i + 3, x + 0.9, 1.6, cw - 1.1, 0);
        t.text(s, st.h, { x, y: 2.45, w: cw - 0.3, h: 0.45, fontSize: L.fit(st.h, cw - 0.3, 0.45, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 2.9, w: cw - 0.3, h: 2.0, fontSize: L.fit(st.t, cw - 0.3, 2.0, 15, 11, F.body), color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.8 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * cw;
        await panel(s, px, 1.45, cw - 0.35, 1.6, i + 2, C.pal[(i + 1) % 6]);
        t.text(s, x.value, { x: px + 0.1, y: 1.45, w: cw - 0.55, h: 1.6, fontSize: L.fit(x.value, cw - 0.7, 1.2, 54, 24, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.3, w: cw - 0.35, h: 0.9, fontSize: 14, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.45, w: 8.0, h: 0.45, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.15;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.2);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.45);
        await panel(s, x, 1.45, w, 3.4, i ? 4 : 0);
        t.rect(s, x, 1.45, w, 0.55, C.pal[i ? 2 : 0], { line: { color: C.ink, width: 2 }, name: 'Header' });
        t.text(s, side.h, { x: x + 0.2, y: 1.45, w: w - 0.4, h: 0.55, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
        let y = 2.2;
        side.items.forEach((it, k) => { t.oval(s, x + 0.25, y + 0.06, 0.18, 0.18, C.pal[(k + 1) % 6], { line: { color: C.ink, width: 1.25 } }); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await panel(s, 0.9, 1.4, 8.2, 2.3, 3, C.pal[1]);
      await deco(s, 'dots', 4, 0.5, 1.05, 1.0);
      t.text(s, L.runs(d.text), { x: 1.3, y: 1.5, w: 7.4, h: 2.1, bold: true, fontSize: L.fit(d.text, 7.4, 2.0, 34, 18, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 3.95, w: 8.0, h: 1.0, fontSize: L.fit(d.caption, 8.0, 1.0, 14, 10, F.body), color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      const zz = `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="40"><polyline points="${Array.from({ length: 45 }, (_, k) => `${k * 20},${k % 2 ? 6 : 34}`).join(' ')}" fill="none" stroke="#${C.ink}" stroke-width="4" stroke-linejoin="round"/></svg>`;
      t.img(s, (memo.zz ??= await L.svg(zz, 880, 40)), 0.6, 2.2, 8.8, 0.4);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.rect(s, x, 1.35, cw - 0.4, 0.55, C.pal[i % 6], { line: { color: C.ink, width: 2 }, name: 'Year' });
        t.text(s, it.year, { x, y: 1.35, w: cw - 0.4, h: 0.55, fontSize: L.fit(it.year, cw - 0.55, 0.5, 22, 11, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, it.h, { x, y: 2.85, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.3, w: cw - 0.3, h: 1.75, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = await page({});
      await panel(s, 1.0, 1.0, 8.0, 3.3, 0, C.white);
      await deco(s, 'half', 1, 8.3, 3.95, 1.1, -10);
      t.text(s, d.text, { x: 1.5, y: 1.25, w: 7.0, h: 2.2, bold: true, fontSize: L.fit(d.text, 7.0, 2.1, 30, 16, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.5, y: 3.5, w: 7.0, h: 0.4, fontSize: 14, bold: true, color: C.pal[3], align: 'center' });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        badge(s, 0.6, y + (rh - 0.36) / 2, 0.36, i, i + 1);
        t.text(s, it, { x: 1.15, y, w: 7.4, h: rh, fontSize: L.fit(it, 7.4, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, all in the Memphis playroom: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const night = async (d) => { // the black room: candy colours on black, title with a candy echo
    const s = pres.addSlide(); s.background = { color: C.ink }; idx++;
    await deco(s, ['zigzag', 'squiggle', 'dots'][idx % 3], idx + 1, 8.4, 0.3, 1.2, 0);
    badge(s, 0.55, 0.4, 0.58, idx, idx);
    const fs = L.fit(d.title, 6.9, 0.62, 28, 16, F.head, true);
    t.text(s, d.title, { x: 1.39, y: 0.42, w: 6.9, h: 0.62, fontSize: fs, bold: true, color: C.pal[idx % 3 + 3 === 4 ? 5 : idx % 3 + 3], valign: 'middle' });
    t.text(s, d.title, { x: 1.35, y: 0.38, w: 6.9, h: 0.62, fontSize: fs, bold: true, color: C.white, valign: 'middle' });
    t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.25, w: 8.0, h: 0.22, fontSize: 8.5, color: 'D8D8D8' });
    return s;
  };
  const LIGHT = [0, 1, 2, 5]; // the candy colours black words read well on
  const V = {
    image: [
      async (d) => { // picture leaning in a slanted frame, its coloured echo behind
        const s = await page(d), w = 8.8, h = 2.0, poly = [[0.06, 0], [1, 0], [0.94, 1], [0, 1]];
        t.img(s, (memo.slant ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="200"><polygon points="53,2 878,2 827,198 2,198" fill="#${C.pal[1]}" stroke="#151515" stroke-width="4"/></svg>`, 880, 200)), 0.72, 1.4, w, h);
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly } }), 0.58, 1.28, w, h, { alt: '' });
        t.text(s, d.text, { x: 0.6, y: 3.55, w: 8.2, h: 1.55, fontSize: L.fit(d.text, 8.2, 1.55, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2 });
      },
      async (d) => { // black room: a great circle of picture with a candy twin
        const s = await night(d), dd = 3.45;
        await photo(s, d.image, 5.7, 1.4, dd, dd, 0, true);
        await deco(s, 'squiggle', 1, 4.75, 4.55, 1.25, -8);
        t.text(s, d.text, { x: 0.6, y: 1.35, w: 4.75, h: 3.1, fontSize: L.fit(d.text, 4.75, 3.1, 15, 10, F.body, false, 1.25), color: C.white, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // the picture is the wall, a yellow notice is pinned on it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        await panel(s, 0.55, 0.45, 5.3, 4.5, 2, C.pal[1]);
        badge(s, 0.75, 0.62, 0.52, idx, idx);
        t.text(s, d.title, { x: 1.42, y: 0.58, w: 4.25, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 4.25, 0.72, 20, 13, F.head, true) });
        t.text(s, d.text, { x: 0.8, y: 1.42, w: 4.8, h: 3.4, fontSize: L.fit(d.text, 4.8, 3.4, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
        t.rect(s, 0, 5.2, W, H - 5.2, C.ink, { name: 'Foot band' });
        t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.3, fontSize: 8.5, color: C.white, valign: 'middle' });
      },
      async (d) => { // the picture cut as a Memphis triangle, standing on the floor
        const s = await page(d), w = 4.6, h = 3.7, x = 0.5, y = 1.3;
        t.shape(s, 'ISOSCELES_TRIANGLE', { x: x + 0.2, y: y + 0.08, w, h, fill: { color: C.pal[idx % 6] }, line: { color: C.ink, width: 2 }, objectName: 'Echo' });
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: [[0.5, 0], [1, 1], [0, 1]] } }), x, y, w, h, { alt: '' });
        await deco(s, 'dots', idx + 3, 0.45, 1.35, 1.1);
        t.text(s, d.text, { x: 5.2, y: 1.4, w: 4.2, h: 3.5, fontSize: L.fit(d.text, 4.2, 3.5, 15, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // skyline of tiles that will not stand in line: odd ones hop up
        const s = await page(d), n = d.items.length, gap = 0.28, w = (8.6 - gap * (n - 1)) / n, h = 3.1;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), y = 1.32 + (i % 2 ? 0 : 0.56), k = LIGHT[i % 4];
          await panel(s, x, y, w, h, k + 1, C.pal[k]);
          t.oval(s, x + 0.16, y + 0.14, 0.52, 0.52, C.white, { line: { color: C.ink, width: 2 } });
          t.img(s, await L.icon(it.icon, C.ink, 2.25), x + 0.29, y + 0.27, 0.26, 0.26);
          head(s, it.h, x + 0.16, y + 0.72, w - 0.32, 0.56, { max: 15 });
          body(s, it.t, x + 0.16, y + 1.3, w - 0.32, h - 1.42, { max: 13 });
        }
      },
      async (d) => { // black room: candy tiles two by two, the third of three lies wide
        const s = await night(d), n = d.items.length, w = 4.25, h = 1.74;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.3), y = 1.32 + Math.floor(i / 2) * (h + 0.14), k = LIGHT[(i + 1) % 4];
          t.rect(s, x, y, ww, h, C.pal[k], { name: 'Tile' });
          t.rect(s, x, y, 0.72, h, C.white, { name: 'Tile edge' });
          t.img(s, await L.icon(it.icon, C.ink, 2.25), x + 0.18, y + h / 2 - 0.18, 0.36, 0.36);
          head(s, it.h, x + 0.88, y + 0.1, ww - 1.02, 0.46, { max: 15 });
          body(s, it.t, x + 0.88, y + 0.58, ww - 1.02, h - 0.66, { max: 13 });
        }
      },
      async (d) => { // a shelf of shapes: circle, triangle, square, each with its line of words
        const s = await page(d), n = d.items.length, h = 3.72 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.3 + i * h, dd = Math.min(0.72, h - 0.14), my = y + (h - dd) / 2, kind = i % 3, ic = 0.34;
          if (kind === 1) t.shape(s, 'ISOSCELES_TRIANGLE', { x: 0.6, y: my, w: dd + 0.1, h: dd, fill: { color: C.pal[LIGHT[i]] }, line: { color: C.ink, width: 2 }, objectName: 'Shape' });
          else if (kind === 2) t.rect(s, 0.65, my, dd, dd, C.pal[LIGHT[i]], { line: { color: C.ink, width: 2 }, name: 'Shape' });
          else t.oval(s, 0.65, my, dd, dd, C.pal[LIGHT[i]], { line: { color: C.ink, width: 2 } });
          t.img(s, await L.icon(it.icon, C.ink, 2.25), 0.65 + dd / 2 - ic / 2, my + dd / 2 - ic / 2 + (kind === 1 ? 0.1 : 0), ic, ic);
          head(s, it.h, 1.65, y + 0.05, 2.6, h - 0.14, { max: 17 });
          body(s, it.t, 4.35, y + 0.05, 4.5, h - 0.14, { valign: 'middle', max: 14 });
          if (i < n - 1) await deco(s, 'zigzag', i + 3, 1.65, y + h - 0.1, 0.44);
        }
      },
      async (d) => { // the toy wheel: a great ring in the middle, tiles at its corners
        const s = await page(d), n = d.items.length, w = 3.02, h = 1.8, dd = 2.0, cx = 5, cy = 3.2;
        t.oval(s, cx - dd / 2 + 0.1, cy - dd / 2 + 0.1, dd, dd, C.pal[(idx + 1) % 6], { line: { color: C.ink, width: 2 } });
        t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, C.pal[1], { line: { color: C.ink, width: 2.5 } });
        t.oval(s, cx - 0.42, cy - 0.42, 0.84, 0.84, C.bg, { line: { color: C.ink, width: 2.5 } });
        const spots = n === 3 ? [[0.6, 1.32], [0.6, 3.2], [6.38, 2.26]] : [[0.6, 1.32], [6.38, 1.32], [0.6, 3.2], [6.38, 3.2]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], k = LIGHT[(i + 2) % 4];
          await panel(s, x, y, w, h, k);
          t.img(s, await L.icon(it.icon, C.ink, 2.25), x + 0.14, y + 0.13, 0.3, 0.3);
          head(s, it.h, x + 0.52, y + 0.06, w - 0.62, 0.44, { max: 14 });
          body(s, it.t, x + 0.14, y + 0.54, w - 0.28, h - 0.62, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // the toy staircase: every block a step higher, its number on top
        const s = await page(d), n = d.steps.length, w = 8.5 / n, bot = 5.08, rise = n === 4 ? 0.5 : 0.62;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * w, y = 3.3 - i * rise + (n === 4 ? 0 : -0.25), k = LIGHT[i % 4];
          t.rect(s, x, y, w, bot - y, C.pal[k], { line: { color: C.ink, width: 2 }, name: 'Stair' });
          badge(s, x + 0.12, y - 0.38, 0.5, k + 3, i + 1);
          head(s, st.h, x + 0.12, y + 0.14, w - 0.24, 0.44, { max: 14 });
          body(s, st.t, x + 0.12, y + 0.6, w - 0.24, bot - y - 0.68, { max: 13 });
        }
      },
      async (d) => { // the page is striped in candy bands, one to a step, edge to edge
        const s = await page(d), n = d.steps.length, h = 3.76 / n;
        for (const [i, st] of d.steps.entries()) {
          const y = 1.32 + i * h;
          t.rect(s, 0, y, W, h, C.pal[LIGHT[(i + 1) % 4]], { line: { color: C.ink, width: 2 }, name: 'Band' });
          t.text(s, String(i + 1), { x: 0.5, y, w: 0.9, h, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: Math.min(44, Math.round(h * 44)) });
          head(s, st.h, 1.5, y + 0.04, 2.6, h - 0.08, { max: 17 });
          body(s, st.t, 4.2, y + 0.05, 5.3, h - 0.1, { valign: 'middle', max: 14 });
        }
      },
      async (d) => { // a squiggle runs down the middle, steps hop from side to side
        const s = await page(d), n = d.steps.length, gap = n === 4 ? 0.84 : 1.2, h = 1.2, w = 3.85, cx = 5;
        t.line(s, cx, 1.35, 0, 3.7, C.ink, 3, { dash: 'sysDot' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.32 + i * gap + (n === 4 ? 0 : 0.1), x = right ? cx + 0.48 : cx - 0.48 - w;
          await panel(s, x, y, w, h, i + 1);
          badge(s, cx - 0.27, y + 0.1, 0.54, i, i + 1);
          head(s, st.h, x + 0.16, y + 0.05, w - 0.32, 0.38, { max: 14 });
          body(s, st.t, x + 0.16, y + 0.44, w - 0.32, h - 0.5, { max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // one number in a great pink disc, two others on a shelf
        const s = await page(d), [a, ...rest] = d.stats, dd = 3.5, x = 0.6, y = 1.42;
        t.oval(s, x + 0.14, y + 0.14, dd, dd, C.pal[2], { line: { color: C.ink, width: 2 } });
        t.oval(s, x, y, dd, dd, C.pal[0], { line: { color: C.ink, width: 2.5 } });
        t.text(s, a.value, { x: x + 0.3, y: y + 0.55, w: dd - 0.6, h: 1.1, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(a.value, dd - 0.7, 1.05, 60, 24, F.head, true) });
        body(s, a.label, x + 0.55, y + 1.7, dd - 1.1, 1.15, { align: 'center', max: 14 });
        for (const [i, v] of rest.entries()) {
          const yy = 1.4 + i * 1.22;
          await panel(s, 4.65, yy, 1.95, 1.04, i + 1, C.pal[i ? 2 : 1]);
          t.text(s, v.value, { x: 4.72, y: yy, w: 1.81, h: 1.04, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(v.value, 1.75, 0.9, 32, 16, F.head, true) });
          body(s, v.label, 6.85, yy + 0.02, 2.55, 1.0, { valign: 'middle', max: 14 });
        }
        if (d.note) body(s, d.note, 4.65, 3.92, 4.25, 1.1, { max: 12, color: C.muted, valign: 'middle' });
      },
      async (d) => { // black room: three shapes hop on one floor, each with its number
        const s = await night(d), n = d.stats.length, cw = 8.8 / n, dd = 1.72;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.6 + i * cw, y = 1.3 + (i % 2 ? 0.26 : 0), px = x + (cw - dd) / 2, c = C.pal[LIGHT[i]];
          if (i === 1) t.rect(s, px, y, dd, dd, c, { line: { color: C.white, width: 2 }, name: 'Shape' });
          else t.oval(s, px, y, dd, dd, c, { line: { color: C.white, width: 2 } });
          t.text(s, v.value, { x: px + 0.1, y, w: dd - 0.2, h: dd, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(v.value, dd - 0.3, 0.9, 38, 15, F.head, true) });
          body(s, v.label, x + 0.2, 3.32, cw - 0.4, 0.72, { align: 'center', color: C.white, max: 13 });
        }
        await deco(s, 'zigzag', 1, 0.6, 3.98, 0.7);
        if (d.note) body(s, d.note, 0.6, 4.34, 8.8, 0.82, { max: 12, color: 'D8D8D8', align: 'center', valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // mirrored: a zigzag spine, the two sides lean out from it
        const s = await page(d), w = 3.95, cx = 5;
        t.img(s, (memo.zv ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="370"><polyline points="${Array.from({ length: 20 }, (_, k) => `${k % 2 ? 6 : 34},${k * 20 - 4}`).join(' ')}" fill="none" stroke="#151515" stroke-width="4"/></svg>`, 40, 370)), cx - 0.2, 1.35, 0.4, 3.7);
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.45, F.body, 0.16, 2.95);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.35 : cx - 0.35 - w, a = i ? 'left' : 'right', k = i ? 2 : 0;
          t.rect(s, x, 1.36, w, 0.56, C.pal[k], { line: { color: C.ink, width: 2 }, name: 'Tag' });
          head(s, side.h, x + 0.15, 1.36, w - 0.3, 0.56, { max: 17, align: a });
          let y = 2.1;
          side.items.forEach((it, j) => {
            t.oval(s, i ? x : x + w - 0.2, y + 0.04, 0.2, 0.2, C.pal[LIGHT[(j + i) % 4]], { line: { color: C.ink, width: 1.25 } });
            t.text(s, it, { x: i ? x + 0.32 : x, y, w: w - 0.32, h: rows[j], fontSize: fs, color: C.ink, align: a });
            y += rows[j];
          });
        }
      },
      async (d) => { // two great candy bands, one over the other, edge to edge
        const s = await page(d), h = 1.82;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.32 + i * (h + 0.1), n = side.items.length, per = Math.ceil(n / 2), rh = (h - 0.16) / per;
          t.rect(s, 0, y, W, h, C.pal[i ? 2 : 1], { line: { color: C.ink, width: 2 }, name: 'Band' });
          t.rect(s, 0.45, y + 0.3, 2.3, h - 0.6, C.ink, { name: 'Tag' });
          head(s, side.h, 0.58, y + 0.34, 2.04, h - 0.68, { color: C.white, max: 17, align: 'center' });
          side.items.forEach((it, j) => body(s, it, 3.0 + (j % 2) * 3.3, y + 0.08 + Math.floor(j / 2) * rh, 3.1, rh - 0.05, { max: 14, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // black room: the words alone among falling confetti
        const s = await night(d);
        const bits = [['tri', 0, 0.5, 1.35, 0.7, 20], ['ring', 2, 8.7, 1.25, 0.75, 0], ['half', 1, 0.55, 3.6, 0.7, -14], ['squiggle', 5, 8.0, 3.5, 1.3, 8], ['dots', 1, 4.5, 3.72, 1.0, 0]];
        for (const [kd, k, x, y, w, r] of bits) await deco(s, kd, k, x, y, w, r);
        t.text(s, L.runs(d.text), { x: 1.3, y: 1.3, w: 7.3, h: 2.35, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 7.3, 2.3, 36, 17, F.head, true) });
        if (d.caption) body(s, d.caption, 1.0, 4.14, 8.0, 1.02, { color: 'D8D8D8', align: 'center', max: 13, valign: 'middle' });
      },
      async (d) => { // the whole page turns yellow, the words leap off it, the note lies on a white tile
        const s = await page(d); s.background = { color: C.pal[1] };
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.25, w: 5.5, h: 3.2, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 5.5, 3.1, 34, 17, F.head, true) });
        await deco(s, 'squiggle', 3, 0.6, 4.45, 1.5);
        await panel(s, 6.4, 1.5, 3.0, 3.3, 3);
        if (d.caption) body(s, d.caption, 6.58, 1.62, 2.64, 3.06, { max: 13, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // a squiggle road: years hop above and below it
        const s = await page(d), axis = 3.2, w = 3.5;
        t.img(s, (memo.sq ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="40"><path d="M0,20 ${Array.from({ length: 25 }, (_, k) => `q20,${k % 2 ? 26 : -26} 40,0`).join(' ')}" fill="none" stroke="#151515" stroke-width="5"/></svg>`, 1000, 40)), 0, axis - 0.15, W, 0.3);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.6 + (i / 2) * 4.4 : 1.8 + ((i - 1) / 2) * 4.4, c = C.pal[LIGHT[i]], yw = 1.4;
          t.oval(s, x + yw / 2 - 0.12, axis - 0.12, 0.24, 0.24, c, { line: { color: C.ink, width: 2 } });
          const top = up ? 1.34 : 3.42;
          t.rect(s, x, top, yw, 0.36, c, { line: { color: C.ink, width: 2 }, name: 'Year' });
          t.text(s, it.year, { x: x + 0.04, y: top, w: yw - 0.08, h: 0.36, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, yw - 0.14, 0.32, 16, 10, F.head, true) });
          head(s, it.h, x + yw + 0.1, top, w - yw - 0.1, 0.36, { max: 13 });
          body(s, it.t, x, top + 0.42, w, 1.26, { max: 13 });
        }
      },
      async (d) => { // black room: pills walking down to the right, one to a year
        const s = await night(d), h = 0.86, step = 0.34;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * step, y = 1.32 + i * 0.95, w = 7.78, c = C.pal[LIGHT[i]];
          t.rect(s, x, y, w, h, C.white, { r: 0.43, name: 'Pill' });
          t.rect(s, x, y, 1.72, h, c, { r: 0.43, name: 'Pill year' });
          t.text(s, it.year, { x: x + 0.1, y, w: 1.52, h, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.45, 0.6, 20, 11, F.head, true) });
          head(s, it.h, x + 1.84, y + 0.05, 1.7, h - 0.1, { max: 13 });
          body(s, it.t, x + 3.6, y + 0.05, w - 3.92, h - 0.1, { max: 12, valign: 'middle' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Memfis', colors: { dk1: C.ink, lt1: C.white, dk2: '333333', lt2: C.bg, accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[4], accent6: C.pal[5], hlink: C.pal[4], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "quvnoq va ijodiy: jonli, qisqa iboralar, lekin faktlar aniq", limits: {}, prefer: 'visual' };
module.exports = { id: 45, slug: 'memfis', name: 'Memfis', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "bold"], "transitions": ["p14:ferris|dir=\"l\"", "push:u", "p14:flash"], "cover": ["bounceDrop", "popOver"], "mark": "spinIn", "deco": "spinIn", "sig": {"title": "bounceDrop", "body": "fadeUp", "item": ["spinIn", "popOver"], "image": "wedge", "number": "popOver", "order": "alternate", "stagger": 0.11}, "tempo": 0.9, "kenburns": false};
