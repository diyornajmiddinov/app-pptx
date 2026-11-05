/** 88 Hologramma — Y2K iridescent: holographic pastel mesh, chrome spheres as markers, frosted cards with rainbow edges. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'EDE7FF', ink: '2B2140', muted: '62587A', accent: 'B14AED', pal: ['B14AED', '3EC1F3', 'FF7AB6', '58E0B5', 'FFC95C', '7C83FD'] };
const holo = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><filter id="b"><feGaussianBlur stdDeviation="90"/></filter></defs><rect width="1600" height="900" fill="#EFEAFF"/><g filter="url(#b)"><circle cx="250" cy="200" r="280" fill="#FFC7E8"/><circle cx="1350" cy="180" r="300" fill="#BDEBFF"/><circle cx="800" cy="760" r="320" fill="#D7FFE9"/><circle cx="1300" cy="780" r="220" fill="#FFF0BF"/><circle cx="300" cy="800" r="220" fill="#D9CCFF"/></g></svg>`;
const sphere = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><radialGradient id="g" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="#E9E6F5"/><stop offset="0.7" stop-color="#${c}"/><stop offset="1" stop-color="#5B4E7A"/></radialGradient></defs><circle cx="100" cy="100" r="96" fill="url(#g)"/><ellipse cx="72" cy="58" rx="30" ry="16" fill="#fff" opacity="0.7"/></svg>`;
const edge = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF7AB6"/><stop offset="0.35" stop-color="#FFC95C"/><stop offset="0.65" stop-color="#58E0B5"/><stop offset="1" stop-color="#3EC1F3"/></linearGradient></defs><rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="22" fill="#ffffff" fill-opacity="0.72" stroke="url(#g)" stroke-width="6"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Hologramma', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'markers', timeline: 'line' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', holo(), 1600, 900, true) }; },
  panel: async (ctx, s, x, y, w, h) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); ctx.t.img(s, await svgOnce(ctx, `e${W2}x${H2}`, edge(W2, H2), W2, H2), x, y, w, h); },
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.img(s, await svgOnce(ctx, 's' + (k % 6), sphere(C.pal[k % 6]), 200, 200), x, y, d, d); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: C.ink, align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { await K.panel(ctx, s, x - 0.12, y - 0.12, w + 0.24, h + 0.24); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { r: 0.12 } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.accent, 2, { dash: 'sysDot' }),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, C.accent, 2),
  title: async (ctx, s, d) => { const { t, L } = ctx; await K.marker(ctx, s, 0.5, 0.36, 0.7, ctx.idx, ctx.idx); if (d.title) t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: C.muted }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: () => C.ink, authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h, HF = 'Arial';
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: HF, bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, HF, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const space = '1A1033', spaceUp = '2A1C4F', ice = 'F4F0FF', soft = 'C9C0E6', neon = ['FF9AD0', '7FE3FF', '9CF5D0', 'FFE08A'], deep = ['8E2BC9', '0E7FB0', 'C2317E', '12835F'];
    const stops = '<stop offset="0" stop-color="#FF9AD0"/><stop offset="0.35" stop-color="#FFE08A"/><stop offset="0.65" stop-color="#9CF5D0"/><stop offset="1" stop-color="#7FE3FF"/>';
    const rain = async (s, x, y, w, ht, r = 0) => { const a = Math.round(w * 100), b = Math.round(ht * 100); t.img(s, await svgOnce(ctx, `rain${a}x${b}r${r}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${b}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient></defs><rect width="${a}" height="${b}" rx="${r * 100}" fill="url(#g)"/></svg>`, a, b), x, y, w, ht); };
    const glass = async (s, x, y, w, ht, stroke = '', fill = 'ffffff', op = 0.74) => { const a = Math.round(w * 100), b = Math.round(ht * 100); t.img(s, await svgOnce(ctx, `gl${a}x${b}${fill}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${b}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF7AB6"/><stop offset="0.35" stop-color="#FFC95C"/><stop offset="0.65" stop-color="#58E0B5"/><stop offset="1" stop-color="#3EC1F3"/></linearGradient></defs><rect x="3" y="3" width="${a - 6}" height="${b - 6}" rx="${Math.min(b / 2 - 3, a / 2 - 3, 24)}" fill="#${fill}" fill-opacity="${op}" stroke="url(#g)" stroke-width="5"/></svg>`, a, b), x, y, w, ht); };
    const pill = async (s, x, y, w, ht, fill = 'ffffff', op = 0.74) => { const a = Math.round(w * 100), b = Math.round(ht * 100); t.img(s, await svgOnce(ctx, `pl${a}x${b}${fill}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${b}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF7AB6"/><stop offset="0.35" stop-color="#FFC95C"/><stop offset="0.65" stop-color="#58E0B5"/><stop offset="1" stop-color="#3EC1F3"/></linearGradient></defs><rect x="3" y="3" width="${a - 6}" height="${b - 6}" rx="${b / 2 - 3}" fill="#${fill}" fill-opacity="${op}" stroke="url(#g)" stroke-width="5"/></svg>`, a, b), x, y, w, ht); };
    const win = async (s, x, y, w, ht, bar = 0.28) => { // a little window from the screens of that time: rainbow bar, three dots
      t.rect(s, x, y, w, ht, 'FFFFFF', { t: 18, line: { color: C.ink, width: 1.25 }, shadow: 0.2, blur: 6, offset: 3, name: 'Window' });
      await rain(s, x + 0.01, y + 0.01, w - 0.02, bar); t.line(s, x, y + bar, w, 0, C.ink, 1.25);
      for (let k = 0; k < 3; k++) t.oval(s, x + w - 0.24 - k * 0.17, y + bar / 2 - 0.05, 0.1, 0.1, 'FFFFFF', { line: { color: C.ink, width: 0.75 } });
    };
    const sparkle = async (s, x, y, d, c = 'FFFFFF') => t.img(s, await svgOnce(ctx, 'spark' + c, `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M50,0 C54,36 64,46 100,50 C64,54 54,64 50,100 C46,64 36,54 0,50 C36,46 46,36 50,0 Z" fill="#${c}"/></svg>`, 100, 100), x, y, d, d);
    const dark = async (d) => { const s = await newSlide('focus'); t.rect(s, 0, 0, 10, 5.625, space, { name: 'Night' }); await K.marker(ctx, s, 0.5, 0.36, 0.7, ctx.idx, ctx.idx); t.text(s, d.title, { x: 1.4, y: 0.35, w: 8.05, h: 0.72, bold: true, color: ice, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.72, 28, 16, HF, true) }); metaFooter({ color: soft })(ctx, s); return s; };
    const V = {
      image: [
        async (d) => { // the picture in a soft liquid blob, a rainbow one behind it, chrome drops around
          const s = await page(d), blob = 'M0.5,0.02 C0.74,-0.02 0.98,0.14 0.98,0.4 C0.98,0.6 1.02,0.82 0.8,0.94 C0.6,1.04 0.4,0.94 0.22,0.9 C0.02,0.84 -0.02,0.62 0.04,0.42 C0.1,0.2 0.26,0.06 0.5,0.02 Z', x = 5.1, y = 1.2, w = 4.4, ht = 3.85;
          t.img(s, await svgOnce(ctx, 'blob', `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="385" viewBox="0 0 1 1" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient></defs><path d="${blob}" fill="url(#g)"/></svg>`, 440, 385), x, y, w, ht);
          t.img(s, await L.photo(L.src(d.image), w - 0.3, ht - 0.28, { mask: { path: blob } }), x + 0.15, y + 0.14, w - 0.3, ht - 0.28, { alt: '' });
          await marker(s, 8.95, 1.2, 0.5, 1, ''); await marker(s, 5.0, 4.45, 0.42, 2, '');
          body(s, d.text, 0.6, 1.35, 4.25, 3.6, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // the picture over everything, one frosted pane floating on it
          const s = await newSlide('focus');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.17, 10, 0.455, space, { name: 'Footer band' }); metaFooter({ color: ice })(ctx, s);
          await glass(s, 4.85, 0.35, 4.8, 4.6, '', 'ffffff', 0.9);
          await marker(s, 5.1, 0.55, 0.62, 0, ctx.idx);
          head(s, d.title, 5.82, 0.5, 3.6, 0.75, { max: 18 });
          body(s, d.text, 5.12, 1.35, 4.28, 3.45, { max: 14, k: 1.12, valign: 'middle' });
        },
        async (d) => { // two windows open on the desktop, the words overlapping the picture's corner
          const s = await page(d), x = 0.6, y = 1.25, w = 5.1, ht = 3.1, bar = 0.28;
          await win(s, x, y, w, ht, bar);
          t.img(s, await L.photo(L.src(d.image), w - 0.02, ht - bar - 0.02), x + 0.01, y + bar + 0.01, w - 0.02, ht - bar - 0.02, { alt: '' });
          await win(s, 4.6, 1.7, 4.8, 3.38, bar);
          t.rect(s, 4.61, 1.7 + bar + 0.01, 4.78, 3.08, 'FFFFFF', { name: 'Window body' });
          body(s, d.text, 4.75, 2.05, 4.5, 2.95, { max: 14, k: 1.1, valign: 'middle' });
        },
        async (d) => { // a long capsule of picture, the words on the frost below
          const s = await page(d), y = 1.25, ht = 1.85;
          await pill(s, 0.6, y, 8.8, ht, 'ffffff', 1);
          t.img(s, await L.photo(L.src(d.image), 8.6, ht - 0.2, { mask: { r: (ht - 0.2) / 2 } }), 0.7, y + 0.1, 8.6, ht - 0.2, { alt: '' });
          await sparkle(s, 8.75, y - 0.08, 0.5, 'FFFFFF');
          body(s, d.text, 0.75, 3.25, 8.5, 1.85, { max: 14, k: 1.1, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // capsules in a stack: a chrome ball at the end of each holds the icon
          const s = await page(d), n = d.items.length, g = 0.1, rh = (3.82 - g * (n - 1)) / n, top = 1.26, dd = Math.min(0.84, rh - 0.08);
          for (const [i, it] of d.items.entries()) {
            const y = top + i * (rh + g), ix = i % 2 ? 0.6 : 0.6;
            await pill(s, ix, y, 8.8, rh);
            await marker(s, ix + 0.08, y + (rh - dd) / 2, dd, i, '');
            t.img(s, await L.icon(it.icon, C.ink, 2), ix + 0.08 + dd / 2 - 0.16, y + rh / 2 - 0.16, 0.32, 0.32);
            head(s, it.h, ix + dd + 0.22, y + 0.05, 2.45, rh - 0.1, { max: 15 });
            body(s, it.t, ix + dd + 2.75, y + 0.06, 8.8 - dd - 3.1, rh - 0.12, { max: 13, valign: 'middle' });
          }
        },
        async (d) => { // windows left open at different heights, the icon on the bar of each
          const s = await page(d), n = d.items.length, g = 0.14, w = (8.8 - g * (n - 1)) / n, ht = 3.12, bar = 0.42;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + g), y = [1.25, 1.98, 1.55, 1.98][i];
            await win(s, x, y, w, ht, bar);
            t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.1, y + 0.07, 0.28, 0.28);
            head(s, it.h, x + 0.12, y + bar + 0.06, w - 0.24, 0.5, { max: 14, color: deep[i] });
            body(s, it.t, x + 0.12, y + bar + 0.58, w - 0.24, ht - bar - 0.64, { max: 13 });
          }
        },
        async (d) => { // a great chrome ball in the middle, the items orbit around it
          const s = await page(d), n = d.items.length, cw = 3.25, ch = 1.76, cell = n === 4 ? [[0.6, 1.26], [6.15, 1.26], [0.6, 3.32], [6.15, 3.32]] : [[0.6, 1.26], [6.15, 2.29], [0.6, 3.32]];
          t.oval(s, 3.6, 1.95, 2.8, 2.5, null, { line: { color: C.accent, width: 2, dashType: 'sysDot' }, name: 'Orbit' });
          await marker(s, 4.15, 2.35, 1.7, 0, '');
          await sparkle(s, 5.3, 2.2, 0.42, 'FFFFFF');
          for (const [i, it] of d.items.entries()) {
            const [x, y] = cell[i];
            await glass(s, x, y, cw, ch);
            await marker(s, x + 0.12, y + 0.08, 0.46, i + 1, '');
            t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.24, y + 0.2, 0.22, 0.22);
            head(s, it.h, x + 0.66, y + 0.08, cw - 0.8, 0.46, { max: 13.5 });
            body(s, it.t, x + 0.17, y + 0.58, cw - 0.34, ch - 0.68, { max: 12.5 });
          }
        },
        async (d) => { // the screen goes dark: neon panes in a block, a long one below when there are three
          const s = await dark(d), n = d.items.length, g = 0.14, w = (8.8 - g) / 2, ht = 1.82, y2 = 1.28 + ht + g, cell = n === 4 ? [[0.6, 1.28, w], [0.6 + w + g, 1.28, w], [0.6, y2, w], [0.6 + w + g, y2, w]] : [[0.6, 1.28, w], [0.6 + w + g, 1.28, w], [0.6, y2, 8.8]];
          for (const [i, it] of d.items.entries()) {
            const [x, y, cw] = cell[i], c = neon[i];
            await glass(s, x, y, cw, ht, '', spaceUp, 1);
            t.img(s, await L.icon(it.icon, c, 2), x + 0.2, y + 0.16, 0.36, 0.36);
            head(s, it.h, x + 0.68, y + 0.12, cw - 0.85, 0.44, { max: 15, color: c });
            body(s, it.t, x + 0.2, y + 0.62, cw - 0.4, ht - 0.72, { max: 13, color: ice });
          }
        },
      ],
      process: [
        async (d) => { // chrome balls floating up, one per step, a frosted column under each
          const s = await page(d), n = d.steps.length, g = 0.12, w = (8.8 - g * (n - 1)) / n, y0 = 2.05, yN = 3.1, floor = 5.08, dd = 0.7;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + g), y = yN - i * (yN - y0) / (n - 1);
            await glass(s, x, y, w, floor - y);
            await marker(s, x + w / 2 - dd / 2, y - dd + 0.14, dd, i, i + 1);
            head(s, st.h, x + 0.13, y + 0.16, w - 0.26, 0.48, { max: 14, color: deep[i], align: 'center' });
            body(s, st.t, x + 0.13, y + 0.66, w - 0.26, floor - y - 0.74, { max: 13, align: 'center' });
          }
        },
        async (d) => { // a rainbow tube down the page, the steps on either side of it in turn
          const s = await page(d), n = d.steps.length, w = 4.0, ch = 1.72, ys = n === 4 ? [1.28, 1.5, 3.34, 3.36] : [1.28, 2.3, 3.34], my = n === 4 ? [1.46, 2.38, 3.3, 4.22] : [1.84, 2.86, 3.9];
          await rain(s, 4.86, 1.25, 0.28, 3.85, 0.14);
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, x = right ? 5.4 : 0.6, y = ys[i];
            await glass(s, x, y, w, ch);
            await marker(s, 4.74, my[i], 0.52, i, i + 1);
            head(s, st.h, x + 0.2, y + 0.1, w - 0.4, 0.44, { max: 14, color: deep[i], align: right ? 'left' : 'right' });
            body(s, st.t, x + 0.2, y + 0.56, w - 0.4, ch - 0.66, { max: 13, align: right ? 'left' : 'right' });
          }
        },
        async (d) => { // one big window, a loading bar in segments across it, each step under its segment
          const s = await page(d), n = d.steps.length, x0 = 0.6, y0 = 1.25, W2 = 8.8, H2 = 3.85, bar = 0.3;
          await win(s, x0, y0, W2, H2, bar);
          t.rect(s, x0 + 0.01, y0 + bar + 0.01, W2 - 0.02, H2 - bar - 0.02, 'FFFFFF', { t: 10, name: 'Window body' });
          const w = (W2 - 0.4) / n;
          for (const [i, st] of d.steps.entries()) {
            const x = x0 + 0.2 + i * w;
            t.rect(s, x + 0.03, y0 + bar + 0.18, w - 0.06, 0.34, C.pal[i], { line: { color: C.ink, width: 1 }, name: 'Segment' });
            t.text(s, String(i + 1), { x: x + 0.03, y: y0 + bar + 0.18, w: w - 0.06, h: 0.34, bold: true, fontSize: 14, color: C.ink, align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.06, y0 + bar + 0.6, w - 0.14, 0.5, { max: 15 });
            body(s, st.t, x + 0.06, y0 + bar + 1.12, w - 0.14, H2 - bar - 1.22, { max: 14 });
          }
        },
      ],
      stats: [
        async (d) => { // three capsules: the figure in a rainbow end, its meaning beside it
          const s = await page(d), hh = d.note ? 0.86 : 1.18, g = 0.1, top = 1.26;
          for (const [i, x] of d.stats.entries()) {
            const y = top + i * (hh + g);
            await pill(s, 0.6, y, 8.8, hh);
            await rain(s, 0.66, y + 0.06, 3.0, hh - 0.12, (hh - 0.12) / 2);
            t.text(s, x.value, { x: 0.8, y: y + 0.06, w: 2.72, h: hh - 0.12, bold: true, fontSize: L.fit(x.value, 2.72, hh - 0.16, 36, 18, HF, true), color: C.ink, align: 'center', valign: 'middle' });
            body(s, x.label, 3.85, y + 0.06, 5.3, hh - 0.12, { max: 15, valign: 'middle' });
          }
          if (d.note) body(s, d.note, 0.75, 4.25, 8.5, 0.85, { max: 13, color: C.muted, valign: 'middle' });
        },
        async (d) => { // one figure huge on the dark screen, a chrome ball rising behind it, two small ones aside
          const s = await dark(d), [a, b, c] = d.stats, big = d.note ? 2.72 : 3.7;
          await marker(s, 4.25, 1.24, 0.82, 2, ''); await sparkle(s, 3.85, 1.3, 0.4, neon[1]);
          t.text(s, a.value, { x: 0.6, y: 1.95, w: 4.7, h: 1.1, bold: true, fontSize: L.fit(a.value, 4.7, 1.05, 66, 28, HF, true), color: ice, valign: 'middle' });
          body(s, a.label, 0.6, 3.08, 4.7, 0.85, { max: 15, color: neon[0] });
          for (const [i, x] of [b, c].entries()) {
            const y = 1.3 + i * 1.32;
            await glass(s, 5.55, y, 3.85, 1.22, '', spaceUp, 1);
            t.text(s, x.value, { x: 5.72, y: y + 0.08, w: 3.5, h: 0.56, bold: true, fontSize: L.fit(x.value, 3.5, 0.54, 28, 16, HF, true), color: neon[i + 1], valign: 'middle' });
            body(s, x.label, 5.72, y + 0.64, 3.5, 0.5, { max: 12, color: ice });
          }
          if (d.note) body(s, d.note, 0.85, 4.02, 8.55, 1.08, { max: 13, color: soft, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // two panes, the same shape turned to face each other, a chrome ball where they meet
          const s = await page(d), w = 3.85, n = Math.max(d.left.items.length, d.right.items.length), top = 1.98, av = 3.0, rh = av / n;
          const { fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.1, 'Calibri', 0.14, av);
          for (const [i, side] of [d.left, d.right].entries()) {
            const x = i ? 5.05 : 0.6;
            await glass(s, x, 1.26, 4.35, 3.85);
            head(s, side.h, i ? x + 0.5 : x + 0.2, 1.36, w, 0.56, { max: 18, color: deep[i ? 1 : 0], align: i ? 'left' : 'right' });
            for (const [j, v] of side.items.entries()) t.text(s, v, { x: i ? x + 0.5 : x + 0.2, y: top + j * rh, w: w - 0.1, h: rh, fontSize: fs, align: i ? 'left' : 'right', valign: 'middle' });
          }
          await marker(s, 4.55, 2.7, 0.9, 0, '');
        },
        async (d) => { // two rainbow-rimmed capsules, one over the other, the name on a gleaming end
          const s = await page(d), hh = 1.84;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.26 + i * (hh + 0.12), n = side.items.length, rws = Math.ceil(n / 2), rh = (hh - 0.2) / rws, w = 3.12;
            await glass(s, 0.6, y, 8.8, hh);
            await rain(s, 0.67, y + 0.07, 2.15, hh - 0.14, 0.2);
            head(s, side.h, 0.78, y + 0.14, 1.93, hh - 0.28, { max: 17, align: 'center' });
            const fs = Math.min(...side.items.map((v) => L.fit(v, w - 0.22, rh - 0.04, 13, 10, 'Calibri')));
            for (const [j, v] of side.items.entries()) {
              const x = 2.95 + (j % 2) * (w + 0.06), yy = y + 0.1 + Math.floor(j / 2) * rh;
              await sparkle(s, x, yy + rh / 2 - 0.08, 0.16, C.pal[i ? 1 : 0]);
              t.text(s, v, { x: x + 0.21, y: yy, w: w - 0.22, h: rh, fontSize: fs, valign: 'middle' });
            }
          }
        },
      ],
      statement: [
        async (d) => { // sparkles on the dark screen, the sentence in the middle of them
          const s = await dark(d);
          for (const [x, y, dd, c] of [[0.6, 1.3, 0.5, neon[1]], [9.0, 1.4, 0.36, neon[0]], [8.5, 4.5, 0.55, neon[3]], [0.9, 4.45, 0.3, neon[2]]]) await sparkle(s, x, y, dd, c);
          t.text(s, L.runs(d.text), { x: 1.3, y: 1.42, w: 7.4, h: 2.1, bold: true, fontSize: L.fit(d.text, 7.4, 2.05, 32, 16, HF, true), color: ice, align: 'center', valign: 'middle' });
          if (d.caption) body(s, d.caption, 1.5, 3.62, 7.0, 1.42, { max: 14, color: soft, align: 'center' });
        },
        async (d) => { // a holographic sticker, tilted square on the page's side, the remark in a frosted pane beside it
          const s = await page(d, 'focus');
          await rain(s, 0.6, 1.26, 5.6, 3.85, 0.28);
          await sparkle(s, 5.4, 1.36, 0.6);
          t.text(s, L.runs(d.text), { x: 0.9, y: 1.5, w: 4.9, h: 3.4, bold: true, fontSize: L.fit(d.text, 4.9, 3.35, 32, 16, HF, true), color: C.ink, valign: 'middle' });
          if (d.caption) { await glass(s, 6.4, 1.26, 3.0, 3.85); body(s, d.caption, 6.58, 1.4, 2.64, 3.58, { max: 14, valign: 'middle' }); }
        },
      ],
      timeline: [
        async (d) => { // a rainbow tube bending across the page, dates above and below in turn
          const s = await page(d), hh = 1.62, up = 1.26, dn = 3.5, ty = 3.03;
          await rain(s, 0.6, ty, 8.8, 0.26, 0.13);
          for (const [i, it] of d.items.entries()) {
            const above = i % 2 === 0, x = 0.6 + (i >> 1) * 4.45 + (above ? 0 : 0.5), cw = 3.85, y = above ? up : dn;
            await marker(s, above ? x + 0.02 : x + cw - 0.56, ty - 0.14, 0.54, i, '');
            head(s, it.year, x, y, 1.45, 0.42, { max: 18, color: deep[i] });
            head(s, it.h, x + 1.5, y, cw - 1.5, 0.42, { max: 13 });
            body(s, it.t, x, y + 0.44, cw, hh - 0.46, { max: 13 });
          }
        },
        async (d) => { // windows cascading down the desktop, the date on each one's bar
          const s = await page(d), w = 5.3, hh = 0.9, bar = 0.28, sx = (8.8 - w) / 3, sy = 0.95;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * sx, y = 1.25 + i * sy;
            await win(s, x, y, w, hh, bar);
            t.rect(s, x + 0.01, y + bar + 0.01, w - 0.02, hh - bar - 0.02, 'FFFFFF', { name: 'Window body' });
            t.text(s, [{ text: it.year + '   ', options: { bold: true } }, { text: it.h, options: { bold: true, color: C.muted } }], { x: x + 0.1, y, w: w - 0.8, h: bar, fontFace: HF, fontSize: 11.5, color: C.ink, valign: 'middle' });
            body(s, it.t, x + 0.1, y + bar + 0.03, w - 0.2, hh - bar - 0.05, { max: 11.5, valign: 'middle' });
          }
        },
      ],
    };
    R.image = V.image.shift();
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    await K.marker(ctx, s, 8.2, 0.2, 1.4, 1, ''); await K.marker(ctx, s, 5.6, 3.9, 1.0, 2, '');
    if (d.image) await K.photo(ctx, s, d.image, 6.2, 1.0, 2.9, 2.9);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2726  '), { x: 0.6, y: 0.65, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 1.0, w: 5.1, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.1, 2.1, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.3, w: 4.9, h: 0.75, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.2, w: 4.9, h: 0.45, fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 88, slug: 'hologramma', name: 'Hologramma', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "zamonaviy va o'ynoqi: yangi avlod tili, qisqa va yorqin iboralar", limits: {}, prefer: 'visual' } };
