"""
Animated templates 1–200: each template's own motion, written one by one from its design and its name.
  python3 specs.py   -> writes `module.exports.anim = {...}` into animated/templates/NN-*.js (1–200)

A line: id: (moods, transitions, (cover title, closing title), mark, deco,
             (title, body, item, image, number, order, stagger), tempo, kenburns)
  mark  — icons, badges, numbers, markers inside a card: they enter after the card with this effect
  deco  — decorative shapes standing on their own
  the tuple — the template's signature scene (comes back every few slides); item may be "a/b" (cards in turn)
"""
import glob
import json
import re

T = {  # transition short names
    'vortex': 'p14:vortex|dir="r"', 'vortexL': 'p14:vortex|dir="l"', 'switch': 'p14:switch|dir="r"', 'switchL': 'p14:switch|dir="l"',
    'flip': 'p14:flip|dir="r"', 'flipL': 'p14:flip|dir="l"', 'ripple': 'p14:ripple', 'honey': 'p14:honeycomb', 'prism': 'p14:prism',
    'doors': 'p14:doors|dir="vert"', 'doorsH': 'p14:doors|dir="horz"', 'window': 'p14:window|dir="vert"', 'windowH': 'p14:window|dir="horz"',
    'ferris': 'p14:ferris|dir="l"', 'ferrisR': 'p14:ferris|dir="r"', 'gallery': 'p14:gallery|dir="l"', 'galleryR': 'p14:gallery|dir="r"',
    'conveyor': 'p14:conveyor|dir="l"', 'conveyorR': 'p14:conveyor|dir="r"', 'pan': 'p14:pan|dir="u"', 'panD': 'p14:pan|dir="d"',
    'panL': 'p14:pan|dir="l"', 'glitter': 'p14:glitter|pattern="diamond" dir="l"', 'glitterH': 'p14:glitter|pattern="hexagon" dir="r"',
    'warp': 'p14:warp|dir="in"', 'warpOut': 'p14:warp|dir="out"', 'fly': 'p14:flythrough|dir="in"', 'flyOut': 'p14:flythrough|dir="out"',
    'flash': 'p14:flash', 'shred': 'p14:shred|pattern="strip" dir="in"', 'shredR': 'p14:shred|pattern="rectangle" dir="in"',
    'reveal': 'p14:reveal|thruBlk="0"', 'revealB': 'p14:reveal|thruBlk="1"', 'wheelRev': 'p14:wheelReverse|spokes="1"',
}

S = {
    # ---- 21–40: photo, print, school, retro, tech
    21: (['elegant', 'calm'], ['fade', 'gallery', 'morph'], ('fadeWords', 'riseWords'), 'focusIn', 'fade',
         ('sweepIn', 'fadeUp', 'softGrow', 'focusIn', 'focusIn', 'seq', 0.22), 1.1, True),            # Fotojurnal: a photo essay
    22: (['elegant', 'calm'], ['galleryR', 'dissolve', 'morph'], ('focusIn', 'fadeWords'), 'fade', 'wipe:d',
         ('fadeUp', 'fade', 'fadeUp/fadeDown', 'circle', 'focusIn', 'alternate', 0.2), 1.15, True),     # Galereya: frames on a wall
    23: (['bold', 'elegant'], ['split', 'doors', 'morph'], ('splitH', 'split'), 'popIn', 'stretch',
         ('split', 'wipe:r', 'slideRight/slideLeft', 'splitIn', 'popIn', 'alternate', 0.16), 0.95, False),  # Ikki qism: two halves meet
    24: (['bold', 'calm'], ['dissolve', 'cut', 'morph'], ('focusIn', 'stretch'), 'appear', 'fade',
         ('focusIn', 'fade', 'softGrow', 'dissolve', 'popIn', 'together', 0.22), 1.0, True),            # Duotone: two inks
    25: (['calm', 'technical'], ['fade', 'cover:d', 'wipe:d'], ('fadeWords', 'fade'), 'fade', 'wipe:r',
         ('fade', 'wipe:d', 'fadeDown', 'fade', 'fade', 'seq', 0.24), 1.2, False),                      # Rasmiy: official, measured
    26: (['elegant', 'bold'], ['fly', 'fade', 'blinds'], ('fadeLetters', 'riseWords'), 'appear', 'wipe:r',
         ('wipe:r', 'fadeWords', 'blinds', 'blinds', 'focusIn', 'seq', 0.2), 1.1, True),                # Kino: film frames, credits
    27: (['elegant', 'calm'], ['p14:flip|dir="l"', 'fade', 'pull:l'], ('riseWords', 'fadeLetters'), 'fadeUp', 'fade',
         ('fadeLetters', 'fadeWords', 'peekUp', 'fade', 'fadeUp', 'seq', 0.24), 1.25, False),           # Kitob: pages turn
    28: (['calm', 'playful'], ['pull:u', 'fade', 'cover:u'], ('riseWords', 'fadeWords'), 'swing', 'drop',
         ('fadeDown', 'fadeUp', 'swing', 'drop', 'springIn', 'diagonal', 0.18), 1.05, False),           # Qog'oz: paper notes
    29: (['energetic', 'bold'], ['push:l', 'switch', 'zoom'], ('flyRight', 'popOver'), 'popOver', 'flyLeft',
         ('flyRight', 'slideRight', 'flyUp', 'flyLeft', 'popOver', 'cascade', 0.08), 0.8, False),      # Dinamika: speed lines
    30: (['playful', 'technical'], ['honey', 'fade', 'morph'], ('springIn', 'popOver'), 'popIn', 'popIn',
         ('springIn', 'fadeUp', 'popOver', 'diamond', 'popOver', 'centerOut', 0.11), 0.95, False),      # Asalari: honeycomb cells
    31: (['technical', 'energetic'], ['pan', 'conveyor', 'morph'], ('riseSettle', 'popOver'), 'bounceDrop', 'drop',
         ('riseSettle', 'fadeUp', 'bounceDrop', 'riseSettle', 'popOver', 'diagonal', 0.12), 0.95, False),  # Izometrik: blocks fall in place
    32: (['playful', 'bold'], ['p14:flash', 'push:r', 'ferrisR'], ('popOver', 'bounceDrop'), 'spinIn', 'popOver',
         ('popOver', 'fadeUp', 'popOver/spinIn', 'box', 'popOver', 'alternate', 0.1), 0.85, False),     # Komiks: panels, POW
    33: (['technical', 'calm'], ['wipe:r', 'fade', 'pan'], ('typeLetters', 'fadeLetters'), 'appear', 'wipe:r',
         ('typeLetters', 'wipeWords', 'wipe:r', 'wipe:d', 'appear', 'seq', 0.22), 1.15, False),         # Doska: chalk writing
    34: (['calm', 'technical'], ['pull:u', 'fade', 'wipe:u'], ('fadeLetters', 'fadeWords'), 'appear', 'wipe:r',
         ('fadeLetters', 'wipeWords', 'peekUp', 'fade', 'fade', 'seq', 0.2), 1.1, False),               # Daftar: notebook lines
    35: (['elegant', 'bold'], ['doors', 'galleryR', 'fade'], ('split', 'fadeLetters'), 'diamond', 'stretch',
         ('split', 'fade', 'unfold', 'diamond', 'diamond', 'centerOut', 0.18), 1.15, False),            # Art Deco: symmetric fans
    36: (['playful', 'technical'], ['checker', 'randomBar', 'cut'], ('typeLetters', 'appear'), 'appear', 'checker',
         ('appear', 'typeLetters', 'checker', 'checker', 'appear', 'diagonal', 0.08), 0.75, False),     # Piksel: 8-bit
    37: (['calm', 'elegant'], ['morph', 'fade', 'dissolve'], ('focusIn', 'riseWords'), 'softGrow', 'softGrow',
         ('focusIn', 'fadeUp', 'springIn', 'softGrow', 'softGrow', 'centerOut', 0.18), 1.1, False),     # Neumorf: soft extruded
    38: (['technical', 'playful'], ['p14:prism', 'morph', 'fade'], ('popOver', 'focusIn'), 'plus', 'box',
         ('popOver', 'fadeUp', 'box', 'box', 'plus', 'diagonal', 0.12), 0.95, False),                   # Element: periodic table
    39: (['bold', 'technical'], ['push:l', 'conveyor', 'split:h'], ('flyRight', 'stretch'), 'popIn', 'wipe:r',
         ('wipe:r', 'slideRight', 'slideRight', 'wipe:l', 'popIn', 'cascade', 0.1), 0.85, False),       # Metro: tiles, lines
    40: (['playful', 'calm'], ['cover:l', 'pull:r', 'fade'], ('fadeWords', 'swingRight'), 'swing', 'drop',
         ('swingRight', 'fadeUp', 'drop', 'swingLeft', 'springIn', 'seq', 0.16), 1.0, False),           # Pochta: stamps, envelopes
    # ---- 41–70: themed objects
    41: (['technical', 'elegant'], ['blinds:v', 'fade', 'pull:l'], ('typeLetters', 'fadeLetters'), 'appear', 'wipe:d',
         ('typeLetters', 'wipe:d', 'blindsV', 'wipe:d', 'appear', 'seq', 0.16), 1.0, False),            # Gazeta: columns set in type
    42: (['elegant', 'playful'], ['glitter', 'fade', 'morph'], ('focusIn', 'fadeLetters'), 'diamond', 'diamond',
         ('focusIn', 'fade', 'diamond', 'diamond', 'diamond', 'centerOut', 0.16), 1.1, False),          # Vitraj: glass pieces light up
    43: (['energetic', 'elegant'], ['vortex', 'fly', 'warp'], ('spinIn', 'arcRight'), 'spinIn', 'curveUp',
         ('arcRight', 'fadeUp', 'arcLeft/arcRight', 'spinIn', 'spinIn', 'alternate', 0.14), 1.0, True),  # Kosmos: orbits
    44: (['energetic', 'technical'], ['warp', 'zoom', 'p14:flash'], ('sweepIn', 'stretch'), 'popIn', 'stretch',
         ('stretch', 'fadeUp', 'sweepIn', 'zoomIn', 'popOver', 'cascade', 0.1), 0.9, False),            # Sintveyv: neon grid
    45: (['playful', 'bold'], ['ferris', 'push:u', 'p14:flash'], ('bounceDrop', 'popOver'), 'spinIn', 'spinIn',
         ('bounceDrop', 'fadeUp', 'spinIn/popOver', 'wedge', 'popOver', 'alternate', 0.11), 0.9, False),  # Memfis: squiggles, confetti
    46: (['elegant', 'calm'], ['p14:reveal|thruBlk="1"', 'fade', 'doors'], ('fadeLetters', 'riseWords'), 'wheel4', 'wheel',
         ('riseWords', 'fade', 'wheel', 'circle', 'wheel4', 'centerOut', 0.2), 1.25, True),             # Suzani: rosettes bloom
    47: (['bold', 'playful'], ['pull:r', 'cover:r', 'cut'], ('stretch', 'typeLetters'), 'popIn', 'wipe:r',
         ('stretch', 'wipe:r', 'slideRight', 'wipe:r', 'popIn', 'seq', 0.12), 0.9, False),              # Chipta: tickets torn in
    48: (['elegant'], ['dissolve', 'morph', 'fade'], ('fadeLetters', 'fadeWords'), 'focusIn', 'dissolve',
         ('fadeLetters', 'fadeWords', 'softGrow', 'dissolve', 'focusIn', 'together', 0.26), 1.4, True),  # Marmar: still stone
    49: (['technical', 'bold'], ['cut', 'wipe:r', 'split'], ('typeLetters', 'stretch'), 'appear', 'stretch',
         ('typeLetters', 'wipeWords', 'stretch', 'unfold', 'stretch', 'seq', 0.14), 0.9, False),        # Shrift: type specimen
    50: (['calm', 'elegant'], ['fade', 'pull:u', 'dissolve'], ('riseWords', 'fadeWords'), 'swing', 'curveUp',
         ('riseWords', 'fadeUp', 'curveUp', 'peekUp', 'swing', 'seq', 0.22), 1.25, True),               # Gerbariy: pressed leaves
    51: (['calm', 'elegant'], ['dissolve', 'fade', 'reveal'], ('fadeWords', 'focusIn'), 'focusIn', 'dissolve',
         ('focusIn', 'fade', 'dissolve', 'dissolve', 'softGrow', 'diagonal', 0.2), 1.3, True),          # Akvarel: paint bleeds in
    52: (['playful', 'energetic'], ['pan', 'push:d', 'ferris'], ('bounceDrop', 'riseSettle'), 'bounceDrop', 'bounceDrop',
         ('bounceDrop', 'fadeUp', 'bounceDrop', 'bounceDrop', 'popOver', 'diagonal', 0.1), 0.85, False),  # Konstruktor: bricks click
    53: (['technical', 'playful'], ['push:l', 'push:u', 'morph'], ('springIn', 'popOver'), 'popOver', 'riseUp',
         ('springIn', 'riseUp', 'riseSettle', 'springIn', 'popOver', 'seq', 0.12), 0.85, False),        # Smartfon: app notifications
    54: (['bold', 'technical'], ['wheel', 'circle', 'cut'], ('wheel', 'zoomIn'), 'wheel', 'circle',
         ('zoomIn', 'fade', 'circle', 'wheel', 'wheel', 'centerOut', 0.1), 0.9, False),                 # Op-art: spirals
    55: (['energetic', 'bold'], ['push:u', 'zoom', 'flash'], ('popOver', 'stretch'), 'popOver', 'flyUp',
         ('stretch', 'flyUp', 'flyUp', 'zoomIn', 'popOver', 'cascade', 0.09), 0.85, False),             # Stadion: scoreboard
    56: (['playful', 'calm'], ['honey', 'fade', 'morph'], ('riseSettle', 'springIn'), 'swing', 'drop',
         ('riseSettle', 'fadeUp', 'swingLeft/swingRight', 'drop', 'springIn', 'alternate', 0.13), 1.0, False),  # Pazl: pieces slot in
    57: (['playful', 'elegant'], ['morph', 'fade', 'ripple'], ('focusIn', 'popOver'), 'popOver', 'stretch',
         ('focusIn', 'fade', 'curveUp/curveDown', 'popOver', 'popOver', 'centerOut', 0.14), 1.0, False),  # Aql xaritasi: branches grow
    58: (['technical'], ['wipe:d', 'blinds', 'cut'], ('typeLetters', 'wipe:r'), 'appear', 'wipe:d',
         ('wipe:r', 'wipe:d', 'wipe:d', 'blinds', 'appear', 'seq', 0.09), 0.8, False),                  # Jadval: rows fill in
    59: (['calm', 'technical'], ['pull:u', 'flipL', 'fade'], ('fadeLetters', 'peekUp'), 'popIn', 'peekUp',
         ('peekUp', 'fade', 'peekUp', 'unfold', 'popIn', 'seq', 0.14), 1.05, False),                    # Kalendar: pages flip up
    60: (['technical', 'playful'], ['windowH', 'cut', 'zoom'], ('typeLetters', 'popIn'), 'appear', 'box',
         ('box', 'typeLetters', 'popIn', 'box', 'appear', 'cascade', 0.1), 0.85, False),                # Retro OS: windows open
    61: (['elegant', 'playful'], ['flip', 'prism', 'fade'], ('unfold', 'stretch'), 'diamond', 'unfold',
         ('unfold', 'fade', 'stretch/unfold', 'diamond', 'diamond', 'alternate', 0.16), 1.05, False),   # Origami: folds open
    62: (['energetic', 'bold'], ['flash', 'cut', 'fade'], ('fadeLetters', 'typeLetters'), 'appear', 'fade',
         ('fadeLetters', 'fade', 'dissolve', 'fade', 'appear', 'together', 0.12), 0.9, False),          # Neon: tubes flicker on
    63: (['technical', 'calm'], ['push:u', 'wipe:u', 'fade'], ('typeLetters', 'wipeWords'), 'appear', 'wipe:d',
         ('typeLetters', 'wipe:d', 'wipe:d', 'wipe:d', 'appear', 'seq', 0.1), 0.9, False),              # Chek: receipt prints
    64: (['playful', 'calm'], ['cover:u', 'fade', 'gallery'], ('swingRight', 'drop'), 'drop', 'drop',
         ('drop', 'fadeUp', 'swing', 'swingLeft', 'drop', 'diagonal', 0.14), 1.05, False),             # Probka: pinned notes
    65: (['elegant', 'energetic'], ['wheel', 'ferrisR', 'morph'], ('wheel', 'spinIn'), 'spinIn', 'wheel',
         ('spinIn', 'fadeWords', 'wheel', 'wheel', 'spinIn', 'seq', 0.16), 1.0, False),                 # Vinil: the record turns
    66: (['technical'], ['conveyor', 'wipe:r', 'p14:glitter|pattern="hexagon" dir="l"'], ('typeLetters', 'sweepIn'), 'appear', 'wipe:r',
         ('sweepIn', 'wipe:r', 'wipe:r/wipe:d', 'box', 'appear', 'alternate', 0.1), 0.85, False),       # Plata: current runs along traces
    67: (['elegant', 'technical'], ['checker', 'fade', 'morph'], ('focusIn', 'fadeLetters'), 'drop', 'checker',
         ('focusIn', 'fade', 'drop', 'checker', 'drop', 'diagonal', 0.16), 1.05, False),               # Shaxmat: pieces placed
    68: (['calm', 'energetic'], ['ripple', 'panD', 'fade'], ('riseWords', 'swing'), 'swing', 'curveUp',
         ('riseSettle', 'fadeUp', 'curveUp/curveDown', 'riseSettle', 'swing', 'alternate', 0.16), 1.15, True),  # Dengiz: waves
    69: (['technical', 'energetic'], ['zoom', 'switch', 'cut'], ('typeLetters', 'stretch'), 'zoomIn', 'stretch',
         ('stretch', 'typeLetters', 'zoomIn', 'box', 'zoomIn', 'centerOut', 0.1), 0.85, False),         # HUD: targets lock on
    70: (['calm', 'technical'], ['cover:d', 'fade', 'wipe:d'], ('typeLetters', 'fadeWords'), 'popIn', 'wipe:r',
         ('wipe:r', 'fadeWords', 'wipe:r', 'fade', 'popIn', 'seq', 0.18), 1.1, False),                 # Blanka: form filled, stamped
    # ---- 71–100: materials and places (skin family)
    71: (['bold', 'playful'], ['pull:l', 'cut', 'push:r'], ('stretch', 'swingRight'), 'popIn', 'wipe:r',
         ('stretch', 'fadeUp', 'swingRight', 'stretch', 'popIn', 'cascade', 0.12), 0.95, False),        # Jinsi: stitched patches
    72: (['calm', 'elegant'], ['dissolve', 'panL', 'fade'], ('fadeWords', 'riseWords'), 'focusIn', 'fadeRight',
         ('fadeRight', 'fade', 'fadeRight', 'dissolve', 'focusIn', 'seq', 0.26), 1.35, True),           # Sahro: heat haze, slow
    73: (['calm', 'technical'], ['shredR', 'dissolve', 'fade'], ('focusIn', 'fadeLetters'), 'diamond', 'focusIn',
         ('focusIn', 'fade', 'diamond', 'focusIn', 'diamond', 'centerOut', 0.16), 1.15, False),         # Muz: frost crystallizes
    74: (['calm', 'playful'], ['fade', 'pan', 'dissolve'], ('riseWords', 'fadeWords'), 'swing', 'riseUp',
         ('riseUp', 'fadeUp', 'riseSettle', 'peekUp', 'swing', 'seq', 0.2), 1.2, True),                 # O'rmon: trees grow
    75: (['calm', 'elegant'], ['ripple', 'fade', 'panD'], ('riseWords', 'fadeWords'), 'curveUp', 'riseUp',
         ('riseWords', 'fadeUp', 'curveUp', 'riseUp', 'springIn', 'seq', 0.2), 1.2, True),              # Okean: bubbles rise
    76: (['calm', 'energetic'], ['pan', 'fade', 'fly'], ('riseWords', 'focusIn'), 'riseSettle', 'peekUp',
         ('peekUp', 'fadeUp', 'riseSettle', 'peekUp', 'riseSettle', 'seq', 0.18), 1.1, True),          # Tog': peaks rise
    77: (['energetic', 'technical'], ['push:l', 'fly', 'morph'], ('flyRight', 'fadeLetters'), 'appear', 'wipe:u',
         ('sweepIn', 'fadeUp', 'wipe:u', 'wipe:u', 'popIn', 'cascade', 0.1), 0.9, True),               # Shahar: lights switch on
    78: (['calm', 'elegant'], ['pull:l', 'fade', 'conveyor'], ('fadeLetters', 'riseWords'), 'slideRight', 'slideLeft',
         ('slideRight', 'fadeWords', 'slideLeft', 'slideRight', 'slideRight', 'seq', 0.16), 1.1, False),  # Javon: books slide out
    79: (['technical', 'calm'], ['pull:u', 'cover:u', 'fade'], ('peekUp', 'fadeWords'), 'peekUp', 'peekUp',
         ('peekUp', 'fade', 'peekUp', 'wipe:u', 'popIn', 'seq', 0.14), 1.0, False),                    # Papka: tabs lift
    80: (['elegant', 'bold'], ['doors', 'fade', 'p14:reveal|thruBlk="1"'], ('split', 'fadeLetters'), 'focusIn', 'split',
         ('split', 'fadeWords', 'focusIn', 'split', 'focusIn', 'centerOut', 0.22), 1.2, True),          # Teatr: curtains part
    81: (['playful', 'technical'], ['zoom:out', 'cut', 'flash'], ('zoomIn', 'stretch'), 'appear', 'unfold',
         ('unfold', 'fade', 'zoomIn', 'unfold', 'appear', 'seq', 0.12), 0.9, False),                    # Televizor: CRT switches on
    82: (['playful', 'energetic'], ['wheel:4', 'push:l', 'fade'], ('wheel', 'typeLetters'), 'wheel', 'slideRight',
         ('wheel', 'slideRight', 'slideRight', 'wheel', 'wheel', 'seq', 0.12), 0.95, False),           # Kasseta: reels spin
    83: (['technical', 'elegant'], ['p14:flash', 'circle', 'fade'], ('focusIn', 'zoomIn'), 'zoomIn', 'focusIn',
         ('focusIn', 'fade', 'focusIn', 'circle', 'zoomIn', 'centerOut', 0.14), 1.0, True),            # Kamera: focus pulls
    84: (['technical', 'playful'], ['ripple', 'fade', 'morph'], ('riseSettle', 'fadeLetters'), 'bounceDrop', 'riseUp',
         ('riseSettle', 'fadeUp', 'riseUp', 'circle', 'bounceDrop', 'seq', 0.14), 1.0, False),         # Laboratoriya: flasks bubble
    85: (['technical', 'elegant'], ['fade', 'wipe:r', 'morph'], ('fadeLetters', 'typeLetters'), 'fade', 'wipe:r',
         ('fadeLetters', 'wipeWords', 'wipe:r', 'wipe:r', 'fade', 'seq', 0.2), 1.1, False),             # Formula: chalk equations
    86: (['elegant', 'playful'], ['fade', 'push:l', 'ripple'], ('fadeLetters', 'swing'), 'bounceDrop', 'slideRight',
         ('sweepIn', 'fade', 'bounceDrop', 'wipe:r', 'bounceDrop', 'seq', 0.12), 1.0, False),          # Nota: notes bounce on staves
    87: (['elegant', 'calm'], ['wipe:r', 'dissolve', 'fade'], ('sweepIn', 'fadeLetters'), 'diamond', 'wipe:r',
         ('sweepIn', 'fade', 'wipe:r', 'wipe:l', 'diamond', 'seq', 0.18), 1.15, True),                  # Atlas (ikat): woven bands
    88: (['technical', 'energetic'], ['glitterH', 'dissolve', 'flash'], ('fadeLetters', 'focusIn'), 'focusIn', 'dissolve',
         ('dissolve', 'fadeLetters', 'focusIn', 'dissolve', 'focusIn', 'diagonal', 0.12), 1.0, False),  # Hologramma: shimmers in
    89: (['bold', 'playful'], ['strips:lu', 'push:r', 'flash'], ('sweepIn', 'popOver'), 'popOver', 'strips',
         ('sweepIn', 'fadeUp', 'strips', 'strips', 'popOver', 'diagonal', 0.1), 0.85, False),           # Graffiti: spray strokes
    90: (['calm', 'technical'], ['wipe:r', 'fade', 'dissolve'], ('typeLetters', 'fadeLetters'), 'fade', 'wipe:r',
         ('wipe:r', 'wipeWords', 'wipe:d', 'wipe:r', 'fade', 'seq', 0.2), 1.2, False),                  # Eskiz: drawn by pencil
    91: (['technical'], ['wipe:d', 'morph', 'cut'], ('typeLetters', 'wipe:r'), 'appear', 'box',
         ('wipe:r', 'wipe:r', 'box', 'box', 'appear', 'seq', 0.1), 0.85, False),                        # Wireframe: boxes outlined
    92: (['technical', 'playful'], ['push:l', 'conveyorR', 'fade'], ('slideRight', 'popOver'), 'popIn', 'slideRight',
         ('slideRight', 'fadeUp', 'slideRight', 'slideRight', 'popIn', 'cascade', 0.12), 0.9, False),  # Kanban: cards move across
    93: (['playful'], ['ferrisR', 'push:u', 'p14:flash'], ('popOver', 'spinIn'), 'spinIn', 'popOver',
         ('popOver', 'fadeUp', 'popOver/swing', 'popOver', 'spinIn', 'alternate', 0.1), 0.85, False),   # Stiker: stickers slapped on
    94: (['elegant', 'calm'], ['fade', 'dissolve', 'p14:flip|dir="l"'], ('fadeLetters', 'fadeWords'), 'fade', 'wipe:r',
         ('fadeLetters', 'fadeWords', 'wipe:r', 'dissolve', 'fade', 'seq', 0.26), 1.4, True),           # Qo'lyozma: ink writes slowly
    95: (['bold', 'technical'], ['shred', 'cut', 'split:h'], ('stretch', 'splitH'), 'popIn', 'splitH',
         ('splitH', 'wipe:r', 'stretch', 'splitH', 'popIn', 'seq', 0.12), 0.85, False),                  # Metall: plates slide shut
    96: (['calm', 'playful'], ['pull:r', 'fade', 'cover:r'], ('riseWords', 'fadeWords'), 'swing', 'slideRight',
         ('slideRight', 'fadeUp', 'slideRight', 'wipe:r', 'swing', 'seq', 0.18), 1.15, False),          # Yog'och: planks laid
    97: (['technical', 'playful'], ['push:d', 'cut', 'fade'], ('typeLetters', 'popIn'), 'popIn', 'drop',
         ('typeLetters', 'wipeWords', 'drop', 'drop', 'popIn', 'seq', 0.08), 0.8, False),               # Klaviatura: keys pressed
    98: (['playful', 'elegant'], ['flip', 'flipL', 'fade'], ('swingRight', 'spinIn'), 'spinIn', 'swing',
         ('swingRight', 'fadeUp', 'swingLeft/swingRight', 'spinIn', 'spinIn', 'alternate', 0.14), 1.0, False),  # Karta: cards dealt
    99: (['calm', 'elegant'], ['fade', 'fly', 'pan'], ('riseWords', 'focusIn'), 'curveUp', 'curveUp',
         ('riseWords', 'fadeUp', 'curveUp', 'focusIn', 'curveUp', 'diagonal', 0.2), 1.25, True),        # Osmon: clouds drift
    100: (['technical', 'bold'], ['dissolve', 'flash', 'cut'], ('focusIn', 'fadeLetters'), 'focusIn', 'dissolve',
          ('dissolve', 'fade', 'focusIn', 'dissolve', 'popOver', 'centerOut', 0.14), 1.0, False),         # Termal: heat appears
    # ---- 101–160: each composes its own slides
    101: (['bold', 'elegant'], ['push:u', 'wipe:u', 'fade'], ('riseWords', 'peekUp'), 'peekUp', 'wipe:u',
          ('peekUp', 'wipe:u', 'riseUp', 'wipe:u', 'popIn', 'seq', 0.14), 1.0, False),                   # Vertikal: everything rises
    102: (['calm', 'technical'], ['push:u', 'cover:u', 'fade'], ('fadeWords', 'riseSettle'), 'riseUp', 'wipe:u',
          ('riseSettle', 'fadeUp', 'riseUp', 'wipe:u', 'riseUp', 'cascade', 0.14), 1.0, False),          # Pastki: the bottom bar slides up
    103: (['elegant', 'calm'], ['circle', 'fade', 'zoom'], ('focusIn', 'fadeLetters'), 'focusIn', 'circle',
          ('focusIn', 'fade', 'softGrow', 'circle', 'focusIn', 'centerOut', 0.2), 1.15, False),         # Markaz: from the centre
    104: (['bold', 'calm'], ['wipe:l', 'fade', 'cut'], ('stretch', 'fadeWords'), 'popIn', 'wipe:l',
          ('wipe:l', 'fade', 'wipe:l', 'wipe:r', 'popIn', 'seq', 0.14), 1.0, False),                     # Rangli maydon: colour floods
    105: (['technical', 'bold'], ['blinds', 'wipe:r', 'push:l'], ('sweepIn', 'stretch'), 'stretch', 'stretch',
          ('stretch', 'wipe:r', 'sweepIn', 'blinds', 'stretch', 'cascade', 0.1), 0.9, False),            # Chiziqlar: bands sweep
    106: (['elegant', 'calm'], ['fade', 'cover:d', 'dissolve'], ('fadeLetters', 'fadeWords'), 'fade', 'unfold',
          ('fadeLetters', 'fadeWords', 'unfold', 'unfold', 'fade', 'seq', 0.26), 1.35, False),           # Maktub: a letter unfolds
    107: (['playful', 'calm'], ['push:u', 'fade', 'morph'], ('springIn', 'fadeWords'), 'popIn', 'popOver',
          ('springIn', 'fadeUp', 'swingLeft/swingRight', 'springIn', 'popOver', 'alternate', 0.18), 1.0, False),  # Suhbat: chat bubbles
    108: (['technical', 'elegant'], ['fade', 'pull:l', 'wipe:r'], ('fadeLetters', 'typeLetters'), 'fade', 'wipe:r',
          ('typeLetters', 'fadeWords', 'wipe:r', 'fade', 'fade', 'seq', 0.18), 1.1, False),              # Lug'at: entries defined
    109: (['elegant', 'technical'], ['doorsH', 'fade', 'morph'], ('unfold', 'fadeLetters'), 'fade', 'stretch',
          ('unfold', 'fade', 'stretch/unfold', 'stretch', 'popIn', 'alternate', 0.16), 1.05, False),     # Buklet: panels fold out
    110: (['bold', 'playful'], ['cut', 'checker:v', 'push:r'], ('stretch', 'appear'), 'appear', 'stretch',
          ('stretch', 'appear', 'stretch/unfold', 'unfold', 'appear', 'diagonal', 0.1), 0.8, False),     # Mondrian: blocks fill
    111: (['playful', 'technical'], ['zoom', 'fade', 'plus'], ('popOver', 'focusIn'), 'popOver', 'popIn',
          ('popOver', 'fadeUp', 'popOver', 'plus', 'popOver', 'seq', 0.11), 0.9, False),                 # Piktogramma: icons pop
    112: (['calm', 'elegant'], ['wipe:u', 'fade', 'dissolve'], ('riseWords', 'fadeWords'), 'riseUp', 'splitH',
          ('splitH', 'fadeUp', 'riseUp', 'splitH', 'riseSettle', 'seq', 0.24), 1.3, True),               # Ufq: the horizon opens
    113: (['technical', 'calm'], ['wedge', 'fade', 'morph'], ('focusIn', 'fadeLetters'), 'wedge', 'wedge',
          ('wedge', 'fade', 'wedge', 'wedge', 'wedge', 'seq', 0.16), 1.0, False),                        # Chorak: quarter sweeps
    114: (['energetic', 'bold'], ['flash', 'cut', 'zoom'], ('popOver', 'stretch'), 'popOver', 'flyRight',
          ('stretch', 'flyRight', 'flyRight', 'zoomIn', 'popOver', 'cascade', 0.08), 0.8, False),        # Efir: live, on air
    115: (['technical', 'calm'], ['cover:u', 'pull:u', 'fade'], ('peekUp', 'fadeWords'), 'peekUp', 'riseUp',
          ('peekUp', 'fade', 'riseUp', 'peekUp', 'riseUp', 'reverse', 0.12), 1.0, False),                # Qatlam: tabs stack
    116: (['energetic', 'technical'], ['push:u', 'pan', 'fade'], ('riseSettle', 'peekUp'), 'riseSettle', 'riseUp',
          ('riseSettle', 'fadeUp', 'riseSettle', 'wipe:u', 'riseSettle', 'diagonal', 0.12), 0.95, False),  # Zinapoya: step by step up
    117: (['elegant', 'playful'], ['circle', 'ripple', 'fade'], ('focusIn', 'riseWords'), 'circle', 'circle',
          ('focusIn', 'fade', 'circle', 'circle', 'circle', 'centerOut', 0.16), 1.1, True),              # Doira kadr: discs open
    118: (['playful', 'calm'], ['pan', 'fade', 'ferris'], ('curveUp', 'arcRight'), 'curveUp', 'curveDown',
          ('arcRight', 'fadeUp', 'curveUp/curveDown', 'arcLeft', 'curveUp', 'alternate', 0.16), 1.05, True),  # Ilon yo'l: a winding road
    119: (['elegant', 'technical'], ['fade', 'wipe:l', 'pull:l'], ('fadeLetters', 'sweepIn'), 'fadeLeft', 'wipe:d',
          ('sweepIn', 'fadeWords', 'fadeLeft', 'wipe:r', 'fade', 'seq', 0.2), 1.15, False),              # Hoshiya: margin notes
    120: (['bold', 'energetic'], ['push:l', 'cover:l', 'switchL'], ('stretch', 'flyRight'), 'popIn', 'wipe:r',
          ('stretch', 'slideRight', 'swingRight', 'wipe:r', 'popOver', 'cascade', 0.1), 0.9, False),     # Banner: banners unfurl
    121: (['elegant'], ['fade', 'circle', 'morph'], ('fadeLetters', 'riseWords'), 'wheel', 'circle',
          ('fadeLetters', 'fade', 'arcRight', 'circle', 'wheel', 'seq', 0.24), 1.35, True),              # Oltin kesim: a golden spiral
    122: (['technical', 'bold'], ['randomBar:h', 'blinds', 'cut'], ('typeLetters', 'blinds'), 'blinds', 'blinds',
          ('blinds', 'typeLetters', 'blinds', 'blinds', 'blinds', 'seq', 0.09), 0.85, False),            # Tablo: split-flap board
    123: (['playful', 'elegant'], ['circle', 'dissolve', 'morph'], ('focusIn', 'popOver'), 'circle', 'circle',
          ('focusIn', 'fade', 'circle', 'dissolve', 'popOver', 'centerOut', 0.18), 1.05, False),        # Venn: circles overlap
    124: (['technical', 'energetic'], ['push:u', 'fade', 'p14:prism'], ('riseSettle', 'stretch'), 'riseSettle', 'wipe:u',
          ('riseSettle', 'fadeUp', 'wipe:u', 'wipe:u', 'riseSettle', 'reverse', 0.12), 0.95, False),     # Piramida: built from the base
    125: (['technical', 'playful'], ['checker', 'cut', 'fade'], ('typeLetters', 'appear'), 'appear', 'checker',
          ('appear', 'typeLetters', 'checker', 'checker', 'appear', 'diagonal', 0.07), 0.8, False),      # Krossvord: letters fill cells
    126: (['technical'], ['wipe:r', 'conveyor', 'fade'], ('sweepIn', 'wipe:r'), 'popIn', 'stretch',
          ('wipe:r', 'fade', 'stretch', 'wipe:r', 'popIn', 'cascade', 0.1), 0.9, False),                 # Gant: bars stretch on a timeline
    127: (['technical', 'elegant'], ['circle', 'vortex', 'fade'], ('focusIn', 'wheel'), 'wheel', 'wheel',
          ('wheel', 'fade', 'wheel', 'wheel', 'popOver', 'centerOut', 0.14), 1.0, False),               # O'rgimchak: radar web spreads
    128: (['calm', 'elegant'], ['fade', 'pan', 'morph'], ('riseWords', 'focusIn'), 'popIn', 'peekUp',
          ('peekUp', 'fadeUp', 'riseSettle', 'peekUp', 'popIn', 'reverse', 0.16), 1.15, True),           # Shajara: a tree branches up
    129: (['technical', 'playful'], ['zoom', 'circle', 'fade'], ('focusIn', 'zoomIn'), 'zoomIn', 'circle',
          ('zoomIn', 'fade', 'focusIn', 'circle', 'zoomIn', 'seq', 0.16), 1.0, True),                    # Lupa: magnified
    130: (['playful', 'bold'], ['push:r', 'cut', 'ferris'], ('bounceDrop', 'swingRight'), 'drop', 'swingRight',
          ('swingRight', 'fadeUp', 'swingRight', 'bounceDrop', 'drop', 'cascade', 0.09), 0.85, False),   # Domino: tiles topple in a row
    131: (['technical', 'calm'], ['wipe:r', 'fade', 'pull:r'], ('sweepIn', 'typeLetters'), 'appear', 'stretch',
          ('stretch', 'wipe:r', 'wipe:r', 'wipe:r', 'appear', 'seq', 0.12), 1.0, False),                 # Chizg'ich: measured off
    132: (['elegant', 'technical'], ['wheel', 'circle', 'fade'], ('spinIn', 'focusIn'), 'spinIn', 'wheel',
          ('focusIn', 'fade', 'arcLeft/arcRight', 'wheel', 'spinIn', 'alternate', 0.18), 1.1, True),     # Kompas: the needle swings
    133: (['technical', 'bold'], ['split:h', 'split', 'cut'], ('splitH', 'split'), 'splitH', 'splitH',
          ('splitH', 'wipe:d', 'splitH', 'split', 'splitH', 'seq', 0.12), 0.95, False),                  # Kesim: cut open
    134: (['technical', 'calm'], ['plus', 'fade', 'morph'], ('focusIn', 'stretch'), 'plus', 'plus',
          ('plus', 'fade', 'plus', 'plus', 'popIn', 'diagonal', 0.14), 1.0, False),                      # Kvadrant: axes cross
    135: (['elegant', 'bold'], ['doors', 'window', 'fade'], ('riseWords', 'split'), 'peekUp', 'wipe:u',
          ('wipe:u', 'fade', 'peekUp', 'split', 'peekUp', 'seq', 0.18), 1.1, True),                      # Fasad: columns rise
    136: (['energetic', 'playful'], ['conveyor', 'push:l', 'fade'], ('flyRight', 'slideRight'), 'slideRight', 'flyRight',
          ('flyRight', 'slideRight', 'flyRight', 'flyRight', 'popIn', 'cascade', 0.09), 0.85, True),     # Poyezd: wagons pull in
    137: (['technical', 'elegant'], ['p14:prism', 'glitterH', 'fade'], ('fadeLetters', 'focusIn'), 'diamond', 'strips',
          ('focusIn', 'fade', 'strips', 'diamond', 'diamond', 'diagonal', 0.14), 1.05, False),           # Prizma: light splits
    138: (['playful', 'technical'], ['honey', 'fade', 'morph'], ('spinIn', 'riseSettle'), 'spinIn', 'spinIn',
          ('spinIn', 'fade', 'spinIn/swing', 'diamond', 'spinIn', 'alternate', 0.12), 0.95, False),      # Tangram: pieces turn into place
    139: (['elegant', 'technical'], ['wipe:r', 'fade', 'morph'], ('sweepIn', 'fadeLetters'), 'circle', 'wipe:r',
          ('sweepIn', 'fade', 'wipe:r', 'circle', 'circle', 'seq', 0.16), 1.05, False),                  # Zanjir: links join
    140: (['elegant', 'calm'], ['fade', 'dissolve', 'morph'], ('focusIn', 'swing'), 'swing', 'drop',
          ('focusIn', 'fade', 'swing', 'drop', 'swing', 'alternate', 0.2), 1.2, False),                  # Tarozi: pans balance
    141: (['technical', 'playful'], ['wedge', 'cut', 'fade'], ('typeLetters', 'sweepIn'), 'appear', 'wipe:d',
          ('sweepIn', 'fade', 'wipe:d/wipe:r', 'box', 'appear', 'alternate', 0.1), 0.95, False),         # Labirint: the path traced
    142: (['technical', 'calm'], ['wipe:d', 'fade', 'cut'], ('typeLetters', 'wipe:r'), 'appear', 'wipe:r',
          ('wipe:r', 'wipe:d', 'wipe:r', 'fade', 'appear', 'seq', 0.08), 0.9, False),                    # Tarkib: nutrition label lines
    143: (['elegant', 'technical'], ['flip', 'fade', 'cover:l'], ('typeLetters', 'fadeLetters'), 'popOver', 'fade',
          ('fadeLetters', 'typeLetters', 'fadeUp', 'fade', 'popOver', 'seq', 0.18), 1.05, False),        # Pasport: stamped pages
    144: (['elegant', 'bold'], ['glitter', 'fade', 'p14:reveal|thruBlk="1"'], ('focusIn', 'fadeLetters'), 'wheel4', 'dissolve',
          ('focusIn', 'fade', 'dissolve', 'circle', 'wheel4', 'centerOut', 0.2), 1.2, False),            # Banknota: guilloche shimmers
    145: (['technical'], ['wipe:d', 'cut', 'push:u'], ('typeLetters', 'wipe:d'), 'appear', 'wipe:d',
          ('typeLetters', 'wipe:d', 'wipe:d', 'blinds', 'appear', 'seq', 0.12), 0.9, False),             # Printer: printed line by line
    146: (['elegant', 'calm'], ['dissolve', 'fade', 'pan'], ('fadeLetters', 'riseWords'), 'dissolve', 'riseUp',
          ('riseWords', 'fadeWords', 'riseUp', 'dissolve', 'dissolve', 'seq', 0.26), 1.4, True),         # Bitiktosh: carved, ancient
    147: (['playful', 'energetic'], ['push:d', 'cut', 'checker'], ('bounceDrop', 'drop'), 'bounceDrop', 'bounceDrop',
          ('bounceDrop', 'drop', 'bounceDrop', 'drop', 'bounceDrop', 'diagonal', 0.09), 0.8, False),     # Bloklar: falling blocks
    148: (['calm', 'technical'], ['pull:u', 'fade', 'cover:u'], ('peekUp', 'typeLetters'), 'peekUp', 'peekUp',
          ('peekUp', 'fade', 'peekUp', 'peekUp', 'popIn', 'seq', 0.14), 1.05, False),                    # Katalog: cards pulled up
    149: (['bold', 'energetic'], ['zoom', 'push:l', 'cut'], ('popOver', 'zoomIn'), 'popOver', 'popOver',
          ('popOver', 'fadeUp', 'popOver', 'zoomIn', 'popOver', 'seq', 0.11), 0.9, False),               # Yo'l belgilari: signs pop up
    150: (['elegant', 'calm'], ['dissolve', 'fade', 'flash'], ('focusIn', 'fadeLetters'), 'focusIn', 'dissolve',
          ('dissolve', 'fade', 'dissolve', 'dissolve', 'focusIn', 'seq', 0.26), 1.35, True),             # Fotolaboratoriya: photos develop
    151: (['elegant', 'technical'], ['p14:flip|dir="l"', 'fade', 'pull:l'], ('fadeLetters', 'riseWords'), 'fade', 'fade',
          ('riseWords', 'fadeWords', 'fadeUp', 'fade', 'fade', 'seq', 0.22), 1.2, False),                # Ensiklopediya: a reference page
    152: (['playful', 'calm'], ['cover:d', 'fade', 'p14:ripple'], ('swingRight', 'fadeWords'), 'popIn', 'drop',
          ('swingRight', 'fadeUp', 'riseSettle', 'drop', 'popIn', 'seq', 0.16), 1.05, False),           # Retsept: a recipe card
    153: (['technical', 'elegant'], ['vortexL', 'fade', 'morph'], ('fadeLetters', 'spinIn'), 'spinIn', 'curveUp',
          ('curveUp', 'fade', 'curveUp/curveDown', 'spinIn', 'spinIn', 'alternate', 0.12), 1.05, False),  # DNK: the helix twists
    154: (['technical', 'playful'], ['vortex', 'ripple', 'fade'], ('popOver', 'focusIn'), 'popOver', 'popIn',
          ('popOver', 'fade', 'springIn', 'popOver', 'popOver', 'centerOut', 0.12), 0.95, False),       # Molekula: atoms bond
    155: (['elegant', 'bold'], ['fade', 'panD', 'dissolve'], ('riseWords', 'fadeLetters'), 'riseUp', 'riseUp',
          ('riseWords', 'riseUp', 'riseUp', 'fade', 'riseUp', 'seq', 0.2), 1.25, False),                 # Titrlar: credits roll up
    156: (['technical', 'calm'], ['wipe:r', 'cut', 'fade'], ('typeLetters', 'typeLetters'), 'appear', 'wipe:r',
          ('typeLetters', 'wipeWords', 'wipe:r', 'wipe:r', 'appear', 'seq', 0.18), 1.0, False),          # Telegramma: ticker tape
    157: (['playful', 'technical'], ['windowH', 'push:d', 'fade'], ('unfold', 'bounceDrop'), 'bounceDrop', 'unfold',
          ('unfold', 'fadeUp', 'bounceDrop', 'unfold', 'bounceDrop', 'diagonal', 0.11), 0.95, False),    # Quti: boxes open, land
    158: (['technical', 'bold'], ['cut', 'push:l', 'checker'], ('swingRight', 'drop'), 'swing', 'drop',
          ('drop', 'fadeUp', 'swing', 'drop', 'swing', 'diagonal', 0.1), 0.9, False),                    # Asboblar: tools hung up
    159: (['energetic', 'technical'], ['zoom', 'fade', 'cut'], ('focusIn', 'stretch'), 'popIn', 'stretch',
          ('focusIn', 'fade', 'stretch', 'zoomIn', 'popIn', 'seq', 0.12), 0.9, True),                    # Pleer: play, progress bar
    160: (['playful', 'elegant'], ['ferris', 'fade', 'flipL'], ('swingRight', 'spinIn'), 'bounceDrop', 'slideLeft',
          ('slideRight', 'fadeUp', 'bounceDrop', 'slideLeft', 'spinIn', 'cascade', 0.12), 1.0, False),   # Nard: checkers moved
    # ---- 161–200: minimalist family — one fine line, light, text and photo; each its own light and pace
    161: (['calm', 'elegant'], ['fade', 'reveal', 'dissolve'], ('riseWords', 'fadeWords'), 'fade', 'riseUp',
          ('riseWords', 'fadeUp', 'riseUp', 'focusIn', 'riseSettle', 'seq', 0.24), 1.3, True),           # Tong: dawn rises
    162: (['calm', 'elegant'], ['dissolve', 'fade', 'panD'], ('fadeWords', 'fadeLetters'), 'fade', 'sinkDown',
          ('fadeDown', 'fade', 'fadeDown', 'dissolve', 'fade', 'reverse', 0.26), 1.4, True),             # Shom: dusk settles down
    163: (['calm'], ['dissolve', 'fade', 'morph'], ('fadeWords', 'fadeWords'), 'dissolve', 'dissolve',
          ('fadeWords', 'dissolve', 'dissolve', 'dissolve', 'dissolve', 'together', 0.3), 1.5, True),    # Tuman: fog
    164: (['calm', 'elegant'], ['panL', 'fade', 'dissolve'], ('sweepIn', 'fadeWords'), 'fadeRight', 'fadeRight',
          ('sweepIn', 'fadeRight', 'fadeRight', 'wipe:r', 'fadeRight', 'seq', 0.24), 1.35, True),         # Qum: sand drifts
    165: (['calm', 'elegant'], ['fade', 'ripple', 'morph'], ('focusIn', 'riseWords'), 'focusIn', 'softGrow',
          ('focusIn', 'fadeUp', 'softGrow', 'circle', 'focusIn', 'centerOut', 0.22), 1.25, True),       # Moviy: clear blue
    166: (['calm'], ['fade', 'dissolve', 'reveal'], ('fadeWords', 'riseWords'), 'fadeUp', 'curveUp',
          ('riseWords', 'fade', 'curveUp', 'dissolve', 'fadeUp', 'seq', 0.28), 1.45, True),              # Yashil choy: steam
    167: (['bold', 'calm'], ['cut', 'fade', 'dissolve'], ('stretch', 'fadeLetters'), 'appear', 'stretch',
          ('stretch', 'fade', 'fadeUp', 'fade', 'appear', 'seq', 0.22), 1.1, False),                     # Ko'mir: charcoal stroke
    168: (['calm', 'elegant'], ['dissolve', 'fade', 'shredR'], ('fadeLetters', 'fadeWords'), 'diamond', 'dissolve',
          ('fadeLetters', 'fade', 'dissolve', 'focusIn', 'diamond', 'diagonal', 0.24), 1.35, True),      # Qor: snow settles
    169: (['calm', 'playful'], ['fade', 'gallery', 'morph'], ('springIn', 'riseWords'), 'springIn', 'softGrow',
          ('springIn', 'fadeUp', 'softGrow', 'springIn', 'springIn', 'centerOut', 0.2), 1.15, True),     # Shaftoli: soft and ripe
    170: (['elegant', 'calm'], ['fade', 'dissolve', 'p14:reveal|thruBlk="1"'], ('fadeLetters', 'riseWords'), 'fadeUp', 'curveUp',
          ('fadeLetters', 'fadeWords', 'curveUp', 'focusIn', 'fadeUp', 'seq', 0.26), 1.4, True),         # Lavanda: fragrance drifts
    171: (['energetic', 'playful'], ['zoom', 'fade', 'push:u'], ('popOver', 'springIn'), 'popOver', 'popIn',
          ('popOver', 'fadeUp', 'springIn', 'popOver', 'popOver', 'seq', 0.14), 0.95, True),             # Limon: zest, pops
    172: (['elegant', 'bold'], ['fade', 'doors', 'dissolve'], ('fadeLetters', 'split'), 'focusIn', 'split',
          ('split', 'fadeWords', 'focusIn', 'split', 'focusIn', 'centerOut', 0.24), 1.3, True),          # Bordo: velvet curtain
    173: (['calm', 'elegant'], ['fade', 'pan', 'dissolve'], ('riseWords', 'fadeWords'), 'swing', 'riseUp',
          ('riseWords', 'fade', 'riseSettle', 'peekUp', 'swing', 'seq', 0.24), 1.3, True),              # Zaytun: olive branch sways
    174: (['calm', 'technical'], ['shred', 'dissolve', 'fade'], ('focusIn', 'fadeLetters'), 'focusIn', 'wipe:d',
          ('focusIn', 'wipe:d', 'wipe:d', 'focusIn', 'focusIn', 'seq', 0.2), 1.25, True),                # Muzlik: ice slides down
    175: (['calm', 'bold'], ['fade', 'wipe:u', 'dissolve'], ('riseSettle', 'fadeWords'), 'riseSettle', 'wipe:u',
          ('riseSettle', 'fadeUp', 'wipe:u', 'wipe:u', 'riseSettle', 'seq', 0.22), 1.2, True),           # Terrakota: clay, earth
    176: (['elegant', 'technical'], ['fade', 'wipe:r', 'dissolve'], ('fadeLetters', 'typeLetters'), 'fade', 'wipe:r',
          ('fadeLetters', 'wipeWords', 'wipe:r', 'dissolve', 'fade', 'seq', 0.24), 1.3, False),          # Siyoh: ink flows
    177: (['playful', 'calm'], ['fade', 'ripple', 'gallery'], ('springIn', 'fadeWords'), 'springIn', 'popIn',
          ('springIn', 'fadeUp', 'popIn', 'softGrow', 'springIn', 'centerOut', 0.2), 1.1, True),         # Pushti: soft pop
    178: (['calm', 'elegant'], ['fade', 'dissolve', 'pull:u'], ('riseWords', 'fadeWords'), 'curveUp', 'curveUp',
          ('riseWords', 'fade', 'curveUp', 'dissolve', 'curveUp', 'seq', 0.26), 1.4, True),              # Kofe: aroma rises
    179: (['technical', 'calm'], ['glitterH', 'fade', 'dissolve'], ('focusIn', 'fadeLetters'), 'diamond', 'diamond',
          ('focusIn', 'fade', 'diamond', 'diamond', 'diamond', 'diagonal', 0.2), 1.2, True),             # Mineral: crystal facets
    180: (['calm', 'playful'], ['fade', 'push:u', 'dissolve'], ('riseWords', 'springIn'), 'springIn', 'riseUp',
          ('riseSettle', 'fadeUp', 'riseUp', 'springIn', 'springIn', 'seq', 0.22), 1.2, True),           # Yalpiz: fresh
    181: (['elegant', 'calm'], ['fade', 'dissolve', 'pan'], ('riseWords', 'fadeLetters'), 'riseUp', 'splitH',
          ('riseWords', 'fade', 'riseUp', 'splitH', 'riseSettle', 'seq', 0.26), 1.4, True),              # Oltin soat: golden hour light
    182: (['elegant', 'energetic'], ['fly', 'fade', 'vortexL'], ('fadeLetters', 'focusIn'), 'focusIn', 'dissolve',
          ('fadeLetters', 'fade', 'dissolve', 'focusIn', 'focusIn', 'diagonal', 0.2), 1.25, True),       # Tungi osmon: stars appear
    183: (['calm', 'playful'], ['cover:u', 'fade', 'pull:r'], ('fadeWords', 'swingRight'), 'drop', 'drop',
          ('fadeDown', 'fadeUp', 'drop', 'drop', 'drop', 'seq', 0.22), 1.2, False),                      # Kraft: paper laid down
    184: (['calm'], ['fade', 'pull:l', 'dissolve'], ('fadeWords', 'fadeWords'), 'fade', 'fadeRight',
          ('fadeRight', 'fade', 'fadeRight', 'fadeRight', 'fade', 'seq', 0.28), 1.45, True),             # Kanop: linen, quiet
    185: (['bold', 'technical'], ['cut', 'split:h', 'fade'], ('stretch', 'stretch'), 'appear', 'stretch',
          ('stretch', 'fade', 'unfold', 'stretch', 'appear', 'seq', 0.18), 1.05, False),                 # Beton: concrete slabs
    186: (['energetic', 'technical'], ['flash', 'dissolve', 'fade'], ('fadeLetters', 'focusIn'), 'focusIn', 'dissolve',
          ('fadeLetters', 'dissolve', 'focusIn', 'dissolve', 'popIn', 'together', 0.16), 1.1, True),     # Neon tuman: glow in haze
    187: (['bold', 'elegant'], ['split', 'wipe:r', 'fade'], ('split', 'stretch'), 'popIn', 'split',
          ('split', 'wipe:r', 'wipe:l/wipe:r', 'split', 'popIn', 'alternate', 0.18), 1.1, False),        # Ikki rang: two colours meet
    188: (['calm', 'elegant'], ['wipe:u', 'fade', 'pan'], ('riseWords', 'focusIn'), 'riseUp', 'splitH',
          ('splitH', 'fadeUp', 'riseUp', 'splitH', 'riseUp', 'seq', 0.24), 1.3, True),                   # Gorizont: the line opens
    189: (['calm', 'playful'], ['ripple', 'fade', 'dissolve'], ('riseWords', 'fadeWords'), 'curveUp', 'riseUp',
          ('riseSettle', 'fadeUp', 'curveUp', 'circle', 'curveUp', 'seq', 0.22), 1.25, True),            # Akva: water
    190: (['elegant', 'calm'], ['fade', 'dissolve', 'reveal'], ('focusIn', 'fadeLetters'), 'focusIn', 'focusIn',
          ('focusIn', 'fadeWords', 'focusIn', 'focusIn', 'focusIn', 'centerOut', 0.24), 1.35, True),     # Qahrabo: amber glow
    191: (['technical', 'bold'], ['cut', 'fade', 'wipe:r'], ('typeLetters', 'stretch'), 'appear', 'wipe:r',
          ('stretch', 'wipeWords', 'wipe:r', 'wipe:r', 'appear', 'seq', 0.18), 1.05, False),             # Grafit: pencil line
    192: (['playful', 'energetic'], ['ferris', 'fade', 'zoom'], ('wheel', 'popOver'), 'wheel', 'wheel4',
          ('popOver', 'fadeUp', 'wheel', 'wheel4', 'wheel', 'centerOut', 0.16), 1.0, True),              # Kungaboqar: petals open
    193: (['bold', 'elegant'], ['push:l', 'fade', 'morph'], ('sweepIn', 'stretch'), 'popIn', 'sweepIn',
          ('sweepIn', 'fadeRight', 'slideRight', 'wipe:r', 'popIn', 'cascade', 0.14), 1.05, True),        # Kobalt: deep, sharp
    194: (['playful', 'calm'], ['ripple', 'fade', 'gallery'], ('springIn', 'riseWords'), 'springIn', 'curveUp',
          ('springIn', 'fadeUp', 'curveUp/curveDown', 'springIn', 'springIn', 'alternate', 0.2), 1.15, True),  # Marjon: coral sways
    195: (['elegant', 'calm'], ['dissolve', 'fade', 'morph'], ('fadeWords', 'focusIn'), 'focusIn', 'dissolve',
          ('focusIn', 'fade', 'arcRight', 'dissolve', 'focusIn', 'diagonal', 0.24), 1.35, True),        # Yengil aurora: light ribbons
    196: (['bold', 'calm'], ['fade', 'cut', 'dissolve'], ('fadeLetters', 'fade'), 'fade', 'fadeLeft',
          ('fade', 'fadeLeft', 'fadeLeft', 'dissolve', 'fade', 'reverse', 0.26), 1.3, False),           # Soya: shadow falls
    197: (['playful', 'elegant'], ['fade', 'ripple', 'flip'], ('bounceDrop', 'riseWords'), 'bounceDrop', 'drop',
          ('bounceDrop', 'fadeUp', 'drop', 'springIn', 'bounceDrop', 'seq', 0.18), 1.05, True),          # Gilos: cherries drop
    198: (['calm', 'playful'], ['fade', 'push:u', 'morph'], ('riseWords', 'popOver'), 'popIn', 'softGrow',
          ('softGrow', 'fadeUp', 'popIn', 'softGrow', 'popIn', 'seq', 0.22), 1.2, True),                 # Pista: light, fresh
    199: (['elegant', 'bold'], ['fade', 'fly', 'dissolve'], ('fadeLetters', 'fadeLetters'), 'focusIn', 'fade',
          ('fadeLetters', 'fade', 'focusIn', 'dissolve', 'focusIn', 'together', 0.22), 1.35, True),      # Tun yarmi: midnight
    200: (['calm', 'energetic'], ['panL', 'fade', 'push:r'], ('sweepIn', 'riseWords'), 'swingRight', 'fadeRight',
          ('sweepIn', 'fadeRight', 'swingRight', 'slideRight', 'swingRight', 'cascade', 0.2), 1.15, True),  # Sabo: breeze
}


S.update({
    1: (['elegant', 'technical'], ['morph', 'glitterH', 'fade'], ('fadeLetters', 'focusIn'), 'focusIn', 'dissolve',
        ('fadeLetters', 'fadeUp', 'springIn', 'focusIn', 'popOver', 'centerOut', 0.16), 1.1, True),       # Aurora: northern-light glow
    2: (['elegant', 'calm'], ['pull:l', 'fade', 'galleryR'], ('riseWords', 'fadeLetters'), 'fade', 'wipe:r',
        ('sweepIn', 'fadeWords', 'fadeUp', 'wipe:d', 'fade', 'seq', 0.2), 1.1, False),                    # Editorial: a magazine spread
    3: (['technical', 'elegant'], ['morph', 'push:l', 'wipe:r'], ('sweepIn', 'fadeWords'), 'popIn', 'wipe:r',
        ('fadeRight', 'fadeUp', 'riseSettle', 'fade', 'popOver', 'seq', 0.12), 0.9, False),             # Korporativ: crisp report
    4: (['elegant', 'calm'], ['doors', 'reveal', 'fade'], ('split', 'riseWords'), 'wheel4', 'split',
        ('split', 'fadeWords', 'unfold', 'circle', 'wheel4', 'centerOut', 0.22), 1.2, True),             # Samarqand: gates and domes
    5: (['energetic', 'playful'], ['ripple', 'morph', 'zoom'], ('popOver', 'springIn'), 'popOver', 'softGrow',
        ('springIn', 'fadeUp', 'popOver', 'springIn', 'popOver', 'diagonal', 0.12), 0.95, False),        # Gradient: colour in motion
    6: (['bold', 'technical'], ['push:u', 'cut', 'split:h'], ('stretch', 'wipe:r'), 'appear', 'wipe:r',
        ('wipe:r', 'wipe:r', 'fadeUp', 'wipe:d', 'appear', 'seq', 0.1), 0.8, False),                      # Shveytsar: Swiss grid
    7: (['calm', 'playful'], ['fade', 'pan', 'dissolve'], ('riseWords', 'fadeWords'), 'swing', 'curveUp',
        ('riseWords', 'fadeUp', 'curveUp', 'dissolve', 'springIn', 'seq', 0.22), 1.2, True),             # Tabiat: leaves in the wind
    8: (['calm', 'technical'], ['fade', 'wipe:d', 'pull:l'], ('fadeLetters', 'fadeWords'), 'fade', 'wipe:d',
        ('fadeLetters', 'wipeWords', 'wipe:d', 'fade', 'fade', 'seq', 0.2), 1.1, False),                 # Akademik: a lecture
    9: (['elegant'], ['fade', 'doorsH', 'dissolve'], ('fadeLetters', 'fadeLetters'), 'diamond', 'dissolve',
        ('fadeLetters', 'fadeWords', 'focusIn', 'dissolve', 'diamond', 'together', 0.28), 1.45, True),    # Luxe: slow gold
    10: (['technical', 'energetic'], ['morph', 'conveyor', 'push:u'], ('stretch', 'popOver'), 'popOver', 'wipe:u',
         ('sweepIn', 'fade', 'wipe:u', 'growIn', 'popOver', 'cascade', 0.1), 0.85, False),              # Dashboard: bars fill
    11: (['playful', 'bold'], ['push:l', 'ferris', 'cut'], ('spinIn', 'bounceDrop'), 'spinIn', 'popOver',
         ('bounceDrop', 'fadeUp', 'spinIn/popOver', 'circle', 'spinIn', 'alternate', 0.12), 0.95, False),  # Bauhaus: shapes play
    12: (['bold'], ['cut', 'switch', 'push:d'], ('appear', 'stretch'), 'appear', 'drop',
         ('appear', 'appear', 'drop', 'appear', 'popIn', 'cascade', 0.08), 0.7, False),                  # Brutalist: hard cuts
    13: (['technical'], ['wipe:r', 'pan', 'morph'], ('typeLetters', 'sweepIn'), 'appear', 'wipe:r',
         ('sweepIn', 'wipeWords', 'box', 'wipe:r', 'appear', 'seq', 0.18), 1.1, False),                 # Blueprint: drawn line by line
    14: (['calm', 'elegant'], ['fade', 'gallery', 'dissolve'], ('focusIn', 'fadeWords'), 'plus', 'fadeUp',
         ('focusIn', 'fadeUp', 'fadeUp', 'softGrow', 'plus', 'seq', 0.16), 1.05, False),                # Klinika: clean, clinical
    15: (['playful', 'energetic'], ['flash', 'ferrisR', 'zoom'], ('popOver', 'wheel'), 'wheel', 'popOver',
         ('popOver', 'fadeUp', 'bounceDrop', 'checker', 'wheel', 'seq', 0.12), 0.9, False),             # Retro: 70s pop
    16: (['technical', 'bold'], ['cut', 'wipe:d', 'fade'], ('typeLetters', 'typeLetters'), 'appear', 'appear',
         ('typeLetters', 'typeLetters', 'wipe:r', 'blinds', 'appear', 'seq', 0.2), 0.9, False),         # Terminal: typed in
    17: (['calm'], ['fade', 'dissolve', 'reveal'], ('fadeWords', 'fadeWords'), 'fade', 'dissolve',
         ('fadeWords', 'fade', 'fade', 'dissolve', 'fade', 'together', 0.34), 1.6, True),                # Zen: stillness
    18: (['energetic', 'technical'], ['morph', 'pan', 'windowH'], ('springIn', 'popOver'), 'popIn', 'springIn',
         ('springIn', 'fadeUp', 'springIn', 'softGrow', 'popOver', 'diagonal', 0.1), 0.9, False),        # Bento: boxes spring in
    19: (['playful', 'elegant'], ['wheel', 'circle', 'vortex'], ('wheel', 'spinIn'), 'wheel', 'circle',
         ('wheel', 'fade', 'wheel', 'circle', 'wheel4', 'centerOut', 0.16), 1.0, False),                 # Radial: circles turn
    20: (['calm', 'technical'], ['morph', 'panL', 'dissolve'], ('riseWords', 'sweepIn'), 'focusIn', 'curveUp',
         ('sweepIn', 'fadeUp', 'curveUp', 'dissolve', 'focusIn', 'diagonal', 0.2), 1.15, True),          # Topo: contour lines
})


def js(v):
    return json.dumps(v, ensure_ascii=False)


def spec(i):
    moods, trs, cover, mark, deco, sig, tempo, kb = S[i]
    title, body, item, image, number, order, stagger = sig
    items = item.split('/') if '/' in item else item
    return {'moods': moods, 'transitions': [T.get(t, t) for t in trs], 'cover': list(cover), 'mark': mark, 'deco': deco,
            'sig': {'title': title, 'body': body, 'item': items, 'image': image, 'number': number, 'order': order, 'stagger': stagger},
            'tempo': tempo, 'kenburns': kb}


if __name__ == '__main__':
    assert sorted(S) == list(range(1, 201)), 'every template 1–200 once'
    sigs = {}
    for i in S:  # no two templates share their signature
        key = json.dumps(spec(i)['sig'], sort_keys=True)
        assert key not in sigs, (i, sigs.get(key))
        sigs[key] = i
    for f in sorted(glob.glob('templates/*.js')):
        i = int(f.split('/')[-1].split('-')[0])
        if i not in S:
            continue
        src = open(f, encoding='utf-8').read()
        src = re.sub(r"\n// animated copy:.*\nmodule\.exports\.anim = .*\n", "\n", src).rstrip()
        src += f"\n\n// animated copy: this template's own motion (animated/specs.py, animated/scenes.js)\nmodule.exports.anim = {js(spec(i))};\n"
        open(f, 'w', encoding='utf-8').write(src)
    print('written', len(S))
