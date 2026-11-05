/**
 * 126 Gant — a project Gantt chart: a period grid with column headers, a label column on the left and
 * staggered rounded BARS carrying the text; a red "today" line; milestones as diamonds.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '1F2937', muted: '6B7280', grid: 'E5E7EB', head: 'F3F4F6', today: 'DC2626', pal: ['4F46E5', '0D9488', 'B45309', 'DB2777', '2563EB', '4D7C0F'] };
const F = { head: 'Arial', body: 'Calibri' };
const LX = 0.35, LW = 2.45, GX = 2.9, GW = 6.75, GY = 1.25, GH = 3.85, COLS = 8;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const gridBg = (s, labels) => { t.rect(s, GX, GY - 0.32, GW, 0.32, C.head, { name: 'Header' }); for (let c = 0; c <= COLS; c++) t.line(s, GX + c * GW / COLS, GY - 0.32, 0, GH + 0.32, C.grid, 0.75); for (let c = 0; c < COLS; c++) k.txt(s, labels ? labels[c] || '' : `${c + 1}`, GX + c * GW / COLS, GY - 0.32, GW / COLS, 0.32, { size: 8, bold: true, color: C.muted, align: 'center', valign: 'middle' }); t.line(s, GX + GW * 0.62, GY - 0.4, 0, GH + 0.45, C.today, 1.5, { dash: 'dash' }); t.oval(s, GX + GW * 0.62 - 0.06, GY - 0.46, 0.12, 0.12, C.today); };
  const page = (d, labels) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, LX, 0.22, 8.2, 0.55, { max: 24, min: 13 }); k.txt(s, `W${k.idx}`, 8.8, 0.22, 0.85, 0.55, { size: 14, bold: true, color: C.pal[0], align: 'right', valign: 'middle' }); gridBg(s, labels); k.foot(s, { x: LX, y: 5.3, w: 9.3, size: 7.5 }); return s; };
  // rows: label in left column, bar spanning [start,len] columns with text inside
  const bars = (s, n, draw) => { const rh = GH / n; for (let i = 0; i < n; i++) { const y = GY + i * rh, start = Math.min(i, COLS - 5) * (n > 4 ? 0.6 : 1), len = COLS - start - (n > 4 ? 1.2 : 0.6) - (i % 2) * 0.4, bx = GX + start * GW / COLS + 0.04, bw = len * GW / COLS - 0.08;
    t.line(s, LX, y + rh, GX + GW - LX, 0, C.grid, 0.5); t.rect(s, bx, y + 0.07, bw, rh - 0.14, C.pal[i % 6], { r: 0.08, name: 'Bar' }); draw(i, y, rh, bx + 0.1, bw - 0.2); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); for (let i = 0; i < 6; i++) t.rect(s, 5.4 + i * 0.35, 0.6 + i * 0.62, 2.0 + (i % 3) * 0.6, 0.42, C.pal[i % 6], { r: 0.08, t: 10, name: 'Bar' }); t.line(s, 7.6, 0.4, 0, 4.4, C.today, 1.5, { dash: 'dash' }); if (d.image) await k.photo(s, d.image, 7.9, 3.3, 1.7, 1.5, { mask: { r: 0.08 } });
      k.txt(s, k.org3, 0.45, 0.6, 4.6, 0.35, { size: 12, bold: true, color: C.pal[0] }); k.head(s, d.title, 0.45, 1.0, 4.7, 2.4, { max: 38, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.45, 3.45, 4.6, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.45, 4.3, 4.6, 0.45, { size: 15, bold: true }); k.foot(s, { x: 0.45, y: 5.3, w: 9.0, size: 7.5 }); },
    async intro(d) { const s = k.slide(C.bg); k.head(s, d.title, LX, 0.22, 8.2, 0.55, { max: 24, min: 13 }); await k.photo(s, d.image, 6.2, 0.95, 3.45, 4.15, { mask: { r: 0.08 } }); t.rect(s, LX, 0.95, 0.08, 4.15, C.pal[0], { name: 'Bar' }); k.txt(s, d.text, LX + 0.3, 0.95, 5.5, 4.15, { max: 16, min: 10, ls: 1.35, valign: 'middle' }); k.foot(s, { x: LX, y: 5.3, w: 9.3, size: 7.5 }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); bars(s, d.items.length, (i, y, rh, x, w) => { k.txt(s, `${i + 1}.`, LX, y, 0.4, rh, { size: 13, bold: true, color: C.pal[i % 6], valign: 'middle' }); k.head(s, d.items[i], LX + 0.4, y, LW - 0.45, rh, { max: 14 }); }); },
    async cards(d) { const s = page(d); bars(s, d.items.length, (i, y, rh, x, w) => { k.head(s, d.items[i].h, LX, y, LW - 0.1, rh, { max: 14 }); k.txt(s, d.items[i].t, x, y + 0.07, w, rh - 0.14, { max: 12, min: 8.5, color: 'FFFFFF', valign: 'middle' }); }); },
    async process(d) { const s = page(d); bars(s, d.steps.length, (i, y, rh, x, w) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, LX, y, LW - 0.1, rh, { max: 14 }); k.txt(s, d.steps[i].t, x, y + 0.07, w, rh - 0.14, { max: 12, min: 8.5, color: 'FFFFFF', valign: 'middle' }); }); },
    async stats(d) { const s = page(d), n = d.stats.length, rh = (d.note ? GH - 0.6 : GH) / n; d.stats.forEach((v, i) => { const y = GY + i * rh; k.txt(s, v.label, LX, y, LW - 0.1, rh, { max: 12, valign: 'middle' }); const mx = GX + (1.5 + i * 2) * GW / COLS; t.shape(s, 'DIAMOND', { x: mx - 0.22, y: y + rh / 2 - 0.22, w: 0.44, h: 0.44, fill: { color: C.pal[i % 6] }, objectName: 'Milestone' }); k.head(s, v.value, mx + 0.35, y, GX + GW - mx - 0.4, rh, { max: 36, min: 14, color: C.pal[i % 6] }); t.line(s, LX, y + rh, GX + GW - LX, 0, C.grid, 0.5); });
      if (d.note) k.txt(s, d.note, LX, GY + GH - 0.55, 9.3, 0.55, { max: 9, italic: true, color: C.muted, valign: 'middle' }); },
    async compare(d) { const s = page(d), half = GH / 2, groups = [d.left, d.right]; groups.forEach((sd, g) => { const y0 = GY + g * half; t.rect(s, LX, y0 + 0.04, LW - 0.1, half - 0.08, C.pal[g], { r: 0.06, name: 'Group' }); k.head(s, sd.h, LX + 0.1, y0, LW - 0.3, half, { max: 15, color: 'FFFFFF' }); const { rows: rr, fs } = rowsFit([sd.items], 12, GW - 0.3, F.body, 0.06, half - 0.1); let y = y0 + 0.05; sd.items.forEach((it, j) => { t.rect(s, GX + 0.05 + j * 0.25, y + 0.03, GW - 0.1 - j * 0.25, rr[j] - 0.06, C.pal[g], { r: 0.05, t: 80, name: 'Bar' }); k.txt(s, it, GX + 0.15 + j * 0.25, y, GW - 0.3 - j * 0.25, rr[j], { size: fs, valign: 'middle' }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); t.rect(s, GX + 0.05, GY + 0.2, GW - 0.1, 2.2, C.pal[0], { r: 0.12, name: 'Bar' }); k.head(s, L.runs(d.text), GX + 0.3, GY + 0.25, GW - 0.6, 2.1, { max: 28, min: 14, color: 'FFFFFF' }); if (d.caption) k.txt(s, d.caption, LX, GY + 2.6, 9.3, 1.2, { max: 12, color: C.muted }); },
    async timeline(d) { const s = page(d, (() => { const ys = d.items.map((x) => x.year); return Array.from({ length: COLS }, (_, c) => ys[Math.floor(c * ys.length / COLS)] && c % Math.ceil(COLS / ys.length) === 0 ? ys[Math.floor(c * ys.length / COLS)] : ''); })()); bars(s, d.items.length, (i, y, rh, x, w) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, LX, y, LW - 0.1, rh, { max: 13 }); k.txt(s, d.items[i].t, x, y + 0.07, w, rh - 0.14, { max: 12, min: 8.5, color: 'FFFFFF', valign: 'middle' }); }); },
    async quote(d) { const s = page({}); t.shape(s, 'DIAMOND', { x: GX + GW * 0.62 - 0.35, y: GY + 0.3, w: 0.7, h: 0.7, fill: { color: C.today }, objectName: 'Milestone' }); k.head(s, `\u201C${d.text}\u201D`, LX + 0.2, GY + 1.15, 9.0, 2.0, { max: 28, min: 14, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, LX + 0.2, GY + 3.2, 9.0, 0.45, { size: 14, bold: true, color: C.pal[0], align: 'center' }); },
    async sources(d) { const s = page(d); bars(s, d.items.length, (i, y, rh, x, w) => { k.txt(s, `#${i + 1}`, LX, y, LW, rh, { size: 12, bold: true, color: C.pal[i % 6], valign: 'middle' }); k.txt(s, d.items[i], x, y + 0.07, w, rh - 0.14, { max: 11, min: 8, color: 'FFFFFF', valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all on the planner's period grid: a deck's pages must not look alike (L.pages)
  const DARK = '111827', PANEL = '1F2937', FOG = 'CBD5E1', tint = ['E0E7FF', 'CCFBF1', 'FDE9C8', 'FCE7F3', 'DBEAFE', 'E6F4D1'], light = ['A5B4FC', '5EEAD4', 'FCD34D', 'F9A8D4', '93C5FD', 'BEF264'];
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const diamond = (s, x, y, dd, color, o = {}) => t.shape(s, 'DIAMOND', { x, y, w: dd, h: dd, fill: { color }, objectName: 'Milestone', ...(o.line ? { line: o.line } : {}) });
  const period = (s, x, y, w, h, cols, o = {}) => { for (let c = 0; c <= cols; c++) t.line(s, x + c * w / cols, y, 0, h, o.color || C.grid, 0.75); };
  const heads = (s, x, y, w, cols, o = {}) => { t.rect(s, x, y, w, 0.3, o.fill || C.head, { name: 'Header' }); for (let c = 0; c < cols; c++) k.txt(s, `${c + 1}`, x + c * w / cols, y, w / cols, 0.3, { size: 8, bold: true, color: o.color || C.muted, align: 'center', valign: 'middle' }); };
  const pg = (d, o = {}) => { // the plan's sheet; o.night = the planner in its dark mode
    const s = k.slide(o.night ? DARK : C.bg), tb = o.title || {};
    if (d.title) k.head(s, d.title, tb.x ?? LX, tb.y ?? 0.22, tb.w ?? 8.2, tb.h ?? 0.55, { max: tb.max ?? 24, min: 13, color: o.night ? 'FFFFFF' : C.ink });
    k.txt(s, `W${k.idx}`, 8.8, 0.22, 0.85, 0.55, { size: 14, bold: true, color: o.night ? light[0] : C.pal[0], align: 'right', valign: 'middle' });
    k.foot(s, { x: LX, y: 5.3, w: 9.3, size: 7.5, ...(o.night ? { color: FOG } : {}) });
    return s;
  };
  const V = {
    image: [
      async (d) => { // the picture is one long bar on the plan, the words a pale bar under it
        const s = pg(d); period(s, LX, 0.92, 9.3, 4.28, 12); heads(s, LX, 0.92, 9.3, 12);
        await k.photo(s, d.image, LX + 9.3 * 2 / 12, 1.32, 9.3 * 10 / 12, 1.75, { mask: { r: 0.1 } });
        t.rect(s, LX + 0.04, 3.17, 8.4, 2.03, tint[0], { r: 0.08, name: 'Bar' });
        bd(s, d.text, LX + 0.22, 3.22, 8.04, 1.93, { max: 13.5, valign: 'middle' });
        const tx = LX + 9.3 * 2 / 12 - 0.3; t.line(s, tx, 0.92, 0, 2.2, C.today, 1.5, { dash: 'dash' }); t.oval(s, tx - 0.06, 0.86, 0.12, 0.12, C.today);
      },
      async (d) => { // the picture fills the page, three bars of the plan lie over it: title, words, footer
        const s = k.slide(DARK);
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, 0, 0.3, 7.2, 0.86, C.pal[0], { name: 'Bar' });
        k.head(s, d.title || '', LX, 0.32, 6.65, 0.82, { max: 24, min: 13, color: 'FFFFFF' });
        t.rect(s, 7.45, 0.3, 2.2, 0.86, 'FFFFFF', { r: 0.08, name: 'Bar' });
        k.txt(s, `W${k.idx}`, 7.45, 0.3, 2.2, 0.86, { size: 16, bold: true, color: C.pal[0], align: 'center', valign: 'middle' });
        t.rect(s, 2.6, 1.42, 7.05, 3.56, 'FFFFFF', { r: 0.1, shadow: 0.35, name: 'Bar' });
        bd(s, d.text, 2.85, 1.52, 6.55, 3.36, { max: 14, valign: 'middle', ls: 1.22 });
        t.rect(s, 0, 5.22, 10, 0.405, DARK, { name: 'Band' });
        k.foot(s, { x: LX, y: 5.31, w: 9.3, size: 7.5, color: FOG });
      },
      async (d) => { // the picture is the milestone itself: a great diamond standing on the today line
        const s = pg(d, { title: { w: 4.65, h: 0.95, max: 22 } }), D = 4.6, x = 5.2, y = 0.62, cx = x + D / 2;
        period(s, 4.4, 0.3, 5.6, 4.9, 5);
        t.line(s, cx, 0.2, 0, 5.05, C.today, 1.5, { dash: 'dash' });
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: { poly: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]] } }), x, y, D, D, { alt: '' });
        t.rect(s, LX, 1.5, 0.08, 3.65, C.today, { name: 'Bar' });
        bd(s, d.text, LX + 0.22, 1.5, 4.05, 3.65, { max: 14, ls: 1.2, valign: 'middle' });
      },
      async (d) => { // dark mode: the picture shows only through the staggered bars of a chart
        const s = pg(d, { night: true, title: { w: 8.2 } }), W0 = 5.5, H0 = 4.2, n = 5, bh = 0.84 / H0;
        const seg = [[0, 0.62], [0.12, 0.88], [0.04, 0.72], [0.3, 1], [0.18, 0.82]];
        let p = ''; seg.forEach(([a, b], i) => { const y0 = i / n + 0.008, y1 = y0 + bh - 0.016; p += `M${a},${y0} L${b},${y0} L${b},${y1} L${a},${y1} Z `; });
        period(s, LX, 0.92, W0, H0 + 0.04, 8, { color: '374151' });
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: { path: p } }), LX, 0.96, W0, H0, { alt: '' });
        bd(s, d.text, 6.1, 0.96, 3.55, 4.2, { max: 13, color: 'FFFFFF', valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // swimlanes stand upright, each hanging from its coloured head at its own start
        const s = pg(d), n = d.items.length, w = 9.3 / n, st = n === 4 ? [0, 0.34, 0.12, 0.46] : [0, 0.34, 0.14];
                for (const [i, it] of d.items.entries()) {
          const x = LX + i * w + 0.05, y = 0.95 + st[i], ww = w - 0.1, hh = 5.18 - y;
          t.rect(s, x, y, ww, hh, tint[i % 6], { r: 0.06, name: 'Lane' });
          t.rect(s, x, y, ww, 0.5, C.pal[i % 6], { r: 0.06, name: 'Bar' });
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), x + ww / 2 - 0.17, y + 0.08, 0.34, 0.34);
          hd(s, it.h, x + 0.1, y + 0.54, ww - 0.2, 0.55, { max: 14, align: 'center' });
          bd(s, it.t, x + 0.1, y + 1.1, ww - 0.2, hh - 1.14, { align: 'center', max: 12.5 });
        }
      },
      async (d) => { // work packages pinned to the grid, a diamond at the head of each
        const s = pg(d), n = d.items.length, w = 4.58, h = 1.98; period(s, LX, 0.92, 9.3, 4.28, 16);
        for (const [i, it] of d.items.entries()) {
          const row = Math.floor(i / 2), x = n === 3 && i === 2 ? LX + 2.36 : LX + (i % 2) * (w + 0.14), y = 1.0 + row * (h + 0.12);
          t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.08, line: { color: C.pal[i % 6], width: 1.5 }, name: 'Package' });
          diamond(s, x + 0.12, y + 0.08, 0.5, C.pal[i % 6]);
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2.25), x + 0.27, y + 0.23, 0.2, 0.2);
          hd(s, it.h, x + 0.7, y + 0.1, w - 0.82, 0.46, { color: C.pal[i % 6] });
          bd(s, it.t, x + 0.16, y + 0.62, w - 0.32, h - 0.68, { max: 13 });
        }
      },
      async (d) => { // the first package stands as a tall bar in colour, the rest run beside it
        const s = k.slide(C.bg), [a, ...rest] = d.items, W0 = 3.9, h = 4.86 / rest.length;
        t.rect(s, 0, 0, W0, 5.625, C.pal[0], { name: 'Tall bar' });
        k.head(s, d.title || '', LX, 0.25, W0 - 0.7, 1.35, { max: 22, min: 13, color: 'FFFFFF', valign: 'top' });
        t.img(s, await k.icon(a.icon, 'FFFFFF', 1.75), LX, 1.72, 0.56, 0.56);
        hd(s, a.h, LX, 2.36, W0 - 0.7, 0.56, { color: 'FFFFFF', max: 18 });
        bd(s, a.t, LX, 2.96, W0 - 0.7, 2.2, { color: 'FFFFFF', max: 13.5 });
        k.txt(s, `W${k.idx}`, 8.8, 0.08, 0.85, 0.3, { size: 12, bold: true, color: C.pal[0], align: 'right', valign: 'middle' });
        for (const [i, it] of rest.entries()) {
          const y = 0.36 + i * h, c = C.pal[(i + 1) % 6];
          t.rect(s, W0 + 0.3, y + 0.04, 0.08, h - 0.16, c, { name: 'Bar' });
          t.img(s, await k.icon(it.icon, c, 2), W0 + 0.52, y + 0.04, 0.32, 0.32);
          hd(s, it.h, W0 + 0.94, y, 4.8, 0.4, { color: c });
          bd(s, it.t, W0 + 0.52, y + 0.42, 5.22, h - 0.54, { max: 13 });
        }
        k.foot(s, { x: W0 + 0.3, y: 5.3, w: 5.4, size: 7.5 });
      },
      async (d) => { // the plan's map: one milestone at the centre, elbows run from it to each package
        const s = pg(d), n = d.items.length, cx = 5, cy = 3.05, w = 3.5, spots = n === 4 ? [[0, 1.0], [1, 1.0], [0, 3.14], [1, 3.14]] : [[0, 1.0], [1, 2.08], [0, 3.14]], hh = 2.04;
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? 9.65 - w : LX, c = C.pal[i % 6], ax = side ? x : x + w, ay = y + 0.27;
          t.line(s, Math.min(ax, cx), ay, Math.abs(ax - cx), 0, c, 1.5); t.line(s, cx, Math.min(ay, cy), 0, Math.abs(ay - cy), c, 1.5);
          t.rect(s, x, y, w, 0.54, c, { r: 0.08, name: 'Bar' });
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), x + 0.1, y + 0.11, 0.32, 0.32);
          hd(s, it.h, x + 0.5, y, w - 0.58, 0.54, { color: 'FFFFFF', max: 14 });
          bd(s, it.t, x + 0.04, y + 0.6, w - 0.08, hh - 0.64, { max: 12.5 });
        }
        diamond(s, cx - 0.5, cy - 0.5, 1.0, C.today);
        k.txt(s, String(n), cx - 0.5, cy - 0.5, 1.0, 1.0, { size: 22, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' });
      },
    ],
    process: [
      async (d) => { // the waterfall: each bar starts where the one before ends, an elbow leads down
        const s = pg(d), n = d.steps.length, top = 1.28, rh = (5.2 - top) / n, bw = 3.05, ind = n === 4 ? 0.98 : 1.3;
        period(s, LX, 0.92, 9.3, 4.28, 10); heads(s, LX, 0.92, 9.3, 10);
        for (const [i, st] of d.steps.entries()) {
          const x = LX + i * ind, y = top + i * rh, c = C.pal[i % 6], bh = Math.min(0.62, rh - 0.26), tx = x + bw + 0.14;
          t.rect(s, x, y + 0.06, bw, bh, c, { r: 0.07, name: 'Bar' });
          hd(s, `${i + 1}. ${st.h}`, x + 0.1, y + 0.06, bw - 0.2, bh, { color: 'FFFFFF', max: 13.5, min: 10.5 });
          if (i < n - 1) { t.line(s, x + 0.3, y + 0.06 + bh, 0, rh - bh + 0.0, c, 1.5); t.line(s, x + 0.3, y + rh + 0.06 + bh / 2, ind - 0.3, 0, c, 1.5); }
          t.rect(s, tx, y + 0.03, 9.65 - tx, rh - 0.08, 'FFFFFF', { name: 'Back' });
          bd(s, st.t, tx, y + 0.03, 9.65 - tx, rh - 0.08, { valign: 'middle', max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // the critical path: milestones on a red line, each column hangs from one
        const s = pg(d), n = d.steps.length, w = 9.3 / n, ya = 1.42, dd = 0.84;
        t.line(s, LX, ya, 9.3, 0, C.today, 2.5);
        for (const [i, st] of d.steps.entries()) {
          const x = LX + i * w, cx = x + 0.42;
          diamond(s, cx - dd / 2, ya - dd / 2, dd, C.pal[i % 6]);
          k.txt(s, String(i + 1), cx - dd / 2, ya - dd / 2, dd, dd, { size: 18, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle' });
          t.line(s, cx, ya + dd / 2, 0, 3.26 - dd / 2, C.grid, 1);
          hd(s, st.h, cx + 0.12, 1.94, w - 0.68, 0.72, { valign: 'top', max: 14, color: C.pal[i % 6] });
          bd(s, st.t, cx + 0.12, 2.68, w - 0.68, 2.5, { max: 13 });
        }
      },
      async (d) => { // the burn-up: wide columns rise to the right, the words stand inside them
        const s = pg(d, { title: { w: 6.1, h: 0.75 } }), n = d.steps.length, w = 9.3 / n, tops = n === 4 ? [2.46, 1.96, 1.46, 0.96] : [2.3, 1.62, 0.96];
        for (const [i, st] of d.steps.entries()) {
          const x = LX + i * w + 0.04, y = tops[i], ww = w - 0.08, c = C.pal[i % 6];
          t.rect(s, x, y, ww, 5.2 - y, c, { r: 0.08, name: 'Column' });
          k.txt(s, String(i + 1), x + 0.14, y + 0.06, 0.8, 0.46, { size: 24, bold: true, font: F.head, color: 'FFFFFF', valign: 'middle' });
          hd(s, st.h, x + 0.14, y + 0.54, ww - 0.28, 0.56, { color: 'FFFFFF', max: 14, valign: 'top' });
          bd(s, st.t, x + 0.14, y + 1.1, ww - 0.28, 5.16 - y - 1.1, { color: 'FFFFFF', max: 12.5 });
        }
      },
      async (d) => { // dark mode: two swimlanes, the work hands over from one to the other
        const s = pg(d, { night: true }), n = d.steps.length, w = 3.6, stepx = (9.3 - w) / (n - 1), lanes = [0.94, 3.12], lh = 2.08;
        lanes.forEach((y) => t.rect(s, 0, y, 10, lh, PANEL, { name: 'Lane' }));
        for (const [i, st] of d.steps.entries()) {
          const lane = i % 2, x = LX + i * stepx, y = lanes[lane] + 0.1, c = light[i % 6];
          if (i < n - 1) { const up = lane === 1, y1 = up ? lanes[0] + 1.5 : y + 1.4, y2 = up ? y : lanes[1] + 0.1; t.line(s, x + w - 0.2 > LX + (i + 1) * stepx ? LX + (i + 1) * stepx + 0.2 : x + w, Math.min(y1, y2), 0, Math.abs(y2 - y1), c, 1.25, { dash: 'dash' }); }
          t.rect(s, x, y, w, 0.42, c, { r: 0.06, name: 'Bar' });
          hd(s, `${i + 1}. ${st.h}`, x + 0.1, y, w - 0.2, 0.42, { color: DARK, max: 13.5 });
          bd(s, st.t, x + 0.1, y + 0.48, w - 0.2, lh - 0.66, { color: 'FFFFFF', max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // the three numbers are milestones of the plan, set at their own heights
        const s = pg(d), w = 3.1, D = 2.5, ys = [1.0, 0.86, 1.0], yn = 4.26; period(s, LX, 0.92, 9.3, d.note ? 3.3 : 4.28, 6);
        for (const [i, v] of d.stats.entries()) {
          const x = LX + i * w, c = C.pal[[0, 3, 1][i]], y = ys[i], xd = x + (w - D) / 2;
          diamond(s, xd, y, D, c);
          k.head(s, v.value, xd + 0.42, y + 0.62, D - 0.84, D - 1.24, { max: 28, min: 14, color: 'FFFFFF', align: 'center', ls: 1 });
          bd(s, v.label, x + 0.1, 3.42, w - 0.2, 0.74, { align: 'center', max: 13 });
        }
        if (d.note) { t.rect(s, LX, yn, 9.3, 0.94, C.head, { r: 0.06, name: 'Note' }); bd(s, d.note, LX + 0.15, yn + 0.04, 9.0, 0.86, { color: C.muted, italic: true, valign: 'middle', max: 12 }); }
      },
      async (d) => { // dark mode: one lead number across the left, two lesser ones stacked on the right
        const s = pg(d, { night: true }), [a, ...rest] = d.stats, by = d.note ? 3.9 : 5.15;
        k.head(s, a.value, LX, 1.0, 5.2, 1.6, { max: 72, min: 30, color: light[0] });
        bd(s, a.label, LX, 2.66, 5.0, 1.1, { color: 'FFFFFF', max: 16 });
        t.line(s, 5.75, 1.0, 0, by - 1.0, C.today, 1.5, { dash: 'dash' }); t.oval(s, 5.69, 0.94, 0.12, 0.12, C.today);
        for (const [i, v] of rest.entries()) {
          const h = (by - 1.0) / 2, y = 1.0 + i * h;
          k.head(s, v.value, 6.0, y, 3.65, h * 0.5, { max: 34, min: 16, color: light[i + 1] });
          bd(s, v.label, 6.0, y + h * 0.5, 3.65, h * 0.48, { color: 'FFFFFF', max: 12.5 });
        }
        if (d.note) { t.line(s, LX, 4.02, 9.3, 0, '4B5563', 0.75); bd(s, d.note, LX, 4.1, 9.3, 1.08, { color: FOG, italic: true, max: 12 }); }
      },
    ],
    compare: [
      async (d) => { // the today line divides the page: bars of one side run left of it, the other's right
        const s = pg(d), w = 4.4, cx = 5, top = 1.56, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w - 0.3, F.body, 0.2, 5.18 - top), pad = 0.05;
        t.line(s, cx, 0.92, 0, 4.28, C.today, 1.5, { dash: 'dash' }); t.oval(s, cx - 0.06, 0.86, 0.12, 0.12, C.today);
        [d.left, d.right].forEach((sd, i) => { const x = i ? cx + 0.12 : cx - 0.12 - w, c = C.pal[i ? 1 : 0], a = i ? 'left' : 'right';
          k.head(s, sd.h, x, 0.98, w, 0.5, { max: 17, min: 12, color: c, align: a }); let y = top;
          sd.items.forEach((it, j) => { t.rect(s, x, y + pad, w, rr[j] - 2 * pad, tint[i ? 1 : 0], { r: 0.05, name: 'Bar' }); k.txt(s, it, x + 0.15, y, w - 0.3, rr[j], { size: fs, align: a, valign: 'middle', ls: 1 }); y += rr[j]; }); });
      },
      async (d) => { // the page split in two periods: one light, one dark, a milestone on each row
        const s = k.slide(C.bg), W0 = 4.9, top = 2.0, w = W0 - 0.95, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.2, 5.15 - top);
        t.rect(s, W0, 0, 10 - W0, 5.625, DARK, { name: 'Dark period' });
        k.head(s, d.title || '', LX, 0.18, W0 - 0.6, 0.82, { max: 22, min: 13, color: C.ink });
        k.txt(s, `W${k.idx}`, 8.8, 0.22, 0.85, 0.55, { size: 14, bold: true, color: light[0], align: 'right', valign: 'middle' });
        [d.left, d.right].forEach((sd, i) => { const x0 = i ? W0 + 0.35 : LX, c = i ? light[1] : C.pal[0], ink = i ? 'FFFFFF' : C.ink;
          t.rect(s, x0, 1.12, W0 - 0.7, 0.66, i ? C.pal[1] : C.pal[0], { r: 0.08, name: 'Bar' }); hd(s, sd.h, x0 + 0.15, 1.12, W0 - 1.0, 0.66, { color: 'FFFFFF', max: 17 });
          let y = top; sd.items.forEach((it, j) => { diamond(s, x0, y + 0.02, 0.2, c); k.txt(s, it, x0 + 0.3, y, w, rr[j], { size: fs, color: ink, ls: 1 }); y += rr[j]; }); });
        k.foot(s, { x: LX, y: 5.3, w: 4.3, size: 7 });
      },
    ],
    statement: [
      async (d) => { // the whole page in plan colour: the sentence hangs on one milestone
        const s = k.slide(C.pal[0]);
        for (let c = 0; c <= 10; c++) t.line(s, c, 0, 0, 5.625, '6366F1', 0.75);
        k.head(s, d.title || '', LX, 0.22, 8.2, 0.55, { max: 22, min: 13, color: 'E0E7FF' });
        k.txt(s, `W${k.idx}`, 8.8, 0.22, 0.85, 0.55, { size: 14, bold: true, color: 'FFFFFF', align: 'right', valign: 'middle' });
        diamond(s, 0.6, 1.2, 0.6, 'FFFFFF');
        k.head(s, L.runs(d.text), 1.5, 1.0, 8.0, 2.45, { max: 30, min: 15, color: 'FFFFFF' });
        if (d.caption) { t.rect(s, 1.5, 3.55, 8.0, 0.02, 'FFFFFF', { name: 'Rule' }); bd(s, d.caption, 1.5, 3.65, 8.0, 1.5, { color: 'FFFFFF', max: 13 }); }
        k.foot(s, { x: LX, y: 5.3, w: 9.3, size: 7.5, color: 'E0E7FF' });
      },
      async (d) => { // the today line stands left of centre: the note before it, the sentence after it
        const s = pg(d), lx = 3.3; period(s, LX, 0.92, 9.3, 4.28, 9); heads(s, LX, 0.92, 9.3, 9);
        t.line(s, lx, 0.86, 0, 4.34, C.today, 2, { dash: 'dash' }); t.oval(s, lx - 0.08, 0.8, 0.16, 0.16, C.today);
        t.rect(s, lx + 0.15, 1.42, 9.65 - lx - 0.15, 3.2, tint[3], { r: 0.1, name: 'Bar' });
        k.head(s, L.runs(d.text), lx + 0.4, 1.5, 5.7, 3.04, { max: 28, min: 15, color: C.ink });
        if (d.caption) { t.rect(s, LX, 1.42, lx - LX - 0.15, 3.72, 'FFFFFF', { name: 'Back' }); bd(s, d.caption, LX + 0.05, 1.42, lx - LX - 0.25, 3.72, { color: C.muted, max: 12.5, valign: 'middle' }); }
      },
    ],
    timeline: [
      async (d) => { // each period has its column; a bar falls in it, stepping lower, with its words below
        const s = pg(d), w = 9.3 / 4; period(s, LX, 0.92, 9.3, 4.28, 4);
        t.rect(s, LX, 0.92, 9.3, 0.36, C.head, { name: 'Header' });
        for (const [i, it] of d.items.entries()) {
          const x = LX + i * w, y = 1.38 + i * 0.3;
          k.head(s, it.year, x + 0.05, 0.92, w - 0.1, 0.36, { max: 13, min: 10, color: C.pal[i % 6], align: 'center' });
          t.rect(s, x + 0.05, y, w - 0.1, 0.46, C.pal[i % 6], { r: 0.07, name: 'Bar' });
          hd(s, it.h, x + 0.14, y, w - 0.28, 0.46, { color: 'FFFFFF', max: 13.5, min: 10 });
          bd(s, it.t, x + 0.12, y + 0.54, w - 0.24, 5.16 - y - 0.54, { max: 12.5 });
        }
      },
      async (d) => { // dark mode: the plan's red line runs through the middle, events above and below it by turns
        const s = pg(d, { night: true }), ya = 3.0, stepx = 2.05, w = 3.1;
        t.line(s, 0, ya, 10, 0, C.today, 2);
        for (const [i, it] of d.items.entries()) {
          const x = LX + i * stepx, up = i % 2 === 0, c = light[i % 6];
          diamond(s, x, ya - 0.14, 0.28, c);
          k.head(s, it.year, x + 0.32, up ? ya - 0.36 : ya + 0.05, 1.7, 0.31, { max: 13, min: 10, color: c });
          if (up) { hd(s, it.h, x, 0.9, w, 0.36, { color: 'FFFFFF', max: 14 }); bd(s, it.t, x, 1.26, w, ya - 0.4 - 1.26, { color: 'FFFFFF', max: 12 }); }
          else { hd(s, it.h, x, ya + 0.38, w, 0.36, { color: 'FFFFFF', max: 14 }); bd(s, it.t, x, ya + 0.74, w, 5.18 - ya - 0.74, { color: 'FFFFFF', max: 12 }); }
        }
      },
      async (d) => { // the plan turned upright: the time axis runs down the centre, events by turns on its sides
        const s = pg(d), cx = 5, top = 1.0, rh = (5.18 - top) / 4, w = 4.0;
        t.line(s, cx, 0.92, 0, 4.28, C.today, 1.5, { dash: 'dash' });
        for (const [i, it] of d.items.entries()) {
          const y = top + i * rh, left = i % 2 === 0, x = left ? cx - 0.72 - w : cx + 0.72, a = left ? 'right' : 'left', c = C.pal[i % 6], hh = Math.min(rh * 1.5, 5.18 - y);
          t.rect(s, cx - 0.6, y + 0.02, 1.2, 0.38, c, { r: 0.08, name: 'Bar' });
          k.head(s, it.year, cx - 0.57, y + 0.02, 1.14, 0.38, { max: 12, min: 8.5, color: 'FFFFFF', align: 'center', ls: 1 });
          hd(s, it.h, x, y, w, 0.38, { align: a, color: c });
          bd(s, it.t, x, y + 0.4, w, hh - 0.42, { align: a, max: 12.5 });
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Gant', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '374151', lt2: C.head, accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[4], accent6: C.pal[5], hlink: C.pal[0], folHlink: C.muted } });
}
module.exports = { id: 126, slug: 'gant', name: 'Gant', category: 'business', photos: true, build, style: { tone: "loyiha rejasi tili: ish, muddat, bosqich va natija; qisqa, amaliy", limits: { card_t4: 100, card_t3: 120, step_t: 100, event_t: 100 }, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical"], "transitions": ["wipe:r", "p14:conveyor|dir=\"l\"", "fade"], "cover": ["sweepIn", "wipe:r"], "mark": "popIn", "deco": "stretch", "sig": {"title": "wipe:r", "body": "fade", "item": "stretch", "image": "wipe:r", "number": "popIn", "order": "cascade", "stagger": 0.1}, "tempo": 0.9, "kenburns": false};
