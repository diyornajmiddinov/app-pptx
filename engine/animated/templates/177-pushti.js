/** 177 Pushti — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 177, slug: 'pushti', name: "Puşti", mode: 'center', list: 'rows', num: 'fraction', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '5A1E2E', muted: '8E5B68', accent: 'B83B5E' }, photo: { r: 0.2 }, rule: true, caps: false, bold: true,
  bg: (kind) => compose(lin([[0,'FDE7EC'],[1,'F8D3DC']])),
  tone: "mehrli va yumshoq: g'amxo'rlik, iliq va sodda til" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["playful", "calm"], "transitions": ["fade", "p14:ripple", "p14:gallery|dir=\"l\""], "cover": ["springIn", "fadeWords"], "mark": "springIn", "deco": "popIn", "sig": {"title": "springIn", "body": "fadeUp", "item": "popIn", "image": "softGrow", "number": "springIn", "order": "centerOut", "stagger": 0.2}, "tempo": 1.1, "kenburns": true};
