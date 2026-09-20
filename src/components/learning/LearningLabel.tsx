// Display labels only: catalog names, routes and breadcrumb labels stay unchanged.
const labels: Record<string, { english: string; vietnamese: string; stacked?: boolean }> = {
  Watch: { english: "Watch", vietnamese: "Luyện xem", stacked: true },
  Read: { english: "Read", vietnamese: "Tập đọc", stacked: true },
  "Songs & Poems": { english: "Songs & Poems", vietnamese: "Bài hát & Thơ", stacked: true },
  "Digital Flashcards": { english: "Flashcards", vietnamese: "Thẻ học tập", stacked: true },
  "Print and Plays": { english: "Print and Play", vietnamese: "Tài liệu in & Chơi cùng con", stacked: true },
  Stories: { english: "Stories", vietnamese: "Truyện kể", stacked: true },
  Dialogues: { english: "Dialogues", vietnamese: "Hội thoại", stacked: true },
  "Virtual Teacher Guide": { english: "Virtual Teacher Guide", vietnamese: "Hướng dẫn bài học", stacked: true },
  Storybooks: { english: "Storybooks", vietnamese: "Sách truyện", stacked: true },
  "Dialogue Books": { english: "Dialogue Books", vietnamese: "Sách hội thoại", stacked: true },
};

export function LearningLabel({ name }: { name: string }) {
  const label = Object.hasOwn(labels, name) ? labels[name] : undefined;
  if (!label) return name;
  return <span className={`learning-label${label.stacked ? " learning-label-stacked" : ""}`}><span lang="en">{label.english}</span>{" "}<span className="learning-label-translation" lang="vi">– {label.vietnamese}</span></span>;
}
