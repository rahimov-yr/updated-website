# Reset Navigation Menu

The old menu is stored in your database. To see the new menu, you need to either:

## Option 1: Via Admin Panel (Recommended)

1. Log into admin panel: `http://localhost:3000/admin`
2. Go to **Главная** → **Шапка сайта (Header)**
3. Click on **Навигация** tab
4. Click **"Сохранить настройки шапки"** button
5. Refresh your website

This will save the new default navigation to the database.

## Option 2: Delete Navigation Setting from Database

If you want to completely reset to code defaults:

### On your local machine:

```bash
# Stop the backend
# Delete the navigation setting from database directly

# For Windows (PowerShell):
cd backend/data
# Use a SQLite browser or command

# Or just delete the whole database and restart (will reset everything!):
rm backend/data/conference.db
cargo run
```

### On VPS (after deployment):

```bash
# SSH to your VPS
cd /opt/water-conference

# Option A: Reset just navigation via SQL
docker-compose exec app sh
# Then inside container:
# Use sqlite3 to delete: DELETE FROM settings WHERE setting_key = 'header_navigation';

# Option B: Reset entire database (CAREFUL - deletes all data!)
docker-compose down
rm vps-data/database/conference.db
docker-compose up -d
```

## Why This Happened

Your Header component loads navigation in this order:
1. **First**: Check database for saved navigation
2. **Second**: If no database navigation, use code defaults

Since you previously had navigation saved in the database, it's using the old version. Once you save the new version via admin panel or delete the old one, you'll see the updated menu!
