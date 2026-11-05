/**
 * 04 Samarqand — Uzbek heritage: lapis and turquoise tilework, gold girih stars,
 * pointed-arch (mihrab) frames, Bookman serif.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { lapis: '0E2A47', lapis2: '17406A', turq: '1F9E9A', gold: 'C9A04A', ivory: 'F7F1E4', ink: '1B2A3A', muted: '5D6B78', white: 'FFFFFF' };
const F = { head: 'Bookman Old Style', body: 'Calibri' };

function girih(w, h, opacity = 0.22, bg = C.lapis) {
  const s = 120, star = (cx, cy, r) => `<g transform="translate(${cx} ${cy})"><rect x="${-r}" y="${-r}" width="${2 * r}" height="${2 * r}"/><rect x="${-r}" y="${-r}" width="${2 * r}" height="${2 * r}" transform="rotate(45)"/><circle r="${r * 0.42}"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><pattern id="p" width="${s}" height="${s}" patternUnits="userSpaceOnUse">
   <g fill="none" stroke="#${C.gold}" stroke-width="2" stroke-opacity="${opacity}">${star(s / 2, s / 2, 30)}${star(0, 0, 30)}${star(s, 0, 30)}${star(0, s, 30)}${star(s, s, 30)}
   <line x1="${s / 2}" y1="0" x2="${s / 2}" y2="${s}"/><line x1="0" y1="${s / 2}" x2="${s}" y2="${s / 2}"/></g></pattern>
   <radialGradient id="v" cx="50%" cy="50%" r="65%"><stop offset="0" stop-color="#${bg}" stop-opacity="0.85"/><stop offset="1" stop-color="#${bg}" stop-opacity="0"/></radialGradient></defs>
  <rect width="${w}" height="${h}" fill="#${bg}"/><rect width="${w}" height="${h}" fill="url(#p)"/>${w > 1000 ? `<rect width="${w}" height="${h}" fill="url(#v)"/>` : ''}</svg>`;
}
// pointed arch; fill optional; double gold outline
function arch(w, h, fill) {
  const p = (i) => { const W2 = w - 2 * i, Hh = h - i, S = Math.min(h * 0.42, W2 * 0.75), x = i, y = i;
    return `M${x},${Hh} L${x},${y + S} C${x},${y + S * 0.42} ${x + W2 * 0.3},${y + S * 0.08} ${x + W2 / 2},${y} C${x + W2 * 0.7},${y + S * 0.08} ${x + W2},${y + S * 0.42} ${x + W2},${y + S} L${x + W2},${Hh} Z`; };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
   <path d="${p(4)}" fill="${fill ? '#' + fill : 'none'}" stroke="#${C.gold}" stroke-width="4"/>
   <path d="${p(16)}" fill="none" stroke="#${C.gold}" stroke-width="1.5" stroke-opacity="0.8"/></svg>`;
}

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  const bgArt = await L.svg(girih(1600, 900), 1600, 900, true);
  const band = await L.svg(girih(72, 900, 0.5), 72, 900, true);
  const archCache = {};
  const archImg = async (w, h, fill) => { const k = `${w}x${h}${fill}`; if (!archCache[k]) archCache[k] = await L.svg(arch(Math.round(w * 100), Math.round(h * 100), fill), w * 100, h * 100); return archCache[k]; };
  const star = (s, x, y, d, fill) => t.shape(s, 'STAR_8_POINT', { x, y, w: d, h: d, fill: { color: fill }, objectName: 'Girih star' });

  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.ivory };
    t.img(s, band, 0, 0, 0.45, H);
    star(s, 0.95, 0.62, 0.26, C.gold);
    t.text(s, d.title, { x: 1.35, y: 0.4, w: 8.05, h: 0.75, fontFace: F.head, bold: true, color: C.lapis, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.75, 26, 18, F.head, true) });
    s.slideNumber = { x: 8.9, y: 5.15, w: 0.5, h: 0.25, fontFace: F.head, fontSize: 10, color: C.gold, align: 'right' };
    return s;
  };
  const divider = (s, cx, y, w) => { t.line(s, cx - w / 2, y, w / 2 - 0.25, 0, C.gold, 1); star(s, cx - 0.12, y - 0.12, 0.24, C.gold); t.line(s, cx + 0.25, y, w / 2 - 0.25, 0, C.gold, 1); };

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { data: bgArt };
    t.img(s, await archImg(4.6, 4.9, C.lapis), 2.7, 0.4, 4.6, 4.9);
    const fs = L.fit(d.title, 3.6, 1.9, kind === 'cover' ? 34 : 36, 20, F.head, true), th = L.height(d.title, fs, 3.6, F.head, true);
    t.text(s, d.title, { x: 3.2, y: 3.15 - 2, w: 3.6, h: 2.05, fontFace: F.head, bold: true, fontSize: fs, color: C.ivory, align: 'center', valign: 'bottom' });
    divider(s, W / 2, 3.45, 2.2);
    if (d.subtitle) t.text(s, d.subtitle, { x: 3.3, y: 3.7, w: 3.4, h: 1.2, fontSize: 14, color: 'B9D9D6', align: 'center' });
    return s;
  };

  const R = {
    cover: (d) => hero(d, 'cover'),
    closing: (d) => hero(d, 'closing'),
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.4 / per);
      d.items.forEach((it, i) => {
        const x = 0.95 + Math.floor(i / per) * 4.3, y = 1.55 + (i % per) * rh;
        star(s, x, y, 0.62, i % 2 ? C.turq : C.lapis);
        t.text(s, String(i + 1), { x, y, w: 0.62, h: 0.62, fontFace: F.head, fontSize: 15, bold: true, color: C.ivory, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y, w: 3.2, h: 0.62, fontFace: F.head, fontSize: 16, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      if (d.items.length > 3) { // 2 x 2 tiles with gold border; arches need 3 or fewer
        const s = page(d), w = (8.45 - 0.3) / 2, rws = Math.ceil(d.items.length / 2), h = (3.55 - 0.3 * (rws - 1)) / rws;
        for (const [i, it] of d.items.entries()) {
          const x = 0.95 + (i % 2) * (w + 0.3), y = 1.4 + Math.floor(i / 2) * (h + 0.3);
          t.rect(s, x, y, w, h, C.white, { r: 0.08, line: { color: C.gold, width: 1.25 }, name: 'Tile' });
          star(s, x + 0.25, y + 0.25, 0.7, C.turq);
          t.img(s, await L.icon(it.icon, C.white, 2), x + 0.45, y + 0.45, 0.3, 0.3);
          t.text(s, it.h, { x: x + 1.15, y: y + 0.22, w: w - 1.4, h: 0.4, fontFace: F.head, fontSize: L.fit(it.h, w - 1.4, 0.4, 17, 12, F.head, true), bold: true, color: C.lapis });
          t.text(s, it.t, { x: x + 1.15, y: y + 0.65, w: w - 1.4, h: h - 0.8, fontSize: 14, color: C.muted });
        }
        return;
      }
      const s = page(d), n = d.items.length, gap = 0.3, w = (8.45 - gap * (n - 1)) / n, h = 3.55;
      const hfs = Math.min(...d.items.map((it) => L.fit(it.h, w - 0.7, 0.4, 17, 12, F.head, true)));
      for (const [i, it] of d.items.entries()) {
        const x = 0.95 + i * (w + gap), y = 1.4;
        t.img(s, await archImg(w, h, C.white), x, y, w, h);
        t.oval(s, x + w / 2 - 0.34, y + 0.85, 0.68, 0.68, C.turq);
        t.img(s, await L.icon(it.icon, C.white, 1.75), x + w / 2 - 0.18, y + 1.01, 0.36, 0.36);
        t.text(s, it.h, { x: x + 0.35, y: y + 1.7, w: w - 0.7, h: 0.4, fontFace: F.head, fontSize: hfs, bold: true, color: C.lapis, align: 'center' });
        t.text(s, it.t, { x: x + 0.35, y: y + 2.15, w: w - 0.7, h: h - 2.3, fontSize: 14, color: C.muted, align: 'center' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, cw = 8.45 / n, my = 1.6, md = 0.85;
      t.line(s, 0.95 + md / 2, my + md / 2, cw * (n - 1), 0, C.gold, 1.25, { dash: 'dash' });
      const hfs = Math.min(...d.steps.map((st) => L.fit(st.h, cw - 0.3, 0.4, 17, 12, F.head, true)));
      d.steps.forEach((st, i) => {
        const x = 0.95 + i * cw;
        star(s, x, my, md, C.lapis);
        t.text(s, String(i + 1), { x, y: my, w: md, h: md, fontFace: F.head, fontSize: 18, bold: true, color: C.gold, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x, y: my + 1.1, w: cw - 0.3, h: 0.4, fontFace: F.head, fontSize: hfs, bold: true, color: C.lapis });
        t.text(s, st.t, { x, y: my + 1.55, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.muted });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.45 / n, dd = 1.9;
      d.stats.forEach((x, i) => {
        const cx = 0.95 + i * cw + cw / 2, ox = cx - dd / 2;
        t.oval(s, ox, 1.45, dd, dd, C.white, { line: { color: C.gold, width: 2.25 } });
        t.oval(s, ox + 0.1, 1.55, dd - 0.2, dd - 0.2, null, { line: { color: C.gold, width: 0.75 } });
        t.text(s, x.value, { x: ox + 0.15, y: 1.45, w: dd - 0.3, h: dd, fontFace: F.head, bold: true, color: C.lapis, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd - 0.45, 0.8, 32, 16, F.head, true) });
        t.text(s, x.label, { x: cx - cw / 2 + 0.2, y: 3.55, w: cw - 0.4, h: 1.0, fontSize: 14, color: C.muted, align: 'center' });
      });
      if (d.note) t.text(s, d.note, { x: 0.95, y: 4.6, w: 8.45, h: 0.4, fontSize: 14, italic: true, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = page(d), w = 4.05, h = 3.6;
      // shrink text (14 -> 12pt) only if the list would run past the arch
      let fsz = 14, rows;
      for (; fsz >= 12; fsz--) {
        rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
          Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], fsz, w - 1.3, F.body) : 0))));
        if (rows.reduce((a, b) => a + b + 0.12, 0) <= h - 1.75) break;
      }
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.95 + i * (w + 0.35), y = 1.35;
        t.img(s, await archImg(w, h, i ? C.lapis : C.white), x, y, w, h);
        t.text(s, side.h, { x: x + 0.4, y: y + 0.95, w: w - 0.8, h: 0.45, fontFace: F.head, bold: true, fontSize: 18, color: i ? C.gold : C.lapis, align: 'center' });
        let yy = y + 1.5;
        side.items.forEach((it, k) => {
          const hh = rows[k];
          t.shape(s, 'DIAMOND', { x: x + 0.5, y: yy + 0.07, w: 0.12, h: 0.12, fill: { color: i ? C.gold : C.turq }, objectName: 'Bullet' });
          t.text(s, it, { x: x + 0.75, y: yy, w: w - 1.3, h: hh + 0.05, fontSize: fsz, color: i ? C.ivory : C.ink });
          yy += hh + 0.12;
        });
      }
    },
    async statement(d) {
      const s = page(d);
      const fs = L.fit(d.text, 7.6, 1.3, 32, 20, F.head, true), th = L.height(d.text, fs, 7.6, F.head, true);
      const cx = 0.95 + 8.45 / 2;
      divider(s, cx, 1.85, 3.0);
      t.text(s, L.runs(d.text), { x: cx - 3.8, y: 2.1, w: 7.6, h: th + 0.1, fontFace: F.head, bold: true, color: C.lapis, fontSize: fs, align: 'center', valign: 'middle' });
      divider(s, cx, 2.35 + th, 3.0);
      if (d.caption) t.text(s, d.caption, { x: cx - 3.3, y: 2.6 + th, w: 6.6, h: 1.2, fontSize: 15, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 8.45 / n, ly = 2.45;
      t.line(s, 0.95, ly, 8.45, 0, C.gold, 1.5);
      d.items.forEach((it, i) => {
        const x = 0.95 + i * cw;
        t.text(s, it.year, { x, y: 1.5, w: cw - 0.2, h: 0.6, fontFace: F.head, bold: true, color: C.turq, valign: 'bottom', fontSize: L.fit(it.year, cw - 0.3, 0.6, 26, 14, F.head, true) });
        star(s, x, ly - 0.17, 0.34, C.lapis);
        t.text(s, it.h, { x, y: 2.8, w: cw - 0.3, h: 0.4, fontFace: F.head, bold: true, fontSize: 16, color: C.lapis });
        t.text(s, it.t, { x, y: 3.25, w: cw - 0.3, h: 1.7, fontSize: 14, color: C.muted });
      });
    },
    async quote(d) {
      const s = pres.addSlide(); s.background = { data: bgArt };
      t.img(s, await archImg(6.4, 4.9, C.lapis), 1.8, 0.4, 6.4, 4.9);
      const fs = L.fit(d.text, 4.8, 1.8, 30, 18, F.head, false, 1, true);
      divider(s, W / 2, 1.95, 2.0);
      t.text(s, d.text, { x: 2.6, y: 2.2, w: 4.8, h: 1.9, fontFace: F.head, italic: true, fontSize: fs, color: C.ivory, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 2.6, y: 4.2, w: 4.8, h: 0.4, fontSize: 14, color: C.gold, align: 'center' });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      await PH(s, d.image, 0.95, 1.3, 3.4, 3.7, { mask: { path: 'M0,1 L0,0.42 C0,0.2 0.3,0.06 0.5,0 C0.7,0.06 1,0.2 1,0.42 L1,1 Z' } });
      t.img(s, await archImg(3.4, 3.7, null), 0.95, 1.3, 3.4, 3.7);
      t.text(s, d.text, { x: 4.7, y: 1.4, w: 4.7, h: 3.5, fontSize: L.fit(d.text, 4.7, 3.5, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: 0.95, y: 1.4, w: 4.4, h: 3.5, fontSize: L.fit(d.text, 4.4, 3.5, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
      await PH(s, d.image, 5.85, 1.3, 3.4, 3.7, { mask: { path: 'M0,1 L0,0.42 C0,0.2 0.3,0.06 0.5,0 C0.7,0.06 1,0.2 1,0.42 L1,1 Z' } });
      t.img(s, await archImg(3.4, 3.7, null), 5.85, 1.3, 3.4, 3.7);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.5 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        star(s, 0.95, y + (rh - 0.38) / 2, 0.38, i % 2 ? C.turq : C.lapis);
        t.text(s, String(i + 1), { x: 0.95, y: y + (rh - 0.38) / 2, w: 0.38, h: 0.38, fontFace: F.head, fontSize: 10, bold: true, color: C.ivory, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.5, y, w: 7.9, h: rh, fontSize: L.fit(it, 7.9, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { await PH(s, d.image, 7.75, 0.95, 1.85, 3.75, { mask: { path: 'M0,1 L0,0.42 C0,0.2 0.3,0.06 0.5,0 C0.7,0.06 1,0.2 1,0.42 L1,1 Z' } }); t.img(s, await archImg(1.85, 3.75, null), 7.75, 0.95, 1.85, 3.75); },
    closing: async (s, d) => { await PH(s, d.image, 7.75, 0.95, 1.85, 3.75, { mask: { path: 'M0,1 L0,0.42 C0,0.2 0.3,0.06 0.5,0 C0.7,0.06 1,0.2 1,0.42 L1,1 Z' } }); t.img(s, await archImg(1.85, 3.75, null), 7.75, 0.95, 1.85, 3.75); },
  });
  // ---- further ways to draw a type, in this template's own tilework: a deck's pages must not look alike (L.pages)
  const body = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, txt, x, y, w, h, o = {}) => t.text(s, txt, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(txt, w, h, o.max || 16, 11, F.head, true), color: o.color || C.lapis, align: o.align, valign: o.valign || 'middle' });
  const nightPage = (d) => {
    d._night = true;
    const s = pres.addSlide(); s.background = { data: bgArt };
    star(s, 0.6, 0.55, 0.3, C.gold);
    t.text(s, d.title, { x: 1.05, y: 0.4, w: 8.35, h: 0.65, fontFace: F.head, bold: true, color: C.ivory, valign: 'middle', fontSize: L.fit(d.title, 8.35, 0.65, 26, 18, F.head, true) });
    s.slideNumber = { x: 8.9, y: 5.15, w: 0.5, h: 0.25, fontFace: F.head, fontSize: 10, color: C.gold, align: 'right' };
    return s;
  };
  const medal = async (s, x, y, d, ic, fill = C.turq) => { star(s, x, y, d, fill); t.img(s, await L.icon(ic, C.white, 2), x + d * 0.3, y + d * 0.3, d * 0.4, d * 0.4); };
  const numbered = (s, x, y, d, n, fill = C.lapis, ink = C.gold) => { star(s, x, y, d, fill); t.text(s, String(n), { x, y, w: d, h: d, fontFace: F.head, fontSize: Math.round(d * 20), bold: true, color: ink, align: 'center', valign: 'middle' }); };
  const circle = async (s, img, x, y, d) => { t.img(s, await L.photo(L.src(img), d, d, { mask: 'circle' }), x, y, d, d, { alt: '' }); t.oval(s, x - 0.08, y - 0.08, d + 0.16, d + 0.16, null, { line: { color: C.gold, width: 2.25 } }); };
  const V = {
    image: [
      async (d) => { // wide panorama under a gold rule, the text beneath it
        const s = page(d);
        await PH(s, d.image, 0.95, 1.3, 8.45, 1.95);
        t.rect(s, 0.95, 3.25, 8.45, 0.05, C.gold, { name: 'Gold rule' });
        t.text(s, d.text, { x: 0.95, y: 3.42, w: 8.45, h: 1.62, fontSize: L.fit(d.text, 8.45, 1.62, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2 });
      },
      async (d) => { // a large picture, the text on a tile laid over its edge
        const s = page(d);
        await PH(s, d.image, 0.95, 1.3, 5.3, 3.75);
        t.rect(s, 5.35, 1.7, 4.05, 2.95, C.white, { line: { color: C.gold, width: 1.5 }, shadow: 0.18, name: 'Tile' });
        t.text(s, d.text, { x: 5.55, y: 1.85, w: 3.65, h: 2.65, fontSize: L.fit(d.text, 3.65, 2.65, 14, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // night sky: a round medallion
        const s = nightPage(d);
        await circle(s, d.image, 5.75, 1.3, 3.6);
        t.text(s, d.text, { x: 0.95, y: 1.35, w: 4.4, h: 3.5, fontSize: L.fit(d.text, 4.4, 3.5, 15, 10, F.body, false, 1.25), color: C.ivory, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, a lapis column holds the words
        d._night = true;
        const s = pres.addSlide(); await PH(s, d.image, 0, 0, W, H);
        t.rect(s, 0.6, 0, 4.3, H, C.lapis, { t: 6, name: 'Lapis column' });
        t.rect(s, 0.72, 0, 0.03, H, C.gold, { name: 'Gold rule' }); t.rect(s, 4.78, 0, 0.03, H, C.gold, { name: 'Gold rule' });
        t.text(s, d.title, { x: 0.95, y: 0.45, w: 3.6, h: 1.05, fontFace: F.head, bold: true, color: C.gold, valign: 'bottom', fontSize: L.fit(d.title, 3.6, 1.05, 24, 15, F.head, true) });
        divider(s, 2.75, 1.65, 3.6);
        t.text(s, d.text, { x: 0.95, y: 1.85, w: 3.6, h: 3.2, fontSize: L.fit(d.text, 3.6, 3.2, 14, 10, F.body, false, 1.2), color: C.ivory, lineSpacingMultiple: 1.2 });
        t.rect(s, 0, 5.28, W, 0.345, C.lapis, { name: 'Footer band' });
      },
    ],
    cards: [
      async (d) => { // rows, a star and a word on the left, ruled like a manuscript
        const s = page(d), n = d.items.length, h = 3.65 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.35 + i * h;
          await medal(s, 0.95, y + (h - 0.66) / 2, 0.66, it.icon, i % 2 ? C.turq : C.lapis);
          head(s, it.h, 1.8, y, 2.35, h - 0.08);
          body(s, it.t, 4.3, y + 0.06, 5.1, h - 0.16, { valign: 'middle' });
          if (i < n - 1) t.line(s, 1.8, y + h - 0.02, 7.6, 0, C.gold, 0.75);
        }
      },
      async (d) => { // a great medallion in the middle, the items around it
        const s = page(d), n = d.items.length, cx = 5.175, cy = 3.18, md = 1.9;
        t.line(s, 3.9, cy, 2.55, 0, C.gold, 1);
        t.line(s, cx, 1.45, 0, 3.45, C.gold, 1);
        star(s, cx - md / 2, cy - md / 2, md, C.lapis); star(s, cx - 0.5, cy - 0.5, 1.0, C.gold);
        const spots = n === 4 ? [[0.95, 1.38], [6.3, 1.38], [0.95, 3.3], [6.3, 3.3]] : [[0.95, 1.38], [6.3, 2.3], [0.95, 3.3]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i], right = x > cx, a = right ? 'left' : 'right';
          t.img(s, await L.icon(it.icon, C.turq, 2), right ? x : x + 2.8, y + 0.04, 0.3, 0.3);
          head(s, it.h, right ? x + 0.38 : x, y, 2.72, 0.38, { align: a });
          body(s, it.t, x, y + 0.42, 3.1, 1.3, { align: a });
        }
      },
      async (d) => { // a tile frieze across the page: icons on the lapis band, words beneath
        const s = page(d), n = d.items.length, cw = 8.45 / n;
        t.img(s, await L.svg(girih(845, 100, 0.45), 845, 100, true), 0.95, 1.32, 8.45, 1.0);
        t.rect(s, 0.95, 2.32, 8.45, 0.05, C.gold, { name: 'Gold rule' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.95 + i * cw;
          t.oval(s, x + 0.12, 1.5, 0.64, 0.64, C.gold);
          t.img(s, await L.icon(it.icon, C.lapis, 2), x + 0.28, 1.66, 0.32, 0.32);
          head(s, it.h, x + 0.12, 2.5, cw - 0.3, 0.55);
          body(s, it.t, x + 0.12, 3.08, cw - 0.3, 1.95);
          if (i) t.line(s, x, 2.55, 0, 2.4, C.gold, 0.75);
        }
      },
      async (d) => { // tiles at two heights on the night sky
        const s = nightPage(d), n = d.items.length, gap = 0.22, w = (8.45 - gap * (n - 1)) / n, h = 3.0;
        for (const [i, it] of d.items.entries()) {
          const x = 0.95 + i * (w + gap), y = i % 2 ? 1.95 : 1.3;
          t.rect(s, x, y, w, h, C.ivory, { name: 'Tile' });
          t.rect(s, x, y, w, 0.08, i % 2 ? C.turq : C.gold, { name: 'Tile top' });
          t.img(s, await L.icon(it.icon, C.turq, 2), x + 0.18, y + 0.24, 0.32, 0.32);
          head(s, it.h, x + 0.18, y + 0.6, w - 0.36, 0.55, { max: 15 });
          body(s, it.t, x + 0.18, y + 1.17, w - 0.36, h - 1.27, { color: C.ink, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // steps down a staircase
        const s = page(d), n = d.steps.length, h = 3.65 / n, shift = n === 4 ? 0.55 : 0.75;
        d.steps.forEach((st, i) => {
          const x = 0.95 + i * shift, y = 1.35 + i * h, w = 8.45 - i * shift;
          t.rect(s, x + 0.3, y + 0.04, w - 0.3, h - 0.1, C.white, { line: { color: C.gold, width: 1 }, name: 'Step' });
          numbered(s, x, y + (h - 0.62) / 2 - 0.03, 0.62, i + 1);
          head(s, st.h, x + 0.78, y + 0.07, 2.2, h - 0.16, { max: 14 });
          body(s, st.t, x + 3.05, y + 0.08, w - 3.2, h - 0.18, { valign: 'middle', max: 13 });
        });
      },
      async (d) => { // night sky: a road of chevrons
        const s = nightPage(d), n = d.steps.length, cw = 8.45 / n;
        d.steps.forEach((st, i) => {
          const x = 0.95 + i * cw;
          t.shape(s, 'CHEVRON', { x, y: 1.4, w: cw + 0.12, h: 0.85, fill: { color: i % 2 ? C.turq : C.gold }, objectName: 'Chevron' });
          t.text(s, L.pad2(i + 1), { x: x + 0.3, y: 1.4, w: cw - 0.4, h: 0.85, fontFace: F.head, bold: true, fontSize: 20, color: C.lapis, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.1, 2.45, cw - 0.25, 0.6, { color: C.gold });
          body(s, st.t, x + 0.1, 3.08, cw - 0.25, 1.95, { color: C.ivory });
        });
      },
      async (d) => { // a path turning back on itself, two by two
        const s = page(d), n = d.steps.length, w = 4.05, h = 1.72, spot = (i) => (i < 2 ? [0.95 + i * 4.4, 1.35] : [0.95 + (n === 3 ? 0 : (3 - i)) * 4.4, 3.28]);
        t.line(s, 3, 2.2, 4.4, 0, C.gold, 2, { dash: 'dash' }); t.line(s, 7.4, 2.2, 0, 1.9, C.gold, 2, { dash: 'dash' }); t.line(s, 3, 4.1, 4.4, 0, C.gold, 2, { dash: 'dash' });
        d.steps.forEach((st, i) => {
          const [x, y] = spot(i), last = n === 3 && i === 2, ww = last ? 8.45 : w;
          t.rect(s, x, y, ww, h, i === n - 1 ? C.lapis : C.white, { line: { color: C.gold, width: 1 }, name: 'Tile' });
          numbered(s, x + 0.15, y + 0.15, 0.56, i + 1, i === n - 1 ? C.gold : C.lapis, i === n - 1 ? C.lapis : C.gold);
          head(s, st.h, x + 0.85, y + 0.15, ww - 1.0, 0.56, { max: 15, color: i === n - 1 ? C.gold : C.lapis });
          body(s, st.t, x + 0.2, y + 0.78, ww - 0.4, h - 0.86, { color: i === n - 1 ? C.ivory : C.muted, max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // one number under the arch, the others beside it
        const s = page(d), [a, ...rest] = d.stats;
        t.img(s, await archImg(3.4, 3.7, C.lapis), 0.95, 1.3, 3.4, 3.7);
        t.text(s, a.value, { x: 1.2, y: 2.35, w: 2.9, h: 1.05, fontFace: F.head, bold: true, color: C.gold, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 2.9, 1.0, 48, 22, F.head, true) });
        body(s, a.label, 1.4, 3.45, 2.5, 1.35, { color: C.ivory, align: 'center' });
        rest.forEach((x, i) => {
          const y = 1.4 + i * 1.45;
          t.text(s, x.value, { x: 4.7, y, w: 2.1, h: 1.2, fontFace: F.head, bold: true, color: C.turq, valign: 'middle', fontSize: L.fit(x.value, 2.1, 1.1, 36, 18, F.head, true) });
          body(s, x.label, 6.85, y, 2.55, 1.2, { valign: 'middle', color: C.ink });
          if (!i) t.line(s, 4.7, y + 1.32, 4.7, 0, C.gold, 0.75);
        });
        if (d.note) body(s, d.note, 4.7, 4.25, 4.7, 0.75, { max: 11 });
      },
      async (d) => { // numbers on lapis plates, one under another
        const s = page(d), rh = d.note ? 1.0 : 1.2;
        d.stats.forEach((x, i) => {
          const y = 1.35 + i * rh;
          t.rect(s, 0.95, y, 2.9, rh - 0.14, i === 1 ? C.turq : C.lapis, { name: 'Plate' });
          t.text(s, x.value, { x: 1.05, y, w: 2.7, h: rh - 0.14, fontFace: F.head, bold: true, color: i === 1 ? C.white : C.gold, align: 'center', valign: 'middle', fontSize: L.fit(x.value, 2.6, rh - 0.2, 34, 16, F.head, true) });
          star(s, 3.72, y + (rh - 0.14) / 2 - 0.13, 0.26, C.gold);
          body(s, x.label, 4.2, y, 5.2, rh - 0.14, { valign: 'middle', color: C.ink, max: 16 });
        });
        if (d.note) body(s, d.note, 0.95, 4.4, 8.45, 0.65, { max: 11 });
      },
    ],
    compare: [
      async (d) => { // two wings round a column of stars
        const s = page(d), w = 3.75, cx = 5.175;
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.1, F.body, 0.2, 3.0);
        t.rect(s, 0.95, 1.35, w, 0.55, C.lapis, { name: 'Header' }); t.rect(s, 5.65, 1.35, w, 0.55, C.turq, { name: 'Header' });
        head(s, d.left.h, 1.05, 1.35, w - 0.2, 0.55, { color: C.gold, align: 'right' }); head(s, d.right.h, 5.75, 1.35, w - 0.2, 0.55, { color: C.white });
        star(s, cx - 0.2, 1.42, 0.4, C.gold);
        let y = 2.05;
        for (let k = 0; k < rows.length; k++) {
          star(s, cx - 0.1, y + 0.03, 0.2, k % 2 ? C.turq : C.lapis);
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.95, y, w, h: rows[k], fontSize: fs, color: C.ink, align: 'right' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.65, y, w, h: rows[k], fontSize: fs, color: C.ink });
          y += rows[k];
        }
      },
      async (d) => { // one band above the other: the lighter tile, then lapis
        const s = page(d), h = 1.75;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.33 + i * (h + 0.12), night = i === 1, ink = night ? C.ivory : C.ink;
          t.rect(s, 0.95, y, 8.45, h, night ? C.lapis : C.white, { line: { color: C.gold, width: 1 }, name: 'Band' });
          head(s, side.h, 1.1, y + 0.1, 1.95, h - 0.2, { color: night ? C.gold : C.lapis, max: 18 });
          t.line(s, 3.15, y + 0.15, 0, h - 0.3, C.gold, 1);
          for (const [k, it] of side.items.entries()) {
            const x = 3.3 + (k % 2) * 3.05, yy = y + 0.1 + Math.floor(k / 2) * ((h - 0.2) / 2);
            t.shape(s, 'DIAMOND', { x, y: yy + 0.06, w: 0.12, h: 0.12, fill: { color: night ? C.gold : C.turq }, objectName: 'Bullet' });
            body(s, it, x + 0.2, yy, 2.72, (h - 0.2) / 2 - 0.03, { color: ink, max: 13 });
          }
        }
      },
    ],
    statement: [
      async (d) => { // night sky: the meaning in a gold-ruled column, the thought to the right of it
        const s = nightPage(d);
        if (d.caption) body(s, d.caption, 0.95, 1.5, 2.4, 3.3, { color: 'B9D9D6', valign: 'middle', align: 'right' });
        t.line(s, 3.6, 1.5, 0, 3.3, C.gold, 1.5);
        t.text(s, L.runs(d.text), { x: 3.9, y: 1.4, w: 5.5, h: 3.5, fontFace: F.head, bold: true, color: C.ivory, valign: 'middle', fontSize: L.fit(d.text, 5.5, 3.4, 34, 18, F.head, true) });
      },
      async (d) => { // the arch holds the note, the thought stands beside it
        const s = page(d);
        t.img(s, await archImg(3.3, 3.7, C.turq), 6.1, 1.3, 3.3, 3.7);
        if (d.caption) body(s, d.caption, 6.55, 2.6, 2.4, 2.25, { color: C.white, align: 'center', max: 13 });
        star(s, 7.5, 2.0, 0.5, C.gold);
        t.text(s, L.runs(d.text), { x: 0.95, y: 1.45, w: 4.9, h: 3.4, fontFace: F.head, bold: true, color: C.lapis, valign: 'middle', fontSize: L.fit(d.text, 4.9, 3.3, 34, 18, F.head, true) });
      },
    ],
    timeline: [
      async (d) => { // a central spine, events to either side
        const s = page(d), cx = 5.175;
        t.line(s, cx, 1.4, 0, 3.6, C.gold, 2);
        d.items.forEach((it, i) => {
          const right = i % 2 === 1, y = 1.35 + Math.floor(i / 2) * 1.85 + (right ? 0.42 : 0), x = right ? cx + 0.45 : 0.95, w = 3.78, a = right ? 'left' : 'right';
          star(s, cx - 0.15, y + 0.06, 0.3, right ? C.turq : C.lapis);
          t.text(s, [{ text: it.year + '  ', options: { color: C.turq, bold: true } }, { text: it.h, options: { color: C.lapis, bold: true } }], { x, y, w, h: 0.42, fontFace: F.head, fontSize: L.fit(`${it.year}  ${it.h}`, w, 0.4, 15, 10, F.head, true), align: a, valign: 'middle' });
          body(s, it.t, x, y + 0.44, w, 1.2, { align: a, max: 13 });
        });
      },
      async (d) => { // towers rising, each a step taller
        const s = page(d), n = d.items.length, gap = 0.18, w = (8.45 - gap * (n - 1)) / n;
        d.items.forEach((it, i) => {
          const x = 0.95 + i * (w + gap), y = 2.13 - i * 0.27, h = 5.02 - y, last = i === n - 1;
          t.rect(s, x, y, w, h, last ? C.lapis : C.white, { line: { color: C.gold, width: 1 }, name: 'Tower' });
          t.rect(s, x, y, w, 0.5, last ? C.gold : C.lapis, { name: 'Tower top' });
          t.text(s, it.year, { x: x + 0.05, y, w: w - 0.1, h: 0.5, fontFace: F.head, bold: true, color: last ? C.lapis : C.gold, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.2, 0.45, 20, 11, F.head, true) });
          head(s, it.h, x + 0.12, y + 0.56, w - 0.24, 0.42, { max: 13, color: last ? C.gold : C.lapis });
          body(s, it.t, x + 0.12, y + 1.0, w - 0.24, h - 1.05, { max: 12, color: last ? C.ivory : C.muted });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, (type, _s, d) => (['cover', 'closing', 'quote'].includes(type) || d._night ? { x: 0.6, y: 5.33, w: 8.8, h: 0.22, color: 'B9D9D6', align: 'center' } : { x: 0.95, y: 5.15, w: 7.6, h: 0.25, color: C.muted }));
  return L.save(pres, out, { name: 'SlideAI Samarqand', colors: { dk1: C.ink, lt1: C.white, dk2: C.lapis, lt2: C.ivory, accent1: C.turq, accent2: C.gold, accent3: C.lapis, accent4: C.lapis2, accent5: C.muted, accent6: 'B9D9D6', hlink: C.turq, folHlink: C.gold } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "salobatli, madaniy-tarixiy ohang; hurmatli va biroz badiiy ifoda", "limits": {}};
module.exports = { id: 4, slug: 'samarqand', name: 'Samarqand', category: 'creative', build, style: STYLE };
