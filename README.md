# Aether Recruitment Workspace

A premium, SaaS-grade Multi-Tenant Recruitment Dashboard and Applicant Tracking System (ATS). Engineered with Next.js 16, React 19, Tailwind CSS v4, Prisma, PostgreSQL, and Clerk.

---

## 🚀 Project Overview

Aether is a state-of-the-art applicant tracking workspace designed for modern HR managers and recruiters. It bridges candidates pipelines, live note collaborations, calendar booking matrices, and KPI analytics into a fast, responsive, and secure experience.

---

## ✨ Features

- **Dashboard KPIs**: Interactive metrics monitoring total candidates volume, active openings, interview schedules, and funnel conversion ratios.
- **Drag-and-Drop Kanban Board**: Optimized pipeline board supporting native HTML5 drag hooks and Framer Motion layout transitions for stage transitions.
- **Candidate CRM Details Drawer**: Double-slide over sheets displaying candidate portfolios, ratings, skills, and interactive live note streams.
- **Booking Calendar Grid**: Month matrix scheduling appointments, assigning interviewer panels, and generating meeting links.
- **Sourcing Analytics Panels**: High-fidelity charts showing channel conversions, department ratios, and time-to-hire speeds.
- **Global Command Palette**: Instant modal trigger (`Ctrl + K` or `Cmd + K`) conducting debounced queries across candidate and job listings.
- **Role-Based Settings Panels**: Workspace preferences panel managing user data, corporate details, plans billing, and generating API keys.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack compiler)
- **UI Runtime**: React 19
- **Design Accents**: Vanilla CSS + Tailwind CSS v4 + Framer Motion
- **Database ORM**: Prisma (PostgreSQL adapter client)
- **Identity Provider**: Clerk Authentication (Multi-tenant Organisation memberships)
- **Data Visualizations**: Recharts
- **Styling Tokens**: Geist Sans & Geist Mono families

---

## 📂 Folder Structure

```bash
├── prisma/
│   ├── schema.prisma              # Relational models definitions
│   └── seed.ts                    # Local mock database seeds
├── src/
│   ├── app/
│   │   ├── (auth)/                # Clerk authentication layouts
│   │   ├── (dashboard)/           # Protected workspace routes
│   │   ├── actions/               # Mutating Server Actions
│   │   ├── globals.css            # Custom CSS animations & custom scrollbars
│   │   └── layout.tsx             # Root template wrapper
│   ├── components/
│   │   └── dashboard/             # Workspace clients and form dialogues
│   ├── lib/
│   │   ├── validators/            # Zod validation schemas
│   │   ├── roles.ts               # RBAC validation logic
│   │   └── prisma.ts              # Global DB client singleton
```

---

## 🔑 Environment Variables

Create a `.env` file in the root folder:

```env
# Neon / Postgres Database URL (Connection Pool URL)
DATABASE_URL="postgresql://user:pass@ep-pool.neon.tech/db?sslmode=require"

# Clerk authentication tokens
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk routes mapping
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
```

---

## ⚙️ Installation & Setup

1. **Clone the project & install dependencies**:
   ```bash
   npm install
   ```

2. **Generate the Prisma client types**:
   ```bash
   npx prisma generate
   ```

3. **Synchronize database schema schemas**:
   ```bash
   npx prisma db push
   ```

4. **Boot the development workspace**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚀 Deployment (Vercel)

1. Connect your repository to Vercel.
2. In Vercel Project Settings, declare the required Environment Variables.
3. Deploy! Vercel will automatically compile the pages using [vercel.json](file:///d:/projects/Infinitica%20Project/vercel.json):
   ```json
   {
     "framework": "nextjs",
     "buildCommand": "npx prisma generate && next build"
   }
   ```

---

## 🖼️ Screenshots Placeholder

*Workspace Overview Dashboard Panel*
![Dashboard Overview Placeholder](public/screenshot-overview.png)

*Kanban Hiring Pipeline Stage Board*
![Hiring Pipeline Board Placeholder](public/screenshot-pipeline.png)

---

## 🔮 Future Improvements

- **AI Resume Screener**: Incorporate OCR scanners to parse pdf uploads and evaluate candidate matches automatically.
- **Real-Time Push Streams**: Transition from Page Visibility visibility polling to WebSockets or SSE for instant notification alerts.
- **SMS Reminders Integration**: Connect Twilio APIs to alert interviewers of upcoming schedules.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
