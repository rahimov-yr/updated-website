-- Add image_position and image_source columns to speakers table
ALTER TABLE speakers ADD COLUMN image_source TEXT DEFAULT 'url';
ALTER TABLE speakers ADD COLUMN image_position TEXT DEFAULT 'center center';
