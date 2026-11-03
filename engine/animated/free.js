/**
 * free.js — small toolkit for templates 101+ (NO shared layout: every template composes its own slides).
 * Gives: slide(), txt()/head() with fitting, photo(), foot() meta line, rowsFit re-export.
 */
const L = require('./lib.js');
function kit(content, F, C) {
  const pres = L.deck(F, content.slides[0].title), t = L.tools(pres, F, C), M = content.meta || {};
  const k = {
    pres, t, L, M, F, C, TR: L.tr(content), meta: L.metaLine(M), n: content.slides.length, idx: 0, memo: {},
    org3: [M.org, M.loc, M.year].filter(Boolean).join('  \u2022  '),
    slide(bg) { const s = pres.addSlide(); k.idx++; if (typeof bg === 'string') s.background = { color: bg }; else if (bg) s.background = bg; return s; },
    txt(s, text, x, y, w, h, o = {}) {
      const font = o.font || F.body, ls = o.ls || 1.25;
      t.text(s, text, { x, y, w, h, fontFace: font, bold: !!o.bold, italic: !!o.italic, color: o.color || C.ink, valign: o.valign || 'top', lineSpacingMultiple: ls,
        fontSize: o.size ?? L.fit(Array.isArray(text) ? text.map((r) => r.text).join('') : String(text), w, h, o.max || 15, o.min || 10, font, !!o.bold, ls, !!o.italic),
        ...(o.align ? { align: o.align } : {}), ...(o.rotate ? { rotate: o.rotate } : {}), ...(o.spacing ? { charSpacing: o.spacing } : {}) });
    },
    head(s, text, x, y, w, h, o = {}) { k.txt(s, text, x, y, w, h, { max: 28, min: 13, font: F.head, bold: true, valign: 'middle', ls: 1.05, ...o }); },
    async photo(s, src, x, y, w, h, o = {}) { t.img(s, await L.photo(L.src(src), w, h, o), x, y, w, h, { alt: '' }); },
    async svg(key, svg, w, h, bg = false) { return (k.memo[key] ??= await L.svg(svg, w, h, bg)); },
    foot(s, o = {}) {
      // one line: topic • author | org, place, year. When it is too long for a narrow footer: a slightly smaller size
      // first, then only the author, and only then the topic is shortened ("…"), so it never shrinks to a word or two
      const w = o.w ?? 8.8, fs0 = o.size || 8.5, font = o.font || F.body, dot = `   ${o.sep || '\u2022'}   `;
      const topic0 = M.topic || '', fits = (str, f) => L.width(str, f, font) <= w * 0.97; // the whole line, its runs of spaces too
      let fs = fs0, tail = k.meta ? dot + k.meta : '', topic = topic0;
      if (!fits(topic + tail, fs)) {
        const small = Math.max(6, fs0 * 0.85);
        if (fits(topic + tail, small)) fs = small;
        else {
          fs = small;
          tail = M.author ? dot + M.author : '';
          if (!fits(topic + tail, fs)) topic = L.clip(topic, Math.max(0.5, w * 0.97 - L.width(tail, fs, font)), 0.2, fs, font);
        }
      }
      t.text(s, `${topic}${tail}`, { x: o.x ?? 0.6, y: o.y ?? 5.27, w, h: 0.22, fontSize: fs, color: o.color || C.muted, align: o.align || 'left', fontFace: font, ...(o.rotate ? { rotate: o.rotate } : {}) });
    },
    async icon(name, color, sw = 2) { return L.icon(name, color, sw); },
  };
  return k;
}
module.exports = { kit, L, rowsFit: L.rowsFit };
