import { useState } from "react";
import { Flashcard, QuizQuestion, Difficulty } from "@/types/study";

const WEBHOOK_URL = "https://n8n-n8n.xwskpb.easypanel.host/webhook/biomed-site-app";

interface WebhookPayload {
  action: "generate_flashcards" | "generate_quiz";
  area: string;
  difficulty: Difficulty;
  count: number;
}

export function useN8nWebhook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callWebhook = async <T>(payload: WebhookPayload): Promise<T | null> => {
    if (!WEBHOOK_URL) {
      setError("URL do webhook n8n não configurada. Configure em useN8nWebhook.ts");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

const generateFlashcards = async (area: string, count = 5) => {
  const data = await callWebhook<Flashcard[]>({
    action: "generate_flashcards",
    area,
    difficulty: "facil", // pode mandar qualquer um, vamos sobrescrever depois
    count,
  });

  if (!data) return null;

  // 🔥 cada flashcard com dificuldade random
  const flashcardsWithRandomDifficulty = data.map((card) => ({
    ...card,
    difficulty: getRandomDifficulty(),
  }));

  return flashcardsWithRandomDifficulty;
};

const generateQuiz = async (area: string, difficulty: Difficulty, count = 10) => {
  return callWebhook<QuizQuestion[]>({
    action: "generate_quiz",
    area,
    difficulty,
    count,
  });
};
const getRandomDifficulty = (): Difficulty => {
  const levels: Difficulty[] = ["facil", "medio", "dificil"];
  return levels[Math.floor(Math.random() * levels.length)];
};

const getRandomCount = () => {
  return Math.floor(Math.random() * 21) + 1; // 0 até 20
};

  return { generateFlashcards, generateQuiz, loading, error };

}
