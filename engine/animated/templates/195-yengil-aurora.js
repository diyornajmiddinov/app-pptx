/** 195 Yengil aurora — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 195, slug: 'yengil-aurora', name: "Yengil aurora", mode: 'left', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '1E2A30', muted: '5A6A70', accent: '2F9E8F' }, photo: { r: 0.12 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(flat('FAFCFC'), blobs(kind==='cover'?[[300,150,300,'B9F0D8'],[900,100,280,'BFD9FF'],[1450,250,260,'E4D2FF']]:[[200,0,260,'CFF5E4',0.8],[1500,0,260,'D6E6FF',0.8]],140)),
  tone: "yangi tong: optimistik, aniq va tartibli" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "calm"], "transitions": ["dissolve", "fade", "morph"], "cover": ["fadeWords", "focusIn"], "mark": "focusIn", "deco": "dissolve", "sig": {"title": "focusIn", "body": "fade", "item": "arcRight", "image": "dissolve", "number": "focusIn", "order": "diagonal", "stagger": 0.24}, "tempo": 1.35, "kenburns": true};
