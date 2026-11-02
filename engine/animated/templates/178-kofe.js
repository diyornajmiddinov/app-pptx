/** 178 Kofe — minimalist, background-driven (bottom composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 178, slug: 'kofe', name: "Kofe", mode: 'bottom', list: 'cols', num: 'corner', F: { head: 'Cambria', body: 'Calibri' },
  C: { ink: 'F5EADC', muted: 'CDB59B', accent: 'E7B77A' }, photo: { r: 0.06 }, rule: false, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'3B2618'],[1,'6B4A33']],'d'), grain(0.07)),
  tone: "samimiy suhbat: iliq, bemalol, tushunarli" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "elegant"], "transitions": ["fade", "dissolve", "pull:u"], "cover": ["riseWords", "fadeWords"], "mark": "curveUp", "deco": "curveUp", "sig": {"title": "riseWords", "body": "fade", "item": "curveUp", "image": "dissolve", "number": "curveUp", "order": "seq", "stagger": 0.26}, "tempo": 1.4, "kenburns": true};
