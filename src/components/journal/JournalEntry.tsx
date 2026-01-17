import { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { JournalEntry as JournalEntryType } from '../../types';
import { useJournalStore, useUIStore } from '../../store';
import { formatDate } from '../../utils/dateUtils';
import Card from '../common/Card';
import SentimentBadge from './SentimentBadge';

interface JournalEntryProps {
  entry: JournalEntryType;
}

export default function JournalEntry({ entry }: JournalEntryProps) {
  const { deleteEntry } = useJournalStore();
  const { openJournalModal } = useUIStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEdit = () => {
    openJournalModal(entry.id);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      deleteEntry(entry.id);
    }
  };

  const contentPreview = entry.content.slice(0, 150);
  const needsExpansion = entry.content.length > 150;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {formatDate(entry.date)}
            </h3>
            {entry.sentiment && <SentimentBadge sentiment={entry.sentiment} />}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(entry.createdAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            aria-label="Edit entry"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete entry"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {isExpanded ? entry.content : contentPreview}
          {needsExpansion && !isExpanded && '...'}
        </p>

        {needsExpansion && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} />
                <span>Show less</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>Read more</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Sentiment Themes */}
      {entry.sentiment?.themes && entry.sentiment.themes.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Key themes:</p>
          <div className="flex flex-wrap gap-2">
            {entry.sentiment.themes.map((theme, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
