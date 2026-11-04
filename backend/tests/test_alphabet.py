from app.services import alphabet
from app.services.alphabet import content_to_new, to_new


def test_the_four_letters_in_every_case_and_apostrophe():
    assert to_new("O'zbekiston bo‘ylab shablonlar, chiqish, g'alaba, tog' va bogʻ.") == "Özbekiston böylab şablonlar, çiqiş, ğalaba, toğ va boğ."
    assert to_new("SHAHAR: Toshkent, O‘ZBEKISTON, Gʻarb, Chorak") == "ŞAHAR: Toşkent, ÖZBEKISTON, Ğarb, Çorak"


def test_the_tutuq_belgisi_and_ng_stay():
    assert to_new("ma'lumot, ta’lim, Is'hoq, mo''tadil, tong, ming") == "ma'lumot, ta’lim, Is'hoq, mö'tadil, tong, ming"


def test_what_is_not_uzbek_is_left_as_it_is():
    s = "<b>Ko'rish</b> {amount} /start https://t.me/slidechibot?start=x @slidechibot info@slidechi.uz deck.pptx"
    assert to_new(s) == "<b>Köriş</b> {amount} /start https://t.me/slidechibot?start=x @slidechibot info@slidechi.uz deck.pptx"
    assert to_new("Telegram, PowerPoint, ChatGPT, Chrome, Microsoft, fetch, QQS, YaIM") == "Telegram, PowerPoint, ChatGPT, Chrome, Microsoft, fetch, QQS, YaIM"


def test_new_text_comes_back_the_same():
    s = "Özbekça şablon: çiqiş, ğalaba"
    assert to_new(s) == s and to_new(to_new("Qo'shimcha shartlar")) == to_new("Qo'shimcha shartlar")


def test_a_deck_is_turned_but_its_names_and_technical_fields_are_not():
    c = {"meta": {"topic": "Soliq o'sishi", "author": "Toshmatov", "org": "TDIU", "loc": "Toshkent"},
         "slides": [{"type": "cards", "title": "Asosiy o'zgarishlar", "items": [{"icon": "FiShield", "h": "Shaffoflik", "t": "Chegirmalar"}],
                     "image": "/tmp/shahar.jpg"}]}
    out = content_to_new(c)
    assert out["meta"] == {**c["meta"], "topic": "Soliq ösişi"}
    s = out["slides"][0]
    assert s["title"] == "Asosiy özgarişlar" and s["items"][0] == {"icon": "FiShield", "h": "Şaffoflik", "t": "Çegirmalar"}
    assert s["image"] == "/tmp/shahar.jpg" and s["type"] == "cards" and alphabet.NEW == "uzn"


def test_uzbek_words_with_tch_are_uzbek():
    assert to_new("ma'muriyatchiligi, xizmatchi, hisobotchi") == "ma'muriyatçiligi, xizmatçi, hisobotçi"
