/**
 * 129 Lupa — focus + context: one idea is shown ENLARGED inside a magnifying glass (lens with rim and handle),
 * all the others stay small in a side list. Optical bronze rim, pale lens tint, plenty of white.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '1A1A1A', muted: '6B6B6B', rim: 'A0703A', lens: 'EAF4FB', handle: '2E2E2E', accent: '0E7490' };
const F = { head: 'Arial', body: 'Calibri' };
const LX = 0.5, LY = 0.85, LD = 3.95;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const lens = (s, x = LX, y = LY, d = LD) => { t.rect(s, x + d * 0.83, y + d * 0.83, 0.32, 1.25, C.handle, { r: 0.12, rotate: -45, name: 'Handle' }); t.oval(s, x, y, d, d, C.lens, { line: { color: C.rim, width: 9 } }); t.oval(s, x + d * 0.18, y + d * 0.12, d * 0.22, d * 0.1, 'FFFFFF', { t: 30, rotate: -30 }); };
  const inLens = (x = LX, y = LY, d = LD) => ({ x: x + d * 0.16, y: y + d * 0.2, w: d * 0.68, h: d * 0.6 });
  const page = (d) => { const s = k.slide(C.bg); lens(s); if (d.title) k.head(s, d.title, 4.9, 0.3, 4.6, 0.75, { max: 24, min: 13 }); k.txt(s, `\u00D7${k.idx}`, 0.4, 0.25, 1.2, 0.5, { size: 16, bold: true, color: C.rim }); k.foot(s, { x: 4.9, w: 4.6, y: 5.3, size: 7.5 }); return s; };
  // the rest of the items in the side list (small)
  const side = (s, list) => { const n = list.length; if (!n) return; const rh = 3.95 / n; list.forEach(([hd, tx], i) => { const y = 1.15 + i * rh; k.txt(s, [{ text: hd, options: { bold: true, color: C.accent } }, { text: tx ? '  ' + tx : '' }], 4.9, y, 4.6, rh - 0.05, { max: 13, min: 9, valign: 'middle' }); if (i < n - 1) t.line(s, 4.9, y + rh, 4.6, 0, 'E5E5E5', 0.5); }); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); if (d.image) { await k.photo(s, d.image, 5.35, 0.65, 3.6, 3.6, { mask: 'circle' }); } lens(s, 5.25, 0.55, 3.8); if (d.image) await k.photo(s, d.image, 5.35, 0.65, 3.6, 3.6, { mask: 'circle' }); t.oval(s, 5.25, 0.55, 3.8, 3.8, null, { line: { color: C.rim, width: 9 } });
      k.txt(s, k.org3, 0.5, 0.6, 4.4, 0.35, { size: 12, bold: true, color: C.rim }); k.head(s, d.title, 0.5, 1.0, 4.5, 2.4, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.4, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.4, 0.45, { size: 15, bold: true, color: C.accent }); k.foot(s, { y: 5.3, size: 7.5, w: 4.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, LX + 0.1, LY + 0.1, LD - 0.2, LD - 0.2, { mask: 'circle' }); t.oval(s, LX, LY, LD, LD, null, { line: { color: C.rim, width: 9 } }); k.txt(s, d.text, 4.9, 1.15, 4.6, 3.95, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d), b = inLens(); k.head(s, String(d.items.length), b.x, b.y, b.w, b.h * 0.6, { max: 90, min: 30, color: C.rim, align: 'center' }); k.txt(s, d.items[0], b.x, b.y + b.h * 0.62, b.w, b.h * 0.38, { max: 15, bold: true, align: 'center' }); side(s, d.items.map((it, i) => [`${i + 1}.`, it])); },
    async cards(d) { const s = page(d), b = inLens(), f = d.items[0]; k.head(s, f.h, b.x, b.y, b.w, 0.6, { max: 20, align: 'center', color: C.accent }); k.txt(s, f.t, b.x, b.y + 0.65, b.w, b.h - 0.65, { max: 16, min: 10, align: 'center' }); side(s, d.items.slice(1).map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d), b = inLens(), f = d.steps[0]; k.head(s, `1. ${f.h}`, b.x, b.y, b.w, 0.6, { max: 20, align: 'center', color: C.accent }); k.txt(s, f.t, b.x, b.y + 0.65, b.w, b.h - 0.65, { max: 16, min: 10, align: 'center' }); side(s, d.steps.slice(1).map((st, i) => [`${i + 2}. ${st.h}`, st.t])); },
    async stats(d) { const s = page(d), b = inLens(), f = d.stats[0]; k.head(s, f.value, b.x, b.y, b.w, b.h * 0.55, { max: 72, min: 24, align: 'center', color: C.rim }); k.txt(s, f.label, b.x, b.y + b.h * 0.58, b.w, b.h * 0.42, { max: 14, align: 'center' }); side(s, [...d.stats.slice(1).map((v) => [v.value, v.label]), ...(d.note ? [['\u2020', d.note]] : [])]); },
    async compare(d) { const s = page(d), b = inLens(), { rows: rr, fs } = rowsFit([d.left.items], 14, b.w, F.body, 0.08, b.h - 0.5), { rows: r2, fs: f2 } = rowsFit([d.right.items], 13, 4.6, F.body, 0.1, 3.4);
      k.head(s, d.left.h, b.x, b.y, b.w, 0.45, { max: 17, align: 'center', color: C.accent }); let y = b.y + 0.5; d.left.items.forEach((it, j) => { k.txt(s, it, b.x, y, b.w, rr[j], { size: fs, align: 'center' }); y += rr[j]; });
      k.head(s, d.right.h, 4.9, 1.15, 4.6, 0.45, { max: 16, color: C.rim }); y = 1.65; d.right.items.forEach((it, j) => { k.txt(s, `\u2022 ${it}`, 4.9, y, 4.6, r2[j], { size: f2 }); y += r2[j]; }); },
    async statement(d) { const s = page(d), b = inLens(); k.head(s, L.runs(d.text), b.x, b.y, b.w, b.h, { max: 26, min: 12, align: 'center' }); if (d.caption) k.txt(s, d.caption, 4.9, 1.15, 4.6, 3.95, { max: 14, color: C.muted, valign: 'middle' }); },
    async timeline(d) { const s = page(d), b = inLens(), f = d.items[0]; k.head(s, f.year, b.x, b.y, b.w, 0.8, { max: 40, min: 16, align: 'center', color: C.rim }); k.head(s, f.h, b.x, b.y + 0.82, b.w, 0.45, { max: 16, align: 'center' }); k.txt(s, f.t, b.x, b.y + 1.3, b.w, b.h - 1.3, { max: 13, align: 'center' }); side(s, d.items.slice(1).map((it) => [`${it.year} \u2022 ${it.h}`, it.t])); },
    async quote(d) { const s = page({}), b = inLens(); k.head(s, `\u201C${d.text}\u201D`, b.x, b.y, b.w, b.h, { max: 22, min: 11, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 4.9, 2.6, 4.6, 0.6, { size: 16, bold: true, color: C.accent, valign: 'middle' }); },
    async sources(d) { const s = page(d), b = inLens(); k.head(s, String(d.items.length), b.x, b.y, b.w, b.h, { max: 90, min: 30, align: 'center', color: C.rim }); side(s, d.items.map((it, i) => [`[${i + 1}]`, it])); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all under the glass: a deck's pages must not look alike (L.pages)
  const NIGHT = '10161C', FOG = 'C5CDD4', GILT = 'E2B26F', TEAL = '67C8DC', PANEL = '1C252E', HAIR = 'E5E5E5';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const glass = (s, x, y, dd, o = {}) => { if (o.handle !== false) t.rect(s, x + dd * 0.83, y + dd * 0.83, dd * 0.08, dd * 0.32, o.hc ?? C.handle, { r: dd * 0.03, rotate: -45, name: 'Handle' }); t.oval(s, x, y, dd, dd, o.fill === undefined ? C.lens : o.fill, { line: { color: o.rim ?? C.rim, width: o.w ?? Math.max(2.5, dd * 2.2) } }); };
  const ticks = (s, x, y, w, n, o = {}) => { t.line(s, x, y, w, 0, o.color ?? C.rim, o.lw ?? 1.5); for (let i = 0; i <= n; i++) { const big = i % 5 === 0; t.line(s, x + i * w / n, y, 0, big ? 0.14 : 0.07, o.color ?? C.rim, 0.75); } };
  const ticksV = (s, x, y, h, n, o = {}) => { t.line(s, x, y, 0, h, o.color ?? C.rim, o.lw ?? 1.5); for (let i = 0; i <= n; i++) { const big = i % 5 === 0; t.line(s, x, y + i * h / n, big ? 0.14 : 0.07, 0, o.color ?? C.rim, 0.75); } };
  const pg = (d, o = {}) => { const s = k.slide(o.night ? NIGHT : C.bg), tb = o.title || {}; if (d.title) k.head(s, d.title, tb.x ?? 0.5, tb.y ?? 0.28, tb.w ?? 8.1, tb.h ?? 0.68, { max: tb.max ?? 24, min: 13, color: o.night ? 'FFFFFF' : C.ink }); k.txt(s, `×${k.idx}`, 8.6, 0.28, 0.95, 0.68, { size: 16, bold: true, color: o.night ? GILT : C.rim, align: 'right', valign: 'middle' }); k.foot(s, { x: o.fx ?? 0.5, y: 5.3, w: o.fw ?? 9.0, size: 7.5, ...(o.night ? { color: FOG } : {}) }); return s; };
  const thr = (s, x1, y1, x2, y2) => t.line(s, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1), C.accent, 1, { flipV: (x2 - x1) * (y2 - y1) < 0 });
  const V = {
    image: [
      async (d) => { // the page's picture lies in grey; under the glass it comes alive in colour
        const s = k.slide(C.bg), W0 = 5.7, dd = 3.0, x = 1.1, y = 0.9;
        await k.photo(s, d.image, 0, 0, W0, 5.625, { gray: true });
        t.rect(s, x + dd * 0.83, y + dd * 0.83, dd * 0.08, dd * 0.32, C.handle, { r: 0.1, rotate: -45, name: 'Handle' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        t.oval(s, x, y, dd, dd, null, { line: { color: C.rim, width: 8 } });
        k.txt(s, `×${k.idx}`, W0 + 0.3, 0.3, 1.2, 0.4, { size: 16, bold: true, color: C.rim });
        k.head(s, d.title || '', W0 + 0.3, 0.72, 3.65, 1.1, { max: 22, min: 13, valign: 'top' });
        t.line(s, W0 + 0.3, 1.86, 3.65, 0, C.rim, 1.25);
        bd(s, d.text, W0 + 0.3, 1.94, 3.65, 3.28, { max: 12.5 });
        k.foot(s, { x: W0 + 0.3, y: 5.3, w: 3.65, size: 6.5 });
      },
      async (d) => { // a wide view, and one spot of it blown up in a big round inset
        const s = pg(d, { title: { w: 7.8 } }), by = 1.02, bh = 2.08, dd = 2.5, ix = 6.95, iy = 0.86;
        await k.photo(s, d.image, 0.5, by, 6.6, bh, { gray: true });
        const mx = 3.9, my = by + 0.5, m = 0.8; t.oval(s, mx, my, m, m, null, { line: { color: C.accent, width: 2 } });
        thr(s, mx + m * 0.8, my + 0.05, ix + 0.3, iy + 0.3); thr(s, mx + m * 0.8, my + m - 0.05, ix + 0.3, iy + dd - 0.3);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), ix, iy, dd, dd, { alt: '' });
        t.oval(s, ix, iy, dd, dd, null, { line: { color: C.rim, width: 6 } });
        bd(s, d.text, 0.5, 3.42, 9.05, 1.8, { max: 13, ls: 1.18, valign: 'middle' });
      },
      async (d) => { // night: the view down a microscope, a bright disc with a scale in the dark
        const s = pg(d, { night: true, title: { w: 4.5, h: 1.05, max: 22 }, fw: 4.6 }), dd = 4.85, x = 5.0, y = 0.4, cy = y + dd / 2, cx = x + dd / 2;
        t.oval(s, x - 0.14, y - 0.14, dd + 0.28, dd + 0.28, null, { line: { color: C.rim, width: 3 } });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        t.line(s, cx, y, 0, dd, 'FFFFFF', 0.75); ticks(s, x + 0.2, cy, dd - 0.4, 20, { color: 'FFFFFF', lw: 0.75 });
        bd(s, d.text, 0.5, 1.42, 4.2, 3.74, { color: 'FFFFFF', max: 13 });
      },
      async (d) => { // the picture fills the sheet, a white card of notes lies on it, a lens at its corner
        const s = k.slide(NIGHT), px = 4.55, pw = 5.05;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, px, 0.32, pw, 4.98, 'FFFFFF', { shadow: 0.35, name: 'Card' });
        t.rect(s, 0, 5.3, 10, 0.325, NIGHT, { name: 'Band' });
        glass(s, px - 0.72, 0.5, 1.2, { fill: C.lens });
        k.head(s, d.title || '', px + 0.62, 0.42, pw - 1.5, 1.04, { max: 20, min: 13 });
        k.txt(s, `×${k.idx}`, px + pw - 0.92, 0.42, 0.8, 0.5, { size: 14, bold: true, color: C.rim, align: 'right', valign: 'middle' });
        t.line(s, px + 0.62, 1.5, pw - 0.82, 0, C.rim, 1.25);
        bd(s, d.text, px + 0.62, 1.58, pw - 0.82, 3.62, { max: 13.5 });
        k.foot(s, { x: 0.3, y: 5.36, w: 9.4, size: 7, color: FOG });
      },
    ],
    cards: [
      async (d) => { // a row of small glasses, each with the sign of its idea enlarged inside
        const s = pg(d), n = d.items.length, w = 9.1 / n, dd = n === 4 ? 1.1 : 1.3, drp = n === 4 ? [0.22, 0, 0.22, 0] : [0.2, 0, 0.2];
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * w, c = x + w / 2 - 0.05, y = 1.08 + drp[i], ty = y + dd + 0.36;
          glass(s, c - dd / 2, y, dd);
          t.img(s, await k.icon(it.icon, C.accent, 1.75), c - dd * 0.26, y + dd * 0.24, dd * 0.52, dd * 0.52);
          hd(s, it.h, x + 0.06, ty, w - 0.22, 0.55, { align: 'center', valign: 'top', max: 14, color: C.accent });
          bd(s, it.t, x + 0.06, ty + 0.56, w - 0.22, 5.22 - ty - 0.56, { align: 'center', max: 12.5 });
        }
      },
      async (d) => { // the reader's ruler runs down the margin, each idea a line read against it
        const s = pg(d), n = d.items.length, y0 = 1.12, rh = (5.2 - y0) / n;
        ticksV(s, 0.55, y0, 5.2 - y0, 40);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          if (i) t.line(s, 0.95, y, 8.6, 0, HAIR, 0.75);
          glass(s, 1.0, y + rh / 2 - 0.3, 0.6, { handle: false, w: 2.25, fill: 'FFFFFF' });
          t.img(s, await k.icon(it.icon, C.accent, 2), 1.15, y + rh / 2 - 0.15, 0.3, 0.3);
          hd(s, it.h, 1.85, y + 0.06, 7.7, 0.38, { color: C.accent });
          bd(s, it.t, 1.85, y + 0.44, 7.7, rh - 0.5, { max: 13 });
        }
      },
      async (d) => { // night: slides on a light table, each lit by a bright disc behind its sign
        const s = pg(d, { night: true }), n = d.items.length;
        for (const [i, it] of d.items.entries()) {
          const w = n === 4 ? 4.46 : 2.92, h = n === 4 ? 1.98 : 4.0, x = 0.5 + (n === 4 ? i % 2 : i) * (w + 0.13), y = 1.1 + (n === 4 ? Math.floor(i / 2) : 0) * (h + 0.1);
          t.rect(s, x, y, w, h, PANEL, { line: { color: '37424D', width: 0.75 }, name: 'Slide' });
          if (n === 4) {
            t.oval(s, x + 0.14, y + 0.14, 0.72, 0.72, C.lens); t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.32, y + 0.32, 0.36, 0.36);
            hd(s, it.h, x + 1.0, y + 0.12, w - 1.14, 0.42, { color: GILT });
            bd(s, it.t, x + 1.0, y + 0.56, w - 1.14, h - 0.62, { color: 'FFFFFF', max: 12.5, ls: 1.08 });
          } else {
            t.oval(s, x + w / 2 - 0.5, y + 0.2, 1.0, 1.0, C.lens); t.img(s, await k.icon(it.icon, C.accent, 1.75), x + w / 2 - 0.25, y + 0.45, 0.5, 0.5);
            hd(s, it.h, x + 0.14, y + 1.3, w - 0.28, 0.55, { color: GILT, align: 'center' });
            bd(s, it.t, x + 0.14, y + 1.88, w - 0.28, h - 1.96, { color: 'FFFFFF', align: 'center', max: 13 });
          }
        }
      },
      async (d) => { // the title itself lies under the great glass in the middle, the ideas round its rim
        const s = k.slide(C.bg), n = d.items.length, dd = 2.75, cx = 5, x0 = cx - dd / 2, y0 = 1.05, w = 3.05;
        glass(s, x0, y0, dd, { w: 7 });
        k.head(s, d.title || '', x0 + 0.3, y0 + 0.5, dd - 0.6, dd - 1.0, { max: 20, min: 12, align: 'center' });
        k.txt(s, `×${k.idx}`, 4.5, 0.42, 1.0, 0.45, { size: 16, bold: true, color: C.rim, align: 'center', valign: 'middle' });
        const spots = n === 4 ? [[0, 0.32], [1, 0.32], [0, 2.84], [1, 2.84]] : [[0, 0.32], [1, 1.6], [0, 2.84]], hh = 2.34;
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? 9.55 - w : 0.45, a = side ? 'left' : 'right';
          t.img(s, await k.icon(it.icon, C.rim, 2), side ? x : x + w - 0.38, y, 0.38, 0.38);
          hd(s, it.h, side ? x + 0.46 : x, y - 0.03, w - 0.46, 0.44, { color: C.accent, align: a, max: 14 });
          bd(s, it.t, x, y + 0.46, w, hh - 0.52, { align: a, max: 12.5 });
        }
        k.foot(s, { x: 0.5, y: 5.3, w: 9.0, size: 7.5, align: 'center' });
      },
    ],
    process: [
      async (d) => { // the zoom turns up: the same ring grows from step to step, on one baseline
        const s = pg(d), n = d.steps.length, w = 9.1 / n, base = 2.62, sizes = n === 4 ? [0.72, 0.98, 1.24, 1.5] : [0.8, 1.15, 1.5];
        t.line(s, 0.45, base + 0.06, 9.1, 0, C.rim, 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.45 + i * w, dd = sizes[i], cxx = x + 0.1;
          t.oval(s, cxx, base - dd, dd, dd, C.lens, { line: { color: C.rim, width: 3 + i } });
          k.txt(s, String(i + 1), cxx, base - dd, dd, dd, { size: 14 + i * 5, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle' });
          hd(s, st.h, x + 0.1, base + 0.14, w - 0.25, 0.54, { valign: 'top', max: 14 });
          bd(s, st.t, x + 0.1, base + 0.7, w - 0.25, 5.22 - base - 0.7, { max: 12.5 });
        }
      },
      async (d) => { // an optical bench stood on end: the ruled rail runs down, a step mounted at each stop
        const s = k.slide(C.bg), n = d.steps.length, y0 = 0.32, rh = (5.2 - y0) / n, rw = 3.3;
        t.rect(s, 0, 0, rw, 5.625, C.lens, { name: 'Panel' });
        k.txt(s, `×${k.idx}`, 0.4, 0.28, 1.2, 0.4, { size: 16, bold: true, color: C.rim });
        k.head(s, d.title || '', 0.4, 0.76, rw - 0.72, 2.3, { max: 24, min: 13, valign: 'top' });
        glass(s, 0.45, 3.5, 1.2, { fill: 'FFFFFF' });
        ticksV(s, rw + 0.28, y0, 5.2 - y0, 40);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, xx = rw + 0.62;
          t.oval(s, rw + 0.08, y + 0.03, 0.4, 0.4, C.rim); k.txt(s, String(i + 1), rw + 0.08, y + 0.03, 0.4, 0.4, { size: 14, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' });
          hd(s, st.h, xx, y, 9.65 - xx, 0.4, { color: C.accent });
          bd(s, st.t, xx, y + 0.42, 9.65 - xx, rh - 0.48, { max: 13 });
        }
        k.foot(s, { x: rw + 0.28, y: 5.3, w: 6.1, size: 7.5 });
      },
      async (d) => { // night: a ray of light passes through a lens at each step, the words on either side of it
        const s = pg(d, { night: true }), n = d.steps.length, ya = 3.06, w = n === 4 ? 4.35 : 4.35, sx = n === 4 ? 2.27 : 3.0;
        t.line(s, 0, ya, 10, 0, GILT, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const xn = 0.55 + i * sx, up = i % 2 === 0, col = up ? TEAL : GILT, x = n === 4 ? 0.5 + Math.floor(i / 2) * 4.7 : (i === 1 ? 2.82 : 0.5 + (i / 2) * 4.7);
          t.oval(s, xn, ya - 0.42, 0.42, 0.84, '2E4A57', { line: { color: TEAL, width: 1.5 } });
          k.txt(s, String(i + 1), xn, ya - 0.42, 0.42, 0.84, { size: 14, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' });
          if (up) { hd(s, st.h, x, 1.0, w, 0.36, { color: col }); bd(s, st.t, x, 1.36, w, ya - 0.5 - 1.36, { color: 'FFFFFF', max: 12.5 }); }
          else { hd(s, st.h, x, ya + 0.48, w, 0.36, { color: col }); bd(s, st.t, x, ya + 0.84, w, 5.22 - ya - 0.84, { color: 'FFFFFF', max: 12.5 }); }
        }
      },
      async (d) => { // the glass walks across the page in steps, reading line after line
        const s = pg(d), n = d.steps.length, y0 = 1.1, rh = (5.2 - y0) / n, ind = n === 4 ? 0.85 : 1.15, dd = 0.56;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * ind, y = y0 + i * rh, xx = x + dd + 0.26, ww = 9.55 - xx;
          glass(s, x, y + 0.04, dd, { w: 2.5 });
          k.txt(s, String(i + 1), x, y + 0.04, dd, dd, { size: 17, bold: true, font: F.head, color: C.accent, align: 'center', valign: 'middle' });
          hd(s, st.h, xx, y, ww, 0.36);
          t.line(s, xx, y + 0.37, ww, 0, HAIR, 0.75);
          bd(s, st.t, xx, y + 0.41, ww, rh - 0.46, { max: 12.5, ls: 1.08 });
        }
      },
    ],
    stats: [
      async (d) => { // three glasses in a row, a number enlarged in each
        const s = pg(d), w = 9.1 / 3, dd = 2.0;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.45 + i * w, xd = x + (w - dd) / 2 - 0.1, y = 1.04;
          glass(s, xd, y, dd);
          k.head(s, v.value, xd + 0.14, y + 0.5, dd - 0.28, dd - 1.0, { max: 32, min: 15, color: i === 1 ? C.rim : C.accent, align: 'center', ls: 1 });
          bd(s, v.label, x + 0.1, 3.42, w - 0.24, 0.72, { align: 'center', max: 13 });
        }
        if (d.note) { t.line(s, 0.5, 4.2, 9.0, 0, HAIR, 0.75); bd(s, d.note, 0.5, 4.26, 9.0, 0.96, { color: C.muted, max: 12.5, align: 'center' }); }
      },
      async (d) => { // night: the lead number under a huge bright glass, the others small in the dark beside it
        const s = pg(d, { night: true }), [a, ...rest] = d.stats, dd = 3.9, x = 0.5, y = 1.12;
        t.oval(s, x, y, dd, dd, C.lens, { line: { color: C.rim, width: 8 } });
        k.head(s, a.value, x + 0.28, y + 0.82, dd - 0.56, 1.2, { max: 56, min: 24, color: C.accent, align: 'center', ls: 1 });
        bd(s, a.label, x + 0.6, y + 2.04, dd - 1.2, 1.1, { align: 'center', max: 14, color: C.ink });
        for (const [i, v] of rest.entries()) {
          const yy = 1.12 + i * 1.28;
          k.head(s, v.value, 4.85, yy, 4.7, 0.66, { max: 32, min: 16, color: i ? TEAL : GILT });
          bd(s, v.label, 4.85, yy + 0.66, 4.7, 0.54, { color: 'FFFFFF', max: 12.5 });
        }
        if (d.note) { t.line(s, 4.85, 3.72, 4.7, 0, '4B5763', 0.75); bd(s, d.note, 4.85, 3.8, 4.7, 1.4, { color: FOG, italic: true, max: 12.5 }); }
      },
      async (d) => { // the numbers read off one long rule, words below the marks
        const s = pg(d), w = 9.0 / 3, ya = 2.3;
        ticks(s, 0.5, ya, 9.0, 60);
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * w;
          t.oval(s, x, ya - 0.08, 0.16, 0.16, C.rim);
          k.head(s, v.value, x, 1.1, w - 0.2, 1.0, { max: 44, min: 18, color: i === 0 ? C.accent : C.ink });
          bd(s, v.label, x, ya + 0.26, w - 0.25, 0.86, { max: 14 });
        }
        if (d.note) { t.rect(s, 0.5, 3.62, 9.0, 1.5, C.lens, { name: 'Note' }); bd(s, d.note, 0.7, 3.68, 8.6, 1.38, { valign: 'middle', max: 14, color: C.ink }); }
      },
    ],
    compare: [
      async (d) => { // two glasses set side by side, a side's name under each, its points read below
        const s = pg(d), dd = 1.5, y0 = 1.02, w = 4.3, top = y0 + dd + 0.3, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.13, 5.2 - top);
        [d.left, d.right].forEach((sd, i) => { const x = i ? 5.25 : 0.45, a = i ? 'left' : 'right', xd = i ? x : x + w - dd, c = i ? C.rim : C.accent;
          t.oval(s, xd, y0, dd, dd, C.lens, { line: { color: c, width: 4 } });
          k.head(s, sd.h, xd + 0.12, y0 + 0.2, dd - 0.24, dd - 0.4, { max: 14, min: 10, color: c, align: 'center', ls: 1 });
          let y = top; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: a, ls: 1 }); y += rr[j]; }); });
        t.line(s, 5, y0 + 0.1, 0, 5.2 - y0 - 0.1, C.rim, 1);
      },
      async (d) => { // two strips under the glass: a pale one and a dark one, one over the other
        const s = pg(d), H = 2.04;
        [[d.left, 1.04, C.lens, C.accent, C.ink], [d.right, 3.14, NIGHT, GILT, 'FFFFFF']].forEach(([sd, y, f, c, ink]) => {
          t.rect(s, 0, y, 10, H, f, { name: 'Strip' });
          k.head(s, sd.h, 0.5, y + 0.05, 9, 0.42, { max: 16, min: 12, color: c });
          const n = sd.items.length, w = 9.0 / n;
          sd.items.forEach((it, j) => { const x = 0.5 + j * w; t.line(s, x, y + 0.54, 0, H - 0.68, c, 1.25); bd(s, it, x + 0.1, y + 0.52, w - 0.22, H - 0.6, { color: ink, max: 12.5, ls: 1.1 }); });
        });
      },
    ],
    statement: [
      async (d) => { // night: all goes dark but one bright disc, and the sentence lies in it
        const s = pg(d, { night: true, title: { w: 3.1, h: 1.4, max: 18 }, fw: 3.4 }), dd = 5.2, x = 3.95, y = 0.22;
        t.oval(s, x, y, dd, dd, C.lens, { line: { color: C.rim, width: 9 } });
        k.head(s, L.runs(d.text), x + 0.55, y + 1.0, dd - 1.1, dd - 2.0, { max: 25, min: 13.5, align: 'center', color: C.ink });
        if (d.caption) bd(s, d.caption, 0.5, 1.8, 3.1, 3.4, { color: FOG, max: 12.5 });
      },
      async (d) => { // no glass at all now: the sentence itself enlarged across the page, a thin rule under it
        const s = pg(d);
        glass(s, 0.5, 1.2, 0.72, { fill: C.lens, w: 3 });
        k.head(s, L.runs(d.text), 1.55, 1.08, 8.0, 2.45, { max: 32, min: 15, color: C.accent });
        ticks(s, 1.55, 3.62, 8.0, 50);
        if (d.caption) bd(s, d.caption, 1.55, 3.86, 8.0, 1.34, { color: C.muted, max: 13 });
      },
    ],
    timeline: [
      async (d) => { // a rule across the page, each year ringed by a lens standing on it
        const s = pg(d), w = 9.1 / 4, dd = 1.18, ya = 1.08 + dd;
        ticks(s, 0.45, ya + 0.03, 9.1, 40);
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + i * w, xd = x + (w - dd) / 2 - 0.06;
          t.oval(s, xd, 1.06, dd, dd, C.lens, { line: { color: C.rim, width: 3 } });
          k.head(s, it.year, xd + 0.06, 1.06, dd - 0.12, dd, { max: 16, min: 9.5, color: C.accent, align: 'center', ls: 1 });
          hd(s, it.h, x + 0.04, ya + 0.22, w - 0.2, 0.38, { align: 'center', max: 13.5 });
          bd(s, it.t, x + 0.04, ya + 0.62, w - 0.2, 5.22 - ya - 0.62, { align: 'center', max: 12.5 });
        }
      },
      async (d) => { // night: the years stand in pale rectangles on a dark band; events read in two tiers
        const s = pg(d, { night: true }), w = 4.45;
        t.rect(s, 0, 2.86, 10, 0.44, PANEL, { name: 'Band' });
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.5 + i * 2.28, x = 0.5 + Math.floor(i / 2) * 4.6, c = up ? GILT : TEAL;
          k.head(s, it.year, xn, 2.86, 2.1, 0.44, { max: 14, min: 10, color: c });
          t.line(s, xn - 0.08, up ? 2.76 : 2.86, 0, up ? 0.54 : 0.54, c, 1.5);
          if (up) { hd(s, it.h, x, 1.02, w, 0.36, { color: c }); bd(s, it.t, x, 1.38, w, 2.78 - 1.38, { color: 'FFFFFF', max: 12.5 }); }
          else { hd(s, it.h, x, 3.38, w, 0.36, { color: c }); bd(s, it.t, x, 3.74, w, 5.22 - 3.74, { color: 'FFFFFF', max: 12.5 }); }
        }
      },
      async (d) => { // the rule stands up the middle: a small glass at each year, events to left and right by turns
        const s = pg(d), cx = 5, y0 = 1.04, rh = 0.98, w = 4.0;
        t.line(s, cx, y0, 0, 4.14, C.rim, 1.5);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? cx - 0.3 - w : cx + 0.3, a = left ? 'right' : 'left', th = Math.min(2 * rh - 0.64, 5.22 - y - 0.6);
          t.oval(s, cx - 0.13, y + 0.03, 0.26, 0.26, C.lens, { line: { color: C.rim, width: 2.5 } });
          k.head(s, it.year, x, y - 0.02, w, 0.32, { max: 14, min: 10, color: C.rim, align: a });
          hd(s, it.h, x, y + 0.3, w, 0.3, { align: a, max: 13 });
          bd(s, it.t, x, y + 0.6, w, th, { align: a, max: 12, ls: 1.08 });
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Lupa', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.handle, lt2: C.lens, accent1: C.accent, accent2: C.rim, accent3: '155E75', accent4: 'CA8A04', accent5: C.muted, accent6: 'D4D4D4', hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 129, slug: 'lupa', name: 'Lupa', category: 'minimalist', photos: true, build, style: { tone: "diqqat markazi: bitta asosiy fikr chuqur, qolganlari qisqa kontekst sifatida", limits: { card_t3: 150, card_t4: 110 }, prefer: null } };
