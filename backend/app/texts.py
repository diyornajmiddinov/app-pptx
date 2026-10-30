"""Bot and backend messages in three languages (the same languages as the Mini App), as Telegram HTML."""
import html
from typing import Any

LANGS = ("uz", "ru", "en")
LANG_NAMES = {"uz": "O'zbekcha", "ru": "Русский", "en": "English"}


def _ru_slides(n: int) -> str:
    m10, m100 = n % 10, n % 100
    word = "слайд" if m10 == 1 and m100 != 11 else "слайда" if 2 <= m10 <= 4 and not 12 <= m100 <= 14 else "слайдов"
    return f"{n} {word}"


T = {  # HTML (telegram.send_message parses it); t() escapes the values put into it
    "uz": {
        # admin
        "admin_refused": "⚠️ Balans o'zgarmadi: ayirish summasi balansdan katta.",
        "admin_link": "🛠 <b>Admin panel</b>\n<i>Kompyuter brauzerida ochiladi. Havola 12 soat amal qiladi — uni boshqalarga bermang.</i>",
        "admin_btn": "🛠 Admin panelni ochish",
        # bottom (reply) keyboard and buttons
        "kb_create": "📊 Taqdimot yaratish",
        "kb_referat": "📝 Referat",
        "kb_mustaqil": "📘 Mustaqil ish",
        "paper_queued": "✍️ <b>«{topic}»</b> yozilmoqda…\n<i>Odatda 1–3 daqiqa vaqt oladi. Tayyor bo'lgach Word va PDF fayllarini shu yerga yuboraman.</i>",
        "create_open": "👇 <b>Ilovani ochish uchun tugmani bosing:</b>",
        "kb_pdf": "🖼 Rasmdan PDF",
        "kb_balance": "💰 Balans",
        "kb_editor": "✏️ Muharrir",
        "kb_lang": "🌐 Til",
        "kb_help": "❓ Yordam",
        "kb_pdf_make": "✅ PDF yaratish",
        "kb_pdf_cancel": "❌ Bekor qilish",
        "cmd_pdf": "Rasmlardan PDF yaratish",
        "menu": "👇 <i>Pastdagi menyudan foydalaning.</i>",
        # images -> PDF
        "pdf_start": "🖼 <b>Rasmdan PDF</b>\n\nRasmlarni yuboring: bittalab, albom qilib yoki fayl sifatida (sifati saqlanadi).\nSahifalar yuborgan tartibingizda bo'ladi, ko'pi bilan <b>{max} ta</b>.\n\n👇 <i>Tugatgach «✅ PDF yaratish» ni bosing.</i>",
        "pdf_added": "📥 Qabul qilindi: <b>{n} ta rasm</b>.\n<i>Yana yuboring yoki «✅ PDF yaratish» ni bosing.</i>",
        "pdf_full": "⚠️ Bitta PDF'ga ko'pi bilan <b>{max} ta</b> rasm. Ortiqchasi qabul qilinmadi — «✅ PDF yaratish» ni bosing.",
        "pdf_empty": "ℹ️ Hali birorta rasm yubormadingiz. Rasmlarni yuboring yoki «❌ Bekor qilish» ni bosing.",
        "pdf_not_image": "⚠️ Bu rasm emas. JPG, PNG yoki boshqa rasm yuboring.",
        "pdf_wait": "⏳ <b>PDF tayyorlanmoqda…</b>",
        "pdf_done": "📄 <b>«{name}»</b> tayyor: {n} sahifa.",
        "pdf_skipped": "⚠️ {n} ta faylni rasm sifatida o'qib bo'lmadi, ular PDF'ga kirmadi.",
        "pdf_error": "⚠️ <b>PDF yaratilmadi.</b>\nIltimos, qayta urinib ko'ring.",
        "pdf_ask_name": "📝 <b>{n} ta rasm tayyor.</b>\nEndi PDF fayl nomini yozing.\n\n<i>Masalan: Kurs ishi — chizmalar</i>",
        "pdf_bad_name": "⚠️ Nom bo'sh yoki faqat belgilardan iborat. Fayl nomini harflar bilan yozing.",
        "pdf_name_ph": "PDF fayl nomi",
        "pdf_need_name": "✏️ Avval PDF fayl nomini yozing (yoki «❌ Bekor qilish»).",
        "pdf_cancelled": "❌ Bekor qilindi.",
        # start, help
        "welcome": "👋 <b>Assalomu alaykum! Men — SlideAI.</b>\nSun'iy intellekt yordamida bir necha daqiqada tayyorlab beraman:\n\n📊 <b>Taqdimot</b> — 40 ta shablon, mavzuga mos rasmlar bilan\n📝 <b>Referat</b> va 📘 <b>Mustaqil ish</b> — institut talablari bo'yicha, Word + PDF\n🖼 <b>Rasmdan PDF</b> — rasmlarni bitta faylga jamlash\n\n👇 <i>Pastdagi tugmalardan birini tanlang.</i>",
        "open": "Taqdimot yaratish",
        "saved": "Til: O'zbekcha",
        "help": "❓ <b>Qanday ishlaydi</b>\n\n1️⃣ Pastdan tanlang: <b>Taqdimot</b>, <b>Referat</b> yoki <b>Mustaqil ish</b>.\n2️⃣ Mavzuni yozing va sozlamalarni tanlang.\n3️⃣ Tayyor fayl 1–3 daqiqada shu chatga keladi.\n\n<b>Buyruqlar</b>\n/taqdimot — taqdimot yaratish\n/referat — referat yozish\n/mustaqil — mustaqil ish yozish\n/pdf — rasmlardan PDF\n/balance — balans va to'ldirish\n/editor — taqdimot muharriri\n/language — tilni o'zgartirish\n\n<blockquote>Buyurtma bajarilmasa, pul balansingizga avtomatik qaytadi.</blockquote>",
        "hint": "👇 Kerakli bo'limni pastdagi tugmalardan tanlang yoki /help ni bosing.",
        # paid work
        "queued": "⏳ <b>«{topic}»</b> tayyorlanmoqda…\n<i>Odatda 1–2 daqiqa vaqt oladi. Tayyor bo'lgach shu yerga yuboraman.</i>",
        "restyle_queued": "🎨 <b>«{topic}»</b> yangi shablonda tayyorlanmoqda…",
        "queue_ahead": "🕒 Navbatda oldingizda <b>{n} ta</b> buyurtma bor — biroz ko'proq kutish kerak bo'ladi.",
        "slides": lambda n: f"{n} ta slayd",
        "new_template": "Yangi shablonda",
        "err_gen": "⚠️ <b>Taqdimot tayyorlanmadi.</b>\nIltimos, birozdan so'ng qayta urinib ko'ring.",
        "err_restyle": "⚠️ <b>Shablon almashtirilmadi.</b>\nIltimos, birozdan so'ng qayta urinib ko'ring.",
        "err_paper": "⚠️ <b>Referat yozilmadi.</b>\nIltimos, birozdan so'ng qayta urinib ko'ring.",
        "paper_ready": "✅ Tayyor: {pages} bet",
        "btn_balance": "💰 Balans",
        "cmd_balance": "Balans va to'ldirish",
        # balance and payments
        "balance": "💰 <b>Balansingiz: {balance}</b>\n\n<b>Narxlar</b>\n📊 Taqdimot — {p_gen}\n📝 Referat / mustaqil ish — {p_paper}\n🎨 Boshqa shablonga o'tkazish — {p_restyle}\n\n👇 <i>To'ldirish uchun summani tanlang:</i>",
        "topup_btn": "+ {amount}",
        "pay_link": "💳 <b>{amount}</b> — {provider} orqali to'lash uchun tugmani bosing.\n<i>To'lov o'tgach, balans avtomatik to'ldiriladi.</i>",
        "pay_btn": "{provider} orqali to'lash",
        "choose_provider": "💳 <b>{amount}</b> — to'lov usulini tanlang:",
        "card_name": "💳 Karta",
        "card_details": "💳 <b>Karta orqali to'lov</b>\n\nTo'lov ID: <code>{code}</code>\nSumma: <b>{amount}</b>\nKarta: <code>{card}</code>{holder}\n\n<b>1.</b> Shu kartaga aynan <b>{amount}</b> o'tkazing.\n<b>2.</b> To'lov chekining skrinshotini shu chatga yuboring (izohga <code>{code}</code> yozsangiz yanada yaxshi).\n\n<i>Admin tekshirgach balansingiz to'ldiriladi.</i>",
        "card_holder": "\nEgasi: <b>{name}</b>",
        "card_got": "📨 <b>Skrinshot qabul qilindi</b> ({code}, {amount}).\n<i>Admin tekshirgach xabar beraman.</i>",
        "card_no_order": "ℹ️ Avval /balance orqali summani tanlab, <b>«💳 Karta»</b> usulini bosing, keyin skrinshot yuboring.",
        "card_rejected": "❌ <b>{code}</b> to'lovi tasdiqlanmadi.\n<i>Savol bo'lsa, admin bilan bog'laning.</i>",
        "card_admin": "💳 <b>Karta to'lovi</b>\nID: <code>{code}</code>\nSumma: <b>{amount}</b>\nFoydalanuvchi: {user}\nTelegram ID: <code>{uid}</code>",
        "card_ok_btn": "✅ Tasdiqlash",
        "card_no_btn": "❌ Rad etish",
        "card_admin_paid": "✅ Tasdiqlandi ({admin})",
        "card_admin_rejected": "❌ Rad etildi ({admin})",
        "card_admin_done": "Bu to'lov allaqachon ko'rib chiqilgan.",
        "paid": "✅ <b>To'lov qabul qilindi: +{amount}</b>\n💰 Balans: <b>{balance}</b>",
        "no_payments": "To'lov tizimi hali ulanmagan. Keyinroq urinib ko'ring.",
        "low_balance": "⚠️ <b>Balans yetarli emas</b>\nKerak: <b>{price}</b> · Sizda: <b>{balance}</b>\n\n👇 <i>Pastdagi tugma orqali to'ldiring.</i>",
        "refunded": "↩️ <b>{amount}</b> balansingizga qaytarildi.",
        "admin_added": "✅ {user}: <b>+{amount}</b>, balans <b>{balance}</b>",
        # the command list (Menu)
        "cmd_start": "Boshlash",
        "cmd_taqdimot": "Taqdimot yaratish",
        "cmd_referat": "Referat yozish",
        "cmd_mustaqil": "Mustaqil ish yozish",
        "cmd_language": "Tilni o'zgartirish",
        "cmd_help": "Yordam",
        "cmd_editor": "Taqdimot muharriri",
        # the editor
        "editor_link": "✏️ <b>Taqdimot muharriri</b>\nIstalgan .pptx faylni o'zgartiring: matn, rasmlar, slaydlar.\n\n💻 <i>Faqat kompyuterda ishlaydi: havolani kompyuter brauzerida oching. Havola 12 soat amal qiladi.</i>\n\n📎 Faylni shu chatga yuborsangiz, u ham muharrirda paydo bo'ladi.",
        "editor_added": "📝 <b>«{name}»</b> muharrirga qo'shildi.\n💻 <i>Kompyuterda oching:</i>",
        "editor_btn": "Muharrirda ochish",
        "editor_sent": "✏️ <b>«{name}»</b> — muharrirda o'zgartirilgan",
        "editor_bad": "⚠️ Bu faylni ochib bo'lmadi. .pptx, .ppt yoki .odp yuboring.",
        "editor_too_big": "⚠️ Fayl juda katta (botga 20 MB gacha yuborish mumkin). Kattaroq faylni muharrirning o'zida yuklang.",
        "editor_wait": "⏳ Fayl ochilmoqda…",
    },
    "ru": {
        # admin
        "admin_refused": "⚠️ Баланс не изменён: сумма списания больше баланса.",
        "admin_link": "🛠 <b>Админ-панель</b>\n<i>Открывается в браузере на компьютере. Ссылка действует 12 часов — никому её не передавайте.</i>",
        "admin_btn": "🛠 Открыть админ-панель",
        # bottom (reply) keyboard and buttons
        "kb_create": "📊 Создать презентацию",
        "kb_referat": "📝 Реферат",
        "kb_mustaqil": "📘 Самостоятельная работа",
        "paper_queued": "✍️ <b>«{topic}»</b> пишется…\n<i>Обычно это занимает 1–3 минуты. Готовые файлы Word и PDF пришлю сюда.</i>",
        "create_open": "👇 <b>Нажмите кнопку, чтобы открыть приложение:</b>",
        "kb_pdf": "🖼 PDF из фото",
        "kb_balance": "💰 Баланс",
        "kb_editor": "✏️ Редактор",
        "kb_lang": "🌐 Язык",
        "kb_help": "❓ Помощь",
        "kb_pdf_make": "✅ Создать PDF",
        "kb_pdf_cancel": "❌ Отмена",
        "cmd_pdf": "PDF из фотографий",
        "menu": "👇 <i>Пользуйтесь меню внизу.</i>",
        # images -> PDF
        "pdf_start": "🖼 <b>PDF из фото</b>\n\nОтправьте фото: по одному, альбомом или файлом (без потери качества).\nСтраницы будут в том порядке, в котором вы отправили, не больше <b>{max}</b>.\n\n👇 <i>Затем нажмите «✅ Создать PDF».</i>",
        "pdf_added": "📥 Принято фото: <b>{n}</b>.\n<i>Отправьте ещё или нажмите «✅ Создать PDF».</i>",
        "pdf_full": "⚠️ В одном PDF не больше <b>{max}</b> фото. Лишние не приняты — нажмите «✅ Создать PDF».",
        "pdf_empty": "ℹ️ Вы ещё не отправили ни одного фото. Отправьте фото или нажмите «❌ Отмена».",
        "pdf_not_image": "⚠️ Это не изображение. Отправьте JPG, PNG или другое фото.",
        "pdf_wait": "⏳ <b>Готовлю PDF…</b>",
        "pdf_done": "📄 <b>«{name}»</b> готов, страниц: {n}.",
        "pdf_skipped": "⚠️ Файлов не удалось прочитать как изображение: {n}. Они не вошли в PDF.",
        "pdf_error": "⚠️ <b>Не удалось создать PDF.</b>\nПожалуйста, попробуйте ещё раз.",
        "pdf_ask_name": "📝 <b>Фото готово: {n}.</b>\nТеперь напишите название PDF-файла.\n\n<i>Например: Курсовая — чертежи</i>",
        "pdf_bad_name": "⚠️ Название пустое или состоит только из знаков. Напишите название буквами.",
        "pdf_name_ph": "Название PDF-файла",
        "pdf_need_name": "✏️ Сначала напишите название PDF-файла (или «❌ Отмена»).",
        "pdf_cancelled": "❌ Отменено.",
        # start, help
        "welcome": "👋 <b>Здравствуйте! Я — SlideAI.</b>\nС помощью искусственного интеллекта за несколько минут подготовлю:\n\n📊 <b>Презентацию</b> — 40 шаблонов, подходящие фото\n📝 <b>Реферат</b> и 📘 <b>Самостоятельную работу</b> — по требованиям вуза, Word + PDF\n🖼 <b>PDF из фото</b> — несколько фото в одном файле\n\n👇 <i>Выберите раздел кнопками внизу.</i>",
        "open": "Создать презентацию",
        "saved": "Язык: Русский",
        "help": "❓ <b>Как это работает</b>\n\n1️⃣ Выберите внизу: <b>Презентация</b>, <b>Реферат</b> или <b>Самостоятельная работа</b>.\n2️⃣ Напишите тему и выберите настройки.\n3️⃣ Готовый файл придёт в этот чат через 1–3 минуты.\n\n<b>Команды</b>\n/taqdimot — создать презентацию\n/referat — написать реферат\n/mustaqil — самостоятельная работа\n/pdf — PDF из фото\n/balance — баланс и пополнение\n/editor — редактор презентаций\n/language — сменить язык\n\n<blockquote>Если заказ не выполнен, деньги автоматически вернутся на баланс.</blockquote>",
        "hint": "👇 Выберите раздел кнопками внизу или нажмите /help.",
        # paid work
        "queued": "⏳ <b>«{topic}»</b> готовится…\n<i>Обычно это занимает 1–2 минуты. Пришлю файл сюда.</i>",
        "restyle_queued": "🎨 <b>«{topic}»</b> готовится в новом шаблоне…",
        "queue_ahead": "🕒 Перед вами в очереди заказов: <b>{n}</b> — придётся подождать чуть дольше.",
        "slides": _ru_slides,
        "new_template": "В новом шаблоне",
        "err_gen": "⚠️ <b>Презентация не создана.</b>\nПожалуйста, попробуйте ещё раз чуть позже.",
        "err_restyle": "⚠️ <b>Шаблон не изменён.</b>\nПожалуйста, попробуйте ещё раз чуть позже.",
        "err_paper": "⚠️ <b>Реферат не написан.</b>\nПожалуйста, попробуйте ещё раз чуть позже.",
        "paper_ready": "✅ Готово: {pages} стр.",
        "btn_balance": "💰 Баланс",
        "cmd_balance": "Баланс и пополнение",
        # balance and payments
        "balance": "💰 <b>Ваш баланс: {balance}</b>\n\n<b>Цены</b>\n📊 Презентация — {p_gen}\n📝 Реферат / самостоятельная — {p_paper}\n🎨 Перенос в другой шаблон — {p_restyle}\n\n👇 <i>Выберите сумму пополнения:</i>",
        "topup_btn": "+ {amount}",
        "pay_link": "💳 <b>{amount}</b> — нажмите кнопку, чтобы оплатить через {provider}.\n<i>После оплаты баланс пополнится автоматически.</i>",
        "pay_btn": "Оплатить через {provider}",
        "choose_provider": "💳 <b>{amount}</b> — выберите способ оплаты:",
        "card_name": "💳 Карта",
        "card_details": "💳 <b>Оплата картой</b>\n\nID платежа: <code>{code}</code>\nСумма: <b>{amount}</b>\nКарта: <code>{card}</code>{holder}\n\n<b>1.</b> Переведите ровно <b>{amount}</b> на эту карту.\n<b>2.</b> Отправьте скриншот чека в этот чат (лучше с подписью <code>{code}</code>).\n\n<i>После проверки админом баланс пополнится.</i>",
        "card_holder": "\nВладелец: <b>{name}</b>",
        "card_got": "📨 <b>Скриншот получен</b> ({code}, {amount}).\n<i>Сообщу, когда админ проверит.</i>",
        "card_no_order": "ℹ️ Сначала выберите сумму в /balance и нажмите <b>«💳 Карта»</b>, затем отправьте скриншот.",
        "card_rejected": "❌ Платёж <b>{code}</b> не подтверждён.\n<i>Если есть вопросы, свяжитесь с админом.</i>",
        "card_admin": "💳 <b>Оплата картой</b>\nID: <code>{code}</code>\nСумма: <b>{amount}</b>\nПользователь: {user}\nTelegram ID: <code>{uid}</code>",
        "card_ok_btn": "✅ Подтвердить",
        "card_no_btn": "❌ Отклонить",
        "card_admin_paid": "✅ Подтверждено ({admin})",
        "card_admin_rejected": "❌ Отклонено ({admin})",
        "card_admin_done": "Этот платёж уже рассмотрен.",
        "paid": "✅ <b>Оплата получена: +{amount}</b>\n💰 Баланс: <b>{balance}</b>",
        "no_payments": "Платёжная система ещё не подключена. Попробуйте позже.",
        "low_balance": "⚠️ <b>Недостаточно средств</b>\nНужно: <b>{price}</b> · У вас: <b>{balance}</b>\n\n👇 <i>Пополните баланс кнопкой ниже.</i>",
        "refunded": "↩️ <b>{amount}</b> возвращено на баланс.",
        "admin_added": "✅ {user}: <b>+{amount}</b>, баланс <b>{balance}</b>",
        # the command list (Menu)
        "cmd_start": "Начать",
        "cmd_taqdimot": "Создать презентацию",
        "cmd_referat": "Написать реферат",
        "cmd_mustaqil": "Написать самостоятельную работу",
        "cmd_language": "Сменить язык",
        "cmd_help": "Помощь",
        "cmd_editor": "Редактор презентаций",
        # the editor
        "editor_link": "✏️ <b>Редактор презентаций</b>\nИзмените любой файл .pptx: текст, фото, слайды.\n\n💻 <i>Работает только на компьютере: откройте ссылку в браузере на компьютере. Ссылка действует 12 часов.</i>\n\n📎 Отправьте файл в этот чат — он тоже появится в редакторе.",
        "editor_added": "📝 <b>«{name}»</b> добавлен в редактор.\n💻 <i>Откройте на компьютере:</i>",
        "editor_btn": "Открыть в редакторе",
        "editor_sent": "✏️ <b>«{name}»</b> — изменён в редакторе",
        "editor_bad": "⚠️ Не удалось открыть файл. Отправьте .pptx, .ppt или .odp.",
        "editor_too_big": "⚠️ Файл слишком большой (боту можно отправить до 20 МБ). Загрузите его в самом редакторе.",
        "editor_wait": "⏳ Открываю файл…",
    },
    "en": {
        # admin
        "admin_refused": "⚠️ Balance unchanged: the amount to take is more than the balance.",
        "admin_link": "🛠 <b>Admin panel</b>\n<i>Opens in a desktop browser. The link works for 12 hours — do not share it.</i>",
        "admin_btn": "🛠 Open admin panel",
        # bottom (reply) keyboard and buttons
        "kb_create": "📊 Create presentation",
        "kb_referat": "📝 Essay",
        "kb_mustaqil": "📘 Independent work",
        "paper_queued": "✍️ <b>“{topic}”</b> is being written…\n<i>It usually takes 1–3 minutes. I will send the Word and PDF files here.</i>",
        "create_open": "👇 <b>Tap the button to open the app:</b>",
        "kb_pdf": "🖼 Images to PDF",
        "kb_balance": "💰 Balance",
        "kb_editor": "✏️ Editor",
        "kb_lang": "🌐 Language",
        "kb_help": "❓ Help",
        "kb_pdf_make": "✅ Make PDF",
        "kb_pdf_cancel": "❌ Cancel",
        "cmd_pdf": "Images to PDF",
        "menu": "👇 <i>Use the menu below.</i>",
        # images -> PDF
        "pdf_start": "🖼 <b>Images to PDF</b>\n\nSend the images: one by one, as an album or as files (full quality).\nPages keep the order you send them in, up to <b>{max}</b>.\n\n👇 <i>Then tap «✅ Make PDF».</i>",
        "pdf_added": "📥 Images received: <b>{n}</b>.\n<i>Send more or tap «✅ Make PDF».</i>",
        "pdf_full": "⚠️ One PDF holds up to <b>{max}</b> images. The extra ones were not added — tap «✅ Make PDF».",
        "pdf_empty": "ℹ️ You have not sent any images yet. Send some or tap «❌ Cancel».",
        "pdf_not_image": "⚠️ This is not an image. Send a JPG, PNG or another picture.",
        "pdf_wait": "⏳ <b>Making the PDF…</b>",
        "pdf_done": "📄 <b>“{name}”</b> is ready: {n} pages.",
        "pdf_skipped": "⚠️ Files that could not be read as images: {n}. They are not in the PDF.",
        "pdf_error": "⚠️ <b>Could not make the PDF.</b>\nPlease try again.",
        "pdf_ask_name": "📝 <b>{n} images ready.</b>\nNow type a name for the PDF file.\n\n<i>For example: Coursework — drawings</i>",
        "pdf_bad_name": "⚠️ The name is empty or only symbols. Type the file name with letters.",
        "pdf_name_ph": "PDF file name",
        "pdf_need_name": "✏️ First type a name for the PDF file (or «❌ Cancel»).",
        "pdf_cancelled": "❌ Cancelled.",
        # start, help
        "welcome": "👋 <b>Hello! I'm SlideAI.</b>\nWith AI I prepare in a few minutes:\n\n📊 <b>Presentations</b> — 40 templates, matching photos\n📝 <b>Essays</b> and 📘 <b>Independent work</b> — to university rules, Word + PDF\n🖼 <b>Images to PDF</b> — many images in one file\n\n👇 <i>Pick a section with the buttons below.</i>",
        "open": "Create presentation",
        "saved": "Language: English",
        "help": "❓ <b>How it works</b>\n\n1️⃣ Pick below: <b>Presentation</b>, <b>Essay</b> or <b>Independent work</b>.\n2️⃣ Type the topic and choose the settings.\n3️⃣ The finished file arrives in this chat in 1–3 minutes.\n\n<b>Commands</b>\n/taqdimot — create a presentation\n/referat — write an essay\n/mustaqil — write independent work\n/pdf — images to PDF\n/balance — balance and top-up\n/editor — presentation editor\n/language — change language\n\n<blockquote>If an order fails, the money returns to your balance automatically.</blockquote>",
        "hint": "👇 Pick a section with the buttons below or tap /help.",
        # paid work
        "queued": "⏳ <b>“{topic}”</b> is being prepared…\n<i>It usually takes 1–2 minutes. I'll send the file here.</i>",
        "restyle_queued": "🎨 <b>“{topic}”</b> is being prepared in the new template…",
        "queue_ahead": "🕒 <b>{n}</b> orders are ahead of you in the queue — it will take a little longer.",
        "slides": lambda n: f"{n} slides",
        "new_template": "In a new template",
        "err_gen": "⚠️ <b>The presentation was not made.</b>\nPlease try again a little later.",
        "err_restyle": "⚠️ <b>The template was not changed.</b>\nPlease try again a little later.",
        "err_paper": "⚠️ <b>The paper was not written.</b>\nPlease try again a little later.",
        "paper_ready": "✅ Ready: {pages} pages",
        "btn_balance": "💰 Balance",
        "cmd_balance": "Balance and top-up",
        # balance and payments
        "balance": "💰 <b>Your balance: {balance}</b>\n\n<b>Prices</b>\n📊 Presentation — {p_gen}\n📝 Essay / independent work — {p_paper}\n🎨 Move to another template — {p_restyle}\n\n👇 <i>Choose a top-up amount:</i>",
        "topup_btn": "+ {amount}",
        "pay_link": "💳 <b>{amount}</b> — tap the button to pay with {provider}.\n<i>Your balance is topped up automatically after payment.</i>",
        "pay_btn": "Pay with {provider}",
        "choose_provider": "💳 <b>{amount}</b> — choose a payment method:",
        "card_name": "💳 Card",
        "card_details": "💳 <b>Card transfer</b>\n\nPayment ID: <code>{code}</code>\nAmount: <b>{amount}</b>\nCard: <code>{card}</code>{holder}\n\n<b>1.</b> Transfer exactly <b>{amount}</b> to this card.\n<b>2.</b> Send a screenshot of the receipt to this chat (ideally with <code>{code}</code> in the caption).\n\n<i>Your balance is topped up once an admin checks it.</i>",
        "card_holder": "\nHolder: <b>{name}</b>",
        "card_got": "📨 <b>Screenshot received</b> ({code}, {amount}).\n<i>I'll let you know once an admin checks it.</i>",
        "card_no_order": "ℹ️ First choose an amount in /balance and tap <b>«💳 Card»</b>, then send the screenshot.",
        "card_rejected": "❌ Payment <b>{code}</b> was not confirmed.\n<i>Contact the admin if you have questions.</i>",
        "card_admin": "💳 <b>Card payment</b>\nID: <code>{code}</code>\nAmount: <b>{amount}</b>\nUser: {user}\nTelegram ID: <code>{uid}</code>",
        "card_ok_btn": "✅ Confirm",
        "card_no_btn": "❌ Reject",
        "card_admin_paid": "✅ Confirmed ({admin})",
        "card_admin_rejected": "❌ Rejected ({admin})",
        "card_admin_done": "This payment has already been reviewed.",
        "paid": "✅ <b>Payment received: +{amount}</b>\n💰 Balance: <b>{balance}</b>",
        "no_payments": "Payments are not connected yet. Please try again later.",
        "low_balance": "⚠️ <b>Not enough balance</b>\nNeeded: <b>{price}</b> · You have: <b>{balance}</b>\n\n👇 <i>Top up with the button below.</i>",
        "refunded": "↩️ <b>{amount}</b> has been returned to your balance.",
        "admin_added": "✅ {user}: <b>+{amount}</b>, balance <b>{balance}</b>",
        # the command list (Menu)
        "cmd_start": "Start",
        "cmd_taqdimot": "Create a presentation",
        "cmd_referat": "Write an essay",
        "cmd_mustaqil": "Write independent work",
        "cmd_language": "Change language",
        "cmd_help": "Help",
        "cmd_editor": "Presentation editor",
        # the editor
        "editor_link": "✏️ <b>Presentation editor</b>\nChange any .pptx file: text, images, slides.\n\n💻 <i>Works on computers only: open the link in a browser on your computer. The link is valid for 12 hours.</i>\n\n📎 Send a file to this chat and it appears in the editor too.",
        "editor_added": "📝 <b>“{name}”</b> was added to the editor.\n💻 <i>Open it on a computer:</i>",
        "editor_btn": "Open in editor",
        "editor_sent": "✏️ <b>“{name}”</b> — edited in the editor",
        "editor_bad": "⚠️ This file could not be opened. Send a .pptx, .ppt or .odp.",
        "editor_too_big": "⚠️ The file is too large (up to 20 MB can be sent to the bot). Upload it in the editor itself.",
        "editor_wait": "⏳ Opening the file…",
    },
}
CHOOSE = "Tilni tanlang · Выберите язык · Choose a language"


def som(amount: int, lang: str = "uz") -> str:
    """15000 -> "15 000 so'm" / "15 000 сум" / "15,000 UZS"."""
    if lang == "en":
        return f"{amount:,} UZS"
    return f"{amount:,}".replace(",", "\u00a0") + (" сум" if lang == "ru" else " so'm")


class Html(str):
    """Text that is already HTML: t() puts it in as it is (another t() result, a hand-made fragment)."""


def esc(value) -> str:
    """A value for HTML text: the user's topic, name, file name — <, > and & cannot break the message."""
    return value if isinstance(value, Html) else html.escape(str(value), quote=False)


def t(lang: str, key: str, **kw) -> Html:
    """The text in this language. The values are escaped (esc), so a topic like "A<B & C" is shown as typed."""
    v: Any = T.get(lang, T["uz"]).get(key) or T["uz"][key]
    return Html(v(kw["n"]) if callable(v) else str(v).format(**{k: esc(x) for k, x in kw.items()}))
