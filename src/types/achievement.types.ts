export type AchievementCategory =
  | 'streak'
  | 'consistency'
  | 'variety'
  | 'milestone'
  | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  color: string;
  requirement: number;
  unlockedAt?: string;
}

export interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}
