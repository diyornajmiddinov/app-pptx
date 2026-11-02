/**
 * 56 Pazl — jigsaw puzzle: every block is a puzzle piece with real knobs and sockets;
 * neighbouring ideas interlock, the photo is cut as a piece, colours from a calm palette.
 */
const L = require('../lib.js');
const sharp = require('sharp');
const { W, H } = L;

const C = { bg: 'F2EFE9', ink: '1F2A30', muted: '5C666B', white: 'FFFFFF', pieces: ['2A9D8F', 'E9C46A', 'F4A261', 'E76F51', '264653', '8ECAE6'] };
const F = { head: 'Arial', body: 'Calibri' };
const light = (k) => [1, 2, 5].includes(k % 6);

// puzzle-piece outline in a W x H box; the body is inset by m on every side so knobs fit.
// edges: [top, right, bottom, left] with 1 = knob out, -1 = socket in, 0 = flat
const piecePath = (Wd, Ht, m, [tp, rt, bt, lf]) => {
  const x0 = m, y0 = m, x1 = Wd - m, y1 = Ht - m, r = m * 0.55, neck = r * 0.6; // knob stays inside the margin m
  // the outline runs clockwise, so a knob (bulge outwards) is always sweep 1 and a socket sweep 0
  const h = (xa, xb, y, e, dir) => { if (!e) return `L${xb},${y}`; const mid = (xa + xb) / 2; return `L${mid - neck * dir},${y} A${r},${r} 0 1 ${e > 0 ? 1 : 0} ${mid + neck * dir},${y} L${xb},${y}`; };
  const v = (ya, yb, x, e, dir) => { if (!e) return `L${x},${yb}`; const mid = (ya + yb) / 2; return `L${x},${mid - neck * dir} A${r},${r} 0 1 ${e > 0 ? 1 : 0} ${x},${mid + neck * dir} L${x},${yb}`; };
  return `M${x0},${y0} ${h(x0, x1, y0, tp, 1)} ${v(y0, y1, x1, rt, 1)} ${h(x1, x0, y1, bt, -1)} ${v(y1, y0, x0, lf, -1)} Z`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  // draws a piece whose BODY is x,y,w,h (inches); knobs extend by m around it
  const piece = async (s, x, y, w, h, k, edges, m = 0.22) => {
    const key = `${w}${h}${k}${edges}${m}`, Wd = Math.round((w + 2 * m) * 100), Ht = Math.round((h + 2 * m) * 100);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Wd}" height="${Ht}"><path d="${piecePath(Wd, Ht, m * 100, edges)}" fill="#${C.pieces[k % 6]}" stroke="#${C.ink}" stroke-opacity="0.25" stroke-width="3"/><path d="${piecePath(Wd, Ht, m * 100, edges)}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="2" transform="translate(2 2)"/></svg>`;
    t.img(s, (memo[key] ??= await L.svg(svg, Wd, Ht)), x - m, y - m, w + 2 * m, h + 2 * m);
  };
  // photo cut to a piece: composite the photo with the piece outline (drawn at pixel size) as an alpha mask
  const photoPiece = async (s, src, x, y, w, h, edges, m = 0.3) => {
    const Wd = w + 2 * m, Ht = h + 2 * m, uri = await L.photo(L.src(src), Wd, Ht);
    const buf = Buffer.from(uri.split(',')[1], 'base64'), { width, height } = await sharp(buf).metadata();
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path d="${piecePath(width, height, m * width / Wd, edges)}" fill="#fff"/></svg>`);
    const png = await sharp(buf).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
    t.img(s, 'image/png;base64,' + png.toString('base64'), x - m, y - m, Wd, Ht, { alt: '' });
  };
  const fg = (k) => (light(k) ? C.ink : C.white);
  const footer = (s) => t.text(s, `${M.topic || ''}   \u25C6   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await piece(s, 0.6, 0.45, 0.6, 0.55, idx, [0, 1, 0, 0], 0.15);
    t.text(s, String(idx), { x: 0.6, y: 0.45, w: 0.6, h: 0.55, fontSize: 16, bold: true, color: fg(idx), align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.55, y: 0.38, w: 7.9, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.7, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h, color = C.ink) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await piece(s, 5.75, 0.6, 1.85, 1.9, 0, [0, 1, -1, 0]); await piece(s, 7.6, 0.6, 1.85, 1.9, 1, [0, 0, 1, -1]);
    await piece(s, 5.75, 2.5, 1.85, 1.9, 3, [1, -1, 0, 0]);
    if (d.image) await photoPiece(s, d.image, 7.6, 2.5, 1.85, 1.9, [-1, 0, 0, 1]); else await piece(s, 7.6, 2.5, 1.85, 1.9, 4, [-1, 0, 0, 1]);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u25C6  '), { x: 0.6, y: 0.7, w: 4.9, h: 0.3, fontSize: 12, bold: true, color: C.pieces[0] });
    t.text(s, d.title, { x: 0.6, y: 1.05, w: 4.9, h: 2.3, bold: true, fontSize: L.fit(d.title, 4.9, 2.2, 40, 20, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.45, w: 4.8, h: 0.8, fontSize: 14, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.35, w: 4.8, h: 0.45, fontSize: 16, bold: true, color: C.pieces[3] });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await photoPiece(s, d.image, 0.9, 1.65, 3.4, 3.05, [0, 1, 0, 0]); para(s, d.text, 5.0, 1.4, 4.45, 3.6); },
    async image(d) { const s = await page(d); para(s, d.text, 0.6, 1.4, 4.4, 3.6); await photoPiece(s, d.image, 5.75, 1.65, 3.4, 3.05, [0, 0, 0, -1]); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.75 + Math.floor(i / per) * 4.45, y = 1.5 + (i % per) * rh;
        await piece(s, x, y, 0.55, 0.55, i, [0, 1, i % per < per - 1 ? 1 : 0, 0], 0.13);
        t.text(s, String(i + 1), { x, y, w: 0.55, h: 0.55, fontSize: 15, bold: true, color: fg(i), align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y: y - 0.05, w: 3.35, h: 0.65, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, m = 0.22, w = (8.6 - 0.02 * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + i * (w + 0.02), k = i;
        await piece(s, x, 1.5, w, 3.45, k, [0, i < n - 1 ? 1 : 0, 0, i > 0 ? -1 : 0], m);
        t.img(s, await L.icon(it.icon, fg(k), 2), x + 0.3, 1.7, 0.42, 0.42);
        t.text(s, it.h, { x: x + 0.3, y: 2.25, w: w - 0.6, h: 0.6, fontSize: L.fit(it.h, w - 0.6, 0.6, 17, 11, F.head, true), bold: true, color: fg(k), valign: 'middle' });
        t.text(s, it.t, { x: x + 0.3, y: 2.9, w: w - 0.6, h: 1.95, fontSize: 14, color: fg(k) });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, w = 8.6 / n;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.7 + i * w;
        await piece(s, x, 1.5, w - 0.02, 0.75, i, [0, i < n - 1 ? 1 : 0, 0, i > 0 ? -1 : 0], 0.2);
        t.text(s, `${i + 1}`, { x, y: 1.5, w: w - 0.02, h: 0.75, fontSize: 24, bold: true, color: fg(i), align: 'center', valign: 'middle' });
        t.text(s, st.h, { x: x + 0.05, y: 2.5, w: w - 0.25, h: 0.55, fontSize: L.fit(st.h, w - 0.25, 0.55, 17, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, st.t, { x: x + 0.05, y: 3.1, w: w - 0.25, h: 1.95, fontSize: 14, color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, w = 8.6 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.7 + i * w;
        await piece(s, px, 1.5, w - 0.02, 1.6, i * 2, [0, i < n - 1 ? 1 : 0, 0, i > 0 ? -1 : 0], 0.25);
        t.text(s, x.value, { x: px + 0.25, y: 1.5, w: w - 0.52, h: 1.6, fontSize: L.fit(x.value, w - 0.6, 1.2, 52, 22, F.head, true), bold: true, color: fg(i * 2), align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.1, y: 3.35, w: w - 0.35, h: 1.0, fontSize: 14, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.7, y: 4.4, w: 8.6, h: 0.7, fontSize: 11, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.28;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.8, F.body, 0.18, 4.9 - 2.3);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.7 + i * (w + 0.04), k = i ? 4 : 0;
        await piece(s, x, 1.5, w, 3.45, k, [0, i ? 0 : 1, 0, i ? -1 : 0], 0.25);
        t.text(s, side.h, { x: x + 0.35, y: 1.65, w: w - 0.7, h: 0.55, fontSize: 18, bold: true, color: C.white, valign: 'middle' });
        let y = 2.3;
        side.items.forEach((it, j) => { t.oval(s, x + 0.35, y + 0.08, 0.15, 0.15, C.white); t.text(s, it, { x: x + 0.62, y, w: w - 0.9, h: rows[j], fontSize: fs, color: C.white }); y += rows[j]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await piece(s, 1.2, 1.55, 7.6, 2.2, 1, [0, 1, 0, -1], 0.3);
      t.text(s, L.runs(d.text), { x: 1.5, y: 1.6, w: 7.0, h: 2.1, bold: true, fontSize: L.fit(d.text, 7.0, 2.0, 34, 18, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 4.0, w: 8.0, h: 1.1, fontSize: 14, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, w = 8.6 / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.7 + i * w;
        await piece(s, x, 1.5, w - 0.02, 0.65, i + 1, [0, i < n - 1 ? 1 : 0, 0, i > 0 ? -1 : 0], 0.18);
        t.text(s, it.year, { x, y: 1.5, w: w - 0.02, h: 0.65, fontSize: L.fit(it.year, w - 0.4, 0.6, 22, 11, F.head, true), bold: true, color: fg(i + 1), align: 'center', valign: 'middle' });
        t.text(s, it.h, { x: x + 0.05, y: 2.4, w: w - 0.25, h: 0.5, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.05, y: 2.9, w: w - 0.25, h: 2.1, fontSize: 14, color: C.muted });
      }
    },
    async quote(d) {
      const s = await page({});
      await piece(s, 1.2, 1.2, 7.6, 2.9, 4, [1, 0, -1, 0], 0.3);
      t.text(s, d.text, { x: 1.6, y: 1.35, w: 6.8, h: 2.1, bold: true, fontSize: L.fit(d.text, 6.8, 2.0, 30, 16, F.head, true), color: C.white, align: 'center', valign: 'middle' });
      if (d.author) t.text(s, d.author, { x: 1.6, y: 3.5, w: 6.8, h: 0.45, fontSize: 14, color: C.pieces[1], bold: true, align: 'center' });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      for (const [i, it] of d.items.entries()) {
        const y = 1.45 + i * rh;
        await piece(s, 0.7, y + (rh - 0.3) / 2, 0.3, 0.3, i, [0, 1, 0, 0], 0.08);
        t.text(s, it, { x: 1.25, y, w: 8.2, h: rh, fontSize: 14, color: C.ink, valign: 'middle' });
      }
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Pazl', colors: { dk1: C.ink, lt1: C.white, dk2: C.pieces[4], lt2: C.bg, accent1: C.pieces[0], accent2: C.pieces[1], accent3: C.pieces[2], accent4: C.pieces[3], accent5: C.pieces[4], accent6: C.pieces[5], hlink: C.pieces[0], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "bog'liqlikni ko'rsatuvchi: har bir qism butunning bir bo'lagi, fikrlar bir-biriga ulanadi", limits: {}, prefer: null };
module.exports = { id: 56, slug: 'pazl', name: 'Pazl', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "calm"], "transitions": ["p14:honeycomb", "fade", "morph"], "cover": ["riseSettle", "springIn"], "mark": "swing", "deco": "drop", "sig": {"title": "riseSettle", "body": "fadeUp", "item": ["swingLeft", "swingRight"], "image": "drop", "number": "springIn", "order": "alternate", "stagger": 0.13}, "tempo": 1.0, "kenburns": false};
