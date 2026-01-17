import type { HabitCategory } from '../types';

export const HABIT_CATEGORIES: { value: HabitCategory; label: string; color: string }[] = [
  { value: 'health', label: 'Health', color: '#10b981' },
  { value: 'productivity', label: 'Productivity', color: '#0ea5e9' },
  { value: 'learning', label: 'Learning', color: '#8b5cf6' },
  { value: 'mindfulness', label: 'Mindfulness', color: '#f59e0b' },
  { value: 'social', label: 'Social', color: '#ec4899' },
  { value: 'custom', label: 'Custom', color: '#6b7280' },
];

export const HABIT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#10b981', // green
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6b7280', // gray
];

export const STREAK_MILESTONES = [7, 30, 50, 100, 365];

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

export const SENTIMENT_COLORS = {
  'very-negative': '#dc2626',
  'negative': '#f97316',
  'neutral': '#64748b',
  'positive': '#22c55e',
  'very-positive': '#16a34a',
};

export const SENTIMENT_LABELS = {
  'very-negative': 'Very Negative',
  'negative': 'Negative',
  'neutral': 'Neutral',
  'positive': 'Positive',
  'very-positive': 'Very Positive',
};

// Available icons for habits
export const HABIT_ICONS = [
  'Activity',
  'Apple',
  'Award',
  'Battery',
  'BedDouble',
  'Bike',
  'Book',
  'BookOpen',
  'Brain',
  'Briefcase',
  'Calendar',
  'Camera',
  'CheckCircle',
  'CircleDotDashed',
  'CircleGauge',
  'Clock',
  'Code',
  'Coffee',
  'Dumbbell',
  'Flame',
  'Flower2',
  'Footprints',
  'Gift',
  'GlassWater',
  'Glasses',
  'Globe',
  'Gauge',
  'GraduationCap',
  'Guitar',
  'Heart',
  'HeartPulse',
  'Home',
  'Leaf',
  'Lightbulb',
  'Mail',
  'MapPin',
  'Mic',
  'Moon',
  'Mountain',
  'Music',
  'Paintbrush',
  'Pencil',
  'PersonStanding',
  'Phone',
  'Pill',
  'Pizza',
  'Plane',
  'Salad',
  'Smile',
  'Sparkles',
  'Star',
  'Sun',
  'Target',
  'Timer',
  'TreeDeciduous',
  'Trophy',
  'Umbrella',
  'Users',
  'Wallet',
  'Zap',
] as const;

export type HabitIconName = typeof HABIT_ICONS[number];

// Mood options for check-ins
export const CHECKIN_MOODS = [
  { value: 1, emoji: '😫', label: 'Struggled' },
  { value: 2, emoji: '😕', label: 'Difficult' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
] as const;
