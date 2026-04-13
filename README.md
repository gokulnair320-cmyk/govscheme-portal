# 🏛️ GovScheme Portal

A full-stack, centralized Government Scheme Eligibility & Fraud Detection System. This platform allows citizens to seamlessly check eligibility and apply for various government schemes, while giving Administrative Officers a secure portal to manage applications, track audit logs, and detect potentially fraudulent activities.

---

## 🌟 Key Features

### 👤 Citizen Access
* **Interactive Dashboard:** View real-time application statuses, uploaded documents, and profile data.
* **Intelligent Scheme Discovery:** Browse schemes and use the "Apply Now" function which instantly performs an eligibility algorithm logic-check against the user's age, caste, gender, and income.
* **Live Notifications System:** Receive automated updates about document verification and scheme rollouts.

### 🛡️ Officer / Admin Access
* **Application Management:** Review all incoming scheme applications, view instant algorithmic eligibility results, and manually `Approve` or `Reject` them.
* **Fraud Detection Panel:** Automatically flags duplicates or mismatched documentation metadata.
* **Security & Audit Trails:** Every sensitive action (logins, logouts, application tweaks) is securely recorded in the system audit logs.

---

## 🛠️ Tech Stack 

* **Frontend:** React + Vite + Tailwind CSS (v3) + Lucide Icons
* **Backend:** Node.js + Express + Express-Session
* **Database:** Remote MySQL (Railway) natively queried using `mysql2/promise`

---

## 🚀 Quick Start Guide

### 1. Requirements
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Environment Variables
In the `/backend` folder, create a `.env` file and insert your MySQL credentials:
```env
DB_HOST=your_host_address
DB_PORT=22736
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway
SESSION_SECRET=govscheme_secret_key_2024
PORT=5000
```

### 3. Initialize the Database
This repository comes with an automated initialization script. This will construct the 9 relational tables and inject demo data.
```bash
cd backend
npm install
node initDB.js
```

### 4. Start the Application Servers
You will need two terminal windows running concurrently.

**Terminal 1 (Backend Server):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Credentials

Navigate to the frontend at `http://localhost:5173/` and utilize these accounts to test the RBAC (Role-Based Access Control) structure:

**Test Citizen Account:**
* **Username:** `anmol101`
* **Password:** `pass101`

**Officer / Admin Account:**
* **Username:** `admin`
* **Password:** `admin123`
