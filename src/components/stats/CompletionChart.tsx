import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { useHabitStore } from '../../store';
import Card from '../common/Card';

interface CompletionChartProps {
  days?: number;
}

export default function CompletionChart({ days = 30 }: CompletionChartProps) {
  const { getActiveHabits, getCheckInsByHabitId } = useHabitStore();
  const habits = getActiveHabits();

  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayLabel = format(date, 'MMM d');

      // Count completions for this day
      let completions = 0;
      let totalHabits = 0;

      habits.forEach((habit) => {
        const checkIns = getCheckInsByHabitId(habit.id);
        const dayCheckIn = checkIns.find((c) => c.date === dateString);

        totalHabits++;
        if (dayCheckIn?.completed) {
          completions++;
        }
      });

      const completionRate = totalHabits > 0 ? (completions / totalHabits) * 100 : 0;

      data.push({
        date: dayLabel,
        completions,
        rate: Math.round(completionRate),
        total: totalHabits,
      });
    }

    return data;
  }, [habits, days, getCheckInsByHabitId]);

  if (habits.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Completion Trend</h3>
        <p className="text-gray-500 text-center py-8">
          No habits to display. Create some habits to see your progress!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Completion Trend</h3>
        <p className="text-sm text-gray-600">Last {days} days</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
            }}
            formatter={(value, name) => {
              if (name === 'rate') return [`${value}%`, 'Completion Rate'];
              if (name === 'completions') return [value, 'Completions'];
              return [value, name];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ fill: '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
            name="Completion Rate"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
