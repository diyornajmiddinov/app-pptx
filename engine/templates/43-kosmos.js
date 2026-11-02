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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Kosmos', colors: { dk1: C.space, lt1: C.text, dk2: C.panel, lt2: C.muted, accent1: C.planets[0], accent2: C.planets[1], accent3: C.planets[2], accent4: C.planets[3], accent5: C.planets[4], accent6: C.planets[5], hlink: C.planets[1], folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "ilhomlantiruvchi va keng ko'lamli: kelajakka qaratilgan, aniq maqsad va yo'nalishlar bilan", limits: {}, prefer: null };
module.exports = { id: 43, slug: 'kosmos', name: 'Kosmos', category: 'creative', photos: true, build, style: STYLE };
