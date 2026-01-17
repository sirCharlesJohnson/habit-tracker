import { useMemo } from 'react';
import { Flame, Trophy } from 'lucide-react';
import { useHabitStore, useJournalStore } from '../../store';
import { getTodayString } from '../../utils/dateUtils';

interface RingProps {
  percentage: number;
  radius: number;
  strokeWidth: number;
  color: string;
  bgColor: string;
}

function Ring({ percentage, radius, strokeWidth, color, bgColor }: RingProps) {
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <g>
      {/* Background ring */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Progress ring */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 100 100)"
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
      />
    </g>
  );
}

export default function ActivityRings() {
  const { getActiveHabits, getCheckInForDate, streaks } = useHabitStore();
  const { getEntryByDate } = useJournalStore();

  const today = getTodayString();
  const habits = getActiveHabits();

  const stats = useMemo(() => {
    // Calculate habits completion for today
    let completedToday = 0;
    habits.forEach((habit) => {
      const checkIn = getCheckInForDate(habit.id, today);
      if (checkIn?.completed) completedToday++;
    });
    const habitsPercentage = habits.length > 0
      ? Math.round((completedToday / habits.length) * 100)
      : 0;

    // Calculate best current streak
    let bestStreak = 0;
    streaks.forEach((streak) => {
      if (streak.currentStreak > bestStreak) {
        bestStreak = streak.currentStreak;
      }
    });
    // Streak percentage (cap at 30 days = 100%)
    const streakPercentage = Math.min(100, Math.round((bestStreak / 30) * 100));

    // Get today's mood from journal or check-ins
    const todayJournal = getEntryByDate(today);
    let moodScore = todayJournal?.sentiment?.score || 0;

    // If no journal mood, check habit check-in moods
    if (!moodScore) {
      let totalMood = 0;
      let moodCount = 0;
      habits.forEach((habit) => {
        const checkIn = getCheckInForDate(habit.id, today);
        if (checkIn?.mood) {
          totalMood += checkIn.mood;
          moodCount++;
        }
      });
      moodScore = moodCount > 0 ? Math.round(totalMood / moodCount) : 0;
    }
    const moodPercentage = moodScore > 0 ? (moodScore / 5) * 100 : 0;

    return {
      habitsPercentage,
      completedToday,
      totalHabits: habits.length,
      streakPercentage,
      bestStreak,
      moodPercentage,
      moodScore,
    };
  }, [habits, streaks, today, getCheckInForDate, getEntryByDate]);

  const moodEmojis = ['', '😫', '😕', '😐', '🙂', '😄'];

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white">
      {/* Activity Rings */}
      <div className="flex justify-center mb-4">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Habits Ring (outer) - Blue */}
            <Ring
              percentage={stats.habitsPercentage}
              radius={85}
              strokeWidth={14}
              color="#3B82F6"
              bgColor="#1E3A5F"
            />
            {/* Streak Ring (middle) - Purple */}
            <Ring
              percentage={stats.streakPercentage}
              radius={65}
              strokeWidth={14}
              color="#8B5CF6"
              bgColor="#2D1F5E"
            />
            {/* Mood Ring (inner) - Green */}
            <Ring
              percentage={stats.moodPercentage}
              radius={45}
              strokeWidth={14}
              color="#22C55E"
              bgColor="#14532D"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{stats.habitsPercentage}%</span>
            <span className="text-xs text-gray-400">Habits</span>
          </div>
        </div>
      </div>

      {/* Ring Labels */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-300">Habits</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-gray-300">Streak</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-300">Mood</span>
          {stats.moodScore > 0 && (
            <span className="text-sm">{moodEmojis[stats.moodScore]}</span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Today Stats */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-gray-400 uppercase">Today</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{stats.habitsPercentage}%</span>
            <span className="text-sm text-gray-400">
              {stats.completedToday}/{stats.totalHabits}
            </span>
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-400 uppercase">Best</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{stats.bestStreak}d</span>
            <span className="text-sm text-gray-400">streak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
