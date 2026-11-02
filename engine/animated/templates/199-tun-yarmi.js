/** 199 Tun yarmi — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 199, slug: 'tun-yarmi', name: "Tun yarmi", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'F5F5F5', muted: '9E9E9E', accent: 'FFFFFF' }, photo: { r: 0.0 }, rule: true, caps: true, bold: true,
  bg: (kind) => compose(flat('050505'), grain(0.09)),
  tone: "jiddiy va aniq: ortiqchasiz, kuchli ta'kidlar" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["elegant", "bold"], "transitions": ["fade", "p14:flythrough|dir=\"in\"", "dissolve"], "cover": ["fadeLetters", "fadeLetters"], "mark": "focusIn", "deco": "fade", "sig": {"title": "fadeLetters", "body": "fade", "item": "focusIn", "image": "dissolve", "number": "focusIn", "order": "together", "stagger": 0.22}, "tempo": 1.35, "kenburns": true};
