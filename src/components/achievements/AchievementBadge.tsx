import { motion } from 'framer-motion';
import { HabitIcon } from '../common/IconPicker';
import type { Achievement } from '../../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function AchievementBadge({
  achievement,
  isUnlocked,
  unlockedAt,
  size = 'md',
  showDetails = true,
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36,
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex flex-col items-center ${showDetails ? 'gap-2' : ''}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative ${
          isUnlocked
            ? 'bg-gradient-to-br shadow-lg'
            : 'bg-gray-200 opacity-50'
        }`}
        style={
          isUnlocked
            ? {
                background: `linear-gradient(135deg, ${achievement.color}40, ${achievement.color}80)`,
                boxShadow: `0 4px 14px ${achievement.color}40`,
              }
            : undefined
        }
      >
        <HabitIcon
          name={achievement.icon}
          size={iconSizes[size]}
          color={isUnlocked ? achievement.color : '#9CA3AF'}
        />
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-gray-400 rotate-45" />
          </div>
        )}
      </div>

      {showDetails && (
        <div className="text-center">
          <p
            className={`font-medium ${
              isUnlocked ? 'text-gray-900' : 'text-gray-400'
            } ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
          >
            {achievement.name}
          </p>
          {size !== 'sm' && (
            <p className="text-xs text-gray-500 mt-0.5">
              {achievement.description}
            </p>
          )}
          {isUnlocked && unlockedAt && size === 'lg' && (
            <p className="text-xs text-gray-400 mt-1">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
