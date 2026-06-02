import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heb ik straks nog werk?",
  description: "AI-exposure en robotiseringsrisico van jouw beroep",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="w-full mt-auto bg-gray-100 p-4">
          <nav className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <a href="/over-deze-tool" className="hover:underline">Over deze tool</a>
            <a href="/artikelen-en-inzichten" className="hover:underline">Artikelen en inzichten</a>
            <a href="/veelgestelde-vragen" className="hover:underline">Veelgestelde vragen</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/privacybeleid" className="hover:underline">Privacybeleid</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
