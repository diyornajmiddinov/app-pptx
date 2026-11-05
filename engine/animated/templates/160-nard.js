/** 160 Nard — a BACKGAMMON board: wooden frame, felt with alternating long triangles (points), checkers, a central bar holding two dice; ideas sit in the four quarters of the board. */
const { kit, L, rowsFit } = require('../free.js');
const C = { frame: '5B3A1E', felt: '1F5135', p1: 'E9D8B4', p2: 'A23B2A', ink: 'FFF6E0', dark: '1A1A1A', muted: 'CFE0D4' };
const F = { head: 'Georgia', body: 'Calibri' };
const BX = 0.3, BY = 0.85, BW = 9.4, BH = 4.4, BAR = 0.5;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const points = async () => { const W2 = 940, H2 = 440, half = (W2 - BAR * 100) / 2, pw = half / 6; let g = `<rect width="${W2}" height="${H2}" fill="#${C.felt}"/>`; for (let side = 0; side < 2; side++) for (let i = 0; i < 6; i++) { const x0 = side * (half + BAR * 100) + i * pw, c = (i + side) % 2 ? C.p1 : C.p2; g += `<polygon points="${x0},0 ${x0 + pw},0 ${x0 + pw / 2},${H2 * 0.42}" fill="#${c}" opacity="0.85"/><polygon points="${x0},${H2} ${x0 + pw},${H2} ${x0 + pw / 2},${H2 * 0.58}" fill="#${i % 2 ? C.p2 : C.p1}" opacity="0.85"/>`; } g += `<rect x="${half}" y="0" width="${BAR * 100}" height="${H2}" fill="#${C.frame}"/>`; return k.svg('board', `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}">${g}</svg>`, W2, H2); };
  const die = (s, x, y, n) => { t.rect(s, x, y, 0.38, 0.38, 'FFFFFF', { r: 0.06, name: 'Die' }); const P = { 1: [[0.5, 0.5]], 2: [[0.25, 0.25], [0.75, 0.75]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.25, 0.2], [0.75, 0.2], [0.25, 0.5], [0.75, 0.5], [0.25, 0.8], [0.75, 0.8]] }[((n - 1) % 6) + 1]; P.forEach(([a, b]) => t.oval(s, x + a * 0.38 - 0.03, y + b * 0.38 - 0.03, 0.06, 0.06, C.dark)); };
  const checkers = (s) => [[0.55, BY + 0.1], [0.55, BY + 0.42], [8.95, BY + BH - 0.45], [8.95, BY + BH - 0.77]].forEach(([x, y], i) => t.oval(s, x, y, 0.3, 0.3, i < 2 ? 'F5F0E6' : C.dark, { line: { color: '777777', width: 0.75 } }));
  const board = async (s) => { t.rect(s, BX - 0.12, BY - 0.12, BW + 0.24, BH + 0.24, C.frame, { r: 0.08, shadow: 0.4, blur: 6, offset: 3, name: 'Frame' }); t.img(s, await points(), BX, BY, BW, BH); die(s, 4.81, BY + BH / 2 - 0.45, k.idx); die(s, 4.81, BY + BH / 2 + 0.07, (k.idx * 3) % 6 + 1); checkers(s); };
  const page = async (d) => { const s = k.slide('2B1A0E'); await board(s); if (d.title) k.head(s, d.title, 0.3, 0.12, 9.4, 0.6, { max: 22, min: 12, color: C.ink, align: 'center' }); k.foot(s, { y: 5.37, size: 7, color: 'C8B49A', align: 'center' }); return s; };
  // quarters: TL, TR, BL, BR (text plates on the felt between the point tips)
  const Q = [[BX + 0.15, BY + 0.15], [BX + BW / 2 + BAR / 2 + 0.1, BY + 0.15], [BX + 0.15, BY + BH / 2 + 0.08], [BX + BW / 2 + BAR / 2 + 0.1, BY + BH / 2 + 0.08]];
  const QW = BW / 2 - BAR / 2 - 0.25, QH = BH / 2 - 0.23;
  const quarters = (s, n, draw) => { const groups = [[], [], [], []]; for (let i = 0; i < n; i++) groups[n <= 4 ? i : Math.floor(i / 2) % 4].push(i); if (n > 4) { groups.length = 0; groups.push(...[[0, 1], [2, 3], [4], [5]].map((g) => g.filter((i) => i < n))); } groups.forEach((g, qi) => { if (!g.length) return; const [x, y] = Q[qi], rh = QH / g.length; t.rect(s, x, y, QW, QH, C.felt, { t: 15, line: { color: C.p1, width: 0.75 }, name: 'Plate' }); g.forEach((i, j) => draw(i, x + 0.15, y + 0.08 + j * rh, QW - 0.3, rh - 0.12)); }); };
  const R = {
    async cover(d) { const s = k.slide('2B1A0E'); await board(s); t.rect(s, BX + 0.2, BY + 0.6, BW / 2 - BAR / 2 - 0.4, BH - 1.2, C.felt, { t: 10, line: { color: C.p1, width: 1 }, name: 'Plate' }); k.txt(s, k.org3, BX + 0.4, BY + 0.75, 3.9, 0.3, { size: 11, bold: true, color: C.p1 }); k.head(s, d.title, BX + 0.4, BY + 1.1, 3.9, 1.9, { max: 28, min: 14, color: C.ink, valign: 'top' }); k.txt(s, k.M.author || '', BX + 0.4, BY + 3.0, 3.9, 0.4, { size: 14, bold: true, color: C.p1 });
      if (d.image) await k.photo(s, d.image, BX + BW / 2 + BAR / 2 + 0.4, BY + 0.6, BW / 2 - BAR / 2 - 0.8, BH - 1.2, { mask: { r: 0.06 } }); if (d.subtitle) k.txt(s, d.subtitle, 0.3, 0.12, 9.4, 0.6, { max: 12, color: C.ink, align: 'center', valign: 'middle' }); k.foot(s, { y: 5.37, size: 7, color: 'C8B49A', align: 'center' }); },
    async intro(d) { const s = await page(d); await k.photo(s, d.image, Q[0][0], Q[0][1], QW, BH - 0.3, { mask: { r: 0.06 } }); t.rect(s, Q[1][0], Q[1][1], QW, BH - 0.3, C.felt, { t: 10, line: { color: C.p1, width: 0.75 }, name: 'Plate' }); k.txt(s, d.text, Q[1][0] + 0.15, Q[1][1] + 0.1, QW - 0.3, BH - 0.5, { max: 14, min: 9.5, color: C.ink, ls: 1.25, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = await page(d); quarters(s, d.items.length, (i, x, y, w, h) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 15, color: C.ink })); },
    async cards(d) { const s = await page(d); quarters(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.4, { max: 14, color: C.p1 }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.42, { max: 12, color: C.ink }); }); },
    async process(d) { const s = await page(d); quarters(s, d.steps.length, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.4, { max: 14, color: C.p1 }); k.txt(s, d.steps[i].t, x, y + 0.42, w, h - 0.42, { max: 12, color: C.ink }); }); },
    async stats(d) { const s = await page(d); quarters(s, d.stats.length + (d.note ? 1 : 0), (i, x, y, w, h) => { if (i === d.stats.length) return k.txt(s, d.note, x, y, w, h, { max: 10, color: C.muted, valign: 'middle' }); k.head(s, d.stats[i].value, x, y, 1.6, h, { max: 34, min: 14, color: C.p1 }); k.txt(s, d.stats[i].label, x + 1.7, y, w - 1.7, h, { max: 12, color: C.ink, valign: 'middle' }); }); },
    async compare(d) { const s = await page(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, QW - 0.3, F.body, 0.08, BH - 0.85); [d.left, d.right].forEach((sd, i) => { const [x, y] = Q[i]; t.rect(s, x, y, QW, BH - 0.3, C.felt, { t: 10, line: { color: C.p1, width: 0.75 }, name: 'Plate' }); k.head(s, sd.h, x + 0.15, y + 0.08, QW - 0.3, 0.42, { max: 15, color: i ? 'F2A65A' : C.p1 }); let yy = y + 0.55; sd.items.forEach((it, j) => { k.txt(s, it, x + 0.15, yy, QW - 0.3, rr[j], { size: fs, color: C.ink }); yy += rr[j]; }); }); },
    async statement(d) { const s = await page(d); t.rect(s, BX + 0.6, BY + 0.3, BW - 1.2, BH - 0.6, C.felt, { line: { color: C.p1, width: 1.5 }, name: 'Plate' }); k.head(s, L.runs(d.text), BX + 0.8, BY + 0.38, BW - 1.6, 2.2, { max: 26, min: 13, color: C.ink, align: 'center' }); if (d.caption) k.txt(s, d.caption, BX + 0.8, BY + 2.62, BW - 1.6, 1.38, { max: 12.5, min: 10, color: C.muted, align: 'center', valign: 'middle' }); },
    async timeline(d) { const s = await page(d); quarters(s, d.items.length, (i, x, y, w, h) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.4, { max: 14, color: C.p1 }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.42, { max: 12, color: C.ink }); }); },
    async quote(d) { const s = await page({}); t.rect(s, BX + 0.6, BY + 0.9, BW - 1.2, BH - 1.8, C.felt, { line: { color: C.p1, width: 1.5 }, name: 'Plate' }); k.head(s, `\u201C${d.text}\u201D`, BX + 0.8, BY + 0.95, BW - 1.6, BH - 2.4, { max: 24, min: 12, italic: true, color: C.ink, align: 'center' }); if (d.author) k.txt(s, d.author, BX + 0.8, BY + BH - 1.4, BW - 1.6, 0.4, { size: 13, bold: true, color: C.p1, align: 'center' }); },
    async sources(d) { const s = await page(d); t.rect(s, BX + 0.3, BY + 0.3, BW - 0.6, BH - 0.6, C.felt, { t: 5, line: { color: C.p1, width: 1 }, name: 'Plate' }); const n = d.items.length, rh = (BH - 0.8) / n; d.items.forEach((it, i) => k.txt(s, `${i + 1}. ${it}`, BX + 0.5, BY + 0.4 + i * rh, BW - 1.0, rh, { max: 11, color: C.ink, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type: the doubling cube, stacked checkers, the bare wooden table, dice, the points themselves as columns (L.pages)
  const DEEP = '143A25', WOOD = '2B1A0E', OAK = '8A5A2E', OAKL = 'B9854E', CREAM = C.p1, RED = C.p2, AMBER = 'F2A65A', IVORY = 'F5F0E6', INK2 = '2A1A0C';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, color: C.ink, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: CREAM, ...o });
  const woodSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563"><rect width="1000" height="563" fill="#${OAK}"/>${Array.from({ length: 9 }, (_, i) => `<path d="M0,${i * 66 + 20} C300,${i * 66} 650,${i * 66 + 48} 1000,${i * 66 + 22}" fill="none" stroke="#6E4522" stroke-width="3" opacity="0.7"/>`).join('')}</svg>`;
  // the closed case on the table, no felt: the title burned into the wood
  const table = async (d) => { const s = k.slide({ data: await k.svg('woodbg', woodSvg, 1000, 563, true) }); if (d.title) k.head(s, d.title, 0.4, 0.14, 8.3, 0.7, { max: 22, min: 12, color: IVORY }); t.oval(s, 8.95, 0.17, 0.64, 0.64, IVORY, { line: { color: '777777', width: 0.75 } }); k.txt(s, String(k.idx), 8.95, 0.17, 0.64, 0.64, { size: 14, bold: true, color: INK2, align: 'center', valign: 'middle' }); t.rect(s, 0, 5.3, 10, 0.325, WOOD, { name: 'Edge' }); k.foot(s, { y: 5.36, size: 7, color: 'E5D4B8', align: 'center' }); return s; };
  // plain felt inside a thin frame, no points
  const felt = (d) => { const s = k.slide(C.felt); t.rect(s, 0, 0, 10, 0.1, C.frame, { name: 'Frame' }); t.rect(s, 0, 5.525, 10, 0.1, C.frame, { name: 'Frame' }); t.rect(s, 0, 0, 0.1, 5.625, C.frame, { name: 'Frame' }); t.rect(s, 9.9, 0, 0.1, 5.625, C.frame, { name: 'Frame' }); if (d.title) k.head(s, d.title, 0.4, 0.17, 8.3, 0.7, { max: 22, min: 12, color: C.ink }); t.oval(s, 8.95, 0.2, 0.64, 0.64, C.dark, { line: { color: '777777', width: 0.75 } }); k.txt(s, String(k.idx), 8.95, 0.2, 0.64, 0.64, { size: 14, bold: true, color: IVORY, align: 'center', valign: 'middle' }); k.foot(s, { x: 0.4, y: 5.27, w: 9.2, size: 7, color: C.muted, align: 'center' }); return s; };
  const checker = (s, cx, cy, dd, light, label, size) => { t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, light ? IVORY : C.dark, { line: { color: '777777', width: 1 }, name: 'Checker' }); t.oval(s, cx - dd * 0.36, cy - dd * 0.36, dd * 0.72, dd * 0.72, null, { line: { color: light ? 'B9AE9A' : '555555', width: 1 }, name: 'Rim' }); if (label != null) k.txt(s, String(label), cx - dd / 2, cy - dd / 2, dd, dd, { size: size || dd * 26, bold: true, font: F.head, color: light ? INK2 : IVORY, align: 'center', valign: 'middle', ls: 1 }); };
  const big = (s, x, y, dd, n) => { t.rect(s, x, y, dd, dd, IVORY, { r: dd * 0.14, shadow: 0.4, blur: 5, offset: 3, name: 'Die' }); const P = { 1: [[0.5, 0.5]], 2: [[0.27, 0.27], [0.73, 0.73]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], 4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]], 5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], 6: [[0.28, 0.2], [0.72, 0.2], [0.28, 0.5], [0.72, 0.5], [0.28, 0.8], [0.72, 0.8]] }[n]; const pd = dd * 0.17; P.forEach(([a, b]) => t.oval(s, x + a * dd - pd / 2, y + b * dd - pd / 2, pd, pd, n === 1 ? RED : C.dark, { name: 'Pip' })); };
  const cube = (s, x, y, dd, v) => { t.rect(s, x, y, dd, dd, IVORY, { r: dd * 0.12, line: { color: C.frame, width: 1.5 }, shadow: 0.4, blur: 5, offset: 3, name: 'Doubling cube' }); if (v != null) k.head(s, v, x + dd * 0.08, y + dd * 0.08, dd * 0.84, dd * 0.84, { max: 40, min: 13, color: C.dark, align: 'center' }); };
  const tall = async (s, x, w, up, c, key) => { const W2 = Math.round(w * 100); t.img(s, await k.svg(`pt${key}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="440"><polygon points="${up ? `0,440 ${W2},440 ${W2 / 2},0` : `0,0 ${W2},0 ${W2 / 2},440`}" fill="#${c}"/></svg>`, W2, 440), x, 0.95, w, 4.3); };
  const V = {
    image: [
      async (d) => { // the case folded shut: the picture lies on its wooden lid with a die at the corner, words at its side
        const s = await table(d), x = 0.4, y = 1.0, w = 4.9, h = 4.15;
        t.rect(s, x - 0.09, y - 0.09, w + 0.18, h + 0.18, IVORY, { shadow: 0.4, blur: 6, offset: 3, name: 'Print' });
        await k.photo(s, d.image, x, y, w, h);
        big(s, x + w - 0.55, y + h - 0.55, 0.72, 5);
        t.rect(s, 5.7, 1.0, 3.95, 4.15, DEEP, { name: 'Felt' });
        bd(s, d.text, 5.88, 1.08, 3.59, 3.99, { max: 12.5, valign: 'middle' });
      },
      async (d) => { // the picture on the full felt as a band, a row of points hanging from it, the words under
        const s = felt(d), y = 0.95, h = 2.25;
        await k.photo(s, d.image, 0.1, y, 9.8, h);
        for (let i = 0; i < 12; i++) t.img(s, await k.svg(`mini${i % 2}`, `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="30"><polygon points="0,0 80,0 40,30" fill="#${i % 2 ? CREAM : RED}"/></svg>`, 80, 30), 0.1 + i * (9.8 / 12), y + h, 9.8 / 12, 0.26);
        bd(s, d.text, 0.5, 3.52, 9.0, 1.7, { max: 13, valign: 'middle' });
      },
      async (d) => { // the picture is one great checker, its rim ivory, resting on the felt beside the words
        const s = felt(d), dd = 3.7, x = 5.85, y = 1.12;
        t.oval(s, x - 0.14, y - 0.14, dd + 0.28, dd + 0.28, IVORY, { line: { color: '777777', width: 1 }, name: 'Checker' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        bd(s, d.text, 0.45, 1.05, 5.05, 4.1, { max: 13.5, valign: 'middle' });
      },
      async (d) => { // the picture cut as a long point coming down the page, the words on the felt beside it
        const s = felt({}), x = 4.9, w = 5.0, y = 0.1, h = 5.42;
        k.head(s, d.title || '', 0.4, 0.17, 4.4, 0.95, { max: 20, min: 12, color: C.ink });
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: [[0, 0], [1, 0], [1, 1], [0.32, 1], [0, 0.5]] } }), x, y, w, h, { alt: '' });
        t.oval(s, 8.95, 0.2, 0.64, 0.64, C.dark, { line: { color: '777777', width: 0.75 } }); k.txt(s, String(k.idx), 8.95, 0.2, 0.64, 0.64, { size: 14, bold: true, color: IVORY, align: 'center', valign: 'middle' });
        bd(s, d.text, 0.45, 1.15, 4.45, 4.05, { max: 13, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // long points stand side by side across the felt, an idea written on each
        const s = felt(d), n = d.items.length, w = 9.5 / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.25 + i * w, up = i % 2 === 1;
          await tall(s, x, w, up, i % 2 ? '2C6B48' : '6E2A1E', `${n}${i % 2}`);
          const tx = x + 0.1, tw = w - 0.2;
          t.oval(s, x + w / 2 - 0.3, 1.0, 0.6, 0.6, i % 2 ? IVORY : C.dark, { line: { color: '777777', width: 0.75 }, name: 'Checker' });
          t.img(s, await k.icon(it.icon, i % 2 ? INK2 : IVORY, 2), x + w / 2 - 0.16, 1.14, 0.32, 0.32);
          hd(s, it.h, tx, 1.65, tw, 0.5, { align: 'center' });
          bd(s, it.t, tx, 2.18, tw, 3.02, { align: 'center', max: 13 });
        }
      },
      async (d) => { // the wooden lid: slips of ivory laid in rows, a checker at the head of each
        const s = await table(d), n = d.items.length, rh = 4.28 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 0.96 + i * rh, h = rh - 0.1;
          t.rect(s, 0.75, y, 8.9, h, IVORY, { shadow: 0.3, blur: 4, offset: 2, name: 'Slip' });
          t.oval(s, 0.35, y + h / 2 - 0.4, 0.8, 0.8, i % 2 ? C.dark : RED, { line: { color: IVORY, width: 1.5 }, name: 'Checker' });
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), 0.57, y + h / 2 - 0.18, 0.36, 0.36);
          hd(s, it.h, 1.3, y + 0.03, 2.5, h - 0.06, { color: INK2 });
          bd(s, it.t, 3.9, y + 0.03, 5.6, h - 0.06, { color: INK2, valign: 'middle', max: 12.5 });
        }
      },
      async (d) => { // dice thrown on the felt: a large die for each idea, each at its own height
        const s = felt(d), n = d.items.length, w = 9.2 / n, drop = [0.25, 0, 0.3, 0.05], dd = 0.86, faces = [3, 5, 2, 6];
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, y = 0.98 + drop[i];
          big(s, x + 0.08, y, dd, faces[i]);
          t.img(s, await k.icon(it.icon, AMBER, 2), x + dd + 0.22, y + 0.24, 0.38, 0.38);
          hd(s, it.h, x + 0.08, y + dd + 0.08, w - 0.2, 0.5, { valign: 'top' });
          bd(s, it.t, x + 0.08, y + dd + 0.6, w - 0.2, 5.22 - y - dd - 0.6, { max: 13 });
        }
      },
      async (d) => { // the doubling cube on the wooden lid, a square of felt for each idea round it (the old cards hold the open board)
        const s = await table(d), n = d.items.length, cx = 5, cy = n === 4 ? 3.05 : 2.1, dd = 1.1, spots = n === 4 ? [[0.4, 0.95, 3.75, 2.05], [5.85, 0.95, 3.75, 2.05], [0.4, 3.1, 3.75, 2.05], [5.85, 3.1, 3.75, 2.05]] : [[0.4, 0.95, 3.75, 2.3], [5.85, 0.95, 3.75, 2.3], [1.6, 3.52, 6.8, 1.63]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = spots[i];
          t.rect(s, x, y, w, h, DEEP, { line: { color: CREAM, width: 1 }, name: 'Plate' });
          t.img(s, await k.icon(it.icon, AMBER, 2), x + 0.13, y + 0.09, 0.32, 0.32);
          hd(s, it.h, x + 0.55, y + 0.05, w - 0.65, 0.42);
          bd(s, it.t, x + 0.14, y + 0.52, w - 0.28, h - 0.58, { max: 12.5 });
        }
        cube(s, cx - dd / 2, cy - dd / 2, dd);
        k.txt(s, '×2', cx - dd / 2, cy - dd / 2, dd, dd, { size: 30, bold: true, font: F.head, color: C.dark, align: 'center', valign: 'middle', ls: 1 });
      },
    ],
    process: [
      async (d) => { // the moves of one game: a checker jumps along an arc from point to point, words below each landing
        const s = felt(d), n = d.steps.length, w = 9.2 / n, dd = 0.84, y = 1.42, cs = d.steps.map((_, i) => 0.4 + w * (i + 0.5));
        const arcs = cs.slice(0, -1).map((c, i) => `<path d="M${c * 100},52 Q${(c + w / 2) * 100},0 ${cs[i + 1] * 100},52" fill="none" stroke="#${AMBER}" stroke-width="3" stroke-dasharray="9 7"/>`).join('');
        t.img(s, await k.svg(`arcs${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="60">${arcs}</svg>`, 1000, 60), 0, 0.92, 10, 0.6);
        for (const [i, st] of d.steps.entries()) {
          checker(s, cs[i], y + dd / 2 - 0.04, dd, i % 2 === 0, i + 1, 22);
          const x = 0.4 + i * w;
          hd(s, st.h, x + 0.06, 2.28, w - 0.12, 0.52, { align: 'center' });
          bd(s, st.t, x + 0.06, 2.82, w - 0.12, 2.38, { align: 'center', max: 13 });
        }
      },
      async (d) => { // checkers piling up: the count of the stack grows with the step, words beside the top one
        const s = await table(d), n = d.steps.length, gap = 0.1, w = (9.3 - gap * (n - 1)) / n, hh = 0.14;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * (w + gap), stack = (i + 1) * hh, top = 5.22 - stack - 3.25 - (n - 1) * hh + (n - 1 - i) * hh * 0 , y = 1.0 + (n - 1 - i) * hh * 2, h = 5.22 - stack - y - 0.05;
          for (let j = 0; j <= i; j++) t.oval(s, x + w / 2 - 0.55, 5.22 - (j + 1) * hh - 0.04, 1.1, 0.2, j % 2 ? C.dark : IVORY, { line: { color: '777777', width: 0.75 }, name: 'Checker' });
          t.rect(s, x, y, w, h, DEEP, { line: { color: CREAM, width: 0.75 }, name: 'Plate' });
          k.txt(s, String(i + 1), x + 0.12, y + 0.06, 0.6, 0.5, { size: 24, bold: true, font: F.head, color: AMBER, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.12, y + 0.56, w - 0.24, 0.5, { valign: 'top' });
          bd(s, st.t, x + 0.12, y + 1.08, w - 0.24, h - 1.14, { max: 12.5 });
        }
      },
      async (d) => { // the bar stands up the middle of the board, moves leave it to left and right
        const s = felt(d), n = d.steps.length, y0 = 0.95, rh = 4.28 / n, cx = 5, w = 3.95;
        t.rect(s, cx - 0.25, 0.9, 0.5, 4.33, C.frame, { name: 'Bar' });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, x = right ? cx + 0.42 : cx - 0.42 - w, a = right ? 'left' : 'right', cy = y + rh / 2;
          checker(s, cx, cy, 0.58, right, i + 1, 16);
          hd(s, st.h, x, y + 0.02, w, 0.34, { align: a, max: 13.5 });
          bd(s, st.t, x, y + 0.37, w, rh - 0.4, { align: a, max: 12 });
        }
      },
      async (d) => { // the lid again: a checker holds each step's number at the top of its paper, in a row at equal height
        const s = await table(d), n = d.steps.length, gap = 0.12, w = (9.3 - gap * (n - 1)) / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * (w + gap), y = 1.32;
          t.rect(s, x, y, w, 3.88, IVORY, { shadow: 0.3, blur: 4, offset: 2, name: 'Score sheet' });
          checker(s, x + w / 2, 1.32, 0.76, i % 2 === 1, i + 1, 20);
          hd(s, st.h, x + 0.12, y + 0.48, w - 0.24, 0.52, { color: RED, align: 'center' });
          bd(s, st.t, x + 0.12, y + 1.02, w - 0.24, 2.8, { color: INK2, max: 13, align: 'center' });
        }
      },
    ],
    stats: [
      async (d) => { // the doubling cube carries the lead figure, the other two on checkers, the note on the felt
        const s = felt(d), [a, b, c] = d.stats, dd = 2.5;
        cube(s, 0.5, 1.0, dd, a.value);
        bd(s, a.label, 0.5, 3.58, dd, 0.75, { align: 'center', max: 12.5 });
        [[b, 3.4, true], [c, 6.55, false]].forEach(([v, x, lt]) => { checker(s, x + 1.05, 2.0, 2.0, lt); k.head(s, v.value, x + 0.3, 1.5, 1.5, 1.0, { max: 22, min: 12, color: lt ? INK2 : IVORY, align: 'center' }); bd(s, v.label, x, 3.1, 2.95, 0.8, { align: 'center', max: 12.5 }); });
        if (d.note) bd(s, d.note, 3.4, 4.05, 6.1, 1.14, { color: C.muted, max: 12.5, valign: 'middle' });
      },
      async (d) => { // on the open board: one plate across the points with three figures, the note on a second plate
        const s = await page(d), w = 3.0;
        t.rect(s, 0.5, 1.0, 9.0, 2.55, DEEP, { line: { color: CREAM, width: 1 }, name: 'Plate' });
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * w;
          if (i) t.line(s, x, 1.15, 0, 2.25, CREAM, 0.75);
          hd(s, v.value, x + 0.12, 1.1, w - 0.24, 1.2, { max: 36, min: 18, color: i === 1 ? AMBER : C.ink, align: 'center' });
          bd(s, v.label, x + 0.15, 2.35, w - 0.3, 1.1, { align: 'center', max: 12.5 });
        }
        if (d.note) { t.rect(s, 1.0, 3.72, 8.0, 1.4, DEEP, { line: { color: CREAM, width: 0.75 }, name: 'Plate' }); bd(s, d.note, 1.15, 3.76, 7.7, 1.32, { color: C.muted, align: 'center', valign: 'middle', max: 12.5 }); }
      },
      async (d) => { // the wooden lid: the score card of a match, rule under each row
        const s = await table(d), x = 0.5, w = 9.0, y0 = 1.0, rh = 0.98;
        t.rect(s, x, y0, w, 4.16, IVORY, { shadow: 0.35, blur: 5, offset: 3, name: 'Score card' });
        for (const [i, v] of d.stats.entries()) {
          const y = y0 + 0.05 + i * rh;
          k.head(s, v.value, x + 0.2, y, 3.4, rh - 0.05, { max: 36, min: 18, color: i ? INK2 : RED });
          bd(s, v.label, x + 3.75, y, w - 3.95, rh - 0.05, { color: INK2, valign: 'middle', max: 14 });
          t.line(s, x + 0.15, y + rh - 0.02, w - 0.3, 0, OAKL, 1);
        }
        if (d.note) bd(s, d.note, x + 0.2, y0 + 3.04, w - 0.4, 1.06, { color: INK2, valign: 'middle', italic: true, max: 12.5 });
      },
    ],
    compare: [
      async (d) => { // white against black: the two sides of the board, ivory and dark, the bar between
        const s = felt(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, 3.95, F.body, 0.12, 3.05);
        t.rect(s, 0.1, 0.92, 4.65, 4.3, IVORY, { name: 'White side' }); t.rect(s, 5.25, 0.92, 4.65, 4.3, C.dark, { name: 'Black side' });
        t.rect(s, 4.75, 0.92, 0.5, 4.3, C.frame, { name: 'Bar' });
        die(s, 4.81, 2.62, 3); die(s, 4.81, 3.12, 5);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.5 : 0.55, w = 3.95, a = i ? 'left' : 'right', ink = i ? IVORY : INK2;
          hd(s, sd.h, x, 1.0, w, 0.55, { max: 18, min: 12, color: i ? AMBER : RED, align: a });
          let y = 1.68; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: ink, align: a, ls: 1 }); y += rr[j]; });
        }
      },
      async (d) => { // the upper table and the lower table: a line of pieces across each, one row against the other
        const s = felt(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.1 : 0.95, h = 2.06, n = sd.items.length, x0 = 2.85, w = (9.65 - x0) / n, lt = i === 0;
          t.rect(s, 0.3, y, 9.4, h, DEEP, { line: { color: CREAM, width: 0.75 }, name: 'Table' });
          checker(s, 0.72, y + h / 2, 0.56, lt);
          hd(s, sd.h, 1.08, y + 0.08, 1.7, h - 0.16, { max: 14, min: 10.5, color: lt ? CREAM : AMBER });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.line(s, x, y + 0.2, 0, h - 0.4, CREAM, 0.5); bd(s, it, x + 0.1, y + 0.08, w - 0.18, h - 0.16, { valign: 'middle', max: 12.5 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the throw: two great dice on the bare felt, the sentence beside them, the note beneath
        const s = felt(d);
        big(s, 0.5, 1.15, 1.35, 6); big(s, 1.6, 2.2, 1.15, 1);
        k.head(s, L.runs(d.text), 3.05, 0.98, 6.5, 2.45, { max: 28, min: 15, color: C.ink });
        if (d.caption) { t.line(s, 0.5, 3.55, 9.0, 0, CREAM, 1); bd(s, d.caption, 0.5, 3.62, 9.0, 1.58, { color: C.muted, valign: 'middle', max: 13 }); }
      },
      async (d) => { // on the wooden lid an ivory card holds the sentence, the note in burned letters at its side
        const s = await table(d);
        t.rect(s, 0.45, 1.05, 5.5, 4.05, IVORY, { shadow: 0.4, blur: 6, offset: 3, name: 'Card' });
        t.rect(s, 0.45, 1.05, 5.5, 0.14, RED, { name: 'Card band' });
        k.head(s, L.runs(d.text), 0.7, 1.3, 5.0, 3.68, { max: 26, min: 14, color: INK2 });
        if (d.caption) { t.rect(s, 6.2, 1.05, 3.45, 4.05, WOOD, { name: 'Plate' }); bd(s, d.caption, 6.36, 1.13, 3.13, 3.89, { color: 'FFF6E0', valign: 'middle', max: 13 }); }
      },
    ],
    timeline: [
      async (d) => { // the bar lies flat across the board, checkers bear the years, events above and below in turn
        const s = felt(d), ay = 3.0, w = 3.4, step = 1.92;
        t.rect(s, 0, ay - 0.14, 10, 0.28, C.frame, { name: 'Bar' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.32 + i * step, up = i % 2 === 0, y = up ? 0.92 : ay + 0.2, h = up ? ay - 1.08 : 5.22 - y;
          t.oval(s, x, ay - 0.13, 0.26, 0.26, up ? IVORY : C.dark, { line: { color: '777777', width: 0.75 }, name: 'Checker' });
          hd(s, it.year, x, y, 1.35, 0.36, { max: 14, color: AMBER });
          hd(s, it.h, x + 1.37, y, w - 1.37, 0.36, { max: 11.5, min: 10 });
          bd(s, it.t, x, y + 0.38, w, h - 0.42, { max: 11.5 });
        }
      },
      async (d) => { // the wooden lid: a game record on a long ivory sheet, a ruled row for every year
        const s = await table(d), x = 0.4, w = 9.2, y0 = 0.98, rh = 4.2 / 4;
        t.rect(s, x, y0, w, 4.2, IVORY, { shadow: 0.35, blur: 5, offset: 3, name: 'Record' });
        t.rect(s, x, y0, 1.85, 4.2, RED, { name: 'Margin' });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          hd(s, it.year, x + 0.1, y, 1.65, rh, { color: IVORY, max: 17, min: 11, align: 'center' });
          hd(s, it.h, x + 1.98, y, 2.15, rh, { color: INK2, max: 13.5 });
          bd(s, it.t, x + 4.2, y + 0.02, w - 4.35, rh - 0.04, { color: INK2, valign: 'middle', max: 12 });
          if (i < 3) t.line(s, x, y + rh, w, 0, OAKL, 0.75);
        }
      },
      async (d) => { // a run across the board: each year's plate one move further to the right, its tab a long point
        const s = felt(d), rh = 4.28 / 4, w = 6.0, dx = 1.08;
        for (const [i, it] of d.items.entries()) {
          const x = 0.3 + i * dx, y = 0.94 + i * rh, h = rh - 0.1;
          t.rect(s, x, y, w, h, DEEP, { line: { color: CREAM, width: 0.75 }, name: 'Plate' });
          t.rect(s, x, y, 1.3, h, i % 2 ? CREAM : RED, { name: 'Tab' });
          hd(s, it.year, x + 0.06, y, 1.18, h, { color: i % 2 ? INK2 : IVORY, max: 14, min: 10, align: 'center' });
          hd(s, it.h, x + 1.42, y + 0.03, w - 1.5, 0.3, { max: 12.5, color: AMBER });
          bd(s, it.t, x + 1.42, y + 0.33, w - 1.5, h - 0.36, { max: 11.5, ls: 1.08 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old cards, process, stats and timeline were all the same four plates
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Nard', colors: { dk1: C.dark, lt1: 'FFFFFF', dk2: C.frame, lt2: C.p1, accent1: C.p2, accent2: C.p1, accent3: C.felt, accent4: 'F2A65A', accent5: C.muted, accent6: '777777', hlink: C.p2, folHlink: C.muted } });
}
module.exports = { id: 160, slug: 'nard', name: 'Nard', category: 'creative', photos: true, build, style: { tone: "strategik o'yin: imkoniyat va tanlov, har bir yurish o'ylangan; qiziqarli va aniq", limits: { card_t4: 110, step_t: 110 }, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "elegant"], "transitions": ["p14:ferris|dir=\"l\"", "fade", "p14:flip|dir=\"l\""], "cover": ["swingRight", "spinIn"], "mark": "bounceDrop", "deco": "slideLeft", "sig": {"title": "slideRight", "body": "fadeUp", "item": "bounceDrop", "image": "slideLeft", "number": "spinIn", "order": "cascade", "stagger": 0.12}, "tempo": 1.0, "kenburns": false};
