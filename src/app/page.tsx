import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6">
      <h2 className="mb-4 text-2xl font-bold">Welcome to Lyric Learn</h2>
      <div className="flex flex-col gap-4">
        <Link
          href="/songs"
          className="rounded bg-blue-500 px-4 py-2 text-center font-bold text-white hover:bg-blue-600"
        >
          Go to Songs Page
        </Link>
        <Link
          href="/cards"
          className="rounded bg-green-500 px-4 py-2 text-center font-bold text-white hover:bg-green-600"
        >
          Go to Cards Page
        </Link>
      </div>
    </main>
  );
}
