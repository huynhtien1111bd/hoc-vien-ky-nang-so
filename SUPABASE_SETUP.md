# Hướng dẫn liên kết Cơ sở dữ liệu Supabase 🚀

Tài liệu này hướng dẫn bạn cách thiết lập các bảng dữ liệu trên **Supabase** để hệ thống đồng bộ hóa hoàn hảo với Website Học tập trực tuyến của bạn.

---

## 1. Khởi tạo cấu trúc bảng (SQL Schema)

Hãy truy cập vào trang quản trị Supabase của bạn tại [Supabase Dashboard](https://supabase.com). 
Chọn dự án của bạn (`otqxevgnwnlsqbvzudgt`), đi tới mục **SQL Editor** ở thanh menu bên trái, tạo một **New Query**, dán đoạn mã SQL dưới đây và nhấn **Run**:

```sql
-- 1. Bảng Khóa học (courses)
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    description TEXT,
    lessons_count INTEGER DEFAULT 0,
    exam_count INTEGER DEFAULT 0,
    registered BOOLEAN DEFAULT false,
    progress INTEGER DEFAULT 0,
    badge TEXT,
    files JSONB DEFAULT '[]'::jsonb,
    quiz JSONB DEFAULT '[]'::jsonb,
    lessons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bảng Đề thi thử (exams)
CREATE TABLE IF NOT EXISTS public.exams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    questions_count INTEGER DEFAULT 0,
    time_minutes INTEGER DEFAULT 15,
    category TEXT,
    badge TEXT,
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bảng Lịch sử Giao dịch mua học liệu (purchase_logs)
CREATE TABLE IF NOT EXISTS public.purchase_logs (
    id TEXT PRIMARY KEY,
    item_name TEXT,
    price NUMERIC DEFAULT 0,
    buyer_name TEXT,
    syntax TEXT,
    date TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Kích hoạt quyền truy cập công khai (Nếu bạn không cấu hình RLS bảo mật nâng cao)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_logs ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách cho phép đọc/ghi công khai không giới hạn (Dành cho việc thử nghiệm nhanh)
DROP POLICY IF EXISTS "Allow public select for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public insert for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public update for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public delete for courses" ON public.courses;
CREATE POLICY "Allow public select for courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public insert for courses" ON public.courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for courses" ON public.courses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for courses" ON public.courses FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public select for exams" ON public.exams;
DROP POLICY IF EXISTS "Allow public insert for exams" ON public.exams;
DROP POLICY IF EXISTS "Allow public update for exams" ON public.exams;
DROP POLICY IF EXISTS "Allow public delete for exams" ON public.exams;
CREATE POLICY "Allow public select for exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Allow public insert for exams" ON public.exams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for exams" ON public.exams FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for exams" ON public.exams FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public select for purchase_logs" ON public.purchase_logs;
DROP POLICY IF EXISTS "Allow public insert for purchase_logs" ON public.purchase_logs;
DROP POLICY IF EXISTS "Allow public update for purchase_logs" ON public.purchase_logs;
DROP POLICY IF EXISTS "Allow public delete for purchase_logs" ON public.purchase_logs;
CREATE POLICY "Allow public select for purchase_logs" ON public.purchase_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert for purchase_logs" ON public.purchase_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for purchase_logs" ON public.purchase_logs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for purchase_logs" ON public.purchase_logs FOR DELETE USING (true);
```

---

## 2. Cấu hình biến môi trường khi deploy lên Vercel 🌐

Để ứng dụng kết nối thành công với cơ sở dữ liệu Supabase sau khi deploy lên **Vercel**, bạn cần thêm các biến môi trường sau trong mục **Settings > Environment Variables** trên Vercel Dashboard của dự án:

| Tên biến (Key) | Giá trị (Value) | Mô tả |
| :--- | :--- | :--- |
| `SUPABASE_URL` | `https://otqxevgnwnlsqbvzudgt.supabase.co` | Đường dẫn dự án Supabase của bạn |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` *(Xem ANON KEY của bạn)* | Mã khóa truy cập ẩn danh |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIs...` *(Xem SERVICE ROLE KEY)* | Mã khóa dịch vụ tối cao (cho phép ghi đè) |
| `GEMINI_API_KEY` | *(Mã API Key Gemini của bạn)* | Khóa kích hoạt AI Tutor thông minh |
| `NODE_ENV` | `production` | Chế độ chạy ứng dụng |

---

## 3. Cách thức hoạt động và Cơ chế dự phòng (Fallback)

Hệ thống của bạn được lập trình cực kỳ bền vững:
- **Tự động nhận diện**: Server tự động kiểm tra sự tồn tại của cấu hình Supabase.
- **Tự động khởi tạo dữ liệu mẫu (Auto-Seeding)**: Khi các bảng trên Supabase trống, server sẽ tự động seed các khóa học, đề thi thử, lịch sử giao dịch ban đầu lên Supabase để bạn không phải tự tạo thủ công.
- **Cơ chế dự phòng hoàn hảo**: Nếu cơ sở dữ liệu Supabase gặp sự cố, chưa tạo bảng hoặc cấu hình sai, website **sẽ không bị lỗi hay gián đoạn** mà tự động chuyển sang sử dụng bộ nhớ cục bộ (LocalStorage & In-Memory), đảm bảo trải nghiệm người dùng luôn trơn tru.
