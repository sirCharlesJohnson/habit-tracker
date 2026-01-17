import { useMemo } from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, Calendar, CheckCircle2, Flame } from 'lucide-react';
import { useHabitStore } from '../../store';
import Card from '../common/Card';

interface WeeklySummaryProps {
  weekOffset?: number; // 0 = current week, -1 = last week, etc.
}

export default function WeeklySummary({ weekOffset = 0 }: WeeklySummaryProps) {
  const { habits, checkIns, streaks } = useHabitStore();

  const summary = useMemo(() => {
    const today = new Date();
    const targetDate = subWeeks(today, -weekOffset);
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Start on Monday
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const activeHabits = habits.filter((h) => !h.archived);

    // Get check-ins for this week
    const weekCheckIns = checkIns.filter((c) => {
      const checkInDate = new Date(c.date);
      return checkInDate >= weekStart && checkInDate <= weekEnd && c.completed;
    });

    // Calculate daily completion rates
    const dailyStats = daysInWeek.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayCheckIns = weekCheckIns.filter((c) => c.date === dayStr);
      const completionRate = activeHabits.length > 0
        ? (dayCheckIns.length / activeHabits.length) * 100
        : 0;
      return {
        date: day,
        dayName: format(day, 'EEE'),
        completed: dayCheckIns.length,
        total: activeHabits.length,
        rate: completionRate,
      };
    });

    // Calculate overall stats
    const totalPossible = activeHabits.length * 7;
    const totalCompleted = weekCheckIns.length;
    const overallRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

    // Get previous week for comparison
    const prevWeekStart = subWeeks(weekStart, 1);
    const prevWeekEnd = subWeeks(weekEnd, 1);
    const prevWeekCheckIns = checkIns.filter((c) => {
      const checkInDate = new Date(c.date);
      return checkInDate >= prevWeekStart && checkInDate <= prevWeekEnd && c.completed;
    });
    const prevWeekRate = totalPossible > 0
      ? (prevWeekCheckIns.length / totalPossible) * 100
      : 0;

    // Calculate trend
    const trend = overallRate - prevWeekRate;

    // Best day
    const bestDay = dailyStats.reduce((best, day) =>
      day.rate > best.rate ? day : best
    , dailyStats[0]);

    // Current max streak
    let maxStreak = 0;
    streaks.forEach((streak) => {
      if (streak.currentStreak > maxStreak) {
        maxStreak = streak.currentStreak;
      }
    });

    // Most consistent habit
    const habitCompletions = activeHabits.map((habit) => {
      const count = weekCheckIns.filter((c) => c.habitId === habit.id).length;
      return { habit, count };
    }).sort((a, b) => b.count - a.count);

    return {
      weekStart,
      weekEnd,
      dailyStats,
      totalCompleted,
      totalPossible,
      overallRate,
      trend,
      bestDay,
      maxStreak,
      mostConsistentHabit: habitCompletions[0]?.habit,
      mostConsistentCount: habitCompletions[0]?.count || 0,
    };
  }, [habits, checkIns, streaks, weekOffset]);

  const TrendIcon = summary.trend > 0 ? TrendingUp : summary.trend < 0 ? TrendingDown : Minus;
  const trendColor = summary.trend > 0 ? 'text-green-600' : summary.trend < 0 ? 'text-red-600' : 'text-gray-600';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Summary</h3>
          <p className="text-sm text-gray-600">
            {format(summary.weekStart, 'MMM d')} - {format(summary.weekEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon size={20} />
          <span className="font-medium">
            {summary.trend > 0 ? '+' : ''}{summary.trend.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Overall Completion</span>
          <span className="font-semibold text-gray-900">
            {summary.overallRate.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${summary.overallRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {summary.totalCompleted} of {summary.totalPossible} check-ins completed
        </p>
      </div>

      {/* Daily Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Breakdown</h4>
        <div className="grid grid-cols-7 gap-2">
          {summary.dailyStats.map((day) => (
            <div key={day.dayName} className="text-center">
              <span className="text-xs text-gray-500 block mb-1">{day.dayName}</span>
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium ${
                  day.rate >= 100
                    ? 'bg-green-100 text-green-700'
                    : day.rate >= 50
                    ? 'bg-yellow-100 text-yellow-700'
                    : day.rate > 0
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {day.completed}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 mx-auto mb-1 text-primary-600" />
          <p className="text-xs text-gray-500">Best Day</p>
          <p className="font-medium text-gray-900">{summary.bestDay?.dayName}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
          <p className="text-xs text-gray-500">Max Streak</p>
          <p className="font-medium text-gray-900">{summary.maxStreak} days</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <p className="text-xs text-gray-500">Top Habit</p>
          <p className="font-medium text-gray-900 truncate text-sm">
            {summary.mostConsistentHabit?.name || 'N/A'}
          </p>
        </div>
      </div>
    </Card>
  );
}
