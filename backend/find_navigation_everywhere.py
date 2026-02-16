import sqlite3
import json

# Connect to database
conn = sqlite3.connect('conference.db')
cursor = conn.cursor()

# Get ALL settings
cursor.execute("SELECT setting_key, setting_value FROM site_settings")
results = cursor.fetchall()

print("=" * 80)
print(f"SEARCHING ALL {len(results)} SETTINGS FOR NAVIGATION DATA")
print("=" * 80)

for key, value in results:
    if value and ('program' in value.lower() or 'navigation' in key.lower() or 'header' in key.lower()):
        print(f"\n{key}:")
        try:
            if value.startswith('{') or value.startswith('['):
                parsed = json.loads(value)
                # Check if it contains program navigation
                if isinstance(parsed, dict):
                    # Check for navigation in dict
                    if 'navigation' in parsed:
                        print("FOUND NAVIGATION IN DICT!")
                        print(json.dumps(parsed['navigation'], indent=2, ensure_ascii=False))
                elif isinstance(parsed, list):
                    # Check if it's a navigation array
                    for item in parsed:
                        if isinstance(item, dict) and item.get('id') == 'program':
                            print("FOUND PROGRAM MENU!")
                            print(json.dumps(item, indent=2, ensure_ascii=False))
        except:
            if 'program' in value.lower():
                print(f"Contains 'program': {value[:200]}...")

conn.close()
