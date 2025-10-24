# Database Setup Guide

This guide will help you set up a database for the Hair Coaction project. You can use Firebase Firestore (recommended for this project), or any SQL database (MySQL, PostgreSQL, SQLite) using the provided schema.

---

## 1. Firebase Firestore Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In the project dashboard, click on **Firestore Database** and create a database (start in test mode for development).
3. Add a web app to your Firebase project and copy the config object.
4. Install Firebase SDK:
   ```bash
   npm install firebase
   ```
5. In your project, create a `firebase.js` file and initialize Firebase:
   ```js
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   const firebaseConfig = { /* your config here */ };
   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```
6. Use the provided API functions to read/write profile and dashboard data.

---

## 2. SQL Database Setup (Optional)

1. Install your preferred SQL database (MySQL, PostgreSQL, SQLite).
2. Use the provided `profile.sql` schema to create tables for user profiles.
3. Example (MySQL):
   ```bash
   mysql -u root -p < api/profile.sql
   ```
4. Connect your backend to the database using an ORM (e.g., Prisma, Sequelize) or raw SQL queries.

---

## 3. Environment Variables

- Store your database credentials and API keys in a `.env` file:
  ```env
  FIREBASE_API_KEY=your_key
  FIREBASE_PROJECT_ID=your_project_id
  DB_HOST=localhost
  DB_USER=root
  DB_PASS=yourpassword
  DB_NAME=haircoaction
  ```

---

## 4. Useful Links
- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Prisma ORM](https://www.prisma.io/docs)
- [Sequelize ORM](https://sequelize.org/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

If you need help with a specific database setup, check the official docs or ask for step-by-step instructions for your chosen database.
