import { motion } from 'framer-motion';
import { Frown, Meh, Smile, SmilePlus } from 'lucide-react';
import type { SentimentAnalysis } from '../../types';
import { SENTIMENT_COLORS, SENTIMENT_LABELS } from '../../utils/constants';

interface SentimentBadgeProps {
  sentiment: SentimentAnalysis;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function SentimentBadge({
  sentiment,
  size = 'md',
  showLabel = true,
}: SentimentBadgeProps) {
  const { label, score, confidence } = sentiment;

  const sizeClasses = {
    sm: { container: 'text-xs px-2 py-1', icon: 14 },
    md: { container: 'text-sm px-3 py-1.5', icon: 16 },
    lg: { container: 'text-base px-4 py-2', icon: 18 },
  };

  const getIcon = () => {
    if (score <= 2) return Frown;
    if (score === 3) return Meh;
    if (score === 4) return Smile;
    return SmilePlus;
  };

  const Icon = getIcon();
  const color = SENTIMENT_COLORS[label];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`inline-flex items-center space-x-1.5 rounded-full font-medium ${sizeClasses[size].container}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      <Icon size={sizeClasses[size].icon} />
      {showLabel && <span>{SENTIMENT_LABELS[label]}</span>}
      {confidence && confidence < 0.7 && (
        <span className="text-xs opacity-70">({Math.round(confidence * 100)}%)</span>
      )}
    </motion.div>
  );
}
