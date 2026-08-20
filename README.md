# 🍅 Study With Me — Pomodoro Productivity App

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## 🌐 Live Demo

[👉 Visit the website](https://pomodoro-khaki-seven.vercel.app)

A cozy web app designed to help students stay focused and productive —
now with accounts and a daily streak system.

## 🌙 About

Study With Me is a student productivity website featuring a Pomodoro
timer, to-do list, and a relaxing lofi study atmosphere with animated
video backgrounds that change with each timer session.

Users can create an account, and every day they start a focus session
they earn a point — so the number tracks days actually studied, not
just visits.

## 📄 Pages

- 🏠 **Home** — Welcome page with video background
- ⏱️ **Timer** — Pomodoro timer with focus, short break, and long break modes
- ✅ **To-Do List** — Task manager to track your work
- 👤 **Auth** — Sign up and log in
- 📩 **Contact** — Get in touch

## 🛠️ Built With

**Frontend:** HTML5, CSS3, JavaScript
**Backend:** Node.js, Express, Prisma, PostgreSQL (Neon)
**Auth:** JWT in httpOnly cookies, bcrypt password hashing
**Deployed on:** Vercel (frontend) + Render (backend)

## ✨ Features

- Video background that changes with timer state
- Glass morphism UI design
- User accounts with secure authentication
- Daily point system — one point per day you study
- Protected API routes; users only access their own data
- Responsive layout

## 🔌 API

| Method | Route          | Auth | Description         |
| ------ | -------------- | ---- | ------------------- |
| POST   | `/auth/signup` | –    | Create an account   |
| POST   | `/auth/login`  | –    | Log in, sets cookie |
| POST   | `/auth/logout` | –    | Clear the cookie    |
| POST   | `/point/visit` | ✓    | Award today's point |
| GET    | `/point/show`  | ✓    | Get current points  |

## 🚀 Running Locally

**Backend**

## note

cd backend
npm install
npx prisma generate
npm run dev

> 🚧 This project is still in progress...
