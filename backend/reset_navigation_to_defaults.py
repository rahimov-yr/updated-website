import sqlite3
import json

# Connect to database
conn = sqlite3.connect('conference.db')
cursor = conn.cursor()

# Delete the header_navigation setting to force it to use defaults from Header.jsx
cursor.execute("DELETE FROM site_settings WHERE setting_key = 'header_navigation'")
deleted_rows = cursor.rowcount

conn.commit()
conn.close()

if deleted_rows > 0:
    print(f"OK Deleted header_navigation from database ({deleted_rows} row)")
    print("OK The app will now use default navigation from Header.jsx with proper routes")
    print("\nNow you need to:")
    print("1. Hard refresh your browser (Ctrl + Shift + R)")
    print("2. The navigation should work with proper routes like /program/structure")
else:
    print("OK No header_navigation in database - already using defaults from Header.jsx")
    print("\nIf you still see hash anchors, clear your browser cache completely:")
    print("1. Press Ctrl + Shift + Delete")
    print("2. Select 'Cached images and files'")
    print("3. Click 'Clear data'")
    print("4. Hard refresh (Ctrl + Shift + R)")
