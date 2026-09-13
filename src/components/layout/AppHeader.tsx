"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
const menuItems = [
  { label: "Trang chủ", href: "/learning" },
  { label: "Luyện xem", href: "/learning/watch" },
  { label: "Tập đọc", href: "/learning/read" },
  { label: "Bài hát & Thơ", href: "/learning/songs" },
  { label: "Thẻ học tập", href: "/learning/digital-flashcards" },
  { label: "Tài liệu in & Chơi cùng con", href: "/learning/print-and-plays" },
];

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function closeMenu() {
    setIsOpen(false);
    openerRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const focusable = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? []);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    focusable()[0]?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return <><header className="site-header"><div className="header-inner">
    <Link className="brand" href="/learning" aria-label="Về trang Learning Hub"><span className="brand-crop"><Image src="/brand/angel-kids-logo.png" alt="Angel Kids Bilingual Preschool" width={858} height={477} priority /></span></Link>
    <button ref={openerRef} className="menu-trigger" type="button" aria-expanded={isOpen} aria-controls="learning-navigation" aria-label="Mở menu điều hướng" onClick={() => setIsOpen(true)}><Home aria-hidden="true" size={21} strokeWidth={1.7} /><span className="home-label">Trang chủ</span></button>
  </div></header>
  {isOpen && <div ref={menuRef} className="navigation-overlay" id="learning-navigation" role="dialog" aria-modal="true" aria-label="Menu điều hướng" onMouseDown={(event) => { if (event.target === event.currentTarget) closeMenu(); }}>
    <nav className="navigation-menu" aria-label="Điều hướng Learning Hub">
      <button className="menu-close" type="button" aria-label="Đóng menu điều hướng" onClick={closeMenu}><X aria-hidden="true" size={28} strokeWidth={2.4} /></button>
      {menuItems.map((item) => <Link key={item.href} href={item.href} onClick={closeMenu}>{item.label}</Link>)}
    </nav>
  </div>}
  </>;
}
