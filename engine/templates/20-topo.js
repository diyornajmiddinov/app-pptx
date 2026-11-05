/**
 * 20 Topo — cartography: topographic contour lines, map pins, dashed routes,
 * coordinates and a compass, earthy olive and terracotta, Century Schoolbook.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'EEF0E8', ink: '263229', olive: '5E6E2E', terra: 'B85A35', contour: 'B6C0A8', sand: 'DDD7C4', muted: '56615A', cream: 'F7F5EE' };
const F = { head: 'Century Schoolbook', body: 'Arial' };

function contour(w, h, centers, color, op = 1, bg = null) {
  let seed = 7; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const path = (cx, cy, r) => { const n = 9, pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * 2 * Math.PI, rr = r * (0.82 + rnd() * 0.3); return [cx + Math.cos(a) * rr * 1.25, cy + Math.sin(a) * rr]; });
    let d = `M${pts[0]}`; for (let i = 0; i < n; i++) { const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]; d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`; } return d + 'Z'; };
  const g = centers.flatMap(([cx, cy, R, k]) => Array.from({ length: k }, (_, i) => `<path d="${path(cx + i * 4, cy - i * 3, R * (1 - i / (k + 0.6)))}"/>`));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${bg ? `<rect width="${w}" height="${h}" fill="#${bg}"/>` : ''}<g fill="none" stroke="#${color}" stroke-width="2" stroke-opacity="${op}">${g.join('')}</g></svg>`;
}
const smooth = (pts) => pts.map((p, i) => { if (!i) return `M${p[0]},${p[1]}`; const q = pts[i - 1], dx = (p[0] - q[0]) / 2; return `C${q[0] + dx},${q[1]} ${p[0] - dx},${p[1]} ${p[0]},${p[1]}`; }).join(' ');
const route = (w, h, pts, color) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${smooth(pts)}" fill="none" stroke="#${color}" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const coverArt = await L.svg(contour(1600, 900, [[1150, 380, 380, 9], [300, 820, 260, 6]], C.contour, 1, C.bg), 1600, 900, true);
  const cornerArt = await L.svg(contour(800, 500, [[700, 80, 300, 7]], C.contour, 0.8), 800, 500);
  const darkArt = await L.svg(contour(1600, 900, [[1250, 300, 420, 9], [200, 750, 300, 7]], '7D8A5A', 0.6), 1600, 900);

  const coords = (s, x, y, color = C.muted) => t.text(s, '41\u00B018\u2032 N   69\u00B016\u2032 E', { x, y, w: 3, h: 0.25, fontSize: 9, color, charSpacing: 1.5 });
  const compass = (s, x, y, color = C.ink) => {
    t.shape(s, 'ISOSCELES_TRIANGLE', { x: x + 0.09, y: y + 0.25, w: 0.22, h: 0.42, fill: { color: C.terra }, objectName: 'Compass needle' });
    t.text(s, 'N', { x, y: y - 0.05, w: 0.4, h: 0.3, fontFace: F.head, fontSize: 12, bold: true, color, align: 'center' });
  };
  const pin = async (s, x, y, d, color = C.terra) => t.img(s, await L.icon('FiMapPin', color, 2.25), x, y, d, d);
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg };
    t.img(s, cornerArt, 6.2, 0, 3.8, 2.4);
    t.text(s, d.title, { x: 0.6, y: 0.4, w: 7.4, h: 0.8, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.4, 0.8, 26, 18, F.head, true) });
    compass(s, 9.0, 0.45);
    coords(s, 0.6, 5.15);
    s.slideNumber = { x: 8.9, y: 5.1, w: 0.5, h: 0.3, fontFace: F.head, fontSize: 11, color: C.olive, align: 'right' };
    return s;
  };
  const hero = (d) => {
    const s = pres.addSlide(); s.background = { data: coverArt };
    const fs = L.fit(d.title, 5.6, 2.4, 44, 26, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 0.8, w: 5.6, h: 2.6, fontFace: F.head, bold: true, fontSize: fs, color: C.ink, valign: 'bottom' });
    t.line(s, 0.6, 3.6, 1.2, 0, C.terra, 2.5, { dash: 'dash' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.85, w: 5.2, h: 1.1, fontSize: 15, color: C.muted });
    compass(s, 9.0, 0.5); coords(s, 0.6, 5.15);
  };

  const R = {
    cover: hero, closing: hero,
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.4 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.5 + (i % per) * rh;
        await pin(s, x, y + 0.02, 0.48, i % 2 ? C.olive : C.terra);
        t.text(s, `${String.fromCharCode(65 + i)}`, { x: x + 0.6, y, w: 0.4, h: 0.55, fontFace: F.head, fontSize: 18, bold: true, color: C.olive, valign: 'middle' });
        t.text(s, it, { x: x + 1.0, y, w: 3.3, h: 0.55, fontFace: F.head, fontSize: 17, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.5, 0.45, 18, 12, F.head, true)));
      const h = Math.min(3.4, 1.4 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), y = 1.55;
        t.rect(s, x, y, w, h, C.cream, { line: { color: C.olive, width: 0.75 }, name: 'Card' });
        t.img(s, await L.icon(it.icon, C.olive, 2), x + 0.25, y + 0.25, 0.42, 0.42);
        t.text(s, `${String.fromCharCode(65 + i)}${i + 1}`, { x: x + w - 0.85, y: y + 0.25, w: 0.6, h: 0.3, fontSize: 10, color: C.muted, align: 'right', charSpacing: 1 });
        t.text(s, it.h, { x: x + 0.25, y: y + 0.85, w: w - 0.5, h: 0.45, fontFace: F.head, fontSize: hfs, bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.25, y: y + 1.32, w: w - 0.5, h: h - 1.45, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.8 / n;
      const ys = d.steps.map((_, i) => (i % 2 ? 2.25 : 1.6));
      const pts = d.steps.map((_, i) => [Math.round((i * cw + 0.25) * 100), Math.round((ys[i] + 0.45 - 1.4) * 100)]);
      t.img(s, await L.svg(route(880, 140, pts, C.terra), 880, 140), 0.6, 1.4, 8.8, 1.4);
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        await pin(s, x, ys[i] - 0.05, 0.5, i === n - 1 ? C.terra : C.olive);
        t.text(s, st.h, { x, y: 2.95, w: cw - 0.3, h: 0.45, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.3, 0.45, 18, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 3.4, w: cw - 0.3, h: 1.55, fontSize: 14, color: C.muted });
      }
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.8 / n;
      d.stats.forEach((x, i) => {
        const px = 0.6 + i * cw;
        t.shape(s, 'ISOSCELES_TRIANGLE', { x: px, y: 1.6, w: 0.5, h: 0.4, fill: { color: i % 2 ? C.terra : C.olive }, objectName: 'Peak' });
        t.text(s, x.value, { x: px, y: 2.05, w: cw - 0.3, h: 1.0, fontFace: F.head, bold: true, color: C.ink, valign: 'bottom', fontSize: L.fit(x.value, cw - 0.4, 0.95, 48, 24, F.head, true) });
        t.line(s, px, 3.2, cw - 0.5, 0, C.contour, 1.5, { dash: 'dash' });
        t.text(s, x.label, { x: px, y: 3.35, w: cw - 0.4, h: 0.95, fontSize: 15, color: C.muted });
      });
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.45, w: 8.0, h: 0.55, fontFace: F.head, italic: true, fontSize: 13, color: C.muted });
    },
    async compare(d) {
      const s = page(d), w = 4.25, h = 3.45, y = 1.5;
      const nr = Math.max(d.left.items.length, d.right.items.length), { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.95, F.body, 0, h - 1.0 - 0.12 - 0.2 * (nr - 1));
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3), fg = i ? C.cream : C.ink;
        t.rect(s, x, y, w, h, i ? C.olive : C.sand, { name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: i ? C.cream : C.olive });
        let yy = y + 1.0;
        for (const [k, it] of side.items.entries()) {
          await pin(s, x + 0.3, yy - 0.01, 0.25, i ? C.cream : C.terra);
          t.text(s, it, { x: x + 0.65, y: yy, w: w - 0.95, h: rows[k] + 0.05, fontSize: CFS, color: fg });
          yy += rows[k] + 0.2;
        }
      }
    },
    async statement(d) {
      const s = page(d);
      t.img(s, cornerArt, 0.2, 1.4, 6.0, 3.75);
      const fs = L.fit(d.text, 7.6, 1.4, 34, 20, F.head, true);
      await pin(s, W / 2 - 0.3, 1.45, 0.6);
      t.text(s, L.runs(d.text), { x: 1.2, y: 2.15, w: 7.6, h: 1.4, fontFace: F.head, fontSize: fs, bold: true, color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.8, y: 3.7, w: 6.4, h: 1.1, fontSize: 15, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.8 / n;
      const pts = d.items.map((_, i) => [Math.round((i * cw + 0.2) * 100), i % 2 ? 90 : 30]);
      t.img(s, await L.svg(route(880, 120, pts, C.olive), 880, 120), 0.6, 1.9, 8.8, 1.2);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * cw, py = 1.9 + (i % 2 ? 0.9 : 0.3);
        t.oval(s, x + 0.08, py - 0.12, 0.24, 0.24, C.terra, { line: { color: C.bg, width: 2 } });
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.45, fontFace: F.head, bold: true, color: C.terra, fontSize: L.fit(it.year, cw - 0.3, 0.45, 22, 13, F.head, true) });
        t.text(s, it.h, { x, y: 3.25, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.7, w: cw - 0.3, h: 1.3, fontSize: 13, color: C.muted });
      }
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { color: C.olive };
      t.img(s, darkArt, 0, 0, W, H);
      const fs = L.fit(d.text, 7.4, 2.4, 32, 20, F.head, false, 1, true);
      t.text(s, d.text, { x: 0.8, y: 0.9, w: 7.4, h: 2.8, fontFace: F.head, italic: true, fontSize: fs, color: C.cream, valign: 'bottom' });
      t.line(s, 0.8, 3.95, 1.0, 0, C.cream, 2, { dash: 'dash' });
      if (d.author) t.text(s, d.author, { x: 0.8, y: 4.15, w: 7.0, h: 0.4, fontSize: 14, color: C.sand });
      coords(s, 0.8, 5.15, C.sand);
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      t.rect(s, 0.6, 1.45, 4.0, 3.4, C.white, { shadow: 0.12, blur: 8, offset: 2, name: 'Photo frame' });
      await PH(s, d.image, 0.7, 1.55, 3.8, 3.2);
      await pin(s, 4.2, 1.2, 0.5);
      t.text(s, d.text, { x: 4.95, y: 1.45, w: 4.45, h: 3.4, fontSize: L.fit(d.text, 4.45, 3.4, 15, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: 0.6, y: 1.45, w: 4.3, h: 3.4, fontSize: L.fit(d.text, 4.3, 3.4, 15, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
      t.rect(s, 5.2, 1.45, 4.2, 3.4, C.white, { shadow: 0.12, blur: 8, offset: 2, name: 'Photo frame' });
      await PH(s, d.image, 5.3, 1.55, 4.0, 3.2);
      await pin(s, 5.0, 1.2, 0.5, C.olive);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      for (const [i, it] of d.items.entries()) {
        const y = 1.45 + i * rh;
        await pin(s, 0.6, y + (rh - 0.36) / 2, 0.36, i % 2 ? C.olive : C.terra);
        t.text(s, it, { x: 1.1, y, w: 8.3, h: rh, fontSize: L.fit(it, 8.3, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      }
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { t.rect(s, 6.35, 1.15, 3.05, 3.0, C.white, { shadow: 0.15, blur: 10, offset: 3, name: 'Photo frame' }); await PH(s, d.image, 6.45, 1.25, 2.85, 2.8); },
    closing: async (s, d) => { t.rect(s, 6.35, 1.15, 3.05, 3.0, C.white, { shadow: 0.15, blur: 10, offset: 3, name: 'Photo frame' }); await PH(s, d.image, 6.45, 1.25, 2.85, 2.8); },
  });
  // ---- further ways to draw a type, in this template's cartographer's world (map legend, grid squares, signposts, compass rose, ridges, strata, the olive sheet): a deck's pages must not look alike (L.pages)
  const X0 = 0.6, CW = 8.8, Y0 = 1.45, Y1 = 4.98, SOFT = 'E7E3D3';
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(txt, w, h, o.max || 16, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const sheet = (d) => { // the same map printed on olive
    d._night = true;
    const s = pres.addSlide(); s.background = { color: C.olive };
    t.img(s, darkArt, 0, 0, W, H);
    if (d.title) t.text(s, d.title, { x: 0.6, y: 0.4, w: 7.4, h: 0.8, fontFace: F.head, bold: true, color: C.cream, valign: 'middle', fontSize: L.fit(d.title, 7.4, 0.8, 26, 18, F.head, true) });
    compass(s, 9.0, 0.45, C.cream);
    coords(s, 0.6, 5.15, C.sand);
    s.slideNumber = { x: 8.9, y: 5.1, w: 0.5, h: 0.3, fontFace: F.head, fontSize: 11, color: C.cream, align: 'right' };
    return s;
  };
  const rose = (s, cx, cy, dd, c1 = C.terra, c2 = C.olive) => {
    t.shape(s, 'STAR_4_POINT', { x: cx - dd / 2, y: cy - dd / 2, w: dd, h: dd, fill: { color: c1 }, objectName: 'Compass rose' });
    t.shape(s, 'STAR_4_POINT', { x: cx - dd * 0.36, y: cy - dd * 0.36, w: dd * 0.72, h: dd * 0.72, fill: { color: c2 }, rotate: 45, objectName: 'Compass rose' });
    t.oval(s, cx - dd * 0.07, cy - dd * 0.07, dd * 0.14, dd * 0.14, C.cream);
  };
  const spot = (s, cx, cy, n, c = C.terra, dd = 0.42) => { t.oval(s, cx - dd / 2, cy - dd / 2, dd, dd, c, { line: { color: C.cream, width: 1.5 }, name: 'Waypoint' }); t.text(s, String(n), { x: cx - dd / 2, y: cy - dd / 2, w: dd, h: dd, fontFace: F.head, bold: true, fontSize: Math.round(dd * 30), color: C.cream, align: 'center', valign: 'middle' }); };
  const V = {
    image: [
      async (d) => { // a magnifying glass laid on the map, the picture in its lens
        const s = page(d), dd = 3.0, cx = 7.3, cy = 2.95;
        t.line(s, cx + dd * 0.33, cy + dd * 0.33, 0.68, 0.68, C.ink, 7, { name: 'Handle' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle' }), cx - dd / 2, cy - dd / 2, dd, dd, { alt: '' });
        t.oval(s, cx - dd / 2 - 0.07, cy - dd / 2 - 0.07, dd + 0.14, dd + 0.14, null, { line: { color: C.ink, width: 5 }, name: 'Lens' });
        await pin(s, cx - dd / 2 - 0.05, cy - dd / 2 - 0.2, 0.5);
        t.text(s, d.text, { x: X0, y: Y0, w: 4.85, h: Y1 - Y0, fontSize: L.fit(d.text, 4.85, Y1 - Y0, 14, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the picture cut along a mountain ridge, the words on the sky above
        const s = page(d), ph = 2.35, py = 5.08 - ph;
        const ridge = [[0, 1], [0, 0.72], [0.14, 0.42], [0.25, 0.6], [0.42, 0.14], [0.54, 0.46], [0.66, 0.26], [0.82, 0.58], [1, 0.34], [1, 1]];
        t.text(s, d.text, { x: X0, y: Y0 - 0.1, w: CW, h: 1.62, fontSize: L.fit(d.text, CW, 1.6, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1 });
        t.img(s, await L.photo(L.src(d.image), W, ph, { mask: { poly: ridge } }), 0, py, W, ph, { alt: '' });
      },
      async (d) => { // the picture fills the sheet, title and text in a cartouche on it
        const s = page(d);
        await PH(s, d.image, 0, 0, W, H);
        t.rect(s, 4.85, 0.4, 4.75, 4.62, C.cream, { line: { color: C.ink, width: 1.5 }, name: 'Cartouche' });
        t.rect(s, 4.93, 0.48, 4.59, 4.46, null, { line: { color: C.olive, width: 0.5 }, name: 'Inner border' });
        t.text(s, d.title, { x: 5.1, y: 0.55, w: 3.75, h: 0.98, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 3.75, 0.96, 22, 15, F.head, true) });
        compass(s, 8.95, 0.68);
        t.line(s, 5.1, 1.56, 4.25, 0, C.terra, 2, { dash: 'dash' });
        t.text(s, d.text, { x: 5.1, y: 1.66, w: 4.25, h: 3.2, fontSize: L.fit(d.text, 4.25, 3.2, 13, 10, F.body, false, 1.12), color: C.ink, lineSpacingMultiple: 1.12 });
        t.rect(s, 0, 5.1, W, H - 5.1, C.bg, { name: 'Footer band' });
        coords(s, 0.6, 5.15);
      },
      async (d) => { // the olive sheet: the picture as a folded map, its creases showing
        const s = sheet(d), w = 5.1, x = X0, y = Y0 - 0.05, h = 3.45, k = 3;
        await PH(s, d.image, x, y, w, h);
        for (let i = 0; i < k; i++) if (i % 2) t.rect(s, x + (i * w) / k, y, w / k, h, C.ink, { t: 82, name: 'Fold shade' });
        for (let i = 1; i < k; i++) t.line(s, x + (i * w) / k, y, 0, h, C.cream, 0.75, { name: 'Crease' });
        t.line(s, x, y + h / 2, w, 0, C.cream, 0.75, { name: 'Crease' });
        await pin(s, x + w - 0.75, y + 0.25, 0.55, C.terra);
        t.text(s, d.text, { x: x + w + 0.3, y: Y0, w: CW - w - 0.3, h: Y1 - Y0, fontSize: L.fit(d.text, CW - w - 0.3, Y1 - Y0, 14, 10, F.body, false, 1.15), color: C.cream, lineSpacingMultiple: 1.15, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // the map's legend: a symbol, its name, its meaning, dashed rules between
        const s = page(d), n = d.items.length, h = (Y1 - Y0) / n;
        t.rect(s, X0, Y0 - 0.02, CW, Y1 - Y0 + 0.04, C.cream, { line: { color: C.ink, width: 1 }, name: 'Legend' });
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + i * h;
          t.rect(s, X0 + 0.16, y + h / 2 - 0.24, 0.48, 0.48, i % 2 ? C.sand : C.olive, { name: 'Symbol' });
          t.img(s, await L.icon(it.icon, i % 2 ? C.ink : C.cream, 2), X0 + 0.26, y + h / 2 - 0.14, 0.28, 0.28);
          head(s, it.h, X0 + 0.8, y + 0.05, 2.5, h - 0.1, { max: 16 });
          body(s, it.t, X0 + 3.45, y + 0.05, CW - 3.6, h - 0.1, { valign: 'middle', color: C.ink, max: 13 });
          if (i < n - 1) t.line(s, X0 + 0.16, y + h, CW - 0.32, 0, C.contour, 1, { dash: 'dash' });
        }
      },
      async (d) => { // map squares with grid references, one grid across them all
        const s = page(d), n = d.items.length, w = CW / 2, h = (Y1 - Y0) / 2, fills = [C.cream, C.sand, C.sand, C.cream];
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, x = X0 + (i % 2) * w, y = Y0 + Math.floor(i / 2) * h, ww = wide ? CW : w;
          t.rect(s, x, y, ww, h, wide ? C.cream : fills[i], { line: { color: C.ink, width: 0.75 }, name: 'Map square' });
          t.text(s, `${String.fromCharCode(65 + (i % 2))}${Math.floor(i / 2) + 1}`, { x: x + ww - 0.62, y: y + 0.08, w: 0.5, h: 0.26, fontFace: F.head, bold: true, fontSize: 11, color: C.terra, align: 'right', valign: 'middle' });
          t.img(s, await L.icon(it.icon, C.olive, 2), x + 0.18, y + 0.14, 0.32, 0.32);
          head(s, it.h, x + 0.6, y + 0.1, ww - 1.25, 0.4, { max: 16 });
          body(s, it.t, x + 0.18, y + 0.56, ww - 0.36, h - 0.64, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // the olive sheet: a signpost, arrow boards pointing out to either side
        const s = sheet(d), n = d.items.length, cx = W / 2, w = 4.15, h = n === 4 ? 1.22 : 1.3, step = (Y1 - Y0 - h) / (n - 1);
        t.rect(s, cx - 0.06, Y0 - 0.15, 0.12, Y1 - Y0 + 0.2, C.sand, { name: 'Post' });
        for (const [i, it] of d.items.entries()) {
          const right = i % 2 === 0, y = Y0 + i * step, x = right ? cx + 0.06 : cx - 0.06 - w;
          t.shape(s, 'PENTAGON', { x, y, w, h, fill: { color: C.cream }, line: { color: C.ink, width: 1 }, objectName: 'Sign', ...(right ? {} : { flipH: true }) });
          const tx = right ? x + 0.18 : x + 0.72;
          t.img(s, await L.icon(it.icon, C.terra, 2), tx, y + 0.1, 0.28, 0.28);
          head(s, it.h, tx + 0.38, y + 0.08, w - 1.3, 0.32, { max: 15 });
          body(s, it.t, tx, y + 0.44, w - 0.92, h - 0.5, { color: C.ink, max: 12 });
        }
      },
      async (d) => { // a compass rose in the middle, the items at its quarters
        const s = page(d), n = d.items.length, cx = W / 2, cy = (Y0 + Y1) / 2, dd = 2.3, w = 2.98, hh = (Y1 - Y0 - 0.12) / 2;
        t.oval(s, cx - dd / 2 - 0.1, cy - dd / 2 - 0.1, dd + 0.2, dd + 0.2, null, { line: { color: C.contour, width: 1.25, dashType: 'dash' }, name: 'Ring' });
        rose(s, cx, cy, dd);
        const spots = n === 4 ? [[X0, Y0], [W - X0 - w, Y0], [X0, Y0 + hh + 0.12], [W - X0 - w, Y0 + hh + 0.12]] : [[X0, Y0], [W - X0 - w, cy - hh / 2], [X0, Y0 + hh + 0.12]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right';
          t.img(s, await L.icon(it.icon, C.terra, 2), right ? x : x + w - 0.3, y + 0.04, 0.3, 0.3);
          head(s, it.h, right ? x + 0.4 : x, y + 0.02, w - 0.4, 0.36, { align: a, max: 15 });
          body(s, it.t, x, y + 0.42, w, hh - 0.44, { align: a, color: C.ink, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a climb: a mountain in the middle, camps by turns on each slope, the summit last
        const s = page(d), n = d.steps.length, cx = W / 2, base = Y1 + 0.02, tw = 3.0, top = Y0 - 0.05, w = 2.8, rh = (Y1 - Y0) / n;
        t.shape(s, 'ISOSCELES_TRIANGLE', { x: cx - tw / 2, y: top, w: tw, h: base - top, fill: { color: C.sand }, objectName: 'Mountain' });
        t.shape(s, 'ISOSCELES_TRIANGLE', { x: cx - tw * 0.2, y: top, w: tw * 0.4, h: (base - top) * 0.4, fill: { color: C.olive }, objectName: 'Summit' });
        d.steps.forEach((st, i) => {
          const y = base - (i + 1) * rh, cyy = y + rh * 0.5, right = i % 2 === 1, slope = (cyy - top) / (base - top), half = (tw / 2) * slope, px = cx + (right ? half : -half), x = right ? W - X0 - w : X0, a = right ? 'left' : 'right';
          t.line(s, right ? px : x + w + 0.05, cyy, right ? x - 0.05 - px : px - x - w - 0.05, 0, C.terra, 1.25, { dash: 'dash', name: 'Route' });
          spot(s, px, cyy, i + 1, i === n - 1 ? C.terra : C.olive);
          const cnt = right ? Math.floor(n / 2) : Math.ceil(n / 2), bh = (Y1 - Y0) / cnt, by = base - (Math.floor(i / 2) + 1) * bh; // each slope shares its side's height
          head(s, st.h, x, by + 0.04, w, 0.32, { align: a, max: 15 });
          body(s, st.t, x, by + 0.38, w, bh - 0.42, { align: a, max: 13, color: C.ink });
        });
      },
      async (d) => { // terraces cut into the hillside: each step stands on a higher contour
        const s = page(d), n = d.steps.length, w = CW / n, rise = n === 4 ? 0.3 : 0.44, top = Y0 + rise * (n - 1), fills = [C.sand, 'CFD3B8', 'A9B487', C.olive];
        d.steps.forEach((st, i) => {
          const x = X0 + i * w, y = top - i * rise, h = Y1 + 0.02 - y, fill = fills[n === 3 ? i + 1 : i], dark = fill === C.olive, ink = dark ? C.cream : C.ink;
          t.rect(s, x, y, w, h, fill, { name: 'Terrace' });
          t.line(s, x, y, w, 0, C.ink, 1, { name: 'Contour' });
          spot(s, x + 0.34, y + 0.34, i + 1, C.terra, 0.44);
          head(s, st.h, x + 0.12, y + 0.62, w - 0.24, 0.52, { color: ink, max: 14, valign: 'top' });
          body(s, st.t, x + 0.12, y + 1.16, w - 0.24, h - 1.22, { color: ink, max: 13 });
        });
      },
      async (d) => { // the olive sheet: one dashed route zigzags across, a board high then low along it, the stop's pin in the open ground
        const s = sheet(d), n = d.steps.length, gap = 0.16, w = (CW - gap * (n - 1)) / n, h = 2.0, yLow = Y1 - h, open = yLow - Y0;
        const at = (i) => [X0 + i * (w + gap), i % 2 ? yLow : Y0];
        t.img(s, await L.svg(route(1000, 563, d.steps.map((_, i) => { const [x, y] = at(i); return [Math.round((x + w / 2) * 100), Math.round((y + h / 2) * 100)]; }), C.cream), 2000, 1126), 0, 0, W, H, { alt: '' });
        for (const [i, st] of d.steps.entries()) {
          const [x, y] = at(i), last = i === n - 1, oy = i % 2 ? Y0 : Y0 + h + 0.04, oh = Math.max(open - 0.04, 0.4);
          await pin(s, x + 0.06, oy + (oh - 0.5) / 2, 0.5, last ? C.sand : C.cream);
          t.text(s, L.pad2(i + 1), { x: x + 0.6, y: oy, w: w - 0.65, h: oh, fontFace: F.head, bold: true, fontSize: 30, color: C.cream, valign: 'middle' });
          t.rect(s, x, y, w, h, C.cream, { line: { color: C.ink, width: 0.75 }, name: 'Board' });
          t.rect(s, x, y, w, 0.08, last ? C.terra : C.sand, { name: 'Board edge' });
          head(s, st.h, x + 0.14, y + 0.14, w - 0.28, 0.5, { max: 15, valign: 'top' });
          body(s, st.t, x + 0.14, y + 0.66, w - 0.28, h - 0.72, { color: C.ink, max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // a range of peaks: the highest bears the leading figure
        const s = page(d), base = d.note ? 3.6 : 4.05, [a, b, c] = d.stats, bigW = 4.1, smW = 2.3;
        const peak = (x, w, h, fill, v, vc, lblW) => {
          t.shape(s, 'ISOSCELES_TRIANGLE', { x, y: base - h, w, h, fill: { color: fill }, objectName: 'Peak' });
          t.text(s, v.value, { x: x + w * 0.2, y: base - h * 0.52, w: w * 0.6, h: h * 0.5, fontFace: F.head, bold: true, color: vc, align: 'center', valign: 'middle', fontSize: L.fit(v.value, w * 0.56, h * 0.44, 46, 13, F.head, true) });
          body(s, v.label, x + (w - lblW) / 2, base + 0.08, lblW, d.note ? 0.58 : 0.82, { color: C.ink, align: 'center', max: 13 });
        };
        peak(X0, bigW, base - Y0 + 0.05, C.olive, a, C.cream, 3.4);
        peak(X0 + bigW + 0.05, smW, (base - Y0) * 0.68, C.terra, b, C.cream, 2.15);
        peak(X0 + bigW + smW + 0.1, smW, (base - Y0) * 0.56, C.sand, c, C.ink, 2.15);
        t.line(s, X0, base, CW, 0, C.ink, 1.5, { name: 'Ground line' });
        if (d.note) t.text(s, d.note, { x: X0, y: 4.3, w: 8.2, h: 0.78, fontFace: F.head, italic: true, fontSize: L.fit(d.note, 8.2, 0.76, 13, 10, F.head, false, 1, true), color: C.muted });
      },
      async (d) => { // the olive sheet: a table of waypoints, a pin to each row
        const s = sheet(d), rh = d.note ? 0.86 : 1.12;
        for (const [i, v] of d.stats.entries()) {
          const y = Y0 + i * rh;
          await pin(s, X0, y + rh / 2 - 0.22, 0.44, i === 1 ? C.sand : C.cream);
          t.text(s, v.value, { x: X0 + 0.6, y: y + 0.03, w: 3.2, h: rh - 0.06, fontFace: F.head, bold: true, color: C.cream, valign: 'middle', fontSize: L.fit(v.value, 3.15, rh - 0.1, 40, 20, F.head, true) });
          body(s, v.label, X0 + 3.95, y + 0.05, CW - 3.95, rh - 0.1, { color: C.cream, valign: 'middle', max: 15 });
          t.line(s, X0, y + rh, CW, 0, C.sand, 1, { dash: 'dash' });
        }
        if (d.note) t.text(s, d.note, { x: X0, y: Y0 + 3 * rh + 0.06, w: CW, h: Y1 + 0.1 - Y0 - 3 * rh - 0.06, fontFace: F.head, italic: true, fontSize: L.fit(d.note, CW, Y1 + 0.1 - Y0 - 3 * rh - 0.06, 13, 10, F.head, false, 1, true), color: SOFT });
      },
    ],
    compare: [
      async (d) => { // two banks of a river: a dashed route runs between them, sides mirrored
        const s = page(d), w = 3.95, cx = W / 2, avail = Y1 - 2.05;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.18, avail);
        t.line(s, cx, Y0 - 0.02, 0, Y1 - Y0 + 0.02, C.terra, 2, { dash: 'dash', name: 'Route' });
        head(s, d.left.h, cx - 0.45 - w, Y0, w, 0.48, { color: C.olive, align: 'right', max: 20 }); head(s, d.right.h, cx + 0.45, Y0, w, 0.48, { color: C.terra, max: 20 });
        t.oval(s, cx - 0.24, Y0, 0.48, 0.48, C.bg, { line: { color: C.terra, width: 1.5 }, name: 'Ring' });
        t.text(s, 'N', { x: cx - 0.24, y: Y0, w: 0.48, h: 0.48, fontFace: F.head, bold: true, fontSize: 13, color: C.ink, align: 'center', valign: 'middle' });
        let y = 2.05;
        for (let k = 0; k < rows.length; k++) {
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: cx - 0.45 - w, y, w, h: rows[k], fontSize: fs, color: C.ink, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: cx + 0.45, y, w, h: rows[k], fontSize: fs, color: C.ink });
          await pin(s, cx - 0.13, y - 0.02, 0.26, C.terra);
          y += Math.max(rows[k], Math.min(0.7, avail / rows.length));
        }
      },
      async (d) => { // strata: two layers of rock run across the page with a wavy seam between them
        const s = page(d), top = Y0 - 0.02, mid = 3.22, bot = Y1 + 0.04, px = 1000, wv = 26;
        const seam = `M0,${wv} C200,0 300,${2 * wv} 500,${wv} S800,0 1000,${wv}`;
        t.rect(s, 0, top, W, mid - top, C.sand, { name: 'Upper stratum' });
        t.rect(s, 0, mid, W, bot - mid, C.olive, { name: 'Lower stratum' });
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${2 * wv}"><path d="${seam} L1000,${2 * wv} L0,${2 * wv} Z" fill="#${C.olive}"/><path d="${seam}" fill="none" stroke="#${C.ink}" stroke-width="3"/></svg>`, px * 2, 4 * wv), 0, mid - 0.26, W, 0.52, { alt: '' });
        for (const [i, side] of [d.left, d.right].entries()) {
          const dark = i === 1, ink = dark ? C.cream : C.ink, y = dark ? mid + 0.28 : top + 0.08, h = dark ? bot - mid - 0.34 : mid - top - 0.36, n = side.items.length, rh = h / n;
          head(s, side.h, X0, y, 2.5, h, { color: dark ? C.cream : C.olive, max: 19 });
          side.items.forEach((it, k) => { t.text(s, '▲', { x: X0 + 2.7, y: y + k * rh, w: 0.22, h: rh, fontSize: 8, color: dark ? C.sand : C.terra, valign: 'middle' }); body(s, it, X0 + 2.95, y + k * rh, CW - 2.95, rh - 0.02, { color: ink, valign: 'middle', max: 13 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the olive sheet: the words large, one great pin standing beside them
        const s = sheet(d), hh = d.caption ? 2.05 : 3.3;
        t.oval(s, 7.65, 3.9, 1.5, 0.4, C.ink, { t: 65, name: 'Pin shadow' });
        await pin(s, 7.5, 1.9, 2.2, C.cream);
        t.text(s, L.runs(d.text), { x: X0, y: Y0, w: 6.7, h: hh, fontFace: F.head, bold: true, color: C.cream, valign: 'middle', fontSize: L.fit(d.text, 6.7, hh - 0.05, 34, 18, F.head, true) });
        if (d.caption) t.text(s, d.caption, { x: X0, y: Y0 + hh + 0.1, w: 6.6, h: Y1 - Y0 - hh - 0.05, fontSize: L.fit(d.caption, 6.6, Y1 - Y0 - hh - 0.05, 14, 10, F.body), color: SOFT });
      },
      async (d) => { // a map's title cartouche, double-ruled, a large compass rose at its side
        const s = page(d), x = X0, y = Y0 + 0.02, w = 6.35, h = Y1 - Y0 - 0.02;
        t.rect(s, x, y, w, h, C.cream, { line: { color: C.ink, width: 1.5 }, name: 'Cartouche' });
        t.rect(s, x + 0.08, y + 0.08, w - 0.16, h - 0.16, null, { line: { color: C.olive, width: 0.5 }, name: 'Inner border' });
        const hh = d.caption ? 1.95 : h - 0.4;
        t.text(s, L.runs(d.text), { x: x + 0.3, y: y + 0.18, w: w - 0.6, h: hh, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, w - 0.6, hh - 0.04, 30, 16, F.head, true) });
        if (d.caption) { t.line(s, x + 0.3, y + hh + 0.22, 1.0, 0, C.terra, 2, { dash: 'dash' }); t.text(s, d.caption, { x: x + 0.3, y: y + hh + 0.3, w: w - 0.6, h: h - hh - 0.42, fontSize: L.fit(d.caption, w - 0.6, h - hh - 0.42, 13, 10, F.body), color: C.muted }); }
        rose(s, 8.2, 3.25, 2.3);
      },
    ],
    timeline: [
      async (d) => { // a winding route down the left, pins at the dates
        const s = page(d), n = d.items.length, rh = (Y1 - Y0) / n, lx = 2.2, px = 80, py = Math.round((Y1 - Y0) * 100), pts = d.items.map((_, i) => [i % 2 ? 62 : 18, Math.round((i + 0.3) * rh * 100)]);
        const sm = pts.map((p, i) => { if (!i) return `M${p[0]},${p[1]}`; const q = pts[i - 1], dy = (p[1] - q[1]) / 2; return `C${q[0]},${q[1] + dy} ${p[0]},${p[1] - dy} ${p[0]},${p[1]}`; }).join(' ');
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${py}"><path d="${sm}" fill="none" stroke="#${C.terra}" stroke-width="4" stroke-dasharray="10 8" stroke-linecap="round"/></svg>`, px * 2, py * 2), lx, Y0, 0.8, Y1 - Y0, { alt: '' });
        for (const [i, it] of d.items.entries()) {
          const y = Y0 + i * rh, cx = lx + pts[i][0] / 100, cyy = Y0 + pts[i][1] / 100;
          await pin(s, cx - 0.17, cyy - 0.3, 0.34, i % 2 ? C.olive : C.terra);
          t.text(s, it.year, { x: X0, y: y + 0.02, w: 1.5, h: 0.42, fontFace: F.head, bold: true, color: C.terra, align: 'right', valign: 'middle', fontSize: L.fit(it.year, 1.5, 0.4, 20, 11, F.head, true) });
          head(s, it.h, lx + 1.0, y, 6.2, 0.32, { max: 16 });
          body(s, it.t, lx + 1.0, y + 0.33, 6.2, rh - 0.36, { color: C.ink, max: 13 });
        }
      },
      async (d) => { // a trail climbing to the upper right: each waypoint's board sits a step higher
        const s = page(d), n = d.items.length, h = 0.84, step = (Y1 - Y0 - h) / (n - 1), xs = [0, 1.2, 2.4, 3.6], w = 5.2;
        const pts = d.items.map((_, i) => [Math.round((X0 + xs[i] + 0.2) * 100), Math.round((Y1 - h / 2 - i * step) * 100)]);
        t.img(s, await L.svg(route(1000, 563, pts, C.terra), 1000, 563), 0, 0, W, H, { alt: '' });
        d.items.forEach((it, i) => {
          const x = X0 + xs[i], y = Y1 - h - i * step;
          t.rect(s, x, y, w, h, C.cream, { line: { color: C.olive, width: 0.75 }, name: 'Board' });
          t.rect(s, x, y, 0.95, h, i === n - 1 ? C.terra : C.olive, { name: 'Date' });
          t.text(s, it.year, { x: x + 0.04, y, w: 0.87, h, fontFace: F.head, bold: true, color: C.cream, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 0.84, 0.7, 15, 9, F.head, true) });
          head(s, it.h, x + 1.05, y + 0.02, w - 1.15, 0.27, { max: 13 });
          body(s, it.t, x + 1.05, y + 0.29, w - 1.15, h - 0.31, { color: C.ink, max: 11 });
        });
      },
      async (d) => { // the olive sheet: one dashed route across the middle, pins above and below it by turns
        const s = sheet(d), ly = (Y0 + Y1) / 2, w = 3.95, xs = [X0, X0 + 0.9, 5.0, 5.45], cell = 1.42;
        t.line(s, X0, ly, CW, 0, C.cream, 2, { dash: 'dash', name: 'Route' });
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = xs[i], y = up ? ly - 0.42 - cell : ly + 0.12;
          await pin(s, x - 0.03, ly - 0.38, 0.38, i === 3 ? C.sand : C.cream);
          t.text(s, [{ text: it.year + '  ', options: { color: C.sand, bold: true } }, { text: it.h, options: { color: C.cream, bold: true } }], { x: x + 0.05, y, w: w - 0.05, h: 0.34, fontFace: F.head, fontSize: L.fit(`${it.year}  ${it.h}`, w - 0.08, 0.32, 15, 10, F.head, true), valign: 'middle' });
          body(s, it.t, x + 0.05, y + 0.36, w - 0.05, cell - 0.38, { color: C.cream, max: 13 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.timeline = V.timeline.shift(); // the old timeline (dashed route over columns) read like the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => ({ x: 3.2, y: 5.15, w: 5.4, h: 0.25, color: type === 'quote' || d._night ? C.sand : C.muted, align: 'right' }));
  return L.save(pres, out, { name: 'SlideAI Topo', colors: { dk1: C.ink, lt1: C.cream, dk2: '3C4A40', lt2: C.bg, accent1: C.olive, accent2: C.terra, accent3: C.contour, accent4: C.sand, accent5: C.muted, accent6: '8FA06A', hlink: C.terra, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "tadqiqot yo'li ohangi: bosqich, yo'nalish va natija; metaforani me'yorida ishlat", "limits": {}};
module.exports = { id: 20, slug: 'topo', name: 'Xarita', category: 'academic', build, style: STYLE };
