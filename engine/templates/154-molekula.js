/** 154 Molekula — a BALL-AND-STICK molecule: ideas are shaded atoms (CPK colours) joined by bonds in a lattice; text is written inside the atoms. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F7F8FA', ink: '1B1F24', muted: '59606B', bond: 'A3A9B3', atoms: ['3B3F45', 'E03C31', '3060D0', 'E8B710', '1E9E6A', '8E44AD'] };
const F = { head: 'Arial', body: 'Calibri' };
const atomSvg = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><radialGradient id="g" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="0.25" stop-color="#${c}"/><stop offset="1" stop-color="#000000" stop-opacity="0.9"/></radialGradient></defs><circle cx="100" cy="100" r="98" fill="#${c}"/><circle cx="100" cy="100" r="98" fill="url(#g)" opacity="0.75"/></svg>`;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const atom = async (s, cx, cy, d, i) => t.img(s, await k.svg('a' + (i % 6), atomSvg(C.atoms[i % 6]), 200, 200), cx - d / 2, cy - d / 2, d, d);
  const bond = (s, a, b) => { const [x1, y1] = a, [x2, y2] = b; t.line(s, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1) || 0.001, Math.abs(y2 - y1) || 0.001, C.bond, 7, { flipV: (x2 - x1) * (y2 - y1) < 0 }); };
  // lattice positions for n atoms: triangle (3), square (4), 3+3 (6), zigzag otherwise
  const pos = (n) => (n === 2 ? [[3.0, 3.1], [7.0, 3.1]] : n === 3 ? [[2.8, 3.8], [5.0, 1.95], [7.2, 3.8]] : n === 4 ? [[3.1, 2.15], [6.9, 2.15], [6.9, 4.2], [3.1, 4.2]] : Array.from({ length: n }, (_, i) => [1.35 + i * (7.3 / (n - 1)), i % 2 ? 4.05 : 2.15]));
  const mol = async (s, n, draw) => { const P = pos(n), d = n <= 4 ? 1.95 : 1.55; for (let i = 0; i < n; i++) { const j = (i + 1) % n; if (j || n > 2) if (!(j === 0 && n > 4)) bond(s, P[i], P[j]); } for (let i = 0; i < n; i++) { await atom(s, P[i][0], P[i][1], d, i); const ins = d * 0.72; draw(i, P[i][0] - ins / 2, P[i][1] - ins / 2, ins, ins, i === 3 ? C.ink : 'FFFFFF'); } };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.2, 8.4, 0.7, { max: 24, min: 13 }); k.txt(s, `C${k.idx}`, 8.9, 0.2, 0.7, 0.7, { size: 16, bold: true, color: C.atoms[1], align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5 }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); const P = [[6.4, 1.6], [8.4, 1.0], [8.6, 3.2], [6.6, 3.9]]; bond(s, P[0], P[1]); bond(s, P[0], P[2]); bond(s, P[0], P[3]); for (const [i, p] of P.entries()) await atom(s, p[0], p[1], i ? 1.1 : 2.2, i); if (d.image) await k.photo(s, d.image, 6.4 - 0.9, 1.6 - 0.9, 1.8, 1.8, { mask: 'circle' });
      k.txt(s, k.org3, 0.5, 0.6, 4.6, 0.35, { size: 12, bold: true, color: C.atoms[2] }); k.head(s, d.title, 0.5, 1.0, 4.6, 2.4, { max: 36, min: 18, valign: 'top' }); k.txt(s, d.subtitle || '', 0.5, 3.45, 4.5, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.5, 0.45, { size: 15, bold: true, color: C.atoms[1] }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); await atom(s, 2.4, 3.05, 3.6, 2); await k.photo(s, d.image, 2.4 - 1.6, 3.05 - 1.6, 3.2, 3.2, { mask: 'circle' }); k.txt(s, d.text, 4.6, 1.1, 5.0, 4.0, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await mol(s, d.items.length, (i, x, y, w, h, c) => k.head(s, d.items[i], x, y, w, h, { max: 13, min: 8.5, color: c, align: 'center' })); },
    async cards(d) { const s = page(d); await mol(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].h, x, y, w, 0.36, { max: 12, min: 8.5, color: c, align: 'center' }); k.txt(s, d.items[i].t, x, y + 0.38, w, h - 0.38, { max: 10, min: 7.5, color: c, align: 'center' }); }); },
    async process(d) { const s = page(d); await mol(s, d.steps.length, (i, x, y, w, h, c) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.36, { max: 12, min: 8.5, color: c, align: 'center' }); k.txt(s, d.steps[i].t, x, y + 0.38, w, h - 0.38, { max: 10, min: 7.5, color: c, align: 'center' }); }); },
    async stats(d) { const s = page(d); await mol(s, d.stats.length, (i, x, y, w, h, c) => { k.head(s, d.stats[i].value, x, y, w, h * 0.5, { max: 30, min: 12, color: c, align: 'center' }); k.txt(s, d.stats[i].label, x, y + h * 0.5, w, h * 0.5, { max: 10, min: 7.5, color: c, align: 'center' }); }); if (d.note) k.txt(s, d.note, 0.4, 4.95, 9.2, 0.33, { max: 8.5, color: C.muted }); },
    async compare(d) { const s = page(d); const P = [[1.4, 3.1], [8.6, 3.1]]; bond(s, P[0], P[1]); const w = 2.72, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.16, F.body, 0.08, 3.3); for (const [i, sd] of [d.left, d.right].entries()) { await atom(s, P[i][0], P[i][1], 1.6, i ? 2 : 1); k.head(s, sd.h, P[i][0] - 0.6, P[i][1] - 0.6, 1.2, 1.2, { max: 12, min: 8, color: 'FFFFFF', align: 'center' }); const x = i ? 5.06 : 2.22; let y = 1.15; sd.items.forEach((it, j) => { t.rect(s, x, y, w, rr[j] - 0.04, 'FFFFFF', { line: { color: C.atoms[i ? 2 : 1], width: 1 }, r: 0.06, name: 'Note' }); k.txt(s, it, x + 0.08, y, w - 0.16, rr[j] - 0.04, { size: fs, valign: 'middle' }); y += rr[j]; }); } },
    async statement(d) { const s = page(d); bond(s, [1.2, 2.62], [3.6, 2.62]); bond(s, [6.4, 2.62], [8.8, 2.62]); await atom(s, 5.0, 2.62, 3.2, 0); await atom(s, 1.2, 2.62, 0.9, 1); await atom(s, 8.8, 2.62, 0.9, 2); k.head(s, L.runs(d.text), 3.75, 1.55, 2.5, 2.14, { max: 18, min: 9.5, color: 'FFFFFF', align: 'center' }); if (d.caption) k.txt(s, d.caption, 0.4, 4.3, 9.2, 0.95, { max: 12.5, min: 10, color: C.muted, align: 'center', valign: 'middle' }); },
    async timeline(d) { const s = page(d); await mol(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].year, x, y, w, 0.36, { max: 14, min: 9, color: c, align: 'center' }); k.txt(s, `${d.items[i].h}. ${d.items[i].t}`, x, y + 0.38, w, h - 0.38, { max: 10, min: 7.5, color: c, align: 'center' }); }); },
    async quote(d) { const s = page({}); await atom(s, 1.9, 3.0, 2.2, 1); k.txt(s, '\u201C', 1.9 - 0.5, 3.0 - 0.6, 1.0, 1.0, { size: 60, bold: true, color: 'FFFFFF', align: 'center' }); k.head(s, d.text, 3.4, 1.2, 6.2, 2.9, { max: 26, min: 13, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 3.4, 4.2, 6.2, 0.45, { size: 14, bold: true, color: C.atoms[1] }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 4.0 / n; for (const [i, it] of d.items.entries()) { const y = 1.1 + i * rh; await atom(s, 0.65, y + rh / 2, 0.36, i); k.txt(s, it, 1.0, y, 8.6, rh, { max: 12, valign: 'middle' }); } },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type: the periodic table, the benzene ring, orbitals in the dark, test tubes (L.pages)
  const A = C.atoms, GRAPH = '14171C', PANEL = '23272E', FOG = 'C7CDD6', TINT = ['E5E7EA', 'FBE3E1', 'E1E9FA', 'FBF2CF', 'DCF3EA', 'EEE2F4'], DK = [C.ink, 'B3261E', '234CA8', '7A5F00', '11734C', '6F2E8C'], onAtom = (i) => (i % 6 === 3 ? C.ink : 'FFFFFF');
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const night = (d) => { const s = k.slide(GRAPH); if (d.title) hd(s, d.title, 0.4, 0.2, 8.4, 0.7, { max: 24, min: 13, color: 'FFFFFF' }); k.txt(s, `C${k.idx}`, 8.9, 0.2, 0.7, 0.7, { size: 16, bold: true, color: 'FF7A70', align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5, color: FOG }); return s; };
  const ball = async (s, cx, cy, dd, i, label, size) => { await atom(s, cx, cy, dd, i); if (label != null) k.txt(s, String(label), cx - dd / 2, cy - dd / 2, dd, dd, { size: size || dd * 26, bold: true, font: F.head, color: onAtom(i), align: 'center', valign: 'middle', ls: 1 }); };
  const orbit = (key, w, h, rot, c) => k.svg(`orb${key}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${rot.map((r) => `<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * 0.48}" ry="${h * 0.17}" fill="none" stroke="#${c}" stroke-width="3" transform="rotate(${r} ${w / 2} ${h / 2})"/>`).join('')}</svg>`, w, h);
  const hexPts = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => [cx + r * Math.cos(Math.PI / 3 * i - Math.PI / 2), cy + r * Math.sin(Math.PI / 3 * i - Math.PI / 2)]);
  const symbol = (txt) => { const w = String(txt || '').replace(/[^\p{L}]/gu, ''); return (w.charAt(0).toUpperCase() + w.charAt(1).toLowerCase()) || '?'; };
  const V = {
    image: [
      async (d) => { // the picture is a nucleus, electrons orbit round it, the words at the side
        const s = page(d), dd = 2.9, cx = 7.15, cy = 3.1;
        t.img(s, await orbit('p', 450, 420, [28, -28], C.bond), cx - 2.3, cy - 2.12, 4.6, 4.3);
        t.oval(s, cx - dd / 2 - 0.07, cy - dd / 2 - 0.07, dd + 0.14, dd + 0.14, A[2]);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), cx - dd / 2, cy - dd / 2, dd, dd, { alt: '' });
        await atom(s, cx - 2.0, cy - 1.05, 0.34, 1); await atom(s, cx + 2.0, cy + 1.05, 0.34, 3); await atom(s, cx + 2.0, cy - 1.05, 0.34, 4);
        bd(s, d.text, 0.4, 1.1, 4.1, 4.05, { max: 13.5, valign: 'middle' });
      },
      async (d) => { // the whole page is the picture, a dark panel holds the words, atoms chained along its edge
        const s = k.slide(GRAPH), x = 5.3;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, x, 0, 10 - x, 5.625, GRAPH, { t: 6, name: 'Panel' });
        const P2 = [[x, 0.95], [x + 0.28, 1.6], [x, 2.3], [x + 0.28, 2.95], [x, 3.65], [x + 0.28, 4.3], [x, 5.0]];
        for (let i = 0; i < P2.length - 1; i++) bond(s, P2[i], P2[i + 1]);
        for (const [i, p] of P2.entries()) await atom(s, p[0], p[1], 0.36, i + 1);
        hd(s, d.title || '', x + 0.55, 0.2, 3.4, 0.95, { max: 18, min: 12, color: 'FFFFFF' });
        k.txt(s, `C${k.idx}`, 9.0, 0.2, 0.7, 0.4, { size: 12, bold: true, color: 'FF7A70', align: 'right', valign: 'middle' });
        bd(s, d.text, x + 0.55, 1.2, 3.85, 3.95, { color: 'FFFFFF', max: 13, valign: 'middle' });
        k.foot(s, { x: x + 0.55, y: 5.32, w: 3.85, size: 7, color: FOG });
      },
      async (d) => { // the picture fills a benzene ring, little atoms stand at each corner
        const s = page(d), r = 2.08, cx = 2.65, cy = 3.08, Hx = hexPts(cx, cy, r);
        const box = { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r };
        t.img(s, await L.photo(L.src(d.image), box.w, box.h, { mask: { poly: [[0.5, 0], [0.933, 0.25], [0.933, 0.75], [0.5, 1], [0.067, 0.75], [0.067, 0.25]] } }), box.x, box.y, box.w, box.h, { alt: '' });
        for (let i = 0; i < 6; i++) bond(s, Hx[i], Hx[(i + 1) % 6]);
        for (const [i, p] of Hx.entries()) await atom(s, p[0], p[1], 0.42, i);
        bd(s, d.text, 5.1, 1.1, 4.5, 4.05, { max: 13.5, valign: 'middle' });
      },
      async (d) => { // a wide picture with a chain of atoms hung over its lower edge, the words beneath
        const s = page(d), y = 1.0, h = 2.3;
        await k.photo(s, d.image, 0.4, y, 9.2, h, { mask: { r: 0.08 } });
        const P2 = [[1.2, 3.15], [2.6, 3.35], [4.0, 3.15], [5.4, 3.35], [6.8, 3.15], [8.2, 3.35]];
        for (let i = 0; i < 5; i++) bond(s, P2[i], P2[i + 1]);
        for (const [i, p] of P2.entries()) await atom(s, p[0], p[1], 0.44, i);
        bd(s, d.text, 0.4, 3.62, 9.2, 1.62, { max: 13, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a molecule falling across the page: each atom bonded to the next, its words to the right of it
        const s = page(d), n = d.items.length, rh = 4.2 / n, dx = n === 4 ? 0.95 : 1.3, dd = 0.82, P2 = d.items.map((_, i) => [0.85 + i * dx, 1.02 + rh * (i + 0.5)]);
        for (let i = 0; i < n - 1; i++) bond(s, P2[i], P2[i + 1]);
        for (const [i, it] of d.items.entries()) {
          const [cx, cy] = P2[i], c = i + 1, x = cx + dd / 2 + 0.15, w = 9.6 - x, y = 1.02 + i * rh;
          await atom(s, cx, cy, dd, c);
          t.img(s, await k.icon(it.icon, onAtom(c), 2), cx - 0.2, cy - 0.2, 0.4, 0.4);
          hd(s, it.h, x, y + 0.02, w, 0.36, { color: DK[c], max: 15 });
          bd(s, it.t, x, y + 0.38, w, rh - 0.4, { max: 13 });
        }
      },
      async (d) => { // the periodic table: a tile for each idea, its number, two letters and name
        const s = page(d), n = d.items.length, cols = n === 4 ? 2 : 3, gap = 0.15, w = (9.2 - gap * (cols - 1)) / cols, H2 = n === 4 ? 1.98 : 4.05;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + (i % cols) * (w + gap), y = 1.08 + Math.floor(i / cols) * (H2 + 0.1), c = i + 1, tw = n === 4 ? 1.35 : w;
          t.rect(s, x, y, w, H2, TINT[c], { line: { color: A[c], width: 1.25 }, name: 'Tile' });
          t.rect(s, x, y, tw, n === 4 ? H2 : 1.45, A[c], { name: 'Tile head' });
          k.txt(s, String(i + 1), x + 0.1, y + 0.06, 0.5, 0.3, { size: 12, bold: true, color: onAtom(c), valign: 'middle', ls: 1 });
          k.txt(s, symbol(it.h), x, y + (n === 4 ? 0.45 : 0.32), tw, n === 4 ? 1.0 : 1.05, { size: n === 4 ? 40 : 52, bold: true, font: F.head, color: onAtom(c), align: 'center', valign: 'middle', ls: 1 });
          if (n === 4) { hd(s, it.h, x + tw + 0.12, y + 0.06, w - tw - 0.22, 0.48, { color: DK[c], max: 14, min: 10.5 }); bd(s, it.t, x + tw + 0.12, y + 0.55, w - tw - 0.22, H2 - 0.62, { max: 12.5 }); }
          else { hd(s, it.h, x + 0.14, y + 1.5, w - 0.28, 0.6, { color: DK[c], max: 15 }); bd(s, it.t, x + 0.14, y + 2.12, w - 0.28, H2 - 2.2, { max: 14 }); }
        }
      },
      async (d) => { // in the dark: a benzene ring in the middle, spokes from it to each idea
        const s = night(d), n = d.items.length, cx = 5, cy = n === 4 ? 3.08 : 2.52, Hx = hexPts(cx, cy, 0.68);
        const spots = n === 4 ? [[0.4, 1.02, 3.6, 2.0], [6.0, 1.02, 3.6, 2.0], [0.4, 3.16, 3.6, 2.04], [6.0, 3.16, 3.6, 2.04]] : [[0.4, 1.02, 3.6, 2.4], [6.0, 1.02, 3.6, 2.4], [1.8, 3.6, 6.4, 1.6]];
        for (const [i, [x, y, w, h]] of spots.entries()) { const mid = n === 3 && i === 2, ex = mid ? cx : (i % 2 ? x : x + w), ey = mid ? y : y + h / 2; t.line(s, Math.min(cx, ex), Math.min(cy, ey), Math.abs(ex - cx) || 0.001, Math.abs(ey - cy) || 0.001, C.bond, 3, { flipV: (ex - cx) * (ey - cy) < 0 }); }
        t.oval(s, cx - 0.82, cy - 0.82, 1.64, 1.64, GRAPH);
        for (let i = 0; i < 6; i++) bond(s, Hx[i], Hx[(i + 1) % 6]);
        for (const [i, p] of Hx.entries()) await atom(s, p[0], p[1], 0.3, i);
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = spots[i], c = i + 1;
          t.rect(s, x, y, w, h, PANEL, { r: 0.08, line: { color: A[c], width: 1.25 }, name: 'Note' });
          t.img(s, await k.icon(it.icon, i === 2 ? 'E8B710' : i === 1 ? '7FA6FF' : i === 0 ? 'FF7A70' : '5ED6A6', 2), x + 0.14, y + 0.1, 0.32, 0.32);
          hd(s, it.h, x + 0.55, y + 0.05, w - 0.65, 0.42, { color: 'FFFFFF', max: 14 });
          bd(s, it.t, x + 0.14, y + 0.52, w - 0.28, h - 0.58, { color: FOG, max: 12.5 });
        }
      },
      async (d) => { // a zigzag carbon chain: every idea hangs under its own atom at its own height
        const s = page(d), n = d.items.length, w = 9.2 / n, ys = (i) => (i % 2 ? 1.72 : 1.35), P2 = d.items.map((_, i) => [0.4 + w * (i + 0.5), ys(i)]), dd = 0.8;
        for (let i = 0; i < n - 1; i++) bond(s, P2[i], P2[i + 1]);
        for (const [i, it] of d.items.entries()) {
          const [cx, cy] = P2[i], x = 0.4 + i * w, c = i + 1;
          await atom(s, cx, cy, dd, c);
          t.img(s, await k.icon(it.icon, onAtom(c), 2), cx - 0.2, cy - 0.2, 0.4, 0.4);
          const y = cy + dd / 2 + 0.05;
          hd(s, it.h, x + 0.08, y, w - 0.16, 0.52, { color: DK[c], max: 14, min: 10.5, align: 'center' });
          bd(s, it.t, x + 0.08, y + 0.54, w - 0.16, 5.22 - y - 0.54, { align: 'center', max: 13 });
        }
      },
      async (d) => { // a backbone down the left margin: each row a side chain leading to its words
        const s = page(d), n = d.items.length, y0 = 1.05, rh = 4.15 / n, bx = 0.85, dd = 0.72;
        const P2 = d.items.map((_, i) => [bx, y0 + rh * (i + 0.5)]);
        for (let i = 0; i < n - 1; i++) bond(s, P2[i], P2[i + 1]);
        for (const [i, it] of d.items.entries()) {
          const [cx, cy] = P2[i], y = y0 + i * rh, c = i + 1;
          bond(s, [cx, cy], [1.75, cy]);
          await atom(s, cx, cy, dd, c);
          t.img(s, await k.icon(it.icon, onAtom(c), 2), cx - 0.18, cy - 0.18, 0.36, 0.36);
          t.rect(s, 1.75, y + 0.07, 7.85, rh - 0.14, 'FFFFFF', { r: 0.06, line: { color: A[c], width: 1 }, name: 'Note' });
          hd(s, it.h, 1.9, y + 0.09, 2.3, rh - 0.18, { color: DK[c], max: 14, min: 10.5 });
          bd(s, it.t, 4.3, y + 0.09, 5.2, rh - 0.18, { valign: 'middle', max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // a reaction climbing: atoms grow step by step, an arrow leading to each next one
        const s = page(d), n = d.steps.length, w = 9.2 / n, sizes = n === 4 ? [0.62, 0.78, 0.94, 1.1] : [0.7, 0.9, 1.1];
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2, dd = sizes[i], lift = (n - 1 - i) * 0.26, cy = 1.1 + lift + dd / 2;
          if (i < n - 1) { const nd = sizes[i + 1], nx = cx + w, ny = 1.1 + (n - 2 - i) * 0.26 + nd / 2; t.line(s, cx + dd / 2 + 0.05, Math.min(cy, ny), nx - cx - dd / 2 - nd / 2 - 0.1, Math.abs(cy - ny) || 0.001, C.bond, 3, { flipV: true }); }
          await ball(s, cx, cy, dd, i + 1, i + 1, 13 + dd * 12);
          const y = cy + dd / 2 + 0.06;
          hd(s, st.h, x + 0.08, y, w - 0.16, 0.52, { color: DK[i + 1], max: 14, min: 10.5, align: 'center' });
          bd(s, st.t, x + 0.08, y + 0.54, w - 0.16, 5.22 - y - 0.54, { align: 'center', max: 13 });
        }
      },
      async (d) => { // one long bond runs down the middle, steps come off it to either side
        const s = page(d), n = d.steps.length, y0 = 1.0, rh = 4.2 / n, cx = 5, dd = 0.64;
        bond(s, [cx, y0 + rh / 2], [cx, y0 + rh * (n - 0.5)]);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, cy = y + rh / 2, right = i % 2 === 1, w = 3.95, x = right ? cx + 0.55 : 0.5, a = right ? 'left' : 'right';
          await ball(s, cx, cy, dd, i + 1, i + 1, 17);
          hd(s, st.h, x, y + 0.02, w, 0.34, { color: DK[i + 1], max: 14, align: a });
          bd(s, st.t, x, y + 0.37, w, rh - 0.39, { align: a, max: 12.5 });
        }
      },
      async (d) => { // in the dark: an atom with its electron shells, each step one shell further out
        const s = night(d), n = d.steps.length, cx = 2.5, cy = 3.08, rh = 4.2 / n;
        for (const [i] of d.steps.entries()) { const r = 0.85 + i * (1.2 / (n - 1)); t.oval(s, cx - r, cy - r, 2 * r, 2 * r, null, { line: { color: '59606B', width: 1.5 }, name: 'Shell' }); }
        await atom(s, cx, cy, 0.8, 1);
        for (const [i, st] of d.steps.entries()) {
          const r = 0.85 + i * (1.2 / (n - 1)), a = -0.9 + i * (1.8 / (n - 1)), ex = cx + r * Math.cos(a), ey = cy + r * Math.sin(a), y = 1.0 + i * rh;
          await ball(s, ex, ey, 0.44, i + 1, i + 1, 13);
          hd(s, st.h, 5.1, y + 0.02, 4.5, 0.34, { color: 'FFFFFF', max: 14 });
          bd(s, st.t, 5.1, y + 0.37, 4.5, rh - 0.4, { color: FOG, max: 12.5 });
        }
      },
      async (d) => { // test tubes in a rack: the number sits in the round foot, the words in the liquid
        const s = page(d), n = d.steps.length, gap = 0.25, w = (9.0 - gap * (n - 1)) / n, x0 = 0.5, top = 1.15, bot = 5.2;
        t.rect(s, 0.3, 1.32, 9.4, 0.12, '8E96A3', { name: 'Rack' });
        for (const [i, st] of d.steps.entries()) {
          const x = x0 + i * (w + gap), c = i + 1, W2 = Math.round(w * 100), H2 = Math.round((bot - top) * 100);
          t.img(s, await k.svg(`tube${n}${c}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><rect x="2" y="2" width="${W2 - 4}" height="${H2 - 4}" rx="${W2 * 0.18}" fill="#FFFFFF" stroke="#8E96A3" stroke-width="3"/><path d="M4,42 H${W2 - 4} V${H2 - W2 * 0.18} Q${W2 - 4},${H2 - 4} ${W2 - W2 * 0.18},${H2 - 4} H${W2 * 0.18} Q4,${H2 - 4} 4,${H2 - W2 * 0.18} Z" fill="#${TINT[c]}"/></svg>`, W2, H2), x, top, w, bot - top);
          await ball(s, x + 0.42, top + 0.72, 0.5, c, i + 1, 15);
          hd(s, st.h, x + 0.72, top + 0.42, w - 0.82, 0.6, { color: DK[c], max: 13.5, min: 10.5 });
          bd(s, st.t, x + 0.15, top + 1.1, w - 0.3, bot - top - 1.25, { max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // one giant element tile holds the lead figure, two small tiles and a note beside it
        const s = page(d), [a, b, c] = d.stats;
        t.rect(s, 0.4, 1.05, 4.7, 4.12, A[2], { name: 'Tile' });
        k.txt(s, '1', 0.55, 1.13, 0.6, 0.4, { size: 16, bold: true, color: 'FFFFFF', valign: 'middle', ls: 1 });
        hd(s, a.value, 0.6, 1.6, 4.3, 1.6, { max: 62, min: 26, color: 'FFFFFF', align: 'center' });
        bd(s, a.label, 0.7, 3.3, 4.1, 1.6, { color: 'FFFFFF', max: 15, min: 11, align: 'center' });
        [[b, 1], [c, 4]].forEach(([v, col], i) => { const y = 1.05 + i * 1.36, x = 5.25; t.rect(s, x, y, 4.35, 1.26, TINT[col], { line: { color: A[col], width: 1.25 }, name: 'Tile' }); k.txt(s, String(i + 2), x + 0.08, y + 0.05, 0.3, 0.26, { size: 10, bold: true, color: DK[col], ls: 1 }); hd(s, v.value, x + 0.3, y + 0.05, 1.75, 1.16, { max: 26, min: 14, color: DK[col] }); bd(s, v.label, x + 2.1, y + 0.05, 2.17, 1.16, { valign: 'middle', max: 12 }); });
        if (d.note) bd(s, d.note, 5.25, 3.78, 4.35, 1.42, { color: C.muted, max: 12, valign: 'middle' });
      },
      async (d) => { // three atoms bonded in a line, a figure inside each, its name beneath
        const s = page(d), dd = 2.05, P2 = [[1.85, 2.15], [5, 2.15], [8.15, 2.15]];
        bond(s, P2[0], P2[1]); bond(s, P2[1], P2[2]);
        for (const [i, v] of d.stats.entries()) {
          const [cx, cy] = P2[i], c = [1, 2, 4][i];
          await atom(s, cx, cy, dd, c);
          hd(s, v.value, cx - 0.82, cy - 0.5, 1.64, 1.0, { max: 30, min: 15, color: 'FFFFFF', align: 'center' });
          bd(s, v.label, cx - 1.4, 3.25, 2.8, 0.62, { align: 'center', max: 12.5 });
        }
        if (d.note) { t.line(s, 0.6, 3.95, 8.8, 0, C.bond, 1); bd(s, d.note, 0.6, 4.02, 8.8, 1.2, { color: C.muted, valign: 'middle', align: 'center', max: 13 }); }
      },
      async (d) => { // in the dark: figures in rows with a small coloured bond before each, the note below
        const s = night(d), rh = 1.03, cs = ['FF7A70', '7FA6FF', '5ED6A6'], idx = [1, 2, 4];
        for (const [i, v] of d.stats.entries()) {
          const y = 1.02 + i * rh, cy = y + rh / 2;
          t.line(s, 0.4, cy, 0.5, 0, C.bond, 5);
          await atom(s, 1.05, cy, 0.42, idx[i]);
          hd(s, v.value, 1.45, y, 3.3, rh - 0.05, { max: 40, min: 18, color: cs[i] });
          bd(s, v.label, 4.9, y, 4.7, rh - 0.05, { color: 'FFFFFF', valign: 'middle', max: 14 });
          t.line(s, 0.4, y + rh - 0.02, 9.2, 0, '3A3F48', 0.75);
        }
        if (d.note) bd(s, d.note, 0.4, 4.16, 9.2, 1.06, { color: FOG, valign: 'middle', max: 13 });
      },
    ],
    compare: [
      async (d) => { // two tinted halves joined by a double bond at the middle, sides mirrored
        const s = page(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, 3.85, F.body, 0.12, 3.25);
        t.rect(s, 0, 0.98, 5, 4.25, TINT[1], { name: 'Side' }); t.rect(s, 5, 0.98, 5, 4.25, TINT[2], { name: 'Side' });
        t.line(s, 4.55, 3.0, 0.9, 0, C.bond, 5); t.line(s, 4.55, 3.2, 0.9, 0, C.bond, 5);
        await atom(s, 4.55, 3.1, 0.5, 1); await atom(s, 5.45, 3.1, 0.5, 2);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.8 : 0.35, w = 3.85, a = i ? 'left' : 'right';
          hd(s, sd.h, x, 1.04, w, 0.56, { max: 18, min: 12, color: DK[i + 1], align: a });
          let y = 1.7; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: a, ls: 1 }); y += rr[j]; });
        }
      },
      async (d) => { // two molecules one above the other: a chain of small atoms with the lines beside each
        const s = page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.14 : 1.03, h = 2.03, n = sd.items.length, c = i ? 4 : 5, x0 = 2.6, w = (9.6 - x0) / n, ay = y + 0.3;
          t.rect(s, 0.4, y, 9.2, h, TINT[c], { r: 0.06, name: 'Band' });
          hd(s, sd.h, 0.55, y + 0.1, 1.9, h - 0.2, { max: 17, min: 12, color: DK[c] });
          t.line(s, x0 + 0.2, ay, (n - 1) * w, 0, C.bond, 4);
          for (const [j, it] of sd.items.entries()) { const x = x0 + j * w; await atom(s, x + 0.2, ay, 0.3, c); bd(s, it, x + 0.05, y + 0.52, w - 0.13, h - 0.58, { max: 12.5 }); }
        }
      },
    ],
    statement: [
      async (d) => { // in the dark: orbits loop behind the sentence, the note clear below them
        const s = night(d);
        t.img(s, await orbit('wide', 1000, 280, [8, -8], '3A3F48'), 0, 0.92, 10, 2.8);
        await atom(s, 1.0, 1.72, 0.4, 1); await atom(s, 9.0, 1.72, 0.4, 2); await atom(s, 1.0, 2.92, 0.4, 3); await atom(s, 9.0, 2.92, 0.4, 4);
        hd(s, L.runs(d.text), 1.5, 1.2, 7.0, 2.4, { max: 30, min: 15, color: 'FFFFFF', align: 'center' });
        if (d.caption) bd(s, d.caption, 1.5, 3.68, 7.0, 1.5, { color: FOG, align: 'center', valign: 'middle', max: 13 });
      },
      async (d) => { // the sentence large at the left, the note inside an open benzene ring at the right
        const s = page(d), r = 2.08, cx = 7.45, cy = 3.1, Hx = hexPts(cx, cy, r);
        for (let i = 0; i < 6; i++) bond(s, Hx[i], Hx[(i + 1) % 6]);
        for (const [i, p] of Hx.entries()) await atom(s, p[0], p[1], 0.44, i);
        k.head(s, L.runs(d.text), 0.4, 1.05, 4.65, 4.1, { max: 27, min: 14 });
        if (d.caption) bd(s, d.caption, cx - 1.42, cy - 1.45, 2.84, 2.9, { color: C.muted, align: 'center', valign: 'middle', max: 12.5, ls: 1.12 });
      },
    ],
    timeline: [
      async (d) => { // one straight chain across the page: atoms with years, events over and under it in turn
        const s = page(d), ay = 3.08, w = 3.3, step = 1.95, dd = 1.14;
        t.line(s, 0.4, ay, 9.2, 0, C.bond, 7);
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * step, up = i % 2 === 0, c = i + 1, cx = x + dd / 2, y = up ? 1.0 : ay + dd / 2 + 0.05, h = up ? ay - dd / 2 - 1.05 : 5.22 - y;
          await atom(s, cx, ay, dd, c);
          k.txt(s, it.year, cx - 0.54, ay - 0.3, 1.08, 0.6, { size: 12, bold: true, font: F.head, color: onAtom(c), align: 'center', valign: 'middle', ls: 1 });
          hd(s, it.h, x, y, w, 0.34, { color: DK[c], max: 13.5 });
          bd(s, it.t, x, y + 0.36, w, h - 0.38, { max: 12 });
        }
      },
      async (d) => { // in the dark: a row of element tiles, the year written large as the symbol, events under them
        const s = night(d), gap = 0.12, w = (9.2 - gap * 3) / 4;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * (w + gap), c = i + 1;
          t.rect(s, x, 1.02, w, 1.25, A[c], { name: 'Tile' });
          k.txt(s, String(i + 1), x + 0.09, 1.06, 0.4, 0.26, { size: 10, bold: true, color: onAtom(c), ls: 1 });
          hd(s, it.year, x + 0.08, 1.3, w - 0.16, 0.85, { max: 22, min: 12, color: onAtom(c), align: 'center' });
          hd(s, it.h, x + 0.04, 2.34, w - 0.08, 0.52, { color: 'FFFFFF', max: 14, min: 10.5 });
          bd(s, it.t, x + 0.04, 2.88, w - 0.08, 2.32, { color: FOG, max: 13 });
        }
      },
      async (d) => { // diatomic pairs in rows: two joined atoms open each entry, the year in a capsule of them
        const s = page(d), rh = 4.15 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = 1.05 + i * rh, cy = y + rh / 2, c = i + 1;
          t.rect(s, 0.4, cy - 0.3, 1.9, 0.6, A[c], { r: 0.3, name: 'Capsule' });
          hd(s, it.year, 0.48, cy - 0.3, 1.74, 0.6, { max: 16, min: 10.5, color: onAtom(c), align: 'center' });
          bond(s, [2.3, cy], [2.65, cy]);
          await atom(s, 2.72, cy, 0.3, c);
          hd(s, it.h, 3.0, y, 1.95, rh - 0.05, { color: DK[c], max: 13.5, min: 10.5 });
          bd(s, it.t, 5.05, y, 4.55, rh - 0.05, { valign: 'middle', max: 12.5 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.cards = V.cards.shift(); // the old cards, process, stats and timeline were all the same molecule, its words too small inside the atoms
  R.process = V.process.shift();
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Molekula', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '2D3748', lt2: C.bg, accent1: C.atoms[1], accent2: C.atoms[2], accent3: C.atoms[3], accent4: C.atoms[4], accent5: C.atoms[5], accent6: C.atoms[0], hlink: C.atoms[2], folHlink: C.muted } });
}
module.exports = { id: 154, slug: 'molekula', name: 'Molekula', category: 'academic', photos: true, build, style: { tone: "tarkibiy bog'lanish: har bir element boshqalari bilan bog'langan; qisqa va ilmiy", limits: { card_t3: 90, card_t4: 80, step_t: 80, event_t: 70, side_item: 50 }, prefer: null } };
