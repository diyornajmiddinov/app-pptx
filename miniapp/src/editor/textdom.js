/**
 * Text <-> HTML for in-place editing.
 *
 * toHTML(): the model's paragraphs (resolved by the server) -> HTML the browser draws and edits.
 *   Each paragraph is a <div class="ed-p" data-src=N>, each run a <span> with explicit styles.
 *   React does not own this HTML (set through innerHTML), so contentEditable can change it freely.
 * fromDOM(): after editing, read the HTML back into paragraphs/runs using *computed* styles, so it does not
 *   matter which markup the browser's editing commands produced (<b>, <span style>, <font>...).
 *
 * Sizes: the model is in points; on screen 1pt = 12700 EMU * scale px, times the text body's autofit scale.
 */

const EMU_PER_PT = 12700;
const SERIF = /times|georgia|cambria|garamond|book|serif|palatino|caladea|schoolbook|bodoni|didot/i;
const MONO = /courier|mono|consol/i;
const FALLBACK = { Calibri: 'Carlito', Cambria: 'Caladea', 'Calibri Light': 'Carlito' };

export function cssFont(name) {
  const generic = MONO.test(name || '') ? 'monospace' : SERIF.test(name || '') ? 'serif' : 'sans-serif';
  const alt = FALLBACK[name] ? `, "${FALLBACK[name]}"` : '';
  return name ? `"${name.replace(/"/g, '')}"${alt}, ${generic}` : generic;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ROMAN = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
const roman = (n) => ROMAN.reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v; } return s; }, '');
const alpha = (n) => { let s = ''; while (n > 0) { n -= 1; s = String.fromCharCode(97 + (n % 26)) + s; n = Math.floor(n / 26); } return s; };

function autoNumber(type, n) {
  const m = /^(arabic|alphaLc|alphaUc|romanLc|romanUc)(.*)$/.exec(type || 'arabicPeriod') || [];
  let v = { arabic: String(n), alphaLc: alpha(n), alphaUc: alpha(n).toUpperCase(), romanLc: roman(n), romanUc: roman(n).toUpperCase() }[m[1]] ?? String(n);
  const tail = m[2] || 'Period';
  if (tail.startsWith('ParenBoth')) v = `(${v})`;
  else if (tail.startsWith('ParenR')) v = `${v})`;
  else if (tail.startsWith('Plain')) v = `${v}`;
  else v = `${v}.`;
  return v;
}

function runStyle(r, s, fit) {
  const px = (r.sz || 18) * EMU_PER_PT * s * fit * (r.baseline ? 0.66 : 1);
  const deco = [r.u && 'underline', r.s && 'line-through'].filter(Boolean).join(' ') || 'none';
  return `font-size:${px.toFixed(2)}px;font-family:${esc(cssFont(r.font))};font-weight:${r.b ? 700 : 400};font-style:${r.i ? 'italic' : 'normal'};`
    + `text-decoration-line:${deco};color:${r.color || '#000'};${r.baseline ? `vertical-align:${r.baseline > 0 ? 'super' : 'sub'};` : ''}`;
}

function spacing(sp, sizePx, s) {
  if (!sp) return 0;
  if (sp.pt != null) return sp.pt * EMU_PER_PT * s;
  return (sp.pct || 0) * sizePx * 1.2;
}

/** paragraphs -> HTML string */
export function toHTML(paragraphs, s, body = {}) {
  const fit = body.scale || 1;
  const counters = {};
  return (paragraphs || []).map((p) => {
    const first = p.runs.find((r) => !r.br) || p.end || {};
    const sizePx = (first.sz || p.end?.sz || 18) * EMU_PER_PT * s * fit;
    let lineHeight = 'normal';
    if (p.lnSpc?.pct != null) lineHeight = String(Math.max(0.5, p.lnSpc.pct * (1 - (body.spcCut || 0))) * 1.2);
    else if (p.lnSpc?.pt != null) lineHeight = `${p.lnSpc.pt * EMU_PER_PT * s}px`;
    else lineHeight = String(1.2 * (1 - (body.spcCut || 0)));
    let bullet = '';
    if (p.bullet) {
      if (p.bullet.auto) {
        const key = `${p.level}`;
        counters[key] = (counters[key] ?? (p.bullet.start || 1) - 1) + 1;
        bullet = autoNumber(p.bullet.auto, counters[key]);
      } else bullet = p.bullet.char || '•';
      Object.keys(counters).forEach((k) => { if (Number(k) > p.level) delete counters[k]; });
    } else Object.keys(counters).forEach((k) => delete counters[k]);
    const ind = (p.indent || 0) * s, marL = (p.marL || 0) * s;
    const buW = Math.max(-ind, sizePx * 0.6);
    const style = [
      `padding-left:${marL.toFixed(2)}px`, `text-indent:${ind.toFixed(2)}px`, `text-align:${p.align || 'left'}`, `line-height:${lineHeight}`,
      `margin-top:${spacing(p.spcBef, sizePx, s).toFixed(2)}px`, `margin-bottom:${spacing(p.spcAft, sizePx, s).toFixed(2)}px`,
      runStyle(p.end || first, s, fit),
      bullet ? `--bu-w:${buW.toFixed(2)}px;--bu-font:${esc(cssFont(p.bullet.font || first.font))};--bu-color:${p.bullet.color || first.color || '#000'};--bu-size:${((p.bullet.size || 1) * 100).toFixed(0)}%` : '',
    ].filter(Boolean).join(';');
    const runs = p.runs.map((r) => (r.br ? '<br>' : `<span style="${runStyle(r, s, fit)}">${esc(r.t)}</span>`)).join('');
    const empty = !p.runs.some((r) => !r.br && r.t);
    return `<div class="ed-p" data-src="${p.src ?? ''}"${bullet ? ` data-bullet="${esc(bullet)}"` : ''}${p._buset != null ? ` data-buset="${p._buset ? 1 : 0}"` : ''} style="${style}">${runs}${empty || p.runs.at(-1)?.br ? '<br>' : ''}</div>`;
  }).join('');
}

const rgbHex = (c) => {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c || '');
  return m ? '#' + [m[1], m[2], m[3]].map((x) => Number(x).toString(16).padStart(2, '0')).join('').toUpperCase() : '#000000';
};

function decoOf(el, root) {
  let u = false, st = false;
  for (let n = el; n && n !== root.parentNode; n = n.parentElement) {
    const d = getComputedStyle(n).textDecorationLine || '';
    if (d.includes('underline')) u = true;
    if (d.includes('line-through')) st = true;
    if (n === root) break;
  }
  return { u, s: st };
}

function styleOf(el, root, s, fit) {
  const cs = getComputedStyle(el);
  const va = cs.verticalAlign;
  const baseline = va === 'super' ? 30 : va === 'sub' ? -25 : 0;
  const px = parseFloat(cs.fontSize) / (baseline ? 0.66 : 1);
  const sz = Math.round((px / (EMU_PER_PT * s * fit)) * 2) / 2;
  const font = (cs.fontFamily.split(',')[0] || '').replace(/["']/g, '').trim();
  return { sz, b: (parseInt(cs.fontWeight, 10) || 400) >= 600, i: cs.fontStyle === 'italic', ...decoOf(el, root), color: rgbHex(cs.color), font, ...(baseline ? { baseline } : {}) };
}

const same = (a, b) => ['sz', 'b', 'i', 'u', 's', 'color', 'font', 'baseline'].every((k) => a[k] === b[k]);
const ALIGN = { start: 'left', left: 'left', center: 'center', right: 'right', end: 'right', justify: 'justify' };

/** HTML (after editing) -> paragraphs [{src, align, bullet?, runs, end}] */
export function fromDOM(root, s, fit = 1) {
  const blocks = [];
  let loose = null;
  root.childNodes.forEach((n) => {
    if (n.nodeType === 1 && ['DIV', 'P', 'LI', 'H1', 'H2', 'H3'].includes(n.tagName)) { blocks.push(n); loose = null; }
    else if (n.nodeType === 3 && !n.textContent.length) { /* skip */ }
    else { if (!loose) { loose = []; blocks.push(loose); } loose.push(n); }
  });
  let lastSrc = 0;
  return blocks.map((b) => {
    const el = Array.isArray(b) ? root : b;
    const nodes = Array.isArray(b) ? b : [...b.childNodes];
    const runs = [];
    const walk = (n) => {
      if (n.nodeType === 3) {
        const text = n.textContent.replace(/\u200B/g, ''); // zero-width space: the caret placeholder in empty runs
        if (!text) return;
        const st = styleOf(n.parentElement, root, s, fit);
        const prev = runs.at(-1);
        if (prev && !prev.br && same(prev, st)) prev.t += text; else runs.push({ t: text, ...st });
      } else if (n.nodeType === 1) {
        if (n.tagName === 'BR') runs.push({ br: true, ...styleOf(n.parentElement, root, s, fit) });
        else if (['DIV', 'P'].includes(n.tagName)) { if (runs.length && !runs.at(-1).br) runs.push({ br: true, ...styleOf(n, root, s, fit) }); n.childNodes.forEach(walk); }
        else n.childNodes.forEach(walk);
      }
    };
    nodes.forEach(walk);
    while (runs.length && runs.at(-1).br) runs.pop(); // the browser's placeholder <br> in an empty line
    const src = el.dataset?.src !== undefined && el.dataset.src !== '' ? Number(el.dataset.src) : lastSrc;
    lastSrc = src;
    const p = { src, align: ALIGN[getComputedStyle(el).textAlign] || 'left', runs, end: styleOf(el, root, s, fit) };
    if (el !== root && el.dataset.buset !== undefined) p.bullet = el.dataset.buset === '1';
    return p;
  });
}
