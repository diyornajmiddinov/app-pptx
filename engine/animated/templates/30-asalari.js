/**
 * 30 Asalari — honeycomb: hexagon photos, hexagon markers and a faint honeycomb pattern,
 * warm amber and honey with near-black.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { amber: 'F4A300', honey: 'FFD27A', dark: '2B2B2B', light: 'FFF8EB', white: 'FFFFFF', brown: '7A5200', muted: '6B6255' };
const F = { head: 'Calibri', body: 'Calibri' };
const HEXR = 0.866; // height/width of a flat-top hexagon

function combSvg(w, h, color, op) {
  const r = 34, dx = r * 1.5, dy = r * Math.sqrt(3); let p = '';
  for (let c = 0; c * dx < w + r; c++) for (let rr = 0; rr * dy < h + dy; rr++) {
    const cx = c * dx, cy = rr * dy + (c % 2 ? dy / 2 : 0);
    p += `<polygon points="${[0, 60, 120, 180, 240, 300].map((a) => `${(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1)},${(cy + r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`).join(' ')}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="none" stroke="#${color}" stroke-width="2" stroke-opacity="${op}">${p}</g></svg>`;
}

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const combLight = await L.svg(combSvg(600, 600, C.amber, 0.35), 600, 600);
  const combDark = await L.svg(combSvg(1600, 900, C.amber, 0.18), 1600, 900);
  let idx = 0;
  const hex = (s, x, y, w, fill, o = {}) => s.addShape(t.S.HEXAGON, { x, y, w, h: w * HEXR, fill: fill ? { color: fill } : { type: 'none' }, line: o.line || { type: 'none' }, objectName: 'Hexagon' });
  const hexPhoto = async (s, img, x, y, w, alt) => t.img(s, await L.photo(img, w, w * HEXR, { mask: 'hex' }), x, y, w, w * HEXR, { alt });
  const footer = (s, dark) => {
    t.text(s, M.topic || '', { x: 0.6, y: 5.2, w: 4.6, h: 0.25, fontSize: 9, bold: true, color: dark ? C.honey : C.brown });
    t.text(s, meta, { x: 4.6, y: 5.2, w: 4.8, h: 0.25, fontSize: 9, color: dark ? 'BFB6A6' : C.muted, align: 'right' });
  };
  const page = (d, bg = C.light) => {
    const s = pres.addSlide(); s.background = { color: bg }; idx++;
    const dark = bg === C.dark;
    t.img(s, combLight, 7.6, -0.6, 3.0, 3.0);
    hex(s, 0.55, 0.42, 0.72, C.amber);
    t.text(s, L.pad2(idx), { x: 0.55, y: 0.42, w: 0.72, h: 0.72 * HEXR, fontSize: 15, bold: true, color: C.dark, align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.5, y: 0.38, w: 6.6, h: 0.7, bold: true, color: dark ? C.white : C.dark, valign: 'middle', fontSize: L.fit(d.title, 6.6, 0.7, 28, 16, F.head, true) });
    footer(s, dark);
    return s;
  };

  const R = {
    async cover(d) {
      const s = pres.addSlide(); s.background = { color: C.dark }; idx++;
      t.img(s, combDark, 0, 0, W, H);
      await hexPhoto(s, L.src(d.image), 5.2, 0.55, 4.3, d.title);
      hex(s, 4.75, 3.55, 1.0, C.amber); hex(s, 8.85, 3.95, 0.7, C.honey);
      t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  |  '), { x: 0.6, y: 0.6, w: 4.4, h: 0.3, fontSize: 12, bold: true, color: C.amber });
      const fs = L.fit(d.title, 4.3, 2.3, 42, 22, F.head, true);
      t.text(s, d.title, { x: 0.6, y: 0.95, w: 4.3, h: 2.4, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.5, w: 4.0, h: 0.8, fontSize: 13, color: 'BFB6A6' });
      t.text(s, M.author || '', { x: 0.6, y: 4.55, w: 4.0, h: 0.35, fontSize: 15, bold: true, color: C.honey });
    },
    async intro(d) {
      const s = page(d);
      await hexPhoto(s, L.src(d.image), 0.5, 1.35, 4.0, d.title);
      t.text(s, d.text, { x: 4.85, y: 1.35, w: 4.55, h: 3.6, fontSize: L.fit(d.text, 4.55, 3.6, 16, 11, F.body, false, 1.25), color: C.dark, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.6 / per);
      d.items.forEach((it, i) => {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.35 + (i % per) * rh;
        hex(s, x, y + 0.05, 0.7, i % 2 ? C.honey : C.amber);
        t.text(s, String(i + 1), { x, y: y + 0.05, w: 0.7, h: 0.7 * HEXR, fontSize: 16, bold: true, color: C.dark, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.9, y, w: 3.4, h: 0.7, fontSize: 17, bold: true, color: C.dark, valign: 'middle' });
      });
    },
    async image(d) {
      const s = page(d);
      await hexPhoto(s, L.src(d.image), 5.2, 1.1, 4.3, d.title);
      hex(s, 4.75, 3.9, 0.8, C.amber);
      t.text(s, d.text, { x: 0.6, y: 1.35, w: 4.2, h: 3.6, fontSize: L.fit(d.text, 4.2, 3.6, 15, 11, F.body, false, 1.25), color: C.dark, lineSpacingMultiple: 1.25, valign: 'middle' });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.3, 1.55 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.7;
        t.rect(s, x, y, w, h, C.white, { line: { color: C.honey, width: 1 }, name: 'Card' });
        hex(s, x + 0.25, y - 0.35, 0.8, i % 2 ? C.dark : C.amber);
        t.img(s, await L.icon(it.icon, i % 2 ? C.amber : C.dark, 2), x + 0.48, y - 0.18, 0.34, 0.34);
        t.text(s, it.h, { x: x + 0.25, y: y + 0.55, w: w - 0.5, h: 0.42, fontSize: L.fit(it.h, w - 0.5, 0.42, 17, 12, F.head, true), bold: true, color: C.dark });
        t.text(s, it.t, { x: x + 0.25, y: y + 1.0, w: w - 0.5, h: h - 1.1, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n, hw = 0.9;
      t.line(s, 0.6 + hw / 2, 1.35 + hw * HEXR / 2, cw * (n - 1), 0, C.honey, 3);
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw;
        hex(s, x, 1.35, hw, i === n - 1 ? C.dark : C.amber);
        t.text(s, String(i + 1), { x, y: 1.35, w: hw, h: hw * HEXR, fontSize: 20, bold: true, color: i === n - 1 ? C.amber : C.dark, align: 'center', valign: 'middle' });
        const hfs = Math.min(...d.steps.map((q) => L.fit(q.h, cw - 0.3, 0.75, 17, 12, F.head, true)));
        const hh = Math.max(...d.steps.map((q) => L.height(q.h, hfs, cw - 0.3, F.head, true)));
        t.text(s, st.h, { x, y: 2.35, w: cw - 0.3, h: hh + 0.05, fontSize: hfs, bold: true, color: C.dark });
        t.text(s, st.t, { x, y: 2.5 + hh, w: cw - 0.3, h: 2.4 - hh, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n, hw = 1.95;
      d.stats.forEach((x, i) => {
        const cx = 0.6 + i * cw + cw / 2;
        hex(s, cx - hw / 2, 1.3, hw, [C.amber, C.dark, C.honey][i % 3]);
        t.text(s, x.value, { x: cx - hw / 2 + 0.2, y: 1.3, w: hw - 0.4, h: hw * HEXR, fontSize: L.fit(x.value, hw - 0.6, 0.8, 40, 18, F.head, true), bold: true, color: i % 3 === 1 ? C.amber : C.dark, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 3.15, w: cw - 0.4, h: 0.95, fontSize: 14, color: C.dark, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.4, fontSize: 10, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.25;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.8, F.body, 0.22, 4.85 - 2.15);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), fill = i ? C.dark : C.white, fg = i ? C.white : C.dark;
        t.rect(s, x, 1.35, w, 3.55, fill, { line: { color: C.honey, width: 1 }, name: 'Panel' });
        t.text(s, side.h, { x: x + 0.3, y: 1.5, w: w - 0.6, h: 0.5, fontSize: 19, bold: true, color: i ? C.amber : C.brown });
        let y = 2.15;
        side.items.forEach((it, k) => { hex(s, x + 0.3, y + 0.05, 0.2, C.amber); t.text(s, it, { x: x + 0.65, y, w: w - 0.8, h: rows[k], fontSize: CFS, color: fg }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      hex(s, 0.4, 1.55, 3.3, C.amber);
      hex(s, 2.9, 3.55, 1.0, C.dark);
      const fs = L.fit(d.text, 5.4, 1.8, 34, 20, F.head, true);
      t.text(s, L.runs(d.text), { x: 4.0, y: 1.4, w: 5.4, h: 2.0, fontSize: fs, bold: true, color: C.dark, valign: 'bottom' });
      if (d.caption) t.text(s, d.caption, { x: 4.0, y: 3.55, w: 5.4, h: 1.3, fontSize: L.fit(d.caption, 5.4, 1.3, 15, 11, F.body), color: C.muted });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n, ly = 2.35;
      t.line(s, 0.6, ly, 8.8, 0, C.honey, 3);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.35, w: cw - 0.2, h: 0.6, fontSize: L.fit(it.year, cw - 0.3, 0.55, 28, 14, F.head, true), bold: true, color: C.brown, valign: 'bottom' });
        hex(s, x, ly - 0.17, 0.4, i % 2 ? C.dark : C.amber);
        t.text(s, it.h, { x, y: 2.7, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, color: C.dark });
        t.text(s, it.t, { x, y: 3.15, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = page({}, C.dark);
      t.img(s, combDark, 0, 0, W, H);
      hex(s, 0.6, 1.3, 1.0, C.amber);
      t.text(s, '\u201C', { x: 0.6, y: 1.3, w: 1.0, h: 0.87, fontSize: 54, bold: true, color: C.dark, align: 'center', valign: 'middle' });
      const fs = L.fit(d.text, 7.4, 2.4, 34, 20, F.head, true);
      t.text(s, d.text, { x: 2.0, y: 1.2, w: 7.4, h: 2.6, fontSize: fs, bold: true, color: C.white, valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 2.0, y: 3.95, w: 7.4, h: 0.4, fontSize: 15, color: C.honey, bold: true });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.6, 3.6 / n);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        hex(s, 0.6, y + (rh - 0.38 * HEXR) / 2, 0.38, C.amber);
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.38 * HEXR) / 2, w: 0.38, h: 0.38 * HEXR, fontSize: 11, bold: true, color: C.dark, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.15, y, w: 8.25, h: rh, fontSize: L.fit(it, 8.25, rh - 0.05, 14, 10, F.body), color: C.dark, valign: 'middle' });
      });
    },
    async closing(d) {
      const s = pres.addSlide(); s.background = { color: C.dark }; idx++;
      t.img(s, combDark, 0, 0, W, H);
      await hexPhoto(s, L.src(d.image), 0.5, 0.6, 4.3, d.title);
      hex(s, 4.1, 3.65, 0.9, C.amber);
      const fs = L.fit(d.title, 4.3, 1.8, 40, 22, F.head, true);
      t.text(s, d.title, { x: 5.2, y: 0.9, w: 4.3, h: 1.9, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
      if (d.subtitle) t.text(s, d.subtitle, { x: 5.2, y: 2.95, w: 4.2, h: 0.5, fontSize: 14, color: 'BFB6A6' });
      t.text(s, M.author || '', { x: 5.2, y: 3.7, w: 4.2, h: 0.35, fontSize: 15, bold: true, color: C.honey });
      footer(s, true);
    },
  };
  // ---- further ways to draw a type, all in the hive: a deck's pages must not look alike (L.pages)
  const PALE = 'E9E2D3';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 17, 12, F.head, true), color: o.color || C.dark, align: o.align, valign: o.valign || 'middle' });
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10, F.body, false, 1.25), color: o.color || C.dark, lineSpacingMultiple: 1.25, valign: o.valign || 'middle' });
  const num = (s, x, y, f = C.amber, fg = C.dark, w = 0.72) => { hex(s, x, y, w, f); t.text(s, L.pad2(idx), { x, y, w, h: w * HEXR, fontSize: 15, bold: true, color: fg, align: 'center', valign: 'middle' }); };
  const hexNum = (s, v, x, y, w, f, fg, fs) => { hex(s, x, y, w, f); t.text(s, v, { x: x + 0.05, y, w: w - 0.1, h: w * HEXR, fontSize: fs, bold: true, color: fg, align: 'center', valign: 'middle' }); };
  // inside the dark hive: the comb covers the whole page
  const night = (d) => {
    const s = pres.addSlide(); s.background = { color: C.dark }; idx++;
    t.img(s, combDark, 0, 0, W, H);
    num(s, 0.55, 0.42);
    if (d.title) t.text(s, d.title, { x: 1.5, y: 0.38, w: 7.9, h: 0.7, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.7, 28, 16, F.head, true) });
    footer(s, true);
    return s;
  };
  // several cells of one picture: the mask is the comb itself
  const cellPath = (cx, cy, r, bw, bh) => `M${[0, 60, 120, 180, 240, 300].map((a) => `${((cx + r * Math.cos((a * Math.PI) / 180)) / bw).toFixed(4)},${((cy + r * Math.sin((a * Math.PI) / 180)) / bh).toFixed(4)}`).join(' L')} Z`;
  // a bee on its way, drawn small
  const bee = () => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90"><ellipse cx="52" cy="24" rx="20" ry="22" fill="#${C.honey}" stroke="#${C.dark}" stroke-width="3" transform="rotate(-20 52 24)"/><ellipse cx="78" cy="26" rx="16" ry="20" fill="#${C.white}" stroke="#${C.dark}" stroke-width="3" transform="rotate(20 78 26)"/><ellipse cx="60" cy="58" rx="42" ry="24" fill="#${C.amber}" stroke="#${C.dark}" stroke-width="3"/><path d="M44,36 Q50,58 44,80 M62,34 Q68,58 62,82 M80,40 Q86,58 80,76" stroke="#${C.dark}" stroke-width="8" fill="none"/></svg>`, 120, 90);
  const V = {
    image: [
      async (d) => { // the picture seen through seven cells of the comb
        const s = page(d), bw = 3.9, bh = 4.04, r = 0.76, dx = 1.17, dy = 1.35, cx = bw / 2, cy = bh / 2;
        const cells = [[cx, cy], [cx, cy - dy], [cx, cy + dy], [cx - dx, cy - dy / 2], [cx - dx, cy + dy / 2], [cx + dx, cy - dy / 2], [cx + dx, cy + dy / 2]];
        t.img(s, await L.photo(L.src(d.image), bw, bh, { mask: { path: cells.map(([a, b]) => cellPath(a, b, r, bw, bh)).join(' ') } }), 5.65, 1.12, bw, bh, { alt: d.title });
        longText(s, d.text, 0.6, 1.3, 4.85, 3.72, { max: 14 });
      },
      async (d) => { // the dark hive: a wide picture, its lower edge the broken edge of the comb
        const s = night({}), ph = 2.75, k = 12, pts = [[0, 0], [1, 0]];
        for (let i = k; i >= 0; i--) pts.push([i / k, i % 2 ? 0.86 : 1]);
        t.img(s, await L.photo(L.src(d.image), W, ph, { mask: { poly: pts } }), 0, 0, W, ph, { alt: d.title });
        num(s, 0.55, 0.32);
        t.rect(s, 1.42, 0.38, 8.0, 0.6, C.dark, { t: 12, name: 'Title band' });
        t.text(s, d.title, { x: 1.55, y: 0.38, w: 7.75, h: 0.6, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 7.75, 0.56, 24, 15, F.head, true) });
        longText(s, d.text, 0.6, ph + 0.08, 8.8, 2.28, { color: PALE, max: 14 });
      },
      async (d) => { // the whole page is the picture, the words on one big amber cell
        const s = pres.addSlide(); s.background = { color: C.dark }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: d.title });
        t.rect(s, 0, 5.12, W, 0.51, C.dark, { name: 'Footer band' });
        footer(s, true);
        const w = 5.9, h = w * HEXR, x = 0.1, y = 0.02;
        hex(s, x, y, w, C.amber);
        num(s, x + 2.57, y + 0.1, C.dark, C.amber);
        t.text(s, d.title, { x: x + 1.0, y: y + 0.76, w: w - 2.0, h: 0.72, bold: true, color: C.dark, align: 'center', valign: 'middle', fontSize: L.fit(d.title, w - 2.0, 0.7, 20, 13, F.head, true) });
        longText(s, d.text, x + 0.75, y + 1.5, w - 1.5, h - 2.0, { max: 12.5 });
      },
      async (d) => { // honey page, one huge cell of picture running off the edge
        const s = page(d, C.honey), w = 4.55, x = -0.95, y = 1.14;
        await hexPhoto(s, L.src(d.image), x, y, w, d.title);
        hex(s, 3.05, 3.85, 0.72, C.dark);
        longText(s, d.text, 3.95, 1.3, 5.45, 3.72, { max: 15 });
      },
    ],
    cards: [
      async (d) => { // cells of the comb locked together, the words inside them
        const s = page(d), n = d.items.length, w = n === 3 ? 3.05 : 2.92, h = w * HEXR, dx = w * 0.75 + 0.03, x0 = (W - (dx * (n - 1) + w)) / 2, up = 1.08, down = 5.1 - h, fills = [C.amber, C.dark, C.honey, C.dark];
        for (const [i, it] of d.items.entries()) {
          const x = x0 + i * dx, y = i % 2 ? down : up, f = fills[i], dark = f === C.dark, tw = w * 0.72, tx = x + (w - tw) / 2;
          hex(s, x, y, w, f);
          t.img(s, await L.icon(it.icon, dark ? C.amber : C.dark, 2), x + w / 2 - 0.16, y + 0.1, 0.32, 0.32);
          head(s, it.h, tx, y + 0.42, tw, 0.42, { color: dark ? C.white : C.dark, align: 'center', max: 14 });
          t.text(s, it.t, { x: tx, y: y + 0.85, w: tw, h: h - 1.0, fontSize: L.fit(it.t, tw, h - 1.05, 12, 8.5, F.body), minFont: 8.5, color: dark ? PALE : C.dark, align: 'center' });
        }
      },
      async (d) => { // white strips, the marker cell half out of each
        const s = page(d), n = d.items.length, g = 0.12, h = (3.78 - g * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.25 + i * (h + g), hw = Math.min(0.95, h * 1.05), f = i % 2 ? C.dark : C.amber;
          t.rect(s, 1.05, y, 8.35, h, C.white, { line: { color: C.honey, width: 1 }, name: 'Strip' });
          hex(s, 0.6, y + (h - hw * HEXR) / 2, hw, f);
          t.img(s, await L.icon(it.icon, i % 2 ? C.amber : C.dark, 2), 0.6 + hw / 2 - 0.17, y + h / 2 - 0.17, 0.34, 0.34);
          head(s, it.h, 1.7, y + 0.05, 2.5, h - 0.1, { max: 16 });
          body(s, it.t, 4.3, y + 0.05, 4.95, h - 0.1, { max: 13.5, valign: 'middle' });
        }
      },
      async (d) => { // the dark hive, four panes of comb with honey edges
        const s = night(d), n = d.items.length, w = 4.3, h = 1.8;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.2), y = 1.2 + Math.floor(i / 2) * (h + 0.14);
          t.rect(s, x, y, ww, h, '383633', { line: { color: C.amber, width: 1 }, name: 'Pane' });
          hex(s, x + 0.18, y + 0.16, 0.72, C.amber);
          t.img(s, await L.icon(it.icon, C.dark, 2), x + 0.38, y + 0.27, 0.32, 0.32);
          head(s, it.h, x + 1.05, y + 0.12, ww - 1.2, 0.42, { color: C.honey, max: 16 });
          body(s, it.t, x + 1.05, y + 0.56, ww - 1.2, h - 0.66, { color: PALE, max: 13 });
        }
      },
      async (d) => { // the queen's cell in the middle with the title, the workers around it
        const s = pres.addSlide(); s.background = { color: C.light }; idx++;
        footer(s, false);
        const n = d.items.length, w = 2.75, h = w * HEXR, cx = 5, cy = n === 3 ? 1.65 : 2.6, cw = 3.1, ch = 2.15;
        hex(s, cx - w / 2 - 0.14, cy - h / 2 - 0.12, w + 0.28, C.honey);
        hex(s, cx - w / 2, cy - h / 2, w, C.dark);
        t.text(s, d.title, { x: cx - 0.92, y: cy - 0.72, w: 1.84, h: 1.44, bold: true, color: C.amber, align: 'center', valign: 'middle', fontSize: L.fit(d.title, 1.84, 1.4, 19, 12, F.head, true) });
        const spots = n === 3 ? [[0.4, 0.4, cw, ch], [6.5, 0.4, cw, ch], [1.6, 3.3, 6.8, 1.7]] : [[0.4, 0.38, cw, ch], [6.5, 0.38, cw, ch], [0.4, 2.8, cw, ch], [6.5, 2.8, cw, ch]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, ww, hh] = spots[i];
          t.rect(s, x, y, ww, hh, C.white, { line: { color: C.honey, width: 1 }, name: 'Card' });
          hex(s, x + 0.14, y + 0.12, 0.54, C.amber);
          t.img(s, await L.icon(it.icon, C.dark, 2), x + 0.28, y + 0.2, 0.26, 0.26);
          head(s, it.h, x + 0.78, y + 0.1, ww - 0.92, 0.46, { max: 15 });
          body(s, it.t, x + 0.16, y + 0.64, ww - 0.32, hh - 0.72, { max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // white steps rising, each with its cell on the edge
        const s = page(d), n = d.steps.length, cw = 8.8 / n, rise = n === 3 ? 0.42 : 0.3, hw = 0.8;
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw, y = 1.56 + (n - 1 - i) * rise, h = 5.08 - y, last = i === n - 1;
          t.rect(s, x, y, cw - 0.06, h, last ? C.amber : C.white, { line: { color: C.honey, width: 1 }, name: 'Step' });
          hexNum(s, String(i + 1), x + 0.14, y - 0.34, hw, last ? C.dark : C.amber, last ? C.amber : C.dark, 18);
          head(s, st.h, x + 0.14, y + 0.4, cw - 0.34, 0.52, { max: 14, valign: 'top' });
          body(s, st.t, x + 0.14, y + 0.92, cw - 0.34, h - 1.0, { max: 12.5, color: last ? C.dark : C.muted });
        });
      },
      async (d) => { // the dark hive: a chain of cells down the middle, steps to both sides
        const s = night(d), n = d.steps.length, y0 = 1.18, h = 3.92 / n, hw = 0.84;
        t.line(s, 5, y0 + 0.3, 0, h * (n - 1) + 0.2, C.brown, 3);
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, cy = y + (h - 0.06) / 2, left = i % 2 === 0, x = left ? 0.6 : 5.65, w = 3.75;
          hexNum(s, String(i + 1), 5 - hw / 2, cy - hw * HEXR / 2, hw, i === n - 1 ? C.honey : C.amber, C.dark, 18);
          head(s, st.h, x, y + 0.02, w, 0.34, { color: C.honey, align: left ? 'right' : 'left', max: 15 });
          body(s, st.t, x, y + 0.37, w, h - 0.44, { color: PALE, align: left ? 'right' : 'left', max: 12.5 });
        });
      },
      async (d) => { // the bee's dotted flight from cell to cell
        const s = page(d), n = d.steps.length, cw = 8.8 / n, hw = 0.92, hy = HEXR * hw;
        const cs = d.steps.map((_, i) => [0.6 + i * cw + (cw - 0.16) / 2, 1.2 + (i % 2 ? 0.48 : 0) + hy / 2]);
        cs.slice(1).forEach(([x2, y2], i) => { const [x1, y1] = cs[i]; t.line(s, x1, Math.min(y1, y2), x2 - x1, Math.abs(y2 - y1), C.brown, 1.5, { dash: 'sysDash', name: 'Flight', flipV: y2 < y1 }); });
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * cw, [cx, cy] = cs[i], y = cy + hy / 2 + 0.05;
          hexNum(s, String(i + 1), cx - hw / 2, cy - hy / 2, hw, i % 2 ? C.dark : C.amber, i % 2 ? C.amber : C.dark, 20);
          head(s, st.h, x, y, cw - 0.16, 0.52, { align: 'center', max: 15 });
          body(s, st.t, x, y + 0.53, cw - 0.16, 5.08 - y - 0.53, { align: 'center', max: 13 });
        });
        t.img(s, await bee(), 9.0, 1.1, 0.46, 0.35);
      },
    ],
    stats: [
      async (d) => { // the big cell and two small ones locked to it
        const s = page(d), [a, ...rest] = d.stats, w = 3.8, h = w * HEXR, x = 0.5, y = 1.3, sw = 1.72, sh = sw * HEXR;
        hex(s, x, y, w, C.amber);
        t.text(s, a.value, { x: x + 0.6, y: y + 0.55, w: w - 1.2, h: 1.15, bold: true, color: C.dark, align: 'center', valign: 'middle', fontSize: L.fit(a.value, w - 1.2, 1.1, 54, 26, F.head, true) });
        body(s, a.label, x + 0.8, y + 1.72, w - 1.6, 0.85, { color: C.dark, align: 'center', max: 12.5 });
        rest.forEach((q, i) => {
          const px = 4.2, py = 1.15 + i * (sh + 0.1);
          hex(s, px, py, sw, i ? C.honey : C.dark);
          t.text(s, q.value, { x: px + 0.22, y: py, w: sw - 0.44, h: sh, bold: true, color: i ? C.dark : C.amber, align: 'center', valign: 'middle', fontSize: L.fit(q.value, sw - 0.44, 0.7, 26, 14, F.head, true) });
          body(s, q.label, px + sw + 0.12, py, 9.4 - px - sw - 0.12, sh, { color: C.dark, max: 13, valign: 'middle' });
        });
        if (d.note) body(s, d.note, 4.25, 4.2, 5.15, 0.92, { max: 11, valign: 'middle' });
      },
      async (d) => { // the dark hive: figures in a column, a thin honey rule between
        const s = night(d), h = 0.9;
        d.stats.forEach((x, i) => {
          const y = 1.2 + i * h;
          if (i) t.line(s, 0.6, y - 0.03, 8.8, 0, C.brown, 1);
          hex(s, 0.6, y + 0.16, 0.6, i % 2 ? C.honey : C.amber);
          t.text(s, x.value, { x: 1.4, y, w: 3.3, h: h - 0.06, bold: true, color: C.amber, valign: 'middle', fontSize: L.fit(x.value, 3.3, h - 0.1, 42, 22, F.head, true) });
          body(s, x.label, 4.85, y, 4.55, h - 0.06, { color: C.white, max: 15, valign: 'middle' });
        });
        if (d.note) body(s, d.note, 0.6, 3.95, 8.8, 1.15, { color: PALE, max: 12, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // two halves of the page, the cell in the middle holds them together
        const s = page(d), y = 1.22, h = 3.88;
        t.rect(s, 0.6, y, 4.4, h, C.white, { line: { color: C.honey, width: 1 }, name: 'Left' });
        t.rect(s, 5, y, 4.4, h, C.dark, { name: 'Right' });
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.5 : 0.8, w = 3.7, align = i ? 'left' : 'right', n = side.items.length, rh = (h - 0.88) / n;
          head(s, side.h, x, y + 0.14, w, 0.56, { color: i ? C.amber : C.brown, align, max: 19 });
          side.items.forEach((it, k) => body(s, it, x, y + 0.76 + k * rh, w, rh - 0.04, { color: i ? C.white : C.dark, align, max: 14, valign: 'middle' }));
        });
        hex(s, 4.58, y + h / 2 - 0.36, 0.84, C.amber);
        t.text(s, '⇄', { x: 4.58, y: y + h / 2 - 0.36, w: 0.84, h: 0.72, fontSize: 18, bold: true, color: C.dark, align: 'center', valign: 'middle' });
      },
      async (d) => { // two bands, honey and dark, one over the other
        const s = page(d), bh = 1.86;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.22 + i * (bh + 0.12), n = side.items.length, x0 = 3.05, cw = (9.3 - x0) / n, fg = i ? C.white : C.dark;
          t.rect(s, 0.6, y, 8.8, bh, i ? C.dark : C.honey, { name: 'Band' });
          hex(s, 0.72, y + 0.42, 0.46, i ? C.amber : C.dark);
          head(s, side.h, 1.28, y + 0.1, 1.6, bh - 0.2, { color: i ? C.amber : C.dark, max: 18 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.06, y + 0.24, 0, bh - 0.48, i ? C.brown : C.amber, 1);
            body(s, it, x0 + k * cw + 0.02, y + 0.1, cw - 0.16, bh - 0.2, { color: fg, max: 13.5, valign: 'middle' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the dark hive, the sentence stored in one great cell
        const s = night({}), w = 5.75, h = w * HEXR, x = 0.25, y = 0.18;
        hex(s, x - 0.1, y - 0.08, w + 0.2, C.honey);
        hex(s, x, y, w, C.amber);
        t.text(s, L.runs(d.text), { x: x + 0.85, y: y + 0.65, w: w - 1.7, h: h - 1.3, bold: true, color: C.dark, align: 'center', valign: 'middle', fontSize: L.fit(d.text, w - 1.7, h - 1.4, 28, 16, F.head, true) });
        if (d.title) t.text(s, d.title, { x: 6.25, y: 0.95, w: 3.15, h: 1.0, bold: true, color: C.honey, valign: 'bottom', fontSize: L.fit(d.title, 3.15, 0.98, 20, 13, F.head, true) });
        if (d.caption) body(s, d.caption, 6.25, 2.05, 3.15, 2.95, { color: PALE, max: 13 });
      },
      async (d) => { // the honey page, cells flying off the upper corner
        const s = page(d, C.honey);
        for (const [x, y, w, f] of [[8.55, 1.15, 0.9, C.amber], [7.85, 1.55, 0.6, C.dark], [8.95, 1.95, 0.5, C.white]]) hex(s, x, y, w, f);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.2, w: 7.0, h: 2.35, bold: true, color: C.dark, valign: 'middle', fontSize: L.fit(d.text, 7.0, 2.3, 36, 20, F.head, true) });
        t.rect(s, 0.6, 3.68, 0.9, 0.06, C.dark, { name: 'Rule' });
        if (d.caption) body(s, d.caption, 0.6, 3.82, 8.8, 1.25, { color: C.dark, max: 13.5 });
      },
    ],
    timeline: [
      async (d) => { // big year cells on one line, the events by turns above and below
        const s = page(d), ly = 3.05, hw = 1.3, hh = hw * HEXR, cxs = [1.4, 3.8, 6.2, 8.6];
        t.rect(s, 0, ly - 0.04, W, 0.08, C.honey, { name: 'Line' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = i < 2 ? 0.6 : 5.2, y = up ? 1.15 : ly + hh / 2 + 0.04, w = 4.2;
          hexNum(s, it.year, cxs[i] - hw / 2, ly - hh / 2, hw, i % 2 ? C.dark : C.amber, i % 2 ? C.amber : C.dark, L.fit(it.year, hw - 0.5, 0.7, 18, 11, F.head, true));
          head(s, it.h, x, y, w, 0.3, { max: 15 });
          body(s, it.t, x, y + 0.3, w, up ? 0.92 : 0.96, { max: 12.5 });
        });
      },
      async (d) => { // the dark hive: years in a chain of cells down the margin
        const s = night(d), h = 0.97, hw = 1.05;
        d.items.forEach((it, i) => {
          const y = 1.14 + i * h, f = i % 2 ? C.honey : C.amber;
          hexNum(s, it.year, 0.6 + (i % 2 ? 0.45 : 0), y, hw, f, C.dark, L.fit(it.year, hw - 0.42, 0.6, 16, 10, F.head, true));
          head(s, it.h, 2.3, y, 2.5, hw * HEXR, { color: C.honey, max: 16 });
          body(s, it.t, 4.9, y, 4.5, hw * HEXR, { color: PALE, max: 13, valign: 'middle' });
        });
      },
      async (d) => { // white plates, the year in a cell at the corner, the right column set lower
        const s = page(d), w = 4.3, h = 1.6, hw = 1.15;
        d.items.forEach((it, i) => {
          const x = 0.6 + (i % 2) * (w + 0.2), y = 1.3 + Math.floor(i / 2) * (h + 0.14) + (i % 2 ? 0.12 : 0);
          t.rect(s, x + 0.3, y, w - 0.3, h, C.white, { line: { color: C.honey, width: 1 }, name: 'Plate' });
          hexNum(s, it.year, x, y + (h - hw * HEXR) / 2, hw, i % 2 ? C.dark : C.amber, i % 2 ? C.amber : C.dark, L.fit(it.year, hw - 0.46, 0.6, 16, 10, F.head, true));
          head(s, it.h, x + 1.3, y + 0.08, w - 1.45, 0.34, { max: 15 });
          body(s, it.t, x + 1.3, y + 0.44, w - 1.45, h - 0.52, { max: 12.5 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Asalari', colors: { dk1: C.dark, lt1: C.white, dk2: '3D3D3D', lt2: C.light, accent1: C.amber, accent2: C.honey, accent3: C.brown, accent4: C.dark, accent5: C.muted, accent6: 'FFE7B3', hlink: C.brown, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "tizimli; mehnat va hamkorlik ohangi, aniq", "limits": {}};
module.exports = { id: 30, slug: 'asalari', name: 'Asalari', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "technical"], "transitions": ["p14:honeycomb", "fade", "morph"], "cover": ["springIn", "popOver"], "mark": "popIn", "deco": "popIn", "sig": {"title": "springIn", "body": "fadeUp", "item": "popOver", "image": "diamond", "number": "popOver", "order": "centerOut", "stagger": 0.11}, "tempo": 0.95, "kenburns": false};
