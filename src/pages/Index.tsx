import { useState, useMemo } from "react";
import { Difficulty } from "@/types/study";
import { studyAreas, sampleFlashcards, sampleQuizQuestions } from "@/data/studyAreas";
import { StudyAreaCard } from "@/components/StudyAreaCard";
import { FlashcardViewer } from "@/components/FlashcardViewer";
import { QuizView } from "@/components/QuizView";
import { DifficultySelect } from "@/components/DifficultySelect";
import { GraduationCap, Sparkles } from "lucide-react";

type View =
  | { type: "home" }
  | { type: "flashcards"; areaId: string }
  | { type: "quiz-difficulty"; areaId: string }
  | { type: "quiz"; areaId: string; difficulty: Difficulty };

const Index = () => {
  const [view, setView] = useState<View>({ type: "home" });

  const areaName = useMemo(() => {
    if (view.type === "home") return "";
    return studyAreas.find((a) => a.id === view.areaId)?.name ?? "";
  }, [view]);

  if (view.type === "flashcards") {
    const cards = sampleFlashcards.filter((c) => c.areaId === view.areaId);
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <FlashcardViewer
            cards={cards.length ? cards : sampleFlashcards}
            areaName={areaName}
            onBack={() => setView({ type: "home" })}
          />
        </div>
      </div>
    );
  }

  if (view.type === "quiz-difficulty") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <DifficultySelect
            areaName={areaName}
            onBack={() => setView({ type: "home" })}
            onSelect={(d) =>
              setView({ type: "quiz", areaId: view.areaId, difficulty: d })
            }
          />
        </div>
      </div>
    );
  }

  if (view.type === "quiz") {
    const questions = sampleQuizQuestions.filter(
      (q) => q.areaId === view.areaId && q.difficulty === view.difficulty
    );
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <QuizView
            questions={questions.length ? questions : sampleQuizQuestions.filter(q => q.difficulty === view.difficulty).length ? sampleQuizQuestions.filter(q => q.difficulty === view.difficulty) : sampleQuizQuestions}
            areaName={areaName}
            difficulty={view.difficulty}
            onBack={() => setView({ type: "quiz-difficulty", areaId: view.areaId })}
          />
        </div>
      </div>
    );
  }

  // Home
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gradient-hero px-4 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">
              BioMed Study
            </h1>
          </div>
          <p className="text-primary-foreground/80 text-base">
            Flashcards e quizzes interativos para biomedicina
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm text-primary-foreground">
            <Sparkles className="h-4 w-4" /> Integrado com IA via n8n
          </div>
        </div>
      </header>

      {/* Study Areas */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-6 text-xl font-bold text-foreground">Áreas de Estudo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studyAreas.map((area, i) => (
            <div key={area.id} style={{ animationDelay: `${i * 80}ms` }}>
              <StudyAreaCard
                area={area}
                onFlashcards={() => setView({ type: "flashcards", areaId: area.id })}
                onQuiz={() => setView({ type: "quiz-difficulty", areaId: area.id })}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
