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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Dengiz', colors: { dk1: C.navy, lt1: C.white, dk2: '0B1A33', lt2: C.sand, accent1: C.red, accent2: C.sea, accent3: C.flags[1], accent4: C.flags[5], accent5: C.rope, accent6: C.muted, hlink: C.sea, folHlink: C.muted } });
}
/** Uslub pasporti */
const STYLE = { tone: "yo'nalish va maqsad: 'kurs', 'manzil', 'jamoa' ruhida; ishonchli va aniq", limits: {}, prefer: null };
module.exports = { id: 68, slug: 'dengiz', name: 'Dengiz', category: 'business', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "energetic"], "transitions": ["p14:ripple", "p14:pan|dir=\"d\"", "fade"], "cover": ["riseWords", "swing"], "mark": "swing", "deco": "curveUp", "sig": {"title": "riseSettle", "body": "fadeUp", "item": ["curveUp", "curveDown"], "image": "riseSettle", "number": "swing", "order": "alternate", "stagger": 0.16}, "tempo": 1.15, "kenburns": true};
