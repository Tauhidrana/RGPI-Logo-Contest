import type { Metadata } from "next";
import { TrackPage } from "@/components/public/track-page";
export const metadata: Metadata = { title: "স্থিতি দেখুন", description: "আপনার RGPI লোগো সাবমিশনের স্থিতি দেখুন।" };
export default function Page() { return <TrackPage />; }
