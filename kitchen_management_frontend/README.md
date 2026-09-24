# Pantri — Frontend

Next.js 16 (App Router) + React 19 frontend for the Pantri kitchen recipe & inventory app.

See the [root README](../../README.md) for the full project (setup, env vars, API, deployment).

## Scripts

```bash
npm ci          # install dependencies (Node 22, see .nvmrc)
npm run dev     # local dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
npm run format  # Prettier --write .
npm run format:check  # Prettier --check .
```

## Local setup

Backend must be running (see root README). Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Pages

| Route          | Purpose                              |
| -------------- | ------------------------------------ |
| `/`            | Recipe library (search, filters, favorites) |
| `/login`       | Sign in                              |
| `/CreateAccount` | Register                            |
| `/CreateRecipe` | Publish a recipe                    |
| `/Inventory`   | Kitchen inventory                    |
| `/admin`       | Admin                                |