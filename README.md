# Hệ Thống Quản Lý Tour

## Thành viên
| Họ tên | MSSV |
|--------------|----------|
| Nguyễn Ngọc Thạch  | 2201700077     |
| Hoàng Anh          | 2201700173     |
| Lê Đức Long        | 2201700193     |

## Tổng Quan
Đây là một ứng dụng web full-stack để quản lý tour du lịch. Hệ thống cho phép người dùng xem, tạo, chỉnh sửa và xóa tour dựa trên vai trò của họ. Hệ thống có tính năng xác thực và phân quyền với các vai trò người dùng khác nhau (admin, quản lý, khách hàng).

## Công Nghệ Sử Dụng
- **Frontend:** React, Apollo Client, React Router, Tailwind CSS
- **Backend:** Node.js, Express, GraphQL Yoga
- **Cơ sở dữ liệu:** MongoDB với Mongoose
- **Xác thực:** JWT (JSON Web Tokens)

## Yêu Cầu Trước Khi Cài Đặt
- Node.js (phiên bản 14 trở lên)
- MongoDB (cài đặt cục bộ hoặc tài khoản MongoDB Atlas)
- npm hoặc yarn

## Hướng Dẫn Cài Đặt

### Tải Mongo
Tải về image của mongodb:
```sh
docker pull mongo
```

Kiểm tra image đã có chưa:
```sh
docker images
```
Từ image mongodb, tạo ra container và đặt tên db:
```sh
docker create --name db -p 27017:27017 mongo
```

Kiểm tra danh sách các container:
```sh
docker ps -a
```

Chạy container:
```sh
docker start db
```

### Cấu Hình Backend
Đi đến thư mục `server`:
```sh
cd server
```

Cài đặt các thư viện cần thiết:
```sh
npm install
```

Tạo tệp `.env` trong thư mục `server` với nội dung:
```env
CODESPACE_NAME=your-codespace-name
PORT=4000
MONGO_URI=mongodb://localhost:27017/hotel_management
JWT_SECRET=your_jwt_secret_key
```

Khởi tạo dữ liệu mẫu trong cơ sở dữ liệu:
```sh
npm run migrate-up
```

Khởi động server:
```sh
npm run dev
```

API GraphQL sẽ có sẵn tại [http://localhost:4000/graphql](http://localhost:4000/graphql)

### Cấu Hình Frontend
Đi đến thư mục `frontend`:
```sh
cd frontend
```

Cài đặt các thư viện cần thiết:
```sh
npm install
```

Tạo tệp `.env` trong thư mục `frontend` với nội dung:
```env
VITE_BACKEND_URL=https://your-codespace-name-4000.app.github.dev
```

Cập nhật cấu hình Apollo Client trong `src/graphql/client.js` để trỏ đến URL của server GraphQL.

Khởi động server frontend:
```sh
npm run dev
```

Ứng dụng frontend sẽ chạy tại [http://localhost:5173](http://localhost:5173)

## Thông Tin Tài Khoản Mặc Định

| Tên đăng nhập | Mật khẩu | Vai trò   |
|--------------|----------|-----------|
| admin       | 1234     | admin     |
| john        | 1234     | quản lý   |
| jack        | 1234     | quản lý   |
| alice       | 1234     | khách hàng |
| bob         | 1234     | khách hàng |

## Chức Năng Chính
- **Xác thực:** Đăng nhập/đăng xuất bằng JWT
- **Phân quyền:** Kiểm soát truy cập dựa trên vai trò
- **Quản lý tour:**
  - Xem danh sách tất cả các tour (mọi người dùng)
  - Xem chi tiết tour (mọi người dùng)
  - Tạo tour mới (chỉ admin và quản lý)
  - Chỉnh sửa tour (chỉ admin và quản lý)
  - Xóa tour (chỉ admin và quản lý)
- **Tìm kiếm:** Lọc tour theo tên và khoảng giá
- **Upload Ảnh:** Cho phép quản lý tải lên ảnh đại diện cho tour
- **Hiển thị Ảnh:** Hiển thị ảnh tour trong danh sách và chi tiết

## Cấu Trúc Dự Án
### Backend (`server/`)
```
server/
├── data/                 # Truy cập dữ liệu
│   ├── models/           # Mongoose models 
│   ├── init.js           # Kết nối cơ sở dữ liệu
│   ├── tourRepo.js       # Repository quản lý tour
│   └── userRepo.js       # Repository quản lý người dùng
├── graphql/              # Schema và resolver GraphQL
├── img/                  # Thư mục chứa ảnh tour đã upload
├── middleware/           # Middleware Express
│   └── auth.js           # Middleware xác thực
├── migrations/           # Cập nhật dữ liệu ban đầu
├── .env_sample           # Mẫu biến môi trường
├── .gitignore            # Cấu hình Git ignore
├── config.js             # Cấu hình ứng dụng
├── index.js              # Điểm khởi chạy ứng dụng
├── migrate-mongo-config.js # Cấu hình migration MongoDB
├── package-lock.json     # Danh sách dependency chi tiết
└── package.json          # Thư viện và script
```

### Frontend (`frontend/`)
```
frontend/
├── public/               # Tệp tĩnh
├── src/                  # Mã nguồn chính
│   ├── assets/           # Tài nguyên tĩnh (hình ảnh, font chữ)
│   ├── components/       # Các component dùng lại
│   │   ├── Layout.jsx    # Component bố cục chính
│   │   └── ui/           # Component giao diện
│   ├── context/          # Context React
│   │   └── AuthContext.jsx # Context xác thực
│   ├── graphql/          # Truy vấn và mutation GraphQL
│   │   ├── auth.js       # Truy vấn xác thực
│   │   ├── client.js     # Cấu hình Apollo Client
│   │   └── tours.js      # Truy vấn và mutation tour
│   ├── lib/              # Hàm tiện ích
│   ├── pages/            # Các trang
│   │   ├── CreateTour.jsx
│   │   ├── EditTour.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NoPage.jsx
│   │   └── TourDetail.jsx
│   ├── App.css           # CSS cho component App
│   ├── App.jsx           # Component chính
│   ├── index.css         # CSS toàn cục
│   └── main.jsx          # Điểm khởi chạy ứng dụng
├── .gitignore            # Cấu hình Git ignore
├── components.json       # Cấu hình components
├── eslint.config.js      # Cấu hình ESLint
├── index.html            # File HTML gốc
├── jsconfig.json         # Cấu hình JavaScript
├── package-lock.json     # Danh sách dependency chi tiết
├── package.json          # Thư viện và script
├── README.md             # Tài liệu dự án
└── vite.config.js        # Cấu hình Vite
```

## API Endpoints
### **GraphQL Queries**
- `tours`: Lấy danh sách tất cả tour
- `tour(id: ID!)`: Lấy thông tin chi tiết một tour theo ID
- `searchTours(criteria: TourSearchInput)`: Tìm kiếm tour theo tiêu chí

### **GraphQL Mutations**
- `login(input: LoginInput)`: Xác thực người dùng
- `createTour(tourInput: TourInput!)`: Tạo tour mới
- `updateTour(id: ID!, tourInput: TourUpdateInput!)`: Cập nhật tour
- `deleteTour(id: ID!)`: Xóa tour
- `upload(file: File!)`: Tải lên một tệp ảnh và trả về tên tệp duy nhất (Mới)

## Ghi Chú Phát Triển
- Frontend sử dụng React Router để điều hướng
- Xác thực bằng JWT được lưu trong `localStorage`
- Backend sử dụng GraphQL Yoga
- MongoDB là cơ sở dữ liệu chính, kết hợp với Mongoose
- Hệ thống phân quyền theo vai trò người dùng

## Khắc Phục Sự Cố
- Nếu gặp lỗi CORS, đảm bảo backend cho phép frontend truy cập
- Nếu xác thực thất bại, kiểm tra giá trị `JWT_SECRET` trong `.env`
- Nếu gặp lỗi kết nối database, kiểm tra chuỗi kết nối `MONGO_URI`
