import type { AIContext, CoachingResponse } from '../../../types';
import { callClaudeJSON } from './claudeClient';

/**
 * Generate personalized coaching message based on user's habits and journal
 */
export async function generateCoachingMessage(
  context: AIContext
): Promise<CoachingResponse> {
  // Build context summary
  const habitSummary = context.habits
    .map((h) => {
      const streak = context.streaks.find((s) => s.habitId === h.id);
      const recentCheckIns = context.recentCheckIns.filter(
        (c) => c.habitId === h.id && c.completed
      );
      const completionRate = recentCheckIns.length / 7; // Last 7 days

      return `- ${h.name} (${h.category}): ${streak?.currentStreak || 0} day streak, ${Math.round(completionRate * 100)}% completion rate`;
    })
    .join('\n');

  const journalSummary = context.recentJournalEntries
    .slice(0, 3)
    .map((entry) => {
      const sentiment = entry.sentiment
        ? `${entry.sentiment.label} (${entry.sentiment.themes?.join(', ') || 'no themes'})`
        : 'not analyzed';
      return `- ${entry.date}: ${sentiment}`;
    })
    .join('\n');

  const prompt = `You are a supportive and empathetic habit coach. Based on the user's recent data, generate a brief, encouraging message.

User's Habits:
${habitSummary || 'No habits tracked yet'}

Recent Journal Entries:
${journalSummary || 'No journal entries yet'}

Generate a coaching message that:
1. Acknowledges their progress or current situation
2. Provides a specific insight or observation about their patterns
3. Offers gentle motivation or a helpful suggestion
4. Keeps it under 100 words
5. Is warm, personal, and conversational

Return your response in this JSON format:
{
  "message": "<your coaching message>",
  "type": "<one of: motivation, insight, suggestion, celebration>",
  "relatedHabitIds": [<array of habit IDs if relevant, otherwise empty array>]
}

Message type guide:
- "motivation": Encouraging words to keep going
- "insight": Pattern observation or reflection
- "suggestion": Helpful tip or recommendation
- "celebration": Acknowledging a milestone or achievement

Return ONLY the JSON object, no additional text.`;

  try {
    const result = await callClaudeJSON<CoachingResponse>(prompt, {
      maxTokens: 512,
      temperature: 0.7, // Slightly higher for more creative coaching
    });

    // Validate the response
    if (!result.message || typeof result.message !== 'string') {
      throw new Error('Invalid message in coaching response');
    }

    if (
      !['motivation', 'insight', 'suggestion', 'celebration'].includes(result.type)
    ) {
      throw new Error('Invalid type in coaching response');
    }

    return result;
  } catch (error) {
    console.error('Coaching generation failed:', error);
    throw error;
  }
}

/**
 * Generate a motivational message for a specific habit milestone
 */
export async function generateMilestoneMessage(
  habitName: string,
  streakDays: number
): Promise<string> {
  const prompt = `Generate a brief, enthusiastic celebration message for someone who just reached a ${streakDays}-day streak on their "${habitName}" habit. Keep it under 50 words, warm and congratulatory. Return ONLY the message text, no JSON.`;

  try {
    const message = await callClaudeJSON<{ message: string }>(
      prompt,
      {
        maxTokens: 256,
        temperature: 0.8,
      }
    );

    return message.message || `Congratulations on your ${streakDays}-day streak!`;
  } catch (error) {
    console.error('Milestone message generation failed:', error);
    return `Amazing! ${streakDays} days of ${habitName}! Keep up the incredible work! 🎉`;
  }
}
