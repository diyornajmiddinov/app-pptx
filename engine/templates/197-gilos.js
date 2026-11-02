/** 197 Gilos — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 197, slug: 'gilos', name: "Gilos", mode: 'center', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: 'FFFFFF', muted: 'F6C6D2', accent: 'FFD1DC' }, photo: { r: 0.2 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'9B1B3A'],[1,'D23C5A']],'d'), grain(0.05)),
  tone: "ehtirosli va ko'rkam: qisqa, ta'sirli jumlalar" });
