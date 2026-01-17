import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Sparkles } from 'lucide-react';
import { formatLongDate, getTodayString } from '../utils/dateUtils';
import { useHabitStore, useJournalStore, useUIStore, useCoachingStore } from '../store';
import { isDueToday } from '../features/habits/utils/streakCalculator';
import HabitCheckIn from '../components/habits/HabitCheckIn';
import JournalEntry from '../components/journal/JournalEntry';
import CoachingCard from '../components/ai/CoachingCard';
import ActivityRings from '../components/stats/ActivityRings';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import HabitForm from '../components/habits/HabitForm';
import MoodInput from '../components/journal/MoodInput';

export default function Home() {
  const { getActiveHabits, calculateStreaks, getHabitById } = useHabitStore();
  const { getEntryByDate, getEntryById } = useJournalStore();
  const { getUnreadMessages } = useCoachingStore();
  const {
    isHabitModalOpen,
    isJournalModalOpen,
    editingHabitId,
    editingJournalId,
    openHabitModal,
    closeHabitModal,
    openJournalModal,
    closeJournalModal,
  } = useUIStore();

  const activeHabits = getActiveHabits();
  const todaysHabits = activeHabits.filter(isDueToday);
  const today = formatLongDate(new Date());
  const todayString = getTodayString();

  // Get today's journal entry
  const todaysJournalEntry = getEntryByDate(todayString);

  // Get latest unread coaching message
  const unreadCoaching = getUnreadMessages();
  const latestCoaching = unreadCoaching.length > 0 ? unreadCoaching[0] : null;

  // Calculate streaks on mount
  useEffect(() => {
    calculateStreaks();
  }, [calculateStreaks]);

  const editingHabit = editingHabitId ? getHabitById(editingHabitId) : undefined;
  const editingJournal = editingJournalId ? getEntryById(editingJournalId) : undefined;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Today</h1>
        <p className="text-gray-600">{today}</p>
      </div>

      {/* Activity Rings */}
      <section className="mb-8">
        <ActivityRings />
      </section>

      {/* AI Coaching Preview */}
      {latestCoaching && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-purple-600" size={20} />
              <h2 className="text-xl font-semibold">AI Coaching</h2>
            </div>
            <Link
              to="/coaching"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all messages →
            </Link>
          </div>
          <CoachingCard message={latestCoaching} showActions={false} />
        </section>
      )}

      {/* Today's Habits */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Habits</h2>
          <Button size="sm" onClick={() => openHabitModal()}>
            <Plus size={16} className="mr-1" />
            New Habit
          </Button>
        </div>

        {todaysHabits.length > 0 ? (
          <div className="space-y-4">
            {todaysHabits.map((habit) => (
              <HabitCheckIn key={habit.id} habit={habit} />
            ))}
          </div>
        ) : activeHabits.length > 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">No habits scheduled for today</p>
            <Link to="/habits" className="text-primary-600 hover:text-primary-700 font-medium">
              View all habits →
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">No habits yet. Create one to get started!</p>
            <Button onClick={() => openHabitModal()}>
              <Plus size={18} className="mr-2" />
              Create Your First Habit
            </Button>
          </div>
        )}
      </section>

      {/* Today's Journal */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="text-gray-700" size={20} />
            <h2 className="text-xl font-semibold">Today's Journal</h2>
          </div>
          {todaysJournalEntry && (
            <Link
              to="/journal"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all entries →
            </Link>
          )}
        </div>

        {todaysJournalEntry ? (
          <JournalEntry entry={todaysJournalEntry} />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                Take a moment to reflect on your day
              </p>
              <Button onClick={() => openJournalModal()}>
                <Plus size={18} className="mr-2" />
                Write Journal Entry
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Habit Modal */}
      <Modal
        isOpen={isHabitModalOpen}
        onClose={closeHabitModal}
        title={editingHabit ? 'Edit Habit' : 'Create New Habit'}
        size="lg"
      >
        <HabitForm habit={editingHabit} onClose={closeHabitModal} />
      </Modal>

      {/* Journal Modal */}
      <Modal
        isOpen={isJournalModalOpen}
        onClose={closeJournalModal}
        title={editingJournal ? 'Edit Journal Entry' : 'New Journal Entry'}
        size="lg"
      >
        <MoodInput entry={editingJournal} onClose={closeJournalModal} />
      </Modal>
    </div>
  );
}
