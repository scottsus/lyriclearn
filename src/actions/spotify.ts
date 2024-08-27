"use server";

import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const api = SpotifyApi.withClientCredentials(
  process.env.SPOTIFY_CLIENT_ID ?? "id",
  process.env.SPOTIFY_CLIENT_SECRET ?? "secret",
);

export type SpotifyTrack = {
  trackName: string;
  artistName: string;
  album: string;
  popularity: number;
  thumbnail: string;
};

/**
 * Search for a catalog of songs
 * @param query Uses (track, artist) info
 */
export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  const items = await api.search(query, ["track", "artist"]);
  const matchingResults = items.tracks?.items
    .filter((track) =>
      track.artists.some((artist) =>
        items.artists?.items.some(
          (searchArtist) => searchArtist.id === artist.id,
        ),
      ),
    )
    .map((track) => ({
      trackName: track.name,
      artistName: track.artists[0]?.name ?? "name",
      album: track.album.name,
      popularity: track.popularity,
      thumbnail: track.album.images[0]?.url ?? "",
    }));

  return matchingResults;
}
