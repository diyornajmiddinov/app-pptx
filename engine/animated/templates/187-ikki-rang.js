/** 187 Ikki rang — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 187, slug: 'ikki-rang', name: "Ikki rang", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '1F2B2B', muted: '5E6B6B', accent: 'E07A2F', titleInk: 'F4EDE1' }, photo: { r: 0.04 }, rule: true, caps: false, bold: true,
  bg: (kind) => { const T = '1F4E4A', r = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#${T}"/>`, c = [0, 800, 400, 1200]; const P = { night: r(0, 0, 1600, 900), flip: r(1010, 0, 590, 900), top: r(0, 0, 1600, 225), band: r(0, 225, 1600, 190), low: r(0, 480, 1600, 420), halfl: r(0, 225, 800, 675), half: r(0, 0, 800, 900), upper: r(0, 0, 1600, 450), chk4: r(0, 225, 800, 325) + r(800, 550, 800, 350), rows3: r(0, 225, 1600, 220), col4: r(0, 225, 400, 615) + r(800, 225, 400, 615), strip: r(0, 225, 250, 675), st3: r(0, 560, 533, 340) + r(533, 400, 534, 500) + r(1067, 240, 533, 660), st4: r(0, 570, 400, 330) + r(400, 460, 400, 440) + r(800, 350, 400, 550) + r(1200, 240, 400, 660), wedge: `<polygon points="0,0 700,0 150,900 0,900" fill="#${T}"/>` }; void c; return compose(flat('F4EDE1'), raw(P[kind] || (kind === 'cream' ? '' : '<rect width="590" height="900" fill="#1F4E4A"/>'))); },
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in two colours only: the block of green moves about the page, so every page is a new division of the same two fields: a deck's pages must not look alike (L.pages)
    const CR = 'F4EDE1', SOFT = 'CFE0D8', OR = 'F4A261', RUST = 'B3540F';
    const foot = (s, x = 4.15, w = 5.25, c = C.muted, al = 'left') => k.foot(s, { x, w, y: 5.3, size: 7.5, color: c, align: al });
    const nb = (s, x, y, c = RUST, size = 22, al = 'right') => k.txt(s, String(k.idx).padStart(2, '0'), x, y, 1.0, 0.45, { size, bold: true, font: F.head, color: c, align: al, valign: 'top', ls: 1 });
    const open = async (kind, d, o = {}) => { const s = await slide(kind), { x = 0.6, y = 0.25, w = 7.7, h = 0.95, c = CR, nc = OR, fx = 0.6, fw = 8.8, fc = C.muted, ...rest } = o; if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 14, color: c, valign: 'middle', ...rest }); nb(s, 8.4, 0.3, nc); foot(s, fx, fw, fc); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, color: C.ink, ls: 1.2, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 14, min: 10.5, color: C.ink, valign: 'top', ...o });
    const ic = async (s, it, x, y, z, c = RUST) => t.img(s, await L.icon(it.icon, c, 1.75), x, y, z, z);
    const V = {
      image: [
        async (d) => { // the green field keeps its place but holds everything; the picture takes all the rest
          const s = await slide('classic');
          await k.photo(s, d.image, 3.69, 0, 6.31, 5.625);
          k.head(s, d.title, 0.35, 0.3, 3.05, 1.2, { max: 20, min: 13, color: CR, valign: 'top' });
          p(s, d.text, 0.35, 1.55, 3.05, 3.65, { color: CR, max: 12, ls: 1.12 });
          foot(s, 0.35, 3.05, SOFT);
        },
        async (d) => { // green across the top for the title, words at the left and the picture at the right below it
          const s = await open('top', d, { fx: 0.6, fw: 4.1 });
          await k.photo(s, d.image, 5.0, 1.41, 5.0, 4.215);
          p(s, d.text, 0.6, 1.65, 4.1, 3.5, { max: 13 });
        },
        async (d) => { // the green moves to the right; a round picture sits astride the seam
          const s = await open('flip', d, { x: 0.6, y: 0.4, w: 3.9, h: 1.15, c: C.ink, fx: 0.6, fw: 3.5, max: 22, valign: 'bottom' });
          await k.photo(s, d.image, 4.61, 1.15, 3.4, 3.4, { mask: 'circle' });
          p(s, d.text, 0.6, 1.68, 3.75, 3.5, { max: 12, ls: 1.12 });
        },
        async (d) => { // the picture itself in the two colours, over the whole page; a cream sheet on it
          const s = await slide('cream');
          await k.photo(s, d.image, 0, 0, 10, 5.2, { duo: ['1F4E4A', 'F4EDE1'] });
          foot(s, 0.6, 8.8);
          t.rect(s, 3.6, 1.15, 6.4, 4.05, CR, { name: 'Sheet' });
          k.head(s, d.title, 3.9, 1.3, 4.9, 0.85, { max: 19, min: 13, color: C.ink, valign: 'top' });
          nb(s, 8.7, 1.32, RUST, 20);
          p(s, d.text, 3.9, 2.2, 5.8, 2.9, { max: 13 });
        },
      ],
      cards: [
        async (d) => { // main idea on the green; the proofs in plain rows, a rule between, the words at a size that reads
          const s = await page(d), n = d.items.length, hh = 4.6 / n;
          d.items.forEach((it, i) => {
            const y = 0.42 + i * hh;
            k.head(s, String(i + 1).padStart(2, '0'), 4.15, y + 0.02, 0.7, 0.36, { max: 18, color: RUST, valign: 'top' });
            h3(s, it.h, 4.85, y + 0.03, 4.55, 0.3);
            p(s, it.t, 4.85, y + 0.35, 4.55, hh - 0.44, { max: 12.5, min: 10, ls: 1.08 });
            if (i < n - 1) hair(s, 4.15, y + hh - 0.05, 5.25);
          });
        },
        async (d) => { // the green is a band for the title, the items in full columns under it
          const s = await open('top', d), n = d.items.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.6 + i * (w + gap);
            await ic(s, it, x, 1.62, 0.46);
            h3(s, it.h, x, 2.18, w, 0.55, { max: 15 });
            p(s, it.t, x, 2.75, w, 2.38, { max: 13, min: 10, ls: 1.12 });
          }
        },
        async (d) => { // main idea at the left as ever, the proofs in a loose two-up on the cream
          const s = await page(d), n = d.items.length, w = 2.55, gap = 0.2, hh = n === 3 ? 1.48 : 2.3;
          for (const [i, it] of d.items.entries()) {
            const wide = n === 3, x = wide ? 4.15 : 4.15 + (i % 2) * (w + gap), y = 0.42 + (wide ? i : Math.floor(i / 2)) * hh;
            if (wide) { await ic(s, it, x, y + 0.04, 0.5); h3(s, it.h, x + 0.68, y + 0.02, 4.6, 0.3); p(s, it.t, x + 0.68, y + 0.34, 4.6, hh - 0.42, { max: 12.5, min: 10, ls: 1.08 }); continue; }
            await ic(s, it, x, y + 0.02, 0.44);
            h3(s, it.h, x, y + 0.56, w, 0.32);
            p(s, it.t, x, y + 0.9, w, hh - 0.98, { max: 12.5, min: 10, ls: 1.08 });
          }
        },
        async (d) => { // the green at the right holds the title; the items run down the cream, icons out at the seam
          const s = await slide('flip'), n = d.items.length, hh = 4.6 / n;
          k.head(s, d.title, 6.6, 0.6, 3.0, 3.2, { max: 30, min: 14, color: CR, valign: 'top' });
          nb(s, 6.6, 4.1, OR, 32, 'left'); foot(s, 0.6, 5.3);
          for (const [i, it] of d.items.entries()) {
            const y = 0.42 + i * hh;
            await ic(s, it, 5.4, y + 0.04, 0.54);
            h3(s, it.h, 0.6, y + 0.02, 4.6, 0.3, { align: 'right' });
            p(s, it.t, 0.6, y + 0.33, 4.6, hh - 0.4, { max: 12.5, min: 10, ls: 1.08, align: 'right' });
          }
        },
        async (d) => { // the two fields as a chequer: each item in its own square of colour
          const n = d.items.length, s = await open(n === 3 ? 'rows3' : 'chk4', d, { c: C.ink, nc: RUST, fx: n === 3 ? 0.6 : 0.6, fw: 4.5 });
          if (n === 3) {
            const ys = [1.41, 2.78, 4.05], hs = [1.37, 1.27, 1.2];
            for (const [i, it] of d.items.entries()) { const inv = i === 0, y = ys[i];
              await ic(s, it, 0.6, y + 0.14, 0.5, inv ? OR : RUST);
              h3(s, it.h, 1.3, y + 0.14, 2.9, Math.min(hs[i] - 0.2, 0.9), { color: inv ? CR : C.ink, max: 15 });
              p(s, it.t, 4.3, y + 0.12, 5.1, hs[i] - 0.2, { color: inv ? CR : C.ink, max: 12.5, min: 10, ls: 1.08 }); }
          } else {
            const pos = [[0, 1.41], [5, 1.41], [0, 3.44], [5, 3.44]], hs = [2.03, 2.03, 1.8, 1.8];
            for (const [i, it] of d.items.entries()) { const inv = i === 0 || i === 3, [x0, y] = pos[i];
              await ic(s, it, x0 + 0.5, y + 0.14, 0.4, inv ? OR : RUST);
              h3(s, it.h, x0 + 1.02, y + 0.14, 3.6, 0.4, { color: inv ? CR : C.ink, valign: 'middle' });
              p(s, it.t, x0 + 0.5, y + 0.62, 4.1, hs[i] - 0.74, { color: inv ? CR : C.ink, max: 12.5, min: 10, ls: 1.08 }); }
          }
        },
      ],
      process: [
        async (d) => { // the green rises in stairs from left to right, a step in each riser
          const n = d.steps.length, s = await slide(n === 3 ? 'st3' : 'st4'), w = 10 / n, tops = n === 3 ? [3.5, 2.5, 1.5] : [3.56, 2.875, 2.19, 1.5];
          k.head(s, d.title, 0.6, 0.3, 6.6, 1.1, { max: 26, min: 14, color: C.ink, valign: 'top' }); nb(s, 8.4, 0.3, RUST);
          d.steps.forEach((st, i) => {
            const x = i * w + 0.2, y = tops[i], low = n === 4 ? 1.8 : 1.95;
            k.head(s, String(i + 1), x, y - 0.42 + (n === 4 && !i ? 0 : 0), 0.5, 0.4, { max: 20, color: RUST, valign: 'bottom' });
            h3(s, st.h, x, y + 0.08, w - 0.35, 0.5, { color: CR, max: 12.5 });
            p(s, st.t, x, y + (n === 4 ? 0.52 : 0.4), w - 0.35, Math.min(low - 0.5 + 0.0, 5.25 - y - 0.45), { color: CR, max: 12, min: 10, ls: 1.03 });
          });
          k.foot(s, { x: 0.2, w: 9.6, y: 5.33, size: 7.5, color: SOFT });
        },
        async (d) => { // a green band across the middle carries the numbers and names; the words hang below it
          const s = await open('band', d, { c: C.ink, nc: RUST, y: 0.3, h: 1.0 }), n = d.steps.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.6 + i * (w + gap);
            k.head(s, String(i + 1), x, 1.45, 0.6, 1.05, { max: 40, color: OR, valign: 'middle' });
            h3(s, st.h, x + 0.55, 1.45, w - 0.55, 1.05, { color: CR, valign: 'middle', max: 13.5 });
            p(s, st.t, x, 2.75, w, 2.4, { max: 13, min: 10, ls: 1.1 });
          });
        },
        async (d) => { // the page halved below the title: steps in turn on the green and on the cream, numbers on the seam
          const s = await slide('halfl'), n = d.steps.length, bh = n === 4 ? 1.3 : 1.5, dy = (3.85 - bh) / (n - 1), cx = 5, w = 3.95;
          k.head(s, d.title, 0.6, 0.25, 7.7, 1.05, { max: 26, min: 14, color: C.ink, valign: 'middle' }); nb(s, 8.4, 0.3, RUST);
          foot(s, 5.4, 4.0);
          d.steps.forEach((st, i) => {
            const y = 1.5 + i * dy, r = i % 2 === 1, x = r ? cx + 0.4 : cx - 0.4 - w, al = r ? 'left' : 'right';
            k.head(s, String(i + 1), r ? cx + 0.03 : cx - 0.38, y - 0.02, 0.35, 0.35, { max: 18, color: r ? RUST : OR, align: 'center', valign: 'top' });
            h3(s, st.h, x, y + 0.02, w, 0.3, { color: r ? C.ink : CR, align: al });
            p(s, st.t, x, y + 0.33, w, bh - 0.35, { color: r ? C.ink : CR, max: 12, min: 10, ls: 1.08, align: al });
          });
        },
        async (d) => { // a wedge of green narrowing down the page, the steps following its edge
          const s = await slide('wedge'), n = d.steps.length, hh = 4.65 / n;
          k.head(s, d.title, 0.5, 0.35, 2.75, 2.0, { max: 21, min: 13, color: CR, valign: 'top' });
          nb(s, 0.5, 4.55, OR, 26, 'left'); foot(s, 2.0, 7.4, C.muted, 'right');
          d.steps.forEach((st, i) => {
            const y = 0.42 + i * hh, edge = 4.375 - (y / 5.625) * 3.44, x = edge + 0.35;
            k.head(s, String(i + 1), x, y, 0.5, 0.42, { max: 22, color: RUST, valign: 'top' });
            h3(s, st.h, x + 0.5, y + 0.05, 9.4 - x - 0.5, 0.3);
            p(s, st.t, x + 0.5, y + 0.36, 9.4 - x - 0.5, hh - 0.44, { max: 12.5, min: 10, ls: 1.08 });
          });
        },
      ],
      stats: [
        async (d) => { // the main figure alone on the green, the other two as evidence on the cream
          const s = await slide('classic'), [a, ...rest] = d.stats;
          k.head(s, d.title, 0.35, 0.3, 3.05, 1.2, { max: 18, min: 12, color: CR, valign: 'top' });
          k.head(s, a.value, 0.35, 1.6, 3.05, 1.5, { max: 66, min: 26, color: OR, valign: 'middle' });
          p(s, a.label, 0.35, 3.15, 3.05, 1.2, { color: CR, max: 13.5, min: 10.5 });
          nb(s, 2.4, 4.6, OR); foot(s, 4.15, 5.25);
          rest.forEach((v, i) => {
            const y = 0.5 + i * 1.5;
            k.head(s, v.value, 4.15, y, 5.25, 0.8, { max: 40, min: 16, color: C.ink, valign: 'top' });
            p(s, v.label, 4.15, y + 0.82, 5.25, 0.6, { max: 13, min: 10, ls: 1.05 });
          });
          if (d.note) p(s, d.note, 4.15, 3.55, 5.25, 1.55, { max: 11.5, min: 9.5, color: C.muted, ls: 1.08, valign: 'bottom' });
        },
        async (d) => { // the green takes the whole page: three lines, the figure orange at the right
          const s = await open('night', d, { fc: SOFT }), rh = d.note ? 0.85 : 1.15;
          d.stats.forEach((v, i) => {
            const y = 1.35 + i * rh;
            p(s, v.label, 0.6, y, 5.0, rh - 0.08, { color: CR, valign: 'middle', max: 14.5 });
            k.head(s, v.value, 5.8, y, 3.6, rh - 0.08, { max: 42, min: 16, color: OR, align: 'right', valign: 'middle' });
            if (i < 2) t.line(s, 0.6, y + rh - 0.04, 8.8, 0, SOFT, 0.5);
          });
          if (d.note) p(s, d.note, 0.6, 1.35 + 3 * rh + 0.04, 8.8, 5.15 - (1.35 + 3 * rh + 0.04), { color: SOFT, max: 10.5, min: 9.5, ls: 1.05 });
        },
        async (d) => { // the green rises from below; figures stand in it, title and note in the cream above
          const s = await open('low', d, { c: C.ink, nc: RUST, y: 0.3, w: 7.6, h: 0.75, fc: SOFT });
          if (d.note) p(s, d.note, 0.6, 1.08, 8.8, 1.5, { max: 12, min: 10, color: C.muted, ls: 1.08 });
          d.stats.forEach((v, i) => {
            const x = 0.6 + i * 3.0;
            k.head(s, v.value, x, 2.82, 2.8, 1.0, { max: 44, min: 18, color: OR, valign: 'middle' });
            p(s, v.label, x, 3.85, 2.75, 1.32, { color: CR, max: 13.5, min: 10.5, ls: 1.08 });
          });
        },
      ],
      compare: [
        async (d) => { // one side on each colour, from top to bottom of the page; the title opens the green half
          const s = await slide('half'), w = 4.0, { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13.5, w, F.body, 0.14, 2.75);
          k.head(s, d.title, 0.5, 0.3, 4.0, 0.95, { max: 20, min: 13, color: CR, valign: 'top' });
          nb(s, 8.4, 0.3, RUST); foot(s, 5.5, 4.0);
          k.head(s, d.left.h, 0.5, 1.35, w, 0.6, { max: 18, min: 12, color: OR, valign: 'top' });
          k.head(s, d.right.h, 5.5, 1.35, w, 0.6, { max: 18, min: 12, color: RUST, valign: 'top' });
          let y = 2.05;
          rows.forEach((rh, j) => {
            if (d.left.items[j]) k.txt(s, d.left.items[j], 0.5, y, w, rh, { size: fs, color: CR });
            if (d.right.items[j]) k.txt(s, d.right.items[j], 5.5, y, w, rh, { size: fs, color: C.ink });
            y += rh;
          });
        },
        async (d) => { // one above the other: green over cream, a heading and a running list on each
          const s = await slide('upper'), hh = 1.9;
          k.head(s, d.title, 0.6, 0.2, 7.7, 0.6, { max: 20, min: 13, color: CR, valign: 'middle' }); nb(s, 8.4, 0.2, OR);
          foot(s, 0.6, 8.8);
          [d.left, d.right].forEach((side, i) => {
            const y = i ? 2.98 : 0.86, c = i ? C.ink : CR;
            k.head(s, side.h, 0.6, y, 2.4, hh - 0.1, { max: 17, min: 12, color: i ? RUST : OR, valign: 'top' });
            side.items.forEach((it, j) => p(s, it, 3.2 + (j % 2) * 3.2, y + Math.floor(j / 2) * 0.82, 3.0, 0.78, { color: c, max: 12.5, min: 10, ls: 1.06 }));
          });
        },
      ],
      statement: [
        async (d) => { // the whole page green: the sentence and nothing to set against it
          const s = await open('night', d, { y: 0.3, w: 7.5, h: 0.6, max: 14, min: 11, c: OR, fc: SOFT });
          k.head(s, L.runs(d.text), 0.6, 1.0, 8.8, 2.6, { max: 38, min: 18, color: CR, valign: 'middle' });
          if (d.caption) p(s, d.caption, 0.6, 3.72, 6.8, 1.4, { max: 12, min: 10, color: SOFT, ls: 1.08 });
        },
        async (d) => { // the sentence on the cream at the left, the title and its note on the green at the right
          const s = await slide('flip');
          k.head(s, L.runs(d.text), 0.6, 0.55, 5.7, 4.5, { max: 34, min: 16, color: C.ink, valign: 'middle' });
          k.head(s, d.title, 6.6, 0.5, 3.0, 1.2, { max: 15, min: 11, color: OR, valign: 'top' });
          if (d.caption) p(s, d.caption, 6.6, 1.75, 3.0, 2.75, { max: 11.5, min: 10, color: CR, ls: 1.08 });
          nb(s, 6.6, 4.55, OR, 26, 'left'); foot(s, 0.6, 5.7);
        },
      ],
      timeline: [
        async (d) => { // a green stripe down the margin, the years on it, the events on the cream at its side
          const s = await open('strip', d, { c: C.ink, nc: RUST, x: 0.5, y: 0.25, h: 1.05, fx: 1.85, fw: 7.55 }), hh = 3.85 / 4;
          d.items.forEach((it, i) => {
            const y = 1.45 + i * hh;
            k.head(s, it.year, 0.08, y, 1.42, hh - 0.08, { max: 15, min: 10.5, color: OR, align: 'center', valign: 'middle' });
            h3(s, it.h, 1.85, y + 0.04, 7.55, 0.28, { max: 13 });
            p(s, it.t, 1.85, y + 0.33, 7.55, hh - 0.38, { max: 12, min: 10, ls: 1.05 });
          });
        },
        async (d) => { // four tall columns, green and cream by turns, a year at the head of each
          const s = await slide('col4'), w = 2.5;
          k.head(s, d.title, 0.3, 0.25, 8.0, 1.05, { max: 26, min: 14, color: C.ink, valign: 'middle' }); nb(s, 8.4, 0.3, RUST);
          d.items.forEach((it, i) => {
            const x = i * w + 0.2, ww = w - 0.4, inv = i % 2 === 0;
            k.head(s, it.year, x, 1.55, ww, 0.6, { max: 22, min: 13, color: inv ? OR : RUST, valign: 'top' });
            h3(s, it.h, x, 2.15, ww, 0.5, { color: inv ? CR : C.ink, max: 13 });
            p(s, it.t, x, 2.68, ww, 2.48, { color: inv ? CR : C.ink, max: 12.5, min: 10, ls: 1.08 });
          });
          foot(s, 0.3, 9.4);
        },
        async (d) => { // the page halved across: the first two years on the green above, the last two on the cream
          const s = await slide('upper'), w = 4.1;
          k.head(s, d.title, 0.6, 0.15, 7.7, 0.62, { max: 20, min: 13, color: CR, valign: 'middle' }); nb(s, 8.4, 0.15, OR);
          foot(s, 0.6, 8.8);
          d.items.forEach((it, i) => {
            const low = i > 1, x = 0.6 + (i % 2) * (w + 0.6), y = low ? 2.98 : 0.86, c = low ? C.ink : CR;
            k.head(s, it.year, x, y, 2.0, 0.42, { max: 19, min: 12, color: low ? RUST : OR, valign: 'top' });
            h3(s, it.h, x + 2.05, y + 0.08, w - 2.05, 0.32, { color: c, max: 12.5 });
            p(s, it.t, x, y + 0.48, w, 1.38, { color: c, max: 12.5, min: 10, ls: 1.08 });
          });
        },
      ],
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); R.timeline = V.timeline.shift(); R.stats = V.stats.shift(); R.cards = V.cards.shift(); // nor the first steps, years and figures the rows of the cards; the old rows set their words too small
    // the cover's subtitle and footer were dark grey on the green: the same cover, in colours that read
    R.cover = R.closing = async (d) => { const s = await slide('cover');
      if (d.image) await k.photo(s, d.image, 4.15, 0.55, 5.25, 4.45, { mask: { r: 0.04 } });
      k.txt(s, k.org3, 0.6, 0.7, 2.85, 0.6, { max: 11, color: OR, bold: true });
      k.head(s, d.title, 0.6, 1.35, 2.85, 2.3, { max: 30, min: 13, color: CR, valign: 'top' });
      k.txt(s, d.subtitle || '', 0.6, 3.7, 2.85, 0.6, { max: 11, color: SOFT });
      k.txt(s, k.M.author || '', 0.6, 4.4, 2.85, 0.4, { max: 14, bold: true, color: CR });
      k.foot(s, { x: 4.15, w: 5.25, y: 5.3, size: 7.5, color: C.muted }); };
    return V;
  },
  tone: "aniq qarama-qarshilik: asosiy fikr chapda, dalillar o'ngda" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "elegant"], "transitions": ["split", "wipe:r", "fade"], "cover": ["split", "stretch"], "mark": "popIn", "deco": "split", "sig": {"title": "split", "body": "wipe:r", "item": ["wipe:l", "wipe:r"], "image": "split", "number": "popIn", "order": "alternate", "stagger": 0.18}, "tempo": 1.1, "kenburns": false};
