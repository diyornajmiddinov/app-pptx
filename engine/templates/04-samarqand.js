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
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, (type) => (['cover', 'closing', 'quote'].includes(type) ? { x: 0.6, y: 5.33, w: 8.8, h: 0.22, color: 'B9D9D6', align: 'center' } : { x: 0.95, y: 5.15, w: 7.6, h: 0.25, color: C.muted }));
  return L.save(pres, out, { name: 'SlideAI Samarqand', colors: { dk1: C.ink, lt1: C.white, dk2: C.lapis, lt2: C.ivory, accent1: C.turq, accent2: C.gold, accent3: C.lapis, accent4: C.lapis2, accent5: C.muted, accent6: 'B9D9D6', hlink: C.turq, folHlink: C.gold } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "salobatli, madaniy-tarixiy ohang; hurmatli va biroz badiiy ifoda", "limits": {}};
module.exports = { id: 4, slug: 'samarqand', name: 'Samarqand', category: 'creative', build, style: STYLE };
