/**
 * 136 Poyezd — a train: a locomotive pulls a row of WAGONS along rails; every idea rides in its own wagon
 * (windows on top, wheels below, couplings between); photos look out of a wagon window. Maroon & cream livery.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F3EDE2', ink: '2B1D1A', muted: '6B5A50', car: '7B2D26', car2: '1F4E5F', cream: 'F6E7C8', wheel: '2B2B2B', rail: '8A8178' };
const F = { head: 'Arial', body: 'Calibri' };
const RAIL = 4.95, CAR_TOP = 1.2;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const rails = (s) => { for (let x = 0.1; x < 10; x += 0.35) t.rect(s, x, RAIL + 0.08, 0.2, 0.08, C.rail, { name: 'Sleeper' }); t.line(s, 0, RAIL + 0.07, 10, 0, C.wheel, 2.5); };
  const wagon = (s, x, w, i, top = CAR_TOP) => { const h = RAIL - 0.22 - top; t.rect(s, x, top, w, h, i % 2 ? C.car2 : C.car, { r: 0.08, name: 'Wagon' }); t.rect(s, x, top + 0.12, w, 0.06, C.cream, { name: 'Stripe' }); [x + 0.25, x + w - 0.6].forEach((wx) => { t.oval(s, wx, RAIL - 0.33, 0.35, 0.35, C.wheel); t.oval(s, wx + 0.12, RAIL - 0.21, 0.11, 0.11, C.rail); }); return { x: x + 0.15, y: top + 0.28, w: w - 0.3, h: h - 0.62 }; };
  const loco = (s, x, n) => { t.rect(s, x, 2.3, 1.2, RAIL - 2.52, C.wheel, { r: 0.1, name: 'Locomotive' }); t.rect(s, x + 0.55, 1.75, 0.65, 0.65, C.wheel, { name: 'Cab' }); t.rect(s, x + 0.66, 1.86, 0.43, 0.35, C.cream, { name: 'Cab window' }); t.rect(s, x + 0.1, 1.95, 0.22, 0.4, C.wheel, { name: 'Chimney' }); t.oval(s, x - 0.1, 1.5, 0.5, 0.35, 'D9D2C5'); t.oval(s, x - 0.35, 1.2, 0.45, 0.3, 'E6E0D5'); k.txt(s, String(n), x + 0.05, 2.75, 0.9, 0.7, { size: 24, bold: true, color: C.cream, align: 'center', valign: 'middle' }); [x + 0.1, x + 0.7].forEach((wx) => t.oval(s, wx, RAIL - 0.4, 0.42, 0.42, C.car)); };
  const train = (s, n, draw, top = CAR_TOP) => { loco(s, 0.25, k.idx); const x0 = 1.6, w = (9.75 - x0) / n; for (let i = 0; i < n; i++) { const x = x0 + i * w; t.line(s, x - 0.08, RAIL - 0.45, 0.12, 0, C.wheel, 3); draw(i, wagon(s, x + 0.04, w - 0.08, i, top)); } };
  const page = (d) => { const s = k.slide(C.bg); rails(s); if (d.title) k.head(s, d.title, 0.4, 0.25, 8.8, 0.8, { max: 26, min: 14 }); k.foot(s, { y: 5.32, size: 7.5 }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); rails(s); loco(s, 0.4, ''); const b = wagon(s, 1.75, 4.6, 0, 2.2); k.head(s, d.title, b.x, b.y, b.w, b.h, { max: 26, min: 13, color: C.cream }); if (d.image) { const b2 = wagon(s, 6.45, 3.3, 1, 2.2); await k.photo(s, d.image, b2.x + 0.1, b2.y + 0.05, b2.w - 0.2, b2.h - 0.1, { mask: { r: 0.1 } }); }
      k.txt(s, k.org3, 0.4, 0.4, 9.0, 0.35, { size: 12, bold: true, color: C.car }); k.txt(s, [k.M.author, d.subtitle].filter(Boolean).join('  \u2014  '), 0.4, 0.8, 9.2, 0.9, { max: 15, bold: true, valign: 'top' }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); train(s, 2, async () => {}); const w = (9.75 - 1.6) / 2; await k.photo(s, d.image, 1.6 + 0.25, CAR_TOP + 0.35, w - 0.5, RAIL - CAR_TOP - 1.05, { mask: { r: 0.12 } }); k.txt(s, d.text, 1.6 + w + 0.25, CAR_TOP + 0.3, w - 0.5, RAIL - CAR_TOP - 1.0, { max: 14, min: 9.5, color: C.cream, ls: 1.25, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); train(s, d.items.length, (i, b) => { k.txt(s, String(i + 1), b.x, b.y, b.w, 0.55, { size: 22, bold: true, color: C.cream, align: 'center' }); k.head(s, d.items[i], b.x, b.y + 0.6, b.w, b.h - 0.6, { max: 14, min: 9, color: 'FFFFFF', align: 'center', valign: 'top' }); }); },
    async cards(d) { const s = page(d); train(s, d.items.length, (i, b) => { k.head(s, d.items[i].h, b.x, b.y, b.w, 0.5, { max: 14, color: C.cream, align: 'center' }); k.txt(s, d.items[i].t, b.x, b.y + 0.52, b.w, b.h - 0.52, { max: 12, color: 'FFFFFF', align: 'center' }); }); },
    async process(d) { const s = page(d); train(s, d.steps.length, (i, b) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, b.x, b.y, b.w, 0.5, { max: 14, color: C.cream, align: 'center' }); k.txt(s, d.steps[i].t, b.x, b.y + 0.52, b.w, b.h - 0.52, { max: 12, color: 'FFFFFF', align: 'center' }); }); },
    async stats(d) { const s = page(d); train(s, d.stats.length, (i, b) => { k.head(s, d.stats[i].value, b.x, b.y, b.w, 1.0, { max: 40, min: 16, color: C.cream, align: 'center' }); k.txt(s, d.stats[i].label, b.x, b.y + 1.05, b.w, b.h - 1.05, { max: 12, color: 'FFFFFF', align: 'center' }); }); if (d.note) k.txt(s, d.note, 0.4, 0.95, 9.2, 0.25, { size: 8, color: C.muted }); },
    async compare(d) { const s = page(d); const w = (9.75 - 1.6) / 2 - 0.3, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.1, F.body, 0.08, RAIL - CAR_TOP - 1.25); train(s, 2, (i, b) => { const sd = i ? d.right : d.left; k.head(s, sd.h, b.x, b.y, b.w, 0.45, { max: 15, color: C.cream, align: 'center' }); let y = b.y + 0.5; sd.items.forEach((it, j) => { k.txt(s, it, b.x + 0.05, y, b.w - 0.1, rr[j], { size: fs, color: 'FFFFFF' }); y += rr[j]; }); }); void w; },
    async statement(d) { const s = page(d); train(s, 1, (i, b) => { k.head(s, L.runs(d.text), b.x + 0.2, b.y, b.w - 0.4, b.h * 0.65, { max: 28, min: 14, color: C.cream, align: 'center' }); if (d.caption) k.txt(s, d.caption, b.x + 0.2, b.y + b.h * 0.67, b.w - 0.4, b.h * 0.33, { max: 12, color: 'FFFFFF', align: 'center' }); }); },
    async timeline(d) { const s = page(d); train(s, d.items.length, (i, b) => { k.head(s, d.items[i].year, b.x, b.y, b.w, 0.5, { max: 20, min: 11, color: C.cream, align: 'center' }); k.head(s, d.items[i].h, b.x, b.y + 0.52, b.w, 0.42, { max: 13, color: 'FFFFFF', align: 'center' }); k.txt(s, d.items[i].t, b.x, b.y + 0.96, b.w, b.h - 0.96, { max: 11, color: 'F0E6D6', align: 'center' }); }); },
    async quote(d) { const s = page({}); train(s, 1, (i, b) => { k.head(s, `\u201C${d.text}\u201D`, b.x + 0.2, b.y, b.w - 0.4, b.h - 0.5, { max: 26, min: 13, italic: true, color: C.cream, align: 'center' }); if (d.author) k.txt(s, d.author, b.x, b.y + b.h - 0.45, b.w, 0.4, { size: 13, bold: true, color: 'FFFFFF', align: 'center' }); }); },
    async sources(d) { const s = page(d); train(s, 1, (i, b) => { const n = d.items.length, rh = b.h / n; d.items.forEach((it, j) => k.txt(s, `${j + 1}. ${it}`, b.x + 0.1, b.y + j * rh, b.w - 0.2, rh, { max: 12, color: 'FFFFFF', valign: 'middle' })); }); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all along the same line: a deck's pages must not look alike (L.pages)
  const NIGHT = '14222B', BOARD = '101417', AMBER = 'FFB703', FOG = 'CFD8DC', LAMP = 'FFE29A';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const track = (s, y, x0 = 0, x1 = 10, col = C.wheel, slp = C.rail) => { for (let x = x0 + 0.1; x < x1 - 0.1; x += 0.35) t.rect(s, x, y + 0.02, 0.2, 0.08, slp, { name: 'Sleeper' }); t.line(s, x0, y, x1 - x0, 0, col, 2.5); };
  const wheel = (s, x, y, dd, c = C.wheel, hub = C.rail) => { t.oval(s, x, y, dd, dd, c); t.oval(s, x + dd * 0.34, y + dd * 0.34, dd * 0.32, dd * 0.32, hub); };
  const bogie = (s, x, w, y, dd = 0.28) => { [x + 0.2, x + w - 0.2 - dd].forEach((wx) => wheel(s, wx, y, dd)); };
  const badge = (s, x = 8.95, y = 0.26, f = C.car, ink = C.cream) => { t.oval(s, x, y, 0.65, 0.65, f); k.txt(s, String(k.idx), x, y, 0.65, 0.65, { size: 15, bold: true, font: F.head, color: ink, align: 'center', valign: 'middle', ls: 1 }); };
  const pg = (d, o = {}) => { const n = !!o.night, s = k.slide(n ? NIGHT : C.bg), tb = o.title || {}; if (d.title) k.head(s, d.title, tb.x ?? 0.4, tb.y ?? 0.22, tb.w ?? 8.3, tb.h ?? 0.72, { max: tb.max ?? 24, min: 14, color: n ? 'FFFFFF' : C.ink }); badge(s, 8.95, 0.25, n ? AMBER : C.car, n ? NIGHT : C.cream); k.foot(s, { x: o.fx ?? 0.6, w: o.fw ?? 8.8, y: 5.32, size: 7.5, ...(n ? { color: FOG } : {}) }); return s; };
  const stn = (s, v, x, y, dd, c, ink = C.ink, f = 'FFFFFF') => { t.oval(s, x, y, dd, dd, f, { line: { color: c, width: 3 } }); k.txt(s, String(v), x, y, dd, dd, { size: Math.round(dd * 34), bold: true, font: F.head, color: ink, align: 'center', valign: 'middle', ls: 1 }); };
  const flip = (s, str, x, y, cMax, wMax, col = AMBER) => { const ch = [...String(str)], c = Math.min(cMax, wMax / ch.length); ch.forEach((a, i) => { t.rect(s, x + i * c + 0.015, y, c - 0.03, c * 1.3, '263238', { r: 0.03, name: 'Flap' }); t.line(s, x + i * c + 0.015, y + c * 0.65, c - 0.03, 0, BOARD, 1); k.txt(s, a, x + i * c, y, c, c * 1.3, { size: Math.max(9, Math.round(c * 58)), bold: true, font: F.head, color: col, align: 'center', valign: 'middle', ls: 1 }); }); return c; };
  const V = {
    image: [
      async (d) => { // a long carriage: its row of windows shows one view passing by
        const s = pg(d), y = 1.02, H = 2.08, W0 = 9.36, x = 0.32, wy = y + 0.3, wh = H - 0.54, ww = 8.9;
        t.rect(s, x, y, W0, H, C.car, { r: 0.1, name: 'Carriage' }); t.rect(s, x, y + 0.12, W0, 0.06, C.cream, { name: 'Stripe' });
        let p = ''; const n = 4, a = 1 / n - 0.012, rx = 0.012, ry = rx * ww / wh; for (let i = 0; i < n; i++) { const x0 = i / n + 0.006, x1 = x0 + a; p += `M${x0 + rx},0 L${x1 - rx},0 Q${x1},0 ${x1},${ry} L${x1},${1 - ry} Q${x1},1 ${x1 - rx},1 L${x0 + rx},1 Q${x0},1 ${x0},${1 - ry} L${x0},${ry} Q${x0},0 ${x0 + rx},0 Z `; }
        t.img(s, await L.photo(L.src(d.image), ww, wh, { mask: { path: p } }), x + 0.23, wy, ww, wh, { alt: '' });
        bogie(s, x + 0.6, 8.1, y + H - 0.04); track(s, y + H + 0.26);
        bd(s, d.text, 0.4, y + H + 0.4, 9.2, 5.28 - y - H - 0.4, { max: 12.5, valign: 'middle', ls: 1.06 });
      },
      async (d) => { // the view is the whole page; a station board stands on two posts in front of it
        const s = k.slide(NIGHT), px = 4.5, pw = 5.1;
        await k.photo(s, d.image, 0, 0, 10, 5.27);
        t.rect(s, 0, 5.27, 10, 0.355, NIGHT, { name: 'Band' });
        t.rect(s, px + 0.5, 4.8, 0.12, 0.47, C.wheel, { name: 'Post' }); t.rect(s, px + pw - 0.62, 4.8, 0.12, 0.47, C.wheel, { name: 'Post' });
        t.rect(s, px, 0.32, pw, 4.5, C.car2, { r: 0.08, line: { color: C.cream, width: 2.5 }, shadow: 0.3, name: 'Board' });
        k.head(s, d.title || '', px + 0.22, 0.42, pw - 1.2, 0.94, { max: 20, min: 13, color: C.cream });
        k.txt(s, String(k.idx), px + pw - 0.9, 0.44, 0.7, 0.5, { size: 16, bold: true, font: F.head, color: LAMP, align: 'right', valign: 'middle' });
        t.line(s, px + 0.22, 1.42, pw - 0.44, 0, C.cream, 1);
        bd(s, d.text, px + 0.22, 1.5, pw - 0.44, 3.24, { color: 'FFFFFF', max: 13 });
        k.foot(s, { y: 5.35, size: 7.5, color: FOG });
      },
      async (d) => { // night: rails run to a tunnel's mouth, and the picture is the daylight at its far end
        const s = pg(d, { night: true, title: { w: 4.6, h: 0.98 }, fw: 4.6, fx: 0.4 }), W0 = 3.6, H0 = 3.5, x = 5.5, y = 0.45;
        t.img(s, await k.svg('mouth', `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><path d="M0,500 L0,240 A250,240 0 0 1 500,240 L500,500 Z" fill="#${C.rail}"/><path d="M38,500 L38,240 A212,204 0 0 1 462,240 L462,500 Z" fill="#000"/></svg>`, 500, 500), x - 0.65, y - 0.42, W0 + 1.3, 4.85);
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: { path: `M0,1 L0,0.5 A0.5,0.5 0 0 1 1,0.5 L1,1 Z` } }), x, y, W0, H0, { alt: '' });
        t.img(s, await k.svg('rails', `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="130"><polygon points="170,0 330,0 500,130 0,130" fill="#2B2B2B"/><line x1="200" y1="0" x2="70" y2="130" stroke="#${LAMP}" stroke-width="4"/><line x1="300" y1="0" x2="430" y2="130" stroke="#${LAMP}" stroke-width="4"/></svg>`, 500, 130), x - 0.65, y + H0, W0 + 1.3, 5.625 - y - H0);
        bd(s, d.text, 0.4, 1.3, 4.25, 3.92, { color: 'FFFFFF', max: 13.5, ls: 1.2 });
      },
      async (d) => { // inside the compartment: the whole page is the maroon wall, the picture a round porthole
        const s = k.slide(C.car), D = 4.3, x = 0.5, y = 0.5;
        t.rect(s, 0, 0.14, 10, 0.06, C.cream, { name: 'Stripe' }); t.rect(s, 0, 5.2, 10, 0.06, C.cream, { name: 'Stripe' });
        t.oval(s, x - 0.13, y - 0.13, D + 0.26, D + 0.26, C.cream);
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: 'circle' }), x, y, D, D, { alt: '' });
        k.head(s, d.title || '', 5.3, 0.36, 3.5, 1.08, { max: 20, min: 13, color: C.cream, valign: 'top' });
        k.txt(s, String(k.idx), 8.85, 0.36, 0.75, 0.45, { size: 16, bold: true, font: F.head, color: LAMP, align: 'right', valign: 'middle' });
        bd(s, d.text, 5.3, 1.5, 4.3, 3.62, { color: 'FFFFFF', max: 13.5 });
        k.foot(s, { y: 5.32, size: 7.5, color: C.cream });
      },
    ],
    cards: [
      async (d) => { // the station's departure board: black, amber letters, a line for each idea
        const s = k.slide(BOARD), n = d.items.length, y0 = 1.02, rh = (5.2 - y0) / n;
        k.head(s, d.title || '', 0.4, 0.22, 8.3, 0.7, { max: 24, min: 14, color: AMBER }); badge(s, 8.95, 0.25, AMBER, BOARD); t.line(s, 0.4, 0.97, 9.2, 0, '37474F', 1.5);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          t.rect(s, 0.4, y + 0.04, 0.8, rh - 0.1, '263238', { r: 0.04, name: 'Flap' }); t.img(s, await k.icon(it.icon, AMBER, 2), 0.62, y + rh / 2 - 0.2, 0.36, 0.36);
          hd(s, it.h, 1.38, y + 0.05, 8.2, 0.38, { color: AMBER, max: 15 });
          bd(s, it.t, 1.38, y + 0.43, 8.2, rh - 0.5, { color: 'FFFFFF', max: 13.5, ls: 1.08 });
          if (i < n - 1) t.line(s, 0.4, y + rh - 0.01, 9.2, 0, '37474F', 0.75);
        }
        k.foot(s, { y: 5.32, size: 7.5, color: FOG });
      },
      async (d) => { // containers stacked on one flat wagon: two tiers for four, one long row for three
        const s = pg(d), n = d.items.length, deck = 4.84;
        t.rect(s, 0.3, deck, 9.4, 0.1, C.wheel, { name: 'Flatcar' }); [1.0, 4.4, 8.4].forEach((x) => wheel(s, x, deck + 0.08, 0.2)); track(s, deck + 0.28);
        for (const [i, it] of d.items.entries()) {
          const w = n === 4 ? 4.56 : 3.02, h = n === 4 ? 1.86 : 3.78, x = 0.4 + (n === 4 ? i % 2 : i) * (w + 0.08), y = 1.04 + (n === 4 ? Math.floor(i / 2) : 0) * (h + 0.06), f = (n === 4 ? (i === 1 || i === 2) : i % 2) ? C.car2 : C.car;
          t.rect(s, x, y, w, h, f, { name: 'Container' }); t.rect(s, x, y, w, 0.06, C.cream, { name: 'Rail' });
          for (let g = 0; g < 2; g++) t.rect(s, g ? x + w - 0.1 : x + 0.04, y + 0.08, 0.06, 0.1, C.cream, { name: 'Lock' });
          if (n === 4) { t.img(s, await k.icon(it.icon, C.cream, 2), x + 0.16, y + 0.16, 0.34, 0.34); hd(s, it.h, x + 0.6, y + 0.12, w - 0.72, 0.42, { color: C.cream, max: 14 }); bd(s, it.t, x + 0.16, y + 0.58, w - 0.32, h - 0.64, { color: 'FFFFFF', max: 12.5, ls: 1.08 }); }
          else { t.img(s, await k.icon(it.icon, C.cream, 1.75), x + w / 2 - 0.27, y + 0.22, 0.54, 0.54); hd(s, it.h, x + 0.16, y + 0.84, w - 0.32, 0.54, { color: C.cream, align: 'center' }); bd(s, it.t, x + 0.18, y + 1.4, w - 0.36, h - 1.48, { color: 'FFFFFF', align: 'center', max: 13 }); }
        }
      },
      async (d) => { // a fan of paper tickets at their own heights, the stub with its sign torn along dashes
        const s = pg(d), n = d.items.length, w = 9.2 / n, st = n === 4 ? [0.36, 0, 0.26, 0.08] : [0.3, 0, 0.18];
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.06, ww = w - 0.12, y = 1.04 + st[i], hh = 5.22 - y, c = i % 2 ? C.car2 : C.car;
          t.rect(s, x, y, ww, hh, C.cream, { r: 0.06, shadow: 0.2, blur: 4, offset: 2, name: 'Ticket' });
          t.img(s, await k.icon(it.icon, c, 2), x + ww / 2 - 0.2, y + 0.12, 0.4, 0.4);
          t.line(s, x + 0.06, y + 0.62, ww - 0.12, 0, c, 1, { dash: 'dash' });
          hd(s, it.h, x + 0.1, y + 0.68, ww - 0.2, 0.54, { color: c, align: 'center', max: 14 });
          bd(s, it.t, x + 0.1, y + 1.24, ww - 0.2, hh - 1.3, { color: C.ink, align: 'center', max: 12.5 });
        }
      },
      async (d) => { // a turntable at the depot: tracks radiate from it, one idea stands at the end of each
        const s = pg(d), n = d.items.length, cx = 5, cy = 3.08, D = 1.9, w = 3.2, spots = n === 4 ? [[0, 1.02], [1, 1.02], [0, 3.16], [1, 3.16]] : [[0, 1.02], [1, 2.1], [0, 3.16]], hh = 2.04;
        for (const [side, y] of spots.slice(0, n)) { const ax = side ? 6.4 : 3.6, ay = y + hh / 2 - 0.02; t.line(s, Math.min(ax, cx), Math.min(ay, cy), Math.abs(ax - cx), Math.abs(ay - cy), C.wheel, 3, { flipV: (ax - cx) * (ay - cy) < 0 }); }
        t.oval(s, cx - D / 2, cy - D / 2, D, D, C.rail, { line: { color: C.wheel, width: 3 } }); t.oval(s, cx - D / 2 + 0.2, cy - D / 2 + 0.2, D - 0.4, D - 0.4, C.cream);
        t.rect(s, cx - D / 2 + 0.06, cy - 0.07, D - 0.12, 0.14, C.wheel, { name: 'Bridge' });
        for (const [i, it] of d.items.entries()) {
          const [side, y] = spots[i], x = side ? 6.4 : 0.4, f = i % 2 ? C.car2 : C.car;
          t.rect(s, x, y, w, hh - 0.08, f, { r: 0.08, name: 'Wagon' });
          t.img(s, await k.icon(it.icon, C.cream, 2), x + 0.12, y + 0.1, 0.32, 0.32);
          hd(s, it.h, x + 0.52, y + 0.05, w - 0.62, 0.42, { color: C.cream, max: 13.5 });
          bd(s, it.t, x + 0.14, y + 0.5, w - 0.28, hh - 0.64, { color: 'FFFFFF', max: 12 });
        }
      },
    ],
    process: [
      async (d) => { // a route map: one thick line with stations on it, the words hang under each stop
        const s = pg(d), n = d.steps.length, w = 9.2 / n, ya = 1.42, dd = 0.56;
        t.line(s, 0, ya, 10, 0, C.car, 7);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w;
          stn(s, i + 1, x, ya - dd / 2, dd, C.car);
          hd(s, st.h, x, ya + 0.38, w - 0.16, 0.56, { valign: 'top', color: C.car2, max: 14 });
          bd(s, st.t, x, ya + 0.96, w - 0.16, 5.22 - ya - 0.96, { max: 13.5 });
        }
      },
      async (d) => { // a signal mast stands in a panel at the left, one lamp per step, the instructions beside it
        const s = k.slide(C.bg), n = d.steps.length, y0 = 0.34, rh = (5.22 - y0) / n, PW = 3.1, lamps = ['C1121F', AMBER, '2E7D32', '2E7D32'];
        t.rect(s, 0, 0, PW, 5.625, C.car2, { name: 'Panel' });
        k.head(s, d.title || '', 0.35, 0.3, PW - 0.65, 2.3, { max: 24, min: 14, color: C.cream, valign: 'top' });
        k.txt(s, String(k.idx), 0.35, 4.78, 1.0, 0.45, { size: 18, bold: true, font: F.head, color: LAMP, valign: 'middle' });
        t.rect(s, PW + 0.32, 0, 0.1, 5.625, C.wheel, { name: 'Mast' });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh;
          t.rect(s, PW + 0.1, y, 0.54, 0.54, C.wheel, { r: 0.08, name: 'Head' });
          t.oval(s, PW + 0.17, y + 0.07, 0.4, 0.4, lamps[Math.min(i, 3)]);
          k.txt(s, String(i + 1), PW + 0.17, y + 0.07, 0.4, 0.4, { size: 14, bold: true, font: F.head, color: i === 1 ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' });
          hd(s, st.h, PW + 0.84, y, 5.75, 0.4, { color: C.car, max: 15 });
          bd(s, st.t, PW + 0.84, y + 0.42, 5.75, rh - 0.48, { max: 13.5 });
        }
        k.foot(s, { x: PW + 0.84, y: 5.32, w: 5.75, size: 7.5 });
      },
      async (d) => { // a switchback: the line runs right along the upper row, turns, and runs back along the lower
        const s = pg(d), n = d.steps.length, per = Math.ceil(n / 2), rows = [1.04, 3.12], w = 4.5, xs = (r, j) => (r ? 5.1 - j * 4.7 : 0.4 + j * 4.7), P = 100, top = rows[0] + 0.24, low = rows[1] + 0.24, end = n === 3 ? 534 : 64;
        t.img(s, await k.svg(`switch${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563"><path d="M64,${top * P} L925,${top * P} A55,${(low - top) * P / 2} 0 0 1 925,${low * P} L${end},${low * P}" fill="none" stroke="#${C.car2}" stroke-width="7"/></svg>`, 1000, 563), 0, 0, 10, 5.625);
        for (const [i, st] of d.steps.entries()) {
          const r = i < per ? 0 : 1, j = r ? i - per : i, x = xs(r, j), y = rows[r], c = i % 2 ? C.car2 : C.car;
          stn(s, i + 1, x, y, 0.48, c);
          hd(s, st.h, x, y + 0.54, w - 0.46, 0.36, { color: c, max: 14 });
          bd(s, st.t, x, y + 0.92, w - 0.46, 1.14, { max: 12.5, ls: 1.08 });
        }
      },
      async (d) => { // night: the track runs straight down the page, sleepers and all, steps by turns on either side
        const s = pg(d, { night: true }), n = d.steps.length, cx = 5, y0 = 1.04, rh = (5.14 - y0) / n, w = 4.1;
        for (let y = 1.0; y < 5.26; y += 0.2) t.rect(s, cx - 0.3, y, 0.6, 0.07, '6B7A82', { name: 'Sleeper' });
        t.line(s, cx - 0.17, 0.96, 0, 4.3, FOG, 2); t.line(s, cx + 0.17, 0.96, 0, 4.3, FOG, 2);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? cx - 0.48 - w : cx + 0.48, a = left ? 'right' : 'left', hh = Math.min(rh * 1.7, 5.22 - y);
          t.oval(s, cx - 0.22, y, 0.44, 0.44, AMBER); k.txt(s, String(i + 1), cx - 0.22, y, 0.44, 0.44, { size: 15, bold: true, font: F.head, color: NIGHT, align: 'center', valign: 'middle' });
          hd(s, st.h, x, y, w, 0.38, { color: AMBER, align: a });
          bd(s, st.t, x, y + 0.4, w, hh - 0.42, { color: 'FFFFFF', align: a, max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // three great driving wheels joined by a coupling rod, a figure on each hub
        const s = pg(d), w = 9.2 / 3, D = 2.16, y = 1.0, cy = y + D / 2, rail = y + D + 0.02;
        for (const [i, v] of d.stats.entries()) {
          const c = 0.4 + i * w + w / 2;
          t.oval(s, c - D / 2, y, D, D, C.wheel); t.oval(s, c - D / 2 + 0.16, y + 0.16, D - 0.32, D - 0.32, C.cream);
          k.head(s, v.value, c - D / 2 + 0.22, cy - 0.42, D - 0.44, 0.84, { max: 28, min: 14, color: i === 1 ? C.car2 : C.car, align: 'center', ls: 1 });
          bd(s, v.label, c - w / 2 + 0.14, rail + 0.2, w - 0.28, 0.66, { align: 'center', max: 13 });
        }
        track(s, rail);
        if (d.note) bd(s, d.note, 0.4, 4.12, 9.2, 1.1, { color: C.muted, align: 'center', max: 13, valign: 'middle' });
      },
      async (d) => { // the board again: the lead figure on big flaps, two lesser lines under it
        const s = k.slide(BOARD), [a, ...rest] = d.stats;
        k.head(s, d.title || '', 0.4, 0.22, 8.3, 0.7, { max: 24, min: 14, color: AMBER }); badge(s, 8.95, 0.25, AMBER, BOARD);
        const c = flip(s, a.value, 0.4, 1.06, 0.74, 5.6), xl = 0.4 + [...String(a.value)].length * c + 0.25;
        bd(s, a.label, xl, 1.06, 9.6 - xl, c * 1.3, { color: 'FFFFFF', max: 15, valign: 'middle' });
        for (const [i, v] of rest.entries()) {
          const x = 0.4 + i * 4.7;
          flip(s, v.value, x, 2.26, 0.36, 3.2);
          bd(s, v.label, x, 2.8, 4.4, 0.72, { color: FOG, max: 13 });
        }
        if (d.note) { t.line(s, 0.4, 3.6, 9.2, 0, '37474F', 1); bd(s, d.note, 0.4, 3.68, 9.2, 1.5, { color: FOG, italic: true, max: 13, valign: 'middle' }); }
        k.foot(s, { y: 5.32, size: 7.5, color: FOG });
      },
      async (d) => { // three station signs on posts along the platform, the words on the boards themselves
        const s = pg(d), w = 9.2 / 3, ground = d.note ? 3.9 : 5.0;
        t.rect(s, 0, ground, 10, 0.08, C.rail, { name: 'Platform' });
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w + 0.07, ww = w - 0.14, y = 1.04, bh = 2.32, f = i === 1 ? C.car : C.car2;
          [x + 0.3, x + ww - 0.4].forEach((px) => t.rect(s, px, y + bh, 0.1, ground - y - bh, C.wheel, { name: 'Post' }));
          t.rect(s, x, y, ww, bh, f, { r: 0.08, line: { color: C.cream, width: 2 }, name: 'Sign' });
          k.head(s, v.value, x + 0.1, y + 0.12, ww - 0.2, 1.0, { max: 38, min: 17, color: C.cream, align: 'center', ls: 1 });
          bd(s, v.label, x + 0.18, y + 1.16, ww - 0.36, bh - 1.24, { color: 'FFFFFF', align: 'center', max: 13 });
        }
        if (d.note) bd(s, d.note, 0.4, 4.06, 9.2, 1.16, { color: C.muted, align: 'center', max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // two trains on two tracks, running opposite ways
        const s = pg(d), H = 1.72, rows = [[d.left, 1.02, C.car, '→'], [d.right, 3.1, C.car2, '←']];
        for (const [sd, y, f, ar] of rows) {
          t.rect(s, 0.25, y, 9.5, H, f, { r: 0.08, name: 'Train' }); bogie(s, 0.6, 8.8, y + H - 0.05, 0.24); track(s, y + H + 0.18);
          k.head(s, `${sd.h}  ${ar}`, 0.42, y + 0.1, 2.05, H - 0.2, { max: 15, min: 11, color: C.cream });
          t.line(s, 2.55, y + 0.14, 0, H - 0.28, C.cream, 1);
          const n = sd.items.length, w = 7.0 / n;
          sd.items.forEach((it, j) => bd(s, it, 2.66 + j * w, y + 0.08, w - 0.14, H - 0.2, { color: 'FFFFFF', max: 12.5, valign: 'middle', ls: 1.06 }));
        }
      },
      async (d) => { // the platform divides the lines: one side's points left of it, the other's right, mirrored
        const s = pg(d), cx = 5, pw = 0.5, w = 4.05, top = 1.72, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.16, 5.22 - top);
        t.rect(s, cx - pw / 2, 1.0, pw, 4.24, C.rail, { name: 'Platform' }); t.rect(s, cx - pw / 2 - 0.04, 1.0, 0.04, 4.24, AMBER, { name: 'Edge' }); t.rect(s, cx + pw / 2, 1.0, 0.04, 4.24, AMBER, { name: 'Edge' });
        t.rect(s, cx - pw / 2 - 0.2 - w, 1.04, w, 0.54, C.car, { r: 0.06, name: 'Sign' }); t.rect(s, cx + pw / 2 + 0.2, 1.04, w, 0.54, C.car2, { r: 0.06, name: 'Sign' });
        hd(s, d.left.h, cx - pw / 2 - 0.1 - w, 1.04, w - 0.2, 0.54, { color: C.cream, align: 'right', max: 16 }); hd(s, d.right.h, cx + pw / 2 + 0.3, 1.04, w - 0.2, 0.54, { color: C.cream, max: 16 });
        const m = Math.max(d.left.items.length, d.right.items.length); let y = top;
        for (let j = 0; j < m; j++) {
          if (d.left.items[j]) k.txt(s, d.left.items[j], cx - pw / 2 - 0.2 - w, y, w, rr[j], { size: fs, align: 'right', ls: 1 });
          if (d.right.items[j]) k.txt(s, d.right.items[j], cx + pw / 2 + 0.2, y, w, rr[j], { size: fs, ls: 1 });
          y += rr[j];
        }
      },
    ],
    statement: [
      async (d) => { // night: the sentence in the dark, a whole train of lit windows crosses along the foot
        const s = pg(d, { night: true }), y = 4.42;
        k.head(s, L.runs(d.text), 0.5, 0.98, 9.0, 1.9, { max: 30, min: 15, color: 'FFFFFF' });
        if (d.caption) bd(s, d.caption, 0.5, 2.92, 9.0, 1.34, { color: LAMP, max: 13 });
        for (let c = 0; c < 4; c++) { const x = 0.15 + c * 2.5; t.rect(s, x, y, 2.4, 0.62, '0A1216', { r: 0.05, name: 'Car' }); for (let w2 = 0; w2 < 6; w2++) t.rect(s, x + 0.12 + w2 * 0.37, y + 0.12, 0.27, 0.26, LAMP, { name: 'Window' }); wheel(s, x + 0.25, y + 0.56, 0.16, '000000', '6B7A82'); wheel(s, x + 2.0, y + 0.56, 0.16, '000000', '6B7A82'); }
        t.line(s, 0, y + 0.74, 10, 0, FOG, 2);
      },
      async (d) => { // one big ticket: the sentence on the main part, the note on the stub, dashes between
        const s = pg(d), x = 0.4, y = 1.04, W0 = 9.2, H0 = 4.14, cut = 6.45;
        t.rect(s, x, y, W0, H0, C.cream, { r: 0.1, shadow: 0.25, blur: 5, offset: 2, line: { color: C.car, width: 1.5 }, name: 'Ticket' });
        t.oval(s, x + cut - 0.13, y - 0.13, 0.26, 0.26, C.bg); t.oval(s, x + cut - 0.13, y + H0 - 0.13, 0.26, 0.26, C.bg);
        t.line(s, x + cut, y + 0.16, 0, H0 - 0.32, C.car, 1.25, { dash: 'dash' });
        k.head(s, L.runs(d.text), x + 0.3, y + 0.2, cut - 0.6, H0 - 0.4, { max: 28, min: 15, color: C.car });
        if (d.caption) bd(s, d.caption, x + cut + 0.2, y + 0.2, W0 - cut - 0.4, H0 - 0.4, { color: C.ink, max: 12.5, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // the rails run across the top, a station sign with its year at each stop, the story below
        const s = pg(d), w = 9.2 / 4, ry = 1.66;
        track(s, ry);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w;
          t.rect(s, x + 0.3, ry - 0.2, 0.08, 0.2, C.wheel, { name: 'Post' });
          t.rect(s, x, ry - 0.66, w - 0.14, 0.48, i % 2 ? C.car2 : C.car, { r: 0.05, name: 'Sign' });
          k.head(s, it.year, x + 0.04, ry - 0.66, w - 0.22, 0.48, { max: 16, min: 10, color: C.cream, align: 'center', ls: 1 });
          hd(s, it.h, x + 0.02, ry + 0.2, w - 0.18, 0.4, { color: C.car, max: 14 });
          bd(s, it.t, x + 0.02, ry + 0.62, w - 0.18, 5.22 - ry - 0.62, { max: 13.5 });
        }
      },
      async (d) => { // night: one track through the middle, each year a lamp on it, events above and below by turns
        const s = pg(d, { night: true }), ya = 3.0, w = 4.35;
        track(s, ya, 0, 10, FOG, '6B7A82');
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.45 + i * 2.28, x = 0.4 + Math.floor(i / 2) * 4.75;
          t.oval(s, xn, ya - 0.1, 0.2, 0.2, AMBER);
          k.head(s, it.year, xn + 0.24, up ? ya - 0.38 : ya + 0.12, 1.9, 0.32, { max: 14, min: 10, color: AMBER });
          if (up) { hd(s, it.h, x, 0.96, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, 1.32, w, ya - 0.44 - 1.32, { color: FOG, max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.48, w, 0.36, { color: 'FFFFFF' }); bd(s, it.t, x, ya + 0.84, w, 5.22 - ya - 0.84, { color: FOG, max: 12.5 }); }
        }
      },
      async (d) => { // a paper timetable: ruled rows, the year in red at the right of each line, as the hour is
        const s = pg(d), y0 = 1.02, rh = (5.2 - y0) / 4, cx = 7.55;
        t.rect(s, 0.4, y0, 9.2, 4.18, C.cream, { line: { color: C.car, width: 1.5 }, name: 'Timetable' });
        t.line(s, cx, y0, 0, 4.18, C.car, 1);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh;
          if (i) t.line(s, 0.4, y, 9.2, 0, C.car, 0.75);
          k.head(s, it.year, cx + 0.1, y, 9.6 - cx - 0.2, rh, { max: 19, min: 11, color: C.car, align: 'center', ls: 1 });
          hd(s, it.h, 0.56, y + 0.05, cx - 0.76, 0.34);
          bd(s, it.t, 0.56, y + 0.39, cx - 0.76, rh - 0.44, { max: 12.5, ls: 1.06 });
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Poyezd', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.car, lt2: C.bg, accent1: C.car, accent2: C.car2, accent3: C.cream, accent4: 'C08552', accent5: C.muted, accent6: C.rail, hlink: C.car2, folHlink: C.muted } });
}
module.exports = { id: 136, slug: 'poyezd', name: 'Poyezd', category: 'creative', photos: true, build, style: { tone: "harakat va ketma-ketlik: har bir band keyingisini tortadi; aniq, qisqa, dinamik", limits: { card_t4: 100, card_t3: 120, step_t: 100, event_t: 90 }, prefer: null } };
