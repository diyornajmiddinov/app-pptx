/**
 * scenes.js — the choreography of animated decks.
 *
 * A SCENE says how one slide comes alive: which effect the title, the text, the cards, the numbers and the photos
 * get, in which order the cards enter (one after another, from the centre out, left and right in turn...) and how
 * fast. There are ~50 scenes in six moods (calm, elegant, energetic, technical, bold, playful).
 *
 * Every template has its own set (`anim` in animated/templates/NN-*.js): its moods pick ~12 scenes and 3–4 slide
 * transitions, shuffled by the template's id, so no two templates share a set. In a deck the scenes take turns
 * slide by slide (never the same twice in a row) and the cover and the closing slide get their own entrance.
 */
const A = require('./anim.js');
const JSZip = require('jszip');

// ---------------------------------------------------------------- scenes
// title / body / item (one name, or a list taken in turn card by card) / image / number; order; stagger (s); tempo
const S = (name, moods, o) => ({ name, moods, order: 'seq', stagger: 0.18, tempo: 1, number: o.item, ...o });
const SCENES = [
  S('drift', ['calm'], { title: 'fadeUp', body: 'fadeUp', item: 'riseUp', image: 'softGrow', number: 'focusIn' }),
  S('mist', ['calm', 'elegant'], { title: 'fadeWords', body: 'fade', item: 'fade', image: 'dissolve', stagger: 0.22 }),
  S('veil', ['calm'], { title: 'wipe:r', body: 'fadeUp', item: 'fadeUp', image: 'wipe:d', stagger: 0.2, tempo: 1.1 }),
  S('breath', ['calm', 'elegant'], { title: 'focusIn', body: 'fadeUp', item: 'focusIn', image: 'focusIn', order: 'centerOut', stagger: 0.2 }),
  S('tide', ['calm'], { title: 'fadeRight', body: 'fadeLeft', item: ['fadeRight', 'fadeLeft'], image: 'fadeLeft', order: 'alternate', stagger: 0.2 }),
  S('dawn', ['calm', 'elegant'], { title: 'riseWords', body: 'fadeUp', item: 'riseSettle', image: 'softGrow', stagger: 0.24 }),
  S('quiet', ['calm'], { title: 'fade', body: 'fade', item: 'fadeDown', image: 'circle', order: 'reverse', stagger: 0.18 }),
  S('horizon', ['calm', 'elegant'], { title: 'wipe:r', body: 'fadeUp', item: 'fadeRight', image: 'splitH', stagger: 0.2, tempo: 1.15 }),
  S('lantern', ['calm', 'playful'], { title: 'focusIn', body: 'fade', item: 'circle', image: 'circle', number: 'focusIn', order: 'centerOut', stagger: 0.18 }),
  S('paper', ['calm', 'technical'], { title: 'unfold', body: 'fade', item: 'unfold', image: 'unfold', stagger: 0.16 }),
  S('silk', ['elegant'], { title: 'fadeLetters', body: 'fadeWords', item: 'curveUp', image: 'focusIn', number: 'springIn', stagger: 0.2 }),
  S('gallery', ['elegant'], { title: 'sweepIn', body: 'fade', item: 'fadeUp', image: 'wipe:r', stagger: 0.22 }),
  S('curtain', ['elegant', 'bold'], { title: 'split', body: 'fade', item: 'unfold', image: 'split', order: 'centerOut', stagger: 0.18 }),
  S('arc', ['elegant', 'playful'], { title: 'arcRight', body: 'fadeUp', item: ['arcRight', 'arcLeft'], image: 'focusIn', order: 'alternate', stagger: 0.2 }),
  S('glide', ['elegant', 'energetic'], { title: 'slideRight', body: 'slideRight', item: 'slideRight', image: 'slideLeft', order: 'cascade', stagger: 0.14 }),
  S('reveal', ['elegant', 'technical'], { title: 'peekUp', body: 'peekUp', item: 'peekUp', image: 'circle', stagger: 0.18 }),
  S('grace', ['elegant'], { title: 'riseWords', body: 'fade', item: 'softGrow', image: 'dissolve', order: 'diagonal', stagger: 0.2 }),
  S('ink', ['elegant', 'technical'], { title: 'fadeLetters', body: 'wipeWords', item: 'wipe:r', image: 'wipe:r', stagger: 0.2 }),
  S('focus', ['elegant', 'bold'], { title: 'focusIn', body: 'focusIn', item: 'focusIn', image: 'focusIn', order: 'together', stagger: 0.25 }),
  S('launch', ['energetic'], { title: 'popOver', body: 'fadeUp', item: 'popOver', image: 'springIn', number: 'popOver', stagger: 0.12 }),
  S('bounce', ['energetic', 'playful'], { title: 'bounceDrop', body: 'fadeUp', item: 'bounceDrop', image: 'popIn', number: 'popOver', stagger: 0.14 }),
  S('swing', ['energetic'], { title: 'swingRight', body: 'fadeUp', item: ['swingRight', 'swingLeft'], image: 'swingLeft', order: 'alternate', stagger: 0.14 }),
  S('burst', ['energetic', 'bold'], { title: 'zoomIn', body: 'fade', item: 'zoomIn', image: 'zoomIn', number: 'popOver', order: 'centerOut', stagger: 0.1 }),
  S('rush', ['energetic'], { title: 'flyRight', body: 'flyUp', item: 'flyUp', image: 'flyLeft', order: 'cascade', stagger: 0.1 }),
  S('spring', ['energetic', 'playful'], { title: 'springIn', body: 'riseSettle', item: 'springIn', image: 'springIn', order: 'diagonal', stagger: 0.12 }),
  S('orbit', ['energetic', 'playful'], { title: 'arcLeft', body: 'fadeUp', item: ['arcRight', 'arcLeft'], image: 'wedge', order: 'alternate', stagger: 0.14 }),
  S('cascade', ['energetic', 'bold'], { title: 'flyDown', body: 'fadeDown', item: 'flyDown', image: 'flyUp', order: 'cascade', stagger: 0.09 }),
  S('scan', ['technical'], { title: 'wipe:r', body: 'wipe:r', item: 'wipe:d', image: 'wipe:d', number: 'wipe:u', stagger: 0.16 }),
  S('type', ['technical'], { title: 'typeLetters', body: 'wipeWords', item: 'wipe:r', image: 'blinds', stagger: 0.18 }),
  S('grid', ['technical', 'bold'], { title: 'wipe:r', body: 'fade', item: 'checker', image: 'checker', number: 'appear', order: 'diagonal', stagger: 0.1 }),
  S('blueprint', ['technical'], { title: 'sweepIn', body: 'wipe:r', item: 'box', image: 'box', stagger: 0.18 }),
  S('stack', ['technical', 'calm'], { title: 'peekUp', body: 'wipe:u', item: 'peekUp', image: 'wipe:u', stagger: 0.14 }),
  S('signal', ['technical'], { title: 'fadeLetters', body: 'bars', item: 'bars', image: 'strips', stagger: 0.16 }),
  S('module', ['technical', 'bold'], { title: 'split', body: 'fade', item: 'stretch', image: 'unfold', number: 'stretch', stagger: 0.14 }),
  S('diagonal', ['technical', 'energetic'], { title: 'strips', body: 'fade', item: 'strips', image: 'strips', order: 'diagonal', stagger: 0.12 }),
  S('slam', ['bold'], { title: 'appear', body: 'appear', item: 'drop', image: 'appear', number: 'popIn', order: 'cascade', stagger: 0.1, tempo: 0.8 }),
  S('cut', ['bold'], { title: 'wipe:r', body: 'appear', item: 'slideRight', image: 'wipe:l', stagger: 0.1, tempo: 0.75 }),
  S('press', ['bold', 'energetic'], { title: 'popIn', body: 'fade', item: 'popIn', image: 'popIn', number: 'popIn', stagger: 0.12 }),
  S('stamp', ['bold'], { title: 'stretch', body: 'fadeUp', item: 'unfold', image: 'splitH', number: 'popOver', stagger: 0.12 }),
  S('block', ['bold', 'technical'], { title: 'splitH', body: 'wipe:l', item: ['flyLeft', 'flyRight'], image: 'blindsV', order: 'alternate', stagger: 0.12 }),
  S('confetti', ['playful'], { title: 'popOver', body: 'fadeUp', item: ['popOver', 'spinIn'], image: 'wheel', number: 'popOver', order: 'alternate', stagger: 0.12 }),
  S('carousel', ['playful'], { title: 'wheel', body: 'fade', item: 'wheel', image: 'wheel4', stagger: 0.16 }),
  S('hop', ['playful', 'energetic'], { title: 'bounceDrop', body: 'fadeUp', item: ['bounceDrop', 'riseSettle'], image: 'springIn', order: 'alternate', stagger: 0.13 }),
  S('twirl', ['playful'], { title: 'spinIn', body: 'fadeUp', item: 'swing', image: 'circle', number: 'spinIn', stagger: 0.15 }),
  S('balloon', ['playful', 'calm'], { title: 'curveUp', body: 'fadeUp', item: 'curveUp', image: 'popOver', number: 'popOver', order: 'centerOut', stagger: 0.14 }),
  S('wave', ['playful', 'calm'], { title: 'riseWords', body: 'fadeUp', item: 'riseSettle', image: 'diamond', order: 'diagonal', stagger: 0.1 }),
  S('pop', ['playful', 'bold'], { title: 'springIn', body: 'fade', item: 'popIn', image: 'plus', number: 'popOver', order: 'reverse', stagger: 0.12 }),
  S('lens', ['elegant', 'technical'], { title: 'focusIn', body: 'fadeWords', item: 'softGrow', image: 'circle', order: 'centerOut', stagger: 0.16 }),
  S('ribbon', ['elegant', 'playful'], { title: 'sweepIn', body: 'fadeUp', item: ['curveUp', 'curveDown'], image: 'wipe:r', order: 'alternate', stagger: 0.16 }),
  S('pulse', ['energetic', 'technical'], { title: 'stretch', body: 'fade', item: 'springIn', image: 'focusIn', number: 'popOver', order: 'centerOut', stagger: 0.11 }),
];

// cover and closing: the title gets a signature entrance of the mood
const COVER = {
  calm: ['fadeWords', 'focusIn', 'riseWords'], elegant: ['fadeLetters', 'riseWords', 'sweepIn'], energetic: ['popOver', 'springIn', 'bounceDrop'],
  technical: ['typeLetters', 'sweepIn', 'fadeLetters'], bold: ['stretch', 'splitH', 'popIn'], playful: ['bounceDrop', 'spinIn', 'popOver'],
};
const TRANSITIONS = {
  calm: ['fade', 'morph', 'p14:reveal|thruBlk="0"', 'dissolve'],
  elegant: ['morph', 'fade', 'p14:reveal|thruBlk="0"', 'p14:gallery|dir="l"', 'p14:doors|dir="vert"'],
  energetic: ['push:u', 'p14:vortex|dir="r"', 'zoom', 'p14:flythrough', 'p14:switch|dir="r"', 'morph'],
  technical: ['wipe:r', 'p14:conveyor|dir="l"', 'split', 'p14:pan|dir="u"', 'morph', 'push:l'],
  bold: ['cut', 'p14:switch|dir="r"', 'push:l', 'p14:doors|dir="vert"', 'split:h'],
  playful: ['p14:ferris|dir="l"', 'p14:flip|dir="r"', 'p14:gallery|dir="l"', 'push:l', 'p14:ripple'],
};
const area = (e) => Math.abs(e.w * e.h);
const DUR = { title: 700, body: 650, item: 600, image: 850, number: 550, deco: 500, axis: 800 };

// ---------------------------------------------------------------- a template's own set
function rng(seed) { let s = (seed * 2654435761) % 2147483647 || 1; return () => (s = (s * 48271) % 2147483647) / 2147483647; }
const shuffle = (list, r) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** the template's palette: { scenes (12, in its order), transitions, cover title effects, kenburns, tempo } */
function palette(id, spec = {}) {
  const moods = spec.moods && spec.moods.length ? spec.moods : ['calm'];
  const r = rng(id + 101);
  const mine = SCENES.filter((s) => s.moods.some((m) => moods.includes(m)));
  const first = SCENES.filter((s) => s.moods[0] === moods[0]);                 // the main mood leads
  const ordered = [...shuffle(first, r), ...shuffle(mine.filter((s) => !first.includes(s)), r)];
  let scenes = ordered.slice(0, Math.max(8, Math.min(12, ordered.length)));
  if (spec.sig) { // the template's own scene comes back every few slides (and leads the deck)
    const sig = { ...S(`sig-${id}`, moods, spec.sig) };
    scenes = scenes.slice(0, 10); scenes.splice(0, 0, sig); scenes.splice(6, 0, { ...sig, name: `sig-${id}b`, order: spec.sig.order2 || sig.order });
  }
  const pool = [...new Set(moods.flatMap((m) => TRANSITIONS[m]))];
  const transitions = spec.transitions || shuffle(pool, r).slice(0, 3);
  const cover = spec.cover || shuffle([...new Set(moods.flatMap((m) => COVER[m]))], r);
  return { scenes, transitions, cover, kenburns: !!spec.kenburns, tempo: spec.tempo || 1, speed: spec.speed || 'med', moods,
    mark: spec.mark || null, deco: spec.deco || null };
}

// ---------------------------------------------------------------- one slide
const ORDERS = {
  seq: (gs) => gs.map((g, i) => i),
  reverse: (gs) => gs.map((g, i) => gs.length - 1 - i),
  cascade: (gs) => gs.map((g, i) => i * 0.6),
  together: (gs) => gs.map((g, i) => i * 0.15),
  alternate: (gs) => gs.map((g, i) => i),
  centerOut: (gs) => { const c = gs.map((g) => Math.abs(g.cx - 5)); const rank = [...c].sort((a, b) => a - b); return c.map((v) => rank.indexOf(v) * 0.9); },
  diagonal: (gs) => { const d = gs.map((g) => g.cx + g.cy * 1.6); const rank = [...d].sort((a, b) => a - b); return d.map((v) => rank.indexOf(v) * 0.8); },
};
const ITER = { typeLetters: 'wipe:r', fadeLetters: 'fade', fadeWords: 'fade', riseWords: 'fadeUp', wipeWords: 'wipe:r' }; // too long to iterate

function stepsFor(groups, scene, P, type, idx, nameTitle) {
  const T = (scene.tempo || 1) * P.tempo;
  let order = scene.order;
  if (type === 'timeline' || type === 'process') order = order === 'cascade' ? 'cascade' : 'seq'; // a sequence stays a sequence
  if ((type === 'agenda' || type === 'sources') && !['seq', 'cascade', 'together'].includes(order)) order = 'seq';
  const title = groups.find((g) => g.role === 'title'), axes = groups.filter((g) => g.role === 'axis');
  const rest = groups.filter((g) => g.role !== 'title' && g.role !== 'axis').map((g) => {
    const xs = g.els.map((e) => e.x + e.w / 2), ys = g.els.map((e) => e.y + e.h / 2);
    return { ...g, cx: xs.reduce((a, b) => a + b, 0) / xs.length, cy: ys.reduce((a, b) => a + b, 0) / ys.length };
  });
  const slots = (ORDERS[order] || ORDERS.seq)(rest);
  const steps = [];
  const push = (g, effect, delay, role) => {
    const dur = Math.round((DUR[role] || 600) * T);
    let span = dur;
    // inside a card: the plate enters with the card's effect, its text a beat later, its marks (icon, badge,
    // number, marker) last with the template's own mark effect
    const plate = g.els.length > 1 ? g.els.filter((e) => e.kind === 'shape').sort((a, b) => area(b) - area(a))[0] : null;
    const isMark = (e) => P.mark && e !== plate && role !== 'title' && (e.kind === 'shape' || e.kind === 'image' || (e.kind === 'text' && e.txt.length <= 4))
      && area(e) < 0.8 && g.els.length > 1;
    g.els.slice().sort((a, b) => a.k - b.k).forEach((e) => {
      let eff = isMark(e) ? P.mark : effect, iterPct = 0;
      const lag = isMark(e) ? 0.22 * dur : plate && e !== plate && e.kind === 'text' ? 0.12 * dur : 0;
      const it = A.EFFECTS[eff] && A.EFFECTS[eff][3];
      if (it) {
        const units = it === 'lt' ? [...e.txt].length : e.txt.split(/\s+/).filter(Boolean).length;
        const per = it === 'lt' ? 28 : 85; // ms per letter / word
        if (e.kind !== 'text' || (it === 'lt' ? units > 70 : units > 45) || units < 2) eff = ITER[eff] || 'fade';
        else { iterPct = Math.round((per / dur) * 100000); span = Math.max(span, dur + units * per); }
      }
      if (role === 'title' && e === g.els[0] && nameTitle) e.o.options.objectName = `!!title~${idx}`;
      steps.push({ name: e.o.options.objectName, effect: eff, delay: Math.round(delay + lag), dur, text: e.kind === 'text', iterPct, span,
        emph: role === 'image' && P.kenburns ? 'kenburns' : role === 'number' ? 'pulse' : null, emphDur: Math.round(7000 * T) });
    });
    return span;
  };
  let t = 0;
  if (title) { const span = push(title, title.effect, 0, 'title'); t = Math.min(span, 450 * T) + 80 * T; }
  for (const g of axes) { push(g, scene.axis || 'wipe:r', t, 'axis'); t += 250 * T; }
  rest.forEach((g, n) => {
    const raw = g.role === 'deco' ? P.deco || scene.item : g.role === 'item' ? scene.item : scene[g.role] || scene.body;
    const effect = Array.isArray(raw) ? raw[n % raw.length] : raw;
    push(g, effect, t + slots[n] * scene.stagger * 1000 * T, g.role);
  });
  return steps;
}

/**
 * Before writing: name every object, choose each slide's scene and transition and work out its steps.
 * Returns per slide { transition, speed, steps }.
 */
function prepare(pres, content, spec, templateId) {
  const P = palette(templateId || 1, spec || {});
  const slides = (content && content.slides) || [];
  let k = 0, prevType = null, prevTr = null;
  const pick = rng(templateId * 7 + slides.length);            // the template's transitions, never the same twice in a row
  const edgeScene = { cover: P.scenes[P.scenes.length - 1], closing: P.scenes[P.scenes.length - 2] };
  const turn = P.scenes.slice(0, -2);                          // the middle slides take turns with the rest
  return (pres._slides || []).map((slide, i) => {
    const d = slides[i] || {}, type = d.type || '';
    (slide._slideObjects || []).forEach((o, n) => { o.options = o.options || {}; o.options.objectName = `${o.options.objectName || o._type}~${i}.${n}`; });
    const { groups } = A.plan(slide, type, d, i);
    const edge = type === 'cover' || type === 'closing';
    const scene = edge ? edgeScene[type] : turn[k++ % turn.length];
    const title = groups.find((g) => g.role === 'title');
    if (title) title.effect = edge ? P.cover[(type === 'cover' ? 0 : 1) % P.cover.length] : type === 'quote' ? 'fade' : scene.title;
    if (type === 'quote') groups.filter((g) => g.role === 'body').forEach((g) => { g.role = 'quote'; });
    const sc = type === 'quote' ? { ...scene, quote: ['fadeWords', 'riseWords', 'fadeLetters'][i % 3] } : scene;
    const steps = stepsFor(groups, sc, P, type, i, true);
    // transitions: the first slide fades in; then the template's own, in turn; Morph when the slide type repeats
    let transition = 'fade';
    if (i > 0) {
      const options = P.transitions.filter((t) => t !== prevTr);
      transition = options[Math.floor(pick() * options.length)] || P.transitions[0];
    }
    if (i > 0 && type === prevType && P.transitions.includes('morph')) transition = 'morph';
    prevType = type; prevTr = transition;
    return { transition, speed: P.speed, steps, scene: scene.name };
  });
}

/** After pptxgenjs wrote the file: add transitions and timing to every slide's XML. */
async function apply(file, slides) {
  const fs = require('fs');
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const timeline = []; // SLIDEAI_TIMELINE=1: <file>.timeline.json for the video (backend services/video.py)
  for (let i = 0; i < slides.length; i++) {
    const p = `ppt/slides/slide${i + 1}.xml`, f = zip.file(p);
    if (!f) continue;
    let xml = await f.async('string');
    const ids = {};
    for (const m of xml.matchAll(/<p:cNvPr id="(\d+)" name="([^"]*)"/g)) ids[m[2].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'")] = m[1];
    const steps = slides[i].steps.map((s) => ({ ...s, spid: ids[s.name] })).filter((s) => s.spid);
    const textIds = [...new Set(steps.filter((s) => s.text).map((s) => s.spid))];
    xml = xml.replace('</p:clrMapOvr>', `</p:clrMapOvr>${A.transitionXml(slides[i].transition, slides[i].speed)}${steps.length ? A.timingXml(steps, textIds) : ''}`);
    zip.file(p, xml);
    timeline.push({ transition: slides[i].transition || 'none', speed: slides[i].speed || 'med',
      steps: steps.map((s) => ({ spid: +s.spid, effect: s.effect, delay: s.delay, dur: s.dur, span: s.span || 0 })) });
  }
  fs.writeFileSync(file, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  if (process.env.SLIDEAI_TIMELINE) fs.writeFileSync(`${file}.timeline.json`, JSON.stringify({ slides: timeline }));
}

module.exports = { SCENES, COVER, TRANSITIONS, palette, prepare, apply };
