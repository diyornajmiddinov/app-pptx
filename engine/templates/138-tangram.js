/**
 * 138 Tangram — the seven tangram pieces (two big triangles, medium triangle, two small triangles, square,
 * parallelogram) form a square on the left; pieces are numbered and colour-keyed to the ideas listed on the right.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFDF8', ink: '22223B', muted: '5C5C70', pal: ['EF476F', 'FFD166', '06D6A0', '118AB2', '073B4C', 'F78C6B', '9B5DE5'] };
const F = { head: 'Arial', body: 'Calibri' };
// 7 pieces in a 100x100 square: [points, label point]
const PIECES = [[[0, 0, 100, 0, 50, 50], [50, 18]], [[0, 0, 50, 50, 0, 100], [16, 50]], [[100, 0, 100, 50, 75, 25], [91, 24]], [[50, 50, 75, 25, 100, 50, 75, 75], [75, 50]], [[0, 100, 50, 50, 50, 100], [33, 84]], [[50, 100, 100, 50, 100, 100], [84, 84]], [[50, 50, 75, 75, 50, 100, 25, 75].slice(0, 6).concat([25, 75]).slice(0, 8), [50, 75]]];
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const tangram = async (s, x, y, sz, n, numbers = true) => { let g = ''; PIECES.forEach(([pts], i) => { const P = []; for (let j = 0; j < pts.length; j += 2) P.push(`${pts[j] * 4},${pts[j + 1] * 4}`); g += `<polygon points="${P.join(' ')}" fill="#${C.pal[i % 7]}" stroke="#FFFDF8" stroke-width="8" stroke-linejoin="round" opacity="${i < n ? 1 : 0.25}"/>`; });
    t.img(s, await k.svg(`tg${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">${g}</svg>`, 400, 400), x, y, sz, sz);
    if (numbers) PIECES.slice(0, n).forEach(([, [lx, ly]], i) => k.txt(s, String(i + 1), x + lx / 100 * sz - 0.2, y + ly / 100 * sz - 0.2, 0.4, 0.4, { size: 14, bold: true, color: [1, 2, 6].includes(i) ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' })); };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 4.85, 0.3, 4.75, 0.85, { max: 24, min: 13 }); k.txt(s, String(k.idx), 0.4, 0.25, 0.8, 0.45, { size: 14, bold: true, color: C.pal[k.idx % 7] }); k.foot(s, { x: 4.85, y: 5.32, w: 4.75, size: 7.5 }); return s; };
  // keyed list on the right: colour swatch (piece colour) + content
  const keyed = async (s, n, draw) => { await tangram(s, 0.45, 0.8, 4.2, n); const rh = 3.95 / n; for (let i = 0; i < n; i++) { const y = 1.2 + i * rh; t.rect(s, 4.85, y + 0.06, 0.16, rh - 0.12, C.pal[i % 7], { name: 'Key' }); draw(i, 5.15, y, 4.45, rh); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await tangram(s, 5.6, 0.55, 4.0, 7, false); if (d.image) await k.photo(s, d.image, 5.6 + 2.0 - 0.0, 0.55 + 1.0, 1.0, 1.0, { mask: { poly: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]] } });
      k.txt(s, k.org3, 0.5, 0.6, 4.8, 0.35, { size: 12, bold: true, color: C.pal[3] }); k.head(s, d.title, 0.5, 1.0, 4.8, 2.4, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.7, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.7, 0.45, { size: 15, bold: true, color: C.pal[0] }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0.45, 0.8, 4.2, 4.2, { mask: { poly: [[0, 0], [1, 0], [1, 1], [0, 1]] } }); await tangram(s, 3.45, 3.8, 1.2, 7, false); k.txt(s, d.text, 4.85, 1.25, 4.75, 3.9, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await keyed(s, d.items.length, (i, x, y, w, h) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 16 })); },
    async cards(d) { const s = page(d); await keyed(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 15 }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async process(d) { const s = page(d); await keyed(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.42, { max: 15 }); k.txt(s, d.steps[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async stats(d) { const s = page(d); await keyed(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, 1.7, h, { max: 36, min: 14, color: C.pal[i % 7] === 'FFD166' ? 'C99A00' : C.pal[i % 7] }); k.txt(s, d.stats[i].label, x + 1.8, y, w - 1.8, h, { max: 13, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, 0.45, 5.05, 4.2, 0.45, { max: 8.5, color: C.muted }); },
    async compare(d) { const s = page(d); await tangram(s, 0.45, 0.8, 4.2, 2); const w = 4.75, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.3, F.body, 0.08, 1.45);
      [d.left, d.right].forEach((sd, i) => { const y0 = 1.2 + i * 2.0; t.rect(s, 4.85, y0 + 0.05, 0.16, 1.85, C.pal[i], { name: 'Key' }); k.head(s, sd.h, 5.15, y0, w - 0.3, 0.4, { max: 15 }); let y = y0 + 0.43; sd.items.forEach((it, j) => { k.txt(s, it, 5.15, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); await tangram(s, 0.45, 0.8, 4.2, 7, false); k.head(s, L.runs(d.text), 4.85, 1.3, 4.75, 2.4, { max: 28, min: 14 }); if (d.caption) k.txt(s, d.caption, 4.85, 3.8, 4.75, 1.35, { max: 12, color: C.muted }); },
    async timeline(d) { const s = page(d); await keyed(s, d.items.length, (i, x, y, w, h) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.42, { max: 14 }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async quote(d) { const s = page({}); await tangram(s, 0.45, 0.8, 4.2, 7, false); k.head(s, `\u201C${d.text}\u201D`, 4.85, 1.0, 4.75, 3.0, { max: 26, min: 13, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 4.85, 4.1, 4.75, 0.45, { size: 14, bold: true, color: C.pal[0] }); },
    async sources(d) { const s = page(d); await keyed(s, d.items.length, (i, x, y, w, h) => k.txt(s, d.items[i], x, y, w, h, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, each out of the same seven pieces: a deck's pages must not look alike (L.pages)
  const DEEP = C.pal[4], YEL = C.pal[1], LIGHT = 'CFE3EA';
  const TL = [[0, 0], [1, 0], [0, 1]], BR = [[1, 0], [1, 1], [0, 1]], TR = [[0, 0], [1, 0], [1, 1]], UP = [[0.5, 0], [1, 1], [0, 1]], DIA = [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]], PARA = [[0.25, 0], [1, 0], [0.75, 1], [0, 1]], SQR = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const on = (i) => ([3, 4, 6].includes(i % 7) ? 'FFFFFF' : C.ink);
  const piece = async (s, pts, fill, x, y, w, h) => { const W = Math.round(w * 100), H = Math.round(h * 100); t.img(s, await k.svg(`pc${pts}${fill}${W}x${H}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><polygon points="${pts.map(([a, b]) => `${a * W},${b * H}`).join(' ')}" fill="#${fill}"/></svg>`, W, H), x, y, w, h); };
  const pg = (d, o = {}) => { const s = k.slide(o.bg || C.bg), ink = o.ink || C.ink; if (!o.noTitle && d.title) k.head(s, d.title, o.x ?? 0.5, o.y ?? 0.25, o.w ?? 8.2, o.h ?? 0.8, { max: o.max ?? 26, min: 13, color: ink }); k.txt(s, String(k.idx), o.nx ?? 8.9, 0.28, 0.7, 0.45, { size: 14, bold: true, color: o.num || C.pal[[0, 3, 6][k.idx % 3]], align: 'right' }); k.foot(s, { x: o.fx ?? 0.5, y: 5.32, w: o.fw ?? 9, size: 7.5, color: o.foot || C.muted }); return s; };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.18, color: C.muted, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const V = {
    image: [
      async (d) => { // a great triangle of picture stands in the corner, the words lie along its long side
        const s = pg(d, { x: 5.6, w: 3.2, h: 1.1, max: 22, fx: 4.9, fw: 4.7 });
        await k.photo(s, d.image, 0, 0, 5.9, 5.625, { mask: { poly: TL } });
        await piece(s, BR, C.pal[0], 3.3, 4.3, 1.33, 1.325);
        bd(s, d.text, 4.9, 1.5, 4.7, 3.7, { valign: 'middle', ls: 1.25, color: C.ink });
      },
      async (d) => { // the picture as a long parallelogram, its two gaps closed by triangles
        const s = pg(d);
        await piece(s, TL, C.pal[3], 0.4, 1.1, 0.92, 2.5); await piece(s, BR, C.pal[0], 8.68, 1.1, 0.92, 2.5);
        await k.photo(s, d.image, 0.4, 1.1, 9.2, 2.5, { mask: { poly: [[0.1, 0], [1, 0], [0.9, 1], [0, 1]] } });
        bd(s, d.text, 0.6, 3.68, 8.8, 1.55, { color: C.ink, valign: 'middle' });
      },
      async (d) => { // the picture stands on its point as the square piece, two triangles at its corners
        const s = pg(d, { w: 4.5, h: 1.15, max: 24, fw: 4.4 });
        await piece(s, TL, YEL, 5.0, 0.5, 1.7, 1.7); await piece(s, BR, C.pal[2], 7.7, 3.2, 2.0, 2.0);
        await k.photo(s, d.image, 5.0, 0.5, 4.7, 4.7, { mask: { poly: DIA } });
        bd(s, d.text, 0.5, 1.5, 4.4, 3.7, { valign: 'middle', ls: 1.25, color: C.ink });
      },
      async (d) => { // the picture takes the whole page, a dark slanted piece carries the words
        const s = k.slide(DEEP);
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        await piece(s, [[0, 0], [1, 0], [0.8, 1], [0, 1]], DEEP, 0, 0, 5.7, 5.625); await piece(s, BR, YEL, 8.4, 4.0, 1.6, 1.625);
        k.head(s, d.title || '', 0.45, 0.3, 3.95, 1.05, { max: 24, min: 13, color: 'FFFFFF' });
        k.txt(s, String(k.idx), 4.5, 0.3, 0.6, 0.45, { size: 14, bold: true, color: YEL });
        bd(s, d.text, 0.45, 1.45, 3.95, 3.75, { color: 'FFFFFF', valign: 'middle', max: 12.5 });
        k.foot(s, { x: 0.45, y: 5.32, w: 3.95, size: 7, color: LIGHT });
      },
    ],
    cards: [
      async (d) => { // every idea under a piece of its own shape, the icon inside it
        const s = pg(d), n = d.items.length, w = 9.0 / n, shapes = [DIA, UP, SQR, PARA];
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w, c = [3, 0, 2, 6][i], pz = i === 3 ? 1.3 : 1.05;
          await piece(s, shapes[i], C.pal[c], x, 1.15, pz, 1.05);
          t.img(s, await k.icon(it.icon, on(c) === C.ink ? C.ink : 'FFFFFF', 2), x + pz / 2 - 0.17, 1.15 + (i === 1 ? 0.5 : 0.355), 0.34, 0.34);
          hd(s, it.h, x, 2.28, w - 0.25, 0.56, { valign: 'top' });
          bd(s, it.t, x, 2.88, w - 0.25, 2.3);
        }
      },
      async (d) => { // solid tiles with one corner cut away: the icon sits in the cut
        const s = pg(d), n = d.items.length, W = 4.42, H = 1.97, cs = [YEL, C.pal[3], C.pal[2], C.pal[6]], ix = [1, 3, 2, 6];
        const boxes = n === 4 ? [[0.5, 1.15, W, H], [5.08, 1.15, W, H], [0.5, 3.24, W, H], [5.08, 3.24, W, H]] : [[0.5, 1.15, W, H * 2 + 0.12], [5.08, 1.15, W, H], [5.08, 3.24, W, H]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = boxes[i], ink = on(ix[i]);
          t.rect(s, x, y, w, h, cs[i], { name: 'Tile' });
          await piece(s, TR, C.bg, x + w - 0.8, y, 0.8, 0.8);
          t.img(s, await k.icon(it.icon, C.ink, 2), x + w - 0.36, y + 0.05, 0.3, 0.3);
          hd(s, it.h, x + 0.2, y + 0.1, w - 1.0, 0.5, { color: ink, max: h > 3 ? 20 : 15 });
          bd(s, it.t, x + 0.2, y + 0.66, w - 0.4, h - 0.76, { color: ink, max: h > 3 ? 15 : 12.5 });
        }
      },
      async (d) => { // dark page: rows step to the right, a square piece turned on its point at each
        const s = pg(d, { bg: DEEP, ink: 'FFFFFF', num: YEL, foot: LIGHT }), n = d.items.length, rh = 4.05 / n, stepx = n === 4 ? 0.3 : 0.42;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * stepx, y = 1.15 + i * rh, c = [1, 2, 5, 0][i], dd = 0.72;
          await piece(s, DIA, C.pal[c], x, y + (rh - dd) / 2, dd, dd);
          t.img(s, await k.icon(it.icon, C.ink, 2), x + 0.21, y + rh / 2 - 0.15, 0.3, 0.3);
          hd(s, it.h, x + 0.85, y + 0.04, 2.35, rh - 0.08, { color: C.pal[c] });
          bd(s, it.t, x + 3.3, y + 0.04, 9.5 - x - 3.3, rh - 0.08, { color: 'FFFFFF', valign: 'middle', max: 12.5 });
        }
      },
      async (d) => { // the whole square at the centre, ideas around it, a line from each to the middle
        const s = pg(d, { w: 8.2 }), n = d.items.length, W = 3.15, H = 1.95, cx = 5, cy = 3.2;
        const pos = n === 4 ? [[0.45, 1.15, 0], [0.45, 3.2, 0], [6.4, 1.15, 1], [6.4, 3.2, 1]] : [[0.45, 1.15, 0], [0.45, 3.2, 0], [6.4, 2.15, 1]];
        await tangram(s, cx - 1.15, cy - 1.15, 2.3, 7, false);
        for (const [i, it] of d.items.entries()) {
          const [x, y, right] = pos[i], a = right ? 'left' : 'right', c = [0, 3, 6, 2][i], ly = y + 0.27, tk = C.pal[c];
          t.line(s, right ? cx + 1.15 : x + W, ly, right ? x - cx - 1.15 : cx - 1.15 - x - W, 0, tk, 2);
          t.img(s, await k.icon(it.icon, tk, 2), right ? x : x + W - 0.34, y + 0.1, 0.34, 0.34);
          hd(s, it.h, right ? x + 0.42 : x, y, W - 0.42, 0.54, { align: a });
          bd(s, it.t, x, y + 0.58, W, H - 0.62, { align: a, max: 12 });
        }
      },
    ],
    process: [
      async (d) => { // solid steps rise to the right, each with a triangular roof
        const s = pg(d, { w: 6.2, h: 0.78, max: 24 }), n = d.steps.length, w = 10 / n, rise = n === 4 ? 0.3 : 0.42, ix = [2, 3, 6, 4], y0 = 1.65 + (n - 1) * rise;
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, y = y0 - i * rise, c = ix[i + (n === 3 ? 1 : 0)], ink = on(c);
          await piece(s, UP, C.pal[c], x, y - 0.3, w, 0.3);
          t.rect(s, x, y, w, 5.25 - y, C.pal[c], { name: 'Step' });
          k.txt(s, String(i + 1), x + 0.2, y, 0.7, 0.5, { size: 24, bold: true, font: F.head, color: ink, ls: 1, valign: 'middle' });
          hd(s, st.h, x + 0.2, y + 0.5, w - 0.38, 0.52, { color: ink, max: 14, valign: 'top' });
          bd(s, st.t, x + 0.2, y + 1.04, w - 0.36, 5.2 - y - 1.04, { color: ink, max: 12 });
        }
      },
      async (d) => { // a spine of turned squares down the middle, steps alternate left and right
        const s = pg(d), n = d.steps.length, rh = 4.08 / n, w = 4.15, dd = Math.min(0.56, rh - 0.1);
        t.line(s, 5, 1.1, 0, 4.1, C.ink, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const y = 1.12 + i * rh, right = i % 2 === 1, x = right ? 5.4 : 0.45, a = right ? 'left' : 'right', c = [3, 0, 6, 4][i];
          await piece(s, DIA, C.pal[c], 5 - dd / 2, y + (rh - dd) / 2, dd, dd);
          k.txt(s, String(i + 1), 5 - dd / 2, y + (rh - dd) / 2, dd, dd, { size: 13, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, y + 0.02, w, 0.36, { align: a, max: 14, color: C.pal[c] === C.pal[0] ? 'C92A52' : C.pal[c] });
          bd(s, st.t, x, y + 0.38, w, rh - 0.42, { align: a, max: 12, ls: 1.12 });
        }
      },
      async (d) => { // the square assembles itself: more pieces in place and a larger square under each step
        const s = pg(d), n = d.steps.length, w = 9.0 / n, lit = n === 4 ? [2, 4, 6, 7] : [2, 5, 7], sz = n === 4 ? [1.0, 1.15, 1.3, 1.45] : [1.05, 1.25, 1.45];
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * w;
          hd(s, `${i + 1}. ${st.h}`, x, 1.1, w - 0.22, 0.56, { valign: 'top' });
          bd(s, st.t, x, 1.68, w - 0.22, 1.9, { max: 12 });
          await tangram(s, x, 5.2 - sz[i], sz[i], lit[i], false);
        }
      },
      async (d) => { // dark page: one band of arrowheads crosses it, the words hang below
        const s = pg(d, { bg: DEEP, ink: 'FFFFFF', num: YEL, foot: LIGHT }), n = d.steps.length, w = 10 / n, ix = [1, 2, 5, 0];
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, c = ix[i];
          await piece(s, [[0, 0], [0.82, 0], [1, 0.5], [0.82, 1], [0, 1], [0.18, 0.5]], C.pal[c], x, 1.25, w + 0.1, 0.92);
          k.txt(s, String(i + 1), x + 0.3, 1.25, w - 0.6, 0.92, { size: 26, bold: true, font: F.head, color: C.ink, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.3, 2.3, w - 0.5, 0.56, { color: C.pal[c], valign: 'top' });
          bd(s, st.t, x + 0.3, 2.9, w - 0.5, 2.28, { color: 'FFFFFF', max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // the first figure on a great slanted piece, the two others in rows beside it
        const s = pg(d, { x: 5.1, w: 3.7, h: 0.95, max: 22, fx: 5.1, fw: 4.5 }), [a, ...rest] = d.stats;
        await piece(s, [[0, 0], [1, 0], [0.8, 1], [0, 1]], C.pal[3], 0, 0, 4.8, 5.625);
        k.head(s, a.value, 0.45, 1.25, 3.25, 1.4, { max: 60, min: 24, color: 'FFFFFF' });
        bd(s, a.label, 0.45, 2.75, 3.1, 1.3, { color: 'FFFFFF', max: 15 });
        rest.forEach((v, i) => { const y = 1.3 + i * 1.08; hd(s, v.value, 5.1, y, 1.85, 0.95, { max: 32, min: 16, color: i ? C.pal[6] : 'C92A52' }); bd(s, v.label, 7.0, y, 2.6, 0.95, { valign: 'middle', max: 12.5 }); if (!i) t.line(s, 5.1, y + 1.02, 4.5, 0, C.pal[1], 2); });
        if (d.note) bd(s, d.note, 5.1, 3.55, 4.5, 1.65, { valign: 'middle', italic: true, max: 12.5 });
      },
      async (d) => { // three squares on their points hold the figures
        const s = pg(d), w = 9.0 / 3, dd = 2.3, ix = [3, 6, 4];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * w, cx = x + w / 2;
          await piece(s, DIA, C.pal[ix[i]], cx - dd / 2, 1.05, dd, dd);
          hd(s, v.value, cx - 0.78, 1.8, 1.56, 0.8, { max: 30, min: 14, color: 'FFFFFF', align: 'center' });
          bd(s, v.label, x + 0.1, 3.38, w - 0.2, 0.72, { align: 'center', max: 12, ls: 1.1, valign: 'top' });
        }
        if (d.note) { t.line(s, 0.5, 4.14, 9, 0, C.pal[1], 2); bd(s, d.note, 0.5, 4.2, 9, 1.05, { valign: 'middle', italic: true, align: 'center', max: 12.5 }); }
      },
      async (d) => { // a whole yellow page, big figures in ink one under the other, triangles at the edge
        const s = pg(d, { bg: YEL, num: C.ink, foot: C.ink, w: 7.6 });
        await piece(s, BR, C.pal[0], 8.3, 3.9, 1.7, 1.725); await piece(s, TR, C.pal[3], 9.0, 1.05, 1.0, 1.9);
        for (const [i, v] of d.stats.entries()) {
          const y = 1.1 + i * 1.02;
          k.head(s, v.value, 0.5, y, 2.8, 0.95, { max: 44, min: 20, color: C.ink });
          t.rect(s, 3.4, y + 0.1, 0.07, 0.75, C.ink, { name: 'Rule' });
          bd(s, v.label, 3.6, y, 5.1, 0.95, { color: C.ink, valign: 'middle', max: 14 });
        }
        if (d.note) bd(s, d.note, 0.5, 4.2, 7.7, 1.03, { color: C.ink, valign: 'middle', italic: true, max: 12.5 });
      },
    ],
    compare: [
      async (d) => { // two pieces meet along one slanted edge, the sides mirrored about it
        const s = pg(d);
        await piece(s, [[0, 0], [1, 0], [0.9, 1], [0, 1]], C.pal[3], 0, 1.1, 5.25, 4.1); await piece(s, [[0.1, 0], [1, 0], [1, 1], [0, 1]], DEEP, 4.75, 1.1, 5.25, 4.1);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.3 : 0.4, w = 4.25, a = i ? 'left' : 'right', rh = 3.3 / sd.items.length;
          hd(s, sd.h, x, 1.18, w - (i ? 0 : 0.1), 0.6, { color: i ? YEL : 'FFFFFF', align: a, max: 18 });
          sd.items.forEach((it, j) => bd(s, it, x, 1.82 + j * rh, w - (i ? 0 : 0.25), rh - 0.04, { color: 'FFFFFF', align: a, valign: 'middle', max: 13 }));
        }
      },
      async (d) => { // two full-width bands, one above the other, the points of each side read across
        const s = pg(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.12 + i * 2.08, h = 2.0, c = i ? C.pal[2] : YEL, m = sd.items.length, x0 = 2.75, w = (9.65 - x0) / m;
          t.rect(s, 0, y, 10, h, c, { name: 'Band' });
          await piece(s, TL, i ? C.pal[3] : C.pal[0], 0, y, 0.5, 0.7);
          hd(s, sd.h, 0.5, y + 0.1, 2.05, h - 0.2, { max: 18, min: 12 });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.rect(s, x, y + 0.2, 0.04, h - 0.4, C.ink, { name: 'Tick' }); bd(s, it, x + 0.1, y + 0.1, w - 0.2, h - 0.2, { color: C.ink, valign: 'middle', max: 12.5, ls: 1.1 }); });
        }
      },
    ],
    statement: [
      async (d) => { // dark page, the thought large at the left, loose pieces fall at the right
        const s = pg(d, { bg: DEEP, ink: 'FFFFFF', num: YEL, foot: LIGHT, max: 18, h: 0.6, w: 7.6 });
        await piece(s, BR, C.pal[0], 7.3, 2.6, 2.7, 3.025); await piece(s, DIA, YEL, 8.0, 1.15, 1.3, 1.3); await piece(s, UP, C.pal[2], 7.0, 1.35, 0.95, 0.85);
        k.head(s, L.runs(d.text), 0.5, 0.95, 6.4, 2.6, { max: 30, min: 16, color: 'FFFFFF' });
        if (d.caption) bd(s, d.caption, 0.5, 3.65, 6.4, 1.55, { color: LIGHT, max: 13 });
      },
      async (d) => { // one yellow parallelogram from edge to edge holds the thought
        const s = pg(d);
        await piece(s, [[0.06, 0], [1, 0], [0.94, 1], [0, 1]], YEL, 0, 1.1, 10, 2.75);
        await piece(s, BR, C.pal[0], 9.4, 3.25, 0.6, 0.6); await piece(s, TL, C.pal[3], 0, 1.1, 0.6, 0.6);
        k.head(s, L.runs(d.text), 1.0, 1.2, 8.0, 2.55, { max: 30, min: 15, align: 'center' });
        if (d.caption) bd(s, d.caption, 0.6, 3.95, 8.8, 1.28, { align: 'center', valign: 'middle', max: 13 });
      },
    ],
    timeline: [
      async (d) => { // one axis across the page, turned squares on it, events above and below by turns
        const s = pg(d, { h: 0.72 }), ax = 3.18, xs = [0.5, 2.6, 4.7, 6.5], w = 3.1;
        t.line(s, 0, ax, 10, 0, C.ink, 2);
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, c = [3, 0, 6, 4][i], tone = C.pal[c] === C.pal[0] ? 'C92A52' : C.pal[c];
          await piece(s, DIA, C.pal[c], x, ax - 0.17, 0.34, 0.34);
          t.line(s, x + 0.17, up ? ax - 0.42 : ax + 0.17, 0, 0.25, C.pal[c], 1.5);
          const y = up ? 1.02 : ax + 0.45;
          k.txt(s, [{ text: `${it.year}  `, options: { color: tone } }, { text: it.h, options: { color: C.ink } }], x, y, w, 0.36, { bold: true, font: F.head, max: 13.5, min: 10, valign: 'middle', ls: 1.05 });
          bd(s, it.t, x, y + 0.38, w - 0.1, up ? ax - 0.44 - y - 0.38 : 1.2, { max: 11.5, ls: 1.12 });
        }
      },
      async (d) => { // four slanted strips of colour stand side by side, one for each period
        const s = pg(d, { h: 0.78 }), w = 2.5, sl = 0.26, ix = [2, 3, 6, 4];
        for (const [i, it] of d.items.entries()) {
          const x = i * w, c = ix[i], ink = on(c);
          await piece(s, [[sl / (w + sl), 0], [1, 0], [w / (w + sl), 1], [0, 1]], C.pal[c], x, 1.1, w + sl, 4.12);
          hd(s, it.year, x + sl + 0.1, 1.2, w - sl - 0.2, 0.55, { color: ink, max: 20, min: 12 });
          hd(s, it.h, x + 0.26, 1.82, w - 0.36, 0.5, { color: ink, max: 14, valign: 'top' });
          bd(s, it.t, x + 0.22, 2.36, w - 0.34, 2.8, { color: ink, max: 12.5 });
        }
      },
      async (d) => { // a dark slanted rail carries the years, a triangle points from each to its row
        const s = pg(d, { x: 3.2, w: 5.6, h: 0.82, max: 22, fx: 3.2, fw: 6.4 }), rh = 4.08 / 4;
        await piece(s, [[0, 0], [1, 0], [0.86, 1], [0, 1]], DEEP, 0, 0, 2.8, 5.625);
        for (const [i, it] of d.items.entries()) {
          const y = 1.14 + i * rh, c = [1, 2, 5, 0][i], rx = 2.8 - 0.14 * 2.8 * (y + rh / 2) / 5.625 - 0.02;
          hd(s, it.year, 0.3, y, 1.95, rh, { color: C.pal[c], max: 20, min: 12 });
          await piece(s, [[0, 0], [1, 0.5], [0, 1]], C.pal[c], rx, y + rh / 2 - 0.16, 0.24, 0.32);
          hd(s, it.h, 3.2, y + 0.02, 2.0, rh - 0.1, { max: 14 });
          bd(s, it.t, 5.3, y + 0.02, 4.3, rh - 0.1, { valign: 'middle', max: 12, ls: 1.1 });
          if (i) t.line(s, 3.2, y - 0.02, 6.4, 0, 'E4E0D4', 1);
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old keyed list beside the square was the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Tangram', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.pal[4], lt2: C.bg, accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[5], accent6: C.pal[6], hlink: C.pal[3], folHlink: C.muted } });
}
module.exports = { id: 138, slug: 'tangram', name: 'Tangram', category: 'creative', photos: true, build, style: { tone: "bo'laklardan butun: har bir qism o'z o'rniga ega, birgalikda to'liq manzara", limits: { card_t4: 110 }, prefer: null } };
