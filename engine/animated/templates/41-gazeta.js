/**
 * 41 Gazeta — broadsheet newspaper: masthead, double rules, headline type, justified
 * columns separated by hairlines, newsprint (grayscale halftone) photos with captions.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { paper: 'F3F0E8', ink: '141414', gray: '555555', rule: '1E1E1E', hair: 'B9B3A6', red: 'A3121E' };
const F = { head: 'Times New Roman', body: 'Times New Roman' };

/** split a paragraph into n roughly equal columns at word boundaries */
const columns = (text, n) => {
  const words = String(text).split(/\s+/), per = Math.ceil(text.length / n), out = [];
  let cur = '';
  for (const w of words) { if ((cur + ' ' + w).length > per && out.length < n - 1 && cur) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }
  out.push(cur); return out;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const TR = L.tr(content);
  const M = content.meta || {}, meta = L.metaLine(M);
  const dbl = (s, y, x = 0.5, w = 9.0) => { t.line(s, x, y, w, 0, C.rule, 2.25); t.line(s, x, y + 0.06, w, 0, C.rule, 0.5); };
  const news = async (s, src, x, y, w, h, cap) => {
    t.img(s, await L.photo(L.src(src), w, h, { news: true }), x, y, w, h, { alt: '' });
    if (cap) t.text(s, cap, { x, y: y + h + 0.04, w, h: 0.26, fontSize: 9, italic: true, color: C.gray });
  };
  const cols = (s, txt, x, y, w, h, n, size) => { // justified columns with hairlines between
    const parts = columns(txt, n), gap = 0.22, cw = (w - gap * (n - 1)) / n;
    const fs = size || Math.min(...parts.map((p) => L.fit(p, cw, h, 14, 10, F.body, false, 1.15)));
    parts.forEach((p, k) => {
      const runs = k === 0 ? [{ text: p[0], options: { fontSize: fs * 2.4, bold: true } }, { text: p.slice(1) }] : [{ text: p }];
      t.text(s, runs, { x: x + k * (cw + gap), y, w: cw, h, fontSize: fs, color: C.ink, align: 'justify', valign: 'top', lineSpacingMultiple: 1.15 });
      if (k) t.line(s, x + k * (cw + gap) - gap / 2, y, 0, h, C.hair, 0.5);
    });
  };
  let idx = 0;
  const page = (d) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    t.text(s, (M.topic || '').toUpperCase(), { x: 0.5, y: 0.22, w: 5.0, h: 0.25, fontSize: 8.5, bold: true, color: C.ink, charSpacing: 1 });
    t.text(s, `${TR.no} ${idx}   \u2022   ${meta}`, { x: 4.5, y: 0.22, w: 5.0, h: 0.25, fontSize: 8.5, color: C.gray, align: 'right' });
    dbl(s, 0.5);
    if (d.title) t.text(s, d.title, { x: 0.5, y: 0.62, w: 9.0, h: 0.7, bold: true, color: C.ink, valign: 'middle', fontSize: L.fit(d.title, 9.0, 0.7, 32, 18, F.head, true) });
    t.line(s, 0.5, 5.25, 9.0, 0, C.rule, 0.75);
    return s;
  };

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { color: C.paper }; idx++;
    t.text(s, [M.loc, M.year].filter(Boolean).join(', '), { x: 0.5, y: 0.25, w: 3, h: 0.25, fontSize: 9, color: C.gray });
    t.text(s, `${TR.no} ${idx}`, { x: 6.5, y: 0.25, w: 3, h: 0.25, fontSize: 9, color: C.gray, align: 'right' });
    t.line(s, 0.5, 0.55, 9.0, 0, C.rule, 0.5);
    t.text(s, (M.org || M.topic || '').toUpperCase(), { x: 0.5, y: 0.6, w: 9.0, h: 0.8, fontSize: L.fit((M.org || M.topic || '').toUpperCase(), 8.6, 0.8, 46, 20, F.head, true), bold: true, color: C.ink, align: 'center', valign: 'middle', charSpacing: 4 });
    dbl(s, 1.45);
    const pw = d.image ? 3.6 : 0, tw = 9.0 - (pw ? pw + 0.35 : 0);
    if (d.image) await news(s, d.image, 5.9, 1.75, pw, 2.75, `${TR.caption}: ${M.loc || ''} ${M.year || ''}`.trim());
    const fs = L.fit(d.title, tw, 1.9, 44, 22, F.head, true);
    t.text(s, d.title, { x: 0.5, y: 1.7, w: tw, h: 2.0, bold: true, fontSize: fs, color: C.ink, valign: 'top' });
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.5, y: 3.8, w: tw, h: 0.7, italic: true, fontSize: 14, color: C.gray });
    t.text(s, [{ text: TR.by, options: { color: C.gray } }, { text: M.author || '', options: { bold: true, color: C.red } }], { x: 0.5, y: 4.6, w: tw, h: 0.35, fontSize: 12 });
    t.line(s, 0.5, 5.25, 9.0, 0, C.rule, 0.75);
    t.text(s, M.topic || '', { x: 0.5, y: 5.28, w: 9.0, h: 0.25, fontSize: 8, color: C.gray, align: 'center' });
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = page(d); await news(s, d.image, 0.5, 1.5, 4.1, 3.0, d.title); cols(s, d.text, 4.9, 1.5, 4.6, 3.6, 2); },
    async image(d) { const s = page(d); cols(s, d.text, 0.5, 1.5, 3.6, 3.6, 1); t.line(s, 4.3, 1.5, 0, 3.6, C.hair, 0.5); await news(s, d.image, 4.5, 1.5, 5.0, 3.2, d.title); },
    async agenda(d) {
      const s = page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(0.75, 3.5 / per);
      t.line(s, 5.0, 1.55, 0, rh * per, C.hair, 0.5);
      d.items.forEach((it, i) => {
        const x = 0.5 + Math.floor(i / per) * 4.7, y = 1.55 + (i % per) * rh;
        t.text(s, String(i + 1), { x, y, w: 0.5, h: rh, fontSize: 26, bold: true, color: C.red, valign: 'middle' });
        t.text(s, it, { x: x + 0.55, y, w: 3.75, h: rh, fontSize: 17, bold: true, color: C.ink, valign: 'middle' });
        t.line(s, x, y + rh, 4.3, 0, C.hair, 0.5);
      });
    },
    async cards(d) {
      const s = page(d), n = d.items.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      d.items.forEach((it, i) => {
        const x = 0.5 + i * (w + gap);
        if (i) t.line(s, x - gap / 2, 1.55, 0, 3.5, C.hair, 0.5);
        t.text(s, L.pad2(i + 1), { x, y: 1.5, w, h: 0.3, fontSize: 10, bold: true, color: C.red, charSpacing: 2 });
        t.text(s, it.h, { x, y: 1.82, w, h: 0.75, fontSize: L.fit(it.h, w, 0.75, 20, 13, F.head, true), bold: true, color: C.ink, valign: 'top' });
        t.text(s, it.t, { x, y: 2.65, w, h: 2.35, fontSize: 13, color: C.ink, align: 'justify', lineSpacingMultiple: 1.15 });
      });
    },
    async process(d) {
      const s = page(d), n = d.steps.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      d.steps.forEach((st, i) => {
        const x = 0.5 + i * (w + gap);
        if (i) t.line(s, x - gap / 2, 1.55, 0, 3.5, C.hair, 0.5);
        t.text(s, String(i + 1), { x, y: 1.4, w, h: 0.8, fontSize: 48, bold: true, color: C.ink });
        t.line(s, x, 2.25, w, 0, C.rule, 1.5);
        t.text(s, st.h, { x, y: 2.35, w, h: 0.5, fontSize: L.fit(st.h, w, 0.5, 17, 12, F.head, true), bold: true, color: C.ink });
        t.text(s, st.t, { x, y: 2.9, w, h: 2.1, fontSize: 13, color: C.ink, align: 'justify' });
      });
    },
    async stats(d) {
      const s = page(d), n = d.stats.length, gap = 0.3, w = (9.0 - gap * (n - 1)) / n;
      d.stats.forEach((x, i) => {
        const px = 0.5 + i * (w + gap);
        if (i) t.line(s, px - gap / 2, 1.6, 0, 2.6, C.hair, 0.5);
        t.text(s, x.value, { x: px, y: 1.55, w, h: 1.3, fontSize: L.fit(x.value, w, 1.2, 66, 30, F.head, true), bold: true, color: i === 0 ? C.red : C.ink, valign: 'middle' });
        t.text(s, x.label, { x: px, y: 2.95, w, h: 1.0, fontSize: 14, italic: true, color: C.gray });
      });
      if (d.note) { t.line(s, 0.5, 4.45, 9.0, 0, C.hair, 0.5); t.text(s, d.note, { x: 0.5, y: 4.5, w: 9.0, h: 0.5, fontSize: 10, color: C.gray }); }
    },
    async compare(d) {
      const s = page(d), w = 4.35;
      const { rows, fs: CFS } = L.rowsFit([d.left.items, d.right.items], 15, w - 0.35, F.body, 0.18, 4.85 - 2.15);
      t.line(s, 5.0, 1.5, 0, 3.55, C.hair, 0.5);
      [d.left, d.right].forEach((side, i) => {
        const x = 0.5 + i * (w + 0.3);
        t.rect(s, x, 1.5, w, 0.45, i ? C.ink : C.red, { name: 'Kicker' });
        t.text(s, side.h.toUpperCase(), { x: x + 0.15, y: 1.5, w: w - 0.3, h: 0.45, fontSize: 13, bold: true, color: 'FFFFFF', valign: 'middle', charSpacing: 1 });
        let y = 2.15;
        side.items.forEach((it, k) => { t.text(s, '\u25A0', { x, y, w: 0.25, h: 0.3, fontSize: 9, color: i ? C.ink : C.red }); t.text(s, it, { x: x + 0.3, y, w: w - 0.35, h: rows[k], fontSize: CFS, color: C.ink }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = page(d);
      dbl(s, 1.55, 1.0, 8.0);
      t.text(s, L.runs(d.text), { x: 1.0, y: 1.75, w: 8.0, h: 1.9, italic: true, bold: true, fontSize: L.fit(d.text, 8.0, 1.8, 36, 20, F.head, true, 1, true), color: C.ink, align: 'center', valign: 'middle' });
      dbl(s, 3.75, 1.0, 8.0);
      if (d.caption) t.text(s, d.caption, { x: 1.0, y: 3.95, w: 8.0, h: 1.1, fontSize: L.fit(d.caption, 8.0, 1.1, 14, 10, F.body), color: C.gray, align: 'center' });
    },
    async timeline(d) {
      const s = page(d), n = d.items.length, rh = 3.55 / n;
      d.items.forEach((it, i) => {
        const y = 1.5 + i * rh;
        t.text(s, it.year, { x: 0.5, y, w: 1.4, h: rh - 0.08, fontSize: L.fit(it.year, 1.4, 0.5, 24, 12, F.head, true), bold: true, color: C.red, valign: 'top' });
        t.text(s, [{ text: it.h + '. ', options: { bold: true } }, { text: it.t }], { x: 2.05, y, w: 7.45, h: rh - 0.08, fontSize: L.fit(it.h + '. ' + it.t, 7.45, rh - 0.1, 15, 10, F.body), color: C.ink, valign: 'top' });
        if (i < n - 1) t.line(s, 0.5, y + rh - 0.04, 9.0, 0, C.hair, 0.5);
      });
    },
    async quote(d) {
      const s = page({});
      t.text(s, '\u201C', { x: 0.5, y: 0.9, w: 1.2, h: 1.4, fontSize: 110, bold: true, color: C.red });
      t.text(s, d.text, { x: 1.6, y: 1.2, w: 7.6, h: 2.6, italic: true, fontSize: L.fit(d.text, 7.6, 2.5, 34, 18, F.head, false, 1, true), color: C.ink, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`.toUpperCase(), { x: 1.6, y: 3.95, w: 7.6, h: 0.35, fontSize: 11, bold: true, color: C.gray, charSpacing: 1 });
    },
    async sources(d) {
      const s = page(d), half = Math.ceil(d.items.length / 2), rh = Math.min(0.85, 3.5 / half);
      t.line(s, 5.0, 1.5, 0, rh * half, C.hair, 0.5);
      d.items.forEach((it, i) => {
        const x = 0.5 + Math.floor(i / half) * 4.7, y = 1.5 + (i % half) * rh;
        t.text(s, [{ text: `${i + 1}. `, options: { bold: true, color: C.red } }, { text: it, options: { color: C.ink } }], { x, y, w: 4.3, h: rh, fontSize: L.fit(it, 4.1, rh - 0.05, 13, 9, F.body), valign: 'top' });
      });
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Gazeta', colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: '333333', lt2: C.paper, accent1: C.red, accent2: C.ink, accent3: C.gray, accent4: C.hair, accent5: '7A7A7A', accent6: 'D8D2C4', hlink: C.red, folHlink: C.gray } });
}
/** Uslub pasporti */
const STYLE = { tone: "gazeta uslubi: sarlavhalar xabar kabi (kim, nima, qachon), matn faktlarga boy, betaraf va aniq", limits: {}, prefer: 'text' };
module.exports = { id: 41, slug: 'gazeta', name: 'Gazeta', category: 'academic', photos: true, build, style: STYLE };

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "elegant"], "transitions": ["blinds:v", "fade", "pull:l"], "cover": ["typeLetters", "fadeLetters"], "mark": "appear", "deco": "wipe:d", "sig": {"title": "typeLetters", "body": "wipe:d", "item": "blindsV", "image": "wipe:d", "number": "appear", "order": "seq", "stagger": 0.16}, "tempo": 1.0, "kenburns": false};
