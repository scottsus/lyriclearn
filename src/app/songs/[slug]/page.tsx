import { auth } from "@clerk/nextjs/server";
import { getSong } from "~/actions/songs";
import { notFound, redirect } from "next/navigation";

import Flashcard from "./flashcard";

export default async function SongLyricsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const decodedSlug = decodeURIComponent(params.slug);
  const [artist, ...titleParts] = decodedSlug.split("-");
  const track = titleParts.join("-");

  const song = await getSong({ userId, track, artist: artist! });
  if (!song) {
    notFound();
  }

  return (
    <main className="flex size-full flex-1 flex-col items-center justify-center gap-y-10">
      <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">{song.track}</h1>
          <h2 className="mt-1 text-xl text-gray-600">by {song.artist}</h2>
        </div>
      </div>

      {song.chunkedLyrics && song.chunkedTranslations ? (
        <Flashcard
          lyrics={song.chunkedLyrics}
          translations={song.chunkedTranslations}
        />
      ) : (
        <p className="italic text-gray-600">
          Flashcards not available for this song.
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Full Lyrics
          </h3>
          {song.fullLyrics ? (
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-800">
              {song.fullLyrics}
            </pre>
          ) : (
            <p className="italic text-gray-600">No lyrics available yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
