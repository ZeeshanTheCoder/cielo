'use server';

/**
 * @fileOverview Generates a personalized welcome email for new users.
 *
 * - generateWelcomeEmail - A function that crafts a welcome email.
 * - GenerateWelcomeEmailInput - The input type.
 * - GenerateWelcomeEmailOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWelcomeEmailInputSchema = z.object({
  username: z.string().describe('The name of the new user.'),
  language: z
    .string()
    .optional()
    .describe('The language for the email, e.g., "en" or "es".'),
});
export type GenerateWelcomeEmailInput = z.infer<
  typeof GenerateWelcomeEmailInputSchema
>;

const GenerateWelcomeEmailOutputSchema = z.object({
  subject: z.string().describe('The subject line for the welcome email.'),
  body: z
    .string()
    .describe(
      'The HTML body content for the welcome email. It should be warm, engaging, and introduce the user to the key features of the Cielo app.'
    ),
});
export type GenerateWelcomeEmailOutput = z.infer<
  typeof GenerateWelcomeEmailOutputSchema
>;

export async function generateWelcomeEmail(
  input: GenerateWelcomeEmailInput
): Promise<GenerateWelcomeEmailOutput> {
  return generateWelcomeEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWelcomeEmailPrompt',
  input: {schema: GenerateWelcomeEmailInputSchema},
  output: {schema: GenerateWelcomeEmailOutputSchema},
  prompt: `You are an AI for a mindfulness app called "Cielo". Your task is to generate a warm and welcoming email for a new user.

The user's name is {{{username}}}.

The email should:
1.  Have a friendly and inviting subject line.
2.  Personally greet the user by their name.
3.  Briefly introduce Cielo as a personal guide to mindfulness and self-discovery.
4.  Highlight 2-3 key features like the AI-powered Journal, Guided Meditations, and Soundscapes.
5.  Encourage them to explore the app.
6.  Be formatted in simple HTML for an email client. Use <p>, <strong>, and <a> tags where appropriate, but don't include <html> or <body> tags.

{{#if language}}
Write the email (subject and body) in the following language: {{{language}}}.
{{/if}}

Generate the response in a structured JSON format.`,
});

const generateWelcomeEmailFlow = ai.defineFlow(
  {
    name: 'generateWelcomeEmailFlow',
    inputSchema: GenerateWelcomeEmailInputSchema,
    outputSchema: GenerateWelcomeEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
