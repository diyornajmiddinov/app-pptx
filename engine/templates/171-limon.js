/** 171 Limon — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 171, slug: 'limon', name: "Limon", mode: 'bottom', list: 'rows', num: 'corner', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '2B2A1E', muted: '6A6650', accent: 'D4A20A' }, photo: { r: 0.08 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('FFF8D6'), rad(800,kind==='cover'?300:0,900,[[0,'FFFFFF',0.9],[1,'FFF8D6',0]])),
  tone: "tetik va yorqin: qisqa, g'ayratli, ijobiy" });
