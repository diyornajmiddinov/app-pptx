/**
 * 112 Ufq — horizon: the upper part of every slide is a dusk-coloured sky, the title stands ON the horizon
 * line, content lives on the white ground below; items rise from the horizon like posts.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { ink: '1E293B', muted: '64748B', ground: 'FFFFFF', line: '1E293B', accent: 'F97316' };
const F = { head: 'Arial', body: 'Calibri' };
const HZ = 1.85;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const sky = (h) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#312E81"/><stop offset="0.6" stop-color="#C026D3"/><stop offset="1" stop-color="#FB923C"/></linearGradient></defs><rect width="1600" height="${h}" fill="url(#g)"/><circle cx="1300" cy="${h}" r="${h * 0.42}" fill="#FDE68A" opacity="0.9"/></svg>`;
  const page = async (d) => { const s = k.slide(C.ground); t.img(s, await k.svg('sky', sky(296), 1600, 296), 0, 0, 10, HZ); t.line(s, 0, HZ, 10, 0, C.line, 2.5);
    k.head(s, d.title || '', 0.6, 0.3, 6.7, HZ - 0.38, { max: 34, min: 16, color: 'FFFFFF', valign: 'bottom' }); k.txt(s, String(k.idx).padStart(2, '0'), 8.6, 0.25, 0.9, 0.5, { size: 16, bold: true, color: 'FFFFFF', align: 'right' });
    k.foot(s, { y: 5.27 }); return s; };
  const posts = (s, n, draw) => { const w = 8.8 / n; for (let i = 0; i < n; i++) { const x = 0.6 + i * w; t.line(s, x, HZ, 0, 0.35, C.accent, 2.5); t.oval(s, x - 0.07, HZ + 0.32, 0.14, 0.14, C.accent); draw(i, x + 0.15, w - 0.35); } };
  const R = {
    async cover(d) { const s = k.slide(C.ground); t.img(s, await k.svg('skyC', sky(560), 1600, 560), 0, 0, 10, 3.5); t.line(s, 0, 3.5, 10, 0, C.line, 3);
      if (d.image) { await k.photo(s, d.image, 6.4, 0.5, 3.0, 2.6, { mask: { r: 0.08 } }); }
      k.txt(s, k.org3, 0.6, 0.5, 5.6, 0.3, { size: 12, bold: true, color: 'FDE68A' }); k.head(s, d.title, 0.6, 0.9, 5.7, 2.5, { max: 42, min: 20, color: 'FFFFFF', valign: 'bottom' });
      if (d.subtitle) k.txt(s, d.subtitle, 0.6, 3.7, 8.8, 0.6, { max: 13, color: C.muted }); k.txt(s, k.M.author || '', 0.6, 4.35, 8.8, 0.45, { size: 16, bold: true, color: C.accent }); k.foot(s, { y: 5.27 }); },
    async intro(d) { const s = await page(d); await k.photo(s, d.image, 6.3, HZ + 0.25, 3.2, 2.85, { mask: { r: 0.06 } }); k.txt(s, d.text, 0.6, HZ + 0.25, 5.4, 2.85, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { const s = await page(d); await k.photo(s, d.image, 0.6, HZ + 0.25, 3.2, 2.85, { mask: { r: 0.06 } }); k.txt(s, d.text, 4.1, HZ + 0.25, 5.4, 2.85, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async agenda(d) { const s = await page(d), n = d.items.length, per = Math.ceil(n / 2), rh = 3.0 / per; d.items.forEach((it, i) => { const x = 0.6 + Math.floor(i / per) * 4.5, y = HZ + 0.2 + (i % per) * rh; k.txt(s, String(i + 1).padStart(2, '0'), x, y, 0.7, rh, { size: 20, bold: true, color: C.accent, valign: 'middle' }); k.head(s, it, x + 0.75, y, 3.6, rh, { max: 17 }); }); },
    async cards(d) { const s = await page(d); posts(s, d.items.length, (i, x, w) => { k.head(s, d.items[i].h, x, HZ + 0.25, w, 0.55, { max: 16 }); k.txt(s, d.items[i].t, x, HZ + 0.85, w, 2.3, { max: 13, color: C.muted }); }); },
    async process(d) { const s = await page(d); posts(s, d.steps.length, (i, x, w) => { k.txt(s, `${i + 1}`, x, HZ + 0.2, 0.6, 0.55, { size: 24, bold: true, font: F.head, color: C.accent }); k.head(s, d.steps[i].h, x + 0.55, HZ + 0.2, w - 0.55, 0.55, { max: 15 }); k.txt(s, d.steps[i].t, x, HZ + 0.85, w, 2.3, { max: 13, color: C.muted }); }); },
    async stats(d) { const s = await page(d); posts(s, d.stats.length, (i, x, w) => { k.head(s, d.stats[i].value, x, HZ + 0.2, w, 1.1, { max: 54, min: 20, color: i === 0 ? C.accent : C.ink }); k.txt(s, d.stats[i].label, x, HZ + 1.35, w, 1.1, { max: 13, color: C.muted }); });
      if (d.note) k.txt(s, d.note, 0.6, 4.5, 8.8, 0.6, { max: 10, italic: true, color: C.muted }); },
    async compare(d) { const s = await page(d), w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.3, F.body, 0.14, 2.45); t.line(s, 5.0, HZ, 0, 3.2, C.line, 1.5);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.3 : 0.6; k.head(s, sd.h, x, HZ + 0.15, w, 0.5, { max: 18, color: i ? C.ink : C.accent }); let y = HZ + 0.75; sd.items.forEach((it, j) => { k.txt(s, '\u25B8', x, y, 0.3, 0.3, { size: 12, color: C.accent }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = await page({ title: '' }); k.head(s, L.runs(d.text), 0.6, 0.25, 6.7, HZ - 0.3, { max: 34, min: 14, color: 'FFFFFF', valign: 'bottom' }); if (d.caption) k.txt(s, d.caption, 0.6, HZ + 0.3, 8.8, 2.8, { max: 16, color: C.muted, valign: 'top', ls: 1.35 }); },
    async timeline(d) { const s = await page(d); posts(s, d.items.length, (i, x, w) => { k.head(s, d.items[i].year, x, HZ + 0.2, w, 0.55, { max: 22, min: 12, color: C.accent }); k.head(s, d.items[i].h, x, HZ + 0.8, w, 0.45, { max: 15 }); k.txt(s, d.items[i].t, x, HZ + 1.3, w, 1.85, { max: 13, color: C.muted }); }); },
    async quote(d) { const s = await page({ title: '' }); k.head(s, `\u201C${d.text}\u201D`, 0.6, 0.2, 8.8, HZ - 0.25, { max: 28, min: 14, italic: true, color: 'FFFFFF', valign: 'bottom' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 0.6, HZ + 0.3, 8.8, 0.5, { size: 16, bold: true, color: C.accent }); },
    async sources(d) { const s = await page(d), n = d.items.length, rh = 3.15 / n; d.items.forEach((it, i) => k.txt(s, [{ text: `${i + 1}.  `, options: { bold: true, color: C.accent } }, { text: it }], 0.6, HZ + 0.15 + i * rh, 8.8, rh, { max: 13, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all under the same sky: a deck's pages must not look alike (L.pages)
  const DUSK = '312E81', MAUVE = 'C026D3', GLOW = 'FB923C', SUN = 'FDE68A', STAR = 'E2E8F0', FOG = 'CBD5E1', DEEP = '0F172A';
  const dusk = (h, sx, sun = true, deep = false) => { const H = Math.round(h * 160); return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#${DUSK}"/><stop offset="0.6" stop-color="#${deep ? '86198F' : MAUVE}"/><stop offset="1" stop-color="#${deep ? 'B4380C' : GLOW}"/></linearGradient></defs><rect width="1600" height="${H}" fill="url(#g)"/>${sun ? `<circle cx="${sx}" cy="${H}" r="${H * 0.42}" fill="#${SUN}" opacity="0.9"/>` : ''}</svg>`; };
  const stars = () => { let o = '', a = 7; for (let i = 0; i < 90; i++) { a = (a * 73 + 41) % 1009; const x = (a * 13) % 1600; a = (a * 73 + 41) % 1009; const y = (a * 7) % 900; o += `<circle cx="${x}" cy="${y}" r="${1 + (a % 3)}" fill="#fff" opacity="${0.35 + (a % 5) / 10}"/>`; } return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#${DEEP}"/><stop offset="1" stop-color="#${DUSK}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/>${o}</svg>`; };
  const pg = async (d, o = {}) => { // the horizon may stand high or low; title and number stay in the sky
    const hz = o.hz ?? HZ, s = k.slide(C.ground), tb = o.title || {};
    t.img(s, await k.svg(`sky${hz}-${o.sx ?? 1300}-${o.sun !== false}-${!!o.deep}`, dusk(hz, o.sx ?? 1300, o.sun !== false, !!o.deep), 1600, Math.round(hz * 160)), 0, 0, 10, hz);
    t.line(s, 0, hz, 10, 0, C.line, 2.5);
    if (!o.noTitle) k.head(s, d.title || '', tb.x ?? 0.6, tb.y ?? 0.3, tb.w ?? 6.7, tb.h ?? hz - 0.38, { max: tb.max ?? 34, min: 14, color: 'FFFFFF', valign: tb.v || 'bottom' });
    k.txt(s, String(k.idx).padStart(2, '0'), 8.6, 0.25, 0.9, 0.5, { size: 16, bold: true, color: 'FFFFFF', align: 'right' });
    k.foot(s, { y: 5.27, ...(o.foot || {}) });
    return s;
  };
  const night = async (d, o = {}) => { // the sky after dark: stars from top to bottom, white words
    const s = k.slide(DEEP), tb = o.title || {};
    t.img(s, await k.svg('stars', stars(), 1600, 900), 0, 0, 10, 5.625);
    if (o.hz) t.line(s, 0, o.hz, 10, 0, SUN, 1.5);
    if (d.title) k.head(s, d.title, tb.x ?? 0.6, tb.y ?? 0.22, tb.w ?? 7.8, tb.h ?? 0.82, { max: tb.max ?? 28, min: 14, color: 'FFFFFF', valign: 'middle' });
    k.txt(s, String(k.idx).padStart(2, '0'), 8.6, 0.25, 0.9, 0.5, { size: 16, bold: true, color: SUN, align: 'right' });
    k.foot(s, { y: 5.27, color: FOG });
    return s;
  };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: C.muted, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, ...o });
  const num = (s, v, x, y, dd, f, ink, size = 15) => { t.oval(s, x, y, dd, dd, f); k.txt(s, String(v), x, y, dd, dd, { size, bold: true, font: F.head, color: ink, align: 'center', valign: 'middle', ls: 1 }); };
  const V = {
    image: [
      async (d) => { // the picture becomes the sky itself, the title on a band of dusk at its foot
        const s = await pg(d, { noTitle: true, hz: 0.05, sun: false }), hz = 2.85;
        await k.photo(s, d.image, 0, 0, 10, hz);
        t.rect(s, 0, 2.05, 10, hz - 2.05, DUSK, { t: 18, name: 'Dusk band' });
        t.line(s, 0, hz, 10, 0, C.line, 2.5);
        k.head(s, d.title || '', 0.6, 2.08, 8.0, 0.74, { max: 26, min: 14, color: 'FFFFFF' });
        k.txt(s, String(k.idx).padStart(2, '0'), 8.6, 2.08, 0.9, 0.74, { size: 16, bold: true, color: SUN, align: 'right', valign: 'middle' });
        bd(s, d.text, 0.6, 3.0, 8.8, 2.2, { max: 14, color: C.ink, valign: 'middle', ls: 1.22 });
      },
      async (d) => { // the picture stands full height at the left, a cap of sky over the words at the right
        const s = k.slide(C.ground), x = 4.9, w = 10 - x;
        await k.photo(s, d.image, 0, 0, x, 5.625);
        t.img(s, await k.svg('skyR', dusk(1.85, 1420), 1600, 296), x, 0, w, HZ);
        t.line(s, x, HZ, w, 0, C.line, 2.5);
        k.head(s, d.title || '', x + 0.35, 0.3, w - 1.5, HZ - 0.38, { max: 26, min: 14, color: 'FFFFFF', valign: 'bottom' });
        k.txt(s, String(k.idx).padStart(2, '0'), 8.6, 0.25, 0.9, 0.5, { size: 16, bold: true, color: 'FFFFFF', align: 'right' });
        bd(s, d.text, x + 0.35, HZ + 0.12, w - 0.75, 3.18, { max: 13.5, color: C.ink, valign: 'middle', ls: 1.2 });
        k.foot(s, { x: x + 0.1, y: 5.27, w: w - 0.2, size: 7 });
      },
      async (d) => { // the picture rises over the horizon as a great sun
        const hz = 3.45, s = await pg(d, { hz, sun: false, title: { w: 4.6, h: 2.5, y: 0.5 } }), dd = 5.0, x = 4.6;
        t.img(s, await L.photo(L.src(d.image), dd, dd / 2 + 0.6, { mask: { path: 'M0,1 C0,0.42 0.22,0 0.5,0 C0.78,0 1,0.42 1,1 Z' } }), x, hz - dd / 2 - 0.6, dd, dd / 2 + 0.6, { alt: '' });
        bd(s, d.text, 0.6, hz + 0.08, 8.8, 1.72, { max: 13, color: C.ink, valign: 'middle', ls: 1.15 });
      },
      async (d) => { // night: a round picture hangs as the moon, the words below the stars
        const s = await night(d, { title: { w: 5.0, h: 1.05 } }), dd = 3.6, x = 5.9, y = 0.95;
        t.oval(s, x - 0.1, y - 0.1, dd + 0.2, dd + 0.2, SUN);
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
        bd(s, d.text, 0.6, 1.35, 4.9, 3.75, { max: 14, color: 'FFFFFF', valign: 'middle', ls: 1.25 });
      },
    ],
    cards: [
      async (d) => { // a low sky, four marks on the wide ground, a post at each
        const s = await pg(d, { hz: 1.25, title: { y: 0.15, h: 1.0, max: 28 } }), n = d.items.length, w = 4.3, h = 1.92;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.34 + Math.floor(i / 2) * (h + 0.02);
          t.line(s, x, y, 0, h - 0.16, C.accent, 2.5);
          t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.14, y + 0.03, 0.36, 0.36);
          hd(s, it.h, x + 0.58, y, ww - 0.6, 0.42, { color: C.ink });
          bd(s, it.t, x + 0.14, y + 0.48, ww - 0.2, h - 0.62, { ls: 1.15 });
        }
      },
      async (d) => { // mountains stand on the horizon, each peak a thought with its words on the ground below
        const hz = 2.45, s = await pg(d, { hz, sun: false, title: { y: 0.12, h: 0.8, w: 7.9, max: 26, v: 'middle' } }), n = d.items.length, w = 8.8 / n, hts = n === 4 ? [1.35, 1.12, 1.45, 1.05] : [1.35, 1.05, 1.45];
        const peaks = d.items.map((_, i) => { const x0 = (0.6 + i * w) * 160, x1 = x0 + w * 160; return `<polygon points="${x0 - 30},${hz * 160} ${(x0 + x1) / 2},${(hz - hts[i]) * 160} ${x1 + 30},${hz * 160}" fill="#${C.ink}" opacity="${i % 2 ? 0.82 : 1}"/>`; }).join('');
        t.img(s, await k.svg(`peaks${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${hz * 160}">${peaks}</svg>`, 1600, hz * 160), 0, 0, 10, hz);
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * w;
          t.img(s, await k.icon(it.icon, SUN, 2), x + w / 2 - 0.2, hz - 0.5, 0.4, 0.4);
          hd(s, it.h, x + 0.06, hz + 0.08, w - 0.2, 0.52, { color: C.ink, max: 14, align: 'center' });
          bd(s, it.t, x + 0.06, hz + 0.62, w - 0.2, 5.2 - hz - 0.62, { align: 'center', max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // night: the ideas are stars, joined up as a constellation
        const s = await night(d), n = d.items.length, w = 8.8 / n, drop = n === 4 ? [0.36, 0, 0.36, 0] : [0.36, 0, 0.36], y0 = 1.15, pts = d.items.map((_, i) => [0.6 + i * w + 0.27, y0 + drop[i] + 0.27]);
        for (let i = 0; i < n - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; t.line(s, x1, Math.min(y1, y2), x2 - x1, Math.abs(y2 - y1), FOG, 0.75, y2 < y1 ? { flipV: true, dash: 'dash' } : { dash: 'dash' }); }
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * w, y = y0 + drop[i];
          t.oval(s, x, y, 0.54, 0.54, SUN);
          t.img(s, await k.icon(it.icon, DUSK, 2), x + 0.13, y + 0.13, 0.28, 0.28);
          hd(s, it.h, x, y + 0.6, w - 0.18, 0.56, { color: SUN, max: 14, valign: 'top' });
          bd(s, it.t, x, y + 1.16, w - 0.18, 5.15 - y - 1.16, { color: 'FFFFFF', max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // the horizon stands on end: a tall sky at the left holds the first idea
        const s = k.slide(C.ground), [a, ...rest] = d.items, x = 4.2, h = 4.9 / rest.length;
        t.img(s, await k.svg('skyTall', dusk(5.625, 1300, false, true), 1600, 900), 0, 0, x, 5.625);
        t.line(s, x, 0, 0, 5.625, C.line, 2.5);
        k.head(s, d.title || '', 0.45, 0.25, x - 0.85, 1.25, { max: 24, min: 14, color: 'FFFFFF', valign: 'top' });
        t.img(s, await k.icon(a.icon, SUN, 1.75), 0.45, 1.58, 0.6, 0.6);
        hd(s, a.h, 0.45, 2.22, x - 0.85, 0.56, { color: 'FFFFFF', max: 20, min: 13 });
        bd(s, a.t, 0.45, 2.8, x - 0.85, 2.0, { color: 'FFFFFF', max: 13.5, ls: 1.18 });
        for (const [i, it] of rest.entries()) {
          const y = 0.3 + i * h;
          if (i) t.line(s, x + 0.4, y - 0.05, 5.0, 0, 'E2E8F0', 1);
          t.img(s, await k.icon(it.icon, C.accent, 2), x + 0.4, y + 0.03, 0.36, 0.36);
          hd(s, it.h, x + 0.85, y, 4.55, 0.42, { color: C.ink });
          bd(s, it.t, x + 0.85, y + 0.44, 4.55, h - 0.52, { max: 12.5, ls: 1.15 });
        }
        k.txt(s, String(k.idx).padStart(2, '0'), 0.45, 4.85, 1.0, 0.4, { size: 16, bold: true, color: 'FFFFFF', valign: 'middle' });
        k.foot(s, { x: x + 0.3, y: 5.3, w: 5.4, size: 7.5 });
      },
    ],
    process: [
      async (d) => { // a road runs to the horizon, milestones stand along its sides
        const hz = 1.5, s = await pg(d, { hz, sx: 800, title: { y: 0.1, h: 0.75, w: 7.9, max: 24, v: 'top' } }), n = d.steps.length, per = Math.ceil(n / 2), h = (5.15 - hz - 0.1) / per, w = 2.72;
        t.img(s, await k.svg('road', `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="370"><polygon points="195,0 205,0 400,370 0,370" fill="#${C.ink}"/><path d="M200,20 V360" stroke="#${SUN}" stroke-width="5" stroke-dasharray="26 22"/></svg>`, 400, 370), 3.45, hz, 3.1, 5.2 - hz);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 6.72 : 0.6, y = hz + 0.1 + Math.floor(i / 2) * h + (right ? 0.32 : 0), a = right ? 'left' : 'right', hh = Math.min(h - 0.06, 5.18 - y);
          num(s, i + 1, right ? x : x + w - 0.42, y + 0.02, 0.42, C.accent, 'FFFFFF', 14);
          hd(s, st.h, right ? x + 0.48 : x, y, w - 0.48, 0.42, { color: C.ink, align: a, max: 13.5 });
          bd(s, st.t, x, y + 0.44, w, hh - 0.46, { align: a, max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // the sun's path: numbers climb one arc over the sky, words on the ground under each
        const hz = 2.5, s = await pg(d, { hz, sun: false, title: { y: 0.1, h: 0.72, w: 7.9, max: 26, v: 'middle' } }), n = d.steps.length, w = 8.8 / n;
        t.img(s, await k.svg('arc', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${hz * 160}"><path d="M60,${hz * 160} Q800,-30 1540,${hz * 160}" fill="none" stroke="#${SUN}" stroke-width="3" stroke-dasharray="12 12"/></svg>`, 1600, hz * 160), 0, 0, 10, hz);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * w, c = x + w / 2 - 0.1, f = (c - 0.375) / 9.25, y = hz * (1 - 4 * f * (1 - f) * 0.56) - 0.3;
          num(s, i + 1, c - 0.3, Math.max(0.85, y - 0.3), 0.6, SUN, DUSK, 18);
          hd(s, st.h, x, hz + 0.1, w - 0.2, 0.5, { color: C.ink, max: 14, align: 'center' });
          bd(s, st.t, x, hz + 0.62, w - 0.2, 5.2 - hz - 0.62, { align: 'center', max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // great steps in the colours of the sky climb from the ground up to the horizon
        const s = await pg(d, { hz: 1.25, title: { y: 0.15, h: 1.0, max: 28 } }), n = d.steps.length, w = 10 / n, rise = n === 4 ? 0.42 : 0.6, tones = n === 4 ? [C.ink, DUSK, '86198F', 'C2410C'] : [DUSK, '86198F', 'C2410C'], y0 = 1.5 + (n - 1) * rise;
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, y = y0 - i * rise;
          t.rect(s, x, y, w, 5.2 - y, tones[i], { name: 'Step' });
          k.txt(s, String(i + 1), x + 0.2, y + 0.05, 0.7, 0.55, { size: 26, bold: true, font: F.head, color: SUN, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.2, y + 0.6, w - 0.36, 0.52, { color: 'FFFFFF', max: 14, valign: 'top' });
          bd(s, st.t, x + 0.2, y + 1.14, w - 0.34, 5.14 - y - 1.14, { color: 'FFFFFF', max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // night: names stand above the horizon, their words lie reflected below it
        const hz = 2.4, s = await night(d, { hz }), n = d.steps.length, w = 8.8 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * w;
          t.line(s, x, 1.15, 0, hz - 1.15, SUN, 1.5);
          num(s, i + 1, x + 0.1, 1.12, 0.46, SUN, DUSK, 15);
          hd(s, st.h, x + 0.1, 1.64, w - 0.3, hz - 1.7, { color: 'FFFFFF', max: 15, valign: 'bottom' });
          bd(s, st.t, x + 0.1, hz + 0.14, w - 0.3, 5.15 - hz - 0.14, { color: FOG, max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // the first figure sits in the setting sun, the two others on the ground beside it
        const hz = 3.05, s = await pg(d, { hz, sun: false, title: { y: 0.12, h: 0.75, w: 7.9, max: 26, v: 'middle' } }), [a, ...rest] = d.stats, dd = 4.0;
        t.img(s, await k.svg('sunHalf', `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="215"><ellipse cx="200" cy="215" rx="200" ry="215" fill="#${SUN}"/></svg>`, 400, 215), 5 - dd / 2, hz - 2.15, dd, 2.15);
        hd(s, a.value, 3.65, hz - 1.5, 2.7, 0.92, { max: 48, min: 20, color: DUSK, align: 'center' });
        bd(s, a.label, 3.6, hz - 0.58, 2.8, 0.54, { color: DUSK, max: 11.5, align: 'center' });
        rest.forEach((v, i) => { const x = i ? 6.7 : 0.6, w = 2.7, al = i ? 'right' : 'left';
          hd(s, v.value, x, hz - 1.0, w, 0.92, { max: 34, min: 18, color: 'FFFFFF', align: al });
          bd(s, v.label, x, hz + 0.1, w, 0.72, { max: 12.5, color: C.ink, align: al }); });
        if (d.note) bd(s, d.note, 0.6, hz + 0.86, 8.8, 5.2 - hz - 0.88, { italic: true, align: 'center', valign: 'middle', max: 13 });
      },
      async (d) => { // flags on tall posts: figures fly in the sky, their names on the ground at the foot
        const hz = 2.75, s = await pg(d, { hz, sun: false, title: { y: 0.1, h: 0.72, w: 7.9, max: 26, v: 'middle' } }), w = 8.8 / 3, fills = [C.accent, SUN, 'FFFFFF'], ink = ['FFFFFF', DUSK, DUSK];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.6 + i * w, fw = w - 0.3;
          t.line(s, x, 0.92, 0, hz + 0.72 - 0.92, C.ink, 3);
          t.rect(s, x, 0.98, fw, 1.2, fills[i], { name: 'Flag' });
          hd(s, v.value, x + 0.15, 1.02, fw - 0.3, 1.12, { color: ink[i], max: 36, min: 18 });
          bd(s, v.label, x + 0.15, hz + 0.1, fw - 0.1, 0.72, { max: 12.5, color: C.ink });
        }
        if (d.note) bd(s, d.note, 0.6, hz + 0.86, 8.8, 5.2 - hz - 0.88, { italic: true, valign: 'middle', max: 13 });
      },
      async (d) => { // night: three figures high among the stars, the note low down
        const s = await night(d), w = 8.8 / 3, drop = [0.25, 0, 0.42];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.6 + i * w, y = 1.15 + drop[i];
          hd(s, v.value, x, y, w - 0.2, 0.95, { color: i === 1 ? SUN : 'FFFFFF', max: 42, min: 20 });
          t.line(s, x, y + 0.98, w - 0.5, 0, SUN, 1);
          bd(s, v.label, x, y + 1.04, w - 0.3, 0.72, { color: FOG, max: 12.5 });
        }
        if (d.note) bd(s, d.note, 0.6, 3.5, 8.8, 1.62, { color: 'FFFFFF', max: 14, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // day against night: the page parts along its axis, sides mirrored
        const s = k.slide(DEEP);
        t.img(s, await k.svg('stars', stars(), 1600, 900), 0, 0, 10, 5.625);
        t.img(s, await k.svg('skyHalf', dusk(5.625, 800, false, true), 1600, 900), 0, 0, 5, 5.625);
        k.head(s, d.title || '', 0.6, 0.2, 7.8, 0.82, { max: 28, min: 14, color: 'FFFFFF' });
        k.txt(s, String(k.idx).padStart(2, '0'), 8.6, 0.25, 0.9, 0.5, { size: 16, bold: true, color: SUN, align: 'right' });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.35 : 0.5, w = 4.15, a = i ? 'left' : 'right', n = sd.items.length, rh = 2.92 / n;
          hd(s, sd.h, x, 1.12, w, 0.68, { max: 19, min: 12, color: i ? SUN : 'FFFFFF', align: a });
          sd.items.forEach((it, j) => bd(s, it, x, 1.9 + j * rh, w, rh - 0.05, { color: 'FFFFFF', align: a, valign: 'middle', ls: 1.15 }));
        }
        k.foot(s, { y: 5.27, color: 'FFFFFF', x: 0.5, w: 9.0 });
      },
      async (d) => { // one side in the sky, the other on the ground, the horizon between
        const hz = 2.95, s = await pg(d, { hz, sun: false, deep: true, title: { y: 0.12, h: 0.72, w: 7.9, max: 26, v: 'middle' } });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? hz + 0.1 : 0.88, h = i ? 5.2 - hz - 0.12 : hz - 0.96, n = sd.items.length, x0 = 2.55, w = (9.4 - x0) / n, ink = i ? C.ink : 'FFFFFF';
          hd(s, sd.h, 0.6, y, 1.8, h, { max: 18, min: 12, color: i ? C.accent : SUN });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.line(s, x, y + 0.06, 0, h - 0.12, i ? C.accent : SUN, 1.5); bd(s, it, x + 0.12, y + 0.02, w - 0.2, h - 0.04, { color: ink, valign: 'middle', max: 12.5, ls: 1.12 }); });
        }
      },
    ],
    statement: [
      async (d) => { // nearly all sky: a low horizon, the thought in the dusk, its note on the last strip of land
        const hz = 3.95, s = await pg(d, { hz, sx: 1250, deep: true, title: { y: 0.2, h: 0.68, w: 7.9, max: 20, v: 'middle' } });
        k.head(s, L.runs(d.text), 0.6, 0.95, 5.5, hz - 1.05, { max: 36, min: 18, color: 'FFFFFF' });
        if (d.caption) bd(s, d.caption, 0.6, hz + 0.08, 8.8, 5.2 - hz - 0.1, { max: 12.5, color: C.ink, valign: 'middle', ls: 1.1 });
      },
      async (d) => { // night: a crescent hangs at the right of the words
        const s = await night(d);
        t.oval(s, 7.15, 1.25, 2.3, 2.3, SUN);
        t.oval(s, 6.6, 1.05, 2.3, 2.3, DEEP);
        k.head(s, L.runs(d.text), 0.6, 1.15, 6.2, 2.6, { max: 34, min: 17, color: 'FFFFFF' });
        if (d.caption) { t.line(s, 0.6, 3.82, 8.8, 0, SUN, 1); bd(s, d.caption, 0.6, 3.92, 8.8, 1.24, { color: FOG, max: 13.5 }); }
      },
    ],
    timeline: [
      async (d) => { // four skies from dawn to night, the sun lower in each, a year in the air
        const hz = 2.05, s = await pg(d, { hz, sun: false, title: { y: 0.08, h: 0.68, w: 7.9, max: 26, v: 'middle' } }), w = 2.5, sky = ['F59E0B', 'DB2777', '7C3AED', DEEP], lift = [1.05, 0.8, 0.55, 0.3];
        for (const [i, it] of d.items.entries()) {
          const x = i * w;
          t.rect(s, x, 0.8, w, hz - 0.8, sky[i], { name: 'Sky' });
          t.oval(s, x + w - 0.72, hz - lift[i] - 0.25, 0.5, 0.5, SUN);
          hd(s, it.year, x + 0.22, 0.86, w - 0.5, hz - 0.92, { color: 'FFFFFF', max: 22, min: 12, valign: 'middle', align: 'left' });
          hd(s, it.h, x + 0.22, hz + 0.1, w - 0.36, 0.5, { color: C.ink, max: 14, align: 'left' });
          bd(s, it.t, x + 0.22, hz + 0.62, w - 0.36, 5.2 - hz - 0.62, { max: 12.5, ls: 1.12 });
        }
        t.line(s, 0, hz, 10, 0, C.line, 2.5);
      },
      async (d) => { // one event in the sky, the next on the ground, posts crossing the horizon
        const hz = 2.98, s = await pg(d, { hz, sun: false, deep: true, title: { y: 0.08, h: 0.68, w: 7.9, max: 26, v: 'middle' } }), w = 3.05, step = 1.92;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * step, sky = i % 2 === 0, y = sky ? 0.8 : hz + 0.1, h = sky ? hz - 0.86 : 5.18 - y, ink = sky ? 'FFFFFF' : C.ink;
          t.line(s, x, hz - 0.22, 0, 0.44, C.accent, 3);
          k.txt(s, [{ text: it.year + '  ', options: { bold: true, color: sky ? SUN : C.accent } }, { text: it.h, options: { bold: true, color: ink } }], x + 0.1, y, w, 0.42, { font: F.head, bold: true, max: 14, min: 10.5, valign: 'middle', ls: 1.05 });
          bd(s, it.t, x + 0.1, y + 0.44, w, h - 0.46, { color: sky ? 'FFFFFF' : C.muted, max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // night: the moon waxes year by year down the left of the page
        const s = await night(d), rh = 3.98 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = 1.14 + i * rh, dd = 0.6, mx = 0.6, my = y + rh / 2 - dd / 2;
          t.oval(s, mx, my, dd, dd, SUN);
          if (i < 3) t.oval(s, mx - (3 - i) * 0.02 + (i - 1.2) * 0.2, my, dd, dd, DEEP);
          hd(s, it.year, 1.4, y + 0.04, 1.6, rh - 0.08, { color: SUN, max: 20, min: 11, align: 'left' });
          hd(s, it.h, 3.05, y + 0.04, 2.05, rh - 0.08, { color: 'FFFFFF', max: 13.5, align: 'left' });
          bd(s, it.t, 5.15, y + 0.04, 4.3, rh - 0.08, { color: FOG, valign: 'middle', max: 12.5, ls: 1.1 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old posts on the horizon were the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Ufq', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '312E81', lt2: 'F8FAFC', accent1: C.accent, accent2: 'C026D3', accent3: '312E81', accent4: 'FDE68A', accent5: C.muted, accent6: 'E2E8F0', hlink: 'C026D3', folHlink: C.muted } });
}
module.exports = { id: 112, slug: 'ufq', name: 'Ufq', category: 'creative', photos: true, build, style: { tone: "istiqbolli va ilhomli: katta maqsad tepada, aniq qadamlar pastda", limits: {}, prefer: null } };
