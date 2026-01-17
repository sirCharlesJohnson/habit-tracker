import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const getClient = () => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'VITE_ANTHROPIC_API_KEY is not set. Please add it to your .env file.'
    );
  }

  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // Note: For production, use a backend proxy
  });
};

/**
 * Call Claude API with a prompt and get a response
 */
export async function callClaude(
  prompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const client = getClient();

  const response = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: options?.maxTokens || 1024,
    temperature: options?.temperature || 1,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract text from response
  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Unexpected response format from Claude API');
}

/**
 * Call Claude API and parse JSON response
 */
export async function callClaudeJSON<T>(
  prompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<T> {
  const response = await callClaude(prompt, options);

  try {
    // Try to find JSON in the response (Claude might wrap it in markdown)
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;

    return JSON.parse(jsonString.trim()) as T;
  } catch (error) {
    console.error('Failed to parse JSON from Claude response:', response);
    throw new Error('Failed to parse AI response as JSON');
  }
}
