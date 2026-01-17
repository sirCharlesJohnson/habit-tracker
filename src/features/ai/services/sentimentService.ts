import type { SentimentAnalysisResponse } from '../../../types';
import { callClaudeJSON } from './claudeClient';

/**
 * Analyze the sentiment of a journal entry using Claude AI
 */
export async function analyzeSentiment(text: string): Promise<SentimentAnalysisResponse> {
  const prompt = `Analyze the emotional tone and sentiment of this journal entry.

Journal Entry:
"${text}"

Please provide your analysis in the following JSON format:
{
  "score": <number between 1-5, where 1 is very negative and 5 is very positive>,
  "label": "<one of: very-negative, negative, neutral, positive, very-positive>",
  "confidence": <number between 0-1 indicating confidence in the analysis>,
  "themes": [<array of 2-3 key themes or topics mentioned in the entry>]
}

Guidelines:
- Score 1 (very-negative): Expressions of deep distress, hopelessness, severe anxiety
- Score 2 (negative): Frustration, sadness, disappointment, mild anxiety
- Score 3 (neutral): Balanced, matter-of-fact, mixed emotions
- Score 4 (positive): Contentment, happiness, accomplishment, optimism
- Score 5 (very-positive): Joy, excitement, gratitude, peak experiences

- Themes should be concise (1-3 words each) and capture the main topics
- Confidence should reflect how clear the emotional tone is (1.0 = very clear, 0.5 = ambiguous)

Return ONLY the JSON object, no additional text.`;

  try {
    const result = await callClaudeJSON<SentimentAnalysisResponse>(prompt, {
      maxTokens: 512,
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    // Validate the response
    if (
      typeof result.score !== 'number' ||
      result.score < 1 ||
      result.score > 5
    ) {
      throw new Error('Invalid score in sentiment analysis response');
    }

    if (
      !['very-negative', 'negative', 'neutral', 'positive', 'very-positive'].includes(
        result.label
      )
    ) {
      throw new Error('Invalid label in sentiment analysis response');
    }

    return result;
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    throw error;
  }
}

/**
 * Get a quick fallback sentiment for offline/error cases
 */
export function getFallbackSentiment(): SentimentAnalysisResponse {
  return {
    score: 3,
    label: 'neutral',
    confidence: 0,
    themes: [],
  };
}
