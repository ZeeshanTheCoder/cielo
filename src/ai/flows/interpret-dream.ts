'use server';

/**
 * @fileOverview Interprets the meaning of dreams using AI.
 *
 * - interpretDream - A function that analyzes a dream description.
 * - InterpretDreamInput - The input type for the interpretDream function.
 * - InterpretDreamOutput - The return type for the interpretDream function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretDreamInputSchema = z.object({
  dreamDescription: z
    .string()
    .describe('A description of the dream to be interpreted.'),
  language: z
    .string()
    .optional()
    .describe('The language for the interpretation, e.g., "en" or "es".'),
});
export type InterpretDreamInput = z.infer<typeof InterpretDreamInputSchema>;

const InterpretDreamOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'A detailed interpretation of the dream, including its themes and potential meanings.'
    ),
  sentiment: z
    .string()
    .describe(
      'The overall sentiment or emotional tone of the dream (e.g., "Joyful", "Anxious", "Confusing").'
    ),
  symbols: z
    .array(
      z.object({
        symbol: z.string().describe('A key symbol identified in the dream.'),
        meaning: z
          .string()
          .describe('The potential meaning or interpretation of that symbol.'),
      })
    )
    .describe(
      'An array of key symbols found in the dream and their meanings.'
    ),
});
export type InterpretDreamOutput = z.infer<typeof InterpretDreamOutputSchema>;

export async function interpretDream(
  input: InterpretDreamInput
): Promise<InterpretDreamOutput> {
  return interpretDreamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretDreamPrompt',
  input: {schema: InterpretDreamInputSchema},
  output: {schema: InterpretDreamOutputSchema},
  prompt: `You are an expert dream analyst with a deep understanding of symbolism, psychology, and common dream archetypes. A user has submitted a dream for interpretation.

Analyze the following dream description:
"{{{dreamDescription}}}"

Provide a thoughtful and insightful interpretation. Your analysis should:
1.  Identify the overall sentiment or emotional tone of the dream.
2.  Identify key symbols and objects in the dream and explain their potential meanings in the context of the dream.
3.  Provide a comprehensive analysis of what the dream might signify for the dreamer.

{{#if language}}
Provide the entire response in the following language: {{{language}}}.
{{/if}}

Respond in a structured JSON format.`,
});

const interpretDreamFlow = ai.defineFlow(
  {
    name: 'interpretDreamFlow',
    inputSchema: InterpretDreamInputSchema,
    outputSchema: InterpretDreamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
