import type { Metadata, Viewport } from "next";
import { Inter, Hind_Siliguri, Baloo_2 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

// Self-hosted, subset + preloaded by Next.js — no render-blocking external CSS.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const hind = Hind_Siliguri({ subsets: ["bengali"], weight: ["400", "500", "600", "700"], variable: "--font-bangla", display: "swap" });
const baloo = Baloo_2({ subsets: ["latin"], weight: ["800"], variable: "--font-display", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "লোগো ডিজাইন প্রতিযোগিতা | রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউট",
    template: "%s | RGPI Logo Contest",
  },
  description:
    "রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউট, রাজশাহী (প্রতিষ্ঠিত ১৯৬৩) এর নতুন লোগো ডিজাইন প্রতিযোগিতা। থিম, নিয়ম, জমা দেওয়ার নির্দেশনা ও শেষ সময় দেখুন।",
  keywords: ["RGPI", "রাজশাহী পলিটেকনিক", "লোগো ডিজাইন প্রতিযোগিতা", "logo contest", "Rajshahi"],
  authors: [{ name: "Rajshahi Government Polytechnic Institute" }],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "RGPI Logo Design Contest",
    title: "লোগো ডিজাইন প্রতিযোগিতা | RGPI",
    description: "আমাদের নতুন পরিচয় তৈরি করুন — ১৯৬৩ সাল থেকে শিক্ষার আলো ছড়িয়ে দেওয়া প্রতিষ্ঠানের জন্য লোগো ডিজাইন করুন।",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "RGPI Logo Design Contest" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "লোগো ডিজাইন প্রতিযোগিতা | RGPI",
    description: "Rajshahi Government Polytechnic Institute — Logo Design Contest 2026",
    images: ["/api/og"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/contest-logo.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e5fdb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning className={`${inter.variable} ${hind.variable} ${baloo.variable}`}>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
