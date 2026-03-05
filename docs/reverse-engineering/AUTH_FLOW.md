# AUTH_FLOW.md — CineLove Authentication System

## Login Page

- **Type:** Modal overlay (not separate page)
- **Trigger:** Click "Đăng nhập" in top-right navigation
- **URL:** Stays on current page, modal appears

### Form Fields
| Field | Type | Validation |
|-------|------|-----------|
| Email | `input[type="email"]` | Required, email format |
| Mật khẩu (Password) | `input[type="password"]` | Required, show/hide toggle (eye icon) |

### Social Login
- **Google OAuth** — Button with Google icon
- **Facebook OAuth** — Button with Facebook icon

### Additional Options
- "Quên mật khẩu?" (Forgot password) link
- "Đăng ký tài khoản mới" (Create new account) link at bottom

---

## Registration

- Modal overlay (tab switch from login)
- Fields: Email, Password, Confirm Password
- Social signup via Google/Facebook also available

---

## Authentication Method

| Aspect | Implementation |
|--------|---------------|
| **Token Type** | JWT (JSON Web Token) |
| **Storage** | LocalStorage or Cookie |
| **Header** | `Authorization: Bearer <token>` |
| **Session** | Persistent across page reloads |
| **Expiry** | Auto-refresh mechanism |

---

## API Endpoints (Inferred)

```
POST  https://api.cinelove.me/auth/login        # Email/password login
POST  https://api.cinelove.me/auth/register      # New account
POST  https://api.cinelove.me/auth/google        # Google OAuth callback
POST  https://api.cinelove.me/auth/facebook      # Facebook OAuth callback
POST  https://api.cinelove.me/auth/forgot        # Password reset
GET   https://api.cinelove.me/auth/me            # Get current user
POST  https://api.cinelove.me/auth/refresh       # Refresh token
POST  https://api.cinelove.me/auth/logout        # Logout
```

---

## Post-Login Redirect
- After successful login → redirect to `/dashboard`
- Dashboard shows user profile card with name, email, plan badge

---

## Profile Management
- **URL:** `/dashboard/profile`
- **Editable Fields:** Họ tên, Ngày sinh, Số điện thoại, Giới thiệu (Bio)
- **Read-only:** Email (verified, cannot change)
- **Password:** Change via "Đổi mật khẩu" button
- **Avatar:** Custom profile picture upload
- **Account Type:** "Tài khoản đăng ký bằng email"
