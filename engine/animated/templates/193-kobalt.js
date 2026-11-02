/** 193 Kobalt — minimalist, background-driven (top composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 193, slug: 'kobalt', name: "Kobalt", mode: 'top', list: 'cols', num: 'fraction', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: 'FFFFFF', muted: 'C3D3FF', accent: 'FFD84D' }, photo: { r: 0.0 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(flat('1F3FBF'), grain(0.04)),
  tone: "aniq va kuchli: rasmiy-zamonaviy, raqamlarga tayangan" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "elegant"], "transitions": ["push:l", "fade", "morph"], "cover": ["sweepIn", "stretch"], "mark": "popIn", "deco": "sweepIn", "sig": {"title": "sweepIn", "body": "fadeRight", "item": "slideRight", "image": "wipe:r", "number": "popIn", "order": "cascade", "stagger": 0.14}, "tempo": 1.05, "kenburns": true};
