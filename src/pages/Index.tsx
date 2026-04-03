import { useState, useMemo, useEffect, useCallback } from "react";
import { Difficulty, Flashcard, QuizQuestion, StudyArea } from "@/types/study";
import { studyAreas, sampleFlashcards, sampleQuizQuestions } from "@/data/studyAreas";
import { StudyAreaCard } from "@/components/StudyAreaCard";
import { FlashcardViewer } from "@/components/FlashcardViewer";
import { QuizView } from "@/components/QuizView";
import { DifficultySelect } from "@/components/DifficultySelect";
import { PdfUploadButton } from "@/components/PdfUploadButton";
import { useN8nWebhook } from "@/hooks/useN8nWebhook";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Sparkles, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type View =
  | { type: "home" }
  | { type: "loading-flashcards"; areaId: string }
  | { type: "flashcards"; areaId: string; cards: Flashcard[] }
  | { type: "quiz-difficulty"; areaId: string }
  | { type: "loading-quiz"; areaId: string; difficulty: Difficulty }
  | { type: "quiz"; areaId: string; difficulty: Difficulty; questions: QuizQuestion[] };

const Index = () => {
  const [view, setView] = useState<View>({ type: "home" });
  const [customAreas, setCustomAreas] = useState<StudyArea[]>([]);
  const { generateFlashcards, generateQuiz, loading, error } = useN8nWebhook();
  const { toast } = useToast();

  const fetchCustomAreas = useCallback(async () => {
    const { data } = await supabase
      .from("custom_study_areas")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setCustomAreas(
        data.map((d: any) => ({
          id: `custom-${d.id}`,
          name: d.name,
          description: d.description,
          icon: d.icon,
          color: d.color,
        }))
      );
    }
  }, []);

  useEffect(() => {
    fetchCustomAreas();
  }, [fetchCustomAreas]);

  const allAreas = useMemo(() => [...studyAreas, ...customAreas], [customAreas]);

  const handleDeleteCustomArea = async (areaId: string) => {
    const dbId = areaId.replace("custom-", "");
    await supabase.from("custom_study_areas").delete().eq("id", dbId);
    fetchCustomAreas();
  };

  const areaName = useMemo(() => {
    if (view.type === "home") return "";
    return allAreas.find((a) => a.id === view.areaId)?.name ?? "";
  }, [view, allAreas]);

  const handleFlashcards = async (areaId: string) => {
    const area = allAreas.find((a) => a.id === areaId);
    setView({ type: "loading-flashcards", areaId });

    const result = await generateFlashcards(area?.name ?? areaId);

    if (result && Array.isArray(result) && result.length > 0) {
      const cards: Flashcard[] = result.map((item: any, i: number) => ({
        id: `ai-fc-${i}`,
        areaId,
        question: item.question ?? item.pergunta ?? "",
        answer: item.answer ?? item.resposta ?? "",
        difficulty: item.difficulty ?? item.dificuldade ?? "medio",
      }));
      setView({ type: "flashcards", areaId, cards });
    } else {
      toast({
        title: "Usando conteúdo local",
        description: error || "Não foi possível gerar com IA. Mostrando flashcards de exemplo.",
        variant: "destructive",
      });
      const fallback = sampleFlashcards.filter((c) => c.areaId === areaId);
      setView({
        type: "flashcards",
        areaId,
        cards: fallback.length ? fallback : sampleFlashcards,
      });
    }
  };

  const handleQuizDifficulty = (areaId: string) => {
    setView({ type: "quiz-difficulty", areaId });
  };

  const handleStartQuiz = async (areaId: string, difficulty: Difficulty) => {
    const area = allAreas.find((a) => a.id === areaId);
    setView({ type: "loading-quiz", areaId, difficulty });

    const result = await generateQuiz(area?.name ?? areaId, difficulty, 10);

    if (result && Array.isArray(result) && result.length > 0) {
      const questions: QuizQuestion[] = result.map((item: any, i: number) => ({
        id: `ai-q-${i}`,
        areaId,
        question: item.question ?? item.pergunta ?? "",
        options: item.options ?? item.opcoes ?? item.alternativas ?? [],
        correctIndex: item.correctIndex ?? item.correct_index ?? item.resposta_correta ?? 0,
        explanation: item.explanation ?? item.explicacao ?? "",
        difficulty: item.difficulty ?? item.dificuldade ?? difficulty,
      }));
      setView({ type: "quiz", areaId, difficulty, questions });
    } else {
      toast({
        title: "Usando conteúdo local",
        description: error || "Não foi possível gerar com IA. Mostrando quiz de exemplo.",
        variant: "destructive",
      });
      const fallback = sampleQuizQuestions.filter(
        (q) => q.areaId === areaId && q.difficulty === difficulty
      );
      setView({
        type: "quiz",
        areaId,
        difficulty,
        questions: fallback.length
          ? fallback
          : sampleQuizQuestions.filter((q) => q.difficulty === difficulty).length
          ? sampleQuizQuestions.filter((q) => q.difficulty === difficulty)
          : sampleQuizQuestions,
      });
    }
  };

  // Loading states
  if (view.type === "loading-flashcards" || view.type === "loading-quiz") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-lg font-medium text-foreground">
          {view.type === "loading-flashcards"
            ? "Gerando flashcards com IA..."
            : "Gerando quiz com IA..."}
        </p>
      </div>
    );
  }

  if (view.type === "flashcards") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <FlashcardViewer
            cards={view.cards}
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
            onSelect={(d) => handleStartQuiz(view.areaId, d)}
          />
        </div>
      </div>
    );
  }

  if (view.type === "quiz") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <QuizView
            questions={view.questions}
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
            <Sparkles className="h-4 w-4" /> Conteúdo gerado por IA via n8n
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Áreas de Estudo</h2>
          <PdfUploadButton onUploadComplete={fetchCustomAreas} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allAreas.map((area, i) => (
            <div key={area.id} className="relative" style={{ animationDelay: `${i * 80}ms` }}>
              <StudyAreaCard
                area={area}
                onFlashcards={() => handleFlashcards(area.id)}
                onQuiz={() => handleQuizDifficulty(area.id)}
              />
              {area.id.startsWith("custom-") && (
                <button
                  onClick={() => handleDeleteCustomArea(area.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors"
                  title="Remover tema"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
