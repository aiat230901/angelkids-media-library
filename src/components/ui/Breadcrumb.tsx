import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return <nav className="breadcrumb" aria-label="Breadcrumb"><ol>{items.map((item, index) => <li className="breadcrumb-item" key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span className="breadcrumb-current" aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}
