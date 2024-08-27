import Link from "next/link";

export function Footer() {
  return (
    <footer className="mb-0 mt-auto flex w-full justify-center border-t border-t-foreground/10 p-8">
      <p className="text-center text-xs">
        Built by{" "}
        <Link
          href="https://wilsonlimsetiawan.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          WilsonLimSet
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.github.com/scottsus/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          @scottsus
        </Link>
      </p>
    </footer>
  );
}
