/**
 * Website texts in three languages. Keys are shared; {name}-style placeholders are filled by t().
 * The chosen language is kept in this browser only: it does not change the language the bot speaks.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TEMPLATE_NAMES } from '../../miniapp/src/i18n/messages.js';
import { MORE } from './i18n-more.js';

export const LANGS = [
  { id: 'uz', short: 'UZ', label: "O'zbekcha" },
  { id: 'ru', short: 'RU', label: 'Русский' },
  { id: 'en', short: 'EN', label: 'English' },
];

/** 15000 -> "15 000 so'm" / "15 000 сум" / "15,000 UZS" (as in the bot) */
/** 1730212345 -> "29.10.2026" (+ " 17:40" with time): one format for every language, as in the admin panel */
export const date = (sec, time = false) => {
  const d = new Date(sec * 1000), p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}${time ? ` ${p(d.getHours())}:${p(d.getMinutes())}` : ''}`;
};

export const money = (n, lang) => (lang === 'en' ? `${Number(n).toLocaleString('en-US')} UZS`
  : `${Number(n).toLocaleString('en-US').replace(/,/g, ' ')} ${lang === 'ru' ? 'сум' : "so'm"}`);

export const MESSAGES = {
  uz: {
    navFeatures: 'Imkoniyatlar', navTemplates: 'Shablonlar', navPricing: 'Narxlar', navFaq: 'Savollar',
    signIn: 'Kirish', openApp: 'Kabinet', startNow: 'Taqdimot yaratish', openBot: 'Telegram bot',
    heroBadge: "Sun'iy intellekt · 40 ta shablon · 3 til",
    heroTitle: 'Mavzuni yozing — taqdimot bir necha daqiqada tayyor',
    heroText: "SlideAI matnni yozadi, mos rasmlarni topadi va chiroyli PowerPoint (.pptx) faylni tayyorlaydi. Sayt va Telegram bot — bitta hisob, bitta balans.",
    stepsTitle: 'Qanday ishlaydi', step1: 'Mavzu va shablon', step1t: 'Mavzuni yozing, slaydlar soni, til va 40 ta shablondan birini tanlang.',
    step2: "Sun'iy intellekt ishlaydi", step2t: "Reja, matn, raqamlar va rasmlar 1–2 daqiqada tayyorlanadi.",
    step3: 'Yuklab oling', step3t: "Tayyor .pptx faylni saytdan yuklab oling — u Telegram'ga ham yuboriladi.",
    featuresTitle: 'Hammasi bir joyda',
    f1: 'Tayyor matn', f1t: "Titul, kirish, reja, asosiy qism, xulosa va manbalar — mavzuga mos va tushunarli.",
    f2: 'Mos rasmlar', f2t: 'Har bir slaydga mavzuga mos rasm avtomatik qo\'yiladi.',
    f3: '40 ta shablon', f3t: 'Biznes, akademik, kreativ va minimalist uslublar.',
    f4: "O'zbek, rus, ingliz", f4t: 'Taqdimotni uch tilning istalganida yarating.',
    f5: 'Muharrir', f5t: "Matn, rang, rasm, jadval va slaydlarni brauzerda o'zgartiring.",
    f6: 'Rasmdan PDF', f6t: 'Bir nechta rasmni bitta PDF faylga aylantiring.',
    templatesTitle: '40 ta shablon', templatesText: "Har biri o'z uslubida: sarlavhalar, ranglar va matn ohangi shablonga moslashadi.",
    cat_all: 'Barchasi', cat_business: 'Biznes', cat_academic: 'Akademik', cat_creative: 'Kreativ', cat_minimalist: 'Minimalist',
    pricingTitle: 'Narxlar', pricingText: "Obuna yo'q — faqat yaratgan taqdimotingiz uchun to'laysiz.",
    priceGenerate: 'Yangi taqdimot', priceGenerateT: '6 dan 30 tagacha slayd, matn va rasmlar bilan',
    priceRestyle: 'Shablon almashtirish', priceRestyleT: 'Tayyor taqdimotni boshqa shablonda qayta chizish',
    pricePdf: 'Rasmdan PDF', pricePdfT: 'Bepul', free: 'Bepul',
    faqTitle: "Ko'p beriladigan savollar",
    q1: "Saytga qanday kiraman?", a1: "Telegram'dagi @slidechibot ga /start yozing, so'ng saytda Telegram username'ingizni kiriting. Bot sizga 6 xonali kod yuboradi.",
    q2: 'Bot va saytdagi balans bir xilmi?', a2: "Ha. Bu bitta hisob: balans, taqdimotlar va to'lovlar ikkala joyda ham bir xil ko'rinadi.",
    q3: "Balansni qanday to'ldiraman?", a3: "Kabinetdagi «Balans» bo'limida summani tanlang, ko'rsatilgan kartaga o'tkazing va chek rasmini yuklang. Administrator tasdiqlagach pul balansga tushadi.",
    q4: 'Taqdimot yaratilmasa nima bo\'ladi?', a4: "Pul avtomatik ravishda balansingizga qaytariladi.",
    q5: "Faylni tahrirlash mumkinmi?", a5: "Ha. .pptx faylni PowerPoint, Google Slides yoki saytdagi muharrirda o'zgartirishingiz mumkin.",
    footer: "SlideAI — sun'iy intellekt bilan taqdimotlar.",
    // sign-in
    loginTitle: 'Saytga kirish', loginText: 'Kirish kodi Telegram orqali @slidechibot dan keladi.',
    loginLabel: 'Telegram username yoki ID', loginPh: '@username', sendCode: 'Kod yuborish',
    loginHint: "Hali botdan foydalanmaganmisiz? Avval @slidechibot ni oching va /start bosing.",
    codeTitle: 'Kodni kiriting', codeText: "@slidechibot Telegram'dagi chatingizga 6 xonali kod yubordi.",
    codeLabel: 'Kod', verify: 'Kirish', resend: 'Kodni qayta yuborish', resendIn: 'Qayta yuborish: {s} s', back: 'Orqaga',
    e_notFound: "Bu foydalanuvchi topilmadi. @slidechibot ga /start yozing va qayta urining.",
    e_botBlocked: "Bot sizga yoza olmadi. @slidechibot ni blokdan chiqaring va /start bosing.",
    e_wait: 'Kod hozirgina yuborildi. Bir daqiqadan keyin qayta urining.',
    e_tooMany: "Juda ko'p urinish. Birozdan keyin qayta urining.",
    e_badCode: "Kod noto'g'ri. Qayta tekshiring.", e_expired: "Kod eskirgan. Yangi kod oling.",
    e_signedOut: 'Qaytadan kiring.', e_lowBalance: "Balans yetarli emas. Avval balansni to'ldiring.",
    e_sameTemplate: 'Bu taqdimot allaqachon shu shablonda.', e_tooBig: 'Fayl juda katta.',
    e_notImage: 'Bu rasm emas.', e_pdfLimit: 'Bugungi PDF limiti tugadi. Ertaga qayta urining.', e_pdfCount: "1 dan 50 tagacha rasm tanlang.",
    e_decided: "Bu to'lov allaqachon ko'rib chiqilgan.", e_noCard: "Karta orqali to'lov hozircha yoqilmagan.",
    e_network: "Internet bilan aloqa yo'q.", e_server: "Xatolik yuz berdi. Birozdan keyin qayta urining.",
    // app
    tabCreate: 'Yaratish', tabDecks: 'Taqdimotlar', tabBalance: 'Balans', tabPdf: 'Rasmdan PDF',
    balance: 'Balans', topUp: "To'ldirish", signOut: 'Chiqish', signOutAll: 'Barcha qurilmalardan chiqish',
    topic: 'Mavzu', topicPh: "Masalan: Soliq islohotlari va iqtisodiy o'sish", slides: 'Slaydlar soni', slidesN: '{n} ta slayd',
    deckLang: 'Taqdimot tili', template: 'Shablon', details: "Titul sahifasi (ixtiyoriy)",
    author: 'Muallif', authorPh: 'Ism Familiya', org: 'Tashkilot', orgPh: 'Masalan, TDIU', loc: 'Shahar', locPh: 'Toshkent', year: 'Yil',
    create: 'Taqdimot yaratish · {price}', creating: 'Yuborilmoqda…',
    queued: "Qabul qilindi! Taqdimot 1–2 daqiqada tayyor bo'ladi va «Taqdimotlar» bo'limida paydo bo'ladi.",
    work: 'Jarayonda', st_queued: 'Navbatda', st_running: 'Tayyorlanmoqda…', st_done: 'Tayyor', st_failed: 'Bajarilmadi, pul qaytarildi',
    ahead: 'oldinda {n} ta',
    noDecks: "Hali taqdimot yo'q. «Yaratish» bo'limida birinchisini yarating.",
    download: 'Yuklab olish', downloading: 'Tayyorlanmoqda…', restyle: 'Shablonni almashtirish', edit: 'Muharrirda ochish',
    restyleTitle: 'Yangi shablonni tanlang', restyleBtn: 'Shu shablonda qayta chizish · {price}', cancel: 'Bekor qilish',
    restyleQueued: "Qabul qilindi! Yangi shablondagi fayl bir necha daqiqada tayyor bo'ladi.",
    topupTitle: "Balansni to'ldirish", topupText: "Summani tanlang — karta raqami va to'lov ID'si ko'rsatiladi.",
    cardTitle: "Kartaga o'tkazing", cardNumber: 'Karta raqami', cardHolder: 'Karta egasi', payCode: "To'lov ID", amount: 'Summa',
    cardSteps: "1. Ko'rsatilgan summani kartaga o'tkazing.\n2. To'lov chekining rasmini (skrinshot) shu yerga yuklang.\n3. Administrator tekshirgach, pul balansingizga tushadi va Telegram'ga xabar keladi.",
    uploadReceipt: 'Chek rasmini yuklash', receiptSent: "Chek yuborildi. Administrator tez orada tekshiradi.",
    copy: 'Nusxa olish', copied: 'Nusxa olindi', orders: "To'lovlar", history: 'Balans tarixi',
    os_new: 'Chek kutilmoqda', os_review: 'Tekshirilmoqda', os_paid: 'Tushdi', os_rejected: 'Rad etildi',
    k_generate: 'Taqdimot', k_restyle: 'Shablon almashtirish', k_refund: 'Qaytarildi', k_topup: "To'ldirish",
    pdfTitle: 'Rasmdan PDF', pdfText: 'Rasmlarni tanlang (50 tagacha) — har biri A4 sahifaga joylanadi.',
    pickImages: 'Rasmlarni tanlash', pdfName: 'Fayl nomi', pdfNamePh: 'rasmlar', makePdf: 'PDF yaratish', makingPdf: 'Tayyorlanmoqda…',
    pdfSkipped: "{n} ta fayl rasm emas edi va qo'shilmadi.", remove: "O'chirish", moveUp: 'Yuqoriga', moveDown: 'Pastga',
    signedInAs: 'Hisob',
  },
  ru: {
    navFeatures: 'Возможности', navTemplates: 'Шаблоны', navPricing: 'Цены', navFaq: 'Вопросы',
    signIn: 'Войти', openApp: 'Кабинет', startNow: 'Создать презентацию', openBot: 'Telegram-бот',
    heroBadge: 'Искусственный интеллект · 40 шаблонов · 3 языка',
    heroTitle: 'Напишите тему — презентация будет готова за пару минут',
    heroText: 'SlideAI пишет текст, подбирает изображения и собирает красивый файл PowerPoint (.pptx). Сайт и Telegram-бот — один аккаунт, один баланс.',
    stepsTitle: 'Как это работает', step1: 'Тема и шаблон', step1t: 'Напишите тему, выберите число слайдов, язык и один из 40 шаблонов.',
    step2: 'Работает ИИ', step2t: 'План, текст, цифры и изображения готовы за 1–2 минуты.',
    step3: 'Скачайте', step3t: 'Скачайте готовый .pptx на сайте — он также придёт в Telegram.',
    featuresTitle: 'Всё в одном месте',
    f1: 'Готовый текст', f1t: 'Титул, введение, план, основная часть, выводы и источники — по теме и понятно.',
    f2: 'Подходящие изображения', f2t: 'К каждому слайду автоматически подбирается картинка по теме.',
    f3: '40 шаблонов', f3t: 'Бизнес, академический, креативный и минималистичный стили.',
    f4: 'Узбекский, русский, английский', f4t: 'Создавайте презентации на любом из трёх языков.',
    f5: 'Редактор', f5t: 'Меняйте текст, цвета, изображения, таблицы и слайды прямо в браузере.',
    f6: 'PDF из фото', f6t: 'Соберите несколько изображений в один PDF-файл.',
    templatesTitle: '40 шаблонов', templatesText: 'У каждого свой стиль: заголовки, цвета и тон текста подстраиваются под шаблон.',
    cat_all: 'Все', cat_business: 'Бизнес', cat_academic: 'Академический', cat_creative: 'Креативный', cat_minimalist: 'Минимализм',
    pricingTitle: 'Цены', pricingText: 'Без подписки — платите только за созданные презентации.',
    priceGenerate: 'Новая презентация', priceGenerateT: 'От 6 до 30 слайдов, с текстом и изображениями',
    priceRestyle: 'Смена шаблона', priceRestyleT: 'Готовая презентация в другом шаблоне',
    pricePdf: 'PDF из фото', pricePdfT: 'Бесплатно', free: 'Бесплатно',
    faqTitle: 'Частые вопросы',
    q1: 'Как войти на сайт?', a1: 'Напишите /start боту @slidechibot в Telegram, затем введите на сайте свой username. Бот пришлёт 6-значный код.',
    q2: 'Баланс в боте и на сайте общий?', a2: 'Да. Это один аккаунт: баланс, презентации и платежи одинаковы в обоих местах.',
    q3: 'Как пополнить баланс?', a3: 'В разделе «Баланс» выберите сумму, переведите её на указанную карту и загрузите фото чека. После проверки администратором деньги поступят на баланс.',
    q4: 'Что если презентация не создалась?', a4: 'Деньги автоматически вернутся на баланс.',
    q5: 'Можно ли редактировать файл?', a5: 'Да. Файл .pptx открывается в PowerPoint, Google Slides или в редакторе на сайте.',
    footer: 'SlideAI — презентации с искусственным интеллектом.',
    loginTitle: 'Вход на сайт', loginText: 'Код для входа придёт в Telegram от @slidechibot.',
    loginLabel: 'Username или ID в Telegram', loginPh: '@username', sendCode: 'Получить код',
    loginHint: 'Ещё не пользовались ботом? Сначала откройте @slidechibot и нажмите /start.',
    codeTitle: 'Введите код', codeText: '@slidechibot отправил 6-значный код в ваш чат в Telegram.',
    codeLabel: 'Код', verify: 'Войти', resend: 'Отправить код ещё раз', resendIn: 'Повторно через {s} с', back: 'Назад',
    e_notFound: 'Пользователь не найден. Напишите /start боту @slidechibot и попробуйте снова.',
    e_botBlocked: 'Бот не смог вам написать. Разблокируйте @slidechibot и нажмите /start.',
    e_wait: 'Код только что отправлен. Попробуйте через минуту.',
    e_tooMany: 'Слишком много попыток. Попробуйте позже.',
    e_badCode: 'Неверный код. Проверьте ещё раз.', e_expired: 'Код устарел. Получите новый.',
    e_signedOut: 'Войдите снова.', e_lowBalance: 'Недостаточно средств. Сначала пополните баланс.',
    e_sameTemplate: 'Эта презентация уже в этом шаблоне.', e_tooBig: 'Файл слишком большой.',
    e_notImage: 'Это не изображение.', e_pdfLimit: 'Дневной лимит PDF исчерпан. Попробуйте завтра.', e_pdfCount: 'Выберите от 1 до 50 изображений.',
    e_decided: 'Этот платёж уже рассмотрен.', e_noCard: 'Оплата картой пока недоступна.',
    e_network: 'Нет связи с интернетом.', e_server: 'Произошла ошибка. Попробуйте позже.',
    tabCreate: 'Создать', tabDecks: 'Презентации', tabBalance: 'Баланс', tabPdf: 'PDF из фото',
    balance: 'Баланс', topUp: 'Пополнить', signOut: 'Выйти', signOutAll: 'Выйти на всех устройствах',
    topic: 'Тема', topicPh: 'Например: Налоговые реформы и экономический рост', slides: 'Количество слайдов', slidesN: '{n} слайдов',
    deckLang: 'Язык презентации', template: 'Шаблон', details: 'Титульный слайд (необязательно)',
    author: 'Автор', authorPh: 'Имя Фамилия', org: 'Организация', orgPh: 'Например, ТГЭУ', loc: 'Город', locPh: 'Ташкент', year: 'Год',
    create: 'Создать презентацию · {price}', creating: 'Отправка…',
    queued: 'Принято! Презентация будет готова через 1–2 минуты и появится в разделе «Презентации».',
    work: 'В работе', st_queued: 'В очереди', st_running: 'Готовится…', st_done: 'Готово', st_failed: 'Не удалось, деньги возвращены',
    ahead: 'впереди {n}',
    noDecks: 'Пока нет презентаций. Создайте первую в разделе «Создать».',
    download: 'Скачать', downloading: 'Готовится…', restyle: 'Сменить шаблон', edit: 'Открыть в редакторе',
    restyleTitle: 'Выберите новый шаблон', restyleBtn: 'Перерисовать в этом шаблоне · {price}', cancel: 'Отмена',
    restyleQueued: 'Принято! Файл в новом шаблоне будет готов через несколько минут.',
    topupTitle: 'Пополнение баланса', topupText: 'Выберите сумму — появятся номер карты и ID платежа.',
    cardTitle: 'Переведите на карту', cardNumber: 'Номер карты', cardHolder: 'Владелец карты', payCode: 'ID платежа', amount: 'Сумма',
    cardSteps: '1. Переведите указанную сумму на карту.\n2. Загрузите сюда фото (скриншот) чека.\n3. После проверки администратором деньги поступят на баланс, а в Telegram придёт сообщение.',
    uploadReceipt: 'Загрузить фото чека', receiptSent: 'Чек отправлен. Администратор скоро проверит.',
    copy: 'Копировать', copied: 'Скопировано', orders: 'Платежи', history: 'История баланса',
    os_new: 'Ждём чек', os_review: 'На проверке', os_paid: 'Зачислено', os_rejected: 'Отклонено',
    k_generate: 'Презентация', k_restyle: 'Смена шаблона', k_refund: 'Возврат', k_topup: 'Пополнение',
    pdfTitle: 'PDF из фото', pdfText: 'Выберите изображения (до 50) — каждое ляжет на страницу A4.',
    pickImages: 'Выбрать изображения', pdfName: 'Имя файла', pdfNamePh: 'фото', makePdf: 'Создать PDF', makingPdf: 'Готовится…',
    pdfSkipped: '{n} файл(ов) не были изображениями и не добавлены.', remove: 'Удалить', moveUp: 'Выше', moveDown: 'Ниже',
    signedInAs: 'Аккаунт',
  },
  en: {
    navFeatures: 'Features', navTemplates: 'Templates', navPricing: 'Pricing', navFaq: 'FAQ',
    signIn: 'Sign in', openApp: 'Dashboard', startNow: 'Create a presentation', openBot: 'Telegram bot',
    heroBadge: 'AI · 40 templates · 3 languages',
    heroTitle: 'Type a topic — get a presentation in minutes',
    heroText: 'SlideAI writes the text, finds fitting images and builds a polished PowerPoint (.pptx) file. The website and the Telegram bot share one account and one balance.',
    stepsTitle: 'How it works', step1: 'Topic and template', step1t: 'Type a topic, pick the number of slides, the language and one of 40 templates.',
    step2: 'AI does the work', step2t: 'Outline, text, figures and images are ready in 1–2 minutes.',
    step3: 'Download', step3t: 'Download the .pptx on the website — it is also sent to you in Telegram.',
    featuresTitle: 'Everything in one place',
    f1: 'Ready text', f1t: 'Title, introduction, outline, body, conclusion and sources — on topic and clear.',
    f2: 'Fitting images', f2t: 'Every slide gets an image that matches the topic.',
    f3: '40 templates', f3t: 'Business, academic, creative and minimalist styles.',
    f4: 'Uzbek, Russian, English', f4t: 'Create presentations in any of the three languages.',
    f5: 'Editor', f5t: 'Change text, colours, images, tables and slides right in the browser.',
    f6: 'Images to PDF', f6t: 'Turn several images into one PDF file.',
    templatesTitle: '40 templates', templatesText: 'Each has its own style: headings, colours and tone adapt to the template.',
    cat_all: 'All', cat_business: 'Business', cat_academic: 'Academic', cat_creative: 'Creative', cat_minimalist: 'Minimalist',
    pricingTitle: 'Pricing', pricingText: 'No subscription — you pay only for the presentations you make.',
    priceGenerate: 'New presentation', priceGenerateT: '6 to 30 slides with text and images',
    priceRestyle: 'Template switch', priceRestyleT: 'A finished presentation redrawn in another template',
    pricePdf: 'Images to PDF', pricePdfT: 'Free', free: 'Free',
    faqTitle: 'Frequently asked questions',
    q1: 'How do I sign in?', a1: 'Send /start to @slidechibot in Telegram, then enter your Telegram username on the site. The bot sends you a 6-digit code.',
    q2: 'Is the balance the same in the bot and on the site?', a2: 'Yes. It is one account: balance, presentations and payments are the same in both places.',
    q3: 'How do I top up?', a3: 'In “Balance”, pick an amount, transfer it to the card shown and upload a photo of the receipt. Once an admin checks it, the money is added.',
    q4: 'What if a presentation fails?', a4: 'The money is returned to your balance automatically.',
    q5: 'Can I edit the file?', a5: 'Yes. Open the .pptx in PowerPoint, Google Slides or the editor on this site.',
    footer: 'SlideAI — presentations made with AI.',
    loginTitle: 'Sign in', loginText: 'Your sign-in code comes from @slidechibot in Telegram.',
    loginLabel: 'Telegram username or ID', loginPh: '@username', sendCode: 'Send code',
    loginHint: 'Never used the bot? Open @slidechibot and press /start first.',
    codeTitle: 'Enter the code', codeText: '@slidechibot sent a 6-digit code to your Telegram chat.',
    codeLabel: 'Code', verify: 'Sign in', resend: 'Send the code again', resendIn: 'Resend in {s} s', back: 'Back',
    e_notFound: 'User not found. Send /start to @slidechibot and try again.',
    e_botBlocked: 'The bot could not message you. Unblock @slidechibot and press /start.',
    e_wait: 'A code was just sent. Try again in a minute.',
    e_tooMany: 'Too many attempts. Try again later.',
    e_badCode: 'Wrong code. Please check it.', e_expired: 'The code has expired. Get a new one.',
    e_signedOut: 'Please sign in again.', e_lowBalance: 'Not enough balance. Top up first.',
    e_sameTemplate: 'This presentation already uses that template.', e_tooBig: 'The file is too large.',
    e_notImage: 'This is not an image.', e_pdfLimit: "Today's PDF limit is used up. Try again tomorrow.", e_pdfCount: 'Choose 1 to 50 images.',
    e_decided: 'This payment has already been reviewed.', e_noCard: 'Card payment is not available yet.',
    e_network: 'No internet connection.', e_server: 'Something went wrong. Try again later.',
    tabCreate: 'Create', tabDecks: 'Presentations', tabBalance: 'Balance', tabPdf: 'Images to PDF',
    balance: 'Balance', topUp: 'Top up', signOut: 'Sign out', signOutAll: 'Sign out everywhere',
    topic: 'Topic', topicPh: 'For example: Tax reforms and economic growth', slides: 'Number of slides', slidesN: '{n} slides',
    deckLang: 'Presentation language', template: 'Template', details: 'Title slide (optional)',
    author: 'Author', authorPh: 'First Last', org: 'Organisation', orgPh: 'e.g. TSUE', loc: 'City', locPh: 'Tashkent', year: 'Year',
    create: 'Create presentation · {price}', creating: 'Sending…',
    queued: 'Accepted! The presentation will be ready in 1–2 minutes and will appear under “Presentations”.',
    work: 'In progress', st_queued: 'Queued', st_running: 'Preparing…', st_done: 'Ready', st_failed: 'Failed, money returned',
    ahead: '{n} ahead',
    noDecks: 'No presentations yet. Create your first one under “Create”.',
    download: 'Download', downloading: 'Preparing…', restyle: 'Change template', edit: 'Open in editor',
    restyleTitle: 'Choose a new template', restyleBtn: 'Redraw in this template · {price}', cancel: 'Cancel',
    restyleQueued: 'Accepted! The file in the new template will be ready in a few minutes.',
    topupTitle: 'Top up the balance', topupText: 'Pick an amount — the card number and payment ID will be shown.',
    cardTitle: 'Transfer to the card', cardNumber: 'Card number', cardHolder: 'Card holder', payCode: 'Payment ID', amount: 'Amount',
    cardSteps: '1. Transfer the amount shown to the card.\n2. Upload a photo (screenshot) of the receipt here.\n3. Once an admin checks it, the money is added and you get a Telegram message.',
    uploadReceipt: 'Upload receipt photo', receiptSent: 'Receipt sent. An admin will check it soon.',
    copy: 'Copy', copied: 'Copied', orders: 'Payments', history: 'Balance history',
    os_new: 'Waiting for receipt', os_review: 'Under review', os_paid: 'Credited', os_rejected: 'Rejected',
    k_generate: 'Presentation', k_restyle: 'Template switch', k_refund: 'Refund', k_topup: 'Top-up',
    pdfTitle: 'Images to PDF', pdfText: 'Choose images (up to 50) — each goes on its own A4 page.',
    pickImages: 'Choose images', pdfName: 'File name', pdfNamePh: 'images', makePdf: 'Create PDF', makingPdf: 'Preparing…',
    pdfSkipped: '{n} file(s) were not images and were left out.', remove: 'Remove', moveUp: 'Up', moveDown: 'Down',
    signedInAs: 'Account',
  },
};

for (const l of Object.keys(MESSAGES)) Object.assign(MESSAGES[l], MORE[l]);

/** The language a page path asks for: /ru/..., /en/... (the home page is prerendered once per language). */
export const pathLang = (path) => (path.match(/^\/(ru|en)(\/|$)/) || [])[1] || null;

const I18nContext = createContext(null);

const saved = () => {
  try { const l = localStorage.getItem('lang'); return MESSAGES[l] ? l : null; } catch { return null; }
};

/** A prerendered page starts in its own language (the HTML must match); other pages in the saved / browser one. */
const initialLang = () => {
  if (typeof window === 'undefined') return 'uz';
  const pre = document.documentElement.dataset.prerendered;
  if (pre) return pre;
  const nav = (navigator.language || '').slice(0, 2);
  return saved() || (MESSAGES[nav] ? nav : 'uz');
};

export function I18nProvider({ children, initial }) {
  const [lang, setLangState] = useState(() => initial || initialLang());
  useEffect(() => { // the uz home page for a visitor who chose another language before
    const l = saved();
    if (document.documentElement.dataset.prerendered && !pathLang(window.location.pathname) && l && l !== lang) setLangState(l);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch { /* storage blocked */ }
    document.documentElement.lang = l;
  }, []);
  const t = useCallback((key, vars) => {
    const s = MESSAGES[lang][key] ?? MESSAGES.uz[key] ?? key;
    return vars ? s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : s;
  }, [lang]);
  const templateName = useCallback((tpl) => (lang === 'uz' ? tpl.name : TEMPLATE_NAMES[tpl.id]?.[lang === 'ru' ? 0 : 1] ?? tpl.name), [lang]);
  const value = useMemo(() => ({ lang, setLang, t, templateName, money: (n) => money(n, lang) }), [lang, setLang, t, templateName]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
