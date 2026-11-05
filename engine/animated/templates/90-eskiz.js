/** 90 Eskiz — pencil sketch: graphite lines drawn twice with a wobble, hatched markers, sketched frames on white paper. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'FFFFFF', ink: '2F2F2F', muted: '666666', accent: 'D9480F', pal: ['D9480F', '1971C2', '2B8A3E', '9C36B5', 'E67700', '0C8599'] };
let seed = 5; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const wob = (x1, y1, x2, y2) => { const mx = (x1 + x2) / 2 + (rnd() - 0.5) * 6, my = (y1 + y2) / 2 + (rnd() - 0.5) * 6; return `M${(x1 + (rnd() - 0.5) * 4).toFixed(1)},${(y1 + (rnd() - 0.5) * 4).toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${(x2 + (rnd() - 0.5) * 4).toFixed(1)},${(y2 + (rnd() - 0.5) * 4).toFixed(1)}`; };
const sketchRect = (w, h, c = '2F2F2F') => { const e = 6; let d = ''; for (let pass = 0; pass < 2; pass++) d += wob(e, e, w - e, e) + ' ' + wob(w - e, e, w - e, h - e) + ' ' + wob(w - e, h - e, e, h - e) + ' ' + wob(e, h - e, e, e) + ' ';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="none" stroke="#${c}" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/></svg>`; };
const hatchCircle = (c) => { let h = ''; for (let k = -100; k < 100; k += 12) h += `<line x1="${100 + k}" y1="0" x2="${100 + k + 100}" y2="200"/>`; let ring = ''; for (let pass = 0; pass < 2; pass++) { let p = ''; for (let i = 0; i <= 40; i++) { const a = (i / 38) * 2 * Math.PI, r = 88 + (rnd() - 0.5) * 6; p += `${i ? 'L' : 'M'}${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)} `; } ring += `<path d="${p}" fill="none" stroke="#${c}" stroke-width="4" opacity="0.85"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><clipPath id="c"><circle cx="100" cy="100" r="86"/></clipPath></defs><g clip-path="url(#c)" stroke="#${c}" stroke-width="3" opacity="0.35">${h}</g>${ring}</svg>`; };
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Eskiz', C, C.pal), layout: { agenda: 'list', cards: 'columns', process: 'row', stats: 'markers', timeline: 'line' },
  bg: (ctx, s) => { s.background = { color: C.bg }; },
  panel: async (ctx, s, x, y, w, h, k) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); ctx.t.img(s, await svgOnce(ctx, `r${W2}x${H2}k${k}`, sketchRect(W2, H2), W2, H2), x, y, w, h); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 'h' + (k % 6), hatchCircle(C.pal[k % 6]), 200, 200), x, y, d, d); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: C.pal[k % 6], align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { gray: true }), x, y, w, h, { alt: '' }); await K.panel(ctx, s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, 9); },
  connector: async (ctx, s, x, y, w) => { const W2 = Math.round(w * 100); ctx.t.img(s, await svgOnce(ctx, 'c' + W2, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="30"><path d="${wob(0, 15, W2 - 20, 15)} M${W2 - 34},5 L${W2 - 18},15 L${W2 - 34},25" fill="none" stroke="#666" stroke-width="2.5"/></svg>`, W2, 30), x, y - 0.15, w, 0.3); },
  axis: async (ctx, s, x, y, w) => { const W2 = Math.round(w * 100); ctx.t.img(s, await svgOnce(ctx, 'a' + W2, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="30"><path d="${wob(0, 15, W2, 15)} ${wob(0, 17, W2, 16)}" fill="none" stroke="#2F2F2F" stroke-width="2.5"/></svg>`, W2, 30), x, y + 0.02, w, 0.3); },
  rule: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, 'CCCCCC', 0.75, { dash: 'dash' }),
  bullet: (ctx, s, x, y, k) => ctx.t.text(s, '\u2192', { x: x - 0.04, y: y - 0.08, w: 0.3, h: 0.3, fontSize: 14, bold: true, color: C.pal[k ? 1 : 0] }),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.45, 0.33, 0.75, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: (i) => C.pal[i % 6], authorColor: C.accent, compareHead: (i) => C.pal[i ? 1 : 0],
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, HF = 'Arial';
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: HF, bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, HF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const coal = '2A2A2A', chalk = 'F5F2EA', soft = 'C9C5BC', pastel = ['FF9B6B', '7CC4FF', '8FDD9E', 'E3A3F2'], note = ['FFF3B0', 'D8EEFF', 'DDF5DE', 'F6E0FB'];
    const sk = async (s, x, y, w, ht, c = '2F2F2F') => { const a = Math.round(w * 100), b = Math.round(ht * 100); t.img(s, await svgOnce(ctx, `sk${a}x${b}${c}`, sketchRect(a, b, c), a, b), x, y, w, ht); };
    const hatch = async (s, x, y, w, ht, c, op = 0.4, step = 12) => { const a = Math.round(w * 100), b = Math.round(ht * 100); let g = ''; for (let k = -b; k < a; k += step) g += `<line x1="${k}" y1="0" x2="${k + b}" y2="${b}"/>`; t.img(s, await svgOnce(ctx, `ha${a}x${b}${c}${step}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${b}"><g stroke="#${c}" stroke-width="2.4" opacity="${op}">${g}</g></svg>`, a, b), x, y, w, ht); };
    const curve = async (s, key, x, y, w, ht, d2, c = '2F2F2F', wd = 3) => { const a = Math.round(w * 100), b = Math.round(ht * 100); t.img(s, await svgOnce(ctx, 'cv' + key + c, `<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${b}" viewBox="0 0 ${a} ${b}"><path d="${d2}" fill="none" stroke="#${c}" stroke-width="${wd}" stroke-linecap="round" stroke-linejoin="round"/></svg>`, a, b), x, y, w, ht); };
    const dark = async (d) => { const s = await newSlide('focus'); s.background = { color: coal }; const pc = pastel[ctx.idx % 4]; t.img(s, await svgOnce(ctx, 'hd' + pc, hatchCircle(pc), 200, 200), 0.45, 0.33, 0.75, 0.75); t.text(s, String(ctx.idx), { x: 0.45, y: 0.33, w: 0.75, h: 0.75, fontSize: 18, bold: true, color: pc, align: 'center', valign: 'middle' }); t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: chalk, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, HF, true) }); metaFooter({ color: soft })(ctx, s); return s; };
    const V = {
      image: [
        async (d) => { // a loose round study, hatching behind it, an arrow drawn from the words
          const s = await page(d), dd = 3.35, x = 5.85, y = 1.42;
          await hatch(s, x - 0.3, y - 0.2, dd + 0.6, dd + 0.2, C.pal[0], 0.35);
          t.oval(s, x - 0.08, y - 0.08, dd + 0.16, dd + 0.16, 'FFFFFF');
          t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle', gray: true }), x, y, dd, dd, { alt: '' });
          t.img(s, await svgOnce(ctx, 'hring', hatchCircle(C.ink).replace(/<g clip-path.*?<\/g>/, ''), 200, 200), x - 0.42, y - 0.42, dd + 0.84, dd + 0.84);
          await curve(s, 'to', 4.92, 2.2, 0.9, 0.6, 'M4,50 C30,10 50,10 84,24 M64,8 L84,24 L60,34', C.accent);
          body(s, d.text, 0.6, 1.35, 4.25, 3.65, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // the picture across the whole page, a sheet of paper laid on it, held with tape
          const s = await newSlide('focus');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625, { gray: true }), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.17, 10, 0.455, 'FFFFFF', { name: 'Footer band' }); metaFooter({ color: C.muted })(ctx, s);
          t.rect(s, 0.45, 0.35, 4.8, 4.6, 'FFFFFF', { shadow: 0.3, blur: 8, offset: 3, name: 'Paper' }); await sk(s, 0.55, 0.45, 4.6, 4.4);
          t.rect(s, 2.3, 0.22, 1.1, 0.26, 'FFE9A8', { t: 15, rotate: -3, name: 'Tape' });
          await K.marker(ctx, s, 0.72, 0.62, 0.6, ctx.idx, ctx.idx);
          head(s, d.title, 1.45, 0.58, 3.55, 0.72, { max: 17 });
          body(s, d.text, 0.75, 1.4, 4.2, 3.35, { max: 14, k: 1.12, valign: 'middle' });
        },
        async (d) => { // a measured drawing: dimension arrows along two sides of the picture
          const s = await page(d), x = 1.0, y = 1.75, w = 4.3, ht = 3.1;
          t.img(s, await L.photo(L.src(d.image), w, ht, { gray: true }), x, y, w, ht, { alt: '' }); await sk(s, x - 0.04, y - 0.04, w + 0.08, ht + 0.08);
          await curve(s, 'dimH', x, y - 0.32, w, 0.2, `M2,10 L${w * 100 - 2},10 M14,2 L2,10 L14,18 M${w * 100 - 14},2 L${w * 100 - 2},10 L${w * 100 - 14},18`, C.accent, 2.5);
          await curve(s, 'dimV', x - 0.34, y, 0.2, ht, `M10,2 L10,${ht * 100 - 2} M2,14 L10,2 L18,14 M2,${ht * 100 - 14} L10,${ht * 100 - 2} L18,${ht * 100 - 14}`, C.accent, 2.5);
          body(s, d.text, 5.6, 1.35, 3.8, 3.65, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // a spiral notebook opened flat: rings along the top, the picture, then the notes
          const s = await page(d), y = 1.42;
          for (let k = 0; k < 28; k++) { const x = 0.75 + k * 0.32; t.oval(s, x, y - 0.07, 0.12, 0.12, 'FFFFFF', { line: { color: C.ink, width: 1 } }); t.line(s, x + 0.06, y - 0.22, 0, 0.2, C.ink, 1.5); }
          t.img(s, await L.photo(L.src(d.image), 8.5, 1.5, { gray: true }), 0.75, y + 0.12, 8.5, 1.5, { alt: '' });
          await sk(s, 0.6, y, 8.8, 3.68);
          body(s, d.text, 0.8, y + 1.68, 8.4, 1.94, { max: 14, k: 1.08 });
        },
      ],
      cards: [
        async (d) => { // a mind map: an idea scribbled in the middle, branches drawn out to each item, no boxes
          const s = await page(d), n = d.items.length, cw = 3.3, ch = 1.76, cell = n === 4 ? [[0.6, 1.3], [6.1, 1.3], [0.6, 3.34], [6.1, 3.34]] : [[0.6, 1.3], [6.1, 2.32], [0.6, 3.34]], cx = 5, cy = 3.2;
          await curve(s, 'branch' + n, 0, 0, 10, 5.625, cell.map(([x, y], i) => { const ex = (x > 5 ? x - 0.08 : x + cw + 0.08) * 100, ey = (y + 0.3) * 100; return `M${cx * 100},${cy * 100} C${cx * 100},${(cy * 100 + ey) / 2} ${(cx * 100 + ex) / 2},${ey} ${ex},${ey}`; }).join(' '), C.ink, 3);
          t.oval(s, 4.42, 2.76, 1.16, 0.88, 'FFFFFF'); await hatch(s, 4.45, 2.82, 1.1, 0.76, C.pal[0], 0.45); t.img(s, await svgOnce(ctx, 'hk', hatchCircle(C.ink).replace(/<g clip-path.*?<\/g>/, ''), 200, 200), 4.3, 2.65, 1.4, 1.1);
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i], right = x > 5;
            await marker(s, right ? x : x + cw - 0.52, y + 0.02, 0.52, i, '');
            t.img(s, await L.icon(it.icon, C.pal[i], 2), (right ? x : x + cw - 0.52) + 0.13, y + 0.15, 0.26, 0.26);
            head(s, it.h, right ? x + 0.6 : x, y + 0.04, cw - 0.6, 0.48, { max: 14, color: C.pal[i], align: right ? 'left' : 'right' });
            body(s, it.t, x, y + 0.56, cw, ch - 0.6, { max: 13, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // a checklist on a notepad: a ticked box, then the item, pencil lines between
          const s = await page(d), n = d.items.length, top = 1.32, rh = 3.74 / n;
          for (const [i, it] of d.items.entries()) {
            const y = top + i * rh, by = y + rh / 2 - 0.26;
            await sk(s, 0.6, by, 0.52, 0.52, C.pal[i]);
            t.img(s, await L.icon(it.icon, C.pal[i], 2), 0.72, by + 0.12, 0.28, 0.28);
            head(s, it.h, 1.3, y + 0.04, 2.45, rh - 0.08, { max: 15 });
            body(s, it.t, 3.85, y + 0.05, 5.55, rh - 0.1, { max: 13.5, valign: 'middle' });
            if (i < n - 1) await curve(s, 'rl', 0.6, y + rh - 0.06, 8.8, 0.12, `${wob(0, 6, 880, 6)}`, 'AAAAAA', 2);
          }
        },
        async (d) => { // sticky notes on the desk, each a little crooked and not level with the next
          const s = await page(d), n = d.items.length, g = 0.16, w = (8.8 - g * (n - 1)) / n, ht = 3.05;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + g), y = [1.3, 2.02, 1.55, 2.02][i];
            t.rect(s, x, y, w, ht, note[i], { rotate: [-0.8, 0.7, -0.5, 0.9][i], shadow: 0.2, blur: 5, offset: 3, name: 'Sticky note' });
            t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.14, y + 0.14, 0.36, 0.36);
            head(s, it.h, x + 0.14, y + 0.54, w - 0.28, 0.52, { max: 14 });
            body(s, it.t, x + 0.14, y + 1.08, w - 0.28, ht - 1.16, { max: 13 });
          }
        },
        async (d) => { // white pencil on charcoal paper: a block of four frames, a long one under two if there are three
          const s = await dark(d), n = d.items.length, g = 0.14, w = (8.8 - g) / 2, ht = 1.82, y2 = 1.28 + ht + g, cell = n === 4 ? [[0.6, 1.28, w], [0.6 + w + g, 1.28, w], [0.6, y2, w], [0.6 + w + g, y2, w]] : [[0.6, 1.28, w], [0.6 + w + g, 1.28, w], [0.6, y2, 8.8]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, cw] = cell[i], c = pastel[i];
            await sk(s, x, y, cw, ht, chalk);
            t.img(s, await L.icon(it.icon, c, 2), x + 0.18, y + 0.16, 0.36, 0.36);
            head(s, it.h, x + 0.66, y + 0.12, cw - 0.84, 0.44, { max: 15, color: c });
            body(s, it.t, x + 0.2, y + 0.62, cw - 0.4, ht - 0.72, { max: 13, color: chalk });
          }
        },
      ],
      process: [
        async (d) => { // one line drawn without lifting the pencil: a staircase, the words on the treads, shading under them
          const s = await page(d), n = d.steps.length, w = 8.8 / n, y0 = 3.02, yN = 1.32, floor = 5.1, ys = d.steps.map((_, i) => y0 - i * (y0 - yN) / (n - 1));
          let p = `M60,${floor * 100}`; ys.forEach((y, i) => { const x = 60 + i * w * 100; p += ` L${x},${y * 100} L${x + w * 100},${y * 100}`; });
          for (const [i, y] of ys.entries()) await hatch(s, 0.6 + i * w, y + 0.02, w, floor - y - 0.02, C.pal[i], 0.14, 16);
          await curve(s, 'stair' + n, 0, 0, 10, 5.625, p + ` L${60 + n * w * 100},${floor * 100} Z`, C.ink, 3);
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * w, y = ys[i];
            await marker(s, x + 0.08, y + 0.08, 0.46, i, i + 1);
            head(s, st.h, x + 0.58, y + 0.06, w - 0.68, 0.5, { max: 13 });
            body(s, st.t, x + 0.12, y + 0.58, w - 0.24, floor - y - 0.64, { max: 13 });
          }
        },
        async (d) => { // a wobbling line down the middle, a hatched ring at each step, the words free on both sides
          const s = await page(d), n = d.steps.length, w = 4.05, step = 3.8 / n, top = 1.3;
          await curve(s, 'spine', 4.85, 1.28, 0.3, 3.85, `${wob(15, 0, 15, 128)} ${wob(15, 128, 15, 256)} ${wob(15, 256, 15, 385)}`, C.ink, 3);
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? 5.4 : 0.55, my = top + i * step + (step - 0.6) / 2, ty = Math.min(5.1 - 1.5, Math.max(top, my - 0.42));
            t.oval(s, 4.7, my, 0.6, 0.6, 'FFFFFF'); await marker(s, 4.7, my, 0.6, i, i + 1);
            head(s, st.h, x, ty, w, 0.44, { max: 15, color: C.pal[i], align: right ? 'left' : 'right' });
            body(s, st.t, x, ty + 0.46, w, 1.05, { max: 13, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // a snake: along the top, round a drawn bend, and back along the bottom
          const s = await page(d), n = d.steps.length, w = 4.05, ht = 1.75, cell = n === 4 ? [[0.6, 1.3], [5.35, 1.3], [5.35, 3.35], [0.6, 3.35]] : [[0.6, 1.3], [5.35, 1.3], [5.35, 3.35]];
          await curve(s, 'snk1', 4.68, 2.0, 0.64, 0.3, 'M2,15 L60,15 M46,4 L60,15 L46,26', C.accent); await curve(s, 'snk2', 7.2, 3.07, 0.3, 0.26, 'M15,1 L15,24 M5,14 L15,24 L25,14', C.accent);
          if (n === 4) await curve(s, 'snk3', 4.68, 4.05, 0.64, 0.3, 'M62,15 L4,15 M18,4 L4,15 L18,26', C.accent);
          for (const [i, st] of d.steps.entries()) {
            const [x, y] = cell[i];
            await sk(s, x, y, w, ht, C.pal[i]);
            await marker(s, x + 0.12, y + 0.1, 0.5, i, i + 1);
            head(s, st.h, x + 0.72, y + 0.1, w - 0.86, 0.5, { max: 14 });
            body(s, st.t, x + 0.18, y + 0.66, w - 0.36, ht - 0.76, { max: 13 });
          }
        },
      ],
      stats: [
        async (d) => { // figures underlined twice in a column, the note on a yellow sticky at the side
          const s = await page(d), rw = d.note ? 5.8 : 8.8, rh = 3.74 / 3;
          for (const [i, x] of d.stats.entries()) {
            const y = 1.32 + i * rh;
            t.text(s, x.value, { x: 0.6, y: y + 0.02, w: 2.65, h: rh - 0.2, bold: true, fontSize: L.fit(x.value, 2.65, rh - 0.24, 38, 18, HF, true), color: C.pal[i], valign: 'middle' });
            await curve(s, 'un' + i, 0.6, y + rh - 0.2, 2.65, 0.14, `${wob(0, 5, 265, 5)} ${wob(0, 10, 265, 9)}`, C.pal[i], 2.5);
            body(s, x.label, 3.45, y + 0.05, rw - 2.85, rh - 0.2, { max: 14, valign: 'middle' });
          }
          if (d.note) { t.rect(s, 6.65, 1.5, 2.75, 3.4, note[0], { rotate: 1, shadow: 0.2, blur: 5, offset: 3, name: 'Sticky note' }); body(s, d.note, 6.8, 1.62, 2.45, 3.16, { max: 14, valign: 'middle' }); }
        },
        async (d) => { // on charcoal paper: the one figure that matters circled by hand, two more beside it
          const s = await dark(d), [a, b, c] = d.stats, dd = 2.75;
          t.img(s, await svgOnce(ctx, 'ring2', hatchCircle(pastel[0]).replace(/<g clip-path.*?<\/g>/, ''), 200, 200), 0.6, 1.2, 4.6, dd);
          t.text(s, a.value, { x: 1.2, y: 1.72, w: 3.4, h: 1.0, bold: true, fontSize: L.fit(a.value, 3.4, 0.95, 50, 22, HF, true), color: chalk, align: 'center', valign: 'middle' });
          body(s, a.label, 1.45, 2.72, 2.9, 0.68, { max: 12, color: soft, align: 'center' });
          for (const [i, x] of [b, c].entries()) {
            const y = 1.3 + i * 1.28, col = pastel[i + 1];
            t.text(s, x.value, { x: 5.5, y, w: 3.9, h: 0.58, bold: true, fontSize: L.fit(x.value, 3.9, 0.55, 30, 16, HF, true), color: col, valign: 'middle' });
            await curve(s, 'un2' + i, 5.5, y + 0.58, 3.9, 0.1, wob(0, 5, 390, 5), col, 2);
            body(s, x.label, 5.5, y + 0.7, 3.9, 0.5, { max: 12.5, color: chalk });
          }
          if (d.note) body(s, d.note, 0.6, 4.05, 8.8, 1.05, { max: 13, color: soft, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // a pencil line down the page, the two lists turned to face it
          const s = await page(d), w = 4.1, n = Math.max(d.left.items.length, d.right.items.length), top = 1.98, av = 3.1, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.14, av);
          await curve(s, 'mid', 4.85, 1.3, 0.3, 3.8, `${wob(15, 0, 15, 190)} ${wob(15, 190, 15, 380)} ${wob(17, 0, 14, 380)}`, C.ink, 2.5);
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? 5.3 : 0.6, c = C.pal[i ? 1 : 0];
            head(s, side.h, x, 1.32, w, 0.52, { max: 18, color: c, align: i ? 'left' : 'right' });
            await curve(s, 'hl' + i, x, 1.85, w, 0.1, wob(0, 5, 410, 5), c, 2.5);
            for (const [j, v] of side.items.entries()) t.text(s, v, { x, y: top + j * rh, w, h: rh, fontSize: fs, align: i ? 'left' : 'right', valign: 'middle' });
          }
        },
        async (d) => { // two long frames one above the other, a hatched block with each name
          const s = await page(d), hh = 1.84;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.28 + i * (hh + 0.1), n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.2) / rws, w = 3.2, c = C.pal[i ? 2 : 3];
            await hatch(s, 0.68, y + 0.08, 2.0, hh - 0.16, c, 0.3); await sk(s, 0.6, y, 8.8, hh, c);
            head(s, side.h, 0.78, y + 0.2, 1.8, hh - 0.4, { max: 16, align: 'center' });
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.24, rh - 0.04, 13, 10, 'Calibri')));
            for (const [j, v] of side.items.entries()) {
              const x = 2.82 + (j % 2) * (w + 0.05), yy = y + 0.1 + Math.floor(j / 2) * rh;
              t.text(s, '→', { x, y: yy, w: 0.22, h: rh, bold: true, fontSize: 13, color: c, valign: 'middle', noFit: true });
              t.text(s, v, { x: x + 0.24, y: yy, w: w - 0.24, h: rh, fontSize: fs, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // big white words on charcoal paper beside a hatched ring, the pencil dragged under them three times
          const s = await dark(d);
          t.img(s, await svgOnce(ctx, 'hd' + pastel[0], hatchCircle(pastel[0]), 200, 200), 0.55, 1.75, 1.75, 1.75);
          t.text(s, L.runs(d.text), { x: 2.6, y: 1.25, w: 6.8, h: 2.1, bold: true, fontSize: L.fit(d.text, 6.8, 2.05, 32, 16, HF, true), color: chalk, valign: 'middle' });
          await curve(s, 'tri', 2.6, 3.4, 5.5, 0.22, `${wob(0, 5, 550, 6)} ${wob(0, 11, 520, 11)} ${wob(0, 17, 480, 17)}`, pastel[0], 2.5);
          if (d.caption) body(s, d.caption, 2.6, 3.7, 6.8, 1.4, { max: 14, color: soft });
        },
        async (d) => { // a speech balloon drawn by hand, the remark set small below its tail
          const s = await page(d, 'focus'), bw = 6.3, bh = 2.75;
          t.img(s, await svgOnce(ctx, 'balloon', `<svg xmlns="http://www.w3.org/2000/svg" width="630" height="360"><path d="M60,8 C200,2 440,2 570,8 C615,10 624,40 624,70 L624,210 C624,250 610,268 570,270 L190,270 L100,350 L120,270 L60,270 C20,268 6,250 6,210 L6,70 C6,30 20,10 60,8 Z" fill="#${note[0]}" stroke="#2F2F2F" stroke-width="3"/><path d="M60,12 C210,6 430,6 570,12 C610,14 620,44 620,74 L620,206 C620,246 604,264 568,266" fill="none" stroke="#2F2F2F" stroke-width="2" opacity="0.5"/></svg>`, 630, 360), 0.6, 1.28, bw, 3.6);
          t.text(s, L.runs(d.text), { x: 0.9, y: 1.4, w: 5.7, h: 2.5, bold: true, fontSize: L.fit(d.text, 5.7, 2.45, 28, 15, HF, true), color: C.ink, valign: 'middle' });
          if (d.caption) { await sk(s, 7.1, 1.4, 2.3, 3.6, C.pal[1]); body(s, d.caption, 7.22, 1.5, 2.06, 3.4, { max: 13, valign: 'middle' }); }
        },
      ],
      timeline: [
        async (d) => { // a road sketched across the page, dates in turn above and below its bends
          const s = await page(d), up = 1.3, dn = 3.5, hh = 1.6, cw = 3.95;
          await curve(s, 'road', 0.6, 2.96, 8.8, 0.44, 'M4,22 C120,0 240,42 440,22 S760,0 876,22 M4,28 C120,6 240,48 440,28 S760,6 876,28', C.ink, 2.5);
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = 0.6 + (i >> 1) * 4.5 + (above ? 0 : 0.45), y = above ? up : dn;
            t.oval(s, x + 0.08, 3.05, 0.26, 0.26, 'FFFFFF'); await marker(s, x + 0.08, 3.05, 0.26, i, '');
            head(s, it.year, x, y, 1.4, 0.42, { max: 18, color: C.pal[i] });
            head(s, it.h, x + 1.45, y, cw - 1.45, 0.42, { max: 13 });
            body(s, it.t, x, y + 0.44, cw, hh - 0.46, { max: 13 });
          }
        },
        async (d) => { // a long sharpened pencil standing at the side, each date ruled off from it
          const s = await page(d), top = 1.28, rh = 3.82 / 4;
          t.img(s, await svgOnce(ctx, 'pencil', `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="382"><path d="M12,0 L48,0 L48,320 L30,378 L12,320 Z" fill="#FFD43B" stroke="#2F2F2F" stroke-width="3"/><path d="M12,320 L48,320 L30,378 Z" fill="#F1D2A9" stroke="#2F2F2F" stroke-width="3"/><path d="M24,360 L36,360 L30,378 Z" fill="#2F2F2F"/><rect x="12" y="0" width="36" height="30" fill="#E8590C" stroke="#2F2F2F" stroke-width="3"/><line x1="24" y1="30" x2="24" y2="320" stroke="#2F2F2F" stroke-width="1.5"/><line x1="36" y1="30" x2="36" y2="320" stroke="#2F2F2F" stroke-width="1.5"/></svg>`, 60, 382), 0.55, top, 0.6, 3.82);
          for (const [i, it] of d.items.entries()) {
            const y = top + i * rh, c = C.pal[i];
            t.line(s, 1.1, y + 0.32, 0.25, 0, c, 2);
            head(s, it.year, 1.42, y + 0.05, 1.6, 0.54, { max: 20, color: c });
            head(s, it.h, 3.1, y + 0.04, 6.3, 0.3, { max: 14 });
            body(s, it.t, 3.1, y + 0.34, 6.3, rh - 0.38, { max: 13 });
            if (i < 3) await curve(s, 'rl', 0.6 + 0.8, y + rh - 0.06, 8.0, 0.12, wob(0, 6, 800, 6), 'BBBBBB', 2);
          }
        },
      ],
    };
    R.image = V.image.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 0.75, 3.1, 3.4);
    await K.marker(ctx, s, 5.5, 3.75, 1.0, 0, ''); await K.marker(ctx, s, 8.75, 0.25, 0.8, 1, '');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.2, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.2, 2.1, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 5.0, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 5.0, h: 0.45, fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 90, slug: 'eskiz', name: 'Eskiz', category: 'minimalist', photos: true, build: (c, o) => run(c, o, K), style: { tone: "g'oya chizgisi kabi: sodda, tushuntiruvchi, qadam-baqadam; murakkabni oddiy qilib", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["wipe:r", "fade", "dissolve"], "cover": ["typeLetters", "fadeLetters"], "mark": "fade", "deco": "wipe:r", "sig": {"title": "wipe:r", "body": "wipeWords", "item": "wipe:d", "image": "wipe:r", "number": "fade", "order": "seq", "stagger": 0.2}, "tempo": 1.2, "kenburns": false};
