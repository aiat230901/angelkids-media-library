# Learning Hub UI Rules

Áp dụng cho `/learning` và các trang danh mục như `/learning/watch`, `/learning/read`.

## Card nội dung

- Giữ nguyên title, description, CTA, màu sắc, spacing và cấu trúc hiện có, trừ khi yêu cầu nói rõ khác đi.
- Mỗi thay đổi chỉ tác động card hoặc trang được chỉ định; không làm thay đổi các card khác ngoài phạm vi.
- Desktop rộng (`>980px`): dùng layout ngang khi nội dung phù hợp — media bên trái, nội dung bên phải.
- Tablet/iPad (`431–980px`): với card có ảnh vuông/dọc cần giữ trọn chủ thể, chuyển sang layout dọc — ảnh phía trên, nội dung phía dưới.
- Mobile (`≤430px`): dùng layout dọc; giữ title và CTA, ẩn description

## Ảnh media

- Không stretch hoặc làm méo ảnh.
- Ưu tiên giữ framing tự nhiên và chủ thể chính luôn nhìn thấy rõ.
- Khi cần giữ trọn ảnh gốc, dùng `object-fit: contain` và nền media phù hợp thay vì crop mạnh.
- Với ảnh vuông trên card dọc, vùng media nên dùng `aspect-ratio: 1` để tránh cắt đầu/chủ thể.
- Chỉ dùng `object-fit: cover` khi crop không làm mất nội dung quan trọng; đặt `object-position` rõ ràng nếu cần.

## Kiểm tra trước khi chốt

- Kiểm tra tối thiểu ở desktop lớn, iPad/tablet và mobile.
- Không có horizontal overflow ở mobile.
- Title, CTA và điều hướng vẫn đọc được, thao tác được bằng bàn phím.
- Chạy lint, typecheck và test phù hợp với thay đổi.
