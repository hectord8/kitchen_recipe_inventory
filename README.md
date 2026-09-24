# Pantri — Kitchen Recipe & Inventory Manager

Pantri is a full-stack web app for browsing recipes, saving favorites, publishing your own, and tracking a personal kitchen inventory. It pairs a Spring Boot 4 REST API backed by PostgreSQL with a Next.js 16 App Router frontend.

**Live:** [www.hexhax.store](https://www.hexhax.store) (frontend) · [api.hexhax.store](https://api.hexhax.store) (API)

---

## Features

- Recipe library with **search**, **diet filters**, and per-user **favorites**
- Recipe cards that expand into full detail views (description, ingredients, instructions, prep/cook times)
- Publish your own recipes, including image upload
- Kitchen **inventory** tracking with quantity increment/decrement
- User accounts with **stateless JWT auth** (HttpOnly cookie, SameSite=None)
- **Spoonacular** integration for importing random recipes into the catalog
- Rate limiting on login, CORS + secure-cookie settings tuned for the deployed domains

## Tech stack

| Layer      | Technology                                                              |
| ---------- | ----------------------------------------------------------------------- |
| Backend    | Spring Boot 4.0.7, Java 21, Spring Security (stateless JWT), Spring JDBC |
| Data       | JDBI 3.45.1, PostgreSQL 17                                                |
| Frontend   | Next.js 16 (App Router), React 19, CSS Modules, Prettier + ESLint        |
| Auth       | JWT (JJWT 0.13 + Auth0 java-jwt) in an HttpOnly `token` cookie            |
| Infra      | Railway (backend + Postgres), Vercel/Next.js (frontend), GitHub Actions   |

## Repository layout

```
.
├── kitchen_backend/              # Spring Boot REST API
│   ├── src/main/java/...         # controllers, JDBI DAOs, security, Spoonacular client
│   ├── src/main/resources/
│   │   ├── application.properties # all config (env-driven, see below)
│   │   └── schema.sql             # applied on startup; treat as the schema source of truth
│   └── Dockerfile                 # multi-stage build (used by Rails and Docker Compose)
├── kitchen_management_frontend/  # Next.js 16 App Router frontend
│   ├── app/                      # routes: /, /login, /CreateAccount, /CreateRecipe, /Inventory, /admin
│   ├── Components/               # Recipes, CreateRecipe, Inventory, NavBar, auth context
│   └── Dockerfile                # multi-stage build
├── docker-compose.yml            # full local stack: Postgres + backend + frontend
└── .github/workflows/ci.yml      # backend + frontend checks on push/PR
```

## Quick start (Docker)

The compose file runs the whole stack. Only `JWT_SECRET` is required:

```bash
JWT_SECRET=some-long-random-string docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8080
- PostgreSQL: localhost:5432 (database `kitchen`, user/pass `kitchen` by default)

## Manual local dev (separate terminals)

**Backend** (Java 21, Gradle wrapper in `kitchen_backend/`):

```bash
cd kitchen_backend
# create kitchen_backend/.env (gitignored) with your DATABASE_URL/DB_USERNAME/DB_PASSWORD, JWT_SECRET
./gradlew bootRun
```

The backend auto-loads a local `.env` file via `springboot4-dotenv` (dev-only dependency), so no terminal exports are needed. **Frontend** (Node 22, see `.nvmrc`):

```bash
cd kitchen_management_frontend
npm ci
# create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev
```

### Configuration reference

The API reads its datasource via nested defaults so the same jar works locally, in Compose, and on Railway:

```properties
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://${PGHOST:localhost}:${PGPORT:5432}/${PGDATABASE:kitchen}}
spring.datasource.username=${DB_USERNAME:${PGUSER:kitchen}}
spring.datasource.password=${DB_PASSWORD:${PGPASSWORD:kitchen}}
```

| Variable                | Required | Purpose                                             |
| ----------------------- | -------- | --------------------------------------------------- |
| `JWT_SECRET`            | Yes      | Signs auth tokens (backend fails to start without)  |
| `DATABASE_URL`          | No*      | JDBC URL — preferred local/Compose source           |
| `PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD` | No* | Railway-supplied Postgres vars (production)       |
| `DB_USERNAME/DB_PASSWORD` | No*    | Alternate credential names                          |
| `APP_FRONTEND_URL`      | No       | Comma-separated CORS allowed origins               |
| `COOKIE_SECURE` / `COOKIE_DOMAIN` | No | Cookie flags (`false` locally for http)           |
| `SPOONACULAR_API_KEY`   | No       | Enables random-recipe import                        |
| `NEXT_PUBLIC_API_URL`   | —        | Frontend env: base URL of the API (`credentials: "include"`) |

Requests from the browser are always sent with `credentials: "include"`; keep CORS origins, `COOKIE_SECURE`, and `SameSite` settings aligned between the API and the deployed frontend domain.

> Note: `spring.sql.init.mode=always` applies `schema.sql` on startup, so schema changes are a runtime migration — backups before destructive edits are on you.

## API overview

Public: `GET /recipes`, `POST /auth/login`, `POST /Customers/register` (legacy spelling — keep it in sync with `SecurityConfig` if changing), `GET /health`, `/uploads/**`. Everything else — including `POST /recipes` and all saved-recipes/inventory calls — requires a JWT.

| Method   | Path                                        | Auth   | Description                          |
| -------- | ------------------------------------------- | ------ | ------------------------------------ |
| `POST`   | `/auth/login`                               | —      | Login, sets HttpOnly `token` cookie  |
| `POST`   | `/auth/logout`                              | —      | Clears the session cookie            |
| `GET`    | `/auth/me`                                  | ✓      | Current customer                     |
| `POST`   | `/Customers/register`                       | —      | Create an account                    |
| `GET`    | `/Customers/by-firstname/{firstName}`       | ✓      | Lookup by first name                 |
| `GET`    | `/recipes`                                  | —      | List all recipes (filters are client-side) |
| `POST`   | `/recipes`                                  | ✓      | Create a recipe                      |
| `POST`   | `/recipes/import?count=N`                   | ✓      | Import N (1–50) random Spoonacular recipes |
| `POST`   | `/recipes/upload`                           | ✓      | Upload a recipe image (multipart)    |
| `GET`/`POST`/`DELETE` | `/saved-recipes/{recipeId}`       | ✓      | Save / un-save a recipe              |
| `GET`    | `/saved-recipes/ids`                        | ✓      | All saved recipe ids for the user    |
| `GET`    | `/inventory`                                | ✓      | All inventory items                  |
| `POST`   | `/inventory/items`                          | ✓      | Add an item (client-supplied `customerId`) |
| `GET`    | `/inventory/items/{customerId}`             | ✓      | Items for one customer               |
| `PATCH`  | `/inventory/item/{id}/increase` / `/decrease` | ✓   | Bump or drop quantity (0 removes)    |
| `GET`    | `/health`                                   | —      | Liveness for the container healthcheck |

## Database schema

- **customers** — id, firstname, email (unique), password (bcrypt hash), role (`USER` default)
- **recipes** — Spoonacular and user-created recipes (title, image, summary, JSON-encoded ingredients/steps, times, calories, diet tags, category, creator)
- **customer_saved_recipes** — many-to-many favorites (cascades)
- **inventory** — per-customer items (item, description, image, quantity)
- **items** — reference list of item names

## Checks & CI

```bash
# Backend (kitchen_backend/)
./gradlew spotlessCheck   # google-java-format; also runs spotlessApply and may reformat files
./gradlew build           # compile + tests (tests use H2, SQL init disabled)

# Frontend (kitchen_management_frontend/)
npm run lint              # ESLint
npm run format:check      # Prettier (double quotes, semicolons, 100-col)
npm run build             # production build
```

`.github/workflows/ci.yml` runs these on every push to `main` and on PRs.

## Deployment

- **Backend** — Railway service built from `kitchen_backend/Dockerfile` with a linked Railway **Postgres 17**. Railway injects `PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD` (and `PORT`); the container healthcheck hits `/health`.
- **Frontend** — deployed from this repo (Vercel/Next.js); points `NEXT_PUBLIC_API_URL` at the API domain.
- Pushing to `main` triggers CI and both rebuilds automatically.

## Troubleshooting gotchas

- **Backend 502 / CORS errors** — the API doesn't start if the datasource resolves to `localhost:5432`. Ensure the env provides `DATABASE_URL` (or `PG*` on Railway) *and* a `JWT_SECRET`, then check runtime logs for `Started KitchenApplication`.
- **Uploads are local** — backend uploads to a relative `uploads/` dir (gitignored, non-persistent; not mounted on Railway by default).
- **Case-sensitive paths** — `/Customers/register` and `/auth` differ; update clients and `SecurityConfig` together when renaming routes.
- **Inventory expects ownership enforcement** — `customerId` is client-supplied; enforce ownership server-side before trusting it.