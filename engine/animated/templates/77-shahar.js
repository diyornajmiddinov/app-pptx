/** 77 Shahar — night city: skyline silhouettes with lit windows, street-sign panels, a moon. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '0F1630', ink: 'EEF1FA', muted: 'A6B0D0', accent: 'FFC94D', pal: ['FFC94D', '4DB8FF', 'FF7A59', '7EE081', 'C08BFF', 'FF5C8A'] };
const skyline = (h, base, seed, op = 1) => { let x0 = seed, b = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
  for (let x = 0; x < 1600;) { const w = 60 + Math.floor(rnd() * 70), bh = 80 + Math.floor(rnd() * (base - 40)); b += `<rect x="${x}" y="${base - bh}" width="${w}" height="${bh + h}" fill="#1B2448"/>`;
    for (let wy = base - bh + 12; wy < base - 10; wy += 22) for (let wx = x + 10; wx < x + w - 12; wx += 18) if (rnd() > 0.55) b += `<rect x="${wx}" y="${wy}" width="8" height="11" fill="#FFD27A" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
    x += w + 4; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}" opacity="${op}">${b}</svg>`; };
const sky = () => { let st = '', x0 = 3; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < 70; i++) st += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 420).toFixed(0)}" r="${(0.8 + rnd() * 1.6).toFixed(1)}" fill="#fff" opacity="${(0.3 + rnd() * 0.6).toFixed(2)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0F24"/><stop offset="1" stop-color="#26305A"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/>${st}<circle cx="1330" cy="140" r="62" fill="#F4E9C8"/><circle cx="1355" cy="125" r="56" fill="#141C3B" opacity="0.25"/></svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Shahar', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.3 },
  bg: async (ctx, s, kind) => { s.background = { data: await svgOnce(ctx, 'sky', sky(), 1600, 900, true) }; if (kind === 'hero') ctx.t.img(s, await svgOnce(ctx, 'city', skyline(420, 420, 7), 1600, 420), 0, 3.0, 10, 2.625); else ctx.t.img(s, await svgOnce(ctx, 'low', skyline(160, 160, 13, 0.85), 1600, 160), 0, 4.62, 10, 1.0); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, '1E2A55', { t: 8, r: 0.08, line: { color: '3A4A85', width: 1 }, name: 'Sign' }); if (!o.big) ctx.t.rect(s, x, y, w, 0.07, C.pal[k % 6], { name: 'Light strip' }); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.rect(s, x, y, d, d, C.pal[k % 6], { r: 0.08, name: 'Street sign' }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: '0F1630', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.06 } }), x, y, w, h, { alt: '' }); ctx.t.rect(s, x, y, w, h, null, { r: 0.06, line: { color: C.accent, width: 1.5 }, name: 'Frame' }); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '3A4A85', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.38, 0.66, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.35, y: 0.35, w: 7.5, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.5, 0.72, 28, 16, 'Arial', true) }); },
  footer: (ctx, s) => { ctx.t.rect(s, 0, 5.28, 10, 0.345, '0F1630', { t: 18, name: 'Footer band' }); metaFooter({ color: 'D5DBEE', y: 5.32 })(ctx, s); }, // the lit windows behind it made the line unreadable
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => '0F1630', authorColor: C.accent, valueColor: (i) => C.pal[i % 6],
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const road = '2A2F45', lit = 'FFD27A', block = '1B2448', edge = '3A4A85', dark = '0F1630', pal = C.pal;
    const low = async (s) => t.img(s, await svgOnce(ctx, 'low', skyline(160, 160, 13, 0.85), 1600, 160), 0, 4.62, 10, 1.0);
    const sign = (s, x, y, w, h2, c) => t.rect(s, x, y, w, h2, c, { r: 0.06, name: 'Sign' });
    const panes = async (s, x, y, w, h2, seed = 1) => { let g = '', x0 = seed + 11; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let a = 0; a < 12; a++) for (let b = 0; b < 24; b++) if (rnd() > 0.72) g += `<rect x="${b * 25 + 6}" y="${a * 25 + 6}" width="12" height="15" fill="#FFD27A" opacity="${(0.08 + rnd() * 0.12).toFixed(2)}"/>`; t.img(s, await svgOnce(ctx, 'panes' + seed, `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300">${g}</svg>`, 600, 300), x, y, w, h2); };
    const lanes = (s, x, y, w, h2, o = {}) => { t.rect(s, x, y, w, h2, road, { name: 'Road' }); if (w >= h2) t.line(s, x, y + h2 / 2, w, 0, lit, 1.75, { dash: 'dash' }); else t.line(s, x + w / 2, y, 0, h2, lit, 1.75, { dash: 'dash' }); };
    const V = {
      image: [
        async (d) => { // a billboard over the street: the picture on it, lamps above and two legs below
          const s = await page(d), x = 5.05, y = 1.42, w = 4.35, ht = 2.55;
          for (const k of [0.2, 0.5, 0.8]) { t.line(s, x + w * k, y - 0.18, 0, 0.18, C.muted, 1.5); t.rect(s, x + w * k - 0.13, y - 0.24, 0.26, 0.07, lit, { name: 'Lamp' }); }
          t.rect(s, x + 0.75, y + ht, 0.13, 0.75, block, { name: 'Leg' }); t.rect(s, x + w - 0.88, y + ht, 0.13, 0.75, block, { name: 'Leg' });
          t.rect(s, x - 0.08, y - 0.08, w + 0.16, ht + 0.16, block, { line: { color: edge, width: 1.5 }, name: 'Board' });
          t.img(s, await L.photo(L.src(d.image), w, ht), x, y, w, ht, { alt: '' });
          body(s, d.text, 0.6, 1.3, 4.1, 3.35, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // the page is the picture at night, a glass tower front holds the words
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.1, 10, 0.525, dark, { name: 'Street' }); await low(s);
          t.rect(s, 5.05, 0.3, 4.6, 4.45, block, { t: 6, line: { color: C.accent, width: 1.5 }, name: 'Glass front' });
          t.rect(s, 5.05, 0.3, 4.6, 0.08, C.accent, { name: 'Light strip' });
          head(s, d.title, 5.3, 0.45, 4.1, 0.95, { max: 22, color: C.accent });
          body(s, d.text, 5.3, 1.42, 4.1, 3.2, { max: 15, k: 1.12, valign: 'middle' });
          K.footer(ctx, s);
        },
        async (d) => { // a block of flats: the picture shows through its lit windows
          const s = await page(d), x = 0.6, y = 1.2, w = 4.5, ht = 3.45, cols = 3, rows = 3, gx = 0.05, gy = 0.06; let p = '';
          for (let a = 0; a < rows; a++) for (let b = 0; b < cols; b++) { const l = gx + b * ((1 - gx) / cols), u = gy + a * ((1 - gy) / rows), r = l + (1 - gx) / cols - gx, dn = u + (1 - gy) / rows - gy; p += `M${l.toFixed(3)},${u.toFixed(3)} L${r.toFixed(3)},${u.toFixed(3)} L${r.toFixed(3)},${dn.toFixed(3)} L${l.toFixed(3)},${dn.toFixed(3)} Z `; }
          t.rect(s, x - 0.04, y - 0.04, w + 0.08, ht + 0.3, block, { line: { color: edge, width: 1.5 }, name: 'Facade' });
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { path: p } }), x, y, w, ht, { alt: '' });
          body(s, d.text, 5.45, 1.25, 3.95, 3.45, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // the skyline itself cut from the picture, the words in the sky above it
          const s = await page(d);
          t.img(s, await L.photo(L.src(d.image), 10, 2.75, { mask: { poly: [[0, 0.5], [0.09, 0.5], [0.09, 0.2], [0.17, 0.2], [0.17, 0.42], [0.27, 0.42], [0.27, 0.08], [0.33, 0.08], [0.33, 0], [0.37, 0], [0.37, 0.08], [0.43, 0.08], [0.43, 0.5], [0.53, 0.5], [0.53, 0.25], [0.64, 0.25], [0.64, 0.45], [0.72, 0.45], [0.72, 0.12], [0.81, 0.12], [0.81, 0.36], [0.9, 0.36], [0.9, 0.22], [1, 0.22], [1, 1], [0, 1]] } }), 0, 2.45, 10, 2.75, { alt: '' });
          t.rect(s, 0, 5.2, 10, 0.425, dark, { name: 'Footer band' });
          body(s, d.text, 0.6, 1.08, 7.6, 1.4, { max: 14, k: 1.06, valign: 'middle' });
          K.footer(ctx, s);
        },
      ],
      cards: [
        async (d) => { // towers on the street, of two heights: a roof mast, lit windows behind the words
          const s = await page(d), n = d.items.length, gap = 0.1, w = (8.8 - gap * (n - 1)) / n, b = 4.82;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = i % 2 ? 1.62 : 1.28;
            t.line(s, x + w / 2, y - 0.2, 0, 0.2, C.muted, 1.5);
            t.rect(s, x, y, w, b - y, block, { line: { color: edge, width: 1 }, name: 'Tower' });
            await panes(s, x, y, w, b - y, i);
            t.rect(s, x, y, w, 0.5, pal[i % 6], { name: 'Roof sign' });
            t.img(s, await L.icon(it.icon, dark, 2), x + 0.12, y + 0.08, 0.34, 0.34);
            head(s, it.h, x + 0.54, y + 0.02, w - 0.62, 0.46, { max: 13, color: dark });
            body(s, it.t, x + 0.16, y + 0.6, w - 0.32, b - y - 0.68, { max: 14 });
          }
        },
        async (d) => { // a crossroads: four blocks round the junction, a street sign on each corner
          const s = await page(d), n = d.items.length, w = 3.95, hh = 1.42, gx = 5.0, gy = 2.84;
          lanes(s, 0, gy, 10, 0.32); if (n === 4) lanes(s, gx - 0.16, 1.15, 0.32, 3.55); else lanes(s, gx - 0.16, 1.15, 0.32, 1.7);
          t.rect(s, gx - 0.16, gy, 0.32, 0.32, road, { name: 'Junction' });
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = i % 2 ? 5.45 : 0.6, y = i < 2 ? 1.28 : 3.26;
            sign(s, x, y + 0.02, 0.46, 0.46, pal[i % 6]);
            t.img(s, await L.icon(it.icon, dark, 2), x + 0.08, y + 0.1, 0.3, 0.3);
            head(s, it.h, x + 0.56, y, ww - 0.6, 0.5, { color: pal[i % 6] });
            body(s, it.t, x, y + 0.53, ww, hh - 0.53 + 0.02, { max: 13.5 });
          }
        },
        async (d) => { // neon signs: glowing tubes on the dark wall, one a line
          const s = await page(d), n = d.items.length, rh = 3.42 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.22 + i * rh, hg = rh - 0.13, c = pal[i % 6];
            t.rect(s, 0.6, y, 8.8, hg, dark, { t: 25, r: 0.12, line: { color: c, width: 2.25 }, shadow: 0.7, blur: 10, offset: 0, shadowColor: c, name: 'Neon' });
            t.img(s, await L.icon(it.icon, c, 2), 0.82, y + hg / 2 - 0.19, 0.38, 0.38);
            head(s, it.h, 1.38, y + 0.04, 2.55, hg - 0.08, { color: c });
            t.line(s, 4.0, y + 0.13, 0, hg - 0.26, c, 1);
            body(s, it.t, 4.15, y + 0.04, 5.05, hg - 0.08, { valign: 'middle', max: 13.5 });
          }
        },
        async (d) => { // warm windows in the night: each item is one lit window, a dark word on bright glass
          const s = await page(d), n = d.items.length, w = 4.25, hh = 1.6;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.3), y = 1.26 + Math.floor(i / 2) * (hh + 0.2);
            t.rect(s, x - 0.05, y - 0.05, ww + 0.1, hh + 0.1, block, { line: { color: edge, width: 1.5 }, name: 'Sash' });
            t.rect(s, x, y, ww, hh, lit, { name: 'Lit window' });
            t.line(s, x + 0.8, y, 0, hh, block, 2.5); t.line(s, x, y + hh / 2, 0.8, 0, block, 2.5);
            t.img(s, await L.icon(it.icon, dark, 2), x + 0.22, y + 0.2, 0.36, 0.36);
            head(s, it.h, x + 0.92, y + 0.05, ww - 1.02, 0.42, { max: 15, color: dark });
            body(s, it.t, x + 0.92, y + 0.47, ww - 1.02, hh - 0.53, { color: dark, max: 13.5 });
          }
        },
      ],
      process: [
        async (d) => { // the avenue: a lit road across the page, signposts at each stop
          const s = await page(d), n = d.steps.length, cw = 8.8 / n;
          lanes(s, 0, 1.32, 10, 0.72);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw;
            await marker(s, x + 0.05, 1.36, 0.64, i, i + 1);
            t.rect(s, x + 0.34, 2.04, 0.05, 0.28, C.muted, { name: 'Post' });
            head(s, st.h, x + 0.05, 2.34, cw - 0.2, 0.48, { color: pal[i % 6], max: 15 });
            body(s, st.t, x + 0.05, 2.84, cw - 0.24, 1.8, { max: 14 });
          }
        },
        async (d) => { // the metro map: one line runs out along the top and back along the bottom, stations on it
          const s = await page(d), n = d.steps.length, c = pal[1], top = 1.55, bot = 3.2, L0 = 0.95, R0 = 9.1, w = 3.85;
          t.line(s, L0, top, R0 - L0, 0, c, 5); t.line(s, R0, top, 0, bot - top, c, 5); t.line(s, n === 4 ? L0 : 5.2, bot, R0 - (n === 4 ? L0 : 5.2), 0, c, 5);
          const pos = n === 4 ? [[L0, top], [5.15, top], [R0, bot], [4.9, bot]] : [[L0, top], [5.15, top], [R0, bot]], tx = n === 4 ? [0.6, 4.8, 5.2, 0.6] : [0.6, 4.8, 0.6];
          for (const [i, st] of d.steps.entries()) {
            const [x, y] = pos[i], ww = n === 3 && i === 2 ? 8.1 : w, a = n === 4 && i === 2 ? 'right' : n === 3 && i === 2 ? 'right' : 'left', yy = y + 0.25;
            t.oval(s, x - 0.22, y - 0.22, 0.44, 0.44, 'FFFFFF', { line: { color: c, width: 3.5 } });
            t.text(s, String(i + 1), { x: x - 0.22, y: y - 0.22, w: 0.44, h: 0.44, bold: true, fontSize: 12, color: dark, align: 'center', valign: 'middle' });
            const bx = tx[i];
            head(s, st.h, bx, yy, ww, 0.38, { color: pal[0], align: a });
            body(s, st.t, bx, yy + 0.38, ww, 0.95, { align: a, max: 13 });
          }
        },
        async (d) => { // the skyline rises: each building a step taller, its words on its face
          const s = await page(d), n = d.steps.length, gap = 0.06, w = (8.8 - gap * (n - 1)) / n, b = 4.82, rise = n === 4 ? 0.3 : 0.42;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.28 + (n - 1 - i) * rise, top = i === n - 1;
            if (top) { t.line(s, x + w / 2, y - 0.2, 0, 0.2, C.accent, 2); t.oval(s, x + w / 2 - 0.05, y - 0.27, 0.1, 0.1, pal[2]); }
            t.rect(s, x, y, w, b - y, top ? '2C3A78' : block, { line: { color: top ? C.accent : edge, width: top ? 1.75 : 1 }, name: 'Building' });
            await panes(s, x, y, w, b - y, i + 5);
            await marker(s, x + 0.14, y + 0.12, 0.5, i, i + 1);
            head(s, st.h, x + 0.72, y + 0.08, w - 0.8, 0.58, { max: 13, color: pal[i % 6] });
            body(s, st.t, x + 0.15, y + 0.72, w - 0.3, b - y - 0.8, { max: 13.5 });
          }
        },
        async (d) => { // a traffic light up the side of the page: one lamp for each step
          const s = await page(d), n = d.steps.length, rh = 3.42 / n, LC = ['FF5C5C', pal[0], pal[3], pal[1]];
          t.rect(s, 0.7, 1.2, 0.95, 3.5, '11151F', { r: 0.1, line: { color: edge, width: 1.5 }, name: 'Traffic light' });
          for (const [i, st] of d.steps.entries()) {
            const y = 1.22 + i * rh, dd = Math.min(0.72, rh - 0.1), cy = y + rh / 2;
            t.oval(s, 1.175 - dd / 2, cy - dd / 2, dd, dd, LC[i], { shadow: 0.5 });
            t.text(s, String(i + 1), { x: 1.175 - dd / 2, y: cy - dd / 2, w: dd, h: dd, bold: true, fontSize: 18, color: dark, align: 'center', valign: 'middle' });
            head(s, st.h, 1.95, y + 0.04, 2.35, rh - 0.1, { color: LC[i] });
            body(s, st.t, 4.4, y + 0.04, 5.0, rh - 0.1, { valign: 'middle', max: 13.5 });
            if (i < n - 1) t.line(s, 1.95, y + rh - 0.02, 7.45, 0, edge, 0.75);
          }
        },
      ],
      stats: [
        async (d) => { // a long lit scoreboard on two legs: three figures in lights
          const s = await page(d), cw = 8.4 / 3, top = 1.28, hh = d.note ? 2.1 : 2.85;
          t.rect(s, 0.8, top + hh, 0.14, 4.8 - top - hh, block, { name: 'Leg' }); t.rect(s, 9.06, top + hh, 0.14, 4.8 - top - hh, block, { name: 'Leg' });
          t.rect(s, 0.6, top, 8.8, hh, '080C1C', { r: 0.05, line: { color: edge, width: 2 }, name: 'Scoreboard' });
          for (const [i, x] of d.stats.entries()) {
            const px = 0.8 + i * cw;
            if (i) t.line(s, px, top + 0.2, 0, hh - 0.4, edge, 1);
            t.text(s, x.value, { x: px + 0.08, y: top + 0.14, w: cw - 0.16, h: 1.05, bold: true, color: pal[[0, 1, 2][i]], align: 'center', valign: 'middle', fontSize: L.fit(x.value, cw - 0.2, 1.0, 46, 18, 'Arial', true) });
            body(s, x.label, px + 0.18, top + 1.22, cw - 0.36, hh - 1.3, { align: 'center', max: 14 });
          }
          if (d.note) body(s, d.note, 1.1, top + hh + 0.1, 7.8, 4.65 - top - hh - 0.1, { color: C.muted, valign: 'middle', align: 'center', max: 13 });
        },
        async (d) => { // the moon holds the main figure, the others hang as street signs below the wires
          const s = await page(d), [a, ...rest] = d.stats, dia = 3.05, x = 6.15, y = 1.2;
          t.oval(s, x, y, dia, dia, 'F4E9C8'); t.oval(s, x + 0.45, y + 0.3, 0.3, 0.3, 'E5D9B2'); t.oval(s, x + 2.2, y + 1.9, 0.42, 0.42, 'E5D9B2');
          t.text(s, a.value, { x: x + 0.3, y: y + 0.65, w: dia - 0.6, h: 0.95, bold: true, color: dark, align: 'center', valign: 'middle', fontSize: L.fit(a.value, dia - 0.65, 0.9, 44, 18, 'Arial', true) });
          body(s, a.label, x + 0.5, y + 1.6, dia - 1.0, 0.85, { color: dark, align: 'center', max: 13 });
          for (const [i, v] of rest.entries()) {
            const yy = 1.25 + i * 1.03;
            sign(s, 0.6, yy, 2.05, 0.9, pal[i ? 1 : 2]);
            t.text(s, v.value, { x: 0.65, y: yy, w: 1.95, h: 0.9, bold: true, color: dark, align: 'center', valign: 'middle', fontSize: L.fit(v.value, 1.85, 0.75, 28, 14, 'Arial', true) });
            body(s, v.label, 2.85, yy + 0.05, 3.1, 0.8, { valign: 'middle', max: 14 });
          }
          if (d.note) body(s, d.note, 0.6, 3.36, 5.35, 1.28, { color: C.muted, valign: 'middle', max: 13 });
        },
      ],
      compare: [
        async (d) => { // a two-way street: traffic runs up on the left of it and down on the right
          const s = await page(d), w = 3.75;
          lanes(s, 4.55, 1.12, 0.9, 3.58);
          t.shape(s, 'UP_ARROW', { x: 4.62, y: 1.2, w: 0.24, h: 0.4, fill: { color: C.muted }, objectName: 'Lane arrow' }); t.shape(s, 'DOWN_ARROW', { x: 5.14, y: 4.2, w: 0.24, h: 0.4, fill: { color: C.muted }, objectName: 'Lane arrow' });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.24, 2.65);
          sign(s, 0.6, 1.25, w, 0.5, pal[0]); sign(s, 5.65, 1.25, w, 0.5, pal[1]);
          head(s, d.left.h, 0.7, 1.25, w - 0.2, 0.5, { max: 17, color: dark, align: 'right' }); head(s, d.right.h, 5.75, 1.25, w - 0.2, 0.5, { max: 17, color: dark });
          let y = 1.92;
          for (const [k, rh] of rows.entries()) {
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.6, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.65, y, w, h: rh, fontSize: fs, color: C.ink });
            y += rh;
          }
        },
        async (d) => { // street level and the metro under it: two storeys of the same city
          const s = await page(d), hh = 1.72;
          t.rect(s, 0.6, 1.2, 8.8, hh, '1E2A55', { name: 'Street' }); t.rect(s, 0, 2.92, 10, 0.08, lit, { name: 'Pavement' }); t.rect(s, 0, 3.0, 10, 1.76, '070A18', { name: 'Tunnel' });
          for (let k = 0; k < 40; k++) t.rect(s, k * 0.26, 4.66, 0.12, 0.05, '4A5070', { name: 'Sleeper' });
          t.line(s, 0, 4.64, 10, 0, '8890B0', 1.5);
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = i ? 3.07 : 1.24, n = side.items.length, cw = 8.5 / n;
            head(s, side.h, 0.75, y, 8.5, 0.42, { max: 17, color: i ? pal[1] : pal[0] });
            for (const [k, it] of side.items.entries()) {
              const x = 0.75 + k * cw;
              t.rect(s, x, y + 0.5, 0.06, 0.95, i ? pal[1] : pal[0], { name: 'Tick' });
              body(s, it, x + 0.14, y + 0.46, cw - 0.28, 1.08, { valign: 'middle', max: 14 });
            }
          }
        },
      ],
      statement: [
        async (d) => { // the great billboard: the thought in black on full yellow
          const s = await page(d, 'focus'), x = 0.9, y = 1.25, w = 8.2, ht = 2.1;
          for (const k of [0.15, 0.5, 0.85]) { t.line(s, x + w * k, y - 0.16, 0, 0.16, C.muted, 1.5); t.rect(s, x + w * k - 0.16, y - 0.2, 0.32, 0.06, 'FFFFFF', { name: 'Lamp' }); }
          t.rect(s, 2.2, y + ht, 0.14, 1.5, block, { name: 'Leg' }); t.rect(s, 7.66, y + ht, 0.14, 1.5, block, { name: 'Leg' });
          t.rect(s, x, y, w, ht, C.accent, { line: { color: 'FFFFFF', width: 2 }, name: 'Billboard' });
          t.text(s, L.runs(d.text), { x: x + 0.3, y: y + 0.12, w: w - 0.6, h: ht - 0.24, fontFace: 'Arial', bold: true, color: dark, align: 'center', valign: 'middle', fontSize: L.fit(d.text, w - 0.6, ht - 0.28, 32, 15, 'Arial', true) });
          if (d.caption) body(s, d.caption, 2.5, 3.45, 5.0, 1.2, { valign: 'middle', align: 'center' });
        },
        async (d) => { // a neon sign in the dark: the glowing tube round the thought, the note on a wall to one side
          const s = await page(d), c = pal[5];
          t.rect(s, 0.6, 1.28, 5.85, 3.4, dark, { t: 15, r: 0.2, line: { color: c, width: 3 }, shadow: 0.8, blur: 14, offset: 0, shadowColor: c, name: 'Neon' });
          t.text(s, L.runs(d.text), { x: 0.95, y: 1.45, w: 5.15, h: 3.05, fontFace: 'Arial', bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 5.15, 3.0, 30, 15, 'Arial', true) });
          if (d.caption) body(s, d.caption, 6.75, 1.45, 2.65, 3.15, { valign: 'middle', max: 14 });
        },
      ],
      timeline: [
        async (d) => { // one metro line, a new colour after every station
          const s = await page(d), cw = 2.2, ly = 1.92;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, sx = x + 0.2;
            t.line(s, sx, ly, i === 3 ? 9.4 - sx : cw, 0, pal[i], 6);
            t.oval(s, sx - 0.2, ly - 0.2, 0.4, 0.4, 'FFFFFF', { line: { color: pal[i], width: 4 } });
            head(s, it.year, x, 1.25, cw - 0.1, 0.42, { color: pal[i], max: 20 });
            head(s, it.h, x, 2.2, cw - 0.15, 0.46, { max: 14 });
            body(s, it.t, x, 2.68, cw - 0.2, 1.95, { max: 14 });
          }
        },
        async (d) => { // one tower, four floors: each floor carries its year in a lit window
          const s = await page(d), rh = 0.87, x = 1.0, w = 8.4;
          t.rect(s, 0.6, 1.2, 0.4, 3.5, '11151F', { name: 'Stairwell' });
          t.rect(s, x, 1.2, w, 3.5, block, { line: { color: edge, width: 1.25 }, name: 'Tower' });
          for (const [i, it] of d.items.entries()) {
            const y = 1.22 + i * rh;
            t.oval(s, 0.71, y + rh / 2 - 0.09, 0.18, 0.18, pal[i % 6]);
            t.rect(s, x + 0.1, y + 0.08, 1.55, rh - 0.16, lit, { name: 'Lit window' });
            t.text(s, it.year, { x: x + 0.14, y: y + 0.08, w: 1.47, h: rh - 0.16, bold: true, color: dark, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.4, 0.5, 17, 10, 'Arial', true) });
            head(s, it.h, x + 1.8, y + 0.05, 2.1, rh - 0.1, { color: pal[i % 6], max: 14 });
            body(s, it.t, x + 3.95, y + 0.04, w - 4.1, rh - 0.08, { valign: 'middle', max: 13 });
            if (i < 3) t.line(s, x, y + rh - 0.01, w, 0, edge, 1);
          }
        },
        async (d) => { // the boulevard down the middle of town: years stand as signs on either kerb
          const s = await page(d), w = 3.75;
          lanes(s, 4.75, 1.12, 0.5, 3.58);
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.24 + Math.floor(i / 2) * 1.74 + (right ? 0.28 : 0), x = right ? 5.65 : 0.6, a = right ? 'left' : 'right', sw = 1.5;
            sign(s, right ? 5.35 : 4.65 - sw, y, sw, 0.42, pal[i % 6]);
            t.text(s, it.year, { x: right ? 5.38 : 4.68 - sw, y, w: sw - 0.06, h: 0.42, bold: true, color: dark, align: 'center', valign: 'middle', fontSize: L.fit(it.year, sw - 0.1, 0.38, 16, 10, 'Arial', true) });
            const hx = right ? 6.92 : 0.6;
            head(s, it.h, hx, y, right ? 2.48 : 2.42, 0.42, { align: a, max: 13, color: pal[i % 6] });
            body(s, it.t, x, y + 0.46, w, 1.15, { align: a, max: 13 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); // the original panels of both looked like the cards page
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) { t.rect(s, 6.35, 0.65, 2.9, 2.2, '1E2A55', { r: 0.06, name: 'Billboard' }); t.img(s, await L.photo(L.src(d.image), 2.7, 2.0), 6.45, 0.75, 2.7, 2.0, { alt: '' }); t.rect(s, 7.65, 2.85, 0.1, 0.5, '1E2A55', { name: 'Pole' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.55, w: 5.4, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 5.5, h: 1.6, bold: true, fontSize: L.fit(d.title, 5.5, 1.55, 38, 18, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.55, w: 5.4, h: 0.5, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 3.0, w: 5.4, h: 0.4, fontSize: 15, bold: true, color: C.accent });
    K.footer(ctx, s);
  },
};
module.exports = { id: 77, slug: 'shahar', name: 'Şahar', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "zamonaviy shahar ritmi: dinamik, amaliy, natijaga yo'naltirilgan", limits: {}, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "technical"], "transitions": ["push:l", "p14:flythrough|dir=\"in\"", "morph"], "cover": ["flyRight", "fadeLetters"], "mark": "appear", "deco": "wipe:u", "sig": {"title": "sweepIn", "body": "fadeUp", "item": "wipe:u", "image": "wipe:u", "number": "popIn", "order": "cascade", "stagger": 0.1}, "tempo": 0.9, "kenburns": true};
