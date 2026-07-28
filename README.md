# 🚀 EaseYourNeeds Web

A powerful B2B SaaS web application designed to simplify and automate complex business needs. This platform integrates service management, secure payments, automated email delivery, and multi-tier user administration into a single, cohesive experience.

## ✨ Key Features
- **Secure Authentication & RBAC**: Powered by NextAuth v5 (Auth.js) with bcryptjs, supporting multi-tier Roles (Admin, Operator, User).
- **Payment Integration**: Seamless payment gateway integration via Xendit for service transactions.
- **Automated Emails**: Integrated with Resend for transactional email notifications.
- **Dynamic Dashboard**: Comprehensive data visualization for tracking business metrics and user activity.
- **Landing Pages & Loyalty Program**: Fully responsive public-facing pages, pricing structures, and loyalty point systems.

## 💻 Tech Stack
- **Framework**: Next.js (App Router), React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth v5
- **Database**: PostgreSQL (via Supabase)
- **External Services**: Xendit (Payments), Resend (Emails)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Project (PostgreSQL)
- Resend Account (Optional, for emails)
- Xendit Account (Optional, for payments)

### 1. Clone & Install
```bash
git clone https://github.com/prayersrain/easeyourneeds-web.git
cd easeyourneeds-web
npm install
```

### 2. Environment Setup
Copy the example environment file and add your credentials:
```bash
cp .env.example .env.local
```
*Note: Make sure to generate a strong `AUTH_SECRET` for NextAuth.*

### 3. Database Seeding
To initialize default users (admin, operator):
```bash
npx tsx scripts/add-user-passwords.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the application.

## 📝 License
This project is developed as part of a professional software engineering portfolio.