/**
 * skin.js — shared skeleton for templates 71+.
 * The skeleton owns the LAYOUT of the 13 slide types (with auto-fit text, compare rows that fit,
 * the meta line on every slide). A template supplies its LOOK through a "skin":
 *   F, C (ink, muted, accent, pal[])        fonts and colours
 *   bg(ctx, s, kind)                        background; kind = 'hero' | 'page' | 'focus'
 *   title(ctx, s, d)                        page title + slide number
 *   footer(ctx, s, kind)                    meta line (topic, author, org, city, year)
 *   panel(ctx, s, x, y, w, h, k, o)         a container (card, note, chip, tile…)
 *   marker(ctx, s, x, y, d, k, label)       a numbered marker
 *   photo(ctx, s, src, x, y, w, h, k)       a framed photo
 *   hero(ctx, d, kind, newSlide)            cover / closing (each template designs its own)
 * optional: onPanel(k) / subPanel(k) text colours on panel k, onBg / onBgMuted for text drawn on the background, area, pad, caps, layout variants
 *   (agenda: twoCol|list|grid, cards: columns|rows, process: row|panels|list, stats: tiles|markers,
 *    timeline: line|columns|table), axis(ctx,s,x,y,w), bullet(ctx,s,x,y,k), and per-type overrides R.
 */
const L = require('./lib.js');
const { W, H } = L;

async function run(content, out, K) {
  const pres = L.deck(K.F, content.slides[0].title);
  const t = L.tools(pres, K.F, K.C);
  const M = content.meta || {};
  const ctx = { pres, t, TR: L.tr(content), M, meta: L.metaLine(M), L, W, H, idx: 0, content, memo: {} };
  if (K.init) await K.init(ctx);
  const C = K.C, A = K.area || { x: 0.6, y: 1.4, w: 8.8, h: 3.6 }, pad = K.pad ?? 0.22, V = K.layout || {};
  const HF = K.F.head, BF = K.F.body;
  const BG = K.onBg || C.ink, BGm = K.onBgMuted || C.muted; // text drawn straight on the background
  const onP = (k) => (K.onPanel ? K.onPanel(k) : C.ink), subP = (k) => (K.subPanel ? K.subPanel(k) : C.muted);
  const caps = (x) => (K.caps ? String(x).toUpperCase() : String(x));
  const newSlide = async (kind) => { const s = pres.addSlide(); ctx.idx++; await K.bg(ctx, s, kind); return s; };
  const page = async (d, kind = 'page') => { const s = await newSlide(kind); if (d.title !== undefined) await K.title(ctx, s, d); await K.footer(ctx, s, kind); return s; };
  const panel = (s, x, y, w, h, k, o = {}) => K.panel(ctx, s, x, y, w, h, k, o);
  const marker = (s, x, y, d, k, label) => K.marker(ctx, s, x, y, d, k, label);
  const photo = (s, src, x, y, w, h, k) => K.photo(ctx, s, src, x, y, w, h, k);
  const bullet = (s, x, y, k) => (K.bullet ? K.bullet(ctx, s, x, y, k) : t.oval(s, x, y, 0.14, 0.14, C.accent));
  const para = (s, txt, x, y, w, h, color = C.ink) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, BF, false, 1.3), color, lineSpacingMultiple: 1.3, valign: 'middle' });
  const head = (s, txt, x, y, w, h, color, max = 17, align) => t.text(s, caps(txt), { x, y, w, h, fontFace: HF, fontSize: L.fit(caps(txt), w, h, max, 10, HF, true), bold: true, color, valign: 'middle', ...(align ? { align } : {}) });
  const textSide = async (s, d, x, w, k) => {
    if (K.textPanel === false) return para(s, d.text, x, A.y, w, A.h);
    await panel(s, x, A.y, w, A.h, k, { text: true });
    para(s, d.text, x + pad, A.y + pad, w - 2 * pad, A.h - 2 * pad, onP(k));
  };

  const R = {
    cover: (d) => K.hero(ctx, d, 'cover', newSlide),
    closing: (d) => K.hero(ctx, d, 'closing', newSlide),
    async intro(d) { const s = await page(d), pw = 3.9; await photo(s, d.image, A.x, A.y + 0.05, pw, A.h - 0.1, 0); await textSide(s, d, A.x + pw + 0.35, A.w - pw - 0.35, 1); },
    async image(d) { const s = await page(d), pw = 3.9; await textSide(s, d, A.x, A.w - pw - 0.35, 2); await photo(s, d.image, A.x + A.w - pw, A.y + 0.05, pw, A.h - 0.1, 3); },
    async agenda(d) {
      const s = await page(d), n = d.items.length, v = V.agenda || 'twoCol';
      if (v === 'grid') {
        const cols = 3, rws = Math.ceil(n / cols), w = (A.w - 0.25 * (cols - 1)) / cols, h = (A.h - 0.2 * (rws - 1)) / rws;
        for (const [i, it] of d.items.entries()) {
          const x = A.x + (i % cols) * (w + 0.25), y = A.y + Math.floor(i / cols) * (h + 0.2);
          await panel(s, x, y, w, h, i); await marker(s, x + 0.15, y + (h - 0.55) / 2, 0.55, i, i + 1);
          head(s, it, x + 0.85, y + 0.1, w - 1.0, h - 0.2, onP(i), 16);
        }
      } else if (v === 'list') {
        const rh = Math.min(0.62, A.h / n);
        for (const [i, it] of d.items.entries()) { const y = A.y + i * rh; await marker(s, A.x, y + (rh - 0.46) / 2, 0.46, i, i + 1); head(s, it, A.x + 0.65, y, A.w - 0.7, rh, BG, 17); if (K.rule) K.rule(ctx, s, A.x + 0.65, y + rh - 0.03, A.w - 0.7); }
      } else {
        const per = Math.ceil(n / 2), rh = Math.min(1.1, A.h / per);
        for (const [i, it] of d.items.entries()) { const x = A.x + Math.floor(i / per) * (A.w / 2 + 0.05), y = A.y + (i % per) * rh; await marker(s, x, y, 0.6, i, i + 1); head(s, it, x + 0.78, y, A.w / 2 - 0.9, 0.6, BG, 16); }
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length;
      if ((V.cards || 'columns') === 'rows') {
        const gap = 0.12, h = (A.h - gap * (n - 1)) / n;
        for (const [i, it] of d.items.entries()) {
          const y = A.y + i * (h + gap);
          await panel(s, A.x, y, A.w, h, i);
          t.img(s, await L.icon(it.icon, onP(i), 2), A.x + pad, y + h / 2 - 0.18, 0.36, 0.36);
          head(s, it.h, A.x + pad + 0.5, y + 0.05, 2.2, h - 0.1, onP(i), 15);
          t.text(s, it.t, { x: A.x + pad + 2.85, y: y + 0.05, w: A.w - pad * 2 - 2.85, h: h - 0.1, fontSize: 13, color: subP(i), valign: 'middle' });
        }
        return;
      }
      const gap = 0.22, w = (A.w - gap * (n - 1)) / n;
      for (const [i, it] of d.items.entries()) {
        const x = A.x + i * (w + gap);
        await panel(s, x, A.y, w, A.h, i);
        t.img(s, await L.icon(it.icon, K.iconColor ? K.iconColor(i) : onP(i), 2), x + pad, A.y + pad, 0.4, 0.4);
        head(s, it.h, x + pad, A.y + pad + 0.5, w - 2 * pad, 0.6, onP(i), 16);
        t.text(s, it.t, { x: x + pad, y: A.y + pad + 1.15, w: w - 2 * pad, h: A.h - 2 * pad - 1.15, fontSize: 14, color: subP(i) });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, v = V.process || 'row';
      if (v === 'list') {
        const rh = A.h / n;
        for (const [i, st] of d.steps.entries()) { const y = A.y + i * rh; await marker(s, A.x, y + 0.02, 0.5, i, i + 1); head(s, st.h, A.x + 0.7, y, 2.5, Math.min(0.6, rh - 0.05), BG, 15); t.text(s, st.t, { x: A.x + 3.35, y, w: A.w - 3.35, h: rh - 0.08, fontSize: 13, color: BGm, valign: 'top' }); if (K.rule && i < n - 1) K.rule(ctx, s, A.x, y + rh - 0.04, A.w); }
        return;
      }
      const cw = A.w / n;
      if (v === 'row' && K.connector) K.connector(ctx, s, A.x + 0.4, A.y + 0.38, cw * (n - 1));
      for (const [i, st] of d.steps.entries()) {
        const x = A.x + i * cw;
        if (v === 'panels') {
          await panel(s, x, A.y, cw - 0.18, A.h, i); await marker(s, x + pad, A.y + pad, 0.6, i, i + 1);
          head(s, st.h, x + pad, A.y + pad + 0.7, cw - 0.18 - 2 * pad, 0.6, onP(i), 15);
          t.text(s, st.t, { x: x + pad, y: A.y + pad + 1.35, w: cw - 0.18 - 2 * pad, h: A.h - 2 * pad - 1.35, fontSize: 13, color: subP(i) });
        } else {
          await marker(s, x, A.y, 0.76, i, i + 1);
          head(s, st.h, x, A.y + 0.95, cw - 0.22, 0.6, BG, 16);
          t.text(s, st.t, { x, y: A.y + 1.6, w: cw - 0.22, h: A.h - 1.6, fontSize: 14, color: BGm });
        }
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, gap = 0.3, w = (A.w - gap * (n - 1)) / n, bodyH = d.note ? A.h - 0.75 : A.h;
      for (const [i, x] of d.stats.entries()) {
        const px = A.x + i * (w + gap);
        if ((V.stats || 'tiles') === 'markers') {
          const dd = Math.min(1.9, w - 0.4, bodyH - 1.1); await marker(s, px + (w - dd) / 2, A.y, dd, i, '');
          t.text(s, x.value, { x: px + (w - dd) / 2 + dd * 0.12, y: A.y + dd * 0.15, w: dd * 0.76, h: dd * 0.7, fontFace: HF, fontSize: L.fit(x.value, dd * 0.72, dd * 0.5, 40, 14, HF, true), bold: true, color: K.markerText ? K.markerText(i) : onP(i), align: 'center', valign: 'middle' });
          t.text(s, x.label, { x: px, y: A.y + dd + 0.1, w, h: bodyH - dd - 0.1, fontSize: 13, color: BG, align: 'center' });
        } else {
          await panel(s, px, A.y, w, bodyH, i);
          t.text(s, x.value, { x: px + pad, y: A.y + pad, w: w - 2 * pad, h: bodyH * 0.5, fontFace: HF, fontSize: L.fit(x.value, w - 2 * pad, bodyH * 0.45, 52, 20, HF, true), bold: true, color: K.valueColor ? K.valueColor(i) : onP(i), align: 'center', valign: 'middle' });
          t.text(s, x.label, { x: px + pad, y: A.y + pad + bodyH * 0.5, w: w - 2 * pad, h: bodyH * 0.5 - 2 * pad, fontSize: 13, color: subP(i), align: 'center' });
        }
      }
      if (d.note) t.text(s, d.note, { x: A.x, y: A.y + A.h - 0.65, w: A.w, h: 0.65, fontSize: 11, color: BGm, valign: 'middle' });
    },
    async compare(d) {
      const s = await page(d), w = (A.w - 0.3) / 2, top = A.y + 0.8;
      const { rows, fs } = L.rowsFit([d.left.items, d.right.items], 14, w - 2 * pad - 0.35, BF, 0.18, A.y + A.h - pad - top);
      for (const [i, side] of [d.left, d.right].entries()) {
        const x = A.x + i * (w + 0.3), k = i ? 1 : 0;
        await panel(s, x, A.y, w, A.h, k, { compare: true });
        head(s, side.h, x + pad, A.y + 0.15, w - 2 * pad, 0.55, K.compareHead ? K.compareHead(i) : onP(k), 18);
        let y = top;
        for (const [j, it] of side.items.entries()) { await bullet(s, x + pad, y + 0.08, k); t.text(s, it, { x: x + pad + 0.32, y, w: w - 2 * pad - 0.35, h: rows[j], fontSize: fs, color: onP(k) }); y += rows[j]; }
      }
    },
    async statement(d) {
      const s = await page(d, 'focus');
      await panel(s, A.x + 0.3, A.y, A.w - 0.6, 2.35, 2, { big: true });
      t.text(s, L.runs(d.text), { x: A.x + 0.6, y: A.y + 0.1, w: A.w - 1.2, h: 2.15, fontFace: HF, bold: true, fontSize: L.fit(d.text, A.w - 1.2, 2.05, 34, 16, HF, true), color: onP(2), align: 'center', valign: 'middle' });
      if (d.caption) t.text(s, d.caption, { x: A.x + 0.3, y: A.y + 2.5, w: A.w - 0.6, h: A.h - 2.5, fontSize: 13, color: BGm, align: 'center', valign: 'middle' });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, v = V.timeline || 'line', cw = A.w / n;
      if (v === 'table') {
        const rh = A.h / n;
        for (const [i, it] of d.items.entries()) { const y = A.y + i * rh; await panel(s, A.x, y + 0.04, 1.5, rh - 0.08, i); head(s, it.year, A.x + 0.1, y + 0.04, 1.3, rh - 0.08, onP(i), 18, 'center'); head(s, it.h, A.x + 1.7, y + 0.04, 2.3, rh - 0.08, BG, 15); t.text(s, it.t, { x: A.x + 4.1, y: y + 0.04, w: A.w - 4.1, h: rh - 0.08, fontSize: 13, color: BGm, valign: 'middle' }); }
        return;
      }
      if (v === 'line' && K.axis) K.axis(ctx, s, A.x, A.y + 0.85, A.w);
      for (const [i, it] of d.items.entries()) {
        const x = A.x + i * cw;
        if (v === 'columns') {
          await panel(s, x, A.y, cw - 0.18, A.h, i);
          head(s, it.year, x + pad, A.y + pad, cw - 0.18 - 2 * pad, 0.55, onP(i), 22);
          head(s, it.h, x + pad, A.y + pad + 0.65, cw - 0.18 - 2 * pad, 0.5, onP(i), 15);
          t.text(s, it.t, { x: x + pad, y: A.y + pad + 1.2, w: cw - 0.18 - 2 * pad, h: A.h - 2 * pad - 1.2, fontSize: 13, color: subP(i) });
        } else {
          head(s, it.year, x, A.y, cw - 0.2, 0.6, C.accent, 24);
          await marker(s, x, A.y + 0.68, 0.34, i, '');
          head(s, it.h, x, A.y + 1.15, cw - 0.25, 0.5, BG, 15);
          t.text(s, it.t, { x, y: A.y + 1.7, w: cw - 0.25, h: A.h - 1.7, fontSize: 13, color: BGm });
        }
      }
    },
    async quote(d) {
      const s = await page({ title: undefined }, 'focus');
      await panel(s, A.x + 0.4, A.y - 0.3, A.w - 0.8, 3.0, 3, { big: true });
      t.text(s, `\u201C${d.text}\u201D`, { x: A.x + 0.8, y: A.y - 0.15, w: A.w - 1.6, h: 2.2, fontFace: HF, italic: true, bold: true, fontSize: L.fit(d.text, A.w - 1.6, 2.1, 30, 15, HF, true, 1, true), color: onP(3), align: 'center', valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: A.x + 0.8, y: A.y + 2.1, w: A.w - 1.6, h: 0.45, fontSize: 14, bold: true, color: K.authorColor || subP(3), align: 'center' });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.6, A.h / n);
      for (const [i, it] of d.items.entries()) { const y = A.y + i * rh; await marker(s, A.x, y + (rh - 0.36) / 2, 0.36, i, i + 1); t.text(s, it, { x: A.x + 0.55, y, w: A.w - 0.55, h: rh, fontSize: 13, color: BG, valign: 'middle' }); }
    },
  };
  if (K.R) for (const [k, f] of Object.entries(K.R)) R[k] = (d) => f(ctx, d, { page, newSlide, panel, marker, photo, head, para, A, pad, onP, subP });
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, K.theme);
}

/** footer helper most skins use: one line with topic and meta */
const metaFooter = (o = {}) => (ctx, s) => ctx.t.text(s, `${ctx.M.topic || ''}   ${o.sep || '\u2022'}   ${ctx.meta}`, { x: o.x ?? 0.6, y: o.y ?? 5.25, w: o.w ?? 8.8, h: 0.22, fontSize: o.size ?? 8.5, color: o.color, align: o.align || 'left', fontFace: o.font });
/** theme colours block for pptx */
const theme = (name, C, p) => ({ name: 'SlideAI ' + name, colors: { dk1: C.ink, lt1: 'FFFFFF', dk2: p[4] || C.ink, lt2: C.bg || 'F5F5F5', accent1: p[0], accent2: p[1], accent3: p[2], accent4: p[3], accent5: p[4] || p[0], accent6: p[5] || p[1], hlink: p[0], folHlink: C.muted } });
const svgOnce = async (ctx, key, svg, w, h, bg = false) => (ctx.memo[key] ??= await ctx.L.svg(svg, w, h, bg));
module.exports = { run, metaFooter, theme, svgOnce };
