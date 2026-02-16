import sqlite3
import json

# Connect to database
conn = sqlite3.connect('conference.db')
cursor = conn.cursor()

# Create table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
''')

# Program page data with 4 sections
program_page_data = {
    "blocks": [
        {
            "id": "hero",
            "type": "hero",
            "title_ru": "Программа",
            "title_en": "Program",
            "title_tj": "Барнома",
            "subtitle_ru": "Программа конференции",
            "subtitle_en": "Conference Program",
            "subtitle_tj": "Барномаи конфронс"
        },
        {
            "id": "structure",
            "type": "text",
            "title_ru": "Структура программы",
            "title_en": "Program Structure",
            "title_tj": "Сохтори барнома",
            "content_ru": "<p>Конференция будет проходить в течение 4 дней и включает следующие форматы:</p><ul><li><strong>Пленарные заседания</strong> - высокого уровня с участием глав государств и правительств</li><li><strong>Тематические сессии</strong> - по ключевым направлениям водной повестки</li><li><strong>Параллельные мероприятия</strong> - организуемые партнерами конференции</li><li><strong>Выставка</strong> - демонстрация инновационных решений и технологий</li></ul>",
            "content_en": "<p>The conference will take place over 4 days and includes the following formats:</p><ul><li><strong>Plenary sessions</strong> - high-level with participation of heads of state and government</li><li><strong>Thematic sessions</strong> - on key areas of the water agenda</li><li><strong>Side events</strong> - organized by conference partners</li><li><strong>Exhibition</strong> - demonstration of innovative solutions and technologies</li></ul>",
            "content_tj": "<p>Конфронс дар давоми 4 рӯз баргузор мешавад ва форматҳои зеринро дар бар мегирад:</p><ul><li><strong>Ҷаласаҳои пленарӣ</strong> - сатҳи баланд бо иштироки сарони давлатҳо ва ҳукуматҳо</li><li><strong>Сессияҳои мавзӯӣ</strong> - оид ба самтҳои калидии дастури кории обӣ</li><li><strong>Чорабиниҳои параллелӣ</strong> - ташкилшуда аз ҷониби шарикони конфронс</li><li><strong>Намоишгоҳ</strong> - намоиши роҳҳои ҳалли навоварона ва технологияҳо</li></ul>"
        },
        {
            "id": "plenary",
            "type": "text",
            "background": "gray",
            "title_ru": "Пленарное заседание",
            "title_en": "Plenary Session",
            "title_tj": "Ҷаласаи пленарӣ",
            "content_ru": "<p>Пленарные заседания пройдут 25-26 мая 2026 года с участием глав государств, министров, руководителей международных организаций и других высокопоставленных лиц.</p><h3>Основные темы</h3><ul><li>Итоги Международного десятилетия действий «Вода для устойчивого развития»</li><li>Вклад в достижение ЦУР 6 и других водосвязанных целей</li><li>Международное сотрудничество и трансграничное водное управление</li><li>Финансирование водной инфраструктуры и технологий</li></ul>",
            "content_en": "<p>Plenary sessions will be held on May 25-26, 2026 with the participation of heads of state, ministers, heads of international organizations and other high-level officials.</p><h3>Main Topics</h3><ul><li>Results of the International Decade for Action \"Water for Sustainable Development\"</li><li>Contribution to achieving SDG 6 and other water-related goals</li><li>International cooperation and transboundary water management</li><li>Financing of water infrastructure and technologies</li></ul>",
            "content_tj": "<p>Ҷаласаҳои пленарӣ 25-26 майи соли 2026 бо иштироки сарони давлатҳо, вазирон, роҳбарони ташкилотҳои байналмилалӣ ва дигар шахсони баландмақом баргузор мешаванд.</p><h3>Мавзӯъҳои асосӣ</h3><ul><li>Натиҷаҳои Даҳсолаи байналмилалии амал \"Об барои рушди устувор\"</li><li>Саҳм дар ноил шудан ба ҲРУ 6 ва дигар ҳадафҳои марбут ба об</li><li>Ҳамкории байналмилалӣ ва идоракунии фаромарзии об</li><li>Маблағгузории зерсохти обӣ ва технологияҳо</li></ul>"
        },
        {
            "id": "events",
            "type": "text",
            "title_ru": "Мероприятия в рамках конференции",
            "title_en": "Conference Events",
            "title_tj": "Чорабиниҳо дар доираи конфронс",
            "content_ru": "<p>В рамках конференции состоятся различные мероприятия, включая тематические сессии, панельные дискуссии и специальные события.</p>",
            "content_en": "<p>The conference will feature various events, including thematic sessions, panel discussions and special events.</p>",
            "content_tj": "<p>Дар доираи конфронс чорабиниҳои гуногун, аз ҷумла сессияҳои мавзӯӣ, баҳсҳои панелӣ ва чорабиниҳои махсус баргузор мешаванд.</p>"
        },
        {
            "id": "forums",
            "type": "text",
            "background": "gray",
            "title_ru": "Форумы",
            "title_en": "Forums",
            "title_tj": "Форумҳо",
            "content_ru": "<p>В рамках конференции пройдет ряд тематических форумов:</p><div class=\"forums-grid\"><div class=\"forum-card\"><h3>Молодежный водный форум</h3><p>Вовлечение молодого поколения в решение водных проблем</p></div><div class=\"forum-card\"><h3>Бизнес-форум по воде</h3><p>Роль частного сектора в развитии водных технологий</p></div><div class=\"forum-card\"><h3>Научный форум</h3><p>Инновации и исследования в области водных ресурсов</p></div><div class=\"forum-card\"><h3>Форум НПО</h3><p>Роль гражданского общества в управлении водными ресурсами</p></div></div>",
            "content_en": "<p>The conference will feature a number of thematic forums:</p><div class=\"forums-grid\"><div class=\"forum-card\"><h3>Youth Water Forum</h3><p>Engaging the younger generation in solving water problems</p></div><div class=\"forum-card\"><h3>Water Business Forum</h3><p>The role of the private sector in developing water technologies</p></div><div class=\"forum-card\"><h3>Scientific Forum</h3><p>Innovations and research in the field of water resources</p></div><div class=\"forum-card\"><h3>NGO Forum</h3><p>The role of civil society in water resources management</p></div></div>",
            "content_tj": "<p>Дар доираи конфронс қатор форумҳои мавзӯӣ баргузор мешаванд:</p><div class=\"forums-grid\"><div class=\"forum-card\"><h3>Форуми обии ҷавонон</h3><p>Ҷалб кардани насли ҷавон ба ҳалли масъалаҳои обӣ</p></div><div class=\"forum-card\"><h3>Форуми тиҷоратии обӣ</h3><p>Нақши бахши хусусӣ дар рушди технологияҳои обӣ</p></div><div class=\"forum-card\"><h3>Форуми илмӣ</h3><p>Навоварӣ ва таҳқиқот дар соҳаи захираҳои обӣ</p></div><div class=\"forum-card\"><h3>Форуми ТҶМ</h3><p>Нақши ҷомеаи граждан дар идоракунии захираҳои обӣ</p></div></div>"
        }
    ]
}

# Check if program_page exists
cursor.execute('SELECT setting_key FROM site_settings WHERE setting_key = ?', ('program_page',))
exists = cursor.fetchone()

if exists:
    # Update existing record
    cursor.execute('UPDATE site_settings SET setting_value = ?, updated_at = datetime("now") WHERE setting_key = ?',
                   (json.dumps(program_page_data), 'program_page'))
    print("Updated existing program_page")
else:
    # Insert new record
    cursor.execute('INSERT INTO site_settings (setting_key, setting_value, updated_at) VALUES (?, ?, datetime("now"))',
                   ('program_page', json.dumps(program_page_data)))
    print("Inserted new program_page")

conn.commit()
conn.close()
print("Program page populated successfully with 4 sections!")
