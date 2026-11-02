/** 174 Muzlik — minimalist, background-driven (right composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 174, slug: 'muzlik', name: "Muzlik", mode: 'right', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '16303D', muted: '4F6E7C', accent: '0F8BA8' }, photo: { r: 0.12 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'D5F0F6'],[0.6,'EDF9FB'],[1,'FFFFFF']]), blobs([[200,900,380,'FFFFFF',0.9]],140)),
  tone: "sovuqqon va aniq: faktlar va tiniq xulosalar" });
