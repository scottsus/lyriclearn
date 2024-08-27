// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const songs = pgTable(
  "songs",
  {
    id: serial("id").notNull().primaryKey(),
    userId: text("user_id").notNull(),
    track: text("track").notNull(),
    artist: text("artist").notNull(),
    fullLyrics: text("full_lyrics").notNull(),
    chunkedLyrics: text("chunked_lyrics")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    chunkedTranslations: text("chunked_translations")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (song) => ({
    idIndex: index("song_idx").on(song.id),
  }),
);
