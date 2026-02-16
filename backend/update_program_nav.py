import sqlite3
import json

# Connect to database
conn = sqlite3.connect('conference.db')
cursor = conn.cursor()

# Get current header settings
cursor.execute("SELECT setting_value FROM site_settings WHERE setting_key = 'header_settings'")
result = cursor.fetchone()

if result:
    header_settings = json.loads(result[0])

    # Update navigation to use proper paths instead of hash anchors
    if 'navigation' in header_settings:
        for item in header_settings['navigation']:
            if item.get('id') == 'program' and 'submenus' in item:
                for submenu in item['submenus']:
                    if submenu['id'] == 'program-structure':
                        submenu['path'] = '/program/structure'
                    elif submenu['id'] == 'plenary':
                        submenu['path'] = '/program/plenary'
                    elif submenu['id'] == 'conference-events':
                        submenu['path'] = '/program/events'
                    elif submenu['id'] == 'forums':
                        submenu['path'] = '/program/forums'

        # Update database
        cursor.execute(
            "UPDATE site_settings SET setting_value = ? WHERE setting_key = 'header_settings'",
            (json.dumps(header_settings),)
        )
        conn.commit()
        print("✓ Updated program navigation paths to use proper routes")
        print("\nNew paths:")
        for item in header_settings['navigation']:
            if item.get('id') == 'program':
                for submenu in item.get('submenus', []):
                    print(f"  - {submenu['label_ru']}: {submenu['path']}")
    else:
        print("No navigation found in header settings - will use default paths from code")
else:
    print("No header settings found - will use default paths from code")

conn.close()
