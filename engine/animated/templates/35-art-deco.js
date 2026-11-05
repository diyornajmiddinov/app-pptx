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
        t.text(s, caps(it.h), { x: x + 0.25, y: 2.35, w: w - 0.5, h: 0.45, fontFace: F.head, fontSize: L.fit(caps(it.h), (w - 0.5) * 0.88, 0.45, 13, 9, F.head, true), bold: true, color: C.gold, align: 'center', charSpacing: 0.5 });
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
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.6, F.body, 0.2, 4.85 - 2.2);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.75 + i * (w + 0.3), dark = i === 1;
        t.rect(s, x, 1.4, w, 3.5, dark ? C.em : 'EDE3CB', { name: 'Panel' });
        t.text(s, caps(side.h), { x: x + 0.3, y: 1.55, w: w - 0.6, h: 0.5, fontFace: F.head, fontSize: 15, bold: true, color: dark ? C.gold : C.em, charSpacing: 2 });
        let y = 2.2;
        side.items.forEach((it, k) => { t.shape(s, 'DIAMOND', { x: x + 0.3, y: y + 0.08, w: 0.13, h: 0.13, fill: { color: C.gold }, objectName: 'Bullet' }); t.text(s, it, { x: x + 0.55, y, w: w - 0.8, h: rows[k], fontSize: CFS, color: dark ? C.cream : C.ink }); y += rows[k]; });
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
  // ---- further ways to draw a type, in the 1920s manner: a deck's pages must not look alike (L.pages)
  const X0 = 0.75, FW = 8.5, Y1 = 4.95;
  const head = (s, v, x, y, w, h, o = {}) => { const T = caps(v); t.text(s, T, { x, y, w, h, fontFace: F.head, bold: true, charSpacing: 1, fontSize: L.fit(T, w * 0.88, h, o.max || 13, 9.5, F.head, true), color: o.color || C.em, align: o.align, valign: o.valign || 'middle' }); };
  const small = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top', italic: o.italic });
  const diamond = (s, x, y, d, fill = C.gold, o = {}) => t.shape(s, 'DIAMOND', { x, y, w: d, h: d, fill: { color: fill }, ...(o.line ? { line: { color: o.line, width: o.lw || 1.25 } } : {}), objectName: 'Diamond' });
  const framed = (s, x, y, w, h, fill = C.em, line = C.gold) => { t.rect(s, x, y, w, h, fill, { name: 'Panel' }); t.rect(s, x + 0.07, y + 0.07, w - 0.14, h - 0.14, null, { line: { color: line, width: 0.75 }, name: 'Inner frame' }); };
  const rule = (s, x, y, w, color = C.gold) => { t.line(s, x, y, w, 0, color, 1.5); t.line(s, x, y + 0.06, w, 0, color, 0.5); };
  const burstSvg = (d, color, rays = 36) => { let r = ''; for (let k = 0; k < rays; k++) { const a = (k / rays) * 2 * Math.PI, R0 = d / 2; r += `<line x1="${(R0 + Math.cos(a) * R0 * 0.3).toFixed(1)}" y1="${(R0 + Math.sin(a) * R0 * 0.3).toFixed(1)}" x2="${(R0 + Math.cos(a) * R0 * 0.99).toFixed(1)}" y2="${(R0 + Math.sin(a) * R0 * 0.99).toFixed(1)}"/>`; } return `<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}"><g stroke="#${color}" stroke-width="3">${r}</g></svg>`; };
  const TOWER = [[0, 1], [0, 0.32], [0.14, 0.32], [0.14, 0.18], [0.29, 0.18], [0.29, 0.07], [0.5, 0], [0.71, 0.07], [0.71, 0.18], [0.86, 0.18], [0.86, 0.32], [1, 0.32], [1, 1]];
  const towerLine = (w, h, color) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><polygon points="${TOWER.map(([a, b]) => `${(a * (w - 6) + 3).toFixed(1)},${(b * (h - 6) + 3).toFixed(1)}`).join(' ')}" fill="none" stroke="#${color}" stroke-width="5"/></svg>`;
  const archSvg = (w, h, fill, line) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="M3,${h - 3} L3,${w / 2} A${w / 2 - 3},${w / 2 - 3} 0 0 1 ${w - 3},${w / 2} L${w - 3},${h - 3} Z" fill="#${fill}" stroke="#${line}" stroke-width="3"/><path d="M12,${h - 12} L12,${w / 2} A${w / 2 - 12},${w / 2 - 12} 0 0 1 ${w - 12},${w / 2} L${w - 12},${h - 12} Z" fill="none" stroke="#${line}" stroke-width="1"/></svg>`;
  const V = {
    image: [
      async (d) => { // a frieze: the picture one long band between gold rules, the words beneath
        const s = await page(d, true), y = 1.22, h = 1.92;
        rule(s, X0, y - 0.1, FW);
        t.img(s, await L.photo(L.src(d.image), FW, h), X0, y, FW, h, { alt: d.title });
        rule(s, X0, y + h + 0.04, FW);
        diamond(s, 4.86, y + h - 0.13, 0.28, C.gold);
        body(s, d.text, X0, y + h + 0.17, FW, Y1 - y - h - 0.17, C.cream);
      },
      async (d) => { // a window shaped like a stepped skyscraper, the words at its foot on cream
        const s = await page(d), x = 5.6, y = 1.08, w = 3.65, h = 3.88;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: TOWER } }), x, y, w, h, { alt: d.title });
        t.img(s, await svgImg('tower', () => towerLine(365, 388, C.gold), 365, 388), x, y, w, h);
        rule(s, X0, 1.3, 4.5);
        body(s, d.text, X0, 1.48, 4.55, 3.42);
      },
      async (d) => { // the whole frame is picture; an emerald plaque stands in the middle
        const s = pres.addSlide(); s.background = { color: C.em }; idx++;
        t.img(s, await L.photo(L.src(d.image), 9.42, 4.72), 0.29, 0.29, 9.42, 4.72, { alt: d.title });
        t.img(s, frameG, 0, 0, W, H);
        const x = 2.0, y = 0.72, w = 6.0, h = 3.92;
        framed(s, x, y, w, h);
        head(s, d.title, x + 0.35, y + 0.14, w - 1.1, 0.72, { color: C.gold, max: 15 });
        t.text(s, L.pad2(idx), { x: x + w - 0.72, y: y + 0.2, w: 0.45, h: 0.5, fontFace: F.head, fontSize: 12, bold: true, color: C.gold, align: 'right', valign: 'middle' });
        rule(s, x + 0.35, y + 0.9, w - 0.7);
        body(s, d.text, x + 0.35, y + 1.03, w - 0.7, h - 1.18, C.cream);
        footer(s, true);
      },
      async (d) => { // the round picture as a sun: rays of gold on emerald
        const s = await page(d, true), R_ = 3.86, dia = 2.7, cx = 2.6, cy = 3.03;
        t.img(s, await svgImg('burst', () => burstSvg(386, C.gold2), 386, 386), cx - R_ / 2, cy - R_ / 2, R_, R_);
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), cx - dia / 2, cy - dia / 2, dia, dia, { alt: d.title });
        t.oval(s, cx - dia / 2 - 0.03, cy - dia / 2 - 0.03, dia + 0.06, dia + 0.06, null, { line: { color: C.gold, width: 2 } });
        body(s, d.text, 4.8, 1.25, 4.45, 3.65, C.cream);
      },
    ],
    cards: [
      async (d) => { // a listing in a programme: diamond, name, gold double rule, the words
        const s = await page(d), n = d.items.length, y0 = 1.25, h = 3.68 / n;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h, D = 0.72;
          diamond(s, X0, y + h / 2 - D / 2, D, C.em, { line: C.gold });
          t.img(s, await L.icon(it.icon, C.gold, 2), X0 + D / 2 - 0.13, y + h / 2 - 0.13, 0.26, 0.26);
          head(s, it.h, X0 + 0.92, y + 0.04, 2.45, h - 0.14, { max: 13 });
          small(s, it.t, 4.2, y + 0.04, 5.05, h - 0.14, { valign: 'middle' });
          if (i < n - 1) rule(s, X0 + 0.92, y + h - 0.05, FW - 0.92);
        }
      },
      async (d) => { // arched windows on emerald, set at two heights
        const s = await page(d, true), n = d.items.length, g = 0.16, w = (FW - g * (n - 1)) / n, top = 1.1;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + g), y = top + (i % 2 ? 0.28 : 0), h = 3.56, k = `a${n}`;
          t.img(s, await svgImg(k, () => archSvg(Math.round(w * 100), Math.round(h * 100), C.em2, C.gold), w * 100, h * 100), x, y, w, h);
          t.img(s, await L.icon(it.icon, C.gold, 2), x + w / 2 - 0.2, y + 0.42, 0.4, 0.4);
          head(s, it.h, x + 0.18, y + 0.94, w - 0.36, 0.5, { color: C.gold, align: 'center', max: 12 });
          small(s, it.t, x + 0.2, y + 1.46, w - 0.4, h - 1.58, { color: C.cream, align: 'center' });
        }
      },
      async (d) => { // a great gold fan at the foot of the page, the ideas spread to either side
        const s = await page(d), n = d.items.length, fx = 3.75, fw = 2.5, fh = 1.25;
        t.img(s, await fanImg(fw, fh, C.gold), fx, Y1 - fh, fw, fh);
        const left = d.items.slice(0, 2), right = d.items.slice(2), gapL = 1.85;
        for (const [i, it] of d.items.entries()) {
          const onL = i < 2, list = onL ? left : right, k = onL ? i : i - 2, tall = list.length === 1, y = 1.22 + k * gapL + (tall ? 0.92 : 0), x = onL ? X0 : 6.0, w = 3.25, al = onL ? 'right' : 'left';
          t.img(s, await L.icon(it.icon, C.gold2, 2), onL ? x + w - 0.3 : x, y, 0.3, 0.3);
          head(s, it.h, onL ? x : x + 0.38, y, w - 0.38, 0.32, { align: al });
          t.line(s, x, y + 0.36, w, 0, C.gold, 1);
          small(s, it.t, x, y + 0.42, w, 1.3, { align: al, max: 13 });
        }
        diamond(s, 4.82, 1.3, 0.36, C.em, { line: C.gold });
        t.line(s, 5.0, 1.66, 0, Y1 - fh - 1.7, C.gold, 1);
      },
      async (d) => { // one idea on a slab of gold, the others on emerald at its side
        const s = await page(d), [a, ...rest] = d.items, g = 0.12, h = (3.68 - g * (rest.length - 1)) / rest.length;
        framed(s, X0, 1.25, 4.1, 3.68, C.gold, C.em);
        t.img(s, await fanImg(1.6, 0.8, C.em), X0 + 1.25, 1.42, 1.6, 0.8);
        t.img(s, await L.icon(a.icon, C.em, 2), X0 + 1.88, 1.86, 0.34, 0.34);
        head(s, a.h, X0 + 0.3, 2.3, 3.5, 0.56, { align: 'center', max: 16, color: C.ink });
        small(s, a.t, X0 + 0.3, 2.9, 3.5, 1.92, { align: 'center', max: 16, color: C.ink });
        for (const [i, it] of rest.entries()) {
          const y = 1.25 + i * (h + g), x = 5.02, w = 4.23;
          framed(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.gold, 2), x + 0.2, y + 0.16, 0.28, 0.28);
          head(s, it.h, x + 0.58, y + 0.12, w - 0.78, 0.36, { color: C.gold, max: 12 });
          small(s, it.t, x + 0.2, y + 0.5, w - 0.4, h - 0.6, { color: C.cream, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a ziggurat: terraces widen as the steps go down
        const s = await page(d, true), n = d.steps.length, h = 3.72 / n, wTop = n === 3 ? 6.3 : 5.7, dw = n === 3 ? 1.1 : 0.94, g = 0.06;
        d.steps.forEach((st, i) => {
          const w = wTop + i * dw, x = 5 - w / 2, y = 1.22 + i * h, hh = h - g;
          t.rect(s, x, y, w, hh, i % 2 ? C.em2 : '0B2E28', { line: { color: C.gold, width: 1.25 }, name: 'Terrace' });
          t.text(s, String(i + 1), { x: x + 0.1, y, w: 0.5, h: hh, fontFace: F.head, bold: true, fontSize: 24, color: C.gold, align: 'center', valign: 'middle' });
          t.line(s, x + 0.66, y + 0.1, 0, hh - 0.2, C.gold, 0.75);
          head(s, st.h, x + 0.78, y + 0.04, w - 0.92, 0.3, { color: C.gold, max: 12 });
          small(s, st.t, x + 0.78, y + 0.34, w - 0.92, hh - 0.38, { color: C.cream, max: 13 });
        });
      },
      async (d) => { // a gold column up the middle: diamonds on it, the steps left and right
        const s = await page(d), n = d.steps.length, y0 = 1.2, h = 3.76 / n, cx = 5, D = 0.5;
        t.line(s, cx - 0.04, y0 + 0.1, 0, 3.56, C.gold, 1.5); t.line(s, cx + 0.04, y0 + 0.1, 0, 3.56, C.gold, 1.5);
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? X0 : 5.48, w = 3.77, al = left ? 'right' : 'left';
          diamond(s, cx - D / 2, y + h / 2 - D / 2, D, C.em, { line: C.gold });
          t.text(s, String(i + 1), { x: cx - D / 2, y: y + h / 2 - D / 2, w: D, h: D, fontFace: F.head, bold: true, fontSize: 12, color: C.gold, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.03, w, 0.3, { align: al });
          small(s, st.t, x, y + 0.33, w, h - 0.37, { align: al, max: 13 });
        });
      },
      async (d) => { // a route through a formal garden: across, down, back; double chevrons mark the way
        const s = await page(d), n = d.steps.length, w = 4.05, h = 1.72, gx = 0.4, gy = 0.2, y0 = 1.25;
        const spot = (i) => (n === 3 && i === 2 ? [X0, y0 + h + gy, FW] : [X0 + (i === 0 || i === 3 ? 0 : w + gx), y0 + (i < 2 ? 0 : h + gy), w]);
        d.steps.forEach((st, i) => {
          const [x, y, ww] = spot(i);
          t.rect(s, x, y, ww, h, 'EDE3CB', { line: { color: C.gold2, width: 1 }, name: 'Panel' });
          t.shape(s, 'OCTAGON', { x: x + 0.14, y: y + 0.14, w: 0.56, h: 0.56, fill: { color: C.em }, line: { color: C.gold, width: 1.25 }, objectName: 'Step' });
          t.text(s, String(i + 1), { x: x + 0.14, y: y + 0.14, w: 0.56, h: 0.56, fontFace: F.head, bold: true, fontSize: 14, color: C.gold, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.84, y + 0.14, ww - 0.98, 0.56);
          small(s, st.t, x + 0.2, y + 0.78, ww - 0.4, h - 0.86, { max: 13.5 });
        });
        const mark = (x, y, a) => t.text(s, a, { x: x - 0.2, y: y - 0.2, w: 0.4, h: 0.4, fontFace: F.head, bold: true, fontSize: 20, color: C.gold2, align: 'center', valign: 'middle' });
        mark(5, y0 + h / 2, '»');
        mark(n === 3 ? 5 : 7.05, y0 + h + gy / 2, '↓');
        if (n === 4) mark(5, y0 + h + gy + h / 2, '«');
      },
    ],
    stats: [
      async (d) => { // the great figure in an octagon frame, the others listed under a gold rule
        const s = await page(d), [a, ...rest] = d.stats, x = X0, y = 1.2, w = 4.2, h = 2.4;
        t.img(s, await svgImg('octbig', () => octFrame(420, 240, C.gold), 420, 240), x, y, w, h);
        t.text(s, a.value, { x: x + 0.3, y: y + 0.28, w: w - 0.6, h: 1.1, fontFace: F.head, bold: true, fontSize: L.fit(a.value, w - 0.6, 1.05, 56, 26, F.head, true), color: C.em, align: 'center', valign: 'middle' });
        small(s, a.label, x + 0.4, y + 1.4, w - 0.8, 0.82, { align: 'center', max: 13.5 });
        rest.forEach((q, i) => {
          const yy = 1.2 + i * 1.24, X = 5.3, ww = 3.95;
          t.text(s, q.value, { x: X, y: yy, w: ww, h: 0.62, fontFace: F.head, bold: true, fontSize: L.fit(q.value, ww, 0.6, 32, 18, F.head, true), color: C.gold2, valign: 'middle' });
          small(s, q.label, X, yy + 0.62, ww, 0.5, { max: 13 });
          if (!i) rule(s, X, yy + 1.15, ww);
        });
        if (d.note) small(s, d.note, X0, 3.72, FW, 1.22, { max: 14, italic: true, valign: 'middle', align: 'center', color: C.muted });
      },
      async (d) => { // three great diamonds, the middle one raised
        const s = await page(d), D = 2.34, cols = [X0 + 0.15, 3.83, 6.76];
        d.stats.forEach((q, i) => {
          const x = cols[i], y = i === 1 ? 1.05 : 1.2;
          diamond(s, x, y, D, i === 1 ? C.em2 : C.em, { line: C.gold, lw: 1.75 });
          t.text(s, q.value, { x: x + 0.42, y: y + 0.42, w: D - 0.84, h: D - 0.84, fontFace: F.head, bold: true, fontSize: L.fit(q.value, D - 0.9, 1.0, 28, 15, F.head, true), color: C.gold, align: 'center', valign: 'middle' });
          small(s, q.label, cols[i] - 0.15, 3.58, D + 0.3, 0.66, { align: 'center', max: 12.5 });
        });
        if (d.note) small(s, d.note, X0, 4.26, FW, 0.74, { max: 11.5, italic: true, align: 'center', valign: 'middle', color: C.muted });
      },
    ],
    compare: [
      async (d) => { // emerald page, mirrored about a gold axis; a fan crowns the axis
        const s = await page(d, true), w = 3.55, y0 = 1.98, avail = 2.95;
        const fit = L.rowsFit([d.left.items, d.right.items], 14.5, w, F.body, 0.12, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        t.img(s, await fanImg(0.7, 0.35, C.gold), 4.65, 1.38, 0.7, 0.35);
        t.line(s, 5, 1.75, 0, 3.15, C.gold, 1.5);
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.4 : 1.05, al = i ? 'left' : 'right';
          head(s, side.h, x, 1.3, w, 0.5, { color: C.gold, align: al, max: 14 });
          t.line(s, x, 1.84, w, 0, C.gold2, 1);
          let y = y0;
          fit.rows.forEach((rh0, k) => {
            const rh = rh0 + extra;
            if (side.items[k]) t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: C.cream, align: al, valign: 'middle' });
            diamond(s, i ? 5.16 : 4.72, y + rh / 2 - 0.06, 0.12, C.gold);
            y += rh;
          });
        });
      },
      async (d) => { // two great bands: one emerald, one gold, a stepped name-plate on each
        const s = await page(d), bh = 1.76, g = 0.14;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.24 + i * (bh + g), n = side.items.length, fill = i ? C.gold : C.em, fg = i ? C.ink : C.cream, x0 = 3.0, cw = (9.2 - x0) / n, line = i ? C.em : C.gold;
          framed(s, X0, y, FW, bh, fill, line);
          head(s, side.h, X0 + 0.2, y + 0.14, 1.85, bh - 0.28, { color: i ? C.em : C.gold, max: 14 });
          t.line(s, 2.88, y + 0.2, 0, bh - 0.4, line, 1.5);
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.07, y + 0.26, 0, bh - 0.52, line, 0.5);
            small(s, it, x0 + k * cw, y + 0.12, cw - 0.16, bh - 0.24, { color: fg, valign: 'middle', max: 13.5 });
          });
        });
      },
    ],
    statement: [
      async (d) => { // cream, stepped gold pilasters to either side, the words between them
        const s = await page(d), heights = [3.5, 2.7, 1.9], bars = (side) => heights.forEach((h, k) => t.rect(s, side ? 9.25 - 0.13 * (k + 1) + 0.03 : X0 + 0.13 * k, Y1 - h, 0.08, h, C.gold, { name: 'Pilaster' }));
        bars(false); bars(true);
        t.text(s, L.runs(d.text), { x: 1.4, y: 1.25, w: 7.2, h: 2.1, fontFace: F.body, bold: true, fontSize: L.fit(d.text, 7.2, 2.05, 32, 18, F.body, true), color: C.em, align: 'center', valign: 'middle' });
        diamond(s, 4.86, 3.38, 0.28);
        if (d.caption) small(s, d.caption, 1.4, 3.72, 7.2, 1.22, { max: 14, italic: true, align: 'center', valign: 'middle' });
      },
      async (d) => { // parted down the page: the words in gold on emerald, the note on cream
        const s = pres.addSlide(); s.background = { color: C.cream }; idx++;
        t.rect(s, 0, 0, 6.3, H, C.em, { name: 'Panel' });
        t.img(s, frameD, 0, 0, W, H);
        t.img(s, await fanImg(5.0, 2.5, C.em2), 0.65, 2.48, 5.0, 2.5);
        head(s, d.title, 0.62, 0.42, 5.3, 0.6, { color: C.cream, max: 14 });
        t.text(s, L.runs(d.text), { x: 0.75, y: 1.2, w: 5.2, h: 3.6, fontFace: F.body, bold: true, fontSize: L.fit(d.text, 5.2, 3.5, 32, 18, F.body, true), color: C.gold, valign: 'middle' });
        t.text(s, L.pad2(idx), { x: 8.7, y: 0.45, w: 0.7, h: 0.5, fontFace: F.head, fontSize: 13, bold: true, color: C.gold2, align: 'right', valign: 'middle' });
        if (d.caption) { rule(s, 6.6, 1.3, 2.7); small(s, d.caption, 6.6, 1.5, 2.7, 3.4, { max: 15, italic: true }); }
        t.text(s, `${caps(M.topic || '')}   ◆   ${meta}`, { x: 0.6, y: 5.03, w: 5.5, h: 0.3, fontFace: F.head, fontSize: 7, color: C.gold, charSpacing: 0.5 });
      },
    ],
    timeline: [
      async (d) => { // the skyline rises: four towers, each taller than the last
        const s = await page(d, true), g = 0.1, w = (FW - 3 * g) / 4, hs = [2.5, 2.88, 3.26, 3.64];
        d.items.forEach((it, i) => {
          const h = hs[i], x = X0 + i * (w + g), y = Y1 - h;
          t.rect(s, x, y, w, h, C.em2, { line: { color: C.gold, width: 1 }, name: 'Tower' });
          t.rect(s, x + 0.3, y - 0.1, w - 0.6, 0.1, C.gold, { name: 'Tower step' });
          t.text(s, it.year, { x: x + 0.1, y: y + 0.08, w: w - 0.2, h: 0.44, fontFace: F.head, bold: true, fontSize: L.fit(it.year, w - 0.2, 0.42, 19, 11, F.head, true), color: C.gold, align: 'center', valign: 'middle' });
          head(s, it.h, x + 0.12, y + 0.54, w - 0.24, 0.4, { color: C.cream, align: 'center', max: 11 });
          small(s, it.t, x + 0.13, y + 0.96, w - 0.26, h - 1.04, { color: C.cream, align: 'center', max: 12.5 });
        });
      },
      async (d) => { // a gold band across cream: date plaques on it, the events above and below
        const s = await page(d), ly = 3.08, w = 3.98, xs = [X0, 1.0, 5.27, 5.2], pxs = [X0, 3.48, 5.27, 7.68];
        rule(s, 0.29, ly, 9.42);
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], px = pxs[i], pw = 1.5, ph = 0.42, al = up ? 'left' : 'right';
          t.rect(s, px, ly - ph / 2 + 0.03, pw, ph, C.em, { line: { color: C.gold, width: 1.25 }, name: 'Plaque' });
          t.text(s, it.year, { x: px + 0.04, y: ly - ph / 2 + 0.03, w: pw - 0.08, h: ph, fontFace: F.head, bold: true, fontSize: L.fit(it.year, pw - 0.14, ph - 0.06, 14, 10, F.head, true), color: C.gold, align: 'center', valign: 'middle' });
          const yy = up ? 1.2 : ly + 0.32, hh = up ? ly - 0.28 - yy : Y1 - yy;
          head(s, it.h, x, yy, w, 0.32, { max: 13, align: al });
          small(s, it.t, x, yy + 0.33, w, hh - 0.33, { max: 13.5, align: al });
        });
      },
    ],
  };
  R.image = V.image.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Art Deco', colors: { dk1: C.ink, lt1: C.cream, dk2: C.em, lt2: 'EDE3CB', accent1: C.gold, accent2: C.em2, accent3: C.gold2, accent4: C.em, accent5: C.muted, accent6: 'B9B08F', hlink: C.gold2, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "tantanali va nafis: sarlavhalar qisqa va salmoqli, matn muloyim, rasmiy-badiiy", limits: { title: 40, card_h: 18, step_h: 18, event_h: 14 }, prefer: null };
module.exports = { id: 35, slug: 'art-deco', name: 'Art Deco', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "bold"], "transitions": ["p14:doors|dir=\"vert\"", "p14:gallery|dir=\"r\"", "fade"], "cover": ["split", "fadeLetters"], "mark": "diamond", "deco": "stretch", "sig": {"title": "split", "body": "fade", "item": "unfold", "image": "diamond", "number": "diamond", "order": "centerOut", "stagger": 0.18}, "tempo": 1.15, "kenburns": false};
