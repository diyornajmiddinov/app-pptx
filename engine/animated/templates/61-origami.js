/**
 * 61 Origami — folded paper: flat colour planes with a darker folded flap, paper cranes,
 * folded ribbons for steps and timeline, crisp diagonal folds on a clean paper ground.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: 'F7F5F0', ink: '26303A', muted: '66707A', white: 'FFFFFF',
  pal: [['F28B82', 'D9665D'], ['4DB6AC', '2E9488'], ['F6C453', 'D9A22C'], ['7E8CE0', '5866C4'], ['8BC48A', '62A461'], ['F4A6C6', 'D97FA6']] };
const F = { head: 'Arial', body: 'Calibri' };
const fg = (k) => ([2, 4, 5].includes(k % 6) ? '26303A' : 'FFFFFF'); // readable text on each paper colour

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
        t.text(s, side.h, { x: x + 0.3, y: 1.55, w: w - 1.0, h: 0.6, fontSize: 18, bold: true, color: C.white, valign: 'middle' });
        let y = 2.25;
        side.items.forEach((it, j) => { t.shape(s, 'RIGHT_TRIANGLE', { x: x + 0.3, y: y + 0.07, w: 0.16, h: 0.16, fill: { color: C.white }, objectName: 'Bullet' }); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[j], fontSize: fs, color: C.white }); y += rows[j]; });
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Origami', colors: { dk1: C.ink, lt1: C.white, dk2: '3A4550', lt2: C.bg, accent1: C.pal[0][0], accent2: C.pal[1][0], accent3: C.pal[2][0], accent4: C.pal[3][0], accent5: C.pal[4][0], accent6: C.pal[5][0], hlink: C.pal[3][1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "nafis va aniq: har bir fikr tartib bilan 'buklangan', qisqa va ravon", limits: {}, prefer: null };
module.exports = { id: 61, slug: 'origami', name: 'Origami', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "playful"], "transitions": ["p14:flip|dir=\"r\"", "p14:prism", "fade"], "cover": ["unfold", "stretch"], "mark": "diamond", "deco": "unfold", "sig": {"title": "unfold", "body": "fade", "item": ["stretch", "unfold"], "image": "diamond", "number": "diamond", "order": "alternate", "stagger": 0.16}, "tempo": 1.05, "kenburns": false};
