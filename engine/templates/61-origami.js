/**
 * 61 Origami — folded paper: flat colour planes with a darker folded flap, paper cranes,
 * folded ribbons for steps and timeline, crisp diagonal folds on a clean paper ground.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F7F5F0', ink: '26303A', muted: '66707A', white: 'FFFFFF',
  pal: [['F28B82', 'D9665D'], ['4DB6AC', '2E9488'], ['F6C453', 'D9A22C'], ['7E8CE0', '5866C4'], ['8BC48A', '62A461'], ['F4A6C6', 'D97FA6']] };
const F = { head: 'Arial', body: 'Calibri' };
const fg = () => '26303A'; // readable text on each paper colour: white fails on these pale papers

const crane = (c1, c2) => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
  <polygon points="40,150 190,175 150,215" fill="#${c2}"/><polygon points="190,175 260,60 230,200" fill="#${c1}"/><polygon points="190,175 230,200 150,215" fill="#${c2}" opacity="0.8"/>
  <polygon points="230,200 360,120 300,210" fill="#${c1}"/><polygon points="360,120 385,95 372,128" fill="#${c2}"/><polygon points="150,215 230,200 210,250" fill="#${c1}" opacity="0.9"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  // paper panel with a folded top-right corner (flap shows the darker back of the paper)
  const fold = async (s, x, y, w, h, k, f = 0.45) => {
    const [a, b] = C.pal[k % 6], key = `${w}${h}${k}${f}`;
    const px = Math.round(w * 100), py = Math.round(h * 100), fp = f * 100;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${py}"><polygon points="0,0 ${px - fp},0 ${px},${fp} ${px},${py} 0,${py}" fill="#${a}"/><polygon points="${px - fp},0 ${px - fp},${fp} ${px},${fp}" fill="#${b}"/><polygon points="0,${py} ${px * 0.55},${py} 0,${py * 0.55}" fill="#000" opacity="0.06"/></svg>`;
    t.img(s, (memo[key] ??= await L.svg(svg, px, py)), x, y, w, h);
  };
  const tile = async (s, x, y, d, k) => { // origami square seen as a diamond with a fold line
    const [a, b] = C.pal[k % 6], key = `t${d}${k}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><polygon points="100,0 200,100 100,200 0,100" fill="#${a}"/><polygon points="100,0 200,100 100,100" fill="#${b}"/><polygon points="0,100 100,200 100,100" fill="#${b}" opacity="0.5"/></svg>`;
    t.img(s, (memo[key] ??= await L.svg(svg, 200, 200)), x, y, d, d);
  };
  const ribbon = async (s, x, y, w, h, k, last) => { // folded ribbon segment: chevron with a shaded fold
    const [a, b] = C.pal[k % 6], px = Math.round(w * 100), py = Math.round(h * 100), n = 18, key = `r${w}${h}${k}${last}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${py}"><polygon points="0,0 ${px - (last ? 0 : n)},0 ${px},${py / 2} ${px - (last ? 0 : n)},${py} 0,${py} ${n},${py / 2}" fill="#${a}"/><polygon points="0,${py} ${n},${py / 2} ${n * 2},${py}" fill="#${b}"/></svg>`;
    t.img(s, (memo[key] ??= await L.svg(svg, px, py)), x, y, w, h);
  };
  const craneImg = async (k) => (memo['c' + k] ??= await L.svg(crane(...C.pal[k % 6]), 400, 300));
  const footer = (s) => t.text(s, `${M.topic || ''}   \u25C6   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await tile(s, 0.5, 0.38, 0.7, idx);
    t.text(s, String(idx), { x: 0.5, y: 0.38, w: 0.7, h: 0.7, fontSize: 15, bold: true, color: fg(idx), align: 'center', valign: 'middle' });
    if (d.title) t.text(s, d.title, { x: 1.4, y: 0.38, w: 8.05, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.7, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const photo = async (s, src, x, y, w, h, k) => { // photo with a folded paper corner on top
    await fold(s, x + 0.15, y + 0.15, w, h, k, 0.01);
    t.img(s, await L.photo(L.src(src), w, h), x, y, w, h, { alt: '' });
    const [a, b] = C.pal[k % 6], f = 0.6, key = `pf${k}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><polygon points="0,0 60,0 60,60" fill="#${C.bg}"/><polygon points="0,0 0,60 60,60" fill="#${b}"/></svg>`;
    t.img(s, (memo[key] ??= await L.svg(svg, 60, 60)), x + w - f, y, f, f);
    void a;
  };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    await fold(s, 6.0, -0.2, 4.2, 3.3, 1, 0.9); await fold(s, 7.4, 2.6, 2.8, 3.2, 2, 0.7);
    if (d.image) await photo(s, d.image, 6.35, 0.7, 2.9, 2.4, 3);
    t.img(s, await craneImg(0), 0.5, 3.75, 1.9, 1.42);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u25C6  '), { x: 0.6, y: 0.6, w: 5.2, h: 0.3, fontSize: 12, bold: true, color: C.pal[1][1] });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 5.2, h: 2.2, bold: true, fontSize: L.fit(d.title, 5.2, 2.1, 40, 20, F.head, true), color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.2, w: 5.1, h: 0.7, fontSize: 13, color: C.muted });
    t.text(s, M.author || '', { x: 2.55, y: 4.3, w: 3.4, h: 0.45, fontSize: 16, bold: true, color: C.pal[0][1] });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await photo(s, d.image, 0.6, 1.45, 3.9, 3.35, 0); para(s, d.text, 4.95, 1.35, 4.5, 3.7); },
    async image(d) { const s = await page(d); para(s, d.text, 0.55, 1.35, 4.5, 3.7); await photo(s, d.image, 5.4, 1.45, 3.9, 3.35, 3); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + Math.floor(i / per) * 4.45, y = 1.45 + (i % per) * rh;
        await tile(s, x, y, 0.62, i);
        t.text(s, String(i + 1), { x, y, w: 0.62, h: 0.62, fontSize: 14, bold: true, color: fg(i), align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.8, y, w: 3.45, h: 0.62, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.22, w = (8.9 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.55 + i * (w + gap);
        await fold(s, x, 1.4, w, 3.65, i);
        t.img(s, await L.icon(it.icon, fg(i), 2), x + 0.22, 1.6, 0.4, 0.4);
        t.text(s, it.h, { x: x + 0.22, y: 2.1, w: w - 0.44, h: 0.6, fontSize: L.fit(it.h, w - 0.44, 0.6, 17, 11, F.head, true), bold: true, color: fg(i), valign: 'middle' });
        t.text(s, it.t, { x: x + 0.22, y: 2.75, w: w - 0.44, h: 2.15, fontSize: 14, color: fg(i) });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.9 / n;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.55 + i * cw;
        await ribbon(s, x, 1.45, cw + 0.05, 0.7, i, i === n - 1);
        t.text(s, String(i + 1), { x: x + 0.15, y: 1.45, w: cw - 0.4, h: 0.7, fontSize: 22, bold: true, color: fg(i), align: 'center', valign: 'middle' });
        t.text(s, st.h, { x: x + 0.05, y: 2.35, w: cw - 0.2, h: 0.55, fontSize: L.fit(st.h, cw - 0.2, 0.55, 17, 11, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, st.t, { x: x + 0.05, y: 2.95, w: cw - 0.2, h: 2.1, fontSize: 14, color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.9 / n, dd = Math.min(1.8, cw - 0.7);
      for (const [i, x] of d.stats.entries()) {
        const cx = 0.55 + i * cw + cw / 2;
        await tile(s, cx - dd / 2, 1.35, dd, i * 2);
        t.text(s, x.value, { x: cx - dd / 2 + 0.2, y: 1.35, w: dd - 0.4, h: dd, fontSize: L.fit(x.value, dd - 0.6, 0.7, 40, 16, F.head, true), bold: true, color: fg(i * 2), align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.15, y: 1.5 + dd, w: cw - 0.3, h: 1.0, fontSize: 14, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.55, y: 4.45, w: 8.9, h: 0.65, fontSize: 11, color: C.muted, align: 'center' });
    },
    async compare(d) {
      const s = await page(d), w = 4.35;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.9 - 2.25);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.55 + i * (w + 0.2), k = i ? 1 : 0;
        await fold(s, x, 1.4, w, 3.65, k, 0.6);
        t.text(s, side.h, { x: x + 0.3, y: 1.55, w: w - 1.0, h: 0.6, fontSize: 18, bold: true, color: C.ink, valign: 'middle' });
        let y = 2.25;
        side.items.forEach((it, j) => { t.shape(s, 'RIGHT_TRIANGLE', { x: x + 0.3, y: y + 0.07, w: 0.16, h: 0.16, fill: { color: C.ink }, objectName: 'Bullet' }); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[j], fontSize: fs, color: C.ink }); y += rows[j]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await fold(s, 0.9, 1.4, 8.2, 2.5, 3, 0.7);
      t.text(s, L.runs(d.text), { x: 1.3, y: 1.5, w: 7.2, h: 2.3, bold: true, fontSize: L.fit(d.text, 7.2, 2.2, 34, 18, F.head, true), color: C.white, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.9, y: 4.05, w: 8.2, h: 1.05, fontSize: 14, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.9 / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.55 + i * cw;
        await ribbon(s, x, 1.45, cw + 0.05, 0.6, i + 2, i === n - 1);
        t.text(s, it.year, { x: x + 0.2, y: 1.45, w: cw - 0.45, h: 0.6, fontSize: L.fit(it.year, cw - 0.5, 0.55, 20, 10, F.head, true), bold: true, color: fg(i + 2), align: 'center', valign: 'middle' });
        t.text(s, it.h, { x: x + 0.05, y: 2.25, w: cw - 0.2, h: 0.5, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.05, y: 2.75, w: cw - 0.2, h: 2.3, fontSize: 14, color: C.muted });
      }
    },
    async quote(d) {
      const s = await page({});
      t.img(s, await craneImg(4), 7.2, 3.3, 2.3, 1.72);
      t.text(s, d.text, { x: 0.9, y: 1.1, w: 7.6, h: 2.5, bold: true, fontSize: L.fit(d.text, 7.6, 2.4, 32, 16, F.head, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 0.9, y: 3.75, w: 6.0, h: 0.45, fontSize: 15, bold: true, color: C.pal[4][1] });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      for (const [i, it] of d.items.entries()) {
        const y = 1.45 + i * rh;
        await tile(s, 0.55, y + (rh - 0.38) / 2, 0.38, i);
        t.text(s, it, { x: 1.1, y, w: 8.35, h: rh, fontSize: 14, color: C.ink, valign: 'middle' });
      }
    },
  };
  // ---- further ways to draw a type, all in folded paper: a deck's pages must not look alike (L.pages)
  const NIGHT = '26303A', MIST = 'E8E4DA', INK = C.ink;
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, 10, F.body), color: o.color || INK, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10, F.head, true), color: o.color || INK, align: o.align, valign: o.valign || 'middle' });
  // a paper plane of any outline: pts as fractions of w, h
  const plane = (s, x, y, w, h, pts, col, op = 1) => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w * 100)}" height="${Math.round(h * 100)}"><polygon points="${pts.map(([a, b]) => `${(a * w * 100).toFixed(1)},${(b * h * 100).toFixed(1)}`).join(' ')}" fill="#${col}" fill-opacity="${op}"/></svg>`, Math.round(w * 100), Math.round(h * 100)).then((img) => t.img(s, img, x, y, w, h));
  const nightPage = async (d) => {
    const s = pres.addSlide(); s.background = { color: NIGHT }; idx++;
    await tile(s, 0.5, 0.38, 0.7, idx);
    t.text(s, String(idx), { x: 0.5, y: 0.38, w: 0.7, h: 0.7, fontSize: 15, bold: true, color: fg(idx), align: 'center', valign: 'middle' });
    t.text(s, d.title, { x: 1.4, y: 0.38, w: 8.05, h: 0.7, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.05, 0.7, 28, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   ◆   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.22, fontSize: 8.5, color: MIST });
    return s;
  };
  const numTile = async (s, x, y, dd, n, k) => { await tile(s, x, y, dd, k); t.text(s, String(n), { x, y, w: dd, h: dd, fontSize: Math.round(dd * 24), bold: true, color: fg(k), align: 'center', valign: 'middle' }); };
  const V = {
    image: [
      async (d) => { // the picture folded into a great diamond, paper showing at its edges
        const s = await page(d), w = 3.78, x = 0.55, y = 1.32;
        await plane(s, x - 0.1, y + 0.05, w + 0.2, w, [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]], C.pal[1][0]);
        t.img(s, await L.photo(L.src(d.image), w, w, { mask: { poly: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]] } }), x, y, w, w, { alt: '' });
        await plane(s, x, y + w * 0.5, w * 0.5, w * 0.5, [[0, 0], [1, 1], [1, 0.72], [0.28, 0]], C.pal[1][1], 0.85);
        t.text(s, d.text, { x: 4.65, y: 1.32, w: 4.85, h: 3.75, fontSize: L.fit(d.text, 4.85, 3.75, 15, 10, F.body, false, 1.2), color: INK, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // the photo fills the page, a slanted sheet of paper folded over it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, H), 0, 0, W, H, { alt: '' });
        await plane(s, 3.85, 0, 6.15, H, [[0.14, 0], [1, 0], [1, 1], [0, 1]], C.bg);
        await plane(s, 3.85, 0, 0.87, H, [[1, 0], [0, 1], [0.24, 1]], C.pal[3][1], 0.8);
        await numTile(s, 5.05, 0.28, 0.62, idx, idx);
        t.text(s, d.title, { x: 5.8, y: 0.25, w: 3.8, h: 0.7, bold: true, color: INK, valign: 'middle', fontSize: L.fit(d.title, 3.8, 0.7, 20, 13, F.head, true) });
        t.text(s, d.text, { x: 5.0, y: 1.05, w: 4.65, h: 4.05, fontSize: L.fit(d.text, 4.65, 4.05, 15, 10, F.body, false, 1.15), color: INK, lineSpacingMultiple: 1.15, valign: 'middle' });
        t.rect(s, 0, 5.18, W, 0.34, C.bg, { name: 'Footer' }); footer(s);
      },
      async (d) => { // night: a wide strip of picture cut on a slant, words under the crease
        const s = await nightPage(d), w = 9, h = 2.15, x = 0.5, y = 1.25;
        await plane(s, x - 0.06, y + 0.14, w + 0.12, h, [[0, 0], [1, 0], [1, 0.72], [0, 1]], C.pal[2][0]);
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: [[0, 0], [1, 0], [1, 0.72], [0, 1]] } }), x, y, w, h, { alt: '' });
        t.text(s, d.text, { x: 0.6, y: 3.62, w: 8.8, h: 1.55, fontSize: L.fit(d.text, 8.8, 1.55, 14, 10, F.body, false, 1.1), color: C.white, lineSpacingMultiple: 1.1, valign: 'bottom' });
      },
      async (d) => { // a folded leaflet: the picture bends along one crease down its middle
        const s = await page(d), w = 4.3, h = 3.6, x = 5.2, y = 1.42, P = [[0, 0.06], [0.5, 0], [1, 0.06], [1, 0.94], [0.5, 1], [0, 0.94]];
        await plane(s, x + 0.12, y + 0.08, w, h, P, C.pal[5][1]);
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { poly: P } }), x, y, w, h, { alt: '' });
        await plane(s, x + w / 2, y, w / 2, h, [[0, 0], [1, 0.06], [1, 0.94], [0, 1]], '000000', 0.2);
        t.text(s, d.text, { x: 0.55, y: 1.32, w: 4.35, h: 3.75, fontSize: L.fit(d.text, 4.35, 3.75, 15, 10, F.body, false, 1.2), color: INK, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a pleated strip: long slanted bands pushed left and right in turn
        const s = await page(d), n = d.items.length, gap = 0.1, h = (3.72 - gap * (n - 1)) / n, w = 8.3;
        for (const [i, it] of d.items.entries()) {
          const x = i % 2 ? 1.2 : 0.5, y = 1.35 + i * (h + gap), sk = 0.28 / w;
          await plane(s, x, y, w, h, [[sk, 0], [1, 0], [1 - sk, 1], [0, 1]], C.pal[i][0]);
          await plane(s, x + w - 0.5, y, 0.5, h, [[0.44, 0], [1, 0], [0.44, 1], [0, 1]], C.pal[i][1]);
          t.img(s, await L.icon(it.icon, INK, 2), x + 0.35, y + h / 2 - 0.18, 0.36, 0.36);
          head(s, it.h, x + 0.85, y + 0.04, 2.15, h - 0.08, { max: 14 });
          body(s, it.t, x + 3.1, y + 0.04, 4.6, h - 0.08, { valign: 'middle' });
        }
      },
      async (d) => { // a square folded at the centre, its corners opened out round it
        const s = await page(d), n = d.items.length, w = 3.55, h = 1.8, dd = 1.5, cy = 3.2;
        const pos = n === 4 ? [[0.5, 1.35], [0.5, 3.3], [5.95, 1.35], [5.95, 3.3]] : [[0.5, 1.35], [0.5, 3.3], [5.95, 2.32]];
        await tile(s, 5 - dd / 2, cy - dd / 2, dd, 3);
        t.img(s, await craneImg(2), 4.7, cy - 0.26, 0.6, 0.45);
        for (const [i, it] of d.items.entries()) {
          const [x, y] = pos[i];
          await fold(s, x, y, w, h, i, 0.32);
          t.img(s, await L.icon(it.icon, INK, 2), x + 0.15, y + 0.12, 0.32, 0.32);
          head(s, it.h, x + 0.55, y + 0.08, w - 0.95, 0.4, { max: 14 });
          body(s, it.t, x + 0.15, y + 0.52, w - 0.3, h - 0.6);
        }
      },
      async (d) => { // night: coloured squares on dark, two by two
        const s = await nightPage(d), n = d.items.length, w = 4.4, h = 1.8;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 9 : w, x = 0.5 + (i % 2) * (w + 0.2), y = 1.32 + Math.floor(i / 2) * (h + 0.14);
          await fold(s, x, y, ww, h, i + 2, 0.4);
          t.img(s, await L.icon(it.icon, INK, 2), x + 0.16, y + 0.15, 0.42, 0.42);
          head(s, it.h, x + 0.72, y + 0.12, ww - 1.2, 0.48, { max: 15 });
          body(s, it.t, x + 0.72, y + 0.62, ww - 0.88, h - 0.7);
        }
      },
      async (d) => { // white sheets at uneven heights, each with a coloured flap folded down
        const s = await page(d), n = d.items.length, cw = 9 / n, w = cw - 0.16, h = 3.2;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * cw + 0.08, y = 1.32 + (i % 2) * 0.52, fl = Math.min(w, 1.2);
          t.rect(s, x, y, w, h, C.white, { shadow: 0.14, blur: 6, offset: 2, name: 'Sheet' });
          await plane(s, x, y, fl, fl * 0.7, [[0, 0], [1, 0], [0, 1]], C.pal[i][0]);
          t.img(s, await L.icon(it.icon, INK, 2), x + 0.08, y + 0.06, 0.34, 0.34);
          head(s, it.h, x + 0.14, y + 0.86, w - 0.28, 0.52, { max: 14 });
          body(s, it.t, x + 0.14, y + 1.4, w - 0.28, h - 1.48);
        }
      },
    ],
    process: [
      async (d) => { // the paper steps downward, each panel folded into the next
        const s = await page(d), n = d.steps.length, cw = 9 / n, w = cw - 0.1, h = 2.1, dy = (3.78 - h) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = 0.5 + i * cw, y = 1.3 + i * dy;
          if (i < n - 1) await plane(s, x + w - 0.02, y + 0.15, 0.14, dy, [[0, 0], [1, 1], [1, 0.4], [0, 0]], C.pal[i][1]);
          await fold(s, x, y, w, h, i, 0.3);
          t.text(s, String(i + 1), { x: x + 0.12, y: y + 0.06, w: 0.42, h: 0.44, bold: true, fontSize: 22, color: INK, valign: 'middle' });
          head(s, st.h, x + 0.5, y + 0.06, w - 0.86, 0.46, { max: 13 });
          body(s, st.t, x + 0.12, y + 0.56, w - 0.24, h - 0.62);
        }
      },
      async (d) => { // a zigzag crease runs down the middle, steps open to both sides
        const s = await page(d), n = d.steps.length, h = 1.25, dy = (3.78 - h) / (n - 1), Y = (i) => 1.32 + i * dy, zig = 8, zh = 3.8 / zig;
        for (let k = 0; k < zig; k++) await plane(s, 4.78, 1.3 + k * zh, 0.44, zh, k % 2 ? [[1, 0], [0, 1], [1, 1]] : [[0, 0], [1, 1], [0, 1]], C.pal[3][k % 2], 0.35);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, x = right ? 5.4 : 0.5, y = Y(i), w = 4.1;
          t.rect(s, x, y, w, h, C.white, { shadow: 0.14, blur: 6, offset: 2, name: 'Sheet' });
          await numTile(s, 4.72, y + 0.02, 0.56, i + 1, i);
          head(s, st.h, x + 0.14, y + 0.06, w - 0.28, 0.34, { max: 14 });
          body(s, st.t, x + 0.14, y + 0.42, w - 0.28, h - 0.48);
        }
      },
      async (d) => { // night: one ribbon folded down the page, an arrow point at every step
        const s = await nightPage(d), n = d.steps.length, gap = 0.06, h = (3.78 - gap * (n - 1)) / n;
        for (const [i, st] of d.steps.entries()) {
          const y = 1.32 + i * (h + gap), last = i === n - 1;
          await plane(s, 0.5, y, 1.1, h + (last ? 0 : gap + 0.1), last ? [[0, 0], [1, 0], [1, 1], [0, 1]] : [[0, 0], [1, 0], [1, 0.8], [0.5, 1], [0, 0.8]], C.pal[i][0]);
          t.text(s, String(i + 1), { x: 0.5, y: y + 0.02, w: 1.1, h: h - 0.12, bold: true, fontSize: 22, color: INK, align: 'center', valign: 'middle' });
          head(s, st.h, 1.85, y + 0.04, 2.6, h - 0.08, { color: C.white, max: 15 });
          body(s, st.t, 4.6, y + 0.04, 4.9, h - 0.08, { color: MIST, valign: 'middle' });
          if (!last) t.line(s, 1.85, y + h + gap / 2, 7.65, 0, C.muted, 0.75);
        }
      },
    ],
    stats: [
      async (d) => { // one big folded sheet, two small diamonds beside it
        const s = await page(d), [a, b, c] = d.stats;
        await fold(s, 0.5, 1.35, 4.6, 3.72, 2, 0.7);
        t.text(s, a.value, { x: 0.7, y: 1.75, w: 4.2, h: 1.55, bold: true, color: INK, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 4.1, 1.45, 72, 28, F.head, true) });
        body(s, a.label, 0.85, 3.35, 3.9, 1.5, { align: 'center', max: 16 });
        for (const [i, x] of [b, c].entries()) {
          const y = 1.35 + i * 1.12, dd = 1.05;
          await tile(s, 5.3, y, dd, i * 2 + 1);
          t.text(s, x.value, { x: 5.42, y, w: dd - 0.24, h: dd, bold: true, color: fg(i * 2 + 1), align: 'center', valign: 'middle', fontSize: L.fit(x.value, dd - 0.3, 0.45, 18, 8, F.head, true) });
          body(s, x.label, 6.5, y + 0.06, 3.0, dd - 0.12, { valign: 'middle', max: 14 });
        }
        if (d.note) body(s, d.note, 5.3, 3.65, 4.2, 1.42, { max: 12, color: C.muted, valign: 'middle' });
      },
      async (d) => { // night: three leaning planes, a fan half opened
        const s = await nightPage(d), w = 3.05, h = d.note ? 2.72 : 3.75, sk = 0.3 / w;
        for (const [i, x] of d.stats.entries()) {
          const px = 0.5 + i * 2.97, k = [0, 2, 1][i];
          await plane(s, px, 1.3, w, h, [[sk, 0], [1, 0], [1 - sk, 1], [0, 1]], C.pal[k][0]);
          await plane(s, px, 1.3, 0.3, h, [[1, 0], [0, 1], [0.6, 1]], C.pal[k][1]);
          t.text(s, x.value, { x: px + 0.38, y: 1.38, w: w - 0.72, h: 1.1, bold: true, color: INK, align: 'center', valign: 'middle', fontSize: L.fit(x.value, w - 0.82, 1.0, 46, 18, F.head, true) });
          body(s, x.label, px + 0.34, 2.5, w - 0.72, h - 1.28, { align: 'center', max: 14, valign: 'top' });
        }
        if (d.note) body(s, d.note, 0.6, 4.14, 8.8, 1.02, { color: MIST, max: 13, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // an open sheet: two wings meeting at one crease, reading away from it
        const s = await page(d), y = 1.3, h = 3.8;
        for (const [i, side] of [d.left, d.right].entries()) {
          const k = i ? 1 : 0, x = i ? 5 : 0.5, a = i ? 'left' : 'right', n = side.items.length, rh = 3.0 / n, tx = i ? 5.3 : 0.75, tw = 3.95;
          await plane(s, x, y, 4.5, h, i ? [[0, 0], [1, 0.08], [1, 0.92], [0, 1]] : [[0, 0.08], [1, 0], [1, 1], [0, 0.92]], C.pal[k][0]);
          head(s, side.h, tx, y + 0.3, tw, 0.5, { max: 18, align: a });
          side.items.forEach((it, j) => body(s, it, tx, y + 0.8 + j * rh * 0.92, tw, rh * 0.92 - 0.04, { align: a, valign: 'middle', max: 14 }));
        }
        await plane(s, 4.88, y, 0.12, h, [[1, 0], [1, 1], [0, 0.98], [0, 0.02]], C.pal[0][1]);
        await plane(s, 5, y, 0.12, h, [[0, 0], [1, 0.02], [1, 0.98], [0, 1]], C.pal[1][1]);
      },
      async (d) => { // two long ribbons, a white slip tucked under each for every point
        const s = await page(d), h = 1.8;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.32 + i * (h + 0.14), k = i ? 3 : 4, n = side.items.length, cw = 6.5 / n;
          await ribbon(s, 0.5, y + 0.5, 2.5, 0.8, k, false);
          head(s, side.h, 0.78, y + 0.5, 1.95, 0.8, { align: 'center', max: 14 });
          for (const [j, it] of side.items.entries()) {
            const x = 3.0 + j * cw;
            t.rect(s, x, y, cw - 0.1, h, C.white, { shadow: 0.12, blur: 5, offset: 2, name: 'Slip' });
            await plane(s, x + cw - 0.36, y, 0.26, 0.26, [[0, 0], [1, 1], [0, 1]], C.pal[k][1]);
            body(s, it, x + 0.1, y + 0.1, cw - 0.3, h - 0.2, { valign: 'middle' });
          }
        }
      },
    ],
    statement: [
      async (d) => { // night: a crane lifts off from the corner, the thought flies ahead of it
        const s = await nightPage(d), bottom = d.caption ? 3.75 : 5.1;
        t.img(s, await craneImg(0), 7.05, 3.25, 2.45, 1.84);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 8.8, h: bottom - 1.3, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 8.8, bottom - 1.4, 36, 18, F.head, true) });
        if (d.caption) body(s, d.caption, 0.6, 3.85, 6.3, 1.3, { color: MIST, max: 14 });
      },
      async (d) => { // one wide sheet with a crease across it: the thought above, the note below
        const s = await page(d), y = 1.28, h = 3.85;
        await plane(s, 0, y, W, h, [[0, 0], [1, 0], [1, 0.62], [0, 0.78]], C.pal[2][0]);
        await plane(s, 0, y, W, h, [[0, 0.78], [1, 0.62], [1, 1], [0, 1]], C.pal[2][1]);
        t.text(s, L.runs(d.text), { x: 0.6, y: y + 0.1, w: 8.8, h: 2.2, bold: true, color: INK, valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.1, 32, 16, F.head, true) });
        if (d.caption) body(s, d.caption, 2.4, y + 2.68, 7.0, 1.12, { max: 14, valign: 'middle', align: 'right' });
      },
    ],
    timeline: [
      async (d) => { // a zigzag paper strip across the page, years above and below its points
        const s = await page(d), cy = 3.2, X = (i) => 0.5 + i * 2.08, w = 2.76, h = 1.62;
        for (let k = 0; k < 18; k++) await plane(s, 0.5 + k * 0.5, cy - 0.11, 0.5, 0.22, k % 2 ? [[0, 1], [0.5, 0], [1, 1]] : [[0, 0], [1, 0], [0.5, 1]], k % 2 ? C.pal[4][1] : C.pal[4][0]);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = X(i), y = up ? cy - 0.2 - h : cy + 0.2;
          await fold(s, x, y, w, h, i + 1, 0.26);
          t.text(s, it.year, { x: x + 0.12, y: y + 0.05, w: w - 0.5, h: 0.34, bold: true, color: INK, valign: 'middle', fontSize: L.fit(it.year, w - 0.5, 0.32, 16, 10, F.head, true) });
          head(s, it.h, x + 0.12, y + 0.38, w - 0.24, 0.28, { max: 12 });
          body(s, it.t, x + 0.12, y + 0.67, w - 0.24, h - 0.72, { max: 12 });
        }
      },
      async (d) => { // night: a crane for every year, flying higher each time
        const s = await nightPage(d), cw = 2.25, Y = (i) => 2.68 - i * 0.46;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * cw, y = Y(i), w = cw - 0.14;
          t.img(s, await craneImg(i + 1), x, y, 0.7, 0.52);
          t.text(s, it.year, { x: x + 0.72, y, w: w - 0.72, h: 0.52, bold: true, color: C.pal[(i + 1) % 6][0], valign: 'middle', fontSize: L.fit(it.year, w - 0.72, 0.5, 16, 10, F.head, true) });
          head(s, it.h, x, y + 0.56, w, 0.34, { color: C.white, max: 13 });
          body(s, it.t, x, y + 0.92, w, 5.15 - (y + 0.92), { color: MIST, max: 13 });
        }
      },
      async (d) => { // four paper bookmarks with notched feet, long and short in turn
        const s = await page(d), cw = 2.25, w = cw - 0.14;
        for (const [i, it] of d.items.entries()) {
          const x = 0.5 + i * cw, h = i % 2 ? 3.8 : 3.3, notch = 0.26 / h;
          await plane(s, x, 1.3, w, h, [[0, 0], [1, 0], [1, 1], [0.5, 1 - notch], [0, 1]], C.pal[(i + 1) % 6][0]);
          await plane(s, x, 1.3, w, 0.5, [[0, 0], [1, 0], [1, 1], [0, 1]], C.pal[(i + 1) % 6][1]);
          t.text(s, it.year, { x: x + 0.06, y: 1.3, w: w - 0.12, h: 0.5, bold: true, color: INK, align: 'center', valign: 'middle', fontSize: L.fit(it.year, w - 0.2, 0.46, 16, 10, F.head, true) });
          head(s, it.h, x + 0.12, 1.86, w - 0.24, 0.32, { max: 13 });
          body(s, it.t, x + 0.12, 2.2, w - 0.24, 3.3 - 0.26 - 0.96, { max: 13 });
        }
      },
    ],
  };
  R.timeline = V.timeline.shift(); // the old timeline ribbons looked like the process ribbons
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Origami', colors: { dk1: C.ink, lt1: C.white, dk2: '3A4550', lt2: C.bg, accent1: C.pal[0][0], accent2: C.pal[1][0], accent3: C.pal[2][0], accent4: C.pal[3][0], accent5: C.pal[4][0], accent6: C.pal[5][0], hlink: C.pal[3][1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "nafis va aniq: har bir fikr tartib bilan 'buklangan', qisqa va ravon", limits: {}, prefer: null };
module.exports = { id: 61, slug: 'origami', name: 'Origami', category: 'creative', photos: true, build, style: STYLE };
