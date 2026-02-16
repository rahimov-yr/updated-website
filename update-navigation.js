// Quick script to reset navigation in database
// Run with: node update-navigation.js

const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'data', 'conference.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

// Delete the old navigation setting
db.run(`DELETE FROM site_settings WHERE setting_key = 'header_navigation'`, (err) => {
  if (err) {
    console.error('❌ Error deleting navigation:', err.message);
    db.close();
    process.exit(1);
  }

  console.log('✅ Successfully deleted old navigation from database');
  console.log('🎉 The new navigation from code will now be used!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Restart your backend server');
  console.log('2. Refresh your website');
  console.log('3. You should now see the updated menu!');

  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    }
    process.exit(0);
  });
});
