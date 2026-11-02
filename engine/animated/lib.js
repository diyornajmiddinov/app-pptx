/**
 * lib.js of the animated templates: the shared engine/lib.js, with save() that also animates the deck (scenes.js).
 * The animated templates are copies of engine/templates (require('../lib.js') lands here); the originals are untouched.
 */
const L = require('../lib.js');
const scenes = require('./scenes.js');

async function save(pres, outPath, theme) {
  const ctx = global.__SLIDEAI_ANIM || {};
  const slides = scenes.prepare(pres, ctx.content, ctx.spec, ctx.id);
  await L.save(pres, outPath, theme);
  await scenes.apply(outPath, slides);
  return outPath;
}

module.exports = { ...L, save };
