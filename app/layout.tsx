import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://majstorns.vercel.app"),
  title: {
    default: "MajstorNS — Direktorijum majstora u Novom Sadu",
    template: "%s | MajstorNS",
  },
  description:
    "Pronađi proverenog majstora u Novom Sadu i okolini. Limari, stolari, vodoinstalateri, električari i još 15 zanata na jednom mestu — besplatno i bez logovanja.",
  openGraph: {
    type: "website",
    locale: "sr_RS",
    siteName: "MajstorNS",
    title: "MajstorNS — Direktorijum majstora u Novom Sadu",
    description:
      "Pronađi proverenog majstora u Novom Sadu i okolini, brzo i besplatno.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
