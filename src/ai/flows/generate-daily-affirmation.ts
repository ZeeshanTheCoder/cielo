'use server';

/**
 * @fileOverview Generates a unique daily affirmation using AI.
 *
 * - generateDailyAffirmation - A function that generates a daily affirmation.
 * - GenerateDailyAffirmationInput - The input type for the generateDailyAffirmation function.
 * - GenerateDailyAffirmationOutput - The return type for the generateDailyAffirmation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyAffirmationInputSchema = z.object({
  zodiacSign: z
    .string()
    .optional()
    .describe('Optional zodiac sign for personalized affirmation.'),
  birthdate: z
    .string()
    .optional()
    .describe(
      'Optional birthdate for personalized affirmation (ISO 8601 format).'
    ),
  language: z
    .string()
    .optional()
    .describe('The language for the affirmation, e.g., "en" or "es".'),
});
export type GenerateDailyAffirmationInput = z.infer<
  typeof GenerateDailyAffirmationInputSchema
>;

const GenerateDailyAffirmationOutputSchema = z.object({
  affirmation: z.string().describe('The generated daily affirmation.'),
});
export type GenerateDailyAffirmationOutput = z.infer<
  typeof GenerateDailyAffirmationOutputSchema
>;

export async function generateDailyAffirmation(
  input: GenerateDailyAffirmationInput
): Promise<GenerateDailyAffirmationOutput> {
  return generateDailyAffirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyAffirmationPrompt',
  input: {schema: GenerateDailyAffirmationInputSchema},
  output: {schema: GenerateDailyAffirmationOutputSchema},
  prompt: `You are an AI that generates daily affirmations. The affirmation should be motivational and disciplined.

  {{#if zodiacSign}}
  Personalize the affirmation for the zodiac sign: {{zodiacSign}}.
  {{/if}}
  {{#if birthdate}}
  Further personalize it considering the user's birthdate: {{birthdate}}.
  {{/if}}
  {{#if language}}
  Respond in the following language: {{language}}.
  {{/if}}
  `,
});

const generateDailyAffirmationFlow = ai.defineFlow(
  {
    name: 'generateDailyAffirmationFlow',
    inputSchema: GenerateDailyAffirmationInputSchema,
    outputSchema: GenerateDailyAffirmationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
