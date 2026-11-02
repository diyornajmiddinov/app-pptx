/** 168 Qor — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 168, slug: 'qor', name: "Qor", mode: 'top', list: 'rows', num: 'corner', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '1F2A33', muted: '6A7781', accent: '3E7CB1' }, photo: { r: 0.04 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('FFFFFF'), rad(1600,900,1100,[[0,'E3EDF5',1],[1,'FFFFFF',0]])),
  tone: "toza va tiniq: oddiy so'zlar, ochiq tuzilma" });
