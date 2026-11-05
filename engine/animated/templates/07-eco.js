/**
 * 07 Eco — natural, calm look: organic blob shapes, forest and leaf greens,
 * a flowing curve for processes and timelines, Cambria headlines.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F3F6EF', forest: '1F4D36', leaf: '5E9F6B', moss: 'A7CBA9', sand: 'E6DFCB', ink: '1B2E22', muted: '56675B', white: 'FFFFFF' };
const F = { head: 'Cambria', body: 'Calibri' };

function blobPath(cx, cy, r, seed, n = 7, wobble = 0.22) {
  let x = seed; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  const pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, rr = r * (1 - wobble / 2 + rnd() * wobble); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; });
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d + 'Z';
}
const blobSvg = (size, color, seed, opacity = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><path d="${blobPath(size / 2, size / 2, size * 0.46, seed)}" fill="#${color}" fill-opacity="${opacity}"/></svg>`;
const clusterSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
  <path d="${blobPath(520, 400, 330, 11)}" fill="#${C.moss}"/>
  <path d="${blobPath(390, 560, 230, 23)}" fill="#${C.leaf}"/>
  <path d="${blobPath(640, 640, 150, 37)}" fill="#${C.forest}"/>
  <g fill="none" stroke="#${C.white}" stroke-opacity="0.55" stroke-width="5"><path d="M330,700 C430,560 560,430 760,300"/><path d="M470,560 C470,500 440,450 400,420"/><path d="M590,450 C640,440 690,400 710,350"/></g></svg>`;
const wave = (x, w, base, amp) => base + amp * Math.sin((x / w) * Math.PI * 2 - Math.PI / 2);
const waveSvg = (w, h, base, amp, color) => { let d = ''; for (let i = 0; i <= 200; i++) { const x = (i / 200) * w; d += (i ? ' L' : 'M') + `${x},${wave(x, w, base, amp)}`; } return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="none" stroke="#${color}" stroke-width="5" stroke-linecap="round"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const memo = {}; const m = async (k, fn) => (memo[k] ??= await fn());
  const blob = (size, color, seed, op = 1) => m(`b${color}${seed}${op}`, () => L.svg(blobSvg(400, color, seed, op), 400, 400));
  const cluster = () => m('cluster', () => L.svg(clusterSvg, 900, 900));
  const waveImg = () => m('wave', () => L.svg(waveSvg(880, 120, 60, 40, C.leaf), 880, 120));
  const waveY = (x) => 1.25 + wave((x - 0.6) * 100, 880, 60, 40) / 100; // slide inches, image at y 1.25 h 1.2

  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.img(s, await blob(400, C.moss, 5, 0.55), 8.3, 4.0, 2.6, 2.6);
    t.text(s, d.title, { x: 0.6, y: 0.4, w: 8.4, h: 0.8, fontFace: F.head, bold: true, color: C.forest, valign: 'middle', fontSize: L.fit(d.title, 8.4, 0.8, 28, 20, F.head, true) });
    s.slideNumber = { x: 0.6, y: 5.12, w: 0.5, h: 0.25, fontFace: F.body, fontSize: 10, color: C.muted };
    return s;
  };
  const card = (s, x, y, w, h, fill = C.white) => t.rect(s, x, y, w, h, fill, { r: 0.25, name: 'Card' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.img(s, await cluster(), 5.2, 0.35, 5.0, 5.0);
    const fs = L.fit(d.title, 5.0, 2.4, 46, 28, F.head, true, 0.95);
    t.text(s, d.title, { x: 0.6, y: 0.6, w: 5.0, h: 2.6, fontFace: F.head, bold: true, fontSize: fs, color: C.forest, valign: 'bottom', lineSpacingMultiple: 0.95 });
    t.rect(s, 0.6, 3.45, 0.7, 0.07, C.leaf, { r: 0.035, name: 'Leaf rule' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.7, w: 4.6, h: 1.3, fontSize: 16, color: C.muted });
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.08, 3.5 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + Math.floor(i / per) * 4.3, y = 1.5 + (i % per) * rh;
        t.img(s, await blob(400, i % 2 ? C.leaf : C.forest, 3 + i), x, y, 0.72, 0.72);
        t.text(s, String(i + 1), { x, y, w: 0.72, h: 0.72, fontFace: F.head, fontSize: 18, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.95, y, w: 3.15, h: 0.72, fontSize: 17, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      if (d.items.length > 3) { // 2 x 2 rounded cards, leaf blob on the left
        const s = await page(d), w = 4.1, rws = Math.ceil(d.items.length / 2), h = (3.45 - 0.3 * (rws - 1)) / rws;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + (i % 2) * (w + 0.3), y = 1.5 + Math.floor(i / 2) * (h + 0.3);
          card(s, x, y, w, h);
          t.img(s, await blob(400, [C.leaf, C.forest, C.moss, C.forest][i % 4], 41 + i), x + 0.2, y + 0.2, 0.75, 0.75);
          t.img(s, await L.icon(it.icon, C.white, 2), x + 0.42, y + 0.42, 0.31, 0.31);
          t.text(s, it.h, { x: x + 1.15, y: y + 0.22, w: w - 1.4, h: 0.4, fontFace: F.head, fontSize: L.fit(it.h, w - 1.4, 0.4, 17, 12, F.head, true), bold: true, color: C.forest });
          t.text(s, it.t, { x: x + 1.15, y: y + 0.65, w: w - 1.4, h: h - 0.8, fontSize: 14, color: C.muted });
        }
        return;
      }
      const s = await page(d), n = d.items.length, gap = 0.3, w = (8.4 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.6, 0.45, 19, 13, F.head, true)));
      const h = Math.min(3.45, 1.85 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.6, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.5;
        card(s, x, y, w, h);
        t.img(s, await blob(400, [C.leaf, C.forest, C.moss][i % 3], 41 + i), x + 0.25, y + 0.25, 0.85, 0.85);
        t.img(s, await L.icon(it.icon, C.white, 2), x + 0.5, y + 0.5, 0.35, 0.35);
        t.text(s, it.h, { x: x + 0.3, y: y + 1.3, w: w - 0.6, h: 0.45, fontFace: F.head, fontSize: hfs, bold: true, color: C.forest });
        t.text(s, it.t, { x: x + 0.3, y: y + 1.8, w: w - 0.6, h: h - 1.95, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      t.img(s, await waveImg(), 0.6, 1.25, 8.8, 1.2);
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.45, 18, 12, F.head, true)));
      d.steps.forEach((st, i) => {
        const cx = 0.6 + cw * i + cw / 2, cy = waveY(cx);
        t.oval(s, cx - 0.3, cy - 0.3, 0.6, 0.6, C.forest, { line: { color: C.bg, width: 3 } });
        t.text(s, String(i + 1), { x: cx - 0.3, y: cy - 0.3, w: 0.6, h: 0.6, fontFace: F.head, fontSize: 16, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x: cx - cw / 2 + 0.15, y: 2.85, w: cw - 0.3, h: 0.45, fontFace: F.head, fontSize: hfs, bold: true, color: C.forest, align: 'center' });
        t.text(s, st.t, { x: cx - cw / 2 + 0.15, y: 3.35, w: cw - 0.3, h: 1.6, fontSize: 14, color: C.muted, align: 'center' });
      });
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.4 / n, cols = [C.forest, C.leaf, C.moss];
      for (const [i, x] of d.stats.entries()) {
        const cx = 0.6 + i * cw + cw / 2, dd = 2.0;
        t.img(s, await blob(400, cols[i % 3], 61 + i), cx - dd / 2, 1.4, dd, dd);
        t.text(s, x.value, { x: cx - dd / 2 + 0.2, y: 1.4, w: dd - 0.4, h: dd, fontFace: F.head, bold: true, color: i === 2 ? C.forest : C.white, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd - 0.5, 0.8, 40, 18, F.head, true) });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 3.55, w: cw - 0.4, h: 1.0, fontSize: 15, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.6, w: 8.4, h: 0.4, fontSize: 14, italic: true, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = await page(d), w = 4.2, h = 3.45, y = 1.5;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 1.0, F.body, 0, h - 1.2 - 0.2 * Math.max(d.left.items.length, d.right.items.length));
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3), fg = i ? C.white : C.ink;
        card(s, x, y, w, h, i ? C.forest : C.sand);
        t.text(s, side.h, { x: x + 0.4, y: y + 0.35, w: w - 0.8, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: i ? C.moss : C.forest });
        let yy = y + 1.05;
        for (const [k, it] of side.items.entries()) {
          t.img(s, await L.icon('FiCheck', i ? C.moss : C.leaf, 3), x + 0.38, yy + 0.02, 0.2, 0.2);
          t.text(s, it, { x: x + 0.7, y: yy, w: w - 1.0, h: rows[k] + 0.05, fontSize: CFS, color: fg });
          yy += rows[k] + 0.2;
        }
      }
    },
    async statement(d) {
      const s = await page(d);
      const fs = L.fit(d.text, 8.0, 1.0, 38, 22, F.body, true);
      t.img(s, await blob(400, C.leaf, 77), W / 2 - 0.45, 1.4, 0.9, 0.9);
      t.img(s, await L.icon('FiSun', C.white, 2), W / 2 - 0.2, 1.65, 0.4, 0.4);
      t.text(s, L.runs(d.text), { x: 1.0, y: 2.45, w: 8.0, h: 1.0, fontSize: fs, bold: true, color: C.forest, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.7, y: 3.6, w: 6.6, h: 1.2, fontSize: 16, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      t.img(s, await waveImg(), 0.6, 1.25, 8.8, 1.2);
      d.items.forEach((it, i) => {
        const cx = 0.6 + cw * i + cw / 2, cy = waveY(cx), up = cy > 1.85;
        t.oval(s, cx - 0.14, cy - 0.14, 0.28, 0.28, C.forest, { line: { color: C.bg, width: 2.5 } });
        t.text(s, it.year, { x: cx - cw / 2 + 0.1, y: up ? cy - 0.75 : cy + 0.2, w: cw - 0.2, h: 0.5, fontFace: F.head, bold: true, color: C.leaf, align: 'center', fontSize: L.fit(it.year, cw - 0.3, 0.5, 24, 14, F.head, true), valign: up ? 'bottom' : 'top' });
        t.text(s, it.h, { x: cx - cw / 2 + 0.15, y: 3.0, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 17, bold: true, color: C.forest, align: 'center' });
        t.text(s, it.t, { x: cx - cw / 2 + 0.15, y: 3.45, w: cw - 0.3, h: 1.55, fontSize: 14, color: C.muted, align: 'center' });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.forest };
      t.img(s, await blob(400, C.leaf, 91, 0.35), -1.0, -1.2, 4.2, 4.2);
      t.img(s, await blob(400, C.moss, 93, 0.18), 7.4, 3.0, 3.6, 3.6);
      const fs = L.fit(d.text, 7.4, 2.3, 34, 20, F.head, false, 1, true);
      t.text(s, d.text, { x: 1.3, y: 1.0, w: 7.4, h: 2.75, fontFace: F.head, italic: true, fontSize: fs, color: C.white, align: 'center', valign: 'bottom' });
      t.rect(s, W / 2 - 0.35, 4.05, 0.7, 0.06, C.moss, { r: 0.03, name: 'Rule' });
      if (d.author) t.text(s, d.author, { x: 1.3, y: 4.3, w: 7.4, h: 0.4, fontSize: 15, color: C.moss, align: 'center' });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = await page(d);
      await PH(s, d.image, 0.6, 1.35, 3.6, 3.6, { mask: { path: blobPath(0.5, 0.5, 0.47, 41) } });
      t.text(s, d.text, { x: 4.5, y: 1.4, w: 4.9, h: 3.5, fontSize: L.fit(d.text, 4.9, 3.5, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
    },
    async image(d) {
      const s = await page(d);
      card(s, 0.6, 1.4, 4.5, 3.5, C.white);
      t.text(s, d.text, { x: 0.9, y: 1.6, w: 3.9, h: 3.1, fontSize: L.fit(d.text, 3.9, 3.1, 15, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      await PH(s, d.image, 5.55, 1.3, 3.75, 3.75, { mask: { path: blobPath(0.5, 0.5, 0.47, 77) } });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      for (const [i, it] of d.items.entries()) {
        const y = 1.4 + i * rh;
        t.img(s, await blob(400, i % 2 ? C.leaf : C.forest, 3 + i), 0.6, y + (rh - 0.42) / 2, 0.42, 0.42);
        t.text(s, String(i + 1), { x: 0.6, y: y + (rh - 0.42) / 2, w: 0.42, h: 0.42, fontFace: F.head, fontSize: 12, bold: true, color: C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 7.0, h: rh, fontSize: L.fit(it, 7.0, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      }
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 5.75, 0.95, 3.7, 3.7, { mask: { path: blobPath(0.5, 0.5, 0.47, 23) } }); },
    closing: async (s, d) => { await PH(s, d.image, 5.75, 0.95, 3.7, 3.7, { mask: { path: blobPath(0.5, 0.5, 0.47, 23) } }); },
  });
  // ---- further ways to draw a type, among leaves and water: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.forest, align: o.align, valign: o.valign || 'middle' });
  const para = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 15, 10, F.body, false, 1.2), color: o.color || C.ink, lineSpacingMultiple: 1.2, valign: o.valign || 'top' });
  const leaf = async (s, x, y, d, ic, i = 0) => { t.img(s, await blob(400, i % 2 ? C.leaf : C.forest, 3 + i, 1), x, y, d, d); t.img(s, await L.icon(ic, C.white, 2), x + d * 0.29, y + d * 0.29, d * 0.42, d * 0.42); };
  const forest = (d) => { d._forest = true; const s = pres.addSlide(); s.background = { color: C.forest }; t.text(s, d.title, { x: 0.6, y: 0.4, w: 8.8, h: 0.8, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.8, 28, 20, F.head, true) }); s.slideNumber = { x: 0.6, y: 5.12, w: 0.5, h: 0.25, fontFace: F.body, fontSize: 10, color: C.moss }; return s; };
  const V = {
    image: [
      async (d) => { // a picture whose lower edge is the water line
        const s = await page(d);
        t.img(s, await L.photo(L.src(d.image), 8.8, 2.1, { mask: { path: 'M0,0 L1,0 L1,0.82 C0.8,1 0.6,0.68 0.38,0.88 S0.1,0.92 0,0.78 Z' } }), 0.6, 1.25, 8.8, 2.1, { alt: '' });
        para(s, d.text, 0.6, 3.4, 8.8, 1.65, { max: 14 });
      },
      async (d) => { // the picture cut as a leaf, on the dark forest
        const s = forest(d);
        t.img(s, await L.photo(L.src(d.image), 4.2, 3.75, { mask: { path: 'M0.5,0 C0.95,0.1 1,0.65 0.82,0.86 C0.68,1 0.32,1 0.18,0.86 C0,0.65 0.05,0.1 0.5,0 Z' } }), 5.3, 1.25, 4.2, 3.75, { alt: '' });
        para(s, d.text, 0.6, 1.35, 4.4, 3.6, { color: C.white, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, a white pebble of text on it
        const s = pres.addSlide(); d._forest = true;
        await PH(s, d.image, 0, 0, W, H);
        t.rect(s, 0, 5.1, W, 0.525, C.forest, { name: 'Footer band' });
        t.rect(s, 0.45, 0.3, 5.3, 4.6, C.white, { r: 0.35, t: 4, name: 'Pebble' });
        head(s, d.title, 0.75, 0.42, 4.7, 0.95, { max: 24 });
        para(s, d.text, 0.75, 1.42, 4.7, 3.35, { max: 14 });
      },
      async (d) => { // a tall rounded picture behind a green leaf cluster
        const s = await page(d);
        t.img(s, await blob(400, C.moss, 9, 0.7), 5.3, 1.05, 4.3, 4.3);
        t.img(s, await L.photo(L.src(d.image), 3.0, 3.5, { mask: { r: 0.25 } }), 5.95, 1.45, 3.0, 3.5, { alt: '' });
        para(s, d.text, 0.6, 1.4, 4.9, 3.55, { valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a stem down the left, leaves growing from it
        const s = await page(d), n = d.items.length, h = 3.65 / n;
        t.line(s, 0.98, 1.35, 0, 3.6, C.leaf, 2.5);
        for (const [i, it] of d.items.entries()) {
          const y = 1.33 + i * h;
          await leaf(s, 0.62, y + (h - 0.72) / 2, 0.72, it.icon, i);
          head(s, it.h, 1.55, y, 2.5, h - 0.05);
          body(s, it.t, 4.15, y + 0.05, 5.25, h - 0.12, { valign: 'middle', color: C.ink, max: 13 });
        }
      },
      async (d) => { // on the forest: pale rounded cards at two heights
        const s = forest(d), n = d.items.length, gap = 0.18, w = (8.8 - gap * (n - 1)) / n, h = 2.95;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + gap), y = i % 2 ? 2.05 : 1.3;
          card(s, x, y, w, h, i % 2 ? C.sand : C.white);
          t.img(s, await L.icon(it.icon, C.leaf, 2), x + 0.2, y + 0.2, 0.4, 0.4);
          head(s, it.h, x + 0.2, y + 0.65, w - 0.4, 0.5, { max: 14 });
          body(s, it.t, x + 0.2, y + 1.18, w - 0.4, h - 1.28, { max: 12.5, color: C.ink });
        }
      },
      async (d) => { // a pond: leaves float round one large blob
        const s = await page(d), n = d.items.length, spots = n === 4 ? [[0.6, 1.35], [6.1, 1.35], [0.6, 3.25], [6.1, 3.25]] : [[0.6, 1.35], [6.1, 2.3], [0.6, 3.25]];
        t.img(s, await blob(400, C.moss, 7, 0.8), 3.75, 1.8, 2.5, 2.5);
        t.img(s, await blob(400, C.forest, 4, 1), 4.4, 2.45, 1.2, 1.2);
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > 5, a = right ? 'left' : 'right';
          t.img(s, await L.icon(it.icon, C.leaf, 2), right ? x : x + 2.9, y + 0.05, 0.36, 0.36);
          head(s, it.h, right ? x + 0.45 : x, y, 2.85, 0.46, { align: a });
          body(s, it.t, x, y + 0.5, 3.3, 1.25, { align: a, max: 13 });
        }
      },
      async (d) => { // sand-coloured strip with columns, no cards
        const s = await page(d), n = d.items.length, cw = 8.8 / n;
        t.rect(s, 0, 1.3, W, 3.65, C.sand, { name: 'Sand' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw;
          await leaf(s, x + 0.05, 1.45, 0.72, it.icon, i + 1);
          head(s, it.h, x + 0.05, 2.25, cw - 0.25, 0.55);
          body(s, it.t, x + 0.05, 2.82, cw - 0.25, 2.1, { color: C.ink });
        }
      },
    ],
    process: [
      async (d) => { // a plant growing: each stage taller
        const s = await page(d), n = d.steps.length, gap = 0.1, w = (8.8 - gap * (n - 1)) / n, col = [C.moss, C.leaf, C.forest, C.forest];
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * (w + gap), y = 2.15 - i * (n === 4 ? 0.26 : 0.38), dark = i > 0, ink = dark ? C.white : C.ink;
          t.rect(s, x, y, w, 5.02 - y, col[i], { r: 0.22, name: 'Stage' });
          t.text(s, String(i + 1), { x: x + 0.15, y: y + 0.08, w: 0.6, h: 0.5, fontFace: F.head, bold: true, fontSize: 24, color: ink });
          head(s, st.h, x + 0.15, y + 0.56, w - 0.3, 0.5, { color: ink, max: 14 });
          body(s, st.t, x + 0.15, y + 1.08, w - 0.3, 5.02 - y - 1.15, { color: ink, max: 12.5 });
        });
      },
      async (d) => { // a stream winding down the page
        const s = await page(d), n = d.steps.length, h = 3.65 / n;
        d.steps.forEach((st, i) => {
          const y = 1.33 + i * h, right = i % 2 === 1, x = right ? 1.6 : 0.6;
          t.oval(s, x, y + 0.04, 0.58, 0.58, i % 2 ? C.leaf : C.forest);
          t.text(s, String(i + 1), { x, y: y + 0.04, w: 0.58, h: 0.58, fontFace: F.head, bold: true, fontSize: 16, color: C.white, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.75, y + 0.02, 7.0 - (right ? 1 : 0) + 1, 0.36, { max: 15 });
          body(s, st.t, x + 0.75, y + 0.38, 8.05 - (right ? 1 : 0), h - 0.44, { max: 13, color: C.ink });
        });
      },
      async (d) => { // on the forest, a loop of pale tiles
        const s = forest(d), n = d.steps.length, w = 4.3, h = 1.72;
        d.steps.forEach((st, i) => {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = wide ? 0.6 : 0.6 + (i < 2 ? i : 3 - i) * (w + 0.2), y = 1.32 + (i < 2 ? 0 : h + 0.14);
          card(s, x, y, ww, h, i === n - 1 ? C.moss : C.bg);
          head(s, `${i + 1}. ${st.h}`, x + 0.22, y + 0.1, ww - 0.44, 0.48, { max: 15 });
          body(s, st.t, x + 0.22, y + 0.6, ww - 0.44, h - 0.7, { color: C.ink, max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // one number on a great leaf, others beside it
        const s = await page(d), [a, ...rest] = d.stats;
        t.img(s, await blob(400, C.forest, 11, 1), 0.4, 1.15, 4.3, 3.9);
        t.text(s, a.value, { x: 0.9, y: 1.75, w: 3.3, h: 1.2, fontFace: F.head, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.2, 1.1, 50, 22, F.head, true) });
        body(s, a.label, 1.15, 3.0, 2.8, 1.2, { color: C.moss, align: 'center', max: 13 });
        rest.forEach((v, i) => { const y = 1.4 + i * 1.1; head(s, v.value, 4.95, y, 4.45, 0.56, { max: 30, color: C.leaf }); body(s, v.label, 4.95, y + 0.56, 4.45, 0.46, { color: C.ink, max: 12 }); });
        if (d.note) body(s, d.note, 4.95, 3.65, 4.45, 1.3, { max: 11 });
      },
      async (d) => { // rings of a tree trunk: figures read across on long sand rows
        const s = await page(d), rh = d.note ? 0.92 : 1.15;
        d.stats.forEach((v, i) => {
          const y = 1.35 + i * rh;
          t.rect(s, 0.6, y, 8.8, rh - 0.1, C.sand, { r: 0.3, name: 'Row' });
          head(s, v.value, 0.85, y, 2.9, rh - 0.1, { max: 34, color: C.forest });
          body(s, v.label, 3.9, y, 5.3, rh - 0.1, { valign: 'middle', color: C.ink, max: 15 });
        });
        if (d.note) body(s, d.note, 0.6, 4.15, 7.6, 0.9, { max: 11 });
      },
    ],
    compare: [
      async (d) => { // a green field and a sand field, side by side and meeting
        const s = await page(d), w = 4.4;
        [d.left, d.right].forEach((side, i) => {
          const x = 0.6 + i * w, n = side.items.length, rh = 2.75 / n, dark = i === 1, ink = dark ? C.white : C.ink;
          t.rect(s, x, 1.3, w, 3.7, dark ? C.forest : C.sand, { name: 'Field' });
          head(s, side.h, x + 0.25, 1.38, w - 0.5, 0.55, { color: dark ? C.moss : C.forest, max: 18 });
          side.items.forEach((it, k) => body(s, it, x + 0.25, 2.02 + k * rh, w - 0.5, rh - 0.05, { color: ink }));
        });
      },
      async (d) => { // two bands, rounded, one under the other
        const s = await page(d), h = 1.74;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.32 + i * (h + 0.14), dark = i === 1, ink = dark ? C.white : C.ink;
          card(s, 0.6, y, 8.8, h, dark ? C.leaf : C.white);
          head(s, side.h, 0.85, y + 0.1, 2.05, h - 0.2, { color: dark ? C.white : C.forest, max: 17 });
          side.items.forEach((it, k) => body(s, it, 3.05 + (k % 2) * 3.15, y + 0.1 + Math.floor(k / 2) * 0.78, 3.0, 0.74, { color: ink, max: 13 }));
        });
      },
    ],
    statement: [
      async (d) => { // the forest page: words large and left, the note beside them
        const s = forest(d);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.35, w: 5.6, h: 3.6, fontFace: F.head, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 5.6, 3.5, 34, 16, F.head, true) });
        t.rect(s, 6.5, 1.55, 0.07, 3.2, C.leaf, { r: 0.03, name: 'Stem' });
        if (d.caption) body(s, d.caption, 6.75, 1.55, 2.65, 3.2, { color: C.moss, valign: 'middle', max: 14 });
      },
      async (d) => { // a leaf holds the note, the thought runs across the top
        const s = await page(d);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.25, w: 8.8, h: 1.95, fontFace: F.head, bold: true, color: C.forest, valign: 'middle', fontSize: L.fit(d.text, 8.8, 1.9, 34, 16, F.head, true) });
        t.img(s, await blob(400, C.leaf, 6, 1), 0.5, 3.2, 1.8, 1.8);
        if (d.caption) body(s, d.caption, 2.5, 3.3, 5.9, 1.65, { valign: 'middle', color: C.ink, max: 14 });
      },
    ],
    timeline: [
      async (d) => { // a trunk down the middle, years as leaves to either side
        const s = await page(d), cx = 5;
        t.line(s, cx, 1.35, 0, 3.62, C.forest, 3);
        for (const [i, it] of d.items.entries()) {
          const right = i % 2 === 1, y = 1.32 + Math.floor(i / 2) * 1.85 + (right ? 0.4 : 0), x = right ? cx + 0.42 : 0.6, w = 3.98, a = right ? 'left' : 'right';
          t.img(s, await blob(400, right ? C.leaf : C.forest, 3 + i, 1), cx - 0.2, y + 0.04, 0.4, 0.4);
          t.text(s, [{ text: it.year + '  ', options: { color: C.leaf, bold: true } }, { text: it.h, options: { color: C.forest, bold: true } }], { x, y, w, h: 0.44, fontFace: F.head, fontSize: L.fit(`${it.year}  ${it.h}`, w, 0.42, 16, 10, F.head, true), align: a, valign: 'middle' });
          body(s, it.t, x, y + 0.46, w, 1.2, { align: a, color: C.ink, max: 13 });
        }
      },
      async (d) => { // four rounded plots, the year growing in each
        const s = await page(d), w = 4.3, h = 1.72;
        d.items.forEach((it, i) => {
          const x = 0.6 + (i % 2) * (w + 0.2), y = 1.32 + Math.floor(i / 2) * (h + 0.14), dark = i === 0 || i === 3, ink = dark ? C.white : C.ink;
          card(s, x, y, w, h, dark ? C.forest : C.sand);
          t.text(s, it.year, { x: x + 0.1, y, w: 1.35, h, fontFace: F.head, bold: true, color: dark ? C.moss : C.forest, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.25, h - 0.3, 24, 10, F.head, true) });
          head(s, it.h, x + 1.5, y + 0.08, w - 1.65, 0.42, { max: 14, color: dark ? C.white : C.forest });
          body(s, it.t, x + 1.5, y + 0.52, w - 1.65, h - 0.6, { color: ink, max: 12 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (type === 'quote' || d._forest ? { x: 0.6, y: 5.15, w: 8.8, h: 0.25, color: 'D7E4D3', align: 'center' } : type === 'cover' || type === 'closing' ? { x: 0.6, y: 5.15, w: 5.0, h: 0.25, color: C.muted } : { x: 1.2, y: 5.12, w: 6.8, h: 0.25, color: C.muted }));
  return L.save(pres, out, { name: 'SlideAI Eco', colors: { dk1: C.ink, lt1: C.white, dk2: C.forest, lt2: C.bg, accent1: C.leaf, accent2: C.forest, accent3: C.moss, accent4: C.sand, accent5: C.muted, accent6: 'D7E4D3', hlink: C.leaf, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "sokin, tushunarli, ta'limiy ohang", "limits": {}};
module.exports = { id: 7, slug: 'eco', name: 'Tabiat', category: 'academic', build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "playful"], "transitions": ["fade", "p14:pan|dir=\"u\"", "dissolve"], "cover": ["riseWords", "fadeWords"], "mark": "swing", "deco": "curveUp", "sig": {"title": "riseWords", "body": "fadeUp", "item": "curveUp", "image": "dissolve", "number": "springIn", "order": "seq", "stagger": 0.22}, "tempo": 1.2, "kenburns": true};
