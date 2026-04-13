const db = require('./db');

const data = [
  "INSERT IGNORE INTO LOGIN_CREDENTIALS VALUES (1,1,'anmol101','pass101','2026-03-30');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS VALUES (2,2,'anmol102','pass102','2026-03-27');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS VALUES (3,3,'anmol103','pass103','2026-03-30');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS VALUES (4,5,'anmol107','pass107','2026-03-31');",

  "INSERT IGNORE INTO AUDIT_LOG VALUES (1,1,'Login','2026-03-30');",
  "INSERT IGNORE INTO AUDIT_LOG VALUES (2,3,'Password Change','2026-03-30');",
  "INSERT IGNORE INTO AUDIT_LOG VALUES (3,4,'Logout','2026-03-30');",
  "INSERT IGNORE INTO AUDIT_LOG VALUES (4,5,'Login','2026-03-28');",

  "INSERT IGNORE INTO NOTIFICATION VALUES (1,1,'Water supply update','2026-03-30','Unread');",
  "INSERT IGNORE INTO NOTIFICATION VALUES (3,3,'Road repair notice','2026-03-31','Unread');",
  "INSERT IGNORE INTO NOTIFICATION VALUES (4,4,'Tax reminder','2026-04-09','Pending');",
  "INSERT IGNORE INTO NOTIFICATION VALUES (8,5,'Tax Collection',NULL,'Unread');"
];

async function fix() {
  for (let dml of data) {
    try {
      await db.query(dml);
      console.log('Success:', dml);
    } catch(e) {
      console.log('Failed:', dml, e.message);
    }
  }
  process.exit(0);
}

fix();
