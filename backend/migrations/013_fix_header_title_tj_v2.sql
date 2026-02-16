-- Fix Tajik header title to have 3 lines like Russian and English
UPDATE site_settings
SET setting_value = 'КОНФРОНСИ 4-УМИ БАЙНАЛМИЛАЛИИ САТҲИ БАЛАНД
ОИД БА ДАҲСОЛАИ АМАЛ «ОБ БАРОИ
РУШДИ УСТУВОР»'
WHERE setting_key = 'header_title_tj';
