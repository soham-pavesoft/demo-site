#!/bin/bash
set -e

echo "🚀 Demo Site Setup"
echo "==================="

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required. Install it first."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required. Install with: npm i -g pnpm"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required (v20+)."; exit 1; }

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# 1. Start Docker services
echo ""
echo "📦 Starting PostgreSQL & Redis..."
docker compose up -d
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker compose exec -T postgres pg_isready -U medusa >/dev/null 2>&1; do
  sleep 1
done
echo "✅ Database ready"

# 2. Install dependencies
echo ""
echo "📥 Installing dependencies..."
pnpm install --silent

# 3. Setup backend env
if [ ! -f apps/backend/.env ]; then
  cat > apps/backend/.env <<EOF
DATABASE_URL=postgres://medusa:medusa@localhost:5432/medusa
REDIS_URL=redis://localhost:6379
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:5173,http://localhost:9000
AUTH_CORS=http://localhost:5173,http://localhost:9000
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
EOF
  echo "✅ Backend .env created"
fi

# 4. Run migrations & seed
echo ""
echo "🗄️  Running database migrations & seed..."
cd apps/backend
npx medusa db:migrate 2>&1 | grep -E "(info|error|Finished)" | tail -5
echo "✅ Database migrated & seeded"

# 5. Create admin user
echo ""
echo "👤 Creating admin user..."
npx medusa user -e admin@demo.com -p demodemo 2>&1 | grep -q "User created" && echo "✅ Admin: admin@demo.com / demodemo" || echo "ℹ️  Admin user already exists (admin@demo.com / demodemo)"

# 6. Start backend, get token, seed products
echo ""
echo "🔧 Starting backend to seed products..."
npx medusa develop &
BACKEND_PID=$!
sleep 12

# Get auth token
TOKEN=$(curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"demodemo"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "⚠️  Could not get auth token. Backend may need more time. Run this script again."
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi

# Get sales channel
SC=$(curl -s http://localhost:9000/admin/sales-channels \
  -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; print(json.load(sys.stdin)['sales_channels'][0]['id'])")

# Get publishable key and link sales channel
PK_DATA=$(curl -s http://localhost:9000/admin/api-keys \
  -H "Authorization: Bearer $TOKEN" | python3 -c "
import sys,json
data = json.load(sys.stdin)
for k in data['api_keys']:
    if k['type'] == 'publishable':
        print(k['id'] + ' ' + k['token'])
        break
")
PK_ID=$(echo "$PK_DATA" | cut -d' ' -f1)
PK_TOKEN=$(echo "$PK_DATA" | cut -d' ' -f2)

# Link sales channel to publishable key
curl -s -X POST "http://localhost:9000/admin/api-keys/$PK_ID/sales-channels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"add\":[\"$SC\"]}" >/dev/null 2>&1

# Seed demo products are now handled by db:migrate seed script with category assignments
echo "✅ Products seeded via migration (with categories)"

# Stop the temporary backend
kill $BACKEND_PID 2>/dev/null
wait $BACKEND_PID 2>/dev/null
# Kill any remaining processes on port 9000
lsof -ti:9000 | xargs kill -9 2>/dev/null || true
sleep 2

# 7. Setup storefront env
cd "$ROOT_DIR"
if [ ! -f apps/storefront/.env ]; then
  cat > apps/storefront/.env <<EOF
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$PK_TOKEN
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_DEFAULT_REGION=dk
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NODE_ENV=development
EOF
  echo "✅ Storefront .env created with publishable key"
else
  # Update the key in existing env
  sed -i '' "s|NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$PK_TOKEN|" apps/storefront/.env
  echo "✅ Storefront .env updated with publishable key"
fi

# 8. Start everything
echo ""
echo "========================================="
echo "✅ Setup complete!"
echo ""
echo "  Admin:      http://localhost:9000/app"
echo "  Storefront: http://localhost:8000"
echo "  Login:      admin@demo.com / demodemo"
echo ""
echo "Starting both apps..."
echo "========================================="
echo ""
pnpm dev
