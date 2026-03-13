#!/usr/bin/env node
// Sprint 55: Download CineLove thumbnails for self-hosting
// Run: npx tsx scripts/download-thumbnails.mts

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { basename, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = "https://assets.cinelove.me/";
const DEST = resolve(__dirname, "../public/templates/");

mkdirSync(DEST, { recursive: true });

const code = readFileSync(resolve(__dirname, "../src/app/editor/new/page.tsx"), "utf8");
const re = /"(templates\/long_thumbnail\/[^"]+)"/g;
const paths: string[] = [];
let m: RegExpExecArray | null;
while ((m = re.exec(code)) !== null) paths.push(m[1]);

console.log(`Found ${paths.length} thumbnails to download to ${DEST}`);

let done = 0, skip = 0, fail = 0;
const promises = paths.map(async (p) => {
    const fn = basename(p);
    const dest = `${DEST}/${fn}`;
    if (existsSync(dest)) { skip++; return; }
    try {
        const res = await fetch(BASE + p);
        if (!res.ok) { fail++; console.log(`FAIL: ${fn} (${res.status})`); return; }
        const buf = Buffer.from(await res.arrayBuffer());
        writeFileSync(dest, buf);
        done++;
        if (done % 10 === 0) console.log(`  ... ${done} downloaded`);
    } catch (e: unknown) { fail++; console.log(`ERR: ${fn} — ${(e as Error).message}`); }
});

await Promise.all(promises);
console.log(`\n✅ Done: ${done} downloaded, ${skip} skipped, ${fail} failed`);
