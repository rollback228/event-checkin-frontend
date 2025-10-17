# Sử dụng Node.js LTS làm base image
FROM node:22

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép file package để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Tắt kiểm tra ESLint để tránh lỗi build
ENV NEXT_DISABLE_ESLINT=1

# Thiết lập cổng chạy ứng dụng
ENV PORT=4500

# Build ứng dụng nếu dùng Next.js
RUN npm run build

# Mở cổng 4500 (hoặc cổng ứng dụng của bạn)
EXPOSE 4500
# Lệnh khởi chạy ứng dụng
CMD ["npm", "start"]