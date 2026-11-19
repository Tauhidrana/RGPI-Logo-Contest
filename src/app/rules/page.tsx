import type { Metadata } from "next";
import { RuleBookPage } from "@/components/public/rule-book";
export const metadata: Metadata = {
  title: "নিয়মাবলি — লোগো ডিজাইন প্রতিযোগিতা",
  description: "RGPI লোগো ডিজাইন প্রতিযোগিতা ২০২৬-এর সম্পূর্ণ নিয়মাবলি: যোগ্যতা, থিম, লোগোর লেখা, ফাইল শর্ত, জমাদান, মূল্যায়ন ও মেধাস্বত্ব।",
};
export default function Page() { return <RuleBookPage />; }
