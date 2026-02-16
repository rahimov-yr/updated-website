-- Extended database schema for Water Conference 2026
-- Includes speakers, partners, navigation, countries, and translations

-- Speakers table
CREATE TABLE IF NOT EXISTS speakers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ru TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_tj TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_tj TEXT NOT NULL,
    image TEXT NOT NULL,
    flag_url TEXT,
    flag_alt_ru TEXT,
    flag_alt_en TEXT,
    flag_alt_tj TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    website TEXT,
    partner_type TEXT NOT NULL DEFAULT 'partner', -- organizer, partner, media
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Navigation items table
CREATE TABLE IF NOT EXISTS navigation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    label_ru TEXT NOT NULL,
    label_en TEXT NOT NULL,
    label_tj TEXT NOT NULL,
    path TEXT NOT NULL,
    nav_type TEXT NOT NULL DEFAULT 'header', -- header, footer_quick, footer_participants
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_register_btn INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES navigation_items(id)
);

-- Countries table for registration
CREATE TABLE IF NOT EXISTS countries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name_ru TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_tj TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Translations table for static content
CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    translation_key TEXT NOT NULL,
    language TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(translation_key, language)
);

-- Social links table
CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Site settings table for various configurations
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Excursions table
CREATE TABLE IF NOT EXISTS excursions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    category_ru TEXT NOT NULL,
    category_en TEXT NOT NULL,
    category_tj TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_tj TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_tj TEXT NOT NULL,
    duration_ru TEXT NOT NULL,
    duration_en TEXT NOT NULL,
    duration_tj TEXT NOT NULL,
    image TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Excursion highlights table
CREATE TABLE IF NOT EXISTS excursion_highlights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    excursion_id INTEGER NOT NULL,
    highlight_ru TEXT NOT NULL,
    highlight_en TEXT NOT NULL,
    highlight_tj TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (excursion_id) REFERENCES excursions(id)
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_tj TEXT NOT NULL,
    image TEXT,
    stars INTEGER NOT NULL DEFAULT 5,
    is_official INTEGER NOT NULL DEFAULT 0,
    amenities TEXT, -- JSON array of amenity keys
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_speakers_sort ON speakers(sort_order);
CREATE INDEX IF NOT EXISTS idx_partners_type ON partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_navigation_type ON navigation_items(nav_type);
CREATE INDEX IF NOT EXISTS idx_navigation_parent ON navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(translation_key);
CREATE INDEX IF NOT EXISTS idx_translations_lang ON translations(language);
