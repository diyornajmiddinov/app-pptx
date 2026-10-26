/**
 * All Mini App texts in three languages. Keys are shared; {name}-style placeholders are filled by t().
 * Add a language: copy one block, translate it, and add it to LANGS.
 */
const ruSlides = (n) => { // 1 слайд, 2–4 слайда, 5–20 слайдов, 21 слайд ...
  const m10 = n % 10, m100 = n % 100;
  return `${n} ${m10 === 1 && m100 !== 11 ? 'слайд' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'слайда' : 'слайдов'}`;
};

/** 15000 -> "15 000 so'm" / "15 000 сум" / "15,000 UZS" (same format as the bot) */
export const money = (n, lang) => (lang === 'en' ? `${n.toLocaleString('en-US')} UZS`
  : `${n.toLocaleString('en-US').replace(/,/g, '\u00a0')} ${lang === 'ru' ? 'сум' : "so'm"}`);

export const LANGS = [
  { id: 'uz', label: "O'zbekcha", short: 'UZ' },
  { id: 'ru', label: 'Русский', short: 'RU' },
  { id: 'en', label: 'English', short: 'EN' },
];

export const MESSAGES = {
  uz: {
    hello: 'Salom, {name}', guest: 'mehmon', subtitle: 'Mavzuni yozing va shablonni tanlang.', uiLang: 'Interfeys tili',
    details: "Taqdimot ma'lumotlari", topic: 'Mavzu', topicPh: "Masalan: Soliq islohotlari va iqtisodiy o'sish",
    author: 'Muallif', authorPh: 'Ism Familiya', org: 'Tashkilot', orgPh: 'Masalan, TDIU', loc: 'Shahar', locPh: 'Toshkent', year: 'Yil',
    settings: 'Sozlamalar', deckLang: 'Taqdimot tili', deckLangHint: 'Butun taqdimot shu tilda yoziladi.',
    slides: 'Slaydlar soni', slidesValue: (n) => `${n} ta slayd`, slidesHint: "Titul, Kirish, Reja, Manbalar va yakun slaydi doim bo'ladi.",
    dec: 'Kamaytirish', inc: "Ko'paytirish",
    templates: 'Shablonlar', count: (n) => `${n} ta`, categories: 'Shablon toifalari',
    cat_all: 'Barchasi', cat_business: 'Biznes', cat_academic: 'Akademik', cat_creative: 'Kreativ', cat_minimalist: 'Minimalist',
    mainBtn: 'Slayd tayyorlash', restyleBtn: 'Shu shablonda qayta olish', sending: 'Yuborilmoqda…',
    mode: 'Rejim', modeNew: 'Yangi taqdimot', modeEditor: 'Muharrir',
    edTitle: 'Taqdimot muharriri', edText: "Istalgan .pptx faylni o'zgartiring: matnni slaydning o'zida yozing, elementlarni suring, rasmlarni almashtiring, slaydlarni qo'shing.",
    edMobile: "💻 Muharrir faqat kompyuterda ishlaydi. Botni kompyuterdagi Telegram'da (Desktop yoki web.telegram.org) oching va shu bo'limga kiring yoki botga /editor yuboring.",
    edOpen: 'Muharrirni ochish', edOpening: 'Ochilmoqda…', edFile: "Faylni botga yuborsangiz ham muharrirda paydo bo'ladi.", modeRestyle: 'Mening taqdimotlarim', decksTitle: 'Qaysi taqdimotni boshqa shablonga o\'tkazamiz?',
    deckMeta: '{slides} · {tpl} · {date}',
    restyleNote: ({ topic, n }) => `«${topic}» (${n} ta slayd) tanlangan shablonda qayta chiziladi. Faktlar o'zgarmaydi, matn ohangi shablonga moslashtiriladi.`,
    noUser: 'Telegram foydalanuvchisi aniqlanmadi. Ilovani bot orqali oching.',
    needTopic: 'Mavzuni yozing (kamida 3 ta belgi).', needTemplate: "Pastdagi ro'yxatdan shablon tanlang.",
    needDeck: 'Avval taqdimotni ustiga bosib tanlang.',
    needOtherTemplate: 'Bu taqdimot allaqachon shu shablonda. Boshqa shablon tanlang.',
    e401: 'Sessiya eskirgan. Mini ilovani yopib, qayta oching.', e402: "Balans yetarli emas. To'ldirish tugmalarini botga yubordim.", balance: 'Balans: {balance}', topupHint: "to'ldirish — botda /balance",
    e403: "Bu amalga ruxsat yo'q.", e404: 'Taqdimot topilmadi.', e422: "Kiritilgan ma'lumotlarda xato bor. Mavzu va slaydlar sonini tekshiring.",
    e429: "So'rovlar juda ko'p. Bir daqiqadan so'ng urinib ko'ring.", eServer: ({ status }) => `Server xatosi (${status}). Qayta urinib ko'ring.`,
    eTimeout: "Server javob bermadi. Qayta urinib ko'ring.", eNetwork: "Internet aloqasini tekshirib, qayta urinib ko'ring.",
  },
  ru: {
    hello: 'Привет, {name}', guest: 'гость', subtitle: 'Напишите тему и выберите шаблон.', uiLang: 'Язык интерфейса',
    details: 'Данные презентации', topic: 'Тема', topicPh: 'Например: Налоговые реформы и экономический рост',
    author: 'Автор', authorPh: 'Имя Фамилия', org: 'Организация', orgPh: 'Например, ТГЭУ', loc: 'Город', locPh: 'Ташкент', year: 'Год',
    settings: 'Настройки', deckLang: 'Язык презентации', deckLangHint: 'Вся презентация будет написана на этом языке.',
    slides: 'Количество слайдов', slidesValue: ruSlides, slidesHint: 'Титульный слайд, введение, план, источники и заключение есть всегда.',
    dec: 'Уменьшить', inc: 'Увеличить',
    templates: 'Шаблоны', count: (n) => `${n}`, categories: 'Категории шаблонов',
    cat_all: 'Все', cat_business: 'Бизнес', cat_academic: 'Учёба', cat_creative: 'Креатив', cat_minimalist: 'Минимализм',
    mainBtn: 'Создать презентацию', restyleBtn: 'Получить в этом шаблоне', sending: 'Отправка…',
    mode: 'Режим', modeNew: 'Новая презентация', modeEditor: 'Редактор',
    edTitle: 'Редактор презентаций', edText: 'Меняйте любой файл .pptx: пишите текст прямо на слайде, двигайте элементы, заменяйте картинки, добавляйте слайды.',
    edMobile: '💻 Редактор работает только на компьютере. Откройте бота в Telegram на компьютере (Desktop или web.telegram.org) и зайдите в этот раздел или отправьте боту /editor.',
    edOpen: 'Открыть редактор', edOpening: 'Открываю…', edFile: 'Файл, отправленный боту, тоже появится в редакторе.', modeRestyle: 'Мои презентации', decksTitle: 'Какую презентацию перенести в другой шаблон?',
    deckMeta: '{slides} · {tpl} · {date}',
    restyleNote: ({ topic, n }) => `«${topic}» (${ruSlides(n)}) будет перерисована в выбранном шаблоне. Факты не меняются, стиль текста подстраивается под шаблон.`,
    noUser: 'Пользователь Telegram не определён. Откройте приложение через бота.',
    needTopic: 'Напишите тему (не меньше 3 символов).', needTemplate: 'Выберите шаблон в списке ниже.',
    needDeck: 'Сначала нажмите на презентацию, чтобы выбрать её.',
    needOtherTemplate: 'Эта презентация уже в этом шаблоне. Выберите другой.',
    e401: 'Сессия истекла. Закройте и снова откройте мини-приложение.', e402: 'Недостаточно средств. Кнопки пополнения отправлены в чат с ботом.', balance: 'Баланс: {balance}', topupHint: 'пополнение — в боте /balance',
    e403: 'Нет доступа к этому действию.', e404: 'Презентация не найдена.', e422: 'В данных есть ошибка. Проверьте тему и количество слайдов.',
    e429: 'Слишком много запросов. Попробуйте через минуту.', eServer: ({ status }) => `Ошибка сервера (${status}). Попробуйте снова.`,
    eTimeout: 'Сервер не ответил. Попробуйте снова.', eNetwork: 'Проверьте подключение к интернету и попробуйте снова.',
  },
  en: {
    hello: 'Hi, {name}', guest: 'guest', subtitle: 'Enter a topic and pick a template.', uiLang: 'Interface language',
    details: 'Presentation details', topic: 'Topic', topicPh: 'e.g. Tax reforms and economic growth',
    author: 'Author', authorPh: 'Full name', org: 'Organization', orgPh: 'e.g. TSUE', loc: 'City', locPh: 'Tashkent', year: 'Year',
    settings: 'Settings', deckLang: 'Presentation language', deckLangHint: 'The whole presentation is written in this language.',
    slides: 'Number of slides', slidesValue: (n) => `${n} slides`, slidesHint: 'Title, introduction, outline, references and closing slides are always included.',
    dec: 'Decrease', inc: 'Increase',
    templates: 'Templates', count: (n) => `${n}`, categories: 'Template categories',
    cat_all: 'All', cat_business: 'Business', cat_academic: 'Academic', cat_creative: 'Creative', cat_minimalist: 'Minimal',
    mainBtn: 'Create presentation', restyleBtn: 'Get it in this template', sending: 'Sending…',
    mode: 'Mode', modeNew: 'New presentation', modeEditor: 'Editor',
    edTitle: 'Presentation editor', edText: 'Change any .pptx file: type right on the slide, move elements, replace images, add slides.',
    edMobile: '💻 The editor works on computers only. Open the bot in Telegram on a computer (Desktop or web.telegram.org) and come to this tab, or send /editor to the bot.',
    edOpen: 'Open the editor', edOpening: 'Opening…', edFile: 'A file sent to the bot also appears in the editor.', modeRestyle: 'My presentations', decksTitle: 'Which presentation goes to another template?',
    deckMeta: '{slides} · {tpl} · {date}',
    restyleNote: ({ topic, n }) => `“${topic}” (${n} slides) will be redrawn in the selected template. Facts stay the same; the wording adapts to the template.`,
    noUser: 'Telegram user not found. Please open the app from the bot.',
    needTopic: 'Enter a topic (at least 3 characters).', needTemplate: 'Pick a template from the list below.',
    needDeck: 'First tap a presentation to select it.',
    needOtherTemplate: 'This presentation already uses this template. Pick another one.',
    e401: 'Session expired. Close and reopen the mini app.', e402: 'Not enough balance. Top-up buttons were sent to the bot chat.', balance: 'Balance: {balance}', topupHint: 'top up in the bot: /balance',
    e403: 'You are not allowed to do this.', e404: 'Presentation not found.', e422: 'Some details are invalid. Check the topic and number of slides.',
    e429: 'Too many requests. Try again in a minute.', eServer: ({ status }) => `Server error (${status}). Please try again.`,
    eTimeout: 'The server did not respond. Please try again.', eNetwork: 'Check your internet connection and try again.',
  },
};

/** Template names in Russian and English (Uzbek names live in data/templates.js). */
export const TEMPLATE_NAMES = {
  1: ['Аврора', 'Aurora'], 2: ['Редакция', 'Editorial'], 3: ['Корпоративный', 'Corporate'], 4: ['Самарканд', 'Samarkand'],
  5: ['Градиент', 'Gradient'], 6: ['Швейцарский', 'Swiss'], 7: ['Природа', 'Nature'], 8: ['Академический', 'Academic'],
  9: ['Люкс', 'Luxe'], 10: ['Дашборд', 'Dashboard'], 11: ['Баухаус', 'Bauhaus'], 12: ['Брутализм', 'Brutalist'],
  13: ['Чертёж', 'Blueprint'], 14: ['Клиника', 'Clinic'], 15: ['Ретро', 'Retro'], 16: ['Терминал', 'Terminal'],
  17: ['Дзен', 'Zen'], 18: ['Бенто', 'Bento'], 19: ['Круги', 'Radial'], 20: ['Карта', 'Map'],
  21: ['Фотожурнал', 'Photo Journal'], 22: ['Галерея', 'Gallery'], 23: ['Две половины', 'Split'], 24: ['Дуотон', 'Duotone'],
  25: ['Официальный', 'Formal'], 26: ['Кино', 'Cinema'], 27: ['Книга', 'Book'], 28: ['Бумага', 'Paper'],
  29: ['Динамика', 'Dynamic'], 30: ['Соты', 'Honeycomb'], 31: ['Изометрия', 'Isometric'], 32: ['Комикс', 'Comic'],
  33: ['Доска', 'Chalkboard'], 34: ['Тетрадь', 'Notebook'], 35: ['Ар-деко', 'Art Deco'], 36: ['Пиксель', 'Pixel'],
  37: ['Неоморфизм', 'Neumorphic'], 38: ['Элемент', 'Element'], 39: ['Метро', 'Metro'], 40: ['Почта', 'Post'],
};
