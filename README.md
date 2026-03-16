# TRUE LOOK EYEWEAR - Frontend

Frontend cho hệ thống bán kính TRUE LOOK, xây bằng React + TypeScript + Vite.

## 1) Tổng quan

Dự án gồm:

- Website khách hàng: xem sản phẩm, giỏ hàng, đặt hàng, thanh toán, theo dõi đơn.
- Trang quản trị: quản lý sản phẩm, ảnh, thương hiệu, danh mục, khuyến mãi, đơn hàng, hỗ trợ, phân quyền, v.v.

## 2) Công nghệ sử dụng

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Zustand
- React Hook Form + Zod
- Tailwind CSS
- Sonner (toast)

## 3) Yêu cầu môi trường

- Node.js >= 20
- npm >= 10

## 4) Cài đặt và chạy dự án

### Cài dependencies

```bash
npm install
```

### Cấu hình môi trường

Tạo file `.env` ở root `true-look-fe`:

```env
VITE_API_URL=http://localhost:3000/
```

> Bắt buộc có `VITE_API_URL`, nếu thiếu app sẽ throw lỗi trong runtime.

### Chạy dev

```bash
npm run dev
```

### Build production

```bash
npm run build
```

### Preview bản build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## 5) Scripts chính

- `npm run dev`: chạy local dev server
- `npm run build`: compile TypeScript + build Vite
- `npm run preview`: chạy bản build local
- `npm run lint`: kiểm tra eslint

## 6) Cấu trúc thư mục chính

```text
src/
  app/                  # router, store, providers
  features/             # modules theo domain (auth, products, orders, payments...)
  lib/                  # axios, env, query client, utils
  shared/               # components dùng chung, constants, layouts, hooks, types
  styles/               # global styles
```

## 7) Luồng chức năng chính

### Khách hàng

- Đăng nhập / đăng ký
- Duyệt sản phẩm và xem chi tiết
- Thêm giỏ hàng, chọn địa chỉ
- Checkout (COD hoặc chuyển khoản)
- Trang kết quả thanh toán:
  - `/payments/success`
  - `/payments/cancel`
- Xem đơn hàng tại `/orders`

### Quản trị

- Vào `/admin`
- Các màn hình hiển thị theo quyền role (RBAC)
- Quản lý users, products, images, orders, support, shipping, promotions...

## 8) Danh sách tài khoản test

> ⚠️ Chỉ dùng cho môi trường test/dev. Không dùng các tài khoản này cho production.

### Mật khẩu chung cho nhóm staff/admin

- Password: `Hoang123@`

### Tài khoản

- Admin
  - Username: `tester01`
  - Password: `Hoang123@`

- Sales Staff
  - Username: `mhoang09`
  - Password: `Hoang123@`

- Operation Staff
  - Username: `mhoang10`
  - Password: `Hoang123@`

- Manager
  - Username: `mhoang11`
  - Password: `Hoang123@`

- Sales + Operation
  - Username: `mhoang14`
  - Password: `Hoang123@`

- Customer
  - Username: `mhoang01`
  - Password: `Hoang1305@`

## 9) Một số route quan trọng

### Public / User

- `/` - Trang chủ
- `/products` - Danh sách sản phẩm
- `/products/:id` - Chi tiết sản phẩm
- `/cart` - Giỏ hàng
- `/checkout` - Thanh toán
- `/payments/success` - Kết quả thanh toán thành công
- `/payments/cancel` - Kết quả thanh toán thất bại / hủy
- `/orders` - Đơn hàng của tôi
- `/profile` - Hồ sơ cá nhân

### Admin

- `/admin` - Dashboard
- `/admin/users` - Quản lý nhân viên
- `/admin/products` - Quản lý sản phẩm
- `/admin/orders` - Quản lý đơn hàng
- `/admin/support` - Hỗ trợ khách hàng
- `/admin/shipping-orders` - Đơn giao Nhanh.vn
- `/admin/user-roles` - Quản lý phân quyền

## 10) Lưu ý triển khai

- Nếu deploy SPA và bị 404 khi vào route trực tiếp, cần cấu hình server rewrite về `index.html`.
- Khi đổi callback thanh toán, đảm bảo URL return/cancel trỏ đúng domain frontend.
- Với môi trường production, bắt buộc thay toàn bộ tài khoản test và secret.

---

Nếu cần, có thể bổ sung thêm phần:

- flow release/deploy,
- checklist QA,
- sơ đồ quyền chi tiết theo role.
