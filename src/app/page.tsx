import { getSettings } from "@/lib/settings";
import { LandingPage } from "@/components/landing/landing-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSettings();
  return <LandingPage settings={settings} />;
}
