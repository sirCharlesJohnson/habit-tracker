import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';
import type { JournalEntry } from '../../types';
import { useJournalStore, useUIStore } from '../../store';
import { toast } from '../../store/toastStore';
import { getTodayString } from '../../utils/dateUtils';
import { analyzeSentiment } from '../../features/ai/services/sentimentService';
import Button from '../common/Button';

const journalSchema = z.object({
  content: z
    .string()
    .min(10, 'Entry must be at least 10 characters')
    .max(5000, 'Entry is too long'),
});

type JournalFormData = z.infer<typeof journalSchema>;

interface MoodInputProps {
  entry?: JournalEntry;
  onClose: () => void;
  onSave?: (entry: JournalEntry) => void;
  compact?: boolean;
}

export default function MoodInput({
  entry,
  onClose,
  onSave,
  compact = false,
}: MoodInputProps) {
  const { addEntry, updateEntry } = useJournalStore();
  const { setSentimentAnalyzing } = useUIStore();
  const isEditing = !!entry;
  const [charCount, setCharCount] = useState(entry?.content.length || 0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      content: entry?.content || '',
    },
  });

  // Watch content for character count
  const content = watch('content');
  useState(() => {
    setCharCount(content.length);
  });

  const onSubmit = async (data: JournalFormData) => {
    try {
      let savedEntry: JournalEntry;

      if (isEditing) {
        savedEntry = {
          ...entry,
          content: data.content,
          updatedAt: new Date().toISOString(),
        };
        updateEntry(entry.id, { content: data.content });
      } else {
        savedEntry = {
          id: crypto.randomUUID(),
          date: getTodayString(),
          content: data.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addEntry(savedEntry);
      }

      // Close the modal immediately so user can continue
      onClose();
      if (onSave) onSave(savedEntry);

      // Show success toast
      toast.success(isEditing ? 'Journal entry updated' : 'Journal entry saved');

      // Analyze sentiment in the background (only for new entries or if content changed)
      if (!isEditing || data.content !== entry.content) {
        setIsAnalyzing(true);
        setSentimentAnalyzing(true);

        try {
          const sentiment = await analyzeSentiment(data.content);

          // Update the entry with sentiment analysis
          updateEntry(savedEntry.id, {
            sentiment: {
              ...sentiment,
              analyzedAt: new Date().toISOString(),
            },
          });
          toast.info('Mood analyzed by AI');
        } catch (error) {
          console.error('Sentiment analysis failed:', error);
          toast.error('AI analysis failed, but entry is saved');
        } finally {
          setIsAnalyzing(false);
          setSentimentAnalyzing(false);
        }
      }
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {compact ? 'How are you feeling today?' : 'Journal Entry'}
        </label>
        <textarea
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={compact ? 4 : 8}
          placeholder="Write about your day, thoughts, feelings, goals..."
          {...register('content')}
          onChange={(e) => {
            register('content').onChange(e);
            handleContentChange(e);
          }}
        />
        <div className="flex justify-between mt-1">
          <div>
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {charCount} / 5000
          </p>
        </div>
      </div>

      {/* AI Analysis Info */}
      {!compact && !isEditing && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-900 mb-1">
                AI-Powered Insights
              </p>
              <p className="text-sm text-purple-800">
                Your entry will be analyzed by AI to understand your mood and extract key themes.
                This helps track your emotional patterns over time and provides personalized coaching.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting || isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : isEditing ? 'Update Entry' : 'Save Entry'}
        </Button>
      </div>
    </form>
  );
}
