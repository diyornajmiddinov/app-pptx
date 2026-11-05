/**
 * 39 Metro — transit map: thick coloured metro lines with 45-degree turns, stations,
 * interchanges and station signs; the agenda, process and timeline become metro lines.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'FFFFFF', ink: '1C1C1C', muted: '666666', sign: '1C2B4A', gray: 'D0D0D0', lines: ['E53935', '1E88E5', '43A047', 'FB8C00', '8E24AA', 'FDD835'] };
const F = { head: 'Arial', body: 'Arial' };
const LW = 0.14; // line width (inches)

const mapSvg = () => { // decorative network for the cover
  const ln = (pts, col) => `<polyline points="${pts}" fill="none" stroke="#${col}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>`;
  const st = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="#1C1C1C" stroke-width="6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
   ${ln('40,180 300,180 520,400 860,400', C.lines[0])}${ln('200,40 200,520 420,740 860,740', C.lines[1])}${ln('40,620 300,620 520,400 520,60', C.lines[2])}${ln('660,860 660,400 860,200', C.lines[3])}
   ${st(200, 180)}${st(300, 180)}${st(520, 400)}${st(660, 400)}${st(200, 520)}${st(420, 740)}${st(300, 620)}${st(520, 60)}${st(660, 740)}${st(860, 200)}
   <circle cx="520" cy="400" r="26" fill="#fff" stroke="#1C1C1C" stroke-width="7"/></svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const map = await L.svg(mapSvg(), 900, 900);
  const station = (s, cx, cy, d = 0.32, inter = false) => {
    t.oval(s, cx - d / 2, cy - d / 2, d, d, 'FFFFFF', { line: { color: C.ink, width: inter ? 3 : 2.25 } });
    if (inter) t.oval(s, cx - d / 2 + 0.07, cy - d / 2 + 0.07, d - 0.14, d - 0.14, null, { line: { color: C.ink, width: 1.25 } });
  };
  const hLine = (s, x, y, w, col) => t.rect(s, x, y - LW / 2, w, LW, col, { r: LW / 2, name: 'Metro line' });
  const vLine = (s, x, y, h, col) => t.rect(s, x - LW / 2, y, LW, h, col, { r: LW / 2, name: 'Metro line' });
  const badge = (s, x, y, d, col, txt) => { t.oval(s, x, y, d, d, col); t.text(s, txt, { x, y, w: d, h: d, fontSize: Math.round(d * 30), bold: true, color: col === C.lines[5] ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' }); };
  const footer = (s) => {
    t.rect(s, 0, 5.25, W, 0.375, C.sign, { name: 'Sign strip' });
    C.lines.slice(0, 4).forEach((c, k) => t.oval(s, 0.45 + k * 0.22, 5.355, 0.16, 0.16, c));
    t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 1.4, y: 5.25, w: 8.2, h: 0.375, fontSize: 9, color: 'FFFFFF', valign: 'middle' });
  };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    const col = C.lines[idx % 5];
    badge(s, 0.55, 0.4, 0.6, col, 'M');
    t.text(s, TR.stop(idx), { x: 8.2, y: 0.45, w: 1.25, h: 0.5, fontSize: 11, bold: true, color: C.muted, align: 'right', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.35, y: 0.38, w: 6.8, h: 0.65, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 6.8, 0.65, 28, 16, F.head, true) });
    hLine(s, 0.55, 1.18, 8.9, col);
    footer(s);
    return s;
  };
  const photo = async (s, src, x, y, w, h, col) => { t.rect(s, x, y, w, h, col, { r: 0.2, name: 'Photo frame' }); t.img(s, await L.photo(L.src(src), w - 0.2, h - 0.2, { mask: { r: 0.14 } }), x + 0.1, y + 0.1, w - 0.2, h - 0.2, { alt: '' }); };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    t.img(s, map, 5.3, 0.35, 4.5, 4.5);
    if (d.image) await photo(s, d.image, 6.1, 1.3, 2.6, 2.0, C.ink);
    badge(s, 0.6, 0.55, 0.7, C.lines[0], 'M');
    t.text(s, [M.org, M.loc].filter(Boolean).join(' \u2022 '), { x: 1.45, y: 0.55, w: 3.8, h: 0.7, fontSize: 13, bold: true, color: C.muted, valign: 'middle' });
    const fs = L.fit(d.title, 4.6, 2.0, 40, 22, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 1.4, w: 4.6, h: 2.1, bold: true, fontSize: fs, color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.6, w: 4.5, h: 0.75, fontSize: 13, color: C.muted });
    t.rect(s, 0.6, 4.45, 3.6, 0.5, C.sign, { r: 0.08, name: 'Sign' });
    t.text(s, `${M.author || ''}  ${M.year || ''}`, { x: 0.75, y: 4.45, w: 3.4, h: 0.5, fontSize: 13, bold: true, color: 'FFFFFF', valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await photo(s, d.image, 0.6, 1.5, 4.0, 3.4, C.lines[1]); para(s, d.text, 4.95, 1.5, 4.45, 3.4); },
    async image(d) { const s = page(d); para(s, d.text, 0.6, 1.5, 4.3, 3.4); await photo(s, d.image, 5.25, 1.5, 4.15, 3.4, C.lines[2]); },
    async agenda(d) {
      const s = page(d), n = d.items.length, rh = 3.55 / n, x = 1.1;
      vLine(s, x, 1.55 + rh / 2, rh * (n - 1), C.lines[1]);
      d.items.forEach((it, i) => {
        const cy = 1.5 + i * rh + rh / 2;
        station(s, x, cy, 0.34, i === 0 || i === n - 1);
        t.text(s, it, { x: x + 0.4, y: cy - 0.25, w: 7.5, h: 0.5, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      hLine(s, 0.6 + w / 2, 1.85, (w + gap) * (n - 1), C.lines[3]);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        badge(s, x + w / 2 - 0.3, 1.55, 0.6, C.lines[i % 5], '');
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2.25), x + w / 2 - 0.15, 1.7, 0.3, 0.3);
        t.text(s, it.h, { x, y: 2.35, w, h: 0.45, fontSize: L.fit(it.h, w, 0.45, 17, 12, F.head, true), bold: true, color: C.ink, align: 'center' });
        t.text(s, it.t, { x, y: 2.85, w, h: 2.1, fontSize: L.fit(it.t, w, 2.1, 14, 10, F.body), color: C.muted, align: 'center' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      hLine(s, 0.6 + cw / 2, 1.95, cw * (n - 1), C.lines[0]);
      d.steps.forEach((st, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        station(s, cx, 1.95, 0.4, i === n - 1);
        t.text(s, `${i + 1}`, { x: cx - 0.5, y: 1.4, w: 1, h: 0.3, fontSize: 12, bold: true, color: C.lines[0], align: 'center' });
        t.text(s, st.h, { x: cx - cw / 2 + 0.1, y: 2.35, w: cw - 0.2, h: 0.45, fontSize: L.fit(st.h, cw - 0.2, 0.45, 16, 11, F.head, true), bold: true, color: C.ink, align: 'center' });
        t.text(s, st.t, { x: cx - cw / 2 + 0.1, y: 2.85, w: cw - 0.2, h: 2.1, fontSize: L.fit(st.t, cw - 0.2, 2.1, 14, 10, F.body), color: C.muted, align: 'center' });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw, col = C.lines[i % 5];
        t.rect(s, px, 1.55, cw - 0.3, 1.5, col, { r: 0.12, name: 'Station sign' });
        t.text(s, x.value, { x: px + 0.2, y: 1.55, w: cw - 0.7, h: 1.5, fontSize: L.fit(x.value, cw - 0.8, 1.0, 48, 22, F.head, true), bold: true, color: col === C.lines[5] ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.2, w: cw - 0.3, h: 0.9, fontSize: 14, color: C.ink, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.45, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.2;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.25, 4.85 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.4), col = C.lines[i ? 1 : 0];
        badge(s, x, 1.45, 0.5, col, i ? 'B' : 'A');
        t.text(s, side.h, { x: x + 0.65, y: 1.45, w: w - 0.7, h: 0.5, fontSize: 18, bold: true, color: C.ink, valign: 'middle' });
        let y = 2.2; const top = y;
        side.items.forEach((it, k) => { t.text(s, it, { x: x + 0.6, y, w: w - 0.7, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
        vLine(s, x + 0.25, top + 0.12, y - top - rows[rows.length - 1] + 0.01, col);
        let yy = top; side.items.forEach((_, k) => { station(s, x + 0.25, yy + 0.13, 0.26); yy += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.5, 8.8, 2.2, C.sign, { r: 0.12, name: 'Sign' });
      t.text(s, L.runs(d.text), { x: 0.95, y: 1.6, w: 8.1, h: 2.0, fontSize: L.fit(d.text, 8.1, 1.9, 34, 18, F.head, true), bold: true, color: 'FFFFFF', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.6, y: 3.9, w: 8.8, h: 1.1, fontSize: L.fit(d.caption, 8.8, 1.1, 15, 11, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      hLine(s, 0.6 + cw / 2, 2.35, cw * (n - 1), C.lines[2]);
      d.items.forEach((it, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        t.text(s, it.year, { x: cx - cw / 2, y: 1.5, w: cw, h: 0.6, fontSize: L.fit(it.year, cw - 0.2, 0.55, 24, 12, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'bottom' });
        station(s, cx, 2.35, 0.36, i === n - 1);
        t.text(s, it.h, { x: cx - cw / 2 + 0.1, y: 2.75, w: cw - 0.2, h: 0.42, fontSize: 16, bold: true, color: C.ink, align: 'center' });
        t.text(s, it.t, { x: cx - cw / 2 + 0.1, y: 3.2, w: cw - 0.2, h: 1.8, fontSize: 14, color: C.muted, align: 'center' });
      });
    },
    async quote(d) {
      const s = page({});
      t.rect(s, 0.8, 1.2, 8.4, 3.0, C.sign, { r: 0.15, name: 'Sign' });
      C.lines.slice(0, 5).forEach((c, k) => t.oval(s, 1.1 + k * 0.3, 1.45, 0.2, 0.2, c));
      t.text(s, d.text, { x: 1.15, y: 1.8, w: 7.7, h: 1.8, fontSize: L.fit(d.text, 7.7, 1.75, 28, 16, F.head, true), bold: true, color: 'FFFFFF', valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.15, y: 3.6, w: 7.7, h: 0.4, fontSize: 13, color: 'C7D0E0' });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = 3.55 / n, x = 0.95;
      vLine(s, x, 1.5 + rh / 2, rh * (n - 1), C.lines[4]);
      d.items.forEach((it, i) => {
        const cy = 1.5 + i * rh + rh / 2;
        station(s, x, cy, 0.28);
        t.text(s, it, { x: x + 0.35, y: cy - rh / 2, w: 8.1, h: rh, fontSize: L.fit(it, 8.1, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, on the transit map: a deck's pages must not look alike (L.pages)
  const X0 = 0.6, FW = 8.8, Y1 = 5.12, LN = C.lines, fgOn = (c) => (c === LN[5] || c === LN[3] ? C.ink : 'FFFFFF');
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10.5, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13.5, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const track = (w, h, paths, sw = 14) => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${paths.map(([p, c]) => `<polyline points="${p}" fill="none" stroke="#${c}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`).join('')}</svg>`, w, h);
  const mapImg = async (s, paths, x = 0, y = 0, w = W, h = H, sw = 14) => t.img(s, await track(Math.round(w * 100), Math.round(h * 100), paths, sw), x, y, w, h);
  const pts = (...a) => a.map(([x, y]) => `${Math.round(x * 100)},${Math.round(y * 100)}`).join(' ');
  const iconBadge = async (s, it, x, y, D, col) => { t.oval(s, x, y, D, D, col); t.img(s, await L.icon(it.icon, fgOn(col), 2.25), x + D * 0.25, y + D * 0.25, D * 0.5, D * 0.5); };
  const V = {
    image: [
      async (d) => { // a platform poster, wide: a line runs under it to the words
        const s = page(d);
        await photo(s, d.image, X0, 1.36, FW, 2.0, C.ink);
        hLine(s, X0, 3.54, FW, LN[idx % 5]);
        station(s, X0 + 0.25, 3.54, 0.3); station(s, X0 + FW - 0.25, 3.54, 0.3, true);
        para(s, d.text, X0, 3.72, FW, 1.42);
      },
      async (d) => { // a hoarding across the whole station wall, a navy sign panel on it
        const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, 5.25), 0, 0, W, 5.25, { alt: d.title });
        t.rect(s, 4.5, 0.3, 5.2, 4.65, C.sign, { r: 0.1, name: 'Sign' });
        badge(s, 4.72, 0.48, 0.55, LN[0], 'M');
        t.text(s, TR.stop(idx), { x: 8.2, y: 0.48, w: 1.3, h: 0.3, fontSize: 10, bold: true, color: 'D5DDEA', align: 'right', valign: 'middle' });
        head(s, d.title, 5.4, 0.48, 2.8, 0.74, { color: 'FFFFFF', max: 16 });
        hLine(s, 4.72, 1.34, 4.76, LN[3]);
        t.text(s, d.text, { x: 4.74, y: 1.46, w: 4.72, h: 3.38, fontSize: L.fit(d.text, 4.72, 3.38, 15, 10.5, F.body, false, 1.25), color: 'FFFFFF', lineSpacingMultiple: 1.25, valign: 'middle' });
        footer(s);
      },
      async (d) => { // a roundel: the picture in the ring, the line's bar running through to the words
        const s = page(d), dia = 3.1, x = X0 + 0.1, y = 1.55, col = LN[idx % 5];
        t.oval(s, x - 0.14, y - 0.14, dia + 0.28, dia + 0.28, col, { name: 'Roundel' });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        t.rect(s, x + dia - 0.3, y + dia / 2 - 0.1, 1.0, 0.2, C.sign, { name: 'Roundel bar' });
        para(s, d.text, 4.65, 1.38, 4.75, 3.72);
      },
      async (d) => { // the picture cut on the map's own 45 degrees, a line riding its edge
        const s = page(d), x = 4.5, y = 1.3, w = 5.5, h = 3.95, cut = 1.6 / w;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: [[cut, 0], [1, 0], [1, 1], [0, 1], [0, 1.52 / h]] } }), x, y, w, h, { alt: d.title });
        await mapImg(s, [[pts([1.6, 0.08], [0.08, 1.6], [0.08, 3.95]), LN[idx % 5]]], x - 0.08, y - 0.08, 1.7, 4.03, 14);
        para(s, d.text, X0, 1.38, 3.7, 3.72);
      },
    ],
    cards: [
      async (d) => { // the route board: one line down the left, a station for every idea
        const s = page(d), n = d.items.length, y0 = 1.34, h = 3.78 / n, cx = 1.0, col = LN[idx % 5];
        vLine(s, cx, y0 + h / 2, h * (n - 1), col);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h, cy = y + h / 2;
          station(s, cx, cy, 0.42, i === 0 || i === n - 1);
          t.img(s, await L.icon(it.icon, C.ink, 2), 1.42, cy - 0.17, 0.34, 0.34);
          head(s, it.h, 1.9, y + 0.04, 2.5, h - 0.08);
          body(s, it.t, 4.55, y + 0.04, 4.85, h - 0.08, { valign: 'middle', max: 13 });
        }
      },
      async (d) => { // the big interchange: lines leave it at 45 degrees for every destination
        const s = page(d), n = d.items.length, cx = 5, cy = 3.2, w = 3.3, left = 2, right = n - left, hL = 1.9, hR = 3.8 / right;
        const spot = (i) => (i < left ? [X0, 1.3 + i * hL, hL - 0.14] : [6.1, 1.3 + (i - left) * hR, hR - 0.14]);
        const P = d.items.map((_, i) => { const [x, y, h] = spot(i), tall = h > 2, my = tall ? cy : y + 0.28, ex = i < left ? x + w + 0.1 : x - 0.1, sg = i < left ? -1 : 1, dy = Math.abs(my - cy); return [pts([cx, cy], [cx + sg * Math.min(dy, Math.abs(ex - cx) - 0.1), my], [ex, my]), LN[i]]; });
        await mapImg(s, P);
        station(s, cx, cy, 0.7, true);
        for (const [i, it] of d.items.entries()) {
          const [x, y, h] = spot(i), tall = h > 2, top = tall ? cy - 0.28 : y;
          await iconBadge(s, it, i < left ? x + w - 0.5 : x, top + 0.02, 0.5, LN[i]);
          head(s, it.h, i < left ? x : x + 0.6, top + 0.02, w - 0.6, 0.5, { align: i < left ? 'right' : 'left', max: 14 });
          body(s, it.t, x, top + 0.58, w, tall ? 1.3 : h - 0.62, { align: i < left ? 'right' : 'left', max: 13 });
        }
      },
      async (d) => { // direction signs: navy enamel plates, each with its line's badge
        const s = page(d), n = d.items.length, g = 0.14, w = (FW - g) / 2, h = 1.82;
        const spots = n === 3 ? [[X0, 1.34, w], [X0 + w + g, 1.34, w], [X0, 1.34 + h + g, FW]] : [0, 1, 2, 3].map((i) => [X0 + (i % 2) * (w + g), 1.34 + (i >> 1) * (h + g), w]);
        for (const [i, it] of d.items.entries()) {
          const [x, y, ww] = spots[i];
          t.rect(s, x, y, ww, h, C.sign, { r: 0.08, name: 'Sign' });
          await iconBadge(s, it, x + 0.14, y + 0.14, 0.5, LN[i]);
          head(s, it.h, x + 0.76, y + 0.12, ww - 1.3, 0.54, { color: 'FFFFFF' });
          t.text(s, '→', { x: x + ww - 0.5, y: y + 0.14, w: 0.4, h: 0.5, fontSize: 20, bold: true, color: LN[5], align: 'center', valign: 'middle', noFit: true });
          body(s, it.t, x + 0.18, y + 0.74, ww - 0.36, h - 0.82, { color: 'FFFFFF', max: 13 });
        }
      },
      async (d) => { // parallel lines, one to a topic, ending at different stops
        const s = page(d), n = d.items.length, g = 0.22, w = (FW - g * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + g), y = 1.36 + (i % 2 ? 0.34 : 0), col = LN[i];
          vLine(s, x + 0.08, y + 0.2, Y1 - y - 0.25, col);
          station(s, x + 0.08, y + 0.2, 0.32, true);
          t.img(s, await L.icon(it.icon, col === LN[3] ? 'B26000' : col, 2.25), x + 0.34, y + 0.04, 0.34, 0.34);
          head(s, it.h, x + 0.34, y + 0.42, w - 0.36, 0.52, { valign: 'top', max: 14 });
          body(s, it.t, x + 0.34, y + 0.96, w - 0.36, Y1 - y - 1.0);
        }
      },
      async (d) => { // the terminus: one big badge, branch lines leaving for the rest
        const s = page(d), [a, ...rest] = d.items, h = 3.78 / rest.length, cx = 2.55, sx = 5.6;
        await iconBadge(s, a, X0, 1.4, 1.15, LN[0]);
        head(s, a.h, 1.9, 1.4, 2.9, 1.15, { max: 19 });
        body(s, a.t, X0, 2.72, 4.3, 2.36, { max: 16 });
        const P = rest.map((_, i) => { const y = 1.34 + i * h + h / 2; return [pts([5.1, 1.34 + 3.78 / 2], [5.3, y], [sx, y]), LN[i + 1]]; });
        await mapImg(s, P, 0, 0, W, H, 10);
        rest.forEach((it, i) => {
          const y = 1.34 + i * h, cy = y + h / 2;
          station(s, sx + 0.05, cy, 0.3);
          head(s, it.h, sx + 0.32, y + 0.02, 3.48, 0.34, { max: 14 });
          body(s, it.t, sx + 0.32, y + 0.36, 3.48, h - 0.4, { max: 12.5 });
        });
      },
    ],
    process: [
      async (d) => { // the line jogs up and down at 45 degrees, a station on every level
        const s = page(d), n = d.steps.length, cw = FW / n, hi = 1.56, lo = 2.12, col = LN[idx % 5];
        const nodes = d.steps.map((_, i) => [X0 + 0.3 + i * cw, i % 2 ? lo : hi]), P = [];
        nodes.forEach(([x, y], i) => { if (i) { const [px, py] = nodes[i - 1], dy = Math.abs(y - py); P.push([px, py], [x - dy - 0.25, py], [x - 0.25, y]); } P.push([x, y]); });
        await mapImg(s, [[pts(...P), col]]);
        d.steps.forEach((st, i) => {
          const [x, y] = nodes[i], tx = X0 + i * cw, w = cw - 0.18;
          station(s, x, y, 0.42, i === n - 1);
          t.text(s, String(i + 1), { x: x - 0.21, y: y - 0.21, w: 0.42, h: 0.42, fontSize: 12, bold: true, color: C.ink, align: 'center', valign: 'middle' });
          head(s, st.h, tx, y + 0.3, w, 0.5, { valign: 'top', max: 14 });
          body(s, st.t, tx, y + 0.82, w, Y1 - y - 0.86);
        });
      },
      async (d) => { // north to south: one line down the page, platforms left and right in turn
        const s = page(d), n = d.steps.length, y0 = 1.32, h = 3.8 / n, cx = 5, col = LN[(idx + 1) % 5], B = 0.44;
        vLine(s, cx, y0 + h / 2, h * (n - 1), col);
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? X0 : 5.45, w = 3.95, al = left ? 'right' : 'left';
          station(s, cx, y + h / 2, B, i === n - 1);
          t.text(s, String(i + 1), { x: cx - B / 2, y: y + h / 2 - B / 2, w: B, h: B, fontSize: 12, bold: true, color: C.ink, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.03, w, 0.3, { align: al });
          body(s, st.t, x, y + 0.33, w, h - 0.37, { align: al, max: 13 });
        });
      },
      async (d) => { // the circle line: out along the top, round the end, back along the bottom
        const s = page(d), n = d.steps.length, yT = 1.55, yB = 3.34, xL = X0 + 0.25, xR = 9.15, col = LN[(idx + 2) % 5], w = 4.25, spots = n === 3 ? [[xL, yT], [5.05, yT], [xR - w - 0.1, yB]] : [[xL, yT], [5.05, yT], [5.05, yB], [xL, yB]];
        await mapImg(s, [[pts([xL, yT], [xR - 0.3, yT], [xR, yT + 0.3], [xR, yB - 0.3], [xR - 0.3, yB], [xL, yB]), col]]);
        d.steps.forEach((st, i) => {
          const [x, y] = spots[i], X = x, B = 0.42;
          station(s, X + 0.1, y, B, i === 0);
          t.text(s, String(i + 1), { x: X + 0.1 - B / 2, y: y - B / 2, w: B, h: B, fontSize: 12, bold: true, color: C.ink, align: 'center', valign: 'middle' });
          head(s, st.h, X - 0.05, y + 0.25, n === 3 && i === 2 ? w : w - 0.45, 0.3, { max: 14 });
          body(s, st.t, X - 0.05, y + 0.56, n === 3 && i === 2 ? w : w - 0.45, (y === yT ? yB - 0.3 : Y1) - y - 0.56, { max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // one number on the great sign; two branch lines carry the others
        const s = page(d), [a, ...rest] = d.stats;
        t.rect(s, X0, 1.36, 4.6, 2.64, C.sign, { r: 0.12, name: 'Sign' });
        t.text(s, a.value, { x: X0 + 0.25, y: 1.42, w: 4.1, h: 1.5, bold: true, fontSize: L.fit(a.value, 4.1, 1.4, 60, 28, F.head, true), color: LN[5], valign: 'middle' });
        body(s, a.label, X0 + 0.25, 2.94, 4.1, 0.96, { color: 'FFFFFF', max: 14 });
        rest.forEach((q, i) => {
          const y = 1.36 + i * 1.34, col = LN[i ? 2 : 1];
          vLine(s, 5.55, y + 0.05, 1.18, col);
          station(s, 5.55, y + 0.3, 0.3);
          t.text(s, q.value, { x: 5.82, y, w: 3.58, h: 0.62, bold: true, fontSize: L.fit(q.value, 3.58, 0.6, 32, 18, F.head, true), color: col, valign: 'middle' });
          body(s, q.label, 5.82, y + 0.62, 3.58, 0.62, { max: 13 });
        });
        if (d.note) body(s, d.note, X0, 4.1, FW, 1.02, { max: 13, valign: 'middle', color: C.ink });
      },
      async (d) => { // the departures board: amber figures on a black panel, a coloured dot for the line
        const s = page(d), h = 0.84, x = X0, W_ = FW, y0 = 1.34;
        t.rect(s, x, y0, W_, h * 3 + 0.16, C.sign, { r: 0.08, name: 'Departures board' });
        d.stats.forEach((q, i) => {
          const y = y0 + 0.08 + i * h;
          t.oval(s, x + 0.18, y + h / 2 - 0.15, 0.3, 0.3, LN[i]);
          t.text(s, q.value, { x: x + 0.62, y, w: 2.9, h, bold: true, fontFace: 'Courier New', fontSize: L.fit(q.value, 2.9, h - 0.14, 30, 16, 'Courier New', true), color: LN[5], valign: 'middle' });
          body(s, q.label, x + 3.6, y + 0.05, W_ - 3.8, h - 0.1, { color: 'FFFFFF', max: 15, valign: 'middle' });
          if (i < 2) t.line(s, x + 0.14, y + h, W_ - 0.28, 0, '4A5A7A', 0.75);
        });
        if (d.note) body(s, d.note, X0, 4.1, FW, 1.02, { max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // two lines laid one over the other: a station for each point along it
        const s = page(d), bh = 1.86;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.34 + i * bh, col = LN[i ? 1 : 0], n = side.items.length, x0 = 2.9, cw = (9.4 - x0) / n, ly = y + 0.24;
          badge(s, X0, y + 0.02, 0.46, col, i ? 'B' : 'A');
          head(s, side.h, X0 + 0.54, y, 1.66, bh - 0.2, { valign: 'top', max: 14 });
          hLine(s, x0 + 0.1, ly, cw * (n - 1) + 0.12, col);
          side.items.forEach((it, k) => {
            station(s, x0 + 0.16 + k * cw, ly, 0.3);
            body(s, it, x0 + k * cw, ly + 0.26, cw - 0.16, bh - 0.62, { max: 13 });
          });
        });
      },
      async (d) => { // the two sides of the platform, mirrored: navy on one, pale on the other, stops between
        const s = page(d), w = 3.7, y0 = 1.96, avail = 3.08, fit = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.12, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        t.rect(s, X0, 1.32, 4.2, 3.8, C.sign, { name: 'Platform' });
        t.rect(s, 5.2, 1.32, 4.2, 3.8, 'EAF3FC', { name: 'Platform' });
        vLine(s, 5, 1.32, 3.8, LN[3]);
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.45 : 0.85, al = i ? 'left' : 'right', fg = i ? C.ink : 'FFFFFF';
          head(s, side.h, x, 1.4, w, 0.5, { color: i ? LN[1] : LN[5], align: al, max: 17 });
          let y = y0;
          fit.rows.forEach((rh0, k) => {
            const rh = rh0 + extra;
            if (side.items[k]) t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: fg, align: al, valign: 'middle' });
            if (!i) station(s, 5, y + rh / 2, 0.26);
            y += rh;
          });
        });
      },
    ],
    statement: [
      async (d) => { // the roundel at full size: the sentence on the bar across it
        const s = page(d), D = 2.8, col = LN[idx % 5];
        t.oval(s, 5 - D / 2 - 0.2, 1.3 - 0.0, D + 0.4, D + 0.4, null, { line: { color: col, width: 26 }, name: 'Roundel' });
        t.rect(s, 0, 1.78, W, 1.64, C.sign, { name: 'Roundel bar' });
        t.text(s, L.runs(d.text), { x: X0 + 0.2, y: 1.82, w: FW - 0.4, h: 1.56, bold: true, fontSize: L.fit(d.text, FW - 0.4, 1.5, 28, 16, F.head, true), color: 'FFFFFF', align: 'center', valign: 'middle' });
        if (d.caption) { t.rect(s, 0.6, 4.2, 8.8, 0.96, C.bg, { name: 'Note ground' }); body(s, d.caption, X0, 4.2, FW, 0.96, { max: 13, align: 'center', valign: 'middle' }); }
      },
      async (d) => { // end of the line: big words, a track that turns 45 degrees and stops at the note
        const s = page(d), col = LN[(idx + 1) % 5];
        t.text(s, L.runs(d.text), { x: X0, y: 1.38, w: 5.5, h: 3.7, bold: true, fontSize: L.fit(d.text, 5.5, 3.6, 34, 18, F.head, true), color: C.ink, valign: 'middle' });
        await mapImg(s, [[pts([6.45, 1.4], [6.45, 2.3], [6.85, 2.7], [8.9, 2.7]), col]]);
        station(s, 8.95, 2.7, 0.42, true);
        if (d.caption) body(s, d.caption, 6.85, 2.98, 2.55, 2.14, { max: 13 });
      },
    ],
    timeline: [
      async (d) => { // the line comes down the page in steps, each turn a dated stop
        const s = page(d), h = 0.89, dx = 1.0, y0 = 1.54, x0 = 0.85, col = LN[idx % 5], w = 5.2, P = [];
        d.items.forEach((_, i) => { const x = x0 + i * dx, y = y0 + i * h; P.push([x, y]); if (i < 3) { P.push([x, y + h - dx * 0.35]); P.push([x + dx * 0.35, y + h]); P.push([x + dx, y + h]); } });
        await mapImg(s, [[pts(...P), col]]);
        d.items.forEach((it, i) => {
          const x = x0 + i * dx, y = y0 + i * h, tx = x + 0.32;
          station(s, x, y, 0.36, i === 3);
          t.text(s, it.year, { x: tx, y: y - 0.22, w: 1.25, h: 0.28, bold: true, fontSize: L.fit(it.year, 1.25, 0.26, 14, 10.5, F.head, true), color: col === LN[5] ? C.ink : col, valign: 'middle' });
          head(s, it.h, tx + 1.3, y - 0.22, w - 1.3, 0.28, { max: 13 });
          body(s, it.t, tx + 0.28, y + 0.08, w - 0.28, h - 0.31, { max: 12.5 });
        });
      },
      async (d) => { // the main line, dated stops on it, the events above and below the track
        const s = page(d), ly = 3.2, w = 4.0, xs = [X0, 1.1, 5.0, 5.4], px = [1.1, 3.9, 5.5, 8.3], col = LN[(idx + 1) % 5];
        hLine(s, X0, ly, FW, col);
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], y = up ? 1.34 : ly + 0.28, h = up ? ly - 0.26 - y : Y1 - y, al = up ? 'left' : 'right';
          station(s, px[i], ly, 0.34, i === 3);
          t.text(s, it.year, { x, y, w: 1.45, h: 0.32, bold: true, fontSize: L.fit(it.year, 1.45, 0.3, 15, 10.5, F.head, true), color: C.sign, align: 'left', valign: 'middle' });
          head(s, it.h, x + 1.5, y, w - 1.5, 0.32, { max: 13, align: 'right' });
          body(s, it.t, x, y + 0.34, w, h - 0.36, { max: 13.5, align: al });
        });
      },
      async (d) => { // four tickets: a coloured stub with the date, a dashed tear, the event below
        const s = page(d), g = 0.14, w = (FW - 3 * g) / 4, y = 1.34, stub = 0.86, h = 3.78;
        d.items.forEach((it, i) => {
          const x = X0 + i * (w + g), col = LN[i];
          t.rect(s, x, y, w, h, 'F4F5F7', { line: { color: C.gray, width: 1 }, r: 0.08, name: 'Ticket' });
          t.rect(s, x, y, w, stub, col, { r: 0.08, name: 'Ticket stub' });
          t.text(s, it.year, { x: x + 0.06, y, w: w - 0.12, h: stub, bold: true, fontSize: L.fit(it.year, w - 0.2, stub - 0.2, 22, 11, F.head, true), color: fgOn(col), align: 'center', valign: 'middle' });
          t.line(s, x, y + stub + 0.05, w, 0, C.ink, 1, { dash: 'sysDash' });
          head(s, it.h, x + 0.12, y + stub + 0.12, w - 0.24, 0.5, { max: 14, valign: 'top', align: 'center' });
          body(s, it.t, x + 0.12, y + stub + 0.64, w - 0.24, h - stub - 0.72, { max: 13.5, align: 'center' });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.cards = V.cards.shift(); // the old cards, process and timeline were one page: line, circles, columns
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Metro', colors: { dk1: C.ink, lt1: C.bg, dk2: C.sign, lt2: 'F2F2F2', accent1: C.lines[0], accent2: C.lines[1], accent3: C.lines[2], accent4: C.lines[3], accent5: C.lines[4], accent6: C.lines[5], hlink: C.lines[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "yo'l xaritasi kabi: aniq bosqichlar va keyingi qadamlar, qisqa ko'rsatkichli iboralar", limits: {}, prefer: null };
module.exports = { id: 39, slug: 'metro', name: 'Metro', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "technical"], "transitions": ["push:l", "p14:conveyor|dir=\"l\"", "split:h"], "cover": ["flyRight", "stretch"], "mark": "popIn", "deco": "wipe:r", "sig": {"title": "wipe:r", "body": "slideRight", "item": "slideRight", "image": "wipe:l", "number": "popIn", "order": "cascade", "stagger": 0.1}, "tempo": 0.85, "kenburns": false};
