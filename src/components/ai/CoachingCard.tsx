import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, Trophy, X } from 'lucide-react';
import type { CoachingMessage } from '../../types';
import { useCoachingStore } from '../../store';
import Card from '../common/Card';
import { formatDate } from '../../utils/dateUtils';

interface CoachingCardProps {
  message: CoachingMessage;
  showActions?: boolean;
}

export default function CoachingCard({
  message,
  showActions = true,
}: CoachingCardProps) {
  const { markAsRead, deleteMessage } = useCoachingStore();

  const handleMarkRead = () => {
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const handleDelete = () => {
    if (confirm('Delete this coaching message?')) {
      deleteMessage(message.id);
    }
  };

  // Get icon based on message type
  const getIcon = () => {
    switch (message.type) {
      case 'celebration':
        return Trophy;
      case 'insight':
        return Lightbulb;
      case 'suggestion':
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  // Get color scheme based on message type
  const getColorScheme = () => {
    switch (message.type) {
      case 'celebration':
        return {
          bg: 'from-yellow-50 to-orange-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800',
        };
      case 'insight':
        return {
          bg: 'from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800',
        };
      case 'suggestion':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          badge: 'bg-green-100 text-green-800',
        };
      default:
        return {
          bg: 'from-purple-50 to-pink-50',
          border: 'border-purple-200',
          icon: 'text-purple-600',
          badge: 'bg-purple-100 text-purple-800',
        };
    }
  };

  const Icon = getIcon();
  const colors = getColorScheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card
        className={`relative overflow-hidden bg-gradient-to-br ${colors.bg} border-2 ${colors.border} ${
          !message.read ? 'shadow-md' : ''
        }`}
        onClick={handleMarkRead}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg bg-white shadow-sm ${colors.icon}`}
              >
                <Icon size={24} />
              </div>
              <div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}
                >
                  {message.type}
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  {formatDate(message.createdAt.split('T')[0])}
                </p>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-2">
                {!message.read && (
                  <div className="w-2 h-2 bg-primary-600 rounded-full" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  aria-label="Delete message"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Message Content */}
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Decorative Element */}
          <div className="absolute bottom-0 right-0 opacity-10">
            <Icon size={120} strokeWidth={1} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
