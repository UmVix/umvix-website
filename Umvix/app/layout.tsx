import type { Metadata } from "next";
import { Comfortaa, Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import { createMetadata } from "@/lib/metadata";
import "./globals.css";

/** Closest web match to the rounded geometric logo wordmark */
const brandFont = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand",
  display: "swap",
});

const headlineFont = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-headline",
  display: "swap",
});

export const metadata: Metadata = createMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${brandFont.variable} ${headlineFont.variable}`}>
      <body
        className={`${brandFont.className} min-h-screen bg-brand-black text-brand-white antialiased`}
      >
        <SiteChrome>
          <Navbar />
          <main className="pt-[var(--nav-height)]">{children}</main>
          <Footer />
        </SiteChrome>
      </body>
    </html>
  );
}
