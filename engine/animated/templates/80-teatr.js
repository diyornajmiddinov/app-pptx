/** 80 Teatr — theatre: red velvet curtains, a stage with spotlight, gold proscenium frame, ticket-stub markers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '1A0E10', ink: 'FFF4E0', muted: 'D9C3A5', accent: 'E2B04A', pal: ['E2B04A', 'B3202F', 'F0E1C0', 'C9773C', '8C1C26', 'FFD27A'] };
const curtain = (w, h, side) => { let f = ''; for (let k = 0; k < 9; k++) f += `<rect x="${k * w / 9}" y="0" width="${w / 18}" height="${h}" fill="#000" opacity="0.18"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A0F1C"/><stop offset="0.5" stop-color="#B3202F"/><stop offset="1" stop-color="#7A0F1C"/></linearGradient></defs><path d="M0,0 L${w},0 L${w},${h} ${side ? `Q${w * 0.3},${h * 0.7} 0,${h}` : `Q${w * 0.7},${h * 0.7} 0,${h}`} Z" fill="url(#g)"/>${f}</svg>`; };
const stage = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="spot" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="#3A2228"/><stop offset="1" stop-color="#140A0C"/></radialGradient></defs><rect width="1600" height="900" fill="url(#spot)"/><polygon points="700,0 900,0 1250,900 350,900" fill="#FFF1C8" opacity="0.06"/><rect y="0" width="1600" height="34" fill="#8C1C26"/><path d="M0,34 ${Array.from({ length: 20 }, (_, k) => `Q${k * 80 + 40},70 ${k * 80 + 80},34`).join(' ')}" fill="#8C1C26"/></svg>`;
const K = {
  F: { head: 'Cambria', body: 'Calibri' }, C, theme: theme('Teatr', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'row', stats: 'markers', timeline: 'columns' },
  area: { x: 0.75, y: 1.45, w: 8.5, h: 3.5 },
  bg: async (ctx, s, kind) => { ctx.curtained = kind !== 'page'; s.background = { data: await svgOnce(ctx, 'stage', stage(), 1600, 900, true) }; if (kind !== 'page') { ctx.t.img(s, await svgOnce(ctx, 'cl', curtain(260, 900, 0), 260, 900), -0.2, 0, 1.6, 5.625); ctx.t.img(s, await svgOnce(ctx, 'cr', curtain(260, 900, 1), 260, 900), 8.6, 0, 1.6, 5.625); } },
  panel: (ctx, s, x, y, w, h, k, o) => { ctx.t.rect(s, x, y, w, h, '2A1519', { t: 5, line: { color: C.accent, width: 1.5 }, name: 'Programme card' }); ctx.t.rect(s, x + 0.06, y + 0.06, w - 0.12, h - 0.12, null, { line: { color: C.accent, width: 0.5 }, name: 'Gilt line' }); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, k % 2 ? 'B3202F' : C.accent, { line: { color: 'FFF1C8', width: 1.5 } }); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontFace: 'Cambria', fontSize: Math.round(d * 24), bold: true, color: k % 2 ? 'FFF4E0' : '2A1519', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.14, y - 0.14, w + 0.28, h + 0.28, C.accent, { name: 'Proscenium' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); },
  connector: (ctx, s, x, y, w) => ctx.t.line(s, x, y, w, 0, C.accent, 1.5, { dash: 'dash' }),
  title: (ctx, s, d) => { const { t, L } = ctx, tx = ctx.curtained ? 1.55 : 0.75, tw = ctx.curtained ? 6.9 : 8.5; /* between the curtains when they are in */ t.text(s, `${ctx.TR.scene} ${ctx.idx}`, { x: tx, y: 0.5, w: 2.2, h: 0.28, fontSize: 10, bold: true, color: C.accent, charSpacing: 2 }); if (d.title) t.text(s, d.title, { x: tx, y: 0.75, w: tw, h: 0.6, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, tw, 0.6, 28, 15, 'Cambria', true) }); },
  footer: metaFooter({ color: C.muted, x: 0.75, w: 8.5, align: 'center' }),
  onPanel: () => C.ink, subPanel: () => C.muted, markerText: (i) => (i % 2 ? 'FFF4E0' : '2A1519'), authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Cambria', bold: true, fontSize: L.fit(v, w, h2, o.max || 16, 10, 'Cambria', true), color: o.color || C.accent, align: o.align, valign: o.valign || 'middle' });
    const gold = C.accent, red = 'B3202F', wine = '8C1C26', cream = 'F7EBD0', ink2 = '2A1519', soft = 'FFF1C8';
    const cone = async (s, x, y, w, h2, op = 0.2) => t.img(s, await svgOnce(ctx, 'cone' + op, `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1C8" stop-opacity="${op + 0.25}"/><stop offset="1" stop-color="#FFF1C8" stop-opacity="${op * 0.3}"/></linearGradient></defs><polygon points="200,0 300,0 500,500 0,500" fill="url(#c)"/></svg>`, 500, 500), x, y, w, h2);
    const bulbs = (s, x, y, w, h2, step = 0.3, d = 0.08) => { const nx = Math.round(w / step), ny = Math.round(h2 / step); for (let k = 0; k <= nx; k++) { const px = x + (k * w) / nx - d / 2; t.oval(s, px, y - d / 2, d, d, soft); t.oval(s, px, y + h2 - d / 2, d, d, soft); } for (let k = 1; k < ny; k++) { const py = y + (k * h2) / ny - d / 2; t.oval(s, x - d / 2, py, d, d, soft); t.oval(s, x + w - d / 2, py, d, d, soft); } };
    const ticket = (s, x, y, w, h2, stub, c = cream, o = {}) => { // notched ends and a perforated line beside the stub
      t.rect(s, x, y, w, h2, c, { name: 'Ticket' });
      const notch = Math.min(0.1, h2 * 0.15);
      for (const [a, b] of [[x - notch, y + h2 / 2 - notch], [x + w - notch, y + h2 / 2 - notch]]) t.oval(s, a, b, notch * 2, notch * 2, o.bg || '241216');
      if (stub) { if (o.vertical) t.line(s, x + 0.08, y + stub, w - 0.16, 0, 'A87E3A', 1.25, { dash: 'sysDash' }); else t.line(s, x + stub, y + 0.06, 0, h2 - 0.12, 'A87E3A', 1.25, { dash: 'sysDash' }); }
    };
    const curtains = async (s) => { t.img(s, await svgOnce(ctx, 'cl', curtain(260, 900, 0), 260, 900), -0.2, 0, 1.6, 5.625); t.img(s, await svgOnce(ctx, 'cr', curtain(260, 900, 1), 260, 900), 8.6, 0, 1.6, 5.625); };
    const scene = async (d) => { // curtains in: the scene line and title stand between them, not on the velvet
      const s = await page({}, 'focus');
      t.text(s, `${ctx.TR.scene} ${ctx.idx}`, { x: 1.55, y: 0.5, w: 2.2, h: 0.28, fontSize: 10, bold: true, color: gold, charSpacing: 2 });
      t.text(s, d.title, { x: 1.55, y: 0.75, w: 6.9, h: 0.6, fontFace: 'Cambria', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 6.9, 0.6, 26, 13, 'Cambria', true) });
      return s;
    };
    const V = {
      image: [
        async (d) => { // the stage itself: the picture stands in the proscenium, curtains drawn back on either side of it
          const s = await page(d), x = 0.95, y = 1.5, w = 4.0, ht = 3.3;
          t.rect(s, x - 0.14, y - 0.14, w + 0.28, ht + 0.28, gold, { name: 'Proscenium' });
          t.img(s, await L.photo(L.src(d.image), w, ht), x, y, w, ht, { alt: '' });
          t.img(s, await svgOnce(ctx, 'cl', curtain(260, 900, 0), 260, 900), x, y, 0.75, ht); t.img(s, await svgOnce(ctx, 'cr', curtain(260, 900, 1), 260, 900), x + w - 0.75, y, 0.75, ht);
          t.rect(s, x, y, w, 0.2, wine, { name: 'Valance' });
          body(s, d.text, 5.4, 1.45, 3.85, 3.5, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // the page is the picture, a programme card rests on it
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.15, 10, 0.475, '140A0C', { name: 'Footer band' });
          t.rect(s, 0.5, 0.35, 4.9, 4.55, ink2, { t: 3, line: { color: gold, width: 1.5 }, name: 'Programme card' }); t.rect(s, 0.57, 0.42, 4.76, 4.41, null, { line: { color: gold, width: 0.5 }, name: 'Gilt line' });
          t.text(s, `${ctx.TR.scene} ${ctx.idx}`, { x: 0.78, y: 0.5, w: 4.3, h: 0.26, fontSize: 10, bold: true, color: gold, charSpacing: 2 });
          head(s, d.title, 0.78, 0.76, 4.35, 0.82, { max: 21, color: C.ink });
          t.line(s, 0.78, 1.6, 1.2, 0, gold, 1.5);
          body(s, d.text, 0.78, 1.68, 4.35, 3.05, { max: 14, k: 1.1, valign: 'middle' });
          K.footer(ctx, s);
        },
        async (d) => { // the marquee over the door: a ring of bulbs around the picture
          const s = await page(d), x = 5.2, y = 1.62, w = 3.85, ht = 3.0;
          t.rect(s, x - 0.22, y - 0.22, w + 0.44, ht + 0.44, wine, { line: { color: gold, width: 1.5 }, name: 'Marquee' });
          bulbs(s, x - 0.11, y - 0.11, w + 0.22, ht + 0.22);
          t.img(s, await L.photo(L.src(d.image), w, ht), x, y, w, ht, { alt: '' });
          body(s, d.text, 0.75, 1.45, 3.95, 3.5, { max: 15, k: 1.18, valign: 'middle' });
        },
        async (d) => { // curtains open, one spotlight falls on a round picture standing centre stage
          const s = await scene(d), dia = 2.75, x = 5.55, y = 1.92;
          await cone(s, x - 0.75, 0.38, dia + 1.5, 4.5, 0.2);
          t.oval(s, x - 0.09, y - 0.09, dia + 0.18, dia + 0.18, gold);
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
          body(s, d.text, 1.55, 1.45, 3.75, 3.6, { max: 14, k: 1.12, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // a strip of tickets: the stub carries the icon, the perforation parts it from the words
          const s = await page(d), n = d.items.length, rh = 3.55 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.45 + i * rh, hg = rh - 0.12;
            ticket(s, 0.75, y, 8.5, hg, 1.0, i % 2 ? 'F0D69A' : cream);
            t.img(s, await L.icon(it.icon, wine, 2), 1.05, y + hg / 2 - 0.2, 0.4, 0.4);
            head(s, it.h, 1.9, y + 0.04, 2.3, hg - 0.08, { color: wine, max: 15 });
            body(s, it.t, 4.3, y + 0.04, 4.75, hg - 0.08, { color: ink2, valign: 'middle', max: 13.5 });
          }
        },
        async (d) => { // a spotlight for each item: the light falls from the flies on its icon and words
          const s = await page(d), n = d.items.length, cw = 8.5 / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.75 + i * cw, cx = x + cw / 2;
            await cone(s, x + 0.02, 0.38, cw - 0.04, 4.72, 0.13);
            t.oval(s, cx - 0.34, 1.62, 0.68, 0.68, i % 2 ? red : gold, { line: { color: soft, width: 1.5 } });
            t.img(s, await L.icon(it.icon, i % 2 ? cream : ink2, 2), cx - 0.17, 1.79, 0.34, 0.34);
            head(s, it.h, x + 0.1, 2.38, cw - 0.2, 0.5, { align: 'center' });
            body(s, it.t, x + 0.14, 2.9, cw - 0.28, 2.15, { align: 'center' });
          }
        },
        async (d) => { // the printed playbill: one gold-ruled sheet, its items in four cells
          const s = await page(d), n = d.items.length, w = 4.25, hh = 1.78, X = 0.75, Y = 1.45;
          t.rect(s, X, Y, 8.5, 3.56, ink2, { t: 5, line: { color: gold, width: 1.5 }, name: 'Playbill' }); t.rect(s, X + 0.06, Y + 0.06, 8.38, 3.44, null, { line: { color: gold, width: 0.5 }, name: 'Gilt line' });
          t.line(s, X + 0.1, Y + hh, 8.3, 0, gold, 0.75); if (n === 4) t.line(s, X + w, Y + 0.1, 0, 3.36, gold, 0.75); else t.line(s, X + w, Y + 0.1, 0, hh - 0.1, gold, 0.75);
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.5 : w, x = X + (i % 2) * w, y = Y + Math.floor(i / 2) * hh;
            t.img(s, await L.icon(it.icon, gold, 2), x + 0.2, y + 0.17, 0.34, 0.34);
            head(s, it.h, x + 0.64, y + 0.12, ww - 0.82, 0.44, { color: soft });
            body(s, it.t, x + 0.22, y + 0.6, ww - 0.44, hh - 0.7, { max: 13.5 });
          }
        },
        async (d) => { // velvet seats in the stalls, at two heights: each with a brass plate holding its icon
          const s = await page(d), n = d.items.length, gap = 0.14, w = (8.5 - gap * (n - 1)) / n, hh = 3.15;
          for (const [i, it] of d.items.entries()) {
            const x = 0.75 + i * (w + gap), y = i % 2 ? 1.9 : 1.45;
            t.rect(s, x, y, w, hh, wine, { r: 0.18, shadow: 0.4, blur: 6, offset: 3, name: 'Seat' });
            t.rect(s, x + w / 2 - 0.3, y + 0.12, 0.6, 0.42, gold, { r: 0.04, name: 'Plate' });
            t.img(s, await L.icon(it.icon, ink2, 2), x + w / 2 - 0.15, y + 0.18, 0.3, 0.3);
            head(s, it.h, x + 0.14, y + 0.6, w - 0.28, 0.48, { align: 'center', color: soft, max: 14 });
            body(s, it.t, x + 0.16, y + 1.1, w - 0.32, hh - 1.2, { align: 'center', color: 'FFF4E0', max: 13 });
          }
        },
      ],
      process: [
        async (d) => { // acts of a play: a great Roman numeral heads each, a strip of curtain between them
          const s = await page(d), n = d.steps.length, cw = 8.5 / n;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.75 + i * cw;
            if (i) t.img(s, await svgOnce(ctx, 'cl', curtain(260, 900, 0), 260, 900), x - 0.1, 1.45, 0.2, 3.6);
            t.text(s, L.ROMAN[i], { x: x + 0.15, y: 1.42, w: cw - 0.3, h: 0.9, fontFace: 'Cambria', bold: true, fontSize: 46, color: gold, valign: 'middle', noFit: true });
            head(s, st.h, x + 0.15, 2.35, cw - 0.3, 0.5, { color: C.ink, max: 15 });
            body(s, st.t, x + 0.15, 2.87, cw - 0.3, 2.15, { color: C.muted, max: 14 });
          }
        },
        async (d) => { // the grand staircase of the theatre: each step's edge is gilded
          const s = await page(d), n = d.steps.length, w = 8.5 / n, rise = n === 4 ? 0.33 : 0.45;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.75 + i * w, y = 1.48 + (n - 1 - i) * rise;
            t.rect(s, x, y, w, 5.08 - y, i === n - 1 ? wine : '2A1519', { name: 'Stair' });
            t.rect(s, x, y, w, 0.07, gold, { name: 'Gilt edge' });
            await marker(s, x + 0.15, y + 0.17, 0.5, i, i + 1);
            head(s, st.h, x + 0.72, y + 0.12, w - 0.82, 0.58, { max: 13, color: i === n - 1 ? soft : gold });
            body(s, st.t, x + 0.16, y + 0.76, w - 0.32, 5.08 - y - 0.84, { max: 13.5 });
          }
        },
        async (d) => { // the prompter's book: a cream page, every step a numbered cue in the margin
          const s = await page(d), n = d.steps.length, rh = 3.42 / n;
          t.rect(s, 0.75, 1.45, 8.5, 3.6, cream, { shadow: 0.4, blur: 8, offset: 3, name: 'Prompt book' });
          t.line(s, 1.75, 1.45, 0, 3.6, red, 1.25);
          for (const [i, st] of d.steps.entries()) {
            const y = 1.54 + i * rh;
            t.oval(s, 1.0, y + (rh - 0.52) / 2, 0.52, 0.52, red);
            t.text(s, String(i + 1), { x: 1.0, y: y + (rh - 0.52) / 2, w: 0.52, h: 0.52, fontFace: 'Cambria', bold: true, fontSize: 15, color: cream, align: 'center', valign: 'middle' });
            head(s, st.h, 1.9, y + 0.03, 2.35, rh - 0.06, { color: wine, max: 15 });
            body(s, st.t, 4.35, y + 0.03, 4.75, rh - 0.06, { color: ink2, valign: 'middle', max: 13.5 });
            if (i < n - 1) t.line(s, 1.9, y + rh, 7.2, 0, 'C9B58D', 0.75);
          }
        },
      ],
      stats: [
        async (d) => { // three marquee signs, ringed with bulbs
          const s = await page(d), gap = 0.25, w = (8.5 - gap * 2) / 3, y = 1.58, hh = 1.42;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.75 + i * (w + gap);
            t.rect(s, px, y, w, hh, wine, { line: { color: gold, width: 1.5 }, name: 'Marquee' });
            bulbs(s, px + 0.09, y + 0.09, w - 0.18, hh - 0.18, 0.26, 0.07);
            t.text(s, x.value, { x: px + 0.2, y: y + 0.2, w: w - 0.4, h: hh - 0.4, fontFace: 'Cambria', bold: true, color: soft, align: 'center', valign: 'middle', fontSize: L.fit(x.value, w - 0.45, hh - 0.5, 40, 18, 'Cambria', true) });
            body(s, x.label, px + 0.05, y + hh + 0.1, w - 0.1, 0.62, { align: 'center', max: 14 });
          }
          if (d.note) { t.line(s, 4.0, 3.8, 2.0, 0, gold, 1.25); body(s, d.note, 0.95, 3.88, 8.1, 1.15, { color: C.muted, align: 'center', valign: 'middle', max: 13 }); }
        },
        async (d) => { // the lead takes centre stage in the spotlight, the two others stand in the wings
          const s = await page(d), [a, b, c] = d.stats;
          await cone(s, 2.7, 0.38, 4.6, 3.95, 0.24);
          t.text(s, a.value, { x: 3.05, y: 1.72, w: 3.9, h: 1.2, fontFace: 'Cambria', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.8, 1.15, 60, 24, 'Cambria', true) });
          body(s, a.label, 3.3, 2.92, 3.4, 0.82, { align: 'center', max: 15 });
          for (const [i, x] of [b, c].entries()) {
            const px = i ? 7.05 : 0.75;
            t.text(s, x.value, { x: px, y: 1.92, w: 2.2, h: 0.75, fontFace: 'Cambria', bold: true, color: gold, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 2.15, 0.7, 30, 14, 'Cambria', true) });
            body(s, x.label, px + 0.05, 2.68, 2.1, 1.0, { align: 'center', max: 13 });
          }
          if (d.note) body(s, d.note, 0.75, 3.92, 8.5, 1.12, { color: C.muted, align: 'center', valign: 'middle', max: 13 });
        },
      ],
      compare: [
        async (d) => { // two masks of the theatre: one half of the page in pale light, the other in deep red, meeting at a gilt line
          const s = await page(d), w = 4.25;
          t.rect(s, 0, 1.42, 5, 3.68, cream, { name: 'Light side' }); t.rect(s, 5, 1.42, 5, 3.68, wine, { name: 'Dark side' }); t.rect(s, 4.97, 1.42, 0.06, 3.68, gold, { name: 'Gilt line' });
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.24, 2.72);
          head(s, d.left.h, 0.45, 1.5, w, 0.55, { align: 'right', max: 18, color: wine }); head(s, d.right.h, 5.3, 1.5, w, 0.55, { max: 18, color: 'FFD27A' });
          let y = 2.2;
          for (const [k, rh] of rows.entries()) {
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.45, y, w, h: rh, fontSize: fs, color: ink2, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.3, y, w, h: rh, fontSize: fs, color: 'FFF4E0' });
            y += rh;
          }
        },
        async (d) => { // the stage above, the orchestra pit below: footlights mark the edge between them
          const s = await page(d), edge = 3.25;
          t.rect(s, 0, 1.42, 10, edge - 1.42, '4A2A2F', { t: 40, name: 'Stage' });
          for (let k = 0; k < 22; k++) { t.oval(s, 0.25 + k * 0.45, edge - 0.08, 0.14, 0.14, soft); }
          t.rect(s, 0, edge + 0.06, 10, 5.08 - edge - 0.06, '0D0607', { name: 'Pit' });
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = i ? edge + 0.12 : 1.46, n = side.items.length, cw = 8.5 / n;
            head(s, side.h, 0.75, y, 8.5, 0.42, { align: 'center', max: 17, color: i ? 'FFD27A' : gold });
            for (const [k, it] of side.items.entries()) body(s, it, 0.75 + k * cw + 0.08, y + 0.44, cw - 0.16, 1.2, { align: 'center', valign: 'middle', max: 14 });
          }
        },
      ],
      statement: [
        async (d) => { // curtains parted, a single beam: the note first as a prologue, the thought below it, alone on stage
          const s = await scene(d);
          await cone(s, 2.1, 0.38, 5.8, 4.72, 0.16);
          if (d.caption) body(s, d.caption, 1.7, 1.42, 6.6, 1.12, { color: 'F0E1C0', align: 'center', valign: 'middle', max: 13 });
          t.line(s, 4.3, 2.62, 1.4, 0, gold, 1.5);
          t.text(s, L.runs(d.text), { x: 1.65, y: 2.7, w: 6.7, h: 2.35, fontFace: 'Cambria', bold: true, italic: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(d.text, 6.7, 2.3, 32, 15, 'Cambria', true, 1, true) });
        },
        async (d) => { // one great ticket: the thought on its face, the note on the stub
          const s = await page(d);
          ticket(s, 0.75, 1.5, 8.5, 3.45, 5.65, cream);
          t.line(s, 0.95, 1.65, 5.25, 0, wine, 1); t.line(s, 0.95, 4.8, 5.25, 0, wine, 1);
          t.text(s, L.runs(d.text), { x: 1.05, y: 1.72, w: 5.1, h: 3.0, fontFace: 'Cambria', bold: true, color: wine, valign: 'middle', fontSize: L.fit(d.text, 5.1, 2.95, 28, 14, 'Cambria', true) });
          if (d.caption) body(s, d.caption, 6.6, 1.68, 2.45, 3.1, { color: ink2, valign: 'middle', max: 13.5 });
        },
      ],
      timeline: [
        async (d) => { // four admission tickets standing in a row: the year is the torn-off stub
          const s = await page(d), gap = 0.15, w = (8.5 - gap * 3) / 4, y = 1.45, hh = 3.6;
          for (const [i, it] of d.items.entries()) {
            const x = 0.75 + i * (w + gap);
            ticket(s, x, y, w, hh, 0.72, i % 2 ? 'F0D69A' : cream, { vertical: true });
            head(s, it.year, x + 0.1, y + 0.1, w - 0.2, 0.52, { align: 'center', color: wine, max: 20 });
            head(s, it.h, x + 0.14, y + 0.78, w - 0.28, 0.46, { align: 'center', color: ink2, max: 14 });
            body(s, it.t, x + 0.14, y + 1.26, w - 0.28, hh - 1.36, { align: 'center', color: ink2 });
          }
        },
        async (d) => { // a velvet rope on brass posts: the year on each post, the rope swags to the next
          const s = await page(d), cw = 2.125;
          t.img(s, await svgOnce(ctx, 'rope', `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="60"><path d="M0,6 Q106,70 212.5,6 T425,6 T637.5,6" fill="none" stroke="#${red}" stroke-width="9"/></svg>`, 640, 60), 0.87, 1.98, cw * 3, 0.42);
          for (const [i, it] of d.items.entries()) {
            const x = 0.75 + i * cw;
            t.rect(s, x + 0.08, 1.96, 0.07, 0.52, gold, { name: 'Post' }); t.oval(s, x + 0.03, 1.87, 0.17, 0.17, 'FFD27A');
            head(s, it.year, x, 1.42, cw - 0.1, 0.44, { max: 19 });
            head(s, it.h, x, 2.52, cw - 0.14, 0.46, { color: C.ink, max: 14 });
            body(s, it.t, x, 3.0, cw - 0.2, 2.05, { color: C.muted, max: 14 });
          }
        },
        async (d) => { // the red carpet up the middle of the foyer: the years stand on either side
          const s = await page(d), w = 3.65;
          t.rect(s, 4.65, 1.42, 0.7, 3.66, red, { name: 'Carpet' }); t.rect(s, 4.65, 1.42, 0.05, 3.66, gold, { name: 'Edge' }); t.rect(s, 5.3, 1.42, 0.05, 3.66, gold, { name: 'Edge' });
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.46 + Math.floor(i / 2) * 1.78 + (right ? 0.28 : 0), x = right ? 5.6 : 0.75, a = right ? 'left' : 'right';
            t.oval(s, 4.87, y + 0.09, 0.26, 0.26, gold, { line: { color: soft, width: 1 } });
            head(s, it.year, x, y, w, 0.4, { align: a, max: 19 });
            head(s, it.h, x, y + 0.4, w, 0.28, { align: a, color: C.ink, max: 13 });
            body(s, it.t, x, y + 0.7, w, 1.0, { align: a, color: C.muted, max: 13 });
          }
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.timeline = V.timeline.shift(); // the original panels looked like the cards page
    return V;
  },
  hero: async (ctx, d, kind, newSlide) => {
    const { t, L, M } = ctx, s = await newSlide('hero');
    if (d.image) await K.photo(ctx, s, d.image, 6.0, 1.15, 2.4, 2.8);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 1.5, y: 1.0, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: C.accent, charSpacing: 2 });
    t.text(s, d.title, { x: 1.5, y: 1.35, w: 4.3, h: 2.0, fontFace: 'Cambria', bold: true, fontSize: L.fit(d.title, 4.3, 1.95, 36, 18, 'Cambria', true), color: C.ink, valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 1.5, y: 3.4, w: 4.3, h: 0.7, fontFace: 'Cambria', italic: true, fontSize: 12, color: C.muted });
    t.text(s, M.author || '', { x: 1.5, y: 4.15, w: 4.3, h: 0.4, fontFace: 'Cambria', fontSize: 16, bold: true, color: C.accent });
    metaFooter({ color: C.muted, x: 1.5, w: 7.0, align: 'center' })(ctx, s);
  },
};
module.exports = { id: 80, slug: 'teatr', name: 'Teatr', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "sahna asari kabi: kirish, rivojlanish, avj nuqta va xulosa; ta'sirli va jonli", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "bold"], "transitions": ["p14:doors|dir=\"vert\"", "fade", "p14:reveal|thruBlk=\"1\""], "cover": ["split", "fadeLetters"], "mark": "focusIn", "deco": "split", "sig": {"title": "split", "body": "fadeWords", "item": "focusIn", "image": "split", "number": "focusIn", "order": "centerOut", "stagger": 0.22}, "tempo": 1.2, "kenburns": true};
