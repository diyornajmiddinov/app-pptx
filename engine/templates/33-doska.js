/**
 * 33 Doska — classroom chalkboard: green slate with chalk dust, wooden frame and tray,
 * hand-drawn chalk underlines, circles and arrows, photos taped to the board.
 */
const L = require('../lib.js');
const { W, H } = L;

const C = { board: '2E4A3B', wood: '7A4E2A', wood2: '5A3820', chalk: 'F4F4EE', yellow: 'F6E27F', pink: 'F4A9A8', blue: 'A8D8F0', dust: 'C3CEC6', tape: 'E8DDB5' };
const F = { head: 'Bookman Old Style', body: 'Calibri' };

let seed = 11; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const wobble = (w, h, color, sw = 6) => { // hand-drawn horizontal chalk stroke
  let d = `M4,${h / 2}`; for (let x = 20; x <= w - 4; x += 20) d += ` L${x},${(h / 2 + (rnd() - 0.5) * h * 0.35).toFixed(1)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="none" stroke="#${color}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke-width="${sw}" stroke-opacity="0.85"/><path d="${d}" stroke-width="${sw * 0.5}" stroke-opacity="0.5" transform="translate(3 2)"/></g></svg>`;
};
const ring = (w, h, color) => { // hand-drawn ellipse that does not quite close
  let d = ''; const n = 40; for (let i = 0; i <= n + 3; i++) { const a = (i / n) * 2 * Math.PI - 0.4, rx = w / 2 - 8 + (rnd() - 0.5) * 6, ry = h / 2 - 8 + (rnd() - 0.5) * 6; d += (i ? ' L' : 'M') + `${(w / 2 + rx * Math.cos(a)).toFixed(1)},${(h / 2 + ry * Math.sin(a)).toFixed(1)}`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${d}" fill="none" stroke="#${color}" stroke-width="5" stroke-opacity="0.85" stroke-linecap="round"/></svg>`;
};
const arrow = (w, h, color) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="none" stroke="#${color}" stroke-width="5" stroke-linecap="round" stroke-opacity="0.85"><path d="M6,${h / 2} C${w * 0.35},${h * 0.3} ${w * 0.65},${h * 0.7} ${w - 10},${h / 2}"/><path d="M${w - 30},${h / 2 - 16} L${w - 8},${h / 2} L${w - 30},${h / 2 + 16}"/></g></svg>`;
const boardSvg = () => {
  // faint, soft-edged eraser marks kept inside the slate: hard-edged ovals read as a white veil over the text
  let smudge = ''; for (let i = 0; i < 6; i++) smudge += `<ellipse cx="${100 + rnd() * 1400}" cy="${100 + rnd() * 700}" rx="${150 + rnd() * 200}" ry="${40 + rnd() * 50}" fill="#FFFFFF" opacity="0.025"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0"/></filter>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter><clipPath id="slate"><rect x="26" y="26" width="1548" height="820"/></clipPath></defs>
  <rect width="1600" height="900" fill="#${C.wood}"/><rect x="26" y="26" width="1548" height="820" fill="#${C.board}"/><rect x="26" y="26" width="1548" height="820" filter="url(#n)"/><g clip-path="url(#slate)"><g filter="url(#soft)">${smudge}</g></g>
  <rect x="0" y="846" width="1600" height="54" fill="#${C.wood2}"/><rect x="260" y="852" width="90" height="16" rx="6" fill="#${C.chalk}"/><rect x="380" y="854" width="60" height="14" rx="6" fill="#${C.yellow}"/><rect x="1180" y="850" width="120" height="22" rx="4" fill="#9C8F7A"/></svg>`;
};

async function build(content, out) {
  const pres = L.deck(F, content.slides[0].title);
  const t = L.tools(pres, F, C);
  const M = content.meta || {}, meta = L.metaLine(M);
  const bg = await L.svg(boardSvg(), 1600, 900, true);
  const memo = {}; const img = async (k, svg, w, h) => (memo[k] ??= await L.svg(svg, w, h));
  const under = (s, x, y, w, color = C.yellow) => img('u' + w + color, wobble(Math.round(w * 100), 30, color), w * 100, 30).then((d) => t.img(s, d, x, y, w, 0.3));
  const circ = (s, x, y, w, h, color = C.chalk) => img(`r${w}${h}${color}`, ring(Math.round(w * 100), Math.round(h * 100), color), w * 100, h * 100).then((d) => t.img(s, d, x, y, w, h));
  const arr = (s, x, y, w, color = C.chalk) => img('a' + w + color, arrow(Math.round(w * 100), 60, color), w * 100, 60).then((d) => t.img(s, d, x, y, w, 0.6));
  const taped = async (s, src, x, y, w, h) => {
    t.rect(s, x, y, w, h, 'F7F7F2', { shadow: 0.35, blur: 8, offset: 3, name: 'Photo paper' });
    t.img(s, await L.photo(L.src(src), w - 0.2, h - 0.45), x + 0.1, y + 0.1, w - 0.2, h - 0.45, { alt: '' });
    t.rect(s, x - 0.15, y - 0.08, 0.9, 0.26, C.tape, { t: 25, rotate: -18, name: 'Tape' });
    t.rect(s, x + w - 0.75, y - 0.08, 0.9, 0.26, C.tape, { t: 25, rotate: 16, name: 'Tape' });
  };
  const footer = (s) => t.text(s, `${M.topic || ''}   |   ${meta}`, { x: 0.45, y: 4.95, w: 9.1, h: 0.25, fontSize: 9, color: C.dust, align: 'right' });
  let idx = 0;
  const page = async (d) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.title) {
      const fs = L.fit(d.title, 8.0, 0.65, 28, 16, F.head, true);
      t.text(s, d.title, { x: 0.55, y: 0.35, w: 8.0, h: 0.65, fontFace: F.head, bold: true, fontSize: fs, color: C.yellow, valign: 'middle' });
      await under(s, 0.55, 0.95, Math.min(8.0, L.width(d.title, fs, F.head, true) + 0.2));
    }
    t.text(s, String(idx), { x: 8.85, y: 0.35, w: 0.6, h: 0.6, fontFace: F.head, fontSize: 16, color: C.chalk, align: 'center', valign: 'middle' });
    await circ(s, 8.8, 0.3, 0.7, 0.7);
    footer(s);
    return s;
  };
  const para = (s, txt, x, y, w, h) => t.text(s, txt, { x, y, w, h, fontSize: L.fit(txt, w, h, 16, 11, F.body, false, 1.3), color: C.chalk, lineSpacingMultiple: 1.3, valign: 'middle' });

  const hero = async (d, kind) => {
    const s = pres.addSlide(); s.background = { data: bg }; idx++;
    if (d.image) await taped(s, d.image, 6.0, 0.6, 3.4, 2.9);
    t.text(s, [M.org, M.loc, M.year].filter(Boolean).join(', '), { x: 0.6, y: 0.55, w: 5, h: 0.3, fontSize: 13, color: C.blue });
    const fs = L.fit(d.title, 5.0, 2.3, 40, 22, F.head, true);
    t.text(s, d.title, { x: 0.6, y: 0.9, w: 5.0, h: 2.4, fontFace: F.head, bold: true, fontSize: fs, color: C.chalk, valign: 'bottom' });
    await under(s, 0.6, 3.35, 3.0, C.pink);
    if (d.subtitle) t.text(s, d.subtitle, { x: 0.6, y: 3.7, w: 5.0, h: 0.8, fontSize: 14, color: C.dust });
    t.text(s, M.author || '', { x: 6.0, y: 3.85, w: 3.4, h: 0.4, fontFace: F.head, fontSize: 16, bold: true, color: C.yellow, align: 'center' });
    t.text(s, M.topic || '', { x: 0.45, y: 4.95, w: 9.1, h: 0.25, fontSize: 9, color: C.dust, align: 'right' });
  };

  const R = {
    cover: (d) => hero(d, 'cover'), closing: (d) => hero(d, 'closing'),
    async intro(d) { const s = await page(d); await taped(s, d.image, 0.7, 1.45, 3.9, 3.3); para(s, d.text, 5.0, 1.4, 4.4, 3.4); },
    async image(d) { const s = await page(d); para(s, d.text, 0.6, 1.4, 4.3, 3.4); await taped(s, d.image, 5.4, 1.45, 3.9, 3.3); },
    async agenda(d) {
      const s = await page(d), per = Math.ceil(d.items.length / 2), rh = Math.min(1.0, 3.4 / per);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + Math.floor(i / per) * 4.5, y = 1.4 + (i % per) * rh;
        await circ(s, x, y, 0.65, 0.6, [C.yellow, C.pink, C.blue][i % 3]);
        t.text(s, String(i + 1), { x, y, w: 0.65, h: 0.6, fontFace: F.head, fontSize: 18, bold: true, color: C.chalk, align: 'center', valign: 'middle' });
        t.text(s, it, { x: x + 0.85, y, w: 3.4, h: 0.6, fontSize: 18, color: C.chalk, valign: 'middle' });
      }
    },
    async cards(d) {
      const s = await page(d), n = d.items.length, gap = 0.3, w = (8.8 - gap * (n - 1)) / n;
      const h = Math.min(3.25, 1.5 + Math.max(...d.items.map((it) => L.height(it.t, 14, w - 0.4, F.body))) + 0.3);
      for (const [i, it] of d.items.entries()) {
        const x = 0.6 + i * (w + gap), col = [C.yellow, C.pink, C.blue, C.chalk][i % 4];
        t.rect(s, x, 1.45, w, h, null, { line: { color: col, width: 1.75, dashType: 'sysDash' }, name: 'Chalk box' });
        t.img(s, await L.icon(it.icon, col, 1.75), x + 0.2, 1.65, 0.45, 0.45);
        t.text(s, it.h, { x: x + 0.2, y: 2.2, w: w - 0.4, h: 0.45, fontFace: F.head, fontSize: L.fit(it.h, w - 0.4, 0.45, 17, 12, F.head, true), bold: true, color: col });
        t.text(s, it.t, { x: x + 0.2, y: 2.68, w: w - 0.4, h: h - 1.3, fontSize: 14, color: C.chalk });
      }
    },
    async process(d) {
      const s = await page(d), n = d.steps.length, cw = 8.8 / n;
      for (const [i, st] of d.steps.entries()) {
        const x = 0.6 + i * cw;
        await circ(s, x, 1.45, 0.75, 0.7, C.yellow);
        t.text(s, String(i + 1), { x, y: 1.45, w: 0.75, h: 0.7, fontFace: F.head, fontSize: 20, bold: true, color: C.chalk, align: 'center', valign: 'middle' });
        if (i < n - 1) await arr(s, x + 0.85, 1.5, cw - 1.0);
        t.text(s, st.h, { x, y: 2.4, w: cw - 0.3, h: 0.5, fontFace: F.head, fontSize: L.fit(st.h, cw - 0.3, 0.5, 17, 11, F.head, true), bold: true, color: C.pink });
        t.text(s, st.t, { x, y: 2.95, w: cw - 0.3, h: 1.85, fontSize: L.fit(st.t, cw - 0.3, 1.85, 15, 11, F.body), color: C.chalk });
      }
    },
    async stats(d) {
      const s = await page(d), n = d.stats.length, cw = 8.8 / n;
      for (const [i, x] of d.stats.entries()) {
        const px = 0.6 + i * cw;
        await circ(s, px + 0.1, 1.4, cw - 0.5, 1.5, [C.yellow, C.pink, C.blue][i % 3]);
        t.text(s, x.value, { x: px + 0.3, y: 1.45, w: cw - 0.9, h: 1.4, fontFace: F.head, fontSize: L.fit(x.value, cw - 1.2, 0.9, 44, 20, F.head, true), bold: true, color: C.chalk, align: 'center', valign: 'middle' });
        t.text(s, x.label, { x: px, y: 3.1, w: cw - 0.3, h: 1.0, fontSize: 15, color: C.chalk, align: 'center' });
      }
      if (d.note) t.text(s, d.note, { x: 0.6, y: 4.3, w: 8.8, h: 0.45, fontSize: 11, italic: true, color: C.dust });
    },
    async compare(d) {
      const s = await page(d), w = 4.1;
      const rows = Array.from({ length: Math.max(d.left.items.length, d.right.items.length) }, (_, k) =>
        Math.max(...[d.left, d.right].map((sd) => (sd.items[k] ? L.height(sd.items[k], 15, w - 0.4, F.body) : 0))) + 0.22);
      t.line(s, 5.0, 1.45, 0, 3.3, C.chalk, 2, { dash: 'sysDash' });
      [d.left, d.right].forEach((side, i) => {
        const x = i ? 5.35 : 0.6, col = i ? C.blue : C.pink;
        t.text(s, side.h, { x, y: 1.4, w, h: 0.5, fontFace: F.head, fontSize: 20, bold: true, color: col });
        let y = 2.05;
        side.items.forEach((it, k) => { t.text(s, `\u2014 ${it}`, { x, y, w: w - 0.2, h: rows[k], fontSize: 15, color: C.chalk }); y += rows[k]; });
      });
    },
    async statement(d) {
      const s = await page(d);
      t.text(s, '\u2605', { x: 0.6, y: 1.4, w: 0.8, h: 0.8, fontSize: 40, color: C.yellow });
      t.text(s, L.runs(d.text), { x: 1.4, y: 1.4, w: 7.8, h: 1.8, fontFace: F.head, fontSize: L.fit(d.text, 7.8, 1.7, 34, 20, F.head, true), bold: true, color: C.chalk, valign: 'middle' });
      await under(s, 1.4, 3.25, 4.0, C.pink);
      if (d.caption) t.text(s, d.caption, { x: 1.4, y: 3.6, w: 7.8, h: 1.1, fontSize: L.fit(d.caption, 7.8, 1.1, 15, 11, F.body), color: C.dust });
    },
    async timeline(d) {
      const s = await page(d), n = d.items.length, cw = 8.8 / n;
      await under(s, 0.6, 2.05, 8.8, C.chalk);
      d.items.forEach((it, i) => {
        const x = 0.6 + i * cw;
        t.text(s, it.year, { x, y: 1.35, w: cw - 0.2, h: 0.6, fontFace: F.head, fontSize: L.fit(it.year, cw - 0.3, 0.55, 26, 13, F.head, true), bold: true, color: [C.yellow, C.pink, C.blue, C.yellow][i % 4], valign: 'bottom' });
        t.text(s, it.h, { x, y: 2.55, w: cw - 0.3, h: 0.42, fontFace: F.head, fontSize: 16, bold: true, color: C.chalk });
        t.text(s, it.t, { x, y: 3.0, w: cw - 0.3, h: 1.8, fontSize: 14, color: C.dust });
      });
    },
    async quote(d) {
      const s = await page({});
      t.text(s, '\u201C', { x: 0.6, y: 0.8, w: 1.2, h: 1.3, fontFace: F.head, fontSize: 100, color: C.pink });
      t.text(s, d.text, { x: 1.4, y: 1.4, w: 7.6, h: 2.3, fontFace: F.head, italic: true, fontSize: L.fit(d.text, 7.6, 2.2, 32, 18, F.head, false, 1, true), color: C.chalk, valign: 'middle' });
      if (d.author) t.text(s, `\u2014 ${d.author}`, { x: 1.4, y: 3.85, w: 7.6, h: 0.4, fontSize: 16, color: C.yellow });
    },
    async sources(d) {
      const s = await page(d), n = d.items.length, rh = Math.min(0.56, 3.4 / n);
      d.items.forEach((it, i) => t.text(s, [{ text: `${i + 1})  `, options: { color: C.yellow, bold: true } }, { text: it, options: { color: C.chalk } }],
        { x: 0.6, y: 1.4 + i * rh, w: 8.8, h: rh, fontSize: L.fit(it, 8.4, rh - 0.04, 15, 10, F.body), valign: 'middle' }));
    },
  };
  for (const d of content.slides) { if (!R[d.type]) throw new Error('unknown type ' + d.type); await R[d.type](d); }
  return L.save(pres, out, { name: 'SlideAI Doska', colors: { dk1: C.board, lt1: C.chalk, dk2: C.wood, lt2: C.dust, accent1: C.yellow, accent2: C.pink, accent3: C.blue, accent4: C.wood, accent5: C.dust, accent6: C.tape, hlink: C.yellow, folHlink: C.dust } });
}
/** Uslub pasporti */
const STYLE = { tone: "o'qituvchi tushuntirgandek: sodda, aniq, misollar bilan; qisqa ta'riflar", limits: {}, prefer: 'text' };
module.exports = { id: 33, slug: 'doska', name: 'Doska', category: 'academic', photos: true, build, style: STYLE };
