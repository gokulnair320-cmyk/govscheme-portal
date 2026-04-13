const db = require('./db');
async function check() {
  const tables = ['APPLICATION', 'AUDIT_LOG', 'CITIZEN', 'DOCUMENT', 'ELIGIBILITY_LOG', 'FRAUD', 'LOGIN_CREDENTIALS', 'NOTIFICATION', 'SCHEME'];
  for (let table of tables) {
    try {
      const [counts] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`${table}: ${counts[0].count}`);
    } catch (e) {
      console.error(`Failed ${table}: ${e.message}`);
    }
  }
  process.exit(0);
}
check();
