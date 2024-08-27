"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function genFlashcards({ lyrics }: { lyrics: string }) {
  const flashcards = await generateObject({
    model: openai("gpt-4o-2024-08-06"),
    system: `
      You are making flashcards for music lovers who want to learn songs, all the while improving their language mastery.
      Given a snippet of song lyrics, split it into 2 arrays:
       1. the original song lyrics in small, flashcard-sized chunks, together with the hanyu pinyin, if it's in mandarin.
        1a. For example: "看孤独的风景 - Kàn gūdú de fēngjǐng"
        1b. Also, never use fan ti zi (traditional chinese). Always opt for (jian ti zi) simplified chinese.
        1c. For the hanyu pinyin, don't forget to include the intonation.
       2. a 1:1 mapping of the original song lyrics in step 1, but translated to english.
      
      We'll end up with 2 arrays of the same size so that we can generate flashcards from (1) to (2).
      (1): original
      (2): translated
      
      If the original song lyric was already in english, then (1) and (2) will be the same.
    `,
    schema: z.object({
      original: z.array(z.string()),
      translated: z.array(z.string()),
    }),
    prompt: lyrics,
  });

  return flashcards.object;
}
