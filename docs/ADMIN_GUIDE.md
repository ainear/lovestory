# 🛡️ LoveStory — Admin Guide & Configuration

> Hướng dẫn quản trị, đăng nhập admin, cấu hình tài khoản, và lưu ý quan trọng.

---

## 1. Admin Login

### Cách truy cập Admin Panel

| Thông tin | Giá trị |
|-----------|---------|
| **URL** | `https://7app.online/admin` (production) hoặc `http://localhost:3000/admin` (local) |
| **Phương thức đăng nhập** | Supabase Authentication (Google OAuth / Email) |
| **Admin email** | `admin@7app.online` (hoặc giá trị của `ADMIN_EMAIL` trong `.env.local`) |

### Luồng đăng nhập

```
1. Truy cập /admin
2. Nếu chưa đăng nhập → redirect về /dashboard → redirect về /auth
3. Đăng nhập bằng Google hoặc Email
4. Nếu email KHÔNG phải admin → redirect về /dashboard (không có quyền)
5. Nếu email ĐÚNG admin → hiện Admin Panel
```

### ⚠️ Lưu ý quan trọng

> **Admin access dựa trên email comparison** — chỉ cần thay đổi `ADMIN_EMAIL` 
> trong `.env.local` (hoặc Vercel Environment Variables) để đổi admin.
> Code guard nằm tại: `apps/web/src/app/admin/layout.tsx` (line 5 & 18)

---

## 2. Admin Panel Features

| Page | URL | Chức năng |
|------|-----|-----------|
| **Dashboard** | `/admin` | Tổng quan: users, orders, revenue, projects, subscribers |
| **Đơn hàng** | `/admin/orders` | Danh sách 50 đơn mới nhất, tổng doanh thu, trạng thái |
| **Users** | `/admin/users` | 50 users, subscription plan, project count, provider |
| **Thiệp** | `/admin/projects` | Tất cả projects, views, status, template |

---

## 3. Environment Variables

### Bắt buộc (`apps/web/.env.local`)

```bash
# ── Supabase ──
NEXT_PUBLIC_SUPABASE_URL=https://ujawiwotekelzgbxiauz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# ── Database ──
DATABASE_URL=postgresql://postgres.ujawiwotekelzgbxiauz:<password>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# ── Cloudflare R2 ──
R2_BUCKET=akala
R2_ENDPOINT=https://e7eb76be9606c762e0b3ec91ae619424.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-e7eb76be9606c762e0b3ec91ae619424.r2.dev
R2_ACCESS_KEY_ID=<your-r2-access-key>
R2_SECRET_ACCESS_KEY=<your-r2-secret-key>

# ── App ──
NEXT_PUBLIC_APP_URL=https://7app.online  # production
ADMIN_EMAIL=admin@7app.online

# ── SePay Payment Gateway ──
SEPAY_API_KEY=<your-sepay-key>
```

### Vercel Environment Variables

Tất cả biến trên cần được **copy vào Vercel Dashboard**:
1. Vercel → Project Settings → Environment Variables
2. Add từng biến với giá trị tương ứng
3. Redeploy sau khi thêm

---

## 4. Authentication Setup (Supabase)

### Google OAuth

1. Supabase Dashboard → Authentication → Providers → Google
2. Enable Google provider
3. Thêm Client ID + Client Secret từ Google Cloud Console
4. Redirect URL: `https://ujawiwotekelzgbxiauz.supabase.co/auth/v1/callback`

### Email/Password

- Mặc định enabled trong Supabase
- Email confirmation: tùy chọn trong Supabase → Auth → Settings

### Auth Callback

- Supabase auth callback xử lý tại: `apps/web/src/app/auth/callback/`
- Sign out tại: `apps/web/src/app/auth/signout/`

---

## 5. Security Configuration

### Middleware Headers (Tự động áp dụng)

| Header | Value | Mục đích |
|--------|-------|----------|
| X-Frame-Options | DENY | Chống clickjacking |
| X-Content-Type-Options | nosniff | Chống MIME-type sniffing |
| Strict-Transport-Security | max-age=31536000 | Force HTTPS |
| Referrer-Policy | strict-origin-when-cross-origin | Kiểm soát referrer |
| Permissions-Policy | camera=(), microphone=() | Chặn quyền không cần thiết |
| X-DNS-Prefetch-Control | on | Tăng tốc DNS |

### Rate Limiting

| API Route | Limit | Window |
|-----------|-------|--------|
| `/api/rsvp` | 10 requests | 60 giây |
| `/api/wishes` | 10 requests | 60 giây |
| tRPC guest mutations | 10 requests | 60 giây |

### XSS Protection

- Tất cả input từ khách (guest_name, message, phone) được **strip HTML tags**
- Giới hạn độ dài: name(100), message(500), phone(20), emoji(10)
- Code tại: `apps/web/src/app/api/rsvp/route.ts` và `apps/web/src/app/api/wishes/route.ts`

---

## 6. Database (Supabase)

### Tables chính

| Table | Mô tả | RLS |
|-------|-------|-----|
| `projects` | Thiệp cưới của users | User-scoped |
| `templates` | Mẫu thiệp | Public read |
| `rsvps` | Xác nhận tham dự | Project-scoped |
| `wishes` | Lời chúc | Project-scoped |
| `gifts` | Mừng cưới | Project-scoped |
| `orders` | Đơn hàng | User-scoped |
| `subscriptions` | Gói dịch vụ | User-scoped |
| `users_view` | View cho admin | Admin only |

### Plan Limits

| Plan | Projects | Photos | Views | Price |
|------|----------|--------|-------|-------|
| Free | 1 | 10 | 300 | 0₫ |
| Basic | 5 | 50 | 5,000 | 99,000₫ |
| Premium | Unlimited | 100 | Unlimited | 199,000₫ |

---

## 7. Chạy Local Development

```bash
# 1. Clone & install
git clone https://github.com/ainear/lovestory.git
cd lovestory
pnpm install

# 2. Setup env
cp apps/web/.env.example apps/web/.env.local
# Điền các biến ở mục 3

# 3. Dev server
pnpm dev
# → http://localhost:3000

# 4. Build production
pnpm build
```

### Branch Strategy

| Branch | Mục đích |
|--------|----------|
| `main` | Production — deploy to Vercel |
| `develop` | Development — merge vào main khi stable |

---

## 8. Vercel Deployment

### Cấu hình hiện tại

| Setting | Value |
|---------|-------|
| Project | `onenearcelos-projects/web` |
| Framework | Next.js (auto-detected) |
| Build command | `next build` |
| Root directory | `apps/web` (monorepo) |
| Node version | 22 |
| Region | Auto |

### Deploy thủ công

```bash
# Login (nếu chưa)
vercel login

# Deploy production
vercel --prod --yes
```

### ⚠️ Free Tier Limit

- **100 deploys/ngày** — nếu đạt limit, chờ ~24h để reset
- Mỗi `git push` đến `main` = 1 deploy

---

## 9. Troubleshooting

| Vấn đề | Giải pháp |
|---------|-----------|
| Admin redirect về dashboard | Kiểm tra email login = `ADMIN_EMAIL` |
| Vercel deploy fail | Kiểm tra Vercel dashboard → Deployments → Error logs |
| Vercel rate limit | Chờ 24h hoặc upgrade plan |
| QR code không hiện | Kiểm tra bankName, bankAccount có dữ liệu |
| Build lỗi TypeScript | `pnpm build` local trước, fix errors |
