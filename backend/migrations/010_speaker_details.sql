-- Add detailed speaker information columns
ALTER TABLE speakers ADD COLUMN bio_ru TEXT;
ALTER TABLE speakers ADD COLUMN bio_en TEXT;
ALTER TABLE speakers ADD COLUMN bio_tj TEXT;

ALTER TABLE speakers ADD COLUMN organization_ru TEXT;
ALTER TABLE speakers ADD COLUMN organization_en TEXT;
ALTER TABLE speakers ADD COLUMN organization_tj TEXT;

ALTER TABLE speakers ADD COLUMN country_ru TEXT;
ALTER TABLE speakers ADD COLUMN country_en TEXT;
ALTER TABLE speakers ADD COLUMN country_tj TEXT;

ALTER TABLE speakers ADD COLUMN email TEXT;

-- JSON arrays stored as TEXT
ALTER TABLE speakers ADD COLUMN expertise TEXT; -- JSON array of expertise areas
ALTER TABLE speakers ADD COLUMN achievements TEXT; -- JSON array of achievements
ALTER TABLE speakers ADD COLUMN publications TEXT; -- JSON array of publications

ALTER TABLE speakers ADD COLUMN session_title_ru TEXT;
ALTER TABLE speakers ADD COLUMN session_title_en TEXT;
ALTER TABLE speakers ADD COLUMN session_title_tj TEXT;

ALTER TABLE speakers ADD COLUMN session_time_ru TEXT;
ALTER TABLE speakers ADD COLUMN session_time_en TEXT;
ALTER TABLE speakers ADD COLUMN session_time_tj TEXT;

ALTER TABLE speakers ADD COLUMN session_description_ru TEXT;
ALTER TABLE speakers ADD COLUMN session_description_en TEXT;
ALTER TABLE speakers ADD COLUMN session_description_tj TEXT;

-- Add sample data for existing speakers
UPDATE speakers SET
    bio_ru = 'Президент Республики Таджикистан. Возглавляет страну с 1994 года, является одним из главных инициаторов Международного десятилетия действий «Вода для устойчивого развития, 2018-2028 годы». Активно участвует в международных водных инициативах.',
    bio_en = 'President of the Republic of Tajikistan. Has led the country since 1994 and is one of the main initiators of the International Decade for Action "Water for Sustainable Development, 2018-2028". Actively participates in international water initiatives.',
    bio_tj = 'Президенти Ҷумҳурии Тоҷикистон. Аз соли 1994 кишварро роҳбарӣ мекунад ва яке аз муваҷҷеҳони асосии Даҳсолаи байналмилалии амал "Об барои рушди устувор, 2018-2028" мебошад.',
    organization_ru = 'Правительство Республики Таджикистан',
    organization_en = 'Government of the Republic of Tajikistan',
    organization_tj = 'Ҳукумати Ҷумҳурии Тоҷикистон',
    country_ru = 'Таджикистан',
    country_en = 'Tajikistan',
    country_tj = 'Тоҷикистон',
    expertise = '["Водная дипломатия", "Устойчивое развитие", "Международное сотрудничество"]',
    achievements = '["Инициатор Международного десятилетия действий по воде", "Организатор четырех международных конференций высокого уровня по воде", "Лауреат премии ООН «Чемпион Земли»"]',
    session_title_ru = 'Открытие конференции и видение будущего водной повестки',
    session_title_en = 'Conference Opening and Vision for Water Agenda',
    session_title_tj = 'Кушодани конфронс ва дидгоҳ дар бораи дастури оби',
    session_time_ru = '25 мая 2026, 09:30',
    session_time_en = 'May 25, 2026, 09:30',
    session_time_tj = '25 май 2026, 09:30',
    session_description_ru = 'Приветственное слово и ключевое выступление об итогах Водного десятилетия и планах на будущее',
    session_description_en = 'Welcome address and keynote speech on the outcomes of the Water Decade and plans for the future',
    session_description_tj = 'Суханони хуш омадгӯӣ ва нутқи калидӣ дар бораи натиҷаҳои Даҳсолаи Об ва нақшаҳои оянда'
WHERE id = 1;
