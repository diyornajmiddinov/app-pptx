/**
 * fill.js — fill one of the 40 templates with content.
 *   node fill.js <templateId 1-40> <content.json> [out.pptx]
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
  // short values must never break across lines: "3 trln$", "1 250 mln", "2003-2007"
  const keep = (v) => String(v).replace(/ /g, '\u00a0').replace(/(\d)-(\d)/g, '$1\u2011$2');
  for (const sl of content.slides || []) {
    if (sl.type === 'stats') (sl.stats || []).forEach((x) => { x.value = keep(x.value); });
    if (sl.type === 'timeline') (sl.items || []).forEach((x) => { x.year = keep(x.year); });
  }
  T.build(content, out || `out/${String(T.id).padStart(2, '0')}-${T.slug}-${content.file}.pptx`).then((p) => console.log(p)).catch((e) => { console.error(e); process.exit(1); });
}
