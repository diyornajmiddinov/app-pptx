/**
 * 68 Dengiz — nautical: navy-and-white sailor stripes, twisted rope frames, life-ring
 * numbers, signal-flag bunting, buoys on a wave line for the timeline.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { navy: '14284B', white: 'FFFFFF', red: 'C8102E', sand: 'F4EDE1', rope: 'C49A5A', rope2: '8C6A36', sea: '2F6690', ink: '14284B', muted: '5B6B80', flags: ['C8102E', 'F2C14E', '2F6690', 'FFFFFF', '14284B', '3FA34D'] };
const F = { head: 'Arial', body: 'Calibri' };

const ropeSvg = (w, h) => { let seg = ''; const s = 16;
  const run = (x1, y1, x2, y2) => { const len = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(len / s), dx = (x2 - x1) / len, dy = (y2 - y1) / len; let o = '';
    for (let k = 0; k < n; k++) { const cx = x1 + dx * (k * s + s / 2), cy = y1 + dy * (k * s + s / 2); o += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="10" ry="5" transform="rotate(${(Math.atan2(dy, dx) * 180 / Math.PI + 45).toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="#${k % 2 ? C.rope : C.rope2}"/>`; } return o; };
  seg += run(10, 10, w - 10, 10) + run(w - 10, 10, w - 10, h - 10) + run(w - 10, h - 10, 10, h - 10) + run(10, h - 10, 10, 10);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${seg}</svg>`; };
const flagSvg = (k) => { const c = C.flags; const designs = [
  `<rect width="60" height="60" fill="#${c[0]}"/><rect x="20" width="20" height="60" fill="#fff"/>`, `<rect width="60" height="60" fill="#${c[1]}"/><rect width="30" height="30" fill="#${c[4]}"/><rect x="30" y="30" width="30" height="30" fill="#${c[4]}"/>`,
  `<rect width="60" height="60" fill="#${c[2]}"/><rect x="15" y="15" width="30" height="30" fill="#fff"/>`, `<rect width="60" height="60" fill="#fff"/><rect y="20" width="60" height="20" fill="#${c[0]}"/>`,
  `<rect width="60" height="60" fill="#${c[1]}"/><polygon points="0,0 60,60 0,60" fill="#${c[0]}"/>`, `<rect width="60" height="60" fill="#${c[5]}"/><rect x="0" y="0" width="60" height="20" fill="#fff"/>`];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">${designs[k % 6]}<rect width="60" height="60" fill="none" stroke="#14284B" stroke-width="2"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const memo = {};
  const rope = async (s, x, y, w, h) => t.img(s, (memo[`r${w}${h}`] ??= await L.svg(ropeSvg(Math.round(w * 100), Math.round(h * 100)), w * 100, h * 100)), x, y, w, h);
  const flag = async (s, x, y, d, k) => t.img(s, (memo['f' + (k % 6)] ??= await L.svg(flagSvg(k), 60, 60)), x, y, d, d);
  const stripes = (s, y, h) => { for (let k = 0; k < 6; k++) t.rect(s, 0, y + k * (h / 6), W, h / 12, C.navy, { name: 'Stripe' }); };
  // life ring: white donut with four red bands, number in the middle
  const ringImg = async () => (memo.ring ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="96" fill="#fff" stroke="#${C.navy}" stroke-width="3"/>
    ${[0, 90, 180, 270].map((a0) => { const r1 = 96, r2 = 58, a = (a0 + 22) * Math.PI / 180, b = (a0 + 68) * Math.PI / 180; const p = (r, t) => `${(100 + r * Math.cos(t)).toFixed(1)},${(100 + r * Math.sin(t)).toFixed(1)}`;
      return `<path d="M${p(r1, a)} A${r1},${r1} 0 0 1 ${p(r1, b)} L${p(r2, b)} A${r2},${r2} 0 0 0 ${p(r2, a)} Z" fill="#${C.red}"/>`; }).join('')}
    <circle cx="100" cy="100" r="58" fill="#${C.sand}" stroke="#${C.navy}" stroke-width="3"/></svg>`, 200, 200));
  const lifering = async (s, x, y, d, n) => {
    t.img(s, await ringImg(), x, y, d, d);
    t.text(s, String(n), { x: x + d * 0.22, y: y + d * 0.22, w: d * 0.56, h: d * 0.56, fontSize: Math.max(9, Math.round(d * 16)), bold: true, color: C.navy, align: 'center', valign: 'middle' });
  };
  const panel = async (s, x, y, w, h, fill = C.white) => { t.rect(s, x, y, w, h, fill, { name: 'Panel' }); await rope(s, x - 0.06, y - 0.06, w + 0.12, h + 0.12); };
  const footer = (s) => { t.rect(s, 0, 5.25, W, 0.375, C.navy, { name: 'Hull' }); t.text(s, `${M.topic || ''}   \u2693   ${meta}`, { x: 0.4, y: 5.25, w: 9.2, h: 0.375, fontSize: 8.5, color: C.sand, valign: 'middle' }); };
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.sand }; idx++;
    stripes(s, 0, 0.24);
    await lifering(s, 0.45, 0.38, 0.72, idx);
    if (d.title) t.text(s, d.title, { x: 1.35, y: 0.38, w: 8.1, h: 0.72, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(d.title, 8.1, 0.72, 28, 16, F.head, true) });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });
  const photo = async (s, src, x, y, w, h) => { t.img(s, await L.photo(L.src(src), w, h), x, y, w, h, { alt: '' }); await rope(s, x - 0.1, y - 0.1, w + 0.2, h + 0.2); };

  const hero = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.navy }; idx++;
    for (let k = 0; k < 8; k++) await flag(s, 0.6 + k * 0.62, 0.3 + Math.abs(k - 3.5) * 0.05, 0.42, k);
    t.line(s, 0.5, 0.32, 5.1, 0, C.sand, 1);
    if (d.image) await photo(s, d.image, 6.0, 0.7, 3.4, 3.4);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2693  ').toUpperCase(), { x: 0.6, y: 1.0, w: 5.2, h: 0.3, fontSize: 11, bold: true, color: C.flags[1], charSpacing: 2 });
    t.text(s, d.title, { x: 0.6, y: 1.35, w: 5.2, h: 2.1, bold: true, fontSize: L.fit(d.title, 5.2, 2.0, 40, 20, F.head, true), color: C.white, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.55, w: 5.1, h: 0.75, fontSize: 13, color: 'C9D3E2' });
    t.text(s, M.author || '', { x: 0.6, y: 4.4, w: 5.1, h: 0.45, fontSize: 16, bold: true, color: C.white });
    t.text(s, `${M.topic || ''}   \u2693   ${meta}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.25, fontSize: 8.5, color: 'C9D3E2' });
  };

  const R = {
    cover: hero, closing: hero,
    async intro(d) { const s = await page(d); await photo(s, d.image, 0.7, 1.55, 3.7, 3.35); para(s, d.text, 4.85, 1.45, 4.6, 3.6); },
    async image(d) { const s = await page(d); para(s, d.text, 0.55, 1.45, 4.6, 3.6); await photo(s, d.image, 5.65, 1.55, 3.7, 3.35); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.1, 3.6 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.65 + Math.floor(i / per) * 4.45, y = 1.45 + (i % per) * rh;
        await flag(s, x, y, 0.55, i);
        t.text(s, `${i + 1}. ${it}`, { x: x + 0.75, y, w: 3.5, h: 0.55, fontSize: 16, bold: true, color: C.navy, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        await panel(s, x, 1.5, w, 3.5);
        await flag(s, x + 0.2, 1.68, 0.42, i);
        t.img(s, await L.icon(it.icon, C.navy, 2), x + w - 0.6, 1.7, 0.38, 0.38);
        t.text(s, it.h, { x: x + 0.2, y: 2.2, w: w - 0.4, h: 0.6, fontSize: L.fit(it.h, w - 0.4, 0.6, 16, 11, F.head, true), bold: true, color: C.navy, valign: 'middle' });
        t.text(s, it.t, { x: x + 0.2, y: 2.8, w: w - 0.4, h: 2.05, fontSize: 13, color: C.muted });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      t.line(s, 0.6 + 0.4, 1.85, cw * (n - 1), 0, C.sea, 2, { dash: 'dash' });
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        await lifering(s, x, 1.45, 0.8, i + 1);
        t.text(s, st.h, { x, y: 2.4, w: cw - 0.25, h: 0.55, fontSize: L.fit(st.h, cw - 0.25, 0.55, 16, 11, F.head, true), bold: true, color: C.navy, valign: 'middle' });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.25, h: 2.1, fontSize: 13, color: C.muted });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, gap = 0.35, w = (8.8 - gap * (n - 1)) / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * (w + gap);
        await panel(s, px, 1.5, w, 2.75, i === 1 ? C.navy : C.white);
        await flag(s, px + w / 2 - 0.22, 1.65, 0.44, i * 2);
        t.text(s, x.value, { x: px + 0.15, y: 2.1, w: w - 0.3, h: 1.0, fontSize: L.fit(x.value, w - 0.3, 0.95, 48, 20, F.head, true), bold: true, color: i === 1 ? C.white : C.red, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px + 0.2, y: 3.1, w: w - 0.4, h: 1.05, fontSize: 12, color: i === 1 ? 'C9D3E2' : C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.4, w: 8.8, h: 0.75, fontSize: 11, color: C.muted });
    },
    async compare(d) {
      const s = await page(d), w = 4.25;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.65, F.body, 0.18, 4.95 - 2.3);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3);
        await panel(s, x, 1.5, w, 3.5);
        t.rect(s, x, 1.5, w, 0.6, i ? C.navy : C.red, { name: 'Header' });
        t.text(s, side.h, { x: x + 0.2, y: 1.5, w: w - 0.4, h: 0.6, fontSize: 17, bold: true, color: C.white, valign: 'middle' });
        let y = 2.3;
        side.items.forEach((it, k) => { t.text(s, '\u2693', { x: x + 0.18, y, w: 0.3, h: 0.3, fontSize: 12, color: i ? C.navy : C.red }); t.text(s, it, { x: x + 0.5, y, w: w - 0.65, h: rows[k], fontSize: fs, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = await page(d);
      await panel(s, 0.9, 1.45, 8.2, 2.5, C.navy);
      t.text(s, L.runs(d.text), { x: 1.3, y: 1.55, w: 7.4, h: 2.3, bold: true, fontSize: L.fit(d.text, 7.4, 2.2, 34, 16, F.head, true), color: C.white, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 0.9, y: 4.1, w: 8.2, h: 1.0, fontSize: 13, color: C.muted, align: 'center' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      const wave = `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="40"><path d="M0,20 ${Array.from({ length: 22 }, (_, k) => `Q${k * 40 + 10},${k % 2 ? 34 : 6} ${k * 40 + 20},20 T${k * 40 + 40},20`).join(' ')}" fill="none" stroke="#${C.sea}" stroke-width="4"/></svg>`;
      t.img(s, await L.svg(wave, 880, 40), 0.6, 2.05, 8.8, 0.4);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.oval(s, x, 1.95, 0.42, 0.42, i % 2 ? C.navy : C.red, { line: { color: C.white, width: 2 } });
        t.text(s, it.year, { x: x + 0.5, y: 1.45, w: cw - 0.6, h: 0.5, fontSize: L.fit(it.year, cw - 0.65, 0.45, 22, 11, F.head, true), bold: true, color: C.navy, valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.6, w: cw - 0.25, h: 0.5, fontSize: 15, bold: true, color: C.navy });
        t.text(s, it.t, { x, y: 3.1, w: cw - 0.25, h: 1.95, fontSize: 13, color: C.muted });
      });
    },
    async quote(d) {
      const s = await page({});
      await panel(s, 1.2, 1.1, 7.6, 3.3);
      t.text(s, '\u2693', { x: 1.45, y: 1.25, w: 0.7, h: 0.7, fontSize: 30, color: C.red });
      t.text(s, d.text, { x: 2.1, y: 1.3, w: 6.4, h: 2.3, italic: true, bold: true, fontSize: L.fit(d.text, 6.4, 2.2, 28, 15, F.head, true), color: C.navy, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 2.1, y: 3.7, w: 6.4, h: 0.45, fontSize: 14, bold: true, color: C.red });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.6, 3.65 / n);
      for (const [i, it] of d.items.entries()) {
        const y = 1.45 + i * rh;
        await flag(s, 0.6, y + (rh - 0.34) / 2, 0.34, i);
        t.text(s, it, { x: 1.1, y, w: 8.35, h: rh, fontSize: 13, color: C.ink, valign: 'middle' });
      }
    },
  };
  // ---- further ways to draw a type, all on board: a deck's pages must not look alike (L.pages)
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.muted, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 16, 11, F.head, true), color: o.color || C.navy, align: o.align, valign: o.valign || 'middle' });
  const nightPage = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.navy }; idx++;
    for (let k = 0; k < 14; k++) await flag(s, 0.35 + k * 0.68, 0.14, 0.26, k);
    t.line(s, 0, 0.14, W, 0, C.sand, 1);
    t.text(s, d.title, { x: 0.6, y: 0.5, w: 8.8, h: 0.68, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.title, 8.8, 0.68, 28, 16, F.head, true) });
    t.text(s, `${M.topic || ''}   ⚓   ${meta}`, { x: 0.6, y: 5.3, w: 8.8, h: 0.25, fontSize: 8.5, color: 'C9D3E2' });
    return s;
  };
  const waves = async (s, y, color = C.sea, o = 1) => t.img(s, (memo['w' + color] ??= await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="40"><path d="${Array.from({ length: 25 }, (_, k) => `M${k * 40},20 Q${k * 40 + 10},4 ${k * 40 + 20},20 T${k * 40 + 40},20`).join(' ')}" fill="none" stroke="#${color}" stroke-width="3" stroke-opacity="${o}"/></svg>`, 1000, 40)), 0, y, W, 0.4);
  const V = {
    image: [
      async (d) => { // the coast seen wide, in a rope frame
        const s = await page(d);
        await photo(s, d.image, 0.7, 1.42, 8.6, 1.85);
        t.text(s, d.text, { x: 0.6, y: 3.5, w: 8.8, h: 1.65, fontSize: L.fit(d.text, 8.8, 1.65, 15, 10, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2 });
      },
      async (d) => { // through a porthole, at night
        const s = await nightPage(d), dia = 3.5, x = 5.75, y = 1.35;
        t.oval(s, x - 0.18, y - 0.18, dia + 0.36, dia + 0.36, C.rope, { line: { color: C.rope2, width: 2 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: '' });
        for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4, r = dia / 2 + 0.09; t.oval(s, x + dia / 2 + r * Math.cos(a) - 0.05, y + dia / 2 + r * Math.sin(a) - 0.05, 0.1, 0.1, C.rope2); }
        t.text(s, d.text, { x: 0.6, y: 1.35, w: 4.6, h: 3.7, fontSize: L.fit(d.text, 4.6, 3.7, 15, 10, F.body, false, 1.25), color: C.white, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
      async (d) => { // the picture fills the page, the words stand on the hull below it
        const s = pres.addSlide(); idx++;
        t.img(s, await L.photo(L.src(d.image), W, 3.3), 0, 0, W, 3.3, { alt: '' });
        t.rect(s, 0, 3.05, W, 2.575, C.navy, { name: 'Hull' });
        stripes(s, 3.05, 0.24);
        await lifering(s, 0.45, 2.55, 0.8, idx);
        t.text(s, d.title, { x: 1.4, y: 2.45, w: 8, h: 0.55, bold: true, color: C.white, fill: { color: C.navy }, margin: 6, valign: 'middle', fontSize: L.fit(d.title, 7.8, 0.5, 22, 13, F.head, true) });
        t.text(s, d.text, { x: 0.6, y: 3.42, w: 8.8, h: 1.78, fontSize: L.fit(d.text, 8.8, 1.78, 14, 10, F.body, false, 1.15), color: C.white, lineSpacingMultiple: 1.15 });
        t.text(s, `${M.topic || ''}   ⚓   ${meta}`, { x: 0.6, y: 5.3, w: 8.8, h: 0.25, fontSize: 8.5, color: 'C9D3E2' });
      },
      async (d) => { // the picture cut as a sail, on a mast
        const s = await page(d);
        t.img(s, await L.photo(L.src(d.image), 3.9, 3.55, { mask: { poly: [[0, 1], [1, 1], [0.08, 0]] } }), 5.45, 1.35, 3.9, 3.55, { alt: '' });
        t.line(s, 5.6, 1.25, 0, 3.75, C.navy, 3); t.line(s, 5.2, 4.95, 4.25, 0, C.navy, 3);
        t.text(s, d.text, { x: 0.6, y: 1.4, w: 4.35, h: 3.65, fontSize: L.fit(d.text, 4.35, 3.65, 15, 10, F.body, false, 1.25), color: C.ink, lineSpacingMultiple: 1.25, valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // signal flags run up one mast
        const s = await page(d), n = d.items.length, h = 3.65 / n;
        t.line(s, 0.72, 1.35, 0, 3.8, C.navy, 3);
        for (const [i, it] of d.items.entries()) {
          const y = 1.42 + i * h;
          await flag(s, 0.74, y + 0.05, 0.62, i);
          head(s, it.h, 1.6, y, 2.5, h - 0.1);
          body(s, it.t, 4.2, y + 0.03, 5.2, h - 0.12, { valign: 'middle', color: C.ink });
          if (i < n - 1) t.line(s, 1.6, y + h - 0.05, 7.8, 0, C.rope, 1, { dash: 'dash' });
        }
      },
      async (d) => { // night watch: white rope tiles, two by two
        const s = await nightPage(d), n = d.items.length, w = 4.25, h = 1.72;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.8 : w, x = 0.6 + (i % 2) * (w + 0.3), y = 1.38 + Math.floor(i / 2) * (h + 0.14);
          await panel(s, x, y, ww, h);
          t.oval(s, x + 0.15, y + 0.15, 0.6, 0.6, C.red);
          t.img(s, await L.icon(it.icon, C.white, 2), x + 0.3, y + 0.3, 0.3, 0.3);
          head(s, it.h, x + 0.9, y + 0.15, ww - 1.05, 0.6);
          body(s, it.t, x + 0.9, y + 0.76, ww - 1.05, h - 0.84, { max: 13 });
        }
      },
      async (d) => { // buoys riding one wave, their words under the water line
        const s = await page(d), n = d.items.length, cw = 8.8 / n;
        t.rect(s, 0, 2.3, W, 2.95, C.navy, { name: 'Sea' });
        await waves(s, 2.1, C.sea);
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw, b = 0.84;
          t.oval(s, x + 0.08, 1.5, b, b, C.red, { line: { color: C.white, width: 3 } });
          t.img(s, await L.icon(it.icon, C.white, 2), x + 0.08 + b / 2 - 0.19, 1.5 + b / 2 - 0.19, 0.38, 0.38);
          head(s, it.h, x + 0.08, 2.55, cw - 0.28, 0.55, { color: C.white });
          body(s, it.t, x + 0.08, 3.12, cw - 0.28, 2.05, { color: 'C9D3E2', max: 13 });
        }
      },
      async (d) => { // a page of the ship's log
        const s = await page(d), n = d.items.length, y0 = 1.92, h = 3.2 / n;
        t.rect(s, 0.6, 1.42, 8.8, 0.46, C.navy, { name: 'Log header' });
        t.text(s, '⚓', { x: 0.7, y: 1.42, w: 0.5, h: 0.46, fontSize: 15, color: C.white, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h;
          t.rect(s, 0.6, y, 8.8, h, i % 2 ? C.white : C.sand, { line: { color: C.rope, width: 0.75 }, name: 'Log row' });
          t.img(s, await L.icon(it.icon, C.red, 2), 0.78, y + h / 2 - 0.15, 0.3, 0.3);
          t.line(s, 1.25, y, 0, h, C.rope, 0.75);
          head(s, it.h, 1.38, y + 0.04, 2.6, h - 0.08, { max: 14 });
          t.line(s, 4.05, y, 0, h, C.rope, 0.75);
          body(s, it.t, 4.18, y + 0.05, 5.1, h - 0.1, { valign: 'middle', color: C.ink, max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // the voyage: rings climb from harbour to the open sea
        const s = await page(d), n = d.steps.length, cw = 8.8 / n, top = (i) => 2.35 - i * (n === 4 ? 0.3 : 0.45);
        for (let i = 0; i < n - 1; i++) t.line(s, 0.95 + i * cw, top(i + 1) + 0.35, cw, top(i) - top(i + 1), C.sea, 2, { dash: 'dash', flipV: true });
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * cw, y = top(i);
          await lifering(s, x, y, 0.72, i + 1);
          head(s, st.h, x, y + 0.76, cw - 0.2, 0.46, { max: 14 });
          body(s, st.t, x, y + 1.24, cw - 0.2, 5.15 - (y + 1.24), { max: 13 });
        }
      },
      async (d) => { // night passage: arrows on the swell
        const s = await nightPage(d), n = d.steps.length, cw = 8.8 / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.6 + i * cw;
          t.shape(s, 'PENTAGON', { x, y: 1.42, w: cw - 0.06, h: 1.0, fill: { color: i % 2 ? C.sea : C.red }, objectName: 'Arrow' });
          t.text(s, st.h, { x: x + 0.1, y: 1.42, w: cw - 0.5, h: 1.0, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(st.h, cw - 0.5, 0.9, 15, 10, F.head, true) });
          body(s, st.t, x + 0.1, 2.6, cw - 0.3, 2.55, { color: 'E4EAF2' });
        }
      },
      async (d) => { // a rope ladder going down
        const s = await page(d), n = d.steps.length, h = 3.68 / n;
        await rope(s, 0.8, 1.32, 0.3, 3.86);
        for (const [i, st] of d.steps.entries()) {
          const y = 1.4 + i * h;
          await lifering(s, 0.55, y + (h - 0.74) / 2, 0.74, i + 1);
          t.rect(s, 1.5, y + 0.03, 7.9, h - 0.1, i === n - 1 ? C.navy : C.white, { name: 'Rung' });
          head(s, st.h, 1.65, y + 0.05, 2.55, h - 0.14, { max: 14, color: i === n - 1 ? C.white : C.navy });
          body(s, st.t, 4.3, y + 0.05, 5.0, h - 0.14, { valign: 'middle', max: 13, color: i === n - 1 ? 'E4EAF2' : C.ink });
        }
      },
    ],
    stats: [
      async (d) => { // numbers inside great life rings
        const s = await page(d), n = d.stats.length, cw = 8.8 / n, dia = 2.15;
        for (const [i, x] of d.stats.entries()) {
          const px = 0.6 + i * cw + (cw - dia) / 2;
          t.img(s, await ringImg(), px, 1.38, dia, dia);
          t.text(s, x.value, { x: px + 0.48, y: 1.38 + 0.48, w: dia - 0.96, h: dia - 0.96, bold: true, color: C.navy, align: 'center', valign: 'middle', fontSize: L.fit(x.value, dia - 1.0, 0.7, 26, 11, F.head, true) });
          body(s, x.label, 0.6 + i * cw + 0.15, 3.6, cw - 0.3, 0.72, { align: 'center', color: C.ink, max: 13 });
        }
        if (d.note) body(s, d.note, 0.6, 4.35, 8.8, 0.82, { max: 11, align: 'center' });
      },
      async (d) => { // the depth gauge: one reading stands tall on navy
        const s = await page(d), [a, ...rest] = d.stats;
        t.rect(s, 0.6, 1.42, 3.8, 3.72, C.navy, { name: 'Gauge' });
        await waves(s, 4.6, C.sea);
        t.text(s, a.value, { x: 0.75, y: 1.6, w: 3.5, h: 1.35, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.4, 1.25, 54, 22, F.head, true) });
        body(s, a.label, 0.95, 3.05, 3.1, 1.4, { color: 'C9D3E2', align: 'center' });
        rest.forEach((x, i) => {
          const y = 1.42 + i * 1.22;
          t.rect(s, 4.65, y, 0.09, 1.08, i ? C.sea : C.red, { name: 'Mark' });
          t.text(s, x.value, { x: 4.9, y, w: 4.5, h: 0.58, bold: true, color: i ? C.sea : C.red, valign: 'middle', fontSize: L.fit(x.value, 4.5, 0.55, 30, 16, F.head, true) });
          body(s, x.label, 4.9, y + 0.58, 4.5, 0.5, { color: C.ink, max: 12 });
        });
        if (d.note) body(s, d.note, 4.65, 3.92, 4.75, 1.22, { max: 11 });
      },
    ],
    compare: [
      async (d) => { // port and starboard: two whole sides of the ship
        const s = await page(d), w = W / 2;
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = i * w, ink = C.white, sub = i ? 'E4EAF2' : 'FBE3E7', n = side.items.length, rh = 2.95 / n;
          t.rect(s, x, 1.3, w, 3.95, i ? C.sea : C.red, { name: 'Side' });
          head(s, side.h, x + (i ? 0.55 : 0.4), 1.42, w - 1.0, 0.6, { color: ink, max: 20, align: i ? 'left' : 'right' });
          side.items.forEach((it, k) => body(s, it, x + 0.5, 2.1 + k * rh, w - 0.9, rh - 0.06, { color: sub, align: i ? 'left' : 'right' }));
        }
        t.oval(s, w - 0.42, 1.3, 0.84, 0.84, C.white, { line: { color: C.navy, width: 2 } });
        t.text(s, '⚓', { x: w - 0.42, y: 1.3, w: 0.84, h: 0.84, fontSize: 22, color: C.navy, align: 'center', valign: 'middle' });
      },
      async (d) => { // deck above, hold below: two rope bands
        const s = await page(d), h = 1.72;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.42 + i * (h + 0.14);
          await panel(s, 0.66, y, 8.68, h, i ? C.navy : C.white);
          await flag(s, 0.82, y + 0.2, 0.48, i * 3);
          head(s, side.h, 0.82, y + 0.72, 2.15, h - 0.8, { color: i ? C.white : C.navy, max: 15, valign: 'top' });
          side.items.forEach((it, k) => body(s, it, 3.1 + (k % 2) * 3.1, y + 0.1 + Math.floor(k / 2) * 0.78, 2.95, 0.74, { color: i ? 'E4EAF2' : C.ink, max: 13 }));
        }
      },
    ],
    statement: [
      async (d) => { // night sea: the words alone, waves under them
        const s = await nightPage(d);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.3, w: 8.8, h: 2.3, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.2, 36, 17, F.head, true) });
        await waves(s, 3.62, C.sea);
        if (d.caption) body(s, d.caption, 0.6, 4.05, 8.8, 1.15, { color: 'C9D3E2', max: 13 });
      },
      async (d) => { // a life ring beside the thought, the note under a red rule
        const s = await page(d), dia = 3.3;
        t.img(s, await ringImg(), 0.6, 1.5, dia, dia);
        t.text(s, '⚓', { x: 1.4, y: 2.3, w: 1.7, h: 1.7, fontSize: 54, color: C.navy, align: 'center', valign: 'middle' });
        t.text(s, L.runs(d.text), { x: 4.25, y: 1.42, w: 5.15, h: 2.15, bold: true, color: C.navy, valign: 'middle', fontSize: L.fit(d.text, 5.15, 2.1, 30, 15, F.head, true) });
        t.rect(s, 4.25, 3.62, 1.6, 0.06, C.red, { name: 'Rule' });
        if (d.caption) body(s, d.caption, 4.25, 3.76, 5.15, 1.4, { max: 13 });
      },
    ],
    timeline: [
      async (d) => { // a rope down the middle, ports on either side
        const s = await page(d), cx = 5;
        await rope(s, cx - 0.15, 1.32, 0.3, 3.86);
        for (const [i, it] of d.items.entries()) {
          const right = i % 2 === 1, y = 1.38 + Math.floor(i / 2) * 1.88 + (right ? 0.34 : 0), x = right ? cx + 0.42 : 0.6, w = 3.98, a = right ? 'left' : 'right';
          t.oval(s, cx - 0.2, y + 0.08, 0.4, 0.4, right ? C.navy : C.red, { line: { color: C.white, width: 2 } });
          t.text(s, [{ text: it.year + '  ', options: { color: C.red, bold: true } }, { text: it.h, options: { color: C.navy, bold: true } }], { x, y, w, h: 0.46, fontSize: L.fit(`${it.year}  ${it.h}`, w, 0.42, 16, 10, F.head, true), align: a, valign: 'middle' });
          body(s, it.t, x, y + 0.48, w, 1.2, { align: a, max: 13 });
        }
      },
      async (d) => { // four sails, the year in each
        const s = await page(d), n = d.items.length, cw = 8.8 / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * cw, w = cw - 0.18;
          t.shape(s, 'RIGHT_TRIANGLE', { x, y: 1.36, w, h: 1.2, fill: { color: i % 2 ? C.sea : C.navy }, flipH: true, objectName: 'Sail' });
          t.text(s, it.year, { x: x + w * 0.3, y: 1.98, w: w * 0.68, h: 0.55, bold: true, color: C.white, align: 'right', valign: 'middle', fontSize: L.fit(it.year, w * 0.62, 0.45, 18, 8, F.head, true) });
          t.rect(s, x, 2.56, w, 0.08, C.red, { name: 'Boom' });
          head(s, it.h, x, 2.7, w, 0.46, { max: 14 });
          body(s, it.t, x, 3.18, w, 1.98, { max: 13 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Dengiz', colors: { dk1: C.navy, lt1: C.white, dk2: '0B1A33', lt2: C.sand, accent1: C.red, accent2: C.sea, accent3: C.flags[1], accent4: C.flags[5], accent5: C.rope, accent6: C.muted, hlink: C.sea, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "yo'nalish va maqsad: 'kurs', 'manzil', 'jamoa' ruhida; ishonchli va aniq", limits: {}, prefer: null };
module.exports = { id: 68, slug: 'dengiz', name: 'Dengiz', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "energetic"], "transitions": ["p14:ripple", "p14:pan|dir=\"d\"", "fade"], "cover": ["riseWords", "swing"], "mark": "swing", "deco": "curveUp", "sig": {"title": "riseSettle", "body": "fadeUp", "item": ["curveUp", "curveDown"], "image": "riseSettle", "number": "swing", "order": "alternate", "stagger": 0.16}, "tempo": 1.15, "kenburns": true};
