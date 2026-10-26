/**
 * 36 Piksel — 8-bit video game: notched pixel panels, pixelated photos and icons,
 * game-menu agenda, LEVEL steps, RPG dialog boxes, CREDITS for sources.
 */
const L = require('../lib.js');
const sharp = require('sharp');
const { W, H } = L;

const C = { bg: '1A1A33', panel: '2A2A50', white: 'F5F5F5', green: '4ADE80', yellow: 'FACC15', red: 'F87171', cyan: '38BDF8', purple: 'A78BFA', dim: '8080B0' };
const F = { head: 'Courier New', body: 'Courier New' };
const P = 0.07; // pixel size (inches)

const starsSvg = () => { let s = ''; let x = 7; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 70; i++) { const px = Math.floor(rnd() * 160) * 10, py = Math.floor(rnd() * 90) * 10, z = rnd() > 0.85 ? 10 : 5; s += `<rect x="${px}" y="${py}" width="${z}" height="${z}" fill="#${rnd() > 0.7 ? C.cyan : C.white}" opacity="${0.3 + rnd() * 0.5}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.bg}"/>${s}</svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const sky = await L.svg(starsSvg(), 1600, 900, true);
  const UP = (x) => String(x).toUpperCase();
  const iconCache = {};
  const pxIcon = async (name, color) => (iconCache[name + color] ??= await (async () => { // pixelated icon
    const b = Buffer.from((await L.icon(name, color, 3)).split(',')[1], 'base64');
    const small = await sharp(b).resize(16, 16, { kernel: 'nearest' }).toBuffer();
    return 'image/png;base64,' + (await sharp(small).resize(160, 160, { kernel: 'nearest' }).png().toBuffer()).toString('base64');
  })());
  // notched pixel panel: border colour + inner fill, corners cut by one pixel
  const panel = (s, x, y, w, h, border = C.white, fill = C.panel) => {
    t.rect(s, x + P, y, w - 2 * P, h, border, { name: 'Pixel border' }); t.rect(s, x, y + P, w, h - 2 * P, border, { name: 'Pixel border' });
    t.rect(s, x + P, y + P, w - 2 * P, h - 2 * P, fill, { name: 'Pixel panel' });
  };
  const footer = (s) => {
    t.rect(s, 0, 5.3, W, 0.325, '11112A', { name: 'Status bar' });
    t.text(s, UP(`${M.topic || ''}  |  ${meta}`), { x: 0.3, y: 5.3, w: 9.4, h: 0.325, fontSize: 8, bold: true, color: C.dim, valign: 'middle' });
  };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: sky }; idx++;
    if (d.title) t.text(s, [{ text: '\u25B6 ', options: { color: C.red } }, { text: UP(d.title), options: { color: C.yellow } }], { x: 0.5, y: 0.35, w: 7.6, h: 0.6, bold: true, valign: 'middle', fontSize: L.fit(UP(d.title), 7.2, 0.6, 22, 12, F.head, true) });
    t.text(s, `STAGE ${L.pad2(idx)}`, { x: 7.9, y: 0.35, w: 1.6, h: 0.6, fontSize: 13, bold: true, color: C.green, align: 'right', valign: 'middle' });
    footer(s);
    return s;
  };
  const pxPhoto = async (s, src, x, y, w, h) => { panel(s, x, y, w, h, C.cyan, C.bg); t.img(s, await L.photo(L.src(src), w - 4 * P, h - 4 * P, { pixel: 96 }), x + 2 * P, y + 2 * P, w - 4 * P, h - 4 * P, { alt: '' }); };
  const txt = (s, text, x, y, w, h, color = C.white) => t.text(s, text, { x, y, w, h, fontSize: L.fit(text, w, h, 14, 9, F.body, false, 1.25), color, lineSpacingMultiple: 1.25, valign: 'middle' });

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { data: sky }; idx++;
    if (d.image) await pxPhoto(s, d.image, 6.0, 0.5, 3.5, 2.8);
    t.text(s, UP([M.org, M.loc, M.year].filter(Boolean).join(' * ')), { x: 0.5, y: 0.55, w: 5.3, h: 0.3, fontSize: 12, bold: true, color: C.cyan });
    const T = UP(d.title), fs = L.fit(T, 5.3, 2.2, 32, 16, F.head, true);
    t.text(s, T, { x: 0.5, y: 0.95, w: 5.3, h: 2.3, fontSize: fs, bold: true, color: C.yellow, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.5, y: 3.4, w: 5.2, h: 0.8, fontSize: 12, color: C.white });
    panel(s, 6.0, 3.6, 3.5, 0.75, C.green, C.panel);
    t.text(s, UP(M.author || ''), { x: 6.1, y: 3.6, w: 3.3, h: 0.75, fontSize: 13, bold: true, color: C.green, align: 'center', valign: 'middle' });
    t.text(s, kind === 'cover' ? '\u25B6 PRESS START' : 'GAME OVER  \u2665 THANKS', { x: 0.5, y: 4.5, w: 5.3, h: 0.45, fontSize: 16, bold: true, color: C.red });
    footer(s);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = page(d); await pxPhoto(s, d.image, 0.5, 1.2, 4.2, 3.7); panel(s, 5.0, 1.2, 4.5, 3.7); txt(s, d.text, 5.3, 1.4, 3.9, 3.3); },
    async image(d) { const s = page(d); panel(s, 0.5, 1.2, 4.4, 3.7); txt(s, d.text, 0.8, 1.4, 3.8, 3.3); await pxPhoto(s, d.image, 5.2, 1.2, 4.3, 3.7); },
    async agenda(d) {
      const s = page(d); panel(s, 0.5, 1.2, 9.0, 3.8);
      const rh = Math.min(0.58, 3.4 / d.items.length);
      d.items.forEach((it, i) => t.text(s, [{ text: i === 0 ? '\u25B6 ' : '  ', options: { color: C.red } }, { text: `${i + 1}. `, options: { color: C.cyan } }, { text: UP(it), options: { color: i === 0 ? C.yellow : C.white } }],
        { x: 0.9, y: 1.4 + i * rh, w: 8.4, h: rh, fontSize: 16, bold: true, valign: 'middle' }));
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.2, w = (9.0 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * (w + gap), col = [C.green, C.cyan, C.purple, C.yellow][i % 4];
        panel(s, x, 1.2, w, 3.8, col);
        panel(s, x + 0.25, 1.45, 0.9, 0.9, col, C.bg);
        t.img(s, await pxIcon(it.icon, col), x + 0.38, 1.58, 0.64, 0.64);
        t.text(s, UP(it.h), { x: x + 0.25, y: 2.5, w: w - 0.5, h: 0.6, fontSize: L.fit(UP(it.h), w - 0.5, 0.6, 14, 9, F.head, true), bold: true, color: col });
        txt(s, it.t, x + 0.25, 3.15, w - 0.5, 1.7);
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      d.steps.forEach((st, i) => {
        const x = 0.5 + i * (w + gap), y = 1.2 + (n - 1 - i) * 0.25;
        panel(s, x, y, w, 3.8 - (n - 1 - i) * 0.25, i === n - 1 ? C.yellow : C.white);
        t.text(s, `LEVEL ${i + 1}`, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.4, fontSize: 13, bold: true, color: C.red });
        t.text(s, UP(st.h), { x: x + 0.2, y: y + 0.55, w: w - 0.4, h: 0.6, fontSize: L.fit(UP(st.h), w - 0.4, 0.6, 13, 9, F.head, true), bold: true, color: C.yellow });
        txt(s, st.t, x + 0.2, y + 1.2, w - 0.4, 3.8 - (n - 1 - i) * 0.25 - 1.4);
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, rh = (d.note ? 3.3 : 3.8) / n;
      d.stats.forEach((x, i) => {
        const y = 1.2 + i * rh, col = [C.green, C.cyan, C.yellow][i % 3];
        t.text(s, x.value, { x: 0.5, y, w: 2.4, h: rh - 0.15, fontSize: L.fit(x.value, 2.4, rh - 0.2, 36, 16, F.head, true), bold: true, color: col, valign: 'middle' });
        for (let k = 0; k < 14; k++) t.rect(s, 3.1 + k * 0.42, y + 0.12, 0.34, 0.26, col, { name: 'Bar block' });
        t.text(s, UP(x.label), { x: 3.1, y: y + 0.45, w: 6.3, h: rh - 0.55, fontSize: 12, bold: true, color: C.white, valign: 'top' });
      });
      if (d.note) t.text(s, d.note, { x: 0.5, y: 4.6, w: 9.0, h: 0.5, fontSize: 10, color: C.dim });
    },
    async compare(d) {
      const s = page(d), w = 4.35;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 13, w - 0.7, F.body) : 0))) + 0.18);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.5 + i * (w + 0.3), col = i ? C.cyan : C.red;
        panel(s, x, 1.2, w, 3.8, col);
        t.text(s, `P${i + 1}: ${UP(side.h)}`, { x: x + 0.25, y: 1.35, w: w - 0.5, h: 0.5, fontSize: 14, bold: true, color: col });
        let y = 2.0;
        side.items.forEach((it, k) => { t.rect(s, x + 0.3, y + 0.08, 0.14, 0.14, col, { name: 'Pixel bullet' }); t.text(s, it, { x: x + 0.55, y, w: w - 0.75, h: rows[k], fontSize: 13, color: C.white }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d); panel(s, 0.8, 1.3, 8.4, 2.4, C.yellow);
      t.text(s, L.runs(UP(d.text)), { x: 1.1, y: 1.45, w: 7.8, h: 2.1, fontSize: L.fit(UP(d.text), 7.8, 2.0, 28, 14, F.head, true), bold: true, color: C.yellow, align: 'center', valign: 'middle' });
      if (d.caption) txt(s, d.caption, 0.8, 3.9, 8.4, 1.1, C.white);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, cw = 9.0 / n;
      for (let k = 0; k < 60; k++) if (k % 2 === 0) t.rect(s, 0.5 + k * 0.15, 2.18, 0.1, 0.1, C.dim, { name: 'Path' });
      for (const [i, it] of d.items.entries()) {
        const x = 0.5 + i * cw;
        t.img(s, await pxIcon('FiFlag', [C.green, C.cyan, C.yellow, C.red][i % 4]), x, 1.55, 0.6, 0.6);
        t.text(s, it.year, { x: x + 0.65, y: 1.55, w: cw - 0.75, h: 0.6, fontSize: L.fit(it.year, cw - 0.8, 0.55, 20, 10, F.head, true), bold: true, color: C.yellow, valign: 'middle' });
        t.text(s, UP(it.h), { x, y: 2.5, w: cw - 0.25, h: 0.5, fontSize: L.fit(UP(it.h), cw - 0.3, 0.5, 13, 9, F.head, true), bold: true, color: C.cyan });
        txt(s, it.t, x, 3.05, cw - 0.25, 1.9);
      }
    },
    async quote(d) {
      const s = page({});
      panel(s, 0.6, 2.0, 8.8, 2.6, C.white, C.panel);
      if (d.author) { panel(s, 0.9, 1.6, Math.min(6, L.width(UP(d.author), 13, F.head, true) + 0.6), 0.6, C.yellow, C.bg); t.text(s, UP(d.author), { x: 1.1, y: 1.6, w: 5.8, h: 0.6, fontSize: 13, bold: true, color: C.yellow, valign: 'middle' }); }
      t.text(s, d.text, { x: 1.0, y: 2.35, w: 8.0, h: 1.9, fontSize: L.fit(d.text, 8.0, 1.85, 22, 12, F.body, true), bold: true, color: C.white, valign: 'middle' });
      t.text(s, '\u25BC', { x: 8.8, y: 4.2, w: 0.4, h: 0.3, fontSize: 14, color: C.red });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.55, 3.6 / n);
      t.text(s, '* * *  CREDITS  * * *', { x: 0.5, y: 1.15, w: 9, h: 0.35, fontSize: 14, bold: true, color: C.green, align: 'center' });
      d.items.forEach((it, i) => t.text(s, it, { x: 0.8, y: 1.6 + i * rh, w: 8.4, h: rh, fontSize: L.fit(it, 8.4, rh - 0.04, 13, 9, F.body), color: C.white, align: 'center', valign: 'middle' }));
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Piksel', colors: { dk1: C.bg, lt1: C.white, dk2: C.panel, lt2: C.dim, accent1: C.yellow, accent2: C.green, accent3: C.cyan, accent4: C.red, accent5: C.purple, accent6: C.dim, hlink: C.cyan, folHlink: C.dim } });
}
/** Uslub pasporti */
const STYLE = { tone: "o'yin tilida qiziqarli: qisqa, harakatga undovchi iboralar; mavzu jiddiyligini saqla", limits: { title: 40, card_h: 16, step_h: 16, card_t3: 75, card_t4: 55, event_h: 14, stmt: 55 }, prefer: null };
module.exports = { id: 36, slug: 'piksel', name: 'Piksel', category: 'creative', photos: true, build, style: STYLE };
