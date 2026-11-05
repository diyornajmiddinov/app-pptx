/** 150 Fotolaboratoriya — a DARKROOM under red safelight: prints hang from sagging lines with wooden clothespins; ideas are developed on the prints; a masking-tape label carries the title. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '1A0707', glow: '5E1111', print: 'F3EEE6', ink: '1E1A17', muted: '5C534C', pin: 'C49A6C', tape: 'E9DFC4', red: 'FF5A4E' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const room = async () => k.svg('room', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.5" cy="0.1" r="0.9"><stop offset="0" stop-color="#7A1A14"/><stop offset="1" stop-color="#140505"/></radialGradient></defs><rect width="1600" height="900" fill="url(#g)"/></svg>`, 1600, 900, true);
  const wire = (s, y, sag = 0.12) => { t.line(s, 0, y, 5, sag, '2B2B2B', 1.5); t.line(s, 5, y, 5, sag, '2B2B2B', 1.5, { flipV: true }); };
  const yAt = (x, y, sag = 0.12) => y + sag * (1 - Math.abs(x - 5) / 5);
  // a print clipped to the wire at its top edge
  const print = (s, x, w, wy, h, sag) => { const y = yAt(x + w / 2, wy, sag) + 0.05; t.rect(s, x, y, w, h, C.print, { shadow: 0.5, blur: 6, offset: 3, name: 'Print' }); t.rect(s, x + 0.08, y + 0.08, w - 0.16, h - 0.16, null, { line: { color: 'DDD5C8', width: 0.75 }, name: 'Border' }); [x + 0.25, x + w - 0.37].forEach((px) => t.rect(s, px, y - 0.18, 0.12, 0.42, C.pin, { r: 0.03, name: 'Clothespin' })); return { x: x + 0.18, y: y + 0.32, w: w - 0.36, h: h - 0.45 }; };
  const page = async (d) => { const s = k.slide({ data: await room() }); t.oval(s, 9.0, 0.15, 0.5, 0.5, C.red, { name: 'Safelight' }); if (d.title) { t.rect(s, 0.35, 0.18, Math.min(8.2, L.width(d.title, 20, F.head, true) + 0.6), 0.6, C.tape, { rotate: -0.8, name: 'Tape' }); k.head(s, d.title, 0.5, 0.18, 7.9, 0.6, { max: 20, min: 11 }); } k.txt(s, String(k.idx), 9.0, 0.15, 0.5, 0.5, { size: 12, bold: true, color: C.bg, align: 'center', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5, color: 'C9A9A3' }); return s; };
  const hang = (s, n, draw, wy = 1.05, h = 3.95) => { wire(s, wy); const gap = 0.25, w = (9.2 - gap * (n - 1)) / n; for (let i = 0; i < n; i++) { const x = 0.4 + i * (w + gap); draw(i, print(s, x, w, wy, h - 0.12, 0.12)); } };
  const R = {
    async cover(d) { const s = k.slide({ data: await room() }); wire(s, 0.6, 0.15); const a = print(s, 0.5, 5.2, 0.6, 4.4, 0.15); k.txt(s, k.org3, a.x, a.y, a.w, 0.35, { size: 12, bold: true, color: C.muted }); k.head(s, d.title, a.x, a.y + 0.45, a.w, 2.2, { max: 34, min: 16, valign: 'top' }); k.txt(s, d.subtitle || '', a.x, a.y + 2.7, a.w, 0.6, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', a.x, a.y + 3.3, a.w, 0.45, { size: 15, bold: true });
      if (d.image) { const b = print(s, 6.1, 3.4, 0.6, 3.4, 0.15); await k.photo(s, d.image, b.x - 0.08, b.y - 0.1, b.w + 0.16, b.h + 0.1, { gray: true }); } t.oval(s, 9.0, 4.6, 0.5, 0.5, C.red, { name: 'Safelight' }); k.foot(s, { y: 5.32, size: 7.5, color: 'C9A9A3' }); },
    async intro(d) { const s = await page(d); hang(s, 2, () => {}); const w = (9.2 - 0.25) / 2; await k.photo(s, d.image, 0.58, 1.45, w - 0.36, 3.3, { gray: true }); k.txt(s, d.text, 0.4 + w + 0.25 + 0.18, 1.45, w - 0.36, 3.3, { max: 14, min: 9.5, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = await page(d); const n = d.items.length, top = Math.ceil(n / 2); [[0, top, 1.0], [top, n, 3.1]].forEach(([a, b, wy]) => { if (b <= a) return; wire(s, wy); const m = b - a, gap = 0.25, w = (9.2 - gap * (m - 1)) / m; for (let i = a; i < b; i++) { const bx = print(s, 0.4 + (i - a) * (w + gap), w, wy, 1.85, 0.12); k.head(s, `${i + 1}. ${d.items[i]}`, bx.x, bx.y, bx.w, bx.h, { max: 15 }); } }); },
    async cards(d) { const s = await page(d); hang(s, d.items.length, (i, b) => { k.head(s, d.items[i].h, b.x, b.y, b.w, 0.45, { max: 14 }); k.txt(s, d.items[i].t, b.x, b.y + 0.5, b.w, b.h - 0.5, { max: 12, color: C.muted }); }); },
    async process(d) { const s = await page(d); hang(s, d.steps.length, (i, b) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, b.x, b.y, b.w, 0.45, { max: 14 }); k.txt(s, d.steps[i].t, b.x, b.y + 0.5, b.w, b.h - 0.5, { max: 12, color: C.muted }); }); },
    async stats(d) { const s = await page(d); hang(s, d.stats.length, (i, b) => { k.head(s, d.stats[i].value, b.x, b.y, b.w, 1.1, { max: 44, min: 16, align: 'center', color: '8E1B14' }); k.txt(s, d.stats[i].label, b.x, b.y + 1.15, b.w, b.h - 1.15 - (d.note ? 0.45 : 0), { max: 12, align: 'center' }); }); if (d.note) k.txt(s, d.note, 0.6, 4.5, 8.8, 0.45, { max: 8.5, color: C.muted }); },
    async compare(d) { const s = await page(d); const { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, 4.0, F.body, 0.08, 2.9); hang(s, 2, (i, b) => { const sd = i ? d.right : d.left; k.head(s, sd.h, b.x, b.y, b.w, 0.45, { max: 15, color: i ? '1F4E79' : '8E1B14' }); let y = b.y + 0.5; sd.items.forEach((it, j) => { k.txt(s, it, b.x, y, b.w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); wire(s, 1.05); const b = print(s, 1.3, 7.4, 1.05, 3.85, 0.12); k.head(s, L.runs(d.text), b.x + 0.2, b.y, b.w - 0.4, b.h * 0.65, { max: 28, min: 13, align: 'center' }); if (d.caption) k.txt(s, d.caption, b.x + 0.2, b.y + b.h * 0.67, b.w - 0.4, b.h * 0.33, { max: 11, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = await page(d); hang(s, d.items.length, (i, b) => { k.head(s, d.items[i].year, b.x, b.y, b.w, 0.5, { max: 20, min: 11, color: '8E1B14' }); k.head(s, d.items[i].h, b.x, b.y + 0.52, b.w, 0.42, { max: 13 }); k.txt(s, d.items[i].t, b.x, b.y + 0.96, b.w, b.h - 0.96, { max: 11, color: C.muted }); }); },
    async quote(d) { const s = await page({}); wire(s, 1.05); const b = print(s, 1.3, 7.4, 1.05, 3.85, 0.12); k.head(s, `\u201C${d.text}\u201D`, b.x + 0.2, b.y, b.w - 0.4, b.h - 0.5, { max: 26, min: 13, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author, b.x, b.y + b.h - 0.45, b.w, 0.4, { size: 13, bold: true, color: '8E1B14', align: 'center' }); },
    async sources(d) { const s = await page(d); wire(s, 1.05); const b = print(s, 0.8, 8.4, 1.05, 3.9, 0.12); const n = d.items.length, rh = b.h / n; d.items.forEach((it, i) => k.txt(s, `${i + 1}. ${it}`, b.x, b.y + i * rh, b.w, rh, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all inside the darkroom: a deck's pages must not look alike (L.pages)
  const PAPER = C.print, WARM = 'C9A9A3', DEEP = '3A0E0A', BLOOD = '8E1B14', ROOM = '2A0E0C';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const lamp = (s, x, y) => { t.oval(s, x, y, 0.5, 0.5, C.red, { name: 'Safelight' }); k.txt(s, String(k.idx), x, y, 0.5, 0.5, { size: 12, bold: true, color: C.bg, align: 'center', valign: 'middle' }); };
  const tape = (s, title, x, y, w, max = 20) => { const lw = Math.min(w, L.width(title || '', max, F.head, true) + 0.5); t.rect(s, x, y, lw, 0.6, C.tape, { rotate: -0.8, name: 'Tape' }); k.head(s, title || '', x + 0.14, y, w - 0.28, 0.6, { max, min: 10.5 }); };
  // a loose print taped to the wall, not on the wire
  const loose = (s, x, y, w, h, o = {}) => { t.rect(s, x, y, w, h, PAPER, { shadow: 0.5, blur: 6, offset: 3, name: 'Loose print', ...(o.rotate ? { rotate: o.rotate } : {}) }); t.rect(s, x + w / 2 - 0.3, y - 0.09, 0.6, 0.2, C.tape, { rotate: o.rotate ? -o.rotate * 2 : 1.5, name: 'Tape' }); };
  const filmSvg = (w, h, across) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); let o = ''; if (across) for (let x = 12; x < W2 - 8; x += 26) { o += `<rect x="${x}" y="6" width="13" height="11" rx="2" fill="#${C.pin}"/><rect x="${x}" y="${H2 - 17}" width="13" height="11" rx="2" fill="#${C.pin}"/>`; } else for (let y = 12; y < H2 - 8; y += 26) { o += `<rect x="6" y="${y}" width="11" height="13" rx="2" fill="#${C.pin}"/><rect x="${W2 - 17}" y="${y}" width="11" height="13" rx="2" fill="#${C.pin}"/>`; } return `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><rect width="${W2}" height="${H2}" fill="#0D0908"/>${o}</svg>`; };
  const film = async (s, x, y, w, h, across = true) => t.img(s, await k.svg(`film${w}-${h}-${across}`, filmSvg(w, h, across), Math.round(w * 100), Math.round(h * 100)), x, y, w, h);
  const tray = (s, x, y, w, h, liquid = DEEP) => { t.rect(s, x, y, w, h, '0D0908', { r: 0.1, line: { color: '6B5A52', width: 1.5 }, name: 'Tray' }); t.rect(s, x + 0.09, y + 0.09, w - 0.18, h - 0.18, liquid, { r: 0.06, name: 'Liquid' }); };
  const paperPage = (d) => { const s = k.slide(PAPER); tape(s, d.title, 0.35, 0.18, 8.2); lamp(s, 9.0, 0.15); k.foot(s, { y: 5.32, size: 7.5, color: C.muted }); return s; };
  const V = {
    image: [
      async (d) => { // the print under the safelight fills the wall, its words on a dark sleeve at the right
        const s = k.slide(C.bg), x = 5.75;
        await k.photo(s, d.image, 0, 0, 10, 5.625, { duo: ['1A0707', 'FFB3A6'] });
        t.rect(s, x, 0, 10 - x, 5.625, C.bg, { t: 8, name: 'Sleeve' });
        lamp(s, 9.25, 0.15);
        hd(s, d.title || '', x + 0.3, 0.2, 2.95, 1.1, { max: 18, min: 12, color: C.tape, valign: 'top' });
        bd(s, d.text, x + 0.3, 1.35, 3.65, 3.85, { color: PAPER, max: 13, valign: 'middle' });
        k.foot(s, { x: x + 0.3, y: 5.32, w: 3.65, size: 7, color: WARM });
      },
      async (d) => { // one frame twice on a strip of film: the negative beside the positive, the words under it
        const s = await page(d), y = 0.95, h = 2.75, fw = 4.5;
        await film(s, 0, y, 10, h);
        await k.photo(s, d.image, 0.35, y + 0.24, fw, h - 0.48, { duo: [C.print, '1A0707'] });
        await k.photo(s, d.image, 5.15, y + 0.24, fw, h - 0.48);
        bd(s, d.text, 0.5, 3.8, 9.0, 1.42, { color: PAPER, max: 13, valign: 'middle' });
      },
      async (d) => { // the picture comes up in the developing tray, the words on the bench beside it
        const s = await page(d);
        tray(s, 0.35, 1.0, 5.55, 4.15, BLOOD);
        await k.photo(s, d.image, 0.75, 1.35, 4.75, 3.45);
        t.line(s, 3.6, 0.82, 1.5, 0.95, 'D8CFC3', 4); t.line(s, 3.85, 0.82, 1.5, 0.95, 'D8CFC3', 4);
        bd(s, d.text, 6.2, 1.0, 3.4, 4.15, { color: PAPER, max: 13, valign: 'middle' });
      },
      async (d) => { // a round loupe lying over the print, the words on a sheet at the left
        const s = await page(d), dd = 3.5, x = 5.8, y = 1.0;
        loose(s, 0.4, 1.1, 5.0, 4.0);
        bd(s, d.text, 0.65, 1.3, 4.5, 3.62, { color: C.ink, max: 13, valign: 'middle' });
        t.line(s, x + dd - 0.5, y + dd - 0.5, 0.95, 0.95, C.pin, 9);
        t.oval(s, x - 0.09, y - 0.09, dd + 0.18, dd + 0.18, C.pin);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
      },
    ],
    cards: [
      async (d) => { // negatives in their sleeves: a paper tab at the left of each dark row
        const s = await page(d), n = d.items.length, y0 = 1.0, rh = 4.2 / n;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, h = rh - 0.1;
          t.rect(s, 0.4, y, 9.2, h, ROOM, { line: { color: '6B3A32', width: 0.75 }, name: 'Sleeve' });
          t.rect(s, 0.4, y, 0.85, h, C.tape, { name: 'Tab' });
          t.img(s, await k.icon(it.icon, BLOOD, 2), 0.63, y + h / 2 - 0.2, 0.4, 0.4);
          hd(s, it.h, 1.4, y, 2.5, h, { color: C.tape, max: 15, min: 11 });
          bd(s, it.t, 4.0, y + 0.03, 5.45, h - 0.06, { color: PAPER, valign: 'middle', max: 12.5 });
        }
      },
      async (d) => { // prints taped loose on the wall: with three, one large beside two small
        const s = await page(d), n = d.items.length, boxes = n === 4
          ? [[0.4, 1.05, 4.5, 1.95, -0.5], [5.1, 1.2, 4.5, 1.95, 0.5], [0.4, 3.18, 4.5, 1.95, 0.4], [5.1, 3.3, 4.5, 1.85, -0.4]]
          : [[0.4, 1.05, 3.75, 4.1, -0.5], [4.45, 1.05, 5.15, 1.95, 0.4], [4.45, 3.2, 5.15, 1.95, -0.3]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h, r] = boxes[i], tall = h > 3;
          loose(s, x, y, w, h, { rotate: r });
          t.img(s, await k.icon(it.icon, BLOOD, 2), x + 0.2, y + (tall ? 0.35 : 0.2), tall ? 0.7 : 0.36, tall ? 0.7 : 0.36);
          if (tall) { hd(s, it.h, x + 0.2, y + 1.15, w - 0.4, 0.75, { color: C.ink, max: 18, valign: 'top' }); bd(s, it.t, x + 0.2, y + 1.95, w - 0.4, h - 2.1, { color: C.muted, max: 14 }); }
          else { hd(s, it.h, x + 0.65, y + 0.15, w - 0.85, 0.46, { color: C.ink }); bd(s, it.t, x + 0.2, y + 0.65, w - 0.4, h - 0.75, { color: C.muted, max: 12.5 }); }
        }
      },
      async (d) => { // the chemicals on the shelf: a brown bottle for each idea, written on its label
        const s = await page(d), n = d.items.length, gap = 0.2, w = (9.2 - gap * (n - 1)) / n, top = 0.92, H2 = 4.28;
        const bottle = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w * 100)}" height="${H2 * 100}"><rect x="${w * 50 - 26}" y="0" width="52" height="26" rx="4" fill="#111"/><path d="M${w * 50 - 19},26 h38 v18 c0,22 ${w * 50 - 22},18 ${w * 50 - 22},50 V${H2 * 100 - 14} q0,14 -14,14 H17 q-14,0 -14,-14 V94 c0,-32 ${w * 50 - 22},-28 ${w * 50 - 22},-50 Z" fill="#6B3415"/></svg>`;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * (w + gap);
          t.img(s, await k.svg(`bottle${n}`, bottle, Math.round(w * 100), H2 * 100), x, top, w, H2);
          t.rect(s, x + 0.1, top + 1.05, w - 0.2, H2 - 1.2, PAPER, { name: 'Label' });
          t.img(s, await k.icon(it.icon, BLOOD, 2), x + w / 2 - 0.17, top + 1.1, 0.34, 0.34);
          hd(s, it.h, x + 0.17, top + 1.45, w - 0.34, 0.5, { color: C.ink, max: 13, min: 10.5, align: 'center' });
          bd(s, it.t, x + 0.17, top + 1.97, w - 0.34, H2 - 2.17, { color: C.muted, max: 12, align: 'center' });
        }
      },
      async (d) => { // everything gathers round the safelight, its rays run out to each idea
        const s = await page(d), n = d.items.length, cx = 5, cy = n === 4 ? 3.05 : 2.45;
        const spots = n === 4
          ? [[0.45, 1.0, 3.35, 2.0, 'right'], [6.2, 1.0, 3.35, 2.0, 'left'], [0.45, 3.2, 3.35, 1.98, 'right'], [6.2, 3.2, 3.35, 1.98, 'left']]
          : [[0.45, 1.05, 3.35, 2.3, 'right'], [6.2, 1.05, 3.35, 2.3, 'left'], [1.9, 3.5, 6.2, 1.7, 'center']];
        for (const [i, [x, y, w, h]] of spots.entries()) { const ex = i === 2 && n === 3 ? cx : (i % 2 ? x - 0.08 : x + w + 0.08), ey = i === 2 && n === 3 ? y - 0.02 : y + h / 2; const x1 = Math.min(cx, ex), y1 = Math.min(cy, ey), ww = Math.abs(ex - cx), hh = Math.abs(ey - cy); t.line(s, x1, y1, ww || 0.001, hh || 0.001, C.red, 1.25, { dash: 'dash', flipV: (ex - cx) * (ey - cy) < 0 }); }
        t.oval(s, cx - 0.95, cy - 0.95, 1.9, 1.9, BLOOD, { t: 45, name: 'Glow' });
        t.oval(s, cx - 0.55, cy - 0.55, 1.1, 1.1, C.red, { name: 'Safelight' });
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h, a] = spots[i];
          t.img(s, await k.icon(it.icon, C.red, 2), a === 'right' ? x + w - 0.38 : a === 'left' ? x : x + w / 2 - 0.19, y + 0.04, 0.38, 0.38);
          hd(s, it.h, a === 'right' ? x : a === 'left' ? x + 0.46 : x, a === 'center' ? y + 0.44 : y, a === 'center' ? w : w - 0.46, 0.46, { color: C.tape, align: a === 'right' ? 'right' : a });
          bd(s, it.t, x, y + (a === 'center' ? 0.9 : 0.5), w, h - (a === 'center' ? 0.9 : 0.5), { color: PAPER, align: a, max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // the trays in their order, each one lower down the bench
        const s = await page(d), n = d.steps.length, gap = 0.16, w = (9.2 - gap * (n - 1)) / n, drop = n === 4 ? 0.34 : 0.45, y0 = 0.98;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * (w + gap), y = y0 + i * drop, h = 5.18 - y;
          tray(s, x, y, w, h);
          k.txt(s, String(i + 1), x + 0.22, y + 0.16, 0.7, 0.62, { size: 30, bold: true, font: F.head, color: C.red, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.22, y + 0.8, w - 0.42, 0.52, { color: C.tape, max: 14, min: 11, valign: 'top' });
          bd(s, st.t, x + 0.22, y + 1.34, w - 0.42, h - 1.46, { color: PAPER, max: 12.5 });
          if (i < n - 1) k.txt(s, '→', x + w - 0.5, y + 0.22, 0.4, 0.45, { size: 18, bold: true, color: C.tape, align: 'right' });
        }
      },
      async (d) => { // a length of film hangs down the middle, the steps at either side of its frames
        const s = await page(d), n = d.steps.length, y0 = 0.92, H2 = 4.3, rh = H2 / n, fw = 0.86, fx = 5 - fw / 2;
        await film(s, fx, y0, fw, H2, false);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, x = right ? fx + fw + 0.25 : 0.3, w = 4.02, a = right ? 'left' : 'right', fy = y + rh / 2 - 0.26;
          t.rect(s, fx + 0.2, fy, fw - 0.4, 0.52, PAPER, { name: 'Frame' });
          k.txt(s, String(i + 1), fx + 0.2, fy, fw - 0.4, 0.52, { size: 18, bold: true, font: F.head, color: BLOOD, align: 'center', valign: 'middle', ls: 1 });
          t.line(s, right ? fx + fw : x + w, fy + 0.26, 0.25, 0, C.red, 1.25);
          hd(s, st.h, x, y + 0.02, w, 0.34, { color: C.tape, align: a, max: 14 });
          bd(s, st.t, x, y + 0.37, w, rh - 0.39, { color: PAPER, align: a, max: 12.5 });
        }
      },
      async (d) => { // a test strip: the same sheet given longer and longer light, band after band
        const s = await page(d), n = d.steps.length, w = 10 / n, tones = n === 4 ? [PAPER, 'D8C4B0', '7A3B2E', DEEP] : [PAPER, 'D8C4B0', DEEP], y = 0.96, h = 4.24;
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, dark = tones[i] === DEEP || tones[i] === '7A3B2E', ink = dark ? PAPER : C.ink;
          t.rect(s, x, y, w, h, tones[i], { name: 'Exposure' });
          k.txt(s, String(i + 1), x + 0.3, y + 0.2, 1.2, 1.0, { size: 54, bold: true, font: F.head, color: dark ? C.tape : BLOOD, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.3, y + 1.3, w - 0.5, 0.56, { color: ink, max: 15, min: 11, valign: 'top' });
          bd(s, st.t, x + 0.3, y + 1.9, w - 0.5, h - 2.05, { color: ink, max: 13 });
        }
      },
      async (d) => { // the sheet is slid along under the enlarger: each step a print further to the right
        const s = await page(d), n = d.steps.length, y0 = 1.0, rh = 4.2 / n, w = 6.6, dx = 2.6 / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * dx, y = y0 + i * rh, h = rh - 0.12;
          t.rect(s, x, y, w, h, PAPER, { shadow: 0.5, blur: 6, offset: 3, name: 'Sheet' });
          t.rect(s, x, y, 0.72, h, BLOOD, { name: 'Edge' });
          k.txt(s, String(i + 1), x, y, 0.72, h, { size: 22, bold: true, font: F.head, color: PAPER, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.85, y + 0.05, w - 1.0, 0.36, { color: C.ink });
          bd(s, st.t, x + 0.85, y + 0.42, w - 1.0, h - 0.47, { color: C.muted, max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // one figure is printed large, the two others stay in the dark beside it
        const s = await page(d), [a, ...rest] = d.stats;
        wire(s, 1.0);
        const b = print(s, 0.5, 5.1, 1.0, 3.0, 0.12);
        hd(s, a.value, b.x, b.y, b.w, 1.5, { max: 66, min: 24, color: BLOOD, align: 'center' });
        bd(s, a.label, b.x, b.y + 1.52, b.w, b.h - 1.52, { color: C.ink, max: 14, align: 'center' });
        rest.forEach((v, i) => { const y = 1.3 + i * 1.42; hd(s, v.value, 6.05, y, 3.55, 0.75, { max: 36, min: 18, color: C.red }); bd(s, v.label, 6.05, y + 0.76, 3.55, 0.55, { color: PAPER, max: 12.5 }); });
        if (d.note) { t.rect(s, 0.4, 4.32, 9.2, 0.88, C.tape, { rotate: -0.2, name: 'Tape' }); bd(s, d.note, 0.6, 4.35, 8.8, 0.82, { color: C.ink, valign: 'middle', max: 12 }); }
      },
      async (d) => { // three darkroom timers, each figure inside a dial
        const s = await page(d), dd = 2.25, w = 9.2 / 3, ticks = Array.from({ length: 60 }, (_, i) => { const a = i * Math.PI / 30, r0 = i % 5 ? 104 : 94, c = (v) => 120 + v; return `<line x1="${c(Math.sin(a) * r0).toFixed(1)}" y1="${c(-Math.cos(a) * r0).toFixed(1)}" x2="${c(Math.sin(a) * 112).toFixed(1)}" y2="${c(-Math.cos(a) * 112).toFixed(1)}" stroke="#${C.ink}" stroke-width="${i % 5 ? 1.5 : 3}"/>`; }).join('');
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2;
          t.img(s, await k.svg('dial', `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><circle cx="120" cy="120" r="118" fill="#${C.pin}"/><circle cx="120" cy="120" r="114" fill="#${PAPER}"/>${ticks}</svg>`, 240, 240), cx - dd / 2, 1.0, dd, dd);
          hd(s, v.value, cx - 0.82, 1.55, 1.64, 1.15, { max: 30, min: 15, color: BLOOD, align: 'center' });
          bd(s, v.label, x + 0.12, 3.3, w - 0.24, 0.62, { color: PAPER, align: 'center', max: 12.5 });
        }
        if (d.note) { t.line(s, 0.6, 4.0, 8.8, 0, C.red, 1); bd(s, d.note, 0.6, 4.08, 8.8, 1.12, { color: WARM, align: 'center', valign: 'middle', max: 13 }); }
      },
      async (d) => { // lights on: a white page, the figures ruled like an exposure log
        const s = paperPage(d), rh = 1.02, y0 = 1.0;
        for (const [i, v] of d.stats.entries()) {
          const y = y0 + i * rh;
          t.line(s, 0.5, y + rh - 0.02, 9.0, 0, 'C9BFB0', 1);
          hd(s, v.value, 0.5, y, 3.3, rh - 0.05, { max: 44, min: 18, color: BLOOD });
          bd(s, v.label, 3.95, y, 5.55, rh - 0.05, { color: C.ink, valign: 'middle', max: 15 });
        }
        if (d.note) bd(s, d.note, 3.95, 4.12, 5.55, 1.1, { color: C.muted, italic: true, valign: 'middle', max: 12 });
      },
    ],
    compare: [
      async (d) => { // negative and positive: the page parts into dark and white, a strip of film between, sides mirrored
        const s = k.slide({ data: await room() }), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13.5, 4.05, F.body, 0.1, 3.3);
        t.rect(s, 5, 0, 5, 5.625, PAPER, { name: 'Positive' });
        await film(s, 4.83, 0, 0.34, 5.625, false);
        tape(s, d.title, 0.35, 0.18, 8.2);
        lamp(s, 9.0, 0.15);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.4 : 0.55, w = 4.05, a = i ? 'left' : 'right', ink = i ? C.ink : PAPER;
          hd(s, sd.h, x, 0.95, w, 0.55, { max: 18, min: 12, color: i ? BLOOD : C.tape, align: a });
          let y = 1.62; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: ink, align: a, ls: 1 }); y += rr[j]; });
        }
        k.foot(s, { x: 5.4, y: 5.32, w: 4.2, size: 7, color: C.muted });
      },
      async (d) => { // one above the other: the red bath and the finished sheet, the lines side by side in each
        const s = await page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.1 : 0.98, h = 2.08, n = sd.items.length, x0 = 2.55, w = (9.8 - x0) / n, ink = i ? C.ink : PAPER;
          t.rect(s, 0, y, 10, h, i ? PAPER : BLOOD, { name: 'Band' });
          hd(s, sd.h, 0.4, y + 0.1, 1.95, h - 0.2, { max: 18, min: 12, color: i ? BLOOD : C.tape });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.line(s, x, y + 0.18, 0, h - 0.36, i ? BLOOD : C.tape, 1); bd(s, it, x + 0.1, y + 0.1, w - 0.18, h - 0.2, { color: ink, valign: 'middle', max: 13 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the thought alone in the dark under a large lamp, the note on a strip of tape
        const s = k.slide({ data: await room() });
        t.oval(s, 7.2, -1.3, 4.2, 4.2, BLOOD, { t: 55, name: 'Glow' });
        t.oval(s, 8.1, -0.4, 2.4, 2.4, C.red, { name: 'Safelight' });
        k.txt(s, String(k.idx), 9.05, 0.25, 0.6, 0.5, { size: 16, bold: true, color: C.bg, align: 'center', valign: 'middle' });
        if (d.title) k.txt(s, d.title, 0.55, 0.3, 6.8, 0.5, { max: 14, min: 10.5, bold: true, color: C.tape, valign: 'middle' });
        k.head(s, L.runs(d.text), 0.55, 0.95, 7.3, 2.6, { max: 32, min: 16, color: PAPER });
        if (d.caption) { t.rect(s, 0.4, 3.7, 9.2, 1.45, C.tape, { rotate: -0.3, name: 'Tape' }); bd(s, d.caption, 0.65, 3.76, 8.7, 1.33, { color: C.ink, valign: 'middle', max: 13.5 }); }
        k.foot(s, { y: 5.32, size: 7.5, color: WARM });
      },
      async (d) => { // the loupe is laid on the sentence, the note at the side of the bench
        const s = await page(d), dd = 4.0, x = 0.45, y = 1.0;
        t.line(s, x + dd - 0.6, y + dd - 0.6, 0.85, 0.72, C.pin, 10);
        t.oval(s, x, y, dd, dd, C.pin);
        t.oval(s, x + 0.1, y + 0.1, dd - 0.2, dd - 0.2, PAPER, { name: 'Lens' });
        k.head(s, L.runs(d.text), x + 0.55, y + 0.65, dd - 1.1, dd - 1.3, { max: 22, min: 13, color: C.ink, align: 'center' });
        if (d.caption) { t.line(s, 5.65, 1.3, 0, 3.4, C.red, 2); bd(s, d.caption, 5.85, 1.1, 3.75, 3.8, { color: PAPER, valign: 'middle', max: 14.5, ls: 1.25 }); }
      },
    ],
    timeline: [
      async (d) => { // one wire across the middle: the years pegged on it, events above and hanging below
        const s = await page(d), wy = 3.05, w = 3.5, step = 1.86;
        t.line(s, 0, wy, 10, 0, C.pin, 2);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * step, up = i % 2 === 0, y = up ? 0.95 : wy + 0.14, h = up ? wy - 1.09 : 5.2 - y;
          t.rect(s, x, y, w, h, PAPER, { shadow: 0.5, blur: 6, offset: 3, name: 'Print' });
          t.rect(s, x + 0.2, wy - 0.17, 0.12, 0.34, C.pin, { r: 0.03, name: 'Clothespin' });
          hd(s, it.year, x + 0.15, y + 0.06, 1.25, 0.42, { color: BLOOD, max: 14, min: 10.5 });
          hd(s, it.h, x + 1.42, y + 0.06, w - 1.55, 0.42, { color: C.ink, max: 12.5, min: 10.5 });
          bd(s, it.t, x + 0.15, y + 0.5, w - 0.3, h - 0.56, { color: C.muted, max: 12 });
        }
      },
      async (d) => { // safelights come on one by one, brighter year by year, down the left of the wall
        const s = await page(d), rh = 4.2 / 4, y0 = 1.0, fills = ['4A1410', '7A1A14', 'C23A30', C.red];
        t.line(s, 0.85, y0 + 0.2, 0, 3.8, '6B3A32', 2);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, dd = 0.42 + i * 0.1, cy = y + rh / 2;
          t.oval(s, 0.85 - dd / 2, cy - dd / 2, dd, dd, fills[i], { name: 'Lamp' });
          hd(s, it.year, 1.5, y, 1.55, rh - 0.06, { max: 19, min: 11, color: i > 1 ? C.red : C.tape });
          hd(s, it.h, 3.1, y, 2.1, rh - 0.06, { color: PAPER, max: 13.5 });
          bd(s, it.t, 5.25, y, 4.35, rh - 0.06, { color: WARM, valign: 'middle', max: 12.5 });
        }
      },
      async (d) => { // the film unrolls from its reel, a year in every frame, the events under them
        const s = await page(d), y = 1.0, h = 1.22, x0 = 1.25, w = (9.6 - x0) / 4;
        await film(s, x0 - 0.3, y, 10 - x0 + 0.3, h);
        t.oval(s, 0.18, y - 0.14, 1.5, 1.5, '0D0908', { line: { color: C.pin, width: 3 }, name: 'Reel' });
        t.oval(s, 0.71, y + 0.39, 0.44, 0.44, C.pin);
        for (const [i, it] of d.items.entries()) {
          const x = x0 + i * w + 0.22;
          t.rect(s, x, y + 0.24, w - 0.14, h - 0.48, PAPER, { name: 'Frame' });
          hd(s, it.year, x, y + 0.24, w - 0.14, h - 0.48, { color: BLOOD, max: 20, min: 11, align: 'center' });
          hd(s, it.h, x, 2.42, w - 0.14, 0.5, { color: C.tape, max: 14 });
          bd(s, it.t, x, 2.95, w - 0.14, 2.22, { color: PAPER, max: 13 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old cards, process, stats and timeline were all the same row of hanging prints
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Fotolaboratoriya', colors: { dk1: C.bg, lt1: C.print, dk2: C.glow, lt2: C.tape, accent1: C.red, accent2: '8E1B14', accent3: C.pin, accent4: '1F4E79', accent5: C.muted, accent6: 'DDD5C8', hlink: C.red, folHlink: C.muted } });
}
module.exports = { id: 150, slug: 'fotolaboratoriya', name: 'Fotolaboratoriya', category: 'creative', photos: true, build, style: { tone: "asta-sekin ochiladigan rasm: g'oyalar 'chiqib keladi', hissiyotli va aniq kadrlar", limits: { card_t4: 110, step_t: 110 }, prefer: 'visual' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["dissolve", "fade", "p14:flash"], "cover": ["focusIn", "fadeLetters"], "mark": "focusIn", "deco": "dissolve", "sig": {"title": "dissolve", "body": "fade", "item": "dissolve", "image": "dissolve", "number": "focusIn", "order": "seq", "stagger": 0.26}, "tempo": 1.35, "kenburns": true};
