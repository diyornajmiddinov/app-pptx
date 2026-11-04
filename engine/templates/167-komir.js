/** 167 Ko'mir — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 167, slug: 'komir', name: "Kömir", mode: 'left', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Arial' },
  C: { ink: 'F2EEE8', muted: 'A8A39C', accent: 'F2A33A' }, photo: { r: 0.0 }, rule: true, caps: true, bold: true,
  bg: (kind) => compose(flat('1E1E1F'), rad(1500,0,900,[[0,'34302A',0.9],[1,'1E1E1F',0]]), grain(0.1)),
  tone: "qat'iy va lo'nda: kuchli sarlavhalar, kam so'z, aniq raqamlar" });
