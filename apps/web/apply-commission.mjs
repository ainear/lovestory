/**
 * Apply Sprint 11 commission migration to production Supabase
 * Runs from apps/web directory where @supabase/supabase-js is installed.
 * 
 * Usage: node apply-commission.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const URL = "https://ujawiwotekelzgbxiauz.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY env var");
  process.exit(1);
}

const sb = createClient(URL, KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Check if referral_payouts already exists
const { error: checkErr } = await sb.from("referral_payouts").select("id").limit(0);
if (!checkErr) {
  console.log("✅ referral_payouts table ALREADY EXISTS in public schema");
  console.log("Commission migration was already applied. Nothing to do.");
  process.exit(0);
}

console.log("referral_payouts not found:", checkErr.message.slice(0, 80));

// Try calling the Supabase Management API SQL endpoint
const SQL = readFileSync(
  new URL("../../supabase/migrations/20260318_sprint11_commission.sql", import.meta.url),
  "utf8"
);

// Use the pg_catalog approach via fetch with service role
const endpoint = `${URL}/rest/v1/rpc/pg_execute`;
const resp = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${KEY}`,
    apikey: KEY,
  },
  body: JSON.stringify({ query: SQL }),
});

const body = await resp.text();
console.log(`pg_execute: ${resp.status}`, body.slice(0, 120));

if (resp.status === 404) {
  console.log("\n⚠️  Cannot apply SQL via supabase-js REST API (no exec_sql/pg_execute RPC).");
  console.log("\n📋 MANUAL STEPS to apply commission migration:");
  console.log("1. Go to: https://supabase.com/dashboard/project/ujawiwotekelzgbxiauz/sql");
  console.log("2. Paste and run the contents of:");
  console.log("   /Users/mini4/AAA/lovestory/supabase/migrations/20260318_sprint11_commission.sql");
  console.log("\nOR use supabase CLI after resetting migration history:");
  console.log("   supabase db reset --linked  (WARNING: resets all data!)");
}
