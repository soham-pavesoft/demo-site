# Demo Site

A demo e-commerce storefront built with **MedusaJS v2** + **Next.js 15**.

## Quick Start

One command to set everything up and run:

```bash
./demo-start.sh
```

This will:
1. Start PostgreSQL & Redis via Docker (Alpine images)
2. Install dependencies
3. Run database migrations & seed data
4. Create an admin user
5. Seed 6 demo products
6. Configure the publishable API key
7. Start both backend and storefront

## URLs

| Service | URL |
|---------|-----|
| Storefront | http://localhost:8000 |
| Admin Dashboard | http://localhost:9000/app |

**Admin login:** `admin@demo.com` / `demodemo`

## Prerequisites

- [Docker](https://www.docker.com/) (for PostgreSQL + Redis)
- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10+

## Manual Setup

If you prefer to run things step by step:

```bash
# Start databases
docker compose up -d

# Install deps
pnpm install

# Migrate & seed
cd apps/backend
npx medusa db:migrate
npx medusa user -e admin@demo.com -p demodemo

# Start backend
pnpm dev

# In another terminal - start storefront
cd apps/storefront
pnpm dev
```

## Tech Stack

- **Backend:** MedusaJS v2.15, PostgreSQL, Redis
- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Infra:** Docker Compose, Turborepo

## Project Structure

```
├── apps/
│   ├── backend/        # Medusa commerce engine (port 9000)
│   └── storefront/     # Next.js storefront (port 8000)
├── docker-compose.yml  # PostgreSQL + Redis (Alpine)
├── demo-start.sh       # One-click setup script
└── turbo.json          # Monorepo task runner
```

## Demo Products

The setup script creates these products:

| Product | Price |
|---------|-------|
| Vitamin D3 + K2 | €24.99 / €39.99 |
| Collagen Peptides | €34.99 / €59.99 |
| Magnesium Glycinate | €19.99 / €34.99 |
| Hyaluronic Acid Serum | €29.99 / €44.99 |
| Omega-3 Fish Oil | €22.99 / €39.99 |
| Retinol Night Cream | €39.99 / €59.99 |

## License

MIT
