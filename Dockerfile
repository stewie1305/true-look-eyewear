# ==========================================
# 1) Build stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt thư viện trước để tận dụng cache
COPY package.json package-lock.json* ./
RUN npm ci

# Copy TOÀN BỘ source code vào container
COPY . .

# Build code: Dùng trực tiếp Vite, ĐÁ VĂNG thằng tsc ra chuồng gà!
RUN npx vite build

# ==========================================
# 2) Production stage
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# Cài đặt serve
RUN npm install -g serve

# Lấy cục code tĩnh đã build xong qua
COPY --from=builder /app/dist ./dist

# Mở port 3010
EXPOSE 3010

# Chạy server
CMD ["serve", "-s", "dist", "-l", "3000"]