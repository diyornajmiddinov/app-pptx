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
      if (d.caption) t.text(s, d.caption, { x: 1.2, y: 3.95, w: 7.6, h: 0.9, fontSize: L.fit(d.caption, 7.6, 0.9, 13, 9, F.body), color: C.text, align: 'center' });
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Sintveyv', colors: { dk1: C.bg, lt1: C.text, dk2: C.panel, lt2: C.muted, accent1: C.pink, accent2: C.cyan, accent3: C.yellow, accent4: C.orange, accent5: '8A1F7A', accent6: '3A0F5A', hlink: C.cyan, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "energiyali va zamonaviy: qisqa, ta'sirli, shiorga o'xshash iboralar", limits: { title: 40, card_h: 18, step_h: 18, event_h: 14, stmt: 60 }, prefer: 'visual' };
module.exports = { id: 44, slug: 'sintveyv', name: 'Sintveyv', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "technical"], "transitions": ["p14:warp|dir=\"in\"", "zoom", "p14:flash"], "cover": ["sweepIn", "stretch"], "mark": "popIn", "deco": "stretch", "sig": {"title": "stretch", "body": "fadeUp", "item": "sweepIn", "image": "zoomIn", "number": "popOver", "order": "cascade", "stagger": 0.1}, "tempo": 0.9, "kenburns": false};
