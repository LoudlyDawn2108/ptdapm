# HRMS — Human Resource Management System

Monorepo for the HRMS project built with Bun, Turborepo, Elysia (backend), and React/Vite (frontend).

## Prerequisites

- [Bun](https://bun.sh) v1.3.5+
- [Docker](https://docs.docker.com/get-docker/) (for PostgreSQL)

## Getting Started

```bash
# 1. Install dependencies
bun install

# 2. Start PostgreSQL
docker compose up -d

# 3. Copy environment variables
cp .env.example .env
# Edit .env if needed — defaults work with the docker-compose setup

# 4. Push database schema & seed data
bun run --filter @hrms/backend db:push
bun run --filter @hrms/backend seed

# 5. Start all apps in dev mode
bun run dev
```

Backend runs at `http://localhost:3000`, frontend at `http://localhost:5173`.

## Project Structure

```
apps/
  backend/          @hrms/backend    — Elysia REST API
  frontend/         @hrms/frontend   — React + Vite SPA
packages/
  shared/           @hrms/shared     — Validators, types, constants (shared between apps)
  env/              @hrms/env        — Environment variable validation
docs/                                — Architecture docs, dev assignments, conventions
```

## Available Commands

### Root (runs across all workspaces via Turborepo)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in dev mode (hot reload) |
| `bun run build` | Build all apps and packages |
| `bun run type-check` | Run `tsc --noEmit` across all workspaces |
| `bun run lint` | Run Biome linter across all workspaces |

To target a specific workspace, use `--filter`:

```bash
bun run dev --filter @hrms/backend
bun run type-check --filter @hrms/frontend
```

### Backend (`apps/backend`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run build` | Build for production |
| `bun run type-check` | TypeScript type checking |
| `bun run lint` | Biome lint |
| `bun run test` | Run all tests |

**Database (Drizzle)**

| Command | Description |
|---------|-------------|
| `bun run db:push` | Push schema changes to database (dev) |
| `bun run db:generate` | Generate SQL migration files |
| `bun run db:migrate` | Run pending migrations |
| `bun run db:studio` | Open Drizzle Studio (database GUI) |

**Seed Data**

| Command | Description |
|---------|-------------|
| `bun run seed` | Seed roles + users |
| `bun run seed:roles` | Seed roles only |
| `bun run seed:users` | Seed users only |

Test accounts after seeding:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| tccb_user | tccb1234 | TCCB |
| tckt_user | tckt1234 | TCKT |
| employee_user | employee1234 | EMPLOYEE |

### Frontend (`apps/frontend`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Type check + production build |
| `bun run type-check` | TypeScript type checking |
| `bun run lint` | Biome lint |
| `bun run preview` | Preview production build locally |

### Docker

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start PostgreSQL |
| `docker compose down` | Stop PostgreSQL |
| `docker compose down -v` | Stop + delete database volume |

## Environment Variables

Copy `.env.example` to `.env` at the repo root. All backend scripts read from this file automatically.

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgres://user:password@localhost:5432/hrms` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | — | Secret for auth session signing (min 32 chars) |
| `BETTER_AUTH_URL` | `http://localhost:3000` | Backend URL for better-auth |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL for CORS |
| `PORT` | `3000` | Backend server port |

## Documentation

See `docs/` for detailed architecture and developer guides:

- `conventions.md` — Coding conventions, API response format, error handling, project structure
- `project-plan.md` — Phasing, git workflow, dependency graph
- `dev-{1..4}-*.md` — Per-developer module assignments and use case references
