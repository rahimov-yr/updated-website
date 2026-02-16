-- Fix Tajik header title to have consistent line breaks like Russian and English
-- First insert if not exists, then update
INSERT OR IGNORE INTO site_settings (setting_key, setting_value) VALUES ('header_title_tj', '');

UPDATE site_settings
SET setting_value = 'КОНФРОНСИ 4-УМИ БАЙНАЛМИЛАЛИИ САТҲИ БАЛАНД
ОИД БА ДАҲСОЛАИ АМАЛ «ОБ БАРОИ
РУШДИ УСТУВОР»'
WHERE setting_key = 'header_title_tj';
