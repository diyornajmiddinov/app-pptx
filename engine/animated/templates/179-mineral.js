/** 179 Mineral — minimalist, background-driven (left composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 179, slug: 'mineral', name: "Mineral", mode: 'left', list: 'rows', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'EEF2F6', muted: 'A9B6C3', accent: '9ED0E6' }, photo: { r: 0.08 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('3A4A5C'), blobs([[1400,150,320,'5B7088',0.9],[200,850,300,'2C3A49',0.9]],150), grain(0.05)),
  tone: "toshdek mustahkam: tahliliy, aniq va xolis" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "calm"], "transitions": ["p14:glitter|pattern=\"hexagon\" dir=\"r\"", "fade", "dissolve"], "cover": ["focusIn", "fadeLetters"], "mark": "diamond", "deco": "diamond", "sig": {"title": "focusIn", "body": "fade", "item": "diamond", "image": "diamond", "number": "diamond", "order": "diagonal", "stagger": 0.2}, "tempo": 1.2, "kenburns": true};
