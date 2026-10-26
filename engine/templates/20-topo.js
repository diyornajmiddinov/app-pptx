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
      const cfs = L.colSize(d, w - 0.95, h - 1.0 - 0.1, 0.2, F.body); // items shrink to fit the panel
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], cfs, w - 0.95, F.body) : 0))));
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3), fg = i ? C.cream : C.ink;
        t.rect(s, x, y, w, h, i ? C.olive : C.sand, { name: 'Panel' });
        t.text(s, side.h, { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: i ? C.cream : C.olive });
        let yy = y + 1.0;
        for (const [k, it] of side.items.entries()) {
          await pin(s, x + 0.3, yy - 0.01, 0.25, i ? C.cream : C.terra);
          t.text(s, it, { x: x + 0.65, y: yy, w: w - 0.95, h: rows[k] + 0.05, fontSize: cfs, color: fg });
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
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => ({ x: 3.2, y: 5.15, w: 5.4, h: 0.25, color: type === 'quote' ? C.sand : C.muted, align: 'right' }));
  return L.save(pres, out, { name: 'SlideAI Topo', colors: { dk1: C.ink, lt1: C.cream, dk2: '3C4A40', lt2: C.bg, accent1: C.olive, accent2: C.terra, accent3: C.contour, accent4: C.sand, accent5: C.muted, accent6: '8FA06A', hlink: C.terra, folHlink: C.muted } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "tadqiqot yo'li ohangi: bosqich, yo'nalish va natija; metaforani me'yorida ishlat", "limits": {}};
module.exports = { id: 20, slug: 'topo', name: 'Xarita', category: 'academic', build, style: STYLE };
