/**
 * 128 Shajara — a top-down TREE: a root node at the top, elbow connectors branching down to child nodes,
 * leaves listed under their branches; the sources slide is a directory tree (├──). Navy nodes on warm sand.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F6F1E9', ink: '1D2A3A', muted: '5E6B78', node: '1D3557', node2: 'E9C46A', line: '8D99AE', light: 'FFFFFF' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const node = (s, x, y, w, h, fill = C.node) => t.rect(s, x, y, w, h, fill, { r: 0.1, name: 'Node' });
  const root = (s, txt, w = 4.4) => { node(s, 5 - w / 2, 0.3, w, 0.7); k.head(s, txt || '', 5 - w / 2 + 0.15, 0.3, w - 0.3, 0.7, { max: 20, min: 12, color: C.light, align: 'center' }); };
  // children under the root: returns the child boxes after drawing elbow connectors
  const kids = (s, n, y = 1.55, h = 0.6) => { const w = 9.2 / n; t.line(s, 5, 1.0, 0, 0.27, C.line, 1.5); t.line(s, 0.4 + w / 2, 1.27, w * (n - 1), 0, C.line, 1.5); return Array.from({ length: n }, (_, i) => { const x = 0.4 + i * w; t.line(s, x + w / 2, 1.27, 0, y - 1.27, C.line, 1.5); return { x: x + 0.06, y, w: w - 0.12, h }; }); };
  const page = (d) => { const s = k.slide(C.bg); root(s, d.title); k.txt(s, String(k.idx), 9.0, 0.3, 0.6, 0.7, { size: 16, bold: true, color: C.node, align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5 }); return s; };
  const branch = (s, n, top, below) => kids(s, n).forEach((b, i) => { node(s, b.x, b.y, b.w, b.h, i % 2 ? C.node : '2A6F97'); top(i, b); t.line(s, b.x + b.w / 2, b.y + b.h, 0, 0.18, C.line, 1.25); below(i, b.x, b.y + b.h + 0.22, b.w, 5.15 - (b.y + b.h + 0.22)); });
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) { t.oval(s, 4.1, 0.25, 1.8, 1.8, C.node2); await k.photo(s, d.image, 4.2, 0.35, 1.6, 1.6, { mask: 'circle' }); }
      node(s, 1.6, 2.25, 6.8, 1.2); k.head(s, d.title, 1.8, 2.28, 6.4, 1.14, { max: 30, min: 15, color: C.light, align: 'center' }); t.line(s, 5, 3.45, 0, 0.3, C.line, 1.5); t.line(s, 1.9, 3.75, 6.2, 0, C.line, 1.5);
      [k.M.author, k.M.org, [k.M.loc, k.M.year].filter(Boolean).join(', ')].forEach((tx, i) => { const x = 0.6 + i * 3.1; t.line(s, x + 1.3, 3.75, 0, 0.25, C.line, 1.5); node(s, x, 4.0, 2.6, 0.6, i ? 'FFFFFF' : C.node2); k.txt(s, tx || '', x + 0.1, 4.0, 2.4, 0.6, { max: 13, bold: !i, align: 'center', valign: 'middle' }); });
      if (d.subtitle) k.txt(s, d.subtitle, 0.6, 4.7, 8.8, 0.45, { max: 11, color: C.muted, align: 'center' }); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); },
    async intro(d) { const s = page(d); const b = kids(s, 2, 1.55, 3.55); await k.photo(s, d.image, b[0].x, b[0].y, b[0].w, b[0].h, { mask: { r: 0.1 } }); node(s, b[1].x, b[1].y, b[1].w, b[1].h, 'FFFFFF'); k.txt(s, d.text, b[1].x + 0.2, b[1].y + 0.15, b[1].w - 0.4, b[1].h - 0.3, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); branch(s, d.items.length, (i, b) => k.txt(s, String(i + 1), b.x, b.y, b.w, b.h, { size: 20, bold: true, color: C.light, align: 'center', valign: 'middle' }), (i, x, y, w, h) => k.head(s, d.items[i], x, y, w, Math.min(h, 1.5), { max: 15, align: 'center', valign: 'top' })); },
    async cards(d) { const s = page(d); branch(s, d.items.length, (i, b) => k.head(s, d.items[i].h, b.x + 0.08, b.y, b.w - 0.16, b.h, { max: 14, color: C.light, align: 'center' }), (i, x, y, w, h) => k.txt(s, d.items[i].t, x, y, w, h, { max: 13, align: 'center' })); },
    async process(d) { const s = page(d); branch(s, d.steps.length, (i, b) => k.head(s, `${i + 1}. ${d.steps[i].h}`, b.x + 0.08, b.y, b.w - 0.16, b.h, { max: 14, color: C.light, align: 'center' }), (i, x, y, w, h) => k.txt(s, d.steps[i].t, x, y, w, h, { max: 13, align: 'center' })); },
    async stats(d) { const s = page(d); branch(s, d.stats.length, (i, b) => k.head(s, d.stats[i].value, b.x, b.y, b.w, b.h, { max: 26, min: 12, color: C.node2, align: 'center' }), (i, x, y, w, h) => k.txt(s, d.stats[i].label, x, y, w, h - (d.note ? 0.6 : 0), { max: 13, align: 'center' }));
      if (d.note) k.txt(s, d.note, 0.4, 4.6, 9.2, 0.55, { max: 9, color: C.muted, align: 'center' }); },
    async compare(d) { const s = page(d), bx = kids(s, 2), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, 3.8, F.body, 0.1, 2.9);
      [d.left, d.right].forEach((sd, i) => { const b = bx[i]; node(s, b.x, b.y, b.w, b.h, i ? '2A6F97' : C.node); k.head(s, sd.h, b.x + 0.1, b.y, b.w - 0.2, b.h, { max: 16, color: C.light, align: 'center' }); const lx = b.x + 0.35; t.line(s, lx, b.y + b.h, 0, 2.95, C.line, 1.25); let y = b.y + b.h + 0.1; sd.items.forEach((it, j) => { t.line(s, lx, y + 0.15, 0.25, 0, C.line, 1.25); k.txt(s, it, lx + 0.35, y, 3.8, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); const b = kids(s, 1, 1.55, 2.0); node(s, 1.2, b[0].y, 7.6, 2.0, 'FFFFFF'); k.head(s, L.runs(d.text), 1.4, b[0].y + 0.1, 7.2, 1.8, { max: 28, min: 14, align: 'center' }); if (d.caption) k.txt(s, d.caption, 1.2, 3.75, 7.6, 1.35, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); branch(s, d.items.length, (i, b) => k.head(s, d.items[i].year, b.x, b.y, b.w, b.h, { max: 20, min: 11, color: C.node2, align: 'center' }), (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 14, align: 'center' }); k.txt(s, d.items[i].t, x, y + 0.45, w, h - 0.45, { max: 12, align: 'center', color: C.muted }); }); },
    async quote(d) { const s = page({ title: d.author || '' }); const b = kids(s, 1, 1.55, 3.2); node(s, 1.2, b[0].y, 7.6, 3.2, 'FFFFFF'); k.head(s, `\u201C${d.text}\u201D`, 1.5, b[0].y + 0.2, 7.0, 2.8, { max: 28, min: 14, italic: true, align: 'center' }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.9 / n; t.line(s, 0.7, 1.0, 0, 1.15 + (n - 0.5) * rh - 1.0, C.line, 1.25); d.items.forEach((it, i) => { const y = 1.15 + i * rh; t.line(s, 0.7, y + rh / 2, 0.35, 0, C.line, 1.25); k.txt(s, it, 1.15, y, 8.4, rh, { max: 12, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all grown from the same tree: a deck's pages must not look alike (L.pages)
  const SKY = '2A6F97', GOLD = C.node2, MIST = 'C9D3DE', NIGHT = '14263F', LEAF = 'FFFFFF';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const elbowH = (s, x1, y1, x2, y2, col = C.line, w = 1.5) => { const xm = (x1 + x2) / 2; t.line(s, Math.min(x1, xm), y1, Math.abs(xm - x1), 0, col, w); t.line(s, xm, Math.min(y1, y2), 0, Math.abs(y2 - y1), col, w); t.line(s, Math.min(xm, x2), y2, Math.abs(x2 - xm), 0, col, w); };
  const num = (s, xr = 9.0, col = C.node, y = 0.3) => k.txt(s, String(k.idx), xr, y, 0.6, 0.7, { size: 16, bold: true, color: col, align: 'right', valign: 'middle' });
  const footN = (s) => k.foot(s, { y: 5.32, size: 7.5, color: MIST });
  const V = {
    image: [
      async (d) => { // a family portrait: an oval picture in a gilt frame, a branch joins it to the root and the words
        const s = k.slide(C.bg), ox = 5.15, oy = 0.42, ow = 4.45, oh = 4.6;
        node(s, 0.4, 0.3, 4.3, 0.92); k.head(s, d.title || '', 0.55, 0.3, 4.0, 0.92, { max: 18, min: 12, color: C.light });
        t.line(s, 1.4, 1.22, 0, 0.3, C.line, 1.5); t.line(s, 4.7, 0.76, ox - 4.7 + 0.1, 0, C.line, 1.5);
        node(s, 0.4, 1.52, 4.3, 3.66, 'FFFFFF'); bd(s, d.text, 0.58, 1.6, 3.94, 3.5, { max: 13, valign: 'middle' });
        t.oval(s, ox - 0.09, oy - 0.09, ow + 0.18, oh + 0.18, GOLD);
        t.img(s, await L.photo(L.src(d.image), ow, oh, { mask: 'circle' }), ox, oy, ow, oh, { alt: '' });
        num(s, 9.0, C.node, 4.72); k.foot(s, { y: 5.32, size: 7.5, w: 4.4, x: 0.4 });
      },
      async (d) => { // the picture is the crown above, the branches fall from it into the words
        const s = k.slide(C.bg), hh = 2.45;
        await k.photo(s, d.image, 0, 0, 10, hh);
        node(s, 0.4, hh - 0.42, 9.2, 0.74, C.node); k.head(s, d.title || '', 0.6, hh - 0.42, 8.1, 0.74, { max: 22, min: 13, color: C.light });
        k.txt(s, String(k.idx), 8.8, hh - 0.42, 0.65, 0.74, { size: 16, bold: true, color: GOLD, align: 'right', valign: 'middle' });
        for (const x of [1.6, 5, 8.4]) t.line(s, x, hh + 0.32, 0, 0.2, C.line, 1.5);
        t.line(s, 1.6, hh + 0.52, 6.8, 0, C.line, 1.5);
        t.rect(s, 0.4, hh + 0.52, 9.2, 5.22 - hh - 0.52, 'FFFFFF', { r: 0.1, name: 'Node' });
        bd(s, d.text, 0.6, hh + 0.56, 8.8, 5.2 - hh - 0.6, { max: 13, valign: 'middle', ls: 1.1 });
        k.foot(s, { y: 5.32, size: 7.5 });
      },
      async (d) => { // the picture is the whole forest; a dark node stands in it with the words
        const s = k.slide(NIGHT);
        await k.photo(s, d.image, 0, 0, 10, 5.27);
        t.rect(s, 0, 5.27, 10, 0.355, NIGHT, { name: 'Band' });
        node(s, 0.4, 0.34, 5.1, 4.6, C.node);
        k.head(s, d.title || '', 0.62, 0.42, 3.95, 0.9, { max: 20, min: 13, color: GOLD });
        k.txt(s, String(k.idx), 4.65, 0.42, 0.65, 0.5, { size: 16, bold: true, color: C.light, align: 'right', valign: 'middle' });
        t.line(s, 0.62, 1.36, 4.66, 0, C.line, 1.25);
        bd(s, d.text, 0.62, 1.44, 4.66, 3.42, { max: 13, color: C.light });
        footN(s);
      },
      async (d) => { // at night the picture is the crown of one tree, on its trunk, on the ground
        const s = k.slide(NIGHT), W0 = 4.5, H0 = 3.9, x = 5.1, y = 0.28;
        t.line(s, 0, 5.18, 10, 0, MIST, 1.5);
        t.rect(s, x + W0 / 2 - 0.2, y + H0 - 0.5, 0.4, 5.18 - y - H0 + 0.5, '8D6E4A', { name: 'Trunk' });
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: { path: 'M0.5,0 C0.68,-0.02 0.82,0.1 0.84,0.22 C1.0,0.28 1.04,0.52 0.92,0.64 C0.92,0.84 0.7,0.96 0.56,0.9 C0.42,1.02 0.14,0.96 0.1,0.72 C-0.04,0.6 -0.03,0.32 0.14,0.26 C0.16,0.1 0.34,-0.02 0.5,0 Z' } }), x, y, W0, H0, { alt: '' });
        k.head(s, d.title || '', 0.4, 0.3, 4.4, 1.05, { max: 22, min: 13, color: GOLD, valign: 'top' });
        bd(s, d.text, 0.4, 1.4, 4.4, 3.68, { max: 13, color: C.light });
        k.txt(s, String(k.idx), 9.0, 0.2, 0.6, 0.45, { size: 16, bold: true, color: C.light, align: 'right', valign: 'middle' });
        footN(s);
      },
    ],
    cards: [
      async (d) => { // the tree lies on its side: a tall root at the left, each idea a leaf node to the right
        const s = k.slide(C.bg), n = d.items.length, top = 0.3, rh = (5.22 - top) / n, rw = 2.55;
        node(s, 0.3, 1.1, rw, 3.3); k.head(s, d.title || '', 0.42, 1.14, rw - 0.24, 3.22, { max: 22, min: 13, color: C.light, align: 'center' });
        k.txt(s, String(k.idx), 0.3, 0.3, 0.6, 0.5, { size: 16, bold: true, color: C.node, valign: 'middle' });
        const tr = rw + 0.3 + 0.28; t.line(s, rw + 0.3, 2.75, 0.28, 0, C.line, 1.5);
        t.line(s, tr, top + rh / 2, 0, (n - 1) * rh, C.line, 1.5);
        for (const [i, it] of d.items.entries()) {
          const y = top + i * rh, x = tr + 0.25, w = 9.7 - x;
          t.line(s, tr, y + rh / 2, 0.25, 0, C.line, 1.5);
          node(s, x, y + 0.04, w, rh - 0.08, 'FFFFFF');
          t.oval(s, x + 0.1, y + 0.1, 0.42, 0.42, i % 2 ? SKY : C.node); t.img(s, await k.icon(it.icon, C.light, 2), x + 0.21, y + 0.21, 0.2, 0.2);
          hd(s, it.h, x + 0.6, y + 0.08, w - 0.72, 0.42, { color: i % 2 ? SKY : C.node });
          bd(s, it.t, x + 0.14, y + 0.52, w - 0.28, rh - 0.6, { max: 12.5, ls: 1.08 });
        }
        k.foot(s, { x: 3.1, y: 5.32, size: 7.5, w: 6.6 });
      },
      async (d) => { // the tree seen from below: the title is the root at the foot, branches rise to each idea
        const s = k.slide(C.bg), n = d.items.length, w = 9.2 / n, ry = 4.42, y0 = 0.3, by = 4.14;
        node(s, 2.3, ry, 5.4, 0.74); k.head(s, d.title || '', 2.42, ry, 5.16, 0.74, { max: 19, min: 12, color: C.light, align: 'center' });
        k.txt(s, String(k.idx), 9.0, ry, 0.6, 0.74, { size: 16, bold: true, color: C.node, align: 'right', valign: 'middle' });
        t.line(s, 5, by, 0, ry - by, C.line, 1.5); t.line(s, 0.4 + w / 2, by, w * (n - 1), 0, C.line, 1.5);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.05, ww = w - 0.1, c = x + ww / 2;
          t.line(s, c, by - 0.14, 0, 0.14, C.line, 1.5);
          node(s, x, y0, ww, by - 0.14 - y0, 'FFFFFF');
          t.oval(s, c - 0.27, y0 + 0.12, 0.54, 0.54, i % 2 ? SKY : C.node); t.img(s, await k.icon(it.icon, C.light, 2), c - 0.14, y0 + 0.25, 0.28, 0.28);
          hd(s, it.h, x + 0.1, y0 + 0.72, ww - 0.2, 0.56, { align: 'center', max: 14 });
          bd(s, it.t, x + 0.1, y0 + 1.3, ww - 0.2, by - 0.14 - y0 - 1.36, { align: 'center', max: 12.5 });
        }
        k.foot(s, { y: 5.32, size: 7.5 });
      },
      async (d) => { // night: a radial tree, branches curve out from one gold heart to the corners
        const s = k.slide(NIGHT), n = d.items.length, cx = 5, cy = 3.1, w = 3.45, spots = n === 4 ? [[0, 1.02], [1, 1.02], [0, 3.14], [1, 3.14]] : [[0, 1.02], [1, 2.1], [0, 3.14]], hh = 2.04;
        k.head(s, d.title || '', 0.4, 0.22, 8.2, 0.7, { max: 24, min: 13, color: C.light }); num(s, 9.0, GOLD, 0.22);
        const P = 160; let g = ''; for (const [side, y] of spots) { const ax = side ? 6.15 : 3.85, ay = y + 0.3; g += `<path d="M${cx * P},${cy * P} C${(cx + (side ? 0.5 : -0.5)) * P},${cy * P} ${(ax + (side ? -0.4 : 0.4)) * P},${ay * P} ${ax * P},${ay * P}" fill="none" stroke="#${GOLD}" stroke-width="3"/>`; }
        t.img(s, await k.svg(`radial${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${g}</svg>`, 1600, 900), 0, 0, 10, 5.625);
        t.oval(s, cx - 0.42, cy - 0.42, 0.84, 0.84, GOLD); k.txt(s, String(n), cx - 0.42, cy - 0.42, 0.84, 0.84, { size: 22, bold: true, font: F.head, color: C.node, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? 6.15 : 0.4;
          node(s, x, y, w, hh - 0.08, C.node);
          t.img(s, await k.icon(it.icon, GOLD, 2), x + 0.12, y + 0.1, 0.34, 0.34);
          hd(s, it.h, x + 0.54, y + 0.05, w - 0.64, 0.46, { color: GOLD, max: 14 });
          bd(s, it.t, x + 0.14, y + 0.56, w - 0.28, hh - 0.7, { color: C.light, max: 12.5 });
        }
        footN(s);
      },
      async (d) => { // one trunk up the middle, the ideas grow as leaves to left and right by turns
        const s = k.slide(C.bg), n = d.items.length, cx = 5, w = 4.3, y0 = 1.06; root(s, d.title); num(s);
        const rh = (5.2 - y0) / (n === 4 ? 2 : 2), spots = n === 4 ? [[0, 0], [1, 0.26], [0, 1], [1, 1.26]] : [[0, 0], [1, 0.5], [0, 1]], hh = rh - 0.1;
        t.rect(s, cx - 0.05, 1.0, 0.1, 4.2, '8D6E4A', { name: 'Trunk' });
        for (const [i, it] of d.items.entries()) {
          const [side, r] = spots[i], y = y0 + r * rh, x = side ? cx + 0.32 : cx - 0.32 - w, hh2 = Math.min(hh, 5.2 - y);
          t.line(s, side ? cx : x + w, y + 0.32, 0.32, 0, C.line, 2);
          t.rect(s, x, y, w, hh2, 'FFFFFF', { r: 0.28, line: { color: i % 2 ? SKY : C.node, width: 1.25 }, name: 'Leaf' });
          t.img(s, await k.icon(it.icon, i % 2 ? SKY : C.node, 2), x + 0.2, y + 0.14, 0.32, 0.32);
          hd(s, it.h, x + 0.6, y + 0.08, w - 0.8, 0.44, { color: i % 2 ? SKY : C.node, max: 14 });
          bd(s, it.t, x + 0.2, y + 0.54, w - 0.4, hh2 - 0.62, { max: 12.5, ls: 1.08 });
        }
        k.foot(s, { y: 5.32, size: 7.5 });
      },
    ],
    process: [
      async (d) => { // the tree grows: each new generation stands higher and to the right, an elbow joining them
        const s = k.slide(C.bg), n = d.steps.length, w = 9.3 / n, tops = n === 4 ? [2.46, 1.92, 1.38, 0.84] : [2.3, 1.56, 0.84]; 
        k.head(s, d.title || '', 0.35, 0.25, n === 4 ? 6.8 : 6.2, 0.56, { max: 22, min: 13 }); num(s, 9.0, C.node, 0.12);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * w, y = tops[i], ww = w - 0.18, f = i % 2 ? SKY : C.node;
          if (i < n - 1) { t.line(s, x + ww / 2, tops[i + 1] + 0.3, 0, y - tops[i + 1] - 0.3, C.line, 1.5); t.line(s, x + ww / 2, tops[i + 1] + 0.3, w - ww / 2, 0, C.line, 1.5); }
          node(s, x, y, ww, 0.62, f);
          t.oval(s, x + 0.08, y + 0.11, 0.4, 0.4, GOLD); k.txt(s, String(i + 1), x + 0.08, y + 0.11, 0.4, 0.4, { size: 14, bold: true, font: F.head, color: C.node, align: 'center', valign: 'middle' });
          hd(s, st.h, x + 0.54, y, ww - 0.6, 0.62, { color: C.light, max: 13, min: 10 });
          bd(s, st.t, x + 0.04, y + 0.7, ww - 0.08, 5.22 - y - 0.7, { max: 12.5 });
        }
        k.foot(s, { y: 5.32, size: 7.5 });
      },
      async (d) => { // an ancestry register: a band for each generation, a line descending through the numbers
        const s = k.slide(C.bg), n = d.steps.length, y0 = 1.14, rh = (5.2 - y0) / n; root(s, d.title, 5.6); num(s);
        t.line(s, 1.0, 1.0, 0, (n - 0.5) * rh + 0.14, C.line, 2);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh;
          if (i % 2 === 0) t.rect(s, 0, y, 10, rh, 'EDE5D6', { name: 'Band' });
        }
        t.line(s, 1.0, 1.0, 0, (n - 0.5) * rh + 0.14, C.line, 2);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh;
          t.oval(s, 0.72, y + rh / 2 - 0.28, 0.56, 0.56, C.node); k.txt(s, String(i + 1), 0.72, y + rh / 2 - 0.28, 0.56, 0.56, { size: 18, bold: true, font: F.head, color: GOLD, align: 'center', valign: 'middle' });
          k.head(s, st.h, 1.55, y, 2.7, rh, { max: 15, min: 11 });
          bd(s, st.t, 4.4, y + 0.03, 5.2, rh - 0.06, { valign: 'middle', max: 12.5, ls: 1.08 });
        }
        k.foot(s, { y: 5.32, size: 7.5 });
      },
      async (d) => { // night: the line runs from an upper branch to a lower one and back, at each turn a node
        const s = k.slide(NIGHT), n = d.steps.length, w = 3.55, sx = (9.2 - w) / (n - 1), ys = [1.0, 3.12], hh = 2.06;
        k.head(s, d.title || '', 0.4, 0.2, 8.2, 0.68, { max: 24, min: 13, color: C.light }); num(s, 9.0, GOLD, 0.2);
        t.line(s, 0, 3.06, 10, 0, '2F4A6D', 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * sx, y = ys[i % 2];
          if (i < n - 1) t.line(s, x + sx + 0.2, i % 2 ? ys[0] + 0.5 : y + 0.5, 0, ys[1] - ys[0], GOLD, 1.5);
          node(s, x, y, w, hh, C.node);
          t.oval(s, x + 0.1, y + 0.08, 0.4, 0.4, GOLD); k.txt(s, String(i + 1), x + 0.1, y + 0.08, 0.4, 0.4, { size: 14, bold: true, font: F.head, color: C.node, align: 'center', valign: 'middle' });
          hd(s, st.h, x + 0.58, y + 0.06, w - 0.66, 0.44, { color: GOLD, max: 14 });
          bd(s, st.t, x + 0.14, y + 0.56, w - 0.28, hh - 0.64, { color: C.light, max: 12.5 });
        }
        footN(s);
      },
      async (d) => { // a directory tree: each step sits one folder deeper than the one before
        const s = k.slide(C.bg), n = d.steps.length, ind = n === 4 ? 0.72 : 1.0, y0 = 1.12, rh = (5.2 - y0) / n, x0 = 0.5;
        k.head(s, d.title || '', 0.4, 0.28, 8.2, 0.66, { max: 24, min: 13 }); num(s);
        t.line(s, 0.4, 0.98, 9.2, 0, C.line, 1);
        for (const [i, st] of d.steps.entries()) {
          const x = x0 + i * ind, y = y0 + i * rh, xx = x + 0.52, ww = 9.6 - xx;
          t.line(s, x + 0.0, y - 0.1, 0, 0.32, C.line, 1.5); t.line(s, x, y + 0.22, 0.2, 0, C.line, 1.5);
          t.rect(s, x + 0.2, y + 0.03, 0.34, 0.34, C.node, { r: 0.05, name: 'Folder' });
          k.txt(s, String(i + 1), x + 0.2, y + 0.03, 0.34, 0.34, { size: 12, bold: true, font: F.head, color: GOLD, align: 'center', valign: 'middle' });
          hd(s, st.h, xx + 0.1, y, ww - 0.1, 0.38, { color: C.node, max: 14 });
          bd(s, st.t, xx + 0.1, y + 0.4, ww - 0.1, rh - 0.46, { max: 12.5, ls: 1.08 });
        }
        k.foot(s, { y: 5.32, size: 7.5 });
      },
    ],
    stats: [
      async (d) => { // three ripe fruits hang from one bough, a number in each
        const s = k.slide(C.bg), w = 9.2 / 3, D = 1.95, by = 1.08; k.head(s, d.title || '', 0.4, 0.26, 8.2, 0.66, { max: 24, min: 13 }); num(s);
        t.line(s, 0, by, 10, 0, '8D6E4A', 4);
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w, c = x + w / 2, y = by + 0.2 + (i === 1 ? 0.16 : 0);
          t.line(s, c, by, 0, y - by, '8D6E4A', 2);
          t.oval(s, c - D / 2, y, D, D, GOLD);
          k.head(s, v.value, c - D / 2 + 0.12, y + 0.5, D - 0.24, D - 1.0, { max: 30, min: 14, color: C.node, align: 'center', ls: 1 });
          bd(s, v.label, x + 0.1, 3.42, w - 0.2, 0.7, { align: 'center', max: 13 });
        }
        if (d.note) { t.rect(s, 0.4, 4.18, 9.2, 1.02, 'FFFFFF', { r: 0.08, name: 'Note' }); bd(s, d.note, 0.55, 4.22, 8.9, 0.94, { color: C.muted, valign: 'middle', max: 12.5 }); }
      },
      async (d) => { // night: three lines of a register, each number a node fed from a trunk at the left
        const s = k.slide(NIGHT), ye = d.note ? 4.1 : 5.14, y0 = 1.02, rh = (ye - y0) / 3;
        k.head(s, d.title || '', 0.4, 0.2, 8.2, 0.68, { max: 24, min: 13, color: C.light }); num(s, 9.0, GOLD, 0.2);
        t.line(s, 0.55, y0 + 0.2, 0, 2 * rh + 0.2, GOLD, 2);
        for (const [i, v] of d.stats.entries()) {
          const y = y0 + i * rh;
          t.line(s, 0.55, y + rh / 2, 0.35, 0, GOLD, 2);
          node(s, 0.9, y + 0.08, 3.3, rh - 0.16, C.node);
          k.head(s, v.value, 1.0, y + 0.08, 3.1, rh - 0.16, { max: 32, min: 16, color: GOLD, align: 'center', ls: 1 });
          bd(s, v.label, 4.45, y + 0.08, 5.15, rh - 0.16, { color: C.light, valign: 'middle', max: 15 });
        }
        if (d.note) bd(s, d.note, 0.55, 4.2, 9.05, 1.0, { color: MIST, italic: true, max: 12.5 });
        footN(s);
      },
      async (d) => { // the trunk cut through: the lead number in the middle of its rings, the other two beside it
        const s = k.slide(C.bg), [a, ...rest] = d.stats, cx = 2.75, cy = 2.75, R0 = 2.45; let g = '';
        for (let r = R0, i = 0; r > 0.5; r -= 0.2 + (i % 3) * 0.06, i++) g += `<ellipse cx="${cx * 100}" cy="${cy * 100}" rx="${r * 100}" ry="${(r * 0.98) * 100}" fill="none" stroke="#8D6E4A" stroke-width="${i === 0 ? 7 : 1.5}" opacity="${i === 0 ? 1 : 0.55}"/>`;
        t.img(s, await k.svg('rings', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${g}</svg>`, 1000, 563), 0, 0, 10, 5.625);
        t.oval(s, cx - 1.4, cy - 1.0, 2.8, 2.0, C.bg);
        k.head(s, a.value, cx - 1.3, cy - 0.78, 2.6, 0.8, { max: 38, min: 18, color: C.node, align: 'center', ls: 1 });
        bd(s, a.label, cx - 1.15, cy + 0.02, 2.3, 0.72, { align: 'center', max: 12 });
        k.head(s, d.title || '', 5.5, 0.28, 3.5, 0.92, { max: 20, min: 13, valign: 'top' }); num(s, 9.0, C.node, 0.2);
        for (const [i, v] of rest.entries()) {
          const y = 1.3 + i * 1.2;
          t.rect(s, 5.5, y, 0.08, 1.06, i ? SKY : C.node, { name: 'Bar' });
          k.head(s, v.value, 5.72, y, 3.88, 0.56, { max: 28, min: 15, color: i ? SKY : C.node });
          bd(s, v.label, 5.72, y + 0.56, 3.88, 0.5, { max: 12.5 });
        }
        if (d.note) bd(s, d.note, 5.5, 3.72, 4.1, 1.48, { color: C.muted, italic: true, max: 12 });
        k.foot(s, { x: 5.5, y: 5.32, size: 7, w: 4.1 });
      },
    ],
    compare: [
      async (d) => { // one trunk down the middle; each side's twigs grow outward from it, one mirroring the other
        const s = k.slide(C.bg), cx = 5, w = 4.1, y0 = 1.72, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.14, 5.2 - y0); root(s, d.title); num(s);
        t.rect(s, cx - 0.05, 1.0, 0.1, 4.2, '8D6E4A', { name: 'Trunk' });
        [d.left, d.right].forEach((sd, i) => { const x = i ? cx + 0.42 : cx - 0.42 - w, a = i ? 'left' : 'right'; const f = i ? SKY : C.node;
          t.line(s, i ? cx : cx - 0.42, 1.34, 0.42, 0, C.line, 1.5);
          node(s, x, 1.08, w, 0.52, f); hd(s, sd.h, x + 0.12, 1.08, w - 0.24, 0.52, { color: C.light, align: 'center' }); let y = y0;
          sd.items.forEach((it, j) => { t.line(s, i ? cx : cx - 0.35, y + 0.13, 0.35, 0, C.line, 1.25); k.txt(s, it, x, y, w, rr[j], { size: fs, align: a, ls: 1 }); y += rr[j]; }); });
        k.foot(s, { y: 5.32, size: 7.5 });
      },
      async (d) => { // two branches lie one above the other: a light one and a dark one, each with its own twigs
        const s = k.slide(C.bg), H = 2.0; k.head(s, d.title || '', 0.4, 0.26, 8.2, 0.66, { max: 24, min: 13 }); num(s);
        [[d.left, 1.04, 'FFFFFF', C.node, C.ink, C.light], [d.right, 3.14, C.node, GOLD, C.light, C.node]].forEach(([sd, y, f, c, ink, htx]) => {
          t.rect(s, 0.4, y, 9.2, H, f, { r: 0.1, name: 'Branch' });
          node(s, 0.52, y + 0.12, 2.2, H - 0.24, c); hd(s, sd.h, 0.62, y + 0.12, 2.0, H - 0.24, { color: htx, align: 'center', max: 16 });
          const n = sd.items.length, rh = (H - 0.24) / n, { fs } = rowsFit([sd.items], 13, 6.2, F.body, 0.03, H - 0.24), tx = 3.0;
          t.line(s, tx, y + 0.12 + rh / 2, 0, (n - 1) * rh, c, 1.25); t.line(s, 2.72, y + H / 2, tx - 2.72, 0, c, 1.25);
          sd.items.forEach((it, j) => { const yy = y + 0.12 + j * rh; t.line(s, tx, yy + rh / 2, 0.22, 0, c, 1.25); k.txt(s, it, tx + 0.32, yy, 6.15, rh, { size: fs, color: ink, valign: 'middle', ls: 1 }); });
        });
        k.foot(s, { y: 5.32, size: 7.5 });
      },
    ],
    statement: [
      async (d) => { // night: a great bare tree stands at the right, the sentence beside it in gold
        const s = k.slide(NIGHT); let g = '';
        const br = (x, y, a, l, dp) => { const x2 = x + l * Math.cos(a), y2 = y - l * Math.sin(a); g += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#3A5678" stroke-width="${dp * 1.5}" stroke-linecap="round"/>`; if (dp > 1) { br(x2, y2, a + 0.42, l * 0.72, dp - 1); br(x2, y2, a - 0.38, l * 0.76, dp - 1); } };
        br(860, 563, Math.PI / 2, 130, 7);
        t.img(s, await k.svg('bare', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${g}</svg>`, 1000, 563), 0, 0, 10, 5.625);
        k.head(s, d.title || '', 0.4, 0.22, 7.0, 0.66, { max: 22, min: 13, color: C.light }); num(s, 9.0, GOLD, 0.2);
        k.head(s, L.runs(d.text), 0.4, 1.05, 6.5, 2.5, { max: 30, min: 15, color: GOLD });
        if (d.caption) bd(s, d.caption, 0.4, 3.62, 6.3, 1.58, { color: C.light, max: 13 });
        footN(s);
      },
      async (d) => { // a family crest: the sentence in a great oval medallion, title and note as nodes on a branch beside it
        const s = k.slide(C.bg), nx = 6.95, nw = 2.7;
        t.oval(s, 0.35, 0.35, 6.2, 4.72, 'FFFFFF', { line: { color: GOLD, width: 5 } });
        k.head(s, L.runs(d.text), 1.1, 1.0, 4.7, 3.42, { max: 26, min: 14, align: 'center', color: C.node });
        node(s, nx, 0.32, nw, 1.1); k.head(s, d.title || '', nx + 0.12, 0.32, nw - 0.24, 1.1, { max: 17, min: 11.5, color: C.light, align: 'center' });
        t.line(s, 6.55, 2.7, 0.2, 0, C.line, 1.5); t.line(s, 6.75, 0.87, 0, 3.0, C.line, 1.5); t.line(s, 6.75, 0.87, 0.2, 0, C.line, 1.5);
        if (d.caption) { t.line(s, 6.75, 3.3, 0.2, 0, C.line, 1.5); node(s, nx, 1.6, nw, 3.5, 'FFFFFF'); bd(s, d.caption, nx + 0.14, 1.66, nw - 0.28, 3.38, { color: C.muted, valign: 'middle', max: 12.5 }); }
        k.txt(s, String(k.idx), 0.35, 4.8, 0.6, 0.4, { size: 16, bold: true, color: C.node, valign: 'middle' });
        k.foot(s, { y: 5.32, size: 7.5 });
      },
    ],
    timeline: [
      async (d) => { // a trunk at the left; each year is a node on its left, a twig leads to the event at its right
        const s = k.slide(C.bg), y0 = 1.1, rh = (5.2 - y0) / 4, tx = 2.15;
        k.head(s, d.title || '', 0.4, 0.26, 8.2, 0.66, { max: 24, min: 13 }); num(s);
        t.rect(s, tx - 0.05, y0, 0.1, 4.1, '8D6E4A', { name: 'Trunk' });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          node(s, 0.4, y + 0.1, tx - 0.4 - 0.2, rh - 0.26, i % 2 ? SKY : C.node);
          k.head(s, it.year, 0.46, y + 0.1, tx - 0.72, rh - 0.26, { max: 16, min: 10, color: i % 2 ? C.light : GOLD, align: 'center', ls: 1 });
          t.line(s, tx - 0.2, y + rh / 2 - 0.03, 0.55, 0, C.line, 1.5);
          hd(s, it.h, tx + 0.45, y + 0.02, 7.0, 0.36, { color: i % 2 ? SKY : C.node });
          bd(s, it.t, tx + 0.45, y + 0.38, 7.0, rh - 0.42, { max: 12.5, ls: 1.08 });
        }
        k.foot(s, { y: 5.32, size: 7.5 });
      },
      async (d) => { // night: a long bough runs across the page, events grow above and below it by turns
        const s = k.slide(NIGHT), ya = 3.08, w = 4.4;
        k.head(s, d.title || '', 0.4, 0.2, 8.2, 0.66, { max: 24, min: 13, color: C.light }); num(s, 9.0, GOLD, 0.2);
        t.line(s, 0, ya, 10, 0, GOLD, 3);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.4 + i * 2.3, x = 0.4 + Math.floor(i / 2) * 4.8;
          node(s, xn, ya - 0.2, 1.6, 0.4, up ? GOLD : C.light);
          k.head(s, it.year, xn + 0.05, ya - 0.2, 1.5, 0.4, { max: 13, min: 9.5, color: C.node, align: 'center', ls: 1 });
          if (up) { hd(s, it.h, x, 0.94, w, 0.36, { color: GOLD }); bd(s, it.t, x, 1.3, w, ya - 0.3 - 1.3, { color: C.light, max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.28, w, 0.36, { color: GOLD }); bd(s, it.t, x, ya + 0.64, w, 5.22 - ya - 0.64, { color: C.light, max: 12.5 }); }
        }
        footN(s);
      },
      async (d) => { // one branch at the top, each stem longer than the last: later years hang lower
        const s = k.slide(C.bg), w = 9.2 / 4, by = 1.22; root(s, d.title); num(s); t.line(s, 5, 1.0, 0, by - 1.0, C.line, 1.5);
        t.line(s, 0.4 + w / 2, by, 3 * w, 0, C.line, 1.5);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.05, ww = w - 0.1, c = x + ww / 2, y = by + 0.22 + i * 0.3;
          t.line(s, c, by, 0, y - by, C.line, 1.5);
          node(s, x + 0.14, y, ww - 0.28, 0.48, i % 2 ? SKY : C.node);
          k.head(s, it.year, x + 0.18, y, ww - 0.36, 0.48, { max: 15, min: 10, color: i % 2 ? C.light : GOLD, align: 'center', ls: 1 });
          hd(s, it.h, x, y + 0.52, ww, 0.36, { align: 'center', max: 13.5 });
          bd(s, it.t, x, y + 0.9, ww, 5.22 - y - 0.9, { align: 'center', max: 12.5 });
        }
        k.foot(s, { y: 5.32, size: 7.5 });
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Shajara', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.node, lt2: C.bg, accent1: C.node, accent2: '2A6F97', accent3: C.node2, accent4: 'E76F51', accent5: C.muted, accent6: C.line, hlink: '2A6F97', folHlink: C.muted } });
}
module.exports = { id: 128, slug: 'shajara', name: 'Şajara', category: 'academic', photos: true, build, style: { tone: "tuzilma va kelib chiqish: umumiydan xususiyga, har bir tarmoq aniq nomlangan", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["fade", "p14:pan|dir=\"u\"", "morph"], "cover": ["riseWords", "focusIn"], "mark": "popIn", "deco": "peekUp", "sig": {"title": "peekUp", "body": "fadeUp", "item": "riseSettle", "image": "peekUp", "number": "popIn", "order": "reverse", "stagger": 0.16}, "tempo": 1.15, "kenburns": true};
