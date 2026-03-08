-- ===================================================
-- LoveStory — Sprint 3: Multi-category + Blog
-- Run in Supabase SQL Editor
-- ===================================================

-- 1. Add category column to projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'wedding'
    CHECK (category IN ('wedding', 'birthday', 'event', 'anniversary', 'other'));

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- 2. Blog posts table (for SEO content)
CREATE TABLE IF NOT EXISTS blog_posts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    excerpt     TEXT,
    content     TEXT,
    cover_url   TEXT,
    author      TEXT DEFAULT 'LoveStory Team',
    tags        TEXT[] DEFAULT '{}',
    published   BOOLEAN DEFAULT false,
    view_count  INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published);

-- RLS: anyone can read published posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read published posts') THEN
    CREATE POLICY "Anyone can read published posts" ON blog_posts
      FOR SELECT USING (published = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access blog') THEN
    CREATE POLICY "Service role full access blog" ON blog_posts
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- 3. Seed 3 initial blog posts for SEO
INSERT INTO blog_posts (slug, title, excerpt, content, tags, published)
VALUES
(
  'thiet-ke-thiep-cuoi-online-dep',
  'Hướng dẫn thiết kế thiệp cưới online đẹp 2026',
  'Khám phá cách tạo thiệp cưới online miễn phí, đẹp và tinh tế với LoveStory — không cần kỹ năng thiết kế.',
  '<h2>Tại sao nên dùng thiệp cưới online?</h2><p>Thiệp cưới online tiết kiệm chi phí in ấn, dễ chia sẻ qua Zalo và Facebook, và mang lại trải nghiệm tương tác độc đáo cho khách mời.</p><h2>Các bước tạo thiệp trên LoveStory</h2><ol><li>Đăng ký tài khoản miễn phí</li><li>Chọn mẫu thiệp yêu thích</li><li>Điền thông tin đám cưới</li><li>Chia sẻ link với khách mời</li></ol>',
  ARRAY['thiệp cưới', 'thiệp cưới online', 'hướng dẫn'],
  true
),
(
  'mau-thiep-cuoi-dep-nhat-2026',
  'Top 15 mẫu thiệp cưới đẹp nhất 2026',
  'Tổng hợp 15 mẫu thiệp cưới online hot nhất năm 2026 — từ cổ điển sang trọng đến hiện đại tối giản.',
  '<h2>Rose Garden</h2><p>Phong cách hoa hồng lãng mạn, tông màu hồng pastel nhẹ nhàng — phù hợp đám cưới mùa xuân.</p><h2>Midnight Romance</h2><p>Tông tối huyền bí với chữ ánh vàng — sang trọng và độc đáo.</p><h2>Golden Hour</h2><p>Tông vàng ấm áp, gợi nhớ ánh hoàng hôn — lý tưởng cho đám cưới outdoor.</p>',
  ARRAY['mẫu thiệp cưới', 'thiệp cưới 2026', 'top thiệp đẹp'],
  true
),
(
  'thiet-ke-thiep-sinh-nhat-online',
  'Tạo thiệp sinh nhật online độc đáo và miễn phí',
  'Hướng dẫn tạo thiệp sinh nhật online đẹp, cá nhân hóa với tên người nhận và gửi qua điện thoại trong 5 phút.',
  '<h2>Thiệp sinh nhật online là gì?</h2><p>Đây là thiệp điện tử có thể nhúng nhạc, countdown, gallery ảnh — trải nghiệm hơn thiệp giấy thông thường.</p><h2>Tính năng nổi bật</h2><ul><li>Nhúng tên người nhận cá nhân hóa</li><li>Nhạc nền</li><li>Bộ đếm ngược đến sinh nhật</li><li>Wall lời chúc realtime</li></ul>',
  ARRAY['thiệp sinh nhật', 'sinh nhật online', 'birthday card'],
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ===================================================
-- ✅ Done. Verify with:
-- SELECT category, COUNT(*) FROM projects GROUP BY category;
-- SELECT slug, title, published FROM blog_posts;
-- ===================================================
