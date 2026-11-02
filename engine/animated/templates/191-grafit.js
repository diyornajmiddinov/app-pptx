/** 191 Grafit — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 191, slug: 'grafit', name: "Grafit", mode: 'top', list: 'cols', num: 'corner', F: { head: 'Arial', body: 'Arial' },
  C: { ink: '1C1C1E', muted: '5B5B60', accent: '1C1C1E' }, photo: { r: 0.0 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'F4F4F5'],[1,'DCDCDF']]), grain(0.05)),
  tone: "toza grafika: faqat mazmun, ortiqcha bezaksiz" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["technical", "bold"], "transitions": ["cut", "fade", "wipe:r"], "cover": ["typeLetters", "stretch"], "mark": "appear", "deco": "wipe:r", "sig": {"title": "stretch", "body": "wipeWords", "item": "wipe:r", "image": "wipe:r", "number": "appear", "order": "seq", "stagger": 0.18}, "tempo": 1.05, "kenburns": false};
