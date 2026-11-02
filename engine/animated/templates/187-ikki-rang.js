/** 187 Ikki rang — minimalist, background-driven (split composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 187, slug: 'ikki-rang', name: "Ikki rang", mode: 'split', list: 'rows', num: 'big', F: { head: 'Arial', body: 'Calibri' },
  C: { ink: '1F2B2B', muted: '5E6B6B', accent: 'E07A2F', titleInk: 'F4EDE1' }, photo: { r: 0.04 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(flat('F4EDE1'), raw('<rect width="590" height="900" fill="#1F4E4A"/>')),
  tone: "aniq qarama-qarshilik: asosiy fikr chapda, dalillar o'ngda" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["bold", "elegant"], "transitions": ["split", "wipe:r", "fade"], "cover": ["split", "stretch"], "mark": "popIn", "deco": "split", "sig": {"title": "split", "body": "wipe:r", "item": ["wipe:l", "wipe:r"], "image": "split", "number": "popIn", "order": "alternate", "stagger": 0.18}, "tempo": 1.1, "kenburns": false};
