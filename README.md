# SOFA Phương Ly | Landing Page

Website bán hàng một trang (landing page) cho thương hiệu nội thất **SOFA Phương Ly**.

---

## Cách mở & chạy

Đây là website thuần **HTML + CSS + JavaScript**, **không cần cài đặt** gì thêm.

### Cách đơn giản nhất:

1. Mở `index.html` trực tiếp bằng trình duyệt (Chrome, Firefox, Edge…)
2. **Tuy nhiên**: do dùng ES modules (Three.js), cần chạy qua một HTTP server để tránh lỗi CORS.

### Chạy với Live Server (khuyến nghị):

- Nếu dùng **VS Code**: cài extension **Live Server** → chuột phải `index.html` → **Open with Live Server**
- Hoặc dùng **http-server** (Node.js): `npx http-server .` rồi mở `http://localhost:8080`

---

## Cấu trúc thư mục

```
landing-page-dt-phuong-ly/
├── index.html          ← File HTML chính (tất cả sections)
├── css/
│   └── style.css       ← Toàn bộ styles + animations + responsive
├── js/
│   └── main.js         ← Three.js scenes, GSAP, interactions
├── images/             ← Thư mục ảnh (đặt ảnh thật vào đây)
│   ├── og-image.jpg    ← TODO: ảnh thumbnail khi share Facebook
│   └── logo.png        ← TODO: logo thật (nếu có)
└── README.md
```

---

## Cách thay nội dung

### 1. Thay link Fanpage, SĐT, địa chỉ

Mở `js/main.js`, tìm phần đầu file:

```js
const SITE = {
  fanpage:  'https://www.facebook.com/profile.php?id=61574062977384',
  phone:    '[SĐT]',    // ← thay bằng SĐT thật
  zalo:     '[SĐT]',    // ← thay bằng Zalo
  address:  '[Địa chỉ showroom]', // ← thay bằng địa chỉ thật
};
```

Trong `index.html`, tìm `<!-- TODO -->` để thay thông tin còn lại (SĐT, địa chỉ trong footer).

### 2. Thay ảnh sản phẩm

Mở `js/main.js`, tìm phần `PRODUCTS`:

```js
const PRODUCTS = {
  'sofa-da': [
    { name: 'Sofa Da Luxury L-Shape',
      desc: '...',
      img: 'https://picsum.photos/seed/soda101/600/400'  // ← thay bằng 'images/sofa-da-1.jpg'
    },
    ...
  ],
  ...
};
```

Đặt ảnh vào thư mục `images/` rồi đổi `img:` thành đường dẫn tương đối, ví dụ: `'images/sofa-da-lshape.jpg'`.

**Kích thước ảnh gợi ý**: 600×400px (card sản phẩm), tỉ lệ 3:2.

### 3. Thay ảnh gallery (section "Không gian thực tế")

Mở `index.html`, tìm section `id="gallery"`, thay các thẻ `<img>`:

```html
<img src="https://picsum.photos/seed/room11/600/900" alt="...">
```
→ đổi thành:
```html
<img src="images/gallery-1.jpg" alt="Mô tả ảnh">
```

**Kích thước ảnh gợi ý**: ảnh đứng 600×900px, ảnh ngang 600×500px.

### 4. Thay đánh giá khách hàng (Testimonials)

Mở `index.html`, tìm section `id="testimonials"`, chỉnh nội dung trong các thẻ `<blockquote>`, tên và thành phố.

### 5. Thay ảnh Open Graph (thumbnail khi share Facebook)

Thêm file `images/og-image.jpg` (1200×630px), rồi trong `index.html` sửa:
```html
<meta property="og:image" content="images/og-image.jpg">
<meta property="og:url" content="https://tên-domain-của-bạn.com">
```

---

## Thay model 3D sofa (tùy chọn nâng cao)

Nếu bạn có file `sofa.glb`:

1. Tạo thư mục `models/` trong thư mục gốc
2. Đặt file `sofa.glb` vào `models/sofa.glb`
3. Mở `js/main.js`, tìm hàm `buildHeroScene()` và thêm code load GLB sau dòng comment `// TODO`:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('models/sofa.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.setScalar(1.5);
  model.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.remove(heroSofa); // bỏ sofa placeholder
  scene.add(model);
  heroSofa = model;
});
```

---

## Deploy lên Vercel

Vì đây là website tĩnh (static), deploy Vercel rất dễ:

### Cách 1: Kéo thả (đơn giản nhất)

1. Truy cập [vercel.com](https://vercel.com) → Đăng nhập
2. Dashboard → **Add New → Project**
3. Kéo thả **toàn bộ thư mục** `landing-page-dt-phuong-ly` vào ô upload
4. Vercel tự nhận diện là static site → Deploy
5. Nhận URL dạng `xyz.vercel.app` trong vài giây

### Cách 2: Qua GitHub (khuyến nghị để cập nhật dễ dàng)

1. Tạo repo GitHub mới → Upload toàn bộ code lên
2. Vercel → **Import Git Repository** → chọn repo vừa tạo
3. Framework Preset: **Other** (vì là HTML thuần)
4. Root Directory: `/` → Deploy
5. Mỗi lần push code lên GitHub, Vercel tự deploy lại

### Cài domain riêng

Trong Vercel project → **Settings → Domains** → thêm domain của bạn → làm theo hướng dẫn cập nhật DNS.

---

## Thư viện sử dụng (CDN — không cần cài)

| Thư viện | Mục đích |
|---|---|
| **Three.js 0.160** | Cảnh 3D sofa hero + showcase 360° |
| **GSAP 3.12.5** | Scroll animations, số đếm động |
| **ScrollTrigger** (GSAP plugin) | Kích hoạt animation theo scroll |
| **Lenis 1.1.14** | Smooth scroll toàn trang |
| **Google Fonts** | Playfair Display + Be Vietnam Pro |

---

## Tùy chỉnh màu sắc

Mở `css/style.css`, phần đầu file (`/* 1. VARIABLES */`):

```css
:root {
  --bg:      #15110E;   /* Nền chính tối */
  --accent:  #B07A4A;   /* Accent caramel */
  --gold:    #C9A35B;   /* Vàng nhấn */
  --cream:   #F3ECE3;   /* Chữ sáng */
  ...
}
```

Thay đổi giá trị màu ở đây sẽ áp dụng toàn trang.

---

*© 2024 SOFA Phương Ly*
