import sqlite3
import json

# Connect to database
conn = sqlite3.connect('conference.db')
cursor = conn.cursor()

# Get current header navigation
cursor.execute("SELECT setting_value FROM site_settings WHERE setting_key = 'header_navigation'")
result = cursor.fetchone()

if result:
    navigation = json.loads(result[0])

    # Track if we made any changes
    changed = False

    # Update navigation to use proper paths instead of hash anchors
    for item in navigation:
        if item.get('id') == 'program' and 'submenus' in item:
            for submenu in item['submenus']:
                old_path = submenu.get('path', '')

                # Fix hash-based paths
                if submenu['id'] == 'program-structure' and '#' in old_path:
                    submenu['path'] = '/program/structure'
                    changed = True
                elif submenu['id'] == 'plenary' and '#' in old_path:
                    submenu['path'] = '/program/plenary'
                    changed = True
                elif submenu['id'] == 'conference-events' and '#' in old_path:
                    submenu['path'] = '/program/events'
                    changed = True
                elif submenu['id'] == 'forums' and '#' in old_path:
                    submenu['path'] = '/program/forums'
                    changed = True

    if changed:
        # Update database
        cursor.execute(
            "UPDATE site_settings SET setting_value = ? WHERE setting_key = 'header_navigation'",
            (json.dumps(navigation),)
        )
        conn.commit()
        print("✓ Fixed program navigation paths in database")
        print("\nUpdated paths:")
        for item in navigation:
            if item.get('id') == 'program':
                for submenu in item.get('submenus', []):
                    print(f"  - {submenu.get('label_ru', submenu.get('id'))}: {submenu['path']}")
    else:
        print("✓ Navigation paths are already correct (no hash anchors found)")
        for item in navigation:
            if item.get('id') == 'program':
                print("\nCurrent paths:")
                for submenu in item.get('submenus', []):
                    print(f"  - {submenu.get('label_ru', submenu.get('id'))}: {submenu['path']}")
else:
    print("No header navigation found in database - using default paths from code")

conn.close()
