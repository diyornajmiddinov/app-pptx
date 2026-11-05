/**
 * 137 Prizma — a beam of white light enters a glass PRISM and splits into a spectrum; each coloured ray lands
 * on one idea on the right. Near-black space, glowing rainbow rays, thin white type.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '0B0B12', ink: 'F5F5FA', muted: 'A9A9BC', spec: ['FF3B3B', 'FF9F1C', 'FFE14D', '3DDC84', '2EC4F1', '7B61FF'] };
const F = { head: 'Arial', body: 'Calibri' };
const PCX = 3.05, PCY = 3.05, AX = 5.8; // prism centre, ray landing x
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const prism = async (s, cx = PCX, cy = PCY, sz = 1.6) => { t.line(s, 0, cy + 0.15, cx - sz * 0.25, -0.15, 'FFFFFF', 3, { flipV: true }); t.img(s, await k.svg('pr', `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180"><polygon points="100,6 194,174 6,174" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-width="4"/><polygon points="100,30 170,160 30,160" fill="#9ad" fill-opacity="0.08"/></svg>`, 200, 180), cx - sz / 2, cy - sz * 0.48, sz, sz * 0.9); };
  // spectrum rays from the prism's right face to n anchor points; draw(i, x, y, w, h)
  const rays = async (s, n, draw, y0 = 1.05, y1 = 5.15) => { await prism(s); const rh = (y1 - y0) / n; for (let i = 0; i < n; i++) { const ay = y0 + rh * (i + 0.5), c = C.spec[Math.round(i * 5 / Math.max(1, n - 1))], sx = PCX + 0.35, sy = PCY + 0.05 + (i - (n - 1) / 2) * 0.05; t.line(s, sx, Math.min(sy, ay), AX - sx, Math.abs(ay - sy) || 0.001, c, 2.5, { flipV: ay < sy }); t.oval(s, AX - 0.07, ay - 0.07, 0.14, 0.14, c); draw(i, AX + 0.2, y0 + i * rh, 9.6 - AX - 0.2, rh, c); } };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.25, 5.2, 1.3, { max: 24, min: 13, color: C.ink, valign: 'top' }); k.txt(s, `\u03BB${k.idx}`, 0.4, 4.85, 1.2, 0.4, { size: 13, bold: true, color: C.spec[k.idx % 6] }); k.foot(s, { y: 5.32, size: 7.5, x: 1.3, w: 8.3 }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await prism(s, 6.4, 2.6, 2.2); C.spec.forEach((c, i) => t.line(s, 6.9, 2.55 + (i - 2.5) * 0.04, 3.1, Math.abs((i - 2.5) * 0.45) || 0.001, c, 3, { flipV: i < 3 })); if (d.image) await k.photo(s, d.image, 7.4, 3.75, 2.2, 1.4, { mask: { r: 0.08 } });
      k.txt(s, k.org3, 0.5, 0.55, 5.0, 0.35, { size: 12, bold: true, color: C.spec[4] }); k.head(s, d.title, 0.5, 0.95, 4.9, 2.4, { max: 36, min: 18, color: C.ink, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.5, 3.45, 4.8, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.5, 4.3, 4.8, 0.45, { size: 15, bold: true, color: C.spec[2] }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, 0.4, 1.7, 3.6, 3.0, { mask: { r: 0.08 } }); C.spec.forEach((c, i) => t.rect(s, 4.2, 1.7 + i * 0.5, 0.1, 0.5, c, { name: 'Spectrum' })); k.txt(s, d.text, 4.55, 1.2, 5.05, 3.9, { max: 15, min: 10, color: C.ink, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await rays(s, d.items.length, (i, x, y, w, h, c) => k.head(s, d.items[i], x, y, w, h, { max: 16, color: c })); },
    async cards(d) { const s = page(d); await rays(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 15, color: c }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.ink }); }); },
    async process(d) { const s = page(d); await rays(s, d.steps.length, (i, x, y, w, h, c) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.42, { max: 15, color: c }); k.txt(s, d.steps[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.ink }); }); },
    async stats(d) { const s = page(d); await rays(s, d.stats.length, (i, x, y, w, h, c) => { k.head(s, d.stats[i].value, x, y, 1.6, h, { max: 36, min: 14, color: c }); k.txt(s, d.stats[i].label, x + 1.7, y, w - 1.7, h, { max: 13, color: C.ink, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, 0.4, 4.25, 2.6, 0.6, { max: 9, color: C.muted }); },
    async compare(d) { const s = page(d); await prism(s); const w = 3.75, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.08, 1.45);
      [d.left, d.right].forEach((sd, i) => { const y0 = i ? 3.15 : 1.05, c = C.spec[i ? 4 : 0]; t.line(s, PCX + 0.35, Math.min(PCY, y0 + 0.2), AX - PCX - 0.35, Math.abs(y0 + 0.2 - PCY), c, 2.5, { flipV: y0 + 0.2 < PCY }); k.head(s, sd.h, AX + 0.1, y0, w, 0.4, { max: 15, color: c }); let y = y0 + 0.45; sd.items.forEach((it, j) => { k.txt(s, it, AX + 0.1, y, w, rr[j], { size: fs, color: C.ink }); y += rr[j]; }); }); },
    async statement(d) { const s = page({}); await prism(s, 1.6, 2.9, 1.5); C.spec.forEach((c, i) => t.rect(s, 2.55, 1.2 + i * 0.6, 0.1, 0.6, c, { name: 'Ray' })); k.head(s, L.runs(d.text), 2.8, 1.0, 6.8, 2.5, { max: 30, min: 14, color: C.ink }); if (d.caption) k.txt(s, d.caption, 2.8, 3.6, 6.8, 1.4, { max: 12, color: C.muted }); },
    async timeline(d) { const s = page(d); await rays(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.42, { max: 14, color: c }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.ink }); }); },
    async quote(d) { const s = page({}); await prism(s, 1.6, 2.9, 1.5); k.head(s, `\u201C${d.text}\u201D`, 2.8, 1.1, 6.8, 2.8, { max: 28, min: 14, italic: true, color: C.ink }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 2.8, 4.0, 6.8, 0.45, { size: 14, bold: true, color: C.spec[2] }); },
    async sources(d) { const s = page(d); await rays(s, d.items.length, (i, x, y, w, h, c) => k.txt(s, d.items[i], x, y, w, h, { max: 11, color: C.ink, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all in the same split light: a deck's pages must not look alike (L.pages)
  const DK = C.bg, GLASS = '1C1C2B', MIST = 'C9C9D6', DEEP = ['C81E1E', 'C2570A', '8A6D00', '15803D', '0369A1', '5B3FD6'], LIGHT = 'FFFFFF';
  const sp = (i, n, set = C.spec) => set[Math.round(i * 5 / Math.max(1, n - 1))];
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, color: C.ink, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.ink, ...o });
  const specBar = (s, x, y, w, h, vert) => C.spec.forEach((c, i) => (vert ? t.rect(s, x, y + i * h / 6, w, h / 6, c, { name: 'Spectrum' }) : t.rect(s, x + i * w / 6, y, w / 6, h, c, { name: 'Spectrum' })));
  const ray = (s, x1, y1, x2, y2, c, w = 2.5) => t.line(s, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1) || 0.001, Math.abs(y2 - y1) || 0.001, c, w, { flipV: (x2 - x1) * (y2 - y1) < 0 });
  const tri = async (s, x, y, w, h, stroke = 'FFFFFF', fill = 'ffffff', op = 0.08, sw = 4) => t.img(s, await k.svg(`tri${stroke}${fill}${op}${sw}`, `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180"><polygon points="100,6 194,174 6,174" fill="#${fill}" fill-opacity="${op}" stroke="#${stroke}" stroke-width="${sw}"/></svg>`, 200, 180), x, y, w, h);
  const pg = (d, o = {}) => { // o.day = the light let in: a white page, dark type in deep tints
    const day = !!o.day, s = k.slide(day ? LIGHT : DK), tb = o.title || {};
    if (d.title) k.head(s, d.title, tb.x ?? 0.4, tb.y ?? 0.22, tb.w ?? 8.1, tb.h ?? 0.72, { max: tb.max ?? 24, min: 13, color: day ? DK : C.ink });
    k.txt(s, `λ${k.idx}`, 8.6, 0.22, 1.0, 0.72, { size: 13, bold: true, color: day ? DEEP[k.idx % 6] : C.spec[k.idx % 6], align: 'right', valign: 'middle' });
    k.foot(s, { x: o.fx ?? 0.6, w: o.fw ?? 8.8, y: 5.32, size: 7.5, color: day ? '555566' : C.muted });
    return s;
  };
  const V = {
    image: [
      async (d) => { // the picture is held inside a great prism, a white beam enters and colours leave it
        const s = pg(d, { title: { x: 0.4, w: 4.2, h: 0.98 }, fw: 4.2, fx: 0.4 }), W0 = 4.8, H0 = 4.3, x = 4.85, y = 0.5;
        for (const [i, c] of C.spec.entries()) ray(s, x + W0 * 0.78, y + H0 * 0.6, 10, y + 2.1 + i * 0.5, c, 2);
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: { poly: [[0.5, 0.03], [0.97, 0.97], [0.03, 0.97]] } }), x, y, W0, H0, { alt: '' });
        await tri(s, x, y, W0, H0, 'FFFFFF', 'ffffff', 0, 3);
        bd(s, d.text, 0.4, 1.3, 4.3, 3.92, { max: 13, ls: 1.2 });
      },
      async (d) => { // the picture fills the page in the dark, a glass panel edged with the spectrum lies over it
        const s = k.slide(DK), px = 4.3, pw = 5.3;
        await k.photo(s, d.image, 0, 0, 10, 5.25);
        t.rect(s, 0, 5.25, 10, 0.375, DK, { name: 'Band' });
        t.rect(s, px, 0.32, pw, 4.62, DK, { t: 8, name: 'Glass' }); specBar(s, px - 0.12, 0.32, 0.12, 4.62, true);
        k.head(s, d.title || '', px + 0.24, 0.4, pw - 1.2, 0.98, { max: 20, min: 13, color: C.ink });
        k.txt(s, `λ${k.idx}`, px + pw - 0.9, 0.42, 0.72, 0.4, { size: 13, bold: true, color: C.spec[k.idx % 6], align: 'right', valign: 'middle' });
        bd(s, d.text, px + 0.24, 1.44, pw - 0.48, 3.42, { max: 13.5, color: 'FFFFFF' });
        k.foot(s, { y: 5.35, size: 7.5, color: MIST });
      },
      async (d) => { // the picture split as light is: six upright slats, a colour at the head of each
        const s = pg(d), W0 = 9.2, H0 = 2.3, x = 0.4, y = 1.1, n = 6; let p = '';
        for (let i = 0; i < n; i++) { const x0 = i / n + 0.004, x1 = (i + 1) / n - 0.004; p += `M${x0},0 L${x1},0 L${x1},1 L${x0},1 Z `; t.rect(s, x + i * W0 / n + 0.04, y - 0.1, W0 / n - 0.08, 0.1, C.spec[i], { name: 'Cap' }); }
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: { path: p } }), x, y, W0, H0, { alt: '' });
        bd(s, d.text, 0.4, y + H0 + 0.1, 9.2, 5.28 - y - H0 - 0.1, { max: 13, valign: 'middle', ls: 1.08 });
      },
      async (d) => { // the light let in: a white page, a round picture in a ring of six colours
        const s = pg(d, { day: true, title: { x: 5.2, w: 3.4, h: 1.0, max: 20 }, fx: 5.2, fw: 4.4 }), D = 4.3, x = 0.45, y = 0.6, P = 400, cc = 200, r0 = 198; let g = '';
        C.spec.forEach((c, i) => { const a0 = i * Math.PI / 3 - Math.PI / 2, a1 = a0 + Math.PI / 3; g += `<path d="M${cc},${cc} L${cc + r0 * Math.cos(a0)},${cc + r0 * Math.sin(a0)} A${r0},${r0} 0 0 1 ${cc + r0 * Math.cos(a1)},${cc + r0 * Math.sin(a1)} Z" fill="#${c}"/>`; });
        t.img(s, await k.svg('wheel', `<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${P}">${g}</svg>`, P, P), x, y, D, D);
        const m = 0.2; t.img(s, await L.photo(L.src(d.image), D - 2 * m, D - 2 * m, { mask: 'circle' }), x + m, y + m, D - 2 * m, D - 2 * m, { alt: '' });
        bd(s, d.text, 5.2, 1.3, 4.4, 3.92, { color: DK, max: 13.5, ls: 1.2 });
      },
    ],
    cards: [
      async (d) => { // the prism hangs at the top, its rays fall in a fan to the head of each column
        const s = pg(d, { title: { w: 3.5, h: 1.0, max: 20 } }), n = d.items.length, w = 9.2 / n, cx = 5.6, py = 0.2, ph = 0.62, top = 1.46;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.05, ww = w - 0.1, c = sp(i, n);
          ray(s, cx, py + ph, x + ww / 2, top, c, 2.5);
          t.rect(s, x, top, ww, 5.22 - top, GLASS, { name: 'Glass' }); t.rect(s, x, top, ww, 0.05, c, { name: 'Edge' });
          t.img(s, await k.icon(it.icon, c, 2), x + ww / 2 - 0.19, top + 0.14, 0.38, 0.38);
          hd(s, it.h, x + 0.1, top + 0.56, ww - 0.2, 0.54, { align: 'center', color: c, max: 14 });
          bd(s, it.t, x + 0.1, top + 1.12, ww - 0.2, 5.18 - top - 1.12, { align: 'center', max: 12.5 });
        }
        await tri(s, cx - 0.36, py, 0.72, ph);
      },
      async (d) => { // solid tiles of pure colour, dark words on them
        const s = pg(d), n = d.items.length, cols = [C.spec[0], C.spec[2], C.spec[3], C.spec[4]];
        for (const [i, it] of d.items.entries()) {
          const w = n === 4 ? 4.54 : 2.98, h = n === 4 ? 2.02 : 4.12, x = 0.4 + (n === 4 ? i % 2 : i) * (w + 0.12), y = 1.06 + (n === 4 ? Math.floor(i / 2) : 0) * (h + 0.08);
          t.rect(s, x, y, w, h, cols[i], { name: 'Tile' });
          if (n === 4) { t.img(s, await k.icon(it.icon, DK, 2), x + 0.16, y + 0.14, 0.36, 0.36); hd(s, it.h, x + 0.62, y + 0.1, w - 0.74, 0.44, { color: DK, max: 14.5 }); bd(s, it.t, x + 0.16, y + 0.6, w - 0.32, h - 0.68, { color: DK, max: 13 }); }
          else { t.img(s, await k.icon(it.icon, DK, 1.75), x + 0.2, y + 0.2, 0.6, 0.6); hd(s, it.h, x + 0.2, y + 0.9, w - 0.4, 0.56, { color: DK }); bd(s, it.t, x + 0.2, y + 1.5, w - 0.4, h - 1.6, { color: DK, max: 13.5 }); }
        }
      },
      async (d) => { // the light let in: a rainbow stands over a white page, each idea under its own part of the bow
        const s = pg(d, { day: true, title: { y: 0.14, w: 8.1, h: 0.62 } }), n = d.items.length, w = 9.2 / n; let g = '';
        C.spec.forEach((c, i) => { g += `<path d="M${-40},150 Q500,${-110 + i * 16} 1040,150" fill="none" stroke="#${c}" stroke-width="9"/>`; });
        t.img(s, await k.svg('bow', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="150">${g}</svg>`, 1000, 150), 0, 0.72, 10, 1.5);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, c = sp(i, n, DEEP), y = 2.06;
          t.img(s, await k.icon(it.icon, c, 2), x + w / 2 - 0.2, y - 0.1, 0.4, 0.4);
          hd(s, it.h, x + 0.06, y + 0.34, w - 0.14, 0.54, { align: 'center', color: c, max: 14 });
          bd(s, it.t, x + 0.06, y + 0.9, w - 0.14, 5.24 - y - 0.9, { align: 'center', color: DK, max: 13 });
        }
      },
      async (d) => { // a six-sided crystal at the centre holds the title; coloured rays run from it to each idea
        const s = k.slide(DK), n = d.items.length, cx = 5, cy = 2.8, W0 = 2.6, H0 = 2.4, w = 3.1, spots = n === 4 ? [[0, 0.32], [1, 0.32], [0, 2.82], [1, 2.82]] : [[0, 0.32], [1, 1.56], [0, 2.82]], hh = 2.38;
        for (const [i] of d.items.entries()) { const [side, y] = spots[i]; ray(s, cx, cy, side ? 6.5 : 3.5, y + 0.22, sp(i, n), 2); }
        t.img(s, await k.svg('hexa', `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="240"><polygon points="65,4 195,4 256,120 195,236 65,236 4,120" fill="#${GLASS}" stroke="#fff" stroke-width="4"/></svg>`, 260, 240), cx - W0 / 2, cy - H0 / 2, W0, H0);
        k.head(s, d.title || '', cx - 0.95, cy - 0.85, 1.9, 1.7, { max: 17, min: 11, color: C.ink, align: 'center' });
        k.txt(s, `λ${k.idx}`, cx - 0.5, 0.3, 1.0, 0.4, { size: 13, bold: true, color: C.spec[k.idx % 6], align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? 6.5 : 0.4, a = side ? 'left' : 'right', c = sp(i, n);
          t.img(s, await k.icon(it.icon, c, 2), side ? x : x + w - 0.34, y + 0.04, 0.34, 0.34);
          hd(s, it.h, side ? x + 0.42 : x, y, w - 0.42, 0.42, { align: a, color: c, max: 13.5 });
          bd(s, it.t, x, y + 0.46, w, hh - 0.5, { align: a, max: 12.5 });
        }
        k.foot(s, { y: 5.32, size: 7.5, color: C.muted, align: 'center', x: 0.6, w: 8.8 });
      },
    ],
    process: [
      async (d) => { // one beam passes prism after prism, taking a new colour at each
        const s = pg(d), n = d.steps.length, w = 9.2 / n, ya = 1.55, T = 0.8;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, c = sp(i, n), cxx = x + w / 2;
          ray(s, i ? x - w / 2 : 0, ya + 0.08, i ? cxx : cxx, ya + 0.08, i ? sp(i - 1, n) : 'FFFFFF', 3);
          if (i === n - 1) ray(s, cxx, ya + 0.08, 10, ya + 0.08, c, 3);
        }
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w, c = sp(i, n), cxx = x + w / 2;
          t.img(s, await k.svg(`trf${c}`, `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180"><polygon points="100,6 194,174 6,174" fill="#${DK}" stroke="#${c}" stroke-width="7"/></svg>`, 200, 180), cxx - T / 2, ya - T / 2, T, T * 0.9);
          k.txt(s, String(i + 1), cxx - 0.3, ya - 0.1, 0.6, 0.44, { size: 16, bold: true, font: F.head, color: c, align: 'center', valign: 'middle' });
          hd(s, st.h, x + 0.06, ya + 0.5, w - 0.14, 0.54, { align: 'center', color: c, valign: 'top', max: 14 });
          bd(s, st.t, x + 0.06, ya + 1.06, w - 0.14, 5.24 - ya - 1.06, { align: 'center', max: 13 });
        }
      },
      async (d) => { // a staircase of glass bars walks to the right, a colour for each step
        const s = pg(d), n = d.steps.length, y0 = 1.02, gap = 0.08, h = (5.2 - y0 - gap * (n - 1)) / n, w = n === 4 ? 6.8 : 7.1, ind = (9.2 - w) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * ind, y = y0 + i * (h + gap), c = sp(i, n);
          t.rect(s, x, y, w, h, GLASS, { name: 'Bar' }); t.rect(s, x, y, 0.56, h, c, { name: 'Tab' });
          k.txt(s, String(i + 1), x, y, 0.56, h, { size: 20, bold: true, font: F.head, color: DK, align: 'center', valign: 'middle' });
          hd(s, st.h, x + 0.68, y + 0.04, w - 0.8, 0.34, { color: c, max: 14 });
          bd(s, st.t, x + 0.68, y + 0.38, w - 0.8, h - 0.42, { max: 12.5, ls: 1.06 });
        }
      },
      async (d) => { // a ray bounces between two mirrors, top and bottom, a step at every touch
        const s = pg(d), n = d.steps.length, w = 4.35, m1 = 1.02, m2 = 5.2, ya = 3.1, xs = n === 4 ? [1.5, 3.6, 6.3, 8.4] : [1.5, 5, 8.5];
        t.rect(s, 0.4, m1, 9.2, 0.04, MIST, { name: 'Mirror' }); t.rect(s, 0.4, m2, 9.2, 0.04, MIST, { name: 'Mirror' });
        const spots = n === 4 ? [[0.4, 1.1], [0.4, 3.52], [5.25, 1.1], [5.25, 3.52]] : [[0.4, 1.1], [2.82, 3.52], [5.25, 1.1]];
        for (let i = 0; i < n - 1; i++) { const up = i % 2 === 0; ray(s, xs[i], up ? 2.92 : 3.28, xs[i + 1], up ? 3.28 : 2.92, sp(i, n), 2.5); }
        for (const [i, st] of d.steps.entries()) {
          const [x, y] = spots[i], c = sp(i, n), up = i % 2 === 0, my = up ? 2.92 : 3.28;
          t.oval(s, xs[i] - 0.2, my - 0.2, 0.4, 0.4, c); k.txt(s, String(i + 1), xs[i] - 0.2, my - 0.2, 0.4, 0.4, { size: 14, bold: true, font: F.head, color: DK, align: 'center', valign: 'middle' });
          hd(s, st.h, x, y, w, 0.36, { color: c });
          bd(s, st.t, x, y + 0.38, w, 1.2, { max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // the light let in: a spectrum stands up the middle of a white page, steps by turns at its sides
        const s = pg(d, { day: true }), n = d.steps.length, cx = 5, y0 = 1.04, rh = (5.14 - y0) / n, w = 4.2;
        specBar(s, cx - 0.09, 0.98, 0.18, 4.26, true);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? cx - 0.34 - w : cx + 0.34, a = left ? 'right' : 'left', hh = Math.min(rh * 1.7, 5.24 - y), c = sp(i, n, DEEP);
          t.oval(s, cx - 0.21, y, 0.42, 0.42, DK); k.txt(s, String(i + 1), cx - 0.21, y, 0.42, 0.42, { size: 14, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' });
          hd(s, st.h, x, y, w, 0.38, { color: c, align: a });
          bd(s, st.t, x, y + 0.4, w, hh - 0.42, { color: DK, align: a, max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // three prisms in a row, a figure in the widest part of each, its meaning beneath
        const s = pg(d), w = 9.2 / 3, W0 = 2.9, H0 = 2.42, y = 0.92, cols = [C.spec[0], C.spec[3], C.spec[5]];
        for (const [i, v] of d.stats.entries()) {
          const c = 0.4 + i * w + w / 2;
          t.img(s, await k.svg(`trs${cols[i]}`, `<svg xmlns="http://www.w3.org/2000/svg" width="290" height="242"><polygon points="145,6 284,236 6,236" fill="#${GLASS}" stroke="#${cols[i]}" stroke-width="4"/></svg>`, 290, 242), c - W0 / 2, y, W0, H0);
          k.head(s, v.value, c - 0.95, y + 1.34, 1.9, 0.92, { max: 28, min: 14, color: cols[i], align: 'center', ls: 1 });
          bd(s, v.label, c - w / 2 + 0.14, y + H0 + 0.06, w - 0.28, 0.72, { align: 'center', max: 13 });
        }
        if (d.note) bd(s, d.note, 0.4, 4.2, 9.2, 1.02, { color: C.muted, align: 'center', italic: true, max: 12.5, valign: 'middle' });
      },
      async (d) => { // one lead figure, huge, standing on a full-width spectrum; two more below it
        const s = pg(d), [a, ...rest] = d.stats;
        k.head(s, a.value, 0.4, 0.96, 5.4, 1.32, { max: 66, min: 28, color: C.spec[2], ls: 1 });
        bd(s, a.label, 5.9, 1.0, 3.7, 1.24, { max: 15, valign: 'middle' });
        specBar(s, 0, 2.36, 10, 0.12);
        for (const [i, v] of rest.entries()) {
          const x = 0.4 + i * 4.75;
          k.head(s, v.value, x, 2.58, 4.4, 0.66, { max: 30, min: 16, color: C.spec[i ? 4 : 3], ls: 1 });
          bd(s, v.label, x, 3.24, 4.4, 0.62, { max: 13 });
        }
        if (d.note) bd(s, d.note, 0.4, 3.96, 9.2, 1.26, { color: C.muted, italic: true, max: 13, valign: 'middle' });
      },
      async (d) => { // the light let in: three tall bands of deep colour on white, figures in white
        const s = pg(d, { day: true }), w = 3.0, H0 = d.note ? 2.96 : 4.1, cols = [DEEP[0], DEEP[4], DEEP[5]];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * (w + 0.1);
          t.rect(s, x, 1.02, w, H0, cols[i], { name: 'Band' });
          k.head(s, v.value, x + 0.16, 1.14, w - 0.32, 1.2, { max: 42, min: 18, color: 'FFFFFF', ls: 1 });
          bd(s, v.label, x + 0.16, 2.38, w - 0.32, H0 - 1.44, { color: 'FFFFFF', max: 14 });
        }
        if (d.note) bd(s, d.note, 0.4, 4.06, 9.2, 1.16, { color: '444455', max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // warm light to one side, cold to the other: one prism on top, the sides mirror each other
        const s = pg(d), cx = 5, w = 4.15, top = 1.76, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.16, 5.22 - top);
        [C.spec[0], C.spec[1], C.spec[2]].forEach((c, i) => ray(s, cx - 0.1, 1.5, cx - 1.1 - i * 0.5, 1.68, c, 2));
        [C.spec[3], C.spec[4], C.spec[5]].forEach((c, i) => ray(s, cx + 0.1, 1.5, cx + 1.1 + i * 0.5, 1.68, c, 2));
        await tri(s, cx - 0.3, 1.04, 0.6, 0.54);
        k.head(s, d.left.h, cx - 0.4 - 3.6, 0.98, 3.6, 0.5, { max: 17, min: 12, color: C.spec[1], align: 'right' });
        k.head(s, d.right.h, cx + 0.4, 0.98, 3.6, 0.5, { max: 17, min: 12, color: C.spec[4] });
        t.line(s, cx, 1.76, 0, 3.46, GLASS, 1.5);
        let y = top; const m = Math.max(d.left.items.length, d.right.items.length);
        for (let j = 0; j < m; j++) {
          if (d.left.items[j]) k.txt(s, d.left.items[j], cx - 0.2 - w, y, w, rr[j], { size: fs, align: 'right', color: C.ink, ls: 1 });
          if (d.right.items[j]) k.txt(s, d.right.items[j], cx + 0.2, y, w, rr[j], { size: fs, color: C.ink, ls: 1 });
          y += rr[j];
        }
      },
      async (d) => { // two solid bands of colour across the page, one warm, one cold, dark words on them
        const s = pg(d), H = 2.04;
        [[d.left, 1.02, C.spec[1]], [d.right, 3.14, C.spec[4]]].forEach(([sd, y, f]) => {
          t.rect(s, 0, y, 10, H, f, { name: 'Band' });
          k.head(s, sd.h, 0.4, y + 0.08, 2.1, H - 0.16, { max: 17, min: 12, color: DK });
          const n = sd.items.length, w = 6.9 / n;
          sd.items.forEach((it, j) => { const x = 2.7 + j * w; t.line(s, x - 0.1, y + 0.2, 0, H - 0.4, DK, 1); bd(s, it, x, y + 0.14, w - 0.2, H - 0.28, { color: DK, max: 13, valign: 'middle', ls: 1.08 }); });
        });
      },
    ],
    statement: [
      async (d) => { // the light let in: black words on a white page, a thin spectrum drawn under them
        const s = pg(d, { day: true });
        k.head(s, L.runs(d.text), 0.5, 1.0, 9.0, 2.55, { max: 34, min: 16, color: DK });
        specBar(s, 0.5, 3.62, 9.0, 0.09);
        if (d.caption) bd(s, d.caption, 0.5, 3.8, 9.0, 1.42, { color: '444455', max: 13.5 });
      },
      async (d) => { // the spectrum falls as a broad slanting band from corner to corner, the sentence over dark glass
        const s = k.slide(DK); let g = '';
        C.spec.forEach((c, i) => { const o = i * 34; g += `<polygon points="${730 + o},0 ${764 + o},0 ${694 + o},563 ${660 + o},563" fill="#${c}"/>`; });
        t.img(s, await k.svg('slant', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">${g}</svg>`, 1000, 563), 0, 0, 10, 5.625);
        k.head(s, d.title || '', 0.4, 0.22, 5.4, 0.72, { max: 20, min: 13, color: C.muted });
        k.txt(s, `λ${k.idx}`, 8.6, 0.22, 1.0, 0.72, { size: 13, bold: true, color: C.ink, align: 'right', valign: 'middle' });
        k.head(s, L.runs(d.text), 0.4, 1.02, 5.8, 2.6, { max: 26, min: 15, color: C.ink });
        if (d.caption) bd(s, d.caption, 0.4, 3.68, 5.8, 1.5, { color: MIST, max: 12.5 });
        k.foot(s, { y: 5.32, size: 7.5, w: 5.8, x: 0.4, color: C.muted });
      },
    ],
    timeline: [
      async (d) => { // the spectrum is the time axis: a colour for each period, the year written on it
        const s = pg(d), w = 9.2 / 4, cols = [C.spec[0], C.spec[2], C.spec[3], C.spec[4]];
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w;
          t.rect(s, x, 1.08, w, 0.58, cols[i], { name: 'Period' });
          k.head(s, it.year, x + 0.06, 1.08, w - 0.12, 0.58, { max: 18, min: 11, color: DK, align: 'center', ls: 1 });
          hd(s, it.h, x + 0.08, 1.78, w - 0.2, 0.4, { color: cols[i], max: 14 });
          bd(s, it.t, x + 0.08, 2.2, w - 0.2, 3.02, { max: 13.5 });
        }
      },
      async (d) => { // the light let in: a colour line across the white page, events above and below it by turns
        const s = pg(d, { day: true }), ya = 3.06, w = 4.35;
        specBar(s, 0, ya - 0.04, 10, 0.08);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.45 + i * 2.28, x = 0.4 + Math.floor(i / 2) * 4.75, c = sp(i, 4, DEEP);
          t.oval(s, xn, ya - 0.1, 0.2, 0.2, DK);
          k.head(s, it.year, xn + 0.24, up ? ya - 0.38 : ya + 0.08, 1.9, 0.3, { max: 14, min: 10, color: c });
          if (up) { hd(s, it.h, x, 0.96, w, 0.36, { color: c }); bd(s, it.t, x, 1.32, w, ya - 0.44 - 1.32, { color: DK, max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.42, w, 0.36, { color: c }); bd(s, it.t, x, ya + 0.78, w, 5.24 - ya - 0.78, { color: DK, max: 12.5 }); }
        }
      },
      async (d) => { // a light wave runs down the left, each crest a year, the event reading off it to the right
        const s = pg(d), y0 = 1.02, rh = (5.2 - y0) / 4; let p = 'M40,0';
        for (let y = 0; y <= 418; y += 4) p += ` L${(40 + 26 * Math.sin(y / 418 * 4 * 2 * Math.PI - Math.PI / 2)).toFixed(1)},${y}`;
        t.img(s, await k.svg('wave', `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="418"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${C.spec.map((c, i) => `<stop offset="${i / 5}" stop-color="#${c}"/>`).join('')}</linearGradient></defs><path d="${p}" fill="none" stroke="url(#g)" stroke-width="4"/></svg>`, 80, 418), 0.4, y0, 0.8, rh * 4);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, c = sp(i, 4);
          k.head(s, it.year, 1.3, y, 1.75, rh, { max: 18, min: 11, color: c, ls: 1 });
          hd(s, it.h, 3.1, y + 0.05, 6.5, 0.36);
          bd(s, it.t, 3.1, y + 0.42, 6.5, rh - 0.46, { max: 13, ls: 1.08, color: MIST });
          if (i < 3) t.line(s, 1.3, y + rh - 0.01, 8.3, 0, '2C2C3E', 0.75);
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Prizma', colors: { dk1: C.bg, lt1: C.ink, dk2: '1C1C2B', lt2: C.muted, accent1: C.spec[0], accent2: C.spec[1], accent3: C.spec[2], accent4: C.spec[3], accent5: C.spec[4], accent6: C.spec[5], hlink: C.spec[4], folHlink: C.muted } });
}
module.exports = { id: 137, slug: 'prizma', name: 'Prizma', category: 'creative', photos: true, build, style: { tone: "bitta g'oyani ko'p qirralarga ajratish: umumiydan alohida jihatlarga, yorqin va aniq", limits: {}, prefer: null } };
