-- Initial database schema for Water Conference 2026

-- News table
CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_tj TEXT NOT NULL,
    excerpt_ru TEXT NOT NULL,
    excerpt_en TEXT NOT NULL,
    excerpt_tj TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_tj TEXT NOT NULL,
    image TEXT NOT NULL,
    published_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Program days table
CREATE TABLE IF NOT EXISTS program_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_number INTEGER UNIQUE NOT NULL,
    date TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_tj TEXT NOT NULL,
    short_title_ru TEXT NOT NULL,
    short_title_en TEXT NOT NULL,
    short_title_tj TEXT NOT NULL
);

-- Program events table
CREATE TABLE IF NOT EXISTS program_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    time_start TEXT NOT NULL,
    time_end TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_tj TEXT NOT NULL,
    description_ru TEXT,
    description_en TEXT,
    description_tj TEXT,
    location_ru TEXT NOT NULL,
    location_en TEXT NOT NULL,
    location_tj TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (day_id) REFERENCES program_days(id)
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    organization TEXT,
    position TEXT,
    country TEXT NOT NULL,
    participation_type TEXT NOT NULL,
    dietary_requirements TEXT,
    accessibility_needs TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_program_events_day_id ON program_events(day_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_uuid ON registrations(uuid);
