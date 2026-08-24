# Angel Kids Learning Hub

Ứng dụng Next.js public, read-only cho học liệu Angel Kids. PostgreSQL lưu metadata do nhà trường sở hữu; YouTube, Heyzine và Google Drive chỉ cung cấp nội dung ngoài.

## Local setup

Yêu cầu Node.js 20.19+, 22.12+ hoặc 24+ và PostgreSQL 16.

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

Dry-run là mặc định, hiển thị các field thay đổi và summary `created`, `updated`, `unchanged`, `total`. Nếu một thay đổi tạo/chuyển resource thành `ACTIVE`, lệnh apply yêu cầu thêm `--confirm-active`. Sync không xóa record ngoài manifest. Nếu transaction lỗi, toàn bộ lần sync được rollback và không có catalog import một phần.

Rollback khẩn cấp chỉ chuyển các resource `ACTIVE` có slug trong manifest hiện tại về `DRAFT`; không thay đổi record ngoài manifest hay reference data:

```bash
npm run content:rollback-draft
npm run content:rollback-draft -- --confirm-draft
```

Lệnh không có confirmation chỉ dry-run và in phạm vi dự kiến. `--confirm-draft` thực hiện update trong một transaction rồi in số lượng trước/sau.

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

## Toolchain security note

Tại ngày 2026-08-17, Prisma CLI 7.9.1 kéo `deepmerge-ts@7.1.5` có advisory stack-exhaustion trong build tooling. Không dùng `npm audit fix --force` vì lệnh này hạ breaking về Prisma 6. Runtime image phải prune dev dependencies sau build; nâng Prisma ngay khi upstream phát hành dependency `deepmerge-ts >=8` và bỏ ghi chú này sau khi audit sạch.

## Deployment gates

Trước production, xác nhận chính xác `HEYZINE_ALLOWED_HOSTS`, `THUMBNAIL_ALLOWED_HOSTS`, `NEXT_PUBLIC_SITE_URL`, TLS/connection limits, migration command, rollback, log, backup retention và restore test trên Mắt Bão Vibe Hosting. Không chạy content sync trong `next build`.
