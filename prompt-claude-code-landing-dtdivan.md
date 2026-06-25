# PROMPT CHO CLAUDE CODE — Landing Page "DT DIVAN – Sofa Phương Ly"

> Copy toàn bộ nội dung bên dưới (từ dòng `Bạn là...` trở đi) và dán vào Claude Code.

---

Bạn là một senior frontend developer kiêm motion/3D designer. Hãy xây dựng cho tôi một **landing page bán hàng (one-page)** cho thương hiệu nội thất **"DT DIVAN – Sofa Phương Ly"**.

## 1. Bối cảnh & mục tiêu

- Ngành: nội thất — chuyên **sofa, sofa gỗ, giường/divan**, da thật & gỗ tự nhiên 100%, định vị **hiện đại – sang trọng – êm ái**.
- Mục tiêu DUY NHẤT của trang: **gây ấn tượng thị giác cực mạnh để khách muốn bấm đặt hàng ngay**, và **mọi hành động đặt hàng đều redirect sang Fanpage Facebook**.
- Link Fanpage (dùng cho TẤT CẢ nút CTA, mở tab mới): `https://www.facebook.com/profile.php?id=61574062977384`
- Đây KHÔNG phải web thương mại điện tử (không giỏ hàng, không thanh toán). Chỉ là landing page quảng cáo → đẩy traffic về Fanpage.

## 2. Vibe & định hướng thiết kế

- **Trẻ trung, hiện đại, nhiều animation, bắt mắt**, cảm giác **3D – có chiều sâu không gian**.
- Phong cách "premium showroom": tối giản nhưng sang, nhiều khoảng trắng/đệm, chuyển động mượt như bơ.
- **Bảng màu** (sang trọng, ấm, hợp da & gỗ):
  - Nền chính: charcoal/đen ngả nâu `#15110E`
  - Da/gỗ ấm (accent chính): caramel/cognac `#B07A4A`, nâu da `#8A5A36`
  - Kem/be sáng (chữ & vùng sáng): `#F3ECE3`
  - Điểm nhấn ánh kim: gold mảnh `#C9A35B`
  - Cho phép tạo thêm biến thể "light mode" (nền kem, chữ charcoal) và để biến CSS dễ đổi.
- **Typography**: heading font display sang trọng (vd: "Fraunces", "Playfair Display" hoặc "Cormorant"), body font hiện đại sạch sẽ (vd: "Be Vietnam Pro" — QUAN TRỌNG: phải hỗ trợ tiếng Việt đầy đủ). Lấy từ Google Fonts.
- Toàn bộ nội dung chữ bằng **tiếng Việt**.

## 3. Tech stack (bắt buộc dùng)

- **Vite + React + TypeScript**
- **Tailwind CSS** (custom theme theo bảng màu trên)
- **React Three Fiber** (`@react-three/fiber`) + **@react-three/drei** + **@react-three/postprocessing** (bloom, depth of field) cho cảnh 3D.
- **GSAP + ScrollTrigger** cho scroll animation.
- **Lenis** (`@studio-freight/lenis`) cho smooth scroll.
- **Framer Motion** cho micro-interaction UI.
- Code sạch, chia component rõ ràng, có comment tiếng Việt ở chỗ quan trọng.

## 4. Cấu trúc các section (theo thứ tự cuộn)

1. **Loading screen**: animation ngắn (1–1.5s) — chữ "DT DIVAN" hiện dần + thanh sáng quét qua, rồi fade mở ra hero. Bỏ qua nếu `prefers-reduced-motion`.

2. **Hero (3D)**:
   - Cảnh 3D React Three Fiber: một chiếc sofa nổi trong không gian tối, ánh sáng studio mềm, bóng đổ mặt sàn, hạt bụi sáng (light dust) lơ lửng, hiệu ứng **bloom + depth of field** tạo chiều sâu điện ảnh.
   - Nếu CHƯA có model 3D `.glb`: dùng giải pháp thay thế bằng ảnh sản phẩm PNG nền trong suốt đặt trên `<plane>`/billboard, kết hợp **parallax theo chuột** nhiều lớp (sofa – bóng – hạt sáng – nền) để giả lập chiều sâu 3D. Chuẩn bị sẵn chỗ load file `public/models/sofa.glb` để tôi thay sau bằng cách dùng `useGLTF`.
   - Sofa **tự xoay nhẹ**, và **xoay theo con trỏ chuột** (mouse parallax / drag để xoay trên desktop).
   - Headline lớn (vd: "Sofa kiến tạo không gian sống đẳng cấp"), subheadline ngắn, và **2 nút CTA**: nút chính "Đặt hàng ngay" (→ Fanpage), nút phụ "Khám phá bộ sưu tập" (cuộn xuống). Nút chính có hiệu ứng **magnetic + glow**.
   - Có scroll indicator động ở dưới.

3. **Thanh trust nhanh (marquee)**: dải chạy ngang lặp vô tận với các giá trị: "Da thật 100%", "Gỗ tự nhiên", "Bảo hành dài hạn", "Giao lắp tận nơi", "Đặt theo yêu cầu"...

4. **Bộ sưu tập sản phẩm**:
   - Grid card sản phẩm theo 3 nhóm: **Sofa da / Sofa gỗ / Giường – Divan**.
   - Mỗi card: ảnh sản phẩm, tên, mô tả ngắn, hiệu ứng **3D tilt theo chuột** + zoom ảnh + glow viền khi hover; nút "Inbox đặt mẫu này" → Fanpage.
   - Card reveal khi cuộn tới (stagger, slide-up + fade) bằng ScrollTrigger.
   - Dùng ảnh placeholder (ghi rõ TODO để tôi thay ảnh thật).

5. **Showcase 3D nổi bật / "Xoay 360°"**:
   - 1 sản phẩm hero thứ hai trong canvas R3F, người dùng **kéo để xoay**, có nút đổi màu da/chất liệu (đổi material color trong 3D) để thấy sự cao cấp.
   - Text bên cạnh nêu chất liệu, độ êm, đường may thủ công.

6. **Vì sao chọn DT DIVAN (USP)**:
   - 4 khối: Chất liệu thật (da bò, gỗ tự nhiên) · Sản xuất tại xưởng nội địa · Thiết kế hiện đại đa dạng · Tư vấn nhiệt tình, bảo hành.
   - Icon line mảnh + **số đếm động** (counter animate khi vào view): vd "1000+ khách hàng", "100% da & gỗ thật", "5★ đánh giá".

7. **Không gian thực tế**: gallery ảnh sofa trong phòng khách thật, layout kiểu masonry/parallax, ảnh trôi với tốc độ khác nhau khi cuộn.

8. **Đánh giá khách hàng**: 3–4 testimonial dạng card kính mờ (glassmorphism nhẹ), trích cảm nhận về độ êm ái, da thật, tư vấn nhiệt tình. (Dùng nội dung mẫu, ghi TODO.)

9. **CTA cuối (band lớn, gây áp lực chốt)**:
   - Nền gradient charcoal→caramel, chữ lớn "Sẵn sàng nâng tầm phòng khách của bạn?", nút khổng lồ **"Nhắn tin đặt hàng ngay trên Facebook"** → Fanpage, có hiệu ứng pulse/glow.

10. **Footer**: logo chữ "DT DIVAN – Sofa Phương Ly", link Fanpage, các placeholder: số điện thoại/Zalo `[SĐT]`, địa chỉ showroom `[Địa chỉ]`, giờ mở cửa. Icon Facebook → Fanpage.

## 5. Animation & hiệu ứng (yêu cầu cụ thể)

- Smooth scroll toàn trang (Lenis), đồng bộ với GSAP ScrollTrigger.
- Section reveal khi cuộn (fade + translate + stagger).
- Parallax đa lớp ở Hero và Gallery.
- 3D tilt + glow ở card sản phẩm.
- Magnetic button + ripple/glow ở các nút CTA.
- Bloom + DOF + hạt sáng trong cảnh 3D.
- Header trong suốt lúc đầu, blur nền + thu nhỏ khi cuộn.
- Cursor follower nhỏ (tùy chọn, tắt trên mobile).

## 6. Kỹ thuật & chất lượng (bắt buộc)

- **Responsive** hoàn hảo: mobile / tablet / desktop. Trên mobile **giảm tải 3D** (giảm particle, tắt postprocessing nặng, hạ DPR) để mượt; nếu thiết bị yếu thì fallback sang ảnh tĩnh có parallax nhẹ.
- Tôn trọng `prefers-reduced-motion` (tắt animation mạnh).
- Tối ưu hiệu năng: lazy-load section nặng, nén/responsive images, mục tiêu LCP nhanh.
- SEO + Open Graph (title, description, og:image bằng tiếng Việt) để share Facebook đẹp.
- Tạo file `src/config/site.ts` chứa: link Fanpage, SĐT, Zalo, địa chỉ, danh sách sản phẩm — để tôi sửa nhanh một chỗ.
- TẤT CẢ nút "Đặt hàng / Inbox / Nhắn tin / Mua ngay" đều trỏ tới biến `FANPAGE_URL`, mở `target="_blank"` `rel="noopener"`.

## 7. Bàn giao

- Cấu trúc project gọn gàng, components tách riêng.
- File `README.md` (tiếng Việt): cách cài (`npm install`), chạy dev (`npm run dev`), build (`npm run build`), **cách thay ảnh sản phẩm**, **cách thay link/SĐT trong `site.ts`**, **cách bỏ file `sofa.glb`** vào `public/models/`, và hướng dẫn **deploy lên Vercel**.
- Dùng ảnh/icon placeholder rõ ràng, đánh dấu `TODO` mọi chỗ cần tôi điền nội dung/ảnh thật.

Hãy bắt đầu bằng việc khởi tạo project, dựng theme + cấu hình, rồi build lần lượt từng section. Giải thích ngắn gọn các quyết định quan trọng khi làm.
