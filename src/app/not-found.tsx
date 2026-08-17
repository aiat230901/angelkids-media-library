import Link from "next/link";

export default function NotFound() {
  return <main className="page-shell"><div className="empty-state"><h1>Không tìm thấy trang</h1><p>Học liệu này có thể chưa được xuất bản hoặc đã được lưu trữ.</p><Link className="back-link" href="/learning">Về Learning Hub</Link></div></main>;
}

