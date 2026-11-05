/**
 * 133 Kesim — a geological CROSS-SECTION: wavy rock strata stacked under a grassy surface line, a depth scale
 * on the left (0 m, 10 m …), each idea is a stratum labelled on the layer; the title stands on the surface.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { sky: 'F4F8FB', ink: '2B2118', muted: '5B4B3A', grass: '6A994E', strata: ['D9B48F', 'C49A6C', 'A47551', '8B5E3C', '6F4A2F', '583822'], light: 'FFF8EE' };
const F = { head: 'Arial', body: 'Calibri' };
const TOP = 1.25, BOT = 5.2;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const strata = async (s, n) => { const H2 = (BOT - TOP) * 100, hh = H2 / n; let g = `<rect x="0" y="0" width="1000" height="10" fill="#${C.grass}"/>`;
    for (let i = 0; i < n; i++) { const y = 10 + i * (H2 - 10) / n, y2 = 10 + (i + 1) * (H2 - 10) / n, a = 8 + (i % 3) * 4; g += `<path d="M0,${y} ${Array.from({ length: 11 }, (_, j) => `Q${j * 100 + 50},${y + (j % 2 ? a : -a)} ${j * 100 + 100},${y}`).join(' ')} L1000,${y2 + 6} L0,${y2 + 6} Z" fill="#${C.strata[Math.round(i * 5 / Math.max(1, n - 1))]}"/>`;
      for (let p = 0; p < 14; p++) g += `<circle cx="${(p * 73 + i * 41) % 1000}" cy="${(y + 14 + (p * 17) % Math.max(10, y2 - y - 20)).toFixed(0)}" r="${2 + (p % 3)}" fill="#000" opacity="0.12"/>`; }
    t.img(s, await k.svg('st' + n, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${H2}">${g}</svg>`, 1000, H2), 0, TOP, 10, BOT - TOP);
    const rh = (BOT - TOP - 0.1) / n; for (let i = 0; i <= n; i++) { t.line(s, 0.15, TOP + 0.1 + i * rh, 0.25, 0, C.ink, 1); if (i < n) k.txt(s, `${i * 10} m`, 0.1, TOP + 0.12 + i * rh, 0.6, 0.22, { size: 7, bold: true, color: C.light }); }
    return Array.from({ length: n }, (_, i) => ({ y: TOP + 0.1 + i * rh, h: rh, dark: i * 5 / Math.max(1, n - 1) >= 2.5 })); };
  const page = (d) => { const s = k.slide(C.sky); if (d.title) k.head(s, d.title, 0.4, 0.3, 8.2, 0.9, { max: 26, min: 14, valign: 'bottom' }); k.txt(s, `\u2193 ${k.idx}`, 8.7, 0.3, 0.9, 0.9, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'bottom' }); return s; };
  const foot = (s) => k.foot(s, { y: 5.3, size: 7.5, color: C.ink, x: 0.4 });
  const layers = async (s, n, draw) => { const L2 = await strata(s, n); L2.forEach((b, i) => draw(i, 0.85, b.y + 0.04, 8.75, b.h - 0.08, b.dark ? C.light : C.ink, b.dark ? 'EADBC8' : C.muted)); foot(s); };
  const R = {
    async cover(d) { const s = k.slide(C.sky); t.img(s, await k.svg('cv', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="300">${C.strata.map((c, i) => `<path d="M0,${20 + i * 48} Q250,${i * 48} 500,${20 + i * 48} T1000,${20 + i * 48} L1000,300 L0,300 Z" fill="#${c}"/>`).join('')}<rect width="1000" height="12" fill="#${C.grass}"/></svg>`, 1000, 300), 0, 3.55, 10, 2.075);
      if (d.image) await k.photo(s, d.image, 6.6, 0.45, 2.9, 2.9, { mask: { r: 0.1 } }); k.txt(s, k.org3, 0.5, 0.5, 5.8, 0.35, { size: 12, bold: true, color: C.grass }); k.head(s, d.title, 0.5, 0.9, 5.9, 1.95, { max: 38, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 2.85, 5.8, 0.6, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.0, 5.0, 0.45, { size: 15, bold: true, color: C.light }); k.foot(s, { y: 5.3, size: 7.5, color: C.light }); },
    async intro(d) { const s = page(d); const Lr = await strata(s, 2); await k.photo(s, d.image, 6.4, TOP + 0.25, 3.2, 3.5, { mask: { r: 0.08 } }); t.rect(s, 0.75, TOP + 0.2, 5.5, 3.6, C.light, { t: 12, name: 'Plate' }); k.txt(s, d.text, 0.85, TOP + 0.2, 5.3, 3.6, { max: 15, min: 10, ls: 1.3, valign: 'middle', color: C.ink }); foot(s); void Lr; },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await layers(s, d.items.length, (i, x, y, w, h, c) => k.head(s, d.items[i], x, y, w, h, { max: 16, color: c })); },
    async cards(d) { const s = page(d); await layers(s, d.items.length, (i, x, y, w, h, c, c2) => { k.head(s, d.items[i].h, x, y, 2.6, h, { max: 15, color: c }); k.txt(s, d.items[i].t, x + 2.75, y, w - 2.75, h, { max: 13, color: c, valign: 'middle' }); }); },
    async process(d) { const s = page(d); await layers(s, d.steps.length, (i, x, y, w, h, c) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, 2.6, h, { max: 15, color: c }); k.txt(s, d.steps[i].t, x + 2.75, y, w - 2.75, h, { max: 13, color: c, valign: 'middle' }); }); },
    async stats(d) { const s = page(d); await layers(s, d.stats.length + (d.note ? 1 : 0), (i, x, y, w, h, c) => { if (i === d.stats.length) return k.txt(s, d.note, x, y, w, h, { max: 11, color: c, italic: true, valign: 'middle' }); k.head(s, d.stats[i].value, x, y, 2.6, h, { max: 40, min: 16, color: c }); k.txt(s, d.stats[i].label, x + 2.75, y, w - 2.75, h, { max: 14, color: c, valign: 'middle' }); }); },
    async compare(d) { const s = page(d); const Lr = await strata(s, 3); const w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.2, F.body, 0.1, 3.1);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.35 : 0.85; t.rect(s, x - 0.1, TOP + 0.25, w + 0.1, 3.75, C.light, { t: 15, name: 'Core sample' }); k.head(s, sd.h, x, TOP + 0.3, w - 0.1, 0.45, { max: 16 }); let y = TOP + 0.8; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w - 0.2, rr[j], { size: fs }); y += rr[j]; }); }); foot(s); void Lr; },
    async statement(d) { const s = page(d); await strata(s, 3); t.rect(s, 0.85, TOP + 0.35, 8.3, 2.3, C.light, { t: 8, name: 'Plate' }); k.head(s, L.runs(d.text), 1.05, TOP + 0.4, 7.9, 2.2, { max: 30, min: 14, align: 'center' }); if (d.caption) k.txt(s, d.caption, 0.85, TOP + 2.8, 8.3, 1.05, { max: 12, color: C.light, align: 'center' }); foot(s); },
    async timeline(d) { const s = page(d); await layers(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].year, x, y, 1.3, h, { max: 20, min: 11, color: c }); k.head(s, d.items[i].h, x + 1.4, y, 2.2, h, { max: 14, color: c }); k.txt(s, d.items[i].t, x + 3.75, y, w - 3.75, h, { max: 12, color: c, valign: 'middle' }); }); },
    async quote(d) { const s = page({}); await strata(s, 2); k.head(s, `\u201C${d.text}\u201D`, 0.85, TOP + 0.2, 8.6, 2.2, { max: 28, min: 14, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 0.85, TOP + 2.6, 8.6, 0.45, { size: 14, bold: true, color: C.light }); foot(s); },
    async sources(d) { const s = page(d); await layers(s, d.items.length, (i, x, y, w, h, c) => k.txt(s, d.items[i], x, y, w, h, { max: 12, color: c, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all dug out of the same ground: a deck's pages must not look alike (L.pages)
  const DEEP = '2E1E13', ROCK = '583822', SAND = 'EADBC8', SEAM = 'E9B44C', MUD = '8B5E3C', TAN = 'D9B48F';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, color: C.ink, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.ink, ...o });
  // wavy layers from a given height to the page's foot, in the given colours, a grass line on top if asked
  const ground = async (s, top, tones, o = {}) => { const P = 100, H0 = 562.5, y0 = top * P, n = tones.length, h = (H0 - y0) / n; let g = '';
    tones.forEach((c, i) => { const y = y0 + i * h, a = 7 + (i % 3) * 4; g += `<path d="M0,${y} ${Array.from({ length: 11 }, (_, j) => `Q${j * 100 + 50},${y + (j % 2 ? a : -a)} ${j * 100 + 100},${y}`).join(' ')} L1000,${H0} L0,${H0} Z" fill="#${c}"/>`; for (let p = 0; p < 12; p++) g += `<circle cx="${(p * 83 + i * 37) % 1000}" cy="${(y + 12 + (p * 19) % Math.max(10, h - 18)).toFixed(0)}" r="${2 + (p % 3)}" fill="#000" opacity="0.12"/>`; });
    if (o.grass !== false) g += `<rect x="0" y="${y0 - 5}" width="1000" height="10" fill="#${C.grass}"/>`;
    t.img(s, await k.svg(`gr${top}${tones.join('')}${o.grass !== false}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${g}</svg>`, 1000, 563), 0, 0, 10, 5.625); };
  const plate = (s, x, y, w, h, o = {}) => t.rect(s, x, y, w, h, o.fill ?? C.light, { r: o.r ?? 0.06, line: o.line ?? { type: 'none' }, name: 'Plate' });
  const mark = (s, v, x, y, dd, f = C.grass, ink = 'FFFFFF') => { t.oval(s, x, y, dd, dd, f); k.txt(s, String(v), x, y, dd, dd, { size: Math.round(dd * 34), bold: true, font: F.head, color: ink, align: 'center', valign: 'middle', ls: 1 }); };
  const under = (s) => k.foot(s, { y: 5.32, size: 7.5, x: 0.4, color: C.light });
  const rockPage = async (d, o = {}) => { const s = k.slide(DEEP); await ground(s, 0, [DEEP, '38261A', DEEP, '38261A'], { grass: false }); if (d.title) k.head(s, d.title, 0.4, 0.22, o.w ?? 8.1, 0.72, { max: 24, min: 13, color: C.light }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.22, 0.9, 0.72, { size: 16, bold: true, color: SEAM, align: 'right', valign: 'middle' }); under(s); return s; };
  const V = {
    image: [
      async (d) => { // the picture is the land above; the words are carried by the first layer under the grass
        const s = k.slide(C.sky), hh = 2.5;
        await k.photo(s, d.image, 0, 0, 10, hh);
        await ground(s, hh, [ROCK, '4A2F1C', ROCK], {});
        k.head(s, d.title || '', 0.4, hh + 0.08, 8.1, 0.62, { max: 22, min: 13, color: SEAM });
        k.txt(s, `↓ ${k.idx}`, 8.7, hh + 0.08, 0.9, 0.62, { size: 16, bold: true, color: C.light, align: 'right', valign: 'middle' });
        bd(s, d.text, 0.4, hh + 0.72, 9.2, 5.26 - hh - 0.72, { color: C.light, max: 13, valign: 'middle', ls: 1.1 });
        under(s);
      },
      async (d) => { // a drill core pulled from the ground: the picture stands in a tall rounded cylinder at the right
        const s = k.slide(C.sky), cw = 2.7, cx = 6.95, top = 1.25;
        await ground(s, top, C.strata.slice(0, 5));
        k.head(s, d.title || '', 0.4, 0.3, 6.3, 0.9, { max: 24, min: 14, valign: 'bottom' });
        k.txt(s, `↓ ${k.idx}`, 5.4, 0.08, 1.2, 0.3, { size: 14, bold: true, color: C.grass, align: 'right', valign: 'middle' });
        t.img(s, await L.photo(L.src(d.image), cw, 5.1, { mask: { r: 0.9 } }), cx, 0.26, cw, 5.1, { alt: '' });
        t.rect(s, cx, 0.26, cw, 5.1, null, { r: 0.33, line: { color: DEEP, width: 2.5 }, name: 'Core' });
        plate(s, 0.4, top + 0.2, 6.2, 3.74);
        bd(s, d.text, 0.6, top + 0.26, 5.8, 3.62, { max: 14, valign: 'middle', ls: 1.22 });
        under(s);
      },
      async (d) => { // deep in the rock a cave opens, and the picture is the light at its mouth
        const s = await rockPage(d, { w: 4.6 }), W0 = 4.7, H0 = 4.2, x = 5.0, y = 0.98;
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: { path: 'M0.02,1 C0,0.62 0.06,0.3 0.26,0.14 C0.42,0 0.62,0.02 0.76,0.12 C0.94,0.28 1,0.6 0.98,1 C0.8,0.95 0.62,1 0.5,0.97 C0.34,1 0.18,0.95 0.02,1 Z' } }), x, y, W0, H0, { alt: '' });
        bd(s, d.text, 0.4, 1.1, 4.3, 4.08, { color: C.light, max: 13.5, ls: 1.2 });
      },
      async (d) => { // the picture fills the page; a wall of rock with a broken edge rises at its right, the words on it
        const s = k.slide(DEEP), ex = 4.7; let p = `M1000,0 L${ex * 100},0 `;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        for (let i = 1; i <= 9; i++) p += `L${ex * 100 + (i % 2 ? 26 : -22) * ((i % 3) + 1) / 2},${i * 62.5} `;
        t.img(s, await k.svg('wall', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563"><path d="${p} L1000,563 Z" fill="#${ROCK}"/></svg>`, 1000, 563), 0, 0, 10, 5.625);
        k.head(s, d.title || '', ex + 0.55, 0.3, 3.5, 1.1, { max: 22, min: 13, color: SEAM, valign: 'top' });
        k.txt(s, `↓ ${k.idx}`, 8.7, 0.3, 0.9, 0.4, { size: 16, bold: true, color: C.light, align: 'right', valign: 'middle' });
        bd(s, d.text, ex + 0.55, 1.46, 4.3, 3.74, { color: C.light, max: 13.5 });
        k.foot(s, { x: ex + 0.55, y: 5.32, w: 4.3, size: 7, color: C.light });
      },
    ],
    cards: [
      async (d) => { // drill cores laid side by side: banded rock at the head of each, the words below it
        const s = page(d), n = d.items.length, w = 9.2 / n, y0 = 1.3, H = 3.9; t.rect(s, 0, 1.2, 10, 0.08, C.grass, { name: 'Grass' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.05, ww = w - 0.1, cap = 0.86;
          t.rect(s, x, y0, ww, H, C.light, { r: 0.1, line: { color: MUD, width: 1.25 }, name: 'Core' });
          [TAN, 'C49A6C', 'A47551', MUD].forEach((c, j) => t.rect(s, x + 0.02, y0 + 0.02 + j * cap / 4, ww - 0.04, cap / 4, c, { name: 'Band' }));
          t.oval(s, x + ww / 2 - 0.32, y0 + 0.11, 0.64, 0.64, C.light); t.img(s, await k.icon(it.icon, ROCK, 2), x + ww / 2 - 0.17, y0 + 0.26, 0.34, 0.34);
          hd(s, it.h, x + 0.1, y0 + cap + 0.06, ww - 0.2, 0.56, { align: 'center', max: 14, valign: 'top' });
          bd(s, it.t, x + 0.1, y0 + cap + 0.64, ww - 0.2, H - cap - 0.7, { align: 'center', max: 12.5 });
        }
        k.foot(s, { y: 5.32, size: 7.5, x: 0.4 });
      },
      async (d) => { // fossils lie embedded in the rock, each idea a rounded find at its own depth
        const s = k.slide(C.sky), n = d.items.length, top = 1.25, w = 4.5, h = 1.8; await ground(s, top, C.strata.slice(1, 6));
        k.head(s, d.title || '', 0.4, 0.3, 8.2, 0.9, { max: 26, min: 14, valign: 'bottom' }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.3, 0.9, 0.9, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'bottom' });
        for (const [i, it] of d.items.entries()) {
          const row = Math.floor(i / 2), x = n === 3 && i === 2 ? 2.75 : 0.4 + (i % 2) * (w + 0.2), y = top + 0.14 + row * (h + 0.14) + (i % 2 && n === 4 ? 0 : 0);
          plate(s, x, y, w, h, { r: 0.26, line: { color: ROCK, width: 1.5 } });
          t.oval(s, x + 0.16, y + 0.14, 0.62, 0.62, MUD); t.img(s, await k.icon(it.icon, C.light, 2), x + 0.31, y + 0.29, 0.32, 0.32);
          hd(s, it.h, x + 0.88, y + 0.12, w - 1.04, 0.58, { max: 14.5 });
          bd(s, it.t, x + 0.2, y + 0.78, w - 0.4, h - 0.86, { max: 12.5, ls: 1.08 });
        }
        under(s);
      },
      async (d) => { // a mine: one shaft down the middle, galleries driven to left and right at each level
        const s = await rockPage(d), n = d.items.length, cx = 5, sw = 0.5, y0 = 1.02, w = 4.1, spots = n === 4 ? [[0, 0], [1, 0.34], [0, 2.1], [1, 2.44]] : [[0, 0], [1, 1.06], [0, 2.1]], hh = n === 4 ? 1.74 : 1.98;
        t.rect(s, cx - sw / 2, 0.98, sw, 4.28, '8A6B4E', { name: 'Shaft' });
        for (const [i, it] of d.items.entries()) {
          const [side, dy] = spots[i], y = y0 + dy, x = side ? cx + sw / 2 : cx - sw / 2 - w, hg = Math.min(hh, 5.24 - y);
          t.rect(s, x, y, w, hg, '8A6B4E', { name: 'Gallery' }); plate(s, side ? x + 0.0 : x, y + 0.05, w, hg - 0.1, { fill: C.light, r: 0.03 });
          t.img(s, await k.icon(it.icon, ROCK, 2), side ? x + 0.14 : x + w - 0.48, y + 0.13, 0.34, 0.34);
          hd(s, it.h, side ? x + 0.56 : x + 0.12, y + 0.09, w - 0.68, 0.44, { align: side ? 'left' : 'right', max: 14 });
          bd(s, it.t, x + 0.14, y + 0.54, w - 0.28, hg - 0.62, { align: side ? 'left' : 'right', max: 12, ls: 1.06 });
        }
      },
      async (d) => { // a volcano in section: its pipe rises from the deep through the layers, ideas stand on either flank
        const s = k.slide(C.sky), n = d.items.length, w = 3.25, spots = n === 4 ? [[0, 1.26], [1, 1.26], [0, 3.28], [1, 3.28]] : [[0, 1.26], [1, 2.28], [0, 3.28]], hh = 1.92; await ground(s, 3.65, C.strata.slice(2, 6));
        t.img(s, await k.svg('volcano', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563"><polygon points="290,470 455,120 545,120 710,470" fill="#6F4A2F"/><polygon points="483,510 490,120 510,120 517,510" fill="#D1495B"/><ellipse cx="500" cy="505" rx="110" ry="20" fill="#D1495B"/></svg>`, 1000, 563), 0, 0, 10, 5.625);
        k.head(s, d.title || '', 0.4, 0.2, 8.1, 0.86, { max: 24, min: 14 }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.2, 0.9, 0.86, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? 9.6 - w : 0.4;
          plate(s, x, y, w, hh, { line: { color: MUD, width: 1 } });
          t.img(s, await k.icon(it.icon, ROCK, 2), x + 0.12, y + 0.08, 0.32, 0.32);
          hd(s, it.h, x + 0.52, y + 0.05, w - 0.62, 0.42, { max: 13.5 });
          bd(s, it.t, x + 0.14, y + 0.5, w - 0.28, hh - 0.56, { max: 12 });
        }
        under(s);
      },
    ],
    process: [
      async (d) => { // an open quarry: the benches step down to the right, the work of each cut into its face
        const s = k.slide(C.sky), n = d.steps.length, w = 10 / n, tops = n === 4 ? [1.26, 1.68, 2.1, 2.52] : [1.26, 1.82, 2.38], tones = ['EBD8BE', 'E0C7A5', 'D6B690', 'CBA57C'];
        k.head(s, d.title || '', 0.4, 0.25, 8.2, 0.95, { max: 26, min: 14, valign: 'bottom' }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.25, 0.9, 0.5, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'middle' });
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, y = tops[i], ink = C.ink;
          t.rect(s, x, y, w, 5.625 - y, tones[i], { name: 'Bench' }); t.rect(s, x, y - 0.03, w, 0.06, C.grass, { name: 'Grass' });
          mark(s, i + 1, x + 0.2, y + 0.12, 0.44, ROCK, C.light);
          hd(s, st.h, x + 0.72, y + 0.08, w - 0.84, 0.52, { max: 13.5, min: 10, color: ink });
          bd(s, st.t, x + 0.2, y + 0.64, w - 0.36, 5.26 - y - 0.64, { color: ink, max: 12.5 });
        }
        k.foot(s, { y: 5.34, size: 7.5, x: 0.4, color: C.ink, w: 8.8 });
      },
      async (d) => { // a drill string runs down a column of rock at the left; each stop is a step, read at the right
        const s = k.slide(C.sky), n = d.steps.length, y0 = 1.28, rh = (5.2 - y0) / n, cw = 2.1;
        k.head(s, d.title || '', 0.4, 0.28, 8.1, 0.9, { max: 26, min: 14, valign: 'bottom' }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.28, 0.9, 0.9, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'bottom' });
        t.line(s, 0, 1.24, 10, 0, C.grass, 3.5);
        C.strata.slice(0, 6).forEach((c, i) => t.rect(s, 0, 1.26 + i * (4.365 / 6), cw, 4.365 / 6, c, { name: 'Layer' }));
        const bx = 1.05; t.rect(s, bx - 0.05, 1.24, 0.1, 3.62, C.ink, { name: 'Drill' }); t.img(s, await k.svg('bit', `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><polygon points="0,0 60,0 30,60" fill="#${C.ink}"/></svg>`, 60, 60), bx - 0.16, 4.84, 0.32, 0.32);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh;
          mark(s, i + 1, bx - 0.24, y + 0.04, 0.48, C.light, C.ink);
          t.line(s, bx + 0.24, y + 0.28, cw - bx + 0.12, 0, C.ink, 1, { dash: 'dash' });
          hd(s, st.h, cw + 0.32, y + 0.04, 7.2, 0.38);
          bd(s, st.t, cw + 0.32, y + 0.42, 7.2, rh - 0.48, { max: 13.5, color: C.muted });
        }
        k.foot(s, { x: cw + 0.32, y: 5.32, w: 7.2, size: 7.5, color: C.muted });
      },
      async (d) => { // water seeps down through the layers, from plate to plate, turning at each one
        const s = k.slide(C.sky), n = d.steps.length, top = 1.25, w = 5.4, ind = (9.2 - w), rh = (5.22 - top - 0.1) / n; await ground(s, top, C.strata.slice(0, 5));
        k.head(s, d.title || '', 0.4, 0.3, 8.1, 0.9, { max: 26, min: 14, valign: 'bottom' }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.3, 0.9, 0.9, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'bottom' });
        for (const [i, st] of d.steps.entries()) {
          const x = i % 2 ? 0.4 + ind : 0.4, y = top + 0.12 + i * rh, hg = rh - 0.08;
          if (i < n - 1) { const my = y + hg + 0.04, a = i % 2 ? 0.4 + ind + 0.7 : 0.4 + w - 0.7, b = i % 2 ? 0.4 + w - 0.7 : 0.4 + ind + 0.7; t.line(s, Math.min(a, b), my, Math.abs(a - b), 0, '1D6FA5', 2.25, { dash: 'dash' }); }
          plate(s, x, y, w, hg);
          mark(s, i + 1, x + 0.1, y + 0.08, 0.4, '1D6FA5');
          hd(s, st.h, x + 0.6, y + 0.04, w - 0.7, 0.34, { max: 13.5 });
          bd(s, st.t, x + 0.6, y + 0.38, w - 0.72, hg - 0.42, { max: 12, ls: 1.05 });
        }
        under(s);
      },
      async (d) => { // deep underground: two seams of rock, the work passes from one to the other
        const s = await rockPage(d), n = d.steps.length, w = 3.6, sx = (9.2 - w) / (n - 1), ys = [1.02, 3.2], hh = 2.0;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * sx, y = ys[i % 2], c = i % 2 ? TAN : SEAM;
          if (i < n - 1) { const lx = x + sx + 0.2; t.line(s, lx, ys[0] + hh, 0, ys[1] - ys[0] - hh, SEAM, 2); }
          t.rect(s, x, y, w, hh, ROCK, { r: 0.04, line: { color: c, width: 1 }, name: 'Seam' });
          mark(s, i + 1, x + 0.1, y + 0.08, 0.42, c, DEEP);
          hd(s, st.h, x + 0.62, y + 0.04, w - 0.72, 0.48, { color: c, max: 14 });
          bd(s, st.t, x + 0.14, y + 0.56, w - 0.28, hh - 0.62, { color: C.light, max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // three boreholes of one depth, sunk side by side, a number at each collar
        const s = k.slide(C.sky), top = 1.25, w = 9.2 / 3; await ground(s, top, C.strata.slice(0, 6));
        k.head(s, d.title || '', 0.4, 0.3, 8.1, 0.9, { max: 26, min: 14, valign: 'bottom' }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.3, 0.9, 0.9, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'bottom' });
        const H = d.note ? 2.6 : 3.8;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w + 0.07, ww = w - 0.14;
          plate(s, x, top + 0.14, ww, H, { r: 0.08, line: { color: ROCK, width: 1.5 } });
          k.head(s, v.value, x + 0.08, top + 0.26, ww - 0.16, 1.1, { max: 40, min: 18, color: ROCK, align: 'center', ls: 1 });
          t.line(s, x + 0.5, top + 1.42, ww - 1, 0, C.grass, 2);
          bd(s, v.label, x + 0.16, top + 1.5, ww - 0.32, H - 1.42, { align: 'center', max: 13 });
        }
        if (d.note) { t.rect(s, 0.47, 4.08, 9.06, 1.14, DEEP, { r: 0.06, t: 15, name: 'Note' }); bd(s, d.note, 0.65, 4.12, 8.7, 1.06, { color: C.light, valign: 'middle', italic: true, max: 12.5 }); }
        under(s);
      },
      async (d) => { // deep underground: a gold seam runs through the dark, the lead number sits in it
        const s = await rockPage(d), [a, ...rest] = d.stats, sy = 1.08, sh = 1.62;
        t.img(s, await k.svg('seam', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="162"><path d="M0,16 Q250,-8 500,12 T1000,10 L1000,150 Q750,170 500,146 T0,146 Z" fill="#${SEAM}"/></svg>`, 1000, 162), 0, sy, 10, sh);
        k.head(s, a.value, 0.4, sy + 0.14, 4.6, sh - 0.28, { max: 60, min: 26, color: DEEP, ls: 1 });
        bd(s, a.label, 5.1, sy + 0.2, 4.5, sh - 0.4, { color: DEEP, max: 16, valign: 'middle' });
        for (const [i, v] of rest.entries()) {
          const x = 0.4 + i * 4.75;
          k.head(s, v.value, x, 2.84, 4.4, 0.66, { max: 30, min: 16, color: SEAM });
          bd(s, v.label, x, 3.5, 4.4, 0.56, { color: C.light, max: 13 });
        }
        if (d.note) { t.line(s, 0.4, 4.12, 9.2, 0, MUD, 0.75); bd(s, d.note, 0.4, 4.18, 9.2, 1.06, { color: SAND, italic: true, max: 12.5 }); }
      },
      async (d) => { // three peaks of equal height on the skyline: a number on each, its meaning in the rock beneath
        const s = k.slide(C.sky), base = 2.82, w = 10 / 3; await ground(s, base, [ROCK, '4A2F1C', ROCK]);
        k.head(s, d.title || '', 0.4, 0.14, 8.1, 0.66, { max: 22, min: 13 }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.14, 0.9, 0.66, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'middle' });
        const ps = [0, 1, 2].map((i) => `<polygon points="${i * 333},${base * 100} ${i * 333 + 166},${0.82 * 100} ${(i + 1) * 333},${base * 100}" fill="#${C.strata[i + 1]}"/>`).join('');
        t.img(s, await k.svg('peaks', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${ps}</svg>`, 1000, 563), 0, 0, 10, 5.625);
        for (const [i, v] of d.stats.entries()) {
          const x = i * w;
          k.head(s, v.value, x + 0.62, base - 0.86, w - 1.24, 0.76, { max: 28, min: 14, color: C.ink, align: 'center', ls: 1 });
          bd(s, v.label, x + 0.3, base + 0.1, w - 0.6, 0.76, { color: C.light, align: 'center', max: 13 });
        }
        if (d.note) { t.line(s, 0.4, base + 0.92, 9.2, 0, MUD, 0.75); bd(s, d.note, 0.4, base + 0.98, 9.2, 5.26 - base - 0.98, { color: SAND, italic: true, max: 13, align: 'center', valign: 'middle' }); }
        under(s);
      },
    ],
    compare: [
      async (d) => { // a fault cuts the ground on a slant: the layers on one side have slipped against the other
        const s = k.slide(C.sky), top = 1.25, w = 4.05, y0 = 1.92, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.3, F.body, 0.13, 5.14 - y0);
        let g = ''; const L0 = 125, tn = C.strata.slice(0, 5); tn.forEach((c, i) => { const y = L0 + i * 88, dy = 34; g += `<polygon points="0,${y} 530,${y} 470,${y + 88 + 1} 0,${y + 88 + 1}" fill="#${c}"/><polygon points="530,${y + dy} 1000,${y + dy} 1000,${y + dy + 89} 470,${y + dy + 89}" fill="#${c}"/>`; });
        g = `<rect x="470" y="${L0}" width="530" height="${563 - L0}" fill="#${tn[0]}"/><rect x="0" y="${L0 + 440}" width="1000" height="10" fill="#${tn[4]}"/>${g}<line x1="530" y1="${L0}" x2="456" y2="563" stroke="#D1495B" stroke-width="4"/>`;
        t.img(s, await k.svg('fault', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${g}</svg>`, 1000, 563), 0, 0, 10, 5.625);
        k.head(s, d.title || '', 0.4, 0.3, 8.1, 0.9, { max: 24, min: 14, valign: 'bottom' }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.3, 0.9, 0.9, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'bottom' });
        [d.left, d.right].forEach((sd, i) => { const x = i ? 5.55 : 0.4, a = i ? 'left' : 'right', c = i ? ROCK : C.grass;
          plate(s, x, 1.34, w, 3.86); k.head(s, sd.h, x + 0.15, 1.4, w - 0.3, 0.46, { max: 16, min: 12, color: i ? ROCK : '3F6B2B', align: a }); let y = y0;
          sd.items.forEach((it, j) => { k.txt(s, it, x + 0.15, y, w - 0.3, rr[j], { size: fs, align: a, ls: 1 }); y += rr[j]; }); });
        under(s);
      },
      async (d) => { // above the grass and below it: one side stands in the sky, the other lies in the rock
        const s = k.slide(C.sky), ya = 3.1; await ground(s, ya, [ROCK, '4A2F1C']);
        k.head(s, d.title || '', 0.4, 0.2, 8.1, 0.7, { max: 24, min: 13 }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.2, 0.9, 0.7, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'middle' });
        [[d.left, 0.94, C.ink, '3F6B2B', ya - 0.06], [d.right, ya + 0.12, C.light, SEAM, 5.24]].forEach(([sd, y, ink, c, e]) => {
          k.head(s, sd.h, 0.4, y, 9.2, 0.42, { max: 16, min: 12, color: c });
          const n = sd.items.length, w = 9.2 / n;
          sd.items.forEach((it, j) => { const x = 0.4 + j * w; k.txt(s, String(j + 1), x, y + 0.46, 0.4, 0.34, { size: 15, bold: true, font: F.head, color: c }); bd(s, it, x, y + 0.8, w - 0.16, e - y - 0.82, { color: ink, max: 12.5, ls: 1.08 }); });
        });
        under(s);
      },
    ],
    statement: [
      async (d) => { // deep underground: only a thin gold seam and the sentence
        const s = await rockPage(d);
        k.head(s, L.runs(d.text), 0.8, 1.06, 8.4, 2.4, { max: 30, min: 15, color: C.light, align: 'center' });
        t.img(s, await k.svg('vein', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="30"><path d="M0,16 Q125,4 250,14 T500,14 T750,16 T1000,12" fill="none" stroke="#${SEAM}" stroke-width="5"/></svg>`, 1000, 30), 0, 3.48, 10, 0.3);
        if (d.caption) bd(s, d.caption, 0.8, 3.84, 8.4, 1.38, { color: SAND, align: 'center', max: 13 });
      },
      async (d) => { // the sentence alone in the open sky, its note lying under the grass
        const s = k.slide(C.sky), ya = 3.62; await ground(s, ya, [ROCK, '4A2F1C']);
        k.txt(s, d.title || '', 0.4, 0.26, 7.8, 0.4, { max: 15, min: 12, bold: true, color: C.muted, valign: 'middle', font: F.head });
        k.txt(s, `↓ ${k.idx}`, 8.7, 0.26, 0.9, 0.4, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'middle' });
        k.head(s, L.runs(d.text), 0.4, 0.72, 9.2, 2.8, { max: 34, min: 16, color: '3F6B2B' });
        if (d.caption) bd(s, d.caption, 0.4, ya + 0.14, 9.2, 5.26 - ya - 0.14, { color: C.light, max: 13, valign: 'middle' });
        under(s);
      },
    ],
    timeline: [
      async (d) => { // a stratigraphic log: one narrow column of the ages, oldest at the foot, each with its entry alongside
        const s = page(d), y0 = 1.28, rh = (5.22 - y0) / 4, cx = 0.4, cw = 1.55; t.line(s, 0, 1.25, 10, 0, C.grass, 3.5);
        const ord = [...d.items.keys()].reverse();
        for (const [r, idx] of ord.entries()) {
          const it = d.items[idx], y = y0 + r * rh, c = C.strata[1 + idx];
          t.rect(s, cx, y, cw, rh, c, { line: { color: DEEP, width: 0.75 }, name: 'Bed' });
          k.head(s, it.year, cx + 0.05, y, cw - 0.1, rh, { max: 15, min: 10, color: idx >= 2 ? C.light : C.ink, align: 'center', ls: 1 });
          t.line(s, cx + cw, y + rh - 0.01, 8.05, 0, TAN, 0.75);
          hd(s, it.h, cx + cw + 0.2, y + 0.04, 7.45, 0.36);
          bd(s, it.t, cx + cw + 0.2, y + 0.4, 7.45, rh - 0.46, { max: 12.5, color: C.muted, ls: 1.08 });
        }
        k.foot(s, { y: 5.32, size: 7.5, x: 0.4 });
      },
      async (d) => { // deep underground: one gold seam across the page, events above and below it by turns
        const s = await rockPage(d), ya = 3.06, w = 4.35;
        t.line(s, 0, ya, 10, 0, SEAM, 3);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.45 + i * 2.28, x = 0.4 + Math.floor(i / 2) * 4.75;
          t.oval(s, xn, ya - 0.1, 0.2, 0.2, up ? SEAM : C.light);
          k.head(s, it.year, xn + 0.24, up ? ya - 0.38 : ya + 0.06, 1.9, 0.32, { max: 14, min: 10, color: up ? SEAM : C.light });
          if (up) { hd(s, it.h, x, 0.96, w, 0.36, { color: C.light }); bd(s, it.t, x, 1.32, w, ya - 0.44 - 1.32, { color: SAND, max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.42, w, 0.36, { color: C.light }); bd(s, it.t, x, ya + 0.78, w, 5.24 - ya - 0.78, { color: SAND, max: 12.5 }); }
        }
      },
      async (d) => { // shafts sunk from the surface: each later year goes deeper, with its story written down the shaft
        const s = k.slide(C.sky), top = 1.25, w = 9.2 / 4, ends = [3.92, 4.28, 4.64, 5.2]; await ground(s, top, C.strata.slice(1, 6));
        k.head(s, d.title || '', 0.4, 0.3, 8.1, 0.9, { max: 26, min: 14, valign: 'bottom' }); k.txt(s, `↓ ${k.idx}`, 8.7, 0.3, 0.9, 0.9, { size: 16, bold: true, color: C.grass, align: 'right', valign: 'bottom' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.06, ww = w - 0.12, e = ends[i];
          plate(s, x, top - 0.04, ww, e - top + 0.04, { r: 0.04, line: { color: DEEP, width: 1.25 } });
          t.rect(s, x, top - 0.04, ww, 0.44, ROCK, { name: 'Collar' });
          k.head(s, it.year, x + 0.06, top - 0.04, ww - 0.12, 0.44, { max: 15, min: 10, color: SEAM, align: 'center', ls: 1 });
          hd(s, it.h, x + 0.1, top + 0.42, ww - 0.2, 0.34, { max: 13, min: 10 });
          bd(s, it.t, x + 0.1, top + 0.76, ww - 0.2, e - top - 0.82, { max: 12, ls: 1.08 });
        }
        under(s);
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Kesim', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '583822', lt2: C.sky, accent1: C.grass, accent2: C.strata[2], accent3: C.strata[0], accent4: C.strata[4], accent5: C.muted, accent6: C.strata[1], hlink: C.grass, folHlink: C.muted } });
}
module.exports = { id: 133, slug: 'kesim', name: 'Kesim', category: 'academic', photos: true, build, style: { tone: "chuqurlashib boruvchi tahlil: sirtdan ildizgacha, qatlam-qatlam ochib beriladi", limits: {}, prefer: 'text' } };
