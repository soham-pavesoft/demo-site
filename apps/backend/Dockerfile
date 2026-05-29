FROM node:20-slim

RUN npm i -g corepack@latest && corepack enable && corepack prepare pnpm@10.11.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/backend/package.json apps/backend/
COPY apps/storefront/package.json apps/storefront/

RUN pnpm install --frozen-lockfile

COPY . .

RUN cd apps/backend && pnpm run build

WORKDIR /app/apps/backend/.medusa/server

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
