/**
 * 106 Maktub — a formal letter: letterhead, place-and-date line, subject line, and ideas written as PROSE
 * paragraphs with run-in bold headings. No boxes, no icons — a page you read, signed at the end.
 */
const { kit, L, rowsFit } = require('../free.js');
const C = { paper: 'FFFDF7', ink: '22201C', muted: '6A645A', accent: '1F3A68', rule: 'C9C2B4' };
const F = { head: 'Cambria', body: 'Cambria' };
const scribble = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><path d="M10,55 C40,10 60,70 85,35 S120,10 135,50 S170,65 185,30 S230,20 250,45 L290,40" fill="none" stroke="#1F3A68" stroke-width="3" stroke-linecap="round"/></svg>`;
async function build(content, out) {
  const k = kit(content, F, C), { t } = k, X = 1.0, W = 8.0;
  const letterhead = (s) => { k.txt(s, (k.M.org || k.M.topic || '').toUpperCase(), 1.0, 0.25, 8.0, 0.3, { size: 11, bold: true, spacing: 3, align: 'center', color: C.accent }); t.line(s, 1.0, 0.6, 8.0, 0, C.accent, 1); t.line(s, 1.0, 0.64, 8.0, 0, C.accent, 0.4); };
  const page = (d) => { const s = k.slide(C.paper); letterhead(s); if (d.title) k.txt(s, [{ text: `${k.TR.topic} `, options: { color: C.muted } }, { text: d.title, options: { bold: true } }], X, 0.75, W - 1.8, 0.45, { max: 17, min: 11, valign: 'middle' });
    k.txt(s, [k.M.loc, k.M.year].filter(Boolean).join(', '), X + W - 1.8, 0.75, 1.8, 0.45, { size: 10, italic: true, color: C.muted, align: 'right', valign: 'middle' });
    k.txt(s, `\u2014 ${k.idx} \u2014`, 4.2, 5.0, 1.6, 0.25, { size: 9, align: 'center', color: C.muted }); k.foot(s, { y: 5.28, align: 'center', size: 7.5, x: 1.0, w: 8.0 }); return s; };
  const paras = (s, list, y0 = 1.35, y1 = 4.95) => { const n = list.length, h = (y1 - y0) / n; list.forEach(([head, body], i) => k.txt(s, [{ text: head, options: { bold: true, color: C.accent } }, { text: '  ' + body }], X, y0 + i * h, W, h - 0.06, { max: 15, min: 10, ls: 1.35, valign: 'top' })); };
  const R = {
    async cover(d) { const s = k.slide(C.paper); letterhead(s); if (d.image) { t.rect(s, 7.05, 0.95, 1.95, 2.35, 'FFFFFF', { line: { color: C.rule, width: 1 }, shadow: 0.15, blur: 4, offset: 2, name: 'Enclosure' }); await k.photo(s, d.image, 7.15, 1.05, 1.75, 2.15); }
      k.txt(s, [k.M.loc, k.M.year].filter(Boolean).join(', '), X, 0.85, 5.5, 0.35, { size: 11, italic: true, color: C.muted });
      k.head(s, d.title, X, 1.35, 5.8, 1.8, { max: 34, min: 18, valign: 'top', color: C.ink });
      if (d.subtitle) k.txt(s, d.subtitle, X, 3.2, 5.8, 0.8, { max: 14, italic: true, color: C.muted });
      t.img(s, await k.svg('sig', scribble, 300, 80), X, 4.05, 1.9, 0.5); t.line(s, X, 4.6, 3.2, 0, C.rule, 0.75);
      k.txt(s, k.M.author || '', X, 4.62, 4.0, 0.35, { size: 13, bold: true }); k.foot(s, { y: 5.28, align: 'center', size: 7.5, x: 1.0, w: 8.0 }); },
    async intro(d) { const s = page(d); await k.photo(s, d.image, X + W - 2.6, 1.4, 2.6, 2.0); k.txt(s, d.text, X, 1.4, W - 2.85, 3.5, { max: 16, min: 10, ls: 1.4 }); },
    async image(d) { const s = page(d); await k.photo(s, d.image, X, 1.4, 2.6, 2.0); k.txt(s, d.text, X + 2.85, 1.4, W - 2.85, 3.5, { max: 16, min: 10, ls: 1.4 }); },
    async agenda(d) { const s = page(d); paras(s, d.items.map((it, i) => [`${i + 1}.`, it])); },
    async cards(d) { const s = page(d); paras(s, d.items.map((it) => [`${it.h}.`, it.t])); },
    async process(d) { const s = page(d); paras(s, d.steps.map((st, i) => [`${i + 1}) ${st.h}.`, st.t])); },
    async stats(d) { const s = page(d), n = d.stats.length, w = W / n; d.stats.forEach((v, i) => { const x = X + i * w; k.head(s, v.value, x, 1.45, w - 0.2, 1.1, { max: 44, min: 18, color: C.accent }); t.line(s, x, 2.6, w - 0.4, 0, C.rule, 0.75); k.txt(s, v.label, x, 2.7, w - 0.3, 1.2, { max: 13, italic: true }); });
      if (d.note) k.txt(s, d.note, X, 4.05, W, 0.8, { max: 12, color: C.muted, italic: true }); },
    async compare(d) { const s = page(d), w = 3.8, { rows: rr, fs } = rowsFit([d.left.items, d.right.items], 14, w, F.body, 0.12, 3.0);
      [d.left, d.right].forEach((sd, i) => { const x = X + i * (w + 0.4); k.txt(s, sd.h, x, 1.4, w, 0.45, { size: 16, bold: true, italic: true, color: C.accent }); t.line(s, x, 1.87, w, 0, C.accent, 0.75); let y = 1.95; sd.items.forEach((it, j) => { k.txt(s, it, x, y, w, rr[j], { size: fs, ls: 1.25 }); y += rr[j]; }); }); },
    async statement(d) { const s = page(d); t.line(s, X + 0.3, 1.5, 0, 2.2, C.accent, 3); k.head(s, L.runs(d.text), X + 0.6, 1.45, W - 0.9, 2.3, { max: 30, min: 15, italic: true }); if (d.caption) k.txt(s, d.caption, X + 0.6, 3.85, W - 0.9, 1.05, { max: 13, color: C.muted }); },
    async timeline(d) { const s = page(d); paras(s, d.items.map((it) => [`${it.year} \u2014 ${it.h}.`, it.t])); },
    async quote(d) { const s = page({}); k.head(s, `\u00AB${d.text}\u00BB`, X + 0.5, 1.5, W - 1.0, 2.3, { max: 30, min: 15, italic: true, align: 'center' }); if (d.author) k.txt(s, d.author, X + 0.5, 3.95, W - 1.0, 0.45, { size: 14, align: 'right', color: C.accent, bold: true }); },
    async sources(d) { const s = page(d); paras(s, d.items.map((it, i) => [`[${i + 1}]`, it])); },
  };
  R.closing = R.cover;
  // ---- further ways to draw a type, all on the writing desk: a deck's pages must not look alike (L.pages)
  const WAX = '8C1C13', MIST = 'D5DCE8', NIGHT = C.accent, CARD = 'FFFFFF', SEP = '2F4C80';
  const desk = (d) => { // the dark blue blotter: the same letterhead in white
    const s = k.slide(NIGHT);
    k.txt(s, (k.M.org || k.M.topic || '').toUpperCase(), 1.0, 0.25, 8.0, 0.3, { size: 11, bold: true, spacing: 3, align: 'center', color: 'FFFFFF' });
    t.line(s, 1.0, 0.6, 8.0, 0, MIST, 1); t.line(s, 1.0, 0.64, 8.0, 0, MIST, 0.4);
    if (d.title) k.txt(s, [{ text: `${k.TR.topic} `, options: { color: MIST } }, { text: d.title, options: { bold: true, color: 'FFFFFF' } }], X, 0.75, W, 0.45, { max: 17, min: 11, valign: 'middle', color: 'FFFFFF' });
    k.txt(s, `— ${k.idx} —`, 4.2, 5.0, 1.6, 0.25, { size: 9, align: 'center', color: MIST }); k.foot(s, { y: 5.28, align: 'center', size: 7.5, x: 1.0, w: 8.0, color: MIST });
    return s;
  };
  const bd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 13, min: 10, ls: 1.25, ...o });
  const hd = (s, v, x, y, w, h, o = {}) => k.txt(s, v, x, y, w, h, { max: 15, min: 11, bold: true, italic: true, color: C.accent, valign: 'middle', ls: 1.1, ...o });
  const seal = (s, x, y, dd, label, size = 14, o = {}) => { // a wax seal with a pressed ring
    t.oval(s, x, y, dd, dd, o.color || WAX);
    t.oval(s, x + dd * 0.09, y + dd * 0.09, dd * 0.82, dd * 0.82, null, { line: { color: 'E7B9B3', width: 0.75 } });
    k.txt(s, String(label), x + dd * 0.1, y, dd * 0.8, dd, { size, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
  };
  const halves = (str) => { const mid = str.length / 2; let cut = str.indexOf('. ', Math.round(mid * 0.7)); if (cut < 0 || cut > mid * 1.3) { cut = str.lastIndexOf(' ', Math.round(mid)); return cut < 0 ? [str, ''] : [str.slice(0, cut), str.slice(cut + 1)]; } return [str.slice(0, cut + 1), str.slice(cut + 2)]; };
  const stampFrame = (w, h) => { let holes = ''; const r = 7; for (let x = 12; x < w; x += 24) holes += `<circle cx="${x}" cy="0" r="${r}"/><circle cx="${x}" cy="${h}" r="${r}"/>`; for (let y = 12; y < h; y += 24) holes += `<circle cx="0" cy="${y}" r="${r}"/><circle cx="${w}" cy="${y}" r="${r}"/>`; return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/><g fill="#${C.paper}">${holes}</g></svg>`; };
  const postmark = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><g fill="none" stroke="#${C.accent}" stroke-opacity="0.75"><circle cx="120" cy="120" r="112" stroke-width="5"/><circle cx="120" cy="120" r="82" stroke-width="3"/></g></svg>`;
  const clip = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="150"><path d="M42,30 V112 a16,16 0 0 1 -32,0 V24 a11,11 0 0 1 22,0 V102" fill="none" stroke="#6A645A" stroke-width="5" stroke-linecap="round"/></svg>`;
  const envelope = (s, x, y, w, h, fill, line) => { t.rect(s, x, y, w, h, fill, { line: { color: line, width: 0.75 }, name: 'Envelope' }); t.line(s, x, y, w / 2, h * 0.62, line, 0.75); t.line(s, x + w / 2, y, w / 2, h * 0.62, line, 0.75, { flipH: true }); };
  const sheet = (s, x, y, w, h, fill = CARD) => t.rect(s, x, y, w, h, fill, { line: { color: C.rule, width: 0.5 }, shadow: 0.18, blur: 5, offset: 2, name: 'Sheet' });
  const V = {
    image: [
      async (d) => { // an enclosure held by a clip, the letter set in two columns under it
        const s = page(d), [a, b] = halves(d.text), w = 3.85, fs = Math.min(L.fit(a, w, 1.7, 13, 10, F.body, false, 1.25), L.fit(b, w, 1.7, 13, 10, F.body, false, 1.25));
        await k.photo(s, d.image, X, 1.32, W, 1.72);
        t.img(s, await k.svg('clip', clip, 60, 150), X + 0.4, 1.2, 0.3, 0.72);
        bd(s, a, X, 3.17, w, 1.75, { size: fs }); bd(s, b, X + W - w, 3.17, w, 1.75, { size: fs });
      },
      async (d) => { // the picture is the desk, the letter lies on it
        const s = k.slide(C.paper), x = 3.75, w = 5.75;
        await k.photo(s, d.image, 0, 0, 10, 5.625);
        t.rect(s, x, 0.25, w, 5.375, C.paper, { shadow: 0.3, blur: 8, offset: 3, name: 'Sheet' });
        k.txt(s, (k.M.org || k.M.topic || '').toUpperCase(), x + 0.3, 0.35, w - 0.6, 0.26, { size: 10, bold: true, spacing: 2, align: 'center', color: C.accent });
        t.line(s, x + 0.3, 0.64, w - 0.6, 0, C.accent, 1); t.line(s, x + 0.3, 0.68, w - 0.6, 0, C.accent, 0.4);
        k.txt(s, d.title || '', x + 0.3, 0.76, w - 0.6, 0.55, { max: 16, min: 11, bold: true, valign: 'middle' });
        bd(s, d.text, x + 0.3, 1.38, w - 0.6, 3.56, { max: 13.5 });
        k.txt(s, `— ${k.idx} —`, x + w / 2 - 0.5, 5.0, 1.0, 0.25, { size: 9, align: 'center', color: C.muted });
        k.foot(s, { y: 5.28, align: 'center', size: 7, x: x + 0.2, w: w - 0.4 });
      },
      async (d) => { // the picture becomes a postage stamp, cancelled in the corner
        const s = page(d), sw = 2.35, sh = 3.0, x = X + W - sw, y = 1.4;
        t.img(s, await k.svg('stamp', stampFrame(235, 300), 235, 300), x, y, sw, sh);
        await k.photo(s, d.image, x + 0.14, y + 0.14, sw - 0.28, sh - 0.28);
        t.img(s, await k.svg('postmark', postmark, 240, 240), x - 0.5, y + 1.75, 1.45, 1.45);
        bd(s, d.text, X, 1.4, W - sw - 0.75, 3.5, { max: 14, ls: 1.35 });
      },
      async (d) => { // night: a great round picture set in the wax of a seal
        const s = desk(d), dd = 3.35, x = 5.65, y = 1.42;
        t.oval(s, x - 0.14, y - 0.14, dd + 0.28, dd + 0.28, WAX);
        await k.photo(s, d.image, x, y, dd, dd, { mask: 'circle' });
        bd(s, d.text, X, 1.35, 4.3, 3.55, { max: 14, ls: 1.35, color: 'FFFFFF', valign: 'middle' });
      },
    ],
    cards: [
      async (d) => { // a memorandum: heads ruled off in pairs, a fold down the middle
        const s = page(d), n = d.items.length, w = 3.8, h = 1.72;
        t.line(s, 5, 1.4, 0, n === 3 ? h : 3.5, C.rule, 0.75, { dash: 'dash' });
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? W : w, x = X + (i % 2) * (w + 0.4), y = 1.38 + Math.floor(i / 2) * (h + 0.05);
          hd(s, it.h, x, y, ww, 0.4);
          t.line(s, x, y + 0.42, ww, 0, C.accent, 0.75);
          bd(s, it.t, x, y + 0.5, ww, h - 0.54);
        }
      },
      async (d) => { // a ledger: names in the wide margin, a red margin line, words beyond it
        const s = page(d), n = d.items.length, h = 3.56 / n, m = 3.25;
        t.line(s, m, 1.32, 0, 3.62, WAX, 1); t.line(s, m + 0.05, 1.32, 0, 3.62, WAX, 0.4);
        for (const [i, it] of d.items.entries()) {
          const y = 1.35 + i * h;
          hd(s, it.h, X, y + 0.04, m - X - 0.2, h - 0.08, { align: 'right' });
          bd(s, it.t, m + 0.25, y + 0.04, X + W - m - 0.25, h - 0.08, { valign: 'middle' });
          if (i) t.line(s, X, y, W, 0, C.rule, 0.5);
        }
      },
      async (d) => { // night: a row of sealed envelopes, each with its message under it
        const s = desk(d), n = d.items.length, w = W / n, ew = Math.min(1.5, w - 0.4), eh = 0.92;
        for (const [i, it] of d.items.entries()) {
          const x = X + i * w, ex = x + (w - 0.2 - ew) / 2;
          envelope(s, ex, 1.35, ew, eh, C.paper, C.rule);
          t.oval(s, ex + ew / 2 - 0.22, 1.35 + eh * 0.62 - 0.22, 0.44, 0.44, WAX);
          t.img(s, await k.icon(it.icon, 'FFFFFF', 2), ex + ew / 2 - 0.12, 1.35 + eh * 0.62 - 0.12, 0.24, 0.24);
          hd(s, it.h, x, 2.35, w - 0.2, 0.56, { color: 'FFFFFF', align: 'center', max: 14 });
          bd(s, it.t, x, 2.93, w - 0.2, 2.0, { color: MIST, align: 'center', max: 12.5 });
        }
      },
      async (d) => { // postcards dropped on the desk at different heights
        const s = page(d), n = d.items.length, w = (W - (n - 1) * 0.14) / n, h = n === 4 ? 2.95 : 2.85;
        for (const [i, it] of d.items.entries()) {
          const x = X + i * (w + 0.14), y = i % 2 ? 1.95 : 1.35;
          sheet(s, x, y, w, h);
          t.rect(s, x + w - 0.5, y + 0.1, 0.38, 0.46, null, { line: { color: WAX, width: 0.75, dashType: 'sysDot' }, name: 'Stamp' });
          t.img(s, await k.icon(it.icon, WAX, 2), x + w - 0.43, y + 0.21, 0.24, 0.24);
          hd(s, it.h, x + 0.12, y + 0.08, w - 0.68, 0.62, { max: 13, min: 10.5, valign: 'top' });
          t.line(s, x + 0.12, y + 0.72, w - 0.24, 0, C.rule, 0.5);
          bd(s, it.t, x + 0.12, y + 0.78, w - 0.24, h - 0.84, { max: 12, ls: 1.18 });
        }
      },
    ],
    process: [
      async (d) => { // the post's route: cancelled stamps along a dashed road
        const s = page(d), n = d.steps.length, w = W / n, dd = 0.8, y = 1.32;
        t.line(s, X + dd / 2, y + dd / 2, w * (n - 1), 0, C.accent, 1, { dash: 'dash' });
        for (const [i, st] of d.steps.entries()) {
          const x = X + i * w;
          t.oval(s, x, y, dd, dd, C.paper);
          t.img(s, await k.svg('postmark', postmark, 240, 240), x, y, dd, dd);
          k.txt(s, String(i + 1), x, y, dd, dd, { size: 18, bold: true, italic: true, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
          if (i < n - 1) k.txt(s, '›', x + w - 0.42, y + 0.1, 0.3, 0.55, { size: 22, color: C.accent, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, x, y + 0.88, w - 0.2, 0.56, { valign: 'top', max: 14 });
          bd(s, st.t, x, y + 1.46, w - 0.2, 2.15, { max: 12.5 });
        }
      },
      async (d) => { // clauses of an agreement, each one indented further than the last
        const s = page(d), n = d.steps.length, h = 3.56 / n, ind = n === 4 ? 0.62 : 0.9;
        for (const [i, st] of d.steps.entries()) {
          const x = X + i * ind, y = 1.35 + i * h, w = X + W - x - 0.55;
          k.txt(s, `§${i + 1}`, x, y, 0.55, 0.42, { size: 16, bold: true, italic: true, color: WAX, valign: 'middle', ls: 1 });
          t.line(s, x + 0.02, y + 0.4, 0, h - 0.46, WAX, 1);
          hd(s, st.h, x + 0.6, y, w, 0.36);
          bd(s, st.t, x + 0.15, y + 0.37, w + 0.4, h - 0.39, { ls: 1.15 });
        }
      },
      async (d) => { // night: a thread of wax seals down the middle of the page
        const s = desk(d), n = d.steps.length, per = Math.ceil(n / 2), h = 3.56 / per, w = 3.6, cx = 5;
        t.line(s, cx, 1.32, 0, 3.6, MIST, 1);
        for (const [i, st] of d.steps.entries()) {
          const right = i % 2 === 1, y = 1.35 + Math.floor(i / 2) * h + (right ? 0.62 : 0), x = right ? cx + 0.42 : cx - 0.42 - w, a = right ? 'left' : 'right';
          seal(s, cx - 0.27, y + 0.02, 0.54, i + 1, 14);
          hd(s, st.h, x, y, w, 0.42, { color: 'FFFFFF', align: a });
          bd(s, st.t, x, y + 0.44, w, Math.min(h - 0.5, 4.93 - y - 0.44), { color: MIST, align: a, max: 12.5 });
        }
      },
      async (d) => { // a routing slip: ruled in ink, each line waiting for its tick
        const s = page(d), n = d.steps.length, y0 = 1.36, H1 = 3.54, h = H1 / n, a = X + 0.55, b = X + 2.85, c = X + W - 0.55;
        t.rect(s, X, y0, W, H1, null, { line: { color: C.accent, width: 1 }, name: 'Slip' });
        for (const xx of [a, b, c]) t.line(s, xx, y0, 0, H1, C.accent, 0.5);
        for (const [i, st] of d.steps.entries()) {
          const y = y0 + i * h;
          if (i) t.line(s, X, y, W, 0, C.accent, 0.5);
          k.txt(s, String(i + 1), X, y, 0.55, h, { size: 17, bold: true, italic: true, color: WAX, align: 'center', valign: 'middle', ls: 1 });
          hd(s, st.h, a + 0.12, y + 0.04, b - a - 0.22, h - 0.08);
          bd(s, st.t, b + 0.12, y + 0.04, c - b - 0.24, h - 0.08, { valign: 'middle', ls: 1.15 });
          k.txt(s, '\u2713', c, y, 0.55, h, { size: 18, bold: true, color: WAX, align: 'center', valign: 'middle', font: 'Arial', ls: 1 });
        }
      },
    ],
    stats: [
      async (d) => { // an account: name, dotted leader, the sum set to the right
        const s = page(d), rh = 0.82, y0 = 1.38;
        for (const [i, v] of d.stats.entries()) {
          const y = y0 + i * rh;
          bd(s, v.label, X, y, 4.9, rh - 0.1, { max: 14, valign: 'bottom', italic: true });
          t.line(s, X + 5.0, y + rh - 0.2, 0.9, 0, C.muted, 1, { dash: 'sysDot' });
          k.txt(s, v.value, X + 5.95, y, 2.05, rh - 0.08, { size: L.fit(v.value, 2.05, 0.7, 34, 16, F.head, true), bold: true, font: F.head, color: i === 0 ? WAX : C.accent, align: 'right', valign: 'bottom', ls: 1 });
        }
        t.line(s, X, y0 + 3 * rh + 0.02, W, 0, C.accent, 1); t.line(s, X, y0 + 3 * rh + 0.06, W, 0, C.accent, 0.4);
        if (d.note) k.txt(s, `*  ${d.note}`, X, y0 + 3 * rh + 0.14, W, 1.0, { max: 12, min: 10, italic: true, color: C.muted, ls: 1.2 });
      },
      async (d) => { // night: each figure pressed into a great wax seal
        const s = desk(d), w = W / 3, dd = 1.75;
        for (const [i, v] of d.stats.entries()) {
          const x = X + i * w, sx = x + (w - dd) / 2;
          t.oval(s, sx, 1.32, dd, dd, WAX);
          t.oval(s, sx + 0.12, 1.44, dd - 0.24, dd - 0.24, null, { line: { color: 'E7B9B3', width: 1 } });
          k.txt(s, v.value, sx + 0.18, 1.32, dd - 0.36, dd, { size: L.fit(v.value, dd - 0.4, 0.9, 30, 13, F.head, true), bold: true, font: F.head, color: 'FFFFFF', align: 'center', valign: 'middle', ls: 1 });
          bd(s, v.label, x + 0.1, 3.14, w - 0.2, 0.72, { align: 'center', color: 'FFFFFF', max: 12.5, italic: true });
        }
        if (d.note) bd(s, d.note, X, 3.88, W, 1.06, { align: 'center', color: MIST, max: 12, valign: 'middle' });
      },
    ],
    compare: [
      async (d) => { // night: two sheets laid side by side on the blotter, one a little higher
        const s = desk(d), w = 3.92;
        for (const [i, sd] of [d.left, d.right].entries()) {
          const x = i ? X + W - w : X, y = i ? 1.3 : 1.48, h = 3.45, n = sd.items.length, rh = (h - 0.72) / n;
          t.rect(s, x, y, w, h, C.paper, { name: 'Sheet' });
          hd(s, sd.h, x + 0.2, y + 0.08, w - 0.4, 0.5, { max: 16, min: 12 });
          t.line(s, x + 0.2, y + 0.6, w - 0.4, 0, C.accent, 0.75);
          sd.items.forEach((it, j) => bd(s, it, x + 0.2, y + 0.66 + j * rh, w - 0.4, rh - 0.04, { valign: 'middle', max: 12.5, ls: 1.15 }));
        }
      },
      async (d) => { // two passages parted by a dashed line to cut along, the name in the margin
        const s = page(d), h = 1.72, mid = 3.13;
        t.line(s, 0.55, mid, 8.9, 0, C.muted, 0.75, { dash: 'dash' });
        k.txt(s, '✂', 0.25, mid - 0.17, 0.34, 0.34, { size: 13, color: C.muted, align: 'center', valign: 'middle', font: 'Arial', ls: 1 });
        for (const [i, sd] of [d.left, d.right].entries()) {
          const y = i ? mid + 0.07 : 1.33, n = sd.items.length, c = 2, w = 2.95;
          hd(s, sd.h, X, y, 1.9, h - 0.05, { valign: 'top', max: 15, color: i ? WAX : C.accent });
          sd.items.forEach((it, j) => { const x = X + 2.0 + (j % c) * (w + 0.1), yy = y + Math.floor(j / c) * (n > 2 ? 0.86 : 0); k.txt(s, [{ text: `${String.fromCharCode(97 + j)})  `, options: { bold: true, color: i ? WAX : C.accent } }, { text: it }], (j === 2 && n === 3) ? X + 2.0 : x, yy, (j === 2 && n === 3) ? W - 2.0 : w, 0.82, { max: 12.5, min: 10, ls: 1.15 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the closing line of the letter: a thought, its note, a signature and a seal
        const s = page(d);
        k.txt(s, L.runs(d.text), X + 0.4, 1.32, W - 0.8, 1.92, { size: L.fit(d.text, W - 0.8, 1.85, 32, 16, F.head, true, 1.15), bold: true, italic: true, align: 'center', valign: 'middle', ls: 1.15, font: F.head, color: C.ink });
        if (d.caption) bd(s, d.caption, X + 0.2, 3.24, W - 2.2, 1.68, { max: 13, color: C.muted, valign: 'middle' });
        t.img(s, await k.svg('sig2', scribble, 300, 80), X + W - 1.8, 3.42, 1.7, 0.45);
        seal(s, X + W - 1.25, 3.95, 0.8, '✦', 16);
      },
      async (d) => { // night: the flap of the envelope closes over the title, sealed at its point
        const s = desk({});
        t.img(s, await k.svg('flap', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="260"><polygon points="0,0 1000,0 500,260" fill="#${SEP}"/></svg>`, 1000, 260), 0, 0, 10, 2.6);
        // the flap covers the letterhead: draw them again on top
        k.txt(s, (k.M.org || k.M.topic || '').toUpperCase(), 1.0, 0.25, 8.0, 0.3, { size: 11, bold: true, spacing: 3, align: 'center', color: 'FFFFFF' });
        t.line(s, 1.0, 0.6, 8.0, 0, MIST, 1);
        k.txt(s, d.title || '', X, 0.75, W, 0.45, { max: 17, min: 11, bold: true, valign: 'middle', color: 'FFFFFF', align: 'center' });
        seal(s, 5 - 0.42, 2.14, 0.84, '✦', 18);
        k.txt(s, L.runs(d.text), X, 3.0, W, 1.12, { size: L.fit(d.text, W, 1.1, 24, 14, F.head, true, 1.1), bold: true, italic: true, align: 'center', valign: 'middle', color: 'FFFFFF', font: F.head, ls: 1.1 });
        if (d.caption) bd(s, d.caption, X, 4.13, W, 0.84, { align: 'center', color: MIST, max: 12, ls: 1.1 });
      },
    ],
    timeline: [
      async (d) => { // four dated letters filed one over another
        const s = page(d), w = 6.75, rh = 0.9;
        for (const [i, it] of d.items.entries()) {
          const x = X + i * 0.42, y = 1.32 + i * rh;
          sheet(s, x, y, w, rh + 0.0);
          k.txt(s, it.year, x + 0.12, y + 0.04, 1.3, rh - 0.08, { size: L.fit(it.year, 1.3, 0.7, 18, 10.5, F.head, true), bold: true, italic: true, color: WAX, valign: 'middle', ls: 1 });
          hd(s, it.h, x + 1.45, y + 0.03, w - 1.6, 0.3, { max: 13, min: 10.5 });
          bd(s, it.t, x + 1.45, y + 0.33, w - 1.6, rh - 0.36, { max: 11.5, ls: 1.08 });
        }
      },
      async (d) => { // the open diary: two dates on each page, the fold between them
        const s = page(d), w = 3.75, h = 1.72;
        t.rect(s, 4.9, 1.32, 0.2, 3.62, C.rule, { t: 55, name: 'Fold' });
        for (const [i, it] of d.items.entries()) {
          const col = i < 2 ? 0 : 1, x = col ? 5.25 : X, y = 1.35 + (i % 2) * (h + 0.1);
          k.txt(s, it.year, x, y, w, 0.5, { size: L.fit(it.year, w, 0.48, 24, 13, F.head, true), bold: true, italic: true, color: WAX, valign: 'middle', ls: 1 });
          hd(s, it.h, x, y + 0.48, w, 0.34, { max: 13.5, min: 10.5 });
          bd(s, it.t, x, y + 0.82, w, h - 0.84, { max: 12, ls: 1.15 });
        }
      },
      async (d) => { // night: a thread across the blotter, seals on it, events above and below by turns
        const s = desk(d), mid = 3.15, step = 1.56, w = 3.0;
        t.line(s, 0.4, mid, 9.2, 0, MIST, 1);
        for (const [i, it] of d.items.entries()) {
          const x = X + i * step, up = i % 2 === 0, y = up ? 1.28 : mid + 0.24, h = up ? mid - 0.26 - y : 4.95 - y;
          t.oval(s, x, mid - 0.13, 0.26, 0.26, WAX, { line: { color: 'E7B9B3', width: 0.75 } });
          k.txt(s, [{ text: it.year + '  ', options: { bold: true, italic: true, color: 'F2C9C3' } }, { text: it.h, options: { bold: true, color: 'FFFFFF' } }], x, y, w, 0.36, { max: 13, min: 10, valign: 'middle', ls: 1.05, bold: true });
          bd(s, it.t, x, y + 0.38, w, h - 0.4, { color: MIST, max: 11.5, ls: 1.12 });
        }
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  R.process = V.process.shift(); // the old prose paragraphs were the same page for cards, process and timeline
  R.timeline = V.timeline.shift();
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  return L.save(k.pres, out, { name: 'SlideAI Maktub', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: C.accent, lt2: C.paper, accent1: C.accent, accent2: '8C1C13', accent3: '4F6D7A', accent4: 'A68A64', accent5: C.muted, accent6: C.rule, hlink: C.accent, folHlink: C.muted } });
}
module.exports = { id: 106, slug: 'maktub', name: 'Maktub', category: 'academic', photos: true, build, style: { tone: "rasmiy maktub uslubi: bog'langan to'liq gaplar, hurmatli murojaat, mantiqiy izchillik", limits: {}, prefer: 'text' } };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["fade", "cover:d", "dissolve"], "cover": ["fadeLetters", "fadeWords"], "mark": "fade", "deco": "unfold", "sig": {"title": "fadeLetters", "body": "fadeWords", "item": "unfold", "image": "unfold", "number": "fade", "order": "seq", "stagger": 0.26}, "tempo": 1.35, "kenburns": false};
