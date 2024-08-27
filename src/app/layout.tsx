import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Footer } from "~/components/footer";
import { Navbar } from "~/components/navbar";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Lyric Learn",
  description: "Learn languages through lyrics.",
  icons: [{ rel: "icon", url: "/github.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <Toaster position="top-center" />
        <body className="flex min-h-screen w-full flex-col items-center">
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
