/** 95 Metall — industrial steel: brushed metal, riveted plates, hex-nut markers, hazard-stripe accents. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'B7BCC2', ink: '1E2327', muted: '4A5158', accent: 'F5B700', plate: '8E959C', pal: ['F5B700', 'E4572E', '29335C', '669BBC', 'A3B18A', 'D9D9D9'] };
const brushed = () => { let l = '', x0 = 3; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let y = 0; y < 900; y += 3) l += `<line x1="0" y1="${y}" x2="1600" y2="${y}" stroke="#${rnd() > 0.5 ? 'FFFFFF' : '5A6168'}" stroke-opacity="${(0.05 + rnd() * 0.08).toFixed(2)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9CED3"/><stop offset="0.5" stop-color="#AEB4BA"/><stop offset="1" stop-color="#C3C8CD"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/>${l}</svg>`; };
const hazard = (w) => { let g = ''; for (let x = -40; x < w; x += 40) g += `<polygon points="${x},0 ${x + 20},0 ${x + 60},40 ${x + 40},40" fill="#1E2327"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="40"><rect width="${w}" height="40" fill="#F5B700"/>${g}</svg>`; };
const rivets = (t, s, x, y, w, h) => { for (const [a, b] of [[x + 0.1, y + 0.1], [x + w - 0.2, y + 0.1], [x + 0.1, y + h - 0.2], [x + w - 0.2, y + h - 0.2]]) { t.oval(s, a, b, 0.1, 0.1, 'D5D9DD', { line: { color: '5A6168', width: 0.75 } }); } };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, caps: true, theme: theme('Metall', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  area: { x: 0.6, y: 1.4, w: 8.8, h: 3.55 },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', brushed(), 1600, 900, true) }; ctx.t.img(s, await svgOnce(ctx, 'hz', hazard(1600), 1600, 40), 0, 5.4, 10, 0.225); },
  panel: (ctx, s, x, y, w, h, k, o) => { const { t } = ctx; t.rect(s, x, y, w, h, o.big ? '3A4148' : '4A5158', { line: { color: '2A2F34', width: 1.5 }, shadow: 0.3, blur: 5, offset: 2, name: 'Plate' }); t.line(s, x + 0.02, y + 0.02, w - 0.04, 0, '7A828A', 1); rivets(t, s, x, y, w, h); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.shape(s, 'HEXAGON', { x, y, w: d, h: d * 0.88, fill: { color: k % 3 === 0 ? C.accent : '9AA1A8' }, line: { color: '3A4148', width: 1.5 }, objectName: 'Nut' }); ctx.t.oval(s, x + d * 0.3, y + d * 0.24, d * 0.4, d * 0.4, '3A4148'); if (label !== '') ctx.t.text(s, String(label), { x: x + d * 0.3, y: y + d * 0.24, w: d * 0.4, h: d * 0.4, fontSize: Math.max(8, Math.round(d * 15)), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.18, y - 0.18, w + 0.36, h + 0.36, '4A5158', { name: 'Plate' }); rivets(ctx.t, s, x - 0.18, y - 0.18, w + 0.36, h + 0.36); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  title: (ctx, s, d) => { const { t, L } = ctx; K.marker(ctx, s, 0.5, 0.36, 0.8, ctx.idx, ctx.idx); if (d.title) { const T = d.title.toUpperCase(); t.text(s, T, { x: 1.5, y: 0.35, w: 7.95, h: 0.72, bold: true, color: C.ink, valign: 'middle', charSpacing: 1, fontSize: L.fit(T, 7.6, 0.72, 26, 14, 'Arial', true) }); } },
  footer: metaFooter({ color: C.ink, y: 5.12, size: 8 }),
  onPanel: () => 'F1F3F5', subPanel: () => 'C9CED3', markerText: () => 'FFFFFF', authorColor: C.accent, valueColor: () => C.accent, compareHead: (i) => (i ? '9FD0F5' : C.accent),
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, marker } = h, HF = 'Arial', YB = 5.05;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => { const T = String(v).toUpperCase(); t.text(s, T, { x, y, w, h: h2, fontFace: HF, bold: true, fontSize: L.fit(T, w, h2, o.max || 14, 10, HF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' }); };
    const steel = '4A5158', soot = '1E2327', sootUp = '2C3238', white = 'F1F3F5', soft = 'C9CED3', sky = '9FD0F5', Y = C.accent, light = 'E2E5E8';
    const plate = (s, x, y, w, ht, c = steel) => { t.rect(s, x, y, w, ht, c, { line: { color: '2A2F34', width: 1.5 }, shadow: 0.3, blur: 5, offset: 2, name: 'Plate' }); rivets(t, s, x, y, w, ht); };
    const hz = async (s, x, y, w, ht = 0.16) => { const a = Math.round(w * 160); t.img(s, await svgOnce(ctx, 'hz' + a, hazard(a), a, 40), x, y, w, ht); };
    const hzV = async (s, x, y, w, ht) => { const b = Math.round(ht * 160); let g = ''; for (let k = -40; k < b; k += 40) g += `<polygon points="0,${k} 0,${k + 20} 40,${k + 60} 40,${k + 40}" fill="#1E2327"/>`; t.img(s, await svgOnce(ctx, 'hzv' + b, `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="${b}"><rect width="40" height="${b}" fill="#F5B700"/>${g}</svg>`, 40, b), x, y, w, ht); };
    const nut = (s, x, y, d, c = Y) => t.shape(s, 'HEXAGON', { x, y, w: d, h: d * 0.88, fill: { color: c }, line: { color: '3A4148', width: 1.5 }, objectName: 'Nut' });
    const iconNut = async (s, x, y, d, ic, c = Y) => { nut(s, x, y, d, c); t.img(s, await L.icon(ic, C.ink, 2), x + d * 0.28, y + d * 0.16, d * 0.44, d * 0.44); };
    const pipeH = (s, x, y, w, ht = 0.14) => t.rect(s, x, y, w, ht, '7A828A', { line: { color: '2A2F34', width: 1 }, name: 'Pipe' });
    const pipeV = (s, x, y, ht, w = 0.14) => t.rect(s, x, y, w, ht, '7A828A', { line: { color: '2A2F34', width: 1 }, name: 'Pipe' });
    const dark = (s, d) => { t.rect(s, 0, 0, 10, 5.4, soot, { name: 'Furnace room' }); K.marker(ctx, s, 0.5, 0.36, 0.8, ctx.idx, ctx.idx); const T = d.title.toUpperCase(); t.text(s, T, { x: 1.5, y: 0.35, w: 7.95, h: 0.72, bold: true, color: white, valign: 'middle', charSpacing: 1, fontSize: L.fit(T, 7.6, 0.72, 26, 14, HF, true) }); metaFooter({ color: soft, y: 5.12, size: 8 })(ctx, s); };
    const V = {
      image: [
        async (d) => { // the picture cut to the shape of a great nut, words on the bare steel
          const s = await page(d), w = 4.3, ht = 3.72, x = 5.1, y = 1.3;
          t.shape(s, 'HEXAGON', { x: x - 0.1, y: y - 0.08, w: w + 0.2, h: ht + 0.16, fill: { color: '3A4148' }, objectName: 'Nut' });
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: 'hex' }), x, y, w, ht, { alt: '' });
          body(s, d.text, 0.6, 1.38, 4.3, 3.6, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // the picture fills the hall, one riveted plate is bolted over it
          const s = await newSlide('focus');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.06, 10, 0.34, soot, { name: 'Footer band' }); metaFooter({ color: white, y: 5.12, size: 8 })(ctx, s); await hz(s, 0, 5.4, 10, 0.225);
          plate(s, 0.45, 0.35, 4.85, 4.5);
          K.marker(ctx, s, 0.72, 0.5, 0.72, ctx.idx, ctx.idx);
          head(s, d.title, 1.55, 0.45, 3.5, 0.8, { max: 16, color: white });
          body(s, d.text, 0.72, 1.35, 4.32, 3.35, { max: 14, k: 1.1, color: white, valign: 'middle' });
        },
        async (d) => { // a porthole: thick steel ring, bolts around it, the view in the glass
          const s = await page(d), dd = 3.0, x = 1.05, y = 1.68, cx = x + dd / 2, cy = y + dd / 2, r = dd / 2 + 0.2;
          t.oval(s, x - 0.34, y - 0.34, dd + 0.68, dd + 0.68, steel, { line: { color: '2A2F34', width: 2 }, name: 'Ring' });
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), x, y, dd, dd, { alt: '' });
          for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; t.oval(s, cx + r * Math.cos(a) - 0.05, cy + r * Math.sin(a) - 0.05, 0.1, 0.1, 'D5D9DD', { line: { color: '2A2F34', width: 0.75 } }); }
          plate(s, 5.0, 1.42, 4.4, 3.58);
          body(s, d.text, 5.26, 1.58, 3.88, 3.26, { max: 14, k: 1.1, color: white, valign: 'middle' });
        },
        async (d) => { // a long inspection window between two hazard strips, the report beneath
          const s = await page(d), y = 1.28;
          await hz(s, 0.6, y, 8.8); t.img(s, await L.photo(L.src(d.image), 8.8, 1.45), 0.6, y + 0.16, 8.8, 1.45, { alt: '' }); await hz(s, 0.6, y + 1.61, 8.8);
          body(s, d.text, 0.6, 3.15, 8.8, 1.88, { max: 14, k: 1.08 });
        },
      ],
      cards: [
        async (d) => { // stamped steel strips: a yellow block with the icon, then the words
          const s = await page(d), n = d.items.length, g = 0.1, top = 1.32, rh = (YB - top - g * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const y = top + i * (rh + g);
            t.rect(s, 0.6, y, 8.8, rh, steel, { line: { color: '2A2F34', width: 1.5 }, name: 'Strip' });
            t.rect(s, 0.6, y, 0.95, rh, Y, { name: 'Tag' });
            t.img(s, await L.icon(it.icon, C.ink, 2), 0.89, y + rh / 2 - 0.18, 0.36, 0.36);
            head(s, it.h, 1.68, y + 0.05, 2.5, rh - 0.1, { max: 13, color: Y });
            body(s, it.t, 4.28, y + 0.06, 4.98, rh - 0.12, { max: 13, color: white, valign: 'middle' });
          }
        },
        async (d) => { // tags hanging from a rail on hooks, each on its own length of chain
          const s = await page(d), n = d.items.length, g = 0.14, w = (8.8 - g * (n - 1)) / n, ht = 3.0, ys = [1.75, 2.02, 1.6, 2.02];
          t.rect(s, 0.45, 1.25, 9.1, 0.16, soot, { name: 'Rail' });
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + g), y = ys[i], cx = x + w / 2;
            t.line(s, cx, 1.41, 0, y - 1.41 + 0.14, soot, 2.5, { dash: 'sysDot' });
            t.rect(s, x, y, w, ht, light, { r: 0.08, line: { color: '3A4148', width: 1.5 }, shadow: 0.3, blur: 5, offset: 2, name: 'Steel tag' });
            t.oval(s, cx - 0.08, y + 0.07, 0.16, 0.16, 'AEB4BA', { line: { color: '3A4148', width: 1 } });
            t.img(s, await L.icon(it.icon, C.ink, 2), cx - 0.17, y + 0.27, 0.34, 0.34);
            head(s, it.h, x + 0.1, y + 0.64, w - 0.2, 0.52, { max: 13, align: 'center' });
            body(s, it.t, x + 0.12, y + 1.18, w - 0.24, ht - 1.26, { max: 13, align: 'center' });
          }
        },
        async (d) => { // a gear in the middle, a pipe from it to each plate
          const s = await page(d), n = d.items.length, cw = 3.35, ch = 1.72, cell = n === 4 ? [[0.6, 1.3], [6.05, 1.3], [0.6, 3.3], [6.05, 3.3]] : [[0.6, 1.3], [6.05, 2.3], [0.6, 3.3]], cx = 5, cy = 3.16;
          let teeth = ''; for (let k = 0; k < 10; k++) teeth += `<rect x="130" y="4" width="40" height="46" fill="#3A4148" transform="rotate(${k * 36} 150 150)"/>`;
          for (const [x, y] of cell) { const right = x > 5, py = y + ch / 2 - 0.07; pipeV(s, cx - 0.07, Math.min(py, cy), Math.abs(py - cy) + 0.14); pipeH(s, right ? cx : x + cw, py, right ? x - cx : cx - x - cw); }
          t.img(s, await svgOnce(ctx, 'gear', `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">${teeth}<circle cx="150" cy="150" r="108" fill="#3A4148"/><circle cx="150" cy="150" r="70" fill="#${Y}"/><circle cx="150" cy="150" r="26" fill="#3A4148"/></svg>`, 300, 300), cx - 0.8, cy - 0.8, 1.6, 1.6);
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i];
            plate(s, x, y, cw, ch);
            await iconNut(s, x + 0.22, y + 0.1, 0.46, it.icon);
            head(s, it.h, x + 0.76, y + 0.08, cw - 0.98, 0.44, { max: 12.5, color: Y });
            body(s, it.t, x + 0.22, y + 0.56, cw - 0.44, ch - 0.68, { max: 12.5, color: white });
          }
        },
        async (d) => { // the night shift: four panels in a block, or a wide one under two
          const s = await newSlide('focus'); dark(s, d); await hz(s, 0.6, 1.2, 8.8, 0.1);
          const n = d.items.length, g = 0.12, w = (8.8 - g) / 2, ht = 1.78, y0 = 1.36, y2 = y0 + ht + g, cell = n === 4 ? [[0.6, y0, w], [0.6 + w + g, y0, w], [0.6, y2, w], [0.6 + w + g, y2, w]] : [[0.6, y0, w], [0.6 + w + g, y0, w], [0.6, y2, 8.8]], cols = [Y, sky, 'F2A48F', 'C8D6AE'];
          for (const [i, it] of d.items.entries()) {
            const [x, y, cw] = cell[i], c = cols[i];
            t.rect(s, x, y, cw, ht, sootUp, { line: { color: c, width: 1.25 }, name: 'Panel' });
            t.img(s, await L.icon(it.icon, c, 2), x + 0.16, y + 0.12, 0.36, 0.36);
            head(s, it.h, x + 0.62, y + 0.08, cw - 0.78, 0.44, { max: 14, color: c });
            body(s, it.t, x + 0.18, y + 0.58, cw - 0.36, ht - 0.66, { max: 13, color: white });
          }
        },
      ],
      process: [
        async (d) => { // the line: plates ride a conveyor belt, rollers under it
          const s = await page(d), n = d.steps.length, g = 0.12, w = (8.8 - g * (n - 1)) / n, top = 1.3, bot = 4.58;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + g);
            plate(s, x, top, w, bot - top);
            K.marker(ctx, s, x + 0.2, top + 0.14, 0.6, i, i + 1);
            head(s, st.h, x + 0.86, top + 0.12, w - 1.04, 0.56, { max: 12, color: Y });
            body(s, st.t, x + 0.16, top + 0.76, w - 0.32, bot - top - 0.94, { max: 14, color: white });
          }
          t.rect(s, 0.45, 4.62, 9.1, 0.14, soot, { name: 'Belt' });
          for (let k = 0; k < 14; k++) t.oval(s, 0.55 + k * 0.67, 4.77, 0.24, 0.24, '7A828A', { line: { color: soot, width: 1.25 } });
        },
        async (d) => { // a riser pipe up the middle, a valve for each step, plates on both sides
          const s = await page(d), n = d.steps.length, w = 3.95, ch = 1.74, cx = 5, ys = n === 4 ? [1.28, 1.5, 3.3, 3.3] : [1.28, 2.29, 3.3], my = n === 4 ? [1.4, 2.3, 3.2, 4.1] : [1.85, 2.86, 3.87];
          pipeV(s, cx - 0.12, 1.25, 3.8, 0.24);
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? 5.45 : 0.6, y = ys[i];
            plate(s, x, y, w, ch);
            K.marker(ctx, s, cx - 0.33, my[i], 0.66, i, i + 1);
            head(s, st.h, x + 0.24, y + 0.1, w - 0.48, 0.44, { max: 13, color: Y, align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.24, y + 0.56, w - 0.48, ch - 0.68, { max: 13, color: white, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // steel stairs going up, a hazard edge on every tread
          const s = await page(d), n = d.steps.length, g = 0.04, w = (8.8 - g * (n - 1)) / n, y0 = 2.98, yN = 1.3;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + g), y = y0 - i * (y0 - yN) / (n - 1);
            t.rect(s, x, y, w, YB - y, steel, { line: { color: '2A2F34', width: 1.25 }, name: 'Step' });
            await hz(s, x, y, w, 0.12);
            t.text(s, String(i + 1), { x: x + 0.12, y: y + 0.15, w: 0.45, h: 0.5, bold: true, fontSize: 24, color: Y, valign: 'middle' });
            head(s, st.h, x + 0.55, y + 0.15, w - 0.65, 0.5, { max: 12, color: white });
            body(s, st.t, x + 0.12, y + 0.68, w - 0.24, YB - y - 0.74, { max: 13, color: white });
          }
        },
        async (d) => { // a hopper: wide at the top, each stage narrower toward the outlet
          const s = await page(d), n = d.steps.length, top = 1.28, rh = (YB - top) / n, cx = 5, minW = 6.6;
          for (const [i, st] of d.steps.entries()) {
            const w = 8.8 - (8.8 - minW) * i / (n - 1), x = cx - w / 2, y = top + i * rh;
            t.rect(s, x, y + 0.03, w, rh - 0.06, i % 2 ? '3A4148' : steel, { line: { color: '2A2F34', width: 1.25 }, name: 'Stage' });
            K.marker(ctx, s, x + 0.12, y + rh / 2 - 0.26, 0.6, i, i + 1);
            head(s, st.h, x + 0.8, y + 0.06, 1.75, rh - 0.12, { max: 12, color: Y });
            body(s, st.t, x + 2.62, y + 0.07, w - 2.76, rh - 0.14, { max: 13, color: white, valign: 'middle' });
          }
        },
      ],
      stats: [
        async (d) => { // three dials on the wall, ticks round the rim, the reading in the centre
          const s = await page(d), dd = 1.92, cw = 8.8 / 3; let tk = ''; for (let k = 0; k < 36; k++) tk += `<line x1="100" y1="6" x2="100" y2="${k % 3 ? 14 : 22}" transform="rotate(${k * 10} 100 100)"/>`;
          for (const [i, x] of d.stats.entries()) {
            const cx = 0.6 + i * cw + cw / 2, y = 1.28 + (i === 1 ? 0.14 : 0);
            t.oval(s, cx - dd / 2, y, dd, dd, 'F1F3F5', { line: { color: steel, width: 5 }, name: 'Dial' });
            t.img(s, await svgOnce(ctx, 'dial', `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><g stroke="#1E2327" stroke-width="2.5">${tk}</g></svg>`, 200, 200), cx - dd / 2, y, dd, dd);
            t.text(s, x.value, { x: cx - dd / 2 + 0.24, y: y + 0.42, w: dd - 0.48, h: dd - 0.84, bold: true, fontSize: L.fit(x.value, dd - 0.48, 1, 30, 13, HF, true), color: C.ink, align: 'center', valign: 'middle' });
            body(s, x.label, 0.6 + i * cw + 0.1, y + dd + 0.05, cw - 0.2, 0.52, { max: 12.5, align: 'center' });
          }
          if (d.note) body(s, d.note, 0.6, 4.06, 8.8, 0.98, { max: 12.5, color: C.muted, valign: 'middle' });
        },
        async (d) => { // the control room: one big amber readout, two small, all in the dark
          const s = await newSlide('focus'); dark(s, d);
          const [a, b, c] = d.stats, lcd = '0F1215';
          t.rect(s, 0.6, 1.3, 5.0, 2.45, lcd, { line: { color: Y, width: 2 }, name: 'Readout' });
          t.text(s, a.value, { x: 0.8, y: 1.38, w: 4.6, h: 1.38, fontFace: 'Courier New', bold: true, fontSize: L.fit(a.value, 4.6, 1.3, 62, 24, 'Courier New', true), color: Y, align: 'center', valign: 'middle' });
          body(s, a.label, 0.85, 2.8, 4.5, 0.85, { max: 14, color: white, align: 'center', valign: 'middle' });
          for (const [i, x] of [b, c].entries()) {
            const y = 1.3 + i * 1.265, col = i ? 'F2A48F' : sky;
            t.rect(s, 5.8, y, 3.6, 1.185, lcd, { line: { color: col, width: 1.25 }, name: 'Readout' });
            t.text(s, x.value, { x: 5.9, y: y + 0.06, w: 3.4, h: 0.56, fontFace: 'Courier New', bold: true, fontSize: L.fit(x.value, 3.4, 0.54, 28, 14, 'Courier New', true), color: col, valign: 'middle' });
            body(s, x.label, 5.9, y + 0.62, 3.4, 0.52, { max: 12, color: white });
          }
          if (d.note) body(s, d.note, 0.6, 3.88, 8.8, 1.16, { max: 13, color: soft, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // a hazard column between two lots, the words turned toward it
          const s = await page(d), w = 4.05, n = Math.max(d.left.items.length, d.right.items.length), top = 2.0, av = 3.02, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.14, av);
          await hzV(s, 4.86, 1.28, 0.28, 3.77);
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? 5.35 : 0.6;
            t.rect(s, x, 1.3, w, 0.58, i ? '29335C' : steel, { line: { color: '2A2F34', width: 1 }, name: 'Head plate' });
            head(s, side.h, x + 0.12, 1.32, w - 0.24, 0.54, { max: 15, color: i ? sky : Y, align: i ? 'left' : 'right' });
            for (const [j, v] of side.items.entries()) t.text(s, v, { x, y: top + j * rh, w, h: rh, fontSize: fs, color: C.ink, align: i ? 'left' : 'right', valign: 'middle' });
          }
        },
        async (d) => { // two long plates, one over the other, the name on a stamped block
          const s = await page(d), hh = 1.8;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.3 + i * (hh + 0.14), c = i ? sky : Y, n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.3) / rws, w = 3.05;
            plate(s, 0.6, y, 8.8, hh);
            t.rect(s, 0.82, y + 0.12, 1.9, hh - 0.24, c, { name: 'Stamped block' });
            head(s, side.h, 0.88, y + 0.16, 1.78, hh - 0.32, { max: 14, align: 'center' });
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.2, rh - 0.02, 13, 10, 'Calibri')));
            for (const [j, v] of side.items.entries()) {
              const x = 2.88 + (j % 2) * (w + 0.1), yy = y + 0.15 + Math.floor(j / 2) * rh;
              t.oval(s, x, yy + rh / 2 - 0.05, 0.1, 0.1, c);
              t.text(s, v, { x: x + 0.18, y: yy, w: w - 0.2, h: rh, fontSize: fs, color: white, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // yellow letters in the dark between two hazard bands
          const s = await newSlide('focus'); dark(s, d);
          await hz(s, 0.6, 1.25, 8.8); await hz(s, 0.6, 3.62, 8.8);
          const T = d.text.toUpperCase();
          t.text(s, T, { x: 0.6, y: 1.46, w: 8.8, h: 2.1, bold: true, fontSize: L.fit(T, 8.8, 2.05, 30, 15, HF, true), color: Y, align: 'center', valign: 'middle' });
          if (d.caption) body(s, d.caption, 0.6, 3.85, 8.8, 1.2, { max: 13.5, color: soft, align: 'center' });
        },
        async (d) => { // a warning sign bolted to the wall, the remark on a small plate beside it
          const s = await page(d, 'focus');
          t.rect(s, 0.6, 1.3, 5.9, 3.72, Y, { line: { color: soot, width: 2.5 }, shadow: 0.3, blur: 5, offset: 2, name: 'Warning sign' }); await hz(s, 0.6, 1.3, 5.9, 0.22);
          t.img(s, await L.icon('FiAlertTriangle', C.ink, 2), 0.82, 1.62, 0.52, 0.52);
          t.text(s, L.runs(d.text), { x: 1.46, y: 1.6, w: 4.85, h: 3.3, bold: true, fontSize: L.fit(d.text, 4.85, 3.25, 28, 15, HF, true), color: C.ink, valign: 'middle' });
          if (d.caption) { plate(s, 6.7, 1.3, 2.7, 3.72); body(s, d.caption, 6.86, 1.48, 2.38, 3.36, { max: 13.5, color: white, valign: 'middle' }); }
        },
      ],
      timeline: [
        async (d) => { // a steel girder across the page, plates bolted above and below it in turn
          const s = await page(d), ty = 3.06, hh = 1.56, w = 4.0;
          t.rect(s, 0.45, ty, 9.1, 0.26, soot, { name: 'Girder' }); for (let k = 0; k < 30; k++) t.oval(s, 0.56 + k * 0.305, ty + 0.09, 0.08, 0.08, 'AEB4BA');
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = 0.6 + (i >> 1) * 4.45 + (above ? 0 : 0.35), y = above ? 1.42 : 3.4;
            plate(s, x, y, w, hh);
            t.rect(s, x + 0.22, y + 0.08, 1.45, 0.38, Y, { name: 'Date' });
            head(s, it.year, x + 0.24, y + 0.08, 1.41, 0.38, { max: 13, align: 'center' });
            head(s, it.h, x + 1.75, y + 0.08, w - 1.98, 0.38, { max: 11.5, color: white });
            body(s, it.t, x + 0.22, y + 0.5, w - 0.44, hh - 0.56, { max: 13, color: white });
          }
        },
        async (d) => { // a run of pipe down the side, a nut at each date, the entries on bare steel
          const s = await page(d), top = 1.28, rh = (YB - top) / 4;
          pipeV(s, 0.9, top, YB - top, 0.2);
          for (const [i, it] of d.items.entries()) {
            const y = top + i * rh;
            nut(s, 0.72, y + rh / 2 - 0.25, 0.56);
            t.rect(s, 1.42, y + rh / 2 - 0.22, 1.5, 0.44, soot, { name: 'Date' });
            head(s, it.year, 1.46, y + rh / 2 - 0.22, 1.42, 0.44, { max: 13, color: Y, align: 'center' });
            head(s, it.h, 3.08, y + 0.04, 6.3, 0.3, { max: 13 });
            body(s, it.t, 3.08, y + 0.34, 6.3, rh - 0.38, { max: 13 });
            if (i < 3) t.line(s, 1.42, y + rh, 7.98, 0, '5A6168', 0.75);
          }
        },
        async (d) => { // shipment plates stepping up the wall, one after another
          const s = await page(d), w = 5.3, hh = 0.86, sx = (8.8 - w) / 3, sy = (YB - 1.28 - hh) / 3;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * sx, y = YB - hh - i * sy;
            t.rect(s, x, y, w, hh, steel, { line: { color: '2A2F34', width: 1.25 }, shadow: 0.25, blur: 4, offset: 2, name: 'Plate' });
            t.rect(s, x, y, 1.15, hh, Y, { name: 'Date' });
            head(s, it.year, x + 0.04, y + 0.05, 1.07, hh - 0.1, { max: 13, align: 'center' });
            head(s, it.h, x + 1.25, y + 0.03, w - 1.33, 0.26, { max: 11, color: Y });
            body(s, it.t, x + 1.25, y + 0.29, w - 1.33, hh - 0.31, { max: 11.5, color: white });
          }
        },
      ],
    };
    R.image = V.image.shift(); R.process = V.process.shift(); R.timeline = V.timeline.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    K.panel(ctx, s, 0.55, 0.55, 5.5, 4.3, 0, { big: true });
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(' / ').toUpperCase(), { x: 0.85, y: 0.8, w: 5.0, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    const T = d.title.toUpperCase();
    t.text(s, T, { x: 0.85, y: 1.15, w: 4.95, h: 2.2, bold: true, fontSize: L.fit(T, 4.9, 2.1, 34, 16, 'Arial', true), color: 'F1F3F5', valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.4, w: 4.95, h: 0.65, fontSize: 12, color: 'C9CED3' });
    t.img(s, await svgOnce(ctx, 'hzs', hazard(500), 500, 40), 0.85, 4.15, 2.0, 0.16);
    t.text(s, (M.author || '').toUpperCase(), { x: 0.85, y: 4.35, w: 4.95, h: 0.35, fontSize: 13, bold: true, color: 'F1F3F5' });
    if (d.image) await K.photo(ctx, s, d.image, 6.65, 0.8, 2.75, 3.8);
    metaFooter({ color: C.ink, y: 5.12, size: 8 })(ctx, s);
  },
};
module.exports = { id: 95, slug: 'metall', name: 'Metall', category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "sanoat tili: mustahkam, aniq, texnik; qisqa jumlalar va o'lchanadigan natijalar", limits: { title: 40, card_h: 18, step_h: 18 }, prefer: 'data' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "technical"], "transitions": ["p14:shred|pattern=\"strip\" dir=\"in\"", "cut", "split:h"], "cover": ["stretch", "splitH"], "mark": "popIn", "deco": "splitH", "sig": {"title": "splitH", "body": "wipe:r", "item": "stretch", "image": "splitH", "number": "popIn", "order": "seq", "stagger": 0.12}, "tempo": 0.85, "kenburns": false};
