import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { useHabitStore } from '../../store';
import Card from '../common/Card';

interface StreakCalendarProps {
  weeks?: number;
}

export default function StreakCalendar({ weeks = 12 }: StreakCalendarProps) {
  const { getActiveHabits, getCheckInsByHabitId } = useHabitStore();
  const habits = getActiveHabits();

  const calendarData = useMemo(() => {
    const data: { date: string; count: number; rate: number }[] = [];
    const today = new Date();
    const days = weeks * 7;

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');

      let completions = 0;
      let totalHabits = 0;

      habits.forEach((habit) => {
        const checkIns = getCheckInsByHabitId(habit.id);
        const dayCheckIn = checkIns.find((c) => c.date === dateString);
        totalHabits++;
        if (dayCheckIn?.completed) completions++;
      });

      const rate = totalHabits > 0 ? completions / totalHabits : 0;

      data.push({ date: dateString, count: completions, rate });
    }

    return data;
  }, [habits, weeks, getCheckInsByHabitId]);

  const getColor = (rate: number) => {
    if (rate === 0) return 'bg-gray-100';
    if (rate < 0.25) return 'bg-green-200';
    if (rate < 0.5) return 'bg-green-300';
    if (rate < 0.75) return 'bg-green-400';
    return 'bg-green-500';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (habits.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
        <p className="text-gray-500 text-center py-8">
          No data to display. Start tracking habits!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Activity Heatmap</h3>
        <p className="text-sm text-gray-600">Last {weeks} weeks</p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          {/* Week day labels */}
          <div className="flex gap-1">
            <div className="w-8"></div>
            {weekDays.map((day) => (
              <div
                key={day}
                className="w-3 text-[10px] text-gray-500 text-center"
              >
                {day[0]}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex gap-1 items-center">
              <div className="w-8 text-xs text-gray-500">
                {weekIndex % 4 === 0 &&
                  format(
                    subDays(new Date(), (weeks - weekIndex - 1) * 7),
                    'MMM'
                  )}
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const dataIndex = weekIndex * 7 + dayIndex;
                const dayData = calendarData[dataIndex];

                if (!dayData) {
                  return (
                    <div
                      key={dayIndex}
                      className="w-3 h-3 rounded-sm bg-gray-50"
                    />
                  );
                }

                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getColor(
                      dayData.rate
                    )} hover:ring-2 hover:ring-primary-400 transition-all cursor-pointer`}
                    title={`${format(
                      new Date(dayData.date),
                      'MMM d, yyyy'
                    )}: ${dayData.count} completions`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-300" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
          </div>
          <span>More</span>
        </div>
      </div>
    </Card>
  );
}
