const db = require('./db');

const schemas = [
`CREATE TABLE IF NOT EXISTS CITIZEN (
    citizenId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address VARCHAR(150) NOT NULL,
    income DECIMAL(10,2) NOT NULL,
    caste VARCHAR(20) NOT NULL,
    education VARCHAR(50) NOT NULL
);`,

`CREATE TABLE IF NOT EXISTS SCHEME (
    schemeId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age_upper INT NOT NULL,
    age_lower INT NOT NULL,
    income DECIMAL(10,2) NOT NULL,
    caste VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    required_document VARCHAR(100) NOT NULL,
    benefit_amount DECIMAL(10,2) NOT NULL,
    department VARCHAR(100) NOT NULL
);`,

`CREATE TABLE IF NOT EXISTS DOCUMENT (
    document_id VARCHAR(20) PRIMARY KEY,
    citizen_id INT NOT NULL,
    document_type VARCHAR(60) NOT NULL,
    document_number VARCHAR(30) NOT NULL,
    verification_status VARCHAR(20) NOT NULL,
    FOREIGN KEY (citizen_id) REFERENCES CITIZEN(citizenId)
);`,

`CREATE TABLE IF NOT EXISTS APPLICATION (
    appId INT PRIMARY KEY AUTO_INCREMENT,
    citizen_id VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    schemeId INT NOT NULL,
    FOREIGN KEY (schemeId) REFERENCES SCHEME(schemeId)
);`,

`CREATE TABLE IF NOT EXISTS ELIGIBILITY_LOG (
    log_id VARCHAR(10) PRIMARY KEY,
    application_id INT NOT NULL,
    eligibility_result VARCHAR(20) NOT NULL,
    remarks VARCHAR(200),
    citizen_id INT,
    FOREIGN KEY (application_id) REFERENCES APPLICATION(appId)
);`,

`CREATE TABLE IF NOT EXISTS FRAUD (
    flagId INT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    fraud_type VARCHAR(60) NOT NULL
);`,

`CREATE TABLE IF NOT EXISTS LOGIN_CREDENTIALS (
    login_id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_id INT NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    last_login DATETIME,
    FOREIGN KEY (citizen_id) REFERENCES CITIZEN(citizenId)
);`,

`CREATE TABLE IF NOT EXISTS AUDIT_LOG (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_id INT NOT NULL,
    action VARCHAR(60) NOT NULL,
    action_date DATETIME NOT NULL,
    FOREIGN KEY (citizen_id) REFERENCES CITIZEN(citizenId)
);`,

`CREATE TABLE IF NOT EXISTS NOTIFICATION (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_id INT NOT NULL,
    message VARCHAR(300) NOT NULL,
    notification_date DATETIME,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (citizen_id) REFERENCES CITIZEN(citizenId)
);`,

`CREATE OR REPLACE VIEW vw_adult_citizens AS 
SELECT * FROM CITIZEN WHERE age >= 18;`,

`CREATE TRIGGER after_citizen_insert 
AFTER INSERT ON CITIZEN 
FOR EACH ROW 
INSERT INTO AUDIT_LOG (citizen_id, action, action_date) VALUES (NEW.citizenId, 'Registration Auto-Log Trigger', NOW());`
];

const data = [
  // CITIZEN
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (1, 'Rahul Sharma', 27, 'Male', 'New Delhi', 240000, 'OBC', 'graduate');",
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (2, 'Priya Verma', 34, 'Female', 'Lucknow', 185000, 'SC', 'postgraduate');",
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (3, 'Amit Patel', 41, 'Male', 'Patna', 310000, 'General', 'graduate');",
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (4, 'Sunita Meena', 22, 'Female', 'Jaipur', 145000, 'ST', 'high school');",
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (5, 'Arjun Nair', 26, 'Male', 'Raigad', 195000, 'OBC', 'graduate');",
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (6, 'Kavita Deshpande', 38, 'Female', 'Pune', 290000, 'General', 'postgraduate');",
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (7, 'Deepak Rawat', 29, 'Male', 'Dehradun', 175000, 'OBC', 'graduate');",
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (8, 'Asha Kumari', 24, 'Female', 'Patna', 130000, 'SC', 'high school');",
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (9, 'Vikram Chauhan', 33, 'Male', 'Agra', 190000, 'General', 'graduate');",
  "INSERT IGNORE INTO CITIZEN (citizenId, name, age, gender, address, income, caste, education) VALUES (10, 'Rekha Singh', 30, 'Female', 'Bhopal', 160000, 'OBC', 'graduate');",

  // SCHEME
  "INSERT IGNORE INTO SCHEME (schemeId, name, age_upper, age_lower, income, caste, gender, required_document, benefit_amount, department) VALUES (1, 'PM NATIONAL SCHOLARSHIP SCHEME', 25, 18, 250000, 'ALL', 'ALL', 'income certificate', 12000.00, 'Ministry of Education');",
  "INSERT IGNORE INTO SCHEME (schemeId, name, age_upper, age_lower, income, caste, gender, required_document, benefit_amount, department) VALUES (2, 'PRADHAN MANTRI MAHILA SHAKTI YOJANA', 45, 21, 400000, 'ALL', 'FEMALE', 'address proof', 36000.00, 'Ministry of Women and Child Development');",
  "INSERT IGNORE INTO SCHEME (schemeId, name, age_upper, age_lower, income, caste, gender, required_document, benefit_amount, department) VALUES (3, 'STARTUP INDIA SEED FUND SCHEME', 40, 21, 600000, 'ALL', 'ALL', 'education certificate', 200000.00, 'Department for Promotion of Industry and Internal Trade');",
  "INSERT IGNORE INTO SCHEME (schemeId, name, age_upper, age_lower, income, caste, gender, required_document, benefit_amount, department) VALUES (4, 'PM KISAN SAMMAN NIDHI', 65, 25, 200000, 'ALL', 'ALL', 'land document', 6000.00, 'Ministry of Agriculture and Farmers Welfare');",
  "INSERT IGNORE INTO SCHEME (schemeId, name, age_upper, age_lower, income, caste, gender, required_document, benefit_amount, department) VALUES (5, 'POST-MATRIC SCHOLARSHIP FOR SC/ST STUDENTS', 35, 18, 250000, 'SC/ST', 'ALL', 'caste certificate', 23000.00, 'Ministry of Social Justice and Empowerment');",
  "INSERT IGNORE INTO SCHEME (schemeId, name, age_upper, age_lower, income, caste, gender, required_document, benefit_amount, department) VALUES (6, 'PM AWAS YOJANA - URBAN (EWS)', 60, 21, 300000, 'ALL', 'ALL', 'address proof', 150000.00, 'Ministry of Housing and Urban Affairs');",

  // DOCUMENT
  "INSERT IGNORE INTO DOCUMENT VALUES ('D001', 1, 'Income Certificate', 'INC-DL-2024-0091', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D002', 2, 'Caste Certificate', 'CST-UP-2024-0142', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D003', 2, 'Address Proof', 'ADD-UP-2024-0143', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D004', 3, 'Income Certificate', 'INC-BR-2024-0204', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D005', 4, 'Caste Certificate', 'CST-RJ-2024-0055', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D006', 4, 'Income Certificate', 'INC-RJ-2024-0056', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D007', 5, 'Income Certificate', 'INC-MH-2024-0317', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D008', 6, 'Address Proof', 'ADD-MH-2024-0388', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D009', 6, 'Education Certificate', 'EDU-MH-2024-0389', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D010', 7, 'Income Certificate', 'INC-UK-2024-0421', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D011', 7, 'Address Proof', 'ADD-UK-2024-0422', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D012', 8, 'Caste Certificate', 'CST-BR-2024-0503', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D013', 8, 'Income Certificate', 'INC-BR-2024-0504', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D014', 9, 'Income Certificate', 'INC-UP-2024-0601F', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D015', 10, 'Income Certificate', 'INC-MP-2024-0712', 'Verified');",
  "INSERT IGNORE INTO DOCUMENT VALUES ('D016', 10, 'Address Proof', 'ADD-MP-2024-0713', 'Verified');",

  // APPLICATION
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1001, 'C001', 'Approved', 6);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1002, 'C002', 'Approved', 2);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1003, 'C002', 'Approved', 5);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1004, 'C003', 'Rejected', 4);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1005, 'C003', 'Rejected', 3);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1006, 'C004', 'Approved', 5);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1007, 'C004', 'Approved', 1);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1008, 'C005', 'Approved', 3);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1009, 'C006', 'Approved', 2);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1010, 'C006', 'Approved', 6);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1011, 'C007', 'Approved', 6);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1012, 'C008', 'Approved', 5);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1013, 'C008', 'Approved', 1);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1014, 'C009', 'Rejected', 6);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1015, 'C010', 'Approved', 6);",
  "INSERT IGNORE INTO APPLICATION (appId, citizen_id, status, schemeId) VALUES (1016, 'C010', 'Rejected', 6);",

  // ELIGIBILITY_LOG
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L001', 1001, 'Eligible', 'Age and income within PM Awas EWS limits', 1);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L002', 1002, 'Eligible', 'Female applicant, income within Mahila Shakti cap', 2);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L003', 1003, 'Eligible', 'SC caste certificate verified, income within SC/ST scheme cap', 2);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L004', 1004, 'Non-Eligible', 'Annual income 310000 exceeds PM Kisan cap of 200000', 3);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L005', 1005, 'Non-Eligible', 'Age 41 exceeds Startup India upper limit of 40', 3);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L006', 1006, 'Eligible', 'ST caste verified, income and age within SC/ST scheme limits', 4);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L007', 1007, 'Eligible', 'Age 22 and income 145000 within PM Scholarship criteria', 4);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L008', 1008, 'Eligible', 'Age 26, income 195000 within Startup India criteria', 5);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L009', 1009, 'Eligible', 'Female applicant, income 290000 within Mahila Shakti cap', 6);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L010', 1010, 'Eligible', 'Income 290000 within PM Awas EWS limit of 300000', 6);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L011', 1011, 'Eligible', 'Income 175000 within PM Awas EWS limit of 300000', 7);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L012', 1012, 'Eligible', 'SC caste verified, income and age within SC/ST scheme limits', 8);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L013', 1013, 'Eligible', 'Age 24 and income 130000 within PM Scholarship criteria', 8);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L014', 1014, 'Non-Eligible', 'Income mismatch: declared 190000, certificate shows 420000 — fraud flag raised', 9);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L015', 1015, 'Eligible', 'Income 160000 within PM Awas EWS limit of 300000', 10);",
  "INSERT IGNORE INTO ELIGIBILITY_LOG (log_id, application_id, eligibility_result, remarks, citizen_id) VALUES ('L016', 1016, 'Non-Eligible', 'Duplicate application: App 1015 already approved for scheme 6', 10);",

  // FRAUD
  "INSERT IGNORE INTO FRAUD (flagId, description, fraud_type) VALUES (1014, 'Citizen C009 declared annual income 190000 but submitted Income Certificate INC-UP-2024-0601F showing 420000. Mismatch of 230000.', 'Income Mismatch');",
  "INSERT IGNORE INTO FRAUD (flagId, description, fraud_type) VALUES (1016, 'Citizen C010 submitted Application 1016 for PM Awas Yojana (Scheme 6) despite Application 1015 for the same scheme already being approved on 2026-04-13.', 'Duplicate Application');",

  // LOGIN_CREDENTIALS
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (1, 1, 'rahul.sharma', 'pass123', '2026-04-10 09:15:00');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (2, 2, 'priya.verma', 'pass123', '2026-04-12 11:30:00');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (3, 3, 'amit.patel', 'pass123', '2026-04-06 10:00:00');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (4, 4, 'sunita.meena', 'pass123', '2026-04-08 14:00:00');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (5, 5, 'arjun.nair', 'pass123', '2026-04-15 10:45:00');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (6, 6, 'kavita.deshpande', 'pass123', '2026-04-14 16:20:00');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (7, 7, 'deepak.rawat', 'pass123', '2026-04-11 08:55:00');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (8, 8, 'asha.kumari', 'pass123', '2026-04-09 13:10:00');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (9, 9, 'vikram.chauhan', 'pass123', '2026-04-07 17:00:00');",
  "INSERT IGNORE INTO LOGIN_CREDENTIALS (login_id, citizen_id, username, password, last_login) VALUES (10, 10, 'rekha.singh', 'pass123', '2026-04-13 12:00:00');",

  // AUDIT_LOG
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (1, 1, 'Login', '2026-04-10 09:15:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (2, 1, 'Application Submit', '2026-04-10 09:22:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (3, 2, 'Login', '2026-04-12 11:30:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (4, 2, 'Document Upload', '2026-04-12 11:33:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (5, 2, 'Application Submit', '2026-04-12 11:38:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (6, 3, 'Login', '2026-04-06 10:00:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (7, 3, 'Application Submit', '2026-04-06 10:09:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (8, 4, 'Login', '2026-04-08 14:00:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (9, 4, 'Document Upload', '2026-04-08 14:08:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (10, 4, 'Application Submit', '2026-04-08 14:15:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (11, 5, 'Login', '2026-04-15 10:45:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (12, 5, 'Application Submit', '2026-04-15 10:52:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (13, 6, 'Login', '2026-04-14 16:20:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (14, 6, 'Application Submit', '2026-04-14 16:28:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (15, 7, 'Login', '2026-04-11 08:55:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (16, 7, 'Password Change', '2026-04-11 09:01:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (17, 7, 'Application Submit', '2026-04-11 09:05:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (18, 8, 'Login', '2026-04-09 13:10:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (19, 8, 'Document Upload', '2026-04-09 13:15:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (20, 8, 'Application Submit', '2026-04-09 13:20:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (21, 9, 'Login', '2026-04-07 17:00:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (22, 9, 'Document Upload', '2026-04-07 17:05:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (23, 9, 'Application Submit', '2026-04-07 17:10:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (24, 10, 'Login', '2026-04-13 12:00:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (25, 10, 'Application Submit', '2026-04-13 12:07:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (26, 10, 'Login', '2026-04-13 15:30:00');",
  "INSERT IGNORE INTO AUDIT_LOG (audit_id, citizen_id, action, action_date) VALUES (27, 10, 'Application Submit', '2026-04-13 15:36:00');",

  // NOTIFICATION
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (1, 1, 'Your application for PM Awas Yojana - Urban (EWS) has been approved. Benefit of Rs. 1,50,000 will be disbursed within 30 working days.', '2026-04-11 10:00:00', 'Unread');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (2, 2, 'Your application for Pradhan Mantri Mahila Shakti Yojana has been approved. You will be contacted for enrollment in the next 15 days.', '2026-04-13 09:00:00', 'Read');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (3, 2, 'Your application for Post-Matric Scholarship for SC/ST Students has been approved. Scholarship of Rs. 23,000 will be credited to your account.', '2026-04-13 09:05:00', 'Read');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (4, 3, 'Your application for PM Kisan Samman Nidhi was rejected. Annual income of Rs. 3,10,000 exceeds the scheme cap of Rs. 2,00,000.', '2026-04-07 10:00:00', 'Read');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (5, 3, 'Your application for Startup India Seed Fund was rejected. Applicant age 41 exceeds the upper age limit of 40 years for this scheme.', '2026-04-07 10:05:00', 'Unread');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (6, 4, 'Your application for Post-Matric Scholarship for SC/ST Students has been approved. Scholarship of Rs. 23,000 will be credited to your account.', '2026-04-09 11:00:00', 'Unread');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (7, 4, 'Your application for PM National Scholarship Scheme has been approved. Scholarship of Rs. 12,000 will be credited to your account.', '2026-04-09 11:05:00', 'Unread');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (8, 5, 'Your application for Startup India Seed Fund Scheme has been approved. Seed grant of Rs. 2,00,000 will be processed within 45 working days.', '2026-04-16 08:30:00', 'Unread');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (9, 6, 'Your application for Pradhan Mantri Mahila Shakti Yojana has been approved. You will be contacted for enrollment in the next 15 days.', '2026-04-15 14:00:00', 'Read');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (10, 6, 'Your application for PM Awas Yojana - Urban (EWS) has been approved. Benefit of Rs. 1,50,000 will be disbursed within 30 working days.', '2026-04-15 14:05:00', 'Unread');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (11, 7, 'Your application for PM Awas Yojana - Urban (EWS) has been approved. Benefit of Rs. 1,50,000 will be disbursed within 30 working days.', '2026-04-12 10:00:00', 'Unread');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (12, 8, 'Your application for Post-Matric Scholarship for SC/ST Students has been approved. Scholarship of Rs. 23,000 will be credited to your account.', '2026-04-10 12:00:00', 'Read');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (13, 8, 'Your application for PM National Scholarship Scheme has been approved. Scholarship of Rs. 12,000 will be credited to your account.', '2026-04-10 12:05:00', 'Read');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (14, 9, 'Your application (App ID: 1014) has been rejected. A discrepancy was detected between your declared income and submitted documents. Your account has been flagged. Please visit your nearest Common Service Centre with original documents.', '2026-04-08 09:00:00', 'Unread');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (15, 10, 'Your application for PM Awas Yojana - Urban (EWS) has been approved. Benefit of Rs. 1,50,000 will be disbursed within 30 working days.', '2026-04-13 13:00:00', 'Read');",
  "INSERT IGNORE INTO NOTIFICATION (notification_id, citizen_id, message, notification_date, status) VALUES (16, 10, 'Your second application (App ID: 1016) for PM Awas Yojana has been rejected. You have already been approved for this scheme under App ID 1015. Duplicate applications are not permitted.', '2026-04-14 10:00:00', 'Unread');"
];

async function initializeDB() {
  try {
    // Drop existing tables to ensure a clean slate with the new schema
    console.log('Dropping old tables...');
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    const tableNames = ['NOTIFICATION', 'AUDIT_LOG', 'LOGIN_CREDENTIALS', 'FRAUD', 'ELIGIBILITY_LOG', 'APPLICATION', 'DOCUMENT', 'SCHEME', 'CITIZEN'];
    for (const table of tableNames) {
      await db.query(`DROP TABLE IF EXISTS ${table}`);
    }
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Creating new schema...');
    for (const ddl of schemas) {
      await db.query(ddl);
      console.log('Executed:', ddl.split('\n')[0] + '...');
    }

    console.log('Seeding data...');
    for (const dml of data) {
      try {
        await db.query(dml);
      } catch (err) {
        console.error('Failed on:', dml, err.message);
      }
    }
    console.log('Database Initialization with NEW data complete.');
    process.exit(0);
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
}

initializeDB();
