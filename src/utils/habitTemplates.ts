import type { HabitCategory, HabitFrequency } from '../types';

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetDays?: number[];
  color: string;
  icon: string;
}

export interface TemplateCategory {
  name: string;
  emoji: string;
  templates: HabitTemplate[];
}

export const HABIT_TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    name: 'Morning Routine',
    emoji: '🌅',
    templates: [
      {
        id: 'morning-meditation',
        name: 'Morning Meditation',
        description: '10 minutes of mindfulness to start the day',
        category: 'mindfulness',
        frequency: 'daily',
        color: '#8B5CF6',
        icon: 'Brain',
      },
      {
        id: 'make-bed',
        name: 'Make Your Bed',
        description: 'Start the day with a small win',
        category: 'productivity',
        frequency: 'daily',
        color: '#0EA5E9',
        icon: 'BedDouble',
      },
      {
        id: 'morning-journal',
        name: 'Morning Journal',
        description: 'Write 3 things you\'re grateful for',
        category: 'mindfulness',
        frequency: 'daily',
        color: '#F59E0B',
        icon: 'BookOpen',
      },
      {
        id: 'healthy-breakfast',
        name: 'Healthy Breakfast',
        description: 'Eat a nutritious breakfast',
        category: 'health',
        frequency: 'daily',
        color: '#10B981',
        icon: 'Apple',
      },
    ],
  },
  {
    name: 'Fitness',
    emoji: '💪',
    templates: [
      {
        id: 'treadmill-run',
        name: 'Treadmill Run',
        description: '30 minutes on the treadmill',
        category: 'health',
        frequency: 'daily',
        color: '#EF4444',
        icon: 'Footprints',
      },
      {
        id: 'strength-training',
        name: 'Strength Training',
        description: 'Weight lifting or bodyweight exercises',
        category: 'health',
        frequency: 'daily',
        targetDays: [1, 3, 5], // Mon, Wed, Fri
        color: '#EF4444',
        icon: 'Dumbbell',
      },
      {
        id: 'daily-walk',
        name: '10,000 Steps',
        description: 'Walk at least 10,000 steps',
        category: 'health',
        frequency: 'daily',
        color: '#22C55E',
        icon: 'Footprints',
      },
      {
        id: 'stretching',
        name: 'Stretching',
        description: '10 minutes of stretching',
        category: 'health',
        frequency: 'daily',
        color: '#EC4899',
        icon: 'PersonStanding',
      },
      {
        id: 'cycling',
        name: 'Cycling',
        description: '30 minutes of cycling',
        category: 'health',
        frequency: 'weekly',
        targetDays: [0, 6], // Weekend
        color: '#F97316',
        icon: 'Bike',
      },
    ],
  },
  {
    name: 'Health & Wellness',
    emoji: '🏥',
    templates: [
      {
        id: 'drink-water',
        name: 'Drink 8 Glasses of Water',
        description: 'Stay hydrated throughout the day',
        category: 'health',
        frequency: 'daily',
        color: '#06B6D4',
        icon: 'GlassWater',
      },
      {
        id: 'take-vitamins',
        name: 'Take Vitamins',
        description: 'Daily vitamins and supplements',
        category: 'health',
        frequency: 'daily',
        color: '#F59E0B',
        icon: 'Pill',
      },
      {
        id: 'sleep-8-hours',
        name: 'Sleep 8 Hours',
        description: 'Get a full night\'s rest',
        category: 'health',
        frequency: 'daily',
        color: '#6366F1',
        icon: 'Moon',
      },
      {
        id: 'no-junk-food',
        name: 'No Junk Food',
        description: 'Avoid processed and junk food',
        category: 'health',
        frequency: 'daily',
        color: '#10B981',
        icon: 'Salad',
      },
    ],
  },
  {
    name: 'Learning & Growth',
    emoji: '📚',
    templates: [
      {
        id: 'read-20-min',
        name: 'Read for 20 Minutes',
        description: 'Read books or educational content',
        category: 'learning',
        frequency: 'daily',
        color: '#8B5CF6',
        icon: 'Book',
      },
      {
        id: 'learn-language',
        name: 'Language Practice',
        description: '15 minutes of language learning',
        category: 'learning',
        frequency: 'daily',
        color: '#3B82F6',
        icon: 'Globe',
      },
      {
        id: 'coding-practice',
        name: 'Coding Practice',
        description: 'Practice coding for 30 minutes',
        category: 'learning',
        frequency: 'daily',
        color: '#10B981',
        icon: 'Code',
      },
      {
        id: 'online-course',
        name: 'Online Course',
        description: 'Complete one lesson from an online course',
        category: 'learning',
        frequency: 'daily',
        color: '#F59E0B',
        icon: 'GraduationCap',
      },
    ],
  },
  {
    name: 'Productivity',
    emoji: '⚡',
    templates: [
      {
        id: 'plan-day',
        name: 'Plan Your Day',
        description: 'Write down your top 3 priorities',
        category: 'productivity',
        frequency: 'daily',
        color: '#0EA5E9',
        icon: 'Target',
      },
      {
        id: 'inbox-zero',
        name: 'Inbox Zero',
        description: 'Clear your email inbox',
        category: 'productivity',
        frequency: 'daily',
        color: '#6366F1',
        icon: 'Mail',
      },
      {
        id: 'weekly-review',
        name: 'Weekly Review',
        description: 'Review your week and plan the next',
        category: 'productivity',
        frequency: 'weekly',
        targetDays: [0], // Sunday
        color: '#F59E0B',
        icon: 'Calendar',
      },
      {
        id: 'no-social-media',
        name: 'No Social Media',
        description: 'Stay off social media for the day',
        category: 'productivity',
        frequency: 'daily',
        color: '#EF4444',
        icon: 'Phone',
      },
    ],
  },
  {
    name: 'Mindfulness',
    emoji: '🧘',
    templates: [
      {
        id: 'gratitude',
        name: 'Gratitude Practice',
        description: 'Write 3 things you\'re grateful for',
        category: 'mindfulness',
        frequency: 'daily',
        color: '#EC4899',
        icon: 'Heart',
      },
      {
        id: 'deep-breathing',
        name: 'Deep Breathing',
        description: '5 minutes of breathing exercises',
        category: 'mindfulness',
        frequency: 'daily',
        color: '#06B6D4',
        icon: 'Activity',
      },
      {
        id: 'nature-time',
        name: 'Time in Nature',
        description: 'Spend 20 minutes outdoors',
        category: 'mindfulness',
        frequency: 'daily',
        color: '#22C55E',
        icon: 'TreeDeciduous',
      },
      {
        id: 'digital-detox',
        name: 'Digital Detox Hour',
        description: 'One hour without screens before bed',
        category: 'mindfulness',
        frequency: 'daily',
        color: '#8B5CF6',
        icon: 'Moon',
      },
    ],
  },
  {
    name: 'Social',
    emoji: '👥',
    templates: [
      {
        id: 'call-friend',
        name: 'Call a Friend/Family',
        description: 'Connect with someone you care about',
        category: 'social',
        frequency: 'weekly',
        targetDays: [0, 6], // Weekend
        color: '#EC4899',
        icon: 'Phone',
      },
      {
        id: 'random-kindness',
        name: 'Random Act of Kindness',
        description: 'Do something nice for someone',
        category: 'social',
        frequency: 'daily',
        color: '#F59E0B',
        icon: 'Gift',
      },
      {
        id: 'family-time',
        name: 'Quality Family Time',
        description: 'Spend dedicated time with family',
        category: 'social',
        frequency: 'daily',
        color: '#EF4444',
        icon: 'Users',
      },
    ],
  },
];

export function getAllTemplates(): HabitTemplate[] {
  return HABIT_TEMPLATE_CATEGORIES.flatMap((cat) => cat.templates);
}

export function getTemplateById(id: string): HabitTemplate | undefined {
  return getAllTemplates().find((t) => t.id === id);
}
