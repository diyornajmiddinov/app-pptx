/** 146 Bitiktosh — ancient STELAE: arch-topped granite tablets stand on the ground with carved text; the title is carved on a lintel stone. */
const { kit, L, rowsFit } = require('../free.js');
const C = { sky: 'EDE9E1', ground: 'C9B99A', stone: 'B8B4AB', stone2: 'A39E93', ink: '23221F', carve: 'F4F1EA', muted: '3E3C37' };
const F = { head: 'Times New Roman', body: 'Times New Roman' };
const stele = (w, h) => { let sp = '', x0 = Math.round(w * 7 + h); const rnd = () => ((x0 = (x0 * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < w * h / 300; i++) sp += `<circle cx="${(rnd() * w).toFixed(0)}" cy="${(rnd() * h).toFixed(0)}" r="${(1 + rnd() * 2).toFixed(1)}" fill="#${rnd() > 0.5 ? '8A877F' : 'D4D0C7'}" opacity="0.55"/>`;
  const r = Math.min(w / 2, 60); return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><clipPath id="c"><path d="M0,${r} A${w / 2},${r} 0 0 1 ${w},${r} L${w},${h} L0,${h} Z"/></clipPath></defs><g clip-path="url(#c)"><rect width="${w}" height="${h}" fill="#${C.stone}"/>${sp}<rect x="${w - 10}" width="10" height="${h}" fill="#000" opacity="0.15"/></g><path d="M8,${r + 4} A${w / 2 - 8},${r - 4} 0 0 1 ${w - 8},${r + 4} L${w - 8},${h - 8} L8,${h - 8} Z" fill="none" stroke="#5E5C57" stroke-width="2" opacity="0.6"/></svg>`; };
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const stone = async (s, x, y, w, h) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); t.img(s, await k.svg(`s${W2}x${H2}`, stele(W2, H2), W2, H2), x, y, w, h); return { x: x + 0.2, y: y + Math.min(w / 2, 0.6) + 0.05, w: w - 0.4, h: h - Math.min(w / 2, 0.6) - 0.2 }; };
  // carved text: light offset + dark text
  const carve = (s, txt, x, y, w, h, o = {}) => { const copy = (v) => (Array.isArray(v) ? v.map((r) => ({ ...r, options: { ...(r.options || {}) } })) : v); k.txt(s, copy(txt), x + 0.012, y + 0.012, w, h, { color: C.carve, ...o }); k.txt(s, copy(txt), x, y, w, h, { color: C.ink, ...o }); };
  const ground = (s) => { t.rect(s, 0, 5.0, 10, 0.625, C.ground, { name: 'Ground' }); };
  const page = async (d) => { const s = k.slide(C.sky); ground(s); t.rect(s, 0.4, 0.2, 9.2, 0.8, C.stone2, { name: 'Lintel' }); if (d.title) carve(s, d.title.toUpperCase(), 0.6, 0.2, 7.8, 0.8, { max: 20, min: 11, bold: true, font: F.head, valign: 'middle', spacing: 2 }); carve(s, ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'][k.idx - 1] || String(k.idx), 8.4, 0.2, 1.0, 0.8, { size: 16, bold: true, align: 'right', valign: 'middle' }); k.foot(s, { y: 5.3, size: 7.5, color: C.muted }); return s; };
  const steles = async (s, n, draw, top = 1.2) => { const gap = 0.25, w = (9.2 - gap * (n - 1)) / n; for (let i = 0; i < n; i++) { const x = 0.4 + i * (w + gap), y = top + (i % 2) * 0.15; draw(i, await stone(s, x, y, w, 5.05 - y)); } };
  const R = {
    async cover(d) { const s = k.slide(C.sky); ground(s); const b = await stone(s, 0.6, 0.4, 5.4, 4.65); carve(s, (k.M.org || '').toUpperCase(), b.x, b.y, b.w, 0.35, { size: 11, bold: true, align: 'center', spacing: 2 }); carve(s, d.title.toUpperCase(), b.x, b.y + 0.4, b.w, 2.0, { max: 30, min: 14, bold: true, align: 'center', valign: 'middle', font: F.head }); carve(s, [k.M.author, [k.M.loc, k.M.year].filter(Boolean).join(', ')].filter(Boolean).join('\n'), b.x, b.y + 2.5, b.w, 0.9, { max: 13, align: 'center', valign: 'middle', italic: true });
      if (d.image) { const b2 = await stone(s, 6.4, 1.1, 3.1, 3.95); await k.photo(s, d.image, b2.x, b2.y, b2.w, b2.h - 0.1, { gray: true }); } k.foot(s, { y: 5.3, size: 7.5, color: C.muted }); },
    async intro(d) { const s = await page(d); const a = await stone(s, 0.4, 1.2, 3.6, 3.85); await k.photo(s, d.image, a.x, a.y, a.w, a.h - 0.1, { gray: true }); const b = await stone(s, 4.25, 1.2, 5.35, 3.85); carve(s, d.text, b.x, b.y, b.w, b.h, { max: 15, min: 10, ls: 1.3, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = await page(d); const b = await stone(s, 1.2, 1.15, 7.6, 3.9); const n = d.items.length, rh = b.h / n; d.items.forEach((it, i) => carve(s, `${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i] || i + 1}.  ${it}`, b.x + 0.2, b.y + i * rh, b.w - 0.4, rh, { max: 16, valign: 'middle' })); },
    async cards(d) { const s = await page(d); await steles(s, d.items.length, (i, b) => { carve(s, d.items[i].h.toUpperCase(), b.x, b.y, b.w, 0.5, { max: 13, bold: true, align: 'center', valign: 'middle' }); carve(s, d.items[i].t, b.x, b.y + 0.55, b.w, b.h - 0.55, { max: 12, align: 'center' }); }); },
    async process(d) { const s = await page(d); await steles(s, d.steps.length, (i, b) => { carve(s, `${i + 1}. ${d.steps[i].h}`.toUpperCase(), b.x, b.y, b.w, 0.5, { max: 13, bold: true, align: 'center', valign: 'middle' }); carve(s, d.steps[i].t, b.x, b.y + 0.55, b.w, b.h - 0.55, { max: 12, align: 'center' }); }); },
    async stats(d) { const s = await page(d); await steles(s, d.stats.length, (i, b) => { carve(s, d.stats[i].value, b.x, b.y, b.w, 1.0, { max: 40, min: 16, bold: true, align: 'center', valign: 'middle' }); carve(s, d.stats[i].label, b.x, b.y + 1.05, b.w, b.h - 1.05 - (d.note ? 0.45 : 0), { max: 12, align: 'center' }); }); if (d.note) k.txt(s, d.note, 0.4, 5.02, 9.2, 0.26, { size: 8, color: C.muted }); },
    async compare(d) { const s = await page(d); const w = 4.45, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12, w - 0.5, F.body, 0.1, 2.75); for (const [i, sd] of [d.left, d.right].entries()) { const b = await stone(s, 0.4 + i * 4.75, 1.15, w, 3.9); carve(s, sd.h.toUpperCase(), b.x, b.y, b.w, 0.45, { max: 14, bold: true, align: 'center', valign: 'middle' }); let y = b.y + 0.5; sd.items.forEach((it, j) => { carve(s, it, b.x + 0.05, y, b.w - 0.1, rr[j], { size: fs }); y += rr[j]; }); } },
    async statement(d) { const s = await page(d); const b = await stone(s, 1.6, 1.15, 6.8, 3.9); carve(s, L.runs(d.text), b.x + 0.2, b.y, b.w - 0.4, b.h * 0.65, { max: 26, min: 13, bold: true, align: 'center', valign: 'middle', font: F.head }); if (d.caption) carve(s, d.caption, b.x + 0.2, b.y + b.h * 0.67, b.w - 0.4, b.h * 0.33, { max: 11, align: 'center', italic: true }); },
    async timeline(d) { const s = await page(d); await steles(s, d.items.length, (i, b) => { carve(s, d.items[i].year, b.x, b.y, b.w, 0.5, { max: 20, min: 11, bold: true, align: 'center', valign: 'middle' }); carve(s, d.items[i].h, b.x, b.y + 0.52, b.w, 0.42, { max: 13, bold: true, align: 'center' }); carve(s, d.items[i].t, b.x, b.y + 0.96, b.w, b.h - 0.96, { max: 11, align: 'center' }); }); },
    async quote(d) { const s = await page({}); const b = await stone(s, 1.6, 1.15, 6.8, 3.9); carve(s, `\u201C${d.text}\u201D`, b.x + 0.2, b.y, b.w - 0.4, b.h - 0.5, { max: 24, min: 12, italic: true, align: 'center', valign: 'middle' }); if (d.author) carve(s, d.author.toUpperCase(), b.x, b.y + b.h - 0.45, b.w, 0.4, { size: 12, bold: true, align: 'center' }); },
    async sources(d) { const s = await page(d); const b = await stone(s, 0.8, 1.15, 8.4, 3.9); const n = d.items.length, rh = b.h / n; d.items.forEach((it, i) => carve(s, `${i + 1}. ${it}`, b.x + 0.1, b.y + i * rh, b.w - 0.2, rh, { max: 12, valign: 'middle' })); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all cut from the same steppe: a deck's pages must not look alike (L.pages)
  const NI = '1C2230', NG = '3B352B', PALE = 'EFE9DA', SAND = C.ground, ROM = ['I', 'II', 'III', 'IV'], RN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
  const rock = (w, h, seed = 3, c = C.stone) => { let a = seed * 97 + w + h; const rnd = () => ((a = (a * 9301 + 49297) % 233280) / 233280), e = 0.018 * Math.min(w, h) + 3; const pts = []; for (let i = 0; i <= 8; i++) pts.push([w * i / 8, rnd() * e]); for (let i = 1; i <= 4; i++) pts.push([w - rnd() * e, h * i / 4]); for (let i = 7; i >= 0; i--) pts.push([w * i / 8, h - rnd() * e]); for (let i = 3; i >= 1; i--) pts.push([rnd() * e, h * i / 4]); let sp = ''; for (let i = 0; i < w * h / 350; i++) sp += `<circle cx="${(rnd() * w).toFixed(0)}" cy="${(rnd() * h).toFixed(0)}" r="${(1 + rnd() * 2).toFixed(1)}" fill="#${rnd() > 0.5 ? '8A877F' : 'D4D0C7'}" opacity="0.5"/>`; const P = pts.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(' '); return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><clipPath id="c"><polygon points="${P}"/></clipPath></defs><polygon points="${P}" fill="#${c}"/><g clip-path="url(#c)">${sp}</g></svg>`; };
  const slab = async (s, x, y, w, h, seed = 3, c = C.stone) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); t.img(s, await k.svg(`rk${W2}x${H2}-${seed}-${c}`, rock(W2, H2, seed, c), W2, H2), x, y, w, h); };
  const boulder = async (s, x, y, w, h, seed = 1) => { const W2 = Math.round(w * 100), H2 = Math.round(h * 100); let a = seed * 53 + W2, sp = ''; const rnd = () => ((a = (a * 9301 + 49297) % 233280) / 233280); for (let i = 0; i < W2 * H2 / 400; i++) sp += `<circle cx="${(rnd() * W2).toFixed(0)}" cy="${(rnd() * H2).toFixed(0)}" r="${(1 + rnd() * 2).toFixed(1)}" fill="#8A877F" opacity="0.45"/>`; t.img(s, await k.svg(`bl${W2}x${H2}${seed}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><defs><clipPath id="c"><ellipse cx="${W2 / 2}" cy="${H2 / 2}" rx="${W2 / 2}" ry="${H2 / 2}"/></clipPath></defs><ellipse cx="${W2 / 2}" cy="${H2 / 2}" rx="${W2 / 2}" ry="${H2 / 2}" fill="#${C.stone}"/><g clip-path="url(#c)">${sp}</g></svg>`, W2, H2), x, y, w, h); };
  const num = () => RN[k.idx - 1] || String(k.idx);
  const pg = (d, o = {}) => { const s = k.slide(C.sky); ground(s); if (d.title) k.txt(s, d.title.toUpperCase(), o.x ?? 0.4, o.y ?? 0.2, o.w ?? 8.2, o.h ?? 0.72, { max: 19, min: 11, bold: true, font: F.head, valign: 'middle', spacing: 1.5 }); k.txt(s, num(), o.nx ?? 8.6, 0.2, 1.0, 0.72, { size: 16, bold: true, align: 'right', valign: 'middle' }); k.foot(s, { x: o.fx ?? 0.6, y: 5.3, w: o.fw ?? 8.8, size: 7.5, color: C.muted }); return s; };
  const wall = async (d, o = {}) => { const s = k.slide(C.stone); t.img(s, await k.svg('wall', rock(1600, 900, 5).replace(/<polygon points="[^"]*" fill="#B8B4AB"\/>/, `<rect width="1600" height="900" fill="#${C.stone}"/>`).replace(/<clipPath id="c">.*?<\/clipPath>/, '<clipPath id="c"><rect width="1600" height="900"/></clipPath>'), 1600, 900, true), 0, 0, 10, 5.625); if (d.title) carve(s, d.title.toUpperCase(), o.x ?? 0.5, 0.22, o.w ?? 8.0, 0.72, { max: 19, min: 11, bold: true, font: F.head, valign: 'middle', spacing: 1.5 }); carve(s, num(), 8.5, 0.22, 1.0, 0.72, { size: 16, bold: true, align: 'right', valign: 'middle' }); k.foot(s, { x: o.fx ?? 0.6, y: 5.3, w: o.fw ?? 8.8, size: 7.5, color: C.muted }); return s; };
  const night = (d, o = {}) => { const s = k.slide(NI); t.rect(s, 0, o.hz ?? 5.0, 10, 5.625 - (o.hz ?? 5.0), NG, { name: 'Ground' }); if (d.title) k.txt(s, d.title.toUpperCase(), o.x ?? 0.4, 0.2, o.w ?? 8.2, 0.72, { max: 19, min: 11, bold: true, font: F.head, valign: 'middle', spacing: 1.5, color: PALE }); k.txt(s, num(), 8.6, 0.2, 1.0, 0.72, { size: 16, bold: true, align: 'right', valign: 'middle', color: PALE }); k.foot(s, { x: 0.6, y: 5.3, w: 8.8, size: 7.5, color: PALE }); return s; };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 14.5, min: 10.5, ls: 1.15, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 15, min: 11, bold: true, font: F.head, valign: 'middle', ls: 1.05, ...o });
  const cb = (s, v, x, y, w, h, o = {}) => carve(s, v, x, y, w, h, { max: 14.5, min: 10.5, ls: 1.15, ...o });
  const ch = (s, v, x, y, w, h, o = {}) => carve(s, v, x, y, w, h, { max: 15, min: 11, bold: true, font: F.head, valign: 'middle', ls: 1.05, ...o });
  const V = {
    image: [
      async (d) => { // a rock face: the picture is let into an arched niche, the words cut beside it
        const s = await wall(d, { w: 8.0 }), arch = 'M0,1 L0,0.32 C0,0.14 0.22,0 0.5,0 C0.78,0 1,0.14 1,0.32 L1,1 Z', x = 0.6, y = 1.05, w = 3.5, h = 4.1;
        t.img(s, await L.photo(L.src(d.image), w, h, { mask: { path: arch }, gray: true }), x, y, w, h, { alt: '' });
        cb(s, d.text, 4.4, 1.05, 5.1, 4.1, { valign: 'middle', ls: 1.25 });
      },
      async (d) => { // a dolmen: two uprights and a capstone frame the picture, words on the open sky
        const s = pg({}, { fx: 5.8, fw: 3.8 });
        await slab(s, 0.4, 1.2, 0.65, 3.85, 4); await slab(s, 5.0, 1.2, 0.65, 3.85, 6);
        await k.photo(s, d.image, 1.05, 1.32, 3.95, 3.68, { gray: true });
        await slab(s, 0.2, 0.22, 5.65, 1.1, 2, C.stone2);
        carve(s, (d.title || '').toUpperCase(), 0.45, 0.28, 5.15, 0.98, { max: 18, min: 11, bold: true, font: F.head, valign: 'middle', align: 'center', spacing: 1 });
        bd(s, d.text, 5.95, 1.0, 3.65, 3.9, { valign: 'middle', max: 14 });
      },
      async (d) => { // night on the steppe: the picture is a pale moon, a dark slab of words stands beneath the sky
        const s = night(d, { w: 6.0, hz: 5.0 }), dd = 3.1;
        t.oval(s, 6.45, 1.15, dd + 0.12, dd + 0.12, PALE);
        await k.photo(s, d.image, 6.51, 1.21, dd, dd, { mask: 'circle', gray: true });
        bd(s, d.text, 0.4, 1.0, 5.95, 3.9, { color: PALE, valign: 'middle', ls: 1.22 });
      },
      async (d) => { // the picture fills the whole page, one long tablet of words lies across its foot
        const s = k.slide(C.sky);
        await k.photo(s, d.image, 0, 0, 10, 5.625, { gray: true });
        await slab(s, 0.25, 2.75, 9.5, 2.65, 8);
        carve(s, (d.title || '').toUpperCase(), 0.6, 2.84, 7.9, 0.58, { max: 18, min: 11, bold: true, font: F.head, valign: 'middle', spacing: 1 });
        carve(s, num(), 8.5, 2.84, 0.9, 0.58, { size: 15, bold: true, align: 'right', valign: 'middle' });
        cb(s, d.text, 0.6, 3.42, 8.8, 1.55, { valign: 'middle', max: 13 });
        k.foot(s, { x: 0.6, y: 5.06, w: 8.8, size: 7, color: C.muted });
      },
    ],
    cards: [
      async (d) => { // rough-hewn slabs leaning at their places, an icon cut into the corner of each
        const s = pg(d), n = d.items.length, W = 4.5, H = 1.92, pos = n === 4 ? [[0.4, 1.0, W], [5.1, 1.05, W], [0.5, 3.05, W], [5.0, 3.1, W]] : [[0.4, 1.0, W], [5.1, 1.05, W], [0.45, 3.05, 9.1]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w] = pos[i];
          await slab(s, x, y, w, H, i + 2);
          t.img(s, await k.icon(it.icon, C.ink, 2), x + 0.18, y + 0.16, 0.36, 0.36);
          ch(s, it.h.toUpperCase(), x + 0.65, y + 0.1, w - 0.85, 0.48, { max: 13 });
          cb(s, it.t, x + 0.2, y + 0.62, w - 0.4, H - 0.74, { max: 14 });
        }
      },
      async (d) => { // words written on the sky, a squat boulder with its icon on the ground under each
        const s = pg(d), n = d.items.length, w = 9.2 / n, bw = Math.min(1.7, w - 0.3), bh = 1.05;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, cx = x + w / 2;
          hd(s, it.h.toUpperCase(), x + 0.06, 1.0, w - 0.12, 0.55, { align: 'center', max: 13 });
          bd(s, it.t, x + 0.06, 1.58, w - 0.12, 2.42, { align: 'center', max: 14 });
          await boulder(s, cx - bw / 2, 4.08, bw, bh, i + 2);
          t.img(s, await k.icon(it.icon, C.ink, 2), cx - 0.22, 4.38, 0.44, 0.44);
        }
      },
      async (d) => { // a rock face ruled with chisel lines: one inscription to each band
        const s = await wall(d), n = d.items.length, rh = 4.2 / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.0 + i * rh;
          t.line(s, 0.5, y, 9.0, 0, C.muted, 1.5); t.line(s, 0.5, y + 0.02, 9.0, 0, C.carve, 0.75);
          t.img(s, await k.icon(it.icon, C.ink, 2), 0.6, y + rh / 2 - 0.21, 0.42, 0.42);
          ch(s, it.h.toUpperCase(), 1.2, y + 0.04, 2.5, rh - 0.08, { max: 13 });
          cb(s, it.t, 3.8, y + 0.04, 5.7, rh - 0.08, { valign: 'middle', max: 14 });
        }
      },
      async (d) => { // night: one tall obelisk at the centre, the ideas stand on either side of it
        const s = night(d), n = d.items.length, per = Math.ceil(n / 2), W = 3.75;
        t.img(s, await k.svg('obel', `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="400"><polygon points="60,0 88,48 112,400 8,400 32,48" fill="#${C.stone2}"/><polygon points="60,0 88,48 112,400 60,400" fill="#000" opacity="0.2"/></svg>`, 120, 400), 4.42, 1.0, 1.16, 4.05);
        for (const [i, it] of d.items.entries()) {
          const right = i >= per, col = right ? n - per : per, j = right ? i - per : i, h = 3.95 / col, x = right ? 5.85 : 0.4, y = 1.02 + j * h, a = right ? 'left' : 'right';
          t.img(s, await k.icon(it.icon, PALE, 1.75), right ? x : x + W - 0.38, y + 0.02, 0.38, 0.38);
          hd(s, it.h.toUpperCase(), right ? x + 0.46 : x, y, W - 0.46, 0.44, { align: a, color: PALE, max: 13 });
          bd(s, it.t, x, y + 0.48, W, h - 0.56, { align: a, color: PALE, max: 14 });
        }
      },
    ],
    process: [
      async (d) => { // great steps of cut stone climb from the ground to the right
        const s = pg(d, { w: 6.6 }), n = d.steps.length, w = 10 / n, rise = n === 4 ? 0.34 : 0.48, y0 = 1.0 + (n - 1) * rise;
        for (const [i, st] of d.steps.entries()) {
          const x = i * w, y = y0 - i * rise, h = 5.05 - y;
          await slab(s, x, y, w + 0.02, h, i + 3, i % 2 ? C.stone : 'C8C4BB');
          carve(s, ROM[i], x + 0.2, y + 0.05, 1.0, 0.56, { size: 24, bold: true, valign: 'middle', font: F.head });
          ch(s, st.h.toUpperCase(), x + 0.2, y + 0.62, w - 0.38, 0.56, { max: 13, valign: 'top' });
          cb(s, st.t, x + 0.2, y + 1.2, w - 0.36, h - 1.28, { max: 13.5 });
        }
      },
      async (d) => { // a single stone post down the middle, a mark on it at each step, words to either side
        const s = pg(d), n = d.steps.length, rh = 3.98 / n, w = 3.95, dd = Math.min(0.56, rh - 0.1);
        await slab(s, 4.8, 0.95, 0.4, 4.1, 3, C.stone2);
        for (const [i, st] of d.steps.entries()) {
          const y = 1.0 + i * rh, right = i % 2 === 1, x = right ? 5.5 : 0.55, a = right ? 'left' : 'right', c = y + rh / 2;
          t.oval(s, 5 - dd / 2, c - dd / 2, dd, dd, C.ink);
          k.txt(s, ROM[i], 5 - dd / 2, c - dd / 2, dd, dd, { size: 12, bold: true, color: C.carve, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h.toUpperCase(), x, y + 0.02, w, 0.33, { align: a, max: 12.5 });
          bd(s, st.t, x, y + 0.36, w, rh - 0.4, { align: a, max: 13.5, ls: 1.08 });
        }
      },
      async (d) => { // night: short menhirs on the horizon bear numerals, words on the dark ground before them
        const hz = 2.2, s = night(d, { hz }), n = d.steps.length, w = 9.2 / n, mw = 1.05, mh = 1.15;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * w;
          await slab(s, x + 0.1, hz - mh + 0.06, mw, mh, i + 2);
          carve(s, ROM[i], x + 0.1, hz - mh + 0.1, mw, mh - 0.1, { size: 24, bold: true, align: 'center', valign: 'middle', font: F.head });
          hd(s, st.h.toUpperCase(), x + 0.1, hz + 0.14, w - 0.25, 0.56, { color: PALE, valign: 'top', max: 13 });
          bd(s, st.t, x + 0.1, hz + 0.72, w - 0.25, 5.25 - hz - 0.72, { color: PALE, max: 13.5 });
        }
      },
      async (d) => { // stepping stones seen from above across the sand, words beside each
        const s = k.slide(SAND), n = d.steps.length, w = 3.15, pos = n === 4 ? [[0.35, 1.02], [5.0, 1.5], [0.85, 3.05], [5.5, 3.5]] : [[0.35, 1.05], [5.0, 1.8], [0.85, 3.4]];
        k.txt(s, (d.title || '').toUpperCase(), 0.4, 0.2, 8.2, 0.72, { max: 19, min: 11, bold: true, font: F.head, valign: 'middle', spacing: 1.5 });
        k.txt(s, num(), 8.6, 0.2, 1.0, 0.72, { size: 16, bold: true, align: 'right', valign: 'middle' });
        for (const [i, st] of d.steps.entries()) {
          const [x, y] = pos[i];
          await boulder(s, x, y + 0.06, 1.1, 1.0, i + 3);
          carve(s, ROM[i], x, y + 0.06, 1.1, 1.0, { size: 22, bold: true, align: 'center', valign: 'middle', font: F.head });
          hd(s, st.h.toUpperCase(), x + 1.2, y, w, 0.42, { max: 12.5 });
          bd(s, st.t, x + 1.2, y + 0.44, w, 1.2, { max: 13, ls: 1.08 });
        }
        k.foot(s, { x: 0.6, y: 5.3, w: 8.8, size: 7.5, color: C.muted });
      },
    ],
    stats: [
      async (d) => { // the one great stele with the first figure, two low stones with the others
        const s = pg(d), [a, ...rest] = d.stats, b = await stone(s, 0.4, 0.95, 4.2, 4.1);
        ch(s, a.value, b.x, b.y + 0.2, b.w, 1.3, { max: 54, min: 26, align: 'center' });
        cb(s, a.label, b.x + 0.1, b.y + 1.55, b.w - 0.2, 1.0, { align: 'center', max: 14 });
        for (const [i, v] of rest.entries()) { const y = 1.0 + i * 1.08; await slab(s, 4.85, y, 4.75, 1.0, i + 2); ch(s, v.value, 5.0, y + 0.05, 1.95, 0.9, { max: 26, min: 15 }); cb(s, v.label, 7.0, y + 0.05, 2.45, 0.9, { valign: 'middle', max: 12.5, ls: 1.05 }); }
        if (d.note) bd(s, d.note, 4.9, 3.2, 4.7, 1.76, { valign: 'middle', italic: true, max: 14 });
      },
      async (d) => { // three boulders, a figure cut in each, their names on the sky below
        const s = pg(d), w = 9.2 / 3, bh = 1.65;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.4 + i * w, by = 1.0 + [0.12, 0, 0.18][i];
          await boulder(s, x + 0.1, by, w - 0.2, bh, i + 2);
          ch(s, v.value, x + 0.4, by + 0.32, w - 0.8, 1.0, { max: 36, min: 18, align: 'center' });
          bd(s, v.label, x + 0.1, 2.88, w - 0.2, 0.72, { align: 'center', max: 13.5, ls: 1.05 });
        }
        if (d.note) bd(s, d.note, 0.5, 3.66, 9.0, 1.3, { valign: 'middle', align: 'center', italic: true, max: 14 });
      },
      async (d) => { // the rock face: figures cut large in one column, their words beside them
        const s = await wall(d);
        for (const [i, v] of d.stats.entries()) {
          const y = 1.02 + i * 0.98;
          ch(s, v.value, 0.5, y, 3.3, 0.92, { max: 44, min: 22 });
          t.line(s, 3.92, y + 0.08, 0, 0.76, C.ink, 2); 
          cb(s, v.label, 4.1, y, 5.4, 0.92, { valign: 'middle', max: 15 });
        }
        t.line(s, 0.5, 4.0, 9.0, 0, C.muted, 1.5);
        if (d.note) cb(s, d.note, 0.5, 4.06, 9.0, 1.16, { valign: 'middle', italic: true, max: 13.5 });
      },
    ],
    compare: [
      async (d) => { // day and night: a menhir stands on the parting, the sides read away from it
        const s = k.slide(C.sky);
        t.rect(s, 5, 0, 5, 5.625, NI, { name: 'Night' }); t.rect(s, 0, 5.0, 5, 0.625, SAND, { name: 'Ground' }); t.rect(s, 5, 5.0, 5, 0.625, NG, { name: 'Ground' });
        await slab(s, 4.72, 0.75, 0.56, 4.3, 4, C.stone2);
        k.txt(s, (d.title || '').toUpperCase(), 0.4, 0.1, 4.2, 0.72, { max: 15, min: 11, bold: true, font: F.head, valign: 'middle', spacing: 1, color: C.ink });
        k.txt(s, num(), 8.6, 0.15, 1.0, 0.58, { size: 16, bold: true, align: 'right', valign: 'middle', color: PALE });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.45 : 0.4, w = 4.15, a = i ? 'left' : 'right', ink = i ? PALE : C.ink, rh = 3.45 / sd.items.length;
          hd(s, sd.h.toUpperCase(), x, 0.82, w, 0.62, { align: a, color: ink, max: 14 });
          sd.items.forEach((it, j) => bd(s, it, x, 1.48 + j * rh, w, rh - 0.05, { align: a, valign: 'middle', color: ink, max: 14 }));
        }
        k.foot(s, { x: 5.45, y: 5.3, w: 4.15, size: 7, color: PALE });
      },
      async (d) => { // two long lintels one over the other, each cut with its heading and its lines
        const s = pg(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = 0.98 + i * 2.05, h = 1.98, m = sd.items.length, rows = Math.ceil(m / 2), rw = 3.45, rh = (h - 0.18) / rows;
          await slab(s, 0.3, y, 9.4, h, i + 5, i ? 'C8C4BB' : C.stone);
          ch(s, sd.h.toUpperCase(), 0.5, y + 0.1, 2.0, h - 0.2, { max: 14, min: 11 });
          sd.items.forEach((it, j) => cb(s, it, 2.6 + (j % 2) * (rw + 0.1), y + 0.09 + Math.floor(j / 2) * rh, rw, rh, { valign: 'middle', max: 13.5, ls: 1.08 }));
        }
      },
    ],
    statement: [
      async (d) => { // the bare rock face: the words cut as large as they will go
        const s = await wall(d);
        carve(s, L.runs(d.text), 0.6, 1.0, 8.8, 2.75, { max: 36, min: 18, bold: true, font: F.head, align: 'center', valign: 'middle', ls: 1.1 });
        t.line(s, 3.0, 3.82, 4.0, 0, C.muted, 1.5);
        if (d.caption) cb(s, d.caption, 0.8, 3.9, 8.4, 1.3, { align: 'center', valign: 'middle', italic: true, max: 14 });
      },
      async (d) => { // a broken tablet: the thought on the great piece, the small print on the part that fell away
        const s = pg(d);
        t.img(s, await k.svg('brok1', `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="285"><polygon points="0,0 880,0 880,235 690,270 560,240 390,285 240,250 90,275 0,240" fill="#${C.stone}"/></svg>`, 880, 285), 0.6, 0.98, 8.8, 2.85);
        carve(s, L.runs(d.text), 1.0, 1.05, 8.0, 2.25, { max: 29, min: 16, bold: true, font: F.head, align: 'center', valign: 'middle', ls: 1.1 });
        t.img(s, await k.svg('brok2', `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="125"><polygon points="0,6 90,40 240,16 390,50 560,8 690,36 880,0 880,125 0,125" fill="#C8C4BB"/></svg>`, 880, 125), 0.6, 3.72, 8.8, 1.3);
        if (d.caption) carve(s, d.caption, 0.85, 4.1, 8.3, 0.9, { max: 12.5, min: 10, ls: 1.05, valign: 'middle', align: 'center', italic: true });
      },
    ],
    timeline: [
      async (d) => { // the layers of the earth: four strata, one for each age, the year cut at the left
        const s = k.slide(C.sky), tones = ['D9CDB4', 'C9B99A', 'AD9C7D', '8F7F63'], rh = 1.13, y0 = 0.86;
        k.txt(s, (d.title || '').toUpperCase(), 0.4, 0.1, 8.2, 0.7, { max: 19, min: 11, bold: true, font: F.head, valign: 'middle', spacing: 1.5 });
        k.txt(s, num(), 8.6, 0.1, 1.0, 0.7, { size: 16, bold: true, align: 'right', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * rh, wob = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="120"><path d="M0,${6 + (i % 2) * 5} C200,${(i % 3) * 7} 400,${14 - i * 3} 600,6 S900,${3 + i * 3} 1000,${8 - i} L1000,120 L0,120 Z" fill="#${tones[i]}"/></svg>`;
          t.img(s, await k.svg(`str${i}`, wob, 1000, 120), 0, y - 0.05, 10, rh + 0.1);
          hd(s, it.year, 0.4, y + 0.04, 2.3, rh - 0.1, { max: 24, min: 13 });
          hd(s, it.h.toUpperCase(), 2.8, y + 0.04, 2.15, rh - 0.1, { max: 13 });
          bd(s, it.t, 5.0, y + 0.04, 4.6, rh - 0.1, { valign: 'middle', max: 13.5, ls: 1.08, color: C.ink });
        }
        t.rect(s, 0, 5.26, 10, 0.365, NG, { name: 'Bed' }); k.foot(s, { x: 0.6, y: 5.33, w: 8.8, size: 7.5, color: PALE });
      },
      async (d) => { // one long frieze across the top carved with the years, the record hung below each
        const s = pg(d, { h: 0.62, y: 0.12 }), w = 9.2 / 4;
        await slab(s, 0, 0.82, 10, 0.86, 2, C.stone2);
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w;
          ch(s, it.year, x, 0.88, w - 0.15, 0.72, { max: 22, min: 12, align: 'center' });
          if (i) t.line(s, x - 0.08, 0.86, 0, 0.78, C.ink, 1);
          hd(s, it.h.toUpperCase(), x, 1.78, w - 0.15, 0.56, { max: 13, align: 'center', valign: 'top' });
          bd(s, it.t, x, 2.36, w - 0.15, 2.6, { align: 'center', max: 14 });
        }
      },
      async (d) => { // night: the horizon crosses the middle, the years above it and below it by turns
        const hz = 3.1, s = night(d, { hz }), xs = [0.4, 2.55, 4.7, 6.55], w = 3.05;
        for (const [i, it] of d.items.entries()) {
          const x = xs[i], up = i % 2 === 0, y = up ? 0.92 : hz + 0.12, h = up ? hz - 0.98 : 5.25 - y;
          await slab(s, x, hz - 0.28, 0.24, 0.42, i + 3);
          k.txt(s, [{ text: `${it.year}  `, options: { color: 'E0C886', bold: true } }, { text: it.h.toUpperCase(), options: { color: PALE, bold: true } }], x + (up ? 0 : 0.32), y, w - (up ? 0 : 0.32), 0.42, { font: F.head, bold: true, max: 13.5, min: 10, valign: 'middle', ls: 1.05 });
          bd(s, it.t, x + (up ? 0 : 0.32), y + 0.44, w - (up ? 0 : 0.32), h - 0.46 - (up ? 0.28 : 0), { color: PALE, max: 13.5, ls: 1.06 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old row of stelae was the same page for cards, process, stats and timeline
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Bitiktosh', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.stone2, lt2: C.sky, accent1: C.stone2, accent2: '8C6D2C', accent3: C.ground, accent4: '5E5C57', accent5: C.muted, accent6: C.stone, hlink: '8C6D2C', folHlink: C.muted } });
}
module.exports = { id: 146, slug: 'bitiktosh', name: 'Bitiktoş', category: 'academic', photos: true, build, style: { tone: "tarixiy bitik: abadiy haqiqatlar kabi qisqa, salobatli, aniq iboralar", limits: { card_t4: 100, step_t: 100, event_t: 90 }, prefer: 'text' } };
