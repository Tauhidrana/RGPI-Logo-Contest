import { getSettings } from "@/lib/settings";
import { LandingPage } from "@/components/landing/landing-page";

export const revalidate = 300;

export default async function Home() {
  const settings = await getSettings();
  return <LandingPage settings={settings} />;
}
