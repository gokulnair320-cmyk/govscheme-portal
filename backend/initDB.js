const db = require('./db');

const schemas = [
`CREATE TABLE IF NOT EXISTS CITIZEN (
  citizenId INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  age INT,
  gender VARCHAR(10),
  address VARCHAR(200),
  income DECIMAL(10,2),
  caste VARCHAR(50),
  education VARCHAR(100)
);`,

`CREATE TABLE IF NOT EXISTS SCHEME (
  schemeId INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  age_upper INT,
  age_lower INT,
  income DECIMAL(10,2),
  caste VARCHAR(50),
  gender VARCHAR(10),
  required_document VARCHAR(100)
);`,

`CREATE TABLE IF NOT EXISTS DOCUMENT (
  document_id VARCHAR(10) PRIMARY KEY,
  citizen_id INT,
  document_type VARCHAR(100),
  document_number VARCHAR(50),
  verification_status VARCHAR(20),
  FOREIGN KEY (citizen_id) REFERENCES CITIZEN(citizenId)
);`,

`CREATE TABLE IF NOT EXISTS APPLICATION (
  appId INT PRIMARY KEY AUTO_INCREMENT,
  citizen_id VARCHAR(10),
  status VARCHAR(20),
  schemeId INT,
  FOREIGN KEY (schemeId) REFERENCES SCHEME(schemeId)
);`,

`CREATE TABLE IF NOT EXISTS ELIGIBILITY_LOG (
  log_id VARCHAR(10) PRIMARY KEY,
  application_id INT,
  eligibility_result VARCHAR(20),
  remarks VARCHAR(200),
  citizen_id INT,
  FOREIGN KEY (citizen_id) REFERENCES CITIZEN(citizenId)
);`,

`CREATE TABLE IF NOT EXISTS FRAUD (
  flagId INT PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(200),
  fraud_type VARCHAR(100)
);`,

`CREATE TABLE IF NOT EXISTS LOGIN_CREDENTIALS (
  login_id INT PRIMARY KEY AUTO_INCREMENT,
  citizen_id INT,
  username VARCHAR(50),
  password VARCHAR(100),
  last_login DATETIME,
  FOREIGN KEY (citizen_id) REFERENCES CITIZEN(citizenId)
);`,

`CREATE TABLE IF NOT EXISTS AUDIT_LOG (
  audit_id INT PRIMARY KEY AUTO_INCREMENT,
  citizen_id INT,
  action VARCHAR(100),
  action_date DATETIME DEFAULT NOW(),
  FOREIGN KEY (citizen_id) REFERENCES CITIZEN(citizenId)
);`,

`CREATE TABLE IF NOT EXISTS NOTIFICATION (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  citizen_id INT,
  message VARCHAR(200),
  notification_date DATETIME,
  status VARCHAR(20),
  FOREIGN KEY (citizen_id) REFERENCES CITIZEN(citizenId)
);`
];

const data = [
  // CITIZEN
  "INSERT IGNORE INTO CITIZEN VALUES (1,'Rahul',28,'Male','Delhi',250000,'OBC','graduate');",
  "INSERT IGNORE INTO CITIZEN VALUES (2,'Priya',35,'female','lucknow',180000,'SC','postgraduate');",
  "INSERT IGNORE INTO CITIZEN VALUES (3,'Amit',42,'male','patna',300000,'general','graduate');",
  "INSERT IGNORE INTO CITIZEN VALUES (4,'sunita',21,'female','jaipur',150000,'st','high school');",
  "INSERT IGNORE INTO CITIZEN VALUES (5,'arjun',25,'male','raigad',200000,'obc','graduate');",

  // SCHEME
  "INSERT IGNORE INTO SCHEME VALUES (1,'PM SCHOLARSHIP',30,18,300000,'ALL','ALL','income certificate');",
  "INSERT IGNORE INTO SCHEME VALUES (2,'WOMEN EMPOWERMENT SCHEME',45,21,500000,'ALL','FEMALE','address proof');",
  "INSERT IGNORE INTO SCHEME VALUES (3,'YOUTH STARTUP SCHEME',40,21,500000,'ALL','ALL','education certificate');",
  "INSERT IGNORE INTO SCHEME VALUES (4,'AGRI SUPPORT SCHEME',50,25,400000,'ALL','ALL','land document');",

  // DOCUMENT
  "INSERT IGNORE INTO DOCUMENT VALUES ('D001',1,'Income certificate','INC122','Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D002',2,'Caste certificate','C487','Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D003',3,'Address Proof','ADD23487','Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D004',4,'ID Proof','ID891','Pending');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D005',5,'Income Certificate','INC261','Pending');",

  // APPLICATION
  "INSERT IGNORE INTO APPLICATION VALUES (100,'C001','Approved',1);",
  "INSERT IGNORE INTO APPLICATION VALUES (101,'C002','Pending',2);",
  "INSERT IGNORE INTO APPLICATION VALUES (102,'C003','Rejected',3);",
  "INSERT IGNORE INTO APPLICATION VALUES (106,'C007','Approved',4);",
  "INSERT IGNORE INTO APPLICATION VALUES (107,'C008','Pending',5);",

  // ELIGIBILITY_LOG
  "INSERT IGNORE INTO ELIGIBILITY_LOG VALUES ('L001',1001,'Eligible','All criteria needed',1);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG VALUES ('L002',1002,'Non-Eligible','Invalid document',2);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG VALUES ('L003',1003,'Non-Eligible','Income exceeded',3);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG VALUES ('L004',1004,'Eligible','All criteria needed',4);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG VALUES ('L005',1005,'Non-Eligible','No documents',5);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG VALUES ('L006',1006,NULL,'All criteria needed',NULL);",

  // FRAUD
  "INSERT IGNORE INTO FRAUD VALUES (1000,'Income declared declared','Income Mismatch');",
  "INSERT IGNORE INTO FRAUD VALUES (1001,'same citizen applied twice','duplicate application');",
  "INSERT IGNORE INTO FRAUD VALUES (1002,'address proof mismatch','document mismatch');",

  // LOGIN_CREDENTIALS
  "INSERT IGNORE INTO LOGIN_CREDENTIALS VALUES (1,101,'anmol101','pass101','2026-03-30');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS VALUES (2,102,'anmol102','pass102','2026-03-27');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS VALUES (3,103,'anmol103','pass103','2026-03-30');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS VALUES (4,107,'anmol107','pass107','2026-03-31');",

  // AUDIT_LOG
  "INSERT IGNORE INTO AUDIT_LOG VALUES (1,101,'Login','2026-03-30');",
  "INSERT IGNORE INTO AUDIT_LOG VALUES (2,103,'Password Change','2026-03-30');",
  "INSERT IGNORE INTO AUDIT_LOG VALUES (3,106,'Logout','2026-03-30');",
  "INSERT IGNORE INTO AUDIT_LOG VALUES (4,105,'Login','2026-03-28');",

  // NOTIFICATION
  "INSERT IGNORE INTO NOTIFICATION VALUES (1,101,'Water supply update','2026-03-30','Unread');",
  "INSERT IGNORE INTO NOTIFICATION VALUES (3,103,'Road repair notice','2026-03-31','Unread');",
  "INSERT IGNORE INTO NOTIFICATION VALUES (4,104,'Tax reminder','2026-04-09','Pending');",
  "INSERT IGNORE INTO NOTIFICATION VALUES (8,108,'Tax Collection',NULL,'Unread');"
];

async function initializeDB() {
  try {
    for (const ddl of schemas) {
      await db.query(ddl);
      console.log('Executed:', ddl.slice(0, 50) + '...');
    }
    for (const dml of data) {
      try {
        await db.query(dml);
      } catch (err) {
        console.error('Failed on:', dml);
      }
    }
    console.log('Database Initialization Complete.');
    process.exit(0);
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
}

initializeDB();
