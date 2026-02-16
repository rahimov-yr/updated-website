-- Reset Navigation Menu
-- This will delete the old navigation from the database
-- so the new default navigation from code will be used

DELETE FROM settings WHERE setting_key = 'header_navigation';
