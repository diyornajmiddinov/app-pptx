/** 163 Tuman — minimalist, background-driven (narrow composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 163, slug: 'tuman', name: "Tuman", mode: 'narrow', list: 'rows', num: 'none', F: { head: 'Georgia', body: 'Georgia' },
  C: { ink: '3A3F44', muted: '7A8188', accent: '5C6B73' }, photo: { r: 0.04 }, rule: true, caps: false, bold: false,
  bg: (kind) => compose(flat('EEF0F1'), blobs([[300,250,380,'FFFFFF',0.95],[1250,650,420,'FFFFFF',0.9],[800,450,300,'DDE1E4',0.6]],kind==='cover'?110:160), grain(0.04)),
  ways: ({ k, t, L, C, F, slide, page, num, hair }, R) => {
    // ---- further ways to draw a type, in fog: one thin column drifting in a lot of white, things half seen: a deck's pages must not look alike (L.pages)
    const R0 = { bold: false };
    const open = async (kind, d, x = 2.2, y = 0.4, w = 5.6, h = 0.85, o = {}) => { const s = await slide(kind); if (d.title) k.head(s, d.title, x, y, w, h, { max: 26, min: 13, color: C.ink, align: 'center', valign: 'bottom', ...R0, ...o }); num(s); k.foot(s, { x: 0.7, w: 8.6, y: 5.3, size: 7.5, color: C.muted, align: 'center' }); return s; };
    const p = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13.5, min: 10, color: C.ink, ls: 1.25, ...o });
    const h3 = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 15, min: 11, color: C.ink, valign: 'top', ...R0, italic: true, ...o });
    const veil = (s, x, y, w, h, tt = 45) => t.rect(s, x, y, w, h, 'EEF0F1', { t: tt, name: 'Fog' });
    const mist = (w, h, dir) => k.svg(`mist${dir}`, `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="${dir === 'h' ? 0 : 0}" y1="${dir === 'h' ? 0 : 0}" x2="${dir === 'h' ? 1 : 0}" y2="${dir === 'h' ? 0 : 1}"><stop offset="0" stop-color="#EEF0F1" stop-opacity="0"/><stop offset="1" stop-color="#EEF0F1" stop-opacity="1"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/></svg>`, 400, 400);
    const pale = (s, src, x, y, w, h, o = {}) => k.photo(s, src, x, y, w, h, { gray: true, ...o });
    const V = {
      image: [
        async (d) => { // a grey picture dissolving downward into the page, the words low in the column
          const s = await open('page', {});
          await pale(s, d.image, 0, 0, 10, 2.45);
          t.img(s, await mist(10, 1.5, 'v'), 0, 0.95, 10, 1.5, { alt: '' });
          k.head(s, d.title, 2.0, 2.48, 6.0, 0.8, { max: 24, min: 13, color: C.ink, align: 'center', bold: false });
          p(s, d.text, 1.7, 3.32, 6.6, 1.88, { align: 'center', max: 13 });
        },
        async (d) => { // a slim picture standing alone in the white, the column beside it
          const s = await open('page', {});
          await pale(s, d.image, 1.5, 0.75, 2.1, 4.15, { mask: { r: 0.04 } });
          k.head(s, d.title, 4.3, 0.75, 4.2, 1.0, { max: 24, min: 13, color: C.ink, valign: 'bottom', bold: false });
          hair(s, 4.3, 1.86, 1.0);
          p(s, d.text, 4.3, 1.98, 4.2, 2.95, { max: 13 });
        },
        async (d) => { // the picture fills the page, seen through fog: the words stand in a clearing
          const s = await slide('page');
          await pale(s, d.image, 0, 0, 10, 5.625);
          veil(s, 0, 0, 10, 5.625, 32);
          veil(s, 2.0, 0, 6.0, 5.625, 12);
          k.head(s, d.title, 2.4, 0.5, 5.2, 1.1, { max: 24, min: 13, color: C.ink, align: 'center', valign: 'bottom', bold: false });
          p(s, d.text, 2.4, 1.72, 5.2, 3.4, { align: 'center', max: 13.5 });
          k.foot(s, { x: 2.4, w: 5.2, y: 5.3, size: 7.5, color: C.ink, align: 'center' });
        },
        async (d) => { // the picture is a pale round glow in the fog, the words to the right
          const s = await open('page', {});
          const dd = 3.3;
          await pale(s, d.image, 0.9, 1.15, dd, dd, { mask: 'circle' });
          t.oval(s, 0.9, 1.15, dd, dd, 'EEF0F1', { t: 55, name: 'Fog' });
          k.head(s, d.title, 4.75, 0.85, 4.1, 1.0, { max: 24, min: 13, color: C.ink, valign: 'bottom', bold: false });
          p(s, d.text, 4.75, 1.97, 4.1, 3.15, { max: 13 });
        },
      ],
      cards: [
        async (d) => { // one column, each item a little further into the fog on the right
          const s = await page(d), n = d.items.length, hh = 3.6 / n;
          for (const [i, it] of d.items.entries()) {
            const y = 1.48 + i * hh, x = 1.6 + i * (n === 4 ? 0.5 : 0.7);
            t.img(s, await L.icon(it.icon, C.accent, 1.25), x - 0.42, y + 0.02, 0.28, 0.28);
            h3(s, it.h, x, y, 5.6, 0.32, { max: 14 });
            p(s, it.t, x, y + 0.32, 5.6, hh - 0.38, { max: 12.5, min: 10, color: C.muted, ls: 1.15 });
          }
        },
        async (d) => { // the title hangs alone at the left, the items in a slim file on the right
          const s = await open('focus', d, 0.9, 1.3, 2.9, 2.2, { align: 'left', valign: 'top', max: 22 }), n = d.items.length, hh = 4.5 / n;
          d.items.forEach((it, i) => {
            const y = 0.55 + i * hh;
            h3(s, it.h, 4.4, y, 4.7, 0.34, { max: 14 });
            p(s, it.t, 4.4, y + 0.34, 4.7, hh - 0.42, { max: 12.5, color: C.muted, ls: 1.15 });
            if (i < n - 1) hair(s, 4.4, y + hh - 0.05, 0.9);
          });
        },
        async (d) => { // shapes coming out of the fog at two depths
          const s = await page(d), n = d.items.length, gap = 0.3, w = (8.6 - gap * (n - 1)) / n;
          for (const [i, it] of d.items.entries()) {
            const x = 0.7 + i * (w + gap), y = i % 2 ? 2.2 : 1.45, hh = i % 2 ? 2.95 : 2.95;
            t.img(s, await L.icon(it.icon, i % 2 ? C.muted : C.accent, 1.25), x, y, 0.32, 0.32);
            h3(s, it.h, x, y + 0.38, w, 0.52, { max: 14 });
            p(s, it.t, x, y + 0.92, w, 5.15 - y - 0.92, { max: 12.5, color: i % 2 ? C.muted : C.ink, ls: 1.12 });
          }
        },
        async (d) => { // names on a slim left margin, their words in a wide, pale right column
          const s = await open('page', d, 0.9, 0.4, 8.2, 0.85, { align: 'left' }), n = d.items.length, w = 3.95, hh = 1.76;
          d.items.forEach((it, i) => {
            const wide = n === 3 && i === 2, x = 0.9 + (i % 2) * (w + 0.35), y = 1.45 + Math.floor(i / 2) * (hh + 0.08), ww = wide ? 8.25 : w;
            hair(s, x, y, ww);
            h3(s, it.h, x, y + 0.08, ww, 0.34, { max: 14 });
            p(s, it.t, x, y + 0.44, ww, hh - 0.5, { max: 12.5, color: C.muted, ls: 1.15 });
          });
        },
      ],
      process: [
        async (d) => { // the way through: a slim path of steps, only the next one clear
          const s = await page(d), n = d.steps.length, hh = 3.62 / n;
          d.steps.forEach((st, i) => {
            const y = 1.47 + i * hh;
            t.text(s, String(i + 1), { x: 1.5, y, w: 0.55, h: 0.36, fontFace: F.head, fontSize: 18, color: C.accent, align: 'right', valign: 'middle', italic: true });
            t.line(s, 2.2, y + 0.04, 0, hh - 0.14, C.accent, 0.5);
            h3(s, st.h, 2.38, y, 6.0, 0.32, { max: 14 });
            p(s, st.t, 2.38, y + 0.32, 6.0, hh - 0.38, { max: 12.5, ls: 1.12, color: C.muted });
          });
        },
        async (d) => { // the steps in thin columns, numbers very pale above them
          const s = await page(d), n = d.steps.length, gap = 0.45, w = (8.2 - gap * (n - 1)) / n;
          d.steps.forEach((st, i) => {
            const x = 0.9 + i * (w + gap);
            t.text(s, String(i + 1), { x, y: 1.4, w, h: 1.05, fontFace: F.head, fontSize: 60, color: 'B9C0C5', valign: 'middle', noShrink: true });
            h3(s, st.h, x, 2.48, w, 0.52, { max: 14 });
            p(s, st.t, x, 3.02, w, 2.12, { max: 12.5, ls: 1.12 });
          });
        },
        async (d) => { // lamps in the fog: a step left, a step right, zigzagging down a hair
          const s = await page(d), n = d.steps.length, w = 3.85, cx = 5, hh = 3.62 / n;
          t.line(s, cx, 1.5, 0, 3.6, C.accent, 0.5);
          d.steps.forEach((st, i) => {
            const right = i % 2 === 1, y = 1.47 + i * hh, x = right ? cx + 0.3 : cx - 0.3 - w, a = right ? 'left' : 'right';
            t.oval(s, cx - 0.05, y + 0.1, 0.1, 0.1, C.accent);
            h3(s, `${i + 1}  ${st.h}`, x, y, w, 0.32, { max: 14, align: a });
            p(s, st.t, x, y + 0.32, w, Math.min(hh - 0.36 + (n === 4 ? 0.3 : 0), 5.16 - y - 0.32), { max: 12, ls: 1.1, align: a, color: C.muted });
          });
        },
        async (d) => { // everything to the left half, the title far off at the right
          const s = await open('focus', d, 6.1, 1.5, 3.2, 2.4, { align: 'right', valign: 'middle', max: 22 }), n = d.steps.length, hh = 4.5 / n;
          d.steps.forEach((st, i) => {
            const y = 0.55 + i * hh;
            h3(s, `${i + 1}.  ${st.h}`, 0.8, y, 4.9, 0.34, { max: 14 });
            p(s, st.t, 0.8, y + 0.34, 4.9, hh - 0.4, { max: 12.5, ls: 1.15, color: C.muted });
          });
        },
      ],
      stats: [
        async (d) => { // one number faint and enormous; the words stand in front of it
          const s = await page(d), [a, b, c] = d.stats;
          k.head(s, a.value, 0.6, 1.25, 8.8, 1.5, { max: 96, min: 30, color: '838C93', align: 'center', bold: false });
          p(s, a.label, 2.2, 2.75, 5.6, 0.42, { align: 'center', max: 14 });
          [b, c].forEach((x, i) => {
            const xx = i ? 5.2 : 1.6;
            k.head(s, x.value, xx, 3.18, 3.2, 0.48, { max: 22, min: 13, color: C.accent, align: 'center', bold: false });
            p(s, x.label, xx, 3.66, 3.2, 0.44, { align: 'center', max: 10.5, min: 9.5, color: C.muted, ls: 1.05 });
          });
          if (d.note) p(s, d.note, 1.2, 4.22, 7.6, 0.95, { align: 'center', max: 10, min: 9, color: C.muted, ls: 1.05 });
        },
        async (d) => { // a slim column of numbers, centred, a short hair between them
          const s = await page(d), rh = d.note ? 0.95 : 1.18;
          d.stats.forEach((x, i) => {
            const y = 1.45 + i * rh;
            k.head(s, x.value, 2.2, y, 5.6, rh * 0.56, { max: 28, min: 14, color: C.accent, align: 'center', bold: false });
            p(s, x.label, 2.2, y + rh * 0.56, 5.6, rh * 0.4, { align: 'center', max: 12, min: 9.5, ls: 1.05 });
          });
          if (d.note) p(s, d.note, 1.2, 4.32, 7.6, 0.88, { align: 'center', max: 10.5, min: 9.5, color: C.muted, ls: 1.1 });
        },
        async (d) => { // numbers drifting across at three heights
          const s = await open('focus', d, 0.8, 0.4, 8.4, 0.85, { align: 'left' }), w = 2.6, ys = [1.45, 2.05, 2.65];
          d.stats.forEach((x, i) => {
            const xx = 0.8 + i * (w + 0.3), y = ys[i];
            k.head(s, x.value, xx, y, w, 0.72, { max: 32, min: 14, color: C.accent, bold: false });
            p(s, x.label, xx, y + 0.72, w, 0.7, { max: 12, ls: 1.1 });
            hair(s, xx, y + 0.7, 0.7);
          });
          if (d.note) p(s, d.note, 0.8, 3.15, 4.9, 2.0, { max: 11, min: 9.5, color: C.muted, valign: 'bottom', ls: 1.1 });
        },
      ],
      compare: [
        async (d) => { // the two sides drift apart: the second set lower, a hair between
          const s = await page(d), w = 3.8;
          const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 13, w, F.body, 0.16, 2.35);
          [d.left, d.right].forEach((side, i) => {
            const x = i ? 5.2 : 1.0, top = i ? 2.0 : 1.45;
            h3(s, side.h, x, top, w, 0.4, { max: 18, min: 12, color: i ? C.accent : C.ink });
            let y = top + 0.45;
            side.items.forEach((it, j) => { k.txt(s, it, x, y, w, rows[j], { size: fs, color: C.ink, ls: 1 }); y += rows[j]; });
          });
          t.line(s, 5, 1.45, 0, 3.65, C.accent, 0.5);
        },
        async (d) => { // first what is clear, then what is still in the fog
          const s = await page(d), hh = 1.78;
          [d.left, d.right].forEach((side, i) => {
            const y = 1.47 + i * (hh + 0.04);
            h3(s, side.h, 0.8, y, 8.4, 0.34, { max: 16, color: i ? C.muted : C.accent, align: 'center' });
            side.items.forEach((it, j) => p(s, it, 1.05 + (j % 2) * 4.1, y + 0.36 + Math.floor(j / 2) * 0.68, 3.8, 0.64, { max: 12.5, ls: 1.08, color: i ? C.muted : C.ink, align: j % 2 ? 'left' : 'right' }));
            if (!i) hair(s, 3.5, y + hh - 0.02, 3.0);
          });
        },
      ],
      statement: [
        async (d) => { // the words alone in the white, the note a long way below
          const s = await open('focus', {});
          k.head(s, L.runs(d.text), 1.4, 0.55, 7.2, 2.75, { max: 36, min: 16, color: C.ink, align: 'center', valign: 'middle', bold: false, italic: true });
          hair(s, 4.5, 3.5, 1.0);
          k.head(s, d.title, 2.2, 3.58, 5.6, 0.34, { max: 12, min: 9, color: C.muted, align: 'center', bold: false });
          if (d.caption) p(s, d.caption, 1.7, 3.95, 6.6, 1.25, { align: 'center', max: 11.5, min: 9.5, color: C.muted, ls: 1.12 });
        },
        async (d) => { // the thought at the far left, the note far right, fog between
          const s = await open('page', d, 0.8, 0.4, 8.4, 0.85, { align: 'left' });
          k.head(s, L.runs(d.text), 0.8, 1.5, 5.1, 3.6, { max: 30, min: 15, color: C.ink, valign: 'top', bold: false });
          if (d.caption) p(s, d.caption, 6.75, 2.0, 2.45, 3.15, { max: 12, min: 9.5, color: C.muted, valign: 'bottom', ls: 1.12 });
        },
      ],
      timeline: [
        async (d) => { // the words set to a hair from the left, the years out on the right of it
          const s = await page(d), hh = 3.62 / 4, cols = [C.muted, C.muted, C.accent, C.ink];
          d.items.forEach((it, i) => {
            const y = 1.47 + i * hh;
            h3(s, it.h, 0.8, y, 6.0, 0.3, { max: 13.5, italic: false, align: 'right' });
            p(s, it.t, 0.8, y + 0.3, 6.0, hh - 0.35, { max: 12, min: 10, ls: 1.08, color: C.muted, align: 'right' });
            t.line(s, 7.0, y + 0.03, 0, hh - 0.12, C.accent, 0.5);
            k.head(s, it.year, 7.2, y, 2.0, hh - 0.1, { max: 18, min: 10.5, color: cols[i], valign: 'top', bold: false, italic: true });
          });
        },
        async (d) => { // four thin columns at two depths
          const s = await page(d), gap = 0.32, w = (8.4 - gap * 3) / 4;
          d.items.forEach((it, i) => {
            const x = 0.8 + i * (w + gap), y = i % 2 ? 1.95 : 1.45;
            k.head(s, it.year, x, y, w, 0.48, { max: 20, min: 11, color: C.accent, valign: 'bottom', bold: false });
            hair(s, x, y + 0.52, w);
            h3(s, it.h, x, y + 0.58, w, 0.5, { max: 13.5 });
            p(s, it.t, x, y + 1.08, w, 5.16 - y - 1.08, { max: 12.5, ls: 1.1 });
          });
        },
        async (d) => { // two pairs apart, the title between them
          const s = await open('page', {}), w = 3.55, hh = 2.2;
          k.head(s, d.title, 3.6, 2.2, 2.8, 1.25, { max: 18, min: 11, color: C.ink, align: 'center', bold: false });
          const spots = [[0.5, 0.4], [6.0, 0.55], [0.5, 2.9], [6.0, 3.05]];
          d.items.forEach((it, i) => {
            const [x, y] = spots[i], right = i % 2, a = right ? 'right' : 'left';
            k.head(s, it.year, x, y, w, 0.44, { max: 20, min: 11, color: C.accent, align: a, bold: false });
            h3(s, it.h, x, y + 0.44, w, 0.32, { max: 14, align: a });
            p(s, it.t, x, y + 0.76, w, 1.34, { max: 12.5, ls: 1.1, align: a });
          });
        },
      ],
    };
    R.intro = async (d) => { // the old page squeezed long text under the picture: now side by side
      const s = await page(d);
      await k.photo(s, d.image, 1.0, 1.5, 2.9, 3.55, { mask: { r: 0.04 } });
      p(s, d.text, 4.2, 1.45, 5.0, 3.7, { max: 14, valign: 'middle', ls: 1.2 });
    };
    R.image = V.image.shift(); // the first picture page must not mirror the introduction
    R.process = V.process.shift(); // the old rows look like the cards
    R.stats = V.stats.shift(); // and so do the old stat rows
    R.timeline = V.timeline.shift(); // and the old timeline rows
    return V;
  },
  tone: "tumandagi aniqlik: sokin, vazmin, keraksiz so'zlarsiz" });
