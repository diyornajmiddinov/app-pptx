/**
 * fill.js — an animated deck: node animated/fill.js <templateId> <content.json> [out.pptx]
 * Templates that have an animated copy in animated/templates/ (each with its own `anim`); the same content.json as
 * engine/fill.js. SLIDEAI_CHECK=1 prints overflowing text boxes, like engine/fill.js.
 */
const fs = require('fs');
const path = require('path');
const TEMPLATES = fs.readdirSync(path.join(__dirname, 'templates')).filter((f) => f.endsWith('.js')).sort().map((f) => require('./templates/' + f));
module.exports = { TEMPLATES };
if (require.main === module) {
  const [id, file, out] = process.argv.slice(2);
  const T = TEMPLATES.find((t) => t.id === Number(id));
  if (!T) { console.error('template not found'); process.exit(1); }
  const content = JSON.parse(fs.readFileSync(file, 'utf8'));
  // short values must never break across lines: "3 trln$", "1 250 mln", "2003-2007" (as in engine/fill.js)
  const keep = (v) => String(v).replace(/ /g, ' ').replace(/(\d)-(\d)/g, '$1‑$2');
  for (const sl of content.slides || []) {
    if (sl.type === 'stats') (sl.stats || []).forEach((x) => { x.value = keep(x.value); });
    if (sl.type === 'timeline') (sl.items || []).forEach((x) => { x.year = keep(x.year); });
  }
  global.__SLIDEAI_ANIM = { content, spec: T.anim, id: T.id };
  T.build(content, out || `out/anim-${String(T.id).padStart(2, '0')}-${T.slug}.pptx`).then((p) => {
    console.log(p);
    if (process.env.SLIDEAI_CHECK) { const L = require('../lib.js'); console.error(JSON.stringify({ overflow: L.OVERFLOW, fits: L.FITS })); }
  }).catch((e) => { console.error(e); process.exit(1); });
}
