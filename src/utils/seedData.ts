import { format, subDays } from 'date-fns';
import type { Habit, CheckIn, Streak, JournalEntry, MoodScore } from '../types';

// Generate sample habits
export function generateSampleHabits(): Habit[] {
  return [
    {
      id: 'habit-1',
      name: 'Morning Meditation',
      description: '10 minutes of mindfulness to start the day',
      category: 'mindfulness',
      frequency: 'daily',
      color: '#8b5cf6',
      createdAt: subDays(new Date(), 45).toISOString(),
      archived: false,
    },
    {
      id: 'habit-2',
      name: 'Exercise',
      description: '30 minutes of physical activity',
      category: 'health',
      frequency: 'daily',
      color: '#ef4444',
      createdAt: subDays(new Date(), 30).toISOString(),
      archived: false,
    },
    {
      id: 'habit-3',
      name: 'Read for 20 minutes',
      description: 'Read books or articles to learn something new',
      category: 'learning',
      frequency: 'daily',
      color: '#3b82f6',
      createdAt: subDays(new Date(), 60).toISOString(),
      archived: false,
    },
    {
      id: 'habit-4',
      name: 'Drink 8 glasses of water',
      description: 'Stay hydrated throughout the day',
      category: 'health',
      frequency: 'daily',
      color: '#06b6d4',
      createdAt: subDays(new Date(), 20).toISOString(),
      archived: false,
    },
    {
      id: 'habit-5',
      name: 'Weekly Review',
      description: 'Reflect on the week and plan ahead',
      category: 'productivity',
      frequency: 'weekly',
      targetDays: [0], // Sunday
      color: '#f59e0b',
      createdAt: subDays(new Date(), 40).toISOString(),
      archived: false,
    },
  ];
}

// Generate sample check-ins with realistic patterns
export function generateSampleCheckIns(habits: Habit[]): CheckIn[] {
  const checkIns: CheckIn[] = [];
  const today = new Date();

  habits.forEach((habit) => {
    // Different completion rates for different habits
    const completionRates: Record<string, number> = {
      'habit-1': 0.85, // Meditation - very consistent
      'habit-2': 0.65, // Exercise - moderate
      'habit-3': 0.75, // Reading - good
      'habit-4': 0.90, // Water - excellent
      'habit-5': 0.80, // Weekly review - good
    };

    const rate = completionRates[habit.id] || 0.7;
    const daysToGenerate = 60;

    for (let i = 0; i < daysToGenerate; i++) {
      const date = subDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');

      // Skip future dates relative to habit creation
      if (date < new Date(habit.createdAt)) continue;

      // For weekly habits, only check on target days
      if (habit.frequency === 'weekly' && habit.targetDays) {
        if (!habit.targetDays.includes(date.getDay())) continue;
      }

      // Random completion based on rate, with streak patterns
      const isCompleted = Math.random() < rate;

      if (isCompleted) {
        checkIns.push({
          id: `checkin-${habit.id}-${dateString}`,
          habitId: habit.id,
          date: dateString,
          completed: true,
          timestamp: date.toISOString(),
        });
      }
    }
  });

  return checkIns;
}

// Generate sample journal entries
export function generateSampleJournalEntries(): JournalEntry[] {
  const entries: JournalEntry[] = [];
  const today = new Date();

  const sampleContent = [
    { content: "Had a great start to the day with meditation. Feeling focused and ready to tackle my tasks.", mood: 5 as MoodScore },
    { content: "Struggled to stay motivated today, but managed to get my workout in. Small wins matter.", mood: 3 as MoodScore },
    { content: "Finished reading an amazing chapter. Learning about new concepts is exciting!", mood: 4 as MoodScore },
    { content: "Felt a bit overwhelmed with work. Need to prioritize better tomorrow.", mood: 2 as MoodScore },
    { content: "Perfect day! Hit all my habits and had quality time with family.", mood: 5 as MoodScore },
    { content: "Missed my morning routine due to early meeting. Getting back on track.", mood: 3 as MoodScore },
    { content: "Grateful for the progress I've made this week. Consistency is key.", mood: 4 as MoodScore },
    { content: "Challenging day but I showed up for myself. That's what counts.", mood: 3 as MoodScore },
    { content: "Energy levels were low today. Prioritizing rest tonight.", mood: 2 as MoodScore },
    { content: "Celebrated a small milestone - 7 day streak on meditation!", mood: 5 as MoodScore },
  ];

  // Generate entries for the last 30 days (not every day)
  for (let i = 0; i < 30; i++) {
    // ~60% chance of having an entry each day
    if (Math.random() > 0.6) continue;

    const date = subDays(today, i);
    const dateString = format(date, 'yyyy-MM-dd');
    const sample = sampleContent[Math.floor(Math.random() * sampleContent.length)];

    entries.push({
      id: `journal-${dateString}`,
      date: dateString,
      content: sample.content,
      sentiment: {
        score: sample.mood,
        label: sample.mood >= 4 ? 'positive' : sample.mood === 3 ? 'neutral' : 'negative',
        confidence: 0.85 + Math.random() * 0.1,
        analyzedAt: date.toISOString(),
      },
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

// Calculate streaks from check-ins
export function calculateStreaksFromCheckIns(
  habits: Habit[],
  checkIns: CheckIn[]
): [string, Streak][] {
  const streaks: [string, Streak][] = [];

  habits.forEach((habit) => {
    const habitCheckIns = checkIns
      .filter((c) => c.habitId === habit.id && c.completed)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (habitCheckIns.length === 0) {
      streaks.push([
        habit.id,
        {
          habitId: habit.id,
          currentStreak: 0,
          longestStreak: 0,
          lastCheckInDate: '',
          totalCompletions: 0,
        },
      ]);
      return;
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mostRecent = new Date(habitCheckIns[0].date);
    mostRecent.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor(
      (today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 1) {
      currentStreak = 1;
      let prevDate = mostRecent;

      for (let i = 1; i < habitCheckIns.length; i++) {
        const checkInDate = new Date(habitCheckIns[i].date);
        checkInDate.setHours(0, 0, 0, 0);
        const diff = Math.floor(
          (prevDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
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
    let longestStreak = 1;
    let tempStreak = 1;
    let prevDate = new Date(habitCheckIns[0].date);
    prevDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < habitCheckIns.length; i++) {
      const checkInDate = new Date(habitCheckIns[i].date);
      checkInDate.setHours(0, 0, 0, 0);
      const diff = Math.floor(
        (prevDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
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

    streaks.push([
      habit.id,
      {
        habitId: habit.id,
        currentStreak,
        longestStreak,
        lastCheckInDate: habitCheckIns[0].date,
        totalCompletions: habitCheckIns.length,
      },
    ]);
  });

  return streaks;
}

// Seed all data to localStorage
export function seedSampleData(): void {
  const habits = generateSampleHabits();
  const checkIns = generateSampleCheckIns(habits);
  const streaks = calculateStreaksFromCheckIns(habits, checkIns);
  const journalEntries = generateSampleJournalEntries();

  // Save to habit store
  const habitData = {
    state: {
      habits,
      checkIns,
      streaks,
    },
    version: 0,
  };
  localStorage.setItem('habit-tracker-storage', JSON.stringify(habitData));

  // Save to journal store
  const journalData = {
    state: {
      entries: journalEntries,
    },
    version: 0,
  };
  localStorage.setItem('journal-tracker-storage', JSON.stringify(journalData));

  console.log('Sample data seeded successfully!');
  console.log(`- ${habits.length} habits`);
  console.log(`- ${checkIns.length} check-ins`);
  console.log(`- ${journalEntries.length} journal entries`);
  console.log('Refresh the page to see the data.');
}

// Clear all data
export function clearAllData(): void {
  localStorage.removeItem('habit-tracker-storage');
  localStorage.removeItem('journal-tracker-storage');
  localStorage.removeItem('coaching-storage');
  console.log('All data cleared. Refresh the page.');
}

// Create a single habit quickly
export function createTreadmillHabit(): void {
  const habit: Habit = {
    id: crypto.randomUUID(),
    name: 'Treadmill Run',
    description: '30 minutes on the treadmill',
    category: 'health',
    frequency: 'daily',
    color: '#ef4444',
    icon: 'Footprints',
    createdAt: new Date().toISOString(),
    archived: false,
  };

  // Get existing data
  const existingData = localStorage.getItem('habit-tracker-storage');
  let habits: Habit[] = [];
  let checkIns: CheckIn[] = [];
  let streaks: [string, Streak][] = [];

  if (existingData) {
    const parsed = JSON.parse(existingData);
    habits = parsed.state?.habits || [];
    checkIns = parsed.state?.checkIns || [];
    streaks = parsed.state?.streaks || [];
  }

  // Add new habit
  habits.push(habit);

  // Save back
  const newData = {
    state: { habits, checkIns, streaks },
    version: 0,
  };
  localStorage.setItem('habit-tracker-storage', JSON.stringify(newData));

  console.log('Created treadmill habit! Refresh the page to see it.');
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as unknown as {
    seedSampleData: typeof seedSampleData;
    clearAllData: typeof clearAllData;
    createTreadmillHabit: typeof createTreadmillHabit;
  }).seedSampleData = seedSampleData;
  (window as unknown as { clearAllData: typeof clearAllData }).clearAllData = clearAllData;
  (window as unknown as { createTreadmillHabit: typeof createTreadmillHabit }).createTreadmillHabit = createTreadmillHabit;
}
