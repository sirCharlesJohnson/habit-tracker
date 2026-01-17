import { useEffect, useState } from 'react';
import { Plus, Filter, LayoutTemplate, Archive } from 'lucide-react';
import { useHabitStore, useUIStore } from '../store';
import type { HabitCategory } from '../types';
import { HABIT_CATEGORIES } from '../utils/constants';
import HabitCard from '../components/habits/HabitCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import HabitForm from '../components/habits/HabitForm';
import HabitTemplates from '../components/habits/HabitTemplates';
import ArchivedHabits from '../components/habits/ArchivedHabits';

export default function Habits() {
  const { getActiveHabits, calculateStreaks, getHabitById, habits } = useHabitStore();
  const { isHabitModalOpen, editingHabitId, openHabitModal, closeHabitModal } = useUIStore();
  const [filterCategory, setFilterCategory] = useState<HabitCategory | 'all'>('all');
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isArchivedOpen, setIsArchivedOpen] = useState(false);

  const archivedCount = habits.filter((h) => h.archived).length;

  const allHabits = getActiveHabits();
  const filteredHabits =
    filterCategory === 'all'
      ? allHabits
      : allHabits.filter((h) => h.category === filterCategory);

  // Calculate streaks on mount
  useEffect(() => {
    calculateStreaks();
  }, [calculateStreaks]);

  const editingHabit = editingHabitId ? getHabitById(editingHabitId) : undefined;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Habits</h1>
            <p className="text-gray-600 mt-2">
              Manage your habits and track your progress
            </p>
          </div>
          <div className="flex gap-2">
            {archivedCount > 0 && (
              <Button variant="secondary" onClick={() => setIsArchivedOpen(true)}>
                <Archive size={18} className="mr-2" />
                Archived ({archivedCount})
              </Button>
            )}
            <Button variant="secondary" onClick={() => setIsTemplatesOpen(true)}>
              <LayoutTemplate size={18} className="mr-2" />
              Templates
            </Button>
            <Button onClick={() => openHabitModal()}>
              <Plus size={18} className="mr-2" />
              New Habit
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 flex-wrap">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter size={16} />
            <span>Filter:</span>
          </div>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({allHabits.length})
          </button>
          {HABIT_CATEGORIES.map((cat) => {
            const count = allHabits.filter((h) => h.category === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterCategory === cat.value
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor:
                    filterCategory === cat.value ? cat.color : undefined,
                }}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      ) : allHabits.length > 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No habits in this category.{' '}
            <button
              onClick={() => setFilterCategory('all')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all habits
            </button>
          </p>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No habits yet. Create your first one!</p>
          <Button onClick={() => openHabitModal()}>
            <Plus size={18} className="mr-2" />
            Create Your First Habit
          </Button>
        </div>
      )}

      {/* Habit Modal */}
      <Modal
        isOpen={isHabitModalOpen}
        onClose={closeHabitModal}
        title={editingHabit ? 'Edit Habit' : 'Create New Habit'}
        size="lg"
      >
        <HabitForm habit={editingHabit} onClose={closeHabitModal} />
      </Modal>

      {/* Templates Modal */}
      <Modal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        title="Habit Templates"
        size="lg"
      >
        <HabitTemplates onSelect={() => setIsTemplatesOpen(false)} />
      </Modal>

      {/* Archived Habits Modal */}
      <Modal
        isOpen={isArchivedOpen}
        onClose={() => setIsArchivedOpen(false)}
        title="Archived Habits"
        size="lg"
      >
        <ArchivedHabits />
      </Modal>
    </div>
  );
}
