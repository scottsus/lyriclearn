"use client";

import { useAuth } from "@clerk/nextjs";
import { getSongs } from "~/actions/songs";
import { songs } from "~/server/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

type Song = InferSelectModel<typeof songs>;

export default function SongsPage() {
  const { userId } = useAuth();
  if (!userId) {
    redirect("/sign-in");
  }

  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [artistFilter, setArtistFilter] = useState<string>("");

  const fetchSongs = async () => {
    await getSongs({ userId }).then((songs) => setSongs(songs));
  };

  useEffect(() => {
    fetchSongs();
  }, [userId]);

  useEffect(() => {
    const uniqueArtists = Array.from(new Set(songs.map((song) => song.artist)));
    setArtists(uniqueArtists);
  }, [songs]);

  useEffect(() => {
    if (artistFilter === "") {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(
        (song) => song.artist.toLowerCase() === artistFilter.toLowerCase(),
      );
      setFilteredSongs(filtered);
    }
  }, [artistFilter, songs]);

  const createSlug = (artist: string, title: string) => {
    return `${encodeURIComponent(artist)}-${encodeURIComponent(title)}`;
  };

  return (
    <main className="flex size-full flex-1 flex-col items-center justify-center gap-y-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Your Saved Songs
      </h1>

      {songs.length === 0 ? (
        <p className="text-gray-600">
          No songs found. Try generating some lyrics first!
        </p>
      ) : (
        <>
          <div className="mb-6">
            <label
              htmlFor="artistFilter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Filter by Artist:
            </label>
            <select
              id="artistFilter"
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Artists</option>
              {artists.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => (
              <Link
                href={`/songs/${createSlug(song.artist, song.track)}`}
                key={song.id}
                className="block"
              >
                <div className="overflow-hidden rounded-lg bg-white shadow transition-shadow duration-300 ease-in-out hover:shadow-md">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                      {song.track}
                    </h2>
                    <p className="text-gray-600">{song.artist}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Generated: {new Date(song.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
