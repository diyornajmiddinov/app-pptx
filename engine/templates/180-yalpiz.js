/** 180 Yalpiz — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 180, slug: 'yalpiz', name: "Yalpiz", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '173B36', muted: '4E6E68', accent: '12867A' }, photo: 'circle', rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('DDF3EC'), blobs([[300,700,320,'FFFFFF',0.8],[1400,200,260,'C6EADF',0.9]],150)),
  tone: "yangi va tetik: qisqa, aniq, tushunarli" });
