import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AchievementProgress } from '../types';
import { ACHIEVEMENTS, getAchievementById } from '../utils/achievements';
import { toast } from './toastStore';

interface AchievementState {
  unlockedAchievements: AchievementProgress[];

  // Actions
  unlockAchievement: (achievementId: string) => void;
  checkAndUnlockAchievements: (stats: AchievementCheckStats) => void;
  isAchievementUnlocked: (achievementId: string) => boolean;
  getUnlockedCount: () => number;
  getTotalCount: () => number;
}

export interface AchievementCheckStats {
  longestStreak: number;
  totalCompletions: number;
  totalHabits: number;
  hasCompletedBefore6AM?: boolean;
  hasCompletedAfter10PM?: boolean;
  hasPerfectWeek?: boolean;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedAchievements: [],

      unlockAchievement: (achievementId) => {
        const state = get();
        if (state.isAchievementUnlocked(achievementId)) return;

        const achievement = getAchievementById(achievementId);
        if (!achievement) return;

        const newProgress: AchievementProgress = {
          achievementId,
          currentProgress: achievement.requirement,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
        };

        set((state) => ({
          unlockedAchievements: [...state.unlockedAchievements, newProgress],
        }));

        // Show toast notification
        toast.success(`Achievement Unlocked: ${achievement.name}!`);
      },

      checkAndUnlockAchievements: (stats) => {
        const { unlockAchievement, isAchievementUnlocked } = get();

        // Check streak achievements
        if (stats.longestStreak >= 3 && !isAchievementUnlocked('streak-3')) {
          unlockAchievement('streak-3');
        }
        if (stats.longestStreak >= 7 && !isAchievementUnlocked('streak-7')) {
          unlockAchievement('streak-7');
        }
        if (stats.longestStreak >= 14 && !isAchievementUnlocked('streak-14')) {
          unlockAchievement('streak-14');
        }
        if (stats.longestStreak >= 30 && !isAchievementUnlocked('streak-30')) {
          unlockAchievement('streak-30');
        }
        if (stats.longestStreak >= 100 && !isAchievementUnlocked('streak-100')) {
          unlockAchievement('streak-100');
        }
        if (stats.longestStreak >= 365 && !isAchievementUnlocked('streak-365')) {
          unlockAchievement('streak-365');
        }

        // Check completion achievements
        if (stats.totalCompletions >= 10 && !isAchievementUnlocked('completions-10')) {
          unlockAchievement('completions-10');
        }
        if (stats.totalCompletions >= 50 && !isAchievementUnlocked('completions-50')) {
          unlockAchievement('completions-50');
        }
        if (stats.totalCompletions >= 100 && !isAchievementUnlocked('completions-100')) {
          unlockAchievement('completions-100');
        }
        if (stats.totalCompletions >= 500 && !isAchievementUnlocked('completions-500')) {
          unlockAchievement('completions-500');
        }
        if (stats.totalCompletions >= 1000 && !isAchievementUnlocked('completions-1000')) {
          unlockAchievement('completions-1000');
        }

        // Check variety achievements
        if (stats.totalHabits >= 3 && !isAchievementUnlocked('habits-3')) {
          unlockAchievement('habits-3');
        }
        if (stats.totalHabits >= 5 && !isAchievementUnlocked('habits-5')) {
          unlockAchievement('habits-5');
        }
        if (stats.totalHabits >= 10 && !isAchievementUnlocked('habits-10')) {
          unlockAchievement('habits-10');
        }

        // Check special achievements
        if (stats.hasCompletedBefore6AM && !isAchievementUnlocked('early-bird')) {
          unlockAchievement('early-bird');
        }
        if (stats.hasCompletedAfter10PM && !isAchievementUnlocked('night-owl')) {
          unlockAchievement('night-owl');
        }
        if (stats.hasPerfectWeek && !isAchievementUnlocked('perfect-week')) {
          unlockAchievement('perfect-week');
        }
      },

      isAchievementUnlocked: (achievementId) => {
        return get().unlockedAchievements.some(
          (a) => a.achievementId === achievementId && a.isUnlocked
        );
      },

      getUnlockedCount: () => {
        return get().unlockedAchievements.filter((a) => a.isUnlocked).length;
      },

      getTotalCount: () => {
        return ACHIEVEMENTS.length;
      },
    }),
    {
      name: 'habit-tracker-achievements',
    }
  )
);
