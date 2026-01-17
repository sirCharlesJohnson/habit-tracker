import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, ChevronDown } from 'lucide-react';
import type { Habit } from '../../types';
import { useHabitStore } from '../../store';
import { getTodayString } from '../../utils/dateUtils';
import { isAtMilestone } from '../../features/habits/utils/streakCalculator';
import { celebrateMilestone } from '../../utils/confetti';
import { CHECKIN_MOODS } from '../../utils/constants';
import AnimatedCheckbox from '../common/AnimatedCheckbox';
import StreakDisplay from './StreakDisplay';
import Card from '../common/Card';
import { HabitIcon } from '../common/IconPicker';

interface HabitCheckInProps {
  habit: Habit;
}

export default function HabitCheckIn({ habit }: HabitCheckInProps) {
  const { toggleCheckIn, getCheckInForDate, getStreakByHabitId, updateCheckInMood, updateCheckInNote } = useHabitStore();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');
  const today = getTodayString();

  const checkIn = getCheckInForDate(habit.id, today);
  const isChecked = checkIn?.completed || false;
  const currentMood = checkIn?.mood;
  const currentNote = checkIn?.note || '';
  const streak = getStreakByHabitId(habit.id);

  const handleToggle = () => {
    const wasChecked = isChecked;
    toggleCheckIn(habit.id, today);

    // Show mood picker after checking in
    if (!wasChecked) {
      setShowMoodPicker(true);
    } else {
      setShowMoodPicker(false);
    }

    // Show celebration if checking in and reaching a milestone
    if (!wasChecked && streak) {
      const newStreak = streak.currentStreak + 1;
      if (isAtMilestone(newStreak)) {
        setShowCelebration(true);
        celebrateMilestone(newStreak);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  };

  const handleMoodSelect = (mood: 1 | 2 | 3 | 4 | 5) => {
    if (checkIn) {
      updateCheckInMood(checkIn.id, mood);
    }
    setShowMoodPicker(false);
  };

  const handleOpenNotes = () => {
    setNoteText(currentNote);
    setShowNotes(true);
  };

  const handleSaveNote = () => {
    if (checkIn) {
      updateCheckInNote(checkIn.id, noteText.trim());
    }
    setShowNotes(false);
  };

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <AnimatedCheckbox checked={isChecked} onChange={handleToggle} size="lg" />

            {/* Habit Icon */}
            {habit.icon && (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                <HabitIcon name={habit.icon} size={22} color={habit.color} />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
              {habit.description && (
                <p className="text-sm text-gray-600 mt-1 truncate">{habit.description}</p>
              )}
            </div>
          </div>

          {/* Mood Picker - Shows after checking in */}
          <AnimatePresence>
            {showMoodPicker && isChecked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-11 mt-3 overflow-hidden"
              >
                <p className="text-sm text-gray-600 mb-2">How did it go?</p>
                <div className="flex gap-2">
                  {CHECKIN_MOODS.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood.value as 1 | 2 | 3 | 4 | 5)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all hover:bg-gray-100 ${
                        currentMood === mood.value ? 'bg-primary-100 ring-2 ring-primary-500' : ''
                      }`}
                      title={mood.label}
                    >
                      <span className="text-xl">{mood.emoji}</span>
                      <span className="text-xs text-gray-500 mt-1">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Mood Display (when not picking) */}
          {currentMood && !showMoodPicker && (
            <div className="ml-11 mt-2">
              <button
                onClick={() => setShowMoodPicker(true)}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <span>{CHECKIN_MOODS.find(m => m.value === currentMood)?.emoji}</span>
                <span>{CHECKIN_MOODS.find(m => m.value === currentMood)?.label}</span>
              </button>
            </div>
          )}

          {/* Notes Section */}
          {isChecked && (
            <div className="ml-11 mt-3">
              <AnimatePresence mode="wait">
                {showNotes ? (
                  <motion.div
                    key="notes-editor"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note about today's check-in..."
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={2}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveNote}
                        className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowNotes(false)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="notes-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleOpenNotes}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <MessageSquare size={14} />
                    {currentNote ? (
                      <span className="truncate max-w-[200px]">{currentNote}</span>
                    ) : (
                      <span>Add note</span>
                    )}
                    {currentNote && <ChevronDown size={14} />}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}

          {streak && (
            <div className="mt-4 ml-11">
              <StreakDisplay streak={streak} size="sm" showProgress />
            </div>
          )}
        </div>

        {/* Category badge */}
        <div
          className="px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
          style={{
            backgroundColor: `${habit.color}20`,
            color: habit.color,
          }}
        >
          {habit.category}
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && streak && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-primary-600 bg-opacity-90 z-10"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: 2,
                }}
              >
                <Sparkles className="w-16 h-16 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">
                {streak.currentStreak + 1} Day Streak!
              </h2>
              <p className="text-lg">You're crushing it! Keep going!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
