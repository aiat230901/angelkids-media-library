import { AppHeader } from "@/components/layout/AppHeader";

export const dynamic = "force-dynamic";

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return <><AppHeader />{children}</>;
}

