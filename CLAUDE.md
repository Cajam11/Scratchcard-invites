# Project description

A lightweight Next.js app that lets see their scratchcard-style invites. Teachers have to solve short puzzles (hidden words) to access their invite. The app uses Supabase for authentication and persistence, Tailwind CSS for styling, and small scripts for QR generation and utilities.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS
- Supabase

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Project Structure

- `app/` — Next.js App Router pages, layouts, and UI components (including `app/admin` and `app/invite`).
- `api/` — server route handlers and API endpoints used by the frontend (organized by feature: admin, teachers, verify, etc.).
- `lib/` — shared utilities and wrappers (`supabase.ts`, `auth.ts`, `admin-auth.ts`, `phrase.ts`).
- `db/` — SQL migrations and schema (e.g., `migrations/001_init.sql`).
- `public/` — static assets and client-servable files.
- `scripts/` — maintenance and generation scripts (QR code generation, etc.).
- `app/components/` — reusable React components and smaller UI pieces.

## Project Conventions & Patterns

- **Purpose:** Keep the app lightweight and focused — teachers create short, shareable scratchcard invites, generate QR codes, and track student attempts via Supabase.
- **Components:** Prefer server components by default. Mark components with `use client` only when they need browser APIs, state, or effects.
- **Styling:** Use Tailwind CSS for layout and utilities; keep custom CSS minimal and scoped in `app/globals.css` or component styles when necessary.
- **Icons:** Use `lucide-react` for icons instead of custom SVGs.
- **API & Data:** Place route handlers under `app/api` and centralize database access through `lib/supabase.ts` and helper modules in `lib/`.
- **Auth & Security:** Use `lib/auth.ts` and `lib/admin-auth.ts` for authentication checks. Keep secrets in `.env.local` and avoid committing them.
- **Build & Lint:** Run `npm run build` after changes to surface build-time issues; run `npm run lint` regularly.
- **UX & Design:** Favor simple, accessible interfaces with clear spacing; prefer progress feedback for network actions and graceful error handling.

## Design

- Take icons from lucide-react rather than creating your own vectors
- Keep design minimalistic with more emphasis on smooth spacing rather than boxes

## Notes

- Run `npm run build` after finishing implementation to avoid build errors
- Environment variables are in `.env.local`
