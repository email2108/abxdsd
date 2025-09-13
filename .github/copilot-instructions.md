# 🧠 Copilot Instructions for GLXD Shop Codebase

This guide enables AI coding agents to work productively in the GLXD Shop monorepo, which contains multiple Next.js/TypeScript applications with real-time chat and admin features.

## 🏗️ Architecture Overview
- **Monorepo Structure**: Two main apps: `GLXD/` (scaffold, general app) and `lst/` (chat-focused app). Each has its own `src/`, `prisma/`, and config files.
- **Next.js 15**: Uses App Router (`src/app/`) for routing. Pages and API routes are organized by feature (e.g., `chat/`, `admin/`, `referral/`).
- **TypeScript**: Strict typing throughout. Use interfaces/types from `src/lib/` and `prisma/schema.prisma`.
- **Real-time Communication**: Socket.IO is used for chat features (`src/lib/socket.ts`).
- **Authentication**: NextAuth.js (GLXD) and JWT (lst) for user/admin login. See `src/components/auth/` and API routes.
- **Database**: Prisma ORM with SQLite (`db/custom.db`). Schema in `prisma/schema.prisma`. Seed scripts in `seed.ts` (lst) and migrations via `npm run db:push`.

## ⚡ Developer Workflows
- **Install**: `npm install` in each app folder.
- **Dev Server**: `npm run dev` (default port 3000).
- **Database**: `npm run db:push` (migrate), `npm run db:seed` (seed demo data).
- **Build**: `npm run build`.
- **Lint**: `npm run lint` (uses ESLint config).
- **Deploy**: Vercel button in README for instant deploy.

## 🧩 Project Conventions
- **Component Structure**: UI components in `src/components/ui/`, feature components in `src/components/{feature}/`.
- **Hooks**: Custom hooks in `src/hooks/` (e.g., `use-toast.ts`, `use-mobile.ts`).
- **API Routes**: Organized by feature in `src/app/api/{feature}/`.
- **Styling**: Tailwind CSS (`globals.css`, `tailwind.config.ts`).
- **State Management**: Zustand for global state, TanStack Query for data fetching.
- **Validation**: Zod schemas for form and API validation.
- **Internationalization**: Next Intl for i18n (GLXD only).

## 🔗 Integration Points
- **Socket.IO**: Client in `src/lib/socket.ts`, server in `server.ts`.
- **Prisma**: DB access via `src/lib/db.ts`.
- **NextAuth/JWT**: Auth logic in `src/components/auth/` and API routes.
- **Admin/User Roles**: Role checks in API and UI components. Demo accounts in README.

## 📝 Examples
- To add a chat feature: update `src/app/chat/`, use `src/lib/socket.ts`, and update Prisma schema.
- To add a new API route: create a file in `src/app/api/{feature}/` and export a handler.
- To add a UI component: place in `src/components/ui/` and use Tailwind for styling.

## 🚩 Key Files & Directories
- `src/app/` – Next.js pages, API routes
- `src/components/` – UI and feature components
- `src/lib/` – Shared utilities (db, socket, utils)
- `prisma/schema.prisma` – DB schema
- `server.ts` – Custom server logic
- `README.md` – Quickstart, demo accounts, deploy info

---
For unclear workflows or missing conventions, ask the user for clarification or examples from their recent work.
