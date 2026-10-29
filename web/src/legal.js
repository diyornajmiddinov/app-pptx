/**
 * The public offer (oferta) and the privacy policy, in three languages: [heading, paragraphs[]] per section.
 * {op.name} style fields come from operator.js. A draft written for the service as it works: have a lawyer review it.
 */
export const LEGAL = {
  oferta: {
    uz: { // the main text; ru / en follow it section by section
      title: 'Ommaviy oferta',
      intro: "Ushbu hujjat {name} (keyingi o'rinlarda — «Ijrochi») tomonidan slidechi.uz sayti va @slidechibot Telegram boti (birgalikda — «Xizmat») orqali taqdimot tayyorlash xizmatlarini ko'rsatish bo'yicha ommaviy ofertadir (O'zbekiston Respublikasi Fuqarolik kodeksining 367-moddasi). Xizmatdan foydalanish yoki balansni to'ldirish ushbu shartlarni to'liq qabul qilishni (aksept) anglatadi.",
      sections: [
        ['1. Xizmat mazmuni', [
          "Ijrochi foydalanuvchi kiritgan mavzu va sozlamalar asosida sun'iy intellekt yordamida PowerPoint (.pptx) formatidagi taqdimot faylini tayyorlaydi, mavjud taqdimotni boshqa shablonda qayta chizadi, rasmlardan PDF fayl yaratadi va boshqa qo'shimcha imkoniyatlarni taqdim etadi.",
          "Taqdimot matni va rasmlari avtomatik tarzda yaratiladi. Foydalanuvchi tayyor faylni ishlatishdan oldin uning mazmunini, faktlar va manbalarni o'zi tekshiradi.",
        ]],
        ['2. Hisob', [
          "Xizmatdan foydalanish uchun Telegram hisobi kerak. Saytga kirish @slidechibot yuboradigan bir martalik kod orqali amalga oshiriladi. Sayt va botdagi hisob, balans va taqdimotlar umumiy.",
          "Foydalanuvchi kirish kodini boshqalarga bermaslik va o'z hisobi orqali qilingan harakatlar uchun javobgar.",
        ]],
        ['3. Narxlar va to\'lov', [
          "Xizmatlar narxi saytning «Narxlar» bo'limida va botda so'mda ko'rsatiladi. Ijrochi narxlarni o'zgartirishi mumkin; o'zgarish allaqachon to'langan buyurtmalarga ta'sir qilmaydi.",
          "To'lov oldindan, ichki balansni to'ldirish orqali amalga oshiriladi: bank kartasiga o'tkazma (chek administrator tomonidan tekshiriladi), Payme yoki Click. Pul xizmat buyurtma qilingan paytda balansdan yechiladi.",
          "Promokod va taklif bonuslari balansga qo'shiladi, naqd pulga almashtirilmaydi.",
        ]],
        ['4. Xizmatni ko\'rsatish', [
          "Taqdimot odatda 1–5 daqiqada tayyorlanadi va saytdagi kabinetda yuklab olish uchun hamda Telegram chatga yuboriladi. Navbat bo'lsa, vaqt uzayishi mumkin.",
          "Xizmat fayl tayyorlangan va foydalanuvchiga taqdim etilgan paytda ko'rsatilgan hisoblanadi.",
        ]],
        ['5. Pulni qaytarish', [
          "Taqdimot texnik sabablarga ko'ra tayyorlanmasa, yechilgan summa avtomatik ravishda balansga qaytariladi.",
          "Foydalanilmagan balans qoldig'ini qaytarish foydalanuvchining Ijrochiga yozma murojaati asosida, to'lov qilingan usul orqali, murojaatdan keyin 10 ish kuni ichida amalga oshiriladi. Promokod va bonus summalari qaytarilmaydi.",
          "Tayyorlangan taqdimotning mazmuni foydalanuvchini qoniqtirmasa, u boshqa shablonda qayta chizdirishi yoki yangi taqdimot buyurtma qilishi mumkin; bunday holatda to'langan summa qaytarilmaydi.",
        ]],
        ['6. Taraflarning majburiyatlari', [
          "Foydalanuvchi Xizmatdan O'zbekiston Respublikasi qonunchiligiga zid maqsadlarda, boshqalarning huquqlarini buzadigan, haqoratli yoki noqonuniy mazmun yaratish uchun foydalanmaslikka majbur.",
          "Foydalanuvchi yuklagan hujjat va rasmlar uchun, ularga bo'lgan huquqlar uchun o'zi javobgar.",
          "Ijrochi Xizmatning uzluksiz ishlashi uchun oqilona choralarni ko'radi, lekin texnik ishlar, uchinchi tomon xizmatlaridagi (Telegram, AI provayderlari, to'lov tizimlari) uzilishlar uchun javobgar emas.",
        ]],
        ['7. Intellektual mulk', [
          "Tayyorlangan taqdimot fayli foydalanuvchiga shaxsiy va tijorat maqsadlarida cheklovsiz foydalanish uchun beriladi. Shablon dizayni va Xizmatning dasturiy ta'minoti Ijrochiga tegishli.",
          "Rasmlar fotostok (Pexels) litsenziyasi asosida yoki sun'iy intellekt orqali yaratiladi.",
        ]],
        ['8. Javobgarlik', [
          "Ijrochining javobgarligi har qanday holatda tegishli buyurtma uchun foydalanuvchi to'lagan summa bilan cheklanadi. Ijrochi taqdimot mazmunidan foydalanish natijasida yuzaga kelgan bilvosita zararlar uchun javobgar emas.",
        ]],
        ['9. Boshqa shartlar', [
          "Ijrochi ofertani o'zgartirishi mumkin; yangi tahrir saytga joylangan paytdan kuchga kiradi. Nizolar muzokaralar yo'li bilan, kelishilmasa O'zbekiston Respublikasi qonunchiligiga muvofiq sudda hal qilinadi.",
        ]],
      ],
    },
    ru: {
      title: 'Публичная оферта',
      intro: 'Настоящий документ — публичная оферта {name} (далее — «Исполнитель») об оказании услуг по подготовке презентаций через сайт slidechi.uz и Telegram-бот @slidechibot (вместе — «Сервис») (статья 367 Гражданского кодекса Республики Узбекистан). Использование Сервиса или пополнение баланса означает полное принятие (акцепт) этих условий.',
      sections: [
        ['1. Предмет', ['Исполнитель с помощью искусственного интеллекта готовит файл презентации PowerPoint (.pptx) по теме и настройкам пользователя, перерисовывает готовую презентацию в другом шаблоне, собирает PDF из изображений и предоставляет другие функции.', 'Текст и изображения создаются автоматически. Перед использованием файла пользователь сам проверяет его содержание, факты и источники.']],
        ['2. Аккаунт', ['Для работы нужен аккаунт Telegram. Вход на сайт — по одноразовому коду от @slidechibot. Аккаунт, баланс и презентации на сайте и в боте общие.', 'Пользователь не передаёт код входа другим и отвечает за действия, совершённые через его аккаунт.']],
        ['3. Цены и оплата', ['Цены указаны в сумах в разделе «Цены» на сайте и в боте. Исполнитель может менять цены; изменение не касается уже оплаченных заказов.', 'Оплата — предварительная, пополнением внутреннего баланса: перевод на банковскую карту (чек проверяет администратор), Payme или Click. Деньги списываются с баланса в момент заказа.', 'Промокоды и бонусы за приглашения зачисляются на баланс и не обмениваются на деньги.']],
        ['4. Оказание услуги', ['Обычно презентация готова за 1–5 минут; она доступна для скачивания в кабинете на сайте и отправляется в чат Telegram. При очереди время может увеличиться.', 'Услуга считается оказанной, когда файл подготовлен и предоставлен пользователю.']],
        ['5. Возврат', ['Если презентация не подготовлена по техническим причинам, списанная сумма автоматически возвращается на баланс.', 'Неиспользованный остаток баланса возвращается по письменному обращению пользователя тем же способом, которым он был оплачен, в течение 10 рабочих дней. Суммы промокодов и бонусов не возвращаются.', 'Если содержание презентации не устроило пользователя, он может перерисовать её в другом шаблоне или заказать новую; оплаченная сумма в этом случае не возвращается.']],
        ['6. Обязанности сторон', ['Пользователь не использует Сервис в целях, противоречащих законодательству Республики Узбекистан, для создания оскорбительного, незаконного или нарушающего права других лиц содержания.', 'Пользователь отвечает за загружаемые документы и изображения и права на них.', 'Исполнитель принимает разумные меры для бесперебойной работы, но не отвечает за технические работы и сбои сторонних сервисов (Telegram, провайдеры ИИ, платёжные системы).']],
        ['7. Интеллектуальная собственность', ['Готовый файл передаётся пользователю для личного и коммерческого использования без ограничений. Дизайн шаблонов и программное обеспечение Сервиса принадлежат Исполнителю.', 'Изображения используются по лицензии фотостока (Pexels) или создаются ИИ.']],
        ['8. Ответственность', ['Ответственность Исполнителя в любом случае ограничена суммой, оплаченной пользователем за соответствующий заказ. Исполнитель не отвечает за косвенные убытки от использования содержания презентации.']],
        ['9. Прочее', ['Исполнитель может изменять оферту; новая редакция действует с момента публикации на сайте. Споры решаются переговорами, а при недостижении согласия — в суде по законодательству Республики Узбекистан.']],
      ],
    },
    en: {
      title: 'Public offer',
      intro: 'This document is the public offer of {name} (the “Provider”) to provide presentation services through slidechi.uz and the Telegram bot @slidechibot (together, the “Service”), under Article 367 of the Civil Code of the Republic of Uzbekistan. Using the Service or topping up the balance means full acceptance of these terms. The Uzbek version prevails.',
      sections: [
        ['1. Subject', ['The Provider uses AI to prepare a PowerPoint (.pptx) presentation from the user’s topic and settings, redraws a finished presentation in another template, builds PDFs from images and offers other features.', 'Text and images are generated automatically. The user checks the content, facts and sources before using the file.']],
        ['2. Account', ['A Telegram account is required. Sign-in to the website uses a one-time code from @slidechibot. The account, balance and presentations are shared between the website and the bot.']],
        ['3. Prices and payment', ['Prices are shown in UZS on the website and in the bot and may change; changes do not affect paid orders.', 'Payment is made in advance by topping up the balance: card transfer (an admin checks the receipt), Payme or Click. The price is taken from the balance when an order is placed.', 'Promo codes and invite bonuses are added to the balance and cannot be exchanged for cash.']],
        ['4. Delivery', ['A presentation is usually ready in 1–5 minutes and is available in the account and sent to the Telegram chat.']],
        ['5. Refunds', ['If a presentation fails for technical reasons, the amount is returned to the balance automatically.', 'An unused balance is refunded on written request, by the original payment method, within 10 business days. Promo and bonus amounts are not refunded.']],
        ['6. Obligations', ['The user does not use the Service for unlawful, offensive or infringing content and is responsible for uploaded documents and images.', 'The Provider takes reasonable care to keep the Service running but is not liable for outages of third-party services (Telegram, AI providers, payment systems).']],
        ['7. Intellectual property', ['The finished file may be used by the user for personal and commercial purposes. Template designs and the software belong to the Provider.']],
        ['8. Liability', ['The Provider’s liability is limited to the amount paid for the order concerned.']],
        ['9. Other', ['The Provider may change this offer; the new version applies from its publication. Disputes are settled under the laws of the Republic of Uzbekistan.']],
      ],
    },
  },
  privacy: {
    uz: {
      title: 'Maxfiylik siyosati',
      intro: "Ushbu siyosat {name} slidechi.uz sayti va @slidechibot boti orqali qanday shaxsiy ma'lumotlarni yig'ishi, nima uchun ishlatishi va qanday himoya qilishini tushuntiradi («Shaxsga doir ma'lumotlar to'g'risida»gi O'zbekiston Respublikasi Qonuni).",
      sections: [
        ["1. Qanday ma'lumotlar yig'iladi", [
          "Telegram ma'lumotlari: Telegram ID, ism, familiya, username, til.",
          "Xizmat ma'lumotlari: kiritilgan mavzular, titul sahifa ma'lumotlari (muallif, tashkilot, shahar, yil), yaratilgan taqdimotlar, yuklangan hujjat va rasmlar, balans va to'lovlar tarixi, to'lov cheki rasmlari.",
          "Texnik ma'lumotlar: IP manzil va brauzer turi (xavfsizlik va suiiste'mollikning oldini olish uchun), sayt sessiyasi uchun cookie.",
        ]],
        ["2. Nima uchun ishlatiladi", [
          "Xizmatni ko'rsatish: taqdimot tayyorlash, faylni yetkazish, balansni yuritish va to'lovlarni tekshirish.",
          "Xavfsizlik: kirish kodlarini yuborish, qurilmadan kirish haqida xabar berish, urinishlar sonini cheklash.",
          "Xizmat haqida xabarlar va (siz roziligingiz bilan bot orqali) yangiliklar yuborish; umumlashtirilgan statistika.",
        ]],
        ["3. Uchinchi tomonlar", [
          "Taqdimot matnini yaratish uchun mavzu va yuklangan hujjat matni sun'iy intellekt provayderiga (Google Gemini) yuboriladi; rasm qidirish uchun qisqa inglizcha so'rov fotostokka (Pexels) yuboriladi. Ularga ism, Telegram ID yoki to'lov ma'lumotlari berilmaydi.",
          "To'lovlar Payme va Click tizimlari orqali o'tadi; karta ma'lumotlaringiz bizga kelmaydi.",
          "Ma'lumotlar sotilmaydi va reklama maqsadida berilmaydi. Qonunda nazarda tutilgan hollarda vakolatli organlarga berilishi mumkin.",
        ]],
        ['4. Saqlash va himoya', [
          "Ma'lumotlar Ijrochi serverida saqlanadi. Ulanish HTTPS orqali shifrlanadi; kirish kodlari va sessiya tokenlari bazada faqat xesh ko'rinishida saqlanadi; sessiya cookie'si sahifa skriptlariga ko'rinmaydi.",
          "Ma'lumotlar hisob faol bo'lgan muddat davomida, to'lov yozuvlari esa qonunchilikda belgilangan muddatlarda saqlanadi. Kirish kodlari 1 kundan keyin, tashrif statistikasi 90 kundan keyin o'chiriladi.",
        ]],
        ['5. Cookie', [
          "Sayt faqat kirgan holatingizni eslab qolish uchun bitta zaruriy cookie (sessiya) va interfeys tilini eslab qolish uchun brauzer xotirasidan foydalanadi. Reklama va kuzatuv cookie'lari ishlatilmaydi.",
        ]],
        ['6. Sizning huquqlaringiz', [
          "Siz o'z ma'lumotlaringiz haqida ma'lumot olish, ularni tuzatish yoki o'chirishni so'rashingiz mumkin. Taqdimotlarni kabinetda o'zingiz o'chira olasiz; hisobni to'liq o'chirish uchun quyidagi aloqa orqali murojaat qiling.",
        ]],
        ["7. O'zgarishlar va aloqa", [
          "Siyosat o'zgarsa, yangi tahrir shu sahifaga joylanadi.",
        ]],
      ],
    },
    ru: {
      title: 'Политика конфиденциальности',
      intro: 'Эта политика объясняет, какие персональные данные {name} собирает через сайт slidechi.uz и бот @slidechibot, зачем их использует и как защищает (Закон Республики Узбекистан «О персональных данных»).',
      sections: [
        ['1. Какие данные собираются', ['Данные Telegram: ID, имя, фамилия, username, язык.', 'Данные сервиса: темы, данные титульного слайда (автор, организация, город, год), созданные презентации, загруженные документы и изображения, история баланса и платежей, фото чеков.', 'Технические данные: IP-адрес и тип браузера (для безопасности и защиты от злоупотреблений), cookie сессии сайта.']],
        ['2. Зачем', ['Оказание услуги: подготовка презентаций, доставка файлов, ведение баланса и проверка платежей.', 'Безопасность: отправка кодов входа, уведомления о входе с нового устройства, ограничение числа попыток.', 'Сервисные сообщения и (с вашего согласия, через бот) новости; обезличенная статистика.']],
        ['3. Третьи лица', ['Для написания текста тема и текст загруженного документа отправляются провайдеру ИИ (Google Gemini); для поиска изображений короткий английский запрос отправляется фотостоку (Pexels). Имя, Telegram ID и платёжные данные им не передаются.', 'Платежи проходят через Payme и Click; данные карты к нам не поступают.', 'Данные не продаются и не передаются для рекламы; могут быть переданы уполномоченным органам в случаях, предусмотренных законом.']],
        ['4. Хранение и защита', ['Данные хранятся на сервере Исполнителя. Соединение шифруется HTTPS; коды входа и токены сессий хранятся только в виде хешей; cookie сессии недоступна скриптам страницы.', 'Данные хранятся, пока аккаунт активен; платёжные записи — в сроки, установленные законом. Коды входа удаляются через 1 день, статистика посещений — через 90 дней.']],
        ['5. Cookie', ['Сайт использует одну необходимую cookie (сессия) и память браузера для языка интерфейса. Рекламные и отслеживающие cookie не используются.']],
        ['6. Ваши права', ['Вы можете запросить сведения о своих данных, их исправление или удаление. Презентации можно удалить в кабинете; для полного удаления аккаунта напишите нам по контактам ниже.']],
        ['7. Изменения и контакты', ['Новая редакция политики публикуется на этой странице.']],
      ],
    },
    en: {
      title: 'Privacy policy',
      intro: 'This policy explains what personal data {name} collects through slidechi.uz and @slidechibot, why, and how it is protected (Law of the Republic of Uzbekistan “On Personal Data”).',
      sections: [
        ['1. Data collected', ['Telegram data: ID, first and last name, username, language.', 'Service data: topics, title-slide details, presentations, uploaded documents and images, balance and payment history, receipt photos.', 'Technical data: IP address and browser type (security and abuse prevention), a session cookie.']],
        ['2. Purposes', ['Providing the service, security (sign-in codes, new-device notices, rate limits), service messages and aggregate statistics.']],
        ['3. Third parties', ['The topic and uploaded document text are sent to the AI provider (Google Gemini); short English image queries go to Pexels. No names, Telegram IDs or payment data are shared with them.', 'Payments go through Payme and Click; card data never reaches us. Data is not sold.']],
        ['4. Storage and security', ['Data is stored on the Provider’s server, over HTTPS; sign-in codes and session tokens are stored only as hashes. Sign-in codes are deleted after 1 day, visit statistics after 90 days.']],
        ['5. Cookies', ['One necessary session cookie and browser storage for the interface language. No advertising or tracking cookies.']],
        ['6. Your rights', ['You may ask to see, correct or delete your data. Presentations can be deleted in your account; to delete the account, contact us below.']],
        ['7. Changes and contact', ['A new version is published on this page.']],
      ],
    },
  },
};
