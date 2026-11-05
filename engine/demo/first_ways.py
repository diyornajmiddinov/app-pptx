"""Which way of each type comes first for each template, so that the pages of a short deck look least alike.
Reads the rendered pages of a 30-slide deck that draws every way once, in <dir>/<id>-long/p-NN.png, and writes first-ways.json.
  python3 demo/first_ways.py <dir>   (from engine/; run the backend venv's python: it needs Pillow)"""
import glob, json, os, itertools, math, sys, collections
from PIL import Image
SP = sys.argv[1]
COUNTS = {"image": 4, "cards": 5, "process": 4, "stats": 3, "compare": 3, "statement": 3, "timeline": 3}
pos, left, order = {t: [] for t in COUNTS}, dict(COUNTS), []
while any(left.values()):
    for t in COUNTS:
        if left[t]: order.append(t); left[t] -= 1
for i, t in enumerate(order): pos[t].append(i + 4)  # slide numbers: cover, intro, agenda come first
def vec(f):
    a = list(Image.open(f).convert('L').resize((64, 36)).tobytes()); m = sum(a) / len(a); sd = math.sqrt(sum((x - m) ** 2 for x in a) / len(a)) + 1e-6
    return [(x - m) / sd for x in a]
cor = lambda a, b: sum(x * y for x, y in zip(a, b)) / len(a)
T = list(COUNTS)
table, before, after, hb, ha = {}, 0, 0, collections.Counter(), collections.Counter()
for d in sorted(glob.glob(SP + '/*-long'), key=lambda x: int(os.path.basename(x).split('-')[0]) if os.path.basename(x).split('-')[0].isdigit() else 0):
    tid = os.path.basename(d).split('-')[0]
    if not tid.isdigit(): continue
    f = sorted(glob.glob(d + '/p-*.png'))
    if len(f) != 30: print('skip', tid, len(f)); continue
    V = {(t, k): vec(f[p - 1]) for t in T for k, p in enumerate(pos[t])}
    fixed = [vec(f[1]), vec(f[2])]  # intro, agenda
    C = {}
    for a, b in itertools.combinations(list(V), 2):
        if a[0] != b[0]: C[a, b] = C[b, a] = cor(V[a], V[b])
    F = {(k, i): cor(V[k], fixed[i]) for k in V for i in (0, 1)}
    def score(pick):
        ks = [(t, pick[t]) for t in T]
        vals = [C[a, b] for a, b in itertools.combinations(ks, 2)] + [F[k, i] for k in ks for i in (0, 1)]
        return (sum(v >= .55 for v in vals), round(sum(max(0, v) ** 2 for v in vals), 3))
    best, bs = None, None
    for c in itertools.product(*[range(COUNTS[t]) for t in T]):
        pick = dict(zip(T, c)); s = score(pick)
        if bs is None or s < bs: best, bs = pick, s
    base = score({t: 0 for t in T})
    before += base[0]; after += bs[0]; hb[base[0]] += 1; ha[bs[0]] += 1
    table[tid] = {t: k for t, k in best.items() if k}
json.dump(table, open('first-ways.json', 'w'), separators=(',', ':'))
print(len(table), 'templates; alike pairs original order', before, '-> best order', after)
print('templates by alike pairs, before', sorted(hb.items())); print('after', sorted(ha.items()))
print('dark check: mean offset used', {t: round(sum(v.get(t, 0) for v in table.values()) / len(table), 2) for t in T})
