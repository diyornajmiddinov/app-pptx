/**
 * lib.js of the animated templates: the shared engine/lib.js, with save() that also animates the deck (anim.js).
 * The animated templates are copies of engine/templates (require('../lib.js') lands here); the originals are untouched.
 */
const L = require('../lib.js');
const A = require('./anim.js');

async function save(pres, outPath, theme) {
  const ctx = global.__SLIDEAI_ANIM || {};
  const slides = A.prepare(pres, ctx.content, ctx.spec);
  await L.save(pres, outPath, theme);
  await A.apply(outPath, slides);
  return outPath;
}

module.exports = { ...L, save };
