'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-daily-affirmation.ts';
import '@/ai/flows/analyze-mood-journal-sentiment.ts';
import '@/ai/flows/personalize-affirmation-with-zodiac.ts';
import '@/ai/flows/generate-guided-meditation.ts';
import '@/ai/flows/generate-soundscape.ts';
import '@/ai/flows/interpret-dream.ts';
import '@/ai/flows/advanced-analyze-sentiment.ts';
import '@/ai/flows/generate-soundscape-ideas.ts';
import '@/ai/flows/generate-welcome-email.ts';
