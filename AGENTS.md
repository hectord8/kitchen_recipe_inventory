# Agent instructions

## Structure

- `kitchen_backend/` is a Spring Boot 4 REST API using Java 21, JDBI, and PostgreSQL; `kitchen_management_frontend/` is a Next.js 16 App Router app using React 19.
- Run commands from the relevant subdirectory, not the repository root. CI runs backend and frontend jobs independently.
- Backend startup applies `kitchen_backend/src/main/resources/schema.sql` to the configured database; treat edits there as schema changes.

## Commands

- Backend (`kitchen_backend/`): use `./gradlew`; run `./gradlew spotlessCheck`, `./gradlew build`, and `./gradlew test`. `spotlessCheck` depends on `spotlessApply` and may modify Java files.
- Frontend (`kitchen_management_frontend/`): use Node 22 from `.nvmrc`; run `npm ci`, then `npm run lint`, `npm run format:check`, and `npm run build`. There is no frontend test or typecheck script.
- Frontend Prettier settings are non-default: double quotes, semicolons, two-space indentation, ES5 trailing commas, and 100-column lines.
- Full local startup is `JWT_SECRET=... docker compose up --build`; Compose exposes PostgreSQL on 5432, the API on 8080, and the frontend on 3000.

## Runtime gotchas

- Backend configuration requires PostgreSQL variables (`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`) and `JWT_SECRET`; `APP_FRONTEND_URL`, cookie settings, and optional Spoonacular/OCR keys also affect runtime. Never commit real credentials.
- Auth is stateless JWT. Browser API calls use `NEXT_PUBLIC_API_URL` and `credentials: "include"`; keep CORS and `COOKIE_SECURE`/`COOKIE_DOMAIN`/`SameSite` settings aligned.
- API paths are case-sensitive and include the legacy `/Customers/register` spelling; update clients and `SecurityConfig` together when changing routes.
- Tests use H2 with SQL initialization disabled. Uploaded files go to a relative `uploads/` directory and are not persistent in the default container setup.
- `SecurityConfig` protects unmatched routes, so do not assume `/health` is public. Inventory requests include a client-supplied `customerId`; enforce ownership before relying on it.

## Frontend design direction

- For new or substantially changed UI, avoid generic “AI slop”: use editorial typography with a distinct point of view, never Inter, Roboto, Arial, or a default system sans-serif stack.
- Use one or two dominant brand colors with sharp accents and CSS variables; avoid dark purple/indigo gradients and timid, evenly distributed pastel palettes.
- Prefer asymmetric, magazine-style, bento, or strongly bordered compositions over centered hero blocks, uniform spacing, and standard three-card grids.
- Do not default to flat `#ffffff` or `#000000` canvases; use dimensional backgrounds such as subtle noise, grids, layered gradients, or contextual blurs.
- Motion should be purposeful: favor a coordinated page-load sequence and restrained staggered entry/hover transitions over animations on every control.
