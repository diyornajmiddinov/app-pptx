/** 198 Pista — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 198, slug: 'pista', name: "Pista", mode: 'bottom', list: 'cols', num: 'corner', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '2E3A1F', muted: '63704F', accent: '6B8E23' }, photo: { r: 0.08 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('EEF3DD'), rad(1600,0,800,[[0,'DCE8B8',0.9],[1,'EEF3DD',0]])),
  tone: "yengil va tabiiy: sodda, tushunarli, ijobiy" });
