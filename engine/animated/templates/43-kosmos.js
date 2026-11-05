/**
 * 43 Kosmos — deep space: star fields and nebulae, glossy planets as numbers and markers,
 * dashed orbits and trajectories, photos seen through a spaceship porthole.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { space: '0B1026', panel: '141B3D', line: '3A4378', text: 'E8ECFF', muted: '9AA3C7', planets: ['F28C38', '3CC6C6', '8B6CFF', 'FF6FA8', 'FFD166', '5BA8FF'] };
const F = { head: 'Arial', body: 'Calibri' };

const skySvg = (seed) => {
  let x = seed; const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  let stars = ''; for (let i = 0; i < 160; i++) { const r = rnd() < 0.9 ? 0.8 + rnd() * 1.4 : 2.4 + rnd() * 1.5; stars += `<circle cx="${(rnd() * 1600).toFixed(0)}" cy="${(rnd() * 900).toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(0.35 + rnd() * 0.6).toFixed(2)}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><radialGradient id="g" cx="0.35" cy="0.4" r="0.9"><stop offset="0" stop-color="#1A2350"/><stop offset="1" stop-color="#05081A"/></radialGradient><filter id="b"><feGaussianBlur stdDeviation="60"/></filter></defs>
  <rect width="1600" height="900" fill="url(#g)"/><g filter="url(#b)" opacity="0.45"><ellipse cx="${300 + rnd() * 900}" cy="${200 + rnd() * 400}" rx="380" ry="160" fill="#6A3FB5"/><ellipse cx="${500 + rnd() * 900}" cy="${300 + rnd() * 400}" rx="320" ry="140" fill="#1E7F9E"/></g>${stars}</svg>`;
};
const planetSvg = (color, ring) => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><radialGradient id="p" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.35" stop-color="#${color}"/><stop offset="1" stop-color="#${color}" stop-opacity="0.55"/></radialGradient></defs>
  ${ring ? `<ellipse cx="200" cy="200" rx="195" ry="52" fill="none" stroke="#${color}" stroke-opacity="0.6" stroke-width="10" transform="rotate(-18 200 200)"/>` : ''}
  <circle cx="200" cy="200" r="${ring ? 120 : 190}" fill="url(#p)"/><circle cx="200" cy="200" r="${ring ? 120 : 190}" fill="#000" opacity="0.18" transform="translate(30 30)" clip-path="none"/></svg>`;

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const sky = await L.svg(skySvg(5), 1600, 900, true), sky2 = await L.svg(skySvg(19), 1600, 900, true);
  const memo = {}; const planetImg = async (k, ring) => (memo[k + ':' + ring] ??= await L.svg(planetSvg(C.planets[k % 6], ring), 400, 400));
  const planet = async (s, x, y, d, k, txt, ring = false) => {
    t.img(s, await planetImg(k, ring), x, y, d, d);
    if (txt !== undefined) t.text(s, String(txt), { x, y, w: d, h: d, fontSize: Math.round(d * 24), bold: true, color: '0B1026', align: 'center', valign: 'middle' });
  };
  const porthole = async (s, src, x, y, d) => {
    t.oval(s, x - 0.14, y - 0.14, d + 0.28, d + 0.28, '6E7699', { line: { color: 'C9CEE3', width: 2 } });
    for (let k = 0; k < 12; k++) { const a = (k / 12) * 2 * Math.PI, r = d / 2 + 0.07; t.oval(s, x + d / 2 + r * Math.cos(a) - 0.03, y + d / 2 + r * Math.sin(a) - 0.03, 0.06, 0.06, 'DDE1F0'); }
    t.img(s, await L.photo(L.src(src), d, d, { mask: 'circle' }), x, y, d, d, { alt: '' });
  };
  const panel = (s, x, y, w, h) => t.rect(s, x, y, w, h, C.panel, { t: 15, r: 0.12, line: { color: C.line, width: 1 }, name: 'Panel' });
  const footer = (s) => t.text(s, `${M.topic || ''}   \u2022   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontSize: 8.5, color: C.muted });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { data: idx % 2 ? sky : sky2 }; idx++;
    await planet(s, 0.55, 0.38, 0.62, idx, idx);
    if (d.title) t.text(s, d.title, { x: 1.4, y: 0.38, w: 8.0, h: 0.62, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.title, 8.0, 0.62, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.text, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { data: sky }; idx++;
    await planet(s, 6.6, 2.7, 4.2, 0, undefined, true);
    if (d.image) await porthole(s, d.image, 6.6, 0.55, 2.4);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  ').toUpperCase(), { x: 0.6, y: 0.6, w: 5.5, h: 0.3, fontSize: 11, bold: true, color: C.planets[1], charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 0.95, w: 5.6, h: 2.4, bold: true, fontSize: L.fit(d.title, 5.6, 2.3, 42, 22, F.head, true), color: C.text, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.5, w: 5.4, h: 0.75, fontSize: 14, color: C.muted });
    t.text(s, M.author || '', { x: 0.6, y: 4.4, w: 5.4, h: 0.35, fontSize: 15, bold: true, color: C.planets[0] });
    footer(s);
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await porthole(s, d.image, 0.9, 1.45, 3.3); para(s, d.text, 4.8, 1.4, 4.6, 3.5); },
    async image(d) { const s = await page(d); para(s, d.text, 0.6, 1.4, 4.5, 3.5); await porthole(s, d.image, 5.8, 1.45, 3.3); },
    async agenda(d) {
      const s = await page(d), n = d.items.length;
      t.oval(s, -1.6, 1.65, 3.6, 3.2, null, { line: { color: C.line, width: 1.25, dashType: 'dash' } });
      for (const [i, it] of d.items.entries()) {
        const a = -1.15 + (2.3 * i) / Math.max(1, n - 1), cx = 0.2 + 1.8 * Math.cos(a), cy = 3.25 + 1.6 * Math.sin(a);
        await planet(s, cx - 0.27, cy - 0.27, 0.54, i, i + 1);
        t.text(s, it, { x: cx + 0.45, y: cy - 0.27, w: 6.5, h: 0.54, fontSize: 18, bold: true, color: C.text, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.25, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.4, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        panel(s, x, 1.5, w, h);
        await planet(s, x + 0.2, 1.68, 0.6, i);
        t.img(s, await L.icon(it.icon, '0B1026', 2.5), x + 0.36, 1.84, 0.28, 0.28);
        t.text(s, it.h, { x: x + 0.2, y: 2.4, w: w - 0.4, h: 0.45, fontSize: L.fit(it.h, w - 0.4, 0.45, 17, 12, F.head, true), bold: true, color: C.text });
        t.text(s, it.t, { x: x + 0.2, y: 2.85, w: w - 0.4, h: h - 1.45, fontSize: 14, color: C.muted });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      const path = `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="120"><path d="M30,100 C300,0 580,0 860,60" fill="none" stroke="#${C.line}" stroke-width="3" stroke-dasharray="10 8"/></svg>`;
      t.img(s, await L.svg(path, 880, 120), 0.6, 1.3, 8.8, 1.2);
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw, dd = 0.55 + i * 0.12;
        await planet(s, x + 0.1, 1.55 - i * 0.04, dd, i + 1, i + 1);
        t.text(s, st.h, { x, y: 2.5, w: cw - 0.3, h: 0.45, fontSize: L.fit(st.h, cw - 0.3, 0.45, 17, 12, F.head, true), bold: true, color: C.text });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.3, h: 2.0, fontSize: L.fit(st.t, cw - 0.3, 2.0, 15, 11, F.body), color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.8 / n, dd = Math.min(2.0, cw - 0.6);
      for (const [i, x] of d.stats.entries()) {
        const cx = 0.6 + i * cw + cw / 2;
        await planet(s, cx - dd / 2, 1.35, dd, i * 2);
        t.text(s, x.value, { x: cx - dd / 2 + 0.15, y: 1.35, w: dd - 0.3, h: dd, fontSize: L.fit(x.value, dd - 0.45, 0.8, 40, 16, F.head, true), bold: true, color: '0B1026', align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: cx - cw / 2 + 0.15, y: 1.5 + dd, w: cw - 0.3, h: 0.9, fontSize: 14, color: C.text, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.6, w: 8.8, h: 0.45, fontSize: 10, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.25;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.75, F.body, 0.2, 4.85 - 2.35);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3);
        panel(s, x, 1.45, w, 3.45);
        await planet(s, x + 0.2, 1.62, 0.5, i ? 1 : 0);
        t.text(s, side.h, { x: x + 0.85, y: 1.62, w: w - 1.0, h: 0.5, fontSize: 18, bold: true, color: C.planets[i ? 1 : 0], valign: 'middle' });
        let y = 2.35;
        side.items.forEach((it, k) => { t.text(s, '\u2726', { x: x + 0.25, y, w: 0.3, h: 0.3, fontSize: 11, color: C.planets[i ? 1 : 0] }); t.text(s, it, { x: x + 0.6, y, w: w - 0.8, h: rows[k], fontSize: CFS, color: C.text }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      t.oval(s, 1.2, 1.25, 7.6, 3.4, null, { line: { color: C.line, width: 1, dashType: 'dash' } });
      t.oval(s, 2.0, 1.6, 6.0, 2.7, null, { line: { color: C.line, width: 0.75 } });
      await planet(s, 7.9, 1.25, 0.5, 3);
      t.text(s, L.runs(d.text), { x: 2.0, y: 1.75, w: 6.0, h: 1.6, bold: true, fontSize: L.fit(d.text, 6.0, 1.5, 32, 18, F.head, true), color: C.text, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 2.2, y: 3.35, w: 5.6, h: 0.9, fontSize: L.fit(d.caption, 5.6, 0.9, 13, 9, F.body), color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      t.line(s, 0.6, 2.25, 8.8, 0, C.line, 1.5, { dash: 'dash' });
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * cw;
        await planet(s, x, 1.95, 0.6, i + 2);
        t.text(s, it.year, { x: x + 0.7, y: 1.95, w: cw - 0.8, h: 0.6, fontSize: L.fit(it.year, cw - 0.85, 0.55, 22, 11, F.head, true), bold: true, color: C.planets[(i + 2) % 6], valign: 'middle' });
        t.text(s, it.h, { x, y: 2.8, w: cw - 0.3, h: 0.42, fontSize: 16, bold: true, color: C.text });
        t.text(s, it.t, { x, y: 3.25, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.muted });
      }
    },
    async quote(d) {
      const s = await page({});
      await planet(s, 7.6, 3.0, 2.6, 2, undefined, true);
      t.text(s, d.text, { x: 0.9, y: 1.2, w: 6.8, h: 2.6, italic: true, fontSize: L.fit(d.text, 6.8, 2.5, 32, 18, F.head, false, 1, true), color: C.text, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 0.9, y: 3.95, w: 6.8, h: 0.4, fontSize: 15, bold: true, color: C.planets[4] });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.58, 3.55 / n);
      d.items.forEach((it, i) => {
        const y = 1.4 + i * rh;
        t.text(s, '\u2726', { x: 0.6, y, w: 0.4, h: rh, fontSize: 14, color: C.planets[i % 6], valign: 'middle' });
        t.text(s, it, { x: 1.05, y, w: 8.35, h: rh, fontSize: L.fit(it, 8.35, rh - 0.04, 14, 10, F.body), color: C.text, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, out among the planets: a deck's pages must not look alike (L.pages)
  const X0 = 0.6, FW = 8.8, Y1 = 5.12, PL = C.planets, INK = C.space;
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10.5, F.head, true), color: o.color || C.text, align: o.align, valign: o.valign || 'middle' });
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.text, align: o.align, valign: o.valign || 'top' });
  const dash = (w, h, d, color = C.muted, sw = 2.5) => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="none" stroke="#${color}" stroke-width="${sw}" stroke-dasharray="9 7"/></svg>`, w, h);
  const iconPlanet = async (s, x, y, D, k, ic) => { await planet(s, x, y, D, k); t.img(s, await L.icon(ic, INK, 2.5), x + D * 0.27, y + D * 0.27, D * 0.46, D * 0.46); };
  const V = {
    image: [
      async (d) => { // the viewing deck: one long window across the ship, the log below it
        const s = await page(d), y = 1.2, h = 1.96;
        t.rect(s, X0 - 0.05, y - 0.05, FW + 0.1, h + 0.1, '6E7699', { r: 0.18, line: { color: 'C9CEE3', width: 1.5 }, name: 'Window frame' });
        t.img(s, await L.photo(L.src(d.image), FW, h, { mask: { r: 0.18 } }), X0, y, FW, h, { alt: d.title });
        panel(s, X0 - 0.05, 3.28, FW + 0.1, 1.84);
        para(s, d.text, X0 + 0.15, 3.34, FW - 0.3, 1.72);
      },
      async (d) => { // the porthole on the far wall, its orbit traced round it, a moon on the line
        const s = await page(d), D = 3.0, x = 6.0, y = 1.72;
        t.img(s, await dash(440, 400, 'M220,4 a216,196 0 1 0 0.01,0'), 5.3, 1.22, 4.4, 4.0);
        await porthole(s, d.image, x, y, D);
        await planet(s, 5.2, 1.55, 0.54, 1);
        panel(s, X0, 1.3, 4.45, 3.8);
        para(s, d.text, X0 + 0.2, 1.4, 4.05, 3.6);
      },
      async (d) => { // the whole sky is the picture, tinted to deep space, a mission panel on it
        const s = pres.addSlide(); s.background = { data: sky }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, H, { duo: [C.space, '9FB4FF'] }), 0, 0, W, H, { alt: d.title });
        t.rect(s, 0.4, 0.42, 5.5, 4.56, C.space, { t: 12, r: 0.14, line: { color: C.line, width: 1 }, name: 'Panel' });
        await planet(s, 0.6, 0.6, 0.56, idx, idx);
        head(s, d.title, 1.3, 0.56, 4.4, 0.66, { max: 18 });
        para(s, d.text, 0.68, 1.34, 4.95, 3.5);
        t.rect(s, 0, 5.14, W, 0.36, C.space, { t: 25, name: 'Footer band' });
        footer(s);
      },
      async (d) => { // the limb of a world filling the right side: the picture on its curve
        const s = pres.addSlide(); s.background = { data: idx % 2 ? sky : sky2 }; idx++;
        t.img(s, await L.photo(L.src(d.image), 5.2, H, { mask: { path: 'M1,0 L0.28,0 Q-0.12,0.5 0.28,1 L1,1 Z' } }), 4.8, 0, 5.2, H, { alt: d.title });
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="562"><path d="M146,0 Q-62,281 146,562" fill="none" stroke="#${PL[1]}" stroke-width="5"/></svg>`, 520, 562), 4.8, 0, 5.2, H);
        await planet(s, 0.55, 0.38, 0.62, idx, idx);
        head(s, d.title, 1.4, 0.38, 3.55, 0.76, { max: 20 });
        para(s, d.text, X0, 1.3, 4.25, 3.8);
        t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.22, w: 4.5, h: 0.25, fontSize: 7, color: C.muted });
      },
    ],
    cards: [
      async (d) => { // a solar system: a sun off the page, each idea on an orbit further out
        const s = await page(d), n = d.items.length, h = 3.8 / n, y0 = 1.3, cy = y0 + 1.9;
        const sx = (y) => 0.3 + 1.05 * (1 - ((y - cy) / 2.6) ** 2);
        t.img(s, await planetImg(0, false), -2.2, cy - 2.3, 4.0, 4.0);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h, my = y + h / 2, x = sx(my) + 0.6, D = Math.min(0.66, h - 0.16);
          await iconPlanet(s, x, my - D / 2, D, i + 1, it.icon);
          const tx = 3.0;
          t.line(s, x + D + 0.04, my, tx - x - D - 0.1, 0, C.line, 1, { dash: 'dash' });
          head(s, it.h, tx, y + 0.05, 6.4, 0.3);
          body(s, it.t, tx, y + 0.35, 6.4, h - 0.4, { max: 13.5 });
        }
      },
      async (d) => { // a constellation: panels at two heights, a dashed line star to star
        const s = await page(d), n = d.items.length, g = 0.16, w = (FW - g * (n - 1)) / n, h = 2.92, ys = [1.26, 2.18];
        const star = (i) => [(i * (w + g) + 0.26) * 100, (ys[i % 2] - 1.2 + 0.32) * 100];
        let p = ''; for (let i = 0; i < n - 1; i++) { const [a, b] = star(i), [c, e] = star(i + 1); p += `M${a},${b} L${c},${e} `; }
        t.img(s, await dash(Math.round(FW * 100), 200, p, PL[4], 2.5), X0, 1.2, FW, 2);
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + g), y = ys[i % 2];
          t.rect(s, x, y, w, h, C.panel, { r: 0.12, line: { color: C.line, width: 1 }, name: 'Panel' });
          await iconPlanet(s, x + 0.14, y + 0.12, 0.42, i, it.icon);
          head(s, it.h, x + 0.62, y + 0.08, w - 0.72, 0.5, { max: 13 });
          body(s, it.t, x + 0.14, y + 0.64, w - 0.28, h - 0.72, { max: 13 });
        }
      },
      async (d) => { // the ringed planet at the hub, orbits round it, a panel out on each side
        const s = await page(d), n = d.items.length, w = 3.25, left = 2, right = n - left, hL = 1.92, hR = 3.84 / right, cx = 5, cy = 3.2;
        t.img(s, await dash(300, 300, 'M150,3 a147,147 0 1 0 0.01,0'), cx - 1.5, cy - 1.5, 3, 3);
        await planet(s, cx - 0.95, cy - 0.95, 1.9, 2, undefined, true);
        for (const [i, it] of d.items.entries()) {
          const onL = i < left, H_ = onL ? hL : hR, x = onL ? X0 : 6.15, hh = Math.min(H_ - 0.12, 1.82), y = onL ? 1.28 + i * H_ : right === 1 ? cy - hh / 2 : 1.28 + (i - left) * H_;
          panel(s, x, y, w, hh);
          await iconPlanet(s, x + 0.12, y + 0.1, 0.38, i, it.icon);
          head(s, it.h, x + 0.56, y + 0.08, w - 0.68, 0.42, { max: 13 });
          body(s, it.t, x + 0.14, y + 0.54, w - 0.28, hh - 0.62, { max: 13 });
        }
      },
      async (d) => { // the home world: one great planet and its story, the others small and far
        const s = await page(d), [a, ...rest] = d.items, D = 1.5, g = 0.12, h = (3.84 - g * (rest.length - 1)) / rest.length;
        await planet(s, X0, 1.24, D, 5);
        t.img(s, await L.icon(a.icon, INK, 2.5), X0 + 0.45, 1.69, 0.6, 0.6);
        head(s, a.h, X0 + D + 0.14, 1.34, 2.65, 1.3, { max: 21 });
        body(s, a.t, X0, 2.86, 4.3, 2.26, { max: 17 });
        for (const [i, it] of rest.entries()) {
          const y = 1.28 + i * (h + g);
          panel(s, 5.2, y, 4.2, h);
          await iconPlanet(s, 5.32, y + 0.1, 0.34, i + 1, it.icon);
          head(s, it.h, 5.76, y + 0.06, 3.52, 0.38, { max: 14 });
          body(s, it.t, 5.34, y + 0.46, 3.94, h - 0.54, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // lift-off: stages climb to the right, flames of colour at each one's foot
        const s = await page(d), n = d.steps.length, g = 0.14, w = (FW - g * (n - 1)) / n, drop = n === 3 ? 0.42 : 0.3;
        for (const [i, st] of d.steps.entries()) {
          const x = X0 + i * (w + g), y = 1.26 + (n - 1 - i) * drop, h = Y1 - y;
          panel(s, x, y, w, h);
          t.rect(s, x, y + h - 0.08, w, 0.08, PL[i % 6], { name: 'Stage' });
          await planet(s, x + 0.12, y + 0.1, 0.56, i + 1, i + 1);
          head(s, st.h, x + 0.74, y + 0.1, w - 0.84, 0.56, { max: 13 });
          body(s, st.t, x + 0.14, y + 0.76, w - 0.28, h - 0.9, { max: 13 });
        }
      },
      async (d) => { // a dashed flight line straight down: planets on it, the steps left and right
        const s = await page(d), n = d.steps.length, y0 = 1.28, h = 3.84 / n, cx = 5, B = 0.5;
        t.line(s, cx, y0 + h / 2, 0, h * (n - 1), C.muted, 1.5, { dash: 'dash' });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? X0 : 5.45, w = 3.95, al = left ? 'right' : 'left';
          await planet(s, cx - B / 2, y + h / 2 - B / 2, B, i + 1, i + 1);
          head(s, st.h, x, y + 0.03, w, 0.3, { align: al });
          body(s, st.t, x, y + 0.33, w, h - 0.37, { align: al, max: 13 });
        }
      },
      async (d) => { // re-entry: each panel lower and further along the glide path
        const s = await page(d), n = d.steps.length, g = 0.1, h = (3.84 - g * (n - 1)) / n, w = n === 3 ? 7.0 : 6.7, dx = (FW - w) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = X0 + i * dx, y = 1.28 + i * (h + g), D = Math.min(0.62, h - 0.16);
          panel(s, x, y, w, h);
          await planet(s, x + 0.12, y + (h - D) / 2, D, i + 3, i + 1);
          head(s, st.h, x + D + 0.26, y + 0.05, w - D - 0.4, 0.3, { max: 14 });
          body(s, st.t, x + D + 0.26, y + 0.35, w - D - 0.4, h - 0.41, { max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // a giant world with the first figure on it; two moons for the rest
        const s = await page(d), [a, ...rest] = d.stats, D = 2.72, D2 = 1.12;
        await planet(s, X0, 1.18, D, 1);
        t.text(s, a.value, { x: X0 + 0.25, y: 1.18, w: D - 0.5, h: D, bold: true, fontSize: L.fit(a.value, D - 0.5, 1.0, 48, 22, F.head, true), color: INK, align: 'center', valign: 'middle' });
        body(s, a.label, X0 + D + 0.1, 1.5, 1.72, 2.05, { max: 14, valign: 'middle' });
        for (const [i, q] of rest.entries()) {
          const y = 1.24 + i * 1.32;
          await planet(s, 5.35, y, D2, i ? 4 : 0);
          t.text(s, q.value, { x: 5.42, y, w: D2 - 0.14, h: D2, bold: true, fontSize: L.fit(q.value, D2 - 0.2, 0.6, 20, 11, F.head, true), color: INK, align: 'center', valign: 'middle' });
          body(s, q.label, 6.6, y + 0.02, 2.8, D2 - 0.04, { max: 14, valign: 'middle' });
        }
        if (d.note) { panel(s, X0, 3.98, FW, 1.14); body(s, d.note, X0 + 0.18, 4.04, FW - 0.36, 1.02, { max: 13.5, valign: 'middle' }); }
      },
      async (d) => { // mission control: three lit readouts, the figure in the instrument's type
        const s = await page(d), h = 0.86, g = 0.08;
        for (const [i, q] of d.stats.entries()) {
          const y = 1.28 + i * (h + g);
          panel(s, X0, y, FW, h);
          t.rect(s, X0 + 0.1, y + 0.1, 0.1, h - 0.2, PL[i * 2 % 6], { name: 'Lamp' });
          t.text(s, q.value, { x: X0 + 0.32, y, w: 2.8, h, fontFace: 'Courier New', bold: true, fontSize: L.fit(q.value, 2.8, h - 0.16, 30, 16, 'Courier New', true), color: PL[i * 2 % 6], valign: 'middle' });
          body(s, q.label, X0 + 3.25, y + 0.05, FW - 3.4, h - 0.1, { max: 15, valign: 'middle' });
        }
        if (d.note) body(s, d.note, X0, 4.12, FW, 1.0, { max: 13.5, valign: 'middle', color: C.text });
      },
    ],
    compare: [
      async (d) => { // two worlds face to face over a dashed frontier, each side reads away from it
        const s = await page(d), w = 3.7, y0 = 2.16, avail = 2.94, D = 0.74, fit = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.12, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        t.line(s, 5, 1.34, 0, 3.76, C.muted, 1.25, { dash: 'dash' });
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i ? 5.3 : 1.0, al = i ? 'left' : 'right', col = PL[i ? 1 : 0];
          await planet(s, i ? 5.15 : 5 - 0.15 - D, 1.3, D, i ? 1 : 0);
          head(s, side.h, i ? 5.15 + D + 0.12 : X0, 1.3, 5 - 0.15 - D - 0.12 - X0, D, { color: col, align: al, max: 17 });
          let y = y0;
          for (const [k, rh0] of fit.rows.entries()) { const rh = rh0 + extra; if (side.items[k]) t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: C.text, align: al, valign: 'middle' }); y += rh; }
        }
      },
      async (d) => { // two long hulls one over the other, a coloured nose naming each
        const s = await page(d), bh = 1.84, g = 0.14;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.28 + i * (bh + g), n = side.items.length, col = PL[i ? 1 : 0], x0 = 3.0, cw = (9.3 - x0) / n;
          panel(s, X0, y, FW, bh);
          t.rect(s, X0, y, 2.2, bh, col, { r: 0.12, name: 'Nose' });
          head(s, side.h, X0 + 0.14, y + 0.1, 1.92, bh - 0.2, { color: INK, max: 16 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.07, y + 0.2, 0, bh - 0.4, C.line, 1);
            body(s, it, x0 + k * cw, y + 0.1, cw - 0.14, bh - 0.2, { valign: 'middle', max: 13.5 });
          });
        }
      },
    ],
    statement: [
      async (d) => { // an eclipse: a black disc with fire round its rim, the words at its side
        const s = await page(d), D = 3.4, x = 0.75, y = 1.4;
        t.oval(s, x - 0.12, y - 0.12, D + 0.24, D + 0.24, PL[0], { t: 45, name: 'Corona' });
        t.oval(s, x - 0.05, y - 0.05, D + 0.1, D + 0.1, PL[4], { name: 'Corona' });
        t.oval(s, x, y, D, D, '03050F', { name: 'Eclipse' });
        t.text(s, L.runs(d.text), { x: 4.5, y: 1.3, w: 4.9, h: 2.2, bold: true, fontSize: L.fit(d.text, 4.9, 2.15, 28, 16, F.head, true), color: C.text, valign: 'middle' });
        if (d.caption) body(s, d.caption, 4.5, 3.58, 4.9, 1.52, { max: 14, color: C.muted, valign: 'middle' });
      },
      async (d) => { // landed: the surface of the orange planet is the page, craters in it, dark type
        const s = pres.addSlide(); s.background = { color: PL[0] }; idx++;
        [[8.0, 0.2, 1.6], [6.9, 3.9, 0.9], [0.2, 4.2, 1.3], [4.3, 0.1, 0.5], [9.0, 2.8, 0.7]].forEach(([x, y, r]) => t.oval(s, x, y, r, r, 'E27A28', { line: { color: 'C96716', width: 1.5 }, name: 'Crater' }));
        await planet(s, 0.55, 0.38, 0.62, 2, idx);
        if (d.title) head(s, d.title, 1.4, 0.38, 8.0, 0.62, { color: INK, max: 26 });
        t.text(s, L.runs(d.text), { x: X0, y: 1.2, w: FW, h: 2.4, bold: true, fontSize: L.fit(d.text, FW, 2.35, 38, 20, F.head, true), color: INK, valign: 'middle' });
        if (d.caption) { t.rect(s, X0, 3.72, FW, 1.38, INK, { r: 0.1, name: 'Panel' }); body(s, d.caption, X0 + 0.22, 3.78, FW - 0.44, 1.26, { max: 14, valign: 'middle' }); }
        t.text(s, `${M.topic || ''}   •   ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontSize: 8.5, color: INK });
      },
    ],
    timeline: [
      async (d) => { // a trajectory that swings across the page, a world at each date, notes on either side
        const s = await page(d), w = 4.0, xs = [X0, 1.1, 5.0, 5.4], px = [1.0, 3.5, 5.6, 8.2], py = [3.08, 3.3, 3.08, 3.3];
        t.img(s, await dash(880, 80, 'M0,48 C100,10 220,10 300,50 S520,90 600,48 S800,10 880,48', C.muted, 3), X0, 2.8, FW, 0.8);
        for (const [i, it] of d.items.entries()) {
          const up = i % 2 === 0, x = xs[i], D = 0.46, col = PL[(i + 2) % 6], y = up ? 1.26 : 3.56, h = up ? 2.76 - y : Y1 - y, al = up ? 'left' : 'right';
          await planet(s, px[i] - D / 2, py[i] - D / 2, D, i + 2);
          t.text(s, it.year, { x, y, w: 1.5, h: 0.32, bold: true, fontSize: L.fit(it.year, 1.5, 0.3, 16, 10.5, F.head, true), color: col, valign: 'middle' });
          head(s, it.h, x + 1.55, y, w - 1.55, 0.32, { max: 13, align: 'right' });
          body(s, it.t, x, y + 0.33, w, h - 0.35, { max: 14, align: al });
        }
      },
      async (d) => { // the logbook: four ports of call, two by two, a date on each planet's line
        const s = await page(d), w = 4.32, h = 1.84, g = 0.16;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + (i % 2) * (w + g), y = 1.28 + (i >> 1) * (h + 0.14), col = PL[(i + 1) % 6];
          panel(s, x, y, w, h);
          await planet(s, x + 0.12, y + 0.1, 0.5, i + 1);
          t.text(s, it.year, { x: x + 0.72, y: y + 0.08, w: 1.5, h: 0.54, bold: true, fontSize: L.fit(it.year, 1.5, 0.5, 18, 11, F.head, true), color: col, valign: 'middle' });
          head(s, it.h, x + 2.24, y + 0.08, w - 2.36, 0.54, { max: 13, align: 'right' });
          body(s, it.t, x + 0.16, y + 0.68, w - 0.32, h - 0.76, { max: 14 });
        }
      },
      async (d) => { // beams from four ringed worlds in a row, each carrying its entry down the page
        const s = await page(d), cw = FW / 4, D = 1.0;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * cw, w = cw - 0.14, col = PL[(i + 3) % 6];
          t.rect(s, x + w / 2 - 0.5, 2.1, 1.0, 3.02, col, { t: 88, name: 'Beam' });
          await planet(s, x + w / 2 - D / 2, 1.14, D, i + 3, undefined, true);
          t.text(s, it.year, { x, y: 2.14, w, h: 0.42, bold: true, fontSize: L.fit(it.year, w, 0.4, 18, 11, F.head, true), color: col, align: 'center', valign: 'middle' });
          head(s, it.h, x, 2.58, w, 0.46, { max: 13.5, align: 'center', valign: 'top' });
          body(s, it.t, x, 3.06, w, 2.04, { max: 13.5, align: 'center' });
        }
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old timeline read as the process page: a dashed line, planets, columns
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Kosmos', colors: { dk1: C.space, lt1: C.text, dk2: C.panel, lt2: C.muted, accent1: C.planets[0], accent2: C.planets[1], accent3: C.planets[2], accent4: C.planets[3], accent5: C.planets[4], accent6: C.planets[5], hlink: C.planets[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "ilhomlantiruvchi va keng ko'lamli: kelajakka qaratilgan, aniq maqsad va yo'nalishlar bilan", limits: {}, prefer: null };
module.exports = { id: 43, slug: 'kosmos', name: 'Kosmos', category: 'creative', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["energetic", "elegant"], "transitions": ["p14:vortex|dir=\"r\"", "p14:flythrough|dir=\"in\"", "p14:warp|dir=\"in\""], "cover": ["spinIn", "arcRight"], "mark": "spinIn", "deco": "curveUp", "sig": {"title": "arcRight", "body": "fadeUp", "item": ["arcLeft", "arcRight"], "image": "spinIn", "number": "spinIn", "order": "alternate", "stagger": 0.14}, "tempo": 1.0, "kenburns": true};
