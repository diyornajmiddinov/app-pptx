/** 185 Beton — minimalist, background-driven (right composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 185, slug: 'beton', name: "Beton", mode: 'right', list: 'rows', num: 'corner', F: { head: 'Arial', body: 'Arial' },
  C: { ink: '1E1E1E', muted: '5C5C5C', accent: 'D94F30' }, photo: { r: 0.0 }, rule: true, caps: true, bold: true,
  bg: (kind) => compose(flat('B9B7B2'), grain(0.22,0.55), blobs([[1500,100,300,'CFCDC8',0.7]],160)),
  tone: "industrial va lo'nda: qisqa, kuchli, aniq" });
