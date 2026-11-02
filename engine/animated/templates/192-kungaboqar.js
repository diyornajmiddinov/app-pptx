/** 192 Kungaboqar — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 192, slug: 'kungaboqar', name: "Kungaboqar", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '1A1A1A', muted: '4A4636', accent: '1A1A1A' }, photo: { r: 0.04 }, rule: true, caps: true, bold: true,
  bg: (kind) => compose(flat('FFD23F'), rad(0,900,1000,[[0,'FFE584',0.8],[1,'FFD23F',0]])),
  tone: "baland ovoz: shiorga yaqin, quvnoq va qisqa" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "energetic"], "transitions": ["p14:ferris|dir=\"l\"", "fade", "zoom"], "cover": ["wheel", "popOver"], "mark": "wheel", "deco": "wheel4", "sig": {"title": "popOver", "body": "fadeUp", "item": "wheel", "image": "wheel4", "number": "wheel", "order": "centerOut", "stagger": 0.16}, "tempo": 1.0, "kenburns": true};
