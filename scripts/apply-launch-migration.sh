#!/bin/bash
# Apply launch security migration via Supabase REST API (service role)
# Usage: bash scripts/apply-launch-migration.sh
set -euo pipefail

source apps/web/.env.local

SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
SERVICE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_KEY" ]; then
  echo "ERROR: Missing SUPABASE_URL or SERVICE_ROLE_KEY in apps/web/.env.local"
  exit 1
fi

echo "=== Supabase URL: ${SUPABASE_URL} ==="

# Helper function to run SQL via PostgREST RPC
run_sql() {
  local label="$1"
  local sql="$2"
  echo -n "  ${label}... "

  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
    "${SUPABASE_URL}/rest/v1/rpc/" \
    -H "apikey: ${SERVICE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"query\": $(python3 -c "import json; print(json.dumps('''${sql}'''))")}" 2>/dev/null)

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "204" ]; then
    echo "OK"
  else
    echo "HTTP ${HTTP_CODE}"
  fi
}

echo ""
echo "=== Step 1: Check if user_roles table exists ==="
CHECK=$(curl -s -o /dev/null -w "%{http_code}" \
  "${SUPABASE_URL}/rest/v1/user_roles?select=id&limit=1" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}")

if [ "$CHECK" = "200" ]; then
  echo "  user_roles table already exists — migration may have been partially applied."
  echo "  Skipping table creation, will verify other parts."
elif [ "$CHECK" = "404" ] || [ "$CHECK" = "406" ]; then
  echo "  user_roles table does not exist — migration needed."
else
  echo "  Check returned HTTP ${CHECK}"
fi

echo ""
echo "=== Step 2: Apply migration SQL ==="
echo "  Please paste the following SQL into Supabase Dashboard > SQL Editor:"
echo "  File: supabase/migrations/20260317_launch_security.sql"
echo ""
echo "  Opening Supabase SQL Editor..."
open "https://supabase.com/dashboard/project/ujawiwotekelzgbxiauz/sql/new" 2>/dev/null || true
echo ""
echo "  SQL content has been copied to clipboard."

# Copy SQL to clipboard
cat supabase/migrations/20260317_launch_security.sql | pbcopy
echo "  ✓ Copied! Just Cmd+V in SQL Editor and click 'Run'"

echo ""
echo "=== Step 3: After running migration, seed admin role ==="

# Get admin user ID
USER_ID=$(curl -s "${SUPABASE_URL}/auth/v1/admin/users" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    users = data.get('users', data) if isinstance(data, dict) else data
    for u in users:
        if u.get('email') == 'admin@7app.online':
            print(u['id'])
            break
except: pass
" 2>/dev/null)

if [ -z "$USER_ID" ]; then
  echo "  Admin user admin@7app.online not found yet."
  echo "  After migration, run this SQL to seed admin:"
  echo ""
  echo "    INSERT INTO user_roles (user_id, role)"
  echo "    SELECT id, 'admin' FROM auth.users WHERE email = 'admin@7app.online'"
  echo "    ON CONFLICT DO NOTHING;"
else
  echo "  Found admin user: ${USER_ID}"
  echo "  After migration completes, also run this SQL:"
  echo ""
  echo "    INSERT INTO user_roles (user_id, role)"
  echo "    VALUES ('${USER_ID}', 'admin')"
  echo "    ON CONFLICT DO NOTHING;"
  echo ""
  echo "  (Or it will be auto-inserted via PostgREST after user_roles table is created)"
fi

echo ""
echo "=== Instructions ==="
echo "1. SQL has been copied to clipboard (Cmd+V)"
echo "2. Supabase SQL Editor should be opening in browser"
echo "3. Paste and click 'Run'"
echo "4. Then paste the admin seed SQL and click 'Run'"
echo "5. Done!"
