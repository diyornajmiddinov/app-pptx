/** 192 Kungaboqar — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 192, slug: 'kungaboqar', name: "Kungaboqar", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '1A1A1A', muted: '4A4636', accent: '1A1A1A' }, photo: { r: 0.04 }, rule: true, caps: true, bold: true,
  bg: (kind) => compose(flat('FFD23F'), rad(0,900,1000,[[0,'FFE584',0.8],[1,'FFD23F',0]])),
  tone: "baland ovoz: shiorga yaqin, quvnoq va qisqa" });
