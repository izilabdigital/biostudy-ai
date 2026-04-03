export interface StudyArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Flashcard {
  id: string;
  areaId: string;
  question: string;
  answer: string;
  difficulty: Difficulty;
}

export interface QuizQuestion {
  id: string;
  areaId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
}

export type Difficulty = "facil" | "medio" | "dificil";

// 🎲 gera número aleatório de 0 a 20
export function getRandomCount(): number {
  return Math.floor(Math.random() * 21)+ 1;
}

// 🎲 escolhe dificuldade aleatória
export function getRandomDifficulty(): Difficulty {
  const difficulties: Difficulty[] = ["facil", "medio", "dificil"];
  const index = Math.floor(Math.random() * difficulties.length);
  return difficulties[index];
}
