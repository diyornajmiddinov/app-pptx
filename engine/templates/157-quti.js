/** 157 Quti — SHIPPING BOXES: kraft cardboard boxes with packing tape and white shipping labels (barcode, "this side up" arrows); ideas travel inside the boxes, stacked or lined up. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'E9E4DA', box: 'C69C6D', box2: 'B0855A', tape: 'D9C08E', label: 'FFFFFF', ink: '2A2118', muted: '5F5243', red: 'C0392B' };
const F = { head: 'Arial', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const bars = (s, x, y, w, h) => { let xx = x; let i = 0; while (xx < x + w) { const bw = [0.02, 0.035, 0.015, 0.03][i++ % 4]; t.rect(s, xx, y, bw, h, C.ink, { name: 'Bar' }); xx += bw + 0.025; } };
  // a box with tape across the top and a label; returns label text area
  const box = (s, x, y, w, h, i) => { t.rect(s, x, y, w, h, i % 2 ? C.box2 : C.box, { shadow: 0.3, blur: 4, offset: 2, name: 'Box' }); t.rect(s, x + w / 2 - 0.25, y, 0.5, h, C.tape, { t: 25, name: 'Tape' }); t.line(s, x, y + 0.35, w, 0, '8A6340', 0.75); k.txt(s, '\u21C8', x + w - 0.45, y + 0.02, 0.4, 0.32, { size: 13, color: '5A3E22', align: 'center' }); const lx = x + 0.15, ly = y + 0.5, lw = w - 0.3, lh = h - 0.65; t.rect(s, lx, ly, lw, lh, C.label, { name: 'Label' }); t.rect(s, lx, ly, lw, 0.08, C.red, { name: 'Label band' }); bars(s, lx + 0.1, ly + lh - 0.3, Math.min(1.2, lw - 0.2), 0.22); return { x: lx + 0.1, y: ly + 0.12, w: lw - 0.2, h: lh - 0.48 }; };
  const page = (d) => { const s = k.slide(C.bg); t.rect(s, 0, 5.15, 10, 0.475, '6F5F49', { name: 'Floor' }); if (d.title) { t.rect(s, 0.35, 0.2, 7.9, 0.75, C.label, { line: { color: C.ink, width: 1 }, name: 'Shipping label' }); t.rect(s, 0.35, 0.2, 0.18, 0.75, C.red, { name: 'Band' }); k.head(s, d.title, 0.65, 0.2, 7.4, 0.75, { max: 22, min: 12 }); } t.rect(s, 8.45, 0.2, 1.2, 0.75, C.label, { line: { color: C.ink, width: 1 }, name: 'Label' }); k.txt(s, `#${String(k.idx).padStart(3, '0')}`, 8.45, 0.2, 1.2, 0.75, { size: 14, bold: true, align: 'center', valign: 'middle', font: 'Courier New' }); k.foot(s, { y: 5.3, size: 7.5, color: 'F3EDE2' }); return s; };
  const line = (s, n, draw) => { const gap = 0.2, w = (9.3 - gap * (n - 1)) / n; for (let i = 0; i < n; i++) draw(i, box(s, 0.35 + i * (w + gap), 1.15 + (i % 2) * 0.15, w, 4.0 - (i % 2) * 0.15, i)); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); t.rect(s, 0, 5.15, 10, 0.475, '6F5F49', { name: 'Floor' }); const a = box(s, 0.5, 0.8, 5.6, 4.35, 0); k.txt(s, k.org3, a.x, a.y, a.w, 0.3, { size: 10, bold: true, color: C.red }); k.head(s, d.title, a.x, a.y + 0.35, a.w, 1.9, { max: 30, min: 14, valign: 'top' }); k.txt(s, `${k.TR.author_l}: ${k.M.author || ''}`, a.x, a.y + 2.3, a.w, 0.35, { size: 12, bold: true }); k.txt(s, d.subtitle || '', a.x, a.y + 2.65, a.w, 0.45, { max: 10, color: C.muted });
      if (d.image) { const b = box(s, 6.4, 1.9, 3.2, 3.25, 1); await k.photo(s, d.image, b.x - 0.05, b.y - 0.05, b.w + 0.1, b.h + 0.05, { gray: false }); } box(s, 6.9, 0.55, 2.2, 1.35, 0); },
    async intro(d) { const s = page(d); const a = box(s, 0.35, 1.15, 3.8, 4.0, 1); await k.photo(s, d.image, a.x - 0.05, a.y - 0.05, a.w + 0.1, a.h + 0.05); const b = box(s, 4.35, 1.15, 5.3, 4.0, 0); k.txt(s, d.text, b.x, b.y, b.w, b.h, { max: 14, min: 9.5, ls: 1.25, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); const n = d.items.length, bottom = Math.ceil(n / 2), top = n - bottom; [[bottom, 3.15, 0], [top, 1.15, bottom]].forEach(([m, y, off]) => { if (!m) return; const w = 9.3 / Math.max(m, bottom) - 0.15, x0 = 0.35 + (9.3 - m * (w + 0.15) + 0.15) / 2; for (let j = 0; j < m; j++) { const b = box(s, x0 + j * (w + 0.15), y, w, 1.95, off + j); k.head(s, `${off + j + 1}. ${d.items[off + j]}`, b.x, b.y, b.w, b.h + 0.25, { max: 14 }); } }); },
    async cards(d) { const s = page(d); line(s, d.items.length, (i, b) => { k.head(s, d.items[i].h, b.x, b.y, b.w, 0.42, { max: 14 }); k.txt(s, d.items[i].t, b.x, b.y + 0.45, b.w, b.h - 0.45, { max: 12, color: C.muted }); }); },
    async process(d) { const s = page(d); line(s, d.steps.length, (i, b) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, b.x, b.y, b.w, 0.42, { max: 14 }); k.txt(s, d.steps[i].t, b.x, b.y + 0.45, b.w, b.h - 0.45, { max: 12, color: C.muted }); }); },
    async stats(d) { const s = page(d); line(s, d.stats.length, (i, b) => { k.head(s, d.stats[i].value, b.x, b.y, b.w, 1.0, { max: 40, min: 16, color: C.red }); k.txt(s, d.stats[i].label, b.x, b.y + 1.05, b.w, b.h - 1.05 - (d.note ? 0.4 : 0), { max: 12 }); }); if (d.note) k.txt(s, d.note, 0.4, 4.85, 9.2, 0.3, { size: 8, color: C.ink }); },
    async compare(d) { const s = page(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, 4.0, F.body, 0.1, 2.8); line(s, 2, (i, b) => { const sd = i ? d.right : d.left; k.head(s, sd.h, b.x, b.y, b.w, 0.42, { max: 15, color: i ? '1F4E79' : C.red }); let y = b.y + 0.48; sd.items.forEach((it, j) => { k.txt(s, `\u25A1 ${it}`, b.x, y, b.w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); const b = box(s, 1.0, 1.15, 8.0, 4.0, 0); k.head(s, L.runs(d.text), b.x + 0.2, b.y, b.w - 0.4, b.h * 0.65, { max: 26, min: 13, align: 'center' }); if (d.caption) k.txt(s, d.caption, b.x + 0.2, b.y + b.h * 0.67, b.w - 0.4, b.h * 0.33, { max: 11, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); line(s, d.items.length, (i, b) => { k.head(s, d.items[i].year, b.x, b.y, b.w, 0.45, { max: 20, min: 11, color: C.red }); k.head(s, d.items[i].h, b.x, b.y + 0.47, b.w, 0.4, { max: 13 }); k.txt(s, d.items[i].t, b.x, b.y + 0.9, b.w, b.h - 0.9, { max: 11, color: C.muted }); }); },
    async quote(d) { const s = page({}); const b = box(s, 1.0, 1.15, 8.0, 4.0, 1); k.head(s, `\u201C${d.text}\u201D`, b.x + 0.2, b.y, b.w - 0.4, b.h - 0.45, { max: 24, min: 12, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author, b.x, b.y + b.h - 0.42, b.w, 0.4, { size: 12, bold: true, color: C.red, align: 'center' }); },
    async sources(d) { const s = page(d); const b = box(s, 0.6, 1.15, 8.8, 4.0, 0); const n = d.items.length, rh = b.h / n; d.items.forEach((it, i) => k.txt(s, `${i + 1}. ${it}`, b.x, b.y + i * rh, b.w, rh, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type: the packing slip, the delivery truck, the route map, the stencilled kraft wall, the warehouse at night (L.pages)
  const NIGHT = '2A2118', RACK = '3B2F22', TAN = 'E8DCC4', STEN = '3A2A18', BLUE = '1F4E79', FLOOR = '6F5F49', PAL = '9A7B55';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, ...o });
  const room = (d, bg, floor = FLOOR, foot = 'F3EDE2') => { const s = k.slide(bg); t.rect(s, 0, 5.15, 10, 0.475, floor, { name: 'Floor' }); if (d.title) { t.rect(s, 0.35, 0.2, 7.9, 0.75, C.label, { line: { color: C.ink, width: 1 }, name: 'Shipping label' }); t.rect(s, 0.35, 0.2, 0.18, 0.75, C.red, { name: 'Band' }); k.head(s, d.title, 0.65, 0.2, 7.4, 0.75, { max: 22, min: 12 }); } t.rect(s, 8.45, 0.2, 1.2, 0.75, C.label, { line: { color: C.ink, width: 1 }, name: 'Label' }); k.txt(s, `#${String(k.idx).padStart(3, '0')}`, 8.45, 0.2, 1.2, 0.75, { size: 14, bold: true, align: 'center', valign: 'middle', font: 'Courier New' }); k.foot(s, { y: 5.3, size: 7.5, color: foot }); return s; };
  const dark = (d) => room(d, NIGHT, '1A140E', TAN);
  const wall = (d) => room(d, C.box, '5A4128', TAN);
  // a box whose label fills it, for long text; no barcode
  const crate = (s, x, y, w, h, i, o = {}) => { t.rect(s, x, y, w, h, i % 2 ? C.box2 : C.box, { shadow: 0.3, blur: 4, offset: 2, name: 'Box' }); t.rect(s, x + w / 2 - 0.22, y, 0.44, 0.3, C.tape, { name: 'Tape' }); t.line(s, x, y + 0.3, w, 0, '8A6340', 0.75); const lx = x + 0.1, ly = y + 0.38, lw = w - 0.2, lh = h - 0.46; t.rect(s, lx, ly, lw, lh, C.label, { name: 'Label' }); t.rect(s, lx, ly, lw, 0.06, o.band || C.red, { name: 'Label band' }); return { x: lx + 0.1, y: ly + 0.1, w: lw - 0.2, h: lh - 0.14 }; };
  const pallet = (s, x, y, w) => { t.rect(s, x, y, w, 0.08, PAL, { name: 'Pallet' }); t.rect(s, x, y + 0.16, w, 0.05, PAL, { name: 'Pallet' }); [0, 0.5, 1].forEach((f) => t.rect(s, x + f * (w - 0.2), y + 0.08, 0.2, 0.09, '7A5F40', { name: 'Block' })); };
  const stick = (s, x, y, w, h, fill = C.label) => { t.rect(s, x, y, w, h, fill, { shadow: 0.25, blur: 3, offset: 2, name: 'Slip' }); };
  const V = {
    image: [
      async (d) => { // one huge shipping label: the picture printed on it, the words under, a barcode in the corner
        const s = page(d), x = 0.35, y = 1.1, w = 9.3, h = 3.95;
        t.rect(s, x, y, w, h, C.label, { line: { color: C.ink, width: 1.5 }, shadow: 0.3, blur: 4, offset: 2, name: 'Giant label' });
        t.rect(s, x, y, w, 0.12, C.red, { name: 'Label band' });
        await k.photo(s, d.image, x + 0.15, y + 0.25, 3.7, h - 0.4);
        bars(s, x + w - 1.5, y + 0.25, 1.3, 0.3);
        bd(s, d.text, x + 4.05, y + 0.62, w - 4.25, h - 0.72, { max: 13, valign: 'middle' });
      },
      async (d) => { // the picture is the loading bay, a single box stands in front with the words on it
        const s = k.slide(C.bg), x = 5.35, y = 0.32, w = 4.35, h = 4.95;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, x, y, w, h, C.box, { shadow: 0.45, blur: 6, offset: 3, name: 'Box' });
        t.rect(s, x + w / 2 - 0.3, y, 0.6, 0.42, C.tape, { name: 'Tape' });
        t.rect(s, x + 0.12, y + 0.46, w - 0.24, h - 0.58, C.label, { name: 'Label' });
        t.rect(s, x + 0.12, y + 0.46, w - 0.24, 0.07, C.red, { name: 'Label band' });
        hd(s, d.title || '', x + 0.25, y + 0.56, w - 0.5, 0.74, { max: 16, min: 11.5 });
        bd(s, d.text, x + 0.25, y + 1.32, w - 0.5, h - 1.75, { max: 12.5, valign: 'middle' });
        k.foot(s, { x: x + 0.25, y: y + h - 0.32, w: w - 0.5, size: 6.5, color: C.muted });
      },
      async (d) => { // the box stands open with its flaps out, the picture inside it, the words on a slip beside
        const s = page(d), x = 0.75, y = 1.75, w = 4.3, h = 3.38;
        t.img(s, await k.svg('flaps', `<svg xmlns="http://www.w3.org/2000/svg" width="510" height="70"><polygon points="40,70 470,70 510,0 0,0" fill="#${C.box2}"/></svg>`, 510, 70), x - 0.4, y - 0.65, w + 0.8, 0.65);
        t.rect(s, x, y, w, h, C.box, { shadow: 0.3, blur: 4, offset: 2, name: 'Box' });
        await k.photo(s, d.image, x + 0.15, y - 0.3, w - 0.3, h - 0.1);
        t.rect(s, x + w / 2 - 0.25, y + h - 0.32, 0.5, 0.32, C.tape, { name: 'Tape' });
        stick(s, 5.45, 1.1, 4.2, 3.95);
        bd(s, d.text, 5.62, 1.2, 3.86, 3.75, { max: 13, valign: 'middle' });
      },
      async (d) => { // the whole page is kraft, the picture a round sticker, the words stencilled-dark on it
        const s = wall(d), dd = 3.7, x = 5.85, y = 1.22;
        t.oval(s, x - 0.11, y - 0.11, dd + 0.22, dd + 0.22, C.label);
        t.oval(s, x - 0.04, y - 0.04, dd + 0.08, dd + 0.08, C.red);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        bd(s, d.text, 0.45, 1.12, 5.1, 3.95, { color: STEN, max: 13.5, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // boxes bonded like bricks: the upper row pushed sideways against the lower
        const s = page(d), n = d.items.length, h = 1.96, top = n === 4 ? 2 : 1, rows = [d.items.slice(0, top), d.items.slice(top)];
        let i0 = 0;
        for (const [r, row] of rows.entries()) {
          const w = n === 4 ? 4.3 : (r ? 4.55 : 6.2), y = 1.1 + r * (h + 0.04), x0 = n === 4 ? (r ? 0.35 : 1.05) : (r ? 0.35 : 1.9);
          for (const [j, it] of row.entries()) {
            const c = i0 + j, b = crate(s, x0 + j * (w + 0.12), y, w, h, c);
            t.img(s, await k.icon(it.icon, C.red, 2), b.x, b.y + 0.02, 0.28, 0.28);
            hd(s, it.h, b.x + 0.36, b.y, b.w - 0.36, 0.32);
            bd(s, it.t, b.x, b.y + 0.34, b.w, b.h - 0.36, { color: C.muted, max: 12 });
          }
          i0 += row.length;
        }
      },
      async (d) => { // the packing slip: one sheet with a barcode at the head, a tick box and line for every item
        const s = page(d), x = 0.35, y = 1.08, w = 9.3, h = 3.98, n = d.items.length, rh = (h - 0.46) / n;
        stick(s, x, y, w, h);
        bars(s, x + w - 2.0, y + 0.1, 1.8, 0.26);
        t.line(s, x + 0.15, y + 0.42, w - 0.3, 0, C.ink, 1.5);
        for (const [i, it] of d.items.entries()) {
          const yy = y + 0.44 + i * rh, m = yy + rh / 2;
          t.rect(s, x + 0.2, m - 0.13, 0.26, 0.26, C.label, { line: { color: C.ink, width: 1.25 }, name: 'Tick box' });
          t.img(s, await k.icon(it.icon, C.red, 2), x + 0.6, m - 0.17, 0.34, 0.34);
          hd(s, it.h, x + 1.05, yy, 2.6, rh - 0.04);
          bd(s, it.t, x + 3.75, yy, w - 3.95, rh - 0.04, { valign: 'middle', color: C.muted, max: 12.5 });
          if (i < n - 1) t.line(s, x + 0.15, yy + rh - 0.02, w - 0.3, 0, 'C9C0B0', 0.75, { dash: 'dash' });
        }
      },
      async (d) => { // the delivery truck side-on: its cargo split into a compartment for each idea
        const s = page(d), n = d.items.length, x = 0.25, y = 1.08, w = 7.95, h = 3.5, cw = w / n;
        t.rect(s, x, y, w, h, 'F5EFE3', { line: { color: C.ink, width: 2 }, name: 'Cargo' });
        t.img(s, await k.svg('cab', `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="200"><path d="M0,200 V30 H70 Q90,30 105,60 L140,120 Q148,132 148,150 V200 Z" fill="#${C.red}"/><path d="M18,50 H68 Q80,50 90,70 L112,112 H18 Z" fill="#CFE3F2"/></svg>`, 150, 200), x + w + 0.05, y + 1.5, 1.5, 2.0);
        t.rect(s, x, y + h, w + 1.55, 0.14, '444444', { name: 'Chassis' });
        [1.1, 6.5, 8.7].forEach((cx) => { t.oval(s, cx - 0.27, y + h - 0.02, 0.54, 0.54, '222222', { name: 'Wheel' }); t.oval(s, cx - 0.1, y + h + 0.15, 0.2, 0.2, 'BBBBBB', { name: 'Hub' }); });
        for (const [i, it] of d.items.entries()) {
          const cx = x + i * cw;
          if (i) t.line(s, cx, y, 0, h, C.ink, 1, { dash: 'dash' });
          t.img(s, await k.icon(it.icon, C.red, 2), cx + cw / 2 - 0.18, y + 0.1, 0.36, 0.36);
          hd(s, it.h, cx + 0.1, y + 0.48, cw - 0.2, 0.5, { align: 'center', max: 13 });
          bd(s, it.t, cx + 0.1, y + 1.0, cw - 0.2, h - 1.06, { color: C.muted, align: 'center', max: 12 });
        }
      },
      async (d) => { // the route at night: a dashed road winds across the map through a pin for each idea
        const s = dark(d), n = d.items.length, w = 9.3 / n, ys = [1.2, 2.5, 1.2, 2.5], h = n === 4 ? 2.55 : 2.55;
        const pts = d.items.map((_, i) => [0.35 + w * (i + 0.5), ys[i] + 0.12]);
        t.img(s, await k.svg(`route${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="400"><polyline points="${pts.map(([a, b]) => `${a * 100},${(b - 1) * 100}`).join(' ')}" fill="none" stroke="#${C.tape}" stroke-width="4" stroke-dasharray="14 10"/></svg>`, 1000, 400), 0, 1.0, 10, 4.0);
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * w + 0.06, y = ys[i] + 0.3, ww = w - 0.12, [cx, cy] = pts[i];
          t.oval(s, cx - 0.24, cy - 0.24, 0.48, 0.48, C.red, { name: 'Pin' });
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), cx - 0.13, cy - 0.13, 0.26, 0.26);
          t.rect(s, x, y, ww, h - 0.25, RACK, { line: { color: C.tape, width: 0.75 }, name: 'Stop' });
          hd(s, it.h, x + 0.08, y + 0.03, ww - 0.16, 0.42, { color: C.tape, max: 12.5, align: 'center' });
          bd(s, it.t, x + 0.08, y + 0.46, ww - 0.16, h - 0.25 - 0.5, { color: TAN, align: 'center', max: 11.5, min: 9.5 });
        }
      },
    ],
    process: [
      async (d) => { // the parcel tracker: dots along a line, the small truck at the far end, each step under its dot
        const s = page(d), n = d.steps.length, w = 9.3 / n, ly = 1.5;
        stick(s, 0.35, 1.08, 9.3, 3.98);
        t.line(s, 0.35 + w / 2, ly, w * (n - 1), 0, C.red, 4);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * w, cx = x + w / 2;
          t.oval(s, cx - 0.27, ly - 0.27, 0.54, 0.54, C.red, { name: 'Stop' });
          k.txt(s, String(i + 1), cx - 0.27, ly - 0.27, 0.54, 0.54, { size: 16, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.1, 1.9, w - 0.2, 0.52, { align: 'center' });
          bd(s, st.t, x + 0.12, 2.44, w - 0.24, 2.56, { color: C.muted, align: 'center', max: 12.5 });
        }
      },
      async (d) => { // a strip of packing tape runs down the middle, the steps stuck to it on either side
        const s = page(d), n = d.steps.length, y0 = 1.08, rh = 4.0 / n, w = 4.2;
        t.rect(s, 4.75, y0 - 0.02, 0.5, 4.05, C.tape, { name: 'Tape' });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, x = right ? 5.35 : 4.65 - w, dd = 0.46, my = y + rh / 2 - dd / 2;
          t.oval(s, 5 - dd / 2, my, dd, dd, C.ink, { name: 'Mark' });
          k.txt(s, String(i + 1), 5 - dd / 2, my, dd, dd, { size: 14, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          stick(s, x, y + 0.03, w, rh - 0.09);
          hd(s, st.h, x + 0.12, y + 0.04, w - 0.24, 0.28, { max: 12.5 });
          bd(s, st.t, x + 0.12, y + 0.32, w - 0.24, rh - 0.38, { color: C.muted, max: 12, ls: 1.08 });
        }
      },
      async (d) => { // a stack that grows: more cartons underneath each next step, the top one holds the words
        const s = page(d), n = d.steps.length, gap = 0.12, w = (9.3 - gap * (n - 1)) / n, base = 5.14, topH = 3.0;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.35 + i * (w + gap), under = (n - 1) * 0 + i * (n === 4 ? 0.3 : 0.42), y = base - topH - under;
          for (let j = 0; j < i; j++) { const yy = base - (n === 4 ? 0.3 : 0.42) * (j + 1); t.rect(s, x, yy, w, (n === 4 ? 0.3 : 0.42) - 0.02, j % 2 ? C.box : C.box2, { name: 'Carton' }); t.rect(s, x + w / 2 - 0.2, yy, 0.4, (n === 4 ? 0.3 : 0.42) - 0.02, C.tape, { t: 25, name: 'Tape' }); }
          const b = crate(s, x, y, w, topH, i);
          k.txt(s, String(i + 1), b.x, b.y, 0.5, 0.4, { size: 22, bold: true, font: F.head, color: C.red, valign: 'middle', ls: 1 });
          hd(s, st.h, b.x, b.y + 0.4, b.w, 0.5, { max: 13 });
          bd(s, st.t, b.x, b.y + 0.92, b.w, b.h - 0.94, { color: C.muted, max: 12 });
        }
      },
      async (d) => { // the warehouse at night: steps on the racks, one arrow leading down from level to level
        const s = dark(d), n = d.steps.length, y0 = 1.08, rh = 4.0 / n;
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, h = rh - 0.08;
          t.rect(s, 0.35, y, 9.3, h, RACK, { name: 'Rack' });
          t.rect(s, 0.35, y + h - 0.05, 9.3, 0.05, 'E0792A', { name: 'Beam' });
          t.rect(s, 0.5, y + 0.1, 0.9, h - 0.25, C.box, { name: 'Box' });
          t.rect(s, 0.82, y + 0.1, 0.26, h - 0.25, C.tape, { name: 'Tape' });
          k.txt(s, String(i + 1), 0.5, y + 0.1, 0.9, h - 0.25, { size: 22, bold: true, font: F.head, color: C.ink, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, 1.6, y + 0.04, 2.5, h - 0.14, { color: C.tape, max: 13.5 });
          bd(s, st.t, 4.2, y + 0.04, 5.3, h - 0.14, { color: TAN, valign: 'middle', max: 12 });
          if (i < n - 1) k.txt(s, '▼', 0.82, y + h - 0.13, 0.26, 0.24, { size: 11, color: 'E0792A', align: 'center', valign: 'middle', ls: 1 });
        }
      },
    ],
    stats: [
      async (d) => { // the big red-banded label with one figure and a barcode, two small labels stuck under the note
        const s = page(d), [a, b, c] = d.stats;
        stick(s, 0.35, 1.1, 5.2, 3.95);
        t.rect(s, 0.35, 1.1, 5.2, 0.14, C.red, { name: 'Label band' });
        hd(s, a.value, 0.55, 1.32, 4.8, 1.55, { max: 60, min: 24, color: C.red });
        bd(s, a.label, 0.55, 2.92, 4.8, 1.0, { max: 15, min: 11 });
        bars(s, 0.55, 4.25, 2.4, 0.55);
        if (d.note) bd(s, d.note, 5.8, 1.1, 3.85, 1.65, { color: C.ink, max: 12, valign: 'middle' });
        [[b, 5.8], [c, 7.78]].forEach(([v, x]) => { stick(s, x, 2.85, 1.87, 2.2); hd(s, v.value, x + 0.1, 2.9, 1.67, 0.72, { max: 22, min: 13, color: BLUE }); bd(s, v.label, x + 0.1, 3.62, 1.67, 1.38, { color: C.muted, max: 11.5 }); });
      },
      async (d) => { // three parcels on one pallet, the figures chalked on their sides
        const s = page(d), w = 2.9, gap = 0.1, x0 = 0.55, y = 1.1, h = 1.85;
        for (const [i, v] of d.stats.entries()) {
          const x = x0 + i * (w + gap);
          t.rect(s, x, y, w, h, i % 2 ? C.box2 : C.box, { shadow: 0.3, blur: 4, offset: 2, name: 'Box' });
          t.rect(s, x, y + 0.2, w, 0.22, C.tape, { name: 'Tape' });
          hd(s, v.value, x + 0.1, y + 0.45, w - 0.2, h - 0.55, { max: 34, min: 16, color: STEN, align: 'center' });
          bd(s, v.label, x + 0.05, y + h + 0.3, w - 0.1, 0.62, { align: 'center', max: 12.5 });
        }
        pallet(s, x0 - 0.1, y + h, 9.0);
        if (d.note) { t.line(s, 0.5, 3.95, 9.0, 0, C.muted, 0.75); bd(s, d.note, 0.5, 4.0, 9.0, 1.1, { color: C.muted, align: 'center', valign: 'middle', max: 12.5 }); }
      },
      async (d) => { // the kraft wall: figures sprayed through a stencil, big and dark, in rows
        const s = wall(d), rh = 0.98;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.08 + i * rh;
          hd(s, v.value, 0.45, y, 3.9, rh - 0.05, { max: 44, min: 20, color: STEN, font: 'Courier New' });
          bd(s, v.label, 4.5, y, 5.1, rh - 0.05, { color: STEN, valign: 'middle', max: 14 });
          t.line(s, 0.45, y + rh - 0.02, 9.15, 0, '8A6340', 1);
        }
        if (d.note) { t.rect(s, 0.45, 4.1, 9.15, 0.96, C.tape, { name: 'Tape' }); bd(s, d.note, 0.6, 4.13, 8.85, 0.9, { color: C.ink, valign: 'middle', max: 12 }); }
      },
    ],
    compare: [
      async (d) => { // sent and received: the dark bay on one side, the kraft wall on the other, a big arrow between
        const s = room(d, C.box, FLOOR), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, 3.95, F.body, 0.12, 3.05);
        t.rect(s, 0, 1.02, 5, 4.13, NIGHT, { name: 'Bay' }); t.rect(s, 5, 1.02, 5, 4.13, C.box, { name: 'Wall' });
        t.oval(s, 4.62, 2.72, 0.76, 0.76, C.red, { name: 'Middle' });
        k.txt(s, '→', 4.62, 2.72, 0.76, 0.76, { size: 22, bold: true, font: F.body, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.65 : 0.4, w = 3.95, a = i ? 'left' : 'right';
          hd(s, sd.h, x, 1.08, w, 0.56, { max: 18, min: 12, color: i ? STEN : C.tape, align: a });
          let y = 1.76; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: i ? STEN : TAN, align: a, ls: 1 }); y += rr[j]; });
        }
      },
      async (d) => { // two long crates, one on the other, a label for its lines pasted along each
        const s = page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.09 : 1.06, h = 1.97, n = sd.items.length, x = 0.35, W2 = 9.3;
          t.rect(s, x, y, W2, h, i ? C.box2 : C.box, { shadow: 0.25, blur: 3, offset: 2, name: 'Long crate' });
          hd(s, sd.h, x + 0.15, y + 0.1, 1.95, h - 0.2, { max: 16, min: 11, color: STEN });
          t.rect(s, x + 2.2, y + 0.1, W2 - 2.3, h - 0.2, C.label, { name: 'Label' });
          const x0 = x + 2.3, w = (W2 - 2.5) / n;
          sd.items.forEach((it, j) => { if (j) t.line(s, x0 + j * w - 0.05, y + 0.22, 0, h - 0.44, 'C9C0B0', 0.75, { dash: 'dash' }); bd(s, it, x0 + j * w, y + 0.13, w - 0.1, h - 0.26, { valign: 'middle', max: 12 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the sentence stencilled on the kraft, up-arrows beside, the note on a white label below
        const s = wall(d);
        k.txt(s, '⇈', 0.4, 1.2, 0.85, 2.2, { size: 54, color: STEN, align: 'center', valign: 'middle', ls: 1 });
        hd(s, L.runs(d.text), 1.35, 1.1, 7.3, 2.45, { max: 28, min: 15, color: STEN, align: 'center' });
        k.txt(s, '⇈', 8.75, 1.2, 0.85, 2.2, { size: 54, color: STEN, align: 'center', valign: 'middle', ls: 1 });
        if (d.caption) { stick(s, 0.6, 3.68, 8.8, 1.36); t.rect(s, 0.6, 3.68, 0.14, 1.36, C.red, { name: 'Band' }); bd(s, d.caption, 0.88, 3.72, 8.4, 1.28, { valign: 'middle', max: 12.5 }); }
      },
      async (d) => { // the warehouse at night: words large on the dark, one parcel under the lamp with the note
        const s = dark(d);
        t.oval(s, 7.25, 0.98, 0.4, 0.14, 'F7DC8B', { name: 'Lamp' });
        t.img(s, await k.svg('lampCone', `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120"><polygon points="195,0 205,0 400,120 0,120" fill="#F7DC8B" opacity="0.25"/></svg>`, 400, 120), 5.45, 1.06, 4.0, 1.2);
        k.head(s, L.runs(d.text), 0.45, 1.12, 4.8, 3.95, { max: 28, min: 15, color: 'FFFFFF' });
        if (d.caption) { const b = crate(s, 5.5, 2.2, 3.9, 2.92, 0); bd(s, d.caption, b.x, b.y, b.w, b.h, { valign: 'middle', max: 12 }); }
      },
    ],
    timeline: [
      async (d) => { // the tracking history at night: a line of lit dots, each scan on its own row
        const s = dark(d), y0 = 1.08, rh = 4.0 / 4;
        t.line(s, 0.62, y0 + 0.3, 0, 3.4, C.tape, 1.5);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, on = i === 3;
          t.oval(s, 0.5, y + rh / 2 - 0.12, 0.24, 0.24, on ? 'E0792A' : C.tape, { name: 'Scan' });
          hd(s, it.year, 0.95, y, 1.65, rh - 0.05, { font: 'Courier New', max: 16, min: 10, color: on ? 'F7A564' : C.tape });
          hd(s, it.h, 2.65, y, 2.1, rh - 0.05, { color: 'FFFFFF', max: 13 });
          bd(s, it.t, 4.85, y, 4.8, rh - 0.05, { color: TAN, valign: 'middle', max: 12 });
          if (i < 3) t.line(s, 0.95, y + rh - 0.02, 8.7, 0, RACK, 0.75);
        }
      },
      async (d) => { // the road across the middle: a truck at the end, stops above and below it
        const s = page(d), ry = 2.85, rh = 0.38, w = 3.45, step = 1.86;
        t.rect(s, 0, ry, 10, rh, '4A4A4A', { name: 'Road' });
        t.line(s, 0, ry + rh / 2, 10, 0, 'F3EDE2', 1.5, { dash: 'dash' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * step, up = i % 2 === 0, y = up ? 1.05 : ry + rh + 0.08, h = up ? ry - 1.1 : 5.12 - y;
          stick(s, x, y, w, h);
          t.oval(s, x + 0.1, ry + rh / 2 - 0.09, 0.18, 0.18, C.red, { name: 'Stop' });
          hd(s, it.year, x + 0.1, y + 0.03, 1.35, 0.36, { color: C.red, max: 14 });
          hd(s, it.h, x + 1.45, y + 0.03, w - 1.53, 0.36, { max: 12, min: 10 });
          bd(s, it.t, x + 0.1, y + 0.4, w - 0.2, h - 0.44, { color: C.muted, max: 11.5 });
        }
      },
      async (d) => { // luggage tags on one rail, the year on each eyelet end
        const s = page(d), gap = 0.14, w = (9.3 - gap * 3) / 4, ry = 1.12;
        t.rect(s, 0, ry, 10, 0.07, '555555', { name: 'Rail' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.35 + i * (w + gap), y = ry + 0.3 + (i % 2) * 0.16, h = 5.12 - y;
          t.line(s, x + w / 2, ry + 0.05, 0, y - ry + 0.08, C.muted, 1);
          t.shape(s, 'SNIP_2_SAME_RECTANGLE', { x, y, w, h, fill: { color: i % 2 ? TAN : C.label }, line: { color: C.ink, width: 0.75 }, objectName: 'Luggage tag' });
          t.oval(s, x + w / 2 - 0.07, y + 0.07, 0.14, 0.14, C.bg, { line: { color: C.ink, width: 1 }, name: 'Eyelet' });
          hd(s, it.year, x + 0.1, y + 0.24, w - 0.2, 0.46, { color: C.red, max: 17, align: 'center' });
          hd(s, it.h, x + 0.1, y + 0.72, w - 0.2, 0.46, { max: 12.5, align: 'center' });
          bd(s, it.t, x + 0.12, y + 1.2, w - 0.24, h - 1.28, { color: C.muted, align: 'center', max: 12 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old cards, process, stats and timeline were all the same row of boxes
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Quti', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '5A3E22', lt2: C.bg, accent1: C.red, accent2: C.box, accent3: '1F4E79', accent4: C.tape, accent5: C.muted, accent6: C.box2, hlink: '1F4E79', folHlink: C.muted } });
}
module.exports = { id: 157, slug: 'quti', name: 'Quti', category: 'business', photos: true, build, style: { tone: "yetkazib berish tili: nima, qayerga, qachon; aniq va amaliy, ro'yxatga mos", limits: { card_t4: 110, step_t: 110 }, prefer: null } };
