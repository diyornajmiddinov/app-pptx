/** 94 Qo'lyozma — manuscript scroll: aged parchment with burnt edges, rolled scroll ends, wax seals, ornamental rules. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EFDDB8', ink: '3E2A14', muted: '6E5333', accent: '8B1E1E', pal: ['8B1E1E', '5B3A1A', '2F4F4F', '7A5C1E', '4B2C4F', '8B4513'] };
const parch = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.5" cy="0.5" r="0.72"><stop offset="0.55" stop-color="#F3E3C1"/><stop offset="0.9" stop-color="#D9B983"/><stop offset="1" stop-color="#A9844E"/></radialGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.12  0 0 0 0.12 0"/></filter></defs><rect width="1600" height="900" fill="url(#g)"/><rect width="1600" height="900" filter="url(#n)"/></svg>`;
const seal = (c) => { let p = ''; for (let k = 0; k < 18; k++) { const a = (k / 18) * 2 * Math.PI, r = k % 2 ? 88 : 96; p += `${(100 + r * Math.cos(a)).toFixed(0)},${(100 + r * Math.sin(a)).toFixed(0)} `; } return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><polygon points="${p}" fill="#${c}"/><circle cx="100" cy="100" r="66" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="5"/><ellipse cx="78" cy="70" rx="22" ry="12" fill="#fff" opacity="0.25"/></svg>`; };
const ornament = (w) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="30"><line x1="0" y1="15" x2="${w / 2 - 30}" y2="15" stroke="#6E5333" stroke-width="2"/><line x1="${w / 2 + 30}" y1="15" x2="${w}" y2="15" stroke="#6E5333" stroke-width="2"/><path d="M${w / 2 - 22},15 Q${w / 2},-6 ${w / 2 + 22},15 Q${w / 2},36 ${w / 2 - 22},15 Z" fill="#8B1E1E"/></svg>`;
const K = {
  F: { head: 'Cambria', body: 'Cambria' }, C, theme: theme("Qo'lyozma", C, C.pal), layout: { agenda: 'list', cards: 'rows', process: 'list', stats: 'markers', timeline: 'table' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', parch(), 1600, 900, true) }; },
  // scroll: parchment sheet with rolled top and bottom ends
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, 'F7EBD3', { line: { color: 'C9A46B', width: 1 }, name: 'Scroll' }); if (!o.big && h > 0.9) { t.rect(s, x - 0.06, y - 0.06, w + 0.12, 0.14, 'C9A46B', { r: 0.07, name: 'Roll' }); t.rect(s, x - 0.06, y + h - 0.08, w + 0.12, 0.14, 'C9A46B', { r: 0.07, name: 'Roll' }); } },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'seal' + (k % 6), seal(C.pal[k % 6]), 200, 200), x, y, d, d); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 22), bold: true, color: 'F7EBD3', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.12, y - 0.12, w + 0.24, h + 0.24, 'F7EBD3', { line: { color: '8B6A3A', width: 2 }, name: 'Plate' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { duo: ['3E2A14', 'F3E3C1'] }), x, y, w, h, { alt: '' }); },
  rule: async (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'C9A46B', 0.75),
  bullet: (ctx, s, x, y, k) => ctx.t.text(s, '\u2766', { x: x - 0.05, y: y - 0.1, w: 0.3, h: 0.3, fontSize: 13, color: C.pal[k ? 2 : 0] }),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.5, 0.3, 0.78, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.45, y: 0.3, w: 8.0, h: 0.65, fontFace: 'Cambria', italic: true, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.65, 28, 16, 'Cambria', true, 1, true) }); t.img(s, await svgOnce(ctx, 'orn', ornament(800), 800, 30), 1.45, 0.98, 4.0, 0.15); },
  footer: metaFooter({ color: C.muted, font: 'Cambria', align: 'center' }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => 'F7EBD3', authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, HF = 'Cambria', sheet = 'F7EBD3', edge = 'C9A46B', ROM = ['I', 'II', 'III', 'IV'];
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: HF, fontSize: L.fit(v, w, h2, o.max || 14, 10, HF, false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: HF, italic: true, bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, HF, true, 1, true), color: o.color || C.accent, align: o.align, valign: o.valign || 'middle' });
    const leather = '2B1A10', leatherUp = '41291A', gold = 'E0B85A', page2 = 'F3E3C1', soft = 'CDB893';
    const leaf = (s, x, y, w, ht, fill = sheet) => t.rect(s, x, y, w, ht, fill, { line: { color: edge, width: 1 }, name: 'Leaf' });
    const orn = async (s, x, y, w) => t.img(s, await svgOnce(ctx, 'orn', ornament(800), 800, 30), x, y, w, 0.15);
    const seal2 = async (s, x, y, d, k) => t.img(s, await svgOnce(ctx, 'seal' + (k % 6), seal(C.pal[k % 6]), 200, 200), x, y, d, d);
    const dark = async (d) => { const s = await newSlide('focus'); t.rect(s, 0, 0, 10, 5.625, leather, { name: 'Leather' }); t.rect(s, 0.2, 0.2, 9.6, 5.225, null, { line: { color: gold, width: 1.5 }, name: 'Gold tooling' }); await K.marker(ctx, s, 0.5, 0.3, 0.78, ctx.idx, ctx.idx); t.text(s, d.title, { x: 1.45, y: 0.3, w: 8.0, h: 0.72, fontFace: HF, italic: true, bold: true, color: gold, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.7, 28, 16, HF, true, 1, true) }); metaFooter({ color: soft, font: HF, align: 'center', y: 5.12 })(ctx, s); return s; };
    const V = {
      image: [
        async (d) => { // a miniature under a pointed arch, the text beside it opened with a large initial
          const s = await page(d), arch = 'M0,1 L0,0.38 C0,0.2 0.3,0.12 0.5,0 C0.7,0.12 1,0.2 1,0.38 L1,1 Z', x = 5.85, y = 1.25, w = 3.55, ht = 3.8, c0 = d.text.charAt(0);
          t.img(s, await svgOnce(ctx, 'arch', `<svg xmlns="http://www.w3.org/2000/svg" width="355" height="380" viewBox="0 0 1 1" preserveAspectRatio="none"><path d="${arch}" fill="#${C.accent}"/></svg>`, 355, 380), x, y, w, ht);
          t.img(s, await L.photo(L.src(d.image), w - 0.2, ht - 0.14, { mask: { path: arch }, duo: ['3E2A14', 'F3E3C1'] }), x + 0.1, y + 0.1, w - 0.2, ht - 0.14, { alt: '' });
          t.text(s, c0, { x: 0.55, y: 1.3, w: 0.95, h: 1.05, fontFace: HF, bold: true, fontSize: 60, color: C.accent, align: 'center', valign: 'middle', noFit: true });
          body(s, d.text.slice(1), 1.5, 1.35, 4.05, 3.65, { max: 14, k: 1.12 });
        },
        async (d) => { // the picture spreads across the page, an unrolled scroll is hung over it
          const s = await newSlide('focus');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625, { duo: ['3E2A14', 'F3E3C1'] }), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.18, 10, 0.445, leather, { name: 'Footer band' }); metaFooter({ color: page2, font: HF, align: 'center' })(ctx, s);
          await panel(s, 5.0, 0.4, 4.55, 4.5, 0);
          await marker(s, 5.15, 0.55, 0.68, 0, ctx.idx);
          head(s, d.title, 5.92, 0.52, 3.5, 0.74, { max: 17, color: C.ink });
          body(s, d.text, 5.2, 1.32, 4.15, 3.45, { max: 13.5, k: 1.08, valign: 'middle' });
        },
        async (d) => { // a round medallion on an old leaf, a wax seal pressed on its rim
          const s = await page(d), dd = 3.35, x = 0.9, y = 1.5;
          t.oval(s, x - 0.14, y - 0.14, dd + 0.28, dd + 0.28, sheet, { line: { color: '8B6A3A', width: 2.5 } });
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle', duo: ['3E2A14', 'F3E3C1'] }), x, y, dd, dd, { alt: '' });
          await seal2(s, x + dd - 0.72, y + dd - 0.72, 0.85, 0);
          body(s, d.text, 4.85, 1.4, 4.55, 3.6, { max: 14, k: 1.15, valign: 'middle' });
        },
        async (d) => { // an engraved plate across the head of the page, the text set beneath in full measure
          const s = await page(d);
          await K.photo(ctx, s, d.image, 0.72, 1.4, 8.56, 1.45);
          await orn(s, 2.5, 3.05, 5);
          body(s, d.text, 0.65, 3.25, 8.7, 1.85, { max: 13.5, k: 1.05 });
        },
      ],
      cards: [
        async (d) => { // an open book: entries on both leaves, a shadow in the gutter
          const s = await page(d), n = d.items.length, per = Math.ceil(n / 2), top = 1.3, ht = 3.78, w = 4.3;
          leaf(s, 0.65, top, w + 0.05, ht); leaf(s, 5.0, top, w + 0.05, ht);
          t.rect(s, 4.9, top, 0.2, ht, 'D9B983', { name: 'Gutter' });
          for (const [i, it] of d.items.entries()) {
            const right = i >= per, col = right ? n - per : per, rh = ht / col, x = right ? 5.22 : 0.8, y = top + (right ? i - per : i) * rh;
            t.img(s, await L.icon(it.icon, C.pal[i], 2), x, y + 0.14, 0.34, 0.34);
            head(s, it.h, x + 0.44, y + 0.08, w - 0.72, 0.46, { max: 15 });
            body(s, it.t, x, y + 0.56, w - 0.28, rh - 0.64, { max: 14 });
            if (right ? i < n - 1 : i < per - 1) await orn(s, x + 0.9, y + rh - 0.08, 2.2);
          }
        },
        async (d) => { // scrolls hanging at different lengths from one rod
          const s = await page(d), n = d.items.length, g = 0.18, w = (8.8 - g * (n - 1)) / n, ys = [4.75, 4.45, 4.95, 4.55];
          t.rect(s, 0.45, 1.22, 9.1, 0.1, '8B6A3A', { r: 0.05, name: 'Rod' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + g), bot = n === 3 ? 4.8 : ys[i];
            leaf(s, x, 1.3, w, bot - 1.3);
            t.rect(s, x - 0.06, bot - 0.04, w + 0.12, 0.16, edge, { r: 0.08, name: 'Roll' });
            t.img(s, await L.icon(it.icon, C.pal[i], 2), x + w / 2 - 0.17, 1.38, 0.34, 0.34);
            head(s, it.h, x + 0.1, 1.74, w - 0.2, 0.52, { max: 14, align: 'center' });
            body(s, it.t, x + 0.1, 2.28, w - 0.2, bot - 2.34, { max: 13, align: 'center' });
          }
        },
        async (d) => { // the binding: gold tooling on leather, four panels, or two over a long one
          const s = await dark(d), n = d.items.length, g = 0.14, w = (8.8 - g) / 2, ht = 1.78, y2 = 1.25 + ht + g, cell = n === 4 ? [[0.6, 1.25, w], [0.6 + w + g, 1.25, w], [0.6, y2, w], [0.6 + w + g, y2, w]] : [[0.6, 1.25, w], [0.6 + w + g, 1.25, w], [0.6, y2, 8.8]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, cw] = cell[i];
            t.rect(s, x, y, cw, ht, leatherUp, { line: { color: gold, width: 1 }, name: 'Tooled panel' });
            t.img(s, await L.icon(it.icon, gold, 2), x + 0.16, y + 0.12, 0.36, 0.36);
            head(s, it.h, x + 0.62, y + 0.08, cw - 0.78, 0.44, { max: 15, color: gold });
            body(s, it.t, x + 0.18, y + 0.58, cw - 0.36, ht - 0.66, { max: 13, color: page2 });
          }
        },
        async (d) => { // one great seal, a ribbon from it to each entry
          const s = await page(d), n = d.items.length, cw = 3.3, ch = 1.74, cell = n === 4 ? [[0.6, 1.3], [6.1, 1.3], [0.6, 3.34], [6.1, 3.34]] : [[0.6, 1.3], [6.1, 2.32], [0.6, 3.34]], cx = 5, cy = 3.2;
          for (const [x, y] of cell) { const right = x > 5, ey = y + ch / 2, ex = right ? x : x + cw; t.shape(s, 'LINE', { x: Math.min(cx, ex), y: Math.min(cy, ey), w: Math.abs(cx - ex), h: Math.max(0.001, Math.abs(cy - ey)), line: { color: C.accent, width: 3 }, flipV: (right && ey < cy) || (!right && ey > cy), objectName: 'Ribbon' }); }
          await seal2(s, cx - 0.8, cy - 0.8, 1.6, 0);
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i];
            leaf(s, x, y, cw, ch);
            t.img(s, await L.icon(it.icon, C.pal[(i + 1) % 6], 2), x + 0.12, y + 0.1, 0.3, 0.3);
            head(s, it.h, x + 0.5, y + 0.05, cw - 0.6, 0.42, { max: 13.5 });
            body(s, it.t, x + 0.12, y + 0.5, cw - 0.24, ch - 0.56, { max: 12.5 });
          }
        },
      ],
      process: [
        async (d) => { // a wandering ink line, a seal at each stop, words beneath in plain columns
          const s = await page(d), n = d.steps.length, w = 8.8 / n, ys = [1.32, 1.72, 1.32, 1.72];
          t.img(s, await svgOnce(ctx, 'ink' + n, `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="100"><path d="M${w * 50},30 ${d.steps.slice(1).map((_, i) => `C${w * (i + 0.9) * 100},${i % 2 ? 80 : 20} ${w * (i + 1.1) * 100},${i % 2 ? 20 : 80} ${w * (i + 1.5) * 100},${i % 2 ? 30 : 70}`).join(' ')}" fill="none" stroke="#${C.accent}" stroke-width="3" stroke-dasharray="9 7"/></svg>`, 880, 100), 0.6, 1.4, 8.8, 1.0);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * w, y = ys[i];
            await marker(s, x + w / 2 - 0.3, y + 0.04, 0.6, i, ROM[i]);
            head(s, st.h, x + 0.08, 2.45, w - 0.16, 0.52, { max: 15, align: 'center' });
            body(s, st.t, x + 0.08, 2.98, w - 0.16, 2.1, { max: 14, align: 'center' });
          }
        },
        async (d) => { // a scroll held upright down the page, seals on it, entries on either side
          const s = await page(d), n = d.steps.length, w = 4.0, ch = 1.72, ys = n === 4 ? [1.28, 1.5, 3.34, 3.36] : [1.28, 2.31, 3.34], my = n === 4 ? [1.42, 2.3, 3.18, 4.06] : [1.85, 2.86, 3.87];
          t.rect(s, 4.8, 1.26, 0.4, 3.84, edge, { r: 0.12, name: 'Roll' });
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? 5.38 : 0.62, y = ys[i];
            leaf(s, x, y, w, ch);
            await marker(s, 4.72, my[i], 0.56, i, ROM[i]);
            head(s, st.h, x + 0.14, y + 0.07, w - 0.28, 0.44, { max: 14, align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.14, y + 0.53, w - 0.28, ch - 0.6, { max: 13, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // leaves laid on a stair, each lower than the last
          const s = await page(d), n = d.steps.length, g = 0.12, w = (8.8 - g * (n - 1)) / n, y0 = 1.28, yN = 2.72, floor = 5.1;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + g), y = y0 + i * (yN - y0) / (n - 1);
            leaf(s, x, y, w, floor - y); t.rect(s, x, y, w, 0.08, C.pal[i], { name: 'Headband' });
            t.text(s, ROM[i], { x: x + 0.08, y: y + 0.1, w: 0.62, h: 0.48, fontFace: HF, bold: true, fontSize: 21, color: C.pal[i], valign: 'middle' });
            head(s, st.h, x + 0.68, y + 0.1, w - 0.76, 0.48, { max: 12.5, color: C.ink });
            body(s, st.t, x + 0.1, y + 0.62, w - 0.2, floor - y - 0.68, { max: 13 });
          }
        },
        async (d) => { // chapter headings tooled on leather, a gold numeral over each column
          const s = await dark(d), n = d.steps.length, w = 8.8 / n;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * w;
            if (i) t.line(s, x, 1.3, 0, 3.7, gold, 0.75);
            t.text(s, ROM[i], { x: x + 0.05, y: 1.25, w: w - 0.1, h: 0.9, fontFace: HF, bold: true, fontSize: 42, color: gold, align: 'center', valign: 'middle', noFit: true });
            head(s, st.h, x + 0.14, 2.18, w - 0.28, 0.54, { max: 15, color: page2, align: 'center' });
            body(s, st.t, x + 0.14, 2.75, w - 0.28, 2.3, { max: 14, color: page2, align: 'center' });
          }
        },
      ],
      stats: [
        async (d) => { // a ledger leaf: figure, ruled lines, its entry
          const s = await page(d), hh = d.note ? 2.78 : 3.75, rh = hh / 3;
          leaf(s, 0.6, 1.3, 8.8, hh); t.line(s, 3.55, 1.3, 0, hh, C.accent, 1); t.line(s, 3.62, 1.3, 0, hh, C.accent, 1);
          for (const [i, x] of d.stats.entries()) {
            const y = 1.3 + i * rh;
            t.text(s, x.value, { x: 0.72, y, w: 2.72, h: rh, fontFace: HF, bold: true, fontSize: L.fit(x.value, 2.72, rh - 0.1, 36, 18, HF, true), color: C.accent, align: 'right', valign: 'middle' });
            body(s, x.label, 3.8, y + 0.05, 5.45, rh - 0.1, { max: 15, valign: 'middle' });
            if (i < 2) t.line(s, 0.6, y + rh, 8.8, 0, edge, 0.75);
          }
          if (d.note) { await orn(s, 2.5, 4.11, 5); body(s, d.note, 0.7, 4.28, 8.6, 0.82, { max: 12, color: C.muted, align: 'center', valign: 'middle' }); }
        },
        async (d) => { // the decree: one figure in gold on the binding, two lesser under a seal
          const s = await dark(d), [a, b, c] = d.stats;
          t.text(s, a.value, { x: 0.6, y: 1.22, w: 5.0, h: 1.45, fontFace: HF, bold: true, fontSize: L.fit(a.value, 5.0, 1.4, 70, 28, HF, true), color: gold, valign: 'middle' });
          body(s, a.label, 0.6, 2.7, 4.9, 0.8, { max: 16, color: page2 });
          for (const [i, x] of [b, c].entries()) {
            const y = 1.3 + i * 1.2;
            await seal2(s, 5.85, y + 0.14, 0.62, i + 2);
            t.text(s, x.value, { x: 6.6, y: y - 0.02, w: 2.85, h: 0.56, fontFace: HF, bold: true, fontSize: L.fit(x.value, 2.85, 0.54, 28, 15, HF, true), color: gold, valign: 'middle' });
            body(s, x.label, 6.6, y + 0.54, 2.85, 0.56, { max: 12, color: page2 });
          }
          if (d.note) body(s, d.note, 0.6, 3.82, 8.8, 1.24, { max: 13.5, color: soft, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // facing pages of a book, the lines justified to the gutter on each leaf
          const s = await page(d), w = 3.95, n = Math.max(d.left.items.length, d.right.items.length), top = 2.0, av = 3.0, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 15, w, HF, 0.14, av);
          leaf(s, 0.55, 1.28, 4.45, 3.82); leaf(s, 5.0, 1.28, 4.45, 3.82);
          t.rect(s, 4.9, 1.28, 0.2, 3.82, 'D9B983', { name: 'Gutter' });
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? 5.28 : 0.77;
            head(s, side.h, x, 1.34, w, 0.52, { max: 18, color: C.pal[i ? 2 : 0], align: i ? 'left' : 'right' });
            for (const [j, v] of side.items.entries()) t.text(s, v, { x, y: top + j * rh, w, h: rh, fontFace: HF, fontSize: fs, color: C.ink, align: i ? 'left' : 'right', valign: 'middle' });
          }
        },
        async (d) => { // two rolled bands, one under the other, a seal naming each
          const s = await page(d), hh = 1.68;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.34 + i * (hh + 0.3), n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.12) / rws, w = 3.15;
            await panel(s, 0.65, y, 8.7, hh, i);
            head(s, side.h, 0.78, y + 0.14, 2.1, hh - 0.28, { max: 17, color: C.pal[i ? 2 : 0], align: 'center' });
            t.line(s, 2.95, y + 0.18, 0, hh - 0.36, edge, 1);
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.24, rh - 0.04, 13, 10, HF)));
            for (const [j, v] of side.items.entries()) {
              const x = 3.05 + (j % 2) * (w + 0.02), yy = y + 0.06 + Math.floor(j / 2) * rh;
              t.oval(s, x + 0.02, yy + rh / 2 - 0.06, 0.12, 0.12, C.pal[i ? 2 : 0]);
              t.text(s, v, { x: x + 0.22, y: yy, w: w - 0.24, h: rh, fontFace: HF, fontSize: fs, color: C.ink, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // gold letters on the binding in a tooled frame, a great seal beside them
          const s = await dark(d);
          await seal2(s, 7.35, 1.5, 2.0, 0);
          t.rect(s, 0.6, 1.28, 6.5, 2.5, null, { line: { color: gold, width: 1 }, name: 'Tooling' });
          t.text(s, L.runs(d.text), { x: 0.85, y: 1.36, w: 6.0, h: 2.34, fontFace: HF, italic: true, bold: true, fontSize: L.fit(d.text, 6.0, 2.28, 28, 15, HF, true, 1, true), color: gold, valign: 'middle' });
          if (d.caption) body(s, d.caption, 0.6, 3.88, 8.8, 1.2, { max: 13, color: page2 });
        },
        async (d) => { // the page of a chronicle: a huge red initial, the sentence after it, a gloss in the margin
          const s = await page(d, 'focus'), c0 = d.text.charAt(0);
          t.text(s, c0, { x: 0.5, y: 1.25, w: 1.4, h: 1.6, fontFace: HF, bold: true, fontSize: 96, color: C.accent, align: 'center', valign: 'middle', noFit: true });
          t.text(s, L.runs(d.text.slice(1)), { x: 1.95, y: 1.32, w: 4.55, h: 3.7, fontFace: HF, italic: true, bold: true, fontSize: L.fit(d.text, 4.55, 3.65, 28, 15, HF, true, 1, true), color: C.ink, valign: 'top' });
          t.line(s, 6.72, 1.32, 0, 3.72, C.accent, 1); t.line(s, 6.79, 1.32, 0, 3.72, C.accent, 1);
          if (d.caption) body(s, d.caption, 6.95, 1.32, 2.45, 3.72, { max: 13.5, color: C.muted, valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // a ribbon across the page, seals pressed on it, the entries above and below in turn
          const s = await page(d), ty = 3.05, hh = 1.6, w = 3.95;
          t.rect(s, 0.6, ty, 8.8, 0.2, C.accent, { name: 'Ribbon' });
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = 0.6 + (i >> 1) * 4.5 + (above ? 0 : 0.35), y = above ? 1.3 : 3.5;
            await seal2(s, above ? x + 0.04 : x + w - 0.48, ty - 0.12, 0.44, i);
            head(s, it.year, x, y, 1.5, 0.42, { max: 17 });
            head(s, it.h, x + 1.55, y, w - 1.55, 0.42, { max: 13, color: C.ink });
            body(s, it.t, x, y + 0.44, w, hh - 0.46, { max: 13 });
          }
        },
        async (d) => { // four charters, each closed by a large wax seal with its date
          const s = await page(d), w = 4.3, ht = 1.78, cell = [[0.65, 1.3], [5.05, 1.3], [0.65, 3.3], [5.05, 3.3]], dd = 1.05;
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i];
            leaf(s, x, y, w, ht);
            await seal2(s, x + 0.08, y + (ht - dd) / 2, dd, i);
            t.text(s, it.year, { x: x + 0.2, y: y + (ht - dd) / 2 + 0.25, w: dd - 0.24, h: dd - 0.5, fontFace: HF, bold: true, fontSize: L.fit(it.year.replace('-', ' '), dd - 0.24, dd - 0.5, 14, 8.5, HF, true), color: sheet, align: 'center', valign: 'middle' });
            head(s, it.h, x + dd + 0.18, y + 0.06, w - dd - 0.28, 0.42, { max: 14, color: C.ink });
            body(s, it.t, x + dd + 0.18, y + 0.5, w - dd - 0.28, ht - 0.56, { max: 13 });
          }
        },
        async (d) => { // a chronicle's lines descending, each indented past the one before
          const s = await page(d), w = 5.2, hh = 0.88, sx = (8.8 - w) / 3, sy = 0.95;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * sx, y = 1.3 + i * sy;
            leaf(s, x, y, w, hh); t.rect(s, x, y, 1.12, hh, C.pal[i], { name: 'Date' });
            head(s, it.year, x + 0.04, y + 0.05, 1.04, hh - 0.1, { max: 13, color: sheet, align: 'center' });
            head(s, it.h, x + 1.2, y + 0.02, w - 1.28, 0.27, { max: 12.5, color: C.ink });
            body(s, it.t, x + 1.2, y + 0.29, w - 1.28, hh - 0.31, { max: 11.5 });
          }
        },
      ],
    };
    R.image = V.image.shift(); R.process = V.process.shift(); R.timeline = V.timeline.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    await K.panel(ctx, s, 0.8, 0.55, d.image ? 5.3 : 8.4, 4.35, 0, {});
    if (d.image) await K.photo(ctx, s, d.image, 6.6, 0.85, 2.7, 3.4);
    const w = d.image ? 4.8 : 7.9;
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2766  '), { x: 1.05, y: 0.85, w, h: 0.3, fontFace: 'Cambria', italic: true, fontSize: 12, color: C.accent, align: 'center' });
    t.text(s, d.title, { x: 1.05, y: 1.2, w, h: 1.9, fontFace: 'Cambria', italic: true, bold: true, fontSize: L.fit(d.title, w, 1.85, 38, 18, 'Cambria', true, 1, true), color: C.ink, align: 'center', valign: 'middle' });
    t.img(s, await svgOnce(ctx, 'orn', ornament(800), 800, 30), 1.05 + w / 2 - 1.5, 3.15, 3.0, 0.12);
    if (d.subtitle) t.text(s, d.subtitle, { x: 1.05, y: 3.35, w, h: 0.6, fontFace: 'Cambria', italic: true, fontSize: 12, color: C.muted, align: 'center' });
    t.text(s, M.author || '', { x: 1.05, y: 4.0, w, h: 0.45, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.ink, align: 'center' });
    await K.marker(ctx, s, (d.image ? 5.5 : 8.6), 4.25, 0.8, 0, '');
    metaFooter({ color: C.muted, font: 'Cambria', align: 'center' })(ctx, s);
  },
};
module.exports = { id: 94, slug: 'qolyozma', name: "Qölyozma", category: 'academic', photos: true, build: (c, o) => run(c, o, K), style: { tone: "tarixiy bitik ohangi: salobatli, ravon, an'anaviy ifoda; faktlarga sodiq", limits: {}, prefer: 'text' } };
