'use server';

/**
 * @fileOverview Generates an AI-powered ambient soundscape.
 *
 * - generateSoundscape - A function that creates a soundscape script and audio.
 * - GenerateSoundscapeInput - The input type for the generateSoundscape function.
 * - GenerateSoundscapeOutput - The return type for the generateSoundscape function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';
import wav from 'wav';

const GenerateSoundscapeInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic for the soundscape, e.g., "Rainforest".'),
  language: z
    .string()
    .optional()
    .describe(
      'The language for the soundscape title and description, e.g., "en" or "es".'
    ),
});
export type GenerateSoundscapeInput = z.infer<
  typeof GenerateSoundscapeInputSchema
>;

const GenerateSoundscapeOutputSchema = z.object({
  title: z.string().describe('The title of the soundscape.'),
  script: z.string().describe('The full script of the soundscape audio.'),
  audioDataUri: z
    .string()
    .describe('The base64 encoded audio data URI for the soundscape.'),
});
export type GenerateSoundscapeOutput = z.infer<
  typeof GenerateSoundscapeOutputSchema
>;

export async function generateSoundscape(
  input: GenerateSoundscapeInput
): Promise<GenerateSoundscapeOutput> {
  return generateSoundscapeFlow(input);
}

const scriptGenerationPrompt = ai.definePrompt({
  name: 'generateSoundscapeScriptPrompt',
  input: {
    schema: z.object({
      topic: z.string(),
      language: z.string().optional(),
    }),
  },
  output: {
    schema: z.object({
      title: z.string().describe('A short, evocative title for the soundscape.'),
      script: z
        .string()
        .describe(
          'A short, immersive audio script describing the ambient sounds of the topic. Focus on creating a tranquil atmosphere. Use descriptive language of the sounds themselves.'
        ),
    }),
  },
  prompt: `You are an expert sound designer. Create a short, immersive audio script describing the ambient sounds of a '{{{topic}}}'. Focus on creating a tranquil and relaxing atmosphere. The script should only describe sounds, as if setting a scene. For example: 'Gentle waves lapping against the shore. A distant seagull calls. A soft sea breeze whispers.'

  {{#if language}}
  Write the title and script in the following language: {{{language}}}.
  {{/if}}`,
});

const generateSoundscapeFlow = ai.defineFlow(
  {
    name: 'generateSoundscapeFlow',
    inputSchema: GenerateSoundscapeInputSchema,
    outputSchema: GenerateSoundscapeOutputSchema,
  },
  async ({topic, language}) => {
    const {output: scriptOutput} = await scriptGenerationPrompt({
      topic,
      language,
    });
    if (!scriptOutput) {
      throw new Error('Failed to generate soundscape script.');
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
