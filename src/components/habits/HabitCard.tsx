import { Edit, Trash2, Archive } from 'lucide-react';
import type { Habit } from '../../types';
import { useHabitStore, useUIStore } from '../../store';
import { toast } from '../../store/toastStore';
import Card from '../common/Card';
import StreakDisplay from './StreakDisplay';
import { HabitIcon } from '../common/IconPicker';

interface HabitCardProps {
  habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const { deleteHabit, archiveHabit, getStreakByHabitId } = useHabitStore();
  const { openHabitModal } = useUIStore();
  const streak = getStreakByHabitId(habit.id);

  const handleEdit = () => {
    openHabitModal(habit.id);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      deleteHabit(habit.id);
      toast.success(`Deleted habit: ${habit.name}`);
    }
  };

  const handleArchive = () => {
    archiveHabit(habit.id);
    toast.info(`Archived habit: ${habit.name}`);
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {habit.icon ? (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                <HabitIcon name={habit.icon} size={22} color={habit.color} />
              </div>
            ) : (
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: habit.color }}
              />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
          </div>
          {habit.description && (
            <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
          )}
        </div>

        {/* Category Badge */}
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${habit.color}20`,
            color: habit.color,
          }}
        >
          {habit.category}
        </div>
      </div>

      {/* Frequency Info */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">
          Frequency:{' '}
          <span className="font-medium capitalize">{habit.frequency}</span>
          {habit.frequency === 'weekly' && habit.targetDays && (
            <span className="ml-1">
              ({habit.targetDays.length} days/week)
            </span>
          )}
        </span>
      </div>

      {/* Streak Display */}
      {streak && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <StreakDisplay streak={streak} size="sm" showProgress />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={handleEdit}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          aria-label="Edit habit"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={handleArchive}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Archive habit"
        >
          <Archive size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete habit"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
}
