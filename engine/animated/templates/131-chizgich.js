/**
 * 131 Chizg'ich — everything is MEASURED: a yellow ruler runs along the top and the left edge, ideas sit in
 * columns or rows marked by red dimension lines (↔ with their index), photos carry width/height dimensions.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FAFAF7', ruler: 'F2C94C', rulerEdge: 'C9A227', ink: '1F1F1F', muted: '5E5E5E', dim: 'D62828' };
const F = { head: 'Arial', body: 'Calibri' };
const X = 0.85, W = 8.75, Y = 1.7, Hc = 3.45;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const rulers = (s) => { t.rect(s, 0, 0.12, 10, 0.55, C.ruler, { line: { color: C.rulerEdge, width: 1 }, name: 'Ruler' }); for (let i = 0; i <= 100; i++) { const x = 0.6 + i * 0.09; if (x > 9.9) break; t.line(s, x, 0.12, 0, i % 10 ? (i % 5 ? 0.1 : 0.16) : 0.24, C.ink, 0.75); if (!(i % 10)) k.txt(s, String(i / 10), x - 0.15, 0.38, 0.3, 0.22, { size: 7, align: 'center', color: C.ink }); }
    t.rect(s, 0, 0.67, 0.55, 4.95, C.ruler, { line: { color: C.rulerEdge, width: 1 }, name: 'Ruler' }); for (let i = 0; i <= 50; i++) { const y = 0.8 + i * 0.09; if (y > 5.55) break; t.line(s, 0, y, i % 10 ? (i % 5 ? 0.1 : 0.16) : 0.24, 0, C.ink, 0.75); } };
  const dimH = (s, x, y, w, label) => { t.line(s, x, y, w, 0, C.dim, 1, { beginArrowType: 'triangle', endArrowType: 'triangle' }); t.line(s, x, y - 0.08, 0, 0.16, C.dim, 0.75); t.line(s, x + w, y - 0.08, 0, 0.16, C.dim, 0.75); if (label !== undefined) { t.rect(s, x + w / 2 - 0.2, y - 0.11, 0.4, 0.22, C.bg, { name: 'Label bg' }); k.txt(s, String(label), x + w / 2 - 0.2, y - 0.11, 0.4, 0.22, { size: 9, bold: true, color: C.dim, align: 'center', valign: 'middle' }); } };
  const dimV = (s, x, y, h) => { t.line(s, x, y, 0, h, C.dim, 1, { beginArrowType: 'triangle', endArrowType: 'triangle' }); t.line(s, x - 0.08, y, 0.16, 0, C.dim, 0.75); t.line(s, x - 0.08, y + h, 0.16, 0, C.dim, 0.75); };
  const page = (d) => { const s = k.slide(C.bg); rulers(s); if (d.title) k.head(s, d.title, X, 0.85, 8.0, 0.65, { max: 24, min: 13 }); k.txt(s, `${k.idx}`, 8.9, 0.85, 0.7, 0.65, { size: 18, bold: true, color: C.dim, align: 'right', valign: 'middle' }); k.foot(s, { x: X, y: 5.32, w: W, size: 7.5 }); return s; };
  const cols = (s, n, draw) => { const w = W / n; for (let i = 0; i < n; i++) { const x = X + i * w; dimH(s, x + 0.05, Y, w - 0.1, i + 1); draw(i, x + 0.08, Y + 0.25, w - 0.25, Hc - 0.25); } };
  const rows = (s, n, draw) => { const rh = Hc / n; for (let i = 0; i < n; i++) { const y = Y + i * rh; t.line(s, 0.55, y + rh / 2, 0.22, 0, C.dim, 1.5); k.txt(s, String(i + 1), 0.0, y, 0.55, rh, { size: 10, bold: true, color: C.dim, align: 'center', valign: 'middle' }); draw(i, X, y, W, rh); if (i < n - 1) t.line(s, X, y + rh, W, 0, 'E2DED0', 0.5, { dash: 'dash' }); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); rulers(s); if (d.image) { await k.photo(s, d.image, 6.3, 1.2, 3.0, 3.3); dimH(s, 6.3, 4.75, 3.0, ''); dimV(s, 9.6, 1.2, 3.3); }
      k.txt(s, k.org3, 0.9, 1.0, 5.0, 0.35, { size: 12, bold: true, color: C.dim }); k.head(s, d.title, 0.9, 1.4, 5.1, 2.3, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.9, 3.75, 5.0, 0.7, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.9, 4.5, 5.0, 0.45, { size: 15, bold: true }); k.foot(s, { x: 0.9, y: 5.32, w: 8.6, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, X + 0.25, Y + 0.1, 3.4, 2.95); dimH(s, X + 0.25, Y + 3.25, 3.4, ''); dimV(s, X + 0.05, Y + 0.1, 2.95); k.txt(s, d.text, X + 3.95, Y, W - 3.95, Hc, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); rows(s, d.items.length, (i, x, y, w, h) => k.head(s, d.items[i], x, y, w, h, { max: 17 })); },
    async cards(d) { const s = page(d); cols(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.5, { max: 15 }); k.txt(s, d.items[i].t, x, y + 0.52, w, h - 0.52, { max: 13, color: C.muted }); }); },
    async process(d) { const s = page(d); cols(s, d.steps.length, (i, x, y, w, h) => { k.head(s, d.steps[i].h, x, y, w, 0.5, { max: 15 }); k.txt(s, d.steps[i].t, x, y + 0.52, w, h - 0.52, { max: 13, color: C.muted }); }); },
    async stats(d) { const s = page(d); cols(s, d.stats.length, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, w, 1.1, { max: 48, min: 18, color: C.dim }); k.txt(s, d.stats[i].label, x, y + 1.15, w, h - 1.15 - (d.note ? 0.55 : 0), { max: 13 }); }); if (d.note) k.txt(s, d.note, X, Y + Hc - 0.5, W, 0.5, { max: 9, italic: true, color: C.muted }); },
    async compare(d) { const s = page(d), w = W / 2 - 0.15, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.2, F.body, 0.12, Hc - 0.85);
      [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.3); dimH(s, x, Y, w, i ? 'B' : 'A'); k.head(s, sd.h, x, Y + 0.25, w, 0.5, { max: 16 }); let y = Y + 0.8; sd.items.forEach((it, j) => { k.txt(s, `\u2014 ${it}`, x, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); dimH(s, X + 0.3, Y + 0.05, W - 0.6, ''); k.head(s, L.runs(d.text), X + 0.3, Y + 0.25, W - 0.6, 2.1, { max: 30, min: 15, align: 'center' }); dimH(s, X + 0.3, Y + 2.45, W - 0.6, ''); if (d.caption) k.txt(s, d.caption, X + 0.3, Y + 2.65, W - 0.6, 0.8, { max: 12, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); cols(s, d.items.length, (i, x, y, w, h) => { k.head(s, d.items[i].year, x, y, w, 0.55, { max: 22, min: 11, color: C.dim }); k.head(s, d.items[i].h, x, y + 0.58, w, 0.42, { max: 14 }); k.txt(s, d.items[i].t, x, y + 1.02, w, h - 1.02, { max: 12, color: C.muted }); }); },
    async quote(d) { const s = page({}); dimV(s, X + 0.2, Y - 0.6, 3.2); k.head(s, `\u201C${d.text}\u201D`, X + 0.55, Y - 0.6, W - 0.8, 2.6, { max: 28, min: 14, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, X + 0.55, Y + 2.1, W - 0.8, 0.45, { size: 14, bold: true, color: C.dim }); },
    async sources(d) { const s = page(d); rows(s, d.items.length, (i, x, y, w, h) => k.txt(s, d.items[i], x, y, w, h, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all on the drafting table: a deck's pages must not look alike (L.pages)
  const BP = '12355B', BPL = '2F5D8C', ICE = 'CFE3F5', GRID = 'E8E5D8';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const dimW = (s, x, y, w, label, col = 'FFFFFF', bg = BP) => { t.line(s, x, y, w, 0, col, 1); t.line(s, x, y - 0.08, 0, 0.16, col, 0.75); t.line(s, x + w, y - 0.08, 0, 0.16, col, 0.75); if (label !== undefined && label !== '') { t.rect(s, x + w / 2 - 0.2, y - 0.11, 0.4, 0.22, bg, { name: 'Label bg' }); k.txt(s, String(label), x + w / 2 - 0.2, y - 0.11, 0.4, 0.22, { size: 9, bold: true, color: col, align: 'center', valign: 'middle' }); } };
  const net = async (s, key, col, step, big) => { let g = ''; for (let x = 0; x <= 1000; x += step) g += `<line x1="${x}" y1="0" x2="${x}" y2="563" stroke="#${col}" stroke-width="${x % big ? 0.6 : 1.3}"/>`; for (let y = 0; y <= 563; y += step) g += `<line x1="0" y1="${y}" x2="1000" y2="${y}" stroke="#${col}" stroke-width="${y % big ? 0.6 : 1.3}"/>`; t.img(s, await k.svg(key, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${g}</svg>`, 1000, 563), 0, 0, 10, 5.625); };
  const blue = async (d, o = {}) => { const s = k.slide(BP), tb = o.title || {}; await net(s, 'bpnet', BPL, 25, 100); if (d.title) k.head(s, d.title, tb.x ?? 0.5, tb.y ?? 0.22, tb.w ?? 8.0, tb.h ?? 0.72, { max: tb.max ?? 24, min: 13, color: 'FFFFFF' }); k.txt(s, `${k.idx}`, 8.9, 0.22, 0.7, 0.72, { size: 18, bold: true, color: C.ruler, align: 'right', valign: 'middle' }); k.foot(s, { x: o.fx ?? 0.5, y: 5.32, w: o.fw ?? 9.1, size: 7.5, color: ICE }); return s; };
  const graph = async (d) => { const s = k.slide(C.bg); await net(s, 'gpnet', GRID, 25, 100); rulers(s); if (d.title) k.head(s, d.title, X, 0.76, 8.0, 0.66, { max: 22, min: 13 }); k.txt(s, `${k.idx}`, 8.9, 0.76, 0.7, 0.66, { size: 18, bold: true, color: C.dim, align: 'right', valign: 'middle' }); k.foot(s, { x: X, y: 5.34, w: W, size: 7.5 }); return s; };
  const plain = (d, o = {}) => { const s = k.slide(C.bg), tb = o.title || {}; if (d.title) k.head(s, d.title, tb.x ?? 0.5, tb.y ?? 0.22, tb.w ?? 8.0, tb.h ?? 0.72, { max: 24, min: 13 }); k.txt(s, `${k.idx}`, 8.9, 0.22, 0.7, 0.72, { size: 18, bold: true, color: C.dim, align: 'right', valign: 'middle' }); k.foot(s, { x: 0.5, y: 5.32, w: 9.1, size: 7.5 }); return s; };
  const bigRuler = (s, x, y, w, h, vert) => { t.rect(s, x, y, w, h, C.ruler, { line: { color: C.rulerEdge, width: 1 }, name: 'Ruler' }); if (vert) { const n = Math.floor(h / 0.09); for (let i = 0; i <= n; i++) t.line(s, x, y + i * 0.09, i % 10 ? (i % 5 ? 0.1 : 0.16) : 0.24, 0, C.ink, 0.75); } else { const n = Math.floor(w / 0.09); for (let i = 0; i <= n; i++) t.line(s, x + i * 0.09, y, 0, i % 10 ? (i % 5 ? 0.1 : 0.16) : 0.24, C.ink, 0.75); } };
  const V = {
    image: [
      async (d) => { // a picture measured on the sheet: a dimension along its foot, one at its side, the words under it
        const s = page(d), px = X + 0.05, py = 1.55, pw = 8.3, ph = 1.72;
        await k.photo(s, d.image, px, py, pw, ph);
        dimH(s, px, py + ph + 0.12, pw, ''); dimV(s, px + pw + 0.14, py, ph);
        bd(s, d.text, X, py + ph + 0.24, W, 5.24 - py - ph - 0.24, { max: 13, valign: 'middle', ls: 1.1 });
      },
      async (d) => { // blueprint: the picture printed in the sheet's own blue, with white dimensions
        const s = await blue(d, { title: { w: 4.5, h: 1.1, max: 22 }, fw: 4.6 }), px = 5.3, py = 0.92, pw = 3.9, ph = 4.0;
        await k.photo(s, d.image, px, py, pw, ph, { duo: [BP, 'E8F2FB'] });
        t.rect(s, px, py, pw, ph, null, { line: { color: 'FFFFFF', width: 1 }, name: 'Frame' });
        dimW(s, px, py + ph + 0.16, pw, ''); t.line(s, px + pw + 0.2, py, 0, ph, 'FFFFFF', 1); t.line(s, px + pw + 0.12, py, 0.16, 0, 'FFFFFF', 0.75); t.line(s, px + pw + 0.12, py + ph, 0.16, 0, 'FFFFFF', 0.75);
        bd(s, d.text, 0.5, 1.4, 4.45, 3.78, { max: 13, color: 'FFFFFF' });
      },
      async (d) => { // the picture is cut to a protractor, its scale running round the arc
        const s = page(d), pw = 4.6, ph = 2.3, px = 5.0, py = 2.26, P = 100, cx = pw * P / 2, cy = ph * P; let g = '';
        t.img(s, await L.photo(L.src(d.image), pw, ph, { mask: { path: 'M0,1 A0.5,1 0 0 1 1,1 Z' } }), px, py, pw, ph, { alt: '' });
        for (let a = 0; a <= 180; a += 5) { const c = Math.cos(a * Math.PI / 180), si = Math.sin(a * Math.PI / 180), r1 = cx + 2, r2 = cx + (a % 15 ? 12 : 22); g += `<line x1="${cx + r1 * c + 30}" y1="${cy - r1 * si + 30}" x2="${cx + r2 * c + 30}" y2="${cy - r2 * si + 30}" stroke="#${C.ink}" stroke-width="2"/>`; }
        t.img(s, await k.svg('proto', `<svg xmlns="http://www.w3.org/2000/svg" width="${pw * P + 60}" height="${ph * P + 60}">${g}</svg>`, pw * P + 60, ph * P + 60), px - 0.3, py - 0.3, pw + 0.6, ph + 0.6);
        dimH(s, px, py + ph + 0.2, pw, '');
        bd(s, d.text, X, 1.6, 3.95, 3.62, { max: 13, ls: 1.2 });
      },
      async (d) => { // the picture fills the board under the rulers; a title block in its corner carries the words
        const s = k.slide(C.bg), bx = 4.4, by = 1.0, bw = 5.25, bh = 4.1;
        await k.photo(s, d.image, 0, 0, 10, 5.27);
        rulers(s);
        t.rect(s, 0.55, 5.27, 9.45, 0.355, C.ink, { name: 'Band' });
        t.rect(s, bx, by, bw, bh, 'FFFFFF', { line: { color: C.ink, width: 1.5 }, shadow: 0.3, name: 'Title block' });
        t.line(s, bx, by + 0.84, bw, 0, C.ink, 1); t.line(s, bx + bw - 0.7, by, 0, 0.84, C.ink, 1);
        k.head(s, d.title || '', bx + 0.14, by + 0.04, bw - 0.95, 0.76, { max: 20, min: 13 });
        k.txt(s, `${k.idx}`, bx + bw - 0.7, by, 0.7, 0.84, { size: 18, bold: true, color: C.dim, align: 'center', valign: 'middle' });
        bd(s, d.text, bx + 0.16, by + 0.92, bw - 0.32, bh - 1.0, { max: 13.5 });
        k.foot(s, { x: 0.75, y: 5.34, w: 8.9, size: 7.5, color: 'E8E5D8' });
      },
    ],
    cards: [
      async (d) => { // the page reads against the left ruler: a red mark and number there, the idea in its row
        const s = page(d), n = d.items.length;
        await (async () => { const rh = 3.74 / n, y0 = 1.5; for (const [i, it] of d.items.entries()) { const y = y0 + i * rh;
          t.line(s, 0.55, y + rh / 2, 0.22, 0, C.dim, 1.5); k.txt(s, String(i + 1), 0.0, y, 0.55, rh, { size: 10, bold: true, color: C.dim, align: 'center', valign: 'middle' });
          t.img(s, await k.icon(it.icon, C.dim, 2), X, y + 0.05, 0.34, 0.34);
          hd(s, it.h, X + 0.44, y + 0.02, W - 0.44, 0.38);
          bd(s, it.t, X + 0.44, y + 0.4, W - 0.44, rh - 0.44, { color: C.muted, max: 13, ls: 1.08 });
          if (i < n - 1) t.line(s, X, y + rh, W, 0, 'E2DED0', 0.5, { dash: 'dash' }); } })();
      },
      async (d) => { // on graph paper: frames drawn to size, each with its width dimensioned over it
        const s = await graph(d), n = d.items.length, y0 = 1.62;
        for (const [i, it] of d.items.entries()) {
          const w = n === 4 ? 4.3 : 2.84, h = n === 4 ? 1.62 : 3.48, x = X + (n === 4 ? i % 2 : i) * (w + (n === 4 ? 0.15 : 0.11)), y = y0 + (n === 4 ? Math.floor(i / 2) : 0) * (h + 0.22);
          dimH(s, x, y - 0.1, w, i + 1);
          t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: C.ink, width: 1 }, name: 'Frame' });
          if (n === 4) { t.img(s, await k.icon(it.icon, C.dim, 2), x + 0.1, y + 0.1, 0.3, 0.3); hd(s, it.h, x + 0.46, y + 0.06, w - 0.56, 0.38, { max: 14 }); bd(s, it.t, x + 0.12, y + 0.46, w - 0.24, h - 0.5, { color: C.muted, max: 12.5, ls: 1.08 }); }
          else { t.img(s, await k.icon(it.icon, C.dim, 1.75), x + w / 2 - 0.26, y + 0.2, 0.52, 0.52); hd(s, it.h, x + 0.12, y + 0.8, w - 0.24, 0.55, { align: 'center' }); bd(s, it.t, x + 0.14, y + 1.38, w - 0.28, h - 1.44, { align: 'center', color: C.muted }); }
        }
      },
      async (d) => { // blueprint: columns of different heights, each sign in a dashed construction box
        const s = await blue(d), n = d.items.length, w = 9.1 / n, st = n === 4 ? [0.42, 0, 0.3, 0.1] : [0.34, 0, 0.2];
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * w, ww = w - 0.2, y = 1.14 + st[i];
          dimW(s, x, y, ww, i + 1);
          t.rect(s, x, y + 0.2, 0.56, 0.56, null, { line: { color: C.ruler, width: 1, dashType: 'dash' }, name: 'Box' });
          t.img(s, await k.icon(it.icon, C.ruler, 2), x + 0.11, y + 0.31, 0.34, 0.34);
          hd(s, it.h, x, y + 0.84, ww, 0.55, { color: 'FFFFFF', max: 14, valign: 'top' });
          bd(s, it.t, x, y + 1.4, ww, 5.2 - y - 1.4, { color: ICE, max: 12.5 });
        }
      },
      async (d) => { // a circle drawn with the compass: centre lines cross it, leaders run out to each idea
        const s = plain(d), n = d.items.length, cx = 5, cy = 3.1, R0 = 1.0, w = 3.2, spots = n === 4 ? [[0, 1.08], [1, 1.08], [0, 3.14], [1, 3.14]] : [[0, 1.08], [1, 2.12], [0, 3.14]], hh = 2.04;
        t.oval(s, cx - R0, cy - R0, 2 * R0, 2 * R0, C.ruler, { line: { color: C.rulerEdge, width: 1.5 } });
        t.line(s, cx - R0 - 0.2, cy, 2 * R0 + 0.4, 0, C.dim, 0.75, { dash: 'lgDash' }); t.line(s, cx, cy - R0 - 0.2, 0, 2 * R0 + 0.4, C.dim, 0.75, { dash: 'lgDash' });
        k.txt(s, String(n), cx + 0.08, cy - 0.5, 0.5, 0.46, { size: 22, bold: true, font: F.head, color: C.ink, valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? 9.55 - w : 0.45, a = side ? 'left' : 'right', ax = side ? x - 0.08 : x + w + 0.08, ay = y + 0.2, ex = side ? cx + R0 * 0.7 : cx - R0 * 0.7, ey = cy + (ay < cy ? -R0 * 0.7 : R0 * 0.7);
          if (Math.abs(ay - cy) > 0.2) t.line(s, Math.min(ax, ex), Math.min(ay, ey), Math.abs(ax - ex), Math.abs(ay - ey), C.dim, 1, { flipV: (ax - ex) * (ay - ey) < 0 }); else t.line(s, Math.min(ax, cx + R0), ay, Math.abs(ax - cx - R0), 0, C.dim, 1);
          t.img(s, await k.icon(it.icon, C.dim, 2), side ? x : x + w - 0.34, y + 0.03, 0.34, 0.34);
          hd(s, it.h, side ? x + 0.42 : x, y, w - 0.42, 0.42, { align: a, max: 14 });
          bd(s, it.t, x, y + 0.46, w, hh - 0.5, { align: a, color: C.muted, max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // a stair drawn to scale in red: rise and run marked, each step's words under its tread
        const s = page(d), n = d.steps.length, w = W / n, y0 = 1.72, rise = n === 4 ? 0.38 : 0.52;
        for (const [i, st] of d.steps.entries()) {
          const x = X + i * w, y = y0 + i * rise;
          t.line(s, x, y, w, 0, C.dim, 2.25);
          if (i < n - 1) { t.line(s, x + w, y, 0, rise, C.dim, 2.25); }
          k.txt(s, String(i + 1), x, y - 0.32, 0.5, 0.3, { size: 15, bold: true, font: F.head, color: C.dim, valign: 'bottom' });
          hd(s, st.h, x + 0.04, y + 0.06, w - 0.16, 0.5, { max: 13.5, valign: 'top' });
          bd(s, st.t, x + 0.04, y + 0.58, w - 0.16, 5.24 - y - 0.58, { color: C.muted, max: 12.5 });
        }
      },
      async (d) => { // on graph paper, each line starts further in, the indent dimensioned in red
        const s = await graph(d), n = d.steps.length, y0 = 1.5, rh = 3.74 / n, ind = n === 4 ? 0.7 : 0.95;
        for (const [i, st] of d.steps.entries()) {
          const x = X + i * ind, y = y0 + i * rh, w = 9.6 - x;
          if (i) dimH(s, X, y + 0.04, i * ind, '');
          t.rect(s, x, y, w, rh - 0.08, 'FFFFFF', { line: { color: C.ink, width: 0.75 }, name: 'Row' });
          t.rect(s, x, y, 0.42, rh - 0.08, C.ruler, { line: { color: C.rulerEdge, width: 0.75 }, name: 'Tab' });
          k.txt(s, String(i + 1), x, y, 0.42, rh - 0.08, { size: 16, bold: true, font: F.head, color: C.ink, align: 'center', valign: 'middle' });
          hd(s, st.h, x + 0.52, y + 0.02, w - 0.6, 0.32, { max: 13.5 });
          bd(s, st.t, x + 0.52, y + 0.34, w - 0.6, rh - 0.46, { color: C.muted, max: 12, ls: 1.05 });
        }
      },
      async (d) => { // blueprint: parts laid out in two rows, leader lines joining them in order
        const s = await blue(d), n = d.steps.length, w = 3.6, sx = (9.0 - w) / (n - 1), ys = [1.06, 3.2], hh = 1.96;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * sx, y = ys[i % 2];
          if (i < n - 1) { const lx = x + sx + 0.22; t.line(s, lx, ys[0] + hh, 0, ys[1] - ys[0] - hh, C.ruler, 1.5); }
          t.rect(s, x, y, w, hh, BP, { line: { color: 'FFFFFF', width: 1 }, name: 'Part' });
          t.rect(s, x, y, 0.44, 0.44, C.ruler, { name: 'Tab' }); k.txt(s, String(i + 1), x, y, 0.44, 0.44, { size: 15, bold: true, font: F.head, color: C.ink, align: 'center', valign: 'middle' });
          hd(s, st.h, x + 0.54, y + 0.02, w - 0.62, 0.42, { color: 'FFFFFF', max: 14 });
          bd(s, st.t, x + 0.14, y + 0.5, w - 0.28, hh - 0.56, { color: ICE, max: 12.5 });
        }
      },
      async (d) => { // the ruler laid upright down the middle of the page, numbers on it, steps by turns on its sides
        const s = plain(d), n = d.steps.length, cx = 5, rw = 0.56, y0 = 1.02, rh = (5.1 - y0) / n, w = 4.0;
        bigRuler(s, cx - rw / 2, y0, rw, 4.2, true);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? cx - rw / 2 - 0.16 - w : cx + rw / 2 + 0.16, a = left ? 'right' : 'left', th = Math.min(rh * 1.6, 5.22 - y);
          k.txt(s, String(i + 1), cx - 0.02, y + 0.04, 0.28, 0.36, { size: 15, bold: true, font: F.head, color: C.dim, align: 'center', valign: 'middle' });
          t.line(s, left ? x + w + 0.05 : cx + rw / 2, y + 0.22, 0.11, 0, C.dim, 1.5);
          hd(s, st.h, x, y + 0.02, w, 0.38, { align: a, color: C.dim });
          bd(s, st.t, x, y + 0.42, w, th - 0.44, { align: a, color: C.muted, max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // three lines of a measurement table, each number between its own dimension ticks
        const s = page(d), ye = d.note ? 4.34 : 5.2, y0 = 1.54, rh = (ye - y0) / 3;
        for (const [i, v] of d.stats.entries()) {
          const y = y0 + i * rh;
          t.line(s, X, y + rh - 0.02, W, 0, C.ink, 0.75); dimV(s, X + 0.08, y + 0.1, rh - 0.24);
          k.head(s, v.value, X + 0.3, y, 3.3, rh, { max: 38, min: 18, color: C.dim });
          bd(s, v.label, X + 3.7, y + 0.04, W - 3.7, rh - 0.1, { valign: 'middle', max: 15 });
        }
        if (d.note) bd(s, d.note, X, 4.42, W, 0.84, { italic: true, color: C.muted, max: 12 });
      },
      async (d) => { // blueprint: the lead number drawn huge between dimension lines, two callouts beside it
        const s = await blue(d), [a, ...rest] = d.stats;
        dimW(s, 0.5, 1.2, 5.1, ''); dimW(s, 0.5, 3.0, 5.1, '');
        k.head(s, a.value, 0.5, 1.28, 5.1, 1.64, { max: 66, min: 28, color: C.ruler, align: 'center', ls: 1 });
        bd(s, a.label, 0.5, 3.1, 5.1, 0.82, { color: 'FFFFFF', align: 'center', max: 15 });
        for (const [i, v] of rest.entries()) {
          const y = 1.12 + i * 1.42;
          t.line(s, 5.85, y, 0, 1.24, 'FFFFFF', 1);
          k.head(s, v.value, 6.0, y, 3.6, 0.68, { max: 32, min: 16, color: 'FFFFFF' });
          bd(s, v.label, 6.0, y + 0.68, 3.6, 0.58, { color: ICE, max: 12.5 });
        }
        if (d.note) bd(s, d.note, 0.5, 4.04, 9.1, 1.18, { color: ICE, italic: true, max: 12.5, valign: 'bottom' });
      },
      async (d) => { // three pieces of yellow rule side by side, a number written on each
        const s = plain(d), w = 3.0, h = 1.5, y0 = 1.1;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * (w + 0.05);
          bigRuler(s, x, y0, w, h);
          k.head(s, v.value, x + 0.1, y0 + 0.34, w - 0.2, h - 0.4, { max: 40, min: 18, color: C.ink, align: 'center', ls: 1 });
          t.line(s, x + w / 2, y0 + h, 0, 0.14, C.dim, 1);
          bd(s, v.label, x + 0.1, y0 + h + 0.16, w - 0.2, 0.86, { align: 'center', max: 13.5 });
        }
        if (d.note) { dimH(s, 0.5, 3.74, 9.1, ''); bd(s, d.note, 0.5, 3.86, 9.1, 1.36, { color: C.muted, align: 'center', max: 13 }); }
      },
    ],
    compare: [
      async (d) => { // a red centre line divides the sheet, one side drawn as the mirror image of the other
        const s = page(d), cx = X + W / 2, w = 4.05, top = 2.06, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.14, 5.24 - top);
        t.line(s, cx, 1.5, 0, 3.76, C.dim, 1, { dash: 'lgDash' });
        k.head(s, d.left.h, cx - 0.2 - w, 1.52, w, 0.48, { max: 17, min: 12, align: 'right' }); k.head(s, d.right.h, cx + 0.2, 1.52, w, 0.48, { max: 17, min: 12 });
        const m = Math.max(d.left.items.length, d.right.items.length); let y = top;
        for (let j = 0; j < m; j++) {
          t.line(s, cx - 0.1, y + 0.1, 0.2, 0, C.dim, 1);
          if (d.left.items[j]) k.txt(s, d.left.items[j], cx - 0.2 - w, y, w, rr[j], { size: fs, align: 'right', ls: 1 });
          if (d.right.items[j]) k.txt(s, d.right.items[j], cx + 0.2, y, w, rr[j], { size: fs, ls: 1 });
          y += rr[j];
        }
      },
      async (d) => { // two drawings, one over the other: on graph paper above, on blueprint below
        const s = plain(d), H = 2.04, y1 = 1.0, y2 = 3.14;
        t.rect(s, 0, y2 - 0.03, 10, H + 0.08, BP, { name: 'Blueprint' });
        [[d.left, y1, C.ink, C.dim, C.bg], [d.right, y2, 'FFFFFF', C.ruler, BP]].forEach(([sd, y, ink, c, bg], g) => {
          k.head(s, sd.h, 0.5, y + 0.06, 9, 0.42, { max: 16, min: 12, color: c });
          const n = sd.items.length, w = 9.0 / n;
          sd.items.forEach((it, j) => { const x = 0.5 + j * w; dimW(s, x, y + 0.62, w - 0.14, j + 1, c, bg); bd(s, it, x, y + 0.78, w - 0.16, H - 0.84, { color: ink, max: 12.5, ls: 1.1 }); });
        });
      },
    ],
    statement: [
      async (d) => { // blueprint: the sentence between two long dimensions, the note in the title block at the corner
        const s = await blue(d);
        dimW(s, 0.5, 1.08, 9.0, ''); k.head(s, L.runs(d.text), 0.7, 1.18, 8.6, 2.14, { max: 30, min: 15, color: 'FFFFFF', align: 'center' }); dimW(s, 0.5, 3.42, 9.0, '');
        if (d.caption) { t.rect(s, 2.4, 3.62, 7.1, 1.58, BP, { line: { color: 'FFFFFF', width: 1 }, name: 'Title block' }); bd(s, d.caption, 2.54, 3.68, 6.82, 1.46, { color: ICE, valign: 'middle', max: 12.5 }); }
      },
      async (d) => { // one great yellow rule across the page, the sentence written on it
        const s = plain(d), y = 1.06, h = 2.5;
        t.rect(s, 0, y, 10, h, C.ruler, { line: { color: C.rulerEdge, width: 1 }, name: 'Ruler' });
        for (let i = 0; i <= 111; i++) t.line(s, i * 0.09, y, 0, i % 10 ? (i % 5 ? 0.1 : 0.16) : 0.24, C.ink, 0.75);
        k.head(s, L.runs(d.text), 0.5, y + 0.3, 9.0, h - 0.36, { max: 30, min: 15, color: C.ink });
        if (d.caption) bd(s, d.caption, 0.5, y + h + 0.12, 9.1, 5.24 - y - h - 0.12, { color: C.muted, max: 13 });
      },
    ],
    timeline: [
      async (d) => { // the ruler itself is the time axis: years are read off it, red pointers lead to the events
        const s = plain(d), y0 = 1.06, h = 0.72, w = 9.1 / 4;
        bigRuler(s, 0, y0, 10, h);
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * w;
          k.head(s, it.year, x, y0 + 0.26, w - 0.1, h - 0.28, { max: 18, min: 11, color: C.ink, ls: 1 });
          t.line(s, x + 0.02, y0 + h, 0, 0.3, C.dim, 1.5); t.oval(s, x - 0.04, y0 + h + 0.28, 0.12, 0.12, C.dim);
          hd(s, it.h, x + 0.14, y0 + h + 0.1, w - 0.26, 0.36, { max: 13.5, color: C.dim });
          bd(s, it.t, x + 0.14, y0 + h + 0.48, w - 0.26, 5.24 - y0 - h - 0.48, { color: C.muted, max: 12.5 });
        }
      },
      async (d) => { // blueprint: one centre line across the sheet, events above and below it by turns
        const s = await blue(d), ya = 3.06, w = 4.35;
        t.line(s, 0, ya, 10, 0, C.ruler, 1.5, { dash: 'lgDash' });
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.5 + i * 2.28, x = 0.5 + Math.floor(i / 2) * 4.65;
          t.line(s, xn, up ? ya - 0.36 : ya, 0, 0.36, C.ruler, 1.5);
          k.head(s, it.year, xn + 0.08, up ? ya - 0.36 : ya + 0.04, 2.1, 0.32, { max: 14, min: 10, color: C.ruler });
          if (up) { hd(s, it.h, x, 0.98, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, 1.34, w, ya - 0.44 - 1.34, { color: ICE, max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.42, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, ya + 0.78, w, 5.22 - ya - 0.78, { color: ICE, max: 12.5 }); }
        }
      },
      async (d) => { // the rule stands at the right edge: each year points at it, each event reads in to it
        const s = k.slide(C.bg), y0 = 1.04, rh = (5.24 - y0) / 4, rx = 9.3;
        bigRuler(s, rx, 0, 0.7, 5.625, true);
        k.head(s, d.title || '', 0.5, 0.22, 7.8, 0.72, { max: 24, min: 13 }); k.txt(s, `${k.idx}`, 8.35, 0.22, 0.7, 0.72, { size: 18, bold: true, color: C.dim, align: 'right', valign: 'middle' });
        k.foot(s, { x: 0.5, y: 5.32, w: 8.5, size: 7.5 });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          k.head(s, it.year, 7.0, y, 2.0, rh - 0.1, { max: 18, min: 11, color: C.dim, align: 'right', ls: 1 });
          t.line(s, 9.05, y + (rh - 0.1) / 2, 0.25, 0, C.dim, 1.5);
          hd(s, it.h, 0.5, y + 0.02, 6.4, 0.34);
          bd(s, it.t, 0.5, y + 0.36, 6.4, rh - 0.42, { color: C.muted, max: 12.5, ls: 1.08 });
          if (i < 3) t.line(s, 0.5, y + rh - 0.03, 8.55, 0, 'E2DED0', 0.75);
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: "SlideAI Chizg'ich", colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '3A3A3A', lt2: C.bg, accent1: C.dim, accent2: C.ruler, accent3: '1D3557', accent4: '457B9D', accent5: C.muted, accent6: C.rulerEdge, hlink: C.dim, folHlink: C.muted } });
}
module.exports = { id: 131, slug: 'chizgich', name: "Çizğiç", category: 'academic', photos: true, build, style: { tone: "o'lchanadigan aniqlik: raqamlar, me'yorlar va solishtirma; qisqa va texnik", limits: {}, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "calm"], "transitions": ["wipe:r", "fade", "pull:r"], "cover": ["sweepIn", "typeLetters"], "mark": "appear", "deco": "stretch", "sig": {"title": "stretch", "body": "wipe:r", "item": "wipe:r", "image": "wipe:r", "number": "appear", "order": "seq", "stagger": 0.12}, "tempo": 1.0, "kenburns": false};
