/**
 * 109 Buklet — a tri-fold brochure laid flat: three vertical panels with fold shadows; the left panel carries
 * the title, the middle panel is coloured, content flows across the panels like a printed leaflet.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FFFFFF', ink: '23303D', muted: '5D6B78', mid: '0F766E', midText: 'FFFFFF', accent: 'F59E0B', side: 'F1F5F4' };
const F = { head: 'Arial', body: 'Calibri' };
const PW = 10 / 3, P = [0, PW, PW * 2];
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const folds = async (s) => { const g = await k.svg('fold', `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="10"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.5" stop-color="#000" stop-opacity="0.16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect width="60" height="10" fill="url(#g)"/></svg>`, 60, 10); t.img(s, g, P[1] - 0.15, 0, 0.3, 5.625); t.img(s, g, P[2] - 0.15, 0, 0.3, 5.625); };
  const page = async (d, midFill = C.mid) => { const s = k.slide(C.paper); t.rect(s, P[0], 0, PW, 5.625, C.side, { name: 'Panel' }); t.rect(s, P[1], 0, PW, 5.625, midFill, { name: 'Panel' }); await folds(s);
    t.rect(s, 0.35, 0.45, 0.6, 0.07, C.accent, { name: 'Accent' }); k.head(s, d.title || '', 0.35, 0.6, PW - 0.65, 2.2, { max: 28, min: 14, valign: 'top' });
    k.txt(s, String(k.idx).padStart(2, '0'), 0.35, 4.2, 1.5, 0.7, { size: 30, bold: true, font: F.head, color: C.mid });
    k.foot(s, { x: 0.35, y: 4.95, w: PW - 0.6, size: 7, color: C.muted }); return s; };
  // place items in the middle (light text) and right (dark text) panels
  const flow = (s, n, draw) => { const per = Math.ceil(n / 2), h = 4.8 / per; for (let i = 0; i < n; i++) { const p = i < per ? 1 : 2, j = p === 1 ? i : i - per; draw(i, P[p] + 0.35, 0.4 + j * h, PW - 0.7, h, p === 1 ? C.midText : C.ink, p === 1 ? 'CCEDE9' : C.muted); } };
  const R = {
    async cover(d) { const s = k.slide(C.paper); t.rect(s, P[0], 0, PW, 5.625, C.side, { name: 'Panel' }); t.rect(s, P[1], 0, PW, 5.625, C.mid, { name: 'Panel' }); await folds(s);
      if (d.image) await k.photo(s, d.image, P[2], 0, PW, 2.9);
      k.head(s, d.title, P[2] + 0.35, 3.05, PW - 0.6, 1.6, { max: 26, min: 14, valign: 'top' }); if (d.subtitle) k.txt(s, d.subtitle, P[2] + 0.35, 4.65, PW - 0.6, 0.7, { max: 11, color: C.muted });
      k.txt(s, k.M.author || '', P[1] + 0.35, 0.6, PW - 0.7, 0.8, { max: 18, bold: true, font: F.head, color: C.midText }); k.txt(s, k.org3.replace(/ {2}\u2022 {2}/g, '\n'), P[1] + 0.35, 1.5, PW - 0.7, 1.5, { max: 13, color: 'CCEDE9' });
      k.txt(s, k.M.topic || '', 0.35, 0.6, PW - 0.7, 2.0, { max: 16, italic: true, color: C.muted }); k.foot(s, { x: 0.35, y: 5.2, w: PW - 0.6, size: 7 }); },
    async intro(d) { const s = await page(d); await k.photo(s, d.image, P[1], 0, PW, 5.625); k.txt(s, d.text, P[2] + 0.35, 0.45, PW - 0.7, 4.7, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = await page(d); k.txt(s, d.text, P[1] + 0.35, 0.45, PW - 0.7, 4.7, { max: 15, min: 10, ls: 1.35, valign: 'middle', color: C.midText }); await k.photo(s, d.image, P[2], 0, PW, 5.625); },
    async agenda(d) { const s = await page(d); flow(s, d.items.length, (i, x, y, w, h, c1) => { k.txt(s, String(i + 1).padStart(2, '0'), x, y, 0.7, Math.min(h, 0.7), { size: 22, bold: true, font: F.head, color: C.accent }); k.head(s, d.items[i], x + 0.75, y, w - 0.75, Math.min(h, 0.7), { max: 16, color: c1 }); }); },
    async cards(d) { const s = await page(d); flow(s, d.items.length, (i, x, y, w, h, c1, c2) => { k.head(s, d.items[i].h, x, y, w, 0.5, { max: 16, color: c1 }); k.txt(s, d.items[i].t, x, y + 0.52, w, h - 0.62, { max: 13, color: c2 }); }); },
    async process(d) { const s = await page(d); flow(s, d.steps.length, (i, x, y, w, h, c1, c2) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.5, { max: 16, color: c1 }); k.txt(s, d.steps[i].t, x, y + 0.52, w, h - 0.62, { max: 13, color: c2 }); }); },
    async stats(d) { const s = await page(d); flow(s, d.stats.length, (i, x, y, w, h, c1, c2) => { k.head(s, d.stats[i].value, x, y, w, Math.min(1.2, h * 0.5), { max: 48, min: 18, color: i === 0 ? C.accent : c1 }); k.txt(s, d.stats[i].label, x, y + Math.min(1.2, h * 0.5), w, h - Math.min(1.2, h * 0.5) - 0.1, { max: 13, color: c2 }); });
      if (d.note) k.txt(s, d.note, 0.35, 2.9, PW - 0.65, 1.2, { max: 11, italic: true, color: C.muted }); },
    async compare(d) { const s = await page(d), w = PW - 0.7, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w - 0.3, F.body, 0.15, 4.0);
      [d.left, d.right].forEach((sd, i) => { const x = P[1 + i] + 0.35, c = i ? C.ink : C.midText; k.head(s, sd.h, x, 0.4, w, 0.6, { max: 18, color: i ? C.mid : C.accent }); let y = 1.1; sd.items.forEach((it, j) => { k.txt(s, '\u2022', x, y, 0.3, 0.3, { size: 14, bold: true, color: C.accent }); k.txt(s, it, x + 0.3, y, w - 0.3, rr[j], { size: fs, color: c }); y += rr[j]; }); }); },
    async statement(d) { const s = await page(d); k.head(s, L.runs(d.text), P[1] + 0.35, 0.5, PW - 0.7, 4.5, { max: 30, min: 15, color: C.midText, valign: 'middle' }); if (d.caption) k.txt(s, d.caption, P[2] + 0.35, 0.5, PW - 0.7, 4.5, { max: 14, color: C.muted, valign: 'middle', ls: 1.35 }); },
    async timeline(d) { const s = await page(d); flow(s, d.items.length, (i, x, y, w, h, c1, c2) => { k.head(s, d.items[i].year, x, y, w, 0.45, { max: 20, min: 11, color: C.accent }); k.head(s, d.items[i].h, x, y + 0.45, w, 0.42, { max: 14, color: c1 }); k.txt(s, d.items[i].t, x, y + 0.88, w, h - 0.95, { max: 12, color: c2 }); }); },
    async quote(d) { const s = await page({ title: '\u201C' }); k.head(s, d.text, P[1] + 0.35, 0.5, PW - 0.7, 4.0, { max: 26, min: 14, italic: true, color: C.midText, valign: 'middle' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, P[1] + 0.35, 4.55, PW - 0.7, 0.5, { size: 13, bold: true, color: C.accent }); },
    async sources(d) { const s = await page(d); flow(s, d.items.length, (i, x, y, w, h, c1) => k.txt(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.accent } }, { text: d.items[i] }], x, y, w, h, { max: 12, color: c1, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all on the folded leaflet: a deck's pages must not look alike (L.pages)
  const DEEP = '0B5F58', TINT = 'CCEDE9', AMBER = C.accent, BRIGHT = '14B8A6';
  const lit = (c) => c === C.paper || c === C.side || c === TINT || c === AMBER;
  const pg = async (d, o = {}) => { // three panels in any colours, the title on any of them
    const fills = o.fills || [C.side, C.paper, C.paper], tp = o.tp ?? 0, s = k.slide(C.paper), x = P[tp];
    fills.forEach((f, i) => { if (f) t.rect(s, P[i], 0, PW, 5.625, f, { name: 'Panel' }); });
    await folds(s);
    const on = lit(fills[tp] || C.paper), ink = on ? C.ink : 'FFFFFF';
    t.rect(s, x + 0.35, 0.45, 0.6, 0.07, AMBER, { name: 'Accent' });
    k.head(s, d.title || '', x + 0.35, 0.6, PW - 0.65, 2.2, { max: 28, min: 14, valign: 'top', color: ink });
    k.txt(s, String(k.idx).padStart(2, '0'), x + 0.35, 4.2, 1.5, 0.7, { size: 30, bold: true, font: F.head, color: on ? C.mid : AMBER });
    k.foot(s, { x: x + 0.35, y: 4.95, w: PW - 0.6, size: 7, color: on ? C.muted : TINT });
    return s;
  };
  const banner = async (d, o = {}) => { // the leaflet opened wide: the title runs across a deep band over all three panels
    const s = k.slide(o.bg || C.paper);
    await folds(s);
    t.rect(s, 0, 0, 10, 1.22, o.band || C.mid, { name: 'Banner' });
    t.rect(s, 0.35, 0.2, 0.6, 0.07, AMBER, { name: 'Accent' });
    k.head(s, d.title || '', 0.35, 0.3, 8.1, 0.82, { max: 28, min: 14, color: 'FFFFFF' });
    k.txt(s, String(k.idx).padStart(2, '0'), 8.5, 0.3, 1.15, 0.82, { size: 30, bold: true, font: F.head, color: AMBER, align: 'right', valign: 'middle' });
    k.foot(s, { x: 0.35, y: 5.33, w: 9.3, size: 7.5, color: o.foot || C.muted });
    return s;
  };
  const bd = (s, v, x, y, w, h, color, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color, ...o });
  const hd = (s, v, x, y, w, h, color, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color, valign: 'top', ...o });
  const num = (s, v, x, y, w, h, size, color, o = {}) => k.txt(s, String(v), x, y, w, h, { size, bold: true, font: F.head, color, align: 'center', valign: 'middle', ls: 1, ...o });
  const V = {
    image: [
      async (d) => { // a panorama across two panels, the words on the paper under it
        const s = await pg(d);
        await k.photo(s, d.image, P[1], 0, PW * 2, 3.05);
        await folds(s);
        bd(s, d.text, P[1] + 0.35, 3.2, PW * 2 - 0.7, 2.2, C.ink, { max: 14, valign: 'middle', ls: 1.22 });
      },
      async (d) => { // the picture fills the leaflet, its middle panel stays closed over it
        const s = k.slide(C.paper);
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, P[1], 0, PW, 5.625, C.mid, { shadow: 0.35, blur: 10, offset: 0, name: 'Panel' });
        t.rect(s, P[1] + 0.3, 0.3, 0.6, 0.07, AMBER, { name: 'Accent' });
        k.head(s, d.title || '', P[1] + 0.3, 0.42, PW - 0.6, 1.0, { max: 20, min: 13, color: 'FFFFFF', valign: 'top' });
        bd(s, d.text, P[1] + 0.3, 1.48, PW - 0.6, 3.45, 'FFFFFF', { max: 12.5, ls: 1.15 });
        k.txt(s, String(k.idx).padStart(2, '0'), P[1] + 0.3, 4.92, 0.8, 0.34, { size: 16, bold: true, font: F.head, color: AMBER, valign: 'middle' });
        k.foot(s, { x: P[1] + 0.3, y: 5.28, w: PW - 0.6, size: 7, color: TINT });
      },
      async (d) => { // all deep colour: a quarter disc of picture grows from the far corner
        const s = await pg(d, { fills: [DEEP, C.mid, C.mid] });
        await k.photo(s, d.image, P[2], 0.5, PW, 5.125, { mask: { path: 'M1,1 L0,1 A1,1 0 0 1 1,0 Z' } });
        bd(s, d.text, P[1] + 0.3, 0.42, PW - 0.55, 4.8, 'FFFFFF', { max: 15, ls: 1.28, valign: 'middle' });
      },
      async (d) => { // the leaflet turned round: picture first, title in the middle, words last
        const s = await pg(d, { fills: [C.paper, C.mid, C.paper], tp: 1 });
        await k.photo(s, d.image, P[0], 0, PW, 5.625);
        await folds(s);
        bd(s, d.text, P[2] + 0.35, 0.45, PW - 0.7, 4.7, C.ink, { max: 15, valign: 'middle', ls: 1.3 });
      },
    ],
    cards: [
      async (d) => { // a mosaic of tiles over the two open panels, one tile wide if three
        const s = await pg(d), n = d.items.length, w = PW, h = 5.625 / 2, fills = [C.mid, TINT, AMBER, C.ink];
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? PW * 2 : w, x = P[1] + (i % 2) * w, y = Math.floor(i / 2) * h, f = fills[i], ink = lit(f) ? C.ink : 'FFFFFF';
          t.rect(s, x, y, ww, h, f, { name: 'Tile' });
          t.img(s, await k.icon(it.icon, lit(f) ? DEEP : AMBER, 2), x + 0.28, y + 0.24, 0.36, 0.36);
          hd(s, it.h, x + 0.74, y + 0.2, ww - 0.98, 0.46, ink, { valign: 'middle' });
          bd(s, it.t, x + 0.28, y + 0.74, ww - 0.54, h - 0.86, ink, { max: 12.5 });
        }
        await folds(s);
      },
      async (d) => { // opened wide under a banner: each fold-section holds one idea
        const s = await banner(d), n = d.items.length, w = 10 / n;
        for (const [i, it] of d.items.entries()) {
          const x = i * w, f = i % 2 ? C.side : C.paper;
          t.rect(s, x, 1.22, w, 4.08, f, { name: 'Section' });
          t.oval(s, x + 0.28, 1.42, 0.6, 0.6, C.mid);
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), x + 0.43, 1.57, 0.3, 0.3);
          hd(s, it.h, x + 0.28, 2.1, w - 0.5, 0.58, C.ink);
          bd(s, it.t, x + 0.28, 2.7, w - 0.5, 2.55, C.muted);
        }
        await folds(s);
      },
      async (d) => { // coupons to tear out along a dashed line, with a stub for the icon
        const s = await pg(d), n = d.items.length, y0 = 0.32, H0 = 4.98, gap = 0.1, h = (H0 - (n - 1) * gap) / n, x = P[1] + 0.3, w = PW * 2 - 0.6, stub = 0.95;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * (h + gap);
          t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: C.mid, width: 1, dashType: 'dash' }, name: 'Coupon' });
          t.rect(s, x, y, stub, h, i % 2 ? AMBER : C.mid, { name: 'Stub' });
          t.img(s, await k.icon(it.icon, i % 2 ? C.ink : 'FFFFFF', 2), x + stub / 2 - 0.2, y + h / 2 - 0.2, 0.4, 0.4);
          hd(s, it.h, x + stub + 0.16, y + 0.06, w - stub - 0.3, 0.4, C.mid, { valign: 'middle' });
          bd(s, it.t, x + stub + 0.16, y + 0.46, w - stub - 0.3, h - 0.5, C.ink, { max: 12.5, ls: 1.15 });
        }
        k.txt(s, '✂', x - 0.28, y0 - 0.04, 0.3, 0.3, { size: 13, color: C.mid, font: 'Arial', ls: 1, valign: 'middle', align: 'center' });
      },
      async (d) => { // the coloured panel carries one idea large, the white panel the others
        const s = await pg(d), [a, ...rest] = d.items, h = 5.0 / rest.length;
        t.rect(s, P[1], 0, PW, 5.625, C.mid, { name: 'Panel' });
        await folds(s);
        t.img(s, await k.icon(a.icon, AMBER, 1.75), P[1] + 0.35, 0.5, 0.78, 0.78);
        hd(s, a.h, P[1] + 0.35, 1.42, PW - 0.7, 0.86, 'FFFFFF', { max: 22, min: 14 });
        bd(s, a.t, P[1] + 0.35, 2.32, PW - 0.7, 2.9, 'FFFFFF', { max: 15 });
        for (const [i, it] of rest.entries()) {
          const y = 0.32 + i * h;
          if (i) t.line(s, P[2] + 0.35, y - 0.06, PW - 0.7, 0, TINT, 1);
          t.img(s, await k.icon(it.icon, C.mid, 2), P[2] + 0.35, y + 0.02, 0.32, 0.32);
          hd(s, it.h, P[2] + 0.76, y, PW - 1.1, 0.4, C.ink, { valign: 'middle', max: 13.5 });
          bd(s, it.t, P[2] + 0.35, y + 0.44, PW - 0.7, h - 0.54, C.muted, { max: 12 });
        }
      },
    ],
    process: [
      async (d) => { // over the open panels the steps climb, each a deeper green
        const s = await pg(d), n = d.steps.length, w = (PW * 2) / n, rise = n === 4 ? 0.55 : 0.8, tones = ['0E8F82', C.mid, DEEP, C.ink], y0 = n === 4 ? 2.1 : 2.0;
        for (const [i, st] of d.steps.entries()) {
          const x = P[1] + i * w, y = y0 - i * rise, f = tones[n === 3 ? i + 1 : i];
          t.rect(s, x, y, w, 5.625 - y, f, { name: 'Step' });
          num(s, i + 1, x + 0.15, y + 0.1, 0.5, 0.5, 26, AMBER, { align: 'left' });
          hd(s, st.h, x + 0.15, y + 0.62, w - 0.28, 0.6, 'FFFFFF', { max: 13.5, min: 10.5 });
          bd(s, st.t, x + 0.15, y + 1.22, w - 0.26, 5.5 - y - 1.22, 'FFFFFF', { max: 12 });
        }
      },
      async (d) => { // deep leaflet: arrows run through the banner, the words below on colour
        const s = await banner(d, { bg: DEEP, band: C.mid, foot: TINT }), n = d.steps.length, w = 9.5 / n;
        t.rect(s, 0, 1.22, 10, 4.4, DEEP, { name: 'Deep' });
        await folds(s);
        k.foot(s, { x: 0.35, y: 5.33, w: 9.3, size: 7.5, color: TINT });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.25 + i * w, last = i === n - 1;
          t.shape(s, 'PENTAGON', { x, y: 1.42, w: w - 0.05, h: 0.92, fill: { color: last ? AMBER : BRIGHT }, objectName: 'Arrow' });
          num(s, i + 1, x + 0.12, 1.42, 0.42, 0.92, 22, last ? C.ink : DEEP);
          hd(s, st.h, x + 0.56, 1.46, w - 1.0, 0.84, last ? C.ink : DEEP, { valign: 'middle', max: 12.5, min: 10 });
          bd(s, st.t, x + 0.14, 2.5, w - 0.32, 2.75, 'FFFFFF');
        }
      },
      async (d) => { // the fold itself is the road: steps stop on either side of it
        const s = await pg(d), n = d.steps.length, per = Math.ceil(n / 2), h = 5.0 / per, cx = P[2], w = PW - 0.65;
        t.rect(s, cx - 0.03, 0, 0.06, 5.625, AMBER, { name: 'Road' });
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 0.3 + Math.floor(i / 2) * h + (right ? 0.62 : 0), x = right ? cx + 0.36 : cx - 0.36 - w, a = right ? 'left' : 'right';
          t.oval(s, cx - 0.25, y, 0.5, 0.5, C.mid);
          num(s, i + 1, cx - 0.25, y, 0.5, 0.5, 15, 'FFFFFF');
          hd(s, st.h, x, y, w, 0.5, C.ink, { align: a, valign: 'middle', max: 14 });
          bd(s, st.t, x, y + 0.54, w, Math.min(h - 0.62, 5.5 - y - 0.54), C.muted, { align: a, max: 12.5 });
        }
      },
      async (d) => { // the title moves to the last panel, numbered bands reach out from the left edge
        const s = await pg(d, { fills: [C.paper, C.paper, C.mid], tp: 2 }), n = d.steps.length, h = 5.625 / n, w = PW * 2;
        for (const [i, st] of d.steps.entries()) {
          const y = i * h;
          t.rect(s, 0, y, w, h, i % 2 ? C.side : C.paper, { name: 'Band' });
          t.rect(s, 0, y, 0.95, h, i === n - 1 ? AMBER : C.mid, { name: 'Number' });
          if (i) t.line(s, 0, y, 0.95, 0, 'FFFFFF', 1);
          num(s, i + 1, 0, y, 0.95, h, 28, i === n - 1 ? C.ink : 'FFFFFF');
          hd(s, st.h, 1.15, y + 0.08, w - 1.35, 0.42, C.ink, { valign: 'middle', max: 14 });
          bd(s, st.t, 1.15, y + 0.5, w - 1.35, h - 0.56, C.muted, { max: 12.5, ls: 1.15 });
        }
        await folds(s);
      },
    ],
    stats: [
      async (d) => { // every panel gives itself to one figure, the title across the top
        const s = await banner(d), fills = [C.side, C.mid, AMBER], inks = [C.ink, 'FFFFFF', C.ink], vals = [C.mid, 'FFFFFF', C.ink], bottom = d.note ? 4.15 : 5.3;
        for (const [i, v] of d.stats.entries()) {
          const x = P[i];
          t.rect(s, x, 1.22, PW, bottom - 1.22, fills[i], { name: 'Panel' });
          hd(s, v.value, x + 0.25, 1.4, PW - 0.5, 1.3, vals[i], { max: 48, min: 20, valign: 'middle' });
          bd(s, v.label, x + 0.25, 2.75, PW - 0.5, bottom - 2.85, inks[i], { max: 14 });
        }
        await folds(s);
        if (d.note) bd(s, d.note, 0.35, 4.22, 9.3, 1.06, C.muted, { max: 13, italic: true, valign: 'middle' });
      },
      async (d) => { // discs on the open panels stepping out and back, each with its words beside it
        const s = await pg(d), dd = 1.68, xs = [P[1] + 0.28, P[1] + 1.05, P[1] + 0.28], fills = [C.mid, AMBER, DEEP], ink = ['FFFFFF', C.ink, 'FFFFFF'];
        for (const [i, v] of d.stats.entries()) {
          const x = xs[i], y = 0.12 + i * 1.8;
          t.oval(s, x, y, dd, dd, fills[i]);
          k.head(s, v.value, x + 0.1, y + 0.1, dd - 0.2, dd - 0.2, { max: 26, min: 14, color: ink[i], align: 'center' });
          bd(s, v.label, x + dd + 0.2, y + 0.1, 9.7 - x - dd - 0.2, dd - 0.2, C.ink, { max: 14, valign: 'middle' });
        }
        if (d.note) bd(s, d.note, 0.35, 2.85, PW - 0.65, 1.3, C.muted, { max: 11, italic: true });
      },
    ],
    compare: [
      async (d) => { // the title stands in the coloured middle, the two sides mirror it
        const s = await pg(d, { fills: [C.side, C.mid, C.side], tp: 1 });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? P[2] + 0.3 : 0.3, w = PW - 0.6, a = i ? 'left' : 'right', n = sd.items.length, rh = 4.2 / n;
          hd(s, sd.h, x, 0.32, w, 0.72, i ? C.mid : DEEP, { max: 18, min: 12, align: a, valign: 'middle' });
          t.rect(s, x + (i ? 0 : w - 0.6), 1.06, 0.6, 0.06, AMBER, { name: 'Accent' });
          sd.items.forEach((it, j) => bd(s, it, x, 1.2 + j * rh, w, rh - 0.06, C.ink, { align: a, valign: 'middle' }));
        }
      },
      async (d) => { // two sheets over the open panels, one above the other
        const s = await pg(d), h = 5.625 / 2;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i * h, n = sd.items.length, f = i ? C.mid : AMBER, ink = i ? 'FFFFFF' : C.ink, w = PW - 0.5, rows = Math.ceil(n / 2), rh = (h - 0.72) / rows;
          t.rect(s, P[1], y, PW * 2, h, f, { name: 'Sheet' });
          hd(s, sd.h, P[1] + 0.28, y + 0.12, PW * 2 - 0.56, 0.52, ink, { max: 18, min: 12, valign: 'middle' });
          sd.items.forEach((it, j) => { const lone = n === 3 && j === 2, x = P[1] + 0.28 + (j % 2) * PW; bd(s, it, x, y + 0.68 + Math.floor(j / 2) * rh, lone ? PW * 2 - 0.56 : w, rh - 0.04, ink, { valign: 'middle', max: 12.5, ls: 1.12 }); });
        }
        await folds(s);
      },
    ],
    statement: [
      async (d) => { // deep leaflet: the note first in small type, the thought below spreading over two panels
        const s = await pg(d, { fills: [DEEP, C.mid, C.mid] });
        if (d.caption) bd(s, d.caption, P[1] + 0.35, 0.4, PW * 2 - 0.7, 1.55, 'FFFFFF', { max: 13 });
        t.rect(s, P[1] + 0.35, 2.05, 1.2, 0.07, AMBER, { name: 'Rule' });
        k.head(s, L.runs(d.text), P[1] + 0.35, 2.2, PW * 2 - 0.7, 3.05, { max: 36, min: 18, color: 'FFFFFF', valign: 'middle' });
      },
      async (d) => { // an amber spread with the thought, the title and note in the last panel
        const s = await pg(d, { fills: [AMBER, AMBER, C.side], tp: 2 });
        k.head(s, L.runs(d.text), 0.4, 0.5, PW * 2 - 0.8, 4.6, { max: 42, min: 20, color: C.ink, valign: 'middle' });
        if (d.caption) bd(s, d.caption, P[2] + 0.35, 1.75, PW - 0.65, 2.4, C.muted, { max: 12, min: 10, ls: 1.15, valign: 'bottom' });
      },
    ],
    timeline: [
      async (d) => { // a line through the open panels, events above and below it by turns
        const s = await pg(d), mid = 2.82, w = 2.2;
        t.line(s, P[1], mid, PW * 2, 0, C.mid, 2.5);
        for (const [i, it] of d.items.entries()) {
          const x = P[1] + 0.25 + i * (PW * 2 - w - 0.4) / 3, up = i % 2 === 0, y = up ? 0.3 : mid + 0.14, h = up ? mid - 0.1 - y : 5.5 - y;
          t.oval(s, x, mid - 0.1, 0.2, 0.2, AMBER);
          hd(s, it.year, x, y, w, 0.42, C.mid, { max: 20, min: 12, valign: 'middle' });
          hd(s, it.h, x, y + 0.42, w, 0.32, C.ink, { max: 13, min: 10.5, valign: 'middle' });
          bd(s, it.t, x, y + 0.76, w, h - 0.78, C.muted, { max: 12, ls: 1.12 });
        }
      },
      async (d) => { // deep leaflet: year tabs stick out of the title panel, events run on from them
        const s = await pg(d, { fills: [DEEP, C.mid, C.mid] }), rh = 5.625 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = i * rh;
          if (i) t.line(s, PW, y, PW * 2, 0, BRIGHT, 0.75);
          t.rect(s, PW - 0.28, y + 0.25, 1.75, 0.5, AMBER, { name: 'Year tab' });
          hd(s, it.year, PW - 0.2, y + 0.25, 1.6, 0.5, C.ink, { max: 16, min: 10.5, valign: 'middle', align: 'center' });
          hd(s, it.h, PW + 0.1, y + 0.78, 1.45, rh - 0.84, 'FFFFFF', { max: 12.5, min: 10 });
          bd(s, it.t, PW + 1.7, y + 0.08, 4.75, rh - 0.16, 'FFFFFF', { max: 13, valign: 'middle', ls: 1.15 });
        }
      },
      async (d) => { // opened wide: four sections under the banner, the year cut out of a coloured flap
        const s = await banner(d), w = 2.5, fl = [BRIGHT, C.mid, DEEP, AMBER];
        for (const [i, it] of d.items.entries()) {
          const x = i * w, up = i % 2 === 0, y = up ? 1.22 : 1.55, yrInk = i === 3 ? C.ink : 'FFFFFF';
          t.rect(s, x, 1.22, w, 4.08, i % 2 ? C.side : C.paper, { name: 'Section' });
          t.rect(s, x, y, w, 0.72, fl[i], { name: 'Flap' });
          hd(s, it.year, x + 0.2, y, w - 0.4, 0.72, yrInk, { max: 20, min: 12, valign: 'middle' });
          hd(s, it.h, x + 0.2, y + 0.82, w - 0.4, 0.5, C.ink, { max: 13.5 });
          bd(s, it.t, x + 0.2, y + 1.34, w - 0.38, 5.28 - y - 1.34, C.muted, { max: 12.5 });
        }
        await folds(s);
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old flowing panels were the same page for cards, process and timeline
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Buklet', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.mid, lt2: C.side, accent1: C.mid, accent2: C.accent, accent3: '14B8A6', accent4: '0EA5E9', accent5: C.muted, accent6: 'CCEDE9', hlink: C.mid, folHlink: C.muted } });
}
module.exports = { id: 109, slug: 'buklet', name: 'Buklet', category: 'business', photos: true, build, style: { tone: "axborot bukleti: o'quvchiga qulay, qisqa bo'limlar, aniq va amaliy ma'lumot", limits: { title: 45 }, prefer: null } };
