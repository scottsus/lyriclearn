import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="flex h-16 w-5/6 items-center justify-between border-b border-b-foreground/10">
      <Link
        href="/"
        className="text-m flex w-full max-w-4xl items-center justify-between p-3 font-bold"
      >
        Lyric Learn
      </Link>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
