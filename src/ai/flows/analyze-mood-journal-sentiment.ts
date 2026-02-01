'use server';

/**
 * @fileOverview Analyzes the sentiment of mood journal entries.
 *
 * - analyzeMoodJournalSentiment - Analyzes mood journal entries to identify sentiment.
 * - AnalyzeMoodJournalSentimentInput - The input type for the analyzeMoodJournalSentiment function.
 * - AnalyzeMoodJournalSentimentOutput - The return type for the analyzeMoodJournalSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMoodJournalSentimentInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The mood journal entry to analyze for sentiment.'),
  language: z
    .string()
    .optional()
    .describe('The language for the analysis, e.g., "en" or "es".'),
});

export type AnalyzeMoodJournalSentimentInput = z.infer<
  typeof AnalyzeMoodJournalSentimentInputSchema
>;

const AnalyzeMoodJournalSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the journal entry, e.g., positive, negative, or neutral.'
    ),
  score: z
    .number()
    .describe(
      'A numerical score indicating the strength and direction of the sentiment.'
    ),
  analysis: z
    .string()
    .describe('A more detailed analysis of the sentiment expressed.'),
});

export type AnalyzeMoodJournalSentimentOutput = z.infer<
  typeof AnalyzeMoodJournalSentimentOutputSchema
>;

export async function analyzeMoodJournalSentiment(
  input: AnalyzeMoodJournalSentimentInput
): Promise<AnalyzeMoodJournalSentimentOutput> {
  return analyzeMoodJournalSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMoodJournalSentimentPrompt',
  input: {schema: AnalyzeMoodJournalSentimentInputSchema},
  output: {schema: AnalyzeMoodJournalSentimentOutputSchema},
  prompt: `You are an AI sentiment analysis expert. Analyze the following mood journal entry and determine its sentiment, sentiment score, and provide a detailed analysis.

Journal Entry: {{{journalEntry}}}

{{#if language}}
Provide your analysis in the following language: {{{language}}}.
{{/if}}

Respond in JSON format:
{
  "sentiment": "(positive, negative, or neutral)",
  "score": (numerical score between -1 and 1),  //from very negative to very positive
  "analysis": "(detailed analysis of the sentiment expressed)"
}
`,
});

const analyzeMoodJournalSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeMoodJournalSentimentFlow',
    inputSchema: AnalyzeMoodJournalSentimentInputSchema,
    outputSchema: AnalyzeMoodJournalSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
