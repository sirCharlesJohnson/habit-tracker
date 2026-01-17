import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';
import type { Streak } from '../../types';
import { getNextMilestone, getProgressToMilestone } from '../../features/habits/utils/streakCalculator';

interface StreakDisplayProps {
  streak: Streak;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export default function StreakDisplay({
  streak,
  size = 'md',
  showProgress = false,
}: StreakDisplayProps) {
  const { currentStreak, longestStreak } = streak;
  const isActive = currentStreak > 0;

  const sizeClasses = {
    sm: { container: 'text-sm', icon: 16, number: 'text-lg' },
    md: { container: 'text-base', icon: 20, number: 'text-2xl' },
    lg: { container: 'text-lg', icon: 24, number: 'text-3xl' },
  };

  const nextMilestone = getNextMilestone(currentStreak);
  const progress = getProgressToMilestone(currentStreak);

  return (
    <div className={`${sizeClasses[size].container}`}>
      {/* Current Streak */}
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{
            scale: isActive ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isActive ? Infinity : 0,
            repeatDelay: 2,
          }}
        >
          <Flame
            size={sizeClasses[size].icon}
            className={isActive ? 'text-orange-500' : 'text-gray-400'}
          />
        </motion.div>
        <div>
          <div className="flex items-baseline space-x-1">
            <span className={`font-bold ${sizeClasses[size].number} ${isActive ? 'text-orange-600' : 'text-gray-600'}`}>
              {currentStreak}
            </span>
            <span className="text-gray-600">day{currentStreak !== 1 ? 's' : ''}</span>
          </div>
          {longestStreak > currentStreak && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <TrendingUp size={12} />
              <span>Best: {longestStreak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress to next milestone */}
      {showProgress && isActive && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Next milestone</span>
            <span className="font-medium">{nextMilestone} days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {nextMilestone - currentStreak} days to go
          </p>
        </div>
      )}
    </div>
  );
}
