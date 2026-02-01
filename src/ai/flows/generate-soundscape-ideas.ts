'use server';

/**
 * @fileOverview Generates ideas for ambient soundscapes.
 *
 * - generateSoundscapeIdeas - A function that generates a list of soundscape ideas.
 * - GenerateSoundscapeIdeasInput - The input type.
 * - GenerateSoundscapeIdeasOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSoundscapeIdeasInputSchema = z.object({
  count: z.number().describe('The number of soundscape ideas to generate.'),
  language: z
    .string()
    .optional()
    .describe('The language for the generated ideas, e.g., "en" or "es".'),
});

export type GenerateSoundscapeIdeasInput = z.infer<
  typeof GenerateSoundscapeIdeasInputSchema
>;

const SoundscapeIdeaSchema = z.object({
  title: z
    .string()
    .describe('The title of the soundscape, e.g., "Midnight Desert".'),
  description: z
    .string()
    .describe('A short, evocative description of the soundscape.'),
  imageHint: z
    .string()
    .describe(
      'Two keywords for finding a suitable image, e.g., "desert night".'
    ),
});

const GenerateSoundscapeIdeasOutputSchema = z.object({
  ideas: z.array(SoundscapeIdeaSchema),
});

export type GenerateSoundscapeIdeasOutput = z.infer<
  typeof GenerateSoundscapeIdeasOutputSchema
>;

export async function generateSoundscapeIdeas(
  input: GenerateSoundscapeIdeasInput
): Promise<GenerateSoundscapeIdeasOutput> {
  return generateSoundscapeIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSoundscapeIdeasPrompt',
  input: {schema: GenerateSoundscapeIdeasInputSchema},
  output: {schema: GenerateSoundscapeIdeasOutputSchema},
  prompt: `You are a creative AI that generates ideas for relaxing and immersive soundscapes.

Generate a list of {{{count}}} unique soundscape ideas.

For each idea, provide:
1. A creative and short title.
2. A one-sentence, evocative description.
3. Two keywords that could be used to find a suitable background image. These keywords must always be in English.

Do not repeat common ideas like 'Rainforest' or 'Ocean Waves'. Think of more unique environments like 'Subterranean Cave', 'Autumn Market', or 'Spaceship Bridge'.

{{#if language}}
Generate the title and description in the following language: {{{language}}}. The imageHint keywords must remain in English.
{{/if}}`,
});

const generateSoundscapeIdeasFlow = ai.defineFlow(
  {
    name: 'generateSoundscapeIdeasFlow',
    inputSchema: GenerateSoundscapeIdeasInputSchema,
    outputSchema: GenerateSoundscapeIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
