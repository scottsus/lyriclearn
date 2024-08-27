"use server";

import { db } from "~/server/db";
import { songs } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function getSongs({ userId }: { userId: string }) {
  const res = await db.select().from(songs).where(eq(songs.userId, userId));

  return res;
}

export async function getSong({
  userId,
  track,
  artist,
}: {
  userId: string;
  track: string;
  artist: string;
}) {
  const [res] = await db
    .select()
    .from(songs)
    .where(
      and(
        eq(songs.userId, userId),
        eq(songs.track, track),
        eq(songs.artist, artist),
      ),
    );

  return res;
}

export async function storeSong({
  userId,
  track,
  artist,
  lyrics,
}: {
  userId: string;
  track: string;
  artist: string;
  lyrics?: string;
}) {
  await db.insert(songs).values({
    userId,
    track,
    artist,
    fullLyrics: lyrics ?? "",
  });
}

export async function storeFlashcards({
  userId,
  track,
  artist,
  lyrics,
  chunkedLyrics,
  chunkedTranslations,
}: {
  userId: string;
  track: string;
  artist: string;
  lyrics: string;
  chunkedLyrics: string[];
  chunkedTranslations: string[];
}) {
  await db
    .update(songs)
    .set({
      fullLyrics: lyrics,
      chunkedLyrics,
      chunkedTranslations,
    })
    .where(
      and(
        eq(songs.userId, userId),
        eq(songs.track, track),
        eq(songs.artist, artist),
      ),
    );
}
