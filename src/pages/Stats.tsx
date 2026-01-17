import { useMemo } from 'react';
import { Trophy, Target, Flame, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useHabitStore, useJournalStore } from '../store';
import CompletionChart from '../components/stats/CompletionChart';
import StreakCalendar from '../components/stats/StreakCalendar';
import Card from '../components/common/Card';

export default function Stats() {
  const { getActiveHabits, getCheckInsByHabitId, streaks } = useHabitStore();
  const { entries } = useJournalStore();

  const habits = getActiveHabits();

  // Calculate overall stats
  const stats = useMemo(() => {
    const totalHabits = habits.length;

    // Calculate longest streak across all habits
    let longestStreak = 0;
    let currentBestStreak = 0;
    let bestHabitName = '';

    streaks.forEach((streak, habitId) => {
      if (streak.longestStreak > longestStreak) {
        longestStreak = streak.longestStreak;
        const habit = habits.find((h) => h.id === habitId);
        if (habit) bestHabitName = habit.name;
      }
      if (streak.currentStreak > currentBestStreak) {
        currentBestStreak = streak.currentStreak;
      }
    });

    // Calculate completion rate for last 30 days
    const today = new Date();
    let totalPossible = 0;
    let totalCompleted = 0;

    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');

      habits.forEach((habit) => {
        const checkIns = getCheckInsByHabitId(habit.id);
        const dayCheckIn = checkIns.find((c) => c.date === dateString);
        totalPossible++;
        if (dayCheckIn?.completed) totalCompleted++;
      });
    }

    const completionRate = totalPossible > 0
      ? Math.round((totalCompleted / totalPossible) * 100)
      : 0;

    // Calculate total completions
    let allTimeCompletions = 0;
    streaks.forEach((streak) => {
      allTimeCompletions += streak.totalCompletions;
    });

    return {
      totalHabits,
      completionRate,
      longestStreak,
      currentBestStreak,
      bestHabitName,
      allTimeCompletions,
      journalEntries: entries.length,
    };
  }, [habits, streaks, entries, getCheckInsByHabitId]);

  // Calculate per-habit stats
  const habitStats = useMemo(() => {
    return habits.map((habit) => {
      const streak = streaks.get(habit.id);
      const checkIns = getCheckInsByHabitId(habit.id);
      const completedCheckIns = checkIns.filter((c) => c.completed);

      return {
        habit,
        currentStreak: streak?.currentStreak || 0,
        longestStreak: streak?.longestStreak || 0,
        totalCompletions: streak?.totalCompletions || 0,
        checkInsCount: completedCheckIns.length,
      };
    }).sort((a, b) => b.currentStreak - a.currentStreak);
  }, [habits, streaks, getCheckInsByHabitId]);

  // Calculate mood distribution
  const moodStats = useMemo(() => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalMoods = 0;
    let sumMoods = 0;

    entries.forEach((entry) => {
      if (entry.sentiment?.score) {
        distribution[entry.sentiment.score]++;
        sumMoods += entry.sentiment.score;
        totalMoods++;
      }
    });

    return {
      distribution,
      average: totalMoods > 0 ? (sumMoods / totalMoods).toFixed(1) : null,
      total: totalMoods,
    };
  }, [entries]);

  const moodLabels = ['', 'Very Low', 'Low', 'Neutral', 'Good', 'Great'];
  const moodColors = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-600 mt-2">Visualize your progress and achievements</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Habits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHabits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">30-Day Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.longestStreak} days</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.allTimeCompletions}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CompletionChart days={30} />
        <StreakCalendar weeks={12} />
      </div>

      {/* Per-Habit Performance */}
      {habitStats.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Habit Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habitStats.map(({ habit, currentStreak, longestStreak, totalCompletions }) => (
              <Card key={habit.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <h3 className="font-medium text-gray-900 truncate">{habit.name}</h3>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {habit.category}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-orange-600">{currentStreak}</p>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600">{longestStreak}</p>
                    <p className="text-xs text-gray-500">Best</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{totalCompletions}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Journal & Mood Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold">Journal Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">{stats.journalEntries}</p>
              <p className="text-sm text-gray-600">Total Entries</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">{moodStats.total}</p>
              <p className="text-sm text-gray-600">With Mood Data</p>
            </div>
          </div>
          {moodStats.average && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold text-purple-600">
                {moodStats.average} / 5
              </p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold">Mood Distribution</h3>
          </div>
          {moodStats.total > 0 ? (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((score) => {
                const count = moodStats.distribution[score as 1 | 2 | 3 | 4 | 5];
                const percentage = moodStats.total > 0
                  ? Math.round((count / moodStats.total) * 100)
                  : 0;
                return (
                  <div key={score} className="flex items-center gap-3">
                    <span className="w-16 text-sm text-gray-600">{moodLabels[score]}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${moodColors[score]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-gray-600 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No mood data yet.</p>
              <p className="text-sm mt-1">Write journal entries to track your mood!</p>
            </div>
          )}
        </Card>
      </div>

      {/* Empty State */}
      {habits.length === 0 && entries.length === 0 && (
        <Card className="p-12 text-center mt-8">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
          <p className="text-gray-600">
            Start tracking habits and writing journal entries to see your statistics here!
          </p>
        </Card>
      )}
    </div>
  );
}
