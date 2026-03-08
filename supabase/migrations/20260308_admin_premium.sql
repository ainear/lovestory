-- Admin gets Premium subscription
-- subscriptions schema: (id, user_id, plan, order_id, started_at, expires_at)
INSERT INTO subscriptions (user_id, plan)
SELECT id, 'premium'
FROM auth.users WHERE email = 'admin@7app.online'
ON CONFLICT (user_id) DO UPDATE SET plan = 'premium';

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
