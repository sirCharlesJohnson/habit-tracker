import type { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Complete a 3-day streak',
    category: 'streak',
    icon: 'Flame',
    color: '#F59E0B',
    requirement: 3,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Complete a 7-day streak',
    category: 'streak',
    icon: 'Flame',
    color: '#F97316',
    requirement: 7,
  },
  {
    id: 'streak-14',
    name: 'Fortnight Fighter',
    description: 'Complete a 14-day streak',
    category: 'streak',
    icon: 'Flame',
    color: '#EF4444',
    requirement: 14,
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Complete a 30-day streak',
    category: 'streak',
    icon: 'Flame',
    color: '#DC2626',
    requirement: 30,
  },
  {
    id: 'streak-100',
    name: 'Century Club',
    description: 'Complete a 100-day streak',
    category: 'streak',
    icon: 'Crown',
    color: '#8B5CF6',
    requirement: 100,
  },
  {
    id: 'streak-365',
    name: 'Year of Dedication',
    description: 'Complete a 365-day streak',
    category: 'streak',
    icon: 'Trophy',
    color: '#F59E0B',
    requirement: 365,
  },

  // Total completions achievements
  {
    id: 'completions-10',
    name: 'First Steps',
    description: 'Complete 10 total check-ins',
    category: 'milestone',
    icon: 'Star',
    color: '#06B6D4',
    requirement: 10,
  },
  {
    id: 'completions-50',
    name: 'Building Momentum',
    description: 'Complete 50 total check-ins',
    category: 'milestone',
    icon: 'Star',
    color: '#3B82F6',
    requirement: 50,
  },
  {
    id: 'completions-100',
    name: 'Century Mark',
    description: 'Complete 100 total check-ins',
    category: 'milestone',
    icon: 'Award',
    color: '#8B5CF6',
    requirement: 100,
  },
  {
    id: 'completions-500',
    name: 'Habit Hero',
    description: 'Complete 500 total check-ins',
    category: 'milestone',
    icon: 'Medal',
    color: '#EC4899',
    requirement: 500,
  },
  {
    id: 'completions-1000',
    name: 'Legendary',
    description: 'Complete 1000 total check-ins',
    category: 'milestone',
    icon: 'Trophy',
    color: '#F59E0B',
    requirement: 1000,
  },

  // Variety achievements
  {
    id: 'habits-3',
    name: 'Diversifying',
    description: 'Create 3 different habits',
    category: 'variety',
    icon: 'Layers',
    color: '#10B981',
    requirement: 3,
  },
  {
    id: 'habits-5',
    name: 'Well Rounded',
    description: 'Create 5 different habits',
    category: 'variety',
    icon: 'Layers',
    color: '#14B8A6',
    requirement: 5,
  },
  {
    id: 'habits-10',
    name: 'Life Optimizer',
    description: 'Create 10 different habits',
    category: 'variety',
    icon: 'Sparkles',
    color: '#6366F1',
    requirement: 10,
  },

  // Special achievements
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: 'Complete all habits for 7 days straight',
    category: 'special',
    icon: 'Zap',
    color: '#F59E0B',
    requirement: 1,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a habit before 6 AM',
    category: 'special',
    icon: 'Sun',
    color: '#F97316',
    requirement: 1,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete a habit after 10 PM',
    category: 'special',
    icon: 'Moon',
    color: '#6366F1',
    requirement: 1,
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}
