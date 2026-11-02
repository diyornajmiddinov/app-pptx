/** 189 Akva — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 189, slug: 'akva', name: "Akva", mode: 'center', list: 'cols', num: 'corner', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '0E3B43', muted: '4C7178', accent: '0E9AA7' }, photo: 'circle', rule: false, caps: false, bold: true,
  bg: (kind) => compose(flat('E6FAF8'), rad(800,450,kind==='cover'?700:900,[[0,'B5EFEA',0.9],[1,'E6FAF8',0]])),
  tone: "tiniq va yengil: sodda, oqimli tushuntirish" });
