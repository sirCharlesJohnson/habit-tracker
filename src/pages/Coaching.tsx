import { useState } from 'react';
import { Sparkles, AlertCircle, Clock } from 'lucide-react';
import { useHabitStore, useJournalStore, useCoachingStore } from '../store';
import { generateCoachingMessage } from '../features/ai/services/coachingService';
import type { CoachingMessage, AIContext } from '../types';
import CoachingCard from '../components/ai/CoachingCard';
import Button from '../components/common/Button';

export default function Coaching() {
  const { getActiveHabits, getCheckInsByHabitId, streaks } = useHabitStore();
  const { getRecentEntries } = useJournalStore();
  const {
    messages,
    addMessage,
    markAllAsRead,
    getUnreadMessages,
    canGenerateNew,
  } = useCoachingStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadMessages = getUnreadMessages();
  const hasApiKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY;

  const handleGenerateCoaching = async () => {
    setError(null);
    setIsGenerating(true);

    try {
      // Build AI context
      const habits = getActiveHabits();
      const recentCheckIns = habits
        .flatMap((h) => getCheckInsByHabitId(h.id))
        .filter((c) => {
          const checkInDate = new Date(c.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return checkInDate >= weekAgo;
        });

      const context: AIContext = {
        habits,
        recentCheckIns,
        recentJournalEntries: getRecentEntries(5),
        streaks: Array.from(streaks.values()),
      };

      // Check if user has enough data
      if (habits.length === 0 && context.recentJournalEntries.length === 0) {
        setError(
          'Start tracking habits or writing journal entries to receive personalized coaching!'
        );
        setIsGenerating(false);
        return;
      }

      // Generate coaching message
      const response = await generateCoachingMessage(context);

      // Create coaching message
      const message: CoachingMessage = {
        id: crypto.randomUUID(),
        type: response.type,
        content: response.message,
        relatedHabitIds: response.relatedHabitIds || [],
        createdAt: new Date().toISOString(),
        read: false,
      };

      addMessage(message);
    } catch (err) {
      console.error('Failed to generate coaching:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate coaching message. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = canGenerateNew();
  const timeUntilNext = !canGenerate ? '1 hour' : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles className="text-purple-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">AI Coaching</h1>
        </div>
        <p className="text-gray-600">
          Get personalized insights and motivation based on your habits and journal
        </p>
      </div>

      {/* API Key Warning */}
      {!hasApiKey && (
        <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-yellow-900 mb-1">
                API Key Required
              </p>
              <p className="text-sm text-yellow-800">
                To use AI coaching features, you need to add your Anthropic API key to the{' '}
                <code className="bg-yellow-100 px-1 rounded">.env</code> file.
                Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in the
                project root with: <code className="bg-yellow-100 px-1 rounded">VITE_ANTHROPIC_API_KEY=your-key-here</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button Section */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Request Personalized Coaching
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              AI will analyze your recent habits, streaks, and journal entries to provide
              personalized motivation and insights.
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGenerateCoaching}
              loading={isGenerating}
              disabled={!hasApiKey || !canGenerate}
            >
              <Sparkles size={18} className="mr-2" />
              {isGenerating ? 'Generating...' : 'Get Coaching'}
            </Button>

            {!canGenerate && timeUntilNext && (
              <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
                <Clock size={16} />
                <span>Next coaching available in {timeUntilNext}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {messages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Messages</p>
            <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Unread</p>
            <p className="text-2xl font-bold text-purple-600">
              {unreadMessages.length}
            </p>
          </div>
        </div>
      )}

      {/* Mark All Read Button */}
      {unreadMessages.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Coaching Messages */}
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <CoachingCard key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No coaching messages yet</p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {hasApiKey
              ? 'Click "Get Coaching" above to receive your first personalized message!'
              : 'Add your Anthropic API key to start receiving AI coaching.'}
          </p>
        </div>
      )}
    </div>
  );
}
