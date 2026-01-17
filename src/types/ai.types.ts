import type { Habit, CheckIn, Streak } from './habit.types';
import type { JournalEntry } from './journal.types';

export type CoachingMessageType =
  | 'motivation'
  | 'insight'
  | 'suggestion'
  | 'celebration';

export interface CoachingMessage {
  id: string;
  type: CoachingMessageType;
  content: string;
  relatedHabitIds?: string[];
  relatedJournalIds?: string[];
  createdAt: string;
  read: boolean;
}

export interface AIContext {
  habits: Habit[];
  recentCheckIns: CheckIn[];
  recentJournalEntries: JournalEntry[];
  streaks: Streak[];
}

export interface SentimentAnalysisRequest {
  text: string;
}

export interface SentimentAnalysisResponse {
  score: 1 | 2 | 3 | 4 | 5;
  label: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
  confidence: number;
  themes?: string[];
}

export interface CoachingRequest {
  context: AIContext;
}

export interface CoachingResponse {
  message: string;
  type: CoachingMessageType;
  relatedHabitIds?: string[];
}
