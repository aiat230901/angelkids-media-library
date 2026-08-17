# Angel Kids Learning Hub

Ứng dụng Next.js public, read-only cho học liệu Angel Kids. PostgreSQL lưu metadata do nhà trường sở hữu; YouTube, Heyzine và Google Drive chỉ cung cấp nội dung ngoài.

## Local setup

Yêu cầu Node.js 24+ và PostgreSQL 16.

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

`db:seed` chỉ đồng bộ navigation, Level và Curriculum Unit. Nó không xuất bản resource.

## Content workflow

Chỉnh ba manifest trong `content/`, sau đó:

```bash
npm run content:sync -- --validate
npm run content:sync
npm run content:sync -- --apply
```

Dry-run là mặc định và hiển thị các field thay đổi. Nếu một thay đổi tạo/chuyển resource thành `ACTIVE`, lệnh apply yêu cầu thêm `--confirm-active`. Sync không xóa record ngoài manifest.

## Verification

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Integration tests cần một PostgreSQL đã migrate riêng biệt:

```bash
TEST_DATABASE_URL=postgresql://... npm run test:integration
```

Playwright cần database đã seed và trình duyệt Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

## Deployment gates

Trước production, xác nhận chính xác `HEYZINE_ALLOWED_HOSTS`, `THUMBNAIL_ALLOWED_HOSTS`, `NEXT_PUBLIC_SITE_URL`, TLS/connection limits, migration command, rollback, log, backup retention và restore test trên Mắt Bão Vibe Hosting. Không chạy content sync trong `next build`.

