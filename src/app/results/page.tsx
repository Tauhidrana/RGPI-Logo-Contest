import type { Metadata } from "next";
import { getResults } from "@/lib/data";
import { ResultsPage } from "@/components/public/results-page";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ফলাফল", description: "RGPI লোগো ডিজাইন প্রতিযোগিতার ফলাফল।" };
export default async function Page() {
  const results = await getResults();
  return <ResultsPage results={results as never} />;
}
