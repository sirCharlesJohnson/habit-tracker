import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Habit, CheckIn, Streak } from '../types';

interface HabitState {
  // State
  habits: Habit[];
  checkIns: CheckIn[];
  streaks: Map<string, Streak>;

  // Habit actions
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string) => void;

  // Check-in actions
  toggleCheckIn: (habitId: string, date: string) => void;
  addCheckIn: (checkIn: CheckIn) => void;
  deleteCheckIn: (id: string) => void;
  updateCheckInMood: (id: string, mood: 1 | 2 | 3 | 4 | 5) => void;

  // Streak actions
  updateStreak: (habitId: string, streak: Streak) => void;
  calculateStreaks: () => void;

  // Query helpers
  getHabitById: (id: string) => Habit | undefined;
  getCheckInsByHabitId: (habitId: string) => CheckIn[];
  getCheckInForDate: (habitId: string, date: string) => CheckIn | undefined;
  getStreakByHabitId: (habitId: string) => Streak | undefined;
  getActiveHabits: () => Habit[];
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      // Initial state
      habits: [],
      checkIns: [],
      streaks: new Map(),

      // Habit actions
      addHabit: (habit) =>
        set((state) => ({
          habits: [...state.habits, habit],
        })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          checkIns: state.checkIns.filter((c) => c.habitId !== id),
          streaks: new Map(
            Array.from(state.streaks).filter(([key]) => key !== id)
          ),
        })),

      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archived: true } : h
          ),
        })),

      // Check-in actions
      toggleCheckIn: (habitId, date) => {
        const state = get();
        const existing = state.getCheckInForDate(habitId, date);

        if (existing) {
          // Toggle existing check-in
          set((state) => ({
            checkIns: state.checkIns.map((c) =>
              c.id === existing.id ? { ...c, completed: !c.completed } : c
            ),
          }));
        } else {
          // Create new check-in
          const newCheckIn: CheckIn = {
            id: crypto.randomUUID(),
            habitId,
            date,
            completed: true,
            timestamp: new Date().toISOString(),
          };
          get().addCheckIn(newCheckIn);
        }

        // Recalculate streaks after check-in
        setTimeout(() => get().calculateStreaks(), 0);
      },

      addCheckIn: (checkIn) =>
        set((state) => ({
          checkIns: [...state.checkIns, checkIn],
        })),

      deleteCheckIn: (id) =>
        set((state) => ({
          checkIns: state.checkIns.filter((c) => c.id !== id),
        })),

      updateCheckInMood: (id, mood) =>
        set((state) => ({
          checkIns: state.checkIns.map((c) =>
            c.id === id ? { ...c, mood } : c
          ),
        })),

      // Streak actions
      updateStreak: (habitId, streak) =>
        set((state) => {
          const newStreaks = new Map(state.streaks);
          newStreaks.set(habitId, streak);
          return { streaks: newStreaks };
        }),

      calculateStreaks: () => {
        const state = get();
        const newStreaks = new Map<string, Streak>();

        state.habits.forEach((habit) => {
          const habitCheckIns = state
            .getCheckInsByHabitId(habit.id)
            .filter((c) => c.completed)
            .sort((a, b) => b.date.localeCompare(a.date)); // Sort desc by date

          if (habitCheckIns.length === 0) {
            newStreaks.set(habit.id, {
              habitId: habit.id,
              currentStreak: 0,
              longestStreak: 0,
              lastCheckInDate: '',
              totalCompletions: 0,
            });
            return;
          }

          // Calculate streaks
          let currentStreak = 0;
          let longestStreak = 0;
          let tempStreak = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Check if most recent check-in is today or yesterday
          const mostRecent = new Date(habitCheckIns[0].date);
          mostRecent.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor(
            (today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff <= 1) {
            // Current streak is active
            currentStreak = 1;
            let prevDate = mostRecent;

            for (let i = 1; i < habitCheckIns.length; i++) {
              const checkInDate = new Date(habitCheckIns[i].date);
              checkInDate.setHours(0, 0, 0, 0);
              const diff = Math.floor(
                (prevDate.getTime() - checkInDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              if (diff === 1) {
                currentStreak++;
                prevDate = checkInDate;
              } else {
                break;
              }
            }
          }

          // Calculate longest streak
          tempStreak = 1;
          let prevDate = new Date(habitCheckIns[0].date);
          prevDate.setHours(0, 0, 0, 0);

          for (let i = 1; i < habitCheckIns.length; i++) {
            const checkInDate = new Date(habitCheckIns[i].date);
            checkInDate.setHours(0, 0, 0, 0);
            const diff = Math.floor(
              (prevDate.getTime() - checkInDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            if (diff === 1) {
              tempStreak++;
              longestStreak = Math.max(longestStreak, tempStreak);
            } else {
              tempStreak = 1;
            }
            prevDate = checkInDate;
          }
          longestStreak = Math.max(longestStreak, currentStreak);

          newStreaks.set(habit.id, {
            habitId: habit.id,
            currentStreak,
            longestStreak,
            lastCheckInDate: habitCheckIns[0].date,
            totalCompletions: habitCheckIns.length,
          });
        });

        set({ streaks: newStreaks });
      },

      // Query helpers
      getHabitById: (id) => get().habits.find((h) => h.id === id),

      getCheckInsByHabitId: (habitId) =>
        get().checkIns.filter((c) => c.habitId === habitId),

      getCheckInForDate: (habitId, date) =>
        get().checkIns.find((c) => c.habitId === habitId && c.date === date),

      getStreakByHabitId: (habitId) => get().streaks.get(habitId),

      getActiveHabits: () => get().habits.filter((h) => !h.archived),
    }),
    {
      name: 'habit-tracker-storage',
      partialize: (state) => ({
        habits: state.habits,
        checkIns: state.checkIns,
        streaks: Array.from(state.streaks.entries()),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.streaks)) {
          state.streaks = new Map(state.streaks as [string, Streak][]);
          state.calculateStreaks();
        }
      },
    }
  )
);
