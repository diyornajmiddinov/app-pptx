/** 153 DNK — a vertical DOUBLE HELIX rises along the left edge on deep navy; each rung extends into one idea on the right, coloured by base pair (cyan/pink, lime/amber). */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '0A1128', ink: 'EAF2FF', muted: '9FB3D1', a: '00E5FF', b: 'FF4FD8', pairs: [['00E5FF', 'FF4FD8'], ['B8F24A', 'FFB020'], ['00E5FF', 'FFB020'], ['B8F24A', 'FF4FD8']] };
const F = { head: 'Arial', body: 'Calibri' };
const HX = 0.5, HW = 1.5, HY = 1.0, HH = 4.2;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const helix = async (s, turns = 2.2) => { const W2 = HW * 100, H2 = HH * 100; let s1 = '', s2 = ''; for (let y = 0; y <= H2; y += 4) { const ph = (y / H2) * turns * 2 * Math.PI; s1 += `${(W2 / 2 + Math.sin(ph) * W2 * 0.42).toFixed(1)},${y} `; s2 += `${(W2 / 2 - Math.sin(ph) * W2 * 0.42).toFixed(1)},${y} `; }
    t.img(s, await k.svg('hx' + turns, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><polyline points="${s1}" fill="none" stroke="#${C.a}" stroke-width="6"/><polyline points="${s2}" fill="none" stroke="#${C.b}" stroke-width="6" opacity="0.85"/></svg>`, W2, H2), HX, HY, HW, HH); };
  const rungs = async (s, n, draw) => { await helix(s); const rh = HH / n; for (let i = 0; i < n; i++) { const y = HY + rh * (i + 0.5), [c1, c2] = C.pairs[i % 4]; t.line(s, HX + 0.15, y, HW / 2 - 0.15, 0, c1, 4); t.line(s, HX + HW / 2, y, HW / 2 - 0.15, 0, c2, 4); t.line(s, HX + HW, y, 0.45, 0, c2, 1.25, { dash: 'dash' }); t.oval(s, HX + HW + 0.42, y - 0.08, 0.16, 0.16, c2); draw(i, 2.75, HY + i * rh, 6.85, rh, c1); } };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 2.75, 0.2, 6.2, 0.7, { max: 24, min: 13, color: C.ink }); k.txt(s, `${String(k.idx).padStart(2, '0')}`, 9.0, 0.2, 0.6, 0.7, { size: 16, bold: true, color: C.b, align: 'right', valign: 'middle' }); k.foot(s, { x: 2.75, y: 5.32, w: 6.85, size: 7.5, color: C.muted }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await helix(s); if (d.image) await k.photo(s, d.image, 6.9, 0.9, 2.7, 2.7, { mask: 'circle' }); k.txt(s, k.org3, 2.75, 0.9, 4.0, 0.35, { size: 12, bold: true, color: C.a }); k.head(s, d.title, 2.75, 1.3, 4.0, 2.4, { max: 34, min: 16, color: C.ink, valign: 'top' }); k.txt(s, d.subtitle || '', 2.75, 3.75, 6.8, 0.6, { max: 12, color: C.muted }); k.txt(s, k.M.author || '', 2.75, 4.4, 6.8, 0.45, { size: 15, bold: true, color: C.b }); k.foot(s, { x: 2.75, y: 5.32, w: 6.85, size: 7.5, color: C.muted }); },
    async intro(d) { const s = page(d); await helix(s); await k.photo(s, d.image, 2.75, 1.05, 2.8, 4.0, { mask: { r: 0.1 } }); k.txt(s, d.text, 5.8, 1.05, 3.8, 4.0, { max: 14, min: 9.5, color: C.ink, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await rungs(s, d.items.length, (i, x, y, w, h, c) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 16, color: C.ink })); },
    async cards(d) { const s = page(d); await rungs(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].h, x, y, 2.3, h, { max: 14, color: c }); k.txt(s, d.items[i].t, x + 2.4, y, w - 2.4, h, { max: 12, color: C.ink, valign: 'middle' }); }); },
    async process(d) { const s = page(d); await rungs(s, d.steps.length, (i, x, y, w, h, c) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, 2.4, h, { max: 14, color: c }); k.txt(s, d.steps[i].t, x + 2.5, y, w - 2.5, h, { max: 12, color: C.ink, valign: 'middle' }); }); },
    async stats(d) { const s = page(d); await rungs(s, d.stats.length + (d.note ? 1 : 0), (i, x, y, w, h, c) => { if (i === d.stats.length) return k.txt(s, d.note, x, y, w, h, { max: 10, color: C.muted, valign: 'middle' }); k.head(s, d.stats[i].value, x, y, 2.0, h, { max: 36, min: 14, color: c }); k.txt(s, d.stats[i].label, x + 2.1, y, w - 2.1, h, { max: 13, color: C.ink, valign: 'middle' }); }); },
    async compare(d) { const s = page(d); await helix(s); const w = 3.3, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.08, 3.5); [d.left, d.right].forEach((sd, i) => { const x = 2.75 + i * 3.55, c = i ? C.b : C.a; t.rect(s, x, 1.05, w, 0.06, c, { name: 'Strand' }); k.head(s, sd.h, x, 1.15, w, 0.45, { max: 15, color: c }); let y = 1.65; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: C.ink }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); await helix(s, 3); k.head(s, L.runs(d.text), 2.75, 1.2, 6.85, 2.5, { max: 30, min: 14, color: C.ink }); if (d.caption) k.txt(s, d.caption, 2.75, 3.85, 6.85, 1.2, { max: 12, color: C.muted }); },
    async timeline(d) { const s = page(d); await rungs(s, d.items.length, (i, x, y, w, h, c) => { k.head(s, d.items[i].year, x, y, 1.1, h, { max: 18, min: 10, color: c }); k.head(s, d.items[i].h, x + 1.2, y, 2.0, h, { max: 13, color: C.ink }); k.txt(s, d.items[i].t, x + 3.3, y, w - 3.3, h, { max: 11, color: C.muted, valign: 'middle' }); }); },
    async quote(d) { const s = page({}); await helix(s, 3); k.head(s, `\u201C${d.text}\u201D`, 2.75, 1.0, 6.85, 2.9, { max: 26, min: 13, italic: true, color: C.ink }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 2.75, 4.0, 6.85, 0.45, { size: 14, bold: true, color: C.b }); },
    async sources(d) { const s = page(d); await rungs(s, d.items.length, (i, x, y, w, h) => k.txt(s, d.items[i], x, y, w, h, { max: 11, color: C.ink, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type: the helix laid flat, cells and chromosomes, the microscope, and the lab sheet in daylight (L.pages)
  const NAVY = C.bg, PANEL = '13204A', EDGE = '3A4D7A', LIME = 'B8F24A', AMBER = 'FFB020', SHEET = 'F2F6FF', LINK = '1B2A55', LMUTE = '4A5A78', LC = '007F9E', LP = 'B8158F', LL = '4D7A00', LA = 'A86200', FOUR = [C.a, C.b, LIME, AMBER], LFOUR = [LC, LP, LL, LA];
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, color: C.ink, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const open = (d) => { const s = k.slide(NAVY); if (d.title) hd(s, d.title, 0.5, 0.2, 8.3, 0.7, { max: 24, min: 13, color: C.ink }); k.txt(s, String(k.idx).padStart(2, '0'), 9.0, 0.2, 0.6, 0.7, { size: 16, bold: true, color: C.b, align: 'right', valign: 'middle' }); k.foot(s, { x: 0.5, y: 5.32, w: 9.1, size: 7.5, color: C.muted }); return s; };
  const light = (d) => { const s = k.slide(SHEET); t.rect(s, 0, 0, 10, 0.11, LC, { name: 'Strand' }); t.rect(s, 5, 0, 5, 0.11, LP, { name: 'Strand' }); if (d.title) hd(s, d.title, 0.5, 0.2, 8.3, 0.7, { max: 24, min: 13, color: NAVY }); k.txt(s, String(k.idx).padStart(2, '0'), 9.0, 0.2, 0.6, 0.7, { size: 16, bold: true, color: LP, align: 'right', valign: 'middle' }); k.foot(s, { x: 0.5, y: 5.32, w: 9.1, size: 7.5, color: LMUTE }); return s; };
  // the helix laid on its side; `at` gives the places (0..1) where a rung stands
  const flat = async (s, x, y, w, h, turns, at = []) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); let a = '', b = '', r = ''; for (let i = 0; i <= W2; i += 4) { const ph = (i / W2) * turns * 2 * Math.PI, v = Math.sin(ph) * H2 * 0.42; a += `${i},${(H2 / 2 + v).toFixed(1)} `; b += `${i},${(H2 / 2 - v).toFixed(1)} `; } at.forEach((f, n) => { const px = f * W2, v = Math.abs(Math.sin((f) * turns * 2 * Math.PI)) * H2 * 0.42; r += `<line x1="${px}" y1="${H2 / 2 - v}" x2="${px}" y2="${H2 / 2}" stroke="#${C.pairs[n % 4][0]}" stroke-width="5"/><line x1="${px}" y1="${H2 / 2}" x2="${px}" y2="${H2 / 2 + v}" stroke="#${C.pairs[n % 4][1]}" stroke-width="5"/>`; }); t.img(s, await k.svg(`flat${W2}-${H2}-${turns}-${at.join()}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}">${r}<polyline points="${a}" fill="none" stroke="#${C.a}" stroke-width="5"/><polyline points="${b}" fill="none" stroke="#${C.b}" stroke-width="5" opacity="0.85"/></svg>`, W2, H2), x, y, w, h); };
  const stand = async (s, x, y, w, h, turns) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); let a = '', b = ''; for (let i = 0; i <= H2; i += 4) { const ph = (i / H2) * turns * 2 * Math.PI, v = Math.sin(ph) * W2 * 0.42; a += `${(W2 / 2 + v).toFixed(1)},${i} `; b += `${(W2 / 2 - v).toFixed(1)},${i} `; } t.img(s, await k.svg(`stand${W2}-${H2}-${turns}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><polyline points="${a}" fill="none" stroke="#${C.a}" stroke-width="5"/><polyline points="${b}" fill="none" stroke="#${C.b}" stroke-width="5" opacity="0.85"/></svg>`, W2, H2), x, y, w, h); };
  const pair = (s, x, y, w, c1, c2, h = 0.09) => { t.rect(s, x, y, w / 2, h, c1, { name: 'Base' }); t.rect(s, x + w / 2, y, w / 2, h, c2, { name: 'Base' }); };
  const V = {
    image: [
      async (d) => { // the view down a microscope: a round picture with cross-hairs, the words at its left
        const s = open(d), dd = 4.05, x = 5.45, y = 1.0;
        t.oval(s, x - 0.09, y - 0.09, dd + 0.18, dd + 0.18, null, { line: { color: C.a, width: 3 }, name: 'Eyepiece' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        t.line(s, x + dd / 2, y - 0.09, 0, 0.3, C.b, 2); t.line(s, x + dd / 2, y + dd - 0.21, 0, 0.3, C.b, 2); t.line(s, x - 0.09, y + dd / 2, 0.3, 0, C.b, 2); t.line(s, x + dd - 0.21, y + dd / 2, 0.3, 0, C.b, 2);
        bd(s, d.text, 0.5, 1.05, 4.6, 4.05, { max: 13.5, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, the helix runs along the top of a navy panel below it
        const s = k.slide(NAVY), y = 2.9;
        await k.photo(s, d.image, 0, 0, 10, 3.2);
        t.rect(s, 0, y, 10, 5.625 - y, NAVY, { name: 'Panel' });
        await flat(s, 0, y - 0.28, 10, 0.56, 5);
        t.rect(s, 0.4, 0.2, 8.5, 0.62, NAVY, { t: 12, name: 'Title band' });
        hd(s, d.title || '', 0.55, 0.2, 8.2, 0.62, { max: 22, min: 13, color: C.ink });
        k.txt(s, String(k.idx).padStart(2, '0'), 9.0, 0.2, 0.6, 0.62, { size: 16, bold: true, color: 'FFFFFF', align: 'right', valign: 'middle' });
        bd(s, d.text, 0.5, 3.3, 9.0, 1.95, { max: 13.5, valign: 'middle' });
        k.foot(s, { x: 0.5, y: 5.32, w: 9.1, size: 7.5, color: C.muted });
      },
      async (d) => { // the picture cut as a hexagonal ring, empty rings bonded on either side of it
        const s = open(d), w = 4.5, h = 3.9, x = 0.5, y = 1.1, hx = (a, b, ww) => `<polygon points="${a + ww * 0.25},${b} ${a + ww * 0.75},${b} ${a + ww},${b + ww * 0.433} ${a + ww * 0.75},${b + ww * 0.866} ${a + ww * 0.25},${b + ww * 0.866} ${a},${b + ww * 0.433}" fill="none" stroke="#${EDGE}" stroke-width="3"/>`;
        t.img(s, await k.svg('rings', `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="460">${hx(0, 0, 150)}${hx(0, 320, 150)}${hx(470, 330, 150)}</svg>`, 620, 460), 0.0, 1.0, 6.2, 4.6);
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: 'hex' }), x, y, w, h, { alt: '' });
        bd(s, d.text, 5.35, 1.05, 4.25, 4.1, { max: 13.5, valign: 'middle' });
      },
      async (d) => { // the lab sheet in daylight: the picture tall at the right, a code of paired tones down its edge
        const s = light(d), x = 6.1, w = 3.5, y = 1.0, h = 4.2;
        await k.photo(s, d.image, x, y, w, h);
        for (let i = 0; i < 12; i++) { const c = LFOUR[(i * 3 + (i >> 1)) % 4]; t.rect(s, x - 0.18, y + i * (h / 12), 0.1, h / 12 - 0.03, c, { name: 'Base' }); }
        bd(s, d.text, 0.5, 1.0, 5.2, 4.2, { color: NAVY, max: 13.5, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // the helix lies across the page, each idea hanging from one of its rungs
        const s = open(d), n = d.items.length, w = 9.1 / n, at = d.items.map((_, i) => (0.5 + i * (9.1 / n) + w / 2 - 0.0) / 10);
        await flat(s, 0, 0.92, 10, 0.86, n === 4 ? 4 : 3, at);
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w, c = FOUR[i], cx = x + w / 2;
          t.line(s, cx, 1.78, 0, 0.2, c, 1.25, { dash: 'dash' });
          t.oval(s, cx - 0.32, 1.96, 0.64, 0.64, PANEL, { line: { color: c, width: 1.75 }, name: 'Node' });
          t.img(s, await k.icon(it.icon, c, 2), cx - 0.17, 2.11, 0.34, 0.34);
          hd(s, it.h, x + 0.08, 2.65, w - 0.16, 0.54, { color: c, max: 14, min: 10.5, align: 'center' });
          bd(s, it.t, x + 0.08, 3.22, w - 0.16, 1.98, { align: 'center', max: 13 });
        }
      },
      async (d) => { // living cells under the lens: membrane outlines, a nucleus holding each icon
        const s = open(d), n = d.items.length, boxes = n === 4 ? [[0.5, 1.02, 4.45, 2.02], [5.05, 1.02, 4.55, 2.02], [0.5, 3.14, 4.45, 2.04], [5.05, 3.14, 4.55, 2.04]] : [[0.5, 1.02, 4.45, 2.02], [5.05, 1.02, 4.55, 2.02], [2.0, 3.14, 6.0, 2.04]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h] = boxes[i], c = FOUR[i], dd = 0.86;
          t.rect(s, x, y, w, h, PANEL, { r: 0.45, line: { color: c, width: 2 }, name: 'Membrane' });
          t.oval(s, x + 0.2, y + h / 2 - dd / 2, dd, dd, c, { name: 'Nucleus' });
          t.img(s, await k.icon(it.icon, NAVY, 2), x + 0.2 + dd / 2 - 0.2, y + h / 2 - 0.2, 0.4, 0.4);
          hd(s, it.h, x + 1.2, y + 0.1, w - 1.45, 0.42, { color: c, max: 14 });
          bd(s, it.t, x + 1.2, y + 0.54, w - 1.45, h - 0.66, { max: 12.5 });
        }
      },
      async (d) => { // a chromosome stands in the middle, an idea at the tip of every arm
        const s = open(d), n = d.items.length, cx = 5, cy = n === 4 ? 3.08 : 2.75;
        const arm = (x1, y1, c) => `<line x1="210" y1="210" x2="${x1}" y2="${y1}" stroke="#${c}" stroke-width="44" stroke-linecap="round"/>`;
        const sv = n === 4 ? arm(50, 50, C.a) + arm(370, 50, C.b) + arm(50, 370, LIME) + arm(370, 370, AMBER) : arm(50, 50, C.a) + arm(370, 50, C.b) + arm(210, 395, LIME);
        t.img(s, await k.svg(`chromo${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420">${sv}<circle cx="210" cy="210" r="36" fill="#${NAVY}" stroke="#FFFFFF" stroke-width="6"/></svg>`, 420, 420), cx - 1.0, cy - 1.0, 2.0, 2.0);
        const spots = n === 4 ? [[0.5, 1.02, 3.35, 2.02, 'right'], [6.25, 1.02, 3.35, 2.02, 'left'], [0.5, 3.15, 3.35, 2.03, 'right'], [6.25, 3.15, 3.35, 2.03, 'left']] : [[0.5, 1.02, 3.35, 2.6, 'right'], [6.25, 1.02, 3.35, 2.6, 'left'], [1.4, 3.85, 7.2, 1.35, 'center']];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, h, a] = spots[i], c = FOUR[i], mid = a === 'center';
          t.img(s, await k.icon(it.icon, c, 2), mid ? x : a === 'right' ? x + w - 0.36 : x, y + 0.03, 0.36, 0.36);
          hd(s, it.h, mid ? x + 0.45 : a === 'right' ? x : x + 0.45, y, mid ? w - 0.45 : w - 0.45, 0.42, { color: c, max: 14, align: mid ? 'left' : a });
          bd(s, it.t, x, y + 0.46, w, h - 0.5, { align: mid ? 'left' : a, max: 12.5 });
        }
      },
      async (d) => { // the lab sheet: tiles at uneven heights, each topped by its base pair
        const s = light(d), n = d.items.length, gap = 0.14, w = (9.1 - gap * (n - 1)) / n, tops = n === 4 ? [1.35, 1.02, 1.5, 1.15] : [1.3, 1.02, 1.42], h = 3.68;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * (w + gap), y = tops[i], [a, b] = [LFOUR[i], LFOUR[(i + 1) % 4]];
          t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: 'CCD6EA', width: 0.75 }, shadow: 0.15, blur: 5, offset: 2, name: 'Tile' });
          pair(s, x, y, w, a, b, 0.12);
          t.img(s, await k.icon(it.icon, a, 2), x + 0.15, y + 0.24, 0.42, 0.42);
          hd(s, it.h, x + 0.15, y + 0.72, w - 0.3, 0.56, { color: NAVY, max: 13.5, min: 10.5, valign: 'top' });
          bd(s, it.t, x + 0.15, y + 1.3, w - 0.3, h - 1.42, { color: LMUTE, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // the helix climbs the middle of the page, each step coming off it left or right
        const s = open(d), n = d.steps.length, y0 = 0.98, H2 = 4.25, rh = H2 / n, hw = 0.9, cx = 5;
        await stand(s, cx - hw / 2, y0, hw, H2, n === 4 ? 2 : 1.5);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, x = right ? cx + 0.68 : 0.42, w = 3.9, a = right ? 'left' : 'right', c = FOUR[i], dd = 0.48, my = y + rh / 2 - dd / 2;
          t.oval(s, cx - dd / 2, my, dd, dd, c, { name: 'Base' });
          k.txt(s, String(i + 1), cx - dd / 2, my, dd, dd, { size: 15, bold: true, font: F.head, color: NAVY, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, y + 0.02, w, 0.34, { color: c, max: 14, align: a });
          bd(s, st.t, x, y + 0.37, w, rh - 0.39, { align: a, max: 12.5 });
        }
      },
      async (d) => { // growth: strand blocks stand higher step by step, the words inside them
        const s = open(d), n = d.steps.length, gap = 0.1, w = (9.1 - gap * (n - 1)) / n, rise = n === 4 ? 0.34 : 0.44, base = 5.2;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * (w + gap), h = 3.05 + i * rise, y = base - h, c = FOUR[i];
          t.rect(s, x, y, w, h, PANEL, { line: { color: EDGE, width: 0.75 }, name: 'Block' });
          t.rect(s, x, y, w, 0.1, c, { name: 'Strand' });
          k.txt(s, String(i + 1), x + 0.16, y + 0.16, 0.8, 0.58, { size: 30, bold: true, font: F.head, color: c, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.16, y + 0.76, w - 0.3, 0.52, { color: C.ink, max: 13.5, min: 10.5, valign: 'top' });
          bd(s, st.t, x + 0.16, y + 1.3, w - 0.3, h - 1.42, { color: C.muted, max: 13 });
        }
      },
      async (d) => { // the plasmid: a closed ring with nodes on it, the numbered steps listed at its side
        const s = open(d), n = d.steps.length, dd = 3.7, x = 0.55, y = 1.15, r = dd / 2, cx = x + r, cy = y + r, rh = 4.15 / n;
        t.oval(s, x, y, dd, dd, null, { line: { color: C.a, width: 5 }, name: 'Ring' });
        t.oval(s, x + 0.2, y + 0.2, dd - 0.4, dd - 0.4, null, { line: { color: C.b, width: 3 }, name: 'Ring' });
        for (const [i, st] of d.steps.entries()) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / n, nx = cx + Math.cos(a) * (r - 0.1), ny = cy + Math.sin(a) * (r - 0.1), c = FOUR[i], ry = 1.02 + i * rh;
          t.oval(s, nx - 0.3, ny - 0.3, 0.6, 0.6, c, { name: 'Node' });
          k.txt(s, String(i + 1), nx - 0.3, ny - 0.3, 0.6, 0.6, { size: 18, bold: true, font: F.head, color: NAVY, align: 'center', valign: 'middle', ls: 1 });
          t.rect(s, 4.75, ry + 0.04, 0.07, rh - 0.14, c, { name: 'Tick' });
          hd(s, `${i + 1}  ${st.h}`, 4.95, ry, 4.65, 0.36, { color: c, max: 14 });
          bd(s, st.t, 4.95, ry + 0.37, 4.65, rh - 0.41, { max: 12.5 });
        }
      },
      async (d) => { // the lab sheet: one sine wave across the page with the steps as its crests and troughs
        const s = light(d), n = d.steps.length, w = 9.1 / n, H2 = 150, W2 = 1000, c0 = (i) => (0.5 + i * w + w / 2) * 100, yy = (i) => (i % 2 ? 110 : 40);
        let path = `M0,${yy(0)} C${c0(0) * 0.5},${yy(0)} ${c0(0) * 0.5},${yy(0)} ${c0(0)},${yy(0)}`; for (let i = 1; i < n; i++) { const mx = (c0(i - 1) + c0(i)) / 2; path += ` C${mx},${yy(i - 1)} ${mx},${yy(i)} ${c0(i)},${yy(i)}`; } path += ` L1000,${yy(n - 1)}`;
        t.img(s, await k.svg(`wave${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><path d="${path}" fill="none" stroke="#${LC}" stroke-width="5"/></svg>`, W2, H2), 0, 0.95, 10, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * w, cx = x + w / 2, cy = 0.95 + yy(i) / 100, c = LFOUR[i];
          t.oval(s, cx - 0.33, cy - 0.33, 0.66, 0.66, c, { name: 'Node' });
          k.txt(s, String(i + 1), cx - 0.33, cy - 0.33, 0.66, 0.66, { size: 20, bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.08, 2.5, w - 0.16, 0.54, { color: c, max: 14, min: 10.5, align: 'center' });
          bd(s, st.t, x + 0.08, 3.06, w - 0.16, 2.14, { color: NAVY, max: 13, align: 'center' });
        }
      },
    ],
    stats: [
      async (d) => { // the lead figure in a large nucleus, two smaller ones bonded to it, the note ruled off below
        const s = open(d), [a, b, c] = d.stats;
        t.line(s, 3.3, 1.55, 1.6, 0.5, EDGE, 5, { flipV: true }); t.line(s, 3.3, 2.65, 1.6, 0.55, EDGE, 5);
        t.oval(s, 0.5, 0.98, 2.98, 2.98, PANEL, { line: { color: C.a, width: 3 }, name: 'Nucleus' });
        hd(s, a.value, 0.75, 1.38, 2.48, 0.95, { max: 40, min: 20, color: C.a, align: 'center' });
        bd(s, a.label, 0.85, 2.36, 2.28, 0.95, { align: 'center', max: 12 });
        [[b, 0.98, C.b], [c, 2.56, LIME]].forEach(([v, y, col]) => { t.oval(s, 4.65, y, 1.4, 1.4, PANEL, { line: { color: col, width: 2.5 }, name: 'Atom' }); hd(s, v.value, 4.72, y + 0.35, 1.26, 0.7, { max: 20, min: 12, color: col, align: 'center' }); bd(s, v.label, 6.25, y + 0.1, 3.35, 1.2, { valign: 'middle', max: 13 }); });
        if (d.note) { t.line(s, 0.5, 4.1, 9.1, 0, EDGE, 1); bd(s, d.note, 0.5, 4.16, 9.1, 1.06, { color: C.muted, max: 13, valign: 'middle' }); }
      },
      async (d) => { // the lab sheet: three figures under their base-pair bars, a note ruled off below
        const s = light(d), w = 9.1 / 3;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * w;
          pair(s, x + 0.1, 1.15, w - 0.3, LFOUR[i], LFOUR[(i + 1) % 4], 0.14);
          hd(s, v.value, x + 0.1, 1.38, w - 0.3, 1.2, { max: 40, min: 20, color: LFOUR[i] });
          bd(s, v.label, x + 0.1, 2.6, w - 0.3, 0.95, { color: NAVY, max: 13 });
        }
        if (d.note) { t.line(s, 0.6, 3.72, 8.8, 0, 'B9C6DE', 1); bd(s, d.note, 0.6, 3.82, 8.8, 1.35, { color: LMUTE, max: 13, valign: 'middle' }); }
      },
      async (d) => { // three capsule chromosomes at uneven heights, the note in a column of its own
        const s = open(d), w = 2.1, gap = 0.12, tops = [1.25, 1.0, 1.42], c = [C.a, C.b, LIME];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * (w + gap), y = tops[i], h = 3.72;
          t.rect(s, x, y, w, h, PANEL, { r: 0.5, line: { color: c[i], width: 2 }, name: 'Capsule' });
          t.line(s, x + 0.25, y + 1.66, w - 0.5, 0, c[i], 2);
          hd(s, v.value, x + 0.14, y + 0.42, w - 0.28, 1.15, { max: 30, min: 15, color: c[i], align: 'center' });
          bd(s, v.label, x + 0.2, y + 1.78, w - 0.4, 1.5, { align: 'center', max: 12.5 });
        }
        if (d.note) bd(s, d.note, 7.3, 1.2, 2.3, 3.8, { color: C.muted, max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the zip: two strands parted round a central ladder, sides mirrored
        const s = open(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13.5, 3.9, F.body, 0.14, 3.2);
        t.line(s, 4.65, 1.0, 0, 4.15, C.a, 4); t.line(s, 5.35, 1.0, 0, 4.15, C.b, 4);
        for (let i = 0; i < 9; i++) { const y = 1.2 + i * 0.45, [c1, c2] = C.pairs[i % 4]; t.line(s, 4.65, y, 0.35, 0, c1, 3); t.line(s, 5, y, 0.35, 0, c2, 3); }
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.6 : 0.5, w = 3.9, a = i ? 'left' : 'right';
          hd(s, sd.h, x, 1.0, w, 0.6, { max: 18, min: 12, color: i ? C.b : C.a, align: a });
          let y = 1.72; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: C.ink, align: a, ls: 1 }); y += rr[j]; });
        }
      },
      async (d) => { // two bands one above the other, each its own strand colour, the lines side by side
        const s = open(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.14 : 1.0, h = 2.06, n = sd.items.length, c = i ? C.b : C.a, x0 = 2.6, w = (9.6 - x0) / n;
          t.rect(s, 0, y, 10, h, PANEL, { name: 'Band' });
          t.rect(s, 0, y, 0.2, h, c, { name: 'Strand' });
          hd(s, sd.h, 0.5, y + 0.1, 1.95, h - 0.2, { max: 18, min: 12, color: c });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.oval(s, x, y + 0.2, 0.16, 0.16, c); t.line(s, x + 0.08, y + 0.36, 0, h - 0.56, EDGE, 1); bd(s, it, x + 0.2, y + 0.14, w - 0.3, h - 0.28, { valign: 'middle', max: 13 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the helix runs flat over the page, the sentence large below it
        const s = open(d);
        await flat(s, 0, 0.9, 10, 0.72, 6);
        hd(s, L.runs(d.text), 0.8, 1.72, 8.4, 2.0, { max: 30, min: 15, color: C.ink, align: 'center' });
        if (d.caption) bd(s, d.caption, 1.0, 3.8, 8.0, 1.4, { color: C.muted, align: 'center', valign: 'middle', max: 13 });
      },
      async (d) => { // the lab sheet: the sentence on a white page, a code of paired tones running down the margin
        const s = light(d);
        for (let i = 0; i < 16; i++) { const c = LFOUR[(i * 3 + (i >> 1)) % 4]; t.rect(s, 0.5, 1.02 + i * 0.26, 0.26, 0.22, c, { name: 'Base' }); }
        hd(s, L.runs(d.text), 1.05, 1.0, 5.1, 4.15, { max: 28, min: 15, color: NAVY });
        if (d.caption) { t.line(s, 6.4, 1.1, 0, 3.95, 'B9C6DE', 1); bd(s, d.caption, 6.6, 1.0, 3.0, 4.15, { color: LMUTE, valign: 'middle', max: 13.5, ls: 1.22 }); }
      },
    ],
    timeline: [
      async (d) => { // the helix on its side through the middle of the page, an event above and below in turn
        const s = open(d), ay = 2.72, hh = 0.74, w = 3.45, step = 1.86;
        await flat(s, 0, ay, 10, hh, 5, [0.5, 2.36, 4.22, 6.08].map((v) => (v + 0.1) / 10));
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * step, up = i % 2 === 0, y = up ? 0.98 : ay + hh + 0.06, h = up ? ay - 1.02 : 5.22 - y, c = FOUR[i];
          hd(s, it.year, x, y, 1.3, 0.38, { color: c, max: 15, min: 10.5 });
          hd(s, it.h, x + 1.32, y, w - 1.32, 0.38, { color: C.ink, max: 12, min: 10 });
          bd(s, it.t, x, y + 0.4, w, h - 0.42, { max: 12 });
        }
      },
      async (d) => { // the lab sheet: rows opening on a two-tone year pill
        const s = light(d), rh = 4.2 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = 1.0 + i * rh, c = LFOUR[i];
          t.rect(s, 0.5, y + 0.14, 1.65, rh - 0.32, c, { r: 0.28, name: 'Pill' });
          hd(s, it.year, 0.56, y + 0.14, 1.53, rh - 0.32, { color: 'FFFFFF', max: 17, min: 10.5, align: 'center' });
          hd(s, it.h, 2.3, y + 0.02, 2.2, rh - 0.08, { color: NAVY, max: 13.5, min: 10.5 });
          bd(s, it.t, 4.6, y + 0.02, 5.0, rh - 0.08, { color: LMUTE, valign: 'middle', max: 12.5 });
          if (i < 3) t.line(s, 0.5, y + rh - 0.02, 9.1, 0, 'CCD6EA', 0.75);
        }
      },
      async (d) => { // a chain of hexagonal rings along the top, a year in each, the events under them
        const s = open(d), w = 9.1 / 4, hw = 1.5, hh = 1.3, hx = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="130"><polygon points="38,2 112,2 148,65 112,128 38,128 2,65" fill="#${PANEL}" stroke="#${c}" stroke-width="4"/></svg>`;
        t.line(s, 1, 1.66, 8, 0, EDGE, 5);
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w, cx = x + w / 2, c = FOUR[i];
          t.img(s, await k.svg(`hex${i}`, hx(c), 150, 130), cx - hw / 2, 1.0, hw, hh);
          hd(s, it.year, cx - 0.62, 1.05, 1.24, hh - 0.1, { color: c, max: 15, min: 10, align: 'center' });
          hd(s, it.h, x + 0.08, 2.4, w - 0.16, 0.54, { color: C.ink, max: 14, min: 10.5, align: 'center' });
          bd(s, it.t, x + 0.08, 2.96, w - 0.16, 2.24, { color: C.muted, max: 13, align: 'center' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old cards, process, stats and timeline were all the same rungs
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI DNK', colors: { dk1: C.bg, lt1: C.ink, dk2: '13204A', lt2: C.muted, accent1: C.a, accent2: C.b, accent3: 'B8F24A', accent4: 'FFB020', accent5: C.muted, accent6: '3A4D7A', hlink: C.a, folHlink: C.muted } });
}
module.exports = { id: 153, slug: 'dnk', name: 'DNK', category: 'academic', photos: true, build, style: { tone: "asosiy kod: har bir band tizimning tarkibiy qismi; ilmiy, aniq va izchil", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "elegant"], "transitions": ["p14:vortex|dir=\"l\"", "fade", "morph"], "cover": ["fadeLetters", "spinIn"], "mark": "spinIn", "deco": "curveUp", "sig": {"title": "curveUp", "body": "fade", "item": ["curveUp", "curveDown"], "image": "spinIn", "number": "spinIn", "order": "alternate", "stagger": 0.12}, "tempo": 1.05, "kenburns": false};
