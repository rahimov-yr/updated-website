import sqlite3
import sys

# Connect to the database
conn = sqlite3.connect('data/conference.db')
cursor = conn.cursor()

# Update speaker 1 with detailed information
update_sql = """
UPDATE speakers SET
    bio_ru = '<p>Президент Республики Таджикистан с 1994 года. Эмомали Рахмон является одним из ведущих международных лидеров в области водной дипломатии и устойчивого развития.</p><p>Под его руководством Таджикистан стал ключевым игроком в глобальных водных инициативах, включая инициирование Международного десятилетия действий «Вода для устойчивого развития, 2018-2028 годы».</p>',
    bio_en = '<p>President of the Republic of Tajikistan since 1994. Emomali Rahmon is one of the leading international figures in water diplomacy and sustainable development.</p><p>Under his leadership, Tajikistan has become a key player in global water initiatives, including initiating the International Decade for Action "Water for Sustainable Development, 2018-2028".</p>',
    bio_tj = '<p>Президенти Ҷумҳурии Тоҷикистон аз соли 1994. Эмомалӣ Раҳмон яке аз пешвоёни байналмилалии пешбар дар соҳаи дипломатияи обӣ ва рушди устувор мебошад.</p><p>Зери роҳбарии ӯ Тоҷикистон ба бозигари калидӣ дар ташаббусҳои ҷаҳонии обӣ табдил ёфт.</p>',
    organization_ru = 'Правительство Республики Таджикистан',
    organization_en = 'Government of the Republic of Tajikistan',
    organization_tj = 'Ҳукумати Ҷумҳурии Тоҷикистон',
    country_ru = 'Таджикистан',
    country_en = 'Tajikistan',
    country_tj = 'Тоҷикистон',
    email = 'president@gov.tj',
    expertise = '["Водная дипломатия", "Устойчивое развитие", "Международное сотрудничество", "Управление водными ресурсами"]',
    achievements = '["Инициатор Международного десятилетия действий «Вода для устойчивого развития, 2018-2028»", "Организатор четырех международных конференций высокого уровня по воде", "Лауреат премии ООН «Чемпион Земли» (2021)", "Почетный доктор более 20 международных университетов"]',
    publications = '["Таджики в зеркале истории (2010)", "Водная дипломатия и устойчивое развитие (2018)", "Вода — источник жизни и развития (2020)"]',
    session_title_ru = 'Открытие конференции: Итоги Водного десятилетия и перспективы',
    session_title_en = 'Conference Opening: Outcomes of the Water Decade and Prospects',
    session_title_tj = 'Кушодани конфронс: Натиҷаҳои Даҳсолаи Об ва чашмандозҳо',
    session_time_ru = '25 мая 2026, 09:30 - 10:00',
    session_time_en = 'May 25, 2026, 09:30 - 10:00',
    session_time_tj = '25 май 2026, 09:30 - 10:00',
    session_description_ru = 'Приветственное слово и ключевое выступление об итогах реализации Международного десятилетия действий «Вода для устойчивого развития, 2018-2028 годы» и планах дальнейшего международного сотрудничества в водном секторе.',
    session_description_en = 'Welcome address and keynote speech on the outcomes of the International Decade for Action "Water for Sustainable Development, 2018-2028" and plans for further international cooperation in the water sector.',
    session_description_tj = 'Суханони хуш омадгӯӣ ва нутқи калидӣ дар бораи натиҷаҳои татбиқи Даҳсолаи байналмилалии амал "Об барои рушди устувор, 2018-2028" ва нақшаҳои ҳамкории минбаъдаи байналмилалӣ дар бахши обӣ.'
WHERE id = 1
"""

try:
    cursor.execute(update_sql)
    conn.commit()
    print("Successfully updated speaker data!")
    print(f"Rows affected: {cursor.rowcount}")
except Exception as e:
    print(f"Error updating speaker data: {e}")
    sys.exit(1)
finally:
    conn.close()
