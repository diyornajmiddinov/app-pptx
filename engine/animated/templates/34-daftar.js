/**
 * 34 Daftar — student notebook: ruled paper with red margin and spiral holes, highlighter
 * titles, sticky notes, paper-clipped photos, red-pen circles and checkboxes.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'FFFEF8', rule: 'CFE0F2', margin: 'E88B8B', ink: '22324A', pen: '1E4FA0', red: 'D64545', high: 'FFF176', gray: '7B8794', notes: ['FFE680', 'FFC2CF', 'BDF2D3', 'C6E4FF'] };
const F = { head: 'Calibri', body: 'Calibri' };

const paperSvg = () => {
  let l = ''; for (let y = 140; y < 900; y += 44) l += `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`;
  let holes = ''; for (let y = 60; y < 900; y += 95) holes += `<circle cx="42" cy="${y}" r="13" fill="#E9E6DD"/><circle cx="42" cy="${y}" r="13" fill="none" stroke="#C9C3B5" stroke-width="2"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#${C.paper}"/><g stroke="#${C.rule}" stroke-width="2">${l}</g><line x1="150" y1="0" x2="150" y2="900" stroke="#${C.margin}" stroke-width="3"/>${holes}</svg>`;
};
const penRing = (w, h, color) => { let d = ''; for (let i = 0; i <= 44; i++) { const a = (i / 40) * 2 * Math.PI - 0.6; d += (i ? ' L' : 'M') + `${(w / 2 + (w / 2 - 6) * Math.cos(a) * (1 + 0.03 * Math.sin(i))).toFixed(1)},${(h / 2 + (h / 2 - 6) * Math.sin(a)).toFixed(1)}`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="none" stroke="#${color}" stroke-width="4" stroke-linecap="round"/></svg>`; };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(paperSvg(), 1600, 900, true);
  const memo = {}; const ring = async (s, x, y, w, h, color = C.red) => t.img(s, await (memo[`${w}${h}${color}`] ??= L.svg(penRing(Math.round(w * 100), Math.round(h * 100), color), w * 100, h * 100)), x, y, w, h);
  const X0 = 1.25; // right of the red margin
  const note = (s, x, y, w, h, color, rot) => t.rect(s, x, y, w, h, color, { rotate: rot, shadow: 0.2, blur: 6, offset: 3, name: 'Sticky note' });
  const clipped = async (s, src, x, y, w, h, rot = -2) => {
    t.rect(s, x, y, w, h, 'FFFFFF', { rotate: rot, shadow: 0.2, blur: 6, offset: 2, name: 'Photo' });
    s.addImage({ data: await L.photo(L.src(src), w - 0.2, h - 0.2), x: x + 0.1, y: y + 0.1, w: w - 0.2, h: h - 0.2, rotate: rot, altText: '' });
    t.img(s, await L.icon('FiPaperclip', C.gray, 2), x + 0.25, y - 0.3, 0.5, 0.75);
  };
  const footer = (s) => t.text(s, `${M.topic || ''}   |   ${meta}`, { x: X0, y: 5.25, w: 8.2, h: 0.22, fontSize: 8, italic: true, color: C.gray });
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.title) {
      const fs = L.fit(d.title, 7.4, 0.6, 28, 16, F.head, true), tw = Math.min(7.6, L.width(d.title, fs, F.head, true) + 0.3);
      t.rect(s, X0 - 0.1, 0.5, tw, 0.5, C.high, { t: 15, name: 'Highlighter' });
      t.text(s, d.title, { x: X0, y: 0.38, w: 7.6, h: 0.65, fontSize: fs, bold: true, color: C.ink, valign: 'middle' });
    }
    t.text(s, `${idx}`, { x: 8.9, y: 0.35, w: 0.55, h: 0.5, fontSize: 15, color: C.pen, align: 'center', valign: 'middle' });
    footer(s);
    return s;
  };
  const pen = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.pen, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.image) await clipped(s, d.image, 6.2, 0.75, 3.2, 2.6, 3);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: X0, y: 0.55, w: 4.6, h: 0.3, fontSize: 13, color: C.gray });
    const fs = L.fit(d.title, 4.6, 2.3, 40, 22, F.head, true), tw = 4.6;
    t.text(s, d.title, { x: X0, y: 0.95, w: tw, h: 2.4, fontSize: fs, bold: true, color: C.ink, valign: 'bottom' });
    t.rect(s, X0 - 0.1, 3.42, 3.2, 0.12, C.high, { name: 'Highlighter' });
    if (d.subtitle) t.text(s, d.subtitle, { x: X0, y: 3.7, w: 4.6, h: 0.8, fontSize: 14, color: C.pen });
    note(s, 6.6, 3.75, 2.6, 0.95, C.notes[kind === 'cover' ? 0 : 1], -3);
    t.text(s, M.author || '', { x: 6.6, y: 3.75, w: 2.6, h: 0.95, fontSize: 16, bold: true, color: C.ink, align: 'center', valign: 'middle', rotate: -3 });
    footer(s);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = page(d); await clipped(s, d.image, X0, 1.5, 3.7, 3.0, -2); pen(s, d.text, 5.35, 1.35, 4.05, 3.6); },
    async image(d) { const s = page(d); pen(s, d.text, X0, 1.35, 4.0, 3.6); await clipped(s, d.image, 5.65, 1.5, 3.75, 3.0, 2); },
    async agenda(d) {
      const s = page(d), rh = Math.min(0.6, 3.7 / d.items.length);
      d.items.forEach((it, i) => {
        const y = 1.3 + i * rh;
        t.rect(s, X0, y + (rh - 0.28) / 2, 0.28, 0.28, null, { line: { color: C.pen, width: 1.5 }, name: 'Checkbox' });
        t.text(s, it, { x: X0 + 0.5, y, w: 7.5, h: rh, fontSize: 18, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.35, w = (8.15 - gap * (n - 1)) / n;
      const h = Math.min(3.3, 1.35 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.35);
      for (const [i, it] of d.items.entries()) {
        const x = X0 + i * (w + gap), rot = [-2, 1.5, -1, 2][i % 4], y = 1.5 + (i % 2) * 0.1;
        note(s, x, y, w, h, C.notes[i % 4], rot);
        t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.2, y + 0.2, 0.36, 0.36);
        t.text(s, it.h, { x: x + 0.2, y: y + 0.65, w: w - 0.4, h: 0.42, fontSize: L.fit(it.h, w - 0.4, 0.42, 17, 12, F.head, true), bold: true, color: C.ink, rotate: rot });
        t.text(s, it.t, { x: x + 0.2, y: y + 1.1, w: w - 0.4, h: h - 1.25, fontSize: L.fit(it.t, w - 0.4, h - 1.25, 14, 10, F.body), color: C.ink, rotate: rot });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, rh = 3.7 / n;
      for (const [i, st] of d.steps.entries()) {
        const y = 1.3 + i * rh;
        await ring(s, X0 - 0.05, y, 0.55, 0.5, C.pen);
        t.text(s, String(i + 1), { x: X0 - 0.05, y, w: 0.55, h: 0.5, fontSize: 16, bold: true, color: C.pen, align: 'center', valign: 'middle' });
        t.text(s, st.h, { x: X0 + 0.7, y, w: 2.6, h: 0.5, fontSize: L.fit(st.h, 2.6, 0.5, 17, 12, F.head, true), bold: true, color: C.ink, valign: 'middle' });
        t.text(s, st.t, { x: X0 + 3.4, y: y - 0.1, w: 4.8, h: 0.7, fontSize: L.fit(st.t, 4.8, 0.68, 15, 11, F.body), color: C.pen, valign: 'middle' });
      }
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.15 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = X0 + i * cw;
        await ring(s, px, 1.4, cw - 0.4, 1.4, C.red);
        t.text(s, x.value, { x: px + 0.2, y: 1.45, w: cw - 0.8, h: 1.3, fontSize: L.fit(x.value, cw - 1.0, 0.9, 44, 20, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.0, w: cw - 0.3, h: 1.0, fontSize: 15, color: C.pen, align: 'center' });
      }
      if (d.note) t.text(s, `* ${d.note}`, { x: X0, y: 4.45, w: 8.0, h: 0.5, fontSize: 11, italic: true, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 3.9;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.45, F.body, 0.2, 4.85 - 2.0);
      [d.left, d.right].forEach((side, i) => {
        const x = X0 + i * (w + 0.35);
        t.text(s, side.h, { x, y: 1.3, w, h: 0.5, fontSize: 20, bold: true, color: i ? C.pen : C.red });
        t.line(s, x, 1.82, Math.min(w, L.width(side.h, 20, F.head, true) + 0.1), 0, i ? C.pen : C.red, 2);
        let y = 2.0;
        side.items.forEach((it, k) => { t.text(s, i ? '+' : '\u2212', { x, y, w: 0.35, h: 0.3, fontSize: 17, bold: true, color: i ? C.pen : C.red }); t.text(s, it, { x: x + 0.4, y, w: w - 0.45, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      const fs = L.fit(d.text, 7.8, 1.6, 32, 20, F.head, true), lines = L.lines(d.text, fs, 7.8, F.head, true), lh = L.lh(fs, 1, F.head);
      for (let k = 0; k < lines; k++) t.rect(s, X0 - 0.05, 1.55 + k * lh + lh * 0.25, 7.9, lh * 0.65, C.high, { name: 'Highlighter' });
      t.text(s, L.runs(d.text), { x: X0, y: 1.55, w: 7.8, h: lines * lh + 0.1, fontSize: fs, bold: true, color: C.ink });
      if (d.caption) pen(s, d.caption, X0, 1.85 + lines * lh, 7.8, 1.3);
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.7 / n;
      d.items.forEach((it, i) => {
        const y = 1.3 + i * rh;
        t.text(s, it.year, { x: 0.25, y: y - 0.0, w: 0.85, h: 0.4, valign: 'middle', fontSize: L.fit(it.year, 0.85, 0.4, 16, 9, F.head, true), bold: true, color: C.red, align: 'right' });
        t.text(s, it.h, { x: X0, y, w: 2.4, h: 0.4, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
        t.text(s, it.t, { x: X0 + 2.5, y: y - 0.1, w: 5.7, h: 0.6, fontSize: L.fit(it.t, 5.7, 0.58, 15, 11, F.body), color: C.pen, valign: 'middle' });
      });
    },
    async quote(d) {
      const s = page({});
      note(s, 2.0, 0.9, 6.2, 3.4, C.notes[0], -2);
      t.text(s, d.text, { x: 2.4, y: 1.2, w: 5.4, h: 2.3, fontSize: L.fit(d.text, 5.4, 2.2, 28, 16, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle', rotate: -2 });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 2.4, y: 3.55, w: 5.4, h: 0.4, fontSize: 14, color: C.pen, align: 'center', rotate: -2 });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.56, 3.6 / n);
      d.items.forEach((it, i) => t.text(s, [{ text: `${i + 1}`, options: { superscript: true, color: C.red, bold: true } }, { text: `  ${it}`, options: { color: C.ink } }],
        { x: X0, y: 1.3 + i * rh, w: 8.2, h: rh, fontSize: L.fit(it, 8.0, rh - 0.04, 15, 10, F.body), valign: 'middle' }));
    },
  };
  // ---- further ways to draw a type, as a student fills a notebook: a deck's pages must not look alike (L.pages)
  const X1 = 9.4, FW = X1 - X0, NOTES = C.notes;
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10.5, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.pen, align: o.align, valign: o.valign || 'top', italic: o.italic });
  const flatNote = (s, x, y, w, h, color, rot = 0) => t.rect(s, x, y, w, h, color, { rotate: rot, shadow: 0.2, blur: 6, offset: 3, name: 'Sticky note' });
  // a box ruled by hand: the corners overshoot and the sides are not quite straight
  const handBox = (w, h, color, sw = 3) => { const W_ = Math.round(w * 100), H_ = Math.round(h * 100), P = 7; return L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W_}" height="${H_}"><path d="M${P - 5},${P + 1} Q${W_ / 2},${P - 3} ${W_ - P + 4},${P} M${W_ - P},${P - 4} Q${W_ - P + 3},${H_ / 2} ${W_ - P - 1},${H_ - P + 4} M${W_ - P + 4},${H_ - P} Q${W_ / 2},${H_ - P + 3} ${P - 4},${H_ - P - 1} M${P},${H_ - P + 4} Q${P - 3},${H_ / 2} ${P + 1},${P - 4}" fill="none" stroke="#${color}" stroke-width="${sw}" stroke-linecap="round"/></svg>`, W_, H_); };
  const box = async (s, x, y, w, h, color = C.pen) => t.img(s, await (memo[`b${w}${h}${color}`] ??= handBox(w, h, color)), x, y, w, h);
  const tick = (s, x, y, size = 0.3, color = C.red) => { t.rect(s, x, y, size, size, C.paper, { line: { color: C.pen, width: 1.5 }, name: 'Checkbox' }); t.text(s, '✓', { x, y: y - 0.04, w: size, h: size, fontSize: size * 50, bold: true, color, align: 'center', valign: 'middle', noFit: true }); };
  const hilite = (s, x, y, w, h, col = C.high) => t.rect(s, x, y, w, h, col, { name: 'Highlighter' });
  const titleAt = (s, d, x, w, h = 0.9) => {
    const fs = L.fit(d.title, w, h, 24, 15, F.head, true), n = L.lines(d.title, fs, w, F.head, true), lh = L.lh(fs, 1, F.head), top = 0.42 + (h - n * lh) / 2;
    for (let k = 0; k < n; k++) hilite(s, x - 0.08, top + k * lh + lh * 0.2, w + 0.1, lh * 0.72);
    t.text(s, d.title, { x, y: 0.42, w, h, fontSize: fs, bold: true, color: C.ink, valign: 'middle' });
  };
  const holes = (s, x, y0 = 0.18, n = 9, step = 0.6, fill = 'E9E6DD') => { for (let k = 0; k < n; k++) t.oval(s, x, y0 + k * step, 0.16, 0.16, fill, { line: { color: 'C9C3B5', width: 0.75 }, name: 'Spiral hole' }); };
  const V = {
    image: [
      async (d) => { // sketched in ballpoint: the picture in pen blue across the foot of the page, notes above
        const s = page(d), y = 3.0, h = 2.16;
        t.img(s, await L.photo(L.src(d.image), FW, h, { duo: [C.pen, C.paper] }), X0, y, FW, h, { alt: d.title });
        await box(s, X0 - 0.06, y - 0.06, FW + 0.12, h + 0.12);
        pen(s, d.text, X0, 1.2, FW, 1.72);
      },
      async (d) => { // the open spread: words on the left page, the right page all picture
        const s = pres.addSlide(); s.background = { data: bg }; idx++;
        t.img(s, await L.photo(L.src(d.image), 4.5, H), 5.5, 0, 4.5, H, { alt: d.title });
        holes(s, 5.42);
        titleAt(s, d, X0, 3.85);
        t.text(s, `${idx}`, { x: 4.75, y: 0.0, w: 0.55, h: 0.4, fontSize: 13, color: C.pen, align: 'right', valign: 'middle' });
        pen(s, d.text, X0, 1.42, 4.0, 3.72);
        t.text(s, `${M.topic || ''}   |   ${meta}`, { x: X0, y: 5.25, w: 4.0, h: 0.22, fontSize: 7, italic: true, color: C.gray });
      },
      async (d) => { // a round cutting ringed in red, the words on a big sticky note beside it
        const s = page(d), dia = 3.1, x = X0 + 0.05, y = 1.55;
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        await ring(s, x - 0.14, y - 0.14, dia + 0.28, dia + 0.28);
        flatNote(s, 4.7, 1.32, 4.7, 3.8, NOTES[0], 0.8);
        t.text(s, d.text, { x: 4.92, y: 1.5, w: 4.26, h: 3.44, fontSize: L.fit(d.text, 4.26, 3.44, 15, 10.5, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      },
      async (d) => { // three cuttings of one picture clipped in a row, the notes below
        const s = page(d), g = 0.14, w = (FW - 2 * g) / 3, h = 1.85, rot = [-1.2, 0.8, -0.6];
        for (const [i, pos] of ['left', 'centre', 'right'].entries()) {
          const x = X0 + i * (w + g), y = 1.32 + (i === 1 ? 0.1 : 0);
          t.rect(s, x, y, w, h, 'FFFFFF', { rotate: rot[i], shadow: 0.2, blur: 6, offset: 2, name: 'Photo' });
          s.addImage({ data: await L.photo(L.src(d.image), w - 0.16, h - 0.16, { position: pos }), x: x + 0.08, y: y + 0.08, w: w - 0.16, h: h - 0.16, rotate: rot[i], altText: i ? '' : d.title });
          t.img(s, await L.icon('FiPaperclip', C.gray, 2), x + 0.2, y - 0.2, 0.36, 0.5);
        }
        pen(s, d.text, X0, 3.42, FW, 1.72);
      },
    ],
    cards: [
      async (d) => { // index cards: a red rule under the heading, a tape of highlighter on the icon
        const s = page(d), n = d.items.length, w = 3.98, h = 1.84, g = 0.19;
        const spots = n === 3 ? [[X0, 1.3, w], [X0 + w + g, 1.3, w], [X0, 1.3 + h + 0.14, FW]] : [0, 1, 2, 3].map((i) => [X0 + (i % 2) * (w + g), 1.3 + (i >> 1) * (h + 0.14), w]);
        for (const [i, it] of d.items.entries()) {
          const [x, y, ww] = spots[i];
          t.rect(s, x, y, ww, h, 'FFFFFF', { shadow: 0.2, blur: 6, offset: 2, line: { color: C.rule, width: 0.75 }, name: 'Index card' });
          t.rect(s, x + 0.12, y + 0.1, 0.42, 0.36, NOTES[i], { name: 'Highlighter' });
          t.img(s, await L.icon(it.icon, C.ink, 2), x + 0.2, y + 0.14, 0.27, 0.27);
          head(s, it.h, x + 0.64, y + 0.08, ww - 0.76, 0.4);
          t.line(s, x, y + 0.52, ww, 0, C.margin, 1.5);
          body(s, it.t, x + 0.14, y + 0.6, ww - 0.28, h - 0.68, { max: 13 });
        }
      },
      async (d) => { // the one worth circling in red; the rest ticked off beside it
        const s = page(d), [a, ...rest] = d.items, h = 3.82 / rest.length;
        await ring(s, X0, 1.3, 4.2, 1.4);
        t.img(s, await L.icon(a.icon, C.red, 2), X0 + 0.42, 1.74, 0.5, 0.5);
        head(s, a.h, X0 + 1.02, 1.5, 2.8, 1.0, { max: 20 });
        body(s, a.t, X0 + 0.08, 2.82, 4.05, 2.3, { max: 17 });
        for (const [i, it] of rest.entries()) {
          const y = 1.3 + i * h;
          tick(s, 5.75, y + 0.04);
          head(s, it.h, 6.17, y, 3.23, 0.38, { max: 14 });
          body(s, it.t, 6.17, y + 0.4, 3.23, h - 0.46, { max: 13 });
        }
      },
      async (d) => { // coloured index tabs sticking out from the page edge, one to a topic
        const s = page(d), n = d.items.length, g = 0.1, h = (3.84 - g * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.28 + i * (h + g);
          t.rect(s, X0, y, 10 - X0, h, NOTES[i], { t: 55, name: 'Divider' });
          t.rect(s, 9.0, y, 1.0, h, NOTES[i], { name: 'Index tab' });
          t.img(s, await L.icon(it.icon, C.ink, 2), 9.32, y + h / 2 - 0.18, 0.36, 0.36);
          head(s, it.h, X0 + 0.14, y + 0.04, 7.45, 0.34);
          body(s, it.t, X0 + 0.14, y + 0.38, 7.45, h - 0.42, { color: C.ink, max: 13.5 });
        }
      },
      async (d) => { // boxes ruled by hand, thrown left and right down the page
        const s = page(d), n = d.items.length, g = 0.06, h = (3.86 - g * (n - 1)) / n, w = 6.25;
        for (const [i, it] of d.items.entries()) {
          const x = i % 2 ? X1 - w : X0, y = 1.27 + i * (h + g), col = [C.pen, C.red, C.pen, C.red][i];
          await box(s, x, y, w, h, col);
          t.img(s, await L.icon(it.icon, col, 2), x + 0.17, y + h / 2 - 0.2, 0.4, 0.4);
          head(s, it.h, x + 0.72, y + 0.07, w - 0.88, 0.3, { max: 14 });
          body(s, it.t, x + 0.72, y + 0.37, w - 0.88, h - 0.44, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // the flow sketched in a lecture: ruled boxes, red arrows between
        const s = page(d), n = d.steps.length, g = 0.38, w = (FW - g * (n - 1)) / n, h = 3.36;
        for (const [i, st] of d.steps.entries()) {
          const x = X0 + i * (w + g), y = 1.3 + (i % 2) * 0.44;
          await box(s, x, y, w, h);
          await ring(s, x + 0.1, y + 0.14, 0.55, 0.52, C.red);
          t.text(s, String(i + 1), { x: x + 0.1, y: y + 0.14, w: 0.55, h: 0.52, fontSize: 15, bold: true, color: C.red, align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.14, y + 0.72, w - 0.28, 0.56, { max: 14 });
          body(s, st.t, x + 0.14, y + 1.32, w - 0.28, h - 1.42, { max: 13.5 });
          if (i < n - 1) t.text(s, '→', { x: x + w, y: 3.1, w: g, h: 0.5, fontSize: 22, bold: true, color: C.red, align: 'center', valign: 'middle', noFit: true });
        }
      },
      async (d) => { // sticky notes slipping down the page, each lower than the last
        const s = page(d), n = d.steps.length, g = 0.1, w = (FW - g * (n - 1)) / n, drop = n === 3 ? 0.5 : 0.34, h = 3.84 - drop * (n - 1);
        d.steps.forEach((st, i) => {
          const x = X0 + i * (w + g), y = 1.28 + i * drop;
          flatNote(s, x, y, w, h, NOTES[i], i % 2 ? 0.6 : -0.6);
          t.text(s, String(i + 1), { x: x + 0.12, y: y + 0.06, w: 0.5, h: 0.6, fontSize: 28, bold: true, color: C.red, valign: 'middle' });
          head(s, st.h, x + 0.6, y + 0.08, w - 0.7, 0.56, { max: 13.5 });
          body(s, st.t, x + 0.14, y + 0.72, w - 0.28, h - 0.8, { color: C.ink, max: 13 });
        });
      },
      async (d) => { // a pen line down the middle, boxes ticked along it, the steps to each side
        const s = page(d), n = d.steps.length, y0 = 1.28, h = 3.84 / n, cx = 5.33, b = 0.32;
        t.line(s, cx, y0 + h / 2, 0, h * (n - 1), C.pen, 2);
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? X0 : 5.68, w = 3.72, al = left ? 'right' : 'left';
          tick(s, cx - b / 2, y + h / 2 - b / 2, b);
          head(s, `${i + 1}. ${st.h}`, x, y + 0.03, w, 0.3, { max: 14, align: al });
          body(s, st.t, x, y + 0.34, w, h - 0.38, { max: 13, align: al });
        });
      },
    ],
    stats: [
      async (d) => { // one figure marked over with a highlighter, two on notes beside it
        const s = page(d), [a, ...rest] = d.stats;
        hilite(s, X0 - 0.05, 2.0, 4.3, 0.62);
        t.text(s, a.value, { x: X0, y: 1.28, w: 4.2, h: 1.38, bold: true, fontSize: L.fit(a.value, 4.2, 1.3, 70, 30, F.head, true), color: C.ink, valign: 'middle' });
        body(s, a.label, X0, 2.74, 4.2, 0.8, { max: 15 });
        if (d.note) body(s, `* ${d.note}`, X0, 3.62, 4.2, 1.5, { max: 12, color: C.ink, italic: true, valign: 'middle' });
        rest.forEach((q, i) => {
          const y = 1.34 + i * 1.92, x = 5.85, w = 3.55, h = 1.76;
          flatNote(s, x, y, w, h, NOTES[i + 1], i ? 1 : -1);
          t.text(s, q.value, { x: x + 0.18, y: y + 0.1, w: w - 0.36, h: 0.8, bold: true, fontSize: L.fit(q.value, w - 0.36, 0.76, 38, 20, F.head, true), color: C.ink, valign: 'middle' });
          body(s, q.label, x + 0.18, y + 0.92, w - 0.36, h - 1.0, { color: C.ink, max: 13 });
        });
      },
      async (d) => { // sums on a patch of squared paper pasted into the page
        const s = page(d), x0 = X0, y0 = 1.28, w = FW, h = 2.68, step = 20; let g = '';
        for (let x = 0; x <= w * 100; x += step) g += `<line x1="${x}" y1="0" x2="${x}" y2="${h * 100}"/>`;
        for (let y = 0; y <= h * 100; y += step) g += `<line x1="0" y1="${y}" x2="${w * 100}" y2="${y}"/>`;
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * 100}" height="${h * 100}"><rect width="100%" height="100%" fill="#FFFFFF"/><g stroke="#${C.rule}" stroke-width="1">${g}</g></svg>`, w * 100, h * 100), x0, y0, w, h);
        d.stats.forEach((q, i) => {
          const y = y0 + 0.06 + i * 0.86;
          t.text(s, q.value, { x: x0 + 0.2, y, w: 3.0, h: 0.8, bold: true, fontSize: L.fit(q.value, 3.0, 0.76, 38, 20, F.head, true), color: C.red, valign: 'middle' });
          body(s, q.label, x0 + 3.4, y + 0.04, w - 3.6, 0.72, { max: 16, valign: 'middle', color: C.ink });
          if (i < 2) t.line(s, x0 + 0.2, y + 0.83, w - 0.4, 0, C.pen, 1.25);
        });
        if (d.note) body(s, `* ${d.note}`, x0, 4.06, w, 1.06, { max: 13, color: C.ink, italic: true, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // the spread's two pages, mirrored about the spiral
        const s = page(d), w = 3.72, y0 = 1.92, avail = 3.2, cols = [d.left, d.right];
        const fit = L.rowsFit([d.left.items, d.right.items], 15, w, F.body, 0.12, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        holes(s, 5.25, 0.18 + 0.6 * 2, 7);
        cols.forEach((side, i) => {
          const x = i ? 5.68 : X0, al = i ? 'left' : 'right', col = i ? NOTES[3] : NOTES[1];
          t.rect(s, x, 1.34, w, 0.48, col, { name: 'Highlighter' });
          head(s, side.h, x + 0.1, 1.34, w - 0.2, 0.48, { max: 17, align: al });
          let y = y0;
          fit.rows.forEach((rh0, k) => {
            const rh = rh0 + extra;
            if (side.items[k]) { t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: i ? C.pen : C.ink, align: al, valign: 'middle' }); if (k < fit.rows.length - 1) t.line(s, x, y + rh, w, 0, i ? C.pen : C.margin, 0.75); }
            y += rh;
          });
        });
      },
      async (d) => { // two strokes of highlighter across the page, the points in columns under each
        const s = page(d), bh = 1.92;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.28 + i * bh, n = side.items.length, cw = FW / n;
          hilite(s, X0 - 0.05, y, FW + 0.1, 0.42, i ? NOTES[2] : NOTES[1]);
          head(s, side.h, X0 + 0.08, y, FW - 0.2, 0.42, { max: 16 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, X0 + k * cw - 0.08, y + 0.52, 0, bh - 0.66, C.pen, 0.75, { dash: 'sysDash' });
            body(s, it, X0 + k * cw, y + 0.48, cw - 0.2, bh - 0.56, { color: C.ink, max: 13.5 });
          });
        });
      },
    ],
    statement: [
      async (d) => { // a big note clipped on the page, the explanation in pen beneath it
        const s = page(d), x = 1.65, y = 1.34, w = 7.3, h = 2.45;
        flatNote(s, x, y, w, h, NOTES[0], -0.7);
        t.img(s, await L.icon('FiPaperclip', C.gray, 2), x + 0.3, y - 0.26, 0.42, 0.62);
        t.text(s, L.runs(d.text), { x: x + 0.4, y: y + 0.2, w: w - 0.8, h: h - 0.4, bold: true, fontSize: L.fit(d.text, w - 0.8, h - 0.45, 28, 15, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
        if (d.caption) t.text(s, d.caption, { x: X0 + 0.2, y: 3.93, w: FW - 0.4, h: 1.18, fontSize: L.fit(d.caption, FW - 0.4, 1.15, 14, 10, F.body), color: C.pen, align: 'center', valign: 'middle' });
      },
      async (d) => { // the notebook shut: its blue cover, a school label holds the sentence
        const s = pres.addSlide(); s.background = { color: C.pen }; idx++;
        for (let k = 0; k < 9; k++) t.oval(s, 0.24, 0.32 + k * 0.6, 0.18, 0.18, C.paper, { name: 'Spiral hole' });
        if (d.title) t.text(s, d.title, { x: X0, y: 0.32, w: 7.5, h: 0.62, bold: true, fontSize: L.fit(d.title, 7.5, 0.6, 24, 15, F.head, true), color: C.paper, valign: 'middle' });
        t.text(s, `${idx}`, { x: 8.9, y: 0.35, w: 0.55, h: 0.5, fontSize: 15, color: C.paper, align: 'center', valign: 'middle' });
        t.rect(s, X0, 1.08, FW, 2.56, C.paper, { line: { color: C.red, width: 2 }, name: 'School label' });
        t.line(s, X0 + 0.1, 1.2, FW - 0.2, 0, C.pen, 1);
        t.line(s, X0 + 0.1, 3.52, FW - 0.2, 0, C.pen, 1);
        t.text(s, L.runs(d.text), { x: X0 + 0.35, y: 1.28, w: FW - 0.7, h: 2.16, bold: true, fontSize: L.fit(d.text, FW - 0.7, 2.1, 30, 15, F.head, true), color: C.ink, align: 'center', valign: 'middle' });
        if (d.caption) t.text(s, d.caption, { x: X0, y: 3.76, w: FW, h: 1.38, fontSize: L.fit(d.caption, FW, 1.35, 15, 10, F.body), color: C.paper, valign: 'middle' });
        t.text(s, `${M.topic || ''}   |   ${meta}`, { x: X0, y: 5.25, w: 8.2, h: 0.22, fontSize: 8, italic: true, color: C.rule });
      },
    ],
    timeline: [
      async (d) => { // a ruled line with ticked boxes, the notes up and down from it
        const s = page(d), ly = 3.2, w = 3.85, xs = [X0, 1.55, 5.15, X1 - w];
        t.line(s, X0, ly, FW, 0, C.pen, 2.5);
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], y = up ? 1.28 : 3.46, h = 1.68;
          flatNote(s, x, y, w, h, NOTES[i], 0);
          const sx = x + [0.45, 1.85, 0.35, 2.15][i];
          t.line(s, sx, up ? y + h : ly, 0, up ? ly - y - h : y - ly, C.pen, 1.5);
          tick(s, sx - 0.14, ly - 0.14, 0.28);
          t.text(s, it.year, { x: x + 0.14, y: y + 0.07, w: 1.5, h: 0.38, bold: true, fontSize: L.fit(it.year, 1.5, 0.36, 18, 11, F.head, true), color: C.red, valign: 'middle' });
          head(s, it.h, x + 1.68, y + 0.07, w - 1.8, 0.38, { max: 14, align: 'right' });
          body(s, it.t, x + 0.14, y + 0.48, w - 0.28, h - 0.54, { color: C.ink, max: 13 });
        });
      },
      async (d) => { // a timetable ruled across the page: a row of dates, the entries under them
        const s = page(d), cw = FW / 4, y0 = 1.34, hh = 0.56, h = 3.74;
        t.rect(s, X0, y0, FW, h, 'FFFFFF', { line: { color: C.pen, width: 1.5 }, name: 'Table' });
        t.rect(s, X0, y0, FW, hh, C.pen, { name: 'Table head' });
        d.items.forEach((it, i) => {
          const x = X0 + i * cw;
          if (i) t.line(s, x, y0, 0, h, C.pen, 1);
          t.text(s, it.year, { x: x + 0.08, y: y0, w: cw - 0.16, h: hh, bold: true, fontSize: L.fit(it.year, cw - 0.16, hh - 0.08, 19, 11, F.head, true), color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, it.h, x + 0.12, y0 + hh + 0.08, cw - 0.24, 0.56, { max: 14, valign: 'top' });
          t.line(s, x + 0.12, y0 + hh + 0.66, cw - 0.24, 0, C.margin, 1.25);
          body(s, it.t, x + 0.12, y0 + hh + 0.74, cw - 0.24, h - hh - 0.82, { max: 13.5 });
        });
      },
      async (d) => { // revision notes: each date highlighted in red pen, each entry stepping further in
        const s = page(d), h = 0.95, dx = 0.42, w = 5.55;
        d.items.forEach((it, i) => {
          const x = X0 + i * dx, y = 1.28 + i * h;
          hilite(s, x, y + 0.05, 1.32, 0.42, NOTES[i]);
          t.text(s, it.year, { x: x + 0.05, y: y + 0.05, w: 1.22, h: 0.42, bold: true, fontSize: L.fit(it.year, 1.22, 0.38, 16, 10.5, F.head, true), color: C.red, align: 'center', valign: 'middle' });
          head(s, it.h, x + 1.42, y + 0.02, w, 0.28, { max: 14 });
          body(s, it.t, x + 1.42, y + 0.3, w, h - 0.34, { max: 13 });
          if (i < 3) t.text(s, '↳', { x: x + 0.1, y: y + 0.48, w: 0.4, h: 0.42, fontSize: 18, color: C.red, valign: 'middle', noFit: true });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Daftar', colors: { dk1: C.ink, lt1: C.paper, dk2: C.pen, lt2: 'F3F1EA', accent1: C.pen, accent2: C.red, accent3: 'E6C200', accent4: 'F28CA0', accent5: C.gray, accent6: C.rule, hlink: C.pen, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "talaba konspekti uslubi: qisqa, aniq punktlar, eng muhim fikrlar ajratilgan", limits: { card_t4: 60 }, prefer: 'text' };
module.exports = { id: 34, slug: 'daftar', name: 'Daftar', category: 'academic', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["pull:u", "fade", "wipe:u"], "cover": ["fadeLetters", "fadeWords"], "mark": "appear", "deco": "wipe:r", "sig": {"title": "fadeLetters", "body": "wipeWords", "item": "peekUp", "image": "fade", "number": "fade", "order": "seq", "stagger": 0.2}, "tempo": 1.1, "kenburns": false};
