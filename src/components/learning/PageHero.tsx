import { LearningLabel } from "./LearningLabel";

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return <section className="hero"><p className="eyebrow"><LearningLabel name={eyebrow} /></p><h1><LearningLabel name={title} /></h1><p className="lead">{lead}</p></section>;
}
