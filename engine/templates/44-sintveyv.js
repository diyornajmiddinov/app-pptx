/**
 * 44 Sintveyv — 80s synthwave / outrun: magenta-to-violet sky, striped neon sun,
 * perspective grid floor, neon-outlined panels, duotone photos.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: '1A0B2E', panel: '24113F', pink: 'FF2E97', cyan: '00E5FF', yellow: 'FFD319', orange: 'FF7B2E', text: 'F8F0FF', muted: 'B9A6D9' };
const F = { head: 'Arial', body: 'Calibri' };
const NEON = [C.pink, C.cyan, C.yellow, C.orange];

const grid = (w, h, top, color, opacity) => { // perspective floor from y=top to h
  let g = ''; const vx = w / 2;
  for (let k = 1; k < 16; k++) { const y = top + (h - top) * Math.pow(k / 15, 2.2); g += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}"/>`; }
  for (let k = -14; k <= 14; k++) g += `<line x1="${vx}" y1="${top}" x2="${vx + k * w * 0.12}" y2="${h}"/>`;
  return `<g stroke="#${color}" stroke-width="2.5" stroke-opacity="${opacity}">${g}</g>`;
};
const heroSvg = (sun = true) => { // sun on the right, text area on the left
  let gaps = ''; for (let k = 0; k < 6; k++) gaps += `<rect x="960" y="${440 + k * 20}" width="440" height="${4 + k * 2.2}" fill="#4A1268"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs>
   <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12062A"/><stop offset="0.55" stop-color="#3A0F5A"/><stop offset="0.62" stop-color="#8A1F7A"/></linearGradient>
   <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD319"/><stop offset="1" stop-color="#FF2E97"/></linearGradient>
   <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A0A45"/><stop offset="1" stop-color="#0E0420"/></linearGradient></defs>
   <rect width="1600" height="900" fill="url(#sky)"/>${sun ? `<circle cx="1180" cy="430" r="200" fill="url(#sun)"/>${gaps}` : ''}
   <rect y="560" width="1600" height="340" fill="url(#floor)"/>${grid(1600, 900, 560, C.pink, 0.75)}<line x1="0" y1="560" x2="1600" y2="560" stroke="#${C.cyan}" stroke-width="4"/></svg>`;
};
// the photo becomes the sun: a circle cut at the horizon, with the striped gaps on top
const SUN = { x: 6.125, y: 1.4375, d: 2.5, cut: (3.5 - 1.4375) / 2.5 };
const sunMask = () => { const c = SUN.cut, dx = Math.sqrt(0.25 - (c - 0.5) ** 2); return { path: `M${(0.5 - dx).toFixed(4)},${c.toFixed(4)} A0.5,0.5 0 1 1 ${(0.5 + dx).toFixed(4)},${c.toFixed(4)} Z` }; };
const pageSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140726"/><stop offset="1" stop-color="#2A0D47"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#b)"/>${grid(1600, 900, 780, C.pink, 0.35)}<line x1="0" y1="780" x2="1600" y2="780" stroke="#${C.cyan}" stroke-width="2" stroke-opacity="0.7"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const heroBg = await L.svg(heroSvg(), 1600, 900, true), heroNoSun = await L.svg(heroSvg(false), 1600, 900, true), bg = await L.svg(pageSvg(), 1600, 900, true);
  const UP = (x) => String(x).toUpperCase();
  const glow = (color) => ({ glow: { size: 6, opacity: 0.55, color } });
  const panel = (s, x, y, w, h, col = C.cyan) => t.rect(s, x, y, w, h, C.panel, { t: 10, line: { color: col, width: 1.75 }, name: 'Neon panel' });
  const photo = async (s, src, x, y, w, h, col = C.pink) => { t.rect(s, x - 0.06, y - 0.06, w + 0.12, h + 0.12, null, { line: { color: col, width: 2.5 }, name: 'Neon frame' }); t.img(s, await L.photo(L.src(src), w, h, { duo: ['2B0F4C', 'FF8FCB'] }), x, y, w, h, { alt: '' }); };
  const footer = (s) => t.text(s, UP(`${M.topic || ''}  //  ${meta}`), { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 7.5, bold: true, color: C.muted, align: 'center', charSpacing: 1 });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    t.text(s, L.pad2(idx), { x: 0.55, y: 0.38, w: 0.75, h: 0.6, fontSize: 22, bold: true, italic: true, color: C.cyan, valign: 'middle', ...glow(C.cyan) });
    if (d.title) t.text(s, UP(d.title), { x: 1.35, y: 0.38, w: 8.1, h: 0.6, bold: true, italic: true, color: C.text, valign: 'middle', charSpacing: 1, fontSize: L.fit(UP(d.title), 7.6, 0.6, 24, 13, F.head, true), ...glow(C.pink) });
    t.line(s, 1.35, 1.05, 1.2, 0, C.pink, 2);
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.text, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: d.image ? heroNoSun : heroBg }; idx++;
    if (d.image) {
      t.img(s, await L.photo(L.src(d.image), SUN.d, SUN.d, { mask: sunMask(), duo: ['5A1060', 'FFD36E'] }), SUN.x, SUN.y, SUN.d, SUN.d, { alt: '' });
      for (let k = 0; k < 6; k++) t.rect(s, SUN.x, 2.75 + k * 0.125, SUN.d, 0.025 + k * 0.014, '4A1268', { name: 'Sun stripe' });
    }
    t.text(s, UP([M.org, M.loc, M.year].filter(Boolean).join('  //  ')), { x: 0.6, y: 0.5, w: 5.2, h: 0.3, fontSize: 11, bold: true, color: C.cyan, charSpacing: 3 });
    const T = UP(d.title);
    t.text(s, T, { x: 0.6, y: 0.85, w: 5.3, h: 2.5, bold: true, italic: true, fontSize: L.fit(T, 5.0, 2.4, 40, 18, F.head, true), color: C.text, valign: 'middle', ...glow(C.pink) });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.9, w: 8.8, h: 0.5, fontSize: 13, color: C.text, align: 'center' });
    t.text(s, UP(M.author || ''), { x: 0.6, y: 4.45, w: 8.8, h: 0.4, fontSize: 15, bold: true, color: C.yellow, align: 'center', charSpacing: 3, ...glow(C.orange) });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = page(d); await photo(s, d.image, 0.7, 1.45, 4.0, 3.2); panel(s, 5.05, 1.4, 4.4, 3.35); para(s, d.text, 5.3, 1.55, 3.9, 3.05); },
    async image(d) { const s = page(d); panel(s, 0.6, 1.4, 4.3, 3.35, C.pink); para(s, d.text, 0.85, 1.55, 3.8, 3.05); await photo(s, d.image, 5.3, 1.45, 4.1, 3.2, C.cyan); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.3 / per);
      d.items.forEach((it, i) => {
        const x = 0.7 + Math.floor(i / per) * 4.4, y = 1.4 + (i % per) * rh, col = NEON[i % 4];
        t.text(s, L.pad2(i + 1), { x, y, w: 0.8, h: 0.6, fontSize: 24, bold: true, italic: true, color: col, valign: 'middle', ...glow(col) });
        t.text(s, UP(it), { x: x + 0.85, y, w: 3.4, h: 0.6, fontSize: 14, bold: true, color: C.text, valign: 'middle', charSpacing: 1 });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.25, 1.45 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.3);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), col = NEON[i % 4];
        panel(s, x, 1.45, w, h, col);
        t.img(s, await L.icon(it.icon, col, 2), x + 0.2, 1.65, 0.42, 0.42);
        t.text(s, UP(it.h), { x: x + 0.2, y: 2.2, w: w - 0.4, h: 0.45, fontSize: L.fit(UP(it.h), w - 0.4, 0.45, 14, 10, F.head, true), bold: true, color: col });
        t.text(s, it.t, { x: x + 0.2, y: 2.68, w: w - 0.4, h: h - 1.3, fontSize: 14, color: C.text });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      t.line(s, 0.6 + 0.35, 1.8, cw * (n - 1), 0, C.pink, 2.5);
      d.steps.forEach((st, i) => {
        const x = 0.6 + i * cw, col = NEON[i % 4];
        t.rect(s, x, 1.45, 0.7, 0.7, C.bg, { line: { color: col, width: 2.5 }, rotate: 45, name: 'Node' });
        t.text(s, String(i + 1), { x, y: 1.45, w: 0.7, h: 0.7, fontSize: 18, bold: true, color: col, align: 'center', valign: 'middle' });
        t.text(s, UP(st.h), { x, y: 2.45, w: cw - 0.3, h: 0.5, fontSize: L.fit(UP(st.h), cw - 0.3, 0.5, 14, 10, F.head, true), bold: true, color: C.text });
        t.text(s, st.t, { x, y: 3.0, w: cw - 0.3, h: 1.8, fontSize: L.fit(st.t, cw - 0.3, 1.8, 14, 10, F.body), color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw, col = NEON[i % 4];
        t.text(s, x.value, { x: px, y: 1.45, w: cw - 0.3, h: 1.4, fontSize: L.fit(x.value, cw - 0.4, 1.3, 64, 28, F.head, true), bold: true, italic: true, color: col, align: 'center', valign: 'middle', ...glow(col) });
        t.line(s, px + 0.4, 2.95, cw - 1.1, 0, col, 1.5);
        t.text(s, x.label, { x: px, y: 3.05, w: cw - 0.3, h: 0.9, fontSize: 14, color: C.text, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.05, w: 8.8, h: 0.45, fontSize: 10, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.25;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.6 + i * (w + 0.3), col = i ? C.cyan : C.pink;
        panel(s, x, 1.4, w, 3.3, col);
        t.text(s, UP(side.h), { x: x + 0.25, y: 1.55, w: w - 0.5, h: 0.5, fontSize: 15, bold: true, italic: true, color: col, ...glow(col) });
        let y = 2.2;
        side.items.forEach((it, k) => { t.text(s, '\u25B6', { x: x + 0.25, y, w: 0.3, h: 0.3, fontSize: 10, color: col }); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[k], fontSize: CFS, color: C.text }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = pres.addSlide(); s.background = { data: heroBg }; idx++;
      t.text(s, L.runs(UP(d.text)), { x: 0.6, y: 0.7, w: 5.3, h: 2.6, bold: true, italic: true, fontSize: L.fit(UP(d.text), 5.0, 2.5, 34, 16, F.head, true), color: C.text, valign: 'middle', ...glow(C.pink) });
      if (d.caption) { t.rect(s, 0.9, 3.85, 8.2, 1.1, C.bg, { t: 10, name: 'Caption ground' }); t.text(s, d.caption, { x: 1.1, y: 3.9, w: 7.8, h: 1.0, fontSize: L.fit(d.caption, 7.8, 1.0, 13, 10, F.body), color: C.text, align: 'center', valign: 'middle' }); }
      footer(s);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      t.line(s, 0.6, 2.25, 8.8, 0, C.cyan, 2);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw, col = NEON[i % 4];
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.65, fontSize: L.fit(it.year, cw - 0.3, 0.6, 26, 13, F.head, true), bold: true, italic: true, color: col, valign: 'bottom', ...glow(col) });
        t.oval(s, x, 2.13, 0.24, 0.24, col);
        t.text(s, UP(it.h), { x, y: 2.6, w: cw - 0.3, h: 0.42, fontSize: 13, bold: true, color: C.text });
        t.text(s, it.t, { x, y: 3.05, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { data: heroBg }; idx++;
      t.text(s, d.text, { x: 0.6, y: 0.7, w: 5.3, h: 2.6, italic: true, bold: true, fontSize: L.fit(d.text, 5.3, 2.5, 30, 16, F.head, true), color: C.text, valign: 'middle', ...glow(C.cyan) });
      if (d.author) t.text(s, UP(d.author), { x: 0.8, y: 4.3, w: 8.4, h: 0.4, fontSize: 13, bold: true, color: C.yellow, align: 'center', charSpacing: 3 });
      footer(s);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.56, 3.3 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, L.pad2(i + 1), { x: 0.6, y, w: 0.55, h: rh, fontSize: 13, bold: true, italic: true, color: NEON[i % 4], valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.2, h: rh, fontSize: L.fit(it, 8.2, rh - 0.04, 14, 10, F.body), color: C.text, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, under a neon sky: a deck's pages must not look alike (L.pages)
  const X0 = 0.6, FW = 8.8, Y1 = 4.84, INK = C.bg;
  const cap = (s, v, x, y, w, h, o = {}) => { const T = UP(v); t.text(s, T, { x, y, w, h, bold: true, italic: o.italic, fontSize: L.fit(T, w, h, o.max || 13, 10, F.head, true), color: o.color || C.text, align: o.align, valign: o.valign || 'middle' }); };
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.text, align: o.align, valign: o.valign || 'top' });
  const memo = {}; const svgM = async (k, fn, w, h) => (memo[k] ??= await L.svg(fn(), w, h));
  const sunBars = (D) => { let g = `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#${C.yellow}"/><stop offset="1" stop-color="#${C.pink}"/></linearGradient></defs><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2 - 2}" fill="url(#s)"/>`; for (let k = 0; k < 6; k++) g += `<rect x="0" y="${D * 0.52 + k * D * 0.08}" width="${D}" height="${D * (0.012 + k * 0.007)}" fill="#${INK}"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${D}" height="${D}">${g}</svg>`; };
  const SKEW = 0.14, LEAN = { poly: [[SKEW, 0], [1, 0], [1 - SKEW, 1], [0, 1]] };
  const leanLine = (w, h, col) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><polygon points="${SKEW * w},3 ${w - 3},3 ${(1 - SKEW) * w},${h - 3} 3,${h - 3}" fill="none" stroke="#${col}" stroke-width="6"/></svg>`;
  const sunsetSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#${C.pink}"/><stop offset="0.65" stop-color="#${C.orange}"/><stop offset="1" stop-color="#${C.yellow}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/></svg>`;
  const V = {
    image: [
      async (d) => { // the VHS frame: a long picture across the screen, tracking lines on it, words beneath
        const s = page(d), y = 1.22, h = 1.86; let L_ = '';
        for (let k = 0; k < 40; k += 2) L_ += `<rect x="0" y="${k * 4.65}" width="880" height="3" fill="#000" opacity="0.18"/>`;
        await photo(s, d.image, X0 + 0.06, y, FW - 0.12, h, C.cyan);
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="186">${L_}</svg>`, 880, 186), X0 + 0.06, y, FW - 0.12, h);
        panel(s, X0, 3.2, FW, 1.64, C.pink);
        para(s, d.text, X0 + 0.2, 3.26, FW - 0.4, 1.52);
      },
      async (d) => { // the picture is the setting sun: round, tinted, cut with dark bars below
        const s = page(d), D = 3.6, x = 5.9, y = 1.24;
        t.img(s, await L.photo(L.src(d.image), D, D, { mask: 'circle', duo: ['5A1060', 'FFD36E'] }), x, y, D, D, { alt: d.title });
        for (let k = 0; k < 6; k++) t.rect(s, x, y + D * 0.54 + k * D * 0.075, D, D * (0.012 + k * 0.007), INK, { name: 'Sun stripe' });
        panel(s, X0, 1.3, 5.0, 3.5, C.yellow);
        para(s, d.text, X0 + 0.22, 1.38, 4.56, 3.34);
      },
      async (d) => { // the picture is the whole screen, a dark panel in neon leaning on it
        const s = pres.addSlide(); s.background = { data: bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H, { duo: [INK, 'FF8FCB'] }), 0, 0, W, H, { alt: d.title });
        t.rect(s, 0.4, 0.35, 5.6, 4.6, INK, { t: 8, line: { color: C.cyan, width: 2 }, name: 'Neon panel' });
        t.text(s, L.pad2(idx), { x: 0.6, y: 0.5, w: 0.75, h: 0.6, fontSize: 22, bold: true, italic: true, color: C.cyan, valign: 'middle' });
        cap(s, d.title, 1.35, 0.46, 4.5, 0.72, { italic: true, max: 15 });
        t.line(s, 0.62, 1.22, 5.16, 0, C.pink, 2);
        para(s, d.text, 0.65, 1.3, 5.1, 3.55);
        t.rect(s, 0, 5.16, W, 0.42, INK, { name: 'Footer band' });
        footer(s);
      },
      async (d) => { // leaning at speed: the picture in italics, a neon edge, words on the slant's other side
        const s = page(d), x = 4.5, y = 1.25, w = 5.2, h = 3.55;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: LEAN, duo: ['2B0F4C', 'FF8FCB'] }), x, y, w, h, { alt: d.title });
        t.img(s, await svgM('lean', () => leanLine(520, 355, C.pink), 520, 355), x, y, w, h);
        para(s, d.text, X0, 1.3, 3.95, 3.5);
      },
    ],
    cards: [
      async (d) => { // cassette spines: a solid colour block, the title and words in a neon rail
        const s = page(d), n = d.items.length, g = 0.1, h = (3.54 - g * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.28 + i * (h + g), col = NEON[i];
          panel(s, X0, y, FW, h, col);
          t.rect(s, X0, y, 1.05, h, col, { name: 'Spine' });
          t.img(s, await L.icon(it.icon, INK, 2.25), X0 + 0.34, y + h / 2 - 0.18, 0.36, 0.36);
          cap(s, it.h, X0 + 1.2, y + 0.05, FW - 1.35, 0.3, { color: col });
          body(s, it.t, X0 + 1.2, y + 0.35, FW - 1.35, h - 0.4, { max: 13.5 });
        }
      },
      async (d) => { // neon slabs, solid colour with dark print, set at two heights
        const s = page(d), n = d.items.length, g = 0.14, w = (FW - g * (n - 1)) / n, h = 3.02;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + g), y = 1.26 + (i % 2 ? 0.54 : 0), col = NEON[i];
          t.rect(s, x, y, w, h, col, { name: 'Neon slab' });
          t.img(s, await L.icon(it.icon, INK, 2.25), x + 0.15, y + 0.14, 0.38, 0.38);
          cap(s, it.h, x + 0.15, y + 0.56, w - 0.3, 0.5, { color: INK, valign: 'top' });
          body(s, it.t, x + 0.15, y + 1.08, w - 0.3, h - 1.16, { color: INK, max: 13.5 });
        }
      },
      async (d) => { // the striped sun at the centre, neon rays out to a panel for each idea
        const s = page(d), n = d.items.length, cx = 5, cy = 3.05, w = 3.25, left = 2, right = n - left, hL = 1.78, hR = 3.56 / right, D = 1.5;
        const spot = (i) => (i < left ? [X0, 1.28 + i * hL, hL - 0.12] : [6.15, right === 1 ? cy - 0.85 : 1.28 + (i - left) * hR, right === 1 ? 1.7 : hR - 0.12]);
        d.items.forEach((_, i) => { const [x, y, h] = spot(i), my = y + h / 2, ex = i < left ? x + w : x, up = my < cy; t.line(s, Math.min(ex, cx), Math.min(my, cy), Math.abs(cx - ex), Math.abs(my - cy), NEON[i], 2, { flipV: (ex < cx) !== up }); });
        t.img(s, await svgM('sun', () => sunBars(300), 300, 300), cx - D / 2, cy - D / 2, D, D);
        for (const [i, it] of d.items.entries()) {
          const [x, y, h] = spot(i), col = NEON[i];
          t.rect(s, x, y, w, h, INK, { line: { color: col, width: 1.75 }, name: 'Neon panel' });
          t.img(s, await L.icon(it.icon, col, 2), x + 0.13, y + 0.1, 0.28, 0.28);
          cap(s, it.h, x + 0.48, y + 0.06, w - 0.6, 0.36, { color: col, max: 12 });
          body(s, it.t, x + 0.14, y + 0.46, w - 0.28, h - 0.54, { max: 13 });
        }
      },
      async (d) => { // the hit single: a huge icon and its line on the main stage, B-sides to the right
        const s = page(d), [a, ...rest] = d.items, g = 0.1, h = (3.54 - g * (rest.length - 1)) / rest.length;
        panel(s, X0, 1.28, 4.35, 3.54, C.pink);
        t.img(s, await L.icon(a.icon, C.pink, 2), X0 + 0.22, 1.46, 0.8, 0.8);
        cap(s, a.h, X0 + 1.15, 1.46, 3.0, 0.8, { color: C.pink, max: 17, italic: true });
        body(s, a.t, X0 + 0.24, 2.4, 3.87, 2.32, { max: 16 });
        for (const [i, it] of rest.entries()) {
          const y = 1.28 + i * (h + g), col = NEON[i + 1];
          panel(s, 5.1, y, 4.3, h, col);
          t.img(s, await L.icon(it.icon, col, 2), 5.23, y + 0.1, 0.28, 0.28);
          cap(s, it.h, 5.6, y + 0.06, 3.68, 0.36, { color: col, max: 12 });
          body(s, it.t, 5.24, y + 0.44, 4.02, h - 0.5, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // the highway to the vanishing point: stages left and right of the road
        const s = page(d), n = d.steps.length, y0 = 1.24, h = 3.6 / n, cx = 5;
        t.img(s, await svgM('road', () => `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="360"><polygon points="60,0 80,0 138,360 2,360" fill="#${INK}" stroke="#${C.pink}" stroke-width="3"/>${[20, 70, 130, 200, 280].map((yy, k) => `<rect x="${70 - 1 - k * 0.8}" y="${yy}" width="${2 + k * 1.6}" height="${14 + k * 8}" fill="#${C.yellow}"/>`).join('')}</svg>`, 140, 360), cx - 0.7, y0, 1.4, 3.6);
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, left = i % 2 === 0, half = 0.1 + (i + 0.5) / n * 0.62, x = left ? X0 : cx + 0.76, w = 3.6, al = left ? 'right' : 'left', col = NEON[i], N = 0.42;
          const nx = left ? cx - half - N - 0.04 : cx + half + 0.04;
          t.rect(s, nx, y + h / 2 - N / 2, N, N, col, { name: 'Marker' });
          t.text(s, String(i + 1), { x: nx, y: y + h / 2 - N / 2, w: N, h: N, bold: true, fontSize: 14, color: INK, align: 'center', valign: 'middle' });
          const tx = left ? X0 : cx + half + N + 0.14, tw = left ? nx - 0.1 - X0 : 9.4 - tx;
          cap(s, st.h, tx, y + 0.02, tw, 0.28, { color: col, align: al, max: 12 });
          body(s, st.t, tx, y + 0.3, tw, h - 0.34, { align: al, max: 13 });
        });
      },
      async (d) => { // a staircase of neon rising to the right, a stage on each tread
        const s = page(d), n = d.steps.length, g = 0.1, w = (FW - g * (n - 1)) / n, drop = n === 3 ? 0.4 : 0.26;
        d.steps.forEach((st, i) => {
          const x = X0 + i * (w + g), y = 1.26 + (n - 1 - i) * drop, h = Y1 - y, col = NEON[i];
          panel(s, x, y, w, h, col);
          t.text(s, L.pad2(i + 1), { x: x + 0.12, y: y + 0.06, w: 0.8, h: 0.56, bold: true, italic: true, fontSize: 24, color: col, valign: 'middle' });
          cap(s, st.h, x + 0.14, y + 0.62, w - 0.28, 0.46, { valign: 'top', max: 12 });
          body(s, st.t, x + 0.14, y + 1.08, w - 0.28, h - 1.14, { max: 13 });
        });
      },
      async (d) => { // lanes of a race track: each one slides right as the laps go by
        const s = page(d), n = d.steps.length, g = 0.1, h = (3.54 - g * (n - 1)) / n, w = n === 3 ? 7.0 : 6.7, dx = (FW - w) / (n - 1);
        d.steps.forEach((st, i) => {
          const x = X0 + i * dx, y = 1.28 + i * (h + g), col = NEON[i], B = 0.62;
          t.rect(s, x, y, w, h, INK, { t: 8, line: { color: col, width: 1.75 }, name: 'Lane' });
          t.rect(s, x, y, B, h, col, { name: 'Lap' });
          t.text(s, String(i + 1), { x, y, w: B, h, bold: true, italic: true, fontSize: 20, color: INK, align: 'center', valign: 'middle' });
          cap(s, st.h, x + B + 0.14, y + 0.05, w - B - 0.26, 0.28, { color: col });
          body(s, st.t, x + B + 0.14, y + 0.33, w - B - 0.26, h - 0.37, { max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // the high score: huge glowing type, two more on a neon rail beside it
        const s = page(d), [a, ...rest] = d.stats;
        t.text(s, a.value, { x: X0, y: 1.2, w: 5.2, h: 1.6, bold: true, italic: true, fontSize: L.fit(a.value, 5.2, 1.5, 84, 34, F.head, true), color: C.pink, valign: 'middle', ...glow(C.pink) });
        t.line(s, X0, 2.84, 5.0, 0, C.pink, 2);
        body(s, a.label, X0, 2.92, 5.0, 0.72, { max: 15 });
        rest.forEach((q, i) => {
          const y = 1.26 + i * 1.22, col = NEON[i + 1];
          panel(s, 5.9, y, 3.5, 1.12, col);
          t.text(s, q.value, { x: 6.02, y: y + 0.03, w: 3.26, h: 0.58, bold: true, italic: true, fontSize: L.fit(q.value, 3.26, 0.54, 28, 16, F.head, true), color: col, valign: 'middle' });
          body(s, q.label, 6.02, y + 0.6, 3.26, 0.5, { max: 12.5 });
        });
        if (d.note) body(s, d.note, X0, 3.72, FW, 1.1, { max: 13.5, valign: 'middle' });
      },
      async (d) => { // three lit bands of solid colour, each slid along a little
        const s = page(d), h = 0.8, g = 0.08, w = 7.4;
        d.stats.forEach((q, i) => {
          const x = X0 + i * 0.7, y = 1.26 + i * (h + g), col = NEON[i];
          t.rect(s, x, y, w, h, col, { name: 'Neon band' });
          t.text(s, q.value, { x: x + 0.14, y, w: 2.4, h, bold: true, italic: true, fontSize: L.fit(q.value, 2.4, h - 0.14, 30, 16, F.head, true), color: INK, valign: 'middle' });
          body(s, q.label, x + 2.6, y + 0.05, w - 2.72, h - 0.1, { color: INK, max: 14, valign: 'middle' });
        });
        if (d.note) body(s, d.note, X0, 3.94, FW, 0.9, { max: 13.5, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the two sides mirrored about a column of neon, pink and cyan
        const s = page(d), w = 3.95, y0 = 1.82, avail = 3.0, fit = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.12, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        t.rect(s, 4.96, 1.26, 0.04, 3.56, C.pink, { name: 'Neon' }); t.rect(s, 5.0, 1.26, 0.04, 3.56, C.cyan, { name: 'Neon' });
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.2 : 0.85, al = i ? 'left' : 'right', col = i ? C.cyan : C.pink;
          cap(s, side.h, x, 1.26, w, 0.48, { color: col, align: al, italic: true, max: 15 });
          let y = y0;
          fit.rows.forEach((rh0, k) => { const rh = rh0 + extra; if (side.items[k]) t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: C.text, align: al, valign: 'middle' }); y += rh; });
        });
      },
      async (d) => { // two tracks of a mixtape, a solid label heading each, the items in a row
        const s = page(d), bh = 1.7, g = 0.12;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.28 + i * (bh + g), n = side.items.length, col = i ? C.cyan : C.pink, x0 = 3.0, cw = (9.3 - x0) / n;
          panel(s, X0, y, FW, bh, col);
          t.rect(s, X0, y, 2.2, bh, col, { name: 'Label' });
          cap(s, side.h, X0 + 0.14, y + 0.1, 1.92, bh - 0.2, { color: INK, max: 14 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.07, y + 0.16, 0, bh - 0.32, col, 0.75);
            body(s, it, x0 + k * cw, y + 0.08, cw - 0.14, bh - 0.16, { valign: 'middle', max: 13.5 });
          });
        });
      },
    ],
    statement: [
      async (d) => { // sunrise fills the screen: pink through orange to gold, dark italics across it
        const s = pres.addSlide(); s.background = { data: await svgM('sunset', sunsetSvg, 1600, 900) }; idx++;
        t.text(s, L.pad2(idx), { x: 0.55, y: 0.38, w: 0.75, h: 0.6, fontSize: 22, bold: true, italic: true, color: INK, valign: 'middle' });
        if (d.title) cap(s, d.title, 1.35, 0.38, 8.1, 0.6, { color: INK, italic: true, max: 20 });
        t.text(s, L.runs(UP(d.text)), { x: X0, y: 1.1, w: FW, h: 2.5, bold: true, italic: true, fontSize: L.fit(UP(d.text), FW * 0.96, 2.45, 34, 18, F.head, true), color: INK, valign: 'middle' });
        if (d.caption) { t.rect(s, 2.6, 3.62, 6.8, 1.46, INK, { name: 'Panel' }); body(s, d.caption, 2.8, 3.68, 6.4, 1.34, { max: 14, valign: 'middle' }); }
        t.text(s, UP(`${M.topic || ''}  //  ${meta}`), { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 7.5, bold: true, color: INK, align: 'center', charSpacing: 1 });
      },
      async (d) => { // a neon sign on the wall: double tube round the words, the small print beside it
        const s = page(d), x = X0, y = 1.28, w = 5.9, h = 3.5;
        t.rect(s, x, y, w, h, null, { line: { color: C.cyan, width: 3 }, r: 0.14, name: 'Neon tube' });
        t.rect(s, x + 0.1, y + 0.1, w - 0.2, h - 0.2, null, { line: { color: C.pink, width: 2 }, r: 0.1, name: 'Neon tube' });
        t.text(s, L.runs(d.text), { x: x + 0.34, y: y + 0.26, w: w - 0.68, h: h - 0.52, bold: true, italic: true, fontSize: L.fit(d.text, w - 0.68, h - 0.56, 32, 17, F.head, true), color: C.text, align: 'center', valign: 'middle', ...glow(C.pink) });
        if (d.caption) body(s, d.caption, 6.75, 1.3, 2.65, 3.48, { max: 14, valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // the horizon line: dates burn on it, events hang above and below
        const s = page(d), ly = 3.04, w = 4.0, xs = [X0, 1.05, 5.0, 5.4], px = [X0, 2.75, 5.0, 7.3], pw = 1.45, ph = 0.38;
        t.rect(s, 0, ly - 0.02, W, 0.04, C.cyan, { name: 'Horizon' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], col = NEON[i], y = up ? 1.24 : ly + 0.28, h = up ? ly - 0.27 - y : Y1 - y;
          t.rect(s, px[i], ly - ph / 2, pw, ph, col, { name: 'Date' });
          t.text(s, it.year, { x: px[i] + 0.03, y: ly - ph / 2, w: pw - 0.06, h: ph, bold: true, italic: true, fontSize: L.fit(it.year, pw - 0.14, ph - 0.06, 15, 10.5, F.head, true), color: INK, align: 'center', valign: 'middle' });
          cap(s, it.h, x, y, w, 0.28, { color: col, max: 12, align: up ? 'left' : 'right' });
          body(s, it.t, x, y + 0.29, w, h - 0.3, { max: 14, align: up ? 'left' : 'right' });
        });
      },
      async (d) => { // four tapes laid two by two, the date on a coloured label across the top
        const s = page(d), w = 4.32, h = 1.7, g = 0.16;
        d.items.forEach((it, i) => {
          const x = X0 + (i % 2) * (w + g), y = 1.26 + (i >> 1) * (h + 0.12), col = NEON[i];
          panel(s, x, y, w, h, col);
          t.rect(s, x, y, w, 0.42, col, { name: 'Tape label' });
          t.text(s, it.year, { x: x + 0.14, y, w: 1.6, h: 0.42, bold: true, italic: true, fontSize: L.fit(it.year, 1.6, 0.38, 16, 10.5, F.head, true), color: INK, valign: 'middle' });
          cap(s, it.h, x + 1.78, y, w - 1.92, 0.42, { color: INK, max: 11.5, align: 'right' });
          body(s, it.t, x + 0.14, y + 0.48, w - 0.28, h - 0.54, { max: 13.5 });
        });
      },
      async (d) => { // the rear-view: a tall number for each date, reading right to the road ahead
        const s = page(d), cw = FW / 4;
        d.items.forEach((it, i) => {
          const x = X0 + i * cw, w = cw - 0.16, col = NEON[i];
          t.text(s, it.year, { x, y: 1.22, w, h: 0.76, bold: true, italic: true, fontSize: L.fit(it.year, w, 0.72, 30, 13, F.head, true), color: col, valign: 'middle', ...glow(col) });
          t.line(s, x, 2.02, w, 0, col, 2);
          cap(s, it.h, x, 2.1, w, 0.46, { max: 12, valign: 'top' });
          body(s, it.t, x, 2.58, w, Y1 - 2.58, { max: 14 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old timeline read as the process page: a line, marks, columns
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Sintveyv', colors: { dk1: C.bg, lt1: C.text, dk2: C.panel, lt2: C.muted, accent1: C.pink, accent2: C.cyan, accent3: C.yellow, accent4: C.orange, accent5: '8A1F7A', accent6: '3A0F5A', hlink: C.cyan, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "energiyali va zamonaviy: qisqa, ta'sirli, shiorga o'xshash iboralar", limits: { title: 40, card_h: 18, step_h: 18, event_h: 14, stmt: 60 }, prefer: 'visual' };
module.exports = { id: 44, slug: 'sintveyv', name: 'Sintveyv', category: 'creative', photos: true, build, style: STYLE };
