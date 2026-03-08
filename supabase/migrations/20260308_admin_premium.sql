-- Admin gets Premium subscription
INSERT INTO subscriptions (user_id, plan, status)
SELECT id, 'premium', 'active'
FROM auth.users WHERE email = 'admin@7app.online'
ON CONFLICT (user_id) DO UPDATE SET plan = 'premium', status = 'active';

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
