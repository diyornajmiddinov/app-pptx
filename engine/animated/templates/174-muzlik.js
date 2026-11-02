/** 174 Muzlik — minimalist, background-driven (right composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 174, slug: 'muzlik', name: "Muzlik", mode: 'right', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '16303D', muted: '4F6E7C', accent: '0F8BA8' }, photo: { r: 0.12 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'D5F0F6'],[0.6,'EDF9FB'],[1,'FFFFFF']]), blobs([[200,900,380,'FFFFFF',0.9]],140)),
  tone: "sovuqqon va aniq: faktlar va tiniq xulosalar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "technical"], "transitions": ["p14:shred|pattern=\"strip\" dir=\"in\"", "dissolve", "fade"], "cover": ["focusIn", "fadeLetters"], "mark": "focusIn", "deco": "wipe:d", "sig": {"title": "focusIn", "body": "wipe:d", "item": "wipe:d", "image": "focusIn", "number": "focusIn", "order": "seq", "stagger": 0.2}, "tempo": 1.25, "kenburns": true};
