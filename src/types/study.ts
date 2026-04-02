export interface StudyArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  cardCount: number;
  quizCount: number;
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

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  difficulty: Difficulty;
  areaId: string;
}
