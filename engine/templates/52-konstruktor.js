/**
 * 52 Konstruktor — building bricks: primary-coloured bricks with studs, stacked towers for
 * steps, a green baseplate band, white flat tiles carrying the text.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F4F4EF', plate: '237841', ink: '1B2A34', muted: '55636E', white: 'FFFFFF', bricks: ['D01012', 'F2CD37', '0055BF', '237841', 'FE8A18', 'A0A5A9'] };
const F = { head: 'Arial', body: 'Arial' };
const shade = (hex, k) => { const n = parseInt(hex, 16), r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k); return [r, g, b].map((v) => Math.min(255, v).toString(16).padStart(2, '0')).join(''); };
const brickSvg = (w, h, color, studs) => { // w, h in px of the body; studs on top
  const sh = 14, d = Math.min(46, w / studs * 0.62); let st = '';
  for (let k = 0; k < studs; k++) { const cx = (w / studs) * (k + 0.5); st += `<rect x="${cx - d / 2}" y="2" width="${d}" height="${sh}" rx="3" fill="#${shade(color, 0.85)}"/><ellipse cx="${cx}" cy="2" rx="${d / 2}" ry="5" fill="#${shade(color, 1.15)}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h + sh}">${st}<rect x="0" y="${sh}" width="${w}" height="${h}" rx="4" fill="#${color}"/><rect x="0" y="${sh + h - 10}" width="${w}" height="10" rx="3" fill="#${shade(color, 0.78)}"/><rect x="0" y="${sh}" width="${w}" height="5" fill="#${shade(color, 1.18)}" opacity="0.7"/></svg>`;
};
const plateSvg = (w) => { let st = ''; for (let x = 20; x < w; x += 40) st += `<circle cx="${x}" cy="20" r="11" fill="#${shade(C.plate, 1.12)}"/><circle cx="${x}" cy="22" r="11" fill="none" stroke="#${shade(C.plate, 0.8)}" stroke-width="2"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="40"><rect width="${w}" height="40" fill="#${C.plate}"/>${st}</svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  // brick at x,y with body w x h (inches); studs drawn above y
  const brick = async (s, x, y, w, h, k, studs) => {
    const n = studs || Math.max(1, Math.round(w / 0.42)), key = `${w}x${h}${k}${n}`;
    t.img(s, (memo[key] ??= await L.svg(brickSvg(Math.round(w * 100), Math.round(h * 100), C.bricks[k % 6], n), w * 100, h * 100 + 14)), x, y - 0.14, w, h + 0.14);
  };
  const tile = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.white, { r: 0.06, line: { color: 'DADBD3', width: 1 }, shadow: 0.12, blur: 4, offset: 2, name: 'Tile' });
  const onBrick = (k) => ([1, 4, 5].includes(k % 6) ? C.ink : C.white);
  const plate = await L.svg(plateSvg(1600), 1600, 40);
  const footer = (s) => { t.img(s, plate, 0, 5.3, W, 0.325); t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.4, y: 5.3, w: 9.2, h: 0.325, fontSize: 8, bold: true, color: C.white, valign: 'middle' }); };
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await brick(s, 0.5, 0.45, 0.84, 0.55, idx, 2);
    t.text(s, String(idx), { x: 0.5, y: 0.45, w: 0.84, h: 0.5, fontSize: 18, bold: true, color: onBrick(idx), align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.55, y: 0.38, w: 7.9, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.7, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
  const framed = async (s, src, x, y, w, h, k) => { await brick(s, x, y, w, h, k); t.img(s, await L.photo(L.src(src), w - 0.3, h - 0.38), x + 0.15, y + 0.12, w - 0.3, h - 0.38, { alt: '' }); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    if (d.image) await framed(s, d.image, 5.9, 0.75, 3.5, 2.75, 2);
    await brick(s, 5.9, 3.85, 1.68, 0.5, 0); await brick(s, 7.7, 3.85, 0.84, 0.5, 1); await brick(s, 8.62, 3.85, 0.84, 0.5, 3); await brick(s, 6.75, 4.5, 2.52, 0.5, 4);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u25A0  '), { x: 0.6, y: 0.7, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.bricks[2] });
    t.text(s, d.title, { x: 0.6, y: 1.05, w: 5.1, h: 2.3, bold: true, fontSize: L.fit(d.title, 5.1, 2.2, 40, 22, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.45, w: 5.0, h: 0.8, fontSize: 14, color: C.muted });
    await brick(s, 0.6, 4.45, Math.min(5.0, Math.max(2.5, L.width(M.author || ' ', 15, F.head, true) + 0.6)), 0.55, 0);
    t.text(s, M.author || '', { x: 0.85, y: 4.45, w: 4.6, h: 0.5, fontSize: 15, bold: true, color: C.white, valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await framed(s, d.image, 0.6, 1.5, 4.1, 3.4, 1); tile(s, 5.0, 1.4, 4.45, 3.6); para(s, d.text, 5.25, 1.55, 3.95, 3.3); },
    async image(d) { const s = await page(d); tile(s, 0.55, 1.4, 4.45, 3.6); para(s, d.text, 0.8, 1.55, 3.95, 3.3); await framed(s, d.image, 5.3, 1.5, 4.15, 3.4, 3); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.5 + (i % per) * rh;
        await brick(s, x, y, 0.84, 0.55, i, 2);
        t.text(s, String(i + 1), { x, y, w: 0.84, h: 0.5, fontSize: 17, bold: true, color: onBrick(i), align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 1.0, y: y - 0.05, w: 3.3, h: 0.65, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.2, w = (8.9 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.55 + i * (w + gap);
        await brick(s, x, 1.5, w, 0.6, i);
        t.img(s, await L.icon(it.icon, onBrick(i), 2.25), x + 0.2, 1.6, 0.36, 0.36);
        t.text(s, it.h, { x: x + 0.65, y: 1.5, w: w - 0.75, h: 0.55, fontSize: L.fit(it.h, w - 0.75, 0.55, 15, 10, F.head, true), bold: true, color: onBrick(i), valign: 'middle' });
        tile(s, x, 2.2, w, 2.8);
        t.text(s, it.t, { x: x + 0.2, y: 2.35, w: w - 0.4, h: 2.5, fontSize: 14, color: C.ink });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.9 / n;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.55 + i * cw;
        for (let k = 0; k <= i; k++) await brick(s, x, 2.2 - k * 0.32, 0.84, 0.3, i, 2);
        t.text(s, String(i + 1), { x: x + 0.95, y: 2.2 - i * 0.32 - 0.1, w: 0.6, h: 0.5, fontSize: 20, bold: true, color: C.bricks[i % 6] });
        t.text(s, st.h, { x, y: 2.65, w: cw - 0.2, h: 0.5, fontSize: L.fit(st.h, cw - 0.2, 0.5, 16, 11, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 3.15, w: cw - 0.2, h: 1.95, fontSize: 14, color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.9 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.55 + i * cw;
        await brick(s, px, 1.6, cw - 0.3, 1.25, i * 2);
        t.text(s, x.value, { x: px + 0.15, y: 1.6, w: cw - 0.6, h: 1.15, fontSize: L.fit(x.value, cw - 0.7, 0.95, 48, 22, F.head, true), bold: true, color: onBrick(i * 2), align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.0, w: cw - 0.3, h: 1.15, fontSize: 14, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.55, y: 4.3, w: 8.9, h: 0.8, fontSize: 11, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.35;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.95 - 2.35);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.55 + i * (w + 0.2), k = i ? 2 : 0;
        await brick(s, x, 1.5, w, 0.6, k);
        t.text(s, side.h, { x: x + 0.25, y: 1.5, w: w - 0.5, h: 0.55, fontSize: 17, bold: true, color: C.white, valign: 'middle' });
        tile(s, x, 2.2, w, 2.85);
        let y = 2.35;
        side.items.forEach((it, j) => { t.rect(s, x + 0.25, y + 0.07, 0.16, 0.16, C.bricks[k], { name: 'Stud' }); t.text(s, it, { x: x + 0.55, y, w: w - 0.75, h: rows[j], fontSize: fs, color: C.ink }); y += rows[j]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await brick(s, 0.8, 1.45, 8.4, 2.3, 1);
      t.text(s, L.runs(d.text), { x: 1.2, y: 1.5, w: 7.6, h: 2.1, bold: true, fontSize: L.fit(d.text, 7.6, 2.0, 34, 18, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.8, y: 3.9, w: 8.4, h: 1.2, fontSize: 14, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.9 / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.55 + i * cw;
        await brick(s, x, 1.55, cw - 0.06, 0.6, i);
        t.text(s, it.year, { x: x + 0.1, y: 1.55, w: cw - 0.26, h: 0.55, fontSize: L.fit(it.year, cw - 0.3, 0.5, 22, 11, F.head, true), bold: true, color: onBrick(i), align: 'center', valign: 'middle' });
        t.text(s, it.h, { x, y: 2.35, w: cw - 0.2, h: 0.5, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 2.85, w: cw - 0.2, h: 2.25, fontSize: 14, color: C.muted });
      }
    },
    async quote(d) {
      const s = await page({});
      tile(s, 0.9, 1.0, 8.2, 3.4);
      await brick(s, 0.9, 1.0, 1.26, 0.5, 0, 3);
      t.text(s, d.text, { x: 1.3, y: 1.6, w: 7.4, h: 2.1, bold: true, fontSize: L.fit(d.text, 7.4, 2.0, 30, 16, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.3, y: 3.8, w: 7.4, h: 0.45, fontSize: 14, color: C.bricks[2], bold: true, align: 'center' });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.6, 3.7 / n);
      for (const [i, it] of d.items.entries()) {
        const y = 1.45 + i * rh;
        await brick(s, 0.55, y + (rh - 0.3) / 2, 0.42, 0.28, i, 1);
        t.text(s, it, { x: 1.15, y, w: 8.3, h: rh, fontSize: 14, color: C.ink, valign: 'middle' });
      }
    },
  };
  // ---- further ways to draw a type, all snapped from the same box of bricks: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const plateBg = await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${shade(C.plate, 0.82)}"/>${Array.from({ length: 800 }, (_, k) => `<circle cx="${(k % 40) * 40 + 20}" cy="${Math.floor(k / 40) * 45 + 22}" r="11" fill="#${shade(C.plate, 0.92)}"/>`).join('')}</svg>`, 1600, 900, true);
  const baseplate = async (d) => { // the whole page is the green baseplate
    const s = pres.addSlide(); s.background = { data: plateBg }; idx++;
    await brick(s, 0.5, 0.45, 0.84, 0.55, 1, 2);
    t.text(s, String(idx), { x: 0.5, y: 0.45, w: 0.84, h: 0.5, fontSize: 18, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    t.text(s, d.title, { x: 1.55, y: 0.38, w: 7.9, h: 0.7, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.7, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const tower = async (s, cx, top, bot, w = 0.84) => { const n = Math.floor((bot - top) / 0.34); for (let k = 0; k < n; k++) await brick(s, cx - w / 2, bot - 0.32 - k * 0.34, w, 0.3, [0, 1, 2, 4][k % 4], 2); };
  const V = {
    image: [
      async (d) => { // text on a long flat tile, the picture one wide brick laid under it on the plate
        const s = await page(d);
        tile(s, 0.55, 1.28, 8.9, 1.62);
        t.text(s, d.text, { x: 0.75, y: 1.34, w: 8.5, h: 1.5, fontSize: L.fit(d.text, 8.5, 1.5, 14, 10, F.body, false, 1.1), color: C.ink, lineSpacingMultiple: 1.1, valign: 'middle' });
        await framed(s, d.image, 0.55, 3.14, 8.9, 2.1, 2);
      },
      async (d) => { // on the baseplate: the picture is one giant round stud, words on a tile
        const s = await baseplate(d), dd = 3.7, x = 5.75, y = 1.34;
        t.oval(s, x - 0.1, y - 0.04, dd + 0.2, dd + 0.2, shade(C.bricks[1], 0.8));
        t.oval(s, x - 0.1, y - 0.12, dd + 0.2, dd + 0.2, C.bricks[1]);
        t.img(s, await L.photo(L.src(d.image), dd - 0.1, dd - 0.1, { mask: 'circle' }), x + 0.05, y - 0.02, dd - 0.1, dd - 0.1, { alt: '' });
        tile(s, 0.55, 1.34, 4.9, 3.78);
        t.text(s, d.text, { x: 0.75, y: 1.44, w: 4.5, h: 3.58, fontSize: L.fit(d.text, 4.5, 3.58, 14, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, one long yellow brick and a tile sit on its foot
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, 5.3), 0, 0, W, 5.3, { alt: '' });
        await brick(s, 0.4, 2.4, 9.2, 0.72, 1);
        t.text(s, String(idx), { x: 0.55, y: 2.4, w: 0.6, h: 0.66, bold: true, color: C.ink, fontSize: 20, align: 'center', valign: 'middle' });
        t.text(s, d.title, { x: 1.2, y: 2.42, w: 8.2, h: 0.62, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.2, 0.6, 22, 13, F.head, true) });
        tile(s, 0.4, 3.18, 9.2, 2.04);
        t.text(s, d.text, { x: 0.6, y: 3.24, w: 8.8, h: 1.92, fontSize: L.fit(d.text, 8.8, 1.92, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
        footer(s);
      },
      async (d) => { // the picture rebuilt as a mosaic of little square bricks
        const s = await page(d), w = 4.55, h = 3.5;
        await brick(s, 4.9, 1.46, w, h + 0.2, 0);
        t.img(s, await L.photo(L.src(d.image), w - 0.26, h - 0.1, { pixel: 44 }), 5.03, 1.56, w - 0.26, h - 0.1, { alt: '' });
        t.text(s, d.text, { x: 0.55, y: 1.36, w: 4.1, h: 3.84, fontSize: L.fit(d.text, 4.1, 3.84, 14, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a stack of long tiles, each pinned on by one coloured brick
        const s = await page(d), n = d.items.length, h = 3.84 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.34 + i * h, bh = Math.min(0.72, h - 0.28);
          tile(s, 1.2, y + 0.03, 8.25, h - 0.1);
          await brick(s, 0.55, y + (h - bh) / 2 + 0.03, 1.26, bh, i, 3);
          t.img(s, await L.icon(it.icon, onBrick(i), 2.25), 0.55 + 0.63 - 0.17, y + (h - bh) / 2 + bh / 2 - 0.15, 0.34, 0.34);
          head(s, it.h, 1.95, y + 0.06, 2.45, h - 0.16, { max: 15 });
          body(s, it.t, 4.5, y + 0.07, 4.8, h - 0.18, { valign: 'middle', max: 13 });
        }
      },
      async (d) => { // the baseplate: flat white tiles clicked on two by two
        const s = await baseplate(d), n = d.items.length, w = 4.35, h = 1.8;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.9 : w, x = 0.55 + (i % 2) * (w + 0.2), y = 1.38 + Math.floor(i / 2) * (h + 0.12), k = [2, 0, 4, 1][i];
          tile(s, x, y, ww, h);
          await brick(s, x + 0.15, y + 0.2, 0.62, 0.42, k, 2);
          t.img(s, await L.icon(it.icon, onBrick(k), 2.25), x + 0.33, y + 0.26, 0.26, 0.26);
          head(s, it.h, x + 0.9, y + 0.08, ww - 1.02, 0.56, { max: 15 });
          body(s, it.t, x + 0.16, y + 0.7, ww - 0.32, h - 0.78);
        }
      },
      async (d) => { // a wall in running bond: big and small bricks, joints never in line
        const s = await page(d), n = d.items.length, h = 1.76, ws = n === 3 ? [[5.2, 3.6], [8.9]] : [[5.2, 3.6], [3.6, 5.2]];
        let i = 0;
        for (const [r, row] of ws.entries()) {
          let x = 0.55;
          for (const w of row) {
            const it = d.items[i], k = [2, 1, 0, 3][i], y = 1.48 + r * (h + 0.14), ink = onBrick(k);
            await brick(s, x, y, w, h, k);
            t.img(s, await L.icon(it.icon, ink, 2.25), x + 0.16, y + 0.12, 0.34, 0.34);
            head(s, it.h, x + 0.58, y + 0.06, w - 0.72, 0.46, { max: 15, color: ink });
            body(s, it.t, x + 0.16, y + 0.56, w - 0.32, h - 0.72, { color: ink });
            x += w + 0.1; i++;
          }
        }
      },
      async (d) => { // one tall tower in the middle, a tile clipped to it on either side
        const s = await page(d), n = d.items.length, w = 3.72, h = 1.8;
        await tower(s, 5, 1.42, 5.22, 1.0);
        const spots = n === 3 ? [[0.55, 1.42, 0], [0.55, 3.34, 0], [5.73, 2.38, 1]] : [[0.55, 1.42, 0], [5.73, 1.42, 1], [0.55, 3.34, 0], [5.73, 3.34, 1]];
        for (const [i, it] of d.items.entries()) {
          const [x, y] = spots[i];
          tile(s, x, y, w, h);
          t.img(s, await L.icon(it.icon, C.bricks[[0, 2, 3, 4][i]], 2.25), x + 0.14, y + 0.1, 0.32, 0.32);
          head(s, it.h, x + 0.54, y + 0.05, w - 0.66, 0.44, { max: 14 });
          body(s, it.t, x + 0.14, y + 0.54, w - 0.28, h - 0.62);
        }
      },
    ],
    process: [
      async (d) => { // the staircase: every tile higher up on a higher pile of bricks
        const s = await page(d), n = d.steps.length, w = 8.9 / n, low = 3.36, high = 1.36, h = 1.82;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.55 + i * w, y = low - i * ((low - high) / (n - 1)), tw = w - 0.08;
          for (let by = 5.0; by >= y + h - 0.06; by -= 0.32) await brick(s, x, by, tw, 0.3, i, Math.max(2, Math.round(tw / 0.5)));
          tile(s, x, y, tw, h);
          await brick(s, x + 0.1, y + 0.16, 0.42, 0.3, i, 1);
          t.text(s, String(i + 1), { x: x + 0.1, y: y + 0.16, w: 0.42, h: 0.28, bold: true, fontSize: 12, color: onBrick(i), align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.58, y + 0.04, tw - 0.66, 0.44, { max: 13 });
          body(s, st.t, x + 0.1, y + 0.52, tw - 0.2, h - 0.58);
        }
      },
      async (d) => { // a tower up the middle, each step sticks out to one side of it
        const s = await page(d), n = d.steps.length, gap = n === 4 ? 0.96 : 1.28, h = n === 4 ? 1.12 : 1.22, w = 3.82, cx = 5;
        await tower(s, cx, 1.34, 5.22, 0.84);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.38 + i * gap, x = right ? cx + 0.55 : cx - 0.55 - w, a = right ? 'left' : 'right';
          t.oval(s, cx - 0.3, y + 0.1, 0.6, 0.6, C.white, { line: { color: C.ink, width: 1.5 } });
          t.text(s, String(i + 1), { x: cx - 0.3, y: y + 0.1, w: 0.6, h: 0.6, bold: true, fontSize: 18, color: C.ink, align: 'center', valign: 'middle' });
          tile(s, x, y, w, h);
          head(s, st.h, x + 0.14, y + 0.04, w - 0.28, 0.36, { align: a, max: 14 });
          body(s, st.t, x + 0.14, y + 0.42, w - 0.28, h - 0.48, { align: a });
        }
      },
      async (d) => { // long bricks laid one upon another, every course a step
        const s = await page(d), n = d.steps.length, h = 3.86 / n - 0.13, ks = [0, 2, 3, 4];
        for (const [i, st] of d.steps.entries()) {
          const y = 1.48 + i * (h + 0.13), k = ks[i], ink = onBrick(k), hh = +h.toFixed(2);
          await brick(s, 0.4, y, 9.2, hh, k);
          t.text(s, String(i + 1), { x: 0.55, y, w: 0.72, h: hh - 0.08, bold: true, fontSize: 28, color: ink, align: 'center', valign: 'middle' });
          head(s, st.h, 1.35, y + 0.03, 2.65, hh - 0.14, { color: ink, max: 15 });
          body(s, st.t, 4.1, y + 0.03, 5.3, hh - 0.14, { color: ink, valign: 'middle' });
        }
      },
    ],
    stats: [
      async (d) => { // one number gets the great red brick, the others small ones beside it
        const s = await page(d), [a, ...rest] = d.stats;
        await brick(s, 0.55, 1.5, 4.9, 3.66, 0);
        t.text(s, a.value, { x: 0.8, y: 1.76, w: 4.4, h: 1.5, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 4.3, 1.4, 66, 26, F.head, true) });
        body(s, a.label, 1.05, 3.34, 3.9, 1.5, { color: C.white, align: 'center', max: 15 });
        for (const [i, v] of rest.entries()) {
          const y = 1.5 + i * 1.08, k = i ? 2 : 1;
          await brick(s, 5.65, y, 1.84, 0.88, k, 4);
          t.text(s, v.value, { x: 5.72, y, w: 1.7, h: 0.8, bold: true, color: onBrick(k), align: 'center', valign: 'middle', fontSize: L.fit(v.value, 1.62, 0.7, 26, 13, F.head, true) });
          body(s, v.label, 7.6, y - 0.08, 1.85, 0.98, { valign: 'middle', max: 12 });
        }
        if (d.note) body(s, d.note, 5.65, 3.62, 3.8, 1.56, { color: C.muted, max: 12, valign: 'middle' });
      },
      async (d) => { // the baseplate: three great round studs, a number stamped on each
        const s = await baseplate(d), cw = 8.9 / 3, dd = 1.78;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.55 + i * cw, px = x + (cw - dd) / 2, k = [1, 0, 2][i], y = 1.3;
          t.oval(s, px, y + 0.1, dd, dd, shade(C.bricks[k], 0.75));
          t.oval(s, px, y, dd, dd, C.bricks[k], { line: { color: shade(C.bricks[k], 1.15), width: 2 } });
          t.text(s, v.value, { x: px + 0.1, y, w: dd - 0.2, h: dd, bold: true, color: onBrick(k), align: 'center', valign: 'middle', fontSize: L.fit(v.value, dd - 0.3, 0.9, 32, 14, F.head, true) });
          body(s, v.label, x + 0.12, y + dd + 0.16, cw - 0.24, 0.7, { color: C.white, align: 'center' });
        }
        tile(s, 0.55, 4.02, 8.9, 1.14);
        if (d.note) body(s, d.note, 0.75, 4.08, 8.5, 1.02, { valign: 'middle', max: 12 });
      },
    ],
    compare: [
      async (d) => { // mirrored about one tower, red to the left and blue to the right
        const s = await page(d), w = 3.95, cx = 5;
        await tower(s, cx, 1.34, 5.22, 0.64);
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.3, F.body, 0.2, 2.85);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.45 : cx - 0.45 - w, a = i ? 'left' : 'right', k = i ? 2 : 0;
          await brick(s, x, 1.5, w, 0.6, k);
          head(s, side.h, x + 0.16, 1.5, w - 0.32, 0.52, { align: a, color: C.white, max: 17 });
          let y = 2.28;
          side.items.forEach((it, j) => {
            t.rect(s, i ? x : x + w - 0.16, y + 0.05, 0.16, 0.16, C.bricks[k], { name: 'Stud' });
            t.text(s, it, { x: i ? x + 0.3 : x, y, w: w - 0.3, h: rows[j], fontSize: fs, color: C.ink, align: a });
            y += rows[j];
          });
        }
      },
      async (d) => { // two courses of bricks, one above the other, a yellow name brick on each
        const s = await page(d), h = 1.74;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.5 + i * (h + 0.14), k = i ? 2 : 0, rh = (h - 0.2) / Math.ceil(side.items.length / 2);
          await brick(s, 0.4, y, 9.2, h, k);
          await brick(s, 0.56, y + 0.3, 2.4, h - 0.6, 1, 6);
          head(s, side.h, 0.68, y + 0.32, 2.16, h - 0.72, { max: 16, align: 'center' });
          side.items.forEach((it, j) => body(s, it, 3.15 + (j % 2) * 3.2, y + 0.06 + Math.floor(j / 2) * rh, 3.05, rh - 0.05, { color: C.white, valign: 'middle', max: 13 }));
        }
      },
    ],
    statement: [
      async (d) => { // the baseplate: big white words, a little tower built beside them
        const s = await baseplate(d);
        await tower(s, 8.7, 1.5, 5.22, 1.26);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 7.2, h: 2.4, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 7.2, 2.35, 36, 17, F.head, true) });
        if (d.caption) body(s, d.caption, 0.6, 3.82, 7.2, 1.36, { color: C.white, max: 14 });
      },
      async (d) => { // the words on one great blue brick, the note on a tile clipped beside it
        const s = await page(d);
        await brick(s, 3.75, 1.5, 5.7, 3.66, 2);
        t.text(s, L.runs(d.text), { x: 4.0, y: 1.58, w: 5.2, h: 3.4, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 5.2, 3.35, 32, 16, F.head, true) });
        tile(s, 0.55, 1.5, 3.0, 3.66);
        if (d.caption) body(s, d.caption, 0.72, 1.6, 2.66, 3.46, { valign: 'middle' });
      },
    ],
    timeline: [
      async (d) => { // a strip of baseplate across the page, years stand on it and hang from it
        const s = await page(d), axis = 3.08, w = 3.7;
        t.img(s, plate, 0, axis, W, 0.3);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = up ? 0.55 + (i / 2) * 4.45 : 1.75 + ((i - 1) / 2) * 4.45, k = [0, 2, 1, 4][i];
          if (up) {
            await brick(s, x, axis - 0.42, 1.68, 0.42, k, 4);
            t.text(s, it.year, { x: x + 0.05, y: axis - 0.42, w: 1.58, h: 0.38, bold: true, color: onBrick(k), align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.5, 0.34, 15, 10, F.head, true) });
            head(s, it.h, x, 1.28, w, 0.34, { max: 13 });
            body(s, it.t, x, 1.62, w, 0.96, {});
          } else {
            await brick(s, x, axis + 0.44, 1.68, 0.42, k, 4);
            t.text(s, it.year, { x: x + 0.05, y: axis + 0.44, w: 1.58, h: 0.38, bold: true, color: onBrick(k), align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.5, 0.34, 15, 10, F.head, true) });
            head(s, it.h, x + 1.75, axis + 0.44, w - 1.75, 0.38, { max: 12 });
            body(s, it.t, x, axis + 0.92, w, 1.22, {});
          }
        }
      },
      async (d) => { // the baseplate: four tiles stepping down, each started by a brick
        const s = await baseplate(d), h = 0.84;
        for (const [i, it] of d.items.entries()) {
          const x = 0.55 + i * 0.3, y = 1.36 + i * 0.96, w = 8.0, k = [0, 1, 2, 4][i];
          tile(s, x + 1.5, y, w - 1.5, h);
          await brick(s, x, y + 0.02, 1.66, h - 0.04, k, 4);
          t.text(s, it.year, { x: x + 0.05, y: y + 0.02, w: 1.56, h: h - 0.1, bold: true, color: onBrick(k), align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.46, 0.55, 18, 10, F.head, true) });
          head(s, it.h, x + 1.78, y + 0.05, 1.7, h - 0.1, { max: 13 });
          body(s, it.t, x + 3.55, y + 0.05, w - 3.68, h - 0.1, { max: 12, valign: 'middle' });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Konstruktor', colors: { dk1: C.ink, lt1: C.white, dk2: '33414B', lt2: C.bg, accent1: C.bricks[0], accent2: C.bricks[1], accent3: C.bricks[2], accent4: C.bricks[3], accent5: C.bricks[4], accent6: C.bricks[5], hlink: C.bricks[2], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "qurilish bloklari kabi: har bir fikr aniq 'g'isht', bosqichma-bosqich, sodda va tushunarli", limits: {}, prefer: 'data' };
module.exports = { id: 52, slug: 'konstruktor', name: 'Konstruktor', category: 'creative', photos: true, build, style: STYLE };
