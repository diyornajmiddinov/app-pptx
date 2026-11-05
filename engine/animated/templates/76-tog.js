/** 76 Tog' — mountains: layered peaks with snow caps, altitude markers as flags, a summit route. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: 'F2F5F8', ink: '1E2B3A', muted: '596B7E', accent: 'D9534F', pal: ['3C5A7A', '5E7FA3', 'D9534F', '8AA4C1', '2A3F57', 'E59866'] };
const peaks = (h, base, op = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}" opacity="${op}">
  <polygon points="0,${base} 220,${base - 220} 380,${base - 120} 620,${base - 330} 860,${base - 140} 1080,${base - 280} 1300,${base - 110} 1460,${base - 230} 1600,${base - 150} 1600,${h} 0,${h}" fill="#8AA4C1"/>
  <polygon points="560,${base - 300} 620,${base - 330} 680,${base - 290} 650,${base - 280} 620,${base - 300} 590,${base - 282}" fill="#fff"/><polygon points="1040,${base - 255} 1080,${base - 280} 1125,${base - 248} 1080,${base - 258}" fill="#fff"/>
  <polygon points="0,${base + 40} 300,${base - 130} 520,${base - 20} 760,${base - 190} 1000,${base} 1240,${base - 160} 1600,${base + 10} 1600,${h} 0,${h}" fill="#5E7FA3"/>
  <polygon points="0,${base + 120} 400,${base - 10} 800,${base + 90} 1200,${base - 30} 1600,${base + 80} 1600,${h} 0,${h}" fill="#3C5A7A"/></svg>`;
const flag = (c) => `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120"><rect x="18" y="8" width="5" height="108" fill="#1E2B3A"/><polygon points="23,10 92,30 23,52" fill="#${c}"/></svg>`;
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme("Tog'", C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'tiles', timeline: 'line' },
  area: { x: 0.6, y: 1.35, w: 8.8, h: 3.15 },
  bg: async (ctx, s, kind) => { s.background = { color: kind === 'hero' ? 'E4ECF4' : C.bg }; if (kind === 'hero') ctx.t.img(s, await svgOnce(ctx, 'hero', peaks(900, 620), 1600, 900), 0, 0, 10, 5.625); else ctx.t.img(s, await svgOnce(ctx, 'band', peaks(260, 170, 0.9), 1600, 260), 0, 4.55, 10, 1.075); },
  panel: (ctx, s, x, y, w, h, k, o) => ctx.t.rect(s, x, y, w, h, 'FFFFFF', { r: 0.06, line: { color: 'C9D4E0', width: 1 }, shadow: 0.18, blur: 8, offset: 3, name: 'Card' }),
  marker: async (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, C.pal[k % 6], { line: { color: 'FFFFFF', width: 2 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h, { mask: { poly: [[0, 0.12], [0.3, 0], [0.55, 0.08], [0.8, 0], [1, 0.1], [1, 1], [0, 1]] } }), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.accent, 2, { dash: 'sysDot' }),
  axis: (ctx, s, x, y, w) => ctx.t.line(s, x, y + 0.17, w, 0, C.ink, 1.5),
  title: async (ctx, s, d) => { const { t, L } = ctx; t.img(s, await svgOnce(ctx, 'flag' + (ctx.idx % 6), flag(C.pal[ctx.idx % 6]), 100, 120), 0.45, 0.28, 0.65, 0.78); t.text(s, String(ctx.idx), { x: 0.6, y: 0.33, w: 0.45, h: 0.32, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); if (d.title) t.text(s, d.title, { x: 1.3, y: 0.35, w: 8.15, h: 0.72, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.15, 0.72, 28, 16, 'Arial', true) }); },
  footer: metaFooter({ color: 'FFFFFF', y: 5.3 }),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const slate = '1E2B3A', ice = 'E4ECF4', red = C.accent, blue = '3C5A7A', range = async (s) => t.img(s, await svgOnce(ctx, 'band', peaks(260, 170, 0.9), 1600, 260), 0, 4.55, 10, 1.075), foot = metaFooter({ color: 'FFFFFF', y: 5.3 });
    const peak = async (s, x, y, w, h2, c = blue, cap = true) => t.img(s, await svgOnce(ctx, 'pk' + c + cap, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><polygon points="200,0 400,300 0,300" fill="#${c}"/>${cap ? '<polygon points="200,0 262,93 226,78 200,104 172,78 138,93" fill="#fff"/>' : ''}</svg>`, 400, 300), x, y, w, h2);
    const pennant = async (s, x, y, w, h2, c = red) => t.img(s, await svgOnce(ctx, 'pen' + c, `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><polygon points="0,0 300,0 262,50 300,100 0,100" fill="#${c}"/></svg>`, 300, 100), x, y, w, h2);
    const flagOn = async (s, x, y, d, c = red) => t.img(s, await svgOnce(ctx, 'flag' + c, flag(c), 100, 120), x, y, d, d * 1.2);
    const contours = async (s, x, y, w, h2, c = 'E3EAF1') => { let g = ''; for (const [cx, cy, n] of [[280, 170, 6], [900, 300, 6], [1300, 90, 4]]) for (let k = 1; k <= n; k++) g += `<ellipse cx="${cx}" cy="${cy}" rx="${k * 62}" ry="${k * 40}" transform="rotate(${-14 + k * 3} ${cx} ${cy})"/>`; t.img(s, await svgOnce(ctx, 'topo' + c, `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="600"><g fill="none" stroke="#${c}" stroke-width="2.5">${g}</g></svg>`, 1600, 600), x, y, w, h2); };
    const night = async (d) => { // the same range after dark
      const s = await newSlide('focus'); let st = '', x0 = 5; const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280);
      for (let k = 0; k < 60; k++) st += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 740).toFixed(0)}" r="${(0.8 + rnd() * 1.6).toFixed(1)}" fill="#fff" opacity="${(0.3 + rnd() * 0.5).toFixed(2)}"/>`;
      t.img(s, await svgOnce(ctx, 'stars', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${slate}"/>${st}</svg>`, 1600, 900), 0, 0, 10, 5.625);
      await range(s); await flagOn(s, 0.45, 0.28, 0.65, C.pal[ctx.idx % 6]);
      t.text(s, String(ctx.idx), { x: 0.6, y: 0.33, w: 0.45, h: 0.32, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      if (d.title) t.text(s, d.title, { x: 1.3, y: 0.35, w: 8.15, h: 0.72, bold: true, color: ice, valign: 'middle', fontSize: L.fit(d.title, 8.15, 0.72, 28, 16, 'Arial', true) });
      foot(ctx, s); return s;
    };
    const V = {
      image: [
        async (d) => { // the picture is one mountain with a snow cap on it
          const s = await page(d), w = 4.2, ht = 3.08, x = 5.2, y = 1.47;
          t.img(s, await L.photo(L.src(d.image), w, ht, { mask: { poly: [[0.5, 0], [1, 1], [0, 1]] } }), x, y, w, ht, { alt: '' });
          t.img(s, await svgOnce(ctx, 'cap', `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="240"><polygon points="150,0 300,240 244,212 196,240 150,202 104,240 56,212 0,240" fill="#fff"/></svg>`, 300, 240), x + w / 2 - w * 0.13, y - 0.02, w * 0.26, ht * 0.26);
          await flagOn(s, x + w / 2 - 0.08, y - 0.38, 0.36);
          body(s, d.text, 0.6, 1.25, 4.5, 3.25, { max: 15, k: 1.15, valign: 'middle' });
        },
        async (d) => { // the page is the picture, the range stands in front, a white card holds the words
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.15, 10, 0.475, blue, { name: 'Footer ground' }); await range(s);
          await panel(s, 0.45, 0.3, 5.3, 4.45, 0);
          t.rect(s, 0.45, 0.3, 0.09, 4.45, red, { name: 'Trail mark' });
          head(s, d.title, 0.78, 0.42, 4.75, 0.9, { max: 22 });
          body(s, d.text, 0.78, 1.35, 4.75, 3.3, { max: 15, k: 1.12, valign: 'middle' });
          foot(ctx, s);
        },
        async (d) => { // a compass: the picture in the bezel, ticks round it, the needle over it
          const s = await page(d), dia = 3.0, x = 0.95, y = 1.32, cx = x + dia / 2, cy = y + dia / 2; let tk = '';
          for (let k = 0; k < 36; k++) tk += `<line x1="200" y1="${k % 9 ? 8 : 2}" x2="200" y2="20" transform="rotate(${k * 10} 200 200)"/>`;
          t.oval(s, x - 0.22, y - 0.22, dia + 0.44, dia + 0.44, slate);
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
          t.img(s, await svgOnce(ctx, 'bezel', `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><g stroke="#fff" stroke-width="3">${tk}</g><polygon points="200,28 216,200 184,200" fill="#${red}"/><polygon points="200,372 216,200 184,200" fill="#${ice}"/><circle cx="200" cy="200" r="16" fill="#${slate}"/></svg>`, 400, 400), cx - dia / 2 - 0.22, cy - dia / 2 - 0.22, dia + 0.44, dia + 0.44);
          body(s, d.text, 4.65, 1.25, 4.75, 3.25, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // dusk: words in the dark sky, the picture rises behind them as a jagged ridge
          const s = await night(d);
          t.img(s, await L.photo(L.src(d.image), 10, 2.55, { mask: { poly: [[0, 0.42], [0.14, 0.1], [0.26, 0.38], [0.42, 0], [0.56, 0.32], [0.72, 0.06], [0.86, 0.36], [1, 0.14], [1, 1], [0, 1]] } }), 0, 2.9, 10, 2.55, { alt: '' });
          t.rect(s, 0, 5.22, 10, 0.405, slate, { name: 'Footer band' });
          body(s, d.text, 0.6, 1.1, 8.8, 1.75, { color: ice, max: 14, k: 1.08, valign: 'middle' });
          foot(ctx, s);
        },
      ],
      cards: [
        async (d) => { // a summit for each item, its icon on the slope, the words at its foot
          const s = await page(d), n = d.items.length, cw = 8.8 / n, pw = Math.min(1.9, cw - 0.2), H0 = [1.1, 1.28];
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, ph = H0[i % 2], py = 2.42 - ph, cx = x + cw / 2;
            await peak(s, cx - pw / 2, py, pw, ph, C.pal[[0, 4, 1, 4][i]], false);
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), cx - 0.2, 1.87, 0.4, 0.4);
            head(s, it.h, x + 0.08, 2.46, cw - 0.16, 0.42, { align: 'center', color: red });
            body(s, it.t, x + 0.12, 2.88, cw - 0.24, 1.66, { align: 'center' });
          }
        },
        async (d) => { // the climbers' map: contour lines on paper, each item a pin on it
          const s = await page(d), n = d.items.length, w = 4.25, hh = 1.6;
          t.rect(s, 0.45, 1.15, 9.1, 3.42, 'FFFFFF', { line: { color: 'C9D4E0', width: 1 }, shadow: 0.18, blur: 8, offset: 3, name: 'Map' });
          await contours(s, 0.45, 1.15, 9.1, 3.42);
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.3), y = 1.22 + Math.floor(i / 2) * (hh + 0.05);
            t.oval(s, x, y + 0.05, 0.58, 0.58, red, { line: { color: 'FFFFFF', width: 2 } }); t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.14, y + 0.19, 0.3, 0.3);
            head(s, it.h, x + 0.68, y + 0.03, ww - 0.75, 0.38, { max: 15 });
            body(s, it.t, x + 0.68, y + 0.42, ww - 0.78, hh - 0.46, { max: 13 });
          }
        },
        async (d) => { // rows flying from one mast: every item is a pennant with its icon
          const s = await page(d), n = d.items.length, rh = 3.28 / n;
          t.rect(s, 0.6, 1.2, 0.08, 3.35, slate, { name: 'Mast' });
          for (const [i, it] of d.items.entries()) {
            const y = 1.25 + i * rh, ph = rh - 0.14;
            await pennant(s, 0.68, y, 3.15, ph, C.pal[[2, 0, 4, 1][i]]);
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), 0.85, y + ph / 2 - 0.16, 0.32, 0.32);
            head(s, it.h, 1.28, y + 0.03, 1.98, ph - 0.06, { color: 'FFFFFF', max: 14 });
            body(s, it.t, 4.0, y, 5.4, ph, { valign: 'middle', max: 13.5 });
          }
        },
        async (d) => { // roped together: cards at two heights, the rope running from one to the next
          const s = await page(d), n = d.items.length, gap = 0.2, w = (8.8 - gap * (n - 1)) / n, hh = 2.72;
          const Y = (i) => (i % 2 ? 1.84 : 1.2);
          for (let i = 0; i < n - 1; i++) { const x1 = 0.6 + i * (w + gap) + w / 2, x2 = x1 + w + gap, y1 = Y(i) + 0.3, y2 = Y(i + 1) + 0.3; t.line(s, x1, Math.min(y1, y2), x2 - x1, Math.abs(y2 - y1), red, 2, { flipV: y2 < y1, name: 'Rope' }); }
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = Y(i);
            await panel(s, x, y, w, hh, i);
            await marker(s, x + w / 2 - 0.3, y + 0.05, 0.6, i, '');
            t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + w / 2 - 0.15, y + 0.2, 0.3, 0.3);
            head(s, it.h, x + 0.12, y + 0.68, w - 0.24, 0.42, { align: 'center', max: 14 });
            body(s, it.t, x + 0.14, y + 1.1, w - 0.28, hh - 1.18, { align: 'center', max: 13 });
          }
        },
      ],
      process: [
        async (d) => { // the route to the top: camps climb the great slope, a flag waits at the last
          const s = await page(d), n = d.steps.length, gap = 0.12, w = (8.8 - gap * (n - 1)) / n, rise = n === 4 ? 0.3 : 0.42, ch = 2.15, X = (i) => 0.6 + i * (w + gap), Y = (i) => 2.4 - i * rise;
          await peak(s, 2.2, 1.05, 7.8, 3.6, 'D8E2EC', false);
          t.line(s, X(0) + w / 2, Y(n - 1) - 0.14 + 0.3, X(n - 1) - X(0), Y(0) - Y(n - 1), red, 2, { dash: 'sysDot', flipV: true, name: 'Route' });
          for (const [i, st] of d.steps.entries()) {
            const x = X(i), y = Y(i);
            await panel(s, x, y, w, ch, i);
            await marker(s, x + 0.1, y + 0.08, 0.46, i, i + 1);
            head(s, st.h, x + 0.62, y + 0.04, w - 0.72, 0.56, { max: 13, color: red });
            body(s, st.t, x + 0.13, y + 0.62, w - 0.26, ch - 0.68, { max: 13 });
            if (i === n - 1) await flagOn(s, x + w - 0.56, y - 0.45, 0.42);
          }
        },
        async (d) => { // an altitude gauge: read upward, the first step at its foot, the last at its head
          const s = await page(d), n = d.steps.length, rh = 3.3 / n; let tk = '';
          for (let k = 0; k <= 40; k++) tk += `<line x1="${k % 5 ? 28 : 12}" x2="50" y1="${k * 10 + 2}" y2="${k * 10 + 2}"/>`;
          t.img(s, await svgOnce(ctx, 'gauge', `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="404"><g stroke="#${slate}" stroke-width="2">${tk}</g></svg>`, 50, 404), 0.6, 1.22, 0.3, 3.32);
          for (const [i, st] of d.steps.entries()) {
            const y = 1.22 + (n - 1 - i) * rh, cc = ['5E7FA3', '4A6A8E', '3C5A7A', C.accent][i + (n === 3 ? 1 : 0)];
            t.rect(s, 0.98, y + 0.03, 8.42, rh - 0.06, cc, { name: 'Altitude band' });
            t.text(s, String(i + 1), { x: 1.05, y: y + 0.03, w: 0.6, h: rh - 0.06, bold: true, fontSize: 24, color: 'FFFFFF', align: 'center', valign: 'middle' });
            head(s, st.h, 1.7, y + 0.05, 2.35, rh - 0.1, { color: 'FFFFFF', max: 15 });
            body(s, st.t, 4.15, y + 0.05, 5.15, rh - 0.1, { color: 'FFFFFF', valign: 'middle', max: 13 });
          }
        },
        async (d) => { // a ridge of chevrons walking to the right, the words beneath each
          const s = await page(d), n = d.steps.length, cw = 8.8 / n;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * cw;
            t.shape(s, 'CHEVRON', { x: x - 0.02, y: 1.2, w: cw + 0.08, h: 0.92, fill: { color: i === n - 1 ? red : C.pal[[4, 0, 1][i % 3]] }, objectName: 'Ridge' });
            t.text(s, String(i + 1), { x: x + 0.3, y: 1.2, w: cw - 0.5, h: 0.92, bold: true, fontSize: 26, color: 'FFFFFF', align: 'center', valign: 'middle' });
            head(s, st.h, x + 0.06, 2.22, cw - 0.2, 0.5, { max: 15, color: i === n - 1 ? red : C.ink });
            body(s, st.t, x + 0.06, 2.74, cw - 0.22, 1.8, { max: 14 });
          }
        },
      ],
      stats: [
        async (d) => { // three peaks of one height: their names are their numbers
          const s = await page(d), cw = 8.8 / 3, pw = 2.75, ph = 1.9;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * cw + (cw - pw) / 2;
            await peak(s, px, 1.15, pw, ph, C.pal[[0, 4, 1][i]]);
            t.text(s, x.value, { x: px + 0.45, y: 2.25, w: pw - 0.9, h: 0.72, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(x.value, pw - 0.95, 0.7, 30, 14, 'Arial', true) });
            body(s, x.label, 0.6 + i * cw + 0.12, 3.08, cw - 0.24, 0.58, { align: 'center', max: 13 });
          }
          if (d.note) body(s, d.note, 0.6, 3.68, 8.8, 0.84, { color: C.muted, valign: 'middle', align: 'center', max: 12.5 });
        },
        async (d) => { // the summit plate: a dark slab with the main number, its flag flying, the rest beside it
          const s = await page(d), [a, ...rest] = d.stats;
          t.rect(s, 0.6, 1.25, 4.0, 3.3, slate, { r: 0.06, name: 'Summit plate' });
          await flagOn(s, 3.72, 1.32, 0.68);
          t.text(s, a.value, { x: 0.8, y: 1.75, w: 3.6, h: 1.2, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.5, 1.15, 56, 22, 'Arial', true) });
          body(s, a.label, 1.1, 3.0, 3.0, 1.35, { align: 'center', color: ice, max: 15 });
          for (const [i, x] of rest.entries()) {
            const y = 1.25 + i * 0.98;
            t.text(s, x.value, { x: 4.9, y, w: 1.85, h: 0.85, bold: true, color: red, valign: 'middle', fontSize: L.fit(x.value, 1.8, 0.8, 28, 14, 'Arial', true) });
            body(s, x.label, 6.8, y + 0.05, 2.6, 0.75, { valign: 'middle', max: 13 });
            t.line(s, 4.9, y + 0.91, 4.5, 0, 'C9D4E0', 1);
          }
          if (d.note) body(s, d.note, 4.9, 3.25, 4.5, 1.3, { color: C.muted, valign: 'middle', max: 13 });
        },
      ],
      compare: [
        async (d) => { // two sides of one mountain: the rows go down its two slopes, mirrored
          const s = await page(d), w = 4.1;
          await peak(s, 1.0, 1.08, 8.0, 3.5, 'DCE5EE', false);
          t.line(s, 5, 1.32, 0, 3.2, red, 1.5, { dash: 'sysDot' });
          await flagOn(s, 4.97, 1.0, 0.45);
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14.5, w - 0.1, 'Calibri', 0.2, 2.55);
          head(s, d.left.h, 0.6, 1.3, w, 0.5, { align: 'right', max: 18, color: red }); head(s, d.right.h, 5.3, 1.3, w, 0.5, { max: 18, color: blue });
          let y = 1.92;
          for (const [k, rh] of rows.entries()) {
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.6, y, w: w - 0.1, h: rh, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.4, y, w: w - 0.1, h: rh, fontSize: fs, color: C.ink });
            y += rh;
          }
        },
        async (d) => { // two ranges, near and far: each ridge carries one side
          const s = await page(d);
          const ridge = async (y, ht, c, key) => t.img(s, await svgOnce(ctx, 'rg' + key, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="200" preserveAspectRatio="none"><polygon points="0,36 90,4 190,34 310,8 430,38 560,0 700,32 830,6 1000,34 1000,200 0,200" fill="#${c}"/></svg>`, 1000, 200), 0, y, 10, ht);
          await ridge(1.1, 1.82, 'B8CADD', 'a'); await ridge(2.72, 1.85, slate, 'b');
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = i ? 2.98 : 1.42, n = side.items.length, cw = 8.8 / n, ink = i ? 'FFFFFF' : C.ink;
            head(s, side.h, 0.6, y - 0.02, 8.8, 0.38, { max: 16, color: i ? 'F5B7B1' : '1E3F66' });
            for (const [k, it] of side.items.entries()) {
              const x = 0.6 + k * cw;
              if (k) t.line(s, x - 0.07, y + 0.42, 0, 0.82, i ? '5E7FA3' : blue, 1);
              body(s, it, x, y + 0.38, cw - 0.16, 0.92, { color: ink, max: 14 });
            }
          }
        },
      ],
      statement: [
        async (d) => { // a clear night over the range, the thought among the stars
          const s = await night(d);
          t.oval(s, 8.05, 1.2, 0.8, 0.8, 'F7F1D5'); t.oval(s, 8.25, 1.12, 0.72, 0.72, slate);
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.15, w: 7.2, h: 2.15, fontFace: 'Arial', bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 7.2, 2.1, 34, 16, 'Arial', true) });
          t.rect(s, 0.6, 3.36, 1.0, 0.05, red, { name: 'Mark' });
          if (d.caption) body(s, d.caption, 0.6, 3.48, 8.8, 1.05, { color: ice, max: 13 });
        },
        async (d) => { // the banner planted on the summit: the thought is written on the flag
          const s = await page(d);
          await peak(s, 0.2, 2.9, 2.9, 1.8, blue);
          t.rect(s, 1.6, 1.16, 0.07, 2.05, slate, { name: 'Pole' });
          t.rect(s, 1.67, 1.2, 7.73, 1.92, red, { name: 'Banner' });
          t.text(s, L.runs(d.text), { x: 1.92, y: 1.27, w: 7.25, h: 1.78, fontFace: 'Arial', bold: true, color: 'FFFFFF', valign: 'middle', fontSize: L.fit(d.text, 7.25, 1.74, 28, 14, 'Arial', true) });
          if (d.caption) body(s, d.caption, 3.25, 3.25, 6.15, 1.28, { valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // a ridge climbing to the right: a flag at each year, the words below it
          const s = await page(d), cw = 2.2, Y = [2.38, 2.1, 1.82, 1.54]; let pts = '0,240 ';
          for (let i = 0; i < 4; i++) pts += `${(0.6 + (i + 0.08) * cw) * 100},${Y[i] * 100 - 110} `;
          t.img(s, await svgOnce(ctx, 'climb', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="150"><polygon points="${pts}1000,10 1000,150 0,150" fill="#CBD8E5"/><polyline points="${pts}1000,10" fill="none" stroke="#${blue}" stroke-width="4"/></svg>`, 1000, 150), 0, 1.1, 10, 1.5);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, fy = Y[i] - 0.5;
            await flagOn(s, x + 0.1, fy, 0.44, C.pal[[0, 4, 1, 2][i]]);
            head(s, it.year, x + 0.58, fy - 0.03, cw - 0.6, 0.38, { color: red, max: 17 });
            head(s, it.h, x, 2.64, cw - 0.15, 0.44, { max: 14 });
            body(s, it.t, x, 3.08, cw - 0.2, 1.46, { max: 14 });
          }
        },
        async (d) => { // a fixed rope down the face: years held by a ring on either side
          const s = await page(d), w = 3.85;
          t.line(s, 5, 1.15, 0, 3.4, red, 2.5, { name: 'Rope' });
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.2 + Math.floor(i / 2) * 1.68 + (right ? 0.28 : 0), x = right ? 5.5 : 0.65, a = right ? 'left' : 'right';
            const ry = y + (right ? 0.2 : 0.08);
            t.oval(s, 4.82, ry, 0.36, 0.36, 'FFFFFF', { line: { color: slate, width: 3 } });
            t.line(s, right ? 5.18 : 4.5, ry + 0.18, 0.32, 0, slate, 1.5);
            head(s, it.year, x, y, w, 0.38, { align: a, color: red, max: 18 });
            head(s, it.h, x, y + 0.38, w, 0.28, { align: a, max: 13 });
            body(s, it.t, x, y + 0.68, w, 0.92, { align: a, max: 13 });
          }
        },
        async (d) => { // white cards on the snow, the year flown from each on a red pennant
          const s = await page(d), w = 4.3, hh = 1.58;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + (i % 2) * (w + 0.2), y = 1.22 + Math.floor(i / 2) * (hh + 0.12);
            await panel(s, x, y, w, hh, i);
            await pennant(s, x, y + 0.12, 1.65, 0.45, C.pal[[2, 4, 0, 1][i]]);
            t.text(s, it.year, { x: x + 0.08, y: y + 0.12, w: 1.25, h: 0.45, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.22, 0.4, 15, 9, 'Arial', true) });
            head(s, it.h, x + 1.72, y + 0.12, w - 1.85, 0.45, { max: 14 });
            body(s, it.t, x + 0.18, y + 0.64, w - 0.36, hh - 0.7, { max: 13 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.timeline = V.timeline.shift(); // the original line of years looked like the process row
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    t.rect(s, 0.35, 0.38, 5.95, 3.42, 'F2F5F8', { t: 10, r: 0.06, name: 'Text ground' }); // the peaks ran behind the subtitle
    if (d.image) await K.photo(ctx, s, d.image, 6.3, 0.5, 3.2, 2.5);
    t.text(s, `\u25B2 ${[M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ')}`, { x: 0.6, y: 0.5, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: C.accent });
    t.text(s, d.title, { x: 0.6, y: 0.85, w: 5.5, h: 1.75, bold: true, fontSize: L.fit(d.title, 5.5, 1.7, 40, 20, 'Arial', true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 2.65, w: 5.4, h: 0.6, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 3.25, w: 5.4, h: 0.4, fontSize: 16, bold: true, color: C.ink });
    metaFooter({ color: 'FFFFFF', y: 5.3 })(ctx, s);
  },
};
module.exports = { id: 76, slug: 'tog', name: "Toğ", category: 'business', photos: true, build: (c, o) => run(c, o, K), style: { tone: "maqsadga intilish: cho'qqi, bosqich va natija; qat'iy va ilhomlantiruvchi", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "energetic"], "transitions": ["p14:pan|dir=\"u\"", "fade", "p14:flythrough|dir=\"in\""], "cover": ["riseWords", "focusIn"], "mark": "riseSettle", "deco": "peekUp", "sig": {"title": "peekUp", "body": "fadeUp", "item": "riseSettle", "image": "peekUp", "number": "riseSettle", "order": "seq", "stagger": 0.18}, "tempo": 1.1, "kenburns": true};
