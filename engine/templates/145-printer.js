/** 145 Printer — continuous-form DOT-MATRIX paper: tractor-feed holes down both edges, pale green bars, perforations; everything printed in monospace as a report table. */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FBFBF6', bar: 'DDEFD9', ink: '2B2B2B', muted: '5A5A5A', hole: 'D9D9D2', accent: '1B5E20' };
const F = { head: 'Courier New', body: 'Courier New' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const paper = (s) => { for (let y = 0; y < 5.625; y += 0.72) t.rect(s, 0.6, y + 0.36, 8.8, 0.36, C.bar, { name: 'Green bar' }); for (let y = 0.15; y < 5.6; y += 0.25) { t.oval(s, 0.18, y, 0.14, 0.14, C.hole); t.oval(s, 9.68, y, 0.14, 0.14, C.hole); } t.line(s, 0.5, 0, 0, 5.625, 'C8C8C0', 0.75, { dash: 'dash' }); t.line(s, 9.5, 0, 0, 5.625, 'C8C8C0', 0.75, { dash: 'dash' }); };
  const page = (d) => { const s = k.slide(C.paper); paper(s); k.txt(s, `${(k.M.org || 'SLIDEAI').toUpperCase().slice(0, 30)}   REPORT ${k.M.year || ''}`, 0.75, 0.12, 6.0, 0.25, { size: 9, color: C.muted }); k.txt(s, `PAGE ${String(k.idx).padStart(3, '0')}`, 7.6, 0.12, 1.7, 0.25, { size: 9, color: C.muted, align: 'right' }); if (d.title) k.head(s, d.title.toUpperCase(), 0.75, 0.4, 8.5, 0.55, { max: 20, min: 11 }); k.txt(s, '='.repeat(70), 0.75, 0.95, 8.5, 0.2, { size: 9, color: C.ink }); k.foot(s, { x: 0.75, y: 5.32, w: 8.5, size: 7.5, font: F.body }); return s; };
  const X = 0.75, W = 8.5, Y = 1.2, Hc = 3.95;
  // report table: columns with '|' separators and a header line
  const table = (s, n, cols, draw) => { let x = X; cols.forEach(([wd], c) => { if (c) t.line(s, x, Y, 0, Hc, C.ink, 0.5); x += wd; }); const rh = Hc / n; for (let i = 0; i < n; i++) { const y = Y + i * rh; let cx = X; cols.forEach(([wd], c) => { draw(i, c, cx + 0.08, y, wd - 0.16, rh); cx += wd; }); t.line(s, X, y + rh, W, 0, C.ink, 0.3, { dash: 'sysDot' }); } };
  const R = {
    async cover(d) { const s = k.slide(C.paper); paper(s); k.txt(s, '*'.repeat(60), 0.75, 0.5, 8.5, 0.25, { size: 10 }); k.head(s, d.title.toUpperCase(), 0.75, 0.85, 5.5, 2.3, { max: 28, min: 13, valign: 'top' }); if (d.image) await k.photo(s, d.image, 6.6, 0.85, 2.6, 2.3, { gray: true });
      [[k.TR.author_l, k.M.author], [k.TR.org_l, k.M.org], [k.TR.city_l, k.M.loc], [k.TR.year_l, k.M.year]].forEach(([a, v], i) => k.txt(s, `${String(a).toUpperCase().padEnd(14, '.')} ${v || ''}`, 0.75, 3.35 + i * 0.36, 8.5, 0.34, { size: 12, valign: 'middle' })); k.txt(s, '*'.repeat(60), 0.75, 4.85, 8.5, 0.25, { size: 10 }); k.foot(s, { x: 0.75, y: 5.32, w: 8.5, size: 7.5, font: F.body }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, X, Y, 3.3, Hc, { gray: true }); k.txt(s, d.text, X + 3.55, Y, W - 3.55, Hc, { max: 13, min: 9.5, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); table(s, d.items.length, [[0.8], [7.7]], (i, c, x, y, w, h) => k.txt(s, c ? d.items[i].toUpperCase() : String(i + 1).padStart(2, '0'), x, y, w, h, { max: 15, bold: !!c, valign: 'middle' })); },
    async cards(d) { const s = page(d); table(s, d.items.length, [[0.6], [2.6], [5.3]], (i, c, x, y, w, h) => k.txt(s, [String(i + 1).padStart(2, '0'), d.items[i].h.toUpperCase(), d.items[i].t][c], x, y, w, h, { max: c === 2 ? 12 : 13, bold: c === 1, valign: 'middle' })); },
    async process(d) { const s = page(d); table(s, d.steps.length, [[0.6], [2.6], [5.3]], (i, c, x, y, w, h) => k.txt(s, [String(i + 1).padStart(2, '0'), d.steps[i].h.toUpperCase(), d.steps[i].t][c], x, y, w, h, { max: c === 2 ? 12 : 13, bold: c === 1, valign: 'middle' })); },
    async stats(d) { const s = page(d); const n = d.stats.length + (d.note ? 1 : 0); table(s, n, [[2.6], [5.9]], (i, c, x, y, w, h) => { if (i === d.stats.length) return c ? k.txt(s, d.note, x, y, w, h, { max: 10, valign: 'middle', color: C.muted }) : null; k.txt(s, c ? d.stats[i].label : d.stats[i].value, x, y, w, h, c ? { max: 13, valign: 'middle' } : { max: 34, min: 14, bold: true, align: 'right', valign: 'middle', color: C.accent }); }); },
    async compare(d) { const s = page(d), w = W / 2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.3, F.body, 0.08, Hc - 0.5); t.line(s, X + w, Y, 0, Hc, C.ink, 0.5); [d.left, d.right].forEach((sd, i) => { const x = X + i * w + 0.1; k.txt(s, `[ ${sd.h.toUpperCase()} ]`, x, Y, w - 0.2, 0.4, { max: 13, bold: true }); let y = Y + 0.48; sd.items.forEach((it, j) => { k.txt(s, `${i ? '+' : '-'} ${it}`, x, y, w - 0.25, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); k.txt(s, '>>> ', X, Y + 0.3, 0.8, 0.5, { size: 18, bold: true, color: C.accent }); k.head(s, L.runs(d.text.toUpperCase()), X + 0.8, Y + 0.2, W - 0.8, 2.4, { max: 24, min: 12 }); if (d.caption) k.txt(s, d.caption, X + 0.8, Y + 2.7, W - 0.8, 1.2, { max: 11, color: C.muted }); },
    async timeline(d) { const s = page(d); table(s, d.items.length, [[1.3], [2.4], [4.8]], (i, c, x, y, w, h) => k.txt(s, [d.items[i].year, d.items[i].h.toUpperCase(), d.items[i].t][c], x, y, w, h, { max: c === 2 ? 11 : 13, bold: c < 2, valign: 'middle', color: c === 0 ? C.accent : C.ink })); },
    async quote(d) { const s = page({}); k.head(s, `"${d.text}"`, X + 0.4, Y + 0.3, W - 0.8, 2.6, { max: 22, min: 11, align: 'center' }); if (d.author) k.txt(s, `-- ${d.author.toUpperCase()} --`, X, Y + 3.0, W, 0.45, { size: 12, bold: true, align: 'center' }); },
    async sources(d) { const s = page(d); table(s, d.items.length, [[0.7], [7.8]], (i, c, x, y, w, h) => k.txt(s, c ? d.items[i] : `[${i + 1}]`, x, y, w, h, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all out of the same printer: a deck's pages must not look alike (L.pages)
  const GRN = C.accent, CRT = '0B140E', PH = '8BF29A', PH2 = 'D6FBDB', WH = C.paper;
  const term = (d) => { const s = k.slide(CRT); for (let y = 0.15; y < 5.6; y += 0.25) { t.oval(s, 0.18, y, 0.14, 0.14, '24332A'); t.oval(s, 9.68, y, 0.14, 0.14, '24332A'); } k.txt(s, `$ ${(k.M.org || 'SLIDEAI').toUpperCase().slice(0, 30)} ${k.M.year || ''}`, X, 0.12, 6.0, 0.25, { size: 9, color: PH }); k.txt(s, `PAGE ${String(k.idx).padStart(3, '0')}`, 7.55, 0.12, 1.7, 0.25, { size: 9, color: PH, align: 'right' }); if (d.title) k.head(s, d.title.toUpperCase(), X, 0.4, W, 0.55, { max: 20, min: 11, color: PH2 }); k.txt(s, '-'.repeat(70), X, 0.95, W, 0.2, { size: 9, color: PH }); k.foot(s, { x: X, y: 5.32, w: W, size: 7.5, font: F.body, color: PH }); return s; };
  const box = (s, x, y, w, h, o = {}) => t.rect(s, x, y, w, h, o.fill ?? WH, { line: { color: o.c ?? C.ink, width: o.lw ?? 1, ...(o.dash ? { dashType: o.dash } : {}) }, name: 'Box' });
  const inv = (s, x, y, w, h, str, o = {}) => { t.rect(s, x, y, w, h, o.fill ?? C.ink, { name: 'Inverse' }); k.head(s, str, x + 0.08, y, w - 0.16, h, { max: o.max ?? 13, min: 10, color: o.color ?? WH, align: o.a || 'left' }); };
  const perf = (s, x, y, w) => t.line(s, x, y, w, 0, C.ink, 0.75, { dash: 'dash' });
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 12.5, min: 10, ls: 1.14, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 13, min: 10, ...o });
  const V = {
    image: [
      async (d) => { // a coarse printed plate across the sheet, the words run on beneath it
        const s = page(d);
        box(s, X, Y, W, 2.1);
        await k.photo(s, d.image, X + 0.06, Y + 0.06, W - 0.12, 1.98, { news: true });
        bd(s, d.text, X, Y + 2.16, W, Hc - 2.16, { valign: 'middle' });
      },
      async (d) => { // a tall plate at the right edge, the words set in a narrow column at the left
        const s = page(d), pw = 3.3, px = X + W - pw;
        box(s, px, Y, pw, Hc);
        await k.photo(s, d.image, px + 0.06, Y + 0.06, pw - 0.12, Hc - 0.12, { news: true });
        k.txt(s, '>>>', X, Y, 1.0, 0.3, { size: 12, bold: true, color: GRN });
        bd(s, d.text, X, Y + 0.32, W - pw - 0.2, Hc - 0.32, { valign: 'middle' });
      },
      async (d) => { // the terminal: the picture in coarse green points, the words on the black
        const s = term(d), pw = 3.6, py = Y + 0.3, ph = 3.05;
        await k.photo(s, d.image, X, py, pw, ph, { pixel: 90, duo: ['0B140E', '8BF29A'] });
        t.rect(s, X, py, pw, ph, null, { line: { color: PH, width: 1 }, name: 'Frame' });
        k.txt(s, '$ _', X, Y, 1.0, 0.26, { size: 11, bold: true, color: PH });
        bd(s, d.text, X + pw + 0.25, Y, W - pw - 0.25, Hc, { color: PH2, valign: 'middle' });
      },
      async (d) => { // the picture fills the sheet between the feed holes, a stub of paper torn over its foot
        const s = k.slide(C.paper); for (let y = 0.15; y < 5.6; y += 0.25) { t.oval(s, 0.18, y, 0.14, 0.14, C.hole); t.oval(s, 9.68, y, 0.14, 0.14, C.hole); }
        await k.photo(s, d.image, 0.5, 0, 9.0, 5.625);
        t.rect(s, 0.5, 2.55, 9.0, 3.075, C.paper, { name: 'Stub' }); perf(s, 0.5, 2.55, 9.0);
        k.head(s, (d.title || '').toUpperCase(), X, 2.62, W - 1.8, 0.62, { max: 18, min: 11 });
        k.txt(s, `PAGE ${String(k.idx).padStart(3, '0')}`, 7.55, 2.62, 1.7, 0.3, { size: 9, color: C.muted, align: 'right' });
        bd(s, d.text, X, 3.26, W, 1.98, { valign: 'middle' });
        k.foot(s, { x: X, y: 5.32, w: W, size: 7.5, font: F.body });
      },
    ],
    cards: [
      async (d) => { // boxed columns, each headed in reverse type
        const s = page(d), n = d.items.length, gap = 0.12, w = (W - gap * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const x = X + i * (w + gap);
          box(s, x, Y, w, Hc);
          inv(s, x, Y, w, 0.42, `[${String(i + 1).padStart(2, '0')}]`);
          t.img(s, await k.icon(it.icon, WH, 2), x + w - 0.36, Y + 0.08, 0.26, 0.26);
          hd(s, it.h.toUpperCase(), x + 0.1, Y + 0.48, w - 0.2, 0.62, { valign: 'top', max: 12 });
          bd(s, it.t, x + 0.1, Y + 1.12, w - 0.2, Hc - 1.18, { max: 11.5 });
        }
      },
      async (d) => { // four blocks of a printout, double-ruled above and below
        const s = page(d), n = d.items.length, Wd = 4.15, H = 1.92, pos = n === 4 ? [[X, Y, Wd], [X + 4.35, Y, Wd], [X, Y + 2.02, Wd], [X + 4.35, Y + 2.02, Wd]] : [[X, Y, Wd], [X + 4.35, Y, Wd], [X, Y + 2.02, W]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w] = pos[i];
          t.rect(s, x, y, w, H, WH, { name: 'Block' });
          t.line(s, x, y, w, 0, GRN, 2.5); t.line(s, x, y + 0.05, w, 0, GRN, 0.75); t.line(s, x, y + H, w, 0, GRN, 0.75);
          t.img(s, await k.icon(it.icon, GRN, 2), x + 0.05, y + 0.12, 0.3, 0.3);
          hd(s, it.h.toUpperCase(), x + 0.42, y + 0.1, w - 0.5, 0.34, { max: 12.5, color: GRN });
          bd(s, it.t, x + 0.05, y + 0.48, w - 0.1, H - 0.54, { max: 12 });
        }
      },
      async (d) => { // the terminal: a prompt for each line, output printed on beside it
        const s = term(d), n = d.items.length, rh = Hc / n;
        for (const [i, it] of d.items.entries()) {
          const y = Y + i * rh;
          t.img(s, await k.icon(it.icon, PH, 2), X, y + 0.05, 0.3, 0.3);
          hd(s, `> ${it.h.toUpperCase()}`, X + 0.4, y + 0.03, W - 0.4, 0.34, { color: PH, max: 13 });
          bd(s, it.t, X + 0.4, y + 0.38, W - 0.4, rh - 0.44, { color: PH2, max: 12 });
        }
      },
      async (d) => { // torn sheets hanging at different heights, the perforation still along the top
        const s = page(d), n = d.items.length, gap = 0.14, w = (W - gap * (n - 1)) / n, drop = [0.3, 0, 0.42, 0.14];
        for (const [i, it] of d.items.entries()) {
          const x = X + i * (w + gap), y = Y - 0.05 + drop[i], h = Y + Hc - y;
          t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: 'C8C8C0', width: 0.75 }, shadow: 0.25, blur: 3, offset: 1.5, name: 'Sheet' });
          perf(s, x, y + 0.16, w);
          for (let hx = x + 0.12; hx < x + w - 0.05; hx += 0.25) t.oval(s, hx, y + 0.03, 0.09, 0.09, C.hole);
          t.img(s, await k.icon(it.icon, C.ink, 2), x + 0.1, y + 0.24, 0.3, 0.3);
          hd(s, it.h.toUpperCase(), x + 0.1, y + 0.56, w - 0.2, 0.6, { valign: 'top', max: 12 });
          bd(s, it.t, x + 0.1, y + 1.16, w - 0.2, h - 1.2, { max: 11.5, ls: 1.1 });
        }
      },
    ],
    process: [
      async (d) => { // the job climbs: frames step up the sheet, each number in reverse type
        const s = page(d), n = d.steps.length, w = W / n, rise = n === 4 ? 0.32 : 0.45, y0 = Y + (n - 1) * rise;
        for (const [i, st] of d.steps.entries()) {
          const x = X + i * w, y = y0 - i * rise, h = Y + Hc - y;
          box(s, x, y, w, h, { lw: 1.25 });
          inv(s, x, y, 0.62, 0.42, String(i + 1).padStart(2, '0'), { fill: GRN, a: 'center' });
          hd(s, st.h.toUpperCase(), x + 0.08, y + 0.46, w - 0.16, 0.6, { valign: 'top', max: 12 });
          bd(s, st.t, x + 0.08, y + 1.06, w - 0.16, h - 1.1, { max: 11.5, ls: 1.1 });
        }
      },
      async (d) => { // the tear line down the middle of the sheet, a step on each side of it by turns
        const s = page(d), n = d.steps.length, rh = Hc / n, w = 4.0, cx = 5;
        t.line(s, cx, Y, 0, Hc, C.ink, 1, { dash: 'dash' });
        for (const [i, st] of d.steps.entries()) {
          const y = Y + i * rh, right = i % 2 === 1, x = right ? 5.27 : 0.73, a = right ? 'left' : 'right', c = y + rh / 2;
          t.rect(s, cx - 0.22, c - 0.17, 0.44, 0.34, GRN, { name: 'Tag' });
          k.txt(s, String(i + 1).padStart(2, '0'), cx - 0.22, c - 0.17, 0.44, 0.34, { size: 11, bold: true, color: WH, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h.toUpperCase(), x, y, w, 0.26, { align: a, max: 11.5 });
          bd(s, st.t, x, y + 0.26, w, rh - 0.28, { align: a, max: 11.5, ls: 1.0 });
        }
      },
      async (d) => { // the terminal: columns with a large step number and a blinking block
        const s = term(d), n = d.steps.length, w = W / n;
        for (const [i, st] of d.steps.entries()) {
          const x = X + i * w;
          k.txt(s, `${String(i + 1).padStart(2, '0')}`, x, Y, 1.2, 0.8, { size: 36, bold: true, color: PH, valign: 'middle', ls: 1 });
          t.rect(s, x + 1.08, Y + 0.18, 0.2, 0.44, PH, { name: 'Cursor' });
          hd(s, st.h.toUpperCase(), x, Y + 0.84, w - 0.18, 0.62, { color: PH, valign: 'top', max: 12 });
          bd(s, st.t, x, Y + 1.48, w - 0.18, Hc - 1.52, { color: PH2, max: 12 });
        }
      },
      async (d) => { // a flowchart of the old school: boxes joined by arrows down the sheet, notes beside them
        const s = page(d), n = d.steps.length, rh = Hc / n, bw = 2.65, bh = Math.min(0.68, rh - 0.26);
        for (const [i, st] of d.steps.entries()) {
          const y = Y + i * rh, by = y + 0.04;
          box(s, X, by, bw, bh, { lw: 1.5, fill: 'FFFFFF' });
          hd(s, `${i + 1}. ${st.h.toUpperCase()}`, X + 0.08, by + 0.02, bw - 0.16, bh - 0.04, { max: 11.5 });
          if (i < n - 1) { t.line(s, X + bw / 2, by + bh, 0, rh - bh - 0.02, GRN, 1.5); k.txt(s, 'v', X + bw / 2 - 0.15, by + rh - 0.2, 0.3, 0.18, { size: 10, bold: true, color: GRN, align: 'center', valign: 'middle', ls: 1 }); }
          t.line(s, X + bw, by + bh / 2, 0.22, 0, C.ink, 0.75, { dash: 'sysDot' });
          bd(s, st.t, X + bw + 0.28, y + 0.02, W - bw - 0.28, rh - 0.06, { valign: 'middle', max: 12, ls: 1.08 });
        }
      },
    ],
    stats: [
      async (d) => { // one total in a heavy box, as at the end of a run, two sub-totals beside it
        const s = page(d), [a, ...rest] = d.stats, bw = 4.1;
        box(s, X, Y, bw, Hc, { lw: 3, fill: 'FFFFFF' });
        k.txt(s, '*'.repeat(30), X + 0.12, Y + 0.08, bw - 0.24, 0.24, { size: 10, color: GRN });
        hd(s, a.value, X + 0.15, Y + 0.45, bw - 0.3, 1.25, { max: 48, min: 22, color: GRN });
        bd(s, a.label, X + 0.15, Y + 1.75, bw - 0.3, 1.6, { max: 13 });
        k.txt(s, '*'.repeat(30), X + 0.12, Y + Hc - 0.34, bw - 0.24, 0.24, { size: 10, color: GRN });
        rest.forEach((v, i) => { const x = X + bw + 0.2, y = Y + i * 1.04, w = W - bw - 0.2; hd(s, v.value, x, y, w, 0.5, { max: 22, min: 13 }); bd(s, v.label, x, y + 0.5, w, 0.46, { max: 10.5, ls: 1.02 }); perf(s, x, y + 0.98, w); });
        if (d.note) bd(s, d.note, X + bw + 0.2, Y + 2.12, W - bw - 0.2, Hc - 2.12, { color: C.muted, max: 11 , valign: 'middle' });
      },
      async (d) => { // banner printing: the figures run across the sheet in giant type between lines of stars
        const s = page(d), w = W / 3;
        k.txt(s, '*'.repeat(70), X, Y, W, 0.22, { size: 9, color: GRN });
        for (const [i, v] of d.stats.entries()) {
          const x = X + i * w;
          hd(s, v.value, x, Y + 0.3, w - 0.15, 1.1, { max: 34, min: 16, color: C.ink, align: 'center' });
          bd(s, v.label, x + 0.05, Y + 1.44, w - 0.2, 0.86, { align: 'center', max: 11.5, ls: 1.05 });
        }
        k.txt(s, '*'.repeat(70), X, Y + 2.36, W, 0.22, { size: 9, color: GRN });
        if (d.note) bd(s, d.note, X, Y + 2.62, W, Hc - 2.62, { valign: 'middle', max: 12 });
      },
      async (d) => { // the terminal: name and value printed as an assignment, the comment under them
        const s = term(d);
        for (const [i, v] of d.stats.entries()) {
          const y = Y + i * 0.9;
          k.txt(s, `$${i + 1} =`, X, y, 0.95, 0.82, { size: 14, bold: true, color: PH, valign: 'middle' });
          hd(s, v.value, X + 1.0, y, 3.1, 0.82, { color: PH2, max: 34, min: 16 });
          bd(s, v.label, X + 4.2, y, W - 4.2, 0.82, { color: PH, valign: 'middle', max: 11.5, ls: 1.05 });
        }
        t.line(s, X, Y + 2.74, W, 0, PH, 0.75, { dash: 'dash' });
        if (d.note) bd(s, d.note, X, Y + 2.8, W, Hc - 2.84, { color: PH2, valign: 'middle', max: 12 });
      },
    ],
    compare: [
      async (d) => { // a diff printed face to face: minus lines run to the rule, plus lines away from it
        const s = page(d), cx = 5;
        t.rect(s, cx - 0.04, Y, 0.08, Hc, C.ink, { name: 'Rule' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.18 : X, w = 4.07, a = i ? 'left' : 'right', rh = (Hc - 0.55) / sd.items.length;
          inv(s, x, Y, w, 0.44, sd.h.toUpperCase(), { fill: i ? GRN : C.ink, a });
          sd.items.forEach((it, j) => bd(s, it, x, Y + 0.52 + j * rh, w, rh - 0.04, { align: a, valign: 'middle', max: 12, ls: 1.08 }));
        }
      },
      async (d) => { // two sections of the report, one under the other, a tear line between them
        const s = page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = Y + i * 2.02, h = 1.92, m = sd.items.length, rows = Math.ceil(m / 2), rw = (W - 0.15) / 2, rh = (h - 0.42) / rows;
          k.txt(s, `[ ${sd.h.toUpperCase()} ]`, X, y, W, 0.36, { max: 13, min: 10, bold: true, color: i ? GRN : C.ink, valign: 'middle' });
          sd.items.forEach((it, j) => bd(s, `${i ? '+' : '-'} ${it}`, X + (j % 2) * (rw + 0.15), y + 0.38 + Math.floor(j / 2) * rh, rw, rh, { max: 11.5, ls: 1.05, valign: 'middle' }));
          if (!i) perf(s, 0.5, y + h + 0.05, 9.0);
        }
      },
    ],
    statement: [
      async (d) => { // the terminal: the thought typed large, the cursor waiting after it
        const s = term(d);
        k.head(s, L.runs(d.text.toUpperCase()), X, Y + 0.05, W, 2.5, { max: 26, min: 14, color: PH2 });
        t.rect(s, X, Y + 2.58, 0.28, 0.14, PH, { name: 'Cursor' });
        if (d.caption) bd(s, d.caption, X, Y + 2.78, W, Hc - 2.8, { color: PH, max: 12 });
      },
      async (d) => { // a banner between rows of stars, centred, the notes beneath it
        const s = page(d);
        k.txt(s, '*'.repeat(70), X, Y, W, 0.22, { size: 9, color: GRN }); k.txt(s, '*'.repeat(70), X, Y + 2.5, W, 0.22, { size: 9, color: GRN });
        t.rect(s, X, Y + 0.24, W, 2.24, WH, { name: 'Banner' });
        k.head(s, L.runs(d.text), X + 0.1, Y + 0.26, W - 0.2, 2.2, { max: 25, min: 13, align: 'center' });
        if (d.caption) bd(s, d.caption, X, Y + 2.76, W, Hc - 2.78, { align: 'center', max: 12, valign: 'middle', color: C.muted });
      },
    ],
    timeline: [
      async (d) => { // a line of dashes across the sheet with a mark for each year, entries above and below by turns
        const s = page(d), ax = Y + Hc / 2, xs = [X, X + 2.0, X + 4.1, X + 5.75];
        k.txt(s, '-'.repeat(70), X, ax - 0.11, W, 0.22, { size: 9, bold: true, valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, y = up ? Y : ax + 0.14, h = Hc / 2 - 0.16;
          k.txt(s, '+', x, ax - 0.14, 0.2, 0.28, { size: 13, bold: true, color: GRN, valign: 'middle' });
          hd(s, `${it.year} ${it.h.toUpperCase()}`, x, y, [3.9, 3.9, 4.0, 2.75][i], 0.28, { max: 11.5, color: GRN });
          bd(s, it.t, x, y + 0.3, [3.8, 3.6, 3.8, 2.75][i], h - 0.3, { max: 10.5, ls: 1.04 });
        }
      },
      async (d) => { // punched cards side by side: the year at the head, holes along the bottom
        const s = page(d), gap = 0.1, w = (W - gap * 3) / 4;
        for (const [i, it] of d.items.entries()) {
          const x = X + i * (w + gap), cut = 0.18;
          t.img(s, await k.svg('card', `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="395"><polygon points="${cut * 100},1 199,1 199,394 1,394 1,${cut * 100}" fill="#F3E6C4" stroke="#${C.ink}" stroke-width="2"/></svg>`, 200, 395), x, Y, w, Hc);
          hd(s, it.year, x + 0.22, Y + 0.08, w - 0.3, 0.42, { max: 15, min: 10, color: GRN });
          hd(s, it.h.toUpperCase(), x + 0.1, Y + 0.52, w - 0.2, 0.56, { valign: 'top', max: 11.5 });
          bd(s, it.t, x + 0.1, Y + 1.08, w - 0.2, Hc - 1.58, { max: 11, ls: 1.05 });
          for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) if ((c * 3 + r * 5 + i * 7) % 4) t.rect(s, x + 0.12 + c * (w - 0.28) / 8, Y + Hc - 0.42 + r * 0.17, 0.09, 0.12, C.ink, { name: 'Hole' });
        }
      },
      async (d) => { // the terminal: a log, one bracketed time stamp to a line
        const s = term(d), rh = Hc / 4;
        for (const [i, it] of d.items.entries()) {
          const y = Y + i * rh;
          hd(s, `[${it.year}]`, X, y + 0.02, 2.0, 0.3, { color: PH, max: 13 });
          hd(s, it.h.toUpperCase(), X + 2.05, y + 0.02, W - 2.05, 0.3, { color: PH2, max: 12 });
          bd(s, it.t, X + 0.2, y + 0.33, W - 0.2, rh - 0.37, { color: PH2, max: 11.5, ls: 1.05 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old report table was the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Printer', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '3A3A3A', lt2: C.bar, accent1: C.accent, accent2: '2E7D32', accent3: '8D6E63', accent4: '546E7A', accent5: C.muted, accent6: C.hole, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 145, slug: 'printer', name: 'Printer', category: 'business', photos: true, build, style: { tone: "rasmiy hisobot chiqishi: jadvaldagi kabi qisqa qatorlar, aniq raqamlar va kodlar", limits: { title: 45, card_h: 18, step_h: 18 }, prefer: 'data' } };
