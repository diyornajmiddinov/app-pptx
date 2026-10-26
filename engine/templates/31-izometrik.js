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
      const cfs = L.colSize(d, w - 0.85, 4.95 - 2.2, 0.2, F.body); // items shrink to fit the panel
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w - 0.85, F.body) : 0))) + 0.2);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3), f = i ? AMBER : TEAL;
        t.rect(s, x, 1.4, w, 3.45, C.white, { shadow: 0.15, blur: 8, offset: 3, name: 'Panel' });
        await C3(s, x + 0.25, 1.55, 0.6, 0.2, f);
        t.text(s, side.h, { x: x + 1.0, y: 1.5, w: w - 1.2, h: 0.5, fontSize: 19, bold: true, color: f[2], valign: 'middle' });
        let y = 2.2;
        side.items.forEach((it, k) => { t.rect(s, x + 0.35, y + 0.08, 0.12, 0.12, f[1], { rotate: 45, name: 'Bullet' }); t.text(s, it, { x: x + 0.6, y, w: w - 0.85, h: rows[k], fontSize: cfs, color: C.ink }); y += rows[k]; });
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Izometrik', colors: { dk1: C.ink, lt1: C.white, dk2: '33475B', lt2: C.bg, accent1: C.t2, accent2: C.a2, accent3: C.t3, accent4: C.a3, accent5: C.muted, accent6: C.line, hlink: C.t3, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tizimli va konstruktiv: har bir g'oya bosqichma-bosqich 'qurilgandek' bayon qilinsin", limits: {}, prefer: 'data' };
module.exports = { id: 31, slug: 'izometrik', name: 'Izometrik', category: 'business', photos: true, build, style: STYLE };
