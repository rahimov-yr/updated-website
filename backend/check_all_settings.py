import sqlite3
import json

# Connect to database
conn = sqlite3.connect('conference.db')
cursor = conn.cursor()

# Get ALL settings
cursor.execute("SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key")
results = cursor.fetchall()

print("=" * 80)
print(f"TOTAL SETTINGS IN DATABASE: {len(results)}")
print("=" * 80)

for key, value in results:
    print(f"\n{key}:")
    if key == 'header_navigation' and value:
        # Parse and pretty print JSON
        nav = json.loads(value)
        print(json.dumps(nav, indent=2, ensure_ascii=False))
    elif value and len(value) > 200:
        print(f"{value[:200]}...")
    else:
        print(value if value else "(empty)")

conn.close()
