"use client";

import { useAuth } from "@clerk/nextjs";
import { storeSong } from "~/actions/songs";
import { searchTracks, SpotifyTrack } from "~/actions/spotify";
import { Input } from "~/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SongsPage() {
  const router = useRouter();
  const { userId } = useAuth();
  if (!userId) {
    redirect("/sign-in");
  }

  const [songCards, setSongCards] = useState<SpotifyTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInserting, setIsInserting] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const tracks = await searchTracks(searchQuery);
      setSongCards(tracks);
    }
  };

  const handleCardClick = async (track: string, artist: string) => {
    try {
      setIsInserting(true);
      await storeSong({ userId, track, artist });
    } catch (err) {
      toast.error(`Unable to store song: ${err}`);
    } finally {
      setIsInserting(false);
    }

    router.push(
      `/lyrics?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(
        track,
      )}`,
    );
  };

  return (
    <main className="flex size-full flex-1 flex-col items-center justify-center gap-y-10">
      <form onSubmit={handleSearch} className="flex w-1/2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for songs"
          className="flex-1 rounded-l-md border px-6 py-3 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-spotify-green rounded-r-md px-6 py-2 text-white transition-all hover:brightness-125"
        >
          Search
        </button>
      </form>

      {songCards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {songCards.map((card, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-center rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
              onClick={() => handleCardClick(card.artistName, card.trackName)}
            >
              <Image
                src={card.thumbnail}
                width={50}
                height={50}
                alt="thumbnail"
                className="mr-4 rounded-sm"
              />
              <div>
                <p className="font-semibold">{card.trackName}</p>
                <p className="text-gray-600">{card.artistName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isInserting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-md bg-white p-4">
            <p className="text-lg font-semibold">Saving song...</p>
          </div>
        </div>
      )}

      <Link
        href="/"
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
      >
        Back to Home
      </Link>
    </main>
  );
}
