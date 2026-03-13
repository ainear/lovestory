#!/bin/bash
# Supabase DB Backup Script for LoveStory
# Usage: ./scripts/backup-db.sh
# Requires: SUPABASE_URL and SUPABASE_SERVICE_KEY env vars (or .env.local)

set -euo pipefail

# Load .env.local if exists
ENV_FILE="$(dirname "$0")/../apps/web/.env.local"
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | grep -E '^(NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY)' | xargs)
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_KEY" ]; then
  echo "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  echo "   Set them in apps/web/.env.local or as env vars"
  exit 1
fi

BACKUP_DIR="$(dirname "$0")/../backups"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.json"

echo "📦 LoveStory DB Backup — $(date)"
echo "   URL: $SUPABASE_URL"
echo ""

TABLES=("projects" "rsvps" "wishes" "profiles" "likes" "views")
echo "{" > "$BACKUP_FILE"

for i in "${!TABLES[@]}"; do
  TABLE="${TABLES[$i]}"
  echo -n "   📋 Backing up '$TABLE'..."
  
  DATA=$(curl -s \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    "$SUPABASE_URL/rest/v1/$TABLE?select=*" 2>/dev/null || echo "[]")
  
  COUNT=$(echo "$DATA" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?")
  echo " $COUNT rows"
  
  COMMA=""
  if [ "$i" -lt $((${#TABLES[@]} - 1)) ]; then
    COMMA=","
  fi
  echo "  \"$TABLE\": $DATA$COMMA" >> "$BACKUP_FILE"
done

echo "}" >> "$BACKUP_FILE"

SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo ""
echo "✅ Backup saved: $BACKUP_FILE ($SIZE)"
echo "   To restore: Import JSON via Supabase Dashboard or API"
