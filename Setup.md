# Aether Recruitment System: Complete Project Execution Guide

A step-by-step implementation guide to configure, migrate, run, test, and deploy the Aether Recruitment System from scratch.

---

## Section 1: Project Requirements

Ensure your machine matches these specifications before booting:

- **Node.js**: `v20.x` or `v22.x` (LTS releases).
- **Package Manager**: `npm v10.x` or `pnpm v9.x` / `yarn v1.22`.
- **Database**: PostgreSQL `v15` or `v16` (such as Neon serverless PostgreSQL).
- **Identity Provider**: Clerk (Active account with organization workspace routing enabled).
- **Operating Systems**: macOS (Apple Silicon / Intel), Linux (Ubuntu 22.04 LTS), or Windows 11.
- **Next.js & React compiler**: Next.js `16.2.10` and React `19.0.0`.

---

## Section 2: Project Installation

Follow these steps to fetch the codebase:

### Step 1: Clone the repository
Clone the repository using Git:
```bash
git clone https://github.com/your-org/aether-workspace.git
```

### Step 2: Navigate to project directory
Switch to the folder:
```bash
cd aether-workspace
```

### Step 3: Install dependencies
Execute the node package install:
```bash
npm install
```
- **What happens internally**: npm reads `package.json`, pulls package packages (Next.js, Prisma, Clerk, Tailwind, Framer Motion, Recharts, Zod) into `node_modules`, and writes exact hash matching logs to `package-lock.json`.

---

## Section 3: Database Setup

Configure database structures using local or Neon PostgreSQL instances:

### 1. Create Database
Using PostgreSQL command line `psql` or PGAdmin, provision a clean database:
```sql
CREATE DATABASE aether_db;
```

### 2. Configure Database Connection String
Prepare your connection pool URL string.
- **Format**: `postgresql://[username]:[password]@[host]:[port]/[database_name]?sslmode=require`
- **Example**: `postgresql://postgres:localpassword@localhost:5432/aether_db?schema=public`

### 3. Apply Schema
Push the schemas declared inside [schema.prisma](file:///d:/projects/Infinitica%20Project/prisma/schema.prisma) directly into your database:
```bash
npx prisma db push
```
- **What happens**: Prisma maps models to SQL DDL scripts, creates tables, declares indexes, and generates the typescript database client structure.

### 4. Seed Data (Optional)
If seed scripts exist under `prisma/seed.ts`, populate default workspace roles:
```bash
npx prisma db seed
```

### 5. Verify Database Setup
Log into PostgreSQL CLI and query the tables list:
```bash
psql -d aether_db -c "\dt"
```
You should see:
- `User`, `Organization`, `Membership`, `Job`, `Candidate`, `Application`, `Interview`, `ActivityLog`, `Notification` tables created successfully.

---

## Section 4: Environment Variables Setup

Create a `.env` file in the project root:

```env
# Database Credentials
DATABASE_URL="postgresql://postgres:localpassword@localhost:5432/aether_db?schema=public"

# Clerk Identification keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_Y2xlcmsuYWV0aGVyLmFwcCQ"
CLERK_SECRET_KEY="sk_test_c2VjcmV0X2tleV9mb3JfYWV0aGVyX2FwcA"

# Clerk routing rules
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
```

### Purpose of Variables
- `DATABASE_URL`: Connection string for PostgreSQL queries.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk client SDK initialization key. Obtain from Clerk Dashboard > API Keys.
- `CLERK_SECRET_KEY`: Server SDK credentials validating tokens. Keep private.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` & `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: Maps auth routes.

---

## Section 5: Clerk Authentication Setup

1. **Sign Up**: Log into [Clerk.com](https://clerk.com) and create an account.
2. **Create Application**: Name your application (e.g. *Aether Recruiter*), select Email login credentials, and click Create.
3. **Organizations Enablement**: Enable Organization Management in Clerk Settings:
   - Go to Clerk Dashboard > Organizations > **Enable Organizations**. This enables multi-tenant recruiter memberships.
4. **Acquire API Keys**: Copy the Publishable and Secret Keys, pasting them directly into your `.env` file.

---

## Section 6: Prisma Setup

Maintain database structures using these CLI directives:

### 1. Prisma Generate
Compiles client schema typings:
```bash
npx prisma generate
```
- **Expected Output**: `Generated Prisma Client (v6.x.x) to ./node_modules/@prisma/client`.

### 2. Prisma Database Push
Pushes schema state changes to the DB:
```bash
npx prisma db push
```
- **Expected Output**: `Your database is now in sync with your Prisma schema`.

### 3. Open Prisma Studio (Database GUI)
Expose the database dashboard:
```bash
npx prisma studio
```
- **Expected Output**: Starts a local explorer server on [http://localhost:5555](http://localhost:5555) where you can manage records visually.

---

## Section 7: Running the Project

Start the local development server:
```bash
npm run dev
```

- **Internals**: Boots Next.js Dev Server using Turbopack compilers.
- **Console Log**:
  ```bash
  ▲ Next.js 16.2.10 (Turbopack)
  - Local: http://localhost:3000
  ```
- **Browser**: Go to [http://localhost:3000](http://localhost:3000) to view the application.

---

## Section 8: First Login Walkthrough

1. Go to `http://localhost:3000/`.
2. Click **Get Started** / **Launch Workspace** redirection.
3. Authenticate via the Clerk Sign-In portal.
4. If it is your first login, Clerk prompts you to **Create Organization**. Name it (e.g. *Acme Corp Recruitment*).
5. Clerk handles organization mapping, database Sync Action creates the local database User record, and you are redirected to `/overview`.

---

## Section 9: Feature Verification Checklist

| Target Feature | Test Action | PASS Criteria |
| :--- | :--- | :--- |
| **Authentication** | Click Log Out, then navigate to `/overview`. | Router blocks page, redirecting back to `/sign-in` portal. |
| **Dashboard** | View metrics counters. | Total candidates, jobs count, and schedule cards display metrics. |
| **Kanban Pipeline** | Drag a Candidate card from `Applied` to `Screening`. | Optimistic UI updates card position instantly; DB status syncs on drop. |
| **Interviews** | Open schedule dialogues, coordinate date/time slots. | Event grid renders appointment slot with interviewer panels. |

---

## Section 10: Troubleshooting Guide

### 1. Prisma Client Initialization Error
- **Problem**: `Prisma Client has not yet been generated`.
- **Cause**: Prisma schemas changed without compiling client types.
- **Solution**: Execute `npx prisma generate`.

### 2. Database Connection Failed
- **Problem**: `Can't reach database server at localhost:5432`.
- **Cause**: Database instance not running or connection credentials in `.env` are wrong.
- **Solution**: Verify Postgres server status and check database username/passwords.

### 3. Missing Clerk Key
- **Problem**: Clerk components crash on boot.
- **Cause**: `.env` keys missing or mislabeled.
- **Solution**: Copy keys from Clerk API dashboard and verify spelling in `.env`.

### 4. Port Already In Use
- **Problem**: `Port 3000 is already in use`.
- **Cause**: Another development server or node process is active on port 3000.
- **Solution**: Kill the process using port 3000:
  ```bash
  npx kill-port 3000
  ```

---

## Section 11: Production Build

Compile optimized production builds:
```bash
npm run build
```
- **Expected Output**:
  ```bash
  ✓ Compiled successfully in 4.4s
  Generating static pages (6/6) ...
  ```
- **Build Fails Check**: If compilation fails, check for missing variables, mismatched Zod types, or unhandled promise logic in API actions.

---

## Section 12: Local Production Testing

Verify production bundles locally before deploying:
```bash
npm run start
```
- Open [http://localhost:3000](http://localhost:3000).
- Confirm layout rendering speed, dark mode rendering transitions, and verifying that Server-Side rendering is fast.

---

## Section 13: Deployment Guide

### Vercel Deployment
1. Connect your repository to Vercel.
2. In Vercel Project Settings, declare these keys:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Configure the custom build command: `npx prisma generate && next build`.

### Docker Deployment
Create a `Dockerfile` in the project root:
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## Section 14: Validation Checklist

- [ ] Dependencies Installed (`npm install` succeeds)
- [ ] Environment Variables Configured (`.env` matches system parameters)
- [ ] Database Connected (PostgreSQL server running)
- [ ] Prisma Client Generated (`npx prisma generate` succeeds)
- [ ] Schema Pushed (`npx prisma db push` succeeds)
- [ ] Clerk Configured (App keys verified, Org settings active)
- [ ] Local Server Booted (`npm run dev` active on port 3000)
- [ ] User onboarding walkthrough completes successfully
- [ ] Production build succeeds (`npm run build` succeeds)
