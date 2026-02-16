import sqlite3
import json

# Connect to database
conn = sqlite3.connect('conference.db')
cursor = conn.cursor()

# Get ALL settings that might contain navigation data
cursor.execute("SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE '%header%' OR setting_key LIKE '%navigation%'")
results = cursor.fetchall()

print("=" * 80)
print("ALL HEADER/NAVIGATION SETTINGS IN DATABASE:")
print("=" * 80)

for key, value in results:
    print(f"\nKey: {key}")
    if value and len(value) > 500:
        print(f"Value (first 500 chars): {value[:500]}...")
    else:
        print(f"Value: {value}")

# Specifically check header_navigation
cursor.execute("SELECT setting_value FROM site_settings WHERE setting_key = 'header_navigation'")
nav_result = cursor.fetchone()

if nav_result:
    print("\n" + "=" * 80)
    print("HEADER_NAVIGATION JSON (FULL):")
    print("=" * 80)
    navigation = json.loads(nav_result[0])
    print(json.dumps(navigation, indent=2, ensure_ascii=False))

    # Find program menu
    for item in navigation:
        if item.get('id') == 'program':
            print("\n" + "=" * 80)
            print("PROGRAM MENU SUBMENUS:")
            print("=" * 80)
            for submenu in item.get('submenus', []):
                print(f"ID: {submenu['id']}")
                print(f"Path: {submenu['path']}")
                print(f"Label (RU): {submenu.get('label_ru', 'N/A')}")
                print("-" * 40)

conn.close()
