import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://majstorns.vercel.app"),
  title: {
    default: "MajstoriNS — Direktorijum majstora u Novom Sadu",
    template: "%s | MajstoriNS",
  },
  description:
    "Pronađi proverenog majstora u Novom Sadu i okolini. Limari, stolari, vodoinstalateri, električari i još 15 zanata na jednom mestu — besplatno i bez logovanja.",
  verification: {
    google: "gfKMbhUR6D6keKCPYDy6UQMPKiD88glmfTqdgnsh-iI",
  },
  openGraph: {
    type: "website",
    locale: "sr_RS",
    siteName: "MajstoriNS",
    title: "MajstoriNS — Direktorijum majstora u Novom Sadu",
    description:
      "Pronađi proverenog majstora u Novom Sadu i okolini, brzo i besplatno.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-zinc-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
