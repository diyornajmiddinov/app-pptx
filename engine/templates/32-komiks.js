/**
 * 32 Komiks — comic book page: thick black panel borders, halftone dots, speech bubbles
 * for ideas, "POW" bursts for numbers, yellow caption boxes.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'FFF6DF', ink: '111111', red: 'E63946', yellow: 'FFD60A', blue: '1D70B8', white: 'FFFFFF', gray: '444444' };
const F = { head: 'Arial', body: 'Arial' };

const halftone = (w, h, color, corner = 'tr') => {
  let c = ''; const step = 22;
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
    const dx = corner.includes('r') ? (w - x) / w : x / w, dy = corner.includes('t') ? y / h : (h - y) / h;
    const r = Math.max(0, 9 * (1 - Math.hypot(dx, dy) / 1.1));
    if (r > 0.6) c += `<circle cx="${x + (Math.floor(y / step) % 2 ? step / 2 : 0)}" cy="${y}" r="${r.toFixed(1)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="#${color}">${c}</g></svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const dotsR = await L.svg(halftone(700, 450, C.red, 'tr'), 700, 450), dotsB = await L.svg(halftone(700, 450, C.blue, 'bl'), 700, 450);
  let idx = 0;
  const panel = (s, x, y, w, h, fill = C.white) => t.rect(s, x, y, w, h, fill, { line: { color: C.ink, width: 3 }, name: 'Panel' });
  const caption = (s, text, x, y, w, fs = 13, fill = C.yellow) => {
    const h = L.height(text, fs, w - 0.3, F.head, true) + 0.2;
    t.rect(s, x, y, w, h, fill, { line: { color: C.ink, width: 2 }, name: 'Caption' });
    t.text(s, text, { x: x + 0.15, y, w: w - 0.3, h, fontSize: fs, bold: true, color: C.ink, valign: 'middle' });
    return h;
  };
  const bubble = (s, x, y, w, h, kind = 'OVAL_CALLOUT', fill = C.white) => s.addShape(t.S[kind], { x, y, w, h, fill: { color: fill }, line: { color: C.ink, width: 2.5 }, objectName: 'Speech bubble' });
  const burst = (s, x, y, w, h, fill) => s.addShape(t.S.EXPLOSION1, { x, y, w, h, fill: { color: fill }, line: { color: C.ink, width: 2.5 }, objectName: 'Burst' });
  const photoPanel = async (s, img, x, y, w, h) => { panel(s, x, y, w, h); t.img(s, await L.photo(L.src(img), w - 0.1, h - 0.1), x + 0.05, y + 0.05, w - 0.1, h - 0.1, { alt: '' }); };
  const footer = (s) => t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.45, y: 5.28, w: 9.1, h: 0.22, fontSize: 8, bold: true, color: C.gray });
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    t.img(s, dotsR, 6.5, 0, 3.5, 2.25);
    if (d.title) {
      const tw = Math.min(8.2, L.width(d.title, 24, F.head, true) + 0.5);
      t.rect(s, 0.45, 0.35, tw, 0.65, C.yellow, { line: { color: C.ink, width: 2.5 }, name: 'Title caption' });
      t.text(s, d.title, { x: 0.65, y: 0.35, w: tw - 0.3, h: 0.65, fontSize: L.fit(d.title, tw - 0.3, 0.6, 24, 14, F.head, true), bold: true, color: C.ink, valign: 'middle' });
    }
    t.oval(s, 9.0, 0.38, 0.55, 0.55, C.white, { line: { color: C.ink, width: 2.5 } });
    t.text(s, String(idx), { x: 9.0, y: 0.38, w: 0.55, h: 0.55, fontSize: 14, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    footer(s);
    return s;
  };

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    t.img(s, dotsB, 0, 2.9, 4.4, 2.75);
    panel(s, 0.45, 0.4, 4.7, 4.75, kind === 'cover' ? C.red : C.blue);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join('  \u2605  '), { x: 0.7, y: 0.6, w: 4.2, h: 0.3, fontSize: 12, bold: true, color: C.yellow });
    const fs = L.fit(d.title.toUpperCase(), 4.2, 2.4, 40, 20, F.head, true);
    t.text(s, d.title.toUpperCase(), { x: 0.7, y: 1.0, w: 4.2, h: 2.5, fontSize: fs, bold: true, color: C.white, valign: 'bottom' });
    if (d.subtitle) caption(s, d.subtitle, 0.7, 3.7, 4.2, 12);
    if (d.image) await photoPanel(s, d.image, 5.4, 0.4, 4.15, 3.25);
    else panel(s, 5.4, 0.4, 4.15, 3.25, C.yellow);
    bubble(s, 5.4, 3.95, 3.1, 1.1, 'ROUNDED_RECTANGULAR_CALLOUT');
    t.text(s, M.author || '', { x: 5.55, y: 4.0, w: 2.8, h: 0.75, fontSize: 15, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    burst(s, 8.35, 3.75, 1.3, 1.25, C.yellow);
    t.text(s, kind === 'cover' ? (M.year || '!') : 'END', { x: 8.35, y: 3.75, w: 1.3, h: 1.25, fontSize: 14, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    footer(s);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) {
      const s = page(d);
      await photoPanel(s, d.image, 0.45, 1.3, 4.3, 3.75);
      bubble(s, 5.0, 1.3, 4.55, 3.3, 'OVAL_CALLOUT');
      t.text(s, d.text, { x: 5.6, y: 1.75, w: 3.35, h: 2.4, fontSize: L.fit(d.text, 3.35, 2.4, 14, 9, F.body, false, 1.15), color: C.ink, align: 'center', valign: 'middle', lineSpacingMultiple: 1.15 });
    },
    async image(d) {
      const s = page(d);
      panel(s, 0.45, 1.3, 4.3, 3.75, C.white);
      t.text(s, d.text, { x: 0.7, y: 1.5, w: 3.8, h: 3.35, fontSize: L.fit(d.text, 3.8, 3.35, 15, 11, F.body, false, 1.2), color: C.ink, lineSpacingMultiple: 1.2, valign: 'middle' });
      await photoPanel(s, d.image, 5.0, 1.3, 4.55, 3.75);
    },
    async agenda(d) {
      const s = page(d), cols = 3, rws = Math.ceil(d.items.length / cols), w = (9.1 - 0.2 * (cols - 1)) / cols, h = (3.75 - 0.2 * (rws - 1)) / rws;
      d.items.forEach((it, i) => {
        const x = 0.45 + (i % cols) * (w + 0.2), y = 1.3 + Math.floor(i / cols) * (h + 0.2);
        panel(s, x, y, w, h, i % 2 ? C.white : 'FFF0C2');
        burst(s, x - 0.1, y - 0.15, 0.8, 0.75, [C.red, C.blue, C.yellow][i % 3]);
        t.text(s, String(i + 1), { x: x - 0.1, y: y - 0.15, w: 0.8, h: 0.75, fontSize: 14, bold: true, color: i % 3 === 2 ? C.ink : C.white, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.7, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, cols = n === 4 ? 2 : 3, rws = Math.ceil(n / cols);
      const w = (9.1 - 0.3 * (cols - 1)) / cols, h = (3.8 - 0.25 * (rws - 1)) / rws;
      for (const [i, it] of d.items.entries()) {
        const x = 0.45 + (i % cols) * (w + 0.3), y = 1.25 + Math.floor(i / cols) * (h + 0.25);
        bubble(s, x, y, w, h * 0.92, i % 2 ? 'ROUNDED_RECTANGULAR_CALLOUT' : 'OVAL_CALLOUT', i % 3 === 1 ? 'DCEBFA' : C.white);
        const pad = n === 4 ? 0.45 : 0.4;
        t.text(s, it.h.toUpperCase(), { x: x + pad, y: y + 0.18, w: w - 2 * pad, h: 0.4, fontSize: L.fit(it.h.toUpperCase(), w - 2 * pad, 0.4, 15, 10, F.head, true), bold: true, color: C.red, align: 'center' });
        t.text(s, it.t, { x: x + pad, y: y + 0.58, w: w - 2 * pad, h: h * 0.92 - 0.85, fontSize: L.fit(it.t, w - 2 * pad, h * 0.92 - 0.85, 14, 9, F.body), color: C.ink, align: 'center', valign: 'middle' });
      }
    },
    async process(d) {
      const s = page(d), n = d.steps.length, w = (9.1 - 0.15 * (n - 1)) / n;
      d.steps.forEach((st, i) => {
        const x = 0.45 + i * (w + 0.15);
        panel(s, x, 1.3, w, 3.75, i % 2 ? 'FFF0C2' : C.white);
        const ch = caption(s, `${i + 1}. ${st.h}`, x, 1.3, w, L.fit(`${i + 1}. ${st.h}`, w - 0.3, 0.75, 14, 10, F.head, true));
        t.text(s, st.t, { x: x + 0.2, y: 1.45 + ch, w: w - 0.4, h: 3.5 - ch - 0.2, fontSize: L.fit(st.t, w - 0.4, 3.0 - ch, 15, 11, F.body), color: C.ink, valign: 'middle', align: 'center' });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 9.1 / n;
      d.stats.forEach((x, i) => {
        const px = 0.45 + i * cw;
        burst(s, px + 0.1, 1.25, cw - 0.2, 2.2, [C.yellow, C.red, C.blue][i % 3]);
        t.text(s, x.value, { x: px + 0.6, y: 1.65, w: cw - 1.2, h: 1.4, fontSize: L.fit(x.value, cw - 1.5, 0.9, 40, 18, F.head, true), bold: true, color: i % 3 ? C.white : C.ink, align: 'center', valign: 'middle' });
        caption(s, x.label, px + 0.2, 3.6, cw - 0.4, 12, C.white);
      });
      if (d.note) t.text(s, d.note, { x: 0.45, y: 4.8, w: 9.1, h: 0.4, fontSize: 10, italic: true, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 4.4;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 14, w - 0.7, F.body) : 0))) + 0.18);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.45 + i * (w + 0.3);
        panel(s, x, 1.3, w, 3.75, i ? 'DCEBFA' : 'FDE2E4');
        const ch = caption(s, side.h.toUpperCase(), x, 1.3, w, 14);
        let y = 1.45 + ch;
        side.items.forEach((it, k) => { t.text(s, i ? '\u2714' : '\u2716', { x: x + 0.2, y, w: 0.3, h: 0.3, fontSize: 13, bold: true, color: i ? C.blue : C.red }); t.text(s, it, { x: x + 0.55, y, w: w - 0.7, h: rows[k], fontSize: 14, color: C.ink }); y += rows[k]; });
      });
      burst(s, 4.55, 4.35, 0.9, 0.8, C.yellow);
      t.text(s, 'VS', { x: 4.55, y: 4.35, w: 0.9, h: 0.8, fontSize: 18, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    },
    async statement(d) {
      const s = page(d);
      bubble(s, 0.7, 1.3, 8.6, 2.6, 'OVAL_CALLOUT');
      t.text(s, L.runs(d.text), { x: 1.6, y: 1.6, w: 6.8, h: 1.9, fontSize: L.fit(d.text, 6.8, 1.8, 32, 16, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) caption(s, d.caption, 1.5, 4.15, 7.0, L.fit(d.caption, 6.7, 0.8, 12, 9, F.head, true));
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, w = (9.1 - 0.15 * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const x = 0.45 + i * (w + 0.15);
        panel(s, x, 1.3, w, 3.75, C.white);
        burst(s, x + 0.15, 1.35, w - 0.3, 1.2, [C.yellow, C.red, C.blue, C.yellow][i % 4]);
        t.text(s, it.year, { x: x + 0.4, y: 1.5, w: w - 0.8, h: 0.9, fontSize: L.fit(it.year, w - 1.0, 0.5, 20, 11, F.head, true), bold: true, color: i % 4 === 1 || i % 4 === 2 ? C.white : C.ink, align: 'center', valign: 'middle' });
        t.text(s, it.h, { x: x + 0.15, y: 2.7, w: w - 0.3, h: 0.42, fontSize: 15, bold: true, color: C.ink, align: 'center' });
        t.text(s, it.t, { x: x + 0.15, y: 3.15, w: w - 0.3, h: 1.8, fontSize: L.fit(it.t, w - 0.3, 1.8, 13, 10, F.body), color: C.gray, align: 'center' });
      });
    },
    async quote(d) {
      const s = page({});
      bubble(s, 0.8, 0.9, 8.4, 3.1, 'CLOUD_CALLOUT');
      t.text(s, d.text, { x: 1.9, y: 1.4, w: 6.2, h: 2.1, fontSize: L.fit(d.text, 6.2, 2.0, 28, 14, F.head, true), bold: true, italic: true, color: C.ink, align: 'center', valign: 'middle' });
      if (d.author) caption(s, d.author, 5.6, 4.3, 3.9, 13);
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.58, 3.7 / n);
      panel(s, 0.45, 1.25, 9.1, rh * n + 0.2);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.text(s, `#${i + 1}`, { x: 0.65, y, w: 0.6, h: rh, fontSize: 13, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.3, y, w: 8.1, h: rh, fontSize: L.fit(it, 8.1, rh - 0.04, 14, 10, F.body), color: C.ink, valign: 'middle' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Komiks', colors: { dk1: C.ink, lt1: C.white, dk2: '333333', lt2: C.paper, accent1: C.red, accent2: C.yellow, accent3: C.blue, accent4: 'FDE2E4', accent5: C.gray, accent6: 'DCEBFA', hlink: C.blue, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "jonli va qiziqarli: qisqa, dialogga o'xshash iboralar, undov va savollarni me'yorida ishlat", limits: { card_t3: 80, card_t4: 65, stmt: 60, quote: 110 }, prefer: 'visual' };
module.exports = { id: 32, slug: 'komiks', name: 'Komiks', category: 'creative', photos: true, build, style: STYLE };
