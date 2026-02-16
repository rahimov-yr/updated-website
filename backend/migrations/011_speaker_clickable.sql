-- Add clickable column to speakers table
-- Controls whether clicking a speaker card opens the detail page
ALTER TABLE speakers ADD COLUMN clickable INTEGER NOT NULL DEFAULT 1;