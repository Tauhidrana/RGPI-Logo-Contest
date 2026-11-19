import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { listPublishedSubmissions } from "@/lib/data";
import { GalleryPage } from "@/components/public/gallery-page";
export const revalidate = 300;
export const metadata: Metadata = { title: "লোগো গ্যালারি", description: "RGPI লোগো ডিজাইন প্রতিযোগিতার জমা দেওয়া লোগোসমূহ।" };
export default async function Page() {
  const [settings, submissions] = await Promise.all([getSettings(), listPublishedSubmissions()]);
  return <GalleryPage visible={settings.gallery_visible} submissions={submissions} />;
}
