/**
 * 140 Tarozi — a BALANCE SCALE: a brass pillar and beam with two hanging pans; ideas are weighed — split
 * between the left and right pans, the statement sits on the fulcrum plate. Plum and brass on pale lilac.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'F6F2F8', ink: '2A1B33', muted: '5E4F66', brass: 'B8860B', brass2: 'DAA520', plum: '4A1942', pan: 'FFFFFF' };
const F = { head: 'Georgia', body: 'Calibri' };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const scale = (s, tilt = 0) => { t.rect(s, 4.9, 1.25, 0.2, 3.9, C.brass, { name: 'Pillar' }); t.rect(s, 4.3, 5.05, 1.4, 0.12, C.brass, { name: 'Base' }); t.line(s, 1.25, 1.3 - tilt, 7.5, 2 * tilt || 0.001, C.brass, 4, { flipV: tilt > 0 }); t.oval(s, 4.85, 1.12, 0.3, 0.3, C.brass2);
    [[1.25, 1.3 - tilt], [8.75, 1.3 + tilt]].forEach(([x, y]) => { t.line(s, x, y, -0.95, 0.42, C.brass, 1, { flipH: true }); t.line(s, x, y, 0.95, 0.42, C.brass, 1); }); };
  // two pans (cards hanging from the beam ends): returns boxes
  const pans = (s, tilt = 0) => [[0.3, 1.72 - tilt], [7.8, 1.72 + tilt]].map(([x, y]) => { t.rect(s, x, y, 1.9, 0.08, C.brass, { name: 'Pan rim' }); return { x: x - 0.05, y: y + 0.12 }; });
  const page = (d, tilt = 0) => { const s = k.slide(C.bg); scale(s, tilt); if (d.title) k.head(s, d.title, 0.4, 0.2, 8.2, 0.75, { max: 24, min: 13, italic: true }); k.txt(s, String(k.idx), 8.9, 0.2, 0.7, 0.75, { size: 18, font: F.head, color: C.brass, align: 'right', valign: 'middle' }); k.foot(s, { y: 5.32, size: 7.5, w: 3.9 }); return s; };
  // split a list into the two pans: left = first half, right = second half; each pan is a column 4.2 wide
  const weigh = (s, list, draw) => { const n = list.length, half = Math.ceil(n / 2), cols = [list.slice(0, half), list.slice(half)]; cols.forEach((col, c) => { const x = c ? 5.35 : 0.3, w = 4.35, y0 = 1.95, H = 3.1; if (!col.length) return; const rh = H / col.length; t.rect(s, x, y0 - 0.05, w, H + 0.1, C.pan, { r: 0.08, line: { color: 'D9CCE3', width: 1 }, name: 'Pan' }); col.forEach((it, j) => { const i = c ? half + j : j; draw(i, x + 0.2, y0 + j * rh, w - 0.4, rh); if (j < col.length - 1) t.line(s, x + 0.2, y0 + (j + 1) * rh, w - 0.4, 0, 'E7DDEE', 0.75); }); }); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); scale(s, 0.18); pans(s, 0.18); if (d.image) await k.photo(s, d.image, 7.85, 2.05, 1.8, 1.8, { mask: 'circle' }); t.rect(s, 0.25, 1.95, 2.0, 1.8, C.plum, { r: 0.08, name: 'Weight' });
      k.txt(s, k.org3, 0.4, 0.3, 9.2, 0.35, { size: 12, bold: true, color: C.brass, align: 'center' }); t.rect(s, 2.3, 3.5, 5.4, 1.52, C.bg, { name: 'Plate' }); k.head(s, d.title, 2.4, 3.52, 5.2, 0.98, { max: 26, min: 14, italic: true, align: 'center' }); k.txt(s, k.M.author || '', 0.3, 2.3, 1.9, 1.1, { max: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' }); if (d.subtitle) k.txt(s, d.subtitle, 2.4, 4.52, 5.2, 0.48, { max: 11, color: C.muted, align: 'center' }); k.foot(s, { y: 5.32, size: 7.5, w: 3.9 }); },
    async intro(d) { const s = page(d, -0.15); pans(s, -0.15); await k.photo(s, d.image, 0.3, 1.8, 3.5, 3.3, { mask: { r: 0.08 } }); t.rect(s, 5.35, 2.05, 4.35, 3.05, C.pan, { r: 0.08, name: 'Pan' }); k.txt(s, d.text, 5.55, 2.15, 3.95, 2.85, { max: 14, min: 9.5, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); weigh(s, d.items, (i, x, y, w, h) => k.head(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 15 })); },
    async cards(d) { const s = page(d); weigh(s, d.items, (i, x, y, w, h) => { k.head(s, d.items[i].h, x, y, w, 0.42, { max: 14, color: C.plum }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async process(d) { const s = page(d, -0.12); weigh(s, d.steps, (i, x, y, w, h) => { k.head(s, `${i + 1}. ${d.steps[i].h}`, x, y, w, 0.42, { max: 14, color: C.plum }); k.txt(s, d.steps[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async stats(d) { const s = page(d); weigh(s, d.stats, (i, x, y, w, h) => { k.head(s, d.stats[i].value, x, y, 1.6, h, { max: 36, min: 14, color: C.brass }); k.txt(s, d.stats[i].label, x + 1.7, y, w - 1.7, h, { max: 12, valign: 'middle' }); }); if (d.note) k.txt(s, d.note, 5.35, 5.17, 4.35, 0.4, { max: 9, color: C.muted, valign: 'middle' }); },
    async compare(d) { const s = page(d, 0.12), w = 3.95, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w, F.body, 0.08, 2.5);
      [d.left, d.right].forEach((sd, i) => { const x = i ? 5.35 : 0.3; t.rect(s, x, 1.95, 4.35, 3.15, C.pan, { r: 0.08, line: { color: 'D9CCE3', width: 1 }, name: 'Pan' }); k.head(s, sd.h, x + 0.2, 2.0, w, 0.45, { max: 15, color: i ? C.brass : C.plum }); let y = 2.5; sd.items.forEach((it, j) => { k.txt(s, `\u2022 ${it}`, x + 0.2, y, w, rr[j], { size: fs }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); t.rect(s, 1.8, 1.85, 6.4, 2.05, C.plum, { r: 0.1, name: 'Plate' }); k.head(s, L.runs(d.text), 2.0, 1.9, 6.0, 1.95, { max: 24, min: 12, color: 'FFFFFF', align: 'center', italic: true }); if (d.caption) { t.rect(s, 1.0, 3.98, 8.0, 1.02, C.pan, { r: 0.06, name: 'Pan' }); k.txt(s, d.caption, 1.2, 4.0, 7.6, 0.98, { max: 11.5, color: C.muted, align: 'center', valign: 'middle', ls: 1.1 }); } },
    async timeline(d) { const s = page(d, -0.1); weigh(s, d.items, (i, x, y, w, h) => { k.head(s, `${d.items[i].year} \u2022 ${d.items[i].h}`, x, y, w, 0.42, { max: 14, color: C.plum }); k.txt(s, d.items[i].t, x, y + 0.42, w, h - 0.45, { max: 12, color: C.muted }); }); },
    async quote(d) { const s = page({}); t.rect(s, 1.5, 2.0, 7.0, 2.6, C.pan, { r: 0.1, line: { color: C.brass, width: 1.5 }, name: 'Plate' }); k.head(s, `\u201C${d.text}\u201D`, 1.8, 2.05, 6.4, 2.0, { max: 24, min: 12, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.8, 4.05, 6.4, 0.45, { size: 13, bold: true, color: C.brass, align: 'center' }); },
    async sources(d) { const s = page(d); weigh(s, d.items, (i, x, y, w, h) => k.txt(s, `${i + 1}. ${d.items[i]}`, x, y, w, h, { max: 11, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all from the weighing room: a deck's pages must not look alike (L.pages)
  const PLUM = C.plum, BR = C.brass, BR2 = C.brass2, PAL = 'E3CFA0', LILAC = 'D9CCE3', WH = 'FFFFFF';
  const poly = async (s, pts, fill, x, y, w, h) => { const W = Math.round(w * 100), H = Math.round(h * 100); t.img(s, await k.svg(`pl${pts}${fill}${W}x${H}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><polygon points="${pts.map(([a, b]) => `${a * W},${b * H}`).join(' ')}" fill="#${fill}"/></svg>`, W, H), x, y, w, h); };
  const weight = async (s, x, y, w, h, fill) => { const nob = Math.min(0.3, w * 0.2); t.oval(s, x + w / 2 - nob / 2, y - nob + 0.04, nob, nob, null, { line: { color: fill, width: 4 }, name: 'Knob' }); await poly(s, [[0.14, 0], [0.86, 0], [1, 1], [0, 1]], fill, x, y, w, h); };
  const strings = (s, cx, y0, dx, y1, c = BR) => { t.line(s, cx - dx, y0, dx, y1 - y0, c, 1, { flipV: true }); t.line(s, cx, y0, dx, y1 - y0, c, 1); };
  const pg = (d, o = {}) => { const s = k.slide(o.bg || C.bg), ink = o.ink || C.ink; if (d.title) k.head(s, d.title, o.x ?? 0.4, o.y ?? 0.2, o.w ?? 8.2, o.h ?? 0.75, { max: o.max ?? 24, min: 13, italic: true, color: ink }); k.txt(s, String(k.idx), o.nx ?? 8.9, 0.2, 0.7, 0.75, { size: 18, font: F.head, color: o.num || BR, align: 'right', valign: 'middle' }); k.foot(s, { x: o.fx ?? 0.4, y: 5.32, w: o.fw ?? 9.2, size: 7.5, color: o.foot || C.muted }); return s; };
  const dark = (d, o = {}) => pg(d, { bg: PLUM, ink: WH, num: BR2, foot: LILAC, ...o });
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14, min: 10, ls: 1.18, color: C.muted, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, color: PLUM, ...o });
  const V = {
    image: [
      async (d) => { // the picture rides in a round pan hung from a short beam
        const s = pg(d, { w: 4.5, h: 1.05, fw: 4.6 }), dd = 3.2, cx = 7.3, y = 1.75;
        t.rect(s, 5.4, 0.98, 3.8, 0.07, BR, { name: 'Beam' }); t.oval(s, cx - 0.14, 0.87, 0.28, 0.28, BR2);
        strings(s, cx, 1.05, 1.42, y + 0.55);
        t.oval(s, cx - dd / 2 - 0.08, y - 0.08, dd + 0.16, dd + 0.16, BR);
        await k.photo(s, d.image, cx - dd / 2, y, dd, dd, { mask: 'circle' });
        bd(s, d.text, 0.4, 1.3, 4.6, 3.9, { valign: 'middle', ls: 1.28, color: C.ink, max: 15 });
      },
      async (d) => { // the picture fills the page, a plum plate hangs in front with the words
        const s = k.slide(PLUM); await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, 4.7, 0.35, 4.95, 4.75, PLUM, { line: { color: BR2, width: 1.5 }, name: 'Plate' });
        k.head(s, d.title || '', 4.95, 0.45, 3.85, 1.05, { max: 22, min: 13, color: WH, italic: true });
        k.txt(s, String(k.idx), 8.85, 0.45, 0.6, 0.5, { size: 18, font: F.head, color: BR2, align: 'right' });
        bd(s, d.text, 4.95, 1.55, 4.45, 3.45, { color: WH, valign: 'middle', max: 13 });
        t.rect(s, 0, 5.25, 10, 0.375, PLUM, { name: 'Foot band' }); k.foot(s, { x: 0.4, y: 5.32, w: 9.2, size: 7.5, color: LILAC });
      },
      async (d) => { // dark page: the picture lies in the bowl of a pan, words in the other arm's place
        const s = dark(d, { x: 4.95, w: 3.85, h: 1.05, fx: 4.95, fw: 4.65 }), y = 2.1, w = 4.4, h = 2.75, x = 0.3, cx = x + w / 2;
        t.rect(s, 0.3, 0.5, 4.4, 0.07, BR2, { name: 'Beam' }); t.oval(s, cx - 0.14, 0.39, 0.28, 0.28, BR2);
        strings(s, cx, 0.57, w / 2 - 0.05, y, BR2);
        await k.photo(s, d.image, x, y, w, h, { mask: { path: 'M0,0 L1,0 C1,0.62 0.76,1 0.5,1 C0.24,1 0,0.62 0,0 Z' } });
        t.rect(s, x - 0.1, y - 0.04, w + 0.2, 0.08, BR2, { name: 'Rim' });
        bd(s, d.text, 4.95, 1.35, 4.65, 3.85, { color: WH, valign: 'middle', ls: 1.25, max: 14.5 });
      },
      async (d) => { // the picture is a wide band on a beam, the fulcrum points to the words below
        const s = pg({}), h = 2.65;
        await k.photo(s, d.image, 0, 0, 10, h);
        t.rect(s, 0, h, 10, 0.09, BR, { name: 'Beam' });
        await poly(s, [[0, 0], [1, 0], [0.5, 1]], BR, 4.75, h + 0.09, 0.5, 0.22);
        k.head(s, d.title || '', 0.4, h + 0.15, 4.2, 0.72, { max: 20, min: 13, color: C.ink, italic: true });
        k.txt(s, String(k.idx), 8.9, h + 0.2, 0.7, 0.45, { size: 18, font: F.head, color: BR, align: 'right' });
        bd(s, d.text, 0.4, h + 0.9, 9.2, 1.7, { color: C.ink, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // brass weights stand along a beam, the words below it
        const s = pg(d), n = d.items.length, w = 9.2 / n, wy = 1.3, ww = 1.15, wh = 0.8;
        t.rect(s, 0.3, wy + wh, 9.4, 0.07, BR, { name: 'Beam' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2;
          await weight(s, cx - ww / 2, wy, ww, wh, i % 2 ? PLUM : BR);
          t.img(s, await k.icon(it.icon, WH, 2), cx - 0.18, wy + 0.2, 0.36, 0.36);
          hd(s, it.h, x + 0.06, wy + wh + 0.14, w - 0.12, 0.56, { align: 'center', max: 15 });
          bd(s, it.t, x + 0.06, wy + wh + 0.72, w - 0.12, 5.2 - wy - wh - 0.72, { align: 'center', max: 13 });
        }
      },
      async (d) => { // dark page: white certificates with a brass edge
        const s = dark(d), n = d.items.length, W = 4.5, H = 1.97, boxes = n === 4 ? [[0.4, 1.1], [5.1, 1.1], [0.4, 3.2], [5.1, 3.2]] : [[0.4, 1.1], [5.1, 1.1], [0.4, 3.2]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = boxes[i], w = n === 3 && i === 2 ? 9.2 : W;
          t.rect(s, x, y, w, H, C.bg, { name: 'Paper' }); t.rect(s, x, y, 0.12, H, BR2, { name: 'Edge' });
          t.img(s, await k.icon(it.icon, PLUM, 2), x + 0.3, y + 0.16, 0.38, 0.38);
          hd(s, it.h, x + 0.8, y + 0.12, w - 1.0, 0.48, { max: 15 });
          bd(s, it.t, x + 0.3, y + 0.66, w - 0.5, H - 0.76, { max: 13, color: C.ink });
        }
      },
      async (d) => { // the beam tips: cards hang from it on strings, each higher than the last
        const s = pg(d, { w: 5.8, h: 0.8, nx: 8.9 }), n = d.items.length, gap = 0.18, w = (9.2 - gap * (n - 1)) / n, y1 = 1.95, y2 = 1.15, lx = 0.25, lw = 9.5;
        t.line(s, lx, y2, lw, y1 - y2, BR, 4, { flipV: true });
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * (w + gap), cx = x + w / 2, by = y1 - (y1 - y2) * (cx - lx) / lw, top = by + 0.32;
          strings(s, cx, by, Math.min(0.6, w / 2 - 0.1), top);
          t.rect(s, x, top, w, 5.22 - top, C.pan, { r: 0.06, line: { color: LILAC, width: 1 }, name: 'Pan' });
          t.img(s, await k.icon(it.icon, BR, 2), x + 0.14, top + 0.12, 0.32, 0.32);
          hd(s, it.h, x + 0.14, top + 0.46, w - 0.26, 0.54, { max: 14, valign: 'top' });
          bd(s, it.t, x + 0.14, top + 1.0, w - 0.26, 5.18 - top - 1.0, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // a graduated rule stands at the left, one row against each mark
        const s = pg(d), n = d.items.length, rh = 4.08 / n; let m = '';
        for (let i = 0; i <= 40; i++) m += `<rect x="0" y="${i * 10}" width="${i % 5 ? 12 : 26}" height="2" fill="#${BR}"/>`;
        t.rect(s, 0.4, 1.08, 0.08, 4.1, BR, { name: 'Rule' });
        t.img(s, await k.svg('rule', `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="402">${m}</svg>`, 30, 402), 0.48, 1.08, 0.3, 4.1);
        for (const [i, it] of d.items.entries()) {
          const y = 1.1 + i * rh, c = y + rh / 2;
          t.oval(s, 1.0, c - 0.32, 0.64, 0.64, PLUM);
          t.img(s, await k.icon(it.icon, WH, 2), 1.15, c - 0.17, 0.34, 0.34);
          hd(s, it.h, 1.85, y + 0.04, 2.5, rh - 0.08, { max: 16 });
          bd(s, it.t, 4.45, y + 0.04, 5.15, rh - 0.08, { valign: 'middle', max: 13 });
          if (i) t.line(s, 1.0, y, 8.6, 0, LILAC, 1);
        }
      },
    ],
    process: [
      async (d) => { // the pillar of the scale as a spine, an arm reaches out to each step in turn
        const s = pg(d), n = d.steps.length, rh = 4.1 / n, w = 4.05;
        t.rect(s, 4.93, 1.02, 0.14, 4.2, BR, { name: 'Pillar' });
        for (const [i, st] of d.steps.entries()) {
          const y = 1.06 + i * rh, right = i % 2 === 1, x = right ? 5.55 : 0.4, a = right ? 'left' : 'right', dd = Math.min(0.52, rh - 0.14);
          t.rect(s, right ? 5 : 4.5, y + rh / 2 - 0.025, 0.5, 0.05, BR, { name: 'Arm' });
          t.oval(s, 5 - dd / 2, y + (rh - dd) / 2, dd, dd, PLUM);
          k.txt(s, String(i + 1), 5 - dd / 2, y + (rh - dd) / 2, dd, dd, { size: 14, bold: true, font: F.head, color: WH, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, y + 0.02, w, 0.36, { align: a, max: 15 });
          bd(s, st.t, x, y + 0.38, w, rh - 0.42, { align: a, max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // a stack of weights: the first and lightest on top, each next one wider
        const s = pg(d, { h: 0.72 }), n = d.steps.length, h = 4.12 / n, wTop = n === 4 ? 6.0 : 6.6, wBot = 9.6, fills = n === 4 ? [PAL, BR2, BR, PLUM] : [BR2, BR, PLUM];
        for (const [i, st] of d.steps.entries()) {
          const w0 = wTop + (wBot - wTop) * i / n, w1 = wTop + (wBot - wTop) * (i + 1) / n, y = 1.05 + i * h, f = fills[i], ink = f === PLUM ? WH : C.ink, ins = (w1 - w0) / 2 / w1;
          await poly(s, [[ins, 0], [1 - ins, 0], [1, 1], [0, 1]], f, 5 - w1 / 2, y, w1, h - 0.04);
          const tx = 5 - w0 / 2 + 0.15, tw = w0 - 0.3;
          k.txt(s, `${i + 1}`, tx, y, 0.55, h - 0.04, { size: 26, bold: true, font: F.head, color: ink, valign: 'middle', ls: 1 });
          hd(s, st.h, tx + 0.55, y + 0.02, tw - 0.55, 0.32, { color: ink, max: 14 });
          bd(s, st.t, tx + 0.55, y + 0.34, tw - 0.55, h - 0.42, { color: ink, max: 12, ls: 1.08 });
        }
      },
      async (d) => { // dark page: large brass numerals over narrow columns, a hairline between
        const s = dark(d), n = d.steps.length, w = 9.2 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w;
          if (i) t.line(s, x - 0.08, 1.2, 0, 3.95, BR2, 0.75);
          k.txt(s, String(i + 1), x + 0.06, 1.1, w - 0.2, 1.0, { size: 58, font: F.head, italic: true, color: BR2, valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.06, 2.15, w - 0.26, 0.56, { color: WH, valign: 'top' });
          bd(s, st.t, x + 0.06, 2.75, w - 0.26, 2.42, { color: WH, max: 13.5 });
        }
      },
      async (d) => { // the dial of a shop scale: numbers run round its arc, the words below
        const s = pg(d, { h: 0.68 }), n = d.steps.length, w = 9.2 / n, cx = 5, cy = 3.05, r = 1.82;
        t.img(s, await k.svg('dial', `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="210"><path d="M12,205 A188,188 0 0 1 388,205 Z" fill="#${C.pan}" stroke="#${BR}" stroke-width="8"/><circle cx="200" cy="205" r="14" fill="#${PLUM}"/></svg>`, 400, 210), cx - 2.0, cy - 2.05, 4.0, 2.1);
        for (const [i, st] of d.steps.entries()) {
          const a = Math.PI * (1 - (i + 0.5) / n), mx = cx + r * 0.8 * Math.cos(a), my = cy - r * 0.8 * Math.sin(a), x = 0.4 + i * w;
          t.oval(s, mx - 0.2, my - 0.2, 0.4, 0.4, PLUM);
          k.txt(s, String(i + 1), mx - 0.2, my - 0.2, 0.4, 0.4, { size: 13, bold: true, font: F.head, color: WH, align: 'center', valign: 'middle', ls: 1 });
          hd(s, `${i + 1}. ${st.h}`, x + 0.05, cy + 0.12, w - 0.2, 0.52, { valign: 'top', max: 14 });
          bd(s, st.t, x + 0.05, cy + 0.66, w - 0.2, 5.22 - cy - 0.66, { max: 12, ls: 1.1 });
        }
      },
    ],
    stats: [
      async (d) => { // the first figure is cast on a great plum weight, the others listed beside it
        const s = pg(d), [a, ...rest] = d.stats, x = 0.4, y = 1.5, w = 4.3, h = 3.65;
        await weight(s, x, y, w, h, PLUM);
        hd(s, a.value, x + 0.7, y + 0.5, w - 1.4, 1.2, { max: 50, min: 24, color: BR2, align: 'center' });
        bd(s, a.label, x + 0.6, y + 1.8, w - 1.2, 1.2, { color: WH, align: 'center', max: 14 });
        rest.forEach((v, i) => { const yy = 1.12 + i * 1.12; hd(s, v.value, 5.1, yy, 1.9, 1.0, { max: 32, min: 16, color: BR }); bd(s, v.label, 7.05, yy, 2.55, 1.0, { valign: 'middle', max: 13 }); t.line(s, 5.1, yy + 1.05, 4.5, 0, LILAC, 1); });
        if (d.note) bd(s, d.note, 5.1, 3.42, 4.5, 1.8, { valign: 'middle', italic: true, max: 13 });
      },
      async (d) => { // three round pans hang from one beam, a figure in each
        const s = pg(d, { h: 0.65 }), w = 9.2 / 3, dd = 1.72, y = 1.42;
        t.rect(s, 0.3, 0.98, 9.4, 0.07, BR, { name: 'Beam' });
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2;
          strings(s, cx, 1.05, 0.72, y + 0.22);
          t.oval(s, cx - dd / 2, y, dd, dd, i === 1 ? PLUM : C.pan, { line: { color: BR, width: 3 } });
          hd(s, v.value, cx - dd / 2 + 0.1, y + 0.2, dd - 0.2, dd - 0.4, { max: 28, min: 13, color: i === 1 ? WH : PLUM, align: 'center' });
          bd(s, v.label, x + 0.1, y + dd + 0.06, w - 0.2, 0.68, { align: 'center', max: 12, ls: 1.08 });
        }
        if (d.note) bd(s, d.note, 0.4, 3.98, 9.2, 1.24, { valign: 'middle', italic: true, align: 'center', max: 13 });
      },
      async (d) => { // dark page: figures as lines of a certificate, the note down the right side
        const s = dark(d);
        for (const [i, v] of d.stats.entries()) {
          const y = 1.15 + i * 1.34;
          hd(s, v.value, 0.4, y, 5.8, 0.72, { color: BR2, max: 42, min: 20 });
          bd(s, v.label, 0.4, y + 0.72, 5.8, 0.48, { color: WH, max: 13, ls: 1.05 });
          if (i < 2) t.line(s, 0.4, y + 1.26, 5.8, 0, BR2, 0.75);
        }
        t.rect(s, 6.6, 1.15, 3.0, 3.98, C.bg, { name: 'Note' });
        if (d.note) bd(s, d.note, 6.8, 1.3, 2.6, 3.68, { color: C.ink, valign: 'middle', italic: true, max: 14 });
      },
    ],
    compare: [
      async (d) => { // the page is parted in two colours, a fulcrum at the foot of the parting
        const s = k.slide(C.bg);
        t.rect(s, 0, 0, 10, 1.0, PLUM, { name: 'Top' }); t.rect(s, 0, 1.0, 5, 4.24, PLUM, { name: 'Half' });
        await poly(s, [[0.5, 0], [1, 1], [0, 1]], BR, 4.55, 4.75, 0.9, 0.49);
        k.head(s, d.title || '', 0.4, 0.2, 8.2, 0.75, { max: 24, min: 13, italic: true, color: WH });
        k.txt(s, String(k.idx), 8.9, 0.2, 0.7, 0.75, { size: 18, font: F.head, color: BR2, align: 'right', valign: 'middle' });
        k.foot(s, { x: 0.4, y: 5.32, w: 9.2, size: 7.5, color: C.muted });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.35 : 0.4, w = 4.25, a = i ? 'left' : 'right', rh = 3.05 / sd.items.length;
          hd(s, sd.h, x, 1.05, w, 0.55, { align: a, max: 19, color: i ? PLUM : BR2 });
          sd.items.forEach((it, j) => bd(s, it, x, 1.65 + j * rh, w, rh - 0.05, { align: a, valign: 'middle', color: i ? C.ink : WH, max: 13.5 }));
        }
      },
      async (d) => { // one side on the upper pan, the other on the lower: two bands with a brass rim
        const s = pg(d, { h: 0.68 }), bands = [[1.02, C.pan, PLUM, C.ink], [3.18, PLUM, BR2, WH]];
        for (const [i, sd] of [d.left, d.right].entries()) {
          const [y, f, hc, ink] = bands[i], h = 2.03, m = sd.items.length, rh = (h - 0.14) / m;
          t.rect(s, 0, y, 10, h, f, { name: 'Band' }); t.rect(s, 0, y + h - 0.05, 10, 0.07, BR, { name: 'Rim' });
          hd(s, sd.h, 0.4, y + 0.1, 2.4, h - 0.25, { color: hc, max: 19, min: 12 });
          sd.items.forEach((it, j) => { const yy = y + 0.04 + j * rh; t.oval(s, 3.0, yy + rh / 2 - 0.05, 0.1, 0.1, BR2); bd(s, it, 3.2, yy, 6.4, rh, { color: ink, valign: 'middle', max: 12.5, ls: 1.05 }); });
        }
      },
    ],
    statement: [
      async (d) => { // dark page: the verdict in large type, a small scale in balance above the caption
        const s = dark(d, { max: 17, h: 0.55 });
        k.head(s, L.runs(d.text), 0.8, 0.85, 8.4, 2.55, { max: 32, min: 16, color: WH, italic: true, align: 'center' });
        t.rect(s, 4.1, 3.5, 1.8, 0.04, BR2, { name: 'Beam' }); t.oval(s, 4.91, 3.43, 0.18, 0.18, BR2); await poly(s, [[0.5, 0], [1, 1], [0, 1]], BR2, 4.8, 3.54, 0.4, 0.16);
        if (d.caption) bd(s, d.caption, 0.8, 3.78, 8.4, 1.44, { color: LILAC, align: 'center', valign: 'middle', max: 13.5 });
      },
      async (d) => { // the thought is cast on one heavy brass weight, its explanation at the foot
        const s = pg(d, { max: 18, h: 0.55 });
        await weight(s, 1.0, 1.05, 8.0, 2.75, BR2);
        k.head(s, L.runs(d.text), 1.85, 1.12, 6.3, 2.6, { max: 26, min: 14, color: C.ink, align: 'center', italic: true });
        if (d.caption) bd(s, d.caption, 0.5, 3.88, 9.0, 1.34, { align: 'center', valign: 'middle', max: 13.5 });
      },
    ],
    timeline: [
      async (d) => { // a brass rule along the top with its marks, each period hangs on its own length of string
        const s = pg(d, { h: 0.68 }), w = 9.2 / 4, drop = [0, 0.32, 0.1, 0.42]; let m = '';
        for (let i = 0; i <= 100; i++) m += `<rect x="${i * 10}" y="0" width="2" height="${i % 5 ? 14 : 30}" fill="#${PLUM}"/>`;
        t.rect(s, 0, 0.96, 10, 0.46, BR2, { name: 'Rule' });
        t.img(s, await k.svg('ruleH', `<svg xmlns="http://www.w3.org/2000/svg" width="1002" height="30">${m}</svg>`, 1002, 30), 0, 0.96, 10, 0.3);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, top = 1.6 + drop[i];
          t.line(s, x + 0.12, 1.42, 0, top - 1.42 + 0.1, PLUM, 1);
          t.rect(s, x, top, w - 0.14, 5.22 - top, C.pan, { line: { color: LILAC, width: 1 }, name: 'Card' });
          hd(s, it.year, x + 0.12, top + 0.06, w - 0.36, 0.42, { color: BR, max: 18, min: 11 });
          hd(s, it.h, x + 0.12, top + 0.48, w - 0.36, 0.38, { max: 13 });
          bd(s, it.t, x + 0.12, top + 0.88, w - 0.36, 5.18 - top - 0.88, { max: 12, ls: 1.1 });
        }
      },
      async (d) => { // a plum column at the left carries the title and a pillar, years stand against it
        const s = pg({}, { fx: 3.2, fw: 6.4 }), rh = 4.9 / 4;
        t.rect(s, 0, 0, 2.9, 5.625, PLUM, { name: 'Column' });
        k.head(s, d.title || '', 0.3, 0.35, 2.35, 2.6, { max: 24, min: 14, color: WH, italic: true, valign: 'top' });
        t.rect(s, 2.86, 0, 0.08, 5.625, BR2, { name: 'Pillar' });
        for (const [i, it] of d.items.entries()) {
          const y = 0.3 + i * rh;
          t.rect(s, 2.9, y + 0.2, 0.28, 0.05, BR2, { name: 'Arm' });
          hd(s, it.year, 3.25, y, 2.2, 0.44, { color: BR, max: 20, min: 12 });
          hd(s, it.h, 5.5, y, 3.3, 0.44, { max: 15 });
          bd(s, it.t, 3.25, y + 0.46, 6.35, rh - 0.52, { max: 13, ls: 1.12 });
        }
      },
      async (d) => { // dark page: the periods step down the page from left to right
        const s = dark(d, { h: 0.72 }), rh = 1.03, dx = 1.3;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * dx, y = 1.05 + i * rh;
          t.rect(s, x, y, 1.45, rh - 0.06, BR2, { name: 'Year' });
          hd(s, it.year, x + 0.06, y, 1.33, rh - 0.06, { color: C.ink, max: 17, min: 10, align: 'center' });
          const rw = 9.7 - x - 1.45;
          t.rect(s, x + 1.45, y, rw, rh - 0.06, C.bg, { name: 'Row' });
          hd(s, it.h, x + 1.55, y + 0.02, rw - 0.2, 0.3, { max: 13 });
          bd(s, it.t, x + 1.55, y + 0.31, rw - 0.2, rh - 0.38, { max: 11.5, ls: 1.02, color: C.ink });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old two pans were the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Tarozi', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.plum, lt2: C.bg, accent1: C.plum, accent2: C.brass, accent3: C.brass2, accent4: '7A3E73', accent5: C.muted, accent6: 'D9CCE3', hlink: C.plum, folHlink: C.muted } });
}
module.exports = { id: 140, slug: 'tarozi', name: 'Tarozi', category: 'academic', photos: true, build, style: { tone: "adolatli muvozanat: ikki tomon dalillari, xolis tortish va asosli xulosa", limits: {}, prefer: 'text' } };
