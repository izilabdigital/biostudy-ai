import { Difficulty } from "@/types/study";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Zap, Flame, Skull } from "lucide-react";

interface DifficultySelectProps {
  areaName: string;
  onSelect: (d: Difficulty) => void;
  onBack: () => void;
}

const difficulties = [
  {
    value: "facil" as Difficulty,
    label: "Fácil",
    description: "Conceitos básicos e fundamentais",
    icon: Zap,
    color: "border-success/30 bg-success/5 hover:bg-success/10 hover:border-success/50",
    iconColor: "text-success",
  },
  {
    value: "medio" as Difficulty,
    label: "Médio",
    description: "Aplicação e correlação clínica",
    icon: Flame,
    color: "border-warning/30 bg-warning/5 hover:bg-warning/10 hover:border-warning/50",
    iconColor: "text-warning",
  },
  {
    value: "dificil" as Difficulty,
    label: "Difícil",
    description: "Casos complexos e raciocínio avançado",
    icon: Skull,
    color: "border-destructive/30 bg-destructive/5 hover:bg-destructive/10 hover:border-destructive/50",
    iconColor: "text-destructive",
  },
];

export function DifficultySelect({ areaName, onSelect, onBack }: DifficultySelectProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {areaName} — Escolha a dificuldade
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {difficulties.map(({ value, label, description, icon: Icon, color, iconColor }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all duration-200 hover:scale-105 ${color}`}
          >
            <Icon className={`h-10 w-10 ${iconColor}`} />
            <span className="text-lg font-bold text-foreground">{label}</span>
            <span className="text-center text-sm text-muted-foreground">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
