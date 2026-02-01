# Cielo

A **Next.js + Firebase + Genkit** application delivering a wellness experience with AI-generated affirmations, journaling, meditations, and soundscapes.

## Features

- 🔐 **User auth and profiles** powered by Firebase Auth and Firestore.
- 🌅 **AI-generated affirmations, mood analysis, and dream interpretation** via Genkit flows.
- 🎧 **Guided meditations + soundscapes** with audio output using Genkit.
- 🔐 **Firestore rules** enforcing user data isolation and security.

## Tech Stack

- **Next.js 15 / React 19 (App Router)**
- **Firebase Auth + Firestore**
- **Genkit with OpenAI**
- **Tailwind CSS + shadcn/ui**

## Getting Started

```bash
npm install
npm run dev         # Start Next.js dev server
npm run genkit:dev  # Start Genkit flows server
