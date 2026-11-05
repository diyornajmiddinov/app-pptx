/**
 * 134 Kvadrant — a consultant's 2×2 MATRIX: two arrowed axes cross in the centre, ideas are placed into the four
 * tinted quadrants (clockwise from top-left); comparisons split along the vertical axis.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '111827', muted: '4B5563', axis: '111827', q: ['DBEAFE', 'DCFCE7', 'FEF9C3', 'FFE4E6'], qa: ['1D4ED8', '15803D', 'A16207', 'BE123C'] };
const F = { head: 'Arial', body: 'Calibri' };
const MX = 0.5, MY = 1.05, MW = 9.0, MH = 4.1, CXa = MX + MW / 2, CYa = MY + MH / 2;
const Q = [[MX, MY], [CXa, MY], [CXa, CYa], [MX, CYa]]; // TL, TR, BR, BL
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const matrix = (s) => { Q.forEach(([x, y], i) => t.rect(s, x + 0.04, y + 0.04, MW / 2 - 0.08, MH / 2 - 0.08, C.q[i], { name: 'Quadrant' })); t.line(s, MX - 0.1, CYa, MW + 0.2, 0, C.axis, 2, { endArrowType: 'triangle' }); t.line(s, CXa, MY + MH + 0.05, 0, -(MH + 0.15), C.axis, 2, { endArrowType: 'triangle' }); };
  const halves = (s) => { t.rect(s, MX + 0.04, MY + 0.04, MW / 2 - 0.08, MH - 0.08, C.q[0], { name: 'Quadrant' }); t.rect(s, CXa + 0.04, MY + 0.04, MW / 2 - 0.08, MH - 0.08, C.q[1], { name: 'Quadrant' }); t.line(s, CXa, MY - 0.05, 0, MH + 0.1, C.axis, 2); }; // no horizontal axis: running text stands here
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.22, 8.0, 0.65, { max: 24, min: 13 }); k.txt(s, `Q${k.idx}`, 8.7, 0.22, 0.9, 0.65, { size: 16, bold: true, color: C.qa[k.idx % 4], align: 'right', valign: 'middle' }); k.foot(s, { y: 5.3, size: 7.5 }); return s; };
  // distribute n items over the 4 quadrants (clockwise), each quadrant may hold several
  const quads = (s, n, draw) => { matrix(s); const groups = [[], [], [], []]; for (let i = 0; i < n; i++) groups[n <= 4 ? i : i % 4].push(i); groups.forEach((g, qi) => { if (!g.length) return; const [x, y] = Q[qi], rh = (MH / 2 - 0.3) / g.length; g.forEach((i, j) => draw(i, qi, x + 0.25, y + 0.15 + j * rh, MW / 2 - 0.5, rh - 0.05)); }); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); const sx = 5.6, sy = 0.6, sw = 3.9, sh = 3.9; [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([a, b], i) => t.rect(s, sx + a * sw / 2 + 0.03, sy + b * sh / 2 + 0.03, sw / 2 - 0.06, sh / 2 - 0.06, C.q[i], { name: 'Quadrant' })); if (d.image) await k.photo(s, d.image, sx + sw / 2 + 0.03, sy + 0.03, sw / 2 - 0.06, sh / 2 - 0.06); t.line(s, sx - 0.1, sy + sh / 2, sw + 0.2, 0, C.axis, 2, { endArrowType: 'triangle' }); t.line(s, sx + sw / 2, sy + sh + 0.1, 0, -(sh + 0.2), C.axis, 2, { endArrowType: 'triangle' });
      k.txt(s, k.org3, 0.5, 0.6, 4.8, 0.35, { size: 12, bold: true, color: C.qa[0] }); k.head(s, d.title, 0.5, 1.0, 4.8, 2.4, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.7, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.7, 0.45, { size: 15, bold: true }); k.foot(s, { y: 5.3, size: 7.5 }); },
    async intro(d) { const s = page(d); halves(s); await k.photo(s, d.image, Q[1][0] + 0.04, Q[1][1] + 0.04, MW / 2 - 0.08, MH - 0.08); k.txt(s, d.text, MX + 0.25, MY + 0.15, MW / 2 - 0.5, MH - 0.3, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); quads(s, d.items.length, (i, qi, x, y, w, h) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 16, color: C.qa[qi] })); },
    async cards(d) { const s = page(d); quads(s, d.items.length, (i, qi, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.45, { max: 15, color: C.qa[qi] }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 13 }); }); },
    async process(d) { const s = page(d); quads(s, d.steps.length, (i, qi, x, y, w, h) => { k.head(s, `${i + 1} \u21BB ${d.steps[i].h}`, x, y, w, 0.45, { max: 15, color: C.qa[qi] }); k.txt(s, d.steps[i].t, x, y + 0.47, w, h - 0.47, { max: 13 }); }); },
    async stats(d) { const s = page(d); quads(s, d.stats.length + (d.note ? 1 : 0), (i, qi, x, y, w, h) => { if (i === d.stats.length) return k.txt(s, d.note, x, y, w, h, { max: 11, italic: true, color: C.muted, valign: 'middle' }); k.head(s, d.stats[i].value, x, y, w, h * 0.55, { max: 46, min: 18, color: C.qa[qi] }); k.txt(s, d.stats[i].label, x, y + h * 0.57, w, h * 0.43, { max: 13 }); }); },
    async compare(d) { const s = page(d); halves(s); const w = MW / 2 - 0.5, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.12, MH - 0.85);
      [d.left, d.right].forEach((sd, i) => { const x = i ? CXa + 0.25 : MX + 0.25; k.head(s, sd.h, x, MY + 0.12, w, 0.5, { max: 17, color: C.qa[i ? 1 : 3] }); let y = MY + 0.7; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); matrix(s); t.rect(s, MX + 1.2, MY + 0.75, MW - 2.4, MH - 1.5, 'FFFFFF', { line: { color: C.axis, width: 1.5 }, name: 'Focus' }); k.head(s, L.runs(d.text), MX + 1.4, MY + 0.8, MW - 2.8, 1.75, { max: 26, min: 13, align: 'center' }); if (d.caption) k.txt(s, d.caption, MX + 1.4, MY + 2.55, MW - 2.8, 0.75, { max: 11, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); quads(s, d.items.length, (i, qi, x, y, w, h) => { k.head(s, `${d.items[i].year} \u2014 ${d.items[i].h}`, x, y, w, 0.45, { max: 15, color: C.qa[qi] }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 13 }); }); },
    async quote(d) { const s = page({}); matrix(s); t.oval(s, CXa - 1.9, CYa - 1.9, 3.8, 3.8, 'FFFFFF', { line: { color: C.axis, width: 1.5 } }); k.head(s, `\u201C${d.text}\u201D`, CXa - 1.5, CYa - 1.2, 3.0, 2.0, { max: 20, min: 10, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author, CXa - 1.5, CYa + 0.85, 3.0, 0.4, { size: 11, bold: true, align: 'center', color: C.qa[3] }); },
    async sources(d) { const s = page(d); quads(s, d.items.length, (i, qi, x, y, w, h) => k.txt(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.qa[qi] } }, { text: d.items[i] }], x, y, w, h, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all as a consultant's charts on the same two axes: a deck's pages must not look alike (L.pages)
  const DARK = '111827', PANEL = '1F2937', FOG = 'D1D5DB', GLOW = ['93C5FD', '86EFAC', 'FDE047', 'FDA4AF'];
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const tri = async (s, x, y, sz, col, deg = 0) => t.img(s, await k.svg(`tri${col}${deg}`, `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><polygon points="30,0 60,60 0,60" fill="#${col}" transform="rotate(${deg} 30 30)"/></svg>`, 60, 60), x - sz / 2, y - sz / 2, sz, sz);
  const axisH = async (s, x, y, w, col = C.axis, lw = 2) => { t.line(s, x, y, w, 0, col, lw); await tri(s, x + w, y, 0.16, col, 90); };
  const axisV = async (s, x, y, h, col = C.axis, lw = 2) => { t.line(s, x, y, 0, h, col, lw); await tri(s, x, y, 0.16, col, 0); };
  const pg = (d, o = {}) => { const night = !!o.night, s = k.slide(night ? DARK : C.bg), tb = o.title || {}; if (d.title) k.head(s, d.title, tb.x ?? 0.4, tb.y ?? 0.22, tb.w ?? 8.0, tb.h ?? 0.65, { max: tb.max ?? 24, min: 13, color: night ? 'FFFFFF' : C.ink }); k.txt(s, `Q${k.idx}`, 8.7, 0.22, 0.9, 0.65, { size: 16, bold: true, color: night ? GLOW[k.idx % 4] : C.qa[k.idx % 4], align: 'right', valign: 'middle' }); k.foot(s, { x: o.fx ?? 0.6, w: o.fw ?? 8.8, y: 5.3, size: 7.5, ...(night ? { color: FOG } : {}) }); return s; };
  const dot = (s, v, x, y, dd, f, ink = 'FFFFFF') => { t.oval(s, x, y, dd, dd, f); k.txt(s, String(v), x, y, dd, dd, { size: Math.round(dd * 34), bold: true, font: F.head, color: ink, align: 'center', valign: 'middle', ls: 1 }); };
  const V = {
    image: [
      async (d) => { // the axes cross off centre: the picture takes the largest quadrant, the title the corner beside it
        const s = k.slide(C.bg), ax = 3.5, ay = 3.1;
        await k.photo(s, d.image, ax, 0, 10 - ax, ay);
        t.rect(s, 0, 0, ax, ay, C.q[0], { name: 'Quadrant' }); t.rect(s, 0, ay, ax, 5.625 - ay, C.q[2], { name: 'Quadrant' });
        k.txt(s, `Q${k.idx}`, 0.4, 0.28, 1.2, 0.4, { size: 16, bold: true, color: C.qa[0] });
        k.head(s, d.title || '', 0.4, 0.74, ax - 0.7, 2.2, { max: 24, min: 13, valign: 'top' });
        await axisV(s, ax, 0.1, 5.42); await axisH(s, 0.1, ay, 9.75);
        bd(s, d.text, ax + 0.2, ay + 0.12, 9.6 - ax - 0.2, 5.26 - ay - 0.12, { max: 13, ls: 1.12, valign: 'middle' });
        k.foot(s, { x: ax + 0.2, y: 5.3, w: 5.9, size: 7 });
      },
      async (d) => { // the picture covers the page, white axes cross it, a report sheet fills one quadrant
        const s = k.slide(DARK), px = 3.6, py = 1.3, ph = 3.8;
        await k.photo(s, d.image, 0, 0, 10, 5.27);
        t.rect(s, 0, 5.27, 10, 0.355, DARK, { name: 'Band' });
        await axisH(s, 0.1, py - 0.05, 9.75, 'FFFFFF'); await axisV(s, px - 0.05, 0.1, 5.1, 'FFFFFF');
        t.rect(s, 0.3, 0.22, 3.0, 0.92, 'FFFFFF', { name: 'Label' });
        k.head(s, d.title || '', 0.42, 0.24, 2.76, 0.88, { max: 16, min: 11 });
        t.rect(s, px, py, 6.0, ph, 'FFFFFF', { shadow: 0.3, name: 'Sheet' });
        k.txt(s, `Q${k.idx}`, px + 4.9, py + 0.1, 0.95, 0.36, { size: 15, bold: true, color: C.qa[0], align: 'right', valign: 'middle' });
        bd(s, d.text, px + 0.22, py + 0.48, 5.56, ph - 0.58, { max: 14, ls: 1.2 });
        k.foot(s, { y: 5.35, size: 7.5, color: FOG });
      },
      async (d) => { // the picture is one great bubble plotted on the matrix, the words beside the chart
        const s = pg(d, { title: { w: 4.5, h: 0.95, max: 22 }, fw: 4.3 }), mx = 5.0, my = 0.95, mw = 4.6, mh = 4.3, cx = mx + mw / 2, cy = my + mh / 2, D = 3.3;
        [[mx, my], [cx, my], [cx, cy], [mx, cy]].forEach(([x, y], i) => t.rect(s, x + 0.03, y + 0.03, mw / 2 - 0.06, mh / 2 - 0.06, C.q[i], { name: 'Quadrant' }));
        t.oval(s, cx - D / 2 - 0.06, cy - D / 2 - 0.06, D + 0.12, D + 0.12, 'FFFFFF');
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: 'circle' }), cx - D / 2, cy - D / 2, D, D, { alt: '' });
        bd(s, d.text, 0.4, 1.28, 4.3, 3.92, { max: 14, ls: 1.2, valign: 'middle' });
      },
      async (d) => { // dark page: the picture itself is cut in four by the axes
        const s = pg(d, { night: true, title: { x: 5.5, w: 3.1, h: 1.05, max: 20 }, fx: 5.5, fw: 4.1 }), D = 4.7, x = 0.4, y = 0.45, g = 0.012, a = 0.5 - g, b = 0.5 + g;
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: { poly: [[0, 0], [a, 0], [a, a], [b, a], [b, 0], [1, 0], [1, a], [b, a], [b, b], [1, b], [1, 1], [b, 1], [b, b], [a, b], [a, 1], [0, 1], [0, b], [a, b], [a, a], [0, a]] } }), x, y, D, D, { alt: '' });
        [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([p, q], i) => t.rect(s, x + p * (D - 0.12), y + q * (D - 0.12), 0.12, 0.12, GLOW[i], { name: 'Corner' }));
        bd(s, d.text, 5.5, 1.34, 4.1, 3.86, { color: 'FFFFFF', max: 13 });
      },
    ],
    cards: [
      async (d) => { // the four tints stand as tall columns, a bold rule and a sign at the head of each
        const s = pg(d), n = d.items.length, w = 9.2 / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.04, ww = w - 0.08, y = 1.0;
          t.rect(s, x, y, ww, 4.2, C.q[i], { name: 'Column' }); t.rect(s, x, y, ww, 0.08, C.qa[i], { name: 'Rule' });
          t.img(s, await k.icon(it.icon, C.qa[i], 1.75), x + 0.15, y + 0.24, 0.52, 0.52);
          hd(s, it.h, x + 0.15, y + 0.84, ww - 0.3, 0.56, { color: C.qa[i], valign: 'top', max: 14 });
          bd(s, it.t, x + 0.15, y + 1.42, ww - 0.3, 2.72, { max: 13 });
        }
      },
      async (d) => { // an executive list: one rising axis at the left, each row with a coloured tab
        const s = pg(d), n = d.items.length, y0 = 1.04, rh = (5.2 - y0) / n; await axisV(s, 0.45, 0.98, 4.22);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          t.line(s, 0.45, y + rh / 2, 0.25, 0, C.axis, 1.5);
          t.oval(s, 0.7, y + rh / 2 - 0.3, 0.6, 0.6, C.qa[i]); t.img(s, await k.icon(it.icon, 'FFFFFF', 2), 0.85, y + rh / 2 - 0.15, 0.3, 0.3);
          hd(s, it.h, 1.5, y + 0.05, 8.1, 0.38, { color: C.qa[i] });
          bd(s, it.t, 1.5, y + 0.43, 8.1, rh - 0.48, { max: 13.5 });
          if (i < n - 1) t.line(s, 1.5, y + rh - 0.01, 8.1, 0, 'E5E7EB', 0.75);
        }
      },
      async (d) => { // dark page: the classic rising diagonal, each idea a step further up and to the right
        const s = pg(d, { night: true, title: { x: 0.62, w: 5.0, h: 0.72 } }), n = d.items.length, w = 8.9 / n, tops = n === 4 ? [2.46, 1.96, 1.46, 0.96] : [2.3, 1.62, 0.96];
        await axisV(s, 0.42, 0.34, 4.8, 'FFFFFF'); await axisH(s, 0.42, 5.14, 9.4, 'FFFFFF');
        for (const [i, it] of d.items.entries()) {
          const x = 0.56 + i * w, y = tops[i], ww = w - 0.08, hh = 5.08 - y;
          t.rect(s, x, y, ww, hh, PANEL, { name: 'Step' }); t.rect(s, x, y, ww, 0.06, GLOW[i], { name: 'Rule' });
          t.img(s, await k.icon(it.icon, GLOW[i], 2), x + 0.12, y + 0.14, 0.34, 0.34);
          hd(s, it.h, x + 0.54, y + 0.1, ww - 0.62, 0.44, { color: GLOW[i], max: 13.5, min: 10 });
          bd(s, it.t, x + 0.12, y + 0.58, ww - 0.24, hh - 0.62, { color: 'FFFFFF', max: 12.5 });
        }
      },
      async (d) => { // the priority idea takes a solid block at the left, the others line up beside it
        const s = k.slide(C.bg), [a, ...rest] = d.items, W0 = 4.0, h = 4.84 / rest.length;
        t.rect(s, 0, 0, W0, 5.625, C.qa[0], { name: 'Block' });
        k.head(s, d.title || '', 0.4, 0.24, W0 - 0.75, 1.3, { max: 22, min: 13, color: 'FFFFFF', valign: 'top' });
        t.img(s, await k.icon(a.icon, 'FFFFFF', 1.75), 0.4, 1.68, 0.58, 0.58);
        hd(s, a.h, 0.4, 2.32, W0 - 0.75, 0.56, { color: 'FFFFFF', max: 18 });
        bd(s, a.t, 0.4, 2.92, W0 - 0.75, 2.3, { color: 'FFFFFF', max: 14 });
        k.txt(s, `Q${k.idx}`, 8.7, 0.04, 0.9, 0.3, { size: 12, bold: true, color: C.qa[0], align: 'right', valign: 'middle' });
        for (const [i, it] of rest.entries()) {
          const y = 0.36 + i * h;
          t.rect(s, W0 + 0.2, y, 5.6, h - 0.08, C.q[i + 1], { name: 'Row' });
          t.img(s, await k.icon(it.icon, C.qa[i + 1], 2), W0 + 0.34, y + 0.1, 0.32, 0.32);
          hd(s, it.h, W0 + 0.74, y + 0.06, 4.95, 0.4, { color: C.qa[i + 1] });
          bd(s, it.t, W0 + 0.34, y + 0.48, 5.34, h - 0.62, { max: 13, ls: 1.08 });
        }
        k.foot(s, { x: W0 + 0.2, y: 5.3, w: 5.6, size: 7 });
      },
    ],
    process: [
      async (d) => { // a value chain: chevrons run across the page, the words stand under each
        const s = pg(d), n = d.steps.length, w = 9.2 / n, y = 1.04, H = 0.92, tip = 34;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, W1 = Math.round((w + 0.16) * 100);
          t.img(s, await k.svg(`chev${n}${i}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W1}" height="92"><polygon points="0,0 ${W1 - tip},0 ${W1},46 ${W1 - tip},92 0,92 ${i ? `${tip},46` : ''}" fill="#${C.qa[i]}"/></svg>`, W1, 92), x, y, w + 0.16, H);
          k.txt(s, String(i + 1), x + (i ? 0.38 : 0.12), y, 0.4, H, { size: 20, bold: true, font: F.head, color: 'FFFFFF', valign: 'middle' });
          hd(s, st.h, x + (i ? 0.72 : 0.46), y + 0.04, w - (i ? 1.02 : 0.76), H - 0.08, { color: 'FFFFFF', max: 13, min: 10 });
          bd(s, st.t, x + 0.06, y + H + 0.14, w - 0.2, 5.2 - y - H - 0.14, { max: 13.5 });
        }
      },
      async (d) => { // the improvement cycle: one ring in the matrix's colours, the steps read clockwise beside it
        const s = pg(d), n = d.steps.length, cx = 2.5, cy = 3.1, D = 3.8, P = 400, rO = 190, rI = 122; let g = '', pts = [];
        const pt = (r, a) => [(200 + r * Math.cos(a)).toFixed(1), (200 + r * Math.sin(a)).toFixed(1)];
        for (let i = 0; i < n; i++) { const a0 = -Math.PI / 2 + i * 2 * Math.PI / n + 0.03, a1 = a0 + 2 * Math.PI / n - 0.06, [x0, y0] = pt(rO, a0), [x1, y1] = pt(rO, a1), [x2, y2] = pt(rI, a1), [x3, y3] = pt(rI, a0); g += `<path d="M${x0},${y0} A${rO},${rO} 0 0 1 ${x1},${y1} L${x2},${y2} A${rI},${rI} 0 0 0 ${x3},${y3} Z" fill="#${C.qa[i]}"/>`; const am = (a0 + a1) / 2; pts.push([cx + (156 / P) * D * Math.cos(am), cy + (156 / P) * D * Math.sin(am)]); }
        t.img(s, await k.svg(`cyc${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${P}">${g}</svg>`, P, P), cx - D / 2, cy - D / 2, D, D);
        k.txt(s, '↻', cx - 0.6, cy - 0.6, 1.2, 1.2, { size: 44, bold: true, font: 'Arial', color: C.muted, align: 'center', valign: 'middle', ls: 1 });
        const rh = 4.2 / n;
        for (const [i, st] of d.steps.entries()) {
          const y = 1.0 + i * rh;
          k.txt(s, String(i + 1), pts[i][0] - 0.25, pts[i][1] - 0.25, 0.5, 0.5, { size: 18, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          dot(s, i + 1, 4.8, y + 0.02, 0.38, C.qa[i]);
          hd(s, st.h, 5.28, y, 4.3, 0.4, { color: C.qa[i] });
          bd(s, st.t, 5.28, y + 0.42, 4.3, rh - 0.48, { max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // a waterfall of tinted bars, each starting further to the right
        const s = pg(d), n = d.steps.length, y0 = 1.0, gap = 0.08, h = (5.2 - y0 - gap * (n - 1)) / n, w = n === 4 ? 6.8 : 7.1, ind = (9.2 - w) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * ind, y = y0 + i * (h + gap);
          t.rect(s, x, y, w, h, C.q[i], { name: 'Bar' }); t.rect(s, x, y, 0.56, h, C.qa[i], { name: 'Tab' });
          k.txt(s, String(i + 1), x, y, 0.56, h, { size: 20, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' });
          hd(s, st.h, x + 0.68, y + 0.04, w - 0.8, 0.34, { color: C.qa[i], max: 14 });
          bd(s, st.t, x + 0.68, y + 0.38, w - 0.8, h - 0.42, { max: 12.5, ls: 1.06 });
        }
      },
      async (d) => { // dark page: the vertical axis is the path, the steps fall on either side of it by turns
        const s = pg(d, { night: true }), n = d.steps.length, cx = 5, y0 = 1.02, rh = (5.14 - y0) / n, w = 4.2; await axisV(s, cx, 0.9, 4.3, 'FFFFFF');
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? cx - 0.34 - w : cx + 0.34, a = left ? 'right' : 'left', hh = Math.min(rh * 1.7, 5.22 - y);
          dot(s, i + 1, cx - 0.2, y, 0.4, GLOW[i], DARK);
          hd(s, st.h, x, y, w, 0.38, { color: GLOW[i], align: a });
          bd(s, st.t, x, y + 0.4, w, hh - 0.42, { color: 'FFFFFF', align: a, max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // three tinted squares in a row, a big figure in each, the note in a grey band
        const s = pg(d), w = 3.0, H = d.note ? 2.9 : 4.1;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * (w + 0.1), y = 1.0;
          t.rect(s, x, y, w, H, C.q[i], { name: 'Tile' }); t.rect(s, x, y, 0.08, H, C.qa[i], { name: 'Rule' });
          k.head(s, v.value, x + 0.22, y + 0.2, w - 0.34, 1.2, { max: 44, min: 20, color: C.qa[i], ls: 1 });
          bd(s, v.label, x + 0.22, y + 1.46, w - 0.34, H - 1.54, { max: 14 });
        }
        if (d.note) { t.rect(s, 0.4, 4.0, 9.2, 1.2, 'F3F4F6', { name: 'Note' }); bd(s, d.note, 0.58, 4.04, 8.84, 1.12, { color: C.muted, italic: true, valign: 'middle', max: 13 }); }
      },
      async (d) => { // dark page: the headline figure alone at the left, two supporting ones stacked at the right
        const s = pg(d, { night: true }), [a, ...rest] = d.stats;
        k.head(s, a.value, 0.4, 1.0, 5.2, 1.7, { max: 72, min: 30, color: GLOW[0], ls: 1 });
        bd(s, a.label, 0.4, 2.76, 4.9, 1.0, { color: 'FFFFFF', max: 16 });
        await axisV(s, 5.7, 1.0, 2.9, FOG, 1.25);
        for (const [i, v] of rest.entries()) {
          const y = 1.04 + i * 1.46;
          k.head(s, v.value, 5.95, y, 3.65, 0.72, { max: 34, min: 16, color: GLOW[i + 1], ls: 1 });
          bd(s, v.label, 5.95, y + 0.72, 3.65, 0.62, { color: 'FFFFFF', max: 12.5 });
        }
        if (d.note) { t.line(s, 0.4, 4.02, 9.2, 0, '4B5563', 0.75); bd(s, d.note, 0.4, 4.08, 9.2, 1.14, { color: FOG, italic: true, max: 13, valign: 'middle' }); }
      },
      async (d) => { // three equal bubbles sit on the horizontal axis, each carrying a figure
        const s = pg(d), w = 9.2 / 3, D = 2.0, ya = 2.1; await axisH(s, 0.2, ya, 9.5);
        for (const [i, v] of d.stats.entries()) {
          const c = 0.4 + i * w + w / 2;
          t.oval(s, c - D / 2, ya - D / 2, D, D, C.qa[i]);
          k.head(s, v.value, c - D / 2 + 0.1, ya - 0.42, D - 0.2, 0.84, { max: 30, min: 14, color: 'FFFFFF', align: 'center', ls: 1 });
          bd(s, v.label, c - w / 2 + 0.14, ya + D / 2 + 0.08, w - 0.28, 0.74, { align: 'center', max: 13 });
        }
        if (d.note) bd(s, d.note, 0.4, 4.0, 9.2, 1.22, { color: C.muted, align: 'center', italic: true, max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the vertical axis holds the sides apart, each row ticked on it; left answers right
        const s = pg(d), cx = 5, w = 4.15, top = 1.72, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.16, 5.2 - top); await axisV(s, cx, 0.92, 4.28);
        t.rect(s, cx - 0.2 - w, 1.04, w, 0.54, C.qa[0], { name: 'Tab' }); t.rect(s, cx + 0.2, 1.04, w, 0.54, C.qa[3], { name: 'Tab' });
        hd(s, d.left.h, cx - 0.1 - w, 1.04, w - 0.2, 0.54, { color: 'FFFFFF', align: 'right', max: 16 }); hd(s, d.right.h, cx + 0.3, 1.04, w - 0.2, 0.54, { color: 'FFFFFF', max: 16 });
        const m = Math.max(d.left.items.length, d.right.items.length); let y = top;
        for (let j = 0; j < m; j++) {
          t.line(s, cx - 0.08, y + 0.1, 0.16, 0, C.axis, 1.5);
          if (d.left.items[j]) k.txt(s, d.left.items[j], cx - 0.2 - w, y, w, rr[j], { size: fs, align: 'right', ls: 1 });
          if (d.right.items[j]) k.txt(s, d.right.items[j], cx + 0.2, y, w, rr[j], { size: fs, ls: 1 });
          y += rr[j];
        }
      },
      async (d) => { // the horizontal axis cuts the page: a pale tinted band above it, a dark one below
        const s = pg(d), ya = 3.06;
        t.rect(s, 0, 0.96, 10, ya - 0.96, C.q[1], { name: 'Band' }); t.rect(s, 0, ya, 10, 5.22 - ya, DARK, { name: 'Band' });
        [[d.left, 0.96, C.qa[1], C.ink], [d.right, ya, GLOW[2], 'FFFFFF']].forEach(([sd, y, c, ink]) => {
          k.head(s, sd.h, 0.4, y + 0.08, 2.1, 1.92, { max: 17, min: 12, color: c });
          const n = sd.items.length, w = 6.9 / n;
          sd.items.forEach((it, j) => { const x = 2.7 + j * w; t.line(s, x - 0.1, y + 0.2, 0, 1.68, c, 1.25); bd(s, it, x, y + 0.14, w - 0.2, 1.84, { color: ink, max: 12.5, valign: 'middle', ls: 1.1 }); });
        });
      },
    ],
    statement: [
      async (d) => { // dark page: the axes cross behind one big sentence, a coloured corner at each end
        const s = pg(d, { night: true });
        await axisH(s, 0.1, 4.02, 9.75, '4B5563', 1.25); await axisV(s, 0.75, 0.96, 4.2, '4B5563', 1.25);
        [[0.55, 3.82, GLOW[0]]].forEach(([x, y, c]) => t.rect(s, x, y, 0.4, 0.4, c, { name: 'Corner' }));
        k.head(s, L.runs(d.text), 1.05, 1.0, 8.5, 2.85, { max: 32, min: 15, color: 'FFFFFF' });
        if (d.caption) bd(s, d.caption, 1.05, 4.12, 8.5, 1.1, { color: FOG, max: 12.5, valign: 'middle' });
      },
      async (d) => { // a solid column holds the title; the sentence takes a tinted quadrant, the note the one below
        const s = k.slide(C.bg), W0 = 3.2;
        t.rect(s, 0, 0, W0, 5.625, C.qa[1], { name: 'Column' });
        k.head(s, d.title || '', 0.4, 0.4, W0 - 0.75, 2.4, { max: 24, min: 13, color: 'FFFFFF', valign: 'top' });
        k.txt(s, `Q${k.idx}`, 0.4, 4.7, 1.2, 0.45, { size: 18, bold: true, color: 'FFFFFF', valign: 'middle' });
        t.rect(s, W0 + 0.1, 0.1, 6.6, 3.3, C.q[1], { name: 'Quadrant' });
        k.head(s, L.runs(d.text), W0 + 0.35, 0.2, 6.1, 3.1, { max: 28, min: 15, color: C.qa[1] });
        t.rect(s, W0 + 0.1, 3.48, 6.6, 1.76, 'F3F4F6', { name: 'Quadrant' });
        if (d.caption) bd(s, d.caption, W0 + 0.35, 3.54, 6.1, 1.64, { color: C.muted, max: 13, valign: 'middle' });
        k.foot(s, { x: W0 + 0.1, y: 5.3, w: 6.6, size: 7 });
      },
    ],
    timeline: [
      async (d) => { // the horizontal axis is time: coloured year tabs stand along it, each event below its tab
        const s = pg(d), w = 9.2 / 4, ya = 1.56; await axisH(s, 0.2, ya, 9.55);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w;
          t.rect(s, x, ya - 0.5, w - 0.12, 0.44, C.qa[i], { name: 'Year' });
          k.head(s, it.year, x + 0.04, ya - 0.5, w - 0.2, 0.44, { max: 16, min: 10, color: 'FFFFFF', align: 'center', ls: 1 });
          t.line(s, x, ya, 0, 3.6, C.q[i], 3);
          hd(s, it.h, x + 0.12, ya + 0.12, w - 0.3, 0.4, { color: C.qa[i], max: 14 });
          bd(s, it.t, x + 0.12, ya + 0.54, w - 0.3, 5.2 - ya - 0.54, { max: 13 });
        }
      },
      async (d) => { // dark page: the axis runs through the middle, events above and below it by turns
        const s = pg(d, { night: true }), ya = 3.06, w = 4.35; await axisH(s, 0.1, ya, 9.75, 'FFFFFF');
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.45 + i * 2.28, x = 0.4 + Math.floor(i / 2) * 4.75;
          t.rect(s, xn, ya - 0.09, 0.18, 0.18, GLOW[i], { name: 'Mark' });
          k.head(s, it.year, xn + 0.24, up ? ya - 0.38 : ya + 0.06, 1.9, 0.32, { max: 14, min: 10, color: GLOW[i] });
          if (up) { hd(s, it.h, x, 0.96, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, 1.32, w, ya - 0.44 - 1.32, { color: FOG, max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.42, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, ya + 0.78, w, 5.22 - ya - 0.78, { color: FOG, max: 12.5 }); }
        }
      },
      async (d) => { // a table of periods: tinted rows, a solid year cell at each row's head
        const s = pg(d), y0 = 1.0, gap = 0.08, h = (5.2 - y0 - 3 * gap) / 4;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * (h + gap);
          t.rect(s, 0.4, y, 9.2, h, C.q[i], { name: 'Row' }); t.rect(s, 0.4, y, 1.75, h, C.qa[i], { name: 'Year' });
          k.head(s, it.year, 0.46, y, 1.63, h, { max: 17, min: 11, color: 'FFFFFF', align: 'center', ls: 1 });
          hd(s, it.h, 2.3, y + 0.05, 7.2, 0.34, { color: C.qa[i] });
          bd(s, it.t, 2.3, y + 0.4, 7.2, h - 0.44, { max: 13, ls: 1.08 });
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Kvadrant', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '1F2937', lt2: 'F3F4F6', accent1: C.qa[0], accent2: C.qa[1], accent3: C.qa[2], accent4: C.qa[3], accent5: C.muted, accent6: 'D1D5DB', hlink: C.qa[0], folHlink: C.muted } });
}
module.exports = { id: 134, slug: 'kvadrant', name: 'Kvadrant', category: 'business', photos: true, build, style: { tone: "konsalting tahlili: toifalash, ustuvorlik va xulosa; aniq va qisqa", limits: {}, prefer: 'data' } };
