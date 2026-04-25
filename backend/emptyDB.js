const db = require('./db');

const tables = [
  'NOTIFICATION',
  'AUDIT_LOG',
  'LOGIN_CREDENTIALS',
  'FRAUD',
  'ELIGIBILITY_LOG',
  'APPLICATION',
  'DOCUMENT',
  'SCHEME',
  'CITIZEN'
];

async function emptyDatabase() {
  try {
    console.log('Starting to empty database...');
    
    // Disable foreign key checks to allow truncating tables with dependencies
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    
    for (const table of tables) {
      await db.query(`TRUNCATE TABLE ${table}`);
      console.log(`Truncated table: ${table}`);
    }
    
    // Re-enable foreign key checks
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Database emptied successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error emptying database:', error);
    // Try to re-enable foreign key checks even if something failed
    await db.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => {});
    process.exit(1);
  }
}

emptyDatabase();
