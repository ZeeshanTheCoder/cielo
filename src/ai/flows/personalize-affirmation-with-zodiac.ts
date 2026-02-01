'use server';

/**
 * @fileOverview Generates a personalized daily affirmation based on the user's zodiac sign.
 *
 * - personalizeAffirmationWithZodiac - A function that generates a personalized affirmation.
 * - PersonalizeAffirmationWithZodiacInput - The input type for the personalizeAffirmationWithZodiac function.
 * - PersonalizeAffirmationWithZodiacOutput - The return type for the personalizeAffirmationWithZodiac function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeAffirmationWithZodiacInputSchema = z.object({
  zodiacSign: z
    .string()
    .describe('The zodiac sign of the user, e.g., Aries, Taurus, Gemini.')
});
export type PersonalizeAffirmationWithZodiacInput = z.infer<typeof PersonalizeAffirmationWithZodiacInputSchema>;

const PersonalizeAffirmationWithZodiacOutputSchema = z.object({
  affirmation: z
    .string()
    .describe('A personalized daily affirmation based on the user\'s zodiac sign.'),
});
export type PersonalizeAffirmationWithZodiacOutput = z.infer<typeof PersonalizeAffirmationWithZodiacOutputSchema>;

export async function personalizeAffirmationWithZodiac(
  input: PersonalizeAffirmationWithZodiacInput
): Promise<PersonalizeAffirmationWithZodiacOutput> {
  return personalizeAffirmationWithZodiacFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeAffirmationWithZodiacPrompt',
  input: {schema: PersonalizeAffirmationWithZodiacInputSchema},
  output: {schema: PersonalizeAffirmationWithZodiacOutputSchema},
  prompt: `You are an AI that specializes in creating personalized daily affirmations based on zodiac signs.

  Generate a motivational and insightful affirmation for the zodiac sign: {{{zodiacSign}}}.`,
});

const personalizeAffirmationWithZodiacFlow = ai.defineFlow(
  {
    name: 'personalizeAffirmationWithZodiacFlow',
    inputSchema: PersonalizeAffirmationWithZodiacInputSchema,
    outputSchema: PersonalizeAffirmationWithZodiacOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
