/**
 * 35 Art Deco — 1920s glamour: emerald and gold, sunburst fans, stepped frame corners,
 * octagon-cut photo frames, wide-spaced capitals.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { em: '0F3D35', em2: '17564A', gold: 'D4AF37', gold2: 'A8862A', cream: 'F5EEDC', ink: '1E2420', muted: '5E655C' };
const F = { head: 'Arial', body: 'Times New Roman' };
const OCT = { poly: [[0.07, 0], [0.93, 0], [1, 0.07], [1, 0.93], [0.93, 1], [0.07, 1], [0, 0.93], [0, 0.07]] };

const fan = (w, h, color, rays = 15) => { let r = ''; for (let i = 0; i <= rays; i++) { const a = Math.PI + (i / rays) * Math.PI; r += `<line x1="${w / 2}" y1="${h}" x2="${(w / 2 + Math.cos(a) * w * 0.48).toFixed(1)}" y2="${(h + Math.sin(a) * h * 0.95).toFixed(1)}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g stroke="#${color}" stroke-width="3">${r}</g><g fill="none" stroke="#${color}" stroke-width="3"><path d="M${w * 0.18},${h} A${w * 0.32},${h * 0.62} 0 0 1 ${w * 0.82},${h}"/><path d="M${w * 0.34},${h} A${w * 0.16},${h * 0.31} 0 0 1 ${w * 0.66},${h}"/></g></svg>`; };
const frameSvg = (color) => { // double frame with stepped corners
  const c = (x, y, sx, sy) => `<path d="M${x},${y + sy * 70} L${x},${y} L${x + sx * 70},${y} M${x + sx * 14},${y + sy * 50} L${x + sx * 14},${y + sy * 14} L${x + sx * 50},${y + sy * 14} M${x + sx * 28},${y + sy * 30} L${x + sx * 28},${y + sy * 28} L${x + sx * 30},${y + sy * 28}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><g fill="none" stroke="#${color}" stroke-width="3"><rect x="34" y="34" width="1532" height="832"/><rect x="46" y="46" width="1508" height="808" stroke-width="1.5"/>${c(60, 60, 1, 1)}${c(1540, 60, -1, 1)}${c(60, 840, 1, -1)}${c(1540, 840, -1, -1)}</g></svg>`; };
const octFrame = (w, h, color) => { const p = OCT.poly.map(([x, y]) => `${(x * (w - 8) + 4).toFixed(1)},${(y * (h - 8) + 4).toFixed(1)}`).join(' '), q = OCT.poly.map(([x, y]) => `${(x * (w - 28) + 14).toFixed(1)},${(y * (h - 28) + 14).toFixed(1)}`).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="none" stroke="#${color}"><polygon points="${p}" stroke-width="5"/><polygon points="${q}" stroke-width="2"/></g></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const frameG = await L.svg(frameSvg(C.gold), 1600, 900), frameD = await L.svg(frameSvg(C.gold2), 1600, 900);
  const memo = {}; const svgImg = async (k, fn, w, h) => (memo[k] ??= await L.svg(fn(), w, h));
  const fanImg = (w, h, color) => svgImg(`f${w}${h}${color}`, () => fan(w * 100, h * 100, color), w * 100, h * 100);
  const decoPhoto = async (s, src, x, y, w, h) => {
    t.img(s, await L.photo(L.src(src), w - 0.24, h - 0.24, { mask: OCT }), x + 0.12, y + 0.12, w - 0.24, h - 0.24, { alt: '' });
    t.img(s, await svgImg(`o${w}${h}`, () => octFrame(w * 100, h * 100, C.gold), w * 100, h * 100), x, y, w, h);
  };
  const caps = (s) => String(s).toUpperCase();
  const footer = (s, dark) => t.text(s, `${caps(M.topic || '')}   \u25C6   ${meta}`, { x: 0.6, y: 5.1, w: 8.8, h: 0.22, fontFace: F.head, fontSize: 7.5, color: dark ? C.gold : C.gold2, align: 'center', charSpacing: 1 });
  let idx = 0;
  const page = async (d, dark = false) => {
    const s = pres.addSlide(); s.background = { color: dark ? C.em : C.cream }; idx++;
    t.img(s, dark ? frameG : frameD, 0, 0, W, H);
    if (d.title) {
      t.shape(s, 'DIAMOND', { x: 0.62, y: 0.6, w: 0.22, h: 0.22, fill: { color: C.gold }, objectName: 'Diamond' });
      t.text(s, caps(d.title), { x: 0.98, y: 0.42, w: 7.6, h: 0.6, fontFace: F.head, bold: true, color: dark ? C.cream : C.em, valign: 'middle', charSpacing: 3, fontSize: L.fit(caps(d.title), 7.4 * 0.8, 0.6, 22, 13, F.head, true) });
    }
    t.text(s, L.pad2(idx), { x: 8.7, y: 0.45, w: 0.7, h: 0.5, fontFace: F.head, fontSize: 13, bold: true, color: C.gold2, align: 'right', valign: 'middle' });
    footer(s, dark);
    return s;
  };
  const body = (s, txt, x, y, w, h, color = C.ink) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.em }; idx++;
    t.img(s, frameG, 0, 0, W, H);
    t.img(s, await fanImg(4.0, 2.0, C.em2), 0.6, 3.05, 4.0, 2.0);
    if (d.image) await decoPhoto(s, d.image, 6.0, 0.75, 3.2, 3.9);
    t.text(s, caps([M.org, M.loc, M.year].filter(Boolean).join('  \u25C6  ')), { x: 0.75, y: 0.75, w: 5, h: 0.3, fontFace: F.head, fontSize: 11, bold: true, color: C.gold, charSpacing: 2 });
    const T = caps(d.title), fs = L.fit(T, 5.0 * 0.8, 2.0, 36, 18, F.head, true); // wide letter-spacing: measure narrower
    t.text(s, T, { x: 0.75, y: 1.1, w: 5.0, h: 2.2, fontFace: F.head, bold: true, fontSize: fs, color: C.cream, valign: 'bottom', charSpacing: 3 });
    t.line(s, 0.75, 3.45, 1.4, 0, C.gold, 1.5);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.75, y: 3.6, w: 4.9, h: 0.7, fontSize: 14, italic: true, color: 'D9CFB3' });
    t.text(s, caps(M.author || ''), { x: 0.75, y: 4.45, w: 4.9, h: 0.35, fontFace: F.head, fontSize: 12, bold: true, color: C.gold, charSpacing: 3 });
    footer(s, true);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await decoPhoto(s, d.image, 0.75, 1.25, 3.8, 3.65); body(s, d.text, 4.95, 1.3, 4.4, 3.55); },
    async image(d) { const s = await page(d, true); body(s, d.text, 0.75, 1.3, 4.3, 3.55, C.cream); await decoPhoto(s, d.image, 5.45, 1.25, 3.9, 3.65); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.05, 3.4 / per);
      d.items.forEach((it, i) => {
        const x = 0.8 + Math.floor(i / per) * 4.3, y = 1.4 + (i % per) * rh;
        t.shape(s, 'DIAMOND', { x, y: y + 0.05, w: 0.6, h: 0.6, fill: { color: C.em }, line: { color: C.gold, width: 1.5 }, objectName: 'Number' });
        t.text(s, String(i + 1), { x, y: y + 0.05, w: 0.6, h: 0.6, fontFace: F.head, fontSize: 14, bold: true, color: C.gold, align: 'center', valign: 'middle' });
        t.text(s, caps(it), { x: x + 0.8, y, w: 3.3, h: 0.7, fontFace: F.head, fontSize: 14, bold: true, color: C.em, valign: 'middle', charSpacing: 1.5 });
      });
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.25, w = (8.5 - gap * (n - 1)) / n;
      const h = Math.min(3.3, 1.7 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.5, F.body))) + 0.3);
      for (const [i, it] of d.items.entries()) {
        const x = 0.75 + i * (w + gap);
        t.rect(s, x, 1.45, w, h, C.em, { name: 'Panel' });
        t.rect(s, x + 0.08, 1.53, w - 0.16, h - 0.16, null, { line: { color: C.gold, width: 0.75 }, name: 'Inner frame' });
        t.img(s, await fanImg(1.2, 0.6, C.gold), x + w / 2 - 0.6, 1.62, 1.2, 0.6);
        t.text(s, caps(it.h), { x: x + 0.25, y: 2.35, w: w - 0.5, h: 0.45, fontFace: F.head, fontSize: L.fit(caps(it.h), (w - 0.5) * 0.88, 0.45, 13, 9, F.head, true), bold: true, color: C.gold, align: 'center', charSpacing: 1.5 });
        t.text(s, it.t, { x: x + 0.25, y: 2.85, w: w - 0.5, h: h - 1.5, fontSize: 14, color: C.cream, align: 'center' });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.5 / n;
      d.steps.forEach((st, i) => {
        const x = 0.75 + i * cw;
        t.shape(s, 'OCTAGON', { x, y: 1.4, w: 0.8, h: 0.8, fill: { color: C.em }, line: { color: C.gold, width: 1.5 }, objectName: 'Step' });
        t.text(s, String(i + 1), { x, y: 1.4, w: 0.8, h: 0.8, fontFace: F.head, fontSize: 20, bold: true, color: C.gold, align: 'center', valign: 'middle' });
        if (i < n - 1) t.text(s, '\u00BB', { x: x + 0.9, y: 1.4, w: cw - 1.0, h: 0.8, fontFace: F.head, fontSize: 30, color: C.gold2, align: 'center', valign: 'middle' });
        t.text(s, caps(st.h), { x, y: 2.4, w: cw - 0.3, h: 0.5, fontFace: F.head, fontSize: L.fit(caps(st.h), cw - 0.3, 0.5, 13, 9, F.head, true), bold: true, color: C.em, charSpacing: 1 });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.3, h: 1.9, fontSize: L.fit(st.t, cw - 0.3, 1.9, 15, 11, F.body), color: C.ink });
      });
    },
    async stats(d) {
      const s = await page(d, true), n = d.stats.length, cw = 8.5 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.75 + i * cw;
        t.img(s, await fanImg(cw - 0.3, (cw - 0.3) / 2, C.em2), px, 1.4, cw - 0.3, (cw - 0.3) / 2);
        t.text(s, x.value, { x: px, y: 1.6, w: cw - 0.3, h: 1.1, fontFace: F.head, fontSize: L.fit(x.value, cw - 0.6, 1.0, 50, 24, F.head, true), bold: true, color: C.gold, align: 'center', valign: 'bottom' });
        t.text(s, x.label, { x: px + 0.1, y: 3.0, w: cw - 0.5, h: 1.0, fontSize: 15, italic: true, color: C.cream, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.75, y: 4.3, w: 8.5, h: 0.45, fontSize: 11, italic: true, color: 'B9B08F', align: 'center' });
    },
    async compare(d) {
      const s = await page(d), w = 4.1;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.6, F.body) : 0))) + 0.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.75 + i * (w + 0.3), dark = i === 1;
        t.rect(s, x, 1.4, w, 3.5, dark ? C.em : 'EDE3CB', { name: 'Panel' });
        t.text(s, caps(side.h), { x: x + 0.3, y: 1.55, w: w - 0.6, h: 0.5, fontFace: F.head, fontSize: 15, bold: true, color: dark ? C.gold : C.em, charSpacing: 2 });
        let y = 2.2;
        side.items.forEach((it, k) => { t.shape(s, 'DIAMOND', { x: x + 0.3, y: y + 0.08, w: 0.13, h: 0.13, fill: { color: C.gold }, objectName: 'Bullet' }); t.text(s, it, { x: x + 0.55, y, w: w - 0.8, h: rows[k], fontSize: 15, color: dark ? C.cream : C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = await page(d, true);
      t.img(s, await fanImg(6.0, 3.0, C.em2), 2.0, 1.5, 6.0, 3.0);
      t.text(s, L.runs(d.text), { x: 1.3, y: 1.6, w: 7.4, h: 1.8, fontFace: F.body, fontSize: L.fit(d.text, 7.4, 1.7, 34, 20, F.body, true), bold: true, color: C.gold, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.8, y: 3.5, w: 6.4, h: 1.1, fontSize: L.fit(d.caption, 6.4, 1.1, 15, 11, F.body), italic: true, color: C.cream, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.5 / n;
      t.line(s, 0.75, 2.3, 8.5, 0, C.gold, 1.5); t.line(s, 0.75, 2.38, 8.5, 0, C.gold, 0.5);
      d.items.forEach((it, i) => {
        const x = 0.75 + i * cw;
        t.text(s, it.year, { x, y: 1.4, w: cw - 0.2, h: 0.65, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.6, 26, 13, F.head, true), bold: true, color: C.em, valign: 'bottom', charSpacing: 2 });
        t.shape(s, 'DIAMOND', { x, y: 2.2, w: 0.26, h: 0.26, fill: { color: C.gold }, objectName: 'Marker' });
        t.text(s, caps(it.h), { x, y: 2.65, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 12, bold: true, color: C.em, charSpacing: 1 });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.ink });
      });
    },
    async quote(d) {
      const s = await page({}, true);
      t.img(s, await fanImg(5.0, 2.5, C.em2), 2.5, 2.4, 5.0, 2.5);
      t.text(s, d.text, { x: 1.3, y: 1.1, w: 7.4, h: 2.4, fontFace: F.body, italic: true, fontSize: L.fit(d.text, 7.4, 2.3, 32, 18, F.body, false, 1, true), color: C.cream, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, caps(d.author), { x: 1.3, y: 3.7, w: 7.4, h: 0.4, fontFace: F.head, fontSize: 12, bold: true, color: C.gold, align: 'center', charSpacing: 3 });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.56, 3.4 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.shape(s, 'DIAMOND', { x: 0.8, y: y + (rh - 0.34) / 2, w: 0.34, h: 0.34, fill: { color: C.em }, line: { color: C.gold, width: 1 }, objectName: 'Num' });
        t.text(s, String(i + 1), { x: 0.8, y: y + (rh - 0.34) / 2, w: 0.34, h: 0.34, fontFace: F.head, fontSize: 9, bold: true, color: C.gold, align: 'center', valign: 'middle' });
        t.text(s, it, { x: 1.35, y, w: 7.9, h: rh, fontSize: L.fit(it, 7.9, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Art Deco', colors: { dk1: C.ink, lt1: C.cream, dk2: C.em, lt2: 'EDE3CB', accent1: C.gold, accent2: C.em2, accent3: C.gold2, accent4: C.em, accent5: C.muted, accent6: 'B9B08F', hlink: C.gold2, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tantanali va nafis: sarlavhalar qisqa va salmoqli, matn muloyim, rasmiy-badiiy", limits: { title: 40, card_h: 18, step_h: 18, event_h: 14 }, prefer: null };
module.exports = { id: 35, slug: 'art-deco', name: 'Art Deco', category: 'creative', photos: true, build, style: STYLE };
