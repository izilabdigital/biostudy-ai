import { useState, useCallback } from "react";
import { QuizQuestion, Difficulty, QuizResult } from "@/types/study";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";

interface QuizViewProps {
  questions: QuizQuestion[];
  areaName: string;
  difficulty: Difficulty;
  onBack: () => void;
}

const difficultyLabels = { facil: "Fácil", medio: "Médio", dificil: "Difícil" };

export function QuizView({ questions, areaName, difficulty, onBack }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];

  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }, [selectedAnswer, question]);

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="animate-fade-in flex flex-col items-center gap-6 py-12">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <Trophy className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Quiz Finalizado!</h2>
        <p className="text-muted-foreground">{areaName} — {difficultyLabels[difficulty]}</p>
        <div className="text-center">
          <p className="text-5xl font-extrabold text-primary">{percentage}%</p>
          <p className="mt-2 text-muted-foreground">
            {score} de {questions.length} corretas
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Button>
          <Button variant="hero" onClick={handleRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Refazer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Button>
        <Badge variant="outline">{difficultyLabels[difficulty]}</Badge>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-2 w-full rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-6 card-shadow">
        <p className="text-lg font-medium text-card-foreground">{question.question}</p>
      </div>

      <div className="grid gap-3">
        {question.options.map((option, i) => {
          let style = "border border-border bg-card hover:bg-secondary/50 text-card-foreground";
          if (selectedAnswer !== null) {
            if (i === question.correctIndex) {
              style = "border-2 border-success bg-success/10 text-foreground";
            } else if (i === selectedAnswer) {
              style = "border-2 border-destructive bg-destructive/10 text-foreground";
            } else {
              style = "border border-border bg-muted/50 text-muted-foreground opacity-60";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={`flex items-center gap-3 rounded-lg p-4 text-left transition-all duration-200 ${style} ${
                selectedAnswer === null ? "cursor-pointer hover:scale-[1.01]" : "cursor-default"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{option}</span>
              {selectedAnswer !== null && i === question.correctIndex && (
                <CheckCircle2 className="h-5 w-5 text-success" />
              )}
              {selectedAnswer !== null && i === selectedAnswer && i !== question.correctIndex && (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="animate-fade-in rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-primary mb-1">Explicação:</p>
          <p className="text-sm text-foreground leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {selectedAnswer !== null && (
        <div className="flex justify-end">
          <Button variant="hero" onClick={handleNext}>
            {currentIndex === questions.length - 1 ? "Ver Resultado" : "Próxima"}
          </Button>
        </div>
      )}
    </div>
  );
}
