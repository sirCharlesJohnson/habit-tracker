import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import { useHabitStore } from '../../store';
import Card from '../common/Card';
import { HabitIcon } from '../common/IconPicker';

export default function ArchivedHabits() {
  const { habits, updateHabit, deleteHabit } = useHabitStore();

  const archivedHabits = habits.filter((h) => h.archived);

  const handleRestore = (habitId: string) => {
    updateHabit(habitId, { archived: false });
  };

  const handleDelete = (habitId: string, habitName: string) => {
    if (confirm(`Are you sure you want to permanently delete "${habitName}"? This action cannot be undone.`)) {
      deleteHabit(habitId);
    }
  };

  if (archivedHabits.length === 0) {
    return (
      <div className="text-center py-12">
        <Archive className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Archived Habits</h3>
        <p className="text-gray-600">
          When you archive a habit, it will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        {archivedHabits.length} archived habit{archivedHabits.length !== 1 ? 's' : ''}
      </p>

      {archivedHabits.map((habit) => (
        <Card key={habit.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {habit.icon && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center opacity-60"
                  style={{ backgroundColor: `${habit.color}20` }}
                >
                  <HabitIcon name={habit.icon} size={20} color={habit.color} />
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-700">{habit.name}</h4>
                {habit.description && (
                  <p className="text-sm text-gray-500">{habit.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Created {new Date(habit.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRestore(habit.id)}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Restore habit"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={() => handleDelete(habit.id, habit.name)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete permanently"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
