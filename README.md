# SlideAI — Telegram taqdimot generatori (to'liq loyiha)

Foydalanuvchi Telegram Mini App'da mavzu va muallif ma'lumotlarini yozadi, 40 ta shablondan birini
tanlaydi. Server AI orqali kontent yozadi, Pexels'dan rasmlar oladi va tayyor `.pptx` faylni
bot chatga yuboradi.

```
miniapp/  (React + Tailwind, Telegram Mini App)
   │  POST /api/generate  {topic, author, org, loc, year, template_id, slide_count, language}
   ▼
backend/  (FastAPI)  ── initData tekshiruvi ── kredit ── fon vazifasi
   │  content_ai.py: Claude → kontent JSON → tekshiruv → Pexels rasmlari
   ▼
engine/   (Node.js)  fill.js → templates/NN.js → .pptx  ── bot sendDocument bilan chatga
```

## 40 ta shablon
1–10: Aurora, Editorial, Korporativ, Samarqand, Gradient, Shveytsar, Tabiat, Akademik, Lyuks, Dashboard ·
11–20: Bauhaus, Brutalist, Chizma, Klinika, Retro, Terminal, Zen, Bento, Doira, Xarita ·
21–30: Fotojurnal, Galereya, Ikki qism, Duotone, Rasmiy, Kino, Kitob, Qog'oz, Dinamika, Asalari ·
31–40: Izometrik, Komiks, Doska, Daftar, Art Deco, Piksel, Neumorf, Element, Metro, Pochta.

## Papkalar
| Papka | Ichida |
|---|---|
| `engine/` | `fill.js` (to'ldiruvchi), `templates/01…40.js` (40 ta shablon, har biri alohida dizayn), `lib.js` (matn o'lchash, rasm kesish), `content/soliq.json` (namuna) |
| `backend/` | `main.py` (API), `bot.py` (bot: til tanlash, /start, /help), `texts.py` (3 tildagi xabarlar), `prefs.py`, `content_ai.py` (AI matn + rasmlar), `telegram_auth.py`, `telegram_api.py`, `bot_setup.py` |
| `miniapp/` | Telegram Mini App: mavzu va muallif formasi, 6–30 slayd tanlash, til, 40 ta shablon galereyasi |

## Barcha 40 shablon uchun umumiy qoidalar
- Har bir slaydda: **mavzu, muallif, tashkilot, shahar, yil** (har bir shablon o'z uslubida joylaydi).
- Majburiy slaydlar: **titul, Kirish, Reja, Manbalar, yakun**.
- Slaydlar soni: **6 dan 30 gacha** istalgan son.
- Rasmlar: har bir taqdimotda **3–6 ta** (titul, Kirish, yakun va 0–3 ta rasm slaydi).
- Slayd turlari: `cover, intro, agenda, image, cards, process, stats, compare, statement, timeline, quote, sources, closing`.

## Til: butun tizim tanlangan tilda (o'zbek / rus / ingliz)
1. **Bot.** Birinchi `/start` da bot tilni so'raydi (3 ta tugma). Tanlov `backend/data/<user_id>/prefs.json` ga yoziladi.
   `/language` — tilni qayta tanlash, `/help` — yordam. Bot xabarlari, menyu tugmasi va buyruqlar ro'yxati shu tilda.
2. **Mini App** botdagi tugma orqali `?lang=xx` bilan ochiladi va butun interfeys shu tilda bo'ladi (`miniapp/src/i18n/`).
   Ilova ichida UZ / RU / EN almashtirgich ham bor: tanlov serverga saqlanadi va bot ham shu tilga o'tadi (`POST /api/me`).
3. **Taqdimot tili** standart holda interfeys tiliga teng, lekin formada alohida o'zgartirish mumkin
   (masalan, interfeys o'zbekcha, taqdimot inglizcha). AI matni, Kirish/Reja/Manbalar sarlavhalari va shablonlardagi doimiy
   yozuvlar ("Bajardi:", "1-bob", "Mundarija"...) taqdimot tilida chiqadi (`engine/lib.js` → `I18N`, `content_ai.SECTION_TITLES`).
4. **Server xabarlari** ("tayyorlanmoqda", fayl izohi, xatolar) foydalanuvchi tilida (`backend/texts.py`).

Yangi til qo'shish: `backend/texts.py`, `miniapp/src/i18n/messages.js`, `engine/lib.js` (`I18N`) va `content_ai.py`
(`LANG`, `SECTION_TITLES`) ga bittadan blok, hamda `main.py` dagi `Literal["uz", "ru", "en"]` ro'yxatiga qo'shing.

## AI har bir shablonga mos matn yozadi (uslub pasporti)
Har 40 ta shablon faylida `STYLE` bor (`engine/templates/NN-*.js` oxirida):
- `tone` — matn ohangi, masalan Rasmiy: rasmiy-akademik; Brutalist: shiorga o'xshash qisqa iboralar; Kitob: ravon, bog'langan gaplar;
- `limits` — shu shablonning o'z uzunlik chegaralari, masalan Bento'da 4 ta kartochka matni ≤ 55 belgi, Kitob'da Kirish ≤ 380;
- `prefer` — slaydlar aralashmasi: `data` (statistika ko'proq), `text` (matnli slaydlar), `visual` (rasm slaydlari oldinroq).

`engine/templates.json` shu pasportlarni backend'ga beradi. `content_ai.py`:
- `generate_content()` — birinchi yozishda reja, ohang va chegaralar tanlangan shablondan olinadi;
- `restyle()` / `switch_template()` — foydalanuvchi shablonni almashtirsa, bitta qisqa so'rov bilan faqat ohang va uzunlik moslashtiriladi; faktlar, raqamlar, manbalar va rasmlar o'zgarmaydi (manbalar va rasmlar kod bilan qayta tiklanadi).

API: `POST /api/restyle {user_id, template_id}` foydalanuvchining oxirgi taqdimotini yangi shablonda yuboradi, `GET /api/last` Mini App'ga oxirgi taqdimotni ko'rsatadi. Mini App'da "Yangi taqdimot / Oldingisini boshqa shablonda" tanlovi bor.

## O'rnatish
```bash
# 1) Engine (Node 18+)
cd engine
sudo apt-get install fonts-liberation fonts-crosextra-carlito fonts-crosextra-caladea tex-gyre
npm install
node fill.js 25 content/soliq.json        # sinov: out/25-rasmiy-soliq-islohotlari.pptx

# 2) Backend (Python 3.11+)
cd ../backend
pip install -r requirements.txt
cp .env.example .env                       # BOT_TOKEN, ANTHROPIC_API_KEY, PEXELS_API_KEY, WEBAPP_URL, PUBLIC_URL, WEBHOOK_SECRET
set -a; . ./.env; set +a
uvicorn main:app --host 0.0.0.0 --port 8000

# 3) Mini App
cd ../miniapp
npm install
cp .env.example .env                       # VITE_API_URL=https://api.sizning-domen.uz
npm run build                              # dist/ ni HTTPS hostingga joylang
cd ../backend && python bot_setup.py       # webhook, /start /language /help buyruqlari (3 tilda), menyu tugmasi
```
`SLIDEAI_DEMO=1` bilan backend AI va Pexels'siz ishlaydi (namuna kontent bilan): integratsiyani
tekshirish uchun qulay.

## Muhim joylar kodda
- AI so'rovi: `backend/content_ai.py` → `build_prompt()` (matn), `claude()` (yuborish), `generate_content()` (tekshiruv va qayta so'rash).
- Slaydlar rejasi: `content_ai.plan_for(n, template_id)`.
- Rasmlar: `content_ai.pexels_search()`; AI faqat inglizcha qidiruv so'zini yozadi.
- Kredit: `backend/main.py` → `charge_credit()` (Payme/Click balansingizga ulang; restyle uchun alohida, arzonroq narx belgilash mumkin).
- Uslub pasporti: shablon faylidagi `STYLE`. Uni o'zgartirsangiz, `templates.json` ni qayta yarating (buyruq README oxirida).
- Yangi shablon qo'shish: `engine/templates/41-nomi.js` yarating (`id`, `name`, `category`, `build`) — `fill.js` uni avtomatik topadi; keyin `engine/templates.json` va Mini App rasmini yangilang.

## Xavfsizlik
- `/api/generate` faqat Telegram imzosi to'g'ri bo'lgan so'rovni qabul qiladi; `user_id` imzolangan foydalanuvchi bilan solishtiriladi.
- Production'da `/docs` o'chirilgan; `ALLOWED_ORIGINS` ga faqat Mini App domenini yozing.

## Eslatma
`engine/demo/img/` dagi rasmlar namuna uchun chizilgan illyustratsiyalar. Haqiqiy taqdimotlarda
rasmlar Pexels'dan olinadi (litsenziyasi bepul foydalanishga ruxsat beradi).

### templates.json ni qayta yaratish
```bash
cd engine && node -e "const {TEMPLATES}=require('./fill.js');require('fs').writeFileSync('templates.json',JSON.stringify(TEMPLATES.map(t=>({id:t.id,name:t.name,category:t.category,style:t.style})),null,1))"
```
