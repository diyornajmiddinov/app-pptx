/** 100 Termal — thermal camera: false-colour heat blobs, a temperature scale bar, heat-coloured markers, °-numbered slides. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '0B0620', ink: 'F5F0FF', muted: 'B9AED6', accent: 'FFB000', pal: ['FF3D00', 'FFB000', 'C2185B', '7B1FA2', 'FF6F00', 'FFEA00'] };
const heat = (seed) => { let x0 = seed, g = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); const cols = ['3A0CA3', '7209B7', 'C2185B', 'FF3D00', 'FFB000'];
  for (let i = 0; i < 9; i++) { const cx = rnd() * 1600, cy = rnd() * 900, r = 120 + rnd() * 220; cols.forEach((c, k) => { g += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(r * (1 - k * 0.18)).toFixed(0)}" fill="#${c}" opacity="0.5"/>`; }); }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><filter id="b"><feGaussianBlur stdDeviation="55"/></filter></defs><rect width="1600" height="900" fill="#${C.bg}"/><g filter="url(#b)" opacity="0.55">${g}</g><rect width="1600" height="900" fill="#0B0620" opacity="0.35"/></svg>`; };
const scale = () => `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="600"><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1A0B3C"/><stop offset="0.25" stop-color="#7209B7"/><stop offset="0.5" stop-color="#C2185B"/><stop offset="0.75" stop-color="#FF3D00"/><stop offset="1" stop-color="#FFEA00"/></linearGradient></defs><rect width="40" height="600" rx="8" fill="url(#g)"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Termal', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'panels', stats: 'markers', timeline: 'columns' },
  area: { x: 0.6, y: 1.4, w: 8.5, h: 3.55 },
  bg: async (ctx, s, kind) => { s.background = { data: await svgOnce(ctx, 'h' + (kind === 'page' ? 1 : 2), heat(kind === 'page' ? 5 : 13), 1600, 900, true) }; const { t } = ctx; t.img(s, await svgOnce(ctx, 'scale', scale(), 40, 600), 9.4, 1.0, 0.18, 3.6); ['40\u00B0', '30\u00B0', '20\u00B0'].forEach((v, k) => t.text(s, v, { x: 9.12, y: 0.9 + k * 1.75, w: 0.3, h: 0.22, fontSize: 7, color: C.muted, align: 'right', noFit: true })); },
  panel: (ctx, s, x, y, w, h) => { ctx.t.rect(s, x, y, w, h, '160D35', { t: 20, r: 0.08, line: { color: '5B3C8C', width: 1 }, name: 'Panel' }); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: 'FFEA00', width: 1.25 } }); ctx.t.oval(s, x + d * 0.25, y + d * 0.25, d * 0.5, d * 0.5, 'FFEA00', { t: 55 }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: '0B0620', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { duo: ['2B0A5C', 'FFB000'] }), x, y, w, h, { alt: '' }); ctx.t.rect(s, x, y, w, h, null, { line: { color: 'FFB000', width: 1.5 }, name: 'Frame' }); ctx.t.text(s, '36.6\u00B0', { x: x + w - 0.95, y: y + 0.1, w: 0.85, h: 0.3, fontSize: 11, bold: true, color: 'FFEA00', align: 'right', noFit: true }); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, '3A2A63', 0.75),
  title: (ctx, s, d) => { const { t, L } = ctx; t.text(s, `${20 + ctx.idx}\u00B0`, { x: 0.5, y: 0.35, w: 0.95, h: 0.72, fontSize: 22, bold: true, color: C.pal[ctx.idx % 6], valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.5, y: 0.35, w: 7.6, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.6, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted, w: 8.5 }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => '0B0620', authorColor: C.accent, compareHead: (i) => (i ? 'FFEA00' : 'FF6F3C'),
  ways: (ctx, h, R) => {
    // ---- further ways to draw a type, through the thermal camera: a deck's pages must not look alike (L.pages)
    const { t, L } = ctx, { page, newSlide, panel, marker, photo } = h;
    const NIGHT = '0B0620', Y = 'FFEA00', HOT = ['7B1FA2', 'C2185B', 'FF3D00', 'FFB000'], onHot = (i) => (i >= 2 ? NIGHT : 'FFFFFF'), XW = 8.45, foot = metaFooter({ color: C.muted, w: 8.5 });
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.ls || 1), lineSpacingMultiple: o.ls || 1, color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const glow = (c, core = 'FFEA00') => svgOnce(ctx, 'gl' + c + core, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><radialGradient id="g"><stop offset="0" stop-color="#${core}"/><stop offset="0.3" stop-color="#${c}"/><stop offset="1" stop-color="#${c}" stop-opacity="0"/></radialGradient></defs><rect width="400" height="400" fill="url(#g)"/></svg>`, 400, 400);
    const ramp = (dir) => svgOnce(ctx, 'ramp' + dir, `<svg xmlns="http://www.w3.org/2000/svg" width="${dir === 'h' ? 900 : 30}" height="${dir === 'h' ? 30 : 900}"><defs><linearGradient id="g" x1="0" y1="${dir === 'h' ? 0 : 1}" x2="${dir === 'h' ? 1 : 0}" y2="0"><stop offset="0" stop-color="#3A0CA3"/><stop offset="0.3" stop-color="#7209B7"/><stop offset="0.55" stop-color="#C2185B"/><stop offset="0.8" stop-color="#FF3D00"/><stop offset="1" stop-color="#FFEA00"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`, dir === 'h' ? 900 : 30, dir === 'h' ? 30 : 900);
    const brk = (s, x, y, w, h2, c = Y, a = 0.3, lw = 1.75) => { [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h2, 1, -1], [x + w, y + h2, -1, -1]].forEach(([px, py, sx, sy]) => { t.line(s, sx > 0 ? px : px - a, py, a, 0, c, lw); t.line(s, px, sy > 0 ? py : py - a, 0, a, c, lw); }); };
    const cross = (s, cx, cy, r, c = Y) => { t.line(s, cx - r, cy, r * 0.7, 0, c, 1.25); t.line(s, cx + r * 0.3, cy, r * 0.7, 0, c, 1.25); t.line(s, cx, cy - r, 0, r * 0.7, c, 1.25); t.line(s, cx, cy + r * 0.3, 0, r * 0.7, c, 1.25); };
    const V = {
      image: [
        async (d) => { // the picture in the viewfinder across the page, the reading under it
          const s = await page(d);
          await photo(s, d.image, 0.6, 1.25, XW, 2.1);
          brk(s, 0.72, 1.36, XW - 0.24, 1.88, 'FFFFFF'); cross(s, 4.82, 2.3, 0.3, 'FFFFFF');
          await panel(s, 0.6, 3.48, XW, 1.62);
          body(s, d.text, 0.82, 3.54, XW - 0.44, 1.5, { max: 14, valign: 'middle' });
        },
        async (d) => { // the picture is a hot spot: round, with a glow round it
          const s = await page(d), dd = 3.0, cx = 2.35, cy = 3.2;
          t.img(s, await glow('FF3D00'), cx - 2.0, cy - 2.0, 4.0, 4.0, { alt: '' });
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle', duo: ['2B0A5C', 'FFB000'] }), cx - dd / 2, cy - dd / 2, dd, dd, { alt: '' });
          cross(s, cx, cy, 0.34);
          body(s, d.text, 4.55, 1.4, 4.5, 3.65, { max: 16, valign: 'middle', ls: 1.15 });
        },
        async (d) => { // the thermal picture fills the page, a dark reading panel on it
          const s = await newSlide('page');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625, { duo: ['2B0A5C', 'FFB000'] }), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.18, 10, 0.445, NIGHT, { name: 'Footer strip' });
          t.img(s, await svgOnce(ctx, 'scale', scale(), 40, 600), 9.4, 1.0, 0.18, 3.6);
          brk(s, 0.4, 0.4, 3.9, 4.45, '2B0A5C', 0.4, 2.25); cross(s, 2.35, 2.62, 0.4, '2B0A5C');
          t.rect(s, 4.7, 0.35, 4.4, 4.6, NIGHT, { t: 12, r: 0.06, line: { color: 'FFB000', width: 1 }, name: 'Reading' });
          t.text(s, `${20 + ctx.idx}°`, { x: 4.92, y: 0.45, w: 1.0, h: 0.5, fontSize: 20, bold: true, color: C.pal[ctx.idx % 6] });
          head(s, d.title, 4.92, 0.95, 3.96, 0.8, { max: 20 });
          body(s, d.text, 4.92, 1.8, 3.96, 3.02, { max: 14, ls: 1.08 });
          foot(ctx, s);
        },
        async (d) => { // the same picture, seen by eye on the left and by the camera on the right
          const s = await page(d), w = 4.9, hh = 3.7, x = 4.15, y = 1.3;
          t.img(s, await L.photo(L.src(d.image), w, hh), x, y, w, hh, { alt: '' });
          t.img(s, await L.photo(L.src(d.image), w, hh, { duo: ['2B0A5C', 'FFB000'], mask: { poly: [[0.5, 0], [1, 0], [1, 1], [0.5, 1]] } }), x, y, w, hh, { alt: '' });
          t.line(s, x + w / 2, y - 0.05, 0, hh + 0.1, Y, 2);
          t.rect(s, x, y, w, hh, null, { line: { color: 'FFB000', width: 1.5 }, name: 'Frame' });
          body(s, d.text, 0.6, 1.35, 3.3, 3.65, { max: 14, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // long panels, each burning at its left end in its own colour
          const s = await page(d), n = d.items.length, hh = 3.72 / n, o = n === 4 ? 0 : 1;
          for (const [i, it] of d.items.entries()) {
            const y = 1.32 + i * hh, kh = hh - 0.09, c = HOT[i + o];
            await panel(s, 0.6, y, XW, kh);
            t.rect(s, 0.6, y, 0.95, kh, c, { name: 'Heat end' });
            t.img(s, await L.icon(it.icon, onHot(i + o), 2), 0.88, y + kh / 2 - 0.2, 0.4, 0.4);
            head(s, it.h, 1.72, y + 0.03, 2.35, kh - 0.06, { max: 14.5 });
            body(s, it.t, 4.2, y + 0.04, 4.72, kh - 0.08, { color: C.muted, valign: 'middle', max: 13 });
          }
        },
        async (d) => { // hot spots drifting at two heights, the words on the dark
          const s = await page(d), n = d.items.length, cw = XW / n, dd = 1.5;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, cx = x + cw / 2, y = i % 2 ? 1.5 : 1.18;
            t.img(s, await glow(C.pal[[0, 2, 4, 3][i]]), cx - dd / 2, y, dd, dd, { alt: '' });
            t.img(s, await L.icon(it.icon, NIGHT, 2.25), cx - 0.21, y + dd / 2 - 0.21, 0.42, 0.42);
            head(s, it.h, x + 0.08, 3.0, cw - 0.16, 0.5, { align: 'center', max: 15 });
            body(s, it.t, x + 0.08, 3.5, cw - 0.16, 1.6, { align: 'center', max: 13 });
          }
        },
        async (d) => { // viewfinder frames, nothing but their corners
          const s = await page(d), n = d.items.length, w = 4.12, hh = 1.78;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, x = 0.6 + (i % 2) * (w + 0.21), y = 1.32 + Math.floor(i / 2) * (hh + 0.1), ww = wide ? XW : w;
            brk(s, x, y, ww, hh, i % 2 ? 'FFB000' : 'FF6F3C', 0.28);
            t.img(s, await L.icon(it.icon, i % 2 ? 'FFB000' : 'FF6F3C', 2), x + 0.2, y + 0.16, 0.4, 0.4);
            head(s, it.h, x + 0.72, y + 0.14, ww - 0.9, 0.44, { max: 15 });
            body(s, it.t, x + 0.2, y + 0.64, ww - 0.4, hh - 0.78, { max: 13 });
          }
        },
        async (d) => { // a solid band of heat: columns touching, cold to hot
          const s = await page(d), n = d.items.length, w = XW / n, o = n === 4 ? 0 : 1;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * w, c = onHot(i + o);
            const y = i % 2 ? 1.72 : 1.28, hh = 5.12 - y - (i % 2 ? 0 : 0.42);
            t.rect(s, x, y, w, hh, HOT[i + o], { name: 'Heat band' });
            t.img(s, await L.icon(it.icon, c, 2), x + 0.18, y + 0.12, 0.4, 0.4);
            head(s, it.h, x + 0.68, y + 0.08, w - 0.8, 0.5, { color: c, max: 13.5 });
            body(s, it.t, x + 0.18, y + 0.64, w - 0.36, hh - 0.74, { color: c, max: 13.5 });
          }
        },
      ],
      process: [
        async (d) => { // the scale laid across the page, each step a point on it
          const s = await page(d), n = d.steps.length, cw = XW / n;
          t.img(s, await ramp('h'), 0.6, 1.52, XW, 0.22, { alt: '' });
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * cw;
            marker(s, x, 1.33, 0.6, i, i + 1);
            head(s, st.h, x, 2.05, cw - 0.2, 0.6, { max: 15, valign: 'top' });
            body(s, st.t, x, 2.68, cw - 0.2, 2.42, { max: 14 });
          });
        },
        async (d) => { // the scale stands in the middle, panels to each side by turn
          const s = await page(d), n = d.steps.length, cx = 4.82, w = 3.72, B = n === 4 ? [[1.33, 1.75], [1.7, 1.6], [3.18, 1.9], [3.4, 1.7]] : [[1.33, 1.75], [2.25, 1.6], [3.18, 1.9]], ym = n === 4 ? [1.5, 2.34, 3.34, 4.18] : [1.75, 2.75, 3.75];
          t.img(s, await ramp('v'), cx - 0.09, 1.3, 0.18, 3.82, { alt: '' });
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? cx + 0.36 : cx - 0.36 - w, [y, hh] = B[i], a = right ? 'left' : 'right';
            await panel(s, x, y, w, hh);
            head(s, st.h, x + 0.18, y + 0.08, w - 0.36, 0.42, { max: 14.5, align: a });
            body(s, st.t, x + 0.18, y + 0.5, w - 0.36, hh - 0.6, { max: 13, align: a });
            marker(s, cx - 0.27, ym[i], 0.54, n - 1 - i, i + 1);
          }
        },
        async (d) => { // steps climbing as they heat up, each a solid block
          const s = await page(d), n = d.steps.length, w = XW / n, rise = n === 4 ? 0.5 : 0.65, o = n === 4 ? 0 : 1, base = 5.1;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * w, y = 1.35 + (n - 1 - i) * rise, c = onHot(i + o);
            t.rect(s, x, y, w, base - y, HOT[i + o], { name: 'Step' });
            t.text(s, String(i + 1), { x: x + 0.14, y: y + 0.06, w: 0.5, h: 0.5, fontFace: 'Arial', bold: true, fontSize: 24, color: c, valign: 'middle' });
            head(s, st.h, x + 0.62, y + 0.06, w - 0.72, 0.52, { color: c, max: 13.5 });
            body(s, st.t, x + 0.14, y + 0.62, w - 0.26, base - y - 0.7, { color: c, max: 13.5 });
          });
        },
        async (d) => { // large glowing numerals, a thin isotherm between the rows
          const s = await page(d), n = d.steps.length, hh = 3.72 / n;
          for (const [i, st] of d.steps.entries()) {
            const y = 1.32 + i * hh, dd = Math.min(hh, 0.95);
            const c0 = C.pal[[3, 2, 0, 4][i]], cool = i < 2; // the cool glows have no yellow heart: white numerals on them
            t.img(s, await glow(c0, cool ? c0 : 'FFEA00'), 0.5, y + (hh - dd) / 2, dd, dd, { alt: '' });
            t.text(s, String(i + 1), { x: 0.5, y: y + (hh - dd) / 2, w: dd, h: dd, fontFace: 'Arial', bold: true, fontSize: 24, color: cool ? 'FFFFFF' : NIGHT, align: 'center', valign: 'middle' });
            head(s, st.h, 1.6, y + 0.02, 7.45, 0.36, { max: 15 });
            body(s, st.t, 1.6, y + 0.38, 7.45, hh - 0.46, { max: 13.5, color: C.muted });
            if (i < n - 1) t.line(s, 1.6, y + hh - 0.03, 7.45, 0, '5B3C8C', 0.75, { dash: 'dash' });
          }
        },
      ],
      stats: [
        async (d) => { // one number at the centre of the heat, the others cooler round it
          const s = await page(d), [a, ...rest] = d.stats;
          t.img(s, await glow('C2185B', 'A0124E'), 0.0, 0.85, 5.0, 4.5, { alt: '' }); // no yellow heart here: white type must read on it
          t.text(s, a.value, { x: 0.6, y: 2.0, w: 3.8, h: 1.2, fontFace: 'Arial', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.7, 1.1, 60, 22, 'Arial', true) });
          body(s, a.label, 1.0, 3.3, 3.0, 0.9, { align: 'center', max: 14, color: 'FFFFFF' });
          rest.forEach((x, i) => {
            const y = 1.33 + i * 1.08;
            t.text(s, x.value, { x: 5.0, y, w: 4.05, h: 0.56, fontFace: 'Arial', bold: true, color: i ? 'FF6F3C' : 'FFB000', valign: 'middle', fontSize: L.fit(x.value, 4.0, 0.52, 30, 15, 'Arial', true) });
            body(s, x.label, 5.0, y + 0.56, 4.05, 0.46, { max: 12.5, color: C.muted });
          });
          if (d.note) body(s, d.note, 5.0, 3.55, 4.05, 1.55, { max: 12.5, valign: 'middle' });
        },
        async (d) => { // an instrument's readings: dark displays, a row each
          const s = await page(d), rh = d.note ? 0.92 : 1.2;
          d.stats.forEach((x, i) => {
            const y = 1.33 + i * rh;
            t.rect(s, 0.6, y, 3.5, rh - 0.1, '05030F', { line: { color: HOT[i + 1], width: 1.5 }, name: 'Display' });
            t.text(s, x.value, { x: 0.75, y, w: 3.2, h: rh - 0.1, fontFace: 'Arial', bold: true, color: Y, align: 'right', valign: 'middle', fontSize: L.fit(x.value, 3.1, rh - 0.25, 36, 15, 'Arial', true) });
            body(s, x.label, 4.35, y + 0.03, 4.7, rh - 0.16, { valign: 'middle', max: 15 });
          });
          if (d.note) body(s, d.note, 0.6, 4.15, XW, 0.95, { max: 12.5, color: C.muted, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // cold side, hot side: one gradient across the page, the columns mirrored
          const s = await page(d), w = 3.75, cx = 4.82;
          t.img(s, await svgOnce(ctx, 'ch', `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="400"><defs><linearGradient id="g"><stop offset="0" stop-color="#1A1060"/><stop offset="0.45" stop-color="#2A1050"/><stop offset="0.55" stop-color="#5C0F3A"/><stop offset="1" stop-color="#9A1A2E"/></linearGradient></defs><rect width="900" height="400" fill="url(#g)"/></svg>`, 900, 400), 0, 1.25, 9.05, 3.92, { alt: '' });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, 'Calibri', 0.14, 2.9);
          head(s, d.left.h, 0.72, 1.33, w, 0.6, { align: 'right', color: '9FD3FF', max: 19 }); head(s, d.right.h, 5.15, 1.33, w - 0.2, 0.6, { color: 'FFD08A', max: 19 });
          t.line(s, cx, 1.35, 0, 3.72, Y, 1, { dash: 'dash' });
          let y = 2.02;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) t.text(s, d.left.items[j], { x: 0.72, y, w, h: rh, fontSize: fs, color: 'FFFFFF', align: 'right' });
            if (d.right.items[j]) t.text(s, d.right.items[j], { x: 5.15, y, w: w - 0.2, h: rh, fontSize: fs, color: 'FFFFFF' });
            y += rh;
          });
        },
        async (d) => { // a hot band and a cold band laid one over the other, the readings in a row
          const s = await page(d), hh = 1.84;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.3 + i * (hh + 0.06), n = side.items.length, gx = 0.2, w = (XW - gx * (n - 1)) / n, c = i ? '9FD3FF' : 'FFB000';
            t.rect(s, 0.6, y, XW, hh, i ? '12205E' : '4A0F2E', { name: 'Band' });
            t.rect(s, 0.6, y, XW, 0.05, c, { name: 'Edge' });
            head(s, side.h, 0.78, y + 0.1, XW - 0.36, 0.44, { color: c, max: 17 });
            side.items.forEach((it, j) => body(s, it, 0.78 + j * (w - 0.04 + gx), y + 0.56, w - 0.16, hh - 0.64, { max: 13.5, color: 'FFFFFF' }));
          });
        },
      ],
      statement: [
        async (d) => { // large yellow words, the note cut off by a strip of the scale
          const s = await page(d, 'focus');
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 5.4, h: 3.8, fontFace: 'Arial', bold: true, color: Y, valign: 'middle', fontSize: L.fit(d.text, 5.4, 3.7, 36, 16, 'Arial', true) });
          t.img(s, await ramp('v'), 6.2, 1.35, 0.1, 3.7, { alt: '' });
          if (d.caption) body(s, d.caption, 6.5, 1.35, 2.55, 3.7, { max: 14, valign: 'middle' });
        },
        async (d) => { // the thought caught in the viewfinder, the note above it
          const s = await page(d);
          if (d.caption) body(s, d.caption, 0.6, 1.28, XW, 1.1, { max: 13, color: C.muted });
          t.rect(s, 0.6, 2.46, XW, 2.65, '05030F', { t: 25, name: 'Finder' });
          brk(s, 0.72, 2.56, XW - 0.24, 2.45, Y, 0.4, 2);
          t.text(s, L.runs(d.text), { x: 1.05, y: 2.65, w: XW - 0.9, h: 2.27, fontFace: 'Arial', bold: true, color: C.ink, valign: 'middle', align: 'center', fontSize: L.fit(d.text, XW - 0.9, 2.2, 32, 16, 'Arial', true) });
        },
      ],
      timeline: [
        async (d) => { // the years up a tall scale, the oldest coldest at the foot
          const s = await page(d), hh = 3.76 / 4;
          t.img(s, await ramp('v'), 0.6, 1.32, 0.16, 3.76, { alt: '' });
          d.items.forEach((it, i) => {
            const y = 1.32 + (3 - i) * hh;
            t.line(s, 0.76, y + 0.24, 0.2, 0, Y, 1.5);
            t.text(s, it.year, { x: 1.05, y, w: 1.55, h: hh - 0.08, fontFace: 'Arial', bold: true, color: HOT[i] === '7B1FA2' ? 'C58BFF' : HOT[i] === 'C2185B' ? 'FF7DB0' : HOT[i] === 'FF3D00' ? 'FF7A52' : 'FFB000', valign: 'top', fontSize: L.fit(it.year, 1.5, hh - 0.2, 20, 11, 'Arial', true) });
            head(s, it.h, 2.7, y, 6.35, 0.34, { max: 14.5 });
            body(s, it.t, 2.7, y + 0.34, 6.35, hh - 0.42, { max: 13, color: C.muted });
          });
        },
        async (d) => { // the heat band across the middle, events over and under it by turn
          const s = await page(d), ly = 3.1, w = 3.55, xs = [0.6, 1.1, 4.85, 5.5];
          t.img(s, await ramp('h'), 0, ly, 9.05, 0.2, { alt: '' });
          d.items.forEach((it, i) => {
            const up = i % 2 === 0, x = xs[i], y = up ? 1.28 : ly + 0.32;
            marker(s, x, ly - 0.09, 0.38, i, '');
            t.text(s, [{ text: it.year + '   ', options: { color: 'FFB000', bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x, y, w, h: 0.4, fontFace: 'Arial', fontSize: L.fit(`${it.year}   ${it.h}`, w, 0.36, 14.5, 10, 'Arial', true), valign: 'middle' });
            body(s, it.t, x, y + 0.42, w, up ? 1.3 : 1.05, { max: 13 });
          });
        },
        async (d) => { // a hot spot marks each year, the words beside it
          const s = await page(d), w = 4.12, hh = 1.86, dd = 0.95;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + (i % 2) * (w + 0.21), y = 1.3 + Math.floor(i / 2) * hh + (i % 2 ? 0.1 : 0);
            t.img(s, await glow(C.pal[[0, 2, 4, 3][i]]), x - 0.1, y, dd, dd, { alt: '' });
            cross(s, x + dd / 2 - 0.1, y + dd / 2, 0.16, NIGHT);
            head(s, it.year, x + 0.95, y, w - 0.95, 0.38, { max: 18, color: 'FFB000' });
            head(s, it.h, x + 0.95, y + 0.38, w - 0.95, 0.32, { max: 14 });
            body(s, it.t, x + 0.95, y + 0.7, w - 0.95, hh - 0.76, { max: 12.5 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old panels look like the cards
    R.timeline = V.timeline.shift(); // and so do the old timeline columns
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 5.9, 0.8, 3.2, 3.6);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.0, h: 2.3, bold: true, fontSize: L.fit(d.title, 5.0, 2.2, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.4, w: 4.9, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.25, w: 4.9, h: 0.45, fontSize: 16, bold: true, color: 'FF6F3C' });
    metaFooter({ color: C.muted, w: 8.5 })(ctx, s);
  },
};
module.exports = { id: 100, slug: 'termal', name: 'Termal', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "diagnostika tili: 'issiq nuqtalar', muammo va yechim; aniq, raqamlarga tayangan", limits: {}, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "bold"], "transitions": ["dissolve", "p14:flash", "cut"], "cover": ["focusIn", "fadeLetters"], "mark": "focusIn", "deco": "dissolve", "sig": {"title": "dissolve", "body": "fade", "item": "focusIn", "image": "dissolve", "number": "popOver", "order": "centerOut", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
