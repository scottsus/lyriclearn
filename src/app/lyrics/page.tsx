"use client";

import { useAuth } from "@clerk/nextjs";
import { genFlashcards } from "~/actions/flashcards";
import { getLyrics } from "~/actions/lyrics";
import { getSong, storeFlashcards } from "~/actions/songs";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LyricsPage() {
  const { userId } = useAuth();
  if (!userId) {
    redirect("/sign-in");
  }

  const params = useSearchParams();
  const artist = params.get("artist") as string;
  const track = params.get("track") as string;

  const [lyrics, setLyrics] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getLyricsWithRetry = async () => {
    try {
      setIsLoading(true);

      let lyrics = "";
      const song = await getSong({ userId, artist, track });
      if (song && song.fullLyrics) {
        lyrics = song.fullLyrics;
      } else {
        const fetched = await getLyrics({ artist, track });
        if (!fetched) {
          toast.error("Unable to fetch lyrics for this song");
          return;
        }
        lyrics = fetched;
      }

      setLyrics(lyrics);
    } catch (err) {
      toast.error("Unable to get lyrics for this song.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateFlashcards = async (lyrics: string) => {
    const flashcards = await genFlashcards({
      lyrics,
    });
    if (!flashcards) {
      throw new Error("Unable to generate flashcards.");
    }

    await storeFlashcards({
      userId,
      track,
      artist,
      lyrics,
      chunkedLyrics: flashcards.original,
      chunkedTranslations: flashcards.translated,
    });
  };

  useEffect(() => {
    getLyricsWithRetry();
  }, [params]);

  useEffect(() => {
    generateFlashcards(lyrics);
  }, [lyrics]);

  return (
    <main className="flex size-full flex-1 flex-col items-center justify-center gap-y-10">
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-xl font-semibold text-gray-700">
            Loading lyrics...
          </div>
        </div>
      ) : lyrics ? (
        <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-3xl font-semibold text-gray-900">{track}</h2>
          <h3 className="text-xl text-gray-700">by {artist}</h3>
          <div className="border-t border-gray-200 pt-4">
            <p className="whitespace-pre-wrap text-gray-700">{lyrics}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            No Lyrics Found
          </h2>
          <p className="text-gray-700">
            Please go to the Songs page to search for a song and its lyrics.
          </p>
          <Link
            href="/songs"
            className="inline-block rounded-md bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
          >
            Go to Songs
          </Link>
        </div>
      )}

      <div className="flex items-center gap-x-8 text-xl">
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          Home
        </Link>
        <Link href="/songs" className="text-blue-500 hover:text-blue-600">
          Songs
        </Link>
      </div>
    </main>
  );
}
