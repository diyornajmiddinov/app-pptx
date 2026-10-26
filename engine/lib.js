/**
 * lib.js — low-level helpers shared by all templates (no layout decisions here):
 * text measuring, SVG -> image, icons, subscripts, saving.
 * Every template's look and layout lives in its own file under templates/.
 */
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const Fi = require('react-icons/fi');
let applyTheme = null;
try { ({ applyTheme } = require('/mnt/skills/public/pptx/scripts/apply_theme.js')); } catch { /* optional */ }

const W = 10, H = 5.625;

// ---------- real text metrics ----------
// Metric-compatible open fonts: same glyph widths as the Office fonts named in the deck,
// so wrapping computed here matches what PowerPoint does.
const opentype = require('opentype.js');
const fs_ = require('fs');
const LIB = '/usr/share/fonts/truetype/liberation/', CX = '/usr/share/fonts/truetype/crosextra/', TG = '/usr/share/texmf/fonts/opentype/public/tex-gyre/';
const FILES = {
  Arial: [LIB + 'LiberationSans-Regular.ttf', LIB + 'LiberationSans-Bold.ttf', LIB + 'LiberationSans-Italic.ttf'],
  Calibri: [CX + 'Carlito-Regular.ttf', CX + 'Carlito-Bold.ttf', CX + 'Carlito-Italic.ttf'],
  Cambria: [CX + 'Caladea-Regular.ttf', CX + 'Caladea-Bold.ttf', CX + 'Caladea-Italic.ttf'],
  'Times New Roman': [LIB + 'LiberationSerif-Regular.ttf', LIB + 'LiberationSerif-Bold.ttf', LIB + 'LiberationSerif-Italic.ttf'],
  'Courier New': [LIB + 'LiberationMono-Regular.ttf', LIB + 'LiberationMono-Bold.ttf', LIB + 'LiberationMono-Italic.ttf'],
  'Bookman Old Style': [TG + 'texgyrebonum-regular.otf', TG + 'texgyrebonum-bold.otf', TG + 'texgyrebonum-italic.otf'],
  'Century Schoolbook': [TG + 'texgyreschola-regular.otf', TG + 'texgyreschola-bold.otf', TG + 'texgyreschola-italic.otf'],
};
// Letters a metric font lacks (TeX Gyre has no Cyrillic, no Uzbek ʻ) are drawn by the system fallback font,
// DejaVu Sans, which is much wider: measure those letters with it, or the text overflows its box.
const DV = '/usr/share/fonts/truetype/dejavu/';
const FALLBACK = [DV + 'DejaVuSans.ttf', DV + 'DejaVuSans-Bold.ttf', DV + 'DejaVuSans.ttf'];
const cache = {};
function face(font, bold, italic) {
  const k = font + (bold ? 'b' : '') + (italic ? 'i' : '');
  if (!cache[k]) { const f = font === '#fallback' ? FALLBACK : FILES[font] || FILES.Arial; const p = bold ? f[1] : italic ? f[2] : f[0];
    if (!fs_.existsSync(p)) throw new Error(`Font metrics file missing: ${p}\nInstall: apt-get install fonts-liberation fonts-crosextra-carlito fonts-crosextra-caladea tex-gyre`);
    { const b = fs_.readFileSync(p); cache[k] = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); } }
  return cache[k];
}
const SAFETY = 1.04; // small margin so rounding never causes an extra wrap in PowerPoint
/** parts of the text: [string, face] — letters missing from the font go to the fallback face */
function split(text, font, bold, italic) {
  const main = face(font, bold, italic), parts = [];
  for (const ch of String(text)) {
    const f = ch === ' ' || main.charToGlyphIndex(ch) ? main : face('#fallback', bold, italic);
    const last = parts[parts.length - 1];
    if (last && last[1] === f) last[0] += ch; else parts.push([ch, f]);
  }
  return parts;
}
function width(text, fs, font, bold, italic) {
  return (split(text, font, bold, italic).reduce((sum, [t, f]) => sum + f.getAdvanceWidth(t, fs), 0) / 72) * SAFETY;
}
/** does the text need the fallback font anywhere? (its lines are taller) */
const needsFallback = (text, font) => split(text, font, false, false).some(([, f]) => f !== face(font, false, false));
function lines(text, fs, w, font, bold = false, italic = false) {
  let n = 0;
  for (const para of String(text).replace(/[\u2080-\u2089]/g, '0').split('\n')) {
    let cur = '';
    n++;
    for (const word of para.split(/[ \t\r]+/).filter(Boolean)) { // no-break spaces (\u00a0) keep words together
      const next = cur ? cur + ' ' + word : word;
      if (width(next, fs, font, bold, italic) <= w) cur = next;
      else if (!cur) { cur = word; } // a single word wider than the box (fit() prevents this)
      else { n++; cur = word; }
    }
  }
  return n;
}
function spacing(font) {
  const f = face(font, false, false), u = f.unitsPerEm, h = f.tables.hhea, o = f.tables.os2;
  return Math.max((h.ascender - h.descender + h.lineGap) / u, (o.usWinAscent + o.usWinDescent) / u) * 1.02;
}
const lh = (fs, k = 1, font = 'Arial') => (fs * spacing(font) * k) / 72;
// subscript runs (CO₂) make PowerPoint lines taller, so allow for that
const height = (text, fs, w, font, bold, k = 1, italic = false) => lines(text, fs, w, font, bold, italic)
  * Math.max(lh(fs, k, font), needsFallback(text, font) ? (fs * spacing('#fallback') * k) / 72 : 0)
  * (/[\u2080-\u2089]/.test(String(text)) ? 1.25 : 1);
/** largest size <= max where text fits w x h without breaking a word */
function fit(text, w, h, max, min, font, bold = false, k = 1, italic = false) {
  const words = String(text).replace(/[\u2080-\u2089]/g, '0').split(/[ \t\r\n]+/);
  for (let fs = max; fs > min; fs--) {
    if (words.some((x) => width(x, fs, font, bold, italic) > w)) continue;
    if (height(text, fs, w, font, bold, k, italic) <= h) return fs;
  }
  return min;
}

async function svg(svgText, w, h, jpeg = false) {
  const img = sharp(Buffer.from(svgText), { density: 96 }).resize(Math.round(w), Math.round(h));
  const buf = jpeg ? await img.jpeg({ quality: 90 }).toBuffer() : await img.png().toBuffer();
  return (jpeg ? 'image/jpeg;base64,' : 'image/png;base64,') + buf.toString('base64');
}

const iconCache = new Map();
async function icon(name, color, stroke = 2) {
  const k = name + color + stroke;
  if (!iconCache.has(k)) {
    const C = Fi[name] || Fi.FiCircle;
    const s = ReactDOMServer.renderToStaticMarkup(React.createElement(C, { size: 256, color: '#' + color, strokeWidth: stroke }));
    iconCache.set(k, 'image/png;base64,' + (await sharp(Buffer.from(s)).png().toBuffer()).toString('base64'));
  }
  return iconCache.get(k);
}

const SUB = '\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089';
/** "CO₂" -> runs with real subscript formatting */
function runs(text, base = {}) {
  const out = [];
  // keep numeric ranges like 5,7–7,4 on one line
  text = String(text).replace(/(\d)[\u2013-](\d)/g, '$1\u2011$2');
  for (const ch of String(text)) {
    const i = SUB.indexOf(ch), sub = i >= 0, c = sub ? String(i) : ch;
    const last = out[out.length - 1];
    if (last && !!last.options.subscript === sub) last.text += c;
    else out.push({ text: c, options: sub ? { ...base, subscript: true } : { ...base } });
  }
  return out;
}
const plain = (t) => String(t).replace(/[\u2080-\u2089]/g, (c) => SUB.indexOf(c));
const pad2 = (n) => String(n).padStart(2, '0');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

function deck(fonts, title) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'SlideAI';
  pres.title = title;
  pres.theme = { headFontFace: fonts.head, bodyFontFace: fonts.body };
  return pres;
}

/** small helper bound to a template's fonts/colours */
function tools(pres, F, C) {
  const S = pres.shapes;
  return {
    S,
    text(s, t, o) {
      const opt = { isTextBox: true, margin: 0, valign: 'top', fontFace: F.body, color: C.ink, fontSize: 14, ...o };
      // shared safety net for all 40 templates: text that does not fit its box shrinks (to 55% at most)
      // instead of spilling onto the line, picture or text below it
      if (typeof t === 'string' && opt.w && !opt.noShrink) t = hyphenate(t, opt.w, opt.fontSize * 0.8, opt.fontFace, !!opt.bold, !!opt.italic);
      const str = typeof t === 'string' ? t : Array.isArray(t) ? t.map((r) => r.text).join('') : null;
      if (str && opt.w && opt.h && !opt.noShrink && !opt.fit) {
        const fs = fit(str, opt.w, opt.h * 1.02, opt.fontSize, Math.max(7, opt.fontSize * 0.55), opt.fontFace, !!opt.bold, opt.lineSpacingMultiple || 1, !!opt.italic);
        opt._ofs = opt.fontSize; // remembered so sibling boxes can be given one size at save time (harmonize)
        if (fs < opt.fontSize) opt.fontSize = fs;
      }
      delete opt.noShrink;
      s.addText(t, opt);
    },
    rect(s, x, y, w, h, fill, o = {}) {
      const r = o.r || 0;
      s.addShape(r ? S.ROUNDED_RECTANGLE : S.RECTANGLE, {
        x, y, w, h, ...(r ? { rectRadius: r } : {}),
        fill: fill ? { color: fill, ...(o.t ? { transparency: o.t } : {}) } : { type: 'none' },
        line: o.line || { type: 'none' }, ...(o.shadow ? { shadow: { type: 'outer', color: o.shadowColor || '000000', opacity: o.shadow, blur: o.blur || 12, offset: o.offset ?? 3, angle: 90 } } : {}),
        objectName: o.name || 'Shape', ...(o.rotate ? { rotate: o.rotate } : {}),
      });
    },
    oval(s, x, y, w, h, fill, o = {}) { s.addShape(S.OVAL, { x, y, w, h, fill: fill ? { color: fill, ...(o.t ? { transparency: o.t } : {}) } : { type: 'none' }, line: o.line || { type: 'none' }, objectName: o.name || 'Circle' }); },
    line(s, x, y, w, h, color, width = 1, o = {}) { s.addShape(S.LINE, { x, y, w, h, line: { color, width, ...(o.dash ? { dashType: o.dash } : {}), ...(o.t ? { transparency: o.t } : {}) }, objectName: o.name || 'Line', ...(o.flipV ? { flipV: true } : {}) }); },
    shape(s, type, o) { s.addShape(S[type], { line: { type: 'none' }, ...o }); },
    img(s, data, x, y, w, h, o = {}) { s.addImage({ data, x, y, w, h, altText: o.alt || '', ...(o.sizing ? { sizing: o.sizing } : {}) }); },
  };
}

/** A word wider than the box even at 80% size is broken with a hyphen ("Персонализи-рованный"), so one long
 *  word does not shrink the whole text to a tiny size. Pieces are at least 4 letters. */
function hyphenate(text, w, fs, font, bold, italic) {
  return String(text).split('\n').map((para) => para.split(' ').map((word) => {
    if (word.length < 8 || width(word, fs, font, bold, italic) <= w) return word;
    const parts = []; let rest = word;
    while (rest.length > 0 && width(rest, fs, font, bold, italic) > w && rest.length >= 8) {
      let k = rest.length - 4;
      while (k > 4 && width(rest.slice(0, k) + '-', fs, font, bold, italic) > w) k--;
      parts.push(rest.slice(0, k) + '-'); rest = rest.slice(k);
    }
    return parts.concat(rest).join('\n');
  }).join(' ')).join('\n');
}

/** Boxes of one role on a slide (same row, same size, same requested font) share the smallest size any of them
 *  needed, so one long word does not leave one card in a row smaller than its neighbours. */
function harmonize(pres) {
  const r = (v) => Math.round((Number(v) || 0) * 20);
  for (const sl of pres._slides || []) {
    const groups = new Map();
    for (const o of sl._slideObjects || []) {
      const op = o.options || {};
      if (o._type !== 'text' || op._ofs == null) continue;
      const k = [r(op.w), r(op.h), op._ofs, !!op.bold, op.fontFace].join('|'); // not y: cards may sit at slightly different heights
      (groups.get(k) || groups.set(k, []).get(k)).push(op);
    }
    for (const g of groups.values()) {
      if (g.length < 2) continue;
      const min = Math.min(...g.map((op) => op.fontSize));
      g.forEach((op) => { op.fontSize = min; });
    }
    for (const o of sl._slideObjects || []) if (o.options) delete o.options._ofs;
  }
}

async function save(pres, outPath, theme) {
  harmonize(pres);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await pres.writeFile({ fileName: outPath });
  if (applyTheme && theme) await applyTheme(outPath, theme);
  return outPath;
}

/** text cut at a word with "…" so it fits w x h at size fs (footers: the full topic is on the title slide) */
function clip(text, w, h, fs, font, bold = false, italic = false) {
  let words = String(text).split(/[ \t\r\n]+/).filter(Boolean);
  const ok = (t) => height(t, fs, w, font, bold, 1, italic) <= h * 1.02 && !String(t).split(' ').some((x) => width(x, fs, font, bold, italic) > w);
  if (ok(words.join(' '))) return words.join(' ');
  while (words.length > 1) { words = words.slice(0, -1); const t = words.join(' ').replace(/[,;:.\-–—]+$/, '') + '…'; if (ok(t)) return t; }
  return words[0] || '';
}
/** compare slides: the largest size (max..min) at which both columns' items fit the panel's free height */
function colSize(d, w, avail, gap, font, max = 15, min = 10) {
  const n = Math.max(d.left.items.length, d.right.items.length);
  for (let fs = max; fs > min; fs -= 0.5) {
    let total = 0;
    for (let k = 0; k < n; k++) total += Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? height(sd.items[k], fs, w, font) : 0))) + gap;
    if (total - gap <= avail) return fs;
  }
  return min;
}
module.exports = { W, H, width, lines, lh, height, fit, clip, colSize, svg, icon, runs, plain, pad2, ROMAN, deck, tools, save };

// ======================================================================
// Photos: load from path / URL / data URI, crop to box ("cover"), optional
// effects (gray, duotone, newsprint, blur) and shape masks.
// ======================================================================
const _rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
async function loadImage(src) {
  if (Buffer.isBuffer(src)) return src;
  const s = String(src);
  if (s.startsWith('data:') || s.startsWith('image/')) return Buffer.from(s.split(',')[1], 'base64');
  if (/^https?:\/\//.test(s)) { const r = await fetch(s); if (!r.ok) throw new Error(`image ${s}: HTTP ${r.status}`); return Buffer.from(await r.arrayBuffer()); }
  return fs_.readFileSync(s);
}
function maskSvg(mask, W, H) {
  let d;
  if (mask === 'circle') return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><ellipse cx="${W / 2}" cy="${H / 2}" rx="${W / 2}" ry="${H / 2}" fill="#fff"/></svg>`;
  if (mask === 'hex') d = [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]];
  else if (mask.poly) d = mask.poly;
  if (d) return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><polygon points="${d.map(([x, y]) => `${x * W},${y * H}`).join(' ')}" fill="#fff"/></svg>`;
  if (mask.r) return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" rx="${mask.r * 150}" fill="#fff"/></svg>`;
  if (mask.path) return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 1 1" preserveAspectRatio="none"><path d="${mask.path}" fill="#fff"/></svg>`;
  throw new Error('unknown mask');
}
async function duotone(buf, dark, light) {
  const { data, info } = await sharp(buf).grayscale().raw().toBuffer({ resolveWithObject: true });
  const A = _rgb(dark), B = _rgb(light), out = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < info.width * info.height; i++) { const g = data[i * info.channels] / 255; for (let k = 0; k < 3; k++) out[i * 3 + k] = A[k] + (B[k] - A[k]) * g; }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toBuffer();
}
/** photo(src, w, h, { mask, gray, duo:[dark,light], news, blur, position }) -> data URI sized for w x h inches */
async function photo(src, w, h, o = {}) {
  const PX = 150, Wp = Math.round(w * PX), Hp = Math.round(h * PX);
  let buf = await sharp(await loadImage(src)).rotate().resize(Wp, Hp, { fit: 'cover', position: o.position || 'attention' }).toBuffer();
  if (o.gray || o.news) buf = await sharp(buf).grayscale().toBuffer();
  if (o.news) buf = await sharp(buf).linear(1.3, -25).sharpen().toBuffer();
  if (o.pixel) { const meta = await sharp(buf).metadata(); buf = await sharp(await sharp(buf).resize(o.pixel, Math.round(o.pixel * meta.height / meta.width), { kernel: 'nearest' }).toBuffer()).resize(meta.width, meta.height, { kernel: 'nearest' }).toBuffer(); }
  if (o.duo) buf = await duotone(buf, o.duo[0], o.duo[1]);
  if (o.blur) buf = await sharp(buf).blur(o.blur).toBuffer();
  if (o.mask) {
    buf = await sharp(buf).ensureAlpha().composite([{ input: Buffer.from(maskSvg(o.mask, Wp, Hp)), blend: 'dest-in' }]).png().toBuffer();
    return 'image/png;base64,' + buf.toString('base64');
  }
  return 'image/jpeg;base64,' + (await sharp(buf).jpeg({ quality: 84 }).toBuffer()).toString('base64');
}
/** vertical/horizontal transparent->colour gradient overlay (for text on photos) */
function scrim(color, from = 0, to = 0.85, dir = 'up') {
  const [x2, y2] = dir === 'up' ? [0, 0] : dir === 'right' ? [1, 0] : dir === 'left' ? [0, 0] : [0, 1];
  const [x1, y1] = dir === 'up' ? [0, 1] : dir === 'right' ? [0, 0] : dir === 'left' ? [1, 0] : [0, 0];
  return svg(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><defs><linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="#${color}" stop-opacity="${to}"/><stop offset="1" stop-color="#${color}" stop-opacity="${from}"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/></svg>`, 800, 450);
}
/** meta line used in footers: "Author | Org, City, Year" */
const metaLine = (m = {}) => [m.author, [m.org, m.loc, m.year].filter(Boolean).join(', ')].filter(Boolean).join('  |  ');
/** images in a slide (src string or {src}) */
const src = (img) => (img && typeof img === 'object' ? img.src : img);

module.exports.photo = photo;
module.exports.scrim = scrim;
module.exports.metaLine = metaLine;
module.exports.src = src;

// ======================================================================
// Rules shared by all 30 templates (each template decides WHERE and HOW):
//  - track(pres): remember slides in creation order (one slide per content item)
//  - stamp(list, content, place): put "topic | author | org, city, year" on every slide
//  - heroPhotos(R, list, spots): after cover/closing are drawn, place the photo
// ======================================================================
function track(pres) {
  const list = [], add = pres.addSlide.bind(pres);
  pres.addSlide = (...a) => { const s = add(...a); list.push(s); return s; };
  return list;
}
function stamp(list, content, place) {
  const M = content.meta; if (!M) return;
  const line = [M.topic, metaLine(M)].filter(Boolean).join('   |   ');
  list.forEach((s, i) => {
    const d = content.slides[i] || {}, o = place(d.type, s, d);
    if (!o) return;
    const { text, ...opt } = o;
    const fs = opt.fontSize || 8, font = opt.fontFace || 'Arial';
    let out = text || line;
    // a long topic must not push the line out of its box: shorten the topic part only ("…"), never author / org / year
    if (!text && opt.w && opt.h && M.topic) {
      const fits = (t) => height(t, fs, opt.w, font, !!opt.bold) <= opt.h * 1.05;
      if (!fits(out)) {
        const rest = metaLine(M), words = String(M.topic).split(/\s+/);
        out = rest;
        for (let k = words.length - 1; k >= 1; k--) {
          const cand = words.slice(0, k).join(' ').replace(/[,;:.\-–—]+$/, '') + '…   |   ' + rest;
          if (fits(cand)) { out = cand; break; }
        }
      }
    }
    s.addText(out, { isTextBox: true, margin: 0, valign: 'middle', fontSize: fs, fontFace: font, ...opt });
  });
}
function heroPhotos(R, list, spots) {
  for (const k of ['cover', 'closing']) {
    const orig = R[k], spot = spots[k];
    if (!orig || !spot) continue;
    R[k] = async (d) => { await orig(d); if (d.image) await spot(list[list.length - 1], d); };
  }
}
module.exports.track = track;
module.exports.stamp = stamp;
module.exports.heroPhotos = heroPhotos;

// ======================================================================
// Fixed labels printed by templates, in the presentation language (content.language)
// ======================================================================
const I18N = {
  uz: { by: 'Bajardi: ', topic: 'Mavzu:', no: 'No.', step: (n) => `${n}-bosqich`, chapter: (n) => `${n}-bob`, figure: (n) => `${n}-rasm. `,
    preface: 'Muqaddima', contents: 'Mundarija', references: 'Adabiyotlar', stop: (n) => `${n}-bekat`, scene: 'SAHNA', sheet: 'LIST',
    postcard: 'POSTCARD  \u2022  OTKRITKA', thanks: 'RAHMAT!', quote: 'iqtibos', indicator: "Ko'rsatkich", note: 'Izoh', qstep: (n) => `${n}-qadam` },
  ru: { by: 'Выполнил(а): ', topic: 'Тема:', no: '№', step: (n) => `Этап ${n}`, chapter: (n) => `Глава ${n}`, figure: (n) => `Рис. ${n}. `,
    preface: 'Введение', contents: 'Содержание', references: 'Литература', stop: (n) => `Станция ${n}`, scene: 'СЦЕНА', sheet: 'ЛИСТ',
    postcard: 'ПОЧТОВАЯ ОТКРЫТКА', thanks: 'СПАСИБО!', quote: 'цитата', indicator: 'Показатель', note: 'Пояснение', qstep: (n) => `Шаг ${n}` },
  en: { by: 'Prepared by: ', topic: 'Topic:', no: 'No.', step: (n) => `Step ${n}`, chapter: (n) => `Chapter ${n}`, figure: (n) => `Fig. ${n}. `,
    preface: 'Introduction', contents: 'Contents', references: 'References', stop: (n) => `Stop ${n}`, scene: 'SCENE', sheet: 'SHEET',
    postcard: 'POSTCARD', thanks: 'THANK YOU!', quote: 'quote', indicator: 'Indicator', note: 'Description', qstep: (n) => `Step ${n}` },
};
/** labels for the deck's language (falls back to Uzbek) */
module.exports.tr = (content) => I18N[(content && content.language) || 'uz'] || I18N.uz;
