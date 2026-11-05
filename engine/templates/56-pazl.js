/**
 * 56 Pazl — jigsaw puzzle: every block is a puzzle piece with real knobs and sockets;
 * neighbouring ideas interlock, the photo is cut as a piece, colours from a calm palette.
 */
const L = require('../lib.js');
const sharp = require('sharp');
const { W, H } = L;

const C = { bg: 'F2EFE9', ink: '1F2A30', muted: '5C666B', white: 'FFFFFF', pieces: ['2A9D8F', 'E9C46A', 'F4A261', 'E76F51', '264653', '8ECAE6'] };
const F = { head: 'Arial', body: 'Calibri' };
const light = (k) => k % 6 !== 4; // only the deep blue piece carries white words

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
        t.text(s, side.h, { x: x + 0.35, y: 1.65, w: w - 0.7, h: 0.55, fontSize: 18, bold: true, color: fg(k), valign: 'middle' });
        let y = 2.3;
        side.items.forEach((it, j) => { t.oval(s, x + 0.35, y + 0.08, 0.15, 0.15, fg(k)); t.text(s, it, { x: x + 0.62, y, w: w - 0.9, h: rows[j], fontSize: fs, color: fg(k) }); y += rows[j]; });
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
  // ---- further ways to draw a type, every block still a piece of the same puzzle: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 11, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const NAVY = C.pieces[4], PALE = 'E4EEF0', ON = [0, 1, 2, 5, 3]; // the pieces that show on the dark table
  const table = async (d) => { // the dark table the puzzle lies on
    const s = pres.addSlide(); s.background = { color: NAVY }; idx++;
    await piece(s, 0.6, 0.45, 0.6, 0.55, 1, [0, 1, 0, 0], 0.15);
    t.text(s, String(idx), { x: 0.6, y: 0.45, w: 0.6, h: 0.55, fontSize: 16, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    t.text(s, d.title, { x: 1.55, y: 0.38, w: 7.9, h: 0.7, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 7.9, 0.7, 28, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   ◆   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: PALE });
    return s;
  };
  // one picture cut into four interlocking pieces, a hair apart
  const fourPieces = async (s, src, x, y, w, h, m = 0.26, gap = 0.05) => {
    const Wd = w + 2 * m, Ht = h + 2 * m, buf = Buffer.from((await L.photo(L.src(src), Wd, Ht)).split(',')[1], 'base64'), { width, height } = await sharp(buf).metadata(), k = width / Wd;
    const cells = [[0, 0, [0, 1, -1, 0]], [1, 0, [0, 0, 1, -1]], [0, 1, [1, -1, 0, 0]], [1, 1, [-1, 0, 0, 1]]];
    for (const [cx, cy, edges] of cells) {
      const pw = w / 2 + 2 * m, ph = h / 2 + 2 * m, left = Math.round((cx * w) / 2 * k), top = Math.round((cy * h) / 2 * k), pwp = Math.min(width - left, Math.round(pw * k)), php = Math.min(height - top, Math.round(ph * k));
      const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${pwp}" height="${php}"><path d="${piecePath(pwp, php, m * k, edges)}" fill="#fff"/></svg>`);
      const png = await sharp(await sharp(buf).extract({ left, top, width: pwp, height: php }).toBuffer()).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
      t.img(s, 'image/png;base64,' + png.toString('base64'), x - m + (cx * w) / 2 + cx * gap, y - m + (cy * h) / 2 + cy * gap, pwp / k, php / k, { alt: '' });
    }
  };
  const V = {
    image: [
      async (d) => { // a broad picture piece locks down into the piece that carries the words
        const s = await page(d);
        await photoPiece(s, d.image, 0.9, 1.46, 8.2, 1.72, [0, 0, 1, 0], 0.22);
        await piece(s, 0.9, 3.2, 8.2, 1.82, 5, [-1, 0, 0, 0], 0.22);
        t.text(s, d.text, { x: 1.1, y: 3.36, w: 7.8, h: 1.58, fontSize: L.fit(d.text, 7.8, 1.58, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
      },
      async (d) => { // on the dark table: one large picture piece with its knob out to the words
        const s = await table(d);
        await photoPiece(s, d.image, 5.55, 1.52, 3.7, 3.4, [0, 0, 0, 1], 0.3);
        t.text(s, d.text, { x: 0.7, y: 1.34, w: 4.45, h: 3.76, fontSize: L.fit(d.text, 4.45, 3.76, 15, 10, F.body, false, 1.25), color: C.white, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // the finished picture, and one great piece of it lifted out to carry the words
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        await piece(s, 0.75, 0.68, 5.3, 4.1, 1, [1, 1, 1, 1], 0.32);
        t.text(s, L.pad2(idx), { x: 0.95, y: 0.8, w: 0.7, h: 0.66, bold: true, fontSize: 18, color: C.ink, valign: 'middle' });
        t.text(s, d.title, { x: 1.62, y: 0.8, w: 4.2, h: 0.68, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 4.2, 0.66, 19, 13, F.head, true) });
        t.text(s, d.text, { x: 1.0, y: 1.52, w: 4.8, h: 3.14, fontSize: L.fit(d.text, 4.8, 3.14, 14, 10, F.body, false, 1.15), color: C.ink, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0, 5.2, W, H - 5.2, NAVY, { name: 'Foot band' });
        t.text(s, `${M.topic || ''}   ◆   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.3, fontSize: 8.5, color: C.white, valign: 'middle' });
      },
      async (d) => { // the picture itself cut in four, not quite pushed together
        const s = await page(d);
        await fourPieces(s, d.image, 0.72, 1.42, 4.5, 3.54);
        t.text(s, d.text, { x: 5.75, y: 1.34, w: 3.7, h: 3.76, fontSize: L.fit(d.text, 3.7, 3.76, 14, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // long pieces locked one under another
        const s = await page(d), n = d.items.length, h = 3.72 / n, m = 0.14;
        for (const [i, it] of d.items.entries()) {
          const y = 1.36 + i * h, k = [5, 1, 2, 0][i];
          await piece(s, 0.65, y, 8.7, h, k, [i ? -1 : 0, 0, i < n - 1 ? 1 : 0, 0], m);
          t.img(s, await L.icon(it.icon, C.ink, 2), 0.85, y + h / 2 - 0.17, 0.34, 0.34);
          head(s, it.h, 1.32, y + 0.1, 2.6, h - 0.2, { max: 15 });
          body(s, it.t, 4.0, y + 0.1, 5.15, h - 0.2, { valign: 'middle', max: 13 });
        }
      },
      async (d) => { // the dark table: four pieces locked two by two
        const s = await table(d), n = d.items.length, w = 4.3, h = 1.86, m = 0.2;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.6 : w, c = i % 2, r = Math.floor(i / 2), x = 0.7 + c * w, y = 1.36 + r * h, k = ON[i];
          const edges = n === 3
            ? (wide ? [-1, 0, 0, 0] : [0, c ? 0 : 1, c ? 0 : 1, c ? -1 : 0])
            : [r ? (c ? 1 : -1) : 0, c ? 0 : (r ? -1 : 1), r ? 0 : (c ? -1 : 1), c ? (r ? 1 : -1) : 0];
          await piece(s, x, y, ww, h, k, edges, m);
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.26, y + 0.2, 0.34, 0.34);
          head(s, it.h, x + 0.7, y + 0.16, ww - 1.0, 0.44, { max: 15 });
          body(s, it.t, x + 0.28, y + 0.66, ww - 0.56, h - 0.84);
        }
      },
      async (d) => { // pieces shaken loose: side by side, at two heights, still to be pushed home
        const s = await page(d), n = d.items.length, w = (8.5 - 0.1 * (n - 1)) / n, h = 3.08, m = 0.16;
        for (const [i, it] of d.items.entries()) {
          const x = 0.75 + i * (w + 0.1), y = 1.38 + (i % 2 ? 0.5 : 0), k = [5, 2, 1, 0][i];
          await piece(s, x, y, w, h, k, [0, i < n - 1 ? 1 : 0, 0, i ? -1 : 0], m);
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.2, y + 0.16, 0.34, 0.34);
          head(s, it.h, x + 0.2, y + 0.54, w - 0.4, 0.56, { max: 14 });
          body(s, it.t, x + 0.2, y + 1.12, w - 0.4, h - 1.24, {});
        }
      },
      async (d) => { // one dark key piece in the middle, the others lock on from both sides
        const s = await page(d), n = d.items.length, cw = 1.5, w = 3.3, x0 = 5 - cw / 2, m = 0.24, h = 1.88, y0 = 1.34;
        await piece(s, x0, y0 + 0.6, cw, 2.56, 4, [0, 1, 0, 1], m);
        t.text(s, '◆', { x: x0, y: y0 + 0.6, w: cw, h: 2.56, fontSize: 40, color: C.pieces[1], align: 'center', valign: 'middle' });
        const left = d.items.slice(0, 2), right = d.items.slice(2), rh = (arr) => (arr.length === 1 ? 3.76 : h);
        for (const [c, arr] of [left, right].entries()) for (const [j, it] of arr.entries()) {
          const i = c * 2 + j, hh = rh(arr), x = c ? x0 + cw + 0.14 : x0 - 0.14 - w, y = y0 + j * h, k = [5, 1, 2, 0][i], edges = arr.length === 1 ? [0, 0, 0, 0] : [j ? -1 : 0, 0, j ? 0 : 1, 0];
          await piece(s, x, y, w, hh, k, edges, 0.14);
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.16, y + 0.12, 0.3, 0.3);
          head(s, it.h, x + 0.54, y + 0.08, w - 0.68, 0.4, { max: 14 });
          body(s, it.t, x + 0.16, y + 0.54, w - 0.32, hh - 0.66, {});
        }
      },
    ],
    process: [
      async (d) => { // each piece reaches up and to the right for the next
        const s = await page(d), n = d.steps.length, m = 0.16, w = 8.5 / n, low = 3.22, high = 1.34, h = 1.88;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.75 + i * w, y = low - i * ((low - high) / (n - 1)), tw = w - 0.06, k = [0, 1, 2, 5][i];
          await piece(s, x, y, tw, h, k, [0, i < n - 1 ? 1 : 0, 0, 0], m);
          t.text(s, String(i + 1), { x: x + 0.14, y: y + 0.08, w: 0.46, h: 0.5, bold: true, fontSize: 22, color: C.ink, valign: 'middle' });
          head(s, st.h, x + 0.56, y + 0.08, tw - 0.72, 0.5, { max: 13 });
          body(s, st.t, x + 0.14, y + 0.62, tw - 0.3, h - 0.72);
        }
      },
      async (d) => { // a spine of small pieces locks together down the middle, words to either side
        const s = await page(d), n = d.steps.length, h = 3.72 / n, w = 3.72, pw = 0.72, cx = 5, m = 0.13;
        for (const [i, st] of d.steps.entries()) {
          const y = 1.38 + i * h, right = i % 2 === 1, k = [0, 2, 5, 1][i], x = right ? cx + pw / 2 + 0.24 : cx - pw / 2 - 0.24 - w, a = right ? 'left' : 'right';
          await piece(s, cx - pw / 2, y, pw, h, k, [i ? -1 : 0, 0, i < n - 1 ? 1 : 0, 0], m);
          t.text(s, String(i + 1), { x: cx - pw / 2, y, w: pw, h, bold: true, fontSize: 22, color: C.ink, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.02, w, 0.32, { align: a, max: 14 });
          body(s, st.t, x, y + 0.34, w, h - 0.36, { align: a });
        }
      },
      async (d) => { // the dark table: long pieces cascade down to the right
        const s = await table(d), n = d.steps.length, dy = n === 4 ? 0.94 : 1.25, dx = n === 4 ? 0.62 : 0.94, h = dy - 0.02, w = 6.9, m = 0.13;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.7 + i * dx, y = 1.36 + i * dy, k = ON[i];
          await piece(s, x, y, w, h, k, [0, 1, 0, 0], m);
          t.text(s, String(i + 1), { x: x + 0.14, y, w: 0.56, h, bold: true, fontSize: 24, color: C.ink, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.76, y + 0.05, 2.2, h - 0.1, { max: 14 });
          body(s, st.t, x + 3.0, y + 0.06, w - 3.14, h - 0.12, { valign: 'middle', max: 12 });
        }
      },
    ],
    stats: [
      async (d) => { // one number in a great piece, two small ones locked to its side
        const s = await page(d), [a, ...rest] = d.stats, m = 0.24;
        await piece(s, 0.75, 1.42, 4.5, 3.56, 0, [0, 1, 0, 0], m);
        t.text(s, a.value, { x: 1.0, y: 1.6, w: 4.0, h: 1.5, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.95, 1.45, 62, 26, F.head, true) });
        body(s, a.label, 1.1, 3.14, 3.8, 1.6, { align: 'center', max: 16 });
        for (const [i, v] of rest.entries()) {
          const y = 1.42 + i * 1.2, k = i ? 5 : 1;
          await piece(s, 5.27, y, 4.08, 1.2, k, [i ? -1 : 0, 0, i ? 0 : 1, i ? -1 : 0], m);
          t.text(s, v.value, { x: 5.55, y: y + 0.08, w: 3.6, h: 0.58, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(v.value, 3.55, 0.54, 30, 16, F.head, true) });
          body(s, v.label, 5.55, y + 0.66, 3.6, 0.46, { max: 12 });
        }
        if (d.note) body(s, d.note, 5.4, 3.92, 4.0, 1.18, { color: C.muted, valign: 'middle', max: 12 });
      },
      async (d) => { // the dark table: a chain of three pieces carries the figures, words at their side
        const s = await table(d), h = 0.92, w = 3.5, m = 0.13;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.36 + i * h;
          await piece(s, 0.7, y, w, h, ON[i], [i ? -1 : 0, 0, i < 2 ? 1 : 0, 0], m);
          t.text(s, v.value, { x: 0.82, y, w: w - 0.24, h, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(v.value, w - 0.34, h - 0.2, 40, 18, F.head, true) });
          body(s, v.label, 4.5, y + 0.02, 4.9, h - 0.04, { color: C.white, valign: 'middle', max: 15 });
        }
        if (d.note) body(s, d.note, 0.7, 4.22, 8.7, 0.92, { color: PALE, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // two name pieces locked in the middle, the lists mirrored under them
        const s = await page(d), w = 3.95, cx = 5, m = 0.22;
        await piece(s, cx - w - 0.02, 1.42, w, 0.62, 0, [0, 1, 0, 0], m);
        await piece(s, cx + 0.02, 1.42, w, 0.62, 4, [0, 0, 0, -1], m);
        head(s, d.left.h, cx - w + 0.1, 1.42, w - 0.4, 0.62, { max: 17, align: 'right' });
        head(s, d.right.h, cx + 0.3, 1.42, w - 0.4, 0.62, { max: 17, color: C.white });
        t.line(s, cx, 2.2, 0, 2.92, C.muted, 1, { dash: 'dash' });
        const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.2, F.body, 0.18, 2.86);
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? cx + 0.24 : cx - 0.24 - (w - 0.2), a = i ? 'left' : 'right';
          let y = 2.26;
          side.items.forEach((it, j) => { t.text(s, it, { x, y, w: w - 0.2, h: rows[j], fontSize: fs, color: C.ink, align: a }); y += rows[j]; });
        }
      },
      async (d) => { // two long pieces, one locked under the other
        const s = await page(d), h = 1.84, m = 0.18;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.38 + i * h, k = i ? 4 : 1, ink = fg(k), rh = (h - 0.32) / Math.ceil(side.items.length / 2);
          await piece(s, 0.7, y, 8.6, h, k, [i ? -1 : 0, 0, i ? 0 : 1, 0], m);
          head(s, side.h, 0.92, y + 0.2, 2.3, h - 0.4, { color: ink, max: 18 });
          side.items.forEach((it, j) => body(s, it, 3.35 + (j % 2) * 3.0, y + 0.16 + Math.floor(j / 2) * rh, 2.8, rh - 0.05, { color: ink, valign: 'middle' }));
        }
      },
    ],
    statement: [
      async (d) => { // the dark table: the words, and the empty outline where the last piece belongs
        const s = await table(d), Wd = 330, Ht = 330, mp = 34;
        t.img(s, (memo.gap ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${Wd}" height="${Ht}"><path d="${piecePath(Wd, Ht, mp, [1, 1, -1, -1])}" fill="#1B3540" stroke="#${C.pieces[1]}" stroke-width="4" stroke-dasharray="12 9"/></svg>`, Wd, Ht)), 6.15, 1.5, 3.3, 3.3);
        t.text(s, L.runs(d.text), { x: 0.7, y: 1.34, w: 5.2, h: 2.34, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 5.2, 2.3, 30, 15, F.head, true) });
        if (d.caption) body(s, d.caption, 0.7, 3.78, 5.2, 1.34, { color: PALE, max: 13 });
      },
      async (d) => { // the thought in a broad piece, its note in a smaller one locked to it
        const s = await page(d), m = 0.24;
        await piece(s, 0.75, 1.42, 5.6, 3.56, 5, [0, 1, 0, 0], m);
        t.text(s, L.runs(d.text), { x: 1.0, y: 1.54, w: 5.1, h: 3.32, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.text, 5.1, 3.28, 32, 16, F.head, true) });
        await piece(s, 6.37, 1.42, 2.98, 3.56, 1, [0, 0, 0, -1], m);
        if (d.caption) body(s, d.caption, 6.68, 1.56, 2.5, 3.28, { valign: 'middle', max: 13 });
      },
    ],
    timeline: [
      async (d) => { // a chain of year pieces across the page, words above and below in turn
        const s = await page(d), w = 8.6 / 4, ya = 2.92, h = 0.58, m = 0.14;
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + i * w, k = [0, 1, 2, 5][i], up = i % 2 === 0, tx = up ? 0.7 + (i / 2) * 4.3 : 2.85 + ((i - 1) / 2) * 3.65, tw = up ? 4.05 : 3.2;
          await piece(s, x, ya, w - 0.02, h, k, [0, i < 3 ? 1 : 0, 0, i ? -1 : 0], m);
          t.text(s, it.year, { x: x + 0.12, y: ya, w: w - 0.26, h, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.34, h - 0.12, 18, 10, F.head, true) });
          const top = up ? 1.28 : 3.68;
          head(s, it.h, tx, top, tw, 0.36, { max: 14 });
          body(s, it.t, tx, top + 0.38, tw, up ? 1.08 : 1.06, {});
        }
      },
      async (d) => { // a chain of years down the left edge, the story told to its right
        const s = await page(d), h = 0.93, w = 2.0, m = 0.13;
        for (const [i, it] of d.items.entries()) {
          const y = 1.38 + i * h, k = [5, 0, 1, 2][i];
          await piece(s, 0.7, y, w, h, k, [i ? -1 : 0, 0, i < 3 ? 1 : 0, 0], m);
          t.text(s, it.year, { x: 0.8, y, w: w - 0.2, h, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.3, 0.6, 20, 11, F.head, true) });
          head(s, it.h, 2.95, y + 0.03, 2.1, h - 0.08, { max: 14 });
          body(s, it.t, 5.1, y + 0.03, 4.3, h - 0.08, { valign: 'middle', color: C.ink });
          if (i < 3) t.line(s, 2.95, y + h - 0.01, 6.45, 0, C.muted, 0.75);
        }
      },
      async (d) => { // the dark table: four tall pieces in a row, a year heading each
        const s = await table(d), w = 8.6 / 4, m = 0.16, ys = [1.36, 1.68, 1.36, 1.68];
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + i * w, y = ys[i], h = 5.12 - y, tw = w - 0.04, k = ON[i];
          await piece(s, x, y, tw, h, k, [0, i < 3 ? 1 : 0, 0, 0], m);
          t.text(s, it.year, { x: x + 0.14, y: y + 0.06, w: tw - 0.28, h: 0.54, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(it.year, tw - 0.32, 0.5, 22, 11, F.head, true) });
          head(s, it.h, x + 0.14, y + 0.6, tw - 0.28, 0.42, { max: 14 });
          body(s, it.t, x + 0.14, y + 1.04, tw - 0.28, h - 1.12, {});
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.timeline = V.timeline.shift(); // the old timeline page was the same row of pieces as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Pazl', colors: { dk1: C.ink, lt1: C.white, dk2: C.pieces[4], lt2: C.bg, accent1: C.pieces[0], accent2: C.pieces[1], accent3: C.pieces[2], accent4: C.pieces[3], accent5: C.pieces[4], accent6: C.pieces[5], hlink: C.pieces[0], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "bog'liqlikni ko'rsatuvchi: har bir qism butunning bir bo'lagi, fikrlar bir-biriga ulanadi", limits: {}, prefer: null };
module.exports = { id: 56, slug: 'pazl', name: 'Pazl', category: 'business', photos: true, build, style: STYLE };
