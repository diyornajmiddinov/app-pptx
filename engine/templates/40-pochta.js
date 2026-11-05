/**
 * 40 Pochta — vintage mail: airmail-striped postcards, photos as perforated postage stamps
 * with postmarks, typewriter addresses, postmark dates for the timeline.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'EFE7D8', card: 'FFFDF7', ink: '2E2A26', red: 'C0392B', blue: '1F4E8C', gray: '7A7368', line: 'D9CFBE' };
const F = { head: 'Cambria', body: 'Calibri', type: 'Courier New' };

const airmail = (w, h, band = 22) => { // striped border
  let st = ''; for (let x = -h; x < w + h; x += 60) st += `<polygon points="${x},0 ${x + 30},0 ${x + 30 - h},${h} ${x - h},${h}" fill="#${(x / 60) % 2 === 0 ? C.red : C.blue}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><clipPath id="c"><path fill-rule="evenodd" d="M0,0 H${w} V${h} H0 Z M${band},${band} V${h - band} H${w - band} V${band} Z"/></clipPath></defs><g clip-path="url(#c)"><rect width="${w}" height="${h}" fill="#fff"/>${st}</g></svg>`;
};
const postmark = (w, text1, text2) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w * 2.2}" height="${w}"><g fill="none" stroke="#${C.gray}" stroke-width="4" opacity="0.8">
  <circle cx="${w / 2}" cy="${w / 2}" r="${w / 2 - 4}"/><circle cx="${w / 2}" cy="${w / 2}" r="${w / 2 - 16}"/>
  ${[0, 1, 2, 3].map((k) => `<path d="M${w},${w * 0.3 + k * w * 0.13} q${w * 0.15},-14 ${w * 0.3},0 t${w * 0.3},0 t${w * 0.3},0 t${w * 0.3},0"/>`).join('')}</g>
  <g fill="#${C.gray}" font-family="Courier New" font-weight="bold" text-anchor="middle" opacity="0.85"><text x="${w / 2}" y="${w / 2 - 4}" font-size="${w * 0.17}">${text1}</text><text x="${w / 2}" y="${w / 2 + w * 0.2}" font-size="${w * 0.15}">${text2}</text></g></svg>`;

async function build(content, out) {
  const pres = L.deck({ head: F.head, body: F.body }, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const esc = (s) => String(s || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  const memo = {}; const svgImg = async (k, svg, w, h) => (memo[k] ??= await L.svg(svg, w, h));
  const postcard = async (s, x, y, w, h) => { t.rect(s, x, y, w, h, C.card, { shadow: 0.2, blur: 8, offset: 3, name: 'Postcard' }); t.img(s, await svgImg(`a${w}${h}`, airmail(Math.round(w * 100), Math.round(h * 100), 14), w * 100, h * 100), x, y, w, h); };
  // postage stamp: white paper with perforations (paper-coloured dots on the edge)
  const stamp = async (s, src, x, y, w, h, bg = C.paper, mark) => {
    t.rect(s, x, y, w, h, 'FFFFFF', { shadow: 0.18, blur: 4, offset: 2, name: 'Stamp' });
    const d = 0.12, nx = Math.floor(w / 0.2), ny = Math.floor(h / 0.2);
    for (let i = 0; i <= nx; i++) { const cx = x + (i * w) / nx; t.oval(s, cx - d / 2, y - d / 2, d, d, bg); t.oval(s, cx - d / 2, y + h - d / 2, d, d, bg); }
    for (let j = 1; j < ny; j++) { const cy = y + (j * h) / ny; t.oval(s, x - d / 2, cy - d / 2, d, d, bg); t.oval(s, x + w - d / 2, cy - d / 2, d, d, bg); }
    if (src) t.img(s, await L.photo(L.src(src), w - 0.36, h - 0.36), x + 0.18, y + 0.18, w - 0.36, h - 0.36, { alt: '' });
    if (mark) t.img(s, await svgImg(`pm${mark.join()}`, postmark(260, esc(mark[0]), esc(mark[1])), 572, 260), x + w * 0.45, y + h * 0.55, 2.0, 0.91);
  };
  const footer = (s) => t.text(s, `${M.topic || ''}  //  ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontFace: F.type, fontSize: 8.5, color: C.gray });
  let idx = 0;
  const pg = async (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    t.img(s, await L.icon('FiMail', C.red, 2), 0.6, 0.48, 0.42, 0.42);
    if (d.title) t.text(s, d.title, { x: 1.2, y: 0.38, w: 7.2, h: 0.65, fontFace: F.head, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 7.2, 0.65, 28, 16, F.head, true) });
    t.text(s, `No ${L.pad2(idx)}`, { x: 8.4, y: 0.45, w: 1.0, h: 0.5, fontFace: F.type, fontSize: 13, bold: true, color: C.blue, align: 'right', valign: 'middle' });
    t.line(s, 0.6, 1.12, 8.8, 0, C.line, 1, { dash: 'dash' });
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.ink, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    await postcard(s, 0.45, 0.4, 9.1, 4.75);
    t.line(s, 5.25, 0.9, 0, 3.8, C.line, 1.25);
    if (d.image) await stamp(s, d.image, 7.55, 0.85, 1.55, 1.85, C.card, [M.loc || 'POCHTA', M.year || '']);
    t.text(s, kind === 'cover' ? TR.postcard : TR.thanks, { x: 0.85, y: 0.8, w: 4.2, h: 0.3, fontFace: F.type, fontSize: 10, bold: true, color: C.red, charSpacing: 2 });
    const fs = L.fit(d.title, 4.1, 2.1, 36, 20, F.head, true);
    t.text(s, d.title, { x: 0.85, y: 1.15, w: 4.1, h: 2.2, fontFace: F.head, bold: true, fontSize: fs, color: C.ink, valign: 'bottom' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.85, y: 3.5, w: 4.1, h: 1.0, fontFace: F.head, italic: true, fontSize: 13, color: C.gray });
    const lines = [M.author, M.org, [M.loc, M.year].filter(Boolean).join(', ')].filter(Boolean);
    lines.forEach((ln, k) => { t.text(s, ln, { x: 5.6, y: 3.0 + k * 0.48, w: 3.6, h: 0.4, fontFace: F.type, fontSize: 13, bold: k === 0, color: C.blue, valign: 'bottom' }); t.line(s, 5.6, 3.42 + k * 0.48, 3.6, 0, C.line, 1); });
    footer(s);
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = await pg(d); await stamp(s, d.image, 0.75, 1.5, 3.6, 3.2, C.paper, [M.loc || '', M.year || '']); para(s, d.text, 4.85, 1.45, 4.55, 3.5); },
    async image(d) { const s = await pg(d); para(s, d.text, 0.6, 1.45, 4.3, 3.5); await stamp(s, d.image, 5.45, 1.5, 3.8, 3.2); },
    async agenda(d) {
      const s = await pg(d); await postcard(s, 0.6, 1.35, 8.8, 3.7);
      const rh = Math.min(0.5, 3.0 / d.items.length);
      d.items.forEach((it, i) => {
        const y = 1.75 + i * rh;
        t.text(s, `${L.pad2(i + 1)}.`, { x: 1.0, y, w: 0.6, h: rh, fontFace: F.type, fontSize: 14, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.65, y, w: 7.3, h: rh, fontFace: F.type, fontSize: 15, color: C.blue, valign: 'middle' });
        t.line(s, 1.65, y + rh - 0.04, 7.3, 0, C.line, 0.75);
      });
    },
    async cards(d) {
      const s = await pg(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.45, 1.55 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.6, F.body))) + 0.45);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap);
        await postcard(s, x, 1.45, w, h);
        t.rect(s, x + w - 0.75, 1.68, 0.5, 0.6, [C.red, C.blue][i % 2], { name: 'Mini stamp' });
        t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + w - 0.64, 1.82, 0.28, 0.28);
        t.text(s, it.h, { x: x + 0.3, y: 2.4, w: w - 0.6, h: 0.42, fontFace: F.head, fontSize: L.fit(it.h, w - 0.6, 0.42, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, it.t, { x: x + 0.3, y: 2.85, w: w - 0.6, h: h - 1.6, fontSize: 14, color: C.gray });
      }
    },
    async process(d) {
      const s = await pg(d), n = d.steps.length, cw = 8.8 / n;
      t.line(s, 0.6 + 0.3, 1.85, cw * (n - 1), 0, C.blue, 2, { dash: 'dash' });
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        t.oval(s, x, 1.55, 0.6, 0.6, C.card, { line: { color: C.blue, width: 2 } });
        t.img(s, await L.icon(i === n - 1 ? 'FiMapPin' : 'FiSend', C.blue, 2), x + 0.15, 1.7, 0.3, 0.3);
        t.text(s, `${i + 1}. ${st.h}`, { x, y: 2.4, w: cw - 0.3, h: 0.5, fontFace: F.head, fontSize: L.fit(`${i + 1}. ${st.h}`, cw - 0.3, 0.5, 16, 11, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.3, h: 1.95, fontSize: L.fit(st.t, cw - 0.3, 1.95, 14, 10, F.body), color: C.gray });
      }
    },
    async stats(d) {
      const s = await pg(d), n = d.stats.length, cw = 8.8 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * cw, w = Math.min(2.0, cw - 0.5);
        await stamp(s, null, px + (cw - w) / 2 - 0.15, 1.5, w, 1.7);
        t.rect(s, px + (cw - w) / 2 + 0.03, 1.68, w - 0.36, 1.34, [C.red, C.blue, 'C79A2E'][i % 3], { name: 'Stamp face' });
        t.text(s, x.value, { x: px + (cw - w) / 2 + 0.03, y: 1.68, w: w - 0.36, h: 1.34, fontFace: F.head, fontSize: L.fit(x.value, w - 0.5, 0.8, 36, 16, F.head, true), bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.4, w: cw - 0.3, h: 0.9, fontSize: 14, color: C.ink, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.5, w: 8.8, h: 0.45, fontFace: F.type, fontSize: 10, color: C.gray });
    },
    async compare(d) {
      const s = await pg(d), w = 4.25;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.8, F.body, 0.18, 4.85 - 2.25);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = 0.6 + i * (w + 0.3);
        await postcard(s, x, 1.4, w, 3.6);
        t.text(s, side.h, { x: x + 0.35, y: 1.65, w: w - 0.7, h: 0.5, fontFace: F.head, fontSize: 18, bold: true, color: i ? C.blue : C.red });
        let y = 2.25;
        side.items.forEach((it, k) => { t.text(s, '\u2709', { x: x + 0.35, y, w: 0.3, h: 0.3, fontSize: 12, color: i ? C.blue : C.red }); t.text(s, it, { x: x + 0.7, y, w: w - 1.0, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      }
    },
    async statement(d) {
      const s = await pg(d); await postcard(s, 0.9, 1.4, 8.2, 3.5);
      t.text(s, L.runs(d.text), { x: 1.4, y: 1.7, w: 7.2, h: 1.7, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 7.2, 1.6, 32, 18, F.head, true, 1, true), bold: true, color: C.ink, align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: 1.5, y: 3.5, w: 7.0, h: 1.15, fontSize: L.fit(d.caption, 7.0, 1.15, 14, 10, F.body), color: C.gray, align: 'center' });
    },
    async timeline(d) {
      const s = await pg(d), n = d.items.length, cw = 8.8 / n;
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * cw, dd = Math.min(1.3, cw - 0.4);
        t.oval(s, x, 1.35, dd, dd, null, { line: { color: [C.red, C.blue][i % 2], width: 2.5 } });
        t.oval(s, x + 0.1, 1.45, dd - 0.2, dd - 0.2, null, { line: { color: [C.red, C.blue][i % 2], width: 1 } });
        t.text(s, it.year, { x, y: 1.35, w: dd, h: dd, fontFace: F.type, fontSize: L.fit(it.year, dd - 0.3, 0.5, 20, 10, F.type, true), bold: true, color: [C.red, C.blue][i % 2], align: 'center', valign: 'middle', rotate: -12 });
        t.text(s, it.h, { x, y: 2.85, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.ink });
        t.text(s, it.t, { x, y: 3.3, w: cw - 0.3, h: 1.65, fontSize: 14, color: C.gray });
      }
    },
    async quote(d) {
      const s = await pg({}); await postcard(s, 0.9, 0.9, 8.2, 3.9);
      t.text(s, d.text, { x: 1.4, y: 1.3, w: 7.2, h: 2.3, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 7.2, 2.2, 30, 16, F.head, false, 1, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 1.4, y: 3.8, w: 7.2, h: 0.45, fontFace: F.type, fontSize: 13, bold: true, color: C.blue, align: 'right' });
    },
    async sources(d) {
      const s = await pg(d), n = d.items.length, rh = Math.min(0.56, 3.6 / n);
      d.items.forEach((it, i) => {
        const y = 1.35 + i * rh;
        t.text(s, `[${i + 1}]`, { x: 0.6, y, w: 0.55, h: rh, fontFace: F.type, fontSize: 13, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: 1.2, y, w: 8.2, h: rh, fontFace: F.type, fontSize: L.fit(it, 8.2, rh - 0.04, 12, 9, F.type), color: C.ink, valign: 'middle' });
      });
    },
  };
  // ---- further ways to draw a type, from the post office counter: a deck's pages must not look alike (L.pages)
  const X0 = 0.6, FW = 8.8, Y1 = 5.12, RB = [C.red, C.blue];
  const head = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.head, bold: true, fontSize: L.fit(v, w, h, o.max || 15, 10.5, F.head, true), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const body = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 14, 10, F.body), color: o.color || C.ink, align: o.align, valign: o.valign || 'top' });
  const typed = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontFace: F.type, bold: o.bold, fontSize: L.fit(v, w, h, o.max || 13, 9.5, F.type, !!o.bold), color: o.color || C.ink, align: o.align, valign: o.valign || 'middle' });
  const lines = (s, txt, x, y, w, h, color = C.ink) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 15, 10.5, F.body, false, 1.25), color, lineSpacingMultiple: 1.25, valign: 'middle' });
  const wave = (w, h, color, n = 5, sw = 4) => { let p = ''; for (let k = 0; k < n; k++) { const y = (h * (k + 1)) / (n + 1); p += `<path d="M0,${y} q${w / 16},-14 ${w / 8},0 t${w / 8},0 t${w / 8},0 t${w / 8},0 t${w / 8},0 t${w / 8},0 t${w / 8},0 t${w / 8},0" fill="none" stroke="#${color}" stroke-width="${sw}" opacity="0.8"/>`; } return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${p}</svg>`; };
  const flap = (w, h, color) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><polyline points="0,0 ${w / 2},${h} ${w},0" fill="none" stroke="#${color}" stroke-width="2.5"/></svg>`;
  const envelope = async (s, x, y, w, h, fill = C.card, stroke = C.line) => { t.rect(s, x, y, w, h, fill, { shadow: 0.18, blur: 6, offset: 2, line: { color: stroke, width: 0.75 }, name: 'Envelope' }); t.img(s, await svgImg(`fl${w}${h}${stroke}`, flap(Math.round(w * 100), Math.round(h * 45), stroke), w * 100, h * 45), x, y, w, h * 0.45); };
  const faceStamp = async (s, x, y, w, h, col, bg = C.paper) => { await stamp(s, null, x, y, w, h, bg); t.rect(s, x + 0.12, y + 0.12, w - 0.24, h - 0.24, col, { name: 'Stamp face' }); };
  const V = {
    image: [
      async (d) => { // a picture postcard: airmail edge, the view across the top, the message below
        const s = await pg(d), x = X0, y = 1.24, w = FW, h = 3.9;
        await postcard(s, x, y, w, h);
        t.img(s, await L.photo(L.src(d.image), w - 0.5, 1.85), x + 0.25, y + 0.25, w - 0.5, 1.85, { alt: d.title });
        lines(s, d.text, x + 0.3, y + 2.16, w - 0.6, h - 2.36);
      },
      async (d) => { // the back of the card: message left, a divide, the big stamp cancelled right
        const s = await pg(d), x = X0, y = 1.24, w = FW, h = 3.9;
        await postcard(s, x, y, w, h);
        t.line(s, 5.65, y + 0.3, 0, h - 0.6, C.line, 1.25);
        lines(s, d.text, x + 0.3, y + 0.25, 4.5, h - 0.5);
        await stamp(s, d.image, 6.0, y + 0.42, 3.05, 2.75, C.card);
        t.img(s, await svgImg('pmark', postmark(260, esc(M.loc || ''), esc(M.year || '')), 572, 260), 6.2, y + 2.72, 2.4, 1.09);
      },
      async (d) => { // the picture is the whole page, a card leans on it, the page's foot is plain paper
        const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
        t.img(s, await L.photo(L.src(d.image), W, 5.14), 0, 0, W, 5.14, { alt: d.title });
        await postcard(s, 0.4, 0.42, 5.3, 4.34);
        head(s, d.title, 0.72, 0.68, 3.75, 0.72, { max: 18 });
        t.text(s, `No ${L.pad2(idx)}`, { x: 4.5, y: 0.72, w: 0.9, h: 0.4, fontFace: F.type, fontSize: 12, bold: true, color: C.blue, align: 'right', valign: 'middle' });
        t.line(s, 0.72, 1.44, 4.66, 0, C.line, 1, { dash: 'dash' });
        lines(s, d.text, 0.72, 1.52, 4.66, 3.04);
        footer(s);
      },
      async (d) => { // the picture is the postmark itself: round, ringed, cancelling lines running out
        const s = await pg(d), dia = 3.3, x = X0 + 0.05, y = 1.5;
        t.img(s, await svgImg('wv', wave(420, 260, C.gray), 420, 260), x + dia - 0.45, y + 0.5, 1.7, 2.2);
        t.oval(s, x - 0.14, y - 0.14, dia + 0.28, dia + 0.28, C.paper, { line: { color: C.red, width: 2.5 } });
        t.img(s, await L.photo(L.src(d.image), dia, dia, { mask: 'circle' }), x, y, dia, dia, { alt: d.title });
        t.rect(s, 4.85, 1.32, 4.55, 3.8, C.card, { shadow: 0.2, blur: 8, offset: 3, name: 'Letter' });
        lines(s, d.text, 5.05, 1.42, 4.15, 3.6);
      },
    ],
    cards: [
      async (d) => { // a pile of envelopes pushed out left and right, a small stamp on the corner of each
        const s = await pg(d), n = d.items.length, g = 0.1, h = (3.84 - g * (n - 1)) / n, w = 7.4;
        for (const [i, it] of d.items.entries()) {
          const x = i % 2 ? X0 + FW - w : X0, y = 1.28 + i * (h + g), col = RB[i % 2];
          await envelope(s, x, y, w, h);
          await faceStamp(s, x + w - 0.72, y + 0.09, 0.58, Math.min(0.66, h - 0.18), col, C.card);
          t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + w - 0.56, y + 0.09 + Math.min(0.66, h - 0.18) / 2 - 0.13, 0.26, 0.26);
          t.rect(s, x + 0.12, y + 0.06, w - 1.0, h - 0.12, C.card, { t: 15, name: 'Letter' });
          head(s, it.h, x + 0.22, y + 0.08, w - 1.2, 0.3, { max: 14 });
          body(s, it.t, x + 0.22, y + 0.38, w - 1.2, h - 0.44, { max: 13 });
        }
      },
      async (d) => { // a stamp album: each page's stamp mounted, a note in ink beside it
        const s = await pg(d), n = d.items.length, g = 0.18, w = (FW - g) / 2, h = 1.84;
        const spots = n === 3 ? [[X0, 1.3, w], [X0 + w + g, 1.3, w], [X0, 1.3 + h + 0.12, FW]] : [0, 1, 2, 3].map((i) => [X0 + (i % 2) * (w + g), 1.3 + (i >> 1) * (h + 0.12), w]);
        for (const [i, it] of d.items.entries()) {
          const [x, y, ww] = spots[i], col = [C.red, C.blue, 'C79A2E', C.ink][i];
          t.rect(s, x, y, ww, h, C.card, { line: { color: C.line, width: 1 }, name: 'Album page' });
          await faceStamp(s, x + 0.16, y + 0.2, 0.98, 1.2, col, C.card);
          t.img(s, await L.icon(it.icon, 'FFFFFF', 2), x + 0.46, y + 0.61, 0.38, 0.38);
          head(s, it.h, x + 1.3, y + 0.1, ww - 1.42, 0.46, { max: 14 });
          body(s, it.t, x + 1.3, y + 0.58, ww - 1.42, h - 0.66, { max: 13 });
        }
      },
      async (d) => { // the mail bag tipped out: blue page, letters tumbling at two heights
        const s = pres.addSlide(); s.background = { color: C.blue }; idx++;
        t.img(s, await L.icon('FiMail', C.card, 2), 0.6, 0.48, 0.42, 0.42);
        if (d.title) head(s, d.title, 1.2, 0.38, 7.2, 0.65, { color: C.card, max: 24 });
        t.text(s, `No ${L.pad2(idx)}`, { x: 8.4, y: 0.45, w: 1.0, h: 0.5, fontFace: F.type, fontSize: 13, bold: true, color: C.card, align: 'right', valign: 'middle' });
        const n = d.items.length, g = 0.14, w = (FW - g * (n - 1)) / n, h = 3.56;
        for (const [i, it] of d.items.entries()) {
          const x = X0 + i * (w + g), y = 1.22 + (i % 2 ? 0.3 : 0);
          t.rect(s, x, y, w, h, C.card, { rotate: i % 2 ? 0.8 : -0.8, shadow: 0.3, blur: 8, offset: 3, name: 'Letter' });
          t.img(s, await L.icon(it.icon, RB[i % 2], 2), x + 0.16, y + 0.16, 0.34, 0.34);
          head(s, it.h, x + 0.16, y + 0.56, w - 0.32, 0.52, { valign: 'top', max: 14 });
          body(s, it.t, x + 0.16, y + 1.1, w - 0.32, h - 1.2, { max: 13.5 });
        }
        t.text(s, `${M.topic || ''}  //  ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontFace: F.type, fontSize: 8.5, color: C.card });
      },
      async (d) => { // the special delivery: one large registered letter, the others in the tray
        const s = await pg(d), [a, ...rest] = d.items, g = 0.12, h = (3.82 - g * (rest.length - 1)) / rest.length;
        await postcard(s, X0, 1.28, 4.5, 3.82);
        await faceStamp(s, X0 + 3.3, 1.5, 0.95, 1.1, C.red, C.card);
        t.img(s, await L.icon(a.icon, 'FFFFFF', 2), X0 + 3.59, 1.87, 0.37, 0.37);
        head(s, a.h, X0 + 0.32, 1.5, 2.85, 1.1, { max: 19 });
        body(s, a.t, X0 + 0.32, 2.72, 3.86, 2.14, { max: 16 });
        for (const [i, it] of rest.entries()) {
          const y = 1.28 + i * (h + g);
          t.rect(s, 5.25, y, 4.15, h, C.card, { line: { color: C.line, width: 1 }, name: 'Letter' });
          t.img(s, await L.icon(it.icon, RB[i % 2], 2), 5.38, y + 0.12, 0.28, 0.28);
          head(s, it.h, 5.74, y + 0.08, 3.54, 0.36, { max: 14 });
          body(s, it.t, 5.38, y + 0.46, 3.9, h - 0.54, { max: 13 });
        }
      },
    ],
    process: [
      async (d) => { // the flight path: cards hop up and down the page, an arrow from each to the next
        const s = await pg(d), n = d.steps.length, g = 0.18, w = (FW - g * (n - 1)) / n, h = 2.86, ys = [1.26, 2.26];
        for (const [i, st] of d.steps.entries()) {
          const x = X0 + i * (w + g), y = ys[i % 2];
          t.rect(s, x, y, w, h, C.card, { shadow: 0.2, blur: 6, offset: 2, name: 'Card' });
          t.rect(s, x, y, w, 0.12, RB[i % 2], { name: 'Airmail edge' });
          t.oval(s, x + 0.14, y + 0.22, 0.46, 0.46, RB[i % 2]);
          t.img(s, await L.icon(i === n - 1 ? 'FiMapPin' : 'FiSend', 'FFFFFF', 2), x + 0.26, y + 0.34, 0.22, 0.22);
          head(s, `${i + 1}. ${st.h}`, x + 0.66, y + 0.18, w - 0.76, 0.54, { max: 13 });
          body(s, st.t, x + 0.14, y + 0.76, w - 0.28, h - 0.84, { max: 13 });
          if (i < n - 1) t.text(s, '→', { x: x + w - 0.1, y: i % 2 ? 2.5 : 3.6, w: g + 0.2, h: 0.4, fontSize: 18, bold: true, color: C.blue, align: 'center', valign: 'middle', noFit: true });
        }
      },
      async (d) => { // a dashed route down the page, letters sent out left and right from it
        const s = await pg(d), n = d.steps.length, y0 = 1.26, h = 3.86 / n, cx = 5, B = 0.5;
        t.line(s, cx, y0 + h / 2, 0, h * (n - 1), C.blue, 2, { dash: 'dash' });
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * h, left = i % 2 === 0, x = left ? X0 : 5.45, w = 3.95, al = left ? 'right' : 'left';
          t.oval(s, cx - B / 2, y + h / 2 - B / 2, B, B, C.card, { line: { color: C.blue, width: 2 } });
          t.img(s, await L.icon(i === n - 1 ? 'FiMapPin' : 'FiSend', C.blue, 2), cx - 0.13, y + h / 2 - 0.13, 0.26, 0.26);
          head(s, `${i + 1}. ${st.h}`, x, y + 0.03, w, 0.3, { align: al, max: 14 });
          body(s, st.t, x, y + 0.33, w, h - 0.37, { align: al, max: 13 });
        }
      },
      async (d) => { // envelopes slipping down a chute, each stamped with its number
        const s = await pg(d), n = d.steps.length, g = 0.1, h = (3.84 - g * (n - 1)) / n, w = n === 3 ? 7.0 : 6.7, dx = (FW - w) / (n - 1);
        for (const [i, st] of d.steps.entries()) {
          const x = X0 + i * dx, y = 1.28 + i * (h + g), sw = 0.62, sh = Math.min(0.72, h - 0.16);
          t.rect(s, x, y, w, h, C.card, { shadow: 0.2, blur: 6, offset: 2, line: { color: C.line, width: 0.75 }, name: 'Envelope' });
          await faceStamp(s, x + 0.12, y + (h - sh) / 2, sw, sh, RB[i % 2], C.card);
          t.text(s, String(i + 1), { x: x + 0.12, y: y + (h - sh) / 2, w: sw, h: sh, fontFace: F.head, bold: true, fontSize: 16, color: 'FFFFFF', align: 'center', valign: 'middle' });
          head(s, st.h, x + 0.9, y + 0.05, w - 1.02, 0.3, { max: 14 });
          body(s, st.t, x + 0.9, y + 0.35, w - 1.02, h - 0.4, { max: 13 });
        }
      },
    ],
    stats: [
      async (d) => { // the high value: one great stamp cancelled, two ordinary ones on the same cover
        const s = await pg(d), [a, ...rest] = d.stats;
        await faceStamp(s, X0 + 0.05, 1.34, 3.4, 2.5, C.red);
        t.text(s, a.value, { x: X0 + 0.25, y: 1.5, w: 3.0, h: 1.4, fontFace: F.head, bold: true, fontSize: L.fit(a.value, 3.0, 1.3, 54, 24, F.head, true), color: 'FFFFFF', align: 'center', valign: 'middle' });
        t.text(s, a.label, { x: X0 + 0.25, y: 2.9, w: 3.0, h: 0.78, fontSize: L.fit(a.label, 3.0, 0.76, 13, 10, F.body), color: 'FFFFFF', align: 'center', valign: 'top' });
        for (const [i, q] of rest.entries()) {
          const y = 1.34 + i * 1.28, c = i ? 'C79A2E' : C.blue;
          await faceStamp(s, 4.35, y, 1.72, 1.14, c);
          t.text(s, q.value, { x: 4.47, y, w: 1.48, h: 1.14, fontFace: F.head, bold: true, fontSize: L.fit(q.value, 1.42, 0.8, 26, 14, F.head, true), color: i ? C.ink : 'FFFFFF', align: 'center', valign: 'middle' });
          body(s, q.label, 6.25, y + 0.04, 3.15, 1.06, { max: 13.5, valign: 'middle' });
        }
        if (d.note) typed(s, d.note, X0, 3.98, FW, 1.14, { max: 12 });
      },
      async (d) => { // the counter receipt: typed figures on a form, ruled, dotted to the column
        const s = await pg(d), x = X0, y = 1.28, w = FW, h = 2.74, rh = 0.84;
        t.rect(s, x, y, w, h, C.card, { shadow: 0.2, blur: 6, offset: 2, name: 'Form' });
        t.rect(s, x, y, w, 0.12, C.red, { name: 'Form head' });
        d.stats.forEach((q, i) => {
          const yy = y + 0.2 + i * rh;
          typed(s, `${L.pad2(i + 1)}.`, x + 0.2, yy, 0.5, rh - 0.05, { color: C.red, bold: true, max: 13 });
          t.text(s, q.value, { x: x + 0.75, y: yy, w: 2.7, h: rh - 0.05, fontFace: F.type, bold: true, fontSize: L.fit(q.value, 2.7, rh - 0.15, 28, 16, F.type, true), color: C.blue, valign: 'middle' });
          body(s, q.label, x + 3.6, yy + 0.03, w - 3.8, rh - 0.11, { max: 15, valign: 'middle' });
          if (i < 2) t.line(s, x + 0.2, yy + rh - 0.02, w - 0.4, 0, C.line, 1, { dash: 'dash' });
        });
        if (d.note) typed(s, d.note, x, 4.1, w, 1.02, { max: 12 });
      },
    ],
    compare: [
      async (d) => { // one card, its centre line the divide: two messages, mirrored
        const s = await pg(d), w = 3.78, y0 = 1.9, avail = 3.0, fit = L.rowsFit([d.left.items, d.right.items], 14.5, w, F.body, 0.1, avail), extra = (avail - fit.rows.reduce((a, b) => a + b, 0)) / fit.rows.length;
        await postcard(s, X0, 1.24, FW, 3.88);
        t.line(s, 5, 1.46, 0, 3.44, C.gray, 1.5);
        [d.left, d.right].forEach((side, i) => {
          const x = i ? 5.2 : 1.02, al = i ? 'left' : 'right', col = RB[i];
          head(s, side.h, x, 1.4, w, 0.46, { color: col, align: al, max: 17 });
          let y = y0;
          fit.rows.forEach((rh0, k) => {
            const rh = rh0 + extra;
            if (side.items[k]) { t.text(s, side.items[k], { x, y, w, h: rh, fontSize: fit.fs, color: C.ink, align: al, valign: 'middle' }); if (k < fit.rows.length - 1) t.line(s, x, y + rh, w, 0, C.line, 0.75); }
            y += rh;
          });
        });
      },
      async (d) => { // two telegram strips pasted on the form, a coloured head to each
        const s = await pg(d), bh = 1.86, g = 0.12;
        [d.left, d.right].forEach((side, i) => {
          const y = 1.28 + i * (bh + g), n = side.items.length, x0 = 3.0, cw = (9.3 - x0) / n, col = RB[i];
          t.rect(s, X0, y, FW, bh, C.card, { shadow: 0.18, blur: 5, offset: 2, name: 'Telegram' });
          t.rect(s, X0, y, 2.26, bh, col, { name: 'Telegram head' });
          typed(s, side.h.toUpperCase(), X0 + 0.14, y + 0.1, 1.98, bh - 0.2, { color: 'FFFFFF', bold: true, max: 14 });
          side.items.forEach((it, k) => {
            if (k) t.line(s, x0 + k * cw - 0.07, y + 0.18, 0, bh - 0.36, C.line, 1, { dash: 'dash' });
            body(s, it, x0 + k * cw, y + 0.1, cw - 0.14, bh - 0.2, { valign: 'middle', max: 13.5 });
          });
        });
      },
    ],
    statement: [
      async (d) => { // the urgent telegram: typed capitals on strip after strip, a red head above
        const s = await pg(d), x = X0, y = 1.26, w = d.caption ? 5.9 : FW, h = 3.86, T = d.text.toUpperCase();
        t.rect(s, x, y, w, h, C.card, { shadow: 0.2, blur: 8, offset: 3, name: 'Telegram' });
        t.rect(s, x, y, w, 0.22, C.red, { name: 'Telegram head' });
        t.text(s, L.runs(T), { x: x + 0.3, y: y + 0.34, w: w - 0.6, h: h - 0.5, fontFace: F.type, bold: true, fontSize: L.fit(T, w - 0.6, h - 0.55, 26, 13, F.type, true), color: C.ink, valign: 'middle' });
        if (d.caption) { t.line(s, 6.75, y + 0.2, 0, h - 0.4, C.line, 1.25, { dash: 'dash' }); body(s, d.caption, 6.95, y + 0.1, 2.45, h - 0.2, { max: 14, valign: 'middle' }); }
      },
      async (d) => { // a cancelled page: deep blue, cancelling waves and pale words over them
        const s = pres.addSlide(); s.background = { color: C.blue }; idx++;
        t.img(s, await svgImg('wvN', wave(1000, 460, 'FFFFFF', 7, 3), 1000, 460), 0, 0.6, W, 4.6);
        t.rect(s, 0, 0, W, 1.12, C.blue, { name: 'Head ground' });
        t.img(s, await L.icon('FiMail', C.card, 2), 0.6, 0.48, 0.42, 0.42);
        if (d.title) head(s, d.title, 1.2, 0.38, 7.2, 0.65, { color: C.card, max: 24 });
        t.text(s, `No ${L.pad2(idx)}`, { x: 8.4, y: 0.45, w: 1.0, h: 0.5, fontFace: F.type, fontSize: 13, bold: true, color: C.card, align: 'right', valign: 'middle' });
        t.rect(s, X0, 1.3, 5.9, 3.74, C.blue, { t: 12, name: 'Ground' });
        t.text(s, L.runs(d.text), { x: X0 + 0.15, y: 1.36, w: 5.6, h: 3.62, fontFace: F.head, italic: true, bold: true, fontSize: L.fit(d.text, 5.6, 3.55, 32, 18, F.head, true, 1, true), color: C.card, valign: 'middle' });
        if (d.caption) { t.rect(s, 6.72, 1.3, 2.68, 3.74, C.card, { name: 'Note' }); body(s, d.caption, 6.86, 1.38, 2.4, 3.58, { max: 14, valign: 'middle' }); }
        t.text(s, `${M.topic || ''}  //  ${meta}`, { x: 0.6, y: 5.22, w: 8.8, h: 0.25, fontFace: F.type, fontSize: 8.5, color: C.card });
      },
    ],
    timeline: [
      async (d) => { // a route of postmarks: round dates along the dashed line, notes up and down
        const s = await pg(d), ly = 3.17, w = 3.95, xs = [X0, 1.2, 5.0, 5.45], px = [0.6, 3.6, 5.0, 8.2], D = 1.1;
        t.line(s, X0, ly, FW, 0, C.blue, 2, { dash: 'dash' });
        d.items.forEach((it, i) => {
          const up = i % 2 === 0, x = xs[i], col = RB[i % 2], cx = px[i], y = up ? 1.26 : ly + 0.6, h = up ? ly - 0.58 - y : Y1 - y;
          t.oval(s, cx, ly - D / 2, D, D, C.paper, { line: { color: col, width: 2.25 } });
          t.oval(s, cx + 0.07, ly - D / 2 + 0.07, D - 0.14, D - 0.14, null, { line: { color: col, width: 0.75 } });
          t.text(s, it.year, { x: cx + 0.1, y: ly - 0.3, w: D - 0.2, h: 0.6, fontFace: F.type, bold: true, fontSize: L.fit(it.year, D - 0.24, 0.56, 13, 9.5, F.type, true), color: col, align: 'center', valign: 'middle' });
          head(s, it.h, x, y, w, 0.3, { max: 14, align: up ? 'left' : 'right' });
          body(s, it.t, x, y + 0.3, w, h - 0.3, { max: 13, align: up ? 'left' : 'right' });
        });
      },
      async (d) => { // the register book: a rubber date stamp in red at the head of each line
        const s = await pg(d), h = 3.84 / 4, x = X0;
        t.rect(s, x, 1.28, FW, 3.84, C.card, { line: { color: C.line, width: 1 }, name: 'Register' });
        t.line(s, x + 2.0, 1.28, 0, 3.84, C.red, 1);
        d.items.forEach((it, i) => {
          const y = 1.28 + i * h;
          if (i) t.line(s, x, y, FW, 0, C.line, 1);
          t.rect(s, x + 0.16, y + h / 2 - 0.26, 1.68, 0.52, null, { line: { color: C.red, width: 2 }, rotate: i % 2 ? 2 : -2, name: 'Date stamp' });
          t.text(s, it.year, { x: x + 0.2, y: y + h / 2 - 0.26, w: 1.6, h: 0.52, fontFace: F.type, bold: true, fontSize: L.fit(it.year, 1.56, 0.46, 15, 10, F.type, true), color: C.red, align: 'center', valign: 'middle' });
          head(s, it.h, x + 2.15, y + 0.05, FW - 2.3, 0.3, { max: 14 });
          body(s, it.t, x + 2.15, y + 0.35, FW - 2.3, h - 0.4, { max: 13 });
        });
      },
    ],
  };
  R.image = V.image.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await draw(d); }
  return L.save(pres, out, { name: 'SlideAI Pochta', colors: { dk1: C.ink, lt1: C.card, dk2: '4A433C', lt2: C.paper, accent1: C.red, accent2: C.blue, accent3: 'C79A2E', accent4: C.gray, accent5: C.line, accent6: 'B8AE9C', hlink: C.blue, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "maktubdek samimiy, lekin aniq: tinglovchiga murojaat qilgandek, qisqa xabarlar", limits: {}, prefer: null };
module.exports = { id: 40, slug: 'pochta', name: 'Poçta', category: 'creative', photos: true, build, style: STYLE };
