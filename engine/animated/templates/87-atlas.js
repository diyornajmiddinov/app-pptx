/** 87 Atlas — Uzbek ikat silk (abr): vertical bands of blurred, stepped diamonds in vivid magenta, gold, green and indigo. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FFF9F2', ink: '2A1630', muted: '6A5470', accent: 'C2185B', pal: ['C2185B', 'F9A825', '2E7D32', '283593', 'E64A19', '00838F'] };
const ikat = (w, h, seed) => { const cols = ['C2185B', 'F9A825', '2E7D32', '283593', 'E64A19', '6A1B9A']; let x0 = seed, g = ''; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); const bw = 120;
  for (let c = 0; c * bw < w; c++) { const base = cols[c % cols.length], alt = cols[(c + 2) % cols.length]; g += `<rect x="${c * bw}" y="0" width="${bw}" height="${h}" fill="#${base}"/>`;
    for (let y = 0; y < h; y += 150) { const cx = c * bw + bw / 2, j = (rnd() - 0.5) * 10; g += `<polygon points="${cx + j},${y} ${cx + bw * 0.42},${y + 75} ${cx + j},${y + 150} ${cx - bw * 0.42},${y + 75}" fill="#${alt}"/><polygon points="${cx},${y + 35} ${cx + bw * 0.2},${y + 75} ${cx},${y + 115} ${cx - bw * 0.2},${y + 75}" fill="#FFF9F2"/>`; } }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="b" x="-5%" y="0" width="110%" height="100%"><feGaussianBlur stdDeviation="5 0.5"/></filter></defs><g filter="url(#b)">${g}</g></svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Atlas', C, C.pal), layout: { agenda: 'grid', cards: 'columns', process: 'panels', stats: 'markers', timeline: 'columns' },
  area: { x: 1.05, y: 1.35, w: 8.45, h: 3.65 },
  bg: async (ctx, s, kind) => { s.background = { color: C.bg }; if (kind !== 'hero') ctx.t.img(s, await svgOnce(ctx, 'band', ikat(240, 900, 3), 240, 900), 0, 0, 0.75, 5.625); },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: 'EADCCF', width: 1 }, shadow: 0.12, blur: 6, offset: 2, name: 'Card' }); if (!o.big) { ctx.t.rect(s, x, y, w, 0.14, C.pal[k % 6], { name: 'Ikat edge' }); ctx.t.rect(s, x, y + 0.14, w, 0.05, C.pal[(k + 1) % 6], { name: 'Ikat edge' }); } },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.shape(s, 'DIAMOND', { x, y, w: d, h: d, fill: { color: C.pal[k % 6] }, line: { color: 'FFFFFF', width: 1.5 }, objectName: 'Diamond' }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 22), bold: true, color: k % 6 === 1 ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.12, y - 0.12, w + 0.24, h + 0.24, C.pal[0], { name: 'Frame' }); ctx.t.rect(s, x - 0.05, y - 0.05, w + 0.1, h + 0.1, C.pal[1], { name: 'Frame' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 1.05, 0.38, 0.7, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.95, y: 0.35, w: 7.5, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.5, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted, x: 1.05, w: 8.45 }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: (i) => (i % 6 === 1 ? C.ink : 'FFFFFF'), authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, HF = 'Arial', AX = 1.05, AW = 8.45, RX = 9.5;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: HF, bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, HF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const plum = '24102E', plumUp = '3A1C49', cream = 'FFF9F2', gold = 'F9A825', soft = 'D8C8DE', on = (k) => (k % 6 === 1 ? C.ink : 'FFFFFF'), tint = ['FBDDE8', 'FEEFC8', 'DCEEDC', 'DDE0F4', 'FBE0D6', 'D5EEF1'], deep = ['C2185B', 'B26A00', '2E7D32', '283593', 'C43E12', '00737F'];
    const cloth = async (s, key, x, y, w, ht, seed = 5) => t.img(s, await svgOnce(ctx, 'ik' + key, ikat(Math.round(w * 160), Math.round(ht * 160), seed), Math.round(w * 160), Math.round(ht * 160)), x, y, w, ht);
    const dia = (s, x, y, w, ht, c, o = {}) => t.shape(s, 'DIAMOND', { x, y, w, h: ht, fill: { color: c }, ...(o.line ? { line: o.line } : {}), objectName: 'Diamond' });
    const night = async (d) => { const s = await newSlide('focus'); t.rect(s, 0.75, 0, 9.25, 5.625, plum, { name: 'Night cloth' }); K.marker(ctx, s, 1.05, 0.38, 0.7, ctx.idx, ctx.idx); t.text(s, d.title, { x: 1.95, y: 0.35, w: 7.5, h: 0.72, bold: true, color: cream, valign: 'middle', fontSize: L.fit(d.title, 7.5, 0.72, 28, 16, HF, true) }); metaFooter({ color: soft, x: 1.05, w: 8.45 })(ctx, s); return s; };
    const V = {
      image: [
        async (d) => { // the picture cut to the great lozenge of the cloth, a smaller one behind it
          const s = await page(d), w = 4.45, ht = 3.95, x = 5.2, y = 1.2;
          dia(s, x - 0.1, y - 0.03, w + 0.2, ht + 0.06, C.pal[1]);
          t.img(s, await L.photo(L.src(d.image), w - 0.16, ht - 0.14, { mask: { poly: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]] } }), x + 0.08, y + 0.07, w - 0.16, ht - 0.14, { alt: '' });
          body(s, d.text, AX, 1.38, 4.05, 3.6, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // the picture spreads over the page, a length of silk hangs in front of it
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.2, 10, 0.425, plum, { name: 'Footer band' }); metaFooter({ color: cream, x: 1.05, w: 8.45 })(ctx, s);
          await cloth(s, 'hang', 0.5, 0, 0.42, 5.2, 3); await cloth(s, 'hang', 5.08, 0, 0.42, 5.2, 3);
          t.rect(s, 0.92, 0, 4.16, 5.2, cream, { name: 'Silk' });
          K.marker(ctx, s, 1.1, 0.3, 0.68, ctx.idx, ctx.idx);
          head(s, d.title, 1.86, 0.25, 3.1, 0.8, { max: 18 });
          body(s, d.text, 1.12, 1.18, 3.78, 3.9, { max: 14, k: 1.12, valign: 'middle' });
        },
        async (d) => { // an arched niche: gold, magenta and the picture inside
          const s = await page(d), arch = 'M0,1 L0,0.42 C0,0.2 0.32,0.12 0.5,0 C0.68,0.12 1,0.2 1,0.42 L1,1 Z', x = AX, y = 1.22, w = 3.5, ht = 3.86;
          for (const [i, c] of [C.pal[0], C.pal[1]].entries()) t.img(s, await svgOnce(ctx, 'arch' + i, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="440" viewBox="0 0 1 1" preserveAspectRatio="none"><path d="${arch}" fill="#${c}"/></svg>`, 400, 440), x + i * 0.07, y + i * 0.07, w - i * 0.14, ht - i * 0.07);
          t.img(s, await L.photo(L.src(d.image), w - 0.28, ht - 0.14, { mask: { path: arch } }), x + 0.14, y + 0.14, w - 0.28, ht - 0.14, { alt: '' });
          body(s, d.text, 4.85, 1.38, 4.65, 3.6, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // a bolt of cloth unrolled: ikat selvedges along the picture, the words beneath
          const s = await page(d), y = 1.2;
          await cloth(s, 'selv', AX, y, AW, 0.2, 7);
          t.img(s, await L.photo(L.src(d.image), AW, 1.45), AX, y + 0.2, AW, 1.45, { alt: '' });
          await cloth(s, 'selv', AX, y + 1.65, AW, 0.2, 7);
          body(s, d.text, AX, 3.2, AW, 1.92, { max: 14, k: 1.1 });
        },
      ],
      cards: [
        async (d) => { // four cuts of cloth meeting at one lozenge, or three with a long one
          const s = await page(d), n = d.items.length, g = 0.12, w = (AW - g) / 2, ht = 1.83, y0 = 1.26, x2 = AX + w + g, y2 = y0 + ht + g;
          const cell = n === 4 ? [[AX, y0, w, ht], [x2, y0, w, ht], [AX, y2, w, ht], [x2, y2, w, ht]] : [[AX, y0, w, 2 * ht + g], [x2, y0, w, ht], [x2, y2, w, ht]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, cw, ch] = cell[i], tall = ch > 2, inR = x > AX;
            t.rect(s, x, y, cw, ch, tint[i], { name: 'Cut of cloth' }); t.rect(s, inR ? x + cw - 0.1 : x, y, 0.1, ch, C.pal[i], { name: 'Selvedge' });
            const tx = inR ? x + 0.42 : x + 0.22, tw = cw - 0.68;
            t.img(s, await L.icon(it.icon, deep[i], 2), tx, y + 0.14, 0.36, 0.36);
            head(s, it.h, tx + 0.44, y + 0.08, tw - 0.44, 0.48, { max: tall ? 17 : 14 });
            body(s, it.t, tx, y + 0.6, tw, ch - 0.68, { max: tall ? 16 : 13, k: tall ? 1.15 : undefined });
          }
          dia(s, AX + w + g / 2 - 0.34, n === 4 ? y2 - g / 2 - 0.34 : y2 - g / 2 - 0.34, 0.68, 0.68, plum, { line: { color: gold, width: 2 } });
          dia(s, AX + w + g / 2 - 0.15, y2 - g / 2 - 0.15, 0.3, 0.3, gold);
        },
        async (d) => { // ribbons across the page, each starts with its own ikat swatch
          const s = await page(d), n = d.items.length, g = 0.1, top = 1.28, rh = (3.82 - g * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const y = top + i * (rh + g);
            t.rect(s, AX, y, AW, rh, 'FFFFFF', { line: { color: 'EADCCF', width: 1 }, name: 'Ribbon' });
            await cloth(s, 'sw' + i + n, AX, y, 1.15, rh, 11 + i * 7);
            const dd = Math.min(0.72, rh - 0.1); dia(s, AX + 0.575 - dd / 2, y + rh / 2 - dd / 2, dd, dd, cream);
            t.img(s, await L.icon(it.icon, deep[i], 2), AX + 0.575 - 0.13, y + rh / 2 - 0.13, 0.26, 0.26);
            head(s, it.h, AX + 1.28, y + 0.04, 2.4, rh - 0.08, { max: 15, color: deep[i] });
            body(s, it.t, AX + 3.78, y + 0.05, AW - 3.92, rh - 0.1, { max: 13, valign: 'middle' });
          }
        },
        async (d) => { // the cloth at night: glowing lozenges climbing and falling, the words on the dark ground
          const s = await night(d), n = d.items.length, w = AW / n, dd = 1.0, glow = ['F06292', gold, '81C784', '9FA8DA'];
          for (const [i, it] of d.items.entries()) {
            const x = AX + i * w, y = i % 2 ? 1.72 : 1.22, c = glow[i], cx = x + w / 2;
            dia(s, cx - dd / 2, y, dd, dd, c); dia(s, cx - dd / 2 + 0.14, y + 0.14, dd - 0.28, dd - 0.28, plum);
            t.img(s, await L.icon(it.icon, c, 2), cx - 0.16, y + dd / 2 - 0.16, 0.32, 0.32);
            head(s, it.h, x + 0.08, y + dd + 0.05, w - 0.16, 0.5, { max: 14, color: c, align: 'center' });
            body(s, it.t, x + 0.08, y + dd + 0.57, w - 0.16, 5.12 - y - dd - 0.57, { max: 13, color: cream, align: 'center' });
          }
        },
        async (d) => { // banners on a rod: each ends in a point with a tassel
          const s = await page(d), n = d.items.length, g = 0.14, w = (AW - g * (n - 1)) / n, top = 1.32;
          t.rect(s, AX - 0.08, 1.24, AW + 0.16, 0.08, C.ink, { r: 0.03, name: 'Rod' });
          for (const [i, it] of d.items.entries()) {
            const x = AX + i * (w + g), c = C.pal[i], bot = 4.72;
            t.rect(s, x, top, w, bot - top, 'FFFFFF', { line: { color: c, width: 1 }, name: 'Banner' });
            t.rect(s, x, top, w, 0.62, c, { name: 'Banner head' });
            t.img(s, await L.icon(it.icon, on(i), 2), x + w / 2 - 0.18, top + 0.13, 0.36, 0.36);
            t.shape(s, 'ISOSCELES_TRIANGLE', { x, y: bot, w, h: 0.32, flipV: true, fill: { color: c }, objectName: 'Banner point' });
            t.line(s, x + w / 2, bot + 0.32, 0, 0.1, c, 3);
            head(s, it.h, x + 0.1, top + 0.66, w - 0.2, 0.52, { max: 14, align: 'center' });
            body(s, it.t, x + 0.1, top + 1.2, w - 0.2, bot - top - 1.26, { max: 13, align: 'center' });
          }
        },
      ],
      process: [
        async (d) => { // a row of chevrons woven one into the next, the words below
          const s = await page(d), n = d.steps.length, w = AW / n;
          for (const [i, st] of d.steps.entries()) {
            const x = AX + i * w;
            t.shape(s, 'CHEVRON', { x: x - (i ? 0.1 : 0), y: 1.32, w: w + 0.1, h: 0.95, fill: { color: C.pal[i] }, objectName: 'Chevron' });
            t.text(s, String(i + 1), { x: x + 0.1, y: 1.32, w: w - 0.2, h: 0.95, bold: true, fontSize: 26, color: on(i), align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.05, 2.38, w - 0.2, 0.55, { max: 15, color: deep[i] });
            body(s, st.t, x + 0.05, 2.95, w - 0.2, 2.13, { max: 14 });
          }
        },
        async (d) => { // a strip of ikat down the middle of the page, steps on both sides of it
          const s = await page(d), n = d.steps.length, w = 3.75, ch = 1.76, cx = 5.28, ys = n === 4 ? [1.26, 1.5, 3.3, 3.32] : [1.26, 2.3, 3.32], my = n === 4 ? [1.48, 2.38, 3.28, 4.18] : [1.85, 2.88, 3.91];
          await cloth(s, 'spine', cx - 0.2, 1.22, 0.4, 3.88, 13);
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? cx + 0.47 : AX, y = ys[i];
            t.rect(s, x, y, w, ch, 'FFFFFF', { line: { color: 'EADCCF', width: 1 }, shadow: 0.1, blur: 5, offset: 2, name: 'Card' });
            t.rect(s, right ? x : x + w - 0.08, y, 0.08, ch, C.pal[i], { name: 'Edge' });
            await marker(s, cx - 0.3, my[i], 0.6, i, i + 1);
            head(s, st.h, x + 0.16, y + 0.08, w - 0.32, 0.46, { max: 14, color: deep[i], align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.16, y + 0.56, w - 0.32, ch - 0.62, { max: 13, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // the stepped edge of the ikat motif: each step wider than the last
          const s = await page(d), n = d.steps.length, top = 1.26, rh = 3.84 / n, cx = AX + AW / 2, minW = 6.3;
          for (const [i, st] of d.steps.entries()) {
            const w = minW + (AW - minW) * i / (n - 1), x = cx - w / 2, y = top + i * rh;
            t.rect(s, x, y, w, rh, tint[i], { name: 'Step' }); t.rect(s, x, y, w, 0.05, C.pal[i], { name: 'Step edge' });
            dia(s, x + 0.12, y + rh / 2 - 0.28, 0.56, 0.56, C.pal[i]);
            t.text(s, String(i + 1), { x: x + 0.12, y: y + rh / 2 - 0.28, w: 0.56, h: 0.56, bold: true, fontSize: 13, color: on(i), align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.78, y + 0.07, 1.85, rh - 0.1, { max: 14 });
            body(s, st.t, x + 2.72, y + 0.08, w - 2.86, rh - 0.12, { max: 13, valign: 'middle' });
          }
        },
        async (d) => { // the medallion: a lozenge of ikat in the middle, the steps go round it
          const s = await page(d), n = d.steps.length, w = 3.15, ch = 1.76, xr = RX - w, cell = n === 4 ? [[AX, 1.26], [xr, 1.26], [xr, 3.32], [AX, 3.32]] : [[AX, 1.26], [xr, 2.29], [AX, 3.32]], cx = AX + AW / 2, cy = 3.18, dd = 2.0;
          t.img(s, await L.photo(Buffer.from((await svgOnce(ctx, 'medal', ikat(400, 400, 21), 400, 400)).split(',')[1], 'base64'), dd, dd, { mask: { poly: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]] } }), cx - dd / 2, cy - dd / 2, dd, dd);
          dia(s, cx - 0.5, cy - 0.5, 1, 1, cream); t.img(s, await L.icon('FiRefreshCw', C.pal[0], 2), cx - 0.18, cy - 0.18, 0.36, 0.36);
          for (const [i, st] of d.steps.entries()) {
            const [x, y] = cell[i];
            t.rect(s, x, y, w, ch, 'FFFFFF', { line: { color: C.pal[i], width: 1.5 }, name: 'Card' });
            await marker(s, x + 0.08, y + 0.06, 0.46, i, i + 1);
            head(s, st.h, x + 0.6, y + 0.06, w - 0.68, 0.46, { max: 13.5, color: deep[i] });
            body(s, st.t, x + 0.12, y + 0.56, w - 0.24, ch - 0.62, { max: 13 });
          }
        },
      ],
      stats: [
        async (d) => { // three lengths of dyed silk side by side, an ikat edge along the foot
          const s = await page(d), g = 0.1, w = (AW - 2 * g) / 3, hh = d.note ? 2.75 : 3.8, top = 1.26;
          for (const [i, x] of d.stats.entries()) {
            const px = AX + i * (w + g), k = [0, 3, 2][i];
            t.rect(s, px, top, w, hh, C.pal[k], { name: 'Silk' });
            t.text(s, x.value, { x: px + 0.12, y: top + 0.14, w: w - 0.24, h: 1.2, bold: true, fontSize: L.fit(x.value, w - 0.24, 1.15, 46, 20, HF, true), color: 'FFFFFF', align: 'center', valign: 'middle' });
            t.line(s, px + 0.5, top + 1.38, w - 1, 0, gold, 2);
            body(s, x.label, px + 0.18, top + 1.46, w - 0.36, hh - 1.62, { max: 14, color: 'FFFFFF', align: 'center' });
          }
          if (d.note) body(s, d.note, AX, 4.08, AW, 1.02, { max: 13, color: C.muted, valign: 'middle' });
        },
        async (d) => { // one figure on a lozenge of cloth at night, two more on threads beside it
          const s = await night(d), [a, b, c] = d.stats, dd = 3.2, x0 = 1.05, y0 = 1.25;
          t.img(s, await L.photo(Buffer.from((await svgOnce(ctx, 'medal', ikat(400, 400, 21), 400, 400)).split(',')[1], 'base64'), dd + 0.6, dd, { mask: { poly: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]] } }), x0, y0, dd + 0.6, dd);
          dia(s, x0 + 0.42, y0 + 0.35, dd - 0.24, dd - 0.7, cream);
          t.text(s, a.value, { x: x0 + 1.0, y: y0 + 1.05, w: dd - 1.4, h: 1.1, bold: true, fontSize: L.fit(a.value, dd - 1.4, 1, 44, 18, HF, true), color: C.pal[0], align: 'center', valign: 'middle' });
          for (const [i, x] of [a, b, c].entries()) {
            const y = 1.3 + i * 1.05, col = [gold, 'F06292', '81C784'][i];
            if (i) t.text(s, x.value, { x: 5.1, y, w: 4.4, h: 0.55, bold: true, fontSize: L.fit(x.value, 4.4, 0.52, 28, 16, HF, true), color: col, valign: 'middle' });
            dia(s, 4.82, y + (i ? 0.17 : 0.1), 0.2, 0.2, col);
            body(s, x.label, 5.1, i ? y + 0.55 : y, 4.4, i ? 0.46 : 0.42, { max: 13, color: i ? cream : gold, valign: 'middle' });
          }
          if (d.note) body(s, d.note, 4.82, 4.45, 4.68, 0.68, { max: 11, color: soft, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // two halves of one cloth folded out from a strip of ikat
          const s = await page(d), w = 3.75, cx = 5.28, n = Math.max(d.left.items.length, d.right.items.length), top = 1.98, av = 3.08, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.3, 'Calibri', 0.14, av);
          await cloth(s, 'spine', cx - 0.2, 1.22, 0.4, 3.88, 13);
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? cx + 0.4 : AX, k = i ? 3 : 0;
            t.rect(s, x, 1.26, w + 0.08, 0.6, C.pal[k], { name: 'Side head' });
            head(s, side.h, x + 0.12, 1.28, w - 0.16, 0.56, { max: 17, color: 'FFFFFF', align: i ? 'left' : 'right' });
            for (const [j, v] of side.items.entries()) {
              const y = top + j * rh;
              t.text(s, v, { x: x + (i ? 0.26 : 0), y, w: w - 0.18, h: rh, fontSize: fs, align: i ? 'left' : 'right', valign: 'middle' });
              dia(s, i ? x + 0.04 : x + w - 0.1, y + rh / 2 - 0.08, 0.16, 0.16, C.pal[k]);
            }
          }
        },
        async (d) => { // two bolts laid one over the other, each with its name on a swatch
          const s = await page(d), hh = 1.84;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.26 + i * (hh + 0.12), n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.16) / rws, w = 2.95, k = i ? 2 : 4;
            t.rect(s, AX, y, AW, hh, tint[k], { name: 'Bolt' });
            await cloth(s, 'tab' + i, AX, y, 2.3, hh, 31 + i * 9); t.rect(s, AX + 0.14, y + 0.3, 2.02, hh - 0.6, cream, { name: 'Name label' });
            head(s, side.h, AX + 0.2, y + 0.34, 1.9, hh - 0.68, { max: 16, color: deep[k], align: 'center' });
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.2, rh - 0.04, 13, 10, 'Calibri')));
            for (const [j, v] of side.items.entries()) {
              const x = AX + 2.44 + (j % 2) * (w + 0.06), yy = y + 0.08 + Math.floor(j / 2) * rh;
              dia(s, x, yy + rh / 2 - 0.07, 0.14, 0.14, deep[k]);
              t.text(s, v, { x: x + 0.2, y: yy, w: w - 0.2, h: rh, fontSize: fs, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // the whole page is cloth, the words on a window cut in it
          const s = await newSlide('hero');
          t.img(s, await svgOnce(ctx, 'wall', ikat(1600, 900, 17), 1600, 900), 0, 0, 10, 5.625);
          t.rect(s, 1.0, 0.45, 8.0, 4.55, cream, { name: 'Window' }); t.rect(s, 1.12, 0.57, 7.76, 4.31, null, { line: { color: C.pal[0], width: 1.5 }, name: 'Window line' });
          K.marker(ctx, s, 4.66, 0.68, 0.68, ctx.idx, ctx.idx);
          head(s, d.title, 1.4, 1.38, 7.2, 0.42, { max: 14, color: C.muted, align: 'center' });
          t.text(s, L.runs(d.text), { x: 1.45, y: 1.82, w: 7.1, h: 1.7, bold: true, fontSize: L.fit(d.text, 7.1, 1.65, 28, 16, HF, true), color: C.ink, align: 'center', valign: 'middle' });
          if (d.caption) body(s, d.caption, 1.45, 3.58, 7.1, 1.22, { max: 13, color: C.muted, align: 'center' });
          t.rect(s, 0, 5.2, 10, 0.425, plum, { name: 'Footer band' }); metaFooter({ color: cream, x: 1.05, w: 8.45 })(ctx, s);
        },
        async (d) => { // a dark ground, the words left and large, a string of lozenges under them
          const s = await night(d);
          t.text(s, L.runs(d.text), { x: AX, y: 1.25, w: 5.5, h: 3.8, bold: true, fontSize: L.fit(d.text, 5.5, 3.7, 32, 16, HF, true), color: cream, valign: 'middle' });
          for (let k = 0; k < 6; k++) dia(s, 6.85 + k * 0.45, 1.34, 0.36, 0.36, C.pal[k]);
          if (d.caption) body(s, d.caption, 6.85, 1.85, 2.65, 3.25, { max: 14, color: soft });
        },
      ],
      timeline: [
        async (d) => { // a ribbon of ikat across the page, the dates above and below it in turn
          const s = await page(d), ty = 3.03, up = 1.26, dn = 3.45, cw = 4.0, hh = 1.62;
          await cloth(s, 'rib', AX, ty, AW, 0.3, 19);
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = AX + (i >> 1) * 4.3 + (above ? 0 : 0.35), y = above ? up : dn;
            dia(s, above ? x : x + cw - 0.46, ty - 0.08, 0.46, 0.46, C.pal[i], { line: { color: 'FFFFFF', width: 1.5 } });
            head(s, it.year, x, y, 1.55, 0.42, { max: 17, color: deep[i] });
            head(s, it.h, x + 1.6, y, cw - 1.6, 0.42, { max: 13 });
            body(s, it.t, x, y + 0.44, cw, hh - 0.46, { max: 13 });
          }
        },
        async (d) => { // a thread zigzags down the page, each date on its lozenge, shifted left and right in turn
          const s = await page(d), top = 1.26, rh = 0.96, sh = 1.15, dw = 1.25;
          for (let i = 0; i < 3; i++) { const x1 = AX + dw / 2 + (i % 2 ? sh : 0), x2 = AX + dw / 2 + (i % 2 ? 0 : sh), y1 = top + i * rh + rh / 2; t.shape(s, 'LINE', { x: Math.min(x1, x2), y: y1, w: sh, h: rh, line: { color: C.pal[0], width: 2.5 }, flipV: x2 < x1, objectName: 'Thread' }); }
          for (const [i, it] of d.items.entries()) {
            const y = top + i * rh, x = AX + (i % 2 ? sh : 0), tx = x + dw + 0.14;
            dia(s, x, y + 0.02, dw, rh - 0.04, C.pal[i], { line: { color: 'FFFFFF', width: 1.5 } });
            head(s, it.year, x + 0.24, y + 0.2, dw - 0.48, rh - 0.4, { max: 12, color: on(i), align: 'center' });
            head(s, it.h, tx, y + 0.04, RX - tx, 0.28, { max: 14, color: deep[i] });
            body(s, it.t, tx, y + 0.33, RX - tx, rh - 0.37, { max: 13 });
          }
        },
        async (d) => { // a length of cloth climbing the page: each date higher and further along
          const s = await page(d), w = 4.5, hh = 0.9, sx = (AW - w) / 3, sy = 0.96, bot = 5.1 - hh;
          for (const [i, it] of d.items.entries()) {
            const x = AX + i * sx, y = bot - i * sy;
            t.rect(s, x, y, w, hh, 'FFFFFF', { line: { color: C.pal[i], width: 1.5 }, shadow: 0.1, blur: 4, offset: 1, name: 'Cloth' });
            await cloth(s, 'yr' + i, x, y, 1.1, hh, 41 + i * 5); t.rect(s, x + 0.08, y + 0.2, 0.94, hh - 0.4, cream, { name: 'Label' });
            head(s, it.year, x + 0.09, y + 0.22, 0.92, hh - 0.44, { max: 13, color: deep[i], align: 'center' });
            head(s, it.h, x + 1.2, y + 0.02, w - 1.28, 0.26, { max: 12.5 });
            body(s, it.t, x + 1.2, y + 0.28, w - 1.28, hh - 0.3, { max: 11 });
          }
        },
      ],
    };
    R.image = V.image.shift(); R.process = V.process.shift(); R.timeline = V.timeline.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.img(s, await svgOnce(ctx, 'hero', ikat(720, 900, 9), 720, 900), 5.5, 0, 4.5, 5.625);
    if (d.image) { t.rect(s, 6.25, 1.0, 3.0, 3.6, 'FFF9F2', { name: 'Frame' }); t.img(s, await L.photo(L.src(d.image), 2.7, 3.3), 6.4, 1.15, 2.7, 3.3, { alt: '' }); }
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.6, w: 4.7, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.7, h: 2.3, bold: true, fontSize: L.fit(d.title, 4.7, 2.2, 38, 18, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.35, w: 4.6, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.6, h: 0.45, fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: C.muted, w: 4.8 })(ctx, s);
  },
};
module.exports = { id: 87, slug: 'atlas', name: 'Atlas', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "milliy ruhda yorqin: an'ana va zamonaviylik uyg'unligi, iliq va g'ururli", limits: {}, prefer: 'visual' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["wipe:r", "dissolve", "fade"], "cover": ["sweepIn", "fadeLetters"], "mark": "diamond", "deco": "wipe:r", "sig": {"title": "sweepIn", "body": "fade", "item": "wipe:r", "image": "wipe:l", "number": "diamond", "order": "seq", "stagger": 0.18}, "tempo": 1.15, "kenburns": true};
