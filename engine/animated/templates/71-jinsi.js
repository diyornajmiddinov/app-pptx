/** 71 Jinsi — denim: twill texture, orange stitched seams, leather label, copper rivets as markers. */
const { run, metaFooter, theme, svgOnce } = require('../skin.js');
const C = { bg: '2E4A6E', ink: 'F1F4F8', muted: 'C2D2E6', accent: 'E8A33D', patch: '3C5E88', leather: '9A6B3F', pal: ['E8A33D', '3C5E88', '9A6B3F', '5B7DA8', 'C9A06C', '2E4A6E'] };
const twill = () => { let l = ''; for (let k = -900; k < 1600; k += 7) l += `<line x1="${k}" y1="0" x2="${k + 900}" y2="900"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/><g stroke="#ffffff" stroke-opacity="0.05" stroke-width="2">${l}</g><g stroke="#000" stroke-opacity="0.06" stroke-width="1">${l}</g></svg>`; };
const stitch = (t, s, x, y, w, h, c = C.accent) => t.rect(s, x + 0.08, y + 0.08, w - 0.16, h - 0.16, null, { line: { color: c, width: 1.25, dashType: 'dash' }, name: 'Stitch' });
const K = {
  F: { head: 'Arial', body: 'Calibri' }, C, theme: theme('Jinsi', C, C.pal), layout: { agenda: 'twoCol', cards: 'columns', process: 'panels', stats: 'tiles', timeline: 'columns' },
  bg: async (ctx, s) => { s.background = { data: await svgOnce(ctx, 'bg', twill(), 1600, 900, true) }; },
  panel: (ctx, s, x, y, w, h, k) => { const fill = k % 3 === 2 ? C.leather : C.patch; ctx.t.rect(s, x, y, w, h, fill, { r: 0.06, shadow: 0.35, blur: 6, offset: 2, name: 'Patch' }); stitch(ctx.t, s, x, y, w, h); },
  marker: (ctx, s, x, y, d, k, label) => { ctx.t.oval(s, x, y, d, d, 'B87333', { line: { color: 'E3B07A', width: 2 } }); ctx.t.oval(s, x + d * 0.18, y + d * 0.18, d * 0.64, d * 0.64, 'C98B4E'); if (label !== '') ctx.t.text(s, String(label), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); },
  photo: async (ctx, s, src, x, y, w, h) => { ctx.t.rect(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2, C.patch, { r: 0.06, name: 'Patch' }); ctx.t.img(s, await ctx.L.photo(ctx.L.src(src), w, h), x, y, w, h, { alt: '' }); stitch(ctx.t, s, x - 0.1, y - 0.1, w + 0.2, h + 0.2); },
  title: (ctx, s, d) => {
    ctx.t.rect(s, 0.5, 0.35, 0.95, 0.7, C.leather, { r: 0.05, name: 'Leather tag' }); stitch(ctx.t, s, 0.5, 0.35, 0.95, 0.7, 'E3C08F');
    ctx.t.text(s, String(ctx.idx), { x: 0.5, y: 0.35, w: 0.95, h: 0.7, fontSize: 20, bold: true, color: 'FFF5E6', align: 'center', valign: 'middle' });
    if (d.title) ctx.t.text(s, d.title, { x: 1.65, y: 0.35, w: 7.8, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: ctx.L.fit(d.title, 7.8, 0.7, 28, 16, 'Arial', true) });
  },
  footer: metaFooter({ color: C.muted }),
  bullet: (ctx, s, x, y) => ctx.t.oval(s, x, y, 0.15, 0.15, C.accent),
  onPanel: () => C.ink, subPanel: () => C.muted, authorColor: C.accent,
  ways: (ctx, h, R) => {
    const { t, L } = ctx, { page, newSlide, panel, marker } = h;
    const body = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontSize: L.fit(v, w, h2, o.max || 14, 10, 'Calibri', false, o.k || 1), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', ...(o.k ? { lineSpacingMultiple: o.k } : {}) });
    const head = (s, v, x, y, w, h2, o = {}) => t.text(s, v, { x, y, w, h: h2, fontFace: 'Arial', bold: true, fontSize: L.fit(v, w, h2, o.max || 15, 10, 'Arial', true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
    const hide = '7A5230', cream = 'FFF5E6', tan = 'E3C08F';
    const seam = (s, x, y, w, h2 = 0, c = C.accent) => t.line(s, x, y, w, h2, c, 1.25, { dash: 'dash' });
    const rivet = (s, x, y, d = 0.2) => K.marker(ctx, s, x, y, d, 0, '');
    const sewn = (s, x, y, w, h2, fill, c = C.accent, r = 0.06) => { t.rect(s, x, y, w, h2, fill, { r, shadow: 0.35, blur: 6, offset: 2, name: fill === hide ? 'Leather' : 'Patch' }); stitch(t, s, x, y, w, h2, c); };
    const zipper = async (s, x, y, w, h2) => { let g = ''; for (let k = 0; k < 50; k++) g += `<rect x="${k % 2 ? 24 : 34}" y="${k * 18 + 4}" width="12" height="9"/>`; t.img(s, await svgOnce(ctx, 'zip', `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="900"><rect x="4" width="62" height="900" fill="#1D3350"/><g fill="#C98B4E">${g}</g></svg>`, 70, 900), x, y, w, h2); };
    const outline = async (s, key, d, x, y, w, h2, c = C.accent) => t.img(s, await svgOnce(ctx, key, `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 1000 1000" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#${c}" stroke-width="9" stroke-dasharray="30 20"/></svg>`, 800, 800), x, y, w, h2);
    const iconOn = async (s, ic, x, y, d, c = cream) => t.img(s, await L.icon(ic, c, 2), x, y, d, d);
    const V = {
      image: [
        async (d) => { // the picture is the back pocket of the jeans, its V stitched round it
          const s = await page(d);
          t.img(s, await L.photo(L.src(d.image), 3.45, 3.8, { mask: { path: 'M0,0 L1,0 L1,0.74 L0.5,1 L0,0.74 Z' } }), 5.95, 1.27, 3.45, 3.8, { alt: '' });
          await outline(s, 'pocket', 'M30,30 L970,30 L970,725 L500,965 L30,725 Z', 5.95, 1.27, 3.45, 3.8, 'FFD28A');
          rivet(s, 5.88, 1.2); rivet(s, 9.33, 1.2);
          seam(s, 5.7, 1.3, 0, 3.75);
          body(s, d.text, 0.6, 1.35, 4.85, 3.6, { max: 15, k: 1.2, valign: 'middle' });
        },
        async (d) => { // the whole page is the picture, a dark leather label is sewn on it
          const s = await newSlide('hero');
          t.img(s, await L.photo(L.src(d.image), 10, 5.625), 0, 0, 10, 5.625, { alt: '' });
          t.rect(s, 0, 5.18, 10, 0.445, C.bg, { name: 'Footer band' });
          sewn(s, 0.45, 0.35, 5.1, 4.6, hide, tan);
          for (const [x, y] of [[0.58, 0.48], [5.2, 0.48], [0.58, 4.6], [5.2, 4.6]]) rivet(s, x, y);
          head(s, d.title, 0.9, 0.5, 4.2, 0.95, { max: 22, color: cream });
          body(s, d.text, 0.75, 1.5, 4.5, 3.3, { max: 16, k: 1.12, color: cream, valign: 'middle' });
          K.footer(ctx, s);
        },
        async (d) => { // the leg of the jeans ends in a rolled cuff: the picture above, the words on the turn-up
          const s = await page(d);
          t.img(s, await L.photo(L.src(d.image), 10, 1.85), 0, 1.13, 10, 1.85, { alt: '' });
          t.rect(s, 0, 2.98, 10, 2.15, C.patch, { name: 'Cuff' }); t.rect(s, 0, 2.98, 10, 0.08, '1F3550', { name: 'Fold' });
          seam(s, 0, 3.16, 10); seam(s, 0, 5.02, 10);
          body(s, d.text, 0.6, 3.27, 8.8, 1.68, { max: 15, k: 1.1, valign: 'middle' });
        },
        async (d) => { // a jeans button: the picture in a round copper rim
          const s = await page(d), dia = 3.3, x = 0.75, y = 1.48;
          t.oval(s, x - 0.17, y - 0.17, dia + 0.34, dia + 0.34, 'B87333', { line: { color: 'E3B07A', width: 2.5 } });
          t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
          t.oval(s, x - 0.3, y - 0.3, dia + 0.6, dia + 0.6, null, { line: { color: C.accent, width: 1.25, dashType: 'dash' } });
          body(s, d.text, 4.75, 1.3, 4.65, 3.75, { max: 15, k: 1.25, valign: 'middle' });
        },
      ],
      cards: [
        async (d) => { // a leather belt through denim loops: an item hangs under each loop
          const s = await page(d), n = d.items.length, cw = 8.8 / n;
          t.rect(s, 0, 1.47, 10, 0.5, hide, { name: 'Belt' }); seam(s, 0, 1.53, 10, 0, tan); seam(s, 0, 1.91, 10, 0, tan);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw, lx = x + cw / 2 - 0.42;
            sewn(s, lx, 1.28, 0.84, 0.88, C.patch, C.accent, 0.04);
            await iconOn(s, it.icon, lx + 0.25, 1.55, 0.34);
            head(s, it.h, x + 0.1, 2.3, cw - 0.2, 0.52, { align: 'center', color: C.accent });
            body(s, it.t, x + 0.12, 2.86, cw - 0.24, 2.2, { align: 'center' });
            if (i) seam(s, x, 2.35, 0, 2.6, '5B7DA8');
          }
        },
        async (d) => { // four pockets: a leather flap with the heading, a rivet at each end
          const s = await page(d), n = d.items.length, w = 4.3, hh = 1.8;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.3 + Math.floor(i / 2) * (hh + 0.15);
            sewn(s, x, y, ww, hh, C.patch);
            t.rect(s, x, y, ww, 0.58, hide, { name: 'Flap' }); seam(s, x, y + 0.52, ww, 0, tan);
            await iconOn(s, it.icon, x + 0.3, y + 0.11, 0.33);
            head(s, it.h, x + 0.75, y + 0.04, ww - 1.25, 0.46, { color: cream });
            rivet(s, x + ww - 0.3, y + 0.17);
            body(s, it.t, x + 0.25, y + 0.66, ww - 0.5, hh - 0.76);
          }
        },
        async (d) => { // leather tags sewn along a long seam, the words on bare denim
          const s = await page(d), n = d.items.length, rh = 3.75 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.3 + i * rh, th = rh - 0.15;
            sewn(s, 0.6, y, 2.95, th, hide, tan, 0.04);
            await iconOn(s, it.icon, 0.8, y + th / 2 - 0.17, 0.34);
            head(s, it.h, 1.25, y + 0.05, 2.15, th - 0.1, { color: cream, max: 14 });
            body(s, it.t, 3.8, y, 5.6, th, { valign: 'middle' });
            if (i < n - 1) seam(s, 3.8, y + rh - 0.07, 5.6, 0);
          }
        },
        async (d) => { // patches sewn on at two heights, leather and denim in turn, each pinned by two rivets
          const s = await page(d), n = d.items.length, gap = 0.15, w = (8.8 - gap * (n - 1)) / n, hh = 3.1;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = i % 2 ? 1.97 : 1.28, fill = i % 2 ? hide : '3C5E88';
            sewn(s, x, y, w, hh, fill, i % 2 ? tan : C.accent);
            rivet(s, x + 0.16, y + 0.16); rivet(s, x + w - 0.36, y + 0.16);
            await iconOn(s, it.icon, x + w / 2 - 0.22, y + 0.2, 0.44);
            head(s, it.h, x + 0.2, y + 0.72, w - 0.4, 0.52, { align: 'center', max: 14, color: cream });
            body(s, it.t, x + 0.2, y + 1.27, w - 0.4, hh - 1.42, { align: 'center', max: 13 });
          }
        },
      ],
      process: [
        async (d) => { // a zip up the middle of the page: the steps open to either side of it
          const s = await page(d), n = d.steps.length, bh = 1.55;
          await zipper(s, 4.85, 1.22, 0.3, 3.88);
          for (const [i, st] of d.steps.entries()) {
            const right = i % 2 === 1, y = n === 3 && i === 1 ? 2.3 : 1.28 + Math.floor(i / 2) * 1.92 + (right ? 0.3 : 0), x = right ? 5.6 : 0.6, a = right ? 'left' : 'right';
            await marker(s, 4.72, y + (right && n === 4 ? 0.3 : 0.02), 0.56, i, i + 1);
            head(s, st.h, x, y, 3.8, 0.42, { align: a, color: C.accent });
            body(s, st.t, x, y + 0.44, 3.8, bh - 0.44, { align: a, max: 13 });
          }
        },
        async (d) => { // a hem folded up step by step: each patch stands higher than the last
          const s = await page(d), n = d.steps.length, gap = 0.1, w = (8.8 - gap * (n - 1)) / n, rise = n === 4 ? 0.34 : 0.45;
          for (const [i, st] of d.steps.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.3 + (n - 1 - i) * rise, last = i === n - 1;
            sewn(s, x, y, w, 5.08 - y, last ? hide : '3C5E88', last ? tan : C.accent);
            await marker(s, x + 0.2, y + 0.18, 0.5, i, i + 1);
            head(s, st.h, x + 0.8, y + 0.14, w - 1.0, 0.58, { max: 13, color: cream });
            body(s, st.t, x + 0.22, y + 0.8, w - 0.44, 5.08 - y - 0.95, { max: 13 });
          }
        },
        async (d) => { // one thread pulled through by a needle: the steps sit in turn below and above it, a rivet on the thread for each
          const s = await page(d), n = d.steps.length, cw = 8.7 / n, w = n === 4 ? 3.0 : 3.6, ty = 3.17;
          seam(s, 0.3, ty, 8.75); t.line(s, 9.05, ty, 0.65, 0, 'DDE4EC', 2.5, { name: 'Needle' }); t.oval(s, 9.08, ty - 0.04, 0.14, 0.08, C.bg, { line: { color: 'DDE4EC', width: 1 } });
          for (const [i, st] of d.steps.entries()) {
            const cx = 0.6 + (i + 0.5) * cw, up = i % 2 === 1, x = Math.max(0.6, Math.min(9.4 - w, cx - w / 2)), y = up ? 1.3 : 3.62;
            await marker(s, cx - 0.32, ty - 0.32, 0.64, i, i + 1);
            head(s, st.h, x, y, w, 0.38, { align: 'center', max: 15, color: C.accent });
            body(s, st.t, x, y + 0.4, w, 1.06, { align: 'center', max: 13 });
          }
        },
        async (d) => { // the care label inside the jeans: one big piece of leather, a line for each step
          const s = await page(d), n = d.steps.length, rh = 3.55 / n;
          sewn(s, 0.6, 1.28, 8.8, 3.8, hide, tan);
          for (const [i, st] of d.steps.entries()) {
            const y = 1.4 + i * rh;
            await marker(s, 0.85, y + (rh - 0.52) / 2, 0.52, i, i + 1);
            head(s, st.h, 1.55, y + 0.04, 2.45, rh - 0.08, { color: cream, max: 14 });
            body(s, st.t, 4.15, y + 0.04, 5.0, rh - 0.08, { valign: 'middle', color: 'F7E7D0', max: 13 });
            if (i < n - 1) seam(s, 0.85, y + rh, 8.3, 0, tan);
          }
        },
      ],
      stats: [
        async (d) => { // three great copper rivets
          const s = await page(d), cw = 8.8 / 3, dia = 1.8, y0 = d.note ? 1.22 : 1.55;
          for (const [i, x] of d.stats.entries()) {
            const px = 0.6 + i * cw + (cw - dia) / 2;
            marker(s, px, y0, dia, 0, '');
            t.text(s, x.value, { x: px + 0.28, y: y0 + 0.45, w: dia - 0.56, h: dia - 0.9, fontFace: 'Arial', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 0.6, 0.8, 30, 12, 'Arial', true) });
            body(s, x.label, 0.6 + i * cw + 0.12, y0 + dia + 0.08, cw - 0.24, 0.72, { align: 'center', max: 13 });
          }
          if (d.note) { seam(s, 0.6, 3.92, 8.8); body(s, d.note, 0.6, 4.0, 8.8, 1.02, { valign: 'middle', color: C.muted, max: 13 }); }
        },
        async (d) => { // the waistband patch carries the main number, two small patches beside it
          const s = await page(d), [a, ...rest] = d.stats;
          sewn(s, 0.6, 1.3, 3.85, 3.75, hide, tan);
          for (const [x, y] of [[0.78, 1.48], [4.07, 1.48], [0.78, 4.67], [4.07, 4.67]]) rivet(s, x, y);
          t.text(s, a.value, { x: 0.9, y: 1.65, w: 3.25, h: 1.35, fontFace: 'Arial', bold: true, color: 'FFD28A', align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.2, 1.25, 56, 22, 'Arial', true) });
          body(s, a.label, 1.05, 3.05, 2.95, 1.55, { align: 'center', color: cream, max: 15 });
          for (const [i, x] of rest.entries()) {
            const y = 1.3 + i * 1.23;
            sewn(s, 4.7, y, 4.7, 1.1, C.patch);
            t.text(s, x.value, { x: 4.85, y, w: 1.85, h: 1.1, fontFace: 'Arial', bold: true, color: C.accent, valign: 'middle', align: 'center', fontSize: L.fit(x.value, 1.75, 0.8, 28, 13, 'Arial', true) });
            body(s, x.label, 6.75, y + 0.14, 2.5, 0.82, { valign: 'middle', max: 12 });
          }
          if (d.note) body(s, d.note, 4.7, 3.82, 4.7, 1.22, { color: C.muted, max: 12, valign: 'middle' });
        },
      ],
      compare: [
        async (d) => { // the two halves of a zip: the rows meet at the teeth
          const s = await page(d), w = 3.85;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w, 'Calibri', 0.25, 2.95);
          await zipper(s, 4.85, 1.22, 0.3, 3.88);
          head(s, d.left.h, 0.6, 1.3, w, 0.55, { align: 'right', max: 18, color: C.accent }); head(s, d.right.h, 5.55, 1.3, w, 0.55, { max: 18, color: 'FFD28A' });
          seam(s, 0.6, 1.9, w); seam(s, 5.55, 1.9, w);
          let y = 2.03;
          for (const [k, rh] of rows.entries()) {
            rivet(s, 4.89, y + 0.01, 0.22);
            if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.6, y, w, h: rh, fontSize: fs, color: C.ink, align: 'right' });
            if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.55, y, w, h: rh, fontSize: fs, color: C.ink });
            y += rh;
          }
        },
        async (d) => { // two bolts of cloth, one over the other: denim above, leather below
          const s = await page(d), hh = 1.82;
          for (const [i, side] of [d.left, d.right].entries()) {
            const y = 1.28 + i * (hh + 0.12), n = side.items.length, cw = 6.5 / n, fill = i ? hide : C.patch;
            sewn(s, 0.6, y, 8.8, hh, fill, i ? tan : C.accent);
            head(s, side.h, 0.82, y + 0.15, 1.8, hh - 0.3, { max: 17, color: i ? 'FFD28A' : C.accent });
            for (const [k, it] of side.items.entries()) {
              const x = 2.75 + k * cw;
              seam(s, x, y + 0.2, 0, hh - 0.4, i ? tan : '8FA9C8');
              body(s, it, x + 0.1, y + 0.16, cw - 0.2, hh - 0.32, { valign: 'middle', max: 14 });
            }
          }
        },
      ],
      statement: [
        async (d) => { // a big leather patch held by four rivets, the note beside it past a seam
          const s = await page(d);
          sewn(s, 0.6, 1.3, 5.75, 3.75, hide, tan);
          for (const [x, y] of [[0.78, 1.48], [5.97, 1.48], [0.78, 4.67], [5.97, 4.67]]) rivet(s, x, y);
          t.text(s, L.runs(d.text), { x: 1.05, y: 1.55, w: 4.85, h: 3.25, fontFace: 'Arial', bold: true, color: cream, valign: 'middle', fontSize: L.fit(d.text, 4.85, 3.2, 30, 15, 'Arial', true) });
          seam(s, 6.6, 1.35, 0, 3.65);
          if (d.caption) body(s, d.caption, 6.85, 1.35, 2.55, 3.65, { valign: 'middle', max: 14 });
        },
        async (d) => { // bare denim: the words big, the double seam of a jeans leg under them
          const s = await page(d, 'focus');
          t.text(s, L.runs(d.text), { x: 0.6, y: 1.25, w: 8.8, h: 2.25, fontFace: 'Arial', bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.2, 36, 16, 'Arial', true) });
          t.line(s, 0, 3.6, 10, 0, C.accent, 1.5, { dash: 'dash' }); t.line(s, 0, 3.7, 10, 0, C.accent, 1.5, { dash: 'dash' });
          rivet(s, 0.6, 3.54); rivet(s, 9.2, 3.54);
          if (d.caption) body(s, d.caption, 0.6, 3.82, 8.8, 1.25, { color: C.muted, valign: 'middle' });
        },
      ],
      timeline: [
        async (d) => { // a tailor's tape across the page, the years are read off it
          const s = await page(d), n = d.items.length, cw = 8.8 / n; let tk = '';
          for (let k = 0; k <= 200; k++) tk += `<line x1="${k * 8}" y1="0" x2="${k * 8}" y2="${k % 5 ? 12 : 24}"/>`;
          t.img(s, await svgOnce(ctx, 'tape', `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="100"><rect width="1600" height="100" fill="#F0DFB8"/><g stroke="#7A5230" stroke-width="2">${tk}</g></svg>`, 1600, 100), 0, 1.3, 10, 0.62);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * cw;
            head(s, it.year, x, 1.47, cw - 0.15, 0.42, { color: '4A2F17', max: 19 });
            head(s, it.h, x, 2.08, cw - 0.18, 0.55, { color: C.accent, max: 15 });
            body(s, it.t, x, 2.66, cw - 0.2, 2.38, { max: 14 });
          }
        },
        async (d) => { // a double seam down the page, patches sewn to either side of it
          const s = await page(d), w = 4.05, hh = 1.68;
          t.line(s, 4.95, 1.25, 0, 3.85, C.accent, 1.5, { dash: 'dash' }); t.line(s, 5.05, 1.25, 0, 3.85, C.accent, 1.5, { dash: 'dash' });
          for (const [i, it] of d.items.entries()) {
            const right = i % 2 === 1, y = 1.28 + Math.floor(i / 2) * 1.88 + (right ? 0.22 : 0), x = right ? 5.35 : 0.6;
            rivet(s, 4.86, y + 0.2, 0.28); t.line(s, right ? 5.14 : x + w, y + 0.34, 0.21, 0, C.accent, 1.25);
            sewn(s, x, y, w, hh, C.patch);
            t.text(s, [{ text: it.year + '   ', options: { color: C.accent, bold: true } }, { text: it.h, options: { color: C.ink, bold: true } }], { x: x + 0.22, y: y + 0.13, w: w - 0.44, h: 0.42, fontFace: 'Arial', valign: 'middle', fontSize: L.fit(`${it.year}   ${it.h}`, w - 0.44, 0.4, 15, 9, 'Arial', true) });
            body(s, it.t, x + 0.22, y + 0.56, w - 0.44, hh - 0.7, { max: 13 });
          }
        },
        async (d) => { // shop tags on a string: each year hangs from its own eyelet
          const s = await page(d), n = d.items.length, gap = 0.14, w = (8.8 - gap * (n - 1)) / n, tagPath = 'M180,0 L820,0 L1000,110 L1000,1000 L0,1000 L0,110 Z';
          const tag = await svgOnce(ctx, 'tag', `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 1000 1000" preserveAspectRatio="none"><path d="${tagPath}" fill="#${hide}"/></svg>`, 800, 800);
          t.line(s, 0, 1.3, 10, 0, tan, 1.5);
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap), y = 1.45 + (i % 2 ? 0.22 : 0), hh = 5.08 - 0.22 - y + (i % 2 ? 0.22 : 0);
            t.line(s, x + w / 2, 1.3, 0, 0.3, tan, 1.5);
            t.img(s, tag, x, y, w, hh);
            t.oval(s, x + w / 2 - 0.08, y + 0.08, 0.16, 0.16, C.bg, { line: { color: 'E3B07A', width: 1.75 } });
            head(s, it.year, x + 0.12, y + 0.3, w - 0.24, 0.42, { align: 'center', color: 'FFD28A', max: 19 });
            head(s, it.h, x + 0.12, y + 0.72, w - 0.24, 0.48, { align: 'center', color: cream, max: 14 });
            seam(s, x + 0.2, y + 1.23, w - 0.4, 0, tan);
            body(s, it.t, x + 0.14, y + 1.29, w - 0.28, hh - 1.4, { color: cream, max: 13, align: 'center' });
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
    t.rect(s, 0.55, 0.55, 5.4, 4.3, C.leather, { r: 0.08, shadow: 0.4, blur: 8, offset: 3, name: 'Leather label' }); stitch(t, s, 0.55, 0.55, 5.4, 4.3, 'E3C08F');
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.85, y: 0.8, w: 4.8, h: 0.3, fontSize: 11, bold: true, color: 'F3D9B1', charSpacing: 2 });
    t.text(s, d.title, { x: 0.85, y: 1.15, w: 4.8, h: 2.1, bold: true, fontSize: L.fit(d.title, 4.8, 2.0, 38, 18, 'Arial', true), color: 'FFF8EE', valign: 'middle' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.3, w: 4.8, h: 0.75, fontSize: 12, color: 'F3D9B1' });
    t.text(s, M.author || '', { x: 0.85, y: 4.1, w: 4.8, h: 0.45, fontSize: 16, bold: true, color: 'FFF8EE' });
    for (const [x, y] of [[0.75, 0.75], [5.75, 0.75], [0.75, 4.65], [5.75, 4.65]]) K.marker(ctx, s, x - 0.1, y - 0.1, 0.22, 0, '');
    if (d.image) await K.photo(ctx, s, d.image, 6.4, 0.8, 3.0, 3.6);
    metaFooter({ color: C.muted })(ctx, s);
  },
};
module.exports = { id: 71, slug: 'jinsi', name: 'Jinsi', category: 'creative', photos: true, build: (c, o) => run(c, o, K), style: { tone: "erkin va ishonchli: kundalik tilga yaqin, sodda va mustahkam iboralar", limits: {}, prefer: null } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "playful"], "transitions": ["pull:l", "cut", "push:r"], "cover": ["stretch", "swingRight"], "mark": "popIn", "deco": "wipe:r", "sig": {"title": "stretch", "body": "fadeUp", "item": "swingRight", "image": "stretch", "number": "popIn", "order": "cascade", "stagger": 0.12}, "tempo": 0.95, "kenburns": false};
