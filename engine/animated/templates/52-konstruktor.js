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
  const onBrick = (k) => ([1, 5].includes(k % 6) ? C.ink : C.white);
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Konstruktor', colors: { dk1: C.ink, lt1: C.white, dk2: '33414B', lt2: C.bg, accent1: C.bricks[0], accent2: C.bricks[1], accent3: C.bricks[2], accent4: C.bricks[3], accent5: C.bricks[4], accent6: C.bricks[5], hlink: C.bricks[2], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "qurilish bloklari kabi: har bir fikr aniq 'g'isht', bosqichma-bosqich, sodda va tushunarli", limits: {}, prefer: 'data' };
module.exports = { id: 52, slug: 'konstruktor', name: 'Konstruktor', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "energetic"], "transitions": ["p14:pan|dir=\"u\"", "push:d", "p14:ferris|dir=\"l\""], "cover": ["bounceDrop", "riseSettle"], "mark": "bounceDrop", "deco": "bounceDrop", "sig": {"title": "bounceDrop", "body": "fadeUp", "item": "bounceDrop", "image": "bounceDrop", "number": "popOver", "order": "diagonal", "stagger": 0.1}, "tempo": 0.85, "kenburns": false};
