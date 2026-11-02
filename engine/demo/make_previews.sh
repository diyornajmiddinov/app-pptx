#!/usr/bin/env bash
# Gallery previews: each template's cover slide drawn with its own picture (demo/make_covers.js), 480x271 JPEG,
# written to the Mini App and the site.   bash demo/make_previews.sh
set -euo pipefail
cd "$(dirname "$0")/.."
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
node demo/make_covers.js >/dev/null
N=$(node -p "require('./templates.json').length")
for i in $(seq 1 "$N"); do
  node -e "const c=require('./content/soliq.json');c.slides=[{...c.slides[0],image:process.argv[1]},c.slides[c.slides.length-1]];require('fs').writeFileSync(process.argv[2],JSON.stringify(c))" "$PWD/demo/covers/$i.jpg" "$T/c$i.json"
done
seq 1 "$N" | xargs -P2 -I{} node fill.js {} "$T/c{}.json" "$T/{}.pptx" >/dev/null
(cd "$T" && ls *.pptx | xargs -n 25 soffice --headless --convert-to pdf >/dev/null 2>&1)
for i in $(seq 1 "$N"); do
  pdftoppm -f 1 -l 1 -singlefile -jpeg -jpegopt quality=85 -scale-to-x 480 -scale-to-y 271 "$T/$i.pdf" "$T/p$i"
  cp "$T/p$i.jpg" "../miniapp/public/templates/$i.jpg"; cp "$T/p$i.jpg" "../web/public/templates/$i.jpg"
done
echo "previews: $N"
