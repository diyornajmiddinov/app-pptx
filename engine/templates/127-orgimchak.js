/**
 * 127 O'rgimchak — a radar / spider-web chart sits in the centre of the slide; each idea hangs at the end of a
 * spoke in a corner or side, joined to the web by a thread. Light slate web, violet and lime accents.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F5F7FA', ink: '1E1B2E', muted: '5B5870', web: 'A3A9BA', fill: '7C3AED', accent: '84CC16' };
const F = { head: 'Arial', body: 'Calibri' };
const CX = 5.0, CY = 3.15, RW = 1.25;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const web = async (s, n, r = RW, cx = CX, cy = CY) => { const N = Math.max(5, n), P = 200; let g = '';
    for (let ring = 1; ring <= 4; ring++) { const rr = (ring / 4) * 190; g += `<polygon points="${Array.from({ length: N }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N; return `${(P + rr * Math.cos(a)).toFixed(1)},${(P + rr * Math.sin(a)).toFixed(1)}`; }).join(' ')}" fill="none" stroke="#${C.web}" stroke-width="2"/>`; }
    for (let i = 0; i < N; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / N; g += `<line x1="${P}" y1="${P}" x2="${(P + 190 * Math.cos(a)).toFixed(1)}" y2="${(P + 190 * Math.sin(a)).toFixed(1)}" stroke="#${C.web}" stroke-width="2"/>`; }
    g += `<polygon points="${Array.from({ length: N }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N, rr = 190 * (0.55 + 0.4 * ((i * 37) % 10) / 10); return `${(P + rr * Math.cos(a)).toFixed(1)},${(P + rr * Math.sin(a)).toFixed(1)}`; }).join(' ')}" fill="#${C.fill}" fill-opacity="0.25" stroke="#${C.fill}" stroke-width="3"/>`;
    t.img(s, await k.svg('web' + N, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">${g}</svg>`, 400, 400), cx - r, cy - r, 2 * r, 2 * r); };
  // anchor boxes around the web: corners for 3–4 items, two side columns for 5–6
  const slots = (n) => { if (n <= 4) { const S = [[0.4, 1.1, 'right'], [6.4, 1.1, 'left'], [0.4, 3.3, 'right'], [6.4, 3.3, 'left']]; return n === 3 ? [S[0], S[1], [6.4, 3.3, 'left']] : S.slice(0, n); } const per = Math.ceil(n / 2), h = 4.0 / per; return Array.from({ length: n }, (_, i) => [i < per ? 0.4 : 6.4, 1.1 + (i % per) * h, i < per ? 'right' : 'left', h]); };
  const around = (s, n, draw) => { slots(n).forEach(([x, y, al, h], i) => { const w = 3.2, hh = h || 1.95, ax = al === 'right' ? x + w : x, ay = y + 0.25; t.line(s, Math.min(ax, CX), Math.min(ay, CY), Math.abs(CX - ax), Math.abs(CY - ay), C.web, 0.75, { dash: 'sysDot', flipV: (CX - ax) * (CY - ay) < 0 }); t.oval(s, ax - 0.07, ay - 0.07, 0.14, 0.14, i % 2 ? C.accent : C.fill); draw(i, x, y, w, hh - 0.1, al); }); };
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 0.4, 0.25, 8.2, 0.65, { max: 24, min: 13, align: 'center', x: 0 }); k.txt(s, String(k.idx), 9.0, 0.25, 0.6, 0.65, { size: 16, bold: true, color: C.fill, align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5, align: 'center' }); return s; };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await web(s, 6, 2.3, 7.2, 2.8); if (d.image) await k.photo(s, d.image, 6.4, 2.0, 1.6, 1.6, { mask: 'circle' });
      k.txt(s, k.org3, 0.45, 0.6, 4.4, 0.35, { size: 12, bold: true, color: C.fill }); k.head(s, d.title, 0.45, 1.0, 4.4, 2.4, { max: 36, min: 18, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, 0.45, 3.45, 4.3, 0.75, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.45, 4.3, 4.3, 0.45, { size: 15, bold: true }); k.foot(s, { y: 5.32, size: 7.5 }); },
    async intro(d) { const s = page(d); await web(s, 5, 1.6, 2.4, 3.05); await k.photo(s, d.image, 1.5, 2.15, 1.8, 1.8, { mask: 'circle' }); k.txt(s, d.text, 4.6, 1.05, 5.0, 4.1, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); await web(s, d.items.length); around(s, d.items.length, (i, x, y, w, h, al) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, Math.min(h, 0.9), { max: 15, align: al })); },
    async cards(d) { const s = page(d); await web(s, d.items.length); around(s, d.items.length, (i, x, y, w, h, al) => { k.head(s, d.items[i].h, x, y, w, 0.45, { max: 15, align: al, color: C.fill }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: al }); }); },
    async process(d) { const s = page(d); await web(s, d.steps.length); around(s, d.steps.length, (i, x, y, w, h, al) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.45, { max: 15, align: al, color: C.fill }); k.txt(s, d.steps[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: al }); }); },
    async stats(d) { const s = page(d); await web(s, d.stats.length); around(s, d.stats.length, (i, x, y, w, h, al) => { k.head(s, d.stats[i].value, x, y, w, 0.85, { max: 40, min: 16, align: al, color: i % 2 ? '4D7C0F' : C.fill }); k.txt(s, d.stats[i].label, x, y + 0.87, w, h - 0.87, { max: 12, align: al }); });
      if (d.note) k.txt(s, d.note, 6.4, 4.55, 3.2, 0.6, { max: 9, color: C.muted }); },
    async compare(d) { const s = page(d); await web(s, 5, 1.0); const w = 3.4, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.12, 3.3);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 6.2 : 0.4, al = i ? 'left' : 'right'; k.head(s, sd.h, x, 1.1, w, 0.45, { max: 16, align: al, color: i ? '4D7C0F' : C.fill }); let y = 1.65; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, align: al }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); await web(s, 6, 2.0, 5.0, 3.1); t.rect(s, 1.6, 2.1, 6.8, 2.0, C.bg, { t: 10, name: 'Plate' }); k.head(s, L.runs(d.text), 1.7, 2.15, 6.6, 1.9, { max: 26, min: 13, align: 'center' }); if (d.caption) k.txt(s, d.caption, 0.4, 4.3, 9.2, 0.9, { max: 11, color: C.muted, align: 'center' }); },
    async timeline(d) { const s = page(d); await web(s, d.items.length); around(s, d.items.length, (i, x, y, w, h, al) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.45, { max: 14, align: al, color: C.fill }); k.txt(s, d.items[i].t, x, y + 0.47, w, h - 0.47, { max: 12, align: al }); }); },
    async quote(d) { const s = page({}); await web(s, 6, 1.4, 1.9, 3.0); k.head(s, `\u201C${d.text}\u201D`, 3.7, 1.2, 5.8, 2.9, { max: 28, min: 14, italic: true }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 3.7, 4.2, 5.8, 0.45, { size: 14, bold: true, color: C.fill }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 4.0 / n; d.items.forEach((it, i) => { const y = 1.1 + i * rh; t.line(s, 0.4, y + rh / 2, 0.35, 0, C.web, 0.75); t.oval(s, 0.75, y + rh / 2 - 0.07, 0.14, 0.14, i % 2 ? C.accent : C.fill); k.txt(s, it, 1.05, y, 8.5, rh, { max: 12, valign: 'middle' }); }); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all spun from the same web: a deck's pages must not look alike (L.pages)
  const NIGHT = '1E1B2E', FOG = 'C7C4D6', LILAC = 'C4B5FD', MOSS = '4D7C0F', PALE = 'EDE9FE', PALEG = 'ECF7D4', STRAND = '4A4560';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  // a web anywhere on the page, cut off by the page's edge: centre and radius in inches
  const spun = async (s, cx, cy, r, o = {}) => { const P = 160, N = o.n ?? 12, col = o.color ?? C.web, rings = o.rings ?? 6, key = `spun${cx}-${cy}-${r}-${N}-${col}-${rings}`, X = cx * P, Y = cy * P; let g = '';
    for (let q = 1; q <= rings; q++) { const rr = r * P * q / rings; g += `<polygon points="${Array.from({ length: N }, (_, i) => { const a = i * 2 * Math.PI / N; return `${(X + rr * Math.cos(a)).toFixed(1)},${(Y + rr * Math.sin(a)).toFixed(1)}`; }).join(' ')}" fill="none" stroke="#${col}" stroke-width="${o.sw ?? 2}"/>`; }
    for (let i = 0; i < N; i++) { const a = i * 2 * Math.PI / N; g += `<line x1="${X}" y1="${Y}" x2="${(X + r * P * Math.cos(a)).toFixed(1)}" y2="${(Y + r * P * Math.sin(a)).toFixed(1)}" stroke="#${col}" stroke-width="${o.sw ?? 2}"/>`; }
    t.img(s, await k.svg(key, `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${g}</svg>`, 1600, 900), 0, 0, 10, 5.625); };
  const spider = async (s, x, y, sz, col) => { let g = ''; for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) { const a = -50 + i * 33; g += `<polyline points="50,50 ${50 + sx * 26 * Math.cos(a * Math.PI / 180)},${50 + 26 * Math.sin(a * Math.PI / 180) - 8} ${50 + sx * 46 * Math.cos(a * Math.PI / 180)},${50 + 46 * Math.sin(a * Math.PI / 180) + 8}" fill="none" stroke="#${col}" stroke-width="4"/>`; } g += `<ellipse cx="50" cy="56" rx="13" ry="17" fill="#${col}"/><circle cx="50" cy="35" r="9" fill="#${col}"/>`; t.img(s, await k.svg('spider' + col, `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100">${g}</svg>`, 200, 200), x, y, sz, sz); };
  const drop = (s, v, x, y, dd, f, ink, size) => { t.oval(s, x, y, dd, dd, f); if (v !== '') k.txt(s, String(v), x, y, dd, dd, { size: size ?? Math.round(dd * 34), bold: true, font: F.head, color: ink, align: 'center', valign: 'middle', ls: 1 }); };
  // a straight thread between two points
  const thread = (s, x1, y1, x2, y2, col = C.web, w = 0.75, dash = 'sysDot') => t.line(s, Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1), col, w, { ...(dash ? { dash } : {}), flipV: (x2 - x1) * (y2 - y1) < 0 });
  const pg = (d, o = {}) => { // the sheet; o.night = the web at night, pale strands and pale words
    const s = k.slide(o.night ? NIGHT : C.bg);
    return s; };
  const top = (s, d, o = {}) => { const tb = o.title || {}; if (d.title) k.head(s, d.title, tb.x ?? 0.4, tb.y ?? 0.25, tb.w ?? 8.2, tb.h ?? 0.65, { max: tb.max ?? 24, min: 13, color: o.night ? 'FFFFFF' : C.ink, ...(tb.align ? { align: tb.align } : {}) }); k.txt(s, String(k.idx), 9.0, 0.25, 0.6, 0.65, { size: 16, bold: true, color: o.night ? LILAC : C.fill, align: 'right', valign: 'middle' }); if (!o.noFoot) k.foot(s, { y: 5.32, size: 7.5, align: o.footAlign || 'center', ...(o.night ? { color: FOG } : {}) }); };
  const V = {
    image: [
      async (d) => { // the picture fills the page, a pale web and a card with the words hang on it
        const s = k.slide(NIGHT);
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        await spun(s, 10, 0, 5.2, { color: 'FFFFFF', sw: 1.5, n: 24, rings: 7 });
        t.rect(s, 0.4, 0.4, 5.6, 4.72, C.bg, { r: 0.08, shadow: 0.35, name: 'Card' });
        k.head(s, d.title || '', 0.65, 0.5, 4.5, 0.9, { max: 22, min: 13 });
        k.txt(s, String(k.idx), 5.1, 0.5, 0.7, 0.5, { size: 16, bold: true, color: C.fill, align: 'right', valign: 'middle' });
        t.line(s, 0.65, 1.44, 5.1, 0, C.fill, 1.5);
        bd(s, d.text, 0.65, 1.52, 5.1, 3.52, { max: 13.5 });
        t.rect(s, 0, 5.28, 10, 0.345, NIGHT, { name: 'Band' });
        k.foot(s, { y: 5.35, size: 7.5, color: FOG });
      },
      async (d) => { // the picture is a slice of web in the page's corner, strands run over it
        const s = k.slide(C.bg), R0 = 5.625;
        t.img(s, await L.photo(L.src(d.image), R0, R0, { mask: { path: 'M1,0 L0,0 A1,1 0 0 0 1,1 Z' } }), 10 - R0, 0, R0, R0, { alt: '' });
        await spun(s, 10, 0, R0, { color: 'FFFFFF', sw: 1.5, n: 24, rings: 5 });
        k.head(s, d.title || '', 0.4, 0.25, 3.85, 0.98, { max: 20, min: 13, valign: 'top' });
        k.txt(s, String(k.idx), 0.4, 4.86, 0.6, 0.4, { size: 16, bold: true, color: C.fill, valign: 'middle' });
        bd(s, d.text, 0.4, 1.28, 3.95, 3.55, { max: 13 });
        k.foot(s, { y: 5.32, size: 7, w: 4.0, x: 0.4 });
      },
      async (d) => { // the picture sits at the web's centre, cut to six sides, strands reaching to both edges
        const s = k.slide(C.bg), W0 = 3.3, H0 = 2.75, cx = 5, cy = 2.28;
        await spun(s, cx, cy, 5.6, { n: 6, rings: 7, sw: 1.5 });
        t.rect(s, 0, 3.78, 10, 1.85, C.bg, { name: 'Cover' });
        k.head(s, d.title || '', 0.4, 0.2, 3.0, 1.5, { max: 22, min: 13, valign: 'top' });
        k.txt(s, String(k.idx), 9.0, 0.25, 0.6, 0.65, { size: 16, bold: true, color: C.fill, align: 'right', valign: 'middle' });
        t.img(s, await L.photo(L.src(d.image), W0, H0, { mask: 'hex' }), cx - W0 / 2, cy - H0 / 2 + 0.15, W0, H0, { alt: '' });
        t.line(s, 0, 3.78, 10, 0, C.fill, 1.5);
        bd(s, d.text, 0.4, 3.86, 9.2, 1.42, { max: 12.5, ls: 1.1, valign: 'middle' });
        k.foot(s, { y: 5.32, size: 7.5, align: 'center' });
      },
      async (d) => { // night: the picture takes the shape of the radar's catch, the web drawn round it
        const s = k.slide(NIGHT), D = 4.6, x = 5.1, y = 0.5, P = D * 100, N = 6, a0 = -Math.PI / 2, rs = [0.98, 0.72, 0.92, 0.66, 0.94, 0.76];
        const pts = rs.map((r, i) => { const a = a0 + i * 2 * Math.PI / N; return [0.5 + 0.5 * r * Math.cos(a), 0.5 + 0.5 * r * Math.sin(a)]; });
        await spun(s, x + D / 2, y + D / 2, D / 2, { n: 6, rings: 4, color: STRAND });
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: { poly: pts } }), x, y, D, D, { alt: '' });
        t.img(s, await k.svg('catch', `<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${P}"><polygon points="${pts.map(([a, b]) => `${a * P},${b * P}`).join(' ')}" fill="none" stroke="#${C.accent}" stroke-width="4"/></svg>`, P, P), x, y, D, D);
        k.head(s, d.title || '', 0.4, 0.3, 4.5, 1.05, { max: 22, min: 13, color: 'FFFFFF', valign: 'top' });
        bd(s, d.text, 0.4, 1.42, 4.5, 3.75, { max: 13, color: 'FFFFFF', ls: 1.2 });
        k.txt(s, String(k.idx), 9.0, 0.2, 0.6, 0.4, { size: 16, bold: true, color: LILAC, align: 'right', valign: 'middle' });
        k.foot(s, { y: 5.32, size: 7.5, color: FOG });
      },
    ],
    cards: [
      async (d) => { // the cards hang on threads from the top edge, each thread its own length
        const s = pg(d), n = d.items.length, w = 9.2 / n, drp = n === 4 ? [0.42, 0.04, 0.3, 0] : [0.34, 0, 0.24]; top(s, d);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w + 0.05, ww = w - 0.1, y = 1.25 + drp[i], cx = x + ww / 2;
          thread(s, cx, 0.95, cx, y, C.fill, 1, null);
          t.rect(s, x, y, ww, 5.2 - y, 'FFFFFF', { r: 0.08, line: { color: C.web, width: 0.75 }, name: 'Card' });
          drop(s, '', cx - 0.26, y - 0.22, 0.52, C.fill);
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), cx - 0.15, y - 0.11, 0.3, 0.3);
          hd(s, it.h, x + 0.1, y + 0.34, ww - 0.2, 0.56, { align: 'center', max: 14 });
          bd(s, it.t, x + 0.1, y + 0.92, ww - 0.2, 5.14 - y - 0.92, { align: 'center', max: 12.5 });
        }
      },
      async (d) => { // half a web on the left, one strand fans out from its heart to each idea
        const s = pg(d), n = d.items.length, cx = 0, cy = 3.05, rh = 4.0 / n;
        await spun(s, cx, cy, 3.1, { n: 16, rings: 5 }); top(s, d, { footAlign: 'right' });
        for (const [i, it] of d.items.entries()) {
          const y = 1.14 + i * rh, ax = 3.5, ay = y + rh / 2;
          thread(s, cx, cy, ax, ay, C.fill, 1, null);
          drop(s, '', ax - 0.28, ay - 0.28, 0.56, i % 2 ? C.accent : C.fill);
          t.img(s, await k.icon(it.icon, i % 2 ? NIGHT : 'FFFFFF', 2), ax - 0.15, ay - 0.15, 0.3, 0.3);
          hd(s, it.h, ax + 0.4, y + 0.04, 5.7, 0.36);
          bd(s, it.t, ax + 0.4, y + 0.42, 5.7, rh - 0.46, { max: 13 });
        }
      },
      async (d) => { // night: each idea has its own small web spun in the corner of its plate
        const s = pg(d, { night: true }), n = d.items.length; top(s, d, { night: true });
        for (const [i, it] of d.items.entries()) {
          const w = n === 4 ? 4.54 : 2.98, h = n === 4 ? 1.98 : 4.02, x = 0.4 + (n === 4 ? i % 2 : i) * (w + 0.12), y = 1.08 + (n === 4 ? Math.floor(i / 2) : 0) * (h + 0.08), c = i % 2 ? C.accent : LILAC;
          t.rect(s, x, y, w, h, '2B2740', { r: 0.06, name: 'Plate' });
          await web(s, 6, 0.3, x + w - 0.38, y + 0.38);
          t.img(s, await k.icon(it.icon, c, 2), x + 0.15, y + 0.13, 0.36, 0.36);
          if (n === 4) { hd(s, it.h, x + 0.6, y + 0.09, w - 1.35, 0.44, { color: c }); bd(s, it.t, x + 0.15, y + 0.6, w - 0.3, h - 0.66, { color: 'FFFFFF', max: 12.5 }); }
          else { hd(s, it.h, x + 0.15, y + 0.72, w - 0.3, 0.6, { color: c }); bd(s, it.t, x + 0.15, y + 1.36, w - 0.3, h - 1.44, { color: 'FFFFFF', max: 13 }); }
        }
      },
      async (d) => { // the web hangs behind the title at the top, strands fall to the head of each column
        const s = pg(d), n = d.items.length, w = 9.2 / n, cx = 5, cy = 0.5, yh = 2.02;
        await spun(s, cx, cy, 1.5, { n: 16, rings: 4 });
        t.rect(s, 2.1, 0.22, 5.8, 0.72, C.bg, { t: 8, name: 'Plate' });
        top(s, d, { title: { x: 2.1, y: 0.22, w: 5.8, h: 0.72, max: 20, align: 'center' } });
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, c = x + w / 2, col = i % 2 ? MOSS : C.fill;
          thread(s, cx, 1.0, c, yh, C.web, 1, null);
          t.oval(s, c - 0.27, yh - 0.07, 0.54, 0.54, 'FFFFFF', { line: { color: col, width: 1.75 } });
          t.img(s, await k.icon(it.icon, col, 2), c - 0.14, yh + 0.06, 0.28, 0.28);
          hd(s, it.h, x + 0.08, yh + 0.52, w - 0.16, 0.54, { align: 'center', max: 14, color: col });
          bd(s, it.t, x + 0.08, yh + 1.08, w - 0.16, 5.2 - yh - 1.08, { align: 'center', max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // the thread zigzags from node to node, the words hang under each by turns
        const s = pg(d), n = d.steps.length, w = 9.2 / n, y1 = 1.28, y2 = 1.72, dd = 0.56; top(s, d);
        const pts = d.steps.map((_, i) => [0.4 + i * w + 0.28, i % 2 ? y2 : y1]);
        for (let i = 0; i < n - 1; i++) thread(s, pts[i][0], pts[i][1] + dd / 2, pts[i + 1][0], pts[i + 1][1] + dd / 2, C.fill, 2, null);
        for (const [i, st] of d.steps.entries()) {
          const [cx, y] = pts[i], x = cx - 0.28, ty = y + dd + 0.08;
          drop(s, i + 1, x, y, dd, i % 2 ? C.accent : C.fill, i % 2 ? NIGHT : 'FFFFFF', 17);
          hd(s, st.h, x, ty, w - 0.18, 0.54, { valign: 'top', max: 14, color: i % 2 ? MOSS : C.fill });
          bd(s, st.t, x, ty + 0.56, w - 0.18, 5.2 - ty - 0.56, { max: 13 });
        }
      },
      async (d) => { // a spiral is spun out from the centre, each turn a step listed at the right
        const s = pg(d), n = d.steps.length, cx = 2.45, cy = 3.08, P = 100; let pth = '';
        for (let a = 0; a <= 4 * 2 * Math.PI; a += 0.12) { const r = 18 + (a / (8 * Math.PI)) * 182; pth += `${pth ? 'L' : 'M'}${(200 + r * Math.cos(a)).toFixed(1)},${(200 + r * Math.sin(a)).toFixed(1)} `; }
        await web(s, 8, 2.05, cx, cy);
        t.img(s, await k.svg('spiral', `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 400 400"><path d="${pth}" fill="none" stroke="#${C.fill}" stroke-width="2.5"/></svg>`, 800, 800), cx - 2.05, cy - 2.05, 4.1, 4.1);
        top(s, d, { footAlign: 'right' });
        const rh = 4.08 / n;
        for (const [i, st] of d.steps.entries()) {
          const y = 1.06 + i * rh, a = -Math.PI / 2 + (i + 0.5) * (2 * Math.PI / n), r = 0.75 + i * 0.3, dx = cx + r * Math.cos(a), dy = cy + r * Math.sin(a);
          drop(s, i + 1, dx - 0.2, dy - 0.2, 0.4, i % 2 ? C.accent : C.fill, i % 2 ? NIGHT : 'FFFFFF', 14);
          drop(s, i + 1, 4.8, y + 0.02, 0.4, i % 2 ? C.accent : C.fill, i % 2 ? NIGHT : 'FFFFFF', 14);
          hd(s, st.h, 5.3, y, 4.3, 0.42, { color: i % 2 ? MOSS : C.fill });
          bd(s, st.t, 5.3, y + 0.44, 4.3, rh - 0.5, { max: 12.5, ls: 1.1 });
        }
      },
      async (d) => { // night: a spider lets itself down a single thread, past each step in turn
        const s = pg(d, { night: true }), n = d.steps.length, xc = 5, y0 = 1.06, rh = (5.1 - y0) / n, w = 4.15; top(s, d, { night: true });
        t.line(s, xc, 0.95, 0, 3.77, C.web, 1);
        await spider(s, xc - 0.3, 4.6, 0.6, LILAC);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, left = i % 2 === 0, x = left ? xc - 0.34 - w : xc + 0.34, a = left ? 'right' : 'left', yy = Math.min(y, 4.1), hh = Math.min(rh * 1.6, 5.2 - y);
          drop(s, i + 1, xc - 0.2, y, 0.4, left ? LILAC : C.accent, NIGHT, 14);
          hd(s, st.h, x, y, w, 0.38, { color: left ? LILAC : C.accent, align: a });
          bd(s, st.t, x, y + 0.4, w, hh - 0.42, { color: 'FFFFFF', align: a, max: 12.5 });
        }
      },
      async (d) => { // one long diagonal strand across the page, each step tied to it and reading out to the right
        const s = pg(d), n = d.steps.length, rh = 4.0 / n, ind = n === 4 ? 0.82 : 1.1, y0 = 1.12, x0 = 0.45; top(s, d);
        await spun(s, 10, 5.625, 2.2, { n: 20, rings: 4, color: 'D7DBE5' });
        thread(s, x0 + 0.22, y0 + 0.22, x0 + 0.22 + (n - 1) * ind, y0 + 0.22 + (n - 1) * rh, C.fill, 1.75, null);
        for (const [i, st] of d.steps.entries()) {
          const x = x0 + i * ind, y = y0 + i * rh, xx = x + 0.56, ww = Math.min(6.4, 9.6 - xx);
          drop(s, i + 1, x, y, 0.44, i % 2 ? C.accent : C.fill, i % 2 ? NIGHT : 'FFFFFF', 15);
          t.rect(s, xx - 0.03, y - 0.02, ww + 0.03, rh - 0.04, C.bg, { name: 'Plate' });
          hd(s, st.h, xx, y, ww, 0.34, { color: i % 2 ? MOSS : C.fill, max: 14 });
          bd(s, st.t, xx, y + 0.36, ww, rh - 0.42, { max: 12.5, ls: 1.08 });
        }
      },
    ],
    stats: [
      async (d) => { // three small webs side by side, a number caught in the middle of each
        const s = pg(d), w = 9.2 / 3, r = 1.15; top(s, d);
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2, cy = 2.2, col = i === 1 ? MOSS : C.fill;
          await web(s, 6, r, cx, cy);
          t.rect(s, cx - 1.05, cy - 0.42, 2.1, 0.84, C.bg, { t: 8, name: 'Plate' });
          k.head(s, v.value, cx - 1.02, cy - 0.42, 2.04, 0.84, { max: 34, min: 16, color: col, align: 'center', ls: 1 });
          bd(s, v.label, x + 0.14, 3.42, w - 0.28, 0.66, { align: 'center', max: 13 });
        }
        if (d.note) { t.line(s, 0.4, 4.14, 9.2, 0, C.web, 0.75, { dash: 'sysDot' }); bd(s, d.note, 0.4, 4.2, 9.2, 1.02, { color: C.muted, align: 'center', max: 12.5 }); }
      },
      async (d) => { // night: the lead number in a great web at the left, two more stand off on threads
        const s = pg(d, { night: true }), [a, ...rest] = d.stats, cx = 2.6, cy = 3.05;
        await spun(s, cx, cy, 3.4, { color: STRAND, n: 14, rings: 6 }); top(s, d, { night: true });
        k.head(s, a.value, 0.3, 2.0, 4.6, 1.3, { max: 64, min: 28, color: C.accent, align: 'center', ls: 1 });
        bd(s, a.label, 0.7, 3.3, 3.8, 0.8, { color: 'FFFFFF', align: 'center', max: 15 });
        for (const [i, v] of rest.entries()) {
          const y = 1.1 + i * 1.36;
          thread(s, cx + 1.9, cy, 5.75, y + 0.34, LILAC, 1, null);
          t.oval(s, 5.68, y + 0.27, 0.14, 0.14, LILAC);
          k.head(s, v.value, 5.95, y, 3.65, 0.68, { max: 32, min: 16, color: LILAC });
          bd(s, v.label, 5.95, y + 0.68, 3.65, 0.62, { color: 'FFFFFF', max: 12.5 });
        }
        if (d.note) bd(s, d.note, 5.95, 3.84, 3.65, 1.38, { color: FOG, italic: true, max: 12 });
      },
      async (d) => { // the numbers are three anchor points of a triangle, the web stretched between them
        const s = pg(d), cx = 5, ya = 1.92; top(s, d);
        await spun(s, cx, 3.0, 1.05, { n: 3, rings: 4, color: C.fill, sw: 2 });
        const spots = [[3.2, 0.92, 3.6, 'center'], [0.4, 2.74, 3.2, 'right'], [6.4, 2.74, 3.2, 'left']];
        thread(s, 3.65, 3.2, 6.35, 3.2, C.fill, 1, null);
        for (const [i, v] of d.stats.entries()) {
          const [x, y, w, al] = spots[i], col = i === 1 ? MOSS : C.fill;
          k.head(s, v.value, x, y, w, 0.62, { max: 34, min: 16, color: col, align: al, ls: 1 });
          bd(s, v.label, x, y + 0.62, w, i === 0 ? 0.4 : 0.8, { align: al, max: 13 });
        }
        if (d.note) bd(s, d.note, 0.4, 4.4, 9.2, 0.84, { color: C.muted, italic: true, align: 'center', max: 12 });
      },
    ],
    compare: [
      async (d) => { // two strands across the page, each side's points hang from its own, one above the other
        const s = pg(d), H = 2.0; top(s, d);
        [[d.left, 1.0, PALE, C.fill], [d.right, 3.14, PALEG, MOSS]].forEach(([sd, y, f, c]) => {
          t.rect(s, 0, y, 10, H, f, { name: 'Band' });
          k.head(s, sd.h, 0.4, y + 0.06, 8.8, 0.42, { max: 16, min: 12, color: c });
          const n = sd.items.length, w = 9.2 / n, ty = y + 0.56;
          t.line(s, 0.4, ty, 9.2, 0, c, 1.25);
          sd.items.forEach((it, j) => { const x = 0.4 + j * w; t.oval(s, x, ty - 0.07, 0.14, 0.14, c); bd(s, it, x, ty + 0.12, w - 0.16, H - 0.72, { max: 12.5, ls: 1.1 }); });
        });
      },
      async (d) => { // one strand cuts the page on a slant: dark and light on its two sides
        const s = k.slide(C.bg), w = 3.95, top0 = 1.82, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.18, 5.2 - top0);
        t.img(s, await k.svg('slant', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563"><polygon points="0,0 545,0 455,563 0,563" fill="#${NIGHT}"/><line x1="545" y1="0" x2="455" y2="563" stroke="#${C.accent}" stroke-width="3"/></svg>`, 1000, 563), 0, 0, 10, 5.625);
        k.head(s, d.title || '', 0.4, 0.22, 3.95, 0.8, { max: 20, min: 13, color: 'FFFFFF', valign: 'top' });
        k.txt(s, String(k.idx), 9.0, 0.25, 0.6, 0.65, { size: 16, bold: true, color: C.fill, align: 'right', valign: 'middle' });
        [d.left, d.right].forEach((sd, i) => { const x = i ? 5.65 : 0.4, ink = i ? C.ink : 'FFFFFF', c = i ? C.fill : C.accent;
          k.head(s, sd.h, x, 1.12, w, 0.56, { max: 18, min: 12, color: c }); let y = top0;
          sd.items.forEach((it, j) => { t.oval(s, x - 0.02, y + 0.06, 0.12, 0.12, c); k.txt(s, it, x + 0.2, y, w - 0.2, rr[j], { size: fs, color: ink, ls: 1 }); y += rr[j]; }); });
        k.foot(s, { x: 5.65, y: 5.32, size: 7, w: 3.95 });
      },
    ],
    statement: [
      async (d) => { // night: the sentence caught at the heart of a web that fills the page
        const s = pg(d, { night: true });
        await spun(s, 5, 2.7, 6.2, { n: 18, rings: 9, color: STRAND });
        t.rect(s, 0.9, 1.1, 8.2, 3.9, NIGHT, { t: 12, name: 'Plate' }); top(s, d, { night: true, title: { x: 0.4, w: 8.2 } });
        k.head(s, L.runs(d.text), 1.15, 1.18, 7.7, 2.25, { max: 30, min: 15, color: 'FFFFFF', align: 'center' });
        t.line(s, 4.3, 3.5, 1.4, 0, C.accent, 2);
        if (d.caption) bd(s, d.caption, 1.15, 3.6, 7.7, 1.34, { color: FOG, align: 'center', max: 12.5 });
      },
      async (d) => { // a web spun in the bottom corner, a spider waiting; the sentence sits free above it
        const s = pg(d);
        await spun(s, 0, 5.625, 3.5, { n: 24, rings: 6 }); top(s, d, { noFoot: true });
        t.line(s, 1.0, 0.92, 0, 2.3, C.web, 1); await spider(s, 0.72, 3.14, 0.56, C.ink);
        k.head(s, L.runs(d.text), 2.15, 1.05, 7.45, 2.35, { max: 30, min: 15, color: C.fill });
        if (d.caption) { t.rect(s, 3.15, 3.5, 6.45, 1.7, C.bg, { t: 10, name: 'Plate' }); bd(s, d.caption, 3.3, 3.55, 6.3, 1.6, { color: C.muted, max: 13 }); }
        k.foot(s, { x: 3.3, y: 5.32, size: 7.5, w: 6.3 });
      },
    ],
    timeline: [
      async (d) => { // one main strand sags across the page; the years are knots on it, the events hang beneath
        const s = pg(d), w = 9.2 / 4, y0 = 1.25, sag = [0, 0.3, 0.3, 0]; top(s, d);
        t.img(s, await k.svg('sag', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="160"><path d="M0,10 Q800,170 1600,10" fill="none" stroke="#${C.fill}" stroke-width="4"/></svg>`, 1600, 160), 0, y0 - 0.02, 10, 1.0);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, c = x + w / 2, u = c / 10, y = y0 + 0.97 * 2 * u * (1 - u) * (1.0) - 0.02, col = i % 2 ? MOSS : C.fill;
          t.oval(s, c - 0.1, y - 0.1, 0.2, 0.2, i % 2 ? C.accent : C.fill);
          t.line(s, c, y + 0.1, 0, 2.2 - y - 0.1, C.web, 0.75, { dash: 'sysDot' });
          k.head(s, it.year, x + 0.06, 2.2, w - 0.12, 0.44, { max: 20, min: 12, color: col, align: 'center' });
          hd(s, it.h, x + 0.06, 2.64, w - 0.12, 0.36, { align: 'center', max: 13.5 });
          bd(s, it.t, x + 0.06, 3.02, w - 0.12, 2.2, { align: 'center', max: 12.5 });
        }
      },
      async (d) => { // night: rings grow out from the corner, each event sits on its own ring
        const s = pg(d, { night: true }), cx = 0, cy = 5.625, rs = [1.85, 2.75, 3.65, 4.55]; 
        let g = ''; for (const r of [...rs, 5.45, 6.35]) g += `<circle cx="${cx * 160}" cy="${cy * 160}" r="${r * 160}" fill="none" stroke="#${STRAND}" stroke-width="2"/>`;
        t.img(s, await k.svg('rings', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${g}</svg>`, 1600, 900), 0, 0, 10, 5.625);
        top(s, d, { night: true }); const rh = 0.98;
        for (const [i, it] of d.items.entries()) {
          const y = 1.1 + i * rh, ay = y + 0.2, dy = cy - ay, r = rs[3 - i] + 1.4, x = Math.sqrt(Math.max(0.1, r * r - dy * dy)) - 1.9, xx = Math.max(0.4, x), col = i % 2 ? C.accent : LILAC, ww = 9.6 - xx - 1.45;
          t.oval(s, xx - 0.08, ay - 0.08, 0.16, 0.16, col);
          k.head(s, it.year, xx + 0.14, y, 1.3, 0.4, { max: 15, min: 10, color: col });
          hd(s, it.h, xx + 1.45, y, ww, 0.34, { color: 'FFFFFF', max: 13.5 });
          bd(s, it.t, xx + 1.45, y + 0.34, ww, rh - 0.38, { color: FOG, max: 12, ls: 1.05 });
        }
      },
      async (d) => { // a taut strand through the middle of the page, events pinned above and below it by turns
        const s = pg(d), ya = 3.06, w = 4.4; top(s, d);
        t.line(s, 0, ya, 10, 0, C.fill, 2);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, xn = 0.55 + i * 2.3, col = up ? C.fill : MOSS, x = up ? 0.4 + (i / 2) * 4.7 : 0.4 + ((i - 1) / 2) * 4.7;
          thread(s, xn + 0.1, up ? ya - 0.34 : ya, xn + 0.1, up ? ya : ya + 0.34, col, 1, null);
          t.oval(s, xn, ya - 0.1, 0.2, 0.2, up ? C.fill : C.accent);
          k.head(s, it.year, xn + 0.24, up ? ya - 0.42 : ya + 0.08, 1.8, 0.34, { max: 15, min: 10, color: col });
          if (up) { hd(s, it.h, x, 0.98, w, 0.36, { color: col }); bd(s, it.t, x, 1.34, w, ya - 0.48 - 1.34, { max: 12.5 }); }
          else { hd(s, it.h, x, ya + 0.46, w, 0.36, { color: col }); bd(s, it.t, x, ya + 0.82, w, 5.22 - ya - 0.82, { max: 12.5 }); }
        }
      },
    ],
  };
  R.image = V.image.shift(); R.process = V.process.shift(); R.stats = V.stats.shift(); R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: "SlideAI O'rgimchak", colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '312E81', lt2: C.bg, accent1: C.fill, accent2: C.accent, accent3: '06B6D4', accent4: 'F43F5E', accent5: C.muted, accent6: C.web, hlink: C.fill, folHlink: C.muted } });
}
module.exports = { id: 127, slug: 'orgimchak', name: "Örgimçak", category: 'business', photos: true, build, style: { tone: "ko'p o'lchovli tahlil: har bir yo'nalish alohida, lekin umumiy markazga bog'langan", limits: { card_t4: 110, card_t3: 120, side_item: 50 }, prefer: 'data' } };
