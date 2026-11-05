/** 149 Yo'l belgilari — ROAD SIGNS: green highway guide signs, blue information plates, speed-limit discs for numbers, arrow signs for directions, all on grey posts above the verge. */
const { kit, L, rowsFit } = require('../free.js');
const C = { sky: 'E6EEF4', green: '00704A', blue: '005BAC', brown: '6B3E26', yellow: 'F7C600', red: 'D52B1E', post: '8C8F94', white: 'FFFFFF', ink: '1C1C1C', verge: 'A3B18A' };
const F = { head: 'Arial', body: 'Arial' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const sign = (s, x, y, w, h, fill, posts = 2) => { const py = y + h; for (let p = 0; p < posts; p++) t.rect(s, x + (posts === 1 ? w / 2 - 0.06 : (p ? w * 0.75 : w * 0.25) - 0.06), py, 0.12, 5.2 - py, C.post, { name: 'Post' }); t.rect(s, x, y, w, h, fill, { r: 0.1, name: 'Sign' }); t.rect(s, x + 0.06, y + 0.06, w - 0.12, h - 0.12, null, { r: 0.07, line: { color: C.white, width: 2 }, name: 'Border' }); return { x: x + 0.2, y: y + 0.12, w: w - 0.4, h: h - 0.24 }; };
  const shield = (s, x, y, n, fill = C.blue) => { t.shape(s, 'FLOWCHART_OFFPAGE_CONNECTOR', { x, y, w: 0.5, h: 0.55, fill: { color: fill }, line: { color: C.white, width: 1.5 }, objectName: 'Route shield' }); k.txt(s, String(n), x, y, 0.5, 0.45, { size: 13, bold: true, color: C.white, align: 'center', valign: 'middle' }); };
  const verge = (s) => { t.rect(s, 0, 5.2, 10, 0.425, C.verge, { name: 'Verge' }); };
  const page = (d) => { const s = k.slide(C.sky); verge(s); const b = sign(s, 0.35, 0.15, 9.3, 0.8, C.green, 0); if (d.title) k.head(s, d.title, b.x, b.y, b.w - 0.8, b.h, { max: 22, min: 12, color: C.white }); shield(s, 9.0, 0.27, k.idx, C.red); k.foot(s, { y: 5.32, size: 7.5, color: C.ink }); return s; };
  // a row of signs on posts
  const row = (s, n, fill, draw, top = 1.25, h = 2.95) => { const gap = 0.25, w = (9.3 - gap * (n - 1)) / n; for (let i = 0; i < n; i++) draw(i, sign(s, 0.35 + i * (w + gap), top, w, h, typeof fill === 'function' ? fill(i) : fill, 1)); };
  const R = {
    async cover(d) { const s = k.slide(C.sky); verge(s); const b = sign(s, 0.4, 0.4, 6.2, 3.0, C.green); shield(s, b.x, b.y + 0.05, k.M.year ? String(k.M.year).slice(-2) : '1', C.blue); k.head(s, d.title, b.x, b.y + 0.65, b.w, 1.6, { max: 30, min: 14, color: C.white, valign: 'top' }); k.txt(s, `\u2192  ${k.M.author || ''}`, b.x, b.y + 2.3, b.w, 0.45, { size: 15, bold: true, color: C.white });
      const b2 = sign(s, 0.9, 3.75, 4.6, 0.85, C.blue, 0); k.txt(s, k.org3, b2.x, b2.y, b2.w, b2.h, { max: 12, bold: true, color: C.white, valign: 'middle' }); if (d.image) { const b3 = sign(s, 7.0, 0.8, 2.6, 2.6, C.brown); await k.photo(s, d.image, b3.x - 0.05, b3.y + 0.05, b3.w + 0.1, b3.h - 0.1); } k.foot(s, { y: 5.32, size: 7.5, color: C.ink }); },
    async intro(d) { const s = page(d); const a = sign(s, 0.35, 1.2, 3.6, 3.0, C.brown); await k.photo(s, d.image, a.x - 0.05, a.y + 0.05, a.w + 0.1, a.h - 0.1); const b = sign(s, 4.2, 1.2, 5.45, 3.0, C.blue); k.txt(s, d.text, b.x, b.y, b.w, b.h, { max: 13, min: 9.5, color: C.white, ls: 1.25, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); const b = sign(s, 1.2, 1.2, 7.6, 3.4, C.green); const n = d.items.length, rh = b.h / n; d.items.forEach((it, i) => { shield(s, b.x, b.y + i * rh + (rh - 0.55) / 2, i + 1); k.head(s, `${it}  \u2192`, b.x + 0.7, b.y + i * rh, b.w - 0.7, rh, { max: 16, color: C.white }); }); },
    async cards(d) { const s = page(d); row(s, d.items.length, (i) => [C.blue, C.green, C.brown, C.blue][i % 4], (i, b) => { k.head(s, d.items[i].h, b.x, b.y, b.w, 0.45, { max: 14, color: C.white }); k.txt(s, d.items[i].t, b.x, b.y + 0.5, b.w, b.h - 0.5, { max: 12, color: C.white }); }); },
    async process(d) { const s = page(d), n = d.steps.length, gap = 0.12, w = (9.3 - gap * (n - 1)) / n; d.steps.forEach((st, i) => { const x = 0.35 + i * (w + gap); t.rect(s, x + w / 2 - 0.06, 3.9, 0.12, 1.3, C.post, { name: 'Post' }); t.shape(s, 'PENTAGON', { x, y: 1.25, w, h: 2.65, fill: { color: i === n - 1 ? C.green : C.blue }, line: { color: C.white, width: 2 }, objectName: 'Arrow sign' }); k.head(s, `${i + 1}. ${st.h}`, x + 0.15, 1.35, w - 0.55, 0.5, { max: 14, color: C.white }); k.txt(s, st.t, x + 0.15, 1.85, w - 0.6, 1.95, { max: 12, color: C.white }); }); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 9.3 / n; d.stats.forEach((v, i) => { const x = 0.35 + i * w, dd = Math.min(1.9, w - 0.5); t.rect(s, x + w / 2 - 0.06, 1.25 + dd, 0.12, 5.2 - 1.25 - dd, C.post, { name: 'Post' }); t.oval(s, x + (w - dd) / 2, 1.2, dd, dd, C.white, { line: { color: C.red, width: 9 } }); k.head(s, v.value, x + (w - dd) / 2 + 0.2, 1.2, dd - 0.4, dd, { max: 40, min: 14, align: 'center', color: C.ink }); const b = sign(s, x + 0.15, 1.3 + dd, w - 0.3, 1.0, C.white, 0); t.rect(s, x + 0.21, 1.36 + dd, w - 0.42, 0.88, null, { r: 0.07, line: { color: C.ink, width: 1.5 }, name: 'Border' }); k.txt(s, v.label, b.x, b.y, b.w, b.h, { max: 12, align: 'center', valign: 'middle' }); }); if (d.note) k.txt(s, d.note, 0.4, 4.6, 9.2, 0.55, { max: 9, color: C.ink }); },
    async compare(d) { const s = page(d), w = 4.5, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 1.4, F.body, 0.08, 2.5); [d.left, d.right].forEach((sd, i) => { const x = 0.35 + i * 4.8; t.rect(s, x + w / 2 - 0.06, 4.35, 0.12, 0.85, C.post, { name: 'Post' }); t.shape(s, 'PENTAGON', { x, y: 1.2, w, h: 3.15, fill: { color: i ? C.green : C.blue }, line: { color: C.white, width: 2 }, flipH: !i, objectName: 'Direction sign' }); const tx = x + (i ? 0.2 : 1.2); k.head(s, `${i ? '' : '\u2190 '}${sd.h}${i ? ' \u2192' : ''}`, tx, 1.3, w - 1.4, 0.45, { max: 15, color: C.white }); let y = 1.8; sd.items.forEach((it, j) => { k.txt(s, it, tx, y, w - 1.4, rr[j], { size: fs, color: C.white }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); const b = sign(s, 1.0, 1.25, 8.0, 2.8, C.yellow); t.rect(s, 1.06, 1.31, 7.88, 2.68, null, { r: 0.07, line: { color: C.ink, width: 2 }, name: 'Border' }); k.head(s, L.runs(d.text), b.x, b.y, b.w, b.h, { max: 28, min: 13, align: 'center', color: C.ink }); if (d.caption) { t.rect(s, 0.4, 4.25, 9.2, 0.9, C.white, { r: 0.05, name: 'Plate' }); k.txt(s, d.caption, 0.55, 4.27, 8.9, 0.86, { max: 11.5, color: C.ink, align: 'center', valign: 'middle', ls: 1.05 }); } },
    async timeline(d) { const s = page(d); row(s, d.items.length, C.brown, (i, b) => { k.head(s, d.items[i].year, b.x, b.y, b.w, 0.5, { max: 22, min: 11, color: C.yellow }); k.head(s, d.items[i].h, b.x, b.y + 0.52, b.w, 0.42, { max: 13, color: C.white }); k.txt(s, d.items[i].t, b.x, b.y + 0.96, b.w, b.h - 0.96, { max: 11, color: C.white }); }); },
    async quote(d) { const s = page({}); const b = sign(s, 1.0, 1.25, 8.0, 3.0, C.brown); k.head(s, `\u201C${d.text}\u201D`, b.x, b.y, b.w, b.h - 0.5, { max: 24, min: 12, italic: true, color: C.white, align: 'center' }); if (d.author) k.txt(s, d.author, b.x, b.y + b.h - 0.45, b.w, 0.4, { size: 13, bold: true, color: C.yellow, align: 'center' }); },
    async sources(d) { const s = page(d); const b = sign(s, 0.6, 1.2, 8.8, 3.45, C.blue); const n = d.items.length, rh = b.h / n; d.items.forEach((it, i) => k.txt(s, `${i + 1}. ${it}`, b.x, b.y + i * rh, b.w, rh, { max: 11, color: C.white, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all along the same road: a deck's pages must not look alike (L.pages)
  const { green: GRN, blue: BLU, brown: BRN, yellow: YEL, red: RED, post: PST, white: WH, ink: INK } = C, TAR = '2E3236', PALE = 'E6E8EA';
  const poly = async (s, pts, fill, x, y, w, h, stroke) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100), sw = stroke ? 6 : 0, P = pts.map(([a, b]) => `${sw + a * (W2 - 2 * sw)},${sw + b * (H2 - 2 * sw)}`).join(' '); t.img(s, await k.svg(`pl${pts}${fill}${stroke}${W2}x${H2}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><polygon points="${P}" fill="#${fill}" ${stroke ? `stroke="#${stroke}" stroke-width="${sw * 2}" stroke-linejoin="round"` : ''}/></svg>`, W2, H2), x, y, w, h); };
  const TRI = [[0.5, 0], [1, 1], [0, 1]], DIA = [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]], OCT = [[0.1, 0], [0.9, 0], [1, 0.28], [1, 0.72], [0.9, 1], [0.1, 1], [0, 0.72], [0, 0.28]];
  const plate = (s, x, y, w, h, fill = WH, line = INK) => t.rect(s, x, y, w, h, fill, { r: 0.05, line: { color: line, width: 1.25 }, name: 'Plate' });
  const stick = (s, cx, y0, y1 = 5.2) => t.rect(s, cx - 0.05, y0, 0.1, y1 - y0, PST, { name: 'Post' });
  const road = (d, o = {}) => { const s = k.slide(TAR); if (d.title) k.head(s, d.title, 0.4, 0.15, 8.3, 0.72, { max: 22, min: 12, color: WH }); shield(s, 9.0, 0.22, k.idx, RED); if (!o.noEdge) { t.rect(s, 0, 0.9, 10, 0.05, YEL, { name: 'Edge' }); } k.foot(s, { x: 0.4, y: 5.32, w: 9.2, size: 7.5, color: PALE }); return s; };
  const dash = (s, x, y, w, h = 0, c = WH, wt = 3) => t.line(s, x, y, w, h, c, wt, { dash: 'lgDash' });
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13.5, min: 10, ls: 1.15, color: INK, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 11, color: INK, ...o });
  const V = {
    image: [
      async (d) => { // an overhead gantry carries the picture, the words on a plate beneath it
        const s = page(d);
        t.rect(s, 0.3, 1.05, 0.14, 4.15, PST, { name: 'Pylon' }); t.rect(s, 9.56, 1.05, 0.14, 4.15, PST, { name: 'Pylon' }); t.rect(s, 0.3, 1.15, 9.4, 0.08, PST, { name: 'Beam' });
        t.rect(s, 0.65, 1.08, 8.7, 2.12, BLU, { r: 0.06, line: { color: WH, width: 2 }, name: 'Screen' });
        await k.photo(s, d.image, 0.73, 1.16, 8.54, 1.96);
        plate(s, 0.65, 3.32, 8.7, 1.8);
        bd(s, d.text, 0.82, 3.36, 8.36, 1.72, { valign: 'middle' });
      },
      async (d) => { // the picture is a great disc in a red ring on its post, an information board at its side
        const s = page(d), dd = 3.45, x = 5.95, y = 1.08, cx = x + dd / 2;
        stick(s, cx, y + dd - 0.1);
        t.oval(s, x, y, dd, dd, WH, { line: { color: RED, width: 11 } });
        await k.photo(s, d.image, x + 0.16, y + 0.16, dd - 0.32, dd - 0.32, { mask: 'circle' });
        plate(s, 0.35, 1.12, 5.35, 3.98);
        bd(s, d.text, 0.5, 1.18, 5.05, 3.86, { valign: 'middle', ls: 1.22, max: 14 });
      },
      async (d) => { // on the tarmac: the picture in a yellow warning diamond, the words on the dark road
        const s = road(d), dd = 4.2, x = 0.2, y = 1.05, b = 0.16;
        await poly(s, DIA, YEL, x, y, dd, dd);
        await k.photo(s, d.image, x + b, y + b, dd - 2 * b, dd - 2 * b, { mask: { poly: DIA } });
        dash(s, 4.62, 1.05, 0, 4.15);
        bd(s, d.text, 4.85, 1.08, 4.8, 4.1, { color: WH, valign: 'middle', ls: 1.22, max: 14 });
      },
      async (d) => { // the picture fills the page, one big green guide sign stands in front on two posts
        const s = k.slide(C.sky), x = 0.45, y = 0.5, w = 5.6, h = 4.2;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, x + w * 0.25 - 0.06, y + h, 0.12, 5.3 - y - h, PST, { name: 'Post' }); t.rect(s, x + w * 0.75 - 0.06, y + h, 0.12, 5.3 - y - h, PST, { name: 'Post' });
        t.rect(s, x, y, w, h, GRN, { r: 0.1, name: 'Sign' }); t.rect(s, x + 0.06, y + 0.06, w - 0.12, h - 0.12, null, { r: 0.07, line: { color: WH, width: 2 }, name: 'Border' });
        k.head(s, d.title || '', x + 0.22, y + 0.13, w - 1.05, 0.9, { max: 20, min: 12, color: WH });
        shield(s, x + w - 0.72, y + 0.2, k.idx, RED);
        bd(s, d.text, x + 0.22, y + 1.05, w - 0.44, h - 1.18, { color: WH, valign: 'middle', max: 13 });
        t.rect(s, 0, 5.28, 10, 0.345, C.verge, { name: 'Verge' }); k.foot(s, { x: 0.4, y: 5.34, w: 9.2, size: 7.5, color: INK });
      },
    ],
    cards: [
      async (d) => { // warning triangles on posts, the icon in each, a small plate of words hung under it
        const s = page(d), n = d.items.length, w = 9.3 / n, tw = 1.25, th = 1.1;
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * w, cx = x + w / 2;
          stick(s, cx, 2.1, 2.42);
          await poly(s, TRI, WH, cx - tw / 2, 1.05, tw, th, RED);
          t.img(s, await k.icon(it.icon, INK, 2), cx - 0.18, 1.55, 0.36, 0.36);
          plate(s, x + 0.06, 2.38, w - 0.12, 2.8);
          hd(s, it.h, x + 0.14, 2.42, w - 0.28, 0.56, { align: 'center', max: 13 });
          bd(s, it.t, x + 0.14, 2.98, w - 0.28, 2.16, { align: 'center', max: 12.5, ls: 1.1 });
        }
      },
      async (d) => { // square blue information signs: a white pictogram panel at the left of each
        const s = page(d), n = d.items.length, W = 4.55, H = 1.98, pos = n === 4 ? [[0.35, 1.08, W], [5.1, 1.08, W], [0.35, 3.18, W], [5.1, 3.18, W]] : [[0.35, 1.08, W], [5.1, 1.08, W], [0.35, 3.18, 9.3]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w] = pos[i];
          t.rect(s, x, y, w, H, BLU, { r: 0.08, line: { color: WH, width: 2 }, name: 'Sign' });
          t.rect(s, x + 0.14, y + 0.14, 0.82, 0.82, WH, { r: 0.05, name: 'Pictogram' });
          t.img(s, await k.icon(it.icon, BLU, 2), x + 0.3, y + 0.3, 0.5, 0.5);
          hd(s, it.h, x + 1.08, y + 0.1, w - 1.22, 0.86, { color: WH, max: 16 });
          bd(s, it.t, x + 0.16, y + 1.0, w - 0.32, H - 1.06, { color: WH, max: 12, ls: 1.05 });
        }
      },
      async (d) => { // on the tarmac: one lane to each idea, a painted arrow leading it
        const s = road(d), n = d.items.length, rh = 4.25 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 0.95 + i * rh;
          if (i) dash(s, 0, y, 10);
          await poly(s, [[0, 0.3], [0.6, 0.3], [0.6, 0], [1, 0.5], [0.6, 1], [0.6, 0.7], [0, 0.7]], WH, 0.35, y + rh / 2 - 0.28, 0.95, 0.56);
          t.img(s, await k.icon(it.icon, YEL, 2), 1.45, y + rh / 2 - 0.2, 0.4, 0.4);
          hd(s, it.h, 2.0, y + 0.04, 2.4, rh - 0.08, { color: YEL, max: 15 });
          bd(s, it.t, 4.5, y + 0.04, 5.15, rh - 0.08, { color: WH, valign: 'middle', max: 13, ls: 1.08 });
        }
      },
      async (d) => { // a fingerpost: one pole, arms pointing left and right by turns
        const s = page(d), n = d.items.length, h = 4.08 / n, cx = 5.0, W = 4.6;
        t.rect(s, cx - 0.08, 0.98, 0.16, 4.22, PST, { name: 'Pole' });
        for (const [i, it] of d.items.entries()) {
          const y = 1.04 + i * h, right = i % 2 === 0, x = right ? cx : cx - W, hh = h - 0.08, col = [GRN, BLU, BRN, GRN][i], tx = right ? x + 0.12 : x + 0.42;
          t.shape(s, 'PENTAGON', { x, y, w: W, h: hh, fill: { color: col }, line: { color: WH, width: 1.5 }, ...(right ? {} : { flipH: true }), objectName: 'Arm' });
          t.img(s, await k.icon(it.icon, WH, 2), tx, y + 0.06, 0.3, 0.3);
          hd(s, it.h, tx + 0.36, y + 0.04, W - 1.0, 0.32, { color: WH, max: 13 });
          bd(s, it.t, tx, y + 0.38, W - 0.6, hh - 0.42, { color: WH, max: 12, ls: 1.03 });
        }
      },
    ],
    process: [
      async (d) => { // the road climbs a hill, a sign at each stage, higher along the grade
        const s = page(d), n = d.steps.length, w = 9.3 / n, rise = n === 4 ? 0.28 : 0.4, y0 = 1.1 + (n - 1) * rise, H = n === 4 ? 2.7 : 2.8;
        t.img(s, await k.svg(`hill${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="150"><polygon points="0,150 1000,0 1000,150" fill="#${C.verge}"/></svg>`, 1000, 150), 0, 3.7, 10, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * w, y = y0 - i * rise, cx = x + w / 2, c = [BLU, GRN, BRN, RED][i + (n === 3 ? 1 : 0)];
          stick(s, cx, y + H);
          t.rect(s, x + 0.05, y, w - 0.1, H, c, { r: 0.08, line: { color: WH, width: 2 }, name: 'Sign' });
          shield(s, x + 0.14, y + 0.1, i + 1, c === BLU ? GRN : BLU);
          hd(s, st.h, x + 0.7, y + 0.08, w - 0.88, 0.58, { color: WH, max: 13 });
          bd(s, st.t, x + 0.16, y + 0.72, w - 0.32, H - 0.8, { color: WH, max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // a straight road runs up the page, route shields on its centre line, plates on each verge
        const s = page(d), n = d.steps.length, rh = 4.1 / n, w = 3.95;
        t.rect(s, 4.45, 0.95, 1.1, 4.27, TAR, { name: 'Road' }); dash(s, 5, 0.95, 0, 4.27);
        for (const [i, st] of d.steps.entries()) {
          const y = 1.04 + i * rh, right = i % 2 === 1, x = right ? 5.68 : 0.37, a = right ? 'left' : 'right', c = y + rh / 2;
          shield(s, 4.75, c - 0.28, i + 1, i === n - 1 ? GRN : BLU);
          plate(s, x, y + 0.02, w, rh - 0.08);
          hd(s, st.h, x + 0.12, y + 0.05, w - 0.24, 0.32, { align: a, max: 13 });
          bd(s, st.t, x + 0.12, y + 0.37, w - 0.24, rh - 0.46, { align: a, max: 12, ls: 1.03 });
        }
      },
      async (d) => { // on the tarmac: a row of yellow chevrons crosses the road, the words stand under them
        const s = road(d), n = d.steps.length, w = 9.3 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * w;
          await poly(s, [[0, 0], [0.8, 0], [1, 0.5], [0.8, 1], [0, 1], [0.2, 0.5]], YEL, x, 1.1, w + 0.08, 0.85);
          k.txt(s, String(i + 1), x + 0.2, 1.1, w - 0.4, 0.85, { size: 28, bold: true, color: INK, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.1, 2.05, w - 0.22, 0.58, { color: YEL, valign: 'top', max: 13 });
          bd(s, st.t, x + 0.1, 2.66, w - 0.22, 2.54, { color: WH, max: 13 });
        }
      },
      async (d) => { // a roundabout seen from above: exits to the plates in turn
        const s = page(d), n = d.steps.length, cx = 5, cy = 3.12, W = 3.15, H = 1.92, pos = n === 4 ? [[0.35, 1.1, -1, -1], [6.5, 1.1, 1, -1], [6.5, 3.24, 1, 1], [0.35, 3.24, -1, 1]] : [[0.35, 1.1, -1, -1], [6.5, 2.17, 1, 0], [0.35, 3.24, -1, 1]];
        for (const [, , ax, ay] of pos) { t.line(s, Math.min(cx, cx + ax * 1.6), Math.min(cy, cy + ay * 1.2), Math.abs(ax * 1.6), Math.abs(ay * 1.2), TAR, 14, { flipV: ax * ay < 0 }); }
        t.oval(s, cx - 1.05, cy - 1.05, 2.1, 2.1, TAR); t.oval(s, cx - 0.5, cy - 0.5, 1.0, 1.0, C.verge, { line: { color: WH, width: 2 } });
        for (const [i, st] of d.steps.entries()) {
          const [x, y] = pos[i];
          plate(s, x, y, W, H);
          shield(s, x + 0.1, y + 0.08, i + 1, BLU);
          hd(s, st.h, x + 0.68, y + 0.06, W - 0.78, 0.56, { max: 12.5 });
          bd(s, st.t, x + 0.12, y + 0.68, W - 0.24, H - 0.74, { max: 12, ls: 1.06 });
        }
      },
    ],
    stats: [
      async (d) => { // the first figure on one great speed disc, the two others on smaller discs, a plate for the note
        const s = page(d), [a, ...rest] = d.stats, dd = 3.6, x = 0.45, y = 1.05;
        stick(s, x + dd / 2, y + dd - 0.1);
        t.oval(s, x, y, dd, dd, WH, { line: { color: RED, width: 14 } });
        hd(s, a.value, x + 0.42, y + 0.7, dd - 0.84, 1.1, { max: 48, min: 22, align: 'center' });
        bd(s, a.label, x + 0.55, y + 1.8, dd - 1.1, 0.95, { align: 'center', max: 12.5, ls: 1.08 });
        rest.forEach((v, i) => { const xx = 4.4 + i * 2.65, d2 = 1.5; t.oval(s, xx, 1.05, d2, d2, WH, { line: { color: RED, width: 6 } }); hd(s, v.value, xx + 0.17, 1.35, d2 - 0.34, 0.9, { max: 22, min: 11, align: 'center' }); bd(s, v.label, xx - 0.3, 2.6, 2.45, 0.58, { align: 'center', max: 11, ls: 1.02 }); });
        plate(s, 4.3, 3.24, 5.35, 1.88);
        if (d.note) bd(s, d.note, 4.45, 3.28, 5.05, 1.8, { valign: 'middle', italic: true, max: 13 });
      },
      async (d) => { // a green distance sign on two posts: places on the left, figures on the right
        const s = page(d), x = 0.6, y = 1.08, w = 8.8, h = 3.05;
        stick(s, x + w * 0.25, y + h); stick(s, x + w * 0.75, y + h);
        t.rect(s, x, y, w, h, GRN, { r: 0.1, name: 'Sign' }); t.rect(s, x + 0.07, y + 0.07, w - 0.14, h - 0.14, null, { r: 0.07, line: { color: WH, width: 2.5 }, name: 'Border' });
        for (const [i, v] of d.stats.entries()) {
          const yy = y + 0.14 + i * 0.93;
          bd(s, v.label, x + 0.3, yy, 5.2, 0.88, { color: WH, valign: 'middle', bold: true, max: 13.5 });
          hd(s, v.value, x + 5.6, yy, 2.9, 0.88, { color: WH, max: 34, min: 18, align: 'right' });
        }
        if (d.note) { plate(s, 0.35, 4.2, 9.3, 0.98); bd(s, d.note, 0.5, 4.22, 9.0, 0.94, { valign: 'middle', italic: true, max: 12, ls: 1.05 }); }
      },
      async (d) => { // on the tarmac: three yellow diamonds with figures, a dashed line, the note along the kerb
        const s = road(d), w = 9.3 / 3, dd = 2.2;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.35 + i * w, cx = x + w / 2;
          await poly(s, DIA, YEL, cx - dd / 2, 1.0, dd, dd, INK);
          hd(s, v.value, cx - 0.76, 1.65, 1.52, 0.9, { max: 26, min: 13, align: 'center' });
          bd(s, v.label, x + 0.1, 3.22, w - 0.2, 0.68, { color: WH, align: 'center', max: 12, ls: 1.05 });
        }
        dash(s, 0, 3.95, 10, 0, WH);
        if (d.note) bd(s, d.note, 0.5, 4.0, 9.0, 1.22, { color: PALE, valign: 'middle', italic: true, align: 'center', max: 13 });
      },
    ],
    compare: [
      async (d) => { // on the tarmac: the centre line parts two carriageways, the words read away from it
        const s = road(d);
        t.line(s, 4.97, 0.95, 0, 4.3, YEL, 3); t.line(s, 5.03, 0.95, 0, 4.3, YEL, 3);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.3 : 0.35, w = 4.35, a = i ? 'left' : 'right', rh = 3.45 / sd.items.length;
          hd(s, sd.h, x, 1.02, w, 0.62, { color: YEL, align: a, max: 18 });
          sd.items.forEach((it, j) => bd(s, it, x, 1.7 + j * rh, w, rh - 0.05, { color: WH, align: a, valign: 'middle', max: 13 }));
        }
      },
      async (d) => { // two signs bolted one above the other on the same pair of posts
        const s = page(d), x = 0.35, w = 9.3;
        stick(s, 2.0, 1.05); stick(s, 8.0, 1.05);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.06 + i * 2.05, h = 1.94, c = i ? BRN : BLU, m = sd.items.length, rows = Math.ceil(m / 2), rw = 3.45, rh = (h - 0.16) / rows;
          t.rect(s, x, y, w, h, c, { r: 0.08, line: { color: WH, width: 2 }, name: 'Sign' });
          hd(s, sd.h, x + 0.18, y + 0.1, 1.95, h - 0.2, { color: YEL, max: 17, min: 12 });
          sd.items.forEach((it, j) => bd(s, it, x + 2.25 + (j % 2) * (rw + 0.1), y + 0.08 + Math.floor(j / 2) * rh, rw, rh, { color: WH, valign: 'middle', max: 12, ls: 1.05 }));
        }
      },
    ],
    statement: [
      async (d) => { // a stop sign drawn wide: the thought in white on the red octagon, the note on a plate below
        const s = page(d), x = 0.75, y = 1.05, w = 8.5, h = 3.0;
        stick(s, 5, y + h);
        await poly(s, OCT, RED, x, y, w, h, WH);
        k.head(s, L.runs(d.text), x + 0.55, y + 0.2, w - 1.1, h - 0.4, { max: 28, min: 15, color: WH, align: 'center' });
        if (d.caption) { plate(s, 0.45, 4.12, 9.1, 1.04); bd(s, d.caption, 0.6, 4.14, 8.8, 1.0, { valign: 'middle', align: 'center', max: 12, ls: 1.03 }); }
      },
      async (d) => { // on the tarmac: the thought painted on the road in big yellow letters
        const s = road(d, { noEdge: true });
        t.rect(s, 0, 0.9, 10, 0.05, WH, { name: 'Edge' });
        k.head(s, L.runs(d.text), 0.5, 1.02, 9.0, 2.65, { max: 34, min: 17, color: YEL });
        dash(s, 0, 3.75, 10);
        if (d.caption) bd(s, d.caption, 0.5, 3.82, 9.0, 1.42, { color: WH, max: 13 });
      },
    ],
    timeline: [
      async (d) => { // a road across the middle of the page, white kilometre posts on it, plates above and below by turns
        const s = page(d), ax = 3.12, xs = [0.35, 2.5, 4.65, 6.55], w = 3.1;
        t.rect(s, 0, ax - 0.2, 10, 0.4, TAR, { name: 'Road' }); dash(s, 0, ax, 10, 0, WH, 2);
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, y = up ? 1.04 : ax + 0.28, h = 1.74;
          t.rect(s, x + 0.2, ax - 0.2 - (up ? 0.1 : 0), 0.1, up ? 0.3 : 0.35, WH, { name: 'Post' });
          plate(s, x, y, w, h);
          hd(s, it.year, x + 0.1, y + 0.03, w - 0.2, 0.34, { max: 15, min: 11, color: GRN });
          hd(s, it.h, x + 0.1, y + 0.36, w - 0.2, 0.28, { max: 12 });
          bd(s, it.t, x + 0.1, y + 0.64, w - 0.2, h - 0.68, { max: 11.5, ls: 1.03 });
        }
      },
      async (d) => { // a gantry across the page: a green panel with the year hangs over each lane
        const s = page(d), w = 9.3 / 4;
        t.rect(s, 0, 1.12, 10, 0.08, PST, { name: 'Beam' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * w;
          t.rect(s, x + 0.06, 1.02, w - 0.12, 0.72, GRN, { r: 0.06, line: { color: WH, width: 2 }, name: 'Panel' });
          hd(s, it.year, x + 0.12, 1.04, w - 0.24, 0.68, { color: WH, max: 20, min: 11, align: 'center' });
          t.rect(s, x + 0.06, 1.84, w - 0.12, 3.34, WH, { line: { color: INK, width: 1 }, name: 'Lane' });
          hd(s, it.h, x + 0.14, 1.88, w - 0.28, 0.54, { valign: 'top', max: 13 });
          bd(s, it.t, x + 0.14, 2.44, w - 0.28, 2.7, { max: 13 });
        }
      },
      async (d) => { // on the tarmac: years painted beside a dashed line running down the page
        const s = road(d), rh = 4.25 / 4;
        dash(s, 2.5, 0.95, 0, 4.3);
        for (const [i, it] of d.items.entries()) {
          const y = 0.97 + i * rh;
          hd(s, it.year, 0.35, y + 0.03, 2.0, rh - 0.06, { color: YEL, max: 20, min: 12, align: 'right' });
          hd(s, it.h, 2.7, y + 0.04, 2.15, rh - 0.08, { color: WH, max: 14 });
          bd(s, it.t, 4.95, y + 0.04, 4.7, rh - 0.08, { color: PALE, valign: 'middle', max: 12.5, ls: 1.06 });
          if (i) t.line(s, 2.7, y, 6.95, 0, '4A4F55', 0.75);
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old row of signs was the same composition as cards and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: "SlideAI Yo'l belgilari", colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.green, lt2: C.sky, accent1: C.green, accent2: C.blue, accent3: C.yellow, accent4: C.red, accent5: C.brown, accent6: C.post, hlink: C.blue, folHlink: '555555' } });
}
module.exports = { id: 149, slug: 'yol-belgilari', name: "Yöl belgilari", category: 'business', photos: true, build, style: { tone: "yo'riqnoma ohangi: aniq yo'nalish, qisqa ko'rsatma va ogohlantirish; tez o'qiladigan", limits: { card_t4: 110, step_t: 100, side_item: 55 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "energetic"], "transitions": ["zoom", "push:l", "cut"], "cover": ["popOver", "zoomIn"], "mark": "popOver", "deco": "popOver", "sig": {"title": "popOver", "body": "fadeUp", "item": "popOver", "image": "zoomIn", "number": "popOver", "order": "seq", "stagger": 0.11}, "tempo": 0.9, "kenburns": false};
