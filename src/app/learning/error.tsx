"use client";

export default function LearningError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="page-shell"><div className="empty-state"><h1>Chưa thể tải học liệu</h1><p>Vui lòng thử lại sau hoặc báo cho nhà trường nếu lỗi vẫn tiếp diễn.</p><button className="reset-button" type="button" onClick={reset}>Thử lại</button></div></main>;
}

