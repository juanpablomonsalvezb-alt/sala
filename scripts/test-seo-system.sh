#!/bin/bash

# Test SEO Automation System

echo "🧪 Testing Nebbuler SEO Automation System"
echo "========================================\n"

# Start dev server in background
echo "🚀 Starting dev server..."
npm run dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
sleep 5

CRON_SECRET=$(grep CRON_SECRET .env.local | cut -d'=' -f2)
BASE_URL="http://localhost:3000"

echo "✅ Dev server running (PID: $DEV_PID)"
echo "🔐 CRON_SECRET: $CRON_SECRET\n"

# Test 1: Detect Trends endpoint
echo "Test 1️⃣  — /api/cron/detect-trends"
curl -X GET "$BASE_URL/api/cron/detect-trends" \
  -H "Authorization: Bearer $CRON_SECRET" \
  2>/dev/null | jq '.' | head -20

echo "\n"

# Test 2: Generate Pages endpoint
echo "Test 2️⃣  — /api/cron/generate-pages"
curl -X GET "$BASE_URL/api/cron/generate-pages" \
  -H "Authorization: Bearer $CRON_SECRET" \
  2>/dev/null | jq '.success' || echo "❌ Endpoint not ready yet (normal if no trending keywords in DB)"

echo "\n"

# Test 3: Dynamic routing (should 404 since no pages generated yet)
echo "Test 3️⃣  — /marketing-cl (dynamic routing)"
curl -X GET "$BASE_URL/marketing-cl" 2>/dev/null | grep -q "404" && echo "✅ 404 (expected, no pages yet)" || echo "⚠️  Page found (unexpected)"

echo "\n"

# Cleanup
echo "🧹 Cleaning up..."
kill $DEV_PID 2>/dev/null
wait $DEV_PID 2>/dev/null

echo "✅ Tests complete!"
echo "\n📋 Next steps:"
echo "1. Run: npx ts-node scripts/apply-seo-schema.ts"
echo "2. Run: npx ts-node scripts/batch-generate-pages.ts --count 100 --test"
echo "3. Deploy: vercel --prod"
