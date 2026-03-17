-- Sprint 6 — SEO Blog Posts Seed
-- Target keywords: Vietnamese wedding search terms with high organic volume
-- ========================================================================

-- Ensure read_time_minutes column exists (may be from prior sprint)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS read_time_minutes INTEGER DEFAULT 5;

-- ─────────────────────────────────────────────────────────────────────────
-- Post 1: "50 mẫu thiệp cưới đẹp nhất 2026" — high search volume, evergreen
-- ─────────────────────────────────────────────────────────────────────────
INSERT INTO blog_posts (
  slug, title, excerpt, content, tags, author, author_name,
  published, view_count, read_time_minutes, created_at
) VALUES (
  'thiep-cuoi-dep-2026',
  '50 Mẫu Thiệp Cưới Đẹp Nhất 2026 — Xu hướng & Cảm hứng',
  'Tổng hợp 50 mẫu thiệp cưới đẹp nhất năm 2026. Từ phong cách tối giản hiện đại đến cổ điển lãng mạn và truyền thống Việt Nam. Tìm ngay thiệp cưới phù hợp với câu chuyện tình yêu của bạn.',
  '## Xu hướng thiệp cưới 2026

Năm 2026, thiệp cưới không chỉ là một tờ giấy mời — đây là trải nghiệm số đầu tiên mà khách mời nhận được từ cặp đôi. Các xu hướng nổi bật:

## 1. Tối giản hiện đại (Minimalist)

Phong cách tối giản với nền trắng, font chữ thanh lịch và không gian trống thoáng đãng. Phù hợp cho các đám cưới nhà hàng sang trọng, resort ven biển.

- Màu sắc: trắng, kem, xám nhạt
- Font: Cormorant Garamond, Lora, EB Garamond
- Hiệu ứng: fade-in nhẹ nhàng

## 2. Vintage Romantic (Lãng mạn cổ điển)

Thiệp cưới vintage mang hơi thở của thời đại vàng son, với họa tiết đường viền hoa và màu pastel ấm áp.

- Màu sắc: hồng nhạt, vàng champagne, bạc
- Font: Dancing Script, Great Vibes, Sacramento
- Điểm nhấn: đường viền thủ công, hoa hồng nhỏ

## 3. Phong cách Việt truyền thống

Kết hợp yếu tố văn hóa Việt như đèn lồng đỏ, chữ Hỷ, hoa sen và áo dài trong thiết kế hiện đại.

- Màu sắc: đỏ, vàng đồng, xanh ngọc
- Họa tiết: đèn lồng, hoa sen, viền rồng phượng

## 4. Bohemian & Garden Party

Phong cách tự nhiên, hoang dã với hoa dại, lá xanh và màu sắc đất.

## Tại sao chọn thiệp cưới online?

- ✅ Tiết kiệm chi phí in ấn và vận chuyển
- ✅ Chia sẻ tức thời qua Zalo, Facebook, WhatsApp
- ✅ RSVP thông minh — biết ai tham dự ngay lập tức
- ✅ Cập nhật thông tin không giới hạn
- ✅ Thân thiện môi trường',
  ARRAY['thiệp cưới', 'wedding design', 'xu hướng 2026', 'thiệp online'],
  'LoveStory Team',
  'LoveStory Team',
  true, 0, 6,
  NOW() - INTERVAL '3 days'
) ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────
-- Post 2: "Hướng dẫn tạo thiệp cưới online" — tutorial, conversion-focused
-- ─────────────────────────────────────────────────────────────────────────
INSERT INTO blog_posts (
  slug, title, excerpt, content, tags, author, author_name,
  published, view_count, read_time_minutes, created_at
) VALUES (
  'huong-dan-tao-thiep-cuoi-online',
  'Hướng Dẫn Tạo Thiệp Cưới Online Đẹp Trong 5 Phút — Miễn Phí',
  'Tạo thiệp cưới online chuyên nghiệp, đẹp và dễ chia sẻ chỉ trong 5 phút. Hướng dẫn chi tiết từng bước: chọn mẫu, chỉnh sửa thông tin, thêm nhạc nền và chia sẻ ngay.',
  '## Bước 1: Đăng ký tài khoản miễn phí

Truy cập 7app.online và đăng ký tài khoản trong 30 giây. Không cần thẻ tín dụng.

## Bước 2: Chọn mẫu thiệp yêu thích

LoveStory cung cấp 50+ mẫu thiệp cưới cao cấp, được thiết kế bởi chuyên gia UI/UX. Phân loại theo phong cách:

- 🌸 Lãng mạn & Hoa tươi
- 🏺 Truyền thống Việt Nam
- ✨ Sang trọng & Hiện đại
- 🌿 Thiên nhiên & Garden Party

## Bước 3: Chỉnh sửa thông tin

Nhập tên cô dâu, chú rể, ngày tháng, địa điểm. Tất cả đều chỉnh sửa được trực tiếp trên canvas.

## Bước 4: Thêm nhạc nền (tuỳ chọn)

Chọn nhạc phù hợp từ thư viện 4 thể loại: nhạc đám cưới, V-POP, quốc tế, lo-fi nhẹ nhàng.

## Bước 5: Chia sẻ & Nhận RSVP

Nhấn "Xuất bản" để lấy đường link duy nhất. Chia sẻ qua Zalo, Facebook, tin nhắn. Theo dõi RSVP thời gian thực ngay trên dashboard.

## Mẹo để thiệp cưới đẹp hơn

- Sử dụng ảnh độ phân giải cao (tối thiểu 1200px)
- Chọn font chữ tương phản với màu nền
- Giữ nội dung ngắn gọn, dễ đọc trên điện thoại
- Kiểm tra trên cả điện thoại và máy tính trước khi gửi',
  ARRAY['hướng dẫn', 'thiệp cưới online', 'tutorial', 'RSVP'],
  'LoveStory Team',
  'LoveStory Team',
  true, 0, 4,
  NOW() - INTERVAL '1 day'
) ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────
-- Post 3: "Lời cảm ơn đám cưới" — long-tail, high intent keyword
-- ─────────────────────────────────────────────────────────────────────────
INSERT INTO blog_posts (
  slug, title, excerpt, content, tags, author, author_name,
  published, view_count, read_time_minutes, created_at
) VALUES (
  'loi-cam-on-dam-cuoi',
  '50 Lời Cảm Ơn Đám Cưới Hay Nhất — Template Sẵn Dùng',
  'Tổng hợp 50 mẫu lời cảm ơn đám cưới hay, cảm động và chuyên nghiệp. Từ lời cảm ơn ngắn gọn cho tin nhắn Zalo đến bài phát biểu dài cho tiệc cưới. Copy và dùng ngay!',
  '## Tại sao lời cảm ơn đám cưới quan trọng?

Một lời cảm ơn chân thành sẽ để lại ấn tượng tốt đẹp trong lòng khách mời và người thân. Đây cũng là cơ hội để cặp đôi bày tỏ tình cảm với những người đã đồng hành trong ngày trọng đại.

## Lời cảm ơn ngắn gọn (gửi qua Zalo/Facebook)

**Mẫu 1 — Trang trọng:**
"Cảm ơn bạn đã tham dự hôn lễ của chúng mình. Sự hiện diện của bạn là món quà quý giá nhất. Cảm ơn và mong thường xuyên gặp mặt! — [Tên cô dâu] & [Tên chú rể]"

**Mẫu 2 — Thân mật:**
"Cảm ơn bạn đã đến chung vui với tụi mình nha! Buổi tiệc thêm ý nghĩa vì có bạn ❤️"

**Mẫu 3 — Hài hước:**
"Tụi mình đã chính thức về một nhà. Cảm ơn bạn đã làm nhân chứng cho màn ''thất thủ'' của [tên chú rể] 😂"

## Lời cảm ơn cho người thân gia đình

"Kính thưa Ba Mẹ, cảm ơn ba mẹ đã sinh thành và nuôi dưỡng chúng con. Trong ngày vui hôm nay, chúng con xin hứa sẽ luôn yêu thương, trân trọng và xây dựng gia đình hạnh phúc."

## Lời cảm ơn cho bạn bè thân thiết

"Cảm ơn những người bạn thân đã giúp mình trang trí, chuẩn bị và cả... chịu đựng mình hồi hộp suốt mấy tháng qua 😄 Tụi mình may mắn vì có những người bạn như các bạn!"

## Mẹo viết lời cảm ơn đám cưới

- Cá nhân hóa: đề cập đến thứ gì đó riêng về người nhận
- Gửi trong vòng 1 tuần sau hôn lễ
- Viết tay cho người thân gần gũi
- Gửi kèm một ảnh đẹp trong ngày cưới',
  ARRAY['lời cảm ơn', 'đám cưới', 'mẫu câu', 'wedding speech'],
  'LoveStory Team',
  'LoveStory Team',
  true, 0, 5,
  NOW() - INTERVAL '5 hours'
) ON CONFLICT (slug) DO NOTHING;
