export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return <section className="hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lead">{lead}</p></section>;
}

