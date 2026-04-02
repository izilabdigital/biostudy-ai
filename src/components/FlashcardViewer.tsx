import { useState } from "react";
import { Flashcard } from "@/types/study";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FlashcardViewerProps {
  cards: Flashcard[];
  areaName: string;
  onBack: () => void;
}

const difficultyLabels = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

const difficultyColors = {
  facil: "bg-success/10 text-success border-success/20",
  medio: "bg-warning/10 text-warning border-warning/20",
  dificil: "bg-destructive/10 text-destructive border-destructive/20",
};

export function FlashcardViewer({ cards, areaName, onBack }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.min(i + 1, cards.length - 1)), 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.max(i - 1, 0)), 150);
  };

  if (!card) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Button>
        <h2 className="text-lg font-semibold text-foreground">{areaName} — Flashcards</h2>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="flex justify-center">
        <div
          className="flip-card w-full max-w-lg cursor-pointer"
          style={{ height: "320px" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
            {/* Front */}
            <div className="flip-card-front flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8 card-shadow">
              <Badge className={`${difficultyColors[card.difficulty]} border`}>
                {difficultyLabels[card.difficulty]}
              </Badge>
              <p className="text-center text-lg font-medium text-card-foreground">
                {card.question}
              </p>
              <p className="text-xs text-muted-foreground mt-4">Clique para ver a resposta</p>
            </div>

            {/* Back */}
            <div className="flip-card-back flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-primary/30 bg-primary/5 p-8 card-shadow">
              <p className="text-center text-base leading-relaxed text-foreground">
                {card.answer}
              </p>
              <p className="text-xs text-muted-foreground mt-4">Clique para voltar à pergunta</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="mx-auto max-w-lg">
        <div className="h-2 w-full rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
