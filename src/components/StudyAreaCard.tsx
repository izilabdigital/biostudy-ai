import { StudyArea } from "@/types/study";
import { BookOpen, HelpCircle } from "lucide-react";

interface StudyAreaCardProps {
  area: StudyArea;
  onFlashcards: () => void;
  onQuiz: () => void;
}

export function StudyAreaCard({ area, onFlashcards, onQuiz }: StudyAreaCardProps) {
  return (
    <div className="group animate-fade-in rounded-xl border border-border bg-card p-5 card-shadow transition-all duration-300 hover:elevated-shadow hover:scale-[1.02]">
      <div className="flex items-start gap-4">
        <span className="text-3xl">{area.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground">{area.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{area.description}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onFlashcards}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-3 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
        >
          <BookOpen className="h-4 w-4" /> Flashcards
        </button>
        <button
          onClick={onQuiz}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <HelpCircle className="h-4 w-4" /> Quiz
        </button>
      </div>
    </div>
  );
}
