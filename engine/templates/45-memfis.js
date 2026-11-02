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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Memfis', colors: { dk1: C.ink, lt1: C.white, dk2: '333333', lt2: C.bg, accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[4], accent6: C.pal[5], hlink: C.pal[4], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "quvnoq va ijodiy: jonli, qisqa iboralar, lekin faktlar aniq", limits: {}, prefer: 'visual' };
module.exports = { id: 45, slug: 'memfis', name: 'Memfis', category: 'creative', photos: true, build, style: STYLE };
