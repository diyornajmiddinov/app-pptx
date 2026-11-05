/** 155 Titrlar — film END CREDITS: black screen, everything centred on a gutter; roles in small grey caps on the right-aligned side, names/text in white on the left-aligned side. */
const { kit, L, rowsFit } = require('../free.js');
const C = { bg: '000000', ink: 'F5F5F5', role: '9C9C9C', accent: 'D4AF37' };
const F = { head: 'Georgia', body: 'Georgia' };
const G = 5.0, RW = 3.9, NW = 4.3;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k;
  const page = (d) => { const s = k.slide(C.bg); if (d.title) { const up = d.title.toUpperCase(), sp = up.length > 30 ? 1.5 : 4; k.txt(s, up, 0.5, 0.3, 9.0, 0.6, { size: L.fit(up, 9.0 - up.length * sp / 72, 0.6, 18, 10, F.body), color: C.ink, align: 'center', valign: 'middle', spacing: sp }); } t.line(s, 4.6, 0.98, 0.8, 0, C.accent, 1); k.foot(s, { y: 5.3, size: 7, align: 'center', color: C.role }); return s; };
  // credit lines: role (right-aligned, left of gutter) / name (left-aligned, right of gutter)
  const credits = (s, list, y0 = 1.2, y1 = 5.1) => { const n = list.length, rh = (y1 - y0) / n; list.forEach(([role, name], i) => { const y = y0 + i * rh; k.txt(s, String(role).toUpperCase(), G - 0.15 - RW, y, RW, rh, { max: 12, min: 8, color: C.role, align: 'right', valign: 'middle', spacing: 1 }); k.txt(s, name, G + 0.15, y, NW, rh, { max: 14, min: 9, color: C.ink, valign: 'middle' }); }); };
  const R = {
    async cover(d) { const s = k.slide(C.bg); k.txt(s, (k.M.org || '').toUpperCase(), 1.0, 0.7, 8.0, 0.35, { size: 11, color: C.role, align: 'center', spacing: 4 }); if (d.image) await k.photo(s, d.image, 4.1, 1.15, 1.8, 1.2, { gray: true }); k.head(s, d.title, 1.0, d.image ? 2.45 : 1.6, 8.0, 1.4, { max: 32, min: 16, bold: false, color: C.ink, align: 'center' }); t.line(s, 4.4, d.image ? 3.95 : 3.1, 1.2, 0, C.accent, 1); k.txt(s, k.M.author || '', 1.0, d.image ? 4.05 : 3.25, 8.0, 0.45, { size: 16, color: C.ink, align: 'center', italic: true }); k.txt(s, [d.subtitle, [k.M.loc, k.M.year].filter(Boolean).join(' \u2022 ')].filter(Boolean).join('\n'), 1.0, d.image ? 4.5 : 3.8, 8.0, 0.7, { max: 11, color: C.role, align: 'center' }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, G - 0.15 - RW, 1.3, RW, 3.6, { gray: true }); k.txt(s, d.text, G + 0.15, 1.3, NW, 3.6, { max: 14, min: 9.5, color: C.ink, ls: 1.35, valign: 'middle' }); },
    async image(d) { return R.intro(d); },
    async agenda(d) { const s = page(d); credits(s, d.items.map((it, i) => [`${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i] || i + 1}`, it])); },
    async cards(d) { const s = page(d); credits(s, d.items.map((it) => [it.h, it.t])); },
    async process(d) { const s = page(d); credits(s, d.steps.map((st, i) => [`${i + 1}. ${st.h}`, st.t])); },
    async stats(d) { const s = page(d); credits(s, [...d.stats.map((v) => [v.label, v.value]), ...(d.note ? [['\u2020', d.note]] : [])]); },
    async compare(d) { const s = page(d), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 13, NW - 0.2, F.body, 0.1, 3.4); k.txt(s, d.left.h.toUpperCase(), G - 0.15 - RW, 1.15, RW, 0.45, { size: 12, color: C.accent, align: 'right', spacing: 2 }); k.txt(s, d.right.h.toUpperCase(), G + 0.15, 1.15, NW, 0.45, { size: 12, color: C.accent, spacing: 2 });
      let y = 1.7; d.left.items.forEach((it, j) => { k.txt(s, it, G - 0.15 - RW, y, RW, rr[j], { size: fs, color: C.role, align: 'right' }); y += rr[j]; }); y = 1.7; d.right.items.forEach((it, j) => { k.txt(s, it, G + 0.15, y, NW, rr[j], { size: fs, color: C.ink }); y += rr[j]; }); t.line(s, G, 1.2, 0, 3.8, '333333', 0.75); },
    async statement(d) { const s = page(d); k.head(s, L.runs(d.text), 1.0, 1.3, 8.0, 2.4, { max: 28, min: 14, bold: false, color: C.ink, align: 'center' }); if (d.caption) k.txt(s, d.caption, 1.5, 3.85, 7.0, 1.1, { max: 11, color: C.role, align: 'center' }); },
    async timeline(d) { const s = page(d); credits(s, d.items.map((it) => [`${it.year} \u2022 ${it.h}`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, `\u201C${d.text}\u201D`, 1.2, 1.3, 7.6, 2.6, { max: 26, min: 13, italic: true, bold: false, color: C.ink, align: 'center' }); if (d.author) k.txt(s, d.author.toUpperCase(), 1.2, 4.05, 7.6, 0.4, { size: 12, color: C.accent, align: 'center', spacing: 3 }); },
    async sources(d) { const s = page(d); credits(s, d.items.map((it, i) => [`${i + 1}`, it])); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all in the cinema: letterbox, iris, title cards, tickets, marquee, curtain, leader (L.pages)
  const GOLD = C.accent, GREY = C.role, RED = '8B0000', DIM = '333333', COAL = '141414', PAPER = 'F2E6C2', DARK = '1A1A1A';
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 12.5, min: 10, ls: 1.15, color: C.ink, ...o });
  const role = (s, v, x, y, w, h, o = {}) => k.txt(s, String(v).toUpperCase(), x, y, w, h, { max: 11.5, min: 8.5, color: GOLD, valign: 'middle', spacing: 1, ls: 1.05, ...o });
  const cap = (s, title, x, y, w, h, o = {}) => { if (!title) return; const up = title.toUpperCase(), sp = up.length > 30 ? 1 : 3; k.txt(s, up, x, y, w, h, { size: L.fit(up, w - up.length * sp / 72, h, o.max || 15, 10, F.body), color: C.ink, valign: 'middle', spacing: sp, ...o, max: undefined }); };
  const hd = (s, v, x, y, w, h, o = {}) => k.head(s, v, x, y, w, h, { max: 26, min: 12, bold: false, color: C.ink, ...o });
  // a title card from the silent days: double gold edge with corner studs
  const titlecard = (s, x, y, w, h, fill = COAL) => { t.rect(s, x, y, w, h, fill, { line: { color: GOLD, width: 1.5 }, name: 'Title card' }); t.rect(s, x + 0.06, y + 0.06, w - 0.12, h - 0.12, null, { line: { color: GOLD, width: 0.5 }, name: 'Inner edge' }); [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([a, b]) => t.oval(s, a - 0.05, b - 0.05, 0.1, 0.1, GOLD, { name: 'Stud' })); };
  const bulbs = (W2, H2, gap = 26) => { let o = ''; for (let x = 12; x < W2; x += gap) o += `<circle cx="${x}" cy="10" r="6" fill="#F7DC8B"/><circle cx="${x}" cy="${H2 - 10}" r="6" fill="#F7DC8B"/>`; for (let y = 36; y < H2 - 20; y += gap) o += `<circle cx="10" cy="${y}" r="6" fill="#F7DC8B"/><circle cx="${W2 - 10}" cy="${y}" r="6" fill="#F7DC8B"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><rect x="2" y="2" width="${W2 - 4}" height="${H2 - 4}" rx="8" fill="#${RED}"/>${o}</svg>`; };
  const marquee = async (s, x, y, w, h) => t.img(s, await k.svg(`marq${w}-${h}`, bulbs(Math.round(w * 100), Math.round(h * 100)), Math.round(w * 100), Math.round(h * 100)), x, y, w, h);
  const curtain = async (s, x, w, flip) => { const W2 = Math.round(w * 100); let o = ''; for (let i = 0; i < 7; i++) o += `<rect x="${i * W2 / 7}" width="${W2 / 7}" height="562" fill="url(#f)"/>`; t.img(s, await k.svg(`curt${W2}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="562"><defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4A0000"/><stop offset="0.5" stop-color="#A01010"/><stop offset="1" stop-color="#4A0000"/></linearGradient></defs>${o}</svg>`, W2, 562), x, 0, w, 5.625); };
  const filmH = async (s, y, h) => { let o = ''; for (let x = 14; x < 1000; x += 34) o += `<rect x="${x}" y="8" width="18" height="12" rx="2" fill="#000"/><rect x="${x}" y="${h * 100 - 20}" width="18" height="12" rx="2" fill="#000"/>`; t.img(s, await k.svg(`film${h}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${h * 100}"><rect width="1000" height="${h * 100}" fill="#3C3C3C"/>${o}</svg>`, 1000, h * 100), 0, y, 10, h); };
  const clapStripe = (x, y, w, h) => k.svg(`clap${Math.round(w * 100)}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w * 100)}" height="${Math.round(h * 100)}"><rect width="100%" height="100%" fill="#F5F5F5"/>${Array.from({ length: Math.ceil(w * 3) + 1 }, (_, i) => `<polygon points="${i * 40 - 20},${h * 100} ${i * 40},0 ${i * 40 + 20},0 ${i * 40},${h * 100}" fill="#000"/>`).join('')}</svg>`, Math.round(w * 100), Math.round(h * 100));
  const V = {
    image: [
      async (d) => { // cinemascope: a wide picture between the black bars, the words as subtitles beneath
        const s = page(d);
        await k.photo(s, d.image, 0, 1.12, 10, 2.5);
        bd(s, d.text, 0.9, 3.72, 8.2, 1.5, { max: 12.5, color: C.ink, align: 'center', valign: 'middle' });
      },
      async (d) => { // the poster in a lit case at the left, the words at its side
        const s = page(d), x = 0.55, y = 1.12, w = 3.3, h = 4.08;
        await marquee(s, x, y, w, h);
        await k.photo(s, d.image, x + 0.26, y + 0.26, w - 0.52, h - 0.52);
        bd(s, d.text, 4.25, 1.12, 5.25, 4.08, { max: 13, valign: 'middle' });
      },
      async (d) => { // an iris shot: the picture seen through a closing circle on the black screen
        const s = k.slide(C.bg), dd = 4.7, x = 5.0, y = 0.46;
        t.oval(s, x - 0.07, y - 0.07, dd + 0.14, dd + 0.14, null, { line: { color: GOLD, width: 1.25 }, name: 'Iris' });
        t.img(s, await L.photo(L.src(d.image), dd, dd, { mask: 'circle', gray: true }), x, y, dd, dd, { alt: '' });
        if (d.title) k.txt(s, d.title.toUpperCase(), 0.5, 0.35, 4.25, 0.85, { max: 15, min: 10.5, color: C.ink, valign: 'middle', spacing: 2 });
        t.line(s, 0.5, 1.26, 0.8, 0, GOLD, 1);
        bd(s, d.text, 0.5, 1.36, 4.25, 3.84, { max: 12.5, valign: 'middle' });
        k.foot(s, { x: 0.5, y: 5.3, w: 4.25, size: 7, color: GREY });
      },
      async (d) => { // the frame is the whole screen: the words fade in over its dark right side
        const s = k.slide(C.bg);
        await k.photo(s, d.image, 0, 0, 10, 5.625, { gray: true });
        t.img(s, await L.scrim(C.bg, 0.15, 0.96, 'left'), 0, 0, 10, 5.625);
        t.rect(s, 5.4, 0, 4.6, 5.625, C.bg, { t: 30, name: 'Shade' });
        if (d.title) k.txt(s, d.title.toUpperCase(), 5.55, 0.35, 4.0, 0.85, { max: 15, min: 10.5, color: GOLD, valign: 'middle', spacing: 2 });
        bd(s, d.text, 5.55, 1.3, 4.0, 3.85, { max: 12.5, valign: 'middle', color: 'FFFFFF' });
        k.foot(s, { x: 5.55, y: 5.3, w: 4.0, size: 7, color: 'CFCFCF' });
      },
    ],
    cards: [
      async (d) => { // silent-film title cards: 2x2 with four, three tall ones with three
        const s = page(d), n = d.items.length, cols = n === 4 ? 2 : 3, gap = 0.16, w = (9.1 - gap * (cols - 1)) / cols, H2 = n === 4 ? 1.98 : 4.1;
        for (const [i, it] of d.items.entries()) {
          const x = 0.45 + (i % cols) * (w + gap), y = 1.12 + Math.floor(i / cols) * (H2 + 0.12);
          titlecard(s, x, y, w, H2);
          t.img(s, await k.icon(it.icon, GOLD, 1.5), x + w / 2 - 0.17, y + 0.13, 0.34, 0.34);
          role(s, it.h, x + 0.15, y + 0.5, w - 0.3, 0.38, { align: 'center' });
          bd(s, it.t, x + 0.16, y + 0.9, w - 0.32, H2 - 1.0, { align: 'center', max: n === 4 ? 12 : 13.5 });
        }
      },
      async (d) => { // opening credits: names in tall centred columns between fine gold rules
        const s = page(d), n = d.items.length, w = 9.2 / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w;
          if (i) t.line(s, x, 1.25, 0, 3.8, DIM, 0.75);
          t.img(s, await k.icon(it.icon, GREY, 1.25), x + w / 2 - 0.26, 1.22, 0.52, 0.52);
          role(s, it.h, x + 0.14, 1.82, w - 0.28, 0.6, { align: 'center' });
          t.line(s, x + w / 2 - 0.25, 2.46, 0.5, 0, GOLD, 1);
          bd(s, it.t, x + 0.14, 2.56, w - 0.28, 2.62, { align: 'center', max: 14 });
        }
      },
      async (d) => { // admission tickets: paper stubs in a row, each pushed left or right in turn
        const s = page(d), n = d.items.length, y0 = 1.12, rh = 4.1 / n, w = 8.4;
        for (const [i, it] of d.items.entries()) {
          const x = i % 2 ? 1.2 : 0.4, y = y0 + i * rh, h = rh - 0.1, W2 = Math.round(w * 100), H2 = Math.round(h * 100);
          t.img(s, await k.svg(`tick${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><path d="M0,0 H${W2} V${H2 * 0.38} a${H2 * 0.12},${H2 * 0.12} 0 0 0 0,${H2 * 0.24} V${H2} H0 V${H2 * 0.62} a${H2 * 0.12},${H2 * 0.12} 0 0 0 0,-${H2 * 0.24} Z" fill="#${PAPER}"/><line x1="130" y1="4" x2="130" y2="${H2 - 4}" stroke="#${RED}" stroke-width="2" stroke-dasharray="6 6"/></svg>`, W2, H2), x, y, w, h);
          t.img(s, await k.icon(it.icon, RED, 2), x + 0.48, y + h / 2 - 0.2, 0.4, 0.4);
          k.txt(s, it.h, x + 1.45, y + 0.04, 2.1, h - 0.08, { max: 13.5, min: 10.5, bold: true, color: RED, valign: 'middle', ls: 1.05 });
          bd(s, it.t, x + 3.65, y + 0.04, w - 3.9, h - 0.08, { color: '1A1A1A', valign: 'middle', max: 12 });
        }
      },
      async (d) => { // the stage: one lamp overhead, a beam falling on each idea at its own depth
        const s = k.slide(C.bg), n = d.items.length, w = 9.2 / n, ys = [1.75, 2.05, 1.85, 2.15], lamp = 5;
        cap(s, d.title, 0.5, 0.1, 9.0, 0.46, { max: 16, align: 'center' });
        const cx = (i) => 0.4 + i * w + w / 2, sv = d.items.map((_, i) => `<polygon points="${lamp * 100 - 5},70 ${lamp * 100 + 5},70 ${(cx(i) + w / 2 - 0.1) * 100},${ys[i] * 100} ${(cx(i) - w / 2 + 0.1) * 100},${ys[i] * 100}" fill="#F7E7A8" opacity="0.2"/>`).join('');
        t.img(s, await k.svg(`beams${n}`, `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="230">${sv}</svg>`, 1000, 230), 0, 0, 10, 2.3);
        t.oval(s, lamp - 0.12, 0.62, 0.24, 0.24, GOLD, { name: 'Lamp' });
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * w, y = ys[i];
          t.img(s, await k.icon(it.icon, GOLD, 1.75), cx(i) - 0.18, y - 0.45, 0.36, 0.36);
          role(s, it.h, x + 0.12, y, w - 0.24, 0.48, { align: 'center' });
          bd(s, it.t, x + 0.12, y + 0.5, w - 0.24, 5.22 - y - 0.5, { align: 'center', max: 13 });
        }
        k.foot(s, { y: 5.3, size: 7, align: 'center', color: GREY });
      },
    ],
    process: [
      async (d) => { // a storyboard: frames with a number, one arrow between each, the words under the frame
        const s = page(d), n = d.steps.length, gap = 0.3, w = (9.1 - gap * (n - 1)) / n;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.45 + i * (w + gap);
          t.rect(s, x, 1.15, w, 1.25, DARK, { line: { color: C.ink, width: 1 }, name: 'Frame' });
          k.txt(s, String(i + 1), x, 1.15, w, 1.25, { size: 44, color: GOLD, align: 'center', valign: 'middle', ls: 1 });
          if (i < n - 1) k.txt(s, '▸', x + w, 1.55, gap, 0.45, { size: 14, color: GOLD, align: 'center', valign: 'middle', ls: 1 });
          role(s, st.h, x, 2.48, w, 0.56);
          bd(s, st.t, x, 3.06, w, 2.14, { max: 13 });
        }
      },
      async (d) => { // the film leader: its big ring and cross on the left, the steps rolling down the right
        const s = page(d), n = d.steps.length, dd = 3.7, x = 0.5, y = 1.2, cx = x + dd / 2, cy = y + dd / 2, rh = 4.08 / n;
        t.rect(s, x - 0.1, y - 0.05, dd + 0.2, dd + 0.1, DARK, { name: 'Leader' });
        t.line(s, x - 0.1, cy, dd + 0.2, 0, GREY, 0.75); t.line(s, cx, y - 0.05, 0, dd + 0.1, GREY, 0.75);
        t.oval(s, x + 0.1, y + 0.1, dd - 0.2, dd - 0.2, null, { line: { color: C.ink, width: 2 }, name: 'Ring' });
        t.oval(s, x + 0.4, y + 0.4, dd - 0.8, dd - 0.8, null, { line: { color: C.ink, width: 2 }, name: 'Ring' });
        k.txt(s, String(n), cx - 0.9, cy - 0.9, 1.8, 1.8, { size: 96, color: GOLD, align: 'center', valign: 'middle', ls: 1 });
        for (const [i, st] of d.steps.entries()) {
          const yy = 1.12 + i * rh;
          k.txt(s, String(i + 1), 4.5, yy, 0.55, 0.42, { size: 19, color: GOLD, valign: 'middle', ls: 1 });
          role(s, st.h, 5.05, yy, 4.55, 0.42);
          bd(s, st.t, 5.05, yy + 0.43, 4.55, rh - 0.46, { max: 12 });
        }
      },
      async (d) => { // the gutter of the credits made into a spine: studs on it, steps at either hand
        const s = page(d), n = d.steps.length, y0 = 1.12, rh = 4.1 / n, w = 3.95;
        t.line(s, G, y0 + 0.12, 0, 3.88, GOLD, 1);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * rh, right = i % 2 === 1, x = right ? G + 0.42 : G - 0.42 - w, a = right ? 'left' : 'right', dd = 0.5, my = y + rh / 2 - dd / 2;
          t.oval(s, G - dd / 2, my, dd, dd, C.bg, { line: { color: GOLD, width: 1.25 }, name: 'Stud' });
          k.txt(s, String(i + 1), G - dd / 2, my, dd, dd, { size: 15, color: GOLD, align: 'center', valign: 'middle', ls: 1 });
          role(s, st.h, x, y + 0.02, w, 0.34, { align: a });
          bd(s, st.t, x, y + 0.37, w, rh - 0.39, { align: a, max: 12 });
        }
      },
      async (d) => { // clapperboards one higher than the other, striped head on each, a take number on the stripes
        const s = page(d), n = d.steps.length, gap = 0.14, w = (9.2 - gap * (n - 1)) / n, rise = n === 4 ? 0.27 : 0.38, hh = 0.38;
        for (const [i, st] of d.steps.entries()) {
          const x = 0.4 + i * (w + gap), y = 1.12 + (n - 1 - i) * rise, h = 5.2 - y;
          t.img(s, await clapStripe(x, y, w, hh), x, y, w, hh);
          t.rect(s, x, y + hh, w, h - hh, DARK, { line: { color: DIM, width: 0.75 }, name: 'Slate' });
          k.txt(s, String(i + 1), x + 0.14, y + hh + 0.06, 0.8, 0.52, { size: 28, color: 'FFFFFF', valign: 'middle', ls: 1 });
          role(s, st.h, x + 0.14, y + hh + 0.58, w - 0.28, 0.5);
          bd(s, st.t, x + 0.14, y + hh + 1.1, w - 0.28, h - hh - 1.18, { max: 12.5 });
        }
      },
    ],
    stats: [
      async (d) => { // the marquee over the door: one figure in lights, two at its sides, the note under it
        const s = page(d), [a, b, c] = d.stats, x = 2.85, w = 4.3, y = 1.15, h = 2.45;
        await marquee(s, x, y, w, h);
        hd(s, a.value, x + 0.35, y + 0.28, w - 0.7, 1.15, { max: 48, min: 22, bold: true, color: 'FFFFFF', align: 'center' });
        bd(s, a.label, x + 0.4, y + 1.45, w - 0.8, 0.68, { color: 'FFFFFF', max: 12, align: 'center' });
        [[b, 0.35, 'right'], [c, 7.4, 'left']].forEach(([v, xx, al]) => { hd(s, v.value, xx, 1.3, 2.25, 1.0, { max: 28, min: 15, color: GOLD, align: al }); bd(s, v.label, xx, 2.35, 2.25, 1.05, { color: GREY, max: 12, align: al }); });
        if (d.note) bd(s, d.note, 1.0, 3.78, 8.0, 1.42, { color: C.ink, max: 13, align: 'center', valign: 'middle' });
      },
      async (d) => { // three paper stubs torn from a roll, the figure printed on each
        const s = page(d), w = 2.85, gap = 0.3, h = 1.5;
        for (const [i, v] of d.stats.entries()) {
          const x = 0.5 + i * (w + gap), y = 1.2 + (i === 1 ? 0 : 0.14);
          t.rect(s, x, y, w, h, PAPER, { name: 'Stub' });
          t.line(s, x + 0.1, y + h - 0.2, w - 0.2, 0, RED, 1.25, { dash: 'dash' });
          hd(s, v.value, x + 0.12, y + 0.1, w - 0.24, h - 0.34, { max: 30, min: 16, bold: true, color: RED, align: 'center' });
          bd(s, v.label, x, y + h + 0.1, w, 0.75, { align: 'center', max: 12 });
        }
        if (d.note) { t.line(s, 3.5, 3.72, 3.0, 0, GOLD, 1); bd(s, d.note, 0.8, 3.8, 8.4, 1.4, { color: GREY, align: 'center', valign: 'middle', max: 13 }); }
      },
      async (d) => { // top billing: one centred column, each figure over its name, as on the last card
        const s = page(d), rh = 0.99;
        for (const [i, v] of d.stats.entries()) {
          const y = 1.1 + i * rh;
          hd(s, v.value, 2.0, y, 6.0, 0.6, { max: 30, min: 18, color: i ? C.ink : GOLD, align: 'center' });
          k.txt(s, v.label, 1.0, y + 0.6, 8.0, 0.34, { max: 11.5, min: 9.5, color: GREY, align: 'center', valign: 'middle', ls: 1.05 });
        }
        if (d.note) { t.line(s, 4.6, 4.1, 0.8, 0, GOLD, 1); bd(s, d.note, 1.0, 4.17, 8.0, 1.05, { color: C.ink, italic: true, max: 11.5, align: 'center', valign: 'middle' }); }
      },
    ],
    compare: [
      async (d) => { // the curtain half drawn: one side on the red cloth, the other on the dark screen, mirrored
        const s = k.slide(C.bg), { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 12.5, 4.0, F.body, 0.12, 3.0);
        await curtain(s, 0, 5);
        if (d.title) { t.rect(s, 0.4, 0.25, 9.2, 0.65, C.bg, { name: 'Title' }); cap(s, d.title, 0.5, 0.25, 9.0, 0.65, { max: 16, align: 'center' }); }
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? 5.45 : 0.55, w = 4.0, a = i ? 'left' : 'right';
          if (!i) t.rect(s, 0.4, 1.1, 4.25, 4.05, C.bg, { t: 28, name: 'Shade' });
          role(s, sd.h, x, 1.2, w, 0.55, { color: i ? GOLD : 'F7DC8B', align: a, max: 13 });
          let y = 1.9; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, color: 'FFFFFF', align: a, ls: 1 }); y += rr[j]; });
        }
        k.foot(s, { x: 5.45, y: 5.3, w: 4.15, size: 7, color: GREY });
      },
      async (d) => { // reel one, reel two: two strips one over the other, each with a name then its lines
        const s = page(d);
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? 3.2 : 1.12, h = 2.0, n = sd.items.length, x0 = 2.65, w = (9.7 - x0) / n;
          await filmH(s, y, h);
          t.rect(s, 0, y + 0.26, 10, h - 0.52, COAL, { name: 'Strip' });
          role(s, sd.h, 0.35, y + 0.3, 2.2, h - 0.6, { max: 11.5, color: GOLD, spacing: 0.5 });
          sd.items.forEach((it, j) => { const x = x0 + j * w; t.line(s, x, y + 0.26, 0, h - 0.52, '3C3C3C', 2); bd(s, it, x + 0.1, y + 0.3, w - 0.2, h - 0.6, { valign: 'middle', max: 11.5 }); });
        }
      },
    ],
    statement: [
      async (d) => { // curtains parted on either side, the words alone on the stage between
        const s = k.slide(C.bg);
        await curtain(s, 0, 1.25); await curtain(s, 8.75, 1.25);
        if (d.title) k.txt(s, d.title.toUpperCase(), 1.5, 0.3, 7.0, 0.55, { max: 14, min: 10, color: GREY, align: 'center', valign: 'middle', spacing: 3 });
        hd(s, L.runs(d.text), 1.6, 0.95, 6.8, 2.5, { max: 26, min: 14, align: 'center' });
        t.line(s, 4.4, 3.52, 1.2, 0, GOLD, 1);
        if (d.caption) bd(s, d.caption, 1.6, 3.6, 6.8, 1.6, { color: GREY, align: 'center', valign: 'middle', max: 12 });
        k.foot(s, { x: 1.6, y: 5.3, w: 6.8, size: 7, align: 'center', color: GREY });
      },
      async (d) => { // the last card of the picture: the page's whole edge in gold, words in gold italics
        const s = k.slide(C.bg);
        titlecard(s, 0.3, 0.25, 9.4, 4.95, C.bg);
        if (d.title) k.txt(s, d.title.toUpperCase(), 0.8, 0.45, 8.4, 0.5, { max: 13, min: 10, color: GREY, valign: 'middle', spacing: 3 });
        hd(s, L.runs(d.text), 0.8, 1.0, 8.4, 2.55, { max: 30, min: 16, italic: true, color: GOLD });
        if (d.caption) bd(s, d.caption, 0.8, 3.65, 8.4, 1.42, { color: C.ink, max: 12, valign: 'middle' });
        k.foot(s, { y: 5.3, size: 7, align: 'center', color: GREY });
      },
    ],
    timeline: [
      async (d) => { // a strip of film across the middle: the years its frames, events above and below in turn
        const s = page(d), y = 2.72, h = 0.72, w = 3.45, step = 1.88;
        await filmH(s, y, h);
        for (const [i, it] of d.items.entries()) {
          const x = 0.42 + i * step, up = i % 2 === 0, ty = up ? 1.12 : y + h + 0.06, th = up ? y - 1.16 : 5.22 - ty;
          t.rect(s, x, y + 0.18, 1.6, h - 0.36, C.bg, { name: 'Frame' });
          k.txt(s, it.year, x, y + 0.18, 1.6, h - 0.36, { max: 13, min: 9, color: GOLD, align: 'center', valign: 'middle', ls: 1 });
          role(s, it.h, x, ty, w, 0.3);
          bd(s, it.t, x, ty + 0.32, w, th - 0.34, { max: 11 });
        }
      },
      async (d) => { // the roll of honour: the year large in gold, name and words after it, gold hairlines
        const s = page(d), rh = 4.1 / 4;
        for (const [i, it] of d.items.entries()) {
          const y = 1.12 + i * rh;
          hd(s, it.year, 0.5, y, 2.0, rh - 0.06, { max: 20, min: 11, color: GOLD });
          role(s, it.h, 2.6, y, 2.1, rh - 0.06, { color: C.ink, max: 11 });
          bd(s, it.t, 4.8, y, 4.75, rh - 0.06, { valign: 'middle', max: 11.5 });
          if (i < 3) t.line(s, 0.5, y + rh - 0.03, 9.05, 0, DIM, 0.75);
        }
      },
      async (d) => { // four cinema fronts in a street: bulbs round each year, the bill pasted below
        const s = page(d), gap = 0.14, w = (9.2 - gap * 3) / 4;
        for (const [i, it] of d.items.entries()) {
          const x = 0.4 + i * (w + gap);
          await marquee(s, x, 1.12, w, 0.98);
          hd(s, it.year, x + 0.26, 1.2, w - 0.52, 0.82, { max: 17, min: 10, bold: true, color: 'FFFFFF', align: 'center' });
          t.rect(s, x, 2.1, w, 3.1, COAL, { line: { color: DIM, width: 0.75 }, name: 'Bill' });
          role(s, it.h, x + 0.12, 2.16, w - 0.24, 0.52, { align: 'center' });
          bd(s, it.t, x + 0.12, 2.7, w - 0.24, 2.46, { align: 'center', max: 12 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old cards, process, stats and timeline were the same two-column credit roll
  R.stats = V.stats.shift();
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Titrlar', colors: { dk1: C.bg, lt1: C.ink, dk2: '1A1A1A', lt2: C.role, accent1: C.accent, accent2: C.role, accent3: '8B0000', accent4: '4A6FA5', accent5: '666666', accent6: '333333', hlink: C.accent, folHlink: C.role } });
}
module.exports = { id: 155, slug: 'titrlar', name: 'Titrlar', category: 'luxury', photos: true, build, style: { tone: "yakuniy titr ohangi: rol va hissa, minnatdorlik; vazmin, qisqa va hurmatli", limits: {}, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "bold"], "transitions": ["fade", "p14:pan|dir=\"d\"", "dissolve"], "cover": ["riseWords", "fadeLetters"], "mark": "riseUp", "deco": "riseUp", "sig": {"title": "riseWords", "body": "riseUp", "item": "riseUp", "image": "fade", "number": "riseUp", "order": "seq", "stagger": 0.2}, "tempo": 1.25, "kenburns": false};
