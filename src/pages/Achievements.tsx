import { useEffect } from 'react';
import { useHabitStore, useAchievementStore } from '../store';
import AchievementsGrid from '../components/achievements/AchievementsGrid';

export default function Achievements() {
  const { habits, checkIns, streaks } = useHabitStore();
  const { checkAndUnlockAchievements } = useAchievementStore();

  // Check for new achievements when page loads
  useEffect(() => {
    const completedCheckIns = checkIns.filter((c) => c.completed);

    // Find longest streak
    let longestStreak = 0;
    streaks.forEach((streak) => {
      if (streak.longestStreak > longestStreak) {
        longestStreak = streak.longestStreak;
      }
    });

    // Check for time-based achievements
    const hasCompletedBefore6AM = completedCheckIns.some((c) => {
      const hour = new Date(c.timestamp).getHours();
      return hour < 6;
    });

    const hasCompletedAfter10PM = completedCheckIns.some((c) => {
      const hour = new Date(c.timestamp).getHours();
      return hour >= 22;
    });

    checkAndUnlockAchievements({
      longestStreak,
      totalCompletions: completedCheckIns.length,
      totalHabits: habits.length,
      hasCompletedBefore6AM,
      hasCompletedAfter10PM,
      hasPerfectWeek: false, // Would need more complex logic to check
    });
  }, [habits, checkIns, streaks, checkAndUnlockAchievements]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-600 mt-2">
          Track your progress and unlock badges as you build better habits
        </p>
      </div>

      <AchievementsGrid />
    </div>
  );
}
