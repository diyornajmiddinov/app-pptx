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
        t.text(s, it.t, { x: x + 0.2, y: y + 1.1, w: w - 0.4, h: h - 1.25, fontSize: 14, color: C.ink, rotate: rot });
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
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.45, F.body) : 0))) + 0.2);
      [d.left, d.right].forEach((side, i) => {
        const x = X0 + i * (w + 0.35);
        t.text(s, side.h, { x, y: 1.3, w, h: 0.5, fontSize: 20, bold: true, color: i ? C.pen : C.red });
        t.line(s, x, 1.82, Math.min(w, L.width(side.h, 20, F.head, true) + 0.1), 0, i ? C.pen : C.red, 2);
        let y = 2.0;
        side.items.forEach((it, k) => { t.text(s, i ? '+' : '\u2212', { x, y, w: 0.35, h: 0.3, fontSize: 17, bold: true, color: i ? C.pen : C.red }); t.text(s, it, { x: x + 0.4, y, w: w - 0.45, h: rows[k], fontSize: 15, color: C.ink }); y += rows[k]; });
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
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Daftar', colors: { dk1: C.ink, lt1: C.paper, dk2: C.pen, lt2: 'F3F1EA', accent1: C.pen, accent2: C.red, accent3: 'E6C200', accent4: 'F28CA0', accent5: C.gray, accent6: C.rule, hlink: C.pen, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "talaba konspekti uslubi: qisqa, aniq punktlar, eng muhim fikrlar ajratilgan", limits: { card_t4: 60 }, prefer: 'text' };
module.exports = { id: 34, slug: 'daftar', name: 'Daftar', category: 'academic', photos: true, build, style: STYLE };
