import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export function AppHeader() {
  return <header className="site-header"><div className="header-inner">
    <Link className="brand" href="/learning" aria-label="Về trang Learning Hub"><span className="brand-crop"><Image src="/brand/angel-kids-logo.png" alt="Angel Kids Bilingual Preschool" width={858} height={477} priority /></span></Link>
    <Link className="home-link" href="/learning"><Home aria-hidden="true" size={21} strokeWidth={1.7} /><span className="home-label">Trang chủ</span></Link>
  </div></header>;
}

