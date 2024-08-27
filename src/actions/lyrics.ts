"use server";

const MUSIXMATCH_API_KEY = process.env.MUSIXMATCH_API_KEY ?? "";
const BASE_URL = "https://api.musixmatch.com/ws/1.1/";

interface MusixmatchResponse {
  message: {
    header: {
      status_code: number;
    };
    body: {
      lyrics?: {
        lyrics_body: string;
      };
    };
  };
}

export async function getLyrics({
  artist,
  track,
}: {
  artist: string;
  track: string;
}): Promise<string> {
  try {
    const url = `${BASE_URL}matcher.lyrics.get?apikey=${MUSIXMATCH_API_KEY}&q_artist=${artist}&q_track=${track}&format=json`;
    const res = await fetch(url);
    const data: MusixmatchResponse = await res.json();

    if (data.message.header.status_code !== 200) {
      throw new Error("Non-200 status code");
    }
    if (!data.message.body.lyrics) {
      throw new Error("No lyrics obtained");
    }

    return data.message.body.lyrics.lyrics_body;
  } catch (err) {
    console.error(`getLyrics: ${err}`);
    return "Something went wrong while fetching lyrics.";
  }
}
