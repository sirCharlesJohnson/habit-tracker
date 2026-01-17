import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { ACHIEVEMENTS } from '../../utils/achievements';
import { useAchievementStore } from '../../store/achievementStore';
import AchievementBadge from './AchievementBadge';
import Card from '../common/Card';
import type { AchievementCategory } from '../../types';

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  streak: 'Streak Achievements',
  consistency: 'Consistency Achievements',
  variety: 'Variety Achievements',
  milestone: 'Milestone Achievements',
  special: 'Special Achievements',
};

const CATEGORY_ORDER: AchievementCategory[] = [
  'streak',
  'milestone',
  'variety',
  'special',
];

export default function AchievementsGrid() {
  const { unlockedAchievements, getUnlockedCount, getTotalCount } =
    useAchievementStore();

  const achievementsByCategory = useMemo(() => {
    const grouped = new Map<AchievementCategory, typeof ACHIEVEMENTS>();

    CATEGORY_ORDER.forEach((category) => {
      const categoryAchievements = ACHIEVEMENTS.filter(
        (a) => a.category === category
      );
      if (categoryAchievements.length > 0) {
        grouped.set(category, categoryAchievements);
      }
    });

    return grouped;
  }, []);

  const getUnlockInfo = (achievementId: string) => {
    return unlockedAchievements.find((a) => a.achievementId === achievementId);
  };

  const unlockedCount = getUnlockedCount();
  const totalCount = getTotalCount();
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
            <p className="text-gray-600">
              {unlockedCount} of {totalCount} unlocked ({progressPercent}%)
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Achievement Categories */}
      {Array.from(achievementsByCategory.entries()).map(
        ([category, achievements]) => (
          <Card key={category} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {achievements.map((achievement) => {
                const unlockInfo = getUnlockInfo(achievement.id);
                return (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={unlockInfo?.isUnlocked || false}
                    unlockedAt={unlockInfo?.unlockedAt}
                    size="md"
                  />
                );
              })}
            </div>
          </Card>
        )
      )}
    </div>
  );
}
