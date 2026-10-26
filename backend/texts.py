"""Bot and backend messages in three languages (the same languages as the Mini App)."""
LANGS = ("uz", "ru", "en")
LANG_NAMES = {"uz": "O'zbekcha", "ru": "Русский", "en": "English"}


def _ru_slides(n: int) -> str:
    m10, m100 = n % 10, n % 100
    word = "слайд" if m10 == 1 and m100 != 11 else "слайда" if 2 <= m10 <= 4 and not 12 <= m100 <= 14 else "слайдов"
    return f"{n} {word}"


T = {
    "uz": {
        "admin_link": "🛠 Admin panel kompyuter brauzerida ochiladi. Havola 12 soat amal qiladi, uni boshqalarga bermang.", "admin_btn": "🛠 Admin panelni ochish",
        # bottom (reply) keyboard and images -> PDF
        "kb_pdf": "🖼 Rasmdan PDF", "kb_balance": "💰 Balans", "kb_editor": "✏️ Muharrir", "kb_lang": "🌐 Til", "kb_help": "❓ Yordam",
        "kb_pdf_make": "✅ PDF yaratish", "kb_pdf_cancel": "❌ Bekor qilish", "cmd_pdf": "Rasmlardan PDF yaratish",
        "menu": "👇 Pastdagi menyudan ham foydalanishingiz mumkin.",
        "pdf_start": "🖼 Rasmlarni yuboring: bittalab, albom qilib yoki fayl sifatida (sifati saqlanadi). "
                     "Sahifalar yuborgan tartibingizda bo'ladi, ko'pi bilan {max} ta.\n\nTugatgach «✅ PDF yaratish» ni bosing.",
        "pdf_added": "📥 Qabul qilindi: {n} ta rasm. Yana yuboring yoki «✅ PDF yaratish» ni bosing.",
        "pdf_full": "Bitta PDF'ga ko'pi bilan {max} ta rasm. Ortiqchasi qabul qilinmadi — «✅ PDF yaratish» ni bosing.",
        "pdf_empty": "Hali birorta rasm yubormadingiz. Rasmlarni yuboring yoki «❌ Bekor qilish» ni bosing.",
        "pdf_not_image": "Bu rasm emas. JPG, PNG yoki boshqa rasm yuboring.",
        "pdf_wait": "⏳ PDF tayyorlanmoqda…", "pdf_done": "📄 «{name}» tayyor: {n} sahifa.",
        "pdf_skipped": "⚠️ {n} ta faylni rasm sifatida o'qib bo'lmadi, ular PDF'ga kirmadi.",
        "pdf_error": "PDF yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        "pdf_ask_name": "📝 {n} ta rasm tayyor. Endi PDF fayl nomini yozing.\n\nMasalan: Kurs ishi — chizmalar",
        "pdf_bad_name": "Nom bo'sh yoki faqat belgilardan iborat. Fayl nomini harflar bilan yozing.",
        "pdf_name_ph": "PDF fayl nomi", "pdf_need_name": "Avval PDF fayl nomini yozing (yoki «❌ Bekor qilish»).",
        "pdf_cancelled": "Bekor qilindi.",
        "welcome": "Salom! Men SlideAI — mavzuingiz bo'yicha tayyor taqdimot yasab beraman.\n\n"
                   "1. Pastdagi tugma orqali ilovani oching.\n2. Mavzu va muallifni yozing, shablonni tanlang.\n"
                   "3. Tayyor .pptx fayl shu chatga keladi.\n\nBalans: /balance · Til: /language",
        "open": "Taqdimot yaratish", "saved": "Til: O'zbekcha",
        "help": "Ilovani oching, mavzuni yozing va shablonni tanlang — taqdimot shu chatga keladi.\n"
                "Oldingi taqdimotni boshqa shablonda olish ham mumkin.\n\n/balance — balans va to'ldirish\n/language — tilni o'zgartirish\n/pdf — rasmlardan PDF yaratish",
        "hint": "Taqdimot yaratish uchun pastdagi tugmani bosing.",
        "queued": "«{topic}» tayyorlanmoqda. Odatda 1–2 daqiqa vaqt oladi, tayyor bo'lgach shu yerga yuboraman.",
        "restyle_queued": "«{topic}» yangi shablonda tayyorlanmoqda.",
        "slides": lambda n: f"{n} ta slayd", "new_template": "Yangi shablonda",
        "err_gen": "Taqdimot tayyorlashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        "err_restyle": "Shablonni almashtirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        "btn_balance": "💰 Balans", "cmd_balance": "Balans va to'ldirish",
        "balance": "💰 Balansingiz: {balance}\n\nNarxlar:\n• Yangi taqdimot — {p_gen}\n• Boshqa shablonga o'tkazish — {p_restyle}\n\nTo'ldirish uchun summani tanlang:",
        "topup_btn": "+ {amount}", "pay_link": "{amount} — {provider} orqali to'lash uchun tugmani bosing. To'lov o'tgach, balans avtomatik to'ldiriladi.",
        "pay_btn": "{provider} orqali to'lash",
        "choose_provider": "{amount} — to'lov usulini tanlang:",
        "card_name": "💳 Karta",
        "card_details": "💳 Karta orqali to'lov\n\nTo'lov ID: <b>{code}</b>\nSumma: <b>{amount}</b>\nKarta: <code>{card}</code>{holder}\n\n"
                        "1. Shu kartaga aynan {amount} o'tkazing.\n2. To'lov chekining skrinshotini shu chatga yuboring "
                        "(izohga {code} yozsangiz yanada yaxshi).\n\nAdmin tekshirgach balansingiz to'ldiriladi.",
        "card_holder": "\nEgasi: {name}",
        "card_got": "📨 Skrinshot qabul qilindi ({code}, {amount}). Admin tekshirgach xabar beraman.",
        "card_no_order": "Avval /balance orqali summani tanlab, «💳 Karta» usulini bosing, keyin skrinshot yuboring.",
        "card_rejected": "❌ {code} to'lovi tasdiqlanmadi. Savol bo'lsa, admin bilan bog'laning.",
        "card_admin": "💳 Karta to'lovi\nID: {code}\nSumma: {amount}\nFoydalanuvchi: {user}\nTelegram ID: {uid}",
        "card_ok_btn": "✅ Tasdiqlash", "card_no_btn": "❌ Rad etish",
        "card_admin_paid": "✅ Tasdiqlandi ({admin})", "card_admin_rejected": "❌ Rad etildi ({admin})",
        "card_admin_done": "Bu to'lov allaqachon ko'rib chiqilgan.",
        "paid": "✅ To'lov qabul qilindi: +{amount}\nBalans: {balance}",
        "no_payments": "To'lov tizimi hali ulanmagan. Keyinroq urinib ko'ring.",
        "low_balance": "Balans yetarli emas: kerak {price}, sizda {balance}.\nPastdagi tugma orqali to'ldiring.",
        "refunded": "{amount} balansingizga qaytarildi.", "admin_added": "{user}: +{amount}, balans {balance}",
        "cmd_start": "Boshlash", "cmd_language": "Tilni o'zgartirish", "cmd_help": "Yordam", "cmd_editor": "Taqdimot muharriri",
        "editor_link": "📝 Taqdimot muharriri — istalgan .pptx faylni o'zgartirish.\n\n💻 Faqat kompyuterda ishlaydi: havolani kompyuter brauzerida oching. Havola 12 soat amal qiladi.\n\nFaylni shu chatga yuborsangiz, u ham muharrirda paydo bo'ladi.",
        "editor_added": "📝 «{name}» muharrirga qo'shildi.\n💻 Kompyuterda oching:",
        "editor_btn": "Muharrirda ochish", "editor_sent": "📝 «{name}» — muharrirda o'zgartirilgan",
        "editor_bad": "Bu faylni ochib bo'lmadi. .pptx, .ppt yoki .odp yuboring.", "editor_too_big": "Fayl juda katta (botga 20 MB gacha yuborish mumkin). Kattaroq faylni muharrirning o'zida yuklang.",
        "editor_wait": "⏳ Fayl ochilmoqda…",
    },
    "ru": {
        "admin_link": "🛠 Админ-панель открывается в браузере на компьютере. Ссылка действует 12 часов, никому её не передавайте.", "admin_btn": "🛠 Открыть админ-панель",
        # bottom (reply) keyboard and images -> PDF
        "kb_pdf": "🖼 PDF из фото", "kb_balance": "💰 Баланс", "kb_editor": "✏️ Редактор", "kb_lang": "🌐 Язык", "kb_help": "❓ Помощь",
        "kb_pdf_make": "✅ Создать PDF", "kb_pdf_cancel": "❌ Отмена", "cmd_pdf": "PDF из фотографий",
        "menu": "👇 Также можно пользоваться меню внизу.",
        "pdf_start": "🖼 Отправьте фото: по одному, альбомом или файлом (без потери качества). "
                     "Страницы будут в том порядке, в котором вы отправили, не больше {max}.\n\nЗатем нажмите «✅ Создать PDF».",
        "pdf_added": "📥 Принято фото: {n}. Отправьте ещё или нажмите «✅ Создать PDF».",
        "pdf_full": "В одном PDF не больше {max} фото. Лишние не приняты — нажмите «✅ Создать PDF».",
        "pdf_empty": "Вы ещё не отправили ни одного фото. Отправьте фото или нажмите «❌ Отмена».",
        "pdf_not_image": "Это не изображение. Отправьте JPG, PNG или другое фото.",
        "pdf_wait": "⏳ Готовлю PDF…", "pdf_done": "📄 «{name}» готов, страниц: {n}.",
        "pdf_skipped": "⚠️ Файлов не удалось прочитать как изображение: {n}. Они не вошли в PDF.",
        "pdf_error": "Не удалось создать PDF. Пожалуйста, попробуйте ещё раз.",
        "pdf_ask_name": "📝 Фото готово: {n}. Теперь напишите название PDF-файла.\n\nНапример: Курсовая — чертежи",
        "pdf_bad_name": "Название пустое или состоит только из знаков. Напишите название буквами.",
        "pdf_name_ph": "Название PDF-файла", "pdf_need_name": "Сначала напишите название PDF-файла (или «❌ Отмена»).",
        "pdf_cancelled": "Отменено.",
        "welcome": "Привет! Я SlideAI — делаю готовую презентацию по вашей теме.\n\n"
                   "1. Откройте приложение кнопкой ниже.\n2. Укажите тему и автора, выберите шаблон.\n"
                   "3. Готовый файл .pptx придёт в этот чат.\n\nБаланс: /balance · Язык: /language",
        "open": "Создать презентацию", "saved": "Язык: Русский",
        "help": "Откройте приложение, напишите тему и выберите шаблон — презентация придёт в этот чат.\n"
                "Прошлую презентацию можно получить и в другом шаблоне.\n\n/balance — баланс и пополнение\n/language — сменить язык\n/pdf — PDF из фотографий",
        "hint": "Чтобы создать презентацию, нажмите кнопку ниже.",
        "queued": "Готовлю «{topic}». Обычно это занимает 1–2 минуты, пришлю файл сюда.",
        "restyle_queued": "Готовлю «{topic}» в новом шаблоне.",
        "slides": _ru_slides, "new_template": "В новом шаблоне",
        "err_gen": "При создании презентации произошла ошибка. Пожалуйста, попробуйте ещё раз.",
        "err_restyle": "При смене шаблона произошла ошибка. Пожалуйста, попробуйте ещё раз.",
        "btn_balance": "💰 Баланс", "cmd_balance": "Баланс и пополнение",
        "balance": "💰 Ваш баланс: {balance}\n\nЦены:\n• Новая презентация — {p_gen}\n• Перенос в другой шаблон — {p_restyle}\n\nВыберите сумму пополнения:",
        "topup_btn": "+ {amount}", "pay_link": "{amount} — нажмите кнопку, чтобы оплатить через {provider}. После оплаты баланс пополнится автоматически.",
        "pay_btn": "Оплатить через {provider}",
        "choose_provider": "{amount} — выберите способ оплаты:",
        "card_name": "💳 Карта",
        "card_details": "💳 Оплата картой\n\nID платежа: <b>{code}</b>\nСумма: <b>{amount}</b>\nКарта: <code>{card}</code>{holder}\n\n"
                        "1. Переведите ровно {amount} на эту карту.\n2. Отправьте скриншот чека в этот чат "
                        "(лучше с подписью {code}).\n\nПосле проверки админом баланс пополнится.",
        "card_holder": "\nВладелец: {name}",
        "card_got": "📨 Скриншот получен ({code}, {amount}). Сообщу, когда админ проверит.",
        "card_no_order": "Сначала выберите сумму в /balance и нажмите «💳 Карта», затем отправьте скриншот.",
        "card_rejected": "❌ Платёж {code} не подтверждён. Если есть вопросы, свяжитесь с админом.",
        "card_admin": "💳 Оплата картой\nID: {code}\nСумма: {amount}\nПользователь: {user}\nTelegram ID: {uid}",
        "card_ok_btn": "✅ Подтвердить", "card_no_btn": "❌ Отклонить",
        "card_admin_paid": "✅ Подтверждено ({admin})", "card_admin_rejected": "❌ Отклонено ({admin})",
        "card_admin_done": "Этот платёж уже рассмотрен.",
        "paid": "✅ Оплата получена: +{amount}\nБаланс: {balance}",
        "no_payments": "Платёжная система ещё не подключена. Попробуйте позже.",
        "low_balance": "Недостаточно средств: нужно {price}, у вас {balance}.\nПополните баланс кнопкой ниже.",
        "refunded": "{amount} возвращено на баланс.", "admin_added": "{user}: +{amount}, баланс {balance}",
        "cmd_start": "Начать", "cmd_language": "Сменить язык", "cmd_help": "Помощь", "cmd_editor": "Редактор презентаций",
        "editor_link": "📝 Редактор презентаций — изменить любой файл .pptx.\n\n💻 Работает только на компьютере: откройте ссылку в браузере на компьютере. Ссылка действует 12 часов.\n\nОтправьте файл в этот чат — он тоже появится в редакторе.",
        "editor_added": "📝 «{name}» добавлен в редактор.\n💻 Откройте на компьютере:",
        "editor_btn": "Открыть в редакторе", "editor_sent": "📝 «{name}» — изменён в редакторе",
        "editor_bad": "Не удалось открыть файл. Отправьте .pptx, .ppt или .odp.", "editor_too_big": "Файл слишком большой (боту можно отправить до 20 МБ). Загрузите его в самом редакторе.",
        "editor_wait": "⏳ Открываю файл…",
    },
    "en": {
        "admin_link": "🛠 The admin panel opens in a desktop browser. The link works for 12 hours — do not share it.", "admin_btn": "🛠 Open admin panel",
        # bottom (reply) keyboard and images -> PDF
        "kb_pdf": "🖼 Images to PDF", "kb_balance": "💰 Balance", "kb_editor": "✏️ Editor", "kb_lang": "🌐 Language", "kb_help": "❓ Help",
        "kb_pdf_make": "✅ Make PDF", "kb_pdf_cancel": "❌ Cancel", "cmd_pdf": "Images to PDF",
        "menu": "👇 You can also use the menu below.",
        "pdf_start": "🖼 Send the images: one by one, as an album or as files (full quality). "
                     "Pages keep the order you send them in, up to {max}.\n\nThen tap «✅ Make PDF».",
        "pdf_added": "📥 Images received: {n}. Send more or tap «✅ Make PDF».",
        "pdf_full": "One PDF holds up to {max} images. The extra ones were not added — tap «✅ Make PDF».",
        "pdf_empty": "You have not sent any images yet. Send some or tap «❌ Cancel».",
        "pdf_not_image": "This is not an image. Send a JPG, PNG or another picture.",
        "pdf_wait": "⏳ Making the PDF…", "pdf_done": "📄 «{name}» is ready: {n} pages.",
        "pdf_skipped": "⚠️ Files that could not be read as images: {n}. They are not in the PDF.",
        "pdf_error": "Could not make the PDF. Please try again.",
        "pdf_ask_name": "📝 {n} images ready. Now type a name for the PDF file.\n\nFor example: Coursework — drawings",
        "pdf_bad_name": "The name is empty or only symbols. Type the file name with letters.",
        "pdf_name_ph": "PDF file name", "pdf_need_name": "First type a name for the PDF file (or «❌ Cancel»).",
        "pdf_cancelled": "Cancelled.",
        "welcome": "Hi! I'm SlideAI — I make a ready-to-use presentation on your topic.\n\n"
                   "1. Open the app with the button below.\n2. Enter the topic and author, pick a template.\n"
                   "3. The finished .pptx file arrives in this chat.\n\nBalance: /balance · Language: /language",
        "open": "Create presentation", "saved": "Language: English",
        "help": "Open the app, enter a topic and pick a template — the presentation arrives in this chat.\n"
                "You can also get your previous presentation in another template.\n\n/balance — balance and top-up\n/language — change language\n/pdf — images to PDF",
        "hint": "Tap the button below to create a presentation.",
        "queued": "Preparing “{topic}”. It usually takes 1–2 minutes; I'll send the file here.",
        "restyle_queued": "Preparing “{topic}” in the new template.",
        "slides": lambda n: f"{n} slides", "new_template": "In a new template",
        "err_gen": "Something went wrong while creating the presentation. Please try again.",
        "err_restyle": "Something went wrong while changing the template. Please try again.",
        "btn_balance": "💰 Balance", "cmd_balance": "Balance and top-up",
        "balance": "💰 Your balance: {balance}\n\nPrices:\n• New presentation — {p_gen}\n• Move to another template — {p_restyle}\n\nChoose a top-up amount:",
        "topup_btn": "+ {amount}", "pay_link": "{amount} — tap the button to pay with {provider}. Your balance is topped up automatically after payment.",
        "pay_btn": "Pay with {provider}",
        "choose_provider": "{amount} — choose a payment method:",
        "card_name": "💳 Card",
        "card_details": "💳 Card transfer\n\nPayment ID: <b>{code}</b>\nAmount: <b>{amount}</b>\nCard: <code>{card}</code>{holder}\n\n"
                        "1. Transfer exactly {amount} to this card.\n2. Send a screenshot of the receipt to this chat "
                        "(ideally with {code} in the caption).\n\nYour balance is topped up once an admin checks it.",
        "card_holder": "\nHolder: {name}",
        "card_got": "📨 Screenshot received ({code}, {amount}). I'll let you know once an admin checks it.",
        "card_no_order": "First choose an amount in /balance and tap «💳 Card», then send the screenshot.",
        "card_rejected": "❌ Payment {code} was not confirmed. Contact the admin if you have questions.",
        "card_admin": "💳 Card payment\nID: {code}\nAmount: {amount}\nUser: {user}\nTelegram ID: {uid}",
        "card_ok_btn": "✅ Confirm", "card_no_btn": "❌ Reject",
        "card_admin_paid": "✅ Confirmed ({admin})", "card_admin_rejected": "❌ Rejected ({admin})",
        "card_admin_done": "This payment has already been reviewed.",
        "paid": "✅ Payment received: +{amount}\nBalance: {balance}",
        "no_payments": "Payments are not connected yet. Please try again later.",
        "low_balance": "Not enough balance: {price} needed, you have {balance}.\nTop up with the button below.",
        "refunded": "{amount} has been returned to your balance.", "admin_added": "{user}: +{amount}, balance {balance}",
        "cmd_start": "Start", "cmd_language": "Change language", "cmd_help": "Help", "cmd_editor": "Presentation editor",
        "editor_link": "📝 Presentation editor — change any .pptx file.\n\n💻 Works on computers only: open the link in a browser on your computer. The link is valid for 12 hours.\n\nSend a file to this chat and it appears in the editor too.",
        "editor_added": "📝 “{name}” was added to the editor.\n💻 Open it on a computer:",
        "editor_btn": "Open in editor", "editor_sent": "📝 “{name}” — edited in the editor",
        "editor_bad": "This file could not be opened. Send a .pptx, .ppt or .odp.", "editor_too_big": "The file is too large (up to 20 MB can be sent to the bot). Upload it in the editor itself.",
        "editor_wait": "⏳ Opening the file…",
    },
}
CHOOSE = "Tilni tanlang · Выберите язык · Choose a language"


def som(amount: int, lang: str = "uz") -> str:
    """15000 -> "15 000 so'm" / "15 000 сум" / "15,000 UZS"."""
    if lang == "en":
        return f"{amount:,} UZS"
    return f"{amount:,}".replace(",", "\u00a0") + (" сум" if lang == "ru" else " so'm")


def t(lang: str, key: str, **kw) -> str:
    v = T.get(lang, T["uz"]).get(key) or T["uz"][key]
    return v(kw["n"]) if callable(v) else v.format(**kw)
