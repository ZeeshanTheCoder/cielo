'use server';

/**
 * @fileOverview Provides advanced sentiment analysis for mood journal entries.
 *
 * - advancedAnalyzeSentiment - Analyzes mood journal entries for pro users.
 * - AdvancedAnalyzeSentimentInput - The input type.
 * - AdvancedAnalyzeSentimentOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdvancedAnalyzeSentimentInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The mood journal entry to analyze for sentiment.'),
  language: z
    .string()
    .optional()
    .describe('The language for the analysis, e.g., "en" or "es".'),
});

export type AdvancedAnalyzeSentimentInput = z.infer<
  typeof AdvancedAnalyzeSentimentInputSchema
>;

const AdvancedAnalyzeSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The primary sentiment of the journal entry, e.g., positive, negative, or mixed.'
    ),
  score: z
    .number()
    .describe(
      'A numerical score from -1 (very negative) to 1 (very positive).'
    ),
  analysis: z
    .string()
    .describe('A detailed analysis of the underlying emotions and themes.'),
  keyEmotions: z
    .array(z.string())
    .describe('A list of key emotions detected in the entry.'),
  actionableAdvice: z
    .string()
    .describe(
      'A piece of constructive and compassionate advice based on the entry.'
    ),
});

export type AdvancedAnalyzeSentimentOutput = z.infer<
  typeof AdvancedAnalyzeSentimentOutputSchema
>;

export async function advancedAnalyzeSentiment(
  input: AdvancedAnalyzeSentimentInput
): Promise<AdvancedAnalyzeSentimentOutput> {
  return advancedAnalyzeSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'advancedAnalyzeSentimentPrompt',
  input: {schema: AdvancedAnalyzeSentimentInputSchema},
  output: {schema: AdvancedAnalyzeSentimentOutputSchema},
  prompt: `You are an AI with a high degree of emotional intelligence, acting as a compassionate guide. Analyze the following mood journal entry.

Journal Entry: {{{journalEntry}}}

Provide an advanced analysis that includes:
1.  The overall sentiment (e.g., positive, negative, mixed).
2.  A sentiment score from -1 to 1.
3.  A detailed analysis of the themes and underlying feelings.
4.  A list of 2-3 key emotions identified (e.g., "Frustration", "Hopeful", "Anxious").
5.  One piece of gentle, actionable advice or a reflective question to help the user navigate these feelings.

{{#if language}}
Provide the entire response in the following language: {{{language}}}.
{{/if}}

Respond in a structured JSON format.`,
});

const advancedAnalyzeSentimentFlow = ai.defineFlow(
  {
    name: 'advancedAnalyzeSentimentFlow',
    inputSchema: AdvancedAnalyzeSentimentInputSchema,
    outputSchema: AdvancedAnalyzeSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
