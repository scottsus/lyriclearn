import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex size-full flex-1 flex-col items-center justify-center gap-y-6">
      <SignIn />
    </main>
  );
}
