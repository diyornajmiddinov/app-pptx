/** 169 Shaftoli — minimalist, background-driven (center composition). */
const { B, compose, lin, rad, blobs, grain, flat, raw } = require('../minimal.js');
module.exports = B({ id: 169, slug: 'shaftoli', name: "Şaftoli", mode: 'center', list: 'cols', num: 'corner', F: { head: 'Georgia', body: 'Calibri' },
  C: { ink: '3B2A2A', muted: '7A6262', accent: 'E07A5F' }, photo: 'circle', rule: false, caps: false, bold: true,
  bg: (kind) => compose(flat('FFF1EA'), blobs(kind==='cover'?[[300,200,320,'FFC7B0'],[1300,300,300,'FFE3A8'],[900,800,320,'F9B7C8']]:[[100,850,300,'FFD7C6',0.8],[1550,50,260,'FFE8C2',0.8]],170)),
  tone: "iliq va do'stona: yengil ohang, ijobiy va sodda bayon" });

// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)
module.exports.anim = {"moods": ["calm", "playful"], "transitions": ["fade", "p14:gallery|dir=\"l\"", "morph"], "cover": ["springIn", "riseWords"], "mark": "springIn", "deco": "softGrow", "sig": {"title": "springIn", "body": "fadeUp", "item": "softGrow", "image": "springIn", "number": "springIn", "order": "centerOut", "stagger": 0.2}, "tempo": 1.15, "kenburns": true};
