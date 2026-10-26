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
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 14, w - 0.6, M) : 0))) + 0.12);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.7 + i * (w + 0.2), col = i ? C.green : C.amber, sign = '>';
        t.text(s, `### ${side.h}`, { x, y, w, h: 0.45, fontSize: 16, bold: true, color: col });
        let yy = y + 0.6;
        side.items.forEach((it, k) => {
          t.rect(s, x, yy, w, rows[k], col, { t: 88, name: 'Diff line' });
          t.text(s, sign, { x: x + 0.12, y: yy + 0.06, w: 0.3, h: 0.3, fontSize: 14, bold: true, color: col });
          t.text(s, it, { x: x + 0.45, y: yy + 0.06, w: w - 0.6, h: rows[k] - 0.06, fontSize: 14, color: C.text });
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
  for (const d of content.slides) await R[d.type](d);
  L.stamp(SL, content, () => ({ x: 0.35, y: 5.34, w: 9.3, h: 0.2, color: C.gray, fontFace: 'Courier New', fontSize: 7.5, align: 'center' }));
  return L.save(pres, out, { name: 'SlideAI Terminal', colors: { dk1: C.bg, lt1: C.text, dk2: C.panel, lt2: C.gray, accent1: C.green, accent2: C.amber, accent3: C.red, accent4: C.dim, accent5: C.gray, accent6: C.border, hlink: C.green, folHlink: C.gray } });
}
/** Uslub pasporti: AI shu shablon uchun matnni qanday ohang va uzunlikda yozishi kerak. */
const STYLE = {"tone": "texnik va lo'nda: dasturchi uslubida aniq", "limits": {"card_t4": 60, "step_t": 70}};
module.exports = { id: 16, slug: 'terminal', name: 'Terminal', category: 'minimalist', build, style: STYLE };
