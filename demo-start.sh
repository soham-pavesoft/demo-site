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
npx medusa start &
BACKEND_PID=$!
sleep 8

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

# Seed demo products
echo "🛍️  Seeding demo products..."
products=(
  '{"title":"Vitamin D3 + K2","handle":"vitamin-d3-k2","description":"High-potency vitamin D3 with K2 for bone health and immune support.","status":"published","options":[{"title":"Size","values":["30 caps","60 caps"]}],"variants":[{"title":"30 Capsules","prices":[{"amount":2499,"currency_code":"eur"}],"options":{"Size":"30 caps"},"manage_inventory":false},{"title":"60 Capsules","prices":[{"amount":3999,"currency_code":"eur"}],"options":{"Size":"60 caps"},"manage_inventory":false}],"sales_channels":[{"id":"'"$SC"'"}]}'
  '{"title":"Collagen Peptides","handle":"collagen-peptides","description":"Marine collagen peptides for skin elasticity and joint health.","status":"published","options":[{"title":"Size","values":["200g","400g"]}],"variants":[{"title":"200g Powder","prices":[{"amount":3499,"currency_code":"eur"}],"options":{"Size":"200g"},"manage_inventory":false},{"title":"400g Powder","prices":[{"amount":5999,"currency_code":"eur"}],"options":{"Size":"400g"},"manage_inventory":false}],"sales_channels":[{"id":"'"$SC"'"}]}'
  '{"title":"Magnesium Glycinate","handle":"magnesium-glycinate","description":"Highly bioavailable magnesium for sleep and muscle recovery.","status":"published","options":[{"title":"Size","values":["60 caps","120 caps"]}],"variants":[{"title":"60 Capsules","prices":[{"amount":1999,"currency_code":"eur"}],"options":{"Size":"60 caps"},"manage_inventory":false},{"title":"120 Capsules","prices":[{"amount":3499,"currency_code":"eur"}],"options":{"Size":"120 caps"},"manage_inventory":false}],"sales_channels":[{"id":"'"$SC"'"}]}'
  '{"title":"Hyaluronic Acid Serum","handle":"hyaluronic-acid-serum","description":"Deep hydration serum for plump, glowing skin.","status":"published","options":[{"title":"Size","values":["30ml","50ml"]}],"variants":[{"title":"30ml","prices":[{"amount":2999,"currency_code":"eur"}],"options":{"Size":"30ml"},"manage_inventory":false},{"title":"50ml","prices":[{"amount":4499,"currency_code":"eur"}],"options":{"Size":"50ml"},"manage_inventory":false}],"sales_channels":[{"id":"'"$SC"'"}]}'
  '{"title":"Omega-3 Fish Oil","handle":"omega-3-fish-oil","description":"Ultra-pure omega-3 for heart and brain health.","status":"published","options":[{"title":"Size","values":["60 softgels","120 softgels"]}],"variants":[{"title":"60 Softgels","prices":[{"amount":2299,"currency_code":"eur"}],"options":{"Size":"60 softgels"},"manage_inventory":false},{"title":"120 Softgels","prices":[{"amount":3999,"currency_code":"eur"}],"options":{"Size":"120 softgels"},"manage_inventory":false}],"sales_channels":[{"id":"'"$SC"'"}]}'
  '{"title":"Retinol Night Cream","handle":"retinol-night-cream","description":"Advanced retinol for cell renewal and even skin tone.","status":"published","options":[{"title":"Size","values":["30ml","50ml"]}],"variants":[{"title":"30ml","prices":[{"amount":3999,"currency_code":"eur"}],"options":{"Size":"30ml"},"manage_inventory":false},{"title":"50ml","prices":[{"amount":5999,"currency_code":"eur"}],"options":{"Size":"50ml"},"manage_inventory":false}],"sales_channels":[{"id":"'"$SC"'"}]}'
)

for product in "${products[@]}"; do
  curl -s -X POST http://localhost:9000/admin/products \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$product" >/dev/null 2>&1
done
echo "✅ 6 demo products created"

# Stop the temporary backend
kill $BACKEND_PID 2>/dev/null
wait $BACKEND_PID 2>/dev/null

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
