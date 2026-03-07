#!/usr/bin/env python3
"""Add Resend DNS records to Cloudflare for 7app.online"""
import urllib.request, json, ssl

ZONE = "7ea575fad0de414129dad52c3f4e7f00"
EMAIL = "rations_volutes5n@icloud.com"
KEY = "1866af8488ae3894dae322c712ed107e3396b"
BASE = f"https://api.cloudflare.com/client/v4/zones/{ZONE}/dns_records"

DKIM = (
    "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8wGeSJWCTBqOo"
    "+1JdjpkK2hWQC/+/XqCg9DOOz3DuUYICVvxy7vh2KO3QSAMAvCFfarh0"
    "+sI3XwGn5cbf/2ogNPZEyjF0BLaH8cz5xfONCNwHUhn/fiKJM+1qUpWX"
    "tAgjnhSNSsHSsuVERUM1Us88ZtI8JbD0mVWM1QdE7NkwywIDAQAB"
)

records = [
    {"type": "TXT", "name": "resend._domainkey", "content": DKIM, "ttl": 1},
    {"type": "MX", "name": "send", "content": "feedback-smtp.us-east-1.amazonses.com", "priority": 10, "ttl": 1},
    {"type": "TXT", "name": "send", "content": "v=spf1 include:amazonses.com ~all", "ttl": 1},
]

labels = ["DKIM TXT", "MX", "SPF TXT"]
ctx = ssl.create_default_context()

for i, (rec, label) in enumerate(zip(records, labels), 1):
    data = json.dumps(rec).encode()
    req = urllib.request.Request(BASE, data=data, method="POST")
    req.add_header("X-Auth-Email", EMAIL)
    req.add_header("X-Auth-Key", KEY)
    req.add_header("Content-Type", "application/json")
    try:
        resp = urllib.request.urlopen(req, timeout=15, context=ctx)
        result = json.loads(resp.read())
        if result.get("success"):
            print(f"Record {i} ({label}): OK")
        else:
            errs = result.get("errors", [])
            msg = errs[0].get("message","?") if errs else "unknown"
            print(f"Record {i} ({label}): FAIL - {msg}")
    except urllib.error.HTTPError as e:
        body = json.loads(e.read())
        errs = body.get("errors", [])
        msg = errs[0].get("message","?") if errs else str(e)
        print(f"Record {i} ({label}): ERROR - {msg}")
    except Exception as e:
        print(f"Record {i} ({label}): ERROR - {e}")

# Now verify domain on Resend
print("\nVerifying domain on Resend...")
RESEND_KEY = "re_hfKThEA7_NFGJ9RqzkBp9jdZcpauAJ93t"
DOMAIN_ID = "b3f03362-6afc-4f9c-9e19-2d5258acd5f1"
vreq = urllib.request.Request(
    f"https://api.resend.com/domains/{DOMAIN_ID}/verify",
    data=b"{}",
    method="POST"
)
vreq.add_header("Authorization", f"Bearer {RESEND_KEY}")
vreq.add_header("Content-Type", "application/json")
try:
    vresp = urllib.request.urlopen(vreq, timeout=15, context=ctx)
    print(f"Resend verify: OK (status {vresp.status})")
except Exception as e:
    print(f"Resend verify: {e}")

print("\nDone!")
