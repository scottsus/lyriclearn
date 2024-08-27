CREATE TABLE IF NOT EXISTS "songs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"track" text NOT NULL,
	"artist" text NOT NULL,
	"full_lyrics" text NOT NULL,
	"chunked_lyrics" text[] DEFAULT '{}'::text[] NOT NULL,
	"chunked_translations" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "song_idx" ON "songs" USING btree ("id");