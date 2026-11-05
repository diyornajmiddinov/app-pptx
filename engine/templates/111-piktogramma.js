/**
 * 111 Piktogramma — giant line icons carry every idea: each card, step and stat is led by a 1.4-inch pictogram,
 * text stays small underneath; lots of white space, a centred light title.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: 'FFFFFF', ink: '1F2933', muted: '616E7C', pal: ['2563EB', 'DB2777', '059669', 'D97706', '7C3AED', '0891B2'] };
const F = { head: 'Arial', body: 'Calibri' };
const GEN = ['FiStar', 'FiFlag', 'FiTarget', 'FiCompass', 'FiLayers', 'FiZap'];
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const ic = async (s, name, x, y, d, c, sw = 1.25) => t.img(s, await k.icon(name, c, sw), x, y, d, d);
  const page = (d) => { const s = k.slide(C.bg); if (d.title) k.head(s, d.title, 1.0, 0.25, 8.0, 0.6, { max: 22, min: 13, align: 'center', color: C.ink }); k.txt(s, String(k.idx), 4.7, 0.85, 0.6, 0.25, { size: 9, bold: true, align: 'center', color: C.pal[k.idx % 6] }); k.foot(s, { y: 5.27, align: 'center' }); return s; };
  const columns = async (s, list) => { const n = list.length, w = 9.0 / n; for (const [i, [icon, h, body]] of list.entries()) { const x = 0.5 + i * w, c = C.pal[i % 6]; await ic(s, icon, x + w / 2 - 0.7, 1.25, 1.4, c); k.head(s, h, x + 0.1, 2.8, w - 0.2, 0.5, { max: 16, align: 'center', color: c }); k.txt(s, body, x + 0.15, 3.32, w - 0.3, 1.75, { max: 13, align: 'center', color: C.muted }); } };
  const R = {
    async cover(d) { const s = k.slide(C.bg); await ic(s, 'FiBookOpen', 0.6, 0.55, 2.0, C.pal[0], 1); if (d.image) await k.photo(s, d.image, 6.3, 0.6, 3.2, 3.2, { mask: 'circle' });
      k.txt(s, k.org3, 0.6, 2.75, 5.4, 0.3, { size: 12, bold: true, color: C.pal[1] }); k.head(s, d.title, 0.6, 3.05, 5.5, 1.35, { max: 36, min: 18, valign: 'top' });
      k.txt(s, [d.subtitle, k.M.author].filter(Boolean).join('  \u2022  '), 0.6, 4.45, 8.8, 0.6, { max: 13, color: C.muted, valign: 'middle' }); k.foot(s, { y: 5.27 }); },
    async intro(d) { const s = page(d); await ic(s, 'FiInfo', 0.7, 1.4, 1.5, C.pal[0]); await k.photo(s, d.image, 6.4, 1.3, 3.1, 3.6, { mask: { r: 0.1 } }); k.txt(s, d.text, 2.5, 1.3, 3.65, 3.7, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, 0.5, 1.3, 3.1, 3.6, { mask: { r: 0.1 } }); k.txt(s, d.text, 3.85, 1.3, 3.65, 3.7, { max: 15, min: 10, ls: 1.35, valign: 'middle' }); await ic(s, 'FiImage', 7.8, 1.4, 1.5, C.pal[2]); },
    async agenda(d) { const s = page(d), n = d.items.length, cols = Math.min(3, n), rws = Math.ceil(n / cols), w = 9.0 / cols, h = 3.85 / rws;
      for (const [i, it] of d.items.entries()) { const x = 0.5 + (i % cols) * w, y = 1.2 + Math.floor(i / cols) * h; await ic(s, GEN[i % 6], x + 0.1, y + 0.1, Math.min(0.95, h - 0.3), C.pal[i % 6]); k.head(s, `${i + 1}. ${it}`, x + 1.2, y, w - 1.3, h, { max: 16 }); } },
    async cards(d) { const s = page(d); await columns(s, d.items.map((it) => [it.icon, it.h, it.t])); },
    async process(d) { const s = page(d); await columns(s, d.steps.map((st, i) => [GEN[i % 6], `${i + 1}. ${st.h}`, st.t])); for (let i = 1; i < d.steps.length; i++) k.txt(s, '\u2192', 0.5 + i * 9.0 / d.steps.length - 0.25, 1.75, 0.5, 0.5, { size: 22, color: 'C0C7D0', align: 'center' }); },
    async stats(d) { const s = page(d), n = d.stats.length, w = 9.0 / n, icons = ['FiTrendingUp', 'FiBarChart2', 'FiPieChart'];
      for (const [i, v] of d.stats.entries()) { const x = 0.5 + i * w, c = C.pal[i % 6]; await ic(s, icons[i % 3], x + w / 2 - 0.55, 1.2, 1.1, c); k.head(s, v.value, x + 0.1, 2.4, w - 0.2, 0.95, { max: 46, min: 18, align: 'center', color: c }); k.txt(s, v.label, x + 0.15, 3.35, w - 0.3, 0.95, { max: 13, align: 'center', color: C.muted }); }
      if (d.note) k.txt(s, d.note, 0.5, 4.4, 9.0, 0.6, { max: 10, align: 'center', color: C.muted }); },
    async compare(d) { const s = page(d), w = 4.2, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.15, 2.65);
      for (const [i, sd] of [d.left, d.right].entries()) { const x = i ? 5.3 : 0.5, c = C.pal[i ? 2 : 1]; await ic(s, i ? 'FiPlusCircle' : 'FiMinusCircle', x, 1.2, 0.9, c); k.head(s, sd.h, x + 1.05, 1.2, w - 1.05, 0.9, { max: 18, color: c }); let y = 2.3; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs }); y += rr[j]; }); } },
    async statement(d) { const s = page(d); await ic(s, 'FiZap', 0.7, 1.4, 2.4, C.pal[3], 1); k.head(s, L.runs(d.text), 3.4, 1.3, 6.1, 2.4, { max: 32, min: 16 }); if (d.caption) k.txt(s, d.caption, 3.4, 3.8, 6.1, 1.2, { max: 13, color: C.muted }); },
    async timeline(d) { const s = page(d); await columns(s, d.items.map((it, i) => ['FiCalendar', `${it.year} \u2022 ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); await ic(s, 'FiMessageCircle', 4.1, 1.0, 1.8, C.pal[4], 1); k.head(s, d.text, 1.0, 2.95, 8.0, 1.5, { max: 26, min: 14, italic: true, align: 'center' }); if (d.author) k.txt(s, `\u2014 ${d.author}`, 1.0, 4.5, 8.0, 0.4, { size: 13, bold: true, align: 'center', color: C.pal[4] }); },
    async sources(d) { const s = page(d), n = d.items.length, rh = 3.85 / n; for (const [i, it] of d.items.entries()) { const y = 1.2 + i * rh; await ic(s, 'FiBook', 0.6, y + (rh - 0.35) / 2, 0.35, C.pal[i % 6], 2); k.txt(s, it, 1.1, y, 8.4, rh, { max: 13, valign: 'middle' }); } },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, each led by its pictogram: a deck's pages must not look alike (L.pages)
  const NIGHT = '1F2933', FOG = 'CBD2D9', WASH = 'F1F5F9', P = C.pal, FLOW = ['FiStar', 'FiFlag', 'FiTarget', 'FiCompass'];
  const night = (d) => { // the same page with the lights out
    const s = k.slide(NIGHT);
    if (d.title) k.head(s, d.title, 1.0, 0.25, 8.0, 0.6, { max: 22, min: 13, align: 'center', color: 'FFFFFF' });
    k.txt(s, String(k.idx), 4.7, 0.85, 0.6, 0.25, { size: 9, bold: true, align: 'center', color: 'FFFFFF' });
    k.foot(s, { y: 5.27, align: 'center', color: FOG });
    return s;
  };
  const tile = async (s, name, x, y, dd, color, ink = 'FFFFFF') => { t.rect(s, x, y, dd, dd, color, { r: dd * 0.2, name: 'Sign' }); await ic(s, name, x + dd * 0.2, y + dd * 0.2, dd * 0.6, ink, 2); };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, color: C.muted, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 16, min: 11, ...o });
  const V = {
    image: [
      async (d) => { // a wide picture, a big sign pinned on its edge, the words beside the sign
        const s = page(d);
        await k.photo(s, d.image, 0.5, 1.2, 9.0, 1.85, { mask: { r: 0.1 } });
        await tile(s, 'FiImage', 0.8, 2.62, 1.1, P[k.idx % 6]);
        bd(s, d.text, 2.2, 3.15, 7.3, 1.98, { max: 14, color: C.ink, valign: 'middle', ls: 1.22 });
      },
      async (d) => { // the picture fills the page, a white sign with the words stands on it
        const s = k.slide(C.bg), x = 5.0, w = 4.6, c = P[(k.idx + 2) % 6];
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, 0, 5.2, 10, 0.425, C.bg, { name: 'Footer band' });
        t.rect(s, x, 0.3, w, 4.72, C.bg, { r: 0.15, name: 'Sign' });
        await ic(s, 'FiImage', x + 0.25, 0.42, 0.7, c);
        k.head(s, d.title || '', x + 1.05, 0.42, w - 1.65, 0.7, { max: 17, min: 12 });
        k.txt(s, String(k.idx), x + w - 0.6, 0.42, 0.4, 0.7, { size: 10, bold: true, align: 'right', valign: 'middle', color: c });
        bd(s, d.text, x + 0.25, 1.2, w - 0.5, 3.7, { max: 14, color: C.ink, valign: 'middle', ls: 1.22 });
        k.foot(s, { y: 5.31, align: 'center' });
      },
      async (d) => { // lights out: a great round picture, a pictogram above the words
        const s = night(d), dd = 3.75;
        await k.photo(s, d.image, 5.65, 1.25, dd, dd, { mask: 'circle' });
        await ic(s, 'FiEye', 0.6, 1.2, 0.85, 'FFFFFF');
        bd(s, d.text, 0.6, 2.12, 4.7, 3.0, { max: 14, color: 'FFFFFF', ls: 1.22 });
      },
      async (d) => { // the picture takes the shape of a map pin
        const s = page(d), w = 3.1, h = 3.9, x = 0.8, y = 1.18;
        await k.photo(s, d.image, x, y, w, h, { mask: { path: 'M0.5,1 C0.3,0.72 0.02,0.56 0.02,0.37 A0.48,0.37 0 0 1 0.98,0.37 C0.98,0.56 0.7,0.72 0.5,1 Z' } });
        bd(s, d.text, 4.3, 1.25, 5.2, 3.85, { max: 15, color: C.ink, valign: 'middle', ls: 1.28 });
      },
    ],
    cards: [
      async (d) => { // four corners, each a big pictogram with its words beside it
        const s = page(d), n = d.items.length, w = 4.4, h = 1.92;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9.0 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.22 + Math.floor(i / 2) * (h + 0.04), c = P[i % 6];
          await ic(s, it.icon, x, y + 0.2, 1.2, c);
          hd(s, it.h, x + 1.35, y + 0.05, ww - 1.35, 0.46, { align: 'left', color: c, max: 15 });
          bd(s, it.t, x + 1.35, y + 0.52, ww - 1.35, h - 0.58, { max: 12.5, ls: 1.15 });
        }
      },
      async (d) => { // road signs: a row each, colour sign first, words running on from it
        const s = page(d), n = d.items.length, h = 3.88 / n, dd = Math.min(0.82, h - 0.14);
        for (const [i, it] of d.items.entries()) {
          const y = 1.22 + i * h, c = P[(i + 2) % 6];
          t.rect(s, 0.5, y + 0.03, 9.0, h - 0.06, WASH, { r: 0.08, name: 'Row' });
          await tile(s, it.icon, 0.6, y + (h - dd) / 2, dd, c);
          hd(s, it.h, 0.72 + dd, y + 0.05, 2.85 - dd + 0.1, h - 0.1, { color: C.ink, max: 15, align: 'left' });
          bd(s, it.t, 3.75, y + 0.05, 5.6, h - 0.1, { valign: 'middle', max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // lights out: pictograms glow, by turns above and below the words
        const s = night(d), n = d.items.length, w = 9.0 / n, bright = ['60A5FA', 'F472B6', '34D399', 'FBBF24'], top = 1.2, bottom = 5.12;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * w, c = bright[i % 4], up = i % 2 === 0, dd = 1.15, tw = w - 0.2;
          await ic(s, it.icon, x + tw / 2 - dd / 2, up ? top : bottom - dd, dd, c);
          hd(s, it.h, x, up ? top + dd + 0.06 : top, tw, 0.56, { color: c, align: 'center', max: 14 });
          bd(s, it.t, x, up ? top + dd + 0.64 : top + 0.58, tw, 3.92 - dd - 0.66, { color: 'FFFFFF', align: 'center', max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // the first idea wears a giant pictogram, the others small ones
        const s = page(d), [a, ...rest] = d.items, h = 3.88 / rest.length, c = P[4];
        await ic(s, a.icon, 0.6, 1.22, 1.75, c, 1);
        hd(s, a.h, 0.6, 3.02, 3.8, 0.56, { align: 'left', color: c, max: 20, min: 13 });
        bd(s, a.t, 0.6, 3.6, 3.8, 1.52, { max: 13.5, ls: 1.18 });
        t.line(s, 4.7, 1.3, 0, 3.75, FOG, 0.75);
        for (const [i, it] of rest.entries()) {
          const y = 1.22 + i * h, ci = P[(i + 5) % 6];
          await ic(s, it.icon, 4.95, y + 0.08, 0.72, ci, 1.5);
          hd(s, it.h, 5.82, y + 0.03, 3.68, 0.42, { align: 'left', color: ci, max: 14.5 });
          bd(s, it.t, 5.82, y + 0.46, 3.68, h - 0.52, { max: 12.5, ls: 1.12 });
        }
      },
    ],
    process: [
      async (d) => { // the signs climb a dashed road, each higher than the last
        const s = page(d), n = d.steps.length, w = 9.0 / n, dd = 0.8, rise = n === 4 ? 0.32 : 0.42, y0 = 1.2 + (n - 1) * rise;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * w, y = y0 - i * rise, c = P[i % 6];
          if (i < n - 1) t.line(s, x + dd + 0.03, y + dd / 2 - rise, w - dd - 0.06, rise, FOG, 1.5, { dash: 'dash', flipV: true });
          await tile(s, FLOW[i % 4], x, y, dd, c);
          hd(s, `${i + 1}. ${st.h}`, x, y + dd + 0.04, w - 0.16, 0.56, { align: 'left', color: c, max: 13.5, valign: 'top' });
          bd(s, st.t, x, y + dd + 0.62, w - 0.16, 5.13 - y - dd - 0.62, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // whole columns of colour, a white pictogram on each
        const s = page(d), n = d.steps.length, w = 10 / n, ink = 'FFFFFF', fills = ['1D4ED8', 'BE185D', '047857', 'B45309'];
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, c = fills[i % 4];
          t.rect(s, x, 1.15, w, 4.05, c, { name: 'Column' });
          await ic(s, FLOW[i % 4], x + 0.25, 1.3, 0.85, ink);
          k.txt(s, String(i + 1), x + w - 0.8, 1.3, 0.55, 0.85, { size: 26, bold: true, font: F.head, color: ink, align: 'right', valign: 'middle', ls: 1 });
          hd(s, st.h, x + 0.25, 2.22, w - 0.45, 0.58, { color: ink, align: 'left', max: 14 });
          bd(s, st.t, x + 0.25, 2.82, w - 0.45, 2.3, { color: ink, max: 12.5 });
        }
      },
      async (d) => { // arrows point down a line, the steps standing to either side
        const s = page(d), n = d.steps.length, per = Math.ceil(n / 2), cx = 5, h = 3.9 / per, w = 3.9;
        t.line(s, cx, 1.2, 0, 3.92, FOG, 1.5);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.22 + Math.floor(i / 2) * h + (right ? 0.68 : 0), x = right ? cx + 0.48 : cx - 0.48 - w, a = right ? 'left' : 'right', c = P[i % 6];
          await tile(s, i === n - 1 ? 'FiCheck' : 'FiArrowDown', cx - 0.32, y, 0.64, c);
          hd(s, `${i + 1}. ${st.h}`, x, y, w, 0.4, { align: a, color: c, max: 14 });
          bd(s, st.t, x, y + 0.42, w, Math.min(h - 0.5, 5.13 - y - 0.42), { align: a, max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // lights out: a departures board, each line a number and a pointing arrow
        const s = night(d), n = d.steps.length, h = 3.88 / n, bright = ['60A5FA', 'F472B6', '34D399', 'FBBF24'];
        for (const [i, st] of d.steps.entries()) {
          const y = 1.22 + i * h, c = bright[i % 4];
          if (i) t.line(s, 0.5, y, 9.0, 0, '4A5766', 0.75);
          k.txt(s, String(i + 1), 0.5, y, 0.75, h, { size: 34, bold: true, font: F.head, color: c, valign: 'middle', ls: 1 });
          hd(s, st.h, 1.3, y + 0.05, 2.5, h - 0.1, { color: 'FFFFFF', align: 'left', max: 14 });
          bd(s, st.t, 3.9, y + 0.05, 4.8, h - 0.1, { color: FOG, valign: 'middle', max: 12.5, ls: 1.12 });
          await ic(s, i === n - 1 ? 'FiCheckCircle' : 'FiArrowRight', 8.85, y + h / 2 - 0.28, 0.56, c, 2);
        }
      },
    ],
    stats: [
      async (d) => { // a giant pictogram beside the great number, the two others in small under it
        const s = page(d), [a, ...rest] = d.stats, c = P[0];
        await ic(s, 'FiTrendingUp', 0.55, 1.2, 1.8, c, 1);
        k.txt(s, a.value, 2.55, 1.15, 6.95, 1.2, { size: L.fit(a.value, 6.9, 1.15, 80, 28, F.head, true), bold: true, font: F.head, color: c, valign: 'middle', ls: 1 });
        bd(s, a.label, 2.55, 2.38, 6.95, 0.62, { color: C.ink, max: 16 });
        for (const [i, v] of rest.entries()) { const x = 0.55 + i * 4.6, ci = P[i + 1];
          await ic(s, i ? 'FiPieChart' : 'FiBarChart2', x, 3.12, 0.72, ci);
          hd(s, v.value, x + 0.85, 3.08, 3.45, 0.46, { align: 'left', color: ci, max: 24, min: 14 });
          bd(s, v.label, x + 0.85, 3.54, 3.45, 0.4, { max: 11.5 }); }
        if (d.note) bd(s, d.note, 0.55, 4.05, 8.9, 1.08, { valign: 'middle', italic: true, max: 12.5 });
      },
      async (d) => { // three great colour signs at different heights, a white pictogram at the head of each
        const s = page(d), w = 2.85, ys = [1.2, 1.5, 1.2], h = 2.5, fills = ['1D4ED8', 'BE185D', '047857'], icons = ['FiTrendingUp', 'FiBarChart2', 'FiPieChart'];
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * (w + 0.225), y = ys[i];
          t.rect(s, x, y, w, h, fills[i], { r: 0.12, name: 'Sign' });
          await ic(s, icons[i], x + 0.2, y + 0.16, 0.56, 'FFFFFF', 2);
          hd(s, v.value, x + 0.2, y + 0.74, w - 0.4, 0.82, { color: 'FFFFFF', align: 'left', max: 38, min: 18 });
          bd(s, v.label, x + 0.2, y + 1.58, w - 0.4, 0.82, { color: 'FFFFFF', max: 12.5 });
        }
        if (d.note) bd(s, d.note, 0.5, 4.08, 9.0, 1.05, { align: 'center', valign: 'middle', italic: true, max: 12.5 });
      },
      async (d) => { // lights out: three lines, pictogram then figure then words
        const s = night(d), rh = 0.98, bright = ['60A5FA', 'F472B6', '34D399'], icons = ['FiTrendingUp', 'FiBarChart2', 'FiPieChart'];
        for (const [i, v] of d.stats.entries()) {
          const y = 1.2 + i * rh;
          await ic(s, icons[i], 0.55, y + 0.1, 0.76, bright[i], 1.5);
          hd(s, v.value, 1.55, y, 3.3, rh - 0.06, { color: bright[i], align: 'left', max: 38, min: 18 });
          bd(s, v.label, 4.95, y, 4.55, rh - 0.06, { color: 'FFFFFF', valign: 'middle', max: 14 });
        }
        if (d.note) { t.line(s, 0.55, 4.18, 8.9, 0, '4A5766', 0.75); bd(s, d.note, 0.55, 4.24, 8.9, 0.92, { color: FOG, valign: 'middle', max: 12.5 }); }
      },
    ],
    compare: [
      async (d) => { // two colour halves mirror each other, the name and a large pictogram at the foot of each
        const s = page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i * 5, fill = i ? '047857' : 'BE185D', tx = i ? 5.35 : 0.4, w = 4.25, a = i ? 'left' : 'right', n = sd.items.length, rh = 2.92 / n;
          t.rect(s, x, 1.15, 5, 4.05, fill, { name: 'Side' });
          await ic(s, i ? 'FiPlusCircle' : 'FiMinusCircle', i ? tx : tx + w - 0.72, 4.3, 0.72, 'FFFFFF', 1.5);
          hd(s, sd.h, i ? tx + 0.84 : tx, 4.26, w - 0.84, 0.8, { color: 'FFFFFF', align: a, max: 18, min: 12 });
          sd.items.forEach((it, j) => bd(s, it, tx, 1.25 + j * rh, w, rh - 0.05, { color: 'FFFFFF', align: a, valign: 'middle', ls: 1.12 }));
        }
      },
      async (d) => { // two pale shelves, a tick or a cross in front of every point
        const s = page(d), h = 1.9;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 1.2 + i * (h + 0.08), c = P[i ? 2 : 1], n = sd.items.length, w = 3.2, rows = Math.ceil(n / 2), rh = (h - 0.16) / rows;
          t.rect(s, 0.5, y, 9.0, h, WASH, { r: 0.08, name: 'Shelf' });
          await ic(s, i ? 'FiPlusCircle' : 'FiMinusCircle', 0.72, y + 0.15, 0.72, c, 1.5);
          hd(s, sd.h, 0.65, y + 0.92, 1.95, h - 1.0, { align: 'left', color: c, max: 14, valign: 'top' });
          for (const [j, it] of sd.items.entries()) {
            const x = 2.75 + (j % 2) * (w + 0.08), yy = y + 0.08 + Math.floor(j / 2) * rh, lone = n === 3 && j === 2;
            await ic(s, i ? 'FiCheck' : 'FiX', x, yy + 0.05, 0.24, c, 2.5);
            bd(s, it, x + 0.3, yy, (lone ? 2 * w : w) - 0.3, rh - 0.04, { max: 12, ls: 1.1, color: C.ink, valign: 'middle' });
          }
        }
      },
    ],
    statement: [
      async (d) => { // lights out: a vast dim pictogram behind the words
        const s = night(d);
        await ic(s, 'FiZap', 3.1, 1.08, 3.8, '344150', 1);
        k.head(s, L.runs(d.text), 0.9, 1.3, 8.2, 2.3, { max: 32, min: 16, color: 'FFFFFF', align: 'center' });
        if (d.caption) bd(s, d.caption, 1.2, 3.72, 7.6, 1.38, { color: FOG, align: 'center', max: 13.5 });
      },
      async (d) => { // a colour page, a pictogram running off the right edge of the words
        const s = k.slide('1D4ED8');
        if (d.title) k.head(s, d.title, 0.6, 0.25, 8.8, 0.6, { max: 22, min: 13, color: 'FFFFFF' });
        k.txt(s, String(k.idx), 9.0, 0.85, 0.5, 0.25, { size: 9, bold: true, align: 'right', color: 'FFFFFF' });
        await ic(s, 'FiMessageCircle', 6.5, 1.3, 3.3, '3B6FE8', 1);
        k.head(s, L.runs(d.text), 0.6, 1.15, 6.6, 2.5, { max: 34, min: 16, color: 'FFFFFF' });
        if (d.caption) bd(s, d.caption, 0.6, 3.72, 8.4, 1.42, { color: 'FFFFFF', max: 13.5 });
        k.foot(s, { y: 5.27, align: 'center', color: 'E4ECFD' });
      },
    ],
    timeline: [
      async (d) => { // four tear-off calendar leaves, each hung a little lower
        const s = page(d), w = 2.2, fills = [P[0], P[1], P[2], P[3]];
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * (w + 0.067), y = 1.18 + i * 0.1, h = 5.14 - y, c = fills[i];
          t.rect(s, x, y, w, h, 'FFFFFF', { line: { color: FOG, width: 1 }, r: 0.06, name: 'Leaf' });
          t.rect(s, x, y, w, 0.62, c, { r: 0.06, name: 'Leaf head' });
          await ic(s, 'FiCalendar', x + 0.12, y + 0.14, 0.34, 'FFFFFF', 2);
          hd(s, it.year, x + 0.52, y, w - 0.6, 0.62, { color: 'FFFFFF', align: 'left', max: 15, min: 10.5 });
          hd(s, it.h, x + 0.12, y + 0.68, w - 0.24, 0.48, { color: c, align: 'left', max: 13.5 });
          bd(s, it.t, x + 0.12, y + 1.18, w - 0.24, h - 1.24, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // a clock sign on a level line, events above and below by turns
        const s = page(d), mid = 3.15, step = 1.85, w = 3.5;
        t.line(s, 0.3, mid, 9.4, 0, FOG, 2);
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * step, up = i % 2 === 0, y = up ? 1.15 : mid + 0.32, h = up ? mid - 0.3 - y : 5.15 - y, c = P[i % 6];
          await tile(s, 'FiClock', x, mid - 0.25, 0.5, c);
          k.txt(s, [{ text: it.year + '  ', options: { bold: true, color: c } }, { text: it.h, options: { bold: true, color: C.ink } }], x, y, w, 0.38, { font: F.head, bold: true, max: 13.5, min: 10.5, valign: 'middle', ls: 1.05 });
          bd(s, it.t, x, y + 0.4, w, h - 0.42, { max: 12.5, ls: 1.12 });
        }
      },
      async (d) => { // lights out: a flag at each year along a pole down the left
        const s = night(d), rh = 3.9 / 4, bright = ['60A5FA', 'F472B6', '34D399', 'FBBF24'];
        t.line(s, 0.88, 1.2, 0, 3.92, '4A5766', 2);
        for (const [i, it] of d.items.entries()) {
          const y = 1.2 + i * rh, c = bright[i];
          t.oval(s, 0.55, y + rh / 2 - 0.33, 0.66, 0.66, NIGHT, { line: { color: c, width: 1.5 } });
          await ic(s, 'FiFlag', 0.7, y + rh / 2 - 0.18, 0.36, c, 2);
          hd(s, it.year, 1.42, y + 0.04, 1.65, rh - 0.08, { color: c, align: 'left', max: 20, min: 11 });
          hd(s, it.h, 3.1, y + 0.04, 2.0, rh - 0.08, { color: 'FFFFFF', align: 'left', max: 13.5 });
          bd(s, it.t, 5.15, y + 0.04, 4.35, rh - 0.08, { color: FOG, valign: 'middle', max: 12.5, ls: 1.1 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old big-icon columns of these looked like the card columns
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Piktogramma', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '334155', lt2: 'F1F5F9', accent1: C.pal[0], accent2: C.pal[1], accent3: C.pal[2], accent4: C.pal[3], accent5: C.pal[4], accent6: C.pal[5], hlink: C.pal[0], folHlink: C.muted } });
}
module.exports = { id: 111, slug: 'piktogramma', name: 'Piktogramma', category: 'minimalist', photos: true, build, style: { tone: "vizual-qisqa: har bir g'oya bitta tasvir va bir-ikki jumla bilan", limits: { card_t3: 80, card_t4: 60 }, prefer: null } };
