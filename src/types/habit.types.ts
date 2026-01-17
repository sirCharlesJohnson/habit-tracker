export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export type HabitCategory =
  | 'health'
  | 'productivity'
  | 'learning'
  | 'mindfulness'
  | 'social'
  | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetDays?: number[]; // For weekly: [0,1,2,3,4,5,6] where 0 = Sunday
  color: string; // Hex color for visual identity
  icon?: string; // Icon name from Lucide
  createdAt: string; // ISO date string
  archived: boolean;
}

export interface CheckIn {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  note?: string;
  mood?: 1 | 2 | 3 | 4 | 5; // Optional mood when checking in
  timestamp: string; // ISO timestamp
}

export interface Streak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string; // YYYY-MM-DD
  totalCompletions: number;
}

export interface HabitWithStreak extends Habit {
  streak?: Streak;
}
