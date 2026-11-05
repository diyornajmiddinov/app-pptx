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
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.7, F.body, 0.18, 5.0 - 1.45);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.45 + i * (w + 0.3);
        panel(s, x, 1.3, w, 3.75, i ? 'DCEBFA' : 'FDE2E4');
        const ch = caption(s, side.h.toUpperCase(), x, 1.3, w, 14);
        let y = 1.45 + ch;
        side.items.forEach((it, k) => { t.text(s, i ? '\u2714' : '\u2716', { x: x + 0.2, y, w: 0.3, h: 0.3, fontSize: 13, bold: true, color: i ? C.blue : C.red }); t.text(s, it, { x: x + 0.55, y, w: w - 0.7, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
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
  // ---- further ways to draw a type, panel by panel: a deck's pages must not look alike (L.pages)
  const PINK = 'FDE2E4', SKY = 'DCEBFA', CREAM = 'FFF0C2';
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13.5, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const head = (s, v, x, y, w, h, o = {}) => { const T = v.toUpperCase(); t.text(s, T, { x, y, w, h, bold: true, fontSize: L.fit(T, w, h, o.max || 14, 10.5, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' }); };
  const longText = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body, false, 1.2), color: o.color || C.ink, lineSpacingMultiple: 1.2, valign: o.valign || 'middle', align: o.align });
  const burstNum = (s, v, x, y, w, h, f = C.yellow, fg = C.ink, fs = 15) => { burst(s, x, y, w, h, f); t.text(s, v, { x, y, w, h, bold: true, color: fg, align: 'center', valign: 'middle', fontSize: fs }); };
  const pageNum = (s) => { t.oval(s, 9.0, 0.38, 0.55, 0.55, C.white, { line: { color: C.ink, width: 2.5 } }); t.text(s, String(idx), { x: 9.0, y: 0.38, w: 0.55, h: 0.55, fontSize: 14, bold: true, color: C.ink, align: 'center', valign: 'middle' }); };
  const titleCap = (s, v, x = 0.45, y = 0.35, max = 8.2, fill = C.yellow) => { const tw = Math.min(max, L.width(v, 24, F.head, true) + 0.5); t.rect(s, x, y, tw, 0.65, fill, { line: { color: C.ink, width: 2.5 }, name: 'Title caption' }); t.text(s, v, { x: x + 0.2, y, w: tw - 0.3, h: 0.65, fontSize: L.fit(v, tw - 0.3, 0.6, 24, 14, F.head, true), bold: true, color: C.ink, valign: 'middle' }); };
  // lines rushing out of a point: the comic's way of saying speed
  const rush = (w, h, cx, cy, color, op = 0.3) => { let d = ''; for (let k = 0; k < 44; k++) { const a = (k * 2 * Math.PI) / 44, b = a + 0.035; d += `M${cx + 60 * Math.cos(a)},${cy + 60 * Math.sin(a)} L${cx + 1400 * Math.cos(a)},${cy + 1400 * Math.sin(a)} L${cx + 1400 * Math.cos(b)},${cy + 1400 * Math.sin(b)} Z `; } return L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="#${color}" opacity="${op}"/></svg>`, w, h); };
  // the whole page is one coloured panel, lines rushing across it
  const action = async (d, fill, cx = 500, cy = 260) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    panel(s, 0.25, 0.2, 9.5, 4.98, fill);
    t.img(s, await rush(950, 498, cx, cy, C.white, 0.14), 0.25, 0.2, 9.5, 4.98);
    if (d.title) titleCap(s, d.title);
    pageNum(s);
    footer(s);
    return s;
  };
  const V = {
    image: [
      async (d) => { // the splash page: one great picture, a speech bubble laid on it
        const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
        await photoPanel(s, d.image, 0.25, 0.2, 9.5, 4.98);
        titleCap(s, d.title);
        pageNum(s);
        t.rect(s, 4.1, 1.35, 5.3, 3.5, C.white, { line: { color: C.ink, width: 2.5 }, name: 'Speech bubble' });
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80"><polygon points="100,0 100,70 0,80" fill="#${C.white}" stroke="#${C.ink}" stroke-width="5"/><rect x="92" y="0" width="12" height="62" fill="#${C.white}"/></svg>`, 100, 80), 3.62, 3.7, 0.55, 0.45);
        longText(s, d.text, 4.3, 1.47, 4.9, 3.26, { max: 13 });
        footer(s);
      },
      async (d) => { // the same moment, three panels wide, panels at different heights
        const s = page(d), w = 3.0, g = 0.05, tops = [1.2, 1.28, 1.14], h = 2.05;
        for (const [i, pos] of ['left', 'centre', 'right'].entries()) {
          const x = 0.45 + i * (w + g), y = tops[i];
          panel(s, x, y, w, h);
          t.img(s, await L.photo(L.src(d.image), w - 0.1, h - 0.1, { position: pos }), x + 0.05, y + 0.05, w - 0.1, h - 0.1, { alt: i ? '' : d.title });
        }
        t.rect(s, 0.45, 3.46, 9.1, 1.68, C.yellow, { line: { color: C.ink, width: 2 }, name: 'Caption' });
        longText(s, d.text, 0.65, 3.52, 8.7, 1.56, { max: 13 });
      },
      async (d) => { // panels parted by a slanting gutter, words on one side, picture on the other
        const s = page(d), y = 1.2, h = 3.95;
        t.rect(s, 0.45, y, 9.1, h, C.white, { line: { color: C.ink, width: 3 }, name: 'Panel' });
        t.img(s, await L.photo(L.src(d.image), 9.0, h - 0.1, { mask: { poly: [[0.56, 0], [1, 0], [1, 1], [0.44, 1]] } }), 0.5, y + 0.05, 9.0, h - 0.1, { alt: d.title });
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="385"><polygon points="${0.56 * 900 - 10},0 ${0.56 * 900 + 2},0 ${0.44 * 900 + 2},385 ${0.44 * 900 - 10},385" fill="#${C.ink}"/></svg>`, 900, 385), 0.5, y + 0.05, 9.0, h - 0.1);
        longText(s, d.text, 0.65, y + 0.14, 3.75, h - 0.28, { max: 13 });
      },
      async (d) => { // the blue page: close-up in a round panel, lines rushing out from behind it
        const s = await action(d, C.blue, 240, 290), dia = 3.25, x = 0.75, y = 1.25;
        t.oval(s, x - 0.08, y - 0.08, dia + 0.16, dia + 0.16, C.white, { line: { color: C.ink, width: 3 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        t.rect(s, 4.45, 1.3, 5.0, 3.6, C.yellow, { line: { color: C.ink, width: 2.5 }, name: 'Caption' });
        longText(s, d.text, 4.65, 1.4, 4.6, 3.4, { max: 13.5 });
      },
    ],
    cards: [
      async (d) => { // a page laid out by hand: panels of unequal width, a burst on each corner
        const s = page(d), n = d.items.length, g = 0.14, h = 1.86, a = 5.3, b = 9.1 - a - g, fills = [C.white, SKY, CREAM, PINK];
        const spots = n === 3 ? [[0.45, 1.25, a, h], [0.45 + a + g, 1.25, b, h], [0.45, 1.25 + h + g, 9.1, h]] : [[0.45, 1.25, a, h], [0.45 + a + g, 1.25, b, h], [0.45, 1.25 + h + g, b, h], [0.45 + b + g, 1.25 + h + g, a, h]];
        for (const [i, it] of d.items.entries()) {
          const [x, y, w, hh] = spots[i], f = [C.red, C.blue, C.yellow, C.red][i];
          panel(s, x, y, w, hh, fills[i]);
          burst(s, x + 0.06, y + 0.05, 0.86, 0.8, f);
          t.img(s, await L.icon(it.icon, f === C.yellow ? C.ink : C.white, 2.25), x + 0.35, y + 0.31, 0.28, 0.28);
          head(s, it.h, x + 0.98, y + 0.12, w - 1.13, 0.54);
          body(s, it.t, x + 0.98, y + 0.68, w - 1.13, hh - 0.78, { max: 13 });
        }
      },
      async (d) => { // a strip of narration: a yellow caption, then the panel it belongs to
        const s = page(d), n = d.items.length, g = 0.1, h = (3.85 - g * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const y = 1.24 + i * (h + g);
          panel(s, 2.75, y, 6.8, h, i % 2 ? C.white : SKY);
          t.rect(s, 0.45, y, 2.5, h, C.yellow, { line: { color: C.ink, width: 2.5 }, name: 'Caption' });
          t.img(s, await L.icon(it.icon, C.ink, 2.25), 0.56, y + h / 2 - 0.16, 0.32, 0.32);
          head(s, it.h, 0.96, y + 0.04, 1.9, h - 0.08);
          body(s, it.t, 3.1, y + 0.05, 6.3, h - 0.1, { max: 13.5, valign: 'middle' });
        }
      },
      async (d) => { // the red page: each burst has its panel beneath it, up and down
        const s = await action(d, C.red, 500, 60), n = d.items.length, g = 0.16, w = (8.9 - g * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const x = 0.55 + i * (w + g), y = 1.68 + (i % 2 ? 0.34 : 0), h = 5.04 - y;
          panel(s, x, y, w, h);
          burst(s, x + w / 2 - 0.5, y - 0.56, 1.0, 0.92, C.yellow);
          t.img(s, await L.icon(it.icon, C.ink, 2.25), x + w / 2 - 0.15, y - 0.25, 0.3, 0.3);
          head(s, it.h, x + 0.12, y + 0.36, w - 0.24, 0.5, { align: 'center' });
          body(s, it.t, x + 0.12, y + 0.86, w - 0.24, h - 0.92, { align: 'center', max: 12.5 });
        }
      },
      async (d) => { // the hero gets the big panel, the others watch from the side
        const s = page(d), [a, ...rest] = d.items, h = (3.85 - 0.1 * (rest.length - 1)) / rest.length;
        panel(s, 0.45, 1.24, 4.5, 3.85, C.yellow);
        t.img(s, await L.svg(halftone(450, 385, C.red, 'bl'), 450, 385), 0.48, 1.27, 4.44, 3.79);
        burst(s, 0.55, 1.3, 1.5, 1.3, C.red);
        t.img(s, await L.icon(a.icon, C.white, 2.25), 1.07, 1.72, 0.46, 0.46);
        head(s, a.h, 2.05, 1.45, 2.75, 0.9, { max: 19 });
        t.rect(s, 0.65, 2.68, 4.1, 2.26, C.white, { line: { color: C.ink, width: 2 }, name: 'Speech bubble' });
        body(s, a.t, 0.8, 2.74, 3.8, 2.14, { max: 14, valign: 'middle' });
        for (const [i, it] of rest.entries()) {
          const y = 1.24 + i * (h + 0.1);
          panel(s, 5.1, y, 4.45, h, i % 2 ? CREAM : C.white);
          t.img(s, await L.icon(it.icon, C.blue, 2.25), 5.22, y + 0.1, 0.32, 0.32);
          head(s, it.h, 5.62, y + 0.06, 3.82, 0.4);
          body(s, it.t, 5.25, y + 0.48, 4.2, h - 0.54, { max: 12.5 });
        }
      },
    ],
    process: [
      async (d) => { // read the panels: right, down, back; arrows show the way
        const s = page(d), n = d.steps.length, w = 4.4, h = 1.8, gx = 0.3, gy = 0.22;
        const spot = (i) => (n === 3 && i === 2 ? [0.45, 1.25 + h + gy, 9.1] : [0.45 + (i === 0 || i === 3 ? 0 : w + gx), 1.25 + (i < 2 ? 0 : h + gy), w]);
        d.steps.forEach((st, i) => {
          const [x, y, ww] = spot(i);
          panel(s, x, y, ww, h, i === n - 1 ? CREAM : C.white);
          burstNum(s, String(i + 1), x + 0.05, y + 0.05, 0.9, 0.84, i === n - 1 ? C.red : C.yellow, i === n - 1 ? C.white : C.ink, 16);
          head(s, st.h, x + 1.0, y + 0.1, ww - 1.15, 0.5);
          body(s, st.t, x + 1.0, y + 0.62, ww - 1.15, h - 0.72, { max: 13 });
        });
        const mark = (x, y, a) => { t.oval(s, x - 0.2, y - 0.2, 0.4, 0.4, C.ink); t.text(s, a, { x: x - 0.2, y: y - 0.2, w: 0.4, h: 0.4, fontSize: 14, bold: true, color: C.yellow, align: 'center', valign: 'middle' }); };
        mark(5, 1.25 + h / 2, '→');
        mark(7.2, 1.25 + h + gy / 2, '↓');
        if (n === 4) mark(5, 1.25 + h + gy + h / 2, '←');
      },
      async (d) => { // panels falling down the page, a caption on the head of each
        const s = page(d), n = d.steps.length, g = 0.1, w = (9.1 - g * (n - 1)) / n, drop = n === 3 ? 0.45 : 0.3, h = 3.88 - drop * (n - 1);
        d.steps.forEach((st, i) => {
          const x = 0.45 + i * (w + g), y = 1.22 + i * drop;
          panel(s, x, y, w, h, i % 2 ? SKY : C.white);
          t.rect(s, x, y, w, 0.72, C.yellow, { line: { color: C.ink, width: 2.5 }, name: 'Caption' });
          t.text(s, `${i + 1}`, { x: x + 0.08, y, w: 0.42, h: 0.72, fontSize: 22, bold: true, color: C.red, valign: 'middle' });
          head(s, st.h, x + 0.5, y + 0.04, w - 0.58, 0.64, { max: 12.5 });
          body(s, st.t, x + 0.14, y + 0.82, w - 0.28, h - 0.9, { max: 12.5 });
        });
      },
      async (d) => { // the blue page: a chain of bursts down the middle, bubbles to each side
        const s = await action(d, C.blue, 500, 300), n = d.steps.length, y0 = 1.12, h = 3.98 / n;
        t.rect(s, 4.95, y0 + 0.2, 0.1, h * (n - 1) + 0.1, C.ink, { name: 'Chain' });
        d.steps.forEach((st, i) => {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? 0.55 : 5.6, w = 3.85, hh = h - 0.08;
          t.rect(s, x, y, w, hh, C.white, { line: { color: C.ink, width: 2 }, r: 0.1, name: 'Speech bubble' });
          burstNum(s, String(i + 1), 4.5, y + hh / 2 - 0.42, 1.0, 0.84, C.yellow, C.ink, 15);
          head(s, st.h, x + 0.14, y + 0.03, w - 0.28, 0.32, { max: 13 });
          body(s, st.t, x + 0.14, y + 0.35, w - 0.28, hh - 0.38, { max: 12 });
        });
      },
    ],
    stats: [
      async (d) => { // the red burst: POW, the number; two quiet panels beside it
        const s = page(d), [a, ...rest] = d.stats;
        burst(s, 0.3, 1.0, 5.2, 3.3, C.red);
        t.text(s, a.value, { x: 1.35, y: 2.0, w: 3.1, h: 1.2, bold: true, color: C.white, align: 'center', valign: 'middle', fontSize: L.fit(a.value, 3.1, 1.15, 56, 26, F.head, true) });
        caption(s, a.label, 0.45, 4.38, 4.9, 12, C.yellow);
        rest.forEach((x, i) => {
          const y = 1.25 + i * 1.2;
          panel(s, 5.6, y, 3.95, 1.1, i ? SKY : C.white);
          t.text(s, x.value, { x: 5.72, y, w: 1.95, h: 1.1, bold: true, color: C.blue, valign: 'middle', fontSize: L.fit(x.value, 1.95, 1.0, 30, 16, F.head, true) });
          body(s, x.label, 7.7, y + 0.04, 1.75, 1.02, { max: 11.5, valign: 'middle' });
        });
        if (d.note) body(s, d.note, 5.6, 3.68, 3.95, 1.5, { max: 10.5, valign: 'middle', color: C.gray });
      },
      async (d) => { // three tall panels of dots and colour, the figure across each
        const s = page(d), g = 0.08, widths = [3.6, 2.7, 2.64], fills = [C.yellow, SKY, PINK];
        let x = 0.45;
        for (const [i, q] of d.stats.entries()) {
          const w = widths[i], y = 1.22 + (i === 1 ? 0.14 : 0), h = 3.0 - (i === 1 ? 0.14 : 0);
          panel(s, x, y, w, h, fills[i]);
          t.img(s, i === 1 ? dotsB : dotsR, x + 0.03, y + 0.03, w - 0.06, h - 0.06);
          t.text(s, q.value, { x: x + 0.14, y: y + 0.28, w: w - 0.28, h: 1.2, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(q.value, w - 0.28, 1.15, 50, 22, F.head, true) });
          t.rect(s, x + 0.12, y + h - 1.28, w - 0.24, 1.14, C.white, { line: { color: C.ink, width: 2 }, name: 'Caption' });
          body(s, q.label, x + 0.22, y + h - 1.24, w - 0.44, 1.06, { max: 12.5, valign: 'middle', align: 'center' });
          x += w + g;
        }
        if (d.note) body(s, d.note, 0.45, 4.3, 9.1, 0.88, { max: 11, valign: 'middle', color: C.gray });
      },
    ],
    compare: [
      async (d) => { // parted by lightning: lines run away from the bolt, one colour to a side
        const s = page(d), y = 1.24, h = 3.88, x0 = 0.45, w = 9.1, k = 100;
        t.rect(s, x0, y, w, h, PINK, { line: { color: C.ink, width: 3 }, name: 'Panel' });
        const bolt = [[4.85, 0], [5.25, 0], [4.95, 1.4], [5.3, 1.4], [4.75, 2.5], [5.05, 2.5], [4.8, 3.88]].map(([a, b]) => [(a - x0) * k, b * k]);
        const right = `${bolt.map((p) => p.join(',')).join(' ')} ${w * k},${h * k} ${w * k},0`;
        t.img(s, await L.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * k}" height="${h * k}"><polygon points="${right}" fill="#${SKY}"/><polyline points="${bolt.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#${C.ink}" stroke-width="7"/></svg>`, w * k, h * k), x0, y, w, h);
        t.rect(s, x0, y, w, h, null, { line: { color: C.ink, width: 3 }, name: 'Panel edge' });
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.5 : 0.6, tw = 3.85, align = i ? 'left' : 'right', n = side.items.length, rh = (h - 0.85) / n;
          head(s, side.h, x, y + 0.14, tw, 0.56, { color: i ? C.blue : C.red, align, max: 16 });
          side.items.forEach((it, k2) => body(s, it, x, y + 0.76 + k2 * rh, tw, rh - 0.04, { align, max: 13.5, valign: 'middle' }));
        });
        burstNum(s, 'VS', 4.58, y + 1.55, 0.86, 0.8, C.yellow, C.ink, 13);
      },
      async (d) => { // two strips, one over the other, each opens with a caption
        const s = page(d), bh = 1.88;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.24 + i * (bh + 0.12), n = side.items.length, x0 = 2.75, cw = (9.45 - x0) / n, f = i ? SKY : PINK;
          panel(s, 0.45, y, 9.1, bh, f);
          t.rect(s, 0.45, y, 2.15, bh, i ? C.blue : C.red, { line: { color: C.ink, width: 2.5 }, name: 'Caption' });
          head(s, side.h, 0.58, y + 0.08, 1.9, bh - 0.16, { color: C.white, max: 16 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.05, y + 0.04, 0, bh - 0.08, C.ink, 2);
            body(s, it, x0 + k * cw + 0.03, y + 0.08, cw - 0.16, bh - 0.16, { max: 13, valign: 'middle' });
          });
        });
      },
    ],
    statement: [
      async (d) => { // a burst fills the page, the sentence shouted from it
        const s = page(d);
        burst(s, 0.0, 0.85, W, 3.95, C.yellow);
        t.text(s, L.runs(d.text), { x: 2.5, y: 1.85, w: 5.0, h: 1.85, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(d.text, 5.0, 1.8, 24, 13, F.head, true) });
        if (d.caption) { t.rect(s, 0.45, 4.42, 9.1, 0.8, C.white, { line: { color: C.ink, width: 2 }, name: 'Caption' }); body(s, d.caption, 0.6, 4.44, 8.8, 0.76, { max: 12, valign: 'middle' }); }
      },
      async (d) => { // the red page: white words, the narration box low in the corner
        const s = await action(d, C.red, 120, 420);
        t.text(s, L.runs(d.text), { x: 0.6, y: 1.15, w: 8.8, h: 2.2, bold: true, color: C.white, valign: 'middle', fontSize: L.fit(d.text, 8.8, 2.15, 36, 20, F.head, true) });
        if (d.caption) { t.rect(s, 3.6, 3.5, 5.95, 1.55, C.yellow, { line: { color: C.ink, width: 2.5 }, name: 'Caption' }); body(s, d.caption, 3.76, 3.54, 5.63, 1.47, { max: 13, valign: 'middle' }); }
        t.img(s, await L.svg(halftone(320, 170, C.white, 'bl'), 320, 170), 0.3, 3.5, 3.2, 1.65);
      },
    ],
    timeline: [
      async (d) => { // a thick road of ink, bursts on it for the years, panels up and down from it
        const s = page(d), ly = 3.16, nodes = [1.55, 3.85, 6.15, 8.45];
        t.rect(s, 0, ly - 0.09, W, 0.18, C.ink, { name: 'Road' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = i < 2 ? 0.45 : 5.05, w = 4.5, y = up ? 1.15 : ly + 0.5, h = 1.42;
          panel(s, x, y, w, h, i % 2 ? SKY : C.white);
          burstNum(s, it.year, nodes[i] - 0.85, ly - 0.52, 1.7, 1.04, [C.yellow, C.red, C.yellow, C.red][i], i % 2 ? C.white : C.ink, L.fit(it.year, 0.8, 0.34, 13, 9, F.head, true));
          head(s, it.h, x + 0.14, y + 0.05, w - 0.28, 0.32);
          body(s, it.t, x + 0.14, y + 0.38, w - 0.28, h - 0.44, { max: 12.5 });
        });
      },
      async (d) => { // the blue page: a yellow caption for each year, the event in a white strip
        const s = await action(d, C.blue, 40, 40), h = 0.9;
        d.items.forEach((it, i) => {
          const y = 1.14 + i * (h + 0.07), x = 0.5 + i * 0.13;
          t.rect(s, x, y, 1.6, h, C.yellow, { line: { color: C.ink, width: 2.5 }, name: 'Caption' });
          t.text(s, it.year, { x: x + 0.05, y, w: 1.5, h, bold: true, color: C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.42, h - 0.2, 20, 11, F.head, true) });
          t.rect(s, x + 1.6, y, 9.5 - x - 1.6, h, C.white, { line: { color: C.ink, width: 2.5 }, name: 'Strip' });
          head(s, it.h, x + 1.72, y + 0.04, 1.75, h - 0.08, { max: 12.5 });
          body(s, it.t, x + 3.5, y + 0.04, 9.4 - x - 3.5, h - 0.08, { max: 12, valign: 'middle' });
        });
      },
      async (d) => { // four panels with a caption stuck over the corner, the right column lower
        const s = page(d), w = 4.42, h = 1.7;
        d.items.forEach((it, i) => {
          const x = 0.45 + (i % 2) * (w + 0.26), y = 1.42 + Math.floor(i / 2) * (h + 0.16) + (i % 2 ? 0.08 : 0);
          panel(s, x, y, w, h, [C.white, CREAM, SKY, C.white][i]);
          const tw = 1.4;
          t.rect(s, x - 0.06, y - 0.2, tw, 0.42, i % 2 ? C.red : C.yellow, { line: { color: C.ink, width: 2 }, name: 'Caption' });
          t.text(s, it.year, { x: x - 0.04, y: y - 0.2, w: tw - 0.04, h: 0.42, bold: true, color: i % 2 ? C.white : C.ink, align: 'center', valign: 'middle', fontSize: L.fit(it.year, tw - 0.12, 0.38, 15, 10, F.head, true) });
          head(s, it.h, x + tw + 0.04, y + 0.03, w - tw - 0.14, 0.26, { max: 12.5 });
          body(s, it.t, x + 0.15, y + 0.32, w - 0.3, h - 0.38, { max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  R.timeline = V.timeline.shift(); // the old one read as the process page
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Komiks', colors: { dk1: C.ink, lt1: C.white, dk2: '333333', lt2: C.paper, accent1: C.red, accent2: C.yellow, accent3: C.blue, accent4: 'FDE2E4', accent5: C.gray, accent6: 'DCEBFA', hlink: C.blue, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "jonli va qiziqarli: qisqa, dialogga o'xshash iboralar, undov va savollarni me'yorida ishlat", limits: { card_t3: 80, card_t4: 65, stmt: 60, quote: 110 }, prefer: 'visual' };
module.exports = { id: 32, slug: 'komiks', name: 'Komiks', category: 'creative', photos: true, build, style: STYLE };
