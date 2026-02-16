import sqlite3
import json

# Connect to database
conn = sqlite3.connect('conference.db')
cursor = conn.cursor()

# Get ALL settings with 'nav' or 'header' in the key
cursor.execute("SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE '%nav%' OR setting_key LIKE '%header%'")
results = cursor.fetchall()

print("=" * 80)
print("ALL NAVIGATION/HEADER SETTINGS:")
print("=" * 80)

for key, value in results:
    print(f"\n{key}:")
    if value:
        try:
            parsed = json.loads(value)
            print(json.dumps(parsed, indent=2, ensure_ascii=False))
        except:
            print(value)
    else:
        print("(empty)")

conn.close()
