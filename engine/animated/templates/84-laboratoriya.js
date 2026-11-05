/** 84 Laboratoriya — chemistry lab: flasks with coloured liquids as markers, graduated cards, a petri-dish photo. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F3F8FB', ink: '1C2B39', muted: '587083', accent: '2EC4B6', glass: '7FA7C0', pal: ['2EC4B6', 'E71D73', 'FFBF00', '7B5EA7', '3A86FF', 'FB5607'] };
const flask = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="220"><path d="M78,10 L122,10 L122,70 L180,190 Q185,210 165,210 L35,210 Q15,210 20,190 L78,70 Z" fill="#fff" stroke="#${C.glass}" stroke-width="7"/><path d="M52,135 L148,135 L176,192 Q180,204 165,204 L35,204 Q20,204 24,192 Z" fill="#${c}" opacity="0.9"/><circle cx="85" cy="165" r="7" fill="#fff" opacity="0.7"/><circle cx="115" cy="150" r="5" fill="#fff" opacity="0.7"/><rect x="70" y="2" width="60" height="14" rx="4" fill="#${C.glass}"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Laboratoriya', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'table' },
  bg: (ctx, s) => { s.background = { color: C.bg }; },
  // lab card: white sheet with graduation ticks along the left edge
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.08, line: { color: 'D3E2EC', width: 1 }, shadow: 0.12, blur: 6, offset: 2, name: 'Lab card' }); if (!o.big) for (let m = 0; m < Math.floor(h / 0.25); m++) t.line(s, x + 0.06, y + 0.2 + m * 0.25, m % 4 ? 0.08 : 0.16, 0, C.pal[k % 6], 1.25); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'f' + (k % 6), flask(C.pal[k % 6]), 200, 220), x, y - d * 0.05, d, d * 1.1); if (label !== '') ctx.t.text(s, String(label), { x, y: y + d * 0.55, w: d, h: d * 0.45, fontSize: Math.round(d * 18), bold: true, color: [0, 2].includes(k % 6) ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { const dd = Math.min(w, h); const px = x + (w - dd) / 2, py = y + (h - dd) / 2; ctx.t.oval(s, px - 0.12, py - 0.12, dd + 0.24, dd + 0.24, 'FFFFFF', { line: { color: C.glass, width: 2.5 } }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), dd, dd, { mask: 'circle' }), px, py, dd, dd, { alt: '' }); ctx.t.oval(s, px - 0.05, py - 0.05, dd + 0.1, dd + 0.1, null, { line: { color: 'D3E2EC', width: 1.25 } }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.glass, 2),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.5, 0.3, 0.72, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.pal[1], valueColor: (i) => (i % 6 === 2 ? 'B88A00' : C.pal[i % 6]),
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.muted, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const night = '10202E', nightUp = '1B3145', glow = ['2EC4B6', 'FF6FAE', 'FFBF00', 'B79CE8'], pale = 'E6F1F7', soft = 'A9C2D2', tint = ['D5F3F0', 'FBD9E6', 'FFF0C2', 'E5DEF2', 'D9E7FF', 'FFE0D0'], onLiquid = (k) => ([0, 2].includes(k % 6) ? C.ink : 'FFFFFF');
    const nightTitle = async (s, d) => { await K.marker(ctx, s, 0.5, 0.3, 0.72, ctx.idx, ctx.idx); t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Arial', true) }); };
    const dark = async (d) => { const s = await newSlide('focus'); t.rect(s, 0, 0, 10, 5.625, night, { name: 'Dark room' }); await nightTitle(s, d); metaFooter({ color: soft })(ctx, s); return s; };
    const scale = (s, x, y, ht, c = C.glass, right = false) => { t.line(s, x, y, 0, ht, c, 1.5); for (let m = 0; m <= Math.floor(ht / 0.2); m++) { const w = m % 5 ? 0.09 : 0.18; t.line(s, right ? x : x - w, y + m * 0.2, w, 0, c, 1); } };
    const tube = async (s, x, y, w, ht, c) => t.img(s, await svgOnce(ctx, 'tube' + c, `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="100"><rect x="4" y="16" width="300" height="68" rx="34" fill="#fff" stroke="#${C.glass}" stroke-width="5"/><path d="M92,20 L272,20 A30,30 0 0 1 272,80 L92,80 Z" fill="#${c}"/><rect x="4" y="6" width="14" height="88" rx="5" fill="#${C.glass}"/></svg>`, 320, 100), x, y, w, ht);
    const V = {
      image: [
        async (d) => { // through the eyepiece: a round field with the graticule on it
          const s = await page(d), dia = 3.55, x = 5.75, y = 1.32;
          t.oval(s, x - 0.16, y - 0.1, dia + 0.2, dia + 0.2, C.ink, { name: 'Eyepiece' });
          t.img(s, await L.photo(L.src(d.image), dia - 0.12, dia - 0.12, { mask: 'circle' }), x - 0.0, y + 0.06 - 0.06, dia - 0.12, dia - 0.12, { alt: '' });
          const cx = x + (dia - 0.12) / 2, cy = y + (dia - 0.12) / 2;
          t.line(s, cx - 1.3, cy, 2.6, 0, 'FFFFFF', 1); t.line(s, cx, cy - 1.3, 0, 2.6, 'FFFFFF', 1);
          for (let k = -5; k <= 5; k++) if (k) { t.line(s, cx + k * 0.24, cy - 0.05, 0, 0.1, 'FFFFFF', 1); t.line(s, cx - 0.05, cy + k * 0.24, 0.1, 0, 'FFFFFF', 1); }
          scale(s, 0.62, 1.42, 3.4, C.accent);
          body(s, d.text, 0.85, 1.38, 4.5, 3.5, { max: 15, k: 1.18, valign: 'middle', color: C.ink });
        },
        async (d) => { // the picture fills the room, a lab card stands in front of it
          const s = await newSlide('focus');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.17, 10, 0.455, night, { name: 'Footer band' });
          metaFooter({ color: pale })(ctx, s);
          await panel(s, 5.1, 0.32, 4.55, 4.6, 1);
          await marker(s, 5.4, 0.45, 0.62, ctx.idx, ctx.idx);
          head(s, d.title, 6.12, 0.42, 3.4, 0.8, { max: 18 });
          body(s, d.text, 5.42, 1.35, 4.05, 3.45, { max: 14, k: 1.1, color: C.ink, valign: 'middle' });
        },
        async (d) => { // the picture poured into a conical flask
          const s = await page(d), x = 0.6, y = 1.25, w = 3.95, ht = 3.85;
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { poly: [[0.38, 0.02], [0.62, 0.02], [0.62, 0.3], [0.99, 0.98], [0.01, 0.98], [0.38, 0.3]] } }), x, y, w, ht, { alt: '' });
          t.img(s, await svgOnce(ctx, 'flaskline', `<svg xmlns="http://www.w3.org/2000/svg" width="790" height="770"><path d="M300,16 L490,16 L490,231 L782,755 L8,755 L300,231 Z" fill="none" stroke="#${C.glass}" stroke-width="9" stroke-linejoin="round"/><rect x="280" y="4" width="230" height="20" rx="7" fill="#${C.glass}"/></svg>`, 790, 770), x, y, w, ht);
          body(s, d.text, 4.85, 1.38, 4.55, 3.55, { max: 15, k: 1.18, valign: 'middle', color: C.ink });
        },
        async (d) => { // a glass slide: the specimen across the page, a frosted label at its end
          const s = await page(d), x = 0.6, y = 1.25, ht = 1.75;
          t.rect(s, x, y, 8.8, ht, 'FFFFFF', { line: { color: C.glass, width: 1.5 }, shadow: 0.12, blur: 6, offset: 2, name: 'Glass slide' });
          t.rect(s, x, y, 1.15, ht, tint[0], { name: 'Frosted end' });
          for (let k = 0; k < 4; k++) t.line(s, x + 0.2, y + 0.45 + k * 0.27, 0.75, 0, C.pal[k], 1.5);
          t.img(s, await L.photo(L.src(d.image), 7.45, ht - 0.2), x + 1.25, y + 0.1, 7.45, ht - 0.2, { alt: '' });
          body(s, d.text, 0.6, 3.15, 8.8, 1.95, { max: 14, k: 1.1, color: C.ink });
        },
      ],
      cards: [
        async (d) => { // the periodic table: element squares, a big one when there are three
          const s = await page(d), n = d.items.length, g = 0.14, W2 = 4.33, H2 = 1.75;
          const cell = n === 4 ? [[0.6, 1.35], [0.6 + W2 + g, 1.35], [0.6, 1.35 + H2 + g], [0.6 + W2 + g, 1.35 + H2 + g]].map(([x, y]) => [x, y, W2, H2]) : [[0.6, 1.35, W2, 2 * H2 + g], [0.6 + W2 + g, 1.35, W2, H2], [0.6 + W2 + g, 1.35 + H2 + g, W2, H2]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, w, ht] = cell[i], big = ht > 2, c = C.pal[i], sw = big ? 1.5 : 1.05, on = onLiquid(i);
            t.rect(s, x, y, w, ht, tint[i], { line: { color: c, width: 1 }, name: 'Element' });
            t.rect(s, x, y, sw, big ? 1.5 : ht, c, { name: 'Element symbol' });
            t.text(s, String(i + 1), { x: x + 0.08, y: y + 0.05, w: 0.4, h: 0.3, bold: true, fontSize: 12, color: on });
            t.img(s, await L.icon(it.icon, on, 2), x + sw / 2 - (big ? 0.35 : 0.24), y + (big ? 1.5 : ht) / 2 - (big ? 0.3 : 0.17), big ? 0.7 : 0.48, big ? 0.7 : 0.48);
            if (big) { head(s, it.h, x + 1.65, y + 0.2, w - 1.8, 1.1, { max: 22 }); body(s, it.t, x + 0.2, y + 1.65, w - 0.4, ht - 1.8, { max: 16, color: C.ink, k: 1.15 }); }
            else { head(s, it.h, x + sw + 0.14, y + 0.08, w - sw - 0.26, 0.42, { max: 14 }); body(s, it.t, x + sw + 0.14, y + 0.5, w - sw - 0.26, ht - 0.58, { max: 13, color: C.ink }); }
          }
        },
        async (d) => { // a rack of test tubes lying on their side
          const s = await page(d), n = d.items.length, rh = 3.72 / n;
          t.rect(s, 0.6, 1.3, 0.1, 3.72, C.glass, { name: 'Rack' }); t.rect(s, 2.32, 1.3, 0.1, 3.72, C.glass, { name: 'Rack' });
          for (const [i, it] of d.items.entries()) {
            const y = 1.3 + i * rh, c = C.pal[i];
            await tube(s, 0.62, y + rh / 2 - 0.3, 1.95, 0.6, c);
            t.img(s, await L.icon(it.icon, onLiquid(i), 2), 1.72, y + rh / 2 - 0.15, 0.3, 0.3);
            head(s, it.h, 2.8, y + 0.04, 2.3, rh - 0.08, { max: 15, color: i === 2 ? 'A87E00' : c });
            body(s, it.t, 5.2, y + 0.05, 4.2, rh - 0.1, { max: 13, color: C.ink, valign: 'middle' });
            if (i < n - 1) t.line(s, 2.8, y + rh, 6.6, 0, 'D3E2EC', 1);
          }
        },
        async (d) => { // a molecule: a ring in the middle, each item bonded to it
          const s = await page(d), n = d.items.length, cw = 3.3, rH = 1.74, cx = 5, cy = 3.2;
          const cell = n === 4 ? [[0.6, 1.3], [6.1, 1.3], [0.6, 3.3], [6.1, 3.3]] : [[0.6, 1.3], [6.1, 2.3], [0.6, 3.3]];
          for (const [x, y] of cell) { const right = x > 5, ey = y + rH / 2, ex = right ? x : x + cw; t.shape(s, 'LINE', { x: Math.min(cx, ex), y: Math.min(cy, ey), w: Math.abs(cx - ex), h: Math.abs(cy - ey), line: { color: C.glass, width: 3 }, flipV: (right && ey < cy) || (!right && ey > cy), objectName: 'Bond' }); }
          t.img(s, await svgOnce(ctx, 'ring', `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><polygon points="150,14 268,82 268,218 150,286 32,218 32,82" fill="#fff" stroke="#${C.ink}" stroke-width="9"/><polygon points="150,54 233,102 233,198 150,246 67,198 67,102" fill="none" stroke="#${C.accent}" stroke-width="7"/></svg>`, 300, 300), cx - 0.72, cy - 0.72, 1.44, 1.44);
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i];
            await panel(s, x, y, cw, rH, i);
            t.oval(s, x + 0.3, y + 0.12, 0.44, 0.44, C.pal[i]); t.img(s, await L.icon(it.icon, onLiquid(i), 2), x + 0.41, y + 0.23, 0.22, 0.22);
            head(s, it.h, x + 0.84, y + 0.1, cw - 0.94, 0.48, { max: 13 });
            body(s, it.t, x + 0.3, y + 0.62, cw - 0.42, rH - 0.68, { max: 12.5, color: C.ink });
          }
        },
        async (d) => { // the lights off, the samples glow under the lamp at two heights
          const s = await dark(d), n = d.items.length, g = 0.16, w = (8.8 - g * (n - 1)) / n, ht = 3.1;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + g), y = i % 2 ? 2.0 : 1.3, c = glow[i];
            t.rect(s, x, y, w, ht, nightUp, { r: 0.08, line: { color: c, width: 2 }, shadow: 0.7, shadowColor: c, blur: 10, offset: 0, name: 'Glowing sample' });
            t.img(s, await L.icon(it.icon, c, 2), x + 0.16, y + 0.16, 0.44, 0.44);
            head(s, it.h, x + 0.16, y + 0.66, w - 0.3, 0.52, { max: 14, color: c });
            body(s, it.t, x + 0.16, y + 1.2, w - 0.3, ht - 1.28, { max: 13, color: pale });
          }
        },
      ],
      process: [
        async (d) => { // a staircase of stills: each flask stands on a lower shelf than the last
          const s = await page(d), n = d.steps.length, g = 0.12, w = (8.8 - g * (n - 1)) / n, y0 = 1.98, yN = 3.25, floor = 5.08;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + g), y = y0 + i * (yN - y0) / (n - 1);
            t.rect(s, x, y, w, floor - y, tint[i], { name: 'Shelf' }); t.rect(s, x, y, w, 0.06, C.pal[i], { name: 'Shelf edge' });
            await marker(s, x + 0.12, y - 0.6, 0.56, i, i + 1);
            if (i < n - 1) { const y2 = y0 + (i + 1) * (yN - y0) / (n - 1); t.line(s, x + 0.72, y - 0.35, w + g - 0.72 + 0.12 + 0.28, 0, C.glass, 2.5); t.line(s, x + w + g + 0.4, y - 0.35, 0, y2 - 0.6 - (y - 0.35), C.glass, 2.5); }
            head(s, st.h, x + 0.12, y + 0.1, w - 0.22, 0.46, { max: 14 });
            body(s, st.t, x + 0.12, y + 0.58, w - 0.22, floor - y - 0.64, { max: 13, color: C.ink });
          }
        },
        async (d) => { // a condenser down the middle of the page, the steps alternate on its sides
          const s = await page(d), n = d.steps.length, ch = 1.74, w = 4.0, ys = n === 4 ? [1.3, 1.62, 3.3, 3.32] : [1.3, 2.3, 3.3];
          t.rect(s, 4.87, 1.28, 0.26, 3.8, 'FFFFFF', { r: 0.1, line: { color: C.glass, width: 2 }, name: 'Condenser' });
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? 5.4 : 0.6, y = ys[i];
            await panel(s, x, y, w, ch, i);
            const my = n === 4 ? 1.45 + i * 0.85 : y + ch / 2 - 0.27;
            t.line(s, right ? 5 : x + w, my + 0.27, 0.4, 0, C.glass, 2);
            await marker(s, 4.75, my, 0.5, i, i + 1);
            head(s, st.h, x + 0.3, y + 0.1, w - 0.42, 0.44, { max: 14 });
            body(s, st.t, x + 0.3, y + 0.56, w - 0.42, ch - 0.64, { max: 13, color: C.ink });
          }
        },
        async (d) => { // a density column: the steps settle as coloured layers in one tall beaker
          const s = await page(d), n = d.steps.length, top = 1.32, ht = 3.7, rh = ht / n;
          for (const [i, st] of d.steps.entries()) {
            const y = top + i * rh;
            t.rect(s, 0.6, y, 8.8, rh, tint[(i * 2 + 1) % 6], { name: 'Layer' });
            t.text(s, String(i + 1), { x: 0.8, y, w: 0.8, h: rh, bold: true, fontSize: 34, color: C.pal[(i * 2 + 1) % 6], valign: 'middle' });
            head(s, st.h, 1.6, y + 0.04, 2.4, rh - 0.08, { max: 15 });
            body(s, st.t, 4.1, y + 0.05, 5.1, rh - 0.1, { max: 13, color: C.ink, valign: 'middle' });
          }
          t.rect(s, 0.6, top, 8.8, ht, null, { line: { color: C.glass, width: 3 }, name: 'Beaker' });
          scale(s, 9.4, top + 0.1, ht - 0.2, C.glass, true);
        },
      ],
      stats: [
        async (d) => { // three petri dishes on the bench, a reading in each
          const s = await page(d), dia = 1.85;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * 3 + (2.8 - dia) / 2, y = i === 1 ? 1.5 : 1.28;
            t.oval(s, px - 0.1, y - 0.04, dia + 0.2, dia + 0.2, 'FFFFFF', { line: { color: C.glass, width: 2.5 } });
            t.oval(s, px, y + 0.06, dia, dia, tint[i], { line: { color: C.pal[i], width: 1 } });
            t.text(s, x.value, { x: px + 0.1, y: y + 0.4, w: dia - 0.2, h: dia - 0.68, bold: true, fontSize: L.fit(x.value, dia - 0.2, 0.9, 38, 16, 'Arial', true), color: C.ink, align: 'center', valign: 'middle' });
            body(s, x.label, 0.6 + i * 3, y + dia + 0.2, 2.8, 0.6, { max: 12.5, align: 'center', color: C.ink });
          }
          if (d.note) { t.line(s, 0.6, 4.14, 8.8, 0, C.glass, 1); body(s, d.note, 0.6, 4.2, 8.8, 0.9, { max: 12, valign: 'middle' }); }
        },
        async (d) => { // the instrument's display: one reading large, two beside it
          const s = await dark(d), [a, b, c] = d.stats, lcd = '0A1620';
          t.rect(s, 0.6, 1.3, 4.75, 2.55, lcd, { r: 0.05, line: { color: glow[0], width: 2 }, name: 'Display' });
          t.text(s, a.value, { x: 0.8, y: 1.38, w: 4.35, h: 1.4, fontFace: 'Courier New', bold: true, fontSize: L.fit(a.value, 4.35, 1.3, 66, 24, 'Courier New', true), color: glow[0], align: 'center', valign: 'middle' });
          body(s, a.label, 0.85, 2.85, 4.25, 0.9, { max: 14, color: pale, align: 'center', valign: 'middle' });
          for (const [i, x] of [b, c].entries()) {
            const y = 1.3 + i * 1.32, g2 = glow[i + 1];
            t.rect(s, 5.55, y, 3.85, 1.23, lcd, { r: 0.05, line: { color: g2, width: 1.5 }, name: 'Display' });
            t.text(s, x.value, { x: 5.65, y: y + 0.08, w: 1.75, h: 1.07, fontFace: 'Courier New', bold: true, fontSize: L.fit(x.value, 1.75, 1, 26, 14, 'Courier New', true), color: g2, align: 'center', valign: 'middle' });
            body(s, x.label, 7.45, y + 0.08, 1.85, 1.07, { max: 12, color: pale, valign: 'middle' });
          }
          if (d.note) body(s, d.note, 0.6, 4.0, 8.8, 1.1, { max: 13, color: soft, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // two samples, mirrored about a burette; the beads mark the rows
          const s = await page(d), w = 3.85, top = 2.02, sides = [d.left, d.right], n = Math.max(d.left.items.length, d.right.items.length);
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.2, 3.05);
          const rh = 3.05 / n;
          t.rect(s, 4.87, 1.3, 0.26, 3.78, 'FFFFFF', { r: 0.1, line: { color: C.glass, width: 2 }, name: 'Burette' });
          for (const [i, side] of sides.entries()) {
            const x = i ? 5.45 : 0.7, c = i ? C.pal[4] : C.pal[1];
            t.rect(s, x - 0.1, 1.3, w + 0.2, 0.58, c, { name: 'Sample label' });
            head(s, side.h, x, 1.32, w, 0.54, { max: 17, color: 'FFFFFF', align: i ? 'left' : 'right' });
            for (const [j, it] of side.items.entries()) t.text(s, it, { x, y: top + j * rh, w, h: rh, fontSize: fs, color: C.ink, align: i ? 'left' : 'right', valign: 'middle' });
          }
          for (let j = 0; j < n; j++) { t.oval(s, 4.84, top + j * rh + rh / 2 - 0.16, 0.32, 0.32, C.pal[j % 2 ? 4 : 1], { line: { color: 'FFFFFF', width: 1.5 } }); if (j) t.line(s, 0.7, top + j * rh, 3.85, 0, 'D3E2EC', 1); if (j) t.line(s, 5.45, top + j * rh, 3.85, 0, 'D3E2EC', 1); }
        },
        async (d) => { // two layers one over the other, a tab holds each sample's name
          const s = await page(d), ht = 1.8, tints = [tint[0], tint[2]], tabs = [C.pal[0], C.pal[2]];
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.3 + i * (ht + 0.12), n = side.items.length, rws = Math.ceil(n / 2), w = 3.1, rh = (ht - 0.16) / rws;
            t.rect(s, 0.6, y, 8.8, ht, tints[i], { name: 'Layer' });
            t.rect(s, 0.6, y, 2.1, ht, tabs[i], { name: 'Tab' });
            head(s, side.h, 0.72, y + 0.1, 1.86, ht - 0.2, { max: 18, color: C.ink });
            const fs = Math.min(...side.items.map((it) => L.fit(it, w - 0.22, rh - 0.04, 13, 10, 'Calibri')));
            for (const [j, it] of side.items.entries()) {
              const x = 2.9 + (j % 2) * (w + 0.1), yy = y + 0.08 + Math.floor(j / 2) * rh;
              t.oval(s, x, yy + rh / 2 - 0.06, 0.12, 0.12, C.ink);
              t.text(s, it, { x: x + 0.22, y: yy, w: w - 0.22, h: rh, fontSize: fs, color: C.ink, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // the result, in the dark, beside a flask that has turned
          const s = await dark(d);
          t.img(s, await svgOnce(ctx, 'fbig', flask(C.pal[0]), 200, 220), 6.75, 1.45, 3.0, 3.3);
          for (const [x, y, r] of [[8.3, 1.3, 0.14], [8.65, 0.95, 0.09], [8.05, 0.9, 0.06]]) t.oval(s, x, y, r * 2, r * 2, null, { line: { color: glow[0], width: 1.5 } });
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 5.9, h: 2.25, bold: true, fontSize: L.fit(d.text, 5.9, 2.2, 28, 16, 'Arial', true), color: 'FFFFFF', valign: 'middle' });
          t.rect(s, 0.6, 3.62, 1.2, 0.05, glow[0], { name: 'Rule' });
          if (d.caption) body(s, d.caption, 0.6, 3.75, 5.9, 1.35, { max: 13, color: soft });
        },
        async (d) => { // a reagent label pasted on the wide wall of the page, the scale beside it
          const s = await page(d, 'focus');
          t.rect(s, 0, 1.3, 6.3, 3.75, C.pal[3], { name: 'Reagent label' });
          t.rect(s, 0, 1.3, 0.28, 3.75, C.pal[2], { name: 'Label edge' });
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.45, w: 5.4, h: 3.45, bold: true, fontSize: L.fit(d.text, 5.4, 3.4, 32, 16, 'Arial', true), color: 'FFFFFF', valign: 'middle' });
          scale(s, 6.68, 1.35, 3.65, C.glass);
          if (d.caption) body(s, d.caption, 6.85, 1.35, 2.6, 3.65, { max: 14, color: C.ink, valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // one long tube across the page, the dates above and below it in turn
          const s = await page(d), ty = 3.08, up = 1.3, dn = 3.48, hh = 1.6, xs = [0.6, 2.75, 5.05, 7.0], w = [4.2, 4.0, 4.2, 2.4];
          t.rect(s, 0.6, ty, 8.8, 0.26, tint[0], { r: 0.1, line: { color: C.glass, width: 2 }, name: 'Tube' });
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = 0.6 + (i >> 1) * 4.5 + (above ? 0 : 0.5), cw = 3.95, y = above ? up : dn;
            t.line(s, x + 0.12, above ? y + 0.2 : ty + 0.26, 0, above ? ty - y - 0.2 : dn - ty - 0.26 + 0.1, C.pal[i], 1.5);
            t.oval(s, x, ty + 0.01, 0.24, 0.24, C.pal[i], { line: { color: 'FFFFFF', width: 1.5 } });
            const ix = x + 0.26;
            head(s, it.year, ix, y, 1.35, 0.42, { max: 18, color: i === 2 ? 'A87E00' : C.pal[i] });
            head(s, it.h, ix + 1.4, y, cw - 1.66, 0.42, { max: 13 });
            body(s, it.t, ix, y + 0.44, cw - 0.26, hh - 0.46, { max: 13, color: C.ink });
          }
        },
        async (d) => { // four tall test tubes in the rack, the date in the liquid
          const s = await page(d), g = 0.16, w = (8.8 - g * 3) / 4, top = 1.3, bot = 5.08;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + g), c = C.pal[i];
            t.rect(s, x, top, w, bot - top, 'FFFFFF', { r: 0.4, line: { color: C.glass, width: 2 }, name: 'Test tube' });
            t.rect(s, x + 0.07, bot - 1.0, w - 0.14, 0.93, c, { r: 0.36, name: 'Liquid' });
            t.rect(s, x + 0.07, bot - 1.0, w - 0.14, 0.4, c, { name: 'Liquid' });
            t.rect(s, x - 0.05, top, w + 0.1, 0.1, C.glass, { r: 0.04, name: 'Rim' });
            head(s, it.year, x + 0.15, bot - 0.92, w - 0.3, 0.72, { max: 20, color: onLiquid(i), align: 'center' });
            head(s, it.h, x + 0.18, top + 0.16, w - 0.36, 0.52, { max: 14, align: 'center' });
            body(s, it.t, x + 0.18, top + 0.7, w - 0.36, 1.98, { max: 13, color: C.ink, align: 'center' });
          }
        },
      ],
    };
    R.image = V.image.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 0.7, 3.0, 3.0);
    for (let k = 0; k < 4; k++) await K.marker(ctx, s, 5.55 + k * 0.95, 3.95, 0.8, k, '');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.0, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.0, 2.1, 38, 18, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 4.9, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.9, h: 0.45, fontSize: 16, bold: true, color: C.pal[1] });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 84, slug: 'laboratoriya', name: 'Laboratoriya', category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "tajriba bayoni kabi: maqsad, usul, natija va xulosa; ilmiy aniq", limits: {}, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "playful"], "transitions": ["p14:ripple", "fade", "morph"], "cover": ["riseSettle", "fadeLetters"], "mark": "bounceDrop", "deco": "riseUp", "sig": {"title": "riseSettle", "body": "fadeUp", "item": "riseUp", "image": "circle", "number": "bounceDrop", "order": "seq", "stagger": 0.14}, "tempo": 1.0, "kenburns": false};
