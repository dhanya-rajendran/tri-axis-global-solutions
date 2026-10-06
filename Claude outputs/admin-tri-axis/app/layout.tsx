import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = localFont({ src: "./fonts/inter-latin-wght-normal.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
const playfair = localFont({ src: "./fonts/playfair-display-latin-wght-normal.woff2", variable: "--font-playfair", weight: "400 900", display: "swap" });

export const metadata: Metadata = {
  title: { default: "TriAxis Admin", template: "%s · TriAxis Admin" },
  description: "Content management for the TriAxis Global Solutions website.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-dvh font-sans">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
