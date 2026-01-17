import type { CheckIn, Streak, Habit } from '../../../types';
import { getTodayString, daysBetween } from '../../../utils/dateUtils';

/**
 * Calculate streak information for a habit based on its check-ins
 */
export function calculateStreak(habit: Habit, checkIns: CheckIn[]): Streak {
  // Filter to completed check-ins for this habit, sorted by date descending
  const completedCheckIns = checkIns
    .filter((c) => c.habitId === habit.id && c.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Initialize streak object
  const streak: Streak = {
    habitId: habit.id,
    currentStreak: 0,
    longestStreak: 0,
    lastCheckInDate: '',
    totalCompletions: completedCheckIns.length,
  };

  if (completedCheckIns.length === 0) {
    return streak;
  }

  const today = getTodayString();
  const mostRecentDate = completedCheckIns[0].date;
  streak.lastCheckInDate = mostRecentDate;

  // Check if the streak is active (most recent check-in is today or yesterday)
  const daysSinceLastCheckIn = daysBetween(mostRecentDate, today);

  if (daysSinceLastCheckIn <= 1) {
    // Calculate current streak
    streak.currentStreak = calculateConsecutiveDays(completedCheckIns, 0);
  }

  // Calculate longest streak by checking all possible streaks in history
  streak.longestStreak = findLongestStreak(completedCheckIns);

  // Longest streak should at least be the current streak
  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);

  return streak;
}

/**
 * Calculate consecutive days starting from a specific index
 */
function calculateConsecutiveDays(checkIns: CheckIn[], startIndex: number): number {
  if (checkIns.length === 0) return 0;

  let streak = 1;
  let prevDate = checkIns[startIndex].date;

  for (let i = startIndex + 1; i < checkIns.length; i++) {
    const currentDate = checkIns[i].date;
    const daysDiff = daysBetween(currentDate, prevDate);

    if (daysDiff === 1) {
      streak++;
      prevDate = currentDate;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Find the longest streak in the entire check-in history
 */
function findLongestStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;
  let prevDate = checkIns[0].date;

  for (let i = 1; i < checkIns.length; i++) {
    const currentDate = checkIns[i].date;
    const daysDiff = daysBetween(currentDate, prevDate);

    if (daysDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }

    prevDate = currentDate;
  }

  return longestStreak;
}

/**
 * Check if a habit should be done today based on its frequency
 */
export function isDueToday(habit: Habit): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

  if (habit.frequency === 'daily') {
    return true;
  }

  if (habit.frequency === 'weekly' && habit.targetDays) {
    return habit.targetDays.includes(dayOfWeek);
  }

  // For 'custom' frequency, default to true
  return true;
}

/**
 * Get the next milestone for a streak
 */
export function getNextMilestone(currentStreak: number): number {
  const milestones = [7, 30, 50, 100, 365, 500, 1000];

  for (const milestone of milestones) {
    if (currentStreak < milestone) {
      return milestone;
    }
  }

  // If past all milestones, return next multiple of 100
  return Math.ceil((currentStreak + 1) / 100) * 100;
}

/**
 * Calculate progress percentage to next milestone
 */
export function getProgressToMilestone(currentStreak: number): number {
  const nextMilestone = getNextMilestone(currentStreak);
  const previousMilestone = currentStreak >= 7 ?
    [7, 30, 50, 100, 365, 500, 1000].filter(m => m < nextMilestone).pop() || 0 : 0;

  const progress = ((currentStreak - previousMilestone) / (nextMilestone - previousMilestone)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Check if a streak reached a milestone
 */
export function isAtMilestone(streakCount: number): boolean {
  const milestones = [7, 30, 50, 100, 365, 500, 1000];
  return milestones.includes(streakCount);
}
