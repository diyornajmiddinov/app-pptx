/**
 * The public offer (oferta) and the privacy policy, in three languages: [heading, paragraphs[]] per section.
 * {op.name} style fields come from operator.js. A draft written for the service as it works: have a lawyer review it.
 */
export const LEGAL = {
  oferta: {
    uz: { // the main text; ru / en follow it section by section
      title: 'Ommaviy oferta',
      intro: "Uşbu hujjat {name} (keyingi örinlarda — «Ijroçi») tomonidan slidechi.uz sayti va @slidechibot Telegram boti (birgalikda — «Xizmat») orqali taqdimot tayyorlaş xizmatlarini körsatiş böyiça ommaviy ofertadir (Özbekiston Respublikasi Fuqarolik kodeksining 367-moddasi). Xizmatdan foydalaniş yoki balansni töldiriş uşbu şartlarni töliq qabul qilişni (aksept) anglatadi.",
      sections: [
        ['1. Xizmat mazmuni', [
          "Ijroçi foydalanuvçi kiritgan mavzu va sozlamalar asosida sun'iy intellekt yordamida PowerPoint (.pptx) formatidagi taqdimot faylini tayyorlaydi, mavjud taqdimotni boşqa şablonda qayta çizadi, rasmlardan PDF fayl yaratadi va boşqa qöşimça imkoniyatlarni taqdim etadi.",
          "Taqdimot matni va rasmlari avtomatik tarzda yaratiladi. Foydalanuvçi tayyor faylni işlatişdan oldin uning mazmunini, faktlar va manbalarni özi tekşiradi.",
        ]],
        ['2. Hisob', [
          "Xizmatdan foydalaniş uçun Telegram hisobi kerak. Saytga kiriş @slidechibot yuboradigan bir martalik kod orqali amalga oşiriladi. Sayt va botdagi hisob, balans va taqdimotlar umumiy.",
          "Foydalanuvçi kiriş kodini boşqalarga bermaslik va öz hisobi orqali qilingan harakatlar uçun javobgar.",
        ]],
        ['3. Narxlar va tölov', [
          "Xizmatlar narxi saytning «Narxlar» bölimida va botda sömda körsatiladi. Ijroçi narxlarni özgartirişi mumkin; özgariş allaqaçon tölangan buyurtmalarga ta'sir qilmaydi.",
          "Tölov oldindan, içki balansni töldiriş orqali amalga oşiriladi: bank kartasiga ötkazma (çek administrator tomonidan tekşiriladi), Payme yoki Click. Pul xizmat buyurtma qilingan paytda balansdan yeçiladi.",
          "Promokod va taklif bonuslari balansga qöşiladi, naqd pulga almaştirilmaydi.",
        ]],
        ['4. Xizmatni körsatiş', [
          "Taqdimot odatda 1–5 daqiqada tayyorlanadi va saytdagi kabinetda yuklab oliş uçun hamda Telegram çatga yuboriladi. Navbat bölsa, vaqt uzayişi mumkin.",
          "Xizmat fayl tayyorlangan va foydalanuvçiga taqdim etilgan paytda körsatilgan hisoblanadi.",
        ]],
        ['5. Pulni qaytariş', [
          "Taqdimot texnik sabablarga köra tayyorlanmasa, yeçilgan summa avtomatik ravişda balansga qaytariladi.",
          "Foydalanilmagan balans qoldiğini qaytariş foydalanuvçining Ijroçiga yozma murojaati asosida, tölov qilingan usul orqali, murojaatdan keyin 10 iş kuni içida amalga oşiriladi. Promokod va bonus summalari qaytarilmaydi.",
          "Tayyorlangan taqdimotning mazmuni foydalanuvçini qoniqtirmasa, u boşqa şablonda qayta çizdirişi yoki yangi taqdimot buyurtma qilişi mumkin; bunday holatda tölangan summa qaytarilmaydi.",
        ]],
        ['6. Taraflarning majburiyatlari', [
          "Foydalanuvçi Xizmatdan Özbekiston Respublikasi qonunçiligiga zid maqsadlarda, boşqalarning huquqlarini buzadigan, haqoratli yoki noqonuniy mazmun yaratiş uçun foydalanmaslikka majbur.",
          "Foydalanuvçi yuklagan hujjat va rasmlar uçun, ularga bölgan huquqlar uçun özi javobgar.",
          "Ijroçi Xizmatning uzluksiz işlaşi uçun oqilona çoralarni köradi, lekin texnik işlar, uçinçi tomon xizmatlaridagi (Telegram, AI provayderlari, tölov tizimlari) uzilişlar uçun javobgar emas.",
        ]],
        ['7. Intellektual mulk', [
          "Tayyorlangan taqdimot fayli foydalanuvçiga şaxsiy va tijorat maqsadlarida çeklovsiz foydalaniş uçun beriladi. Şablon dizayni va Xizmatning dasturiy ta'minoti Ijroçiga tegişli.",
          "Rasmlar fotostok (Pexels) litsenziyasi asosida yoki sun'iy intellekt orqali yaratiladi.",
        ]],
        ['8. Javobgarlik', [
          "Ijroçining javobgarligi har qanday holatda tegişli buyurtma uçun foydalanuvçi tölagan summa bilan çeklanadi. Ijroçi taqdimot mazmunidan foydalaniş natijasida yuzaga kelgan bilvosita zararlar uçun javobgar emas.",
        ]],
        ['9. Boşqa şartlar', [
          "Ijroçi ofertani özgartirişi mumkin; yangi tahrir saytga joylangan paytdan kuçga kiradi. Nizolar muzokaralar yöli bilan, kelişilmasa Özbekiston Respublikasi qonunçiligiga muvofiq sudda hal qilinadi.",
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
      intro: "Uşbu siyosat {name} slidechi.uz sayti va @slidechibot boti orqali qanday şaxsiy ma'lumotlarni yiğişi, nima uçun işlatişi va qanday himoya qilişini tuşuntiradi («Şaxsga doir ma'lumotlar töğrisida»gi Özbekiston Respublikasi Qonuni).",
      sections: [
        ["1. Qanday ma'lumotlar yiğiladi", [
          "Telegram ma'lumotlari: Telegram ID, ism, familiya, username, til.",
          "Xizmat ma'lumotlari: kiritilgan mavzular, titul sahifa ma'lumotlari (muallif, taşkilot, şahar, yil), yaratilgan taqdimotlar, yuklangan hujjat va rasmlar, balans va tölovlar tarixi, tölov çeki rasmlari.",
          "Texnik ma'lumotlar: IP manzil va brauzer turi (xavfsizlik va suiiste'mollikning oldini oliş uçun), sayt sessiyasi uçun cookie.",
        ]],
        ["2. Nima uçun işlatiladi", [
          "Xizmatni körsatiş: taqdimot tayyorlaş, faylni yetkaziş, balansni yuritiş va tölovlarni tekşiriş.",
          "Xavfsizlik: kiriş kodlarini yuboriş, qurilmadan kiriş haqida xabar beriş, urinişlar sonini çeklaş.",
          "Xizmat haqida xabarlar va (siz roziligingiz bilan bot orqali) yangiliklar yuboriş; umumlaştirilgan statistika.",
        ]],
        ["3. Uçinçi tomonlar", [
          "Taqdimot matnini yaratiş uçun mavzu va yuklangan hujjat matni sun'iy intellekt provayderiga (Google Gemini) yuboriladi; rasm qidiriş uçun qisqa inglizça sörov fotostokka (Pexels) yuboriladi. Ularga ism, Telegram ID yoki tölov ma'lumotlari berilmaydi.",
          "Tölovlar Payme va Click tizimlari orqali ötadi; karta ma'lumotlaringiz bizga kelmaydi.",
          "Ma'lumotlar sotilmaydi va reklama maqsadida berilmaydi. Qonunda nazarda tutilgan hollarda vakolatli organlarga berilişi mumkin.",
        ]],
        ['4. Saqlaş va himoya', [
          "Ma'lumotlar Ijroçi serverida saqlanadi. Ulaniş HTTPS orqali şifrlanadi; kiriş kodlari va sessiya tokenlari bazada faqat xeş körinişida saqlanadi; sessiya cookie'si sahifa skriptlariga körinmaydi.",
          "Ma'lumotlar hisob faol bölgan muddat davomida, tölov yozuvlari esa qonunçilikda belgilangan muddatlarda saqlanadi. Kiriş kodlari 1 kundan keyin, taşrif statistikasi 90 kundan keyin öçiriladi.",
        ]],
        ['5. Cookie', [
          "Sayt faqat kirgan holatingizni eslab qoliş uçun bitta zaruriy cookie (sessiya) va interfeys tilini eslab qoliş uçun brauzer xotirasidan foydalanadi. Reklama va kuzatuv cookie'lari işlatilmaydi.",
        ]],
        ['6. Sizning huquqlaringiz', [
          "Siz öz ma'lumotlaringiz haqida ma'lumot oliş, ularni tuzatiş yoki öçirişni söraşingiz mumkin. Taqdimotlarni kabinetda özingiz öçira olasiz; hisobni töliq öçiriş uçun quyidagi aloqa orqali murojaat qiling.",
        ]],
        ["7. Özgarişlar va aloqa", [
          "Siyosat özgarsa, yangi tahrir şu sahifaga joylanadi.",
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
