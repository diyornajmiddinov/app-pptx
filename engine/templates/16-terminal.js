/**
 * 16 Terminal — developer console: black window chrome, monospace everything,
 * prompt symbols, diff-style comparison, git-log timeline.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { bg: '0B0E0C', panel: '111714', bar: '1C2420', border: '26332C', green: '39FF88', dim: '2E7D50', text: 'D6F5E3', gray: '7F9488', red: 'FF5F56', amber: 'FFBD2E' };
const M = 'Courier New';
const F = { head: M, body: M };

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const SL = L.track(pres), META = content.meta || {};
  const PH = async (s, img, x, y, w, h, o = {}) => t.img(s, await L.photo(L.src(img), w, h, o), x, y, w, h, { alt: '' });
  let idx = 0;
  const slug = (x) => String(x).toLowerCase().replace(/[^a-z0-9\u0400-\u04ff]+/gi, '-').replace(/^-|-$/g, '').slice(0, 28);

  const win = (s, x, y, w, h, file) => {
    t.rect(s, x, y, w, h, C.panel, { r: 0.08, line: { color: C.border, width: 1 }, name: 'Window' });
    t.rect(s, x, y, w, 0.38, C.bar, { r: 0.08, name: 'Title bar' });
    [C.red, C.amber, C.green].forEach((c, k) => t.oval(s, x + 0.2 + k * 0.22, y + 0.13, 0.12, 0.12, c));
    t.text(s, file, { x: x + 1.0, y, w: w - 2.0, h: 0.38, fontSize: 10, color: C.gray, align: 'center', valign: 'middle' });
  };
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    win(s, 0.35, 0.3, 9.3, 5.0, `~/taqdimot/${L.pad2(idx)}-${slug(d.title || 'quote')}.md`);
    if (d.title) t.text(s, '## ' + d.title, { x: 0.7, y: 0.85, w: 8.6, h: 0.6, bold: true, color: C.green, valign: 'middle', fontSize: L.fit('## ' + d.title, 8.6, 0.6, 22, 14, M, true) });
    return s;
  };
  const hero = (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.bg }; idx++;
    win(s, 0.6, 0.55, 8.8, 4.5, 'slideai \u2014 zsh');
    t.text(s, kind === 'cover' ? '$ slideai --open taqdimot' : '$ slideai --done', { x: 1.0, y: 1.2, w: 8.0, h: 0.35, fontSize: 13, color: C.gray });
    const TW = d.image ? 4.9 : 7.4, fs = L.fit(d.title, TW, 1.6, 36, 20, M, true);
    const lines = L.lines(d.title, fs, TW, M, true), th = L.height(d.title, fs, TW, M, true);
    t.text(s, d.title, { x: 1.0, y: 1.7, w: TW, h: th + 0.1, fontSize: fs, bold: true, color: C.green });
    if (lines === 1) t.rect(s, 1.0 + Math.min(TW - 0.1, L.width(d.title.split(' ').slice(-1)[0], fs, M, true) * (lines > 1 ? 1 : 0) + (lines > 1 ? 0.1 : Math.min(TW - 0.1, L.width(d.title, fs, M, true) + 0.1))), 1.7 + th - lh(fs), 0.22, lh(fs) * 0.85, C.green, { name: 'Cursor' });
    if (d.subtitle) t.text(s, '# ' + d.subtitle, { x: 1.0, y: 1.95 + th, w: TW + 0.2, h: 1.2, fontSize: 14, color: C.gray });
  };
  const lh = (fs) => L.lh(fs, 1, M);

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async agenda(d) {
      const s = page(d), rh = Math.min(0.55, 3.5 / d.items.length);
      d.items.forEach((it, i) => {
        const y = 1.6 + i * rh;
        t.text(s, [{ text: '[', options: { color: C.gray } }, { text: L.pad2(i + 1), options: { color: C.green, bold: true } }, { text: ']  ', options: { color: C.gray } }, { text: it, options: { color: C.text } }],
          { x: 0.9, y, w: 8.2, h: rh, fontSize: 17, valign: 'middle' });
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.25, w = (8.6 - gap * (n - 1)) / n;
      const hfs = Math.min(...d.items.map((it) => L.fit('> ' + it.h, w - 0.4, 0.42, 16, 11, M, true)));
      const h = Math.min(3.35, 0.95 + Math.max(...d.items.map((it) => L.height(it.t, 13, w - 0.4, M))) + 0.3);
      d.items.forEach((it, i) => {
        const x = 0.7 + i * (w + gap), y = 1.65;
        t.rect(s, x, y, w, h, null, { line: { color: C.dim, width: 1 }, name: 'Box' });
        t.text(s, '> ' + it.h, { x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.42, fontSize: hfs, bold: true, color: C.green });
        t.text(s, it.t, { x: x + 0.2, y: y + 0.75, w: w - 0.4, h: h - 0.85, fontSize: L.fit(it.t, w - 0.4, h - 0.9, 13, 10, M), color: C.text });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.4, w = (8.6 - gap * (n - 1)) / n, y = 1.75, h = 2.9;
      d.steps.forEach((st, i) => {
        const x = 0.7 + i * (w + gap);
        t.rect(s, x, y, w, h, null, { line: { color: i === n - 1 ? C.green : C.dim, width: 1 }, name: 'Box' });
        t.text(s, `step_${L.pad2(i + 1)}`, { x: x + 0.2, y: y + 0.18, w: w - 0.4, h: 0.3, fontSize: 12, color: C.amber });
        t.text(s, st.h, { x: x + 0.2, y: y + 0.55, w: w - 0.4, h: 0.45, fontSize: L.fit(st.h, w - 0.4, 0.45, 16, 11, M, true), bold: true, color: C.green });
        t.text(s, st.t, { x: x + 0.2, y: y + 1.1, w: w - 0.4, h: h - 1.2, fontSize: L.fit(st.t, w - 0.4, h - 1.25, 13, 10, M), color: C.text });
        if (i < n - 1) t.text(s, '\u2192', { x: x + w, y: y + h / 2 - 0.2, w: gap, h: 0.4, fontSize: 18, bold: true, color: C.green, align: 'center', valign: 'middle' });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, cw = 8.6 / n;
      d.stats.forEach((x, i) => {
        const px = 0.7 + i * cw;
        t.text(s, x.value, { x: px, y: 1.75, w: cw - 0.3, h: 1.1, bold: true, color: C.green, valign: 'bottom', fontSize: L.fit(x.value, cw - 0.4, 1.0, 50, 24, M, true) });
        t.text(s, '// ' + x.label, { x: px, y: 3.0, w: cw - 0.3, h: 1.0, fontSize: 13, color: C.gray });
      });
      if (d.note) t.text(s, '# ' + d.note, { x: 0.7, y: 4.3, w: 8.6, h: 0.6, fontSize: 12, color: C.gray });
    },
    async compare(d) {
      const s = page(d), w = 4.2, y = 1.65;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 14, w - 0.6, M, 0.12, 5.0 - y - 0.6 - 0.06 * Math.max(d.left.items.length, d.right.items.length));
      [d.left, d.right].forEach((side, i) => {
        const x = 0.7 + i * (w + 0.2), col = i ? C.green : C.amber, sign = '>';
        t.text(s, `### ${side.h}`, { x, y, w, h: 0.45, fontSize: 16, bold: true, color: col });
        let yy = y + 0.6;
        side.items.forEach((it, k) => {
          t.rect(s, x, yy, w, rows[k], col, { t: 88, name: 'Diff line' });
          t.text(s, sign, { x: x + 0.12, y: yy + 0.06, w: 0.3, h: 0.3, fontSize: 14, bold: true, color: col });
          t.text(s, it, { x: x + 0.45, y: yy + 0.06, w: w - 0.6, h: rows[k] - 0.06, fontSize: CFS, color: C.text });
          yy += rows[k] + 0.06;
        });
      });
    },
    async statement(d) {
      const s = page(d);
      const fs = L.fit('> ' + d.text, 8.4, 1.5, 30, 18, M, true);
      t.text(s, L.runs('> ' + d.text), { x: 0.8, y: 1.8, w: 8.4, h: 1.6, fontSize: fs, bold: true, color: C.text, valign: 'middle' });
      if (d.caption) t.text(s, '# ' + d.caption, { x: 0.8, y: 3.55, w: 8.2, h: 1.2, fontSize: 13, color: C.gray });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.4 / n, lx = 0.95;
      t.line(s, lx, 1.8, 0, rh * (n - 1), C.dim, 1.5);
      d.items.forEach((it, i) => {
        const y = 1.65 + i * rh;
        t.oval(s, lx - 0.1, y + 0.05, 0.2, 0.2, i === n - 1 ? C.green : C.panel, { line: { color: C.green, width: 1.5 } });
        t.text(s, [{ text: it.year + '  ', options: { color: C.amber, bold: true } }, { text: it.h, options: { color: C.green, bold: true } }], { x: lx + 0.35, y: y - 0.02, w: 7.9, h: 0.34, fontSize: 15 });
        t.text(s, it.t, { x: lx + 0.35, y: y + 0.33, w: 7.9, h: rh - 0.38, fontSize: 13, color: C.text });
      });
    },
    async quote(d) {
      const s = page({});
      const fs = L.fit(d.text, 7.6, 2.0, 24, 15, M, false, 1, true);
      t.text(s, '/*', { x: 0.8, y: 1.0, w: 1, h: 0.4, fontSize: 18, bold: true, color: C.gray });
      t.text(s, d.text, { x: 1.2, y: 1.45, w: 7.6, h: 2.3, fontSize: fs, italic: true, color: C.text, valign: 'middle' });
      if (d.author) t.text(s, ' * \u2014 ' + d.author, { x: 0.8, y: 3.85, w: 8, h: 0.35, fontSize: 13, color: C.green });
      t.text(s, ' */', { x: 0.8, y: 4.25, w: 1, h: 0.4, fontSize: 18, bold: true, color: C.gray });
    },
  };
  // ---- rules shared by all templates: Kirish, rasm slaydi, Manbalar, titul/yakun rasmi, muallif qatori
  Object.assign(R, {
    async intro(d) {
      const s = page(d);
      t.rect(s, 0.7, 1.6, 3.9, 3.1, null, { line: { color: C.dim, width: 1 }, name: 'Frame' });
      await PH(s, d.image, 0.78, 1.68, 3.74, 2.94, { duo: ['0B0E0C', '39FF88'] });
      t.text(s, 'image.jpg', { x: 0.7, y: 4.72, w: 3.9, h: 0.25, fontSize: 10, color: C.gray });
      t.text(s, d.text, { x: 4.9, y: 1.6, w: 4.45, h: 3.35, fontSize: L.fit(d.text, 4.45, 3.35, 14, 10, M, false, 1.2), color: C.text, lineSpacingMultiple: 1.2, valign: 'middle' });
    },
    async image(d) {
      const s = page(d);
      t.text(s, d.text, { x: 0.75, y: 1.6, w: 4.2, h: 3.35, fontSize: L.fit(d.text, 4.2, 3.35, 14, 10, M, false, 1.2), color: C.text, lineSpacingMultiple: 1.2, valign: 'middle' });
      t.rect(s, 5.3, 1.6, 4.0, 3.1, null, { line: { color: C.dim, width: 1 }, name: 'Frame' });
      await PH(s, d.image, 5.38, 1.68, 3.84, 2.94, { duo: ['0B0E0C', '39FF88'] });
      t.text(s, 'image.jpg', { x: 5.3, y: 4.72, w: 4.0, h: 0.25, fontSize: 10, color: C.gray });
    },
    async sources(d) {
      const s = page(d), n = d.items.length, rh = Math.min(0.55, 3.4 / n);
      d.items.forEach((it, i) => t.text(s, [{ text: `[${i + 1}] `, options: { color: C.green, bold: true } }, { text: it, options: { color: C.text } }],
        { x: 0.8, y: 1.55 + i * rh, w: 8.4, h: rh, fontSize: L.fit(it, 7.9, rh - 0.04, 13, 9, M), valign: 'middle' }));
    },
  });
  L.heroPhotos(R, SL, {
    cover: async (s, d) => { t.rect(s, 6.15, 1.25, 2.95, 2.25, null, { line: { color: C.dim, width: 1 }, name: 'Frame' }); await PH(s, d.image, 6.22, 1.32, 2.81, 2.11, { duo: ['0B0E0C', '39FF88'] }); },
    closing: async (s, d) => { t.rect(s, 6.15, 1.25, 2.95, 2.25, null, { line: { color: C.dim, width: 1 }, name: 'Frame' }); await PH(s, d.image, 6.22, 1.32, 2.81, 2.11, { duo: ['0B0E0C', '39FF88'] }); },
  });
  // ---- further ways to draw a type, as other console screens: a deck's pages must not look alike (L.pages)
  const txt = (s, v, x, y, w, h, o = {}) => t.text(s, v, { x, y, w, h, fontSize: L.fit(v, w, h, o.max || 13, o.min || 9.5, M, !!o.bold), color: o.color || C.text, bold: !!o.bold, align: o.align, valign: o.valign || 'top', lineSpacingMultiple: o.ls });
  const bar = (s, x, y, w, label, fill = C.bar, ink = C.gray) => { t.rect(s, x, y, w, 0.3, fill, { name: 'Status bar' }); t.text(s, label, { x: x + 0.12, y, w: w - 0.24, h: 0.3, fontSize: 10, color: ink, valign: 'middle', bold: fill === C.green }); };
  const V = {
    image: [
      async (d) => { // the picture across the window, `cat` of the text under it
        const s = page(d);
        await PH(s, d.image, 0.7, 1.5, 8.6, 1.75, { duo: ['0B0E0C', '39FF88'] });
        t.text(s, '$ cat notes.txt', { x: 0.7, y: 3.3, w: 4, h: 0.26, fontSize: 10, color: C.gray });
        txt(s, d.text, 0.7, 3.58, 8.6, 1.42, { max: 12 });
      },
      async (d) => { // two windows, one lying over the other
        const s = page(d);
        win(s, 0.7, 1.5, 5.2, 3.45, 'image.jpg');
        await PH(s, d.image, 0.76, 1.9, 5.08, 3.0, { duo: ['0B0E0C', '39FF88'] });
        win(s, 4.75, 2.05, 4.55, 3.0, 'notes.txt');
        txt(s, d.text, 4.92, 2.5, 4.2, 2.48, { max: 11, min: 9 });
      },
      async (d) => { // a console over the picture
        const s = page(d);
        await PH(s, d.image, 0.43, 1.45, 9.14, 3.8, { duo: ['0B0E0C', '39FF88'] });
        t.rect(s, 0.43, 3.65, 9.14, 1.6, C.bg, { t: 8, name: 'Console' });
        t.rect(s, 0.43, 3.65, 9.14, 0.03, C.green, { name: 'Rule' });
        txt(s, '> ' + d.text, 0.65, 3.74, 8.7, 1.45, { max: 11.5, min: 9 });
      },
      async (d) => { // an editor: numbered lines, the picture in a narrow side pane
        const s = page(d), n = 9;
        t.rect(s, 0.43, 1.5, 0.5, 3.72, C.bar, { name: 'Gutter' });
        for (let k = 0; k < n; k++) t.text(s, String(k + 1), { x: 0.43, y: 1.6 + k * 0.39, w: 0.42, h: 0.3, fontSize: 9, color: C.dim, align: 'right' });
        txt(s, d.text, 1.05, 1.58, 5.75, 3.55, { max: 12, min: 9.5, ls: 1.15 });
        t.line(s, 6.95, 1.5, 0, 3.72, C.border, 1);
        await PH(s, d.image, 7.05, 1.58, 2.42, 3.2, { duo: ['0B0E0C', '39FF88'] });
        t.text(s, 'preview', { x: 7.05, y: 4.82, w: 2.42, h: 0.3, fontSize: 10, color: C.gray, align: 'center' });
      },
    ],
    cards: [
      async (d) => { // the listing of a directory
        const s = page(d), n = d.items.length, y0 = 1.85, h = 3.15 / n;
        bar(s, 0.7, 1.52, 8.6, 'NAME                      DESCRIPTION', C.green, C.bg);
        for (const [i, it] of d.items.entries()) {
          const y = y0 + i * h;
          if (i % 2) t.rect(s, 0.7, y, 8.6, h, C.bar, { name: 'Row' });
          t.img(s, await L.icon(it.icon, C.amber, 2), 0.82, y + h / 2 - 0.13, 0.26, 0.26);
          txt(s, it.h, 1.2, y + 0.05, 2.45, h - 0.1, { bold: true, color: C.green, valign: 'middle', max: 13, min: 10 });
          txt(s, it.t, 3.75, y + 0.05, 5.45, h - 0.1, { valign: 'middle', max: 12 });
        }
      },
      async (d) => { // tiled panes, each with its status line
        const s = page(d), n = d.items.length, w = 4.2, h = 1.62;
        for (const [i, it] of d.items.entries()) {
          const wide = n === 3 && i === 2, ww = wide ? 8.6 : w, x = 0.7 + (i % 2) * (w + 0.2), y = 1.52 + Math.floor(i / 2) * (h + 0.14);
          t.rect(s, x, y, ww, h, C.panel, { line: { color: C.border, width: 1 }, name: 'Pane' });
          bar(s, x, y, ww, `${i}:${slug(it.h)}`, C.dim, C.text);
          txt(s, it.h, x + 0.15, y + 0.34, ww - 0.3, 0.32, { bold: true, color: C.green, max: 13, min: 10, valign: 'middle' });
          txt(s, it.t, x + 0.15, y + 0.68, ww - 0.3, h - 0.73, { max: 11.5, min: 9 });
        }
      },
      async (d) => { // a JSON object: keys in amber, values in strings
        const s = page(d), n = d.items.length, h = 2.95 / n;
        t.text(s, '{', { x: 0.7, y: 1.48, w: 0.5, h: 0.3, fontSize: 16, bold: true, color: C.gray });
        d.items.forEach((it, i) => {
          const y = 1.78 + i * h;
          t.line(s, 0.85, y + 0.02, 0, h - 0.08, C.border, 1);
          txt(s, `"${it.h}":`, 1.05, y, 8.2, 0.3, { bold: true, color: C.amber, max: 13, min: 10, valign: 'middle' });
          txt(s, `"${it.t}"${i < n - 1 ? ',' : ''}`, 1.35, y + 0.3, 7.95, h - 0.34, { color: C.green, max: 12 });
        });
        t.text(s, '}', { x: 0.7, y: 4.72, w: 0.5, h: 0.3, fontSize: 16, bold: true, color: C.gray });
      },
      async (d) => { // small windows at two heights
        const s = page(d), n = d.items.length, gap = 0.16, w = (8.6 - gap * (n - 1)) / n, h = 2.85;
        for (const [i, it] of d.items.entries()) {
          const x = 0.7 + i * (w + gap), y = i % 2 ? 2.18 : 1.5;
          win(s, x, y, w, h, '');
          t.img(s, await L.icon(it.icon, C.green, 2), x + w - 0.36, y + 0.07, 0.24, 0.24);
          txt(s, it.h, x + 0.14, y + 0.44, w - 0.28, 0.5, { bold: true, color: C.green, max: 13, min: 10, valign: 'middle' });
          txt(s, it.t, x + 0.14, y + 0.96, w - 0.28, h - 1.02, { max: 11, min: 9 });
        }
      },
    ],
    process: [
      async (d) => { // a build log: [1/4] and done
        const s = page(d), n = d.steps.length, h = 3.45 / n;
        d.steps.forEach((st, i) => {
          const y = 1.52 + i * h;
          t.text(s, `[${i + 1}/${n}]`, { x: 0.7, y, w: 0.9, h: 0.32, fontSize: 13, bold: true, color: C.amber, valign: 'middle' });
          txt(s, st.h, 1.6, y, 6.7, 0.32, { bold: true, color: C.green, max: 14, min: 10, valign: 'middle' });
          t.text(s, 'done', { x: 8.4, y, w: 0.9, h: 0.32, fontSize: 11, color: C.green, align: 'right', valign: 'middle' });
          t.line(s, 0.95, y + 0.34, 0, h - 0.38, C.dim, 1, { dash: 'dash' });
          txt(s, st.t, 1.6, y + 0.34, 7.7, h - 0.38, { max: 12 });
        });
      },
      async (d) => { // a progress bar across the window, its stages under it
        const s = page(d), n = d.steps.length, cw = 8.6 / n;
        d.steps.forEach((st, i) => {
          const x = 0.7 + i * cw;
          t.rect(s, x + 0.02, 1.55, cw - 0.04, 0.42, i === n - 1 ? C.amber : C.green, { t: i === n - 1 ? 0 : 15 * (n - 1 - i), name: 'Progress' });
          t.text(s, `${Math.round(((i + 1) / n) * 100)}%`, { x, y: 1.55, w: cw, h: 0.42, fontSize: 13, bold: true, color: C.bg, align: 'center', valign: 'middle' });
          txt(s, st.h, x + 0.06, 2.1, cw - 0.2, 0.6, { bold: true, color: C.green, max: 14, min: 10, valign: 'middle' });
          txt(s, st.t, x + 0.06, 2.72, cw - 0.2, 2.25, { max: 11.5, min: 9 });
          if (i) t.line(s, x, 2.1, 0, 2.85, C.border, 1);
        });
      },
      async (d) => { // highlighted selection: green blocks, the path turning back
        const s = page(d), n = d.steps.length, w = 4.2, h = 1.6;
        d.steps.forEach((st, i) => {
          const wide = n === 3 && i === 2, ww = wide ? 8.6 : w, x = wide ? 0.7 : 0.7 + (i < 2 ? i : 3 - i) * (w + 0.2), y = 1.52 + (i < 2 ? 0 : h + 0.2), on = i % 2 === 0;
          t.rect(s, x, y, ww, h, on ? C.green : C.panel, { line: { color: C.green, width: 1 }, name: 'Block' });
          txt(s, `${i + 1}. ${st.h}`, x + 0.15, y + 0.08, ww - 0.3, 0.38, { bold: true, color: on ? C.bg : C.green, max: 14, min: 10, valign: 'middle' });
          txt(s, st.t, x + 0.15, y + 0.48, ww - 0.3, h - 0.54, { color: on ? C.bg : C.text, max: 11.5, min: 9 });
        });
        if (n === 4) { t.text(s, '↓', { x: 8.0, y: 3.09, w: 0.5, h: 0.24, fontSize: 13, bold: true, color: C.green, align: 'center', valign: 'middle' }); }
      },
    ],
    stats: [
      async (d) => { // one number on a green block, the rest as comments beside it
        const s = page(d), [a, ...rest] = d.stats;
        t.rect(s, 0.7, 1.55, 4.1, 3.4, C.green, { name: 'Block' });
        t.text(s, a.value, { x: 0.85, y: 1.8, w: 3.8, h: 1.4, bold: true, color: C.bg, valign: 'middle', fontSize: L.fit(a.value, 3.8, 1.3, 54, 22, M, true) });
        txt(s, a.label, 0.9, 3.3, 3.7, 1.5, { color: C.bg, max: 14 });
        rest.forEach((x, i) => {
          const y = 1.55 + i * 1.12;
          t.text(s, x.value, { x: 5.05, y, w: 4.25, h: 0.52, bold: true, color: C.amber, valign: 'middle', fontSize: L.fit(x.value, 4.25, 0.5, 28, 16, M, true) });
          txt(s, '// ' + x.label, 5.05, y + 0.52, 4.25, 0.55, { color: C.gray, max: 11.5, min: 9 });
        });
        if (d.note) txt(s, '# ' + d.note, 5.05, 3.82, 4.25, 1.15, { color: C.gray, max: 10.5, min: 8.5 });
      },
      async (d) => { // `top`: a table of readings
        const s = page(d), rh = d.note ? 0.82 : 1.05;
        bar(s, 0.7, 1.52, 8.6, 'VALUE          METRIC', C.bar, C.gray);
        d.stats.forEach((x, i) => {
          const y = 1.88 + i * rh;
          t.text(s, x.value, { x: 0.8, y, w: 2.9, h: rh - 0.08, bold: true, color: C.green, valign: 'middle', fontSize: L.fit(x.value, 2.8, rh - 0.12, 32, 16, M, true) });
          txt(s, x.label, 3.85, y, 5.4, rh - 0.08, { valign: 'middle', max: 14 });
          t.line(s, 0.7, y + rh - 0.04, 8.6, 0, C.border, 1);
        });
        if (d.note) txt(s, '# ' + d.note, 0.7, 4.38, 8.6, 0.65, { color: C.gray, max: 10.5, min: 8.5 });
      },
    ],
    compare: [
      async (d) => { // a real diff: minus lines, then plus lines
        const s = page(d), n = d.left.items.length + d.right.items.length, h = Math.min(0.4, 2.85 / n);
        t.text(s, `--- ${d.left.h}`, { x: 0.7, y: 1.5, w: 8.6, h: 0.25, fontSize: 11, bold: true, color: C.red, valign: 'middle' });
        t.text(s, `+++ ${d.right.h}`, { x: 0.7, y: 1.75, w: 8.6, h: 0.25, fontSize: 11, bold: true, color: C.green, valign: 'middle' });
        let y = 2.08;
        [[d.left, C.red, '-'], [d.right, C.green, '+']].forEach(([side, col, sign]) => side.items.forEach((it) => {
          t.rect(s, 0.7, y, 8.6, h - 0.03, col, { t: 85, name: 'Diff line' });
          t.text(s, sign, { x: 0.78, y, w: 0.25, h: h - 0.03, fontSize: 13, bold: true, color: col, valign: 'middle' });
          txt(s, it, 1.08, y, 8.15, h - 0.03, { max: 12, min: 8.5, valign: 'middle' });
          y += h;
        }));
      },
      async (d) => { // two windows of their own
        const s = page(d), w = 4.22;
        for (const [i, side] of [d.left, d.right].entries()) {
          const x = 0.7 + i * (w + 0.16), n = side.items.length, y0 = 2.45, rh = 2.5 / n;
          win(s, x, 1.52, w, 3.5, `${slug(side.h)}.txt`);
          txt(s, side.h, x + 0.18, 1.96, w - 0.36, 0.42, { bold: true, color: i ? C.green : C.amber, max: 15, min: 10, valign: 'middle' });
          side.items.forEach((it, k) => { t.text(s, `${k + 1}`, { x: x + 0.18, y: y0 + k * rh, w: 0.25, h: 0.25, fontSize: 11, color: C.dim }); txt(s, it, x + 0.46, y0 + k * rh, w - 0.62, rh - 0.05, { max: 12, min: 9 }); });
        }
      },
    ],
    statement: [
      async (d) => { // the selection: black words on green, the note in the same block
        const s = page(d);
        t.rect(s, 0.43, 1.45, 9.14, 3.8, C.green, { name: 'Selection' });
        t.text(s, L.runs(d.text), { x: 0.8, y: 1.55, w: 8.4, h: 2.15, bold: true, color: C.bg, valign: 'middle', fontSize: L.fit(d.text, 8.4, 2.1, 30, 15, M, true) });
        t.rect(s, 0.8, 3.75, 2.0, 0.04, C.bg, { name: 'Rule' });
        if (d.caption) txt(s, d.caption, 0.8, 3.86, 8.4, 1.3, { color: C.bg, max: 12, min: 9 });
      },
      async (d) => { // a warning: amber edge, the note in a pane of its own
        const s = page(d);
        t.rect(s, 0.7, 1.55, 0.1, 3.4, C.amber, { name: 'Edge' });
        t.text(s, '! NOTE', { x: 0.98, y: 1.55, w: 3, h: 0.32, fontSize: 12, bold: true, color: C.amber });
        t.text(s, L.runs(d.text), { x: 0.98, y: 1.9, w: 5.0, h: 3.05, bold: true, color: C.text, valign: 'middle', fontSize: L.fit(d.text, 5.0, 3.0, 26, 13, M, true) });
        if (d.caption) { t.rect(s, 6.2, 1.55, 3.1, 3.4, C.panel, { line: { color: C.border, width: 1 }, name: 'Pane' }); txt(s, d.caption, 6.35, 1.68, 2.8, 3.15, { color: C.gray, max: 12, min: 8.5, valign: 'middle' }); }
      },
    ],
    timeline: [
      async (d) => { // commits on one branch, left to right
        const s = page(d), n = d.items.length, cw = 8.6 / n, ly = 1.78;
        t.line(s, 0.7, ly, 8.6, 0, C.green, 2);
        d.items.forEach((it, i) => {
          const x = 0.7 + i * cw;
          t.oval(s, x, ly - 0.12, 0.24, 0.24, i === n - 1 ? C.green : C.bg, { line: { color: C.green, width: 2 } });
          t.text(s, it.year, { x, y: 2.0, w: cw - 0.14, h: 0.34, bold: true, color: C.bg, fill: { color: C.amber }, fontSize: L.fit(it.year, cw - 0.24, 0.3, 14, 8, M, true), align: 'center', valign: 'middle' });
          txt(s, it.h, x, 2.42, cw - 0.14, 0.5, { bold: true, color: C.green, max: 13, min: 10, valign: 'middle' });
          txt(s, it.t, x, 2.94, cw - 0.14, 2.05, { max: 11, min: 9 });
        });
      },
      async (d) => { // a schedule, year big in each cell
        const s = page(d), w = 4.22, h = 1.68;
        d.items.forEach((it, i) => {
          const x = 0.7 + (i % 2) * (w + 0.16), y = 1.52 + Math.floor(i / 2) * (h + 0.1);
          t.rect(s, x, y, 1.3, h, C.bar, { name: 'Year' });
          t.text(s, it.year, { x: x + 0.05, y, w: 1.2, h, bold: true, color: C.amber, align: 'center', valign: 'middle', fontSize: L.fit(it.year, 1.15, h - 0.2, 20, 9, M, true) });
          t.rect(s, x + 1.3, y, w - 1.3, h, null, { line: { color: C.border, width: 1 }, name: 'Cell' });
          txt(s, it.h, x + 1.42, y + 0.06, w - 1.54, 0.34, { bold: true, color: C.green, max: 12, min: 9.5, valign: 'middle' });
          txt(s, it.t, x + 1.42, y + 0.42, w - 1.54, h - 0.46, { max: 11, min: 8.5 });
        });
      },
    ],
  };
  R.image = V.image.shift(); // the first picture page must not mirror the introduction
  const draw = L.pages(R, V);
  for (const d of content.slides) await draw(d);
  L.stamp(SL, content, () => ({ x: 0.35, y: 5.34, w: 9.3, h: 0.2, color: C.gray, fontFace: 'Courier New', fontSize: 7.5, align: 'center' }));
  return L.save(pres, out, { name: 'SlideAI Terminal', colors: { dk1: C.bg, lt1: C.text, dk2: C.panel, lt2: C.gray, accent1: C.green, accent2: C.amber, accent3: C.red, accent4: C.dim, accent5: C.gray, accent6: C.border, hlink: C.green, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "texnik va lo'nda: dasturchi uslubida aniq", "limits": {"card_t4": 60, "step_t": 70}};
module.exports = { id: 16, slug: 'terminal', name: 'Terminal', category: 'minimalist', build, style: STYLE };
