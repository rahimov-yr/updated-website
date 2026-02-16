import sqlite3
import sys

# Connect to the database
conn = sqlite3.connect('data/conference.db')
cursor = conn.cursor()

# First, let's find the speaker ID for Li Junhua
cursor.execute("SELECT id, name_ru FROM speakers WHERE name_ru LIKE '%Ли Цзюньхуа%' OR name_ru LIKE '%Цзюньхуа%'")
result = cursor.fetchone()

if not result:
    print("Speaker not found. Let me search more broadly...")
    cursor.execute("SELECT id, name_ru, name_en FROM speakers")
    all_speakers = cursor.fetchall()
    print("Available speakers:")
    for s in all_speakers:
        print(f"  ID {s[0]}: {s[1]} / {s[2]}")

    # Try to find by English name
    cursor.execute("SELECT id FROM speakers WHERE name_en LIKE '%Li Junhua%' OR name_en LIKE '%Junhua%'")
    result = cursor.fetchone()

    if not result:
        print("\nCould not find Li Junhua. Please check the speaker list.")
        conn.close()
        sys.exit(1)

speaker_id = result[0]
print(f"Found speaker ID: {speaker_id}")

# Update Li Junhua with detailed information
update_sql = """
UPDATE speakers SET
    bio_ru = '<p>Заместитель Генерального секретаря Организации Объединенных Наций по экономическим и социальным вопросам с 2021 года. Ли Цзюньхуа является ведущим экспертом в области устойчивого развития и международного экономического сотрудничества.</p><p>До своего назначения на нынешнюю должность занимал пост Генерального директора Организации Объединенных Наций по промышленному развитию (ЮНИДО). Имеет более 30 лет опыта работы в системе ООН и китайских правительственных учреждениях.</p><p>Играет ключевую роль в продвижении Целей устойчивого развития, особенно в области водных ресурсов, чистой энергии и промышленного развития.</p>',
    bio_en = '<p>United Nations Under-Secretary-General for Economic and Social Affairs since 2021. Li Junhua is a leading expert in sustainable development and international economic cooperation.</p><p>Before his current appointment, he served as Director General of the United Nations Industrial Development Organization (UNIDO). He has over 30 years of experience working in the UN system and Chinese government institutions.</p><p>He plays a key role in advancing the Sustainable Development Goals, particularly in the areas of water resources, clean energy, and industrial development.</p>',
    bio_tj = '<p>Муовини Котиби Кулли Созмони Милали Муттаҳид оид ба масоили иқтисодӣ ва иҷтимоӣ аз соли 2021. Ли Цзюньхуа як мутахассиси пешбар дар соҳаи рушди устувор ва ҳамкории байналмилалии иқтисодӣ мебошад.</p><p>Пеш аз таъинот ба вазифаи ҳозира, ӯ Директори Генералии Ташкилоти Милали Муттаҳид оид ба рушди саноатӣ (ЮНИДО) буд. Ӯ зиёда аз 30 сол таҷрибаи кор дар низоми СММ ва муассисаҳои давлатии Чин дорад.</p>',
    organization_ru = 'Организация Объединенных Наций',
    organization_en = 'United Nations',
    organization_tj = 'Созмони Милали Муттаҳид',
    country_ru = 'Китай',
    country_en = 'China',
    country_tj = 'Чин',
    email = 'li.junhua@un.org',
    expertise = '["Устойчивое развитие", "Международное экономическое сотрудничество", "Промышленное развитие", "Водные ресурсы", "Чистая энергия", "Цели устойчивого развития"]',
    achievements = '["Заместитель Генерального секретаря ООН по экономическим и социальным вопросам (с 2021)", "Генеральный директор ЮНИДО (2013-2021)", "Руководство крупнейшими инициативами ООН в области устойчивого развития", "Содействие в реализации Повестки дня в области устойчивого развития на период до 2030 года", "Координация международных усилий по достижению ЦУР 6 (чистая вода и санитария)"]',
    publications = '["Промышленное развитие для устойчивого будущего (UN-IDES, 2020)", "Водные ресурсы и устойчивое развитие: глобальные вызовы и решения (2019)", "Зеленая экономика и промышленная трансформация (UNIDO, 2018)", "Партнерство для устойчивого развития: роль ООН (2022)"]',
    session_title_ru = 'Роль ООН в достижении глобальных водных целей',
    session_title_en = 'The Role of the UN in Achieving Global Water Goals',
    session_title_tj = 'Нақши СММ дар ноил гардидан ба ҳадафҳои ҷаҳонии обӣ',
    session_time_ru = '25 мая 2026, 10:30 - 11:00',
    session_time_en = 'May 25, 2026, 10:30 - 11:00',
    session_time_tj = '25 май 2026, 10:30 - 11:00',
    session_description_ru = 'Выступление о роли Организации Объединенных Наций в координации международных усилий по достижению ЦУР 6 и обеспечению всеобщего доступа к чистой воде и санитарии. Обсуждение механизмов международного сотрудничества и финансирования водных проектов.',
    session_description_en = 'Speech on the role of the United Nations in coordinating international efforts to achieve SDG 6 and ensure universal access to clean water and sanitation. Discussion of mechanisms for international cooperation and financing of water projects.',
    session_description_tj = 'Суханронӣ дар бораи нақши Созмони Милали Муттаҳид дар ҳамоҳангсозии кӯшишҳои байналмилалӣ барои ноил гардидан ба ҲРУ 6 ва таъмини дастрасии умумӣ ба оби тоза ва коммуналӣ.'
WHERE id = ?
"""

try:
    cursor.execute(update_sql, (speaker_id,))
    conn.commit()
    print("Successfully updated Li Junhua speaker data!")
    print(f"Rows affected: {cursor.rowcount}")
except Exception as e:
    print(f"Error updating speaker data: {e}")
    sys.exit(1)
finally:
    conn.close()
