/**
 * 33 Doska — classroom chalkboard: green slate with chalk dust, wooden frame and tray,
 * hand-drawn chalk underlines, circles and arrows, photos taped to the board.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { board: '2E4A3B', wood: '7A4E2A', wood2: '5A3820', chalk: 'F4F4EE', yellow: 'F6E27F', pink: 'F4A9A8', blue: 'A8D8F0', dust: 'C3CEC6', tape: 'E8DDB5' };
const F = { head: 'Bookman Old Style', body: 'Calibri' };

let seed = 11; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const wobble = (w, h, color, sw = 6) => { // hand-drawn horizontal chalk stroke
  let d = `M4,${h / 2}`; for (let x = 20; x <= w - 4; x += 20) d += ` L${x},${(h / 2 + (rnd() - 0.5) * h * 0.35).toFixed(1)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="none" stroke="#${color}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke-width="${sw}" stroke-opacity="0.85"/><path d="${d}" stroke-width="${sw * 0.5}" stroke-opacity="0.5" transform="translate(3 2)"/></g></svg>`;
};
const ring = (w, h, color) => { // hand-drawn ellipse that does not quite close
  let d = ''; const n = 40; for (let i = 0; i <= n + 3; i++) { const a = (i / n) * 2 * Math.PI - 0.4, rx = w / 2 - 8 + (rnd() - 0.5) * 6, ry = h / 2 - 8 + (rnd() - 0.5) * 6; d += (i ? ' L' : 'M') + `${(w / 2 + rx * Math.cos(a)).toFixed(1)},${(h / 2 + ry * Math.sin(a)).toFixed(1)}`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="none" stroke="#${color}" stroke-width="5" stroke-opacity="0.85" stroke-linecap="round"/></svg>`;
};
const arrow = (w, h, color) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="none" stroke="#${color}" stroke-width="5" stroke-linecap="round" stroke-opacity="0.85"><path d="M6,${h / 2} C${w * 0.35},${h * 0.3} ${w * 0.65},${h * 0.7} ${w - 10},${h / 2}"/><path d="M${w - 30},${h / 2 - 16} L${w - 8},${h / 2} L${w - 30},${h / 2 + 16}"/></g></svg>`;
const boardSvg = () => {
  let smudge = ''; for (let i = 0; i < 9; i++) smudge += `<ellipse cx="${rnd() * 1600}" cy="${rnd() * 900}" rx="${150 + rnd() * 250}" ry="${40 + rnd() * 80}" fill="#FFFFFF" opacity="0.035"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0"/></filter></defs>
  <rect width="1600" height="900" fill="#${C.wood}"/><rect x="26" y="26" width="1548" height="820" fill="#${C.board}"/><rect x="26" y="26" width="1548" height="820" filter="url(#n)"/>${smudge}
  <rect x="0" y="846" width="1600" height="54" fill="#${C.wood2}"/><rect x="260" y="852" width="90" height="16" rx="6" fill="#${C.chalk}"/><rect x="380" y="854" width="60" height="14" rx="6" fill="#${C.yellow}"/><rect x="1180" y="850" width="120" height="22" rx="4" fill="#9C8F7A"/></svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(boardSvg(), 1600, 900, true);
  const memo = {}; const img = async (k, svg, w, h) => (memo[k] ??= await L.svg(svg, w, h));
  const under = (s, x, y, w, color = C.yellow) => img('u' + w + color, wobble(Math.round(w * 100), 30, color), w * 100, 30).then((d) => t.img(s, d, x, y, w, 0.3));
  const circ = (s, x, y, w, h, color = C.chalk) => img(`r${w}${h}${color}`, ring(Math.round(w * 100), Math.round(h * 100), color), w * 100, h * 100).then((d) => t.img(s, d, x, y, w, h));
  const arr = (s, x, y, w, color = C.chalk) => img('a' + w + color, arrow(Math.round(w * 100), 60, color), w * 100, 60).then((d) => t.img(s, d, x, y, w, 0.6));
  const taped = async (s, src, x, y, w, h) => {
    t.rect(s, x, y, w, h, 'F7F7F2', { shadow: 0.35, blur: 8, offset: 3, name: 'Photo paper' });
    t.img(s, await L.photo(L.src(src), w - 0.2, h - 0.45), x + 0.1, y + 0.1, w - 0.2, h - 0.45, { alt: '' });
    t.rect(s, x - 0.15, y - 0.08, 0.9, 0.26, C.tape, { t: 25, rotate: -18, name: 'Tape' });
    t.rect(s, x + w - 0.75, y - 0.08, 0.9, 0.26, C.tape, { t: 25, rotate: 16, name: 'Tape' });
  };
  const footer = (s) => t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.45, y: 4.95, w: 9.1, h: 0.25, fontSize: 9, color: C.dust, align: 'right' });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.title) {
      const fs = L.fit(d.title, 8.0, 0.65, 28, 16, F.head, true);
      t.text(s, d.title, { x: 0.55, y: 0.35, w: 8.0, h: 0.65, fontFace: F.head, bold: true, fontSize: fs, color: C.yellow, valign: 'middle' });
      await under(s, 0.55, 0.95, Math.min(8.0, L.width(d.title, fs, F.head, true) + 0.2));
    }
    t.text(s, String(idx), { x: 8.85, y: 0.35, w: 0.6, h: 0.6, fontFace: F.head, fontSize: 16, color: C.chalk, align: 'center', valign: 'middle' });
    await circ(s, 8.8, 0.3, 0.7, 0.7);
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.chalk, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.image) await taped(s, d.image, 6.0, 0.6, 3.4, 2.9);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 0.6, y: 0.55, w: 5, h: 0.3, fontSize: 13, color: C.blue });
    const fs = L.fit(d.title, 5.0, 2.3, 40, 22, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 5.0, h: 2.4, fontFace: F.head, bold: true, fontSize: fs, color: C.chalk, valign: 'bottom' });
    await under(s, 0.6, 3.35, 3.0, C.pink);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.7, w: 5.0, h: 0.8, fontSize: 14, color: C.dust });
    t.text(s, M.author || '', { x: 6.0, y: 3.85, w: 3.4, h: 0.4, fontFace: F.head, fontSize: 16, bold: true, color: C.yellow, align: 'center' });
    t.text(s, M.topic || '', { x: 0.45, y: 4.95, w: 9.1, h: 0.25, fontSize: 9, color: C.dust, align: 'right' });
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = await page(d); await taped(s, d.image, 0.7, 1.45, 3.9, 3.3); para(s, d.text, 5.0, 1.4, 4.4, 3.4); },
    async image(d) { const s = await page(d); para(s, d.text, 0.6, 1.4, 4.3, 3.4); await taped(s, d.image, 5.4, 1.45, 3.9, 3.3); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.4 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.4 + (i % per) * rh;
        await circ(s, x, y, 0.65, 0.6, [C.yellow, C.pink, C.blue][i % 3]);
        t.text(s, String(i + 1), { x, y, w: 0.65, h: 0.6, fontFace: F.head, fontSize: 18, bold: true, color: C.chalk, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y, w: 3.4, h: 0.6, fontSize: 18, color: C.chalk, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.25, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.3);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), col = [C.yellow, C.pink, C.blue, C.chalk][i % 4];
        t.rect(s, x, 1.45, w, h, null, { line: { color: col, width: 1.75, dashType: 'sysDash' }, name: 'Chalk box' });
        t.img(s, await L.icon(it.icon, col, 1.75), x + 0.2, 1.65, 0.45, 0.45);
        t.text(s, it.h, { x: x + 0.2, y: 2.2, w: w - 0.4, h: 0.45, fontFace: F.head, fontSize: L.fit(it.h, w - 0.4, 0.45, 17, 12, F.head, true), bold: true, color: col });
        t.text(s, it.t, { x: x + 0.2, y: 2.68, w: w - 0.4, h: h - 1.3, fontSize: 14, color: C.chalk });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        await circ(s, x, 1.45, 0.75, 0.7, C.yellow);
        t.text(s, String(i + 1), { x, y: 1.45, w: 0.75, h: 0.7, fontFace: F.head, fontSize: 20, bold: true, color: C.chalk, align: 'center', valign: 'middle' });
        if (i < n - 1) await arr(s, x + 0.85, 1.5, cw - 1.0);
        t.text(s, st.h, { x, y: 2.4, w: cw - 0.3, h: 0.5, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.3, 0.5, 17, 11, F.head, true), bold: true, color: C.pink });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.3, h: 1.85, fontSize: L.fit(st.t, cw - 0.3, 1.85, 15, 11, F.body), color: C.chalk });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.8 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * cw;
        await circ(s, px + 0.1, 1.4, cw - 0.5, 1.5, [C.yellow, C.pink, C.blue][i % 3]);
        t.text(s, x.value, { x: px + 0.3, y: 1.45, w: cw - 0.9, h: 1.4, fontFace: F.head, fontSize: L.fit(x.value, cw - 1.2, 0.9, 44, 20, F.head, true), bold: true, color: C.chalk, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.1, w: cw - 0.3, h: 1.0, fontSize: 15, color: C.chalk, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.3, w: 8.8, h: 0.45, fontSize: 11, italic: true, color: C.dust });
    },
    async compare(d) {
      const s = await page(d), w = 4.1;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.4, F.body, 0.22, 4.85 - 2.05);
      t.line(s, 5.0, 1.45, 0, 3.3, C.chalk, 2, { dash: 'sysDash' });
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.35 : 0.6, col = i ? C.blue : C.pink;
        t.text(s, side.h, { x, y: 1.4, w, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: col });
        let y = 2.05;
        side.items.forEach((it, k) => { t.text(s, `\u2014 ${it}`, { x, y, w: w - 0.2, h: rows[k], fontSize: CFS, color: C.chalk }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = await page(d);
      t.text(s, '\u2605', { x: 0.6, y: 1.4, w: 0.8, h: 0.8, fontSize: 40, color: C.yellow });
      t.text(s, L.runs(d.text), { x: 1.4, y: 1.4, w: 7.8, h: 1.8, fontFace: F.head, fontSize: L.fit(d.text, 7.8, 1.7, 34, 20, F.head, true), bold: true, color: C.chalk, valign: 'middle' });
      await under(s, 1.4, 3.25, 4.0, C.pink);
      if (d.caption) t.text(s, d.caption, { x: 1.4, y: 3.6, w: 7.8, h: 1.1, fontSize: L.fit(d.caption, 7.8, 1.1, 15, 11, F.body), color: C.dust });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      await under(s, 0.6, 2.05, 8.8, C.chalk);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.35, w: cw - 0.2, h: 0.6, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.55, 26, 13, F.head, true), bold: true, color: [C.yellow, C.pink, C.blue, C.yellow][i % 4], valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.55, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.chalk });
        t.text(s, it.t, { x, y: 3.0, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.dust });
      });
    },
    async quote(d) {
      const s = await page({});
      t.text(s, '\u201C', { x: 0.6, y: 0.8, w: 1.2, h: 1.3, fontFace: F.head, fontSize: 100, color: C.pink });
      t.text(s, d.text, { x: 1.4, y: 1.4, w: 7.6, h: 2.3, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 7.6, 2.2, 32, 18, F.head, false, 1, true), color: C.chalk, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 1.4, y: 3.85, w: 7.6, h: 0.4, fontSize: 16, color: C.yellow });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.56, 3.4 / n);
      d.items.forEach((it, i) => t.text(s, [{ text: `${i + 1})  `, options: { color: C.yellow, bold: true } }, { text: it, options: { color: C.chalk } }],
        { x: 0.6, y: 1.4 + i * rh, w: 8.8, h: rh, fontSize: L.fit(it, 8.4, rh - 0.04, 15, 10, F.body), valign: 'middle' }));
    },
  };
  // ---- further ways to draw a type, in chalk on the slate: a deck's pages must not look alike (L.pages)
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10.5, F.head, true), color: o.color || C.yellow, align: o.align, valign: o.valign || 'middle' });
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13.5, 10, F.body), color: o.color || C.chalk, align: o.align, valign: o.valign || 'top' });
  const tape = (s, x, y, rot = -6) => t.rect(s, x, y, 0.9, 0.26, C.tape, { t: 25, rotate: rot, name: 'Tape' });
  const sheet = (s, x, y, w, h, fill = C.chalk) => t.rect(s, x, y, w, h, fill, { shadow: 0.35, blur: 8, offset: 3, name: 'Paper' });
  const chalkPath = (d, w, h, color = C.chalk, sw = 4) => L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="none" stroke="#${color}" stroke-width="${sw}" stroke-opacity="0.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`, w, h);
  const titleAt = async (s, d, x, w, fsMax = 24) => {
    const fs = L.fit(d.title, w, 0.8, fsMax, 15, F.head, true);
    t.text(s, d.title, { x, y: 0.3, w, h: 0.8, fontFace: F.head, bold: true, fontSize: fs, color: C.yellow, valign: 'middle' });
    await under(s, x, 1.07, Math.min(w, 3.0));
  };
  const pageNo = async (s, x, y) => { t.text(s, String(idx), { x, y, w: 0.6, h: 0.6, fontFace: F.head, fontSize: 16, color: C.chalk, align: 'center', valign: 'middle' }); await circ(s, x - 0.05, y - 0.05, 0.7, 0.7); };
  const V = {
    image: [
      async (d) => { // a long print taped across the board, the lesson written beneath it
        const s = await page(d), x = 0.6, y = 1.42, w = 8.8, h = 1.95;
        t.rect(s, x, y, w, h, 'F7F7F2', { shadow: 0.35, blur: 8, offset: 3, name: 'Photo paper' });
        t.img(s, await L.photo(L.src(d.image), w - 0.16, h - 0.16), x + 0.08, y + 0.08, w - 0.16, h - 0.16, { alt: d.title });
        tape(s, x + 0.3, y - 0.1, -8); tape(s, x + w - 1.2, y - 0.1, 7);
        para(s, d.text, 0.6, 3.47, 8.8, 1.42);
      },
      async (d) => { // the picture circled in chalk, an arrow leads from it to the words
        const s = await page(d), dia = 3.1, x = 0.75, y = 1.5;
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        await circ(s, x - 0.17, y - 0.17, 3.44, 3.44, C.pink);
        await arr(s, 4.0, 2.75, 0.8, C.yellow);
        para(s, d.text, 4.95, 1.4, 4.45, 3.45);
      },
      async (d) => { // the picture fills the board, one patch wiped clean for the words
        const s = pres.addSlide(); s.background = { data: bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), 9.675, 4.74), 0.1625, 0.1625, 9.675, 4.74, { alt: d.title });
        t.rect(s, 4.75, 0.35, 4.85, 4.35, C.board, { t: 5, line: { color: C.chalk, width: 1.5, dashType: 'sysDash' }, name: 'Wiped slate' });
        await titleAt(s, d, 4.95, 3.75, 20);
        await pageNo(s, 8.85, 0.42);
        para(s, d.text, 4.95, 1.42, 4.45, 3.2);
        footer(s);
      },
      async (d) => { // the picture drawn in chalk: a tall column of board tones, the words beside it
        const s = pres.addSlide(); s.background = { data: bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), 3.6, 5.125, { duo: [C.board, C.chalk] }), 0.1625, 0.1625, 3.6, 5.125, { alt: d.title });
        t.line(s, 3.7625, 0.1625, 0, 5.125, C.chalk, 2, { dash: 'sysDash' });
        await titleAt(s, d, 4.05, 4.65);
        await pageNo(s, 8.85, 0.42);
        para(s, d.text, 4.05, 1.42, 5.35, 3.45);
        t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 4.05, y: 4.95, w: 5.5, h: 0.25, fontSize: 8, color: C.dust, align: 'right' });
      },
    ],
    cards: [
      async (d) => { // lines of a lesson: a ringed icon, the term, what it means, a chalk stroke under each
        const s = await page(d), n = d.items.length, y0 = 1.38, h = 3.5 / n;
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h, col = [C.yellow, C.pink, C.blue, C.chalk][i];
          await circ(s, 0.6, y + h / 2 - 0.36, 0.72, 0.72, col);
          t.img(s, await L.icon(it.icon, col, 1.75), 0.8, y + h / 2 - 0.16, 0.32, 0.32);
          head(s, it.h, 1.5, y + 0.04, 2.35, h - 0.12, { color: col });
          body(s, it.t, 4.0, y + 0.04, 5.4, h - 0.12, { valign: 'middle' });
          if (i < n - 1) t.line(s, 1.5, y + h - 0.03, 7.9, 0, C.dust, 1, { dash: 'sysDash' });
        }
      },
      async (d) => { // paper slips taped up at uneven heights: dark ink on colour
        const s = await page(d), n = d.items.length, g = 0.22, w = (8.8 - g * (n - 1)) / n, h = 3.08;
        for (const [i, it] of d.items.entries()) {
          const x = 0.6 + i * (w + g), y = 1.46 + (i % 2 ? 0.32 : 0);
          sheet(s, x, y, w, h, [C.yellow, C.pink, C.blue, C.chalk][i]);
          tape(s, x + w / 2 - 0.45, y - 0.12, i % 2 ? 5 : -5);
          t.img(s, await L.icon(it.icon, C.board, 2), x + 0.16, y + 0.2, 0.36, 0.36);
          head(s, it.h, x + 0.16, y + 0.6, w - 0.32, 0.56, { color: C.board, max: 14, valign: 'top' });
          body(s, it.t, x + 0.16, y + 1.18, w - 0.32, h - 1.26, { color: C.board });
        }
      },
      async (d) => { // the teacher's mind map: a ringed star, chalk lines out to each idea
        const s = await page(d), n = d.items.length, cx = 5.0, cy = 3.12, bw = 3.25, x0 = 0.5, y0 = 1.35;
        const L_ = 2, R_ = n - L_, hl = 3.55 / L_, hr = 3.55 / R_;
        const spots = d.items.map((_, i) => (i < L_ ? [0.6, y0 + i * hl, hl, 3.92] : [6.15, y0 + (i - L_) * hr, hr, 6.08]));
        let p = '';
        for (const [, y, h, ex] of spots) { const my = y + (h > 2 ? h / 2 : 0.2); p += `M${(cx - x0) * 100},${(cy - y0) * 100} Q${((cx + ex) / 2 - x0) * 100},${(cy - y0) * 100} ${(ex - x0) * 100},${(my - y0) * 100} `; }
        t.img(s, await chalkPath(p, 900, 355), x0, y0, 9, 3.55);
        t.oval(s, cx - 0.72, cy - 0.62, 1.44, 1.24, C.board);
        await circ(s, cx - 0.72, cy - 0.62, 1.44, 1.24, C.yellow);
        t.text(s, '★', { x: cx - 0.72, y: cy - 0.62, w: 1.44, h: 1.24, fontSize: 32, color: C.yellow, align: 'center', valign: 'middle' });
        for (const [i, it] of d.items.entries()) {
          const [x, y, h] = spots[i], col = [C.pink, C.blue, C.yellow, C.chalk][i], tall = h > 2, top = tall ? y + h / 2 - 0.2 : y;
          t.img(s, await L.icon(it.icon, col, 1.75), x, top + 0.03, 0.32, 0.32);
          head(s, it.h, x + 0.4, top, bw - 0.4, 0.4, { color: col, max: 14 });
          body(s, it.t, x, top + 0.42, bw, h - 0.48 - (tall ? h / 2 - 0.2 : 0), { max: 13 });
        }
      },
      async (d) => { // the topic of the day: one idea written large, the rest noted to the side
        const s = await page(d), [a, ...rest] = d.items, h = 3.5 / rest.length;
        await circ(s, 0.6, 1.42, 1.15, 1.05, C.yellow);
        t.img(s, await L.icon(a.icon, C.yellow, 1.75), 0.93, 1.71, 0.48, 0.48);
        head(s, a.h, 1.9, 1.42, 2.95, 1.05, { max: 21 });
        await under(s, 0.6, 2.52, 4.2, C.pink);
        body(s, a.t, 0.6, 2.88, 4.25, 1.98, { max: 17 });
        t.line(s, 5.1, 1.42, 0, 3.4, C.chalk, 1.5, { dash: 'sysDash' });
        for (const [i, it] of rest.entries()) {
          const y = 1.38 + i * h, col = [C.pink, C.blue, C.chalk][i];
          t.img(s, await L.icon(it.icon, col, 1.75), 5.35, y + 0.06, 0.3, 0.3);
          head(s, it.h, 5.75, y + 0.02, 3.65, 0.38, { color: col, max: 14 });
          body(s, it.t, 5.35, y + 0.42, 4.05, h - 0.5, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // a staircase in chalk, climbing to the right: each tread holds a step
        const s = await page(d), n = d.steps.length, w = 8.8 / n, y0 = 2.95, dy = 1.55 / (n - 1), base = 4.86;
        let p = `M0,${(y0 - 1.3) * 100}`;
        d.steps.forEach((_, i) => { const y = (y0 - i * dy - 1.3) * 100, x = i * w * 100; p += ` L${x},${y} L${x + w * 100},${y}`; });
        t.img(s, await chalkPath(p, 880, 200, C.yellow, 5), 0.6, 1.3, 8.8, 2);
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * w, y = y0 - i * dy, col = [C.pink, C.blue, C.yellow, C.chalk][i];
          t.rect(s, x, y + 0.02, w, base - y, C.chalk, { t: 93, name: 'Stair' });
          t.text(s, String(i + 1), { x: x + 0.1, y: y + 0.08, w: 0.42, h: 0.5, fontFace: F.head, bold: true, fontSize: 24, color: col, valign: 'middle' });
          head(s, st.h, x + 0.52, y + 0.08, w - 0.62, 0.5, { color: col, max: 13.5 });
          body(s, st.t, x + 0.12, y + 0.62, w - 0.24, base - y - 0.68, { max: 13 });
        });
      },
      async (d) => { // a line down the middle of the board, the steps left and right of it in turn
        const s = await page(d), n = d.steps.length, y0 = 1.36, h = 3.52 / n, cx = 5.0;
        t.line(s, cx, y0 + h / 2, 0, h * (n - 1), C.chalk, 2, { dash: 'sysDash' });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? 0.6 : 5.5, w = 3.9, al = left ? 'right' : 'left', col = [C.yellow, C.pink, C.blue, C.yellow][i], r = 0.27;
          t.oval(s, cx - r, y + h / 2 - r, 2 * r, 2 * r, C.board);
          await circ(s, cx - r - 0.03, y + h / 2 - r - 0.03, 0.6, 0.6, col);
          t.text(s, String(i + 1), { x: cx - r, y: y + h / 2 - r, w: 2 * r, h: 2 * r, fontFace: F.head, bold: true, fontSize: 15, color: C.chalk, align: 'center', valign: 'middle' });
          head(s, st.h, x, y + 0.02, w, 0.28, { color: col, max: 13.5, align: al });
          body(s, st.t, x, y + 0.31, w, h - 0.35, { max: 12.5, align: al });
        }
      },
      async (d) => { // worked example: each line starts further right, a chalk elbow leads on from a yellow disc
        const s = await page(d), n = d.steps.length, y0 = 1.38, h = 3.5 / n, dx = n === 3 ? 0.75 : 0.55, w = 6.0, r = 0.56;
        let p = '';
        d.steps.forEach((_, i) => { if (i < n - 1) { const X = (0.6 + i * dx + r / 2) * 100, Y = (i * h + 0.05 + r) * 100; p += `M${X},${Y} L${X},${((i + 1) * h + 0.05 + r / 2) * 100} L${X + (dx - r / 2) * 100},${((i + 1) * h + 0.05 + r / 2) * 100} `; } });
        t.img(s, await chalkPath(p, 400, 350, C.chalk, 3.5), 0, y0, 4, 3.5);
        d.steps.forEach((st, i) => {
          const x = 0.6 + i * dx, y = y0 + i * h;
          t.oval(s, x, y + 0.05, r, r, C.yellow);
          t.text(s, String(i + 1), { x, y: y + 0.05, w: r, h: r, fontFace: F.head, bold: true, fontSize: 18, color: C.board, align: 'center', valign: 'middle' });
          head(s, st.h, x + r + 0.15, y + 0.02, w, 0.3, { color: C.pink, max: 14 });
          body(s, st.t, x + r + 0.15, y + 0.33, w, h - 0.37, { max: 13 });
        });
      },
    ],
    stats: [
      async (d) => { // one number written huge and underlined, two more quietly to the side
        const s = await page(d), [a, ...rest] = d.stats;
        t.text(s, a.value, { x: 0.6, y: 1.32, w: 4.7, h: 1.6, fontFace: F.head, bold: true, fontSize: L.fit(a.value, 4.7, 1.5, 76, 30, F.head, true), color: C.yellow, valign: 'middle' });
        await under(s, 0.6, 2.92, 4.4, C.pink);
        body(s, a.label, 0.6, 3.28, 4.5, 0.82, { max: 16 });
        t.line(s, 5.42, 1.42, 0, 2.65, C.chalk, 1.5, { dash: 'sysDash' });
        rest.forEach((q, i) => {
          const y = 1.36 + i * 1.38;
          t.text(s, q.value, { x: 5.7, y, w: 3.7, h: 0.68, fontFace: F.head, bold: true, fontSize: L.fit(q.value, 3.7, 0.65, 32, 18, F.head, true), color: i ? C.blue : C.pink, valign: 'middle' });
          body(s, q.label, 5.7, y + 0.68, 3.7, 0.62, { max: 13 });
        });
        if (d.note) body(s, d.note, 0.6, 4.2, 8.8, 0.68, { max: 12, color: C.dust, valign: 'middle' });
      },
      async (d) => { // written out as equations, one under another
        const s = await page(d), y0 = 1.36, h = 0.84;
        d.stats.forEach((q, i) => {
          const y = y0 + i * h, col = [C.yellow, C.pink, C.blue][i];
          t.text(s, q.value, { x: 0.6, y, w: 3.1, h: h - 0.04, fontFace: F.head, bold: true, fontSize: L.fit(q.value, 3.1, h - 0.1, 38, 18, F.head, true), color: col, align: 'right', valign: 'middle' });
          t.text(s, '=', { x: 3.8, y, w: 0.6, h: h - 0.04, fontFace: F.head, fontSize: 30, color: C.chalk, align: 'center', valign: 'middle' });
          body(s, q.label, 4.5, y + 0.02, 4.9, h - 0.08, { max: 16, valign: 'middle' });
        });
        if (d.note) {
          t.rect(s, 0.6, 3.96, 8.8, 0.92, null, { line: { color: C.dust, width: 1.25, dashType: 'sysDash' }, name: 'Chalk box' });
          body(s, d.note, 0.75, 4.0, 8.5, 0.84, { max: 12.5, color: C.dust, valign: 'middle' });
        }
      },
    ],
    compare: [
      async (d) => { // two lines of the board, one over the other: a wooden label opens each
        const s = await page(d), bh = 1.68;
        for (const [i, side] of [d.left, d.right].entries()) {
          const y = 1.38 + i * (bh + 0.14), n = side.items.length, x0 = 2.85, cw = 6.55 / n, col = i ? C.blue : C.pink;
          t.rect(s, 0.6, y, 2.05, bh, i ? C.wood2 : C.wood, { name: 'Wooden label' });
          head(s, side.h, 0.72, y + 0.08, 1.81, bh - 0.16, { color: C.chalk, max: 16 });
          t.rect(s, 2.65, y, 6.75, bh, null, { line: { color: col, width: 1.5, dashType: 'sysDash' }, name: 'Chalk box' });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.07, y + 0.18, 0, bh - 0.36, col, 1);
            body(s, it, x0 + k * cw, y + 0.08, cw - 0.16, bh - 0.16, { max: 13.5, valign: 'middle' });
          });
        }
      },
      async (d) => { // mirrored: a sheet of paper against chalk on the slate, ringed numbers between
        const s = await page(d), w = 3.5, y0 = 2.0, avail = 2.8;
        const fit = L.rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.1, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        sheet(s, 0.5, 1.36, 4.1, 3.52);
        tape(s, 0.8, 1.26, -7);
        head(s, d.left.h, 0.8, 1.46, w, 0.5, { color: C.board, max: 18, align: 'right' });
        head(s, d.right.h, 5.4, 1.46, w, 0.5, { color: C.blue, max: 18 });
        let y = y0;
        for (const [k, rh0] of fit.rows.entries()) {
          const rh = rh0 + extra;
          if (d.left.items[k]) t.text(s, d.left.items[k], { x: 0.8, y, w, h: rh, fontSize: fit.fs, color: C.board, align: 'right', valign: 'middle' });
          if (d.right.items[k]) t.text(s, d.right.items[k], { x: 5.4, y, w, h: rh, fontSize: fit.fs, color: C.chalk, valign: 'middle' });
          await circ(s, 4.72, y + rh / 2 - 0.26, 0.56, 0.52, C.yellow);
          t.text(s, String(k + 1), { x: 4.72, y: y + rh / 2 - 0.26, w: 0.56, h: 0.52, fontFace: F.head, bold: true, fontSize: 13, color: C.chalk, align: 'center', valign: 'middle' });
          y += rh;
        }
      },
    ],
    statement: [
      async (d) => { // the whole idea ringed in chalk, the teacher's note beneath
        const s = await page(d);
        await circ(s, 0.7, 1.28, 8.6, 2.7, C.pink);
        t.text(s, L.runs(d.text), { x: 1.75, y: 1.62, w: 6.5, h: 2.02, fontFace: F.head, bold: true, fontSize: L.fit(d.text, 6.5, 1.95, 28, 15, F.head, true), color: C.chalk, align: 'center', valign: 'middle' });
        if (d.caption) body(s, d.caption, 0.8, 4.03, 8.4, 0.86, { max: 13, color: C.dust, align: 'center', valign: 'middle' });
      },
      async (d) => { // a page pinned up: dark words on paper, a chalk remark beside it
        const s = await page(d), x = 0.6, y = 1.46, w = d.caption ? 5.6 : 8.8, h = 3.36;
        sheet(s, x, y, w, h);
        tape(s, x + w / 2 - 0.45, y - 0.12, -4);
        t.text(s, L.runs(d.text), { x: x + 0.35, y: y + 0.25, w: w - 0.7, h: h - 0.5, fontFace: F.head, bold: true, fontSize: L.fit(d.text, w - 0.7, h - 0.55, 30, 15, F.head, true), color: C.board, valign: 'middle' });
        if (d.caption) { await under(s, 6.5, 1.38, 1.5, C.pink); body(s, d.caption, 6.5, 1.75, 2.9, 3.1, { max: 15 }); }
      },
    ],
    timeline: [
      async (d) => { // a wooden ruler laid across the slate, events above and below its marks
        const s = await page(d), ry = 2.96, rh = 0.26, w = 3.95, xs = [0.6, 1.55, 4.75, 5.45], ticks = [];
        for (let k = 0; k <= 92; k++) ticks.push(`<line x1="${k * 10 + 5}" y1="0" x2="${k * 10 + 5}" y2="${k % 10 ? 7 : 15}"/>`);
        t.rect(s, 0.25, ry, 9.5, rh, C.wood, { name: 'Ruler' });
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="950" height="26"><g stroke="#${C.chalk}" stroke-width="1.5">${ticks.join('')}</g></svg>`, 950, 26), 0.25, ry, 9.5, rh);
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], col = [C.yellow, C.pink, C.blue, C.yellow][i], y = up ? 1.34 : ry + rh + 0.1, tH = up ? ry - y - 0.5 : 4.88 - y - 0.42;
          t.line(s, x, up ? y + 0.05 : ry + rh, 0, up ? ry - y - 0.05 : 0.5, col, 2);
          const yw = 1.45;
          t.text(s, it.year, { x: x + 0.1, y, w: yw, h: 0.38, fontFace: F.head, bold: true, fontSize: L.fit(it.year, yw, 0.36, 20, 11, F.head, true), color: col, valign: 'middle' });
          head(s, it.h, x + 0.1 + yw + 0.05, y, w - yw - 0.15, 0.38, { color: C.chalk, max: 13 });
          body(s, it.t, x + 0.1, y + 0.42, w - 0.1, tH, { max: 13 });
        });
      },
      async (d) => { // tear-off calendar leaves hung on the board, one to a date
        const s = await page(d), w = 4.3, h = 1.66;
        d.items.forEach((it, i) => {
          const x = 0.6 + (i % 2) * (w + 0.2), y = 1.4 + Math.floor(i / 2) * (h + 0.16), col = [C.pink, C.yellow, C.blue, C.pink][i];
          sheet(s, x, y, w, h);
          t.rect(s, x, y, 1.2, h, col, { name: 'Date leaf' });
          [0.2, 0.55, 0.9].forEach((k) => t.oval(s, x + k, y + 0.08, 0.1, 0.1, C.board));
          t.text(s, it.year, { x: x + 0.06, y: y + 0.26, w: 1.08, h: h - 0.32, fontFace: F.head, bold: true, fontSize: L.fit(it.year, 1.08, h - 0.4, 22, 11, F.head, true), color: C.board, align: 'center', valign: 'middle' });
          head(s, it.h, x + 1.34, y + 0.08, w - 1.46, 0.36, { color: C.board, max: 14 });
          body(s, it.t, x + 1.34, y + 0.46, w - 1.46, h - 0.54, { color: C.board, max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Doska', colors: { dk1: C.board, lt1: C.chalk, dk2: C.wood, lt2: C.dust, accent1: C.yellow, accent2: C.pink, accent3: C.blue, accent4: C.wood, accent5: C.dust, accent6: C.tape, hlink: C.yellow, folHlink: C.dust } });
}
/** Uslub pasporti */
const STYLE = { tone: "o'qituvchi tushuntirgandek: sodda, aniq, misollar bilan; qisqa ta'riflar", limits: {}, prefer: 'text' };
module.exports = { id: 33, slug: 'doska', name: 'Doska', category: 'academic', photos: true, build, style: STYLE };
