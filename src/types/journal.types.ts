export type MoodScore = 1 | 2 | 3 | 4 | 5; // 1 = very negative, 5 = very positive

export type SentimentLabel =
  | 'very-negative'
  | 'negative'
  | 'neutral'
  | 'positive'
  | 'very-positive';

export interface SentimentAnalysis {
  score: MoodScore;
  label: SentimentLabel;
  confidence: number; // 0-1
  themes?: string[]; // Key themes extracted by AI
  analyzedAt: string; // ISO timestamp
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  sentiment?: SentimentAnalysis;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface JournalFormData {
  content: string;
}
