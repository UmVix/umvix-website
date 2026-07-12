import type { Metadata, Viewport } from "next";
import { Comfortaa, Montserrat } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const brandFont = Comfortaa({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});

const headlineFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Umvix PostPilot",
  description: "Social media posting tracker and accountability dashboard.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/favicon-32.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PostPilot",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Applies the saved (or system) theme before first paint to avoid a flash. */
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("pp-theme");
    var dark = stored === "dark" || (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${brandFont.variable} ${headlineFont.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
