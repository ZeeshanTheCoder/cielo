'use server';

/**
 * @fileOverview Generates an AI-powered guided meditation with audio.
 *
 * - generateGuidedMeditation - A function that creates a meditation script and audio.
 * - GenerateGuidedMeditationInput - The input type for the generateGuidedMeditation function.
 * - GenerateGuidedMeditationOutput - The return type for the generateGuidedMeditation function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';
import wav from 'wav';

const GenerateGuidedMeditationInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic for the guided meditation, e.g., "Stress Relief".'),
  language: z
    .string()
    .optional()
    .describe('The language for the meditation script, e.g., "en" or "es".'),
});
export type GenerateGuidedMeditationInput = z.infer<
  typeof GenerateGuidedMeditationInputSchema
>;

const GenerateGuidedMeditationOutputSchema = z.object({
  title: z.string().describe('The title of the meditation.'),
  script: z.string().describe('The full script of the guided meditation.'),
  audioDataUri: z
    .string()
    .describe('The base64 encoded audio data URI for the meditation.'),
});
export type GenerateGuidedMeditationOutput = z.infer<
  typeof GenerateGuidedMeditationOutputSchema
>;

export async function generateGuidedMeditation(
  input: GenerateGuidedMeditationInput
): Promise<GenerateGuidedMeditationOutput> {
  return generateGuidedMeditationFlow(input);
}

const scriptGenerationPrompt = ai.definePrompt({
  name: 'generateMeditationScriptPrompt',
  input: {
    schema: z.object({
      topic: z.string(),
      language: z.string().optional(),
    }),
  },
  output: {
    schema: z.object({
      title: z.string().describe('A short, calming title for the meditation.'),
      script: z
        .string()
        .describe(
          'The full script of the guided meditation, about 2-3 paragraphs long.'
        ),
    }),
  },
  prompt: `You are a world-renowned meditation guide. Create a short, calming guided meditation script about '{{{topic}}}'.
  
  {{#if language}}
  Write the script and title in the following language: {{{language}}}.
  {{/if}}`,
});

const generateGuidedMeditationFlow = ai.defineFlow(
  {
    name: 'generateGuidedMeditationFlow',
    inputSchema: GenerateGuidedMeditationInputSchema,
    outputSchema: GenerateGuidedMeditationOutputSchema,
  },
  async ({topic, language}) => {
    const {output: scriptOutput} = await scriptGenerationPrompt({
      topic,
      language,
    });
    if (!scriptOutput) {
      throw new Error('Failed to generate meditation script.');
    }
    const {title, script} = scriptOutput;

    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: script,
    });

    if (!media) {
      throw new Error('Audio generation failed.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      title,
      script,
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
