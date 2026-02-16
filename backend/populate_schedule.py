import sqlite3
import json

# Connect to database
conn = sqlite3.connect('conference.db')
cursor = conn.cursor()

# Complete schedule data with all languages
schedule_data = {
    "ru": [
        {
            "day": 1,
            "date": "25 мая 2026",
            "title": "День 1: Церемония открытия",
            "shortTitle": "Церемония открытия",
            "isOpen": True,
            "events": [
                {"time": "08:30 – 10:00", "title": "Регистрация участников", "description": "Выдача бейджей и материалов конференции", "location": "Фойе главного зала", "type": "registration"},
                {"time": "10:00 – 11:30", "title": "Торжественное открытие", "description": "Приветственные речи глав делегаций", "location": "Главный зал", "type": "ceremony"},
                {"time": "11:30 – 12:00", "title": "Кофе-брейк", "location": "Фойе", "type": "break"},
                {"time": "12:00 – 13:30", "title": "Пленарное заседание высокого уровня", "description": "Доклады министров и представителей международных организаций", "location": "Главный зал", "type": "plenary"},
                {"time": "13:30 – 15:00", "title": "Обед", "location": "Банкетный зал", "type": "break"},
                {"time": "15:00 – 17:00", "title": "Продолжение пленарного заседания", "description": "Тематические дискуссии и вопросы-ответы", "location": "Главный зал", "type": "plenary"}
            ]
        },
        {
            "day": 2,
            "date": "26 мая 2026",
            "title": "День 2: Тематические сессии",
            "shortTitle": "Тематические сессии",
            "isOpen": False,
            "events": [
                {"time": "09:00 – 10:30", "title": "Сессия: Управление водными ресурсами", "description": "Лучшие практики комплексного управления водными ресурсами", "location": "Зал A", "type": "session"},
                {"time": "10:30 – 11:00", "title": "Кофе-брейк", "location": "Фойе", "type": "break"},
                {"time": "11:00 – 12:30", "title": "Сессия: Изменение климата и адаптация", "description": "Региональные стратегии борьбы с изменением климата", "location": "Зал B", "type": "session"},
                {"time": "12:30 – 14:00", "title": "Обед", "location": "Банкетный зал", "type": "break"},
                {"time": "14:00 – 15:30", "title": "Сессия: Трансграничное сотрудничество", "description": "Успешный опыт межрегионального сотрудничества", "location": "Зал C", "type": "session"},
                {"time": "15:30 – 17:00", "title": "Сессия: Инновации и технологии", "description": "Новые технологии для устойчивого развития", "location": "Зал D", "type": "session"}
            ]
        },
        {
            "day": 3,
            "date": "27 мая 2026",
            "title": "День 3: Интерактивные диалоги",
            "shortTitle": "Интерактивные диалоги",
            "isOpen": False,
            "events": [
                {"time": "09:00 – 11:00", "title": "Многосторонний диалог", "description": "Открытое обсуждение со всеми участниками", "location": "Главный зал", "type": "session"},
                {"time": "11:00 – 11:30", "title": "Кофе-брейк", "location": "Фойе", "type": "break"},
                {"time": "11:30 – 13:00", "title": "Инновационные презентации", "description": "Демонстрация инновационных проектов и инициатив", "location": "Выставочный зал", "type": "session"},
                {"time": "13:00 – 14:30", "title": "Обед", "location": "Банкетный зал", "type": "break"},
                {"time": "14:30 – 17:00", "title": "Мероприятия партнеров", "description": "Специальные сессии от организаций-партнеров", "location": "Различные залы", "type": "session"}
            ]
        },
        {
            "day": 4,
            "date": "28 мая 2026",
            "title": "День 4: Церемония закрытия",
            "shortTitle": "Церемония закрытия",
            "isOpen": False,
            "events": [
                {"time": "09:00 – 11:00", "title": "Подготовка итоговых документов", "description": "Обсуждение и подготовка итоговой резолюции", "location": "Главный зал", "type": "session"},
                {"time": "11:00 – 11:30", "title": "Кофе-брейк", "location": "Фойе", "type": "break"},
                {"time": "11:30 – 13:00", "title": "Принятие документов", "description": "Официальное принятие итоговой резолюции и декларации", "location": "Главный зал", "type": "plenary"},
                {"time": "13:00 – 14:00", "title": "Церемония закрытия", "description": "Заключительные речи и благодарность участникам", "location": "Главный зал", "type": "ceremony"},
                {"time": "14:00 – 16:00", "title": "Торжественный обед", "description": "Обед с участием всех делегатов", "location": "Банкетный зал", "type": "ceremony"}
            ]
        }
    ],
    "en": [
        {
            "day": 1,
            "date": "May 25, 2026",
            "title": "Day 1: Opening Ceremony",
            "shortTitle": "Opening Ceremony",
            "isOpen": True,
            "events": [
                {"time": "08:30 – 10:00", "title": "Participant Registration", "description": "Badge and conference materials distribution", "location": "Main Hall Foyer", "type": "registration"},
                {"time": "10:00 – 11:30", "title": "Grand Opening", "description": "Welcome speeches from delegation heads", "location": "Main Hall", "type": "ceremony"},
                {"time": "11:30 – 12:00", "title": "Coffee Break", "location": "Foyer", "type": "break"},
                {"time": "12:00 – 13:30", "title": "High-Level Plenary Session", "description": "Reports from ministers and international organization representatives", "location": "Main Hall", "type": "plenary"},
                {"time": "13:30 – 15:00", "title": "Lunch", "location": "Banquet Hall", "type": "break"},
                {"time": "15:00 – 17:00", "title": "Plenary Session Continuation", "description": "Thematic discussions and Q&A", "location": "Main Hall", "type": "plenary"}
            ]
        },
        {
            "day": 2,
            "date": "May 26, 2026",
            "title": "Day 2: Thematic Sessions",
            "shortTitle": "Thematic Sessions",
            "isOpen": False,
            "events": [
                {"time": "09:00 – 10:30", "title": "Session: Water Resources Management", "description": "Best practices in integrated water resources management", "location": "Hall A", "type": "session"},
                {"time": "10:30 – 11:00", "title": "Coffee Break", "location": "Foyer", "type": "break"},
                {"time": "11:00 – 12:30", "title": "Session: Climate Change and Adaptation", "description": "Regional strategies for climate change mitigation", "location": "Hall B", "type": "session"},
                {"time": "12:30 – 14:00", "title": "Lunch", "location": "Banquet Hall", "type": "break"},
                {"time": "14:00 – 15:30", "title": "Session: Cross-Border Cooperation", "description": "Successful inter-regional cooperation experience", "location": "Hall C", "type": "session"},
                {"time": "15:30 – 17:00", "title": "Session: Innovation and Technology", "description": "New technologies for sustainable development", "location": "Hall D", "type": "session"}
            ]
        },
        {
            "day": 3,
            "date": "May 27, 2026",
            "title": "Day 3: Interactive Dialogues",
            "shortTitle": "Interactive Dialogues",
            "isOpen": False,
            "events": [
                {"time": "09:00 – 11:00", "title": "Multilateral Dialogue", "description": "Open discussion with all participants", "location": "Main Hall", "type": "session"},
                {"time": "11:00 – 11:30", "title": "Coffee Break", "location": "Foyer", "type": "break"},
                {"time": "11:30 – 13:00", "title": "Innovation Presentations", "description": "Showcase of innovative projects and initiatives", "location": "Exhibition Hall", "type": "session"},
                {"time": "13:00 – 14:30", "title": "Lunch", "location": "Banquet Hall", "type": "break"},
                {"time": "14:30 – 17:00", "title": "Partner Events", "description": "Special sessions by partner organizations", "location": "Various Halls", "type": "session"}
            ]
        },
        {
            "day": 4,
            "date": "May 28, 2026",
            "title": "Day 4: Closing Ceremony",
            "shortTitle": "Closing Ceremony",
            "isOpen": False,
            "events": [
                {"time": "09:00 – 11:00", "title": "Preparation of Final Documents", "description": "Discussion and preparation of final resolution", "location": "Main Hall", "type": "session"},
                {"time": "11:00 – 11:30", "title": "Coffee Break", "location": "Foyer", "type": "break"},
                {"time": "11:30 – 13:00", "title": "Adoption of Documents", "description": "Official adoption of final resolution and declaration", "location": "Main Hall", "type": "plenary"},
                {"time": "13:00 – 14:00", "title": "Closing Ceremony", "description": "Concluding remarks and thanks to participants", "location": "Main Hall", "type": "ceremony"},
                {"time": "14:00 – 16:00", "title": "Farewell Lunch", "description": "Lunch with all delegates", "location": "Banquet Hall", "type": "ceremony"}
            ]
        }
    ],
    "tj": [
        {
            "day": 1,
            "date": "25 майи 2026",
            "title": "Рӯзи 1: Маросими кушоиш",
            "shortTitle": "Маросими кушоиш",
            "isOpen": True,
            "events": [
                {"time": "08:30 – 10:00", "title": "Бақайдгирии иштироккунандагон", "description": "Додани беҷҳо ва маводҳои конфронс", "location": "Фойеи толори асосӣ", "type": "registration"},
                {"time": "10:00 – 11:30", "title": "Кушоиши тантанавӣ", "description": "Суханрониҳои хайрамақдамии сарони ҳайатҳо", "location": "Толори асосӣ", "type": "ceremony"},
                {"time": "11:30 – 12:00", "title": "Танаффуси қаҳва", "location": "Фойе", "type": "break"},
                {"time": "12:00 – 13:30", "title": "Ҷаласаи пленарии сатҳи баланд", "description": "Гузоришҳои вазирон ва намояндагони ташкилотҳои байналмилалӣ", "location": "Толори асосӣ", "type": "plenary"},
                {"time": "13:30 – 15:00", "title": "Хӯроки нисфирӯзӣ", "location": "Толори банкет", "type": "break"},
                {"time": "15:00 – 18:00", "title": "Ҷаласаи пленарӣ (идома)", "description": "Суханрониҳои ҳайатҳои кишварҳои иштироккунанда", "location": "Толори асосӣ", "type": "plenary"}
            ]
        },
        {
            "day": 2,
            "date": "26 майи 2026",
            "title": "Рӯзи 2: Сессияҳои мавзӯӣ",
            "shortTitle": "Сессияҳои мавзӯӣ",
            "isOpen": False,
            "events": [
                {"time": "09:00 – 10:30", "title": "Сессия: Идоракунии захираҳои обӣ", "description": "Беҳтарин таҷрибаҳо дар идоракунии ягонаи захираҳои обӣ", "location": "Толори A", "type": "session"},
                {"time": "10:30 – 11:00", "title": "Танаффуси қаҳва", "location": "Фойе", "type": "break"},
                {"time": "11:00 – 12:30", "title": "Сессия: Иқлим ва амнияти обӣ", "description": "Мутобиқшавӣ ба тағйирёбии иқлим дар соҳаи об", "location": "Толори B", "type": "session"},
                {"time": "12:30 – 14:00", "title": "Хӯроки нисфирӯзӣ", "location": "Толори банкет", "type": "break"},
                {"time": "14:00 – 15:30", "title": "Сессия: Ҳамкории марзгузар", "description": "Таҷрибаи идоракунии муштараки захираҳои обӣ", "location": "Толори A", "type": "session"},
                {"time": "15:30 – 17:00", "title": "Сессия: Навовариҳо дар соҳаи об", "description": "Ҳалҳои технологӣ барои истифодаи устувори об", "location": "Толори B", "type": "session"}
            ]
        },
        {
            "day": 3,
            "date": "27 майи 2026",
            "title": "Рӯзи 3: Гуфтугӯҳои интерактивӣ",
            "shortTitle": "Гуфтугӯҳои интерактивӣ",
            "isOpen": False,
            "events": [
                {"time": "09:00 – 11:00", "title": "Гуфтугӯи бисёрҷонибӣ", "description": "Муҳокимаи роҳҳои ноилшавӣ ба ҲРУ 6", "location": "Толори асосӣ", "type": "session"},
                {"time": "11:00 – 11:30", "title": "Танаффуси қаҳва", "location": "Фойе", "type": "break"},
                {"time": "11:30 – 13:00", "title": "Презентатсияҳои ҳалҳои навоварона", "description": "Намоиши технологияҳои пешқадам", "location": "Толори намоишгоҳ", "type": "session"},
                {"time": "13:00 – 14:30", "title": "Хӯроки нисфирӯзӣ", "location": "Толори банкет", "type": "break"},
                {"time": "14:30 – 17:00", "title": "Чорабиниҳои махсуси шарикон", "description": "Сессияҳои параллелии ташкилотҳои байналмилалӣ", "location": "Толорҳои A, B, C", "type": "session"}
            ]
        },
        {
            "day": 4,
            "date": "28 майи 2026",
            "title": "Рӯзи 4: Маросими хотима",
            "shortTitle": "Маросими хотима",
            "isOpen": False,
            "events": [
                {"time": "09:00 – 10:30", "title": "Тайёр кардани ҳуҷҷатҳои ниҳоӣ", "description": "Ниҳоӣ кардани эъломияи конфронс", "location": "Толори ҷаласа", "type": "session"},
                {"time": "10:30 – 11:00", "title": "Танаффуси қаҳва", "location": "Фойе", "type": "break"},
                {"time": "11:00 – 12:30", "title": "Қабули ҳуҷҷатҳои ниҳоӣ", "description": "Қабули расмии Эъломияи Душанбе", "location": "Толори асосӣ", "type": "plenary"},
                {"time": "12:30 – 13:30", "title": "Маросими тантанавии хотима", "description": "Ҷамъбаст ва хотимаи конфронс", "location": "Толори асосӣ", "type": "ceremony"},
                {"time": "13:30 – 15:00", "title": "Хӯроки тантанавӣ", "location": "Толори банкет", "type": "ceremony"}
            ]
        }
    ]
}

# Create table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
''')

# Check if schedule_data exists
cursor.execute('SELECT setting_key FROM site_settings WHERE setting_key = ?', ('schedule_data',))
exists = cursor.fetchone()

if exists:
    # Update existing record
    cursor.execute('UPDATE site_settings SET setting_value = ?, updated_at = datetime("now") WHERE setting_key = ?',
                   (json.dumps(schedule_data), 'schedule_data'))
    print("Updated existing schedule_data")
else:
    # Insert new record
    cursor.execute('INSERT INTO site_settings (setting_key, setting_value, updated_at) VALUES (?, ?, datetime("now"))',
                   ('schedule_data', json.dumps(schedule_data)))
    print("Inserted new schedule_data")

conn.commit()
conn.close()
print("Schedule data populated successfully for all languages (RU, EN, TJ) and all 4 days!")
