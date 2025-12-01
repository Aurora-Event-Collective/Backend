# Aurora Event Collective — Backend

## Overview

This repository contains the backend for the Aurora Event Collective application.  
It provides APIs for the frontend (stored in the `frontendd` repo) to consume — handling things like user authentication, event creation/listing, data storage, etc.

### Tech Stack (suggested)  
- Server: Node.js + Express 
- Database: PostgreSQL  
- Environment: `.env` for secrets and config  
- ORM: Prisma
- Auth: Email OTP Authentication
- Emails: Resend
- Payments: Stripe Checkout + Webhooks
- Tickets: UUID + QR Code
- Verification: Staff-only endpoint to validate tickets
- Deploy: Vercel

---

## 📂 Project Structure 
```
backend/
│
├── src/ # main source files
│ ├── controllers/ # request handlers (business logic)
│ ├── routes/ # API endpoint definitions
│ ├── models/ # Database schema
│ ├── config/ # Configuration (DB connection, env variables)
│ ├── middleware/ # Middleware (auth, validation, error handling, logging)
│ ├── utils/
│ └── index.js (or app.js)
│
├── .env.example # sample environment variables
├── package.json # dependencies & scripts
├── README.md # this file
└── (optional) tests/ # automated tests
```
---

⚙️ Installation & Setup

1️⃣ Clone the repository
```
git clone <repo-url>
cd backend
```
2️⃣ Install dependencies
```
npm install
```
3️⃣ Configure environment variables

Duplicate the example env:
```
copy .env.example .env
```
5️⃣ Start development server
```
npm run dev
```
---
Thank you!
